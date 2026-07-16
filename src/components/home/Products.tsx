import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import semaglutide from "@/assets/vial-semaglutide.png.asset.json";
import tirzepatide from "@/assets/vial-tirzepatide.png.asset.json";

const products = [
  {
    img: semaglutide.url,
    badge: "GLP-1 Injectable",
    title: "Compounded Semaglutide",
    desc: "Once-weekly injection. Physician-prescribed. Same price at every dose level.",
    price: "From $249/mo",
    link: "What is semaglutide?",
  },
  {
    img: tirzepatide.url,
    badge: "GLP-1 + GIP Injectable",
    title: "Compounded Tirzepatide",
    desc: "Once-weekly injection. Dual-action GLP-1 and GIP receptor agonist.",
    price: "From $299/mo",
    link: "What is tirzepatide?",
  },
];

export function Products() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const width = slider.offsetWidth;
      const newIndex = Math.round(scrollLeft / (width * 0.78));
      setActiveIndex(Math.min(Math.max(newIndex, 0), products.length - 1));
    };

    slider.addEventListener("scroll", onScroll, { passive: true });
    return () => slider.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="mb-10 md:mb-14 flex items-end justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
                Personalized care
              </div>
              <h2 className="max-w-2xl text-[38px] leading-[1.02] md:text-[64px] font-medium tracking-tight text-ink">
                Treatments <span className="font-serif italic font-normal">tailored</span> to you
              </h2>
            </div>
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-ink/70 underline underline-offset-4 hover:text-ink"
            >
              View all treatments
            </a>
          </div>
        </Reveal>

        {/* Mobile: snap slider with peek. Desktop: 2-up compact grid */}
        <div className="-mx-5 md:mx-0">
          <div
            ref={sliderRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scroll-px-6 md:mx-auto md:grid md:max-w-3xl md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0"
            style={{ WebkitOverflowScrolling: "touch", scrollPaddingLeft: "24px", scrollPaddingRight: "24px" }}
          >
            {products.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="group flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col md:w-auto md:max-w-none">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#f5f2ec]">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                     loading="lazy" decoding="async" />
                  </div>

                  {/* Text */}
                  <div className="mt-3.5 flex flex-col gap-1.5 px-0.5">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#ee7273]">
                      {p.badge}
                    </span>
                    <h3 className="text-[16px] md:text-[17px] font-medium tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="text-[12.5px] leading-snug text-ink/55">{p.desc}</p>
                    <div className="mt-0.5 text-[13.5px] font-semibold text-ink">{p.price}</div>

                    <button className="mt-2.5 h-10 w-full rounded-full bg-ink text-[13px] font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]">
                      Get Started
                    </button>
                    <a
                      href="#"
                      className="mt-1 text-center text-[11.5px] text-ink/50 underline underline-offset-4 hover:text-ink"
                    >
                      {p.link}
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Mobile pagination */}
          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {products.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-4 bg-ink" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center md:hidden">
          <a href="#" className="text-sm text-ink/70 underline underline-offset-4">
            View all treatments
          </a>
        </div>
      </div>
    </section>
  );
}
