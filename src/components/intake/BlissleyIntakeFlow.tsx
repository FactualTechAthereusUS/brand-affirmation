import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  RefreshCcw,
  Brain,
  Frown,
  Pill,
  Flame,
  Meh,
  Smile,
  Scale as ScaleIcon,
  Zap,
  Heart,
  Sparkles,
  Trophy,
  ShieldCheck,
  Check,
  BedDouble,
  Moon,
} from "lucide-react";

import { PhoneField, StateSelect } from "./primitives";
import {
  TrxButton as PrimaryButton,
  TrxOption as OptionCard,
  TrxIconOption as IconOption,
  TrxField as TextField,
  TrxScreen as ScreenShell,
  TrxStepper,
  TrxHeader,
  NAVY,

} from "./TrxUI";
import blissleyWhite from "@/assets/blissley-white.png.asset.json";
import qBg1 from "@/assets/intake-q1-redhead.png.asset.json";
import qBg2 from "@/assets/intake-q2-sunflower.jpg.asset.json";
import qBg3 from "@/assets/intake-q3-mountain.png.asset.json";
import trxHeroImg from "@/assets/trx-hero-woman.png.asset.json";
import trxHeroWoman2 from "@/assets/trx-hero-woman2-desktop.png.asset.json";
import trxHeroWoman2Mobile from "@/assets/trx-hero-woman2-mobile.png.asset.json";
import trxRankedHero from "@/assets/trx-ranked-desktop.png.asset.json";
import trxRankedHeroMobile from "@/assets/trx-ranked-mobile.png.asset.json";
import verifiedCheck from "@/assets/verified-check.png.asset.json";
import kristinBefore from "@/assets/kristin-before.png.asset.json";
import kristinAfter from "@/assets/kristin-after.png.asset.json";
import daieneBefore from "@/assets/daiene-before.png.asset.json";
import daieneAfter from "@/assets/daiene-after.png.asset.json";
import spMaleBefore from "@/assets/sp-male-before.png.asset.json";
import spMaleAfter from "@/assets/sp-male-after.png.asset.json";
import davidBefore from "@/assets/david-before.png.asset.json";
import davidAfter from "@/assets/david-after.png.asset.json";


/* ═════════════ Types ═════════════ */
type Sex = "female" | "male";
type YesNo = "yes" | "no";
type Answers = {
  heightFt?: string;
  heightIn?: string;
  weightLbs?: string;
  goalWeight?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  symptoms?: string[];
  consent?: boolean;
  sex?: Sex;
  dobMonth?: string;
  dobDay?: string;
  dobYear?: string;
  pregnancy?: string[];
  painSituation?: string;
  painSeverity?: string;
  painTimeline?: string;
  failedSolutions?: string[];
  primaryDesire?: string;
  sleepQuality?: string;
  motivation?: string;
  pacePreference?: string;
  commitment?: string;
  contra?: string[];
  healthConditions?: string[];
  priorGlp1?: string;
  priorDose?: string;
  priorLastMonth?: string;
  priorLastDay?: string;
  priorLastYear?: string;
  priorMonths?: string;
  currentMeds?: YesNo;
  currentMedsDetail?: string;
  drugAllergies?: YesNo;
  drugAllergiesDetail?: string;
  medConditions?: YesNo;
  medConditionsDetail?: string;
  pastSurgeries?: YesNo;
  pastSurgeriesDetail?: string;
  additionalNotes?: string;
  phone?: string;
  state?: string;
  q1?: YesNo;
  q2?: string;
  q3?: string;
};

const SCREENS = [
  "bmi",            // 1
  "lead",           // 2
  "goal",           // 3
  "sex_dob",        // 4
  "pregnancy",      // 4A female
  "pain_spec",      // 5
  "pain_sev",       // 6
  "pain_time",      // 7
  "failed",         // 8
  "kristin",        // story insert
  "belief",         // Info slide 1
  "primary_desire", // 9
  "sleep",          // 10
  "motivation",     // 11
  "pace_project",   // Interstitial
  "daiene",         // story insert
  "pace_pref",      // 12
  "commitment",     // 13
  "ranked",         // proof interstitial
  "contra",         // 14
  "health",         // 15
  "prior_glp1",     // 16
  "med_history",    // 17
  "phone_state",    // 18
  "loading",
  "blocked_minor",
  "blocked_pregnancy",
  "blocked_bmi_low",
  "blocked_contra",
] as const;
type ScreenId = (typeof SCREENS)[number];

const STAGE_MAP: Record<ScreenId, number> = {
  bmi: 0, lead: 0,
  goal: 1, sex_dob: 1, pregnancy: 1,
  pain_spec: 2, pain_sev: 2, pain_time: 2, failed: 2, kristin: 2, belief: 2,
  primary_desire: 2, sleep: 2, motivation: 2,
  pace_project: 3, daiene: 3, pace_pref: 3, commitment: 3, ranked: 3,
  contra: 3, health: 3, prior_glp1: 3, med_history: 3,
  phone_state: 4, loading: 4,
  blocked_minor: 4, blocked_pregnancy: 4,
  blocked_bmi_low: 4, blocked_contra: 4,
};

/* Hard contraindications that auto-reject in the quiz (FDA-boxed / absolute) */
const HARD_CONTRA: Record<string, { chip: string; title: string; body: string }> = {
  "Personal/family history of MTC or MEN2": {
    chip: "Safety first",
    title: "GLP-1s aren't safe with your thyroid history.",
    body: "A personal or family history of medullary thyroid carcinoma (MTC) or MEN2 is an FDA boxed-warning contraindication for GLP-1 medications. This isn't a Blissley policy - no clinician can safely prescribe these to you.",
  },
  "History of pancreatitis": {
    chip: "Safety first",
    title: "A history of pancreatitis rules out GLP-1 therapy.",
    body: "GLP-1 medications can trigger pancreatitis, and a prior episode significantly raises that risk. We recommend speaking with your primary care physician about alternative approaches.",
  },
  "Active cancer": {
    chip: "Not the right time",
    title: "GLP-1s aren't appropriate during active cancer treatment.",
    body: "While you're in active treatment, weight-loss medication isn't clinically appropriate. You're welcome back after treatment ends - we'll be here.",
  },
  "Known allergy to semaglutide or tirzepatide": {
    chip: "Safety first",
    title: "A prior reaction rules out this medication class.",
    body: "A known allergy to semaglutide or tirzepatide means we can't safely prescribe any GLP-1 medication. Please speak with your doctor about non-GLP-1 options.",
  },
};




/* ═════════════ Yes/No + optional detail ═════════════ */
function YesNoWithDetail({
  value, onChange, detail, onDetail, detailPlaceholder,
}: {
  value?: YesNo;
  onChange: (v: YesNo) => void;
  detail?: string;
  onDetail?: (v: string) => void;
  detailPlaceholder?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {(["no", "yes"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-[54px] rounded-lg border text-[15px] font-medium capitalize transition-all ${
              value === v
                ? "border-[#1D437B] bg-[#1D437B] text-white shadow-[0_8px_20px_rgba(29,67,123,0.22)]"
                : "border-ink/12 bg-white text-ink hover:border-ink/30"
            }`}
          >
            {v === "no" ? "None" : "Yes"}
          </button>
        ))}
      </div>
      {value === "yes" && onDetail && (
        <motion.textarea
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          value={detail ?? ""}
          onChange={(e) => onDetail(e.target.value)}
          placeholder={detailPlaceholder ?? "Please list them…"}
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-[#1D437B] focus:shadow-[0_0_0_3px_rgba(29,67,123,0.12)]"
        />
      )}
    </>
  );
}

/* ═════════════ BMI meter (visual segmented, color-coded) ═════════════ */
function BmiMeter({ bmi }: { bmi: number }) {
  // Range 15 - 45 mapped to 0-100%
  const min = 15, max = 45;
  const pct = Math.max(0, Math.min(100, ((bmi - min) / (max - min)) * 100));

  const segs = [
    { label: "Underweight", range: "<18.5", color: "#4A90D9", tint: "rgba(74,144,217,0.14)" },
    { label: "Normal",      range: "18.5-24.9", color: "#3FA663", tint: "rgba(63,166,99,0.14)" },
    { label: "Overweight",  range: "25-29.9", color: "#E0A83B", tint: "rgba(224,168,59,0.16)" },
    { label: "Obese",       range: "≥30",    color: "#ee7273", tint: "rgba(238,114,115,0.16)" },
  ];

  const activeIdx = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3;
  const active = segs[activeIdx];

  const label =
    bmi < 18.5 ? "Underweight" :
    bmi < 25   ? "Normal" :
    bmi < 30   ? "Overweight" :
    bmi < 35   ? "Obese" :
    bmi < 40   ? "Severe Obesity" : "Extreme Obesity";

  const message =
    bmi < 18.5 ? "Your BMI is below the healthy range. GLP-1 therapy isn't the right fit - let's focus on nourishment first."
    : bmi < 25 ? `Your BMI of ${bmi} sits in the healthy range. GLP-1 therapy is generally reserved for higher BMIs.`
    : bmi < 27 ? `Your BMI of ${bmi} is slightly elevated. You may qualify with a related condition - we'll check next.`
    : bmi < 30 ? `Your BMI of ${bmi} qualifies you for GLP-1 therapy. Patients in this range typically lose 15-20% of body weight.`
    : bmi < 35 ? `Your BMI of ${bmi} indicates obesity. Clinically, GLP-1 medications are a strong fit - patients here lose an average of 21% body weight.`
    : bmi < 40 ? `Your BMI of ${bmi} indicates severe obesity. GLP-1 therapy is clinically indicated - you're exactly who this treatment was designed for.`
    : `Your BMI of ${bmi} places you in the highest-risk category. GLP-1 therapy paired with clinical oversight can be life-changing.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-2"
    >
      <div className="flex items-baseline justify-between">
        <div className="text-[13px] font-medium text-ink/60">Your BMI</div>
        <div className="text-[13px] font-semibold" style={{ color: active.color }}>{label}</div>
      </div>

      {/* Meter */}
      <div
        className="relative mt-2 h-[54px] w-full overflow-hidden rounded-full"
        style={{ background: active.tint }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, 18)}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 flex items-center justify-center rounded-full"
          style={{ background: active.color }}
        >
          <motion.span
            key={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="whitespace-nowrap px-4 text-[15px] font-semibold text-white"
          >
            {bmi} · {label}
          </motion.span>
        </motion.div>
      </div>

      {/* Segment legend */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {segs.map((s, i) => {
          const isActive = i === activeIdx;
          return (
            <div key={s.label}>
              <div
                className="h-[3px] w-full rounded-full transition-all"
                style={{
                  background: isActive ? s.color : "rgba(23,23,23,0.10)",
                  transform: isActive ? "scaleY(1.6)" : "scaleY(1)",
                }}
              />
              <div
                className={`mt-1.5 text-[12.5px] ${isActive ? "font-semibold" : "font-medium text-ink/45"}`}
                style={isActive ? { color: s.color } : undefined}
              >
                {s.label}
              </div>
              <div className="text-[11.5px] text-ink/40">{s.range}</div>
            </div>
          );
        })}
      </div>

      {/* Contextual guidance card */}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-4 rounded-2xl border p-3.5 text-[13.5px] leading-[1.55]"
        style={{
          borderColor: active.color,
          background: active.tint,
          color: "#171717",
        }}
      >
        {message}
      </motion.div>
    </motion.div>
  );
}



export function BlissleyIntakeFlow() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const set = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));

  const bmi = useMemo(() => {
    const ft = parseFloat(answers.heightFt || "0");
    const inch = parseFloat(answers.heightIn || "0");
    const w = parseFloat(answers.weightLbs || "0");
    const totalIn = ft * 12 + inch;
    if (!totalIn || !w) return null;
    return +(703 * (w / (totalIn * totalIn))).toFixed(1);
  }, [answers.heightFt, answers.heightIn, answers.weightLbs]);

  const paceCalc = useMemo(() => {
    const s = parseFloat(answers.weightLbs || "0");
    const g = parseFloat(answers.goalWeight || "0");
    if (!s || !g || g >= s) return null;
    const toLose = s - g;
    const weeksFast = Math.round(toLose / 3.83);
    const weeksSlow = Math.round(toLose / 2.5);
    return { toLose, weeksFast, weeksSlow, start: s, goal: g };
  }, [answers.weightLbs, answers.goalWeight]);

  const goTo = (id: ScreenId) => {
    const i = SCREENS.indexOf(id);
    if (i >= 0) setIdx(i);
  };

  const getNextIndex = (from: number, sex = answers.sex) => {
    let n = Math.min(SCREENS.length - 1, from + 1);
    if (SCREENS[n] === "pregnancy" && sex !== "female") n += 1;
    if (SCREENS[n] === "blocked_minor" || SCREENS[n] === "blocked_pregnancy") return from;
    return n;
  };
  const next = () => setIdx((i) => getNextIndex(i));
  const prev = () => {
    setIdx((i) => {
      let n = Math.max(0, i - 1);
      if (SCREENS[n] === "pregnancy" && answers.sex !== "female") n = Math.max(0, n - 1);
      return n;
    });
  };
  const pickThenNext = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    set({ [key]: value } as Partial<Answers>);
    setTimeout(() => setIdx((i) => getNextIndex(i, key === "sex" ? (value as Sex) : answers.sex)), 220);
  };
  const toggleMulti = (key: keyof Answers, value: string, none = "None of the above") => {
    setAnswers((a) => {
      const arr = ((a[key] as string[] | undefined) ?? []).slice();
      if (value === none) return { ...a, [key]: arr.includes(none) ? [] : [none] };
      const without = arr.filter((v) => v !== none);
      const exists = without.includes(value);
      return { ...a, [key]: exists ? without.filter((v) => v !== value) : [...without, value] };
    });
  };

  const current: ScreenId = SCREENS[idx];
  const stage = STAGE_MAP[current];
  const isTerminal = current === "loading" || current === "blocked_minor" || current === "blocked_pregnancy" || current === "blocked_bmi_low" || current === "blocked_contra";
  const fname = answers.firstName || "";

  useEffect(() => {
    if (current !== "loading") return;
    try {
      sessionStorage.setItem("blissley_intake_broad", JSON.stringify({ ...answers, bmi }));
    } catch {}
  }, [current, answers, bmi]);

  return (
    <div className="relative min-h-[100svh] bg-white pb-24">
      {!isTerminal && (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl">
          <TrxHeader onBack={prev} showBack={idx > 0} />
          <div className="px-4 py-3 md:px-8 md:py-4">
            <TrxStepper stage={stage} />
          </div>
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col px-5 pt-10 md:px-8 md:pt-14">
        <AnimatePresence mode="wait">
          <div key={current} className="flex flex-col">

            {/* 1 - BMI qualifier */}
            {current === "bmi" && (
              <>
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[16/10] md:aspect-[21/9] mb-6 md:mb-8">
                  <img src={trxHeroImg.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <img src={blissleyWhite.url} alt="Blissley" className="absolute bottom-4 left-4 md:bottom-6 md:left-6 h-8 md:h-12 w-auto drop-shadow-lg" />
                </div>
                <ScreenShell
                  title={`"Let's see if you qualify {{for medical weight loss.}}"`}
                  sub="Enter your height and weight - we'll check your BMI instantly."
                  footer={
                    <PrimaryButton onClick={next} disabled={!answers.heightFt || !answers.heightIn || !answers.weightLbs}>
                      Next →
                    </PrimaryButton>
                  }
                >
                  <label className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/55">Height & weight</label>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Feet" type="number" value={answers.heightFt ?? ""} onChange={(v) => set({ heightFt: v })} placeholder="5" />
                    <TextField label="Inches" type="number" value={answers.heightIn ?? ""} onChange={(v) => set({ heightIn: v })} placeholder="6" />
                  </div>
                  <TextField label="Weight (lbs)" type="number" value={answers.weightLbs ?? ""} onChange={(v) => set({ weightLbs: v })} placeholder="200" />

                  {bmi !== null && <BmiMeter bmi={bmi} />}
                </ScreenShell>
              </>
            )}

            {/* 2 - Name + email */}
            {current === "lead" && (
              <ScreenShell
                title="Great. Let's build your {{personalized program.}}"
                sub="First we'll capture the basics so we can email your results."
                footer={
                  <PrimaryButton onClick={next} disabled={!answers.firstName || !answers.lastName || !answers.email || !answers.consent}>
                    Continue →
                  </PrimaryButton>
                }
              >
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="First name" value={answers.firstName ?? ""} onChange={(v) => set({ firstName: v })} placeholder="Jane" />
                  <TextField label="Last name" value={answers.lastName ?? ""} onChange={(v) => set({ lastName: v })} placeholder="Doe" />
                </div>
                <TextField label="Email address" type="email" value={answers.email ?? ""} onChange={(v) => set({ email: v })} placeholder="you@example.com" />
                <label className="mt-1 flex items-start gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 cursor-pointer">
                  <span
                    className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] border transition-colors"
                    style={{
                      borderColor: answers.consent ? NAVY : "rgba(29,67,123,0.25)",
                      background: answers.consent ? NAVY : "rgba(29,67,123,0.06)",
                    }}
                  >
                    {answers.consent && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.2} />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={!!answers.consent}
                    onChange={(e) => set({ consent: e.target.checked })}
                  />
                  <span className="text-[13.5px] leading-snug text-ink/75">
                    I agree to receive my assessment results and health information from Blissley via email and SMS.
                  </span>
                </label>
                <p className="mt-1 flex items-center gap-2 text-[12px] text-ink/55">
                  <ShieldCheck className="h-4 w-4 text-[#1D437B]" />
                  HIPAA protected. Never sold or shared.
                </p>
              </ScreenShell>
            )}

            {/* 3 - Goal weight */}
            {current === "goal" && (
              <>
                <ScreenShell
                  title={fname ? `We're in this together, ${fname}. {{Your goal is our goal.}}` : "We're in this together. {{Your goal is our goal.}}"}
                  sub="What's your goal weight?"
                  footer={
                    <PrimaryButton
                      onClick={next}
                      disabled={!answers.goalWeight || parseFloat(answers.goalWeight) >= parseFloat(answers.weightLbs || "0")}
                    >
                      Next →
                    </PrimaryButton>
                  }
                >
                  <TextField label="Goal weight (lbs)" type="number" value={answers.goalWeight ?? ""} onChange={(v) => set({ goalWeight: v })} placeholder="155" />
                  {paceCalc && (
                    <div className="inline-flex w-max items-center gap-2 rounded-full bg-[#1D437B]/10 px-4 py-2 text-[13px] font-semibold text-[#1D437B]">
                      <ScaleIcon className="h-4 w-4" />
                      You want to lose {paceCalc.toLose} lbs
                    </div>
                  )}
                </ScreenShell>
                <div className="relative mt-6 overflow-hidden rounded-2xl md:rounded-3xl aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/10]">
                  <img src={trxHeroWoman2Mobile.url} alt="" className="absolute inset-0 h-full w-full object-cover sm:hidden" />
                  <img src={trxHeroWoman2.url} alt="" className="absolute inset-0 hidden h-full w-full object-cover sm:block" />
                  <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
                    <div className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.16em] text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                      Join over 500K success stories
                    </div>
                    <div className="mt-1 font-serif text-[22px] md:text-[28px] font-semibold leading-tight text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.55)]">
                      Start your journey today
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 4 - Sex + DOB */}
            {current === "sex_dob" && (() => {
              const m = parseInt(answers.dobMonth || "0", 10);
              const d = parseInt(answers.dobDay || "0", 10);
              const y = parseInt(answers.dobYear || "0", 10);
              const valid = m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= new Date().getFullYear();
              let age: number | null = null;
              if (valid) {
                const t = new Date();
                age = t.getFullYear() - y;
                const md = t.getMonth() + 1 - m;
                if (md < 0 || (md === 0 && t.getDate() < d)) age -= 1;
              }
              const handleNext = () => {
                if (age !== null && age < 18) { goTo("blocked_minor"); return; }
                next();
              };
              return (
                <ScreenShell
                  title={fname ? `${fname}, let's tailor your protocol.` : "Let's tailor your protocol."}
                  sub="Sex assigned at birth and date of birth."
                  footer={<PrimaryButton onClick={handleNext} disabled={!answers.sex || !valid}>Next →</PrimaryButton>}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <OptionCard label="Female" selected={answers.sex === "female"} onClick={() => set({ sex: "female" })} />
                    <OptionCard label="Male" selected={answers.sex === "male"} onClick={() => set({ sex: "male" })} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    <TextField label="Month" type="number" value={answers.dobMonth ?? ""} onChange={(v) => set({ dobMonth: v })} placeholder="MM" />
                    <TextField label="Day" type="number" value={answers.dobDay ?? ""} onChange={(v) => set({ dobDay: v })} placeholder="DD" />
                    <TextField label="Year" type="number" value={answers.dobYear ?? ""} onChange={(v) => set({ dobYear: v })} placeholder="YYYY" />
                  </div>
                  {age !== null && age >= 18 && <div className="text-[13px] text-ink/60">You're {age}. All set.</div>}
                </ScreenShell>
              );
            })()}

            {/* 4A - Pregnancy */}
            {current === "pregnancy" && (
              <ScreenShell
                title="Safety, {{first.}}"
                sub="Do any of these apply to you right now?"
                footer={<PrimaryButton onClick={next} disabled={!(answers.pregnancy && answers.pregnancy.length)}>Next →</PrimaryButton>}
              >
                {[
                  "Currently pregnant or trying to conceive",
                  "Currently breastfeeding",
                  "Given birth in the last 6 months",
                  "None of the above",
                ].map((o) => {
                  const HARD = [
                    "Currently pregnant or trying to conceive",
                    "Currently breastfeeding",
                    "Given birth in the last 6 months",
                  ];
                  return (
                    <OptionCard
                      key={o}
                      label={o}
                      selected={(answers.pregnancy ?? []).includes(o)}
                      onClick={() => {
                        if (HARD.includes(o)) {
                          set({ pregnancy: [o] });
                          setTimeout(() => goTo("blocked_pregnancy"), 180);
                        } else {
                          toggleMulti("pregnancy", o);
                        }
                      }}
                    />
                  );
                })}
              </ScreenShell>
            )}

            {/* 5 - Pain specification */}
            {current === "pain_spec" && (
              <ScreenShell
                title={fname ? `${fname}, which {{best describes}} your situation right now?` : "Which best describes your situation?"}
              >
                {[
                  { label: "I keep losing and gaining the same weight over and over", icon: <RefreshCcw /> },
                  { label: "I eat well sometimes but can't control cravings consistently", icon: <Brain /> },
                  { label: "I've tried everything and nothing has worked long term", icon: <Frown /> },
                  { label: "I know medication could help but I can't access it", icon: <Pill /> },
                ].map((o) => (
                  <OptionCard key={o.label} label={o.label} selected={answers.painSituation === o.label} onClick={() => pickThenNext("painSituation", o.label)} />
                ))}
              </ScreenShell>
            )}

            {/* 6 - Pain severity */}
            {current === "pain_sev" && (
              <ScreenShell title={`How much does this affect your day-to-day, ${fname || "friend"}?`}>
                {[
                  { label: "A lot - it's on my mind constantly", icon: <Flame /> },
                  { label: "Quite a bit - it affects how I feel most days", icon: <Frown /> },
                  { label: "Somewhat - it's a recurring frustration", icon: <Meh /> },
                  { label: "Not too much - I just want to be healthier overall", icon: <Smile /> },
                ].map((o) => (
                  <OptionCard key={o.label} label={o.label} selected={answers.painSeverity === o.label} onClick={() => pickThenNext("painSeverity", o.label)} />
                ))}
              </ScreenShell>
            )}

            {/* 7 - Pain timeline */}
            {current === "pain_time" && (
              <ScreenShell title={`How long have you been dealing with this${fname ? `, ${fname}` : ""}?`}>
                {["Less than 1 year", "1 to 3 years", "3 to 10 years", "More than 10 years"].map((o) => (
                  <div key={o}>
                    <OptionCard label={o} selected={answers.painTimeline === o} onClick={() => pickThenNext("painTimeline", o)} />
                  </div>
                ))}
                <p className="mt-3 text-[13px] leading-snug text-ink/60">
                  Most Blissley patients struggled 5+ years before finding something that works.
                </p>
              </ScreenShell>
            )}

            {/* 8 - Failed solutions */}
            {current === "failed" && (
              <ScreenShell
                title={`${fname || "You"}, what have you {{already tried?}}`}
                sub="Select all that apply."
                footer={<PrimaryButton onClick={next} disabled={!(answers.failedSolutions && answers.failedSolutions.length)}>Continue →</PrimaryButton>}
              >
                {[
                  "Calorie counting or food tracking",
                  "Keto or low-carb",
                  "Intermittent fasting",
                  "Weight loss programs (WW, Noom, etc.)",
                  "Gym or personal trainer",
                  "Prescription medication",
                  "I've lost count - tried everything",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.failedSolutions ?? []).includes(o)}
                    onClick={() => toggleMulti("failedSolutions", o)}
                    compact
                  />
                ))}
              </ScreenShell>
            )}

            {/* Story - Kristin/Michael */}
            {current === "kristin" && (
              <StoryScreen
                quote={
                  answers.sex === "male"
                    ? "For the first time in years, the cravings stopped. I finally feel like myself."
                    : "It really does work. Took about 6 weeks to feel it, but once it kicked in, everything shifted."
                }
                name={answers.sex === "male" ? "Michael" : "Kristin"}
                result="42 lbs lost · 5 months"
                before={answers.sex === "male" ? spMaleBefore.url : kristinBefore.url}
                after={answers.sex === "male" ? spMaleAfter.url : kristinAfter.url}
                onNext={next}
              />
            )}

            {/* Info slide 1 - Belief seeding */}
            {current === "belief" && (
              <ScreenShell
                title="It feels like failure. It's actually {{biology.}}"
                sub={`${fname ? `${fname}, e` : "E"}very approach you've tried attacked the behavior. None of them addressed what's actually causing it.`}
                footer={<PrimaryButton onClick={next}>Continue →</PrimaryButton>}
              >
                <MetabolicChart start={parseFloat(answers.weightLbs || "")} goal={parseFloat(answers.goalWeight || "")} firstName={fname} />
                <div className="mt-4 space-y-4 text-[15px] leading-[1.6] text-ink/80">
                  <p>Your metabolism has a hunger regulation system. When it's dysregulated, no amount of willpower can override it consistently.</p>
                  <p>GLP-1 medications are the first treatment that works at the source - regulating hunger signals in your brain directly. On average, patients lose over 20% of body weight, and keep it off.</p>
                </div>
              </ScreenShell>
            )}

            {/* 9 - Primary desire */}
            {current === "primary_desire" && (
              <ScreenShell title={`What matters most to you${fname ? `, ${fname}` : ""}?`}>
                {[
                  { label: `Reaching ${answers.goalWeight || "my goal"} lbs and staying there`, icon: <ScaleIcon /> },
                  { label: "Getting my energy and confidence back", icon: <Zap /> },
                  { label: "Improving my health and reducing risk", icon: <Heart /> },
                  { label: "All of these - I'm ready for a complete change", icon: <Sparkles /> },
                ].map((o) => (
                  <OptionCard key={o.label} label={o.label} selected={answers.primaryDesire === o.label} onClick={() => pickThenNext("primaryDesire", o.label)} />
                ))}
              </ScreenShell>
            )}

            {/* 10 - Sleep quality */}
            {current === "sleep" && (
              <ScreenShell
                title="How you sleep tells us a lot about your {{metabolism.}}"
                sub={`How would you describe your sleep${fname ? `, ${fname}` : ""}?`}
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Pretty good", icon: <BedDouble /> },
                    { label: "A bit restless", icon: <Frown /> },
                    { label: "Not well", icon: <Moon /> },
                  ].map((o) => (
                    <IconOption key={o.label} icon={o.icon} label={o.label} selected={answers.sleepQuality === o.label} onClick={() => pickThenNext("sleepQuality", o.label)} />
                  ))}
                </div>
              </ScreenShell>
            )}

            {/* 11 - Motivation */}
            {current === "motivation" && (
              <ScreenShell title={`What's your primary reason for taking this seriously right now${fname ? `, ${fname}` : ""}?`}>
                {[
                  "I want to live longer and be healthier",
                  "I want to feel and look better",
                  "I want to reduce my health issues",
                  "All of these",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.motivation === o} onClick={() => pickThenNext("motivation", o)} />
                ))}
              </ScreenShell>
            )}

            {/* Interstitial - Pace projection */}
            {current === "pace_project" && (
              <ScreenShell
                title={`${fname ? `${fname}'s` : "Your"} personalized {{projection.}}`}
                sub={
                  paceCalc
                    ? `Most patients at your profile lose 2.5 to 3.8 lbs per week. Reaching ${paceCalc.goal} lbs is achievable in roughly ${paceCalc.weeksFast} to ${paceCalc.weeksSlow} weeks - without restrictive diets, and with a physician guiding every step.`
                    : "Enter your goal to see your personalized timeline."
                }
                footer={<PrimaryButton onClick={next}>Continue →</PrimaryButton>}
              >
                <WeightLossChart start={parseFloat(answers.weightLbs || "230")} goal={parseFloat(answers.goalWeight || "180")} />
                {paceCalc && (
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    <MiniStat label="Starting" value={`${paceCalc.start} lbs`} />
                    <MiniStat label="Goal" value={`${paceCalc.goal} lbs`} />
                    <MiniStat label="To lose" value={`${paceCalc.toLose} lbs`} />
                  </div>
                )}
              </ScreenShell>
            )}

            {/* Story - Daiene/David */}
            {current === "daiene" && (
              <StoryScreen
                quote={
                  answers.sex === "male"
                    ? "The steady pace made this real. I stopped fighting my body and started working with it."
                    : "I stopped thinking about food all day. That was the first sign it was actually working."
                }
                name={answers.sex === "male" ? "David" : "Daiene"}
                result="38 lbs lost · 6 months"
                before={answers.sex === "male" ? davidBefore.url : daieneBefore.url}
                after={answers.sex === "male" ? davidAfter.url : daieneAfter.url}
                onNext={next}
              />
            )}

            {/* 12 - Pace preference */}
            {current === "pace_pref" && (
              <ScreenShell
                title={
                  paceCalc
                    ? `Reaching ${paceCalc.goal} lbs in about ${paceCalc.weeksFast}–${paceCalc.weeksSlow} weeks. {{How does that feel?}}`
                    : "How does that pace feel?"
                }
              >
                {[
                  "That works for me",
                  "I'd like to get there faster",
                  "That's faster than I expected - I'm open to it",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.pacePreference === o} onClick={() => pickThenNext("pacePreference", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 13 - Commitment */}
            {current === "commitment" && (
              <ScreenShell
                title={`${fname || "One"}, {{one last question}} before your results.`}
                sub="How committed are you to making this change?"
              >
                {[
                  "Very - I'm ready to start now",
                  "Serious - I want to understand what's involved first",
                  "Curious - I still have questions",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.commitment === o} onClick={() => pickThenNext("commitment", o)} />
                ))}
              </ScreenShell>
            )}

            {/* Ranked #1 proof */}
            {current === "ranked" && (
              <ScreenShell title="Blissley is proud to be ranked {{#1.}}" footer={<PrimaryButton onClick={next}>Continue →</PrimaryButton>}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full overflow-hidden rounded-3xl shadow-[0_24px_70px_rgba(29,67,123,0.22)]"
                >
                  <div className="flex items-center bg-[#6001D2] px-5 py-3 text-white text-[12px] font-bold uppercase tracking-[0.18em]">
                    Yahoo! Health
                  </div>
                  <div className="relative w-full aspect-[9/14] sm:aspect-[16/10]">
                    <img src={trxRankedHeroMobile.url} alt="" className="absolute inset-0 h-full w-full object-cover sm:hidden" />
                    <img src={trxRankedHero.url} alt="" className="absolute inset-0 hidden h-full w-full object-cover sm:block" />
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-9">
                      <div className="w-full max-w-[60%] text-white">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                          <Trophy className="h-4 w-4" /> Best overall
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <span className="font-serif text-[52px] sm:text-[68px] leading-none font-bold text-white">#1</span>
                          <img src={blissleyWhite.url} alt="Blissley" className="h-7 sm:h-10 w-auto object-contain" />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px] text-white/95">
                          <span className="rounded-md bg-white px-2 py-1 font-semibold text-[#1D437B]">9.8</span>
                          <span className="font-medium">Exceptional</span>
                          <span className="text-white/40">·</span>
                          <span className="flex items-center gap-0.5 text-[#ee7273]">
                            {[0,1,2,3,4].map((i) => (
                              <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" aria-hidden>
                                <path d="M10 1.5l2.6 5.27 5.82.84-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.61l5.82-.84L10 1.5z"/>
                              </svg>
                            ))}
                          </span>
                        </div>
                        <ul className="mt-4 space-y-2 text-[13px] sm:text-[14.5px] text-white/95">
                          {[
                            "Personalized GLP-1 protocols for your body",
                            "Physician review within 24 hours",
                            "Includes nausea & side-effect support",
                            "Improves treatment adherence and comfort",
                          ].map((f) => (
                            <li key={f} className="flex items-start gap-2.5 sm:gap-3">
                              <span className="mt-0.5 grid h-4 w-4 sm:h-5 sm:w-5 shrink-0 place-items-center rounded-full bg-white">
                                <svg viewBox="0 0 20 20" className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-none stroke-[#1D437B]" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M4 10.5l4 4 8-9" />
                                </svg>
                              </span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="inline-flex w-max items-center gap-2.5 rounded-full border border-white/15 bg-black/40 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-xl">
                        <span className="h-2 w-2 rounded-full bg-[#ee7273]" /> Most popular
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScreenShell>
            )}

            {/* 14 - Contraindications */}
            {current === "contra" && (
              <ScreenShell
                title="A few {{safety checks.}}"
                sub="Do any of these apply to you? Reviewed only by your physician."
                footer={<PrimaryButton onClick={next} disabled={!(answers.contra && answers.contra.length)}>Next →</PrimaryButton>}
              >
                {[
                  "Personal/family history of MTC or MEN2",
                  "Known allergy to semaglutide or tirzepatide",
                  "Active cancer",
                  "End-stage kidney or liver disease",
                  "Current suicidal thoughts or prior attempt",
                  "Severe GI condition (gastroparesis, IBD)",
                  "Organ transplant on anti-rejection meds",
                  "Active alcohol or opioid dependence",
                  "None of the above",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.contra ?? []).includes(o)}
                    onClick={() => toggleMulti("contra", o)}
                    compact
                  />
                ))}
                <p className="mt-2 flex items-center gap-2 text-[12px] text-ink/55">
                  <ShieldCheck className="h-4 w-4 text-[#1D437B]" /> HIPAA protected.
                </p>
              </ScreenShell>
            )}

            {/* 15 - Health conditions */}
            {current === "health" && (() => {
              const isMale = answers.sex === "male";
              const options = [
                "High blood pressure",
                "High cholesterol",
                "Pre-diabetes or Type 2 diabetes",
                ...(isMale ? [] : ["PCOS"]),
                "Sleep apnea",
                "Gallbladder disease",
                "Liver disease",
                "Severe depression",
                "None of the above",
              ];
              const symptomOpts = [
                "Weight gain despite diet and exercise",
                "Increased appetite or food cravings",
                "Low energy or fatigue",
                "None of the above",
              ];
              const symptomsDone = (answers.symptoms?.length ?? 0) > 0;
              const conditionsDone = (answers.healthConditions?.length ?? 0) > 0;
              return (
                <ScreenShell
                  title="A few more {{health questions.}}"
                  sub="These conditions often make you a stronger candidate - GLP-1 directly improves them."
                  footer={<PrimaryButton onClick={next} disabled={!symptomsDone || !conditionsDone}>Next →</PrimaryButton>}
                >
                  <div className="text-[14px] font-semibold text-ink">Do you experience any of the following symptoms?</div>
                  {symptomOpts.map((o) => (
                    <OptionCard
                      key={o}
                      label={o}
                      selected={(answers.symptoms ?? []).includes(o)}
                      onClick={() => toggleMulti("symptoms", o)}
                      compact
                    />
                  ))}
                  <div className="mt-4 text-[14px] font-semibold text-ink">Do you have any of these conditions?</div>
                  {options.map((o) => (
                    <OptionCard
                      key={o}
                      label={o}
                      selected={(answers.healthConditions ?? []).includes(o)}
                      onClick={() => toggleMulti("healthConditions", o)}
                      compact
                    />
                  ))}
                </ScreenShell>
              );
            })()}

            {/* 16 - Prior GLP-1 */}
            {current === "prior_glp1" && (
              <ScreenShell
                title={`Have you taken weight-loss medication before${fname ? `, ${fname}` : ""}?`}
                footer={<PrimaryButton onClick={next} disabled={!answers.priorGlp1}>Next →</PrimaryButton>}
              >
                {[
                  "No - this is my first time",
                  "Yes - Semaglutide (Ozempic / Wegovy / compounded)",
                  "Yes - Tirzepatide (Mounjaro / Zepbound / compounded)",
                  "Yes - different medication",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.priorGlp1 === o} onClick={() => set({ priorGlp1: o })} />
                ))}
                {answers.priorGlp1?.startsWith("Yes - Sema") || answers.priorGlp1?.startsWith("Yes - Tirz") ? (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-3 border-t border-ink/10 pt-4">
                    <TextField label="Last weekly dose" value={answers.priorDose ?? ""} onChange={(v) => set({ priorDose: v })} placeholder="e.g. 0.5mg" />
                    <div className="grid grid-cols-3 gap-3">
                      <TextField label="Month" type="number" value={answers.priorLastMonth ?? ""} onChange={(v) => set({ priorLastMonth: v })} placeholder="MM" />
                      <TextField label="Day" type="number" value={answers.priorLastDay ?? ""} onChange={(v) => set({ priorLastDay: v })} placeholder="DD" />
                      <TextField label="Year" type="number" value={answers.priorLastYear ?? ""} onChange={(v) => set({ priorLastYear: v })} placeholder="YYYY" />
                    </div>
                    <TextField label="Months on medication" type="number" value={answers.priorMonths ?? ""} onChange={(v) => set({ priorMonths: v })} placeholder="6" />
                    <p className="text-[12.5px] text-ink/60">We match your current dose - no restart needed.</p>
                  </motion.div>
                ) : null}
              </ScreenShell>
            )}

            {/* 17 - Medical history */}
            {current === "med_history" && (
              <ScreenShell
                title={`Last medical questions${fname ? `, ${fname}` : ""}.`}
                sub="Reviewed only by your physician within 24 hours."
                footer={
                  <PrimaryButton onClick={next} disabled={!answers.currentMeds || !answers.drugAllergies || !answers.medConditions || !answers.pastSurgeries}>
                    Next →
                  </PrimaryButton>
                }
              >
                <MedGroup label="Current medications" value={answers.currentMeds} onChange={(v) => set({ currentMeds: v })} detail={answers.currentMedsDetail} onDetail={(v) => set({ currentMedsDetail: v })} />
                <MedGroup label="Drug allergies" value={answers.drugAllergies} onChange={(v) => set({ drugAllergies: v })} detail={answers.drugAllergiesDetail} onDetail={(v) => set({ drugAllergiesDetail: v })} />
                <MedGroup label="Current medical conditions" value={answers.medConditions} onChange={(v) => set({ medConditions: v })} detail={answers.medConditionsDetail} onDetail={(v) => set({ medConditionsDetail: v })} />
                <MedGroup label="Past surgeries" value={answers.pastSurgeries} onChange={(v) => set({ pastSurgeries: v })} detail={answers.pastSurgeriesDetail} onDetail={(v) => set({ pastSurgeriesDetail: v })} placeholder="Describe them…" />
                <div className="pt-2">
                  <label className="mb-2 block text-[13px] font-medium text-ink/70">Anything else your physician should know? (optional)</label>
                  <textarea
                    value={answers.additionalNotes ?? ""}
                    onChange={(e) => set({ additionalNotes: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-[#1D437B]"
                    placeholder="Optional"
                  />
                </div>
                <p className="mt-1 flex items-center gap-2 text-[12px] text-ink/55">
                  <ShieldCheck className="h-4 w-4 text-[#1D437B]" /> HIPAA protected.
                </p>
              </ScreenShell>
            )}

            {/* 18 - Phone + state */}
            {current === "phone_state" && (
              <ScreenShell
                title={`${fname || "You"}, {{two last things}} and your results are ready.`}
                sub="Used only for physician communication and delivery."
                footer={<PrimaryButton onClick={next} disabled={!answers.phone || !answers.state}>Get my results →</PrimaryButton>}
              >
                <PhoneField label="Phone number" value={answers.phone ?? ""} onChange={(v) => set({ phone: v })} />
                <StateSelect label="Shipping state" value={answers.state ?? ""} onChange={(v) => set({ state: v })} states={US_STATES} />
              </ScreenShell>
            )}

            {/* Loading with 3 questions */}
            {current === "loading" && (
              <LoadingScreen
                firstName={answers.firstName}
                state={answers.state}
                goalWeight={answers.goalWeight}
                onDone={() => (window.location.href = "/sales/trimrx")}
                answers={{ q1: answers.q1, q2: answers.q2, q3: answers.q3 }}
                setQ={(k, v) => set({ [k]: v } as Partial<Answers>)}
              />
            )}

            {/* Terminal - Under 18 */}
            {current === "blocked_minor" && (
              <div className="mx-auto max-w-[560px] py-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">Age requirement</div>
                <h1 className="mt-5 font-serif text-[32px] md:text-[40px] font-semibold leading-[1.1] text-ink">You need to be 18 or older to continue.</h1>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/70">Blissley programs are prescription-only and available to adults 18+.</p>
                <div className="mt-8"><PrimaryButton onClick={() => (window.location.href = "/")}>Return home</PrimaryButton></div>
              </div>
            )}

            {/* Terminal - Pregnancy waitlist */}
            {current === "blocked_pregnancy" && (
              <div className="mx-auto max-w-[560px] py-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#ee7273]/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ee7273]">Safety first</div>
                <h1 className="mt-5 font-serif text-[32px] md:text-[40px] font-semibold leading-[1.1] text-ink">GLP-1 isn't safe during pregnancy or nursing.</h1>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/70">We'd love to help when the time is right. We'll reach out when you're eligible - no follow-up until then.</p>
                <div className="mt-8"><PrimaryButton onClick={() => (window.location.href = "/")}>Notify me when I'm eligible →</PrimaryButton></div>
              </div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═════════════ Sub-components ═════════════ */
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white px-3 py-3 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</div>
      <div className="mt-1 text-[16px] font-semibold text-ink">{value}</div>
    </div>
  );
}

function MedGroup({
  label, value, onChange, detail, onDetail, placeholder,
}: {
  label: string;
  value?: YesNo;
  onChange: (v: YesNo) => void;
  detail?: string;
  onDetail: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="border-t border-ink/8 pt-4 first:border-0 first:pt-0">
      <div className="mb-2 text-[14.5px] font-semibold text-ink">{label}</div>
      <YesNoWithDetail value={value} onChange={onChange} detail={detail} onDetail={onDetail} detailPlaceholder={placeholder ?? "List them…"} />
    </div>
  );
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming",
];

/* Story screen (before/after) */
function StoryScreen({
  quote, name, result, before, after, onNext,
}: {
  quote: string; name: string; result: string; before: string; after: string; onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-[640px] flex-col"
    >
      <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" /> Real patient story
      </span>
      <h2 className="mt-4 font-hero text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[36px]">{name} took control.</h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 grid grid-cols-2 gap-2 md:gap-3"
      >
        {[{ url: before, label: "Before" }, { url: after, label: "After" }].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-[10px] bg-[#F3F2EE]">
            <div className="aspect-[3/5] w-full md:aspect-[4/6]">
              <img src={s.url} alt="" className="h-full w-full object-cover object-center" style={{ transform: "scale(1.12)" }} />
            </div>
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" /> {s.label}
            </span>
          </div>
        ))}
      </motion.div>
      <div className="mt-6 flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#ee7273"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        ))}
      </div>
      <p className="mt-3 text-[16.5px] leading-[1.55] text-ink/85 md:text-[18px]">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
        <div className="flex items-center gap-2">
          <img src={verifiedCheck.url} alt="" className="h-5 w-5" />
          <span className="text-[14.5px] font-medium text-ink">{name}</span>
        </div>
        <span className="text-[13px] font-semibold" style={{ color: NAVY }}>{result}</span>
      </div>
      <div className="mt-8"><PrimaryButton onClick={onNext}>Continue →</PrimaryButton></div>
    </motion.div>
  );
}

/* ═════════════ Metabolic uptrend curve (belief slide) ═════════════ */
function MetabolicChart({
  start,
  goal,
  firstName,
}: {
  start?: number;
  goal?: number;
  firstName?: string;
}) {
  // Derive a personalized "metabolic reset" curve from the user's answers.
  // Bigger deficit → steeper climb; small deficit → gentle rise.
  const s = Number.isFinite(start) && (start as number) > 0 ? (start as number) : 210;
  const g = Number.isFinite(goal) && (goal as number) > 0 && (goal as number) < s ? (goal as number) : Math.max(120, s - 25);
  const loss = Math.max(5, s - g);
  // Peak of curve scales 55 → 96 as loss goes 5 → 80 lbs
  const peak = Math.round(55 + Math.min(41, (loss / 80) * 41));
  const baseline = 22;

  // Month labels — start from current month, 7 points
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const months = Array.from({ length: 7 }, (_, i) => monthNames[(now.getMonth() + i) % 12]);

  // Higher-highs / higher-lows: base easing + wobble
  const N = months.length;
  const wave = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const eased = Math.pow(t, 0.85); // gently accelerating up
    const wobble = Math.sin(t * Math.PI * 2.4) * 3.2 * (1 - t * 0.5);
    return Math.max(baseline, Math.min(100, baseline + (peak - baseline) * eased + wobble));
  });

  const W = 720, H = 300, padL = 72, padR = 44, padT = 44, padB = 54;
  const xAt = (i: number) => padL + (i / (N - 1)) * (W - padL - padR);
  const yAt = (v: number) => padT + (1 - v / 100) * (H - padT - padB);

  // Smooth Catmull-Rom → cubic Bezier
  let path = `M ${xAt(0)} ${yAt(wave[0])}`;
  for (let i = 0; i < N - 1; i++) {
    const p0 = wave[i - 1] ?? wave[i];
    const p1 = wave[i];
    const p2 = wave[i + 1];
    const p3 = wave[i + 2] ?? p2;
    const x1 = xAt(i) + (xAt(i + 1) - xAt(Math.max(0, i - 1))) / 6;
    const y1 = yAt(p1) + (yAt(p2) - yAt(p0)) / 6;
    const x2 = xAt(i + 1) - (xAt(Math.min(N - 1, i + 2)) - xAt(i)) / 6;
    const y2 = yAt(p2) - (yAt(p3) - yAt(p1)) / 6;
    path += ` C ${x1} ${y1}, ${x2} ${y2}, ${xAt(i + 1)} ${yAt(p2)}`;
  }

  const areaPath = `${path} L ${xAt(N - 1)} ${H - padB} L ${xAt(0)} ${H - padB} Z`;
  const chartKey = `${s}-${g}`; // re-run animations when inputs change

  return (
    <motion.div
      key={chartKey}
      initial={{ opacity: 0, y: -12, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Personalized caption */}
      <div className="mb-3 flex items-baseline justify-between px-1">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/60">
          {firstName ? `${firstName}'s` : "Your"} metabolic reset
        </div>
        <div className="text-[13px] font-semibold text-[#ee7273]">
          -{loss} lbs projected
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <defs>
          <linearGradient id="mReset" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ee7273" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ee7273" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* dashed baselines */}
        <line x1={padL} x2={W - padR} y1={yAt(baseline)} y2={yAt(baseline)} stroke="#171717" strokeOpacity="0.16" strokeDasharray="6 8" />
        <line x1={padL} x2={W - padR} y1={yAt(peak)} y2={yAt(peak)} stroke="#171717" strokeOpacity="0.16" strokeDasharray="6 8" />

        {/* y-axis labels */}
        <text x={padL - 14} y={yAt(baseline) + 5} textAnchor="end" style={{ fontSize: 14, fontWeight: 600, fill: "#171717" }}>Today</text>
        <text x={padL - 14} y={yAt(peak) + 5} textAnchor="end" style={{ fontSize: 14, fontWeight: 600, fill: "#171717" }}>Reset</text>

        {/* filled area under curve */}
        <motion.path d={areaPath} fill="url(#mReset)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.9 }} />

        {/* smooth wavy curve */}
        <motion.path
          d={path}
          stroke="#ee7273"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* endpoint dots + halo on the goal */}
        <motion.circle cx={xAt(0)} cy={yAt(wave[0])} r={8} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 18 }} />
        <motion.circle cx={xAt(N - 1)} cy={yAt(wave[N - 1])} r={14} fill="#ee7273" fillOpacity={0.18} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, duration: 0.5 }} />
        <motion.circle cx={xAt(N - 1)} cy={yAt(wave[N - 1])} r={9} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.7, type: "spring", stiffness: 260, damping: 18 }} />

        {/* goal weight callout above end dot */}
        <motion.text
          x={xAt(N - 1)}
          y={yAt(wave[N - 1]) - 22}
          textAnchor="end"
          initial={{ opacity: 0, y: yAt(wave[N - 1]) - 12 }}
          animate={{ opacity: 1, y: yAt(wave[N - 1]) - 22 }}
          transition={{ delay: 1.85, duration: 0.5 }}
          style={{ fontSize: 15, fontWeight: 700, fill: "#171717" }}
        >
          {g} lbs
        </motion.text>

        {/* start weight callout above start dot */}
        <motion.text
          x={xAt(0)}
          y={yAt(wave[0]) - 18}
          textAnchor="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ fontSize: 13, fontWeight: 600, fill: "#171717", opacity: 0.7 }}
        >
          {s} lbs
        </motion.text>

        {/* month labels */}
        {months.map((m, i) => (
          <text key={`${m}-${i}`} x={xAt(i)} y={H - 14} textAnchor="middle" style={{ fontSize: 13, fontWeight: 500, fill: "#171717", opacity: 0.65 }}>{m}</text>
        ))}
      </svg>
    </motion.div>
  );
}



/* ═════════════ Weight-loss projection (personalized) ═════════════ */
function WeightLossChart({ start, goal }: { start: number; goal: number }) {
  const s = Math.max(120, Math.min(500, isFinite(start) && start > 0 ? start : 210));
  const g = isFinite(goal) && goal > 0 && goal < s ? goal : Math.max(120, s - 23);
  const lossLbs = Math.round(s - g);
  const pctLoss = ((lossLbs / s) * 100).toFixed(1);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const N = 7;
  const months = Array.from({ length: N }, (_, i) => monthNames[(now.getMonth() + i) % 12]);

  // Gentle stepped downtrend with soft plateaus (matches reference)
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

  // Smooth Catmull-Rom → cubic Bezier
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

  const chartKey = `${s}-${g}`;

  return (
    <motion.div
      key={chartKey}
      initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Header caption */}
      <div className="mb-3 flex items-baseline justify-between px-1">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/60">
          Your projected trajectory
        </div>
        <div className="text-[13px] font-semibold text-[#ee7273]">
          -{lossLbs} lbs · {pctLoss}% body weight
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        {/* Baselines */}
        <line x1={padL} x2={W - padR} y1={yAt(s)} y2={yAt(s)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="6 8" />
        <line x1={padL} x2={W - padR} y1={yAt(g)} y2={yAt(g)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="6 8" />

        {/* Y-axis labels — start & goal only */}
        <text x={padL - 16} y={yAt(s) + 5} textAnchor="end" style={{ fontSize: 16, fontWeight: 600, fill: "#171717" }}>{Math.round(s)} lbs</text>
        <text x={padL - 16} y={yAt(g) + 5} textAnchor="end" style={{ fontSize: 16, fontWeight: 600, fill: "#171717" }}>{Math.round(g)} lbs</text>

        {/* Curve */}
        <motion.path
          d={path}
          fill="none"
          stroke="#ee7273"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Start dot */}
        <motion.circle cx={xAt(0)} cy={yAt(points[0])} r={9} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 18 }} />

        {/* End dot */}
        <motion.circle cx={xAt(N - 1)} cy={yAt(points[N - 1])} r={10} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0, type: "spring", stiffness: 220, damping: 16 }} />

        {/* Month labels */}
        {months.map((m, i) => (
          <text key={`${m}-${i}`} x={xAt(i)} y={H - 14} textAnchor="middle" style={{ fontSize: 14, fontWeight: 500, fill: "#171717", opacity: 0.55 }}>{m}</text>
        ))}
      </svg>
    </motion.div>
  );
}


/* ═════════════ Loading with 3 qualifying questions — iOS full-bleed ═════════════ */
type YN = "yes" | "no" | string;

function LoadingScreen({
  firstName, state, goalWeight, onDone, setQ,
}: {
  firstName?: string;
  state?: string;
  goalWeight?: string;
  onDone: () => void;
  answers: { q1?: YesNo; q2?: string; q3?: string };
  setQ: (k: "q1" | "q2" | "q3", v: string) => void;
}) {
  // 1..3 = questions, 4 = finalizing (calc intro removed)
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);


  const initialSteps = useMemo(
    () => [
      "Calculating your weight loss timeline…",
      "Analyzing your metabolic profile…",
      `Checking physician availability in ${state || "your state"}…`,
    ],
    [state],
  );

  // initial steps kept for potential future intro; currently unused
  void initialSteps;


  useEffect(() => {
    if (phase !== 4) return;
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  const questions: Array<{
    kicker: string;
    title: string;
    options: string[];
    key: "q1" | "q2" | "q3";
    bg: string;
    align: "bottom" | "bottom";
  }> = [
    {
      kicker: "While we finalize your plan",
      title: `Are you determined to finally reach ${goalWeight || "your goal"} lbs?`,
      options: ["Yes, I'm ready", "Not sure yet"],
      key: "q1",
      bg: qBg1.url,
      align: "bottom",
    },
    {
      kicker: "Almost there",
      title: "Did you know metabolism — not willpower — is behind most weight struggles?",
      options: ["I do now", "That's surprising"],
      key: "q2",
      bg: qBg2.url,
      align: "bottom",
    },
    {
      kicker: "Last one",
      title: "Would a physician-supervised program that works with your body feel right?",
      options: ["Yes, that's me", "Tell me more"],
      key: "q3",
      bg: qBg3.url,
      align: "bottom",
    },
  ];

  const pick = (k: "q1" | "q2" | "q3", v: string) => {
    setQ(k, v);
    setTimeout(() => setPhase((p) => (p + 1) as 1 | 2 | 3 | 4), 320);
  };

  const totalPhases = 5;
  const barPct = phase === 4 ? 100 : (phase / 3) * 96;


  const activeQ = phase >= 1 && phase <= 3 ? questions[phase - 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-hidden bg-black"
    >
      {/* Calc intro removed — jump straight to full-bleed questions */}


      {/* Phases 1–3 — full-bleed portrait with iOS card at bottom */}
      <AnimatePresence mode="wait">
        {activeQ && (
          <motion.div
            key={`q-${phase}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* Full background image with slow Ken-Burns */}
            <motion.img
              src={activeQ.bg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1.14 }}
              transition={{ duration: 9, ease: "linear" }}
            />
            {/* Bottom fade for card legibility (images already carry blur, this is extra safety) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

            {/* Top: logo + progress */}
            <div className="absolute inset-x-0 top-0 z-10 px-6 pt-8">
              <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4">
                <img src={blissleyWhite.url} alt="Blissley" className="h-7 w-auto drop-shadow" />
                <div className="flex w-full items-center gap-1.5">
                  {Array.from({ length: totalPhases - 1 }).map((_, i) => {
                    const done = i < phase;
                    return (
                      <div
                        key={i}
                        className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-white"
                          initial={{ width: done ? "100%" : "0%" }}
                          animate={{ width: done ? "100%" : i === phase - 1 ? "100%" : "0%" }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom: iOS card */}
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 md:pb-10">
              <motion.div
                key={`card-${phase}`}
                initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
                className="mx-auto w-full max-w-[440px] text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 drop-shadow"
                >
                  {activeQ.kicker}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-2.5 font-hero text-[22px] font-semibold leading-[1.2] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:text-[26px]"
                >
                  {activeQ.title}
                </motion.h3>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {activeQ.options.map((v, i) => (
                    <motion.button
                      key={v}
                      onClick={() => pick(activeQ.key, v)}
                      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ y: -2 }}
                      className="group relative h-[54px] overflow-hidden rounded-full border border-white/40 bg-white/15 text-[14.5px] font-semibold text-white backdrop-blur-2xl transition-all hover:bg-white/25"
                      style={{ WebkitBackdropFilter: "blur(24px)" }}
                    >
                      <span className="relative z-10">{v}</span>
                    </motion.button>
                  ))}
                </div>

                {/* dots */}
                <div className="mt-5 flex items-center justify-center gap-1.5">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: n === phase ? 22 : 6,
                        background: n <= phase ? "#ffffff" : "rgba(255,255,255,0.45)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4 — final handoff */}
      <AnimatePresence>
        {phase === 4 && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1D437B] via-[#295a9a] to-[#ee7273]" />
            <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur-xl"
              >
                <Check className="h-8 w-8 text-white" strokeWidth={3} />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-5 font-hero text-[24px] font-bold text-white md:text-[30px]"
              >
                Your program is ready{firstName ? `, ${firstName}` : ""}.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-2 text-[14.5px] text-white/80"
              >
                Taking you to your plan…
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

