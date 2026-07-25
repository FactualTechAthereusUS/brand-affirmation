import { Sparkline } from "./Sparkline";
import type { ReactNode } from "react";

export function KpiCard({
  label, value, delta, sub, spark, sparkColor = "#171717", tooltip, action, tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  sub?: string;
  spark?: number[];
  sparkColor?: string;
  tooltip?: string;
  action?: ReactNode;
  tone?: "default" | "warn" | "critical" | "positive";
}) {
  const deltaTone =
    tone === "critical" ? "text-ever" :
    tone === "warn" ? "text-honey" :
    tone === "positive" ? "text-check" : "text-ink/60";
  return (
    <div title={tooltip} className="group relative overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      <div className="px-4 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">{label}</div>
          {action}
        </div>
        <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
          <div className="font-hero text-[26px] font-semibold leading-none text-ink">{value}</div>
          {delta && <div className={`text-[11.5px] font-medium ${deltaTone}`}>{delta}</div>}
        </div>
        {sub && <div className="mt-1 text-[11px] text-ink/45">{sub}</div>}
      </div>
      {spark && spark.length > 1 && (
        <div className="mt-2 h-8 w-full">
          <Sparkline data={spark} stroke={sparkColor} fill={`${sparkColor}12`} height={32} className="h-8 w-full" />
        </div>
      )}
    </div>
  );
}
