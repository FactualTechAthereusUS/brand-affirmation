# /admin/patients — Telehealth Revamp

Rebuild `/admin/patients` (list) and `/admin/patients/$id` (detail) to match the uploaded spec. Same indigo/violet/sky admin palette, same `AdminShell`. No changes outside `/admin/*`.

---

## 1. Data model — extend the Patient shape

`src/lib/admin/store.ts` — add `PatientStatus` values `"denied"`, and extend `Patient` with:
- `patientId` display code (e.g. `BLS-P-00284`), `city`, `dob`, `sex`, `heightIn`, `weightLbs`, `goalWeightLbs`, `bmi`, `dose` (step + strength), `monthOfPlan` (n of N), `nextBillingAt`, `nextBillingAmt`, `cardBrand`, `cardLast4`, `physicianName`, `physicianNpi`, `pharmacy`, `rxValidUntil`, `refillsLeft`, `rxSig`, `approvalNote`, `lastLoginAt`, `lastEmailOpenedAt`, `portalActive`, `tags[]`, `intake` (blob with contraindications, qualifying conditions, prior GLP-1, BP, meds, allergies, ec contact, scores), `internalNotes[]`, `communications` (klaviyo status, sms opt-in), `denialReason?`, `cancelledAt?`, `cancelReason?`, `winbackStage?`, `failedRetry?` `{ attempt, nextAt }`.

Add a deterministic enricher `src/lib/admin/patients-enrich.ts` that synthesizes all extended fields from the existing seed (mirrors the pattern of `orders-enrich.ts`) so seeds stay lean. Expose selectors:
- `selectPatients(state, { statusTab, segment, search, sort, page, pageSize })`
- `selectPatientKpis(state)` → total, active, newThisMonth, churned + churnRate, failedPayment + $atRisk
- `selectPatientSegments(state)` → the 6 shortcut counts (month2HighRisk, checkinDueThisWeek, checkinOverdue, highLtv6mo, winbackCandidates, noPortal14d)

## 2. List page — `src/routes/admin.patients.tsx`

Full rewrite. Layout top-to-bottom:

1. **Top bar** — `Patients` heading, search input (name / email / phone / order # / state), right-side `[All ▾]` view menu, `[Export CSV ▾]`, `[+ Add Patient]`.
2. **KPI strip** — 5 `KpiCard`s: Total Patients, Active, New This Month (vs prior), Churned (with churn rate), Failed Payment (with $ at risk). Same visual language as `admin.index` / `admin.orders`.
3. **Status tabs** — `All / Active / Pending Approval / Paused / Cancelled / Denied / Payment Failed`, live counts. Underline + indigo active state.
4. **Segment chips row** — the 6 quick filters from spec, each with count, plus a ghost `+ Create segment`.
5. **Table** — dense, high-contrast, matching orders table style:
   - Columns: Patient (avatar + name + email), Status pill, Program, Since, MRR, LTV, Month (n/N), Churn Risk pill, Last Active, Actions (`View`).
   - Sortable headers; default newest first.
   - Row click → `/admin/patients/$id`.
   - Bulk-select checkbox column + bulk toolbar (Message / Tag / Export / Pause).
   - Pagination footer: rows-per-page (10/25/50/100), page N of M, prev/next.
   - Status pill colors: active=emerald, pending=amber, paused=slate, failed=coral, cancelled=muted, denied=ink.
   - Churn pill: Low=emerald, Medium=amber, High=coral, Critical=solid coral.

Icons stay bare (no background tiles), per project rule.

## 3. Detail page — `src/routes/admin.patients.$id.tsx`

Full rewrite. Full-page, not a modal. `← Patients` back link.

**Header card**: initials avatar (48px, indigo), name + status pill, email · phone, city, state · patient since date, patient ID mono. Primary buttons `[Send message] [Issue refund]`, kebab `More actions` (cancel / pause / flag / export record / delete).

**Status banners** (conditional, above two-column grid):
- Pending → amber banner block (awaiting physician review, wait time, assigned physician, card authorized, links).
- Denied → dark gray banner (reason, refund line, email sent, care-team follow-up toggle).
- Cancelled → muted banner (cancel date, reason, duration, total revenue, win-back stage, `Reactivate` / `Offer discount`).
- Failed payment → coral banner (declined amount + date, retry schedule, portal warning, `Retry now` / `Contact patient` / `Write off`).

**Two-column grid** (65 / 35):

Left column blocks:
1. **Subscription** — plan, status, started, current month, current dose, next billing, card. Dose progression stepper (reuse `Stepper.tsx`). `[Pause] [Cancel] [Switch plan] [Update billing date]`.
2. **Clinical** — physician + NPI, approved date, Rx valid until, refills left, pharmacy, current Rx + sig, approval note quote.
3. **Orders** — last 3 orders table (Order # / Date / Product / Status / Amount / Tracking / Actions). `View all →` links to `/admin/orders` filtered. `+ Create order`.
4. **Check-ins** — next due date + days remaining. Completed state (weight delta, side effects, wellbeing, physician review line) or overdue warning with `Send reminder`. Collapsed history accordion.
5. **Payments** — table of charges + totals (spent / refunds / net). Failed rows get inline `Retry` / `Contact`.
6. **Communications** — email (last sent/opened, open rate, Klaviyo status), SMS (opt-in, last sms), Portal (last login, magic link resend), Messages summary.
7. **Intake** — collapsed accordion. Expanded: Personal, Clinical Flags, Medications, Emergency Contact, Intake Scores. Read-only. `Download intake PDF` (stub).
8. **Activity timeline** — reverse-chronological entries derived from orders/payments/checkins/messages/portal events. `Add internal note` composer at bottom.

Right column blocks:
- **A. At a glance** — LTV actual + 12-mo projection, MRR, total orders, churn risk, program, month, dose, physician, pharmacy, portal/email/check-in state rows.
- **B. Manage** — Pause (duration picker modal), Cancel (confirm modal w/ reason), Switch plan (radio picker), Update payment method, Update billing date, Update shipping address.
- **C. Quick actions** — Send message, Send magic link, Issue refund (amount + reason modal), Create new order, Flag for review, Export patient record, Delete patient (type-name-to-confirm).
- **D. Internal notes** — list of past notes (author + timestamp + text, non-deletable), composer with `Save note`.
- **E. Tags** — chip list + `+ Add tag`.

Every mutating action calls a new store method (`pausePatient`, `cancelPatient`, `switchPlan`, `refundPayment`, `retryPayment`, `sendMagicLink`, `addPatientNote`, `addPatientTag`, `flagPatient`, `writeOffPayment`, `reactivatePatient`). All mutations append to activity + admin `activity` feed.

## 4. Palette + tokens

Reuse admin-scope tokens already in `src/styles.css` (indigo/violet/sky primary, emerald/amber/coral semantic). No new global tokens. Bare icons everywhere (no background circles).

## 5. Files touched

Create:
- `src/lib/admin/patients-enrich.ts`
- `src/components/admin/patients/StatusBanner.tsx` (variant per status)
- `src/components/admin/patients/DoseProgress.tsx`
- `src/components/admin/patients/PatientTimeline.tsx`
- `src/components/admin/patients/ManagePanel.tsx`
- `src/components/admin/patients/QuickActionsPanel.tsx`
- `src/components/admin/patients/InternalNotes.tsx`

Rewrite:
- `src/routes/admin.patients.tsx`
- `src/routes/admin.patients.$id.tsx`

Extend:
- `src/lib/admin/store.ts` — Patient type + `denied` status + new mutations + selectors.
- `src/lib/admin/seeds.ts` — augment featured patients with denied / failed / cancelled examples matching spec personas (Sarah, Michael, Dana, Lisa, Omar, Ashley).

## 6. Verification

- `tsgo` clean.
- Manual click-through: list tabs + chips + search + sort + pagination + row → detail; each detail variant (active / pending / paused / failed / cancelled / denied) renders its banner and correct data; every action modal opens and mutates store; timeline updates.
- Grep for `__l5e` (must be zero) and hardcoded warm brand hex in touched files.

## Out of scope

- No real Stripe / Klaviyo / LifeFile integration — all stubs.
- No changes to marketing site, portals, or non-admin routes.
- Physician queue page untouched (link only).
