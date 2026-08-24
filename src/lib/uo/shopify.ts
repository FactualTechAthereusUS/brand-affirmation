/**
 * Unhinged One — Shopify Storefront API client.
 *
 * Everything the storefront renders (products, prices, images, cart, checkout)
 * comes from the live store. No mock products anywhere.
 */

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "c53d27-88.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "b678f1dba4c415306c65df2e2ed7c115";

export type Money = { amount: string; currencyCode: string };

export type UOVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  image: { url: string; altText: string | null } | null;
  selectedOptions: Array<{ name: string; value: string }>;
};

export type UOShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  options: Array<{ name: string; values: string[] }>;
  variants: { edges: Array<{ node: UOVariant }> };
};

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  tags
  availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  images(first: 6) { edges { node { url altText } } }
  options { name values }
  variants(first: 100) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url altText }
        selectedOptions { name value }
      }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      handle
      products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } }
    }
  }
`;

export const PRODUCTS_QUERY = `
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) { edges { node { ${PRODUCT_FIELDS} } } }
  }
`;

export const PRODUCT_QUERY = `
  query Product($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export class ShopifyPaymentRequiredError extends Error {}

export async function storefrontApiRequest<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    throw new ShopifyPaymentRequiredError("Shopify API access requires an active billing plan.");
  }
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Error calling Shopify: ${json.errors.map((e: any) => e.message).join(", ")}`);
  }
  return json.data as T;
}

/** Products in a collection, filtered of non-garment SKUs (shipping protection). */
export async function fetchCollectionProducts(handle: string, first = 12) {
  const data = await storefrontApiRequest<{
    collection: { products: { edges: Array<{ node: UOShopifyProduct }> } } | null;
  }>(COLLECTION_PRODUCTS_QUERY, { handle, first: first + 4 });
  const nodes = (data.collection?.products.edges ?? []).map((e) => e.node);
  return filterSellable(nodes).slice(0, first);
}

export async function fetchProducts(first = 12, query?: string) {
  const data = await storefrontApiRequest<{
    products: { edges: Array<{ node: UOShopifyProduct }> };
  }>(PRODUCTS_QUERY, { first: first + 4, query });
  return filterSellable(data.products.edges.map((e) => e.node)).slice(0, first);
}

export async function fetchProduct(handle: string) {
  const data = await storefrontApiRequest<{ product: UOShopifyProduct | null }>(PRODUCT_QUERY, {
    handle,
  });
  return data.product;
}

function filterSellable(products: UOShopifyProduct[]) {
  return products.filter((p) => !/shipping protection/i.test(p.title));
}

/* ------------------------------------------------------------- helpers */

export function money(amount: string | number, currencyCode = "USD") {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function productImages(p: UOShopifyProduct) {
  return p.images.edges.map((e) => e.node);
}

export function variantsOf(p: UOShopifyProduct) {
  return p.variants.edges.map((e) => e.node);
}

export function optionValues(p: UOShopifyProduct, name: string) {
  return p.options.find((o) => o.name.toLowerCase() === name.toLowerCase())?.values ?? [];
}

/** Colour names on this catalog mapped to swatch hexes. */
const COLOR_HEX: Record<string, string> = {
  white: "#f6f4ef",
  bone: "#efe9dd",
  sand: "#dfd2bd",
  ash: "#d9d9d6",
  "sport grey": "#b3b3ad",
  grey: "#b3b3ad",
  gray: "#b3b3ad",
  "dark heather": "#5a5a5a",
  charcoal: "#3d3d3d",
  black: "#141414",
  navy: "#1f2a44",
  "light blue": "#bcd4e6",
  "light pink": "#f2cdd7",
  pink: "#f0b5c4",
  red: "#c3392c",
  maroon: "#6c2230",
  military: "#5c5a45",
  "forest green": "#2f4232",
  green: "#3d5a41",
  purple: "#5a4a7a",
  yellow: "#e8c65a",
  orange: "#dd7a35",
  brown: "#6b4a34",
  cream: "#efe6d4",
  natural: "#e8ddc7",
};

export function swatchHex(value: string) {
  return COLOR_HEX[value.trim().toLowerCase()] ?? "#cfcabd";
}

/** Badge derived from live store signals only — never invented. */
export function badgeFor(p: UOShopifyProduct): string | null {
  const tags = p.tags.map((t) => t.toLowerCase());
  if (!p.availableForSale) return "SOLD OUT";
  if (tags.some((t) => t.includes("new"))) return "NEW";
  const variants = variantsOf(p);
  const soldOut = variants.filter((v) => !v.availableForSale).length;
  if (variants.length > 4 && soldOut / variants.length > 0.5) return "ALMOST GONE";
  return null;
}

export function savingsPct(p: UOShopifyProduct) {
  const price = Number.parseFloat(p.priceRange.minVariantPrice.amount);
  const compare = Number.parseFloat(p.compareAtPriceRange.minVariantPrice.amount || "0");
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}
