import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import worldTopo from "world-atlas/countries-110m.json";
import { DOT_RULES } from "./dotRules";
import type { LiveSession, PurchaseEvent } from "@/hooks/useLiveSessions";
import type { ProjectFn } from "./PulseOverlay";
import PulseOverlay from "./PulseOverlay";

type Props = {
  sessions: LiveSession[];
  purchaseEvents: PurchaseEvent[];
  className?: string;
};

const W = 1200;
const H = 620;

// Extract real country GeoJSON from the bundled topojson.
type CountryProps = { name: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countriesFC = feature(worldTopo as any, (worldTopo as any).objects.countries) as unknown as FeatureCollection<Geometry, CountryProps>;

// Countries we'll label (larger + recognizable). Rendered only when zoomed enough.
const LABELED = new Set([
  "United States of America", "Canada", "Mexico", "Brazil", "Argentina",
  "United Kingdom", "France", "Spain", "Germany", "Italy", "Poland", "Sweden", "Norway",
  "Russia", "China", "India", "Japan", "South Korea", "Indonesia", "Australia",
  "South Africa", "Egypt", "Saudi Arabia", "Turkey", "Iran", "Pakistan",
  "Nigeria", "Kenya", "Ethiopia", "Algeria", "Libya", "Sudan",
  "Colombia", "Peru", "Chile", "Venezuela",
  "Kazakhstan", "Mongolia", "Thailand", "Vietnam", "Philippines", "Malaysia",
  "New Zealand", "Greenland", "Iceland", "Finland", "Ukraine",
]);

const LABEL_SHORT: Record<string, string> = {
  "United States of America": "United States",
  "Russia": "Russia",
  "United Kingdom": "United Kingdom",
};

export default function LiveMap({ sessions, purchaseEvents, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);

  const projection: GeoProjection = useMemo(
    () => geoNaturalEarth1().fitSize([W, H], countriesFC),
    [],
  );
  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const countryPaths = useMemo(() => {
    return countriesFC.features
      .map((f: Feature<Geometry, CountryProps>) => ({
        name: f.properties?.name ?? "",
        d: pathGen(f) ?? "",
        c: pathGen.centroid(f) as [number, number],
      }))
      .filter((f) => f.d);
  }, [pathGen]);

  const projectPt = useCallback(
    (lat: number, lng: number): [number, number] | null => {
      const p = projection([lng, lat]);
      return p ? [p[0], p[1]] : null;
    },
    [projection],
  );

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
    setZoom((z) => Math.min(6, Math.max(1, z - e.deltaY * 0.002)));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    setPan({ x: drag.current.px + dx, y: drag.current.py + dy });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
  }, []);

  const resetView = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // Projector for PulseOverlay — returns absolute screen px in overlay space
  const project: ProjectFn = useCallback((lat, lng) => {
    if (!box.w) return null;
    const p = projectPt(lat, lng);
    if (!p) return null;
    const sx = (p[0] / W) * box.w * zoom + pan.x;
    const sy = (p[1] / H) * box.h * zoom + pan.y;
    return { x: sx, y: sy, visible: sx > -20 && sx < box.w + 20 && sy > -20 && sy < box.h + 20 };
  }, [box, zoom, pan, projectPt]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ touchAction: "none", background: "#f6f8fc", cursor: drag.current ? "grabbing" : "grab" }}
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
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f6f8fc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#f6f8fc" />
        <rect width={W} height={H} fill="url(#mapGlow)" />

        {/* Countries */}
        <g>
          {countryPaths.map((c) => (
            <path
              key={c.name}
              d={c.d}
              fill="#e4e8ef"
              stroke="#ffffff"
              strokeWidth={0.6}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Country labels — only when zoomed a bit, and only for known countries */}
        {zoom >= 1.2 && (
          <g style={{ pointerEvents: "none" }}>
            {countryPaths.map((c) => {
              if (!LABELED.has(c.name)) return null;
              const [cx, cy] = c.c;
              if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
              const label = LABEL_SHORT[c.name] ?? c.name;
              const fs = Math.max(6.5, 10 / zoom);
              return (
                <text
                  key={`lbl-${c.name}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  fill="#6b7180"
                  fontSize={fs}
                  fontWeight={500}
                  style={{ paintOrder: "stroke", stroke: "#f6f8fc", strokeWidth: 2 }}
                >
                  {label}
                </text>
              );
            })}
          </g>
        )}

        {/* Session dots */}
        {sessions.map((s) => {
          const p = projectPt(s.lat, s.lng);
          if (!p) return null;
          const [x, y] = p;
          const rule = DOT_RULES[s.stage];
          return (
            <g key={s.id}>
              {rule.pulse && (
                <circle cx={x} cy={y} r={rule.sizeMap + 6} fill={rule.hex} opacity={0.22}>
                  <animate attributeName="r" from={rule.sizeMap} to={rule.sizeMap + 14} dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.32" to="0" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={rule.sizeMap / Math.max(1, zoom * 0.7)} fill={rule.hex} stroke="#fff" strokeWidth={1 / zoom}>
                <title>{`${s.city} — ${rule.label}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Pulse rings + arcs overlay (uses screen-space projector) */}
      <PulseOverlay project={project} purchaseEvents={purchaseEvents} hqLat={37.77} hqLng={-122.42} />

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-ink/10 bg-white/90 shadow-sm backdrop-blur">
        <button type="button" onClick={() => setZoom((z) => Math.min(6, z + 0.4))} aria-label="Zoom in" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">+</span>
        </button>
        <div className="h-px w-full bg-ink/10" />
        <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.4))} aria-label="Zoom out" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">−</span>
        </button>
        <div className="h-px w-full bg-ink/10" />
        <button type="button" onClick={resetView} aria-label="Reset" className="grid h-7 w-7 place-items-center text-[9px] font-semibold text-ink/60 hover:bg-ink/[0.04]">
          FIT
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
