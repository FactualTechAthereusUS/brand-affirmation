import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DASHBOARD_TABS,
  HERO_BADGE,
  HERO_FOOT,
  HERO_H1_STATIC,
  HERO_ROTATING,
  HERO_SUB,
} from "@/lib/pharmabro/home";
import { Btn, Container, EyebrowPill } from "@/components/pharmabro/primitives";
import { PB_EASE, PB_EASE_SOFT } from "@/components/pharmabro/motion";
import { Shot, TabRail } from "./Shot";
import type { MockKind } from "./Mocks";

const longest = [...HERO_ROTATING].sort((a, b) => b.length - a.length)[0];

function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((p) => (p + 1) % HERO_ROTATING.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <span className="relative mx-2 inline-grid align-baseline">
      {/* invisible sizer keeps the pill width stable on the longest word */}
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 rounded-[14px] px-3 py-[0.06em]"
      >
        {longest}
      </span>
      <span className="col-start-1 row-start-1 overflow-hidden rounded-[14px] bg-linear-to-br from-[#1b4ef5] via-[#3f5bff] to-[#6d63ff] px-3 py-[0.06em] text-white shadow-[0_16px_40px_-18px_rgba(27,78,245,0.75)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={HERO_ROTATING[i]}
            initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-0.5em", filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: PB_EASE }}
            className="inline-block whitespace-nowrap"
          >
            {HERO_ROTATING[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export function HeroBlock() {
  const [tab, setTab] = useState(DASHBOARD_TABS[0].id);
  const active = DASHBOARD_TABS.find((t) => t.id === tab) ?? DASHBOARD_TABS[0];

  return (
    <section className="relative overflow-hidden bg-canvas pt-14 sm:pt-20 lg:pt-24">
      {/* soft ambient wash, keeps the page white but not flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(27,78,245,0.10) 0%, rgba(27,78,245,0.03) 45%, transparent 75%)",
        }}
      />

      <Container size="wide" className="relative">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: PB_EASE_SOFT }}
          >
            <EyebrowPill label={HERO_BADGE.label} to={HERO_BADGE.to}>
              {HERO_BADGE.text}
            </EyebrowPill>
          </motion.div>

          <h1 className="mt-7 max-w-[19ch] text-balance font-normal leading-[1.04] tracking-[-0.03em] text-ink text-[2.5rem] sm:max-w-[22ch] sm:text-[3.4rem] lg:text-[4.25rem]">
            <span className="sr-only">{HERO_H1_STATIC}</span>
            <motion.span
              aria-hidden
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.06, ease: PB_EASE }}
              className="block"
            >
              Launch your
              <RotatingWord />
              brand.
            </motion.span>
            <motion.span
              aria-hidden
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.16, ease: PB_EASE }}
              className="block pb-dim"
            >
              PharmaBro runs the clinic.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.24, ease: PB_EASE_SOFT }}
            className="pb-body mt-6 max-w-[58ch] text-[16.5px] leading-relaxed sm:text-[18px]"
          >
            {HERO_SUB}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.32, ease: PB_EASE_SOFT }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Btn to="/pharmabro/demo" size="lg">
              Get started
            </Btn>
            <Btn to="/pharmabro/demo" variant="ghost" size="lg">
              View demo
            </Btn>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pb-micro mt-5"
          >
            {HERO_FOOT}
          </motion.p>
        </div>
      </Container>

      {/* full-width product shot with tab switcher */}
      <Container size="full" className="relative mt-12 sm:mt-16">
        <TabRail
          tabs={DASHBOARD_TABS.map((t) => ({ id: t.id, label: t.label }))}
          active={tab}
          onSelect={setTab}
          className="w-fit"
        />

        <div className="mt-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
            >
              <Shot
                image={active.image}
                slot={active.slot}
                mock={active.id as MockKind}
                ratio="16 / 9"
                liquid
                rounded={20}
              />
              <p className="pb-body mx-auto mt-5 max-w-[62ch] text-center text-[14.5px]">
                {active.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>

    </section>
  );
}
