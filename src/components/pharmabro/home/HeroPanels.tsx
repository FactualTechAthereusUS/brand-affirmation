/**
 * Hero product-highlight panels. Four self-running scenes that sit inside the
 * bordered tab shell under the hero copy: stacked dashboard screenshots, the
 * live US coverage map, a pharmacy fulfillment timeline loop, and a compliance
 * card stack loop. Motion follows the shared PharmaBro grammar (soft eases,
 * short travel, green ticks) so it reads like the rest of the page.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ClipboardCheck,
  Package,
  RefreshCw,
  Send,
  ShieldCheck,
  Stethoscope,
  Truck,
  Check,
  CircleCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";
import { BRAND, OK, useLoop } from "./loopKit";
import { UsProviderMap } from "./UsProviderMap";

/* ------------------------------------------------------- shared shell bits */

function DotGrid() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklab, var(--color-ink) 9%, transparent) 1px, transparent 1px)",
        backgroundSize: "15px 15px",
      }}
    />
  );
}

function Wash({ tone = BRAND }: { tone?: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(60% 60% at 50% 55%, color-mix(in oklab, ${tone} 12%, transparent), transparent 72%)`,
      }}
    />
  );
}

/* --------------------------------------------------- 1 end to end operations */

function OperationsPanel() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_2%,white)]"
      />
      <DotGrid />
      <Wash />
      <div className="absolute inset-0">
        <motion.img
          src="/assets/pharmabro-dashboard.png"
          alt="PharmaBro operations dashboard showing the full patient pipeline"
          loading="eager"
          decoding="async"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: PB_EASE_SOFT }}
          className="h-full w-full object-cover object-left-top sm:object-contain sm:object-top"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------ 2 providers in all 50 states */

const PROVIDER_TICKER = [
  { state: "Texas", who: "Dr. M. Alvarez, MD", note: "matched in 38s" },
  { state: "Ohio", who: "J. Reed, NP", note: "matched in 22s" },
  { state: "Florida", who: "Dr. K. Osei, DO", note: "matched in 41s" },
  { state: "California", who: "Dr. L. Nguyen, MD", note: "matched in 29s" },
];

function ProvidersPanel() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % PROVIDER_TICKER.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [reduce]);
  const row = PROVIDER_TICKER[i];
  return (
    <div className="absolute inset-0">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_2%,white)]"
      />
      <DotGrid />
      <Wash />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-3 pb-14 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
        <UsProviderMap className="h-full w-full max-w-[900px]" />
      </div>

      {/* Coverage counters */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
        {[
          { k: "50 / 50", v: "states licensed" },
          { k: "1,240+", v: "providers on call" },
          { k: "< 60s", v: "avg. match time" },
        ].map((s, n) => (
          <motion.div
            key={s.k}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + n * 0.09, ease: PB_EASE_SOFT }}
            className="rounded-lg border border-[var(--color-hairline)] bg-white/85 px-2.5 py-1.5 backdrop-blur"
          >
            <div className="text-[13px] font-medium leading-none text-ink">{s.k}</div>
            <div className="pb-body mt-1 text-[10px] uppercase tracking-[0.08em]">{s.v}</div>
          </motion.div>
        ))}
      </div>

      {/* Live match ticker */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[268px]">
        <div className="rounded-xl border border-[var(--color-hairline)] bg-white/90 p-2.5 shadow-[0_10px_30px_-14px_rgba(15,18,40,0.35)] backdrop-blur">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[var(--color-marine)] pb-map-pulse" />
            <span className="pb-body text-[10px] uppercase tracking-[0.1em]">
              Live provider matching
            </span>
          </div>
          <motion.div
            key={row.state}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: PB_EASE_SOFT }}
            className="mt-2 flex items-center gap-2"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-marine)_12%,white)]">
              <Stethoscope className="size-3.5 text-[var(--color-marine)]" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-medium text-ink">
                {row.who}
              </span>
              <span className="pb-body block truncate text-[10.5px]">
                {row.state} patient · {row.note}
              </span>
            </span>
            <CircleCheck className="ml-auto size-4 shrink-0" style={{ color: OK }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ 3 pharmacy fulfillment */

const FULFILL_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Patient approved",
    sub: "Rx signed by a licensed provider",
    time: "16:41:33",
  },
  {
    icon: Send,
    title: "Sent to pharmacy",
    sub: "Routed inside the PharmaBro network",
    time: "16:41:38",
  },
  {
    icon: Package,
    title: "Compounded and labeled",
    sub: "Filled, labeled, cold packed",
    time: "16:41:43",
  },
  {
    icon: Truck,
    title: "Shipped",
    sub: "Tracking pushed to the patient portal",
    time: "16:41:51",
  },
] as const;

function FulfillmentPanel() {
  const reduce = useReducedMotion();
  const stage = useLoop(FULFILL_STEPS.length, 1150, reduce, 2600);
  const done = stage >= FULFILL_STEPS.length;

  return (
    <div className="absolute inset-0">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_2%,white)]"
      />
      <DotGrid />
      <Wash tone={OK} />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: PB_EASE_SOFT }}
          className="relative w-full max-w-[330px] overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white/95 shadow-[0_1px_2px_rgba(15,18,40,0.06),0_28px_70px_-28px_rgba(15,18,40,0.4)] backdrop-blur-[2px] sm:max-w-[360px] lg:max-w-[400px]"
        >
          <div className="flex items-center gap-2 border-b border-[var(--color-hairline)] bg-white/80 px-3.5 py-2 sm:py-2.5 lg:px-4 lg:py-3">
            <img
              src="/assets/pharmabro-mark.png"
              alt=""
              className="size-4 shrink-0 object-contain"
            />
            <span className="truncate text-[13px] font-semibold text-ink">Fulfillment</span>
            <span className="hidden pb-dim sm:inline">·</span>
            <span className="pb-mono hidden truncate text-[11px] tabular-nums text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)] sm:inline">
              Order #PB-2481
            </span>
          </div>

          <div className="relative px-3.5 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
            <div className="relative">
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink sm:text-[15px] lg:text-[16px]">
                Pharmacy fulfillment
              </h3>
              <p className="pb-body mt-1 text-[10.5px] leading-snug sm:text-[11px] lg:text-[11.5px]">
                One order from approval to doorstep, every step run by PharmaBro under your
                brand.
              </p>
            </div>

            <motion.div
              animate={{ opacity: done ? 1 : 0.45 }}
              transition={{ duration: 0.4 }}
              className="relative mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 sm:mt-3.5 sm:py-2"
              style={{
                borderColor: `color-mix(in oklab, ${OK} 30%, transparent)`,
                backgroundColor: `color-mix(in oklab, ${OK} 6%, transparent)`,
              }}
            >
              <span
                className="pb-mono flex items-center gap-2 text-[10px] font-medium"
                style={{ color: OK }}
              >
                <CircleCheck className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
                Order completed
              </span>
              <span className="pb-mono shrink-0 text-[10px] tabular-nums text-[color-mix(in_oklab,var(--color-ink)_40%,transparent)]">
                16:41
              </span>
            </motion.div>

            <div className="relative mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-3.5 lg:gap-4">
              <span
                aria-hidden
                className="absolute top-1 w-px"
                style={{
                  left: 11.5,
                  bottom: 14,
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, color-mix(in oklab, var(--color-ink) 16%, transparent) 0 2px, transparent 2px 7px)",
                }}
              />
              <motion.span
                aria-hidden
                className="absolute top-1 w-px origin-top"
                animate={{
                  scaleY: Math.min(1, stage / Math.max(1, FULFILL_STEPS.length - 1)),
                }}
                transition={{ duration: 0.55, ease: PB_EASE_SOFT }}
                style={{
                  left: 11.5,
                  bottom: 14,
                  backgroundColor: `color-mix(in oklab, ${OK} 60%, transparent)`,
                }}
              />

              {FULFILL_STEPS.map((s, i) => {
                const on = stage > i || done;
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.06 * i, ease: PB_EASE_SOFT }}
                  >
                    <div className="flex items-start gap-2.5 lg:gap-3">
                      <span className="relative mt-0.5 size-6 shrink-0">
                        <span className="absolute inset-0 grid place-items-center rounded-full border border-[var(--color-hairline)] bg-white">
                          <Icon
                            className="size-3 text-[color-mix(in_oklab,var(--color-ink)_28%,transparent)]"
                            aria-hidden
                          />
                        </span>
                        <motion.span
                          aria-hidden
                          animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }}
                          transition={{ duration: 0.35, ease: PB_EASE_SOFT }}
                          className="absolute inset-0 grid place-items-center rounded-full text-white"
                          style={{ backgroundColor: OK }}
                        >
                          <Check className="size-3.5" strokeWidth={3} aria-hidden />
                        </motion.span>
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className="block truncate text-[12px] font-semibold leading-tight transition-colors duration-500 lg:text-[12.5px]"
                          style={{
                            color: on
                              ? "var(--color-ink)"
                              : "color-mix(in oklab, var(--color-ink) 50%, transparent)",
                          }}
                        >
                          {s.title}
                        </span>
                        <span className="pb-body block truncate text-[10px] leading-snug lg:text-[10.5px]">
                          {s.sub}
                        </span>
                      </span>

                      <motion.span
                        animate={{
                          opacity: on ? 1 : 0,
                          filter: on ? "blur(0px)" : "blur(4px)",
                        }}
                        transition={{ duration: 0.4 }}
                        className="pb-mono mt-0.5 shrink-0 text-[9.5px] tabular-nums text-[color-mix(in_oklab,var(--color-ink)_42%,transparent)]"
                      >
                        {s.time}
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- 4 compliant by default */

const COMPLY_ROWS = [
  {
    icon: ShieldCheck,
    title: "Clinical policy cleared",
    sub: "PDMP checked, consent on file",
    tag: "Ryan Haight",
  },
  {
    icon: Stethoscope,
    title: "Licensed provider matched in NY",
    sub: "Reviewing under an in-state license",
    tag: "50-state",
  },
  {
    icon: ShieldCheck,
    title: "Privacy and audit logged",
    sub: "PHI encrypted, access recorded",
    tag: "HIPAA · SOC 2",
  },
] as const;

function CompliancePanel() {
  const reduce = useReducedMotion();
  // stages: 0 request, 1 policy, 2 provider match, 3 reroute, 4 audit
  const stage = useLoop(4, 1200, reduce, 2800);

  return (
    <div className="absolute inset-0">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_2%,white)]"
      />
      <DotGrid />
      <Wash />

      <div className="absolute inset-0 flex items-center justify-center px-4 py-6 sm:px-8">
        <div className="flex w-full max-w-[340px] flex-col gap-2 sm:max-w-[380px] sm:gap-2.5">
          {/* request header card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
            className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 shadow-[0_1px_2px_rgba(15,18,40,0.05),0_14px_34px_-24px_rgba(15,18,40,0.35)] sm:py-2.5"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[var(--color-hairline)]">
              <RefreshCw
                className="size-3 text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]"
                aria-hidden
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold leading-tight text-ink">
                Refill request
              </span>
              <span className="pb-mono block truncate text-[10.5px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
                #PB-4120 · GLP-1 · NY
              </span>
            </span>
            <motion.span
              animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 4 }}
              transition={{ duration: 0.4 }}
              className="flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              style={{
                color: OK,
                borderColor: `color-mix(in oklab, ${OK} 30%, transparent)`,
                backgroundColor: `color-mix(in oklab, ${OK} 7%, transparent)`,
              }}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: OK }} />
              Compliant
            </motion.span>
          </motion.div>

          {COMPLY_ROWS.map((r, i) => {
            const appear = stage >= i + 1;
            const Icon = r.icon;
            const rerouteAfter = i === 1;
            return (
              <div key={r.title} className="contents">
                <motion.div
                  animate={{
                    opacity: appear ? 1 : 0,
                    y: appear ? 0 : 12,
                    scale: appear ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,18,40,0.05),0_14px_34px_-24px_rgba(15,18,40,0.35)] sm:py-3"
                >
                  <span
                    className="relative grid size-7 shrink-0 place-items-center rounded-full text-white transition-colors duration-300"
                    style={{
                      backgroundColor: appear
                        ? OK
                        : "color-mix(in oklab, var(--color-ink) 8%, transparent)",
                    }}
                  >
                    {appear ? (
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    ) : (
                      <Icon
                        className="size-3.5 text-[color-mix(in_oklab,var(--color-ink)_35%,transparent)]"
                        aria-hidden
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold leading-tight text-ink">
                      {r.title}
                    </span>
                    <span className="pb-body mt-0.5 block truncate text-[11.5px] leading-tight">
                      {r.sub}
                    </span>
                  </span>
                  <span
                    className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight transition-colors duration-300"
                    style={
                      appear
                        ? {
                            color: OK,
                            borderColor: `color-mix(in oklab, ${OK} 30%, transparent)`,
                            backgroundColor: `color-mix(in oklab, ${OK} 7%, transparent)`,
                          }
                        : {
                            color: "color-mix(in oklab, var(--color-ink) 40%, transparent)",
                            borderColor: "var(--color-hairline)",
                          }
                    }
                  >
                    {r.tag}
                  </span>
                </motion.div>

                {rerouteAfter ? (
                  <motion.div
                    animate={{
                      opacity: stage >= 3 ? 1 : 0,
                      y: stage >= 3 ? 0 : 14,
                      scale: stage >= 3 ? 1 : 0.97,
                    }}
                    transition={{ duration: 0.55, ease: PB_EASE_SOFT }}
                    className="relative w-[92%] self-center overflow-hidden rounded-2xl px-3.5 py-2.5 sm:py-3"
                    style={{
                      backgroundColor: BRAND,
                      boxShadow:
                        "0 1px 2px rgba(27,78,245,0.2), 0 16px 36px -22px rgba(27,78,245,0.6)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold leading-none"
                        style={{ color: BRAND }}
                      >
                        PharmaBro
                      </span>
                      <span className="text-[12.5px] font-semibold text-white">
                        Auto-reroute
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[12px] font-medium text-white">
                      <span
                        className="grid size-4 shrink-0 place-items-center rounded-full bg-white"
                        style={{ color: BRAND }}
                      >
                        <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
                      </span>
                      In-state provider matched, reviewing now
                    </div>
                  </motion.div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ router */

export function HeroPanel({ id }: { id: string }) {
  if (id === "providers") return <ProvidersPanel />;
  if (id === "pharmacy") return <FulfillmentPanel />;
  if (id === "compliant") return <CompliancePanel />;
  return <OperationsPanel />;
}

/** Bordered tab strip: 2x2 on mobile, one row on desktop, with a dwell loader. */
export function HeroTabStrip({
  tabs,
  active,
  onSelect,
  dwellMs,
  cycle,
  animate,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
  dwellMs: number;
  cycle: number;
  animate: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Product highlights"
      className="grid grid-cols-2 border border-[var(--color-hairline)] lg:flex"
    >
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(t.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden px-4 py-4 text-left text-[15px] leading-[1.2] tracking-[-0.01em] transition-colors sm:px-5 sm:text-[16px] lg:flex-1 lg:border-l lg:border-t-0 lg:px-4 lg:text-[19px] lg:first:border-l-0 xl:px-6",
              "border-[var(--color-hairline)] [&:nth-child(2n)]:border-l [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0",
              on
                ? "z-10 bg-[color-mix(in_oklab,var(--color-ink)_2.5%,white)] text-ink"
                : "text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)] hover:z-10 hover:text-[color-mix(in_oklab,var(--color-ink)_78%,transparent)]",
            )}
          >
            {on ? (
              <motion.span
                aria-hidden
                key={`${t.id}-${cycle}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: animate ? 1 : 0 }}
                transition={{ duration: dwellMs / 1000, ease: "linear" }}
                className="absolute left-0 top-0 h-[2px] w-full origin-left bg-marine"
              />
            ) : null}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
