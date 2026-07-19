/**
 * Blissley Patient Portal — client-side store.
 * Uses useSyncExternalStore + localStorage. No backend.
 * Drives every card, badge, and state transition in /portal/patient.
 */
import { useSyncExternalStore, useRef } from "react";

/* ────────── Types ────────── */
export type PlanState =
  | "pending_review"
  | "approved_preparing"
  | "shipped"
  | "delivered_active"
  | "check_in_due"
  | "refill_processing"
  | "paused";

export type NotificationKind =
  | "shipment"
  | "message"
  | "check_in"
  | "charge"
  | "dose"
  | "approval";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  ts: number;
  read: boolean;
  deepLink?: "messages" | "plan" | "home";
};

export type Message = {
  id: string;
  thread: "doc" | "care";
  from: "me" | "them";
  authorName?: string;
  text: string;
  ts: number;
  read: boolean;
};

export type Shipment = {
  id: string;
  label: string;
  status: "processing" | "shipped" | "delivered";
  shipDate: string;
  eta?: string;
  tracking?: string;
};

export type Charge = {
  id: string;
  amount: number;
  date: string;
  status: "upcoming" | "paid";
};

export type WeightEntry = { date: string; ts: number; lbs: number };
export type CheckIn = { ts: number; weight: number; sideEffects: number; mood: number; notes: string };

export type PortalState = {
  session: { email: string; loggedInAt: number } | null;
  patient: {
    firstName: string; lastName: string; email: string; phone: string;
    dob: string; address1: string; city: string; state: string; zip: string;
    card: string;
  };
  planState: PlanState;
  medication: { name: string; dose: string; cadence: string; nextDoseAt: string; monthNumber: number; activeSince: string };
  plan: { name: string; price: number };
  shipments: Shipment[];
  charges: Charge[];
  nextCharge: { amount: number; date: string; daysAway: number };
  messages: Message[];
  notifications: Notification[];
  weightLog: WeightEntry[];
  checkIns: CheckIn[];
  prefs: {
    notifShipment: boolean; notifMessage: boolean; notifCheckIn: boolean;
    notifEmail: boolean; notifSms: boolean;
    onboardingComplete: boolean;
  };
  ui: {
    trackingId: string | null;
    receiptId: string | null;
    documentsView: null | "menu" | "prescription" | "labs" | "invoices" | "hipaa";
  };
  pauseDays: number | null;
  cancelled: boolean;
};

/* ────────── Seed ────────── */
const now = Date.now();
const DAY = 86400_000;

function seed(state: PlanState = "delivered_active"): PortalState {
  const base: PortalState = {
    session: null,
    patient: {
      firstName: "Sarah", lastName: "Miller", email: "sarah.miller@email.com",
      phone: "+1 (415) 555-0123", dob: "March 14, 1988",
      address1: "1428 Valencia St, Apt 3B", city: "San Francisco", state: "CA", zip: "94110",
      card: "4242",
    },
    planState: state,
    medication: {
      name: "Semaglutide Injectable", dose: "Step 2 · 5mg/mL",
      cadence: "Weekly", nextDoseAt: new Date(now + 3 * DAY).toISOString(),
      monthNumber: 3, activeSince: "June 1, 2026",
    },
    plan: { name: "3-Month", price: 299 },
    shipments: [
      { id: "s1", label: "Semaglutide 5mg/mL", status: "shipped", shipDate: "Jul 8, 2026", eta: "Jul 11, 2026", tracking: "1Z999AA10123456784" },
      { id: "s2", label: "Semaglutide 5mg/mL", status: "delivered", shipDate: "Jun 8, 2026" },
      { id: "s3", label: "Semaglutide 2mg/mL", status: "delivered", shipDate: "May 8, 2026" },
      { id: "s4", label: "Semaglutide 2mg/mL", status: "delivered", shipDate: "Apr 8, 2026" },
    ],
    charges: [
      { id: "c0", amount: 299, date: "Jul 18, 2026", status: "upcoming" },
      { id: "c1", amount: 299, date: "Jun 18, 2026", status: "paid" },
      { id: "c2", amount: 299, date: "May 18, 2026", status: "paid" },
      { id: "c3", amount: 299, date: "Apr 18, 2026", status: "paid" },
      { id: "c4", amount: 249, date: "Feb 18, 2026", status: "paid" },
    ],
    nextCharge: { amount: 299, date: "Jul 18", daysAway: 10 },
    messages: [
      { id: "m1", thread: "doc", from: "them", authorName: "Dr. Nass", text: "Welcome to Blissley, Sarah. I've reviewed your intake — you're a great candidate for Semaglutide. Message me here anytime with questions.", ts: now - 5 * DAY, read: true },
      { id: "m2", thread: "doc", from: "me", text: "Thanks Dr. Nass. I'm getting mild nausea in the mornings on my 5mg dose. Is that normal?", ts: now - 2 * DAY, read: true },
      { id: "m3", thread: "doc", from: "them", authorName: "Dr. Nass", text: "Your nausea in weeks 1–3 is expected and typically resolves. Try taking your injection at bedtime, sip water throughout the day, and eat smaller meals. Reach out if it worsens.", ts: now - 1 * DAY, read: false },
      { id: "m4", thread: "care", from: "them", authorName: "Sarah (Care Team)", text: "Hi Sarah! Just checking in — your next shipment is on track for July 8. Let me know if you need anything.", ts: now - 1.5 * DAY, read: false },
    ],
    notifications: [
      { id: "n1", kind: "message", title: "New message from Dr. Nass", body: "Your nausea in weeks 1–3 is expected…", ts: now - 1 * DAY, read: false, deepLink: "messages" },
      { id: "n2", kind: "shipment", title: "Your order has shipped", body: "Semaglutide 5mg/mL · ETA Jul 11", ts: now - 6 * 3600_000, read: false, deepLink: "home" },
      { id: "n3", kind: "charge", title: "Upcoming charge · $299", body: "Card ending 4242 will be charged Jul 18", ts: now - 12 * 3600_000, read: true, deepLink: "plan" },
    ],
    weightLog: [
      { date: "Apr 1", ts: now - 90 * DAY, lbs: 194 },
      { date: "Apr 15", ts: now - 76 * DAY, lbs: 191 },
      { date: "May 1", ts: now - 60 * DAY, lbs: 188 },
      { date: "May 15", ts: now - 46 * DAY, lbs: 185 },
      { date: "Jun 1", ts: now - 30 * DAY, lbs: 182 },
      { date: "Jun 15", ts: now - 16 * DAY, lbs: 189 - 9 },
      { date: "Jul 1", ts: now - 2 * DAY, lbs: 187.8 },
    ],
    checkIns: [
      { ts: now - 30 * DAY, weight: 188, sideEffects: 2, mood: 4, notes: "Nausea first 3 days, then fine." },
    ],
    prefs: {
      notifShipment: true, notifMessage: true, notifCheckIn: true,
      notifEmail: true, notifSms: true, onboardingComplete: false,
    },
    pauseDays: null,
    cancelled: false,
    ui: { trackingId: null, receiptId: null, documentsView: null },
  };
  // per-state adjustments
  if (state === "pending_review") base.shipments[0].status = "processing";
  if (state === "check_in_due") {
    base.notifications.unshift({ id: "nci", kind: "check_in", title: "Monthly check-in due", body: "Complete your check-in to unlock your next refill.", ts: now, read: false, deepLink: "plan" });
  }
  if (state === "paused") base.pauseDays = 30;
  return base;
}

/* ────────── Storage ────────── */
const KEY = "blissley.portal.v1";

function load(): PortalState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PortalState;
      // Back-compat: add ui block if missing from older cached state
      if (!parsed.ui) parsed.ui = { trackingId: null, receiptId: null, documentsView: null };
      return parsed;
    }
  } catch {}
  const s = seed();
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s;
}

let state: PortalState = typeof window !== "undefined" ? load() : seed();
const listeners = new Set<() => void>();

function persist() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function set(patch: Partial<PortalState> | ((s: PortalState) => Partial<PortalState>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnap() { return state; }
function getServerSnap() { return state; }

export function usePortal<T>(selector: (s: PortalState) => T): T {
  const cache = useRef<{ state: PortalState | null; value: T }>({ state: null, value: undefined as unknown as T });
  const getSnapshot = () => {
    if (cache.current.state === state) return cache.current.value;
    const next = selector(state);
    const prev = cache.current.value;
    // Shallow-equal arrays/objects to preserve reference stability across unrelated state changes
    const same =
      Object.is(prev, next) ||
      (Array.isArray(prev) && Array.isArray(next) && prev.length === next.length && prev.every((v, i) => Object.is(v, (next as unknown as unknown[])[i])));
    const value = same ? prev : next;
    cache.current = { state, value };
    return value;
  };
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ────────── Actions ────────── */
export const actions = {
  // session
  signIn(email: string) {
    set({ session: { email, loggedInAt: Date.now() } });
  },
  signOut() {
    set({ session: null });
  },
  resetAll() {
    state = seed();
    persist();
    listeners.forEach((l) => l());
  },
  setPlanState(next: PlanState) {
    set({ planState: next });
    if (next === "shipped") {
      actions.notify({ kind: "shipment", title: "Your order shipped", body: "Semaglutide 5mg/mL · ETA in 2–3 days", deepLink: "home" });
    }
    if (next === "check_in_due") {
      actions.notify({ kind: "check_in", title: "Monthly check-in due", body: "Complete your check-in to unlock your next refill.", deepLink: "plan" });
    }
    if (next === "delivered_active") {
      actions.notify({ kind: "shipment", title: "Package delivered", body: "Your Semaglutide has arrived.", deepLink: "home" });
    }
  },
  completeOnboarding() {
    set((s) => ({ prefs: { ...s.prefs, onboardingComplete: true } }));
  },
  toggleNotifPref(key: keyof PortalState["prefs"], v: boolean) {
    set((s) => ({ prefs: { ...s.prefs, [key]: v } }));
  },

  // notifications
  notify(n: Omit<Notification, "id" | "ts" | "read">) {
    const nn: Notification = { ...n, id: `n${Date.now()}${Math.random().toString(16).slice(2, 6)}`, ts: Date.now(), read: false };
    set((s) => ({ notifications: [nn, ...s.notifications] }));
  },
  markNotifRead(id: string) {
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  },
  markAllNotifsRead() {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },

  // messages
  sendMessage(thread: "doc" | "care", text: string) {
    const msg: Message = { id: `m${Date.now()}`, thread, from: "me", text, ts: Date.now(), read: true };
    set((s) => ({ messages: [...s.messages, msg] }));
    // schedule reply
    setTimeout(() => actions.simulateReply(thread, text), 2200);
  },
  simulateReply(thread: "doc" | "care", userText: string) {
    const t = userText.toLowerCase();
    let reply = "Got it — I'll follow up shortly.";
    if (thread === "doc") {
      if (/nause|sick|vomit/.test(t)) reply = "Mild nausea is common in weeks 1–3. Try injecting at bedtime, sip water throughout the day, and eat smaller meals. If it worsens, message me.";
      else if (/dose|inject|shot/.test(t)) reply = "Stick with your current dose for now. We'll reassess at your next check-in.";
      else if (/refill|reorder/.test(t)) reply = "Refills auto-ship every 28 days as long as your check-in is up to date. Head to My Plan for details.";
      else if (/thank|thanks/.test(t)) reply = "Anytime, Sarah. You're doing great.";
      else reply = "Thanks for the update. I'll review and get back to you within 24 hours.";
      const m: Message = { id: `m${Date.now()}r`, thread, from: "them", authorName: "Dr. Nass", text: reply, ts: Date.now(), read: false };
      set((s) => ({ messages: [...s.messages, m] }));
      actions.notify({ kind: "message", title: "New message from Dr. Nass", body: reply.slice(0, 60) + "…", deepLink: "messages" });
    } else {
      if (/address|ship/.test(t)) reply = "Sure — you can update your shipping address in Settings. As long as it's updated before your ship date, we'll use the new one.";
      else if (/bill|charge|payment/.test(t)) reply = "Happy to help with billing. Your next charge is on your Plan tab. Let me know what you'd like to change.";
      else if (/thank|thanks/.test(t)) reply = "You're welcome! Let us know if anything else comes up.";
      else reply = "Thanks Sarah — the care team will follow up within a few hours.";
      const m: Message = { id: `m${Date.now()}r`, thread, from: "them", authorName: "Sarah (Care Team)", text: reply, ts: Date.now(), read: false };
      set((s) => ({ messages: [...s.messages, m] }));
      actions.notify({ kind: "message", title: "New message from Care Team", body: reply.slice(0, 60) + "…", deepLink: "messages" });
    }
  },
  markThreadRead(thread: "doc" | "care") {
    set((s) => ({ messages: s.messages.map((m) => (m.thread === thread ? { ...m, read: true } : m)) }));
  },

  // plan actions
  logWeight(lbs: number) {
    const d = new Date();
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    set((s) => ({ weightLog: [...s.weightLog, { date: label, ts: Date.now(), lbs }] }));
  },
  submitCheckIn(ci: Omit<CheckIn, "ts">) {
    const entry: CheckIn = { ...ci, ts: Date.now() };
    set((s) => ({ checkIns: [...s.checkIns, entry] }));
    actions.logWeight(ci.weight);
    actions.setPlanState("refill_processing");
    actions.notify({ kind: "check_in", title: "Check-in submitted", body: "Your refill is being prepared. You're all set.", deepLink: "home" });
  },
  requestRefill() {
    actions.setPlanState("refill_processing");
    actions.notify({ kind: "shipment", title: "Refill requested", body: "Your next shipment is being prepared.", deepLink: "home" });
  },
  pausePlan(days: number) {
    set({ pauseDays: days, planState: "paused" });
    actions.notify({ kind: "shipment", title: `Program paused for ${days} days`, body: "You won't be charged during the pause.", deepLink: "plan" });
  },
  resumePlan() {
    set({ pauseDays: null, planState: "delivered_active" });
    actions.notify({ kind: "shipment", title: "Program resumed", body: "Welcome back — your next dose is scheduled.", deepLink: "home" });
  },
  cancelPlan() {
    set({ cancelled: true, planState: "paused" });
  },

  // demo helpers
  triggerMessage() {
    actions.simulateReply("doc", "check in");
  },
  triggerShipmentUpdate() {
    actions.notify({ kind: "shipment", title: "Shipment out for delivery", body: "Arriving today by 8 PM.", deepLink: "home" });
  },
};

/* ────────── SSR-safe hydration ────────── */
export function hydrateFromStorage() {
  if (typeof window === "undefined") return;
  state = load();
  listeners.forEach((l) => l());
}
