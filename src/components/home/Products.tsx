import { ArrowUpRight } from "lucide-react";
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
  {
    img: semaglutide.url,
    badge: "Coming soon",
    title: "Skin & Anti-aging",
    desc: "Prescription-grade tretinoin and personalized skincare formulas.",
    price: "From $29/mo",
    link: "Explore skin care",
  },
  {
    img: tirzepatide.url,
    badge: "Coming soon",
    title: "Sexual Wellness",
    desc: "Discreet ED treatment, physician-reviewed. Generic and brand options.",
    price: "From $19/mo",
    link: "Explore ED treatment",
  },
];

export function Products() {
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
              View shop
            </a>
          </div>
        </Reveal>

        {/* Horizontal snap slider on mobile, 4-up on desktop */}
        <div className="-mx-5 md:mx-0">
          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((p, i) => (
              <Reveal key={p.title + i} delay={i * 0.06}>
                <a
                  href="#"
                  className="group flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col md:w-auto md:max-w-none"
                >
                  {/* Image area — no bg tint, full vial visible, subtle canvas card */}
                  <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#f5f2ec]">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <button
                      aria-label="Favorite"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Text */}
                  <div className="mt-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ee7273]">
                      {p.badge}
                    </span>
                    <h3 className="text-[18px] md:text-[20px] font-medium tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-ink/55">{p.desc}</p>
                    <div className="mt-1 text-[15px] font-semibold text-ink">{p.price}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <a href="#" className="text-sm text-ink/70 underline underline-offset-4">
            View shop
          </a>
        </div>
      </div>
    </section>
  );
}
