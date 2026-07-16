import { useState } from "react";
import { Reveal } from "../Reveal";
import { Placeholder } from "./Placeholder";

const photos = [
  { tone: "warm" as const, label: "moment 1" },
  { tone: "sage" as const, label: "moment 2" },
  { tone: "clay" as const, label: "moment 3" },
  { tone: "morning" as const, label: "moment 4" },
  { tone: "dusk" as const, label: "moment 5" },
  { tone: "sand" as const, label: "moment 6" },
];

const reviews = [
  {
    quote:
      "The food noise is just gone. I didn't know that wasn't normal for everyone. 50 lbs down but the quiet was the real change.",
    who: "Jennifer R., 41 · Weight Loss",
    date: "2 weeks ago",
  },
  {
    quote:
      "Same price when my dose went up. After what happened at my last provider I actually cried. No surprises. Ever.",
    who: "Sarah M., 47 · GLP-1",
    date: "1 month ago",
  },
  {
    quote:
      "Real physician responded to my messages. Not a bot. Not a form. A real doctor. Wild that this is rare.",
    who: "Mike T., 52 · Weight Loss",
    date: "3 weeks ago",
  },
];

export function SocialProof() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            What people are <span className="italic text-ever">saying.</span>
          </h2>
          <p className="mt-3 text-[14px] text-[#6B6B6B] md:text-[16px]">
            <span className="text-honey">★★★★★</span> &nbsp; 4.8 out of 5 · 3,000+ reviews
          </p>
        </Reveal>
      </div>

      {/* Photo strip — edge to edge */}
      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pl-6 md:mt-14">
        {photos.map((p, i) => (
          <Placeholder
            key={i}
            label={p.label}
            tone={p.tone}
            className="h-[220px] w-[140px] shrink-0 rounded-xl md:h-[320px] md:w-[220px]"
          />
        ))}
        <div className="w-6 shrink-0" />
      </div>

      {/* Review cards */}
      <div
        className="no-scrollbar mt-8 flex gap-3 overflow-x-auto px-6 md:mt-12"
        onScroll={(e) => {
          const el = e.currentTarget;
          const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85));
          setActive(Math.min(idx, reviews.length - 1));
        }}
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            className="w-[300px] shrink-0 rounded-2xl bg-white p-5 shadow-[0_2px_24px_rgba(0,0,0,0.06)] md:w-[380px] md:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-honey">★★★★★</span>
              <span className="text-[12px] text-[#9A9A9A]">{r.date}</span>
            </div>
            <p className="mt-4 text-[15px] leading-[1.6] text-ink">{r.quote}</p>
            <p className="mt-4 text-[13px] italic text-[#6B6B6B]">— {r.who}</p>
            <div className="mt-3 flex items-center gap-1.5 text-[12px] text-check">
              <span className="h-1.5 w-1.5 rounded-full bg-check" />
              Verified patient
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-1.5">
        {reviews.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              active === i ? "w-6 bg-ever" : "w-1.5 bg-mist"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
