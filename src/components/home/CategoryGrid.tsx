import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "../Reveal";
import weightImg from "@/assets/cat-weight.png.asset.json";
import skinImg from "@/assets/cat-skin.png.asset.json";
import hairImg from "@/assets/cat-hair.png.asset.json";
import sexualImg from "@/assets/cat-sexual.png.asset.json";
import mensImg from "@/assets/cat-mens.png.asset.json";
import longevityImg from "@/assets/cat-longevity.png.asset.json";
import menopauseImg from "@/assets/cat-menopause.png.asset.json";

const cards = [
  { title: "Weight Loss", sub: "From $249/mo", image: weightImg.url, position: "object-center" },
  { title: "Menopause", sub: "From $119/mo", image: menopauseImg.url, position: "object-top" },
  { title: "Longevity", sub: "From $149/mo", image: longevityImg.url, position: "object-center" },
  { title: "Skin Care", sub: "From $89/mo", image: skinImg.url, position: "object-center" },
  { title: "Hair Care", sub: "From $29/mo", image: hairImg.url, position: "object-top" },
  { title: "Sexual Health", sub: "From $79/mo", image: sexualImg.url, position: "object-center" },
  { title: "Men's Health", sub: "From $99/mo", image: mensImg.url, position: "object-top" },
];

export function CategoryGrid() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="bg-canvas px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[34px] leading-[1.05] text-ink md:text-[56px]">
              What can we help you <span className="italic">with?</span>
            </h2>
            <div className="hidden items-center gap-3 md:flex">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                All our Treatments
              </a>
              <div className="ml-2 flex gap-2">
                <button
                  aria-label="Previous"
                  onClick={() => scrollBy(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-black/[0.04] text-ink transition-colors hover:bg-black/[0.08]"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <button
                  aria-label="Next"
                  onClick={() => scrollBy(1)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-black/[0.04] text-ink transition-colors hover:bg-black/[0.08]"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile: stacked column */}
        <div className="mt-8 flex flex-col gap-4 md:hidden">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05} blur={14} y={30}>
              <a href="#" className="group relative block aspect-[4/3] overflow-hidden rounded-3xl">
                <img
                  src={c.image}
                  alt={c.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${c.position}`}
                 loading="lazy" decoding="async" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(23,23,23,0.55)_78%,rgba(23,23,23,0.9)_100%)]" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="font-sans text-[30px] leading-tight text-white">{c.title}</h3>
                  <p className="mt-1 font-sans text-[13px] text-white/80">{c.sub}</p>
                </div>
                <div className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Desktop: horizontal snap slider */}
        <div className="relative mt-12 hidden md:block">
          <div
            ref={trackRef}
            className="scroll-smooth flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.04} blur={14} y={30} className="snap-start shrink-0">
                <a
                  data-card
                  href="#"
                  className="group relative block h-[520px] w-[380px] overflow-hidden rounded-3xl lg:h-[560px] lg:w-[420px]"
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${c.position}`}
                   loading="lazy" decoding="async" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(23,23,23,0.55)_80%,rgba(23,23,23,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col p-6">
                    <h3 className="font-sans text-[34px] leading-tight text-white">{c.title}</h3>
                    <p className="mt-1 font-sans text-[14px] text-white/80">{c.sub}</p>
                  </div>
                  <div className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
