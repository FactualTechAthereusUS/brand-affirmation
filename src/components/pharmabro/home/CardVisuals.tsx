/**
 * Looping scene animations for the six "everything under one roof" cards.
 * Same grammar as RetentionLoops: a staged cadence loop, hairline white cards,
 * travelling connector pulses, ticks that flip on stage, reduced-motion safe.
 *
 * Logo placeholders: Stripe wordmark, Visa/Mastercard marks and the demo brand
 * wordmarks are drawn as neutral marks until real assets land.
 */
import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  Check,
  CreditCard,
  Download,
  Globe,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STATE_TILES, type RoofCard } from "@/lib/pharmabro/home";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

const BRAND = "var(--color-marine, #1B4EF5)";
const OK = "#3f9d5c";
const DIM = "color-mix(in oklab, var(--color-ink) 50%, transparent)";

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

/* ---------------------------------------------------------------- primitives */

/** The card stage: dotted field, hairline frame, corner brackets, centred scene. */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[236px] w-full items-center justify-center overflow-hidden rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-mist)] sm:min-h-[248px]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--color-ink) 13%, transparent) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-b border-l", "right-2 bottom-2 border-b border-r"].map(
        (c) => (
          <span
            key={c}
            aria-hidden
            className={cn(
              "pointer-events-none absolute size-3 border-[color-mix(in_oklab,var(--color-ink)_22%,transparent)]",
              c,
            )}
          />
        ),
      )}
      <div className="relative flex w-full items-center justify-center px-4 py-5">
        <div className="w-[280px] origin-center scale-[0.86] sm:scale-[0.92]">{children}</div>
      </div>
    </div>
  );
}

function Panel({
  children,
  className,
  show = true,
  glow,
  reduce,
}: {
  children: ReactNode;
  className?: string;
  show?: boolean;
  glow?: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: show ? 1 : 0.25, y: show ? 0 : 10 }}
      transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
      className={cn(
        "relative rounded-[14px] border border-[var(--color-hairline)] bg-white shadow-[0_1px_2px_rgba(15,18,40,0.04),0_14px_32px_-24px_rgba(15,18,40,0.4)]",
        className,
      )}
    >
      {glow && !reduce ? (
        <motion.span
          aria-hidden
          animate={{ opacity: [0, 0.85, 0], scale: [1, 1.03, 1.05] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 rounded-[14px]"
          style={{ boxShadow: `0 0 0 2px color-mix(in oklab, ${BRAND} 42%, transparent)` }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}

function Connector({ on, height = 22, reduce }: { on: boolean; height?: number; reduce: boolean | null }) {
  return (
    <div aria-hidden className="relative mx-auto w-px" style={{ height }}>
      <motion.div
        animate={{ scaleY: on ? 1 : 0 }}
        transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
        className="absolute inset-0 origin-top bg-[color-mix(in_oklab,var(--color-ink)_14%,transparent)]"
      />
      {on && !reduce ? (
        <motion.span
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: BRAND, boxShadow: `0 0 6px 1px color-mix(in oklab, ${BRAND} 45%, transparent)` }}
        />
      ) : null}
    </div>
  );
}

function Tick({ on, size = 16 }: { on: boolean; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full transition-colors duration-300"
      style={{
        width: size,
        height: size,
        backgroundColor: on ? OK : "color-mix(in oklab, var(--color-ink) 8%, transparent)",
      }}
    >
      <motion.span animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0 }} transition={{ duration: 0.3 }}>
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

function Chip({
  children,
  tone = "brand",
  show = true,
}: {
  children: ReactNode;
  tone?: "brand" | "ok" | "mute";
  show?: boolean;
}) {
  const styles =
    tone === "ok"
      ? { color: OK, borderColor: `color-mix(in oklab, ${OK} 32%, transparent)`, background: `color-mix(in oklab, ${OK} 7%, white)` }
      : tone === "brand"
        ? { color: BRAND, borderColor: `color-mix(in oklab, ${BRAND} 26%, transparent)`, background: `color-mix(in oklab, ${BRAND} 6%, white)` }
        : { color: DIM, borderColor: "var(--color-hairline)", background: "white" };
  return (
    <motion.span
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.94 }}
      transition={{ duration: 0.4, ease: PB_EASE_SOFT }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight"
      style={styles}
    >
      {children}
    </motion.span>
  );
}

function SceneHeader({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="grid size-5 place-items-center rounded-md border border-[var(--color-hairline)] bg-white">
        <img src="/assets/pharmabro-mark.png" alt="" className="size-3 object-contain" />
      </span>
      <span className="text-[11px] font-semibold text-ink">PharmaBro</span>
      <span className="text-[10.5px]" style={{ color: DIM }}>
        {label}
      </span>
      <span className="ml-auto">{right}</span>
    </div>
  );
}

/** Neutral logo placeholder mark, replaced once real wordmarks land. */
function LogoMark({ letter, active }: { letter: string; active?: boolean }) {
  return (
    <span
      className="grid size-6 shrink-0 place-items-center rounded-[7px] text-[11px] font-bold transition-colors duration-300"
      style={{
        color: active ? "white" : DIM,
        background: active ? BRAND : "color-mix(in oklab, var(--color-ink) 6%, transparent)",
      }}
    >
      {letter}
    </span>
  );
}

function useCount(to: number, on: boolean, ms = 900) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce) return setV(on ? to : 0);
    if (!on) return setV(0);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to, ms, reduce]);
  return v;
}

/* --------------------------------------------------------- 1 stripe payout rail */

function StripeLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(4, 1000);
  const amount = useCount(249, stage >= 3);

  return (
    <Stage>
      <SceneHeader
        label="Payout rail"
        right={<Chip tone="ok" show={stage >= 4}>Settled</Chip>}
      />

      <Panel reduce={reduce} className="flex items-center gap-2.5 px-3 py-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full ring-1 ring-[var(--color-hairline)]">
          <CreditCard className="size-3.5" style={{ color: BRAND }} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold leading-tight text-ink">
            Patient card charged
          </span>
          <span className="pb-mono block truncate text-[10px] leading-tight" style={{ color: DIM }}>
            #PB-8241 · GLP-1 · monthly
          </span>
        </span>
        <Chip tone="brand" show={stage >= 1}>$249.00</Chip>
      </Panel>

      <Connector on={stage >= 2} reduce={reduce} />

      <Panel reduce={reduce} show={stage >= 2} glow={stage === 2} className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="grid h-5 items-center rounded-[5px] px-1.5 text-[9.5px] font-bold text-white"
            style={{ background: "#635bff" }}
          >
            stripe
          </span>
          <span className="text-[12px] font-semibold text-ink">Your account</span>
          <span className="pb-mono ml-auto text-[13px] font-semibold tabular-nums text-ink">
            ${amount}.00
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)]">
          <motion.div
            animate={{ scaleX: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 0.9, ease: PB_EASE_SOFT }}
            className="h-full origin-left rounded-full"
            style={{ background: BRAND }}
          />
        </div>
      </Panel>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px]" style={{ color: DIM }}>
          PharmaBro cut
        </span>
        <Chip tone="ok" show={stage >= 3}>
          <Tick on={stage >= 3} size={11} /> 0%
        </Chip>
      </div>
    </Stage>
  );
}

/* -------------------------------------------------------- 2 rebill / token engine */

const TOKEN_STEPS = [
  { label: "Card tokenized", meta: "Vaulted, never stored raw" },
  { label: "Billed on ship date", meta: "One-time charge, not a sub" },
  { label: "Decline auto-retried", meta: "Account updater + smart retry" },
];

function TokenLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(4, 1000);

  return (
    <Stage>
      <SceneHeader label="Rebill engine" right={<Chip tone="ok" show={stage >= 4}>Recovered</Chip>} />

      <Panel reduce={reduce} className="flex items-center gap-2.5 px-3 py-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-[6px] bg-[color-mix(in_oklab,var(--color-ink)_6%,transparent)] text-[9px] font-bold" style={{ color: DIM }}>
          {stage >= 1 ? "TOK" : "4242"}
        </span>
        <span className="pb-mono min-w-0 flex-1 text-[11.5px] text-ink">
          {stage >= 1 ? "tok_1PbR•••4242" : "•••• •••• •••• 4242"}
        </span>
        <Chip tone={stage >= 1 ? "ok" : "mute"} show>
          {stage >= 1 ? "Vaulted" : "Raw"}
        </Chip>
      </Panel>

      <div className="mt-2 space-y-1.5">
        {TOKEN_STEPS.map((s, i) => (
          <Panel key={s.label} reduce={reduce} show={stage >= i + 1} className="flex items-center gap-2.5 px-3 py-2">
            {i === 2 && stage === 3 && !reduce ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="grid size-4 place-items-center"
              >
                <RefreshCw className="size-4" style={{ color: BRAND }} aria-hidden />
              </motion.span>
            ) : (
              <Tick on={stage >= i + 1} />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-semibold leading-tight text-ink">{s.label}</span>
              <span className="block truncate text-[10px] leading-tight" style={{ color: DIM }}>
                {s.meta}
              </span>
            </span>
            {i === 2 ? <Chip tone="ok" show={stage >= 4}>$24 avg</Chip> : null}
          </Panel>
        ))}
      </div>
    </Stage>
  );
}

/* ----------------------------------------------------------------- 3 all states */

function StatesLoop() {
  const reduce = useReducedMotion();
  const tiles = STATE_TILES;
  const stage = useLoop(3, 1100, 3000);
  const filled = reduce || stage >= 1;
  const count = useCount(tiles.length, filled, 1200);

  return (
    <Stage>
      <SceneHeader
        label="Provider coverage"
        right={
          <span className="pb-mono text-[10px] font-semibold tabular-nums" style={{ color: BRAND }}>
            {count}/{tiles.length}
          </span>
        }
      />

      <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-[3px]">
        {tiles.map((t, i) => (
          <motion.span
            key={t}
            initial={false}
            animate={{
              opacity: filled ? 1 : 0.3,
              backgroundColor: filled
                ? `color-mix(in oklab, ${BRAND} ${18 + ((i * 7) % 24)}%, white)`
                : "color-mix(in oklab, var(--color-ink) 5%, transparent)",
            }}
            transition={{ duration: 0.45, delay: reduce ? 0 : (i % 13) * 0.02 + Math.floor(i / 13) * 0.06, ease: PB_EASE_SOFT }}
            className="aspect-square rounded-[3px]"
            title={t}
          />
        ))}
      </div>

      <Panel reduce={reduce} show={stage >= 2} className="mt-3 flex items-center gap-2.5 px-3 py-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full ring-1 ring-[var(--color-hairline)]">
          <Stethoscope className="size-3.5" style={{ color: BRAND }} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold leading-tight text-ink">
            In-state provider matched
          </span>
          <span className="block truncate text-[10px] leading-tight" style={{ color: DIM }}>
            Auto assignment, 50 states + D.C.
          </span>
        </span>
        <Chip tone="ok" show={stage >= 3}>Licensed</Chip>
      </Panel>
    </Stage>
  );
}

/* ------------------------------------------------------------------- 4 export */

const EXPORT_FILES = [
  { name: "patients.csv", meta: "12,904 records" },
  { name: "orders.csv", meta: "38,210 records" },
  { name: "card_tokens.csv", meta: "9,748 tokens" },
];

function ExportLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(4, 900);
  const pct = useCount(100, stage >= 3, 900);

  return (
    <Stage>
      <SceneHeader label="Data export" right={<Chip tone="ok" show={stage >= 4}>Ready in 24h</Chip>} />

      <div className="space-y-1.5">
        {EXPORT_FILES.map((f, i) => (
          <Panel key={f.name} reduce={reduce} show={stage >= i + 1} className="flex items-center gap-2.5 px-3 py-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-[7px] bg-[color-mix(in_oklab,var(--color-ink)_5%,transparent)]">
              <Download className="size-3.5" style={{ color: BRAND }} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="pb-mono block truncate text-[11.5px] font-semibold leading-tight text-ink">
                {f.name}
              </span>
              <span className="block truncate text-[10px] leading-tight" style={{ color: DIM }}>
                {f.meta}
              </span>
            </span>
            <Tick on={stage >= i + 1} />
          </Panel>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)]">
          <motion.div
            animate={{ scaleX: stage >= 3 ? 1 : stage / 4 }}
            transition={{ duration: 0.7, ease: PB_EASE_SOFT }}
            className="h-full origin-left rounded-full"
            style={{ background: BRAND }}
          />
        </div>
        <span className="pb-mono text-[10.5px] font-semibold tabular-nums" style={{ color: BRAND }}>
          {pct}%
        </span>
        <ShieldCheck className="size-3.5" style={{ color: OK }} aria-hidden />
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------- 5 brands */

const BRANDS = [
  { letter: "B", name: "Blissley", vertical: "Weight loss", domain: "get.blissley.com" },
  { letter: "N", name: "Northline", vertical: "TRT", domain: "care.northline.co" },
  { letter: "V", name: "Verawell", vertical: "Hair loss", domain: "app.verawell.com" },
];

function BrandsLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(3, 1500, 1500);
  const active = reduce ? 0 : stage % BRANDS.length;
  const domain = BRANDS[active].domain;

  return (
    <Stage>
      <SceneHeader label="Brand switcher" right={<Chip tone="brand">One login</Chip>} />

      <div className="space-y-1.5">
        {BRANDS.map((b, i) => (
          <Panel
            key={b.name}
            reduce={reduce}
            glow={i === active}
            className="flex items-center gap-2.5 px-3 py-2"
          >
            <LogoMark letter={b.letter} active={i === active} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-semibold leading-tight text-ink">{b.name}</span>
              <span className="block truncate text-[10px] leading-tight" style={{ color: DIM }}>
                {b.vertical}
              </span>
            </span>
            <Chip tone={i === active ? "ok" : "mute"} show>
              {i === active ? "Active" : "Live"}
            </Chip>
          </Panel>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-white px-3 py-1.5">
        <Globe className="size-3.5 shrink-0" style={{ color: BRAND }} aria-hidden />
        <span className="pb-mono min-w-0 flex-1 truncate text-[10.5px] text-ink">
          {domain.split("").map((c, i) => (
            <motion.span
              key={`${domain}-${i}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.12, delay: i * 0.025 }}
            >
              {c}
            </motion.span>
          ))}
        </span>
        <Tick on size={12} />
      </div>
    </Stage>
  );
}

/* -------------------------------------------------------------------- 6 scale */

const BARS = [22, 34, 41, 55, 68, 82, 100];
const MONTHS = ["M1", "M2", "M3", "M4", "M5", "M6", "M7"];

function ScaleLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(BARS.length, 480, 2600);
  const grown = reduce ? BARS.length : stage;
  const mrr = useCount(42800, grown >= BARS.length, 1000);
  const patients = useCount(5000, grown >= BARS.length, 1200);

  return (
    <Stage>
      <SceneHeader
        label="Growth"
        right={
          <Chip tone="ok" show={grown >= BARS.length}>
            <TrendingUp className="size-3" aria-hidden /> +65%
          </Chip>
        }
      />

      <Panel reduce={reduce} className="px-3 py-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="pb-mono text-[16px] font-semibold tabular-nums text-ink">
            ${mrr.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.08em]" style={{ color: DIM }}>
            MRR
          </span>
        </div>
        <div className="mt-2.5 flex h-[62px] items-end gap-[6px]">
          {BARS.map((h, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              <motion.div
                initial={false}
                animate={{ height: i < grown ? `${h}%` : "6%", opacity: i < grown ? 1 : 0.35 }}
                transition={{ duration: 0.55, ease: PB_EASE_SOFT }}
                className="w-full rounded-[3px]"
                style={{
                  background:
                    i === BARS.length - 1
                      ? BRAND
                      : `color-mix(in oklab, ${BRAND} ${34 + i * 7}%, white)`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between">
          {MONTHS.map((m) => (
            <span key={m} className="pb-mono text-[8.5px]" style={{ color: DIM }}>
              {m}
            </span>
          ))}
        </div>
      </Panel>

      <div className="mt-2 flex items-center gap-2">
        <span className="pb-mono text-[11px] font-semibold tabular-nums text-ink">100</span>
        <ArrowDown className="size-3 -rotate-90" style={{ color: DIM }} aria-hidden />
        <span className="pb-mono text-[11px] font-semibold tabular-nums" style={{ color: BRAND }}>
          {patients.toLocaleString("en-US")}
        </span>
        <span className="text-[10px]" style={{ color: DIM }}>
          patients, same stack
        </span>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------------------- entry */

export function CardVisual({ kind }: { kind: RoofCard["visual"] }) {
  switch (kind) {
    case "stripe":
      return <StripeLoop />;
    case "token":
      return <TokenLoop />;
    case "states":
      return <StatesLoop />;
    case "export":
      return <ExportLoop />;
    case "brands":
      return <BrandsLoop />;
    case "scale":
    default:
      return <ScaleLoop />;
  }
}
