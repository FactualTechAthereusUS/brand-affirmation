# Post-Purchase Flow — Order Confirmation, OTO, Approval/Denial States, Payment Failed

Build one unified post-purchase UI that serves BOTH billing models (authorization hold vs charge-upfront). Same layout, images, motion, and iOS-style patient-portal aesthetic — only copy and Stripe logic differ per model. Mobile-first, tablet + desktop responsive, existing brand assets, Framer Motion.

---

## New routes to create

```
/confirmation                    → order confirmation + OTO (model-agnostic shell)
/order/approved                  → optional deep-link landing after physician approval email
/order/denied                    → optional deep-link landing after physician denial email
/checkout/error                  → NOT a route — inline error state on both checkouts
```

The `/confirmation` page reads `?model=auth|charged` and `?order=<id>` from the URL. Same component, copy swaps by prop. No duplicate files.  
  
anything related to email that's not your work to do that's outside of coding

Redirect on successful checkout:

- `checkout/trimrx` → `/confirmation?model=auth&order=…`
- `checkout/charged-before` → `/confirmation?model=charged&order=…`

---

## Screens & behavior

### 1. `/confirmation` — Order Confirmation

- iOS-style hero: animated SVG checkmark (0.6s draw), "You're in, {firstName}."
- Order summary card (product, plan, price) — white card, black text, subtle shadow, matches portal cards.
- "What happens next" — 5-step vertical timeline with filled/hollow dots and micro-animations.
- Primary CTA: **Open My Patient Portal →** (full-width, brand pink).
- Trust footer copy — swaps by model:
  - **auth:** "Your card will only be charged once your physician approves…"
  - **charged:** "You've been charged today. If our physician does not approve — full refund issued automatically within 24 hours."
- Fires analytics events: `purchase_initiated` (auth) or `purchase_completed` (charged), Meta Pixel Purchase.

### 2. OTO section (below confirmation, same page, scroll — NOT a modal)

- Product card uses the uploaded **Ondansetron ODT** image (saved to `public/assets/blissley-ondansetron-odt.png`).
- Strikethrough $45 → $29, "Add for $29" primary button, "No thanks" text link.
- Countdown micro-copy: "This offer disappears when you leave."
- On accept: separate Stripe charge $29, toast confirmation, card flips to "Added to your order ✓".
- On decline: fades out gracefully.

### 3. Patient portal magic-link email trigger

- Confirmation page dispatches a `sendMagicLink` event stub (backend hook — placeholder function; devs wire to Klaviyo).
- Portal onboarding already exists at `/portal/patient`.  
  
make the button really cool either liquid or like track order button in patient portal simiarl for this 

### 4. Portal state variants (already scaffolded in `src/lib/portal/store.ts`)

- Verify existing plan states cover: `pending_review`, `approved`, `denied`. Add copy/UI blocks for the denied state warm-tone card if missing.
- Approved: existing "Prescription Approved" card is fine.
- Denied: warm card "Your physician review is complete. A team member will reach out." + (for charged model) refund confirmation line.

### 5. Payment failed — inline (both checkouts)

- Update `src/routes/checkout.trimrx.tsx` and `src/routes/checkout.charged-before.tsx`.
- On Stripe error: inline red-tinted card above pay button with reasons list + alt-payment buttons (PayPal, Klarna, "Try another card").
- No redirect. Fires `payment_failed` analytics.

---

## Copy matrix (auth vs charged)


| Location               | Auth model                                                                      | Charged model                                                                 |
| ---------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Confirmation subheader | "Card authorized .not charged yet."                                             | "Payment received ✓"                                                          |
| Trust footer           | "Card only charged after physician approval. If not approved. no charge, ever." | "Charged today. Full refund within 24hrs if not approved."                    |
| Denial email/portal    | "Authorization released. Never charged."                                        | "Full refund of $X issued to card ending XXXX. Arrives in 3–5 business days." |
| Approval action        | Stripe capture fires                                                            | No Stripe action; ship rx                                                     |
| Denial action          | Stripe cancel authorization                                                     | Stripe automatic refund                                                       |


---

## Design system (matches `/portal/patient`)

- White cards, black ink text, brand pink `#ee7273` accents.
- Rounded 2xl, soft shadows, generous white space.
- Framer Motion: fade + slide up (0.4s, ease [0.22,1,0.36,1]), staggered timeline dots.
- Mobile-first: single column, 440px max shell. Tablet (md): 720px centered. Desktop (lg): 960px with two-column split (order summary left, timeline + CTA right).
- Uses existing assets: `blissley-logo`, `checkmark-circle`, `approval-checkmark`, `badge-check-pink`, `guarantee-badge`.
- New asset: upload the Ondansetron ODT image to `public/assets/` per local-assets rule.

---

## Files to create / edit

**Create**

- `src/routes/confirmation.tsx` — route with search param parsing (`model`, `order`, `first`).
- `src/components/confirmation/ConfirmationHero.tsx` — animated checkmark + headline.
- `src/components/confirmation/OrderSummary.tsx` — order card.
- `src/components/confirmation/NextStepsTimeline.tsx` — 5-step timeline.
- `src/components/confirmation/NauseaOTO.tsx` — OTO card with accept/decline states.
- `src/components/confirmation/TrustFooter.tsx` — copy swaps by model.
- `src/components/checkout/PaymentFailedInline.tsx` — reusable inline error.
- `public/assets/blissley-ondansetron-odt.png` — via `lovable-assets` from uploaded image.

**Edit**

- `src/routes/checkout.trimrx.tsx` — on success redirect to `/confirmation?model=auth`, integrate `PaymentFailedInline`.
- `src/routes/checkout.charged-before.tsx` — same, redirect with `?model=charged`.
- `src/lib/portal/store.ts` — ensure `denied` state supports refund copy field (charged model).
- `src/routes/portal.patient.tsx` — add denied-state warm card + optional refund line.

**No changes to** business logic beyond client-side stubs (Stripe/Klaviyo wiring left as marked TODO comments for devs).

---

## Technical notes (for devs)

- All Stripe/Klaviyo hooks are placeholder client functions (`onPurchaseComplete`, `onOTOAccept`, `sendMagicLink`) with `// TODO: wire to backend` comments — no server functions added.
- URL search params validated with a small parser; unknown model falls back to `auth`.
- Mobile bottom safe-area padding on CTAs.
- Route naming follows TanStack file convention: `src/routes/confirmation.tsx`.  
  
don't use any "—" em dashes 