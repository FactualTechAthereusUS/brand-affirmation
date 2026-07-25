## Scope

Sections already revamped and functional: `/admin` home, `/analytics/*`, `/live`, `/patients`, `/orders`, `/leads`, `/messages`, `/check-ins`, `/physician-queue`, `/integrations`, `/settings/*`.

Remaining routes still on the old palette / non-functional buttons:

1. `/admin/command` — Command Center
2. `/admin/payments` — Payments
3. `/admin/pharmacy` — Pharmacy health
4. `/admin/reports` — Reports
5. `/admin/team` — Team (currently hardcoded, disconnected from Settings > Team)

Also small polish: audit that shared components (`KpiCard`, `SectionTitle`, `PipelineStrip`, `PharmacyHealthCard`, `TaskCenter`, `ActivityFeed`) use only the new admin tokens (no `text-ever`/`text-check`/`text-honey` from the old palette that don't match the current scope).

## Design language (locked)

Match existing revamped screens exactly:
- Surfaces: white cards `border-ink/8`, `rounded-2xl`, `shadow-[0_1px_0_rgba(23,23,23,0.02)]`
- Accents: indigo primary, violet secondary, sky info, emerald success, amber warn, rose danger
- Density: Shopify-grade tables with 11px uppercase `tracking-[0.12em]` headers, tabular-nums, hover row highlight
- Motion: framer `initial/animate` with 0.25s stagger; SaveBar / drawer patterns from settings
- No icon background circles anywhere
- Full-width layout (no max-w cap) consistent with `AdminShell`

## 1. `/admin/command` — Command Center

Rebuild as the "everything at a glance" op console.

Top row (sticky, transparent over gradient wash):
- Live system pill (all systems / degraded — driven by `pharmacies[].apiHealth` + failed-payment rate)
- Time-window switcher (Today / 7d / 30d) — reuses analytics window store
- Quick actions: Refresh seed, Export daily CSV, Announce banner

KPI strip (6 cards, real data): today's revenue, new patients, orders shipped, cases in queue, refills due, failed payments — each with delta vs yesterday from `funnelDays`.

Two-column body:
- Left (2/3): live pipeline waterfall (existing), physician queue strip, pharmacy health mini-cards, activity feed
- Right (1/3): critical alerts list, tasks (with real check/complete via `adminActions.toggleTask`), quick-jump nav

Wire buttons: "Resolve" on alert → `adminActions.dismissAlert`; task checkbox → `toggleTask`; "Refresh" → `adminActions.reseed`.

## 2. `/admin/payments`

Currently a flat table. Rebuild as Stripe-style payments workspace.

Header: 4 KPI cards (Gross volume, Net volume, Failed, Refunded) with sparklines from `paymentsHealth` selector; window switcher.

Filters bar: status pills (All / Succeeded / Failed / Refunded / Disputed), method filter (Card / Klarna / Affirm), search by patient or charge id, date range, CSV export.

Table (dense, sortable): charge id · patient · program · amount · method (with brand icon, no bg) · status pill · risk score · date · row action ↗.

Right drawer on row click (already scaffolded via `ui.paymentDrawerId`):
- Charge header (amount, status, timeline)
- Actions that actually run: **Refund full**, **Refund partial** (amount input), **Retry charge** (for failed), **Send receipt**, **Mark as fraud**
- Patient mini-card + link to `/admin/patients/$id`
- Related order link
- Timeline of events (created, auth, capture, refund) from payment state
- Copy charge id, copy receipt URL

New store actions: `refundPayment(id, amount?)`, `retryPayment(id)`, `sendReceipt(id)`, `flagPaymentFraud(id)` — each toasts + appends to `auditLog`.

Failed payments recovery panel below the table: list of failed with one-click Retry / Email patient / Update card link.

## 3. `/admin/pharmacy`

Elevate from health cards + basic table to full fulfillment ops view.

Top: window switcher + Sync all (calls `syncIntegration` on connected pharmacy integrations).

Grid: enriched `PharmacyHealthCard` per pharmacy — API status dot, queue depth, avg prep time (hrs), on-time %, current SLA breach count, mini spark of last 14 days throughput, "Route more here" / "Pause routing" buttons that flip the Settings routing rules.

Section: **Live throughput** — stacked area of orders/day per pharmacy (last 30d) using existing `AreaChart`.

Section: **SLA breaches** — table of orders past expected ship date, jump to `/admin/orders/$id`.

Section: **Recent fulfillment** — existing recent-orders table but with the revamped Shopify-style row treatment and per-pharmacy filter chips.

New actions: `pausePharmacyRouting(id)`, `resumePharmacyRouting(id)`, `bumpPharmacyPriority(id)` — mutate `settings.routing.rules`.

## 4. `/admin/reports`

Repurpose as saved-reports + ad-hoc export hub (the analytics deep-dive already lives in `/analytics/*`).

Header: window switcher + "New report" button (opens dialog to name + pick metrics; persists to `state.reports`).

Sections:
- **Executive summary** — Revenue by program bars (existing, retinted to indigo/violet gradient), MRR movement, acquisition mix donut, cohort retention grid — all sourced from live selectors, not the demo array.
- **Scheduled reports** — table with name, cadence, recipients, last run, next run; row actions: Run now, Edit, Pause, Delete. Wired to new `runReport`, `pauseReport`, `deleteReport` actions.
- **Export center** — one-click CSV export buttons: Patients, Orders, Payments, Leads, Physician cases, Check-ins, Audit log. Uses existing `csv.ts`.
- **Traffic patterns** — heatmap + time-of-day (retinted).

## 5. `/admin/team`

Currently disconnected demo. Rewire to read/write `settings.team` (already in store from settings work).

- Header actions: Invite member (dialog: email + role) → `inviteTeamMember`; Enforce 2FA toggle; Session timeout.
- Active members table: avatar mono, name, email, role dropdown (change role → `updateTeamMemberRole`), status pill, last login, row menu (Suspend / Remove / Resend invite for invited).
- Pending invites section with Copy link / Resend / Revoke.
- Audit trail excerpt filtered to team actions with "View full audit log" link to Settings > Compliance.

## Store additions

Append to `src/lib/admin/store.ts` `adminActions` (all toast + push `auditLog`):

```
refundPayment(id, amount?)   retryPayment(id)   sendReceipt(id)   flagPaymentFraud(id)
pausePharmacyRouting(id)     resumePharmacyRouting(id)   bumpPharmacyPriority(id)
createReport(cfg)   runReport(id)   pauseReport(id)   deleteReport(id)
```

Add `state.reports: SavedReport[]` with a small seed of 3 canned reports (Weekly revenue, Monthly cohort, Physician SLA).

## Palette sweep

Grep for leftover old tokens (`text-ever`, `text-check`, `text-honey`, `bg-honey`, `border-ever`) inside admin routes and shared admin components; replace with the new admin-scope tokens (indigo / emerald / amber). This keeps color congruence across screens.

## Files touched

- Rewrite: `src/routes/admin.command.tsx`, `admin.payments.tsx`, `admin.pharmacy.tsx`, `admin.reports.tsx`, `admin.team.tsx`
- Update: `src/lib/admin/store.ts` (new types + actions + seeds), `src/components/admin/PharmacyHealthCard.tsx`, `src/components/admin/TaskCenter.tsx`, `src/components/admin/ActivityFeed.tsx` for palette + wired buttons
- New: `src/components/admin/payments/PaymentDrawer.tsx`, `src/components/admin/reports/ReportDialog.tsx`

## Verification

- `tsgo` clean
- Click every new button in preview → toast fires, state changes visible on reload (localStorage persistence)
- Grep confirms no `__l5e/` and no old palette tokens remain in admin scope
- Responsive check at 1746px (current), 1280px, 768px

## Out of scope

- No backend / Supabase wiring (all persistence stays in localStorage via existing store)
- No new brand assets
- Does not touch already-revamped routes except palette-sweep on shared components