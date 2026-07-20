# Blissley Patient Portal — Integration Spec

This is a documentation deliverable (no code changes). It maps every screen, UI variant, and the exact user-journey trigger that flips one variant into another. All state lives in `src/lib/portal/store.ts` and is consumed by `src/routes/portal.patient.tsx`.

---

## 1. Global shell

**File:** `src/routes/portal.patient.tsx` → `PatientPortal()`

- **Auth gate:** on mount, `hydrateFromStorage()` runs. If `session === null` → redirect to `/login`. Session is set by `actions.signIn(email)` (magic-link stub).
- **Loading:** `!hydrated || !session` → centered spinner on white.
- **Responsive layout:**
  - **Mobile (<768px):** single column, max-width 440px, white card, bottom `TabBar`, top `TopBar`.
  - **Desktop (≥768px):** `SideNav` (260px, sticky) + main column with `DesktopHeader`. `TopBar` and `TabBar` are hidden (`md:hidden`).
- **Tab switching:** local `tab` state (`home | messages | plan | settings`), animated with `AnimatePresence` (fade + 8px slide).
- **Global overlays always mounted:** `NotificationsSheet`, `DevSwitcher`, `TrackingModal`, `ReceiptModal`, `DocumentsSheet`, `PlanModalRoot`, `Onboarding` (conditional), `Toaster`.

**Dev switcher:** long-press (600ms) on the logo (mobile TopBar OR desktop SideNav) opens `DevSwitcher`, which lets you jump `planState`, trigger a message, trigger a shipment update, or reset all data.

---

## 2. The 7 plan states (single source of truth)

`PlanState` in `store.ts`:

| State | Meaning | How it enters | How it exits |
|---|---|---|---|
| `pending_review` | Intake submitted, awaiting clinician | Seed for new users / DevSwitcher | Auto-progresses to `approved_preparing` after 20s (demo) |
| `approved_preparing` | Approved, medication being compounded | From `pending_review` | Auto-progresses to `shipped` after 22s |
| `shipped` | Package in transit | From `approved_preparing`; also fires `shipment` notification | Manual via DevSwitcher → `delivered_active` |
| `delivered_active` | Active treatment, between doses | From `shipped` (fires "Package delivered" notif) | → `check_in_due` when monthly check-in comes up (demo: manual) |
| `check_in_due` | Monthly check-in required to release refill | Manual; fires `check_in` notification | User submits check-in → `refill_processing` |
| `refill_processing` | Check-in complete, refill being prepared | `actions.submitCheckIn()` or `actions.requestRefill()` | Manual back to `delivered_active` (in real backend: on ship event) |
| `paused` | Program paused N days OR cancelled | `actions.pausePlan(days)` / `actions.cancelPlan()` | `actions.resumePlan()` → `delivered_active` |

Auto-progression lives in `PatientPortal` `useEffect` (lines 72–82). **Production integration:** replace `setTimeout` chain with server events / polling.

---

## 3. Onboarding

**Component:** `Onboarding` (line 1541)  
**Trigger:** `prefs.onboardingComplete === false` after login.  
**Exit:** `actions.completeOnboarding()` at the last step. Full-bleed on mobile; centered on desktop.

Screens (tour): welcome from Dr. Nass → how the plan works → notifications opt-in → "you're in". Uses hero images from `src/assets/portal-welcome-*`.

---

## 4. Home tab

**File:** lines 314–540. Reads: `planState`, `medication`, `weightLog`, `nextCharge`, unread notifications.

### Hero band (top)

Varies by `planState`:

- **`paused`** → paused banner + "Resume" button (`actions.resumePlan`).
- **`pending_review`** → `PendingApproval` component: white spinner + "We're reviewing your intake" message. No dose card, no refill card.
- **`approved_preparing | shipped | delivered_active | refill_processing`** → hero portrait (16/5 desktop, square mobile) + status subline (`planStateSubline`). Also renders the "Next dose in Xd Yh" pill (`doseCountdown`).
- **`check_in_due`** → coral alert card: "Monthly check-in required" + "Start check-in" CTA → jumps to Plan tab and opens the `checkin` modal.

### Cards below hero (rendered when `delivered_active | check_in_due | refill_processing`)

1. **Next shipment card:**  
   Shows `shipments[0]`. "Track" button → `actions.openTracking(id)` → `TrackingModal`.  
   Disabled when `check_in_due` with tooltip "Complete check-in to ship".

2. **Progress + Weight chart card:**  
   `WeightChart` (spring-snapping crosshair) using `weightLog`. Below: `MiniStat` for total lbs lost, streak, current dose.

3. **Care team card:** "Message Dr. Nass" → jumps to Messages tab, opens doc thread.

4. **Quick actions (mobile) / right column (desktop):**  
   - Log weight → opens Plan modal `weight`.
   - Check in → opens Plan modal `checkin` (only if `check_in_due`; otherwise disabled).
   - Message care team → Messages tab.

Desktop uses a 3-col grid on `lg:`; mobile stacks.

---

## 5. Messages tab

**File:** lines 650–844. Threads: `doc` (Dr. Nass) and `care` (Care Team).

### List view (default)

Two `ThreadCard`s. Each shows: avatar, name, last preview, unread dot (count of `!read` messages in that thread), online status.

### Thread view (`ChatThread`)

Opens by clicking a card. Renders all `messages` for that thread. On open, `actions.markThreadRead(kind)` clears unread badge.

- **Input:** textarea + send; Enter sends, Shift+Enter newlines.
- **Send flow:** `actions.sendMessage(thread, text)` pushes user message → 2.2s later `simulateReply` pushes an AI reply (keyword-matched) AND creates a `message` notification.
- **Header:** liquid-glass back button + title pill (mobile); on desktop the list stays visible.

**Production integration:** replace `simulateReply` with real chat backend; keep the `notify` call so unread badges + notifications stay in sync.

---

## 6. My Plan tab

**File:** lines 846–1016.

### Sections (top-to-bottom)

1. **Check-in banner (only when `check_in_due`):** coral card, "Start check-in" → `openPlanModal("checkin")`.
2. **Plan summary card:** medication name, dose, cadence, month N of program, active since. Shows 4-week dose timeline (line 914) with current week highlighted.
3. **Next shipment / refill card (when `delivered_active`):** ship date, ETA, "Track" or "Request early refill" (`openPlanModal("refill")`).
4. **Order history:** `shipments` list; each row → `openTracking(id)`.
5. **Billing:**
   - Next charge card: `nextCharge.amount / date / daysAway`.
   - Payment method row (card last-4) → `openPlanModal("payment")`.
   - Billing history: `charges` list; paid rows → `openReceipt(id)` → `ReceiptModal`.
6. **Address row:** → `openPlanModal("address")`.
7. **Manage program:** rows for Pause, Switch plan, Cancel — each opens the matching `PlanModal` variant.

Desktop: 2-col grid on `lg:` (summary + shipments left, billing + manage right).

### `PlanModal` variants (rendered by `PlanModalRoot`)

Controlled by `ui.planModal`. Opened via `actions.openPlanModal(view)`, closed via `actions.closePlanModal()`.

| `ui.planModal` | Component | Effect on submit |
|---|---|---|
| `checkin` | `CheckInFlow` | `actions.submitCheckIn({...})` → also logs weight, sets `refill_processing`, notifies |
| `weight` | `WeightLogFlow` | `actions.logWeight(lbs)` — appends to `weightLog` |
| `refill` | `RefillFlow` | `actions.requestRefill()` → sets `refill_processing`, notifies |
| `pause` | `PauseFlow` (7 / 14 / 30 / 60 day chips) | `actions.pausePlan(days)` → sets `paused` |
| `cancel` | `CancelFlow` (retention screen) | `actions.cancelPlan()` → `cancelled=true`, `paused` |
| `switch` | `SwitchFlow` | (UI only for now — wire to plan change API) |
| `payment` | `PaymentFlow` | Card form → `actions.updateCard(last4)` |
| `address` | (uses `ModalTitle` placeholder — wire form) | Should update `patient.address1/city/state/zip` |

---

## 7. Settings tab

**File:** lines 1428–1540. Grouped sections:

1. **Account** — first name, last name, email, phone, DOB. Uses `Field` component (some disabled: email/DOB).
2. **Shipping address** — address1, city, state, zip.
3. **Payment** — card last-4 read-only (edit → open `payment` modal).
4. **Notifications** — `Toggle` for `notifShipment`, `notifMessage`, `notifCheckIn`, `notifEmail`, `notifSms`. Persisted via `actions.toggleNotifPref`.
5. **Documents** — rows that call `actions.openDocuments(view)` where `view ∈ 'menu' | 'prescription' | 'labs' | 'invoices' | 'hipaa'` → `DocumentsSheet` (line 2053) renders the matching view.
6. **Legal** — Terms / Privacy / Medication safety links.
7. **Log out** — `actions.signOut()` → redirects to `/login`.

Desktop: 2-col grid.

---

## 8. Global overlays

### `NotificationsSheet` (line 1690)
Opens from bell (top-right on mobile, sidebar/header on desktop). Shows all `notifications` newest-first. Click item → `markNotifRead(id)` and, if `deepLink`, navigates to that tab. "Mark all read" → `markAllNotifsRead()`.  
White background, black icons (no colored circle backgrounds). Sheet on mobile, centered modal on desktop.

### `TrackingModal` (line 1942)
Rendered when `ui.trackingId !== null`. Timeline: Ordered → Preparing → Shipped → Out for delivery → Delivered. Copy-tracking button.

### `ReceiptModal` (line 2003)
Rendered when `ui.receiptId !== null`. Line-item receipt for a `charges[]` row, downloadable PDF (stub).

### `DocumentsSheet` (line 2053)
Rendered when `ui.documentsView !== null`. Sub-views: prescription PDF, lab results, invoices list (each → `openReceipt`), HIPAA consent.

### `DevSwitcher` (line 1768)
Long-press logo. Not shipped to production — wrap in `import.meta.env.DEV` gate before launch.

### `Toaster` (line 1815)
Listens to `notifications` and pops the newest unread as a toast for 4s. Non-blocking.

---

## 9. Notification triggers (source of unread badges + toasts)

Every `actions.notify({...})` call:

| Trigger action | `kind` | Deep link |
|---|---|---|
| `setPlanState("shipped")` | `shipment` | `home` |
| `setPlanState("check_in_due")` | `check_in` | `plan` |
| `setPlanState("delivered_active")` | `shipment` | `home` |
| `sendMessage` reply (doc) | `message` | `messages` |
| `sendMessage` reply (care) | `message` | `messages` |
| `submitCheckIn` | `check_in` | `home` |
| `requestRefill` | `shipment` | `home` |
| `pausePlan` | `shipment` | `plan` |
| `resumePlan` | `shipment` | `home` |
| `triggerShipmentUpdate` (dev) | `shipment` | `home` |

Unread counts drive: sidebar item badges, tab bar dots, bell badge count, toaster popups.

---

## 10. Backend integration checklist for devs

1. **Auth:** replace `actions.signIn(email)` stub with real magic-link session; keep the same `session` shape so the guard still works.
2. **State machine:** delete the auto-progression `useEffect` (lines 72–82). Wire `planState` to server events (SSE / polling / webhook).
3. **Actions → API:** map each `actions.*` mutation to an endpoint. Keep local optimistic update; reconcile from server on response.
4. **Notifications:** server pushes into `notifications[]`. Keep the client `notify()` for optimistic UI.
5. **Persistence:** currently `localStorage` (`blissley.portal.v1`). Swap `persist()` / `load()` for API calls; keep `useSyncExternalStore` shape so components don't change.
6. **DevSwitcher:** gate behind env flag before publish.
7. **Modals:** `switch`, `address` need real submit handlers wired to the store + API.
8. **Documents / receipts:** currently stub PDFs — wire to a file service.

---

## 11. Files touched by this spec (no changes proposed)

- `src/routes/portal.patient.tsx` — all UI
- `src/lib/portal/store.ts` — state, actions, persistence
- `src/hooks/use-mobile.tsx` — breakpoint hook (available but shell uses Tailwind `md:` directly)

This document is the deliverable. Approve to keep it as `.lovable/portal-integration.md` in the repo so devs have a source-controlled reference.
