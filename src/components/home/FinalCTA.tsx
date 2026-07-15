import { ArrowRight } from "lucide-react";
import { Reveal } from "../Reveal";

export function FinalCTA() {
  return (
    <section className="bg-ever px-6 py-20 text-canvas md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-[40px] leading-[1.05] text-canvas md:text-[64px]">
            Ready to start
            <br />
            <span className="italic">becoming?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-[16px] leading-[1.5] text-canvas/75 md:text-[18px]">
            Free assessment. No commitment.
            <br />
            Physician review within 24 hours.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-canvas transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto md:h-14">
              Take Your Assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button className="h-[52px] w-full rounded-full border-[1.5px] border-canvas bg-transparent px-7 text-[15px] font-medium text-canvas transition-colors hover:bg-canvas hover:text-ink sm:w-auto md:h-14">
              Explore Treatments
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-5 text-[12px] text-canvas/55">
            Free to start · No credit card required · Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}
