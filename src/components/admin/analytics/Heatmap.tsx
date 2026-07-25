import { motion } from "framer-motion";

export function CohortHeatmap({ rows }: { rows: { month: string; started: number; values: Array<number | null> }[] }) {
  return (
    <div className="overflow-x-auto">
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
              {c.values.map((v, i) => (
                <td key={i} className="py-1 pr-1">
                  {v === null ? (
                    <div className="grid h-8 place-items-center rounded bg-ink/[0.02] text-[9px] text-ink/25">—</div>
                  ) : (
                    <motion.div
                      className="grid h-8 place-items-center rounded text-[10px] font-semibold tabular-nums text-white"
                      style={{ background: `rgba(238,114,115,${Math.max(0.18, v / 100)})` }}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (ri * 6 + i) * 0.012, duration: 0.25 }}
                    >
                      {v.toFixed(0)}%
                    </motion.div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
