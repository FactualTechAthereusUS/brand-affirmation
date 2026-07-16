import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import b34 from "@/assets/ba-34.png.asset.json";
import b35 from "@/assets/ba-35.png.asset.json";
import b36 from "@/assets/ba-36.png.asset.json";
import b37 from "@/assets/ba-37.png.asset.json";
import b38 from "@/assets/ba-38.png.asset.json";
import b39 from "@/assets/ba-39.png.asset.json";
import b40 from "@/assets/ba-40.png.asset.json";
import b41 from "@/assets/ba-41.png.asset.json";

type BA = {
  name: string;
  caption: string;
  before: string;
  after: string;
};

const items: BA[] = [
  { name: "Cassandra K.", caption: "After GLP-1", before: b34.url, after: b35.url },
  { name: "Megan R.", caption: "After GLP-1", before: b36.url, after: b37.url },
  { name: "Sophie L.", caption: "After GLP-1", before: b38.url, after: b39.url },
  { name: "Missel M.", caption: "After GLP-1", before: b40.url, after: b41.url },
];

function Badge({ label, tone }: { label: string; tone: "before" | "after" }) {
  const bg = tone === "before" ? "#0E3B36" : "#ee7273";
  return (
    <span
      className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white md:bottom-4 md:left-4 md:text-[12px]"
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function Card({ r, active }: { r: BA; active: boolean }) {
  return (
    <article
      className="h-full transition-all duration-700 ease-out will-change-transform"
      style={{
        filter: active ? "blur(0px)" : "blur(6px)",
        opacity: active ? 1 : 0.4,
        transform: active ? "scale(1)" : "scale(0.95)",
      }}
    >
      <div className="rounded-[22px] bg-white p-2.5 ring-1 ring-black/5 shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)] md:p-3">
        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
          <div className="relative overflow-hidden rounded-[16px] bg-[#F3F2EE]">
            <div className="aspect-[4/5] w-full">
              <img src={r.before} alt={`${r.name} before`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <Badge label="Before" tone="before" />
          </div>
          <div className="relative overflow-hidden rounded-[16px] bg-[#F3F2EE]">
            <div className="aspect-[4/5] w-full">
              <img src={r.after} alt={`${r.name} after`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <Badge label="After" tone="after" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between px-1 pb-1">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#0E3B36]" aria-hidden>
              <path
                fill="currentColor"
                d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.6-1 2.9 1 2.9-2.5 1.6-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9L3.2 15.9l1-2.9-1-2.9 2.5-1.6.9-2.9 3 .2L12 2z"
              />
              <path fill="#fff" d="M10.6 14.6l-2.3-2.3 1.1-1.1 1.2 1.2 3.5-3.5 1.1 1.1-4.6 4.6z" />
            </svg>
            <span className="text-[15px] font-medium text-ink">{r.name}</span>
          </div>
          <span className="text-[14px] text-[#6B6B6B]">{r.caption}</span>
        </div>
      </div>
    </article>
  );
}

export function WLBeforeAfter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-ba]");
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
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-ba]"));
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
      if (!el || document.hidden) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-ba]");
      if (!cards.length) return;
      goTo((active + 1) % cards.length);
    }, 4200);
    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            Real people, <span className="italic text-ever">real results.</span>
          </h2>
          <p className="mt-3 text-[14px] text-[#6B6B6B] md:text-[16px]">
            Results from real Blissley members on GLP-1 therapy.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 md:mt-14">
        <div
          ref={trackRef}
          onPointerDown={pause}
          onWheel={pause}
          onTouchStart={pause}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-6 md:gap-6 md:px-[max(1.5rem,calc((100vw-1280px)/2))]"
        >
          {items.map((r, i) => (
            <div
              key={i}
              data-ba
              className="w-[92vw] max-w-[560px] shrink-0 snap-center sm:w-[78vw] md:w-[640px] lg:w-[720px] xl:w-[780px]"
            >
              <Card r={r} active={i === active} />
            </div>
          ))}
          <div className="w-6 shrink-0" />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-[#F1EFEA] px-3 py-2">
            {items.map((_, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  aria-label={`Go to result ${i + 1}`}
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
