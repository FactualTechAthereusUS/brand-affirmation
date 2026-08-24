import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { IconArrow, UO_EASE, Words } from "./uo";
import { cn } from "@/lib/utils";

type Slide = {
  img: string;
  /** Portrait crop used below md so the print is never cropped out. */
  imgMobile?: string;
  alt: string;
  eyebrow: string;
  title: string;
  line: string;
  cta: string;
  /** Crop bias so faces and prints stay in frame. */
  position: string;
  positionMobile?: string;
};

const SLIDES: Slide[] = [
  {
    img: "/assets/uo-hero-reaction.jpg",
    imgMobile: "/assets/uo-reaction-left.jpg",
    alt: "Two people wearing the Emotional Labor crewneck, print front and centre",
    eyebrow: "Sold out twice",
    title: "The Restock",
    line: "Back October 25. 1,088 of 1,500 already claimed.",
    cta: "Shop the drop",
    position: "50% 22%",
    positionMobile: "50% 18%",
  },

  {
    img: "/assets/uo-hero-matching-set.jpg",
    alt: "Two people laughing in matching cream crewnecks, one pointing at the other's print",
    eyebrow: "Nobody buys one",
    title: "The Matching Set",
    line: "One of you starts it. The other one finishes it.",
    cta: "Shop the set",
    position: "50% 35%",
  },
  {
    img: "/assets/uo-fabric-400gsm.jpg",
    alt: "Macro detail of 400gsm brushed fleece and a stitched cuff seam",
    eyebrow: "400 GSM",
    title: "We Stopped Printing On Cheap Blanks",
    line: "Heavyweight brushed fleece. Zero pilling after 30 washes.",
    cta: "Feel the difference",
    position: "50% 50%",
  },
];

/**
 * Section 3 — full-bleed hero carousel. Comfrt's chassis: arrows both sides,
 * dot indicators, copy bottom-left. Reaction shots, never product-on-hanger.
 */
export function UOHero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => setI((p) => (p + n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(t);
  }, [go, paused]);

  const s = SLIDES[i]!;

  return (
    <section
      id="shop-all"
      aria-label="Featured"
      className="relative isolate overflow-hidden bg-[#0b0b0b]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[78vh] min-h-[520px] w-full md:h-[86vh] md:min-h-[620px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={s.img}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9, ease: UO_EASE }, scale: { duration: 8, ease: "linear" } }}
            className="absolute inset-0"
          >
            {s.imgMobile ? (
              <img
                src={s.imgMobile}
                alt={s.alt}
                width={640}
                height={1072}
                className="absolute inset-0 h-full w-full object-cover md:hidden"
                style={{ objectPosition: s.positionMobile ?? s.position }}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            ) : null}
            <img
              src={s.img}
              alt={s.alt}
              width={1600}
              height={1104}
              className={cn("absolute inset-0 h-full w-full object-cover", s.imgMobile && "hidden md:block")}
              style={{ objectPosition: s.position }}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </motion.div>
        </AnimatePresence>


        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/80 via-[#0b0b0b]/10 to-[#0b0b0b]/25" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-12 md:px-8 md:pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: UO_EASE }}
              className="max-w-[720px] text-[#f4f1ea]"
            >
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#f4f1ea]/70">
                {s.eyebrow}
              </p>
              <h1 className="uo-display mt-3 text-[40px] leading-[0.9] sm:text-[62px] md:text-[86px]">
                <Words text={s.title} />
              </h1>
              <p className="mt-3 max-w-[440px] text-[14px] text-[#f4f1ea]/80 md:text-[15px]">{s.line}</p>
              <a href="#best-sellers" className="uo-btn uo-btn-light mt-6 inline-flex">
                {s.cta}
                <IconArrow className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* arrows */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-4 md:flex">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="pointer-events-auto rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur-sm transition hover:bg-black/40"
          >
            <IconArrow dir="left" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="pointer-events-auto rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur-sm transition hover:bg-black/40"
          >
            <IconArrow className="h-4 w-4" />
          </button>
        </div>

        {/* dots */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2 md:bottom-7 md:right-8">
          {SLIDES.map((sl, n) => (
            <button
              key={sl.img}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Go to slide ${n + 1}`}
              className={cn(
                "h-[3px] transition-all duration-500",
                n === i ? "w-9 bg-[#f4f1ea]" : "w-4 bg-[#f4f1ea]/40",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
