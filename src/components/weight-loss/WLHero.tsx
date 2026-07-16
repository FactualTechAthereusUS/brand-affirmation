import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import heroImg from "@/assets/wl-hero-desktop.png.asset.json";
import heroImgMobile from "@/assets/wl-hero-mobile.png.asset.json";
import vialImg from "@/assets/blissley-vial.png.asset.json";

export function WLHero() {
  return (
    <section
      id="hero"
      className="relative isolate -mt-[124px] min-h-[100svh] overflow-hidden bg-[#2b1a10] pt-[124px] md:min-h-0"
    >
      {/* Mobile background */}
      <img
        src={heroImgMobile.url}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_top] md:hidden"
      />
      {/* Desktop background */}
      <img
        src={heroImg.url}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
      />
      {/* Readability overlays */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0.28) 34%, rgba(20,10,5,0.10) 58%, rgba(20,10,5,0.00) 78%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0.25) 40%, rgba(20,10,5,0) 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-124px)] max-w-[1400px] flex-col px-6 pb-8 pt-2 md:min-h-[780px] md:justify-center md:px-8 md:pb-24 md:pt-[60px] lg:min-h-[820px]">
        <div className="mt-28 flex max-w-[620px] flex-col gap-5 md:mt-0 md:gap-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
            GLP-1 Weight Loss
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="mt-4 text-[40px] font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-[64px] lg:text-[76px]"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            Lose the weight.
            <br />
            <span className="italic font-normal">Keep your life.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-[480px] text-[15px] leading-[1.5] text-white/95 md:mt-6 md:text-[17px]"
          >
            Physician-prescribed semaglutide and tirzepatide. Same price at
            every dose. Delivered to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 flex flex-wrap items-center gap-3 md:mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="group inline-flex h-[56px] items-center gap-3 rounded-full bg-white pl-6 pr-2 text-[15px] font-medium text-ink shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] md:h-[60px]"
            >
              Start My Free Assessment
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-canvas transition-transform duration-300 group-hover:rotate-45 md:h-11 md:w-11">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -1, backgroundColor: "rgba(255,255,255,0.16)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="h-[56px] rounded-full border border-white/25 bg-white/[0.08] px-6 text-[15px] font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.32)_inset] backdrop-blur-xl backdrop-saturate-150 md:h-[60px] md:px-7"
            >
              See How It Works
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-5 max-w-[520px] text-[12px] leading-[1.55] text-white/85 md:text-[13px]"
          >
            Takes 4 minutes · No commitment · Physician review within 24 hours
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-3 max-w-[520px] text-[11px] leading-[1.55] text-white/60 md:text-[12px]"
          >
            *The $249 promotional rate applies to your first month only for new
            customers. After that, the standard rate is $299 per month. Prepaid
            multi-month plans available. Same price at every dose level. Terms
            vary by state.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
