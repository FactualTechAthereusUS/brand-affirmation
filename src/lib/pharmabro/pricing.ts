/**
 * Pricing page content. Every string a visitor reads on /pharmabro/pricing
 * lives here; the route file is a thin composition wrapper.
 */

/** Visible "Pricing last reviewed" line and schema dateModified share this. */
export const PRICING_REVIEWED = "August 2026";
export const PRICING_REVIEWED_ISO = "2026-08-01";

export type TierId = "launch" | "grow" | "scale";

export type Tier = {
  id: TierId;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  setup: string;
  volume: string;
  cta: { label: string; to: string };
  popular?: boolean;
  listLabel: string;
  features: string[];
  consultFee: string;
  txnFee: string;
};

export const tiers: Tier[] = [
  {
    id: "launch",
    name: "Launch Program",
    tagline: "Your clinic, run for you.",
    price: "$1,500",
    priceNote: "/ month",
    setup: "$15,000 one-time setup",
    volume: "0-500 patients",
    cta: { label: "Get started", to: "/pharmabro/demo" },
    listLabel: "Included",
    features: [
      "Licensed providers in all 50 states",
      "Pharmacy fulfillment network",
      "White-label patient portal",
      "Intake builder (clinical templates)",
      "Rebill and subscription engine",
      "LegitScript filed and managed, $0",
      "Your own Stripe account",
      "Full data export, any day",
      "HIPAA-compliant infrastructure",
    ],
    consultFee: "Consult fees: $30, month 1 only · $0 refills",
    txnFee: "Transaction fee: 3%",
  },
  {
    id: "grow",
    name: "Grow Program",
    tagline: "Built for recurring revenue.",
    price: "$3,000",
    priceNote: "/ month",
    setup: "$25,000 one-time setup",
    volume: "501-2,000 patients",
    cta: { label: "Get started", to: "/pharmabro/demo" },
    popular: true,
    listLabel: "Everything in Launch, plus",
    features: [
      "Lower transaction fee (2%)",
      "Multiple brands, one account",
      "Multi-brand dashboard",
      "Failed payment recovery",
      "Card account updater",
      "Email and SMS sequence builder",
      "Cohort and churn analytics",
      "Affiliate and coupon engine",
      "Webhooks and API access",
      "Priority support",
    ],
    consultFee: "Consult fees: $28, month 1 only · $0 refills",
    txnFee: "Transaction fee: 2%",
  },
  {
    id: "scale",
    name: "Scale Program",
    tagline: "Multi-brand, enterprise-grade.",
    price: "$5,000",
    priceNote: "/ month",
    setup: "$50,000 one-time setup",
    volume: "2,001-5,000 patients",
    cta: { label: "Get started", to: "/pharmabro/demo" },
    listLabel: "Everything in Grow, plus",
    features: [
      "Lowest transaction fee (1.5%)",
      "Dedicated account manager",
      "Named launch and compliance team",
      "Patient migration from other platforms",
      "Custom intake build team",
      "Custom report builder",
      "Priority pharmacy routing",
      "99.9% uptime SLA",
    ],
    consultFee: "Consult fees: $25, month 1 only · $0 refills",
    txnFee: "Transaction fee: 1.5%",
  },
];

export const enterpriseRow = {
  name: "PharmaBro Prescribe",
  tagline:
    "PharmaBro's licensed providers, pharmacy and prescribing rails, integrated into the stack you already run.",
  price: "Custom pricing",
  points: [
    "5,000+ patients",
    "Custom SLA",
    "Custom API integrations",
  ],
  cta: { label: "Talk to us", to: "/pharmabro/contact" },
};

export const cardsFootnote =
  "Every plan includes licensed providers in all 50 states, pharmacy fulfillment, white-label patient portal, LegitScript certification, HIPAA infrastructure, and full data ownership. Consult fees apply to the initial consultation in month one only, refills carry no consult fee.";

export const migrationBanner = {
  lead: "Switching from another platform?",
  body: "Free white-glove migration, we move your patients, subscriptions and data for you.",
  cta: { label: "Talk to migration", to: "/pharmabro/contact" },
};

export const setupBody = [
  "Every brand we launch is built for the operator who owns it. Providers are credentialed under your brand. Your legal structure is drafted for your ownership. Your patient portal and storefront are built on your domain. Your LegitScript application is filed and managed by us.",
  "That is what the setup fee covers. After that, you pay one flat monthly fee. No annual contract, no penalty to cancel. Your patients, your records, your card tokens and your Stripe account stay with you the day you leave.",
];

export const setupStats = [
  {
    label: "One-time setup",
    value: "$15,000 · Launch",
    sub: "$25,000 · Grow  |  $50,000 · Scale",
    body: "Covers provider credentialing, legal structure, portal build, pharmacy onboarding, LegitScript.",
  },
  {
    label: "Month to month",
    value: "No annual contract",
    sub: "No cancellation penalty",
    body: "Cancel any time, your data and Stripe go with you.",
  },
  {
    label: "Financing",
    value: "Available",
    sub: "Through independent partners",
    body: "PharmaBro is not a lender and does not participate in financing arrangements.",
  },
];


export const addOns = [
  {
    name: "Additional vertical",
    price: "$2,500",
    priceUnit: "one-time",
    body: "Add a new treatment category to an existing brand.",
    to: "/pharmabro/demo",
  },
  {
    name: "Priority launch",
    price: "$5,000",
    priceUnit: "one-time",
    body: "Dedicated launch manager and prioritized setup for brands that need to be live in under 7 days.",
    to: "/pharmabro/demo",
  },
  {
    name: "Custom intake quiz",
    price: "$1,500",
    priceUnit: "one-time",
    body: "Bespoke intake questionnaire built to your clinical protocol, beyond the standard template library.",
    to: "/pharmabro/demo",
  },
];

/** Feature table columns, ordered to match every row's `values` tuple. */
export const planColumns = [
  { name: "Launch", price: "$1,500/mo", note: "month-to-month", to: "/pharmabro/demo", popular: false },
  { name: "Grow", price: "$3,000/mo", note: "month-to-month", to: "/pharmabro/demo", popular: true },
  { name: "Scale", price: "$5,000/mo", note: "month-to-month", to: "/pharmabro/demo", popular: false },
  { name: "Enterprise", price: "Custom", note: "pricing", to: "/pharmabro/contact", popular: false },
];


export type FeatureRow = { label: string; values: [string, string, string, string] };
export type FeatureGroup = { group: string; rows: FeatureRow[] };

const r = (
  label: string,
  a: string,
  b: string,
  c: string,
  d: string,
): FeatureRow => ({ label, values: [a, b, c, d] });

export const featureGroups: FeatureGroup[] = [
  {
    group: "Clinical",
    rows: [
      r("Licensed providers, all 50 states", "✓", "✓", "✓", "✓"),
      r("Provider credentialing", "✓", "✓", "✓", "✓"),
      r("Medical director oversight", "✓", "✓", "✓", "✓"),
      r("Async consults", "✓", "✓", "✓", "✓"),
      r("Consult fee (month 1 only)", "$30", "$28", "$25", "Custom"),
      r("Refill consult fee", "$0", "$0", "$0", "$0"),
    ],
  },
  {
    group: "Pharmacy",
    rows: [
      r("Pharmacy fulfillment", "✓", "✓", "✓", "✓"),
      r("Routing by state and compound", "✓", "✓", "✓", "✓"),
      r("Cold-chain fulfillment (GLP-1)", "✓", "✓", "✓", "✓"),
      r("Order tracking under your brand", "✓", "✓", "✓", "✓"),
      r("E-prescribing", "✓", "✓", "✓", "✓"),
      r("Bring your own pharmacy", "—", "—", "✓", "✓"),
    ],
  },
  {
    group: "Brand and storefront",
    rows: [
      r("White-label patient portal", "✓", "✓", "✓", "✓"),
      r("White-label storefront + checkout", "✓", "✓", "✓", "✓"),
      r("Your own domain", "✓", "✓", "✓", "✓"),
      r("Zero PharmaBro branding", "✓", "✓", "✓", "✓"),
      r("Treatment verticals", "All", "All", "All", "All"),
      r("Brands per account", "1", "Unlimited", "Unlimited", "Unlimited"),
      r("Intake builder", "Templates", "Custom", "Custom", "Custom"),
    ],
  },
  {
    group: "Ownership",
    rows: [
      r("Revenue share", "None", "None", "None", "None"),
      r("Transaction fee", "3%", "2%", "1.5%", "Custom"),
      r("You own patient records", "✓", "✓", "✓", "✓"),
      r("Full data export, any day", "✓", "✓", "✓", "✓"),
      r("Revenue settles to your Stripe", "✓", "✓", "✓", "✓"),
      r("Card tokens transfer if you leave", "✓", "✓", "✓", "✓"),
    ],
  },
  {
    group: "Payments",
    rows: [
      r("Your own Stripe account", "✓", "✓", "✓", "✓"),
      r("Subscription + rebill engine", "✓", "✓", "✓", "✓"),
      r("Failed payment recovery", "—", "✓", "✓", "✓"),
      r("Card account updater", "—", "✓", "✓", "✓"),
      r("Affiliate and coupon engine", "—", "✓", "✓", "✓"),
    ],
  },
  {
    group: "Retention",
    rows: [
      r("Automated care workflows", "✓", "✓", "✓", "✓"),
      r("Email sequence builder", "—", "✓", "✓", "✓"),
      r("SMS and push notifications", "—", "✓", "✓", "✓"),
      r("Cohort and churn analytics", "—", "✓", "✓", "✓"),
      r("Custom report builder", "—", "—", "✓", "✓"),
    ],
  },
  {
    group: "Compliance",
    rows: [
      r("LegitScript filed and managed", "✓", "✓", "✓", "✓"),
      r("LegitScript additional cost", "$0", "$0", "$0", "$0"),
      r("MSO structure drafted", "✓", "✓", "✓", "✓"),
      r("HIPAA infrastructure + BAA", "✓", "✓", "✓", "✓"),
      r("CPOM compliance, all 50 states", "✓", "✓", "✓", "✓"),
    ],
  },
  {
    group: "Support",
    rows: [
      r("Time to first patient", "14 days", "14 days", "14 days", "Custom"),
      r("White-glove migration", "✓", "✓", "✓", "✓"),
      r("Support", "Email", "Priority", "Priority + Slack", "Dedicated"),
      r("Dedicated account manager", "Add-on", "Add-on", "✓", "✓"),
      r("Named compliance team", "—", "—", "✓", "✓"),
    ],
  },
];

export const pricingFaqs = [
  {
    q: "What does PharmaBro cost?",
    a: "PharmaBro charges a one-time setup fee and a flat monthly platform fee based on active patient count. Launch is $15,000 setup + $1,500/month for 0-500 patients. Grow is $25,000 + $3,000/month for 501-2,000 patients. Scale is $50,000 + $5,000/month for 2,001-5,000 patients. Enterprise pricing is custom. There is no revenue share and no percentage of patient billings.",
  },
  {
    q: "What does the setup fee cover?",
    a: "The setup fee covers provider credentialing under your brand, your MSO and legal structure, your branded storefront and patient portal built on your domain, pharmacy onboarding, analytics and pixel installation, and your LegitScript application filed and managed by PharmaBro end to end.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No. PharmaBro is month to month after the one-time setup. Cancel any time. Your patients, your records, your card tokens, and your Stripe account stay with you.",
  },
  {
    q: "Who owns the patients and the data?",
    a: "You do. Patient records, order history, prescription history, and your customer list belong to your brand and export in full any day you ask. PharmaBro holds the data as your business associate under a signed BAA.",
  },
  {
    q: "What is the consult fee?",
    a: "$30 for an initial consultation in month one, per patient, on the Launch tier. The fee decreases by tier, $28 on Grow and $25 on Scale. Refill authorizations carry no consult fee on any tier.",
  },
  {
    q: "Does PharmaBro take a cut of medication?",
    a: "No. Medication passes through at cost. PharmaBro earns its platform fee and the transaction fee on patient billings. That is the full fee structure.",
  },
  {
    q: "How fast can my brand go live?",
    a: "14 days from signing to taking patients. PharmaBro handles setup, build, and LegitScript in parallel. Most brands spend about two hours on day one choosing treatments and setting prices.",
  },
  {
    q: "Can I switch plans as I grow?",
    a: "Yes. You can upgrade from Launch to Grow or Grow to Scale at any time. Setup is not charged again on upgrade. Downgrading is available on request at the next billing cycle.",
  },
];
