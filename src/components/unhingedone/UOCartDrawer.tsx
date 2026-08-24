import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { UO_EASE } from "./uo";
import { money } from "@/lib/uo/shopify";
import { useUOCart } from "@/lib/uo/cart";

const FREE_SHIP_ITEMS = 2;

/**
 * Comfrt's cart drawer, Unhinged One's copy: free-shipping progress on item
 * count, per-line quantity steppers, automatic savings row, and a checkout
 * button that goes straight to the Storefront checkout URL.
 */
export function UOCartDrawer() {
  const { open, setOpen, lines, count, cart, updateLine, removeLine, checkout, busy } = useUOCart();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const subtotal = cart ? Number.parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const currency = cart?.cost.subtotalAmount.currencyCode ?? "USD";
  const compareTotal = lines.reduce((sum, l) => {
    const c = l.cost.compareAtAmountPerQuantity?.amount
      ? Number.parseFloat(l.cost.compareAtAmountPerQuantity.amount) * l.quantity
      : Number.parseFloat(l.cost.totalAmount.amount);
    return sum + c;
  }, 0);
  const savings = Math.max(0, compareTotal - subtotal);
  const remaining = Math.max(0, FREE_SHIP_ITEMS - count);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: UO_EASE }}
            className="fixed inset-y-0 right-0 z-[80] flex w-[94%] max-w-[440px] flex-col bg-canvas"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 md:px-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Your unhinged bag ({count})
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="uo-icon">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* free shipping progress */}
            <div className="bg-[#0b0b0b] px-5 py-3 text-[#f2efe8] md:px-6">
              <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.18em]">
                {remaining === 0
                  ? "Free shipping unlocked. Nobody buys one."
                  : `Add ${remaining} more item${remaining > 1 ? "s" : ""} for free shipping`}
              </p>
              <div className="mt-2 h-[3px] w-full overflow-hidden bg-[#f2efe8]/20">
                <motion.div
                  className="h-full bg-uo-red"
                  initial={false}
                  animate={{ width: `${Math.min(100, (count / FREE_SHIP_ITEMS) * 100)}%` }}
                  transition={{ duration: 0.6, ease: UO_EASE }}
                />
              </div>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="uo-display text-[26px] leading-none">Nothing in here yet</p>
                <p className="text-[13px] text-ink/55">
                  Nobody buys one. The matching set is the whole point.
                </p>
                <button type="button" onClick={() => setOpen(false)} className="uo-btn mt-2 w-full max-w-[260px]">
                  Shop the drop
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
                  <ul className="space-y-5">
                    {lines.map((l) => (
                      <li key={l.id} className="flex gap-3.5">
                        <div className="h-[104px] w-[84px] shrink-0 overflow-hidden bg-[#efe9dd]">
                          {l.merchandise.image ? (
                            <img
                              src={l.merchandise.image.url}
                              alt={l.merchandise.product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="pr-6 text-[12.5px] font-medium leading-snug">
                            {l.merchandise.product.title}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-ink/45">
                            {l.merchandise.selectedOptions.map((o) => o.value).join(" / ")}
                          </p>
                          <div className="mt-2.5 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center border border-ink/15">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                disabled={busy}
                                onClick={() => updateLine(l.id, l.quantity - 1)}
                                className="px-2.5 py-1 text-[13px] disabled:opacity-40"
                              >
                                &minus;
                              </button>
                              <span className="min-w-[26px] text-center text-[12.5px]">{l.quantity}</span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                disabled={busy}
                                onClick={() => updateLine(l.id, l.quantity + 1)}
                                className="px-2.5 py-1 text-[13px] disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right text-[12.5px]">
                              {l.cost.compareAtAmountPerQuantity ? (
                                <span className="mr-2 text-ink/40 line-through">
                                  {money(
                                    Number.parseFloat(l.cost.compareAtAmountPerQuantity.amount) * l.quantity,
                                    currency,
                                  )}
                                </span>
                              ) : null}
                              <span className="font-semibold">
                                {money(l.cost.totalAmount.amount, l.cost.totalAmount.currencyCode)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(l.id)}
                            disabled={busy}
                            className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-ink/40 underline disabled:opacity-40"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-ink/10 px-5 py-5 md:px-6">
                  {savings > 0 ? (
                    <div className="flex items-center justify-between text-[12px] text-uo-red">
                      <span className="font-semibold uppercase tracking-[0.12em]">Automatic savings</span>
                      <span>&minus;{money(savings, currency)}</span>
                    </div>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Subtotal</span>
                    <span className="text-[15px] font-semibold">{money(subtotal, currency)}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-ink/45">
                    Taxes and shipping calculated at checkout.
                  </p>
                  <button
                    type="button"
                    onClick={checkout}
                    disabled={busy || !cart?.checkoutUrl}
                    className="uo-btn mt-4 w-full disabled:opacity-50"
                  >
                    Checkout &middot; {money(subtotal, currency)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-3 w-full text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/50 underline"
                  >
                    Keep shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
