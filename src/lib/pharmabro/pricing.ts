/**
 * Pricing page content. Copy lifted verbatim from the PharmaBro spec.
 * The route file is a thin wrapper; every string a visitor reads lives here.
 */

export type TierId = "launch" | "growth" | "scale" | "headless";

export type Tier = {
  id: TierId;
  name: string;
  volume: string;
  price: string;
  priceNote?: string;
  setup: string;
  blurb: string;
  cta: { label: string; to: string };
  popular?: boolean;
  /** Heading for the bullet list, e.g. "Launch includes" or "Growth adds". */
  listLabel: string;
  features: string[];
};

export const tiers: Tier[] = [
  {
    id: "launch",
    name: "Launch",
    volume: "0-500 patients",
    price: "$1,000",
    priceNote: "/mo",
    setup: "+ $5K setup",
    blurb:
      "Everything needed to take a first patient: portal, intake, pharmacy routing, LegitScript, and your own Stripe.",
    cta: { label: "Get started", to: "/pharmabro/demo" },
    listLabel: "Launch includes",
    features: [
      "Brand admin dashboard",
      "Stripe OAuth (your account, your money)",
      "Patient portal under your domain",
      "Intake builder (no-code, HIPAA compliant)",
      "Pharmacy fulfillment (30+ pharmacies, intelligent routing)",
      "LegitScript certification (7-14 days, fully managed)",
      "Provider coverage all 50 states",
      "In-house rebill engine (saves 0.5-1%/mo vs Stripe recurring)",
      "Meta CAPI + GA4 + TikTok Pixel, pre-wired",
      "Klaviyo full event sync",
      "Subscription and billing management",
      "Patient data export (CSV, 24 hours)",
      "Shared support + onboarding guide",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    volume: "500-2K patients",
    price: "$2,500",
    priceNote: "/mo",
    setup: "+ $5K setup",
    blurb:
      "For operators running more than one brand and rebilling at volume. Multi-MID routing, cohort analytics, dunning.",
    cta: { label: "Get started", to: "/pharmabro/demo" },
    popular: true,
    listLabel: "Growth adds",
    features: [
      "Multi-MID payment routing (up to 3 processors)",
      "Unlimited brands from one account",
      "Cohort analytics and churn tracking",
      "Advanced rebill forecasting dashboard",
      "Failed payment recovery (dunning automation)",
      "Affiliate and coupon engine",
      "Everflow + Triple Whale integrations",
      "HubSpot integration",
      "Dedicated account manager",
      "Priority support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    volume: "2K-5K+ patients",
    price: "$5,000",
    priceNote: "/mo",
    setup: "+ $10K setup",
    blurb:
      "Named launch and compliance team, custom integrations, migration from another platform, custom SLAs.",
    cta: { label: "Contact sales", to: "/pharmabro/contact" },
    listLabel: "Scale adds",
    features: [
      "Slack support (8am-4pm ET)",
      "Bi-weekly growth strategy calls",
      "Custom API integrations",
      "Custom intake form build team",
      "Patient migration from other platforms",
      "Custom SLAs and uptime guarantees",
      "Multi-MID routing (up to 5)",
      "Quarterly business reviews",
      "Enterprise pharmacy rate negotiation",
    ],
  },
  {
    id: "headless",
    name: "Headless",
    volume: "Custom",
    price: "Custom",
    setup: "Talk to us",
    blurb:
      "Raw pharmacy API access, your own providers, your own front end. Compliance stack as a service.",
    cta: { label: "Book a demo", to: "/pharmabro/demo" },
    listLabel: "Headless adds",
    features: [
      "All Scale features",
      "Raw pharmacy API access",
      "Bring your own pharmacy",
      "Compliance stack as a service",
      "MCP access for AI agents",
      "Sandbox and custom integrations",
      "Full data portability and warehouse sync",
    ],
  },
];

export const setupCards = [
  {
    title: "One-time setup fee",
    body: "$5,000 standard (3-4 weeks) | $7,500 expedited (2 weeks) | $10,000-25,000 enterprise. Covers: pharmacy API registration, LegitScript application and filing, brand portal build, Stripe OAuth, Meta CAPI + pixel installation, compliance documentation.",
  },
  {
    title: "Month to month after that",
    body: "No annual contracts. No revenue share. No percentage of sales. Flat fee based on active patient count. Cancel any time and your data exports in 24 hours.",
  },
  {
    title: "Third-party financing available",
    body: "Implementation fee can be financed through independent partners, subject to their approval and terms. PharmaBro is not a lender. Contact us and we will connect you.",
  },
];

export const addOns = [
  {
    name: "Branded Mobile App",
    price: "$4,999/mo",
    body: "Full iOS + Android app under your brand name. App Store + Play Store published. Patients manage their account, track orders, and message their provider from your app.",
  },
  {
    name: "Dedicated Account Manager",
    price: "Custom",
    body: "Named CSM assigned to your brand. Weekly strategy calls, proactive churn alerts, growth recommendations.",
  },
  {
    name: "PharmaBro AI Business Intelligence",
    price: "$499/mo",
    body: 'AI-powered revenue dashboards. Predictive LTV models. Churn risk scoring per patient cohort. Rebill probability forecasting. Natural-language reports ("How did GLP-1 patients churn last quarter?").',
  },
];

/** Feature table. `values` is ordered [Launch, Growth, Scale, Headless]. */
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
    group: "Clinical infrastructure",
    rows: [
      r("Licensed providers all 50 states", "✓", "✓", "✓", "—"),
      r("Credentialing + malpractice coverage", "✓", "✓", "✓", "—"),
      r("Medical director oversight", "✓", "✓", "✓", "—"),
      r("Async telehealth consults", "✓", "✓", "✓", "Your team"),
      r("Good Faith Exam included", "✓", "✓", "✓", "✓"),
      r("Live video consults", "Add-on", "✓", "✓", "Your team"),
      r("Clinical quality reviews", "—", "✓", "✓", "—"),
      r("Bring your own providers", "—", "—", "✓", "✓"),
    ],
  },
  {
    group: "Pharmacy and fulfillment",
    rows: [
      r("30+ national pharmacies", "✓", "✓", "✓", "✓"),
      r("Intelligent SKU routing", "✓", "✓", "✓", "✓"),
      r("Medication markup visible to brand", "0%", "0%", "0%", "0%"),
      r("E-prescribing built in", "✓", "✓", "✓", "✓"),
      r("Controlled substances where permitted", "✓", "✓", "✓", "✓"),
      r("EPCS (electronically controlled Rx)", "✓", "✓", "✓", "✓"),
      r("Refill authorization and triage", "✓", "✓", "✓", "✓"),
      r("Lab ordering and results", "—", "✓", "✓", "✓"),
      r("Prescription and refill management", "✓", "✓", "✓", "✓"),
      r("Cold-chain and home delivery", "✓", "✓", "✓", "✓"),
      r("Order tracking and shipment notifications", "✓", "✓", "✓", "✓"),
      r("Pharmacy license reflected in every state", "✓", "✓", "✓", "✓"),
      r("Bring your own pharmacy", "—", "—", "—", "✓"),
    ],
  },
  {
    group: "Brand and storefront",
    rows: [
      r("Branded storefront and checkout", "✓", "✓", "✓", "Your own"),
      r("Branded patient portal", "✓", "✓", "✓", "Your own"),
      r("Your own custom domain", "✓", "✓", "✓", "Your own"),
      r("Full white-label (zero PharmaBro branding)", "✓", "✓", "✓", "✓"),
      r("Treatment verticals", "All", "All", "All", "Your choice"),
      r("Custom intake and clinical protocols", "Templates", "Custom", "Custom", "Your own"),
      r("Branded mobile app", "—", "Add-on", "Add-on", "Your own"),
      r("Brands on one account", "1", "Unlimited", "Unlimited", "Unlimited"),
      r("Multi-brand management from one login", "—", "✓", "✓", "✓"),
    ],
  },
  {
    group: "Ownership and portability",
    rows: [
      r("Revenue share", "None", "None", "None", "None"),
      r("Platform transaction fees", "None", "None", "None", "None"),
      r("Patient full record ownership", "✓", "✓", "✓", "✓"),
      r("Full data export any time (24h)", "✓", "✓", "✓", "✓"),
      r("Revenue settles in YOUR Stripe account", "✓", "✓", "✓", "✓"),
      r("Credit card and token export on exit", "✓", "✓", "✓", "✓"),
    ],
  },
  {
    group: "Payments and revenue",
    rows: [
      r("Cash-pay card checkout", "✓", "✓", "✓", "✓"),
      r("In-house rebill engine (saves 0.5-1%)", "✓", "✓", "✓", "✓"),
      r("Tokenized card storage (one-time charges)", "✓", "✓", "✓", "✓"),
      r("13-month billing year", "✓", "✓", "✓", "✓"),
      r("Failed payment recovery dunning", "✓", "✓", "✓", "✓"),
      r("Card account updater", "—", "✓", "✓", "✓"),
      r("Chargeback and dispute support", "✓", "✓", "✓", "✓"),
      r("Multi-MID routing", "—", "Up to 3", "Up to 5", "Custom"),
      r("Affiliate and coupon engine", "—", "✓", "✓", "✓"),
      r("Revenue, retention, LTV dashboards", "Basic", "Full", "Full", "Custom"),
      r("Rebill forecasting", "—", "✓", "✓", "✓"),
      r("Cohort analytics by month", "—", "✓", "✓", "✓"),
      r("PharmaBro AI Business Intelligence", "Add-on", "Add-on", "Add-on", "Custom"),
    ],
  },
  {
    group: "Patient retention and growth",
    rows: [
      r("Automated care workflows", "✓", "✓", "✓", "Your team"),
      r("Branded shipping + check-in notifications", "✓", "✓", "✓", "✓"),
      r("Branded patient messaging", "✓", "✓", "✓", "✓"),
      r("Email sequence builder", "—", "✓", "✓", "✓"),
      r("SMS and in-app notifications", "—", "✓", "✓", "✓"),
      r("Win-back campaigns", "—", "✓", "✓", "✓"),
      r("Patient onboarding flows and checklists", "✓", "✓", "✓", "✓"),
      r("Custom report builder", "—", "—", "✓", "✓"),
    ],
  },
  {
    group: "Integrations and developer platform",
    rows: [
      r("Meta CAPI", "✓", "✓", "✓", "✓"),
      r("GA4", "✓", "✓", "✓", "✓"),
      r("TikTok Pixel", "✓", "✓", "✓", "✓"),
      r("Klaviyo", "✓", "✓", "✓", "✓"),
      r("Everflow", "—", "✓", "✓", "✓"),
      r("Triple Whale", "—", "✓", "✓", "✓"),
      r("HubSpot", "—", "✓", "✓", "✓"),
      r("Webhooks", "—", "✓", "✓", "✓"),
      r("REST API access", "—", "—", "✓", "✓"),
      r("MCP access for AI agents", "—", "—", "✓", "✓"),
      r("Sandbox + test environment", "—", "✓", "✓", "✓"),
      r("Custom API integrations", "—", "—", "—", "✓"),
    ],
  },
  {
    group: "Security and data protection",
    rows: [
      r("HIPAA-compliant infrastructure (AWS)", "✓", "✓", "✓", "✓"),
      r("PHI encrypted in transit and at rest (AES-256, TLS 1.3)", "✓", "✓", "✓", "✓"),
      r("Signed BAA", "✓", "✓", "✓", "✓"),
      r("SOC 2 Type II (in progress)", "—", "✓", "✓", "✓"),
      r("Role-based access control", "✓", "✓", "✓", "✓"),
      r("ISO 27001", "—", "—", "—", "—"),
      r("Audit logging and trace-back", "—", "✓", "✓", "✓"),
      r("Third-party penetration testing", "—", "✓", "✓", "✓"),
      r("Disaster recovery and encrypted backups", "✓", "✓", "✓", "✓"),
      r("Uptime SLA", "99.5%", "99.9%", "99.9%", "Custom"),
    ],
  },
  {
    group: "Compliance and legal structure",
    rows: [
      r("MSO / friendly PC enterprise structure", "✓", "✓", "✓", "—"),
      r("MSO agreements drafted and maintained", "✓", "✓", "✓", "—"),
      r("CPOM compliance", "✓", "✓", "✓", "—"),
      r("LegitScript certification managed", "Managed 7-14d", "Expedited", "Expedited", "—"),
      r("50-state regulatory monitoring", "✓", "✓", "✓", "✓"),
      r("DEA + telehealth disclosures", "✓", "✓", "✓", "✓"),
      r("Federal consent and disclosure forms", "✓", "✓", "✓", "✓"),
      r("Identity verification at intake", "✓", "✓", "✓", "✓"),
    ],
  },
  {
    group: "Implementation and support",
    rows: [
      r("Time to first patient", "7 days", "7 days", "7 days", "Under a week"),
      r("White-glove migration", "✓", "✓", "✓", "✓"),
      r("Onboarding", "Guided", "Dedicated", "White-glove", "Guided"),
      r("Support", "Shared email", "Priority email", "Slack + priority", "Dedicated"),
      r("Dedicated account manager", "Add-on", "✓", "✓", "Add-on"),
      r("Named launch + compliance team", "—", "✓", "✓", "—"),
      r("Quarterly business reviews", "—", "—", "✓", "—"),
      r("PharmaBro launch guarantee", "✓", "✓", "✓", "✓"),
    ],
  },
];

export const pricingFaqs = [
  {
    q: "What does PharmaBro cost?",
    a: "PharmaBro charges a flat monthly fee based on active patient count: Launch ($1,000/mo, 0-500 patients), Growth ($2,500/mo, 500-2K patients), Scale ($5,000/mo, 2K-5K patients). All plans include a one-time implementation fee ($5,000 standard, $7,500 expedited). No revenue share, no percentage of billings, no hidden fees.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No. PharmaBro is month-to-month. Cancel any time. Your full patient dataset, card tokens, and records export in 24 hours.",
  },
  {
    q: "What does the setup fee cover?",
    a: "Pharmacy API registration with 30+ pre-integrated compounding partners, LegitScript application and filing (we manage the entire process), brand patient portal build and custom domain setup, Stripe OAuth connection, Meta CAPI and analytics pixel installation, and compliance documentation (MSO structure, CPOM, federal telehealth disclosures).",
  },
  {
    q: "Does PharmaBro take a revenue share or markup on medications?",
    a: "No revenue share. No percentage of your billings. Medications are priced competitively through our 30+ pharmacy network. You see the price your patients pay; we handle the pharmacy relationships.",
  },
  {
    q: "Who owns the patients and the data?",
    a: "You do. Patient records, card tokens, Rx history, and subscription data are yours. Export everything in 24 hours, any time, no questions asked.",
  },
  {
    q: "How fast can a brand launch?",
    a: "Our guarantee is first patient in 7 days from signing. Most brands complete their intake builder in 2 hours on day one, LegitScript in 7-14 days running in parallel, and have their first patient in week one.",
  },
  {
    q: "What happens if I want to leave?",
    a: "You export your data in 24 hours. Your Stripe account is yours, it always was. Your patient portal domain can be pointed to any new provider. No lock-in, no HIPAA migration nightmare, no revenue penalty for switching.",
  },
];

export const transparencyCallout = {
  title: "Why we publish our pricing.",
  body: "Every competitor on this list, OpenLoop, Bask, WhitelabelMD, Wheel, requires a sales call to learn what anything costs. We believe you should know exactly what you are paying before you talk to anyone. If our pricing does not work for your brand, you should know that before wasting 30 minutes on a call. If it does work, the call moves faster.",
};

/** Flat monthly fee for a given active patient count, used by the calculator. */
export function tierForPatients(patients: number): { name: string; fee: number } {
  if (patients <= 500) return { name: "Launch", fee: 1000 };
  if (patients <= 2000) return { name: "Growth", fee: 2500 };
  return { name: "Scale", fee: 5000 };
}

export const REV_SHARE = 0.35;
