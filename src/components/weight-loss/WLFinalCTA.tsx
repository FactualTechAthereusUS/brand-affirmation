import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import ctaBgDesktop from "@/assets/wl-hero-desktop-v2.png.asset.json";
import ctaBgMobile from "@/assets/wl-hero-mobile-v2.png.asset.json";

export function WLFinalCTA() {
  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-[1320px] overflow-hidden rounded-[28px] md:rounded-[32px]"
      >
        <img
          src={ctaBgMobile.url}
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-[640px] w-full object-cover md:hidden"
        />
        <img
          src={ctaBgDesktop.url}
          alt=""
          loading="lazy"
          decoding="async"
          className="hidden h-[580px] w-full object-cover md:block lg:h-[640px]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,25,50,0.78) 0%, rgba(10,25,50,0.45) 30%, rgba(10,25,50,0.15) 55%, rgba(10,25,50,0) 75%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-2/3"
          style={{
            background:
              "linear-gradient(to right, rgba(10,25,50,0.55) 0%, rgba(10,25,50,0.25) 40%, rgba(10,25,50,0) 75%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 text-[13px] font-medium text-white/90 md:text-[14px]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
              Get started
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:mt-5 md:text-[64px] lg:text-[76px]"
            >
              Your program is
              <br />
              <span className="italic font-normal">4 minutes away.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-4 max-w-md text-[15px] leading-[1.5] text-white/85 md:mt-6 md:text-[17px]"
            >
              Free assessment. Physician review within 24 hours. Same price at
              every dose. Forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-6 flex flex-wrap items-center gap-2 md:mt-8 md:gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="group relative flex h-[52px] items-center justify-center gap-2 overflow-hidden rounded-full border border-white/25 bg-white/[0.12] px-7 text-[15px] font-medium text-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 hover:bg-white hover:text-[#0a1932] md:h-14 md:px-8"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent" />
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Start My Free Assessment</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, x: 2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="group relative flex h-[52px] items-center gap-2 rounded-full px-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-white/10 md:h-14 md:px-6"
              >
                See Plans
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-5 text-[12px] text-white/75 md:mt-6 md:text-[13px]"
            >
              Free to start · No credit card required · Cancel anytime
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-3 max-w-lg text-[11px] leading-[1.55] text-white/55 md:text-[12px]"
            >
              *The $249 promotional rate applies to your first month only for
              new customers. After that, the standard rate is $299/mo. Prepaid
              multi-month plans available. Same price at every dose level.
              Terms vary by state.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
