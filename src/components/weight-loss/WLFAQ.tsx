import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const faqs = [
  {
    q: "Is compounded semaglutide the same as Ozempic?",
    a: "The active molecule is identical. Semaglutide. Compounded semaglutide is manufactured at a licensed US 503A compounding pharmacy under your physician's specific prescription. It has not been evaluated by the FDA for safety, efficacy, or quality the way Ozempic has. Your physician will determine if it is appropriate for you.",
  },
  {
    q: "What does same price at every dose actually mean?",
    a: "Your price never goes up when your dose goes up. $249 at the starting dose. $249 at the maximum dose. Same price. Always. Most GLP-1 providers charge more as your dose increases. We don't. Ever.",
  },
  {
    q: "How fast will I see results?",
    a: "Most patients notice appetite changes in weeks 1 to 2. Measurable weight loss typically begins weeks 3 to 4. Results compound month over month as your dose titrates up. Individual results vary.",
  },
  {
    q: "I'm scared of injections. Is it really that simple?",
    a: "The needle is shorter and thinner than a diabetic insulin syringe. Most patients describe it as a minor pinch or nothing at all. Your kit ships with a step-by-step injection guide and your physician is available to walk you through it if needed.",
  },
  {
    q: "Do I need insurance?",
    a: "No. No insurance, no prior authorization, no referrals. Everything is included in your program price.",
  },
  {
    q: "Can I actually cancel anytime?",
    a: "Yes. One click inside your patient portal. No phone call. No hold music. No forms. Cancel today and it is done today.",
  },
  {
    q: "I am already on a GLP-1 from another provider. Do I have to start over?",
    a: "No. Your physician will match your current dose. You pick up exactly where you left off. Just note your current medication and dose in your intake form.",
  },
  {
    q: "What if my physician does not approve me?",
    a: "Full refund. Immediately. No questions asked. If our physician determines you are not a candidate based on your health profile, you pay nothing and every cent is returned.",
  },
];

export function WLFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-canvas px-5 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-[30px] leading-[1.1] text-ink sm:text-[34px] md:text-[52px]">
            Common <span className="italic text-ever">questions.</span>
          </h2>
        </Reveal>

        <div className="mt-8 md:mt-14">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-hairline">
                <motion.button
                  onClick={() => setOpen(isOpen ? null : i)}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="flex min-h-[64px] w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[15px] font-medium text-ink sm:text-[16px] md:text-[17px]">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="shrink-0 text-ever"
                  >
                    <Plus className="h-6 w-6" strokeWidth={1.5} />
                  </motion.span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-6 text-[14.5px] leading-[1.7] text-[#6B6B6B] sm:pr-10 sm:text-[15px]">
                        {f.a}
                      </p>
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
