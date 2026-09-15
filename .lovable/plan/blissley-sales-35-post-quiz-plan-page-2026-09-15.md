# Blissley `/sales-35` Post-Quiz Plan Page

## Goal

Create a new `/sales-35` route by reusing the proven selection and checkout behavior from `/sales/DM`, while rebuilding the presentation around the uploaded Mars Men reference and the supplied 13-section Blissley copy.

The page will support two complete visual modes:

- **White:** Blissley canvas, black text, coral pink emphasis, and existing Blissley typography.
- **Dark:** Mars Men-style near-black canvas, white type, and vivid orange emphasis.

A persistent accessible theme switch will let patients change modes without losing medication or plan selections. The initial mode will respect their system preference and persist locally.

## Reference mapping

Every major section in the source will include a concise code comment naming the exact uploaded reference move it implements, making the mapping auditable.

1. **Opening ticker** — Mars Men’s looping identity-outcome ticker.
2. **Personalized result** — Blissley post-intake personalization and existing animated trajectory chart, corrected to physician-review language.
3. **Reader story and mechanism reveal** — compact editorial narrative with oversized display lines and a highlighted GLP-1 mechanism reveal.
4. **Medication choice** — Mars Men tier-card anatomy: badge, one-line positioning, benefits, and price; no medication photography.
5. **Plan selection** — selectable monthly, 3-month, and 6-month cards with accurate charged-today, monthly equivalent, savings, and 6-month benefits.
6. **Included value stack** — Mars Men “Launch Kit Includes” structure plus IM8 itemized value comparison.
7. **First 90 days** — Mars Men Day 7/30/90 rhythm combined with Primal Storm’s phased journey; scroll-led numbered timeline.
8. **Clinical reviewers** — Mars Men/IM8 advisory-board structure using only the supplied real Blissley clinician names and known details.
9. **Comparison** — the compact row-by-row Mars Men/Primal Storm comparison grid.
10. **Patient outcomes** — all eight supplied testimonials, each leading with its measurable or specific result.
11. **Guarantee** — standalone high-contrast guarantee block with the exact approval and refund terms supplied.
12. **FAQ** — accessible animated accordions using the supplied questions and answers verbatim.
13. **Close** — no timer or invented scarcity; physician review timing plus “Send my case to a physician.”

## Interaction and conversion behavior

- Medication and plan cards are fully keyboard accessible and expose selected states.
- Selecting a plan updates the summary and CTA while keeping the visitor on the page.
- Primary submission sends the selected medication and plan to the existing `/checkout/charged-before` flow.
- Sticky mobile action bar appears only after the offer is reached and never obscures content.
- Motion uses short reveal, ticker, chart-draw, and timeline transitions with reduced-motion fallbacks.
- No fake counters, countdowns, fabricated ratings, or unsupported clinical claims.

## Visual build

- Use a narrow reading column for personalization and story, then widen pricing, timeline, comparison, and outcomes for desktop.
- Recreate Mars Men’s bold editorial hierarchy, sharp dividers, uppercase utility labels, dense offer cards, orange dark-mode emphasis, and alternating black/white bands.
- Keep Blissley’s existing coral, black, and white system intact in white mode.
- Create one original, local editorial medical-team visual for the clinician section. It will be supporting artwork, not fake portraits of named physicians.
- Keep all new assets local under `/public/assets`; run the project asset cleanup and verify no managed CDN paths remain.

## Responsive and quality checks

- Verify desktop at 1280px and mobile at 390px with screenshots.
- Test theme switching, medication selection, plan selection, FAQ expansion, sticky CTA, and checkout navigation.
- Check text overflow, section overlap, reduced-motion behavior, console/runtime errors, and the latest build result.
- Add unique `/sales-35` title, description, Open Graph title/description, `og:type`, and Twitter card metadata.  
  

  no , u didnt went through those txt file, first go thorugh them , and then only start executing , i want exact , take all the svgs, and icons and liquid and shit from tehre 