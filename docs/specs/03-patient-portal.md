# Patient Portal — Product Specification

Source: `src/routes/portal.patient.tsx` (2126 lines), `src/routes/login.tsx`, `src/lib/portal/store.ts` (359 lines), `src/components/PayIcons` (card-brand SVG icons only). All tab UIs are defined inline in the route file; there are no separate feature components to import beyond the payment-brand icons and static image assets.

Like the physician portal, this is a **fully client-side demo**: state lives in a module-level object persisted to `localStorage` (`blissley.portal.v1`) via `useSyncExternalStore`. No backend, no real payments, no real e-signature, no real shipping/carrier integration.

---

## 1. Route map & how it's reached

| Path | File | Purpose |
|---|---|---|
| `/login` | `src/routes/login.tsx` | Patient sign-in |
| `/portal/patient` | `src/routes/portal.patient.tsx` | The portal (single route, internal tab state) |

Unlike the physician portal, `/portal/patient` **does enforce a redirect**: a `useEffect` checks `if (hydrated && !session) navigate({ to: "/login" })`, so visiting the portal directly without a session bounces to `/login`. There is no auto-login shortcut here (contrast with the physician portal's demo auto-signin).

---

## 2. Authentication mechanism

**Type:** Simulated magic-link, identical UX pattern to the physician login.

1. Enter email → submit → `loading=true` → hard-coded 500ms `setTimeout` → "sent" panel: "Check your inbox — magic link sent to {email}".
2. Button "Enter portal (demo)" calls `patientActions.signIn(email)` (uses whatever the user typed, empty string allowed — no fallback default, unlike physician login) and navigates to `/portal/patient`.
3. Session: `{ email, loggedInAt } | null`, persisted to `localStorage`.
4. Sign-out: Settings tab and SideNav both expose "Log out" → `actions.signOut()` then `navigate({ to: "/login" })`.

No password, PIN, or MFA anywhere in the patient flow. Footer copy claims "HIPAA-secure sign in" — cosmetic only, no actual security mechanism beyond the fake magic link.

---

## 3. Overall shell layout

`PatientPortal` shows a `Loader2` spinner full-screen until `hydrateFromStorage()` completes and a session exists. Once ready, renders a shell that adapts across breakpoints:

- **Mobile** (`<md`): phone-shell simulation — content constrained to `max-w-[440px]`, white background, with `TopBar` (glassy sticky header with logo + notification bell, long-press-to-open dev tools) and a floating pill-shaped `TabBar` at the bottom (Home / Messages / My Plan / Settings, glass/blur styling, active tab has an animated pink pill background via `layoutId="tabpill"`).
- **Tablet** (`md`): wider centered shell, same TopBar/TabBar pattern but content grids expand (`md:grid-cols-2` etc. throughout tabs).
- **Desktop** (`lg`): a persistent **SideNav** (260px, sticky, blurred white) replaces TopBar/TabBar; a `DesktopHeader` shows the tab title + a notification bell. `flex-row` becomes the outer layout.

Global overlays mounted at the root, regardless of tab: `Onboarding` (shown until `prefs.onboardingComplete`), `NotificationsSheet`, `DevSwitcher`, `TrackingModal`, `ReceiptModal`, `DocumentsSheet`, `PlanModalRoot`, `Toaster`.

**Auto-progression simulation:** a `useEffect` watches `planState` and auto-advances the demo narrative without any user action:
- `pending_review` → after 20s → `approved_preparing`
- `approved_preparing` → after 22s → `shipped`

No further auto-advance beyond `shipped` — reaching `delivered_active`, `check_in_due`, etc. requires either the Dev Switcher or completing a check-in/refill flow.

### Navigation items (SideNav + TabBar share the same list)
| id | label | icon | badge |
|---|---|---|---|
| `home` | Home | HomeIcon | none |
| `messages` | Messages | MessageCircle | unread count where `thread` message `from === "them" && !read` |
| `plan` | My Plan | Package | none |
| `settings` | Settings | SettingsIcon | none |

A long-press (600ms `pointerDown`) on the Blissley logo (in TopBar or SideNav) opens the **DevSwitcher** — hidden demo tooling (see §9).

---

## 4. Home tab (`HomeTab`)

Composed of a hero image + a vertically stacked deck of state-dependent `MotionCard`s (framer-motion `AnimatePresence`, cards animate in/out as `planState` changes), all read from the store:

- **Greeting header** (mobile only, `lg:hidden`): time-of-day greeting (`greeting()` computed from `new Date().getHours()`) + `firstName`, plus a state-dependent subline (`planStateSubline`).
- **Hero banner**: full-bleed image (`heroSkyWoman`) with a state-dependent overlay headline (`heroLine`) — e.g. "You're in trusted hands." during pending review, "One quick step to keep going." during check-in-due, else "Your program is on track".
- **State-driven cards**, shown conditionally based on `planState`:
  - `paused` → Pause card with days-remaining + "Resume program" button (`actions.resumePlan()`).
  - `pending_review` → `PendingApproval` card: spinning loader, "Physician Review In Progress", SLA copy ("Expected within 24 hours", "Priority patients: within 6 hrs" — both static claims, not computed).
  - `approved_preparing` / `shipped` / `delivered_active` / `refill_processing` → "Prescription Approved" card with state-specific subtext and a "Signed by Dr. Scott Nass MD" badge line.
  - `check_in_due` → coral-accented card: "Check-in required" → button routes to Plan tab and opens the check-in modal (`onGoto("plan"); actions.openPlanModal("checkin")`).
  - **Next Dose card** (shown for `delivered_active` / `check_in_due` / `refill_processing`): weekday + fixed "8:00 AM" time, dose+cadence, and a countdown pill (`doseCountdown` — "Today"/"Tomorrow"/"In N days" computed from `medication.nextDoseAt`).
  - **Next Shipment card** (all states except `paused`): ship date, product image, tracking number (last 8 chars), and a "Track" button opening `TrackingModal` via `actions.openTracking(shipment.id)`. The Track button is **disabled while `planState === "check_in_due"`**, with a copy hint "Complete your check-in to release this shipment."
  - **Message preview card** — only rendered if there's an unread physician ("doc" thread) message; tapping routes to Messages tab.
  - **Progress snapshot card** (same 3 states as Next Dose): weight-loss total (`start - current` from `weightLog`) plus an interactive `WeightChart` (see §7) and a "Log weight" shortcut opening the weight-log modal.
  - **Next Charge card** (all states except `paused`, coral-accented): amount + date, a randomly-chosen (once per session) saved card brand/last-4 (`SAVED_CARD`, chosen via `Math.random()` at module load — **this is not the patient's actual persisted `patient.card` value from Settings**, so the Home card and Settings/PlanTab may show different last-4 digits — flagged as a data-consistency gap), and a "Manage plan" button to the Plan tab.
  - **Physician strip card** (always shown): Dr. Nass photo/name/credentials + a "Message" shortcut to the Messages tab.
- Footer line: "You're on month {medication.monthNumber} of your program."

---

## 5. Messages tab (`MessagesTab`)

Two threads, both hard-coded (not dynamic per physician/care-rep assignment):
- **Care Team** thread (`thread: "care"`) — icon: Blissley logo, subtitle "Billing, shipping, general questions", status "Sarah · online now" (static claim, not a real presence system).
- **Dr. Scott Nass MD** thread (`thread: "doc"`) — icon: physician photo, subtitle "Clinical questions · side effects · dosing", status "Typically replies within 24 hrs".

List view shows unread badges and message previews per thread (`ThreadCard`). Opening a thread calls `actions.markThreadRead(thread)`, marking all messages in that thread read.

**ChatThread** (`kind: "care" | "doc"`): same bubble-chat visual pattern as the physician portal (outgoing = dark/pink gradient bubble right-aligned; incoming = tan bubble left-aligned with avatar). Sending a message:
1. Appends immediately as `from: "me"`.
2. `setTyping(true)` shows an animated "..." typing indicator bubble for a fixed 2.2s.
3. After 2.2s, `actions.simulateReply(thread, userText)` fires — a **keyword-matched canned-response generator**, not an LLM or real physician:
   - Doc thread: matches `/nause|sick|vomit/` → nausea guidance; `/dose|inject|shot/` → "stick with current dose" copy; `/refill|reorder/` → refill-cadence copy; `/thank|thanks/` → "Anytime, Sarah."; else → generic "I'll review and get back to you within 24 hours."
   - Care thread: matches `/address|ship/`, `/bill|charge|payment/`, `/thank|thanks/`, else generic "the care team will follow up".
4. The simulated reply also creates a **notification** (`kind: "message"`) which surfaces in the NotificationsSheet and briefly as a toast via `Toaster`.

For the physician ("doc") thread only, the composer footer shows "For emergencies call 911 · This is not emergency care".

---

## 6. Plan tab (`PlanTab`)

Sections, top to bottom, each wrapped in a `Section` (uppercase title, no chrome):

1. **Plan summary card** (gradient background): plan name, price/cadence, 3 mini-stats (Active since, Current dose, Program month). Shows a paused/cancelled banner if applicable.
2. **Check-in CTA banner** (only if `planState === "check_in_due"`): pink gradient card, "Two minutes. Unlocks your next refill." → "Start check-in" opens `CheckInFlow` modal.
3. **Progress section**: total lbs lost since first `weightLog` entry, `WeightChart` (interactive SVG, see §7), and a "Log weight" button opening `WeightLogFlow`.
4. **Dose Schedule section**: a static 4-week grid (`wk 1–4`) — weeks 1–2 hard-coded "done" (green, checkmark image), week 3 hard-coded "upcoming" (pink ring, Activity icon), week 4 blank. **This is not derived from `medication.nextDoseAt` or any real dose-tracking data** — it is a fixed illustrative pattern regardless of actual program month.
5. **Order History section**: lists shipments (`shipments.slice(0,3)` collapsed, "View all" expands to all 4 seeded shipments), each row opens `TrackingModal`. If `planState === "delivered_active"`, shows "Request early refill" button opening `RefillFlow`.
6. **Manage section**: 5 rows — Pause my program (or "Resume" if already paused) → `PauseFlow`; Switch plan → `SwitchFlow`; Update payment method → `PaymentFlow`; Update shipping address → inline address form; Cancel my program (destructive/coral) → `CancelFlow`.
7. **Billing History section**: charges list (first 3, expandable), paid charges are clickable → `ReceiptModal`; upcoming charges are disabled/non-clickable.

### Plan modals (`PlanModal`, routed by `ui.planModal` string)
- **pause** — 3 duration chips (30/60/90 days) → `actions.pausePlan(days)` sets `pauseDays` + `planState: "paused"`, fires a notification.
- **cancel** — confirmation dialog; "Cancel anyway" → `actions.cancelPlan()` sets `cancelled: true`, `planState: "paused"` (note: cancel reuses the paused state rather than a distinct `cancelled` plan state, which is why the UI has to separately check the `cancelled` boolean flag to distinguish the two conditions).
- **switch** — 3 plan cards (Monthly $299, 3-Month $237 marked "current", 6-Month $199) — **selecting any option just closes the modal (`onClick={onClose}`) — no store action is ever called.** This is a clear **rendered-but-not-wired gap**: switching plans has no effect on `plan.name`/`plan.price` anywhere in the app.
- **payment** — `PaymentFlow`: card number/expiry/CVC/name fields with input formatting (auto space-grouping, MM/YY slash) and client-side validation (`last4.length===4 && exp.length===5 && cvc>=3 && name>1`). Valid submit calls `actions.updateCard(last4)`, storing only the last4 digits in `patient.card` — no real payment processor call.
- **address** — inline address fields; "Save" button is just `onClick={onClose}` — **does not call any store action**, so address edits here are never persisted. Another rendered-but-not-wired gap (contrast with Settings tab's own address fields, which also don't save — see §8).
- **checkin** — `CheckInFlow`, a 4-step wizard (progress bar): (1) current weight numeric input, (2) side-effects 1–5 scale, (3) mood 1–5 scale, (4) optional free-text notes. Final submit calls `actions.submitCheckIn({weight, sideEffects, mood, notes})`, which appends to `checkIns`, calls `actions.logWeight(weight)` (adds a new `weightLog` point dated today), transitions `planState` to `refill_processing`, and fires a notification "Check-in submitted... refill being prepared."
- **weight** — `WeightLogFlow`, single numeric input → `actions.logWeight(lbs)`.
- **refill** — `RefillFlow`, informational copy + "Confirm refill" → `actions.requestRefill()` sets `planState: "refill_processing"` and fires a shipment notification.

---

## 7. Charts / weight tracking (data source & formulas)

- **Data source**: `weightLog: {date, ts, lbs}[]`, seeded with 7 hand-authored points from ~90 days ago to "2 days ago" (Apr 1 → Jul 1, values 194→187.8 lbs with a small mid-series dip/regain baked into the seed). New entries are appended by `logWeight()` (from manual weight-log, or automatically from check-in submission) with `date` formatted via `toLocaleDateString` and `ts = Date.now()`.
- **"lbs lost" figure** = `startWeight (first entry) − currentWeight (last entry)`, floored at 0 via `Math.max(0, ...)`. This is a simple first-vs-last calculation, not a rolling average or trend regression — a single new bad entry could distort the headline number.
- **`WeightChart`** (used in both Home and Plan tabs): a hand-rolled responsive SVG line/area chart with `ResizeObserver`-driven width, gradient area fill, animated path draw-in, pointer-driven crosshair + tooltip showing the nearest data point's date/weight, and static first/last x-axis date labels. Requires at least 2 data points; shows a "Log more entries to see your trend" fallback otherwise.
- **`MiniSparkline`** — a smaller, non-interactive variant used nowhere directly referenced in the excerpted flow beyond being defined (kept for potential reuse); not interactive, no tooltip.
- **Dose Schedule "week" grid** is **not** derived from the weight/dose data at all (see §6 point 4) — flagged again here because it visually resembles a data-driven progress tracker but is a static illustration.

---

## 8. Settings tab (`SettingsTab`)

- **Personal Info** — First/last name, Email (disabled, "Contact support to change"), Phone, DOB (disabled) fields. **"Save changes" button has no `onClick` handler at all** — it is purely decorative; none of these fields ever persist to the store. Explicit rendered-but-not-wired gap.
- **Shipping Address** — Address1/City/State/ZIP fields, same **non-functional "Save changes" button**.
- **Notifications** — 5 toggles, all correctly wired to `actions.toggleNotifPref(key, value)` and persisted: Shipment updates, New messages, Check-in reminders, Email, SMS. (Unlike the two sections above, this section actually works.)
- **Documents** — 4 rows (Prescription PDF, Lab results, Invoice history, HIPAA notice), each opens `DocumentsSheet` with `actions.openDocuments(view)`:
  - *Prescription*: read-only mock Rx summary — drug, dose, cadence, and a **prescriber name inconsistency**: shows "Dr. Ashley Nass, MD · NPI 1234567890" here, whereas the rest of the app consistently refers to "Dr. Scott Nass" with NPI 1568588839/1043694656 elsewhere — a data mismatch worth flagging.
  - *Labs*: static "No labs on file yet" message.
  - *Invoices*: lists all charges; paid ones link to `ReceiptModal`.
  - *HIPAA*: static boilerplate notice text.
- **Account** — "Replay welcome tour" (sets `onboardingComplete: false`, re-triggering the `Onboarding` overlay) and "Log out" (works as described in §2). Footer: Terms/Privacy links (point to `/terms`, `/privacy` — routes not verified as part of this scope) and a static version string "v1.0.0".

---

## 9. Notifications, tracking, receipts, and dev tools

- **NotificationsSheet**: lists all `notifications` (newest first), each showing kind-specific icon, title, body, relative time, and an unread dot. Tapping marks it read and deep-links to the associated tab (`deepLink` field: `messages`/`plan`/`home`). "Mark all read" bulk-clears unread state.
- **Toaster**: shows the most recent unread notification created within the last 5 seconds as a floating bottom toast (auto-dismiss after 3.2s) — effectively a "just happened" live-update indicator layered on top of the Notifications sheet.
- **TrackingModal**: shows carrier (hard-coded "UPS Ground"), tracking number (with copy-to-clipboard), and a 5-step progress list (Order placed → Preparing → Shipped → Out for delivery → Delivered) where current step index is derived crudely from shipment status (`delivered`→4, `shipped`→2, else→1 — note there's no explicit index for "Out for delivery", so that step is only ever shown as a future/undone step, never as "current").
- **ReceiptModal**: read-only receipt summary for a paid charge — amount, date, masked card.
- **DocumentsSheet**: see §8.
- **DevSwitcher** (opened via long-press on logo): lets QA/demo users force `planState` directly to any of the 7 states, trigger a fake incoming message reply (`actions.triggerMessage()` → calls `simulateReply("doc", "check in")`), trigger a fake shipment-update notification, or fully reset all demo data (`actions.resetAll()`). This is explicitly demo/internal tooling, not a patient-facing feature.
- **Onboarding**: a 4-step full-screen modal carousel shown on first visit (`prefs.onboardingComplete === false`), covering welcome, meet-the-physician, how-the-plan-works, and notification preferences; final step's "Get started" calls `actions.completeOnboarding()`. Can be replayed from Settings.

---

## 10. Responsive behavior summary

| Breakpoint | Nav | Layout | Notes |
|---|---|---|---|
| Mobile (`<md`) | Bottom pill `TabBar`, glassy `TopBar` | Single column, `max-w-[440px]` phone-shell frame | Onboarding, sheets, and modals slide up from bottom |
| Tablet (`md`) | Same TopBar/TabBar | Content sections switch to `md:grid-cols-2`; shell no longer capped at 440px | Settings/Plan sections lay out as 2-column card grids |
| Desktop (`lg`) | Persistent left `SideNav` (260px) + `DesktopHeader` (title + bell) replaces TopBar/TabBar | `lg:flex-row` outer container; content max-widths widen (`lg:max-w-6xl` on Home, `lg:max-w-4xl` on Messages/Settings) | Modals switch from bottom-sheet (`place-items-end`) to centered dialogs (`lg:place-items-center`) |

---

## 11. Known gaps / demo-only items (explicit call-outs)

1. **"Switch plan" modal never calls a store action** — clicking any plan option just closes the modal; `plan.name`/`plan.price` never change.
2. **"Update shipping address" (both in the Plan-tab modal and in Settings) never persists** — the Save buttons are unwired (`onClick={onClose}` in the modal; no handler at all in Settings).
3. **Settings → Personal Info "Save changes" button has no handler** — name/phone edits are never saved.
4. **Home tab's "Next Charge" card shows a randomly-chosen card brand/last-4 picked once per session (`Math.random()`)**, which can visibly differ from the actual `patient.card` value shown in Settings/Receipts after a real card update via Payment Flow — a data-consistency gap.
5. **Prescription document viewer shows a different physician name/NPI** ("Dr. Ashley Nass" / NPI 1234567890) than the rest of the app ("Dr. Scott Nass" / NPI 1568588839 or 1043694656 elsewhere) — data mismatch.
6. **Dose Schedule grid (Plan tab) is static/illustrative** — weeks 1–2 always "done", week 3 always "upcoming" — not derived from `medication.nextDoseAt`, `monthNumber`, or check-in history.
7. **Cancel flow reuses the `paused` plan state** rather than a distinct cancelled state, requiring the UI to separately track a `cancelled` boolean to differentiate messaging.
8. **Tracking modal's step index has no distinct "Out for delivery" state** — that step never becomes "current," only ever rendered as future/undone or skipped straight to delivered.
9. **Physician/care-team replies are keyword-matched canned responses (`simulateReply`)**, not a real messaging backend or AI — matching is a simple regex over the user's message text with generic fallbacks.
10. **`MiniSparkline` component is defined but its actual usage/entry point was not confirmed to appear in the rendered UI paths reviewed** — likely vestigial or used in a code path not exercised in the sections read; verify before relying on it if referenced elsewhere.
11. Weight-loss headline number is a naive first-vs-last subtraction, not a smoothed or validated trend — a single erroneous manual weight-log entry will directly change the displayed "lbs lost" figure.
12. Auto plan-state progression (pending → approved → shipped) is purely time-based (`setTimeout`), not tied to any real physician action or shipping event, and only fires while the tab remains mounted continuously (a refresh restarts the relevant timers from the currently-loaded `planState`, so a user could get stuck mid-transition if they navigate away and back at the wrong moment, though the timers are re-armed via the `useEffect` dependency on `[hydrated, planState]`).
13. All data resets are `localStorage`-only; no server persistence, no multi-device sync, no true account system.
