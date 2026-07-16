import { ArrowRight } from "lucide-react";
import { Reveal } from "../Reveal";

const steps = [
  {
    n: "01",
    title: "Assessment",
    body: "4-minute intake. Tell us about yourself, your goals, and your health history.",
  },
  {
    n: "02",
    title: "Medical Review",
    body: "A board-certified physician reviews your case within 24 hours and writes your prescription.",
  },
  {
    n: "03",
    title: "Delivered",
    body: "Your medication arrives from a licensed US pharmacy. Same price at every dose. Forever.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ink px-6 py-16 text-canvas md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-canvas md:text-[52px]">
            Getting started
            <br />
            <span className="italic text-mist">should feel simple.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-3 text-[15px] text-canvas/60 md:text-[17px]">
            From assessment to delivery in as little as 3 days.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 text-left md:mt-16 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div>
                <div className="font-sans text-[48px] leading-none text-ever md:text-[64px]">
                  {s.n}
                </div>
                <h3 className="mt-4 font-sans text-[20px] font-semibold text-canvas">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-canvas/65 md:text-[15px]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <button className="group mx-auto mt-12 flex h-[52px] w-full max-w-md items-center justify-center gap-2 rounded-full bg-canvas px-7 text-[15px] font-medium text-ink transition-transform hover:scale-[1.01] active:scale-[0.98] md:h-14">
            Start Your Free Assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
