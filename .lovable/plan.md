# Blissley Admin Dashboard — MVP1

A complete end-to-end operator console for Blissley, styled to match the Cuvo reference PDF and the uploaded dashboard inspiration images, but rendered in **our brand system** (Canvas `#F8F5EF`, Ink `#171717`, Coral `#ee7273`, font  Google Sans Serif +  lexenda or manrepo never use Inter — same tokens as `/portal/patient` and `/portal/physician`). Fully client-side (no backend), driven by a seeded store like the other portals so every number, chart, list, and interaction is live and consistent.

## Routes

```text
/login/admin              Magic-link style login (matches /login/physician pattern)
/admin                    Shell + Dashboard (home)
/admin/command            Command Center (live ops)
/admin/patients           Patients list + detail drawer
/admin/leads              Quiz-started, no-purchase list
/admin/orders             Orders + tracking
/admin/payments           Stripe-style charges / refunds / failed
/admin/messages           3-panel unified inbox
/admin/reports/acquisition
/admin/reports/revenue
/admin/reports/funnel
/admin/reports/retention
/admin/settings           Integrations, team, states, pharmacies
```

All admin routes sit under a shared shell (`AdminShell`) with sidebar + top bar, gated by an admin session flag in the store. First visit after login runs a 3-step onboarding overlay (Welcome → Tour the sidebar → Live pipeline explainer), matching the patient/physician portal onboarding style.

## Design system (reusing existing tokens)

- Canvas background, white cards with `rounded-2xl` + subtle border, coral for primary CTAs and highlight bars, black for numbers, muted grey for context lines — same visual language as `/portal/physician`.
- No new fonts, no new palette. Cuvo layout structure, Blissley skin.
- Sidebar: white, ink text, coral pill for active item, small section labels (`ANALYTICS`, `BUILDERS`) exactly like the spec.
- Mobile: sidebar collapses to a bottom tab bar (5 primary: Dashboard, Command, Patients, Messages, Reports) with a "More" sheet for the rest — same pattern as `/portal/patient`.  
  
without making a copy of cuvo make it exactly like that but much better   
make it mobile responsive and desktop and tabet both   
check all these images and cuvo too and create a better UI 

## Screens (what ships in MVP1)

**1. Dashboard (`/admin`)**

- Top bar: logo + "All systems operational" pill + search + date range dropdown + Add Patient + notifications + profile.
- Row 1 — 5 KPI cards: Current MRR, Net Revenue, Active Patients, AOV, Retention Rate (number, delta chip, context line).
- Row 2 — 3 columns: Today's Revenue + sparkline & MRR Movement bar chart; Revenue by Program horizontal bars + Acquisition donut; Patient Funnel waterfall (8 stages, each row clickable → filtered patients).
- Row 3 — Live pipeline strip (5 clickable counts).
- Row 4 — Task Center table (tabs: All / Billing / Patient ops / Admin / Unassigned) + Quick Actions panel (New order, Update billing, Quick lookup search).

**2. Command Center (`/admin/command`)**

- Large live pipeline tiles.
- Physician queue table (flagged / new / refills) linking through to `/portal/physician` case IDs.
- Today's activity log (timeline).
- Alerts requiring action (failed payments, delayed shipments, overdue check-ins, pending refunds) — each with a resolve action.

**3. Patients (`/admin/patients`)**

- Search + status filters + CSV export button.
- Table: Patient, Status, Program, LTV, MRR, Since, Churn risk (Low/Med/High/Critical badge computed from seed), Actions.
- Row click → right-side drawer with patient summary, order history, message thread link, quick actions (assign to Dr. Nass, send magic link, flag, view full record). No separate detail route in MVP1 — the drawer covers it.

**4. Leads (`/admin/leads`)**

- Quiz-started-but-didn't-purchase list. Columns: Name/email, Last step reached, Program interest, Source, Age of lead, Actions (send nurture, mark contacted).

**5. Orders (`/admin/orders`)**

- List with status pills (Processing / At pharmacy / Shipped / Delivered / Exception), tracking column, filters. Row → drawer with shipping timeline (reuse the confirmation-page timeline component) and Reship / Refund actions.

**6. Payments (`/admin/payments`)**

- Stripe-style ledger: charges, refunds, failed. Filters + status pills. Row → drawer with retry / refund actions. Failed-payments count wired to Dashboard alerts.

**7. Messages (`/admin/messages`)** — Cuvo's inbox model

- 3-panel layout: conversation list (Your inbox / Mentions / All + status dots), active thread (with internal Note toggle), patient sidebar (LTV, program, orders, notes, quick actions).
- Reuses the message bubble styling from `/portal/physician` for consistency.
- Mobile: single-panel with back navigation between the three.

**8. Reports**

- **Acquisition**: 6 KPI cards, Traffic Over Time line chart, New vs Returning, Session Flow sankey-ish drop-off diagram, Traffic Rhythm heatmap (7×6 grid), Channel Mix donut, Conversion by Channel bars, Top Landing Pages list.
- **Revenue & P&L**: Revenue KPIs, MRR Waterfall, Revenue by Program table, full P&L statement, Unit Economics (CAC / LTV / LTV:CAC / payback / churn breakdowns).
- **Funnel**: 8-row conversion waterfall with drop-off column, each row clickable to Patients filtered by stage.
- **Retention**: Cohort table (6 months × 6 columns) with green→red heat coloring, churn reason breakdown, churn by plan, churn by program month.

**9. Settings (`/admin/settings`)**

- Integrations status list (Stripe, Klaviyo, pharmacies, SMS, Dr. Nass) with live/red dots.
- Team & roles list.
- Pharmacy routing rules (reuses pharmacy chips from physician portal).
- States served toggles.
- Notification prefs.

**10. Login (`/login/admin`)**

- Split screen matching `/login/physician`: editorial left panel with "Blissley Operator Console" copy, right side email + magic-link button. Any email logs in (client-only) and lands on `/admin` with onboarding overlay on first visit.

## Data & interactivity

New store `src/lib/admin/store.ts` (same `useSyncExternalStore` + `localStorage` pattern as `portal/store.ts`). Seeds:

- ~40 patients across statuses (active / pending / paused / failed / cancelled) with LTV, MRR, program, churn risk, join date.
- ~30 orders with realistic statuses and tracking milestones.
- ~30 payments (charges + refunds + failed).
- ~15 leads (quiz-started, drop stage).
- ~20 conversations across 4 channels (in-app, SMS, email, WhatsApp) with threads.
- ~12 tasks for the Task Center.
- Time-series arrays for KPIs, MRR waterfall, funnel counts, cohort retention, traffic-by-channel, hour×weekday heatmap, channel mix.
- Session flag for admin auth + `onboardingComplete`.

Actions cover: change date range (recomputes KPIs from seed), resolve task, assign conversation, send reply (with simulated auto-reply like the other portals), retry payment, issue refund, reship order, flag patient, drill into any funnel/pipeline segment (filters the Patients page via query param).

## Charts

Reuse `Chart.js` (already in the project for `WLCalculator`) for all charts to avoid a new dependency. Waterfall, donut, line, horizontal bars, sparkline, heatmap (rendered as a CSS grid of colored cells — no library needed) — all styled with brand tokens.

## Responsiveness

- ≥1280px: full sidebar + multi-column layouts as spec'd.
- 768–1279px: sidebar collapses to icon rail; columns reflow to 2-up.
- <768px: bottom tab bar, single-column stacked cards, drawers become full-screen sheets, Messages is single-panel with back nav. Same responsive rigor as `/portal/patient`.  
  
give clear demo for each variation when we long hold on logo it shows all the options same like /patient/portal

## Files to create

```text
src/routes/login.admin.tsx
src/routes/admin.tsx                        (shell + index redirect to dashboard)
src/routes/admin.index.tsx                  (Dashboard)
src/routes/admin.command.tsx
src/routes/admin.patients.tsx
src/routes/admin.leads.tsx
src/routes/admin.orders.tsx
src/routes/admin.payments.tsx
src/routes/admin.messages.tsx
src/routes/admin.reports.acquisition.tsx
src/routes/admin.reports.revenue.tsx
src/routes/admin.reports.funnel.tsx
src/routes/admin.reports.retention.tsx
src/routes/admin.settings.tsx

src/lib/admin/store.ts                      (state + seeds + actions)
src/lib/admin/seeds.ts                      (extracted large seed data)

src/components/admin/AdminShell.tsx         (sidebar + topbar + mobile tabs + onboarding)
src/components/admin/KpiCard.tsx
src/components/admin/MrrWaterfall.tsx
src/components/admin/FunnelWaterfall.tsx
src/components/admin/LivePipeline.tsx
src/components/admin/TaskCenter.tsx
src/components/admin/RevenueByProgram.tsx
src/components/admin/AcquisitionDonut.tsx
src/components/admin/TrafficHeatmap.tsx
src/components/admin/SessionFlow.tsx
src/components/admin/CohortTable.tsx
src/components/admin/PnlStatement.tsx
src/components/admin/PatientDrawer.tsx
src/components/admin/OrderDrawer.tsx
src/components/admin/MessagesPanel.tsx
src/components/admin/Onboarding.tsx
```

## Out of scope (V2, matching your list)

Multi-brand switcher, creator/affiliate tracking, A/B test results, predictive churn ML, inventory, auto physician assignment, LTV projection modeling, custom report builder, API access.

## Deliverable

A complete, click-anything-and-it-works admin console with realistic seed data, matching the polish of `/portal/patient` and `/portal/physician`, and visually aligned with the Cuvo reference. Every button leads somewhere, every number is consistent across screens, and mobile works as well as desktop.