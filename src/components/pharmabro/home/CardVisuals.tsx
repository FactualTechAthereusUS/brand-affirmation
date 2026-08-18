import { motion } from "motion/react";
import { STATE_TILES, type RoofCard } from "@/lib/pharmabro/home";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

const shell =
  "relative overflow-hidden rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-mist)] p-4";

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "blue" }) {
  const tones = {
    neutral: "border-[var(--color-hairline)] bg-canvas text-ink",
    green:
      "border-[color-mix(in_oklab,var(--color-check)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-check)_10%,white)] text-[var(--color-check)]",
    blue:
      "border-[color-mix(in_oklab,var(--color-marine)_28%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_9%,white)] text-[var(--color-marine)]",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[var(--color-hairline)] bg-canvas px-3 py-2">
      <span className="pb-micro">{label}</span>
      <span className="pb-mono text-[12.5px] font-medium text-ink">{value}</span>
    </div>
  );
}

/** Small coded visual per feature card. No fake photography. */
export function CardVisual({ kind }: { kind: RoofCard["visual"] }) {
  if (kind === "stripe")
    return (
      <div className={shell}>
        <div className="flex items-center justify-between gap-2">
          <Pill>Card charged</Pill>
          <span className="pb-dim text-[13px]">→</span>
          <Pill tone="blue">PharmaBro routing</Pill>
          <span className="pb-dim text-[13px]">→</span>
          <Pill tone="green">Your Stripe</Pill>
        </div>
        <div className="mt-3 space-y-2">
          <Row label="Settlement" value="Direct" />
          <Row label="PharmaBro cut" value="0%" />
        </div>
      </div>
    );

  if (kind === "token")
    return (
      <div className={shell}>
        <div className="flex items-center justify-between">
          <span className="pb-mono text-[13px] text-ink">Card ending 4242</span>
          <Pill tone="green">Tokenized</Pill>
        </div>
        <div className="mt-3 space-y-2">
          <Row label="Bills on" value="Ship date" />
          <Row label="Retry logic" value="Smart" />
          <Row label="Recovered" value="$24 avg" />
        </div>
      </div>
    );

  if (kind === "states")
    return (
      <div className={shell}>
        <div className="grid grid-cols-10 gap-1">
          {STATE_TILES.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.008, ease: PB_EASE_SOFT }}
              className="grid h-5 place-items-center rounded-[3px] bg-[color-mix(in_oklab,var(--color-marine)_14%,white)] text-[7.5px] font-semibold text-[var(--color-marine)]"
            >
              {s}
            </motion.span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Pill tone="blue">50 states + D.C.</Pill>
          <Pill>Auto assignment</Pill>
        </div>
      </div>
    );

  if (kind === "export")
    return (
      <div className={shell}>
        <div className="flex items-center justify-between rounded-[10px] border border-[var(--color-hairline)] bg-canvas px-3 py-2.5">
          <span className="pb-mono text-[12.5px] text-ink">patient_data.csv</span>
          <Pill tone="green">Ready</Pill>
        </div>
        <div className="mt-3 space-y-2">
          <Row label="Records" value="12,904" />
          <Row label="Card tokens" value="Included" />
          <Row label="Export window" value="24 hours" />
        </div>
      </div>
    );

  if (kind === "brands")
    return (
      <div className={shell}>
        <div className="space-y-2">
          {[
            { n: "Blissley", v: "Weight loss" },
            { n: "Northline", v: "TRT" },
            { n: "Verawell", v: "Hair loss" },
          ].map((b, i) => (
            <motion.div
              key={b.n}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: PB_EASE_SOFT }}
              className="flex items-center justify-between rounded-[10px] border border-[var(--color-hairline)] bg-canvas px-3 py-2"
            >
              <span className="text-[13px] font-medium text-ink">{b.n}</span>
              <span className="pb-micro">{b.v}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3">
          <Pill tone="blue">One login, every brand</Pill>
        </div>
      </div>
    );

  // scale: revenue trend
  const points = [8, 14, 12, 20, 26, 24, 34, 42, 48, 62];
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${70 - p}`)
    .join(" ");

  return (
    <div className={shell}>
      <div className="flex items-end justify-between">
        <div>
          <div className="pb-micro">Revenue MTD</div>
          <div className="pb-mono mt-1 text-[20px] font-medium text-ink">$42,800</div>
        </div>
        <Pill tone="green">+65%</Pill>
      </div>
      <svg viewBox="0 0 100 72" className="mt-3 h-16 w-full" preserveAspectRatio="none">
        <motion.path
          d={path}
          fill="none"
          stroke="var(--color-marine)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: PB_EASE_SOFT }}
        />
      </svg>
    </div>
  );
}
