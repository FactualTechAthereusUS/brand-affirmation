import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import { Placeholder } from "./Placeholder";

const cards = [
  {
    tag: "GLP-1 · Semaglutide · Tirzepatide",
    title: "Weight Loss",
    sub: "From $249/mo",
    label: "Weight Loss — hiker, warm light",
    tone: "sage" as const,
  },
  {
    tag: "Prescription Skincare",
    title: "Skin & Hair",
    sub: "From $89/mo",
    label: "Skin — glowing skin, natural light",
    tone: "clay" as const,
  },
  {
    tag: "ED · Libido · Wellness",
    title: "Sexual Health",
    sub: "From $79/mo",
    label: "Sexual Health — couple laughing",
    tone: "warm" as const,
  },
  {
    tag: "NAD+ · HRT · TRT",
    title: "Longevity",
    sub: "From $149/mo",
    label: "Longevity — energy, morning light",
    tone: "morning" as const,
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-canvas px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-md text-[34px] leading-[1.1] text-ink md:text-[52px]">
            What can we
            <br />
            <span className="italic text-ever">help you with?</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-14 md:gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href="#"
                className="group relative block aspect-square overflow-hidden rounded-3xl md:aspect-[4/5]"
              >
                <Placeholder label={c.label} tone={c.tone} className="h-full w-full" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(23,23,23,0.78)_100%)]" />

                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <span className="mb-3 w-fit rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] text-white backdrop-blur-md">
                    {c.tag}
                  </span>
                  <h3 className="font-display text-[19px] leading-tight text-white md:text-[26px]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-white/75 md:text-[14px]">{c.sub}</p>
                </div>

                <div className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-11 md:w-11">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ever underline-offset-4 hover:underline"
            >
              View all treatments
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
