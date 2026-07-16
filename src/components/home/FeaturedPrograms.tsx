import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import weightImg from "@/assets/program-weight.png.asset.json";
import skinImg from "@/assets/program-skin.png.asset.json";
import sexualImg from "@/assets/program-sexual.png.asset.json";

const programs = [
  {
    tag: "GLP-1 Programs",
    title: ["Lose weight.", "Keep it off."],
    sub: "Physician-prescribed semaglutide and tirzepatide.",
    img: weightImg.url,
    pos: "object-[50%_40%]",
  },
  {
    tag: "Prescription Skincare",
    title: ["Your skin,", "transformed."],
    sub: "Physician-formulated for your skin type.",
    img: skinImg.url,
    pos: "object-[50%_55%]",
  },
  {
    tag: "Sexual Wellness",
    title: ["Confidence,", "restored."],
    sub: "Discreet. Effective. Physician-supervised.",
    img: sexualImg.url,
    pos: "object-[50%_45%]",
  },
];

function ProgramCard({ p, index }: { p: (typeof programs)[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.03, 1, 1.03]);

  return (
    <Reveal delay={index * 0.08}>
      <a
        ref={ref}
        href="#"
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl bg-neutral-200"
      >
        <motion.img
          src={p.img}
          alt={p.tag}
          style={{ y, scale }}
          className={`absolute inset-0 h-full w-full object-cover ${p.pos}`}
          loading="lazy"
        />
        {/* bottom blur/gradient for text legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.55) 40%, rgba(10,10,10,0) 100%)",
            backdropFilter: "blur(0px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%]"
          style={{
            backdropFilter: "blur(8px)",
            WebkitMaskImage:
              "linear-gradient(to top, black 30%, transparent 100%)",
            maskImage:
              "linear-gradient(to top, black 30%, transparent 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <h3 className="text-[26px] font-semibold leading-[1.1] tracking-tight text-white md:text-[30px]">
            {p.title[0]}
            <br />
            {p.title[1]}
          </h3>
          <p className="mt-2 max-w-[20ch] text-[14px] leading-snug text-white/80 md:max-w-[22ch] md:text-[15px]">
            {p.sub}
          </p>

          {/* arrow CTA */}
          <span className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25 md:bottom-7 md:right-7 md:h-12 md:w-12">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-5 md:w-5" strokeWidth={2} />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

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

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {programs.map((p, i) => (
            <ProgramCard key={p.tag} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
