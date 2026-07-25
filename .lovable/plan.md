
# Analytics Redesign — Telehealth MVP v1

The current `/admin/analytics` is 4 KPI cards + a waterfall + funnel — too sparse, generic e-com. Shopify's analytics reference (uploaded) shows dense 3-col grids, mini charts with dashed prior-period overlays, cohort heatmaps, breakdown tables, geo/device donuts. We want that density but reframed for telehealth-as-DTC: patients not customers, MRR not GMV, refills not repeat orders, physician review not fulfillment.

## What clear looks like

Every card = one metric, big number top-left, delta chip, tiny "vs prior 30d" label, chart underneath filling the card. Everything animates in on scroll. Everything is responsive: 3-col desktop, 2-col tablet, 1-col mobile. Same rounded-xl white cards, ink borders at 0.06 opacity, tabular-nums, `font-hero` for the big numbers.

## Structure of the new `/admin/analytics` overview

Top bar (sticky within main scroll):
- Title "Analytics" + last-refreshed timestamp
- Date range chip (Last 30 days · custom picker), Compare chip (vs prior period), Currency (USD)
- Right side: "Export" + "New report" ghost buttons

Insight strip (Shopify's "Insight" pattern):
- One highlighted card: "Refill conversion on tirzepatide 3-mo dropped 12% vs 3 weeks ago" · sparkline · "See why" — pulled from selectors, deterministic per scenario.

Section 1 — Revenue (3-col grid):
1. Net revenue over time — line + dashed prior period, big number + delta
2. MRR breakdown — donut (New/Expansion/Reactivated/Contraction/Churn) centered total
3. Active patients over time — line

Section 2 — Acquisition & funnel (3-col):
4. Sessions over time
5. Conversion rate breakdown — 4 stacked bars (Sessions → Intake → Approved → Paid), each with % and delta
6. AOV over time — line

Section 3 — Clinical operations (3-col, telehealth-native, replaces Shopify's cohort row):
7. Physician review SLA — bar chart median minutes per day + p90 dashed
8. Approval rate — line, target band shaded
9. Refill adherence — line, % on Rx at day 60

Section 4 — Retention (2-col):
10. Cohort heatmap — 6×6 retention (reuse `cohortRetention`), rows animate in staggered
11. Churn reasons — horizontal bars

Section 5 — Geography & devices (3-col):
12. Sessions by state — horizontal bars top 6 US states with delta
13. Device mix — donut mobile/desktop/tablet
14. Traffic sources — horizontal bars (Meta / Google / Email / Organic / Affiliate)

Section 6 — Top movers table (full width):
- Programs by net revenue, columns: Program, Patients, New MRR, AOV, Refill %, Churn %, sparkline. Sortable.

Section 7 — Payments health (3-col):
- Failed payments over time · Recovery rate · Chargebacks

Footer strip: sub-page pills (Acquisition, Funnel, Retention, Finances) — keep existing sub-routes untouched.

## Technical

- New primitives in `src/components/admin/analytics/`:
  - `MetricCard.tsx` — big-number + delta + optional chart, replaces sparse `KpiCard` for this page only
  - `LineChartMini.tsx` — SVG line with dashed prior-period overlay, viewBox-scaled, no libs
  - `Donut.tsx` — SVG donut with centered total
  - `HBar.tsx` — horizontal bar row (label / bar / value / delta)
  - `BreakdownBars.tsx` — vertical stacked funnel bars (Shopify conversion-rate style)
  - `Heatmap.tsx` — cohort grid (extract from retention route)
- Framer Motion: each card wrapped in `motion.div` with `whileInView` fade+rise (y:12, opacity:0 → y:0,1), viewport once, stagger via container. Number rolls via existing `CountUp`.
- Selectors: extend `src/lib/admin/selectors.ts` with `physicianSLATrend`, `approvalRateTrend`, `refillAdherenceTrend`, `sessionsByState`, `deviceMix`, `paymentsHealth`, `programMovers`, `insightHeadline`. All pure over `AdminState`, so scenario switch reflows.
- Responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Charts use `viewBox` + `preserveAspectRatio="none"` so they fill any width; height fixed per card row.
- Preserve sub-routes at `/admin/analytics/{acquisition,funnel,retention,finances}` — only overview page changes. Keep `mrrWaterfall` and `funnelData` selectors used elsewhere.
- No new deps. Motion is already in the project.

## Out of scope

Sub-routes stay as-is. Existing store shape unchanged; only new pure selectors added. No backend, no cloud — this is the demo dashboard.
