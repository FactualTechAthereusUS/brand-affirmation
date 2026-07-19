## Redesign "Stay in the loop" onboarding step (notifications)

Update the notifications onboarding step in `src/routes/portal.patient.tsx` (currently the selected `div` around line 1211) to match the full-bleed image + bottom-anchored liquid-glass layout used on the previous steps.

### What changes

1. **Upload asset**: Save the uploaded notifications preview (sky background with 3 blissley notification cards) as a Lovable asset → `src/assets/onboarding-notifications.png.asset.json`.

2. **Full-bleed hero layout** for the notifications step:
   - Image fills the entire step frame as the background (same pattern as the Dr. Nass step).
   - Add a soft gradient overlay (`from-transparent` → `to-white/95`) at the bottom third so text/buttons remain readable over the image.
   - Anchor the content block (`textPos: "bottom"`) at the bottom.

3. **Bottom content block** (over the gradient):
   - Headline: "Stay in the loop"
   - Subtext: "We'll notify you about shipments, messages, and check-ins. Toggle any anytime."
   - Two liquid-glass buttons side-by-side: **Skip** (ghost) and **Get started** (primary coral pill), matching the exact styling used on the earlier onboarding steps (`bg-white/60 backdrop-blur-xl border border-white/40` for glass, coral pink for primary).

4. **Keep existing behavior**:
   - Skip → dismiss onboarding
   - Get started → dismiss onboarding and mark tour complete
   - No changes to the store, notifications logic, or other onboarding steps.

### Files touched
- `src/routes/portal.patient.tsx` — restructure the notifications onboarding step JSX
- `src/assets/onboarding-notifications.png.asset.json` — new asset pointer
