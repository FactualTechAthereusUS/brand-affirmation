import { Rail, Rise, SectionHead } from "./uo";
import { TARGETS } from "./data";
import { cn } from "@/lib/utils";

const TONE = {
  ink: "bg-[#141414] text-[#f2efe8]",
  red: "bg-uo-red text-[#fff8f3]",
  cream: "bg-[#e3ded2] text-ink",
} as const;

/**
 * Section 6 — Alo's "Shop By Color", retargeted. She shops at someone, so the
 * taxonomy is the target, not the silhouette.
 */
export function UOTargets() {
  return (
    <section id="my-parents" className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
      <Rise>
        <SectionHead title="Shop By Who's Annoying You" sub="A better taxonomy than hoodies and sweatpants." />
      </Rise>

      <Rise delay={0.08} className="mt-7 md:mt-10">
        <Rail contentClassName="-mx-4 px-4 md:mx-0 md:px-0">
          {TARGETS.map((t) => (
            <a
              key={t.label}
              href="#best-sellers"
              className={cn(
                "uo-grain group relative flex w-[64%] max-w-[300px] shrink-0 snap-start flex-col justify-end overflow-hidden p-5 sm:w-[42%] md:w-[19%] md:min-w-0",
                "aspect-[3/4]",
                TONE[t.tone],
              )}
            >
              <span className="absolute right-4 top-4 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-45">
                {String(TARGETS.indexOf(t) + 1).padStart(2, "0")}
              </span>
              <span className="uo-display text-[26px] leading-[0.95] md:text-[30px]">{t.label}</span>
              <span className="mt-2 text-[12.5px] leading-snug opacity-70">{t.line}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] opacity-80 transition-transform duration-500 group-hover:translate-x-1">
                Shop
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </Rail>
      </Rise>
    </section>
  );
}
