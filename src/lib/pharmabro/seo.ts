/**
 * Single source of truth for PharmaBro SEO: site URL, the locked commercial
 * offer, the keyword-to-URL map, and the JSON-LD graph builders. Every
 * PharmaBro route should pull its metadata primitives from here so titles,
 * canonicals, and schema stay consistent.
 */

export const SITE_URL = "https://sweet-confirm-it.lovable.app";
export const PB_BASE = `${SITE_URL}/pharmabro`;

/** Human readable "content freshness" stamp rendered on long pages. */
export const LAST_UPDATED = "August 2026";
export const LAST_UPDATED_ISO = "2026-08-18";

/** The locked offer. Never quote numbers that contradict this block. */
export const OFFER = {
  setup: "$5,000 one-time setup",
  platform: "$1,000 to $5,000 per month",
  consult: "$30 per consult in month one",
  markup: "0% markup on medication",
  revShare: "No revenue share, ever",
  stripe: "Payments settle to your own Stripe",
} as const;

/** Primary keyword targets. One page per intent, no cannibalisation. */
export const KEYWORD_MAP: Record<string, string> = {
  "white label telehealth platform": "/pharmabro",
  "telehealth platform pricing": "/pharmabro/pricing",
  "best white label telehealth platforms": "/pharmabro/compare",
  "glp-1 telehealth platform": "/pharmabro/solutions/weight-loss",
  "legitscript certification": "/pharmabro/platform/legitscript",
  "telehealth pharmacy fulfillment": "/pharmabro/platform/pharmacy",
};

export function pbUrl(path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${PB_BASE}/${clean}` : PB_BASE;
}

type MetaEntry = Record<string, string>;

/**
 * Builds the full meta array for a PharmaBro page. `path` is relative to
 * /pharmabro ("" for the home page).
 */
export function pbMeta({
  title,
  description,
  path = "",
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  type?: string;
}): MetaEntry[] {
  const url = pbUrl(path);
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: "PharmaBro" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function pbCanonical(path = "") {
  return [{ rel: "canonical", href: pbUrl(path) }];
}

/* --------------------------------------------------------------- JSON-LD */

export const ORG_NODE = {
  "@type": "Organization",
  "@id": `${PB_BASE}#organization`,
  name: "PharmaBro",
  url: PB_BASE,
  description:
    "White label telehealth infrastructure for brand operators. Flat monthly fee, zero revenue share, payments to your own Stripe.",
  slogan: "Your brand. Your patients. Your revenue.",
  areaServed: "US",
};

export const WEBSITE_NODE = {
  "@type": "WebSite",
  "@id": `${PB_BASE}#website`,
  url: PB_BASE,
  name: "PharmaBro",
  publisher: { "@id": `${PB_BASE}#organization` },
  inLanguage: "en-US",
};

export function softwareNode() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${PB_BASE}#software`,
    name: "PharmaBro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: PB_BASE,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "1000",
      highPrice: "5000",
      offerCount: 4,
      description:
        "Flat monthly platform fee from $1,000 to $5,000 with a $5,000 one time setup. No revenue share.",
    },
  };
}

export function faqNode(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${PB_BASE}#faq`,
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: pbUrl(t.path),
    })),
  };
}

export function ldGraph(nodes: unknown[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
