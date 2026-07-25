import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/* ────────── shared helpers ────────── */

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

function Tooltip({
  x, y, containerW, label, dateText, valueText, priorText, color,
}: {
  x: number; y: number; containerW: number;
  label?: string; dateText: string; valueText: string; priorText?: string; color: string;
}) {
  const boxW = 156;
  const left = Math.max(4, Math.min(containerW - boxW - 4, x - boxW / 2));
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ left, top: Math.max(4, y - 74), width: boxW }}
      className="pointer-events-none absolute z-20 rounded-xl bg-ink px-3 py-2 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.35)]"
    >
      <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-white/55">{dateText}</div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10.5px] text-white/70">{label ?? "Value"}</span>
        <span className="ml-auto font-hero text-[13px] font-semibold tabular-nums text-white">{valueText}</span>
      </div>
      {priorText && <div className="mt-0.5 text-[10.5px] text-white/45">Prior · {priorText}</div>}
      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
    </motion.div>
  );
}

/* ────────── LineChartMini ────────── */

export function LineChartMini({
  data, prior, stroke = "#171717", fill = "rgba(23,23,23,0.05)", height = 96, band,
  dates, label, formatValue,
}: {
  data: number[];
  prior?: number[];
  stroke?: string;
  fill?: string;
  height?: number;
  band?: { lo: number; hi: number; color?: string };
  dates?: number[];
  label?: string;
  formatValue?: (v: number) => string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ i: number; px: number; py: number; w: number } | null>(null);

  const view = useMemo(() => {
    if (data.length < 2) return null;
    const all = [...data, ...(prior ?? []), ...(band ? [band.lo, band.hi] : [])];
    const min = Math.min(...all);
    const max = Math.max(...all);
    const range = max - min || 1;
    return { min, max, range };
  }, [data, prior, band]);

  if (!view || data.length < 2) return <div style={{ height }} />;
  const { min, range } = view;

  const W = 100;
  const H = height;
  const pad = 4;
  const dts = makeDates(data.length, dates);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());

  const toPts = (arr: number[]): [number, number][] =>
    arr.map((v, i) => [(i / (arr.length - 1)) * W, H - ((v - min) / range) * (H - pad * 2) - pad]);

  // Catmull-Rom → cubic bezier for silky smooth lines (Shopify/Framer feel)
  const smoothPath = (pts: [number, number][], tension = 0.5): string => {
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
  };

  const dataPts = toPts(data);
  const line = smoothPath(dataPts);
  const area = `${line} L${W},${H} L0,${H} Z`;
  const priorLine = prior ? smoothPath(toPts(prior)) : "";
  const bandY = (v: number) => H - ((v - min) / range) * (H - pad * 2) - pad;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrap.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
    const i = Math.round((x / r.width) * (data.length - 1));
    const px = (i / (data.length - 1)) * r.width;
    // Normalised y (0..1) inside SVG, then scaled to container height
    const yNorm = 1 - pad / H - ((data[i] - min) / range) * (1 - (pad * 2) / H);
    const py = yNorm * r.height;
    setHover({ i, px, py, w: r.width });
  };
  const onLeave = () => setHover(null);

  return (
    <div
      ref={wrap}
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full">
        {band && (
          <rect x="0" y={bandY(band.hi)} width={W} height={bandY(band.lo) - bandY(band.hi)} fill={band.color ?? "rgba(74,124,111,0.10)"} />
        )}
        {priorLine && (
          <path d={priorLine} fill="none" stroke={stroke} strokeOpacity="0.25" strokeWidth="1.25" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        )}
        <motion.path d={area} fill={fill} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
        <motion.path
          d={line} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>

      {/* Crosshair + dot */}
      <AnimatePresence>
        {hover && (
          <motion.div
            key="crosshair"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute inset-0"
          >
            <motion.div
              className="absolute top-0 bottom-0 w-px"
              style={{ background: "rgba(23,23,23,0.14)" }}
              initial={false}
              animate={{ left: hover.px }}
              transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.4 }}
            />
            <motion.div
              className="absolute h-2.5 w-2.5 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
              style={{ background: stroke }}
              initial={false}
              animate={{ left: hover.px - 5, top: hover.py - 5 }}
              transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.4 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date axis (start/end) */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-4 flex justify-between px-0.5 text-[9.5px] text-ink/40 tabular-nums">
        <span>{fmtShortDate(dts[0])}</span>
        <span>{fmtShortDate(dts[dts.length - 1])}</span>
      </div>

      <AnimatePresence>
        {hover && (
          <Tooltip
            key="tt"
            x={hover.px}
            y={hover.py}
            containerW={hover.w}
            label={label}
            dateText={fmtDate(dts[hover.i])}
            valueText={fmt(data[hover.i])}
            priorText={prior ? fmt(prior[hover.i]) : undefined}
            color={stroke}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────── BarsMini ────────── */

export function BarsMini({
  data, color = "#2563eb", height = 96, p90, dates, label, formatValue,
}: {
  data: number[];
  color?: string;
  height?: number;
  p90?: number;
  dates?: number[];
  label?: string;
  formatValue?: (v: number) => string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<{ i: number; px: number; py: number } | null>(null);

  // Measure to render in pixel space so bars stay crisp and rounded caps stay round
  const measureRef = (el: HTMLDivElement | null) => {
    wrap.current = el;
    if (el && w === 0) setW(el.clientWidth);
  };
  useMemo(() => {
    if (!wrap.current) return;
    const el = wrap.current;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrap.current]);

  const max = Math.max(...data, p90 ?? 0) || 1;
  const padL = 32;
  const padR = 8;
  const padT = 8;
  const padB = 20;
  const H = height;
  const innerW = Math.max(1, w - padL - padR);
  const innerH = Math.max(1, H - padT - padB);
  const gap = data.length > 20 ? 2 : 3;
  const barW = Math.max(2, (innerW - gap * (data.length - 1)) / data.length);
  const dts = makeDates(data.length, dates);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());
  const fmtY = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : Math.round(v).toString();

  // 3 Y ticks
  const ticks = [max, max * 0.5, 0];

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrap.current; if (!el || w === 0) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
    if (x < padL - 4 || x > padL + innerW + 4) { setHover(null); return; }
    const i = Math.max(0, Math.min(data.length - 1, Math.floor(((x - padL) / innerW) * data.length)));
    const px = padL + ((i + 0.5) / data.length) * innerW;
    const py = padT + (1 - data[i] / max) * innerH;
    setHover({ i, px, py });
  };

  const gradId = useRef(`bg-${Math.random().toString(36).slice(2, 7)}`).current;

  return (
    <div
      ref={measureRef}
      className="relative w-full select-none"
      style={{ height: H + 12 }}
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      {w > 0 && (
        <svg width={w} height={H} className="block">
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Grid + Y ticks */}
          {ticks.map((t, i) => {
            const y = padT + (1 - t / max) * innerH;
            return (
              <g key={i}>
                <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="rgba(23,23,23,0.06)" strokeWidth="1" />
                <text x={padL - 6} y={y + 3} textAnchor="end" style={{ fontSize: 9.5, fill: "rgba(23,23,23,0.4)" }}>{fmtY(t)}</text>
              </g>
            );
          })}

          {/* p90 line */}
          {p90 !== undefined && (
            <g>
              <line
                x1={padL} x2={padL + innerW}
                y1={padT + (1 - p90 / max) * innerH}
                y2={padT + (1 - p90 / max) * innerH}
                stroke={color} strokeOpacity="0.55" strokeDasharray="3 3" strokeWidth="1.25"
              />
            </g>
          )}

          {/* Bars */}
          {data.map((v, i) => {
            const h = (v / max) * innerH;
            const y = padT + innerH - h;
            const x = padL + i * (barW + gap);
            const isHot = hover?.i === i;
            return (
              <motion.rect
                key={i}
                x={x}
                width={barW}
                y={y}
                height={h}
                rx={Math.min(barW / 2, 3)}
                fill={`url(#${gradId})`}
                initial={{ opacity: 0, y: y + h, height: 0 }}
                animate={{ opacity: 1, y, height: h }}
                transition={{ duration: 0.5, delay: i * 0.012, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ filter: hover && !isHot ? "brightness(0.7) saturate(0.7)" : undefined, transition: "filter 160ms ease" }}
              />
            );
          })}

          {/* Hover crosshair */}
          {hover && (
            <line
              x1={hover.px} x2={hover.px}
              y1={padT} y2={padT + innerH}
              stroke="rgba(23,23,23,0.22)" strokeWidth="1" strokeDasharray="2 2"
              pointerEvents="none"
            />
          )}

          {/* X ticks (start / end) */}
          <text x={padL} y={H - 4} style={{ fontSize: 9.5, fill: "rgba(23,23,23,0.42)" }}>{fmtShortDate(dts[0])}</text>
          <text x={padL + innerW} y={H - 4} textAnchor="end" style={{ fontSize: 9.5, fill: "rgba(23,23,23,0.42)" }}>{fmtShortDate(dts[dts.length - 1])}</text>
        </svg>
      )}

      <AnimatePresence>
        {hover && (
          <Tooltip
            key="tt"
            x={hover.px}
            y={hover.py}
            containerW={w}
            label={label}
            dateText={fmtDate(dts[hover.i])}
            valueText={fmt(data[hover.i])}
            color={color}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
