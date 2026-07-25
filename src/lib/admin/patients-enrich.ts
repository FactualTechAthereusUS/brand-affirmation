/**
 * Blissley — patient enrichment.
 * Deterministic synthesis of rich clinical / logistics / engagement data
 * from a lean Patient seed. Same id ⇒ same output.
 */
import type { Patient, PatientStatus, Order, Payment, AdminState, ProgramCode } from "./store";
import { PROGRAMS } from "./store";

const DAY = 86_400_000;

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function pick<T>(id: string, salt: string, arr: T[]): T {
  return arr[hash(id + salt) % arr.length];
}
function num(id: string, salt: string, lo: number, hi: number): number {
  const r = (hash(id + salt) % 10_000) / 10_000;
  return Math.round(lo + r * (hi - lo));
}
function iso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

const CITIES: Record<string, string[]> = {
  CA: ["San Francisco", "Los Angeles", "San Diego", "Sacramento"],
  TX: ["Austin", "Dallas", "Houston", "San Antonio"],
  NY: ["New York", "Brooklyn", "Buffalo", "Rochester"],
  FL: ["Miami", "Tampa", "Orlando", "Jacksonville"],
  IL: ["Chicago", "Naperville", "Evanston"],
  PA: ["Philadelphia", "Pittsburgh"],
  OH: ["Cleveland", "Columbus"],
  GA: ["Atlanta", "Savannah"],
  NC: ["Raleigh", "Charlotte"],
  MI: ["Detroit", "Ann Arbor"],
  WA: ["Seattle", "Bellevue"],
  CO: ["Denver", "Boulder"],
  AZ: ["Phoenix", "Tucson"],
  MA: ["Boston", "Cambridge"],
  VA: ["Arlington", "Richmond"],
  NJ: ["Jersey City", "Newark"],
};

const PHYSICIANS = [
  { name: "Dr. Scott Nass MD", npi: "1477783827" },
  { name: "Dr. Frank Suppa DO", npi: "1508827611" },
  { name: "Dr. Priya Patel MD", npi: "1912456783" },
  { name: "Dr. Rachel Vance MD", npi: "1837465921" },
];
const PHARMACIES = ["South End Pharmacy", "Empower Pharmacy", "Precision Labs", "Absolute Rx"];

export type EnrichedPatient = Patient & {
  patientCode: string;
  city: string;
  dob: string;
  age: number;
  sex: "Female" | "Male";
  heightIn: number;
  weightLbs: number;
  goalWeightLbs: number;
  bmi: number;
  weightLostLbs: number;
  totalMonths: number;
  monthOfPlan: number;
  doseStep: number;
  doseTotalSteps: number;
  doseStrength: string;
  nextBillingAt: string;
  nextBillingAmt: number;
  cardBrand: string;
  cardLast4: string;
  physicianName: string;
  physicianNpi: string;
  pharmacy: string;
  rxValidUntil: string;
  refillsLeft: number;
  rxSig: string;
  approvalNote: string;
  approvedAt: string;
  lastLoginAt: number;
  lastEmailOpenedAt: number;
  emailsSent: number;
  emailsOpened: number;
  klaviyoActive: boolean;
  smsOptIn: boolean;
  portalActive: boolean;
  denialReason?: string;
  cancelReason?: string;
  cancelledAt?: string;
  duration?: string;
  totalRevenue: number;
  winbackStage?: string;
  failedAmount?: number;
  failedRetryAttempt?: number;
  failedNextRetryAt?: string;
  intake: {
    goalWeightLbs: number;
    weightToLose: number;
    heightIn: number;
    weightLbs: number;
    bmi: number;
    contraindications: string[];
    qualifyingConditions: string[];
    priorGlp1: boolean;
    bp: string;
    bariatric: boolean;
    meds: string[];
    allergies: string[];
    ecName: string;
    ecPhone: string;
    primaryPain: string;
    struggleDuration: string;
    primaryDesire: string;
    commitment: string;
    sleepQuality: string;
    recommendation: string;
  };
};

export function enrichPatient(p: Patient): EnrichedPatient {
  const id = p.id;
  const seq = parseInt(id.replace(/\D/g, "") || "0", 10);
  const patientCode = `BLS-P-${seq.toString().padStart(5, "0")}`;
  const cities = CITIES[p.state] ?? ["—"];
  const city = pick(id, "city", cities);
  const age = num(id, "age", 28, 58);
  const dobYear = 2026 - age;
  const dobMonth = num(id, "dm", 1, 12).toString().padStart(2, "0");
  const dobDay = num(id, "dd", 1, 28).toString().padStart(2, "0");
  const dob = `${dobYear}-${dobMonth}-${dobDay}`;
  const sex: "Female" | "Male" = hash(id + "sex") % 2 === 0 ? "Female" : "Male";
  const heightIn = num(id, "h", 60, 74);
  const weightLbs = num(id, "w", 175, 245);
  const goalWeightLbs = weightLbs - num(id, "g", 25, 55);
  const bmi = Math.round((weightLbs / (heightIn * heightIn)) * 703 * 10) / 10;

  const price = PROGRAMS[p.program].price;
  const totalMonths = p.program.endsWith("6mo") ? 6 : p.program.endsWith("3mo") ? 3 : 1;
  const monthsCompleted = Math.max(1, Math.min(totalMonths, Math.round(p.ltv / Math.max(1, price)) || 1));
  const monthOfPlan = p.status === "pending" || p.status === "denied" ? 0 : monthsCompleted;
  const doseStep = Math.min(4, monthOfPlan);
  const doseStrength = ["1.5mg/mL", "5mg/mL", "10mg/mL", "15mg/mL"][Math.max(0, doseStep - 1)] ?? "1.5mg/mL";
  const weightLostLbs = Math.round((monthOfPlan * num(id, "wl", 3, 7)) * 10) / 10;

  const startMs = Date.parse(p.startedAt + "T09:00:00Z");
  const nextBillingMs = startMs + monthOfPlan * 30 * DAY;
  const rxValidMs = startMs + 180 * DAY;
  const cardLast4 = ((hash(id) % 9000) + 1000).toString();
  const physician = PHYSICIANS[hash(id + "phys") % PHYSICIANS.length];
  const pharmacy = PHARMACIES[hash(id + "phar") % PHARMACIES.length];

  const nowMs = Date.now();
  const lastLoginAt = nowMs - num(id, "login", 0, p.status === "active" ? 2 * DAY : 20 * DAY);
  const lastEmailOpenedAt = nowMs - num(id, "email", 30 * 60_000, 5 * DAY);
  const emailsSent = num(id, "es", 4, 14);
  const emailsOpened = Math.max(1, emailsSent - num(id, "eo", 0, 3));
  const klaviyoActive = p.status !== "cancelled" && p.status !== "denied";
  const smsOptIn = hash(id + "sms") % 3 !== 0;
  const portalActive = p.status !== "denied";

  const totalRevenue = p.status === "denied" ? 0 : Math.max(0, monthsCompleted) * price;
  const duration = p.status === "cancelled" ? `${Math.floor(monthsCompleted)} months` : undefined;

  return {
    ...p,
    patientCode,
    city,
    dob,
    age,
    sex,
    heightIn,
    weightLbs,
    goalWeightLbs,
    bmi,
    weightLostLbs,
    totalMonths,
    monthOfPlan,
    doseStep: Math.max(1, doseStep),
    doseTotalSteps: 4,
    doseStrength,
    nextBillingAt: p.nextBillingOverride ?? iso(nextBillingMs),
    nextBillingAmt: p.status === "active" ? price : 0,
    cardBrand: p.cardBrandOverride ?? "Visa",
    cardLast4: p.cardLast4Override ?? cardLast4,
    physicianName: physician.name,
    physicianNpi: physician.npi,
    pharmacy,
    rxValidUntil: iso(rxValidMs),
    refillsLeft: Math.max(0, 5 - monthOfPlan),
    rxSig: p.program.startsWith("tirz")
      ? "Inject 0.11mL SQ weekly wks 1-4, then 0.22mL weekly."
      : "Inject 0.5mg SQ weekly wks 1-4, then 1.0mg weekly.",
    approvalNote: pick(id, "note", [
      "New patient, no flags. Starting at low dose. Titrate per standard protocol.",
      "Cleared. Watch for GI side effects at week 3 escalation.",
      "Approved with counseling on injection technique.",
    ]),
    approvedAt: p.startedAt,
    lastLoginAt,
    lastEmailOpenedAt,
    emailsSent,
    emailsOpened,
    klaviyoActive,
    smsOptIn,
    portalActive,
    cancelledAt: p.status === "cancelled" ? iso(startMs + monthsCompleted * 30 * DAY) : undefined,
    duration,
    totalRevenue,
    winbackStage: p.status === "cancelled" ? pick(id, "wb", ["Email 1 sent", "Email 2 scheduled", "Awaiting response"]) : undefined,
    failedAmount: p.status === "failed" ? price : undefined,
    failedRetryAttempt: p.status === "failed" ? num(id, "fr", 1, 2) : undefined,
    failedNextRetryAt: p.status === "failed" ? iso(nowMs + num(id, "fnr", 1, 5) * DAY) : undefined,
    intake: {
      goalWeightLbs,
      weightToLose: weightLbs - goalWeightLbs,
      heightIn,
      weightLbs,
      bmi,
      contraindications: [],
      qualifyingConditions: pick(id, "qc", [
        ["High blood pressure", "High cholesterol", "Weight gain despite diet"],
        ["PCOS", "Increased appetite", "Low energy"],
        ["Insulin resistance", "Sleep apnea"],
      ]),
      priorGlp1: hash(id + "glp1") % 4 === 0,
      bp: pick(id, "bp", ["120-129/80-84 (Elevated)", "130-139/80-89 (Stage 1)", "Normal"]),
      bariatric: false,
      meds: pick(id, "meds", [["Lisinopril 10mg daily"], [], ["Metformin 500mg BID"], ["Atorvastatin 20mg"]]),
      allergies: pick(id, "aller", [[], ["Penicillin"], []]),
      ecName: pick(id, "ecn", ["Mark Rodriguez", "Jamie Cole", "Alex Patel", "Sam Whitfield"]),
      ecPhone: `+1 (${num(id, "ecp1", 200, 999)}) 555-${num(id, "ecp2", 100, 999)}`,
      primaryPain: pick(id, "pp", ["Food noise", "Low energy", "Weight plateau", "Confidence"]),
      struggleDuration: pick(id, "sd", ["1-2 years", "3-5 years", "5-10 years", "10+ years"]),
      primaryDesire: pick(id, "pd", ["Energy + confidence", "Health markers", "Feeling in control"]),
      commitment: "Very — ready to start now",
      sleepQuality: pick(id, "sq", ["Restless", "Good", "Poor"]),
      recommendation: p.program.startsWith("tirz") ? "Tirzepatide (pace: faster)" : "Semaglutide (steady)",
    },
  };
}

/* ── Selectors ── */

export type ChurnKey = Patient["churn"];

export type ListParams = {
  statusTab: PatientStatus | "all";
  segment: string | null;
  search: string;
  sort: { key: string; dir: "asc" | "desc" };
  page: number;
  pageSize: number;
};

function matchesSearch(p: Patient, q: string): boolean {
  if (!q) return true;
  const s = q.toLowerCase().trim();
  return (
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(s) ||
    p.email.toLowerCase().includes(s) ||
    p.phone.toLowerCase().includes(s) ||
    p.state.toLowerCase().includes(s) ||
    p.id.toLowerCase().includes(s)
  );
}

export function selectPatientKpis(s: AdminState) {
  const total = s.patients.length;
  const active = s.patients.filter((p) => p.status === "active").length;
  const churned = s.patients.filter((p) => p.status === "cancelled").length;
  const failed = s.patients.filter((p) => p.status === "failed");
  const failedCount = failed.length;
  const failedRisk = failed.reduce((sum, p) => sum + PROGRAMS[p.program].price, 0);
  const monthAgo = Date.now() - 30 * DAY;
  const priorAgo = Date.now() - 60 * DAY;
  const newThisMonth = s.patients.filter((p) => Date.parse(p.startedAt) >= monthAgo).length;
  const priorMonth = s.patients.filter((p) => {
    const t = Date.parse(p.startedAt);
    return t >= priorAgo && t < monthAgo;
  }).length;
  const churnRate = total ? Math.round((churned / total) * 1000) / 10 : 0;
  return { total, active, newThisMonth, priorMonth, churned, churnRate, failedCount, failedRisk };
}

export function selectStatusCounts(s: AdminState) {
  const counts: Record<PatientStatus | "all", number> = {
    all: s.patients.length,
    active: 0,
    pending: 0,
    paused: 0,
    failed: 0,
    cancelled: 0,
    denied: 0,
  };
  for (const p of s.patients) counts[p.status]++;
  return counts;
}

export type Segment = {
  key: string;
  label: string;
  test: (p: Patient, e: EnrichedPatient) => boolean;
};

export const SEGMENTS: Segment[] = [
  { key: "month2_risk", label: "Month 2 — highest churn risk", test: (p, e) => p.status === "active" && e.monthOfPlan === 2 },
  { key: "checkin_due", label: "Check-in due this week", test: (p, e) => p.status === "active" && e.monthOfPlan >= 2 && (e.monthOfPlan % 3 === 0) },
  { key: "checkin_overdue", label: "Check-in overdue", test: (p, e) => p.status === "paused" || (p.status === "active" && e.monthOfPlan >= 3 && e.refillsLeft <= 1) },
  { key: "high_ltv_6mo", label: "High LTV · 6-month plan", test: (p) => p.program.endsWith("6mo") && p.status === "active" },
  { key: "winback", label: "Win-back candidates", test: (p) => p.status === "cancelled" },
  { key: "no_portal_14d", label: "No portal login in 14 days", test: (p, e) => e.lastLoginAt < Date.now() - 14 * DAY },
];

export function selectSegmentCounts(s: AdminState) {
  const out: Record<string, number> = {};
  for (const seg of SEGMENTS) out[seg.key] = 0;
  for (const p of s.patients) {
    const e = enrichPatient(p);
    for (const seg of SEGMENTS) if (seg.test(p, e)) out[seg.key]++;
  }
  return out;
}

export function selectPatients(s: AdminState, params: ListParams) {
  const seg = params.segment ? SEGMENTS.find((x) => x.key === params.segment) ?? null : null;
  let list = s.patients.filter((p) => {
    if (params.statusTab !== "all" && p.status !== params.statusTab) return false;
    if (!matchesSearch(p, params.search)) return false;
    if (seg) {
      const e = enrichPatient(p);
      if (!seg.test(p, e)) return false;
    }
    return true;
  });

  const dir = params.sort.dir === "asc" ? 1 : -1;
  const key = params.sort.key as keyof Patient;
  list = [...list].sort((a, b) => {
    if (key === "startedAt") return (Date.parse(a.startedAt) - Date.parse(b.startedAt)) * dir;
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
  });

  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  const paged = list.slice(start, start + params.pageSize);
  return { rows: paged, total, pageCount: Math.max(1, Math.ceil(total / params.pageSize)) };
}

export function selectPatientOrders(s: AdminState, patientId: string): Order[] {
  return s.orders.filter((o) => o.patientId === patientId);
}
export function selectPatientPayments(s: AdminState, patientId: string): Payment[] {
  return s.payments.filter((p) => p.patientId === patientId);
}

export function selectPatientTimeline(s: AdminState, patientId: string, enriched: EnrichedPatient) {
  const events: Array<{ ts: number; text: string; tone: "info" | "success" | "warn" | "critical" }> = [];
  const orders = selectPatientOrders(s, patientId);
  const payments = selectPatientPayments(s, patientId);
  const startMs = Date.parse(enriched.startedAt);
  events.push({ ts: startMs, text: `Order placed — ${enriched.patientCode}`, tone: "success" });
  events.push({ ts: startMs + 3 * 3600_000, text: `Physician approved by ${enriched.physicianName}`, tone: "success" });
  events.push({ ts: startMs + 4 * 3600_000, text: `Rx sent to ${enriched.pharmacy}`, tone: "info" });
  for (const o of orders) {
    events.push({ ts: Date.parse(o.createdAt), text: `Shipment ${o.status} — ${o.id}`, tone: o.status === "exception" ? "critical" : "info" });
  }
  for (const p of payments) {
    events.push({
      ts: Date.parse(p.createdAt),
      text: `${p.status === "succeeded" ? "Charged" : p.status === "refunded" ? "Refunded" : "Payment failed"} $${p.amount} · ${p.method}`,
      tone: p.status === "failed" ? "critical" : p.status === "refunded" ? "warn" : "success",
    });
  }
  events.push({ ts: enriched.lastLoginAt, text: "Patient logged into portal", tone: "info" });
  events.push({ ts: enriched.lastEmailOpenedAt, text: "Email opened by patient", tone: "info" });
  return events.sort((a, b) => b.ts - a.ts);
}

export function programToLabel(code: ProgramCode) {
  return PROGRAMS[code].label;
}
