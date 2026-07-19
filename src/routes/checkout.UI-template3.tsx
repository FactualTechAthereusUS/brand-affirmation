import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import {
  Check,
  Folder,
  Truck,
  CreditCard,
  Lock,
} from "lucide-react";

import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";

/* ── Search ── */
const searchSchema = z.object({
  tx: z.enum(["sema", "tirz"]).default("sema"),
  plan: z.enum(["monthly", "three", "six"]).default("monthly"),
});

export const Route = createFileRoute("/checkout/UI-template3")({
  component: CheckoutTemplate3,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Complete Your Order — Blissley" },
      {
        name: "description",
        content:
          "Secure checkout for your Blissley treatment. Only charged if prescribed by a licensed physician.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

/* ── Catalog ── */
type PlanKey = "monthly" | "three" | "six";
type PlanDef = {
  key: PlanKey;
  title: string;
  supply: string;
  months: number;
  perMo: number;
  originalPerMo: number;
};

const PLANS: Record<"sema" | "tirz", Record<PlanKey, PlanDef>> = {
  sema: {
    monthly: { key: "monthly", title: "1 Month Supply", supply: "4 Week Supply", months: 1, perMo: 249, originalPerMo: 299 },
    three: { key: "three", title: "3 Month Supply", supply: "12 Week Supply", months: 3, perMo: 237, originalPerMo: 299 },
    six: { key: "six", title: "6 Month Supply", supply: "24 Week Supply", months: 6, perMo: 237, originalPerMo: 299 },
  },
  tirz: {
    monthly: { key: "monthly", title: "1 Month Supply", supply: "4 Week Supply", months: 1, perMo: 299, originalPerMo: 399 },
    three: { key: "three", title: "3 Month Supply", supply: "12 Week Supply", months: 3, perMo: 339, originalPerMo: 399 },
    six: { key: "six", title: "6 Month Supply", supply: "24 Week Supply", months: 6, perMo: 299, originalPerMo: 399 },
  },
};

const TREATMENTS = {
  sema: {
    name: "Semaglutide Injections",
    vial: vialSema.url,
    vialBg: "#E4F1E6",
    blurb:
      "Physician-prescribed injectable semaglutide. Compounded GLP-1 for meaningful weight management, dose-titrated to the minimum effective dose by your provider. Same price at every step — from 0.25mg starting dose to 2.4mg maintenance. Compounded at a licensed U.S. pharmacy.",
  },
  tirz: {
    name: "Tirzepatide Injections",
    vial: vialTirz.url,
    vialBg: "#BFDDEE",
    blurb:
      "Physician-prescribed injectable tirzepatide. Dual-action GLP-1/GIP compounded therapy, dose-titrated by your provider to the minimum effective dose. Same price at every step. Compounded at a licensed U.S. pharmacy.",
  },
} as const;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

/* ── Field primitives (Pepton style: greyed pill inputs) ── */
const labelCls = "mb-2 block text-[14px] font-semibold text-ink";
const inputCls =
  "block w-full rounded-xl border border-transparent bg-[#F2F2F2] px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/40 outline-none transition focus:border-ink/20 focus:bg-white focus:ring-4 focus:ring-ink/5";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${inputCls} ${className}`} />;
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`${inputCls} appearance-none pr-10 ${className}`}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="text-ink">{icon}</span>
      <h2 className="text-[19px] font-bold text-ink sm:text-[20px]">{title}</h2>
    </div>
  );
}

/* ── Page ── */
function CheckoutTemplate3() {
  const { tx, plan: planKey } = Route.useSearch();
  const treatment = TREATMENTS[tx];
  const plan = PLANS[tx][planKey];

  const upfront = plan.perMo * plan.months;
  const dueToday = upfront;

  const [form, setForm] = useState({
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    exp: "",
    cvc: "",
    country: "United States",
    cardZip: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = useMemo(
    () =>
      form.address.trim().length > 3 &&
      form.city.trim().length > 1 &&
      form.state.length === 2 &&
      /^\d{5}$/.test(form.zip) &&
      form.cardNumber.replace(/\s/g, "").length >= 13 &&
      /^\d{2}\s*\/\s*\d{2}$/.test(form.exp) &&
      form.cvc.length >= 3,
    [form],
  );

  const addressReady =
    form.address.trim().length > 3 &&
    form.city.trim().length > 1 &&
    form.state.length === 2 &&
    /^\d{5}$/.test(form.zip);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 1500);
  };

  /* Proportional right-column scroll sync (same as trimrx/charged-before) */
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const sync = () => {
      const left = leftColRef.current;
      const right = rightInnerRef.current;
      if (!left || !right) return;
      if (window.innerWidth < 1024) {
        right.style.transform = "";
        return;
      }
      const vh = window.innerHeight;
      const leftScrollable = left.offsetHeight - vh;
      const rightScrollable = right.scrollHeight - vh;
      if (leftScrollable <= 0 || rightScrollable <= 0) {
        right.style.transform = "";
        return;
      }
      const leftTop = left.getBoundingClientRect().top;
      const scrolled = Math.min(Math.max(-leftTop, 0), leftScrollable);
      const progress = scrolled / leftScrollable;
      right.style.transform = `translate3d(0, ${-progress * rightScrollable}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    sync();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const orderSummary = (
    <section className="rounded-2xl bg-[#F5F5F4] p-6 sm:p-7">
      <h3 className="mb-5 text-[22px] font-bold text-ink">Order Summary</h3>

      <div className="flex gap-4">
        <div
          className="h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl"
          style={{ background: treatment.vialBg }}
        >
          <img src={treatment.vial} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 text-[18px] font-bold leading-tight text-ink">
            {treatment.name}
          </div>
          <p className="text-[14px] leading-[1.55] text-ink/60">
            {treatment.blurb}
          </p>
          <div className="mt-3 inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink ring-1 ring-ink/10">
            {plan.title} Plan
          </div>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-ink/10" />

      <div className="flex items-center justify-between text-[15px]">
        <span className="text-ink/70">{plan.title}</span>
        <span className="text-ink">
          <span className="font-bold">${upfront}</span>
          <span className="ml-1 text-[13px] text-ink/50">billed on approval</span>
        </span>
      </div>

      <div className="my-6 h-px w-full bg-ink/10" />

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[22px] font-bold text-ink">Due Today</div>
        </div>
        <div className="text-[34px] font-bold leading-none text-ink">
          ${dueToday}
        </div>
      </div>

      <p className="mt-4 text-[15px] font-semibold text-ink">
        Only charged if prescribed by a licensed physician
      </p>
      <p className="mt-2 text-[13.5px] leading-[1.55] text-ink/60">
        We&apos;ll securely hold your payment method. You&apos;ll only be charged
        after a doctor reviews your information and prescribes your medication.
      </p>
    </section>
  );

  const disclaimerBlock = (
    <div className="mt-5 rounded-2xl bg-[#F5F5F4] p-6 text-[13.5px] leading-[1.6] text-ink/70 sm:p-7">
      <p>
        <span className="font-bold text-ink">Payment Authorization:</span>{" "}
        We&apos;ll securely pre-authorize your payment method for the amount
        shown. You&apos;ll only be charged if a licensed physician prescribes
        your medication after reviewing your medical information.
      </p>
      <p className="mt-4">
        <span className="font-bold text-ink">Medical Disclaimer:</span> By
        submitting this form, I confirm that all information provided is
        accurate and complete to the best of my knowledge. I understand that
        providing complete and honest medical information is essential for safe
        treatment.
      </p>
      <p className="mt-4">
        *Product packaging may vary. Prescriptions will be fulfilled by a
        licensed compounding pharmacy.
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Wordmark bar */}
      <div className="border-b border-ink/5">
        <div className="mx-auto flex max-w-[1200px] items-center px-4 py-6 sm:px-8">
          <a href="/" className="text-[22px] font-semibold tracking-tight text-ink">
            Blissley
          </a>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:gap-10 lg:px-8">
          {/* LEFT */}
          <div ref={leftColRef} className="px-4 pb-16 pt-8 sm:px-8 lg:px-0 lg:pt-12">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[30px] font-bold leading-[1.15] text-ink sm:text-[34px]"
            >
              Complete Your Order
            </motion.h1>
            <p className="mt-2 text-[15px] text-ink/60">
              Secure checkout for your treatment
            </p>

            {/* Mobile order summary */}
            <div className="mt-8 lg:hidden">
              {orderSummary}
            </div>

            {/* Plan card */}
            <div className="mt-8">
              <SectionHeader icon={<Folder className="h-5 w-5" strokeWidth={1.75} />} title="Select Your Treatment Plan" />
              <div className="rounded-2xl border-2 border-ink p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-bold text-ink">{plan.title}</div>
                    <div className="mt-1 text-[26px] font-bold leading-none text-ink">
                      ${plan.perMo}.00
                    </div>
                    <div className="mt-1 text-[13.5px] text-ink/50">
                      ${upfront}.00 upfront
                    </div>
                    <div className="mt-4 text-[14px] font-semibold text-ink">Includes:</div>
                    <ul className="mt-2 space-y-1.5 text-[14.5px] text-ink/80">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                        Free expedited shipping
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                        Provider oversight and support
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                        Unlimited doctor messaging
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="mt-10">
              <SectionHeader icon={<Truck className="h-5 w-5" strokeWidth={1.75} />} title="Shipping Information" />
              <div className="space-y-4">
                <Field label="Street Address">
                  <TextInput
                    placeholder="Start typing your address..."
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    autoComplete="address-line1"
                  />
                </Field>
                <Field label="Apartment, suite, etc. (optional)">
                  <TextInput
                    placeholder="Apt, Suite, etc."
                    value={form.apt}
                    onChange={(e) => set("apt", e.target.value)}
                    autoComplete="address-line2"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="City">
                    <TextInput
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field label="State">
                    <SelectInput
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                    >
                      <option value="">State</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </SelectInput>
                  </Field>
                </div>
                <Field label="ZIP Code">
                  <TextInput
                    placeholder="ZIP Code"
                    inputMode="numeric"
                    maxLength={5}
                    value={form.zip}
                    onChange={(e) => set("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                    autoComplete="postal-code"
                  />
                </Field>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-10">
              <div className="mb-5 flex items-center gap-2.5">
                <CreditCard className="h-5 w-5 text-ink" strokeWidth={1.75} />
                <h2 className="text-[19px] font-bold text-ink sm:text-[20px]">Payment Information</h2>
                <Lock className="ml-1 h-4 w-4 text-ink/50" strokeWidth={2} />
              </div>

              <div className="rounded-2xl border border-ink/10 p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2.5 text-ink">
                  <CreditCard className="h-5 w-5" strokeWidth={2} />
                  <span className="text-[16px] font-bold">Card</span>
                </div>
                <div className="mb-5 flex items-center gap-2 text-[13.5px] text-ink/70">
                  <span className="grid h-6 w-5 place-items-center rounded-sm bg-emerald-500 text-white">
                    <Lock className="h-3 w-3" strokeWidth={3} />
                  </span>
                  Secure, fast checkout with Link
                </div>

                <Field label="Card number" className="mb-4">
                  <div className="relative">
                    <TextInput
                      placeholder="1234 1234 1234 1234"
                      inputMode="numeric"
                      className="pl-12"
                      value={form.cardNumber}
                      onChange={(e) => set("cardNumber", e.target.value)}
                    />
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      <div className="grid h-6 w-8 place-items-center rounded-[3px] bg-ink/10">
                        <div className="h-1 w-4 rounded-sm bg-ink/40" />
                      </div>
                    </div>
                  </div>
                </Field>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <Field label="Expiration">
                    <TextInput
                      placeholder="MM / YY"
                      value={form.exp}
                      onChange={(e) => set("exp", e.target.value)}
                    />
                  </Field>
                  <Field label="CVC">
                    <TextInput
                      placeholder="CVC"
                      inputMode="numeric"
                      maxLength={4}
                      value={form.cvc}
                      onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Country">
                    <SelectInput
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                    >
                      <option>United States</option>
                    </SelectInput>
                  </Field>
                  <Field label="ZIP code">
                    <TextInput
                      placeholder="12345"
                      inputMode="numeric"
                      maxLength={5}
                      value={form.cardZip}
                      onChange={(e) => set("cardZip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                    />
                  </Field>
                </div>

                <p className="mt-5 text-[13px] leading-[1.55] text-ink/60">
                  By providing your card information, you allow Blissley to
                  charge your card for future payments in accordance with their
                  terms.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="mt-6 w-full rounded-2xl bg-ink py-4 text-[15.5px] font-bold text-white transition disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                {submitting
                  ? "Processing…"
                  : addressReady
                    ? `Complete purchase — $${dueToday}`
                    : "Please enter your address to continue"}
              </button>

              <p className="mt-4 text-center text-[12.5px] leading-[1.5] text-ink/55">
                A licensed healthcare provider will review your information and
                ensure that the treatment is right for you before any
                prescription is written.
              </p>
            </div>

            {/* Mobile disclaimers */}
            <div className="lg:hidden">{disclaimerBlock}</div>
          </div>

          {/* RIGHT */}
          <aside className="hidden lg:block">
            <div ref={rightInnerRef} className="pt-12 will-change-transform">
              {orderSummary}
              {disclaimerBlock}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="border-t border-ink/10">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-4 py-6 text-[13px] text-ink/60 sm:flex-row sm:items-center sm:px-8">
            <div>© {new Date().getFullYear()} Blissley. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="/terms" className="hover:text-ink">Terms of Service</a>
              <a href="/privacy" className="hover:text-ink">Privacy Policy</a>
              <a href="/terms" className="hover:text-ink">Telehealth Consent</a>
            </div>
          </div>
        </footer>
      </form>
    </main>
  );
}
