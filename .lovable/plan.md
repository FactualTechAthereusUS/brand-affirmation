# /admin/settings — full end-to-end revamp (MVP1)

Turn the current single-file `/admin/settings` (5 dead tabs, no persistence beyond profile name) into a real Shopify-parity settings surface: 9 sub-pages under a shared settings shell, each with working forms, state-backed toggles, and telehealth-specific logic. All demo — persisted via existing `useAdmin` localStorage store — no backend calls.

## What's broken today

- `src/routes/admin.settings.tsx` renders 5 in-page tabs; the Integrations tab is a stale mini-list that duplicates `/admin/integrations`.
- No routes for General / Plan & Billing / Pharmacy Routing / States / Notifications / Compliance / Legal.
- Zero persistence: inputs are `defaultValue`, toggles don't exist, "Save" buttons don't exist. Reset Demo Data is the only working action.
- No settings sidebar. No section-level save state, no toasts, no validation.

## Route structure

Sibling routes under `/admin/settings/*` matching existing index/detail pattern:

```
src/routes/
  admin.settings.tsx              -> layout (settings sub-shell with left nav + <Outlet />)
  admin.settings.index.tsx        -> redirects to /admin/settings/general
  admin.settings.general.tsx
  admin.settings.plan-billing.tsx
  admin.settings.team.tsx
  admin.settings.pharmacy-routing.tsx
  admin.settings.states.tsx
  admin.settings.notifications.tsx
  admin.settings.integrations.tsx  -> summary + link to /admin/integrations marketplace
  admin.settings.compliance.tsx
  admin.settings.legal.tsx
```

The current `admin.settings.tsx` becomes the layout. Its "Integrations" mini-tab is deleted (real one lives at `/admin/integrations`; the settings integrations page becomes a status-summary view that links out).

## Store additions (`src/lib/admin/store.ts`)

Extend `AdminState` with a single `settings` slice + `auditLog` slice:

```ts
settings: {
  business: { legalName, dba, ein, businessType, registeredState, address1, city, state, zip };
  contact:  { supportEmail, transactionalEmail, supportPhone, website, portalUrl };
  brand:    { logoUrl?, primaryColor };
  stripe:   { accountId, connectedAt, mode, chargeModel: "manual"|"immediate", payoutSchedule, payoutBankLast4 };
  pricing:  { sema: {m1,mOngoing,q3,q6}, tirze: {...}, upsells: {priorityReview, shippingInsurance} };
  team:     { members: TeamMember[], require2FA: boolean, sessionTimeoutHours: number, pendingInvites: Invite[] };
  routing:  { rules: RoutingRule[], pharmacies: PharmacyContact[], versionAEnforced: boolean };
  states:   { served: Record<StateCode, {enabled, primary, backup}>, waitlistList, autoNotify, waitlistCounts };
  notifications: { alerts: Record<AlertKey, boolean>, emailRecipients: string[], smsRecipient, digest: {daily, dailyTime, weekly, weeklyDay, weeklyTime, items} };
  compliance: { baa: BAARecord[], legitScript: {status, since, renewal}, licenseExpiryAlerts: boolean };
  legal:    { docs: {terms, privacy, consent, hipaa, cancellation} with updatedAt, entity: {...} };
}
auditLog: AuditEntry[]   // { ts, actor, action, targetType, targetId, meta }
```

New actions (all append to `auditLog` and toast):
`updateSettings(section, patch)`, `inviteTeamMember(email, role)`, `removeTeamMember(id)`, `updateTeamMemberRole(id, role)`, `setRoutingRule(product, slot, pharmacyId)`, `toggleState(code, enabled)`, `bulkSetStates(map)`, `toggleAlert(key)`, `addAlertEmail(email)`, `removeAlertEmail(email)`, `updateDigest(patch)`, `uploadBAA(vendor, file)`, `exportAuditCsv(range)`, `updatePricing(patch)`.

`normalizeSettings()` seeds defaults on hydrate so existing localStorage doesn't crash.

## Settings sub-shell (`admin.settings.tsx`)

Two-column layout inside the existing `AdminShell`:
- **Left rail (220px, sticky):** 9 nav items with Link + `useRouterState` active highlighting, matching existing sidebar style (ink-on-hover, active = ink bg + white text). Groups: *Account* (General, Plan & Billing, Team) · *Operations* (Pharmacy Routing, States Served, Notifications, Integrations) · *Compliance* (Compliance & HIPAA, Legal & Policies).
- **Right pane:** `<Outlet />` renders the active page. Each page has its own page header (title + description) — layout doesn't render it.

Shared primitives in `src/components/admin/settings/`:
- `SettingsPage.tsx` — title/description header + children.
- `SettingsCard.tsx` — sectioned card with label, optional right-side action, footer save row.
- `Field.tsx` — labeled input/select/textarea with error state.
- `Toggle.tsx` — persistent switch bound to store.
- `SaveBar.tsx` — sticky bottom bar that appears when a form is dirty ("Unsaved changes · Discard · Save"). Uses local dirty state + shallow diff against store.
- `StatusPill` reused from AdminShell.

## Page-by-page build

### 1. General (`admin.settings.general.tsx`)
Three cards: Business, Contact, Brand. All bound to `settings.business/contact/brand`. Brand color uses `<input type="color">` + hex text input synced. Logo: file input → data-URL preview stored in `brand.logoUrl` (demo — no real upload). Each card has its own dirty state + Save button; global SaveBar when any dirty.

### 2. Plan & Billing (`admin.settings.plan-billing.tsx`)
- **Infrastructure costs** card (read-only): Stripe fees, Klaviyo, hosting, total — derived from `useAdmin` selectors.
- **Stripe** card: account id, connected date, mode pill, charge model select (manual/immediate — persisted), Stripe Healthcare + LegitScript badges (read-only ✅), payout schedule select, payout bank display, "View Stripe dashboard" (external link, opens `#`).
- **Pricing** card: Sema + Tirze pricing grids + upsells. Edit-in-place with inline number inputs. Save button + confirmation dialog "Applies to new orders only". Persists to `settings.pricing` and updates any `/sales` / plan derived reads via existing selectors.

### 3. Team (`admin.settings.team.tsx`)
- Members table (Name / Email / Role / Last Login / Status / Actions). Actions: Edit role (dropdown), Remove (confirm dialog). Owner row shows "Cannot be removed" tooltip and disabled actions.
- Roles + Permissions reference block (static content matching spec — Owner/Support/Ops/Physician).
- Invite panel: email + role select → `inviteTeamMember` appends to `pendingInvites`, shown in a small "Pending invites" list with "expires in 72h" countdown + Cancel button.
- Auth settings card: Require 2FA toggle, Session timeout select (1h/4h/8h/24h).
- Seed 4 members (Anmol Owner + 3 support/ops) via seeds.

### 4. Pharmacy Routing (`admin.settings.pharmacy-routing.tsx`)
- **Routing rules** section: 4 product rows (Sema injectable, Tirze injectable, Oral GLP-1, ED/Peptides). Each row has Primary + Backup selects populated from `routing.pharmacies`. Product IDs & state-coverage counts shown as read-only meta. Changing a select calls `setRoutingRule` and toasts.
- **Pharmacy contacts** grid: 5 pharmacy cards (South End, WellsRx, Epiq, Valiant, Strive) with contact + email + status + notes (e.g. Dr Telx 4-physician warning callout).
- **South End Version A** card: description of Version A vs B rule, big "Version A enforced ✅" toggle (`routing.versionAEnforced`). If toggled off, banner: "Rx builder will allow non-compliant vials — not recommended". Confirmed-by display line.

### 5. States Served (`admin.settings.states.tsx`)
- Summary strip: Served / Not serving / Waitlist active.
- 50-state grid (5 cols desktop, 2 cols mobile): each cell shows state code + name + toggle + pharmacy coverage badges (SE ✓ / WR ✓). Bulk actions bar: Select all / None / Toggle selected. Save writes to store.
- Waitlist card: Klaviyo list select, auto-notify toggle, per-state waitlist counts table with "Notify all" buttons (calls `notifyWaitlist(state)` → toast, appends audit entry).
- Seed 36 enabled states matching spec.

### 6. Notifications (`admin.settings.notifications.tsx`)
- **Admin alerts** card with 4 grouped checkbox sections (Clinical / Operations / Financial / Growth). Each checkbox = a `settings.notifications.alerts[key]` toggle.
- **Alert delivery** card: email recipients list (add/remove chips), SMS recipient input, urgent-alert definition note.
- **Digest** card: daily toggle + time select, weekly toggle + day + time select, digest items checklist.
- All persist immediately; small "Saved" indicator per toggle.

### 7. Integrations (`admin.settings.integrations.tsx`)
Not a duplicate marketplace. A **health summary** page:
- Summary strip: Connected count · Degraded · Down · Not connected (derived from existing `integrations` store).
- Critical infra list (Stripe, LifeFile, Dr Telx, Klaviyo, Mercury) — status pill + last-sync + [Manage →] link to `/admin/integrations/$id`.
- Analytics list (Meta Ads, Meta Pixel/CAPI, GA4) — same shape.
- "Manage all integrations" CTA → `/admin/integrations`.

### 8. Compliance & HIPAA (`admin.settings.compliance.tsx`)
- HIPAA status card: 7 checklist items (encryption at rest/transit, audit logging, session timeout, PHI in URLs/emails, breach SOP). Each is a read-only status row.
- BAA table: vendor / status pill / type / date / actions ("Upload new BAA" opens file input → adds entry). South End highlighted as Website TOS (amber) with note.
- LegitScript card: status + since + renewal + [View certificate →].
- **Audit log** card: filter row (date range picker, user select, action type select), scrollable log table pulling `auditLog` (already appended by every mutating action across settings). "Export CSV" uses existing `csv.ts`.
- Physician license monitoring table (read-only, derived from seeds) with expiring-soon amber badges + toggle for 60-day alerts.

### 9. Legal & Policies (`admin.settings.legal.tsx`)
- Platform documents card: 5 rows (Terms / Privacy / Consent / HIPAA Notice / Cancellation) with url + last-updated + [View] [Edit] (Edit opens a modal with a textarea bound to store — demo).
- Patient consent records card: description + [Export CSV] (generates demo rows from patients store).
- Pending legal items card: OpenLoop chargeback callout (amber) with status + [View documentation].
- Entity information card: legal entity, formation state, EIN, registered agent, DBA filings, bank.

## Cross-cutting UX

- Every mutating action → `sonner` toast + audit log append.
- SaveBar pattern: bottom-sticky, appears on dirty, disables when invalid, disappears on save/discard.
- All pages get their own `head()` meta (title = "<Section> · Settings — Blissley HQ", `robots: noindex,nofollow`).
- Responsive: settings left rail becomes a horizontal scroll strip on `<lg`, page cards go single-column, tables become stacked cards on mobile.
- Framer Motion: fade + 4px slide-up on page enter; SaveBar slide-up-from-bottom.
- Danger zone (reset demo data) moves to a small section at the bottom of General → replaced with a dedicated "Danger" card also visible on General page.

## Acceptance

- `/admin/settings` → redirects to `/admin/settings/general`; left rail visible; 9 links navigate cleanly (no full reload, active highlight follows).
- Edit business name in General → SaveBar appears → Save → toast + audit entry in Compliance audit log.
- Team: invite `foo@blissley.com` as Support → appears in Pending invites; Cancel removes it. Change a member's role → persists across reload.
- Pharmacy routing: change Sema primary to Strive → routing.rules updates + audit entry.
- States: turn off California → summary count decrements; waitlist counts still shown; reload persists.
- Notifications: uncheck "Physician queue >12h" → persists; add second alert email → chip appears.
- Compliance: upload demo BAA for WellsRx → row updates; export audit CSV downloads a real file with recent settings actions.
- Legal: edit Terms body via modal → last-updated bumps; export consent records CSV works.
- Integrations settings page mirrors real status from `/admin/integrations` store (no divergence).
- Mobile: everything readable, forms usable, left rail collapses to a horizontal chip strip.

## Files touched

- `src/lib/admin/store.ts` — add `settings` + `auditLog` slices, ~15 new actions, normalizer.
- `src/lib/admin/seeds.ts` — seed business/contact/brand/stripe/pricing defaults, 4 team members, 5 pharmacies, 36 served states, 5 BAAs, 5 legal docs.
- `src/routes/admin.settings.tsx` — rewrite as sub-shell (left nav + Outlet).
- `src/routes/admin.settings.index.tsx` — new (redirect to /general).
- 9 new page route files under `src/routes/admin.settings.*.tsx`.
- `src/components/admin/settings/` — new folder: `SettingsPage.tsx`, `SettingsCard.tsx`, `Field.tsx`, `Toggle.tsx`, `SaveBar.tsx`, `StatesGrid.tsx`, `RoutingRuleRow.tsx`, `BaaTable.tsx`, `AuditLogTable.tsx`, `PricingEditor.tsx`, `TeamTable.tsx`, `InvitePanel.tsx`.
- Reuses `AdminShell`, `StatusPill`, existing `csv.ts`, sonner Toaster.

No backend, no real API calls. Fully persistent via existing localStorage store. Colors follow the current admin indigo/violet + emerald/amber/coral semantic palette — no new tokens.
