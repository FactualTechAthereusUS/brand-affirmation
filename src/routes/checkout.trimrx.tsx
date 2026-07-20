import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import shippingPolicyMd from "@/content/legal/shipping-policy.md?raw";

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
  Zap,
  X,
  Package,
} from "lucide-react";
import { z } from "zod";

import { TrxHeader } from "@/components/intake/TrxUI";
import { ValueStack } from "@/components/home/ValueStack";
import { PayIcons, PayIconsPeek } from "@/components/PayIcons";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import hsaFsa from "@/assets/hsa-fsa.png.asset.json";
import iconDeliveryShield from "@/assets/icon-delivery-shield.png.asset.json";
import iconCheckBadge from "@/assets/check-badge.png.asset.json";
import iconShipBox from "@/assets/ship-box.png.asset.json";
import iconDocHeadset from "@/assets/doc-headset.png.asset.json";
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
          "Complete your Blissley order. Secure 256-bit SSL checkout. Charged today — full refund if your prescription is not approved.",
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
  const baseSubtotal = plan.perMo * plan.months;


  // Form state
  const [form, setForm] = useState({
    email: "",
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

  // Proportional scroll sync: right column follows left's scroll progress on desktop
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

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Prefill from intake (sessionStorage)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("blissley_intake_broad");
      if (!raw) return;
      const data = JSON.parse(raw);
      setForm((f) => ({
        ...f,
        email: f.email || data.email || "",
        fullName:
          f.fullName ||
          [data.firstName, data.lastName].filter(Boolean).join(" ").trim(),
        phone: f.phone || data.phone || "",
        state: f.state || data.state || "",
      }));
    } catch {}
  }, []);

  const canSubmit = useMemo(() => {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
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

  const [payFailed, setPayFailed] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setPayFailed(false);
    window.setTimeout(() => {
      setSubmitting(false);
      // Demo: card ending 0002 simulates a decline (Stripe test-decline convention)
      const digits = form.cardNumber.replace(/\D/g, "");
      if (payMethod === "card" && digits.endsWith("0002")) {
        setPayFailed(true);
        // TODO: fire Klaviyo payment_failed event
        return;
      }
      const [firstName] = form.fullName.trim().split(/\s+/);
      navigate({
        to: "/confirmation",
        search: {
          model: "auth",
          tx: (search.tx as "sema" | "tirz") ?? "sema",
          plan: (search.plan as "monthly" | "three" | "six") ?? "monthly",
          total: Math.round(summarySubtotal),
          first: firstName || "",
          email: form.email,
          order: "",
        },
      });
    }, 1400);
  };

  const insurancePrice = 3.95;
  const priorityPrice = 49.95;
  const addOnsTotal =
    (form.insurance ? insurancePrice : 0) + (form.priority ? priorityPrice : 0);
  const summaryOriginal = originalTotal + addOnsTotal;
  const summarySubtotal = baseSubtotal + addOnsTotal;
  const fmtMoney = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: n % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    });

  const treatmentSummary = (
    <FormCard>
      <StepBadge label="Your Treatment" />

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[15px] font-bold text-ink sm:text-[16px]">
            {treatment.name}
          </div>
          <div className="text-[12px] text-ink/60">{treatment.subtitle}</div>
        </div>
        <div
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl"
          style={{ background: treatment.vialBg }}
        >
          <img src={treatment.vial} alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="divide-y divide-ink/8 py-1 text-[13px]">
        <div className="flex items-center justify-between py-2">
          <span className="text-ink/60">Plan</span>
          <span className="font-bold">{plan.title}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-ink/60">Supply</span>
          <span>{plan.supply}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-ink/60">Total Savings</span>
          <span className="font-bold" style={{ color: GREEN }}>
            ${totalSavings.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-ink/60">Shipping</span>
          <span className="font-bold">
            <span className="mr-1.5 text-ink/40 line-through">${30 * plan.months}</span>
            <span style={{ color: GREEN }}>FREE</span>
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-ink/60">Monthly Price</span>
          <span className="font-bold text-ink">
            <span className="mr-1 text-ink/40 line-through">${plan.originalPerMo}</span>
            <span className="text-ink">${plan.perMo}/mo</span>
          </span>
        </div>
        {form.insurance && (
          <div className="flex items-center justify-between py-2">
            <span className="text-ink/60">Shipping insurance</span>
            <span className="font-bold text-ink">${fmtMoney(insurancePrice)}</span>
          </div>
        )}
        {form.priority && (
          <div className="flex items-center justify-between py-2">
            <span className="text-ink/60">Front-of-the-line</span>
            <span className="font-bold text-ink">${fmtMoney(priorityPrice)}</span>
          </div>
        )}
      </div>


      <div
        className="mt-3 flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px] font-bold text-white"
        style={{ background: NAVY }}
      >
        <Tag className="h-3.5 w-3.5" />
        CODE APPLIED: <span className="ml-1">JOIN120</span>
      </div>
      <div className="mt-1.5 text-center text-[11.5px] font-semibold text-ink/70">
        Only <span className="text-ink">23 discounts left</span>. Yours is reserved for{" "}
        <span style={{ color: PINK }} className="font-bold">
          {time}
        </span>
      </div>

      <ul className="mt-4 space-y-2.5 text-[13px]">
        {[
          { t: "Same Price. All Dosage Levels.", s: "No surprise fees as your dose increases.", icon: iconCheckBadge.url, bold: true },
          { t: "Prescribed & shipped within 48 hours", s: "Discreet, temperature-controlled delivery.", icon: iconShipBox.url },
          { t: "UNLIMITED doctor calls 7 days a week", s: "Talk to a licensed provider anytime.", icon: iconDocHeadset.url },
        ].map((item) => (
          <li key={item.t} className="flex items-start gap-2.5">
            <img
              src={item.icon}
              alt=""
              className={`mt-0.5 shrink-0 object-contain ${item.bold ? "h-5 w-5 brightness-0 contrast-125" : "h-4 w-4"}`}
            />
            <div className="leading-tight">
              <div className="font-bold text-ink text-[13px]">{item.t}</div>
              <div className="text-[11.5px] text-ink/55">{item.s}</div>
            </div>
          </li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-4 flex items-center justify-between gap-4 border-t border-dashed border-ink/15 pt-4"
      >
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50">
            Due Today
          </div>
          <div className="mt-1 text-[11px] text-ink/60">
            Full refund if your<br />prescription is not approved.
          </div>
        </div>
        <div className="text-right -translate-x-1">
          <span className="mr-1.5 text-[13px] text-ink/35 line-through">
            ${fmtMoney(summaryOriginal)}
          </span>
          <span className="text-[24px] font-black leading-none text-ink">
            ${fmtMoney(summarySubtotal)}
          </span>
        </div>
      </motion.div>

      <div className="mt-3 flex items-center justify-center">
        <img src={hsaFsa.url} alt="HSA/FSA Eligible" className="h-7 w-auto" />
      </div>
    </FormCard>
  );

  return (
    <div className="min-h-screen bg-white">
      <TrxHeader onBack={() => navigate({ to: "/sales/trimrx" })} showBack />

      {/* MOBILE ONLY — collapsible order summary bar */}
      <MobileOrderBar
        originalTotal={summaryOriginal}
        currentTotal={summarySubtotal}
      >
        {treatmentSummary}
      </MobileOrderBar>

      {/* MOBILE ONLY — reservation urgency banner */}
      <ReservationBanner />

      {/* MAIN FLOW — Shopify-style split: form left, grey summary right */}
      <form onSubmit={onSubmit} className="w-full">
        <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
          {/* LEFT — checkout form */}
          <div ref={leftColRef} className="bg-white lg:flex lg:justify-end">

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="flex w-full max-w-[560px] flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:pl-8 lg:pr-12 lg:pt-10"
            >
              {/* Contact */}
              <FormCard>
                <div className="mb-3 flex items-end justify-between">
                  <StepBadge label="Contact" />
                  <a
                    href="/login"
                    className="text-[13px] font-semibold underline underline-offset-4"
                    style={{ color: NAVY }}
                  >
                    Sign in
                  </a>
                </div>
                <Field label="Email">
                  <TextInput
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
              </FormCard>

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
                  <Field label="Apt / Suite (optional)" className="sm:col-span-2">
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
                      onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>
                </div>
              </FormCard>

              {/* Treatment summary is shown in the mobile top bar (collapsible) */}


              {/* Payment */}
              <FormCard>
                <StepBadge label="Payment" />

                <div className="space-y-3">
                  {/* Credit card row */}
                  <div
                    className="overflow-hidden rounded-2xl border transition-all"
                    style={{
                      borderColor: payMethod === "card" ? NAVY : "rgba(0,0,0,0.10)",
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
                        <span className="text-[15px] font-bold text-ink">Credit card</span>
                      </div>
                      <PayIconsPeek />
                    </button>

                    {payMethod === "card" && (
                      <div className="bg-[#F3F4F6]">
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
                                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                                set(
                                  "exp",
                                  v.length > 2 ? `${v.slice(0, 2)} / ${v.slice(2)}` : v,
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
                                onChange={(e) => set("cvc", e.target.value.replace(/\D/g, ""))}
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

                        <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5 text-[13.5px] text-ink/85">
                          <CheckBox
                            on={form.billingSame}
                            onToggle={() => set("billingSame", !form.billingSame)}
                          />
                          Use shipping address as billing address
                        </label>

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
                          borderColor: payMethod === m.key ? NAVY : "rgba(0,0,0,0.10)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setPayMethod(m.key)}
                          className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3.5 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Radio active={payMethod === m.key} />
                            <span className="text-[15px] font-bold text-ink">{m.label}</span>
                          </div>
                          <img src={m.img} alt={m.label} className="h-5" />
                        </button>

                        {payMethod === m.key && (
                          <div className="border-t border-black/10 bg-[#F3F4F6] p-4 text-[13.5px] text-ink/70">
                            You'll be redirected to complete your{" "}
                            <b className="capitalize">{m.label}</b> checkout after confirming your
                            order, split into 4 interest-free payments.
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Upsells — apply to any payment method */}
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
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
                          Shipping insurance <span className="font-bold">($3.95)</span>
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
                      desc="Skip the 6–24 hour review queue. A clinician reviews your intake instantly and ships same-day if approved."
                    />
                  </div>
                </div>
              </FormCard>

              {/* MOBILE ONLY — expanded order summary (below payment) */}
              <MobileOrderSummaryDetail
                treatmentName={treatment.name}
                treatmentSubtitle={treatment.subtitle}
                vial={treatment.vial}
                vialBg={treatment.vialBg}
                planTitle={plan.title}
                supply={plan.supply}
                months={plan.months}
                perMo={plan.perMo}
                originalPerMo={plan.originalPerMo}
                baseSubtotal={baseSubtotal}
                originalTotal={originalTotal}
                planSavings={plan.savings}
                insurance={form.insurance}
                priority={form.priority}
              />




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
                {submitting ? "Processing…" : `Complete purchase — $${fmtMoney(summarySubtotal)}`}
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
                By continuing, I confirm I have read and agree to Blissley's Telehealth, Privacy,
                Shipping, and Terms & Conditions; consent to the collection, use, and disclosure
                of my PHI; and authorize healthcare services via telehealth. I authorize Blissley
                to enroll me in an auto-renewing subscription and charge my saved payment method
                at the specified intervals until I cancel. Cancellation only stops future
                charges; refunds are governed by the Refund Policy.
              </p>

              <ReviewSlider />

              <div className="lg:hidden">
                <ValueStack />
              </div>

              {/* Policy footer */}
              <div className="mt-0 border-t border-ink/10 pt-4">
                <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink/50">
                  {[
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms", href: "/terms" },
                    { label: "Shipping", href: "/shipping" },
                    { label: "Refund Policy", href: "/refund" },
                    { label: "Medication Safety", href: "/medication-safety" },
                  ].map((l, i, arr) => (
                    <span key={l.label} className="inline-flex items-center gap-x-4">
                      <a
                        href={l.href}
                        className="font-medium underline underline-offset-4 hover:opacity-80"
                        style={{ color: NAVY }}
                      >
                        {l.label}
                      </a>
                      {i < arr.length - 1 && (
                        <span className="text-ink/20">·</span>
                      )}
                    </span>
                  ))}
                </nav>
                <div className="mt-4 text-[11.5px] text-ink/45">
                  © {new Date().getFullYear()} TheFactual LLC DBA Blissley
                </div>
                <p className="mt-3 max-w-2xl text-[11.5px] leading-[1.6] text-ink/35">
                  Blissley is a technology platform and does not provide medical advice. Physician services are provided by independent licensed practitioners. Individual results may vary.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — grey order summary (desktop only) */}
          <aside
            className="hidden lg:block"
            style={{ background: "#F5F5F7", minHeight: "calc(100vh - 64px)" }}
          >
            <div ref={rightInnerRef} className="sticky top-0 flex w-full max-w-[460px] flex-col gap-4 px-8 pb-16 pt-10 lg:pl-12 will-change-transform">
              {treatmentSummary}

              <div className="hidden lg:block">
                <ValueStack />
              </div>
            </div>
          </aside>
        </div>
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
      const trackRect = el.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const left =
        el.scrollLeft +
        targetRect.left -
        trackRect.left -
        (trackRect.width - targetRect.width) / 2;
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
    // Center the first card on mount after layout settles so it doesn't pin left.
    requestAnimationFrame(() => requestAnimationFrame(() => goTo(0, "auto")));
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [goTo]);

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
    <div className="pt-0">
      <div
        ref={trackRef}
        onPointerDown={pause}
        onWheel={pause}
        onTouchStart={pause}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-[6%] pb-4 sm:-mx-6 sm:gap-4 sm:px-[calc(50%-140px)] md:px-[calc(50%-150px)] lg:-ml-8 lg:-mr-12 lg:px-[calc(50%-150px)]"
      >
        {reviews.map((r, i) => {
          const isActive = i === active;
          return (
            <div
              key={i}
              data-review-card
              className="w-[88%] shrink-0 snap-center sm:w-[280px] md:w-[300px] lg:w-[300px]"
            >
              <article
                className="flex h-full flex-col transition-all duration-700 ease-out will-change-transform"
                style={{
                  opacity: isActive ? 1 : 0.35,
                  transform: isActive ? "scale(1)" : "scale(0.96)",
                  filter: isActive ? "blur(0px)" : "blur(5px)",
                }}
              >
                {/* Review card with avatar */}
                <div className="flex h-full flex-col rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#F3F2EE] ring-1 ring-black/5">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: "50% 25%" }}
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-ink">{r.name}</div>
                      <div className="truncate text-[12px] text-ink/55">{r.meta}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} viewBox="0 0 20 20" className="h-4 w-4" style={{ fill: PINK }}>
                        <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-3 text-[15px] font-semibold leading-[1.35] text-ink sm:text-[16px]">
                    {r.lead}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-ink/70">
                    {r.body}
                  </p>
                </div>
              </article>
            </div>
          );
        })}
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

/* ── Mobile-only collapsible order summary bar ── */
function MobileOrderBar({
  originalTotal,
  currentTotal,
  children,
}: {
  originalTotal: number;
  currentTotal: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden border-b border-t border-ink/10" style={{ background: "#F5F5F7" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
          Order summary
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
        <span className="text-right leading-tight">
          <span className="mr-2 text-[13.5px] text-ink/40 line-through">
            ${originalTotal.toLocaleString()}
          </span>
          <span className="text-[18px] font-black text-ink">
            ${currentTotal.toLocaleString()}
          </span>
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Mobile-only reservation urgency banner ── */
function ReservationBanner() {
  const [discountsLeft, setDiscountsLeft] = useState(() => 40 + Math.floor(Math.random() * 35)); // 40-74
  const [secondsLeft, setSecondsLeft] = useState(() => 6 * 60 + 30 + Math.floor(Math.random() * 90)); // 6:30-8:00
  const expired = secondsLeft <= 0;

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const tick = () => {
      if (cancelled) return;
      setDiscountsLeft((n) => {
        if (n <= 1) return 1;
        const step =
          n > 30 ? 3 + Math.floor(Math.random() * 3) :
          n > 15 ? 2 + Math.floor(Math.random() * 2) :
          n > 5  ? 1 + Math.floor(Math.random() * 2) :
                   1;
        return Math.max(1, n - step);
      });
      const delay = 1500 + Math.random() * 2500;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 1200 + Math.random() * 1200);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <div className="lg:hidden px-4 pt-3">
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4"
        style={{ background: "rgba(238, 114, 115, 0.10)" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={PINK}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div className="min-w-0 flex-1 text-[13.5px] sm:text-[14px] font-semibold text-ink leading-snug">
          {expired ? (
            <div>Your reservation has expired</div>
          ) : (
            <>
              <div>
                Only <span style={{ color: PINK }}>{discountsLeft}</span> {discountsLeft === 1 ? "discount" : "discounts"} left
              </div>
              <div className="mt-0.5">
                Yours is reserved for{" "}
                <span className="font-bold tabular-nums" style={{ color: PINK }}>{mmss}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile-only order summary (Shopify/Hears-style collapsible) ── */
function MobileOrderSummaryDetail({
  treatmentName,
  treatmentSubtitle,
  vial,
  vialBg,
  planTitle,
  supply,
  months,
  originalPerMo,
  baseSubtotal,
  planSavings,
  insurance,
  priority,
}: {
  treatmentName: string;
  treatmentSubtitle: string;
  vial: string;
  vialBg: string;
  planTitle: string;
  supply: string;
  months: number;
  perMo: number;
  originalPerMo: number;
  baseSubtotal: number;
  originalTotal: number;
  planSavings: number;
  insurance: boolean;
  priority: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(true);
  const [code, setCode] = useState("JOIN120");
  const [shippingOpen, setShippingOpen] = useState(false);


  // Scarcity: dynamic discounts-left + reservation timer
  const [discountsLeft, setDiscountsLeft] = useState(() => 40 + Math.floor(Math.random() * 35)); // 40-74
  const [secondsLeft, setSecondsLeft] = useState(() => 6 * 60 + 30 + Math.floor(Math.random() * 90)); // 6:30-8:00

  useEffect(() => {
    // Decrease gradually by 1-5 at a time; slow down near the end, stop at 1.
    let cancelled = false;
    let timer: number | undefined;
    const tick = () => {
      if (cancelled) return;
      setDiscountsLeft((n) => {
        if (n <= 1) return 1;
        const step =
          n > 30 ? 3 + Math.floor(Math.random() * 3) : // 3-5
          n > 15 ? 2 + Math.floor(Math.random() * 2) : // 2-3
          n > 5  ? 1 + Math.floor(Math.random() * 2) : // 1-2
                   1;
        return Math.max(1, n - step);
      });
      const delay =
        1500 + Math.random() * 2500; // 1.5s-4s between drops
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 1200 + Math.random() * 1200);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);



  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;


  const shippingWas = 30 * months;
  const insurancePrice = 3.95;
  const priorityPrice = 49.95;

  // Line items — one row per add-on line, treatment is the primary
  const itemCount = 1 + (insurance ? 1 : 0) + (priority ? 1 : 0);
  const addOnsTotal = (insurance ? insurancePrice : 0) + (priority ? priorityPrice : 0);
  // Subtotal shown at ORIGINAL (pre-discount) plan price + add-ons, so the
  // "Plan discount" line below reconciles cleanly to the final Total.
  const originalPlanTotal = originalPerMo * months;
  const subtotal = originalPlanTotal + addOnsTotal;
  const planDiscount = discountApplied ? planSavings : 0; // JOIN120 = plan savings
  const total = subtotal - planDiscount; // shipping is free, so not subtracted
  const savings = planDiscount + shippingWas;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  return (
    <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 py-6 bg-white">
      {/* EXPANDED VIEW (image 2) */}
      {open && (
        <div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mb-4 flex w-full items-center justify-between"
          >
            <span className="text-[20px] font-black text-ink">Order summary</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          {/* Treatment line item */}
          <div className="flex items-start gap-3">
            <ThumbCard src={vial} bg={vialBg} qty={months} size={72} />
            <div className="min-w-0 flex-1 pt-1">
              <div className="text-[15px] font-bold text-ink">{treatmentName}</div>
              <div className="text-[12.5px] text-ink/60">{treatmentSubtitle} · {supply}</div>
              {discountApplied && (
                <div className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-ink/70">
                  <SavingsIcon className="h-3 w-3" /> JOIN120 (−${fmt(planSavings)})
                </div>
              )}
            </div>
            <div className="text-right leading-tight pt-1">
              <div className="text-[13px] text-ink/40 line-through">${fmt(originalPlanTotal)}</div>
              <div className="text-[15px] font-bold text-ink">${fmt(discountApplied ? baseSubtotal : originalPlanTotal)}</div>
            </div>
          </div>

          {/* Add-on line items */}
          {insurance && (
            <div className="mt-4 flex items-start gap-3">
              <ThumbCard
                icon={<img src={iconDeliveryShield.url} alt="" className="h-6 w-6 object-contain invert" />}
                qty={1}
                size={48}
                bg="#171717"
              />
              <div className="min-w-0 flex-1 pt-1">
                <div className="text-[14.5px] font-bold text-ink">Shipping insurance</div>
                <div className="text-[12.5px] text-ink/60">Loss / damage / theft protection</div>
              </div>
              <div className="text-[14.5px] font-bold text-ink pt-1">${fmt(insurancePrice)}</div>
            </div>
          )}
          {priority && (
            <div className="mt-4 flex items-start gap-3">
              <ThumbCard
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 2 4 13h7l-1 9 8-11h-7l1-9z" />
                  </svg>
                }
                qty={1}
                size={48}
                bg="#171717"
              />
              <div className="min-w-0 flex-1 pt-1">
                <div className="text-[14.5px] font-bold text-ink">Front-of-the-line review</div>
                <div className="text-[12.5px] text-ink/60">Instant clinician review · same-day ship</div>
              </div>
              <div className="text-[14.5px] font-bold text-ink pt-1">${fmt(priorityPrice)}</div>
            </div>
          )}

          {/* Discount code input */}
          {!discountApplied && (
            <div className="mt-5 flex items-stretch gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-[14px] text-ink outline-none focus:border-ink/40"
                placeholder="Discount code or gift card"
              />
              <button
                type="button"
                onClick={() => setDiscountApplied(true)}
                className="rounded-xl bg-ink/5 px-5 text-[14px] font-bold text-ink/70"
              >
                Apply
              </button>
            </div>
          )}
          {discountApplied && (
            <div className="mt-5">
              <div
                className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-white"
                style={{ background: NAVY }}
              >
                <span className="flex items-center gap-2 text-[13.5px] font-bold tracking-wider">
                  <SavingsIcon className="h-4 w-4" color="#FFFFFF" />
                  CODE APPLIED:
                  <span className="ml-1">{code}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDiscountApplied(false)}
                  aria-label="Remove discount"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/15 hover:bg-white/25 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 text-center text-[12.5px] font-semibold text-ink/70">
                Only <span className="text-ink">{discountsLeft} {discountsLeft === 1 ? "discount" : "discounts"} left</span>. Yours is reserved for{" "}
                <span style={{ color: PINK }} className="font-bold tabular-nums">
                  {mmss}
                </span>
              </div>
            </div>
          )}


          {/* Totals */}
          <div className="mt-5 space-y-2.5 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-ink">Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}</span>
              <span className="font-semibold text-ink">${fmt(subtotal)}</span>
            </div>
            {discountApplied && (
              <div className="flex items-start justify-between">
                <span className="text-ink">
                  Plan discount
                  <span className="mt-0.5 flex items-center gap-1 text-[12.5px] text-ink/60">
                    <SavingsIcon className="h-3 w-3" /> JOIN120
                  </span>
                </span>
                <span className="font-semibold text-ink">−${fmt(planDiscount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink">
                Shipping
                <button
                  type="button"
                  onClick={() => setShippingOpen(true)}
                  aria-label="View shipping policy"
                  className="grid h-4 w-4 place-items-center rounded-full text-ink/50 hover:text-ink transition"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </span>

              <span className="font-semibold">
                <span className="mr-1.5 text-ink/40 line-through">${fmt(shippingWas)}</span>
                <span style={{ color: GREEN }}>FREE</span>
              </span>
            </div>
          </div>

          {/* Total charged today — Shopify-style clean row */}
          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="text-[18px] font-black leading-[1.1] text-ink">
              Total<br />charged today
            </div>
            <div className="text-right leading-none pt-1">
              <div className="mb-1.5 text-[10px] font-semibold text-ink/50">USD</div>
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-[13px] font-semibold text-ink/40 line-through">${fmt(subtotal)}</span>
                <span className="text-[20px] font-black text-ink tracking-tight">${fmt(total)}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink">
            <SavingsIcon className="h-3.5 w-3.5" color="#111111" />
            Total savings ${fmt(savings)}
          </div>

          {/* Refund guarantee */}
          <div className="mt-4 border-t border-dashed border-ink/15 pt-3.5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/60">100% refund guarantee</div>
            <div className="mt-1.5 text-[12.5px] text-ink/60 leading-snug">
              Charged today. Full refund if your prescription is not approved.
            </div>
          </div>
        </div>
      )}

      {/* COLLAPSED VIEW (image 1) */}
      {!open && (
        <div>
          {/* Treatment details headline */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-[15px] font-bold text-ink"
          >
            <Package className="h-4 w-4" /> Treatment details
          </button>

          {/* Total row */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 flex w-full items-center gap-3 text-left"
          >
            <ThumbCard src={vial} bg={vialBg} size={56} />
            <div className="min-w-0 flex-1">
              <div className="text-[20px] font-black text-ink leading-tight">Total</div>
              <div className="text-[13px] text-ink/55">{itemCount} {itemCount === 1 ? "item" : "items"}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[11px] font-semibold text-ink/60">USD</span>
                <span className="text-[22px] font-black text-ink">${fmt(total)}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className="mt-0.5 flex items-center justify-end gap-1 text-[12px] text-ink/60">
                <SavingsIcon className="h-3 w-3" />
                Total savings ${fmt(savings)}
              </div>
            </div>
          </button>
        </div>
      )}

      <ShippingPolicySheet open={shippingOpen} onClose={() => setShippingOpen(false)} />
    </div>
  );
}

function ShippingPolicySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[88vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shipping policy"
          >
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-ink/10 bg-white px-6 pb-4 pt-6">
              <h2 className="text-[26px] font-black leading-tight text-ink">Shipping</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink/40 text-ink/60 hover:text-ink hover:border-ink transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-10 pt-4" style={{ maxHeight: "calc(88vh - 72px)" }}>
              <div className="prose prose-sm max-w-none text-ink [&_h1]:hidden [&_h2]:mt-6 [&_h2]:text-[16px] [&_h2]:font-bold [&_p]:text-[14.5px] [&_p]:leading-relaxed [&_p]:text-ink/75 [&_li]:text-[14.5px] [&_li]:text-ink/75 [&_table]:text-[13.5px] [&_th]:text-left [&_th]:font-bold [&_hr]:my-4 [&_hr]:border-ink/10 [&_strong]:text-ink [&_a]:text-ink [&_a]:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{shippingPolicyMd}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


/* Hears-style thumbnail card with qty badge */
function ThumbCard({
  src,
  icon,
  bg,
  qty,
  size = 64,
}: {
  src?: string;
  icon?: React.ReactNode;
  bg: string;
  qty?: number;
  size?: number;
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="grid place-items-center overflow-hidden rounded-2xl"
        style={{
          background: bg,
          width: size,
          height: size,
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px -4px rgba(0,0,0,0.10)",
        }}
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          icon
        )}
      </div>
      {qty !== undefined && (
        <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-[12px] font-bold text-white ring-2 ring-white">
          {qty}
        </span>
      )}
    </div>
  );
}

/* Shopify savings tag icon */
function SavingsIcon({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.25v2.844a2.5 2.5 0 0 1-.708 1.743L7.75 12.25m1-10.5H6.699a2 2 0 0 0-1.414.586L1.737 5.883a1.75 1.75 0 0 0 0 2.475l2.332 2.331a1.5 1.5 0 0 0 2.121 0l3.724-3.724a2 2 0 0 0 .586-1.414V3.5a1.75 1.75 0 0 0-1.75-1.75" vectorEffect="non-scaling-stroke" />
      <circle cx="7.75" cy="4.5" r=".563" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path strokeLinejoin="round" d="M7.74 4.49h.02v.02h-.02z" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
