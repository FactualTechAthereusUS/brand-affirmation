import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

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
  const boxW = 148;
  const left = Math.max(4, Math.min(containerW - boxW - 4, x - boxW / 2));
  return (
    <motion.div
      initial={{ opacity: 0, y: -2, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -2, scale: 0.98 }}
      transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ left, top: Math.max(4, y - 62), width: boxW }}
      className="pointer-events-none absolute z-20 rounded-lg border border-ink/10 bg-white/95 px-2.5 py-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] backdrop-blur"
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-ink/45">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        {label ?? "Value"}
      </div>
      <div className="mt-0.5 font-hero text-[14px] font-semibold tabular-nums text-ink">{valueText}</div>
      <div className="mt-0.5 text-[10.5px] text-ink/55">{dateText}</div>
      {priorText && <div className="text-[10.5px] text-ink/40">Prior · {priorText}</div>}
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
  data, color = "#171717", height = 96, p90, dates, label, formatValue,
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
  const [hover, setHover] = useState<{ i: number; px: number; py: number; w: number } | null>(null);
  const max = Math.max(...data, p90 ?? 0) || 1;
  const W = 100;
  const H = height;
  const gap = 1.2;
  const barW = (W - gap * (data.length - 1)) / data.length;
  const dts = makeDates(data.length, dates);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrap.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
    const i = Math.max(0, Math.min(data.length - 1, Math.floor((x / r.width) * data.length)));
    const px = ((i + 0.5) / data.length) * r.width;
    const py = (1 - data[i] / max) * (r.height - 4) + 2;
    setHover({ i, px, py, w: r.width });
  };

  return (
    <div
      ref={wrap}
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full">
        {p90 !== undefined && (
          <line
            x1="0" x2={W}
            y1={H - (p90 / max) * (H - 4) - 2}
            y2={H - (p90 / max) * (H - 4) - 2}
            stroke={color} strokeOpacity="0.35" strokeDasharray="2 2" strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {data.map((v, i) => {
          const h = (v / max) * (H - 4);
          const isHot = hover?.i === i;
          return (
            <motion.rect
              key={i}
              x={i * (barW + gap)}
              width={barW}
              initial={{ y: H, height: 0 }}
              whileInView={{ y: H - h - 2, height: h }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.015, ease: "easeOut" }}
              rx="1"
              fill={color}
              opacity={hover ? (isHot ? 1 : 0.45) : 1}
              style={{ transition: "opacity 160ms ease" }}
            />
          );
        })}
      </svg>

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
            color={color}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
