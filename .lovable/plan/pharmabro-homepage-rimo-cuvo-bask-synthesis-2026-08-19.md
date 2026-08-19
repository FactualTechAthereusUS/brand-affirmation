# PharmaBro Homepage — Rimo + Cuvo + Bask Synthesis

Revamp the homepage around the sections you named as frozen. Everything else gets rebuilt to the new spec.

## Untouched (frozen)

- Nav (liquid-glass pill, wordmark/icon logic)
- Hero (rotating word, badge, CTAs) + the full-width dashboard tab board below it
- Clinic pair block: "your intake on their phone", "PharmaBro handles every prescription", phone loop animation, "revenue in real time"
- "Watch your brand grow in real time" analytics section
- "Built to run on, not grow out of"
- "A complete clinic, operated end to end" (clinic live on day one)  
your clinic live 

## New sections

**Announcement bar (Rimo)** — full-width gradient orange to violet, dismissible with an X (state persisted in sessionStorage so it stays closed while browsing), white text, "Learn more" link to the demo page. Sits above the nav; nav offset adjusts when dismissed.

**Scale stats strip (Bask)** — full-bleed near-black band, four large numbers with small captions: 340+ licensed providers · 51 states with coverage · 6 treatment verticals · 14 days to first patient. Count-up on scroll into view, no marketing copy.

**Brand logo wall (Bask)** — "Trusted by the brands running on PharmaBro." Static grid of 8 placeholder wordmarks on desktop, scrolling ticker on mobile.

**Testimonials (Bask)** — three quote cards with role attributions (Founder, Weight Loss Brand / Operator, Men's Health Brand / Founder, HRT Brand). Hairline cards, quote mark, no photos.

## Rebuilt sections

**"The business is already built"** — replaces the current "Everything under one roof" grid. H2 "Everything that takes years to build. Already built." Four cards in a 2x2: licensed medical group, contracted pharmacies, filed compliance, running billing engine. Full spec copy, numbered hairline cards with hover lift.

**From intake to recurring revenue** — replaces the current checkout-to-revenue block with a Rimo-style 4-tab flow: Checkout completes, Care begins, Prescription routed, Revenue compounds. Tabs auto-advance with a progress bar, click to pin, animated panel crossfade; stacked accordion on mobile.

**Nationwide coverage (Cuvo)** — H2 "All 50 states. From day one." Left: 51-tile state grid in indigo with staggered reveal. Right: coverage paragraph. Pharmacy and carrier logo row underneath (South End, Epiq Scripts, AbsoluteRx, Curexa, FedEx, UPS).

**Comparison table** — kept on the homepage, restyled: three groups (Pricing & Revenue, Ownership, Platform & Launch), PharmaBro column highlighted, sticky row labels on mobile with horizontal scroll, sourced-figures subhead.

**LegitScript** — H2 "LegitScript in days, not months." Body plus a three-bar timeline chart that animates width on view (2 days / 7-14 days / 90 days) and three supporting columns.

**From the blog (Cuvo)** — five photo cards with category and date chips, first card featured wide. Generated editorial photography (vials, pharmacy bench, cold-pack shipping, documents) since we have no real images for these.

**Pricing card (Cuvo)** — single focused card: "Starting at $1,500 / month", setup and tier line, "View full pricing" link, three sub-facts ($30 per consult, 3% to 1.5% transaction fee, LegitScript included $0).

**FAQ** — left sticky heading, right accordion with the 8 questions.

**Final CTA band** — near-black band, "The business is built. Your brand is the missing piece.", body, two CTAs.

**Mega footer (Cuvo)** — 5 columns: brand + support email, Platform, Verticals + Company, Learn, Compare (all 17 comparison pages). Bottom bar with legal links, LegitScript Certified mark, "All Systems Normal" dot, 10px disclaimer and the Blissley infrastructure line.

## Notes

- The existing "Keep patients on treatment" retention section isn't in the new spec; it will be removed unless you want it kept.
- All copy, tab data, stats, testimonials and footer links go into `src/lib/pharmabro/home.ts` / `nav.ts` so schema and rendering stay in sync.
- Motion stays Framer Motion with the existing PB easing curves and reduced-motion fallbacks; no em dashes in copy.
- SEO: FAQ, Organization, Product and Breadcrumb JSON-LD updated to match the new on-page copy; single H1 preserved with the crawlable static hero line.

## Technical detail

New components under `src/components/pharmabro/home/`: `AnnouncementBar.tsx`, `ScaleStats.tsx`, `LogoWall.tsx`, `Testimonials.tsx`, `AlreadyBuilt.tsx`, `IntakeToRevenue.tsx`. `SectionsA.tsx` / `SectionsB.tsx` keep the frozen exports and lose the replaced ones. `pharmabro.tsx` layout renders the announcement bar; footer rewritten in `PharmaBroFooter.tsx`. No backend or data-layer changes.