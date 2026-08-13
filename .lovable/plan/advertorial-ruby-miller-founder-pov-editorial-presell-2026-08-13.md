# /advertorial/ruby-miller — Founder POV Editorial Presell

A news-article-style advertorial at `/advertorial/ruby-miller`, built on the PetLab/Sarah's-Blog editorial pattern but rendered fully in the Blissley system: white canvas, ink text, coral `#ee7273` CTAs, Google Sans Flex, Blissley logo. No purple, tan, or green accents.

Every CTA button reads **"See If You Qualify → 2 Min"** (the price-reveal one reads "See If You Qualify → Claim 45% Off") and routes to `/intake/weight-loss`.

## Article chrome

- Slim white header bar: Blissley logo centered, hamburger on the right (sheet with Home / Programs / Reviews). Bottom hairline.
- Breadcrumb line: Home › Stories › Weight Loss.
- Fixed vertical "★ REVIEWS" tab on the right edge (desktop) that scrolls to the testimonial block.
- Sticky bottom CTA bar (coral) that appears once the reader passes Section 2; on mobile it's full-width, on desktop a centered pill.
- 720px reading column, generous line height, single H1.

## Sections (all copy used verbatim from the brief)

1. **Hook** — H1 "The Real Reason She Couldn't Lose The Weight (Hint: It Was Never Willpower)", coral-marker-highlighted deck, byline strip with author avatar + "by the founder of UnhingedOne · Blissley" + date. Hero image = Ruby present-day portrait. Optional "AS FEATURED" logo row directly under it. Then the intro paragraphs and the Ruby-2024 photo with a "2024 · 283 lbs" caption.
2. **The current situation** — short one-line paragraphs, bolded emotional punchlines, a tinted callout box for "There has to be something wrong with me."
3. **Why nothing worked** — full-width crossed-out alternatives grid image, then four ✗-marked sub-blocks (Diets / Just try harder / The gym / The $1,300 gate) as bordered rows with red ✗ marks.
4. **The root cause** — "It was never willpower." set as a large pull-quote, gut-brain diagram image full width with caption, then the "read that again" emphasis block.
5. **The mechanism** — Blissley product shot, explanation copy, then a 5-item coral ✓ checklist (real doctors / real medication / honest pricing / real human / ships to door) in a card. First inline CTA band.
6. **Proof story** — Ruby before/after image, then a vertical timeline (Week 1 → Week 3 → Week 6 → Month 3 → Last week) with connector line and coral nodes; final quote as a large speech-bubble card.
7. **Objections** — before/after testimonial cards (3, each labeled Verified Patient with a letter avatar and coral tag), then a "You Might Be Wondering…" accordion with the 3 Q&As. Second CTA band.
8. **Price reveal + scarcity** — handwritten anchor-list image, anchor pricing rows with struck-through amounts, then a coral offer card: "45% off your first month for UO fam", live 24-hour countdown, "See If You Qualify → Claim 45% Off".
9. **Crossroads close** — two-column Path 1 / Path 2 cards (Path 1 muted with ✗, Path 2 coral with ✓), trust line, final CTA.
10. **Comments + fine print** — native-style comment thread with avatars, timestamps, reply indentation and like counts; then a small-print disclosure block (results vary, individual results, real consented patients, not medical advice) and the marketing footer.

## Images

Uploaded references map to the eight `[IMAGE]` slots in order (Ruby now, Ruby 2024, crossed-out alternatives grid, gut-brain diagram, Blissley product shot, before/after, testimonial before/after, handwritten anchor list). Each becomes a Lovable asset pointer in `src/assets/` referenced by URL — no `/__l5e/` URLs left raw in components, per the local-assets rule. The crossroads slot in Section 9 is rendered as a CSS/two-card layout rather than an image.

## Technical notes

- New route `src/routes/advertorial.ruby-miller.tsx` plus `src/components/advertorial/` primitives: `ArticleChrome`, `HighlightDeck`, `Byline`, `FigureWithCaption`, `CrossList`, `CheckCard`, `StoryTimeline`, `TestimonialCard`, `FaqAccordion`, `OfferCard` (with countdown), `PathCards`, `CommentThread`, `CtaBand`, `StickyCta`.
- Marker-highlight and article-prose styles added as scoped classes in `src/styles.css` using existing tokens (no hardcoded hex in components).
- Motion: existing `Reveal` for section entrances, `MotionButton` for CTAs. Countdown is client-side with a hydration-safe effect.
- Head metadata: unique title, description, `og:type: article`, og/twitter title+description, self-referencing canonical and `og:url`, plus Article JSON-LD.
- Responsive: single column throughout, images full-bleed-to-column on mobile, two-column only for the Path cards and testimonial grid at `md:`+.
