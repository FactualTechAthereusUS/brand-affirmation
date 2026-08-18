# PharmaBro Homepage Revamp

Rebuild the PharmaBro homepage section-by-section to the new spec, roll the new pricing across the site, and upgrade the SEO/schema layer. Nav, footer, and the announcement bar get the spec treatment too since they live on every page.

## New pricing (applied everywhere)

The locked offer changes. Every page that quotes numbers gets updated in the same pass so nothing contradicts.

| Tier | Setup | Monthly | Patients | Txn fee | Consult (mo 1) |
|---|---|---|---|---|---|
| Launch | $15,000 | $1,500 | 0-500 | 3% | $30 |
| Grow | $25,000 | $3,000 | 501-2,000 | 2% | $28 |
| Scale | $50,000 | $5,000 | 2,001-5,000 | 1.5% | $25 |
| Enterprise | Custom | Custom | 5,000+ | Custom | Custom |

LegitScript included in every tier. Add-ons: extra vertical $2,500, priority launch $5,000, custom intake quiz $1,500. Time to launch becomes 14 days (was 7). Pages touched: homepage, /pharmabro/pricing, comparison data, compare pages, revenue calculator, solutions pages where prices appear.

## Homepage sections (in order)

1. Announcement bar - dark navy gradient, 40px, dismissible with an X, white pill "Learn more" link.
2. Hero - white, centered. `NEW` pill badge above the H1, rotating highlighted word (Weight Loss / TRT / HRT / Hair Loss / Sexual Health / Peptides) on a 2.4s cycle, subhead, dual CTA, "No medical license required. All 50 states. LegitScript included."
3. Dashboard tabs - full-width product shot with four tabs (End-to-end operations, Providers in all 50 states, Pharmacy fulfillment, Compliant by default).
4. A complete clinic, operated end to end - two column copy plus a checklist card, then a captioned product row.
5. Everything under one roof - H2 plus a 6-card grid, each card carrying a small coded visual (Stripe routing, tokenized card, brand switcher, CSV export, revenue trend).
6. Built to run on, not grow out of - split heading, then a full-width gradient card with a dashboard inside.
7. From checkout to recurring revenue - four interactive tabs with per-tab detail bullets, ending on the rebill/MRR panel.
8. Nationwide infrastructure - copy rows plus a 50-state + DC tile grid and a pharmacy/carrier logo row.
9. Keep patients on treatment - three accordion rows with paired visuals.
10. Watch your brand grow in real time - dark band, three tabs (Reporting, Insights, Live Analytics) plus a wide analytics visual.
11. How PharmaBro compares - three-group table vs Bask, OpenLoop, CareValidate, with footnote.
12. LegitScript certification in days, not months - copy, horizontal timeline bars (2 days / 7-14 days / 3-6 months), three explainer columns, disclaimer.
13. From the blog - five cards with category chip, date, title, blurb. All links point at `/pharmabro/blog` since individual posts do not exist yet.
14. Pricing - single centered card, "starting at $15,000 setup / $1,500 per month", link to full pricing.
15. FAQ - eight questions, left sticky heading, right accordion.
16. Final CTA band - near-black, centered, decorative product images around the copy.
17. Footer - five columns per spec, quick actions, status/LegitScript bottom bar, two-paragraph legal disclaimer. Only routes that exist get links; compare and blog entries map to live slugs or the hub.

## Images

Only `pharmabro-dashboard.png` exists, so it is reused across the dashboard/analytics slots. Every other screenshot slot renders as a clearly framed placeholder panel (correct aspect ratio, subtle label) fed from one config list, so dropping in real images later is a one-line change per slot. Blog card images use the same placeholder treatment. No new image generation.

## SEO

- Title: "PharmaBro - White-Label Telehealth Platform for Brand Founders"; description per spec.
- Schema graph: Organization (with `knowsAbout`), WebSite, WebPage, SoftwareApplication (HealthcareApplication, $1,500-$5,000), FAQPage with all 8 Q&A, Service + Offer per tier with the new numbers, BreadcrumbList.
- `public/robots.txt`: add explicit Allow blocks for GPTBot, ClaudeBot, PerplexityBot, BraveBot; keep the sitemap line.
- Single H1, semantic section headings, static crawlable H1 text alongside the rotating word.

## Technical notes

- Content stays in `src/lib/pharmabro/home.ts` (rewritten) and `src/lib/pharmabro/pricing.ts`; the offer constants in `src/lib/pharmabro/seo.ts` are updated to the new numbers and schema builders gain per-tier Service/Offer nodes.
- New section components under `src/components/pharmabro/home/` so `pharmabro.index.tsx` stays a readable composition rather than a 900-line file.
- Reuse the existing motion helpers (`HeroLine`, `Rise`, `Marquee`, `KineticRule`) and Sunbeam-style card/radius tokens already in `.pharmabro-scope`; add tokens for the navy announcement gradient, the purple-blue gradient card, and the dark bands.
- Announcement dismissal persists in localStorage, read in an effect to avoid hydration mismatch.
- Nav gains the spec's center links and right-side action cluster, collapsing to the existing mobile drawer.
- No em dashes in any copy.

## Out of scope for this pass

Individual blog posts, `/launch/[state]` pages, and the remaining compare slugs. Called out so the homepage links stay honest.
