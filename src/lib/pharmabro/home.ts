/**
 * PharmaBro homepage content. Every visitor-facing string lives here so the
 * route file stays composition only. Copy rules: no em dashes, active voice,
 * exact numbers, operator language.
 */

/* ------------------------------------------------------------- the offer */

export const LAUNCH_DAYS = 14;

/* ------------------------------------------------------------------ hero */

export const HERO_BADGE = {
  label: "New",
  text: "Launch without a medical license",
  to: "/pharmabro/blog",
} as const;

export const HERO_ROTATING = [
  "Weight Loss",
  "TRT",
  "HRT",
  "Hair Loss",
  "Sexual Health",
  "Peptides",
] as const;

/** Crawlable, non-rotating version of the H1. */
export const HERO_H1_STATIC =
  "Launch your telehealth brand. PharmaBro runs the clinic.";

export const HERO_SUB =
  "You bring the brand and the customers. PharmaBro operates the licensed providers, the pharmacy, the software, and the compliance, under your name, so your clinic is taking patients and shipping medication in 14 days.";

export const HERO_FOOT =
  "No medical license required. All 50 states. LegitScript included.";

export const BRAND_LOGOS = [
  "Blissley",
  "Northline",
  "Verawell",
  "Kindra Rx",
  "Halden",
  "Meridian Health",
  "Solva",
  "Ardent",
];

/* -------------------------------------------------------- dashboard tabs */

export type ShotTab = {
  id: string;
  label: string;
  caption: string;
  /** Local image path, or null to render the framed placeholder. */
  image: string | null;
  /** Placeholder label shown until a real screenshot lands. */
  slot: string;
};

export const DASHBOARD_TABS: ShotTab[] = [
  {
    id: "operations",
    label: "End-to-end operations",
    caption:
      "One dashboard for patients, prescriptions, pharmacy routing, and revenue.",
    image: "/assets/pharmabro-dashboard.png",
    slot: "Admin dashboard, full pipeline",
  },
  {
    id: "providers",
    label: "Providers in all 50 states",
    caption:
      "Licensed physicians and nurse practitioners assigned by the patient's state, automatically.",
    image: null,
    slot: "Physician queue, state routing",
  },
  {
    id: "pharmacy",
    label: "Pharmacy fulfillment",
    caption:
      "Approved prescriptions transmit to a licensed compounding pharmacy matched to compound and state.",
    image: null,
    slot: "Pharmacy routing and tracking",
  },
  {
    id: "compliant",
    label: "Compliant by default",
    caption:
      "LegitScript, HIPAA, DEA, and state licensing active before your first patient checks out.",
    image: null,
    slot: "Compliance center",
  },
];

/* --------------------------------------------------- a complete clinic */

export const CLINIC_H2 = ["A complete clinic,", "operated end to end."];

export const CLINIC_BODY =
  "You run the brand and the marketing. PharmaBro runs the clinic behind it, from the licensed providers to the pharmacy to the software and the compliance, so you can launch in days and start taking patients without building the infrastructure yourself.";

export const CLINIC_CHECKS = [
  {
    title: "Licensed medical group",
    body: "PharmaBro operates the clinical entity. You operate the brand.",
  },
  {
    title: "Pharmacy network",
    body: "Licensed compounding pharmacies matched by compound and state.",
  },
  {
    title: "Patient portal and admin",
    body: "White labeled to your domain from the first patient interaction.",
  },
  {
    title: "Compliance stack",
    body: "LegitScript, HIPAA, DEA, and state licensing, active on day one.",
  },
  {
    title: "Subscription and billing",
    body: "Payments direct to your Stripe. Rebills automated by ship date.",
  },
];

export const CLINIC_ROWS = [
  {
    label: "Your clinic, live on day one.",
    body: "From the moment you launch, patients sign up, consult PharmaBro licensed providers, and get their medication shipped to their door, all under your brand, while you monitor the entire operation from a single dashboard.",
    image: null as string | null,
    slot: "Intake, physician queue, product",
  },
  {
    label: "Your clinic, live on day one.",
    body: "Patients track shipments and message their provider in a portal that carries your name, while revenue, rebills, and cohorts report back to your admin in real time.",
    image: null as string | null,
    slot: "Mobile intake and revenue dashboard",
  },
];

/* ------------------------------------------------ everything under one roof */

export type RoofCard = {
  title: string;
  body: string;
  visual:
    | "stripe"
    | "token"
    | "states"
    | "export"
    | "brands"
    | "scale";
};

export const ROOF_H2 = "Everything under one roof.";
export const ROOF_SUB =
  "Payments, rebills, pharmacy ops, patient data. Every piece of your telehealth stack, managed from a single dashboard.";

export const ROOF_CARDS: RoofCard[] = [
  {
    title: "Your payment processing. Your revenue.",
    body: "Every dollar your patients pay goes directly to your Stripe account. PharmaBro never touches your revenue, not a hold, not a delay.",
    visual: "stripe",
  },
  {
    title: "In-house rebill engine",
    body: "We tokenize every card and bill as one-time transactions on ship date. Smart retries and the card account updater recover declines without ops work.",
    visual: "token",
  },
  {
    title: "All 50 states from day one",
    body: "PharmaBro operates licensed physicians and nurse practitioners in all 50 states and D.C., so your brand can treat patients anywhere from launch.",
    visual: "states",
  },
  {
    title: "You own everything",
    body: "Patient records, order history, and card tokens export in 24 hours. Your data is always yours, fully portable.",
    visual: "export",
  },
  {
    title: "Unlimited verticals",
    body: "Weight loss, TRT, HRT, hair, sexual health, and peptides. Multiple brands, different domains, all operated from one account.",
    visual: "brands",
  },
  {
    title: "Built for growth",
    body: "The same platform runs your first 100 patients and your first 5,000. Infrastructure that does not make you rebuild when you grow.",
    visual: "scale",
  },
];

/* -------------------------------------------------------- run on, not out of */

export const RUNON_H2 = ["Built to run on,", "not grow out of."];
export const RUNON_BODY =
  "Your ops team will live in this dashboard. We designed every screen, intake to rebill, so they never have to leave it.";

export const RUNON_TABS = [
  "Dashboard",
  "Intake Builder",
  "Custom Domains",
  "Patient Experience",
];

/** Mirrors the KPI row of the Overview dashboard shot so both read as one product. */
export const RUNON_STATS = [
  { label: "Monthly recurring", value: "$268,400" },
  { label: "Net revenue", value: "$71,480" },
  { label: "Active subscriptions", value: "1,284" },
  { label: "Retention rate", value: "66.7%" },
];

/* --------------------------------------------- checkout to recurring revenue */

export type JourneyStep = {
  id: string;
  label: string;
  body: string;
  details: { label: string; body: string }[];
  image: string | null;
  slot: string;
};

export const JOURNEY_H2 = ["From checkout to", "recurring revenue."];
export const JOURNEY_BODY =
  "Follow one order through the platform. The patient checks out on your site, a provider approves, the pharmacy fulfills, and the subscription keeps billing, all under your brand.";

export const JOURNEY: JourneyStep[] = [
  {
    id: "checkout",
    label: "Checkout completes",
    body: "Intake, eligibility, and payment happen in one flow on your site. Plan chosen, card charged, settled to your own Stripe.",
    details: [
      { label: "Intake", body: "Custom questions, eligibility, and consent" },
      { label: "Payment", body: "Stripe, settling to your account" },
      { label: "Card token", body: "Saved for rebills, yours to keep" },
    ],
    image: null,
    slot: "Branded checkout",
  },
  {
    id: "care",
    label: "Care begins",
    body: "Your patient lands in a branded portal while a state-licensed provider reviews the intake async. No scheduling, no phone tag.",
    details: [
      { label: "Provider", body: "Licensed in the patient's state, assigned automatically" },
      { label: "Async consult", body: "Reviewed in minutes to hours" },
      { label: "Brand experience", body: "Patients see your name throughout" },
    ],
    image: null,
    slot: "Patient portal, provider review",
  },
  {
    id: "route",
    label: "Approve and route",
    body: "Approval issues the prescription and transmits it to a licensed compounding pharmacy matched to that compound and state.",
    details: [
      { label: "Pharmacy routing", body: "Matched by compound, state, and formulary" },
      { label: "Tracking", body: "Pushed to the patient portal and SMS" },
      { label: "Clinical chart", body: "Stored, HIPAA compliant, exportable" },
    ],
    image: null,
    slot: "Prescription routing",
  },
  {
    id: "revenue",
    label: "Revenue compounds",
    body: "The next invoice is already scheduled. The rebill engine bills, retries, and recovers failed cards while shipments track themselves, so MRR ticks up without ops work.",
    details: [
      { label: "Rebills", body: "Scheduled invoices with smart retries" },
      { label: "Recovery", body: "Card account updater re-runs declines" },
      { label: "Forecast", body: "MRR, cohorts, and upcoming rebills" },
    ],
    image: null,
    slot: "Revenue dashboard",
  },
];

export const JOURNEY_METRICS = [
  { label: "MRR", value: "$12,480" },
  { label: "Active subscriptions", value: "214" },
  { label: "Rebills collected", value: "96%" },
];

/* --------------------------------------------------- nationwide infrastructure */

export const NATION_H2 = "Nationwide infrastructure.";
export const NATION_EYEBROW = "Pharmacy network";

export const NATION_ROWS = [
  {
    title: "Licensed in every state",
    body: "PharmaBro operates the medical group with clinicians licensed across all 50 states and D.C. Your brand can see and treat patients anywhere from launch day, with no license of your own.",
    to: "/pharmabro/platform",
  },
  {
    title: "Pharmacy and fulfillment",
    body: "PharmaBro runs the pharmacy and fulfillment network, so approved prescriptions are filled and shipped in every state and lab work is ordered and resulted, without you standing up a single partner yourself.",
    to: "/pharmabro/platform/pharmacy",
  },
];

export const STATE_TILES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export const PHARMACY_PARTNERS = [
  "South End Pharmacy",
  "Epiq Scripts",
  "AbsoluteRx",
  "Curexa",
  "QualiTek",
  "FedEx",
  "UPS",
];

/* ------------------------------------------------- keep patients on treatment */

export const RETENTION_H2 = ["Keep patients", "on treatment."];

export const RETENTION_ROWS = [
  {
    title: "Onboarding flows",
    body: "Guide new patients from sign-up to first order with built-in flows, checklists, and reminders, so more of them start treatment and stay with your brand, without ever calling support.",
    checklist: ["Account created", "Intake completed", "First order placed"],
    image: null as string | null,
    slot: "Onboarding checklist",
  },
  {
    title: "Proactive notifications",
    body: "Send automatic refill, shipping, and check-in messages so patients stay on time, and clinicians can respond to any issues before they churn.",
    checklist: ["Refill reminder sent", "Shipment tracked", "Check-in answered"],
    image: null as string | null,
    slot: "Notification timeline",
  },
  {
    title: "Targeted messaging sequences",
    body: "Build branded message journeys in a no-code visual builder, targeting patients by treatment status, churn risk, and spend, to win them back and upsell.",
    checklist: ["Segment built", "Journey live", "Win-back converted"],
    image: null as string | null,
    slot: "Sequence builder",
  },
];

/* ------------------------------------------------------------ analytics band */

export const GROWTH_H2 = ["Watch your brand", "grow in real time."];

export const GROWTH_TABS = [
  {
    title: "Reporting",
    body: "Pull pre-built reports for every revenue and growth question, plus a custom report builder with advanced filters and charts, so you always know how the business is performing right now.",
  },
  {
    title: "Insights",
    body: "See exactly why patients buy, what keeps them on treatment, and what makes them churn, with individual dashboards for each provider and medication.",
  },
  {
    title: "Live analytics",
    body: "Attribution down to one link and one ad creative, updated every hour, so you always know where the momentum is headed.",
  },
];

export const GROWTH_SHOTS = [
  {
    src: "/assets/pharmabro-analytics-reporting.png",
    alt: "PharmaBro analytics overview reporting with revenue, MRR, sessions and program breakdowns",
  },
  {
    src: "/assets/pharmabro-analytics-insights.png",
    alt: "PharmaBro funnel and CRO insights across presell pages, sales page and intake form",
  },
  {
    src: "/assets/pharmabro-analytics-live.png",
    alt: "PharmaBro live view analytics with real-time patient activity and global session map",
  },
];

/* ------------------------------------------------------------- comparison */

export const COMPARE_H2 = "How PharmaBro compares.";
export const COMPARE_SUB =
  "Other platforms take a cut of every sale, hold your revenue, and lock your data, so you do not own anything. PharmaBro charges a flat setup and platform fee. Your patients, your Stripe, your data.";

export const COMPARE_COLUMNS = ["PharmaBro", "Bask", "OpenLoop", "CareValidate"];

export type CompareRow = { feature: string; values: string[] };
export type CompareGroup = { group: string; rows: CompareRow[] };

export const COMPARE_TABLE: CompareGroup[] = [
  {
    group: "Pricing and revenue",
    rows: [
      {
        feature: "Pricing model",
        values: ["Setup + flat monthly", "Monthly only", "Custom + per visit", "Custom quotes"],
      },
      { feature: "Public pricing", values: ["✓", "✗", "✗", "✗"] },
      { feature: "Merchant of record", values: ["You", "Bask", "OpenLoop", "CareValidate"] },
      { feature: "Payment goes to your bank first", values: ["✓", "✗", "✗", "✗"] },
      {
        feature: "Transaction fee",
        values: ["3% to 1.5%", "Not disclosed", "Not disclosed", "Not disclosed"],
      },
    ],
  },
  {
    group: "Ownership and control",
    rows: [
      { feature: "You own your patients", values: ["✓", "✓", "✗", "✗"] },
      { feature: "You own your patient data", values: ["✓", "Partial", "✗", "✗"] },
      { feature: "Credit card token export", values: ["✓", "✗", "✗", "✗"] },
      { feature: "Multi-brand support", values: ["Unlimited", "Limited", "✗", "✗"] },
    ],
  },
  {
    group: "Platform and launch",
    rows: [
      { feature: "Time to launch", values: ["14 days", "30-60 days", "30-90 days", "14-30 days"] },
      {
        feature: "White-label customization",
        values: ["Full", "Template", "Template", "Template"],
      },
      { feature: "LegitScript included", values: ["✓ $0", "✗", "✗", "$205/mo"] },
      { feature: "All 50 states", values: ["✓", "✓", "✓", "✓"] },
      { feature: "Rebill and subscription engine", values: ["✓", "✓", "✗", "✗"] },
    ],
  },
];

export const COMPARE_FOOTNOTE =
  "Data sourced from public pricing pages and published sales proposals. Flag an error and we will correct it.";

/* ------------------------------------------------------------- legitscript */

export const LEGIT_H2 = ["LegitScript certification", "in days, not months."];
export const LEGIT_BODY =
  "Google, Meta, and major payment processors all require LegitScript certification before a telehealth brand can advertise or take payment. PharmaBro prepares, files, and manages your application through approval.";

export const LEGIT_BARS = [
  { label: "Fastest approval", value: "2 days", pct: 8 },
  { label: "With PharmaBro", value: "7-14 days", pct: 22, own: true },
  { label: "Industry standard", value: "3-6 months", pct: 100 },
];

export const LEGIT_PANELS = [
  {
    title: "Certified infrastructure underneath",
    body: "Your brand launches on providers, pharmacies, and technology that already operate under LegitScript certification, so you start from a known platform instead of a blank file.",
  },
  {
    title: "Your application, prepared by PharmaBro",
    body: "PharmaBro assembles the policies, licensing, records, and documentation LegitScript reviews, files the application, and manages the process end to end. You review and sign.",
  },
  {
    title: "Advertising and payments, unlocked",
    body: "Certification is what ad platforms and payment processors check before working with a telehealth brand. The day yours clears, campaigns and payments run with your clinic already taking patients.",
  },
];

export const LEGIT_DISCLAIMER =
  "Notes about timelines are based on LegitScript guidelines, are not direct representations, and certification is not guaranteed.";

/* ------------------------------------------------------------------- blog */

export const BLOG_H2 = ["Field notes from the teams", "building telehealth brands."];
export const BLOG_SUB =
  "On compliance, pharmacy, and growth, written by the people who operate brands with PharmaBro.";

export const BLOG_CARDS = [
  {
    category: "Compliance",
    date: "Aug 2026",
    title: "DEA extends telemedicine flexibilities through 2026",
    body: "What the extension means for GLP-1, TRT, and controlled substance prescribing.",
    slot: "Medication on a clean surface",
  },
  {
    category: "Growth",
    date: "Aug 2026",
    title: "The 5 best white label telehealth platforms in 2026",
    body: "Features, pricing, and data ownership across the major platforms.",
    slot: "Pharmacy lab",
  },
  {
    category: "Pharmacy",
    date: "Jul 2026",
    title: "From prescription to doorstep: inside a compounded GLP-1 order",
    body: "The exact path a semaglutide prescription takes from approval to delivery.",
    slot: "Cold-pack shipping box",
  },
  {
    category: "Compliance",
    date: "Jul 2026",
    title: "LegitScript certification: the real timeline, week by week",
    body: "What actually happens during review and how to prepare for it.",
    slot: "Checklist and documents",
  },
  {
    category: "Growth",
    date: "Jun 2026",
    title: "Pricing a weight-loss subscription patients keep for a year",
    body: "How to structure GLP-1 pricing that converts and still retains at month 12.",
    slot: "Patient receiving a package",
  },
];

/* ---------------------------------------------------------------- pricing */

export const PRICING_H2 = "Flat, transparent pricing.";
export const PRICING_SUB =
  "PharmaBro charges one setup fee and one monthly platform fee. Medication passes through at our negotiated pharmacy rates. PharmaBro never takes a cut of your revenue or your patients.";

export const PRICING_PEEK = {
  title: "Pricing that scales with you",
  body: "PharmaBro charges one setup fee and one monthly platform fee, plus a small transaction fee that decreases as you grow.",
  setup: "$15,000",
  monthly: "$1,500",
  tierNote: "Launch tier, 0 to 500 patients",
  facts: [
    "$30 per consult in month one",
    "3% to 1.5% transaction fee by tier",
    "LegitScript included",
  ],
  ladder:
    "Grow: $25,000 setup and $3,000 per month. Scale: $50,000 setup and $5,000 per month. Enterprise: custom.",
};

/* -------------------------------------------------------------------- faq */

export const FAQ_H2 = ["Common questions", "about PharmaBro."];
export const FAQ_INTRO =
  "PharmaBro is a white label telehealth platform for brand founders, operators, and creators. PharmaBro operates the licensed clinic, and you own the brand, the customers, and the revenue.";

export const FAQ_ITEMS = [
  {
    q: "What is PharmaBro?",
    a: "PharmaBro is a white label telehealth infrastructure platform. PharmaBro operates the licensed medical group, pharmacy network, patient portal, compliance stack, and clinical software under your brand's name, so you can launch a GLP-1, TRT, hair loss, or sexual health brand without building any of that infrastructure yourself.",
  },
  {
    q: "Who is PharmaBro for?",
    a: "Brand founders, operators, and creators who already have an audience and want to launch a telehealth vertical. If you have customers and marketing, PharmaBro gives you the clinic.",
  },
  {
    q: "Does a founder need a medical license?",
    a: "No. PharmaBro operates the licensed medical group. Every consult, prescription, and refill decision is made by state-licensed physicians and nurse practitioners under PharmaBro's medical group. You own and operate the non-clinical brand under an MSO structure.",
  },
  {
    q: "What does PharmaBro cover?",
    a: "Physicians in all 50 states, pharmacy network and fulfillment, white label patient portal, admin dashboard, intake builder, rebill engine, email flows, LegitScript certification, and ongoing compliance.",
  },
  {
    q: "Which treatment categories does PharmaBro support?",
    a: "Weight loss (GLP-1), TRT, HRT, hair loss, sexual health, and peptides and longevity. All six have pre-built clinical pathways ready from day one.",
  },
  {
    q: "Who owns the patients and the data?",
    a: "You do. Patient records, order history, and card tokens are exportable at any time. Payments go directly to your Stripe account. PharmaBro never holds your revenue.",
  },
  {
    q: "How fast can a brand launch?",
    a: "14 days from signed agreement to first patient. Days 1 to 2: setup and onboarding. Days 3 to 7: platform configured and live on your domain. Days 7 to 14: LegitScript certified. Day 14: the first patient can check out.",
  },
  {
    q: "How does PharmaBro handle compliance?",
    a: "LegitScript certification is included in every tier. PharmaBro's medical group operates under HIPAA, DEA, and state licensing requirements. SOC 2 compliance documentation is available on request.",
  },
];

/* -------------------------------------------------------------- final cta */

export const CTA_H2 = ["Your telehealth brand,", "taking patients in 14 days."];
export const CTA_BODY =
  "Physicians, pharmacy, payments, and subscriptions, all handled, so you can focus on marketing and growth.";
export const CTA_FOOT = "Month to month. Your brand, your patients.";

export const CTA_PRODUCTS = [
  "/assets/vial-semaglutide.png",
  "/assets/vial-tirzepatide.png",
  "/assets/ship-box.png",
  "/assets/blissley-tirzepatide-vial-transparent.png",
];

/* ------------------------------------------------------------ footer marks */

export const TRUST_MARKS = [
  "LegitScript certified",
  "HIPAA compliant",
  "SOC 2 documentation on request",
  "Licensed in all 50 states",
  "All systems normal",
];

/* ------------------------------------------- prescription and revenue pair */

export const PAIR_MESSAGE =
  "Thanks for completing your intake, Tom. I'm routing your case to a licensed provider who can review it and prescribe if it's appropriate. This will only take a moment.";

export const PAIR_RX = {
  heading: "PharmaBro handles every prescription",
  body: "Every patient is reviewed and prescribed by licensed providers under your brand, and their medication ships directly to their door. You never touch a chart, a prescription, or a pharmacy.",
  fine: "All prescriptions and treatment are at the sole discretion of the treating telehealth provider, and only when medically appropriate.",
};

export const PAIR_REVENUE = {
  heading: "Revenue in real time",
  body: "Track new patients, recurring revenue, and retention from a single dashboard, so you always know exactly how your brand is performing and where it is growing fastest.",
  link: "Learn more",
  image: "/assets/pharmabro-analytics-insights.png",
};

/* --------------------------------------------- looping phone eligibility flow */

export const PHONE_STEPS: {
  question: string;
  options: string[];
  answer: number;
}[] = [
  {
    question: "What brings you in today?",
    options: ["Weight management", "Skin and hair", "Better sleep"],
    answer: 0,
  },
  {
    question: "Have you taken a GLP-1 before?",
    options: ["No, never", "Yes, currently", "Yes, in the past"],
    answer: 0,
  },
  {
    question: "Where should we ship your treatment?",
    options: ["Texas", "Florida", "California"],
    answer: 1,
  },
];

export const PAIR_ROUTING = "Licensed provider matched, reviewing now";

export const PAIR_PROVIDER = {
  name: "Dr. Sarah Kim, Licensed Provider",
  avatar: "/assets/portal-welcome-doctor.png",
  message:
    "Hi Tom, I've reviewed your intake and medical history. You're a good fit for treatment, so I've approved your prescription. Your medication ships to your door within 2 business days.",
};

export const PAIR_INTAKE = {
  heading: "Your intake, on their phone",
  body: "Patients answer a short branded eligibility check on any device. Every answer routes the case, sets the dose logic, and keeps the chart clean before a provider ever opens it.",
  fine: "Eligibility questions are configurable per condition and per state.",
};
