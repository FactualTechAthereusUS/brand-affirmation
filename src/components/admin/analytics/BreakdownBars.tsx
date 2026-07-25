import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const STEP_COLORS = ["#2563eb", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ee7273"];

export function BreakdownBars({ steps }: { steps: { label: string; count: number; pct: number; delta?: string }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((s, i) => {
        const color = STEP_COLORS[i % STEP_COLORS.length];
        const isActive = hover === i;
        const isDim = hover != null && hover !== i;
        // Show each step as a full-height column, filled from the bottom proportional to pct.
        // For very small pcts we still show a minimum fill so bar is visible.
        const fill = Math.max(6, s.pct);
        return (
          <div
            key={s.label}
            className="flex flex-col"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <div className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-ink/50">{s.label}</div>
            <div className="mt-1 font-hero text-[18px] font-semibold text-ink tabular-nums">{s.pct.toFixed(2)}%</div>
            <div className="text-[10.5px] tabular-nums text-ink/45">
              {s.count.toLocaleString()}
              {s.delta && (
                <span className={`ml-1 ${s.delta.startsWith("-") || s.delta.startsWith("−") ? "text-ever" : "text-check"}`}>
                  {s.delta}
                </span>
              )}
            </div>
            <div
              className="relative mt-2 h-24 w-full overflow-hidden rounded-md transition-opacity"
              style={{ background: `${color}14`, opacity: isDim ? 0.4 : 1 }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 origin-bottom rounded-md"
                style={{
                  background: `linear-gradient(180deg, ${color} 0%, ${color}CC 60%, ${color}88 100%)`,
                  boxShadow: isActive ? `0 0 0 2px ${color}55 inset` : undefined,
                }}
                initial={{ height: 0 }}
                whileInView={{ height: `${fill}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              />
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.14 }}
                    className="pointer-events-none absolute inset-x-1 top-1 rounded-md bg-ink px-2 py-1 text-center text-[10px] font-medium text-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]"
                  >
                    <span className="tabular-nums">{s.count.toLocaleString()}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
