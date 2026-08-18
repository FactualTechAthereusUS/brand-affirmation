import { motion } from "motion/react";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";
import { Check } from "@/components/pharmabro/primitives";
import phoneIntake from "@/assets/pharmabro-phone-intake.png.asset.json";

/**
 * Coded product visuals, Rimo/Cuvo style: no screenshot placeholders, no
 * repeated dashboard frames. Each kind is its own small, real-looking piece of
 * interface so every section on the homepage reads differently.
 */
export type MockKind =
  | "operations"
  | "providers"
  | "pharmacy"
  | "compliant"
  | "portal"
  | "checkout"
  | "care"
  | "route"
  | "revenue";

const hair = "border-[var(--color-hairline)]";
const mist = "bg-[var(--color-mist)]";

function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-2 border-b ${hair} px-4 py-2.5`}>
        <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--color-ink)_14%,transparent)]" />
        <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]" />
        <span className="pb-micro ml-2 truncate">{title}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
    </div>
  );
}

function Row({
  a,
  b,
  c,
  tone = "neutral",
  delay = 0,
}: {
  a: string;
  b: string;
  c: string;
  tone?: "neutral" | "good" | "accent";
  delay?: number;
}) {
  const pill =
    tone === "good"
      ? "bg-[color-mix(in_oklab,var(--color-check)_14%,white)] text-[color-mix(in_oklab,var(--color-ink)_78%,transparent)]"
      : tone === "accent"
        ? "bg-[color-mix(in_oklab,var(--color-marine)_12%,white)] text-[var(--color-marine)]"
        : `${mist} text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)]`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: PB_EASE_SOFT }}
      className={`flex items-center justify-between gap-3 border-b ${hair} py-2.5 last:border-0`}
    >
      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{a}</span>
      <span className="pb-mono hidden text-[11px] text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)] sm:block">
        {b}
      </span>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${pill}`}>{c}</span>
    </motion.div>
  );
}

function Bars({
  values,
  labels,
  height = 120,
}: {
  values: number[];
  labels: string[];
  height?: number;
}) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <motion.div
            initial={{ height: 6 }}
            whileInView={{ height: Math.max(8, Math.round((v / max) * (height - 22))) }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: PB_EASE_SOFT }}
            className="w-full rounded-[5px] bg-[color-mix(in_oklab,var(--color-marine)_18%,white)]"
          />
          <span className="pb-micro truncate text-[9.5px]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className={`rounded-[12px] border ${hair} ${mist} px-3 py-2.5`}>
      <div className="pb-micro text-[9.5px]">{label}</div>
      <div className="pb-mono mt-1 text-[15px] font-medium text-ink">{value}</div>
      {sub ? <div className="pb-micro mt-0.5 text-[9.5px] text-[var(--color-marine)]">{sub}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ kinds */

function Operations() {
  return (
    <div className="pb-liquid-soft relative flex h-full w-full items-center justify-center overflow-hidden">
      <motion.img
        src="/assets/pharmabro-operations-dashboard.png"
        alt="PharmaBro live operations dashboard with real-time patient activity and global session map"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: PB_EASE_SOFT }}
        className="relative z-10 max-h-full w-auto max-w-full rounded-[14px] object-contain shadow-[0_30px_80px_-40px_rgba(16,24,64,0.45)] ring-1 ring-[color-mix(in_oklab,var(--color-ink)_8%,transparent)]"
      />
    </div>
  );
}

function Providers() {
  return (
    <Chrome title="Provider queue, state routed">
      <div className="flex items-center gap-2">
        <span className={`rounded-full border ${hair} ${mist} px-2.5 py-1 text-[10.5px] font-medium text-ink`}>
          All states
        </span>
        <span className="rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-medium text-canvas">
          Unassigned 0
        </span>
        <span className="pb-micro ml-auto text-[9.5px]">Avg review 42 min</span>
      </div>
      <div className="mt-3 flex-1">
        <Row a="J. Alvarez, NP, TX" b="TX, OK, NM" c="4 cases" tone="accent" />
        <Row a="M. Chen, MD, CA" b="CA, NV, AZ" c="2 cases" delay={0.05} />
        <Row a="R. Okafor, MD, NY" b="NY, NJ, CT" c="3 cases" delay={0.1} />
        <Row a="S. Patel, NP, FL" b="FL, GA, AL" c="Idle" tone="good" delay={0.15} />
      </div>
    </Chrome>
  );
}

function Pharmacy() {
  return (
    <Chrome title="Pharmacy routing">
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Fill time" value="1.2 days" />
        <Kpi label="On-time ship" value="98.4%" sub="30 day" />
      </div>
      <div className="mt-3">
        <Row a="Empower Pharmacy" b="Semaglutide, 38 states" c="Live" tone="good" />
        <Row a="Hallandale" b="Tirzepatide, 42 states" c="Live" tone="good" delay={0.05} />
        <Row a="Revive Rx" b="TRT, 31 states" c="Live" tone="good" delay={0.1} />
        <Row a="Belmar" b="HRT, 27 states" c="Backup" delay={0.15} />
      </div>
    </Chrome>
  );
}

function Compliant() {
  const items = [
    "LegitScript certification",
    "HIPAA BAAs executed",
    "State licensing, 50 + D.C.",
    "DEA registration on file",
  ];
  return (
    <Chrome title="Compliance center">
      <ul className="space-y-2">
        {items.map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: PB_EASE_SOFT }}
            className={`flex items-center gap-3 rounded-[12px] border ${hair} ${mist} px-3 py-2.5`}
          >
            <span className="grid size-4 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-check)_16%,white)]">
              <Check className="size-2.5" />
            </span>
            <span className="text-[12.5px] text-ink">{t}</span>
            <span className="pb-micro ml-auto text-[9.5px]">Active</span>
          </motion.li>
        ))}
      </ul>
    </Chrome>
  );
}

/** Real phone photograph of the branded patient intake, with floating labels. */
function Portal() {
  const labels: { text: string; className: string; rotate: number; delay: number }[] = [
    {
      text: "Your brand, your domain",
      className: "left-[2%] top-[16%]",
      rotate: -6,
      delay: 0.15,
    },
    {
      text: "Intake in 4 steps",
      className: "right-[3%] top-[34%]",
      rotate: 5,
      delay: 0.3,
    },
    {
      text: "Provider matched by state",
      className: "left-[1%] bottom-[16%]",
      rotate: 4,
      delay: 0.45,
    },
  ];

  return (
    <div className={`relative h-full overflow-hidden ${mist}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-ink) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-ink) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <motion.img
        src={phoneIntake.url}
        alt="Patient intake on mobile, white labeled to your brand"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: PB_EASE_SOFT }}
        className="relative z-10 mx-auto h-full w-full object-contain object-center"
      />
      {labels.map((l) => (
        <motion.span
          key={l.text}
          initial={{ opacity: 0, y: 10, rotate: l.rotate }}
          whileInView={{ opacity: 1, y: 0, rotate: l.rotate }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: l.delay, ease: PB_EASE_SOFT }}
          className={`absolute z-20 max-w-[42%] rounded-[12px] border ${hair} bg-canvas px-3 py-2 text-[11.5px] font-medium leading-snug text-ink shadow-[0_18px_40px_-24px_rgba(10,10,10,0.45)] ${l.className}`}
        >
          {l.text}
        </motion.span>
      ))}
    </div>
  );
}

function Checkout() {
  return (
    <div className={`grid h-full place-items-center ${mist} p-5`}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: PB_EASE_SOFT }}
        className={`w-full max-w-[320px] rounded-[18px] border ${hair} bg-canvas p-4 shadow-[0_24px_60px_-40px_rgba(10,10,10,0.45)]`}
      >
        <div className="pb-micro">Your brand, your domain</div>
        <div className="mt-2 text-[14px] font-medium text-ink">Monthly plan</div>
        <div className={`mt-3 space-y-2 border-y ${hair} py-3`}>
          {[
            ["Semaglutide, 1 month", "$249.00"],
            ["Provider consult", "Included"],
            ["Shipping", "Free"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[12px] text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)]">{k}</span>
              <span className="pb-mono text-[12px] text-ink">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12.5px] font-medium text-ink">Due today</span>
          <span className="pb-mono text-[15px] font-medium text-ink">$249.00</span>
        </div>
        <div className="mt-3 rounded-full bg-ink py-2 text-center text-[11.5px] font-medium text-canvas">
          Pay and start
        </div>
        <div className="pb-micro mt-2 text-center text-[9.5px]">
          Settles to your Stripe account
        </div>
      </motion.div>
    </div>
  );
}

function Care() {
  return (
    <Chrome title="Async consult">
      <div className={`rounded-[12px] border ${hair} ${mist} p-3`}>
        <div className="pb-micro text-[9.5px]">Patient intake, 12 answers</div>
        <div className="mt-1.5 text-[12.5px] text-ink">
          BMI 31.4, no contraindications, prior GLP-1 none
        </div>
      </div>
      <div className="mt-3">
        <Row a="Eligibility check" b="Automated" c="Pass" tone="good" />
        <Row a="Provider assigned" b="Licensed in patient state" c="42 min" tone="accent" delay={0.05} />
        <Row a="Clinical chart" b="HIPAA, exportable" c="Stored" delay={0.1} />
      </div>
      <div className={`mt-3 rounded-[12px] border ${hair} px-3 py-2.5`}>
        <div className="pb-micro text-[9.5px]">Provider note</div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-ink">
          Approved. Start 0.25mg weekly, titrate at week 5.
        </div>
      </div>
    </Chrome>
  );
}

function RouteMock() {
  const steps = [
    ["Prescription issued", "Provider e-signed"],
    ["Pharmacy matched", "Compound and state"],
    ["Filled and packed", "Cold chain"],
    ["Tracking sent", "Portal and SMS"],
  ];
  return (
    <Chrome title="Prescription to doorstep">
      <ol className="relative space-y-3.5 pl-5">
        <span
          className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-[var(--color-hairline)]"
          aria-hidden
        />
        {steps.map(([t, s], i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: PB_EASE_SOFT }}
            className="relative"
          >
            <span
              className="absolute -left-5 top-1.5 size-[11px] rounded-full border-2 border-canvas bg-[var(--color-marine)]"
              aria-hidden
            />
            <div className="text-[12.5px] font-medium text-ink">{t}</div>
            <div className="pb-micro mt-0.5 text-[9.5px]">{s}</div>
          </motion.li>
        ))}
      </ol>
    </Chrome>
  );
}

function Revenue() {
  return (
    <Chrome title="Revenue and rebills">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="MRR" value="$12,480" sub="+18%" />
        <Kpi label="Rebills collected" value="96%" />
        <Kpi label="Recovered" value="$1,340" />
      </div>
      <div className="mt-3">
        <Bars
          values={[3, 5, 6, 8, 9, 12, 15, 18]}
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]}
          height={104}
        />
      </div>
      <div className="mt-2">
        <Row a="Upcoming rebills, next 7 days" b="48 invoices" c="$11,952" tone="accent" />
      </div>
    </Chrome>
  );
}

const MAP: Record<MockKind, () => React.ReactElement> = {
  operations: Operations,
  providers: Providers,
  pharmacy: Pharmacy,
  compliant: Compliant,
  portal: Portal,
  checkout: Checkout,
  care: Care,
  route: RouteMock,
  revenue: Revenue,
};

export function Mock({ kind }: { kind: MockKind }) {
  const C = MAP[kind] ?? Operations;
  return (
    <div className="h-full w-full overflow-hidden bg-canvas">
      <C />
    </div>
  );
}

/** Editorial art for blog cards: typographic, no photo placeholder. */
export function BlogArt({ category, index }: { category: string; index: number }) {
  const tint = index % 3;
  const bg =
    tint === 0
      ? "bg-[color-mix(in_oklab,var(--color-marine)_9%,white)]"
      : tint === 1
        ? "bg-[var(--color-mist)]"
        : "bg-[color-mix(in_oklab,var(--color-ink)_5%,white)]";
  return (
    <div
      className={`pb-dotgrid relative flex items-end overflow-hidden ${bg} p-4`}
      style={{ aspectRatio: "4 / 3" }}
    >
      <span
        aria-hidden
        className="pb-mono absolute -right-2 -top-3 text-[64px] font-medium leading-none text-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="pb-micro relative">{category}</span>
    </div>
  );
}
