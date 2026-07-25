import { motion } from "framer-motion";

export function HBar({
  rows,
  formatValue = (v) => v.toLocaleString(),
  color = "#171717",
}: {
  rows: { label: string; value: number; delta?: string; deltaTone?: "up" | "down" }[];
  formatValue?: (v: number) => string;
  color?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-2 text-[11.5px]">
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-ink/70">{r.label}</span>
              <span className="shrink-0 tabular-nums text-ink">{formatValue(r.value)}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/[0.05]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
          {r.delta && (
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${r.deltaTone === "down" ? "bg-ever/10 text-ever" : "bg-check/10 text-check"}`}>
              {r.delta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
