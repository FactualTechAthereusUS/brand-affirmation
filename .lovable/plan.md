## What I found in the two references

**File 1 — Shopify's Live View metric drawer (ShopifyQL definitions).** Each card is a real time-series widget, not a static number:


| #   | Shopify metric             | Window                                     | Refresh | Chart type           |
| --- | -------------------------- | ------------------------------------------ | ------- | -------------------- |
| 1   | Visitors right now         | last 5 min                                 | 20 s    | single number        |
| 2   | Total sales over time      | today, hourly, vs previous period          | 20 s    | area timeseries + Δ% |
| 3   | Sessions over time         | today, hourly, vs previous period          | 20 s    | area timeseries + Δ% |
| 4   | Orders over time           | today, hourly, vs previous period          | 20 s    | area timeseries + Δ% |
| 5   | Customer behavior          | last 10 min (carts / checkout / purchases) | 20 s    | 3-stage funnel bar   |
| 6   | Sessions by location       | today, by city                             | 20 s    | ranked bar list      |
| 7   | New vs returning customers | today                                      | 20 s    | split bar            |
| 8   | Total sales by product     | today                                      | 20 s    | ranked list          |


**File 2 — Shopify's Live View chrome.** Confirms the interaction surface:

- Top-right toolbar buttons: `Streamer mode`, `Toggle metrics`, `Switch to map view`, `Zoom in`, `Zoom out`, `Keyboard Shortcuts`, `Full screen`.
- Globe: `aria-label="Globe showing live customer activity worldwide"`.
- Activity pins: `aria-label="Purchased: 0"`, `Checking out: 0`, `Active carts: 0` → three stages.
- Location tooltip on globe: `"United States · Indiana · Fort Wayne: Jul 25, 2026 3"` (country · region · city, timestamp).
- Sidebar polls every 20 s (`pollinginterval="20000"`).

**What our current `/admin/live` is missing vs. those references**

1. Our KPI cards use a fake sinusoidal `Sparkline` — not tied to any data window. Shopify shows **today, hourly, with a previous-period comparison line and Δ%**.
2. No "Customer behavior" 3-stage funnel bar — we only show 3 flat counts.
3. No comparison line / delta chip on Sales, Sessions, Orders.
4. The map/globe cell is boxed inside a rounded card with a large right-side white margin. Shopify lets the map/globe bleed edge-to-edge under the entire chrome (only the sidebar overlays it), and the map is significantly wider.
5. Streamer mode currently only blurs the KPI values; Shopify also masks amounts in the "Sessions by location" bars, "Revenue by treatment" list, "Recent orders" amounts, and activity feed patient names — we already mask most but not consistently.
6. Globe tooltip on hover of a pin doesn't show the "Country · Region · City · Timestamp" line.
7. Missing keyboard shortcuts (← → ↑ ↓, + / −, Home/End, PgUp/PgDn) which Shopify exposes via a `Keyboard Shortcuts` button.
8. The 20 s poll cadence isn't reflected — our "Just now" label is static.

---

## Plan

### 1. Telehealth metric model (`src/hooks/useLiveSessions.ts`)

Extend the hook to emit Shopify-shaped rolling series so the sidebar can render real charts (all client-side simulated, but with realistic shape):

- `visitorsNow`: rolling count of live sessions in the last 5 min (already have via `counts.visitors`).
- `salesSeries`, `sessionsSeries`, `ordersSeries`: 24-slot hourly array for **today** + a matching 24-slot **previous period** array for comparison. Values grow monotonically through the day and jitter on each 20 s tick.
- `behavior10m`: `{ inIntake, awaitingPhysician, approved }` counts over a 10-min rolling window (telehealth analogue of Shopify's carts / checkout / purchased).
- `deltaPct` per series (today total vs previous total).
- Tick every 20 s to match Shopify cadence; expose `lastTickAt` so the "Just now / 5s ago…" label updates.

Everything stays isomorphic-safe (no random in module scope — generated inside a `useMemo` seeded lazily on first client render).

### 2. Sidebar redesign (`src/components/live/LiveSidebar.tsx`)

Replace the fake `Sparkline` and rebuild each card to Shopify's shape while keeping our `/admin` + `/analytics` palette (Indigo `#2563eb`, Emerald `#10b981`, Sky `#0ea5e9`, Violet `#7c3aed`).

**KPI grid (2×2, telehealth relabelled):**


| Slot | Label              | Value             | Chart                                                     |
| ---- | ------------------ | ----------------- | --------------------------------------------------------- |
| 1    | Visitors right now | count, last 5 min | none (just a small pulsing dot)                           |
| 2    | Total sales        | `$` today         | AreaChart 24-slot + dashed previous-period line + Δ% chip |
| 3    | Sessions           | today             | AreaChart + comparison + Δ%                               |
| 4    | Orders             | today             | AreaChart + comparison + Δ%                               |


Chart uses a shared inline `MiniArea` component (Catmull–Rom smoothed, same recipe as `AreaChart.tsx` in analytics) with the metric's tint. Δ% chip is emerald for ↑, coral-ish neutral for ↓.

**Patient behavior** — becomes a single stacked bar with three segments (In intake / Awaiting physician / Approved) plus the three labelled counts underneath. Matches Shopify's "Customer behavior" stack.

**Sessions by location** — keep, but each bar is a plain indigo→violet gradient (same as today) and, on hover, shows the full `Country · Region · City` tooltip that mirrors the globe.

**New vs returning patients** — keep.

**Revenue by treatment** — keep, gains a small colored bar under each row scaled to top-value share (matches Shopify's "Total sales by product").

**Streamer mode** — mask all currency, all counts in bars, and patient names in the activity feed / recent orders consistently.

Add a small `Last updated Ns ago · auto-refresh every 20s` line at the top of the sidebar, driven by `lastTickAt`.

### 3. Layout — full-bleed map/globe under the entire pane

`src/routes/admin.live.tsx`:

```text
┌─ Top bar (Live View · Just now · Streamer · Globe/Map · Fullscreen) ─┐
│                                                                     │
│  ┌── Sidebar ──┐   ┌────────── Map / Globe (edge-to-edge) ────────┐ │
│  │  380px      │   │  covers the rest of the viewport, no card    │ │
│  │  scrolls    │   │  border, no rounded corners on the right,    │ │
│  │  internally │   │  extends below the sidebar too (globe/map    │ │
│  │             │   │  fills the entire remaining region so the    │ │
│  │             │   │  Activity + Recent orders live INSIDE the    │ │
│  │             │   │  sidebar scroll)                             │ │
│  └─────────────┘   └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

Concretely:

- Remove the rounded-xl border + `bg-white` wrapper around the map/globe cell so it bleeds to the page edges (`rounded-none`, no border).
- Increase the grid to `lg:grid-cols-[360px_1fr]` and drop the outer horizontal padding on the map column (`-mr-4 lg:-mr-6`) so the map extends to the browser edge just like Shopify.
- Keep the fullscreen behaviour, but in normal mode also drop `pb-16` — map fills to the viewport bottom.
- Sidebar becomes the only scroll container; `ActivityFeed` and `RecentOrders` stay inside it (already the case).

### 4. Globe interactions

`src/components/live/LiveGlobe3D.tsx`:

- Marker tooltip on hover: show `Country · Region · City · h:mm a` (Shopify format). Data comes from the session record which already has `country/region/city`.
- Keep the three-stage color rules (Browsing / Checking out / Purchased) — align to Indigo / Violet / Emerald.
- Add a small `Keyboard Shortcuts` popover button on the toolbar (arrows to rotate, +/− zoom, Home/End big jumps). Handlers already easy to wire since we own the camera state.

### 5. Map view

`src/components/live/LiveMap.tsx` (Google Maps) — already good. Two small tweaks:

- Marker tooltip uses the same `Country · Region · City · time` format.
- On streamer mode, hide the marker InfoWindow city label.

### 6. Top bar

Add a `Keyboard Shortcuts` icon button and, next to "Just now", a live `Nns ago` counter that ticks every second between 20 s polls. Fullscreen and Streamer stay where they are.

---

## Files touched

- `src/hooks/useLiveSessions.ts` — add `salesSeries / sessionsSeries / ordersSeries / previous / deltaPct / behavior10m / lastTickAt`.
- `src/components/live/LiveSidebar.tsx` — replace Sparkline with `MiniArea`, add Δ% chips, funnel bar, product bars, updated-at line.
- `src/routes/admin.live.tsx` — full-bleed grid, remove card border on map cell, add Keyboard Shortcuts button + last-updated label.
- `src/components/live/LiveGlobe3D.tsx` — richer tooltip, keyboard shortcuts.
- `src/components/live/LiveMap.tsx` — tooltip format + streamer masking.

No new packages; charts reuse the existing analytics AreaChart recipe.

## Out of scope

- Real Shopify-style hex globe overlay redesign (already done last turn, staying as-is).
- Backend / real data — everything stays on the client-side simulator.
- Analytics palette / `/admin` styling changes — colors already unified.  
  
but make it as per telehealt as per our metrics this is not just ecom right. and as per our color scheme /admin and /analytics cosnistent and consitent structuer like shopify