## Audit summary

Working end-to-end today: auth gate, onboarding tour, tab nav, notifications sheet (open/read/deep-link), messages (send + simulated reply, per-thread unread), plan state machine, check-in flow (unlocks refill), log weight, request early refill, pause / resume / cancel, switch plan (UI only), address edit, weight chart with hover, dev switcher.

Not finished / inconsistent — this plan fixes each one.

## Fixes

### 1. Dead buttons on Home & Plan
- **Track order** button on Home shipment card → open a new `TrackingModal` (timeline: Ordered → Packed → In transit → Out for delivery → Delivered, driven by `shipment.status`, with tracking number, carrier, ETA, copy-to-clipboard).
- **Order History "Tracking" pill** on Plan → opens the same `TrackingModal`.
- **Billing History "Receipt" pill** → opens a `ReceiptModal` (line items, card used, date, Blissley logo, download-stub button).
- **Physician "Message" strip** on Home already navigates — verify and keep.

### 2. Payment method modal is a placeholder
Replace the "A secure Stripe form would open here" block with a real-looking card form: cardholder name, number (formatted with brand detection reusing `PayIcons`), expiry, CVC, billing ZIP, "Save card" button that updates `patient.card` in the store and shows a toast. Same white/black aesthetic as the other modals.

### 3. Documents section is fake
Turn the 4 static rows into a real `DocumentsSheet`:
- Prescription (PDF) → opens a modal showing a styled prescription preview (patient, medication, dose, prescriber Dr. Nass, date, signature image) with "Download PDF" stub.
- Lab results → "No results on file yet" empty state with explanation.
- Invoice history → list of `charges` with per-row "View" → opens the `ReceiptModal` from #1.
- HIPAA notice → scrollable text sheet with the standard notice.

### 4. Settings visual inconsistency (the "not same color scheme" point)
Match the white/black/hairline system used in Order History / Manage / Billing:
- `SettingsGroup` already white — keep, but drop the beige `bg-[color:var(--color-mist)]/60` used by Toggle off-state and Log out button; use `bg-white` + hairline border and `bg-ink/5` for hover.
- Toggle off state → neutral `#E5E5E5` (not beige `#E4E0D7`) so it reads on white.
- Log out button → white with hairline border and black text (matches other secondary buttons), destructive-red only on hover.
- Field label chips → drop the uppercase mist styling, use the same 11px ink/50 label used in Manage rows.
- Documents rows use the same white/hairline row style as Order History.

### 5. Auto state progression (feels alive without dev switcher)
On mount, if `planState === "pending_review"` and >20s elapsed since load, auto-advance to `approved_preparing`, then `shipped` after another 20s, then `delivered_active`. Timers cleared on unmount. This makes the "just signed up" demo path visibly move.

### 6. Small polish
- Notification bell: when sheet opens, mark visible ones as read after 800ms (matches iOS behavior) — optional toggle behind a check.
- Home "Progress" card: "Log weight →" link should open the log-weight modal directly instead of just navigating to Plan.
- Check-in CTA on Home should also be tappable to jump straight into the check-in modal (currently just goes to Plan tab).
- Messages tab: mark thread read when opened (already partially there — verify `markThreadRead` fires on thread open).

## Out of scope
Real backend, real Stripe, real PDF generation, real tracking API. Everything stays client-side on the existing `usePortal` store — the goal is "feels fully functional end-to-end in the demo."

## Files touched
- `src/routes/portal.patient.tsx` — all UI wiring, new modals (`TrackingModal`, `ReceiptModal`, `DocumentsSheet`, real `PaymentMethodForm`), Settings restyle, auto-progression effect.
- `src/lib/portal/store.ts` — small additions: `updateCard(last4, brand)` action, `markShipmentDelivered` helper if needed for auto-progression.

No new dependencies.
