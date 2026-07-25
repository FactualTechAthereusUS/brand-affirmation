## What Shopify actually does (from the HTML dump)

- `<canvas data-engine="three.js r148">` — Shopify runs a real WebGL scene in **three.js**, not COBE. That's why zooming in shows crisp individual **hexagons** and single-pixel country labels stay sharp. Our COBE canvas can only bake a texture shader, so at high mapBrightness the land pixels bloom together into the teal blob you're seeing. No amount of COBE tuning will match Shopify — the technology is different.
- Palette pulled from Shopify's SVGs:
  - Order pin fill `#8F71EF`, ring `#7F4AFA` (violet).
  - Visitor dot `#13ACF0` (cyan).
  - Sidebar accents `#8BAAF9`, `#ADC4FC`, text `#616161`/`#70707b`.
- Legend labels: **Orders**, **Visitors right now**.
- Globe controls (top-right of globe pane): Search location combobox, **Streamer mode**, **Switch to map view**, **Full screen**, **Zoom in / Zoom out**.
- Sidebar sections in order: Visitors right now → Total sales → Sessions → Orders → **Customer behavior** (Active carts / Checking out / Purchased) → Sessions by location → **New vs returning customers** → **Total sales by product**. "Just now" freshness indicator at top; "Toggle metrics" collapse button.

## The fix — replace COBE with `three-globe`

`three-globe` (built on three.js) is the exact tech Shopify uses: it renders `hexPolygonsData` from world topojson as instanced hex meshes on a real 3D sphere, with camera zoom, drag, HTML markers, and arcs. Battle-tested and small.

### Install

```
three  three-globe  world-atlas  topojson-client  @types/three
```

(All Worker-safe; only used in the browser.)

### New file — `src/components/live/LiveGlobe3D.tsx`

Replaces the current COBE-based `LiveGlobe.tsx` for `/admin/live`. Mounts a three.js scene inside a wrapper div (no react-three-fiber needed — direct three.js keeps deps light).

Scene setup:

- `WebGLRenderer({ antialias: true, alpha: true })` sized to wrapper via `ResizeObserver`.
- `PerspectiveCamera` at `z = 300`, near/far tuned for globe radius 100.
- Two soft lights: `AmbientLight('#ffffff', 0.9)` + `DirectionalLight('#ffffff', 0.6)` above.
- `ThreeGlobe()` instance:
  - `.globeMaterial(new MeshPhongMaterial({ color: '#f2f6fa', transparent: true, opacity: 1 }))` → off-white base sphere.
  - `.showAtmosphere(true).atmosphereColor('#c9e7f0').atmosphereAltitude(0.14)` → soft light-cyan halo.
  - Load `world-atlas/countries-110m.json`, convert with `topojson.feature`, feed to `.hexPolygonsData(features)`.
  - `.hexPolygonResolution(3)` (increase to 4 when camera distance < 220 for closeup density — matches Shopify's zoom densification).
  - `.hexPolygonMargin(0.32)` (visible spacing between hexes).
  - `.hexPolygonColor(() => '#6ECDB8')` (mint that matches our teal accent).

Camera control (custom, no OrbitControls):

- Pointer drag → `phi/theta` rotation with momentum decay.
- Wheel → zoom by adjusting camera distance in `[180, 380]`; clamp so the sphere never clips.
- Idle >2s → gentle auto-rotate at ~0.06°/frame.
- Focus jump: tween `phi/theta` + distance to target lat/lng over 700ms (used by "Search location" and by sidebar row clicks).

Markers (HTML overlay layer — Shopify uses this too, seen in the dump):

- Sync `sessions` + `purchaseEvents` each frame. For each, compute screen-space `(x,y)` from world coords with the current camera matrix; hide when behind sphere (`dot(normal, cameraDir) < 0`).
- **Order pin**: violet SVG pin (`#8F71EF` fill, `#7F4AFA` 15%-alpha ring) — Shopify's exact asset shape, inline SVG.
- **Visitor dot**: 8px cyan circle `#13ACF0` with soft white halo.
- **Purchase pulse**: adds a ring div at the pin location that animates `scale(0→2.4)` + `opacity(0.6→0)` over 1.4s, then removes.

Hit-testing / tooltip: same projection used for placement gives us pixel positions → we already have the tooltip UI from the old file; drop it in unchanged.

### Route sidebar — refactor `src/components/live/LiveSidebar.tsx`

Match Shopify's section order and add the missing sections:

1. Freshness row: green dot + "Just now" (uses existing `updatedAt` from `useLiveSessions`).
2. `Visitors right now` — big number, cyan `#13ACF0` sparkline.
3. `Total sales` — dollar KPI with indigo `#2563eb` sparkline + delta badge.
4. `Sessions` — sky `#0ea5e9` sparkline + delta.
5. `Orders` — violet `#7c3aed` sparkline + delta.
6. **New: Customer behavior** — three inline pills (Active carts / Checking out / Purchased) driven by `sessions.stage` counts.
7. `Sessions by location` — top 10 city bars (existing).
8. **New: New vs returning customers** — horizontal split bar (62/38) + legend dots.
9. **New: Total sales by product** — top 4 program rows (Weight Loss · Semaglutide / Tirzepatide / Tretinoin / Finasteride) with dollar totals, matching existing seed data.

Each section has a small `?` "Open definition for …" button matching Shopify's affordance (opens a popover with 1-sentence copy). Kept color-coded to our admin palette so it stays consistent with `/admin` and `/analytics`.

### Route top bar — `src/routes/admin.live.tsx`

- Replace `LiveGlobe` import with `LiveGlobe3D`.
- Add controls above/beside globe: Search location (Combobox with static US city list → focus tween), Streamer mode toggle (hides KPI numbers with `blur-sm select-none` — same trick Shopify uses), Map/Globe toggle (already exists), Full screen (already exists), Zoom +/– buttons wired to globe's `zoom(±)` method.
- Keep the `bg-[#f6f6f7]` analytics-consistent background we just added.

### Files

- **New:** `src/components/live/LiveGlobe3D.tsx` (~280 lines — scene, controls, markers, pulses, tooltip).
- **Modify:** `src/routes/admin.live.tsx` (swap import, add search + streamer + zoom wiring).
- **Modify:** `src/components/live/LiveSidebar.tsx` (add Customer behavior, New vs returning, Total sales by product; reorder to match Shopify).
- **Modify:** `src/hooks/useLiveSessions.ts` (expose `newVsReturning` and `salesByProgram` derived counts from existing session pool — no new random state).
- **Delete after swap:** none. Keep `LiveGlobe.tsx` (COBE version) so we can A/B if needed; the route will just stop importing it.
- **Deps:** add `three`, `three-globe`, `world-atlas`, `topojson-client`, `@types/three`.

### Verification

1. Build passes.
2. `/admin/live` loads; hex-dot continents visible on off-white sphere; violet pin at a US session; drag rotates smoothly; wheel zooms; auto-rotate resumes after idle.
3. New purchase event spawns a pulse ring at that pin.
4. Sidebar renders the 3 new sections in the Shopify order with color-coded numbers.
5. Streamer mode toggle blurs KPI values.
6. Analytics-style `#f6f6f7` background stays intact.

That's the whole rebuild in one focused pass — one new component swaps for the one broken component, sidebar gains the three missing Shopify sections, top bar gains search + streamer.