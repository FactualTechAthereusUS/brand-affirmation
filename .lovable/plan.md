## Corrected plan: Shopify-grade Funnel & CRO analytics

### What the full TXT establishes
- A dense, full-width analytics workspace—not a decorative dashboard.
- A compact single-row header with status, auto-refresh, fullscreen, customize, targets, exploration, date, comparison, and currency controls.
- A responsive metric-card grid where each card is independently labeled and interactive.
- Cards use a consistent hierarchy: linked metric title, definition/help action, primary value, comparison delta, working visualization, hover data, and legend.
- Charts expose real axes, current/prior series, point-level hover states, crosshairs, and accessible table/region semantics.
- Controls open real menus/popovers and visibly change the reporting state.

### Implementation
1. **Rebuild the analytics toolbar**
   - Match the compact Shopify hierarchy while retaining Blissley’s admin tokens.
   - Add working date-range and comparison controls, auto-refresh toggle, fullscreen action, customize mode, targets panel, and export.
   - Persist selected range/comparison in route search state.

2. **Standardize metric-card behavior**
   - Introduce one dense reusable analytics-card structure for every CRO metric.
   - Include title/help tooltip, value, prior-period change, numerator/denominator context, chart, hover detail, and legend.
   - Use responsive full-width grids with no oversized whitespace.

3. **Upgrade every chart from visual-only to analytical**
   - Preserve real demo data and make range/comparison changes recalculate all series.
   - Add readable axes, current/prior distinction, crosshair tooltips, keyboard-focusable data points, legends, and empty states.
   - Keep the funnel, line/area, and bar views mathematically aligned with the same underlying totals.

4. **Make customization and targets functional**
   - Customize mode will allow cards to be shown/hidden and reordered in demo state.
   - Targets will support suggested targets and custom thresholds, then show progress directly on relevant cards.
   - Fullscreen and auto-refresh controls will have real UI states rather than static rendering.

5. **Retain telehealth-specific CRO content**
   - Keep Presell, Sales, Intake, Checkout, Purchase, biggest leak, worst intake screen, abandoned carts, and screen-level drop-off.
   - Present them through the reference’s analytics system instead of copying Shopify commerce labels.

6. **Responsive and accessibility pass**
   - Desktop: dense multi-column analytics grid.
   - Tablet: balanced two-column cards and scroll-safe toolbar.
   - Mobile: single-column cards, condensed controls, usable chart tooltips, and no clipped tables.
   - Add labeled regions, semantic chart/table fallbacks, focus states, and correctly named controls.

7. **Verification**
   - Exercise date, comparison, auto-refresh, fullscreen, customize, targets, exports, legends, and chart hovers.
   - Validate desktop/tablet/mobile rendering and ensure there are no console, hydration, overflow, or route-search errors.