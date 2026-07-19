import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Check, ShieldCheck, PartyPopper, ChevronDown, Truck, HeartPulse, Stethoscope, Clock, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

import { TrxHeader } from "@/components/intake/TrxUI";
import { PayIcons } from "@/components/PayIcons";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import vialTirzTransparent from "@/assets/blissley-tirzepatide-vial-transparent.png.asset.json";
import forbes from "@/assets/forbes-health.png.asset.json";
import trustpilot from "@/assets/trustpilot-rating.png.asset.json";
import payAfterpay from "@/assets/pay-afterpay.png.asset.json";
import payKlarna from "@/assets/pay-klarna.png.asset.json";
import payAffirm from "@/assets/pay-affirm.png.asset.json";
import hsaFsa from "@/assets/hsa-fsa.png.asset.json";
import icon15 from "@/assets/icon-15.png.asset.json";
import guaranteeBadge from "@/assets/guarantee-badge.png.asset.json";
import icon16 from "@/assets/icon-16.png.asset.json";
import icon17 from "@/assets/icon-17.png.asset.json";
import icon18 from "@/assets/icon-18.png.asset.json";
import icon19 from "@/assets/icon-19.png.asset.json";
import icon20 from "@/assets/icon-20.png.asset.json";
import shipBox from "@/assets/ship-box.png.asset.json";
import backedByResearch from "@/assets/backed-by-research.png.asset.json";
import dmHeroWoman from "@/assets/dm-hero-woman.png.asset.json";
import badgeCheckPink from "@/assets/badge-check-pink.png.asset.json";
import iconTargetBw from "@/assets/icon-target-bw.png.asset.json";
import iconBolt from "@/assets/icon-bolt.png.asset.json";
import iconDoctors from "@/assets/icon-doctors.png.asset.json";
import iconInfinity from "@/assets/icon-infinity.png.asset.json";
import iconTruck from "@/assets/icon-truck.png.asset.json";
import iconTrophyBw from "@/assets/icon-trophy-bw.png.asset.json";
import iconTapeBw from "@/assets/icon-tape-bw.png.asset.json";

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
      { title: "Your GLP-1 Prescription Plan Approval Blissley" },
      {
        name: "description",
        content:
          "You're pre-approved. Personalized GLP-1 care with prescribed medication, 1:1 physician guidance and unlimited physician messaging. Same price at every dose.",
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

/* ─────────  Inline SVG symbols for included list  ───────── */
function IconSymbols() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
      <defs>
        <symbol id="282897690" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </symbol>
        <symbol id="1776682203" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </symbol>
        <symbol id="3553010246" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </symbol>
      </defs>
    </svg>
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
          <span className="text-[26px] font-black text-ink">${price}</span>
          <span className="text-[16px] font-medium text-ink/40 line-through">${oldPrice}</span>
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
  { icon: icon16.url, label: "Treatment changes at anytime!" },
  { icon: icon17.url, label: "Unlimited Free Doctor Consults" },
  { icon: icon18.url, label: "Free Expedited Shipping" },
  { icon: icon19.url, label: "Home Injection Kit Included" },
  { icon: icon20.url, label: "24/7 Customer Support" },
];

/* ─────────  What Happens Next  ───────── */
const STEPS = [
  { n: "01", icon: milestoneProfile.url, title: "Physician Review", body: "You're pre-qualified. A licensed provider will review your intake and begin the approval process right after checkout." },
  { n: "02", icon: milestoneStart.url, title: "Fast Prescription Approval", body: "Most reviews are completed quickly. Same-day approvals may be available when clinically appropriate." },
  { n: "03", icon: shipBox.url, title: "Medication Preparation & Shipping", body: "Once approved, your medication is prepared and shipped in a temperature-controlled overnight box. Tracking arrives in 1–2 business days." },
  { n: "04", icon: milestoneHealth.url, title: "Easy Refills", body: "When it's time to refill, a quick form in your patient portal keeps everything moving. We'll text and email tracking as it ships." },
  { n: "05", icon: milestoneResults.url, title: "Unlimited Support", body: "Questions on progress, side effects or dosage? Unlimited access to your licensed clinicians via secure messaging whenever you need us." },
];

function DMStepRow({ step }: { step: (typeof STEPS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.25, 1, 1, 0.25]);
  const blur = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [8, 0, 0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.985, 1, 1, 0.985]);
  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter, scale }}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-ink/10 py-8 md:gap-8 md:py-14"
    >
      <div className="font-sans text-[44px] font-medium leading-none text-ink/15 md:text-[64px]">{step.n}</div>
      <div className="min-w-0">
        <h3 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-ink md:text-[26px]">{step.title}</h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink/60 md:text-[15px]">{step.body}</p>
      </div>
      <div className="hidden h-[104px] w-[128px] shrink-0 overflow-hidden rounded-2xl bg-white border border-ink/[0.06] md:block">
        <img src={step.icon} alt="" className="h-full w-full object-contain p-3" loading="lazy" decoding="async" />
      </div>
    </motion.div>
  );
}

/* ─────────  Reviews  ───────── */
const REVIEWS = [
  { name: "Jennifer R.", face: face1.url, title: "The food noise is finally gone", body: "I used to think about food constantly. Now I eat when I'm hungry and stop when I'm full. It's the quietest my head has been in years and the weight is coming off without a fight." },
  { name: "Michael T.", face: face2.url, title: "50 lbs in 7 months", body: "Blood pressure back to normal, off my sleep apnea machine, and my knees don't ache anymore. The physician actually messages me back I've never had care like this." },
  { name: "Sarah M.", face: face3.url, title: "Finally a program that's honest about billing", body: "Same price at every dose. No surprise charges. When I had a question about my card, someone from the team responded that day. That trust made me stay." },
  { name: "Lisa K.", face: face4.url, title: "My doctor dismissed me for years", body: "I was told to 'just try harder.' Blissley actually listened, ran the numbers on my metabolism, and got me on a real treatment plan. Down 32 lbs and I feel like myself again." },
];

/* ─────────  FAQ  ───────── */
const FAQS = [
  { who: "Michelle from Texas", q: "How does Blissley work?", a: "You complete a short intake, a licensed clinician reviews your health history, and if you qualify, your GLP-1 medication ships to your door in a temperature-controlled overnight box. Your physician supports you the whole way via unlimited secure messaging." },
  { who: "Derek from Nevada", q: "Is the medication real semaglutide?", a: "Yes. Every prescription is a real GLP-1 medication (semaglutide or tirzepatide) prepared by a state-licensed U.S. compounding pharmacy under a licensed clinician's order." },
  { who: "Sarah from California", q: "What if I'm not approved?", a: "If a clinician determines GLP-1 therapy isn't appropriate for you, you are refunded in full. Your card is not charged until a physician approves your prescription." },
  { who: "James from Florida", q: "What states are eligible?", a: "Blissley is available across most U.S. states. You'll confirm your state during intake if we can't serve you today, you'll be refunded in full." },
  { who: "Ashley from Georgia", q: "How do I cancel?", a: "Monthly plans can be canceled anytime in one click from your patient portal. Multi-month plans include our weight-loss guarantee if you don't lose weight by the end, we refund your program." },
  { who: "Nathan from Washington", q: "What dosage will I take?", a: "Your clinician starts you at a low dose and titrates upward as tolerated to your optimal therapeutic level. Your price never goes up as your dose does that's the price lock." },
  { who: "Alicia from Tennessee", q: "Where do prescriptions come from?", a: "From state-licensed U.S. pharmacies partnered with Blissley. Every shipment is prepared to your provider's exact specifications and shipped overnight in a temperature-controlled cold-pack box." },
  { who: "Chris from North Carolina", q: "How much weight will I lose?", a: "Patients on our program lose an average of 18% of their body weight, with a 6.5\" average reduction in waist size. Individual results vary based on adherence, dosage and lifestyle." },
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
    <div className="relative min-h-screen" style={{ background: CANVAS }}>
      <IconSymbols />
      <TrxHeader onBack={() => window.history.back()} showBack={false} />

      {/* Announcement / reservation banner */}
      <div className="mx-auto w-full max-w-[720px] px-4 pt-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-3 text-center text-[13px] font-semibold sm:text-[14px]"
          style={{ background: "#FEF7DA", borderColor: "#E7B94A", color: "#171717" }}>
          <Clock className="h-4 w-4" />
          {primaryPatient.first}, your slot is reserved · {time}
        </div>
      </div>

      {/* ═══════ HERO Personalized approval ═══════ */}
      <section className="mx-auto w-full max-w-[720px] px-4 pt-2 pb-10 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center">
          <h1 className="mt-2 font-hero text-[28px] leading-[1.05] font-black tracking-tight text-ink xs:text-[34px] sm:text-[42px]">
            Your GLP-1 prescription plan{" "}
            <span className="inline-block bg-no-repeat px-1" style={{
              backgroundImage: `linear-gradient(180deg, transparent 68%, ${NAVY_SOFT} 68%, ${NAVY_SOFT} 90%, transparent 90%)`,
            }}>approval!</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-ink/70 sm:text-[15.5px]">
            Personalized care for your unique biology <b>prescribed medication</b>, 1:1 physician guidance and
            unlimited messaging with your licensed clinician.
          </p>
        </motion.div>

        {/* Success meter */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">
            <span>Your chance of success</span>
            <span style={{ color: "#16A34A" }}>Very high</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <motion.div initial={{ width: 0 }} animate={{ width: "94.6%" }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} className="h-full" style={{ background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />
          </div>
          <p className="mt-2 text-[12.5px] text-ink/60">
            You have a very high chance of success with physician-supervised GLP-1.
          </p>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h2 className="text-center font-hero text-[22px] font-black tracking-tight text-ink sm:text-[26px]">
            The goals <span className="italic font-light">you will accomplish</span> with your plan
          </h2>
          <div className="mt-4">
            <WeightLossChart start={primaryPatient.startLbs} goal={primaryPatient.goalLbs} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Lose</div>
              <div className="mt-0.5 text-[16px] font-bold text-ink">{primaryPatient.startLbs - primaryPatient.goalLbs} lbs</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Goal</div>
              <div className="mt-0.5 text-[16px] font-bold text-ink">{primaryPatient.goalLbs} lbs</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Metabolism</div>
              <div className="mt-0.5 text-[16px] font-bold text-ink">Fat + Protein</div>
            </div>
          </div>
        </div>

        {/* Recommendation text left, vial right, white background */}
        <div className="mt-8 bg-white">
          <div className="grid grid-cols-[1fr_110px] items-center gap-4 sm:grid-cols-[1fr_180px] sm:gap-6 md:grid-cols-[1fr_220px]">
            <div>
              <h3 className="font-hero text-[22px] font-black tracking-tight text-ink sm:text-[28px] md:text-[32px]">
                Our Recommendation
              </h3>
              <p className="mt-3 text-[14px] leading-[1.55] text-ink sm:text-[16px] md:text-[18px]">
                Based on your intake form, we recommend{" "}
                <a href="#pricing" className="font-semibold underline underline-offset-4" style={{ color: PINK, textDecorationColor: PINK }}>
                  Tirzepatide Weekly Injections
                </a>{" "}
                for powerful, clinically-supported results! Just a simple injection once per week.
              </p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink/70 sm:text-[14px]">
                Note: you can choose whichever medication you prefer, regardless of our recommendation.
              </p>
            </div>
            <div className="w-[110px] sm:w-[180px] md:w-[220px]">
              <img
                src={vialTirzTransparent.url}
                alt="Blissley Compounded Tirzepatide vial"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[12.5px] text-ink/75 sm:text-[13.5px]">
            <img src={trustpilot.url} alt="Excellent 4.8 rating" className="h-4 w-auto sm:h-5" />
            <span className="font-semibold text-ink">3,200+</span>
            <span>happy patients</span>
          </div>
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
            saveLine="Save $50"
            features={[
              "Prescribed and shipped free within 2 days",
              "Prescribed by U.S. board-certified clinicians",
              "Message your physician anytime",
              `${semaPatients.toLocaleString()} patients chose this today`,
            ]}
            selected={treatment === "sema"}
            onSelect={() => setTreatment("sema")}
          />
          <TreatmentCard
            id="tirz"
            title="Tirzepatide"
            desc="Most potent GLP-1 weight loss medication dual-action results."
            badge="Most Potent"
            badgeColor={NAVY}
            badgeIcon={LightningIcon}
            vial={vialTirz.url}
            vialBg="#BFDDEE"
            reviews="29.1K"
            price={299}
            oldPrice={399}
            saveLine="Save $100"
            features={[
              "Prescribed and shipped free within 2 days",
              "Prescribed by U.S. board-certified clinicians",
              "Message your physician anytime",
              `${tirzPatients.toLocaleString()} patients chose this today`,
            ]}
            selected={treatment === "tirz"}
            onSelect={() => setTreatment("tirz")}
          />
        </div>
      </section>

      {/* ═══════ Step 2 plans ═══════ */}
      {treatment && (
        <div style={{ background: "#FFFFFF" }}>
          <section className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full px-3 py-1 text-[11.5px] font-semibold text-white" style={{ background: "#0E1B2E" }}>Step 2</span>
              <h2 className="text-[19px] font-semibold text-ink sm:text-[20px]">Select Your Plan</h2>
            </div>
            <p className="mt-2 max-w-[600px] text-[14px] leading-snug text-ink/70">
              You have selected <b>{treatment === "sema" ? "Semaglutide" : "Tirzepatide"} Injections</b>. Lock in your savings use free financing or pay in full.
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

      {/* ═══════ Your plan + What's included ═══════ */}
      <section style={{ background: CANVAS }}>
        <div className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
          <h2 className="text-center font-hero text-[26px] font-black tracking-tight text-ink sm:text-[32px]">
            Your plan
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-center text-[14.5px] leading-relaxed text-ink/70">
            You'll get <b>everything you need</b> to drop {primaryPatient.startLbs - primaryPatient.goalLbs} lbs and keep it off.
          </p>
          <div className="mt-8 rounded-2xl bg-white p-6 sm:p-8">
            <ul className="flex flex-col gap-3.5">
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
      <section className="bg-white px-6 py-20 text-ink md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-12 md:gap-10">
          {/* Left sticky column */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Reveal>
                <h2 className="font-hero text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
                  WHAT HAPPENS
                  <br />
                  <span className="italic font-light" style={{ color: PINK }}>NEXT?</span>
                </h2>
              </Reveal>
            </div>
          </div>

          {/* Right rows */}
          <div className="md:col-span-7">
            <div className="border-t border-ink/10">
              {STEPS.map((s) => (
                <DMStepRow key={s.n} step={s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Backed by research + stats ═══════ */}
      <section className="bg-white">

        <div className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
          <div className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
            Backed by research from
          </div>
          <div className="mx-auto mt-5 max-w-[560px]">
            <img src={backedByResearch.url} alt="Mayo Clinic, Stanford Medicine, WebMD, Harvard University, NIH" className="mx-auto w-full h-auto object-contain" loading="lazy" />
          </div>
          <h2 className="mt-8 text-center font-hero text-[24px] font-black tracking-tight text-ink sm:text-[30px]">
            What makes Blissley <span className="italic font-light">so much better?</span>
          </h2>
          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {[
              { icon: iconTargetBw.url, k: "18%", v: "Average body weight reduction" },
              { icon: iconTrophyBw.url, k: "9/10", v: "Say this is the most effective they've tried" },
              { icon: iconTapeBw.url, k: "6.5\"", v: "Average waist reduction" },
              { icon: badgeCheckPink.url, k: "93%", v: "Kept the weight off" },
            ].map((s) => (
              <div key={s.v} className="grid grid-cols-[auto_1fr] items-center gap-4 py-5 sm:gap-8 sm:py-6">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white sm:h-16 sm:w-16">
                    <img src={s.icon} alt="" className="h-10 w-10 object-contain sm:h-14 sm:w-14" loading="lazy" />
                  </div>
                  <div className="text-[26px] font-black leading-none text-ink sm:text-[36px]">{s.k}</div>
                </div>
                <div className="text-[14px] font-semibold leading-snug text-ink sm:text-[17px]">{s.v}</div>
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
          {/* Liquid glass badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/85 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
            Are You Ready?
          </div>
          <h2 className="mt-5 font-hero text-[30px] font-black leading-[1.05] tracking-tight text-ink sm:text-[44px]">
            Start Your Journey <span className="italic font-light">Today</span>
          </h2>
          <p className="mx-auto mt-3 text-[15px] leading-relaxed text-ink/70 sm:text-[17px]">
            You're approved for <span className="font-bold" style={{ color: PINK }}>{time}</span>
          </p>

          {/* Blue strip + white card */}
          <div className="mx-auto mt-8 max-w-[560px] overflow-hidden rounded-2xl border border-ink/10 bg-white text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]">
            <div className="px-6 py-4 text-center text-[14px] font-semibold text-white sm:text-[15.5px]" style={{ background: NAVY }}>
              Prescriptions start at just <b>$237</b> no insurance needed
            </div>

            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <h3 className="font-hero text-[22px] font-black leading-tight tracking-tight text-ink sm:text-[26px]">
                The most effective weight loss program <span className="italic font-light">is right here</span>
              </h3>
              <div className="mt-5 text-[15px] font-black text-ink sm:text-[16px]">What is included?</div>

              <div className="mt-4 flex flex-col gap-4">
                {[
                  { i: <HeartPulse className="h-5 w-5" style={{ color: PINK }} />, t: "Access to GLP-1 medication", s: "Cost of medication is included no insurance necessary." },
                  { i: <Stethoscope className="h-5 w-5" style={{ color: NAVY }} />, t: "Board-certified doctor review", s: "1:1 physician guidance from U.S.-licensed clinicians." },
                  { i: <Clock className="h-5 w-5" style={{ color: "#16A34A" }} />, t: "Unlimited physician messaging", s: "Message your licensed clinician anytime through your portal." },
                  { i: <Truck className="h-5 w-5" style={{ color: NAVY }} />, t: "Free overnight cold-pack shipping", s: "Discreet, temperature-controlled delivery to your door." },
                ].map((row) => (
                  <div key={row.t} className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/[0.04] ring-1 ring-ink/10">{row.i}</div>
                    <div className="min-w-0">
                      <div className="text-[14.5px] font-semibold text-ink">{row.t}</div>
                      <div className="text-[13px] text-ink/60">{row.s}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantee inside the card */}
              <div className="mt-7 flex items-center gap-4 border-t border-ink/10 pt-6 sm:gap-5">
                <img src={guaranteeBadge.url} alt="Weight Loss Guarantee" className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24" />
                <div className="min-w-0">
                  <div className="font-hero text-[18px] font-black tracking-tight text-ink sm:text-[22px]">Weight Loss Guarantee</div>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink/75 sm:text-[14.5px]">
                    If you do not lose weight by the end of your complete program, we give you all of your money back. It's that simple!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button type="button"
            onClick={() => {
              const el = document.getElementById("plans-anchor");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
              if (!treatment) setTreatment("sema");
            }}
            className="mx-auto mt-8 flex w-full max-w-[420px] items-center justify-center rounded-full px-6 py-4 text-[15px] font-semibold text-white transition-all hover:brightness-110"
            style={{ background: NAVY, boxShadow: `0 18px 40px ${NAVY}33` }}>
            Claim my approval from $237/mo
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
        <div className="flex flex-col items-center gap-4">
          <img src={trustpilot.url} alt="Excellent 4.8 · 3,200+ patients" className="h-6 w-auto sm:h-7" />
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">As seen on</div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { name: "Forbes", src: "https://www.vectorlogo.zone/logos/forbes/forbes-wordmark.svg" },
              { name: "Bloomberg", src: "https://www.vectorlogo.zone/logos/bloomberg/bloomberg-ar21~bgwhite.svg" },
              { name: "Washington Post", src: "https://www.vectorlogo.zone/logos/washingtonpost/washingtonpost-wordmark.svg" },
              { name: "WebMD", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/WebMD_logo.svg" },
              { name: "Today", src: "https://upload.wikimedia.org/wikipedia/commons/7/76/Today_logo.svg" },
              { name: "Featured 1", src: "https://framerusercontent.com/images/L873MSfptJNuxu9CxFGM0yz62ws.png?scale-down-to=512&width=640&height=144" },
              { name: "Featured 2", src: "https://framerusercontent.com/images/EdyKCuzUOhXKfrGJ5nlGuZBGlFk.png?width=403&height=125" },
              { name: "Featured 3", src: "https://framerusercontent.com/images/2fynBufOyZQGmqKnfJSdf8sI1rs.png?width=1893&height=368" },
            ].map((l) => (
              <img key={l.name} src={l.src} alt={l.name} loading="lazy"
                className="h-6 sm:h-7 w-auto max-w-[130px] object-contain opacity-70 grayscale transition hover:opacity-100" />
            ))}
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3.5 py-1.5">
            <img src="https://static.legitscript.com/seals/183773.png" alt="LegitScript Certified" className="h-5 w-auto" />
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/70">LegitScript Certified</span>
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
