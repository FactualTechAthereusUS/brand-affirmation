import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion } from "motion/react";
import { reviews } from "@/components/home/SocialProof";
import {
  ArrowLeft,
  Check,
  Lock,
  ShieldCheck,
  Tag,
  Truck,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { z } from "zod";

import { TrxHeader } from "@/components/intake/TrxUI";
import { PayIcons, PayIconsPeek } from "@/components/PayIcons";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import hsaFsa from "@/assets/hsa-fsa.png.asset.json";
import iconDeliveryShield from "@/assets/icon-delivery-shield.png.asset.json";
import trustpilotBadge from "@/assets/trustpilot.png.asset.json";
import payAfterpay from "@/assets/pay-afterpay.png.asset.json";
import payKlarna from "@/assets/pay-klarna.png.asset.json";
import payAffirm from "@/assets/pay-affirm.png.asset.json";

/* ── Brand tokens ── */
const NAVY = "#1D437B";
const NAVY_SOFT = "#6B94C7";
const PINK = "#ee7273";
const GREEN = "#16A34A";
const GREEN_TINT = "#EAFBEF";
const BLUE_TINT = "#E7EEFB";

const searchSchema = z.object({
  tx: z.enum(["sema", "tirz"]).default("sema"),
  plan: z.enum(["monthly", "three", "six"]).default("monthly"),
});

export const Route = createFileRoute("/checkout/trimrx")({
  component: CheckoutPage,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Checkout — Blissley" },
      {
        name: "description",
        content:
          "Complete your Blissley order. Secure 256-bit SSL checkout. $0 charged until your prescription is approved.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

/* ── Plan catalog ── */
type PlanDef = {
  key: "monthly" | "three" | "six";
  title: string;
  supply: string;
  months: number;
  perMo: number;
  originalPerMo: number;
  todayPrice?: number;
  savings: number;
  badge?: { label: string; kind: "popular" | "best" };
};

const PLANS: Record<"sema" | "tirz", Record<PlanDef["key"], PlanDef>> = {
  sema: {
    monthly: {
      key: "monthly",
      title: "Monthly Plan",
      supply: "4 Week Supply",
      months: 1,
      perMo: 249,
      originalPerMo: 299,
      todayPrice: 249,
      savings: 50,
    },
    three: {
      key: "three",
      title: "3-Month Plan",
      supply: "12 Week Supply",
      months: 3,
      perMo: 237,
      originalPerMo: 299,
      savings: 186,
      badge: { label: "Most Popular", kind: "popular" },
    },
    six: {
      key: "six",
      title: "6-Month Plan",
      supply: "24 Week Supply",
      months: 6,
      perMo: 237,
      originalPerMo: 299,
      savings: 522,
    },
  },
  tirz: {
    monthly: {
      key: "monthly",
      title: "Monthly Plan",
      supply: "4 Week Supply",
      months: 1,
      perMo: 299,
      originalPerMo: 399,
      todayPrice: 299,
      savings: 100,
    },
    three: {
      key: "three",
      title: "3-Month Plan",
      supply: "12 Week Supply",
      months: 3,
      perMo: 339,
      originalPerMo: 399,
      savings: 180,
      badge: { label: "Most Popular", kind: "popular" },
    },
    six: {
      key: "six",
      title: "6-Month Plan",
      supply: "24 Week Supply",
      months: 6,
      perMo: 299,
      originalPerMo: 399,
      savings: 600,
    },
  },
};

const TREATMENTS = {
  sema: {
    name: "Semaglutide",
    subtitle: "GLP-1 Injections",
    vial: vialSema.url,
    vialBg: "#E4F1E6",
  },
  tirz: {
    name: "Tirzepatide",
    subtitle: "Dual-action GLP-1/GIP",
    vial: vialTirz.url,
    vialBg: "#BFDDEE",
  },
} as const;

/* ── Countdown ── */
function useCountdown(minutes: number) {
  const [ms, setMs] = useState(minutes * 60 * 1000);
  useEffect(() => {
    const id = window.setInterval(() => {
      setMs((v) => (v <= 1000 ? 0 : v - 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ── Field primitives ── */
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
      <span className="mb-1.5 block text-[13px] font-semibold text-ink/80">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 outline-none transition-all focus:border-[color:var(--navy)] focus:ring-4";

function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean },
) {
  const { className = "", invalid, style, ...rest } = props;
  return (
    <input
      {...rest}
      className={`${inputCls} ${className}`}
      style={{
        borderColor: invalid ? PINK : "rgba(29,67,123,0.18)",
        // @ts-expect-error CSS var
        "--navy": NAVY,
        boxShadow: "none",
        ...(style || {}),
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = NAVY;
        e.currentTarget.style.boxShadow = `0 0 0 4px ${NAVY}18`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = invalid
          ? PINK
          : "rgba(29,67,123,0.18)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", style, ...rest } = props;
  return (
    <select
      {...rest}
      className={`${inputCls} appearance-none pr-10 ${className}`}
      style={{
        borderColor: "rgba(29,67,123,0.18)",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231D437B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        ...(style || {}),
      }}
    />
  );
}

/* ── Section header ── */
function StepBadge({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-[17px] font-semibold text-ink sm:text-[18px]">
        {label}
      </h2>
    </div>
  );
}

/* ── States list ── */
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

/* ── Page ── */
function CheckoutPage() {
  const { tx, plan: planKey } = Route.useSearch();
  const navigate = useNavigate();
  const treatment = TREATMENTS[tx as keyof typeof TREATMENTS];
  const plan = PLANS[tx as "sema" | "tirz"][planKey as "monthly" | "three" | "six"];
  const time = useCountdown(9);

  const dueToday = plan.todayPrice ?? plan.perMo * plan.months;
  const originalTotal = plan.originalPerMo * plan.months;
  const totalSavings = plan.savings;
  const hasInstallments = plan.months >= 3;

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    exp: "",
    cvc: "",
    nameOnCard: "",
    country: "United States",
    billingSame: true,
    priority: false,
    insurance: false,
  });
  const [payMethod, setPayMethod] = useState<"card" | "afterpay" | "klarna" | "affirm">(
    "card",
  );
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length > 2 &&
      form.phone.replace(/\D/g, "").length >= 10 &&
      form.address.trim().length > 3 &&
      form.city.trim().length > 1 &&
      form.state.length === 2 &&
      /^\d{5}$/.test(form.zip) &&
      (payMethod !== "card" ||
        (form.cardNumber.replace(/\s/g, "").length >= 13 &&
          /^\d{2}\s*\/\s*\d{2}$/.test(form.exp) &&
          form.cvc.length >= 3))
    );
  }, [form, payMethod]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <TrxHeader onBack={() => navigate({ to: "/sales/trimrx" })} showBack />

      {/* MAIN FLOW */}
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-[760px] flex-col gap-6 px-4 pb-16 sm:px-6"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="flex flex-col gap-6"
        >
          {/* Shipping */}
          <FormCard>
            <StepBadge label="Shipping Address" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name" className="sm:col-span-2">
                  <TextInput
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                </Field>
                <Field label="Phone" className="sm:col-span-2">
                  <TextInput
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>
                <Field label="Street Address" className="sm:col-span-2">
                  <TextInput
                    autoComplete="address-line1"
                    placeholder="123 Main St"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </Field>
                <Field
                  label="Apt / Suite (optional)"
                  className="sm:col-span-2"
                >
                  <TextInput
                    autoComplete="address-line2"
                    placeholder="Apt 4B"
                    value={form.apt}
                    onChange={(e) => set("apt", e.target.value)}
                  />
                </Field>
                <Field label="City">
                  <TextInput
                    autoComplete="address-level2"
                    placeholder="New York"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </Field>
                <Field label="State">
                  <SelectInput
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="ZIP Code" className="sm:col-span-2">
                  <TextInput
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="10001"
                    maxLength={5}
                    value={form.zip}
                    onChange={(e) =>
                      set("zip", e.target.value.replace(/\D/g, ""))
                    }
                  />
                </Field>
              </div>
            </FormCard>

            {/* Your Treatment — middle section */}
            <FormCard>
              <StepBadge label="Your Treatment" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[17px] font-bold text-ink sm:text-[18px]">
                    {treatment.name}
                  </div>
                  <div className="text-[13px] text-ink/60">
                    {treatment.subtitle}
                  </div>
                </div>
                <div
                  className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-2xl"
                  style={{ background: treatment.vialBg }}
                >
                  <img
                    src={treatment.vial}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="divide-y divide-ink/8 py-2">
                <Row label="Plan" value={<b>{plan.title}</b>} />
                <Row label="Supply" value={plan.supply} />
                <Row
                  label="Total Savings"
                  value={
                    <span className="font-bold" style={{ color: GREEN }}>
                      ${totalSavings.toLocaleString()}
                    </span>
                  }
                />
                <Row
                  label="Shipping"
                  value={
                    <span className="font-bold">
                      <span className="mr-1.5 text-ink/40 line-through">
                        ${30 * plan.months}
                      </span>
                      <span style={{ color: GREEN }}>FREE</span>
                    </span>
                  }
                />
                <Row
                  label="Monthly Price"
                  value={
                    <span className="font-bold text-ink">
                      <span className="mr-1 text-ink/40 line-through">
                        ${plan.originalPerMo}
                      </span>
                      <span style={{ color: NAVY }}>${plan.perMo}/mo</span>
                    </span>
                  }
                />
              </div>

              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "#F6F9FE" }}
              >
                <div className="text-[15px] font-bold text-ink">
                  Total if prescribed
                </div>
                <div className="text-right">
                  <span className="mr-2 text-[14px] text-ink/40 line-through">
                    ${originalTotal.toLocaleString()}
                  </span>
                  <span className="text-[20px] font-black" style={{ color: NAVY }}>
                    ${(plan.perMo * plan.months).toLocaleString()}
                  </span>
                </div>
              </div>

              <div
                className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13.5px] font-bold text-white"
                style={{ background: NAVY }}
              >
                <Tag className="h-4 w-4" />
                CODE APPLIED: <span className="ml-1">JOIN120</span>
              </div>
              <div className="mt-2 text-center text-[12.5px] font-semibold text-ink/70">
                Only <span className="text-ink">23 discounts left</span>. Yours
                is reserved for{" "}
                <span style={{ color: PINK }} className="font-bold">
                  {time}
                </span>
              </div>

              <ul className="mt-5 space-y-3.5 text-[14px]">
                {[
                  { t: "Same Price. All Dosage Levels.", s: "No surprise fees as your dose increases." },
                  { t: "Prescribed & shipped within 48 hours", s: "Discreet, temperature-controlled delivery." },
                  { t: "UNLIMITED doctor calls 7 days a week", s: "Talk to a licensed provider anytime." },
                ].map((item) => (
                  <li key={item.t} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                      style={{ background: GREEN }}
                    >
                      <Check className="h-3 w-3 text-white" strokeWidth={4} />
                    </span>
                    <div className="leading-tight">
                      <div className="font-bold text-ink">{item.t}</div>
                      <div className="text-[12.5px] text-ink/55">{item.s}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-ink/15 pt-5"
              >
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/50">
                    Due Today
                  </div>
                  <div className="mt-1 text-[11.5px] text-ink/60">
                    Only charged if<br />your prescription is approved.
                  </div>
                </div>
                <div className="text-right -translate-x-1">
                  <span className="mr-1.5 text-[15px] text-ink/35 line-through">
                    ${plan.perMo}
                  </span>
                  <span
                    className="text-[28px] font-black leading-none"
                    style={{ color: GREEN }}
                  >
                    $0
                  </span>
                </div>
              </motion.div>

              <div className="mt-4 flex items-center justify-center">
                <img
                  src={hsaFsa.url}
                  alt="HSA/FSA Eligible"
                  className="h-8 w-auto"
                />
              </div>
            </FormCard>

            {/* Payment */}
            <FormCard>
              <StepBadge label="Payment" />

              {/* Payment methods — accordion list */}
              <div className="space-y-3">
                {/* Credit card row */}
                <div
                  className="overflow-hidden rounded-2xl border transition-all"
                  style={{
                    borderColor:
                      payMethod === "card" ? NAVY : "rgba(0,0,0,0.10)",
                    background: "#FFFFFF",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setPayMethod("card")}
                    className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Radio active={payMethod === "card"} />
                      <span className="text-[15px] font-bold text-ink">
                        Credit card
                      </span>
                    </div>
                    <PayIconsPeek />
                  </button>


                  {payMethod === "card" && (
                    <div className="bg-[#F3F4F6]">
                      {/* Fields */}
                      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-6 sm:gap-3 sm:p-4">
                        <div className="sm:col-span-6">
                          <div className="relative">
                            <TextInput
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder="Card number"
                              value={form.cardNumber}
                              onChange={(e) =>
                                set(
                                  "cardNumber",
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 19)
                                    .replace(/(\d{4})(?=\d)/g, "$1 "),
                                )
                              }
                              className="pr-11"
                            />
                            <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <TextInput
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="Expiration date (MM / YY)"
                            value={form.exp}
                            onChange={(e) => {
                              const v = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              set(
                                "exp",
                                v.length > 2
                                  ? `${v.slice(0, 2)} / ${v.slice(2)}`
                                  : v,
                              );
                            }}
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <div className="relative">
                            <TextInput
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="Security code"
                              maxLength={4}
                              value={form.cvc}
                              onChange={(e) =>
                                set("cvc", e.target.value.replace(/\D/g, ""))
                              }
                              className="pr-11"
                            />
                            <HelpCircle className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <TextInput
                            autoComplete="cc-name"
                            placeholder="Name on card"
                            value={form.nameOnCard}
                            onChange={(e) => set("nameOnCard", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Billing same */}
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5 text-[13.5px] text-ink/85">
                        <CheckBox
                          on={form.billingSame}
                          onToggle={() =>
                            set("billingSame", !form.billingSame)
                          }
                        />
                        Use shipping address as billing address
                      </label>

                      {/* Upsells — part of the same flow */}
                      <div className="border-t border-black/10 bg-white">
                        <UpsellRow
                          on={form.insurance}
                          onToggle={() => set("insurance", !form.insurance)}
                          icon={
                            <img
                              src={iconDeliveryShield.url}
                              alt=""
                              className="h-7 w-7 object-contain invert"
                            />
                          }
                          title={
                            <>
                              Shipping insurance{" "}
                              <span className="font-bold">($3.95)</span>
                            </>
                          }
                          desc="100% Payment guarantee & protect your order from damage, loss, or theft."
                        />
                        <div className="mx-4 h-px bg-black/5" />
                        <UpsellRow
                          on={form.priority}
                          onToggle={() => set("priority", !form.priority)}
                          icon={
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-7 w-7 text-white"
                            >
                              <path d="M12 2 4 13h7l-1 9 8-11h-7l1-9z" />
                            </svg>
                          }
                          title={
                            <>
                              Front-of-the-line review{" "}
                              <span className="font-bold">($49.95)</span>
                            </>
                          }
                          desc="Skip the 6–24 hour wait. Get an instant telehealth review right now."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* BNPL rows */}
                {hasInstallments &&
                  (
                    [
                      { key: "afterpay", img: payAfterpay.url, label: "Afterpay" },
                      { key: "klarna", img: payKlarna.url, label: "Klarna" },
                      { key: "affirm", img: payAffirm.url, label: "Affirm" },
                    ] as const
                  ).map((m) => (
                    <div
                      key={m.key}
                      className="overflow-hidden rounded-2xl border"
                      style={{
                        borderColor:
                          payMethod === m.key ? NAVY : "rgba(0,0,0,0.10)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setPayMethod(m.key)}
                        className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3.5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Radio active={payMethod === m.key} />
                          <span className="text-[15px] font-bold text-ink">
                            {m.label}
                          </span>
                        </div>
                        <img src={m.img} alt={m.label} className="h-5" />
                      </button>

                      {payMethod === m.key && (
                        <div
                          className="border-t border-black/10 bg-[#F3F4F6] p-4 text-[13.5px] text-ink/70"
                        >
                          You'll be redirected to complete your{" "}
                          <b className="capitalize">{m.label}</b> checkout after
                          confirming your order, split into 4 interest-free
                          payments.
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </FormCard>


            {/* Continue */}
            <motion.button
              type="submit"
              disabled={!canSubmit || submitting}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-2xl px-6 py-4 text-[16px] font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`,
                boxShadow: `0 18px 40px -12px ${NAVY}66`,
              }}
            >
              {submitting
                ? "Processing…"
                : `Continue ($0 charged today)`}
            </motion.button>

            {/* Trustpilot */}
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <span className="text-[15px] font-bold text-ink">Excellent</span>
              <img
                src={trustpilotBadge.url}
                alt="Trustpilot Excellent"
                className="h-5 w-auto"
              />
            </div>

            {/* Trust footer */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink/70">
                <Lock className="h-3.5 w-3.5" style={{ color: GREEN }} />
                256-bit SSL encryption · PCI DSS compliant
              </div>
              <div className="flex items-center gap-2 text-[12px] text-ink/55">
                <Truck className="h-3.5 w-3.5" />
                Discreet, temperature-controlled shipping
              </div>
              <PayIcons className="mt-1 justify-center" />
            </div>

            <p className="text-center text-[11.5px] leading-relaxed text-ink/50">
              By continuing, I confirm I have read and agree to Blissley's
              Telehealth, Privacy, Shipping, and Terms & Conditions; consent to
              the collection, use, and disclosure of my PHI; and authorize
              healthcare services via telehealth. I authorize Blissley to enroll
              me in an auto-renewing subscription and charge my saved payment
              method at the specified intervals until I cancel. Cancellation
              only stops future charges; refunds are governed by the Refund
              Policy.
            </p>

            <ReviewSlider />
          </motion.div>
        </form>
      </div>
  );
}

/* ── Review slider (no images, no bullets) ── */
function ReviewSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = trackRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-review-card]");
      const target = cards[index];
      if (!target) return;
      const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
      el.scrollTo({ left, behavior });
    },
    []
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-review-card]"));
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
      const cards = el.querySelectorAll<HTMLElement>("[data-review-card]");
      if (!cards.length) return;
      const next = (active + 1) % cards.length;
      goTo(next);
    }, 4000);
    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <div className="pt-2">
      <div
        ref={trackRef}
        onPointerDown={pause}
        onWheel={pause}
        onTouchStart={pause}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            data-review-card
            className="w-[92%] shrink-0 snap-center sm:w-[78%] md:w-[68%]"
          >
            <div
              className="rounded-2xl border border-black/8 bg-white p-4 transition-all duration-500 ease-out"
              style={{
                opacity: i === active ? 1 : 0.45,
                transform: i === active ? "scale(1)" : "scale(0.97)",
                filter: i === active ? "blur(0px)" : "blur(2px)",
              }}
            >
              <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg
                    key={s}
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    style={{ fill: PINK }}
                  >
                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 text-[15px] font-semibold leading-[1.35] text-ink">
                {r.lead}
              </p>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-ink/70">
                {r.body}
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F2EE] text-[12px] font-bold text-ink/70">
                  {r.name.split(" ")[0][0]}
                </div>
                <div>
                  <div className="text-[13.5px] font-medium text-ink">
                    {r.name}
                  </div>
                  <div className="text-[12px] text-ink/55">{r.meta}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="w-4 shrink-0" />
      </div>
    </div>
  );
}

/* ── Small sub-components ── */
function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 text-[14px]">
      <span className="text-ink/60">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function FormCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`p-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}


function MethodTab({
  active,
  onClick,
  icon,
  label,
  img,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  img?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 place-items-center rounded-xl text-[12.5px] font-semibold transition-all"
      style={{
        background: active ? "#FFFFFF" : "transparent",
        color: NAVY,
        boxShadow: active ? "0 6px 18px rgba(29,67,123,0.14)" : "none",
      }}
    >
      {img ? (
        <img src={img} alt="" className="h-4 w-auto" />
      ) : (
        <span className="flex items-center gap-1.5">
          {icon}
          {label}
        </span>
      )}
    </button>
  );
}

function Radio({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className="grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors"
      style={{
        borderColor: active ? NAVY : "rgba(0,0,0,0.25)",
        background: active ? NAVY : "#FFFFFF",
      }}
    >
      {active && <span className="h-2 w-2 rounded-full bg-white" />}
    </span>
  );
}

function CheckBox({
  on,
  onToggle,
  color = NAVY,
}: {
  on: boolean;
  onToggle: () => void;
  color?: string;
}) {
  return (
    <span
      role="checkbox"
      aria-checked={on}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="mt-0.5 grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md border transition-colors"
      style={{
        borderColor: on ? color : "rgba(29,67,123,0.35)",
        background: on ? color : "#FFFFFF",
      }}
    >
      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.4} />}
    </span>
  );
}

function UpsellRow({
  on,
  onToggle,
  icon,
  title,
  desc,
}: {
  on: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: React.ReactNode;
  desc: string;
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-3 px-4 py-4 sm:gap-4"
      style={{ background: on ? "#FFF7F7" : "transparent" }}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink sm:h-12 sm:w-12">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-tight text-ink sm:text-[15px]">
          {title}
        </div>
        <div className="mt-1 text-[12.5px] leading-snug text-ink/60 sm:text-[13px]">
          {desc}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
        style={{ background: on ? PINK : "#111111" }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all"
          style={{ left: on ? "calc(100% - 1.25rem - 0.25rem)" : "0.25rem" }}
        />
      </button>
    </label>
  );
}
