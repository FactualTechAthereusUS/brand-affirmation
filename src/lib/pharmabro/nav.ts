/**
 * Global nav + footer content for the PharmaBro site.
 * Copy lifted verbatim from the PharmaBro website spec.
 */

export type NavItem = { label: string; to?: string; hash?: string; note?: string };
export type NavGroup = { label: string; items: NavItem[] };

/**
 * Header nav is homepage-first: every item scrolls to a section on
 * /pharmabro instead of opening a separate page.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { label: "Complete clinic", hash: "clinic" },
      { label: "What's included", hash: "platform" },
      { label: "Runs on PharmaBro", hash: "run-on" },
      { label: "Checkout to revenue", hash: "how-it-works" },
      { label: "Pharmacy network", hash: "network", note: "30+ partners" },
      { label: "Analytics & reporting", hash: "analytics" },
      { label: "LegitScript in 7-14 days", hash: "legitscript" },
    ],
  },
  {
    label: "Why PharmaBro",
    items: [
      { label: "Retention engine", hash: "retention" },
      { label: "Operator results", hash: "testimonials" },
      { label: "Compare platforms", hash: "compare" },
      { label: "From the blog", hash: "blog" },
      { label: "FAQ", hash: "faq" },
      { label: "Get started", hash: "get-started" },
    ],
  },
];

export const FOOTER_COLUMNS: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { label: "Platform Overview", to: "/pharmabro/platform" },
      { label: "Payments & Rebill", to: "/pharmabro/platform/payments" },
      { label: "Pharmacy Network", to: "/pharmabro/platform/pharmacy" },
      { label: "LegitScript", to: "/pharmabro/platform/legitscript" },
      { label: "Patient Portal", to: "/pharmabro/platform/patient-portal" },
      { label: "Intake Builder", to: "/pharmabro/platform/intake-builder" },
      { label: "Analytics & Reporting", to: "/pharmabro/platform/analytics" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Weight Loss (GLP-1)", to: "/pharmabro/solutions/weight-loss" },
      { label: "Men's Health", to: "/pharmabro/solutions/mens-health" },
      { label: "Women's Health", to: "/pharmabro/solutions/womens-health" },
      { label: "Peptides", to: "/pharmabro/solutions/peptides" },
      { label: "Hair Loss", to: "/pharmabro/solutions/hair-loss" },
      { label: "Longevity & NAD+", to: "/pharmabro/solutions/longevity" },
      { label: "Sexual Health", to: "/pharmabro/solutions/sexual-health" },
    ],
  },
  {
    label: "Compare",
    items: [
      { label: "PharmaBro vs OpenLoop", to: "/pharmabro/compare/pharmabro-vs-openloop" },
      { label: "PharmaBro vs Bask", to: "/pharmabro/compare/pharmabro-vs-bask-health" },
      { label: "PharmaBro vs Cuvo", to: "/pharmabro/compare/pharmabro-vs-cuvo" },
      { label: "PharmaBro vs Rimo", to: "/pharmabro/compare/pharmabro-vs-rimo" },
      { label: "PharmaBro vs CareValidate", to: "/pharmabro/compare/pharmabro-vs-carevalidate" },
      { label: "All Comparisons", to: "/pharmabro/compare" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Blog", to: "/pharmabro/blog" },
      { label: "True Cost of Revenue Share", to: "/pharmabro/blog" },
      { label: "GLP-1 Business Guide", to: "/pharmabro/blog" },
      { label: "LegitScript Timeline", to: "/pharmabro/blog" },
      { label: "White-Label Guide 2026", to: "/pharmabro/blog" },
      { label: "Launch Week Playbook", to: "/pharmabro/blog" },
      { label: "Glossary", to: "/pharmabro/glossary" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", to: "/pharmabro/about" },
      { label: "Security", to: "/pharmabro/security" },
      { label: "Contact", to: "/pharmabro/contact" },
      { label: "Pricing", to: "/pharmabro/pricing" },
    ],
  },
];

export const FOOTER_LEGAL: NavItem[] = [
  { label: "Terms of Service", to: "/pharmabro/legal/terms" },
  { label: "Privacy Policy", to: "/pharmabro/legal/privacy" },
  { label: "HIPAA Notice", to: "/pharmabro/legal/hipaa-notice" },
  { label: "Do Not Sell My Info", to: "/pharmabro/legal/do-not-sell" },
];

export const FOOTER_DISCLAIMER =
  "PharmaBro provides telehealth infrastructure software. All clinical decisions are made by licensed healthcare providers. Brand operators are responsible for non-clinical business operations only. Nothing on this site is medical advice or a guarantee of business results.";

/** Announcement bar A/B variants from the spec. */
export const ANNOUNCEMENTS = [
  {
    text: "Switching from OpenLoop or Bask? Free white-glove migration in days.",
    cta: "Book a call",
    to: "/pharmabro/booking",
  },
  {
    text: "LegitScript in 7-14 days. Meta, Google, and TikTok ads unlocked from launch day.",
    cta: "See how",
    to: "/pharmabro/platform/legitscript",
  },
] as const;
