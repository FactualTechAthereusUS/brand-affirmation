
# Live View — Shopify-parity rebuild

## Why the current one looks wrong

Right now the globe canvas renders a nearly-white sphere with no visible continents (your image 3). Two root causes:

1. **COBE contrast is misconfigured.** `baseColor: [0.98, 0.99, 1.0]` (near-white) + `mapBrightness: 5.6` means the land-dots and the ocean render at almost identical luminance on a white page → invisible sphere. Shopify uses a light canvas *background* but paints the land dots in a saturated accent (mint/cyan/violet). We need land dots in our **indigo `#2563eb`** at proper brightness, with a very soft canvas backdrop.
2. **Events don't visibly happen.** Sessions tick every 1.5s but there is no per-event "ping" animation on the globe, no arc when a purchase lands, and no "you-are-being-watched-live" pulsing halo. It looks static.

Everything else (rotation, drag, wheel-zoom, session simulator, sidebar KPIs) already exists — we're upgrading the visual layer and the event choreography.

---

## End-to-end: what happens when a real patient hits the site

For every visitor that lands on any Blissley page, the frontend fires a lightweight beacon (`POST /api/public/live/beacon`) with:

- an anonymous `visitorId` (localStorage UUID)
- coarse geolocation (country/region/city from IP — we already store this on `patients` + can resolve from the CF request)
- current funnel stage: `browsing | intake | cart | checkout | purchased`
- a heartbeat every 15s while the tab is visible

The server keeps a rolling window of the last 90 seconds of beacons in memory (Durable Object or Cloudflare KV with short TTL). `/admin/live` opens an **SSE stream** `GET /api/public/live/stream` that pushes:

```
event: session.upsert   → { id, lat, lng, stage, city, region, country, at }
event: session.advance  → { id, from, to, at }
event: session.expire   → { id }
event: order.purchased  → { id, lat, lng, amount, program, city, at }
```

The client keeps a `Map<id, LiveSession>` and drives both the globe markers and the sidebar off the same store. For MVP we ship the **client-side simulator that already exists** — the SSE contract is stubbed so we can flip a flag later without changing the UI.

### Stage lifecycle (matches Shopify's "Customer behavior")

```text
browsing (60s idle → expire)
  ↓ 20–35% advance
intake / cart (60s idle → expire)
  ↓ 15–25% advance
checkout (60s idle → expire, "checking out" pulse)
  ↓ 40–60% advance
purchased (lingers 5 min, emits arc + ping)
```

Our funnel is telehealth-specific, so we surface `intake` (Shopify's "cart" equivalent) and `checkout` (payment page) — the sidebar labels reflect that, not e-com "Active carts".

---

## The globe (visual spec — matches image 2)

- **COBE canvas** at `devicePixelRatio` up to 2, `mapSamples: 22000`, hex-density dots.
- **Palette (locked to /admin + /analytics):**
  - `baseColor` = very soft canvas `[0.965, 0.97, 0.985]` (subtle blue-gray, not pure white)
  - Land dots = **indigo `#2563eb`** at `mapBrightness: 8.5` → clearly visible, matches KPI accent
  - `glowColor` = `[0.90, 0.93, 1.0]` (soft violet halo)
  - `markerColor` (default) = indigo, overridden per-session below
- **Marker dots (per stage), from `dotRules.ts`:**
  - `browsing` → indigo `#2563eb`, size 0.05
  - `intake`   → sky `#0ea5e9`, size 0.055, gentle pulse
  - `checkout` → violet `#7c3aed`, size 0.07, stronger pulse (this is "money in flight")
  - `purchased` → emerald `#10b981`, size 0.08 + **8s decaying halo ping** + arc from purchase origin toward SF HQ
- **Interactions:**
  - drag to rotate (already works), wheel to zoom (0.9–2.2 scale)
  - idle > 2s → auto-rotate at 0.0022 rad/frame
  - click a location in the sidebar → 800ms eased fly-to (already works)
  - search bar → geocode against `CITIES` gazetteer, focus
  - hover a dot → tooltip (city · stage · time-on-site · program if purchased)
- **Overlays:**
  - bottom-left legend chip (Visitors / Intake / Checkout / Orders) with our palette
  - bottom-right zoom `+ / −` (already exists) + a small "recenter" button
  - top-right small "1 selection · Clear" chip when a country is filtered (matches your image 3)

### Event choreography (the missing "animation actually happens" part)

The user's complaint about "animation happening every section" was that the whole page was fading in on every scroll. That's already fixed. On top of that we need **per-event motion, driven by the store, not by scroll:**

1. **New session birth** — dot fades in at 0.3s scale ease-out at its coords.
2. **Stage advance** — dot color tweens between stage hexes over 400ms (COBE `state.markers` gets an interpolated color per frame).
3. **Purchase (`order.purchased`)** — three things fire simultaneously:
   - The dot swaps to emerald and grows to size 0.10 for 600ms, then settles at 0.08.
   - An SVG halo pulse renders on the overlay layer projected to that dot's 2D screen coords (3 concentric rings, 8s decay).
   - A COBE **arc** (cobe v2 supports `arcs`) draws from the purchase coords to `[37.77, -122.42]` (Blissley HQ, SF), color emerald, `arcHeight: 0.35`, lifetime 4s.
4. **Idle heartbeat** — every 300ms the checkout dots sinusoidally scale ±35% (already implemented in `dotRules.pulse`), giving the "live" feel without redrawing everything.

The overlay pulse ring uses the existing `hitTest` math to project `[lat, lng]` → screen `[x, y]`, so it stays glued to the dot even as the globe rotates.

---

## The 2D map view (matches image 1)

This is the toggle version. We keep the same `sessions` store; only the projector changes.

- Full-bleed **dotted world SVG** (the same aesthetic as our `LiveMap.tsx` today, upgraded)
- Land = 3px canvas dots on a 12px grid, ocean = empty → matches Shopify's Google-Maps-style light theme
- Session pins projected with equirectangular projection (`x = (lng + 180) / 360 * W`, `y = (90 - lat) / 180 * H`)
- Same color rules, same halo/arc animations (arcs drawn as SVG cubic bezier)
- Pan (drag) + wheel-zoom, `min: 1`, `max: 4`
- Same tooltip component, same legend
- Bottom-right the "+ / −" stack, bottom-left legend, bottom-center **"1 selection · Clear"** country filter chip (click a country dot to filter sessions/sidebar to that country)

---

## Sidebar (rebuilt for telehealth, not e-com)

Ordered top-to-bottom, all in one internally-scrolling column that already exists:

1. **Search location** (city gazetteer) — already wired
2. **KPI 2×2**
   - Visitors right now (indigo)
   - Sessions (sky)
   - Total sales — today (emerald)
   - Orders — today (violet)
3. **Patient behavior** (renamed from "Customer behavior")
   - In intake · Awaiting physician · At checkout · Approved
4. **Sessions by location** — top 10 rows with a mini progress bar (already exists), click to fly-to
5. **New vs returning patients** — real split from `patients.createdAt` (< 30 days = new)
6. **Revenue by treatment** — grouped by `program` (Semaglutide / Tirzepatide / Tretinoin / Finasteride)
7. **Live activity feed** — event stream (already exists as `ActivityFeed`)
8. **Recent orders** — 8 most recent from `useAdmin` store

Streamer mode hides all $ values and counts.

---

## Files to change

Nothing is thrown away — the scaffolding is 80% there. Focused edits:

- `src/components/live/LiveGlobe.tsx` — fix `baseColor` / `mapBrightness`, add per-marker color, add arcs, add halo pulse overlay, wire `focusOn` events
- `src/components/live/LiveMap.tsx` — replace with dotted-world SVG projector + shared halo/arc overlay
- `src/components/live/dotRules.ts` — retune sizes + hex to indigo/sky/violet/emerald
- `src/components/live/PulseOverlay.tsx` (new) — SVG layer for halo rings + arc animations, projects sessions/events to screen coords, shared by globe and map
- `src/hooks/useLiveSessions.ts` — emit `purchaseEvents[]` (rolling window of last 6 purchases) so the overlay can render pulses without re-rendering the globe
- `src/lib/live/cities.ts` — add ~30 more cities so the density looks like Shopify's
- `src/routes/admin.live.tsx` — sidebar rename ("Patient behavior"), remove the second-column recent-orders duplicate (already inside the sidebar scroll), keep the fixed globe column
- `src/components/live/LiveSidebar.tsx` — rename labels, update KPI tints to match palette, add streamer-mode dashes

## What we're explicitly NOT doing in this pass

- Real Cloudflare Durable Object beacon — stubbed behind the SSE contract, ships as client simulator
- Country/region **choropleth** shading (Shopify shows solid country fills; we keep clean dots)
- Historical replay / time-travel scrubber

## Technical notes

- COBE v2 arcs API: `globe.update({ arcs: [{ from: [lat,lng], to: [lat,lng], color: [r,g,b] }] })`. Arc lifetime is managed by us — we push, then after 4s splice it out.
- Screen projection reuses the exact rotation math already in `LiveGlobe.hitTest` so the SVG overlay coords stay in sync with COBE at every frame. We call the projector from a `requestAnimationFrame` loop in `PulseOverlay`.
- All colors come from CSS variables added to `src/styles.css` (`--live-browse`, `--live-intake`, `--live-checkout`, `--live-purchased`) so the same palette drives Tailwind classes and the COBE numeric `[r,g,b]` triples (we convert once in `dotRules.ts`).
- SSR-safe: COBE + the overlay stay behind `<ClientOnly>` + `React.lazy`, no window access at module scope.
