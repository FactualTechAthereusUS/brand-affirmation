import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Placeholder } from "./Placeholder";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section className="bg-canvas pb-0 pt-12 md:pt-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block rounded-full bg-mist px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink"
        >
          Now available in all 50 states
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[42px] leading-[1.05] text-ink md:text-[64px] md:leading-[1.02]"
        >
          Personalized medicine.
          <br />
          <span className="italic text-ever">Designed around you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-5 max-w-lg text-[17px] leading-[1.5] text-[#5A5A5A] md:text-[19px]"
        >
          Weight loss. Skin. Sexual wellness. Longevity. All in one modern care
          platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <button className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-canvas transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto md:h-14">
            Start Assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
          <button className="h-[52px] w-full rounded-full border-[1.5px] border-ink bg-transparent px-7 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-canvas sm:w-auto md:h-14">
            Explore Treatments
          </button>
        </motion.div>
      </div>

      <div ref={ref} className="relative mt-12 overflow-hidden md:mt-16">
        <motion.div style={{ y }} className="h-[380px] md:h-[600px]">
          <Placeholder
            label="Hero — woman laughing, warm afternoon light"
            tone="warm"
            className="h-full w-full"
          />
        </motion.div>

        {/* Rating overlay card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute bottom-5 left-5 rounded-2xl bg-white p-4 shadow-[0_2px_24px_rgba(0,0,0,0.08)] md:bottom-8 md:left-8"
        >
          <div className="flex items-center gap-2 text-[13px] text-ink">
            <span className="text-honey">★★★★★</span>
            <span className="font-medium">4.8 from 3,000+ patients</span>
          </div>
          <div className="mt-2 flex -space-x-2">
            {["#c4998a", "#818263", "#8b9bb4"].map((c) => (
              <div
                key={c}
                className="h-7 w-7 rounded-full border-2 border-white"
                style={{ background: c }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
