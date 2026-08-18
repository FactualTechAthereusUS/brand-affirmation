# PharmaBro Revamp — Phase 1: Motion System, Nav, Homepage

Rebuild the PharmaBro homepage against the new spec verbatim: one shared ease, one motion vocabulary, the contracting liquid header, eleven sections in the exact order given, and SEO that ships real text in the server HTML. No Cuvo cloning — Rimo/Sunbeam/Valeryn restraint: white ground, stone bands, generous air, one blue used sparingly.

## 1. Tokens (single source, rebound cleanly)

Replace the two conflicting `.pharmabro-scope` token blocks in `src/styles.css` with one:

```text
GROUND #FFFFFF · SURFACE #FAFAF9 · INK #0A0A0B · MUTED #6B6B70
HAIRLINE #EAEAE8 · ACCENT #1B4EF5 · ACCENT-SOFT #EEF2FF
radius: cards 20px · buttons 999px · inputs 12px
shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)
max width 1180px · section padding 120px desktop / 72px mobile
ease: cubic-bezier(0.4, 0, 0.2, 1) — the only ease on the site
```

Type: one grotesk. Display 600 / −0.025em / 56–72px desktop, 34–40px mobile. Body 400 / 17px / 1.6 / max 64ch. All numerals `tabular-nums`. Drop the JetBrains Mono micro-label from headline contexts; keep mono only for the 11px uppercase trust strip and numeric columns.

## 2. Motion system

Rewrite `src/components/pharmabro/motion.tsx` to the spec's real values, all on the shared ease, all fire-once, all disabled under `prefers-reduced-motion`:

- `HeroText` — opacity 0.001 → 1, 600ms, delays 0.4s / 0.6s
- `HeroVisual` — y 200 → 0, scale 0.8 → 1, opacity 0.001 → 1, 500ms
- `Reveal` / `RevealGroup` — y 40 → 0, 500ms, 80ms stagger, trigger at 20% in view, once
- `DrawLine` — horizontal rule scaleX 0 → 1, 600ms; vertical variant fills tied to scroll
- `GrowBar` — width 0 → target, 800ms, 200ms stagger
- `CountUp` — 1200ms on first view, then hold

Rule enforced everywhere: nothing moves more than 40px except the hero visual.

## 3. Nav — the contracting liquid header

Rewrite `PharmaBroNav.tsx`:

- At rest: 1180px wide, 20px from top, fully transparent, no border, no shadow
- Past 40px scroll: springs to 940px, `rgba(255,255,255,0.72)` + `blur(20px) saturate(180%)`, 1px `rgba(0,0,0,0.06)` hairline, `0 8px 32px rgba(0,0,0,0.06)`, 400ms
- Scroll down: `translateY(-120%)`; scroll up: `translateY(0)`; 300ms each
- Five items only: Platform ▾ · Treatments ▾ · Pricing · Compare · Resources ▾, then Log in + solid-ink `Book a call` (scale 1.02 hover, 150ms)
- Dropdowns: white panel, 20px radius, same blur/shadow, y −8 → 0 + fade 200ms, close 150ms after mouse-leave

Announcement bar above it: ink bg, white text, 13px, 40px tall, dismissible, dated DEA link.

## 4. Homepage — eleven sections, spec order

`src/routes/pharmabro.index.tsx` rebuilt; copy lives in `src/lib/pharmabro/home.ts` so text is static and server-rendered.

1. Announcement bar (dated link)
2. Nav
3. Hero — centered 760px: NEW pill, static `<h1>` "Launch your GLP-1 brand. We run the clinic behind it." with a visual-only word swap (GLP-1 → peptide → hormone → hair loss → men's health → skin, 2.4s hold, 350ms crossfade, accent-soft pill resizing behind it), extraction paragraph, two CTAs, trust line. Hero visual below: branded patient checkout on a phone, floating, soft shadow, 3° tilt — not a dashboard.
4. Trust strip — 11px uppercase 0.12em muted text between hairlines
5. How it works — 3 steps, connector hairline draws L→R, nodes fill in sequence; H2 is question-shaped
6. What you get — 4 alternating two-column pillars (providers / pharmacy at 0% markup / your brand end to end / you own everything), each H2 linking to its `/platform/*` page with a keyword anchor. Visuals: animated US map, pharmacy still-life, three staggered phone screens, exporting patient table.
7. Seven days — DAY 1–7 rows, vertical rule filling on scroll, 80ms stagger
8. LegitScript — two comparison bars growing L→R (7–14 days vs 3–6 months), ad-platform ticks, footnote disclaimer
9. Pricing preview — 4 tiers, Growth 8px taller with accent border, 80ms stagger, full-pricing link
10. Comparison strip — 6 pill links + all-comparisons
11. FAQ — 10 Q/A, answers present in DOM when collapsed, height expand 250ms, chevron 180°
12. Final CTA — full-bleed surface, 160px padding, nothing else
13. Footer — six columns; the COMPARE column ships on every URL

Locked offer used everywhere: $5,000 setup · $1,000–$5,000/mo by tier · $30 consult month one, refills no consult fee · 0% markup · no revenue share · your Stripe · data yours · live in 7 days · month to month.

## 5. SEO layer

- `src/lib/pharmabro/seo.ts` extended with the keyword → URL map (money / problem-aware / definition tiers) so one page owns one query, plus exact title/description per route type.
- Homepage metadata exactly as specified: title `White Label Telehealth Platform | Launch in 7 Days | PharmaBro`, the given description, one static H1.
- Schema on `/`: Organization + WebSite + FAQPage + BreadcrumbList, self-referencing canonical.
- Visible `Updated {date}` plus `dateModified`.
- No paragraph opens with "it", "this", or "the platform"; first paragraph names PharmaBro.
- `robots.txt` updated to allow GPTBot, ClaudeBot, PerplexityBot, BraveBot, Google-Extended; `sitemap.xml` with real `lastmod`.
- 25+ internal links out of the homepage with keyword anchors, never "learn more".
- Verify with `curl` that "We run the clinic" is in the raw HTML before JS runs, plus explicit width/height and descriptive alt on every image for CLS.

## Technical notes

- Word swap and all reveals are CSS/motion layers over static DOM text, so crawlers see the full copy.
- One ease token in CSS consumed by both CSS transitions and motion components; no per-component eases.
- Nav scroll state uses a single passive scroll listener with a rAF guard; width/transform only, no layout thrash.
- FAQ uses grid-template-rows height animation with answers always in the DOM.
- Pillar visuals are added as local assets under `public/assets/` per the project's local-assets rule.

## Scope

Homepage, nav, announcement bar, footer, tokens, motion system, and homepage SEO only. `/pricing` (Part 3), `/compare-plans`, `/compare/*`, `/platform/*`, `/treatments/*`, and the glossary come in later phases against the same route map.
