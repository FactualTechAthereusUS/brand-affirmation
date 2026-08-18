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
  { label: "Cuvo", value: "7-14 days (Cuvo average)", weight: 14, own: false },
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

/* ------------------------------------------------- product tabs (Rimo grammar) */

export type ProductTab = {
  id: "dashboard" | "intake" | "portal" | "rebill";
  label: string;
  micro: string;
  title: string;
  body: string;
  points: string[];
};

export const PRODUCT_TABS: ProductTab[] = [
  {
    id: "dashboard",
    label: "Admin dashboard",
    micro: "One login, every brand",
    title: "Run the whole clinic from one screen.",
    body: "Revenue, patients, orders, pharmacy queue, and rebill forecast in a single admin. Each brand stays isolated, and you see all of them from one login.",
    points: [
      "Unlimited brands, one account",
      "Churn analytics by cohort",
      "Rebill forecast for the next 90 days",
    ],
  },
  {
    id: "intake",
    label: "Intake builder",
    micro: "No code, no dev tickets",
    title: "Build the intake quiz yourself, in an afternoon.",
    body: "Drag screens, set branching logic, and publish to your domain. Every answer lands in the physician review queue with the clinical flags already applied.",
    points: [
      "Conditional branching per treatment",
      "Screen level drop off tracking",
      "Publishes to your own domain",
    ],
  },
  {
    id: "portal",
    label: "Patient portal",
    micro: "Your name on every screen",
    title: "Patients never see PharmaBro.",
    body: "Your patients go to portal.yourbrand.com. They manage subscriptions, view Rx history, message their physician, and track shipments, all under your name.",
    points: [
      "Your logo, your domain, your emails",
      "Physician messaging built in",
      "Shipment tracking on every order",
    ],
  },
  {
    id: "rebill",
    label: "Rebill engine",
    micro: "Built in house, not Stripe billing",
    title: "Every rebill keeps 0.5 to 1% more.",
    body: "We tokenize every card as a one time transaction instead of using a subscription API, and we bill 13 months in a year. On a $100K per month brand that is $500 to $1,000 back every month.",
    points: [
      "13 billing cycles per year",
      "Automatic failed payment recovery",
      "Up to 5 MIDs with smart routing",
    ],
  },
];

/* --------------------------------------------------------- bento feature grid */

export const BENTO = {
  micro: "The stack underneath",
  h2Lead: "Everything a telehealth brand needs.",
  h2Trail: "None of the revenue share.",
  cards: [
    {
      id: "payments",
      title: "Your Stripe, your revenue",
      body: "Patients pay your merchant account directly. We connect over OAuth, so we never touch your money.",
    },
    {
      id: "pharmacy",
      title: "30+ pharmacies, SKU level routing",
      body: "Each order routes to the fastest and cheapest source for that exact SKU. You never manage a pharmacy API.",
    },
    {
      id: "legitscript",
      title: "LegitScript in 7-14 days",
      body: "We file and manage the application as an enterprise partner. You sign one form.",
    },
    {
      id: "tracking",
      title: "Tracking wired on day one",
      body: "Meta CAPI, GA4, TikTok Pixel, Everflow, Triple Whale, and Klaviyo are pre-wired to your brand.",
    },
    {
      id: "data",
      title: "Full data export in 24 hours",
      body: "Every patient, card token, Rx record, and subscription status in CSV whenever you ask.",
    },
  ],
} as const;

/* ------------------------------------------------------- 4 step order journey */

export const JOURNEY = {
  micro: "One patient, end to end",
  h2Lead: "What happens after a patient clicks buy.",
  h2Trail: "All of it, without you in the loop.",
  steps: [
    {
      num: "01",
      title: "Intake and checkout",
      body: "The patient completes your branded quiz and pays on your domain. Revenue settles to your Stripe the same day.",
      meta: "Under 4 minutes",
    },
    {
      num: "02",
      title: "Physician review",
      body: "A licensed physician in the patient's state reviews the intake, approves, and writes the prescription.",
      meta: "Same day",
    },
    {
      num: "03",
      title: "Pharmacy routing and ship",
      body: "The Rx routes to the cheapest qualified pharmacy for that SKU, ships to the door, and tracking posts to the portal.",
      meta: "2-5 days",
    },
    {
      num: "04",
      title: "Rebill scheduled",
      body: "The next cycle is scheduled automatically, with failed payment recovery running in the background.",
      meta: "Every 30 days",
    },
  ],
} as const;

/* ------------------------------------------------- section 15: pricing peek */

export const PRICING_PEEK = [
  {
    tier: "Starter",
    price: "$1,000",
    per: "per month",
    body: "One brand, one category. Everything included: portal, pharmacy network, physicians, LegitScript filing.",
  },
  {
    tier: "Growth",
    price: "$2,500",
    per: "per month",
    body: "Up to three brands, multi-MID routing, funnel and intake builders, priority pharmacy routing.",
    featured: true,
  },
  {
    tier: "Scale",
    price: "$5,000",
    per: "per month",
    body: "Unlimited brands, dedicated compliance lead, custom integrations, quarterly margin reviews.",
  },
];

export const PRICING_FACTS = [
  "$5,000 one-time setup",
  "$30 per consult in month one",
  "0% markup on medication",
  "No revenue share, ever",
  "Payments settle to your own Stripe",
];

/* --------------------------------------------------------- section 16: FAQ */

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Does PharmaBro take a revenue share?",
    a: "No. PharmaBro charges a flat monthly platform fee between $1,000 and $5,000 plus a $5,000 one time setup. Patient payments settle directly into your own Stripe merchant account, so your revenue never passes through us.",
  },
  {
    q: "How long does it take to launch a telehealth brand?",
    a: "Seven days. Days 1 to 2 you build your brand and connect Stripe, days 2 to 5 we file LegitScript and connect pharmacies and physicians, days 6 to 7 your first patients check out.",
  },
  {
    q: "How fast is LegitScript certification?",
    a: "7 to 14 days, with a typical approval at 12 days. PharmaBro is a LegitScript enterprise partner and manages the entire application, which unlocks Meta, Google, and TikTok healthcare advertising.",
  },
  {
    q: "What does the medication actually cost?",
    a: "You pay pharmacy cost with 0% markup from PharmaBro. Consults are $30 each in month one. Every number is visible in your dashboard before a patient is charged.",
  },
  {
    q: "Do I own my patient data?",
    a: "Yes. You can export a full CSV of every patient, card token, prescription record, and subscription status within 24 hours, at any time.",
  },
  {
    q: "Can I move an existing brand onto PharmaBro?",
    a: "Yes. Migration is free and white glove. We import patients, card tokens, and active subscriptions from OpenLoop, Bask, Cuvo, or any other platform without interrupting a single refill.",
  },
  {
    q: "Which categories can I sell?",
    a: "Weight loss and GLP-1, men's health including TRT and ED, women's hormones, peptide therapy, hair loss, sexual health, and longevity. You can run several categories under one brand or several brands under one account.",
  },
];

/* =========================================================================
   Phase 1 homepage copy. Eleven sections, spec wording, no em dashes.
   Every string here renders as static text so crawlers see it before JS.
   ========================================================================= */

export const HOME_ANNOUNCEMENT = {
  text: "DEA extends telemedicine flexibilities through 2026. What it means for your brand",
  to: "/pharmabro/blog",
};

export const HOME_HERO = {
  eyebrow: "NEW",
  eyebrowText: "Launch without a medical license",
  h1Lead: "Launch your",
  h1Swap: ["GLP-1", "peptide", "hormone", "hair loss", "men's health", "skin"],
  h1Tail: "brand.",
  h1Second: "We run the clinic behind it.",
  dek: "PharmaBro operates the licensed providers, the pharmacy, and the compliance under your name, so your clinic is taking patients inside seven days. You bring the brand and the customers, and every payment settles to your own Stripe.",
  ctaPrimary: "Book a call",
  ctaSecondary: "See how it works",
  trust: "No medical license required · Your Stripe · 0% medication markup",
};

export const HOME_TRUST_STRIP = [
  "LegitScript certified",
  "HIPAA",
  "SOC 2",
  "Providers in all 50 states",
  "0% medication markup",
];

export const HOME_HOW = {
  h2: "How does a white label telehealth platform work?",
  dek: "PharmaBro splits the business in two: your brand owns the customer, and a licensed medical group owns the clinical decisions. You pick treatments and prices, licensed providers review every visit, and the pharmacy ships under your label.",
  steps: [
    {
      n: "01",
      title: "You launch",
      body: "Pick treatments, set prices, add your logo and domain. Two hours of your time.",
    },
    {
      n: "02",
      title: "We operate",
      body: "Licensed providers review visits. The pharmacy compounds and ships. All under your brand.",
    },
    {
      n: "03",
      title: "Patients pay you",
      body: "Every payment lands in your Stripe. Refills bill automatically. Patients never see us.",
    },
  ],
};

export type HomePillar = {
  h2: string;
  anchor: string;
  to: string;
  body: string;
  visual: "map" | "pharmacy" | "phones" | "table";
  points: string[];
};

export const HOME_PILLARS: HomePillar[] = [
  {
    h2: "Providers in all 50 states",
    anchor: "providers in all 50 states",
    to: "/pharmabro/platform",
    body: "PharmaBro maintains a clinician network that reaches every state, so wherever a patient signs up there is already a licensed provider ready to review the visit and prescribe under your brand. Credentialing, licensing and malpractice cover are handled for you.",
    visual: "map",
    points: [
      "Credentialing and licensing handled",
      "Malpractice cover included",
      "Medical director oversight",
      "Asynchronous and video visits",
    ],
  },
  {
    h2: "Pharmacy and fulfilment, at 0% markup",
    anchor: "telehealth pharmacy fulfilment",
    to: "/pharmabro/platform/pharmacy",
    body: "Approved prescriptions are compounded, labelled, cold packed and shipped in every state PharmaBro serves, under your brand, with tracking sent in your name. Medication passes through at cost. No markup, no spread, no revenue share.",
    visual: "pharmacy",
    points: [
      "Medication at cost, 0% markup",
      "Routing by state and product",
      "Cold chain and home delivery",
      "Tracking under your brand",
    ],
  },
  {
    h2: "Your brand, end to end",
    anchor: "branded telehealth clinic",
    to: "/pharmabro/platform/patient-portal",
    body: "From your storefront to intake to the prescription that ships, every step runs under your name. Your domain, your logo, your colours, your emails. PharmaBro never appears in the URL, the browser tab, the email header, or the box.",
    visual: "phones",
    points: [
      "Your own custom domain",
      "Branded storefront and checkout",
      "Branded patient portal",
      "Zero PharmaBro branding anywhere",
    ],
  },
  {
    h2: "You own everything",
    anchor: "telehealth patient data ownership",
    to: "/pharmabro/platform/payments",
    body: "Patient records, order history and your customer list stay yours, exportable any day. Revenue settles to your own Stripe account. No revenue share, no platform transaction fee, no long term contract.",
    visual: "table",
    points: [
      "Full data export, any day",
      "Revenue settles to your Stripe",
      "Card tokens transfer if you leave",
      "Month to month after setup",
    ],
  },
];

export const HOME_SEVEN_DAYS = {
  h2: "From signed to shipping in seven days.",
  dek: "PharmaBro runs a fixed seven day launch. Day one costs you about two hours, and PharmaBro handles every day after that.",
  rows: [
    { day: "Day 1", body: "Brand created, domain live, SSL provisioned" },
    { day: "Day 2", body: "Treatments selected, your pricing set" },
    { day: "Day 3", body: "Stripe connected, products created automatically" },
    { day: "Day 4", body: "Intake built from clinical templates" },
    { day: "Day 5", body: "Providers assigned, pharmacy routing set per state" },
    { day: "Day 6", body: "Compliance review, consents, disclosures" },
    { day: "Day 7", body: "Live. Taking patients." },
  ],
};

export const HOME_LEGITSCRIPT = {
  h2: "LegitScript certified in days, not months.",
  body: "Google, Meta and TikTok all require LegitScript certification before a telehealth brand can advertise. PharmaBro prepares, files and manages your application through to approval.",
  bars: [
    { label: "With PharmaBro", value: "7 to 14 days", pct: 22, own: true },
    { label: "On your own", value: "3 to 6 months", pct: 100, own: false },
  ],
  platforms: ["Meta Ads", "Google Ads", "TikTok Ads"],
  footnote:
    "LegitScript sets its own review schedule. Certification is not guaranteed.",
};

export const HOME_PRICING = {
  h2: "Simple pricing. Published.",
  dek: "PharmaBro charges a flat monthly platform fee by patient tier plus a one time setup fee. Consults are billed flat at $30 in month one only, and refills carry no consult fee.",
  tiers: [
    {
      name: "Launch",
      range: "0 to 500 patients",
      price: "$1,000",
      setup: "$5,000 setup",
      featured: false,
    },
    {
      name: "Growth",
      range: "501 to 2,000 patients",
      price: "$2,500",
      setup: "$5,000 setup",
      featured: true,
    },
    {
      name: "Scale",
      range: "2,001 to 5,000 patients",
      price: "$5,000",
      setup: "$7,500 setup",
      featured: false,
    },
    {
      name: "Enterprise",
      range: "5,000+ patients",
      price: "Custom",
      setup: "Custom setup",
      featured: false,
    },
  ],
  facts: [
    "0% medication markup",
    "No revenue share",
    "Month to month",
  ],
};

export const HOME_COMPARE = {
  h2: "Comparing platforms? We wrote it down.",
  body: "Every competitor fact on these pages comes from public sources and is corrected on request. Both columns are fair, because a comparison you cannot trust is not worth reading.",
  pills: [
    { label: "vs Cuvo", to: "/pharmabro/compare/pharmabro-vs-cuvo" },
    { label: "vs Bask Health", to: "/pharmabro/compare/pharmabro-vs-bask-health" },
    { label: "vs Rimo", to: "/pharmabro/compare/pharmabro-vs-rimo" },
    { label: "vs OpenLoop", to: "/pharmabro/compare/pharmabro-vs-openloop" },
    { label: "vs Wheel", to: "/pharmabro/compare/pharmabro-vs-wheel" },
    { label: "vs CareValidate", to: "/pharmabro/compare/pharmabro-vs-carevalidate" },
  ],
};

/** Ten questions, answers written for extraction. Entity named in every one. */
export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: "What is PharmaBro?",
    a: "PharmaBro is white label telehealth infrastructure for brand operators. PharmaBro operates the licensed provider network, the pharmacy fulfilment, the patient software and the compliance layer under your brand name, so an operator can sell doctor prescribed treatments without building a clinic.",
  },
  {
    q: "Do I need a medical license?",
    a: "No. PharmaBro operates the medical group, and licensed providers make every clinical decision and write every prescription. You own the brand, the marketing and the patient relationship, and run the non clinical business under an MSO structure. No medical license of your own is required.",
  },
  {
    q: "What does it cost?",
    a: "PharmaBro charges a flat monthly platform fee of $1,000 for Launch, $2,500 for Growth, $5,000 for Scale, and custom pricing for Enterprise, plus a one time setup fee of $5,000, or $7,500 on Scale. Consults are billed flat at $30 in month one only.",
  },
  {
    q: "Does PharmaBro mark up medication or take a revenue share?",
    a: "No. Medication passes through at 0% markup on every plan, and PharmaBro never takes a percentage of your billings. PharmaBro earns the platform fee and nothing else, so the price you see for a product is the price you pay for it.",
  },
  {
    q: "Who owns the patients and the data?",
    a: "You do. Patient records, order history, prescription history and your customer list belong to your brand and export in full any day you ask. PharmaBro holds the data as your business associate under a signed BAA.",
  },
  {
    q: "Which treatments can I offer?",
    a: "PharmaBro supports GLP-1 weight loss, men's health including TRT and ED, women's hormone therapy, peptide therapy, hair loss, sexual health and longevity. Availability varies by state, and PharmaBro routes each prescription to a pharmacy licensed for that state and product.",
  },
  {
    q: "How fast can my brand go live?",
    a: "Seven days from signing to taking patients. Most brands spend about two hours on day one choosing treatments and setting prices, and PharmaBro handles everything after that. LegitScript runs in parallel and typically clears in 7 to 14 days.",
  },
  {
    q: "What is LegitScript and do I need it?",
    a: "LegitScript is the certification Google, Meta and TikTok require before a telehealth brand can advertise. PharmaBro prepares, files and manages the application end to end, and most brands clear review in 7 to 14 days rather than the 3 to 6 months a self filed application takes.",
  },
  {
    q: "What happens if I want to leave?",
    a: "PharmaBro is month to month after the one time setup fee. Cancel any time, and your patients, records, prescription history, card tokens and Stripe account stay with you. PharmaBro charges no exit fee and holds nothing back.",
  },
  {
    q: "How does PharmaBro handle compliance?",
    a: "PharmaBro drafts and maintains your MSO structure, keeps you compliant with corporate practice of medicine rules in all 50 states, files and manages LegitScript, runs HIPAA infrastructure under a signed BAA, and monitors telehealth regulation on your behalf.",
  },
];

export const HOME_FINAL_CTA = {
  h2: "Your telehealth brand, taking patients in days.",
  trust: "No medical license required · Live in 7 days · Month to month",
};
