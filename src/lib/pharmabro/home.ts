/**
 * Homepage content. Every string is lifted verbatim from the PharmaBro
 * website spec. Copy rules enforced: no em dashes, active voice, exact
 * numbers, operator language.
 */

/* --------------------------------------------------------------- section 3 */

export const HERO_ROTATING = [
  "Weight Loss",
  "TRT",
  "Peptide",
  "Hair Loss",
  "Hormone",
] as const;

export const HERO_SUB =
  "You bring the brand and the customers. PharmaBro handles the pharmacy, the payments, the patient portal, the physicians, and the compliance, under your name. Your Stripe. Your data. No revenue share.";

export const HERO_TRUST = [
  "Zero revenue share",
  "LegitScript in 7-14 days",
  "Launch in 7 days",
  "30+ pharmacies",
];

/* --------------------------------------------------------------- section 4 */

export const STATS = [
  { value: 1284, label: "Active Brands", suffix: "" },
  { value: 47320, label: "Patients on Platform", suffix: "" },
  { value: 2841960, label: "Prescriptions Fulfilled", prefix: "$" },
];

export const STAT_STATIC = { value: "7-14 Days", label: "Avg LegitScript Certification" };

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

/* --------------------------------------------------------------- section 5 */

export const POSITIONING_QUOTE =
  "Other platforms take a cut of everything. You run the ads. You acquire the patients. Then you hand over 35%, forever.";

export const POSITIONING_BODY =
  "PharmaBro is different. You own your Stripe. You own your patients. You own your data. We charge a flat fee. You keep the rest.";

export const POSITIONING_H2 = "Infrastructure that works for you, not against you.";

export const POSITIONING_PROOF =
  "On a 300-patient brand, PharmaBro saves operators $20,706 per month vs OpenLoop's revenue share model.";

/* --------------------------------------------------------------- section 6 */

export const COMPARE_COLUMNS = ["PharmaBro", "OpenLoop", "Bask", "Cuvo", "Rimo"];

export type CompareRow = { feature: string; values: string[] };
export type CompareGroup = { group: string; rows: CompareRow[] };

export const COMPARE_TABLE: CompareGroup[] = [
  {
    group: "Pricing & Revenue",
    rows: [
      {
        feature: "Pricing model",
        values: ["Flat fee only", "35% rev share", "% rev (hidden)", "Flat + setup fee", "Flat fee"],
      },
      { feature: "Public pricing", values: ["✓", "✗", "✗", "✓", "✗"] },
      { feature: "Revenue share", values: ["None", "35%+", "Hidden", "None", "None"] },
      { feature: "Payment to YOUR account", values: ["✓", "✗", "✗", "✗", "✓"] },
    ],
  },
  {
    group: "Ownership & Data",
    rows: [
      { feature: "You own your Stripe", values: ["✓", "✗", "✗", "✗", "✓"] },
      { feature: "Patient data export 24h", values: ["✓", "✗", "✗", "✓", "✓"] },
      {
        feature: "Multi-brand, one account",
        values: ["Unlimited", "✗", "Limited", "✗", "Unlimited"],
      },
      { feature: "Credit card / token export", values: ["✓", "✗", "✗", "✗", "✓"] },
    ],
  },
  {
    group: "Platform & Launch",
    rows: [
      {
        feature: "Time to launch",
        values: ["7 days", "30-90 days", "30-40 days", "Days to weeks", "7 days"],
      },
      {
        feature: "LegitScript managed",
        values: ["7-14 days", "Self", "Partner", "7-14 days", "7-14 days"],
      },
      { feature: "In-house rebill engine", values: ["✓ saves 1%", "✗", "✗", "✗", "✓"] },
      { feature: "Multi-MID routing", values: ["Up to 5", "✗", "✗", "✗", "Up to 5"] },
    ],
  },
  {
    group: "Data Breach History",
    rows: [
      {
        feature: "Confirmed incidents",
        values: ["None", "716K patients, Jan 7, 2026", "None", "None", "None"],
      },
    ],
  },
];

export const COMPARE_FOOTNOTE =
  "HHS OCR Breach Portal, January 2026. OpenLoop data breach affected 716,000 patients.";

/* --------------------------------------------------------------- section 7 */

export const STEPS = [
  {
    num: "01",
    title: "You build your brand",
    days: "Day 1-2",
    body: "Choose your treatments, upload your logo, connect your Stripe via OAuth. Our no-code builder creates your intake quiz, your plan page, your checkout, and your patient portal, all on your domain. Takes two hours of your time.",
  },
  {
    num: "02",
    title: "We set up your clinic",
    days: "Day 2-5",
    body: "LegitScript application filed and managed by our enterprise partner team. 30+ pharmacies pre-integrated, SKU-routed to cheapest source per treatment. Physicians connected, MSO structure documented. You never touch any of it.",
  },
  {
    num: "03",
    title: "Patients pay you directly",
    days: "Day 6-7",
    body: "From the moment your first patient clicks, PharmaBro routes their consult, approves the prescription, routes to the best pharmacy, ships to their door, and schedules the next rebill, automatically, under your brand, with revenue hitting your Stripe the same day.",
  },
];

/* --------------------------------------------------------------- section 8 */

export const FEATURES = [
  {
    icon: "card",
    title: "Your Payment Processing. Your Revenue.",
    body: "Every dollar your patients pay goes directly to your Stripe merchant account. We connect via OAuth, so we never touch your money. Up to 5 MIDs supported. Revenue settles same day.",
  },
  {
    icon: "refresh",
    title: "In-House Rebill Engine",
    body: "We built our own billing system, not Stripe's subscription API. We tokenize every card as a one-time transaction, which saves 0.5-1% per rebill. We bill 13 months in a year. On a $100K/month brand, that's $500-1,000 back every single month.",
  },
  {
    icon: "shield",
    title: "LegitScript in 7-14 Days",
    body: "As a LegitScript enterprise partner, we manage the entire application from submission to approval. Run healthcare ads on Meta, Google, and TikTok from the day you launch, not six months later.",
  },
  {
    icon: "pill",
    title: "30+ Pharmacies, Intelligent Routing",
    body: "Every order routes to the fastest and cheapest source for that specific SKU. GLP-1, compounding, ED, HRT, peptides, hair, all covered. You never negotiate a pharmacy relationship or manage a pharmacy API.",
  },
  {
    icon: "portal",
    title: "Patient Portal Under Your Brand",
    body: "Your patients go to portal.yourbrand.com. They manage subscriptions, view Rx history, message their physician, and track shipments, all under your name. PharmaBro is invisible to them.",
  },
  {
    icon: "chart",
    title: "Full Tracking From Day 1",
    body: "Meta CAPI, GA4, TikTok Pixel, Everflow, Triple Whale, Klaviyo, all pre-wired to your brand. Your ROAS is attributable from the first patient, not month three when you figure out integrations.",
  },
] as const;

/* --------------------------------------------------------------- section 9 */

export const DASHBOARD_NAV = [
  "Dashboard",
  "Patients",
  "Orders",
  "Pharmacy Queue",
  "Rebill Engine",
  "Analytics",
  "Brands",
  "Settings",
];

export const DASHBOARD_POINTS = [
  {
    title: "Multi-brand dashboard",
    body: "Run unlimited brands from one admin. Each brand is isolated. See everything from one login.",
  },
  {
    title: "Churn analytics by cohort",
    body: "See exactly which patient group, treatment, or month is churning and why. Fix it before it compounds.",
  },
  {
    title: "Rebill forecasting",
    body: "Know your next 30, 60, and 90 days of revenue before it hits. Failed payment recovery runs automatically.",
  },
  {
    title: "Patient data export",
    body: "Full CSV of every patient, card token, Rx history, and subscription status in 24 hours. Your data. Always.",
  },
];

/* -------------------------------------------------------------- section 10 */

export const MATH_ROWS = [
  {
    label: "Monthly patient billings",
    pharmabro: "$89,700",
    openloop: "$89,700",
    cuvo: "$89,700",
  },
  {
    label: "Platform cost",
    pharmabro: "$2,500/mo flat",
    openloop: "$31,395 (35%)",
    cuvo: "$8,000 + markups",
  },
  {
    label: "You keep",
    pharmabro: "$87,200",
    openloop: "$58,305",
    cuvo: "~$73,000",
    emphasize: true,
  },
  {
    label: "Annual difference vs PharmaBro",
    pharmabro: "—",
    openloop: "PharmaBro saves $346,740/yr",
    cuvo: "PharmaBro saves ~$168,000/yr",
  },
];

export const MATH_FOOTNOTE =
  "At 300 patients, PharmaBro costs you 2.8% of revenue. OpenLoop costs 35%. That's $346,740 per year on the same patient base, the cost of three full-time employees.";

/* -------------------------------------------------------------- section 11 */

export const LEGITSCRIPT_BARS = [
  { label: "PharmaBro", value: "7-14 days", weight: 14, own: true },
  { label: "Cuvo", value: "7-14 days (Cuvo average)", weight: 18, own: false },
  { label: "Industry solo", value: "3-6 months", weight: 100, own: false },
];

export const LEGITSCRIPT_PANELS = [
  {
    title: "Approved in days, not months",
    body: "We manage the entire LegitScript application end to end, from document prep to submission to approval. You sign one form. We handle everything else. Typical approval: 12 days.",
  },
  {
    title: "Every major ad platform, unlocked",
    body: "One LegitScript certification opens Meta Ads, Google Ads, and TikTok Ads. Run healthcare advertising everywhere without restriction from your first week in market.",
  },
];

export const AD_PLATFORMS = ["Meta Ads", "Google Ads", "TikTok Ads"];

/* -------------------------------------------------------------- section 12 */

export const SWITCHING_CARDS = [
  {
    title: "Patients and subscriptions move with you",
    body: "Active patients, treatment plans, and recurring billing schedules are migrated and verified before you go live on PharmaBro. No patient sees any disruption.",
  },
  {
    title: "Your Stripe and your data stay yours",
    body: "Revenue has always gone to your account. Patient records export in full. Every card token, Rx record, and subscription detail comes with you.",
  },
  {
    title: "No downtime for patients",
    body: "Patients keep their portal access, their Rx history, and their physician relationship while the migration happens behind the scenes. Go-live is seamless.",
  },
];

/* -------------------------------------------------------------- section 13 */

export const TESTIMONIALS = [
  {
    quote:
      "We were on OpenLoop handing over 35% of every dollar, after running ads, acquiring patients, and building the brand ourselves. With PharmaBro we launched our own Stripe in week one, went live in nine days, and our effective margin went from 43% to 71%. We wish we'd switched six months earlier.",
    name: "Daniel Reyes",
    title: "CEO & Founder",
    brand: "Northline",
  },
  {
    quote:
      "PharmaBro is what Blissley runs on. The intake builder, the pharmacy routing, the rebill engine, everything works the way you expect it to. We were taking patients in seven days from starting. Zero revenue share, full data ownership. This is what building your own brand actually means.",
    name: "Priya Anand",
    title: "Founder",
    brand: "Blissley",
  },
  {
    quote:
      "LegitScript in 12 days. Pharmacy connected in two hours. First patient in nine days total. We compared Bask, Cuvo, and Rimo before choosing PharmaBro. The in-house rebill engine alone saves us $1,200 a month. And we own every part of the business.",
    name: "Marcus Hale",
    title: "Co-founder & COO",
    brand: "Verawell",
  },
];

/* -------------------------------------------------------------- section 14 */

export const TRUST_MARKS = [
  "HIPAA Compliant",
  "LegitScript Certified",
  "AES-256 + TLS",
  "SOC 2 (in progress)",
];
