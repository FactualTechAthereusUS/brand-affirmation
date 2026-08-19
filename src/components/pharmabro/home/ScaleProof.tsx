import { motion } from "motion/react";
import {
  BRAND_LOGOS,
  LOGO_WALL_H2,
  LOGO_WALL_SUB,
  SCALE_STATS,
  TESTIMONIALS,
} from "@/lib/pharmabro/home";
import {
  Container,
  MicroLabel,
  Section,
} from "@/components/pharmabro/primitives";
import { PB_EASE_SOFT, Rise } from "@/components/pharmabro/motion";
import { CountUp } from "@/components/CountUp";

/** Bask-style scale strip: four count-up figures on a hairline grid. */
export function ScaleStats() {
  return (
    <Section band>
      <Container size="wide">
        <div className="grid grid-cols-2 gap-y-10 border-y border-[var(--color-hairline)] py-10 lg:grid-cols-4 lg:gap-y-0">
          {SCALE_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: PB_EASE_SOFT }}
              className="px-1 lg:px-6 lg:not-first:border-l lg:not-first:border-[var(--color-hairline)]"
            >
              <div className="text-[2.2rem] font-normal leading-none tracking-[-0.03em] text-ink sm:text-[2.8rem]">
                <CountUp to={s.value} />
                {s.suffix}
              </div>
              <div className="pb-body mt-3 max-w-[22ch] text-[13.5px] leading-snug">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Brand logo wall: grid on desktop, hairline list on mobile. */
export function LogoWall() {
  return (
    <Section>
      <Container size="wide">
        <Rise>
          <MicroLabel>Operators</MicroLabel>
          <h2 className="mt-4 max-w-[24ch] text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl">
            {LOGO_WALL_H2}
          </h2>
          <p className="pb-body mt-4 max-w-[58ch] text-[15.5px] leading-relaxed">
            {LOGO_WALL_SUB}
          </p>
        </Rise>

        <div className="mt-10 grid grid-cols-2 border-t border-l border-[var(--color-hairline)] sm:grid-cols-3 lg:grid-cols-4">
          {BRAND_LOGOS.map((b, i) => (
            <motion.div
              key={typeof b === "string" ? b : i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
              className="grid h-[92px] place-items-center border-r border-b border-[var(--color-hairline)] px-4"
            >
              <span className="text-[14.5px] font-medium tracking-[-0.01em] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                {typeof b === "string" ? b : String((b as { label?: string }).label ?? "")}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Three quote cards, hairline framed, no avatars. */
export function Testimonials() {
  return (
    <Section band>
      <Container size="wide">
        <Rise>
          <MicroLabel>What operators say</MicroLabel>
          <h2 className="mt-4 max-w-[26ch] text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl">
            Built by operators,{" "}
            <span className="pb-dim">used by operators.</span>
          </h2>
        </Rise>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: PB_EASE_SOFT }}
              className="pb-card flex flex-col justify-between p-6"
            >
              <blockquote className="text-[16px] leading-relaxed tracking-[-0.01em] text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-[var(--color-hairline)] pt-4">
                <div className="text-[13.5px] font-medium text-ink">{t.name}</div>
                <div className="pb-micro mt-1">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
