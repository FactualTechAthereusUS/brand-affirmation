import { ArrowRight, Sparkles, Brain, Clock, TrendingDown, MessageCircle } from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import blissleyWhite from "@/assets/blissley-white.png.asset.json";
import r23 from "@/assets/review-23.png.asset.json";
import r24 from "@/assets/review-24.png.asset.json";
import r20 from "@/assets/review-20.png.asset.json";
import r27 from "@/assets/review-27.png.asset.json";

/* ---------- Shared shell ---------- */

function NurtureShell({
  subject,
  preview,
  children,
}: {
  subject: string;
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] bg-ink/[0.04] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
      <div className="flex items-center justify-center bg-canvas py-5">
        <img src={blissleyLogo.url} alt="Blissley" className="h-5 w-auto" />
      </div>
      <div className="border-b border-ink/5 bg-canvas/60 px-5 py-3 md:px-8">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink/45">
          From care@blissley.com
        </p>
        <p className="mt-1 text-[13px] font-semibold text-ink">{subject}</p>
        <p className="mt-0.5 text-[12px] text-ink/55">{preview}</p>
      </div>
      {children}
      <div className="relative overflow-hidden bg-ink px-5 py-8 md:px-8">
        <img src={blissleyWhite.url} alt="Blissley" className="h-4 w-auto opacity-80" />
        <p className="mt-4 text-[11.5px] leading-[1.6] text-white/55">
          TheFactual LLC DBA Blissley · 131 Continental Dr, Suite 305, Newark, DE 19713
        </p>
        <p className="mt-2 text-[11px] leading-[1.6] text-white/45">
          <a href="#" className="underline underline-offset-2 hover:text-white/70">Manage preferences</a>
          <span className="mx-2 text-white/25">·</span>
          <a href="#" className="underline underline-offset-2 hover:text-white/70">Unsubscribe</a>
        </p>
      </div>
    </div>
  );
}

function CTA({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink px-8 text-[14.5px] font-medium text-white transition-transform hover:-translate-y-0.5"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function CoralCTA({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#ee7273] px-8 text-[14.5px] font-medium text-white transition-transform hover:-translate-y-0.5"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function FlowDivider({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="mt-12 mb-2 rounded-[18px] bg-ink px-5 py-6 text-white md:px-7">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#ee7273]">{label}</p>
      <h2 className="mt-1.5 font-hero text-[20px] font-semibold leading-tight tracking-[-0.01em]">
        {title}
      </h2>
      <p className="mt-1 text-[12.5px] leading-[1.55] text-white/60">{subtitle}</p>
    </div>
  );
}

function SendTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/70 ring-1 ring-ink/10">
      <Clock className="h-3 w-3" />
      {children}
    </span>
  );
}

/* ============================================================
   FLOW 1A — QUIZ ABANDONED, EARLY DROP (TOF)
   ============================================================ */

function Flow1A_Email1() {
  return (
    <NurtureShell
      subject="Your results are waiting, Sarah"
      preview="4 minutes left. Nothing's been charged."
    >
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 1A · Send 1 · 1 hour</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          Your results are waiting,
          <br />
          <span className="text-[#ee7273]">Sarah.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink/80">Hey Sarah,</p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          You started your assessment but didn't get far.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          No pressure. Take <span className="font-semibold text-ink">4 minutes</span> when you're
          ready. A physician reviews your profile within 24 hours of you finishing.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          Nothing's charged. It's free to find out if you qualify.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CTA>Continue My Assessment</CTA>
      </div>
    </NurtureShell>
  );
}

function Flow1A_Email2() {
  return (
    <NurtureShell
      subject="What GLP-1 actually does"
      preview="It's not willpower. It's biology."
    >
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 1A · Send 2 · 24 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          It's not willpower.
          <br />
          <span className="text-[#ee7273]">It's biology.</span>
        </h1>
      </div>

      {/* Food noise mechanism visual */}
      <div className="mx-3 mt-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f8dcd7] via-[#f4c8c4] to-[#eec9cc] p-6 md:mx-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/70 ring-1 ring-white/60 backdrop-blur-sm">
            <Brain className="h-5 w-5 text-ink" strokeWidth={2} />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70">
            The food noise loop
          </p>
        </div>

        {/* Before / After split */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[16px] bg-white/60 p-4 ring-1 ring-white/70 backdrop-blur-sm">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">Before</p>
            <div className="mt-3 space-y-1.5">
              {["What did I eat", "I'll start Monday", "Just one more", "I already ruined today"].map(
                (t) => (
                  <div
                    key={t}
                    className="rounded-full bg-ink/5 px-3 py-1 text-[11.5px] leading-tight text-ink/70"
                  >
                    {t}
                  </div>
                ),
              )}
            </div>
            <div className="mt-3 flex items-end gap-0.5">
              {[10, 14, 8, 18, 12, 16, 20, 14, 22, 18].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-t bg-ink/40"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-ink/50">Constant noise</p>
          </div>

          <div className="rounded-[16px] bg-white p-4 ring-1 ring-[#ee7273]/25">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#ee7273]">
              On GLP-1
            </p>
            <div className="mt-3 space-y-1.5">
              {["Ate. Done.", "Not hungry", "Full sooner", "Quiet mind"].map((t) => (
                <div
                  key={t}
                  className="rounded-full bg-[#ee7273]/10 px-3 py-1 text-[11.5px] leading-tight text-ink/80 ring-1 ring-[#ee7273]/20"
                >
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-end gap-0.5">
              {[3, 4, 2, 3, 4, 3, 5, 3, 4, 3].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-t bg-[#ee7273]"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-ink/50">Signal, then silence</p>
          </div>
        </div>

        <p className="mt-6 font-hero text-[16px] font-semibold italic leading-tight text-ink md:text-[18px]">
          "I didn't know everyone's head wasn't like mine."
        </p>
        <p className="mt-1 text-[12px] text-ink/60">— Jennifer R., 3 months in</p>
      </div>

      <div className="px-5 pt-6 md:px-8">
        <p className="text-[15px] leading-[1.65] text-ink/80">Sarah,</p>
        <p className="mt-3 text-[15px] leading-[1.65] text-ink/75">
          If you're on the fence, here's the short version.
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-ink/75">
          GLP-1 medication quiets the part of your brain that keeps you thinking about food.
          Patients call it <span className="font-semibold text-ink">food noise going quiet</span>.
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-ink/75">
          It's not about trying harder. It's about your body finally working with you.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Finish My Assessment</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow1A_Email3() {
  return (
    <NurtureShell
      subject="One last thing, Sarah"
      preview="I don't want to keep reaching out."
    >
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 1A · Send 3 · 72 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          One last thing,
          <br />
          <span className="text-[#ee7273]">Sarah.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink/75">
          I don't want to keep reaching out if this isn't the right time.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          But if you're even a little curious, it costs nothing to find out.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CTA>Complete My Assessment</CTA>
      </div>
    </NurtureShell>
  );
}

/* ============================================================
   FLOW 1B — QUIZ ABANDONED, LATE DROP (BOF)
   ============================================================ */

function Flow1B_Email1() {
  return (
    <NurtureShell
      subject="You were almost done, Sarah"
      preview="Pick up where you left off. 2 minutes left."
    >
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 1B · Send 1 · 1 hour</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          You were almost done,
          <br />
          <span className="text-[#ee7273]">Sarah.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink/80">Hey Sarah,</p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          You were most of the way through your assessment when you left.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          Pick up exactly where you stopped. Takes about{" "}
          <span className="font-semibold text-ink">2 more minutes</span>.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CTA>Finish Where I Left Off</CTA>
      </div>
    </NurtureShell>
  );
}

function Flow1B_Email2() {
  return (
    <NurtureShell
      subject="Almost there"
      preview="90% done. First month is $249 / $299, already discounted."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1B · Send 2 · 12 hours</SendTag>
      </div>

      {/* Coral progress hero */}
      <div className="relative mx-3 mt-4 overflow-hidden rounded-[20px] bg-[#ee7273] p-6 text-white md:mx-5 md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/75">
            Your assessment
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-hero text-[54px] font-semibold leading-none tracking-[-0.02em]">
              90%
            </span>
            <span className="text-[14px] text-white/80">complete</span>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: "90%" }} />
          </div>

          {/* Price card */}
          <div className="mt-6 rounded-[14px] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur-sm">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/80">
              First month
            </p>
            <div className="mt-1.5 flex items-baseline gap-3">
              <div>
                <span className="font-hero text-[26px] font-semibold leading-none">$249</span>
                <span className="ml-1 text-[12px] text-white/75">semaglutide</span>
              </div>
              <span className="text-white/40">/</span>
              <div>
                <span className="font-hero text-[26px] font-semibold leading-none">$299</span>
                <span className="ml-1 text-[12px] text-white/75">tirzepatide</span>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-white/80">Already the discounted price.</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 md:px-8">
        <p className="text-[15px] leading-[1.65] text-ink/80">
          <span className="font-semibold text-ink">Sarah,</span> you're nearly finished. A physician
          reviews your case within 24 hours of completion.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Finish My Assessment</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow1B_Email3() {
  return (
    <NurtureShell
      subject="Your assessment is about to expire"
      preview="90% done. Don't lose your progress."
    >
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 1B · Send 3 · 48 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          Your assessment is
          <br />
          <span className="text-[#ee7273]">about to expire.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink/75">
          Sarah, your assessment is still sitting at{" "}
          <span className="font-semibold text-ink">90% done</span>.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          Don't lose your progress over two minutes.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CTA>Finish Now</CTA>
      </div>
    </NurtureShell>
  );
}

/* ============================================================
   FLOW 2 — PRE-PURCHASE NURTURE
   ============================================================ */

function Flow2_Email1() {
  return (
    <NurtureShell
      subject="Your program is ready, Sarah"
      preview="$249 first month. Physician review starts today."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 1 · 30 minutes</SendTag>
      </div>

      {/* Personalized data card */}
      <div className="mx-3 mt-4 overflow-hidden rounded-[20px] bg-gradient-to-b from-[#f8dcd7] via-[#f4c8c4] to-[#eec9cc] p-6 md:mx-5 md:p-8">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/60">
          Your personalized plan
        </p>
        <h2 className="mt-2 font-hero text-[26px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[30px]">
          Your assessment
          <br />
          <span className="text-[#ee7273]">is complete.</span>
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[14px] bg-white/70 p-4 ring-1 ring-white/60 backdrop-blur-sm">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/55">
              Goal weight
            </p>
            <p className="mt-1.5 font-hero text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
              155 <span className="text-[13px] font-normal text-ink/60">lbs</span>
            </p>
          </div>
          <div className="rounded-[14px] bg-white/70 p-4 ring-1 ring-white/60 backdrop-blur-sm">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/55">
              Est. timeline
            </p>
            <p className="mt-1.5 font-hero text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
              7 <span className="text-[13px] font-normal text-ink/60">months</span>
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-[14px] bg-white p-4 ring-1 ring-[#ee7273]/20">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#ee7273]">
            First month
          </p>
          <div className="mt-1.5 flex items-baseline gap-3">
            <div>
              <span className="font-hero text-[24px] font-semibold leading-none text-ink">$249</span>
              <span className="ml-1 text-[12px] text-ink/60">sema</span>
            </div>
            <span className="text-ink/25">/</span>
            <div>
              <span className="font-hero text-[24px] font-semibold leading-none text-ink">$299</span>
              <span className="ml-1 text-[12px] text-ink/60">tirz</span>
            </div>
          </div>
          <p className="mt-1 text-[12px] text-ink/60">Already discounted. Never changes with dose.</p>
        </div>
      </div>

      <div className="px-5 pt-6 md:px-8">
        <p className="text-[15px] leading-[1.65] text-ink/80">
          <span className="font-semibold text-ink">Sarah,</span> a physician is ready to review your case.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Select My Program</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow2_Email2() {
  const rows = [
    "Card charged only if a physician approves you. Full refund if not.",
    "Price never goes up when your dose increases. Ever.",
    "A real person responds to every message, not a chatbot.",
    "Same price, same doctor, no surprises.",
  ];
  return (
    <NurtureShell
      subject="If you're comparing your options"
      preview="Here's what actually sets us apart."
    >
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 2 · Send 2 · 3 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          If you're comparing
          <br />
          <span className="text-[#ee7273]">your options.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink/75">
          Maybe you're deciding between us and another option. Fair. Here's what to actually compare.
        </p>

        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li key={row} className="flex gap-3 rounded-[14px] bg-canvas p-4 ring-1 ring-ink/5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ee7273]" />
              <p className="text-[14px] leading-[1.55] text-ink/80">{row}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CTA>Start My Program</CTA>
      </div>
    </NurtureShell>
  );
}

/* -- Flow 2 Email 3: UPGRADED reviews section (bigger, better,
      handles objections, shows desire) --------------------------- */

type BigReview = {
  image: string;
  name: string;
  meta: string;
  objection: string;
  headline: string;
  body: string;
  outcome: string;
};

const BIG_REVIEWS: BigReview[] = [
  {
    image: r24.url,
    name: "Jennifer R., 41",
    meta: "3 months in · Semaglutide",
    objection: "Tried therapy, keto, WW — nothing stuck",
    headline: "The food noise is finally gone.",
    body:
      "The constant negotiating with myself about food. What did I just eat. I already ruined today. I'll start fresh Monday. I thought that was just what brains did. Week 3 it just stopped. I genuinely cannot explain what that quiet feels like if you've never had it.",
    outcome: "Down 22 lbs · Sleeps through the night",
  },
  {
    image: r20.url,
    name: "Michael T., 52",
    meta: "7 months in · Tirzepatide",
    objection: "Skeptical it would work at 50+",
    headline: "50 lbs down. Still amazed every day.",
    body:
      "The number isn't even the best part. I walk everywhere now because I actually enjoy it. I say yes to things instead of making excuses. My knees don't hurt. My wife noticed I'm laughing again. I haven't felt like this in years.",
    outcome: "Down 50 lbs · Off blood pressure meds",
  },
  {
    image: r27.url,
    name: "Tricia M., 51",
    meta: "6 months in · Semaglutide",
    objection: "Got burned by hidden price hikes twice",
    headline: "The billing was exactly what they said.",
    body:
      "I had been burned twice before. Both times my price went up when my dose went up and nobody warned me. I was terrified to start again. $249 a month. Same when my dose doubled. I called to double check. The person who answered actually picked up. I cried on the phone.",
    outcome: "Down 34 lbs · Same price at every dose",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-[#ee7273]">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function BigReviewCard({ r }: { r: BigReview }) {
  return (
    <article className="overflow-hidden rounded-[20px] bg-canvas ring-1 ring-ink/5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F2EE]">
        <img
          src={r.image}
          alt={r.name}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 28%" }}
          loading="lazy"
        />
        {/* Objection tag over image */}
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10.5px] font-semibold text-ink shadow-sm backdrop-blur">
          "{r.objection}"
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-ink">{r.name}</div>
            <div className="mt-0.5 truncate text-[12px] text-ink/55">{r.meta}</div>
          </div>
          <Stars />
        </div>

        <p className="mt-3 font-hero text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink md:text-[20px]">
          "{r.headline}"
        </p>
        <p className="mt-3 text-[13.5px] leading-[1.6] text-ink/70">{r.body}</p>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-[#ee7273]/8 px-3 py-2 ring-1 ring-[#ee7273]/15">
          <TrendingDown className="h-3.5 w-3.5 text-[#ee7273]" strokeWidth={2.5} />
          <span className="text-[12px] font-semibold text-ink">{r.outcome}</span>
        </div>
      </div>
    </article>
  );
}

function Flow2_Email3() {
  return (
    <NurtureShell
      subject="What Sarah could look like in 6 months"
      preview="&ldquo;The food noise is finally gone.&rdquo; — Jennifer R."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 3 · 24 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          What could be waiting
          <br />
          <span className="text-[#ee7273]">on the other side.</span>
        </h1>
        <p className="mt-4 text-[14px] leading-[1.6] text-ink/70">
          Real patients. Real objections. Real outcomes. No filters.
        </p>

        {/* Aggregate proof strip */}
        <div className="mt-5 flex items-center justify-between rounded-[14px] bg-canvas p-4 ring-1 ring-ink/5">
          <div>
            <div className="flex items-center gap-1.5">
              <Stars />
              <span className="text-[13px] font-semibold text-ink">4.96</span>
            </div>
            <p className="mt-0.5 text-[11px] text-ink/55">TrustScore · 3,826 reviews</p>
          </div>
          <div className="h-8 w-px bg-ink/10" />
          <div className="text-right">
            <p className="font-hero text-[18px] font-semibold leading-none text-ink">30,000+</p>
            <p className="mt-0.5 text-[11px] text-ink/55">Patients treated</p>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="mt-6 space-y-4 px-3 md:px-5">
        {BIG_REVIEWS.map((r) => (
          <BigReviewCard key={r.name} r={r} />
        ))}
      </div>

      {/* Price reassurance */}
      <div className="mx-3 mt-6 rounded-[16px] bg-ink px-5 py-5 text-white md:mx-5 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#ee7273]">
              First month still
            </p>
            <p className="mt-1 font-hero text-[22px] font-semibold leading-none tracking-[-0.01em]">
              $249 <span className="text-white/50">/</span> $299
            </p>
          </div>
          <p className="max-w-[160px] text-right text-[11.5px] leading-[1.4] text-white/60">
            Same price at every dose. Never changes.
          </p>
        </div>
      </div>

      <div className="px-5 pt-6 md:px-8">
        <p className="text-[15px] leading-[1.65] text-ink/80">
          <span className="font-semibold text-ink">Sarah,</span> this is what's on the other side.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Start My Program</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow2_Email4() {
  return (
    <NurtureShell subject="What's stopping you?" preview="Comparing options? Not sure yet? Just tell me.">
      <div className="px-5 pt-8 pb-2 md:px-8">
        <SendTag>Flow 2 · Send 4 · 48 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          What's stopping
          <br />
          <span className="text-[#ee7273]">you?</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink/80">Sarah,</p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          Still comparing a couple options? Not sure this is right for you? Something else entirely?
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
          Hit reply. A real person reads this inbox and can actually answer.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-[14px] bg-canvas p-4 ring-1 ring-ink/5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ee7273]/10 ring-1 ring-[#ee7273]/15">
            <MessageCircle className="h-4 w-4 text-[#ee7273]" strokeWidth={2.2} />
          </span>
          <p className="text-[13.5px] leading-[1.55] text-ink/70">
            Reply directly to this email. Average response time is under 2 hours during business
            hours.
          </p>
        </div>

        <p className="mt-6 text-[15px] leading-[1.65] text-ink/75">Or if you've already decided:</p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CTA>Start My Program</CTA>
      </div>
    </NurtureShell>
  );
}

function Flow2_Email5() {
  return (
    <NurtureShell subject="Your spot closes tonight" preview="Physician slots rotate every 48 hours.">
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 5 · 72 hours</SendTag>
      </div>

      {/* Urgency hero */}
      <div className="relative mx-3 mt-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#171717] via-[#1f1f1f] to-[#171717] p-6 text-white md:mx-5 md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ee7273]/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#ee7273]/25 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ee7273]/20 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#ee7273] ring-1 ring-[#ee7273]/30">
            <Sparkles className="h-3 w-3" /> Final notice
          </span>

          <h2 className="mt-4 font-hero text-[30px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[36px]">
            Your spot closes
            <br />
            <span className="text-[#ee7273]">tonight.</span>
          </h2>

          {/* Countdown row */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { v: "07", l: "Hours" },
              { v: "42", l: "Minutes" },
              { v: "18", l: "Seconds" },
            ].map((t) => (
              <div
                key={t.l}
                className="rounded-[14px] bg-white/8 p-3 text-center ring-1 ring-white/10 backdrop-blur-sm"
              >
                <p className="font-hero text-[28px] font-semibold leading-none tracking-[-0.02em]">
                  {t.v}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
                  {t.l}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[14px] leading-[1.55] text-white/75">
            Sarah, physician slots rotate every 48 hours, and yours is about to lapse.
          </p>
        </div>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Claim My Spot</CoralCTA>
        <p className="mt-3 text-center text-[12px] text-ink/50">
          Same $249 / $299 first month. Nothing charges until a physician approves you.
        </p>
      </div>
    </NurtureShell>
  );
}

/* ============================================================
   Exported bundle
   ============================================================ */

export function NurtureFlows() {
  return (
    <>
      <FlowDivider
        label="Flow 1A · TOF"
        title="Quiz abandoned — early drop"
        subtitle="Screens 1–8. 3 emails, stops after 72 hours."
      />
      <Flow1A_Email1 />
      <Flow1A_Email2 />
      <Flow1A_Email3 />

      <FlowDivider
        label="Flow 1B · BOF"
        title="Quiz abandoned — late drop"
        subtitle="Screens 9–18. 3 emails, stops after 48 hours."
      />
      <Flow1B_Email1 />
      <Flow1B_Email2 />
      <Flow1B_Email3 />

      <FlowDivider
        label="Flow 2 · Pre-purchase"
        title="Assessment complete, no purchase yet"
        subtitle="5 emails alternating text and graphic sends."
      />
      <Flow2_Email1 />
      <Flow2_Email2 />
      <Flow2_Email3 />
      <Flow2_Email4 />
      <Flow2_Email5 />
    </>
  );
}
