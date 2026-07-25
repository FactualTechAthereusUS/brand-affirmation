import { motion } from "framer-motion";

export function BreakdownBars({ steps }: { steps: { label: string; count: number; pct: number; delta?: string }[] }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col">
          <div className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-ink/50">{s.label}</div>
          <div className="mt-1 font-hero text-[18px] font-semibold text-ink tabular-nums">{s.pct.toFixed(2)}%</div>
          <div className="text-[10.5px] tabular-nums text-ink/45">
            {s.count.toLocaleString()}
            {s.delta && <span className="ml-1 text-ever">{s.delta}</span>}
          </div>
          <div className="relative mt-2 h-24 w-full overflow-hidden rounded bg-ink/[0.04]">
            <motion.div
              className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-ink to-ink/70"
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max(6, s.pct)}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
