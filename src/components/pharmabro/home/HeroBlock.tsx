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
import { PB_EASE, PB_EASE_SOFT, PB_EASE_STD } from "@/components/pharmabro/motion";
import { HeroPanel, HeroTabStrip } from "./HeroPanels";
import { cn } from "@/lib/utils";


const longest = [...HERO_ROTATING].sort((a, b) => b.length - a.length)[0];

/** One headline word: blur(8px)/opacity 0 -> clear, 60ms stagger per word. */
function HeroWord({
  children,
  i,
  plain,
}: {
  children: React.ReactNode;
  i: number;
  plain?: boolean;
}) {
  const reduce = useReducedMotion();
  const content = (
    <>
      {children}
      {plain ? null : " "}
    </>
  );
  if (reduce) return <span className="inline-block">{content}</span>;
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: PB_EASE_STD }}
      className="inline-block whitespace-pre"
    >
      {content}
    </motion.span>
  );
}


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

const TAB_MS = 7000;

export function HeroBlock() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(DASHBOARD_TABS[0].id);
  const [cycle, setCycle] = useState(0);
  const active = DASHBOARD_TABS.find((t) => t.id === tab) ?? DASHBOARD_TABS[0];
  const index = DASHBOARD_TABS.findIndex((t) => t.id === active.id);

  // Self-demoing rail: advances on a slow cadence, any click restarts it.
  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => {
      setTab(DASHBOARD_TABS[(index + 1) % DASHBOARD_TABS.length].id);
      setCycle((c) => c + 1);
    }, TAB_MS);
    return () => window.clearTimeout(id);
  }, [index, cycle, reduce]);

  const pick = (id: string) => {
    setTab(id);
    setCycle((c) => c + 1);
  };


  return (
    <section className="relative overflow-hidden bg-canvas pt-10 sm:pt-20 lg:pt-24">

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

          <h1 className="mt-6 max-w-[19ch] text-balance font-normal leading-[1.06] tracking-[-0.03em] text-ink text-[2.15rem] sm:mt-7 sm:max-w-[22ch] sm:text-[3.4rem] sm:leading-[1.04] lg:text-[4.25rem]">
            <span className="sr-only">{HERO_H1_STATIC}</span>
            <span aria-hidden className="block">
              <HeroWord i={0}>Launch</HeroWord>
              <HeroWord i={1}>your</HeroWord>
              <HeroWord i={2} plain>
                <RotatingWord />
              </HeroWord>
              <HeroWord i={3}>brand.</HeroWord>
            </span>
            <span aria-hidden className="block pb-dim">
              <HeroWord i={4}>PharmaBro</HeroWord>
              <HeroWord i={5}>runs</HeroWord>
              <HeroWord i={6}>the</HeroWord>
              <HeroWord i={7}>clinic.</HeroWord>
            </span>
          </h1>


          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: PB_EASE_STD }}
            className="pb-body mt-6 max-w-[58ch] text-[16.5px] leading-relaxed sm:text-[18px]"
          >
            {HERO_SUB}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: PB_EASE_STD }}
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
            transition={{ duration: 0.6, delay: 0.8, ease: PB_EASE_STD }}
            className="pb-micro mt-5"
          >
            {HERO_FOOT}
          </motion.p>

        </div>
      </Container>

      {/* full-width product highlight tabs */}
      <Container size="wide" className="relative mt-12 pb-4 sm:mt-16">
        <HeroTabStrip
          tabs={DASHBOARD_TABS.map((t) => ({ id: t.id, label: t.label }))}
          active={tab}
          onSelect={pick}
          dwellMs={TAB_MS}
          cycle={cycle}
          animate={!reduce}
        />

        <div
          className={cn(
            "relative w-full overflow-hidden border border-t-0 border-[var(--color-hairline)] bg-[color-mix(in_oklab,var(--color-ink)_2%,white)]",
            tab === "operations"
              ? "aspect-[1672/941]"
              : "aspect-square lg:aspect-[2/1]",
          )}
        >
          {DASHBOARD_TABS.map((t) => (
            <div
              key={t.id}
              aria-hidden={t.id !== tab}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                t.id === tab ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {t.id === tab ? <HeroPanel id={t.id} /> : null}
            </div>
          ))}
        </div>

        <p className="pb-body mx-auto mt-5 max-w-[62ch] text-center text-[14.5px]">
          {active.caption}
        </p>
      </Container>
    </section>
  );
}

