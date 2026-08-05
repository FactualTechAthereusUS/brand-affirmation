# 05 — Email System Specification

Source: `src/routes/emails.tsx` (1817 lines) and `src/components/emails/NurtureFlows.tsx` (1595 lines).

## 0. What this actually is

`/emails` is a **static preview route**, not a sendable email system. `EmailPreview` (the route component) renders a long vertical stack of hard-coded React components, each visually reproducing one email as it would render in an inbox (fixed 480–560px width "envelope" card). There is:

- No email-sending backend, no ESP integration, no templating engine reading these components.
- No dynamic data — every name ("Sarah"), order number (`BLS-00421`), price, and date is hard-coded JSX text.
- The `admin.build.email-flows` screen (`src/lib/admin/store.ts` → `build.emailFlows`) lists flow metadata (name, email count, status, "Klaviyo synced" timestamp) purely as **seeded demo state** — toggling "sync to Klaviyo" (`syncEmailFlow`/`syncAllEmailFlows` actions) just flips a boolean/timestamp in local state; no network call is made.
- The only interactive elements are anchor tags with `href="#"` or real in-app paths (`/portal/patient`, `/intake/weight-loss`) — clicking most CTAs does not send anything.

In short: this route is a **design/copy reference deck** for what the email program would look like if wired to a real ESP (e.g., Klaviyo, per the `build.emailFlows.klaviyoSynced` field).

## 1. Shared design system

### 1.1 Envelope shell
Every email is wrapped in a consistent "envelope" card:
- Outer container: `rounded-[22px]`, `bg-ink/[0.04]`, soft drop shadow (`shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]`), 1px ink ring.
- Header: centered Blissley wordmark logo (`blissley-logo.png`) on a `bg-canvas` strip, ~20px tall.
- Optional "subject strip": a light strip below the header showing `From care@blissley.com`, the subject line, and the preview/preheader text — used on the transactional emails built with the `PaymentShell` / `AccountShell` / `NurtureShell` factories (not on the earliest hand-built emails like the order confirmation or shipping email, which fold subject text into the H1 instead).
- Hero: centered H1 in `font-hero`, 28–40px, `tracking-[-0.02em]`, with the emotional/benefit half of the headline colored coral (`text-[#ee7273]`).
- Body content cards: nested `rounded-[20px] bg-canvas` panels with `ring-1 ring-ink/5` for structured data (trackers, line items, payment details).
- CTA buttons: full-width or centered pill buttons, `rounded-full`, either `bg-ink text-white` (default) or `bg-[#ee7273] text-white` (higher-urgency/clinical actions), with a trailing arrow icon; hover lifts `-translate-y-0.5`.
- Footer: dark `bg-ink` band with white Blissley logo (`blissley-white.png`), legal entity line ("TheFactual LLC DBA Blissley · 131 Continental Dr, Suite 305, Newark, DE 19713"), and either "Manage preferences · Unsubscribe" links (marketing-adjacent transactional mail) or a one-line compliance note ("This is a transactional email…", "For medical emergencies call 911.").

### 1.2 Reusable factory components (in `emails.tsx`)
- `Tracker` / `ShippingTracker` / `DeliveryTracker` — 4-step horizontal progress rail (Order Placed → Physician Review → Shipping → Delivery) with filled/unfilled circles and a connecting line whose width is computed from `activeIndex`.
- `PaymentShell` — shell for the 3 payment-failure emails; takes `subject`, `preview`, `accentIcon`, `accentTone` (`coral`/`amber`/`ink`), `title`/`titleAccent`.
- `AccountShell` — shell for the 4 account/security emails; takes `ctaLabel`, `ctaHref`, `ctaTone`, `footNote`.
- `PaymentDetailsCard`, `UpdatePaymentButton`, `CareUnaffectedNote` — shared building blocks across the 3 payment-failed emails.
- `MetaRow`, `SecurityNote` — shared building blocks across the 4 account-change emails (icon + label/value rows, and a coral/ink advisory callout).
- `VisaIcon` — small inline "VISA" chip used wherever a card on file is displayed.

### 1.3 Reusable factory components (in `NurtureFlows.tsx`)
- `NurtureShell` — the shell for every marketing/lifecycle nurture email: logo header, "From care@blissley.com" + subject + preview strip, body, dark footer with "Manage preferences / Unsubscribe" links (these are marketing emails, so no medical-emergency disclaimer).
- `CTA` (ink pill) / `CoralCTA` (coral pill) — full-width buttons with trailing `ArrowRight`.
- `FlowDivider` — a dark (`bg-ink`) section-break card inserted between flows in the preview stack, labeling the flow name, title, and trigger/exit rule (e.g., "Screens 1–8. 3 emails, stops after 72 hours.").
- `SendTag` — small pill badge (clock icon) reading e.g. "Flow 1A · Send 2 · 24 hours" — the only place timing/trigger metadata is expressed.
- `Body` — plain paragraph stack for long-form copy.
- `BigReviewCard` / `Stars` — testimonial cards with photo, objection tag, star rating, headline quote, body, and an outcome pill (e.g., "Down 50 lbs · Off blood pressure meds").
- `BillingHero`, `ChargeCard`, `InBoxList`, `DelayButtons`, `BillingClose` — shared blocks for the Flow 4 billing-reminder variants.
- `CheckinHero`, `CheckinCTA`, `AskingList` — shared blocks for the Flow 5 90-day check-in emails.

### 1.4 Color/typography tokens used
- Brand coral accent: `#ee7273` for headline emphasis, icons, CTA fills, progress dots.
- `font-hero` (Google Sans Flex / Manrope stack, see styles.css) for all headlines.
- Body copy: `text-ink/70`–`text-ink/80` at 13.5–15.5px, line-height 1.55–1.75.
- Legal/footer text: `text-white/45`–`text-white/55` at 11–11.5px inside the dark footer band.

## 2. Transactional emails (`emails.tsx`)

All of these are **static previews only** — none are sendable. Each is documented as: Subject / Preview / Trigger (inferred from copy or `SendTag`) / Structure / CTA.

| # | Email (component) | Subject | Preview text | Trigger (implied) | CTA |
|---|---|---|---|---|---|
| 1 | Order Confirmation (`EmailPreview` root card) | *(none — uses eyebrow "Order Confirmation · #BLS-00421")* | — | Immediately after checkout | "Track your order" → `/portal/patient` |
| 2 | Next-Days Timeline (`NextDaysSection`) | — (visual insert, not a separate send) | — | Rendered as part of/adjacent to order confirmation | none (informational only) |
| 3 | Portal Ready (`PortalEmail`) | — (implied "Your Blissley portal is ready.") | — | After account/portal creation | "Open my portal" → `/portal/patient` |
| 4 | Plans / Upsell (`PlansEmail`) | — ("Weight loss plans that put you first") | — | Marketing/education send, unclear exact trigger (no SendTag) | "Get started" → `/intake/weight-loss`; secondary "Learn more" → `/weight-loss` |
| 5 | Refund Issued (`RefundEmail` — referenced, body only partially shown) | — | — | Triggered by refund decision (denial or cancellation) | none surfaced in visible body (informational) |
| 6 | Shipping Update (`ShippingEmail`) | "It's on its way, Sarah." (H1, not subject strip) | "Your box just left the pharmacy." | When order status → `shipped` | "Track my package" |
| 7 | Delivered / First Injection (`DeliveryEmail`) | "It's here, Sarah." | "Tonight's the night." | When order status → `delivered` | "Open My Injection Guide" → `/portal/patient` |
| 8 | Payment Failed — 1st notice (`PaymentFailedEmail1`) | "We couldn't process your payment" | "Quick fix — update your card to keep your shipment on track." | 1st failed renewal charge | "Update payment method" |
| 9 | Payment Failed — 2nd notice (`PaymentFailedEmail2`) | "Your shipment is on hold" | "Update your card to release your next order." | Card still failing; shipment held | "Update payment method" |
| 10 | Payment Failed — 3rd notice (`PaymentFailedEmail3`) | "Action needed — your subscription will pause" | "Last step before your next order is affected." | 48-hour final warning before auto-pause | "Update payment method" |
| 11 | New Physician Message (`PhysicianMessageEmail`) | "You have a new message from Dr. Nass" | — | Physician sends portal message | "View my message" → `/portal/patient` (content withheld from email for privacy) |
| 12 | 90-Day Check-In — Coral hero variant (`CheckInEmail1`) | — | — | Day-90 check-in due, before next shipment | "Complete My Check-In" |
| 13 | 90-Day Check-In — Reminder variant (`CheckInEmail2`) | — ("Reminder · 90-Day Check-In") | — | Follow-up reminder if check-in not yet done | "Complete My Check-In" |
| 14 | Password Reset (`PasswordResetEmail`) | "Reset your Blissley password" | "Use this secure link to set a new password." | User requests password reset | "Reset my password" (coral); link expires in 30 minutes |
| 15 | Password Changed (`PasswordChangedEmail`) | "Your Blissley password was changed" | "Confirming a recent change to your account." | Password successfully changed | "Review account activity"; shows when/device/location metadata |
| 16 | Profile Updated (`ProfileChangeEmail`) | "Your Blissley profile was updated" | "A quick heads-up about a recent change to your account." | Profile field(s) changed | "Go to my profile"; shows changed fields (name, phone, address) |
| 17 | Email Changed (`EmailChangedEmail`) | "Your Blissley login email was changed" | "Confirming your new sign-in address." | Login email changed | "Open my account"; shows old/new email + timestamp |

Notes:
- Emails 8–10 form an implicit **dunning sequence** (no explicit day-offsets given, unlike the nurture flows) — same `PaymentShell`, escalating icon/tone (`AlertCircle` coral → `PauseCircle` amber → `Clock` coral) and escalating headline urgency.
- Emails 14–17 form an **account-security sequence** using `AccountShell`, all with a `SecurityNote` callout advising the user what to do if they didn't initiate the change.
- None of these transactional emails carry unsubscribe links except the order/shipping/portal ones — the account-security and physician-message emails treat themselves as pure transactional/compliance mail.

## 3. Nurture / lifecycle flows (`NurtureFlows.tsx`)

These are explicitly labeled as flows with defined sends and timings via `SendTag` and `FlowDivider`. All are static previews.

### Flow 1A — Quiz abandoned, early drop (TOF: screens 1–8)
3 emails, sequence stops after 72 hours.
| Send | Timing | Subject | Preview | Theme | CTA |
|---|---|---|---|---|---|
| 1 | 1 hour | "You got two screens in" | "Whatever it was, come back when you're ready." | Low-pressure re-engagement | "Continue My Assessment" |
| 2 | 24 hours | "The thing nobody tells you about hunger" | "It's not the food. It's the voice." | Educational (food noise / GLP-1 mechanism) | "Finish My Assessment" (coral) |
| 3 | 72 hours | "I'll stop after this one" | "Genuinely, no more emails after this." | Last-chance, low-pressure | "Complete My Assessment" |

### Flow 1B — Quiz abandoned, late drop (BOF: screens 9–18)
3 emails, sequence stops after 48 hours.
| Send | Timing | Subject | Preview | Theme | CTA |
|---|---|---|---|---|---|
| 1 | 1 hour | "You were two minutes from done" | "Pick up exactly where you left off." | Proximity to completion | "Finish Where I Left Off" |
| 2 | 12 hours | "90% done, still sitting there" | "Two minutes left, and the price doesn't change." | Pricing transparency ($249 sema / $299 tirz) | "Finish My Assessment" (coral) |
| 3 | 48 hours | "Still at 90%" | "Don't lose the four minutes you already put in." | Sunk-cost / last call | "Finish Now" |

### Flow 2 — Pre-purchase nurture (assessment complete, no purchase)
5 sends (mix of text-only and graphic/photo sends).
| Send | Timing | Subject | Preview | Theme | CTA |
|---|---|---|---|---|---|
| 1 | 30 minutes | "I already know what you're going to ask me" | "Will I actually get charged if I'm not approved. No." | Confirms readiness + refund guarantee + urgency ("spot open now") | "Start My Program" (coral) |
| 2 | 3 hours | "You're probably wondering about the money" | "Same question everyone asks first." | FAQ format answering 3 billing objections | "Start My Program" |
| — Sensory | 18 hours | "11pm, and you're standing in the kitchen again" | "You already ate dinner two hours ago." | Sensory/emotional "food noise" narrative with full-bleed kitchen photo, includes a stat callout ("57% of people with obesity…") | "Start My Program" (coral) |
| 3 | 24 hours | "What Sarah could look like in 6 months" | "'The food noise is finally gone.' — Jennifer R." | Social proof — 3 `BigReviewCard` testimonials with photo/objection/outcome, TrustScore stat strip | "Start My Program" (coral) |
| 4 | 48 hours | "Can I ask you something" | "Genuinely, just hit reply." | Personal, objection-surfacing ask (reply-to conversation) | "Start My Program" |
| 5 | 72 hours | "Your spot's about to go to someone else" | "Physician slots rotate every 48 hours." | Scarcity/loss-aversion (coral hero band) | "Claim My Spot" (coral) |

Note: the flow divider states "5 emails" but 6 sends are implemented (Email1, Email2, Sensory, Email3, Email4, Email5) — the Sensory variant is presented as an additional/alternate send in the sequence.

### Flow 3 — Checkout abandoned
4 sends over 48 hours; exits on `purchase_completed`.
| Send | Timing | Subject | Preview | Theme | CTA |
|---|---|---|---|---|---|
| 1 | 30 minutes | "Sarah, $100 off expires tonight" | "Your physician slot is still held. One step left." | Discount + urgency, vial-on-marble hero image | "Complete my order — $299" (coral) |
| 2 | 4 hours | "What $299 vs $1,300 actually means" | "Same molecule. One is accessible. One isn't." | Comparison table (Blissley vs. Pharmacy: price, insurance, review time, waitlist, dose-price stability, cancellation) | "Complete my order — $299" |
| 3 (variant A) | 24 hours | "Another year of this, or not" | "Six years is long enough." | Food-noise emotional narrative, full-bleed hero image | "Start my program — $299" (coral) |
| 3 (variant B) | 24 hours | "Another year of this, or not" | "Six years is long enough." | "Tried everything" emotional narrative, alternate hero image | (same CTA pattern) |
| 4 | — (final) | (final "last email" send) | — | Founder-signed ("Anmol, Founder, Blissley") final appeal, restates no-charge-if-denied guarantee | "Complete my order" |

Two parallel creative variants exist for Send 3 (`Flow3_Email3_FoodNoise` and `Flow3_Email3_TriedEverything`) — likely an A/B test pair keyed to the visitor's stated pain point from intake.

### Flow 4 — Billing reminder (5 days before renewal)
Not a multi-send drip; 3 mutually exclusive **variants** selected by month/situation, each a single email.
| Variant | Subject | Preview | Trigger | Contents | CTA / actions |
|---|---|---|---|---|---|
| Month 2 (`Flow4_Month2`) | "Month 2 starts in 5 days, Sarah" | "$299 processes in 5 days. Here's what's in your box." | 5 days before 2nd renewal charge | Charge card (amount/date/card), box contents, "month 2 is when most patients notice the shift" messaging | "Delay 2 weeks" / "Delay 1 month" buttons; "Manage my subscription" link |
| Standard / Month 4+ (`Flow4_Steady`) | "Your next shipment is coming, Sarah" | "$299 processes in 5 days. Here's what's in your box." | 5 days before any steady-state renewal | Same charge/box structure, no special messaging | Same delay buttons + manage link |
| Dose increase (`Flow4_DoseIncrease`) | "Your dose increases this month, Sarah" | "Stronger appetite regulation. Same $299." | 5 days before a renewal that includes a dose step-up | "What this means" callout emphasizing price-lock despite dose increase | Same delay buttons + manage link |

Note: "Month 3 = separate check-in email" per the `FlowDivider` subtitle — i.e. Month 3's billing reminder is superseded by the Flow 5 check-in requirement.

### Flow 5 — 90-day check-in (quarterly, required before renewal)
| Send | Day | Subject | Preview | Channel | Contents | CTA |
|---|---|---|---|---|---|---|
| Main (`Flow5_CheckIn`) | Day 84 | "Quick update needed before your next shipment" | "2 minutes. 8 questions. Required to continue." | Email | Physician photo/hero card, "what Dr. Nass is asking" list (weight, side effects, med changes, overall feeling), states next billing date | "Complete my check-in" (×2 placements) |
| Reminder (`Flow5_Day87`) | Day 87 | "Sarah, your shipment is on hold" | "Check-in takes 2 minutes. Complete it to release your order." | Email (text-only, no hero) | Short reminder that shipment is held | "Complete my check-in — 2 minutes" |
| Final reminder (`Flow5_SMS`) | Day 89 | "Day 89 · Final reminder" | — | **SMS** (rendered as an iMessage-style bubble, not an email envelope) | "Your 90-day check-in is still pending…" + short link + "Reply STOP to opt out." | link only |
| Submitted confirmation (`Flow5_Submitted`) | On submission | "Check-in received" | "Dr. Nass is reviewing. Your shipment releases within 24 hours." | Email | Confirms receipt, sets 24h review expectation | "View in portal" |
| Approved confirmation (`Flow5_Approved`) | On physician approval | "Dr. Nass renewed your prescription" | "Your next shipment is being prepared." | Email | Confirms renewal + 48h ship window | "Track in portal" |

## 4. Cross-cutting observations

- **Personalization tokens are all hard-coded** to "Sarah" / `sarah@example.com` / `BLS-00421` / Visa •4242 — there is no merge-tag system in this codebase; a real implementation would need to template these against `Patient`/`Order` records from `src/lib/admin/store.ts`.
- **Pricing consistency**: nurture copy repeatedly reinforces the platform's core value props also seen on the marketing site — no price increase at higher doses, refund if not approved, one-click cancel, 24h physician review, 48h shipping.
- **Two rendering contexts**: everything under 480–560px "envelope" card mimics email client rendering; the one SMS mock (`Flow5_SMS`) breaks pattern and mimics a phone messaging UI instead, with no envelope/logo/footer.
- **Timing metadata is inconsistent between files**: `emails.tsx` transactional sends carry no explicit hour/day offsets (dunning/check-in emails), while every `NurtureFlows.tsx` email states its offset via `SendTag`. This suggests the transactional set is considered event-driven (fires on a state transition) while the nurture set is time-delay driven.
- **`build.emailFlows` seed data** (`seeds.ts`/`store.ts`) lists flows not represented in this preview file at all (e.g., "Post-Purchase Pre-Approval", "Physician Denied", "Active Subscriber Onboarding", "Win-Back", "Refill / Renewal", "Order Confirmation" as a single-email flow, "Magic Link (Portal)") — i.e. the admin's Email Flows management screen references more flows than are visually previewed here, and the "Checkout Abandoned" flow is marked `status: "draft"` / `klaviyoSynced: false` in that seed data even though it's fully designed in `NurtureFlows.tsx`.
