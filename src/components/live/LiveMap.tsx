/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { DOT_RULES } from "./dotRules";
import type { LiveSession, PurchaseEvent } from "@/hooks/useLiveSessions";

type Props = {
  sessions: LiveSession[];
  purchaseEvents: PurchaseEvent[];
  className?: string;
};

// Global loader promise so we only inject the <script> once even with hot reloads.
declare global {
  interface Window {
    google?: typeof google;
    __blissleyGMapsLoader?: Promise<void>;
    __blissleyGMapsInit?: () => void;
  }
}

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__blissleyGMapsLoader) return window.__blissleyGMapsLoader;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
  if (!key) return Promise.reject(new Error("Missing Google Maps browser key"));

  window.__blissleyGMapsLoader = new Promise<void>((resolve, reject) => {
    window.__blissleyGMapsInit = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__blissleyGMapsInit${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__blissleyGMapsLoader;
}

// Muted light style matching Shopify's live view — gray land, white water, subtle labels.
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#e9ecef" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d1d5db" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#c7ccd3" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#eef0f3" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f6f7f9" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#eceef2" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
];

export default function LiveMap({ sessions, purchaseEvents, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const pulseRef = useRef<google.maps.Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Init map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !wrapRef.current || !window.google) return;
        const map = new window.google.maps.Map(wrapRef.current, {
          center: { lat: 25, lng: -20 },
          zoom: 2,
          minZoom: 2,
          maxZoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          backgroundColor: "#ffffff",
          styles: MAP_STYLE,
          restriction: {
            latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
            strictBounds: false,
          },
        });
        mapRef.current = map;
        setReady(true);
      })
      .catch((e) => setErr(e.message ?? "Map failed to load"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync session markers — small colored dots per stage.
  useEffect(() => {
    if (!ready || !mapRef.current || !window.google) return;
    const map = mapRef.current;
    const nextIds = new Set(sessions.map((s) => s.id));

    // Remove stale
    for (const [id, m] of markersRef.current) {
      if (!nextIds.has(id)) {
        m.setMap(null);
        markersRef.current.delete(id);
      }
    }
    // Add or update
    for (const s of sessions) {
      const rule = DOT_RULES[s.stage];
      const existing = markersRef.current.get(s.id);
      const icon: google.maps.Symbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: rule.sizeMap * 0.6,
        fillColor: rule.hex,
        fillOpacity: 0.95,
        strokeColor: "#ffffff",
        strokeWeight: 1.5,
      };
      if (existing) {
        existing.setPosition({ lat: s.lat, lng: s.lng });
        existing.setIcon(icon);
      } else {
        const m = new window.google.maps.Marker({
          map,
          position: { lat: s.lat, lng: s.lng },
          icon,
          title: `${rule.label} · ${s.label}`,
          optimized: true,
          zIndex: s.stage === "purchased" ? 1000 : s.stage === "checkout" ? 500 : 100,
        });
        markersRef.current.set(s.id, m);
      }
    }
  }, [sessions, ready]);

  // Purchase pulse — bigger emerald marker that fades out over ~5s
  useEffect(() => {
    if (!ready || !mapRef.current || !window.google || purchaseEvents.length === 0) return;
    const map = mapRef.current;
    const now = Date.now();
    const rule = DOT_RULES.purchased;

    for (const e of purchaseEvents) {
      const age = now - e.at;
      if (age > 5000) continue;
      const key = `pulse-${e.id}`;
      if (pulseRef.current.some((m) => m.get("pkey") === key)) continue;
      const marker = new window.google.maps.Marker({
        map,
        position: { lat: e.lat, lng: e.lng },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 18,
          fillColor: rule.hex,
          fillOpacity: 0.28,
          strokeColor: rule.hex,
          strokeOpacity: 0.9,
          strokeWeight: 2,
        },
        clickable: false,
        zIndex: 2000,
      });
      marker.set("pkey", key);
      pulseRef.current.push(marker);
      // Fade out
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const t = step / 20;
        const scale = 18 + t * 30;
        const opacity = Math.max(0, 0.28 * (1 - t));
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          scale,
          fillColor: rule.hex,
          fillOpacity: opacity,
          strokeColor: rule.hex,
          strokeOpacity: Math.max(0, 0.9 * (1 - t)),
          strokeWeight: 2,
        });
        if (t >= 1) {
          clearInterval(timer);
          marker.setMap(null);
          pulseRef.current = pulseRef.current.filter((x) => x !== marker);
        }
      }, 250);
    }
  }, [purchaseEvents, ready]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div ref={wrapRef} className="absolute inset-0" />
      {!ready && !err && (
        <div className="absolute inset-0 grid place-items-center bg-white">
          <div className="flex items-center gap-2 text-[11.5px] text-ink/45">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2563eb]" />
            Loading map…
          </div>
        </div>
      )}
      {err && (
        <div className="absolute inset-0 grid place-items-center bg-white text-[11.5px] text-ink/60">
          {err}
        </div>
      )}
      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-3 rounded-md border border-ink/10 bg-white/95 px-2.5 py-1.5 text-[10.5px] font-medium text-ink/70 shadow-sm backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: DOT_RULES.purchased.hex }} />
          Orders
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: DOT_RULES.browsing.hex }} />
          Visitors right now
        </span>
      </div>
    </div>
  );
}
