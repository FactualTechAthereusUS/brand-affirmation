import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck, PartyPopper, ChevronDown, Truck, HeartPulse, Stethoscope, Clock, Star } from "lucide-react";

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
import shipBox from "@/assets/ship-box.png.asset.json";
import face1 from "@/assets/face-1.png.asset.json";
import face2 from "@/assets/face-2.png.asset.json";
import face3 from "@/assets/face-3.png.asset.json";
import face4 from "@/assets/face-4.png.asset.json";
import face5 from "@/assets/face-5.png.asset.json";
import milestoneStart from "@/assets/milestone-start.png.asset.json";
import milestoneProfile from "@/assets/milestone-profile.png.asset.json";
import milestoneHealth from "@/assets/milestone-health.png.asset.json";
import milestoneResults from "@/assets/milestone-results.png.asset.json";

export const Route = createFileRoute("/sales/DM")({
  component: SalesDMPage,
  head: () => ({
    meta: [
      { title: "Your GLP-1 Prescription Plan Approval — Blissley" },
      {
        name: "description",
        content:
          "You're pre-approved. Personalized GLP-1 care with prescribed medication, 1:1 physician guidance and 24/7 nursing support. Same price at every dose.",
      },
    ],
  }),
});

/* ─────────  Brand tokens (match intake / LP)  ───────── */
const NAVY = "#1D437B";
const NAVY_SOFT = "#6B94C7";
const PINK = "#ee7273";
const CANVAS = "#FFFFFF";
const CREAM = "#F8F5EF";

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

/* ─────────  Weight-loss chart (inlined)  ───────── */
function WeightLossChart({ start, goal }: { start: number; goal: number }) {
  const s = Math.max(120, Math.min(500, start));
  const g = goal > 0 && goal < s ? goal : Math.max(120, s - 30);
  const lossLbs = Math.round(s - g);
  const pctLoss = ((lossLbs / s) * 100).toFixed(1);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const N = 7;
  const months = Array.from({ length: N }, (_, i) => monthNames[(now.getMonth() + i) % 12]);
  const points = months.map((_, i) => {
    const t = i / (N - 1);
    const eased = 1 - Math.pow(1 - t, 1.5);
    const wobble = Math.sin(t * Math.PI * 2.6) * (lossLbs * 0.06) * (1 - t * 0.5);
    return s - lossLbs * eased + wobble;
  });
  const W = 720, H = 320, padL = 80, padR = 40, padT = 30, padB = 52;
  const xAt = (i: number) => padL + (i / (N - 1)) * (W - padL - padR);
  const yAt = (v: number) => {
    const min = g - 10, max = s + 10;
    return padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  };
  let path = `M ${xAt(0)} ${yAt(points[0])}`;
  for (let i = 0; i < N - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const x1 = xAt(i) + (xAt(i + 1) - xAt(Math.max(0, i - 1))) / 6;
    const y1 = yAt(p1) + (yAt(p2) - yAt(p0)) / 6;
    const x2 = xAt(i + 1) - (xAt(Math.min(N - 1, i + 2)) - xAt(i)) / 6;
    const y2 = yAt(p2) - (yAt(p3) - yAt(p1)) / 6;
    path += ` C ${x1} ${y1}, ${x2} ${y2}, ${xAt(i + 1)} ${yAt(p2)}`;
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">
          Your projected trajectory
        </div>
        <div className="text-[13px] font-semibold" style={{ color: PINK }}>
          -{lossLbs} lbs · {pctLoss}%
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <line x1={padL} x2={W - padR} y1={yAt(s)} y2={yAt(s)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="6 8" />
        <line x1={padL} x2={W - padR} y1={yAt(g)} y2={yAt(g)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="6 8" />
        <text x={padL - 16} y={yAt(s) + 5} textAnchor="end" style={{ fontSize: 16, fontWeight: 600, fill: "#171717" }}>{Math.round(s)} lbs</text>
        <text x={padL - 16} y={yAt(g) + 5} textAnchor="end" style={{ fontSize: 16, fontWeight: 600, fill: "#171717" }}>{Math.round(g)} lbs</text>
        <motion.path d={path} fill="none" stroke={PINK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
        <circle cx={xAt(0)} cy={yAt(points[0])} r={9} fill={PINK} />
        <circle cx={xAt(N - 1)} cy={yAt(points[N - 1])} r={10} fill={PINK} />
        {months.map((m, i) => (
          <text key={`${m}-${i}`} x={xAt(i)} y={H - 14} textAnchor="middle" style={{ fontSize: 14, fontWeight: 500, fill: "#171717", opacity: 0.55 }}>{m}</text>
        ))}
      </svg>
    </div>
  );
}

/* ─────────  Inline icons for treatment cards  ───────── */
function MoneyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
      <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
    </svg>
  );
}
function LightningIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
  );
}

/* ─────────  Treatment card  ───────── */
function TreatmentCard({
  id, title, desc, badge, badgeColor, badgeIcon: BadgeIcon, vial, vialBg,
  reviews, price, oldPrice, saveLine, features, selected, onSelect,
  formType, onFormType, oralUpcharge,
}: {
  id: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  vial: string;
  vialBg: string;
  reviews: string;
  price: number;
  oldPrice: number;
  saveLine: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
  formType: "inj" | "oral";
  onFormType: (v: "inj" | "oral") => void;
  oralUpcharge: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.995 }}
      className="group relative flex w-full flex-col gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5"
      style={{
        borderColor: selected ? NAVY : "rgba(23,23,23,0.10)",
        background: "#fff",
        boxShadow: selected ? "0 14px 34px rgba(29,67,123,0.14)" : "0 1px 0 rgba(0,0,0,0.02)",
      }}
      aria-pressed={selected}
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-[104px] w-[104px] shrink-0 place-items-center overflow-hidden rounded-xl sm:h-[116px] sm:w-[116px]" style={{ background: vialBg }}>
          <img src={vial} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ background: `${badgeColor}18`, color: badgeColor }}>
              {badge}
            </span>
            <span style={{ color: badgeColor }}><BadgeIcon className="h-4 w-4" /></span>
          </div>
          <div id={`${id}-title`} className="mt-1.5 text-[19px] font-semibold text-ink sm:text-[21px]">{title}</div>
          <div className="mt-1 text-[13.5px] leading-snug text-ink/60 sm:text-[14.5px]">{desc}</div>
          <div className="mt-2 flex items-center gap-1 text-[12px] text-ink/60">
            <div className="flex" style={{ color: PINK }}>
              {[0,1,2,3,4].map((i) => <Star key={i} className="h-3.5 w-3.5" fill={PINK} strokeWidth={0} />)}
            </div>
            <span className="ml-1">{reviews} reviews</span>
          </div>
        </div>
        <span className="grid h-[26px] w-[26px] shrink-0 place-items-center self-start rounded-full border transition-colors" style={{ borderColor: selected ? NAVY : "rgba(23,23,23,0.22)", background: selected ? NAVY : "transparent" }}>
          {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.4} />}
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] text-ink/60">Prescribed for only</span>
          <span className="text-[26px] font-black text-ink">${price + (formType === "oral" ? oralUpcharge : 0)}</span>
          <span className="text-[16px] font-medium text-ink/40 line-through">${oldPrice}</span>
        </div>
      </div>

      {/* Which do you prefer? */}
      <div onClick={(e) => e.stopPropagation()}>
        <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/55">Which do you prefer?</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onFormType("inj")}
            className="rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-all"
            style={{
              borderColor: formType === "inj" ? NAVY : "rgba(23,23,23,0.12)",
              background: formType === "inj" ? "#E7EEFB" : "#fff",
              color: formType === "inj" ? NAVY : "#171717",
            }}
          >Injections</button>
          <button
            type="button"
            onClick={() => onFormType("oral")}
            className="rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-all"
            style={{
              borderColor: formType === "oral" ? NAVY : "rgba(23,23,23,0.12)",
              background: formType === "oral" ? "#E7EEFB" : "#fff",
              color: formType === "oral" ? NAVY : "#171717",
            }}
          >Oral drops <span className="opacity-70">(+ ${oralUpcharge})</span></button>
        </div>
      </div>

      <ul className="flex flex-col gap-2 text-[13.5px] leading-snug text-ink/80">
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#16A34A" }} strokeWidth={3} />
          <span><b>{saveLine}</b> on your first month</span>
        </li>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#16A34A" }} strokeWidth={3} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
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
  lifetimeLock?: boolean;
};

function PlanCard({ plan, selected, onSelect, onCheckout }: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  onCheckout: () => void;
}) {
  const isBest = plan.badge?.kind === "best";
  const isPopular = plan.badge?.kind === "popular";
  const GREEN = "#16A34A";
  const GREEN_TINT = "#F0FDF4";
  const BLUE_TINT = "#DFF0FA";
  const accent = isBest ? NAVY : isPopular ? GREEN : NAVY;
  const bg = selected ? (isBest ? BLUE_TINT : isPopular ? GREEN_TINT : "#F3F7F1") : "#FFFFFF";
  const borderColor = selected ? accent : "rgba(23,23,23,0.10)";
  return (
    <motion.div layout whileHover={{ y: -2 }} className="relative rounded-2xl border transition-all"
      style={{ background: bg, borderColor, borderWidth: selected ? 2 : 1, boxShadow: selected ? `0 22px 44px ${accent}22` : "0 1px 0 rgba(0,0,0,0.02)" }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[19px] font-bold text-ink sm:text-[20px]">{plan.title}</h3>
          {plan.badge && (
            <span className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12px] font-semibold"
              style={{ background: isBest ? "#DDECF5" : "#DCFCE7", color: isBest ? NAVY : "#16A34A" }}>
              {plan.badge.label}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="max-w-[62%] text-[14.5px] leading-snug text-ink/60">{plan.desc}</p>
          <span className="shrink-0 text-[14px] font-bold text-ink">{plan.supply}</span>
        </div>

        {plan.installments && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13.5px] font-semibold" style={{ color: NAVY }}>Easy 0% Installments</div>
              <div className="text-[12px] text-ink/55">Spread payments over 12 months.</div>
            </div>
            <div className="flex items-center gap-1.5">
              <img src={payAfterpay.url} alt="Afterpay" className="h-5 w-auto rounded-[4px]" />
              <img src={payKlarna.url} alt="Klarna" className="h-5 w-auto rounded-[4px]" />
              <img src={payAffirm.url} alt="Affirm" className="h-5 w-auto rounded-[4px]" />
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-dashed py-2 text-center text-[13px] font-semibold"
          style={{ background: "#F0FDF4", borderColor: "#86EFAC", color: "#16A34A" }}>
          You are saving ${plan.savings.toLocaleString()}
        </div>

        <button
          type="button"
          onClick={() => { onSelect(); onCheckout(); }}
          className="mt-3 flex w-full flex-col items-center justify-center rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-all"
          style={{ background: "#CFE0CC", color: NAVY }}
        >
          {plan.todayPrice ? (
            <>
              <span>Select Plan · <span className="line-through opacity-70">${plan.originalMonthly}/month</span></span>
              <span className="mt-0.5 text-[11.5px] font-medium tracking-[0.04em] opacity-90">PAY ONLY ${plan.todayPrice} TODAY</span>
            </>
          ) : (
            <span>Select Plan · ${plan.perMo}/mo</span>
          )}
        </button>

        {plan.lifetimeLock && (
          <div className="mt-3 text-center text-[12px] text-ink/60">
            Your dose will increase as you go. <b className="text-ink">The price won't.</b> Lifetime price lock at ${plan.perMo}/mo.
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────  Includes  ───────── */
const INCLUDES = [
  { icon: icon15.url, label: "Free Dosage Increases" },
  { icon: icon16.url, label: "Treatment changes at any time" },
  { icon: icon17.url, label: "Unlimited Free Doctor Consults" },
  { icon: icon18.url, label: "Free Expedited Shipping" },
  { icon: icon19.url, label: "Home Injection Kit Included" },
  { icon: icon20.url, label: "24/7 Nursing Support" },
];

/* ─────────  What Happens Next  ───────── */
const STEPS = [
  { icon: milestoneProfile.url, title: "Physician Review", body: "You're pre-qualified. A licensed provider will review your intake and begin the approval process right after checkout." },
  { icon: milestoneStart.url, title: "Fast Prescription Approval", body: "Most reviews are completed quickly. Same-day consultations may be available when clinically appropriate." },
  { icon: shipBox.url, title: "Medication Preparation & Shipping", body: "Once approved, your medication is prepared and shipped in a temperature-controlled overnight box. Tracking arrives in 1–2 business days." },
  { icon: milestoneHealth.url, title: "Easy Refills", body: "When it's time to refill, a quick form in your patient portal keeps everything moving. We'll text and email tracking as it ships." },
  { icon: milestoneResults.url, title: "Unlimited Support", body: "Questions on progress, side effects or dosage? Unlimited 24/7 access to our nursing team and licensed clinicians — whenever you need us." },
];

/* ─────────  Reviews  ───────── */
const REVIEWS = [
  { name: "B. Hunter", face: face1.url, title: "Nothing else out there like this", body: "It really is life changing. I take it once a week and I cannot believe how fast I am losing weight. I just don't eat like I used to — I naturally crave healthier food. Down from 245 to 220 in 3 months." },
  { name: "Donna W.", face: face2.url, title: "Losing weight without any effort", body: "Clothes that were tight are now loose. I feel different. I feel better. I have more energy. Even putting my hands around my wrist — I can now touch. My only side effect is I have no appetite… and I love it." },
  { name: "Deryl H.", face: face3.url, title: "90 days in and WOW", body: "I've been on it for 90 days and lost 45 pounds. My clothes are getting really big. My blood sugar is down, my blood pressure is normal, and I have more energy. It is truly a miracle." },
];

/* ─────────  FAQ  ───────── */
const FAQS = [
  { who: "Michelle from Texas", q: "How does Blissley work?", a: "You complete a short intake, a licensed clinician reviews your health history, and if you qualify, your GLP-1 medication ships to your door in a temperature-controlled overnight box. Our nurses and clinicians support you the whole way." },
  { who: "Sarah from Florida", q: "How do I know this is safe?", a: "Every prescription is written by a U.S. board-certified provider. Medication is dispensed by state-licensed pharmacies and shipped with an included home injection kit and clear instructions." },
  { who: "Diana from Ohio", q: "How does the signup process work?", a: "Choose your treatment and plan, complete checkout, and a provider begins your review. Most approvals happen quickly; some are same-day when clinically appropriate." },
  { who: "Eric from Virginia", q: "What states are eligible?", a: "Blissley is available across most U.S. states. You'll confirm your state during intake — if we can't serve you today, you'll be refunded in full." },
  { who: "Jasmine from Arizona", q: "What if I need to cancel?", a: "Monthly plans can be canceled anytime with one click in your portal. Multi-month plans include a weight-loss guarantee: if you don't lose weight by the end, we refund your program." },
  { who: "Ashley from Georgia", q: "Is the medication real semaglutide & tirzepatide?", a: "Yes. Every prescription is a real GLP-1 medication prepared by a state-licensed compounding pharmacy under a licensed clinician's order." },
  { who: "Nathan from Washington", q: "What is the dosage I'll be taking?", a: "Your clinician starts you at a low dose and titrates upward as tolerated to your optimal therapeutic level. Your price never goes up as your dose does." },
  { who: "Allison from Tennessee", q: "Where do my prescriptions come from?", a: "From state-licensed U.S. pharmacies partnered with Blissley. Every shipment is prepared to your provider's exact specifications." },
  { who: "Karen from Oregon", q: "How is it shipped?", a: "Overnight, in a discreet, temperature-controlled cold-pack box. You'll receive tracking information as soon as it leaves the pharmacy." },
  { who: "Danielle from Minnesota", q: "How do I take my medication?", a: "Injectable GLP-1s are once-weekly subcutaneous injections. Your kit and step-by-step guide walk you through it — the nursing team is on call if you have questions." },
  { who: "Christina from N.C.", q: "How much weight will I lose?", a: "Patients on our program lose an average of 18% of their body weight, with a 6.5\" average reduction in waist size — individual results vary based on adherence and lifestyle." },
  { who: "Megan from Nevada", q: "How do I contact support?", a: "Message our clinical team 24/7 through your patient portal, or reach the nursing team by phone and text anytime." },
];

function FAQItem({ who, q, a, idx }: { who: string; q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 py-4">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start justify-between gap-4 text-left">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">{who} asks</div>
          <div className="mt-1 text-[15.5px] font-semibold text-ink sm:text-[16px]">{q}</div>
        </div>
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: NAVY }} />
      </button>
      {open && (
        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-[14.5px] leading-relaxed text-ink/75">
          {a}
        </motion.p>
      )}
    </div>
  );
}

/* ─────────  Page  ───────── */
function SalesDMPage() {
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState<"sema" | "tirz" | null>(null);
  const [semaForm, setSemaForm] = useState<"inj" | "oral">("inj");
  const [tirzForm, setTirzForm] = useState<"inj" | "oral">("inj");
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [semaPatients, setSemaPatients] = useState(12886);
  const [tirzPatients, setTirzPatients] = useState(19720);
  const [discountsLeft, setDiscountsLeft] = useState(() => 40 + Math.floor(Math.random() * 35));
  const time = useCountdown(9);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const tick = () => {
      if (cancelled) return;
      setDiscountsLeft((n) => {
        if (n <= 1) return 1;
        const step = n > 30 ? 3 + Math.floor(Math.random() * 3) : n > 15 ? 2 + Math.floor(Math.random() * 2) : n > 5 ? 1 + Math.floor(Math.random() * 2) : 1;
        return Math.max(1, n - step);
      });
      timer = window.setTimeout(tick, 1500 + Math.random() * 2500);
    };
    timer = window.setTimeout(tick, 1200);
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const loop = (): number =>
      window.setTimeout(() => {
        const inc = Math.floor(Math.random() * 4) + 1;
        if (Math.random() > 0.5) setSemaPatients((n) => n + inc);
        else setTirzPatients((n) => n + inc);
        timer = loop();
      }, 2000 + Math.random() * 1000);
    let timer = loop();
    return () => window.clearTimeout(timer);
  }, []);

  const plans: Plan[] = useMemo(() => {
    if (treatment === "tirz") {
      return [
        { key: "monthly", title: "Monthly Plan", desc: "The new you, delivered to your door monthly", supply: "4 Week Supply", perMo: 299, originalMonthly: 399, todayPrice: 299, savings: 100 },
        { key: "three", title: "3-Month Plan", desc: "Receive your 3-month supply in a single shipment", supply: "12 Week Supply", perMo: 339, savings: 180, installments: true, badge: { label: "Most Popular", kind: "popular" } },
        { key: "six", title: "6-Month Plan", desc: "Your ultimate plan for guaranteed success and consistency", supply: "24 Week Supply", perMo: 299, savings: 600, installments: true, badge: { label: "Best Deal", kind: "best" }, lifetimeLock: true },
      ];
    }
    return [
      { key: "monthly", title: "Monthly Plan", desc: "The new you, delivered to your door monthly", supply: "4 Week Supply", perMo: 249, originalMonthly: 299, todayPrice: 249, savings: 50 },
      { key: "three", title: "3-Month Plan", desc: "Receive your 3-month supply in a single shipment", supply: "12 Week Supply", perMo: 237, savings: 186, installments: true, badge: { label: "Most Popular", kind: "popular" } },
      { key: "six", title: "6-Month Plan", desc: "Your ultimate plan for guaranteed success and consistency", supply: "24 Week Supply", perMo: 237, savings: 522, installments: true, badge: { label: "Best Deal", kind: "best" }, lifetimeLock: true },
    ];
  }, [treatment]);

  const primaryPatient = { first: "Sarah", startLbs: 230, goalLbs: 172 };

  const goToCheckout = (planK: string) =>
    navigate({ to: "/checkout/trimrx", search: { tx: treatment ?? "sema", plan: planK } });

  return (
    <div className="min-h-screen" style={{ background: CANVAS }}>
      {/* Discount banner */}
      <div className="mx-auto w-full max-w-[720px] px-4 pt-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-3 text-center text-[13px] font-semibold sm:text-[14px]"
          style={{ background: "#FEF7DA", borderColor: "#E7B94A", color: "#171717" }}>
          <PartyPopper className="h-5 w-5" />
          Save over $200 instantly — first shipment discount applied
        </div>
      </div>

      <TrxHeader onBack={() => window.history.back()} showBack={false} />

      {/* ═══════ HERO — Personalized approval ═══════ */}
      <section className="mx-auto w-full max-w-[720px] px-4 pt-2 pb-10 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
            250,000+ customers · Pre-qualified for {primaryPatient.first}
          </div>
          <h1 className="mt-2 font-hero text-[28px] leading-[1.05] font-black tracking-tight text-ink xs:text-[34px] sm:text-[42px]">
            Your GLP-1 prescription plan{" "}
            <span className="inline-block bg-no-repeat px-1" style={{
              backgroundImage: `linear-gradient(180deg, transparent 68%, ${NAVY_SOFT} 68%, ${NAVY_SOFT} 90%, transparent 90%)`,
            }}>approval!</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-ink/70 sm:text-[15.5px]">
            Personalized care for your unique biology — <b>prescribed medication</b>, 1:1 physician guidance and
            24/7 support from our own dedicated nursing team.
          </p>
        </motion.div>

        {/* Success meter */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">
            <span>Your chance of success</span>
            <span style={{ color: "#16A34A" }}>94.6% · Very high</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <motion.div initial={{ width: 0 }} animate={{ width: "94.6%" }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} className="h-full" style={{ background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <WeightLossChart start={primaryPatient.startLbs} goal={primaryPatient.goalLbs} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Goal</div>
              <div className="mt-0.5 text-[16px] font-bold text-ink">{primaryPatient.goalLbs} lbs</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Metabolism</div>
              <div className="mt-0.5 text-[16px] font-bold text-ink">Fat + Protein</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Sex</div>
              <div className="mt-0.5 text-[16px] font-bold text-ink">Female</div>
            </div>
          </div>
        </div>

        {/* Recommendation callout */}
        <div className="mt-6 rounded-2xl p-5 sm:p-6" style={{ background: "#E7EEFB" }}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: NAVY }}>Our Recommendation</div>
          <div className="mt-1 text-[18px] font-bold text-ink sm:text-[20px]">
            Semaglutide Weekly Injections
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
            Based on your intake, this is the most cost-effective path to your goal — one simple injection per week.
            You can choose whichever medication you prefer, regardless of our recommendation.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-ink/70">
            <img src={trustpilot.url} alt="Excellent 4.6 rating" className="h-5 w-auto" />
            <span>· 250,000+ happy customers</span>
          </div>
        </div>
      </section>

      {/* ═══════ Goals ═══════ */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
          <h2 className="text-center font-hero text-[24px] font-black tracking-tight text-ink sm:text-[30px]">
            The goals <span className="italic font-light">you will accomplish</span> with your plan
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { k: "Lose", v: `${primaryPatient.startLbs - primaryPatient.goalLbs} lbs` },
              { k: "RESET YOUR METABOLIC\u00a0\nSET POINT", v: `${primaryPatient.goalLbs} lbs` },
              { k: "Look and feel", v: "healthier" },
            ].map((g) => (
              <div key={g.k} className="rounded-2xl bg-white p-5 text-center shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <div className="whitespace-pre-line text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/50">{g.k}</div>
                <div className="mt-1 text-[22px] font-black text-ink">{g.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Your plan (transition) ═══════ */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[720px] px-4 pb-4 pt-2 text-center sm:px-6">
          <h3 className="font-hero text-[22px] font-black tracking-tight text-ink sm:text-[26px]">
            Your plan
          </h3>
          <p className="mx-auto mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-ink/70">
            You'll get <b>everything you need</b> to drop {primaryPatient.startLbs - primaryPatient.goalLbs} lbs — and keep it off.
          </p>
        </div>
      </section>

      {/* ═══════ Reservation + Same price ═══════ */}
      <section className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mx-auto w-full rounded-2xl px-5 py-4 text-center text-[14px] leading-relaxed sm:text-[15px]"
          style={{ background: "#E7EEFB", color: NAVY }}>
          Only <b>{discountsLeft}</b> {discountsLeft === 1 ? "discount" : "discounts"} left.
          <br />Yours is reserved for <b>{time}</b>
        </motion.div>

        <div className="mt-6 text-center">
          <span className="inline-block whitespace-nowrap px-1 font-hero text-[22px] font-black tracking-tight text-ink xs:text-[26px] sm:text-[30px] bg-no-repeat"
            style={{ backgroundImage: `linear-gradient(180deg, transparent 70%, ${NAVY_SOFT} 70%, ${NAVY_SOFT} 88%, transparent 88%)` }}>
            Same Price. All Dosage Levels.
          </span>
          <div className="mt-1 font-light text-[16px] leading-5 text-ink/70 xs:text-[18px]">
            No Hidden Fees. Everything Included.
          </div>
        </div>

        {/* Step 1 */}
        <div className="mt-8 flex items-center gap-3">
          <span className="rounded-full px-3 py-1 text-[11.5px] font-semibold text-white" style={{ background: NAVY }}>Step 1</span>
          <h2 className="text-[17px] font-semibold text-ink sm:text-[18px]">Choose your medication preference</h2>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <TreatmentCard
            id="sema"
            title="Semaglutide"
            desc="Most popular, most affordable GLP-1 weight loss medication."
            badge="Most Popular"
            badgeColor="#16A34A"
            badgeIcon={MoneyIcon}
            vial={vialSema.url}
            vialBg="#E4F1E6"
            reviews="29.1K"
            price={249}
            oldPrice={299}
            saveLine="Save $50 instantly"
            features={[
              "Prescribed and shipped free within 2 days",
              "Prescribed by U.S. board-certified clinicians",
              "Message your doctor 24/7",
              `${semaPatients.toLocaleString()} patients chose this today`,
            ]}
            selected={treatment === "sema"}
            onSelect={() => setTreatment("sema")}
            formType={semaForm}
            onFormType={setSemaForm}
            oralUpcharge={52}
          />
          <TreatmentCard
            id="tirz"
            title="Tirzepatide"
            desc="Most potent GLP-1 weight loss medication — dual-action results."
            badge="Most Potent"
            badgeColor={NAVY}
            badgeIcon={LightningIcon}
            vial={vialTirz.url}
            vialBg="#BFDDEE"
            reviews="29.1K"
            price={299}
            oldPrice={399}
            saveLine="Save $100 instantly"
            features={[
              "Prescribed and shipped free within 2 days",
              "Prescribed by U.S. board-certified clinicians",
              "Message your doctor 24/7",
              `${tirzPatients.toLocaleString()} patients chose this today`,
            ]}
            selected={treatment === "tirz"}
            onSelect={() => setTreatment("tirz")}
            formType={tirzForm}
            onFormType={setTirzForm}
            oralUpcharge={50}
          />
        </div>
      </section>

      {/* ═══════ Step 2 — plans ═══════ */}
      {treatment && (
        <div style={{ background: "#FFFFFF" }}>
          <section className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full px-3 py-1 text-[11.5px] font-semibold text-white" style={{ background: "#0E1B2E" }}>Step 2</span>
              <h2 className="text-[19px] font-semibold text-ink sm:text-[20px]">Select Your Plan</h2>
            </div>
            <p className="mt-2 max-w-[600px] text-[14px] leading-snug text-ink/70">
              You have selected <b>{treatment === "sema" ? "Semaglutide" : "Tirzepatide"} Injections</b>. Lock in your savings — use free financing or pay in full.
            </p>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="mt-6 flex flex-col gap-5">
              {plans.map((p) => (
                <motion.div key={p.key}
                  variants={{ hidden: { opacity: 0, y: 12, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <PlanCard plan={p} selected={planKey === p.key} onSelect={() => setPlanKey(p.key)} onCheckout={() => goToCheckout(p.key)} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      )}

      {/* ═══════ What's included ═══════ */}
      <section style={{ background: CANVAS }}>
        <div className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
          <h2 className="text-center font-hero text-[24px] font-black tracking-tight text-ink sm:text-[28px]">
            What's included
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-center text-[14.5px] text-ink/65">
            24/7 support, unlimited doctor visits and medication — all included.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8">
            <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {INCLUDES.map(({ icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-[15px] text-ink">
                  <img src={icon} alt="" className="h-6 w-6 shrink-0 object-contain" />
                  {label}
                </li>
              ))}
            </ul>
            <hr className="my-6 border-ink/10" />
            <div className="flex flex-wrap items-center gap-4">
              <img src={hsaFsa.url} alt="HSA/FSA Eligible" className="h-8 w-auto" />
              <div className="flex items-center gap-2 text-[12px] text-ink/60">
                <ShieldCheck className="h-4 w-4" style={{ color: NAVY }} /> HIPAA compliant · Physician prescribed · Ships in 48 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ What happens next ═══════ */}
      <section className="mx-auto w-full max-w-[720px] px-4 py-14 sm:px-6">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">The path from here</div>
          <h2 className="mt-2 font-hero text-[26px] font-black tracking-tight text-ink sm:text-[32px]">What happens next?</h2>
        </div>
        <ol className="mt-8 flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <motion.li key={s.title}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white font-bold" style={{ background: NAVY }}>{i + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-bold text-ink sm:text-[17px]">{s.title}</div>
                <p className="mt-1 text-[14px] leading-relaxed text-ink/70">{s.body}</p>
              </div>
              <img src={s.icon} alt="" className="hidden h-14 w-14 shrink-0 object-contain sm:block" />
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ═══════ Backed by research + stats ═══════ */}
      <section style={{ background: CANVAS }}>
        <div className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
          <div className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
            Backed by research from
          </div>
          <div className="mx-auto mt-3 flex max-w-[560px] flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-semibold text-ink/60">
            <span>Mayo Clinic</span><span>Stanford Medicine</span><span>WebMD</span><span>Harvard</span><span>NIH</span>
          </div>
          <h2 className="mt-8 text-center font-hero text-[24px] font-black tracking-tight text-ink sm:text-[30px]">
            What makes Blissley <span className="italic font-light">so much better?</span>
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: "18%", v: "Average body weight reduction" },
              { k: "9/10", v: "Say this is the most effective they've tried" },
              { k: "6.5\"", v: "Average waist reduction" },
              { k: "93%", v: "Kept the weight off" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-white p-5 text-center">
                <div className="text-[28px] font-black text-ink sm:text-[32px]">{s.k}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-ink/65">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Results / Reviews ═══════ */}
      <section className="mx-auto w-full max-w-[900px] px-4 py-14 sm:px-6">
        <div className="text-center">
          <h2 className="font-hero text-[26px] font-black tracking-tight text-ink sm:text-[32px]">
            The <span className="italic font-light">results</span> speak for themselves
          </h2>
          <p className="mt-2 text-[14.5px] text-ink/65">Success stories from real Blissley patients.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <motion.div key={r.name}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <img src={r.face} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-[14px] font-semibold text-ink">{r.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink/50">
                    <Check className="h-3 w-3" style={{ color: "#16A34A" }} strokeWidth={3.4} /> Verified customer
                  </div>
                </div>
              </div>
              <div className="mt-3 flex" style={{ color: PINK }}>
                {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4" fill={PINK} strokeWidth={0} />)}
              </div>
              <div className="mt-2 text-[15px] font-bold text-ink">"{r.title}"</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ Final CTA ═══════ */}
      <section style={{ background: CANVAS }}>
        <div className="mx-auto w-full max-w-[720px] px-4 py-14 text-center sm:px-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">Are you ready?</div>
          <h2 className="mt-2 font-hero text-[28px] font-black tracking-tight text-ink sm:text-[36px]">
            Start your journey today
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-ink/70">
            You're approved. Prescriptions start at just <b>$237</b> — no insurance needed.
          </p>

          <div className="mx-auto mt-6 flex max-w-[520px] flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5 text-left">
            {[
              { i: <HeartPulse className="h-5 w-5" style={{ color: PINK }} />, t: "Access to GLP-1 medication", s: "Cost of medication is included — no insurance necessary." },
              { i: <Stethoscope className="h-5 w-5" style={{ color: NAVY }} />, t: "Board-certified doctor review", s: "1:1 physician guidance from U.S.-licensed clinicians." },
              { i: <Clock className="h-5 w-5" style={{ color: "#16A34A" }} />, t: "Unlimited nursing access", s: "24/7 support whenever you need it." },
              { i: <Truck className="h-5 w-5" style={{ color: NAVY }} />, t: "Free overnight cold-pack shipping", s: "Discreet, temperature-controlled delivery to your door." },
            ].map((row) => (
              <div key={row.t} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/5">{row.i}</div>
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">{row.t}</div>
                  <div className="text-[13px] text-ink/60">{row.s}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-[520px] rounded-2xl p-5 text-left" style={{ background: "#DCFCE7" }}>
            <div className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#166534" }}>Weight-loss guarantee</div>
            <p className="mt-1 text-[14px] leading-relaxed text-ink/80">
              If you don't lose weight by the end of your complete program, we give you all of your money back. It's that simple.
            </p>
          </div>

          <button type="button"
            onClick={() => {
              const el = document.getElementById("plans-anchor");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
              if (!treatment) setTreatment("sema");
            }}
            className="mx-auto mt-8 flex w-full max-w-[420px] items-center justify-center rounded-full px-6 py-4 text-[15px] font-semibold text-white transition-all hover:brightness-110"
            style={{ background: NAVY, boxShadow: `0 18px 40px ${NAVY}33` }}>
            Claim my approval — from $237/mo
          </button>
          <div className="mt-3 text-[11.5px] uppercase tracking-[0.14em] text-ink/40">
            Your approval is reserved for {time}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="mx-auto w-full max-w-[720px] px-4 py-14 sm:px-6" id="plans-anchor">
        <h2 className="text-center font-hero text-[26px] font-black tracking-tight text-ink sm:text-[30px]">
          Frequently asked questions
        </h2>
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white px-5 sm:px-6">
          {FAQS.map((f, i) => <FAQItem key={f.q} {...f} idx={i} />)}
        </div>
      </section>

      {/* ═══════ Featured / payments ═══════ */}
      <section className="mx-auto w-full max-w-[720px] px-4 pb-14 sm:px-6">
        <div className="flex flex-col items-center gap-3">
          <img src={trustpilot.url} alt="Excellent 4.8 · 100,000+ happy customers" className="h-6 w-auto sm:h-7" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink/45">As seen on</span>
            <img src={forbes.url} alt="Forbes Health" className="h-4 w-auto sm:h-5" />
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-ink/10 p-6 sm:p-8">
          <h3 className="text-[13.5px] font-semibold text-ink">All major credit cards accepted</h3>
          <div className="mt-2.5"><PayIcons /></div>
          <hr className="my-5 border-ink/10" />
          <h3 className="text-[13.5px] font-semibold text-ink">Buy now, pay later</h3>
          <div className="mt-2.5 flex items-center gap-2">
            <img src={payAfterpay.url} alt="Afterpay" className="h-6 w-auto" />
            <img src={payKlarna.url} alt="Klarna" className="h-6 w-auto" />
            <img src={payAffirm.url} alt="Affirm" className="h-6 w-auto" />
          </div>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}
