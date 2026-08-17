import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { JOURNEY } from "@/lib/pharmabro/home";

/**
 * Four-step order journey. A scroll-linked rail fills as the section passes
 * through the viewport (Bask's progress rail, Rimo's numbered restraint).
 */
export function OrderJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const scaleY = useTransform(fill, [0, 1], [0, 1]);
  const scaleX = useTransform(fill, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      {/* horizontal rail on desktop */}
      <div className="absolute inset-x-0 top-[13px] hidden h-px bg-[var(--color-hairline)] lg:block">
        <motion.div
          style={{ scaleX }}
          className="h-px origin-left bg-[var(--color-marine)]"
        />
      </div>
      {/* vertical rail on mobile */}
      <div className="absolute bottom-0 left-[13px] top-2 w-px bg-[var(--color-hairline)] lg:hidden">
        <motion.div
          style={{ scaleY }}
          className="h-full w-px origin-top bg-[var(--color-marine)]"
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
        {JOURNEY.steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative pl-11 lg:pl-0"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1 grid size-7 place-items-center rounded-full border border-[var(--color-hairline)] bg-canvas text-[11px] font-medium text-ink lg:relative lg:mb-6"
            >
              {i + 1}
            </span>
            <div className="pb-micro lg:mt-0">{s.meta}</div>
            <h3 className="mt-2 text-[17px] font-medium tracking-[-0.02em] text-ink">
              {s.title}
            </h3>
            <p className="pb-body mt-2 text-[14px] leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
