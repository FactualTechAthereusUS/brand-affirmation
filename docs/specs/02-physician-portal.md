# Physician Portal — Product Specification

Source of truth: `src/routes/portal.physician.tsx` (1687 lines), `src/routes/login.physician.tsx`, `src/lib/physician/store.ts` (596 lines). All UI components live inline in the route file — there are no separate imported component files besides static image assets (`@/assets/blissley-logo.png.asset.json`, `@/assets/dr-scott-nass.png.asset.json`).

This is a **fully client-side demo**. There is no backend, API, or real authentication. All state is held in a module-level JS object backed by `localStorage` (key `blissley.physician.v1`) and exposed to React via `useSyncExternalStore`. Nothing here is wired to a database, EHR, e-prescribing network, or real PKI signature service — it only simulates one.

---

## 1. Route map & how it's reached

| Path | File | Purpose |
|---|---|---|
| `/login/physician` | `src/routes/login.physician.tsx` | Physician sign-in screen |
| `/portal/physician` | `src/routes/portal.physician.tsx` | The portal itself (single route, tab-switched internally, no sub-routes) |

There is no route guard enforced by the router. `PhysicianPortal` (the `/portal/physician` component) auto-creates a session on mount if none exists (see Auth section) — visiting the URL directly logs you in as Dr. Nass automatically. The login page is cosmetic in this build.

Head metadata for `/portal/physician` sets `robots: noindex,nofollow`.

---

## 2. Authentication mechanism (exactly as coded)

**Type:** Simulated magic-link email flow, no password, no real link.

Flow in `login.physician.tsx`:
1. User enters "work email" in a text input (no format validation beyond HTML `type=email`, `required`).
2. On submit: `loading` is set true, the code `await`s a hard-coded `setTimeout(500ms)`, then flips to a "sent" state. No email is actually sent — there is no backend call at all.
3. The "sent" panel shows "Check your inbox — magic link sent to {email}" and a single button: **"Enter physician portal (demo)"**.
4. Clicking that button calls `physicianActions.signIn(email || "scott.nass@blissley.md")` (falls back to Dr. Nass's email if the field was left blank) and navigates to `/portal/physician`.

**Session object:** `{ email: string; loggedInAt: number } | null`, stored under `session` in the physician store, persisted to `localStorage`.

**Auto sign-in gap:** In `portal.physician.tsx`, a `useEffect` runs `if (!session) physicianActions.signIn("scott.nass@blissley.md")` — this is explicitly commented `// auto for demo`. This means **the login screen can be bypassed entirely**; navigating straight to `/portal/physician` silently logs you in. This is a known demo-only shortcut, not a real gate.

**Sign out:** `TopBar`'s account menu and the sidebar have "Sign out" controls that call `physicianActions.signOut()` (clears `session`) then navigate to `/login/physician`. Because of the auto-sign-in effect above, returning to `/portal/physician` after signing out will immediately re-authenticate as Dr. Nass.

There is no PIN, MFA, or password anywhere in the physician **login** flow. A 4-digit PIN appears later, but only as part of the **e-signature** step for approving prescriptions (see §6), not for login.

---

## 3. Overall shell layout

`PhysicianPortal` renders:
- **Sidebar** (`<aside>`, `hidden lg:block`, fixed 264px wide, sticky, full height) — desktop only.
- **TopBar** (sticky header) — license alert banner + greeting + notification bell + account menu, all viewports (content changes in mobile vs desktop mode).
- **Main content** — tab body, animated with framer-motion crossfade+slide (`AnimatePresence mode="wait"`, 0.2s).
- **BottomNav** — 5-item tab bar, mobile/tablet only (`lg:hidden`), hidden while a case is open.
- **CaseReviewSheet** — full-screen modal/sheet for reviewing one case.
- **ESignModal** — bottom sheet / centered modal for approve/reject/request-info confirmation.
- **DemoBar** — floating scenario switcher (demo tooling, see §9).
- **Toasts** — bottom-center transient notification stack.

Page bottom padding dynamically reserves 96px when the demo bar is open.

### Navigation items (Sidebar + BottomNav share the same list)
| id | label | icon | badge source |
|---|---|---|---|
| `queue` | Case queue | ClipboardList | count of cases with `status === "new"` |
| `refills` | Refills | RefreshCw | count of refills with `status === "pending"` |
| `messages` | Messages | MessageSquare | count of unread patient messages (`from === "patient" && !read`) |
| `dashboard` | Dashboard | LayoutDashboard | none |
| `profile` | Profile | User2 | none |

Sidebar also shows a Blissley logo + "MD" badge at top, and a physician mini-card (photo, "Dr. Scott Nass", "MD · 18 states") pinned to the bottom.

### Top bar
- A license-expiry alert banner (red for 7-day urgent, yellow for 30-day warning) appears above the header when `demo.license !== "none"`. Purely demo-toggle driven, not derived from actual license-expiry dates in `physician.licenseExpiry`.
- Desktop: shows "Good afternoon, Dr. Nass." + a static "Pacific · 2:14 PM" (hardcoded string, not a live clock).
- Mobile: shows logo + "Physician" chip instead.
- Bell icon (desktop only, `sm:inline-flex`) — renders but has **no `onClick` handler**: it is a **non-functional/rendered-but-not-wired control**.
- Account menu button toggles a dropdown (`menu` state) — need to inspect further; contains the sign-out action referenced above.

---

## 4. Case queue tab (`QueueTab`)

**Header:** "Case queue" eyebrow, headline text driven by count (`"You're all caught up."` when zero, else `"{n} cases waiting"`), and if there's at least one case, a subline: `"Oldest submitted {hrs}h ago · SLA target 24h"`.

**QueueStats** (top-right): three read-only stat chips pulled straight from `stats` in the store — Reviewed today, Avg/case (mm:ss), Approval rate (%). These numbers only change when a case is approved (`reviewedToday++`); avg-review-sec and approval-rate never recompute from real actions — they're static seed values (`78s`, `92%`) that don't move with usage except `reviewedToday`.

**Filters** (`QueueFilters`): three controls, all backed by `queueFilters` in the store:
- Segmented control — Product: All meds / Semaglutide / Tirzepatide.
- Segmented control — Flag: All / Flagged only / Clean only.
- Native `<select>` — State: "All states" + every unique state present in current case data.

**Case list source & derivation** (`QueueTab`'s `useMemo`):
1. Start from all cases where `status` is not `approved`/`rejected`.
2. Apply the active **Demo `queue` scenario** (see §9): `empty` → clears list; `critical` → keep only cases with a `warn`/`critical` flag, capped at 3; `heavy` → triples the list and caps at 18 (fake load-test data, duplicate IDs disambiguated by `id + submittedAt` key).
3. Apply product/flag/state filters.
4. Sort ascending by `submittedAt` (oldest first — enforces FIFO triage).

**Empty state:** friendly "Nothing waiting. Great work." card with two shortcut buttons ("Review refills", "Check messages") that just switch tabs.

**CaseCard** (one per case): shows a status pill, a flag-count badge (coral) if `flags.length > 0`, product label, patient name/age/sex/state/BMI, one-line flag summary (green-ish plain text if clean, coral if flagged), and an SLA readout on the right:
- `hrs < 12` → "on track" (neutral ink color)
- `12–24h` → "on track" but rendered in an amber tone (`sla === "warn"`)
- `> 24h` → "over" in coral

Clicking a card calls `physicianActions.openCase(c.id)`, which (a) opens the case in `ui.openCaseId`, and (b) if the case is `new`, flips it to `in_review` and stamps `openedAt = Date.now()`.

### Case statuses (`CaseStatus`)
`new` → `in_review` → (`approved` | `rejected` | `awaiting_info`). `awaiting_info` cases stay visible in the queue (filtered out only when approved/rejected) so the physician can follow up.

---

## 5. Case review sheet (`CaseReviewSheet`)

A full-viewport white overlay (`fixed inset-0 z-50`) that slides up from the bottom with a spring animation. Body scroll is locked while open (`document.body.style.overflow = "hidden"`).

**Header (`ReviewHeader`, sticky):** Back button ("Back to queue" / "Back" on mobile) that calls `physicianActions.closeCase()`; centered patient name + case ID; status pill on the right.

**Body:** a vertically stacked sequence of 8 panels inside a `max-w-3xl` column, each a `Panel` component with icon + uppercase title + optional coral "warn" tone ring:

1. **PanelSnapshot** — read-only grid: age/sex, state, height (ft/in from `heightIn`), starting weight, BMI, product requested, submitted timestamp, email.
2. **PanelFlags** — if `flags.length === 0`, shows a green "No flags. All intake responses within safe protocol." banner. Otherwise lists each `Flag` as a colored row (info = blue, warn = amber, critical = coral) with label + detail text. All flag content is static seed data per case — no live rules engine computes these from the intake answers.
3. **PanelIntake** — renders every `IntakeGroup` (Goals, Medical history, Medications & allergies, GLP-1 exposure, Contraindications, etc.) as Q/A rows in a bordered table. Purely display, seeded per case.
4. **PanelGLP1** — if patient reports no prior GLP-1 use: static note "Start at step 1 titration." If they are currently on a GLP-1: shows last injection date/units/months-on plus a blue tip about continuity-of-care dosing. Read-only.
5. **PanelRx (Prescription builder)** — the only panel with live editing controls; see §6 below for full detail.
6. **PanelNoteToPatient** — free-text `<textarea>` bound to `case.patientNote`, updated via `physicianActions.setPatientNote(caseId, text)` on every keystroke. Three "Template N" quick-insert buttons populate the field from the first 3 entries of `QUICK_REPLIES`.
7. **PanelInternalNote** — free-text `<textarea>` bound to `case.internalNote` via `physicianActions.setInternalNote`. Explicitly labeled "audit only" / not shown to patient. No corresponding UI ever surfaces this text elsewhere (it exists purely for the physician's own record within this demo).
8. **PanelAudit** — synthesized timeline of events: "Submitted by patient" (always), "Opened by Dr. Nass" (if `openedAt` set), plus a status-dependent final entry ("Approved & signed" / "Info requested from patient" / "Rejected — {reason}") **stamped with `Date.now()` at render time** rather than the actual time the action occurred — i.e., this audit entry's timestamp is illustrative only and will re-render as "now" every time the panel is viewed, not a true event log persisted at action time.

**Action bar (`ReviewActionBar`, sticky bottom):** shows "Signing as Dr. Scott Nass, MD · NPI 1568588839" (desktop only) plus three buttons:
- **Request info** → opens e-sign modal in `info` mode.
- **Reject** (coral outline) → opens e-sign modal in `reject` mode.
- **Approve & sign** (solid ink) → opens e-sign modal in `approve` mode.

All three call `physicianActions.openESign(action)`, which just sets `ui.esignOpen = true` and `ui.esignAction`.

---

## 6. Prescription builder (inside PanelRx)

Live-editable fields, all persisted immediately via `physicianActions.updateRx(caseId, patch)`:

- **Rx preview card** — gradient navy card showing drug name, strength/dose/frequency, and refill-count chip; updates live as fields change below it.
- **Strength** — chip group: `2mg/mL, 5mg/mL, 10mg/mL, 15mg/mL` (not filtered by drug — a semaglutide case can technically be set to a tirzepatide-only strength like 15mg/mL; there's no cross-validation).
- **Dose** — chip group (pink accent): `0.25mg, 0.5mg, 1.0mg, 2.5mg, 5mg, 7.5mg, 10mg` — again a single shared list regardless of product, so invalid dose/strength/product combinations are possible to select.
- **Refills** — chip group: `0, 1, 2, 3`.
- **SIG (patient instructions)** — free-text `<textarea>` with a live character counter, plus three "+ Insert administration / titration / storage" buttons that overwrite the whole field with a canned sentence (they replace, not append, despite the "+" affordance implying insertion — a minor UX inconsistency worth flagging).
- **Pharmacy selector** — a fixed pharmacy info card (name + city/state, "Verified" badge) with 5 chip options: Wells RX (Dallas TX), Epiq Scripts (Plano TX), Main Southend Compounding (Charlotte NC), Truemeds RX (Phoenix AZ), Striker RX (Tampa FL). Clicking one sets `rx.pharmacy` to `"{name}·\n{loc}"`. This is a static list, not looked up by patient location/insurance/formulary.

None of these Rx edits validate against the patient's state licensure, allergies, or drug-drug interactions — it is a free-form builder.

---

## 7. E-signature flow (`ESignModal`)

Triggered from the review action bar. Renders as a bottom sheet (mobile) / centered modal (desktop), always shows patient name + state, and branches by `esignAction`:

- **approve**
  - Shows drug/dose/refills summary.
  - Requires a **4-digit numeric PIN** input (masked, `type="password"`, digits only via regex strip). Demo PIN is **hard-coded and disclosed in the UI**: "Demo PIN: 1234 · 21 CFR Part 11 compliant" — the label implies real regulatory compliance but there is no actual verification: the button only checks `pin.length === 4`, i.e. **any 4 digits work**, not specifically `1234`. This is a cosmetic security theater flag.
  - CTA "Sign with PIN" disabled until 4 digits entered. On confirm: `physicianActions.confirmApprove(caseId)` — sets case status to `approved`, closes the case sheet and modal, increments `stats.reviewedToday`, and shows a success toast: **"Rx signed · transmitted to South End"** (hard-coded pharmacy name in the toast regardless of which pharmacy chip was actually selected — a data/UI mismatch worth flagging as a gap).
- **reject**
  - Shows a `<select>` of reject reasons from `REJECT_REASONS` (7 canned options: BMI criteria, contraindication, pregnancy/TTC, medication interaction, incomplete history, not licensed in state, other clinical concern).
  - CTA "Confirm rejection" → `physicianActions.reject(caseId, reason)` — sets status `rejected`, stores `rejectReason`, closes everything, shows warn toast "Case rejected · reason logged".
- **info**
  - No extra input beyond what's already in the Note to Patient panel.
  - CTA "Send request" → `physicianActions.requestInfo(caseId)` — sets status `awaiting_info`, closes everything, shows info toast "Info request sent to patient portal".

Nothing here transmits to any real pharmacy, EHR, or e-signature vendor — it's simulated entirely in local state.

---

## 8. Refills tab (`RefillsTab`)

**Header:** "{n} refills to approve" + explanatory subline; a "Approve all clean" button (disabled when nothing pending) that loops every currently-pending refill and calls `physicianActions.approveRefill(r.id)` for each — including flagged ones, despite the label implying it only approves "clean" ones. **This is a bug/gap**: the button does not actually filter by `flagged === false` before bulk-approving.

**Demo `refill` scenario filter** (see §9) changes which refills are shown:
- `clean` → only non-flagged refills.
- `new-med` → the specific seeded "new-med" refill plus all non-flagged ones.
- `regain` → the specific seeded "regain" refill plus all non-flagged ones.
- default (no filter applied beyond `status === "pending"`).

**RefillCard** per refill:
- Header: patient name + state, weight-delta-since-start on the right (green if lost more than 5 lbs).
- 4 mini stat tiles: Current weight, Last injection date, Side effects (None / Mild nausea / Other — colored), New meds (Yes⚠ / None — colored).
- Expand/collapse ("See/Hide check-in details") reveals side-effect detail text, new-medication text, other notes, submission timestamp, and — if `monthNumber >= 3` — a blue "90-day review point" reminder banner.
- Flagged refills auto-expand on first render (`useState(r.flagged)`).
- Actions: if flagged, a "Message patient" button just switches to the Messages tab (does **not** deep-link to that specific patient's thread — another minor gap, it's a blunt tab switch, not a targeted navigation). "Approve refill" button calls `physicianActions.approveRefill(r.id)`, which sets `status: "approved"` and shows success toast "Refill approved · shipping released". Approved refills disappear from the list (list only shows `status === "pending"`).

No actual "release shipping" happens — it's just a status flip and a toast.

---

## 9. Messages tab (`MessagesTab`)

Two-pane conceptually but rendered as a stack-navigation (list ↔ thread), driven by `ui.activeThreadId`.

**Thread list:** sorted by `lastActivity` descending. The Demo `messages` scenario (`unread` vs `clear`) filters to hide threads with no unread patient messages when set to `clear`. Each `ThreadCard` shows patient avatar (deterministic pastel color from initials), name, unread-count badge, product/month/dose subline, last message preview (bold if unread), relative time, and — if `waitingHours > 12` — an amber "Waiting {n}h" chip.

Clicking a thread calls `physicianActions.openThread(id)`, which sets `activeThreadId` and marks all that thread's patient-originated messages `read: true`.

**Chat view (`ChatThread`):**
- Sticky glassy header: back button, centered patient name + product code chip (SEMA/TIRZ), and a "Templates" (Sparkles) button toggling `ui.quickRepliesOpen`.
- Above the message list: large avatar, name, and a subline with product/month/dose/allergies.
- Messages rendered as chat bubbles — outgoing ("me") right-aligned dark gradient bubbles with a checkmark+timestamp; incoming ("patient") left-aligned tan bubbles with avatar+timestamp. Auto-scrolls to bottom on new message.
- **Quick reply drawer:** shows all of `QUICK_REPLIES` (5 canned clinical response templates about nausea, dose increases, uncommon side effects, refill cadence, dose continuation). Clicking one fills the composer draft and focuses it.
- **Composer:** auto-growing textarea, Enter-to-send (Shift+Enter for newline), disabled Send button until non-empty. Sending calls `physicianActions.sendMessage(threadId, text)`, which appends a `from: "me"` message, updates the thread's `lastActivity`/`waitingHours: 0`, and shows a success toast "Message sent". **There is no simulated auto-reply from the patient** in the physician portal (contrast with the patient portal, which does simulate replies) — sending a message here is one-directional; new "patient" messages only ever come from the fixed seed data.
- Footer disclaimer: "Signing as Dr. Scott Nass, MD · NPI 1568588839 · For emergencies patients call 911" (static, always visible).

---

## 10. Dashboard tab (`DashboardTab`)

Read-only analytics view, no interactive controls beyond navigation. Shows:
- 4 `BigStat` tiles: New cases waiting (coral tone), Pending refills, Unread messages, "Approvals this week" (computed as `approvedCasesCount + stats.reviewedToday` — a slightly odd double-counting formula since `reviewedToday` already includes approvals from earlier in the session; this is a display quirk, not a real weekly aggregate).
- "Review speed" card: avg review time plus a static hard-coded "↓ 12s vs last week" delta (not computed from any historical data — decorative).
- "Approval rate" card: percentage plus a progress bar and a static "Peer avg 89%" comparison (also hard-coded, not derived from any peer dataset).
- "Licenses" card: chips for every state in `physician.licensedStates` (18 states in seed data).

---

## 11. Profile tab (`ProfileTab`)

- Physician headshot, name, credentials, NPI, DEA — read-only, straight from the `physician` object in the store.
- **State licenses table** — first 8 licensed states, each row shows state code, expiry date (or "—" if not in `licenseExpiry` map — most of the 18 states have no expiry entry seeded, so most rows show "—"), and a status pill computed from days-until-expiry (`<30d` = coral "Xd left", `<90d` = amber "Active" — note the `<90` branch is mislabeled as generic "Active" rather than a warning state, and `>=90` also shows green "Active" — so both amber and green thresholds render the identical "Active" text, another minor display inconsistency).
- **Preferences panel** — 3 `ToggleRow` controls: "Auto-approve clean refills", "Push notification for new cases", "Weekly performance email". **These toggles are local component state only (`useState` inside `ToggleRow`, not the physician store)** — they visually flip but have zero effect on any other part of the app (auto-approve doesn't actually auto-approve anything) and do not persist across reload. This is an explicit **rendered-but-not-wired gap**.

---

## 12. Demo tooling (`DemoBar`) — explicitly demo-only

A floating "Demo" pill (bottom-right) expands into a bottom bar exposing four scenario selectors that mutate `state.demo`:
- **Queue**: Normal / Empty / Heavy / Critical only — reshapes the case queue as described in §4.
- **Refills**: Clean / New med / Regain — reshapes the refills list as described in §8.
- **Messages**: With unread / Inbox zero — filters the thread list.
- **License**: OK / 30d warn / 7d urgent — toggles the top-of-page license alert banner (not derived from real license-expiry math).

Also has "Reset data" (calls `physicianActions.resetAll()`, which re-seeds the entire store and persists it) and a close (X) button that just collapses the bar back to the floating pill (`toggleDemoBar`). This entire component is demo/QA scaffolding, not a physician-facing feature, and should be flagged as such if productizing this app.

---

## 13. Toast system

Bottom-center transient toast stack (`Toasts`), 3 kinds: `success` (ink pill, check icon), `warn` (coral pill, alert-triangle icon), `info` (white pill, info icon). Toasts auto-dismiss after 3.5s. Triggered by: approve (`success`), reject (`warn`), request-info (`info`), refill approve (`success`), send message (`success`).

---

## 14. Responsive behavior summary

| Breakpoint | Nav | Case sheet | Chat | Notes |
|---|---|---|---|---|
| Mobile (`<lg`, i.e. <1024px) | BottomNav (fixed, 5 icons + badges), hidden while a case is open | Full-screen sheet, back arrow labeled "Back" | Full height minus header/bottomnav (`calc(100vh - 3.5rem - 4rem)`) | TopBar shows compact logo+"Physician" chip |
| Desktop (`≥lg`) | Sticky 264px sidebar with labels + physician mini-card | Same full-screen sheet (not modal-in-page), back arrow labeled "Back to queue" | Full height minus header only (`calc(100vh - 3.5rem)`) | TopBar shows greeting + fake clock; sidebar replaces bottom nav entirely |

Grids inside Dashboard/Profile use `sm:grid-cols-2 lg:grid-cols-4` and `lg:grid-cols-[280px_1fr]` patterns to progressively add columns. Filters and chip groups wrap via flexbox at all sizes rather than changing layout structurally.

---

## 15. Known gaps / demo-only items (explicit call-outs)

1. **Login is bypassable** — visiting `/portal/physician` directly auto-authenticates as Dr. Nass regardless of the login screen.
2. **Magic link is fake** — no email is sent; a 500ms `setTimeout` simulates latency, then a manual "Enter portal" button is required (no real link-click flow, no token verification).
3. **PIN is not actually checked** — the "Demo PIN: 1234" label is discoverable in-UI but the code only validates `pin.length === 4`; any 4 digits authorize the signature.
4. **Notification bell in TopBar has no click handler** — purely decorative, no dropdown/panel opens.
5. **"Approve all clean" bulk-approves flagged refills too** — it does not filter by `flagged === false` despite its label.
6. **"Message patient" from a flagged refill card just switches tabs** — it does not open that specific patient's thread.
7. **Toast after approval always says "transmitted to South End"** regardless of the pharmacy chip actually selected in the Rx builder.
8. **Audit trail timestamps for approve/reject/info actions use `Date.now()` at render time**, not the time the action actually occurred, so they visibly drift/change if the panel is reopened later.
9. **Profile preferences toggles (auto-approve, push notifications, weekly email) are local component state, not store-backed** — they have no effect anywhere else and reset on reload. Auto-approve does not auto-approve anything.
10. **Dashboard "↓ 12s vs last week" and "Peer avg 89%" are hard-coded decorative strings**, not computed from any data.
11. **Rx strength/dose chip lists are shared across both products** (semaglutide and tirzepatide) with no cross-validation, so mismatched combinations (e.g., a tirzepatide-only strength on a semaglutide case) can be selected without warning.
12. **Clinical flags are static per-case seed data**, not computed by any rules engine reacting to intake answers — editing intake data (there is no such editor) would not update flags.
13. **License expiry alert banner is driven purely by the Demo bar's manual toggle**, not by actually comparing `physician.licenseExpiry` dates to today.
14. **Physician portal messages are one-directional from the physician's UI** — sending a message does not trigger a simulated patient reply (unlike the patient portal's `simulateReply`).
15. All data resets are local-only (`localStorage`); there is no multi-user, multi-device, or server persistence — refreshing in a different browser/profile starts from the seed data again.
