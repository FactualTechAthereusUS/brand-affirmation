export function FunnelWaterfall({ steps }: { steps: { label: string; count: number; pct: number }[] }) {
  const max = steps[0]?.count ?? 1;
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Conversion funnel</div>
        <div className="text-[11px] text-ink/45">Last 30 days</div>
      </div>
      <div className="space-y-1.5">
        {steps.map((s, i) => {
          const w = (s.count / max) * 100;
          const drop = i > 0 ? ((steps[i - 1].count - s.count) / steps[i - 1].count) * 100 : 0;
          return (
            <div key={s.label}>
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="text-ink/70">{s.label}</span>
                <span className="tabular-nums text-ink/50">
                  {s.count.toLocaleString()} <span className="text-ink/30">· {s.pct.toFixed(1)}%</span>
                  {i > 0 && <span className="ml-2 text-ever">−{drop.toFixed(1)}%</span>}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full rounded bg-ink/[0.04]">
                <div className="h-full rounded bg-ink" style={{ width: `${w}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
