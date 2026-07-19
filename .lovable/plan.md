# Blissley Patient Portal — End-to-End Plan

Goal: turn `/portal/patient` from a static screen into a believable, demoable patient experience with a real journey starting at `/login`. All demo data driven by a client-side store (localStorage), no backend required.

---

## 1. Journey Map (what actually happens)

```text
/login  →  magic-link sent screen  →  (auto "click" simulated)  →
/portal/patient  →  first-visit onboarding overlay (4 steps)  →
Home tab (populated with realistic state)
```

**States a patient can be in** (drives every card/CTA on Home):

1. `pending_review` — just paid, doctor hasn't approved yet (0–24h simulated).
2. `approved_preparing` — prescription approved, pharmacy prepping.
3. `shipped` — tracking active, ETA in 2–4 days.
4. `delivered_active` — on treatment, weekly dose cadence.
5. `check_in_due` — 3-month check-in required before next refill ships.
6. `refill_processing` — check-in done, next shipment queued.

The demo starts in `delivered_active` (most interesting UI) but a hidden dev switcher (long-press logo) cycles states so we can show every variation.

---

## 2. Login → Portal handoff

- `/login` already exists. Wire the "Send magic link" button to:
  1. Show "Check your email" confirmation (2s).
  2. Auto-advance to `/portal/patient` (simulating link click) — this makes the demo flow without email infra.
  3. Set `blissley.session = { email, loggedInAt }` in localStorage.
- `/portal/patient` reads session; if missing, redirect to `/login`.
- Add "Sign out" in Settings that clears session and returns to `/login`.

---

## 3. First-visit Onboarding (overlay, not a route)

Full-screen liquid-glass overlay over Home, 4 swipeable cards:

1. **Welcome, Sarah** — "Your care team is ready."
2. **Meet Dr. Nass** — physician photo + credentials + "he'll message you within 24h."
3. **How your plan works** — weekly dose, monthly check-in, auto-refill.
4. **Enable notifications** — mock iOS permission (toggle, saved to store).

Dismissible; sets `onboardingComplete = true`. Never shown again unless reset from Settings → "Replay tour".

---

## 4. Home Tab — dynamic composition

Cards appear/disappear based on `patientState`:


| Card                                                            | Shown when                         |
| --------------------------------------------------------------- | ---------------------------------- |
| Hero image + greeting                                           | always                             |
| **Status hero** (Approved / Shipped / Delivered / Check-in due) | always, content swaps by state     |
| **Next dose** countdown (e.g. "Dose 3 of 4 · Thursday 8:00 AM") | `delivered_active`, `check_in_due` |
| **Check-in required** banner (coral, prominent)                 | `check_in_due` — blocks refill     |
| **Next shipment** card (with track button)                      | `shipped`, `refill_processing`     |
| **Next charge** card                                            | always except `paused`             |
| **Message from Dr. Nass** preview                               | when unread message exists         |
| **Progress snapshot** (weight -6.2 lbs, streak)                 | `delivered_active` onward          |
| **Paused** banner + Resume CTA                                  | `paused`                           |


Every card animates in/out (framer-motion layout + AnimatePresence).

---

## 5. Messages Tab

- Threaded chat with **Dr. Nass** (care team).
- Seeded conversation: welcome message → user reply → doctor response about side effects → check-in reminder.
- Composer: text input + attach (photo/lab). Sending pushes to store, doctor "types…" indicator, auto-reply after 3s from a small canned-response bank keyed on keywords (nausea, dose, refill, thanks).
- Unread badge on tab bar reflects `messages.filter(unread).length`.
- Tapping a message from Home deep-links here and scrolls to it.

---

## 6. My Plan Tab

Sections:

- **Current medication** card — Semaglutide 0.5mg, weekly, next dose date.
- **Dose schedule** — 4-week calendar strip, dosed weeks checked, upcoming dose highlighted.
- **Progress** — weight chart (reuse WeightLossChart component) with logged entries; "Log weight" button opens sheet.
- **Check-in** — monthly form (weight, side effects 1–5, mood, notes). Submitting flips `check_in_due` → `refill_processing`, unlocks refill, triggers doctor message.
- **Refills** — list of past shipments + upcoming; "Request early refill" button (opens confirm sheet).
- **Pause / Cancel plan** — bottom, subdued.

---

## 7. Settings Tab

- Profile (name, DOB, email, phone) — editable inline.
- Shipping address — editable.
- Payment method — masked card, "Update".
- Notifications — toggles (Shipment, Messages, Check-in reminders).
- Documents — Prescription PDF, Lab results, Invoices (mock links).
- Support — contact card, FAQ link.
- Replay tour · Sign out · Version.

---

## 8. Notifications system

- Bell icon in TopBar (already there) opens a sheet listing notifications from store.
- Types: `shipment_update`, `message`, `check_in_due`, `charge_upcoming`, `dose_reminder`.
- Each has icon, title, body, timestamp, `read` flag, deep-link.
- Unread dot on bell; badges on Messages tab and relevant Home cards.
- Toast (bottom, glass) fires when a state transition creates a new notification during the session (e.g., dev switcher moves to `shipped` → toast "Your order shipped").

---

## 9. Data layer (client-only)

`src/lib/portal/store.ts` — small Zustand-like store using `useSyncExternalStore` + localStorage:

```ts
type PortalState = {
  session: { email: string } | null;
  patient: { firstName, lastName, dob, phone, address };
  planState: PatientState;      // enum above
  medication: { name, dose, cadence, nextDoseAt };
  shipments: Shipment[];
  charges: Charge[];
  messages: Message[];
  notifications: Notification[];
  weightLog: { date, lbs }[];
  checkIns: CheckIn[];
  prefs: { notif: {...}, onboardingComplete };
};
```

Seed on first load. All UI reads/writes through the store; changes persist across reloads. A hidden `?reset=1` query clears it.

---

## 10. Dev demo switcher

Long-press (600ms) on the "blissley" wordmark in TopBar opens a bottom sheet:

- Radio list of the 7 patient states → applies seed for that state.
- "Trigger new message", "Trigger shipment update", "Advance 1 week" buttons.
- Lets you demo every UI variant without waiting.

---

## 11. File structure (new/updated)

```text
src/lib/portal/
  store.ts            # state + persistence + actions
  seed.ts             # per-state seed data
  types.ts

src/components/portal/
  TopBar.tsx          # extracted, with bell + notifications sheet
  TabBar.tsx          # extracted, with badges
  Onboarding.tsx      # first-visit overlay
  DevSwitcher.tsx     # long-press demo panel
  Toast.tsx           # transient notifications
  home/
    StatusHero.tsx    # switches by planState
    NextDose.tsx
    CheckInBanner.tsx
    NextShipment.tsx  # (moved from current file)
    NextCharge.tsx
    MessagePreview.tsx
    ProgressSnapshot.tsx
    PausedBanner.tsx
  messages/
    Thread.tsx
    Composer.tsx
    autoReply.ts
  plan/
    MedicationCard.tsx
    DoseSchedule.tsx
    ProgressChart.tsx
    CheckInSheet.tsx
    RefillsList.tsx
  settings/
    ProfileSection.tsx
    AddressSection.tsx
    PaymentSection.tsx
    NotifPrefs.tsx
    DocumentsList.tsx

src/routes/
  login.tsx           # wire magic-link → /portal/patient
  portal.patient.tsx  # slim shell: session guard + tabs
```

Existing visual language (iOS glass cards, coral pink, semantic tokens) is preserved. No new colors, fonts, or hard borders introduced.

---

## 12. Interactions worth calling out

- **Check-in gate**: when `check_in_due`, refill card shows "Complete check-in to ship" and Track button is disabled with tooltip.
- **Refill request**: sets shipment `status: processing`, adds notification, adds charge, updates Next Charge date +28 days.
- **Message deep link** from Home → Messages: uses TanStack Router search param `?thread=doctor#msg-<id>` with scroll-into-view.
- **Weight log** entry immediately updates ProgressSnapshot number and appends to chart.
- **Sign out** clears session but keeps patient data (so re-login is instant).

---

## 13. Out of scope (explicit)

- Real auth / real magic link (simulated).
- Real payments / tracking APIs (all mock, deterministic).
- Push notifications (in-app only).
- Backend persistence (localStorage only).

---

## 14. Build order

1. Store + types + seed + session guard + login wire-up.
2. Extract TopBar / TabBar with bell + badges + notifications sheet + toast.
3. Onboarding overlay + Settings "Replay tour".
4. Home refactor into state-driven cards.
5. Messages tab (thread + composer + auto-reply).
6. My Plan tab (medication, schedule, progress, check-in, refills, pause).
7. Settings tab (all sections + sign out).
8. Dev switcher (last, so we can demo every state).  
  
  
we already have UI build so gotta work in it 

Each step ships working UI; nothing is left stubbed.