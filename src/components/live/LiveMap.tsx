import { useMemo } from "react";
import { DOT_RULES } from "./dotRules";
import type { LiveSession } from "@/hooks/useLiveSessions";

/**
 * 2D dotted world map. Equirectangular projection with a procedural dot grid.
 * No external data files — we render a soft dot lattice and clip land visually
 * by fading dots that fall over ocean via a subtle SVG mask (kept minimal on
 * purpose; this is the fallback view, not the hero).
 */

type Props = {
  sessions: LiveSession[];
  className?: string;
};

const W = 1600;
const H = 800;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [x, y];
}

export default function LiveMap({ sessions, className }: Props) {
  const dots = useMemo(() => {
    const arr: [number, number][] = [];
    const stepX = 14;
    const stepY = 14;
    for (let y = stepY; y < H; y += stepY) {
      for (let x = stepX; x < W; x += stepX) {
        // Fake landmass distribution: bias by trig noise — cheap but recognizable shape.
        const lat = 90 - (y / H) * 180;
        const lng = (x / W) * 360 - 180;
        // Very rough continent mask
        const n =
          Math.sin(lat * 0.12) * Math.cos(lng * 0.09) +
          Math.sin((lat + 40) * 0.08) * Math.cos((lng - 20) * 0.06);
        if (n > 0.15) arr.push([x, y]);
      }
    }
    return arr;
  }, []);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#f7fafc" />
        <rect width={W} height={H} fill="url(#mapGlow)" />

        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.4} fill="#c7d2fe" opacity={0.55} />
        ))}

        {sessions.map((s) => {
          const [x, y] = project(s.lat, s.lng);
          const rule = DOT_RULES[s.stage];
          return (
            <g key={s.id}>
              {rule.pulse && (
                <circle cx={x} cy={y} r={rule.sizeMap + 6} fill={rule.hex} opacity={0.18}>
                  <animate attributeName="r" from={rule.sizeMap} to={rule.sizeMap + 14} dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.32" to="0" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={rule.sizeMap} fill={rule.hex}>
                <title>{`${s.city} — ${rule.label}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
