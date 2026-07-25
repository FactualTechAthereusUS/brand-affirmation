import { motion } from "framer-motion";

export function Donut({
  segments,
  centerLabel,
  centerValue,
  size = 148,
  thickness = 18,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  thickness?: number;
}) {
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(23,23,23,0.06)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (Math.max(0, s.value) / total) * c;
          const el = (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            />
          );
          offset += len;
          return el;
        })}
        {centerValue && (
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
      <div className="min-w-0 flex-1 space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[11.5px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="min-w-0 flex-1 truncate text-ink/70">{s.label}</span>
            <span className="tabular-nums text-ink">{Math.round((Math.max(0, s.value) / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
