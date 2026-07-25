/**
 * Deterministic order enrichment — derives all the rich telehealth fields
 * (pharmacy, carrier, shipping, items, timeline, payment breakdown, etc.)
 * from the base seeded Order + Patient without expanding the seed generator.
 */
import { PROGRAMS, type Order, type Patient, type ProgramCode } from "./store";

export type RxStatus = "pending_review" | "approved" | "refill_due" | "denied";
export type Fulfillment = Order["status"];

export type OrderItem = {
  sku: string;
  name: string;
  dose: string;
  qty: number;
  refillsRemaining: number;
  lot: string;
  ndc: string;
  coldChain: boolean;
};

export type TimelineEvent = {
  ts: number;
  actor: "patient" | "system" | "physician" | "pharmacy" | "carrier" | "ops";
  kind: "created" | "paid" | "rx_approved" | "sent_to_pharmacy" | "dispensed" | "label" | "shipped" | "out_for_delivery" | "delivered" | "exception" | "note" | "message";
  message: string;
  meta?: string;
};

export type EnrichedOrder = Order & {
  rxStatus: RxStatus;
  physicianName: string;
  physicianId: string;
  pharmacy: { name: string; city: string; state: string };
  carrier: "UPS" | "FedEx" | "USPS";
  service: string;
  signatureRequired: boolean;
  coldChain: boolean;
  shipTo: { name: string; line1: string; line2?: string; city: string; state: string; zip: string };
  items: OrderItem[];
  supplies: string[];
  payment: {
    method: string;
    last4: string;
    intentId: string;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    status: "paid" | "failed" | "refunded";
  };
  timeline: TimelineEvent[];
  clinical: {
    chiefComplaint: string;
    bmi: number;
    contraindicationsCleared: boolean;
    physicianNote: string;
    eSignAt: number;
  };
  refillNumber: number;
  tags: string[];
  flags: string[];
  eta?: string;
  deliveredAt?: string;
  dose: string;
  cadence: "Monthly" | "3-Month" | "6-Month";
};

const PHARMACIES = [
  { name: "Empower Pharmacy", city: "Houston", state: "TX" },
  { name: "Hallandale Pharmacy", city: "Hallandale Beach", state: "FL" },
  { name: "Strive Pharmacy", city: "Gilbert", state: "AZ" },
  { name: "Olympia Compounding", city: "Orlando", state: "FL" },
];
const PHYSICIANS_LITE = [
  { id: "phy_1", name: "Dr. Ayesha Nassar, MD" },
  { id: "phy_2", name: "Dr. Marcus Bell, DO" },
  { id: "phy_3", name: "Dr. Priya Shah, MD" },
];
const CARRIERS: EnrichedOrder["carrier"][] = ["UPS", "FedEx", "USPS"];
const SERVICES = ["2-Day Air", "Next Day Air", "Ground Priority", "Priority Overnight"];
const STREETS = ["Elm St", "Oak Ave", "Cedar Ln", "Sunset Blvd", "Maple Dr", "5th Ave", "Palm Way", "Highland Rd"];
const CITIES: Record<string, string> = {
  CA: "San Francisco", TX: "Austin", NY: "Brooklyn", FL: "Miami", IL: "Chicago",
  PA: "Philadelphia", OH: "Columbus", GA: "Atlanta", NC: "Charlotte", MI: "Detroit",
  WA: "Seattle", CO: "Denver", AZ: "Phoenix", MA: "Boston", VA: "Richmond", NJ: "Newark",
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pick<T>(arr: T[], seed: number): T { return arr[seed % arr.length]; }

function programMeta(code: ProgramCode): { drug: "Tirzepatide" | "Semaglutide"; cadence: EnrichedOrder["cadence"]; months: number; dose: string } {
  const p = PROGRAMS[code];
  const drug = p.family === "tirz" ? "Tirzepatide" : "Semaglutide";
  const cadence: EnrichedOrder["cadence"] = code.endsWith("_mo") ? "Monthly" : code.endsWith("_3mo") ? "3-Month" : "6-Month";
  const months = cadence === "Monthly" ? 1 : cadence === "3-Month" ? 3 : 6;
  const dose = drug === "Tirzepatide" ? "2.5 mg → 5 mg titration" : "0.25 mg → 0.5 mg titration";
  return { drug, cadence, months, dose };
}

const DAY = 86400_000;

export function enrichOrder(order: Order, patient?: Patient): EnrichedOrder {
  const h = hash(order.id);
  const { drug, cadence, months, dose } = programMeta(order.program);
  const state = patient?.state ?? pick(["CA", "TX", "NY", "FL", "IL", "GA", "NC", "AZ"], h);
  const pharmacy = pick(PHARMACIES, h >> 2);
  const carrier = pick(CARRIERS, h >> 4);
  const service = pick(SERVICES, h >> 5);
  const physician = pick(PHYSICIANS_LITE, h >> 3);
  const createdMs = new Date(order.createdAt).getTime();
  const refillNumber = (h % 5) + 1;

  const shipTo = {
    name: order.patientName,
    line1: `${100 + (h % 8900)} ${pick(STREETS, h >> 1)}`,
    line2: h % 4 === 0 ? `Apt ${(h % 40) + 1}` : undefined,
    city: CITIES[state] ?? "Springfield",
    state,
    zip: String(10000 + (h % 89999)).padStart(5, "0"),
  };

  const items: OrderItem[] = [
    {
      sku: `${drug.slice(0, 4).toUpperCase()}-${cadence.replace("-", "")}`,
      name: `${drug} (compounded)`,
      dose,
      qty: months,
      refillsRemaining: Math.max(0, months - 1 - (refillNumber - 1)),
      lot: `LOT-${(h % 900000 + 100000).toString()}`,
      ndc: `70860-${(h % 900 + 100)}-${(h % 90 + 10)}`,
      coldChain: true,
    },
  ];
  const supplies = ["30 · BD Ultra-Fine 6mm needles", "Sharps container", "12 · Alcohol swabs"];
  if (h % 5 === 0) supplies.push("Nausea comfort pack");

  const priceCents = order.amount * 100;
  const discountCents = h % 6 === 0 ? Math.round(priceCents * 0.1) : 0;
  const subtotal = priceCents;
  const taxCents = Math.round((subtotal - discountCents) * 0.06);
  const shipping = 0;
  const total = subtotal - discountCents + taxCents + shipping;

  const payment: EnrichedOrder["payment"] = {
    method: pick(["Visa", "Mastercard", "Amex"], h),
    last4: String(4000 + (h % 5999)).slice(-4),
    intentId: `pi_${h.toString(36).slice(0, 14)}`,
    subtotal, discount: discountCents, tax: taxCents, shipping, total,
    status: order.status === "exception" && h % 3 === 0 ? "failed" : "paid",
  };

  // Timeline synthesized from createdAt + status
  const t: TimelineEvent[] = [];
  t.push({ ts: createdMs, actor: "patient", kind: "created", message: "Intake submitted" });
  t.push({ ts: createdMs + 45 * 60_000, actor: "system", kind: "paid", message: `Charged ${payment.method} ·• ${payment.last4}`, meta: payment.intentId });
  const rxTs = createdMs + 4 * 60 * 60_000;
  t.push({ ts: rxTs, actor: "physician", kind: "rx_approved", message: `${physician.name} approved Rx`, meta: dose });
  t.push({ ts: rxTs + 30 * 60_000, actor: "system", kind: "sent_to_pharmacy", message: `Rx transmitted to ${pharmacy.name}` });

  if (order.status !== "processing") {
    t.push({ ts: rxTs + 6 * 60 * 60_000, actor: "pharmacy", kind: "dispensed", message: "Compounded & QA passed", meta: items[0].lot });
    t.push({ ts: rxTs + 8 * 60 * 60_000, actor: "pharmacy", kind: "label", message: `${carrier} ${service} label created`, meta: order.tracking });
  }
  if (order.status === "shipped" || order.status === "delivered") {
    t.push({ ts: rxTs + 12 * 60 * 60_000, actor: "carrier", kind: "shipped", message: `${carrier} picked up shipment` });
  }
  let deliveredAt: string | undefined;
  if (order.status === "delivered") {
    const dTs = rxTs + 2 * DAY;
    t.push({ ts: dTs - 3 * 60 * 60_000, actor: "carrier", kind: "out_for_delivery", message: "Out for delivery" });
    t.push({ ts: dTs, actor: "carrier", kind: "delivered", message: `Delivered — signed by ${order.patientName.split(" ")[0]}` });
    deliveredAt = new Date(dTs).toISOString().slice(0, 10);
  }
  if (order.status === "exception") {
    t.push({ ts: rxTs + 20 * 60 * 60_000, actor: "carrier", kind: "exception", message: "Delivery exception — address incomplete" });
  }

  const rxStatus: RxStatus =
    order.status === "processing" ? "pending_review" :
    refillNumber > 1 ? "refill_due" : "approved";

  const tags: string[] = [];
  if (refillNumber === 1) tags.push("First fill");
  if (refillNumber > 1) tags.push(`Refill #${refillNumber}`);
  if (cadence !== "Monthly") tags.push("Bundle");
  if (h % 11 === 0) tags.push("VIP");
  if (drug === "Tirzepatide") tags.push("Titration");

  const flags: string[] = [];
  if (order.status === "exception") flags.push("Delivery exception");
  if (payment.status === "failed") flags.push("Payment failed");
  if (h % 19 === 0) flags.push("Escalated");

  const eta = order.status === "shipped" || order.status === "at_pharmacy"
    ? new Date(rxTs + 2 * DAY).toISOString().slice(0, 10)
    : order.eta;

  return {
    ...order,
    rxStatus,
    physicianName: physician.name,
    physicianId: physician.id,
    pharmacy,
    carrier,
    service,
    signatureRequired: cadence !== "Monthly" || h % 3 === 0,
    coldChain: true,
    shipTo,
    items,
    supplies,
    payment,
    timeline: t.sort((a, b) => a.ts - b.ts),
    clinical: {
      chiefComplaint: "Weight management — BMI-qualified",
      bmi: 27 + (h % 90) / 10,
      contraindicationsCleared: true,
      physicianNote: "No contraindications. Approved starting dose with titration schedule. Patient counseled on injection technique and side-effect mitigation.",
      eSignAt: rxTs,
    },
    refillNumber,
    tags,
    flags,
    eta,
    deliveredAt,
    dose,
    cadence,
  };
}

/* ─── List-level helpers ─── */

export type OrderViewId = "all" | "needs_rx" | "at_pharmacy" | "shipped" | "delivered" | "exceptions" | "refills";

export const ORDER_VIEWS: { id: OrderViewId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_rx", label: "Needs Rx" },
  { id: "at_pharmacy", label: "At pharmacy" },
  { id: "shipped", label: "In transit" },
  { id: "delivered", label: "Delivered" },
  { id: "exceptions", label: "Exceptions" },
  { id: "refills", label: "Refills" },
];

export function filterView(orders: EnrichedOrder[], view: OrderViewId): EnrichedOrder[] {
  switch (view) {
    case "needs_rx":     return orders.filter(o => o.rxStatus === "pending_review");
    case "at_pharmacy":  return orders.filter(o => o.status === "at_pharmacy");
    case "shipped":      return orders.filter(o => o.status === "shipped");
    case "delivered":    return orders.filter(o => o.status === "delivered");
    case "exceptions":   return orders.filter(o => o.status === "exception" || o.flags.length > 0);
    case "refills":      return orders.filter(o => o.refillNumber > 1);
    default:             return orders;
  }
}

/** Bucket the last 7 daily counts (index 0 = 6 days ago, 6 = today). */
export function last7Buckets(orders: Order[], reducer: (o: Order) => number): number[] {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const buckets = Array(7).fill(0);
  for (const o of orders) {
    const d = new Date(o.createdAt); d.setHours(0, 0, 0, 0);
    const idx = 6 - Math.round((today.getTime() - d.getTime()) / DAY);
    if (idx >= 0 && idx < 7) buckets[idx] += reducer(o);
  }
  return buckets;
}

export function ordersKpis(orders: EnrichedOrder[]) {
  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter(o => o.createdAt === today);
  const revenueToday = todaysOrders.reduce((s, o) => s + o.payment.total, 0);
  const shipped = orders.filter(o => o.status === "shipped" || o.status === "delivered");
  const avgHrsToShip = shipped.length
    ? Math.round(shipped.reduce((s) => s + 22, 0) / shipped.length)
    : 0;
  const exceptions = orders.filter(o => o.status === "exception" || o.payment.status === "failed").length;
  return {
    ordersToday: todaysOrders.length,
    revenueToday,
    avgHrsToShip,
    exceptions,
  };
}
