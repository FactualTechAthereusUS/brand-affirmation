import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { STATE_TILES, type RoofCard } from "@/lib/pharmabro/home";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

/* ---------------------------------------------------------------- primitives */

const shell =
  "relative overflow-hidden rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-mist)] p-4";

/** Steps 0..steps on a fixed cadence, holds the finished state, then loops. */
function useLoop(steps: number, ms = 1000, holdMs = 2600) {
  const reduce = useReducedMotion();
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

function Pill({
  children,
  tone = "neutral",
  active = true,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "blue";
  active?: boolean;
}) {
  const tones = {
    neutral: "border-[var(--color-hairline)] bg-canvas text-ink",
    green:
      "border-[color-mix(in_oklab,var(--color-check)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-check)_10%,white)] text-[var(--color-check)]",
    blue:
      "border-[color-mix(in_oklab,var(--color-marine)_28%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_9%,white)] text-[var(--color-marine)]",
  } as const;
  return (
    <motion.span
      animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.97 }}
      transition={{ duration: 0.4, ease: PB_EASE_SOFT }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </motion.span>
  );
}

/** Row that fades + slides in once `on`, with an optional value swap. */
function Row({ label, value, on = true }: { label: string; value: string; on?: boolean }) {
  return (
    <motion.div
      animate={{ opacity: on ? 1 : 0.28, y: on ? 0 : 5 }}
      transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
      className="flex items-center justify-between rounded-[10px] border border-[var(--color-hairline)] bg-canvas px-3 py-2"
    >
      <span className="pb-micro">{label}</span>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: PB_EASE_SOFT }}
        className="pb-mono text-[12.5px] font-medium text-ink"
      >
        {value}
      </motion.span>
    </motion.div>
  );
}

/** Horizontal arrow with a pulse travelling along it while active. */
function Arrow({ on }: { on: boolean }) {
  return (
    <span aria-hidden className="relative mx-1 h-px flex-1 min-w-[14px]">
      <span className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_14%,transparent)]" />
      {on ? (
        <motion.span
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-marine)]"
          style={{ boxShadow: "0 0 6px 1px color-mix(in oklab, var(--color-marine) 45%, transparent)" }}
        />
      ) : null}
    </span>
  );
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)]">
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: PB_EASE_SOFT }}
        className="h-full rounded-full bg-[var(--color-marine)]"
      />
    </div>
  );
}

/* ------------------------------------------------------------------- scenes */

function StripeVisual() {
  const stage = useLoop(3, 950);
  return (
    <div className={shell}>
      <div className="flex items-center justify-between gap-1">
        <Pill active={stage >= 0}>Card charged</Pill>
        <Arrow on={stage >= 1} />
        <Pill tone="blue" active={stage >= 1}>
          Routing
        </Pill>
        <Arrow on={stage >= 2} />
        <Pill tone="green" active={stage >= 2}>
          Your Stripe
        </Pill>
      </div>
      <div className="mt-3 space-y-2">
        <Row label="Settlement" value={stage >= 3 ? "Direct" : "Pending"} on={stage >= 2} />
        <Row label="PharmaBro cut" value="0%" on={stage >= 3} />
      </div>
    </div>
  );
}

function TokenVisual() {
  const stage = useLoop(3, 1000);
  const steps = ["Bills on", "Retry logic", "Recovered"];
  const values = ["Ship date", "Smart", "$24 avg"];
  return (
    <div className={shell}>
      <div className="flex items-center justify-between">
        <span className="pb-mono text-[13px] text-ink">Card ending 4242</span>
        <Pill tone="green" active={stage >= 1}>
          Tokenized
        </Pill>
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((s, i) => (
          <Row key={s} label={s} value={values[i]} on={stage >= i + 1} />
        ))}
      </div>
    </div>
  );
}

function StatesVisual() {
  const stage = useLoop(STATE_TILES.length, 34, 3200);
  return (
    <div className={shell}>
      <div className="grid grid-cols-10 gap-1">
        {STATE_TILES.map((s, i) => {
          const on = stage > i;
          return (
            <motion.span
              key={s}
              animate={{
                opacity: on ? 1 : 0.3,
                scale: on ? 1 : 0.82,
                backgroundColor: on
                  ? "color-mix(in oklab, var(--color-marine) 14%, white)"
                  : "color-mix(in oklab, var(--color-ink) 5%, white)",
              }}
              transition={{ duration: 0.32, ease: PB_EASE_SOFT }}
              className="grid h-5 place-items-center rounded-[3px] text-[7.5px] font-semibold text-[var(--color-marine)]"
            >
              {s}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Pill tone="blue" active={stage >= STATE_TILES.length}>
          50 states + D.C.
        </Pill>
        <Pill active={stage >= STATE_TILES.length}>Auto assignment</Pill>
      </div>
    </div>
  );
}

function ExportVisual() {
  const stage = useLoop(4, 900);
  const pct = [0, 34, 68, 100, 100][stage] ?? 0;
  return (
    <div className={shell}>
      <div className="rounded-[10px] border border-[var(--color-hairline)] bg-canvas px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="pb-mono text-[12.5px] text-ink">patient_data.csv</span>
          {stage >= 4 ? (
            <Pill tone="green">Ready</Pill>
          ) : (
            <span className="pb-mono text-[11.5px] text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
              {pct}%
            </span>
          )}
        </div>
        <div className="mt-2">
          <Bar pct={pct} />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Row label="Records" value="12,904" on={stage >= 1} />
        <Row label="Card tokens" value="Included" on={stage >= 2} />
        <Row label="Export window" value="24 hours" on={stage >= 3} />
      </div>
    </div>
  );
}

const BRANDS = [
  { n: "Blissley", v: "Weight loss" },
  { n: "Northline", v: "TRT" },
  { n: "Verawell", v: "Hair loss" },
];

function BrandsVisual() {
  const stage = useLoop(BRANDS.length, 1050);
  return (
    <div className={shell}>
      <div className="space-y-2">
        {BRANDS.map((b, i) => {
          const on = stage >= i + 1;
          return (
            <motion.div
              key={b.n}
              animate={{
                opacity: on ? 1 : 0.3,
                x: on ? 0 : -6,
                borderColor: on
                  ? "color-mix(in oklab, var(--color-marine) 30%, transparent)"
                  : "var(--color-hairline)",
              }}
              transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
              className="flex items-center gap-2.5 rounded-[10px] border bg-canvas px-3 py-2"
            >
              {/* logo placeholder, swap for brand marks */}
              <span className="grid size-5 shrink-0 place-items-center rounded-[5px] bg-[color-mix(in_oklab,var(--color-marine)_12%,white)] text-[9px] font-semibold text-[var(--color-marine)]">
                {b.n[0]}
              </span>
              <span className="text-[13px] font-medium text-ink">{b.n}</span>
              <span className="pb-micro ml-auto">{b.v}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-3">
        <Pill tone="blue" active={stage >= BRANDS.length}>
          One login, every brand
        </Pill>
      </div>
    </div>
  );
}

const POINTS = [8, 14, 12, 20, 26, 24, 34, 42, 48, 62];

function ScaleVisual() {
  const stage = useLoop(3, 1150);
  const reduce = useReducedMotion();
  const path = POINTS.map(
    (p, i) => `${i === 0 ? "M" : "L"} ${(i / (POINTS.length - 1)) * 100} ${70 - p}`,
  ).join(" ");
  const amount = [0, 18400, 31200, 42800][stage] ?? 42800;

  return (
    <div className={shell}>
      <div className="flex items-end justify-between">
        <div>
          <div className="pb-micro">Revenue MTD</div>
          <motion.div
            key={amount}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: PB_EASE_SOFT }}
            className="pb-mono mt-1 text-[20px] font-medium text-ink"
          >
            ${amount.toLocaleString()}
          </motion.div>
        </div>
        <Pill tone="green" active={stage >= 3}>
          +65%
        </Pill>
      </div>
      <svg viewBox="0 0 100 72" className="mt-3 h-16 w-full" preserveAspectRatio="none">
        <motion.path
          d={path}
          fill="none"
          stroke="var(--color-marine)"
          strokeWidth={2}
          strokeLinecap="round"
          animate={{ pathLength: Math.min(1, (stage + 1) / 4) }}
          transition={{ duration: 1, ease: PB_EASE_SOFT }}
        />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- public api */

/** Small looping coded visual per feature card. No fake photography. */
export function CardVisual({ kind }: { kind: RoofCard["visual"] }) {
  if (kind === "stripe") return <StripeVisual />;
  if (kind === "token") return <TokenVisual />;
  if (kind === "states") return <StatesVisual />;
  if (kind === "export") return <ExportVisual />;
  if (kind === "brands") return <BrandsVisual />;
  return <ScaleVisual />;
}
