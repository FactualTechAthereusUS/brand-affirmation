/**
 * Blissley Physician Portal — client-side store.
 * useSyncExternalStore + localStorage. No backend.
 */
import { useSyncExternalStore, useRef } from "react";

/* ────────── Types ────────── */
export type CaseStatus = "new" | "in_review" | "awaiting_info" | "approved" | "rejected";
export type FlagSeverity = "info" | "warn" | "critical";
export type Product = "semaglutide" | "tirzepatide";

export type Flag = { id: string; severity: FlagSeverity; label: string; detail: string };

export type IntakeGroup = { title: string; items: { q: string; a: string }[] };

export type Glp1History = {
  taking: boolean;
  lastInjectionDate?: string;
  lastInjectionUnits?: number;
  monthsOn?: number;
};

export type Rx = {
  drug: string;
  strength: string;
  dose: string;
  frequency: string;
  quantity: string;
  refills: number;
  sig: string;
  pharmacy: string;
};

export type Case = {
  id: string;
  patient: {
    firstName: string;
    lastName: string;
    age: number;
    sex: "F" | "M";
    state: string;
    bmi: number;
    startingWeight: number;
    heightIn: number;
    email: string;
  };
  product: Product;
  submittedAt: number;   // ms since epoch
  openedAt?: number;
  status: CaseStatus;
  flags: Flag[];
  flagSummary: string;   // one-liner for the card
  intake: IntakeGroup[];
  glp1: Glp1History;
  rx: Rx;
  patientNote: string;   // shown to patient
  internalNote: string;  // audit-only
  rejectReason?: string;
};

export type RefillCheckIn = {
  currentWeight: number;
  weightDelta: number; // negative = lost
  sideEffects: "none" | "nausea" | "other";
  sideEffectsDetail?: string;
  lastInjectionDate: string;
  lastInjectionUnits: number;
  monthsOn: number;
  newMeds: string; // "" if none
  otherNotes: string;
  submittedAt: number;
};

export type Refill = {
  id: string;
  caseId: string;
  patientFirst: string;
  patientLast: string;
  state: string;
  product: Product;
  monthNumber: number;
  currentDose: string;
  status: "pending" | "approved";
  checkIn: RefillCheckIn;
  flagged: boolean; // if new med / regain / side effect
};

export type PhysMessage = {
  id: string;
  threadId: string;
  from: "patient" | "me";
  text: string;
  ts: number;
  read: boolean;
};

export type Thread = {
  id: string;
  patientFirst: string;
  patientLast: string;
  product: Product;
  monthNumber: number;
  currentDose: string;
  allergies: string;
  lastActivity: number;
  waitingHours: number;
};

export type Physician = {
  name: string;
  displayName: string;
  credentials: string;
  npi: string;
  dea: string;
  licensedStates: string[];
  licenseExpiry: Record<string, string>; // state → ISO date
};

export type LicenseAlert = "none" | "d30" | "d7";

export type Toast = { id: string; kind: "success" | "info" | "warn"; text: string };

export type QueueScenario = "empty" | "normal" | "heavy" | "critical";
export type RefillScenario = "clean" | "new-med" | "regain";
export type MessageScenario = "unread" | "clear";

export type PhysicianState = {
  session: { email: string; loggedInAt: number } | null;
  physician: Physician;
  cases: Case[];
  refills: Refill[];
  threads: Thread[];
  messages: PhysMessage[];
  queueFilters: { product: "all" | Product; flag: "all" | "flagged" | "clean"; state: "all" | string };
  ui: {
    tab: "queue" | "refills" | "messages" | "dashboard" | "profile";
    openCaseId: string | null;
    esignOpen: boolean;
    esignAction: "approve" | "reject" | "info" | null;
    activeThreadId: string | null;
    demoBarOpen: boolean;
    quickRepliesOpen: boolean;
  };
  demo: {
    queue: QueueScenario;
    refill: RefillScenario;
    messages: MessageScenario;
    license: LicenseAlert;
  };
  stats: { reviewedToday: number; avgReviewSec: number; approvalRate: number };
  toasts: Toast[];
};

/* ────────── Seed ────────── */
const now = Date.now();
const HR = 3600_000;

const DR_NASS: Physician = {
  name: "Scott Nass",
  displayName: "Dr. Nass",
  credentials: "MD, MPA, AAHIVS, FAAFP",
  npi: "1568588839",
  dea: "BN3486234",
  licensedStates: ["CA","NY","TX","FL","WA","OR","AZ","NV","CO","IL","MA","GA","PA","NJ","MI","OH","NC","VA"],
  licenseExpiry: { CA: "2026-08-15", NY: "2027-03-31", TX: "2026-09-30", FL: "2028-05-01", WA: "2027-11-30" },
};

function newRx(product: Product, step: "step1" | "step2" | "step3"): Rx {
  const semaMap = { step1: { strength: "2mg/mL", dose: "0.25mg" }, step2: { strength: "5mg/mL", dose: "0.5mg" }, step3: { strength: "5mg/mL", dose: "1.0mg" } };
  const tirzMap = { step1: { strength: "10mg/mL", dose: "2.5mg" }, step2: { strength: "10mg/mL", dose: "5mg" }, step3: { strength: "15mg/mL", dose: "7.5mg" } };
  const map = product === "semaglutide" ? semaMap : tirzMap;
  const s = map[step];
  return {
    drug: product === "semaglutide" ? "Semaglutide Injectable" : "Tirzepatide Injectable",
    strength: s.strength,
    dose: s.dose,
    frequency: "Once weekly, subcutaneous",
    quantity: "1 vial (4-week supply)",
    refills: 2,
    sig: `Inject ${s.dose} subcutaneously once weekly. Rotate injection sites. Titrate per protocol.`,
    pharmacy: "South End Compounding · Charlotte, NC",
  };
}

function seed(): PhysicianState {
  const cases: Case[] = [
    /* 1 · flagged critical */ {
      id: "c-flagged",
      patient: { firstName: "Ashley", lastName: "Chen", age: 34, sex: "F", state: "CA", bmi: 27.4, startingWeight: 168, heightIn: 65, email: "ashley.c@email.com" },
      product: "semaglutide",
      submittedAt: now - 42 * HR,
      status: "new",
      flagSummary: "BMI 27.4 borderline · reports metformin",
      flags: [
        { id: "f1", severity: "warn", label: "Borderline BMI", detail: "BMI 27.4 (needs ≥27 with comorbidity). Patient reports HTN + prediabetes." },
        { id: "f2", severity: "info", label: "On metformin 1000mg", detail: "No interaction with semaglutide. Monitor GI side effects." },
        { id: "f3", severity: "warn", label: "History of gallstones", detail: "Cholecystectomy 2019. Counsel on GI risk." },
      ],
      intake: [
        { title: "Goals", items: [{ q: "Primary goal", a: "Lose 20 lbs before wedding in Oct" }, { q: "Timeline", a: "6 months" }] },
        { title: "Medical history", items: [{ q: "Conditions", a: "HTN (controlled), prediabetes, gallstones (removed 2019)" }, { q: "Surgeries", a: "Cholecystectomy 2019" }, { q: "Family hx", a: "Type 2 diabetes (mother, sister)" }] },
        { title: "Medications & allergies", items: [{ q: "Current meds", a: "Metformin 1000mg BID, Lisinopril 10mg" }, { q: "Allergies", a: "None" }] },
        { title: "GLP-1 exposure", items: [{ q: "Prior GLP-1", a: "No" }] },
        { title: "Contraindications", items: [{ q: "MTC / MEN2", a: "No" }, { q: "Pancreatitis", a: "No" }, { q: "Pregnant / TTC", a: "No" }] },
      ],
      glp1: { taking: false },
      rx: newRx("semaglutide", "step1"),
      patientNote: "",
      internalNote: "",
    },
    /* 2 · clean new */ {
      id: "c-clean",
      patient: { firstName: "Marcus", lastName: "Rivera", age: 41, sex: "M", state: "TX", bmi: 32.1, startingWeight: 224, heightIn: 70, email: "m.rivera@email.com" },
      product: "tirzepatide",
      submittedAt: now - 6 * HR,
      status: "new",
      flagSummary: "Clean · no flags",
      flags: [],
      intake: [
        { title: "Goals", items: [{ q: "Primary goal", a: "Lose 40 lbs, reduce joint pain" }] },
        { title: "Medical history", items: [{ q: "Conditions", a: "None" }, { q: "Surgeries", a: "None" }] },
        { title: "Medications & allergies", items: [{ q: "Current meds", a: "None" }, { q: "Allergies", a: "NKDA" }] },
        { title: "GLP-1 exposure", items: [{ q: "Prior GLP-1", a: "No" }] },
        { title: "Contraindications", items: [{ q: "MTC / MEN2", a: "No" }, { q: "Pancreatitis", a: "No" }] },
      ],
      glp1: { taking: false },
      rx: newRx("tirzepatide", "step1"),
      patientNote: "",
      internalNote: "",
    },
    /* 3 · awaiting info */ {
      id: "c-awaiting",
      patient: { firstName: "Priya", lastName: "Patel", age: 38, sex: "F", state: "NY", bmi: 29.8, startingWeight: 178, heightIn: 64, email: "priya.p@email.com" },
      product: "semaglutide",
      submittedAt: now - 3 * 24 * HR,
      status: "awaiting_info",
      flagSummary: "Awaiting reply · asked about thyroid history",
      flags: [{ id: "f1", severity: "warn", label: "Family thyroid history unclear", detail: "Requested clarification on mother's thyroid cancer type." }],
      intake: [
        { title: "Goals", items: [{ q: "Primary goal", a: "Lose 25 lbs" }] },
        { title: "Medical history", items: [{ q: "Family hx", a: "Mother — thyroid (type unknown)" }] },
        { title: "GLP-1 exposure", items: [{ q: "Prior GLP-1", a: "Yes — Zepbound 2.5mg × 2 months" }] },
      ],
      glp1: { taking: true, lastInjectionDate: "2026-06-15", lastInjectionUnits: 11, monthsOn: 2 },
      rx: newRx("semaglutide", "step2"),
      patientNote: "Could you confirm the type of thyroid cancer your mother had? MTC would rule out this class of medication.",
      internalNote: "",
    },
    /* 4 · older pending */ {
      id: "c-old-1",
      patient: { firstName: "Sara", lastName: "O'Neill", age: 29, sex: "F", state: "FL", bmi: 30.2, startingWeight: 176, heightIn: 65, email: "sara.o@email.com" },
      product: "semaglutide",
      submittedAt: now - 72 * HR,
      status: "new",
      flagSummary: "Clean · no flags",
      flags: [],
      intake: [{ title: "Goals", items: [{ q: "Primary goal", a: "Lose 30 lbs" }] }, { title: "Medical history", items: [{ q: "Conditions", a: "None" }] }],
      glp1: { taking: false },
      rx: newRx("semaglutide", "step1"),
      patientNote: "",
      internalNote: "",
    },
    /* 5 · normal */ {
      id: "c-new-1",
      patient: { firstName: "Daniel", lastName: "Brooks", age: 47, sex: "M", state: "WA", bmi: 34.6, startingWeight: 248, heightIn: 71, email: "d.brooks@email.com" },
      product: "tirzepatide",
      submittedAt: now - 2 * HR,
      status: "new",
      flagSummary: "Clean · no flags",
      flags: [],
      intake: [{ title: "Goals", items: [{ q: "Primary goal", a: "Lose 60 lbs, improve A1c" }] }],
      glp1: { taking: false },
      rx: newRx("tirzepatide", "step1"),
      patientNote: "",
      internalNote: "",
    },
    /* 6 */ {
      id: "c-new-2",
      patient: { firstName: "Emily", lastName: "Nguyen", age: 33, sex: "F", state: "IL", bmi: 28.1, startingWeight: 168, heightIn: 65, email: "e.nguyen@email.com" },
      product: "semaglutide",
      submittedAt: now - 14 * HR,
      status: "new",
      flagSummary: "Clean · no flags",
      flags: [],
      intake: [{ title: "Goals", items: [{ q: "Primary goal", a: "Lose 20 lbs" }] }],
      glp1: { taking: false },
      rx: newRx("semaglutide", "step1"),
      patientNote: "",
      internalNote: "",
    },
    /* 7 */ {
      id: "c-new-3",
      patient: { firstName: "Kevin", lastName: "Park", age: 39, sex: "M", state: "OR", bmi: 31.4, startingWeight: 212, heightIn: 69, email: "k.park@email.com" },
      product: "tirzepatide",
      submittedAt: now - 20 * HR,
      status: "new",
      flagSummary: "Clean · no flags",
      flags: [],
      intake: [{ title: "Goals", items: [{ q: "Primary goal", a: "Lose 40 lbs" }] }],
      glp1: { taking: false },
      rx: newRx("tirzepatide", "step1"),
      patientNote: "",
      internalNote: "",
    },
  ];

  const refills: Refill[] = [
    {
      id: "r-clean",
      caseId: "c-refill-1",
      patientFirst: "Sarah",
      patientLast: "Miller",
      state: "CA",
      product: "semaglutide",
      monthNumber: 3,
      currentDose: "0.5mg weekly",
      status: "pending",
      flagged: false,
      checkIn: {
        currentWeight: 178,
        weightDelta: -12,
        sideEffects: "none",
        lastInjectionDate: "2026-07-14",
        lastInjectionUnits: 34,
        monthsOn: 3,
        newMeds: "",
        otherNotes: "Feeling great. Down 12 lbs.",
        submittedAt: now - 4 * HR,
      },
    },
    {
      id: "r-new-med",
      caseId: "c-refill-2",
      patientFirst: "James",
      patientLast: "Thompson",
      state: "TX",
      product: "tirzepatide",
      monthNumber: 4,
      currentDose: "5mg weekly",
      status: "pending",
      flagged: true,
      checkIn: {
        currentWeight: 202,
        weightDelta: -18,
        sideEffects: "nausea",
        sideEffectsDetail: "Mild nausea day of injection, resolves by day 2.",
        lastInjectionDate: "2026-07-13",
        lastInjectionUnits: 22,
        monthsOn: 4,
        newMeds: "Started sertraline 50mg (anxiety) 3 weeks ago",
        otherNotes: "PCP added SSRI. No other changes.",
        submittedAt: now - 9 * HR,
      },
    },
    {
      id: "r-regain",
      caseId: "c-refill-3",
      patientFirst: "Amanda",
      patientLast: "Foster",
      state: "NY",
      product: "semaglutide",
      monthNumber: 5,
      currentDose: "1.0mg weekly",
      status: "pending",
      flagged: true,
      checkIn: {
        currentWeight: 174,
        weightDelta: -2,
        sideEffects: "other",
        sideEffectsDetail: "Fatigue and low energy last 2 weeks.",
        lastInjectionDate: "2026-07-10",
        lastInjectionUnits: 68,
        monthsOn: 5,
        newMeds: "",
        otherNotes: "Weight regain +6 lbs this month after plateau.",
        submittedAt: now - 26 * HR,
      },
    },
    {
      id: "r-clean-2",
      caseId: "c-refill-4",
      patientFirst: "Rachel",
      patientLast: "Kim",
      state: "WA",
      product: "tirzepatide",
      monthNumber: 2,
      currentDose: "2.5mg weekly",
      status: "pending",
      flagged: false,
      checkIn: {
        currentWeight: 189,
        weightDelta: -8,
        sideEffects: "none",
        lastInjectionDate: "2026-07-15",
        lastInjectionUnits: 11,
        monthsOn: 2,
        newMeds: "",
        otherNotes: "All good.",
        submittedAt: now - 2 * HR,
      },
    },
  ];

  const threads: Thread[] = [
    { id: "t1", patientFirst: "Sarah", patientLast: "Miller", product: "semaglutide", monthNumber: 3, currentDose: "0.5mg weekly", allergies: "None", lastActivity: now - 45 * 60_000, waitingHours: 1 },
    { id: "t2", patientFirst: "James", patientLast: "Thompson", product: "tirzepatide", monthNumber: 4, currentDose: "5mg weekly", allergies: "Penicillin", lastActivity: now - 3 * HR, waitingHours: 3 },
    { id: "t3", patientFirst: "Priya", patientLast: "Patel", product: "semaglutide", monthNumber: 1, currentDose: "0.25mg weekly", allergies: "None", lastActivity: now - 18 * HR, waitingHours: 18 },
    { id: "t4", patientFirst: "Amanda", patientLast: "Foster", product: "semaglutide", monthNumber: 5, currentDose: "1.0mg weekly", allergies: "Sulfa", lastActivity: now - 2 * 24 * HR, waitingHours: 48 },
  ];

  const messages: PhysMessage[] = [
    { id: "m1", threadId: "t1", from: "patient", text: "Hi Dr. Nass — I'm getting mild nausea day of injection. Is that expected in month 3?", ts: now - 45 * 60_000, read: false },
    { id: "m2", threadId: "t2", from: "patient", text: "My PCP just started me on sertraline 50mg for anxiety. Any interaction with tirzepatide?", ts: now - 3 * HR, read: false },
    { id: "m3", threadId: "t2", from: "me", text: "No direct interaction with tirzepatide. Continue current dose. Message me if mood/appetite changes.", ts: now - 2 * HR, read: true },
    { id: "m4", threadId: "t3", from: "patient", text: "Following up on the thyroid question — my mom's was papillary carcinoma, not medullary.", ts: now - 18 * HR, read: false },
    { id: "m5", threadId: "t4", from: "patient", text: "I've plateaued and gained back 6 lbs. What should I do?", ts: now - 2 * 24 * HR, read: false },
  ];

  return {
    session: null,
    physician: DR_NASS,
    cases,
    refills,
    threads,
    messages,
    queueFilters: { product: "all", flag: "all", state: "all" },
    ui: {
      tab: "queue",
      openCaseId: null,
      esignOpen: false,
      esignAction: null,
      activeThreadId: null,
      demoBarOpen: true,
      quickRepliesOpen: false,
    },
    demo: { queue: "normal", refill: "clean", messages: "unread", license: "none" },
    stats: { reviewedToday: 14, avgReviewSec: 78, approvalRate: 92 },
    toasts: [],
  };
}

/* ────────── Storage ────────── */
const KEY = "blissley.physician.v1";

function load(): PhysicianState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as PhysicianState;
  } catch {}
  const s = seed();
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s;
}

let state: PhysicianState = typeof window !== "undefined" ? load() : seed();
const listeners = new Set<() => void>();

function persist() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function set(patch: Partial<PhysicianState> | ((s: PhysicianState) => Partial<PhysicianState>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  persist();
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }
function getSnap() { return state; }

export function usePhysician<T>(selector: (s: PhysicianState) => T): T {
  const cache = useRef<{ state: PhysicianState | null; value: T }>({ state: null, value: undefined as unknown as T });
  const getSnapshot = () => {
    if (cache.current.state === state) return cache.current.value;
    const next = selector(state);
    const prev = cache.current.value;
    const same = Object.is(prev, next) ||
      (Array.isArray(prev) && Array.isArray(next) && prev.length === next.length && prev.every((v, i) => Object.is(v, (next as unknown as unknown[])[i])));
    const value = same ? prev : next;
    cache.current = { state, value };
    return value;
  };
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ────────── Actions ────────── */
let toastId = 0;
function toast(kind: Toast["kind"], text: string) {
  const t: Toast = { id: `t${++toastId}`, kind, text };
  set((s) => ({ toasts: [...s.toasts, t] }));
  setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== t.id) })), 3500);
}

export const physicianActions = {
  signIn(email: string) { set({ session: { email, loggedInAt: Date.now() } }); },
  signOut() { set({ session: null }); },
  resetAll() { state = seed(); persist(); listeners.forEach((l) => l()); },

  setTab(tab: PhysicianState["ui"]["tab"]) { set((s) => ({ ui: { ...s.ui, tab } })); },
  openCase(id: string) {
    set((s) => ({
      ui: { ...s.ui, openCaseId: id },
      cases: s.cases.map((c) => (c.id === id && c.status === "new" ? { ...c, status: "in_review", openedAt: Date.now() } : c)),
    }));
  },
  closeCase() { set((s) => ({ ui: { ...s.ui, openCaseId: null } })); },
  updateRx(caseId: string, patch: Partial<Rx>) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === caseId ? { ...c, rx: { ...c.rx, ...patch } } : c)) }));
  },
  setPatientNote(caseId: string, text: string) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === caseId ? { ...c, patientNote: text } : c)) }));
  },
  setInternalNote(caseId: string, text: string) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === caseId ? { ...c, internalNote: text } : c)) }));
  },
  requestInfo(caseId: string) {
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, status: "awaiting_info" } : c)),
      ui: { ...s.ui, openCaseId: null, esignOpen: false, esignAction: null },
    }));
    toast("info", "Info request sent to patient portal");
  },
  reject(caseId: string, reason: string) {
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, status: "rejected", rejectReason: reason } : c)),
      ui: { ...s.ui, openCaseId: null, esignOpen: false, esignAction: null },
    }));
    toast("warn", "Case rejected · reason logged");
  },
  openESign(action: "approve" | "reject" | "info") {
    set((s) => ({ ui: { ...s.ui, esignOpen: true, esignAction: action } }));
  },
  closeESign() { set((s) => ({ ui: { ...s.ui, esignOpen: false, esignAction: null } })); },
  confirmApprove(caseId: string) {
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, status: "approved" } : c)),
      ui: { ...s.ui, openCaseId: null, esignOpen: false, esignAction: null },
      stats: { ...s.stats, reviewedToday: s.stats.reviewedToday + 1 },
    }));
    toast("success", "Rx signed · transmitted to South End");
  },

  approveRefill(id: string) {
    set((s) => ({ refills: s.refills.map((r) => (r.id === id ? { ...r, status: "approved" } : r)) }));
    toast("success", "Refill approved · shipping released");
  },

  setFilter<K extends keyof PhysicianState["queueFilters"]>(k: K, v: PhysicianState["queueFilters"][K]) {
    set((s) => ({ queueFilters: { ...s.queueFilters, [k]: v } }));
  },

  openThread(id: string) {
    set((s) => ({
      ui: { ...s.ui, activeThreadId: id },
      messages: s.messages.map((m) => (m.threadId === id && m.from === "patient" ? { ...m, read: true } : m)),
    }));
  },
  sendMessage(threadId: string, text: string) {
    const msg: PhysMessage = { id: `m${Date.now()}`, threadId, from: "me", text, ts: Date.now(), read: true };
    set((s) => ({ messages: [...s.messages, msg], threads: s.threads.map((t) => (t.id === threadId ? { ...t, lastActivity: Date.now(), waitingHours: 0 } : t)) }));
    toast("success", "Message sent");
  },
  toggleQuickReplies() { set((s) => ({ ui: { ...s.ui, quickRepliesOpen: !s.ui.quickRepliesOpen } })); },

  // demo bar
  setDemo<K extends keyof PhysicianState["demo"]>(k: K, v: PhysicianState["demo"][K]) {
    set((s) => ({ demo: { ...s.demo, [k]: v } }));
  },
  toggleDemoBar() { set((s) => ({ ui: { ...s.ui, demoBarOpen: !s.ui.demoBarOpen } })); },
};

export function hydratePhysicianFromStorage() {
  if (typeof window === "undefined") return;
  state = load();
  listeners.forEach((l) => l());
}

/* Quick reply templates */
export const QUICK_REPLIES = [
  "Nausea in weeks 1–4 is expected. Try injecting at bedtime and eat a small meal beforehand. This typically resolves by week 6.",
  "Your dose increase is on schedule. No action needed — your next refill will include the higher concentration.",
  "That side effect is uncommon and worth noting. I'm reviewing your profile and will follow up within 24 hours.",
  "Refills auto-ship every 28 days as long as your check-in is up to date. You're all set.",
  "Please continue current dose. We'll reassess at your next monthly check-in.",
];

/* Reject reason codes */
export const REJECT_REASONS = [
  "BMI does not meet criteria",
  "Contraindicated condition (personal or family history)",
  "Active pregnancy or trying to conceive",
  "Medication interaction risk",
  "Incomplete medical history — patient did not respond",
  "Not licensed in patient's state",
  "Other clinical concern",
];
