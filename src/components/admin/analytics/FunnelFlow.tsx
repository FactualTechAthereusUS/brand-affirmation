import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export type FunnelStep = { label: string; count: number; pct: number; dropPct: number };

/**
 * Horizontal funnel: one bar per step, width proportional to volume.
 * Hover a row → the rest dim and a tooltip shows entered / lost / continue
 * for that exact step. Labels live outside the bar so they stay legible.
 */
export function FunnelFlow({
  steps,
  colors,
  height = 300,
}: {
  steps: FunnelStep[];
  colors: string[];
  height?: number;
}) {
  const [hi, setHi] = useState<number | null>(null);
  const max = Math.max(1, steps[0]?.count ?? 1);
  const rowH = steps.length ? height / steps.length : height;

  return (
    <div className="relative w-full" style={{ minHeight: height }} onPointerLeave={() => setHi(null)}>
      {steps.map((s, i) => {
        const c = colors[i % colors.length];
        const dim = hi !== null && hi !== i;
        return (
          <div
            key={s.label}
            className="relative rounded-lg px-1 transition-colors"
            style={{ height: rowH, background: hi === i ? "rgba(23,23,23,0.03)" : undefined }}
            onPointerEnter={() => setHi(i)}
          >
            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span className="flex items-center gap-1.5 truncate text-[11.5px] text-ink/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c }} />
                {s.label}
              </span>
              <span className="shrink-0 text-[11.5px] tabular-nums text-ink/55">
                <span className="font-semibold text-ink">{s.count.toLocaleString()}</span>
                <span className="ml-1.5 text-ink/40">{s.pct.toFixed(1)}%</span>
                {i > 0 && <span className="ml-2 text-ever">−{s.dropPct.toFixed(1)}%</span>}
              </span>
            </div>
            <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.05]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: c, opacity: dim ? 0.38 : 1 }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(1.5, (s.count / max) * 100)}%` }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}

      <AnimatePresence>
        {hi !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="pointer-events-none absolute right-1 z-20 w-[196px] rounded-xl bg-ink px-3 py-2 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]"
            style={{ top: Math.min(height - 112, hi * rowH + rowH) }}
          >
            <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-white/55">Step {hi + 1}</div>
            <div className="text-[12.5px] font-semibold text-white">{steps[hi].label}</div>
            <Row k="Reached this step" v={steps[hi].count.toLocaleString()} />
            <Row k="Share of sessions" v={`${steps[hi].pct.toFixed(1)}%`} />
            {hi > 0 && (
              <>
                <Row k="Lost from previous" v={(steps[hi - 1].count - steps[hi].count).toLocaleString()} tone />
                <Row k="Step drop-off" v={`−${steps[hi].dropPct.toFixed(1)}%`} tone />
              </>
            )}
            {steps[hi + 1] && <Row k="Continue to next" v={`${(100 - steps[hi + 1].dropPct).toFixed(1)}%`} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: boolean }) {
  return (
    <div className="mt-0.5 flex items-baseline gap-2 text-[10.5px]">
      <span className="text-white/50">{k}</span>
      <span className={`ml-auto tabular-nums ${tone ? "text-ever" : "text-white"}`}>{v}</span>
    </div>
  );
}
