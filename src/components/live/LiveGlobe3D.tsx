import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection } from "geojson";
import type { LiveSession, PurchaseEvent } from "@/hooks/useLiveSessions";
import { DOT_RULES } from "./dotRules";

type Props = {
  sessions: LiveSession[];
  purchaseEvents: PurchaseEvent[];
  focus?: { lat: number; lng: number } | null;
  streamer?: boolean;
  className?: string;
};


type Tooltip = { x: number; y: number; session: LiveSession } | null;

const GLOBE_RADIUS = 100;
const MIN_DIST = 180;
const MAX_DIST = 380;
const INIT_DIST = 260;

// Shopify palette (from HTML dump)
const HEX_COLOR = "#6ECDB8";           // mint hex continents
const OCEAN_COLOR = "#F2F6FA";         // off-white sphere
const ATMO_COLOR = "#C9E7F0";          // light-cyan halo
const ORDER_FILL = "#8F71EF";
const ORDER_RING = "#7F4AFA";
const VISITOR_COLOR = "#13ACF0";

// Convert lat/lng to spherical [phi, theta] for camera.
function latLngToPhiTheta(lat: number, lng: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return { phi, theta };
}

export default function LiveGlobe3D({ sessions, purchaseEvents, focus, streamer, className }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasHolderRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const rafRef = useRef<number | null>(null);

  // Camera state (spherical around origin)
  const camPhi = useRef(Math.PI / 2 - 0.4);   // slight tilt north
  const camTheta = useRef(Math.PI * 1.2);     // start over North America
  const camDist = useRef(INIT_DIST);
  const targetPhi = useRef<number | null>(null);
  const targetTheta = useRef<number | null>(null);
  const targetDist = useRef<number | null>(null);

  const drag = useRef<{ x: number; y: number; phi: number; theta: number; t: number; vTheta: number; vPhi: number; lastX: number; lastY: number; lastT: number } | null>(null);
  const momentum = useRef<{ vTheta: number; vPhi: number } | null>(null);
  const lastInteract = useRef(Date.now());
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  const purchaseRef = useRef(purchaseEvents);
  purchaseRef.current = purchaseEvents;


  const [tooltip, setTooltip] = useState<Tooltip>(null);
  const [ready, setReady] = useState(false);

  // Load world topology once
  const [landFeatures, setLandFeatures] = useState<Feature[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("world-atlas/countries-110m.json");
      const topoRaw = (mod as { default?: unknown }).default ?? mod;
      const topo = topoRaw as unknown as Parameters<typeof feature>[0] & {
        objects: { countries: Parameters<typeof feature>[1] };
      };
      const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection;
      if (!cancelled) setLandFeatures(fc.features);
    })();
    return () => { cancelled = true; };
  }, []);

  // Focus interpolation
  useEffect(() => {
    if (!focus) return;
    const { phi, theta } = latLngToPhiTheta(focus.lat, focus.lng);
    targetPhi.current = phi;
    targetTheta.current = theta;
    targetDist.current = Math.max(MIN_DIST, Math.min(camDist.current, 220));
    lastInteract.current = Date.now();
  }, [focus]);

  // Init scene
  useEffect(() => {
    const holder = canvasHolderRef.current;
    const wrap = wrapperRef.current;
    if (!holder || !wrap) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const rect = wrap.getBoundingClientRect();
    const w = Math.max(320, rect.width);
    const h = Math.max(320, rect.height);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    holder.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Flat, even lighting so the sphere reads uniformly off-white (Shopify parity)
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.25);
    dir.position.set(1, 1.2, 1);
    scene.add(dir);

    // Globe
    const globe = new ThreeGlobe({ animateIn: false })
      .showAtmosphere(true)
      .atmosphereColor(ATMO_COLOR)
      .atmosphereAltitude(0.14)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.34)
      .hexPolygonUseDots(false)
      .hexPolygonColor(() => HEX_COLOR)
      .hexPolygonAltitude(0.005);

    // Basic material → no shading falloff; sphere stays uniformly light.
    const oceanMat = new THREE.MeshBasicMaterial({ color: OCEAN_COLOR });
    globe.globeMaterial(oceanMat);
    scene.add(globe);
    globeRef.current = globe;

    const applyCamera = () => {
      const p = camPhi.current;
      const t = camTheta.current;
      const d = camDist.current;
      const x = d * Math.sin(p) * Math.cos(t);
      const y = d * Math.cos(p);
      const z = d * Math.sin(p) * Math.sin(t);
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };
    applyCamera();

    const tick = () => {
      const now = Date.now();
      const idleFor = now - lastInteract.current;

      // Focus tween
      if (targetPhi.current != null && targetTheta.current != null) {
        camPhi.current += (targetPhi.current - camPhi.current) * 0.08;
        camTheta.current += (targetTheta.current - camTheta.current) * 0.08;
        if (targetDist.current != null) {
          camDist.current += (targetDist.current - camDist.current) * 0.08;
        }
        if (
          Math.abs(targetPhi.current - camPhi.current) < 0.002 &&
          Math.abs(targetTheta.current - camTheta.current) < 0.002
        ) {
          targetPhi.current = null;
          targetTheta.current = null;
          targetDist.current = null;
        }
      } else if (!drag.current && momentum.current) {
        // Momentum decay after release
        camTheta.current += momentum.current.vTheta;
        camPhi.current   += momentum.current.vPhi;
        momentum.current.vTheta *= 0.94;
        momentum.current.vPhi   *= 0.94;
        if (Math.abs(momentum.current.vTheta) < 0.0002 && Math.abs(momentum.current.vPhi) < 0.0002) {
          momentum.current = null;
          lastInteract.current = Date.now();
        }
      } else if (!drag.current && idleFor > 2500) {
        camTheta.current += 0.0015;
      }


      // Clamp phi so we don't flip upside down
      if (camPhi.current < 0.25) camPhi.current = 0.25;
      if (camPhi.current > Math.PI - 0.25) camPhi.current = Math.PI - 0.25;
      camDist.current = Math.max(MIN_DIST, Math.min(MAX_DIST, camDist.current));

      applyCamera();

      // Densify hexes on zoom-in
      const closeUp = camDist.current < 220;
      const wantRes = closeUp ? 4 : 3;
      const g = globeRef.current;
      if (g && g.hexPolygonResolution() !== wantRes) {
        g.hexPolygonResolution(wantRes);
      }

      renderer.render(scene, camera);
      updateOverlay();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    setReady(true);

    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      const nw = Math.max(320, r.width);
      const nh = Math.max(320, r.height);
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    });
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      renderer.domElement.remove();
      globeRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push land features once loaded
  useEffect(() => {
    if (!landFeatures || !globeRef.current) return;
    globeRef.current.hexPolygonsData(landFeatures);
  }, [landFeatures]);

  // Overlay projection — reuse camera projection for HTML markers
  const projectFrame = useCallback((lat: number, lng: number) => {
    const camera = cameraRef.current;
    const wrap = wrapperRef.current;
    const renderer = rendererRef.current;
    if (!camera || !wrap || !renderer) return null;
    const { phi, theta } = latLngToPhiTheta(lat, lng);
    const r = GLOBE_RADIUS * 1.005;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    const v = new THREE.Vector3(x, y, z);

    // Behind-globe test: dot(point→camera, point normal) > 0 means visible
    const camPos = camera.position;
    const toCam = new THREE.Vector3().subVectors(camPos, v).normalize();
    const normal = v.clone().normalize();
    const visible = normal.dot(toCam) > 0.02;

    v.project(camera);
    const size = renderer.getSize(new THREE.Vector2());
    const sx = (v.x * 0.5 + 0.5) * size.x;
    const sy = (-v.y * 0.5 + 0.5) * size.y;
    return { x: sx, y: sy, visible };
  }, []);

  // Overlay DOM state
  const markerElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const pulseElsRef = useRef<Map<string, { el: HTMLDivElement; born: number }>>(new Map());

  const updateOverlay = () => {
    const holder = markersRef.current;
    if (!holder) return;

    const wanted = new Set<string>();
    for (const s of sessionsRef.current) {
      wanted.add(s.id);
      let el = markerElsRef.current.get(s.id);
      if (!el) {
        el = document.createElement("div");
        el.className = "absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2";
        el.style.willChange = "transform, opacity";
        markerElsRef.current.set(s.id, el);
        holder.appendChild(el);
      }
      const rule = DOT_RULES[s.stage];
      const proj = projectFrame(s.lat, s.lng);
      if (!proj) continue;
      el.style.transform = `translate(${proj.x}px, ${proj.y}px) translate(-50%, -50%)`;
      el.style.opacity = proj.visible ? "1" : "0";
      if (!el.dataset.stage || el.dataset.stage !== s.stage) {
        el.dataset.stage = s.stage;
        if (s.stage === "purchased") {
          el.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="${ORDER_RING}" stroke-opacity="0.18" stroke-width="4"/>
              <circle cx="8" cy="8" r="4" fill="${ORDER_FILL}"/>
            </svg>`;
        } else {
          const c = rule.hex || VISITOR_COLOR;
          el.innerHTML = `
            <span style="display:block;width:8px;height:8px;border-radius:9999px;background:${c};box-shadow:0 0 0 3px ${c}22, 0 0 0 6px ${c}10;"></span>`;
        }
      }
    }

    // Cleanup stale sessions
    markerElsRef.current.forEach((el, id) => {
      if (!wanted.has(id)) {
        el.remove();
        markerElsRef.current.delete(id);
      }
    });

    // Purchase pulses
    const now = Date.now();
    for (const p of purchaseRef.current) {
      let entry = pulseElsRef.current.get(p.id);
      if (!entry) {
        const el = document.createElement("div");
        el.className = "absolute pointer-events-none -translate-x-1/2 -translate-y-1/2";
        el.innerHTML = `<span class="live-pulse" style="--c:${ORDER_RING}"></span>`;
        holder.appendChild(el);
        entry = { el, born: p.at };
        pulseElsRef.current.set(p.id, entry);
      }
      const proj = projectFrame(p.lat, p.lng);
      if (!proj) continue;
      entry.el.style.transform = `translate(${proj.x}px, ${proj.y}px) translate(-50%, -50%)`;
      entry.el.style.opacity = proj.visible ? "1" : "0";
      if (now - entry.born > 1600) {
        entry.el.remove();
        pulseElsRef.current.delete(p.id);
      }
    }
    // Cleanup pulses no longer in event list
    const keepIds = new Set(purchaseRef.current.map((e) => e.id));
    pulseElsRef.current.forEach((entry, id) => {
      if (!keepIds.has(id)) {
        entry.el.remove();
        pulseElsRef.current.delete(id);
      }
    });
  };

  // Pointer / wheel handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const now = performance.now();
    drag.current = {
      x: e.clientX, y: e.clientY,
      phi: camPhi.current, theta: camTheta.current,
      t: now, vTheta: 0, vPhi: 0,
      lastX: e.clientX, lastY: e.clientY, lastT: now,
    };
    momentum.current = null;
    targetPhi.current = null;
    targetTheta.current = null;
    lastInteract.current = Date.now();
  }, []);

  const hitTest = useCallback(() => {
    const wrap = wrapperRef.current;
    const p = pointer.current;
    if (!wrap || !p) return;
    let best: { d: number; sx: number; sy: number; session: LiveSession } | null = null;
    for (const s of sessionsRef.current) {
      const proj = projectFrame(s.lat, s.lng);
      if (!proj || !proj.visible) continue;
      const dx = proj.x - p.x;
      const dy = proj.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 14 && (!best || d < best.d)) best = { d, sx: proj.x, sy: proj.y, session: s };
    }
    if (best) setTooltip({ x: best.sx, y: best.sy, session: best.session });
    else setTooltip((prev) => (prev ? null : prev));
  }, [projectFrame]);

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
      const nowT = performance.now();
      const dt = Math.max(1, nowT - drag.current.lastT);
      // Track instantaneous velocity for release momentum
      drag.current.vTheta = -((e.clientX - drag.current.lastX) / 180) / dt * 16;
      drag.current.vPhi   = -((e.clientY - drag.current.lastY) / 180) / dt * 16;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      drag.current.lastT = nowT;
      camTheta.current = drag.current.theta - dx / 180;
      camPhi.current = drag.current.phi - dy / 180;
      lastInteract.current = Date.now();
    }
  }, [hitTest]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (drag.current) {
      // Only apply momentum if the pointer was still moving on release
      const vt = drag.current.vTheta;
      const vp = drag.current.vPhi;
      if (Math.abs(vt) > 0.0005 || Math.abs(vp) > 0.0005) {
        momentum.current = { vTheta: vt, vPhi: vp };
      }
    }
    drag.current = null;
    lastInteract.current = Date.now();
  }, []);

  const onPointerLeave = useCallback(() => {
    pointer.current = null;
    setTooltip(null);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    camDist.current = Math.max(MIN_DIST, Math.min(MAX_DIST, camDist.current + e.deltaY * 0.25));
    lastInteract.current = Date.now();
  }, []);

  const zoom = useCallback((delta: number) => {
    camDist.current = Math.max(MIN_DIST, Math.min(MAX_DIST, camDist.current + delta));
    lastInteract.current = Date.now();
  }, []);

  // Double-click → zoom-in step (no lat/lng inverse needed; feels good in practice)
  const onDoubleClick = useCallback(() => {
    targetDist.current = Math.max(MIN_DIST, camDist.current - 60);
    lastInteract.current = Date.now();
  }, []);

  // Keyboard bus — zoom / pan (pan translates to yaw/pitch on the globe)
  useEffect(() => {
    const onCmd = (e: Event) => {
      const cmd = (e as CustomEvent).detail as { type: string; delta?: number; dx?: number; dy?: number };
      if (cmd.type === "zoom") zoom((cmd.delta ?? 0) * 30);
      else if (cmd.type === "pan") {
        camTheta.current -= (cmd.dx ?? 0) / 400;
        camPhi.current   -= (cmd.dy ?? 0) / 400;
        lastInteract.current = Date.now();
      }
    };
    window.addEventListener("blissley:live:cmd", onCmd as EventListener);
    return () => window.removeEventListener("blissley:live:cmd", onCmd as EventListener);
  }, [zoom]);


  const tooltipHex = useMemo(
    () => (tooltip ? DOT_RULES[tooltip.session.stage].hex : "#000"),
    [tooltip]
  );

  return (
    <div
      ref={wrapperRef}
      className={`relative select-none ${className ?? ""}`}
      style={{
        touchAction: "none",
        background: "radial-gradient(circle at 50% 45%, #ffffff 0%, #f4f7fb 55%, #eef2f7 100%)",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
    >

      <div ref={canvasHolderRef} className="absolute inset-0" style={{ cursor: drag.current ? "grabbing" : "grab" }} />
      <div ref={markersRef} className="pointer-events-none absolute inset-0" />

      {!ready && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-[11.5px] text-ink/40">
          Loading globe…
        </div>
      )}

      {tooltip && (() => {
        const s = tooltip.session;
        const city = streamer ? "••••••" : s.city;
        const region = streamer ? "••" : s.region;
        return (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-ink/10 bg-white px-2.5 py-1.5 text-[11px] font-medium text-ink shadow-[0_10px_28px_-8px_rgba(15,23,42,0.30)]"
            style={{ left: tooltip.x, top: tooltip.y - 12 }}
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: tooltipHex }} />
              <span>{s.country} · {region} · {city}</span>
            </div>
            <div className="mt-0.5 text-[10px] font-normal text-ink/45">
              {DOT_RULES[s.stage].label} · {new Date(s.seenAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </div>
          </div>
        );
      })()}


      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-ink/10 bg-white/95 shadow-sm backdrop-blur">
        <button type="button" onClick={() => zoom(-20)} aria-label="Zoom in" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">+</span>
        </button>
        <div className="h-px w-full bg-ink/10" />
        <button type="button" onClick={() => zoom(20)} aria-label="Zoom out" className="grid h-7 w-7 place-items-center text-ink/70 hover:bg-ink/[0.04]">
          <span className="text-sm leading-none">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md border border-ink/10 bg-white/85 px-2.5 py-1 text-[10.5px] font-medium text-ink/70 shadow-sm backdrop-blur">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke={ORDER_RING} strokeOpacity="0.2" strokeWidth="4" />
            <circle cx="8" cy="8" r="4" fill={ORDER_FILL} />
          </svg>
          Orders
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: VISITOR_COLOR, boxShadow: `0 0 0 3px ${VISITOR_COLOR}22` }} />
          Visitors right now
        </span>
      </div>

      <style>{`
        .live-pulse {
          display:block; width:14px; height:14px; border-radius:9999px;
          border: 2px solid var(--c); opacity:0.6;
          animation: live-pulse-anim 1.4s ease-out forwards;
        }
        @keyframes live-pulse-anim {
          0%   { transform: scale(0.4); opacity: 0.7; }
          100% { transform: scale(3);   opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
