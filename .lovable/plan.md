## Goal

Unify the entire `/admin/*` surface (shell, nav, home, patients, physician queue, pharmacy, orders, payments, messages, leads, check-ins, reports, integrations, team, settings, live view, and all analytics subpages) under the same visual system already used on `/admin/analytics`: a light Shopify-gray canvas with a semantic indigo/violet/sky/amber/emerald data palette. The public marketing site, intake, sales, checkout, portal, and physician portal remain untouched.

## Design System (admin-only)

Introduce a scoped token set that only applies inside the admin shell. No global `styles.css` recolor — we don't want to bleed into the marketing/portal surfaces.

```text
Canvas      #f6f6f7   page background
Surface     #ffffff   cards
Hairline    #e5e7eb   borders / dividers
Ink         #0f172a   primary text (slate-900)
Muted       #475569   secondary text (slate-600)
Faint       #94a3b8   tertiary / labels

Data palette (semantic, matches /analytics)
  Revenue    #2563eb  indigo-600
  MRR        #7c3aed  violet-600
  Active     #0ea5e9  sky-500
  AOV        #f59e0b  amber-500
  Retention  #10b981  emerald-500
  Warning    #f59e0b
  Danger     #ee7273  (kept — brand coral, doubles as churn/failed)
  Positive   #10b981

Accent (primary action, links, active nav)
  Primary    #2563eb  indigo-600
  Primary/hover  #1d4ed8
```

Density stays tight (12–13px body, 22px section titles, tabular-nums for all metrics), radius `rounded-xl` on cards, `rounded-lg` on controls, subtle `shadow-[0_1px_0_rgba(15,23,42,0.04)]` on cards — same feel as `/admin/analytics`.

## Approach

Rather than sweeping every route in isolation, we retheme the **shell + shared primitives** so most pages inherit the new look automatically, then do targeted passes for the pages that use inline hex/legacy tokens.

### Step 1 — Shell + primitives (biggest visual lift)

Update `src/components/admin/AdminShell.tsx`:
- Page background: `bg-[#f6f6f7]` (was `bg-white`).
- Sidebar: `bg-white` with `border-r border-[#e5e7eb]`; active nav item uses `bg-indigo-50 text-indigo-700` with a 2px indigo left rail; inactive `text-slate-600`.
- Topbar: white with `border-b border-[#e5e7eb]`; search chip `bg-[#f1f2f4]`; primary "Create" button `bg-indigo-600 text-white hover:bg-indigo-700`; avatar circle indigo.
- Role chip / onboarding card: white surface, indigo progress fill.
- `Card` primitive: `bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_0_rgba(15,23,42,0.04)]`.
- `SectionTitle`: slate-900 title, slate-500 subtitle.

Update `src/components/admin/KpiCard.tsx`:
- Tone map → `positive: emerald-600`, `warn: amber-600`, `critical: coral #ee7273`, default slate.
- Sparkline stroke follows tone.

Update `src/components/admin/Sparkline.tsx`, `PipelineStrip.tsx`, `PhysicianQueueStrip.tsx`, `PharmacyHealthCard.tsx`, `FunnelWaterfall.tsx`, `MrrMovementBar.tsx`, `ActivityFeed.tsx`, `TaskCenter.tsx`, `NotificationsBell.tsx`:
- Replace `text-ink`, `text-ever`, `text-check`, `text-honey`, `bg-canvas`, `border-ink/…` with slate/indigo/emerald/amber/coral equivalents.
- Any inline chart color (`#ee7273`, `#4a7c6f`, `#c4a265`, `#1D437B`) → analytics palette.

### Step 2 — Per-route pass (surgical find/replace)

Same token remap applied route-by-route. Each route keeps its structure/content; only classes and hex constants change.

- `admin.index.tsx` (Home): KPI grid → new tones; pipeline / task center / activity feed inherit from Step 1.
- `admin.live.tsx`: already indigo/violet — just align the sidebar KPI cards, timeseries strokes, and streamer-mode chip to the token names for consistency.
- `admin.patients.tsx` + `admin.patients.$id.tsx`: table hairlines slate-200, status pills use semantic tones (active=emerald, paused=amber, churned=coral, lead=sky), tabs get indigo underline.
- `admin.physician-queue.tsx`, `admin.pharmacy.tsx`, `admin.check-ins.tsx`: swap sage/coral status chips for emerald/amber/coral; queue rail indigo.
- `admin.orders.tsx`, `admin.payments.tsx`, `admin.leads.tsx`: fulfillment stages → indigo/sky/emerald; failed → coral; refunded → slate.
- `admin.messages.tsx`: unread dot indigo, outbound bubble indigo-50/indigo-900, inbound slate-100.
- `admin.reports.tsx` and every `admin.analytics.*` route: already correct — audit only, no changes expected beyond the shared components.
- `admin.integrations.tsx`, `admin.team.tsx`, `admin.settings.tsx`, `admin.command.tsx`: form fields → slate borders + `focus:ring-indigo-500`, toggles indigo, danger buttons coral.

### Step 3 — Responsive polish

- Sidebar collapses to icon-rail (64px) at `lg`, sheet drawer at `<lg` — already wired, verify contrast on new tokens.
- KPI grids: `grid-cols-2 md:grid-cols-4 xl:grid-cols-5` where appropriate; tables get `overflow-x-auto` wrappers where missing.
- Tap targets ≥ 36px on mobile; sticky topbar preserved.

### Step 4 — Verification

- `rg` for leftover `text-ink|text-ever|text-check|text-honey|bg-canvas|#ee7273|#4a7c6f|#c4a265|#1D437B` inside `src/routes/admin.*` and `src/components/admin/*` — expected result: only intentional coral (`#ee7273`) uses on danger/failed states.
- Visual sweep of every admin route at desktop (1440), tablet (900), mobile (390) via Playwright screenshots.
- Confirm marketing/intake/portal pages are visually unchanged.

## Out of scope

- No changes to `/`, `/weight-loss*`, `/intake*`, `/sales*`, `/checkout*`, `/confirmation*`, `/portal/*`, `/emails`, `/login*`, or legal pages.
- No data-model, route, or auth changes — presentation only.
- No new pages, no removed pages.

## Deliverables

1. Retheme'd `AdminShell` + all shared `components/admin/*` primitives.
2. Class/hex sweep across all 21 admin routes.
3. Grep clean of legacy tokens inside admin scope.
4. Screenshots (desktop/tablet/mobile) of Home, Patients, Physician Queue, Orders, Payments, Messages, Analytics Overview, Live View, Settings — attached in the reply.

Reply **"go"** and I'll execute Step 1 → Step 4 in order.
