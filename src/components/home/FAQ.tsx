import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal } from "../Reveal";

const faqs = [
  {
    q: "Is compounded GLP-1 safe?",
    a: "Yes. The same active molecule as Ozempic and Wegovy — manufactured at FDA-registered 503A licensed US compounding pharmacies under your physician's prescription.",
  },
  {
    q: "Do I need insurance?",
    a: "No. No insurance, no prior authorization, no referrals. Physician review is included in every program.",
  },
  {
    q: "What does 'same price at every dose' mean?",
    a: "Your price never increases when your dose goes up. Starting dose or maximum dose — same price. Always. Every competitor we know of charges more as doses increase. We don't.",
  },
  {
    q: "How fast does it work?",
    a: "Most patients notice appetite changes in weeks 1-2. Measurable weight changes typically begin weeks 3-4.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One click in your patient portal. No phone call. No forms. Cancel today, done today.",
  },
  {
    q: "I'm already on a GLP-1. Do I start over?",
    a: "No. Your physician matches your current dose. You continue where you left off.",
  },
  {
    q: "How does the physician review work?",
    a: "After your 4-minute assessment, a board-certified physician reviews your health profile personally. Not a chatbot. Not an algorithm. A real physician. Within 24 hours.",
  },
  {
    q: "What if my physician doesn't approve me?",
    a: "Full refund. Immediately. No questions asked.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-canvas px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            Common <span className="italic text-ever">questions.</span>
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-hairline">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-[64px] w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[16px] font-medium text-ink md:text-[17px]">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-ever"
                  >
                    <Plus className="h-6 w-6" strokeWidth={1.5} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-[15px] leading-[1.7] text-[#6B6B6B]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
