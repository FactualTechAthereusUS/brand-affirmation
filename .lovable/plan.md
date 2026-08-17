# Applying the Rimo / Cuvo / Bask / Framer layout grammar to PharmaBro

I read all four files end to end. Here is exactly what is in them, what is reusable, and how it lands on our site.

---

## What each file actually contains

**rimo-clean.html** — full Rimo homepage DOM. 9 sections, all `bg-white py-24`. H1 `text-[2.25rem] font-normal leading-[1.08] tracking-[-0.025em] lg:text-[3.5rem]`, H2 `text-3xl font-normal tracking-[-0.02em] lg:text-[2.75rem]` — light weight, tight tracking, never bold. Section flow: eyebrow pill hero ("New — the 2026 guide") → "Built to run itself" tabbed analytics panel → 5-card bento "Everything under one roof" (payments / rebill engine / verticals / data export / growth chart) → dashboard tab switcher (Dashboard, Intake Builder, Custom Domains, Patient Experience) with exact figures `$47,582.98`, `7,247`, `2,414`, `110` → 4-step order journey with real checkout/portal mockups → pharmacy logo band → 5-column comparison table grouped into Pricing & Revenue / Ownership & Control / Platform & Launch / Tech & Integrations → migration 3-card → LegitScript 7-14 vs 3-6 months bar pair → CTA + 4-column footer. Icons are plain lucide 24x24 stroke sets. Only real files: `legitscript.svg`, `dashboard-bg.svg`. Wordmark paths are stripped (`d=""`).

**cuvo-clean.html** — Cuvo homepage. H1 "Launch your GLP-1s brand. Cuvo runs the clinic." Two-line H2/H3 headings with a deliberate mid-heading break ("One clinical team / behind every brand"). 4-tab hero with a full-bleed photographic background per tab, 43 image references (`/images/home-2026/hero/tab-N/...webp`, category cards, partner logos: Amazon Pharmacy, Curexa, FedEx, UPS, Quest, Labcorp), a `pricing-bg-texture.webp` behind the pricing block, an 8-post "Field notes" editorial grid, grouped pricing table, FAQ, CTA. Icons are 2px-stroke 24x24 arrow/close primitives, arrow often `-rotate-45`.

**pasted-19-30-52.txt** — Bask homepage body. Dark canvas, `custom-container mx-auto w-screen px-4`, sections at `py-14 lg:py-[80px]`. Mega-menu with grouped PLATFORM / DOCS / START columns and per-item descriptions. Three long borderless founder testimonials with wordmarks. Uses `<video>` tags, not images, for product panels. Live bar chart "Orders processed 4,211" with axis 0/250/500/750/1k and Completed / Pending / Cancelled legend. Footer with a status pill and a "We Are Hiring" chip.

**pasted-19-14-40.txt** — a Framer designer portfolio ("Design that delivers results"). Not telehealth: this one is the motion and micro-layout reference. Availability chip above the H1, stat chip `99+ Happy clients`, project cards with hover "View Project", tech-stack marquee of 256x256 icon tiles, 3-step "Subscribe / Request / Receive" strip, two-tier pricing cards with a slots-available pill, testimonial wall, two-line accented headings.

---

## What is reusable and what is not

Reusable directly: every layout, grid, type scale, spacing rhythm, section order, table grouping, mockup structure, chart structure, mega-menu shape, footer shape, and all the icon primitives (arrow, arrow -45, close, check, cross — we already use lucide, which is exactly what Rimo ships).

Not reusable: their `.webp` photography and product renders are remote references, not in these files, and they are their brand assets. Those become PharmaBro-generated images or live React mockups. Their wordmark SVG paths are empty in the dumps, so partner and brand logos get built as typeset wordmark chips instead of copied art.

---

## Phase 1 — rebuild the homepage on the Rimo skeleton (this turn's deliverable)

Our `/pharmabro` homepage has the right copy but not this layout discipline. Changes:

1. **Type scale swap** across `src/components/pharmabro/primitives.tsx`: headings move to `font-normal` with `tracking-[-0.025em]`, H1 to `2.25rem → 3.5rem`, H2 to `3xl → 2.75rem`. Drops the current semibold/heavier look.
2. **Hero**: Cuvo/Framer eyebrow chip above the H1, keep the rotating vertical word, add the Rimo two-button pair with micro-copy underneath.
3. **New: tabbed product section** (`PharmaBroTabs`) — Rimo's Dashboard / Intake Builder / Custom Domains / Patient Experience switcher, animated underline, panel cross-fade, our existing `DashboardMockup` as the first panel.
4. **New: 5-card bento** with hairline internal dividers — payments to your own Stripe, in-house rebill engine, unlimited verticals, data export, growth. Each card gets a small live mockup: processor chips, tokenized card `•••• 4242`, `patients.csv 4.2 MB Ready`, a revenue sparkline.
5. **New: 4-step order journey** — checkout card, provider approval, pharmacy routing, rebill scheduled, with a progress line drawn between them and exact non-round figures.
6. **Comparison table** regrouped into Rimo's four labeled groups with our own column tinted full height.
7. **LegitScript block** as the 7-14 day vs 3-6 month bar pair plus the three unlocked-ad-platform rows.
8. **Testimonials** rebuilt Bask-style: three long borderless quotes with typeset wordmarks, no cards.
9. **Bask-style mega-menu** in `PharmaBroNav.tsx`: grouped columns with per-item descriptions, replacing the current plain dropdown lists.
10. **Footer** gains the Bask status pill and hiring chip.

All motion via Framer Motion on the existing `Reveal` primitives, `prefers-reduced-motion` respected. Copy stays verbatim from the PharmaBro spec — layout changes, wording does not.

## Phase 2 and beyond

Then the 31 stub pages, in this order, each on the same grammar: Pricing (Cuvo grouped table + texture plate) → Platform feature pages (Rimo bento per feature) → Solutions verticals (Cuvo category cards) → Compare hub and pages → content surfaces.

## Technical notes

- All edits scoped inside `.pharmabro-scope`; Blissley, `/admin`, `/operator`, `/pharmacy` untouched.
- New components in `src/components/pharmabro/`: `Tabs.tsx`, `BentoGrid.tsx`, `OrderJourney.tsx`, `LegitScriptBars.tsx`, `Testimonials.tsx`.
- Any generated imagery goes to `public/assets/pharmabro/` and is referenced as `/assets/pharmabro/<file>`, per the local-assets-only rule.
- Icons stay lucide, matching what Rimo itself ships. No new icon dependency.
