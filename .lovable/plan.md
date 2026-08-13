# Editorial Listicle Presell Page

A new advertorial-style article page for Blissley weight loss, built on the numbered-listicle pattern from the reference (blog chrome, marker-highlighted deck, alternating numbered rows, inline CTA strips), rendered entirely in our brand system — marine `#1D437B`, coral `#ee7273`, ink, canvas, Google Sans Flex. No purple, no green, no tan.

Route: `/presell/weight-loss` (`src/routes/presell.weight-loss.tsx`). Every CTA goes to `/intake/weight-loss`.

## Page structure

1. **Blog chrome** — slim cream bar, "Blissley Health Notes" wordmark with uppercase kicker, single hamburger (opens nothing but a simple sheet with Home / Programs / Reviews). Fixed vertical "★ REVIEWS" tab on the right edge (desktop only) that scrolls to the reviews block.
2. **Hero** — left-aligned narrow column: breadcrumb, big black headline ("7 Reasons The Weight Comes Back — And What Finally Stops It"), deck with coral-tinted marker highlight behind the text lines, before/after split image with ✗ / ✓ badge overlays, then a bordered author strip (headshot, "By [clinician], Blissley Clinical Team", italic publication line).
3. **First-person intro** — short punchy paragraphs with bolded phrases, then a tinted "You probably know this loop:" qualifier box with 4 bullets and a "you're in the right place" closer.
4. **7 numbered reasons** — each a centered numbered H2 plus a two-column row that alternates image side / copy side; copy is one-sentence paragraphs, coral ✓ bullets for mechanisms, one bolded punchline. Image slots use existing project assets and simple composed panels (no new stock photography).
5. **Inline CTA strips** — full-bleed bands after reasons 2, 5 and 7 with first-person link labels ("How I finally kept it off", "What actually worked for me"); final band uses solid coral "See if you qualify".
6. **Proof blocks** — a linked study citation line, bold ✓ stat lines (e.g. % who stayed on plan), an honest limitations paragraph ("this isn't for everyone — here's who it's not for").
7. **The Bottom Line** — ✓ criteria checklist beside a BEFORE/AFTER pair, then the program name reveal and closing CTA.
8. **Reviews block** — reuse the existing review data/style so the ★ REVIEWS tab has a real destination.
9. **Footer** — reuse the marketing footer with a visible advertorial disclosure line.

## Behaviour

- Sticky mobile CTA bar appears after the reader passes reason 1.
- Scroll reveals on each numbered row (existing `Reveal` component), no new animation library.
- Fully responsive: single column under `lg`, image above copy, CTA bands full-width.

## Technical notes

- One route file plus a `src/components/presell/` folder: `PresellChrome`, `HighlightDeck`, `QualifierBox`, `ReasonRow`, `CtaBand`, `BottomLine`, `AuthorStrip`.
- Highlight effect via a CSS utility in `src/styles.css` (inline background-image gradient behind inline text), not hardcoded colors in components.
- Content lives in a typed array in the route file so reasons can be reordered or duplicated for other categories later.
- Head metadata: unique title/description/og tags for the article.
- Any new imagery is composed from existing local assets in `public/assets`; no `__l5e` URLs.
