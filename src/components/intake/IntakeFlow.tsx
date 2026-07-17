import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  BackBtn,
  CategoryCard,
  OptionCard,
  PrimaryButton,
  ProgressBar,
  ScreenShell,
  TextField,
} from "./primitives";
import logo from "@/assets/blissley-logo.png.asset.json";
import catWeight from "@/assets/cat-weight.png.asset.json";
import catSexual from "@/assets/cat-sexual.png.asset.json";
import catSkin from "@/assets/cat-skin.png.asset.json";
import catLongevity from "@/assets/cat-longevity.png.asset.json";


/* ────────────────────  Types  ──────────────────── */
type Category = "weight_loss" | "sexual_health" | "skin_hair" | "hormones";
type Sex = "male" | "female";

type Answers = {
  firstName: string;
  email: string;
  category?: Category;
  dobM?: string;
  dobD?: string;
  dobY?: string;
  sex?: Sex;
  state?: string;
  // WL
  wlGoal?: string;
  wlHowLong?: string;
  wlTried?: string[];
  heightFt?: string;
  heightIn?: string;
  weightLbs?: string;
  glp1History?: string;
  glp1Which?: string;
  glp1Dose?: string;
  glp1HowLong?: string;
  wlConditions?: string[];
  // SH
  shConcern?: string;
  shHowLong?: string;
  shTried?: string[];
  shHealth?: string[];
  shEDContext?: string;
  // Skin
  skConcern?: string;
  skHowLong?: string;
  skTried?: string[];
  skSkinType?: string;
  skConditions?: string[];
  // Hormones
  hmConcern?: string;
  hmHowLong?: string;
  hmTested?: string;
  hmOnTherapy?: string;
  // Medical
  medContraindications?: string[];
  medications?: string;
  allergies?: string;
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

/* ────────────────────  Screen id list per path  ──────────────────── */
const COMMON: string[] = ["name", "category", "dob", "sex", "state"];
const MED: string[] = ["contra", "meds", "loading"];
const PATH: Record<Category, string[]> = {
  weight_loss: ["wl_goal", "wl_howlong", "wl_tried", "wl_hw", "wl_glp1", "wl_conditions"],
  sexual_health: ["sh_concern", "sh_howlong", "sh_tried", "sh_health"],
  skin_hair: ["sk_concern", "sk_howlong", "sk_tried", "sk_skin"],
  hormones: ["hm_concern", "hm_howlong", "hm_health"],
};

function buildFlow(cat?: Category): string[] {
  if (!cat) return COMMON;
  return [...COMMON, ...PATH[cat], ...MED];
}

/* ────────────────────  Main flow  ──────────────────── */
export function IntakeFlow() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ firstName: "", email: "" });

  const flow = useMemo(() => buildFlow(answers.category), [answers.category]);
  const current = flow[idx] ?? "name";
  const progress = (idx + 1) / flow.length;

  const set = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => setIdx((i) => Math.min(flow.length - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  // Auto-advance helper: single-select that immediately advances
  const pickThenNext = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    set({ [key]: value } as Partial<Answers>);
    setTimeout(next, 220);
  };

  // Multi-select toggle
  const toggleMulti = (key: keyof Answers, value: string, none = "None of the above") => {
    setAnswers((a) => {
      const arr = ((a[key] as string[] | undefined) ?? []).slice();
      // If picking "none", clear others
      if (value === none) return { ...a, [key]: arr.includes(none) ? [] : [none] };
      const withoutNone = arr.filter((v) => v !== none);
      const exists = withoutNone.includes(value);
      const nextArr = exists ? withoutNone.filter((v) => v !== value) : [...withoutNone, value];
      return { ...a, [key]: nextArr };
    });
  };

  // BMI display
  const bmi = useMemo(() => {
    const ft = parseFloat(answers.heightFt || "0");
    const inch = parseFloat(answers.heightIn || "0");
    const w = parseFloat(answers.weightLbs || "0");
    const totalIn = ft * 12 + inch;
    if (!totalIn || !w) return null;
    return +(703 * (w / (totalIn * totalIn))).toFixed(1);
  }, [answers.heightFt, answers.heightIn, answers.weightLbs]);

  return (
    <div className="relative min-h-[100svh] bg-white pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-ink/[0.06] bg-white/85 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[64px] max-w-[900px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
          <BackBtn onClick={prev} invisible={idx === 0 || current === "loading"} />
          <Link to="/" className="flex items-center">
            <img src={logo.url} alt="Blissley" className="h-11 w-auto md:h-14" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-semibold text-ink sm:inline">Excellent 4.6</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#00b67a] md:h-6 md:w-6"
                >
                  <svg className="h-3 w-3 fill-white md:h-3.5 md:w-3.5" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              ))}
              <div className="relative h-5 w-5 overflow-hidden rounded-sm bg-[#e5e7eb] md:h-6 md:w-6">
                <div className="absolute inset-0 w-1/2 overflow-hidden bg-[#00b67a]">
                  <svg className="h-3 w-3 fill-white md:h-3.5 md:w-3.5" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <svg className="absolute inset-0 h-3 w-3 fill-[#00b67a] opacity-30 md:h-3.5 md:w-3.5" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[900px] px-5 pb-3 md:px-8">
          <ProgressBar value={progress} />
        </div>
      </div>

      {/* Screen area */}
      <div className="relative mx-auto flex w-full max-w-[900px] flex-col px-5 pt-10 md:px-8 md:pt-16">
        <AnimatePresence mode="wait">
          <div key={current} className="flex flex-col">
            {current === "name" && (
              <ScreenShell
                title="Let's get started."
                sub="A few questions to build your personalized program."
                footer={
                  <>
                    <PrimaryButton
                      onClick={next}
                      disabled={!answers.firstName.trim() || !/^\S+@\S+\.\S+$/.test(answers.email)}
                    >
                      Continue
                    </PrimaryButton>
                    <p className="mt-4 text-[12px] text-ink/45">
                      Free to start. No commitment. Results in minutes.
                    </p>
                  </>
                }
              >
                <TextField
                  label="First name"
                  value={answers.firstName}
                  onChange={(v) => set({ firstName: v })}
                  placeholder="Ava"
                  autoFocus
                />
                <TextField
                  label="Email"
                  type="email"
                  value={answers.email}
                  onChange={(v) => set({ email: v })}
                  placeholder="you@email.com"
                />
              </ScreenShell>
            )}

            {current === "category" && (
              <ScreenShell
                title="What can we help you with?"
                sub="Select what you're most interested in. You can add more programs later."
                footer={
                  <p className="text-[13px] text-ink/55">
                    Not sure? Select your primary concern and your physician will
                    guide you from there.
                  </p>
                }
              >
                <CategoryCard
                  tag="GLP-1 Programs"
                  title="Weight Loss"
                  sub="Lose weight and keep it off with physician-prescribed GLP-1 therapy"
                  image={catWeight.url}
                  position="object-center"
                  onClick={() => pickThenNext("category", "weight_loss")}
                />
                <CategoryCard
                  tag="Sexual Wellness"
                  title="Sexual Health"
                  sub="ED treatment, libido, and performance. Discreet and physician-supervised."
                  image={catSexual.url}
                  position="object-center"
                  onClick={() => pickThenNext("category", "sexual_health")}
                />
                <CategoryCard
                  tag="Prescription Skincare"
                  title="Skin & Hair"
                  sub="Physician-formulated treatments for acne, aging, and hair loss"
                  image={catSkin.url}
                  position="object-center"
                  onClick={() => pickThenNext("category", "skin_hair")}
                />
                <CategoryCard
                  tag="NAD+ · HRT · TRT"
                  title="Hormones & Longevity"
                  sub="TRT, HRT, NAD+. Restore energy, balance, and vitality."
                  image={catLongevity.url}
                  position="object-center"
                  onClick={() => pickThenNext("category", "hormones")}
                />

              </ScreenShell>
            )}

            {current === "dob" && (
              <ScreenShell
                title="When were you born?"
                sub="You must be 18 or older to use Blissley."
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

            {current === "sex" && (
              <ScreenShell
                title="What was your sex assigned at birth?"
                sub="This helps us match you to the right physician and medication."
              >
                <OptionCard
                  label="Female"
                  selected={answers.sex === "female"}
                  onClick={() => pickThenNext("sex", "female")}
                />
                <OptionCard
                  label="Male"
                  selected={answers.sex === "male"}
                  onClick={() => pickThenNext("sex", "male")}
                />
              </ScreenShell>
            )}

            {current === "state" && (
              <ScreenShell
                title="Where will your medication be shipped?"
                sub="We verify physician licensing and pharmacy coverage by state."
                footer={
                  <>
                    <PrimaryButton onClick={next} disabled={!answers.state}>
                      Continue
                    </PrimaryButton>
                    <p className="mt-4 text-[12px] text-ink/45">
                      We currently serve patients in all 50 states.
                    </p>
                  </>
                }
              >
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
              </ScreenShell>
            )}

            {/* ─────── Weight Loss ─────── */}
            {current === "wl_goal" && (
              <ScreenShell title={`${answers.firstName || "There"}, what's your main goal?`}>
                {[
                  "Lose a significant amount of weight",
                  "Lose the last 10-20 pounds",
                  "Stop the constant thoughts about food",
                  "Feel healthier and more energetic",
                  "Get my life back",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.wlGoal === o}
                    onClick={() => pickThenNext("wlGoal", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "wl_howlong" && (
              <ScreenShell title="How long have you been struggling with your weight?">
                {[
                  "Less than 6 months",
                  "6 months to 1 year",
                  "1 to 3 years",
                  "3 to 5 years",
                  "More than 5 years",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.wlHowLong === o}
                    onClick={() => pickThenNext("wlHowLong", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "wl_tried" && (
              <ScreenShell
                title="What have you tried before?"
                sub="Select everything that applies."
                footer={<PrimaryButton onClick={next} disabled={!(answers.wlTried?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {[
                  "Calorie counting or tracking",
                  "Low-carb or keto",
                  "Intermittent fasting",
                  "Weight loss programs (WW, Noom, Jenny Craig)",
                  "Prescription medication",
                  "Personal trainer or gym",
                  "Nothing, this is my first time",
                  "Other",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.wlTried?.includes(o) ?? false}
                    onClick={() => toggleMulti("wlTried", o, "Nothing, this is my first time")}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "wl_hw" && (() => {
              const categories = [
                { key: "under", label: "Underweight", range: "<18.5", min: 0, max: 18.5, color: "#7aa5c4" },
                { key: "normal", label: "Normal", range: "18.5–24.9", min: 18.5, max: 25, color: "#6fbf8a" },
                { key: "over", label: "Overweight", range: "25–29.9", min: 25, max: 30, color: "#e8a86b" },
                { key: "obese", label: "Obese", range: "≥30", min: 30, max: 45, color: "#ee7273" },
              ];
              const activeIdx = bmi === null ? -1 : categories.findIndex((c) => bmi < c.max);
              const active = activeIdx === -1 ? categories[categories.length - 1] : categories[activeIdx];
              const displayLabel = bmi !== null && bmi >= 35 ? "Severe Obesity" : active?.label ?? "";
              const pct = bmi === null ? 0 : Math.min(100, Math.max(2, ((bmi - 12) / (45 - 12)) * 100));
              return (
                <ScreenShell
                  title="What is your current height and weight?"
                  sub="We'll calculate your BMI to check your eligibility."
                  footer={
                    <>
                      <PrimaryButton
                        onClick={next}
                        disabled={!answers.heightFt || !answers.weightLbs}
                      >
                        Continue
                      </PrimaryButton>
                      <p className="mt-4 text-[12px] text-ink/45">
                        GLP-1 programs are typically recommended for a BMI of 27 or above.
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
                        <TextField
                          type="number"
                          value={answers.heightFt ?? ""}
                          onChange={(v) => set({ heightFt: v })}
                          placeholder="5"
                        />
                        <span className="mt-1.5 block text-[12px] text-ink/50">Feet</span>
                      </div>
                      <div>
                        <TextField
                          type="number"
                          value={answers.heightIn ?? ""}
                          onChange={(v) => set({ heightIn: v })}
                          placeholder="6"
                        />
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
                      <span className="mb-2 block text-[13px] font-medium text-ink/60">Your BMI Result</span>
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
                            <span
                              className={`text-[12px] font-medium transition-colors ${
                                i === activeIdx || (activeIdx === -1 && c.key === "obese")
                                  ? "text-ink"
                                  : "text-ink/45"
                              }`}
                            >
                              {c.label}
                            </span>
                            <span className="text-[11px] text-ink/40">{c.range}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </ScreenShell>
              );
            })()}


            {current === "wl_glp1" && (
              <ScreenShell
                title="Have you taken GLP-1 medication before?"
                footer={
                  answers.glp1History?.startsWith("Yes")
                    ? <PrimaryButton onClick={next}>Continue</PrimaryButton>
                    : undefined
                }
              >
                {[
                  "Yes, I'm currently on one",
                  "Yes, I took one recently (within the last month)",
                  "Yes, I took one in the past",
                  "No, this would be my first time",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.glp1History === o}
                    onClick={() => {
                      if (o.startsWith("No")) {
                        pickThenNext("glp1History", o);
                      } else {
                        set({ glp1History: o });
                      }
                    }}
                  />
                ))}
                {answers.glp1History === "Yes, I'm currently on one" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 grid gap-3 rounded-2xl border border-ink/10 bg-white p-5"
                  >
                    <TextField
                      label="Which one?"
                      value={answers.glp1Which ?? ""}
                      onChange={(v) => set({ glp1Which: v })}
                      placeholder="Semaglutide, Tirzepatide, Other"
                    />
                    <TextField
                      label="Current dose"
                      value={answers.glp1Dose ?? ""}
                      onChange={(v) => set({ glp1Dose: v })}
                      placeholder="e.g. 0.5 mg weekly"
                    />
                    <TextField
                      label="How long?"
                      value={answers.glp1HowLong ?? ""}
                      onChange={(v) => set({ glp1HowLong: v })}
                      placeholder="e.g. 3 months"
                    />
                  </motion.div>
                )}
              </ScreenShell>
            )}

            {current === "wl_conditions" && (
              <ScreenShell
                title="Do any of these apply to you?"
                sub="These conditions can support your eligibility."
                footer={<PrimaryButton onClick={next} disabled={!(answers.wlConditions?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {[
                  "None of the above",
                  "High blood pressure",
                  "High cholesterol",
                  "Prediabetes",
                  "Type 2 diabetes (not on insulin)",
                  "PCOS",
                  "Sleep apnea",
                  "Acid reflux or GERD",
                  "Joint pain related to weight",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.wlConditions?.includes(o) ?? false}
                    onClick={() => toggleMulti("wlConditions", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {/* ─────── Sexual Health ─────── */}
            {current === "sh_concern" && (
              <ScreenShell title="What would you like to address?">
                {[
                  "I have difficulty achieving or maintaining an erection",
                  "I want to improve my libido or sexual desire",
                  "I want to improve my overall sexual performance",
                  "I'm not sure, I want to discuss with a physician",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.shConcern === o}
                    onClick={() => pickThenNext("shConcern", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "sh_howlong" && (
              <ScreenShell title="How long have you been experiencing this?">
                {[
                  "Less than 3 months",
                  "3 to 6 months",
                  "6 months to 1 year",
                  "More than 1 year",
                  "It comes and goes",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.shHowLong === o}
                    onClick={() => pickThenNext("shHowLong", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "sh_tried" && (
              <ScreenShell
                title="Have you tried any treatments before?"
                sub="Select everything that applies."
                footer={<PrimaryButton onClick={next} disabled={!(answers.shTried?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {[
                  "Over-the-counter supplements",
                  "Prescription medication (Viagra, Cialis, etc.)",
                  "Lifestyle changes (diet, exercise)",
                  "Nothing, this is my first time",
                  "Other",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.shTried?.includes(o) ?? false}
                    onClick={() => toggleMulti("shTried", o, "Nothing, this is my first time")}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "sh_health" && (
              <ScreenShell
                title="A couple of quick questions for your physician."
                footer={<PrimaryButton onClick={next} disabled={!(answers.shHealth?.length ?? 0)}>Continue</PrimaryButton>}
              >
                <div>
                  <p className="mb-3 text-[14px] font-medium text-ink/70">Do any of these apply to you?</p>
                  <div className="flex flex-col gap-3">
                    {[
                      "None of the above",
                      "High blood pressure",
                      "Heart disease or recent cardiac event",
                      "Taking nitrates or blood thinners",
                      "Diabetes",
                    ].map((o) => (
                      <OptionCard
                        key={o}
                        label={o}
                        compact
                        selected={answers.shHealth?.includes(o) ?? false}
                        onClick={() => toggleMulti("shHealth", o)}
                      />
                    ))}
                  </div>
                </div>
                {answers.sex === "male" && answers.shConcern?.startsWith("I have difficulty") && (
                  <div className="mt-6">
                    <p className="mb-3 text-[14px] font-medium text-ink/70">What best describes your situation?</p>
                    <div className="flex flex-col gap-3">
                      {[
                        "I rarely get erections",
                        "I get erections but they don't last",
                        "Erections are weaker than they used to be",
                        "Performance varies, sometimes fine, sometimes not",
                      ].map((o) => (
                        <OptionCard
                          key={o}
                          label={o}
                          compact
                          selected={answers.shEDContext === o}
                          onClick={() => set({ shEDContext: o })}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </ScreenShell>
            )}

            {/* ─────── Skin ─────── */}
            {current === "sk_concern" && (
              <ScreenShell title="What would you like to treat?">
                {[
                  "Acne or breakouts",
                  "Fine lines, wrinkles, or skin aging",
                  "Dark spots or uneven skin tone",
                  "Hair thinning or hair loss",
                  "Multiple concerns",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.skConcern === o}
                    onClick={() => pickThenNext("skConcern", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "sk_howlong" && (
              <ScreenShell title="How long have you been dealing with this?">
                {[
                  "Less than 6 months",
                  "6 months to 1 year",
                  "1 to 3 years",
                  "More than 3 years",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.skHowLong === o}
                    onClick={() => pickThenNext("skHowLong", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "sk_tried" && (
              <ScreenShell
                title="What have you tried?"
                sub="Select everything that applies."
                footer={<PrimaryButton onClick={next} disabled={!(answers.skTried?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {[
                  "Over-the-counter skincare products",
                  "Prescription creams or treatments",
                  "Dermatologist visits",
                  "Nothing, first time seeking treatment",
                  "Other",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.skTried?.includes(o) ?? false}
                    onClick={() => toggleMulti("skTried", o, "Nothing, first time seeking treatment")}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "sk_skin" && (
              <ScreenShell
                title="Help us understand your skin."
                footer={<PrimaryButton onClick={next} disabled={!answers.skSkinType}>Continue</PrimaryButton>}
              >
                <div>
                  <p className="mb-3 text-[14px] font-medium text-ink/70">How would you describe your skin type?</p>
                  <div className="flex flex-col gap-3">
                    {["Oily","Dry","Combination","Sensitive","Normal / Not sure"].map((o) => (
                      <OptionCard
                        key={o}
                        label={o}
                        compact
                        selected={answers.skSkinType === o}
                        onClick={() => set({ skSkinType: o })}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="mb-3 text-[14px] font-medium text-ink/70">Do any of these apply?</p>
                  <div className="flex flex-col gap-3">
                    {[
                      "None of the above",
                      "Rosacea or redness",
                      "Eczema or psoriasis",
                      "History of cold sores",
                      "Currently pregnant or breastfeeding",
                    ].map((o) => (
                      <OptionCard
                        key={o}
                        label={o}
                        compact
                        selected={answers.skConditions?.includes(o) ?? false}
                        onClick={() => toggleMulti("skConditions", o)}
                      />
                    ))}
                  </div>
                </div>
              </ScreenShell>
            )}

            {/* ─────── Hormones ─────── */}
            {current === "hm_concern" && (
              <ScreenShell title="What's bringing you here?">
                {(answers.sex === "male"
                  ? [
                      "Low energy, motivation, or drive",
                      "Low libido or sexual performance",
                      "Difficulty building muscle or losing fat",
                      "Brain fog or mood changes",
                      "I've been told I have low testosterone",
                      "NAD+ or anti-aging",
                    ]
                  : [
                      "Hot flashes or night sweats",
                      "Mood swings or anxiety",
                      "Low libido",
                      "Fatigue or brain fog",
                      "Weight gain or body composition changes",
                      "NAD+ or anti-aging",
                    ]
                ).map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.hmConcern === o}
                    onClick={() => pickThenNext("hmConcern", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "hm_howlong" && (
              <ScreenShell title="How long have you been experiencing these symptoms?">
                {[
                  "Less than 3 months",
                  "3 to 6 months",
                  "6 months to 1 year",
                  "More than 1 year",
                ].map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    selected={answers.hmHowLong === o}
                    onClick={() => pickThenNext("hmHowLong", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "hm_health" && (
              <ScreenShell
                title="A few quick questions."
                footer={<PrimaryButton onClick={next} disabled={!answers.hmTested || !answers.hmOnTherapy}>Continue</PrimaryButton>}
              >
                <div>
                  <p className="mb-3 text-[14px] font-medium text-ink/70">Have you had your hormone levels tested recently?</p>
                  <div className="flex flex-col gap-3">
                    {["Yes, within the last 6 months","Yes, more than 6 months ago","No"].map((o) => (
                      <OptionCard
                        key={o}
                        label={o}
                        compact
                        selected={answers.hmTested === o}
                        onClick={() => set({ hmTested: o })}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="mb-3 text-[14px] font-medium text-ink/70">Are you currently on any hormone therapy?</p>
                  <div className="flex flex-col gap-3">
                    {[
                      answers.sex === "male" ? "Yes, TRT" : "Yes, HRT",
                      "Yes, other hormone treatment",
                      "No",
                    ].map((o) => (
                      <OptionCard
                        key={o}
                        label={o}
                        compact
                        selected={answers.hmOnTherapy === o}
                        onClick={() => set({ hmOnTherapy: o })}
                      />
                    ))}
                  </div>
                </div>
              </ScreenShell>
            )}

            {/* ─────── Medical common ─────── */}
            {current === "contra" && (
              <ScreenShell
                title="Just a few safety questions."
                sub="Select anything that applies. If none apply, select 'None of the above.'"
                footer={<PrimaryButton onClick={next} disabled={!(answers.medContraindications?.length ?? 0)}>Continue</PrimaryButton>}
              >
                {buildContraList(answers.category).map((o) => (
                  <OptionCard
                    key={o}
                    label={o}
                    compact
                    selected={answers.medContraindications?.includes(o) ?? false}
                    onClick={() => toggleMulti("medContraindications", o)}
                  />
                ))}
              </ScreenShell>
            )}

            {current === "meds" && (
              <ScreenShell
                title={`Almost done, ${answers.firstName || "there"}.`}
                footer={
                  <PrimaryButton
                    onClick={next}
                    disabled={!answers.medications?.trim() || !answers.allergies?.trim() || !answers.phone?.trim() || !answers.consentTOS}
                  >
                    Get My Results
                  </PrimaryButton>
                }
              >
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-ink/70">Current medications</span>
                  <textarea
                    value={answers.medications ?? ""}
                    onChange={(e) => set({ medications: e.target.value })}
                    placeholder="List name, dose, and frequency. Type 'none' if not applicable."
                    rows={3}
                    className="w-full rounded-2xl border border-ink/12 bg-white p-4 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-ink/70">Medication allergies</span>
                  <textarea
                    value={answers.allergies ?? ""}
                    onChange={(e) => set({ allergies: e.target.value })}
                    placeholder="List allergies and reactions. Type 'none' if not applicable."
                    rows={3}
                    className="w-full rounded-2xl border border-ink/12 bg-white p-4 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
                  />
                </label>
                <TextField
                  label="Phone number"
                  type="tel"
                  value={answers.phone ?? ""}
                  onChange={(v) => set({ phone: v })}
                  placeholder="(555) 123-4567"
                />
                <div className="mt-2 flex flex-col gap-3">
                  <ConsentRow
                    checked={!!answers.consentTOS}
                    onChange={(v) => set({ consentTOS: v })}
                    label={<>I agree to Blissley's <a className="underline underline-offset-2" href="/terms">Terms</a>, <a className="underline underline-offset-2" href="/privacy">Privacy Policy</a>, and Telehealth Consent.</>}
                  />
                  <ConsentRow
                    checked={!!answers.consentSMS}
                    onChange={(v) => set({ consentSMS: v })}
                    label={<>I agree to receive SMS updates about my care and orders.</>}
                  />
                </div>
              </ScreenShell>
            )}

            {current === "loading" && <LoadingScreen answers={answers} />}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────  Helpers  ──────────────────── */
function buildContraList(cat?: Category) {
  const core = [
    "None of the above",
    "Personal or family history of medullary thyroid cancer",
    "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
    "Active cancer (current or within past year)",
    "Severe kidney disease (on dialysis)",
    "Severe liver disease or cirrhosis",
    "History of eating disorder",
    "Active suicidal thoughts or recent attempt",
    "Known allergy to any prescribed medication",
  ];
  const add: Record<Category, string[]> = {
    weight_loss: [
      "Type 1 diabetes",
      "Type 2 diabetes managed with insulin",
      "Organ transplant on anti-rejection medication",
      "Severe GI condition (gastroparesis, IBD)",
      "Untreated alcohol or substance use disorder",
    ],
    sexual_health: [
      "Heart disease making sexual activity unsafe",
      "Currently taking nitrates",
      "Uncontrolled high blood pressure",
    ],
    skin_hair: ["Currently pregnant or breastfeeding"],
    hormones: [
      "History of hormone-sensitive cancer (breast, prostate)",
      "Untreated cardiovascular disease",
    ],
  };
  return cat ? [...core, ...add[cat]] : core;
}

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

/* ────────────────────  Loading screen  ──────────────────── */
function LoadingScreen({ answers }: { answers: Answers }) {
  const steps = useMemo(() => {
    const state = answers.state ?? "your state";
    switch (answers.category) {
      case "weight_loss":
        return [
          "Reviewing your health profile…",
          "Calculating your BMI and eligibility…",
          "Matching you to the right GLP-1 program…",
          "Building your personalized plan…",
          `Checking pharmacy coverage in ${state}…`,
        ];
      case "sexual_health":
        return [
          "Reviewing your profile…",
          "Matching you to a specialist physician…",
          "Preparing your treatment options…",
          `Checking coverage in ${state}…`,
        ];
      case "skin_hair":
        return [
          "Reviewing your skin profile…",
          "Identifying the right formulation…",
          "Preparing your physician-recommended plan…",
        ];
      case "hormones":
        return [
          "Reviewing your hormone profile…",
          "Matching you to an endocrinology specialist…",
          "Building your personalized protocol…",
        ];
      default:
        return ["Preparing your plan…"];
    }
  }, [answers.category, answers.state]);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step >= steps.length) {
      const t = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, steps.length]);

  if (done) {
    const headline =
      answers.category === "weight_loss"
        ? "94.6%"
        : "Your program is ready";
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-full max-w-[640px] flex-col items-center py-10 text-center"
      >
        <div className="rounded-full border border-ever/25 bg-ever/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ever">
          Results ready
        </div>
        <h2 className="mt-6 font-hero text-[34px] font-bold tracking-[-0.03em] text-ink md:text-[44px]">
          {answers.firstName || "You"}, your results are ready.
        </h2>
        <p className="mt-3 max-w-[440px] text-[15px] leading-[1.55] text-ink/60">
          Based on your profile, a physician will review your case within 24 hours.
        </p>
        {answers.category === "weight_loss" ? (
          <div className="mt-10 flex flex-col items-center">
            <span className="font-hero text-[88px] font-bold leading-none tracking-[-0.05em] text-ink md:text-[120px]">
              {headline}
            </span>
            <span className="mt-2 text-[13px] font-medium uppercase tracking-[0.14em] text-ink/50">
              Match confidence
            </span>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-ink/10 bg-white px-6 py-5 text-[16px] font-medium text-ink">
            {headline}
          </div>
        )}
        <div className="mt-10 w-full">
          <PrimaryButton onClick={() => (window.location.href = "/")}>
            See My Plan
          </PrimaryButton>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex w-full max-w-[560px] flex-col items-center py-16 text-center"
    >
      <div className="relative grid h-20 w-20 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full border-[3px] border-ever/25 border-t-ever"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-[22px] font-bold text-ever">{step + 1}</span>
      </div>
      <h2 className="mt-8 font-hero text-[24px] font-bold tracking-[-0.02em] text-ink md:text-[28px]">
        Building your plan
      </h2>
      <div className="mt-8 w-full space-y-3">
        <AnimatePresence mode="popLayout">
          {steps.slice(0, step + 1).map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: i === step ? 1 : 0.5, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45 }}
              className="text-[15px] font-medium text-ink/80"
            >
              {s}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
