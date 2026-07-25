## Goal

Turn `/admin/physician-queue` and `/admin/check-ins` into working clinical workspaces with real detail pages and every button wired to the store (mutates state → persists in localStorage → fires a toast). No new backend — everything writes through `adminActions` in `src/lib/admin/store.ts`, same pattern already used for orders/patients.

## Current state (verified from source)

**Physician queue (`src/routes/admin.physician-queue.tsx`)**
- Renders master/detail *in one page*. No `/admin/physician-queue/$id` route exists.
- Tabs: new / flagged / awaitingReply / refill / approved. No "denied" tab, no metrics strip, no search, no wait-time coloring, no refills sub-columns.
- `PhysicianCase` type is minimal: no age, sex, BMI, plan, state, checklist answers, dose history, prescription draft, patient-facing note.
- Only two actions in store: `approveCase(id)` and `denyCase(id, reason)`. There is no request-info flow, no reassign, no priority toggle, no e-sign, no timeline event on the patient/order, no "awaiting reply → back to new when patient replies".
- The "Note to patient" textarea in `CaseDetail` is captured in local state and thrown away on approve.

**Check-ins (`src/routes/admin.check-ins.tsx`)**
- One flat list. Tabs derive purely from `day` + `decision` (no submitted-review bucket, no completed-with-decision bucket, no 6-month refresh bucket).
- `CheckIn` type has no answers, no history, no dose, no program, no next billing, no reminderSentAt, no physician assignment, no decisionAt.
- Only button: "Nudge" → `sendCheckInReminder(id)` which just sets a `reminderSentAt` timestamp. No approve refill, no protocol adjustment, no hold, no message-before-decide, no detail page at all.

**Not wired anywhere:** case detail deep-link from notifications/queue strip already points at `/admin/physician-queue?tab=...` but never opens a specific case; `PhysicianQueueStrip` counts include `checkinsOverdue` but clicking a row on check-ins page has no navigation.

## Plan

### 1. Extend types + seeds (`src/lib/admin/store.ts`, `src/lib/admin/seeds.ts`)

Grow `PhysicianCase` with the fields the spec calls for (all optional so existing seeds still validate):

```
age, sex, bmi, height, weight, state, plan, planPrice,
priorityPaid: boolean,
checklist: { key: string; label: string; status: "ok" | "soft" | "hard" }[],
intake: { group: string; items: { q: string; a: string; tone?: "ok"|"soft"|"hard" }[] }[],
priorGlp?: { drug, lastDoseMg, lastInjectionAt, monthsOn, rxPhotoUrl },
rxDraft: { drug, sig, qty, daysSupply, refills, pharmacyId, npi, dea },
patientNote?: string, internalNote?: string,
decisionAt?: number, decidedBy?: string,
timeline: { at: number; kind: "submitted"|"assigned"|"approved"|"denied"|"info_requested"|"reply_received"|"reassigned"|"priority_set"; by?: string; detail?: string }[]
```

Grow `CheckIn`:

```
kind: "day90" | "sixMonth",
program: string, dose: string,
monthOfCycle: number, cycleLength: 3 | 6,
nextBillingAt: number, nextBillingAmt: number,
reminderSentAt?: number, reminderCount: number,
attemptCount: number, lastContactAt?: number,
answers: { q: string; a: string }[],       // Q1..Q8 from spec
prevWeight?: number, startWeight?: number, // for chart
sideEffectsHistory: { month: number; note: string }[],
priorNotes: { at: number; by: string; text: string }[],
refillDraft: { drug, sig, qty, daysSupply, pharmacyId },
decision: "clear" | "hold" | "review" | "approved" | "adjusted" | "held" | "awaiting_reply",
decisionAt?: number, decidedBy?: string,
patientNote?: string, internalNote?: string,
adjustment?: { doseChange?: string; note?: string; reason?: string },
holdReason?: string
```

Seed ~10 cases spanning `new / flagged / awaitingReply / refill / approved / denied` with realistic wait times (0.4h → 14h) plus at least one with `priorGlp` populated and one hard-flag case, and ~15 check-ins spanning `due (85-89) / overdue (>90 hold) / review (submitted) / completed / sixMonth`.

### 2. New `adminActions` (`src/lib/admin/store.ts`)

Case actions:
- `approveCaseWithRx(caseId, { patientNote?, internalNote?, rxOverrides? })` — sets status `approved`, timeline `approved`, stamps `decidedBy` from `session.actor` / active physician, pushes an activity log entry, pushes a matching `timeline` note on the linked patient's next order (`orders.filter(o => o.patientId === c.patientId).sort by createdAt).at(-1)`), toast.
- `requestInfoOnCase(caseId, message)` — status `awaitingReply`, timeline `info_requested`, calls `ensureConversationFor(patientId)` and appends a physician message, toast.
- `receiveReplyOnCase(caseId)` — debug/demo helper for the "returns to queue" step (also invoked from the messages page in a follow-up); flips `awaitingReply` → `new`, timeline `reply_received`.
- `denyCaseWithReason(caseId, reasonCode, freeText?)` — status `denied`, timeline `denied`, sets `decision` string, toast.
- `reassignCase(caseId, physicianId)` / `setCasePriority(caseId, "urgent"|"normal")` — timeline entries, toast.
- `updateCaseRxDraft(caseId, patch)` / `updateCasePatientNote(caseId, text)` / `updateCaseInternalNote(caseId, text)` — pure patches, no toast.

Check-in actions:
- `approveCheckInRefill(checkInId, { patientNote?, internalNote? })` — sets `decision = approved`, `decisionAt`, calls existing `createManualOrder(patientId, program)` to queue the refill order (already exists on the store per `.lovable/plan.md`), timeline the patient order, toast.
- `approveCheckInWithAdjustment(checkInId, { doseChange, note, patientNote?, internalNote? })` — same as above but stores `adjustment` and posts the note into the patient conversation.
- `messagePatientFromCheckIn(checkInId, message)` — sets `decision = awaiting_reply`, ensures conversation, appends message.
- `holdCheckInRefill(checkInId, reasonCode, freeText?)` — sets `decision = held`, `holdReason`, freezes patient's next refill (calls existing `pausePatient` or a new `pauseNextRefill(patientId)` — pick `pauseNextRefill` so we don't cancel the whole subscription), notifies via activity log, toast.
- `updateCheckInPatientNote / updateCheckInInternalNote` — pure patches.
- `sendCheckInReminderNow(checkInId)` — bumps `reminderSentAt` + `reminderCount` (extend existing `sendCheckInReminder`).

Every action pushes to `activity` + fires a Sonner toast, matching the pattern established for orders/patients.

### 3. New routes

- `src/routes/admin.physician-queue.$id.tsx` — case detail page
- `src/routes/admin.check-ins.$id.tsx` — check-in detail page

Both follow the exact 65/35 two-column layout from the spec with a sticky right decision column. Reuse the existing `AdminShell`, `Card`, `Pill`, and modal patterns from `admin.orders.$id.tsx` / `admin.patients.$id.tsx`. No new design system — same tokens, same density.

### 4. Rewrite `admin.physician-queue.tsx` list

- Top metrics strip: `In Queue`, `Flagged`, `Avg Wait Time`, `Approved Today`, `Denied Today` (derived from `cases` + `activity`).
- Search box + `All cases ▾` filter + `Today ▾` window filter + Refresh button (recomputes wait times).
- Tabs: `All | Flagged | New | Awaiting Reply | Refills | Completed Today | Denied Today` with counts.
- Table columns per spec (`Case # | Patient | Age | Sex | BMI | Product | Plan | Submitted | Wait | Flags | Physician | Action`), with wait-time color pill (>12h red, 4-12h amber, <4h green) and one-line highest-severity flag summary.
- Refills tab swaps columns to `Case # | Patient | Month | Product | Check-In Status | Weight Change | Side Effects | Action` with one-tap **Approve** on clean refills (calls `approveCaseWithRx` directly, no detail page hop) and **Review →** on anything flagged.
- Sort order: Flagged → Awaiting reply → New oldest-first → Refills oldest-first.
- Row click / **Review →** navigates to `/admin/physician-queue/$id`.

### 5. Wire `admin.physician-queue.$id.tsx` (case detail)

Left column panels 1-7 per spec:
1. **Patient snapshot** — pulls from `cases[id]` + `patients[patientId]` (via `enrichPatient`).
2. **Safety flags** — renders hard vs soft blocks + full auto-evaluated checklist from `case.checklist`.
3. **Intake answers** — collapsible groups from `case.intake` (accordion using `<details>` for zero-JS).
4. **GLP-1 dose matching** — only if `case.priorGlp` set.
5. **Prescription** — inline editable via `updateCaseRxDraft` with a titration accordion (static reference table, no data).
6. **Patient note** — controlled textarea → `updateCasePatientNote` on blur.
7. **Internal note** — controlled textarea → `updateCaseInternalNote` on blur.

Right column sticky:
- Summary block (patient, BMI, flags, wait, priority).
- `Approve & send Rx` → opens `ApproveModal` (PIN entry as a demo e-sign: any 4 digits accepted; fires `approveCaseWithRx`).
- `Request more information` → opens `RequestInfoModal` (textarea; fires `requestInfoOnCase`).
- `Reject case` → opens `RejectModal` with the 9 radio reasons + Other; fires `denyCaseWithReason`.
- Physician stats block: computed live from `cases` + `activity` (reviewed today / approved / rejected / avg time / remaining / oldest / licensed states from `physicians` seed).

Top status banner: pending/awaiting-reply/approved/denied variants + `[Reassign physician ▾]` (select modal listing `physicians`, calls `reassignCase`) + `[Mark as priority →]` (`setCasePriority`).

### 6. Rewrite `admin.check-ins.tsx` list

- Top metrics strip per spec (`Due This Week`, `Overdue`, `Pending Review`, `Completed`, `6-Month Refresh`).
- Search + `This month ▾` + `Export CSV ▾` (reuses existing `csv.ts`).
- Tabs: `Due Now | Overdue | Pending Review | Completed | 6-Month Refresh` with counts, each with its own column set per spec.
- **Due Now** row action `[Send reminder]` / `[Send now]` → `sendCheckInReminderNow`.
- **Overdue** row action `[Call directly]` / `[Send final notice]` → activity log + toast (demo).
- **Pending Review** / **Completed** / **6-Month Refresh** row action `[Review →]` / `[View]` navigates to `/admin/check-ins/$id`.

### 7. Wire `admin.check-ins.$id.tsx` (check-in detail)

- Status banner variants: pending / awaiting reply / held / approved / adjusted / 6-month refresh.
- Left column panels: patient snapshot (with weight math + program month) → check-in answers Q1-Q8 → progress mini-chart (reuse the existing `orders-enrich.ts` helpers or a small inline SVG polyline computed from `startWeight → prevWeight → weight`) → prior check-in history → upcoming refill order.
- Right column sticky:
  - Quick summary block.
  - `Approve refill` → `approveCheckInRefill`.
  - `Approve with protocol adjustment` → modal with dose select + note → `approveCheckInWithAdjustment`.
  - `Message patient before deciding` → modal textarea → `messagePatientFromCheckIn`.
  - `Hold refill` → modal with 6 radio reasons + Other → `holdCheckInRefill`.
  - Internal note textarea → `updateCheckInInternalNote` on blur.
- **6-month refresh variant**: same page shell, but panels 2-6 render "Original intake | Updated profile" two-column diff, decision `Approve` fires `approveCheckInRefill` with a required physician note (button disabled until `patientNote.length > 0`).

### 8. Update `PhysicianQueueStrip` and notifications

- Update deep links so `checkinsOverdue` points at `/admin/check-ins?tab=overdue` (already correct) and any notification about a specific case links to `/admin/physician-queue/$id`.
- No layout change to the strip — counts already come from `queueCounts` which we extend in `selectors.ts` to include `checkinsPendingReview` and `checkinsOverdue` (only `checkinsOverdue` is already there).

### 9. Verification

- Walk `/admin/physician-queue`: filter tabs count correctly, search narrows, refresh recomputes wait pills, clicking Review opens `/admin/physician-queue/BLS-C-…`, running through Approve / Request info / Reject on three different cases moves them between tabs and shows toasts, patient's linked order gets a timeline entry.
- Walk `/admin/check-ins`: Due Now → Send reminder bumps the timestamp, Pending Review → Review opens detail, Approve refill queues a new order (visible in `/admin/orders`), Hold refill pauses next refill on the patient (visible on `/admin/patients/$id`), 6-month refresh requires a note.
- Reload the page — every state change survives (localStorage via `set()`).
- `bunx tsgo --noEmit` clean.

## Out of scope

- Real e-sign / real Stripe capture / real LifeFile transmission — all demo (PIN modal accepts any 4 digits, toast says "Rx transmitted").
- Redesigning the shell, cards, or globe.
- Editing the physician portal (`/portal/physician`) — this plan is admin-side only. The physician portal already has its own approve/deny flow.
- Building a full Klaviyo/email event bus — approvals just push an `activity` entry and a toast.

## Technical notes

- All new modals follow the `fixed inset-0 z-50 grid place-items-center bg-black/40` pattern already used across admin.
- Wait-time color helper lives next to `slaLeft` in the physician queue file; extracted to `src/lib/admin/queue-enrich.ts` if it grows past three call sites.
- The Rx draft editor and the check-in refill draft editor are controlled components; typing debounces via `useDeferredValue` before calling `updateCaseRxDraft` to avoid thrashing localStorage.
- `approveCheckInRefill` reuses the existing `createManualOrder(patientId, program)` from the orders/patients wiring pass; no duplicated order creation logic.
- Case ↔ patient ↔ order linkage: cases have `patientId`; the "linked order" for timeline stamps is the most recent order for that patient, or `createManualOrder` result on approval if none exists yet.
