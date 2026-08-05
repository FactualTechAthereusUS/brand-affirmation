# Blissley Customer-Facing Acquisition Funnel — Specification

Scope: every route/component that carries a visitor from a marketing sales page through an intake questionnaire, into checkout, and to order confirmation. This document is derived exclusively from reading the source files listed at the end of this document. Anything not wired to real backend behavior is called out explicitly under "Known gaps."

---

## 1. Funnel map

The codebase contains **several parallel, apparently A/B-test variants** of the same conceptual funnel (sales page → intake → sales/re-pitch page → checkout → confirmation). There is no single canonical path; each variant is a self-contained route tree that can be linked to independently (e.g. from ad campaigns). Nothing in the code shows one variant redirecting into another except where explicitly noted.

| Route | File | Role | Notes |
|---|---|---|---|
| `/weight-loss` | `weight-loss.index.tsx` | Top-of-funnel marketing/landing page for weight loss vertical | Composed of many lazy-loaded sections; entry point for organic/paid traffic |
| `/weight-loss/sales` | `weight-loss.sales.tsx` | "You're pre-approved" style post-intake sales/pitch page | Reads intake answers from `sessionStorage["blissley_intake_wl"]`; used as the landing point after `WLIntakeFlow`/`TrimRxIntakeFlow`/`TrimRxIntakeFlowV2`/`WeightLoss3IntakeFlow` complete |
| `/sales/trimrx` | `sales.trimrx.tsx` | TrimRx-branded pricing/plan picker page | Standalone; treatment (semaglutide/tirzepatide) + plan (monthly/3-mo/6-mo) selector, links into `/checkout/trimrx` |
| `/sales/DM` | `sales.DM.tsx` | "Approval" themed long-form sales page (Direct-Mail/Discovery-Mail variant) | Heavier long-scroll page: hero, price anchor, plan cards, projection chart, "what happens next", FAQ, physician team, final CTA. Also links into `/checkout/trimrx` |
| `/intake` | `intake.tsx` → `IntakeFlow` | General multi-category intake (weight loss / sexual health / skin & hair / hormones) | Widest question set; branches by chosen category |
| `/intake/weight-loss` | `intake_.weight-loss.tsx` → `WLIntakeFlow` | Weight-loss-only intake variant | Ends by writing to `sessionStorage["blissley_intake_wl"]` and redirecting to `/weight-loss/sales` |
| `/intake/weight-loss-trimrx` | `intake_.weight-loss-trimrx.tsx` → `TrimRxIntakeFlow` | TrimRx-branded intake variant (V1 UI, navy) | Ends redirecting to `/weight-loss/sales` |
| `/intake/weight-loss-trimrx-2` | `intake_.weight-loss-trimrx-2.tsx` → `TrimRxIntakeFlowV2` | Same question set/logic as V1 but restructured/condensed component | Ends redirecting to `/weight-loss/sales` |
| `/intake/weightloss-3` | `intake_.weightloss-3.tsx` → `WeightLoss3IntakeFlow` | Near-duplicate of TrimRxIntakeFlowV2 (same SCREENS ids and logic) | Ends redirecting to `/weight-loss/sales` |
| `/intake/new-weightloss-ours` | `intake_.new-weightloss-ours.tsx` → `BlissleyIntakeFlow` | Pink-branded ("Blissley Pink" TrxUIPink) intake with real-time BMI meter | Ends redirecting to `/sales/trimrx` |
| `/checkout/trimrx` | `checkout.trimrx.tsx` | Primary checkout page | Reads `tx`/`plan` query params, prefills from `sessionStorage["blissley_intake_broad"]`, submits to `/confirmation` with `model=auth` |
| `/checkout/charged-before` | `checkout.charged-before.tsx` | Near-duplicate checkout variant ("already charged" copy/flow) | Submits to `/confirmation` with `model=charged` |
| `/checkout/UI-template3` | `checkout.UI-template3.tsx` | Alternate visual template for the checkout form (different input iconography/styling) | Standalone experiment; same treatment/plan search schema |
| `/confirmation` | `confirmation.tsx` | Order confirmation / thank-you page | Reads all state from URL search params (`model`, `tx`, `plan`, `total`, `first`, `email`, `order`); includes upsell (OTO) |
| `/confirmation-charged` | `confirmation-charged.tsx` | Pure redirect shim | Immediately `<Navigate>`s to `/confirmation` with hard-coded demo search params (`model=charged`, `tx=sema`, `plan=three`, `total=711`, `first=Sarah`, `order=BLSY-4821`) — **demo-only, not a real flow** |

### Cross-linking summary

- Sales pages (`/sales/trimrx`, `/sales/DM`, `/weight-loss/sales`) all route their plan-selection CTA to `/checkout/trimrx?tx=<sema|tirz>&plan=<monthly|three|six>`.
- `/weight-loss` (the top-of-funnel marketing page) does not itself link directly into an intake flow inside the reviewed files' visible code beyond its `WLCalculator`/`WLPrograms`/`WLFinalCTA` sections (see §2.4); those components are expected to link to an intake route, but the specific route id used by the button was not present in the files enumerated for this document.
- Every intake flow variant, on completing its final "loading/eligibility" screen, performs a **hard navigation** (`window.location.href = ...`), not a router transition — this fully reloads the app and drops all in-memory React state, relying entirely on `sessionStorage` to carry answers forward.
- `/checkout/trimrx` and `/checkout/charged-before` both hard-navigate back to `/sales/trimrx` when the user presses the header Back button, regardless of which sales page referred them — this is a **known inconsistency**: a visitor arriving from `/sales/DM` or `/weight-loss/sales` who clicks Back in checkout is dropped onto `/sales/trimrx` instead of the referring page.
- `/confirmation`'s "Go to portal" CTA navigates to `/portal/patient` (outside the scope of this document).

---

## 2. Sales pages

### 2.1 `/sales/trimrx` (`sales.trimrx.tsx`)

**Purpose:** A comparison/plan-selection page framed around "same price at every dosage level." No hero storytelling — it is a leaner, faster-converting page than `/sales/DM`.

**Page-level state:** `treatment` (`"sema" | "tirz" | null`), `planKey`, live-incrementing "patients chose this today" counters (`semaPatients`/`tirzPatients`, random increments every ~2–3s), a decaying "discounts left" counter (`discountsLeft`, starts 40–74, ticks down over time), and a 9-minute countdown timer (`useCountdown(9)`), all pure client-side cosmetic urgency devices with no server truth.

Sections in order:

1. **Discount banner** (top, dashed border) — shows the live countdown text (`useCountdown`) as urgency copy.
2. **Header** (`TrxHeader`) — Blissley + TrimRx co-branded logo lockup, with conditional Back button.
3. **Treatment selection** — two `TreatmentCard`s (Semaglutide vs. Tirzepatide), each showing: vial image, description, a colored badge/icon (money icon = "Same price every dose", lightning icon for potency messaging), and a live "N patients chose this today" social-proof counter. Selecting a card sets `treatment`, which drives the plan list below.
4. **Plan selection** — 3 `PlanCard`s per treatment (`monthly`, `three` = "Most Popular", `six`), each showing: title, description, supply size, a savings callout ("You are saving $X"), and (for 3-/6-month plans) a "0% installments via Afterpay/Klarna/Affirm" mini-panel. CTA button text is dynamic:
   - Monthly plan: "Select Plan · ~~$X/month~~" + "PAY ONLY $X LIMITED OFFER" (todayPrice).
   - 3-/6-month plans: "Select Plan · $X/mo".
   Clicking a plan card's button both selects the plan and immediately fires `onCheckout()`.
5. **Includes row** — 6 icon+label items (Free Dosage Increases, Treatment changes anytime, Unlimited Free Doctor Consults, Free Expedited Shipping, Home Injection Kit Included, 24/7 Support). Presentational only.

**Pricing (semaglutide):**

| Plan | Supply | Today price | List price/mo | Savings shown |
|---|---|---|---|---|
| Monthly | 4-week | $249 | $299 | $50 |
| 3-Month (Most Popular) | 12-week | $237/mo (no distinct "today" price shown) | $299 baseline | $186 |
| 6-Month | 24-week | $237/mo | $299 baseline | $522 |

**Pricing (tirzepatide):**

| Plan | Supply | Today price | List price/mo | Savings shown |
|---|---|---|---|---|
| Monthly | 4-week | $299 | $399 | $100 |
| 3-Month (Most Popular) | 12-week | $339/mo | $399 baseline | $180 |
| 6-Month | 24-week | $299/mo | $399 baseline | $600 |

**CTA destinations:** every `PlanCard`'s button navigates (via the containing page's `onCheckout` handler) to `/checkout/trimrx?tx=<sema|tirz>&plan=<planKey>` (confirmed by the shared `PLANS`/query-schema pattern used identically in `checkout.trimrx.tsx`).

**Technical notes:**
- `useCountdown(minutes)` is a generic 1s-interval countdown hook duplicated verbatim across `sales.trimrx.tsx` and `sales.DM.tsx`.
- The "discounts left" decay uses a randomized recursive `setTimeout` loop (not `setInterval`), so the exact cadence differs per page load and cannot be reproduced deterministically — purely a scarcity animation with no backing inventory value.
- "N patients chose this today" counters likewise increment randomly with `Math.random()`, unrelated to actual order volume.

---

### 2.2 `/sales/DM` (`sales.DM.tsx`, 1055 lines)

**Purpose:** A long-form, story-driven "you're pre-approved" landing experience — the richest sales page in the funnel, designed to be reached from a warmer link (e.g. post-intake) referencing an "approval."

Sections in order (inferred from imports/inline component names and section ordering conventions consistent with the rest of the codebase's sales pages):

1. **Header** (`TrxHeader`, co-branded Blissley/TrimRx lockup) with Back button.
2. **Discount/urgency banner** — countdown timer identical in mechanism to `sales.trimrx.tsx` (`useCountdown(9)`).
3. **Hero** — headline emphasizing "approval," Forbes Health and Trustpilot trust badges, "backed by research" badge.
4. **Weight-loss projection chart** (`WeightLossChart` inline component) — a smooth cubic-Bézier SVG line chart from `start` weight to `goal` weight across 7 months (see §4.7 for exact math — the same spline algorithm is reused, with slightly different smoothing constants, from the intake flows' projection screens).
5. **Treatment cards** (`TreatmentCard`) — richer version of the trimrx page's cards: includes a 5-star rating row, review count, a `$price` vs. `$oldPrice` strike-through, a "save X% on your first month" checklist, and additional feature bullet points (each treatment lists distinct feature copy).
6. **Plan cards** (`PlanCard`) — same 3-tier plan model (`monthly`/`three` "Most Popular"/`six`), with an added `lifetimeLock` badge line: "Your dose will increase as you go. The price won't. Lifetime price lock at $X/mo," shown only on plans flagged `lifetimeLock: true`.
7. **Includes row** — identical 6-item icon list as the trimrx sales page.
8. **"What happens next" steps** (`STEPS` array) — a 4-step numbered list with milestone icons: (01) Physician Review, (02) Fast Prescription Approval, and two further steps (truncated in source read but structurally a "prescription sent → shipped" pattern consistent with the rest of the app's post-purchase timelines).
9. Additional sections referenced by imported assets (face avatars, milestone icons, ship-box, "backed by research" badge) suggest further Social Proof / Guarantee / FAQ sections consistent with the pattern seen fully in `weight-loss.sales.tsx` (§2.3), though the exact remainder of `sales.DM.tsx` beyond line ~370 was not read verbatim for this document; the plan/pricing catalog is identical in mechanism to `sales.trimrx.tsx`.

**CTA destinations:** Plan-card buttons behave identically to `sales.trimrx.tsx` — select plan and invoke checkout navigation to `/checkout/trimrx?tx=...&plan=...`.

---

### 2.3 `/weight-loss/sales` (`weight-loss.sales.tsx`, 1499 lines)

**Purpose:** The primary "your assessment is complete, you're approved" post-intake pitch page for the weight-loss vertical. Reads the visitor's own intake answers back to personalize copy and the projection chart.

**Data hydration:** On mount, reads `sessionStorage.getItem("blissley_intake_wl")` and parses it into local `intake` state (`Intake` type: `firstName`, `weightLbs`, `weightGoal`, `state`, `bmi`, `sex`, `glp1History`, `glp1Which`, `glp1Dose`). If absent, sensible defaults are used (`firstName: "You"`, `startWeight: 220`, `goalWeight` derived as 82% of start weight).

**Derived values:**
- `toLose = max(5, round(startWeight - goalWeight))`
- `timelineWeeks = max(8, round(toLose / 1.6))` (assumes ~1.6 lb/week average loss rate)
- `totalToday = selectedPlan.today + (priority ? PRIORITY_ADDON : 0)`, `PRIORITY_ADDON = 39.95`

**Plan catalog (`PLANS`):**

| Key | Title | Due today | Per-month | Per-day | Save | Badge |
|---|---|---|---|---|---|---|
| `monthly` | Monthly Starter | $249 | $299 | $9.97/day | — | "Cancel anytime" |
| `three` | 3-Month Reset | $711 | $237 | $7.90/day | $136 | MOST POPULAR |
| `six` | 6-Month Transformation | $1,422 | $237 | $7.90/day | $322 | BEST DEAL |

Note: `three` plan due-today ($711) = 3 × $237; `six` due-today ($1,422) = 6 × $237 — both are paid-in-full-today totals, not per-month recurring charges, despite the "$X/mo" framing in the badge subtext.

**Sections in order** (from the `WeightLossSalesPage` render tree):

1. `SalesNav` — logo + "Excellent 4.6" star rating chip (static, not from a review API).
2. `AnnouncementBar` — countdown "reservation" banner: `useReservedCountdown(15*60)`. The elapsed-time base timestamp is persisted in `sessionStorage["blissley_reserved_at"]` so a page refresh continues the same countdown rather than resetting it (unusual — this is the one urgency timer in the funnel that is refresh-persistent).
3. `Hero` — "{firstName}, you've been approved" headline; renders a duplicate of the projection chart (see §4.7 math) using `intake.bmi` to choose a loss-percentage bucket; also surfaces `glp1History`/`glp1Which`/`glp1Dose` if the visitor previously reported prior GLP-1 use.
4. `PriceAnchor` — presumed price-anchoring section (component referenced but body not read in full; naming convention indicates a "compare to $X/month elsewhere" anchor block).
5. `PlanSelector` — interactive 3-plan picker with a `priority` (priority processing) add-on toggle, live-updating `totalToday`.
6. `ValueStack` — value/inclusions list.
7. `HowItWorks` — step explainer.
8. `SocialProof` (shared `home/SocialProof` component) — testimonial carousel.
9. `Mechanism` — "how GLP-1 works" explainer section.
10. `Projection` — the canonical, larger version of the same weight-projection chart, again driven by `startWeight`/`bmi`.
11. `Guarantee` — refund/guarantee messaging block.
12. `FAQ` — accordion.
13. `PhysicianTeam` — clinician bios/credibility block.
14. `FinalCTA` — repeats the plan/priority selector at the bottom of the page for late-scrolling converters.
15. `SalesFooter` — legal/footer links.

**CTA destinations:** `PrimaryCTA` buttons (`PlanSelector`/`FinalCTA`) are expected, by the shared `PLANS` key naming (`monthly`/`three`/`six`) and cross-page convention, to route to `/checkout/trimrx?tx=<sema|tirz>&plan=<planKey>`; the exact `onClick` handler body for the final submit button was not captured in the read window for this document — flagged for manual confirmation if this page is edited.

---

### 2.4 `/weight-loss` (`weight-loss.index.tsx`)

**Purpose:** Top-of-funnel marketing landing page (not personalized; no `sessionStorage` reads). Composed entirely of lazy-loaded sections behind `<Suspense>` for performance:

`AnnouncementBar` → `Nav` → `WLHero` → `PressLogos` → `WLCalculator` → `HowItWorks` → `WLPrograms` → `WhyBlissley` → `WLSocialProof` → `WLBeforeAfter` → `WLFAQ` → `WLFinalCTA` → `Footer` → `DeferredEffects`.

Key sub-components (from `src/components/weight-loss/`):

- **`WLHero.tsx`** — hero banner with responsive hero images (`wl-hero-desktop`/`wl-hero-mobile`, preloaded via route `head()` `<link rel="preload">` tags keyed to viewport width).
- **`WLCalculator.tsx`** — interactive weight-projection calculator using Chart.js (not the hand-rolled SVG spline used elsewhere in the funnel). See §4.7 for its distinct math model.
- **`WLPrograms.tsx`** — program/plan preview cards.
- **`WLBeforeAfter.tsx`** — before/after image gallery/slider.
- **`WLFAQ.tsx`** — accordion FAQ.
- **`WLFinalCTA.tsx`** — closing call-to-action band, presumably linking into an intake route (exact `to=` target not captured within the files reviewed for this document — recommend confirming before edits).
- **`WLSocialProof.tsx`** — testimonial/review section, separate implementation from the shared `home/SocialProof` component used elsewhere.

---

## 3. Intake flows

All six intake flows share a common architectural pattern:
- A local `Answers` object built up via `set()`/`toggleMulti()` helpers.
- A `SCREENS` (or `BASE_SCREENS`) ordered array of string screen ids, walked by an integer index (`idx`), with `next()`/`prev()`/`goTo(id)` functions.
- A derived `flow` array (via `buildFlow(sex)` or `buildFlow(category)`) that **conditionally inserts or removes screens** based on prior answers (e.g., inserting a pregnancy screen only for `sex === "female"`).
- A `ScreenShell`/`TrxScreen` wrapper providing the animated screen transition (`motion.div`, opacity/translateY/blur enter-exit, ~0.4–0.55s duration, easing `[0.22,1,0.36,1]`).
