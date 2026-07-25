import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Shopify-style area line chart with:
 * - Left Y-axis with 3-4 ticks
 * - Bottom X-axis with evenly spaced date labels
 * - Smooth Catmull-Rom curve, gradient fill, dashed prior period
 * - Hover crosshair + tooltip
 * - Bottom legend
 *
 * Renders in pixel space (measured via ResizeObserver) so the curve never
 * distorts or cuts off, regardless of container width.
 */

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtShortDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function makeDates(len: number, dates?: number[]): number[] {
  if (dates && dates.length === len) return dates;
  const now = Date.now();
  const day = 86400000;
  return Array.from({ length: len }, (_, i) => now - (len - 1 - i) * day);
}

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const range = max - min;
  const rawStep = range / (count - 1);
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / pow;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * pow;
  const start = Math.floor(min / step) * step;
  const out: number[] = [];
  for (let v = start; v <= max + step / 2; v += step) out.push(v);
  return out;
}

function smoothPath(pts: [number, number][], tension = 0.5): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function AreaChart({
  data,
  prior,
  dates,
  label = "Value",
  priorLabel = "Prior period",
  stroke = "#171717",
  fill = "rgba(23,23,23,0.06)",
  height = 220,
  formatValue,
  formatYTick,
  band,
  legend = true,
  yTicks = 4,
  xTicks = 5,
}: {
  data: number[];
  prior?: number[];
  dates?: number[];
  label?: string;
  priorLabel?: string;
  stroke?: string;
  fill?: string;
  height?: number;
  formatValue?: (v: number) => string;
  formatYTick?: (v: number) => string;
  band?: { lo: number; hi: number; color?: string };
  legend?: boolean;
  yTicks?: number;
  xTicks?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<{ i: number; px: number; py: number } | null>(null);

  useLayoutEffect(() => {
    if (!wrap.current) return;
    const el = wrap.current;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fmt = formatValue ?? ((v: number) => v.toLocaleString());
  const fmtY = formatYTick ?? fmt;
  const dts = useMemo(() => makeDates(data.length, dates), [data.length, dates]);

  const padL = 40;
  const padR = 12;
  const padT = 8;
  const padB = 26;
  const H = height;
  const innerW = Math.max(1, w - padL - padR);
  const innerH = Math.max(1, H - padT - padB);

  const { minY, maxY, ticks } = useMemo(() => {
    const all = [...data, ...(prior ?? []), ...(band ? [band.lo, band.hi] : [])].filter(Number.isFinite);
    if (!all.length) return { minY: 0, maxY: 1, ticks: [0, 1] };
    let lo = Math.min(...all);
    let hi = Math.max(...all);
    if (lo === hi) { lo = lo - 1; hi = hi + 1; }
    // pad the range slightly
    const pad = (hi - lo) * 0.08;
    lo = Math.max(0, lo - pad);
    hi = hi + pad;
    const ts = niceTicks(lo, hi, yTicks);
    return { minY: ts[0], maxY: ts[ts.length - 1], ticks: ts };
  }, [data, prior, band, yTicks]);

  const range = maxY - minY || 1;
  const xAt = (i: number, n = data.length) => padL + (i / Math.max(1, n - 1)) * innerW;
  const yAt = (v: number) => padT + (1 - (v - minY) / range) * innerH;

  const dataPts: [number, number][] = data.map((v, i) => [xAt(i), yAt(v)]);
  const priorPts: [number, number][] | null = prior && prior.length === data.length
    ? prior.map((v, i) => [xAt(i), yAt(v)]) : null;

  const line = smoothPath(dataPts);
  const area = w > 0 && dataPts.length > 1
    ? `${line} L${dataPts[dataPts.length - 1][0]},${padT + innerH} L${dataPts[0][0]},${padT + innerH} Z`
    : "";
  const priorLine = priorPts ? smoothPath(priorPts) : "";

  // evenly spaced x-tick indices
  const xTickIdx = useMemo(() => {
    const n = data.length;
    if (n <= xTicks) return data.map((_, i) => i);
    const out: number[] = [];
    for (let k = 0; k < xTicks; k++) out.push(Math.round((k / (xTicks - 1)) * (n - 1)));
    return out;
  }, [data.length, xTicks]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wrap.current || w === 0) return;
    const r = wrap.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < padL - 8 || x > padL + innerW + 8) { setHover(null); return; }
    const t = Math.max(0, Math.min(1, (x - padL) / innerW));
    const i = Math.round(t * (data.length - 1));
    setHover({ i, px: xAt(i), py: yAt(data[i]) });
  };

  const gradId = useRef(`grad-${Math.random().toString(36).slice(2, 8)}`).current;
  const clipId = useRef(`clip-${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <div className="w-full">
      <div
        ref={wrap}
        className="relative w-full select-none"
        style={{ height: H }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {w > 0 && (
          <svg width={w} height={H} className="block">
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.20" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
              <clipPath id={clipId}>
                <rect x={padL} y={padT} width={innerW} height={innerH} />
              </clipPath>
            </defs>

            {/* Grid + Y ticks */}
            {ticks.map((t, i) => {
              const y = yAt(t);
              return (
                <g key={i}>
                  <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="rgba(23,23,23,0.06)" strokeWidth="1" />
                  <text x={padL - 8} y={y + 3} textAnchor="end" className="fill-current" style={{ fontSize: 10, fill: "rgba(23,23,23,0.45)" }}>
                    {fmtY(t)}
                  </text>
                </g>
              );
            })}

            {/* Optional target band */}
            {band && (
              <rect
                x={padL}
                y={yAt(band.hi)}
                width={innerW}
                height={Math.max(0, yAt(band.lo) - yAt(band.hi))}
                fill={band.color ?? "rgba(74,124,111,0.10)"}
              />
            )}

            {/* Prior period */}
            {priorLine && (
              <path
                d={priorLine}
                fill="none"
                stroke={stroke}
                strokeOpacity="0.32"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeLinecap="round"
                clipPath={`url(#${clipId})`}
              />
            )}

            {/* Area + line */}
            <motion.path
              d={area}
              fill={`url(#${gradId})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              clipPath={`url(#${clipId})`}
            />
            <motion.path
              d={line}
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              clipPath={`url(#${clipId})`}
            />

            {/* X ticks */}
            {xTickIdx.map((i) => (
              <text
                key={i}
                x={xAt(i)}
                y={padT + innerH + 16}
                textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
                style={{ fontSize: 10, fill: "rgba(23,23,23,0.45)" }}
              >
                {fmtShortDate(dts[i])}
              </text>
            ))}

            {/* Hover crosshair + dot */}
            {hover && (
              <g pointerEvents="none">
                <line
                  x1={hover.px}
                  x2={hover.px}
                  y1={padT}
                  y2={padT + innerH}
                  stroke="rgba(23,23,23,0.25)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                {priorPts && (
                  <circle cx={hover.px} cy={priorPts[hover.i][1]} r="3" fill="#fff" stroke={stroke} strokeOpacity="0.5" strokeWidth="1.5" />
                )}
                <circle cx={hover.px} cy={hover.py} r="4.5" fill={stroke} stroke="#fff" strokeWidth="2" />
              </g>
            )}
          </svg>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {hover && (
            <motion.div
              key="tt"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute z-10 rounded-lg border border-ink/10 bg-white/95 px-2.5 py-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] backdrop-blur"
              style={{
                left: Math.max(4, Math.min(w - 160, hover.px - 80)),
                top: Math.max(4, hover.py - 68),
                width: 156,
              }}
            >
              <div className="text-[10px] uppercase tracking-[0.06em] text-ink/45">{fmtDate(dts[hover.i])}</div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: stroke }} />
                <span className="text-[11px] text-ink/60">{label}</span>
                <span className="ml-auto font-hero text-[12px] font-semibold tabular-nums text-ink">{fmt(data[hover.i])}</span>
              </div>
              {prior && (
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: stroke, opacity: 0.35 }} />
                  <span className="text-[11px] text-ink/45">{priorLabel}</span>
                  <span className="ml-auto text-[11px] tabular-nums text-ink/60">{fmt(prior[hover.i])}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {legend && (
        <div className="mt-2 flex items-center justify-center gap-4 text-[10.5px] text-ink/55">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: stroke }} />
            {fmtShortDate(dts[dts.length - 1])}
          </span>
          {prior && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded" style={{ borderTop: `2px dashed ${stroke}`, opacity: 0.5 }} />
              {priorLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
