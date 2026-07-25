import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function CohortHeatmap({ rows }: { rows: { month: string; started: number; values: Array<number | null> }[] }) {
  // Emerald scale — retention is positive
  const cell = (v: number) => `rgba(16, 185, 129, ${Math.max(0.14, v / 100)})`;
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full text-[11px]">
        <thead className="text-[10px] uppercase tracking-[0.06em] text-ink/45">
          <tr>
            <th className="py-1.5 pr-3 text-left font-medium">Cohort</th>
            <th className="py-1.5 pr-3 text-right font-medium">Started</th>
            {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => (
              <th key={m} className="py-1.5 pr-1 text-center font-medium">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c, ri) => (
            <tr key={c.month}>
              <td className="py-1 pr-3 text-ink">{c.month}</td>
              <td className="py-1 pr-3 text-right tabular-nums text-ink/60">{c.started}</td>
              {c.values.map((v, i) => {
                const isActive = hover?.r === ri && hover?.c === i;
                return (
                  <td key={i} className="py-1 pr-1">
                    {v === null ? (
                      <div className="grid h-8 place-items-center rounded bg-ink/[0.02] text-[9px] text-ink/25">—</div>
                    ) : (
                      <motion.div
                        className="relative grid h-8 place-items-center rounded text-[10px] font-semibold tabular-nums text-ink transition-transform"
                        style={{
                          background: cell(v),
                          transform: isActive ? "scale(1.05)" : "scale(1)",
                          boxShadow: isActive ? "0 0 0 1.5px rgba(16,185,129,0.9) inset" : undefined,
                          color: v >= 55 ? "white" : "#0f3d2f",
                        }}
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (ri * 6 + i) * 0.012, duration: 0.25 }}
                        onPointerEnter={() => setHover({ r: ri, c: i })}
                        onPointerLeave={() => setHover(null)}
                      >
                        {v.toFixed(0)}%
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.14 }}
                              className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-max -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[9.5px] text-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]"
                            >
                              <div className="font-medium">{c.month} · M{i}</div>
                              <div className="text-white/70">
                                {v.toFixed(1)}% retained · {Math.round((v / 100) * c.started)} of {c.started}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
