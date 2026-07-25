import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function Donut({
  segments,
  centerLabel,
  centerValue,
  size = 148,
  thickness = 18,
  formatValue,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  thickness?: number;
  formatValue?: (v: number) => string;
}) {
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());
  const [hover, setHover] = useState<number | null>(null);
  const active = hover != null ? segments[hover] : null;

  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }} onPointerLeave={() => setHover(null)}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(23,23,23,0.06)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (Math.max(0, s.value) / total) * c;
            const isActive = hover === i;
            const isDim = hover != null && hover !== i;
            const el = (
              <motion.circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={isActive ? thickness + 3 : thickness}
                strokeDasharray={`${len} ${c}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                initial={{ opacity: 0 }}
                animate={{ opacity: isDim ? 0.28 : 1 }}
                transition={{ duration: 0.18 }}
                onPointerEnter={() => setHover(i)}
                style={{ cursor: "pointer" }}
              />
            );
            offset += len;
            return el;
          })}
          {centerValue && !active && (
            <g transform={`rotate(90 ${size / 2} ${size / 2})`}>
              <text x="50%" y="48%" textAnchor="middle" className="fill-ink font-hero" style={{ fontSize: 18, fontWeight: 600 }}>
                {centerValue}
              </text>
              {centerLabel && (
                <text x="50%" y="62%" textAnchor="middle" className="fill-ink/50" style={{ fontSize: 9 }}>
                  {centerLabel}
                </text>
              )}
            </g>
          )}
        </svg>
        <AnimatePresence>
          {active && (
            <motion.div
              key="c"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.14 }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="text-[8.5px] font-medium uppercase tracking-[0.1em] text-ink/45">{active.label}</div>
              <div className="font-hero text-[18px] font-semibold tabular-nums text-ink leading-tight">{fmt(active.value)}</div>
              <div className="text-[10.5px] tabular-nums" style={{ color: active.color }}>
                {((active.value / total) * 100).toFixed(1)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {segments.map((s, i) => {
          const pct = (Math.max(0, s.value) / total) * 100;
          const isActive = hover === i;
          return (
            <button
              key={s.label}
              type="button"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-[11.5px] transition-colors ${isActive ? "bg-ink/[0.05]" : "hover:bg-ink/[0.03]"}`}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="min-w-0 flex-1 truncate text-ink/70">{s.label}</span>
              <span className="tabular-nums text-ink/50 text-[10.5px]">{fmt(s.value)}</span>
              <span className="tabular-nums text-ink w-9 text-right">{pct.toFixed(0)}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
