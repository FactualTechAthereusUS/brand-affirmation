export function MrrMovementBar({ items }: { items: { label: string; value: number; kind: "pos" | "neg" | "base" }[] }) {
  const absMax = Math.max(...items.map((i) => Math.abs(i.value))) || 1;
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">MRR movement</div>
          <div className="mt-1 font-hero text-[22px] font-semibold text-ink tabular-nums">
            ${items[items.length - 1]?.value.toLocaleString() ?? "—"}
          </div>
        </div>
        <div className="text-[11px] text-ink/45">Last 30 days</div>
      </div>
      <div className="space-y-1.5">
        {items.map((it) => {
          const pct = Math.abs(it.value) / absMax * 100;
          const color = it.kind === "pos" ? "bg-check" : it.kind === "neg" ? "bg-ever" : "bg-ink";
          const align = it.kind === "neg" ? "flex-row-reverse" : "flex-row";
          return (
            <div key={it.label} className="grid grid-cols-[110px_1fr_88px] items-center gap-2">
              <div className="text-[11.5px] text-ink/60">{it.label}</div>
              <div className={`flex ${align}`}>
                <div className={`h-4 rounded ${color}`} style={{ width: `${Math.max(pct, 3)}%` }} />
              </div>
              <div className="text-right text-[11.5px] font-medium text-ink tabular-nums">
                {it.value < 0 ? "-" : ""}${Math.abs(it.value).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
