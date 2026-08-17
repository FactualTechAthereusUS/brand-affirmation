# PharmaBro — build out every remaining page from the spec

Right now the homepage is fully built, but pricing, all compare pages, all solution pages, all platform pages, blog and glossary are placeholder shells (`StubPage`). This plan replaces every one of them with real, spec-exact content using the design grammar already built (bento grids, product tabs, order journey, mono microlabels, two-tone headlines, white canvas, electric blue accent).

Copy comes verbatim from the uploaded spec: titles, descriptions, H1s, intro paragraphs, Direct Answer blocks, Key Takeaways, comparison tables, FAQs, sources. No invented numbers, no em dashes.

---

## New reusable templates (built once, used everywhere)

**Compare page template** — one component driving all 14 pages:
- breadcrumb, category microlabel, H1, "Updated August 2026" freshness chip
- Direct Answer box (the 40-word GEO chunk)
- Key Takeaways card list
- capability comparison table: PharmaBro column tinted full height with green checks, competitor column with red crosses
- cost-gap math block with exact figures from the spec
- FAQ accordion (5 questions per page) wired to FAQPage JSON-LD
- Sources block with real citation links
- "Other comparisons" strip linking 3 sibling compare pages + pricing + demo
- OpenLoop page additionally gets the January 2026 breach notice banner

**Solution page template** — 7 verticals:
- vertical hero with live mini-mockup of that vertical's intake/dashboard
- market context stats with count-up
- what the platform handles for this vertical (bento strip)
- pharmacy and medication coverage rows
- compliance notes, FAQ, links to the relevant platform feature pages

**Platform feature page template** — 6 features:
- feature hero, live React mockup (reusing `DashboardMockup` / `ProductTabs` mockups)
- capability grid, how-it-works steps, FAQ, cross-links to solutions

**Pricing page** — the real thing:
- 4 tiers with published flat fees, setup-fee cards
- grouped 100+ row feature comparison table with sticky group headers and the popular column tinted full height
- interactive revenue calculator from the spec add-on: patient count and AOV inputs, showing flat-fee cost vs a 35% revenue-share cost and the annual gap
- pricing transparency callout, add-ons, FAQ with FAQPage schema

**Blog + glossary**:
- blog index with the 90-post content calendar rendered as a filterable list by month/theme, and a post template
- a first batch of full posts (the foundation set), the rest listed as scheduled entries rather than fake published pages
- glossary with 25 `DefinedTerm` entries and per-term anchors

---

## Content data files

All copy lives in `src/lib/pharmabro/` so routes stay thin:
`compare.ts` (14 entries), `solutions.ts` (7), `platform.ts` (6), `pricing.ts` (tiers + grouped table + calculator config), `blog.ts` (calendar + posts), `glossary.ts` (25 terms).

Route files stay small: head metadata + one template call.

---

## Routing changes

Missing compare slugs get real routes: `pharmabro-vs-wheel`, `pharmabro-vs-whitelabelmd`, `pharmabro-vs-qualiphy`, `pharmabro-vs-fuse-health`, `pharmabro-vs-wizlo`, `pharmabro-vs-nimbusrx`, `pharmabro-vs-leguprx`, `pharmabro-vs-lyv-health`, `pharmabro-vs-medovation-partners`. Existing `pharmabro-vs-bask` keeps its current URL (spec says `pharmabro-vs-bask-health`; I will use the spec slug and keep the old path redirecting so existing links don't break). Compare hub lists all 14 with cost-gap teasers.

Blog gets `pharmabro.blog.index.tsx` + `pharmabro.blog.$slug.tsx`.

## SEO

Per the spec's schema summary: Article + FAQPage + BreadcrumbList on compare, WebPage + FAQPage + BreadcrumbList on solutions and platform, SoftwareApplication + FAQPage on pricing, Article + Person on blog posts, DefinedTerm on glossary. Self-referencing canonical and `og:url` on every leaf using the live project domain. Internal linking follows the spec's linking map. `/sitemap.xml` extended with every new URL.

---

## Phases (approve, I build, you review)

1. **Compare system** — template, data for all 14, hub, new routes, schema. Largest SEO surface.
2. **Pricing** — tiers, grouped feature table, revenue calculator, FAQ.
3. **Solutions** — all 7 verticals.
4. **Platform** — all 6 feature pages.
5. **Blog + glossary** — index, calendar, foundation posts, 25 glossary terms, sitemap.

Each phase ends with a Playwright pass on desktop and mobile before I hand it back.
