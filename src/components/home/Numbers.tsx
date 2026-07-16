import { Reveal } from "../Reveal";
import { CountUp } from "../CountUp";

type Stat = {
  value: number;
  display?: (n: number) => string;
  suffix?: string;
  star?: boolean;
  label: string;
};

const stats: Stat[] = [
  { value: 30000, display: (n) => Math.round(n).toLocaleString("en-US"), suffix: "+", label: "Patients treated" },
  { value: 4.9, display: (n) => n.toFixed(1), star: true, label: "Average rating" },
  { value: 24, suffix: "hrs", label: "Physician review" },
  { value: 50, suffix: "states", label: "Nationwide coverage" },
];

export function Numbers() {
  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-4 md:gap-y-0">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div
                className={`flex items-baseline gap-3 md:flex-col md:items-start md:gap-4 md:px-6 ${
                  i > 0 ? "md:border-l md:border-black/10" : ""
                }`}
              >
                <div className="flex items-baseline text-ink">
                  <span className="font-sans text-[56px] font-extrabold leading-none tracking-[-0.03em] md:text-[68px]">
                    {s.n}
                  </span>
                  {s.suffix && (
                    <span className="ml-1 font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] md:text-[34px]">
                      {s.suffix}
                    </span>
                  )}
                  {s.star && (
                    <span className="ml-1.5 text-[36px] leading-none text-[#ee7273] md:text-[44px]">
                      ★
                    </span>
                  )}
                </div>
                <p className="max-w-[180px] text-[14px] leading-[1.35] text-[#6B6B6B] md:text-[15px]">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
