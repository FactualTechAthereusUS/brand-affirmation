# Hero highlight tabs, rebuilt Cuvo style

Nav bar stays exactly as it is. All work happens in the hero's product-highlight
tab block on `/pharmabro` (currently the pill `TabRail` plus one screenshot).

## New shell (matches the reference markup)

- Replace the rounded pill rail with a full-width bordered tab strip: 2x2 grid on
  mobile, single row on desktop, hairline dividers, left-aligned labels
  (16px mobile / 20px desktop).
- Active tab: raised z-index, faint warm-white fill, ink text, plus a 2px
  progress loader that sweeps left to right over the dwell time. Inactive tabs
  sit at 50% ink and lift to 75% on hover.
- Auto-advance every ~7s, restarted on any click; frozen under reduced motion.
- Panel below the strip shares the same border (no top border), `aspect-square`
  on mobile and `2/1` on desktop, and cross-fades panels over 700ms.
- Caption line under the panel stays, fed by existing `DASHBOARD_TABS` copy.

## The four panels

1. **End-to-end operations** — keep the dashboard imagery, restaged like the
   reference: a smaller back screenshot offset behind a larger front screenshot,
   both with soft rounded shadows, floating over a light ambient wash.
2. **Providers in all 50 states** — render the real US map. Reuse
   `UsProviderMap` scaled to fill the panel, with its pulsing in-state provider
   dots; no screenshot.
3. **Pharmacy fulfillment** — new animated loop: a single white fulfillment card
   (header `Fulfillment · Order #PB-2481`, dotted grid backdrop) with a status
   banner and a four-step vertical timeline (Patient approved, Sent to pharmacy,
   Compounded and labeled, Shipped) where a dotted rail fills green step by step,
   icons flip to a check, timestamps blur in, then the loop resets.
4. **Compliant by default** — new animated loop: a stack of white cards that
   appear one by one (Refill request #PB-4120 · GLP-1 · NY, Clinical policy
   cleared / Ryan Haight, Licensed provider matched in NY / 50-state, Privacy and
   audit logged / HIPAA · SOC 2) plus a marine `Auto-reroute` card that slides in
   mid-sequence, all with green compliant pills.

## Technical notes

- New file `src/components/pharmabro/home/HeroPanels.tsx` holds the four panel
  scenes; `HeroBlock.tsx` gets the new tab strip and cross-fade wiring.
- Animations use `motion/react` with the existing `PB_EASE_SOFT` grammar and the
  helpers already in `loopKit.tsx` (`useLoop`, `Tick`, `Connector`, `Chip`), so
  the motion feel matches the retention and journey sections.
- Colors come from existing tokens (`ink`, `hairline`, `marine`, loopKit `OK`);
  no new palette, no hardcoded brand hexes in components.
- Tab labels, captions, and slots keep coming from `DASHBOARD_TABS` in
  `src/lib/pharmabro/home.ts`; copy is unchanged.
- Reduced motion: loops render their completed final state, no auto-advance.
