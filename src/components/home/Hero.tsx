import { ArrowUpRight, Check } from "lucide-react";
import { motion } from "motion/react";
import heroImg from "@/assets/hero-portrait.png.asset.json";
import vialImg from "@/assets/blissley-vial.png.asset.json";
import trustpilotLogo from "@/assets/trustpilot-full.png.asset.json";

const trustPoints = [
  "Board-certified doctors",
  "Clinically backed treatments",
  "Medical guidance",
];

export function Hero() {
  return (
    <section className="relative isolate -mt-[124px] overflow-hidden bg-[#1e3a5f] pt-[124px]">
      {/* Desktop: full-bleed background portrait */}
      <img
        src={heroImg.url}
        alt=""
        aria-hidden
        className="absolute inset-0 hidden h-full w-full object-cover object-[right_center] md:block"
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col px-6 pb-0 md:min-h-[780px] md:justify-center md:px-8 md:pb-24 md:pt-[60px] lg:min-h-[820px]">
        <div className="max-w-[640px]">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-[60px] lg:text-[72px]"
          >
            Personalized care.
            <br />
            Ongoing support.
            <br />
            Real progress.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-[480px] text-[16px] leading-[1.55] text-white/90 md:text-[17px]"
          >
            GLP-1, dermatology, hair, mental health, intimacy. Doctor-prescribed
            treatments shipped to your door starting at $39 for first month of
            membership.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button className="group relative flex h-[60px] items-center gap-3 rounded-full bg-white pl-2 pr-6 text-[15px] font-medium text-ink shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="grid h-[44px] w-[44px] place-items-center overflow-hidden rounded-full bg-[#4a3fd6]">
                <img src={vialImg.url} alt="" className="h-full w-full object-cover" />
              </span>
              Get started
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-canvas transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </button>

            <button className="h-[60px] rounded-full border border-white/25 bg-white/[0.08] px-7 text-[15px] font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.32)_inset] backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-white/[0.14]">
              Explore Treatments
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-[480px] text-[11px] leading-[1.5] text-white/60"
          >
            *The $39 promotional rate applies to your first month only for new
            customers. After that, the standard rate is $79 per month. Prepaid
            multi-month plans available. Terms vary by state.
          </motion.p>
        </div>

        {/* Trust points — compact, bottom-right on desktop */}
        <div className="mt-10 flex flex-col items-start gap-5 md:mt-12 lg:absolute lg:bottom-16 lg:right-8 lg:mt-0 lg:items-end">
          <ul className="flex flex-col gap-3">
            {trustPoints.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[13px] font-medium text-white md:text-[14px]">
                <span className="grid h-[18px] w-[18px] place-items-center rounded-full border border-white/70">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          {/* Trustpilot — true liquid glass, no blur */}
          <div className="w-[180px] rounded-xl border border-white/15 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <img
              src={trustpilotLogo.url}
              alt="Trustpilot — TrustScore 4.96, 3,826 reviews"
              className="h-10 w-auto object-contain object-left"
            />
            <div className="mt-2 flex items-baseline gap-1.5 text-[12px] text-white/90">
              <span>TrustScore <span className="font-semibold text-white">4.96</span></span>
              <span className="text-white/40">·</span>
              <a href="#" className="underline underline-offset-2 hover:text-white">3,826 reviews</a>
            </div>
          </div>

        </div>

        {/* Mobile portrait — stacked below content */}
        <div className="relative mt-10 h-[440px] w-[calc(100%+3rem)] -mx-6 overflow-hidden md:hidden">
          <img
            src={heroImg.url}
            alt="Woman in warm sunlight"
            className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
          />
        </div>
      </div>
    </section>
  );
}
