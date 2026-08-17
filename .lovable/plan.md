# PharmaBro.co marketing site inside the Blissley repo

## Goal

Create a distinct **PharmaBro.co** marketing surface within this same TanStack Start project. It will feel like its own site (separate hero, nav, footer, copy, and identity) while reusing the UI craft we already built for Blissley: responsive layouts, Framer Motion reveals, liquid-glass cards, local assets, and SEO-per-route.

It is **not** part of the Blissley brand. It does not touch `/admin`, `/operator`, `/pharmacy`, or `/portal`. It is a lightweight marketing-only workstream.

## Scope

1. **Homepage** — `/pharmabro`
2. **Primary sales LP** — `/pharmabro/weight-loss` (or `/pharmabro/trt` if men's health is the lead program)
3. **2–3 supporting pages** — e.g. `/pharmabro/how-it-works`, `/pharmabro/reviews`, `/pharmabro/faq`

No intake, checkout, auth, or platform portals for this milestone. Links on PharmaBro pages can point to existing Blissley flows or to placeholder `#` anchors until the user decides to wire them.

## Route strategy

TanStack Start file-based routing. All PharmaBro routes live under a single prefix so they are isolated and easy to publish or redirect later.

```text
src/routes/
  pharmabro.index.tsx          → /pharmabro
  pharmabro.weight-loss.tsx     → /pharmabro/weight-loss
  pharmabro.how-it-works.tsx    → /pharmabro/how-it-works
  pharmabro.reviews.tsx         → /pharmabro/reviews
  pharmabro.faq.tsx             → /pharmabro/faq
```

Each route defines its own `head()` with PharmaBro-specific title, description, og:title, og:description, og:type, twitter:card, and canonical link.

## Brand identity (pending user input)

The user will provide the exact PharmaBro positioning and colors. Until then, the plan uses a masculine, high-contrast placeholder palette that still shares the Blissley UI grammar:

```text
Canvas:  #0B0F19 (deep navy/black)
Ink:     #FFFFFF
Accent:  #4F8CFF (electric blue) or #2DD4BF (teal)
Muted:   #1E2532
Border:  #2A3241
```

These will be implemented as a `.pharmabro-scope` CSS block in `src/styles.css`, mirroring how `.admin-scope` rebinds tokens. If the user wants to keep the existing light Blissley palette, the scope can be removed and components will inherit the global tokens.

## Component architecture

Create a dedicated folder so PharmaBro does not entangle with Blissley components:

```text
src/components/pharmabro/
  Nav.tsx
  Footer.tsx
  Hero.tsx
  SocialProof.tsx
  HowItWorks.tsx
  Programs.tsx
  Reviews.tsx
  FAQ.tsx
  FinalCTA.tsx
  primitives.tsx   — shared motion wrappers, section containers, buttons
```

Components reuse the same motion patterns (`motion.div`, `Reveal`-style stagger, `DeferredEffects` for Lenis) but accept PharmaBro copy and colors via props or CSS scope.

## Assets

All assets will be local under `public/assets/pharmabro/`:

- Hero portrait / lifestyle image (generate with imagegen)
- Program / product imagery
- Social-proof portraits (reuse existing 4:5 portraits where appropriate, or generate new ones)
- Logo (generate or user-provided)

Run `scripts/fix-assets.mjs` after uploads and grep for `__l5e` before finishing.

## Page-by-page breakdown

### `/pharmabro` (homepage)

- Fixed or liquid-glass nav with PharmaBro logo and links to LP/supporting pages
- Full-bleed hero with bold headline, subhead, primary CTA, and trust micro-points
- Logo strip / press bar
- Program/category grid (weight loss, men's health, longevity, etc.)
- "How it works" 3-step strip
- Featured program teaser
- Social proof / review slider
- Large numbers / stats band
- FAQ accordion
- Final CTA + footer

### `/pharmabro/weight-loss` (primary LP)

- Sticky nav + hero with result-oriented headline
- Personalized approval banner / quiz CTA
- Science/mechanism section
- Projection chart (reuse the existing weight-loss calculator chart component, re-themed)
- Pricing cards
- Before/after or testimonial grid
- Objection-handling checklist
- Sticky or floating bottom CTA bar

### Supporting pages

- `/pharmabro/how-it-works` — timeline of consult → prescription → delivery
- `/pharmabro/reviews` — masonry or filtered review grid
- `/pharmabro/faq` — category-filtered accordion

## Technical notes

- Lazy-load below-the-fold sections on the homepage, same pattern as `src/routes/index.tsx`.
- Use `motion/react` for entrance animations and scroll-triggered reveals.
- Keep the global `src/styles.css` tokens untouched; PharmaBro colors live under `.pharmabro-scope` so Blissley pages are not affected.
- No backend or store changes. Demo data (reviews, stats, FAQs) can be hardcoded in components or a small `src/lib/pharmabro/content.ts` file.

## Open questions before build

1. What is PharmaBro's exact lead category — weight loss, men's health/TRT, peptides, longevity, or a broader telehealth play?
2. What are the exact brand colors and logo? (If not provided, the build will use the masculine navy/electric-blue placeholder above.)
3. Which page should be the primary sales LP — weight loss, TRT, or something else?
4. Should PharmaBro pages link to existing Blissley intake/checkout flows, or stay self-contained for now?
