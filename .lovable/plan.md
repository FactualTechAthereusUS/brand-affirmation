Adopt Shopify's Order/Customer detail patterns across all three detail pages, adapted for telehealth. Purely presentational + a few store fields. No new routes, no migrations.

## /admin/orders/$id — align to Shopify order page

Reorder existing blocks and add missing ones.

**Header row**

- Keep #id, copy, RxBadge, FulfillBadge, cold-chain chip.
- Add prev/next paginate arrows (sibling orders sorted by createdAt) — Shopify-parity nav.
- Subheading line: `Placed {createdAt} · from {channel} · {program} · {cadence}`.

**Variant banner** (new, above grid)

- `exception` → red "Delayed / lost in transit" + Reship-at-no-cost CTA
- `rxStatus = pending_review` → amber "Awaiting Rx approval — card authorized, not captured"
- `payment.status = refunded` → gray "Refunded {date} · {amount}"

**Left column** (main, existing order kept where sensible)

1. Fulfillment stepper (as-is)
2. **Line items — grouped by fulfillment status card** (Shopify pattern): "Unfulfilled" / "At pharmacy" / "Shipped" group headers, each with its items + per-group action (Mark dispatched / Print label / Track). Rx meta strip below (physician, state check, Rx#) stays.
3. Shipping card (as-is)
4. **Payment summary card** — Shopify layout: subtotal · discount · tax · shipping · Total, then a "Paid $X" or "Refunded $X" footer strip. Method + intent moved to smaller side panel inside card.
5. **COGS (internal)** — new: drug cost, packaging, shipping cost, gross profit $, GP margin %. Deterministic from order id/program in `enrichOrder`.
6. Clinical review (as-is)
7. **Timeline w/ composer** — full-width, promoted to bottom. Add textarea + Post button = internal note (mirrors Shopify's Timeline Comment block).

**Right column**

- **Customer card** — Shopify parity: initials, name, "N orders" count, contact block w/ copy-email, shipping address w/ copy, billing (Same as shipping), then LTV / plan / started. Link → patient page.
- **Subscription context** (as-is): cadence, refill #, next refill, quick actions.
- **Conversion summary** (new): first order? attribution source · sessions · days from lead → conversion. Derive from patient enrichment.
- **About this order** (new): Order risk (low/med/high pill, chargeback risk line), ID verification, address deliverability, exception flags.
- Tags + Assigned (as-is).

## /admin/patients/$id — align to Shopify customer page

Reorder + add metric strip.

**Header** (as-is) + prev/next paginate arrows.

**Metric strip** (new, directly below header — Shopify's 4-card row)

- Amount spent (`$totalSpent`)
- Orders (count)
- Patient since (relative, e.g. "8 months")
- Segment / RFM (e.g. "Active · High LTV" or churn tier)
Each card has an info tooltip explaining the metric.

**Left column**

1. Status banner (as-is)
2. **Last order card** (new — Shopify "Last order placed" pattern): most-recent order with status pills, mini line-items list, "Create order" + "View all orders" links. Placed above the Orders table.
3. Subscription + DoseProgress (as-is)
4. Clinical (as-is)
5. Orders table (last 3, as-is) — kept below Last-order card for full history glance
6. Check-ins (as-is)
7. Payments (as-is)
8. Communications (as-is)
9. Intake (collapsed, as-is)
10. **Activity timeline w/ composer** — promoted to full width bottom; existing PatientTimeline already includes note composer.

**Right column** — trim to Shopify shape

- Customer info card (contact + copy email, default address, marketing subs Yes/No, tax, store credit N/A)
- Manage (subscription controls, as-is)
- Quick actions (as-is)
- Tags (as-is)
- Internal notes (as-is)
- "At a glance" merged into the top metric strip; keep only projected LTV/churn as a small sub-card.

## /admin/leads/$id — light Shopify polish

Already comprehensive. Just add:

- Prev/next paginate arrows in header.
- **Metric strip** (4 cards): Score · Projected LTV · Sessions · Days since first touch. Replaces the standalone ScoreGauge in the header (moved into card 1).
- **Conversion summary** card (attribution: first-touch source, sessions, days-in-funnel) — currently split between Attribution + funnel; consolidate into one Shopify-style summary card next to Attribution.

No block removals, no new routes.  
  
make it as per telehelath not as ecom, u have to update everything as per telehealth 

## Files touched

- `src/lib/admin/orders-enrich.ts` — add `cogs`, `channel`, `orderRisk`, `siblingOrderIds` (for paginate).
- `src/lib/admin/patients-enrich.ts` — add `amountSpent`, `orderCount`, `customerSinceRel`, `rfmGroup`, `siblingPatientIds`.
- `src/lib/admin/leads-enrich.ts` — add `siblingLeadIds`, `sessionsCount`, `daysSinceFirstTouch`.
- `src/lib/admin/store.ts` — add `orderNotes: Record<string, InternalNote[]>` + `adminActions.addOrderNote`.
- `src/routes/admin.orders.$id.tsx` — reorder blocks, add variant banner, grouped fulfillment card, COGS, timeline-with-composer, conversion summary, order risk, customer card refactor.
- `src/routes/admin.patients.$id.tsx` — add paginate, metric strip, Last-order card, Customer-info sidebar card refactor.
- `src/routes/admin.leads.$id.tsx` — paginate, metric strip, conversion summary consolidation.

## Out of scope

- No changes to list pages, no route additions, no schema/migrations, no styling overhaul beyond Shopify-pattern block moves.  
  
  
  
make it as per teheleath not just ecom  

  What's already built (verified by reading each file)
  - `/admin/patients/$id` — every block in your spec is present: header, status banner, subscription + dose progression, clinical, orders (last 3), check-ins, payments, communications, intake (collapsible), activity timeline, at-a-glance, manage, quick actions, internal notes, tags. Variant banners handled by `StatusBanner`.
  - `/admin/leads/$id` — funnel stepper, score breakdown, intake snapshot, outreach console, attribution, cart, projected value, consent, manage, tags, danger zone. Complete.
  - `/admin/orders/$id` — timeline stepper, line items + Rx meta, shipping, payment, clinical review, activity log, patient sidebar, subscription sidebar, risk/flags, tags, assignment. Missing 4 items from your spec.
  Gaps to fix (orders detail only)
  1. Variant banner — add a top-of-page banner (below the toolbar, above the two-column grid) that switches on status:
     - `exception` → red "Delayed / lost in transit" + "Reship at no cost" CTA
     - `rx_status = pending_review` → amber "Awaiting Rx approval — card authorized, not captured"
     - `payment.status = refunded` → gray "Order refunded on {date} · {amount}"
  2. COGS block (internal) — left column, below Payment: drug cost, packaging, shipping cost, gross profit, GP margin %. Derive from `enrichOrder` (add fields — deterministic from order id/program so no schema changes needed).
  3. Patient order history — right column, after Subscription: last 3 orders for `patientId` (id, date, status pill, amount) + "View all →" link to `/admin/orders?patient={id}`.
  4. Internal notes — right column, bottom: reuse the same UX as `InternalNotes` (textarea + timestamped list), scoped per-order. Add `orderNotes` to store + `addOrderNote` action mirroring `addPatientNote`.
  Files touched
  - `src/lib/admin/orders-enrich.ts` — add `cogs: { drug, packaging, shipping, gp, gpPct }` to `EnrichedOrder`.
  - `src/lib/admin/store.ts` — add `orderNotes: Record<orderId, InternalNote[]>` + `adminActions.addOrderNote`.
  - `src/routes/admin.orders.$id.tsx` — insert VariantBanner, COGS card, PatientOrderHistory card, OrderInternalNotes card. No layout overhaul; slot into existing two-column grid.
  No changes to patients/$id or leads/$id. No new routes. No migrations.
  Out of scope
  I will not rewrite the parts already matching spec, refactor styling, or touch the list pages. Purely additive to the orders detail page.