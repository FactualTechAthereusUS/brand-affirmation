# Leads Revamp — Shopify-parity Telehealth Workspace

Mirror the density and clarity we shipped for `/admin/patients`, borrowing structure from Shopify's Customers/Segments screen (uploaded ref). Leads = pre-conversion humans (abandoned intakes, unpaid checkouts, MQL from ads). This becomes the recovery + acquisition control tower.

## Scope

1. Rebuild `/admin/leads` (list) with KPI strip, saved segments, tabs, filters, dense table, bulk actions.
2. New `/admin/leads/$id` detail page — full lead workspace (timeline, intake replay, outreach console, conversion attribution).
3. Extend the seed data model so leads carry telehealth-grade signal (score, intent, funnel step, LTV projection, consent, attribution).
4. Do NOT fold this into `/patients` — keep them separate (leads ≠ patients). Add a "Convert to patient" action that promotes a lead into the patients store.

## Data model additions (`src/lib/admin/store.ts`)

Extend `Lead`:
- `phone`, `state`, `city`, `dob?`, `sex?`
- `score` 0–100 (composite: funnel depth + recency + channel quality)
- `intent`: `hot | warm | cold`
- `funnelStep`: `landing | intake_start | intake_mid | intake_complete | checkout | payment_fail | abandoned_cart`
- `progressPct` (0–100, derived from step)
- `program`: existing + `hair | ed | skin | trt | general`
- `stateEligible`: boolean (Rx state gating)
- `bmi?`, `goalWeight?`, `currentWeight?` (WL leads)
- `consent`: `{ sms: boolean; email: boolean; marketing: boolean }`
- `attribution`: `{ source, medium, campaign, adset?, creative?, landingUrl, firstTouch, lastTouch }`
- `deviceType`: `mobile | desktop | tablet`
- `projectedLTV`, `projectedFirstOrder` (USD)
- `outreach`: array of `{ ts, channel: 'email'|'sms'|'call'|'note', by, subject, outcome }`
- `tags`: string[]
- `assignee?`, `status`: `new | working | nurturing | won | lost | do_not_contact`
- `lossReason?`, `wonPatientId?`
- `intakeSnapshot`: array of `{ q, a, ts }` (their partial answers)

Add `LeadSegment` type (id, name, definition string, count, pinned).

Enrich seed to ~40 leads across programs/states with realistic funnel distributions.

## Store actions

`updateLeadStatus`, `assignLead`, `addLeadOutreach`, `addLeadTag`, `removeLeadTag`, `setLeadConsent`, `convertLeadToPatient`, `markLeadLost(reason)`, `bulkLeadAction`.

## List page `/admin/leads`

Structure top-to-bottom:

1. **Page header** — "Leads" + right-side buttons: Export, Import, Create segment, New lead.
2. **KPI strip (6 cards)**:
   - Open leads
   - Hot (score ≥ 70)
   - Abandoned checkouts · 30d
   - Recovery rate · 30d
   - Avg time-to-contact
   - Projected recoverable revenue (Σ projectedFirstOrder for open)
3. **Saved segments rail** (Shopify Segments pattern from ref image) — horizontal chip row + "All segments" link that expands into a table:
   - Name · % of leads · Last activity · Created by
   - Seeded segments: All leads, Hot · last 24h, Abandoned checkout · 30d, Intake started · not finished, Payment failed, State-eligible only, Meta paid, Google paid, DNC list, Won this month.
4. **Tabs** (status): All · New · Working · Nurturing · Payment failed · Do not contact · Lost · Won.
5. **Filter bar** — search (name/email/phone), Program, State, Source, Score range, Funnel step, Assignee, Date range. Save-as-segment button.
6. **Table (dense)** columns:
   - checkbox · Lead (name + email + phone) · Score (pill with color) · Intent · Program · Funnel step (mini progress bar) · State (with eligibility dot) · Source/Campaign · Age · Last touch · Assignee · Status · Actions (Email/SMS/Call/Open)
7. **Bulk action bar** appears on selection: Email, SMS, Assign, Tag, Change status, Add to segment, Export, Delete.
8. **Pagination** + rows-per-page.

## Detail page `/admin/leads/$id`

Full-width workspace, one scroll, mirrors `/admin/patients/$id` architecture.

**Top status banner (conditional)**:
- Payment failed → "Retry payment / Send new checkout link"
- Intake abandoned mid → "Resume intake link"
- Hot + not contacted in 2h → "Contact now"
- DNC → red banner, disables outreach

**Header block** — avatar/initials, name, email, phone, state, score gauge, intent badge, assignee, status dropdown, quick actions (Email, SMS, Call, Convert to patient, Mark lost).

**Left column (main)**:
- **Lead score breakdown** — component bars (funnel depth, recency, channel, engagement) totalling score.
- **Funnel progress** — horizontal stepper: Landing → Intake start → Intake mid → Intake complete → Checkout → Paid. Current step highlighted, drop-off arrow shown.
- **Intake snapshot** — Q&A list from `intakeSnapshot` (what they answered before dropping) + "Resume intake" deep link.
- **Attribution** — source/medium/campaign/creative, landing URL, first touch, last touch, device, sessions count.
- **Outreach timeline** — chronological feed of email/sms/call/note events with outcomes. Inline composer at top (channel tabs: Email / SMS / Call log / Internal note).
- **Related activity** — page views, form fields touched, cart contents if any, coupon codes.

**Right sidebar**:
- **Quick info** — email/phone (click to copy), state, DOB, consent toggles (SMS/Email/Marketing), timezone, best time to contact.
- **Projected value** — projected first order, projected LTV, program preference.
- **Manage** — Assign to teammate, Change status, Add tag, Add to segment, Merge duplicates.
- **Danger zone** — Mark do-not-contact, Mark lost (with reason dropdown: price, competitor, ineligible state, unresponsive, medical, other), Delete lead.
- **Tags** — chips with add/remove.

## Components to add (`src/components/admin/leads/`)

- `LeadKpis.tsx`
- `SegmentsRail.tsx` (chips + expandable segments table matching ref image)
- `LeadsFilters.tsx`
- `LeadsTable.tsx` (with column primitives: `ScorePill`, `IntentBadge`, `FunnelBar`, `EligibilityDot`)
- `BulkActionBar.tsx`
- `LeadStatusBanner.tsx`
- `LeadScoreBreakdown.tsx`
- `FunnelStepper.tsx`
- `IntakeSnapshot.tsx`
- `AttributionCard.tsx`
- `OutreachTimeline.tsx` + `OutreachComposer.tsx`
- `LeadManagePanel.tsx`, `LeadDangerZone.tsx`

## Styling

Stay inside `.admin-scope` tokens (indigo/violet/sky + emerald/amber/coral semantics). No icon background circles. Same table/card density we established in `/admin/patients` and `/admin/orders`.

## Out of scope for this pass

- Real ESP/SMS integration (all outreach is local store simulation).
- Real ad-platform attribution ingestion (attribution is deterministic seed).
- Segment builder UI (segments are pre-seeded; "Create segment" saves current filter set only).

## Deliverable

Dense Shopify-grade Leads workspace at `/admin/leads` + `/admin/leads/$id`, wired to the extended store, matching the visual language of the rest of the admin.
