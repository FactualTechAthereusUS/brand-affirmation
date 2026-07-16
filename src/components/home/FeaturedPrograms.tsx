import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import { Placeholder } from "./Placeholder";

const programs = [
  {
    tag: "GLP-1 Programs",
    title: ["Lose weight.", "Keep it off."],
    sub: "Physician-prescribed semaglutide and tirzepatide.",
    label: "Weight Loss — hiker, landscape",
    tone: "sage" as const,
  },
  {
    tag: "Prescription Skincare",
    title: ["Your skin,", "transformed."],
    sub: "Physician-formulated for your skin type.",
    label: "Skin — warm morning light, glowing skin",
    tone: "clay" as const,
  },
  {
    tag: "Sexual Wellness",
    title: ["Confidence,", "restored."],
    sub: "Discreet. Effective. Physician-supervised.",
    label: "Sexual Health — couple outdoors, warm",
    tone: "warm" as const,
  },
];

export function FeaturedPrograms() {
  return (
    <section className="bg-canvas px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            Your program,
            <br />
            <span className="italic text-ever">your terms.</span>
          </h2>
          <p className="mt-3 text-[16px] text-[#6B6B6B] md:text-[18px]">
            Physician-supervised. Discreet. Delivered.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 md:mt-14 md:grid md:grid-cols-3 md:gap-6">
          {programs.map((p, i) => (
            <Reveal key={p.tag} delay={i * 0.08}>
              <a
                href="#"
                className="group relative block h-[320px] overflow-hidden rounded-3xl md:h-[520px]"
              >
                <Placeholder label={p.label} tone={p.tone} className="h-full w-full" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(23,23,23,0.75)_100%)]" />

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="mb-3 w-fit rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] text-white backdrop-blur-md">
                    {p.tag}
                  </span>
                  <h3 className="font-sans text-[26px] leading-[1.1] text-white md:text-[32px]">
                    {p.title[0]}
                    <br />
                    <span className="italic">{p.title[1]}</span>
                  </h3>
                  <p className="mt-2 max-w-[22ch] text-[14px] text-white/70 md:text-[15px]">
                    {p.sub}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[14px] text-white underline underline-offset-4">
                      Explore
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
