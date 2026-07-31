import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Shopify-style daily bar chart.
 * - current period as solid bars, prior period as hatched ghost bars behind
 * - hover highlights the whole column, dims the rest, and pins a tooltip
 * - real y-axis ticks + evenly spaced x labels
 */

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtShort = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const rawStep = max / (count - 1);
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / pow;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * pow;
  const out: number[] = [];
  for (let v = 0; v <= max + step / 2; v += step) out.push(v);
  return out;
}

export function BarChart({
  data,
  prior,
  dates,
  label = "Value",
  priorLabel = "Prior period",
  color = "#4f46e5",
  height = 180,
  formatValue,
  formatYTick,
  xTicks = 5,
}: {
  data: number[];
  prior?: number[];
  dates: number[];
  label?: string;
  priorLabel?: string;
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  formatYTick?: (v: number) => string;
  xTicks?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hi, setHi] = useState<number | null>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const el = wrap.current;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fmt = formatValue ?? ((v: number) => Math.round(v).toLocaleString());
  const fmtY = formatYTick ?? fmt;

  const padL = 38, padR = 8, padT = 8, padB = 24;
  const innerW = Math.max(1, w - padL - padR);
  const innerH = Math.max(1, height - padT - padB);

  const ticks = useMemo(() => {
    const all = [...data, ...(prior ?? [])].filter(Number.isFinite);
    return niceTicks(Math.max(1, ...all));
  }, [data, prior]);
  const maxY = ticks[ticks.length - 1] || 1;

  const n = Math.max(1, data.length);
  const slot = innerW / n;
  const barW = Math.max(2, Math.min(18, slot * 0.56));
  const yAt = (v: number) => padT + innerH - (v / maxY) * innerH;
  const cxAt = (i: number) => padL + slot * (i + 0.5);

  const xTickIdx = useMemo(() => {
    if (n <= xTicks) return data.map((_, i) => i);
    return Array.from({ length: xTicks }, (_, k) => Math.round((k / (xTicks - 1)) * (n - 1)));
  }, [n, xTicks, data]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wrap.current || !w) return;
    const r = wrap.current.getBoundingClientRect();
    const x = e.clientX - r.left - padL;
    if (x < -4 || x > innerW + 4) { setHi(null); return; }
    setHi(Math.max(0, Math.min(n - 1, Math.floor(x / slot))));
  };

  const hatchId = useRef(`hatch-${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <div className="w-full">
      <div
        ref={wrap}
        className="relative w-full select-none"
        style={{ height }}
        onPointerMove={onMove}
        onPointerLeave={() => setHi(null)}
      >
        {w > 0 && (
          <svg width={w} height={height} className="block">
            <defs>
              <pattern id={hatchId} width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(23,23,23,0.20)" strokeWidth="1.6" />
              </pattern>
            </defs>

            {ticks.map((t, i) => {
              const y = yAt(t);
              return (
                <g key={i}>
                  <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="rgba(23,23,23,0.06)" />
                  <text x={padL - 7} y={y + 3} textAnchor="end" style={{ fontSize: 10, fill: "rgba(23,23,23,0.45)" }}>
                    {fmtY(t)}
                  </text>
                </g>
              );
            })}

            {hi !== null && (
              <rect
                x={padL + slot * hi}
                y={padT}
                width={slot}
                height={innerH}
                fill="rgba(23,23,23,0.035)"
                rx="3"
                pointerEvents="none"
              />
            )}

            {prior?.length === data.length &&
              data.map((_, i) => {
                const v = prior[i];
                const h = Math.max(0, padT + innerH - yAt(v));
                return (
                  <rect
                    key={`p${i}`}
                    x={cxAt(i) - barW / 2 - 2}
                    y={yAt(v)}
                    width={barW}
                    height={h}
                    rx={Math.min(3, barW / 2)}
                    fill={`url(#${hatchId})`}
                    opacity={hi === null || hi === i ? 0.7 : 0.25}
                  />
                );
              })}

            {data.map((v, i) => {
              const h = Math.max(0, padT + innerH - yAt(v));
              return (
                <motion.rect
                  key={`d${i}`}
                  x={cxAt(i) - barW / 2 + (prior ? 2 : 0)}
                  width={barW}
                  rx={Math.min(3, barW / 2)}
                  fill={color}
                  initial={{ y: padT + innerH, height: 0 }}
                  animate={{ y: yAt(v), height: h }}
                  transition={{ duration: 0.45, delay: Math.min(0.3, i * 0.008), ease: "easeOut" }}
                  opacity={hi === null || hi === i ? 1 : 0.28}
                />
              );
            })}

            {xTickIdx.map((i) => (
              <text
                key={i}
                x={cxAt(i)}
                y={padT + innerH + 15}
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                style={{ fontSize: 10, fill: "rgba(23,23,23,0.45)" }}
              >
                {fmtShort(dates[i] ?? 0)}
              </text>
            ))}
          </svg>
        )}

        <AnimatePresence>
          {hi !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.13 }}
              className="pointer-events-none absolute z-10 w-[168px] rounded-xl bg-ink px-3 py-2 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.35)]"
              style={{
                left: Math.max(4, Math.min(w - 172, cxAt(hi) - 84)),
                top: Math.max(4, yAt(data[hi]) - 74),
              }}
            >
              <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-white/55">
                {fmtDate(dates[hi] ?? 0)}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                <span className="text-[10.5px] text-white/70">{label}</span>
                <span className="ml-auto font-hero text-[13px] font-semibold tabular-nums text-white">{fmt(data[hi])}</span>
              </div>
              {prior?.length === data.length && (
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <span className="text-[10.5px] text-white/45">{priorLabel}</span>
                  <span className="ml-auto text-[10.5px] tabular-nums text-white/60">{fmt(prior[hi])}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
