/**
 * Shared motion grammar for the self-running product loops on the PharmaBro
 * homepage (Keep patients on treatment, From checkout to recurring revenue).
 * White cards on a faint dotted stage, hairline borders, travelling connector
 * pulses, ticks that flip green, mono tickers.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

export const BRAND = "var(--color-brand, #1B4EF5)";
export const OK = "#3f9d5c";
export const WARN = "#c98a1b";

/** Steps `stage` 0..steps on a fixed cadence, holds the finished state, loops. */
export function useLoop(steps: number, ms: number, reduce: boolean | null, holdMs = 3400) {
  const [stage, setStage] = useState(reduce ? steps : 0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(
      () => setStage((s) => (s >= steps ? 0 : s + 1)),
      stage >= steps ? holdMs : ms,
    );
    return () => window.clearTimeout(id);
  }, [stage, steps, ms, holdMs, reduce]);
  return stage;
}

export function LoopCard({
  children,
  className,
  glow,
  show = true,
  reduce,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  show?: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
      transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
      className={cn(
        "relative rounded-2xl border border-[var(--color-hairline)] bg-white shadow-[0_1px_2px_rgba(15,18,40,0.04),0_16px_36px_-26px_rgba(15,18,40,0.35)]",
        className,
      )}
    >
      {glow ? (
        <motion.span
          aria-hidden
          animate={{ opacity: [0, 0.9, 0], scale: [1, 1.03, 1.05] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: `0 0 0 2px color-mix(in oklab, ${BRAND} 45%, transparent)` }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}

/** Vertical connector with a pulse travelling down it. */
export function Connector({ on, height = 24 }: { on: boolean; height?: number }) {
  return (
    <div aria-hidden className="relative mx-auto w-px" style={{ height }}>
      <motion.div
        animate={{ scaleY: on ? 1 : 0 }}
        transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
        className="absolute inset-0 origin-top bg-[color-mix(in_oklab,var(--color-ink)_14%,transparent)]"
      />
      {on ? (
        <motion.span
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: BRAND,
            boxShadow: `0 0 6px 1px color-mix(in oklab, ${BRAND} 45%, transparent)`,
          }}
        />
      ) : null}
    </div>
  );
}

export function SceneHeader({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid size-6 place-items-center rounded-md border border-[var(--color-hairline)] bg-white">
        <img src="/assets/pharmabro-mark.png" alt="" className="size-3.5 object-contain" />
      </span>
      <span className="text-[12px] font-semibold text-ink">PharmaBro</span>
      <span className="text-[11px] text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
        {label}
      </span>
      <span className="relative ml-auto grid size-2 place-items-center">
        <motion.span
          animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          className="absolute size-2 rounded-full"
          style={{ backgroundColor: `color-mix(in oklab, ${BRAND} 30%, transparent)` }}
        />
        <span className="relative size-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
      </span>
    </div>
  );
}

export function Chip({
  children,
  show = true,
  delay = 0,
}: {
  children: ReactNode;
  show?: boolean;
  delay?: number;
}) {
  return (
    <motion.span
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
      transition={{ duration: 0.4, delay, ease: PB_EASE_SOFT }}
      className="rounded-md bg-[color-mix(in_oklab,var(--color-ink)_5%,transparent)] px-1.5 py-0.5 text-[10px] font-medium text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]"
    >
      {children}
    </motion.span>
  );
}

export function Tick({ on, size = 16, tone = OK }: { on: boolean; size?: number; tone?: string }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full transition-colors duration-300"
      style={{
        width: size,
        height: size,
        backgroundColor: on ? tone : "color-mix(in oklab, var(--color-ink) 8%, transparent)",
      }}
    >
      <motion.span
        animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Check
          className="text-white"
          strokeWidth={3.5}
          style={{ width: size * 0.62, height: size * 0.62 }}
          aria-hidden
        />
      </motion.span>
    </span>
  );
}

/** Word-by-word reveal. `shown` is a word count. */
export function Typed({
  text,
  shown,
  className,
}: {
  text: string;
  shown: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <p
      className={cn(
        "text-[11.5px] leading-[1.5] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]",
        className,
      )}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{ opacity: i < shown ? 1 : 0, transition: "opacity 220ms ease-out" }}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/** Counts a number up whenever `on` flips true. */
export function Ticker({
  to,
  on,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  on: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) {
      setN(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to]);
  return (
    <span className={cn("pb-mono tabular-nums", className)}>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Neutral stand-in mark for logos we do not have files for yet. */
export function LogoStub({
  label,
  tone = "ink",
  className,
}: {
  label: string;
  tone?: "ink" | "brand";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-[var(--color-hairline)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em]",
        className,
      )}
      style={
        tone === "brand"
          ? { color: BRAND, backgroundColor: `color-mix(in oklab, ${BRAND} 7%, transparent)` }
          : {
              color: "color-mix(in oklab, var(--color-ink) 65%, transparent)",
              backgroundColor: "color-mix(in oklab, var(--color-ink) 4%, transparent)",
            }
      }
    >
      {label}
    </span>
  );
}

/** Inset corner brackets used on every stage. */
export function Corners() {
  const base =
    "pointer-events-none absolute size-3 border-[color-mix(in_oklab,var(--color-ink)_18%,transparent)]";
  return (
    <>
      <span aria-hidden className={cn(base, "left-3 top-3 border-l border-t")} />
      <span aria-hidden className={cn(base, "right-3 top-3 border-r border-t")} />
      <span aria-hidden className={cn(base, "bottom-3 left-3 border-b border-l")} />
      <span aria-hidden className={cn(base, "bottom-3 right-3 border-b border-r")} />
    </>
  );
}

/**
 * Dotted stage that scales its scene down on small screens so nothing clips.
 */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[22px] border border-[var(--color-hairline)] bg-[color-mix(in_oklab,var(--color-ink)_1.5%,white)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--color-ink) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <Corners />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-5 sm:px-6">
        <div className="origin-center scale-[0.72] sm:scale-[0.85] lg:scale-100">{children}</div>
      </div>
    </div>
  );
}
