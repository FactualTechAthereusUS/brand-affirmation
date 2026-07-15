import { Stethoscope, Package, Lock, User } from "lucide-react";
import { Reveal } from "../Reveal";

const items = [
  {
    icon: Stethoscope,
    title: "Doctor-guided. Always.",
    sub: "Board-certified US physicians review every case personally.",
  },
  {
    icon: Package,
    title: "Delivered to your door.",
    sub: "Licensed US pharmacies. Discreet packaging. Temperature-controlled.",
  },
  {
    icon: Lock,
    title: "Same price. Every dose.",
    sub: "Your price never goes up — not when your dose increases, not ever.",
  },
  {
    icon: User,
    title: "Made for you, not the masses.",
    sub: "Every protocol is personalized. No cookie-cutter treatment plans.",
  },
];

export function WhyBlissley() {
  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            Healthcare built
            <br />
            <span className="italic text-ever">differently.</span>
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.05}>
              <div className="flex items-start gap-5 border-b border-hairline py-6 last:border-b-0 md:gap-7 md:py-8">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canvas md:h-14 md:w-14">
                  <it.icon className="h-5 w-5 text-ever md:h-6 md:w-6" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <h3 className="font-sans text-[17px] font-semibold text-ink md:text-[20px]">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#6B6B6B] md:text-[16px]">{it.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
