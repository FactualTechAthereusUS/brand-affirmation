/**
 * Unhinged One cart — backed by the Shopify Storefront Cart API.
 *
 * Checkout is always the Storefront-issued checkoutUrl (with
 * channel=online_store), opened in a new tab. No manual cart permalinks.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { storefrontApiRequest, type Money } from "./shopify";

const STORAGE_KEY = "uo_cart_id";

export type UOCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; compareAtAmountPerQuantity: Money | null };
  merchandise: {
    id: string;
    title: string;
    image: { url: string; altText: string | null } | null;
    price: Money;
    compareAtPrice: Money | null;
    selectedOptions: Array<{ name: string; value: string }>;
    product: { title: string; handle: string };
  };
};

export type UOCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: { edges: Array<{ node: UOCartLine }> };
};

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
          compareAtAmountPerQuantity { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            product { title handle }
          }
        }
      }
    }
  }
`;

const CART_QUERY = `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
const CART_CREATE = `mutation CartCreate($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } } }`;
const CART_LINES_ADD = `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`;
const CART_LINES_UPDATE = `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`;
const CART_LINES_REMOVE = `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } } }`;

type Ctx = {
  cart: UOCart | null;
  lines: UOCartLine[];
  count: number;
  busy: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  addLine: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  checkout: () => void;
};

const CartContext = createContext<Ctx | null>(null);

export function UOCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<UOCart | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  // rehydrate an existing cart
  useEffect(() => {
    const id = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
    if (!id) return;
    storefrontApiRequest<{ cart: UOCart | null }>(CART_QUERY, { id })
      .then((d) => {
        if (d.cart) setCart(d.cart);
        else window.localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => window.localStorage.removeItem(STORAGE_KEY));
  }, []);

  const commit = useCallback((next: UOCart | null | undefined) => {
    if (!next) return;
    setCart(next);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next.id);
  }, []);

  const addLine = useCallback(
    async (variantId: string, quantity = 1) => {
      setBusy(true);
      try {
        const lines = [{ merchandiseId: variantId, quantity }];
        if (cart?.id) {
          const d = await storefrontApiRequest<{ cartLinesAdd: { cart: UOCart } }>(CART_LINES_ADD, {
            cartId: cart.id,
            lines,
          });
          commit(d.cartLinesAdd?.cart);
        } else {
          const d = await storefrontApiRequest<{ cartCreate: { cart: UOCart } }>(CART_CREATE, {
            lines,
          });
          commit(d.cartCreate?.cart);
        }
        setOpen(true);
      } finally {
        setBusy(false);
      }
    },
    [cart?.id, commit],
  );

  const updateLine = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;
      setBusy(true);
      try {
        if (quantity <= 0) {
          const d = await storefrontApiRequest<{ cartLinesRemove: { cart: UOCart } }>(
            CART_LINES_REMOVE,
            { cartId: cart.id, lineIds: [lineId] },
          );
          commit(d.cartLinesRemove?.cart);
          return;
        }
        const d = await storefrontApiRequest<{ cartLinesUpdate: { cart: UOCart } }>(
          CART_LINES_UPDATE,
          { cartId: cart.id, lines: [{ id: lineId, quantity }] },
        );
        commit(d.cartLinesUpdate?.cart);
      } finally {
        setBusy(false);
      }
    },
    [cart?.id, commit],
  );

  const removeLine = useCallback((lineId: string) => updateLine(lineId, 0), [updateLine]);

  const checkout = useCallback(() => {
    if (!cart?.checkoutUrl) return;
    const url = new URL(cart.checkoutUrl);
    url.searchParams.set("channel", "online_store");
    window.open(url.toString(), "_blank");
  }, [cart?.checkoutUrl]);

  const value = useMemo<Ctx>(
    () => ({
      cart,
      lines: cart?.lines.edges.map((e) => e.node) ?? [],
      count: cart?.totalQuantity ?? 0,
      busy,
      open,
      setOpen,
      addLine,
      updateLine,
      removeLine,
      checkout,
    }),
    [cart, busy, open, addLine, updateLine, removeLine, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useUOCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useUOCart must be used inside UOCartProvider");
  return ctx;
}
