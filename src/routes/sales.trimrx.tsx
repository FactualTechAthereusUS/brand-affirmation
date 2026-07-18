import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  TrendingUp,
  Pencil,
  Phone,
  Truck,
  Syringe,
  MessageSquare,
  ShieldCheck,
  PartyPopper,
} from "lucide-react";

import { TrxHeader } from "@/components/intake/TrxUI";
import { PayIcons } from "@/components/PayIcons";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import forbes from "@/assets/forbes-health.png.asset.json";
import trustpilot from "@/assets/trustpilot-rating.png.asset.json";
import payAfterpay from "@/assets/pay-afterpay.png.asset.json";
import payKlarna from "@/assets/pay-klarna.png.asset.json";
import payAffirm from "@/assets/pay-affirm.png.asset.json";

export const Route = createFileRoute("/sales/trimrx")({
  component: SalesTrimRxPage,
  head: () => ({
    meta: [
      { title: "Your Blissley Plan — Same Price, All Dosage Levels" },
      {
        name: "description",
        content:
          "Same price at every dosage level. No hidden fees. Choose your treatment and plan — physician-prescribed GLP-1, delivered to your door.",
      },
    ],
  }),
});

/* ─────────  Brand tokens (match intake / LP)  ───────── */
const NAVY = "#1D437B";
const NAVY_SOFT = "#6B94C7";
const PINK = "#ee7273";
const PINK_SOFT = "#f8b9b9";
const CANVAS = "#FFFFFF";

/* ─────────  Reusable atoms  ───────── */
function CheckSquare({ on, color = NAVY }: { on: boolean; color?: string }) {
  return (
    <span
      className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-colors"
      style={{
        borderColor: on ? color : "rgba(23,23,23,0.18)",
        background: on ? color : "transparent",
      }}
      aria-hidden
    >
      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.2} />}
    </span>
  );
}

function Pill({
  children,
  color = NAVY,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold tracking-[0.02em]"
      style={{
        background: `${color}14`,
        color,
      }}
    >
      {children}
    </span>
  );
}

/* ─────────  Countdown  ───────── */
function useCountdown(minutes: number) {
  const [t, setT] = useState(minutes * 60);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(t / 60)).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return `${m}:${s} min`;
}

/* ─────────  Treatment card  ───────── */
function TreatmentCard({
  id,
  title,
  desc,
  badge,
  badgeColor,
  vial,
  patients,
  selected,
  onSelect,
}: {
  id: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  vial: string;
  patients: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.995 }}
      className="group relative flex w-full items-center gap-4 rounded-2xl border bg-white p-3.5 text-left transition-all sm:p-4"
      style={{
        borderColor: selected ? NAVY : "rgba(23,23,23,0.10)",
        boxShadow: selected
          ? "0 14px 34px rgba(29,67,123,0.14)"
          : "0 1px 0 rgba(0,0,0,0.02)",
      }}
      aria-pressed={selected}
      aria-labelledby={`${id}-title`}
    >
      <div
        className="grid h-[74px] w-[74px] shrink-0 place-items-center overflow-hidden rounded-xl sm:h-[86px] sm:w-[86px]"
        style={{ background: `${NAVY}0A` }}
      >
        <img src={vial} alt="" className="h-full w-full object-contain p-1" />
      </div>
      <div className="min-w-0 flex-1">
        <div id={`${id}-title`} className="text-[16px] font-semibold text-ink sm:text-[17px]">
          {title}
        </div>
        <div className="mt-0.5 text-[13.5px] text-ink/60 sm:text-[14px]">{desc}</div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Pill color={badgeColor}>{badge}</Pill>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink/55">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: PINK }}
            />
            {patients}
          </span>
        </div>
      </div>
      <span
        className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full border-2 transition-colors"
        style={{
          borderColor: selected ? NAVY : "rgba(23,23,23,0.20)",
          background: selected ? NAVY : "transparent",
        }}
        aria-hidden
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </motion.button>
  );
}

/* ─────────  Plan card  ───────── */
type Plan = {
  key: string;
  title: string;
  desc: string;
  supply: string;
  perMo: number;
  savings: number;
  todayPrice?: number;
  originalMonthly?: number;
  installments?: boolean;
  badge?: { label: string; kind: "popular" | "best" };
};

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}) {
  const highlight = !!plan.badge;
  const ring = highlight
    ? plan.badge!.kind === "best"
      ? NAVY
      : PINK
    : selected
      ? NAVY
      : "rgba(23,23,23,0.10)";
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border bg-white transition-all"
      style={{
        borderColor: ring,
        borderWidth: highlight || selected ? 2 : 1,
        boxShadow: selected
          ? "0 20px 40px rgba(29,67,123,0.14)"
          : "0 1px 0 rgba(0,0,0,0.02)",
      }}
    >
      {plan.badge && (
        <div
          className="absolute right-4 top-0 -translate-y-1/2 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
          style={{ background: plan.badge.kind === "best" ? NAVY : PINK }}
        >
          {plan.badge.label}
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-semibold text-ink sm:text-[17px]">
                {plan.title}
              </h3>
            </div>
            <p className="mt-0.5 text-[13.5px] leading-snug text-ink/60">
              {plan.desc}
            </p>
          </div>
          <span
            className="shrink-0 rounded-full border px-2.5 py-1 text-[11.5px] font-medium"
            style={{ borderColor: `${NAVY}22`, color: NAVY }}
          >
            {plan.supply}
          </span>
        </div>

        {plan.installments && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed p-3"
               style={{ borderColor: `${NAVY}33`, background: `${NAVY}05` }}>
            <div>
              <div className="text-[13.5px] font-semibold" style={{ color: NAVY }}>
                Easy 0% Installments
              </div>
              <div className="text-[12px] text-ink/55">Spread payments over 12 months.</div>
            </div>
            <div className="flex items-center gap-1.5">
              <img src={payAfterpay.url} alt="Afterpay" className="h-4 w-auto" />
              <img src={payKlarna.url} alt="Klarna" className="h-4 w-auto" />
              <img src={payAffirm.url} alt="Affirm" className="h-4 w-auto" />
            </div>
          </div>
        )}

        <div
          className="mt-3 rounded-xl px-3 py-2 text-center text-[13px] font-semibold"
          style={{
            background: `${PINK}14`,
            color: "#a83a3b",
          }}
        >
          You are saving ${plan.savings}
        </div>

        <button
          type="button"
          onClick={onSelect}
          className="mt-3 flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-[14.5px] font-semibold text-white transition-all"
          style={{
            background: selected ? PINK : NAVY,
            boxShadow: selected
              ? "0 12px 26px rgba(238,114,115,0.30)"
              : "0 10px 24px rgba(29,67,123,0.22)",
          }}
        >
          {plan.todayPrice ? (
            <span className="flex flex-col leading-tight">
              <span>
                Select Plan · <span className="line-through opacity-70">${plan.originalMonthly}/month</span>
              </span>
              <span className="mt-0.5 text-[11px] font-medium opacity-95">
                PAY ONLY ${plan.todayPrice} LIMITED OFFER
              </span>
            </span>
          ) : (
            <span>
              Select Plan · ${plan.perMo}/mo
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────  Includes row  ───────── */
const INCLUDES = [
  { icon: TrendingUp, label: "Free Dosage Increases" },
  { icon: Pencil, label: "Treatment changes at anytime" },
  { icon: Phone, label: "Unlimited Free Doctor Consults" },
  { icon: Truck, label: "Free Expedited Shipping" },
  { icon: Syringe, label: "Home Injection Kit Included" },
  { icon: MessageSquare, label: "24/7 Customer Support" },
];


/* ─────────  Page  ───────── */
function SalesTrimRxPage() {
  const [treatment, setTreatment] = useState<"sema" | "tirz">("sema");
  const [planKey, setPlanKey] = useState<string>("three");
  const time = useCountdown(9);

  const plans: Plan[] = [
    {
      key: "monthly",
      title: "Monthly Plan",
      desc: "The new you, delivered to your door monthly",
      supply: "4 Week Supply",
      perMo: 299,
      originalMonthly: 299,
      todayPrice: 179,
      savings: 120,
    },
    {
      key: "three",
      title: "3-Month Plan",
      desc: "Receive your 3 month supply in a single shipment",
      supply: "12 Week Supply",
      perMo: 209,
      savings: 149,
      installments: true,
      badge: { label: "Most Popular", kind: "popular" },
    },
    {
      key: "six",
      title: "6-Month Plan",
      desc: "Your ultimate plan for guaranteed success and consistency",
      supply: "24 Week Supply",
      perMo: 191,
      savings: 526,
      installments: true,
    },
    {
      key: "twelve",
      title: "12-Month Plan",
      desc: "Commit to a year of progress and save on your new self",
      supply: "48 Week Supply",
      perMo: 174,
      savings: 1370,
      installments: true,
      badge: { label: "Best Deal", kind: "best" },
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: CANVAS }}>
      {/* Discount banner */}
      <div
        className="w-full border-b border-dashed"
        style={{
          background: "#FEF7DA",
          borderColor: "#E7B94A",
          color: "#7A5A00",
        }}
      >
        <div className="mx-auto flex max-w-[1080px] items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold sm:text-[14px]">
          <PartyPopper className="h-4 w-4" />
          First shipment $120 OFF
        </div>
      </div>

      <TrxHeader onBack={() => window.history.back()} showBack={false} />

      {/* SECTION 1 — Reservation + Treatment */}
      <section className="mx-auto w-full max-w-[720px] px-4 pb-10 pt-2 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[520px] rounded-2xl border px-5 py-3 text-center text-[13.5px] leading-snug"
          style={{
            background: `${NAVY}0A`,
            borderColor: `${NAVY}22`,
            color: NAVY,
          }}
        >
          Only <b>29</b> discounts left.
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Yours is reserved for <b style={{ color: PINK }}>{time}</b>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mx-auto mt-6 max-w-[560px] text-center font-hero text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink sm:text-[32px]"
        >
          <span className="relative inline-block">
            Same Price. All Dosage Levels.
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full"
              style={{ background: PINK }}
            />
          </span>
        </motion.h1>
        <p className="mt-2 text-center text-[14.5px] text-ink/60">
          No Hidden Fees. Everything Included.
        </p>

        {/* Step badge */}
        <div className="mt-8 flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-[11.5px] font-semibold text-white"
            style={{ background: NAVY }}
          >
            Step 1
          </span>
          <h2 className="text-[17px] font-semibold text-ink sm:text-[18px]">
            Select Treatment
          </h2>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <TreatmentCard
            id="sema"
            title="Semaglutide"
            desc="Proven, effective, more affordable."
            badge="More Affordable"
            badgeColor="#1a8f5a"
            vial={vialSema.url}
            patients="12,555 patients chose this today"
            selected={treatment === "sema"}
            onSelect={() => setTreatment("sema")}
          />
          <TreatmentCard
            id="tirz"
            title="Tirzepatide"
            desc="Faster results, dual-action, but more expensive."
            badge="Fastest Results"
            badgeColor={PINK}
            vial={vialTirz.url}
            patients="15,180 patients chose this today"
            selected={treatment === "tirz"}
            onSelect={() => setTreatment("tirz")}
          />
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <img
            src={trustpilot.url}
            alt="Excellent 4.8 · 100,000+ happy customers"
            className="h-6 w-auto sm:h-7"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink/45">
              As seen on
            </span>
            <img src={forbes.url} alt="Forbes Health" className="h-4 w-auto sm:h-5" />
          </div>
        </div>
      </section>

      {/* SECTION 2 — Includes / How it works */}
      <section className="mx-auto w-full max-w-[720px] px-4 pb-14 sm:px-6">
        <div className="rounded-3xl border bg-white p-6 sm:p-8"
             style={{ borderColor: "rgba(23,23,23,0.08)" }}>
          <h3 className="text-[16px] font-semibold text-ink sm:text-[17px]">All Plans Include</h3>
          <ul className="mt-4 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
            {INCLUDES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[14px] text-ink/85">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                  style={{ background: `${NAVY}0F`, color: NAVY }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <hr className="my-6 border-ink/10" />

          <h3 className="text-[16px] font-semibold text-ink sm:text-[17px]">How It Works</h3>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink/70">
            Each month includes one shot per week, for a total of four shots. Your provider
            will start you on a low dose and gradually increase it to your ideal level,
            helping you lose weight safely and effectively.
          </p>

          <hr className="my-6 border-ink/10" />

          <div>
            <h3 className="text-[13.5px] font-semibold text-ink">All major credit cards accepted</h3>
            <div className="mt-2.5"><PayIcons /></div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
               style={{ borderColor: `${NAVY}22`, background: `${NAVY}06` }}>
            <span
              className="grid h-5 w-5 place-items-center rounded-full"
              style={{ background: NAVY, color: "#fff" }}
            >
              <Check className="h-3 w-3" strokeWidth={3.4} />
            </span>
            <span className="text-[12.5px] font-semibold text-ink">HSA/FSA Eligible</span>
          </div>

          <div className="mt-6">
            <h3 className="text-[13.5px] font-semibold text-ink">Buy Now, Pay Later</h3>
            <div className="mt-2.5 flex items-center gap-2">
              <img src={payAfterpay.url} alt="Afterpay" className="h-6 w-auto" />
              <img src={payKlarna.url} alt="Klarna" className="h-6 w-auto" />
              <img src={payAffirm.url} alt="Affirm" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Plans */}
      <section className="mx-auto w-full max-w-[720px] px-4 pb-16 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-[11.5px] font-semibold text-white"
            style={{ background: NAVY }}
          >
            Step 2
          </span>
          <h2 className="text-[17px] font-semibold text-ink sm:text-[18px]">
            Select Your Plan
          </h2>
        </div>
        <p className="mt-2 max-w-[600px] text-[13.5px] leading-snug text-ink/60">
          Lock in your savings without a big upfront payment — use free financing or pay in
          full with your card.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-5 flex flex-col gap-4"
        >
          {plans.map((p) => (
            <motion.div
              key={p.key}
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlanCard
                plan={p}
                selected={planKey === p.key}
                onSelect={() => setPlanKey(p.key)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust footer repeat */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <img
            src={trustpilot.url}
            alt="Excellent 4.8 · 100,000+ happy customers"
            className="h-6 w-auto sm:h-7"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink/45">
              As seen on
            </span>
            <img src={forbes.url} alt="Forbes Health" className="h-4 w-auto sm:h-5" />
          </div>

          <div
            className="mt-4 flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] text-ink/60"
            style={{ borderColor: "rgba(23,23,23,0.10)", background: "#fff" }}
          >
            <ShieldCheck className="h-3.5 w-3.5" style={{ color: NAVY }} />
            HIPAA compliant · Physician prescribed · Ships in 48 hours
          </div>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}
