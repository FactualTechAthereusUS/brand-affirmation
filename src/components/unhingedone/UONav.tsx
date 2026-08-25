import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { COLLECTIONS } from "./data";
import { IconBag, IconHeart, IconSearch, IconUser, UO_EASE, UO_EASE_STD } from "./uo";
import { useUOCart } from "@/lib/uo/cart";
import { cn } from "@/lib/utils";

const MARQUEE_ITEMS = ["Up to 70% Off", "Free Shipping on 2+ Items"] as const;
/** Comfrt duplicates the pair 10x so the loop never shows a seam. */
const MARQUEE_REPEATS = 10;

/**
 * Comfrt's header, cloned: a pausable announcement marquee on top, then a
 * three-slot row (drawer toggle / centred logo / icons) with the collection
 * menu inline on desktop. Copy and taxonomy are Unhinged One's.
 */
export function UONav() {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [solid, setSolid] = useState(false);
  const { count, setOpen: setCartOpen } = useUOCart();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        solid ? "border-ink/10 bg-canvas/92 backdrop-blur-md" : "border-transparent bg-canvas",
      )}
    >
      {/* ---------------------------------------------- announcement marquee */}
      <div className="relative overflow-hidden bg-[#0b0b0b] text-[#f2efe8]">
        <div className="uo-marquee">
          <ul
            className="uo-marquee-track"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {Array.from({ length: MARQUEE_REPEATS }).flatMap((_, r) =>
              MARQUEE_ITEMS.map((t) => (
                <li key={`${r}-${t}`} aria-hidden={r !== 0} className="uo-marquee-item">
                  {t}
                </li>
              )),
            )}
          </ul>
          <button
            type="button"
            aria-label={paused ? "Play announcements" : "Pause announcements"}
            onClick={() => setPaused((p) => !p)}
            className="uo-marquee-pause"
          >
            {paused ? (
              <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" aria-hidden="true">
                <path d="M4 2l14 8-14 8V2z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" aria-hidden="true">
                <rect x="3" y="2" width="5" height="16" />
                <rect x="12" y="2" width="5" height="16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------- header row */}
      <div className="mx-auto grid h-[62px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[74px] md:px-8">
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Open menu drawer"
            onClick={() => setOpen(true)}
            className="-ml-1 flex h-9 w-9 items-center justify-center lg:hidden"
          >
            <svg viewBox="0 0 18 16" fill="none" className="h-4 w-[18px]" aria-hidden="true">
              <path
                d="M1 .5a.5.5 0 100 1h15.71a.5.5 0 000-1H1zM.5 8a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1A.5.5 0 01.5 8zm0 7a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1a.5.5 0 01-.5-.5z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <a href="/unhingedone" className="justify-self-center" aria-label="Unhinged One home">
          <img src="/assets/uo-logo.png" alt="Unhinged One" width={100} className="h-[26px] w-auto md:h-[30px]" />
        </a>

        <div className="flex items-center justify-end gap-0.5 md:gap-1.5">
          <button type="button" aria-label="Search" className="uo-icon">
            <IconSearch className="h-[21px] w-[21px]" />
          </button>
          <a href="/unhingedone" aria-label="Account" className="uo-icon hidden sm:inline-flex">
            <IconUser className="h-[21px] w-[21px]" />
          </a>
          <a
            href="/unhingedone"
            aria-label="View wishlist"
            className="hidden items-center gap-1.5 pl-1 pr-2 md:inline-flex"
          >
            <IconHeart className="h-[19px] w-[19px]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">Wishlist</span>
          </a>
          <button type="button" aria-label="Open cart drawer" onClick={() => setCartOpen(true)} className="uo-icon relative">
            <IconBag className="h-[21px] w-[21px]" />
            <span className="absolute -right-0.5 -top-0.5 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-uo-red px-1 text-[9px] font-bold text-white">
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------- desktop primary menu */}
      <nav
        aria-label="Primary"
        className="mx-auto hidden max-w-[1440px] items-center justify-center gap-7 border-t border-ink/10 px-8 py-2.5 lg:flex"
      >
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

      {/* mobile drawer */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu drawer"
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
                <img src="/assets/uo-logo.png" alt="Unhinged One" className="h-[24px] w-auto" />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu drawer" className="uo-icon">
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
    </header>
  );
}
