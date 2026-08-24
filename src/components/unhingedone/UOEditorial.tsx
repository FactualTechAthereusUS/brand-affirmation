import { Rise } from "./uo";

/**
 * Section 7 — Comfrt's two-up editorial banners. The second panel is the
 * comfort proof: it earns the price before anyone asks.
 */
export function UOEditorial() {
  return (
    <section id="proud-of" className="mx-auto grid max-w-[1440px] gap-3 px-4 pb-14 md:grid-cols-2 md:gap-5 md:px-8 md:pb-20">
      <Rise>
        <Panel
          img="/assets/uo-hero-matching-set.jpg"
          alt="Two friends laughing in matching cream crewnecks"
          eyebrow="The Matching Set"
          title="Nobody Buys One"
          cta="Shop now"
        />
      </Rise>
      <Rise delay={0.08}>
        <Panel
          img="/assets/uo-fabric-400gsm.jpg"
          alt="Macro detail of heavyweight 400gsm brushed fleece"
          eyebrow="400 GSM"
          title="We Stopped Printing On Cheap Blanks"
          cta="Shop now"
        />
      </Rise>
    </section>
  );
}

function Panel({
  img,
  alt,
  eyebrow,
  title,
  cta,
}: {
  img: string;
  alt: string;
  eyebrow: string;
  title: string;
  cta: string;
}) {
  return (
    <a href="#best-sellers" className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[16/10] md:aspect-[4/3]">
      <img
        src={img}
        alt={alt}
        width={1600}
        height={1104}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/78 via-[#0b0b0b]/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-[#f4f1ea] md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f4f1ea]/70">{eyebrow}</p>
        <h3 className="uo-display mt-2 max-w-[420px] text-[28px] leading-[0.94] md:text-[38px]">{title}</h3>
        <span className="mt-4 inline-flex items-center gap-2 border-b border-[#f4f1ea]/50 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-transform duration-500 group-hover:translate-x-1">
          {cta}
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );
}
