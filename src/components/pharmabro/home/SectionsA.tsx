import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import type { MockKind } from "./Mocks";
import { CardVisual } from "./CardVisuals";

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
      </Container>
    </Section>
  );
}

/* -------------------------------------------- 5 everything under one roof */

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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROOF_CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: (i % 3) * 0.07, ease: PB_EASE_SOFT }}
              className="pb-card pb-card-lift flex flex-col p-6"
            >
              <h3 className="text-[16.5px] font-medium leading-snug tracking-[-0.015em] text-ink">
                {c.title}
              </h3>
              <p className="pb-body mt-2.5 text-[14.5px] leading-relaxed">{c.body}</p>
              <div className="mt-5">
                <CardVisual kind={c.visual} />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------ 6 built to run on, not out of */

const RUNON_IMAGE: Record<string, string> = {
  Dashboard: "/assets/pharmabro-dashboard.png",
  "Intake Builder": "/assets/pharmabro-intake-builder.png",
  "Custom Domains": "/assets/pharmabro-dashboard.png",
  "Patient Experience": "/assets/pharmabro-phone-intake.png",
};

export function RunOn() {
  const [tab, setTab] = useState(RUNON_TABS[0]);

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

      <Container size="full" className="mt-12">
        <Rise>
          <div
            className="relative overflow-hidden rounded-[28px] p-4 sm:p-7"
            style={{
              background:
                "linear-gradient(135deg, #4c1d95 0%, #3730a3 38%, #1b4ef5 78%, #6d63ff 100%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                background:
                  "radial-gradient(60% 70% at 15% 10%, rgba(255,255,255,0.35) 0%, transparent 60%)",
              }}
            />
            <div className="relative grid gap-4 lg:grid-cols-[220px_1fr]">
              {/* glass sidebar */}
              <div className="rounded-[18px] border border-white/20 bg-white/10 p-3 backdrop-blur-xl">
                <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.13em] text-white/60">
                  Workspace
                </div>
                <div className="flex gap-1.5 lg:flex-col">
                  {RUNON_TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`relative rounded-[12px] px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                        tab === t ? "text-ink" : "text-white/72 hover:text-white"
                      }`}
                    >
                      {tab === t ? (
                        <motion.span
                          layoutId="pb-runon-tab"
                          transition={{ type: "spring", stiffness: 360, damping: 30 }}
                          className="absolute inset-0 rounded-[12px] bg-white shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)]"
                        />
                      ) : null}
                      <span className="relative z-10 whitespace-nowrap">{t}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-white/15 pt-4">
                  {RUNON_STATS.map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-[11px] text-white/60">{s.label}</span>
                      <span className="pb-mono text-[12.5px] font-medium text-white">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[18px] border border-white/25 bg-white/95 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={tab}
                    src={RUNON_IMAGE[tab] ?? "/assets/pharmabro-dashboard.png"}
                    alt={`PharmaBro ${tab}`}
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
                    className="h-full w-full object-cover object-top"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Rise>
      </Container>
    </Section>
  );
}

/* ---------------------------------- 7 from checkout to recurring revenue */

export function CheckoutToRevenue() {
  const [tab, setTab] = useState(JOURNEY[0].id);
  const active = JOURNEY.find((s) => s.id === tab) ?? JOURNEY[0];

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
            onSelect={setTab}
            className="w-fit"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
              className="pb-card p-6 sm:p-7"
            >
              <h3 className="text-[19px] font-medium tracking-[-0.02em] text-ink">
                {active.label}
              </h3>
              <p className="pb-body mt-3 text-[15px] leading-relaxed">{active.body}</p>
              <div className="mt-6 space-y-3 border-t border-[var(--color-hairline)] pt-5">
                {active.details.map((d) => (
                  <div key={d.label} className="flex flex-col gap-0.5">
                    <span className="pb-micro">{d.label}</span>
                    <span className="text-[14px] text-ink">{d.body}</span>
                  </div>
                ))}
              </div>
              {active.id === "revenue" ? (
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[var(--color-hairline)] pt-5">
                  {JOURNEY_METRICS.map((m) => (
                    <div key={m.label}>
                      <div className="pb-mono text-[17px] font-medium text-ink">{m.value}</div>
                      <div className="pb-micro mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <Shot
            key={active.id}
            image={active.image}
            slot={active.slot}
            ratio="16 / 10"
            mock={active.id as MockKind}
          />
        </div>

        <Rise delay={0.1}>
          <p className="pb-body mt-8 text-[14px]">
            Want the full walkthrough?{" "}
            <Link to="/pharmabro/platform" className="font-medium text-ink underline underline-offset-4">
              See the platform
            </Link>
          </p>
        </Rise>
      </Container>
    </Section>
  );
}
