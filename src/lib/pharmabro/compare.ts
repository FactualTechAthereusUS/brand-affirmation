/**
 * Comparison page content. Copy lifted verbatim from the PharmaBro spec.
 * One entry per compare page; the route files are thin wrappers around
 * `ComparePage`, which renders every field below.
 */

export type CompareRow = {
  capability: string;
  /** `true` renders a green check, `false` a red cross, string renders text. */
  us: string | boolean;
  them: string | boolean;
};

export type CompareFaq = { q: string; a: string };

export type CompareMathRow = { label: string; us: string; them: string };

export type CompareEntry = {
  slug: string;
  competitor: string;
  /** Nav / hub label. */
  short: string;
  title: string;
  description: string;
  h1Lead: string;
  h1Trail: string;
  category: string;
  datePublished: string;
  dateModified: string;
  intro: string;
  directAnswer: string;
  takeaways: string[];
  rows: CompareRow[];
  math?: { note: string; rows: CompareMathRow[]; footnote?: string };
  chooseUs?: string;
  chooseThem?: string;
  methodology?: string;
  banner?: { label: string; text: string };
  faqs: CompareFaq[];
  sources?: { label: string; href: string }[];
  ctaLine: string;
  /** Hub teaser. */
  teaser: string;
};

const SITE = "https://sweet-confirm-it.lovable.app";
export const compareUrl = (slug: string) => `${SITE}/pharmabro/compare/${slug}`;

export const COMPARE: CompareEntry[] = [
  {
    slug: "pharmabro-vs-openloop",
    competitor: "OpenLoop",
    short: "OpenLoop",
    title: "PharmaBro vs OpenLoop (2026): Flat Fee vs 35% Revenue Share",
    description:
      "OpenLoop takes 35% of revenue you generated with your own ads and your own brand. PharmaBro charges a flat fee and pays into your Stripe. Full side-by-side comparison.",
    h1Lead: "PharmaBro vs OpenLoop:",
    h1Trail: "the 2026 comparison",
    category: "TELEHEALTH ENABLEMENT PLATFORM",
    datePublished: "2026-01-12",
    dateModified: "2026-08-17",
    intro:
      "OpenLoop is one of the largest telehealth enablement companies in the market, with a wide clinical network and a long client list. The economics are the issue. OpenLoop takes a percentage of revenue on billings you generated with your own ad spend and your own brand equity, and OpenLoop is the merchant of record on those payments.",
    directAnswer:
      "PharmaBro charges a flat monthly fee ($1,000-$5,000/mo) with zero revenue share, and every patient payment lands in the brand's own Stripe account. OpenLoop takes an estimated 35% of billings and processes payments as merchant of record. On a 300-patient brand at $89,700 MRR, that difference is $346,740 per year.",
    takeaways: [
      "PharmaBro: flat fee only. OpenLoop: percentage of billings",
      "PharmaBro: your Stripe via OAuth. OpenLoop: OpenLoop is merchant of record",
      "PharmaBro: patient data export in 24 hours, any time",
      "PharmaBro: unlimited brands from one account",
      "PharmaBro launches in 7 days. OpenLoop: 30-60 days average",
      "OpenLoop disclosed a data breach in January 2026 affecting 716,000 patients",
    ],
    rows: [
      { capability: "Pricing model", us: "Flat fee", them: "% of billings" },
      { capability: "Revenue share", us: "None", them: "Yes (est. 35%)" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "OpenLoop" },
      { capability: "Patient data export", us: "24h, any time", them: "Process required" },
      { capability: "Multi-brand", us: "Unlimited", them: "Limited" },
      { capability: "Time to launch", us: "7 days", them: "30-60 days" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Managed" },
      { capability: "In-house rebill", us: true, them: false },
      { capability: "Rebill savings", us: "0.5-1%/mo", them: "None" },
      { capability: "Public pricing", us: true, them: false },
      { capability: "Pharmacy network", us: "30+ pre-integrated", them: "Partner network" },
      { capability: "Patient portal", us: "White-label", them: "White-label" },
      { capability: "HIPAA", us: true, them: true },
      { capability: "Data breach history", us: "None", them: "716,000 patients (Jan 2026)" },
    ],
    math: {
      note: "At 300 patients and $89,700 monthly billings.",
      rows: [
        { label: "Monthly billings", us: "$89,700", them: "$89,700" },
        { label: "Platform cost", us: "$2,500 flat", them: "$31,395 (35%)" },
        { label: "You keep", us: "$87,200", them: "$58,305" },
        { label: "Annual difference", us: "—", them: "$346,740 more with PharmaBro" },
      ],
    },
    banner: {
      label: "Breach notice",
      text: "OpenLoop reported a data breach in January 2026 affecting approximately 716,000 patients. Brands operating on OpenLoop were required to handle patient notification on records they did not control.",
    },
    chooseUs:
      "You want zero revenue share, payments landing in a Stripe account your brand owns, unlimited multi-brand capacity, and a 7-day launch.",
    chooseThem:
      "You need a very large existing clinical network, you are an enterprise buyer with a procurement process, and revenue share is acceptable at your margin structure.",
    faqs: [
      {
        q: "Is PharmaBro better than OpenLoop?",
        a: "For a DTC brand operator paying for their own traffic, yes on economics. PharmaBro charges a flat monthly fee and takes no percentage of billings, so growth in patient volume does not increase the platform bill. OpenLoop takes a percentage of billings, which means every dollar of ad-driven growth also grows the platform's cut. OpenLoop is the stronger fit only when the clinical network breadth matters more than margin.",
      },
      {
        q: "What is OpenLoop's pricing model?",
        a: "OpenLoop does not publish pricing. Based on operator-reported terms, OpenLoop charges a percentage of patient billings, commonly cited around 35%, with OpenLoop acting as merchant of record on those payments. PharmaBro publishes every tier price on the pricing page and charges nothing on top of it.",
      },
      {
        q: "Who owns the Stripe account and the patient payments?",
        a: "On PharmaBro the brand connects its own Stripe account through OAuth. Patient payments settle directly into that account, and PharmaBro never holds the funds. On OpenLoop, OpenLoop processes payments as merchant of record and remits the brand's share, which means payout timing, chargeback handling, and processor relationships sit with the platform.",
      },
      {
        q: "What is the best OpenLoop alternative in 2026?",
        a: "For flat-fee economics with brand-owned payments, PharmaBro. For a done-for-you clinic operation, Cuvo. For a flat-fee infrastructure platform with an established client list, Rimo. The differentiators to check are revenue share, merchant of record, data export terms, and published launch timelines.",
      },
      {
        q: "How fast can you launch on OpenLoop vs PharmaBro?",
        a: "PharmaBro launches a full branded clinic in 7 days, including intake, patient portal, pharmacy routing, and payments. OpenLoop implementations commonly run 30 to 60 days depending on the clinical configuration and contracting steps.",
      },
    ],
    sources: [
      {
        label: "HHS OCR Breach Portal",
        href: "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf",
      },
      { label: "LegitScript certification requirements", href: "https://www.legitscript.com/certification/" },
    ],
    ctaLine: "The OpenLoop alternative with zero revenue share.",
    teaser: "$346,740 per year on a 300-patient brand.",
  },

  {
    slug: "pharmabro-vs-bask-health",
    competitor: "Bask Health",
    short: "Bask Health",
    title: "PharmaBro vs Bask Health (2026): Full Comparison",
    description:
      "PharmaBro charges a flat fee with zero revenue share. Bask Health charges a percentage of billings and does not give brands Stripe ownership. Full side-by-side comparison.",
    h1Lead: "PharmaBro vs Bask Health:",
    h1Trail: "the 2026 comparison",
    category: "WHITE-LABEL TELEHEALTH PLATFORM",
    datePublished: "2026-01-20",
    dateModified: "2026-08-17",
    intro:
      "Bask Health is a white-label telehealth platform with a strong developer SDK, full LegitScript support, and a meaningful brand client list. The core question is economics: Bask charges a percentage of billings on top of a monthly platform fee. PharmaBro charges a flat fee only. At scale, the gap compounds.",
    directAnswer:
      "PharmaBro charges a flat monthly fee ($1,000-$5,000/mo) with zero revenue share. Bask Health charges a percentage of patient billings on top of a platform fee. At 300 patients, this difference costs Bask brands an estimated $12,000-$18,000 per month more than PharmaBro.",
    takeaways: [
      "PharmaBro: flat fee only. Bask: platform fee + percentage of billings",
      "PharmaBro: your Stripe (OAuth, you receive every payment). Bask: Bask is merchant of record",
      "PharmaBro: patient data export in 24 hours, any time. Bask: export requires process",
      "PharmaBro: unlimited brands from one account. Bask: limited multi-brand",
      "PharmaBro launches in 7 days. Bask: 30-40 days average",
      "Both have LegitScript managed. Both cover 50 states",
    ],
    rows: [
      { capability: "Pricing model", us: "Flat fee", them: "Platform fee + % billings" },
      { capability: "Revenue share", us: "None", them: "Yes (% of billings)" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Bask" },
      { capability: "Patient data export", us: "24h, any time", them: "Process required" },
      { capability: "Multi-brand", us: "Unlimited", them: "Limited" },
      { capability: "Time to launch", us: "7 days", them: "30-40 days" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Managed (partner)" },
      { capability: "In-house rebill", us: true, them: "Stripe recurring" },
      { capability: "Rebill savings", us: "0.5-1%/mo", them: "None" },
      { capability: "Public pricing", us: true, them: false },
      { capability: "Pharmacy network", us: "30+ pre-integrated", them: "30+ pre-integrated" },
      { capability: "Custom intake builder", us: true, them: true },
      { capability: "Developer SDK", us: true, them: "Yes (stronger)" },
      { capability: "Webhook + API access", us: "Growth+", them: "All plans" },
      { capability: "Patient portal", us: "White-label", them: "White-label" },
      { capability: "HIPAA", us: true, them: true },
      { capability: "SOC 2", us: "In progress", them: true },
      { capability: "Data breach history", us: "None", them: "None" },
    ],
    math: {
      note: "At 300 patients and $89,700 monthly billings, using an estimated 20% blended Bask take rate.",
      rows: [
        { label: "Monthly billings", us: "$89,700", them: "$89,700" },
        { label: "Platform cost", us: "$2,500 flat", them: "~$18,000 combined" },
        { label: "You keep", us: "$87,200", them: "~$71,700" },
        { label: "Annual difference", us: "—", them: "~$186,000 more with PharmaBro" },
      ],
    },
    chooseUs:
      "You want full Stripe ownership, no revenue share, unlimited multi-brand, and transparent flat pricing. PharmaBro's in-house rebill engine saves an additional 0.5-1% per billing cycle that Bask's Stripe subscription API cannot match.",
    chooseThem:
      "You want a more mature developer SDK, SOC 2 Type II already certified, and you are comfortable with Bask as merchant of record. Bask is the stronger choice if developer-first extensibility is the primary requirement and economics are secondary.",
    faqs: [
      {
        q: "Is PharmaBro better than Bask Health?",
        a: "On economics and ownership, PharmaBro. Bask charges a platform fee plus a percentage of billings and acts as merchant of record, so the platform bill scales with the revenue your ads produced. PharmaBro charges a flat fee and every payment settles in your own Stripe account. Bask is stronger if you need its developer SDK depth and want SOC 2 Type II certification in place today.",
      },
      {
        q: "What is Bask Health's pricing model?",
        a: "Bask combines a monthly platform fee with a percentage of patient billings. The percentage is not published, and operators report a blended effective take rate in the high teens to low twenties once processing is included. PharmaBro publishes flat tier pricing at $1,000 to $5,000 per month with no percentage on top.",
      },
      {
        q: "Does Bask Health give brands ownership of their Stripe account?",
        a: "No. Bask acts as merchant of record, so patient payments run through Bask and are remitted to the brand. On PharmaBro the brand connects its own Stripe through OAuth, keeps the processor relationship, and receives every payment directly.",
      },
      {
        q: "What is the best Bask Health alternative?",
        a: "PharmaBro is the closest alternative on capability with a materially different cost structure: flat fee, no revenue share, brand-owned Stripe, unlimited brands, and an in-house rebill engine. Rimo and Cuvo are the other flat-fee options worth evaluating.",
      },
      {
        q: "How fast can you launch on Bask Health vs PharmaBro?",
        a: "PharmaBro launches in 7 days. Bask implementations average 30 to 40 days. Both timelines assume LegitScript is running in parallel, which PharmaBro manages in 7 to 14 days.",
      },
    ],
    sources: [
      { label: "LegitScript certification requirements", href: "https://www.legitscript.com/certification/" },
      { label: "Stripe Connect OAuth documentation", href: "https://docs.stripe.com/connect/oauth-reference" },
    ],
    ctaLine: "The Bask Health alternative with zero revenue share.",
    teaser: "Flat fee vs platform fee plus a percentage of billings.",
  },

  {
    slug: "pharmabro-vs-cuvo",
    competitor: "Cuvo",
    short: "Cuvo",
    title: "PharmaBro vs Cuvo (2026): Full Comparison",
    description:
      "PharmaBro vs Cuvo: flat fee vs done-for-you clinic model. Both charge flat fees. Key differences: Stripe ownership, multi-brand support, rebill engine, and compare hub size.",
    h1Lead: "PharmaBro vs Cuvo:",
    h1Trail: "the 2026 comparison",
    category: "DONE-FOR-YOU CLINIC PLATFORM",
    datePublished: "2026-02-03",
    dateModified: "2026-08-17",
    intro:
      "Cuvo and PharmaBro are the most similar platforms in this comparison series: both charge flat fees with no revenue share, both manage LegitScript in 7-14 days, and both have strong pharmacy networks. The differences are structural. Cuvo operates your clinic for you. PharmaBro gives you the infrastructure to operate it yourself with full Stripe ownership and unlimited multi-brand capacity.",
    directAnswer:
      "Both PharmaBro and Cuvo charge flat fees with zero revenue share. PharmaBro gives brands full Stripe ownership (revenue hits your account directly). Cuvo is merchant of record. At the same patient count, PharmaBro's rebill engine saves 0.5-1% per billing cycle, and PharmaBro supports unlimited brands from one account vs Cuvo's brand limits.",
    takeaways: [
      "Both charge flat fees. Neither takes a percentage of billings",
      "PharmaBro: brand owns Stripe. Cuvo: Cuvo is merchant of record",
      "PharmaBro: unlimited brands from one account. Cuvo: limited",
      "Both have LegitScript managed in 7-14 days",
      "PharmaBro: in-house rebill engine (saves 0.5-1%). Cuvo: Stripe recurring",
      "PharmaBro: $1K-$5K/mo. Cuvo: $2K-$8K/mo plus setup fees on some plans",
      "PharmaBro launches in 7 days. Cuvo: comparable",
      "Cuvo: 16-page compare hub. PharmaBro: 14-page compare hub",
    ],
    rows: [
      { capability: "Pricing model", us: "Flat fee", them: "Flat fee" },
      { capability: "Revenue share", us: "None", them: "None" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Cuvo" },
      { capability: "Patient data export", us: "24h, any time", them: "24h, any time" },
      { capability: "Multi-brand", us: "Unlimited", them: "Limited (plan dependent)" },
      { capability: "Time to launch", us: "7 days", them: "7-14 days" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Managed, 7-14d" },
      { capability: "In-house rebill", us: "Yes (saves 0.5-1%)", them: false },
      { capability: "Rebill 13x/year", us: true, them: false },
      { capability: "Pharmacy network", us: "30+", them: "30+" },
      { capability: "Public pricing", us: true, them: true },
      { capability: "Analytics", us: "Full cohort", them: "Standard" },
      { capability: "Rebill forecasting", us: true, them: false },
      { capability: "Multi-MID routing", us: "Up to 5", them: false },
      { capability: "HIPAA", us: true, them: true },
      { capability: "SOC 2", us: "In progress", them: true },
      { capability: "Data breach history", us: "None", them: "None" },
    ],
    math: {
      note: "At 300 patients and $89,700 MRR, where the two models diverge.",
      rows: [
        { label: "Platform cost", us: "$2,500 flat", them: "$5,000-$8,000" },
        { label: "You keep", us: "$87,200", them: "$81,700-$84,700" },
        { label: "Rebill engine delta", us: "$673/mo saved", them: "None" },
      ],
      footnote: "Rebill delta is $89,700 MRR at 0.75% processing savings per cycle.",
    },
    chooseUs:
      "You want Stripe owned by your brand from day one, unlimited multi-brand infrastructure from one account, an in-house rebill engine that bills 13 months per year, and multi-MID routing.",
    chooseThem:
      "You want a more hands-off done-for-you clinic operation, SOC 2 already certified, and you are comfortable with Cuvo as merchant of record.",
    faqs: [
      {
        q: "Is PharmaBro or Cuvo cheaper?",
        a: "PharmaBro tiers run $1,000 to $5,000 per month. Cuvo runs roughly $2,000 to $8,000 per month with setup fees on some plans. At the same patient count PharmaBro also saves 0.5 to 1 percent per billing cycle through its in-house rebill engine, which at $89,700 MRR is about $673 per month.",
      },
      {
        q: "Does Cuvo give brands Stripe ownership?",
        a: "No. Cuvo is merchant of record. PharmaBro connects the brand's own Stripe account through OAuth, so patient payments settle directly into the brand's account and the brand keeps the processor relationship.",
      },
      {
        q: "Can I run multiple brands on one account?",
        a: "On PharmaBro, yes, unlimited brands from a single account at every tier. Cuvo limits brands by plan, so a portfolio operator typically needs multiple contracts.",
      },
      {
        q: "How do the rebill engines differ?",
        a: "Cuvo bills through Stripe recurring subscriptions. PharmaBro runs an in-house rebill engine with retry logic, card updater, multi-MID routing across up to 5 processors, and a 28-day cycle that produces 13 billing events per year instead of 12.",
      },
      {
        q: "Which one launches faster?",
        a: "Both are fast. PharmaBro launches in 7 days, Cuvo in 7 to 14 days. LegitScript is managed in 7 to 14 days on both platforms and runs in parallel with the build.",
      },
    ],
    sources: [{ label: "LegitScript certification requirements", href: "https://www.legitscript.com/certification/" }],
    ctaLine: "Flat fee, plus the Stripe account stays yours.",
    teaser: "Both flat fee. The split is ownership and rebill.",
  },

  {
    slug: "pharmabro-vs-rimo",
    competitor: "Rimo",
    short: "Rimo",
    title: "PharmaBro vs Rimo (2026): Full Comparison",
    description:
      "PharmaBro vs Rimo: both charge flat fees, both offer LegitScript in 7-14 days, both give Stripe ownership. Key differences: multi-brand capacity, rebill engine, pharmacy network size.",
    h1Lead: "PharmaBro vs Rimo:",
    h1Trail: "the 2026 comparison",
    category: "WHITE-LABEL TELEHEALTH INFRASTRUCTURE",
    datePublished: "2026-02-10",
    dateModified: "2026-08-17",
    intro:
      "Rimo and PharmaBro share the most DNA of any two platforms in this comparison series. Both charge flat fees. Both give brands Stripe ownership. Both launch in approximately 7 days and manage LegitScript in 7-14 days. The differences are in capacity: PharmaBro supports unlimited multi-brand from one account where Rimo has limits, and PharmaBro's in-house rebill engine outperforms Rimo's Stripe-based billing.",
    directAnswer:
      "PharmaBro and Rimo are the two most similar flat-fee telehealth infrastructure platforms. Both give brand Stripe ownership, both launch in 7 days, both manage LegitScript in 7-14 days. PharmaBro's advantages: unlimited multi-brand capacity from one account, an in-house rebill engine (saves 0.5-1% per cycle), rebill forecasting, and multi-MID routing up to 5 processors. Rimo's advantage: a more established brand client list with 70+ clients built via word of mouth.",
    takeaways: [
      "Both: flat fee, no revenue share",
      "Both: brand owns Stripe",
      "Both: LegitScript in 7-14 days, managed",
      "Both: launch in 7 days",
      "PharmaBro: unlimited multi-brand. Rimo: limited",
      "PharmaBro: in-house rebill (saves 0.5-1%). Rimo: Stripe recurring",
      "PharmaBro: rebill forecasting dashboard. Rimo: basic analytics",
      "Rimo: 70+ brands, established word-of-mouth reputation",
    ],
    rows: [
      { capability: "Pricing model", us: "Flat fee", them: "Flat fee" },
      { capability: "Revenue share", us: "None", them: "None" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Brand owns Stripe" },
      { capability: "Patient data export", us: "24h", them: "24h" },
      { capability: "Multi-brand", us: "Unlimited", them: "Limited" },
      { capability: "Time to launch", us: "7 days", them: "7 days" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Managed, 7-14d" },
      { capability: "In-house rebill", us: "Yes (saves 0.5-1%)", them: "Stripe recurring" },
      { capability: "Rebill 13x/year", us: true, them: false },
      { capability: "Multi-MID routing", us: "Up to 5", them: "Up to 5" },
      { capability: "Rebill forecasting", us: true, them: false },
      { capability: "Cohort analytics", us: true, them: "Basic" },
      { capability: "Pharmacy network", us: "30+", them: "25+" },
      { capability: "Public pricing", us: true, them: false },
      { capability: "HIPAA", us: true, them: true },
      { capability: "Data breach history", us: "None", them: "None" },
    ],
    math: {
      note: "At $100,000 MRR.",
      rows: [
        { label: "Rebill savings", us: "$500-$1,000/mo", them: "None" },
        { label: "Annual delta", us: "$6,000-$12,000", them: "—" },
        { label: "5 brands", us: "$5,000 covers all 5", them: "Separate accounts" },
      ],
    },
    chooseUs:
      "You run or plan to run more than one brand, you want rebill forecasting and an in-house billing engine, and you want published pricing before the first call.",
    chooseThem:
      "You want the longest operator track record in the flat-fee category and a single brand is all you plan to run.",
    faqs: [
      {
        q: "Is PharmaBro better than Rimo?",
        a: "They are close. Both are flat fee, both give the brand its own Stripe, both launch in about 7 days. PharmaBro pulls ahead on unlimited multi-brand capacity, the in-house rebill engine, rebill forecasting, and cohort analytics. Rimo pulls ahead on client track record with 70+ brands.",
      },
      {
        q: "Does Rimo publish pricing?",
        a: "No. Rimo quotes privately. PharmaBro publishes every tier price and the full feature table on the pricing page.",
      },
      {
        q: "What does the in-house rebill engine actually save?",
        a: "Between 0.5 and 1 percent per billing cycle compared with a standard Stripe recurring subscription, through smarter retries, card updater coverage, and routing across up to 5 merchant IDs. At $100,000 MRR that is $500 to $1,000 per month.",
      },
      {
        q: "How large is each pharmacy network?",
        a: "PharmaBro has 30+ pre-integrated compounding and retail pharmacies with intelligent SKU and state-based routing. Rimo publishes 25+.",
      },
      {
        q: "Which is better for a portfolio operator?",
        a: "PharmaBro. One account runs unlimited brands with separate funnels, intake flows, pharmacies, and Stripe connections. Rimo limits brands per account, so a portfolio usually means multiple contracts and multiple logins.",
      },
    ],
    sources: [{ label: "Stripe Connect OAuth documentation", href: "https://docs.stripe.com/connect/oauth-reference" }],
    ctaLine: "Same flat-fee model. More capacity per account.",
    teaser: "The closest match. Multi-brand and rebill decide it.",
  },

  {
    slug: "pharmabro-vs-carevalidate",
    competitor: "CareValidate",
    short: "CareValidate",
    title: "PharmaBro vs CareValidate (2026): Full Comparison",
    description:
      "PharmaBro is a brand infrastructure platform. CareValidate is a compliance and data platform. Two different jobs. Full comparison of features, pricing, and use case.",
    h1Lead: "PharmaBro vs CareValidate:",
    h1Trail: "the 2026 comparison",
    category: "COMPLIANCE DATA PLATFORM",
    datePublished: "2026-02-18",
    dateModified: "2026-08-17",
    intro:
      "These two platforms are mostly doing different jobs. CareValidate specializes in compliance, credentialing, identity verification, and audit documentation. PharmaBro is operational infrastructure: pharmacy, payments, patient portal, prescriptions. If you need both compliance rails and operational rails, you need both, or you need PharmaBro, which includes compliance as part of the stack.",
    directAnswer:
      "PharmaBro and CareValidate serve different functions. CareValidate specializes in compliance platform features: credentialing, identity verification, audit trails, and regulatory documentation. PharmaBro covers the full operational stack: pharmacy fulfillment, payment processing, patient portal, prescription management, and compliance in one platform. For a brand launching a telehealth clinic, PharmaBro replaces the need for CareValidate.",
    takeaways: [
      "CareValidate: compliance, credentialing, and identity verification platform",
      "PharmaBro: full operational infrastructure including compliance",
      "PharmaBro includes LegitScript, HIPAA, BAA, MSO structure, 50-state compliance",
      "CareValidate pricing: not publicly listed. PharmaBro: $1K-$5K/mo flat",
      "CareValidate does not include pharmacy fulfillment, patient portal, or payment processing",
      "PharmaBro includes all of these in the base plan",
      "605 healthcare breaches in 2025, 44.5M Americans affected, $7.42M average breach cost",
    ],
    rows: [
      { capability: "Primary function", us: "Brand infrastructure", them: "Compliance platform" },
      { capability: "Pharmacy fulfillment", us: true, them: false },
      { capability: "Payment processing", us: "Your Stripe", them: false },
      { capability: "Patient portal", us: true, them: false },
      { capability: "Prescription management", us: true, them: false },
      { capability: "LegitScript", us: "Managed", them: "Verify directly" },
      { capability: "HIPAA compliance", us: true, them: true },
      { capability: "Credentialing", us: "Included", them: "Yes (specialist)" },
      { capability: "Identity verification", us: true, them: "Yes (specialist)" },
      { capability: "Audit documentation", us: true, them: "Yes (specialist)" },
      { capability: "Public pricing", us: true, them: false },
      { capability: "Revenue share", us: "None", them: "N/A" },
      { capability: "Multi-brand", us: "Unlimited", them: "N/A" },
      { capability: "Data breach history", us: "None", them: "None" },
    ],
    chooseUs:
      "You are launching or running a telehealth brand and need pharmacy, payments, portal, prescriptions, and compliance in one system.",
    chooseThem:
      "You already run an operational stack and need a specialist compliance, credentialing, and audit layer bolted onto it.",
    methodology:
      "CareValidate is a compliance tool. If you are running a telehealth brand and you only have CareValidate, you still need pharmacy, payments, portal, and prescription management. PharmaBro replaces all of that, plus handles the compliance layer that CareValidate covers.",
    faqs: [
      {
        q: "Are PharmaBro and CareValidate competitors?",
        a: "Only at the edges. CareValidate sells compliance, credentialing, identity verification, and audit documentation. PharmaBro sells the operational clinic: pharmacy routing, payments in your Stripe, patient portal, prescriptions, plus the compliance layer. A brand choosing PharmaBro generally does not need a separate compliance platform.",
      },
      {
        q: "Does CareValidate handle pharmacy fulfillment or payments?",
        a: "No. Those are outside its scope. PharmaBro includes 30+ pre-integrated pharmacies with intelligent routing and payments through the brand's own Stripe account.",
      },
      {
        q: "What compliance does PharmaBro cover?",
        a: "LegitScript certification managed in 7 to 14 days, HIPAA controls with a signed BAA, MSO structuring guidance, 50-state provider coverage, identity verification, and full audit trails on every clinical and billing event.",
      },
      {
        q: "What does CareValidate cost?",
        a: "CareValidate does not publish pricing. PharmaBro publishes flat tiers from $1,000 to $5,000 per month with no revenue share.",
      },
      {
        q: "Why does breach history matter when choosing a platform?",
        a: "Healthcare recorded 605 breaches in 2025 affecting 44.5 million Americans, at an average cost of $7.42 million per breach. When a platform is merchant of record or custodian of patient records, its breach becomes the brand's notification obligation. PharmaBro has no breach history and gives brands a 24-hour full data export at any time.",
      },
    ],
    sources: [
      { label: "HHS OCR Breach Portal", href: "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf" },
      { label: "IBM Cost of a Data Breach Report", href: "https://www.ibm.com/reports/data-breach" },
    ],
    ctaLine: "Compliance included, plus the clinic that runs on it.",
    teaser: "Different jobs. One of them includes the other.",
  },

  {
    slug: "pharmabro-vs-wheel",
    competitor: "Wheel",
    short: "Wheel",
    title: "PharmaBro vs Wheel (2026): Full Comparison",
    description:
      "PharmaBro is a brand infrastructure platform. Wheel is a clinical staffing and telehealth marketplace. Two fundamentally different models. Full comparison.",
    h1Lead: "PharmaBro vs Wheel:",
    h1Trail: "the 2026 comparison",
    category: "CLINICAL STAFFING MARKETPLACE",
    datePublished: "2026-03-02",
    dateModified: "2026-08-17",
    intro:
      "Wheel and PharmaBro are solving different problems. Wheel is a clinical talent marketplace that provides the licensed providers, the clinical network, and the physician staffing layer. PharmaBro is brand infrastructure that handles pharmacy, payments, patient portal, prescriptions, and compliance, with a pre-built physician network included. Brands that need deep provider customization reach for Wheel. Brands that want the entire operational stack deployed in 7 days reach for PharmaBro.",
    directAnswer:
      "Wheel is a clinical staffing and telehealth infrastructure company. PharmaBro is a brand operational infrastructure platform. The key difference: Wheel lets brands customize their provider network deeply and integrate clinical staffing into existing systems. PharmaBro delivers a complete out-of-box clinic including providers, pharmacy, payments, and portal in one platform. Wheel charges a percentage of billings. PharmaBro charges a flat fee.",
    takeaways: [
      "Wheel: clinical staffing marketplace, telehealth infrastructure, revenue share model",
      "PharmaBro: complete operational platform on a flat fee",
      "Wheel pricing: not publicly listed, revenue share model",
      "PharmaBro: $1K-$5K/mo flat, published",
      "Wheel: deep provider network customization, over 1,000 providers",
      "PharmaBro: provider network included, 50-state, fully managed",
      "Wheel: strong for enterprise healthcare brands needing custom clinical layers",
      "PharmaBro: strong for DTC operators who want to launch fast with full ownership",
    ],
    rows: [
      { capability: "Primary function", us: "Brand infrastructure", them: "Clinical staffing + infra" },
      { capability: "Pricing model", us: "Flat fee", them: "Revenue share (% billings)" },
      { capability: "Revenue share", us: "None", them: "Yes" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Wheel processes" },
      { capability: "Provider network", us: "Included (managed)", them: "1,000+ (customizable)" },
      { capability: "Provider customization", us: "Standard", them: "Deep custom" },
      { capability: "Pharmacy fulfillment", us: "30+ integrated", them: "Partner pharmacies" },
      { capability: "Payment processing", us: "Your Stripe", them: "Wheel" },
      { capability: "Patient portal", us: true, them: true },
      { capability: "Time to launch", us: "7 days", them: "Weeks or more" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Self or partner" },
      { capability: "Public pricing", us: true, them: false },
      { capability: "Multi-brand", us: "Unlimited", them: "Limited" },
      { capability: "Data breach history", us: "None", them: "None" },
    ],
    chooseUs:
      "DTC operator. Want full ownership. Want flat fee. Want a 7-day launch. Do not need a custom clinical network.",
    chooseThem:
      "Enterprise brand. Need deep clinical customization. Have a compliance team. Building on top of Wheel as an infrastructure layer, with volume that justifies the revenue share.",
    faqs: [
      {
        q: "Is Wheel a PharmaBro competitor?",
        a: "Partly. Wheel supplies clinical staffing and infrastructure that other companies build on. PharmaBro supplies a finished branded clinic including providers. They overlap on provider access and portal, and diverge on pricing model, payment ownership, and launch speed.",
      },
      {
        q: "What does Wheel cost?",
        a: "Wheel does not publish pricing and works on a revenue share model tied to billings. PharmaBro publishes flat tiers at $1,000 to $5,000 per month with no percentage of revenue.",
      },
      {
        q: "Who provides the physicians on PharmaBro?",
        a: "PharmaBro includes a managed 50-state provider network with asynchronous review, typically returning clinical decisions within hours. Brands do not contract or credential providers separately.",
      },
      {
        q: "Can I customize the clinical protocols?",
        a: "PharmaBro supports configurable intake logic, formularies, and dosing ladders per brand and per vertical. Wheel goes deeper on bespoke clinical workflows and custom provider panels, which is its core product.",
      },
      {
        q: "Which launches faster?",
        a: "PharmaBro, at 7 days for a full branded clinic. Wheel implementations run weeks or longer because the clinical layer is assembled around the customer's own stack.",
      },
    ],
    ctaLine: "The whole clinic, on a flat fee.",
    teaser: "Staffing marketplace vs a complete branded clinic.",
  },

  {
    slug: "pharmabro-vs-whitelabelmd",
    competitor: "WhitelabelMD",
    short: "WhitelabelMD",
    title: "PharmaBro vs WhitelabelMD (2026): Full Comparison",
    description:
      "PharmaBro vs WhitelabelMD: flat fee platform vs white-label telehealth solution. Full feature comparison, pricing, ownership, and launch timeline.",
    h1Lead: "PharmaBro vs WhitelabelMD:",
    h1Trail: "the 2026 comparison",
    category: "WHITE-LABEL TELEHEALTH SOLUTION",
    datePublished: "2026-03-09",
    dateModified: "2026-08-17",
    intro:
      "WhitelabelMD offers white-label telehealth services with physician networks and basic platform infrastructure. The positioning is similar: both serve brand operators who want their own telehealth clinic without building clinical infrastructure from scratch. The differences are transparency and ownership. PharmaBro's pricing is fully public and flat-fee. WhitelabelMD's pricing is not publicly listed, and its payment flow is less transparent.",
    directAnswer:
      "PharmaBro and WhitelabelMD both serve brand operators who want to launch a white-label telehealth clinic. PharmaBro's pricing is public ($1,000-$5,000/mo flat fee, no revenue share). WhitelabelMD's pricing is not publicly listed. PharmaBro gives brands full Stripe ownership. WhitelabelMD's payment and billing model is not publicly described. PharmaBro launches in 7 days with 30+ pre-integrated pharmacies.",
    takeaways: [
      "PharmaBro: public pricing. WhitelabelMD: no published pricing",
      "PharmaBro: flat fee, zero revenue share. WhitelabelMD: terms not public",
      "PharmaBro: brand owns Stripe. WhitelabelMD: payment model not described publicly",
      "PharmaBro: 30+ pharmacy network, published. WhitelabelMD: pharmacy details not public",
      "PharmaBro: in-house rebill engine. WhitelabelMD: unknown",
      "PharmaBro: LegitScript managed, 7-14 days. WhitelabelMD: not published",
      "PharmaBro: launches in 7 days. WhitelabelMD: timeline not published",
    ],
    rows: [
      { capability: "Public pricing", us: true, them: "Call for quote" },
      { capability: "Revenue share", us: "None", them: "Not disclosed" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Not disclosed" },
      { capability: "Patient data export", us: "24h", them: "Not disclosed" },
      { capability: "Multi-brand", us: "Unlimited", them: "Not disclosed" },
      { capability: "Time to launch", us: "7 days", them: "Not disclosed" },
      { capability: "LegitScript managed", us: "7-14d", them: "Not disclosed" },
      { capability: "In-house rebill", us: true, them: "Not disclosed" },
      { capability: "Pharmacy network", us: "30+ published", them: "Not disclosed" },
      { capability: "HIPAA", us: true, them: true },
      { capability: "Public feature table", us: "Yes (this page)", them: false },
    ],
    methodology:
      "WhitelabelMD does not publish pricing, launch timelines, or pharmacy network details on their public website. Facts marked Not disclosed reflect what is and is not publicly available. PharmaBro publishes all pricing and terms. Verify WhitelabelMD specifics directly.",
    faqs: [
      {
        q: "What does WhitelabelMD charge?",
        a: "WhitelabelMD does not publish pricing and directs prospects to a quote conversation. PharmaBro publishes flat tiers from $1,000 to $5,000 per month, with setup fees and add-ons listed on the same page.",
      },
      {
        q: "Who owns the payments on WhitelabelMD?",
        a: "The payment model is not publicly described. On PharmaBro the brand connects its own Stripe account through OAuth and receives every patient payment directly.",
      },
      {
        q: "How large is the pharmacy network on each platform?",
        a: "PharmaBro publishes 30+ pre-integrated compounding and retail pharmacies with state and SKU based routing. WhitelabelMD does not publish pharmacy network details.",
      },
      {
        q: "Which is the safer choice for an operator comparing quotes?",
        a: "Ask both for the same four numbers in writing: monthly fee, any percentage of billings, who is merchant of record, and the data export window. PharmaBro answers all four publicly before a call.",
      },
      {
        q: "How long does launch take?",
        a: "PharmaBro launches in 7 days with LegitScript managed in 7 to 14 days in parallel. WhitelabelMD does not publish a launch timeline.",
      },
    ],
    ctaLine: "Published pricing, published terms, published timeline.",
    teaser: "Everything they do not publish, we do.",
  },

  {
    slug: "pharmabro-vs-qualiphy",
    competitor: "Qualiphy",
    short: "Qualiphy",
    title: "PharmaBro vs Qualiphy (2026): Full Comparison",
    description:
      "PharmaBro is a telehealth brand infrastructure platform. Qualiphy is a med spa and aesthetic clinic platform. Different primary markets. Full comparison.",
    h1Lead: "PharmaBro vs Qualiphy:",
    h1Trail: "the 2026 comparison",
    category: "MED SPA AND AESTHETIC PLATFORM",
    datePublished: "2026-03-16",
    dateModified: "2026-08-17",
    intro:
      "Qualiphy is built primarily for med spas, aesthetic clinics, and wellness centers: in-person and hybrid models with a strong focus on appointment scheduling, staff management, and aesthetic treatment protocols. PharmaBro is built for DTC telehealth brands operating primarily asynchronously across GLP-1, TRT, HRT, peptides, and hair. The overlap exists at the periphery. For most brands these are not competing tools.",
    directAnswer:
      "Qualiphy and PharmaBro serve different primary markets. Qualiphy focuses on med spas, aesthetic clinics, and in-person wellness: appointment management, aesthetic treatments, staff scheduling. PharmaBro focuses on DTC async telehealth brands with pharmacy fulfillment, subscription billing, and patient portals for fully remote patients. If your business is primarily in-person aesthetics, Qualiphy. If your business is DTC async telehealth, PharmaBro.",
    takeaways: [
      "Qualiphy: med spa, aesthetic clinic, in-person and hybrid model",
      "PharmaBro: DTC async telehealth across GLP-1, TRT, HRT, hair, peptides",
      "Qualiphy: appointment scheduling and staff management, which PharmaBro does not cover",
      "PharmaBro: compounding pharmacy fulfillment, which Qualiphy does not cover",
      "PharmaBro: in-house subscription rebill engine. Qualiphy is appointment-based",
      "PharmaBro: full LegitScript managed. Qualiphy: different compliance path",
      "Both: HIPAA compliant",
    ],
    rows: [
      { capability: "Primary market", us: "DTC async telehealth", them: "Med spa and aesthetics" },
      { capability: "Care model", us: "Asynchronous, remote", them: "In-person and hybrid" },
      { capability: "Appointment scheduling", us: false, them: true },
      { capability: "Staff and room management", us: false, them: true },
      { capability: "Compounding pharmacy fulfillment", us: "30+ integrated", them: false },
      { capability: "Subscription rebill engine", us: true, them: "Appointment based" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Different path" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Not disclosed" },
      { capability: "Public pricing", us: true, them: false },
      { capability: "HIPAA", us: true, them: true },
    ],
    faqs: [
      {
        q: "Can Qualiphy run a DTC GLP-1 brand?",
        a: "It is not the design target. Qualiphy is built around appointments, staff, and in-person aesthetic protocols. A DTC GLP-1 brand needs async intake, compounding pharmacy routing, monthly rebilling, and a remote patient portal, which is what PharmaBro is built for.",
      },
      {
        q: "Does PharmaBro do appointment scheduling?",
        a: "No. PharmaBro runs asynchronous clinical review, with synchronous visits only where state law requires them. If your revenue depends on booked in-person appointments, Qualiphy fits better.",
      },
      {
        q: "Which one handles pharmacy?",
        a: "PharmaBro, with 30+ pre-integrated compounding and retail pharmacies and automatic routing by SKU, state, and pharmacy capacity. Qualiphy does not cover compounding fulfillment.",
      },
      {
        q: "Can a med spa use PharmaBro for its remote line?",
        a: "Yes, and several do. A clinic can keep Qualiphy for in-person operations and run PharmaBro for the DTC async line, since PharmaBro supports unlimited brands from one account.",
      },
      {
        q: "Are both HIPAA compliant?",
        a: "Yes. Both operate under HIPAA. PharmaBro additionally manages LegitScript certification in 7 to 14 days, which is required for telehealth brands advertising prescription products on major ad platforms.",
      },
    ],
    ctaLine: "Built for async DTC, not for the treatment room.",
    teaser: "Different markets. Async DTC vs in-person aesthetics.",
  },

  {
    slug: "pharmabro-vs-fuse-health",
    competitor: "Fuse Health",
    short: "Fuse Health",
    title: "PharmaBro vs Fuse Health (2026): Full Comparison",
    description:
      "PharmaBro vs Fuse Health: telehealth infrastructure comparison. Flat fee vs revenue share, Stripe ownership, pharmacy network, and launch timeline.",
    h1Lead: "PharmaBro vs Fuse Health:",
    h1Trail: "the 2026 comparison",
    category: "TELEHEALTH INFRASTRUCTURE",
    datePublished: "2026-03-23",
    dateModified: "2026-08-17",
    intro:
      "Fuse Health positions as telehealth infrastructure for brand operators. The comparison is limited by disclosure: Fuse does not publish pricing, payment terms, pharmacy network size, or launch timelines. This page states what PharmaBro publishes and marks every Fuse cell that is not publicly available.",
    directAnswer:
      "PharmaBro charges a flat monthly fee starting at $1,000/month with zero revenue share. Fuse Health's pricing is not publicly listed. PharmaBro gives brands full Stripe ownership with OAuth connection. PharmaBro includes 30+ pre-integrated pharmacies, LegitScript certification in 7-14 days, and an in-house rebill engine. Key details on Fuse Health's payment model, pharmacy network, and launch timeline are not publicly disclosed.",
    takeaways: [
      "PharmaBro: public pricing. Fuse Health: not publicly listed",
      "PharmaBro: flat fee, no revenue share. Fuse Health: terms not public",
      "PharmaBro: brand owns Stripe (OAuth). Fuse Health: not publicly described",
      "PharmaBro: 30+ pharmacies with intelligent routing. Fuse Health: pharmacy model not public",
      "PharmaBro: LegitScript in 7-14 days managed. Fuse Health: not disclosed",
      "PharmaBro: in-house rebill engine, 0.5-1% savings. Fuse Health: unknown",
      "PharmaBro: unlimited multi-brand. Fuse Health: not disclosed",
    ],
    rows: [
      { capability: "Public pricing", us: "$1,000-$5,000/mo", them: "Not publicly available" },
      { capability: "Revenue share", us: "None", them: "Not publicly available" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Not publicly available" },
      { capability: "Pharmacy network", us: "30+ pre-integrated", them: "Not publicly available" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Not publicly available" },
      { capability: "In-house rebill", us: true, them: "Not publicly available" },
      { capability: "Multi-brand", us: "Unlimited", them: "Not publicly available" },
      { capability: "Patient data export", us: "24h", them: "Not publicly available" },
      { capability: "HIPAA", us: true, them: true },
    ],
    methodology:
      "Facts on this page come from public sources. Cells marked Not publicly available reflect information Fuse Health does not publish. Verify current Fuse Health terms directly before deciding.",
    faqs: [
      {
        q: "What is Fuse Health's pricing?",
        a: "Not published. PharmaBro lists every tier from $1,000 to $5,000 per month, plus setup fees and add-ons, on its pricing page with no revenue share at any tier.",
      },
      {
        q: "Does Fuse Health give brands their own Stripe?",
        a: "The payment model is not publicly described. PharmaBro connects the brand's Stripe through OAuth, so patient payments settle into the brand's account and the brand keeps the processor relationship.",
      },
      {
        q: "How many pharmacies does each platform integrate?",
        a: "PharmaBro publishes 30+ pre-integrated pharmacies with routing by SKU, state licensure, and capacity. Fuse Health does not publish network size.",
      },
      {
        q: "What should I ask Fuse Health on a call?",
        a: "Monthly fee, any percentage of billings, merchant of record, pharmacy count and routing logic, LegitScript timeline, data export window, and multi-brand limits. Those seven answers make the comparison objective.",
      },
      {
        q: "Which launches faster?",
        a: "PharmaBro publishes a 7-day launch. Fuse Health does not publish a timeline.",
      },
    ],
    ctaLine: "Every number on this page is published.",
    teaser: "Transparent terms against undisclosed ones.",
  },

  {
    slug: "pharmabro-vs-wizlo",
    competitor: "Wizlo",
    short: "Wizlo",
    title: "PharmaBro vs Wizlo (2026): Full Comparison",
    description:
      "PharmaBro vs Wizlo: telehealth platform comparison. Full flat fee vs revenue share analysis, Stripe ownership, pharmacy, LegitScript, and launch speed.",
    h1Lead: "PharmaBro vs Wizlo:",
    h1Trail: "the 2026 comparison",
    category: "TELEHEALTH OPERATIONS PLATFORM",
    datePublished: "2026-03-30",
    dateModified: "2026-08-17",
    intro:
      "Wizlo is a newer telehealth operations platform with limited public documentation. That makes the comparison mostly a transparency comparison: PharmaBro publishes pricing, payment ownership, pharmacy network size, LegitScript timeline, and data export terms. Wizlo publishes very little of that today.",
    directAnswer:
      "PharmaBro charges a published flat fee of $1,000-$5,000/mo with zero revenue share and connects the brand's own Stripe through OAuth. Wizlo is newer and does not publish pricing, payment terms, pharmacy network size, or launch timelines. PharmaBro includes 30+ pre-integrated pharmacies, LegitScript managed in 7-14 days, and an in-house rebill engine.",
    takeaways: [
      "PharmaBro: published flat pricing. Wizlo: not published",
      "PharmaBro: brand owns Stripe via OAuth. Wizlo: not disclosed",
      "PharmaBro: 30+ pharmacies with intelligent routing. Wizlo: not disclosed",
      "PharmaBro: LegitScript managed in 7-14 days. Wizlo: not disclosed",
      "PharmaBro: in-house rebill engine with multi-MID routing. Wizlo: not disclosed",
      "PharmaBro: unlimited brands per account. Wizlo: not disclosed",
    ],
    rows: [
      { capability: "Public pricing", us: "$1,000-$5,000/mo", them: "Not publicly available" },
      { capability: "Revenue share", us: "None", them: "Not publicly available" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Not publicly available" },
      { capability: "Pharmacy network", us: "30+ pre-integrated", them: "Not publicly available" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Not publicly available" },
      { capability: "In-house rebill", us: true, them: "Not publicly available" },
      { capability: "Multi-brand", us: "Unlimited", them: "Not publicly available" },
      { capability: "Time to launch", us: "7 days", them: "Not publicly available" },
      { capability: "HIPAA", us: true, them: "Not publicly available" },
    ],
    methodology:
      "Wizlo is early stage and publishes limited product detail. Cells marked Not publicly available reflect that. Verify directly with Wizlo before deciding.",
    faqs: [
      {
        q: "Is Wizlo a real alternative to PharmaBro?",
        a: "It is an option worth a call, but the public record is thin. Until Wizlo publishes pricing, merchant of record, pharmacy network, and launch timeline, an operator cannot compare it objectively against a platform that publishes all four.",
      },
      {
        q: "What does Wizlo cost?",
        a: "Not published. PharmaBro publishes flat tiers from $1,000 to $5,000 per month with zero revenue share.",
      },
      {
        q: "Does Wizlo support multi-brand operators?",
        a: "Not disclosed. PharmaBro supports unlimited brands from one account at every tier, each with its own funnels, intake, pharmacy routing, and Stripe connection.",
      },
      {
        q: "How does PharmaBro handle LegitScript?",
        a: "PharmaBro prepares and manages the application end to end, typically completing certification in 7 to 14 days, which is what unlocks paid advertising for prescription products.",
      },
      {
        q: "What should I verify before signing with a newer platform?",
        a: "Uptime history, breach history, who holds the merchant account, how fast you can export the full patient dataset, and what happens to prescriptions and refills if you leave.",
      },
    ],
    ctaLine: "Published terms beat a quote you cannot compare.",
    teaser: "Newer platform, limited public detail.",
  },

  {
    slug: "pharmabro-vs-nimbusrx",
    competitor: "NimbusRx",
    short: "NimbusRx",
    title: "PharmaBro vs NimbusRx (2026): Full Comparison",
    description:
      "PharmaBro is a telehealth brand platform. NimbusRx focuses on pharmacy technology and medication management. Different core functions. Full comparison.",
    h1Lead: "PharmaBro vs NimbusRx:",
    h1Trail: "the 2026 comparison",
    category: "PHARMACY TECHNOLOGY PLATFORM",
    datePublished: "2026-04-06",
    dateModified: "2026-08-17",
    intro:
      "NimbusRx is primarily a pharmacy technology and medication management platform covering prescription routing, refill management, and pharmacy operations software. PharmaBro is a full brand infrastructure platform that includes pharmacy fulfillment as one of several components. These are not direct substitutes. NimbusRx is a pharmacy tech layer, PharmaBro is the complete brand layer.",
    directAnswer:
      "NimbusRx is a pharmacy technology platform focused on prescription management and medication routing. PharmaBro is a complete telehealth brand infrastructure platform that includes pharmacy as one component alongside payments (your Stripe), patient portal, LegitScript, and subscription billing. A brand operator needs both a pharmacy layer and a brand operations layer. PharmaBro delivers both in one platform.",
    takeaways: [
      "NimbusRx: pharmacy technology, prescription routing, refill management",
      "PharmaBro: full brand infrastructure with pharmacy included",
      "PharmaBro: payments in the brand's own Stripe. NimbusRx: not a payments platform",
      "PharmaBro: patient portal, intake builder, analytics. NimbusRx: pharmacy operations focus",
      "PharmaBro: LegitScript managed in 7-14 days",
      "PharmaBro: published flat pricing at $1,000-$5,000/mo",
    ],
    rows: [
      { capability: "Primary function", us: "Brand infrastructure", them: "Pharmacy technology" },
      { capability: "Pharmacy routing", us: "30+ pharmacies, automatic", them: true },
      { capability: "Refill management", us: true, them: true },
      { capability: "Payment processing", us: "Your Stripe", them: false },
      { capability: "Patient portal", us: true, them: false },
      { capability: "Intake builder", us: true, them: false },
      { capability: "Provider network", us: "50-state managed", them: false },
      { capability: "LegitScript", us: "Managed, 7-14d", them: false },
      { capability: "Subscription rebill", us: true, them: false },
      { capability: "Public pricing", us: true, them: false },
    ],
    faqs: [
      {
        q: "Do I need both NimbusRx and PharmaBro?",
        a: "Usually not. PharmaBro includes the pharmacy layer, routing prescriptions across 30+ pre-integrated pharmacies with fallback logic, plus the brand layer NimbusRx does not cover: intake, providers, payments, portal, and rebilling.",
      },
      {
        q: "How does PharmaBro route prescriptions?",
        a: "By SKU availability, patient state licensure, pharmacy capacity, and cost, with automatic fallback if a pharmacy rejects or delays an order. Every routing decision is logged in the order timeline.",
      },
      {
        q: "Does NimbusRx handle payments or subscriptions?",
        a: "No. It is a pharmacy operations layer. PharmaBro runs subscription billing through the brand's own Stripe account with an in-house rebill engine.",
      },
      {
        q: "Which fits a pharmacy rather than a brand?",
        a: "NimbusRx is aimed at pharmacy operations. PharmaBro is aimed at the brand operator who sells to patients and needs a pharmacy network behind it.",
      },
      {
        q: "Can PharmaBro connect to a pharmacy I already use?",
        a: "Yes. Existing pharmacy relationships can be added alongside the 30+ pre-integrated partners and included in the routing rules.",
      },
    ],
    ctaLine: "Pharmacy included, plus everything around it.",
    teaser: "Pharmacy tech layer vs the full brand layer.",
  },

  {
    slug: "pharmabro-vs-leguprx",
    competitor: "LegUp Rx",
    short: "LegUp Rx",
    title: "PharmaBro vs LegUp Rx (2026): Full Comparison",
    description:
      "PharmaBro vs LegUp Rx: full telehealth infrastructure comparison. Flat fee, Stripe ownership, pharmacy network, LegitScript management, and launch timeline.",
    h1Lead: "PharmaBro vs LegUp Rx:",
    h1Trail: "the 2026 comparison",
    category: "PHARMACY + TELEHEALTH PLATFORM",
    datePublished: "2026-04-13",
    dateModified: "2026-08-17",
    intro:
      "LegUp Rx pairs pharmacy access with telehealth services for brand operators. Both platforms therefore cover fulfillment. The separation is in economics and ownership: PharmaBro publishes a flat fee, takes no percentage, and connects the brand's own Stripe. LegUp Rx does not publish pricing or payment terms.",
    directAnswer:
      "PharmaBro charges a flat monthly fee ($1,000-$5,000/mo) with zero revenue share and gives brands full Stripe ownership. LegUp Rx's pricing is not publicly listed. Both platforms include pharmacy networks. PharmaBro includes 30+ pre-integrated compounding pharmacies with intelligent SKU routing, LegitScript managed in 7-14 days, and an in-house rebill engine.",
    takeaways: [
      "PharmaBro: flat fee, published. LegUp Rx: pricing not public",
      "PharmaBro: brand owns Stripe via OAuth. LegUp Rx: not disclosed",
      "Both include pharmacy fulfillment",
      "PharmaBro: 30+ pharmacies with SKU and state routing",
      "PharmaBro: LegitScript managed in 7-14 days",
      "PharmaBro: in-house rebill engine saving 0.5-1% per cycle",
    ],
    rows: [
      { capability: "Public pricing", us: "$1,000-$5,000/mo", them: "Not publicly available" },
      { capability: "Revenue share", us: "None", them: "Not publicly available" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Not publicly available" },
      { capability: "Pharmacy fulfillment", us: "30+ integrated", them: true },
      { capability: "Intelligent SKU routing", us: true, them: "Not publicly available" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Not publicly available" },
      { capability: "In-house rebill", us: true, them: "Not publicly available" },
      { capability: "Patient portal", us: true, them: "Not publicly available" },
      { capability: "Multi-brand", us: "Unlimited", them: "Not publicly available" },
      { capability: "HIPAA", us: true, them: true },
    ],
    methodology:
      "Cells marked Not publicly available reflect information LegUp Rx does not publish. Verify directly before deciding.",
    faqs: [
      {
        q: "Does LegUp Rx publish pricing?",
        a: "No. PharmaBro publishes flat tiers from $1,000 to $5,000 per month with zero revenue share and lists setup fees and add-ons on the same page.",
      },
      {
        q: "How do the pharmacy networks compare?",
        a: "PharmaBro publishes 30+ pre-integrated pharmacies with routing by SKU, state licensure, capacity, and cost, including automatic fallback. LegUp Rx includes pharmacy access but does not publish network size or routing logic.",
      },
      {
        q: "Who is merchant of record?",
        a: "On PharmaBro, the brand. Payments settle into the brand's own Stripe account via OAuth. LegUp Rx does not publicly describe its payment model.",
      },
      {
        q: "What does the rebill engine add?",
        a: "Retry logic, card updater, multi-MID routing across up to 5 processors, and 28-day cycles that produce 13 billing events per year. Together that is 0.5 to 1 percent saved per cycle against standard recurring billing.",
      },
      {
        q: "How fast is launch?",
        a: "PharmaBro launches in 7 days with LegitScript managed in parallel. LegUp Rx does not publish a launch timeline.",
      },
    ],
    ctaLine: "Pharmacy plus payments you actually own.",
    teaser: "Both do pharmacy. Only one publishes terms.",
  },

  {
    slug: "pharmabro-vs-lyv-health",
    competitor: "Lyv Health",
    short: "Lyv Health",
    title: "PharmaBro vs Lyv Health (2026): Full Comparison",
    description:
      "PharmaBro vs Lyv Health: telehealth brand platform comparison. Flat fee, Stripe ownership, pharmacy fulfillment, and LegitScript in 7-14 days.",
    h1Lead: "PharmaBro vs Lyv Health:",
    h1Trail: "the 2026 comparison",
    category: "TELEHEALTH BRAND PLATFORM",
    datePublished: "2026-04-20",
    dateModified: "2026-08-17",
    intro:
      "Lyv Health sells a telehealth brand platform to operators launching their own clinics. PharmaBro competes directly on that job. The comparison comes down to what each company publishes: PharmaBro's fee, payment ownership, pharmacy network, and export terms are all public. Lyv Health's are not.",
    directAnswer:
      "PharmaBro charges a flat monthly fee with zero revenue share and gives brands full Stripe ownership via OAuth. Lyv Health's pricing and payment model are not publicly disclosed. PharmaBro includes 30+ pre-integrated pharmacies, LegitScript managed in 7-14 days, and an in-house rebill engine saving 0.5-1% per billing cycle.",
    takeaways: [
      "PharmaBro: flat fee, published. Lyv Health: not disclosed",
      "PharmaBro: brand owns Stripe via OAuth. Lyv Health: not disclosed",
      "PharmaBro: 30+ pre-integrated pharmacies",
      "PharmaBro: LegitScript managed in 7-14 days",
      "PharmaBro: in-house rebill engine, 0.5-1% saved per cycle",
      "PharmaBro: unlimited brands from one account",
    ],
    rows: [
      { capability: "Public pricing", us: "$1,000-$5,000/mo", them: "Not publicly available" },
      { capability: "Revenue share", us: "None", them: "Not publicly available" },
      { capability: "Merchant of record", us: "Brand owns Stripe", them: "Not publicly available" },
      { capability: "Pharmacy network", us: "30+ pre-integrated", them: "Not publicly available" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Not publicly available" },
      { capability: "In-house rebill", us: true, them: "Not publicly available" },
      { capability: "Patient data export", us: "24h", them: "Not publicly available" },
      { capability: "Multi-brand", us: "Unlimited", them: "Not publicly available" },
      { capability: "HIPAA", us: true, them: true },
    ],
    methodology:
      "Cells marked Not publicly available reflect information Lyv Health does not publish. Verify directly before deciding.",
    faqs: [
      {
        q: "What is Lyv Health's pricing model?",
        a: "Not publicly disclosed. PharmaBro publishes flat tiers from $1,000 to $5,000 per month and takes no percentage of billings at any tier.",
      },
      {
        q: "Who receives patient payments?",
        a: "On PharmaBro, the brand does, directly into its own Stripe account connected via OAuth. Lyv Health does not publicly describe its payment flow.",
      },
      {
        q: "Can I export my patient data?",
        a: "PharmaBro provides a full export of patients, orders, prescriptions, and messages within 24 hours of request, at any time, with no exit fee. Lyv Health does not publish export terms.",
      },
      {
        q: "How many pharmacies are integrated?",
        a: "PharmaBro publishes 30+ pre-integrated compounding and retail pharmacies with automatic routing and fallback. Lyv Health does not publish network size.",
      },
      {
        q: "Which one launches faster?",
        a: "PharmaBro publishes a 7-day launch with LegitScript managed in 7 to 14 days in parallel. Lyv Health does not publish a timeline.",
      },
    ],
    ctaLine: "Flat fee, your Stripe, 7-day launch.",
    teaser: "Same job. Public terms against private ones.",
  },

  {
    slug: "pharmabro-vs-medovation-partners",
    competitor: "Medovation Partners",
    short: "Medovation Partners",
    title: "PharmaBro vs Medovation Partners (2026): Full Comparison",
    description:
      "PharmaBro vs Medovation Partners: telehealth infrastructure comparison. Flat fee platform vs consulting and managed services model.",
    h1Lead: "PharmaBro vs Medovation Partners:",
    h1Trail: "the 2026 comparison",
    category: "TELEHEALTH CONSULTING AND MANAGED SERVICES",
    datePublished: "2026-04-27",
    dateModified: "2026-08-17",
    intro:
      "Medovation Partners operates primarily as a telehealth consulting and managed services company rather than a self-serve technology platform. PharmaBro is a SaaS infrastructure platform. For brand operators who want technology they operate themselves on a flat fee, PharmaBro is the stronger fit. For operators who want heavy consulting and managed implementation, Medovation Partners fills that role.",
    directAnswer:
      "Medovation Partners is a consulting and managed services firm for telehealth operators. PharmaBro is a flat-fee software platform the brand operates itself, with pharmacy, payments in the brand's own Stripe, patient portal, prescriptions, and LegitScript managed in 7-14 days. Consulting engagements are scoped and quoted per project. PharmaBro publishes fixed monthly pricing.",
    takeaways: [
      "Medovation Partners: consulting and managed services, scoped per engagement",
      "PharmaBro: software platform on a published flat fee",
      "PharmaBro: brand owns Stripe and all patient data",
      "PharmaBro: 30+ pharmacies, patient portal, intake builder, analytics included",
      "PharmaBro: launch in 7 days, LegitScript in 7-14 days",
      "Consulting can complement PharmaBro rather than replace it",
    ],
    rows: [
      { capability: "Model", us: "SaaS platform", them: "Consulting and managed services" },
      { capability: "Pricing", us: "$1,000-$5,000/mo flat", them: "Scoped per engagement" },
      { capability: "Software included", us: true, them: "Varies" },
      { capability: "Pharmacy network", us: "30+ pre-integrated", them: "Sourced per client" },
      { capability: "Payments", us: "Brand's own Stripe", them: "Varies" },
      { capability: "Patient portal", us: true, them: "Varies" },
      { capability: "LegitScript", us: "Managed, 7-14d", them: "Advisory" },
      { capability: "Time to launch", us: "7 days", them: "Project dependent" },
      { capability: "Ongoing cost predictability", us: "Fixed monthly", them: "Variable" },
    ],
    faqs: [
      {
        q: "Is Medovation Partners a software platform?",
        a: "Primarily it is a consulting and managed services firm. Deliverables are scoped per engagement rather than sold as a fixed monthly product. PharmaBro is a platform with a published monthly fee and a 7-day launch.",
      },
      {
        q: "Can I use both?",
        a: "Yes. Some operators run PharmaBro as the technology layer and hire consultants for market strategy, clinical protocol design, or regulatory review.",
      },
      {
        q: "Which is more cost predictable?",
        a: "PharmaBro. The monthly fee is fixed and published, and there is no percentage of billings. Consulting cost varies with scope and hours.",
      },
      {
        q: "What do I own in each model?",
        a: "On PharmaBro the brand owns its Stripe account, its patient data with a 24-hour export, and its domain and funnels. In a managed services model, ownership depends entirely on how the contract is written.",
      },
      {
        q: "How fast can each get me live?",
        a: "PharmaBro publishes a 7-day launch. A consulting engagement timeline depends on scope, vendor selection, and build decisions made during the project.",
      },
    ],
    ctaLine: "Software you own, priced the same every month.",
    teaser: "Platform on a flat fee vs a scoped engagement.",
  },
];

export const compareBySlug = (slug: string) => COMPARE.find((c) => c.slug === slug);

/** Three sibling comparisons for the internal-link strip. */
export function siblingCompares(slug: string) {
  const i = COMPARE.findIndex((c) => c.slug === slug);
  return [1, 2, 3].map((n) => COMPARE[(i + n + COMPARE.length) % COMPARE.length]!);
}
