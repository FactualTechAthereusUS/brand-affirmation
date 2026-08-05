# PharmaBro platform portals and brand onboarding

## Goal

Turn the existing Blissley admin demo into a coherent multi-tenant telehealth platform demo with three connected operational surfaces:

```text
Blissley operator provisions and manages brands
                 ↓
Brand admin completes setup and launches
                 ↓
Patients flow through the existing tenant admin
                 ↓
Pharmacy staff fulfill routed prescriptions
```

This milestone will use realistic seeded demo data and durable browser persistence. It will not add database migrations, external credentials, real emails, DNS calls, Stripe OAuth, or production authentication. Every visible action will still perform a complete, inspectable demo state transition rather than showing a dead control.

## What exists and what changes

- Preserve the completed `/admin` screens and the existing tenant-aware color system.
- Preserve `/admin/pharmacy` as the **brand-side pharmacy network overview**; `/pharmacy/*` will be a separate fulfillment portal for pharmacy staff.
- Replace the current seven-item zero-state checklist and manual “Mark done” behavior with the specified six-step onboarding state machine.
- Extend the long-press logo sheet beyond brand/scenario/role switching so it can launch exact PharmaBro platform demos.
- Add the currently missing `/operator/*` and `/pharmacy/*` route families.
- Use one shared platform demo model so operator decisions, onboarding progress, tenant status, routing, pharmacy fulfillment, and demo switching remain synchronized.

## 1. Shared platform demo model

Create a focused platform store, separate from the already-large clinical admin store, with persisted seeded data for:

- Brands: identity, slug, domain, status (`onboarding`, `active`, `suspended`), platform fee, admin email, go-live date, patient/MRR/revenue totals.
- Six onboarding checks: identity, domain, Stripe, four prices, compliance, launch.
- Integrations: Stripe Connect, Meta Pixel, PerfectRx; masked credential previews and connection status.
- Cross-brand activity, alerts, monthly revenue by brand, operator metrics.
- Pharmacy orders: brand, assigned pharmacy, Rx-only clinical fields, retry metadata, tracking, carrier and timestamps.
- State-to-pharmacy routing rules.
- Physician network profiles, licenses, activity and approval metrics.
- Operator and pharmacy demo sessions.

State transitions will be centralized and validated:

- `create brand` creates an onboarding tenant and records a simulated invite event.
- `suspend` blocks new-intake eligibility in the demo but leaves subscriptions/orders intact.
- `go live` validates all six requirements and returns specific missing-item errors.
- `retry failed order` clears the error and makes it immediately eligible for processing.
- `processing → shipped` requires tracking; `shipped → delivered` stamps dates and cannot move backward.
- Pharmacy users only receive orders matching their seeded pharmacy code.
- Physician deactivation prevents new claims but does not alter existing assigned cases.

Existing Blissley, Nova Health and ZeroCo variants will be normalized into this shared model without deleting the existing admin demo data.

## 2. Operator portal

Build a neutral Blissley internal shell: compact Shopify-inspired sidebar, restrained cards/tables, responsive drawer navigation, global account menu and no tenant-specific color theme.

### `/operator/login`

- Email/password form, loading state, incorrect-credentials state and successful redirect.
- Dedicated seeded operator account behavior; no Google SSO.
- Session gate for operator routes and sign-out.

### `/operator` and `/operator/dashboard`

- `/operator` is canonical; `/operator/dashboard` redirects to it.
- Greeting/date, six KPI cards, brand health table and attention-only alert panel.
- View, suspend and conditional Go Live row actions.
- Healthy alert empty state when the selected demo has no actionable issues.

### `/operator/brands`

- Status tabs, search, responsive full table and empty results state.
- New Brand slide-over with exactly: name, admin email, editable auto-slug and fee defaulting to 3.0%.
- Validated creation, simulated invite, success toast, and immediate appearance in operator/admin demo selectors.
- Row actions for view, suspend/reactivate and conditional go-live.

### `/operator/brands/$id`

- Header with identity, status/domain and inline editing for name, domain and fee.
- Six-row onboarding checklist with progress and real Fix links into the matching admin onboarding step.
- Go Live enabled only when all checks pass; disabled state explains what is missing.
- 30-day stats, integration controls with masked values, and last-ten-event timeline.

### `/operator/revenue`

- Four summary cards and per-brand financial table.
- Responsive 12-month stacked bar chart using brand colors.
- Pointer/keyboard tooltip shows month total plus each brand’s gross volume and platform fee.

### `/operator/pharmacy/orders`

- All Orders and Routing Rules tabs.
- Functional status/pharmacy/brand/date filters.
- Failed rows expose the error and Retry updates the row immediately.
- Inline state routing edits, dirty-state tracking, Save per row and Save All.
- Unrouted states receive a clear warning and are reflected in operator alerts.

### `/operator/physicians`

- Four network metrics, searchable responsive table and state chips.
- Active toggle with required deactivation confirmation.
- License slide-over with US-state multi-select, save/cancel behavior and validation.
- View Profile panel with workload and current-license detail.

## 3. Brand-admin onboarding

Create a dedicated full-page route family at `/admin/onboarding/$step` while retaining the normal admin shell. During onboarding, the sidebar Setup block expands into a clickable mini-checklist with completion markers and persists until launch.

First login for an onboarding tenant redirects from `/admin` to its first incomplete step. Users may revisit earlier steps, leave, and resume. Existing active tenants still land on the normal dashboard.

### Step 1 — Brand identity

- Name, 60-character tagline, required PNG/SVG logo selection with size/type validation, primary color and accent color.
- Live phone preview updates immediately with logo, name, header and CTA styling.
- Save persists the draft and advances only when required fields pass.

### Step 2 — Intake domain

- Locked `https://` prefix, DNS instruction card and copy action.
- Demo verification states: idle, checking, verified and not-propagated.
- Skip records an explicit skipped state; the user can continue, but launch remains blocked until verified.

### Step 3 — Stripe Connect

- Plain-language fee explanation and one prominent connect action.
- Demo OAuth transition with loading, success/account preview, failure/retry and disconnect confirmation.
- Cannot advance until connected.

### Step 4 — Pricing plans

- Four locked plan cards in a responsive grid.
- `price_…` validation on blur with empty, checking, verified and invalid states.
- All four verified IDs are required before advancing.

### Step 5 — Compliance

- The three latest required acknowledgements from the supplied spec.
- Optional business-registration upload state.
- Confirmed acknowledgements become read-only and timestamped in the demo.

### Step 6 — Review and launch

- One concise review block with identity, swatches, domain, Stripe, all four plans and compliance.
- Every incomplete item has a Fix link to its step.
- Launch performs a second centralized validation, shows specific failures, then changes the tenant to active.
- Success state includes restrained celebratory motion, live intake URL, copy action and dashboard CTA.

The old manual “Mark done” buttons and mismatched seven-step labels will be removed.

## 4. Pharmacy fulfillment portal

Build a separate, speed-focused Blissley internal shell with minimal navigation: Orders, Account, pharmacy identity and sign out. Never apply an individual brand’s theme and never reveal patient name, address, DOB or unrelated admin data.

### `/pharmacy/login`

- Email/password, wrong-credentials and wrong-role branches.
- Seeded pharmacy-user session redirects to `/pharmacy/orders`.

### `/pharmacy/orders`

- Always-visible pending/processing/shipped-today/failed stats.
- Pending, Processing, Shipped, Delivered and Failed tabs with correct default sorting.
- Responsive table-to-list adaptation on small screens.
- Row actions execute status transitions without blocking row navigation.
- Empty state per tab.

### `/pharmacy/orders/$id`

- Desktop two-column and mobile single-column detail.
- Rx-only panel: molecule, formulation, dose, volume, supply, computed syringe count, sig, 503A statement, state, allergies and received timestamp.
- Status stepper and state-specific action card.
- Shipment form requires tracking, auto-detects carrier with manual override, and defaults ship date to today.
- Failed state shows the worker error and supports resubmission to Processing.

### `/pharmacy/me`

- Read-only identity/pharmacy code, functional demo password change, success/error states and sign out.

## 5. Long-press demo controls

Reorganize the existing logo sheet into clear sections without removing current brand, scenario or role controls:

- **Brand workspaces:** Blissley live, Nova ramping, ZeroCo onboarding.
- **PharmaBro demos:** Operator overview, new-brand creation, onboarding start, onboarding partially complete, launch-ready, suspended brand.
- **Pharmacy demos:** SouthEnd pending queue, processing/shipment workflow, failed-order recovery.
- **Existing portals:** Patient and physician shortcuts remain.

Selecting a demo applies an atomic preset and navigates to the correct route, so labels, metrics, buttons and downstream pages all agree. The sheet will work with mouse long-press, touch long-press, keyboard access and direct click from the existing role chip.

## 6. UI quality and responsiveness

- Match the existing admin’s semantic tokens, typography, table density and analytics polish; use the attached Shopify references for hierarchy and onboarding composition, not as embedded images.
- Focused onboarding pages use a stable centered work area, contextual left checklist and live preview where specified.
- Tables keep essential actions visible, scroll safely on medium screens and become readable stacked rows on phones.
- Drawers, confirmations, tooltips, menus, copy buttons, loading states, toasts, disabled reasons and empty/error states are implemented—not decorative.
- Motion stays subtle and respects reduced-motion settings.
- Charts have stable dimensions, legends, accessible focus targets and precise hover/focus tooltips.

## 7. Verification

- Validate every new route directly and through its parent navigation.
- Exercise the full operator → onboarding → launch flow and confirm state synchronization in all three surfaces.
- Exercise pending → processing → shipped → delivered and failed → retry → processing pharmacy paths.
- Verify create/suspend/reactivate/go-live, routing edits, physician activation/licenses, copy actions, uploads, price validation and login error states.
- Check desktop, tablet and mobile layouts; confirm no overlap, blank charts or inaccessible off-screen actions.
- Check browser console/runtime errors and route metadata for every new content route.
- Run the project’s existing targeted checks and the local-asset enforcement script; do not introduce external image URLs.

## Technical boundaries

- Demo persistence remains browser-local for this milestone; no Lovable Cloud/schema work.
- “Send invite,” DNS verification, Stripe connection/price validation and password changes are visibly simulated stateful workflows, not claims of live external integration.
- Existing `/admin` business modules are not redesigned again except where Setup/onboarding and shared tenant state must connect.
- No Shopify integration is enabled: “Shopify for telehealth” is the product/design analogy, not a physical-goods storefront.