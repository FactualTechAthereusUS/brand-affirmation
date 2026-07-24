import { ArrowRight, Clock, TrendingDown } from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import blissleyWhite from "@/assets/blissley-white.png.asset.json";
import r20 from "@/assets/review-20.png.asset.json";
import r24 from "@/assets/review-24.png.asset.json";
import r27 from "@/assets/review-27.png.asset.json";
import vialTirz from "@/assets/blissley-tirzepatide-vial.png.asset.json";
import heroSky from "@/assets/hero-sky-woman.png.asset.json";
import heroTrx from "@/assets/trx-hero-woman.png.asset.json";

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

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 pt-6 md:px-8">
      <div className="space-y-5 text-[15.5px] leading-[1.75] text-ink/80">{children}</div>
    </div>
  );
}

/* ============================================================
   FLOW 1A — QUIZ ABANDONED, EARLY DROP (TOF)
   ============================================================ */

function Flow1A_Email1() {
  return (
    <NurtureShell
      subject="You got two screens in"
      preview="Whatever it was, come back when you're ready."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1A · Send 1 · 1 hour</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          You got two screens in.
        </h1>
      </div>

      <Body>
        <p>
          You started answering questions about your weight, your history, maybe things you don't
          usually type into a form.
        </p>
        <p>Then you stopped.</p>
        <p>
          Could be you got busy. Could be it felt like a lot all at once. Either way, nothing
          happened because of it. No charge, no commitment, nothing on your account.
        </p>
        <p className="text-ink">If you want to pick it up again, it's right here.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CTA>Continue My Assessment</CTA>
      </div>
    </NurtureShell>
  );
}

function Flow1A_Email2() {
  return (
    <NurtureShell
      subject="The thing nobody tells you about hunger"
      preview="It's not the food. It's the voice."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1A · Send 2 · 24 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          It's not the food.
          <br />
          <span className="text-[#ee7273]">It's the voice.</span>
        </h1>
      </div>

      <Body>
        <p>Most people think weight loss is a food problem. It isn't.</p>
        <p>
          It's a signal problem. Your brain has a switch that tells you when you're full, and for a
          lot of people, that switch is broken. Not from lack of willpower. From biology. So you eat
          the meal, and twenty minutes later you're thinking about food again anyway.
        </p>
        <p>
          GLP-1 medication fixes the switch, not the person. Patients don't describe it as trying
          harder. They describe the voice finally going quiet.
        </p>
        <p className="text-ink">You don't have to decide anything today. Just see if you'd qualify.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Finish My Assessment</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow1A_Email3() {
  return (
    <NurtureShell
      subject="I'll stop after this one"
      preview="Genuinely, no more emails after this."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1A · Send 3 · 72 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          I'll stop after
          <br />
          <span className="text-[#ee7273]">this one.</span>
        </h1>
      </div>

      <Body>
        <p>I don't want to be another brand that won't leave your inbox alone.</p>
        <p>
          So this is the last one. If you're curious whether this could work for you, it takes
          about four minutes to find out, and nothing's charged either way.
        </p>
        <p className="text-ink">If not, no hard feelings.</p>
      </Body>

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
      subject="You were two minutes from done"
      preview="Pick up exactly where you left off."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1B · Send 1 · 1 hour</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          You were two minutes
          <br />
          <span className="text-[#ee7273]">from done.</span>
        </h1>
      </div>

      <Body>
        <p>
          Something pulled you away right near the end. Phone rang, kid needed something, browser
          closed, who knows.
        </p>
        <p className="text-ink">
          You were most of the way through. Come finish it, it's short from here.
        </p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CTA>Finish Where I Left Off</CTA>
      </div>
    </NurtureShell>
  );
}

function Flow1B_Email2() {
  return (
    <NurtureShell
      subject="90% done, still sitting there"
      preview="Two minutes left, and the price doesn't change."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1B · Send 2 · 12 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          90% done, still
          <br />
          <span className="text-[#ee7273]">sitting there.</span>
        </h1>
      </div>

      <Body>
        <p>Your assessment is one section away from a physician actually reviewing it.</p>
        <p>
          First month is $249 for semaglutide or $299 for tirzepatide, whichever you're matched to.
          That's already the real price. Nothing added when you check out.
        </p>
        <p className="text-ink">You were almost done. Finish it.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Finish My Assessment</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow1B_Email3() {
  return (
    <NurtureShell
      subject="Still at 90%"
      preview="Don't lose the four minutes you already put in."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 1B · Send 3 · 48 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          Still at
          <br />
          <span className="text-[#ee7273]">90%.</span>
        </h1>
      </div>

      <Body>
        <p>You already answered the hard questions. What's left takes about two minutes.</p>
        <p className="text-ink">Don't let the part you already did go to waste.</p>
      </Body>

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
      subject="I already know what you're going to ask me"
      preview="Will I actually get charged if I'm not approved. No."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 1 · 30 minutes</SendTag>
      </div>

      {/* Minimal coral hero band — quiet confirmation, not celebration */}
      <div className="mx-3 mt-4 rounded-[20px] bg-[#ee7273] md:mx-5">
        <div className="px-6 py-16 text-center md:py-20">
          <p className="font-hero text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[30px]">
            Your program is ready.
          </p>
        </div>
      </div>

      <div className="px-5 pt-8 md:px-8">
        <h1 className="font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          I already know
          <br />
          <span className="text-[#ee7273]">what you're going to ask me.</span>
        </h1>
      </div>


      <Body>
        <p>
          You just finished answering eighteen screens of questions about your body, your history,
          your weight. Things you maybe haven't told anyone else this year.
        </p>
        <p>That takes something. Most people don't make it that far.</p>
        <p>
          Here's what happens now. A physician looks at everything you just told us, today, not next
          week. If they approve you, your first month is{" "}
          <span className="font-semibold text-ink">$249 for semaglutide</span> or{" "}
          <span className="font-semibold text-ink">$299 for tirzepatide</span>. That's already the
          real price. Nothing gets added at checkout.
        </p>
        <p>
          If they don't approve you, you pay nothing. Not "we'll refund it later." Nothing gets
          charged in the first place.
        </p>
        <p className="text-ink">Your spot is open right now. It won't stay that way.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Start My Program</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow2_Email2() {
  return (
    <NurtureShell
      subject="You're probably wondering about the money"
      preview="Same question everyone asks first."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 2 · 3 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          You're probably wondering
          <br />
          <span className="text-[#ee7273]">about the money.</span>
        </h1>
      </div>

      <Body>
        <p>
          Almost everyone who gets this far asks the same three things, so I'll just answer them
          straight.
        </p>

        <div>
          <p className="font-semibold text-ink">Will you charge me before I'm approved?</p>
          <p className="mt-2">
            No. The card gets held, not charged. If a physician says no, you're not out anything.
          </p>
        </div>

        <div>
          <p className="font-semibold text-ink">Does the price go up once my dose does?</p>
          <p className="mt-2">
            No. Whatever you start at is what you pay in month six, month twelve, whenever.
          </p>
        </div>

        <div>
          <p className="font-semibold text-ink">Can I actually cancel, or is this one of those things?</p>
          <p className="mt-2">
            One click. No call, no retention rep trying to talk you out of it.
          </p>
        </div>

        <p className="text-ink">That's the whole deal. No fine print underneath it.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CTA>Start My Program</CTA>
      </div>
    </NurtureShell>
  );
}

/* -- Flow 2 Sensory (already rewritten in previous pass) -------- */

function Flow2_Sensory() {
  return (
    <NurtureShell
      subject="11pm, and you're standing in the kitchen again"
      preview="You already ate dinner two hours ago."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Sensory · 18 hours</SendTag>
      </div>

      {/* Mood-setting hero — real late-night kitchen photograph, no text overlay */}
      <div className="mx-3 mt-4 overflow-hidden rounded-[20px] md:mx-5">
        <img
          src="/assets/email-kitchen-11pm.jpg"
          alt=""
          loading="lazy"
          width={1600}
          height={1008}
          className="block h-auto w-full"
        />
      </div>


      <Body>
        <p>It's not hunger. You know that. You ate two hours ago.</p>
        <p>
          But you're standing in front of the open fridge anyway, and some part of your brain is
          running through options like it's your job. Something salty. Something sweet. Just a
          bite, just to make it stop.
        </p>
        <p>You close the fridge. You open it again four minutes later.</p>
        <p>
          This is the part almost nobody talks about when they talk about weight. Not the number on
          the scale. The voice. The one that never actually shuts off.
        </p>
        <p>
          GLP-1 treatment doesn't argue with that voice. It turns the volume down at the source, the
          part of your brain that generates it in the first place. Patients don't describe it as
          trying harder. They describe it as the noise finally going quiet.
        </p>
        <p className="text-ink">
          You already answered the questions. A physician's ready to look at your case.
        </p>
      </Body>

      <div className="mx-3 mt-8 rounded-[16px] bg-canvas p-5 ring-1 ring-ink/5 md:mx-5 md:p-6">
        <p className="text-[13.5px] leading-[1.6] text-ink/70">
          <span className="font-semibold text-ink">57% of people with obesity</span> report
          near-constant intrusive thoughts about food. It isn't willpower. It's neurology, and it's
          the exact mechanism GLP-1s act on.
        </p>
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Start My Program</CoralCTA>
      </div>
    </NurtureShell>
  );
}

/* -- Flow 2 Email 3: Reviews (kept from prior pass) ------------- */

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

      <div className="mt-6 space-y-4 px-3 md:px-5">
        {BIG_REVIEWS.map((r) => (
          <BigReviewCard key={r.name} r={r} />
        ))}
      </div>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Start My Program</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow2_Email4() {
  return (
    <NurtureShell subject="Can I ask you something" preview="Genuinely, just hit reply.">
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 4 · 48 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          Can I ask you
          <br />
          <span className="text-[#ee7273]">something?</span>
        </h1>
      </div>

      <Body>
        <p>What's actually stopping you.</p>
        <p>
          Not in a pushy way, I mean it. Is it the money. Is it that you've tried things before and
          they didn't stick. Is it that you're not totally sure this is real.
        </p>
        <p>Hit reply and tell me. I read these myself.</p>
        <p className="text-ink">Or if you already know, here's the door.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CTA>Start My Program</CTA>
      </div>
    </NurtureShell>
  );
}

function Flow2_Email5() {
  return (
    <NurtureShell
      subject="Your spot's about to go to someone else"
      preview="Physician slots rotate every 48 hours."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 2 · Send 5 · 72 hours</SendTag>
      </div>

      {/* Coral loss-aversion hero */}
      <div className="relative mx-3 mt-4 overflow-hidden rounded-[20px] bg-[#ee7273] p-6 text-white md:mx-5 md:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/80">
            Physician review · Rotates every 48 hrs
          </p>
          <h2 className="mt-3 font-hero text-[32px] font-semibold leading-[1.02] tracking-[-0.02em] md:text-[40px]">
            Your slot expires
            <br />
            tonight.
          </h2>
        </div>
      </div>

      <Body>
        <p>
          Physician review slots rotate every 48 hours. Yours has been open since you finished your
          assessment, and it closes tonight.
        </p>
        <p className="text-ink">After that, you'd start over.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Claim My Spot</CoralCTA>
      </div>
    </NurtureShell>
  );
}

/* ============================================================
   FLOW 3 — CHECKOUT ABANDONED
   ============================================================ */

function Flow3_Email1() {
  return (
    <NurtureShell
      subject="Sarah, $100 off expires tonight"
      preview="Your physician slot is still held. One step left."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 3 · Send 1 · 30 minutes</SendTag>
      </div>

      {/* Hero — vial on marble */}
      <div className="relative mx-3 mt-4 overflow-hidden rounded-[20px] md:mx-5">
        <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#efe9df] via-[#e8dfd0] to-[#c9bda9] md:aspect-[16/11]">
          <img
            src={vialTirz.url}
            alt=""
            loading="lazy"
            className="absolute left-1/2 top-1/2 h-[74%] w-auto -translate-x-1/2 -translate-y-[54%] object-contain drop-shadow-[0_28px_28px_rgba(60,42,20,0.28)]"
          />
          <div className="absolute bottom-[26%] left-1/2 h-3 w-40 -translate-x-1/2 rounded-full bg-black/25 blur-xl" />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent px-6 py-8 md:py-10">
            <p className="font-hero text-[26px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[32px]">
              Sarah, your program
              <br />
              is one step away.
            </p>
          </div>
        </div>
      </div>

      <Body>
        <p>Your intake is complete.</p>
        <p>Your physician is assigned.</p>
        <p className="text-ink">Your $100 discount is applied.</p>
        <p>The only thing that didn't happen was the last tap.</p>
        <p>
          First month: <span className="font-semibold text-ink">$299 instead of $399.</span>{" "}
          Physician review included. Ships within 48 hours of approval.
        </p>
        <p>
          Physician slots rotate every 24 hours. Yours is still held right now.
        </p>
      </Body>

      <div className="px-5 pt-8 md:px-8">
        <CoralCTA>Complete my order — $299</CoralCTA>
      </div>

      <Body>
        <p className="pt-6">
          Have a question before completing? Reply to this email. A real person responds within
          the hour.
        </p>
        <p className="pb-8 text-ink">The Blissley Team</p>
      </Body>
    </NurtureShell>
  );
}

function Flow3_Email2() {
  return (
    <NurtureShell
      subject="What $299 vs $1,300 actually means"
      preview="Same molecule. One is accessible. One isn't."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 3 · Send 2 · 4 hours</SendTag>
        <h1 className="mt-5 font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
          Same molecule.
          <br />
          <span className="text-[#ee7273]">Different entry point.</span>
        </h1>
      </div>

      {/* Comparison table — coral highlighted center column */}
      <div className="mx-3 mt-6 md:mx-5">
        <div className="relative grid grid-cols-[1.1fr_1fr_1fr] items-stretch">
          {/* Header row */}
          <div />
          <div className="z-10 mx-0 flex h-14 items-center justify-center rounded-t-2xl bg-gradient-to-b from-[#f28a86] to-[#ee7273] px-2 text-center text-[12px] font-bold uppercase tracking-[0.14em] text-white">
            Blissley
          </div>
          <div className="flex h-14 items-end justify-center pb-2 text-center text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60">
            Pharmacy
          </div>

          {/* Label column bg */}
          <div className="col-start-1 row-start-2 rounded-2xl bg-[#f4f2ee]">
            {[
              { l: "Medication", b: "Tirzepatide", p: "Tirzepatide" },
              { l: "Price / month", b: "$299", p: "$1,300+" },
              { l: "Insurance needed", b: "No", p: "Often denied" },
              { l: "Physician review", b: "24 hrs", p: "Weeks" },
              { l: "Waitlist", b: "None", p: "Months" },
              { l: "Price when dose ↑", b: "Same", p: "Goes up" },
              { l: "Cancel anytime", b: "One click", p: "Call required" },
            ].map((r) => (
              <div
                key={`l-${r.l}`}
                className="flex h-14 items-center px-4 text-[13px] font-medium leading-tight text-ink"
              >
                {r.l}
              </div>
            ))}
          </div>

          {/* Blissley column */}
          <div className="col-start-2 row-start-2 -mt-px rounded-b-2xl bg-gradient-to-b from-[#ee7273] to-[#f2a08f]">
            {[
              "Tirzepatide",
              "$299",
              "No",
              "24 hrs",
              "None",
              "Same",
              "One click",
            ].map((v, i) => (
              <div
                key={`b-${i}`}
                className="flex h-14 items-center justify-center px-2 text-center text-[13px] font-semibold text-white"
              >
                {v}
              </div>
            ))}
          </div>

          {/* Pharmacy column */}
          <div className="col-start-3 row-start-2">
            {["Tirzepatide", "$1,300+", "Often denied", "Weeks", "Months", "Goes up", "Call required"].map(
              (v, i) => (
                <div
                  key={`p-${i}`}
                  className="flex h-14 items-center justify-center px-2 text-center text-[13px] font-medium text-ink/60"
                >
                  {v}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <Body>
        <p className="pt-2">
          The reason most people can't access tirzepatide has nothing to do with whether they
          qualify.
        </p>
        <p>
          It costs over $1,300 a month at the pharmacy. Insurance covers almost none of it for
          weight loss. The clinic waitlists run months long.
        </p>
        <p>
          Blissley uses compounded tirzepatide from a licensed US pharmacy. The active molecule is
          identical. The access is what's different.
        </p>
        <p className="text-ink">
          Your first month: <span className="font-semibold">$299.</span> That's $100 off.
        </p>
        <p>A few things worth knowing before you decide.</p>
        <p>
          Your card is not charged until our physician approves your prescription. If they
          determine you're not a candidate, your card is never charged. Not once.
        </p>
        <p>
          Your price does not go up when your dose does. Every other GLP-1 platform charges more
          as your dose increases. Blissley does not. The price you start at is the price you keep.
        </p>
        <p>You can cancel in one click from your portal. No phone call. No hold music. No form.</p>
      </Body>

      <div className="px-5 pt-8 md:px-8">
        <CTA>Complete my order — $299</CTA>
      </div>

      <Body>
        <p className="py-8">Reply to this email if something is unclear. I read every one.</p>
      </Body>
    </NurtureShell>
  );
}

function Flow3_Email3_FoodNoise() {
  return (
    <NurtureShell
      subject="Another year of this, or not"
      preview="Six years is long enough."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 3 · Send 3 · 24 hours · Food-noise variant</SendTag>
      </div>

      <div className="relative mx-3 mt-4 overflow-hidden rounded-[20px] md:mx-5">
        <div className="relative aspect-[4/5] w-full md:aspect-[16/10]">
          <img
            src={heroSky.url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 30%" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-6 py-8 md:py-10">
            <p className="font-hero text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[30px]">
              The noise doesn't have
              <br />
              to be this loud.
            </p>
          </div>
        </div>
      </div>

      <Body>
        <p>Sarah,</p>
        <p>That voice that negotiates with you at every meal has a name.</p>
        <p className="text-ink">Food noise.</p>
        <p>
          It runs from the moment you wake up until you go to sleep. What can I eat. What
          shouldn't I. Why did I eat that. When can I eat again.
        </p>
        <p>
          It's not discipline. It's a hunger signal that hasn't been addressed at its source.
        </p>
        <p className="text-ink">Tirzepatide addresses it at the source.</p>
        <p>Not by making you restrict. By changing the signal itself.</p>
        <p>
          Six years is a long time to be at war with something that was never about willpower.
        </p>
        <p className="text-ink">$100 off your first month. Physician slot closes tonight.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Start my program — $299</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow3_Email3_TriedEverything() {
  return (
    <NurtureShell
      subject="Another year of this, or not"
      preview="Six years is long enough."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 3 · Send 3 · 24 hours · Tried-everything variant</SendTag>
      </div>

      <div className="relative mx-3 mt-4 overflow-hidden rounded-[20px] md:mx-5">
        <div className="relative aspect-[4/5] w-full md:aspect-[16/10]">
          <img
            src={heroTrx.url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 28%" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-6 py-8 md:py-10">
            <p className="font-hero text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[30px]">
              What if this is the one
              <br />
              that actually works.
            </p>
          </div>
        </div>
      </div>

      <Body>
        <p>Sarah,</p>
        <p>Calorie counting taught you to be obsessive, not to lose weight.</p>
        <p>
          Keto worked until it didn't. Intermittent fasting worked until you had a hard week.
        </p>
        <p>None of them addressed why it kept coming back.</p>
        <p>
          When you restrict calories your brain reads it as a threat and increases hunger hormones
          for months after. The weight returns because your biology is working exactly as it was
          designed to.
        </p>
        <p className="text-ink">
          Tirzepatide changes what your brain signals, not what you resist.
        </p>
        <p className="font-hero text-[26px] font-semibold text-ink">42 lbs.</p>
        <p>That's what you came here for.</p>
        <p className="text-ink">$100 off your first month. Your physician slot closes tonight.</p>
      </Body>

      <div className="px-5 py-8 md:px-8">
        <CoralCTA>Get my physician's review — $299</CoralCTA>
      </div>
    </NurtureShell>
  );
}

function Flow3_Email4() {
  return (
    <NurtureShell
      subject="One last thing before I close your file"
      preview="From the founder."
    >
      <div className="px-5 pt-8 md:px-8">
        <SendTag>Flow 3 · Send 4 · 48 hours · Plain text</SendTag>
        <h1 className="mt-5 font-hero text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[30px]">
          One last thing before
          <br />
          <span className="text-[#ee7273]">I close your file.</span>
        </h1>
      </div>

      <Body>
        <p>Sarah,</p>
        <p>This is the last email I'm sending about this.</p>
        <p>
          I don't want to keep reaching out if the timing isn't right.
        </p>
        <p>But before I close your file, one thing worth knowing:</p>
        <p>
          If our physician reviews your profile and doesn't approve you, you pay nothing. The
          authorization is released and that's it.
        </p>
        <p className="text-ink">
          The only way to find out whether this is right for you is to start.
        </p>
        <p>
          Your first month is $299. That's $100 off the standard rate. Physician review included.
          Same price when your dose increases.
        </p>
      </Body>

      <div className="px-5 pt-8 md:px-8">
        <CTA>Complete my order</CTA>
      </div>

      <Body>
        <p className="pt-6">
          If something stopped you that I haven't addressed, reply to this email. I actually read
          these.
        </p>
        <p className="pb-8 text-ink">
          Anmol
          <br />
          <span className="text-ink/55">Founder, Blissley</span>
        </p>
      </Body>
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
      <Flow2_Sensory />
      <Flow2_Email3 />
      <Flow2_Email4 />
      <Flow2_Email5 />

      <FlowDivider
        label="Flow 3 · Checkout abandoned"
        title="Cart abandoned before purchase"
        subtitle="4 emails over 48 hours. Exits on purchase_completed."
      />
      <Flow3_Email1 />
      <Flow3_Email2 />
      <Flow3_Email3_FoodNoise />
      <Flow3_Email3_TriedEverything />
      <Flow3_Email4 />
    </>
  );
}
