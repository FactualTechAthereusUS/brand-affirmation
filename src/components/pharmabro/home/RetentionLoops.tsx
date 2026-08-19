import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Check,
  HeartPulse,
  ListChecks,
  Mail,
  MessageSquare,
  Pill,
  Split,
  Truck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

/* ------------------------------------------------------------------ helpers */

const BRAND = "var(--color-brand, #1B4EF5)";
const OK = "#3f9d5c";

/** Steps `stage` 0..steps on a fixed cadence, holds the finished state, loops. */
function useLoop(steps: number, ms: number, reduce: boolean | null, holdMs = 3400) {
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



function Card({
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
function Connector({ on, height = 26 }: { on: boolean; height?: number }) {
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

function SceneHeader({ label }: { label: string }) {
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

function Chip({ children, show, delay }: { children: ReactNode; show: boolean; delay: number }) {
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
        <Check className="text-white" strokeWidth={3.5} style={{ width: size * 0.62, height: size * 0.62 }} aria-hidden />
      </motion.span>
    </span>
  );
}

/** Word-by-word reveal, used for the reminder copy. */
function Typed({ text, shown }: { text: string; shown: number }) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <p className="text-[11.5px] leading-[1.5] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]">
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

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 py-4 sm:px-6">
      <div className="origin-center scale-[0.72] sm:scale-[0.85] lg:scale-100">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------- 1 onboarding flow */

const REMINDER =
  "You are one step away. Place your first order and a licensed provider reviews it within minutes.";

function OnboardingLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(6, 1100, reduce);
  const words = REMINDER.split(" ").length;
  const typed = reduce ? words : stage < 4 ? 0 : Math.min(words, (stage - 3) * 12);

  return (
    <Stage>
      <div className="flex w-[300px] flex-col items-stretch">
        <SceneHeader label="Onboarding flow" />

        <Card reduce={reduce} show={stage >= 0} className="border-none p-px [background:linear-gradient(135deg,color-mix(in_oklab,var(--color-brand,#1B4EF5)_55%,transparent),color-mix(in_oklab,var(--color-brand,#1B4EF5)_12%,transparent)_45%,color-mix(in_oklab,var(--color-ink)_8%,transparent))]">
          <div className="rounded-[15px] bg-white p-3.5">
            <div className="flex items-center gap-1.5">
              <span
                className="flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: BRAND }}
              >
                <img src="/assets/pharmabro-mark.png" alt="" className="size-3 object-contain" />
                Trigger
              </span>
            </div>
            <p className="mt-1.5 text-[14px] font-semibold leading-tight tracking-[-0.01em] text-ink">
              New patient signed up
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip show={stage >= 0} delay={0.15}>New sign-ups</Chip>
              <Chip show={stage >= 0} delay={0.3}>First order goal</Chip>
            </div>
          </div>
        </Card>

        <Connector on={stage >= 1} />

        <Card reduce={reduce} show={stage >= 1} glow={stage === 1} className="p-3">
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: `color-mix(in oklab, ${BRAND} 10%, transparent)`, color: BRAND }}
            >
              <ListChecks className="size-3.5" aria-hidden />
            </span>
            <span className="text-[12.5px] font-semibold text-ink">Onboarding checklist</span>
          </div>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {["Account created", "Intake completed", "First order placed"].map((c, i) => (
              <li key={c} className="flex items-center gap-2.5">
                <Tick on={stage >= 2 + i} />
                <span className="text-[11.5px] leading-tight text-ink">{c}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Connector on={stage >= 4} />

        <Card reduce={reduce} show={stage >= 4} glow={stage === 4} className="p-3">
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: `color-mix(in oklab, ${OK} 15%, transparent)`, color: OK }}
            >
              <Check className="size-3.5" strokeWidth={2.75} aria-hidden />
            </span>
            <span className="text-[12px] leading-tight text-ink">
              <span className="font-semibold">If no order in 10 minutes:</span> Reminder sent
            </span>
          </div>
          <div className="mt-2 rounded-lg bg-[color-mix(in_oklab,var(--color-ink)_3.5%,transparent)] px-3 py-2">
            <Typed text={REMINDER} shown={typed} />
          </div>
        </Card>

        <Connector on={stage >= 6} />

        <Card reduce={reduce} show={stage >= 6} className="flex items-center gap-2.5 p-3">
          <Tick on={stage >= 6} size={28} />
          <span className="min-w-0">
            <span className="block text-[12.5px] font-semibold leading-tight text-ink">
              Onboarding complete
            </span>
            <span className="block text-[11px] leading-tight text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
              Treatment started, no support call
            </span>
          </span>
        </Card>
      </div>
    </Stage>
  );
}

/* ----------------------------------------------------- 2 patient notifications */

const NOTES = [
  {
    icon: Pill,
    kind: "SMS",
    time: "9:02",
    title: "Time to refill",
    body: "Your semaglutide is due this week. Reply 1 to confirm your next shipment.",
    day: "Day 24",
    done: false,
  },
  {
    icon: Truck,
    kind: "Push",
    time: "1:20",
    title: "Your order shipped",
    body: "On the way with FedEx, in discreet packaging. Arriving Thursday.",
    day: "Day 26",
    done: false,
  },
  {
    icon: HeartPulse,
    kind: "In-app",
    time: "8:30",
    title: "Week 4 check-in",
    body: "How are you feeling? Log your progress so your provider can fine-tune your plan.",
    day: "Day 28",
    done: false,
  },
  {
    icon: Check,
    kind: "SMS",
    time: "now",
    title: "Refill confirmed",
    body: "You are set for month 2, with no gap in treatment.",
    day: "Day 30",
    done: true,
  },
];

const NOTE_H = 96;
const NOTE_GAP = 106;

function NotificationsLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(3, 1250, reduce);

  return (
    <Stage>
      <div className="w-[404px]">
        <div className="pl-[84px]">
          <SceneHeader label="Patient notifications" />
        </div>
        <div className="flex gap-5">
          <div className="relative w-[64px] shrink-0" style={{ height: 414 }}>
            <div className="absolute bottom-0 right-1 top-0 w-px bg-[color-mix(in_oklab,var(--color-ink)_9%,transparent)]" />
            <motion.div
              animate={{ scaleY: Math.min(1, (stage + 1) / 4) }}
              transition={{ duration: 0.6, ease: PB_EASE_SOFT }}
              className="absolute right-1 top-0 h-full w-px origin-top"
              style={{ backgroundColor: BRAND, boxShadow: `0 0 8px 1px color-mix(in oklab, ${BRAND} 28%, transparent)` }}
            />
          </div>

          <div className="relative flex-1" style={{ height: 414 }}>
            {NOTES.map((n, i) => {
              const order = i; // note i enters at stage i and gets pushed down
              const visible = stage >= order;
              const Icon = n.icon;
              return (
                <motion.div
                  key={n.title}
                  animate={{
                    opacity: visible ? 1 : 0,
                    y: visible ? (stage - order) * NOTE_GAP : (stage - order) * NOTE_GAP + 24,
                  }}
                  transition={{ duration: 0.55, ease: PB_EASE_SOFT }}
                  className="absolute inset-x-0 top-0"
                  style={{ height: NOTE_H, zIndex: 10 - i }}
                >
                  <span
                    aria-hidden
                    className="absolute right-full top-[26px] flex -translate-y-1/2 items-center gap-2 pr-[15px]"
                  >
                    <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]">
                      {n.day}
                    </span>
                    <span
                      className="size-[7px] rounded-full"
                      style={{
                        backgroundColor: n.done ? OK : BRAND,
                        boxShadow: `0 0 9px 1px color-mix(in oklab, ${n.done ? OK : BRAND} 40%, transparent)`,
                      }}
                    />
                  </span>
                  <Card reduce={reduce} className="h-full" glow={stage === order}>

                    <div className="flex h-full items-start gap-3 p-3">
                      <span
                        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[10px]"
                        style={
                          n.done
                            ? { backgroundColor: `color-mix(in oklab, ${OK} 12%, transparent)`, color: OK }
                            : { backgroundColor: `color-mix(in oklab, ${BRAND} 10%, transparent)`, color: BRAND }
                        }
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]">
                            PharmaBro
                          </span>
                          <span
                            className="rounded-[5px] px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-[0.06em]"
                            style={{ backgroundColor: `color-mix(in oklab, ${BRAND} 7%, transparent)`, color: BRAND }}
                          >
                            {n.kind}
                          </span>
                          <span className="ml-auto shrink-0 text-[10.5px] tabular-nums text-[color-mix(in_oklab,var(--color-ink)_40%,transparent)]">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-[11.5px] leading-[1.45] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                          {n.body}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* --------------------------------------------------------- 3 journey builder */

const BRANCH_LEFT = "M 260 0 C 260 34 130 26 130 64";
const BRANCH_RIGHT = "M 260 0 C 260 34 390 26 390 64";

function BranchDots({ path, on }: { path: string; on: boolean }) {
  if (!on) return null;
  return (
    <>
      {[0, 0.5].map((d) => (
        <motion.span
          key={d}
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: d * 1.6 }}
          className="absolute size-[5px] rounded-full"
          style={{
            backgroundColor: BRAND,
            offsetPath: `path("${path}")`,
            boxShadow: `0 0 6px 1px color-mix(in oklab, ${BRAND} 45%, transparent)`,
          }}
        />
      ))}
    </>
  );
}

function JourneyLoop() {
  const reduce = useReducedMotion();
  const stage = useLoop(4, 1250, reduce);

  return (
    <Stage>
      <div className="flex w-[520px] flex-col items-center">
        <div className="w-[300px]">
          <SceneHeader label="Journey builder" />
        </div>

        <Card reduce={reduce} show={stage >= 0} glow={stage === 0} className="w-[300px] p-3.5">
          <div className="flex items-center gap-2">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: `color-mix(in oklab, ${BRAND} 10%, transparent)`, color: BRAND }}
            >
              <Users className="size-3.5" aria-hidden />
            </span>
            <span className="text-[12.5px] font-semibold text-ink">Lapsed GLP-1 patients</span>
            <span className="ml-auto font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_40%,transparent)]">
              Segment
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Chip show={stage >= 0} delay={0.15}>Last order 30+ days</Chip>
            <Chip show={stage >= 0} delay={0.28}>No refill scheduled</Chip>
            <Chip show={stage >= 0} delay={0.4}>Weight loss plan</Chip>
          </div>
        </Card>

        <Connector on={stage >= 1} height={22} />

        <motion.span
          animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 8 }}
          transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-white px-3 py-1.5"
        >
          <Split className="size-3" strokeWidth={2.25} style={{ color: BRAND }} aria-hidden />
          <span className="text-[10.5px] font-semibold text-ink">Split by order history</span>
        </motion.span>

        <div className="relative" style={{ width: 520, height: 64 }}>
          <svg width="520" height="64" viewBox="0 0 520 64" fill="none" aria-hidden>
            {[BRANCH_LEFT, BRANCH_RIGHT].map((d) => (
              <motion.path
                key={d}
                d={d}
                stroke="color-mix(in oklab, var(--color-ink) 14%, transparent)"
                strokeWidth="1"
                pathLength={1}
                strokeDasharray="1"
                animate={{ strokeDashoffset: stage >= 2 ? 0 : 1 }}
                transition={{ duration: 0.6, ease: PB_EASE_SOFT }}
              />
            ))}
          </svg>
          <BranchDots path={BRANCH_LEFT} on={stage >= 2} />
          <BranchDots path={BRANCH_RIGHT} on={stage >= 2} />
        </div>

        <div className="flex w-full justify-center gap-10">
          {[
            {
              icon: MessageSquare,
              kind: "SMS",
              title: "Win-back message",
              body: "It has been a month since your last order. Restart your plan in one tap.",
            },
            {
              icon: Mail,
              kind: "Email",
              title: "Upsell journey",
              body: "Patients in month 3 often add B12 support. Add it to your next shipment.",
            },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.title}
                reduce={reduce}
                show={stage >= 3}
                glow={stage === 3}
                className="w-[240px] p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid size-6 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in oklab, ${BRAND} 10%, transparent)`, color: BRAND }}
                  >
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-[12.5px] font-semibold text-ink">{m.title}</span>
                  <span
                    className="ml-auto rounded-[5px] px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-[0.06em]"
                    style={{ backgroundColor: `color-mix(in oklab, ${BRAND} 7%, transparent)`, color: BRAND }}
                  >
                    {m.kind}
                  </span>
                </div>
                <div className="mt-2 rounded-lg bg-[color-mix(in_oklab,var(--color-ink)_3.5%,transparent)] px-2.5 py-2">
                  <p className="text-[11px] leading-[1.5] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]">
                    {m.body}
                  </p>
                </div>
                <span className="sr-only">{i}</span>
              </Card>
            );
          })}
        </div>

        <Card reduce={reduce} show={stage >= 4} className="mt-5 flex items-center gap-5 !rounded-xl px-4 py-2.5">
          <span className="flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] font-semibold tabular-nums text-ink">1,248</span>
            <span className="text-[10px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              Messages sent
            </span>
          </span>
          <span className="h-4 w-px bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]" />
          <span className="flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] font-semibold tabular-nums" style={{ color: OK }}>
              312
            </span>
            <span className="text-[10px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              Patients re-engaged
            </span>
          </span>
        </Card>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------------- public api */

export const RETENTION_SCENES = [OnboardingLoop, NotificationsLoop, JourneyLoop];

export function RetentionScene({ index }: { index: number }) {
  const Scene = RETENTION_SCENES[index] ?? RETENTION_SCENES[0];
  return (
    <div className="relative aspect-[695/675] w-full overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-mist)]">
      <Scene />
    </div>
  );
}
