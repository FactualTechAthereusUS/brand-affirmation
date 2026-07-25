import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function HBar({
  rows,
  formatValue = (v) => v.toLocaleString(),
  color = "#2563eb",
  palette,
}: {
  rows: { label: string; value: number; delta?: string; deltaTone?: "up" | "down"; color?: string }[];
  formatValue?: (v: number) => string;
  color?: string;
  palette?: string[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const total = rows.reduce((a, r) => a + r.value, 0) || 1;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => {
        const c = r.color ?? (palette ? palette[i % palette.length] : color);
        const isActive = hover === i;
        return (
          <div
            key={r.label}
            className="grid grid-cols-[1fr_auto] items-center gap-2 text-[11.5px]"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 truncate text-ink/70">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c }} />
                  {r.label}
                </span>
                <span className="shrink-0 tabular-nums text-ink">{formatValue(r.value)}</span>
              </div>
              <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/[0.05]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c} 0%, ${c}CC 100%)`, boxShadow: isActive ? `0 0 0 1px ${c}55 inset` : undefined }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(r.value / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.14 }}
                      className="pointer-events-none absolute right-1 -top-6 rounded-md bg-ink px-1.5 py-0.5 text-[10px] tabular-nums text-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]"
                    >
                      {((r.value / total) * 100).toFixed(1)}%
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {r.delta && (
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${r.deltaTone === "down" ? "bg-ever/10 text-ever" : "bg-check/10 text-check"}`}>
                {r.delta}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
