# Revamp the plan comparison table (Cuvo grammar)

Rebuild the `#features` comparison table UI on `/pharmabro/pricing` to match the reference layout, keeping **all of our existing copy, groups, rows and values** exactly as they are today.

## What changes (UI only)

**Desktop (md and up)**
- Real column headers per plan: plan name, monthly price, "month-to-month" note, and a per-column "Get started" button. Grow keeps a "Most popular" pill.
- Sticky first column ("Capability") so row labels stay readable while scrolling sideways.
- Group rows become cream full-width band headers (keeping the existing Show/Hide collapse toggle).
- Popular column stays tinted top to bottom; hairline row borders instead of a boxed card.
- Check marks and dashes rendered as quiet glyph cells, values as small mono-ish text.

**Mobile (below md)**
- Sticky 4-button plan picker (Launch / Grow / Scale / Enterprise with price under each name) pinned under the nav.
- Only the selected plan's column renders, so the table fits without horizontal scroll.

**Footer note**
- One-line legend under the table explaining what "Add-on" and "—" mean.

## Technical notes

- `src/lib/pharmabro/pricing.ts`: extend `planColumns` with `price` and `note` pulled from the existing tiers ($1,500 / $3,000 / $5,000 / Custom) and a `ctaTo`. No row or value copy touched.
- `src/components/pharmabro/pricing/FeatureTable.tsx`: rewritten with the responsive plan-picker state, sticky header/column, cream group bands, tinted popular column, and reuse of the existing `Cell` / `MicroLabel` primitives and brand tokens (ink, canvas, mist, marine, hairline).
- Motion stays as-is (existing `Reveal` wrapper); no new libraries.
