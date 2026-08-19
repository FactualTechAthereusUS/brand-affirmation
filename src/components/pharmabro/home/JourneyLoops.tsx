/**
 * Self-running product loops for the "From checkout to recurring revenue"
 * section. One scene per journey tab, all built on the shared loop kit so the
 * motion grammar matches the retention section.
 */
import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BadgeCheck,
  Bell,
  CircleDashed,
  CreditCard,
  FileText,
  MessageSquare,
  RefreshCw,
  Truck,
} from "lucide-react";
import {
  BRAND,
  Chip,
  Connector,
  LogoStub,
  LoopCard,
  OK,
  SceneHeader,
  Stage,
  Tick,
  Ticker,
  Typed,
  WARN,
  useLoop,
} from "./loopKit";

/** Reports the 0..2 detail row the scene is currently on. */
function useReport(onStep: ((i: number) => void) | undefined, i: number) {
  useEffect(() => {
    onStep?.(i);
  }, [onStep, i]);
}

const brandSoft = (pct: number) => `color-mix(in oklab, ${BRAND} ${pct}%, transparent)`;
const inkSoft = (pct: number) => `color-mix(in oklab, var(--color-ink) ${pct}%, transparent)`;

/* ------------------------------------------------------- 1 checkout completes */

const CARD_GROUPS = ["4242", "4242", "4242", "4242"];

function CheckoutLoop({ onStep }: { onStep?: (i: number) => void }) {
  const reduce = useReducedMotion();
  const stage = useLoop(7, 900, reduce);
  useReport(onStep, stage >= 6 ? 2 : stage >= 3 ? 1 : 0);

  const groups = reduce ? 4 : Math.max(0, Math.min(4, stage - 1));

  return (
    <Stage>
      <div className="w-[320px]">
        <SceneHeader label="Branded checkout" />

        <LoopCard reduce={reduce} className="p-3.5">
          <div className="flex items-center gap-1.5">
            <span className="pb-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              yourbrand.com/checkout
            </span>
            <span className="ml-auto">
              <LogoStub label="SSL" />
            </span>
          </div>

          {/* plan row */}
          <motion.div
            animate={{
              borderColor: stage >= 1 ? brandSoft(45) : "var(--color-hairline)",
              backgroundColor: stage >= 1 ? brandSoft(4) : "transparent",
            }}
            transition={{ duration: 0.4 }}
            className="mt-2.5 flex items-center gap-2.5 rounded-xl border p-2.5"
          >
            <Tick on={stage >= 1} size={18} tone={BRAND} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold leading-tight text-ink">
                Semaglutide, 1 month
              </span>
              <span className="block truncate text-[10.5px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
                Provider consult and shipping included
              </span>
            </span>
            <span className="pb-mono shrink-0 text-[12.5px] font-semibold text-ink">$249.00</span>
          </motion.div>

          {/* card field */}
          <div className="mt-2 rounded-xl border border-[var(--color-hairline)] p-2.5">
            <div className="flex items-center gap-2">
              <CreditCard className="size-3.5 shrink-0" style={{ color: BRAND }} aria-hidden />
              <span className="pb-mono flex gap-1.5 text-[12.5px] tracking-[0.06em] text-ink">
                {CARD_GROUPS.map((g, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: i < groups ? 1 : 0.18 }}
                    transition={{ duration: 0.25 }}
                  >
                    {i < groups ? g : "••••"}
                  </motion.span>
                ))}
              </span>
              <span className="ml-auto">
                <LogoStub label="Stripe" tone="brand" />
              </span>
            </div>
          </div>

          {/* pay button with sweep */}
          <div className="relative mt-2.5 overflow-hidden rounded-xl">
            <div
              className="relative flex items-center justify-center py-2.5 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: stage >= 6 ? OK : "var(--color-ink)" }}
            >
              <motion.span
                aria-hidden
                animate={{ width: stage >= 6 ? "100%" : stage >= 5 ? "100%" : "0%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0"
                style={{ backgroundColor: stage >= 6 ? OK : brandSoft(70) }}
              />
              <span className="relative z-10">
                {stage >= 6 ? "Order placed" : stage >= 5 ? "Processing" : "Pay and start"}
              </span>
            </div>
          </div>
        </LoopCard>

        <Connector on={stage >= 6} />

        <LoopCard reduce={reduce} show={stage >= 6} glow={stage === 6} className="p-3">
          <div className="flex items-center gap-2.5">
            <Tick on={stage >= 6} size={24} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold leading-tight text-ink">
                $249.00 settled to your Stripe
              </span>
              <span className="block truncate text-[10.5px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
                Payout account: your brand, not ours
              </span>
            </span>
            <LogoStub label="Stripe" tone="brand" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip show={stage >= 7} delay={0.05}>Card token vaulted</Chip>
            <Chip show={stage >= 7} delay={0.15}>Rebill scheduled</Chip>
            <Chip show={stage >= 7} delay={0.25}>Zero revenue share</Chip>
          </div>
        </LoopCard>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------- 2 care begins */

const PROVIDER_NOTE =
  "Reviewed your intake and labs. You are approved to start at 0.25 mg weekly, titrating monthly.";

function CareLoop({ onStep }: { onStep?: (i: number) => void }) {
  const reduce = useReducedMotion();
  const stage = useLoop(6, 1000, reduce);
  useReport(onStep, stage >= 5 ? 2 : stage >= 2 ? 1 : 0);
  const words = PROVIDER_NOTE.split(" ").length;
  const typed = reduce ? words : stage < 3 ? 0 : Math.min(words, (stage - 2) * 9);

  return (
    <Stage>
      <div className="w-[320px]">
        <SceneHeader label="Provider review" />

        {/* patient portal card */}
        <LoopCard reduce={reduce} className="p-3.5">
          <div className="flex items-center gap-2">
            <span className="pb-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              Patient portal
            </span>
            <span className="ml-auto flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              style={
                stage >= 5
                  ? { borderColor: `color-mix(in oklab, ${OK} 30%, transparent)`, backgroundColor: `color-mix(in oklab, ${OK} 6%, transparent)`, color: OK }
                  : { borderColor: brandSoft(25), backgroundColor: brandSoft(5), color: BRAND }
              }
            >
              {stage >= 5 ? (
                <Tick on size={12} />
              ) : (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="grid place-items-center"
                >
                  <CircleDashed className="size-3" aria-hidden />
                </motion.span>
              )}
              {stage >= 5 ? "Approved" : "In review"}
            </span>
          </div>
          <p className="mt-2 text-[14px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {stage >= 5 ? "Your treatment is approved" : "A provider is reviewing your intake"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip show={stage >= 1} delay={0.05}>Licensed in NY</Chip>
            <Chip show={stage >= 2} delay={0.1}>Async, no scheduling</Chip>
            <Chip show={stage >= 2} delay={0.15}>
              {stage >= 5 ? "Reviewed in 12 min" : "Typical 12 min"}
            </Chip>
          </div>
        </LoopCard>

        <Connector on={stage >= 2} />

        {/* provider message */}
        <LoopCard reduce={reduce} show={stage >= 2} glow={stage === 2} className="p-3.5">
          <div className="flex items-center gap-2">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold"
              style={{ backgroundColor: brandSoft(10), color: BRAND }}
            >
              ER
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-semibold leading-tight text-ink">
                Dr. Elena Ruiz
              </span>
              <span className="block truncate text-[10px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
                Licensed provider · NY · assigned automatically
              </span>
            </span>
            <MessageSquare className="ml-auto size-3.5 shrink-0" style={{ color: BRAND }} aria-hidden />
          </div>
          <div className="mt-2 rounded-lg px-2.5 py-2" style={{ backgroundColor: inkSoft(3.5) }}>
            <Typed text={PROVIDER_NOTE} shown={typed} />
          </div>
        </LoopCard>

        <Connector on={stage >= 5} />

        <LoopCard reduce={reduce} show={stage >= 5} className="flex items-center gap-2.5 p-3">
          <Tick on={stage >= 5} size={26} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-semibold leading-tight text-ink">
              Care started under your brand
            </span>
            <span className="block truncate text-[10.5px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
              Patients never see a third party name
            </span>
          </span>
          <BadgeCheck className="size-4 shrink-0" style={{ color: OK }} aria-hidden />
        </LoopCard>
      </div>
    </Stage>
  );
}

/* -------------------------------------------------------- 3 approve and route */

const PHARMACIES = [
  { name: "Northline Compounding", mark: "NC", note: "Semaglutide · NY licensed" },
  { name: "South End Pharmacy", mark: "SE", note: "No NY license" },
  { name: "PerfectRx Labs", mark: "PR", note: "Compound not stocked" },
];

function RouteLoop({ onStep }: { onStep?: (i: number) => void }) {
  const reduce = useReducedMotion();
  const stage = useLoop(6, 950, reduce);
  useReport(onStep, stage >= 5 ? 2 : stage >= 3 ? 1 : 0);

  return (
    <Stage>
      <div className="w-[320px]">
        <SceneHeader label="Prescription routing" />

        <LoopCard reduce={reduce} className="p-3.5">
          <div className="flex items-center gap-2">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: brandSoft(10), color: BRAND }}
            >
              <FileText className="size-3.5" aria-hidden />
            </span>
            <span className="text-[12.5px] font-semibold text-ink">Prescription issued</span>
            <span className="pb-mono ml-auto text-[9px] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_40%,transparent)]">
              Rx #4120
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip show={stage >= 1} delay={0.05}>Semaglutide 0.25 mg</Chip>
            <Chip show={stage >= 1} delay={0.15}>3 refills</Chip>
            <Chip show={stage >= 1} delay={0.25}>Chart stored, HIPAA</Chip>
          </div>
        </LoopCard>

        <Connector on={stage >= 2} />

        {/* pharmacy matcher */}
        <LoopCard reduce={reduce} show={stage >= 2} className="p-3">
          <div className="flex items-center gap-2">
            <span className="pb-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              Matching pharmacy
            </span>
            <span className="ml-auto text-[10px] font-medium text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
              compound · state · formulary
            </span>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {PHARMACIES.map((p, i) => {
              const matched = i === 0;
              const resolved = stage >= 4;
              const dim = resolved && !matched;
              return (
                <motion.li
                  key={p.name}
                  animate={{
                    opacity: stage >= 3 ? (dim ? 0.32 : 1) : 0.55,
                    filter: dim ? "blur(0.6px)" : "blur(0px)",
                  }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex items-center gap-2.5 rounded-xl border p-2"
                  style={{
                    borderColor:
                      resolved && matched ? `color-mix(in oklab, ${OK} 35%, transparent)` : "var(--color-hairline)",
                    backgroundColor:
                      resolved && matched ? `color-mix(in oklab, ${OK} 5%, transparent)` : "transparent",
                  }}
                >
                  <LogoStub label={p.mark} tone={matched ? "brand" : "ink"} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-semibold leading-tight text-ink">
                      {p.name}
                    </span>
                    <span className="block truncate text-[10px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
                      {p.note}
                    </span>
                  </span>
                  {matched ? (
                    <Tick on={resolved} size={16} />
                  ) : (
                    <span className="pb-mono shrink-0 text-[9px] uppercase tracking-[0.06em] text-[color-mix(in_oklab,var(--color-ink)_40%,transparent)]">
                      {resolved ? "skipped" : "checking"}
                    </span>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </LoopCard>

        <Connector on={stage >= 5} />

        <LoopCard reduce={reduce} show={stage >= 5} glow={stage === 5} className="p-3">
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: brandSoft(10), color: BRAND }}
            >
              <Truck className="size-3.5" aria-hidden />
            </span>
            <span className="text-[12px] font-semibold text-ink">Shipped, tracking live</span>
            <span className="ml-auto flex items-center gap-1">
              <LogoStub label="FedEx" />
              <LogoStub label="UPS" />
            </span>
          </div>
          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: inkSoft(8) }}>
            <motion.div
              animate={{ width: stage >= 6 ? "78%" : "18%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: BRAND }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Bell className="size-3" style={{ color: BRAND }} aria-hidden />
            <span className="text-[10.5px] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
              Tracking pushed to the portal and SMS
            </span>
          </div>
        </LoopCard>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------ 4 revenue compounds */

const BARS = [34, 46, 41, 58, 66, 79, 92];

function RevenueLoop({ onStep }: { onStep?: (i: number) => void }) {
  const reduce = useReducedMotion();
  const stage = useLoop(6, 950, reduce);
  useReport(onStep, stage >= 5 ? 2 : stage >= 2 ? 1 : 0);
  const recovered = stage >= 4;

  return (
    <Stage>
      <div className="w-[320px]">
        <SceneHeader label="Rebill engine" />

        <LoopCard reduce={reduce} className="p-3.5">
          <div className="flex items-center gap-2">
            <span className="pb-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              Upcoming invoices
            </span>
            <span className="ml-auto">
              <LogoStub label="Stripe" tone="brand" />
            </span>
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-hairline)] p-2">
              <Tick on={stage >= 1} size={16} tone={BRAND} />
              <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-ink">
                Scheduled, Sep 18 · 214 subscriptions
              </span>
              <span className="pb-mono shrink-0 text-[11.5px] text-ink">$53,180</span>
            </div>

            <motion.div
              animate={{
                borderColor: recovered
                  ? `color-mix(in oklab, ${OK} 35%, transparent)`
                  : stage >= 2
                    ? `color-mix(in oklab, ${WARN} 40%, transparent)`
                    : "var(--color-hairline)",
                backgroundColor: recovered
                  ? `color-mix(in oklab, ${OK} 5%, transparent)`
                  : stage >= 2
                    ? `color-mix(in oklab, ${WARN} 6%, transparent)`
                    : "transparent",
              }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5 rounded-xl border p-2"
            >
              {recovered ? (
                <Tick on size={16} />
              ) : (
                <motion.span
                  animate={{ rotate: stage >= 3 ? 360 : 0 }}
                  transition={
                    stage >= 3 ? { duration: 1.4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }
                  }
                  className="grid size-4 shrink-0 place-items-center rounded-full"
                  style={{ color: WARN }}
                >
                  <RefreshCw className="size-3.5" aria-hidden />
                </motion.span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-medium leading-tight text-ink">
                  {recovered ? "Recovered, card updated" : stage >= 3 ? "Retrying with updater" : "Card declined"}
                </span>
                <span className="block truncate text-[10px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
                  Smart retries, no ops work
                </span>
              </span>
              <span className="pb-mono shrink-0 text-[11.5px] text-ink">$249</span>
            </motion.div>
          </div>

          {/* growth bars */}
          <div className="mt-3 flex h-[52px] items-end gap-1.5">
            {BARS.map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: stage >= 1 ? `${h}%` : "8%" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                className="flex-1 rounded-t-[3px]"
                style={{
                  backgroundColor: i === BARS.length - 1 ? BRAND : brandSoft(28),
                }}
              />
            ))}
          </div>
        </LoopCard>

        <Connector on={stage >= 5} />

        <LoopCard reduce={reduce} show={stage >= 5} className="flex items-center gap-4 p-3">
          <span className="flex flex-col">
            <Ticker
              to={12480}
              on={stage >= 5}
              prefix="$"
              className="text-[15px] font-semibold text-ink"
            />
            <span className="pb-micro">MRR</span>
          </span>
          <span className="h-6 w-px" style={{ backgroundColor: inkSoft(10) }} />
          <span className="flex flex-col">
            <Ticker to={214} on={stage >= 5} className="text-[15px] font-semibold text-ink" />
            <span className="pb-micro whitespace-nowrap">Active subs</span>
          </span>
          <span className="h-6 w-px" style={{ backgroundColor: inkSoft(10) }} />
          <span className="flex flex-col">
            <Ticker
              to={96}
              on={stage >= 5}
              suffix="%"
              className="text-[15px] font-semibold"
            />
            <span className="pb-micro whitespace-nowrap">Rebills collected</span>
          </span>
        </LoopCard>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------- switch */

export function JourneyScene({ id, onStep }: { id: string; onStep?: (i: number) => void }) {
  if (id === "care") return <CareLoop onStep={onStep} />;
  if (id === "route") return <RouteLoop onStep={onStep} />;
  if (id === "revenue") return <RevenueLoop onStep={onStep} />;
  return <CheckoutLoop onStep={onStep} />;
}
