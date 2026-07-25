## Goal

Make every visible button on `/admin/orders/$id` and `/admin/patients/$id`  and `/admin/leads/$id`  (plus the pieces in `admin.orders.index` / `admin.patients.index` they hand off to) actually do something end-to-end against the demo store, with clear feedback (state change + activity log + optional toast). No new backend — everything writes through `adminActions` in `src/lib/admin/store.ts` so the UI updates immediately and persists to localStorage.

## Current state (verified from source)

**Already wired (do not touch):**

- Patient page: `ManagePanel` pause/cancel/switch-plan modals, `QuickActionsPanel` magic link / refund modal / flag modal, `StatusBanner` retry/reactivate/write-off, `InternalNotes`, `TagsCard`, payments-row Retry, sendMagicLink.
- Order page: `OrderInternalNotes` save note, VariantBanner links to physician queue.
- Index pages: search, filter, sort, row-click navigation.

**Gaps — buttons that render but do nothing:**

Order detail (`admin.orders.$id.tsx`):

- Toolbar: Print label, Refund, More, **Advance stage**
- Variant banner: **Reship at no cost** (exception case)
- Shipping card: Edit address, Reissue label, Reroute, Report exception
- Payment card mini-btns: Refund, Send receipt, Retry
- Subscription card: Pause, Skip next, Cancel
- Assigned card: Reassign
- Tags card: `+ Add`
- Activity card header: Add internal note (should just focus the notes box)
- Patient card: "View patient" link → `/admin/patients` (missing `$id`)

Patient detail (`admin.patients.$id.tsx`):

- Header: Send message (needs patient-scoped composer), **Issue refund** (header button — unwired; QuickActions refund is wired), More menu
- Orders table: per-row **View** button (doesn't navigate to `/admin/orders/$id`)
- Check-ins: **Send reminder now**
- Intake: Download intake PDF
- ManagePanel stubs: Update payment method (alert), Update shipping address (alert), billing-date Save
- QuickActions stubs: Create new order (alert), Export patient record (alert), Delete patient (modal closes but no-op)

## Plan

### 1. Extend `src/lib/admin/store.ts` with the missing actions

Add to `adminActions` (all mutate state + push to `activity` log for feedback; timeline events on orders where relevant):

- `advanceOrderStage(orderId)` — walk `processing → at_pharmacy → shipped → delivered`, append matching `timeline` event, set `deliveredAt`/`eta` when transitioning.
- `refundOrder(orderId, reason?)` — set `payment.status = "refunded"`, push timeline note, activity log.
- `retryOrderPayment(orderId)` — flip payment back to `paid` (demo).
- `reissueLabel(orderId)` — regenerate `tracking` string, push `label` timeline event.
- `reportOrderException(orderId, reason)` — status→`exception`, add flag, timeline `exception` event.
- `rerouteOrder(orderId, newCity/newState)` — patch `shipTo`, timeline note.
- `updateOrderAddress(orderId, patch)` — patch `shipTo`.
- `assignOrderOps(orderId, ops)` — store `opsOwner` on order.
- `addOrderTag` / `removeOrderTag`
- `sendOrderReceipt(orderId)` / `printOrderLabel(orderId)` — activity toast only.
- `pauseOrderSubscription(patientId)` (delegates to `pausePatient`) / `skipNextRefill(orderId)` — pushes eta forward 30d + activity.
- `sendCheckInReminder` already exists on check-ins; add `sendPatientCheckInReminder(patientId)` for the patient page banner.
- `deletePatient(id)` — remove from `patients`, cascade filter `orders`/`payments`, activity log.
- `createManualOrder(patientId, program)` — insert a fresh `processing` order with a seeded timeline entry.
- `updatePatientCard(id, brand, last4)` / `updatePatientAddress(id, addr)` / `updatePatientBillingDate(id, iso)`.
- `exportPatientPdf(id)` — activity log only (demo).

Each action normalizes through the existing `set(...)` helper so it participates in persistence + subscriptions.

### 2. Add a tiny global toast

New `src/components/admin/Toast.tsx` + `useToast()` hook (module-level event bus). One mount in `AdminShell`. `adminActions` fires a toast for user-triggered ops (refund issued, label reissued, receipt sent, etc.). Keeps feedback consistent without redesigning any card.

### 3. Wire the order detail buttons (`admin.orders.$id.tsx`)

- Toolbar → `printOrderLabel`, open a small `RefundModal` (amount + reason) → `refundOrder`, replace `ToolbarBtn` with real onClicks; **Advance stage** → `advanceOrderStage` (disabled at `delivered`).
- Variant banner Reship → `reshipOrder` + toast.
- Shipping mini-btns → open `EditAddressModal` / `RerouteModal` / `ReissueLabelModal(confirm)` / `ReportExceptionModal(reason)`.
- Payment mini-btns → `refundOrder` / `sendOrderReceipt` / `retryOrderPayment` (only enabled when relevant).
- Subscription mini-btns → reuse `ManagePanel`'s pause/cancel/switch flows via a shared modal, or call `pausePatient` / `cancelPatient(reason)` directly on `o.patientId`.
- Tags `+ Add` → inline input like patient TagsCard, calls `addOrderTag/removeOrderTag`.
- Assigned "Reassign" → simple select modal listing 4 demo ops names → `assignOrderOps`.
- Activity "Add internal note" → scrollIntoView + focus the notes textarea.
- Fix "View patient" `Link` to `/admin/patients/$id` with `params={{ id: o.patientId }}`.

### 4. Wire the patient detail buttons (`admin.patients.$id.tsx`)

- Header "Send message" → navigate to `/admin/messages` and call `setActiveConvo` with the patient's conversation (fall back to creating a stub convo if none — one-liner in store).
- Header **Issue refund** → open the same `RefundModal` used in `QuickActionsPanel` (extract it to `patients/RefundModal.tsx` and share).
- Header "More" → dropdown with Pause / Cancel / Reactivate / Delete (delegating to existing modals in ManagePanel/QuickActions).
- Orders row "View" → `nav({ to: "/admin/orders/$id", params: { id: o.id }})`.
- Check-ins "Send reminder now" → `sendPatientCheckInReminder` + toast.
- ManagePanel: replace "Update payment method" `alert` with `UpdateCardModal` (brand + last4) → `updatePatientCard`. Replace "Update shipping address" `alert` with `UpdateAddressModal` → `updatePatientAddress`. Wire billing-date Save → `updatePatientBillingDate`.
- QuickActions: "Create new order" → confirm modal → `createManualOrder` then navigate to the new order. "Export patient record" → `exportPatientPdf` + toast. "Delete patient" → wire the existing confirm modal's Delete button to `deletePatient` then `nav("/admin/patients")`.
- Intake "Download intake PDF" → toast (demo).

### 5. Verification

After implementing:

- Manually walk `/admin/patients/pt_1000` → click every button; each should either open a modal, mutate visible state, or fire a toast. Reload page → state persists (localStorage).
- Open one of that patient's orders → same drill.
- Run `bunx tsgo --noEmit` (typecheck) and eyeball console/network in the preview after.

## Out of scope

- Backend/Supabase writes (this is a demo store).
- Redesigning any card layout — only replacing `onClick` handlers and adding small modals matching the existing modal style (`ManagePanel` / `QuickActionsPanel` patterns).
- Messages composer redesign — we only wire the existing convo selection.

## Technical notes

- All new modals follow the existing `fixed inset-0 z-50 grid place-items-center bg-black/40` pattern used in `ManagePanel`.
- Actions that need to derive extra fields (e.g. `advanceOrderStage` producing new `timeline` events) reuse `orders-enrich.ts` helpers where already available; anything new goes right next to the existing helpers.
- Toast lives in `AdminShell` so it works across every admin page automatically, including `admin/orders`, `admin/patients`, and their lists.