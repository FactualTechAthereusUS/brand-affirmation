import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";
import payKlarna from "@/assets/pay-klarna.png.asset.json";
import payAfterpay from "@/assets/pay-afterpay.png.asset.json";
import payAffirm from "@/assets/pay-affirm.png.asset.json";

type Props = {
  open: boolean;
  onDismiss: () => void;
  onTryAgain: () => void;
  onAlt: (method: "klarna" | "afterpay" | "affirm") => void;
};

/**
 * Inline payment failed card. Sits above the pay button on both checkouts.
 * Never a redirect. Never a modal. Keeps the user on the page.
 */
export function PaymentFailedInline({ open, onDismiss, onTryAgain, onAlt }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="mb-4 overflow-hidden rounded-2xl border border-[#F0C4C4] bg-[#FFF6F6] shadow-[0_10px_30px_-15px_rgba(238,114,115,0.35)]">
            <div className="flex items-start gap-3 p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ee7273]/12 text-[#ee7273]">
                <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[15px] font-bold text-ink">Payment not processed</div>
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink/40 transition hover:bg-black/5 hover:text-ink"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-ink/70">
                  Your card was declined. This can happen for a few reasons:
                </p>
                <ul className="mt-2 space-y-1 text-[13px] text-ink/70">
                  <li className="flex gap-2"><span className="text-[#ee7273]">·</span> Insufficient funds</li>
                  <li className="flex gap-2"><span className="text-[#ee7273]">·</span> Card restrictions on online or subscription purchases</li>
                  <li className="flex gap-2"><span className="text-[#ee7273]">·</span> Incorrect card details</li>
                </ul>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onTryAgain}
                    className="w-full rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-ink/90"
                  >
                    Try a different card
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: "klarna" as const, src: payKlarna.url, label: "Klarna" },
                      { k: "afterpay" as const, src: payAfterpay.url, label: "Afterpay" },
                      { k: "affirm" as const, src: payAffirm.url, label: "Affirm" },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.k}
                        onClick={() => onAlt(m.k)}
                        className="grid h-14 place-items-center rounded-xl border border-black/10 bg-white px-3 transition hover:border-black/20"
                      >
                        <img src={m.src} alt={m.label} className="max-h-8 w-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
