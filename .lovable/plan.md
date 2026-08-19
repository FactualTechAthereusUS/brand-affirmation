# Replace the clinic dashboard row with a code-driven phone loop

## What changes

The first row inside the "Operated end to end" section (the wide dashboard screenshot with the
"Your clinic, live on day one." caption) is replaced. Create the reference block: a bordered light panel
with corner tick marks holding a code-drawn iPhone that plays a looping PharmaBro intake animation,
plus a headline, serif-style body paragraph, and a small legal footnote underneath.

All content is PharmaBro's own: PharmaBro mark in the phone header, PharmaBro copy, PharmaBro
electric-blue progress bars and buttons. No screenshots, no external images.

## The animated loop (all code, no video, no image)

A single phone screen cycles through intake steps on a timer, roughly 2.6s per step, restarting
forever:

1. Step 1 - "Your details": two short field rows fill in, progress bar segment 1 fills.
2. Step 2 - "Weight and goal": a slider handle glides, a value counts up.
3. Step 3 - "Any of these conditions?" - the three option rows ("None of these", "Thyroid disorder",
   "Pancreatitis"); the first row highlights and its radio fills, then the Submit button turns from
   disabled grey to PharmaBro blue.
4. Step 4 - "Approved" confirmation card with a check, then fade back to step 1.

Details carried over from the reference: iOS status bar (9:41, signal/wifi/battery icons), three
segment progress bars, rounded option rows, disabled-to-active Submit, all option/step transitions
as short opacity plus small y motion using the existing `PB_EASE_SOFT` easing. Reduced-motion users
see step 3 held static.

The phone body itself is drawn as an inline SVG shell (rounded chassis, side buttons, dynamic
island, masked screen cutout) so the UI sits inside the punch-out - same technique as the reference
markup, no device image.

## Layout

```text
+-----------------------------------------------+
|  [corner ticks]   light panel, aspect ~604/640 mobile, 604/569 desktop
|                  +-------------+              |
|                  |   phone     |              |
|                  |   (loop)    |              |
|                  +-------------+              |
+-----------------------------------------------+
Cuvo-style caption below:
  H3   PharmaBro handles every prescription
  body Every patient is reviewed and prescribed by licensed providers under your brand...
  fine All prescriptions and treatment are at the sole discretion of the treating provider...
```

On desktop the panel and the caption sit side by side within the existing section grid; on mobile
they stack, phone first.

## Technical notes

- New file `src/components/pharmabro/home/PhoneIntakeLoop.tsx`: exports the phone shell SVG, the
  screen UI, and the step timer (`useEffect` interval + `useReducedMotion`). Pure presentational.
- New file or existing `src/lib/pharmabro/home.ts` addition: the loop's step copy and the caption
  headline/body/footnote as exported constants, so text stays out of the component.
- `src/components/pharmabro/home/SectionsA.tsx` - `CompleteClinic` renders the new panel for the
  first `CLINIC_ROWS` entry instead of `Shot`; the second row keeps its current portal visual.
- Panel border, hairlines, blue, and ink all come from existing tokens (`--color-hairline`,
  `--color-ink`, brand blue); no hardcoded colour utilities beyond the reference's grey disabled
  state expressed as a token mix.
- Corner ticks are a small absolutely positioned element with four L-shaped rules, matching the
  reference's `ic-corners` idea.
- Motion stays on `motion/react`, consistent with the rest of the page.
