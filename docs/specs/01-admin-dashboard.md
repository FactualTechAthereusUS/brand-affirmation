# Blissley Admin Panel — Product Specification

Scope: everything under `/admin/*` (`src/routes/admin.*.tsx`), the shared chrome in
`src/components/admin/AdminShell.tsx`, and the client-side data layer in
`src/lib/admin/store.ts`, `selectors.ts`, `cro.ts`, `analytics.ts`.

**Architectural note (read first):** the entire admin panel is a demo/prototype product.
There is no backend. All data lives in a single Zustand-style store
(`src/lib/admin/store.ts`) that is seeded from `src/lib/admin/seeds.ts`, persisted to
`localStorage`, and mutated only by client-side `adminActions.*` calls. "API calls,"
"webhooks," "Stripe," "South End Pharmacy," "Klaviyo," etc. are all simulated —
buttons that say "Sync," "Test," "Ping API" flip local status fields and show a toast;
nothing leaves the browser. This is flagged inline wherever a control's action is
purely cosmetic.

---

## Table of contents

1. [AdminShell chrome](#adminshell-chrome)
2. [Home dashboard](#home-dashboard) — `/admin`
3. [Live view](#live-view) — `/admin/live`
4. [Analytics](#analytics) — `/admin/analytics*`
5. [Patients](#patients) — `/admin/patients*`
6. [Leads](#leads) — `/admin/leads*`
7. [Orders](#orders) — `/admin/orders*`
8. [Physician queue](#physician-queue) — `/admin/physician-queue*`
9. [Check-ins](#check-ins) — `/admin/check-ins*`
10. [Payments](#payments) — `/admin/payments`
11. [Pharmacy](#pharmacy) — `/admin/pharmacy`
12. [Messages (Inbox)](#messages-inbox) — `/admin/messages`
13. [Leads → Orders → Command center](#command-center) — `/admin/command`
14. [Integrations](#integrations) — `/admin/integrations*`
15. [Team](#team) — `/admin/team`
16. [Reports](#reports) — `/admin/reports`
17. [Build](#build) — `/admin/build/*`
18. [Settings](#settings) — `/admin/settings*`
19. [Admin theme scope (CSS)](#admin-theme-scope-css)
20. [Cross-cutting known gaps](#cross-cutting-known-gaps)

---

## AdminShell chrome

**File:** `src/components/admin/AdminShell.tsx`. Wraps every `/admin/*` route as
`<AdminShell title?>{children}</AdminShell>`.

### Session bootstrap

- On mount, `hydrateAdmin()` restores state from `localStorage`.
- If there is no `session`, `adminActions.signIn("hello@blissley.com")` is fired
  automatically — the admin panel effectively auto-logs-in; there is no real login
  gate reachable from inside `/admin` (a `/login/admin` route exists and is the
  target of "sign out").
- `tenant.primary` / `tenant.accent` are pushed to CSS custom properties
  `--brand-primary` / `--brand-accent` on `<html>` so the chosen demo tenant's colors
  can be referenced by page content.

### Desktop sidebar (`lg:` and up, fixed left, 220px / 64px collapsed)

- **Logo button** (top): shows the Blissley PNG logo when `tenant.id === "blissley"`,
  otherwise the tenant's `logoText` in its brand color. **Long-press (600 ms) or
  click via the Role chip** opens the **Demo variant sheet** (see below) —
  `adminActions.toggleLogoMenu(true)`. Implemented with `onMouseDown/onMouseUp/onMouseLeave`
  and touch equivalents plus a `setTimeout` held in `holdRef`.
- **"Get Started" onboarding ring**: SVG donut showing `tenant.onboardingStep /
  ONBOARDING_STEPS.length` (7 steps: Connect Stripe, Connect South End, Invite
  physician, Add first product, Enable Klaviyo, Add domain, Publish site). Purely
  a visual progress indicator — **there is no click handler on this element and no
  action anywhere in `adminActions` advances `onboardingStep`**; it is decorative
  and effectively frozen at whatever the seed/tenant sets. Known gap.
- **Nav groups** (collapsible via the header's panel-toggle button, not per-group):
  | Group | Items | Role gate |
  |---|---|---|
  | (untitled) | Home (`/admin`, exact), Live view (`/admin/live`) | Live view: owner, ops |
  | Clinical | Patients, Physician queue, Pharmacy, Check-ins | Physician queue: owner/clinical; Pharmacy: owner/ops/clinical; Check-ins: owner/clinical |
  | Operations | Orders, Payments, Messages, Leads | Orders/Payments/Leads: owner/ops; Messages: all roles |
  | Build | Funnel builder, Intake builder, Products, Email flows, Pages | Funnel/Products/Emails/Pages: owner only; Intake: owner/clinical |
  | Analytics | Overview, Acquisition, Funnel & CRO, Retention, Finances | Overview/Acquisition/Funnel: owner/ops; Retention/Finances: owner only |
  | Settings | Settings, Integrations, Team | Integrations: owner/ops; Team: owner only |

  Items whose `roles` array excludes the current `role` (from the Demo variant
  sheet) are filtered out of both the desktop sidebar and the mobile drawer —
  this is real client-side gating of *navigation visibility*, not of the routes
  themselves (a hidden route is still reachable by typing the URL; only
  Finances actively self-restricts by role, see Analytics section below).
- **Active-item styling**: left rail highlight bar + marine text/icon color when
  `pathname === n.to` (exact items) or `pathname.startsWith(n.to + "/")`.
- **Role chip** (bottom of sidebar): avatar initial (first letter of
  `session.name`), "Viewing as {role}" and "Scenario · {scenario}". Clicking it
  also opens the Demo variant sheet.
- **Collapse toggle**: `PanelLeft` icon button in the header narrows the sidebar
  to 64px (icons only, no labels, no group titles); state is component-local
  (`useState`), not persisted.

### Mobile chrome (`< lg`)

- **Top bar** hamburger (`LayoutGrid` icon) opens a slide-in drawer
  (`framer-motion`, spring transition) replicating the full nav + Role chip;
  backdrop click or the `X` button closes it.
- **Bottom tab bar** (fixed, always visible): Home, Live, Patients, Msgs
  (Messages), More (Settings) — 5 icon+label tabs, active state = ink color.

### Header (sticky, all breakpoints)

- Sidebar collapse toggle (desktop) / hamburger (mobile).
- **Brand chip**: tenant logo + system-status dot. Dot pulses green ("All
  systems operational") unless `scenario === "crisis"`, in which case it pulses
  coral and reads "Degraded." Purely derived from the Demo variant sheet's
  scenario selector — not a live health check.
- **Global search bar** (`⌘K` hint shown, no actual keyboard listener wired at
  the shell level): placeholder "Search patients, orders, cases…". **Known gap:
  the input has no `onChange`/`onSubmit` handler — typing does nothing and there
  is no results dropdown.** (A working `⌘K`-triggered command palette does not
  exist at the shell level; the Integrations marketplace has its own local
  `⌘K` that focuses its own search box — see Integrations section.)
- **"+ New patient" button**: rendered, `sm:flex`, **no `onClick` handler** —
  known gap, purely decorative.
- **Help icon button**: rendered, **no `onClick` handler** — known gap.
- **NotificationsBell** (see below).
- **Sign-out avatar button**: `adminActions.signOut()` then navigates to
  `/login/admin`.
- **Page title strip**: renders `title` prop (e.g. "Patients", "Orders") under
  the header row when a route passes one via `<AdminShell title="...">`.

### NotificationsBell

**File:** `src/components/admin/NotificationsBell.tsx`.

- Bell icon with an unread-count badge (`s.notifications.filter(n => n.unread).length`),
  red circular counter.
- Click toggles a 360px dropdown panel (click-outside closes it via a full-screen
  transparent overlay).
- Header row: "Notifications" label + **"Mark all read"** →
  `adminActions.markAllNotificationsRead()`.
- List: each `Notification` (`id, ts, tone, title, detail, deepLink, unread`) is a
  row with a tone dot (critical = coral, warn = honey, success = check, else
  ink/40), title, relative timestamp (`Xs/Xm/Xh/Xd`), and detail text.
- Clicking a row: `adminActions.markNotificationRead(n.id)`, then
  `nav({ to: n.deepLink })`, then closes the panel. This is the one working
  "deep link" pattern in the whole notification/search UX.
- Empty state: "All clear."

### Demo variant sheet (long-press logo / Role chip)

**File:** `src/components/admin/DemoVariantSheet.tsx`. This is the single most
important non-obvious control in the whole admin: it is the developer/demo
"god panel" and is the only way to change tenant, scenario, and role from the UI.

- Opened via `s.ui.showLogoMenu`; backdrop-blur modal, centered on desktop,
  bottom-sheet on mobile.
- **Brand tenant** grid: cards per `s.tenants` entry (id, name, primary/accent
  gradient swatch, `stage` label mapped via `STAGE_LABEL` — `live → "Live · full
  data"`, `ramping → "Ramping · early sales"`, `zero → "Zero · just onboarded"`
  — and `website`). Clicking calls `adminActions.switchTenant(t.id)` then closes
  the sheet. Caption: "Switching tenants reseeds patients, orders, and payments
  to match the tenant's stage" — this is accurate; tenant switch reseeds the
  whole demo dataset to match `stage` (live/ramping/zero).
- **Scenario** grid (5 cards, `DemoScenario`): `healthy` ("Normal traffic, clean
  metrics"), `crisis` ("Payment gateway + pharmacy issues"), `churn` ("Retention
  dip, cancellations up"), `launch` ("12 new pending patients, high spend"),
  `empty` ("Fresh workspace, no data"). Clicking calls
  `adminActions.setScenario(s.key)` and closes the sheet. Scenario drives: the
  header status dot (crisis → "Degraded"), `insightHeadline()` copy on the
  dashboard/Analytics insight banner, and (per seed generation logic in
  `store.ts`/`seeds.ts`) the shape of `funnelDays`/alerts/payments data.
- **Viewing as** grid (4 cards, `Role`): `owner` (full access), `ops` (orders/
  pharmacy/patients write, clinical read-only), `clinical` (cases/patients/
  messages write, no financials), `support` (messages/patients read-only, no
  financials). Clicking calls `adminActions.setRole(r.key)` — **sheet stays
  open** for this control (unlike tenant/scenario) so you can flip roles
  repeatedly to test nav visibility.
- **Jump to portal**: two links, `/portal/patient` and `/portal/physician` —
  plain anchor tags, real navigation out of `/admin` entirely.

### Toast host

`<Toaster position="bottom-right" richColors closeButton />` from `sonner` is
mounted once in `AdminShell` — every "toast.success/error/info" call throughout
the admin renders here.

### Shared primitives exported from `AdminShell.tsx`

- `Card` — white rounded bordered container used everywhere.
- `SectionTitle` — heading + optional subtitle + right-aligned action slot.
- `Pill` / `StatusPill` (alias) — tone-colored pill (`neutral, success, warn,
  critical, info`).
- `formatMoney(cents)` — heuristic: if `cents > 10_000` treats the value as cents
  and divides by 100, else treats it as already-dollars. This inconsistency
  means some screens pass whole-dollar numbers and some pass cents; each call
  site was written assuming a particular convention (flagged individually below
  where ambiguous).
- `timeAgo(ts)` — relative time formatter (`Xs/Xm/Xh/Xd ago`).

---

## Home dashboard

- **Route:** `/admin` — file `src/routes/admin.index.tsx` — reached via the
  "Home" sidebar/bottom-tab item (exact match) or as the default landing page
  after admin sign-in.
- **Purpose:** single-page operator cockpit — revenue, MRR movement, pipeline
  health, and a prioritized action list. Used by **Owner/Ops** primarily
  (most cards are owner/ops-flavored KPIs); no role gating on the route itself.
- **Zero-state:** if `tenant.stage === "zero"` the whole page renders
  `<ZeroStateHome tenant={tenant} />` instead (a fresh-workspace / "connect your
  first program" empty state — separate component, not detailed further here
  since it is a single branch of this file).

### Layout (2-column: main + 320px right rail on `xl:`)

**Row 1 — 5 KPI tiles** (`KpiTile`), 2-col mobile / 3-col md / 5-col xl:
| Tile | Value source | Formula | Delta shown |
|---|---|---|---|
| Current MRR | `computeKpis(s).mrr` | store-computed | static `+4.8%` (hardcoded, not derived) |
| Net Revenue | `computeKpis(s).netRevenue` | store-computed | static `+8.2%` |
| Active Subscriptions | `computeKpis(s).activeCount` | store-computed | static `+38` |
| Avg Order Value | `computeKpis(s).aov` | store-computed | static `-1.4%` |
| Retention Rate | `computeKpis(s).retention` | store-computed | static `+1.4pt`; sub-copy `"{18-refills}/18 refilled this month"` uses `refillsDue(s)` |

Each tile has a 7-30 day sparkline (`Sparkline`) fed by `revenueTrend`,
`newPatientsTrend`, or `ordersTrend` (`src/lib/admin/selectors.ts`, 30-day
windows over `s.funnelDays`, 3-point moving average smoothing for revenue).
**Known gap:** all delta percentages/point-changes on this row are hardcoded
strings, not computed from the trend data — they do not respond to scenario
switches.

**Row 2 — 3 cards**, `lg:grid-cols-3`:
- **Today's revenue**: value = `todayRevenue(s)` = last day's `funnelDays.revenue`.
  Chart = `AreaChart` of `revenueTrend(s,30)` vs. `priorPeriodShift(revTrend, 8)`
  (a synthetic "prior period" computed by shrinking each point ~8% with a sine
  wobble — **not a real prior-30-days comparison**, just a deterministic-looking
  fake baseline). Static caption "+12.4% vs $2,776 yesterday" is hardcoded.
- **MRR movement · 4w**: waterfall bar built from `mrrMovement()` (store
  selector) rendered as a segmented "pixel bar" (New/Expansion/Reactivated
  = green/blue/violet gained; Contraction/Churn/Failed = amber/coral/red lost).
  Header stat "+$16.4K gained / −$7K lost" is a **hardcoded** display string,
  not summed from `items`.
- **Revenue by program**: `Donut` of `revenueByProgram()` (top 6 programs by
  revenue, 6-color palette), center label = total/1000 formatted as `$X.XK`.

**Row 3 — Pipeline strip**, 5 tiles (`PipelineTile`): In review, Approved, At
pharmacy, Shipped, Delivered. **All five tiles use hardcoded counts and
sub-labels** (`{ key: "review", count: 38, sub: "4 stuck · 36h" }` etc. defined
inline in the component) — **known gap: this strip does not read from
`s.orders`/`s.cases` at all**, so it never changes with scenario, tenant, or
any admin action.

**Row 4 — Actions**: header with "Customize Columns" button (**no handler,
known gap**) and a "View All →" link to `/admin/command`. Body is the shared
`<TaskCenter />` component (task list — reused elsewhere; not detailed
further here as it is a shared component, see Command center for its
backing data, `s.tasks`).

### Right rail (xl only, `aside`)

- **Quick actions card**: 2×2 grid of buttons — New order, Update billing,
  Schedule, Quick lookup. **None of the four buttons have `onClick` handlers —
  known gap, fully decorative.** Below them a "Lookup order # or patient…"
  input — **also has no `onChange`/submit handler**, decorative.
- **Patient funnel card** (`PatientFunnelCard`): 8-row funnel (Traffic → Intake
  started → Submitted → Medical review → Approved → Rx sent → Shipped → Refill
  M2). Values are **hardcoded** except "Intake started" which takes
  `Math.max(4612, conversionFunnel(s).intake)`. Percent-of-traffic column is
  also hardcoded per row. Known gap: mostly static demo dressing.
- **Acquisition card**: shows `acquisitionMix()` (store-derived channel mix).

### Responsiveness
2-col KPI grid on mobile, up to 5-col on `xl`; right rail collapses under the
main column below `xl` (grid becomes single column). Bottom tab bar replaces
sidebar on `< lg`.

---

## Live view

- **Route:** `/admin/live` — file `src/routes/admin.live.tsx` — sidebar "Live
  view" item (owner/ops only) or mobile bottom tab "Live".
- **Purpose:** real-time-style visualization of simulated visitor sessions and
  purchases on a 3D globe or 2D map, for demo/showroom use. Role: Owner/Ops.
- **Data source:** `useLiveSessions()` hook (`src/hooks/useLiveSessions.ts`,
  not read in full for this spec but referenced) produces `sessions`,
  `purchaseEvents`, `counts`, `byLocation`, a `focus` target, `focusOn`,
  `telehealth` stats, and `lastTickAt` — this is a client-side interval-driven
  simulation, not a websocket/live feed.

### Layout
- **Top bar**: "Live View" title + pulsing blue "Just now" indicator (static
  text, not tied to `lastTickAt` directly in this row).
  - **Shortcuts** button (hidden on small screens) opens `<ShortcutsSheet>`.
  - **Streamer / Show toggle**: `Eye`/`EyeOff` — masks patient names & cities
    everywhere the page renders them (privacy mode for screen-sharing demos).
    Persisted to `localStorage` (`blissley.live.streamer`).
  - **Globe/Map segmented toggle**: switches `view` state, persisted to
    `localStorage` (`blissley.live.view`).
  - **Fullscreen toggle**: `document.requestFullscreen()`/`exitFullscreen()`
    on the page wrapper; icon flips Maximize2/Minimize2.
- **Keyboard shortcuts** (page-level `keydown` listener, ignored while
  typing in inputs): `?` or `Shift+/` toggles the shortcuts sheet, `Escape`
  closes it, `g`/`m` switch globe/map, `s` toggles streamer mode, `f` toggles
  fullscreen, `+`/`-` zoom, arrow keys pan — dispatched as custom
  `blissley:live:cmd` window events consumed by the Globe/Map components.
- **Main split**: full-bleed `LiveGlobe3D` (lazy-loaded, `ClientOnly` +
  `Suspense`, SSR-safe with a `GlobeFallback` spinner) or `LiveMap` behind a
  scrollable `LiveSidebar` (counts, by-location breakdown, "Revenue by
  program" mini chart built from `s.orders` grouped by 6 hardcoded telehealth
  categories seeded with baseline dollar amounts, a hardcoded 62/38
  new-vs-returning split, and telehealth stats).
- **Below the sidebar (non-fullscreen only)**: "Live activity" card wrapping
  the shared `<ActivityFeed limit={6} />`, and a "Recent orders" card listing
  the 8 most recent `s.orders` (amount hidden behind `—` when streamer mode
  is on).

### Known gaps
- The "Just now" live indicator and revenue-by-program numbers are seeded/
  synthetic, not derived from `lastTickAt` ticks in a verifiable way beyond
  what `useLiveSessions` produces internally.
- `newReturning` split (62/38) is a hardcoded constant in the route file.

### Responsive
Sidebar becomes full-width overlay column on narrow viewports (`lg:w-[380px]`
vs. full width); globe/map always fills behind it.

---

## Analytics

Five sibling routes under `/admin/analytics*`, sharing `AnalyticsSection` /
`MetricCard` / chart primitives from `src/components/admin/analytics/*`.
Common URL search params on Overview and Funnel: `range` (`7d|30d|90d|ytd|
custom`) and `compare` (`prior|yoy|none`), persisted in the URL via TanStack
Router `validateSearch` + `navigate({ search })`.

### Overview — `/admin/analytics`

- **File:** `admin.analytics.index.tsx`. Sidebar "Analytics → Overview"
  (owner/ops).
- **Purpose:** one dense, scrollable KPI dashboard spanning revenue,
  acquisition/funnel, clinical ops, retention, geography and program movers.
- **Top bar controls:**
  - **Range dropdown** (7/30/90 days, YTD) — updates `range` search param;
    drives `daysForRange()` → `makeWindow()` window size for every metric.
  - **Compare dropdown** (Prior period / Previous year / No comparison) —
    updates `compare` search param; toggles whether prior-period overlays
    render on every `AreaChart`/`BarChart` (`priorOr()` helper hides overlay
    when `compare === "none"`).
  - **Auto-refresh toggle**: when on, calls `adminActions.tick()` every 8
    seconds (this genuinely advances the simulated `funnelDays` series) and
    updates a "updated Xs ago" ticker (separate 1s interval just for the
    countdown text).
  - **Export dropdown**: 4 CSV exports (`downloadCsv` from
    `src/lib/admin/csv.ts`) — "Program movers," "Funnel," "Cohort retention,"
    "Payments health." These are real, functioning client-side CSV downloads
    built from the same data the page renders.
  - **"New report" link** → `/admin/reports`.
- **Insight banner**: `pickInsight(s, window)` — headline/detail/tone
  (critical/warn/success) chosen from scenario + data heuristics, with a
  14-day mini revenue sparkline and a "See why →" link to `insight.deepLink`
  (routes to the most relevant sub-page, e.g. Payments or Funnel).
- **Section: Revenue** (3 `MetricCard`s) — Net revenue (`AreaChart`, delta %),
  MRR (`Donut` of a **hardcoded** 5-segment breakdown — New/Expansion/
  Reactivated/Contraction/Churn dollar amounts do not come from `mrrWaterfall()`
  or `computeKpis()`, they're static numbers in the route file), Active
  patients (`AreaChart`).
- **Section: Acquisition & funnel** — Sessions (`AreaChart`), Conversion
  breakdown (`BreakdownBars` of Sessions/Intake/Approved/Paid derived from
  `conversionFunnel(s)` plus `approval`/`pay` window deltas), AOV (`AreaChart`).
- **Section: Clinical operations** — Physician review median/p90 time
  (`physicianSLAWTrend`, a seeded sine-wave "SLA" simulation, not a real
  timer), Approval rate (`approvalRateWTrend`), and presumably refill
  adherence (cut off in the excerpt but same pattern via
  `refillAdherenceWTrend`).
- **Further sections** (per file length, not fully re-quoted): Payments
  health (`paymentsHealthW` — charges/failed/recovered), Geography
  (`sessionsByStateW`), Program movers table (`programMoversW` — patients,
  new MRR, AOV, refill %, churn % per program with a sparkline), Device mix
  (`deviceMix()` — 3 hardcoded shares: Mobile 68/Desktop 26/Tablet 6), and a
  cohort retention heatmap (`cohortRetention()`).
- **Data sources summary**: everything under `src/lib/admin/analytics.ts`
  (`makeWindow`, `*WTrend` helpers) operates on `s.funnelDays`, applying a
  **deterministic sine/jitter model** — not random per render, so refresh is
  stable, but it is entirely synthetic rather than aggregated from real
  event logs.

### Funnel & CRO — `/admin/analytics/funnel`

- **File:** `admin.analytics.funnel.tsx`. Sidebar "Analytics → Funnel & CRO"
  (owner/ops). Search params: `range`, `compare` (no `auto`).
- **Purpose:** step-by-step conversion analysis from presell → sales page →
  intake → checkout → purchase, plus screen-level intake drop-off. This is the
  most rigorously modeled analytics page — see **cro.ts formulas** below.
- **Toolbar** (`AnalyticsToolbar`): range/compare selectors, a "hide card"
  multi-select (`hidden` state, `AnalyticsCardKey[]`), a conversion **target**
  slider (default 5%, used to draw a progress bar under the hero conversion
  number), a manual "Refresh" button (just sets `refreshedAt`, does not refetch
  anything since there is no backend), and an **Export** button
  (`exportRates` → CSV of every `CroRate`).
- **Hero row**: "Overall conversion rate" metric card (big number + delta pt +
  progress-to-target bar + Sessions/Checkouts/Purchases mini-stats +
  `AreaChart` of the rate series) alongside a `FunnelFlow` step diagram
  (7 steps, hover shows detail, color-coded 4f46e5→10b981 gradient) with a
  "Leak: {label}" chip identifying the step with the largest `dropPct`
  (`biggestLeak(cro.steps)` helper, not shown in full but implied by usage).
- **Opportunity strip** (3 cards): Biggest leak, Worst intake screen (links to
  `/admin/build/intake`), Checkout recovery upside (`abandonedCarts =
  checkoutStarts - purchases`, projects 20% recovery, links to `/admin/leads`).
- **Presell / Sales page / Intake / Checkout sections**: each a 3-4 card grid
  of `MetricCard`s and `RateCard`s (a rate + its own mini chart), backed
  directly by `CroRate` objects from `croMetrics()`.
- **Screen-by-screen intake drop-off**: retention bar chart (one bar per
  active `IntakeScreen`, height = `reachedPct`, worst-offender colored red)
  with hover tooltips, plus a full data table (Order, Screen name, clinical-
  lock badge, Entered, Dropped, Drop rate, Reached %, Median time). Export
  button downloads the same table as CSV (`exportScreens`).
- **CRO technical reference — `src/lib/admin/cro.ts`:**
  - `croDay(FunnelDay)` expands each day of the seeded funnel into a fuller
    step model using **deterministic sine-based jitter** (`jitter(ts, salt)`
    — a seeded pseudo-random 0..1 value from `Math.sin`, not `Math.random`,
    so SSR/CSR match and re-renders are stable):
    - `presellViews = sessions × (0.34 + jitter×0.06)` (34-40% of traffic).
    - `presellClicks = presellViews × (0.52 + jitter×0.1)` (presell→sales CTR).
    - `salesViews = sessions - presellViews + presellClicks`.
    - `salesClicks = max(intakeStarts, intakeStarts × (1.08 + jitter×0.09))`
      (sales CTA clicks always ≥ intake starts).
    - `intakeViews = salesClicks`.
    - `salesBounces = salesViews × (0.41 + jitter×0.08)`.
    - `intakeCompletions = min(intakeStarts, funnelDay.intakeCompleted)`.
    - `purchases = min(intakeCompletions, funnelDay.paid)`.
    - `checkoutStarts = max(purchases, min(intakeCompletions, purchases ×
      (1.34 + jitter×0.22)))`.
  - `rateMetric()` builds each `CroRate` as `numerator/denominator × 100` for
    both the current window and the prior window (or the same window doubled
    if there is no prior slice), computing `deltaPt = value - prior`. An
    `invert` flag turns a "completion rate" into its complementary "abandon
    rate" (`100 - rate`).
  - The ten published rates: `presellCtr` (clicks/views), `salesClickRate`
    (clicks/views), `salesBounceRate` (bounces/views, lower-is-better),
    `intakeStartRate` (starts/views), `intakeCompletionRate`
    (completions/starts), `intakeAbandonRate` (inverse of completion),
    `checkoutStartRate` (checkoutStarts/completions), `checkoutCompletionRate`
    (purchases/checkoutStarts), `checkoutAbandonRate` (inverse), and
    `overallConversionRate` (purchases/sessions).
  - `intakeScreenDropoff()`: allocates the day's total intake loss
    (`starts - completions`) across each *active* `IntakeScreen` in order,
    weighted by a **friction score** = `byType (text 3.1 / number 2.2 / multi
    1.9 / else 1.2) + lockedPenalty (1.5 if clinical) + fatigue (i × 0.12) +
    jitter×1.1`. Each screen's `exited` = `round(totalLoss × share)`,
    `dropPct = exited/entered`, `reachedPct = entered/starts`, `medianSecs =
    9 + friction×4 + jitter×6`. The screen with the highest `dropPct` is
    flagged `worst`.

### Acquisition — `/admin/analytics/acquisition`

- **File:** `admin.analytics.acquisition.tsx`. Sidebar (owner/ops). No
  range/compare controls — single fixed "last 30 days" view.
- **KPI strip** (5 tiles): Spend (Σ `campaigns.spend`), CAC (`spend/purchases`,
  warn if >$120), ROAS (spend-weighted average of `campaign.roas`), Leads (Σ),
  Purchases (Σ).
- **Channel mix card**: horizontal bar list from `acquisitionSpendMix(s)`
  (groups `s.campaigns` by `channel`, colors: Meta coral, Google navy, Email
  green, Affiliate honey, Organic bluebell).
- **Campaigns table**: every `s.campaigns` row — Campaign, Channel, Spend,
  ROAS, CAC, Purchases. No sort/filter controls; no click-through to a
  campaign detail page (none exists).

### Retention — `/admin/analytics/retention`

- **File:** `admin.analytics.retention.tsx`. Sidebar (owner only).
- **Cohort heatmap**: `cohortRetention()` (store selector) rendered as a
  table, one row per monthly cohort, columns M0-M5, cell background opacity
  scaled to the retention percentage (coral tint), `—` for null/not-yet-
  reached months.
- **MRR movement**: `<MrrMovementBar items={mrrWaterfall(s)} />` (shared
  component) — `mrrWaterfall()` combines a hardcoded $84,200 starting base
  with real `newMrr`/`churnedMrr` sums from the last 30 `funnelDays`, plus
  hardcoded Expansion/Reactivated/Contraction figures ($4,200/$1,800/-$1,200).
- **Churn reasons**: horizontal bar list — **entirely hardcoded** percentages
  (Side effects 32%, Cost 22%, Reached goal 18%, Not effective 14%, Other
  14%) — known gap, not derived from any patient `cancelReason` field even
  though `Patient.cancelReason` exists in the store schema.

### Finances — `/admin/analytics/finances`

- **File:** `admin.analytics.finances.tsx`. Sidebar (owner only). **Self-
  gates by role inside the component**: if `role === "support" || role ===
  "clinical"` it renders only a "Finances is restricted to Owner / Ops."
  placeholder card — this is the one analytics page that enforces its
  restriction even if the user reaches the URL directly (not just hidden
  nav), because the check lives in the component body, not only the sidebar.
- **Income statement card**: Revenue/COGS/Gross profit/OpEx/Net — **all five
  figures are hardcoded constants** (`revenue = 168_240`, `cogs = 52_800`,
  `opex = 61_400`) computed once per render; not tied to `s.funnelDays` or
  `s.payments` at all.
- **Unit economics card**: CAC $92, LTV $1,240, LTV:CAC 13.5×, Payback 2.1mo,
  Gross margin 68.4%, Monthly churn 7.1% — all **hardcoded**; only MRR and ARR
  (`mrr × 12`) come from `computeKpis(s)`.
- **Upcoming payables card**: 5 hardcoded vendor rows (South End Compounding,
  Dr. Telx, Meta Ads, Klaviyo, Payroll) with fixed amounts/due dates —
  labeled "From Mercury" but not wired to the Mercury integration.
- **Revenue by program**: real data via `revenueByProgram()`, horizontal bar
  list scaled against a hardcoded max of `$42,600`.
- **Known gap:** this entire page is closer to a static mockup than a live
  report — only the header KPI row (MRR/ARR) and the revenue-by-program table
  respond to scenario/tenant changes.

---

## Patients

### Patients index — `/admin/patients`

- **File:** `admin.patients.index.tsx`. Sidebar "Patients" (all roles).
- **Purpose:** searchable/segmentable/paginated patient roster; single source
  of truth for the patient book of business. Used by all operator roles
  (support/clinical get read access; write actions elsewhere are role-limited
  in the detail page, not here).
- **Top bar**: search input (bound to `s.ui.patientSearch` via
  `adminActions.setPatientSearch`, resets to page 1 on change), "All" filter
  button (**renders a chevron but has no dropdown/handler — known gap**),
  "Export CSV" button (**no handler — known gap**, unlike other pages that do
  wire up `downloadCsv`), "Add Patient" button (**no handler — known gap**).
- **KPI strip** (5 tiles from `selectPatientKpis`): Total Patients, Active,
  New This Month (vs. `priorMonth` with up/down tone), Churned (+ churn rate),
  Failed Payment (+ dollars at risk).
- **Status tabs** (`STATUS_TABS`): All/Active/Pending Approval/Paused/
  Cancelled/Denied/Payment Failed — bound to `s.ui.patientFilter` via
  `adminActions.setPatientFilter`; counts from `selectStatusCounts`.
- **Segment chips** (`SEGMENTS` from `patients-enrich.ts`): local `segment`
  state (not global store), counts from `selectSegmentCounts`; "+ Create
  segment" button has **no handler — known gap**.
- **Bulk toolbar** (appears when rows selected): Message/Tag/Export/Pause
  buttons — **none have handlers, known gap**; "Clear" works (clears local
  selection state).
- **Table** (`selectPatients`, client-side sort/paginate over the filtered
  set): checkbox select-all, Patient (avatar initials + name + email),
  Status (`PatientStatusPill`), Program, Since, MRR, LTV, Month (`monthOfPlan
  /totalMonths` from `enrichPatient`), Churn (`ChurnPill`, hidden for pending/
  denied), Last active (relative day), Actions ("View →"). Row click and
  "View →" both navigate to `/admin/patients/$id`.
- **Pagination**: page-size selector (10/25/50/100), prev/next buttons,
  "{total} patients" count — all local state, recomputed via `selectPatients`.
- **Empty state**: "No patients match your filters." spanning the table body.
- **Responsive**: table scrolls horizontally under `min-w-[1100px]`; KPI grid
  drops to 2 columns on mobile.

### Patient detail — `/admin/patients/$id`

- **File:** `admin.patients.$id.tsx`. Reached via any patient row/link
  system-wide (patients table, orders, check-ins, leads-conversion, etc.).
- **Purpose:** the full patient record — subscription, clinical, orders,
  payments, comms, intake, notes — and the place where most patient-level
  admin actions are actually wired.
- **Not-found state**: centered message + "Back to patients →" link when the
  `id` doesn't match any `s.patients` row.
- **Header card**: avatar, name, `PatientStatusPill`, email/phone, city/state
  + "Patient since," patient code (`e.patientCode`). Action buttons:
  - **Send message** → `adminActions.ensureConversationFor(patient.id)` then
    navigates to `/admin/messages` (creates/opens the matching conversation).
  - **Issue refund** → finds the most recent succeeded payment, prompts for a
    reason via `window.prompt`, calls `adminActions.refundPayment(last.id)`,
    toasts `"Refunded $X"`. No-op with `toast.error` if there's no successful
    payment.
  - **More (⋯)** → `adminActions.exportPatientPdf(patient.id)` +
    `toast.success("PDF export queued")` — **known gap: no real PDF is
    generated or downloaded**, purely a toast.
- **Status banner** (`StatusBanner`): contextual banner (e.g., failed payment,
  denied, paused) with `onRetry` → `adminActions.retryPatientPayment(id)` and
  `onContact` → navigate to Messages.
- **Subscription card**: Status, Started, Current month, Current dose (step +
  strength), Next billing (amount + date, active only), Card brand/last4 —
  plus a `<DoseProgress>` bar. All from `enrichPatient()`.
- **Clinical card**: Physician, NPI, Approved date, Rx valid until, Refills
  left, Pharmacy, current Rx summary box, and an "Approval note" quote block
  attributed to the physician.
- **Orders card**: last 3 orders (Order #, Date, Product, `OrderStatusPill`,
  Amount, "View" link to `/admin/orders/$id`); "View all →" header link to
  `/admin/orders`.
- **Check-ins card**: conditional — if `status === "active" && monthOfPlan >=
  2`, shows a green "Check-in submitted" summary; else shows an amber "Check-in
  due" box with **"Send reminder now"** →
  `adminActions.sendPatientCheckInReminder(id)` + toast.
- **Payments card**: full payment history table with per-row **Retry** button
  for failed payments (`adminActions.retryPayment(p.id)`); footer totals
  (Total spent / Refunds / Net revenue) computed client-side from the
  filtered payment list.
- **Communications card**: Email opens/sent + Klaviyo active flag, SMS opt-in,
  Portal last-login + **"Send new magic link →"** →
  `adminActions.sendMagicLink(patient.id)` (no visible confirmation toast in
  the excerpt — fires silently).
- **Intake card** (collapsible `IntakeBlock`): Personal (height/weight/BMI/
  goal weight), plus further sections cut off in the read range but following
  the same `enrichPatient()`-driven KV pattern.
- **Activity card**: `<PatientTimeline p={e} />` — chronological event list
  (shared component).
- **Right rail**: "At a glance" (LTV actual/projected, MRR, total orders,
  churn risk, program/month/dose/physician/pharmacy summary); **Manage**
  panel (`<ManagePanel>` — role-gated destructive/status actions, e.g. pause/
  cancel/deny overrides, not expanded further here as a shared component);
  **Quick actions** panel (`<QuickActionsPanel>`); **Internal notes**
  (`<InternalNotes>` — CRUD against `patient.notes`); **Tags** card
  (`<TagsCard>`).
- **Known gaps**: PDF export is a toast-only stub; several buttons throughout
  patient-adjacent screens (see Patients index) have no handlers, but the
  detail page itself is one of the most fully-wired screens in the admin.

---

## Leads

### Leads index — `/admin/leads`

- **File:** `admin.leads.index.tsx`, `ssr: false`. Sidebar "Leads" (owner/ops).
- **Purpose:** recover abandoned intakes/checkouts and route hot inbound
  leads. Role: Owner/Ops (Clinical/Support don't see the nav item, though
  the route is not itself gated).
- **Top bar**: search (local state), "Import ▾" and "Export" buttons (**no
  handlers — known gap**), "New lead" button (**no handler — known gap**).
- **KPI strip** (6 tiles, `selectLeadKpis`): Open leads, Hot (score ≥70),
  Abandoned·30d, Recovery rate·30d (tone flips at 15%), Avg time-to-contact,
  Recoverable revenue.
- **Status tabs** (`STATUS_TABS` from `leads-enrich.ts`) — local `statusTab`
  state.
- **Segments**: pinned segment chips + "All segments →" expands a full
  segment-definition table (`SEGMENTS`, each row shows its filter
  `definition` as a mono string, % of leads, count); clicking a row in the
  expanded table applies that segment filter and collapses the table.
- **Bulk toolbar**: Email/SMS/Assign/Tag/"Add to segment"/Export — **no
  handlers, known gap** (only "Clear" works).
- **Table** (`selectLeads`): Lead (initials + name/email), Score (`ScorePill`),
  Intent (`IntentBadge`: hot/warm/cold), Program, Funnel step (`FunnelBar`
  with `progressPct`), State (`EligibilityDot` — green/red by
  `stateEligible`), Source·Campaign (`ChannelIcon` + campaign text), Age
  (hours), Assignee, Status (`LeadStatusPill`), Actions (three icon buttons —
  **these do work**: Email → `adminActions.addLeadOutreach(id, "email", "Quick
  reach-out", "sent")`; SMS → same action with `"sms"`; Call → same with
  `"call"`/`"connected"` — each appends an outreach log entry, no toast shown
  at the row level).
- **Pagination**: same pattern as Patients index.
- **Responsive**: `min-w-[1200px]` table forces horizontal scroll on tablet/
  mobile.

### Lead detail — `/admin/leads/$id`

- **File:** `admin.leads.$id.tsx`. Reached from any lead row.
- **Purpose:** single lead's full attribution, intake snapshot, outreach
  console, and conversion controls.
- **Not-found state**: "Lead not found" card + back link.
- **Header**: initials avatar, name, `IntentBadge`, `LeadStatusPill`, copyable
  email (`CopyField`), phone, city/state, DOB, assignee. `ScoreGauge`.
  Actions:
  - **Convert to patient** → `adminActions.convertLeadToPatient(lead.id)` —
    real state mutation (creates a patient record from lead data per the
    store's implementation).
  - **Status `<select>`** → `adminActions.updateLeadStatus(lead.id, value)`
    for any of `new/working/nurturing/won/lost/do_not_contact`.
- **Left column**: Funnel progress (`FunnelStepper`), Lead score breakdown
  (`LeadScoreBreakdown`), Intake snapshot (`IntakeSnapshotCard` — "what they
  answered before dropping off"), Outreach console (`OutreachConsole` — full
  log + presumably a composer, shared component), Attribution
  (`AttributionCard` — source/medium/campaign/adset/creative/landing URL/
  first-touch/last-touch/sessions/device), optional Cart card (line items +
  coupon code) if `cartItems`/`coupon` present.
- **Right column**: Projected value (First order, Projected LTV, Program
  interest, BMI/current/goal weight if present); Consent toggles
  (`ConsentToggles` — sms/email/marketing); Manage panel (assignee `<select>`
  → `adminActions.assignLead`, "Mark do-not-contact"/"Remove DNC" toggle via
  `updateLeadStatus`, "Open landing page" external link); Tags (add/remove via
  `adminActions.addLeadTag`/`removeLeadTag`); Danger zone (`LossReasonMenu` +
  **Delete lead** — `confirm()` dialog → `adminActions.deleteLead(id)` then
  navigate back to `/admin/leads`).
- **Known gaps**: none major — this page's controls are consistently wired to
  real store actions (unlike the index page's bulk/import/export buttons).

---

## Orders

### Orders index — `/admin/orders`

- **File:** `admin.orders.index.tsx`. Sidebar "Orders" (owner/ops).
- **Purpose:** Rx fulfillment worklist — every order, its Rx/fulfillment/
  payment status, pharmacy, tracking, and tags.
- **Header**: order/exception counts, **Export**/**Print** buttons (**no
  handlers — known gap**), analytics-bar toggle (⋯ button, local state),
  **Create order** button (**no handler — known gap**).
- **Analytics bar** (4 `KpiTile`s with sparklines, toggleable): Orders today,
  Revenue today, Avg time to ship, Exceptions open — from `ordersKpis()` /
  `last7Buckets()` (`orders-enrich.ts`); delta strings on 3 of 4 tiles are
  **hardcoded** (`+12%`, `+8.4%`), only the sparkline arrays are computed live.
- **Saved views tab strip** (`ORDER_VIEWS`): filters the order list by
  computed view id (e.g. all/exceptions/at-pharmacy/etc.), counts recomputed
  per view via `filterView()`; **"+ New view" has no handler, known gap.**
- **Filters row**: search (order id/patient/tracking/state), Program select
  (all/tirz/sema), Pharmacy select (dynamic from data), "More filters"
  button (**no handler, known gap**), "Sort ▾" button (**no handler, known
  gap** — the table has no header-click sort on this page, unlike Patients/
  Leads).
- **Bulk action bar**: Mark shipped / Assign pharmacy / Print labels / Send
  update / Flag — **none wired, known gap** (only selection state + Clear
  work).
- **Table** (13 columns, `min-w-[1180px]`): checkbox, Order # (mono, links via
  row click), Date, Patient, Program, Rx (`RxPill`: pending_review/approved/
  refill_due/denied), Fulfillment (`FulfillPill`: processing/at_pharmacy/
  shipped/delivered/exception), Payment (`PaymentPill`: paid/failed/
  refunded), Amount, Pharmacy (name + city/state), Carrier/Tracking, Ship-to
  state, Tags (+ cold-chain badge). Row click → `/admin/orders/$id`.
- **Empty state**: "No orders match this view."

### Order detail — `/admin/orders/$id`

- **File:** `admin.orders.$id.tsx`. Reached from any order row/link.
- **Purpose:** the canonical fulfillment record — Rx, shipping, payment,
  COGS, clinical excerpt, and full audit timeline for one order.
- **Not-found state**: "Order not found" + back link.
- **Header**: Order # (+ copy-to-clipboard button), `RxBadge`, `FulfillBadge`,
  cold-chain badge if applicable, placed date/program/cadence. Actions:
  - **Print label** → `adminActions.printOrderLabel(id)` + toast (**no real
    print dialog/PDF, known gap — label "printing" is simulated**).
  - **Refund** → guards against double-refund (`toast.info` if already
    refunded), prompts for a reason, calls `adminActions.refundOrder(id,
    reason)`, toasts the refunded amount.
  - **Send receipt** → `adminActions.sendOrderReceipt(id)` + toast (**no real
    email sent, known gap**).
  - **Advance stage** → `adminActions.advanceOrderStage(id)` (disabled once
    `status === "delivered"`), moves the order to its next `OrderStatus` and
    toasts "Stage advanced" — genuinely mutates state and re-renders the
    stepper.
- **Variant banner** (`VariantBanner`): contextual (e.g., exception/cold-chain
  warning) banner component, not detailed further (shared).
- **Left column**:
  - **Fulfillment timeline** (`<Stepper>`), steps built by `buildSteps(o)`
    from `OrderStatus`, SLA caption "48h from Rx approval."
  - **Line items**: drug name/dose/NDC/SKU/lot/qty/refills remaining, supplies
    bundle checklist, a physician/state-check/"Rx #" info strip.
  - **Shipping**: ship-to address (+ "Address verified"/"Signature required"
    badges), carrier/tracking (+ copy button), ETA/Delivered/Pharmacy/Origin
    meta grid. Actions: **Edit address** (opens local `editingAddr` modal
    state — modal body not shown in the read range but implied), **Reissue
    label** → `adminActions.reissueLabel(id)` + toast, **Reroute** →
    `adminActions.reportOrderException(id, "Rerouted by ops")` + toast,
    **Report exception** → prompts for a reason,
    `adminActions.reportOrderException(id, reason)` + `toast.error`.
  - **Payment**: subtotal/discount/tax/shipping/total breakdown, method +
    last4, Stripe-style intent id (`o.payment.intentId` — fake format).
    Actions: **Refund** (disabled unless `status === "paid"`, same flow as
    header refund), **Send receipt**, **Retry** (disabled once `status ===
    "paid"`) → `adminActions.retryOrderPayment(id)` + toast.
  - **COGS card** (`CogsCard`, internal-only — not detailed further, shared
    component; visible regardless of role in this reading).
  - **Clinical review**: chief complaint, BMI, contraindications ("Cleared"
    hardcoded string), e-sign timestamp, physician note quote; "Open case
    ↗" link to `/admin/physician-queue`.
  - **Activity log**: reverse-chronological `o.timeline` (actor pill + message
    + optional meta); "Add internal note" scrolls/focuses a note textarea
    element elsewhere on the page (`document.getElementById("order-note-input")`).
- **Right column**: Patient card (avatar/contact/state/plan/LTV/started, link
  to patient profile), Subscription card (cut off in read range, presumably
  cadence/next-billing details), and likely Tags/Notes cards following the
  pattern established elsewhere (not fully captured due to file length —
  662 lines total, first 290 read).
- **Status/lifecycle enums** used throughout Orders: `OrderStatus =
  processing | at_pharmacy | shipped | delivered | exception`; Rx status =
  `pending_review | approved | refill_due | denied`; Payment status = `paid |
  failed | refunded`.
- **Known gaps**: Print label, Send receipt, and PDF-style exports across
  Orders are all toast-only simulations with no real document generation or
  network call — consistent with the rest of the admin.

---

## Physician queue

### Queue index — `/admin/physician-queue`

- **File:** `admin.physician-queue.index.tsx`. Sidebar (owner/clinical).
- **Purpose:** case review worklist for physicians/clinical ops — SLA-colored
  wait times, safety flags, and a fast-path refill lane.
- **Metrics strip** (5 tiles): In queue (active count), Flagged 🔴 (critical
  tone if >0), Avg wait (hours from `waitHrs()` over active cases), Approved
  today, Denied today.
- **Search + Refresh**: search filters by patient name/case id
  (`toLowerCase().includes`); **Refresh** button bumps a local `tick` counter
  (forces a re-render / re-sort) and toasts "Queue refreshed" — does **not**
  refetch anything since there's no backend, but does cause the SLA colors
  (which are time-based) to recompute.
- **Tabs** (`TABS`): All, Flagged 🔴, New, Awaiting reply, Refills, Completed
  today, Denied today — filtered via `belongs(c, tab)` against
  `PhysicianCase.status`.
- **Two distinct table layouts depending on tab:**
  - **Refills tab**: Case #, Patient, Month (`i%6+1/6`, a **display-only
    approximation**, not real data), Product, Check-in ("✓ Completed",
    hardcoded), Change (`-{5+i%12} lbs`, **synthetic**), SE (side effects,
    from `c.flags[0]` or "None"), Action — if `flags.length === 0` a one-
    click **Approve** button appears (`adminActions.approveCaseWithRx(c.id)`
    + toast "Refill approved · Rx transmitted"); otherwise a "Review →" link
    to the case detail page.
  - **All other tabs**: 12-column grid — Case #, Patient (+ `Flame` icon if
    `priority === "urgent"`), Age, Sex, BMI (age/sex/BMI are **synthetic**,
    derived from `i` and string char-codes, not real patient fields), Product,
    Plan (`Mo/3mo/6mo` cycling by index — synthetic), Submitted (relative
    time from `submittedAt`), Wait (color-coded pill: `waitTone()` → critical
    >12h, warn >4h, else success), Flags (first flag or "None"), Physician
    (assignee lookup), Action ("Review →" link to `/admin/physician-queue/$id`).
- **Sort order** (`sortCases`): rank Flagged(0) → Awaiting reply(1) →
  New(2) → Refill(3) → Approved(4) → Denied(5), then oldest-submitted-first
  within rank.
- **Footer note**: static sort explanation + link to `/admin/check-ins`.
- **Known gaps**: Age/Sex/BMI/Plan/Month/Change/Check-in status shown in the
  table are cosmetically generated from the row index or patient id
  characters, not real patient intake data — flagged because they look like
  real clinical fields but are demo filler.

### Case detail — `/admin/physician-queue/$id`

- **File:** `admin.physician-queue.$id.tsx`. Reached from any queue row.
- **Purpose:** the physician's per-case decision workspace — patient
  snapshot, safety flags, full intake, Rx builder, and the three terminal
  decisions (Approve/Request info/Reject).
- **Not-found state**: "Case not found" + back link.
- **Status banner**: color keyed to `status` (approved=green, denied=red,
  awaitingReply=amber, else blue/marine "pending"); shows patient name,
  formatted submitted time, wait hours, assigned physician. Header actions:
  **Reassign** (opens `reassignOpen` — dropdown not fully shown but implied),
  **Mark/Clear priority** → `adminActions.setCasePriority(id, "urgent"|"normal")`.
- **Panel 1 — Patient**: Name+age+state, eligibility badge (`bmi>=27` ⇒
  "✅ ELIGIBLE"), BMI, Product, Plan, Case ID, Submitted, Time in queue.
  Priority banner if `priority === "urgent"` ("target approval within 6
  hours").
- **Panel 2 — Safety flags**: green "No contraindications" box if
  `flags.length === 0`, else one red card per flag with a generic reviewer
  note; below, a checklist of 8 **hardcoded** "✅ No X" clearance lines
  (not actually derived from the flags array — cosmetic reassurance list).
- **Panel 3 — Intake answers** (collapsible `<details>` groups):
  Contraindications, Qualifying conditions, Medical history, Personal — **all
  values are hardcoded/synthesized** per case (e.g. PCOS "Yes" if
  `patientName.endsWith("a")`) — known gap: this is a realistic-looking but
  entirely fake intake transcript, not tied to any real intake data model.
- **Panel 4 — GLP-1 dose matching** (conditional on flags mentioning "titr"/
  "dose"): hardcoded medication/last-dose/gap fields + a physician-discretion
  note.
- **Panel 5 — Prescription (pre-populated)**: editable Drug/Sig/Qty/Days
  supply/Refills fields, each `onBlur` → `adminActions.updateCaseRxDraft(id,
  {...})` — genuinely persists draft edits to `c.rxDraft`. Static routing
  note ("Routes to South End Pharmacy… NPI 1477783827").
- **Panel 6/7 — Patient note / Internal note**: textareas, `onBlur` →
  `adminActions.updateCasePatientNote` / `updateCaseInternalNote`.
- **Case timeline** (if present): reverse-chronological `c.timeline` entries.
- **Right column (sticky)**:
  - **Case summary** mini-KV recap.
  - **Approve & send Rx** → opens `approveOpen` modal requiring a 4-digit PIN
    (`pin.length < 4` blocks with `toast.error`); confirms via
    `adminActions.approveCaseWithRx(id, { patientNote, internalNote,
    decidedBy })`, toasts "Rx transmitted to South End Pharmacy" (simulated —
    no real pharmacy API call).
  - **Request more info** → `infoOpen` modal, requires non-empty text,
    `adminActions.requestInfoOnCase(id, text)`, toast "Question sent to
    patient."
  - **Reject case** → `rejectOpen` modal with a reason `<select>`
    (`REJECT_REASONS`, 9 canned clinical reasons) + free-text elaboration,
    `adminActions.denyCaseWithReason(id, reason, reasonText)`, toast "Case
    rejected."
  - All three decision buttons are disabled once `!isPending` (case already
    approved/denied).
  - **Your stats today** mini-grid: Reviewed/Approved/Rejected (computed from
    `cases` whose `decisionAt` is within 24h) + Avg time (`phy.avgResponseHrs`,
    a static per-physician seed value, not truly "today's" average).
- **Case status/decision enum**: `PhysicianCase.status = new | flagged |
  awaitingReply | approved | denied | refill`.
- **Known gaps**: the entire intake-answers panel and demographic fields
  (age/sex/BMI) are synthesized display data, not sourced from a real intake
  record; "Rx transmitted" / pharmacy routing is a toast, not a network call.

---

## Check-ins

### Check-ins index — `/admin/check-ins`

- **File:** `admin.check-ins.index.tsx`. Sidebar (owner/clinical).
- **Purpose:** monthly refill check-in worklist — weight deltas, side
  effects, and refill approval/hold decisions.
- **Metrics strip**: Due this week, Overdue (held) [critical tone if >0],
  Physician review [warn tone if >0], Avg weight change (Σ deltas / count),
  Flagged side effects (count with non-empty `sideEffects`).
- **Search**: local text filter on patient name.
- **Tabs** (`TABS`): Due this week (`decision==="clear" && day 85-89`),
  Physician review (`decision==="review"`), Held/overdue
  (`decision==="hold"|"held"`), 6-month refresh (`kind==="sixMonth"`),
  Completed today (`decision==="approved"|"adjusted"`).
- **Table** (7 columns): Patient(+id), Day, Weight, Δ (colored green if
  negative/loss, red if gain), Side effects (list or "None"), Status
  (`Pill` — critical/warn/success/info per decision), Action.
  - If `tab==="due"` and no side effects and `decision==="clear"`, a
    one-click **Approve** appears →
    `adminActions.approveCheckInRefill(c.id)` + toast "Refill approved."
  - Otherwise an **Open →** link to `/admin/check-ins/$id`.
  - Every row also has a **Bell** "Send reminder" icon →
    `adminActions.sendCheckInReminder(c.id)` + toast "Reminder sent."
- **Empty state**: "Nothing in this bucket."

### Check-in detail — `/admin/check-ins/$id`

- **File:** `admin.check-ins.$id.tsx`. Reached from any check-in row.
- **Purpose:** single check-in's weight trend, side effects, and the four
  refill decisions (Approve / Adjust dose / Message / Hold).
- **Not-found state**: "Check-in not found" + back link.
- **Header card**: Month (`ceil(day/30)`), patient name, day + "Submitted
  just now" (hardcoded relative phrase), decision pill, reminder count if >0.
- **Weight progression card**: Start/Current/This month Δ/Total Δ(+%) KV
  grid, plus a simple per-check-in bar chart (bar height scaled to weight
  relative to start weight, active check-in highlighted).
- **Side effects card**: green "No side effects" box or one amber card per
  reported effect.
- **Patient answers card**: **entirely hardcoded** adherence/mood/pregnancy/
  continuation answers — known gap, same pattern as the physician case
  intake panel.
- **Notes**: patient-facing and internal textareas, `onBlur` →
  `adminActions.updateCheckInPatientNote` / `updateCheckInInternalNote`.
- **Decision panel** (sticky right column), all disabled once
  `isDone = decision in {approved, adjusted, held}`:
  - **Approve refill** → modal requiring a 4-digit PIN →
    `adminActions.approveCheckInRefill(id)`, toast "Refill approved · order
    queued."
  - **Approve with dose adjustment** → modal with editable dose-change text
    (default "Titrate to 5mg for month 5") + note →
    `adminActions.approveCheckInWithAdjustment(id, { doseChange, note })`.
  - **Message patient** → modal textarea →
    `adminActions.messagePatientFromCheckIn(id, msg)`.
  - **Hold refill** → modal with a radio list of 7 canned `HOLD_REASONS`
    (e.g. "Vomiting > 3 days," "Suicidal ideation," "Missed 2+ doses") + free
    text → `adminActions.holdCheckInRefill(id, reason, text)`.
  - **Send reminder** (always enabled) → `adminActions.sendCheckInReminder(id)`.
- **Patient card**: state/program/status + link to patient profile.
- **Refill order card** (if `refillOrderId` present): link to
  `/admin/orders/$id`.
- **`CheckInDecision` enum**: `clear | hold | review | approved | adjusted |
  held | awaiting_reply`.
- **Known gaps**: "Patient answers" section is fully hardcoded; "Submitted
  just now" caption is a static string regardless of actual submission time.

---

## Payments

- **Route:** `/admin/payments` — file `admin.payments.tsx` — sidebar
  (owner/ops).
- **Purpose:** all charges (succeeded/failed/refunded) with a detail drawer
  for retry/refund/fraud-flag actions and portfolio-level recovery health.
- **KPI strip** (4 `MetricCard`s with sparklines from `paymentsHealth(s,30)`):
  Net revenue·30d (succeeded − refunded), Failed volume (+ count), Refunded,
  Recovery rate (`retriedSucceeded/failedCount`, falls back to hardcoded 92%
  if `failedCount === 0`).
- **Filters card**: search (id/patient/method), status pill filter (All/
  Succeeded/Failed/Refunded).
- **Export CSV** button — **fully functional**, calls `downloadCsv` with the
  currently filtered rows and toasts a count.
- **Table**: Charge id (mono), Patient, Amount, Method, Status
  (`StatusPill`), Failure reason (humanized), Date. Row click →
  `adminActions.openPayment(p.id)` which drives `s.ui.paymentDrawerId`.
- **Payment drawer** (slide-in from right, `framer-motion`):
  - Patient/method/amount/date summary; failure-reason callout if present.
  - **Failed payments**: **Retry charge** → `adminActions.retryPayment(id)`,
    toast "Retry succeeded" (always succeeds in this simulation), closes
    drawer.
  - **Succeeded payments**: editable refund-amount field (defaults to full
    amount) with a **Refund** button that calls
    `adminActions.refundPayment(id)` for a full-amount refund or
    `adminActions.refundPaymentPartial(id, cents)` for a partial one
    (validates the amount is a positive number first); **Send receipt** →
    `adminActions.sendPaymentReceipt(id)` + toast (simulated email).
  - **Flag as fraud** (always available) →
    `adminActions.flagPaymentFraud(id)` + toast.
  - **Timeline**: 2-3 static lines (created/result/failure) — not a full
    audit trail, just a summary recap of the row's own fields.
- **`PaymentStatus` enum**: `succeeded | failed | refunded`.
- **Known gaps**: none major on this page — almost every visible control is
  wired to a real store action (a rarity compared to list-page toolbars
  elsewhere in the admin).

---

## Pharmacy

- **Route:** `/admin/pharmacy` — file `admin.pharmacy.tsx` — sidebar
  (owner/ops/clinical).
- **Purpose:** pharmacy-partner API health, routing controls, and combined
  fulfillment throughput.
- **KPI strip**: Partners connected (`N-degraded/N`), Total queue depth (Σ),
  Avg prep time (Σ/N hours), Blended on-time % (Σ/N).
- **Partner grid** (`PharmacyCard` per `s.pharmacies`): name, `StatusDot`
  (connected=green/degraded=amber/down=red), primary/backup `Pill`, queue/
  prep/on-time mini-stats; clicking selects it as `pinned` (local state,
  drives the detail row below).
- **Detail row** (for the pinned/active pharmacy):
  - Header: name, status dot, role pill, drug list. Actions:
    - **Pause routing** (if healthy) → `adminActions.pausePharmacyRouting(id)`
      + toast, or **Resume routing** (if degraded/down) →
      `adminActions.resumePharmacyRouting(id)` + toast.
    - **Raise priority** (disabled if already `pharmacies[0]`) →
      `adminActions.bumpPharmacyPriority(id)` + toast.
    - **Ping API** → **no store action call** — just
      `toast.success("Health check queued for {name}")`, a pure UI toast with
      no state mutation (known gap — looks like it triggers a real health
      check but doesn't).
  - Mini-stat tiles: Queue, Avg prep, On-time (warn tone <92%), API status.
  - Pipeline stage chips from `pipelineByPharmacy(s)`: Awaiting Rx, Preparing,
    Shipped, Delivered — computed with `Math.max(2/3/1, real count)` floors so
    the demo never shows an empty pipeline even with few real orders.
  - 30-day throughput sparkline — **synthetic** sine-wave scaled by
    `active.queue`, not a real historical series.
  - Recent events list — **4 fully hardcoded** rows (ping ok / batch
    dispatched / on-time slipped / routing rule updated) with only the
    on-time percentage pulled live from `active.onTimeRate`; timestamps are
    relative offsets from "now," not real event history.
- **Combined pipeline**: `<PipelineStrip />` shared component (volume rollup
  across all pharmacies — not detailed further, reused elsewhere).
- **Recent orders table**: last 14 `s.orders`, links to order detail.
- **`Pharmacy.apiStatus` enum**: `connected | degraded | down`.
- **Known gaps**: "Ping API," the 30-day throughput chart, and the "Recent
  events" feed are cosmetic/simulated; routing pause/resume and priority
  bump are real store mutations.

---

## Messages (Inbox)

- **Route:** `/admin/messages` — file `admin.messages.tsx` — sidebar (all
  roles), mobile bottom tab "Msgs."
- **Purpose:** unified conversation inbox (in-app/SMS/email/WhatsApp) with
  macros, assignment, snoozing, and an internal-note channel — the primary
  support/clinical communication surface.
- **Layout**: 4-column desktop grid (Filter rail 240px | List 360px | Thread
  flex | Patient panel 320px), collapsing to a single-pane mobile flow with
  `mobilePane` state (`list → thread → info`) and a back button in the
  thread header.
- **Filter rail** (desktop only): folder list (`FOLDERS`: All conversations,
  Assigned to me, Unassigned, Starred, Snoozed, Closed) with live counts;
  tag filters (Clinical/Billing/Shipping/Refund, colored dots); channel pills
  (All/In-app/SMS/Email/WhatsApp). Folder/channel/search state all live in
  the global store (`s.ui.inboxFolder/inboxChannel/inboxSearch`) via
  `adminActions.setInboxFolder/setInboxChannel/setInboxSearch` — meaning the
  inbox filter state **persists across navigation and reloads**, unlike most
  other list pages' local `useState` filters.
- **List column**: search box, mobile folder pills, conversation rows sorted
  by `updatedAt` desc — avatar (unread dot), name (bold if unread, flame icon
  if `priority==="high"`, star if `starred`), relative time, preview text (or
  "typing…" if `c.typing`), channel badge, tag chip, snooze countdown chip,
  assignee. Clicking a row: `adminActions.setActiveConvo(id)` + switches
  mobile pane to thread. Selecting any conversation also fires
  `adminActions.markConvoSeen(id)` via a `useEffect`.
- **Thread** (`Thread` component):
  - Header: avatar, name, priority flame, channel/assignee/snooze status.
  - Icon actions: **Star** toggle (`toggleConvoStar`), **Snooze 4h /
    Unsnooze** (`snoozeConvo(id,4)` / `unsnoozeConvo(id)`), **Priority**
    toggle (`setConvoPriority`), **More ⋯** dropdown with Close/Reopen
    (`closeConvo`/`reopenConvo`), Snooze 24h (`snoozeConvo(id,24)`), and
    "Escalate to physician" (`assignConvo(id, "Dr. Nass", "physician")`).
  - Message list grouped by day (`groupByDay`), auto-scrolls to bottom on new
    messages or typing indicator changes.
  - Composer: text area, **Internal note** toggle (marks the outgoing message
    `internal: true` — presumably rendered distinctly, not shown in the read
    range), **Macros** menu (`MACROS`: 5 canned response templates —
    Titration guidance, Shipping ETA, Refill confirmation, Billing/HSA
    receipt, Escalate to physician — each templated with the patient's first
    name) inserted via `applyMacro()`, and **Send** →
    `adminActions.sendConvoMessage(id, { text, internal, channel })`.
- **Patient panel** (right rail, desktop only or mobile "info" pane): patient
  context — not fully captured in the read range but implied by
  `PatientPanel` component usage (LTV, program, started date, etc., per the
  `Conversation` type's `ltv`/`program`/`startedAt` fields).
- **Conversation/message enums**: `ConvoStatus = unassigned | support |
  physician | closed`; `ConvoTag = clinical | intake | shipping | billing |
  refund | general`; `MessageChannel = in_app | sms | email | whatsapp`;
  `ConvoMsgState = sending | sent | delivered | seen | failed`.
- **Known gaps**: none major identified in the read portion — this page is
  heavily interactive and nearly every visible control maps to a real
  `adminActions` call, unusual for the admin's list/detail pages.

---

## Command center

- **Route:** `/admin/command` — file `admin.command.tsx` — reached only via
  the "View All →" link on the Home dashboard's Actions section (not present
  in the main sidebar nav at all).
- **Purpose:** an ops-focused single-page rollup of pipeline counts, active
  alerts, the task queue, a live activity feed, and a physician-queue
  snapshot. Effectively a second, denser home page for Ops.
- **Live status bar**: pulsing green dot + "All systems operational" (static
  — not derived from scenario, unlike the AdminShell header's equivalent
  dot) + a live clock (`new Date().toLocaleTimeString()`, re-renders only on
  navigation since there's no interval tied to it).
- **Live pipeline card**: 5 tiles from `pipelineCounts(state)` — In review,
  Approved, At pharmacy, Shipped, Delivered — "Orders →" link to
  `/admin/orders`.
- **Alerts & escalations card**: every `s.alerts` row (severity
  critical/warn), each with a **Resolve** button →
  `adminActions.resolveAlert(a.id)` — genuinely removes/resolves the alert
  from state.
- **Task queue card**: every open (`status !== "done"`) `s.tasks` row, age-
  colored dot (red >24h / amber >6h / green else), a **checkmark** button →
  `adminActions.resolveTask(t.id)`.
- **Activity feed card**: scrollable `s.activity` list, tone-colored dots,
  relative timestamps.
- **Physician queue card**: 3 hardcoded `QCell` stats (In review "12,"
  Approved today "24," Refill signals "7" — **not derived from `s.cases`,
  known gap**) plus a static "Median review time: 4h 12m today (SLA 24h)"
  line, and a "Portal →" link to `/portal/physician`.
- **`Task` type**: `subject, action, ageHrs, status(open|waiting|done),
  assignee, category(billing|care_ops|fulfillment|compliance|admin)`.
- **`Alert` type**: `severity(critical|warn), title, detail, action`.
- **Known gaps**: the physician-queue mini-card is entirely hardcoded and
  disconnected from the real `s.cases` data that powers `/admin/physician-
  queue`; the live clock/status dot don't reflect real system state.

---

## Integrations

### Marketplace — `/admin/integrations`

- **File:** `admin.integrations.index.tsx`. Sidebar (owner/ops).
- **Purpose:** browse/connect/manage every third-party integration
  (payments, pharmacies, clinical, marketing, analytics, email/SMS,
  shipping, comms, banking, auth).
- **Header**: title + count summary ("{connected} of {total} connected"),
  search box (with a page-level `⌘K` keydown listener that focuses this
  input specifically — the only working command-palette-style shortcut
  found anywhere in the admin, though it only focuses a search field rather
  than opening an actual palette UI).
- **Summary strip** (4 cards): Connected, Needs attention (degraded+down),
  Available to add (disconnected), Last sync (max `lastSync` across all,
  "Never" if none).
- **Category tabs**: `All` + 10 categories, each showing `{connectedInCat}/
  {totalInCat}` except "All" which shows total count; filtering is local
  `cat` state.
- **Grid of `IntegrationCard`s**: brand tile (logo image or colored monogram
  fallback), name (+ external docs link), category label, `StatusChip`
  (connected/degraded/down/disconnected — colored dot+pill), 2-line
  description, footer showing either "Last sync {relative}" + **Test**
  button (`adminActions.testIntegration(id)` — returns a boolean the UI
  toasts as pass/fail; this is a **simulated** health check, not a real
  network call) + **Manage** link (→ detail page), or, if not connected,
  scope count + a **Connect** button that opens the `ConnectDialog` without
  navigating away.
- **Connect dialog** (2-step modal, `Escape` closes it):
  1. **Authorize** step: lists `integration.scopes` (required/optional
     badges) with a "will be able to" framing.
  2. **Configuration** step: renders `configSchema` fields dynamically —
     text/secret (with show/hide eye toggle)/select/toggle — validates
     `required` fields client-side, then calls
     `adminActions.connectIntegration(id, values)` and toasts success. All
     credentials are stored in-memory/localStorage only; nothing is
     transmitted anywhere.
- **Empty state**: "No integrations match your search."
- **Known gaps**: Test/Sync/Connect are all local state simulations; no real
  OAuth or API key validation occurs.

### Integration detail — `/admin/integrations/$id`

- **File:** `admin.integrations.$id.tsx`. Reached from any marketplace card
  or the Settings → Integrations summary page.
- **Purpose:** manage a single integration's config, webhooks, and sync
  history, or its "not yet connected" onboarding state.
- **Not-found state**: "Integration not found" + back link.
- **Header**: brand tile, name (+ docs link), category chip, `StatusChip`,
  last-sync (if connected). Actions when connected: **Test**
  (`testIntegration`, toast pass/fail), **Sync now**
  (`adminActions.syncIntegration(id)` + toast — simulated), **Disconnect**
  (opens a confirm dialog → `adminActions.disconnectIntegration(id)` + toast).
  When not connected: **Connect {name}** opens the same `ConnectDialog` used
  on the marketplace page (imported directly from the index route file).
- **Overview card**: description, Status/Connected date/Last sync/Category
  fact grid, and a `lastError` callout box if present.
- **Configuration card** (`ConfigurationCard`, connected + has schema only):
  editable draft of every `configSchema` field (text/secret with rotate
  button generating a fake `sk_new_...` value/select/toggle), dirty-state
  Discard/Save bar → `adminActions.updateIntegrationConfig(id, draft)`.
  Secret values are masked (`abcd••••••••`) unless the eye toggle is on.
- **Webhooks card** (connected + has webhook events only): displays a fake
  endpoint URL (`https://blissley.app/api/webhooks/{id}`) with presumably a
  copy button and a list of toggleable webhook events (cut off in the read
  range but implied by `WebhooksCard`/`integration.webhookEvents`).
- **Sync activity card** (connected only): presumably a table of
  `integration.syncHistory` entries (`ts, event, status(ok|warn|error),
  detail`) — component referenced but body not fully read.
- **Not-connected state**: centered CTA card ("{name} is not connected" +
  "Connect now" button).
- **Right rail**: Permissions list (scopes, greyed out if not connected),
  "More in {category}" related-integrations list (up to 4, links to their
  own detail pages), Danger zone (Disconnect) when connected.
- **`IntegrationStatus` enum**: `connected | degraded | down | disconnected`.
- **Known gaps**: same simulation caveat as the marketplace — Test/Sync/
  webhook endpoint are all cosmetic; no real integration traffic occurs.

---

## Team

- **Route:** `/admin/team` — file `admin.team.tsx` — sidebar (owner only).
- **Purpose:** operator + physician roster, role assignment, invites, 2FA
  enforcement, and a filtered slice of the audit log for team-related
  events.
- **Header actions**: **Enforce 2FA / 2FA enforced** toggle →
  `adminActions.updateSettingsSection("team", { require2FA: !team.require2FA
  })` + toast; **Invite member** → opens `InviteDialog`.
- **KPI strip**: Active members, Pending invites (warn tone if >0),
  Physicians (count), Session timeout (hours).
- **Members table**: avatar+name/email, role `<select>` (disabled for
  `owner`) → `adminActions.updateTeamMemberRole(id, role)` + toast, status
  `Pill` (active/invited/suspended), last login (relative), **Remove**
  button (disabled for owner) → `adminActions.removeTeamMember(id)` + toast.
- **Pending invites list** (conditional): email, role/sent/expiry meta,
  **Copy link** (writes a `/join?token=` URL to clipboard, toast), **Resend**
  (**toast only, no store action — known gap**, does not actually reset the
  invite's timer), **Revoke (X)** → `adminActions.cancelInvite(id)` + toast.
- **Physician panel table**: name/avatar, cases reviewed, avg response
  (color-coded: red >12h, amber >6h, green else), deny rate %, status
  (hardcoded "Active" `Pill` for every physician — not derived from a real
  active/inactive flag).
- **Role permissions reference**: 4 static cards (Owner/Ops/Support/
  Clinical) describing scope — informational only, not interactive.
- **Recent team activity**: last 8 `s.auditLog` entries matching
  `/team|member|invite|role/i` on the action text, "View full audit log →"
  links to `/admin/settings/compliance`.
- **Invite dialog**: email + role picker (Support/Ops/Clinical cards, Owner
  excluded) → `adminActions.inviteTeamMember(email, role)` + toast, basic
  `@` validation only.
- **Known gaps**: "Resend" invite is a toast-only stub.

---

## Reports

- **Route:** `/admin/reports` — file `admin.reports.tsx` — reached only via
  the "New report" link on the Analytics Overview page (not in the main
  sidebar).
- **Purpose:** a single scrollable "board pack" style report combining
  revenue mix, acquisition mix, traffic trends, a signup-timing heatmap, and
  cohort retention — read-only, no filters or exports.
- **Revenue by program**: animated horizontal bars from `revenueByProgram()`,
  static "+14.2% MoM" badge (hardcoded).
- **Acquisition mix**: color-coded list + a stacked single-row bar from
  `acquisitionMix()`.
- **Traffic over time**: 4-week grouped bar chart (Paid/Organic/Direct/
  Referral) from `trafficOverTime()`, animated bar-height reveal.
- **Signup timing heatmap**: 7×6 grid (days × 4-hour buckets) from
  `trafficHeatmap()`, cell intensity = coral tint scaled to value/max.
- **Cohort retention table**: same `cohortRetention()` data as the Retention
  analytics page, rendered with a `color-mix` green gradient per cell instead
  of the Retention page's opacity-based coral gradient (visually distinct
  restyling of the same dataset).
- **Known gaps**: entirely static/read-only — no way to change date range,
  export, or drill into any number from this page.

---

## Build

Five sibling routes under `/admin/build/*`, all owner-only except Intake
(owner/clinical). Together they model a lightweight website/funnel/commerce
CMS layered on top of the telehealth product.

### Funnel builder — `/admin/build/funnel`

- **File:** `admin.build.funnel.tsx`.
- **Purpose:** visual editor for the patient journey (quiz → loading → sales
  → confirmation → portal), block-by-block.
- **Journey lane**: horizontal scrollable row of `FunnelNode` cards (one per
  `s.build.funnel` entry), colored accent bar per node `type`, block count,
  a "Preview ↗" link to the node's real front-end URL (`NODE_META` maps
  type → path, e.g. `quiz → /intake/weight-loss`), arrows between nodes.
  Clicking a card selects it as `activeId` for the editor below.
- **Publish** button (header) → `adminActions.publishFunnel()` + toast
  "Funnel published," and bumps the displayed `v{version}` badge —
  genuinely increments `s.build.funnelVersion` in the store, though it has
  no effect on the live front-end routes (those are static app routes, not
  generated from this builder).
- **Node editor**: add-block control (`<select>` of block kinds: hero, step,
  plan-card, cta, faq, quiz-screen + **Add block** button →
  `adminActions.addFunnelBlock(node.id, kind)`); each existing block shows a
  kind `Pill`, title, a **Delete** (trash icon) →
  `adminActions.deleteFunnelBlock(node.id, block.id)` + toast, and an
  editable grid of every `block.props` key/value pair, each input `onBlur` →
  `adminActions.updateBlockProp(node.id, block.id, key, value)`.
- **Empty state**: "No blocks yet — add one above."
- **Known gap**: none of this actually re-renders the marketing site; it's a
  self-contained CMS-style data model with no connection to the real
  front-end page components.

### Intake builder — `/admin/build/intake`

- **File:** `admin.build.intake.tsx`.
- **Purpose:** edit the multi-screen medical intake quiz, with clinical
  screens hard-locked against edits.
- **List rail**: every `s.build.intakeScreens`, ordered, with a lock icon for
  `locked` (clinical) screens and an eye-off icon for inactive ones; clicking
  selects the screen for editing.
- **Screen editor**: name/question/type/required/storeAs/klaviyoEvent fields
  — **all disabled when `screen.locked`** except the Klaviyo-event field,
  which remains editable even on clinical screens; **Active/Hidden** toggle
  → `adminActions.toggleIntakeScreenActive(id)` + toast. For `single`/`multi`
  types, an answers list with per-answer delete (`removeIntakeAnswer`, hidden
  when locked) and an "Add answer" form (`addIntakeAnswer`).
- **Direct feed to CRO**: this is the same `s.build.intakeScreens` collection
  consumed by `intakeScreenDropoff()` on the Funnel & CRO analytics page —
  editing a screen's `type`/`locked` state here changes the friction-score
  inputs used there (a genuine cross-page data dependency, not just cosmetic).

### Products & pricing — `/admin/build/products`

- **File:** `admin.build.products.tsx`.
- **Purpose:** manage the medication catalog, subscription plans, upsells,
  and discount codes as four tabs.
- **Tabs**: Products, Plans, Upsells, Discounts — local `tab` state, each
  with its own count badge.
- **Products table**: name/internal name, molecule, form, pharmacy + backup,
  badge, status (`StatusPill`: live=success/draft=warn/else neutral),
  **Archive** action (hidden once already archived) →
  `adminActions.archiveBuildProduct(id)` + toast.
- **Plans table**: display name + weeks-supply, linked product name,
  duration, first price, ongoing price (+ savings note), badge, **Preselect**
  toggle switch → `adminActions.updateBuildPlan(id, { preselected: !v })`,
  status.
- **Upsells table**: display name+description, position, price, type, order,
  status — **read-only, no action column** (no edit/toggle handlers found).
- **Discounts table**: code (mono chip), type, amount (percent or dollar),
  applies-to, uses, **Auto-apply** toggle →
  `adminActions.updateBuildDiscount(id, { autoApply: !v })`, status.
- **Known gaps**: Upsells table has no interactive controls at all despite
  being visually identical in style to the other three tabs; there's no
  "add new" affordance on any of the four tabs (no create-product/-plan/
  -upsell/-discount button anywhere on this page).

### Email flows — `/admin/build/emails`

- **File:** `admin.build.emails.tsx`.
- **Purpose:** manage Klaviyo-style lifecycle email flows.
- **Header**: **Sync all** → `adminActions.syncAllEmailFlows()` + toast
  "Synced to Klaviyo" (simulated — no real Klaviyo call).
- **KPI strip**: Total flows, Live (status==="live" count), Total emails
  (Σ `f.emails`), Klaviyo synced (`{n}/{total}`).
- **Table**: flow name, email count, Klaviyo sync status (relative time or
  "Not synced"), last edited (relative), status `Pill`
  (live/draft/other), and per-row **Pause/Enable** toggle
  (`adminActions.toggleEmailFlow(id)`) + **Sync** button
  (`adminActions.syncEmailFlow(id)` + toast).

### Pages — `/admin/build/pages`

- **File:** `admin.build.pages.tsx`.
- **Purpose:** list marketing/portal pages with publish/preview controls.
- **Grid of cards** (one per `s.build.pages`): name, real URL (external
  link), status `Pill` (live/warn), "Last published {relative}", **Publish**
  button (`adminActions.publishBuildPage(id)` + toast) and a **Preview**
  external link to the page's real URL.
- **Known gap**: "Publish" only flips an in-memory `lastPublishedAt`
  timestamp/status flag; it does not regenerate or deploy any actual page
  content (the pages themselves are static app routes elsewhere in the
  codebase, unconnected to this builder's data).

---

## Settings

`/admin/settings` is a layout route (`admin.settings.tsx`) rendering a
persistent left sub-nav (3 groups: Account, Operations, Compliance) plus an
`<Outlet />`. `/admin/settings/` itself redirects to `/admin/settings/general`.

### Layout chrome
- **Sub-nav groups**:
  - Account: General, Plan & Billing, Team
  - Operations: Pharmacy Routing, States Served, Notifications, Integrations
  - Compliance: Compliance & HIPAA, Legal & Policies
- Active item = filled ink pill; `/admin/settings/general` is also treated
  as active when the pathname is bare `/admin/settings` (pre-redirect edge
  case).
- Every settings sub-page uses shared primitives from
  `src/components/admin/settings/primitives.tsx`: `PageHeader`,
  `SettingsCard` (bordered card with label/description/action slot, optional
  `warn`/`danger` border tint), `Field`, `TextInput`, `Select`, `Toggle`
  (animated switch), `CheckRow` (checkbox row), `SaveBar` (sticky
  bottom bar that only renders when `dirty` is true, with Discard/Save
  buttons — a `saving` prop shows "Saving…" but no page in this codebase
  actually passes an async saving state, so saves are effectively
  instantaneous).

### General — `/admin/settings/general`

- **Purpose:** legal business info, contact details, and brand identity.
- **Business card**: legal name, DBA, EIN, business type (`<select>` of 4
  canned options), registered state (`US_STATE_LIST`), address/city/state/
  ZIP.
- **Contact card**: support email, transactional email, support phone,
  website, patient portal URL.
- **Brand card**: logo upload (`FileReader` → data-URL, stored directly in
  state — no real upload/storage), color picker + hex text input, live
  preview panel (logo or "Blissley" wordmark + a sample button rendered in
  the chosen brand color).
- **Danger zone**: **Reset all demo data** → `confirm()` →
  `adminActions.resetAll()` + toast — wipes/reseeds the entire admin store.
- **Save mechanics**: three independent draft objects (`business`,
  `contact`, `brand`) each diffed via `JSON.stringify` against the store;
  a single `SaveBar` commits whichever sections are dirty via
  `adminActions.updateSettingsSection(section, values)`.

### Plan & Billing — `/admin/settings/plan-billing`

- **Infrastructure costs card** (read-only): Active patients (live count),
  Stripe fees/Klaviyo/Hosting (**three hardcoded dollar figures** — $3,783/
  $1,200/$800 — known gap, not derived from real usage), summed total in a
  dark banner.
- **Stripe card**: account id (mono), Connected badge + date, Live/Test mode
  badge, two informational compliance badges ("Stripe Healthcare,"
  "LegitScript" — always shown as success regardless of any real state,
  known gap/cosmetic), editable Charge model / Payout schedule selects,
  read-only "Payout bank" field. "Stripe dashboard ↗" link is a bare `href="#"`
  — **known gap, does not go anywhere real**.
- **Plan Pricing card**: two `PricingBlock`s (Semaglutide, Tirzepatide), each
  with 4 editable dollar fields (Monthly-first, Monthly-ongoing, 3-Month,
  6-Month) bound to `s.settings.pricing`; an Upsells sub-panel (Priority
  Review, Shipping Insurance) with numeric inputs.
- **Save mechanics**: same dirty-diff + `SaveBar` pattern, calling
  `updateSettingsSection("stripe", ...)` and `adminActions.updatePricing(...)`.

### Team (settings) — `/admin/settings/team`

- Near-duplicate of the top-level `/admin/team` page's member table, but
  scoped inside Settings and without the physician panel or audit-log
  excerpt. Same actions: role `<select>` (`updateTeamMemberRole`), **Remove**
  (`removeTeamMember`, `confirm()`-gated here unlike the top-level page),
  pending-invite **Cancel** (`cancelInvite`), an inline **Send invite** form
  (`inviteTeamMember`), a static Roles & Permissions reference grid (4 cards,
  duplicated copy from the top-level Team page's `ROLES` array), and an
  Authentication card (2FA toggle + session-timeout select, both wired to
  `updateSettingsSection("team", ...)`).
- **Known gap / duplication**: this page and `/admin/team` maintain two
  separate, slightly different implementations of essentially the same
  member-management UI against the same `s.settings.team` data — a genuine
  product redundancy rather than a bug, but worth flagging as inconsistent
  IA (two places to manage the same roster with different affordances).

### Pharmacy Routing — `/admin/settings/pharmacy-routing`

- **Auto-routing rules card**: one row per `s.settings.routing.rules`
  (by product: sema_injectable, tirze_injectable, oral_glp1, ed_peptides),
  each with Primary/Backup pharmacy `<select>`s →
  `adminActions.setRoutingRule(product, "primaryId"|"backupId", value)` +
  toast, plus a status line showing the resolved primary/backup names and an
  "API connected" badge if applicable.
- **Pharmacy contacts card**: grid of `s.settings.routing.pharmacies`
  (contact name/email/phone, status pill, states-covered count, optional
  warning note) — **read-only**, no edit affordance on this page (contacts
  appear to be seed data only).
- **South End · Version A compliance card**: clinical/regulatory framing
  (titration schedule info box) with a **Version A enforced** toggle →
  `adminActions.toggleVersionA(v)` + a `toast.success`/`toast.warning` split
  by direction, and a caption crediting who/when confirmed it
  (`versionAConfirmedBy`/`versionAConfirmedAtISO`, both static seed values —
  toggling does not update these fields, known gap: the "confirmed by/at"
  caption never reflects the person who actually flipped the toggle).

### States Served — `/admin/settings/states`

- **Coverage summary**: Currently serving (`enabledCount`/50), Not yet
  serving (`50 - enabledCount`), Waitlist (Active/Off from `autoNotify`).
- **State toggle grid**: all 50 states as clickable cards (search-filterable
  by name/code), each showing SE/WR badges when `primary`/`backup` coverage
  flags are set, a green check circle when enabled →
  `adminActions.toggleServedState(code, !enabled)` + toast. "Turning off a
  state stops new intake — existing patients are unaffected" caption is
  descriptive only (the toggle itself doesn't distinguish new-vs-existing
  patients in any visible way beyond this copy).
- **Waitlist card**: table of up to 8 top-waitlisted **not-yet-served**
  states sorted by `waitlistCounts` descending, each with **Notify all** →
  `adminActions.notifyWaitlist(code)` + toast (simulated Klaviyo/SMS blast);
  a Klaviyo-list `<select>` (3 canned list names) and an **Auto-notify when
  state goes live** toggle.

### Notifications — `/admin/settings/notifications`

- **Admin alerts card**: 4 grouped checklists (Clinical/Operations/
  Financial/Growth, `GROUPS` constant) of `AlertKey` toggles, each
  `CheckRow` → `adminActions.toggleAlertKey(key)` (saves instantly, no
  `SaveBar` on this page — every control here commits immediately).
- **Alert delivery card**: email-recipient chips (add via form validating
  `@`, `adminActions.addAlertEmail`/`removeAlertEmail`), SMS recipient text
  field (`updateSettingsSection("notifications", { smsRecipient })`), and a
  static "Urgent = …" threshold-definition caption box.
- **Digest card**: Daily/Weekly toggles + time/day selects
  (`adminActions.updateDigest({...})`), and a checklist of 7 digest content
  items (`DIGEST_ITEMS`) toggled via `adminActions.toggleDigestItem(key)`.

### Integrations (settings summary) — `/admin/settings/integrations`

- **Purpose:** a condensed health dashboard mirroring the full Integrations
  marketplace, scoped to "critical infrastructure" (Stripe, LifeFile EHR, Dr
  Telx, Klaviyo, Mercury — matched by fuzzy name substring) and "Analytics"
  (Meta Ads, Meta Pixel/CAPI, Google Analytics 4) integrations only.
- **Status card**: Connected/Degraded/Down/Not-connected counts.
- **Two `IntegrationList` cards** (Critical infrastructure, Analytics): each
  row shows logo/monogram, name+description, `StatusPill`, last-sync
  (desktop only), and a **Manage** link to the full detail page
  (`/admin/integrations/$id`) — this page itself has no connect/disconnect
  actions, it's purely a curated read-only subset with deep links out.
- **"Open marketplace →"** header button links to `/admin/integrations`.

### Compliance & HIPAA — `/admin/settings/compliance`

- **HIPAA status card**: static "Compliant" badge + a 7-item checklist
  (`CHECKLIST`) reading `s.settings.compliance.hipaaChecklist[key]` — pass/
  review pill per item, but **no control to change these flags anywhere on
  the page** (read-only display, known gap if the intent was to make this
  editable).
- **BAA table**: `s.settings.compliance.baa` rows (vendor, status: signed/
  website_tos/pending/missing, doc type, date, note); **Upload BAA** button
  expands an inline mini-form (vendor + doc-type select) →
  `adminActions.uploadBAA({...})` + toast — always creates a `"signed"`
  status entry regardless of the doc type chosen.
- **LegitScript card**: static certification/since/renewal facts.
- **Audit log card**: full `s.auditLog` (every admin action across the
  entire app is logged here, per the caption "Every admin action is logged
  automatically. Cannot be disabled or deleted"), with Actor and
  "Action contains" text filters, a working **Export CSV**
  (`downloadCsv`), and a table capped at the first 100 filtered rows
  (Time/Actor/Action/Target/Meta columns, Target/Meta hidden on
  small/medium screens).
- **Physician license monitoring card**: a **Notify me 60 days before
  expiry** toggle (`updateSettingsSection("compliance", {
  licenseExpiryAlerts })`) plus a **fully hardcoded** 4-physician license
  table (`PHYSICIAN_LICENSES` constant — not derived from `s.physicians`).

### Legal & Policies — `/admin/settings/legal`

- **Platform documents card**: `s.settings.legal.docs` list (label, URL,
  last-updated), each with a **View ↗** external link and an **Edit**
  button opening a modal textarea bound to `adminActions.updateLegalDoc(key,
  body)` — editing here only updates the in-app document body/timestamp, it
  does not publish anything to the real marketing site's legal pages.
- **Patient consent records card**: descriptive bullet list + a working
  **Export CSV** button that generates 50 **synthetic** consent rows
  (fabricated IP addresses, alternating SMS-consent flags by index) rather
  than any real captured consent data — known gap, this export looks like a
  compliance artifact but is generated fake data.
- **Pending legal items card** (`tone="warn"`): a single hardcoded narrative
  callout about an "OpenLoop Health chargeback" — static content, not tied
  to any data model, presumably a placeholder for a real legal-ops feed.
- **Entity information card**: legal name/formation state/date/EIN/
  registered agent/bank from `s.settings.legal.entity`, plus a DBA-filings
  chip list — all read-only display, no edit controls anywhere on this
  section despite the rest of Settings generally being editable.

---

## Admin theme scope (CSS)

**File:** `src/styles.css`, the `.admin-scope` block (applied to the
`AdminShell` root `<div className="admin-scope ...">`), lines ~245-261:

```css
.admin-scope {
  --color-canvas: #f6f6f7;   /* page bg */
  --color-ink: #0f172a;      /* slate-900 primary text */
  --color-ever: #ee7273;     /* danger / failed / churn — kept coral */
  --color-check: #10b981;    /* emerald — success / positive */
  --color-honey: #f59e0b;    /* amber — warn / AOV */
  --color-marine: #2563eb;   /* indigo — primary accent / active */
  --color-bluebell: #7c3aed; /* violet — MRR / secondary accent */
  --color-blush: #ee7273;    /* alias to danger */
  --color-mist: #e5e7eb;     /* hairline */
  --color-hairline: #e5e7eb;
}
.admin-scope ::selection {
  background: var(--color-marine);
  color: #ffffff;
}
```

This rebinds the site-wide design-token custom properties (defined at
`:root` for the marketing site — `--color-canvas: #ffffff`, `--color-ink:
#171717`, `--color-marine: #1D437B` navy, `--color-check: #4a7c6f` sage,
`--color-honey: #c4a265` gold, etc.) to a distinct, higher-contrast
"operator console" palette scoped only to descendants of `.admin-scope`.
The practical effect: the marketing site uses warm/muted brand colors
(navy `#1D437B`, sage green, gold), while the entire admin panel uses a
crisper SaaS-dashboard palette (indigo `#2563eb`, emerald `#10b981`, amber
`#f59e0b`, coral `#ee7273` for danger) and a cooler off-white canvas
(`#f6f6f7` vs. pure white). Text selection color inside the admin is also
overridden to indigo. No other admin-specific rules exist in `styles.css`
beyond this token rebind and the selection-color rule — all admin layout/
spacing/typography is done via Tailwind utility classes directly in the
component files, not through additional scoped CSS.

---

## Cross-cutting known gaps

Summarized from the per-screen sections above, for quick reference:

1. **Global search bar** in the AdminShell header has no handler — no
   results, no keyboard shortcut wired at the shell level (`⌘K` badge is
   decorative except on the Integrations marketplace, which has its own
   local `⌘K` → focus-search implementation).
2. **"New patient" and "Help" header buttons** have no handlers.
3. **Onboarding progress ring** in the sidebar is frozen — no action anywhere
   advances `tenant.onboardingStep`.
4. **Home dashboard**: pipeline strip (5 tiles), right-rail Quick Actions
   buttons/lookup input, and most KPI-tile delta percentages are hardcoded/
   non-interactive.
5. **List-page toolbars** (Patients, Leads, Orders indices): Export/Import/
   Print/"Add"/"Create"/bulk-action buttons are almost universally
   unwired — the pattern is consistent enough to treat as a deliberate
   "chrome for demo realism" choice rather than isolated bugs, but every
   instance is a genuine functional gap if a reviewer expects them to work.
6. **Physician case detail & Check-in detail**: the clinical "intake
   answers"/"patient answers" panels are hardcoded/synthetic per-row text,
   not sourced from a real intake data model, despite looking like real
   patient responses.
7. **Simulated integrations/infrastructure**: every "Test," "Sync," "Ping
   API," "Print label," "Send receipt," "PDF export," and "Publish" action
   across Orders, Pharmacy, Integrations, and Build is a local state flip +
   toast — there is no backend, so none of these perform real external
   actions. This is a property of the whole prototype, not a defect in any
   one screen, but is called out per-screen above wherever a control's
   surface language ("transmitted," "synced," "printed," "emailed") might
   otherwise imply real I/O.
8. **Duplicate Team management UI**: `/admin/team` and
   `/admin/settings/team` both manage the same roster independently.
9. **Command center's physician-queue card** is hardcoded and disconnected
   from the real `s.cases` collection that powers `/admin/physician-queue`.
10. **Finances analytics page** (`/admin/analytics/finances`) is almost
    entirely static mock data (income statement, unit economics, payables)
    aside from MRR/ARR and revenue-by-program.
11. **Consent-record and physician-license exports** (Settings → Legal,
    Settings → Compliance) generate fabricated data rather than exporting
    real captured records.
12. Money formatting is inconsistent (`formatMoney()`'s cents-vs-dollars
    heuristic threshold at 10,000) — some screens display cents-based
    amounts and others dollar-based amounts using the same helper; readers
    integrating with this data should verify units per call site rather
    than assuming one universal convention.
