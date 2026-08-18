# PharmaBro Site Revamp — Sunbeam/Valeryn UI + Full SEO Layer

## What I read (proof)

**SPECS_FOR_WEBSITE.md (2,412 lines)** — old spec: locked offer ($5,000 setup, $1,000–$5,000/mo platform, $30 consult month one only, 0% medication markup, no revenue share, your Stripe, live in 7 days, month-to-month), design system (tight grotesk, display 500–600 at −0.02em, body 400/17px/1.65 max 68ch, mono tabular-nums on every number, 1200px 12-col, 128/72px section padding, hairline rules instead of cards, fade-up 400ms/24px/60ms stagger, sticky nav after 80px), homepage sections 2.1–2.16 (announcement bar → nav → hero order-ledger → social proof fourth, before features → how it works → four pillars → calculator → seven days → LegitScript → pricing preview → comparison teaser → blog → FAQ → final CTA → footer), and the full page inventory (/pricing, /calculator, /compare hub + vs-{x} ×17 + {x}-alternative ×17, /platform/{feature} ×9, /pharmacy/{category} ×6, /telehealth-platform/{state} ×50, /glossary ×50 with DefinedTerm, /blog, /book noindex).

**Sunbeam + Valeryn** are the two Framer dumps embedded at lines 2356 (valeryn.framer.website) and 2384 (sunbeam.framer.media), followed at line 2409 by your note: "i like the design from sunbeam and valeryn ... keep the white background, the current liquid sticky rounded header, but it has no motion, animation, intuitive coolness". Extracted from those dumps:

- **Sunbeam** — light stone canvas (rgb 250,250,249 / 245,245,244), ink rgb(26,26,26) & rgb(28,25,23), muted rgb(83,83,83), border rgb(233,230,225), 24px card radius (dominant), 999px/200px pills, `backdrop-filter: blur(30px)` on the floating nav, layered 4-stop soft shadows (0.16/0.15/0.14/0.09 at −0.8/−1.6/−2.4/−3.25px spread), footer lift `rgba(128,128,128,0.05) 0 -12px 32px`. Structure: rounded white pill nav on shadow `rgba(224,215,198,0.5) 0 1px 20px`, review-count chip above H1, 3-up benefit row, alternating feature blocks with inline capability chips + CTA per block, 6-card testimonial mosaic, 3-card case-study row, full-bleed closing CTA, 5-column footer.
- **Valeryn** — white + rgb(5,17,26) ink, rgb(153,153,153) muted, single hot accent rgb(255,0,51), 5px micro-radius on media and 122/1222px pills, blur(9px) nav / blur(4–12px) layers. Structure: nav appears from `y:-24` then items stagger `y:-12` at 0.1/0.15/0.2/0.25s, hero H1 `y:40, rotate:-1, 1.2s ease [0.05,0.58,0.56,1]`, stat band "PROOF IN NUMBERS" with counters, case rows each carrying a mini growth chart + quote + 3 metrics, letter-by-letter kinetic line, process ladder, 3-tier pricing.
- **Shared motion grammar (exact values):** tween, `y` 8→40px, `opacity 0.001→1`, duration 0.5–0.8s (hero 1.2s), stagger 0.05–0.1s, ease `[0, 0.82, 0.56, 1]` (variants `[0.09,0.72,0.56,1]`, `[0,0.86,0.56,1]`, hero `[0.05,0.58,0.56,1]`).

**pasted-2026-08-18 TXT (3,448 lines)** — the new spec. Homepage is 16 sections: announcement bar → nav → hero (left copy / right animated dashboard, green "Blissley is live" chip, rotating H1 word, 4-check trust line) → logo marquee + live counters → positioning break (large serif quote, "hand over 35% — forever", $20,706/mo proof) → comparison table (with HHS OCR 716,000-patient breach footnote) → 3-step how-it-works with animated progress line → six-feature grid (Stripe OAuth/5 MIDs, in-house rebill 13 cycles saving 0.5–1%, LegitScript 7–14 days, 30+ pharmacies SKU-routed, portal.yourbrand.com, Meta CAPI/GA4/TikTok/Everflow/Triple Whale/Klaviyo) → dashboard section + 4 points → the math (2.8% vs 35%, $346,740/yr) → LegitScript progress bar + 2 panels → switching/migration 3 cards → 3 long testimonials → trust bar → final CTA → footer. Plus /pricing tiers + 100+ row table, compare hub, 13 compare pages, 6 solution pages, blog, about, security, contact, glossary, and site-wide SEO rules. Your message adds the missing layer: the keyword→URL map, exact metadata, per-page-type schema, technical checklist, internal-linking rules.

**Verified in the current project:** `public/` contains only `assets/` and `favicon.png` — there is **no robots.txt and no sitemap.xml**. `src/routes/pharmabro.index.tsx` (880 lines) already has head() meta + one JSON-LD block and the section set; `src/lib/pharmabro/home.ts` holds the copy. The nav (`PharmaBroNav.tsx`) is already a white liquid-glass pill but its entrance/scroll motion is CSS-only and flat.

---

## Phase 1 (this build): Homepage revamp + site-wide SEO foundation

### 1. Design system pass — `src/styles.css` (`.pharmabro-scope`)

Rebind tokens to the Sunbeam/Valeryn palette while keeping white: canvas `#FFFFFF`, surface `#FAFAF9`, stone `#F5F5F4`, hairline `#E9E6E1`, ink `#1A1A1A`, ink-muted `#535353`, accent stays PharmaBro electric blue. Add radius scale 8/12/16/24px + 999px pills, and the exact Sunbeam layered shadow + footer lift as `--pb-shadow-card` / `--pb-shadow-lift`. Keep mono tabular-nums on every figure (old spec's identity rule).

### 2. Motion layer — new `src/components/pharmabro/motion.tsx`

One shared primitive set using the extracted values: `PB_EASE = [0, 0.82, 0.56, 1]`, `PB_EASE_HERO = [0.05, 0.58, 0.56, 1]`.

- `FadeUp` (y 24, 0.6s), `NavDrop` (y −24 then children y −12 @ 0.1s stagger), `HeroLine` (y 40, rotate −1, 1.2s), `Stagger` (0.08s), `KineticLine` (per-letter, Valeryn), `Marquee`, `CountOnce`.
- Everything is `whileInView` with `once: true` and a no-JS static fallback; all of it collapses under `prefers-reduced-motion`.

### 3. Nav — `PharmaBroNav.tsx`

Keep white liquid pill; add: `blur(30px)` + Sunbeam shadow, entrance NavDrop + staggered items, scroll-state spring (width/padding/shadow tighten past 80px), animated underline on hover, mega-menu that fades+lifts with per-column stagger, and a scroll-progress hairline under the pill.

### 4. Homepage rebuild — `pharmabro.index.tsx` + `src/lib/pharmabro/home.ts`

Keep all 16 spec sections and copy; restyle to the reference grammar:

- Hero: review/live chip above H1 (Sunbeam), rotating word with accent-lift pill, HeroLine motion, 4-check trust row, right dashboard card stack with numbers incrementing once, routing row updating, rebill countdown pulse.
- Stat band as Valeryn "PROOF IN NUMBERS" strip + grayscale logo marquee.
- Positioning break on stone bg, large display quote, KineticLine on the proof sentence.
- Comparison table and The Math as hairline tables, mono tabular figures, breach footnote with source link.
- How-it-works: 3 bands with a scroll-filling progress line.
- Six-feature grid: 24px-radius cards, hairline borders, hover lift.
- Dashboard section: existing mockup inside the liquid frame + 4 points.
- LegitScript progress bar, switching 3-cards, testimonials as Sunbeam mosaic, trust bar, full-bleed final CTA, 5-column footer with the full COMPARE column.
- Add the **calculator/pricing preview** teaser block from the old spec (static default table in DOM under the interactive layer).

### 5. SEO foundation (the main work)

- **`public/robots.txt`** — allow GPTBot, ClaudeBot, PerplexityBot, BraveBot, Google-Extended, CCBot; `Sitemap:` line pointing at the live domain.
- **`public/sitemap.xml`** — every existing PharmaBro route with real `lastmod`; `/pharmabro/demo` excluded (noindex).
- **`src/lib/pharmabro/seo.ts`** — single source of truth: keyword→URL map (one page owns one query), exact title/description per route from your table, per-page-type schema builders (Organization, WebSite, FAQPage, BreadcrumbList, Product+Offer, Article, DefinedTerm, CollectionPage), and internal-link maps (homepage 25+ out; footer ships the full COMPARE column sitewide).
- **Homepage head()** — H1 `Launch your GLP-1 brand. We run the clinic behind it.`, title/description per your spec, self-referencing canonical + og:url, `Organization + WebSite + FAQPage + BreadcrumbList`, visible "Updated {date}" bound to `dateModified`.
- **DOM guarantees** — FAQ answers, comparison rows, math table and calculator default state all render server-side (no JS-gated text), single H1, strict H2/H3, no paragraph opening with "it/this/the platform", first paragraph names PharmaBro, explicit width/height + descriptive alt on every image.

### 6. Verification before I call it done

`curl` the built homepage and grep for the H1 and for a comparison-table figure, screenshot desktop + mobile via Playwright, and run the SEO scan.

---

## Phase 2+ (planned, not built this turn)

1. **Metadata + schema sweep** across all existing PharmaBro routes from `seo.ts` (pricing Product/Offer ×4, compare Article+FAQ, platform/solutions WebPage+FAQ, `/pharmabro/demo` noindex), plus footer COMPARE column sitewide.
2. **Compare layer** — hub copy + all 13 vs-pages to spec depth, `{x}-alternative` second URL pattern, flagship `best-white-label-telehealth-platforms`.
3. **Glossary ×25–50** with DefinedTerm + 4 related-term links each.
4. **Solutions ×6** and **platform/feature pages** to full spec length.
5. **/calculator** standalone with static mirror table.
6. **Blog architecture** + index, Article+FAQPage schema, ≥25 internal links per post.
7. **About / Security / Contact-Demo** to spec.
8. **Measurement** — indexed-pages, bookings by landing page and referrer, compare-page rankings.

## Technical notes

Route files stay dot-named under `src/routes/` with matching `createFileRoute` IDs; head metadata stays in each route's `head()` (canonical on leaves only). Copy stays in `src/lib/pharmabro/*` so pages remain thin. Offer numbers are locked to the values above and centralized in one module so pricing can never drift between pages. No em dashes in user-facing copy, per your earlier rule.
