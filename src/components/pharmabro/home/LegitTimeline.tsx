import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { LEGIT_BARS } from "@/lib/pharmabro/home";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

/* LegitScript lockup, drawn as a mark plus wordmark so it stays crisp at any size */
export function LegitScriptMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-[1.5em] w-[1.5em] shrink-0" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="var(--color-marine)" />
        <path
          d="M9.5 16.6l4.3 4.3 8.7-9"
          fill="none"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[1em] font-medium leading-none tracking-[-0.03em] text-ink">
        Legit<span className="text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">Script</span>
      </span>
      <span className="sr-only">LegitScript certified</span>
    </span>
  );
}

const TICKS = [0, 1, 2, 3, 4, 5, 6];

export function LegitTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative border border-[var(--color-hairline)] bg-canvas px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-7 lg:px-10 lg:pb-10 lg:pt-8"
    >
      <p className="pb-micro mb-8 sm:mb-10">Time to LegitScript certification</p>

      <div
        role="img"
        aria-label="Timeline comparing LegitScript approval times. Fastest with PharmaBro: 3 days. Average with PharmaBro: 7 to 14 days. Industry standard on your own: 3 to 6 months."
      >
        <div className="relative">
          {/* month gridlines */}
          <div aria-hidden className="absolute inset-0">
            {TICKS.map((t) => (
              <span
                key={t}
                className="absolute inset-y-0 border-l"
                style={{
                  left: `${(t / 6) * 100}%`,
                  borderColor:
                    t === 0
                      ? "color-mix(in oklab, var(--color-ink) 20%, transparent)"
                      : "color-mix(in oklab, var(--color-ink) 7%, transparent)",
                }}
              />
            ))}
          </div>

          <div className="relative space-y-7 py-1 sm:space-y-8">
            {LEGIT_BARS.map((b, i) => {
              const delay = reduce ? 0 : 0.15 + i * 0.2;
              return (
                <div key={b.label}>
                  <div className="flex flex-wrap items-baseline gap-x-2 pl-2 sm:pl-3">
                    <span className="text-[14px] font-medium tracking-[-0.02em] text-ink">
                      {b.label}
                    </span>
                    <span className="text-[13px] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
                      {b.note}
                    </span>
                  </div>

                  <div className="mt-2 flex h-6 items-center gap-3 sm:h-7">
                    <motion.div
                      className="relative flex h-full shrink-0 origin-left overflow-hidden"
                      style={{ width: `${b.pct}%`, minWidth: 6 }}
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.9,
                        delay,
                        ease: PB_EASE_SOFT,
                      }}
                    >
                      {b.brand ? (
                        <>
                          <span
                            className="h-full bg-[var(--color-marine)]"
                            style={{ width: b.split ? "50%" : "100%" }}
                          />
                          {b.split ? (
                            <span className="h-full w-1/2 bg-[color-mix(in_oklab,var(--color-marine)_25%,transparent)]" />
                          ) : null}
                        </>
                      ) : (
                        <>
                          <span className="h-full w-1/2 bg-[color-mix(in_oklab,var(--color-ink)_18%,transparent)]" />
                          <span
                            className="h-full w-1/2"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(-45deg, color-mix(in oklab, var(--color-ink) 16%, transparent) 0, color-mix(in oklab, var(--color-ink) 16%, transparent) 1px, transparent 1px, transparent 6px)",
                            }}
                          />
                        </>
                      )}

                      {!b.brand ? (
                        <motion.span
                          className="pb-mono absolute inset-y-0 right-3 flex items-center whitespace-nowrap text-[13px] text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]"
                          initial={{ opacity: 0 }}
                          animate={inView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.5, delay: delay + 0.9 }}
                        >
                          {b.value}
                        </motion.span>
                      ) : null}
                    </motion.div>

                    {b.brand ? (
                      <motion.span
                        className="pb-mono whitespace-nowrap text-[13px] text-[var(--color-marine)]"
                        initial={{ opacity: 0, x: -4 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
                        transition={{ duration: reduce ? 0 : 0.5, delay: delay + 0.9 }}
                      >
                        {b.value}
                      </motion.span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* month scale */}
        <div
          aria-hidden
          className="pb-mono relative mt-3 h-4 text-[11px] uppercase tracking-[0.04em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]"
        >
          {TICKS.map((t) => (
            <span
              key={t}
              className={[
                "absolute whitespace-nowrap",
                t === 0 ? "left-0" : t === 6 ? "left-full -translate-x-full" : "-translate-x-1/2",
                t !== 0 && t !== 3 && t !== 6 ? "hidden sm:block" : "",
              ].join(" ")}
              style={t === 0 || t === 6 ? undefined : { left: `${(t / 6) * 100}%` }}
            >
              {t === 0 ? "Day 0" : `${t} mo`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
