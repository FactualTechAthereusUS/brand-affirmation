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
export type PatientStatus = "active" | "pending" | "paused" | "failed" | "cancelled" | "denied";

export type InternalNote = { id: string; author: string; ts: number; text: string };
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

export type CaseTimelineEvent = {
  ts: number;
  kind: "submitted" | "assigned" | "approved" | "denied" | "info_requested" | "reply_received" | "reassigned" | "priority_set" | "note";
  by?: string;
  detail?: string;
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
  /** overrides applied by admin actions */
  patientNote?: string;
  internalNote?: string;
  rxDraft?: { drug?: string; sig?: string; qty?: string; daysSupply?: number; refills?: number; pharmacyId?: string };
  timeline?: CaseTimelineEvent[];
  decisionAt?: number;
  decidedBy?: string;
  priorityPaid?: boolean;
};

export type CheckInDecision = "clear" | "hold" | "review" | "approved" | "adjusted" | "held" | "awaiting_reply";

export type CheckIn = {
  id: string;
  patientId: string;
  patientName: string;
  day: number;
  submittedAt?: number;
  weight?: number;
  delta?: number;
  sideEffects?: string[];
  decision: CheckInDecision;
  /** overrides applied by admin actions */
  patientNote?: string;
  internalNote?: string;
  adjustment?: { doseChange?: string; note?: string };
  holdReason?: string;
  reminderSentAt?: number;
  reminderCount?: number;
  decisionAt?: number;
  decidedBy?: string;
  refillOrderId?: string;
  kind?: "day90" | "sixMonth";
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

export type IntegrationCategory =
  | "Payments" | "Pharmacies" | "Clinical" | "Marketing"
  | "Analytics" | "Email/SMS" | "Shipping" | "Comms" | "Banking" | "Auth";

export type IntegrationStatus = "connected" | "degraded" | "down" | "disconnected";

export type IntegrationConfigField = {
  key: string;
  label: string;
  type: "text" | "secret" | "select" | "toggle" | "url";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
};

export type IntegrationScope = { key: string; label: string; required?: boolean };
export type IntegrationWebhookEvent = { key: string; label: string; enabled: boolean };
export type IntegrationSyncEntry = {
  ts: number;
  event: string;
  status: "ok" | "warn" | "error";
  detail?: string;
};

export type Integration = {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  lastSync: number;
  lastError?: string;
  description: string;
  docsUrl: string;
  brand: { color: string; mono: string; logoUrl?: string };
  scopes: IntegrationScope[];
  configSchema: IntegrationConfigField[];
  config: Record<string, string | boolean>;
  webhookEvents: IntegrationWebhookEvent[];
  syncHistory: IntegrationSyncEntry[];
  connectedAt?: number;
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
  tags?: string[];
  notes?: InternalNote[];
  cancelReason?: string;
  denialReason?: string;
  // ── Overrides (mutated by adminActions) ──
  cardBrandOverride?: string;
  cardLast4Override?: string;
  addressOverride?: { line1: string; line2?: string; city: string; state: string; zip: string };
  nextBillingOverride?: string;
};

export type OrderTimelineExtra = {
  ts: number;
  actor: "patient" | "system" | "physician" | "pharmacy" | "carrier" | "ops";
  kind: "created" | "paid" | "rx_approved" | "sent_to_pharmacy" | "dispensed" | "label" | "shipped" | "out_for_delivery" | "delivered" | "exception" | "note" | "message";
  message: string;
  meta?: string;
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
  // ── Overrides (mutated by adminActions) ──
  paymentOverride?: "paid" | "failed" | "refunded";
  shipToOverride?: { line1?: string; line2?: string; city?: string; state?: string; zip?: string };
  opsOwner?: string;
  tags?: string[];
  flagsExtra?: string[];
  timelineExtra?: OrderTimelineExtra[];
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

export type LeadStatus = "new" | "working" | "nurturing" | "won" | "lost" | "do_not_contact";
export type LeadIntent = "hot" | "warm" | "cold";
export type LeadFunnelStep =
  | "landing" | "intake_start" | "intake_mid" | "intake_complete"
  | "checkout" | "payment_fail" | "abandoned_cart";
export type LeadOutreachChannel = "email" | "sms" | "call" | "note";
export type LeadOutreach = {
  id: string;
  ts: number;
  channel: LeadOutreachChannel;
  by: string;
  subject: string;
  outcome: string;
};
export type LeadIntakeAnswer = { q: string; a: string; ts: number };
export type LeadAttribution = {
  source: string;
  medium: string;
  campaign: string;
  adset?: string;
  creative?: string;
  landingUrl: string;
  firstTouch: number;
  lastTouch: number;
  sessions: number;
  deviceType: "mobile" | "desktop" | "tablet";
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  dob?: string;
  sex?: "M" | "F" | "X";
  program: string;
  score: number;
  intent: LeadIntent;
  funnelStep: LeadFunnelStep;
  progressPct: number;
  stateEligible: boolean;
  bmi?: number;
  currentWeight?: number;
  goalWeight?: number;
  consent: { sms: boolean; email: boolean; marketing: boolean };
  attribution: LeadAttribution;
  projectedFirstOrder: number;
  projectedLTV: number;
  outreach: LeadOutreach[];
  tags: string[];
  assignee?: string;
  status: LeadStatus;
  lossReason?: string;
  wonPatientId?: string;
  intakeSnapshot: LeadIntakeAnswer[];
  cartItems?: string[];
  coupon?: string;
  createdAt: number;
  lastTouchAt: number;
  // legacy — kept for back-compat with prior UI
  source: string;
  lastStep: string;
  ageHrs: number;
  contacted: boolean;
};

export type LeadSegment = {
  key: string;
  label: string;
  definition: string;
  pinned?: boolean;
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

export type ConvoMsgState = "sending" | "sent" | "delivered" | "seen" | "failed";

export type ConvoAttachment = {
  id: string;
  kind: "image" | "file" | "audio";
  name: string;
  size?: string;
  url?: string;
};

export type ConvoMessage = {
  id: string;
  from: "me" | "them" | "system";
  authorName?: string;
  text: string;
  ts: number;
  internal?: boolean;
  state?: ConvoMsgState;
  channel?: MessageChannel;
  attachments?: ConvoAttachment[];
  systemKind?: "assignment" | "status" | "tag" | "note" | "info";
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
  tags?: string[];
  assignedTo: string;
  updatedAt: number;
  unread: boolean;
  unreadCount?: number;
  messages: ConvoMessage[];
  program: ProgramCode;
  ltv: number;
  startedAt: string;
  internalNote: string;
  snoozedUntil?: number;
  priority?: "normal" | "high";
  starred?: boolean;
  typing?: boolean;
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

export type TeamRole = "owner" | "ops" | "support" | "clinical";
export type TeamMemberStatus = "active" | "invited" | "suspended";
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  lastLoginAt?: number;
  status: TeamMemberStatus;
  avatarInitials: string;
};
export type PendingInvite = { id: string; email: string; role: TeamRole; invitedAt: number; expiresAt: number };

export type PharmacyContact = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  status: "primary" | "backup" | "standby" | "pending";
  notes?: string;
  statesCovered: number;
  apiConnected: boolean;
};

export type RoutingRule = {
  product: "sema_injectable" | "tirze_injectable" | "oral_glp1" | "ed_peptides";
  label: string;
  primaryId: string;
  backupId?: string;
  meta?: string;
};

export type StateCode = string;
export type StateCoverage = { enabled: boolean; primary: boolean; backup: boolean };

export type AlertKey =
  | "queue_over_12h" | "case_flagged_red" | "denial_rate_high" | "checkin_overdue"
  | "shipment_delayed" | "southend_api_down" | "drtelx_api_down" | "lifefile_fail"
  | "payment_failed" | "refund_large" | "revenue_low" | "mrr_drop" | "churn_high"
  | "new_patient" | "winback" | "sixmo_plan";

export type NotificationsSettings = {
  alerts: Record<AlertKey, boolean>;
  emailRecipients: string[];
  smsRecipient: string;
  digest: {
    daily: boolean; dailyTime: string;
    weekly: boolean; weeklyDay: string; weeklyTime: string;
    items: Record<string, boolean>;
  };
};

export type BAARecord = {
  id: string;
  vendor: string;
  status: "signed" | "website_tos" | "pending" | "missing";
  docType: string;
  dateISO: string;
  note?: string;
};

export type LegalDoc = { key: string; label: string; url: string; body: string; updatedAt: number };

export type PricingConfig = {
  sema: { m1: number; mOngoing: number; q3: number; q6: number };
  tirze: { m1: number; mOngoing: number; q3: number; q6: number };
  upsells: { priorityReview: number; shippingInsurance: number };
};

export type SettingsSlice = {
  business: {
    legalName: string; dba: string; ein: string; businessType: string;
    registeredState: string; address1: string; city: string; state: string; zip: string;
  };
  contact: {
    supportEmail: string; transactionalEmail: string; supportPhone: string;
    website: string; portalUrl: string;
  };
  brand: { logoUrl?: string; primaryColor: string };
  stripe: {
    accountId: string; connectedAtISO: string; mode: "live" | "test";
    chargeModel: "manual" | "immediate"; payoutSchedule: string; payoutBankLast4: string;
  };
  pricing: PricingConfig;
  team: {
    members: TeamMember[];
    require2FA: boolean;
    sessionTimeoutHours: number;
    pendingInvites: PendingInvite[];
  };
  routing: {
    rules: RoutingRule[];
    pharmacies: PharmacyContact[];
    versionAEnforced: boolean;
    versionAConfirmedBy: string;
    versionAConfirmedAtISO: string;
  };
  states: {
    served: Record<StateCode, StateCoverage>;
    waitlistList: string;
    autoNotify: boolean;
    waitlistCounts: Record<StateCode, number>;
  };
  notifications: NotificationsSettings;
  compliance: {
    baa: BAARecord[];
    legitScript: { status: "certified" | "pending" | "missing"; sinceISO: string; renewalISO: string };
    licenseExpiryAlerts: boolean;
    hipaaChecklist: Record<string, boolean>;
  };
  legal: {
    docs: LegalDoc[];
    entity: {
      legalName: string; formationState: string; formationDateISO: string; ein: string;
      registeredAgent: string; dbaFilings: { name: string; dateISO: string }[];
      bank: string; bankLast4: string;
    };
  };
};

export type AuditEntry = {
  id: string;
  ts: number;
  actor: string;
  action: string;
  targetType?: string;
  targetId?: string;
  meta?: string;
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
  orderNotes: Record<string, InternalNote[]>;
  settings: SettingsSlice;
  auditLog: AuditEntry[];
  ui: {
    patientDrawerId: string | null;
    orderDrawerId: string | null;
    paymentDrawerId: string | null;
    activeConvoId: string | null;
    activeCaseId: string | null;
    patientFilter: PatientStatus | "all";
    patientSearch: string;
    showLogoMenu: boolean;
    inboxFolder?: string;
    inboxChannel?: MessageChannel | "all";
    inboxSearch?: string;
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
      i % 19 === 0 ? "denied" :
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
      ltv: status === "denied" || status === "pending" ? 0 : price * monthsIn,
      startedAt: iso(monthsIn * 30 * DAY),
      churn,
      state: pick(STATES, i * 5),
      tags: status === "active" && monthsIn >= 3 ? ["high-value", `${PROGRAMS[program].family}-patient`] : [],
      cancelReason: status === "cancelled" ? pick(["Too expensive", "Side effects", "Reached goal", "Switching provider"], i) : undefined,
      denialReason: status === "denied" ? pick(["BMI below threshold", "Contraindication", "Incomplete history"], i) : undefined,
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

  const leads: Lead[] = Array.from({ length: 42 }, (_, i) => {
    const first = pick(FIRST, i * 4 + 1);
    const last = pick(LAST, i * 6 + 3);
    const step: LeadFunnelStep = pick(
      ["landing", "intake_start", "intake_mid", "intake_mid", "intake_complete", "checkout", "payment_fail", "abandoned_cart"] as const,
      i,
    );
    const progressPct = ({ landing: 8, intake_start: 22, intake_mid: 52, intake_complete: 74, checkout: 88, payment_fail: 94, abandoned_cart: 82 } as Record<LeadFunnelStep, number>)[step];
    const source = pick(["Meta", "Google", "Organic", "Referral", "TikTok", "Klaviyo"], i);
    const medium = source === "Meta" || source === "Google" || source === "TikTok" ? "paid" : source === "Klaviyo" ? "email" : source === "Referral" ? "referral" : "organic";
    const ageHrs = 1 + ((i * 7) % 96);
    const recencyBoost = ageHrs < 12 ? 25 : ageHrs < 36 ? 15 : ageHrs < 72 ? 6 : 0;
    const channelBoost = source === "Google" ? 12 : source === "Meta" ? 10 : source === "Referral" ? 15 : source === "Klaviyo" ? 8 : 4;
    const score = Math.max(3, Math.min(99, progressPct * 0.55 + recencyBoost + channelBoost + (i % 5)));
    const intent: LeadIntent = score >= 70 ? "hot" : score >= 45 ? "warm" : "cold";
    const status: LeadStatus =
      i % 21 === 0 ? "won" :
      i % 17 === 0 ? "lost" :
      i % 19 === 0 ? "do_not_contact" :
      step === "payment_fail" ? "working" :
      intent === "hot" ? (i % 3 === 0 ? "working" : "new") :
      intent === "warm" ? "nurturing" : "new";
    const program = ["Tirzepatide", "Semaglutide", "Hair", "ED", "TRT"][i % 5];
    const state = pick(STATES, i * 5);
    const stateEligible = !(state === "MI" || state === "GA");
    const createdAt = now - ageHrs * HR - (i % 4) * DAY;
    const lastTouchAt = now - Math.floor(ageHrs / 2) * HR;
    const outreach: LeadOutreach[] = status === "new" ? [] : [
      { id: `or_${i}_1`, ts: createdAt + 30 * 60 * 1000, channel: "email", by: "System", subject: "Complete your Blissley intake", outcome: "delivered · opened" },
      ...(intent !== "cold" ? [{ id: `or_${i}_2`, ts: createdAt + 4 * HR, channel: "sms" as const, by: "Andre F.", subject: "Quick check-in", outcome: i % 2 ? "delivered · no reply" : "delivered · replied" }] : []),
      ...(status === "working" ? [{ id: `or_${i}_3`, ts: lastTouchAt, channel: "call" as const, by: "Andre F.", subject: "Discovery call", outcome: i % 2 ? "voicemail" : "connected · nurturing" }] : []),
    ];
    const intakeSnapshot: LeadIntakeAnswer[] = [
      { q: "Which program are you interested in?", a: program, ts: createdAt + 60_000 },
      { q: "What state do you live in?", a: state, ts: createdAt + 90_000 },
      ...(program === "Tirzepatide" || program === "Semaglutide" ? [
        { q: "Current weight (lb)?", a: `${180 + (i % 60)}`, ts: createdAt + 120_000 },
        { q: "Goal weight (lb)?", a: `${150 + (i % 40)}`, ts: createdAt + 150_000 },
      ] : []),
      ...(step === "intake_mid" || step === "intake_complete" || step === "checkout" || step === "payment_fail" ? [
        { q: "Any chronic conditions?", a: i % 3 === 0 ? "Hypertension" : "None", ts: createdAt + 180_000 },
      ] : []),
    ];
    const isWL = program === "Tirzepatide" || program === "Semaglutide";
    const firstOrder = isWL ? (i % 2 === 0 ? 299 : 249) : program === "Hair" ? 39 : program === "ED" ? 79 : 149;
    return {
      id: `ld_${900 + i}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
      phone: `+1 (415) 555-1${(100 + i).toString().padStart(3, "0")}`,
      state,
      city: pick(["San Francisco", "Austin", "Brooklyn", "Miami", "Chicago", "Seattle", "Denver", "Boston"], i),
      dob: `19${70 + (i % 30)}-${((i % 12) + 1).toString().padStart(2, "0")}-${((i % 27) + 1).toString().padStart(2, "0")}`,
      sex: (i % 2 === 0 ? "F" : "M") as "F" | "M",
      program,
      score: Math.round(score),
      intent,
      funnelStep: step,
      progressPct,
      stateEligible,
      bmi: isWL ? Math.round((26 + (i % 12)) * 10) / 10 : undefined,
      currentWeight: isWL ? 180 + (i % 60) : undefined,
      goalWeight: isWL ? 150 + (i % 40) : undefined,
      consent: {
        sms: !(i % 11 === 0),
        email: true,
        marketing: !(i % 7 === 0),
      },
      attribution: {
        source,
        medium,
        campaign: source === "Meta" ? "US_WL_Prospecting_v4" : source === "Google" ? "brand_exact" : source === "TikTok" ? "creator_seeding" : source === "Klaviyo" ? "abandoned_flow_2" : "organic",
        adset: source === "Meta" ? pick(["Women 35-54 · GLP-1", "Men 30-50 · TRT", "LAL 1% purchasers"], i) : undefined,
        creative: source === "Meta" ? pick(["UGC_Before_After_08", "Static_Rx_Kit_02", "VSL_60s_Coral"], i) : undefined,
        landingUrl: isWL ? "/weight-loss" : `/${program.toLowerCase()}`,
        firstTouch: createdAt - 3 * DAY,
        lastTouch: lastTouchAt,
        sessions: 1 + (i % 5),
        deviceType: (["mobile", "mobile", "desktop", "tablet"] as const)[i % 4],
      },
      projectedFirstOrder: firstOrder,
      projectedLTV: firstOrder * (isWL ? 5 : 3),
      outreach,
      tags: intent === "hot" ? ["priority"] : [],
      assignee: status === "working" ? pick(["Andre F.", "Priya S.", "Ops"], i) : undefined,
      status,
      lossReason: status === "lost" ? pick(["price", "ineligible state", "competitor", "unresponsive"], i) : undefined,
      intakeSnapshot,
      cartItems: step === "checkout" || step === "payment_fail" || step === "abandoned_cart" ? [PROGRAMS[Object.keys(PROGRAMS)[i % 6] as keyof typeof PROGRAMS].label] : undefined,
      coupon: step === "checkout" || step === "payment_fail" ? (i % 3 === 0 ? "BLISS30" : undefined) : undefined,
      createdAt,
      lastTouchAt,
      // legacy
      source,
      lastStep: ({ landing: "Landing page", intake_start: "Q3 · Health history", intake_mid: "Q7 · State", intake_complete: "Q12 · Plan select", checkout: "Q14 · Payment", payment_fail: "Payment · declined", abandoned_cart: "Cart · abandoned" } as Record<LeadFunnelStep, string>)[step],
      ageHrs,
      contacted: outreach.length > 0,
    };
  });

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
    orderNotes: {},
    settings: seedSettings(),
    auditLog: seedAuditLog(),
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

/* ────────── Settings seeds ────────── */
const US_STATES: { code: string; name: string }[] = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
].map(([code, name]) => ({ code, name }));

export const US_STATE_LIST = US_STATES;

const DEFAULT_SERVED_STATES = new Set([
  "AL","AK","AZ","AR","CA","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MO","MT","NE","NV","NH","NJ","NM","NC","ND","OH","OK","OR","PA","SC","TX",
]);

function seedSettings(): SettingsSlice {
  const now = Date.now();
  const served: Record<string, StateCoverage> = {};
  const waitlist: Record<string, number> = {};
  for (const s of US_STATES) {
    const enabled = DEFAULT_SERVED_STATES.has(s.code);
    served[s.code] = {
      enabled,
      primary: enabled && !["AK","HI"].includes(s.code),
      backup: true,
    };
    if (!enabled) waitlist[s.code] = Math.floor(Math.random() * 40) + 5;
  }
  return {
    business: {
      legalName: "TheFactual LLC",
      dba: "Blissley",
      ein: "88-2145093",
      businessType: "Telehealth Platform (Technology)",
      registeredState: "Delaware",
      address1: "8 The Green, Suite 4000",
      city: "Dover", state: "DE", zip: "19901",
    },
    contact: {
      supportEmail: "care@blissley.com",
      transactionalEmail: "noreply@blissley.com",
      supportPhone: "+1 (415) 555-0114",
      website: "https://blissley.com",
      portalUrl: "https://portal.blissley.com",
    },
    brand: { primaryColor: "#ee7273" },
    stripe: {
      accountId: "acct_1PfXk2H4nZ8QwR9L",
      connectedAtISO: "2026-07-01",
      mode: "live",
      chargeModel: "manual",
      payoutSchedule: "Automatic — every 2 days",
      payoutBankLast4: "4218",
    },
    pricing: {
      sema:  { m1: 249, mOngoing: 299, q3: 711, q6: 1422 },
      tirze: { m1: 299, mOngoing: 399, q3: 1017, q6: 1794 },
      upsells: { priorityReview: 49.95, shippingInsurance: 3.94 },
    },
    team: {
      members: [
        { id: "tm_1", name: "Anmol Bansod",  email: "anmol@blissley.com",   role: "owner",   lastLoginAt: now - 15 * 60 * 1000,       status: "active", avatarInitials: "AB" },
        { id: "tm_2", name: "Julie Chen",    email: "julie@blissley.com",   role: "ops",     lastLoginAt: now - 4 * 60 * 60 * 1000,   status: "active", avatarInitials: "JC" },
        { id: "tm_3", name: "Andre Francis", email: "andre@blissley.com",   role: "support", lastLoginAt: now - 26 * 60 * 60 * 1000,  status: "active", avatarInitials: "AF" },
        { id: "tm_4", name: "Priya Kapoor",  email: "priya@blissley.com",   role: "support", lastLoginAt: now - 3 * 24 * 3600 * 1000, status: "active", avatarInitials: "PK" },
      ],
      require2FA: true,
      sessionTimeoutHours: 4,
      pendingInvites: [],
    },
    routing: {
      pharmacies: [
        { id: "rx_southend", name: "South End Pharmacy", contact: "Chad Kehoe",         email: "chad@southendpharmacy.com",   phone: "+1 (984) 555-0101", status: "primary", statesCovered: 36, apiConnected: true,  notes: "Only Dr Telx 4 physicians registered. Orders from other physicians will not ship." },
        { id: "rx_wellsrx",  name: "WellsRx",             contact: "Paul Clemens",       email: "paul@wellsrx.com",            phone: "+1 (704) 555-0177", status: "backup",  statesCovered: 50, apiConnected: true,  notes: "Tirzepatide backup + supplemental." },
        { id: "rx_epiq",     name: "Epiq Scripts",        contact: "Josh Meranda",       email: "josh@epiqscripts.com",        phone: "+1 (512) 555-0122", status: "primary", statesCovered: 44, apiConnected: true,  notes: "ED + peptides primary." },
        { id: "rx_valiant",  name: "Valiant Pharmacy",    contact: "Sara Ng",            email: "orders@valiantrx.com",        phone: "+1 (949) 555-0133", status: "primary", statesCovered: 42, apiConnected: true,  notes: "Oral GLP-1 primary (SemaMelt, TirzeMelt)." },
        { id: "rx_strive",   name: "Strive Pharmacy",     contact: "Mia Nakamura",       email: "mia@striverx.com",            phone: "+1 (480) 555-0164", status: "backup",  statesCovered: 50, apiConnected: true,  notes: "Semaglutide backup — full-state coverage." },
      ],
      rules: [
        { product: "sema_injectable",  label: "Semaglutide injectable",  primaryId: "rx_southend", backupId: "rx_strive",   meta: "SE1.5 · SE5 (Version A titration)" },
        { product: "tirze_injectable", label: "Tirzepatide injectable",  primaryId: "rx_southend", backupId: "rx_wellsrx",  meta: "Tirzepatide 22 mg/mL · lfProductID: 202355193" },
        { product: "oral_glp1",        label: "Oral GLP-1",              primaryId: "rx_valiant",  backupId: "rx_epiq",     meta: "SemaMelt · TirzeMelt ODT" },
        { product: "ed_peptides",      label: "ED / Peptides",           primaryId: "rx_epiq",     backupId: undefined,     meta: "Quad ED · NAD+ · Sermorelin · MICC" },
      ],
      versionAEnforced: true,
      versionAConfirmedBy: "Chad Kehoe (South End)",
      versionAConfirmedAtISO: "2026-06-14",
    },
    states: { served, waitlistList: "Blissley — State Waitlist", autoNotify: true, waitlistCounts: waitlist },
    notifications: {
      alerts: {
        queue_over_12h: true, case_flagged_red: true, denial_rate_high: true, checkin_overdue: true,
        shipment_delayed: true, southend_api_down: true, drtelx_api_down: true, lifefile_fail: true,
        payment_failed: true, refund_large: true, revenue_low: false, mrr_drop: true, churn_high: true,
        new_patient: false, winback: true, sixmo_plan: true,
      },
      emailRecipients: ["anmol@blissley.com"],
      smsRecipient: "+1 (415) 555-0114",
      digest: {
        daily: true, dailyTime: "08:00",
        weekly: true, weeklyDay: "Monday", weeklyTime: "08:00",
        items: { mrr: true, new_patients: true, churned: true, queue: true, shipments: true, failed_payments: true, revenue: true },
      },
    },
    compliance: {
      baa: [
        { id: "baa_drtelx",   vendor: "Dr Telx",   status: "signed",       docType: "Full BAA",      dateISO: "2026-06-01" },
        { id: "baa_southend", vendor: "South End", status: "website_tos",  docType: "Website TOS",   dateISO: "2026-06-01", note: "South End does not sign BAAs. Website TOS serves as agreement." },
        { id: "baa_wellsrx",  vendor: "WellsRx",   status: "signed",       docType: "Full BAA",      dateISO: "2026-06-15" },
        { id: "baa_stripe",   vendor: "Stripe",    status: "signed",       docType: "Stripe BAA",    dateISO: "2026-06-01" },
        { id: "baa_aws",      vendor: "AWS",       status: "signed",       docType: "AWS BAA",       dateISO: "2026-06-01" },
        { id: "baa_klaviyo",  vendor: "Klaviyo",   status: "signed",       docType: "Klaviyo BAA",   dateISO: "2026-06-01", note: "Does not cover PHI in email. Clinical content must stay portal-only." },
      ],
      legitScript: { status: "certified", sinceISO: "2026-05-12", renewalISO: "2027-05-12" },
      licenseExpiryAlerts: true,
      hipaaChecklist: {
        encryption_rest: true, encryption_transit: true, audit_logging: true,
        session_timeout: true, phi_in_urls: true, phi_in_emails: true, breach_sop: true,
      },
    },
    legal: {
      docs: [
        { key: "terms",         label: "Terms of Service",                url: "blissley.com/terms",        body: "Standard Terms of Service governing use of the Blissley telehealth platform...", updatedAt: now - 30 * 24 * 3600 * 1000 },
        { key: "privacy",       label: "Privacy Policy",                  url: "blissley.com/privacy",      body: "How Blissley collects, uses, and safeguards protected health information...",  updatedAt: now - 30 * 24 * 3600 * 1000 },
        { key: "consent",       label: "Telehealth Informed Consent",     url: "blissley.com/consent",      body: "I consent to receive telehealth services through Blissley...",                 updatedAt: now - 30 * 24 * 3600 * 1000 },
        { key: "hipaa",         label: "HIPAA Notice of Privacy Practices", url: "blissley.com/hipaa",      body: "Notice describing how PHI may be used and disclosed...",                       updatedAt: now - 30 * 24 * 3600 * 1000 },
        { key: "cancellation",  label: "Cancellation & Refund Policy",    url: "blissley.com/cancellation", body: "You may cancel your Blissley subscription at any time from the patient portal...", updatedAt: now - 30 * 24 * 3600 * 1000 },
      ],
      entity: {
        legalName: "TheFactual LLC",
        formationState: "Delaware",
        formationDateISO: "2025-11-04",
        ein: "88-2145093",
        registeredAgent: "Harvard Business Services, 16192 Coastal Hwy, Lewes DE 19958",
        dbaFilings: [
          { name: "Blissley",     dateISO: "2026-01-08" },
          { name: "PharmaBro.ai", dateISO: "2026-04-22" },
        ],
        bank: "Mercury Business",
        bankLast4: "4218",
      },
    },
  };
}

function seedAuditLog(): AuditEntry[] {
  const now = Date.now();
  return [
    { id: "aud_1", ts: now -  8 * 60 * 1000,      actor: "Anmol Bansod",   action: "Issued refund",         targetType: "payment", targetId: "pi_3PfXk2H4", meta: "$299 · BLS-P-00284" },
    { id: "aud_2", ts: now - 42 * 60 * 1000,      actor: "Anmol Bansod",   action: "Viewed patient record", targetType: "patient", targetId: "BLS-P-00284" },
    { id: "aud_3", ts: now -  3 * 3600 * 1000,    actor: "System",         action: "Rx transmitted to South End", targetType: "case", targetId: "BLS-C-0284" },
    { id: "aud_4", ts: now -  4 * 3600 * 1000,    actor: "Dr. Nass",       action: "Approved case",         targetType: "case", targetId: "BLS-C-0284", meta: "e-sig hash: 9f2a…c14b" },
    { id: "aud_5", ts: now -  6 * 3600 * 1000,    actor: "System",         action: "Stripe charge captured", targetType: "payment", targetId: "pi_3PfXk2H4", meta: "$299 · BLS-P-00284" },
  ];
}

/* ────────── Storage ────────── */
const KEY = "blissley.admin.v3";

const LEAD_STATUSES: LeadStatus[] = ["new", "working", "nurturing", "won", "lost", "do_not_contact"];
const LEAD_INTENTS: LeadIntent[] = ["hot", "warm", "cold"];
const LEAD_FUNNEL_STEPS: LeadFunnelStep[] = ["landing", "intake_start", "intake_mid", "intake_complete", "checkout", "payment_fail", "abandoned_cart"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeLead(raw: unknown, fallback: Lead): Lead {
  if (!isRecord(raw)) return fallback;

  const rawAttribution = isRecord(raw.attribution) ? raw.attribution : {};
  const fallbackSource = asString(raw.source, fallback.source || "Organic");
  const source = asString(rawAttribution.source, fallback.attribution.source || fallbackSource);
  const medium = asString(
    rawAttribution.medium,
    source === "Meta" || source === "Google" || source === "TikTok" ? "paid" : source === "Klaviyo" ? "email" : source === "Referral" ? "referral" : "organic",
  );

  const rawConsent = isRecord(raw.consent) ? raw.consent : {};
  const rawStatus = asString(raw.status, fallback.status) as LeadStatus;
  const rawIntent = asString(raw.intent, fallback.intent) as LeadIntent;
  const rawFunnelStep = asString(raw.funnelStep, asString(raw.lastStep, fallback.funnelStep)) as LeadFunnelStep;

  return {
    ...fallback,
    ...raw,
    id: asString(raw.id, fallback.id),
    name: asString(raw.name, fallback.name),
    email: asString(raw.email, fallback.email),
    phone: asString(raw.phone, fallback.phone),
    state: asString(raw.state, fallback.state),
    city: asString(raw.city, fallback.city),
    program: asString(raw.program, fallback.program),
    score: Math.max(0, Math.min(100, Math.round(asNumber(raw.score, fallback.score)))),
    intent: LEAD_INTENTS.includes(rawIntent) ? rawIntent : fallback.intent,
    funnelStep: LEAD_FUNNEL_STEPS.includes(rawFunnelStep) ? rawFunnelStep : fallback.funnelStep,
    progressPct: Math.max(0, Math.min(100, Math.round(asNumber(raw.progressPct, fallback.progressPct)))),
    stateEligible: asBoolean(raw.stateEligible, fallback.stateEligible),
    consent: {
      sms: asBoolean(rawConsent.sms, fallback.consent.sms),
      email: asBoolean(rawConsent.email, fallback.consent.email),
      marketing: asBoolean(rawConsent.marketing, fallback.consent.marketing),
    },
    attribution: {
      source,
      medium,
      campaign: asString(rawAttribution.campaign, fallback.attribution.campaign || source),
      adset: typeof rawAttribution.adset === "string" ? rawAttribution.adset : fallback.attribution.adset,
      creative: typeof rawAttribution.creative === "string" ? rawAttribution.creative : fallback.attribution.creative,
      landingUrl: asString(rawAttribution.landingUrl, fallback.attribution.landingUrl || "/weight-loss"),
      firstTouch: asNumber(rawAttribution.firstTouch, fallback.attribution.firstTouch),
      lastTouch: asNumber(rawAttribution.lastTouch, fallback.attribution.lastTouch),
      sessions: Math.max(1, Math.round(asNumber(rawAttribution.sessions, fallback.attribution.sessions || 1))),
      deviceType: rawAttribution.deviceType === "desktop" || rawAttribution.deviceType === "tablet" || rawAttribution.deviceType === "mobile"
        ? rawAttribution.deviceType
        : fallback.attribution.deviceType,
    },
    projectedFirstOrder: Math.max(0, Math.round(asNumber(raw.projectedFirstOrder, fallback.projectedFirstOrder))),
    projectedLTV: Math.max(0, Math.round(asNumber(raw.projectedLTV, fallback.projectedLTV))),
    outreach: Array.isArray(raw.outreach) ? raw.outreach as LeadOutreach[] : fallback.outreach,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === "string") : fallback.tags,
    status: LEAD_STATUSES.includes(rawStatus) ? rawStatus : fallback.status,
    intakeSnapshot: Array.isArray(raw.intakeSnapshot) ? raw.intakeSnapshot as LeadIntakeAnswer[] : fallback.intakeSnapshot,
    cartItems: Array.isArray(raw.cartItems) ? raw.cartItems.filter((t): t is string => typeof t === "string") : fallback.cartItems,
    createdAt: asNumber(raw.createdAt, fallback.createdAt),
    lastTouchAt: asNumber(raw.lastTouchAt, fallback.lastTouchAt),
    source,
    lastStep: asString(raw.lastStep, fallback.lastStep),
    ageHrs: Math.max(0, Math.round(asNumber(raw.ageHrs, fallback.ageHrs))),
    contacted: asBoolean(raw.contacted, fallback.contacted),
  };
}

function normalizeLeads(rawLeads: unknown, freshLeads: Lead[]) {
  if (!Array.isArray(rawLeads)) return freshLeads;
  return rawLeads.map((lead, index) => normalizeLead(lead, freshLeads[index % freshLeads.length] ?? freshLeads[0])).filter(Boolean);
}

/** Merge persisted integration state onto fresh catalog. Preserves user-set
 *  status/config/webhookEvents/syncHistory; drops persisted entries whose
 *  id no longer exists in the catalog; adds any new catalog entries. */
function normalizeIntegrations(raw: unknown, fresh: Integration[]): Integration[] {
  if (!Array.isArray(raw)) return fresh;
  const persisted = new Map<string, unknown>();
  for (const item of raw) if (isRecord(item) && typeof item.id === "string") persisted.set(item.id, item);
  return fresh.map((base) => {
    const p = persisted.get(base.id);
    if (!isRecord(p)) return base;
    const status = typeof p.status === "string" && ["connected","degraded","down","disconnected"].includes(p.status)
      ? p.status as IntegrationStatus : base.status;
    const config = isRecord(p.config) ? p.config as Record<string, string | boolean> : base.config;
    const webhookEvents = Array.isArray(p.webhookEvents)
      ? base.webhookEvents.map((w) => {
          const match = (p.webhookEvents as unknown[]).find((x) => isRecord(x) && x.key === w.key);
          return isRecord(match) && typeof match.enabled === "boolean" ? { ...w, enabled: match.enabled } : w;
        })
      : base.webhookEvents;
    const syncHistory = Array.isArray(p.syncHistory)
      ? (p.syncHistory as unknown[]).filter((h): h is IntegrationSyncEntry =>
          isRecord(h) && typeof h.ts === "number" && typeof h.event === "string"
          && (h.status === "ok" || h.status === "warn" || h.status === "error"))
      : base.syncHistory;
    return {
      ...base,
      status,
      lastSync: asNumber(p.lastSync, base.lastSync),
      lastError: typeof p.lastError === "string" ? p.lastError : undefined,
      connectedAt: typeof p.connectedAt === "number" ? p.connectedAt : (status === "connected" ? base.connectedAt : undefined),
      config,
      webhookEvents,
      syncHistory,
    };
  });
}

function mergeSettings(raw: unknown, fresh: SettingsSlice): SettingsSlice {
  if (!isRecord(raw)) return fresh;
  const merged: SettingsSlice = { ...fresh };
  for (const key of Object.keys(fresh) as (keyof SettingsSlice)[]) {
    const persisted = (raw as Record<string, unknown>)[key];
    if (isRecord(persisted)) {
      // shallow merge object slices; arrays inside are replaced only if array-like persisted
      (merged as Record<string, unknown>)[key] = { ...(fresh[key] as object), ...(persisted as object) };
    }
  }
  return merged;
}

function load(): AdminState {
  if (typeof window === "undefined") return seed();
  const fresh = seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AdminState>;
      return {
        ...fresh,
        ...parsed,
        leads: normalizeLeads(parsed.leads, fresh.leads),
        integrations: normalizeIntegrations(parsed.integrations, fresh.integrations),
        settings: mergeSettings(parsed.settings, fresh.settings),
        auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog as AuditEntry[] : fresh.auditLog,
        ui: { ...fresh.ui, ...(parsed.ui ?? {}) },
      } as AdminState;
    }
  } catch {}
  try { window.localStorage.setItem(KEY, JSON.stringify(fresh)); } catch {}
  return fresh;
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

function pickAutoReply(text: string): string {
  const t = text.toLowerCase();
  if (/refund|cancel/.test(t)) return "Thanks — I'll review this and get back to you shortly.";
  if (/dose|nausea|side effect|symptom/.test(t)) return "Got it, sharing this with Dr. Nass. Please continue current dose unless we advise otherwise.";
  if (/shipping|track|delivery|arrive/.test(t)) return "Thanks for the update — I'll check tracking and follow up within the hour.";
  if (/thank|thanks|appreciate/.test(t)) return "Anytime — let us know if anything else comes up.";
  const generic = [
    "Thanks — got it. I'll follow up shortly.",
    "Understood. Let me look into this and circle back.",
    "Received — appreciate the note.",
    "Got it, one moment while I check.",
  ];
  return generic[text.length % generic.length];
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
      return { ...fresh, scenario: sc };
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
  connectIntegration(id: string, cfg: Record<string, string | boolean>) {
    const ts = Date.now();
    const entry: IntegrationSyncEntry = { ts, event: "Integration connected", status: "ok" };
    set((s) => ({
      integrations: s.integrations.map((i) => i.id === id ? {
        ...i,
        status: "connected" as const,
        lastSync: ts,
        connectedAt: i.connectedAt ?? ts,
        config: { ...i.config, ...cfg },
        lastError: undefined,
        syncHistory: [entry, ...i.syncHistory].slice(0, 50),
      } : i),
      activity: [{ id: `a_${ts}`, ts, text: `Connected ${s.integrations.find((i) => i.id === id)?.name ?? "integration"}`, tone: "success" as const }, ...s.activity],
    }));
  },
  disconnectIntegration(id: string) {
    const ts = Date.now();
    const entry: IntegrationSyncEntry = { ts, event: "Integration disconnected", status: "warn" };
    set((s) => ({
      integrations: s.integrations.map((i) => i.id === id ? {
        ...i,
        status: "disconnected" as const,
        config: {},
        connectedAt: undefined,
        lastError: undefined,
        syncHistory: [entry, ...i.syncHistory].slice(0, 50),
      } : i),
      activity: [{ id: `a_${ts}`, ts, text: `Disconnected ${s.integrations.find((i) => i.id === id)?.name ?? "integration"}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  testIntegration(id: string) {
    const ts = Date.now();
    const ok = Math.random() > 0.1;
    const entry: IntegrationSyncEntry = ok
      ? { ts, event: "Test connection · OK", status: "ok", detail: `Round-trip ${Math.floor(180 + Math.random()*400)}ms` }
      : { ts, event: "Test connection · Failed", status: "error", detail: "HTTP 401 · check credentials" };
    set((s) => ({
      integrations: s.integrations.map((i) => i.id === id ? {
        ...i,
        status: ok ? "connected" as const : "degraded" as const,
        lastSync: ok ? ts : i.lastSync,
        lastError: ok ? undefined : "Test failed — HTTP 401",
        syncHistory: [entry, ...i.syncHistory].slice(0, 50),
      } : i),
    }));
    return ok;
  },
  syncIntegration(id: string) {
    const ts = Date.now();
    const entry: IntegrationSyncEntry = { ts, event: "Manual sync", status: "ok", detail: `${Math.floor(4+Math.random()*40)} records reconciled` };
    set((s) => ({
      integrations: s.integrations.map((i) => i.id === id ? {
        ...i, lastSync: ts,
        syncHistory: [entry, ...i.syncHistory].slice(0, 50),
      } : i),
    }));
  },
  updateIntegrationConfig(id: string, patch: Record<string, string | boolean>) {
    set((s) => ({
      integrations: s.integrations.map((i) => i.id === id ? { ...i, config: { ...i.config, ...patch } } : i),
    }));
  },
  toggleIntegrationWebhookEvent(id: string, key: string) {
    set((s) => ({
      integrations: s.integrations.map((i) => i.id === id ? {
        ...i, webhookEvents: i.webhookEvents.map((w) => w.key === key ? { ...w, enabled: !w.enabled } : w),
      } : i),
    }));
  },
  setActiveCase(id: string | null) { set((s) => ({ ui: { ...s.ui, activeCaseId: id } })); },
  sendCheckInReminder(id: string) {
    set((s) => ({
      checkIns: s.checkIns.map((c) => (c.id === id ? { ...c, reminderSentAt: Date.now(), reminderCount: (c.reminderCount ?? 0) + 1 } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Check-in reminder sent — ${s.checkIns.find(c => c.id === id)?.patientName ?? "patient"}`, tone: "info" as const }, ...s.activity],
    }));
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
    set((s) => ({
      conversations: s.conversations.map((c) => {
        if (c.id !== convoId) return c;
        const sys: ConvoMessage = { id: `sys_${Date.now()}`, from: "system", text: `Assigned to ${to} · ${status}`, ts: Date.now(), systemKind: "assignment" };
        return { ...c, assignedTo: to, status, messages: [...c.messages, sys] };
      }),
    }));
  },
  sendConvoMessage(convoId: string, opts: { text: string; internal?: boolean; channel?: MessageChannel; attachments?: ConvoAttachment[] }) {
    const id = `cm_${Date.now()}`;
    const now = Date.now();
    const msg: ConvoMessage = {
      id, from: "me", authorName: "You", text: opts.text, ts: now,
      internal: opts.internal, channel: opts.channel, attachments: opts.attachments, state: "sending",
    };
    set((s) => ({
      conversations: s.conversations.map((c) => c.id === convoId
        ? { ...c, messages: [...c.messages, msg], preview: opts.text.slice(0, 120), updatedAt: now, unread: false, unreadCount: 0 }
        : c),
    }));
    // Optimistic state ladder
    setTimeout(() => set((s) => ({
      conversations: s.conversations.map((c) => c.id === convoId
        ? { ...c, messages: c.messages.map((m) => m.id === id ? { ...m, state: "sent" as const } : m) } : c),
    })), 400);
    setTimeout(() => set((s) => ({
      conversations: s.conversations.map((c) => c.id === convoId
        ? { ...c, messages: c.messages.map((m) => m.id === id ? { ...m, state: "delivered" as const } : m) } : c),
    })), 1100);
    if (!opts.internal) {
      // Typing → reply simulation
      setTimeout(() => set((s) => ({
        conversations: s.conversations.map((c) => c.id === convoId ? { ...c, typing: true } : c),
      })), 1400);
      setTimeout(() => {
        set((s) => {
          const convo = s.conversations.find((c) => c.id === convoId);
          if (!convo) return {};
          const reply: ConvoMessage = {
            id: `cm_${Date.now()}r`, from: "them", authorName: convo.patientName,
            text: pickAutoReply(opts.text), ts: Date.now(), state: "delivered" as const, channel: convo.channel,
          };
          return {
            conversations: s.conversations.map((c) => c.id === convoId
              ? { ...c, typing: false, messages: [...c.messages.map((m) => m.id === id ? { ...m, state: "seen" as const } : m), reply], preview: reply.text.slice(0, 120), updatedAt: Date.now(), unread: true, unreadCount: (c.unreadCount ?? 0) + 1 }
              : c),
          };
        });
      }, 2600);
    }
  },
  markConvoSeen(convoId: string) {
    set((s) => ({ conversations: s.conversations.map((c) => c.id === convoId ? { ...c, unread: false, unreadCount: 0 } : c) }));
  },
  snoozeConvo(convoId: string, hours: number) {
    const until = Date.now() + hours * 3600_000;
    set((s) => ({
      conversations: s.conversations.map((c) => c.id === convoId
        ? { ...c, snoozedUntil: until, messages: [...c.messages, { id: `sys_${Date.now()}`, from: "system" as const, text: `Snoozed for ${hours}h`, ts: Date.now(), systemKind: "info" as const }] }
        : c),
    }));
  },
  unsnoozeConvo(convoId: string) {
    set((s) => ({ conversations: s.conversations.map((c) => c.id === convoId ? { ...c, snoozedUntil: undefined } : c) }));
  },
  closeConvo(convoId: string) {
    set((s) => ({
      conversations: s.conversations.map((c) => c.id === convoId
        ? { ...c, status: "closed" as const, messages: [...c.messages, { id: `sys_${Date.now()}`, from: "system" as const, text: `Conversation closed`, ts: Date.now(), systemKind: "status" as const }] }
        : c),
    }));
  },
  reopenConvo(convoId: string) {
    set((s) => ({ conversations: s.conversations.map((c) => c.id === convoId ? { ...c, status: "support" as const } : c) }));
  },
  toggleConvoTag(convoId: string, tag: string) {
    set((s) => ({
      conversations: s.conversations.map((c) => {
        if (c.id !== convoId) return c;
        const cur = c.tags ?? [];
        const next = cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag];
        return { ...c, tags: next };
      }),
    }));
  },
  setConvoPriority(convoId: string, priority: "normal" | "high") {
    set((s) => ({ conversations: s.conversations.map((c) => c.id === convoId ? { ...c, priority } : c) }));
  },
  toggleConvoStar(convoId: string) {
    set((s) => ({ conversations: s.conversations.map((c) => c.id === convoId ? { ...c, starred: !c.starred } : c) }));
  },
  setInboxFolder(folder: string) { set((s) => ({ ui: { ...s.ui, inboxFolder: folder } })); },
  setInboxChannel(channel: MessageChannel | "all") { set((s) => ({ ui: { ...s.ui, inboxChannel: channel } })); },
  setInboxSearch(q: string) { set((s) => ({ ui: { ...s.ui, inboxSearch: q } })); },
  setConvoInternalNote(convoId: string, note: string) {
    set((s) => ({ conversations: s.conversations.map((c) => c.id === convoId ? { ...c, internalNote: note } : c) }));
  },
  markLeadContacted(id: string) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, contacted: true, lastTouchAt: Date.now() } : l)) }));
  },
  updateLeadStatus(id: string, status: LeadStatus, lossReason?: string) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status, lossReason: status === "lost" ? lossReason ?? l.lossReason : undefined } : l)) }));
  },
  assignLead(id: string, assignee: string) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, assignee, status: l.status === "new" ? "working" as const : l.status } : l)) }));
  },
  addLeadOutreach(id: string, channel: LeadOutreachChannel, subject: string, outcome = "logged") {
    const o: LeadOutreach = { id: `or_${Date.now()}`, ts: Date.now(), channel, by: "You", subject, outcome };
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, outreach: [o, ...(l.outreach ?? [])], contacted: true, lastTouchAt: Date.now(), status: l.status === "new" ? "working" as const : l.status } : l)) }));
  },
  addLeadTag(id: string, tag: string) {
    const t = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t) return;
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, tags: Array.from(new Set([...(l.tags ?? []), t])) } : l)) }));
  },
  removeLeadTag(id: string, tag: string) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, tags: (l.tags ?? []).filter((x) => x !== tag) } : l)) }));
  },
  setLeadConsent(id: string, patch: Partial<Lead["consent"]>) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, consent: { ...(l.consent ?? { email: true, sms: false, marketing: false }), ...patch } } : l)) }));
  },
  markLeadLost(id: string, reason: string) {
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status: "lost" as const, lossReason: reason } : l)) }));
  },
  convertLeadToPatient(id: string) {
    const lead = state.leads.find((l) => l.id === id);
    if (!lead) return;
    const [firstName, ...rest] = lead.name.split(" ");
    const lastName = rest.join(" ") || "—";
    const isWL = lead.program === "Tirzepatide" || lead.program === "Semaglutide";
    const program: ProgramCode = isWL ? (lead.program === "Tirzepatide" ? "tirz_mo" : "sema_mo") : "tirz_mo";
    const newPt: Patient = {
      id: `pt_from_${lead.id}`,
      firstName, lastName,
      email: lead.email,
      phone: lead.phone,
      status: "pending",
      program,
      mrr: 0,
      ltv: 0,
      startedAt: iso(0),
      churn: "low",
      state: lead.state,
      tags: ["converted-lead"],
    };
    set((s) => ({
      patients: [newPt, ...s.patients],
      leads: s.leads.map((l) => (l.id === id ? { ...l, status: "won" as const, wonPatientId: newPt.id } : l)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Lead converted — ${lead.name}`, tone: "success" as const }, ...s.activity],
    }));
  },
  deleteLead(id: string) {
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) }));
  },

  /* ── Patient mutations ── */
  updatePatient(id: string, patch: Partial<Patient>) {
    set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  },
  pausePatient(id: string) {
    set((s) => ({
      patients: s.patients.map((p) => (p.id === id ? { ...p, status: "paused" as const, mrr: 0, churn: "high" as const } : p)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Subscription paused — ${s.patients.find(p => p.id === id)?.firstName ?? "patient"}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  cancelPatient(id: string, reason: string) {
    set((s) => ({
      patients: s.patients.map((p) => (p.id === id ? { ...p, status: "cancelled" as const, mrr: 0, cancelReason: reason, churn: "critical" as const } : p)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Subscription cancelled — ${s.patients.find(p => p.id === id)?.firstName ?? "patient"} · ${reason}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  reactivatePatient(id: string) {
    set((s) => ({
      patients: s.patients.map((p) => {
        if (p.id !== id) return p;
        return { ...p, status: "active" as const, mrr: PROGRAMS[p.program].price, churn: "low" as const, cancelReason: undefined };
      }),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Subscription reactivated — ${s.patients.find(p => p.id === id)?.firstName ?? "patient"}`, tone: "success" as const }, ...s.activity],
    }));
  },
  switchPlanPatient(id: string, program: ProgramCode) {
    set((s) => ({
      patients: s.patients.map((p) => (p.id === id ? { ...p, program, mrr: p.status === "active" ? PROGRAMS[program].price : 0 } : p)),
    }));
  },
  retryPatientPayment(patientId: string) {
    set((s) => ({
      patients: s.patients.map((p) => (p.id === patientId ? { ...p, status: "active" as const, mrr: PROGRAMS[p.program].price, churn: "low" as const } : p)),
      payments: s.payments.map((p) => (p.patientId === patientId && p.status === "failed" ? { ...p, status: "succeeded" as const, failureReason: undefined } : p)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Payment retried & captured — ${s.patients.find(p => p.id === patientId)?.firstName ?? "patient"}`, tone: "success" as const }, ...s.activity],
    }));
  },
  writeOffPatientPayment(patientId: string) {
    set((s) => ({
      payments: s.payments.map((p) => (p.patientId === patientId && p.status === "failed" ? { ...p, status: "refunded" as const } : p)),
    }));
  },
  addPatientNote(id: string, text: string, author = "You") {
    if (!text.trim()) return;
    const note: InternalNote = { id: `n_${Date.now()}`, author, ts: Date.now(), text: text.trim() };
    set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, notes: [note, ...(p.notes ?? [])] } : p)) }));
  },
  addOrderNote(orderId: string, text: string, author = "You") {
    if (!text.trim()) return;
    const note: InternalNote = { id: `on_${Date.now()}`, author, ts: Date.now(), text: text.trim() };
    set((s) => ({ orderNotes: { ...s.orderNotes, [orderId]: [note, ...(s.orderNotes[orderId] ?? [])] } }));
  },
  addPatientTag(id: string, tag: string) {
    const t = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t) return;
    set((s) => ({
      patients: s.patients.map((p) => (p.id === id ? { ...p, tags: Array.from(new Set([...(p.tags ?? []), t])) } : p)),
    }));
  },
  removePatientTag(id: string, tag: string) {
    set((s) => ({
      patients: s.patients.map((p) => (p.id === id ? { ...p, tags: (p.tags ?? []).filter((t) => t !== tag) } : p)),
    }));
  },
  flagPatientForReview(id: string, reason: string) {
    const patient = state.patients.find((p) => p.id === id);
    if (!patient) return;
    const task: Task = {
      id: `t_${Date.now()}`,
      subject: `${patient.firstName} ${patient.lastName}`,
      action: `Flag: ${reason}`,
      ageHrs: 0,
      status: "open",
      assignee: "Unassigned",
      category: "care_ops",
    };
    set((s) => ({
      tasks: [task, ...s.tasks],
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Flagged ${patient.firstName} ${patient.lastName} — ${reason}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  sendMagicLink(id: string) {
    set((s) => ({
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Magic link sent — ${s.patients.find(p => p.id === id)?.firstName ?? "patient"}`, tone: "info" as const }, ...s.activity],
    }));
  },
  refundPatientCharge(patientId: string, amount: number, reason: string) {
    set((s) => ({
      payments: [
        { id: `py_r_${Date.now()}`, patientId, patientName: s.patients.find(p => p.id === patientId) ? `${s.patients.find(p => p.id === patientId)!.firstName} ${s.patients.find(p => p.id === patientId)!.lastName}` : "Patient", amount, status: "refunded" as const, createdAt: iso(0), method: "Visa · 4242", failureReason: reason },
        ...s.payments,
      ],
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Refund $${amount} — ${s.patients.find(p => p.id === patientId)?.firstName ?? "patient"} · ${reason}`, tone: "info" as const }, ...s.activity],
    }));
  },

  /* ── Order mutations ── */
  advanceOrderStage(orderId: string) {
    const ORDER: OrderStatus[] = ["processing", "at_pharmacy", "shipped", "delivered"];
    set((s) => ({
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const idx = ORDER.indexOf(o.status);
        if (idx < 0 || idx >= ORDER.length - 1) return o;
        const next = ORDER[idx + 1];
        const kindMap: Record<OrderStatus, OrderTimelineExtra["kind"]> = {
          processing: "created", at_pharmacy: "sent_to_pharmacy", shipped: "shipped", delivered: "delivered", exception: "exception",
        };
        const msgMap: Record<OrderStatus, string> = {
          processing: "Order created",
          at_pharmacy: "Rx transmitted to pharmacy",
          shipped: "Shipment picked up by carrier",
          delivered: "Delivered — signed",
          exception: "Delivery exception",
        };
        const ev: OrderTimelineExtra = { ts: Date.now(), actor: "ops", kind: kindMap[next], message: msgMap[next] };
        return {
          ...o,
          status: next,
          tracking: o.tracking ?? `1Z${Math.random().toString(36).slice(2, 12).toUpperCase()}`,
          timelineExtra: [...(o.timelineExtra ?? []), ev],
        };
      }),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Advanced order ${orderId.replace("ord_", "#")}`, tone: "info" as const }, ...s.activity],
    }));
  },
  refundOrder(orderId: string, reason = "Manual refund") {
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, paymentOverride: "refunded" as const, timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "ops" as const, kind: "note" as const, message: `Refund issued — ${reason}` }] } : o)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Refund issued on ${orderId.replace("ord_", "#")} — ${reason}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  retryOrderPayment(orderId: string) {
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, paymentOverride: "paid" as const, timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "system" as const, kind: "paid" as const, message: "Retry captured" }] } : o)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Retried payment on ${orderId.replace("ord_", "#")}`, tone: "success" as const }, ...s.activity],
    }));
  },
  reissueLabel(orderId: string) {
    const newTracking = `1Z${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, tracking: newTracking, timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "ops" as const, kind: "label" as const, message: "Label reissued", meta: newTracking }] } : o)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Label reissued for ${orderId.replace("ord_", "#")}`, tone: "info" as const }, ...s.activity],
    }));
  },
  reportOrderException(orderId: string, reason: string) {
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: "exception" as const, flagsExtra: [...(o.flagsExtra ?? []), reason], timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "ops" as const, kind: "exception" as const, message: `Exception reported — ${reason}` }] } : o)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Exception on ${orderId.replace("ord_", "#")} — ${reason}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  updateOrderAddress(orderId: string, patch: NonNullable<Order["shipToOverride"]>) {
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, shipToOverride: { ...(o.shipToOverride ?? {}), ...patch }, timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "ops" as const, kind: "note" as const, message: `Shipping address updated` }] } : o)),
    }));
  },
  assignOrderOps(orderId: string, ops: string) {
    set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, opsOwner: ops } : o)) }));
  },
  addOrderTag(orderId: string, tag: string) {
    const t = tag.trim();
    if (!t) return;
    set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, tags: Array.from(new Set([...(o.tags ?? []), t])) } : o)) }));
  },
  removeOrderTag(orderId: string, tag: string) {
    set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, tags: (o.tags ?? []).filter((x) => x !== tag) } : o)) }));
  },
  sendOrderReceipt(orderId: string) {
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "ops" as const, kind: "message" as const, message: "Receipt emailed to patient" }] } : o)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Receipt sent for ${orderId.replace("ord_", "#")}`, tone: "info" as const }, ...s.activity],
    }));
  },
  printOrderLabel(orderId: string) {
    set((s) => ({
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Label printed for ${orderId.replace("ord_", "#")}`, tone: "info" as const }, ...s.activity],
    }));
  },
  skipNextRefill(orderId: string) {
    set((s) => ({
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const cur = o.eta ? Date.parse(o.eta) : Date.now();
        const next = new Date(cur + 30 * DAY).toISOString().slice(0, 10);
        return { ...o, eta: next, timelineExtra: [...(o.timelineExtra ?? []), { ts: Date.now(), actor: "ops" as const, kind: "note" as const, message: `Refill skipped — next: ${next}` }] };
      }),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Refill skipped on ${orderId.replace("ord_", "#")}`, tone: "info" as const }, ...s.activity],
    }));
  },
  sendPatientCheckInReminder(patientId: string) {
    set((s) => ({
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Check-in reminder sent — ${s.patients.find((p) => p.id === patientId)?.firstName ?? "patient"}`, tone: "info" as const }, ...s.activity],
    }));
  },

  /* ── More patient mutations ── */
  deletePatient(id: string) {
    set((s) => ({
      patients: s.patients.filter((p) => p.id !== id),
      orders: s.orders.filter((o) => o.patientId !== id),
      payments: s.payments.filter((p) => p.patientId !== id),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Patient deleted — ${s.patients.find((p) => p.id === id)?.firstName ?? "patient"}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  createManualOrder(patientId: string): string | null {
    const p = state.patients.find((x) => x.id === patientId);
    if (!p) return null;
    const id = `ord_manual_${Date.now().toString(36)}`;
    const order: Order = {
      id,
      patientId,
      patientName: `${p.firstName} ${p.lastName}`,
      amount: PROGRAMS[p.program].price,
      status: "processing",
      program: p.program,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({
      orders: [order, ...s.orders],
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Manual order created for ${p.firstName} ${p.lastName}`, tone: "success" as const }, ...s.activity],
    }));
    return id;
  },
  updatePatientCard(id: string, brand: string, last4: string) {
    set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, cardBrandOverride: brand, cardLast4Override: last4 } : p)) }));
  },
  updatePatientAddress(id: string, addr: NonNullable<Patient["addressOverride"]>) {
    set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, addressOverride: addr, state: addr.state ?? p.state } : p)) }));
  },
  updatePatientBillingDate(id: string, iso: string) {
    set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, nextBillingOverride: iso } : p)) }));
  },
  exportPatientPdf(id: string) {
    set((s) => ({
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Patient record exported — ${s.patients.find((p) => p.id === id)?.firstName ?? "patient"}`, tone: "info" as const }, ...s.activity],
    }));
  },
  /** Ensure a conversation exists for a patient; return its id (creates a stub if none). */
  ensureConversationFor(patientId: string): string | null {
    const p = state.patients.find((x) => x.id === patientId);
    if (!p) return null;
    const existing = state.conversations.find((c) => c.patientId === patientId);
    if (existing) return existing.id;
    const id = `cv_${Date.now().toString(36)}`;
    const convo: Conversation = {
      id,
      patientId,
      patientName: `${p.firstName} ${p.lastName}`,
      patientEmail: p.email,
      patientPhone: p.phone,
      channel: "in_app",
      status: "support",
      tag: "general",
      assignedTo: "You",
      unread: false,
      preview: "New conversation",
      updatedAt: Date.now(),
      messages: [],
      program: p.program,
      ltv: p.ltv,
      startedAt: p.startedAt,
      internalNote: "",
    };
    set((s) => ({ conversations: [convo, ...s.conversations] }));
    return id;
  },

  /* ── Physician case mutations ── */
  updateCasePatientNote(caseId: string, text: string) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === caseId ? { ...c, patientNote: text } : c)) }));
  },
  updateCaseInternalNote(caseId: string, text: string) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === caseId ? { ...c, internalNote: text } : c)) }));
  },
  updateCaseRxDraft(caseId: string, patch: NonNullable<PhysicianCase["rxDraft"]>) {
    set((s) => ({ cases: s.cases.map((c) => (c.id === caseId ? { ...c, rxDraft: { ...(c.rxDraft ?? {}), ...patch } } : c)) }));
  },
  approveCaseWithRx(caseId: string, opts?: { patientNote?: string; internalNote?: string; decidedBy?: string }) {
    const c0 = state.cases.find((c) => c.id === caseId);
    if (!c0) return;
    const ev: CaseTimelineEvent = { ts: Date.now(), kind: "approved", by: opts?.decidedBy ?? "You", detail: "Rx transmitted to South End Pharmacy" };
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? {
        ...c,
        status: "approved" as const,
        decision: "Approved",
        decisionAt: Date.now(),
        decidedBy: opts?.decidedBy ?? "You",
        patientNote: opts?.patientNote ?? c.patientNote,
        internalNote: opts?.internalNote ?? c.internalNote,
        timeline: [...(c.timeline ?? []), ev],
      } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Case ${caseId} approved — Rx sent`, tone: "success" as const }, ...s.activity],
    }));
  },
  requestInfoOnCase(caseId: string, message: string) {
    const c0 = state.cases.find((c) => c.id === caseId);
    if (!c0) return;
    const ev: CaseTimelineEvent = { ts: Date.now(), kind: "info_requested", by: "You", detail: message };
    // Ensure a convo exists and drop a physician message in it
    const convoId = adminActions.ensureConversationFor(c0.patientId);
    if (convoId) adminActions.sendReply(convoId, message, false);
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, status: "awaitingReply" as const, timeline: [...(c.timeline ?? []), ev] } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Info requested on case ${caseId}`, tone: "info" as const }, ...s.activity],
    }));
  },
  denyCaseWithReason(caseId: string, reason: string, freeText?: string) {
    const detail = freeText ? `${reason} — ${freeText}` : reason;
    const ev: CaseTimelineEvent = { ts: Date.now(), kind: "denied", by: "You", detail };
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? {
        ...c,
        status: "denied" as const,
        decision: detail,
        decisionAt: Date.now(),
        decidedBy: "You",
        timeline: [...(c.timeline ?? []), ev],
      } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Case ${caseId} denied — ${reason}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  reassignCase(caseId: string, physicianId: string) {
    const phy = state.physicians.find((p) => p.id === physicianId);
    const ev: CaseTimelineEvent = { ts: Date.now(), kind: "reassigned", by: "You", detail: phy?.name };
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, assignedTo: physicianId, timeline: [...(c.timeline ?? []), ev] } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Case ${caseId} reassigned to ${phy?.name ?? physicianId}`, tone: "info" as const }, ...s.activity],
    }));
  },
  setCasePriority(caseId: string, priority: "urgent" | "normal") {
    const ev: CaseTimelineEvent = { ts: Date.now(), kind: "priority_set", by: "You", detail: priority };
    set((s) => ({
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, priority, timeline: [...(c.timeline ?? []), ev] } : c)),
    }));
  },

  /* ── Check-in mutations ── */
  updateCheckInPatientNote(id: string, text: string) {
    set((s) => ({ checkIns: s.checkIns.map((c) => (c.id === id ? { ...c, patientNote: text } : c)) }));
  },
  updateCheckInInternalNote(id: string, text: string) {
    set((s) => ({ checkIns: s.checkIns.map((c) => (c.id === id ? { ...c, internalNote: text } : c)) }));
  },
  approveCheckInRefill(id: string, opts?: { patientNote?: string; internalNote?: string }) {
    const ci = state.checkIns.find((c) => c.id === id);
    if (!ci) return;
    const orderId = adminActions.createManualOrder(ci.patientId);
    set((s) => ({
      checkIns: s.checkIns.map((c) => (c.id === id ? {
        ...c,
        decision: "approved" as const,
        decisionAt: Date.now(),
        decidedBy: "You",
        patientNote: opts?.patientNote ?? c.patientNote,
        internalNote: opts?.internalNote ?? c.internalNote,
        refillOrderId: orderId ?? c.refillOrderId,
      } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Refill approved — ${ci.patientName}`, tone: "success" as const }, ...s.activity],
    }));
  },
  approveCheckInWithAdjustment(id: string, opts: { doseChange?: string; note?: string; patientNote?: string; internalNote?: string }) {
    const ci = state.checkIns.find((c) => c.id === id);
    if (!ci) return;
    const orderId = adminActions.createManualOrder(ci.patientId);
    if (opts.note) {
      const convoId = adminActions.ensureConversationFor(ci.patientId);
      if (convoId) adminActions.sendReply(convoId, opts.note, false);
    }
    set((s) => ({
      checkIns: s.checkIns.map((c) => (c.id === id ? {
        ...c,
        decision: "adjusted" as const,
        decisionAt: Date.now(),
        decidedBy: "You",
        adjustment: { doseChange: opts.doseChange, note: opts.note },
        patientNote: opts.patientNote ?? c.patientNote,
        internalNote: opts.internalNote ?? c.internalNote,
        refillOrderId: orderId ?? c.refillOrderId,
      } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Refill approved with adjustment — ${ci.patientName}`, tone: "warn" as const }, ...s.activity],
    }));
  },
  messagePatientFromCheckIn(id: string, message: string) {
    const ci = state.checkIns.find((c) => c.id === id);
    if (!ci) return;
    const convoId = adminActions.ensureConversationFor(ci.patientId);
    if (convoId) adminActions.sendReply(convoId, message, false);
    set((s) => ({
      checkIns: s.checkIns.map((c) => (c.id === id ? { ...c, decision: "awaiting_reply" as const } : c)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Message sent to ${ci.patientName} from check-in`, tone: "info" as const }, ...s.activity],
    }));
  },
  holdCheckInRefill(id: string, reason: string, freeText?: string) {
    const ci = state.checkIns.find((c) => c.id === id);
    if (!ci) return;
    set((s) => ({
      checkIns: s.checkIns.map((c) => (c.id === id ? {
        ...c,
        decision: "held" as const,
        holdReason: freeText ? `${reason} — ${freeText}` : reason,
        decisionAt: Date.now(),
        decidedBy: "You",
      } : c)),
      patients: s.patients.map((p) => (p.id === ci.patientId ? { ...p, churn: "high" as const } : p)),
      activity: [{ id: `a_${Date.now()}`, ts: Date.now(), text: `Refill held — ${ci.patientName} · ${reason}`, tone: "warn" as const }, ...s.activity],
    }));
  },

  /* ────── Settings actions ────── */
  logAudit(action: string, meta?: { targetType?: string; targetId?: string; meta?: string; actor?: string }) {
    const actor = meta?.actor ?? state.session?.name ?? "You";
    const entry: AuditEntry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ts: Date.now(),
      actor, action,
      targetType: meta?.targetType, targetId: meta?.targetId, meta: meta?.meta,
    };
    set((s) => ({ auditLog: [entry, ...s.auditLog].slice(0, 500) }));
  },
  updateSettingsSection<K extends keyof SettingsSlice>(section: K, patch: Partial<SettingsSlice[K]>) {
    set((s) => ({ settings: { ...s.settings, [section]: { ...(s.settings[section] as object), ...(patch as object) } } as SettingsSlice }));
    adminActions.logAudit(`Updated ${String(section)} settings`);
  },
  updatePricing(patch: Partial<PricingConfig>) {
    set((s) => ({ settings: { ...s.settings, pricing: { ...s.settings.pricing, ...patch } } }));
    adminActions.logAudit("Updated plan pricing");
  },
  inviteTeamMember(email: string, role: TeamRole) {
    const invite: PendingInvite = {
      id: `inv_${Date.now()}`, email, role,
      invitedAt: Date.now(), expiresAt: Date.now() + 72 * 3600 * 1000,
    };
    set((s) => ({ settings: { ...s.settings, team: { ...s.settings.team, pendingInvites: [invite, ...s.settings.team.pendingInvites] } } }));
    adminActions.logAudit(`Invited team member ${email} as ${role}`);
  },
  cancelInvite(id: string) {
    set((s) => ({ settings: { ...s.settings, team: { ...s.settings.team, pendingInvites: s.settings.team.pendingInvites.filter((i) => i.id !== id) } } }));
    adminActions.logAudit("Cancelled pending invite");
  },
  removeTeamMember(id: string) {
    const member = state.settings.team.members.find((m) => m.id === id);
    if (!member || member.role === "owner") return;
    set((s) => ({ settings: { ...s.settings, team: { ...s.settings.team, members: s.settings.team.members.filter((m) => m.id !== id) } } }));
    adminActions.logAudit(`Removed team member ${member.email}`);
  },
  updateTeamMemberRole(id: string, role: TeamRole) {
    set((s) => ({ settings: { ...s.settings, team: { ...s.settings.team, members: s.settings.team.members.map((m) => m.id === id ? { ...m, role } : m) } } }));
    adminActions.logAudit("Updated team member role", { targetId: id, meta: role });
  },
  setRoutingRule(product: RoutingRule["product"], slot: "primaryId" | "backupId", pharmacyId: string | undefined) {
    set((s) => ({ settings: { ...s.settings, routing: { ...s.settings.routing, rules: s.settings.routing.rules.map((r) => r.product === product ? { ...r, [slot]: pharmacyId } : r) } } }));
    adminActions.logAudit(`Updated pharmacy routing (${product} · ${slot})`);
  },
  toggleVersionA(enforced: boolean) {
    set((s) => ({ settings: { ...s.settings, routing: { ...s.settings.routing, versionAEnforced: enforced } } }));
    adminActions.logAudit(`Version A enforcement ${enforced ? "enabled" : "disabled"}`);
  },
  toggleServedState(code: string, enabled: boolean) {
    set((s) => {
      const prev = s.settings.states.served[code] ?? { enabled: false, primary: true, backup: true };
      return { settings: { ...s.settings, states: { ...s.settings.states, served: { ...s.settings.states.served, [code]: { ...prev, enabled } } } } };
    });
    adminActions.logAudit(`${enabled ? "Enabled" : "Disabled"} state ${code}`);
  },
  notifyWaitlist(code: string) {
    set((s) => ({ settings: { ...s.settings, states: { ...s.settings.states, waitlistCounts: { ...s.settings.states.waitlistCounts, [code]: 0 } } } }));
    adminActions.logAudit(`Notified waitlist patients in ${code}`);
  },
  toggleAlertKey(key: AlertKey) {
    set((s) => ({ settings: { ...s.settings, notifications: { ...s.settings.notifications, alerts: { ...s.settings.notifications.alerts, [key]: !s.settings.notifications.alerts[key] } } } }));
  },
  addAlertEmail(email: string) {
    set((s) => ({ settings: { ...s.settings, notifications: { ...s.settings.notifications, emailRecipients: Array.from(new Set([...s.settings.notifications.emailRecipients, email])) } } }));
    adminActions.logAudit(`Added alert recipient ${email}`);
  },
  removeAlertEmail(email: string) {
    set((s) => ({ settings: { ...s.settings, notifications: { ...s.settings.notifications, emailRecipients: s.settings.notifications.emailRecipients.filter((e) => e !== email) } } }));
    adminActions.logAudit(`Removed alert recipient ${email}`);
  },
  updateDigest(patch: Partial<NotificationsSettings["digest"]>) {
    set((s) => ({ settings: { ...s.settings, notifications: { ...s.settings.notifications, digest: { ...s.settings.notifications.digest, ...patch } } } }));
  },
  toggleDigestItem(key: string) {
    set((s) => ({ settings: { ...s.settings, notifications: { ...s.settings.notifications, digest: { ...s.settings.notifications.digest, items: { ...s.settings.notifications.digest.items, [key]: !s.settings.notifications.digest.items[key] } } } } }));
  },
  uploadBAA(entry: Omit<BAARecord, "id">) {
    const rec: BAARecord = { id: `baa_${Date.now()}`, ...entry };
    set((s) => ({ settings: { ...s.settings, compliance: { ...s.settings.compliance, baa: [rec, ...s.settings.compliance.baa] } } }));
    adminActions.logAudit(`Uploaded BAA for ${entry.vendor}`);
  },
  updateLegalDoc(key: string, body: string) {
    set((s) => ({ settings: { ...s.settings, legal: { ...s.settings.legal, docs: s.settings.legal.docs.map((d) => d.key === key ? { ...d, body, updatedAt: Date.now() } : d) } } }));
    adminActions.logAudit(`Updated legal document ${key}`);
  },



  resetAll() {
    state = seed();
    persist();
    listeners.forEach((l) => l());
  },
  /** Shift funnelDays forward by one day — used by /admin/analytics auto-refresh. */
  tick() {
    set((s) => {
      const last = s.funnelDays[s.funnelDays.length - 1];
      if (!last) return {};
      const wob = (Math.random() - 0.5) * 0.08;
      const scale = 1 + wob;
      const next: FunnelDay = {
        ts: last.ts + DAY,
        sessions: Math.round(last.sessions * scale),
        intakeStarted: Math.round(last.intakeStarted * scale),
        intakeCompleted: Math.round(last.intakeCompleted * scale),
        approved: Math.round(last.approved * scale),
        paid: Math.round(last.paid * scale),
        shipped: Math.round(last.shipped * scale),
        revenue: Math.round(last.revenue * scale),
        newMrr: last.newMrr,
        churnedMrr: last.churnedMrr,
      };
      return { funnelDays: [...s.funnelDays.slice(1), next] };
    });
  },
};


export function hydrateAdmin() {
  if (typeof window === "undefined") return;
  state = load();
  listeners.forEach((l) => l());
}
