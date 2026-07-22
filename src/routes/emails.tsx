import { createFileRoute } from "@tanstack/react-router";
import { Check, Activity, MessageSquare, Truck, CreditCard, Pill, Stethoscope, Salad, HeartPulse, Package, AlertCircle, PauseCircle, Clock } from "lucide-react";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import vialBlissley from "@/assets/blissley-tirzepatide-vial-transparent.png.asset.json";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import blissleyWhite from "@/assets/blissley-white.png.asset.json";
import drNassPortal from "@/assets/dr-nass-portal.png.asset.json";
import emailMeal from "@/assets/email-meal.jpg.asset.json";
import emailSupport from "@/assets/email-support.jpg.asset.json";

const TIMELINE = [
  {
    label: "Within 24 hours",
    title: "Physician review complete.",
    body: "Dr. Nass reviews your full intake and writes your prescription if approved.",
  },
  {
    label: "Within 48 hours",
    title: "Your medication ships.",
    body: "Prepared at a licensed US pharmacy. Temperature-controlled. Discreet packaging.",
  },
  {
    label: "Days 3–5",
    title: "Arrives at your door.",
    body: "Tracking number sent the moment it leaves the facility.",
  },
  {
    label: "Night of arrival",
    title: "Your first injection.",
    body: "Take it at bedtime. You'll sleep through the adjustment period. This is the beginning.",
  },
];

function NextDaysSection() {
  return (
    <section className="relative mt-4 overflow-hidden rounded-[22px] bg-gradient-to-b from-[#f8dcd7] via-[#f4c8c4] to-[#eec9cc] px-5 py-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5 md:px-8 md:py-12">
      {/* sparkles */}
      <svg className="pointer-events-none absolute right-6 top-24 h-5 w-5 text-white/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"/></svg>
      <svg className="pointer-events-none absolute right-20 top-[46%] h-3 w-3 text-white/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"/></svg>
      <svg className="pointer-events-none absolute right-10 bottom-24 h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"/></svg>

      <header className="text-center">
        <h2 className="font-hero text-[28px] font-semibold leading-[1.05] tracking-[-0.015em] text-ink md:text-[36px]">
          Here's what the<br className="hidden sm:block" /> next few days look like.
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65 md:text-[14.5px]">
          What to expect after you place your order
        </p>
      </header>

      <div className="relative mt-8">
        {/* Vial background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-end">
          <div className="relative -mr-6 md:-mr-2">
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(238,114,115,0.4), transparent 70%)" }}
            />
            <img
              src={vialBlissley.url}
              alt=""
              className="relative h-[340px] w-auto object-contain opacity-70 md:h-[420px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Timeline column on top */}
        <ol className="relative pl-1 pr-[38%] md:pr-[42%]">
          <span
            aria-hidden
            className="absolute left-[6px] top-3 bottom-3 w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(23,23,23,0.55) 0 3px, transparent 3px 8px)",
            }}
          />
          {TIMELINE.map((step, i) => (
            <li key={step.label} className={`relative pl-6 ${i === TIMELINE.length - 1 ? "" : "pb-6"}`}>
              <span className="absolute left-0 top-[6px] h-3 w-3 rounded-full bg-ink ring-4 ring-[#f4c8c4]" />
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink shadow-sm backdrop-blur">
                {step.label}
              </span>
              <p className="mt-2.5 text-[13.5px] font-semibold leading-snug text-ink">{step.title}</p>
              <p className="mt-1 text-[12.5px] leading-[1.55] text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-10 text-center font-hero text-[16px] font-semibold italic text-ink md:text-[18px]">
        Same price at every dose. Forever.
      </p>
    </section>
  );
}

export const Route = createFileRoute("/emails")({
  component: EmailPreview,
  head: () => ({
    meta: [
      { title: "Order Confirmation Email · Blissley" },
      { name: "description", content: "Preview of the Blissley order confirmation email sent to patients." },
      { property: "og:title", content: "Order Confirmation Email · Blissley" },
      { property: "og:description", content: "Preview of the Blissley order confirmation email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const STEPS = ["Order Placed", "Physician Review", "Shipping", "Delivery"] as const;

function Tracker({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div className="relative">
      <div className="absolute left-[14px] right-[14px] top-[14px] h-px bg-ink/15" />
      <div
        className="absolute left-[14px] top-[14px] h-px bg-ink transition-all"
        style={{ width: `calc((100% - 28px) * ${activeIndex / (STEPS.length - 1)})` }}
      />
      <ol className="relative grid grid-cols-4 gap-1">
        {STEPS.map((label, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={label} className="flex flex-col items-center text-center">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border-2 transition-colors ${
                  done || active ? "border-ink bg-ink text-white" : "border-ink/25 bg-canvas text-ink/40"
                }`}
              >
                {done || active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
              </span>
              <span
                className={`mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] ${
                  active || done ? "text-ink" : "text-ink/45"
                }`}
              >
                {label}
              </span>
              {i === 0 && (
                <span className="mt-0.5 text-[10px] font-normal text-ink/50">(Jul 21, 2026)</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function VisaIcon() {
  return (
    <span className="grid h-6 w-9 place-items-center rounded-[3px] bg-white ring-1 ring-ink/15">
      <span className="text-[10px] font-black italic tracking-tight text-[#1A1F71]">VISA</span>
    </span>
  );
}

const PORTAL_FEATURES = [
  {
    icon: Activity,
    title: "Physician status",
    body: "Track Dr. Nass's review in real time",
  },
  {
    icon: MessageSquare,
    title: "Messages",
    body: "Message Dr. Nass or your care team directly",
  },
  {
    icon: Truck,
    title: "Shipments",
    body: "Track your order the moment it ships",
  },
  {
    icon: CreditCard,
    title: "My Plan",
    body: "Manage your subscription, pause, cancel, update card",
  },
];

function PortalEmail() {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] bg-ink/[0.04] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
      {/* Wordmark header */}
      <div className="flex items-center justify-center bg-canvas py-5">
        <img src={blissleyLogo.url} alt="Blissley" className="h-5 w-auto" />
      </div>

      {/* Hero */}
      <div className="px-5 pt-10 pb-8 text-center md:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
          From care@blissley.com
        </p>
        <h1 className="mt-3 font-hero text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[40px]">
          Your Blissley portal
          <br />
          <span className="text-[#ee7273]">is ready.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[340px] text-[14.5px] leading-[1.55] text-ink/65">
          This is where everything lives — your physician review status, your care team, your
          shipments, and your subscription.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <a
            href="/portal/patient"
            className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-8 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Open my portal
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
        <p className="mt-3 text-[12px] text-ink/50">Private link · expires in 24 hours</p>
      </div>

      {/* Inside your portal card */}
      <div className="mx-3 mb-6 rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:mx-5 md:p-7">
        <h2 className="font-hero text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[26px]">
          Inside <span className="text-[#ee7273]">your portal</span>
        </h2>

        <ul className="mt-6 space-y-5">
          {PORTAL_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.title}
                className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-4 md:grid-cols-[76px_minmax(0,1fr)] md:gap-5"
              >
                <div className="grid aspect-square place-items-center rounded-2xl bg-[#ee7273]/10 ring-1 ring-[#ee7273]/15">
                  <Icon className="h-7 w-7 text-[#ee7273]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 pt-1">
                  <h3 className="text-[15.5px] font-semibold leading-tight text-ink md:text-[16.5px]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.55] text-ink/65">{f.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Closer */}
      <div className="px-5 pb-10 pt-4 text-center md:px-8">
        <h2 className="font-hero text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink md:text-[30px]">
          Need a <span className="text-[#ee7273]">new login link?</span>
        </h2>
        <p className="mt-2 text-[13.5px] text-ink/60">
          Visit{" "}
          <a href="https://portal.blissley.com" className="font-medium text-ink underline underline-offset-4 hover:text-ink/70">
            portal.blissley.com
          </a>{" "}
          to request one anytime.
        </p>
      </div>

      {/* Dark footer */}
      <div className="relative overflow-hidden bg-ink px-5 py-8 md:px-8">
        <img src={blissleyWhite.url} alt="Blissley" className="h-4 w-auto opacity-80" />
        <p className="mt-4 text-[11.5px] leading-[1.6] text-white/55">
          TheFactual LLC DBA Blissley · 131 Continental Dr, Suite 305, Newark, DE 19713
        </p>
        <p className="mt-2 text-[11px] leading-[1.6] text-white/45">
          This is a transactional email. For medical emergencies call 911.
        </p>
      </div>
    </div>
  );
}

const PLAN_FEATURES = [
  {
    image: drNassPortal.url,
    icon: Pill,
    title: "Dosage or medication adjustments",
    copy: "Ensure your treatment plan is personalized to your changing needs — reviewed by your physician every month.",
  },
  {
    image: emailSupport.url,
    icon: Stethoscope,
    title: "Care team support",
    copy: "Message licensed providers 7 days a week directly inside your Blissley portal.",
  },
  {
    image: emailMeal.url,
    icon: Salad,
    title: "Tailored lifestyle resources",
    copy: "Get daily protein recommendations, movement goals, and habit nudges that fit your life.",
  },
  {
    image: vialBlissley.url,
    icon: HeartPulse,
    title: "Anti-nausea support",
    copy: "If eligible, get medication to help manage potential side effects — shipped alongside your plan.",
  },
];

function PlansEmail() {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] bg-ink/[0.04] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
      {/* Wordmark header */}
      <div className="flex items-center justify-center bg-canvas py-5">
        <img src={blissleyLogo.url} alt="Blissley" className="h-5 w-auto" />
      </div>

      {/* Hero */}
      <div className="px-5 pt-10 pb-8 text-center md:px-8">
        <h1 className="font-hero text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[40px]">
          Weight loss plans
          <br />
          <span className="text-[#ee7273]">that put you first</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[340px] text-[14.5px] leading-[1.55] text-ink/65">
          If prescribed, you'll get a comprehensive treatment plan designed to help you lose weight,
          build healthy habits, and reach your goals.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="/intake/weight-loss"
            className="inline-flex h-[46px] items-center justify-center rounded-full bg-ink px-7 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Get started
          </a>
          <a
            href="/weight-loss"
            className="inline-flex h-[46px] items-center justify-center rounded-full bg-canvas px-6 text-[14px] font-medium text-ink ring-1 ring-ink/15 transition hover:bg-white"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* Set up for success card */}
      <div className="mx-3 mb-6 rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:mx-5 md:p-7">
        <h2 className="font-hero text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[26px]">
          How you'll be <span className="text-[#ee7273]">set up for success</span>
        </h2>

        <ul className="mt-6 space-y-6">
          {PLAN_FEATURES.map((f) => (
            <li key={f.title} className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-4 md:grid-cols-[130px_minmax(0,1fr)] md:gap-5">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/5">
                <img
                  src={f.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 pt-1">
                <h3 className="text-[15.5px] font-semibold leading-tight text-ink md:text-[16.5px]">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.55] text-ink/65">
                  {f.copy}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Closer CTA */}
      <div className="px-5 pb-10 pt-4 text-center md:px-8">
        <h2 className="font-hero text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink md:text-[30px]">
          Start your <span className="text-[#ee7273]">weight loss journey</span>
        </h2>
        <p className="mt-2 text-[13.5px] text-ink/60">
          100% online. No insurance required.
        </p>
        <a
          href="/intake/weight-loss"
          className="mt-5 inline-flex h-[48px] items-center justify-center rounded-full bg-ink px-8 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          Get started
        </a>
      </div>

      {/* Dark footer */}
      <div className="relative overflow-hidden bg-ink px-5 pt-8 md:px-8">
        <p className="text-[11.5px] leading-[1.6] text-white/55">
          Not available in all 50 states. Blissley Weight Loss is a physician-supervised program
          that includes clinical review, lifestyle guidance, and compounded medications prescribed
          based on what your provider determines is medically appropriate. See website for full
          details, important safety information, and restrictions.
        </p>

        <div className="mt-6 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/8">
          <p className="text-center text-[12px] text-white/60">Your Blissley portal</p>
          <h3 className="mt-1 text-center font-hero text-[22px] font-semibold leading-tight tracking-[-0.01em] text-white">
            Total care.
            <br />
            Totally different.
          </h3>
          <a
            href="/portal/patient"
            className="mx-auto mt-4 flex h-[42px] w-fit items-center justify-center rounded-full bg-white px-6 text-[13px] font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Open my portal →
          </a>
          <p className="mt-3 text-center text-[11px] text-white/45">Private link · expires in 24h</p>
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 pb-4 text-[11px] leading-[1.6] text-white/50 md:flex-row md:items-center md:justify-between">
          <div>
            <p>© 2026 TheFactual LLC DBA Blissley.</p>
            <p>131 Continental Dr, Suite 305, Newark, DE 19713</p>
            <p className="mt-1">
              <a href="#" className="underline underline-offset-2 hover:text-white/70">Privacy</a>
              <span className="mx-2 text-white/25">|</span>
              <a href="#" className="underline underline-offset-2 hover:text-white/70">Terms</a>
              <span className="mx-2 text-white/25">|</span>
              <a href="#" className="underline underline-offset-2 hover:text-white/70">Unsubscribe</a>
            </p>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="-mx-5 mt-2 md:-mx-8">
          <img
            src={blissleyWhite.url}
            alt=""
            className="block w-full opacity-[0.06]"
          />
        </div>
      </div>
    </div>
  );
}

function RefundEmail() {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] bg-ink/[0.04] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
      {/* Wordmark header */}
      <div className="flex items-center justify-center bg-canvas py-5">
        <img src={blissleyLogo.url} alt="Blissley" className="h-5 w-auto" />
      </div>

      {/* Hero */}
      <div className="px-5 pt-10 pb-6 text-center md:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
          From care@blissley.com
        </p>
        <h1 className="mt-3 font-hero text-[30px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[36px]">
          An update on your
          <br />
          <span className="text-[#ee7273]">Blissley review</span>
        </h1>
      </div>

      {/* Message body */}
      <div className="px-5 md:px-8">
        <p className="text-[15px] leading-[1.6] text-ink/80">
          Hi Sarah,
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/70">
          Dr. Nass reviewed your profile and determined that our GLP-1 program isn't the right fit
          based on your medical history at this time.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/70">
          This decision was made carefully and with your safety as the only priority.
        </p>
      </div>

      {/* Refund confirmed card */}
      <div className="mx-3 mb-2 mt-8 rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:mx-5 md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ee7273]/10 ring-1 ring-[#ee7273]/15">
            <Check className="h-5 w-5 text-[#ee7273]" strokeWidth={2.5} />
          </span>
          <h2 className="font-hero text-[20px] font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[24px]">
            Refund confirmed
          </h2>
        </div>

        <dl className="mt-6 space-y-3 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-ink/60">Amount refunded</dt>
            <dd className="font-semibold text-ink">$711.00</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Card</dt>
            <dd className="flex items-center gap-2 text-ink">
              <VisaIcon />
              <span>Visa ending 4242</span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Order #</dt>
            <dd className="font-medium text-ink">BLS-00421</dd>
          </div>
        </dl>

        <div className="my-5 h-px bg-ink/8" />

        <p className="text-[13.5px] leading-[1.6] text-ink/70">
          Your refund has been issued in full. It will appear in your account within 3-5 business
          days, depending on your bank.
        </p>
      </div>

      {/* What happens next */}
      <div className="px-5 pb-4 pt-6 md:px-8">
        <h2 className="font-hero text-[20px] font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[24px]">
          What happens <span className="text-[#ee7273]">next</span>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/70">
          A member of our care team will reach out within 24 hours to talk through your options —
          including whether there's another path that might be a fit for you.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/70">
          If you have questions right now, just reply to this email. A real person reads every reply.
        </p>

        <p className="mt-8 text-[15px] font-medium text-ink">
          The Blissley Care Team
        </p>
      </div>

      {/* Dark footer */}
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
        <p className="mt-4 text-[11px] leading-[1.6] text-white/45">
          This is a transactional email related to your Blissley order.
        </p>
      </div>
    </div>
  );
}

const SHIPPING_STEPS = [
  { label: "Order Placed", date: "Jul 21" },
  { label: "Physician Review", date: "Jul 22" },
  { label: "Shipping", date: "Jul 23" },
  { label: "Delivery", date: "" },
];

function ShippingTracker() {
  const activeIndex = 2;
  return (
    <div className="relative">
      <div className="absolute left-[14px] right-[14px] top-[14px] h-px bg-ink/15" />
      <div
        className="absolute left-[14px] top-[14px] h-px bg-ink transition-all"
        style={{ width: `calc((100% - 28px) * ${activeIndex / (SHIPPING_STEPS.length - 1)})` }}
      />
      <ol className="relative grid grid-cols-4 gap-1">
        {SHIPPING_STEPS.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={step.label} className="flex flex-col items-center text-center">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border-2 transition-colors ${
                  done || active ? "border-ink bg-ink text-white" : "border-ink/25 bg-canvas text-ink/40"
                }`}
              >
                {done || active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
              </span>
              <span
                className={`mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] ${
                  active || done ? "text-ink" : "text-ink/45"
                }`}
              >
                {step.label}
              </span>
              {step.date && (
                <span className="mt-0.5 text-[10px] font-normal text-ink/50">{step.date}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ShippingEmail() {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] bg-ink/[0.04] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
      {/* Wordmark header */}
      <div className="flex items-center justify-center bg-canvas py-5">
        <img src={blissleyLogo.url} alt="Blissley" className="h-5 w-auto" />
      </div>

      {/* Hero card */}
      <div className="px-5 pt-6 md:px-8">
        <div className="rounded-[20px] bg-canvas p-6 text-center shadow-[0_1px_0_rgba(0,0,0,0.03)] ring-1 ring-ink/5 md:p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#ee7273]/10 ring-1 ring-[#ee7273]/15">
            <Package className="h-8 w-8 text-[#ee7273]" strokeWidth={1.75} />
          </div>
          <h1 className="mt-5 font-hero text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink md:text-[30px]">
            It's on its way, Sarah.
          </h1>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-ink/65">
            Your box just left the pharmacy.
          </p>
        </div>
      </div>

      {/* Tracker */}
      <div className="px-5 pb-2 pt-7 md:px-8">
        <ShippingTracker />
      </div>

      {/* Tracking details */}
      <div className="px-5 pt-4 md:px-8">
        <div className="rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] ring-1 ring-ink/5 md:p-7">
          <h2 className="font-hero text-[18px] font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[20px]">
            Tracking
          </h2>
          <dl className="mt-5 space-y-3 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink/60">Carrier</dt>
              <dd className="font-medium text-ink">UPS Next Day Air</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Tracking #</dt>
              <dd className="font-medium text-ink">1Z999AA10123456784</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Est. delivery</dt>
              <dd className="font-medium text-ink">Jul 24 – Jul 25</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Order #</dt>
              <dd className="font-medium text-ink">BLS-00421</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pt-5 md:px-8">
        <a
          href="#"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          Track my package
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Body copy */}
      <div className="px-5 pt-8 pb-6 text-center md:px-8">
        <p className="text-[14.5px] leading-[1.6] text-ink/70">
          Shipped temperature-controlled, in discreet packaging. Nothing identifying on the outside.
        </p>
        <p className="mt-5 font-hero text-[18px] font-semibold leading-[1.25] tracking-[-0.01em] text-ink md:text-[20px]">
          The box arriving at your door is the beginning.
        </p>
      </div>

      {/* Questions */}
      <div className="px-5 pb-10 md:px-8">
        <div className="rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] ring-1 ring-ink/5 md:p-7">
          <h2 className="font-hero text-[18px] font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[20px]">
            Questions before it arrives?
          </h2>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink/70">
            Reply to this email or message us in your portal. A real person responds within a few hours.
          </p>
          <p className="mt-5 text-[14px] font-medium text-ink">The Blissley Team</p>
        </div>
      </div>

      {/* Dark footer */}
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
        <p className="mt-4 text-[11px] leading-[1.6] text-white/45">
          This is a transactional email related to your Blissley order.
        </p>
      </div>
    </div>
  );
}

function EmailPreview() {
  return (
    <div className="min-h-screen bg-ink/5 py-6 md:py-12">
      <div className="mx-auto w-full max-w-[480px] px-3 md:max-w-[560px]">
        {/* Email envelope */}
        <div className="overflow-hidden rounded-[22px] bg-ink/[0.04] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
          {/* Wordmark header */}
          <div className="flex items-center justify-center bg-canvas py-5">
            <img src={blissleyLogo.url} alt="Blissley" className="h-5 w-auto" />
          </div>

          {/* Hero */}
          <div className="px-5 pt-10 pb-8 text-center md:px-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
              Order Confirmation · #BLS-00421
            </p>
            <h1 className="mt-3 font-hero text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[40px]">
              Thanks, Sarah.
              <br />
              <span className="text-[#ee7273]">Your order is in.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[340px] text-[14.5px] leading-[1.55] text-ink/65">
              We'll email you the moment Dr. Nass completes your physician review.
            </p>
          </div>

          {/* Tracker card */}
          <div className="mx-3 mb-6 rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:mx-5 md:p-7">
            <Tracker activeIndex={0} />
          </div>

          {/* Product + totals card */}
          <div className="mx-3 mb-6 rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:mx-5 md:p-7">
            <h2 className="font-hero text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[26px]">
              Your <span className="text-[#ee7273]">order</span>
            </h2>

            <div className="mt-5 flex gap-4">
              <div className="grid h-[96px] w-[96px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8e0e2] to-[#eec9cc]">
                <img src={vialTirz.url} alt="Tirzepatide vial" className="h-[82px] w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-semibold leading-tight text-ink md:text-[16.5px]">
                  Tirzepatide — 3 Month Plan
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-ink/70">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                  <span>Ships every 28 days · 3 vials</span>
                </div>
                <p className="mt-1 text-[12.5px] text-ink/60">
                  3 vials · $711.00 <span className="text-ink/45">($237.00/vial)</span>
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-ink/10" />

            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink/70">Subtotal</dt>
                <dd className="text-ink">$711.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Shipping</dt>
                <dd className="font-medium uppercase tracking-wide text-[#ee7273]">Free</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Estimated Taxes</dt>
                <dd className="text-ink">$0.00</dd>
              </div>
              <div className="mt-3 flex justify-between border-t border-ink/10 pt-3">
                <dt className="text-[15px] font-semibold text-ink">Total charged today</dt>
                <dd className="text-[16px] font-semibold text-ink">$711.00</dd>
              </div>
            </dl>

            {/* Guarantee */}
            <div className="mt-5 flex gap-3 rounded-2xl bg-[#ee7273]/8 p-4 ring-1 ring-[#ee7273]/15">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[#ee7273]/20">
                <Check className="h-4 w-4 text-[#ee7273]" strokeWidth={3} />
              </span>
              <p className="text-[13px] leading-[1.55] text-ink/75">
                If your physician doesn't approve your prescription, you'll get a{" "}
                <span className="font-semibold text-ink">full refund</span>. No questions asked.
              </p>
            </div>
          </div>

          {/* Shipping + Payment card */}
          <div className="mx-3 mb-6 rounded-[20px] bg-canvas p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:mx-5 md:p-7">
            <h2 className="font-hero text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[26px]">
              Shipping <span className="text-[#ee7273]">& payment</span>
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <h4 className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/60">
                  Shipping Address
                </h4>
                <address className="mt-2 whitespace-pre-line text-[13.5px] not-italic leading-[1.55] text-ink">
                  {`Sarah Johnson
1247 Sunset Blvd, Apt 4B
Los Angeles, CA 90026
United States`}
                </address>
              </div>
              <div>
                <h4 className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/60">
                  Payment Method
                </h4>
                <div className="mt-2 flex items-center gap-2">
                  <VisaIcon />
                  <span className="text-[13.5px] text-ink">ending 4242</span>
                </div>
                <h4 className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/60">
                  Billing Address
                </h4>
                <address className="mt-2 whitespace-pre-line text-[13.5px] not-italic leading-[1.55] text-ink">
                  {`Sarah Johnson
1247 Sunset Blvd
Los Angeles, CA 90026`}
                </address>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pb-8 pt-2 text-center md:px-8">
            <a
              href="/portal/patient"
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-8 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Track your order
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <p className="mt-4 text-[12.5px] text-ink/55">
              Questions? Reply to this email or reach us at{" "}
              <a href="mailto:support@blissley.com" className="font-medium text-ink underline underline-offset-2">
                support@blissley.com
              </a>
            </p>
          </div>

          {/* Dark footer */}
          <div className="relative overflow-hidden bg-ink px-5 py-8 md:px-8">
            <img src={blissleyWhite.url} alt="Blissley" className="h-4 w-auto opacity-80" />
            <p className="mt-4 text-[11.5px] leading-[1.6] text-white/55">
              TheFactual LLC DBA Blissley · 131 Continental Dr, Suite 305, Newark, DE 19713
            </p>
            <p className="mt-2 text-[11px] leading-[1.6] text-white/45">
              This is a transactional email related to your Blissley order.
            </p>
          </div>
        </div>

        <NextDaysSection />

        <PortalEmail />

        <PlansEmail />

        <RefundEmail />

        <ShippingEmail />

        <p className="mt-4 text-center text-[11px] text-ink/40">
          Email preview · <code className="font-mono">/emails</code>
        </p>
      </div>
    </div>
  );
}
