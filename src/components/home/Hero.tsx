import { ArrowUpRight, Check } from "lucide-react";
import { motion } from "motion/react";
import heroImg from "@/assets/hero-portrait.png.asset.json";
import vialImg from "@/assets/blissley-vial.png.asset.json";
import face1 from "@/assets/face-1.png.asset.json";
import face2 from "@/assets/face-2.png.asset.json";
import face3 from "@/assets/face-3.png.asset.json";
import face4 from "@/assets/face-4.png.asset.json";
import face5 from "@/assets/face-5.png.asset.json";
import trustpilot from "@/assets/trustpilot.png.asset.json";

const trustPoints = [
  "Board-certified doctors",
  "Clinically backed treatments",
  "Medical guidance",
];

const faces = [face1, face2, face3, face4, face5];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#8FB8D9]">
      {/* Desktop: full-bleed background portrait */}
      <img
        src={heroImg.url}
        alt=""
        aria-hidden
        className="absolute inset-0 hidden h-full w-full object-cover object-[right_center] md:block"
      />
      <div
        className="absolute inset-0 hidden md:block"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, rgba(143,184,217,0.55) 0%, rgba(143,184,217,0.15) 55%, rgba(143,184,217,0) 75%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col px-6 pb-0 pt-[110px] md:min-h-[820px] md:justify-center md:px-8 md:pb-24 md:pt-[180px] lg:min-h-[860px]">
        <div className="max-w-[640px]">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[68px] lg:text-[80px]"
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
            className="mt-6 max-w-[480px] text-[16px] leading-[1.55] text-ink/80 md:text-[17px]"
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
            <button className="group relative flex h-[60px] items-center gap-3 rounded-full bg-white pl-2 pr-6 text-[15px] font-medium text-ink shadow-[0_10px_30px_-10px_rgba(23,23,23,0.25)] transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="grid h-[44px] w-[44px] place-items-center overflow-hidden rounded-full bg-[#4a3fd6]">
                <img src={vialImg.url} alt="" className="h-full w-full object-cover" />
              </span>
              Get started
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-canvas transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </button>

            <button className="h-[60px] rounded-full border border-ink/25 bg-white/10 px-7 text-[15px] font-medium text-ink backdrop-blur-md transition-colors hover:bg-white/25">
              Explore Treatments
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-[480px] text-[11px] leading-[1.5] text-ink/60"
          >
            *The $39 promotional rate applies to your first month only for new
            customers. After that, the standard rate is $79 per month. Prepaid
            multi-month plans available. Terms vary by state.
          </motion.p>
        </div>

        {/* Trust points */}
        <motion.ul
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 md:mt-12 lg:absolute lg:right-8 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:items-start"
        >
          {trustPoints.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[15px] font-medium text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] md:text-[17px]">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-white/70">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </span>
              {t}
            </li>
          ))}

          {/* Trust card */}
          <li className="mt-2 w-full max-w-[340px] rounded-2xl border border-white/30 bg-white/15 p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {faces.map((f, i) => (
                  <img
                    key={i}
                    src={f.url}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-[13px] font-medium leading-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
                Trusted by over<br />30,000+ patients
              </p>
            </div>
            <div className="mt-3 border-t border-white/25 pt-3">
              <img src={trustpilot.url} alt="Excellent — Trustpilot" className="h-6 w-auto object-contain object-left" />
            </div>
          </li>
        </motion.ul>

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
