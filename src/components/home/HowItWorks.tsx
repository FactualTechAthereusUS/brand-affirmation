import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "../Reveal";
import iconAssessment from "@/assets/how-assessment-v2.png.asset.json";
import iconReview from "@/assets/how-review-v2.jpg.asset.json";
import iconDelivered from "@/assets/how-delivered-v2.png.asset.json";

const steps = [
  {
    n: "01",
    title: "Assessment",
    body: "4-minute intake. Tell us about yourself, your goals, and your health history.",
    icon: iconAssessment.url,
    tint: "bg-white border border-ink/[0.06]",
  },
  {
    n: "02",
    title: "Medical Review",
    body: "A board-certified physician reviews your case within 24 hours and writes your prescription.",
    icon: iconReview.url,
    tint: "bg-white border border-ink/[0.06]",
  },
  {
    n: "03",
    title: "Delivered",
    body: "Your medication arrives from a licensed US pharmacy. Same price at every dose. Forever.",
    icon: iconDelivered.url,
    tint: "bg-white border border-ink/[0.06]",
  },
];

function StepRow({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Track this row's position relative to the viewport.
  // When the row's center is at viewport center → progress ≈ 0.5 (active).
  // Above/below → fades and blurs out.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });

  // Bell curve: peak focus around center of the scroll window.
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.25, 1, 1, 0.25]);
  const blur = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [8, 0, 0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.985, 1, 1, 0.985]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter, scale }}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-ink/10 py-8 md:gap-8 md:py-14"
    >
      <div className="font-sans text-[44px] font-medium leading-none text-ink/15 md:text-[64px]">
        {step.n}
      </div>
      <div className="min-w-0">
        <h3 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-ink md:text-[26px]">
          {step.title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink/60 md:text-[15px]">
          {step.body}
        </p>
      </div>
      <div
        className={`hidden h-[104px] w-[128px] shrink-0 overflow-hidden rounded-2xl ${step.tint} md:block`}
      >
        <img src={step.icon} alt="" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
      </div>
      <div
        className={`col-span-3 -mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl ${step.tint} md:hidden`}
        aria-hidden={index < 0}
      >
        <img src={step.icon} alt="" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-white px-6 py-20 text-ink md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-12 md:gap-10">
        {/* Left sticky column */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 text-[12px] font-medium text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-ever" />
                How it works
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-sans text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
                Getting started
                <br />
                <span className="italic text-ever">should feel simple.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-[15px] leading-[1.55] text-ink/60 md:text-[17px]">
                From assessment to delivery in as little as 3 days.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="group mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_-12px_rgba(23,23,23,0.45)]"
              >
                Start Your Free Assessment
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Reveal>
          </div>
        </div>

        {/* Right rows */}
        <div className="md:col-span-7">
          <div className="border-t border-ink/10">
            {steps.map((s, i) => (
              <StepRow key={s.n} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
