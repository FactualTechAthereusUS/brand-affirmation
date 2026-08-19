import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT, Rise } from "@/components/pharmabro/motion";
import {
  PAIR_INTAKE,
  PAIR_MESSAGE,
  PAIR_PROVIDER,
  PAIR_REVENUE,
  PAIR_ROUTING,
  PAIR_RX,
} from "@/lib/pharmabro/home";
import { PhoneLoop } from "@/components/pharmabro/home/PhoneLoop";


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

const WORD_MS = 42;

function Dots() {
  return (
    <span className="mt-2 flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
          className="size-1.5 rounded-full bg-[color-mix(in_oklab,var(--color-ink)_25%,transparent)]"
        />
      ))}
    </span>
  );
}

function Typed({ text, shown }: { text: string; shown: number }) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <p className="mt-2 text-[13px] leading-[1.5] text-[color-mix(in_oklab,var(--color-ink)_75%,transparent)]">
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{ opacity: i < shown ? 1 : 0, transition: "opacity 240ms ease-out" }}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

const CARD =
  "rounded-2xl border border-[var(--color-hairline)] bg-white p-4 shadow-[0_1px_2px_rgba(15,18,40,0.05),0_14px_34px_-20px_rgba(15,18,40,0.35)]";

/**
 * Looping conversation: PharmaBro types, routes the case, then the licensed
 * provider replies with an approval. Mirrors the reference beat for beat.
 */
function MessageLoop() {
  const reduce = useReducedMotion();
  const brandWords = useMemo(() => PAIR_MESSAGE.split(" ").length, []);
  const provWords = useMemo(() => PAIR_PROVIDER.message.split(" ").length, []);

  const [stage, setStage] = useState(reduce ? 4 : 0);
  const [brandShown, setBrandShown] = useState(reduce ? brandWords : 0);
  const [provShown, setProvShown] = useState(reduce ? provWords : 0);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    const run = () => {
      if (cancelled) return;
      setStage(0);
      setBrandShown(0);
      setProvShown(0);

      // brand card starts typing
      at(900, () => setStage(1));
      const brandTyped = 900 + brandWords * WORD_MS;
      for (let i = 0; i < brandWords; i += 1) {
        at(900 + (i + 1) * WORD_MS, () => setBrandShown(i + 1));
      }
      // routing pill
      at(brandTyped + 500, () => setStage(2));
      // provider card appears with dots
      at(brandTyped + 1500, () => setStage(3));
      const provStart = brandTyped + 2500;
      at(provStart, () => setStage(4));
      for (let i = 0; i < provWords; i += 1) {
        at(provStart + (i + 1) * WORD_MS, () => setProvShown(i + 1));
      }
      const end = provStart + provWords * WORD_MS + 2600;
      at(end, () => setStage(5));
      at(end + 700, run);
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduce, brandWords, provWords]);

  const fade = { duration: 0.5, ease: PB_EASE_SOFT };
  const gone = stage === 5;

  return (
    <motion.div
      animate={{ opacity: gone ? 0 : 1 }}
      transition={fade}
      className="flex w-full max-w-[380px] flex-col gap-3"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={fade}
        className={CARD}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[var(--color-hairline)]">
            <img src="/assets/pharmabro-mark.png" alt="" className="size-3.5 object-contain" />
          </span>
          <span className="text-[13px] font-semibold text-ink">PharmaBro</span>
        </div>
        {stage === 0 ? <Dots /> : <Typed text={PAIR_MESSAGE} shown={brandShown} />}
      </motion.div>

      <motion.div
        animate={{
          opacity: stage >= 2 ? 1 : 0,
          y: stage >= 2 ? 0 : 12,
          scale: stage >= 2 ? 1 : 0.98,
        }}
        transition={fade}
        className="rounded-2xl px-4 py-3 text-white shadow-[0_16px_36px_-22px_rgba(27,78,245,0.9)]"
        style={{ backgroundColor: "var(--color-brand, #1B4EF5)" }}
      >
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em] text-[var(--color-brand,#1B4EF5)]">
            AI
          </span>
          <span className="text-[13px] font-semibold">PharmaBro routing</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[13px] font-medium">
          <span className="grid size-4 place-items-center rounded-full bg-white/95 text-[var(--color-brand,#1B4EF5)]">
            <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
          </span>
          {PAIR_ROUTING}
        </div>
      </motion.div>

      <motion.div
        animate={{
          opacity: stage >= 3 ? 1 : 0,
          y: stage >= 3 ? 0 : 12,
          scale: stage >= 3 ? 1 : 0.98,
        }}
        transition={fade}
        className={CARD}
      >
        <div className="flex items-center gap-2">
          <img
            src={PAIR_PROVIDER.avatar}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-6 shrink-0 rounded-full object-cover ring-1 ring-[var(--color-hairline)]"
          />
          <span className="text-[13px] font-semibold text-ink">{PAIR_PROVIDER.name}</span>
        </div>
        {stage >= 4 ? <Typed text={PAIR_PROVIDER.message} shown={provShown} /> : <Dots />}
      </motion.div>
    </motion.div>
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
