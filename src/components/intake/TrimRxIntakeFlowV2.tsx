import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  Moon,
  Frown,
  BedDouble,
  TrendingDown,
  Scissors,
  Sparkles,
  Brain,
  X as XIcon,
  Trophy,
  ShieldCheck,
  Scale as ScaleIcon,
} from "lucide-react";
import { StateSelect } from "./primitives";
import {
  TrxButton as PrimaryButton,
  TrxOption as OptionCard,
  TrxIconOption,
  TrxField as TextField,
  TrxScreen as ScreenShell,
  TrxStepper,
  TrxHeader,
} from "./TrxUI";
import spFemaleBefore from "@/assets/sp-female-before.png.asset.json";
import spFemaleAfter from "@/assets/sp-female-after.png.asset.json";
import spMaleBefore from "@/assets/sp-male-before.png.asset.json";
import spMaleAfter from "@/assets/sp-male-after.png.asset.json";
import trxHeroImg from "@/assets/trx-hero-woman.png.asset.json";
import verifiedCheck from "@/assets/verified-check.png.asset.json";
import review22 from "@/assets/review-22.png.asset.json";
import review27 from "@/assets/review-27.png.asset.json";

/* ────────────  Types  ──────────── */
type Sex = "female" | "male";

type Answers = {
  heightFt?: string;
  heightIn?: string;
  weightLbs?: string;
  goalWeight?: string;
  sex?: Sex;
  safety?: string[];
  femaleEffects?: string[];
  priority?: string;
  pace?: string;
  motivationReason?: string;
  sleepQuality?: string;
  sleepHours?: string;
  contra?: string[];
  moreConditions?: string[];
  glp1History?: string;
  opiate?: "yes" | "no";
  opiateDetail?: string;
  priorSurgery?: "yes" | "no";
  priorSurgeryDetail?: string;
  priorProgram?: "yes" | "no";
  priorProgramDetail?: string;
  willingTo?: string[];
  weightChange?: string;
  restingHR?: string;
  bloodPressure?: string;
  affordability?: string;
  currentMeds?: "yes" | "no";
  currentMedsDetail?: string;
  motivationLevel?: string;
  additionalInfo?: "yes" | "no";
  additionalInfoDetail?: string;
  personalization?: string[];
  firstName?: string;
  lastName?: string;
  state?: string;
};

const SCREENS = [
  "hw",                  // 0  Start
  "bmi_goal",            // 1  Preliminary
  "sex",                 // 2
  "safety",              // 3
  "female_effects",      // 4 (female only)
  "priority",            // 5
  "ranked",              // 6
  "metabolic_science",   // 7
  "tania_story",         // 8
  "glp1_curve",          // 9
  "pace",                // 10 Health
  "motivation_reason",   // 11
  "sleep_quality",       // 12
  "sleep_hours",         // 13
  "kristin_story",       // 14
  "contra",              // 15
  "more_conditions",     // 16
  "glp1_history",        // 17 Details
  "opiate",              // 18
  "prior_surgery",       // 19
  "prior_program",       // 20
  "willing_to",          // 21
  "weight_change",       // 22
  "daiene_story",        // 23
  "resting_hr",          // 24
  "blood_pressure",      // 25
  "affordability",       // 26
  "current_meds",        // 27
  "motivation_level",    // 28
  "additional_info",     // 29
  "personalization",     // 30
  "eligibility",         // 31 Eligibility
  "loading",             // 32
] as const;

type ScreenId = (typeof SCREENS)[number];


function stageOf(idx: number, sex?: Sex): number {
  // Trim female_effects (idx 4) if not female, shift accordingly by using screen id instead
  const id = SCREENS[idx];
  if (id === "hw") return 0;
  if (
    ["bmi_goal", "sex", "safety", "female_effects", "priority", "ranked", "metabolic_science", "tania_story", "glp1_curve"].includes(id as string)
  )
    return 1;
  if (["pace", "motivation_reason", "sleep_quality", "sleep_hours", "kristin_story", "contra", "more_conditions"].includes(id as string))
    return 2;
  if (id === "eligibility" || id === "loading") return 4;
  return 3;
}

/* IconOption is now provided by TrxUI (TrxIconOption). Alias kept for callsites. */
const IconOption = TrxIconOption;

/* ────────────  Yes/No + optional detail  ──────────── */
function YesNoWithDetail({
  value,
  onChange,
  detail,
  onDetail,
  detailPlaceholder,
}: {
  value?: "yes" | "no";
  onChange: (v: "yes" | "no") => void;
  detail?: string;
  onDetail?: (v: string) => void;
  detailPlaceholder?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {(["yes", "no"] as const).map((v) => (
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
            {v}
          </button>
        ))}
      </div>
      {value === "yes" && onDetail && (
        <motion.textarea
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          value={detail ?? ""}
          onChange={(e) => onDetail(e.target.value)}
          placeholder={detailPlaceholder ?? "Please add brief details…"}
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-[#1D437B] focus:shadow-[0_0_0_3px_rgba(29,67,123,0.12)]"
        />
      )}
    </>
  );
}

/* ────────────  Main  ──────────── */
export function TrimRxIntakeFlowV2() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const set = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => {
    setIdx((i) => {
      let n = Math.min(SCREENS.length - 1, i + 1);
      // Skip female_effects for males
      if (SCREENS[n] === "female_effects" && answers.sex !== "female") n = n + 1;
      return n;
    });
  };
  const prev = () => {
    setIdx((i) => {
      let n = Math.max(0, i - 1);
      if (SCREENS[n] === "female_effects" && answers.sex !== "female") n = n - 1;
      return n;
    });
  };
  const pickThenNext = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    set({ [key]: value } as Partial<Answers>);
    setTimeout(next, 220);
  };
  const toggleMulti = (key: keyof Answers, value: string, none = "None of the above") => {
    setAnswers((a) => {
      const arr = ((a[key] as string[] | undefined) ?? []).slice();
      if (value === none) return { ...a, [key]: arr.includes(none) ? [] : [none] };
      const without = arr.filter((v) => v !== none);
      const exists = without.includes(value);
      const nextArr = exists ? without.filter((v) => v !== value) : [...without, value];
      return { ...a, [key]: nextArr };
    });
  };

  const current: ScreenId = SCREENS[idx];
  const stage = stageOf(idx, answers.sex);
  const isLoading = current === "loading";

  const bmi = useMemo(() => {
    const ft = parseFloat(answers.heightFt || "0");
    const inch = parseFloat(answers.heightIn || "0");
    const w = parseFloat(answers.weightLbs || "0");
    const totalIn = ft * 12 + inch;
    if (!totalIn || !w) return null;
    return +(703 * (w / (totalIn * totalIn))).toFixed(2);
  }, [answers.heightFt, answers.heightIn, answers.weightLbs]);

  // Pace math
  const paceCalc = useMemo(() => {
    const start = parseFloat(answers.weightLbs || "0");
    const goal = parseFloat(answers.goalWeight || "0");
    if (!start || !goal || goal >= start) return null;
    const lbsPerWeekLow = Math.max(1.2, +(start * 0.014).toFixed(2));
    const lbsPerWeekHigh = +(lbsPerWeekLow * 1.11).toFixed(2);
    const weeks = +((start - goal) / lbsPerWeekLow).toFixed(1);
    return { lbsPerWeekLow, lbsPerWeekHigh, weeks, start, goal };
  }, [answers.weightLbs, answers.goalWeight]);

  useEffect(() => {
    if (current !== "loading") return;
    try {
      sessionStorage.setItem(
        "blissley_intake_trimrx",
        JSON.stringify({ ...answers, bmi }),
      );
    } catch {}
    const t = setTimeout(() => {
      window.location.href = "/weight-loss/sales";
    }, 3800);
    return () => clearTimeout(t);
  }, [current, answers, bmi]);

  return (
    <div className="relative min-h-[100svh] bg-white pb-24">
      {!isLoading && (
        <div
          className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl"
          style={{ borderColor: "rgba(23,23,23,0.08)" }}
        >
          <TrxHeader onBack={prev} showBack={idx > 0} />
          <div className="px-4 py-3 md:px-8 md:py-4">
            <TrxStepper stage={stage} />
          </div>
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col px-5 pt-10 md:px-8 md:pt-14">
        <AnimatePresence mode="wait">
          <div key={current} className="flex flex-col">

            {/* 0, Height & Weight */}
            {current === "hw" && (
              <ScreenShell
                title="Reach your goal weight fast, {{without restrictive diets and exercise.}}"
                sub="Let's calculate your BMI to make sure you're a good candidate for medical weight loss."
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={!answers.heightFt || !answers.heightIn || !answers.weightLbs}
                  >
                    Next →
                  </PrimaryButton>
                }
              >
                <label className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                  What is your height and weight?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Feet"
                    type="number"
                    value={answers.heightFt ?? ""}
                    onChange={(v) => set({ heightFt: v })}
                    placeholder="5"
                  />
                  <TextField
                    label="Inches"
                    type="number"
                    value={answers.heightIn ?? ""}
                    onChange={(v) => set({ heightIn: v })}
                    placeholder="6"
                  />
                </div>
                <TextField
                  label="Weight (in lbs)"
                  type="number"
                  value={answers.weightLbs ?? ""}
                  onChange={(v) => set({ weightLbs: v })}
                  placeholder="250"
                />
              </ScreenShell>
            )}

            {/* 1, BMI reveal + goal weight */}
            {current === "bmi_goal" && (
              <ScreenShell
                title={bmi ? `Perfect! With a BMI of ${bmi}, we can continue.` : "Great, let's set your goal."}
                sub="We're in this together. Your goal is our goal."
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={!answers.goalWeight || parseFloat(answers.goalWeight) >= parseFloat(answers.weightLbs || "0")}
                  >
                    Next →
                  </PrimaryButton>
                }
              >
                <div className="rounded-2xl border border-[#1D437B]/15 bg-[#1D437B]/[0.04] p-5">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-[#1D437B]">
                      <ScaleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/55">Join over 500K success stories</div>
                      <div className="mt-0.5 text-[14px] text-ink/70">Start your journey today</div>
                    </div>
                  </div>
                </div>
                <TextField
                  label="What is your goal weight? (lbs)"
                  type="number"
                  value={answers.goalWeight ?? ""}
                  onChange={(v) => set({ goalWeight: v })}
                  placeholder="155"
                />
                {answers.goalWeight && parseFloat(answers.goalWeight) < parseFloat(answers.weightLbs || "0") && (
                  <div className="inline-flex w-max items-center gap-2 rounded-full bg-ever/10 px-4 py-2 text-[13px] font-semibold text-ever">
                    <TrendingDown className="h-4 w-4" />
                    Target: −{parseFloat(answers.weightLbs!) - parseFloat(answers.goalWeight)} lbs
                  </div>
                )}
              </ScreenShell>
            )}

            {/* 2, Sex */}
            {current === "sex" && (
              <ScreenShell
                title="Are you male or female?"
                sub="This helps us understand your body complexity and hormones so we can assess you better."
              >
                <OptionCard label="Female" selected={answers.sex === "female"} onClick={() => pickThenNext("sex", "female")} />
                <OptionCard label="Male" selected={answers.sex === "male"} onClick={() => pickThenNext("sex", "male")} />
              </ScreenShell>
            )}

            {/* 3, Safety */}
            {current === "safety" && (
              <ScreenShell
                title="Safety, first."
                sub="Do any of these apply to you?"
                footer={<PrimaryButton onClick={next} disabled={!(answers.safety && answers.safety.length)}>Next →</PrimaryButton>}
              >
                {[
                  "Currently or possibly pregnant, or actively trying to become pregnant",
                  "Breastfeeding or bottle-feeding with breastmilk",
                  "Have given birth to a child within the last 6 months",
                  "None of the above",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.safety ?? []).includes(o)}
                    onClick={() => toggleMulti("safety", o, "None of the above")}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 4, Female-specific effects */}
            {current === "female_effects" && (
              <ScreenShell
                title="Women experience {{unique effects}} from weight gain."
                sub="Do you experience any of the following?"
                footer={<PrimaryButton onClick={next} disabled={!(answers.femaleEffects && answers.femaleEffects.length)}>Next →</PrimaryButton>}
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    { label: "Low Libido", icon: <TrendingDown /> },
                    { label: "Hair Loss", icon: <Scissors /> },
                    { label: "Skin Issues", icon: <Sparkles /> },
                    { label: "Cognition Issues", icon: <Brain /> },
                    { label: "None of these", icon: <XIcon /> },
                  ].map((o) => (
                    <IconOption
                      key={o.label}
                      icon={o.icon}
                      label={o.label}
                      selected={(answers.femaleEffects ?? []).includes(o.label)}
                      onClick={() => toggleMulti("femaleEffects", o.label, "None of these")}
                    />
                  ))}
                </div>
              </ScreenShell>
            )}

            {/* 5, Priority */}
            {current === "priority" && (
              <ScreenShell
                title="We can help with all of these, but choose the {{most important for you}}."
                sub="Which of these is your priority?"
              >
                {["Lose Weight", "Gain Muscle", "Maintain My Current Body"].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.priority === o}
                    onClick={() => pickThenNext("priority", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 6, Ranked #1 */}
            {current === "ranked" && (
              <ScreenShell title="Blissley is proud to be ranked #1." footer={<PrimaryButton onClick={next}>Next →</PrimaryButton>}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl border border-ink/8 bg-gradient-to-br from-[#1D437B] to-[#1D437B]/90 p-7 text-white shadow-[0_20px_60px_rgba(29,67,123,0.28)]"
                >
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    <Trophy className="h-4 w-4" /> Best overall
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-[42px] font-bold leading-none">#1</span>
                    <span className="text-[20px] font-semibold">Blissley</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[13px] text-white/85">
                    <span className="rounded-md bg-white/15 px-2 py-0.5 font-semibold">9.8</span>
                    Exceptional · ★★★★★
                  </div>
                  <ul className="mt-5 space-y-2 text-[14px] text-white/90">
                    {[
                      "Personalized GLP-1 protocols for your body",
                      "Physician review within 24 hours",
                      "Includes nausea & side-effect support",
                      "Improves treatment adherence and comfort",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-[#ee7273]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 inline-flex rounded-full bg-ever px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
                    Most popular
                  </div>
                </motion.div>
              </ScreenShell>
            )}

            {/* 7, Metabolic science */}
            {current === "metabolic_science" && (
              <ScreenShell
                title="It feels like magic, but it's {{metabolic science}}."
                sub={`On average, our patients lose over 20% of their body weight. GLP-1 medications are extremely effective, offering a strong path toward your ${answers.goalWeight || "goal"} lb goal.`}
                footer={<PrimaryButton onClick={next}>Next →</PrimaryButton>}
              >
                <MetabolicChart start={parseFloat(answers.weightLbs || "230")} goal={parseFloat(answers.goalWeight || "180")} />
              </ScreenShell>
            )}

            {/* 8, Tania story */}
            {current === "tania_story" && (
              <StoryScreen
                quote="It really does work. Took about 6 weeks to feel it, but once it kicked in, I dropped 20 pounds of fat and haven't looked back."
                name="Tania"
                result="Doubled her confidence · 2 months"
                before={spFemaleBefore.url}
                after={spFemaleAfter.url}
                onNext={next}
              />
            )}

            {/* 9, GLP-1 how it works curve */}
            {current === "glp1_curve" && (
              <ScreenShell
                title="How will {{GLP-1 work}} for you?"
                sub="We identify the root causes of your metabolic issues, so you get a long-term solution, not just a quick fix."
                footer={<PrimaryButton onClick={next}>Next →</PrimaryButton>}
              >
                <GLP1Curve />
                <ul className="mt-4 space-y-2.5 text-[14.5px] text-ink/75">
                  <li><b className="text-ink">Week 1–4:</b> Your body acclimates to GLP-1 medication.</li>
                  <li><b className="text-ink">Week 4–8:</b> Weight loss increases week over week.</li>
                  <li><b className="text-ink">Week 9+:</b> Your body becomes a fat-burning machine.</li>
                </ul>
              </ScreenShell>
            )}

            {/* 10, Pace */}
            {current === "pace" && (
              <ScreenShell
                title="How is that pace for you?"
                sub={
                  paceCalc
                    ? `With medication, you'll lose ${paceCalc.lbsPerWeekLow} to ${paceCalc.lbsPerWeekHigh} lbs per week. It will take about ${paceCalc.weeks} weeks to reach your goal weight of ${paceCalc.goal}.`
                    : "Let's confirm your target pace."
                }
              >
                {["Works for me", "I want it faster", "That's too fast"].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.pace === o} onClick={() => pickThenNext("pace", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 11, Motivation reason */}
            {current === "motivation_reason" && (
              <ScreenShell
                title="Improving your life requires {{motivation}}."
                sub="What is your primary reason for taking weight loss seriously?"
              >
                {[
                  "I want to live longer",
                  "I want to feel and look better",
                  "I want to reduce my current health issues",
                  "All of these",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.motivationReason === o} onClick={() => pickThenNext("motivationReason", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 12, Sleep quality */}
            {current === "sleep_quality" && (
              <ScreenShell
                title="How is your sleep, overall?"
                sub="How you sleep tells us a lot about your cortisol and metabolic efficiency."
              >
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Pretty good", icon: <BedDouble /> },
                    { label: "A bit restless", icon: <Frown /> },
                    { label: "I don't sleep well", icon: <Moon /> },
                  ].map((o) => (
                    <IconOption
                      key={o.label}
                      icon={o.icon}
                      label={o.label}
                      selected={answers.sleepQuality === o.label}
                      onClick={() => pickThenNext("sleepQuality", o.label)}
                    />
                  ))}
                </div>
              </ScreenShell>
            )}

            {/* 13, Sleep hours */}
            {current === "sleep_hours" && (
              <ScreenShell title="How many hours of sleep do you usually get each night?">
                {["Less than 5 hours", "6–7 hours", "8–9 hours", "More than 9 hours"].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.sleepHours === o} onClick={() => pickThenNext("sleepHours", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 14, Kristin story */}
            {current === "kristin_story" && (
              <StoryScreen
                quote="I was ready to give up. After seeing reviews of GLP-1, I had to try. 6 months later, wow. Thank you for the metabolic reset, game changer."
                name="Kristin"
                result="Lost 29 lbs · Renewed confidence"
                before={review22.url}
                after={review27.url}
                onNext={next}
              />
            )}

            {/* 15, Contraindications */}
            {current === "contra" && (
              <ScreenShell
                title="GLP-1 is {{safe}}, but a few conditions might prevent you from being prescribed."
                sub="Your answers are completely confidential and protected by HIPAA."
                footer={<PrimaryButton onClick={next} disabled={!(answers.contra && answers.contra.length)}>Next →</PrimaryButton>}
              >
                {[
                  "None of these",
                  "End-stage kidney disease (on or about to be on dialysis)",
                  "End-stage liver disease (cirrhosis)",
                  "Current suicidal thoughts and/or prior suicidal attempt",
                  "Cancer (active diagnosis, treatment, or in remission < 5 years, excludes non-melanoma skin cancer cured via simple excision)",
                  "History of organ transplant on anti-rejection medication",
                  "Severe gastrointestinal condition (gastroparesis, blockage, IBD)",
                  "Current diagnosis or treatment for alcohol, opioid, or substance use disorder",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.contra ?? []).includes(o)}
                    onClick={() => toggleMulti("contra", o, "None of these")}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 16, More health questions */}
            {current === "more_conditions" && (
              <ScreenShell
                title="A few more health questions."
                sub="Do any of these apply to you?"
                footer={<PrimaryButton onClick={next} disabled={!(answers.moreConditions && answers.moreConditions.length)}>Next →</PrimaryButton>}
              >
                {[
                  "None of these",
                  "Active Gall Bladder Disease",
                  "Hypertension (high blood pressure)",
                  "Sleep apnea",
                  "Type 2 diabetes (not on insulin)",
                  "Type 2 diabetes (on insulin)",
                  "Type 1 diabetes",
                  "Diabetic retinopathy, optic nerve damage, or blindness",
                  "Use of the blood thinner warfarin (Coumadin/Jantoven)",
                  "History of or current pancreatitis",
                  "Personal/family history of Medullary Thyroid Carcinoma or MEN-2",
                  "High cholesterol or triglycerides",
                  "Severe Depression",
                  "Liver disease, including fatty liver",
                  "Congestive heart failure",
                  "Urinary stress incontinence",
                  "Polycystic ovarian syndrome (PCOS)",
                  "Clinically proven low testosterone",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.moreConditions ?? []).includes(o)}
                    onClick={() => toggleMulti("moreConditions", o, "None of these")}
                    compact
                  />
                ))}
              </ScreenShell>
            )}

            {/* 17, GLP-1 history */}
            {current === "glp1_history" && (
              <ScreenShell title="Have you taken medication for weight loss within the past month?">
                {[
                  "Yes, I've taken Semaglutide (Ozempic or Wegovy)",
                  "Yes, I've taken Tirzepatide (Mounjaro or Zepbound)",
                  "I'm not currently taking a GLP-1 medication",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.glp1History === o} onClick={() => pickThenNext("glp1History", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 18, Opiate */}
            {current === "opiate" && (
              <ScreenShell
                title="Within the last 3 months, have you taken opiate pain medications or opiate-based street drugs?"
                footer={<PrimaryButton onClick={next} disabled={!answers.opiate}>Next →</PrimaryButton>}
              >
                <YesNoWithDetail
                  value={answers.opiate}
                  onChange={(v) => set({ opiate: v })}
                  detail={answers.opiateDetail}
                  onDetail={(v) => set({ opiateDetail: v })}
                  detailPlaceholder="Include date range, name, dose, and frequency."
                />
              </ScreenShell>
            )}

            {/* 19, Prior weight loss surgery */}
            {current === "prior_surgery" && (
              <ScreenShell
                title="Have you had prior weight loss surgeries?"
                footer={<PrimaryButton onClick={next} disabled={!answers.priorSurgery}>Next →</PrimaryButton>}
              >
                <YesNoWithDetail
                  value={answers.priorSurgery}
                  onChange={(v) => set({ priorSurgery: v })}
                  detail={answers.priorSurgeryDetail}
                  onDetail={(v) => set({ priorSurgeryDetail: v })}
                  detailPlaceholder="List bariatric, abdominal, and pelvic surgeries with date and type."
                />
              </ScreenShell>
            )}

            {/* 20, Prior program */}
            {current === "prior_program" && (
              <ScreenShell
                title="Have you ever tried to lose weight in a weight-management program (Jenny Craig, Weight Watchers, etc.)?"
                footer={<PrimaryButton onClick={next} disabled={!answers.priorProgram}>Next →</PrimaryButton>}
              >
                <YesNoWithDetail
                  value={answers.priorProgram}
                  onChange={(v) => set({ priorProgram: v })}
                  detail={answers.priorProgramDetail}
                  onDetail={(v) => set({ priorProgramDetail: v })}
                  detailPlaceholder="Brief details if necessary."
                />
              </ScreenShell>
            )}

            {/* 21, Willing to */}
            {current === "willing_to" && (
              <ScreenShell
                title="If clinically appropriate, are you willing to:"
                footer={<PrimaryButton onClick={next} disabled={!(answers.willingTo && answers.willingTo.length)}>Next →</PrimaryButton>}
              >
                {[
                  "Reduce your caloric intake alongside medication",
                  "Increase your physical activity alongside medication",
                  "None of the above",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.willingTo ?? []).includes(o)}
                    onClick={() => toggleMulti("willingTo", o, "None of the above")}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 22, Weight change */}
            {current === "weight_change" && (
              <ScreenShell title="Has your weight changed in the last year?">
                {[
                  "Lost a significant amount",
                  "Lost a little",
                  "About the same",
                  "Gained a little",
                  "Gained a significant amount",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.weightChange === o} onClick={() => pickThenNext("weightChange", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 23, Daiene story */}
            {current === "daiene_story" && (
              <StoryScreen
                quote="Being a mom makes it so hard to stay on a diet, but the weight vanished with GLP medication!"
                name="Daiene"
                result="Lost 90 lbs · Off blood pressure medication"
                before={spFemaleBefore.url}
                after={spFemaleAfter.url}
                onNext={next}
              />
            )}

            {/* 24, Resting HR */}
            {current === "resting_hr" && (
              <ScreenShell
                title="How about your average resting heart rate?"
                sub="An approximate value is fine."
              >
                {[
                  "< 60 bpm (Slow)",
                  "60–100 bpm (Normal)",
                  "101–110 bpm (Slightly Fast)",
                  "> 110 bpm (Fast)",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.restingHR === o} onClick={() => pickThenNext("restingHR", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 25, Blood pressure */}
            {current === "blood_pressure" && (
              <ScreenShell title="What is your average blood pressure range?">
                {[
                  "< 120/80 (Normal)",
                  "120–129 / <80 (Elevated)",
                  "130–139 / 80–89 (High Stage 1)",
                  "≥ 140/90 (High Stage 2)",
                ].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.bloodPressure === o} onClick={() => pickThenNext("bloodPressure", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 26, Affordability vs Potency */}
            {current === "affordability" && (
              <ScreenShell
                title="{{Looking good!}} Let's match you with the best medication."
                sub="Which of these is most important to you?"
              >
                {["Affordability", "Potency"].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.affordability === o} onClick={() => pickThenNext("affordability", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 27, Current medications */}
            {current === "current_meds" && (
              <ScreenShell
                title="Do you currently take any medications?"
                footer={<PrimaryButton onClick={next} disabled={!answers.currentMeds}>Next →</PrimaryButton>}
              >
                <YesNoWithDetail
                  value={answers.currentMeds}
                  onChange={(v) => set({ currentMeds: v })}
                  detail={answers.currentMedsDetail}
                  onDetail={(v) => set({ currentMedsDetail: v })}
                  detailPlaceholder="List medications and dosage if possible."
                />
              </ScreenShell>
            )}

            {/* 28, Motivation level */}
            {current === "motivation_level" && (
              <ScreenShell
                title="Let's better understand your {{current state of mind}}."
                sub="How motivated are you to reach your weight goal?"
              >
                {["I'm Ready!", "I'm feeling hopeful", "I'm cautious"].map((o) => (
                  <OptionCard key={o} label={o} selected={answers.motivationLevel === o} onClick={() => pickThenNext("motivationLevel", o)} />
                ))}
              </ScreenShell>
            )}

            {/* 29, Additional info */}
            {current === "additional_info" && (
              <ScreenShell
                title="Do you have any further information you'd like our medical team to know?"
                sub="Our medical providers review every form within 24 hours."
                footer={<PrimaryButton onClick={next} disabled={!answers.additionalInfo}>Next →</PrimaryButton>}
              >
                <YesNoWithDetail
                  value={answers.additionalInfo}
                  onChange={(v) => set({ additionalInfo: v })}
                  detail={answers.additionalInfoDetail}
                  onDetail={(v) => set({ additionalInfoDetail: v })}
                  detailPlaceholder="Provide details here. Please do not include urgent or emergency medical information."
                />
              </ScreenShell>
            )}

            {/* 30, Personalization */}
            {current === "personalization" && (
              <ScreenShell
                title="Your needs are {{unique}}, your medicine should be, {{too}}."
                sub="Please select the options you're interested in."
                footer={<PrimaryButton onClick={next} disabled={!(answers.personalization && answers.personalization.length)}>Next →</PrimaryButton>}
              >
                {[
                  "Maintaining muscle mass as I lose weight",
                  "Would prefer not to inject",
                  "Managing potential side effects such as nausea/vomiting",
                  "Assist with aging and longevity",
                  "Improving cognitive function and mental clarity",
                  "Improving energy levels",
                  "Regulating menses and hormonal status",
                  "Improving sleep quality",
                  "Nothing in particular",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={(answers.personalization ?? []).includes(o)}
                    onClick={() => toggleMulti("personalization", o, "Nothing in particular")}
                    compact
                  />
                ))}
              </ScreenShell>
            )}

            {/* 31, Eligibility summary + name + state */}
            {current === "eligibility" && (
              <ScreenShell
                title="Your medical checkup"
                sub="You're a strong candidate for medical weight loss with a 94% chance of treatment success if you qualify."
                footer={
                  <>
                    <PrimaryButton
                      onClick={next}
                      disabled={!answers.firstName || !answers.lastName || !answers.state}
                    >
                      Verify eligibility →
                    </PrimaryButton>
                    <p className="mt-4 flex items-center gap-2 text-[12px] text-ink/50">
                      <ShieldCheck className="h-4 w-4 text-[#1D437B]" />
                      Your information is never shared and is protected by HIPAA.
                    </p>
                  </>
                }
              >
                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-ink/10 bg-white p-5">
                  <SummaryStat label="BMI" value={bmi ? String(bmi) : "-"} />
                  <SummaryStat label="Current" value={`${answers.weightLbs ?? "-"} lbs`} />
                  <SummaryStat label="Goal" value={`${answers.goalWeight ?? "-"} lbs`} />
                </div>
                {paceCalc && (
                  <p className="text-[13.5px] text-ink/60">
                    Estimated timeline: <b className="text-ink">~{Math.round(paceCalc.weeks)} weeks</b> to reach your goal.
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="First name" value={answers.firstName ?? ""} onChange={(v) => set({ firstName: v })} placeholder="Jane" />
                  <TextField label="Last name" value={answers.lastName ?? ""} onChange={(v) => set({ lastName: v })} placeholder="Doe" />
                </div>
                <StateSelect
                  label="What state will your medication be shipped to?"
                  value={answers.state ?? ""}
                  onChange={(v) => set({ state: v })}
                  states={US_STATES}
                />
              </ScreenShell>
            )}

            {/* 32, Loading */}
            {current === "loading" && <LoadingScreen firstName={answers.firstName} state={answers.state} />}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────  Helpers  ──────────── */
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming",
];

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</div>
      <div className="mt-1 text-[22px] font-bold text-ink">{value}</div>
    </div>
  );
}

/* ────────────  Metabolic projection chart (mini)  ──────────── */
function MetabolicChart({ start, goal }: { start: number; goal: number }) {
  const months = ["M1", "M2", "M3", "M4", "M6", "M9", "M12"];
  const withPts = months.map((_, i) => {
    const t = i / (months.length - 1);
    const eased = 1 - Math.pow(1 - t, 2.2);
    return start - (start - goal) * eased;
  });
  const withoutPts = months.map((_, i) => start - i * 0.6);
  const W = 640, H = 260, padL = 52, padR = 16, padT = 20, padB = 36;
  const min = goal - 6, max = start + 6;
  const xAt = (i: number) => padL + (i / (months.length - 1)) * (W - padL - padR);
  const yAt = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const buildPath = (pts: number[]) =>
    pts.reduce((acc, v, i) => {
      const x = xAt(i), y = yAt(v);
      if (i === 0) return `M ${x} ${y}`;
      const pX = xAt(i - 1), pY = yAt(pts[i - 1]);
      const cx = pX + (x - pX) * 0.5;
      return `${acc} C ${cx} ${pY}, ${cx} ${y}, ${x} ${y}`;
    }, "");
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-[11.5px] font-semibold uppercase tracking-[0.12em]">
        <span className="flex items-center gap-2 text-ink/55"><span className="h-2 w-4 rounded-full bg-ink/30" /> Without Blissley</span>
        <span className="flex items-center gap-2 text-ever"><span className="h-2 w-4 rounded-full bg-ever" /> With Blissley</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <line x1={padL} x2={W - padR} y1={yAt(start)} y2={yAt(start)} stroke="#171717" strokeOpacity="0.15" strokeDasharray="4 6" />
        <line x1={padL} x2={W - padR} y1={yAt(goal)} y2={yAt(goal)} stroke="#171717" strokeOpacity="0.15" strokeDasharray="4 6" />
        <text x={padL - 8} y={yAt(start) + 4} textAnchor="end" style={{ fontSize: 11, fill: "#171717aa" }}>{Math.round(start)} lbs</text>
        <text x={padL - 8} y={yAt(goal) + 4} textAnchor="end" style={{ fontSize: 11, fill: "#171717aa" }}>{Math.round(goal)} lbs</text>
        <motion.path d={buildPath(withoutPts)} stroke="#17171744" strokeWidth={3} fill="none" strokeDasharray="6 6"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} />
        <motion.path d={buildPath(withPts)} stroke="#ee7273" strokeWidth={4} fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
        <motion.circle cx={xAt(months.length - 1)} cy={yAt(withPts[withPts.length - 1])} r={7} fill="#ee7273"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring", stiffness: 240, damping: 16 }} />
        {months.map((m, i) => (
          <text key={m} x={xAt(i)} y={H - 12} textAnchor="middle" style={{ fontSize: 11, fill: "#17171780" }}>{m}</text>
        ))}
      </svg>
    </div>
  );
}

/* ────────────  Metabolic-rate rising curve (GLP-1)  ──────────── */
function GLP1Curve() {
  const W = 640, H = 220, padL = 44, padR = 20, padT = 16, padB = 32;
  const weeks = ["W0", "W2", "W4", "W6", "W8"];
  const pts = weeks.map((_, i) => {
    const t = i / (weeks.length - 1);
    return 1 - Math.pow(1 - t, 2.4); // 0→1
  });
  const yAt = (v: number) => padT + (1 - v) * (H - padT - padB);
  const xAt = (i: number) => padL + (i / (weeks.length - 1)) * (W - padL - padR);
  const path = pts.reduce((acc, v, i) => {
    const x = xAt(i), y = yAt(v);
    if (i === 0) return `M ${x} ${y}`;
    const pX = xAt(i - 1), pY = yAt(pts[i - 1]);
    const cx = pX + (x - pX) * 0.5;
    return `${acc} C ${cx} ${pY}, ${cx} ${y}, ${x} ${y}`;
  }, "");
  const area = `${path} L ${xAt(weeks.length - 1)} ${H - padB} L ${xAt(0)} ${H - padB} Z`;
  return (
    <div className="rounded-3xl border border-ink/8 bg-gradient-to-br from-[#1D437B]/[0.05] to-white p-5">
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
        <span>Metabolic rate ↑</span>
        <span>Ease of weight loss →</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <defs>
          <linearGradient id="glpFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ee7273" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ee7273" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#glpFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
        <motion.path d={path} stroke="#ee7273" strokeWidth={4} fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
        <motion.circle cx={xAt(weeks.length - 1)} cy={yAt(1)} r={7} fill="#ee7273"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 18 }} />
        {weeks.map((w, i) => (
          <text key={w} x={xAt(i)} y={H - 10} textAnchor="middle" style={{ fontSize: 11, fill: "#17171770" }}>{w}</text>
        ))}
      </svg>
    </div>
  );
}

/* ────────────  Story screen  ──────────── */
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
        <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
        Real patient story
      </span>
      <h2 className="mt-4 font-hero text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[36px]">
        {name} took control.
      </h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 grid grid-cols-2 gap-2 md:gap-3"
      >
        {[
          { url: before, label: "Before" },
          { url: after, label: "After" },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-[10px] bg-[#F3F2EE]">
            <div className="aspect-[3/5] w-full md:aspect-[4/6]">
              <img src={s.url} alt={`${name} ${s.label}`} className="h-full w-full object-cover object-center" style={{ transform: "scale(1.12)" }} />
            </div>
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl md:bottom-4 md:left-4 md:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      <div className="mt-6 flex items-center gap-1" aria-label="5 star rating">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#ee7273" aria-hidden>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p className="mt-3 text-[16.5px] leading-[1.55] text-ink/85 md:text-[18px]">&ldquo;{quote}&rdquo;</p>

      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <img src={verifiedCheck.url} alt="" className="h-5 w-5 shrink-0" aria-hidden />
          <span className="truncate text-[14.5px] font-medium text-ink">{name}</span>
        </div>
        <span className="shrink-0 text-[13px] font-semibold text-ever">{result}</span>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onNext}>Next →</PrimaryButton>
      </div>
    </motion.div>
  );
}

/* ────────────  Loading  ──────────── */
function LoadingScreen({ firstName, state }: { firstName?: string; state?: string }) {
  const steps = useMemo(
    () => [
      "Reviewing your profile...",
      `Checking physician availability in ${state || "your state"}...`,
      "Personalizing your GLP-1 protocol...",
      "Building your treatment plan...",
    ],
    [state],
  );
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= steps.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, steps.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D437B] via-[#295a9a] to-[#ee7273]" />
      <motion.div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-white/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="absolute -right-40 bottom-1/4 h-[560px] w-[560px] rounded-full bg-[#ffd7c0]/25 blur-[130px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity }} />

      <div className="relative z-10 flex items-center justify-center pt-10 md:pt-14">
        <span className="font-hero text-[26px] italic tracking-tight text-white md:text-[30px]">blissley</span>
      </div>
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-120px)] w-full max-w-[560px] flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-24 w-24 place-items-center">
          <motion.span className="absolute inset-0 rounded-full border-[3px] border-white/40 border-t-white"
            animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} />
          <motion.span className="h-3 w-3 rounded-full bg-white"
            animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
        </div>
        <h2 className="mt-10 font-hero text-[26px] font-bold tracking-[-0.02em] text-white md:text-[32px]">
          Building your plan{firstName ? `, ${firstName}` : ""}
        </h2>
        <div className="mt-6 w-full space-y-3">
          <AnimatePresence mode="popLayout">
            {steps.slice(0, step + 1).map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: i === step ? 1 : 0.55, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[15px] font-medium text-white md:text-[16px]">
                {s}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
