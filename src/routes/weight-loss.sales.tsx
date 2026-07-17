import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, Lock, ShieldCheck, Sparkles, Star, Timer, Zap } from "lucide-react";
import logo from "@/assets/blissley-logo.png.asset.json";

export const Route = createFileRoute("/weight-loss/sales")({
  component: WeightLossSalesPage,
  head: () => ({
    meta: [
      { title: "Your Weight Loss Program — Blissley" },
      { name: "description", content: "Your personalized, physician-prescribed GLP-1 program. Same price at every dose. Ships in 48 hours." },
      { property: "og:title", content: "Your Weight Loss Program — Blissley" },
      { property: "og:description", content: "Physician-prescribed. Approved in 24 hours. Same price forever." },
    ],
  }),
});

/* ────────────────────────────────────────────────────────────
   Data model
   ──────────────────────────────────────────────────────────── */

type Intake = {
  firstName?: string;
  weightLbs?: string;
  weightGoal?: string;
  state?: string;
  bmi?: number | null;
  sex?: "male" | "female";
};

type PlanKey = "monthly" | "three" | "six";

const PLANS: Record<PlanKey, {
  title: string;
  today: number;
  perMonth: number;
  perDay: string;
  save?: number;
  badge?: { label: string; kind: "popular" | "best" };
  tag: string;
  subprice: string;
}> = {
  monthly: {
    title: "Monthly Starter",
    today: 249,
    perMonth: 299,
    perDay: "$9.97/day",
    tag: "Cancel anytime",
    subprice: "$249 first month → $299/mo",
  },
  three: {
    title: "3-Month Reset",
    today: 711,
    perMonth: 237,
    perDay: "$7.90/day",
    save: 136,
    badge: { label: "MOST POPULAR", kind: "popular" },
    tag: "Best-selling program",
    subprice: "$237/mo · Save $136",
  },
  six: {
    title: "6-Month Transformation",
    today: 1422,
    perMonth: 237,
    perDay: "$7.90/day",
    save: 322,
    badge: { label: "BEST DEAL", kind: "best" },
    tag: "Deepest transformation",
    subprice: "$237/mo · Save $322",
  },
};

const PRIORITY_ADDON = 39.95;

/* ────────────────────────────────────────────────────────────
   Reusable atoms
   ──────────────────────────────────────────────────────────── */

function PlaceholderImage({
  ratio = "aspect-[4/5]",
  label,
  className = "",
}: {
  ratio?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-ink/[0.04] ${ratio} ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(238,114,115,0.10), rgba(23,23,23,0.04))",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(23,23,23,0.05) 0 1px, transparent 1px 12px)",
        }}
      />
      {label && (
        <div className="absolute inset-0 grid place-items-center text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
          {label}
        </div>
      )}
    </div>
  );
}

function EyebrowChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ever/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ever">
      {children}
    </span>
  );
}

function PrimaryCTA({
  children,
  onClick,
  full = true,
  variant = "dark",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
  variant?: "dark" | "light" | "coral";
}) {
  const base =
    "group relative inline-flex h-[56px] items-center justify-center gap-2 rounded-full px-8 text-[15px] font-semibold tracking-tight transition-shadow";
  const styles =
    variant === "dark"
      ? "bg-ink text-white shadow-[0_10px_30px_-10px_rgba(23,23,23,0.5)] hover:shadow-[0_16px_40px_-12px_rgba(23,23,23,0.55)]"
      : variant === "coral"
        ? "bg-ever text-white shadow-[0_10px_30px_-10px_rgba(238,114,115,0.55)] hover:shadow-[0_16px_40px_-12px_rgba(238,114,115,0.65)]"
        : "bg-white text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)]";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${styles} ${full ? "w-full" : ""}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
      {/* sheen sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="absolute -inset-y-1 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
      </span>
    </motion.button>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────── */

function WeightLossSalesPage() {
  const [intake, setIntake] = useState<Intake>({});
  const [plan, setPlan] = useState<PlanKey>("three");
  const [priority, setPriority] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("blissley_intake_wl");
      if (raw) setIntake(JSON.parse(raw));
    } catch {}
  }, []);

  const firstName = intake.firstName?.trim() || "You";
  const startWeight = parseFloat(intake.weightLbs || "220") || 220;
  const goalWeight = parseFloat(intake.weightGoal || "") || Math.round(startWeight * 0.82);
  const toLose = Math.max(5, Math.round(startWeight - goalWeight));
  const timelineWeeks = Math.max(8, Math.round(toLose / 1.6));

  const selectedPlan = PLANS[plan];
  const totalToday = selectedPlan.today + (priority ? PRIORITY_ADDON : 0);

  return (
    <main className="min-h-[100svh] bg-white text-ink">
      <SalesNav />


      <Hero
        firstName={firstName}
        toLose={toLose}
        timelineWeeks={timelineWeeks}
      />

      <PriceAnchor />

      <PlanSelector
        firstName={firstName}
        plan={plan}
        setPlan={setPlan}
        priority={priority}
        setPriority={setPriority}
        totalToday={totalToday}
      />

      <ValueStack />

      <HowItWorks />

      <RealResults />

      <Mechanism />

      <Projection firstName={firstName} startWeight={startWeight} bmi={intake.bmi ?? null} />

      <Guarantee />

      <FAQ />

      <PhysicianTeam />

      <FinalCTA
        firstName={firstName}
        plan={plan}
        setPlan={setPlan}
        priority={priority}
        setPriority={setPriority}
        totalToday={totalToday}
      />

      <SalesFooter />
    </main>
  );
}

/* ────────────────────────────────────────────────────────────
   Announcement bar (countdown)
   ──────────────────────────────────────────────────────────── */

function useReservedCountdown(seconds = 15 * 60) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    let start = 0;
    try {
      const stored = sessionStorage.getItem("blissley_reserved_at");
      if (stored) start = parseInt(stored, 10);
    } catch {}
    if (!start) {
      start = Date.now();
      try { sessionStorage.setItem("blissley_reserved_at", String(start)); } catch {}
    }
    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setRemaining(Math.max(0, seconds - elapsed));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  return { label: `${m}:${s}`, expired: remaining <= 0 };
}


/* ────────────────────────────────────────────────────────────
   Nav
   ──────────────────────────────────────────────────────────── */

function SalesNav() {
  return (
    <header className="relative z-30 w-full border-b border-ink/[0.06] bg-white">

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-5">
        <img src={logo.url} alt="Blissley" className="h-6 w-auto sm:h-8" />
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="text-[12px] font-semibold text-ink sm:text-[13.5px]">
            Excellent <span className="tabular-nums">4.6</span>
          </span>
          <div
            className="flex items-center gap-[2px]"
            role="img"
            aria-label="Rated 4.6 out of 5 stars"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="grid h-4 w-4 place-items-center bg-ever sm:h-[18px] sm:w-[18px]"
              >
                <Star
                  className="h-2.5 w-2.5 fill-white text-white sm:h-3 sm:w-3"
                  strokeWidth={0}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 1 — Hero
   ──────────────────────────────────────────────────────────── */

function Hero({
  firstName,
  toLose,
  timelineWeeks,
}: {
  firstName: string;
  toLose: number;
  timelineWeeks: number;
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* soft ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-ever/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-8 text-center sm:pt-12">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-[11.5px] font-medium text-[#2E7D32]">
            <Check className="h-3.5 w-3.5" />
            Assessment complete — you're a strong candidate
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="font-hero mt-5 text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[48px] md:text-[56px]">
            {firstName}'s Weight Loss Program
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-[520px] text-[15.5px] leading-[1.55] text-ink/65 sm:text-[17px]">
            Physician-prescribed GLP-1 therapy. Approved in 24 hours.
            Ships in 48 hours. <span className="text-ink">Same price at every dose. Forever.</span>
          </p>
        </Reveal>

        {/* Personalized data card */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-8 grid max-w-[520px] grid-cols-3 gap-4 rounded-3xl border border-ink/[0.06] bg-ink/[0.03] p-5 text-left sm:p-6">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50">To lose</div>
              <div className="mt-1 text-[22px] font-bold tracking-tight text-ink sm:text-[26px]">
                {toLose} <span className="text-[13px] font-medium text-ink/60">lbs</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50">Timeline</div>
              <div className="mt-1 text-[22px] font-bold tracking-tight text-ink sm:text-[26px]">
                ~{timelineWeeks} <span className="text-[13px] font-medium text-ink/60">weeks</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50">Recommended</div>
              <div className="mt-1 text-[17px] font-bold tracking-tight text-ink sm:text-[19px]">
                Semaglutide
              </div>
            </div>
          </div>
        </Reveal>

        {/* Trust icons */}
        <Reveal delay={0.2}>
          <div className="mx-auto mt-5 grid max-w-[520px] grid-cols-2 gap-2 text-[12.5px]">
            {[
              "🏥 Board-certified",
              "💊 Licensed US pharmacy",
              "🔒 HIPAA compliant",
              "⭐ 4.8 · 3,000+ patients",
            ].map((t) => (
              <div key={t} className="rounded-full bg-ink/[0.04] px-3 py-2 text-center text-ink/70">
                {t}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Product image */}
        <Reveal delay={0.25}>
          <div className="relative mt-10">
            <PlaceholderImage ratio="aspect-[16/9]" label="Blissley vial · editorial flat lay" />
            <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-[13px] font-medium text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] backdrop-blur">
              The Metabolic Reset Program
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 2 — Price anchor
   ──────────────────────────────────────────────────────────── */

function PriceAnchor() {
  const rows: [string, string][] = [
    ["Private GLP-1 clinic visit", "$500-800/mo"],
    ["Follow-up physician appointments", "$150+/visit"],
    ["Ozempic at pharmacy", "$1,300/mo"],
    ["Injection supplies", "$29/mo"],
    ["Nausea medication (weeks 1-4)", "$45/mo"],
  ];
  return (
    <section className="border-t border-ink/[0.05] bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-2xl px-5">
        <Reveal>
          <h2 className="font-hero text-center text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[32px]">
            What you'd pay buying this separately:
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8 divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.06]">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-5 py-4 text-[14.5px]">
                <span className="text-ink/80">{k}</span>
                <span className="tabular-nums font-medium text-ink">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-5 text-[15.5px] font-semibold">
              <span className="text-ink">If purchased separately</span>
              <span className="tabular-nums text-ever">$2,175+/mo</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-5 rounded-2xl bg-ever px-5 py-4 text-center text-[16px] font-semibold text-white">
            Your Blissley program: from $237/mo
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 3 — Plan selector
   ──────────────────────────────────────────────────────────── */

function PlanCard({
  planKey,
  selected,
  onSelect,
}: {
  planKey: PlanKey;
  selected: boolean;
  onSelect: () => void;
}) {
  const p = PLANS[planKey];
  const badge = p.badge;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.995 }}
      className={`relative w-full rounded-3xl p-5 text-left transition-all sm:p-6 ${
        selected
          ? "border-2 border-ever bg-ever/[0.04] shadow-[0_20px_60px_-30px_rgba(238,114,115,0.55)]"
          : "border border-ink/[0.10] bg-white hover:border-ink/25"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-2.5 right-4 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] ${
            badge.kind === "popular" ? "bg-ever text-white" : "bg-ink text-white"
          }`}
        >
          {badge.kind === "popular" ? "★ " : "🏆 "}{badge.label}
        </span>
      )}
      <div className="flex items-start gap-4">
        <span
          className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all ${
            selected ? "border-ever bg-ever" : "border-ink/30 bg-white"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-[16px] font-semibold text-ink">{p.title}</div>
            <div className="text-right">
              <div className="text-[18px] font-bold tabular-nums text-ink">
                ${p.today.toLocaleString()}
              </div>
              <div className="text-[11px] uppercase tracking-wide text-ink/50">today</div>
            </div>
          </div>
          <div className="mt-1 text-[13.5px] text-ink/65">{p.subprice}</div>
          <div className="mt-1 text-[12px] text-ink/45">{p.perDay} · {p.tag}</div>

          <AnimatePresence initial={false}>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2 border-t border-ink/[0.06] pt-4 text-[13.5px]">
                  {[
                    "Physician consultation + Rx",
                    "GLP-1 injectable — all doses, same price",
                    "Injection supply kit",
                    "Free temperature-controlled shipping",
                    "Unlimited physician messaging",
                    "Price lock — forever",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2 text-ink/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ever" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

function PriorityUpsell({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`mt-4 flex w-full items-start gap-3 rounded-2xl border-2 border-dashed p-4 text-left transition-all ${
        checked ? "border-ever bg-ever/[0.06]" : "border-ever/40 bg-ever/[0.03] hover:border-ever/60"
      }`}
    >
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-all ${
          checked ? "border-ever bg-ever text-white" : "border-ink/30 bg-white"
        }`}
      >
        {checked && <Check className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[14.5px] font-semibold text-ink">
            <Zap className="h-4 w-4 text-ever" /> Priority Physician Review
          </div>
          <div className="text-[14px] font-semibold tabular-nums text-ink">+${PRIORITY_ADDON}</div>
        </div>
        <div className="mt-1 text-[12.5px] leading-[1.5] text-ink/65">
          Standard review: within 24 hours. Priority review: within 6 hours — reviewed right now.
        </div>
        <div className="mt-1 text-[11.5px] font-medium text-ever">
          ⚠️ Limited priority slots available today
        </div>
      </div>
    </button>
  );
}

function PlanSelector({
  firstName,
  plan,
  setPlan,
  priority,
  setPriority,
  totalToday,
}: {
  firstName: string;
  plan: PlanKey;
  setPlan: (p: PlanKey) => void;
  priority: boolean;
  setPriority: (v: boolean) => void;
  totalToday: number;
}) {
  const p = PLANS[plan];
  return (
    <section id="plans" className="bg-ink/[0.02] py-14 sm:py-20">
      <div className="mx-auto max-w-2xl px-5">
        <Reveal>
          <div className="text-center">
            <EyebrowChip>Choose your program</EyebrowChip>
            <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[36px]">
              {firstName}, here's your recommended plan.
            </h2>
            <p className="mt-3 text-[13.5px] text-ink/60">
              Or pay from ${(p.today / 4).toFixed(2)}/mo with Klarna · 0% interest
            </p>
          </div>
        </Reveal>

        <div className="mt-8 space-y-3.5">
          {(Object.keys(PLANS) as PlanKey[]).map((k) => (
            <Reveal key={k} delay={0.05}>
              <PlanCard planKey={k} selected={plan === k} onSelect={() => setPlan(k)} />
            </Reveal>
          ))}
        </div>

        <PriorityUpsell checked={priority} onChange={setPriority} />

        <div className="mt-6">
          <PrimaryCTA>
            Start my {p.title.toLowerCase()}
          </PrimaryCTA>
          <div className="mt-3 text-center text-[13.5px] tabular-nums text-ink/60">
            Total today: <span className="font-semibold text-ink">${totalToday.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[11.5px] text-ink/50">
            <Lock className="h-3 w-3" />
            Secure · HIPAA protected · Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 4 — Value stack
   ──────────────────────────────────────────────────────────── */

function ValueStack() {
  const rows: [string, string][] = [
    ["Board-certified physician consultation", "$149"],
    ["GLP-1 prescription (all doses covered)", "$180"],
    ["Physician-prescribed semaglutide injectable", "$299+"],
    ["Complete injection supply kit", "$29"],
    ["Patient portal + progress tracker", "$99"],
    ["Unlimited physician messaging", "$199"],
    ["90-day clinical check-in", "$99"],
    ["Free temperature-controlled shipping", "$20"],
    ["Price lock — same price at every dose, forever", "Priceless"],
    ["5-day billing notice before every charge", "Priceless"],
    ["One-click cancel anytime", "Priceless"],
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <div className="text-center">
            <EyebrowChip>Everything included</EyebrowChip>
            <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[36px]">
              Everything in your program.
            </h2>
            <p className="mt-3 text-[13.5px] text-ink/60">
              Compare to buying separately: <span className="font-semibold text-ever">$2,175+/mo</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.06]">
            {rows.map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-center justify-between px-5 py-3.5 text-[14px] ${
                  i % 2 ? "bg-ink/[0.015]" : ""
                }`}
              >
                <span className="text-ink/85">{k}</span>
                <span className="tabular-nums text-ink/60">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-ever/[0.05] px-5 py-4 text-[15px] font-semibold">
              <span className="text-ink">Total value</span>
              <span className="tabular-nums text-ink">$1,074+</span>
            </div>
            <div className="flex items-center justify-between bg-ever px-5 py-4 text-[15px] font-semibold text-white">
              <span>Your investment</span>
              <span className="tabular-nums">From $237/mo</span>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-md">
          <PrimaryCTA>Start my program</PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 5 — How it works (dark)
   ──────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Physician reviews your intake",
      b: "Your board-certified physician reviews your full profile within 24 hours. Priority patients: within 6 hours.",
    },
    {
      n: "02",
      t: "Prescription approved",
      b: "If approved, your prescription is written and sent to our licensed US 503A compounding pharmacy same day. Not approved: full refund. Immediately.",
    },
    {
      n: "03",
      t: "Medication prepared and shipped",
      b: "Your GLP-1 is prepared, cold-packed, and shipped to your door within 48 hours of approval.",
    },
    {
      n: "04",
      t: "Arrives in 3-5 days",
      b: "Plain discreet packaging. Nothing identifying outside. Everything you need is inside.",
    },
    {
      n: "05",
      t: "Monthly refills — automatic",
      b: "5-day notice before every charge. Cancel anytime with one click. No phone call. No forms.",
    },
  ];
  return (
    <section className="bg-ink py-16 text-white sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <h2 className="font-hero text-center text-[28px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[38px]">
            Here's exactly what happens after you click.
          </h2>
        </Reveal>
        <div className="mt-12 space-y-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <div className="grid grid-cols-[64px_1fr] items-start gap-5 sm:grid-cols-[80px_1fr]">
                <div className="font-hero text-[42px] font-bold text-ever sm:text-[52px]">{s.n}</div>
                <div>
                  <div className="text-[17px] font-semibold sm:text-[19px]">{s.t}</div>
                  <p className="mt-2 text-[14px] leading-[1.6] text-white/70">{s.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-md">
          <PrimaryCTA variant="light">Start my program</PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 6 — Real results
   ──────────────────────────────────────────────────────────── */

const REVIEWS = [
  {
    q: "The food noise is just gone. I didn't know everyone's head wasn't like mine. The constant negotiating with myself about food just stopped. The weight loss is great but that part changed my life.",
    n: "Jennifer R., 41",
    m: "Weight Loss · 5 months",
  },
  {
    q: "50 lbs down in 7 months. I haven't seen that number on a scale in 30 years. I stepped off and stepped back on just to make sure.",
    n: "Michael T., 52",
    m: "Weight Loss · 7 months",
  },
  {
    q: "The billing was exactly $249. Same when my dose went up. I called to double check. I genuinely could not believe it. After what happened at my last provider I actually cried.",
    n: "Sarah M., 47",
    m: "Weight Loss · 4 months",
  },
  {
    q: "My doctor told me to just eat less for 10 years. 10 years of that same advice that never worked. This worked in 6 weeks.",
    n: "Lisa K., 39",
    m: "Weight Loss · 2 months",
  },
];

function RealResults() {
  return (
    <section className="bg-ink/[0.02] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="px-5">
          <Reveal>
            <div className="text-center">
              <EyebrowChip>Real stories</EyebrowChip>
              <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[38px]">
                Real patients. Real results.
              </h2>
              <div className="mt-3 flex items-center justify-center gap-1 text-[13.5px] text-ink/60">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-ever text-ever" />
                ))}
                <span className="ml-2">4.8 out of 5 · 3,000+ patients</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* photo strip */}
        <Reveal delay={0.08}>
          <div className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="snap-start shrink-0" style={{ width: 160 }}>
                <PlaceholderImage ratio="aspect-[4/5]" label={`Patient ${i + 1}`} />
              </div>
            ))}
          </div>
        </Reveal>

        {/* review cards */}
        <Reveal delay={0.15}>
          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {REVIEWS.map((r) => (
              <div
                key={r.n}
                className="w-[320px] shrink-0 snap-start rounded-2xl border border-ink/[0.06] bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)]"
              >
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-ever text-ever" />
                  ))}
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-ink/85">"{r.q}"</p>
                <div className="mt-4 border-t border-ink/[0.06] pt-3 text-[12.5px] text-ink/55">
                  <span className="font-semibold text-ink">{r.n}</span> · {r.m}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 7 — Mechanism / belief builder
   ──────────────────────────────────────────────────────────── */

function Mechanism() {
  const blocks = [
    {
      t: "Your metabolism has been working against you",
      b: "When you restrict calories, your brain interprets it as starvation and increases hunger signals for months. That's why the weight always comes back. It's not discipline. It's biology fighting back.",
      lbl: "Metabolism illustration",
    },
    {
      t: "GLP-1 resets the signal at its source",
      b: "GLP-1 medications regulate hunger signals in your brain directly. They don't restrict. They reset. On average, patients lose over 20% of body weight — and keep it off.",
      lbl: "Signal illustration",
    },
    {
      t: "Physician-supervised. Every dose. Every month.",
      b: "Every protocol is reviewed by a board-certified physician. Your dose is titrated carefully. Your progress is monitored. This isn't a supplement — it's medical treatment done properly.",
      lbl: "Physician portrait",
    },
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="max-w-2xl">
            <EyebrowChip>Why it works</EyebrowChip>
            <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[38px]">
              It's not about eating less. It's about resetting.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-ink/60">
              Why everything you tried before didn't stick — and why this approach is fundamentally different.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
          {blocks.map((b, i) => (
            <Reveal key={b.t} delay={i * 0.06}>
              <div className="overflow-hidden rounded-3xl border border-ink/[0.06] bg-white shadow-[0_10px_40px_-30px_rgba(0,0,0,0.25)]">
                <PlaceholderImage ratio="aspect-[4/3]" label={b.lbl} className="rounded-none" />
                <div className="p-5 sm:p-6">
                  <div className="text-[16.5px] font-semibold text-ink">{b.t}</div>
                  <p className="mt-2 text-[14px] leading-[1.65] text-ink/65">{b.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <PrimaryCTA>Start my program</PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 7.5 — Projection chart (reuses intake animation)
   ──────────────────────────────────────────────────────────── */

function Projection({
  firstName,
  startWeight,
  bmi,
}: {
  firstName: string;
  startWeight: number;
  bmi: number | null;
}) {
  const start = Math.max(120, Math.min(500, startWeight));
  const lossPct = bmi && bmi >= 30 ? 0.17 : bmi && bmi >= 27 ? 0.14 : 0.11;
  const lossLbs = Math.round(start * lossPct);
  const end = start - lossLbs;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const months = Array.from({ length: 7 }, (_, i) => monthNames[(now.getMonth() + i) % 12]);
  const points = months.map((_, i) => {
    const t = i / (months.length - 1);
    const eased = 1 - Math.pow(1 - t, 2.4);
    return start - (start - end) * eased;
  });
  const W = 640, H = 300, padL = 64, padR = 28, padT = 28, padB = 44;
  const xAt = (i: number) => padL + (i / (months.length - 1)) * (W - padL - padR);
  const yAt = (v: number) => {
    const min = end - 4, max = start + 4;
    return padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  };
  const path = points.reduce((acc, v, i) => {
    const x = xAt(i), y = yAt(v);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = xAt(i - 1), prevY = yAt(points[i - 1]);
    const cx1 = prevX + (x - prevX) * 0.5, cx2 = prevX + (x - prevX) * 0.5;
    return `${acc} C ${cx1} ${prevY}, ${cx2} ${y}, ${x} ${y}`;
  }, "");

  return (
    <section className="bg-ink/[0.02] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <EyebrowChip>Your projection</EyebrowChip>
          <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[36px]">
            {firstName}, in six months you could lose{" "}
            <span className="text-ever">{lossLbs} lbs</span>.
          </h2>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
            <defs>
              <linearGradient id="wlSalesLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ee7273" />
                <stop offset="100%" stopColor="#ee7273" />
              </linearGradient>
            </defs>
            <line x1={padL} x2={W - padR} y1={yAt(start)} y2={yAt(start)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="5 6" />
            <line x1={padL} x2={W - padR} y1={yAt(end)} y2={yAt(end)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="5 6" />
            <text x={padL - 12} y={yAt(start) + 4} textAnchor="end" className="fill-ink/70" style={{ fontSize: 13, fontWeight: 500 }}>
              {start} lbs
            </text>
            <text x={padL - 12} y={yAt(end) + 4} textAnchor="end" className="fill-ink/70" style={{ fontSize: 13, fontWeight: 500 }}>
              {end} lbs
            </text>
            <motion.path
              d={path}
              fill="none"
              stroke="url(#wlSalesLine)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.circle
              cx={xAt(0)} cy={yAt(start)} r={8} fill="#ee7273"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4, type: "spring", stiffness: 260, damping: 18 }}
            />
            <motion.circle
              cx={xAt(months.length - 1)} cy={yAt(end)} r={9} fill="#ee7273"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.7, duration: 0.5, type: "spring", stiffness: 220, damping: 16 }}
            />
            {months.map((m, i) => (
              <text key={`${m}-${i}`} x={xAt(i)} y={H - 14} textAnchor="middle" className="fill-ink/60" style={{ fontSize: 12, fontWeight: 500 }}>
                {m}
              </text>
            ))}
          </svg>
        </motion.div>

        <p className="mx-auto mt-6 max-w-xl text-[14px] leading-[1.6] text-ink/60">
          Patients with a similar starting BMI lose an average of{" "}
          {(lossPct * 100).toFixed(1)}% body weight in six months. Individual results vary.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 8 — Guarantee
   ──────────────────────────────────────────────────────────── */

function Guarantee() {
  const items = [
    {
      t: "Not approved — full refund",
      b: "If our physician doesn't approve you based on your health profile — full refund. Immediately. No questions.",
    },
    {
      t: "No results — we fix it or refund you",
      b: "Complete your program and don't lose weight? We adjust your protocol. If that doesn't work — refund.",
    },
    {
      t: "Price increases — we refund your last charge",
      b: "Your price never goes up when your dose increases. Not ever. If it does — we refund your last charge.",
    },
  ];
  return (
    <section className="bg-ever py-16 text-white sm:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="font-hero mt-6 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[38px]">
            Our promise to you.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {items.map((g, i) => (
            <Reveal key={g.t} delay={i * 0.05}>
              <div>
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="mt-4 text-[17px] font-semibold">{g.t}</div>
                <p className="mt-2 text-[14px] leading-[1.6] text-white/85">{g.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-[13px] italic text-white/70">
          No fine print. No tricks. No gotchas.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 9 — FAQ
   ──────────────────────────────────────────────────────────── */

const FAQS: [string, string][] = [
  [
    "Is compounded semaglutide the same as Ozempic?",
    "The active molecule is identical — semaglutide. Compounded semaglutide is manufactured at an FDA-registered 503A licensed US compounding pharmacy under your physician's specific prescription. Every vial is quality-tested. It's a compounded equivalent at a fraction of the brand-name cost.",
  ],
  [
    "What if my physician doesn't approve me?",
    "Full refund. Immediately. No questions asked. If our physician determines you're not a candidate — you pay nothing and every cent is returned within 24 hours.",
  ],
  [
    "I'm scared of the injection. Is it really simple?",
    "The needle is shorter and thinner than an insulin syringe. Most patients describe it as a minor pinch or nothing at all. Your kit comes with step-by-step injection instructions and your physician is available to walk you through it.",
  ],
  [
    "What does 'same price at every dose' actually mean?",
    "$249 at 0.25mg weekly. $299 at 0.5mg. $299 at 1mg. $299 at the maximum dose. Same price. Always. Every other GLP-1 platform we know charges more when your dose increases. We never will.",
  ],
  [
    "Can I cancel anytime?",
    "Yes. One click in your patient portal. No phone call. No hold music. No 30-day notice. Cancel today — it's done today.",
  ],
  [
    "I'm on a GLP-1 already. Do I have to start over?",
    "No. Your physician matches your current dose exactly. Upload your current medication photo in your intake form. You pick up exactly where you left off.",
  ],
  [
    "How fast will I actually see results?",
    "Most patients notice appetite changes in weeks 1-2. Measurable weight loss typically begins weeks 3-4. Results compound month over month as your dose titrates.",
  ],
  [
    "What if it doesn't work for me?",
    "If you complete your program and don't lose weight, we'll work with your physician to adjust your protocol. If that still doesn't work — we refund you. That's the guarantee.",
  ],
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-ink/[0.02] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <div className="text-center">
            <EyebrowChip>FAQ</EyebrowChip>
            <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[36px]">
              Questions before you start.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 divide-y divide-ink/[0.08] rounded-2xl border border-ink/[0.08] bg-white">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-medium text-ink">{q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4 text-ink/50" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[14px] leading-[1.7] text-ink/70">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 10 — Physician team
   ──────────────────────────────────────────────────────────── */

const PHYSICIANS = [
  { n: "Scott Nass, MD", c: "Board-certified · Family Medicine", s: "Licensed in 24 states" },
  { n: "Frank Suppa, DO", c: "Board-certified · Internal Medicine", s: "Licensed in 18 states" },
  { n: "Courtney Patterson-Manfredi, APRN", c: "Nurse Practitioner", s: "Licensed in 14 states" },
  { n: "May-Lynn Chu, DO", c: "Board-certified · Family Medicine", s: "Licensed in 22 states" },
];

function PhysicianTeam() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="text-center">
            <EyebrowChip>Your care team</EyebrowChip>
            <h2 className="font-hero mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[36px]">
              The physicians who review your case.
            </h2>
            <p className="mt-3 text-[13.5px] text-ink/60">
              Board-certified · US-licensed · Reviewing cases now.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
          {PHYSICIANS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.05}>
              <div className="w-[220px] shrink-0 snap-start rounded-2xl border border-ink/[0.06] bg-white p-5 text-center md:w-auto">
                <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-ink/[0.06]">
                  <PlaceholderImage ratio="aspect-square" className="rounded-full" />
                </div>
                <div className="mt-3 text-[14.5px] font-semibold text-ink">{p.n}</div>
                <div className="mt-1 text-[12.5px] text-ink/60">{p.c}</div>
                <div className="mt-0.5 text-[11.5px] text-ink/45">{p.s}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-2 text-[12.5px]">
            {[
              "🏥 Board-certified physicians",
              "💊 Licensed US 503A pharmacies",
              "🔒 HIPAA compliant",
              "⏱️ Rx within 24 hours of approval",
            ].map((t) => (
              <div key={t} className="rounded-full bg-ink/[0.04] px-3 py-2 text-center text-ink/70">
                {t}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section 11 — Final CTA (dark)
   ──────────────────────────────────────────────────────────── */

function FinalCTA({
  firstName,
  plan,
  setPlan,
  priority,
  setPriority,
  totalToday,
}: {
  firstName: string;
  plan: PlanKey;
  setPlan: (p: PlanKey) => void;
  priority: boolean;
  setPriority: (v: boolean) => void;
  totalToday: number;
}) {
  const { label } = useReservedCountdown();
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-ever/25 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <Reveal>
          <h2 className="font-hero text-[30px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[42px]">
            {firstName}, your program is ready.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.55] text-white/75">
            Physician review in 24 hours. Ships in 48 hours. Same price at every dose. Forever.
          </p>
        </Reveal>

        <div className="mt-10 space-y-2.5 text-left">
          {(Object.keys(PLANS) as PlanKey[]).map((k) => {
            const p = PLANS[k];
            const selected = plan === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setPlan(k)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all ${
                  selected
                    ? "bg-white text-ink shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
                    : "bg-white/10 text-white/85 hover:bg-white/15"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border-2 ${
                      selected ? "border-ever bg-ever" : "border-white/50"
                    }`}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-[14px] font-semibold">
                    {p.title}
                    {p.badge && (
                      <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${
                        selected ? (p.badge.kind === "popular" ? "bg-ever text-white" : "bg-ink text-white") : "bg-white/20"
                      }`}>
                        {p.badge.label}
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-[13px] tabular-nums">
                  ${p.today.toLocaleString()}{" "}
                  <span className={selected ? "text-ink/50" : "text-white/60"}>
                    (${p.perMonth}/mo)
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setPriority(!priority)}
          className={`mt-4 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3 text-left transition-all ${
            priority ? "border-white bg-white/10" : "border-white/40 bg-white/5 hover:border-white/60"
          }`}
        >
          <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${
              priority ? "border-white bg-white text-ink" : "border-white/50"
            }`}
          >
            {priority && <Check className="h-3.5 w-3.5" />}
          </span>
          <span className="text-[13.5px] font-medium">
            <Zap className="mr-1 inline h-3.5 w-3.5 text-white" />
            Priority Physician Review <span className="text-white/70">+${PRIORITY_ADDON}</span>
          </span>
        </button>

        <div className="mt-6">
          <PrimaryCTA variant="light">Start my program</PrimaryCTA>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1 text-[12px] text-white/60">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Secure · Cancel anytime · Same price forever · HIPAA
          </div>
          <div className="tabular-nums">
            <Timer className="mr-1 inline h-3 w-3" /> Slot reserved · Expires: {label}
          </div>
          <div className="tabular-nums">
            Total today: <span className="font-semibold text-white">${totalToday.toFixed(2)}</span>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-[11px] leading-[1.6] text-white/40">
          *The $249 promotional rate applies to your first month only for new customers on the
          monthly plan. Standard rate is $299/mo from month 2. 3-month and 6-month prepaid plans
          available at $237/mo. Same price at every dose level. Terms vary by state.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────────────────────── */

function SalesFooter() {
  return (
    <footer className="bg-[#0f0f0f] py-12 text-white/60">
      <div className="mx-auto max-w-6xl px-5">
        <img src={logo.url} alt="Blissley" className="h-6 w-auto brightness-0 invert" />
        <p className="mt-3 max-w-md text-[13.5px] italic text-white/45">
          Become who you were always supposed to be.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
          <a href="/legal/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/legal/terms" className="hover:text-white">Terms</a>
          <a href="/legal/medication-safety" className="hover:text-white">HIPAA Notice</a>
          <a href="/legal/refund" className="hover:text-white">Refund Policy</a>
          <a href="/legal/shipping" className="hover:text-white">Cancellation</a>
        </div>
        <p className="mt-6 max-w-3xl text-[11px] leading-[1.7] text-white/30">
          © 2026 TheFactual LLC DBA Blissley. Blissley is a technology platform and does not
          practice medicine. Physician services are provided by independent licensed practitioners.
          Individual results vary. Compounded medications are not FDA-approved.
        </p>
      </div>
    </footer>
  );
}
