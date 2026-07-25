/**
 * PharmaBro whitelabel brand store.
 * Zustand-style slice, localStorage persisted, multi-brand.
 */
import { create } from "zustand";

export type BrandStage = "onboarding" | "zero_sales" | "first_sales" | "scaling";
export type BrandId = string;

export type BrandTheme = { primary: string; primaryFg: string; accent: string; font: string };

export type Brand = {
  id: BrandId;
  name: string;
  slug: string;
  logoText: string;
  logoUrl?: string;
  theme: BrandTheme;
  stage: BrandStage;
  supportEmail: string;
  website: string;
  stripe: { connected: boolean; acct?: string; mode: "live" | "test"; healthcareApproved: boolean; legitScriptApproved: boolean };
  integrations: Record<IntegrationKey, IntegrationState>;
  statesServed: string[];
  legal: { tos: DocSource; privacy: DocSource; consent: DocSource };
  createdAtMs: number;
};

export type IntegrationKey = "klaviyo" | "metaPixel" | "metaAds" | "ga4" | "googleAds" | "tiktok" | "mercury";
export type IntegrationState = { connected: boolean; connectedAtMs?: number; label?: string; account?: string };
export type DocSource = { type: "template" | "custom"; updatedAtMs: number; body?: string };

/* --- BUILD data --- */
export type Product = {
  id: string; displayName: string; internalName: string; molecule: string;
  form: string; primaryPharmacy: string; backupPharmacy?: string;
  starterLifeFileId?: string; maintenanceLifeFileId?: string;
  titrationProtocol: string; description: string; badge: string;
  patientCountLabel: string; status: "live" | "draft" | "archived";
};

export type Plan = {
  id: string; internalName: string; displayName: string; productId: string;
  durationLabel: string; durationDays: number;
  firstPriceCents: number; ongoingPriceCents: number;
  badge?: string; savingsCallout?: string; supplyLabel: string;
  bnplText?: string; preSelected: boolean; stripeProductId?: string; status: "live" | "draft";
};

export type Upsell = {
  id: string; internalName: string; displayName: string; description: string;
  priceCents: number; type: "one_time" | "recurring"; position: "checkout" | "post_buy";
  displayOrder: number; scarcityText?: string; status: "live" | "draft";
};

export type Discount = {
  id: string; code: string; type: "fixed" | "percent" | "free_ship" | "first_order" | "win_back";
  amountCents: number; percent?: number; appliesToPlanId?: "any" | string;
  usageLimit: number | null; usesCount: number; autoApply: boolean; status: "live" | "draft";
};

/* --- FUNNEL / INTAKE / PAGES --- */
export type FunnelBlockType = "hero" | "plan-card" | "quiz-screen" | "cta" | "text" | "image" | "features" | "faq" | "testimonials";
export type FunnelBlock = {
  id: string; type: FunnelBlockType; label: string;
  props: Record<string, unknown>;
};
export type FunnelPage = { id: string; name: string; blocks: FunnelBlock[] };
export type FunnelConfig = {
  draft: FunnelPage[];
  live: FunnelPage[];
  history: { ts: number; snapshot: FunnelPage[]; note: string }[];
  lastPublishedMs?: number;
};

export type IntakeScreenType = "single" | "multi" | "text" | "number" | "date" | "info" | "upload";
export type IntakeScreen = {
  id: string; name: string; type: IntakeScreenType; required: boolean; locked: boolean;
  question: string; options: { id: string; label: string; icon?: string }[];
  klaviyoEvent?: string; storeAs: string; skipLogic?: { ifAnswer: string; jumpTo: string };
  active: boolean;
};
export type IntakeConfig = { screens: IntakeScreen[] };

export type EmailFlowStatus = "live" | "draft" | "paused";
export type EmailInFlow = {
  id: string; subject: string; previewText: string; delayLabel: string;
  fromName?: string; fromEmail?: string; body: string; status: EmailFlowStatus;
};
export type EmailFlow = {
  id: string; name: string; trigger: string; exitCondition: string; status: EmailFlowStatus;
  lastEditedMs: number; klaviyoSynced: boolean; lastSyncMs?: number; emails: EmailInFlow[];
};

export type PageConfig = {
  id: string; name: string; url: string; status: "live" | "draft";
  lastPublishedMs: number; lockedNotes?: string;
};

/* --- CLINICAL demo data (minimal but real, brand-scoped) --- */
export type DemoPatient = { id: string; name: string; email: string; state: string; plan: string; mrrCents: number; status: "active" | "paused" | "cancelled"; joinedMs: number };
export type DemoOrder = { id: string; patientId: string; amountCents: number; stage: "paid" | "clinical_review" | "pharmacy" | "shipped" | "delivered" | "failed"; carrier?: string; createdMs: number; program: string };
export type DemoCase = { id: string; patientId: string; program: string; submittedMs: number; slaHrs: number; flags: string[]; status: "queued" | "approved" | "denied" | "info_requested" };
export type DemoCheckIn = { id: string; patientId: string; dueMs: number; weightLbs: number; status: "due" | "approved" | "held" };
export type DemoPayment = { id: string; patientId: string; amountCents: number; status: "succeeded" | "failed" | "refunded" | "disputed"; createdMs: number };
export type DemoConversation = { id: string; patientId: string; lastMessage: string; unread: number; updatedMs: number };
export type DemoAudit = { id: string; ts: number; actor: string; action: string; detail: string };

export type BrandData = {
  patients: DemoPatient[]; orders: DemoOrder[]; cases: DemoCase[];
  checkIns: DemoCheckIn[]; payments: DemoPayment[]; conversations: DemoConversation[];
  products: Product[]; plans: Plan[]; upsells: Upsell[]; discounts: Discount[];
  funnel: FunnelConfig; intake: IntakeConfig; emailFlows: EmailFlow[]; pages: PageConfig[];
  audit: DemoAudit[];
};

/* ---------- SEEDS ---------- */

function seedProducts(): Product[] {
  return [
    { id: "prod_sema_inj", displayName: "Semaglutide Injectable", internalName: "sema_injectable", molecule: "Semaglutide", form: "Injectable", primaryPharmacy: "South End", backupPharmacy: "Strive", starterLifeFileId: "202468305", maintenanceLifeFileId: "201234168", titrationProtocol: "Standard sema 6-month", description: "Proven, effective, more affordable", badge: "More Affordable", patientCountLabel: "12,500 patients chose this today", status: "live" },
    { id: "prod_tirz_inj", displayName: "Tirzepatide Injectable", internalName: "tirz_injectable", molecule: "Tirzepatide", form: "Injectable", primaryPharmacy: "South End", backupPharmacy: "WellsRx", starterLifeFileId: "202468310", maintenanceLifeFileId: "201234170", titrationProtocol: "Standard tirz 6-month", description: "Highest efficacy in class", badge: "Best Results", patientCountLabel: "8,200 patients chose this today", status: "live" },
    { id: "prod_sema_odt", displayName: "Semaglutide Oral (ODT)", internalName: "sema_odt", molecule: "Semaglutide", form: "Oral ODT", primaryPharmacy: "Valiant", backupPharmacy: "Epiq", titrationProtocol: "Oral titration", description: "Needle-free daily dissolvable", badge: "No Needles", patientCountLabel: "3,100 patients chose this today", status: "live" },
  ];
}
function seedPlans(): Plan[] {
  return [
    { id: "plan_sema_1m", internalName: "Semaglutide Monthly", displayName: "Monthly", productId: "prod_sema_inj", durationLabel: "Monthly", durationDays: 28, firstPriceCents: 24900, ongoingPriceCents: 29900, supplyLabel: "4 Week Supply", bnplText: "0% installments — Klarna", preSelected: false, stripeProductId: "prod_STRIPE_1m", status: "live" },
    { id: "plan_sema_3m", internalName: "Semaglutide 3-Month", displayName: "3-Month Reset", productId: "prod_sema_inj", durationLabel: "3-Month", durationDays: 84, firstPriceCents: 71100, ongoingPriceCents: 71100, badge: "⭐ Most Popular", savingsCallout: "You are saving $186", supplyLabel: "12 Week Supply", bnplText: "0% installments — Klarna", preSelected: true, stripeProductId: "prod_STRIPE_3m", status: "live" },
    { id: "plan_sema_6m", internalName: "Semaglutide 6-Month", displayName: "6-Month Transformation", productId: "prod_sema_inj", durationLabel: "6-Month", durationDays: 168, firstPriceCents: 142200, ongoingPriceCents: 142200, badge: "Best Value", savingsCallout: "You are saving $372", supplyLabel: "24 Week Supply", bnplText: "0% installments — Klarna", preSelected: false, stripeProductId: "prod_STRIPE_6m", status: "live" },
    { id: "plan_tirz_1m", internalName: "Tirzepatide Monthly", displayName: "Monthly", productId: "prod_tirz_inj", durationLabel: "Monthly", durationDays: 28, firstPriceCents: 29900, ongoingPriceCents: 39900, supplyLabel: "4 Week Supply", preSelected: false, status: "live" },
    { id: "plan_tirz_3m", internalName: "Tirzepatide 3-Month", displayName: "3-Month Reset", productId: "prod_tirz_inj", durationLabel: "3-Month", durationDays: 84, firstPriceCents: 101700, ongoingPriceCents: 101700, badge: "⭐ Popular", savingsCallout: "You are saving $195", supplyLabel: "12 Week Supply", preSelected: false, status: "live" },
  ];
}
function seedUpsells(): Upsell[] {
  return [
    { id: "up_priority", internalName: "Priority Physician Review", displayName: "⚡ Priority Physician Review", description: "Standard: within 24 hours. Priority: within 6 hours.", priceCents: 4995, type: "one_time", position: "checkout", displayOrder: 1, scarcityText: "⚠️ Limited slots available today", status: "live" },
    { id: "up_shipping", internalName: "Shipping Insurance", displayName: "Shipping Insurance", description: "Protects against lost or damaged shipments.", priceCents: 394, type: "recurring", position: "checkout", displayOrder: 2, status: "live" },
    { id: "up_nausea", internalName: "Anti-Nausea Pack", displayName: "Anti-Nausea Comfort Kit", description: "Ginger chews, hydration salts, wristbands.", priceCents: 2900, type: "one_time", position: "post_buy", displayOrder: 1, status: "draft" },
  ];
}
function seedDiscounts(): Discount[] {
  return [
    { id: "disc_bliss50", code: "BLISS50", type: "first_order", amountCents: 5000, appliesToPlanId: "plan_sema_1m", usageLimit: null, usesCount: 284, autoApply: true, status: "live" },
    { id: "disc_bliss100", code: "BLISS100", type: "first_order", amountCents: 10000, appliesToPlanId: "plan_tirz_1m", usageLimit: null, usesCount: 128, autoApply: true, status: "live" },
    { id: "disc_refer20", code: "REFER20", type: "fixed", amountCents: 2000, appliesToPlanId: "any", usageLimit: 500, usesCount: 0, autoApply: false, status: "draft" },
    { id: "disc_save30", code: "SAVE30", type: "percent", amountCents: 0, percent: 30, appliesToPlanId: "any", usageLimit: 200, usesCount: 41, autoApply: false, status: "live" },
  ];
}
function seedFunnel(): FunnelConfig {
  const draft: FunnelPage[] = [
    { id: "pg_quiz", name: "Quiz / Intake", blocks: [
      { id: "b_hero_quiz", type: "hero", label: "Quiz Hero", props: { headline: "Lose weight, feel great.", sub: "2-minute medical assessment.", cta: "Start assessment" } },
    ]},
    { id: "pg_loading", name: "Loading Screen", blocks: [
      { id: "b_loading", type: "text", label: "Loading copy", props: { text: "Personalizing your plan..." } },
    ]},
    { id: "pg_sales", name: "Plan Page", blocks: [
      { id: "b_hero_sales", type: "hero", label: "Sales Hero", props: { headline: "You're a match.", sub: "Choose your program.", cta: "Continue" } },
      { id: "b_plan_1", type: "plan-card", label: "Sema Monthly", props: { planId: "plan_sema_1m" } },
      { id: "b_plan_2", type: "plan-card", label: "Sema 3-Month", props: { planId: "plan_sema_3m" } },
      { id: "b_plan_3", type: "plan-card", label: "Sema 6-Month", props: { planId: "plan_sema_6m" } },
      { id: "b_features", type: "features", label: "How it works", props: { items: ["Physician review in 24h", "Free shipping", "Cancel anytime"] } },
      { id: "b_testimonials", type: "testimonials", label: "Real results", props: {} },
      { id: "b_faq", type: "faq", label: "FAQ", props: {} },
      { id: "b_cta_final", type: "cta", label: "Final CTA", props: { text: "Get started" } },
    ]},
    { id: "pg_confirm", name: "Order Confirmation", blocks: [
      { id: "b_confirm", type: "hero", label: "Confirmation", props: { headline: "You're all set.", sub: "A physician will review your case within 24 hours." } },
    ]},
    { id: "pg_portal", name: "Patient Portal", blocks: [
      { id: "b_portal", type: "text", label: "Portal (locked)", props: { text: "Portal tabs configured separately." } },
    ]},
  ];
  return { draft, live: draft, history: [{ ts: Date.now() - 86400000, snapshot: draft, note: "Initial version" }], lastPublishedMs: Date.now() - 86400000 };
}
function seedIntake(): IntakeConfig {
  const s = (id: string, name: string, question: string, type: IntakeScreenType, required: boolean, locked: boolean, options: string[] = [], storeAs = ""): IntakeScreen => ({
    id, name, question, type, required, locked, active: true, storeAs: storeAs || id,
    options: options.map((label, i) => ({ id: `${id}_o${i}`, label })),
    klaviyoEvent: `${id}_submitted`,
  });
  return {
    screens: [
      s("s1", "BMI Entry", "Let's start with your height and weight.", "number", true, true, [], "bmi"),
      s("s2", "Name + Email", "What's your name and email?", "text", true, true, [], "identity"),
      s("s3", "Goal Weight", "What's your goal weight?", "number", true, true, [], "goal_weight"),
      s("s4", "Sex + DOB", "Sex and date of birth?", "single", true, true, ["Female", "Male", "Other"], "sex"),
      s("s4a", "Pregnancy", "Are you pregnant, planning to be, or nursing?", "single", true, true, ["No", "Yes"], "pregnancy"),
      s("s5", "Pain Situation", "[First Name], which of these best describes your situation right now?", "single", false, false, ["🔄 I keep losing and gaining the same weight", "🧠 I eat well sometimes but can't control cravings", "😔 I've tried everything and nothing works", "💊 I know medication could help"], "pain_situation"),
      s("s6", "Pain Severity", "How much does this affect your daily life?", "single", false, false, ["It's the main thing on my mind", "It affects me most days", "It comes and goes"], "pain_severity"),
      s("s7", "Pain Timeline", "How long has this been happening?", "single", false, false, ["Less than a year", "1–3 years", "3–5 years", "5+ years"], "pain_timeline"),
      s("s8", "Failed Solutions", "What have you tried before?", "multi", false, false, ["Diets", "Exercise programs", "Coaching", "Fasting", "Medication"], "failed_solutions"),
      s("info1", "Belief Seeding", "Weight loss isn't willpower. It's biology.", "info", false, false, [], "belief"),
      s("s9", "Primary Desire", "If we could give you one outcome, what matters most?", "single", false, false, ["Confidence in my body", "Energy back", "Health markers", "Fit into clothes"], "desire"),
      s("s10", "Sleep Quality", "How's your sleep?", "single", false, false, ["Great", "OK", "Poor"], "sleep"),
      s("s11", "Motivation", "What's driving you today?", "text", false, false, [], "motivation"),
      s("s12", "Pace Preference", "How fast do you want to lose?", "single", false, false, ["Steady & sustainable", "As fast as safely possible"], "pace"),
      s("s13", "Commitment", "Are you ready to commit for at least 3 months?", "single", false, false, ["Yes", "Not sure"], "commitment"),
      s("s14", "Contraindications", "Any of these conditions apply?", "multi", true, true, ["Personal history of thyroid cancer", "MEN2", "Severe GI disease", "Active pancreatitis"], "contraindications"),
      s("s15", "Health Conditions", "Do you have any of these?", "multi", true, true, ["Diabetes", "Kidney disease", "Gallbladder disease", "None"], "conditions"),
      s("s16", "GLP-1 History", "Have you taken a GLP-1 before?", "single", true, true, ["Never", "Currently on", "Past 6 months", "Past year"], "glp1_history"),
      s("s17", "Medical History", "Anything else your physician should know?", "text", true, true, [], "medical_history"),
      s("s18", "Phone + State", "Phone and state of residence?", "text", true, true, [], "phone_state"),
    ],
  };
}
function seedEmailFlows(): EmailFlow[] {
  const now = Date.now();
  const flow = (id: string, name: string, trigger: string, exitCondition: string, count: number, status: EmailFlowStatus, edited: number): EmailFlow => ({
    id, name, trigger, exitCondition, status,
    lastEditedMs: now - edited * 86400000, klaviyoSynced: status === "live", lastSyncMs: now - 4 * 60000,
    emails: Array.from({ length: count }).map((_, i) => ({
      id: `${id}_e${i + 1}`, subject: `${name} · Email ${i + 1}`,
      previewText: `Preview text for email ${i + 1}`, delayLabel: i === 0 ? "30 min" : `${i * 12}h`,
      fromName: "", fromEmail: "", body: `<h1>${name} · ${i + 1}</h1><p>{{first_name}}, your program awaits.</p>`,
      status,
    })),
  });
  return [
    flow("f_quiz_abandon", "Quiz Abandoned", "quiz_started AND NOT quiz_completed", "quiz_completed", 3, "live", 5),
    flow("f_pre_purchase", "Pre-Purchase Nurture", "quiz_completed AND NOT purchased", "purchased", 4, "live", 7),
    flow("f_post_purchase", "Post-Purchase Pre-Approval", "purchased AND status=pending", "physician_reviewed", 3, "live", 10),
    flow("f_approved", "Physician Approved", "physician_status=approved", "shipped", 4, "live", 10),
    flow("f_denied", "Physician Denied", "physician_status=denied", "refunded", 1, "live", 10),
    flow("f_onboarding", "Active Subscriber Onboarding", "status=active AND days_since=0..14", "days_since>14", 5, "live", 15),
    flow("f_billing", "Billing Reminder", "days_before_billing=3", "billing_run", 1, "live", 15),
    flow("f_check_in", "90-Day Check-In", "days_since_start=90", "check_in_completed", 2, "live", 15),
    flow("f_winback", "Win-Back", "status=cancelled AND days_since_cancel=1..30", "resubscribed", 4, "live", 17),
    flow("f_refill", "Refill / Renewal", "days_before_refill=7", "refill_shipped", 3, "live", 17),
    flow("f_confirm", "Order Confirmation", "purchase_completed", "sent", 1, "live", 25),
    flow("f_magic", "Magic Link (Portal)", "portal_login_requested", "logged_in", 2, "live", 25),
    flow("f_checkout_abandon", "Checkout Abandoned", "checkout_started AND NOT completed", "purchased", 4, "draft", 3),
  ];
}
function seedPages(): PageConfig[] {
  const now = Date.now();
  const p = (id: string, name: string, url: string, edited: number, locked?: string): PageConfig => ({
    id, name, url, status: "live", lastPublishedMs: now - edited * 86400000, lockedNotes: locked,
  });
  return [
    p("pg_sales_page", "Sales Page", "/weight-loss", 5),
    p("pg_intake_page", "Intake Quiz", "/intake/weight-loss", 7),
    p("pg_plan_page", "Plan Page", "/weight-loss/sales", 10),
    p("pg_checkout_page", "Checkout", "/checkout", 10, "Stripe card form locked (PCI compliance)"),
    p("pg_confirmation_page", "Order Confirmation", "/confirmation", 15, "Order summary locked (legal)"),
    p("pg_portal_page", "Patient Portal", "/portal", 15, "Clinical thread locked (HIPAA)"),
    p("pg_waitlist_page", "Waitlist", "/waitlist", 25),
    p("pg_pending_page", "Physician Review Waiting", "/pending-review", 25),
  ];
}
function seedIntegrationsEmpty(): Record<IntegrationKey, IntegrationState> {
  return {
    klaviyo: { connected: false }, metaPixel: { connected: false }, metaAds: { connected: false },
    ga4: { connected: false }, googleAds: { connected: false }, tiktok: { connected: false },
    mercury: { connected: false },
  };
}
function seedIntegrationsConnected(): Record<IntegrationKey, IntegrationState> {
  const now = Date.now();
  return {
    klaviyo: { connected: true, connectedAtMs: now - 30 * 86400000, account: "klv_live_acct_xxx" },
    metaPixel: { connected: true, connectedAtMs: now - 20 * 86400000, account: "1234567890" },
    metaAds: { connected: true, connectedAtMs: now - 20 * 86400000, account: "act_9876543210" },
    ga4: { connected: true, connectedAtMs: now - 15 * 86400000, account: "G-XXXX1234" },
    googleAds: { connected: false }, tiktok: { connected: false },
    mercury: { connected: true, connectedAtMs: now - 10 * 86400000, account: "Mercury ····4291" },
  };
}
function seedPatients(count: number): DemoPatient[] {
  const states = ["CA", "TX", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "MI"];
  const names = ["Sarah Kim", "Alex Rivera", "Jordan Patel", "Taylor Chen", "Morgan Lee", "Casey Wu", "Reese Park", "Jamie Cruz", "Riley Kaur", "Avery Singh"];
  return Array.from({ length: count }).map((_, i) => ({
    id: `pt_${i + 1}`, name: names[i % names.length] + ` ${i + 1}`,
    email: `patient${i + 1}@example.com`, state: states[i % states.length],
    plan: i % 3 === 0 ? "Sema Monthly" : i % 3 === 1 ? "Sema 3-Month" : "Tirz 3-Month",
    mrrCents: i % 3 === 0 ? 29900 : i % 3 === 1 ? 23700 : 33900,
    status: i % 10 === 0 ? "paused" : i % 20 === 0 ? "cancelled" : "active",
    joinedMs: Date.now() - (i + 1) * 86400000,
  }));
}
function seedOrdersFor(patients: DemoPatient[]): DemoOrder[] {
  const stages: DemoOrder["stage"][] = ["paid", "clinical_review", "pharmacy", "shipped", "delivered", "failed"];
  return patients.slice(0, Math.min(patients.length, 80)).map((p, i) => ({
    id: `ord_${1000 + i}`, patientId: p.id, amountCents: p.mrrCents,
    stage: stages[i % stages.length], carrier: ["UPS", "USPS", "FedEx"][i % 3],
    createdMs: Date.now() - i * 3600000, program: p.plan.split(" ")[0],
  }));
}
function seedCases(patients: DemoPatient[]): DemoCase[] {
  return patients.slice(0, Math.min(patients.length, 15)).map((p, i) => ({
    id: `case_${i + 1}`, patientId: p.id, program: p.plan.split(" ")[0],
    submittedMs: Date.now() - i * 1800000, slaHrs: i % 3 === 0 ? -2 : 22 - i,
    flags: i % 4 === 0 ? ["High BMI"] : i % 5 === 0 ? ["Contraindication note"] : [],
    status: "queued",
  }));
}
function seedCheckIns(patients: DemoPatient[]): DemoCheckIn[] {
  return patients.slice(0, Math.min(patients.length, 25)).map((p, i) => ({
    id: `ci_${i + 1}`, patientId: p.id, dueMs: Date.now() - (i - 5) * 86400000,
    weightLbs: 200 - i * 0.7, status: "due",
  }));
}
function seedPayments(patients: DemoPatient[]): DemoPayment[] {
  const statuses: DemoPayment["status"][] = ["succeeded", "succeeded", "succeeded", "succeeded", "failed", "refunded"];
  return patients.slice(0, Math.min(patients.length, 60)).map((p, i) => ({
    id: `py_${2000 + i}`, patientId: p.id, amountCents: p.mrrCents,
    status: statuses[i % statuses.length], createdMs: Date.now() - i * 7200000,
  }));
}
function seedConversations(patients: DemoPatient[]): DemoConversation[] {
  const msgs = ["Quick question about my next dose", "Thank you!", "Received my shipment", "Feeling much better", "When's my next check-in?"];
  return patients.slice(0, Math.min(patients.length, 12)).map((p, i) => ({
    id: `cv_${i + 1}`, patientId: p.id, lastMessage: msgs[i % msgs.length],
    unread: i % 4 === 0 ? 1 : 0, updatedMs: Date.now() - i * 900000,
  }));
}

function makeEmptyData(): BrandData {
  return {
    patients: [], orders: [], cases: [], checkIns: [], payments: [], conversations: [],
    products: seedProducts(), plans: seedPlans(), upsells: seedUpsells(), discounts: seedDiscounts(),
    funnel: seedFunnel(), intake: seedIntake(), emailFlows: seedEmailFlows(), pages: seedPages(),
    audit: [{ id: "a0", ts: Date.now(), actor: "system", action: "brand_created", detail: "Instance provisioned by PharmaBro" }],
  };
}
function makeData(patientCount: number): BrandData {
  const base = makeEmptyData();
  const patients = seedPatients(patientCount);
  return {
    ...base, patients,
    orders: seedOrdersFor(patients), cases: seedCases(patients),
    checkIns: seedCheckIns(patients), payments: seedPayments(patients),
    conversations: seedConversations(patients),
  };
}

function seedBrand(id: string, name: string, slug: string, logoText: string, primary: string, primaryFg: string, accent: string, stage: BrandStage): Brand {
  return {
    id, name, slug, logoText, theme: { primary, primaryFg, accent, font: "Google Sans Flex" },
    stage, supportEmail: `care@${slug}.com`, website: `https://${slug}.com`,
    stripe: {
      connected: stage !== "onboarding", acct: stage !== "onboarding" ? `acct_${id.slice(0, 8)}` : undefined,
      mode: "live", healthcareApproved: stage === "scaling" || stage === "first_sales", legitScriptApproved: stage === "scaling",
    },
    integrations: stage === "scaling" ? seedIntegrationsConnected() : seedIntegrationsEmpty(),
    statesServed: stage === "onboarding" ? [] : ["CA", "TX", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "MI", "VA", "WA", "AZ", "MA"],
    legal: { tos: { type: "template", updatedAtMs: Date.now() - 30 * 86400000 }, privacy: { type: "template", updatedAtMs: Date.now() - 30 * 86400000 }, consent: { type: "template", updatedAtMs: Date.now() - 30 * 86400000 } },
    createdAtMs: Date.now() - (stage === "onboarding" ? 1 : stage === "zero_sales" ? 7 : stage === "first_sales" ? 45 : 180) * 86400000,
  };
}

const BRANDS: Brand[] = [
  seedBrand("brand_peachrx", "PeachRx", "peachrx", "🍑 PeachRx", "#ff6b9d", "#ffffff", "#ffd166", "onboarding"),
  seedBrand("brand_desertmd", "DesertMD", "desertmd", "DesertMD", "#d97706", "#ffffff", "#78350f", "first_sales"),
  seedBrand("brand_northstar", "NorthStarHealth", "northstar", "★ NorthStar", "#0f766e", "#ffffff", "#134e4a", "scaling"),
];

const DATA: Record<BrandId, BrandData> = {
  brand_peachrx: makeEmptyData(),
  brand_desertmd: makeData(30),
  brand_northstar: makeData(420),
};

/* ---------- STORE ---------- */

const LS_KEY = "pharmabro-store-v1";

type PharmabroState = {
  hydrated: boolean;
  activeBrandId: BrandId;
  brands: Brand[];
  data: Record<BrandId, BrandData>;
};

export const usePharmabro = create<PharmabroState>(() => ({
  hydrated: false,
  activeBrandId: "brand_northstar",
  brands: BRANDS,
  data: DATA,
}));

function persist() {
  if (typeof window === "undefined") return;
  try {
    const { activeBrandId, brands, data } = usePharmabro.getState();
    localStorage.setItem(LS_KEY, JSON.stringify({ activeBrandId, brands, data }));
  } catch {}
}

export function hydratePharmabro() {
  if (typeof window === "undefined") return;
  if (usePharmabro.getState().hydrated) return;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.activeBrandId && parsed?.brands && parsed?.data) {
        usePharmabro.setState({
          hydrated: true, activeBrandId: parsed.activeBrandId,
          brands: parsed.brands, data: parsed.data,
        });
        return;
      }
    }
  } catch {}
  usePharmabro.setState({ hydrated: true });
}

/* ---------- SELECTORS ---------- */
export function useActiveBrand(): Brand {
  return usePharmabro((s) => s.brands.find((b) => b.id === s.activeBrandId) ?? s.brands[0]);
}
export function useActiveData(): BrandData {
  return usePharmabro((s) => s.data[s.activeBrandId] ?? makeEmptyData());
}

/* ---------- ACTIONS ---------- */
function updateBrand(id: BrandId, patch: Partial<Brand>) {
  usePharmabro.setState((s) => ({
    brands: s.brands.map((b) => (b.id === id ? { ...b, ...patch } : b)),
  }));
  persist();
}
function updateData(id: BrandId, patch: (d: BrandData) => BrandData) {
  usePharmabro.setState((s) => ({ data: { ...s.data, [id]: patch(s.data[id] ?? makeEmptyData()) } }));
  persist();
}
function logAudit(actor: string, action: string, detail: string) {
  const id = usePharmabro.getState().activeBrandId;
  updateData(id, (d) => ({
    ...d,
    audit: [{ id: `a_${Date.now()}`, ts: Date.now(), actor, action, detail }, ...d.audit].slice(0, 500),
  }));
}

export const pharmabroActions = {
  setActiveBrand: (id: BrandId) => { usePharmabro.setState({ activeBrandId: id }); persist(); },
  logAudit,

  updateBrandGeneral: (patch: Partial<Brand>) => {
    const id = usePharmabro.getState().activeBrandId;
    updateBrand(id, patch); logAudit("owner", "brand_settings_updated", Object.keys(patch).join(", "));
  },
  updateBrandTheme: (theme: Partial<BrandTheme>) => {
    const id = usePharmabro.getState().activeBrandId;
    const brand = usePharmabro.getState().brands.find((b) => b.id === id)!;
    updateBrand(id, { theme: { ...brand.theme, ...theme } });
    logAudit("owner", "theme_updated", Object.keys(theme).join(", "));
  },
  connectStripe: () => {
    const id = usePharmabro.getState().activeBrandId;
    updateBrand(id, { stripe: { connected: true, acct: `acct_${Date.now().toString(36)}`, mode: "live", healthcareApproved: true, legitScriptApproved: true } });
    logAudit("owner", "stripe_connected", "OAuth completed");
  },
  disconnectStripe: () => {
    const id = usePharmabro.getState().activeBrandId;
    updateBrand(id, { stripe: { connected: false, mode: "live", healthcareApproved: false, legitScriptApproved: false } });
    logAudit("owner", "stripe_disconnected", "");
  },
  connectIntegration: (key: IntegrationKey, account?: string) => {
    const id = usePharmabro.getState().activeBrandId;
    const brand = usePharmabro.getState().brands.find((b) => b.id === id)!;
    updateBrand(id, { integrations: { ...brand.integrations, [key]: { connected: true, connectedAtMs: Date.now(), account: account ?? "acct_demo" } } });
    logAudit("owner", "integration_connected", key);
  },
  disconnectIntegration: (key: IntegrationKey) => {
    const id = usePharmabro.getState().activeBrandId;
    const brand = usePharmabro.getState().brands.find((b) => b.id === id)!;
    updateBrand(id, { integrations: { ...brand.integrations, [key]: { connected: false } } });
    logAudit("owner", "integration_disconnected", key);
  },
  toggleState: (state: string) => {
    const id = usePharmabro.getState().activeBrandId;
    const brand = usePharmabro.getState().brands.find((b) => b.id === id)!;
    const has = brand.statesServed.includes(state);
    updateBrand(id, { statesServed: has ? brand.statesServed.filter((s) => s !== state) : [...brand.statesServed, state] });
    logAudit("owner", has ? "state_disabled" : "state_enabled", state);
  },
  setLegalDoc: (key: "tos" | "privacy" | "consent", src: DocSource) => {
    const id = usePharmabro.getState().activeBrandId;
    const brand = usePharmabro.getState().brands.find((b) => b.id === id)!;
    updateBrand(id, { legal: { ...brand.legal, [key]: src } });
    logAudit("owner", "legal_updated", key);
  },

  /* Products */
  saveProduct: (p: Product) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, products: d.products.some((x) => x.id === p.id) ? d.products.map((x) => (x.id === p.id ? p : x)) : [...d.products, p],
    }));
    logAudit("owner", "product_saved", p.displayName);
  },
  archiveProduct: (id: string) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({ ...d, products: d.products.map((p) => p.id === id ? { ...p, status: "archived" as const } : p) }));
    logAudit("owner", "product_archived", id);
  },
  savePlan: (p: Plan) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, plans: d.plans.some((x) => x.id === p.id) ? d.plans.map((x) => (x.id === p.id ? p : x)) : [...d.plans, { ...p, stripeProductId: p.stripeProductId ?? `prod_stripe_${Date.now()}` }],
    }));
    logAudit("owner", "plan_saved", p.internalName);
  },
  saveUpsell: (u: Upsell) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, upsells: d.upsells.some((x) => x.id === u.id) ? d.upsells.map((x) => (x.id === u.id ? u : x)) : [...d.upsells, u],
    }));
    logAudit("owner", "upsell_saved", u.internalName);
  },
  saveDiscount: (dc: Discount) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, discounts: d.discounts.some((x) => x.id === dc.id) ? d.discounts.map((x) => (x.id === dc.id ? dc : x)) : [...d.discounts, dc],
    }));
    logAudit("owner", "discount_saved", dc.code);
  },

  /* Funnel */
  updateFunnelBlock: (pageId: string, blockId: string, props: Record<string, unknown>) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d,
      funnel: {
        ...d.funnel,
        draft: d.funnel.draft.map((pg) =>
          pg.id === pageId ? { ...pg, blocks: pg.blocks.map((b) => (b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b)) } : pg
        ),
      },
    }));
  },
  addFunnelBlock: (pageId: string, type: FunnelBlockType) => {
    const id = `b_${Date.now()}`;
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d,
      funnel: {
        ...d.funnel,
        draft: d.funnel.draft.map((pg) => pg.id === pageId ? { ...pg, blocks: [...pg.blocks, { id, type, label: type, props: {} }] } : pg),
      },
    }));
    logAudit("owner", "funnel_block_added", `${pageId}/${type}`);
  },
  removeFunnelBlock: (pageId: string, blockId: string) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d,
      funnel: {
        ...d.funnel,
        draft: d.funnel.draft.map((pg) => pg.id === pageId ? { ...pg, blocks: pg.blocks.filter((b) => b.id !== blockId) } : pg),
      },
    }));
    logAudit("owner", "funnel_block_removed", blockId);
  },
  publishFunnel: () => {
    const now = Date.now();
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d,
      funnel: {
        ...d.funnel, live: d.funnel.draft, lastPublishedMs: now,
        history: [{ ts: now, snapshot: d.funnel.draft, note: "Published from admin" }, ...d.funnel.history].slice(0, 20),
      },
    }));
    logAudit("owner", "funnel_published", "");
  },
  rollbackFunnel: (ts: number) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => {
      const entry = d.funnel.history.find((h) => h.ts === ts);
      if (!entry) return d;
      return { ...d, funnel: { ...d.funnel, draft: entry.snapshot, live: entry.snapshot } };
    });
    logAudit("owner", "funnel_rolled_back", new Date(ts).toISOString());
  },

  /* Intake */
  updateIntakeScreen: (id: string, patch: Partial<IntakeScreen>) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, intake: { screens: d.intake.screens.map((s) => (s.id === id ? { ...s, ...patch } : s)) },
    }));
  },
  toggleIntakeScreen: (id: string) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d,
      intake: {
        screens: d.intake.screens.map((s) => (s.id === id && !s.required ? { ...s, active: !s.active } : s)),
      },
    }));
    logAudit("owner", "intake_screen_toggled", id);
  },

  /* Emails */
  updateEmailFlow: (flowId: string, patch: Partial<EmailFlow>) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, emailFlows: d.emailFlows.map((f) => (f.id === flowId ? { ...f, ...patch, lastEditedMs: Date.now() } : f)),
    }));
  },
  updateEmailInFlow: (flowId: string, emailId: string, patch: Partial<EmailInFlow>) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d,
      emailFlows: d.emailFlows.map((f) => f.id === flowId ? { ...f, lastEditedMs: Date.now(), emails: f.emails.map((e) => (e.id === emailId ? { ...e, ...patch } : e)) } : f),
    }));
  },
  toggleEmailFlow: (flowId: string) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, emailFlows: d.emailFlows.map((f) => (f.id === flowId ? { ...f, status: f.status === "live" ? "paused" : "live" } : f)),
    }));
    logAudit("owner", "email_flow_toggled", flowId);
  },
  syncFlowToKlaviyo: (flowId: string) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, emailFlows: d.emailFlows.map((f) => (f.id === flowId ? { ...f, klaviyoSynced: true, lastSyncMs: Date.now() } : f)),
    }));
    logAudit("owner", "flow_synced_to_klaviyo", flowId);
  },

  /* Pages */
  publishPage: (pageId: string) => {
    updateData(usePharmabro.getState().activeBrandId, (d) => ({
      ...d, pages: d.pages.map((p) => (p.id === pageId ? { ...p, status: "live" as const, lastPublishedMs: Date.now() } : p)),
    }));
    logAudit("owner", "page_published", pageId);
  },
};
