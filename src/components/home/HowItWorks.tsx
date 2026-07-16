import { ArrowRight } from "lucide-react";
import { Reveal } from "../Reveal";
import iconAssessment from "@/assets/how-assessment.png.asset.json";
import iconReview from "@/assets/how-review.png.asset.json";
import iconDelivered from "@/assets/how-delivered.png.asset.json";

const steps = [
  {
    n: "01",
    title: "Assessment",
    body: "4-minute intake. Tell us about yourself, your goals, and your health history.",
    icon: iconAssessment.url,
    tint: "bg-[#EEF0F8]",
  },
  {
    n: "02",
    title: "Medical Review",
    body: "A board-certified physician reviews your case within 24 hours and writes your prescription.",
    icon: iconReview.url,
    tint: "bg-[#EAF1F6]",
  },
  {
    n: "03",
    title: "Delivered",
    body: "Your medication arrives from a licensed US pharmacy. Same price at every dose. Forever.",
    icon: iconDelivered.url,
    tint: "bg-[#F6F1E7]",
  },
];

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
                <span className="italic text-ink/40">should feel simple.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-[15px] leading-[1.55] text-ink/60 md:text-[17px]">
                From assessment to delivery in as little as 3 days.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <button className="group mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/10 bg-ink px-7 text-[15px] font-medium text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Start Your Free Assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Reveal>
          </div>
        </div>

        {/* Right rows */}
        <div className="md:col-span-7">
          <div className="border-t border-ink/10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} blur={12}>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-ink/10 py-8 md:gap-8 md:py-12">
                  <div className="font-sans text-[44px] font-semibold leading-none text-ink/15 md:text-[64px]">
                    {s.n}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-ink md:text-[26px]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-ink/60 md:text-[15px]">
                      {s.body}
                    </p>
                  </div>
                  <div
                    className={`hidden h-[104px] w-[128px] shrink-0 items-center justify-center rounded-2xl ${s.tint} md:flex`}
                  >
                    <img src={s.icon} alt="" className="h-16 w-16 object-contain" />
                  </div>
                  <div
                    className={`col-span-3 -mt-2 flex h-[96px] items-center justify-center rounded-2xl ${s.tint} md:hidden`}
                  >
                    <img src={s.icon} alt="" className="h-14 w-14 object-contain" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
