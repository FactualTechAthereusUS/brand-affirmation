/**
 * Blissley Admin — client-side store.
 * useSyncExternalStore + localStorage. No backend.
 */
import { useSyncExternalStore, useRef } from "react";
import {
  PHYSICIANS, PHARMACIES, CASES, CHECK_INS, NOTIFICATIONS, INTEGRATIONS,
  CAMPAIGNS, generateFunnelDays,
} from "./seeds";

/* ────────── Types ────────── */
export type PatientStatus = "active" | "pending" | "paused" | "failed" | "cancelled";
export type ChurnRisk = "low" | "medium" | "high" | "critical";
export type ProgramCode = "tirz_mo" | "tirz_3mo" | "tirz_6mo" | "sema_mo" | "sema_3mo" | "sema_6mo";

export type DemoScenario = "healthy" | "crisis" | "churn" | "launch" | "empty";
export type Role = "owner" | "ops" | "clinical" | "support";

export type Physician = {
  id: string;
  name: string;
  avatar: string;
  casesReviewed: number;
  avgResponseHrs: number;
  denialRate: number;
};

export type Pharmacy = {
  id: string;
  name: string;
  role: "primary" | "backup";
  apiStatus: "connected" | "degraded" | "down";
  queue: number;
  avgPrepHrs: number;
  onTimeRate: number;
  drugs: string[];
};

export type PhysicianCase = {
  id: string;
  patientId: string;
  patientName: string;
  product: string;
  submittedAt: number;
  slaHrs: number;
  priority: "urgent" | "normal";
  flags: string[];
  assignedTo: string;
  status: "new" | "flagged" | "awaitingReply" | "approved" | "denied" | "refill";
  decision?: string;
  note?: string;
};

export type CheckIn = {
  id: string;
  patientId: string;
  patientName: string;
  day: number;
  submittedAt?: number;
  weight?: number;
  delta?: number;
  sideEffects?: string[];
  decision: "clear" | "hold" | "review";
};

export type NotificationTone = "info" | "success" | "warn" | "critical";
export type Notification = {
  id: string;
  ts: number;
  tone: NotificationTone;
  title: string;
  detail: string;
  deepLink: string;
  unread: boolean;
};

export type Integration = {
  id: string;
  name: string;
  category: "Critical" | "Clinical" | "Analytics" | "Banking";
  status: "connected" | "degraded" | "down";
  lastSync: number;
  lastError?: string;
};

export type Campaign = {
  id: string;
  name: string;
  channel: "Meta" | "Google" | "Email" | "Affiliate" | "Organic";
  spend: number;
  roas: number;
  cac: number;
  leads: number;
  purchases: number;
};

export type FunnelDay = {
  ts: number;
  sessions: number;
  intakeStarted: number;
  intakeCompleted: number;
  approved: number;
  paid: number;
  shipped: number;
  revenue: number;
  newMrr: number;
  churnedMrr: number;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: PatientStatus;
  program: ProgramCode;
  mrr: number;
  ltv: number;
  startedAt: string;
  churn: ChurnRisk;
  state: string;
};

export type OrderStatus = "processing" | "at_pharmacy" | "shipped" | "delivered" | "exception";
export type Order = {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  status: OrderStatus;
  program: ProgramCode;
  createdAt: string;
  tracking?: string;
  eta?: string;
};

export type PaymentStatus = "succeeded" | "failed" | "refunded";
export type Payment = {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  method: string;
  failureReason?: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  lastStep: string;
  program: string;
  source: string;
  ageHrs: number;
  contacted: boolean;
};

export type TaskCategory = "billing" | "care_ops" | "fulfillment" | "compliance" | "admin";
export type Task = {
  id: string;
  subject: string;
  action: string;
  ageHrs: number;
  status: "open" | "waiting" | "done";
  assignee: string;
  category: TaskCategory;
};

export type MessageChannel = "in_app" | "sms" | "email" | "whatsapp";
export type ConvoStatus = "unassigned" | "support" | "physician" | "closed";
export type ConvoTag = "clinical" | "intake" | "shipping" | "billing" | "refund" | "general";

export type ConvoMessage = {
  id: string;
  from: "me" | "them";
  authorName?: string;
  text: string;
  ts: number;
  internal?: boolean;
};

export type Conversation = {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  preview: string;
  channel: MessageChannel;
  status: ConvoStatus;
  tag: ConvoTag;
  assignedTo: string;
  updatedAt: number;
  unread: boolean;
  messages: ConvoMessage[];
  program: ProgramCode;
  ltv: number;
  startedAt: string;
  internalNote: string;
};

export type ActivityEvent = {
  id: string;
  ts: number;
  text: string;
  tone: "info" | "success" | "warn" | "critical";
};

export type Alert = {
  id: string;
  severity: "critical" | "warn";
  title: string;
  detail: string;
  action: string;
};

export type AdminState = {
  session: { email: string; name: string; loggedInAt: number } | null;
  onboardingComplete: boolean;
  dateRange: "24h" | "7d" | "30d" | "4w" | "90d";
  scenario: DemoScenario;
  role: Role;
  patients: Patient[];
  orders: Order[];
  payments: Payment[];
  leads: Lead[];
  tasks: Task[];
  conversations: Conversation[];
  activity: ActivityEvent[];
  alerts: Alert[];
  physicians: Physician[];
  pharmacies: Pharmacy[];
  cases: PhysicianCase[];
  checkIns: CheckIn[];
  notifications: Notification[];
  integrations: Integration[];
  campaigns: Campaign[];
  funnelDays: FunnelDay[];
  ui: {
    patientDrawerId: string | null;
    orderDrawerId: string | null;
    paymentDrawerId: string | null;
    activeConvoId: string | null;
    activeCaseId: string | null;
    patientFilter: PatientStatus | "all";
    patientSearch: string;
    showLogoMenu: boolean;
  };
};

/* ────────── Programs ────────── */
export const PROGRAMS: Record<ProgramCode, { label: string; price: number; family: "tirz" | "sema" }> = {
  tirz_mo: { label: "Tirzepatide · Monthly", price: 299, family: "tirz" },
  tirz_3mo: { label: "Tirzepatide · 3-Month", price: 339, family: "tirz" },
  tirz_6mo: { label: "Tirzepatide · 6-Month", price: 299, family: "tirz" },
  sema_mo: { label: "Semaglutide · Monthly", price: 249, family: "sema" },
  sema_3mo: { label: "Semaglutide · 3-Month", price: 237, family: "sema" },
  sema_6mo: { label: "Semaglutide · 6-Month", price: 237, family: "sema" },
};

/* ────────── Seed helpers ────────── */
const now = Date.now();
const HR = 3600_000;
const DAY = 86400_000;

const FIRST = ["Sarah", "Michael", "Jennifer", "Dana", "Lisa", "Priya", "Hannah", "Eleanor", "Alden", "Robert", "Theo", "Marcus", "Yuki", "Henrik", "Idris", "Omar", "Lena", "Nadia", "Chloé", "Amara", "Zara", "Leo", "Owen", "Maya", "Sofia", "Ethan", "Isabel", "Grace", "Jordan", "Kai", "Rowan", "Elena", "Daiene", "Kristin", "David", "Aiden", "Noah", "Hiroshi", "Ethan", "Julie"];
const LAST = ["Miller", "Thompson", "Reyes", "Kim", "Petrov", "Nair", "Cole", "Whitfield", "Foster", "Kim", "Vance", "Bell", "Tanaka", "Solberg", "Mehta", "Haddad", "Okonkwo", "Chen", "Martel", "Diallo", "Ali", "Nguyen", "Park", "Ross", "Alvarez", "Cohen", "Ivanov", "Sato", "Hughes", "Blake", "Kaur", "Nassar", "Silva", "Peterson", "Brooks", "Patel", "Johnson", "Yamada", "Sullivan", "Martin"];
const STATES = ["CA", "TX", "NY", "FL", "IL", "PA", "OH", "GA", "NC", "MI", "WA", "CO", "AZ", "MA", "VA", "NJ"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function iso(msAgo: number): string { return new Date(now - msAgo).toISOString().slice(0, 10); }

/* ────────── Seed ────────── */
function seed(): AdminState {
  const patients: Patient[] = [];
  const orders: Order[] = [];
  const payments: Payment[] = [];

  for (let i = 0; i < 40; i++) {
    const f = pick(FIRST, i * 3);
    const l = pick(LAST, i * 7 + 2);
    const programKeys = Object.keys(PROGRAMS) as ProgramCode[];
    const program = programKeys[i % programKeys.length];
    const price = PROGRAMS[program].price;
    const monthsIn = (i % 6) + 1;
    const status: PatientStatus =
      i % 13 === 0 ? "failed" :
      i % 11 === 0 ? "cancelled" :
      i % 9 === 0 ? "paused" :
      i % 7 === 0 ? "pending" : "active";
    const churn: ChurnRisk =
      status === "failed" ? "critical" :
      status === "paused" ? "high" :
      monthsIn <= 1 ? "medium" : "low";
    patients.push({
      id: `pt_${1000 + i}`,
      firstName: f,
      lastName: l,
      email: `${f.toLowerCase()}.${l.toLowerCase()}@email.com`,
      phone: `+1 (415) 555-0${(100 + i).toString().padStart(3, "0")}`,
      status,
      program,
      mrr: status === "active" ? price : 0,
      ltv: price * monthsIn,
      startedAt: iso(monthsIn * 30 * DAY),
      churn,
      state: pick(STATES, i * 5),
    });

    // one active order per patient
    const oStatus: OrderStatus =
      status === "pending" ? "processing" :
      i % 8 === 0 ? "at_pharmacy" :
      i % 6 === 0 ? "shipped" :
      i % 17 === 0 ? "exception" : "delivered";
    orders.push({
      id: `ord_${20400 + i}`,
      patientId: `pt_${1000 + i}`,
      patientName: `${f} ${l}`,
      amount: price,
      status: oStatus,
      program,
      createdAt: iso(((i % 20) + 1) * DAY),
      tracking: oStatus !== "processing" ? `1Z999AA10${(10000000 + i * 137).toString().slice(0, 10)}` : undefined,
      eta: oStatus === "shipped" ? iso(-2 * DAY) : undefined,
    });

    // one payment per patient (a few failed)
    const payStatus: PaymentStatus =
      status === "failed" ? "failed" :
      i % 15 === 0 ? "refunded" : "succeeded";
    payments.push({
      id: `py_${30500 + i}`,
      patientId: `pt_${1000 + i}`,
      patientName: `${f} ${l}`,
      amount: price,
      status: payStatus,
      createdAt: iso(((i % 25) + 1) * DAY),
      method: `Visa · ${(4242 + i).toString().slice(-4)}`,
      failureReason: payStatus === "failed" ? "insufficient_funds" : undefined,
    });
  }

  const leads: Lead[] = Array.from({ length: 15 }, (_, i) => ({
    id: `ld_${900 + i}`,
    name: `${pick(FIRST, i * 4 + 1)} ${pick(LAST, i * 6 + 3)}`,
    email: `lead${i}@email.com`,
    lastStep: pick(["Q3 · Health history", "Q7 · State", "Q9 · Weight goal", "Q12 · Plan select", "Q14 · Payment"], i),
    program: i % 2 === 0 ? "Tirzepatide" : "Semaglutide",
    source: pick(["Meta", "Google", "Organic", "Referral"], i),
    ageHrs: 3 + i * 4,
    contacted: false,
  }));

  const tasks: Task[] = [
    { id: "t1", subject: "Your clinic", action: "Pay overdue invoice", ageHrs: 18, status: "open", assignee: "Unassigned", category: "billing" },
    { id: "t2", subject: "Your clinic", action: "Payment method update", ageHrs: 16, status: "open", assignee: "Unassigned", category: "billing" },
    { id: "t3", subject: "Lena Petrov", action: "Cancel request", ageHrs: 96, status: "open", assignee: "Andre F.", category: "billing" },
    { id: "t4", subject: "Your clinic", action: "Compliance doc", ageHrs: 48, status: "open", assignee: "Unassigned", category: "compliance" },
    { id: "t5", subject: "Yuki Tanaka", action: "Stalled order", ageHrs: 3, status: "open", assignee: "Unassigned", category: "fulfillment" },
    { id: "t6", subject: "Henrik Solberg", action: "Dispute", ageHrs: 2, status: "open", assignee: "Unassigned", category: "billing" },
    { id: "t7", subject: "Idris Mehta", action: "Bloodwork incomplete", ageHrs: 24, status: "waiting", assignee: "Unassigned", category: "care_ops" },
    { id: "t8", subject: "Marcus Bell", action: "Failed payment", ageHrs: 5, status: "open", assignee: "Unassigned", category: "billing" },
    { id: "t9", subject: "Omar Haddad", action: "Refund request", ageHrs: 72, status: "open", assignee: "Unassigned", category: "billing" },
    { id: "t10", subject: "Nadia Okonkwo", action: "New physician question", ageHrs: 4, status: "open", assignee: "Unassigned", category: "care_ops" },
    { id: "t11", subject: "System", action: "Weekly retention report", ageHrs: 22, status: "open", assignee: "Ops", category: "admin" },
    { id: "t12", subject: "Sarah Miller", action: "Address change verification", ageHrs: 6, status: "open", assignee: "Unassigned", category: "fulfillment" },
  ];

  const convoBase: Array<Omit<Conversation, "messages" | "id"> & { messages: ConvoMessage[] }> = [
    {
      patientId: "pt_1005", patientName: "Priya Nair", patientEmail: "priya@gmail.com", patientPhone: "+1 (408) 565-0173",
      preview: "I started 0.5mg dose on Friday…", channel: "in_app", status: "unassigned", tag: "clinical", assignedTo: "Unassigned",
      updatedAt: now - 12 * 60 * 1000, unread: true, program: "tirz_mo", ltv: 415, startedAt: "Jun 1, 2026",
      internalNote: "Week 1 of titration. Route clinical questions to Dr. Nass before replying.",
      messages: [
        { id: "cm1", from: "them", authorName: "Priya Nair", text: "Hi, I started the 0.5mg dose on Friday and I've had some nausea since yesterday. Is that normal or should I stop?", ts: now - 60 * 60 * 1000 },
      ],
    },
    {
      patientId: "pt_1006", patientName: "Hannah Cole", patientEmail: "hannah@email.com", patientPhone: "+1 (415) 555-0189",
      preview: "I finished the intake form but…", channel: "email", status: "support", tag: "intake", assignedTo: "Andre F.",
      updatedAt: now - 4 * HR, unread: false, program: "sema_mo", ltv: 249, startedAt: "Jul 20, 2026", internalNote: "",
      messages: [
        { id: "cm2a", from: "them", authorName: "Hannah Cole", text: "I finished the intake form but haven't heard back yet.", ts: now - 5 * HR },
        { id: "cm2b", from: "me", authorName: "Andre F.", text: "Hi Hannah — you're in Dr. Nass's review queue. Approvals typically come back within 24h.", ts: now - 4 * HR },
      ],
    },
    {
      patientId: "pt_1010", patientName: "Eleanor Whitfield", patientEmail: "eleanor@email.com", patientPhone: "+1 (415) 555-0221",
      preview: "Where is my refill order?", channel: "sms", status: "unassigned", tag: "shipping", assignedTo: "Unassigned",
      updatedAt: now - 42 * 60 * 1000, unread: true, program: "tirz_3mo", ltv: 1017, startedAt: "Apr 12, 2026", internalNote: "",
      messages: [{ id: "cm3", from: "them", authorName: "Eleanor Whitfield", text: "Where is my refill order? It was supposed to arrive yesterday.", ts: now - 42 * 60 * 1000 }],
    },
    {
      patientId: "pt_1015", patientName: "Alden Foster", patientEmail: "alden@email.com", patientPhone: "+1 (415) 555-0234",
      preview: "Insurance support question…", channel: "in_app", status: "support", tag: "billing", assignedTo: "Ops",
      updatedAt: now - 3 * DAY, unread: false, program: "sema_3mo", ltv: 711, startedAt: "May 8, 2026", internalNote: "",
      messages: [{ id: "cm4", from: "them", authorName: "Alden Foster", text: "Can I get a receipt for HSA reimbursement?", ts: now - 3 * DAY }],
    },
    {
      patientId: "pt_1020", patientName: "Robert Kim", patientEmail: "robert@email.com", patientPhone: "+1 (415) 555-0245",
      preview: "Requesting a refund…", channel: "email", status: "unassigned", tag: "refund", assignedTo: "Unassigned",
      updatedAt: now - 1 * HR, unread: true, program: "tirz_mo", ltv: 299, startedAt: "Jun 30, 2026", internalNote: "",
      messages: [{ id: "cm5", from: "them", authorName: "Robert Kim", text: "I'd like to request a refund on my last order — I stopped taking the medication.", ts: now - 1 * HR }],
    },
    {
      patientId: "pt_1025", patientName: "Theo Vance", patientEmail: "theo@email.com", patientPhone: "+1 (415) 555-0258",
      preview: "Compound question…", channel: "whatsapp", status: "physician", tag: "clinical", assignedTo: "Dr. Nass",
      updatedAt: now - 2 * HR, unread: false, program: "tirz_3mo", ltv: 678, startedAt: "May 20, 2026", internalNote: "",
      messages: [{ id: "cm6", from: "them", authorName: "Theo Vance", text: "Is the compound the same strength across shipments?", ts: now - 2 * HR }],
    },
    {
      patientId: "pt_1030", patientName: "Marcus Bell", patientEmail: "marcus@email.com", patientPhone: "+1 (415) 555-0269",
      preview: "See you then…", channel: "in_app", status: "closed", tag: "general", assignedTo: "Andre F.",
      updatedAt: now - 5 * HR, unread: false, program: "sema_mo", ltv: 498, startedAt: "Apr 30, 2026", internalNote: "",
      messages: [{ id: "cm7", from: "them", authorName: "Marcus Bell", text: "See you then, thanks!", ts: now - 5 * HR }],
    },
  ];
  const conversations: Conversation[] = convoBase.map((c, i) => ({ ...c, id: `cv_${400 + i}` }));

  const activity: ActivityEvent[] = [
    { id: "a1", ts: now - 22 * 60 * 1000, text: "Sarah Miller completed intake", tone: "info" },
    { id: "a2", ts: now - 25 * 60 * 1000, text: "BLS-00421 shipped — tracking assigned", tone: "success" },
    { id: "a3", ts: now - 48 * 60 * 1000, text: "Dana Kim — physician approved", tone: "success" },
    { id: "a4", ts: now - 71 * 60 * 1000, text: "Michael Thompson — payment failed, retrying", tone: "warn" },
    { id: "a5", ts: now - 93 * 60 * 1000, text: "Jennifer Reyes — billing reminder sent", tone: "info" },
    { id: "a6", ts: now - 2 * HR, text: "New physician question from Priya Nair", tone: "warn" },
    { id: "a7", ts: now - 3 * HR, text: "Refund issued — $299 to Robert Kim", tone: "info" },
    { id: "a8", ts: now - 4 * HR, text: "Delivery confirmed — Eleanor Whitfield", tone: "success" },
  ];

  const alerts: Alert[] = [
    { id: "al1", severity: "critical", title: "3 failed payments", detail: "Cards declined on renewal in the last 24h.", action: "Review" },
    { id: "al2", severity: "critical", title: "1 shipment delayed", detail: "Carrier exception flagged on ord_20415.", action: "Contact carrier" },
    { id: "al3", severity: "warn", title: "2 check-ins overdue", detail: "Day 95+, subscription held.", action: "Nudge" },
    { id: "al4", severity: "warn", title: "1 refund pending", detail: "Requested 48hrs ago, unprocessed.", action: "Process" },
  ];

  return {
    session: null,
    onboardingComplete: false,
    dateRange: "4w",
    scenario: "healthy",
    role: "owner",
    patients,
    orders,
    payments,
    leads,
    tasks,
    conversations,
    activity,
    alerts,
    physicians: PHYSICIANS,
    pharmacies: PHARMACIES,
    cases: CASES,
    checkIns: CHECK_INS,
    notifications: NOTIFICATIONS,
    integrations: INTEGRATIONS,
    campaigns: CAMPAIGNS,
    funnelDays: generateFunnelDays(),
    ui: {
      patientDrawerId: null,
      orderDrawerId: null,
      paymentDrawerId: null,
      activeConvoId: conversations[0]?.id ?? null,
      activeCaseId: null,
      patientFilter: "all",
      patientSearch: "",
      showLogoMenu: false,
    },
  };
}

/* ────────── Storage ────────── */
const KEY = "blissley.admin.v1";

function load(): AdminState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminState;
      if (!parsed.ui) parsed.ui = seed().ui;
      return parsed;
    }
  } catch {}
  const s = seed();
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s;
}

let state: AdminState = typeof window !== "undefined" ? load() : seed();
const listeners = new Set<() => void>();

function persist() { try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function set(patch: Partial<AdminState> | ((s: AdminState) => Partial<AdminState>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  persist();
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }
function getSnap() { return state; }

export function useAdmin<T>(selector: (s: AdminState) => T): T {
  const cache = useRef<{ state: AdminState | null; value: T }>({ state: null, value: undefined as unknown as T });
  const get = () => {
    if (cache.current.state === state) return cache.current.value;
    const next = selector(state);
    const prev = cache.current.value;
    const same = Object.is(prev, next) ||
      (Array.isArray(prev) && Array.isArray(next) && prev.length === (next as unknown as unknown[]).length && prev.every((v, i) => Object.is(v, (next as unknown as unknown[])[i])));
    const value = same ? prev : next;
    cache.current = { state, value };
    return value;
  };
  return useSyncExternalStore(subscribe, get, get);
}

/* ────────── KPI / analytics derivations ────────── */
export function computeKpis(s: AdminState) {
  const activePatients = s.patients.filter((p) => p.status === "active");
  const mrr = activePatients.reduce((sum, p) => sum + p.mrr, 0);
  const netRevenue = s.payments.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0)
    - s.payments.filter((p) => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0);
  const aov = activePatients.length ? Math.round(activePatients.reduce((sum, p) => sum + p.mrr, 0) / activePatients.length) : 0;
  const retention = Math.round((activePatients.length / Math.max(1, s.patients.length - s.patients.filter(p => p.status === "pending").length)) * 1000) / 10;
  return { mrr, netRevenue, activeCount: activePatients.length, aov, retention };
}

export function pipelineCounts(s: AdminState) {
  return {
    inReview: 38,
    approved: 17,
    atPharmacy: s.orders.filter((o) => o.status === "at_pharmacy").length,
    shipped: s.orders.filter((o) => o.status === "shipped").length,
    delivered: s.orders.filter((o) => o.status === "delivered").length,
  };
}

export function funnelData() {
  return [
    { label: "Traffic", count: 12480, pct: 100 },
    { label: "Intake started", count: 4612, pct: 37.0 },
    { label: "Submitted", count: 3348, pct: 26.8 },
    { label: "Medical review", count: 3098, pct: 24.8 },
    { label: "Approved", count: 2743, pct: 22.0 },
    { label: "Rx sent", count: 2610, pct: 20.9 },
    { label: "Shipped", count: 2492, pct: 20.0 },
    { label: "Refill (M2)", count: 1304, pct: 10.4 },
  ];
}

export function mrrMovement() {
  return [
    { label: "New", value: 11400, kind: "pos" as const },
    { label: "Expansion", value: 3500, kind: "pos" as const },
    { label: "Reactivated", value: 1500, kind: "pos" as const },
    { label: "Downgrade", value: -1800, kind: "neg" as const },
    { label: "Cancelled", value: -3300, kind: "neg" as const },
    { label: "Failed pmt", value: -3900, kind: "neg" as const },
  ];
}

export function revenueByProgram() {
  return [
    { code: "tirz_3mo", label: "Tirzepatide 3-Month", revenue: 42600, patients: 126 },
    { code: "tirz_mo", label: "Tirzepatide Monthly", revenue: 38200, patients: 128 },
    { code: "tirz_6mo", label: "Tirzepatide 6-Month", revenue: 18600, patients: 62 },
    { code: "sema_mo", label: "Semaglutide Monthly", revenue: 12480, patients: 50 },
    { code: "sema_3mo", label: "Semaglutide 3-Month", revenue: 10640, patients: 45 },
    { code: "sema_6mo", label: "Semaglutide 6-Month", revenue: 4960, patients: 21 },
  ];
}

export function acquisitionMix() {
  return [
    { label: "Meta", value: 48, color: "#ee7273" },
    { label: "Google", value: 27, color: "#1D437B" },
    { label: "Organic", value: 18, color: "#4a7c6f" },
    { label: "Referral", value: 7, color: "#c4a265" },
  ];
}

export function trafficHeatmap() {
  // 7 rows (Mon..Sun) × 6 columns (4hr blocks)
  const seedVals = [
    [12, 8, 42, 68, 88, 52],
    [14, 10, 46, 72, 92, 58],
    [15, 11, 48, 74, 90, 60],
    [13, 9, 45, 70, 84, 55],
    [11, 10, 40, 60, 78, 66],
    [8, 6, 30, 48, 72, 74],
    [6, 5, 24, 40, 62, 62],
  ];
  return seedVals;
}

export function cohortRetention() {
  return [
    { month: "Jan '26", started: 284, values: [100, 71.5, 61.2, 54.8, 49.3, 44.1] },
    { month: "Feb '26", started: 312, values: [100, 73.1, 63.7, 57.2, 52.4, null] },
    { month: "Mar '26", started: 298, values: [100, 69.8, 60.4, 53.9, null, null] },
    { month: "Apr '26", started: 341, values: [100, 74.2, 64.8, null, null, null] },
    { month: "May '26", started: 387, values: [100, 76.1, null, null, null, null] },
    { month: "Jun '26", started: 421, values: [100, null, null, null, null, null] },
  ] as Array<{ month: string; started: number; values: Array<number | null> }>;
}

export function trafficOverTime() {
  const weeks = ["W1", "W2", "W3", "W4"];
  return weeks.map((w, i) => ({
    week: w,
    paid: 24000 + i * 3200 + (i % 2 === 0 ? 1800 : -900),
    organic: 12000 + i * 1400,
    direct: 6000 + i * 400,
    referral: 2400 + i * 200,
  }));
}

/* ────────── Actions ────────── */
export const adminActions = {
  signIn(email: string) {
    set({ session: { email, name: email.split("@")[0].replace(/\./g, " "), loggedInAt: Date.now() } });
  },
  signOut() { set({ session: null }); },
  completeOnboarding() { set({ onboardingComplete: true }); },
  setDateRange(r: AdminState["dateRange"]) { set({ dateRange: r }); },

  openPatient(id: string | null) { set((s) => ({ ui: { ...s.ui, patientDrawerId: id } })); },
  openOrder(id: string | null) { set((s) => ({ ui: { ...s.ui, orderDrawerId: id } })); },
  openPayment(id: string | null) { set((s) => ({ ui: { ...s.ui, paymentDrawerId: id } })); },
  setActiveConvo(id: string | null) {
    set((s) => ({
      ui: { ...s.ui, activeConvoId: id },
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    }));
  },
  setPatientFilter(f: PatientStatus | "all") { set((s) => ({ ui: { ...s.ui, patientFilter: f } })); },
  setPatientSearch(q: string) { set((s) => ({ ui: { ...s.ui, patientSearch: q } })); },
  toggleLogoMenu(open?: boolean) { set((s) => ({ ui: { ...s.ui, showLogoMenu: open ?? !s.ui.showLogoMenu } })); },
  setScenario(sc: DemoScenario) {
    set(() => {
      const fresh = seed();
      if (sc === "empty") {
        return { scenario: sc, patients: [], orders: [], payments: [], cases: [], checkIns: [], notifications: [], activity: [], tasks: [], conversations: [], alerts: [], leads: [] };
      }
      if (sc === "crisis") {
        return {
          scenario: sc,
          payments: fresh.payments.map((p, i) => (i < 12 ? { ...p, status: "failed" as const, failureReason: "insufficient_funds" } : p)),
          pharmacies: fresh.pharmacies.map((ph, i) => (i < 2 ? { ...ph, apiStatus: "degraded" as const, avgPrepHrs: ph.avgPrepHrs + 18 } : ph)),
          cases: fresh.cases.map((c, i) => (i < 5 ? { ...c, priority: "urgent" as const, flags: [...c.flags, "SLA breach"] } : c)),
          notifications: [...fresh.notifications, { id: "n_crisis", ts: Date.now(), tone: "critical" as const, title: "Payment gateway degraded", detail: "Stripe returning 5xx on 8% of charges", deepLink: "/admin/integrations", unread: true }],
        };
      }
      if (sc === "churn") {
        return {
          scenario: sc,
          patients: fresh.patients.map((p, i) => (i < 8 && p.status === "active" ? { ...p, status: "cancelled" as const, mrr: 0, churn: "critical" as const } : p)),
        };
      }
      if (sc === "launch") {
        return {
          scenario: sc,
          patients: [...fresh.patients, ...Array.from({ length: 12 }, (_, i) => ({
            id: `pt_launch_${i}`, firstName: "Launch", lastName: `Lead ${i}`, email: `launch${i}@email.com`,
            phone: `+1 (555) 555-01${i.toString().padStart(2, "0")}`, status: "pending" as const,
            program: "tirz_mo" as const, mrr: 0, ltv: 0, startedAt: new Date().toISOString().slice(0, 10),
            churn: "low" as const, state: "CA",
          }))],
        };
      }
      return { scenario: sc, ...fresh };
    });
  },
  setRole(r: Role) { set({ role: r }); },
  markNotificationRead(id: string) {
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)) }));
  },
  markAllNotificationsRead() {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, unread: false })) }));
  },
  approveCase(id: string) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === id ? { ...c, status: "approved" as const, decision: "Approved" } : c)) }));
  },
  denyCase(id: string, reason: string) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === id ? { ...c, status: "denied" as const, decision: reason } : c)) }));
  },
  toggleIntegration(id: string) {
    set((s) => ({ integrations: s.integrations.map((i) => (i.id === id ? { ...i, status: i.status === "connected" ? "down" as const : "connected" as const, lastSync: Date.now() } : i)) }));
  },
  setActiveCase(id: string | null) { set((s) => ({ ui: { ...s.ui, activeCaseId: id } })); },
  sendCheckInReminder(id: string) {
    set((s) => ({ activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Check-in reminder sent — ${s.checkIns.find(c => c.id === id)?.patientName ?? "patient"}`, tone: "info" as const }, ...s.activity] }));
  },

  resolveTask(id: string) {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: "done" } : t)) }));
  },
  resolveAlert(id: string) {
    set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) }));
  },
  retryPayment(id: string) {
    set((s) => ({ payments: s.payments.map((p) => (p.id === id ? { ...p, status: "succeeded", failureReason: undefined } : p)) }));
  },
  refundPayment(id: string) {
    set((s) => ({ payments: s.payments.map((p) => (p.id === id ? { ...p, status: "refunded" } : p)) }));
  },
  reshipOrder(id: string) {
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: "processing", tracking: undefined } : o)) }));
  },
  sendReply(convoId: string, text: string, internal = false) {
    const msg: ConvoMessage = { id: `cm${Date.now()}`, from: "me", authorName: "You", text, ts: Date.now(), internal };
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === convoId ? { ...c, messages: [...c.messages, msg], preview: text, updatedAt: Date.now() } : c,
      ),
    }));
    if (!internal) {
      setTimeout(() => {
        set((s) => {
          const convo = s.conversations.find((c) => c.id === convoId);
          if (!convo) return {};
          const reply: ConvoMessage = {
            id: `cm${Date.now()}r`,
            from: "them",
            authorName: convo.patientName,
            text: "Thanks — got it. Appreciate the quick reply.",
            ts: Date.now(),
          };
          return {
            conversations: s.conversations.map((c) =>
              c.id === convoId ? { ...c, messages: [...c.messages, reply], preview: reply.text, updatedAt: Date.now(), unread: true } : c,
            ),
          };
        });
      }, 1800);
    }
  },
  assignConvo(convoId: string, to: string, status: ConvoStatus) {
    set((s) => ({ conversations: s.conversations.map((c) => (c.id === convoId ? { ...c, assignedTo: to, status } : c)) }));
  },
  markLeadContacted(id: string) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, contacted: true } : l)) }));
  },
  resetAll() {
    state = seed();
    persist();
    listeners.forEach((l) => l());
  },
};

export function hydrateAdmin() {
  if (typeof window === "undefined") return;
  state = load();
  listeners.forEach((l) => l());
}
