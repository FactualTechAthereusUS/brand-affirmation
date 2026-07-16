import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import r20 from "@/assets/review-20.png.asset.json";
import r21 from "@/assets/review-21.png.asset.json";
import r23 from "@/assets/review-23.png.asset.json";
import r24 from "@/assets/review-24.png.asset.json";
import r25 from "@/assets/review-25.png.asset.json";
import r26 from "@/assets/review-26.png.asset.json";
import r27 from "@/assets/review-27.png.asset.json";
import r28 from "@/assets/review-28.png.asset.json";

type Review = {
  lead: string;
  body: string;
  name: string;
  meta: string;
  image: string;
};

const M = [r20.url, r21.url, r28.url];
const W = [r23.url, r24.url, r25.url, r26.url, r27.url];

const reviews: Review[] = [
  {
    lead: "The food noise is just gone.",
    body:
      "The constant negotiating with myself about food. What did I just eat. I already ruined today. I'll start fresh Monday. I thought that was just what brains did. Week 3 it just stopped. I genuinely cannot explain what that quiet feels like if you've never had it.",
    name: "Jennifer R., 41",
    meta: "Weight Loss · 3 months",
    image: W[1],
  },
  {
    lead: "50 pounds down in 7 months. Still amazed every single day.",
    body:
      "But the number isn't even the best part. I walk everywhere now because I actually enjoy it. I say yes to things instead of making excuses. I haven't felt like this in years.",
    name: "Michael T., 52",
    meta: "Weight Loss · 7 months",
    image: M[0],
  },
  {
    lead: "10 years of the same advice that never worked.",
    body:
      "My doctor told me to just eat less and exercise more for a decade. Started this 6 weeks ago. I've lost 14 pounds and I don't spend every waking minute fighting myself over food anymore.",
    name: "Lisa K., 39",
    meta: "Weight Loss · 2 months",
    image: W[3],
  },
  {
    lead: "I've gotten parts of myself back I thought were gone forever.",
    body:
      "A year and a half ago I weighed almost 330 pounds. Just getting out of bed and showering was a challenge. Then I stepped on the scale this morning and saw under 200 pounds for the first time in 16 years.",
    name: "Sarah M., 44",
    meta: "Weight Loss · 18 months",
    image: W[0],
  },
  {
    lead: "The billing was exactly what they said.",
    body:
      "I had been burned twice before. Both times my price went up when my dose went up and nobody warned me. $249 a month. Same when my dose doubled. I called to double check. I cried on the phone.",
    name: "Tricia M., 51",
    meta: "Weight Loss · 6 months",
    image: W[2],
  },
  {
    lead: "Down 22 pounds but the real change was mental clarity.",
    body:
      "The brain fog I thought was just part of getting older. Gone. I have energy in the afternoon. I can think straight. I genuinely feel like myself again in a way I had stopped expecting.",
    name: "Nikki L., 38",
    meta: "Weight Loss · 2 months",
    image: W[0],
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[15px] w-[15px] fill-[#ee7273]">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Card({ r, active }: { r: Review; active: boolean }) {
  return (
    <article
      className="flex h-full flex-col transition-all duration-700 ease-out will-change-transform"
      style={{
        filter: active ? "blur(0px)" : "blur(6px)",
        opacity: active ? 1 : 0.35,
        transform: active ? "scale(1)" : "scale(0.94)",
      }}
    >
      <div className="overflow-hidden rounded-[20px] bg-[#F3F2EE]">
        <div className="relative aspect-[4/5] w-full">
          <img
            src={r.image}
            alt={r.name}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 30%" }}
            loading="lazy"
          />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#F3F2EE] ring-1 ring-black/5">
          <img
            src={r.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 25%" }}
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-ink">{r.name}</div>
          <div className="mt-0.5 truncate text-[13px] text-[#6B6B6B]">{r.meta}</div>
        </div>
      </div>
      <div className="mt-3">
        <Stars />
      </div>
      <p className="mt-3 text-[15px] font-semibold leading-[1.35] text-ink">{r.lead}</p>
      <p className="mt-2 text-[15px] leading-[1.55] text-[#5A5A57]">{r.body}</p>
    </article>
  );
}

export function WLSocialProof() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const target = cards[index];
    if (!target) return;
    const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
    el.scrollTo({ left, behavior });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((c, i) => {
          const mid = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(mid - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 6000);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const el = trackRef.current;
      if (!el) return;
      if (document.hidden) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards.length) return;
      const next = (active + 1) % cards.length;
      goTo(next);
    }, 3800);
    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            What people are <span className="italic text-ever">saying.</span>
          </h2>
          <p className="mt-3 text-[14px] text-[#6B6B6B] md:text-[16px]">
            <span className="text-[#ee7273]">★★★★★</span> &nbsp; 4.8 out of 5 · 3,000+ reviews
          </p>
        </Reveal>
      </div>

      <div className="mt-10 md:mt-14">
        <div
          ref={trackRef}
          onPointerDown={pause}
          onWheel={pause}
          onTouchStart={pause}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-6 md:gap-5 md:px-[max(1.5rem,calc((100vw-1280px)/2))]"
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              data-card
              className="w-[78vw] max-w-[340px] shrink-0 snap-center sm:w-[60vw] md:w-[340px] lg:w-[360px]"
            >
              <Card r={r} active={i === active} />
            </div>
          ))}
          <div className="w-6 shrink-0" />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-[#F1EFEA] px-3 py-2">
            {reviews.map((_, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => {
                    pause();
                    goTo(i);
                  }}
                  className="rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: isActive ? "#171717" : "#C9C6BF",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
