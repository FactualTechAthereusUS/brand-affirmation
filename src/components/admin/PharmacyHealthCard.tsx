import type { Pharmacy } from "@/lib/admin/store";

export function PharmacyHealthCard({ p }: { p: Pharmacy }) {
  const statusDot = p.apiStatus === "connected" ? "bg-check" : p.apiStatus === "degraded" ? "bg-honey" : "bg-ever";
  const statusLabel = p.apiStatus === "connected" ? "Connected" : p.apiStatus === "degraded" ? "Degraded" : "Down";
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-ink">{p.name}</div>
          <div className="mt-0.5 text-[11px] text-ink/50">{p.role === "primary" ? "Primary" : "Backup"} · {p.drugs.join(" · ")}</div>
        </div>
        <span className="flex items-center gap-1 text-[10.5px] text-ink/60">
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} /> {statusLabel}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-ink/[0.06] pt-3">
        <Stat label="Queue" value={p.queue} />
        <Stat label="Avg prep" value={`${p.avgPrepHrs}h`} />
        <Stat label="On-time" value={`${p.onTimeRate.toFixed(1)}%`} tone={p.onTimeRate < 92 ? "warn" : "ok"} />
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "ok" }: { label: string; value: string | number; tone?: "ok" | "warn" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink/40">{label}</div>
      <div className={`mt-0.5 text-[14px] font-semibold tabular-nums ${tone === "warn" ? "text-ever" : "text-ink"}`}>{value}</div>
    </div>
  );
}
