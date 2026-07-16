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

        {/* Mobile: snap slider with peek. Desktop: 2-up grid */}
        <div className="-mx-5 md:mx-0">
          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:grid md:snap-none md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="group flex w-[85vw] max-w-[420px] shrink-0 snap-start flex-col md:w-auto md:max-w-none">
                  {/* Image fills the card top */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#f5f2ec]">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Text */}
                  <div className="mt-5 flex flex-col gap-2 px-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ee7273]">
                      {p.badge}
                    </span>
                    <h3 className="text-[22px] md:text-[26px] font-medium tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-ink/55">{p.desc}</p>
                    <div className="mt-1 text-[16px] font-semibold text-ink">{p.price}</div>

                    <button className="mt-4 h-12 w-full rounded-full bg-ink text-sm font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]">
                      Get Started
                    </button>
                    <a
                      href="#"
                      className="mt-2 text-center text-[13px] text-ink/50 underline underline-offset-4 hover:text-ink"
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
          <a href="#" className="text-sm text-ink/70 underline underline-offset-4">
            View all treatments
          </a>
        </div>
      </div>
    </section>
  );
}
