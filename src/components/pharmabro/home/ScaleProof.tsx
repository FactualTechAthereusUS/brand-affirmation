import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
              key={b}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
              className="grid h-[92px] place-items-center border-r border-b border-[var(--color-hairline)] px-4"
            >
              <span className="text-[14.5px] font-medium tracking-[-0.01em] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                {b}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 15"
          className="h-[13px] w-[13px] fill-ink"
          aria-hidden="true"
        >
          <path d="M8 0l2.06 4.6L15 5.24l-3.6 3.32 1 4.94L8 11.06 3.6 13.5l1-4.94L1 5.24l4.94-.64L8 0z" />
        </svg>
      ))}
    </div>
  );
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--color-hairline)] bg-canvas text-[13px] font-medium tracking-[-0.01em] text-ink">
      {initials}
    </span>
  );
}

/**
 * Framer-style testimonial rail: one featured quote at a time with a quote
 * glyph, star row and monogram byline, plus a hairline picker that also
 * auto-advances so the section demos itself.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
      setCycle((c) => c + 1);
    }, 6200);
    return () => window.clearTimeout(id);
  }, [active, cycle]);

  const t = TESTIMONIALS[active];

  return (
    <Section band>
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Rise>
            <MicroLabel>What operators say</MicroLabel>
            <h2 className="mt-4 max-w-[20ch] text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl">
              Built by operators,{" "}
              <span className="pb-dim">used by operators.</span>
            </h2>
            <p className="pb-body mt-4 max-w-[42ch] text-[15.5px] leading-relaxed">
              Brands running weight loss, mens health and longevity clinics on
              PharmaBro today.
            </p>
          </Rise>

          <Rise delay={0.06}>
            <div className="pb-card p-6 sm:p-8">
              <svg
                viewBox="0 0 24 15"
                className="h-[15px] w-6 fill-ink"
                aria-hidden="true"
              >
                <path d="M0 15V8.2C0 3.9 2.5.9 6.9 0l.8 2.5C5.3 3.2 4 4.6 4 6.3h3.4V15H0zm16.6 0H9.2V8.2c0-4.3 2.5-7.3 6.9-8.2l.8 2.5c-2.4.7-3.7 2.1-3.7 3.8H24V15h-7.4z" />
              </svg>

              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={t.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
                >
                  <blockquote className="mt-5 max-w-[40ch] text-[21px] font-normal leading-[1.3] tracking-[-0.02em] text-ink sm:text-[26px]">
                    {t.quote}
                  </blockquote>

                  <div className="mt-6">
                    <Stars />
                  </div>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-hairline)] pt-5">
                    <Monogram name={t.name} />
                    <span>
                      <span className="block text-[14.5px] font-medium text-ink">
                        {t.name}
                      </span>
                      <span className="pb-micro mt-0.5 block normal-case tracking-normal">
                        {t.role}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-5 grid gap-px sm:grid-cols-3">
              {TESTIMONIALS.map((item, i) => {
                const on = i === active;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setActive(i);
                      setCycle((c) => c + 1);
                    }}
                    className="group relative border-t border-[var(--color-hairline)] pt-4 text-left"
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-px origin-left bg-ink transition-transform duration-500"
                      style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }}
                    />
                    <span
                      className="block text-[13.5px] font-medium transition-colors duration-400"
                      style={{
                        color: on
                          ? "var(--color-ink)"
                          : "color-mix(in oklab, var(--color-ink) 45%, transparent)",
                      }}
                    >
                      {item.name}
                    </span>
                    <span className="pb-micro mt-1 block normal-case tracking-normal">
                      {item.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </Rise>
        </div>
      </Container>
    </Section>
  );
}

