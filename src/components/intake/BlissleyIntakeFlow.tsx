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
  ArrowLeft,
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
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import blissleyWhite from "@/assets/blissley-white.png.asset.json";
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


/* ═════════════ Types ═════════════ */
type Sex = "female" | "male";
type YesNo = "yes" | "no";
type Answers = {
  heightFt?: string;
  heightIn?: string;
  weightLbs?: string;
  goalWeight?: string;
  firstName?: string;
  email?: string;
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
};

/* ═════════════ Header (Blissley only) ═════════════ */
function Header({ onBack, showBack }: { onBack: () => void; showBack: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[1080px] px-4 py-4 md:px-8 md:py-6">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink md:left-4"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="mx-auto flex items-center justify-center">
        <img src={blissleyLogo.url} alt="Blissley" className="block h-9 w-auto sm:h-11 md:h-12" />
      </div>
    </div>
  );
}

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

/* ═════════════ Main ═════════════ */
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
  const isTerminal = current === "loading" || current === "blocked_minor" || current === "blocked_pregnancy";
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
          <Header onBack={prev} showBack={idx > 0} />
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
                  <div className="absolute right-4 top-4 md:right-6 md:top-6 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                    As seen in Forbes · WebMD · Yahoo Health
                  </div>
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

                  {bmi !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-1 rounded-2xl border px-4 py-3.5 text-[14.5px] font-medium ${
                        bmi >= 27
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : bmi >= 25
                          ? "border-amber-200 bg-amber-50 text-amber-900"
                          : "border-ink/10 bg-ink/[0.03] text-ink/80"
                      }`}
                    >
                      {bmi >= 27 && <>✅ BMI {bmi} - You qualify. Let's go.</>}
                      {bmi >= 25 && bmi < 27 && <>🔶 BMI {bmi} - Your physician will review.</>}
                      {bmi < 25 && <>BMI {bmi} - Our program is typically for BMI 27+. A physician will still review your case.</>}
                    </motion.div>
                  )}
                </ScreenShell>
              </>
            )}

            {/* 2 - Name + email */}
            {current === "lead" && (
              <ScreenShell
                title="Great. Let's build your {{personalized program.}}"
                sub="First we'll capture the basics so we can email your results."
                footer={
                  <PrimaryButton onClick={next} disabled={!answers.firstName || !answers.email || !answers.consent}>
                    Continue →
                  </PrimaryButton>
                }
              >
                <TextField label="First name" value={answers.firstName ?? ""} onChange={(v) => set({ firstName: v })} placeholder="Jane" />
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
                <MetabolicChart />
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
                before={answers.sex === "male" ? spMaleBefore.url : daieneBefore.url}
                after={answers.sex === "male" ? spMaleAfter.url : daieneAfter.url}
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
                        <div className="mt-3 flex items-center gap-2 text-[13px] text-white/95">
                          <span className="rounded-md bg-white px-2 py-1 font-semibold text-[#1D437B]">9.8</span>
                          <span className="font-medium">Exceptional</span>
                        </div>
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
              return (
                <ScreenShell
                  title="A few more {{health questions.}}"
                  sub="These conditions often make you a stronger candidate - GLP-1 directly improves them."
                  footer={<PrimaryButton onClick={next} disabled={!(answers.healthConditions && answers.healthConditions.length)}>Next →</PrimaryButton>}
                >
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
                onDone={() => (window.location.href = "/weight-loss/sales")}
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

/* ═════════════ Metabolic S-curve (belief slide) ═════════════ */
function MetabolicChart() {
  const N = 120;
  const samples = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const s = 1 / (1 + Math.exp(-10 * (t - 0.45)));
    return { t, v: s };
  });
  const W = 720, H = 300, padL = 44, padR = 28, padT = 32, padB = 44;
  const xAt = (t: number) => padL + t * (W - padL - padR);
  const yAt = (v: number) => padT + (1 - v) * (H - padT - padB);
  const path = samples.reduce((acc, s, i) => {
    const x = xAt(s.t), y = yAt(s.v);
    if (i === 0) return `M ${x} ${y}`;
    const p = samples[i - 1];
    const pX = xAt(p.t), pY = yAt(p.v);
    const cx = pX + (x - pX) * 0.5;
    return `${acc} C ${cx} ${pY}, ${cx} ${y}, ${x} ${y}`;
  }, "");
  return (
    <motion.div
      initial={{ opacity: 0, y: -14, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <defs>
          <linearGradient id="mFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ee7273" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ee7273" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.15, 0.5, 0.85].map((v, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={yAt(v)} y2={yAt(v)} stroke="#1D437B" strokeOpacity="0.14" strokeDasharray="5 7" />
        ))}
        <text x={padL + 8} y={padT + 20} style={{ fontSize: 13, fontWeight: 600, fill: "#171717" }}>Metabolic reset</text>
        <motion.path d={`${path} L ${xAt(1)} ${H - padB} L ${xAt(0)} ${H - padB} Z`} fill="url(#mFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} />
        <motion.path d={path} stroke="#ee7273" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
        <motion.circle cx={xAt(1)} cy={yAt(1)} r={7} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 18 }} />
      </svg>
    </motion.div>
  );
}

/* ═════════════ Weight-loss projection ═════════════ */
function WeightLossChart({ start, goal }: { start: number; goal: number }) {
  const s = Math.max(120, Math.min(500, isFinite(start) && start > 0 ? start : 210));
  const g = isFinite(goal) && goal > 0 && goal < s ? goal : Math.max(120, s - 23);
  const lossLbs = Math.round(s - g);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const months = Array.from({ length: 7 }, (_, i) => monthNames[(now.getMonth() + i) % 12]);
  const points = months.map((_, i) => {
    const t = i / (months.length - 1);
    const eased = 1 - Math.pow(1 - t, 2.4);
    return s - lossLbs * eased;
  });
  const W = 640, H = 300, padL = 64, padR = 28, padT = 28, padB = 44;
  const xAt = (i: number) => padL + (i / (months.length - 1)) * (W - padL - padR);
  const yAt = (v: number) => {
    const min = g - 4, max = s + 4;
    return padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  };
  const path = points.reduce((acc, v, i) => {
    const x = xAt(i), y = yAt(v);
    if (i === 0) return `M ${x} ${y}`;
    const pX = xAt(i - 1), pY = yAt(points[i - 1]);
    const cx = pX + (x - pX) * 0.5;
    return `${acc} C ${cx} ${pY}, ${cx} ${y}, ${x} ${y}`;
  }, "");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <line x1={padL} x2={W - padR} y1={yAt(s)} y2={yAt(s)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="5 6" />
        <line x1={padL} x2={W - padR} y1={yAt(g)} y2={yAt(g)} stroke="#171717" strokeOpacity="0.18" strokeDasharray="5 6" />
        <text x={padL - 12} y={yAt(s) + 4} textAnchor="end" className="fill-ink/70" style={{ fontSize: 13, fontWeight: 500 }}>{Math.round(s)} lbs</text>
        <text x={padL - 12} y={yAt(g) + 4} textAnchor="end" className="fill-ink/70" style={{ fontSize: 13, fontWeight: 500 }}>{Math.round(g)} lbs</text>
        <motion.path d={path} fill="none" stroke="#ee7273" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
        <motion.circle cx={xAt(0)} cy={yAt(s)} r={8} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 18 }} />
        <motion.circle cx={xAt(months.length - 1)} cy={yAt(g)} r={9} fill="#ee7273" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.7, type: "spring", stiffness: 220, damping: 16 }} />
        {months.map((m, i) => (
          <text key={`${m}-${i}`} x={xAt(i)} y={H - 14} textAnchor="middle" className="fill-ink/60" style={{ fontSize: 12, fontWeight: 500 }}>{m}</text>
        ))}
      </svg>
    </motion.div>
  );
}

/* ═════════════ Loading with 3 qualifying questions ═════════════ */
function LoadingScreen({
  firstName, state, goalWeight, onDone, answers, setQ,
}: {
  firstName?: string;
  state?: string;
  goalWeight?: string;
  onDone: () => void;
  answers: { q1?: YesNo; q2?: string; q3?: string };
  setQ: (k: "q1" | "q2" | "q3", v: string) => void;
}) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0); // 0=steps, 1=q1, 2=q2, 3=q3, 4=finalizing
  const [step, setStep] = useState(0);
  const initialSteps = useMemo(
    () => [
      "Calculating your weight loss timeline...",
      "Analyzing your metabolic profile...",
      `Checking physician availability in ${state || "your state"}...`,
    ],
    [state],
  );

  useEffect(() => {
    if (phase !== 0) return;
    if (step >= initialSteps.length) {
      const t = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [phase, step, initialSteps.length]);

  useEffect(() => {
    if (phase !== 4) return;
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  const barPct = phase === 0 ? Math.min(60, ((step + 1) / initialSteps.length) * 60) : phase === 1 ? 70 : phase === 2 ? 82 : phase === 3 ? 94 : 100;

  const pickQ = (k: "q1" | "q2" | "q3", v: string) => {
    setQ(k, v);
    setTimeout(() => setPhase((p) => (p + 1) as 1 | 2 | 3 | 4), 350);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D437B] via-[#295a9a] to-[#ee7273]" />
      <motion.div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-white/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="absolute -right-40 bottom-1/4 h-[560px] w-[560px] rounded-full bg-[#ffd7c0]/25 blur-[130px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity }} />

      <div className="relative z-10 flex items-center justify-center pt-10">
        <img src={blissleyWhite.url} alt="Blissley" className="h-8 w-auto" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-100px)] w-full max-w-[560px] flex-col items-center justify-center px-6 text-center">
        <h2 className="font-hero text-[24px] font-bold tracking-[-0.02em] text-white md:text-[30px]">
          Building {firstName ? `${firstName}'s` : "your"} personalized protocol...
        </h2>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${barPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {phase === 0 && (
          <div className="mt-6 w-full space-y-2 text-left">
            {initialSteps.slice(0, step + 1).map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[14.5px] text-white/95">
                <Check className="h-4 w-4 shrink-0" /> {s}
              </motion.div>
            ))}
          </div>
        )}

        {phase >= 1 && phase <= 3 && (
          <motion.div key={phase} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.4 }} className="mt-8 w-full">
            {phase === 1 && (
              <>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">While we finalize your plan</div>
                <div className="mt-2 font-hero text-[20px] font-semibold text-white md:text-[24px]">Are you determined to finally reach {goalWeight || "your goal"} lbs?</div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {["Yes", "No"].map((v) => (
                    <button key={v} onClick={() => pickQ("q1", v.toLowerCase())} className="h-[52px] rounded-full bg-white/15 text-[15px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25">{v}</button>
                  ))}
                </div>
              </>
            )}
            {phase === 2 && (
              <>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Almost there</div>
                <div className="mt-2 font-hero text-[20px] font-semibold text-white md:text-[24px]">Did you know metabolism - not willpower - is the root cause of weight struggles for most people?</div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {["Yes", "Not sure"].map((v) => (
                    <button key={v} onClick={() => pickQ("q2", v)} className="h-[52px] rounded-full bg-white/15 text-[15px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25">{v}</button>
                  ))}
                </div>
              </>
            )}
            {phase === 3 && (
              <>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Last one</div>
                <div className="mt-2 font-hero text-[20px] font-semibold text-white md:text-[24px]">Would a physician-supervised program that works with your metabolism sound right for you?</div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {["Yes", "Maybe"].map((v) => (
                    <button key={v} onClick={() => pickQ("q3", v)} className="h-[52px] rounded-full bg-white/15 text-[15px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25">{v}</button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {phase === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-white">
            <div className="flex items-center justify-center gap-2 text-[14.5px]"><Check className="h-4 w-4" /> Personalizing your program...</div>
            <div className="mt-4 font-hero text-[22px] font-bold md:text-[26px]">Your program is ready{firstName ? `, ${firstName}` : ""}.</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
