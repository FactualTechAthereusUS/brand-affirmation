import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  BackBtn,
  OptionCard,
  PrimaryButton,
  ScreenShell,
  TextField,
} from "./primitives";
import logo from "@/assets/blissley-logo.png.asset.json";
import verifiedCheck from "@/assets/verified-check.png.asset.json";
import spMaleBefore from "@/assets/sp-male-before.png.asset.json";
import spMaleAfter from "@/assets/sp-male-after.png.asset.json";
import spFemaleBefore from "@/assets/sp-female-before.png.asset.json";
import spFemaleAfter from "@/assets/sp-female-after.png.asset.json";

/* ────────────────────  Types  ──────────────────── */
type Sex = "female" | "male";
type Preg = "pregnant" | "breastfeeding" | "none";

type Answers = {
  firstName: string;
  lastName: string;
  email: string;
  primaryGoal?: string;
  struggleDuration?: string;
  sex?: Sex;
  pregnancy?: Preg;
  dobM?: string;
  dobD?: string;
  dobY?: string;
  heightFt?: string;
  heightIn?: string;
  weightLbs?: string;
  weightGoal?: string;
  triedBefore?: string[];
  pastSurgeries?: "no" | "yes";
  pastSurgeriesDetail?: string;
  currentConditions?: "no" | "yes";
  currentConditionsDetail?: string;
  glp1History?: string;
  glp1Which?: string;
  glp1Dose?: string;
  qualifyingConditions?: string[];
  weightSymptoms?: string[];
  bloodPressure?: string;
  restingHR?: string;
  contraindications?: string[];
  bariatric?: string;
  diabetesMeds?: string[];
  medications?: string;
  noMedications?: boolean;
  allergies?: string;
  noAllergies?: boolean;
  state?: string;
  phone?: string;
  consentTOS?: boolean;
  consentSMS?: boolean;
};



const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ────────────────────  Simple thick progress bar  ──────────────────── */
function SlimBar({ value }: { value: number }) {
  const v = Math.min(1, Math.max(0, value));
  const width = useSpring(v * 100, { stiffness: 120, damping: 22 });
  useEffect(() => { width.set(v * 100); }, [v, width]);
  const w = useTransform(width, (x) => `${x}%`);
  return (
    <div className="relative h-[10px] w-full overflow-hidden rounded-full bg-ink/[0.08]">
      <motion.div
        style={{ width: w }}
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ever to-[#f38a8b]"
      />
      {/* shimmer */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/45 to-transparent"
        animate={{ x: ["0%", "420%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ────────────────────  Screen ids  ──────────────────── */
const BASE_SCREENS = [
  "name",              // 1
  "goal",              // 2
  "howlong",           // 3
  "sex",               // 4
  // "pregnancy",       inserted for female
  "dob",               // 5
  "hw",                // 6
  "weight_goal",       // 7
  "tried",             // 8
  "past_surgeries",    // NEW A
  "current_conditions",// NEW B
  "social_proof",      // patient story
  "glp1",              // 9
  "conditions",        // 10
  "weight_symptoms",   // NEW C
  "bp",                // NEW — blood pressure
  "hr",                // NEW — resting heart rate
  "projection",        // calculator clone
  "contra",            // 11
  "bariatric",         // NEW D
  "meds",              // 12
  "loading",
];



function buildFlow(sex?: Sex) {
  if (sex === "female") {
    const arr = [...BASE_SCREENS];
    const sexIdx = arr.indexOf("sex");
    arr.splice(sexIdx + 1, 0, "pregnancy");
    return arr;
  }
  return BASE_SCREENS;
}

/* ────────────────────  Main flow  ──────────────────── */
export function WLIntakeFlow() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ firstName: "", lastName: "", email: "" });

  const flow = useMemo(() => buildFlow(answers.sex), [answers.sex]);
  const current = flow[idx] ?? "name";
  // Exclude loading from the progress count so bar hits 100% on final question
  const total = Math.max(1, flow.length - 1);
  const progress = Math.min(1, (idx + 1) / total);

  const set = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => setIdx((i) => Math.min(flow.length - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  const pickThenNext = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    set({ [key]: value } as Partial<Answers>);
    setTimeout(next, 220);
  };

  const toggleMulti = (key: keyof Answers, value: string, none = "None of the above") => {
    setAnswers((a) => {
      const arr = ((a[key] as string[] | undefined) ?? []).slice();
      if (value === none) return { ...a, [key]: arr.includes(none) ? [] : [none] };
      const withoutNone = arr.filter((v) => v !== none);
      const exists = withoutNone.includes(value);
      const nextArr = exists ? withoutNone.filter((v) => v !== value) : [...withoutNone, value];
      return { ...a, [key]: nextArr };
    });
  };

  const bmi = useMemo(() => {
    const ft = parseFloat(answers.heightFt || "0");
    const inch = parseFloat(answers.heightIn || "0");
    const w = parseFloat(answers.weightLbs || "0");
    const totalIn = ft * 12 + inch;
    if (!totalIn || !w) return null;
    return +(703 * (w / (totalIn * totalIn))).toFixed(1);
  }, [answers.heightFt, answers.heightIn, answers.weightLbs]);

  const isLoading = current === "loading";

  // Persist answers for the sales page as soon as we hit loading
  useEffect(() => {
    if (current !== "loading") return;
    try {
      sessionStorage.setItem(
        "blissley_intake_wl",
        JSON.stringify({ ...answers, bmi }),
      );
    } catch {}
  }, [current, answers, bmi]);

  return (
    <div className="relative min-h-[100svh] bg-white pb-24">
      {/* Sticky header (hidden on loading) */}
      {!isLoading && (
        <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl backdrop-saturate-150">
          <div className="mx-auto flex h-[64px] max-w-[720px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
            <BackBtn onClick={prev} invisible={idx === 0} />
            <Link to="/" className="flex items-center">
              <img src={logo.url} alt="Blissley" className="h-10 w-auto md:h-12" />
            </Link>
            <div className="w-[72px]" />
          </div>
          <div className="mx-auto max-w-[720px] px-5 pb-4 md:px-8 md:pb-5">
            <SlimBar value={progress} />
          </div>
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col px-5 pt-10 md:px-8 md:pt-16">
        <AnimatePresence mode="wait">
          <div key={current} className="flex flex-col">

            {/* 1 — Name + Email */}
            {current === "name" && (
              <ScreenShell
                title="Let's get started."
                sub="A few questions to build your personalized weight loss program."
                footer={
                  <>
                    <PrimaryButton
                      onClick={next}
                      disabled={
                        !answers.firstName.trim() ||
                        !answers.lastName.trim() ||
                        !/^\S+@\S+\.\S+$/.test(answers.email)
                      }
                    >
                      Continue
                    </PrimaryButton>
                    <p className="mt-4 text-[12px] text-ink/45">
                      Free to start. No commitment. Takes 4 minutes.
                    </p>
                  </>
                }
              >
                <TextField
                  label="First name"
                  value={answers.firstName}
                  onChange={(v) => set({ firstName: v })}
                  placeholder="Your first name"
                  autoFocus
                />
                <TextField
                  label="Last name"
                  value={answers.lastName}
                  onChange={(v) => set({ lastName: v })}
                  placeholder="Your last name"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={answers.email}
                  onChange={(v) => set({ email: v })}
                  placeholder="your@email.com"
                />
              </ScreenShell>
            )}


            {/* 2 — Primary goal */}
            {current === "goal" && (
              <ScreenShell
                title={`${answers.firstName || "Hey"}, what's your main goal?`}
                sub="Select the one that matters most to you right now."
              >
                {[
                  "Lose a significant amount of weight",
                  "Stop the constant thoughts about food",
                  "I've tried everything and nothing has worked",
                  "Feel healthier and more energetic",
                  "Get my confidence back",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.primaryGoal === o}
                    onClick={() => pickThenNext("primaryGoal", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 3 — How long */}
            {current === "howlong" && (
              <ScreenShell title="How long have you been struggling with your weight?">
                {[
                  "Less than 1 year",
                  "1 to 3 years",
                  "3 to 5 years",
                  "More than 5 years",
                  "Most of my life",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.struggleDuration === o}
                    onClick={() => pickThenNext("struggleDuration", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 4 — Sex */}
            {current === "sex" && (
              <ScreenShell
                title="What was your sex assigned at birth?"
                sub="This affects medication dosing and eligibility."
              >
                <OptionCard label="Female" selected={answers.sex === "female"} onClick={() => pickThenNext("sex", "female")} />
                <OptionCard label="Male" selected={answers.sex === "male"} onClick={() => pickThenNext("sex", "male")} />
              </ScreenShell>
            )}

            {/* 4A — Pregnancy (female only) */}
            {current === "pregnancy" && (
              <ScreenShell
                title="A quick safety check."
                footer={
                  answers.pregnancy && answers.pregnancy !== "none" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-ever/25 bg-ever/[0.06] p-5"
                    >
                      <p className="text-[14px] leading-[1.55] text-ink/75">
                        GLP-1 medications are not recommended during pregnancy or
                        breastfeeding. We'd love to help when the time is right.
                      </p>
                      <div className="mt-4">
                        <PrimaryButton onClick={() => (window.location.href = "/")}>
                          Remind me later
                        </PrimaryButton>
                      </div>
                    </motion.div>
                  ) : null
                }
              >
                {[
                  { key: "pregnant" as Preg, label: "I am currently pregnant or trying to conceive" },
                  { key: "breastfeeding" as Preg, label: "I am breastfeeding" },
                  { key: "none" as Preg, label: "None of the above" },
                ].map((o) => (
                  <OptionCard
                    key={o.key}
                    label={o.label}
                    selected={answers.pregnancy === o.key}
                    onClick={() => {
                      if (o.key === "none") pickThenNext("pregnancy", "none");
                      else set({ pregnancy: o.key });
                    }}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 5 — DOB */}
            {current === "dob" && (
              <ScreenShell
                title="What's your date of birth?"
                sub="We need to confirm you're 18 or older."
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={!answers.dobM || !answers.dobD || !answers.dobY || answers.dobY.length !== 4}
                  >
                    Continue
                  </PrimaryButton>
                }
              >
                <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3">
                  <select
                    value={answers.dobM ?? ""}
                    onChange={(e) => set({ dobM: e.target.value })}
                    className="h-[56px] rounded-2xl border border-ink/12 bg-white px-4 text-[15px] text-ink outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="DD"
                    value={answers.dobD ?? ""}
                    onChange={(e) => set({ dobD: e.target.value })}
                    className="h-[56px] rounded-2xl border border-ink/12 bg-white px-4 text-center text-[15px] text-ink outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="YYYY"
                    value={answers.dobY ?? ""}
                    onChange={(e) => set({ dobY: e.target.value })}
                    className="h-[56px] rounded-2xl border border-ink/12 bg-white px-4 text-center text-[15px] text-ink outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                  />
                </div>
              </ScreenShell>
            )}

            {/* 6 — Height + weight */}
            {current === "hw" && (() => {
              const categories = [
                { key: "under", label: "Underweight", range: "<18.5", max: 18.5, color: "#7aa5c4" },
                { key: "normal", label: "Normal", range: "18.5–24.9", max: 25, color: "#6fbf8a" },
                { key: "over", label: "Overweight", range: "25–29.9", max: 30, color: "#e8a86b" },
                { key: "obese", label: "Obese", range: "≥30", max: 45, color: "#ee7273" },
              ];
              const activeIdx = bmi === null ? -1 : categories.findIndex((c) => bmi < c.max);
              const active = activeIdx === -1 ? categories[categories.length - 1] : categories[activeIdx];
              const displayLabel = bmi !== null && bmi >= 35 ? "Severe Obesity" : active?.label ?? "";
              const pct = bmi === null ? 0 : Math.min(100, Math.max(2, ((bmi - 12) / (45 - 12)) * 100));
              return (
                <ScreenShell
                  title={`${answers.firstName || "You"}, a couple of quick numbers.`}
                  sub="This helps us estimate your results and check eligibility."
                  footer={
                    <>
                      <PrimaryButton
                        onClick={next}
                        disabled={!answers.heightFt || !answers.weightLbs}
                      >
                        Continue
                      </PrimaryButton>
                      <p className="mt-4 text-[12px] text-ink/45">
                        GLP-1 programs are recommended for a BMI of 27 or above.
                      </p>
                    </>
                  }
                >
                  <TextField
                    label="Weight (pounds)"
                    type="number"
                    value={answers.weightLbs ?? ""}
                    onChange={(v) => set({ weightLbs: v })}
                    placeholder="210"
                  />
                  <div className="mt-1">
                    <span className="mb-2 block text-[13px] font-medium text-ink/70">Height</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <TextField type="number" value={answers.heightFt ?? ""} onChange={(v) => set({ heightFt: v })} placeholder="5" />
                        <span className="mt-1.5 block text-[12px] text-ink/50">Feet</span>
                      </div>
                      <div>
                        <TextField type="number" value={answers.heightIn ?? ""} onChange={(v) => set({ heightIn: v })} placeholder="6" />
                        <span className="mt-1.5 block text-[12px] text-ink/50">Inches</span>
                      </div>
                    </div>
                  </div>

                  {bmi !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4"
                    >
                      <span className="mb-2 block text-[13px] font-medium text-ink/60">Your BMI</span>
                      <div className="relative h-[52px] w-full overflow-hidden rounded-full bg-ink/[0.06]">
                        <motion.div
                          initial={false}
                          animate={{ width: `${pct}%`, backgroundColor: active?.color }}
                          transition={{ type: "spring", stiffness: 140, damping: 22 }}
                          className="absolute inset-y-0 left-0 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[15px] font-semibold text-ink">
                            {bmi} · {displayLabel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {categories.map((c, i) => (
                          <div key={c.key} className="flex flex-col">
                            <span className={`text-[12px] font-medium transition-colors ${i === activeIdx || (activeIdx === -1 && c.key === "obese") ? "text-ink" : "text-ink/45"}`}>
                              {c.label}
                            </span>
                            <span className="text-[11px] text-ink/40">{c.range}</span>
                          </div>
                        ))}
                      </div>
                      {bmi < 25 && (
                        <p className="mt-3 rounded-xl bg-ink/[0.04] p-3 text-[12.5px] leading-[1.5] text-ink/65">
                          Your measurements may put you outside the typical eligibility range. A physician will still review your profile and make the final call.
                        </p>
                      )}
                      {bmi >= 25 && bmi < 27 && (
                        <p className="mt-3 rounded-xl bg-ink/[0.04] p-3 text-[12.5px] leading-[1.5] text-ink/65">
                          You're close to the threshold. Your physician will review and determine eligibility.
                        </p>
                      )}
                    </motion.div>
                  )}
                </ScreenShell>
              );
            })()}

            {/* 7 — Weight goal */}
            {current === "weight_goal" && (
              <ScreenShell title="How much would you like to lose?" sub="This helps us estimate your timeline.">
                {[
                  "10 to 20 lbs",
                  "21 to 40 lbs",
                  "41 to 60 lbs",
                  "61 to 100 lbs",
                  "More than 100 lbs",
                  "I'm not sure yet",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.weightGoal === o}
                    onClick={() => pickThenNext("weightGoal", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 8 — Tried before */}
            {current === "tried" && (
              <ScreenShell
                title="What have you tried before?"
                sub="Select everything that applies."
                footer={<PrimaryButton onClick={next} disabled={!(answers.triedBefore?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {[
                  "Calorie counting or tracking",
                  "Low-carb or keto diet",
                  "Intermittent fasting",
                  "Weight loss programs (WW, Noom, Jenny Craig)",
                  "Prescription weight loss medication",
                  "Personal trainer or gym program",
                  "Nothing, this is my first time",
                  "Other",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.triedBefore?.includes(o) ?? false}
                    onClick={() => toggleMulti("triedBefore", o, "Nothing, this is my first time")}
                  />
                ))}
              </ScreenShell>
            )}

            {/* NEW A — Past surgeries */}
            {current === "past_surgeries" && (
              <ScreenShell
                title="Have you had any past surgeries?"
                sub="This helps your physician personalize your protocol."
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={
                      !answers.pastSurgeries ||
                      (answers.pastSurgeries === "yes" && !answers.pastSurgeriesDetail?.trim())
                    }
                  >
                    Continue
                  </PrimaryButton>
                }
              >
                <OptionCard
                  label="No, I have not had any surgeries"
                  selected={answers.pastSurgeries === "no"}
                  onClick={() => set({ pastSurgeries: "no", pastSurgeriesDetail: "" })}
                />
                <OptionCard
                  label="Yes"
                  selected={answers.pastSurgeries === "yes"}
                  onClick={() => set({ pastSurgeries: "yes" })}
                />
                {answers.pastSurgeries === "yes" && (
                  <motion.label
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block"
                  >
                    <span className="mb-2 block text-[13px] font-medium text-ink/70">Please list them briefly</span>
                    <textarea
                      value={answers.pastSurgeriesDetail ?? ""}
                      onChange={(e) => set({ pastSurgeriesDetail: e.target.value })}
                      placeholder="e.g. gallbladder removal 2019, c-section 2015"
                      rows={3}
                      className="w-full rounded-2xl border border-ink/12 bg-white p-4 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                    />
                  </motion.label>
                )}
              </ScreenShell>
            )}

            {/* NEW B — Current medical conditions */}
            {current === "current_conditions" && (
              <ScreenShell
                title="Are you currently being treated for any medical conditions?"
                sub="Your physician reviews this before writing your prescription."
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={
                      !answers.currentConditions ||
                      (answers.currentConditions === "yes" && !answers.currentConditionsDetail?.trim())
                    }
                  >
                    Continue
                  </PrimaryButton>
                }
              >
                <OptionCard
                  label="No, I have no current medical conditions"
                  selected={answers.currentConditions === "no"}
                  onClick={() => set({ currentConditions: "no", currentConditionsDetail: "" })}
                />
                <OptionCard
                  label="Yes"
                  selected={answers.currentConditions === "yes"}
                  onClick={() => set({ currentConditions: "yes" })}
                />
                {answers.currentConditions === "yes" && (
                  <motion.label
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block"
                  >
                    <span className="mb-2 block text-[13px] font-medium text-ink/70">Please list them</span>
                    <textarea
                      value={answers.currentConditionsDetail ?? ""}
                      onChange={(e) => set({ currentConditionsDetail: e.target.value })}
                      placeholder="e.g. hypothyroidism, hypertension, GERD"
                      rows={3}
                      className="w-full rounded-2xl border border-ink/12 bg-white p-4 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                    />
                  </motion.label>
                )}
              </ScreenShell>
            )}

            {/* NEW C — Weight-related symptoms */}
            {current === "weight_symptoms" && (
              <ScreenShell
                title="Which of these do you experience?"
                sub="Select everything that applies."
                footer={
                  <PrimaryButton onClick={next} disabled={!(answers.weightSymptoms?.length ?? 0)}>
                    Continue
                  </PrimaryButton>
                }
              >
                {[
                  "Weight gain despite diet and exercise",
                  "Increased appetite or food cravings",
                  "Low energy or fatigue throughout the day",
                  "Difficulty maintaining weight loss long term",
                  "None of the above",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.weightSymptoms?.includes(o) ?? false}
                    onClick={() => toggleMulti("weightSymptoms", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* NEW D — Bariatric surgery */}
            {current === "bariatric" && (
              <ScreenShell
                title="Have you had bariatric or gastric bypass surgery?"
                sub="This helps us ensure the right medication and dosing for you."
              >
                {[
                  "No",
                  "Yes, gastric sleeve",
                  "Yes, gastric bypass (Roux-en-Y)",
                  "Yes, another bariatric procedure",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.bariatric === o}
                    onClick={() => pickThenNext("bariatric", o)}
                  />
                ))}
              </ScreenShell>
            )}



            {/* 8.5 — Social proof */}
            {current === "social_proof" && (
              <SocialProofScreen sex={answers.sex} onNext={next} />
            )}



            {/* 9 — GLP-1 history */}
            {current === "glp1" && (
              <ScreenShell
                title="Have you taken GLP-1 medication before?"
                sub="Ozempic, Wegovy, Mounjaro, Zepbound, or compounded versions."
                footer={
                  answers.glp1History?.startsWith("Yes") ? (
                    <PrimaryButton onClick={next}>Continue</PrimaryButton>
                  ) : undefined
                }
              >
                {[
                  "Yes, I am currently on one",
                  "Yes, I took one recently (within the last month)",
                  "Yes, I took one in the past",
                  "No, this is my first time",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.glp1History === o}
                    onClick={() => {
                      if (o.startsWith("No")) pickThenNext("glp1History", o);
                      else set({ glp1History: o });
                    }}
                  />
                ))}
                {answers.glp1History === "Yes, I am currently on one" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 grid gap-3 rounded-2xl border border-ink/10 bg-white p-5"
                  >
                    <TextField
                      label="Which one?"
                      value={answers.glp1Which ?? ""}
                      onChange={(v) => set({ glp1Which: v })}
                      placeholder="Semaglutide, Tirzepatide, Other, Not sure"
                    />
                    <TextField
                      label="What dose?"
                      value={answers.glp1Dose ?? ""}
                      onChange={(v) => set({ glp1Dose: v })}
                      placeholder="e.g. 0.5mg"
                    />
                  </motion.div>
                )}
              </ScreenShell>
            )}

            {/* 10 — Qualifying conditions */}
            {current === "conditions" && (
              <ScreenShell
                title="Do any of these apply to you?"
                sub="These conditions can actually support your eligibility."
                footer={<PrimaryButton onClick={next} disabled={!(answers.qualifyingConditions?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {[
                  "None of the above",
                  "High blood pressure",
                  "High cholesterol",
                  "Dyslipidemia / high triglycerides",
                  "Prediabetes",
                  "Type 2 diabetes (not on insulin)",
                  "Metabolic syndrome",
                  "PCOS",
                  "Sleep apnea",
                  "Non-alcoholic fatty liver disease (NAFLD)",
                  "Cardiovascular or coronary artery disease",
                  "Acid reflux or GERD",
                  "Joint pain related to weight",

                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.qualifyingConditions?.includes(o) ?? false}
                    onClick={() => toggleMulti("qualifyingConditions", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* NEW — Blood pressure */}
            {current === "bp" && (
              <ScreenShell
                title="What is your blood pressure range?"
                sub="A blood pressure reading looks like 120/80. If you're not sure, choose the closest option."
              >
                {[
                  "Less than 120/80 — Normal",
                  "120–129 / below 80 — Slightly elevated",
                  "130–139 / 80–89 — Stage 1 high blood pressure",
                  "140/90 or higher — Stage 2 high blood pressure",
                  "I don't know",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.bloodPressure === o}
                    onClick={() => pickThenNext("bloodPressure", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* NEW — Resting heart rate */}
            {current === "hr" && (
              <ScreenShell
                title="What is your average resting heart rate?"
                sub="Check your pulse for 60 seconds, or use your phone's health app."
              >
                {[
                  "Below 60 bpm",
                  "60 to 100 bpm — Normal",
                  "101 to 110 bpm",
                  "Above 110 bpm",
                  "I don't know",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.restingHR === o}
                    onClick={() => pickThenNext("restingHR", o)}
                  />
                ))}
              </ScreenShell>
            )}



            {/* Projection (calculator clone) */}
            {current === "projection" && (
              <WLProjectionScreen
                firstName={answers.firstName}
                weightLbs={answers.weightLbs}
                bmi={bmi}
                onNext={next}
              />
            )}

            {/* 11 — Contraindications */}
            {current === "contra" && (
              <ScreenShell
                title="Last safety check."
                sub="Select anything that applies. If nothing applies, select 'None of the above.'"
                footer={
                  <>
                    <PrimaryButton onClick={next} disabled={!(answers.contraindications?.length ?? 0)}>
                      Continue
                    </PrimaryButton>
                    {(answers.contraindications?.length ?? 0) > 0 &&
                      !answers.contraindications?.includes("None of the above") && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 rounded-xl bg-ink/[0.04] p-3 text-[12.5px] leading-[1.5] text-ink/65"
                        >
                          Based on what you've shared, your physician will carefully review your profile. You can still continue, the physician makes the final determination.
                        </motion.p>
                      )}
                  </>
                }
              >
                {[
                  "None of the above",
                  "Personal or family history of medullary thyroid cancer",
                  "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
                  "Type 1 diabetes",
                  "Type 2 diabetes managed with insulin",
                  "Active cancer (current or within the past year)",
                  "Severe kidney disease (on dialysis)",
                  "Severe liver disease",
                  "History of eating disorder",
                  "Organ transplant on anti-rejection medication",
                  "Severe gastrointestinal condition (gastroparesis or IBD)",
                  "Active suicidal thoughts or recent attempt",
                  "Known allergy to semaglutide or tirzepatide",
                  "Active or prior pancreatitis",
                  "Triglycerides over 600 mg/dL at any point",
                  "Alcohol or opioid use disorder (untreated)",

                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.contraindications?.includes(o) ?? false}
                    onClick={() => toggleMulti("contraindications", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* 12 — Meds + state + phone */}
            {current === "meds" && (
              <ScreenShell
                title={`Almost done, ${answers.firstName || "there"}.`}
                sub="Your physician needs this to complete your review."
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={
                      !(answers.diabetesMeds?.length ?? 0) ||
                      (!answers.medications?.trim() && !answers.noMedications) ||
                      (!answers.allergies?.trim() && !answers.noAllergies) ||
                      !answers.state ||
                      !answers.phone?.trim() ||
                      !answers.consentTOS
                    }

                  >
                    Get My Results
                  </PrimaryButton>
                }
              >
                <div>
                  <span className="mb-2 block text-[13px] font-medium text-ink/70">
                    Are you currently taking any of these diabetes medications?
                  </span>
                  <div className="grid gap-2">
                    {[
                      "None of these",
                      "Insulin (any type)",
                      "Glimepiride (Amaryl)",
                      "Glipizide",
                      "Glyburide",
                      "Meglitinides (repaglinide, nateglinide)",
                      "Sitagliptin, Saxagliptin, Linagliptin, or Alogliptin",
                    ].map((o) => (
                      <OptionCard
                        key={o}
                        label={o}
                        compact
                        selected={answers.diabetesMeds?.includes(o) ?? false}
                        onClick={() => toggleMulti("diabetesMeds", o, "None of these")}
                      />
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-ink/70">Any other medications not listed above?</span>

                  <textarea
                    value={answers.noMedications ? "None" : (answers.medications ?? "")}
                    onChange={(e) => set({ medications: e.target.value, noMedications: false })}
                    placeholder="List name and dose."
                    rows={3}
                    disabled={answers.noMedications}
                    className="w-full rounded-2xl border border-ink/12 bg-white p-4 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)] disabled:bg-ink/[0.04] disabled:text-ink/40"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set({
                        noMedications: !answers.noMedications,
                        medications: !answers.noMedications ? "None" : "",
                      })
                    }
                    className={`mt-3 flex w-full items-center gap-3 rounded-2xl border p-4 transition-all ${
                      answers.noMedications
                        ? "border-ever/30 bg-ever/[0.08]"
                        : "border-ink/10 bg-white hover:border-ink/20"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
                        answers.noMedications ? "border-ever bg-ever text-white" : "border-ink/25 bg-white"
                      }`}
                    >
                      {answers.noMedications && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M2.5 6.5L5 9L9.5 3.5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[13px] font-medium text-ink/80">I don't take any medications</span>
                  </button>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-ink/70">Medication allergies</span>
                  <textarea
                    value={answers.noAllergies ? "None" : (answers.allergies ?? "")}
                    onChange={(e) => set({ allergies: e.target.value, noAllergies: false })}
                    placeholder="List allergies and reactions."
                    rows={3}
                    disabled={answers.noAllergies}
                    className="w-full rounded-2xl border border-ink/12 bg-white p-4 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)] disabled:bg-ink/[0.04] disabled:text-ink/40"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set({
                        noAllergies: !answers.noAllergies,
                        allergies: !answers.noAllergies ? "None" : "",
                      })
                    }
                    className={`mt-3 flex w-full items-center gap-3 rounded-2xl border p-4 transition-all ${
                      answers.noAllergies
                        ? "border-ever/30 bg-ever/[0.08]"
                        : "border-ink/10 bg-white hover:border-ink/20"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
                        answers.noAllergies ? "border-ever bg-ever text-white" : "border-ink/25 bg-white"
                      }`}
                    >
                      {answers.noAllergies && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M2.5 6.5L5 9L9.5 3.5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[13px] font-medium text-ink/80">I don't have any medication allergies</span>
                  </button>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-ink/70">Shipping state</span>
                  <select
                    value={answers.state ?? ""}
                    onChange={(e) => set({ state: e.target.value })}
                    className="h-[56px] w-full rounded-2xl border border-ink/12 bg-white px-4 text-[16px] text-ink outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                  >
                    <option value="">Select your state</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <PhoneField
                  label="Phone number"
                  value={answers.phone ?? ""}
                  onChange={(v) => set({ phone: v })}
                />
                <p className="-mt-1 text-[12px] text-ink/50">Your physician may need to reach you.</p>

                <div className="mt-2 flex flex-col gap-3">
                  <ConsentRow
                    checked={!!answers.consentTOS}
                    onChange={(v) => set({ consentTOS: v })}
                    label={<>I agree to Blissley's <a className="underline underline-offset-2" href="/terms">Terms</a>, <a className="underline underline-offset-2" href="/privacy">Privacy Policy</a>, and Telehealth Consent.</>}
                  />
                  <ConsentRow
                    checked={!!answers.consentSMS}
                    onChange={(v) => set({ consentSMS: v })}
                    label={<>I agree to receive SMS updates about my care and orders. Reply STOP to unsubscribe.</>}
                  />
                </div>
              </ScreenShell>
            )}

            {current === "loading" && <FullscreenLoading firstName={answers.firstName} state={answers.state} />}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────  Consent row  ──────────────────── */
function ConsentRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 bg-white p-4">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
          checked ? "border-ever bg-ever text-white" : "border-ink/25 bg-white"
        }`}
        aria-checked={checked}
        role="checkbox"
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M2.5 6.5L5 9L9.5 3.5" />
          </svg>
        )}
      </button>
      <span className="text-[13px] leading-[1.5] text-ink/70">{label}</span>
    </label>
  );
}

/* ────────────────────  Full-screen brand loading  ──────────────────── */
function FullscreenLoading({ firstName, state }: { firstName?: string; state?: string }) {
  const steps = useMemo(
    () => [
      "Reviewing your profile...",
      `Checking physician availability in ${state || "your state"}...`,
      "Building your personalized plan...",
    ],
    [state],
  );
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step >= steps.length) {
      const t = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1300);
    return () => clearTimeout(t);
  }, [step, steps.length]);

  // Auto-redirect to sales page as soon as we hit "done"
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      window.location.href = "/weight-loss/sales";
    }, 900);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Base brand gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6a5a5] via-ever to-[#d95758]" />
      {/* Ambient orbs */}
      <motion.div
        className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-white/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 bottom-1/4 h-[560px] w-[560px] rounded-full bg-[#ffd7c0]/25 blur-[130px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center justify-center pt-10 md:pt-14">
        <img src={logo.url} alt="Blissley" className="h-9 w-auto brightness-0 invert md:h-10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-120px)] w-full max-w-[560px] flex-col items-center justify-center px-6 text-center">
        {!done ? (
          <>
            {/* Halo loader */}
            <div className="relative grid h-24 w-24 place-items-center">
              <motion.span
                className="absolute inset-0 rounded-full border-[3px] border-white/40 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-2 rounded-full border-[2px] border-white/25 border-b-white/85"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="h-3 w-3 rounded-full bg-white"
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <h2 className="mt-10 font-hero text-[26px] font-bold tracking-[-0.02em] text-white md:text-[32px]">
              Building your plan{firstName ? `, ${firstName}` : ""}
            </h2>

            <div className="mt-8 w-full space-y-3">
              <AnimatePresence mode="popLayout">
                {steps.slice(0, step + 1).map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                    animate={{
                      opacity: i === step ? 1 : 0.55,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[15px] font-medium text-white md:text-[16px]"
                  >
                    {s}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-white text-ever"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <h2 className="mt-8 font-hero text-[30px] font-bold tracking-[-0.02em] text-white md:text-[38px]">
              Your plan is ready.
            </h2>
            <p className="mt-3 max-w-[380px] text-[15px] leading-[1.55] text-white/85">
              Redirecting you to your personalized program…
            </p>

          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ────────────────────  Projection screen (calculator clone)  ──────────────────── */
function WLProjectionScreen({
  firstName,
  weightLbs,
  bmi,
  onNext,
}: {
  firstName: string;
  weightLbs?: string;
  bmi: number | null;
  onNext: () => void;
}) {
  const start = Math.max(120, Math.min(500, parseFloat(weightLbs || "210") || 210));
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-[640px] flex-col"
    >
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="font-hero text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[32px]"
      >
        {firstName ? `${firstName}, in` : "In"} six months, you could lose{" "}
        <span className="text-ever">{lossLbs} lbs</span>.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
          <defs>
            <linearGradient id="wlLineIntake" x1="0" x2="1" y1="0" y2="0">
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
            stroke="url(#wlLineIntake)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx={xAt(0)} cy={yAt(start)} r={8} fill="#ee7273"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 260, damping: 18 }}
          />
          <motion.circle
            cx={xAt(months.length - 1)} cy={yAt(end)} r={9} fill="#ee7273"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5, type: "spring", stiffness: 220, damping: 16 }}
          />
          {months.map((m, i) => (
            <text key={`${m}-${i}`} x={xAt(i)} y={H - 14} textAnchor="middle" className="fill-ink/60" style={{ fontSize: 12, fontWeight: 500 }}>
              {m}
            </text>
          ))}
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="mt-8 text-[15px] leading-[1.6] text-ink/65"
      >
        Users with a similar starting BMI to yours lose an average of{" "}
        {(lossPct * 100).toFixed(1)}% body weight in six months. Individual results
        may vary based on starting BMI and treatment adherence.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.5 }}
        className="mt-10"
      >
        <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────  Social Proof Screen  ──────────────────── */
function SocialProofScreen({ sex, onNext }: { sex?: Sex; onNext: () => void }) {
  const isMale = sex === "male";
  const story = isMale
    ? {
        before: spMaleBefore.url,
        after: spMaleAfter.url,
        quote:
          "I hadn't seen the 230s on a scale in 30 years. The doctor kept telling me to eat less. 10 years of that. 6 months in and I'm down 50 lbs and off two medications. Actual game changer.",
        name: "Michael T., 52",
        result: "Lost 50 lbs · 6 months",
      }
    : {
        before: spFemaleBefore.url,
        after: spFemaleAfter.url,
        quote:
          "I had completely stopped taking pictures of myself. 4 years of avoiding every camera at every family event. Down 34 lbs and last month I asked someone to take a photo of me. I didn't even think twice.",
        name: "Jennifer R., 44",
        result: "Lost 34 lbs · 4 months",
      };

  // Auto-advance after 8s
  useEffect(() => {
    const t = setTimeout(onNext, 8000);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-5 md:mb-6"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl backdrop-saturate-150 md:text-[11px]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
          Real patient story
        </span>
        <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[34px]">
          You&rsquo;re not alone in this.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-2 md:gap-3"
      >
        <div className="relative overflow-hidden rounded-[10px] bg-[#F3F2EE]">
          <div className="aspect-[3/5] w-full md:aspect-[4/6]">
            <img src={story.before} alt={`${story.name} before`} className="h-full w-full object-cover object-center" style={{ transform: "scale(1.18)" }} />
          </div>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl backdrop-saturate-150 md:bottom-4 md:left-4 md:text-[11.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
            Before
          </span>
        </div>
        <div className="relative overflow-hidden rounded-[10px] bg-[#F3F2EE]">
          <div className="aspect-[3/5] w-full md:aspect-[4/6]">
            <img src={story.after} alt={`${story.name} after`} className="h-full w-full object-cover object-center" style={{ transform: "scale(1.18)" }} />
          </div>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl backdrop-saturate-150 md:bottom-4 md:left-4 md:text-[11.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
            After
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-6"
      >
        <div className="flex items-center gap-1" aria-label="5 star rating">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#ee7273" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <p className="mt-3 text-[16.5px] leading-[1.55] tracking-[-0.005em] text-ink/85 md:text-[18px]">
          &ldquo;{story.quote}&rdquo;
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <img src={verifiedCheck.url} alt="" className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate text-[14.5px] font-medium text-ink">{story.name}</span>
          </div>
          <span className="shrink-0 text-[13px] font-semibold text-ever">{story.result}</span>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="mt-8"
      >
        <PrimaryButton onClick={onNext}>This could be me</PrimaryButton>
      </motion.div>
    </motion.div>
  );
}



