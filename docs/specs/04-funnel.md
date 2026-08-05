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

### 3.1 `/intake` — `IntakeFlow.tsx` (general, multi-category)

**Screen sequence:** `COMMON = ["name", "category", "dob", "sex", "state"]`, then category-specific screens from `PATH[category]`, then `MED = ["contra", "meds", "loading"]`.

- `name` — first name + email text fields.
- `category` — 4 large image `CategoryCard`s: Weight Loss, Sexual Health, Skin & Hair, Hormones. Selecting one rebuilds `flow` to splice in that category's questions.
- `dob` — month/day/year dropdowns/fields; used to compute age (18+ gate implied by pattern used elsewhere, though this file's exact minor-block screen was not confirmed in the read window).
- `sex` — male/female single-select.
- `state` — `StateSelect` dropdown, 49 states listed in `US_STATES` (missing at least one U.S. state/territory — confirm before treating as exhaustive; District of Columbia and others are absent from the hard-coded list).
- **Weight-loss path:** `wl_goal`, `wl_howlong`, `wl_tried` (multi-select prior methods), `wl_hw` (height/weight → BMI), `wl_glp1` (prior GLP-1 history), `wl_conditions` (multi-select), `wl_projection` (a BMI-driven results/projection screen).
- **Sexual-health path:** `sh_concern`, `sh_howlong`, `sh_tried`, `sh_health`.
- **Skin/hair path:** `sk_concern`, `sk_howlong`, `sk_tried`, `sk_skin`.
- **Hormones path:** `hm_concern`, `hm_howlong`, `hm_health`.
- **Shared tail:** `contra` (contraindications multi-select), `meds` (current medications, phone/consent checkboxes), `loading` (a "Calculating your BMI and eligibility…" spinner screen).

**BMI formula:** `bmi = 703 * weightLbs / (heightInches^2)`, rounded to 1 decimal (standard imperial BMI formula), computed from `heightFt`/`heightIn`/`weightLbs`.

**BMI eligibility banding** (from the visual gauge, `activeIdx = categories.findIndex(c => bmi < c.max)`): the page states "GLP-1 programs are typically recommended for a BMI of 27 or above," implying an eligibility threshold of BMI ≥ 27, but this flow does **not** hard-block low-BMI users the way `TrimRxIntakeFlow`/`BlissleyIntakeFlow` do — it only displays advisory copy.

**Weight-loss projection math** ("achievable loss"): comment in source states "~15% over 6 months on tirzepatide-class GLP-1s, scaled by BMI" — the multiplier is BMI-scaled rather than fixed.

**Safety-net behavior:** if the user reaches the end of the built flow with no `category` selected, `next()` redirects them back to the `category` screen index rather than allowing them to fall off the end of the array.

**Auto-advance:** single-select answers use `pickThenNext`, which sets the answer then calls `next()` after a 220ms `setTimeout` (a deliberate micro-delay so the selection animation is visible before the screen transitions).

**Multi-select "None of the above" exclusivity:** `toggleMulti` clears all other selections in that field the moment "None of the above" is chosen, and removes "None of the above" the moment any other option is chosen.

**Termination:** No explicit `navigate()`/`window.location.href` call was found for this flow's completion inside the read window — the flow currently ends on the `loading` screen with a "Return home" fallback button in at least one branch (`window.location.href = "/"`), suggesting this general flow may not be fully wired to a sales-page handoff. **Flag: possible incomplete/legacy flow** — verify before directing production traffic here.

**Persistence:** No `sessionStorage` write was found in this file for the general flow's final answers (unlike every other intake flow). **Gap: answers collected in `/intake` are not persisted anywhere and are lost on navigation.**

---

### 3.2 `/intake/weight-loss` — `WLIntakeFlow.tsx`

**Screen sequence (`BASE_SCREENS`, with `pregnancy` spliced in immediately after `sex` when `sex === "female"`):**

1. `name` — first/last name, email.
2. `goal` — target/motivation goal selector.
3. `howlong` — how long trying to lose weight.
4. `sex` — male/female.
5. *(female only)* `pregnancy` — pregnancy/breastfeeding screen (Yes/No; "Yes" is expected to disqualify, consistent with the pattern in sibling flows, though the exact block screen for this file specifically was not captured verbatim).
6. `dob` — date of birth (age gate).
7. `hw` — height (ft/in) + weight (lbs) → BMI.
8. `weight_goal` — target/goal weight.
9. `tried` — prior weight-loss methods (multi-select).
10. `past_surgeries` — prior bariatric/weight-related surgeries.
11. `current_conditions` — current health conditions (multi-select).
12. `social_proof` — non-interactive patient success story insert.
13. `glp1` — prior GLP-1 medication history.
14. `conditions` — additional medical conditions/contraindications.
15. `weight_symptoms` — symptoms related to excess weight (multi-select).
16. `bp` — blood pressure range.
17. `hr` — resting heart rate.
18. `projection` — a calculator-style results screen ("calculator clone").
19. `contra` — contraindication checklist.
20. `bariatric` — bariatric-surgery-specific follow-up.
21. `meds` — current medications; contact info (phone) and consent.
22. `loading` — final processing screen; **not counted** in the progress bar denominator so the bar visually reaches 100% on the last real question.

**BMI formula:** identical imperial formula, `703 * (weightLbs / totalInches^2)`, rounded to 1 decimal.

**Progress bar math:** `progress = (idx + 1) / max(1, flow.length - 1)` — the `-1` excludes the `loading` screen from the denominator.

**Termination/persistence:** on reaching `current === "loading"`, the flow writes `sessionStorage.setItem("blissley_intake_wl", JSON.stringify({ ...answers, bmi }))`, then hard-navigates via `window.location.href = "/weight-loss/sales"`.

---

### 3.3 `/intake/weight-loss-trimrx` — `TrimRxIntakeFlow.tsx` (V1, navy "TrxUI")

The most elaborate flow in the funnel (32 addressable screens plus 2 terminal blocks). Full ordered `SCREENS` array:

`hw` → `bmi_goal` → `dob` → `sex` → `safety` → `female_effects` (female only) → `priority` → `ranked` → `metabolic_science` → `tania_story` → `glp1_curve` → `pace` → `motivation_reason` → `sleep_quality` → `sleep_hours` → `kristin_story` → `contra` → `more_conditions` → `glp1_history` → `opiate` → `prior_surgery` → `prior_program` → `willing_to` → `weight_change` → `daiene_story` → `resting_hr` → `blood_pressure` → `affordability` → `current_meds` → `motivation_level` → `additional_info` → `personalization` → `eligibility` → `loading`, with terminal-only `blocked_pregnancy` and `blocked_minor` screens reachable via branching.

**Question-by-question detail (titles/content confirmed from source):**

| Screen | Title / prompt | Input | Notes |
|---|---|---|---|
| `hw` | (height/weight capture) | numeric fields (ft/in, lbs) | Feeds BMI |
| `bmi_goal` | "Perfect! With a BMI of {bmi}, we can continue." (or "Great, let's set your goal." if BMI not yet computed) | goal-weight numeric field | Displays computed BMI inline |
| `dob` | "What's your date of birth?" — sub: "We need to confirm you're 18 or older to prescribe." | date fields | **Age gate**: `if (age !== null && age < 18) { goTo("blocked_minor"); return; }` before allowing `next()` |
| `sex` | "Are you male or female?" | single-select | Drives conditional screen insertion |
| `safety` | "Safety, first." | multi-select checklist | Selecting a disqualifying pregnancy-related option triggers `goTo("blocked_pregnancy")` after a 180ms delay (see `toggleSafety` handler) |
| `female_effects` | "Women experience unique effects from weight gain." | informational + selection | Shown only when `sex === "female"`; skipped entirely for male respondents |
| `priority` | "We can help with all of these, but choose the most important for you." | single-select | |
| `ranked` | "Blissley is proud to be ranked #1." | non-interactive proof interstitial | Continue-only button |
| `metabolic_science` | "It feels like magic, but it's metabolic science." | informational | |
| `tania_story` | (patient story insert) | non-interactive | |
| `glp1_curve` | "How will GLP-1 work for you?" | informational/graphic | |
| `pace` | "How is that pace for you?" | single-select reacting to computed pace | Pace math: `start = weightLbs`, `goal = goalWeight`; only valid if `goal < start` |
| `motivation_reason` | "Improving your life requires motivation." | single-select | |
| `sleep_quality` | "How is your sleep, overall?" | single-select | |
| `sleep_hours` | "How many hours of sleep do you usually get each night?" | numeric/select | |
| `kristin_story` | (patient story insert) | non-interactive | |
| `contra` | "GLP-1 is safe, but a few conditions might prevent you from being prescribed." | multi-select | Contraindication checklist |
| `more_conditions` | "A few more health questions." | multi-select | |
| `glp1_history` | "Have you taken medication for weight loss within the past month?" | Yes/No | |
| `opiate` | "Within the last 3 months, have you taken opiate pain medications or opiate-based street drugs?" | Yes/No | |
| `prior_surgery` | "Have you had prior weight loss surgeries?" | Yes/No + detail | |
| `prior_program` | "Have you ever tried to lose weight in a weight-management program (Jenny Craig, Weight Watchers, etc.)?" | Yes/No | |
| `willing_to` | "If clinically appropriate, are you willing to:" | multi-select commitments | |
| `weight_change` | "Has your weight changed in the last year?" | single-select | |
| `daiene_story` | (patient story insert) | non-interactive | |
| `resting_hr` | "How about your average resting heart rate?" | numeric/select | |
| `blood_pressure` | "What is your average blood pressure range?" | single-select ranges | |
| `affordability` | "Looking good! Let's match you with the best medication." | (affordability/pricing sensitivity question) | |
| `current_meds` | "Do you currently take any medications?" | free text / Yes-No + detail | |
| `motivation_level` | "Let's better understand your current state of mind." | scale/select | |
| `additional_info` | "Do you have any further information you'd like our medical team to know?" | free text | |
| `personalization` | "Your needs are unique, your medicine should be, too." | informational | Precedes name/state capture |
| `eligibility` | "Your medical checkup" — sub: "You're a strong candidate for medical weight loss with a 94% chance of treatment success if you qualify." | first name, last name, `StateSelect` (49-state list, `US_STATES` hard-coded in this file) | Continue button is `disabled={!answers.firstName || !answers.lastName || !answers.state}` |
| `loading` | (final processing) | — | Hard-navigates on completion |
| `blocked_pregnancy` | terminal | — | Reached from `safety` screen when a pregnancy-related answer is selected |
| `blocked_minor` | terminal | — | Reached from `dob` screen when computed age < 18 |

**BMI formula:** `bmi = +(703 * (weightLbs / totalInches^2)).toFixed(2)` (2 decimal places — one more digit of precision than the `WLIntakeFlow`/`IntakeFlow` variants).

**Pace math:** computed only when `goalWeight < weightLbs`; used to drive the `pace` screen's reflection copy (exact multiplier/weeks-to-goal formula not fully captured beyond the guard condition).

**Progress/stage bar:** `stageOf(idx, sex)` maps the current screen id to one of 5 named stages — **Start** (`hw`), **Preliminary** (`bmi_goal` through `glp1_curve`), **Health** (`pace` through `more_conditions`), **Details** (everything else up to but excluding eligibility), **Eligibility** (`eligibility`, `loading`). Rendered via `StageBar`/`TrxStepper`, a 5-segment horizontal progress bar with labels hidden on mobile except the active stage.

**Branching mechanics (`getNextIndex`):**
- Male respondents skip `safety` and `female_effects` entirely in the forward direction (`while (sex === "male" && (SCREENS[n] === "safety" || SCREENS[n] === "female_effects")) n++`).
- `female_effects` is skipped forward if `sex !== "female"`.
- If the computed next screen is `blocked_pregnancy` or `blocked_minor`, forward navigation is **suppressed** (`n = from`) — these screens are only reachable via the explicit `goTo()` disqualification calls, not by normal sequential advance.
- Backward navigation (`prev()`) mirrors the same skip logic in reverse.

**Terminal/blocked screens:** disqualified users are shown a dead-end screen (content not fully captured, but the pattern from sibling flows and the "Return home" buttons at lines ~1222/1243 indicates a "you don't currently qualify" message with a `window.location.href = "/"` CTA — no path back into checkout).

**Completion & persistence:** at the `loading` screen, writes `sessionStorage.setItem(...)` (call present at line 359, target key not fully re-confirmed in this file's specific line, but structurally mirrors `WLIntakeFlow`'s `blissley_intake_wl` key) and then executes `window.location.href = "/weight-loss/sales"`.

---

### 3.4 `/intake/weight-loss-trimrx-2` — `TrimRxIntakeFlowV2.tsx`

Structurally identical `SCREENS` id list, branching logic (`getNextIndex`/`prev`), BMI formula, and termination target (`window.location.href = "/weight-loss/sales"`) to `TrimRxIntakeFlow`, but implemented as a more condensed component (1582 vs. 1656 lines) — appears to be a refactor/consolidation pass of the V1 flow rather than a substantively different question set. Recommend treating V1 and V2 as the same experiment arm for analytics purposes unless a diff review of the full question copy reveals wording differences.

### 3.5 `/intake/weightloss-3` — `WeightLoss3IntakeFlow.tsx`

Line-for-line identical `SCREENS` array, stage/branching functions, and termination behavior to `TrimRxIntakeFlowV2.tsx` (confirmed via matching line numbers and content in the structural grep). This is effectively a **third, near-duplicate copy** of the same flow, differing only in its component name/file location. No functional differences were found within the scope of this review.

---

### 3.6 `/intake/new-weightloss-ours` — `BlissleyIntakeFlow.tsx` (Pink "TrxUIPink" branding)

**Screen sequence:** `bmi` → `lead` → `goal` → `sex_dob` → `pregnancy` (female only) → `pain_spec` → `pain_sev` → `pain_time` → `failed` → `kristin` (story) → `belief` (info) → `primary_desire` → `sleep` → `motivation` → `pace_project` (interstitial) → `daiene` (story) → `pace_pref` → `commitment` → `ranked` (proof interstitial) → `contra` → `health` → `prior_glp1` → `med_history` → `phone_state` → `loading`, with terminal screens `blocked_minor`, `blocked_pregnancy`, `blocked_bmi_low`, `blocked_contra`.

This is the only flow with an **explicit, dedicated low-BMI disqualification screen** (`blocked_bmi_low`) and a **contraindication disqualification screen** (`blocked_contra`), rather than folding those cases into a generic informational message.

**BMI-first ordering:** unlike every other flow, BMI is captured as the very **first** question (`bmi` screen, before name/lead capture), with sub-copy "Enter your height and weight - we'll check your BMI instantly." This is followed immediately by a real-time color-coded `BmiMeter` component and narrative copy that varies by band:

| BMI range | Message shown |
|---|---|
| < 18.5 | "Your BMI is below the healthy range. GLP-1 therapy isn't the right fit - let's focus on nourishment first." (leads to `blocked_bmi_low` terminal) |
| 18.5–24.9 | "Your BMI of {bmi} sits in the healthy range. GLP-1 therapy is generally reserved for higher BMIs." |
| 25–26.9 | "Your BMI of {bmi} is slightly elevated. You may qualify with a related condition - we'll check next." |
| 27–29.9 | "Your BMI of {bmi} qualifies you for GLP-1 therapy. Patients in this range typically lose 15-20% of body weight." |
| 30–34.9 | "Your BMI of {bmi} indicates obesity. Clinically, GLP-1 medications are a strong fit - patients here lose an average of 21% body weight." |
| 35–39.9 | "Your BMI of {bmi} indicates severe obesity. GLP-1 therapy is clinically indicated - you're exactly who this treatment was designed for." |
| ≥ 40 | "Your BMI of {bmi} places you in the highest-risk category. GLP-1 therapy paired with clinical oversight can be life-changing." |

**Terminal screen copy (BMI < 18.5, "Terminal - BMI below 18.5"):** "Your BMI is below the range where GLP-1 medications are clinically appropriate. These are prescribed for weight loss - not for people at or below a healthy weight. If you're concerned about your relationship with food, please speak with your primary care provider." — all terminal screens' primary action is `window.location.href = "/"` ("Return home") except the disqualified-but-not-BMI screens, one of which offers "Notify me when I'm eligible →" (also routes home).

**Branching:** `pregnancy` is spliced in after `sex_dob` for female respondents only; selecting a disqualifying pregnancy answer or being under 18 (`sex_dob`) routes to the corresponding `blocked_*` terminal and forward auto-advance into those terminals is suppressed exactly as in the TrimRx flows (`if (SCREENS[n] === "blocked_minor" || SCREENS[n] === "blocked_pregnancy") return from`).

**Shipping state capture:** `phone_state` screen uses `StateSelect` with a locally defined `US_STATES` array (same 49-entry list pattern as other flows) and a `PhoneField`.

**Completion & persistence:** writes `sessionStorage.setItem("blissley_intake_broad", JSON.stringify({ ...answers, bmi }))` and then, on success, calls `onDone={() => (window.location.href = "/sales/trimrx")}` — this is the **only** intake variant that lands on `/sales/trimrx` rather than `/weight-loss/sales`.

**Note on storage key overlap:** `blissley_intake_broad` is the same key that `checkout.trimrx.tsx` reads on mount to prefill the checkout form's email/name/phone/state fields (see §5) — confirming this flow is the intended feeder for the trimrx checkout/sales pairing, while the other four weight-loss intake variants feed `blissley_intake_wl`, which is only read by `weight-loss.sales.tsx`, **not** by the checkout page. This means a visitor who completes `WLIntakeFlow`/`TrimRxIntakeFlow`/`TrimRxIntakeFlowV2`/`WeightLoss3IntakeFlow` and proceeds to checkout will **not** have their checkout form prefilled — only visitors who came through `BlissleyIntakeFlow` get prefill. **Flag: cross-flow data-handoff gap.**

---

## 4. Shared intake UI primitives (`primitives.tsx`, `TrxUI.tsx`, `TrxUIPink.tsx`)

- **`ProgressBar`** (`primitives.tsx`) — 4-milestone (Start/Profile/Health/Results) animated progress rail used by `IntakeFlow`/`WLIntakeFlow`; nodes pulse and desaturate-to-color as they're reached; the connecting bar segments fill proportionally via a spring animation keyed to `value` (0–1).
- **`ScreenShell`** — the screen wrapper for pink/general flows: enter with `opacity 0→1, y +18→0, blur 6px→0`, exit `opacity 1→0, y 0→-14, blur 0→6px`, 0.45s duration.
- **`TrxScreen`** (`TrxUI.tsx`, navy) and its Pink counterpart (`TrxUIPink.tsx`) — same concept, staggered internal reveal of title (delay 0.08s), subtitle (0.16s), body (0.24s), and footer (0.34s) in the Pink variant, giving a slightly more theatrical cascading entrance than the plain navy `TrxScreen`, which animates as a single block.
- **`PrimaryButton`/`TrxButton`** — full-width pill CTA, spring hover/tap (`scale 1.02`/`0.97`–`0.98`), disabled state at 40% opacity.
- **`OptionCard`/`TrxOption`/`TrxIconOption`** — selectable answer rows/tiles with a checkbox or radio-style indicator; selected state re-colors the entire card (brand accent fill on `OptionCard`, border+shadow only on `TrxOption`).
- **`TextField`/`TrxField`** — labeled text inputs, brand-colored focus ring.
- **`PhoneField`** — US phone input with an inline hand-drawn SVG US flag and "+1" prefix; auto-formats digits into `(XXX) XXX-XXXX` as the user types, capped at 10 digits.
- **`StateSelect`** — searchable custom dropdown (not a native `<select>`); click-outside-to-close; live text filter against the injected `states` list.
- **`TrxStepper`/`StageBar`** — 5-stage (Start/Preliminary/Health/Details/Eligibility) linear progress indicator used by the TrimRx-family flows, distinct from the 4-milestone circular version used by the general/WL flows.
- **`TrxHeader`** — shared checkout+sales+intake header; renders Blissley logo alone (Pink variant) or Blissley+TrimRx co-branded lockup (Navy variant), with an optional Back arrow button.

**Animation/transition summary across all flows:** every screen transition is implemented with Framer Motion (`motion/react`) `initial`/`animate`/`exit` props on the screen container, not CSS transitions or router-level page transitions — because the SPA never actually changes route during a flow (only `idx` changes), these are pure component re-mount/animate transitions within a single route.

---

## 5. Checkout

### 5.1 `/checkout/trimrx` (`checkout.trimrx.tsx`, 1878 lines) — primary checkout

**Search params:** `tx: "sema" | "tirz"` (default `sema`), `plan: "monthly" | "three" | "six"` (default `monthly`), validated with `zod`.

**Plan/pricing catalog (`PLANS`):**

| Treatment | Plan | Supply | Months | Per-mo | Original per-mo | "Today" price | Savings |
|---|---|---|---|---|---|---|---|
| Semaglutide | Monthly | 4-week | 1 | $249 | $299 | $249 | $50 |
| Semaglutide | 3-Month (Most Popular) | 12-week | 3 | $237 | $299 | — (computed as perMo × months) | $186 |
| Semaglutide | 6-Month | 24-week | 6 | $237 | $299 | — | $522 |
| Tirzepatide | Monthly | 4-week | 1 | $299 | $399 | $299 | $100 |
| Tirzepatide | 3-Month (Most Popular) | 12-week | 3 | $339 | $399 | — | $180 |
| Tirzepatide | 6-Month | 24-week | 6 | $299 | $399 | — | $600 |

**Order-summary math:**
- `dueToday = plan.todayPrice ?? plan.perMo * plan.months`
- `originalPlanTotal = originalPerMo * months`
- `baseSubtotal = perMo * months`
- `shippingWas = 30 * months` (a "was" shipping value used only for the crossed-out shipping-savings line; actual shipping is always free/not subtracted)
- `addOnsTotal = (insurance ? $3.95 : 0) + (priority ? $49.95 : 0)`
- `subtotal = originalPlanTotal + addOnsTotal` (i.e., subtotal is deliberately shown at the pre-discount price so the discount line reconciles)
- `planDiscount = discountApplied ? planSavings : 0` (a "JOIN120" discount code, pre-applied by default — `discountApplied` initializes to `true`)
- `total = subtotal - planDiscount` (shipping is never subtracted since it's already $0)
- `savings = planDiscount + shippingWas` (the total "you saved" banner figure combines the plan discount and the nominal shipping value)

**Add-ons offered:** Shipping insurance ($3.95, loss/damage/theft protection) and Priority processing ($49.95), both simple checkboxes that add line items to the order summary and to `addOnsTotal`/`dueToday`.

**Discount mechanics:** the "JOIN120" discount is applied by default (`discountApplied = true`) and can be removed via a visible "Remove discount" control; a scarcity counter (`discountsLeft`, random 40–74, decaying) and a "reserved for [countdown]" timer are shown alongside it — purely cosmetic, not tied to any real inventory or code-redemption system.

**Form fields:** email, full name, phone, address, apartment, city, state (2-letter `US_STATES` list, 50 abbreviations), zip, country (fixed "United States"), "billing same as shipping" toggle, plus payment fields — card number, expiry, CVC, name on card — or alternate `payMethod` selection among `card | afterpay | klarna | affirm`.

**Prefill:** on mount, reads `sessionStorage.getItem("blissley_intake_broad")` and prefills `email`, `fullName` (joined `firstName` + `lastName`), `phone`, and `state` if those form fields are still empty — this is the same key written only by `BlissleyIntakeFlow` (§3.6), so prefill only functions for that one intake path.

**Client-side validation (`canSubmit`):** requires a regex-valid email, full name > 2 chars, phone with ≥10 digits, address > 3 chars, city > 1 char, exactly 2-character state code, 5-digit zip, and — only when `payMethod === "card"` — card number ≥13 digits, expiry matching `MM / YY`, CVC ≥3 digits. No server-side/real payment-gateway validation exists; this is purely client-side shape checking.

**Payment submission & simulated decline:** `onSubmit` sets `submitting = true`, then after a fixed 1400ms `setTimeout` (a fake "processing" delay, not a real network call):
- If `payMethod === "card"` and the card number's digits end in `"0002"` (mirroring the Stripe test-decline convention), sets `payFailed = true` and shows the inline `PaymentFailedInline` panel — no actual charge attempt occurs; this is a **hard-coded demo trigger**, not integration with a real payment processor.
- Otherwise, navigates to `/confirmation` with `search: { model: "auth", tx, plan: planKey, total: Math.round(summarySubtotal), first: <first token of fullName>, email, order: "" }`.
- A `// TODO: fire Klaviyo payment_failed event` comment marks the decline path as intentionally unfinished analytics wiring.

**Payment-failure UI (`PaymentFailedInline.tsx`, shared by both checkout pages):** an inline (never a modal/redirect) card reading "Payment not processed — Your card was declined," listing 3 generic reasons (insufficient funds, card restrictions on subscriptions, incorrect details), with a "Try a different card" button (`onTryAgain`, dismisses the panel and returns focus to the form) and three alternate-payment logos (Klarna/Afterpay/Affirm) that call `onAlt(method)`.

**No real payment gateway integration exists anywhere in this file** — there is no Stripe/other SDK call, no server round-trip; the "processing" delay and decline logic are both simulated entirely in the browser.

**Back navigation:** header Back button always calls `navigate({ to: "/sales/trimrx" })`, regardless of the actual referring sales page.

### 5.2 `/checkout/charged-before` (`checkout.charged-before.tsx`, 1897 lines)

Near-identical to `/checkout/trimrx` — same `PLANS`/`TREATMENTS` catalogs, same order-summary math (`total = subtotal - planDiscount`, line 1548 mirrors line 1535 of the primary checkout), same simulated-decline mechanism, same `PaymentFailedInline` component. The sole confirmed structural difference is that its successful-submission `navigate()` call passes `model: "charged"` (vs. `"auth"`) to `/confirmation`, which changes copy on the confirmation page's `NextStepsTimeline` (see §6) to reflect a "card already charged, physician approval next" narrative rather than "approval, then charge." This route represents the **"charge now" variant** of checkout vs. the primary **"authorize then charge on approval"** framing of `/checkout/trimrx`.

### 5.3 `/checkout/UI-template3` (`checkout.UI-template3.tsx`, 621 lines)

A visually distinct checkout template — custom-drawn SVG icons for shipping, payment, card fields, and a green Link-style lock icon (suggesting a "Link"/one-click payment method aesthetic) rather than Lucide icons. Uses the same `tx`/`plan` search-schema convention (`z.object` at file top) and imports the same vial art assets, indicating it targets the same `PLANS` pricing model, but this is the smallest of the three checkout files (~1/3 the line count of the other two) and appears to be an in-progress or exploratory visual redesign rather than a fully-featured parallel checkout — order-summary math, payment-decline simulation, and post-submit navigation were not confirmed present in the portion of the file reviewed. **Flag: treat as an unfinished/experimental UI template, not a production-parity checkout,** until independently verified.

---

## 6. Confirmation pages

### 6.1 `/confirmation` (`confirmation.tsx`, 851 lines)

**State source:** 100% URL search params — `model` (`"auth" | "charged"`), `tx` (`"sema" | "tirz"`), `plan` (`"monthly" | "three" | "six"`), `total` (number, defaults to 711 if absent/invalid), `first`, `email`, `order`. There is no session/local storage read on this page — it is fully stateless aside from what's passed in the URL, meaning a bookmarked/shared confirmation link fully reconstructs the same-looking page for anyone who has the URL (a privacy consideration, since `email` and `first` name travel in the query string).

If `order` is empty, a client-only fallback order ID is generated: `` `BLS-${random base36 string}` `` — this is **not** a real order/system-of-record identifier, purely a display placeholder when checkout didn't supply one (which is always the case for `/checkout/trimrx`'s real submit path, since it passes `order: ""`).

**Client-side events fired on mount:** dispatches `window` `CustomEvent`s `"blissley:purchase"` (detail: `{ model, orderId, total, plan, tx }`) and, if `email` present, `"blissley:sendMagicLink"` (detail: `{ email, orderId }`) — these appear to be hooks for external analytics/marketing tooling (e.g., Klaviyo, GTM) to listen for, but no listener/handler for these events was found within the reviewed file set. **Gap: these events may be unwired (no confirmed listener), and "send magic link" does not appear to trigger any real email API call from the frontend.**

**Sections in order:**
1. `LiquidHeader` — sticky, translucent/blurred header with Blissley logo linking home.
2. `Hero` — success headline, personalized with `firstName`; framing differs by `model` ("auth" vs. "charged").
3. **Order number chip** — click-to-copy `orderId` (via `navigator.clipboard`), with a 1.6s "copied" confirmation state; shows "Confirmation sent to {email}" if email present (no verification that an email was actually sent).
4. Two-column layout (desktop):
   - Left: `OrderSummary` (treatment, plan label, supply, total, model-aware copy), `DeliveryDetails`, `RefundGuarantee` (copy varies by `model`/`total`).
   - Right: `NextStepsTimeline`, `PortalCTA` (button navigates to `/portal/patient`).
5. **`NauseaOTO`** — the post-purchase upsell (One-Time-Offer): pitches an anti-nausea add-on (Ondansetron ODT), framed around "73% of GLP-1 patients experience nausea in weeks 2–4." Three-state UI (`idle | added | declined`): accepting sets `otoState = "added"`; declining sets `otoState = "declined"` and collapses the section to "Got it. Heading to your portal." **No cart/payment mutation occurs on accept** — clicking "add" only changes local component state; there is no follow-up charge, no order-summary update, and no confirmation that this add-on is actually fulfilled. **Flag: OTO accept is UI-only and not wired to any billing or fulfillment action.**
6. `SupportBlock` — help/contact section.
7. Legal footer line (© 2026 TheFactual LLC DBA Blissley, standard telehealth disclaimer).

**`NextStepsTimeline`** — a 5-step vertical timeline with a scroll-linked progress rail (Framer Motion `useScroll`/`useSpring`/`useTransform`, animated fill tied to `scrollYProgress` of the list element, clamped to reach only 28% fill because only the 2nd step is "active" at this stage):
1. "Order confirmed" — Just now (done).
2. "Dr. Nass is reviewing your intake" — In progress right now (active/live state).
3. `model === "charged"` → "Physician approval" / `model === "auth"` → "Approval & card charged" — Within 24 hours. This is the only step whose **label** changes based on the checkout model, correctly reflecting that the `charged-before` checkout already took payment while the standard `trimrx` checkout defers the charge until approval.
4. "Prescription sent to pharmacy" — Once approved.
5. "Shipped discreetly to your door" — 3–5 business days.

**Model-dependent differences:** `model` affects the Hero framing, the timeline's 3rd-step label, `RefundGuarantee` copy, and `OrderSummary` copy — but the underlying `total`/`plan`/`tx` display logic is identical between the two models.

### 6.2 `/confirmation-charged` (`confirmation-charged.tsx`)

A pure redirect: `<Navigate to="/confirmation" search={{ model: "charged", tx: "sema", plan: "three", total: 711, first: "Sarah", email: "sarah@example.com", order: "BLSY-4821" }} replace />`. This is **explicitly a hard-coded demo/preview shortcut** (uses the placeholder name "Sarah" and a fabricated order id "BLSY-4821") and is not part of any real user-facing purchase path — it should not be linked from production checkout flows.

---

## 7. Data persistence map

| Storage location | Key | Written by | Read by | Contents |
|---|---|---|---|---|
| `sessionStorage` | `blissley_intake_wl` | `WLIntakeFlow`, `TrimRxIntakeFlow`, `TrimRxIntakeFlowV2`, `WeightLoss3IntakeFlow` (all at their final `loading` screen) | `weight-loss.sales.tsx` (on mount) | Full `Answers` object + computed `bmi` |
| `sessionStorage` | `blissley_intake_broad` | `BlissleyIntakeFlow` (final `loading` screen) | `checkout.trimrx.tsx` (prefill on mount) | Full `Answers` object + computed `bmi` |
| `sessionStorage` | `blissley_reserved_at` | `weight-loss.sales.tsx`'s `AnnouncementBar` (`useReservedCountdown`) | Same component (to persist a refresh-proof countdown) | Epoch ms timestamp of first page view |
| URL query string | `tx`, `plan` | Sales pages linking into checkout | `checkout.trimrx.tsx`, `checkout.charged-before.tsx`, `checkout.UI-template3.tsx` | Treatment + plan selection |
| URL query string | `model`, `tx`, `plan`, `total`, `first`, `email`, `order` | Checkout pages' successful-submit `navigate()` call | `confirmation.tsx` | Everything the confirmation page renders — no server round trip |
| Supabase `admin_leads` table | — | **Not written by any file in this funnel** | Referenced only in `src/integrations/supabase/types.ts` (type definitions) and presumably the admin dashboard | **Gap: none of the intake flows, sales pages, or checkout pages call Supabase to persist a lead or order.** All customer data collected in this funnel lives only in ephemeral `sessionStorage` and the URL, and is lost the moment the browser tab/session ends or a hard refresh occurs on a page that doesn't re-hydrate from storage. |

No `localStorage` usage was found anywhere in the reviewed funnel files — persistence is exclusively `sessionStorage` (cleared when the browser tab closes) plus transient URL params.

---

## 8. Responsive behavior

- All intake screens use a `max-w-[640px]`/`max-w-[720px]` centered column with fluid padding (`px-5`/`md:px-8`), and font sizes step up at the `md` breakpoint (e.g., headline `text-[28px] md:text-[40px]`).
- `PrimaryButton`/`TrxButton` are full-width (`w-full`) on mobile and shrink to `min-w-[220px]` inline buttons at `md:` breakpoints.
- `TrxStepper`/`StageBar` hide stage text labels below `sm:` breakpoint except for the currently active stage, keeping the bar compact on phones.
- `checkout.trimrx.tsx` implements a **desktop-only proportional scroll-sync** between the left form column and right order-summary column (`useEffect` measuring `offsetHeight`/`scrollHeight`, disabled entirely below `1024px` via `window.innerWidth < 1024` check, resetting `transform` to empty on mobile) — this means the "sticky-feeling" summary panel behavior is desktop-only by design, and the mobile order summary is rendered as a separate collapsible component (`lg:hidden` block seen at line 1542) with its own expand/collapse state (`open`).
- `confirmation.tsx`'s two-column layout (`lg:grid-cols-[...]`) collapses to a single stacked column below `lg:`.
- Sales pages (`sales.trimrx.tsx`, `sales.DM.tsx`) use responsive image/vial sizing (`h-[104px] w-[104px] sm:h-[116px] sm:w-[116px]`) and responsive typography scaling consistent with the intake screens.

---

## 9. Known gaps and demo-only behavior (explicit flags)

1. **No payment gateway integration.** All three checkout routes simulate payment processing with a fixed `setTimeout` delay; the only "decline" trigger is a hard-coded card-number suffix check (`"0002"`), mirroring Stripe's test-card convention but not actually calling Stripe or any processor.
2. **No backend/Supabase persistence of leads or orders.** Every touchpoint in this funnel (intake answers, checkout submissions, order confirmation) exists solely in `sessionStorage` and URL query parameters. The `admin_leads` Supabase table exists in the schema but is not written to by any file examined for this document.
3. **Confirmation page's "send magic link" and "purchase" events are dispatched but have no confirmed listener** in the reviewed codebase — email delivery confirmation on the confirmation page ("Confirmation sent to {email}") is asserted in copy but not demonstrably backed by an actual email send.
4. **`/confirmation-charged` is a hard-coded demo redirect** with a fabricated name ("Sarah") and order ID ("BLSY-4821") — not a real functional route, should not be linked in production flows.
5. **Post-purchase upsell (`NauseaOTO` on `/confirmation`) is UI-only.** Accepting the offer only flips local component state (`otoState = "added"`); no charge, cart update, or fulfillment record is created.
6. **Cross-flow data handoff is inconsistent.** Only `BlissleyIntakeFlow` writes to the storage key (`blissley_intake_broad`) that `checkout.trimrx.tsx` reads for prefill; the other four weight-loss intake variants write to a different key (`blissley_intake_wl`) that only `weight-loss.sales.tsx` reads — meaning checkout forms are not prefilled for the majority of intake paths.
7. **Checkout header Back button always returns to `/sales/trimrx`,** even when the visitor arrived from `/sales/DM` or `/weight-loss/sales`.
8. **All countdown timers, "discounts left" counters, and "N patients chose this today" counters are client-side randomized cosmetic urgency devices** with no backing real-time inventory, order, or user-count data. They reset on every page load/refresh (with the sole exception of `weight-loss.sales.tsx`'s `AnnouncementBar` reservation timer, which persists its start time in `sessionStorage`).
9. **`/checkout/UI-template3` appears to be an incomplete/experimental visual template** — order-summary math and post-submit navigation were not confirmed present within the reviewed portion of the file.
10. **`/intake` (`IntakeFlow.tsx`, the general multi-category flow) does not persist its answers to any storage** and its exact completion/redirect target was not confirmed — it may be an earlier/legacy flow not fully wired into the current sales-page ecosystem.
11. **`TrimRxIntakeFlowV2.tsx` and `WeightLoss3IntakeFlow.tsx` appear to be functionally identical duplicates** of the same question flow and logic, differing only in file/component naming — likely redundant experiment variants rather than substantively different tests.
12. **The `US_STATES` list used across intake `StateSelect` components and checkout's state dropdown is a hard-coded 49/50-abbreviation array** with no confirmed District of Columbia or territory entries, and there is no eligibility logic in any reviewed file that blocks or warns users based on state of residence (e.g., no state-specific telehealth-restriction handling was found despite `state` being collected at multiple points in every flow).
13. **BMI decimal precision is inconsistent across flows** — `IntakeFlow`/`WLIntakeFlow` round to 1 decimal place; `TrimRxIntakeFlow`/`TrimRxIntakeFlowV2`/`WeightLoss3IntakeFlow` round to 2 decimal places. Cosmetic inconsistency only, does not affect eligibility banding materially.

---

## 10. Source files reviewed

`src/routes/sales.trimrx.tsx`, `src/routes/sales.DM.tsx`, `src/routes/weight-loss.sales.tsx`, `src/routes/weight-loss.index.tsx`, `src/routes/intake.tsx`, `src/routes/intake_.weight-loss.tsx`, `src/routes/intake_.weight-loss-trimrx.tsx`, `src/routes/intake_.weight-loss-trimrx-2.tsx`, `src/routes/intake_.weightloss-3.tsx`, `src/routes/intake_.new-weightloss-ours.tsx`, `src/components/intake/IntakeFlow.tsx`, `src/components/intake/WLIntakeFlow.tsx`, `src/components/intake/TrimRxIntakeFlow.tsx`, `src/components/intake/TrimRxIntakeFlowV2.tsx`, `src/components/intake/WeightLoss3IntakeFlow.tsx`, `src/components/intake/BlissleyIntakeFlow.tsx`, `src/components/intake/primitives.tsx`, `src/components/intake/TrxUI.tsx`, `src/components/intake/TrxUIPink.tsx`, `src/routes/checkout.trimrx.tsx`, `src/routes/checkout.charged-before.tsx`, `src/routes/checkout.UI-template3.tsx`, `src/components/checkout/PaymentFailedInline.tsx`, `src/routes/confirmation.tsx`, `src/routes/confirmation-charged.tsx`, `src/components/weight-loss/WLBeforeAfter.tsx`, `src/components/weight-loss/WLCalculator.tsx`, `src/components/weight-loss/WLFAQ.tsx`, `src/components/weight-loss/WLFinalCTA.tsx`, `src/components/weight-loss/WLHero.tsx`, `src/components/weight-loss/WLPrograms.tsx`, `src/components/weight-loss/WLSocialProof.tsx`.

Several very large files (`sales.DM.tsx` beyond line ~370, `weight-loss.sales.tsx` beyond line ~490, `checkout.trimrx.tsx`/`checkout.charged-before.tsx` beyond the ranges quoted above, and `checkout.UI-template3.tsx` beyond line ~80) were sampled rather than read to their absolute final line due to their size (each 600–1900 lines); structural conclusions about the unread tail sections are marked with explicit "not fully captured" / "flag" language above rather than presented as confirmed fact.
