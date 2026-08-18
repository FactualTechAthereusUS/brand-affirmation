# Pricing page rewrite (same UI language, new content)

Keep the current visual system exactly as is — Sunbeam/Rimo cadence, existing primitives (`Section`, `Container`, `TwoTone`, `MicroLabel`, `Card`, `Btn`, `Chip`, `Reveal`), motion, liquid-glass nav. Only content, structure, numbers and schema change.

## New page order

1. **Migration banner** — full-width `#F8F8F8` rounded row, left copy ("Switching from another platform? Free white-glove migration…"), right arrow CTA to `/pharmabro/contact` (with a `migration` intent param).
2. **Hero** — centered: label `PRICING`, H1 "Flat, transparent pricing.", 540px subhead, three trust pills (No revenue share · LegitScript included · Month to month), and a live "Pricing last reviewed August 2026" line driven by one exported constant so schema `dateModified` and the visible date always match.
3. **Pricing cards** — 3-column grid (Launch / Grow / Scale), Grow marked most popular with the indigo-tinted border already used today. Each card: tagline, `$X / month`, one-time setup line, patient band, CTA, included list, plus consult-fee and transaction-fee footnotes.
4. **Enterprise row** — full-width flat row under the cards (5,000+ patients · custom pricing · custom SLA · custom API) with "Talk to us" CTA. Replaces today's Headless card.
5. **Footer note** under cards — what every plan includes; consult fee applies month one only.
6. **"One setup fee. Then month to month."** — 2-col: left body copy, right three stat cards (One-time setup, Month to month, Financing).
7. **"Why our pricing is on this page."** — centered band, max 640px.
8. **Full feature table** — reuse the existing `FeatureTable` component (sticky header, collapsible groups, tinted popular column) with the new 7 groups: Clinical, Pharmacy, Brand & Storefront, Ownership, Payments, Retention, Compliance, Support. Columns become Launch / Grow / Scale / Enterprise. Row hover fill `#F5F3FF`; mobile keeps the current horizontal-scroll behaviour plus per-group collapse.
9. **Add-ons** — 3 cards: Additional vertical $2,500, Priority launch $5,000, Custom intake quiz $1,500.
10. **FAQ** — existing `Faq` component, 2-col with sticky heading, 8 new pricing Q&As.
11. **Final CTA** — dark `#0C0C0C` centered band: "Not sure which plan fits?" / "That's what the call is for." with Book a call (white) and View demo (ghost).

## Content and numbers

All pricing moves to the new figures: Launch $15,000 + $1,500/mo (0–500), Grow $25,000 + $3,000/mo (501–2,000), Scale $50,000 + $5,000/mo (2,001–5,000), Enterprise custom. Transaction fees 3% / 2% / 1.5% / custom; consult fees $30 / $28 / $25, $0 on refills. Every figure stays live text.

The existing revenue calculator section is dropped — the spec replaces it with the setup-fee explainer and the transparency block. Its helper stays in the data file only if still used elsewhere.

## SEO

- Title: "PharmaBro Pricing — Flat Setup Fee, No Revenue Share"; description with $15,000 + $1,500/month, LegitScript included, no revenue share.
- Schema: Organization + Service + three `Offer`s (price, priceCurrency USD, patient band in description) + FAQPage (generated from the same FAQ array) + BreadcrumbList, with `dateModified` bound to the on-page review date.
- Canonical + og/twitter meta on the route's `head()`.

## Technical notes

- `src/lib/pharmabro/pricing.ts` is rewritten as the single content source: `PRICING_REVIEWED` date constant, `tiers` (3 + enterprise row object), `setupStats`, `transparency`, `featureGroups` (new rows), `addOns`, `pricingFaqs`.
- `src/routes/pharmabro.pricing.tsx` recomposed section-by-section; new small components under `src/components/pharmabro/pricing/` for the migration banner, enterprise row, and setup/stat block.
- `PricingTiers.tsx` and `FeatureTable.tsx` are adjusted for 3 plan columns + Enterprise and the new footnotes; styling tokens untouched.
