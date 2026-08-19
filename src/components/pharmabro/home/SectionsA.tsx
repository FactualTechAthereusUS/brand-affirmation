import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CLINIC_BODY,
  CLINIC_CHECKS,
  CLINIC_H2,
  CLINIC_ROWS,
  JOURNEY,
  JOURNEY_BODY,
  JOURNEY_H2,
  JOURNEY_METRICS,
  ROOF_CARDS,
  ROOF_H2,
  ROOF_SUB,
  RUNON_BODY,
  RUNON_H2,
  RUNON_STATS,
  RUNON_TABS,
} from "@/lib/pharmabro/home";
import {
  Btn,
  Check,
  Container,
  MicroLabel,
  Section,
} from "@/components/pharmabro/primitives";
import { KineticRule, PB_EASE_SOFT, Rise } from "@/components/pharmabro/motion";
import { Shot, TabRail } from "./Shot";
import { CardVisual } from "./CardVisuals";
import { ClinicPair } from "./ClinicPair";
import { JourneyScene } from "./JourneyLoops";

/* ------------------------------------------------- 4 a complete clinic */

export function CompleteClinic() {
  return (
    <Section band id="clinic">
      <Container size="wide">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Rise>
            <MicroLabel>Operated end to end</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.85rem]">
              {CLINIC_H2[0]}
              <span className="block pb-dim">{CLINIC_H2[1]}</span>
            </h2>
            <p className="pb-body mt-6 max-w-[56ch] text-[16.5px] leading-relaxed">
              {CLINIC_BODY}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn to="/pharmabro/demo">Get started</Btn>
              <Btn to="/pharmabro/demo" variant="ghost">
                View demo
              </Btn>
            </div>
          </Rise>

          <Rise delay={0.1}>
            <div className="pb-card p-6 sm:p-7">
              <ul className="space-y-5">
                {CLINIC_CHECKS.map((c, i) => (
                  <motion.li
                    key={c.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: PB_EASE_SOFT }}
                    className="flex gap-3.5"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-check)_12%,white)]">
                      <Check className="size-3" />
                    </span>
                    <div>
                      <div className="text-[15px] font-medium text-ink">{c.title}</div>
                      <p className="pb-body mt-1 text-[14px] leading-relaxed">{c.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>

        <div className="mt-16 space-y-14 sm:mt-20">
          {CLINIC_ROWS.map((row, i) => (
            <div key={i}>
              <Shot
                image={row.image}
                slot={row.slot}
                ratio="16 / 7"
                mock={i === 0 ? "operations" : "portal"}
              />
              <Rise delay={0.05}>
                <div className="mt-6 grid gap-3 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                  <h3 className="text-[19px] font-medium tracking-[-0.02em] text-ink">
                    {row.label}
                  </h3>
                  <p className="pb-body max-w-[70ch] text-[15px] leading-relaxed">
                    {row.body}
                  </p>
                </div>
              </Rise>
            </div>
          ))}
        </div>

        <ClinicPair />
      </Container>
    </Section>
  );
}

/* -------------------------------------------- 5 everything under one roof */

/**
 * Bento layout: a 12 column grid on desktop where wide cards split copy left /
 * visual right and narrow cards stack copy over visual. Copy, data and the
 * scene animations are unchanged, only the shell and rhythm.
 */
const ROOF_SPANS = [
  { span: "lg:col-span-7", wide: true },
  { span: "lg:col-span-5", wide: false },
  { span: "lg:col-span-5", wide: false },
  { span: "lg:col-span-7", wide: true },
  { span: "lg:col-span-6", wide: false },
  { span: "lg:col-span-6", wide: false },
] as const;

export function UnderOneRoof() {
  return (
    <Section id="platform">
      <Container size="wide">
        <Rise>
          <MicroLabel>The stack</MicroLabel>
          <h2 className="mt-4 max-w-[22ch] text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.85rem]">
            {ROOF_H2}
          </h2>
          <p className="pb-body mt-5 max-w-[62ch] text-[16.5px] leading-relaxed">
            {ROOF_SUB}
          </p>
        </Rise>

        <KineticRule className="mt-10" />

        <div className="mt-10 grid gap-4 sm:gap-5 lg:grid-cols-12">
          {ROOF_CARDS.map((c, i) => {
            const layout = ROOF_SPANS[i] ?? ROOF_SPANS[0];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: (i % 2) * 0.08, ease: PB_EASE_SOFT }}
                className={cn(
                  "pb-card pb-card-lift flex flex-col gap-5 p-5 sm:p-6",
                  layout.span,
                  layout.wide &&
                    "lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[1fr] lg:items-stretch lg:gap-7",
                )}
              >
                <div className={cn("min-w-0", layout.wide && "lg:order-1 lg:self-center")}>
                  <span className="pb-mono text-[10px] font-semibold tracking-[0.16em] text-[color-mix(in_oklab,var(--color-ink)_38%,transparent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink sm:text-[18px]">
                    {c.title}
                  </h3>
                  <p className="pb-body mt-2 max-w-[46ch] text-[14.5px] leading-relaxed">
                    {c.body}
                  </p>
                </div>
                <div className={cn("min-w-0 flex-1", layout.wide && "lg:order-2")}>

                  <CardVisual kind={c.visual} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}


/* ------------------------------------------ 6 built to run on, not out of */

const RUNON_IMAGE: Record<string, string> = {
  Dashboard: "/assets/pharmabro-dashboard.png",
  "Intake Builder": "/assets/pharmabro-intake-builder.png",
  "Custom Domains": "/assets/pharmabro-custom-domains.png",
  "Patient Experience": "/assets/pharmabro-patient-experience.png",
};

const RUNON_MS = 5200;

export function RunOn() {
  const [tab, setTab] = useState(RUNON_TABS[0]);
  const index = RUNON_TABS.indexOf(tab);

  // Self-demoing rail: advances slowly, and any click restarts the timer.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setTab(RUNON_TABS[(index + 1) % RUNON_TABS.length]);
    }, RUNON_MS);
    return () => window.clearTimeout(id);
  }, [index, tab]);

  return (
    <Section band>
      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Rise>
            <h2 className="text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.6rem]">
              {RUNON_H2[0]}
              <span className="block pb-dim">{RUNON_H2[1]}</span>
            </h2>
          </Rise>
          <Rise delay={0.08} className="lg:pt-3">
            <p className="pb-body max-w-[54ch] text-[16.5px] leading-relaxed">
              {RUNON_BODY}
            </p>
          </Rise>
        </div>
      </Container>

      <Container size="wide" className="mt-10">
        <Rise>
          <div className="relative rounded-[20px] border border-hairline bg-white">
            <Corners inset={10} />

            {/* tab rail */}
            <div className="relative flex snap-x gap-0 overflow-x-auto border-b border-hairline px-2 sm:px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {RUNON_TABS.map((t, i) => {
                const on = t === tab;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={cn(
                      "relative shrink-0 snap-start px-3 py-4 text-left transition-colors sm:px-5",
                      on ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_48%,transparent)] hover:text-ink",
                    )}
                  >
                    <span className="pb-mono block text-[10px] font-semibold tracking-[0.16em] opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block whitespace-nowrap text-[13.5px] font-medium tracking-[-0.01em]">
                      {t}
                    </span>
                    {on ? (
                      <motion.span
                        layoutId="pb-runon-underline"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-marine"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* screen */}
            <div className="pb-dotgrid relative p-3 sm:p-5">
              <div className="relative overflow-hidden rounded-[14px] border border-hairline bg-white shadow-[0_30px_70px_-45px_rgba(16,20,32,0.45)]">
                {RUNON_TABS.map((t, i) => {
                  const on = t === tab;
                  return (
                    <motion.img
                      key={t}
                      src={RUNON_IMAGE[t] ?? "/assets/pharmabro-dashboard.png"}
                      alt={`PharmaBro ${t}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "low"}
                      decoding="async"
                      aria-hidden={!on}
                      initial={false}
                      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 1.012 }}
                      transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
                      style={{ willChange: "opacity, transform" }}
                      className={cn(
                        "h-full w-full object-cover object-top",
                        i === 0 ? "relative" : "absolute inset-0",
                        on ? "" : "pointer-events-none",
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* metric strip */}
            <div className="grid grid-cols-2 border-t border-hairline sm:grid-cols-4">
              {RUNON_STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "px-4 py-4 sm:px-5 sm:py-5",
                    i % 2 === 1 && "border-l border-hairline",
                    i >= 2 && "border-t border-hairline sm:border-t-0",
                    "sm:border-l sm:first:border-l-0",
                  )}
                >
                  <div className="pb-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
                    {s.label}
                  </div>
                  <div className="mt-1.5 text-[20px] font-medium tracking-[-0.02em] text-ink sm:text-[24px]">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Rise>
      </Container>
    </Section>
  );
}

/* ---------------------------------- 7 from checkout to recurring revenue */

const JOURNEY_MS = 9600;

export function CheckoutToRevenue() {
  const [tab, setTab] = useState(JOURNEY[0].id);
  const [cycle, setCycle] = useState(0);
  const [step, setStep] = useState(0);
  const active = JOURNEY.find((s) => s.id === tab) ?? JOURNEY[0];
  const index = JOURNEY.findIndex((s) => s.id === active.id);

  // The section demos itself: tabs advance on a slow cadence, and any click
  // restarts the timer so manual exploration always wins.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = JOURNEY[(index + 1) % JOURNEY.length];
      setTab(next.id);
      setStep(0);
      setCycle((c) => c + 1);
    }, JOURNEY_MS);
    return () => window.clearTimeout(id);
  }, [index, cycle]);

  const pick = (id: string) => {
    setTab(id);
    setStep(0);
    setCycle((c) => c + 1);
  };

  return (
    <Section id="how-it-works">
      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Rise>
            <MicroLabel>One order, end to end</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.85rem]">
              {JOURNEY_H2[0]}
              <span className="block pb-dim">{JOURNEY_H2[1]}</span>
            </h2>
          </Rise>
          <Rise delay={0.08} className="lg:pt-9">
            <p className="pb-body max-w-[56ch] text-[16.5px] leading-relaxed">
              {JOURNEY_BODY}
            </p>
          </Rise>
        </div>

        <div className="mt-10">
          <TabRail
            tabs={JOURNEY.map((s) => ({ id: s.id, label: s.label }))}
            active={tab}
            onSelect={pick}
            className="w-fit"
          />
        </div>

        <Rise delay={0.05}>
          <div className="pb-card mt-8 overflow-hidden p-4 sm:p-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-8">
              {/* copy panel, steps in time with the scene */}
              <div className="flex flex-col lg:py-3 lg:pl-2">
                <div className="flex items-center gap-3">
                  <span className="pb-mono text-[10px] font-semibold tracking-[0.16em] text-[color-mix(in_oklab,var(--color-ink)_38%,transparent)]">
                    {String(index + 1).padStart(2, "0")} / {String(JOURNEY.length).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-hairline)]" />
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: PB_EASE_SOFT }}
                  >
                    <h3 className="mt-4 text-[22px] font-normal leading-[1.15] tracking-[-0.02em] text-ink lg:text-[28px]">
                      {active.label}
                    </h3>
                    <p className="pb-body mt-3 max-w-[46ch] text-[14.5px] leading-relaxed">
                      {active.body}
                    </p>

                    <ul className="mt-6 flex flex-col">
                      {active.details.map((d, i) => {
                        const on = i <= step;
                        return (
                          <li
                            key={d.label}
                            className="border-t border-[var(--color-hairline)] py-3 last:border-b"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className="mt-[7px] size-1.5 shrink-0 rounded-full transition-colors duration-500"
                                style={{
                                  backgroundColor: on
                                    ? "var(--color-brand, #1B4EF5)"
                                    : "color-mix(in oklab, var(--color-ink) 15%, transparent)",
                                }}
                              />
                              <span className="min-w-0">
                                <span
                                  className="block text-[13px] font-medium leading-tight transition-colors duration-500"
                                  style={{
                                    color: on
                                      ? "var(--color-ink)"
                                      : "color-mix(in oklab, var(--color-ink) 45%, transparent)",
                                  }}
                                >
                                  {d.label}
                                </span>
                                <span className="pb-body mt-0.5 block text-[13px] leading-relaxed">
                                  {d.body}
                                </span>
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                <p className="pb-body mt-6 text-[13.5px]">
                  Want the full walkthrough?{" "}
                  <Link
                    to="/pharmabro/platform"
                    className="font-medium text-ink underline underline-offset-4"
                  >
                    See the platform
                  </Link>
                </p>
              </div>

              {/* live stage */}
              <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
                    className="absolute inset-0"
                  >
                    <JourneyScene id={active.id} onStep={setStep} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Rise>
      </Container>
    </Section>
  );
}
