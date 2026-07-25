# Orders Revamp — Shopify-parity for Telehealth

Turn `/admin/orders` from a single table + side drawer into a Shopify-grade Orders workspace: a rich list view with analytics bar, saved views, filters, bulk actions, and a **full detail page** at `/admin/orders/$id` that replaces the current drawer entirely.

Scope: `/admin/orders` only. No other admin section, no marketing site.

---

## 1) List page `/admin/orders`

### Header row

- Title "Orders" + count.
- Right cluster: `Export`, `Print`, `More actions` menu (Hide analytics bar, Reset columns), primary `Create order` (opens a modal — new manual Rx order).

### Analytics bar (dismissible)

Four sparkline KPIs across the top, 7‑day trend + delta vs prior period:

1. **Orders today** (count)
2. **Revenue today** (sum of paid orders)
3. **Time to ship** (avg hrs from Rx approved → carrier pickup)
4. **Exceptions open** (stuck / carrier issue / RTS)

### Saved views (tabs)

Horizontal tab strip like Shopify: `All`, `Needs Rx`, `At pharmacy`, `Shipped`, `Delivered`, `Exceptions`, `Refunds`, `+ New view`. Each view persists filters, sort, and column set (client‑side store, keyed per view).

### Search + filter row

- Search input (order id, patient name, tracking, email, phone).
- Filter chips: Status, Program (Tirz/Sema, cadence), Pharmacy, Carrier, Ship state, Date range, Cold‑chain, Refill # (1st/refill/n), Flagged, Payment status.
- Sort menu: Created, Amount, Ship date, ETA, Patient, Status.

### Bulk actions (appear on row selection)

- Mark shipped / add tracking (bulk)
- Assign to pharmacy
- Print shipping labels (mock)
- Send patient update (SMS/email template)
- Flag / Unflag
- Export selected

### Table (dense, sticky header, column chooser)

Default columns:
`☐ · Order · Date · Patient · Program & cadence · Rx status · Fulfillment · Payment · Amount · Pharmacy · Carrier/Tracking · ETA · Ship‑to state · Tags`

- Row click → **navigates to `/admin/orders/$id**` (no more drawer).
- Status pills use existing admin tokens (success/info/warn/critical). Two pill columns — Rx status and Fulfillment — because telehealth splits these.
- Rx status: `pending review`, `approved`, `denied`, `refill due`.
- Fulfillment: `processing`, `at pharmacy`, `label created`, `shipped`, `out for delivery`, `delivered`, `exception`.

### Empty / loading states

Skeleton rows on first paint. Empty state per view with helpful CTA.

---

## 2) Full detail page `/admin/orders/$id`

New route file `src/routes/admin.orders.$id.tsx`. Two‑column layout on desktop, single column on mobile/tablet.

### Top bar

- Back to Orders, order id `#ord_20400`, copy‑id icon.
- Status stack (2 pills): Rx status + Fulfillment.
- Right: `Print label`, `Refund`, `More actions` (Cancel, Duplicate as refill, Flag, Contact patient, Escalate to physician), primary `Advance stage`.

### Left column (75%)

1. **Fulfillment timeline** (horizontal stepper)
  Rx approved → Sent to pharmacy → Compounded/dispensed → Label created → Picked up → In transit → Out for delivery → Delivered. Each node shows timestamp, actor (system / pharmacy / carrier), and a "mark done" affordance for ops when needed.
2. **Line items card**
  - Medication (Tirzepatide 2.5 mg → 5 mg titration), cadence (Monthly / 3‑Month / 6‑Month), quantity of pens/vials, refills remaining, lot #, NDC, cold‑chain flag.
  - Physician of record (link to case), Rx #, DEA/state check pass badge, controlled‑substance flag.
  - Supplies bundle (needles, sharps, alcohol swabs, nausea pack if OTO).
3. **Shipping card**
  - Ship‑to address (with state controls: allowed/blocked), Signature required, Cold‑chain (2‑8 °C), Carrier + service, Tracking # with copy, live status, ETA, delivery attempts, POD photo (mock).
  - Actions: Edit address (only pre‑label), Reissue label, Reroute, Report exception.
4. **Payment card**
  - Charge summary (subtotal, discounts, tax, shipping = free, total), method (Visa •• 4242), Stripe/Paddle intent id, invoice pdf link.
  - Actions: Refund (partial/full), Retry payment, Send receipt.
5. **Clinical notes / physician thread**
  - Read‑only excerpt of the case: chief complaint, BMI, contraindications checked, physician note, e‑sign timestamp. Link to full case in Physician Portal.
6. **Timeline (activity log)**
  Chronological events: intake submitted → paid → Rx approved by Dr. X → sent to Empower Pharmacy → label created → shipped → delivered. Includes patient/CS messages inline. Ops can `Add note` (internal only).

### Right column (25%)

1. **Patient snapshot**
  Avatar, name, email, phone, DOB, state, LTV, plan, `View patient` link.
2. **Subscription / next refill**
  Program, cadence, `Next refill: Aug 24, 2026`, days remaining, pause/resume, skip next, cancel.
3. **Risk & flags**
  Churn risk, prior exceptions count, chargeback history, ID verification status, address deliverability.
4. **Tags**
  Free‑form tag chips (VIP, First fill, Titration, Escalated, GLP‑1 shortage, etc.), add/remove inline.
5. **Assigned to**
  Ops owner + physician of record.

---

## Data model additions

Extend `Order` in `src/lib/admin/store.ts` (non‑breaking; new fields optional):

- `rxStatus: "pending" | "approved" | "denied" | "refill_due"`
- `physicianId?`, `pharmacy: "Empower" | "Hallandale" | "Strive" | ...`
- `carrier?: "UPS" | "FedEx" | "USPS"`, `service?`, `signatureRequired?: boolean`, `coldChain?: boolean`
- `shipTo: { name, line1, line2?, city, state, zip }`
- `items: Array<{ sku, name, dose, qty, refillsRemaining, lot?, ndc? }>`
- `payment: { method, last4, intentId, subtotal, discount, tax, total, status }`
- `timeline: Array<{ ts, actor, kind, message }>`
- `tags: string[]`, `flags: string[]`, `refillNumber: number`
- `eta?`, `deliveredAt?`

Seed generator updated so the 40+ existing orders get realistic derived values (pharmacy round‑robin, carriers by state, cold‑chain true for GLP‑1, timeline synthesized from `createdAt` + status).

Selectors: `useOrder(id)`, `useOrderFilters()`, `useOrderView(viewId)`.

---

## Technical details

- **Routing**: add `src/routes/admin.orders.$id.tsx`. Keep list at `admin.orders.tsx`. Remove the existing side‑drawer branch (and `ui.orderDrawerId` usage in orders); `adminActions.openOrder(id)` becomes `router.navigate({ to: "/admin/orders/$id", params: { id } })`.
- **Styling**: reuse `AdminShell`, `Card`, `StatusPill`, `formatMoney`. Add two small primitives in `src/components/admin/`:
  - `Stepper.tsx` — horizontal fulfillment stepper (indigo active, emerald done, slate pending, coral exception).
  - `MiniSpark.tsx` — inline 40×14 SVG sparkline for the analytics bar.
- **Charts/palette**: stay on the current admin indigo/violet/sky/emerald/amber/coral scoped tokens.
- **State**: extend zustand slice with `orderViews`, `orderFilters`, `orderSelection`, and helpers `setView / setFilter / toggleSelect / bulkUpdate`.
- **Responsiveness**: table becomes a card list under `md`; detail page collapses to one column under `lg`; sticky action bar on mobile detail.
- **Perf**: virtualize the table only if row count exceeds ~200 (not needed today with ~40 seeds).
- **No backend calls**: everything continues to run off the local seeded store, matching the rest of `/admin`.

---

## Deliverables checklist  
  
  
make it all as per telehealth , not as per ecom tha'ts it

- `src/lib/admin/store.ts` — extended `Order`, richer seeds, new selectors/actions.
- `src/routes/admin.orders.tsx` — analytics bar, saved views, filters, bulk actions, new columns, row → navigate.
- `src/routes/admin.orders.$id.tsx` — full detail page (left/right layout, all cards above).
- `src/components/admin/Stepper.tsx`, `src/components/admin/MiniSpark.tsx`.
- Head metadata on the new detail route (title `Order #{id} — Blissley HQ`, `noindex`).
- Grep pass for `orderDrawerId` to ensure it's only used in non‑orders code (or removed).