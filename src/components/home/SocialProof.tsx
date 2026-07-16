import { Reveal } from "../Reveal";

type Review = {
  lead: string;
  body: string;
  name: string;
  meta: string;
  tone: string;
};

const reviews: Review[] = [
  {
    lead: "I've gotten parts of myself back I thought were gone forever.",
    body: "A year and a half ago I weighed almost 330 pounds. Just getting out of bed and showering was a challenge. I avoided pictures. I convinced myself the best years of my life were already behind me. Then I stepped on the scale this morning and saw under 200 pounds for the first time in 16 years.",
    name: "Sarah M., 44",
    meta: "Weight Loss · 18 months",
    tone: "#E8DFD1",
  },
  {
    lead: "I didn't know everyone's head wasn't like mine.",
    body: "The constant negotiating with myself about food. What did I just eat. I already ruined today. I'll start fresh Monday. I thought that was just what brains did. Week 3 it just stopped. I genuinely cannot explain what that quiet feels like if you've never had it.",
    name: "Jennifer R., 41",
    meta: "Weight Loss · 3 months",
    tone: "#DDE3D5",
  },
  {
    lead: "50 pounds down in 7 months. Still amazed every single day.",
    body: "But the number isn't even the best part. I walk everywhere now because I actually enjoy it. I say yes to things instead of making excuses. I haven't felt like this in years.",
    name: "Michael T., 52",
    meta: "Weight Loss · 7 months",
    tone: "#E4D9C9",
  },
  {
    lead: "The billing was exactly what they said.",
    body: "I had been burned twice before. Both times my price went up when my dose went up and nobody warned me. I was terrified to start again. $249 a month. Same when my dose doubled. I called to double check. The person who answered actually picked up. I cried on the phone.",
    name: "Tricia M., 51",
    meta: "Weight Loss · 6 months",
    tone: "#D9DFE3",
  },
  {
    lead: "10 years of the same advice that never worked.",
    body: "My doctor told me to just eat less and exercise more for a decade. Started this 6 weeks ago. I've lost 14 pounds and I don't spend every waking minute fighting myself over food anymore. I don't know whether to feel relieved or angry that nobody offered this to me sooner.",
    name: "Lisa K., 39",
    meta: "Weight Loss · 2 months",
    tone: "#E8DFD1",
  },
  {
    lead: "I avoided every camera for 4 years.",
    body: "Family events, vacations, everything. Last month my daughter asked me to take a photo with her and I said yes without even thinking about it. She screenshot my face and sent it to me. I looked happy. Actually happy. Down 34 pounds but that photo is what I keep coming back to.",
    name: "Dana W., 44",
    meta: "Weight Loss · 3 months",
    tone: "#DDE3D5",
  },
  {
    lead: "I went into this fully expecting to be disappointed.",
    body: "I had tried literally everything. Keto, WW, intermittent fasting, personal trainer for two years, therapy for emotional eating. Nothing stuck. I'm down 28 pounds and for the first time I feel like something is actually working with my body instead of against it.",
    name: "Rob H., 53",
    meta: "Weight Loss · 5 months",
    tone: "#E4D9C9",
  },
  {
    lead: "Down 22 pounds but the real change was mental clarity.",
    body: "The brain fog I thought was just part of getting older. Gone. I have energy in the afternoon. I can think straight. I'm not dragging myself through every day. I genuinely feel like myself again in a way I had stopped expecting.",
    name: "Nikki L., 38",
    meta: "Weight Loss · 2 months",
    tone: "#D9DFE3",
  },
  {
    lead: "One click. Done. No call. No form.",
    body: "I needed to pause for a month for a family emergency. I went into the portal expecting to fight someone on hold for an hour. When I came back I just restarted. I've been with companies that make cancelling a full time job. This was not that.",
    name: "Amy G., 46",
    meta: "Weight Loss · 5 months",
    tone: "#E8DFD1",
  },
  {
    lead: "They matched my current dose exactly.",
    body: "I was on semaglutide with another company for 4 months at 0.5mg when I switched. I was terrified they would make me restart from the beginning. Not one extra week of starting over. I've now lost 41 pounds total. Down a full dress size and a half.",
    name: "Maria C., 43",
    meta: "Weight Loss · 7 months",
    tone: "#DDE3D5",
  },
  {
    lead: "I wish I had done this 5 years ago.",
    body: "Before I started I had t levels of a 100 year old man according to my doctor. No drive. No energy. Brain fog so bad I couldn't get through a work meeting. 3 weeks in I felt more confident. 6 months later I am a completely different person.",
    name: "James P., 48",
    meta: "TRT · 6 months",
    tone: "#E4D9C9",
  },
  {
    lead: "I thought I was just getting old at 34. I wasn't.",
    body: "You wake up feeling like you haven't slept. You go to bed feeling like you haven't moved. I worked out every day and never built any muscle. I was just deficient. 4 months on TRT and everything has changed.",
    name: "Derek C., 34",
    meta: "TRT · 4 months",
    tone: "#D9DFE3",
  },
  {
    lead: "My wife noticed before I did.",
    body: "She said I seemed lighter. More like myself. My mood was more stable. I was present instead of just going through motions. I had been dragging for two years thinking it was stress or burnout. It was hormones.",
    name: "Kevin R., 42",
    meta: "TRT · 5 months",
    tone: "#E8DFD1",
  },
  {
    lead: "Messaged at 9am. Prescription written by 2pm.",
    body: "It shipped the next day. I had been trying to get a referral to an endocrinologist through my regular doctor for 7 months. Seven months. Same result in 24 hours here. I genuinely could not believe it was that simple.",
    name: "Marcus T., 39",
    meta: "TRT · 3 months",
    tone: "#DDE3D5",
  },
  {
    lead: "Two weeks on HRT and I woke up feeling like myself again.",
    body: "For about a year I thought I was losing my mind. Hot flashes. Rage. Brain fog so severe I couldn't do my job. My doctor gave me antidepressants. They didn't help because they were treating the wrong thing. I remembered who I used to be.",
    name: "Carol S., 54",
    meta: "HRT · 2 months",
    tone: "#E4D9C9",
  },
  {
    lead: "I slept 8 hours straight. I had forgotten that was possible.",
    body: "I had not slept through the night in 3 years. Not once. Night sweats every few hours. I started progesterone and estradiol and within 10 days I slept through. Everything in my life has improved since I started actually sleeping again.",
    name: "Margaret H., 51",
    meta: "HRT · 4 months",
    tone: "#D9DFE3",
  },
  {
    lead: "A real board certified physician in under 24 hours.",
    body: "I had been dismissed by two doctors who told me my symptoms were anxiety or stress. Here a real physician read my intake, followed up with a specific question about my symptom timeline, and had a protocol ready within the day. I didn't think that existed anymore.",
    name: "Diane W., 49",
    meta: "HRT · 6 months",
    tone: "#E8DFD1",
  },
  {
    lead: "My skin is clearer than it has been since my early twenties.",
    body: "I had tried every over the counter product for 3 years. Prescribed stuff from two different dermatologists that did nothing. My skin affected everything. I stopped wanting photos taken. Two months in and my husband noticed before I said anything.",
    name: "Rachel L., 36",
    meta: "Skin Care · 2 months",
    tone: "#DDE3D5",
  },
  {
    lead: "I feel a version of myself I thought was behind me.",
    body: "I started NAD+ primarily because I wanted more energy and mental sharpness. I'm 58 and I had accepted that the fog and the fatigue were just part of aging. They're not. 6 weeks in I feel more alert in the afternoon than I have in years.",
    name: "Gary F., 58",
    meta: "NAD+ · 6 weeks",
    tone: "#E4D9C9",
  },
  {
    lead: "Reliable. On time. Exactly what was promised.",
    body: "The package arrived in 3 days. No indication of what was inside from the outside. I live in an apartment building and discretion matters. Everything was cold packed and perfectly sealed. Every refill since has been the same.",
    name: "Tom B., 47",
    meta: "Weight Loss · 4 months",
    tone: "#D9DFE3",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[15px] w-[15px] fill-honey">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, tone }: { name: string; tone: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-medium text-ink/70"
      style={{ backgroundColor: tone }}
    >
      {initials}
    </div>
  );
}

function Card({ r }: { r: Review }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl bg-[#F3F2EE] p-6 md:p-7">
      <div>
        <Stars />
        <p className="mt-4 text-[15px] font-semibold leading-[1.5] text-ink md:text-[16px]">
          {r.lead}
        </p>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#5A5A57] md:text-[15px]">
          {r.body}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-black/[0.06] pt-4">
        <Avatar name={r.name} tone={r.tone} />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium text-ink">{r.name}</div>
          <div className="truncate text-[12.5px] text-[#8A8A85]">{r.meta}</div>
        </div>
      </div>
    </article>
  );
}

export function SocialProof() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            What people are <span className="italic text-ever">saying.</span>
          </h2>
          <p className="mt-3 text-[14px] text-[#6B6B6B] md:text-[16px]">
            <span className="text-honey">★★★★★</span> &nbsp; 4.96 TrustScore · 3,826 reviews
          </p>
        </Reveal>
      </div>

      {/* Mobile: horizontal snap scroller */}
      <div className="mt-10 md:hidden">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
          {reviews.map((r, i) => (
            <div key={i} className="w-[82vw] max-w-[340px] shrink-0 snap-center">
              <Card r={r} />
            </div>
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </div>

      {/* Desktop: masonry columns */}
      <div className="mx-auto mt-14 hidden max-w-7xl px-6 md:block">
        <div className="columns-2 gap-5 lg:columns-3">
          {reviews.map((r, i) => (
            <div key={i} className="mb-5 break-inside-avoid">
              <Card r={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
