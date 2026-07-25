import { useEffect, useRef, useState } from "react";
import { DOT_RULES } from "./dotRules";
import type { PurchaseEvent } from "@/hooks/useLiveSessions";

export type ProjectFn = (
  lat: number,
  lng: number,
) => { x: number; y: number; visible: boolean } | null;

type Props = {
  project: ProjectFn;
  purchaseEvents: PurchaseEvent[];
  hqLat: number;
  hqLng: number;
};

/**
 * SVG overlay glued to the globe/map. Renders:
 *  - decaying halo rings for every recent purchase
 *  - animated arc from purchase origin → SF HQ
 * A tiny requestAnimationFrame loop re-projects positions so overlays stay
 * pinned as the underlying globe rotates.
 */
export default function PulseOverlay({ project, purchaseEvents, hqLat, hqLng }: Props) {
  const [tick, setTick] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const loop = () => {
      setTick((t) => (t + 1) % 1_000_000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const now = Date.now();
  // `tick` used only to force re-render each frame
  void tick;

  const emerald = DOT_RULES.purchased.hex;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      {purchaseEvents.map((e) => {
        const p = project(e.lat, e.lng);
        if (!p || !p.visible) return null;
        const age = now - e.at;
        const life = 8000;
        if (age > life) return null;
        const t = age / life; // 0..1
        // 3 concentric rings, staggered
        return (
          <g key={e.id}>
            {[0, 300, 600].map((delay) => {
              const localAge = age - delay;
              if (localAge < 0) return null;
              const lt = Math.min(1, localAge / (life - 600));
              const radius = 6 + lt * 42;
              const opacity = (1 - lt) * 0.55;
              return (
                <circle
                  key={delay}
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill="none"
                  stroke={emerald}
                  strokeWidth={1.5}
                  opacity={opacity}
                />
              );
            })}
            {/* solid dot on top */}
            <circle cx={p.x} cy={p.y} r={5} fill={emerald} opacity={1 - t * 0.4} />
          </g>
        );
      })}

      {/* Arcs — cubic bezier from purchase origin → HQ, drawn only while both endpoints are visible */}
      {purchaseEvents.map((e) => {
        const src = project(e.lat, e.lng);
        const dst = project(hqLat, hqLng);
        if (!src || !dst || !src.visible || !dst.visible) return null;
        const age = now - e.at;
        const life = 4000;
        if (age > life) return null;
        const t = Math.min(1, age / life);
        const midX = (src.x + dst.x) / 2;
        const midY = (src.y + dst.y) / 2;
        // Lift the control point perpendicular to segment for a natural arc
        const dx = dst.x - src.x;
        const dy = dst.y - src.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const lift = Math.min(140, len * 0.35);
        const cx = midX + nx * lift;
        const cy = midY + ny * lift - 8; // slight upward bias
        const path = `M ${src.x} ${src.y} Q ${cx} ${cy} ${dst.x} ${dst.y}`;
        return (
          <g key={`arc-${e.id}`}>
            <path
              d={path}
              fill="none"
              stroke={emerald}
              strokeWidth={1.5}
              strokeDasharray={4}
              opacity={0.55 * (1 - t)}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
