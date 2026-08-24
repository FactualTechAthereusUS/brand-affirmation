import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { COLLECTIONS } from "./data";
import { IconBag, IconHeart, IconSearch, IconUser, UO_EASE, UO_EASE_STD } from "./uo";
import { useUOCart } from "@/lib/uo/cart";
import { cn } from "@/lib/utils";

/**
 * Section 2 — nav by collection, not product type. One garment, many payloads,
 * so the taxonomy is the joke, not the silhouette.
 */
export function UONav() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lock = open || cart;
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, cart]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        solid ? "border-ink/10 bg-canvas/92 backdrop-blur-md" : "border-transparent bg-canvas",
      )}
    >
      <div className="mx-auto flex h-[58px] max-w-[1440px] items-center gap-4 px-4 md:h-[68px] md:px-8">
        {/* burger (mobile) */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="-ml-1 flex h-9 w-9 items-center justify-center lg:hidden"
        >
          <span className="relative block h-[10px] w-[19px]">
            <span className="absolute inset-x-0 top-0 h-[1.6px] bg-ink" />
            <span className="absolute inset-x-0 bottom-0 h-[1.6px] bg-ink" />
          </span>
        </button>

        <a href="/unhingedone" className="uo-display shrink-0 text-[16px] leading-none tracking-[0.02em] md:text-[19px]">
          UNHINGED ONE
        </a>

        <nav className="ml-6 hidden flex-1 items-center gap-6 lg:flex">
          {COLLECTIONS.map((c) => (
            <a
              key={c.slug}
              href={`/unhingedone#${c.slug}`}
              className="uo-link text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/75"
            >
              {c.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:gap-3">
          <button type="button" aria-label="Search" className="uo-icon">
            <IconSearch className="h-[19px] w-[19px]" />
          </button>
          <button type="button" aria-label="Account" className="uo-icon hidden sm:inline-flex">
            <IconUser className="h-[19px] w-[19px]" />
          </button>
          <button type="button" aria-label="Wishlist" className="uo-icon hidden sm:inline-flex">
            <IconHeart className="h-[19px] w-[19px]" />
          </button>
          <button type="button" aria-label="Cart" onClick={() => setCart(true)} className="uo-icon relative">
            <IconBag className="h-[19px] w-[19px]" />
            <span className="absolute -right-0.5 -top-0.5 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-uo-red px-1 text-[9px] font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: UO_EASE }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-[380px] flex-col bg-canvas px-6 pb-8 pt-5 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="uo-display text-[16px]">UNHINGED ONE</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="uo-icon">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <nav className="mt-8 flex flex-col">
                {COLLECTIONS.map((c, i) => (
                  <motion.a
                    key={c.slug}
                    href={`/unhingedone#${c.slug}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 + i * 0.05, ease: UO_EASE_STD }}
                    className="uo-display border-b border-ink/10 py-4 text-[26px] leading-none"
                  >
                    {c.label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto space-y-3 pt-8 text-[12px] uppercase tracking-[0.14em] text-ink/55">
                <p>Account</p>
                <p>Wishlist</p>
                <p>Track order</p>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* cart drawer */}
      <AnimatePresence>
        {cart ? (
          <>
            <motion.button
              type="button"
              aria-label="Close cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setCart(false)}
              className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: UO_EASE }}
              className="fixed inset-y-0 right-0 z-50 flex w-[92%] max-w-[420px] flex-col bg-canvas"
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Your bag (0)</span>
                <button type="button" onClick={() => setCart(false)} aria-label="Close" className="uo-icon">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="bg-[#0b0b0b] px-6 py-2.5 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#f2efe8]">
                Add 2 items for free shipping
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="uo-display text-[26px] leading-none">Nothing in here yet</p>
                <p className="text-[13px] text-ink/55">
                  Nobody buys one. The matching set is the whole point.
                </p>
                <button
                  type="button"
                  onClick={() => setCart(false)}
                  className="uo-btn mt-2 w-full max-w-[260px]"
                >
                  Shop the drop
                </button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
