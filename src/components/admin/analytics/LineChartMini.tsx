import { motion } from "framer-motion";

export function LineChartMini({
  data,
  prior,
  stroke = "#171717",
  fill = "rgba(23,23,23,0.05)",
  height = 96,
  band,
}: {
  data: number[];
  prior?: number[];
  stroke?: string;
  fill?: string;
  height?: number;
  band?: { lo: number; hi: number; color?: string };
}) {
  if (data.length < 2) return <div style={{ height }} />;
  const all = [...data, ...(prior ?? []), ...(band ? [band.lo, band.hi] : [])];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const W = 100;
  const H = height;
  const pad = 4;
  const toXY = (arr: number[]) =>
    arr.map((v, i) => `${(i / (arr.length - 1)) * W},${H - ((v - min) / range) * (H - pad * 2) - pad}`);
  const pts = toXY(data);
  const line = `M${pts.join(" L")}`;
  const area = `${line} L${W},${H} L0,${H} Z`;
  const priorLine = prior ? `M${toXY(prior).join(" L")}` : "";
  const bandY = (v: number) => H - ((v - min) / range) * (H - pad * 2) - pad;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full">
      {band && (
        <rect x="0" y={bandY(band.hi)} width={W} height={bandY(band.lo) - bandY(band.hi)} fill={band.color ?? "rgba(74,124,111,0.10)"} />
      )}
      {priorLine && (
        <path d={priorLine} fill="none" stroke={stroke} strokeOpacity="0.25" strokeWidth="1.25" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      )}
      <motion.path d={area} fill={fill} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

export function BarsMini({
  data,
  color = "#171717",
  height = 96,
  p90,
}: {
  data: number[];
  color?: string;
  height?: number;
  p90?: number;
}) {
  const max = Math.max(...data, p90 ?? 0) || 1;
  const W = 100;
  const H = height;
  const gap = 1.2;
  const barW = (W - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full">
      {p90 !== undefined && (
        <line x1="0" x2={W} y1={H - (p90 / max) * (H - 4) - 2} y2={H - (p90 / max) * (H - 4) - 2}
          stroke={color} strokeOpacity="0.35" strokeDasharray="2 2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      )}
      {data.map((v, i) => {
        const h = (v / max) * (H - 4);
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
          />
        );
      })}
    </svg>
  );
}
