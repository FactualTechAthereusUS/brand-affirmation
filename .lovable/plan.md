# Blissley Homepage — Structural Build (Pass 1)

Goal: Ship the full homepage skeleton per your spec — every section, correct tokens, correct order, correct copy, placeholder imagery, and motion wired up. Then we iterate section-by-section against the reference PDFs (Brez, IM8, Mochi, DirectMeds, BetterMeRx, TrimRx, Mochi) to reach parity.

## Design system setup

Update `src/styles.css` (Tailwind v4 `@theme`) with tokens:
- Colors: `canvas #F8F5EF`, `ink #171717`, `ever #818263`, `mist #D8D2C7`, `bluebell #8B9BB4`, `honey #C4A265`, `blush #C4998A`, `check #4A7C6F`
- Fonts: `--font-display: "Playfair Display", serif` (italic-capable), `--font-sans: "Manrope", sans-serif`. Load via `<link>` in `src/routes/__root.tsx` (Google Fonts). No Inter.
- Radii, shadows, section padding as spec.

Set global body: bg `canvas`, text `ink`, `font-sans`. Headings use `font-display`.

## Route + head

Rewrite `src/routes/index.tsx` (placeholder route) with brand `head()`:
- title: "Blissley — Personalized medicine, designed around you."
- description matches hero sub.
- og:title / og:description / og:type=website / twitter:card=summary_large_image.

## Motion stack

Install `motion` (Framer Motion successor) and `lenis`. Add:
- `src/components/SmoothScroll.tsx` — Lenis provider mounted in `__root.tsx` after hydration (client-only via `useEffect`).
- Reveal wrapper `src/components/Reveal.tsx` using `motion` + `useInView` (fade + 16px rise, 600ms ease-out) applied to section headers and cards.
- Hero: subtle parallax on hero image via `useScroll` + `useTransform`.
- Buttons: `whileHover` scale 1.02, `whileTap` 0.98.

## Component structure

All under `src/components/home/`:
1. `Nav.tsx` — sticky, wordmark (logo image) + hamburger; full-screen overlay menu with categories + Start Assessment CTA.
2. `Hero.tsx` — eyebrow pill, H1 (Playfair), sub, two CTAs, full-bleed placeholder image with rating overlay card.
3. `PressLogos.tsx` — "AS FEATURED IN" + horizontal scroll grayscale placeholder logo strip.
4. `CategoryGrid.tsx` — 2×2 photo cards (Weight Loss, Skin & Hair, Sexual Health, Longevity) with gradient overlay, tag pill, title, arrow circle. "View all treatments →" link below.
5. `WhyBlissley.tsx` — 4 icon-row differentiators separated by hairlines (Lucide icons in ever-tint circle).
6. `HowItWorks.tsx` — dark `#171717` section, 3 numbered steps in Playfair `ever` numerals, CTA button.
7. `FeaturedPrograms.tsx` — 3 tall lifestyle cards, gradient, tag, title, "Explore →" + arrow circle.
8. `SocialProof.tsx` — headline + rating line, edge-to-edge horizontal photo strip, review-card carousel with 3 cards + dot indicators.
9. `Numbers.tsx` — 2×2 stat grid with hairline dividers.
10. `Comparison.tsx` — 3-col table: feature / Blissley / Traditional. Ink header row, warm tint Blissley column, ✅/❌ per spec.
11. `FAQ.tsx` — 8 accordion items (Radix `Accordion` restyled to spec, + rotating to ×).
12. `FinalCTA.tsx` — `ever` background section, two centered CTAs, trust line.
13. `Footer.tsx` — dark, wordmark, tagline, 2-col links, legal, disclaimer, payment icons.

`index.tsx` composes them top-to-bottom.

## Placeholders

- Logo: use uploaded `transparent_black_small_letters_logo.png` via `lovable-assets` pointer → `src/assets/blissley-logo.png.asset.json`. Used in nav and footer (invert for dark footer via CSS filter).
- All lifestyle photography: use neutral warm placeholder divs with `bg-mist` + subtle text label indicating intended shot (e.g. "Weight Loss — hiker, warm light"). No stock images yet. Real imagery will be generated section-by-section in pass 2 so we can match Brez photography style precisely.
- Press logos and patient avatars: gray blocks/circles as placeholders.

## Copy

All copy pulled verbatim from your spec (headlines, sub-lines, card tags, steps, reviews, FAQ Q&A, footer).

## Responsive

Mobile-first, single column. Desktop breakpoints (`md:`, `lg:`) tuned per section (nav switches to horizontal, grids widen, hero centers with max-width). Every tap target ≥52px. Uses the `grid-cols-[minmax(0,1fr)_auto]` header pattern where needed.

## Verification

After the build:
1. `bun run build` passes.
2. Playwright screenshot at 390px and 1440px widths; view each section against the spec.
3. Confirm nav sticky, overlay menu opens, accordion expands, Lenis smooth-scroll active, motion reveals fire.

## Not in this pass

- Real photography (pass 2, per section, matching Brez).
- Real press logos (pass 2).
- Quiz funnel behind CTAs (separate build).
- Analytics wiring.

Once the skeleton lands and you approve the shape, we go section-by-section: I'll re-open the relevant PDF, screenshot the reference, and refine that one section to reference parity before moving to the next.