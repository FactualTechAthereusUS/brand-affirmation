import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import weightImg from "@/assets/cat-weight.png.asset.json";
import skinImg from "@/assets/cat-skin.png.asset.json";
import hairImg from "@/assets/cat-hair.png.asset.json";
import sexualImg from "@/assets/cat-sexual.png.asset.json";
import mensImg from "@/assets/cat-mens.png.asset.json";
import longevityImg from "@/assets/cat-longevity.png.asset.json";
import menopauseImg from "@/assets/cat-menopause.png.asset.json";

const cards = [
  {
    tag: "GLP-1 · Semaglutide · Tirzepatide",
    title: "Weight Loss",
    sub: "From $249/mo",
    image: weightImg.url,
    position: "object-center",
  },
  {
    tag: "Prescription Skincare",
    title: "Skin Care",
    sub: "From $89/mo",
    image: skinImg.url,
    position: "object-center",
  },
  {
    tag: "Regrowth · Finasteride · Minoxidil",
    title: "Hair Care",
    sub: "From $29/mo",
    image: hairImg.url,
    position: "object-top",
  },
  {
    tag: "ED · Libido · Performance",
    title: "Sexual Health",
    sub: "From $79/mo",
    image: sexualImg.url,
    position: "object-center",
  },
  {
    tag: "Testosterone · Vitality · Focus",
    title: "Men's Health",
    sub: "From $99/mo",
    image: mensImg.url,
    position: "object-top",
  },
  {
    tag: "NAD+ · Peptides · HRT",
    title: "Longevity",
    sub: "From $149/mo",
    image: longevityImg.url,
    position: "object-center",
  },
  {
    tag: "HRT · Hormone Balance · Relief",
    title: "Menopause",
    sub: "From $119/mo",
    image: menopauseImg.url,
    position: "object-top",
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

        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4 md:gap-5">
          {cards.map((c, i) => {
            // Desktop layout: first card spans 2 cols x 2 rows (large hero), rest fill
            const featured = i === 0;
            return (
              <Reveal key={c.title} delay={i * 0.05}>
                <a
                  href="#"
                  className={`group relative block overflow-hidden rounded-3xl ${
                    featured
                      ? "aspect-square md:col-span-2 md:row-span-2 md:aspect-auto md:h-full"
                      : "aspect-square md:aspect-[4/5]"
                  }`}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${c.position}`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(23,23,23,0.55)_75%,rgba(23,23,23,0.85)_100%)]" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <span className="mb-3 w-fit rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] text-white backdrop-blur-md">
                      {c.tag}
                    </span>
                    <h3 className={`font-display leading-tight text-white ${featured ? "text-[26px] md:text-[38px]" : "text-[19px] md:text-[24px]"}`}>
                      {c.title}
                    </h3>
                    <p className="mt-1 text-[13px] text-white/80 md:text-[14px]">{c.sub}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-11 md:w-11">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </div>
                </a>
              </Reveal>
            );
          })}
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
