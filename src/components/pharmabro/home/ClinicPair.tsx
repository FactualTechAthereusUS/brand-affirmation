import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT, Rise } from "@/components/pharmabro/motion";
import { PAIR_MESSAGE, PAIR_REVENUE, PAIR_RX } from "@/lib/pharmabro/home";

/** Four L shaped hairline ticks sitting just outside the panel edge. */
function CornerTicks() {
  const base =
    "absolute size-3 border-[color-mix(in_oklab,var(--color-ink)_22%,transparent)]";
  return (
    <span aria-hidden className="pointer-events-none absolute -inset-[3px] z-10">
      <span className={cn(base, "left-0 top-0 border-l border-t")} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

function Panel({
  children,
  ratio,
  bare = false,
}: {
  children: ReactNode;
  ratio?: string;
  bare?: boolean;
}) {
  return (
    <div className="relative">
      <CornerTicks />
      <div
        className={cn(
          "relative overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-mist)]",
          ratio ?? "aspect-[604/640] sm:aspect-[604/569]",
        )}
      >
        <div className={cn("absolute inset-0", !bare && "flex items-center justify-center px-4 py-4 sm:px-8 sm:py-6")}>
          {children}
        </div>
      </div>
    </div>
  );
}

const WORD_MS = 55;
const HOLD_MS = 1600;

/** Word by word provider message that loops forever. */
function MessageLoop() {
  const reduce = useReducedMotion();
  const words = useMemo(() => PAIR_MESSAGE.split(" "), []);
  const [shown, setShown] = useState(reduce ? words.length : 0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: number[] = [];

    const run = () => {
      if (cancelled) return;
      setVisible(true);
      setShown(0);
      words.forEach((_, i) => {
        timers.push(window.setTimeout(() => setShown(i + 1), (i + 1) * WORD_MS));
      });
      const typed = words.length * WORD_MS;
      timers.push(window.setTimeout(() => setVisible(false), typed + HOLD_MS));
      timers.push(window.setTimeout(run, typed + HOLD_MS + 700));
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduce, words]);

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-3">
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
        className="rounded-2xl border border-[var(--color-hairline)] bg-white p-4 shadow-[0_1px_2px_rgba(15,18,40,0.05),0_14px_34px_-20px_rgba(15,18,40,0.35)]"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[var(--color-hairline)]">
            <img src="/assets/pharmabro-mark.png" alt="" className="size-3.5 object-contain" />
          </span>
          <span className="text-[13px] font-semibold text-ink">PharmaBro</span>
        </div>
        <p className="mt-2 text-[13px] leading-[1.5] text-[color-mix(in_oklab,var(--color-ink)_75%,transparent)]">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              style={{
                opacity: i < shown ? 1 : 0,
                transition: "opacity 260ms ease-out",
              }}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </motion.div>
    </div>
  );
}

export function ClinicPair() {
  return (
    <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-2">
      <Rise className="flex flex-col gap-6">
        <Panel>
          <MessageLoop />
        </Panel>
        <div>
          <h3 className="text-[24px] font-normal leading-[1.05] tracking-[-0.02em] text-ink">
            {PAIR_RX.heading}
          </h3>
          <p className="pb-body mt-4 max-w-[460px] text-[16px] leading-[1.4]">{PAIR_RX.body}</p>
          <p className="mt-3 max-w-[460px] text-[12px] leading-[1.4] text-[color-mix(in_oklab,var(--color-ink)_42%,transparent)]">
            {PAIR_RX.fine}
          </p>
        </div>
      </Rise>

      <Rise delay={0.1} className="flex flex-col gap-6">
        <Panel ratio="aspect-[604/569]" bare>
          <div className="absolute inset-0 left-6 top-6 overflow-hidden rounded-tl-xl shadow-[0_6px_18px_rgba(0,0,0,0.12)] sm:left-8 sm:top-8">
            <img
              src={PAIR_REVENUE.image}
              alt="PharmaBro dashboard showing revenue, unit economics, and recurring revenue"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-left-top"
            />
          </div>
        </Panel>
        <div>
          <h3 className="text-[24px] font-normal leading-[1.05] tracking-[-0.02em] text-ink">
            {PAIR_REVENUE.heading}
          </h3>
          <p className="pb-body mt-4 max-w-[460px] text-[16px] leading-[1.4]">{PAIR_REVENUE.body}</p>
          <Link
            to="/pharmabro/platform/analytics"
            className="mt-4 inline-block text-[16px] text-ink underline underline-offset-2"
          >
            {PAIR_REVENUE.link}
            <span className="sr-only"> about revenue tracking</span>
          </Link>
        </div>
      </Rise>
    </div>
  );
}
