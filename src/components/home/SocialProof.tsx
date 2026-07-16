import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import r20 from "@/assets/review-20.png.asset.json";
import r21 from "@/assets/review-21.png.asset.json";
import r22 from "@/assets/review-22.png.asset.json";
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

const M = [r20.url, r21.url, r22.url, r28.url];
const W = [r23.url, r24.url, r25.url, r26.url, r27.url];

const reviews: Review[] = [
  { lead: "I've gotten parts of myself back I thought were gone forever.", body: "A year and a half ago I weighed almost 330 pounds. Just getting out of bed and showering was a challenge. I avoided pictures. I convinced myself the best years of my life were already behind me. Then I stepped on the scale this morning and saw under 200 pounds for the first time in 16 years.", name: "Sarah M., 44", meta: "Weight Loss · 18 months", image: W[0] },
  { lead: "I didn't know everyone's head wasn't like mine.", body: "The constant negotiating with myself about food. What did I just eat. I already ruined today. I'll start fresh Monday. I thought that was just what brains did. Week 3 it just stopped. I genuinely cannot explain what that quiet feels like if you've never had it.", name: "Jennifer R., 41", meta: "Weight Loss · 3 months", image: W[1] },
  { lead: "50 pounds down in 7 months. Still amazed every single day.", body: "But the number isn't even the best part. I walk everywhere now because I actually enjoy it. I say yes to things instead of making excuses. I haven't felt like this in years.", name: "Michael T., 52", meta: "Weight Loss · 7 months", image: M[0] },
  { lead: "The billing was exactly what they said.", body: "I had been burned twice before. Both times my price went up when my dose went up and nobody warned me. I was terrified to start again. $249 a month. Same when my dose doubled. I called to double check. The person who answered actually picked up. I cried on the phone.", name: "Tricia M., 51", meta: "Weight Loss · 6 months", image: W[2] },
  { lead: "10 years of the same advice that never worked.", body: "My doctor told me to just eat less and exercise more for a decade. Started this 6 weeks ago. I've lost 14 pounds and I don't spend every waking minute fighting myself over food anymore. I don't know whether to feel relieved or angry that nobody offered this to me sooner.", name: "Lisa K., 39", meta: "Weight Loss · 2 months", image: W[3] },
  { lead: "I avoided every camera for 4 years.", body: "Family events, vacations, everything. Last month my daughter asked me to take a photo with her and I said yes without even thinking about it. She screenshot my face and sent it to me. I looked happy. Actually happy. Down 34 pounds but that photo is what I keep coming back to.", name: "Dana W., 44", meta: "Weight Loss · 3 months", image: W[4] },
  { lead: "I went into this fully expecting to be disappointed.", body: "I had tried literally everything. Keto, WW, intermittent fasting, personal trainer for two years, therapy for emotional eating. Nothing stuck. I'm down 28 pounds and for the first time I feel like something is actually working with my body instead of against it.", name: "Rob H., 53", meta: "Weight Loss · 5 months", image: M[1] },
  { lead: "Down 22 pounds but the real change was mental clarity.", body: "The brain fog I thought was just part of getting older. Gone. I have energy in the afternoon. I can think straight. I'm not dragging myself through every day. I genuinely feel like myself again in a way I had stopped expecting.", name: "Nikki L., 38", meta: "Weight Loss · 2 months", image: W[0] },
  { lead: "One click. Done. No call. No form.", body: "I needed to pause for a month for a family emergency. I went into the portal expecting to fight someone on hold for an hour. When I came back I just restarted. I've been with companies that make cancelling a full time job. This was not that.", name: "Amy G., 46", meta: "Weight Loss · 5 months", image: W[1] },
  { lead: "They matched my current dose exactly.", body: "I was on semaglutide with another company for 4 months at 0.5mg when I switched. I was terrified they would make me restart from the beginning. Not one extra week of starting over. I've now lost 41 pounds total. Down a full dress size and a half.", name: "Maria C., 43", meta: "Weight Loss · 7 months", image: W[2] },
  { lead: "I wish I had done this 5 years ago.", body: "Before I started I had t levels of a 100 year old man according to my doctor. No drive. No energy. Brain fog so bad I couldn't get through a work meeting. 3 weeks in I felt more confident. 6 months later I am a completely different person.", name: "James P., 48", meta: "TRT · 6 months", image: M[2] },
  { lead: "I thought I was just getting old at 34. I wasn't.", body: "You wake up feeling like you haven't slept. You go to bed feeling like you haven't moved. I worked out every day and never built any muscle. I was just deficient. 4 months on TRT and everything has changed.", name: "Derek C., 34", meta: "TRT · 4 months", image: M[3] },
  { lead: "My wife noticed before I did.", body: "She said I seemed lighter. More like myself. My mood was more stable. I was present instead of just going through motions. I had been dragging for two years thinking it was stress or burnout. It was hormones.", name: "Kevin R., 42", meta: "TRT · 5 months", image: M[0] },
  { lead: "Messaged at 9am. Prescription written by 2pm.", body: "It shipped the next day. I had been trying to get a referral to an endocrinologist through my regular doctor for 7 months. Seven months. Same result in 24 hours here. I genuinely could not believe it was that simple.", name: "Marcus T., 39", meta: "TRT · 3 months", image: M[1] },
  { lead: "Two weeks on HRT and I woke up feeling like myself again.", body: "For about a year I thought I was losing my mind. Hot flashes. Rage. Brain fog so severe I couldn't do my job. My doctor gave me antidepressants. They didn't help because they were treating the wrong thing. I remembered who I used to be.", name: "Carol S., 54", meta: "HRT · 2 months", image: W[3] },
  { lead: "I slept 8 hours straight. I had forgotten that was possible.", body: "I had not slept through the night in 3 years. Not once. Night sweats every few hours. I started progesterone and estradiol and within 10 days I slept through. Everything in my life has improved since I started actually sleeping again.", name: "Margaret H., 51", meta: "HRT · 4 months", image: W[4] },
  { lead: "A real board certified physician in under 24 hours.", body: "I had been dismissed by two doctors who told me my symptoms were anxiety or stress. Here a real physician read my intake, followed up with a specific question about my symptom timeline, and had a protocol ready within the day. I didn't think that existed anymore.", name: "Diane W., 49", meta: "HRT · 6 months", image: W[0] },
  { lead: "My skin is clearer than it has been since my early twenties.", body: "I had tried every over the counter product for 3 years. Prescribed stuff from two different dermatologists that did nothing. My skin affected everything. I stopped wanting photos taken. Two months in and my husband noticed before I said anything.", name: "Rachel L., 36", meta: "Skin Care · 2 months", image: W[1] },
  { lead: "I feel a version of myself I thought was behind me.", body: "I started NAD+ primarily because I wanted more energy and mental sharpness. I'm 58 and I had accepted that the fog and the fatigue were just part of aging. They're not. 6 weeks in I feel more alert in the afternoon than I have in years.", name: "Gary F., 58", meta: "NAD+ · 6 weeks", image: M[2] },
  { lead: "Reliable. On time. Exactly what was promised.", body: "The package arrived in 3 days. No indication of what was inside from the outside. I live in an apartment building and discretion matters. Everything was cold packed and perfectly sealed. Every refill since has been the same.", name: "Tom B., 47", meta: "Weight Loss · 4 months", image: M[3] },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[15px] w-[15px] fill-[#E85A6B]">
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

export function SocialProof() {
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

  // Track active card via scroll position (center of viewport)
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

  // Pause autoplay briefly on user interaction
  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 6000);
  }, []);

  // Autoplay
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
            <span className="text-[#E85A6B]">★★★★★</span> &nbsp; 4.96 TrustScore · 3,826 reviews
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

        {/* iPhone-style dot pagination */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {reviews.map((_, i) => {
            const dist = Math.abs(i - active);
            const isActive = i === active;
            const size = isActive ? 8 : dist === 1 ? 6 : dist === 2 ? 5 : 4;
            const opacity = isActive ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.35 : 0.2;
            return (
              <button
                key={i}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => {
                  pause();
                  goTo(i);
                }}
                className="flex h-6 w-6 items-center justify-center"
              >
                <span
                  className="rounded-full bg-ink transition-all duration-500 ease-out"
                  style={{
                    width: isActive ? 22 : size,
                    height: size,
                    opacity,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

