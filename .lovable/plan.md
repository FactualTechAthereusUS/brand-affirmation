
# /admin/analytics — logic optimization (no UI revamp)

Goal: make every number, delta, chart overlay, and control on `/admin/analytics` (and its 4 sub-pages) computed from `AdminState`, not hardcoded strings. Keep the current Shopify-inspired layout. Borrow only three behaviours from the reference dump: date-range + compare picker, prior-period overlay everywhere, and computed "Increase/Decrease of X%" deltas.

## What's broken today

Inspected `admin.analytics.tsx` + `lib/admin/selectors.ts`:

- Date-range / Compare / Currency / Export / New report buttons — inert.
- Deltas on `MetricCard`s ("+8.1%", "−63%", "+38%") are hardcoded strings.
- "Prior period" line is `priorPeriodShift` — just current × ~0.92 with noise, not the real prior window.
- `sessionsByState` multiplies patient share × magic `12480`.
- `programMovers.refillPct = 62 + ((i*7)%22)` — placeholder.
- `physicianSLATrend` / `approvalRateTrend` / `refillAdherenceTrend` — sinusoidal fakes, don't read `cases` or `checkIns`.
- `paymentsHealth.failed/recovered` — synthesized from `paid`, not from `payments[]`.
- Auto-refresh / Expand / Customize / Hide insights — not present or not wired.
- Sub-pages (`acquisition|funnel|retention|finances`) are 30–107 line stubs; don't share date state with the parent.
- Insight card tone is scenario-only; not derived from the actual biggest mover.

## Plan

### 1. Range + compare state via URL search

- Add `validateSearch` on `/admin/analytics` for `{ range: "7d"|"30d"|"90d"|"ytd"|"custom", compare: "prior"|"yoy"|"none", from?: string, to?: string }`.
- Read via `Route.useSearch()`; write via `useNavigate({ search: prev => ... })`.
- Two popovers on the existing buttons (Radix `Popover` already used elsewhere) with the Shopify set: Today / Yesterday / Last 7 / Last 30 / Last 90 / YTD / Custom; and No comparison / Prior period / Previous year.
- Propagate to `/admin/analytics/{acquisition,funnel,retention,finances}` via `<Link search>`.

### 2. Real selectors (in `src/lib/admin/selectors.ts`)

Add a window helper `slice(s, days)` returning `{ current: FunnelDay[], prior: FunnelDay[] }` using `funnelDays.slice(-2*days,-days)` for prior. Refactor every trend selector to accept this:

- `revenueTrend / sessionsTrend / aovTrend / newPatientsTrend` → return `{ current, prior, dates, sum, priorSum, deltaPct }`.
- `activeTrend` → keep smooth growth curve but derive base from `patients.length`; delta = `patients.filter(active this window) − prior`.
- `physicianSLATrend` → per-day median of `(case.decidedAt − case.submittedAt)/60000` for cases decided that day; `p90` from the same array. Falls back to seed medians if a day has 0 decisions.
- `approvalRateTrend` → `approved/(approved+denied)` per day from `cases`.
- `refillAdherenceTrend` → per-day `clear / (clear+hold+review)` from `checkIns` bucketed by `submittedAt`.
- `paymentsHealth` → count `payments[]` bucketed by day and `status ∈ {succeeded, failed, recovered}`; recoveryRate = recovered / failed.
- `sessionsByState` → real `funnelDays[].sessions * (statePop / totalPatients)` — no magic 12480; add per-state delta from prior window.
- `programMovers` → real `refillPct` from `checkIns` filtered to patients in that program; real `churnPct` from `patients.status==="cancelled"`; real `spark` from that program's daily revenue.

### 3. Deltas from data, not strings

- New `pctDelta(cur, prior)` + `formatDelta({ pct, positiveIsGood })`.
- Remove every hardcoded delta prop on `MetricCard`; pass computed strings + tone (`positive|critical|neutral`).
- Insight banner: `pickTopMover(selectors)` returns the metric whose |ΔPct| is largest, respecting scenario override. `See why →` deep-links to the matching sub-page.

### 4. Auto-refresh

- `useAutoRefresh(intervalMs, enabled)` hook: `setInterval` that calls `store.tick()` (append one new `FunnelDay` shifted forward, cull head). Toggle exposed on the "Turn on auto-refresh" button; shows a live "Last refreshed Xs ago".

### 5. Export CSV

- `exportCsv(name, rows)` helper. Wire the Export button to a small menu: Program movers, Funnel, Cohort retention, Payments health. Downloads a `.csv` blob — no backend.

### 6. Prior-period overlay on charts

- `AreaChart` / `LineChartMini` / `BarsMini` already accept a `prior` array. Pass the **real** prior slice from the selector, not `priorPeriodShift(current)`.
- Add a small legend row under each chart showing "Current / Prior" swatches.

### 7. Sub-pages made real

- `admin.analytics.acquisition.tsx` — Campaigns table sorted by spend, real CAC/ROAS/leads from `campaigns[]`, channel mix donut from `acquisitionSpendMix`, landing-page top list from `funnelDays.sessions` split by seeded referrer weight.
- `admin.analytics.funnel.tsx` — 6-step funnel from `funnelDays`: Sessions → Intake started → Intake completed → Approved → Paid → Shipped; step-to-step conv + drop counts.
- `admin.analytics.retention.tsx` — Cohort heatmap + churn reasons (already there) + returning-customer rate line + LTV by cohort computed from `patients[].mrr * tenureMonths`.
- `admin.analytics.finances.tsx` — MRR waterfall (already exists) + Net revenue vs Refunds bar + Gross-vs-net breakdown table from `payments[]`.

All sub-pages read `useSearch()` from the parent route (same `range/compare`) via `Route.useSearch()` on their own routes with the same `validateSearch`, or via `getRouteApi("/admin/analytics").useSearch()` if we lift it to a shared search schema.

### 8. Insight card

- Replace the scenario-only headline with `pickInsight(state, window)`:
  - Compute WoW % change for each of: netRevenue, activePatients, approvalRate, refillAdherence, failedPayments, sessions.
  - Return the biggest |Δ|, tone `critical` if it's a "bad-direction" metric (failedPayments up, adherence down, approvalRate down), else `positive`.
  - Scenario override retained for demo screenshots.

### 9. Cleanup

- Delete `priorPeriodShift` (replaced by real prior slice).
- Remove hardcoded delta strings from `admin.analytics.tsx`.
- Add a tiny `useAnalyticsWindow(search)` hook that returns `{ days, currentDates, priorDates, currentRange, priorRange }` and pass it to every selector — single source of truth for the window.

## Files touched

- `src/lib/admin/selectors.ts` — refactor + add window helper, real telehealth selectors.
- `src/lib/admin/store.ts` — add `tick()` for auto-refresh; no schema change.
- `src/lib/admin/csv.ts` (new) — CSV export helper.
- `src/routes/admin.analytics.tsx` — wire search state, popovers, auto-refresh, real deltas, real prior overlays, export menu. Keep JSX/layout intact.
- `src/routes/admin.analytics.{acquisition,funnel,retention,finances}.tsx` — replace stub content with real selector-driven blocks; share `validateSearch`.
- `src/components/admin/analytics/MetricCard.tsx` — accept `{ deltaPct?: number; positiveIsGood?: boolean }` and render the pill from that (keeps existing string prop as fallback).

No changes to `AdminShell`, admin theme, or other admin routes.

## Non-goals

- No visual redesign, no new chart types, no new pages.
- No backend / real data source — this stays fully client-side over `AdminState`.
- No changes to `/admin/live` or other admin scopes.
