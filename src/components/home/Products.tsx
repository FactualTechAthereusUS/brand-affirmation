import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import semaglutide from "@/assets/vial-semaglutide.png.asset.json";
import tirzepatide from "@/assets/vial-tirzepatide.png.asset.json";

const products = [
  {
    img: semaglutide.url,
    badge: "GLP-1 Injectable",
    title: "Compounded Semaglutide",
    desc: "Once-weekly injection. Physician-prescribed. Same price at every dose level. FDA-approved molecule.",
    price: "From $249/mo",
    link: "What is semaglutide?",
    bg: "linear-gradient(135deg, #fff5f6 0%, #ffe8ea 100%)",
  },
  {
    img: tirzepatide.url,
    badge: "GLP-1 + GIP Injectable",
    title: "Compounded Tirzepatide",
    desc: "Once-weekly injection. Dual-action GLP-1 and GIP receptor agonist. Physician-prescribed at every dose.",
    price: "From $299/mo",
    link: "What is tirzepatide?",
    bg: "linear-gradient(135deg, #f4f4f8 0%, #ecebf3 100%)",
  },
];

export function Products() {
  return (
    <section className="bg-canvas py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="mb-10 md:mb-14 flex items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
                Personalized care
              </div>
              <h2 className="mt-4 max-w-2xl text-[34px] leading-[1.05] md:text-[52px] font-medium tracking-tight text-ink">
                Treatment paths <span className="font-serif italic font-normal">tailored</span> to your needs
              </h2>
            </div>
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-ink transition-colors"
            >
              View all treatments <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="-mx-5 md:mx-0">
          <div
            className="no-scrollbar flex gap-4 overflow-x-auto px-5 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article
                  className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-white md:w-auto"
                  style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}
                >
                  {/* Image */}
                  <div
                    className="relative flex h-[220px] items-center justify-center md:h-[380px]"
                    style={{ background: p.bg }}
                  >
                    <img
                      src={p.img}
                      alt={p.title}
                      className="h-[85%] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur">
                      <ArrowRight className="h-4 w-4 -rotate-45 text-ink" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                    <span
                      className="self-start rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: "#fde8ea", color: "#ee7273" }}
                    >
                      {p.badge}
                    </span>
                    <h3 className="font-serif text-[22px] md:text-[26px] leading-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink/60">{p.desc}</p>
                    <div className="mt-1 text-[17px] font-semibold text-ink">{p.price}</div>

                    <button className="mt-3 h-12 w-full rounded-xl bg-ink text-sm font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]">
                      Get Started
                    </button>
                    <a
                      href="#"
                      className="mt-1 text-center text-[13px] text-ink/50 underline-offset-4 hover:text-ink hover:underline"
                    >
                      {p.link}
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-ink/70">
            View all treatments <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
