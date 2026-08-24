/**
 * Unhinged One homepage content.
 *
 * Every review headline and body is verbatim from the Loox export — the brief
 * is explicit that nothing invented beats "my brother hates it, it's perfect."
 */

export const TICKER_ITEMS = [
  "FREE SHIPPING ON 2+",
  "THE RESTOCK SHIPS OCT 25",
  "1,088 OF 1,500 CLAIMED",
] as const;

export const COLLECTIONS = [
  { label: "Shop All", slug: "shop-all" },
  { label: "Talk Shit", slug: "talk-shit" },
  { label: "Proud Of", slug: "proud-of" },
  { label: "My Parents", slug: "my-parents" },
  { label: "Survivor", slug: "survivor" },
  { label: "The Diagnosis", slug: "the-diagnosis" },
  { label: "New Drop", slug: "new-drop" },
] as const;

export type Swatch = { name: string; hex: string };

export type UOProduct = {
  /** The payload — this is the product. */
  print: string;
  name: string;
  badge?: "BEST SELLER" | "ALMOST GONE" | "NEW";
  price: number;
  compareAt: number;
  swatches: Swatch[];
  /** Verbatim customer line, revealed on hover in place of the print. */
  reaction: string;
  reactionBy: string;
  /** Print colour on the garment face. */
  tone: "red" | "ink" | "cream";
};

const SWATCHES: Swatch[] = [
  { name: "Bone", hex: "#efe9dd" },
  { name: "Black", hex: "#141414" },
  { name: "Ash", hex: "#9a9a96" },
  { name: "Clay", hex: "#c08363" },
];

export const BEST_SELLERS: UOProduct[] = [
  {
    print: "Mom Didn't Raise A Bitch",
    name: "Mom Didn't Raise A Bitch Crewneck",
    badge: "BEST SELLER",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "Wore it to brunch with my mother. She framed the receipt.",
    reactionBy: "Danielle R.",
    tone: "red",
  },
  {
    print: "My Sister And I Talk Shit About You",
    name: "Talk Shit Matching Crewneck",
    badge: "ALMOST GONE",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "My brother hates it. It's perfect.",
    reactionBy: "Kelsey G.",
    tone: "ink",
  },
  {
    print: "Proud Sister Of My Dumbass Brother",
    name: "Dumbass Brother Crewneck",
    badge: "BEST SELLER",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "Bought it for my sister. She loved it. I'm the dumbass brother.",
    reactionBy: "Travis H.",
    tone: "red",
  },
  {
    print: "Don't Make Me Angry, My Family Is Unhinged",
    name: "Unhinged Family Crewneck",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "Definitely a conversation starter. A.K.A. everybody wants to know my lore.",
    reactionBy: "Jamie F.",
    tone: "ink",
  },
];

export const NEW_DROP: UOProduct[] = [
  {
    print: "I've Done Enough Emotional Labor For This Family",
    name: "Emotional Labor Crewneck",
    badge: "NEW",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "Kept it a secret for my parents. When they saw it they lost it.",
    reactionBy: "Esmeralda J.",
    tone: "red",
  },
  {
    print: "My Therapist Knows About All Of You",
    name: "My Therapist Knows Crewneck",
    badge: "NEW",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "10/10, would roast my kids in public again.",
    reactionBy: "Raivis S.",
    tone: "ink",
  },
  {
    print: "Survivor Of The Family Group Chat",
    name: "Group Chat Survivor Crewneck",
    badge: "NEW",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "Super comfy and gets laughs every single time I wear it.",
    reactionBy: "Michelle B.",
    tone: "cream",
  },
  {
    print: "Emotionally Unavailable, Physically Present",
    name: "Physically Present Crewneck",
    badge: "NEW",
    price: 59.99,
    compareAt: 79.99,
    swatches: SWATCHES,
    reaction: "My dad wore it two days straight. He does not do jokes.",
    reactionBy: "Priya M.",
    tone: "ink",
  },
];

export type Reaction = {
  headline: string;
  body?: string;
  name: string;
  /** Initials-only avatar; no fake stock faces. */
  tone: "red" | "ink" | "cream";
};

export const REACTIONS: Reaction[] = [
  {
    headline: "My brother hates it. It's perfect.",
    name: "Kelsey G.",
    tone: "red",
  },
  {
    headline: "His face was priceless",
    body: "Super comfy and gets laughs every time I wear it. When my brother saw it, his face was priceless. Can't wait to wear it for Thanksgiving.",
    name: "Michelle B.",
    tone: "ink",
  },
  {
    headline: "I'm the dumbass brother",
    body: "Bought it for my sister. She loved it. I'm the dumbass brother.",
    name: "Travis H.",
    tone: "cream",
  },
  {
    headline: "They lost it",
    body: "Kept it a secret for my parents. When they saw it they lost it. Perfectly describes me.",
    name: "Esmeralda J.",
    tone: "red",
  },
  {
    headline: "Everybody wants to know my lore",
    body: "Definitely a conversation starter. A.K.A. everybody wants to know my lore.",
    name: "Jamie F.",
    tone: "ink",
  },
  {
    headline: "10/10, would roast my kids in public again",
    name: "Raivis S.",
    tone: "cream",
  },
];

export const TARGETS = [
  { label: "The Brother", line: "He knows what he did.", tone: "ink" as const },
  { label: "The Sister", line: "She started it.", tone: "red" as const },
  { label: "Mom", line: "You're becoming her. It's fine.", tone: "cream" as const },
  { label: "Dad", line: "Emotionally unavailable, physically present.", tone: "ink" as const },
  { label: "The Bestie", line: "Your co-conspirator.", tone: "red" as const },
];

export const UGC = [
  { handle: "@kelseyggg", caption: "Sent it to the group chat. Chaos." },
  { handle: "@michelleb.jpg", caption: "Thanksgiving fit, locked." },
  { handle: "@travis.h", caption: "I am the dumbass brother." },
  { handle: "@esmeraldaaa", caption: "Mom screamed." },
  { handle: "@jamie.f", caption: "Ask me about my lore." },
  { handle: "@raivis.s", caption: "Roasted my kids. Again." },
];

export const CLAIMED = 1088;
export const CLAIM_CAP = 1500;
