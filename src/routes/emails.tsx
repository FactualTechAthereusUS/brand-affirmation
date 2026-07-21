import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import vialBlissley from "@/assets/blissley-tirzepatide-vial-transparent.png.asset.json";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";

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

      <div className="relative mt-8 grid grid-cols-[1fr_auto] gap-4 md:gap-6">
        {/* Timeline column */}
        <ol className="relative pl-1">
          {/* dashed vertical line */}
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
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink shadow-sm">
                {step.label}
              </span>
              <p className="mt-2.5 text-[13.5px] font-medium leading-snug text-ink">{step.title}</p>
              <p className="mt-1 text-[12.5px] leading-[1.55] text-ink/65">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* Product image */}
        <div className="relative flex items-center justify-center self-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-0 rounded-full blur-2xl"
            style={{ background: "radial-gradient(closest-side, rgba(238,114,115,0.35), transparent 70%)" }}
          />
          <img
            src={vialBlissley.url}
            alt="Blissley Compounded Tirzepatide vial"
            className="relative z-10 h-[220px] w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)] md:h-[280px]"
            loading="lazy"
            decoding="async"
          />
        </div>
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

function EmailPreview() {
  return (
    <div className="min-h-screen bg-ink/5 py-6 md:py-12">
      <div className="mx-auto w-full max-w-[480px] px-3 md:max-w-[560px]">
        {/* Email envelope */}
        <div className="overflow-hidden rounded-[22px] bg-canvas shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] ring-1 ring-ink/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
            <img src={blissleyLogo.url} alt="Blissley" className="h-6 w-auto" />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50">
              Order Confirmation
            </span>
          </div>

          <div className="px-5 pt-6 md:px-7">
            {/* Thank you headline */}
            <h1 className="font-hero text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink md:text-[30px]">
              Thanks, Sarah.
            </h1>
            <p className="mt-2 text-[14px] leading-[1.55] text-ink/65">
              Your order is in. We'll email you the moment your physician review is complete.
            </p>
          </div>

          {/* Tracker */}
          <div className="px-5 pb-6 pt-7 md:px-7">
            <Tracker activeIndex={0} />
          </div>

          <div className="h-px bg-ink/8" />

          {/* Order # */}
          <div className="flex items-center justify-between px-5 py-4 md:px-7">
            <span className="text-[13.5px] text-ink">Order #BLS-00421</span>
            <button className="text-[13.5px] font-medium text-ink underline underline-offset-4 hover:text-ink/70">
              View Your Order
            </button>
          </div>

          {/* Product card */}
          <div className="mx-5 rounded-2xl bg-white p-4 ring-1 ring-ink/8 md:mx-7">
            <div className="flex gap-4">
              <div className="grid h-[92px] w-[92px] shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f8e0e2] to-[#eec9cc]">
                <img src={vialTirz.url} alt="Tirzepatide vial" className="h-[80px] w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-semibold leading-tight text-ink">
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

            <div className="my-4 h-px bg-ink/10" />

            {/* Totals */}
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
                <dt className="text-[15px] font-semibold text-ink">Total</dt>
                <dd className="text-[16px] font-semibold text-ink">$711.00</dd>
              </div>
            </dl>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-5 px-5 py-6 md:px-7">
            <div>
              <h4 className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink">
                Shipping Address
              </h4>
              <address className="mt-2 whitespace-pre-line text-[13px] not-italic leading-[1.5] text-ink/75">
                {`Sarah Johnson
1247 Sunset Blvd
Apt 4B
Los Angeles, CA 90026
United States`}
              </address>
            </div>
            <div>
              <h4 className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink">
                Payment Method
              </h4>
              <div className="mt-2 flex items-center gap-2">
                <VisaIcon />
                <span className="text-[13px] text-ink/75">ending 4242</span>
              </div>

              <h4 className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink">
                Billing Address
              </h4>
              <address className="mt-2 whitespace-pre-line text-[13px] not-italic leading-[1.5] text-ink/75">
                {`Sarah Johnson
1247 Sunset Blvd
Los Angeles, CA 90026
United States`}
              </address>
            </div>
          </div>

          {/* Guarantee callout */}
          <div className="mx-5 mb-6 rounded-2xl bg-ink/[0.04] p-4 md:mx-7">
            <div className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white ring-1 ring-ink/10">
                <Check className="h-4 w-4 text-[#ee7273]" strokeWidth={3} />
              </span>
              <p className="text-[13px] leading-[1.55] text-ink/75">
                Your card has been charged. If your physician doesn't approve your prescription,
                you'll get a <span className="font-semibold text-ink">full refund</span>. No questions asked.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pb-7 md:px-7">
            <a
              href="/portal/patient"
              className="flex h-[52px] w-full items-center justify-center rounded-full bg-ink text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Track your order
            </a>
            <p className="mt-4 text-center text-[12px] leading-relaxed text-ink/50">
              Questions? Reply to this email or reach us at{" "}
              <a href="mailto:support@blissley.com" className="text-ink underline underline-offset-2">
                support@blissley.com
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-ink/8 bg-ink/[0.02] px-5 py-5 text-center md:px-7">
            <img src={blissleyLogo.url} alt="Blissley" className="mx-auto h-4 w-auto opacity-70" />
            <p className="mt-3 text-[11px] leading-[1.6] text-ink/45">
              TheFactual LLC DBA Blissley · 131 Continental Dr, Suite 305, Newark, DE 19713
            </p>
          </div>
        </div>

        <NextDaysSection />

        <p className="mt-4 text-center text-[11px] text-ink/40">
          Email preview · <code className="font-mono">/emails</code>
        </p>
      </div>
    </div>
  );
}
