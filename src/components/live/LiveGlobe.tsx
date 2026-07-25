import createGlobe from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";
import { DOT_RULES, HQ } from "./dotRules";
import type { LiveSession, PurchaseEvent } from "@/hooks/useLiveSessions";
import PulseOverlay, { type ProjectFn } from "./PulseOverlay";

type Props = {
  sessions: LiveSession[];
  purchaseEvents: PurchaseEvent[];
  focus?: { lat: number; lng: number } | null;
  className?: string;
};

type Tooltip = { x: number; y: number; session: LiveSession } | null;

// COBE convention: [phi, theta] = [longitude-derived, latitude-derived] radians.
function locationToAngles(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}

// World unit vector → camera-space [x2, y2, z2] using current phi/theta.
function projectLatLng(lat: number, lng: number, phi: number, theta: number) {
  const latR = (lat * Math.PI) / 180;
  const lngR = (lng * Math.PI) / 180;
  const wx = Math.cos(latR) * Math.cos(lngR);
  const wy = Math.sin(latR);
  const wz = Math.cos(latR) * Math.sin(lngR);
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const x1 = wx * cosP - wz * sinP;
  const z1 = wx * sinP + wz * cosP;
  const y1 = wy;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const y2 = y1 * cosT - z1 * sinT;
  const z2 = y1 * sinT + z1 * cosT;
  return { x2: x1, y2, z2 };
}

export default function LiveGlobe({ sessions, purchaseEvents, focus, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  const phi = useRef(4.3);
  const theta = useRef(0.3);
  const targetPhi = useRef<number | null>(null);
  const targetTheta = useRef<number | null>(null);
  const scale = useRef(1.05);
  const drag = useRef<{ x: number; y: number; phi: number; theta: number } | null>(null);
  const lastInteract = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  const purchaseRef = useRef(purchaseEvents);
  purchaseRef.current = purchaseEvents;

  const [tooltip, setTooltip] = useState<Tooltip>(null);

  // Focus interp
  useEffect(() => {
    if (!focus) return;
    const [tp, tt] = locationToAngles(focus.lat, focus.lng);
    targetPhi.current = tp;
    targetTheta.current = tt;
    lastInteract.current = Date.now();
  }, [focus]);

  // Build / resize globe
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!canvas || !wrap) return;

    let disposed = false;

    const rebuild = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(320, rect.width);
      const h = Math.max(320, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      globeRef.current?.destroy();
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: w * dpr,
        height: h * dpr,
        phi: phi.current,
        theta: theta.current,
        dark: 0,
        diffuse: 1.15,
        scale: scale.current,
        mapSamples: 22000,
        mapBrightness: 5.4,
        mapBaseBrightness: 0,
        // Teal-mint continents on a very light sphere — Shopify parity.
        baseColor: [0.42, 0.86, 0.78],
        markerColor: [0.486, 0.227, 0.929],
        glowColor: [0.93, 0.98, 0.97],
        markers: [],
        opacity: 1,
        onRender: (state: Record<string, unknown>) => {
          const now = Date.now();
          const idleFor = now - lastInteract.current;

          if (targetPhi.current != null && targetTheta.current != null) {
            phi.current += (targetPhi.current - phi.current) * 0.08;
            theta.current += (targetTheta.current - theta.current) * 0.08;
            if (
              Math.abs(targetPhi.current - phi.current) < 0.002 &&
              Math.abs(targetTheta.current - theta.current) < 0.002
            ) {
              targetPhi.current = null;
              targetTheta.current = null;
            }
          } else if (!drag.current && idleFor > 2000) {
            phi.current += 0.0022;
          }

          if (theta.current > 0.9) theta.current = 0.9;
          if (theta.current < -0.9) theta.current = -0.9;

          state.phi = phi.current;
          state.theta = theta.current;
          state.scale = scale.current;

          // Markers — per-session color + pulse
          state.markers = sessionsRef.current.map((s) => {
            const rule = DOT_RULES[s.stage];
            const sz = rule.pulse ? rule.size * (1 + 0.35 * Math.sin(now / 300)) : rule.size;
            return {
              location: [s.lat, s.lng] as [number, number],
              size: sz,
            };
          });
        },
      } as Parameters<typeof createGlobe>[1]);
    };

    rebuild();
    const ro = new ResizeObserver(() => {
      if (disposed) return;
      rebuild();
    });
    ro.observe(wrap);

    return () => {
      disposed = true;
      ro.disconnect();
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, []);

  // Pointer handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, phi: phi.current, theta: theta.current };
    targetPhi.current = null;
    targetTheta.current = null;
    lastInteract.current = Date.now();
  }, []);

  const hitTest = useCallback(() => {
    const wrap = wrapperRef.current;
    const p = pointer.current;
    if (!wrap || !p) return;
    const { width, height } = wrap.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;
    const r = (Math.min(width, height) / 2) * scale.current * 0.92;

    let best: { d: number; sx: number; sy: number; session: LiveSession } | null = null;
    for (const s of sessionsRef.current) {
      const { x2, y2, z2 } = projectLatLng(s.lat, s.lng, phi.current, theta.current);
      if (z2 < 0.02) continue;
      const sx = cx + x2 * r;
      const sy = cy - y2 * r;
      const dx = sx - p.x;
      const dy = sy - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const hit = DOT_RULES[s.stage].size * 220;
      if (d < Math.max(10, hit)) {
        if (!best || d < best.d) best = { d, sx, sy, session: s };
      }
    }
    if (best) setTooltip({ x: best.sx, y: best.sy, session: best.session });
    else setTooltip((prev) => (prev ? null : prev));
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const wrap = wrapperRef.current;
    if (wrap) {
      const r = wrap.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      hitTest();
    }
    if (drag.current) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      phi.current = drag.current.phi + dx / 200;
      theta.current = drag.current.theta - dy / 200;
      lastInteract.current = Date.now();
    }
  }, [hitTest]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
    lastInteract.current = Date.now();
  }, []);

  const onPointerLeave = useCallback(() => {
    pointer.current = null;
    setTooltip(null);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    scale.current = Math.min(2.2, Math.max(0.9, scale.current - e.deltaY * 0.002));
    lastInteract.current = Date.now();
  }, []);

  const zoom = useCallback((delta: number) => {
    scale.current = Math.min(2.2, Math.max(0.9, scale.current + delta));
    lastInteract.current = Date.now();
  }, []);

  // Overlay projector — called every frame from PulseOverlay
  const project: ProjectFn = useCallback((lat, lng) => {
    const wrap = wrapperRef.current;
    if (!wrap) return null;
    const { width, height } = wrap.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;
    const r = (Math.min(width, height) / 2) * scale.current * 0.92;
    const { x2, y2, z2 } = projectLatLng(lat, lng, phi.current, theta.current);
    if (z2 < -0.05) return null; // behind globe
    return { x: cx + x2 * r, y: cy - y2 * r, visible: z2 > 0.02 };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative select-none ${className ?? ""}`}
      style={{ touchAction: "none", background: "#f6f8fc" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
    >
      <canvas ref={canvasRef} style={{ cursor: drag.current ? "grabbing" : "grab" }} />

      {/* Pulse rings + arcs (SVG overlay that sticks to globe as it rotates) */}
      <PulseOverlay project={project} purchaseEvents={purchaseEvents} hqLat={HQ.lat} hqLng={HQ.lng} />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-ink/10 bg-white px-2 py-1 text-[11px] font-medium text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          <span
            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
            style={{ background: DOT_RULES[tooltip.session.stage].hex }}
          />
          <span className="align-middle">{tooltip.session.city}</span>
          <span className="ml-1.5 align-middle text-ink/45">
            · {DOT_RULES[tooltip.session.stage].label}
          </span>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-ink/10 bg-white/90 shadow-sm backdrop-blur">
        <button type="button" onClick={() => zoom(0.2)} aria-label="Zoom in" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">+</span>
        </button>
        <div className="h-px w-full bg-ink/10" />
        <button type="button" onClick={() => zoom(-0.2)} aria-label="Zoom out" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
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
