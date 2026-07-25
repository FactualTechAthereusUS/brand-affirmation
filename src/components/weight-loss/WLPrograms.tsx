import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import semaglutide from "@/assets/vial-semaglutide.png.asset.json";
import tirzepatide from "@/assets/vial-tirzepatide.png.asset.json";

const programs = [
  {
    img: semaglutide.url,
    badge: "GLP-1 Weekly Injectable",
    title: "Compounded Semaglutide",
    body:
      "Once-weekly injection. The same active molecule as Ozempic and Wegovy. Physician-prescribed and dose-matched to you.",
    price: "From $249/mo",
    small: "Same price when your dose goes up",
  },
  {
    img: tirzepatide.url,
    badge: "GLP-1 + GIP Weekly Injectable",
    title: "Compounded Tirzepatide",
    body:
      "Once-weekly injection. Dual-action. The same active molecule as Mounjaro and Zepbound. Clinical trials show up to 22% body weight reduction.",
    price: "From $299/mo",
    small: "Same price when your dose goes up",
  },
];

export function WLPrograms() {
  return (
    <section className="bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="mb-10 flex flex-col items-start gap-4 md:mb-14 md:items-center md:text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
              Your options
            </div>
            <h2 className="max-w-2xl text-[38px] leading-[1.02] font-medium tracking-tight text-ink md:text-[56px]">
              Physician-prescribed. <span className="font-serif italic font-normal text-ever">Same price.</span> Every dose.
            </h2>
            <p className="max-w-xl text-[15px] leading-[1.55] text-ink/60 md:text-[16px]">
              Two proven GLP-1 programs. Your physician recommends the right
              one based on your profile.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_40px_-24px_rgba(23,23,23,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(23,23,23,0.22)]">
                <div className="relative aspect-[5/4] overflow-hidden bg-[#f5f2ec]">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ee7273]">
                    {p.badge}
                  </span>
                  <h3 className="text-[22px] font-medium tracking-tight text-ink md:text-[26px]">
                    {p.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.55] text-ink/60">
                    {p.body}
                  </p>
                  <div className="mt-2">
                    <div className="text-[20px] font-semibold text-ink">
                      {p.price}
                    </div>
                    <div className="mt-1 text-[12px] text-ink/50">
                      {p.small}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className="mt-auto h-12 w-full rounded-full bg-ink text-[14px] font-medium text-white"
                  >
                    Get Started →
                  </motion.button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-[13px] text-ink/50 md:mt-10">
          Not sure which is right for you? Your physician will recommend the
          best option based on your health profile.
        </p>
      </div>
    </section>
  );
}
