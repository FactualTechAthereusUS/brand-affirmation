# Encode the design system into project memory

Turn the design rules we've been applying by hand into persistent memory files, so they apply automatically to every future change without being restated.

## What gets saved

**1. Motion grammar** (`design`)
The three easing curves and their use cases (hero lines, scroll reveals, soft rules), standard durations, the 60ms word-stagger for hero headlines, 0.07s grid stagger, the mandatory reduced-motion path, and the time-based fallback rule: never ship a scroll reveal without a ~900ms escape hatch, or content can stay invisible when the observer registers before first layout.

**2. Typography rules** (`design`)
Serif display plus neutral sans body as the default pairing, one display face and one body face maximum, fixed px steps with explicit leading and negative tracking above 32px, micro-labels uppercase with wide tracking, and fonts loaded via a link tag in the root route rather than a CSS import.

**3. Token architecture** (`design`)
The two-layer split: raw brand palette in the non-inline theme block so scoped blocks can rebind colors, shadcn semantics in the inline block pointing at root variables. No hardcoded color utilities in components. Shadows authored as explicit multi-layer stacks, not single-token elevation.

**4. Rejected visual patterns** (`constraint`)
Inter and Poppins as display faces, purple-to-indigo gradients on white, single-shadow elevation, borders drawn between sections (use a background tone shift instead), and motion without a reduced-motion fallback. Each with the reason, so they never get re-proposed.

**5. Visual verification standard** (`preference`)
A visual change is only done after checking the rendered result at mobile, tablet and desktop widths: zero console errors, no horizontal overflow at 390px, nothing stuck invisible after reveals settle, no orphaned headline wraps. A green build alone does not count.

## Notes

Memory files are documentation only, no application code changes and no visual difference to the site. The index gets short always-on one-liners for the highest-value rules (no hardcoded colors, motion needs a reduced-motion path) plus pointers to the detail files above.
