import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
} from "@/lib/pharmabro/nav";
import { TRUST_MARKS } from "@/lib/pharmabro/home";
import { Container } from "./primitives";

const WORDMARK = "/assets/pharmabro-wordmark.png";
const LEGITSCRIPT = "/assets/legitscript-certified-badge.png";

/** Green pulse + label, Framer "Availability" pill. */
function SystemsPill() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-[24px] border border-white/12 bg-white/[0.04] px-3.5 py-2 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-[#12b33f]"
          animate={{ scale: [0.5, 2.1], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative h-2 w-2 rounded-full bg-[#12b33f]" />
      </span>
      <span className="text-[12.5px] font-medium text-white/80">
        All systems normal
      </span>
    </div>
  );
}

/** 8 stacked backdrop-blur layers that ramp toward the bottom edge. */
const BLUR_STEPS = [0.039, 0.078, 0.156, 0.3125, 0.625, 1.25, 2.5, 5];

function ProgressiveBlurStrip() {
  const layers = BLUR_STEPS.length;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38%]">
      {BLUR_STEPS.map((blur, i) => {
        const start = Math.round((i / layers) * 100);
        const mid = Math.round(((i + 1) / layers) * 100);
        const mask = `linear-gradient(to bottom, rgba(0,0,0,0) ${start}%, rgba(0,0,0,1) ${mid}%, rgba(0,0,0,1) 100%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              maskImage: mask,
              WebkitMaskImage: mask,
              backdropFilter: `blur(${blur}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

/** "design / build / create"-style blur-fade word cycle, 2s interval. */
const CYCLE_WORDS = ["dollar.", "patient.", "refill."] as const;

function CyclingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % CYCLE_WORDS.length), 2000);
    return () => window.clearInterval(id);
  }, [reduce]);
  if (reduce) return <span>{CYCLE_WORDS[0]}</span>;
  return (
    <span className="relative inline-grid align-baseline">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {CYCLE_WORDS.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={CYCLE_WORDS[i]}
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap text-left"
        >
          {CYCLE_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


const DISCLAIMER_PARAS = [
  "This site is for informational purposes only and does not constitute medical advice. All clinical decisions, consultations, and prescriptions are made by independent, state-licensed healthcare providers. PharmaBro is not a medical provider and does not practice medicine.",
  "PharmaBro is a software company. The Factual LLC, doing business as PharmaBro, provides white-label software infrastructure, technology integrations, and operational tooling that enables telehealth brand operators to connect with independent licensed healthcare providers and licensed compounding pharmacies. PharmaBro does not sell, dispense, fulfill, or ship medications. PharmaBro is not a pharmacy, does not operate a pharmacy, and is not an online pharmacy. PharmaBro is not affiliated with any specific pharmacy and does not direct clinical care.",
  "Pharmacy and fulfillment services are provided by independent, state-licensed third-party compounding pharmacies. Provider services are provided by independent, state-licensed physicians and nurse practitioners. The Factual LLC, DBA PharmaBro, facilitates technology access and operational support only. Partners operate under a Management Services Organization (MSO) model and handle non-clinical business functions only.",
  "PharmaBro does not guarantee business outcomes, patient acquisition, or revenue. Success depends on operator marketing execution, capital, market conditions, and factors outside PharmaBro's control. Nothing on this site constitutes a business opportunity, earnings claim, or financial representation.",
  "Use of PharmaBro's platform is subject to our Terms of Service and Privacy Policy. This site is not a part of Facebook, Google, YouTube, or Bing, and is not endorsed by Meta Inc., Google Inc., or Microsoft Inc.",
];

export function PharmaBroFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#0A0A0A] text-white">
      <Container size="full" className="relative z-20 pt-16 pb-8 lg:pt-20">
        {/* Top: statement left, link grid right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-[420px]">
            <h2 className="font-sans text-[32px] font-medium leading-[1.06] tracking-[-0.02em] text-white lg:text-[46px]">
              Launch your own
              <br />
              telehealth brand.
              <br />
              <span className="text-white/45">Keep every dollar.</span>
            </h2>
            <p className="mt-5 max-w-[360px] text-[14px] leading-relaxed text-white/50 lg:text-[15px]">
              Flat monthly software fee. Zero revenue share. Your Stripe, your
              patients, your brand.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <SystemsPill />
              <img
                src={LEGITSCRIPT}
                alt="LegitScript certified"
                className="h-[46px] w-auto rounded-md bg-white/95 p-1 object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.label} aria-label={col.label}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
                  {col.label}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.items.map((it) => (
                    <li key={it.to + it.label}>
                      <Link
                        to={it.to}
                        className="text-[13.5px] leading-snug text-white/75 transition-colors hover:text-white"
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Trust marks */}
        <div className="mt-14 flex flex-wrap gap-2 border-t border-white/10 pt-8">
          {TRUST_MARKS.filter((t) => t !== "All systems normal").map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/65"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Legal row */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[12.5px] text-white/50 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[12.5px] text-white/40">© 2026 The Factual LLC, DBA PharmaBro</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
            PharmaBro — Site Disclaimer &amp; Disclosures
          </h3>
          <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:gap-x-12">
            {DISCLAIMER_PARAS.map((p) => (
              <p key={p.slice(0, 24)} className="text-[12px] leading-[1.7] text-white/40">
                {p}
              </p>
            ))}
          </div>
          <address className="mt-6 text-[12px] not-italic leading-[1.7] text-white/50">
            The Factual LLC, DBA PharmaBro
            <br />
            131 Continental Dr, Suite 305, Newark, DE 19713
          </address>
        </div>
      </Container>

      {/* Giant wordmark + icon */}
      <div className="relative px-4 pb-6 md:px-6 md:pb-8">
        <ProgressiveBlurStrip />
        <div className="relative z-0 flex justify-center">
          <img
            src={WORDMARK}
            alt="PharmaBro"
            className="w-full max-w-[1320px] select-none object-contain opacity-95 invert"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </footer>
  );
}
