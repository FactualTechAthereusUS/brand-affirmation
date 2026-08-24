import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CLAIM_CAP, CLAIMED } from "./data";
import { UO_EASE } from "./uo";

/**
 * Section 11 — persistent bottom-left tab, Comfrt's "Mystery Offer" slot.
 * Scarcity stays on screen; dismissable, and it appears after the hero.
 */
export function UOClaimTab() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);
  const pct = Math.round((CLAIMED / CLAIM_CAP) * 100);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && !closed ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: UO_EASE }}
          className="fixed bottom-4 left-4 z-40 w-[236px] bg-[#0b0b0b] px-3.5 py-3 text-[#f2efe8] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-start justify-between gap-2">
            <a href="#best-sellers" className="text-[10.5px] font-bold uppercase tracking-[0.16em]">
              {CLAIMED.toLocaleString()} / {CLAIM_CAP.toLocaleString()} claimed
            </a>
            <button
              type="button"
              onClick={() => setClosed(true)}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 p-1 text-[#f2efe8]/50 transition hover:text-[#f2efe8]"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="mt-2.5 h-[3px] w-full bg-[#f2efe8]/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, ease: UO_EASE, delay: 0.15 }}
              className="h-full bg-uo-red"
            />
          </div>
          <p className="mt-2 text-[10.5px] text-[#f2efe8]/50">Restock ships Oct 25</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
