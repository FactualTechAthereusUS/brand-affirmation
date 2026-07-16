import { Reveal } from "../Reveal";

const stats = [
  { n: "3,000+", label: "Patients treated" },
  { n: "4.8★", label: "Average rating" },
  { n: "24hrs", label: "Physician review" },
  { n: "50", label: "Nationwide coverage", sub: "states" },
];

export function Numbers() {
  return (
    <section className="bg-canvas px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div
                className={`text-center ${
                  i % 2 === 1 ? "border-l border-hairline" : ""
                } ${i < 2 ? "border-b border-hairline pb-10 md:border-b-0 md:pb-0" : ""} ${
                  i >= 2 ? "pt-10 md:pt-0" : ""
                } md:${i > 0 ? "border-l" : ""}`}
              >
                <div className="font-sans text-[44px] leading-none text-ever md:text-[64px]">
                  {s.n}
                  {s.sub && (
                    <span className="ml-1 font-sans text-[16px] font-normal text-ever/70">
                      {s.sub}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[14px] text-[#6B6B6B] md:text-[15px]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
