# PharmaBro — separate site inside this project

A second, fully independent marketing site living under `/pharmabro/*`. It shares nothing with Blissley except the React/Tailwind/Framer Motion toolchain. Its own routes, its own components, its own color scope, its own fonts, its own nav and footer.

Built from the uploaded spec (1,462 lines) using its exact copy. Structure follows Rimo, hero interaction follows Cuvo, stat proof follows Bask — all on **white**, never dark.

---

## Hard rules for this build

1. **White background everywhere.** `#FFFFFF` canvas, `#FAFAFA` for alternating section bands. No dark page backgrounds. The only dark surfaces are the announcement bar gradient, the final CTA panel, and filled buttons.
2. **Zero Blissley coupling.** No imports from `src/components/home`, `src/components/weight-loss`, `src/components/admin`, or Blissley routes. If a primitive is needed, it gets rebuilt inside `src/components/pharmabro/`.
3. **Copy comes verbatim from the spec.** Headlines, subheads, feature card text, table rows, FAQ answers, meta titles and descriptions — all lifted exactly. Nothing invented.
4. **Spec copy rules enforced:** no em dashes, no "seamlessly / leverage / robust / cutting-edge", sentence case headings, active voice, numbers over words, operator language (CAC, LTV, ROAS, MRR, rebill).
5. **One section at a time.** Quality over speed, per your instruction. Phase gates below.

---

## Structure (fully separate)

```
src/routes/
  pharmabro.tsx                  layout: scope wrapper + nav + footer + <Outlet/>
  pharmabro.index.tsx            homepage (16 sections)
  pharmabro.pricing.tsx
  pharmabro.demo.tsx
  pharmabro.platform.index.tsx
  pharmabro.platform.$slug.tsx   6 feature pages, data-driven
  pharmabro.solutions.$slug.tsx  7 verticals, data-driven
  pharmabro.compare.index.tsx    hub, 16 cards
  pharmabro.compare.$slug.tsx    14 comparison pages, data-driven
  pharmabro.blog.index.tsx
  pharmabro.blog.$slug.tsx
  pharmabro.glossary.tsx         25 DefinedTerm entries
  pharmabro.about.tsx
  pharmabro.security.tsx
  pharmabro.contact.tsx
  pharmabro.legal.$slug.tsx      4 legal pages

src/components/pharmabro/        all UI, nothing shared with Blissley
src/lib/pharmabro/               content data files (compare, solutions, blog, glossary, pricing table)
public/assets/pharmabro/         generated images
```

`.pharmabro-scope` block added to `src/styles.css`, following the exact pattern `.admin-scope` already uses: it rebinds the brand color tokens only for descendants of the PharmaBro layout. Blissley is untouched.

**Palette:** white canvas, `#0A0A0A` ink, `#1B4EF5` electric blue accent, `#E8E8EC` hairlines, plus green/red for comparison table checks and crosses.
**Type:** geometric sans for display and body, monospace for the ALL-CAPS microlabels that carry the whole "serious infrastructure" read.

---

## Design system, from the three references

**From Rimo (primary structure):** white canvas, black pill CTAs, bento grids with hairline internal dividers, gradient announcement bar, tabbed narrative section, value-based comparison table with green own-column and red competitor cells, 5-column footer with status pill.

**From Cuvo:** two-tone headlines (dark first clause, grey second clause), monospace ALL-CAPS section eyebrows and table group headers, narrow ~660px prose column against wider visuals, the 100-plus-row grouped pricing table with the popular column tinted full height, the programmatic comparison page system with cited sources.

**From Bask:** tiny square eyebrow markers, giant unrounded stat counters, borderless three-column testimonials with wordmarks, 4-across hairline feature strips.

Adapted to white, not copied to dark.

**Specificity rule:** every fake number in a mockup is exact, never rounded. `$127,430.82`, `Order #4,112`, `1,247 patients`, `$389,220 forecast` — straight from the spec.

---

## Motion (Framer Motion)

Fade-up reveals on scroll with staggered children. Hero rotating word cycling Weight Loss / TRT / Peptide / Hair Loss / Hormone on a spring. Stat counters animating on viewport entry. Live dashboard panel where revenue increments, pharmacy routing advances through states, and the rebill countdown pulses. Progress line drawing between the three "how it works" steps. Comparison table rows revealing in sequence. Respects `prefers-reduced-motion`.

---

## Images

Generated into `public/assets/pharmabro/` and referenced as `/assets/pharmabro/<file>`, matching the project's local-assets rule. No CDN pointers.

Isometric 3D-style renders in the Bask register but light: glossy blue-and-white forms on white, pharmacy routing diagram, payment tokenization visual, pharmacy network map, LegitScript certification badge composition, and the gradient mesh plates that sit behind screenshots.

Dashboards, charts, tables, and the pharmacy routing animation are built as **live React components**, not images. They look sharper, animate, and stay crisp on retina.

---

## SEO (the main goal)

Per route, from the spec's own values:

- `head()` with the spec's exact title and description, plus `og:title`, `og:description`, `og:type`, `twitter:card`, `og:url`, and a self-referencing canonical on every leaf.
- JSON-LD per the spec's page-type table: Organization + MedicalOrganization + WebSite on the layout; SoftwareApplication + FAQPage on pricing; Article + FAQPage + BreadcrumbList on compare pages; WebPage + FAQPage + BreadcrumbList on feature and solution pages; Article + Person on blog posts; DefinedTerm on all 25 glossary entries.
- GEO blocks the spec calls for: "Direct Answer" H3 chunks, Key Takeaways boxes, "Updated [Month Year]" freshness chips, cited Sources lists with real links.
- Single H1 per page, semantic sectioning, descriptive alt text, lazy-loaded images below the fold.
- Internal linking per the spec's rules: homepage to 8 pages, each compare page to 3 sibling compares plus pricing and demo, solution pages to their feature pages.
- `/sitemap.xml` extended to include every PharmaBro URL.

**One decision I need from you:** the spec hardcodes `https://pharmabro.co` in every canonical and schema `@id`. This project serves from `sweet-confirm-it.lovable.app`. Canonicals pointing at a domain this build does not serve would tell crawlers to ignore these pages entirely. Default plan: use the live project domain for canonical and `og:url`, keep `pharmabro.co` only in display copy. Say the word if pharmabro.co is already live and pointed here and I will use it instead.

---

## Phases (approve one, I build it, you review, we move on)

**Phase 1 — Foundation and homepage.** This turn's only deliverable.
`.pharmabro-scope` tokens, the layout route with announcement bar, nav with all four dropdowns, and footer. Then the homepage's 16 sections: hero with rotating word and live dashboard panel, logo bar with stat counters, positioning break, the 5-column comparison table, 3-step how-it-works, 6-feature grid, dashboard feature section, the math table, LegitScript bar chart, switching cards, testimonials, trust bar, final CTA. Plus homepage schema and the first image set.

**Phase 2 — Pricing.** 4 tiers, setup-fee cards, the full 100-plus-row grouped feature table, add-ons, FAQ with FAQPage schema.

**Phase 3 — Compare.** Hub with 16 cards, the OpenLoop anchor page in full including the breach notice banner and Sources block, then the remaining 13 driven off one data file and one template.

**Phase 4 — Platform and Solutions.** 6 feature pages, 7 vertical pages.

**Phase 5 — Content surfaces.** Blog index and post template, glossary with 25 DefinedTerm entries, about, security, demo, contact, legal.

On the 100-plus blog posts: I will build the index, the post template, and a first batch of fully written posts from the spec's calendar. Generating 100 complete articles is a content project, not a build task, and the spec's own calendar only names 15. I will flag where the data file expects more.

---

## Note on the stack

The spec assumes Next.js App Router with ISR. This project is TanStack Start, which covers the same ground: file-based routes, SSR, per-route `head()` for metadata, and loaders for data. Every SEO requirement in the spec maps over cleanly. Nothing is lost.
