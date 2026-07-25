import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  delta,
  deltaTone = "positive",
  sub,
  children,
  className = "",
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: "positive" | "warn" | "critical" | "neutral";
  sub?: string;
  children?: ReactNode;
  className?: string;
}) {
  const tone =
    deltaTone === "critical" ? "text-ever bg-ever/8" :
    deltaTone === "warn" ? "text-honey bg-honey/12" :
    deltaTone === "positive" ? "text-check bg-check/10" :
    "text-ink/60 bg-ink/[0.05]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex flex-col overflow-hidden rounded-xl border border-ink/[0.06] bg-white ${className}`}
    >
      <div className="px-4 pt-3.5">
        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">{label}</div>
        <div className="mt-1 flex items-baseline gap-2 tabular-nums">
          <div className="font-hero text-[24px] font-semibold leading-none text-ink">{value}</div>
          {delta && (
            <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium ${tone}`}>{delta}</span>
          )}
        </div>
        {sub && <div className="mt-1 text-[10.5px] text-ink/45">{sub}</div>}
      </div>
      {children && <div className="mt-2 flex-1 px-1 pb-2">{children}</div>}
    </motion.div>
  );
}

export function AnalyticsSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.10em] text-ink/50">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
