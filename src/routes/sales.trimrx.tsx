import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck, PartyPopper } from "lucide-react";

import { TrxHeader } from "@/components/intake/TrxUI";
import { PayIcons } from "@/components/PayIcons";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import forbes from "@/assets/forbes-health.png.asset.json";
import trustpilot from "@/assets/trustpilot-rating.png.asset.json";
import payAfterpay from "@/assets/pay-afterpay.png.asset.json";
import payKlarna from "@/assets/pay-klarna.png.asset.json";
import payAffirm from "@/assets/pay-affirm.png.asset.json";
import hsaFsa from "@/assets/hsa-fsa.png.asset.json";
import icon15 from "@/assets/icon-15.png.asset.json";
import icon16 from "@/assets/icon-16.png.asset.json";
import icon17 from "@/assets/icon-17.png.asset.json";
import icon18 from "@/assets/icon-18.png.asset.json";
import icon19 from "@/assets/icon-19.png.asset.json";
import icon20 from "@/assets/icon-20.png.asset.json";


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

/* ─────────  Inline icons for treatment cards  ───────── */
function MoneyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
      <path
        fillRule="evenodd"
        d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
        clipRule="evenodd"
      />
      <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ─────────  Treatment card  ───────── */
function TreatmentCard({
  id,
  title,
  desc,
  badge,
  badgeColor,
  badgeIcon: BadgeIcon,
  vial,
  vialBg,
  patients,
  selected,
  onSelect,
}: {
  id: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  vial: string;
  vialBg: string;
  patients: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.995 }}
      className="group relative flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition-all sm:p-4"
      style={{
        borderColor: selected ? NAVY : "rgba(23,23,23,0.10)",
        background: "transparent",
        boxShadow: selected
          ? "0 14px 34px rgba(29,67,123,0.14)"
          : "0 1px 0 rgba(0,0,0,0.02)",
      }}
      aria-pressed={selected}
      aria-labelledby={`${id}-title`}
    >
      <div
        className="grid h-[104px] w-[104px] shrink-0 place-items-center overflow-hidden rounded-xl sm:h-[116px] sm:w-[116px]"
        style={{ background: vialBg }}
      >
        <img src={vial} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div id={`${id}-title`} className="text-[18px] font-semibold text-ink sm:text-[20px]">
          {title}
        </div>
        <div className="mt-1 text-[14px] leading-snug text-ink/60 sm:text-[15px]">{desc}</div>
        <div className="mt-2 flex items-center gap-1.5 text-[14px] font-medium" style={{ color: badgeColor }}>
          <BadgeIcon className="h-4 w-4" />
          {badge}
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-ink/75">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#16A34A" }} />
          {patients.toLocaleString()} patients chose this today
        </div>
      </div>
      <span
        className="grid h-[26px] w-[26px] shrink-0 place-items-center self-start rounded-full border transition-colors"
        style={{
          borderColor: selected ? NAVY : "rgba(23,23,23,0.22)",
          background: selected ? NAVY : "transparent",
        }}
        aria-hidden
      >
        {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.4} />}
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
  onCheckout,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  onCheckout: () => void;
}) {
  const isBest = plan.badge?.kind === "best";
  const isPopular = plan.badge?.kind === "popular";
  // Selected accents: green for Most Popular, blue for Best Deal
  const GREEN = "#16A34A";
  const GREEN_TINT = "#F0FDF4";
  const BLUE_TINT = "#DFF0FA";
  const accent = isBest ? NAVY : isPopular ? GREEN : NAVY;
  const bg = selected
    ? isBest
      ? BLUE_TINT
      : isPopular
        ? GREEN_TINT
        : "#F3F7F1"
    : "#FFFFFF";
  const borderColor = selected ? accent : "rgba(23,23,23,0.10)";
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="relative rounded-2xl border transition-all"
      style={{
        background: bg,
        borderColor,
        borderWidth: selected ? 2 : 1,
        boxShadow: selected
          ? `0 22px 44px ${accent}22`
          : "0 1px 0 rgba(0,0,0,0.02)",
      }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[19px] font-bold text-ink sm:text-[20px]">
            {plan.title}
          </h3>
          {plan.badge && (
            <span
              className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12px] font-semibold"
              style={{
                background: isBest ? "#DDECF5" : "#DCFCE7",
                color: isBest ? NAVY : "#16A34A",
              }}
            >
              {plan.badge.label}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="max-w-[62%] text-[14.5px] leading-snug text-ink/60">
            {plan.desc}
          </p>
          <span className="shrink-0 text-[14px] font-bold text-ink">
            {plan.supply}
          </span>
        </div>


        {plan.installments && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <div
                className="text-[13.5px] font-semibold"
                style={{ color: NAVY }}
              >
                Easy 0% Installments
              </div>
              <div className="text-[12px] text-ink/55">
                Spread payments over 12 months.
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <img src={payAfterpay.url} alt="Afterpay" className="h-5 w-auto rounded-[4px]" />
              <img src={payKlarna.url} alt="Klarna" className="h-5 w-auto rounded-[4px]" />
              <img src={payAffirm.url} alt="Affirm" className="h-5 w-auto rounded-[4px]" />
            </div>
          </div>
        )}

        <div
          className="mt-4 rounded-xl border border-dashed py-2 text-center text-[13px] font-semibold"
          style={{
            background: "#F0FDF4",
            borderColor: "#86EFAC",
            color: "#16A34A",
          }}
        >
          You are saving ${plan.savings.toLocaleString()}
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect();
            onCheckout();
          }}
          className="mt-3 flex w-full flex-col items-center justify-center rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-all"
          style={{
            background: "#CFE0CC",
            color: NAVY,
            boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          }}
        >
          {plan.todayPrice ? (
            <>
              <span>
                Select Plan ·{" "}
                <span className="line-through opacity-70">
                  ${plan.originalMonthly}/month
                </span>
              </span>
              <span className="mt-0.5 text-[11.5px] font-medium tracking-[0.04em] opacity-90">
                PAY ONLY ${plan.todayPrice} LIMITED OFFER
              </span>
            </>
          ) : (
            <span>Select Plan · ${plan.perMo}/mo</span>
          )}
        </button>
      </div>
    </motion.div>
  );
}


/* ─────────  Includes row  ───────── */
const INCLUDES = [
  { icon: icon15.url, label: "Free Dosage Increases" },
  { icon: icon16.url, label: "Treatment changes at anytime!" },
  { icon: icon17.url, label: "Unlimited Free Doctor Consults" },
  { icon: icon18.url, label: "Free Expedited Shipping" },
  { icon: icon19.url, label: "Home Injection Kit Included" },
  { icon: icon20.url, label: "24/7 Customer Support" },
];



/* ─────────  Page  ───────── */
function SalesTrimRxPage() {
function SalesTrimRxPage() {
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState<"sema" | "tirz" | null>(null);
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [semaPatients, setSemaPatients] = useState(12886);
  const [tirzPatients, setTirzPatients] = useState(19720);

  const time = useCountdown(9);

  useEffect(() => {
    const tick = () => {
      const increment = Math.floor(Math.random() * 4) + 1;
      const target = Math.random() > 0.5 ? "sema" : "tirz";
      if (target === "sema") {
        setSemaPatients((n) => n + increment);
      } else {
        setTirzPatients((n) => n + increment);
      }
    };

    const loop = () => {
      const delay = Math.random() * 1000 + 2000;
      return window.setTimeout(() => {
        tick();
        timer = loop();
      }, delay);
    };

    let timer = loop();
    return () => window.clearTimeout(timer);
  }, []);

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
      key: "six",
      title: "6-Month Plan",
      desc: "Your ultimate plan for guaranteed success and consistency",
      supply: "24 Week Supply",
      perMo: 191,
      savings: 526,
      installments: true,
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
      {/* Discount banner — TOP of page */}
      <div className="mx-auto w-full max-w-[720px] px-4 pt-4 sm:px-6">
        <div
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-3 text-center text-[13px] font-semibold sm:text-[14px]"
          style={{
            background: "#FEF7DA",
            borderColor: "#E7B94A",
            color: "#171717",
          }}
        >
          <PartyPopper className="h-5 w-5" />
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
          className="mx-auto w-full rounded-2xl px-5 py-4 text-center text-[14px] leading-relaxed sm:text-[15px]"
          style={{
            background: "#E7EEFB",
            color: NAVY,
          }}
        >
          Only <b>29</b> discounts left.
          <br />
          Yours is reserved for <b style={{ color: NAVY }}>{time}</b>
        </motion.div>

        <div className="mt-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="inline-block whitespace-nowrap px-1 font-hero text-[22px] font-black tracking-tight text-ink xs:text-[26px] sm:text-[30px] bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent 70%, ${NAVY_SOFT} 70%, ${NAVY_SOFT} 88%, transparent 88%)`,
            }}
          >
            Same Price. All Dosage Levels.
          </motion.span>
          <div className="mt-1 font-light text-[16px] leading-5 text-ink/70 xs:text-[18px]">
            No Hidden Fees. Everything Included.
          </div>
        </div>

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
            badgeColor="#16A34A"
            badgeIcon={MoneyIcon}
            vial={vialSema.url}
            vialBg="#E4F1E6"
            patients={semaPatients}
            selected={treatment === "sema"}
            onSelect={() => setTreatment("sema")}
          />
          <TreatmentCard
            id="tirz"
            title="Tirzepatide"
            desc="Faster results, dual-action, but more expensive."
            badge="Fastest Results"
            badgeColor={NAVY}
            badgeIcon={LightningIcon}
            vial={vialTirz.url}
            vialBg="#BFDDEE"
            patients={tirzPatients}
            selected={treatment === "tirz"}
            onSelect={() => setTreatment("tirz")}
          />
        </div>
      </section>

      {/* SECTION 2 — Plans (only after treatment selected) */}
      {treatment && (
        <div style={{ background: "#FFFFFF" }}>
          <section className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6">
            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-[11.5px] font-semibold text-white"
                style={{ background: "#0E1B2E" }}
              >
                Step 2
              </span>
              <h2 className="text-[19px] font-semibold text-ink sm:text-[20px]">
                Select Your Plan
              </h2>
            </div>
            <p className="mt-2 max-w-[600px] text-[14px] leading-snug text-ink/70">
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
              className="mt-6 flex flex-col gap-5"
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
          </section>
        </div>
      )}

      {/* SECTION 3 — Includes / How it works */}
      <section className="mx-auto w-full max-w-[720px] px-4 pb-14 sm:px-6">
        {/* Trust row */}
        <div className="mb-8 flex flex-col items-center gap-3">
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

        <div className="p-6 sm:p-8">
          <h3 className="text-[16px] font-semibold text-ink sm:text-[17px]">All Plans Include</h3>
          <ul className="mt-4 flex flex-col gap-3.5">
            {INCLUDES.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[15px] text-ink">
                <img src={icon} alt="" className="h-6 w-6 shrink-0 object-contain" />
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

          <div className="mt-5">
            <img src={hsaFsa.url} alt="HSA/FSA Eligible" className="h-8 w-auto" />
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

        <div className="mt-10 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] text-ink/60"
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
