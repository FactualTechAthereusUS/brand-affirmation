import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  HeartPulse,
  LockKeyhole,
  MessageCircle,
  Moon,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Syringe,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MotionButton } from "@/components/MotionButton";

export const Route = createFileRoute("/sales-35")({
  head: () => ({
    meta: [
      { title: "Your Personalized GLP-1 Plan | Blissley" },
      {
        name: "description",
        content: "Review your personalized Blissley GLP-1 plan, medication options, physician support, pricing, and expected treatment journey.",
      },
      { property: "og:title", content: "Your Personalized GLP-1 Plan | Blissley" },
      { property: "og:description", content: "A physician-reviewed GLP-1 plan with clear pricing, ongoing support, and medication delivered to your door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sales35Page,
});

type Theme = "light" | "dark";
type Medication = "sema" | "tirz";
type PlanKey = "monthly" | "three" | "six";

type Plan = {
  key: PlanKey;
  title: string;
  eyebrow: string;
  charged: number;
  monthly: number;
  savings: number;
  detail: string;
};

const TICKER = [
  `“I DIDN'T KNOW EVERYONE'S HEAD WASN'T LIKE MINE” — JENNIFER R.`,
  `“50 POUNDS DOWN IN 7 MONTHS” — MICHAEL T.`,
  `“I AVOIDED EVERY CAMERA FOR 4 YEARS. NOT ANYMORE” — DANA W.`,
  `“THE BILLING WAS EXACTLY WHAT THEY SAID IT WOULD BE” — TRICIA M.`,
  `“10 YEARS OF THE SAME ADVICE THAT NEVER WORKED” — LISA K.`,
];

const MEDICATIONS = [
  {
    key: "sema" as const,
    name: "Semaglutide",
    badge: "Most popular",
    line: "Most popular, most affordable GLP-1 medication.",
    first: 259,
    then: 299,
    icon: HeartPulse,
  },
  {
    key: "tirz" as const,
    name: "Tirzepatide",
    badge: "Most potent",
    line: "Dual-action correction for a body that needs more than one lever.",
    first: 299,
    then: 399,
    icon: Sparkles,
  },
];

const PLAN_MAP: Record<Medication, Plan[]> = {
  sema: [
    { key: "monthly", title: "Monthly", eyebrow: "Flexible", charged: 259, monthly: 299, savings: 40, detail: "$259 first month, then $299" },
    { key: "three", title: "3-Month", eyebrow: "Most popular", charged: 711, monthly: 237, savings: 186, detail: "One clear 90-day commitment" },
    { key: "six", title: "6-Month", eyebrow: "Best deal", charged: 1422, monthly: 237, savings: 372, detail: "Nausea kit, lifetime price lock, priority review" },
  ],
  tirz: [
    { key: "monthly", title: "Monthly", eyebrow: "Flexible", charged: 299, monthly: 399, savings: 100, detail: "$299 first month, then $399" },
    { key: "three", title: "3-Month", eyebrow: "Most popular", charged: 1017, monthly: 339, savings: 180, detail: "One clear 90-day commitment" },
    { key: "six", title: "6-Month", eyebrow: "Best deal", charged: 1794, monthly: 299, savings: 600, detail: "Nausea kit, lifetime price lock, priority review" },
  ],
};

const INCLUDED = [
  ["GLP-1 medication, physician-matched to your body", "$1,300/mo"],
  ["Licensed physician review and prescription", "$147"],
  ["Unlimited 24/7 messaging with your physician", "$99/mo"],
  ["Blissley Patient Portal, dose tracking, order history, secure messaging", "$19/mo"],
  ["Free overnight, temperature-controlled shipping", "$19/shipment"],
  ["Home injection kit, needles, swabs, sharps container", "$14"],
  ["Blissley Education Library, dosing, nutrition, and side-effect guides", "$39"],
  ["Free dose adjustments, no extra consult fee", "$75/adjustment"],
];

const PHASES = [
  {
    range: "Week 1–2",
    number: "01",
    title: "Adjustment",
    items: [
      "Your physician starts you on the correct titration dose for your body",
      "Mild nausea is common in the first week and expected",
      "Nothing drastic yet, and that's normal. The signal is just starting to change",
    ],
  },
  {
    range: "Week 3–4",
    number: "02",
    title: "The noise starts to change",
    items: [
      "Most patients report food noise beginning to quiet down around this point",
      "The pantry stops calling your name at 9pm out of habit",
      "Meals start to feel different, less like a negotiation with yourself",
    ],
  },
  {
    range: "Month 2–3",
    number: "03",
    title: "Momentum",
    items: [
      "Visible weight loss for most patients",
      "The scale moving again if you'd plateaued before",
      "Clothes fitting the way they used to, without a new diet attached to it",
      "Energy shifts and sleep often improves",
    ],
  },
  {
    range: "Month 3+",
    number: "04",
    title: "Lock-in",
    items: [
      "Your dose may increase as your body responds",
      "Your price does not increase. It is locked from the plan you selected",
      "This becomes your new baseline, not a temporary state",
    ],
  },
];

const REVIEWERS = [
  ["Dr. Scott Nass, MD", "Primary reviewing physician. Reviews the majority of Blissley GLP-1 cases personally."],
  ["Dr. Frank Suppa, DO", "Blissley clinical review team"],
  ["Dr. Courtney Patterson-Manfredi, APRN", "Blissley clinical review team"],
  ["Dr. May-Lynn Chu, DO", "Blissley clinical review team"],
];

const COMPARISON = [
  ["Price", "$259–399/mo", "$1,300+/mo", "Varies; often hidden"],
  ["Physician matches sema or tirz", "Yes", "No", "Rarely explained"],
  ["24/7 physician messaging", "Included", "No", "Rarely included"],
  ["Price locked as dose increases", "Yes", "No", "Rarely disclosed"],
  ["Charged before approval", "Never", "N/A", "Sometimes"],
  ["Refund if not approved", "Full refund", "N/A", "Varies"],
];

const REVIEWS = [
  ["Food noise stopped by week 3", `“I didn't know everyone's head wasn't like mine.”`, "Jennifer R., 41"],
  ["330 lbs to under 200", `“I've gotten parts of myself back I thought were gone forever.”`, "Sarah M., 44"],
  ["50 pounds down in 7 months", `“Still amazed every single day.”`, "Michael T., 52"],
  ["Same price when the dose doubled", `“The billing was exactly what they said.”`, "Tricia M., 51"],
  ["Down 34 lbs", `“I avoided every camera for 4 years.”`, "Dana W., 44"],
  ["41 lbs total", `“They matched my current dose exactly.”`, "Maria C., 43"],
  ["14 lbs down in 6 weeks", `“10 years of the same advice that never worked.”`, "Lisa K., 39"],
  ["Down 22 pounds", `“The real change was mental clarity.”`, "Nikki L., 38"],
];

const FAQS = [
  ["I've already tried everything, keto, fasting, a coach, Weight Watchers, and nothing stuck. Why would this be different?", "Because none of those were actually aimed at the real problem. They all ask you to out-discipline a signal your brain isn't receiving properly. This treats the signal directly, which is why it works differently than another diet would."],
  ["My bloodwork already came back normal. Doesn't that mean there's nothing actually wrong?", "Standard bloodwork doesn't measure this specific signal, the same way it wouldn't catch a lot of things doctors have limited time to explain in a 12-minute visit. Normal labs and a real, treatable problem can both be true at the same time."],
  ["I have PCOS, or I'm in perimenopause. Will this actually work for me?", "Both conditions make this exact signal harder to manage on your own, which is exactly what a physician-guided GLP-1 plan is built to address. Your physician reviews your specific history before recommending a dose."],
  ["How does Blissley work?", "You complete a short intake, a licensed physician reviews your health history, and if you're approved, your GLP-1 medication ships to your door in a temperature-controlled overnight box. Your physician supports you the whole way through unlimited secure messaging."],
  ["Is the medication real semaglutide or tirzepatide?", "Yes. Every prescription is prepared by a state-licensed U.S. compounding pharmacy under a licensed physician's order."],
  ["What if I'm not approved?", "You are never charged. Your card is only charged after a physician has approved your prescription."],
  ["How do I cancel?", "Monthly plans cancel anytime in one click from your patient portal. 3 and 6-month plans include the results guarantee above."],
  ["What dose will I take?", "Your physician starts you at a titration dose appropriate to you and adjusts as needed. Your price does not increase as your dose does, that's locked in from your plan."],
  ["Where do prescriptions come from?", "State-licensed U.S. pharmacies, prepared to your physician's exact specifications, shipped overnight in a temperature-controlled box."],
];

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return (
    <div className="s35-theme-toggle" role="group" aria-label="Page theme">
      <MotionButton type="button" lift={false} onClick={() => setTheme("light")} aria-pressed={theme === "light"} aria-label="Use Blissley light theme">
        <Sun aria-hidden="true" /> <span>White</span>
      </MotionButton>
      <MotionButton type="button" lift={false} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"} aria-label="Use dark orange theme">
        <Moon aria-hidden="true" /> <span>Dark</span>
      </MotionButton>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="s35-kicker">{children}</div>;
}

function CheckRow({ children }: { children: React.ReactNode }) {
  return <li><span className="s35-check"><Check aria-hidden="true" /></span><span>{children}</span></li>;
}

function WeightChart() {
  const path = "M 40 46 C 118 48, 146 60, 205 92 C 270 127, 290 139, 350 167 C 421 201, 468 209, 536 229 C 591 245, 625 251, 680 254";
  return (
    <div className="s35-chart" aria-label="Projected trajectory from 210 pounds to 165 pounds, September through March">
      <div className="s35-chart-top"><span>210 lbs</span><ArrowRight /><strong>165 lbs</strong></div>
      <svg viewBox="0 0 720 300" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="s35area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--s35-accent)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--s35-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[46, 116, 186, 256].map((y) => <line key={y} x1="38" x2="682" y1={y} y2={y} className="s35-chart-grid" />)}
        <path d={`${path} L 680 276 L 40 276 Z`} fill="url(#s35area)" />
        <motion.path d={path} className="s35-chart-line" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
        <circle cx="40" cy="46" r="8" className="s35-chart-dot" /><circle cx="680" cy="254" r="8" className="s35-chart-dot" />
        {[[40,"Sep"],[147,"Oct"],[254,"Nov"],[361,"Dec"],[468,"Jan"],[575,"Feb"],[680,"Mar"]].map(([x,m]) => <text key={m} x={x} y="296" textAnchor="middle">{m}</text>)}
      </svg>
      <div className="s35-chart-caption"><span>21.4% projected reduction</span><span>September to March</span></div>
    </div>
  );
}

function Sales35Page() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [theme, setThemeState] = useState<Theme>("light");
  const [medication, setMedication] = useState<Medication>("sema");
  const [plan, setPlan] = useState<PlanKey>("three");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [offerSeen, setOfferSeen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("blissley-sales-theme");
    setThemeState(saved === "dark" || saved === "light" ? saved : "light");
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem("blissley-sales-theme", next);
  };

  useEffect(() => {
    const offer = document.getElementById("choose-medication");
    if (!offer) return;
    const observer = new IntersectionObserver(([entry]) => setOfferSeen(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(offer);
    return () => observer.disconnect();
  }, []);

  const selectedPlan = useMemo(() => PLAN_MAP[medication].find((item) => item.key === plan) ?? PLAN_MAP[medication][1], [medication, plan]);
  const submit = () => navigate({ to: "/checkout/charged-before", search: { tx: medication, plan } });

  const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="s35" data-theme={theme}>
      {/* Reference: Mars Men main product, pdp-marquee__bar identity-outcome ticker. */}
      <div className="s35-ticker" aria-label="Patient outcomes">
        <div className="s35-ticker-track">
          {[...TICKER, ...TICKER].map((item, index) => <span key={`${item}-${index}`}>{item}<i aria-hidden="true">✦</i></span>)}
        </div>
      </div>

      <header className="s35-header">
        <img src="/assets/blissley-logo.png" alt="Blissley" width="230" height="72" />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>

      <main>
        {/* Reference: personalized Blissley result composed with Mars Men PDP's compact eyebrow + high-impact hero hierarchy. */}
        <section className="s35-hero s35-shell">
          <motion.div {...reveal} className="s35-hero-copy">
            <SectionLabel><span className="s35-live-dot" /> Intake complete · Ready for review</SectionLabel>
            <h1><span>Sarah, your personalized</span> GLP-1 plan is ready for physician review.</h1>
            <p>Based on your intake, you're a strong candidate for provider-supervised GLP-1 treatment. A licensed physician will review your case and confirm your prescription, typically within 3 hours.</p>
            <div className="s35-trust-row">
              <span><ShieldCheck /> HIPAA compliant</span><span><Stethoscope /> U.S.-licensed review</span><span><Clock3 /> Typically 3 hours</span>
            </div>
          </motion.div>
          <motion.div {...reveal} className="s35-hero-chart">
            <SectionLabel>Your projected trajectory</SectionLabel>
            <WeightChart />
            <p>This is not a guarantee. It's a projection based on outcomes reported by patients with a similar starting profile.</p>
          </motion.div>
        </section>

        {/* Reference: Advertorial current-situation mirror, styled with Mars Men oversized black editorial bands. */}
        <section className="s35-story">
          <div className="s35-shell s35-story-grid">
            <motion.div {...reveal}>
              <SectionLabel>This is probably already your story</SectionLabel>
              <h2>You did everything right. <em>The signal still wasn't getting through.</em></h2>
            </motion.div>
            <motion.div {...reveal} className="s35-prose">
              <p>You've probably already tried keto, intermittent fasting, maybe a nutrition coach, maybe Weight Watchers twice. You did everything right for a while. The scale barely moved, or it moved and then came right back.</p>
              <p>You've had bloodwork come back “normal” while still feeling like something is actually wrong. If you have PCOS or you're in perimenopause, you've probably been told this part is just harder for you and to accept it.</p>
              <p>And there's the part almost nobody says out loud: the constant thinking about food. Not real hunger. Just noise. What you already ate, what you're going to eat next, whether today already counts as a failure.</p>
            </motion.div>
          </div>
          <div className="s35-mechanism s35-shell">
            <div className="s35-signal-icon" aria-hidden="true"><svg viewBox="0 0 96 96"><path d="M18 49c7-17 18-26 31-26 15 0 27 10 30 27M28 61c5 9 12 14 22 14 11 0 19-6 23-17M48 9v12M11 31l12 7M85 31l-12 7"/><circle cx="49" cy="48" r="10"/></svg></div>
            <div><SectionLabel>The reveal</SectionLabel><p>There's a small part of your brain whose job is to receive one signal: you've had enough, stop eating. After years of the wrong food and extra weight, that exact spot can stop receiving the signal properly.</p></div>
            <strong>GLP-1 medication works on exactly that signal. <span>Not willpower. Not restriction. The actual mechanism.</span></strong>
          </div>
        </section>

        {/* Reference: Mars Men tier-card anatomy and PDP variant selector; no ecommerce product photography. */}
        <section id="choose-medication" className="s35-offer s35-shell">
          <motion.div {...reveal} className="s35-section-head">
            <SectionLabel>Step 1 · Your medication</SectionLabel>
            <h2>Choose your medication.</h2>
            <p>Same price. All dosage levels. No hidden fees. Everything included.</p>
          </motion.div>
          <div className="s35-med-grid">
            {MEDICATIONS.map((item) => {
              const Icon = item.icon;
              const selected = medication === item.key;
              return (
                <MotionButton key={item.key} type="button" className="s35-med-card" data-selected={selected} onClick={() => setMedication(item.key)} aria-pressed={selected}>
                  <div className="s35-med-card-top"><span className="s35-number">0{item.key === "sema" ? "1" : "2"}</span><span className="s35-badge">{item.badge}</span><span className="s35-radio">{selected && <Check />}</span></div>
                  <Icon className="s35-med-icon" aria-hidden="true" />
                  <h3>{item.name}</h3><p>{item.line}</p>
                  <div className="s35-price"><span>Prescribed for</span><strong>${item.first}</strong><small>first month<br />then ${item.then}/mo</small></div>
                  <ul>
                    <CheckRow>Free temperature-controlled overnight shipping</CheckRow>
                    <CheckRow>Prescribed and reviewed by U.S.-licensed physicians</CheckRow>
                    <CheckRow>Unlimited physician messaging</CheckRow>
                  </ul>
                </MotionButton>
              );
            })}
          </div>
          <p className="s35-choice-note">You can choose whichever medication you prefer, regardless of which one this page recommends.</p>
        </section>

        {/* Reference: Primal Storm ai-pricing-card triptych, badge, savings row, divider, check list, CTA. */}
        <section className="s35-plans-band">
          <div className="s35-shell">
            <motion.div {...reveal} className="s35-section-head">
              <SectionLabel>Step 2 · Select your plan</SectionLabel>
              <h2>{medication === "sema" ? "Semaglutide" : "Tirzepatide"}, on your terms.</h2>
              <p>Your dose can increase five times over. The price locked in on your 6-month plan never does.</p>
            </motion.div>
            <div className="s35-plan-grid">
              {PLAN_MAP[medication].map((item) => {
                const selected = plan === item.key;
                return (
                  <MotionButton type="button" key={item.key} className="s35-plan-card" data-selected={selected} data-featured={item.key === "three"} onClick={() => setPlan(item.key)} aria-pressed={selected}>
                    <span className="s35-plan-eyebrow"><i />{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <div className="s35-plan-price"><strong>${item.monthly}</strong><span>/mo</span></div>
                    <dl><div><dt>Charged today</dt><dd>${item.charged.toLocaleString()}</dd></div><div><dt>You save</dt><dd>${item.savings}</dd></div></dl>
                    <span className="s35-select-line"><span className="s35-radio">{selected && <Check />}</span>{selected ? "Selected" : "Select plan"}</span>
                  </MotionButton>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reference: Mars Men “Your Launch Kit Includes” plus IM8 itemized Real Cost stack. */}
        <section className="s35-value s35-shell">
          <motion.div {...reveal} className="s35-section-head s35-section-head-row">
            <div><SectionLabel>Your care kit</SectionLabel><h2>What's included in every plan.</h2></div>
            <p>Real value: <strong>over $1,690</strong> in month one.<br />What you pay: <strong>$259 or $299.</strong></p>
          </motion.div>
          <div className="s35-value-table" role="table" aria-label="Included plan value">
            <div className="s35-value-head" role="row"><span>What's included</span><span>Real value</span><span>What you pay</span></div>
            {INCLUDED.map(([name, value]) => <div role="row" key={name}><span><Check />{name}</span><span>{value}</span><strong>Included</strong></div>)}
          </div>
          <div className="s35-icon-strip"><span><ShieldCheck /> HIPAA compliant</span><span><Stethoscope /> Provider-prescribed</span><span><Truck /> Ships in 48 hours</span></div>
        </section>

        {/* Reference: Mars Men Liftoff Progress WEEK grid + Primal Storm Ignition/Unlock/Momentum/Lock-In. */}
        <section className="s35-journey">
          <div className="s35-shell">
            <motion.div {...reveal} className="s35-section-head"><SectionLabel>What happens next</SectionLabel><h2>Your first 90 days.</h2><p>Honest milestones. No overnight-transformation promise.</p></motion.div>
            <div className="s35-phase-list">
              {PHASES.map((phase) => <motion.article {...reveal} key={phase.number}>
                <div className="s35-phase-time"><strong>{phase.number}</strong><span>{phase.range}</span></div>
                <h3>{phase.title}</h3>
                <ul>{phase.items.map((item) => <CheckRow key={item}>{item}</CheckRow>)}</ul>
              </motion.article>)}
            </div>
            <p className="s35-disclaimer">Individual results vary based on starting weight, adherence, and physician-guided dosage.</p>
          </div>
        </section>

        {/* Reference: Mars Men named Medical Advisory Board split image/profile architecture. */}
        <section className="s35-clinical s35-shell">
          <div className="s35-clinical-image"><img src="/assets/sales-35-clinical-review.jpg" alt="Clinical team reviewing a patient chart together" width="1600" height="1008" loading="lazy" /><span>Clinical review, not an algorithm</span></div>
          <div className="s35-clinical-copy">
            <SectionLabel>Who's actually reviewing your case</SectionLabel><h2>Real clinicians. Real review.</h2>
            <div className="s35-reviewer-list">{REVIEWERS.map(([name, role], index) => <div key={name}><span>0{index + 1}</span><div><h3>{name}</h3><p>{role}</p></div></div>)}</div>
            <p className="s35-clinical-stat"><strong>41 states.</strong> Cases are typically reviewed within 3 hours, never longer than 24. Approval rate is approximately 95% for complete intakes. If you are not approved, you are never charged.</p>
          </div>
        </section>

        {/* Reference: Mars Men rdm-comparison-table and Primal Storm 3-column comparison semantics. */}
        <section className="s35-compare">
          <div className="s35-shell">
            <motion.div {...reveal} className="s35-section-head"><SectionLabel>The Blissley difference</SectionLabel><h2>How this compares.</h2></motion.div>
            <div className="s35-compare-scroll"><div className="s35-compare-table">
              <div className="s35-compare-header"><span>Compare</span><strong>Blissley</strong><span>Brand-name pharmacy</span><span>Other telehealth</span></div>
              {COMPARISON.map((row) => <div key={row[0]}><strong>{row[0]}</strong><span className="s35-win">{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span></div>)}
            </div></div>
          </div>
        </section>

        {/* Reference: Mars Men results carousel rule—each testimonial leads with a specific measurable result. */}
        <section className="s35-results s35-shell">
          <motion.div {...reveal} className="s35-section-head"><SectionLabel>Verified patient stories</SectionLabel><h2>Real patients. Specific outcomes.</h2></motion.div>
          <div className="s35-review-rail">{REVIEWS.map(([result, quote, person], index) => <motion.article {...reveal} key={person}>
            <span className="s35-review-index">0{index + 1}</span><strong>{result}</strong><blockquote>{quote}</blockquote><footer><span>{person.slice(0,1)}</span><div>{person}<small><Check /> Verified patient</small></div></footer>
          </motion.article>)}</div>
        </section>

        {/* Reference: Mars Men standalone money-back block, dark liquid gradient and oversized guarantee seal. */}
        <section className="s35-guarantee">
          <div className="s35-shell s35-guarantee-grid">
            <div className="s35-seal" aria-hidden="true"><svg viewBox="0 0 180 180"><defs><path id="sealpath" d="M90,90 m-63,0 a63,63 0 1,1 126,0 a63,63 0 1,1 -126,0" /></defs><text><textPath href="#sealpath" startOffset="2%">BLISSLEY GUARANTEE • PHYSICIAN REVIEW • </textPath></text><path d="M62 91l18 18 40-44" /></svg></div>
            <div><SectionLabel>Your plan. Protected.</SectionLabel><h2>The bigger the commitment, the bigger the risk we take on. <em>Not you.</em></h2><p><strong>Never charged if a physician doesn't approve you.</strong> Your card isn't charged until an actual physician has reviewed and approved your case.</p><p><strong>Full refund on 3 and 6-month plans</strong> if you don't see results by the end of your program.</p></div>
          </div>
        </section>

        {/* Reference: Blissley FAQ topics rebuilt in Mars Men rdm-faq-pdp sharp-divider accordion style. */}
        <section className="s35-faq s35-shell">
          <motion.div {...reveal} className="s35-section-head"><SectionLabel>Everything, answered</SectionLabel><h2>Frequently asked questions.</h2></motion.div>
          <div className="s35-faq-list">{FAQS.map(([question, answer], index) => {
            const open = openFaq === index;
            return <div key={question} className="s35-faq-item" data-open={open}>
              <MotionButton lift={false} type="button" onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open} aria-controls={`sales35-faq-${index}`}>
                <span>0{index + 1}</span><strong>{question}</strong><ChevronDown aria-hidden="true" />
              </MotionButton>
              <AnimatePresence initial={false}>{open && <motion.div id={`sales35-faq-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{answer}</p></motion.div>}</AnimatePresence>
            </div>;
          })}</div>
        </section>

        {/* Reference: ethical close; no fake scarcity, preserving the source's high-contrast final CTA weight. */}
        <section className="s35-close">
          <div className="s35-shell">
            <SectionLabel>Ready for the next step</SectionLabel><h2>Physician review is typically completed within 3 hours.</h2><p>Submit your case now to be reviewed today.</p>
            <MotionButton type="button" className="s35-primary" onClick={submit}>Send my case to a physician <ArrowRight /></MotionButton>
            <div className="s35-close-trust"><span><LockKeyhole /> Secure submission</span><span><PackageCheck /> Never charged if not approved</span><span><MessageCircle /> Ongoing physician messaging</span></div>
          </div>
        </section>
      </main>

      <AnimatePresence>{offerSeen && <motion.div className="s35-sticky" initial={{ y: 110 }} animate={{ y: 0 }} exit={{ y: 110 }}>
        <div><span>{medication === "sema" ? "Semaglutide" : "Tirzepatide"} · {selectedPlan.title}</span><strong>${selectedPlan.monthly}/mo</strong></div>
        <MotionButton type="button" onClick={submit}>Continue <ArrowRight /></MotionButton>
      </motion.div>}</AnimatePresence>
    </div>
  );
}
