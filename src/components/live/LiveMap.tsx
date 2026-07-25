import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DOT_RULES } from "./dotRules";
import type { LiveSession, PurchaseEvent } from "@/hooks/useLiveSessions";
import type { ProjectFn } from "./PulseOverlay";
import PulseOverlay from "./PulseOverlay";

type Props = {
  sessions: LiveSession[];
  purchaseEvents: PurchaseEvent[];
  className?: string;
};

const W = 1600;
const H = 800;

function projectEq(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [x, y];
}

/**
 * Rough continent mask — dot lattice biased by trig noise to look like
 * Shopify's dotted-world visualization. Not a real map, but recognizable
 * enough for a live-view fallback.
 */
function useLandDots() {
  return useMemo(() => {
    const dots: [number, number][] = [];
    const step = 12;
    for (let y = step; y < H; y += step) {
      for (let x = step; x < W; x += step) {
        const lat = 90 - (y / H) * 180;
        const lng = (x / W) * 360 - 180;
        // Simple continent-like bias
        const n =
          Math.sin(lat * 0.11) * Math.cos(lng * 0.08) +
          Math.sin((lat + 30) * 0.09) * Math.cos((lng - 10) * 0.07) +
          Math.sin((lat - 20) * 0.05) * Math.cos((lng + 60) * 0.05);
        if (n > 0.25 && lat < 78 && lat > -60) dots.push([x, y]);
      }
    }
    return dots;
  }, []);
}

export default function LiveMap({ sessions, purchaseEvents, className }: Props) {
  const landDots = useLandDots();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      const r = wrapRef.current!.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.002)));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    setPan({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
  }, []);

  // Projector for PulseOverlay — accepts lat/lng, returns absolute screen px in overlay space
  const project: ProjectFn = useCallback((lat, lng) => {
    if (!box.w) return null;
    const [wx, wy] = projectEq(lat, lng);
    const sx = (wx / W) * box.w * zoom + pan.x;
    const sy = (wy / H) * box.h * zoom + pan.y;
    return { x: sx, y: sy, visible: sx > -20 && sx < box.w + 20 && sy > -20 && sy < box.h + 20 };
  }, [box, zoom, pan]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ touchAction: "none", background: "linear-gradient(180deg,#fafbff 0%,#f5f7fb 100%)" }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f6f8fc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#f6f8fc" />
        <rect width={W} height={H} fill="url(#mapGlow)" />

        {landDots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.2} fill="#c7d2fe" opacity={0.55} />
        ))}

        {sessions.map((s) => {
          const [x, y] = projectEq(s.lat, s.lng);
          const rule = DOT_RULES[s.stage];
          return (
            <g key={s.id}>
              {rule.pulse && (
                <circle cx={x} cy={y} r={rule.sizeMap + 6} fill={rule.hex} opacity={0.18}>
                  <animate attributeName="r" from={rule.sizeMap} to={rule.sizeMap + 14} dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.32" to="0" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={rule.sizeMap} fill={rule.hex} stroke="#fff" strokeWidth={1}>
                <title>{`${s.city} — ${rule.label}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Pulse rings + arcs live in absolute-positioned overlay space so they follow pan+zoom via project() */}
      <PulseOverlay project={project} purchaseEvents={purchaseEvents} hqLat={37.77} hqLng={-122.42} />

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-ink/10 bg-white/90 shadow-sm backdrop-blur">
        <button type="button" onClick={() => setZoom((z) => Math.min(4, z + 0.4))} aria-label="Zoom in" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">+</span>
        </button>
        <div className="h-px w-full bg-ink/10" />
        <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.4))} aria-label="Zoom out" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md border border-ink/10 bg-white/85 px-2.5 py-1 text-[10.5px] font-medium text-ink/70 shadow-sm backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: DOT_RULES.browsing.hex }} /> Visitors
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: DOT_RULES.cart.hex }} /> Intake
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: DOT_RULES.checkout.hex }} /> Checkout
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: DOT_RULES.purchased.hex }} /> Orders
        </span>
      </div>
    </div>
  );
}
