import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Container, MicroLabel, Reveal, Section, TwoTone } from "./primitives";

export type FaqItem = { q: string; a: string };

/** Accordion FAQ. Pair with `faqSchema` so the copy and the schema never drift. */
export function Faq({
  items,
  eyebrow = "FAQ",
  lead = "Questions operators ask",
  trail,
  band = false,
}: {
  items: FaqItem[];
  eyebrow?: string;
  lead?: string;
  trail?: string;
  band?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section band={band}>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">{eyebrow}</MicroLabel>
          <TwoTone lead={lead} trail={trail} className="max-w-[760px]" />
        </Reveal>

        <div className="mt-10 max-w-[840px] divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="min-w-0 text-[16px] font-medium leading-snug text-ink sm:text-[17px]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-[var(--color-hairline)]"
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative block size-3"
                    >
                      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-ink" />
                      <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-ink" />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-body max-w-[680px] pb-6 pr-8 text-[15px] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/** FAQPage JSON-LD built from the same items rendered above. */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}
