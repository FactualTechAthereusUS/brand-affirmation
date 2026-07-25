## Goal

Match Shopify Live View interaction feel for both the 3D globe and 2D map, and swap the KPI stack from Shopify's ecom metrics to a Blissley telehealth set. Keep the current palette (indigo / violet / sky / emerald / amber) and full-bleed layout.

## What Shopify actually does (from the HTML dump + reference shots)

- **Globe (3D):** rotates continuously at a slow idle spin; on `pointerdown` the spin pauses and the sphere follows the cursor 1:1 (lat/lng delta from drag); on release, angular velocity decays with momentum (exponential ease-out) then idle spin resumes. Wheel scroll zooms the camera dolly between a min/max radius; double-click zooms in one step. Hovering a pin raises it, shows an HTML tooltip anchored to the projected screen position with `Country · Region · City · h:mm a` and the event type. New "purchase" events emit a short expanding ring + a bright pulse.
- **Map (2D):** standard Google Maps drag/zoom, but markers are custom DOM overlays. Hover on a marker opens the same tooltip card; a purchase drops an emerald ripple that fades over ~1.4s. Keyboard: `+ / -` zoom, arrow keys pan, `G` switch to globe, `M` switch to map, `S` toggle streamer mode (mask city labels + patient initials).
- **Header chrome:** "Live · updated Ns ago · auto-refresh 20s", Streamer toggle, Globe/Map toggle, Fullscreen.
- **Sidebar:** KPI grid (2×2) with sparkline + Δ% chip, funnel bar, sessions by location, new vs returning, sales by product.

## Telehealth-native KPI set (replaces Shopify's ecom set)

Live counter — 2×2 primary tiles (hourly today vs previous period, Δ%):

1. **Visitors right now** — pulse dot, last 5 min unique visitors.
2. **Consults started** — intake forms opened in last 5 min (replaces "Total sales" as the top-of-funnel live pulse).
3. **Rx approved** — prescriptions signed by physicians (live, rolling 24h).
4. **Revenue today** — gross paid orders today, $ with Δ% vs yesterday.

Secondary strip (compact tiles under the 2×2):

5. **Avg physician response** — minutes, target <15m, green if under.
6. **Refills due 7d** — count with a mini bar.
7. **Approval rate 24h** — % approved of reviewed cases.

Funnel bar (replaces "Patient behavior"):

- **In intake → Awaiting physician → Approved → Shipped** (indigo → violet → emerald → sky) with live counts.

Lists:

- **Sessions by location** (unchanged, indigo bars).
- **New vs returning patients** — single stacked bar (violet / emerald).
- **Revenue by program** — Weight loss, Hair, Sleep, Skin, Sexual Health (amber → emerald gradient bars, top 5).

All series driven by `useLiveSessions.ts` (extended) — deterministic hourly buckets today + previous period so Δ% is stable across renders.

## Interaction parity — implementation

### `LiveGlobe3D.tsx`

- Idle auto-rotate at 0.15°/frame; pause on `pointerdown`, resume 800ms after `pointerup`.
- Drag: convert pointer Δx/Δy to yaw/pitch (pitch clamped ±80°); track velocity in a small ring buffer.
- Momentum: on release, apply last velocity, decay by `v *= 0.94` per frame until below threshold.
- Wheel: zoom camera Z between 180–420 (min/max), ease with lerp.
- Double-click: tween to `focus(lat,lng)` at zoom 220 over 700ms (cubic-bezier).
- Hover: raycast HTML markers; show tooltip `Country · Region · City · h:mm a · <event>` anchored via screen projection; scale the pin 1→1.4 with a coral halo ring.
- New purchase: spawn a 900ms expanding torus ring at the pin (emerald) + pulse.
- Streamer mode: replace city label with `••••••` and initials with `••`.

### `LiveMap.tsx`

- Custom `OverlayView` markers keyed by session id (no marker churn on tick).
- Hover: same tooltip card as globe (shared `<LivePinTooltip/>` component).
- Purchase ripple: SVG circle animates r 6→28, opacity 0.6→0 over 1400ms.
- Keyboard shortcuts: `+ / -` zoom, arrows pan (200px), `G/M` view toggle, `S` streamer, `F` fullscreen, `?` opens a shortcuts sheet.
- Streamer mode: apply a Google Maps style that hides `locality`/`administrative_area_level_3` labels.

### `admin.live.tsx`

- Add keyboard listener at route level (only when not typing in an input).
- Update top bar: Streamer / Globe / Map / Fullscreen / `?` (shortcuts).
- Sidebar swapped to the telehealth KPI stack above; funnel now 4 stages; add secondary strip + "Revenue by program".

### `useLiveSessions.ts`

- Add series for `consultsStarted`, `rxApproved`, `revenueToday`, `avgPhysicianResponseMin`, `approvalRatePct`, `refillsDue7d`.
- Rolling counters:
  - `visitorsNow` = unique visitor ids in last 5 min.
  - `consultsLast5` = intake_started events in last 5 min.
  - `rxApprovedLast24` = physician_signed events in last 24h.
  - `revenueTodaySum` = order.total for events since local midnight.
- 4-stage funnel counts from status: `intake` → `awaiting_physician` → `approved` → `shipped`.
- Previous-period series generated with the same deterministic seed, offset by 24h, so every Δ% chip is stable.

## Demo variations to show

After the build, verify at `/admin/live` with Playwright (viewport 1440×900):

1. **Globe · idle spin + hover pin** — screenshot with tooltip open on a US pin, dashed previous-period line visible in KPI cards.
2. **Globe · drag & momentum** — pointer drag from center-left to center-right, release, capture mid-decay.
3. **Globe · purchase pulse** — inject a purchase event, capture the emerald ring at ~450ms.
4. **Map · zoomed to US East Coast** — hover on New York pin, tooltip visible.
5. **Streamer mode ON** — same map, city labels masked, patient names redacted in the activity feed.
6. **Shortcuts sheet** — `?` overlay listing all keys.

## Files touched

- `src/hooks/useLiveSessions.ts` — extend telemetry with telehealth counters + 4-stage funnel.
- `src/components/live/LivePinTooltip.tsx` *(new)* — shared tooltip used by globe + map.
- `src/components/live/LiveGlobe3D.tsx` — idle spin, drag+momentum, wheel zoom, dbl-click focus, hover tooltip, purchase ring, streamer masking.
- `src/components/live/LiveMap.tsx` — custom overlay markers, hover tooltip, purchase ripple, keyboard shortcuts, streamer style.
- `src/components/live/LiveSidebar.tsx` — new KPI stack, 4-stage funnel, secondary strip, "Revenue by program".
- `src/components/live/ShortcutsSheet.tsx` *(new)* — `?` overlay.
- `src/routes/admin.live.tsx` — route-level keyboard handler, shortcuts button, top-bar wiring.

Scope is presentation-only — no backend, no schema, no auth changes.  
  
rememebr u have to match it , but make sure it's as per our telehealth everything not just ecom, this is not for ecom but telehealth, so all the metrics and everyhting must be as per blissley and it's busienss model teleheltaht , so think asp er that and execute 