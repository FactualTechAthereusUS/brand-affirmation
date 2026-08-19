# Add a two-card "prescription + revenue" section under the clinic dashboard

## What changes

Nothing existing is removed. The clinic dashboard row and its caption stay exactly as they are.
Below them, a new two-column section is added, matching the reference block: two framed panels with
corner tick marks, each followed by a headline, body paragraph, and a small line of fine print or a
text link. Two columns on desktop, stacked on mobile.

All content is PharmaBro's: PharmaBro mark, PharmaBro copy, PharmaBro blue, PharmaBro dashboard
asset. No third-party names.

```text
 mt-16 grid gap-10   lg:mt-24 lg:grid-cols-2
+---------------------------+   +---------------------------+
| [ticks] light panel       |   | [ticks] light panel       |
|   provider message card   |   |   revenue dashboard       |
|   (animated loop)         |   |   (offset, cropped)       |
+---------------------------+   +---------------------------+
| H3  PharmaBro handles     |   | H3  Revenue in real time  |
|     every prescription    |   | body ...                  |
| body ...                  |   | link Learn more           |
| fine print ...            |   |                           |
+---------------------------+   +---------------------------+
```

## Card 1 - the animated loop (all code, no video, no image)

Inside the panel, a single white message card sits centred (max width 380px) with the PharmaBro mark
in a ringed circle and the label "PharmaBro". Under it, the provider message types itself in
**word by word** - each word fades from 0 to 1 opacity in sequence, about 55ms apart:

"Thanks for completing your intake, Tom. I'm routing your case to a licensed provider who can review
it and prescribe if it's appropriate. This will only take a moment."

When the sentence finishes, it holds for ~1.6s, fades out, and the loop restarts. Under reduced
motion the full sentence renders at once with no loop.

Panel aspect: 604/640 on mobile, 604/569 from the `sm` breakpoint up, so the card never crops.

## Card 2 - revenue panel

Same framed panel (604/569), with the existing PharmaBro analytics/revenue dashboard image
(`/assets/pharmabro-analytics-overview.png`, already in the project) inset from the top-left corner
and cropped by the frame edge, so it reads as a window into the real product. Below it: headline,
body, and a "Learn more" text link to `/pharmabro/platform/analytics`.

## Copy

- Card 1 heading: "PharmaBro handles every prescription"
- Card 1 body: every patient reviewed and prescribed by licensed providers under your brand,
  medication shipped to their door; you never touch a chart, a prescription, or a pharmacy.
- Card 1 fine print: all prescriptions and treatment are at the sole discretion of the treating
  telehealth provider, and only when medically appropriate.
- Card 2 heading: "Revenue in real time"
- Card 2 body: track new patients, recurring revenue, and retention from a single dashboard.

## Technical notes

- New `src/components/pharmabro/home/ClinicPair.tsx`: exports the section, the reusable framed
  panel with corner ticks, and the word-by-word message loop (`useEffect` timer +
  `useReducedMotion`, motion/react, `PB_EASE_SOFT`).
- Copy and the word list live as constants in `src/lib/pharmabro/home.ts`, consistent with the rest
  of the page data.
- `src/components/pharmabro/home/SectionsA.tsx` - `CompleteClinic` renders `<ClinicPair />` after the
  existing `CLINIC_ROWS` block; no existing markup changes.
- Corner ticks: a small absolutely positioned overlay drawing four L-shaped hairlines, using
  `--color-hairline` / ink token mixes. Panel background uses the existing mist/stone token, not a
  hardcoded grey.
- Serif-style body uses the project's existing type utilities; no new fonts.
