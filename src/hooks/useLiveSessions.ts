import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CITIES, type City } from "@/lib/live/cities";

export type Stage = "browsing" | "cart" | "checkout" | "purchased";

export type LiveSession = {
  id: string;
  stage: Stage;
  lat: number;
  lng: number;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  label: string;
  seenAt: number;   // last heartbeat / stage advance
  bornAt: number;   // first-seen — drives "time on site"
};

const LIVE_MS = 60_000;         // browsing/cart/checkout expire after 60s idle
const PURCHASED_MS = 300_000;   // purchases linger 5 min
const STAGE_ORDER: Stage[] = ["browsing", "cart", "checkout", "purchased"];

// Deterministic-ish PRNG so first paint doesn't flicker between server/client.
// (This hook runs client-only, but we still want stable-feeling numbers per tick.)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const jitter = (n: number, spread: number, rnd: () => number) =>
  n + (rnd() - 0.5) * spread;

function makeSession(city: City, stage: Stage, rnd: () => number): LiveSession {
  const id = `s_${Math.floor(rnd() * 1e12).toString(36)}`;
  const now = Date.now();
  return {
    id,
    stage,
    lat: jitter(city.lat, 0.6, rnd),
    lng: jitter(city.lng, 0.6, rnd),
    city: city.name,
    region: city.region,
    country: city.country,
    countryCode: city.countryCode,
    label: `${city.country} · ${city.region} · ${city.name}`,
    seenAt: now - Math.floor(rnd() * 45_000),
    bornAt: now - Math.floor(rnd() * 240_000),
  };
}

function seed(rnd: () => number): LiveSession[] {
  const list: LiveSession[] = [];
  // Weight distribution: skew US, add international sprinkle.
  const weightMap: Record<string, number> = { US: 5, CA: 2, GB: 2, DE: 1, FR: 1, AU: 1, JP: 1, IN: 1 };
  const bag: City[] = [];
  for (const c of CITIES) {
    const w = weightMap[c.countryCode] ?? 1;
    for (let i = 0; i < w; i++) bag.push(c);
  }
  const total = 82;
  for (let i = 0; i < total; i++) {
    const city = bag[Math.floor(rnd() * bag.length)];
    // Distribution: 62% browsing, 20% cart, 12% checkout, 6% purchased
    const p = rnd();
    const stage: Stage = p < 0.62 ? "browsing" : p < 0.82 ? "cart" : p < 0.94 ? "checkout" : "purchased";
    list.push(makeSession(city, stage, rnd));
  }
  return list;
}

const isLive = (s: LiveSession, now: number) =>
  now - s.seenAt < (s.stage === "purchased" ? PURCHASED_MS : LIVE_MS);

export type ByLocationRow = {
  key: string;
  label: string;
  country: string;
  region: string;
  city: string;
  lat: number;
  lng: number;
  n: number;
};

export function useLiveSessions() {
  const rndRef = useRef(mulberry32(0xB1_15_51_EE));
  const [sessions, setSessions] = useState<LiveSession[]>(() => seed(rndRef.current));
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const focusOn = useCallback((lat: number, lng: number, holdMs = 6000) => {
    setFocus({ lat, lng });
    if (focusTimer.current) clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => setFocus(null), holdMs);
  }, []);

  // Tick: birth, advance, expire.
  useEffect(() => {
    const id = setInterval(() => {
      const rnd = rndRef.current;
      const now = Date.now();
      setSessions((prev) => {
        // Expire
        let next = prev.filter((s) => isLive(s, now));

        // Birth 0–2
        const births = Math.floor(rnd() * 3);
        for (let i = 0; i < births; i++) {
          const city = CITIES[Math.floor(rnd() * CITIES.length)];
          next.push(makeSession(city, "browsing", rnd));
        }

        // Advance 1–3 sessions forward
        const advances = 1 + Math.floor(rnd() * 3);
        for (let i = 0; i < advances && next.length; i++) {
          const idx = Math.floor(rnd() * next.length);
          const s = next[idx];
          const currIdx = STAGE_ORDER.indexOf(s.stage);
          if (currIdx < STAGE_ORDER.length - 1 && rnd() > 0.35) {
            next[idx] = { ...s, stage: STAGE_ORDER[currIdx + 1], seenAt: now };
          } else {
            next[idx] = { ...s, seenAt: now }; // heartbeat
          }
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const counts = useMemo(() => {
    const c = { visitors: 0, sessions: sessions.length, cartsActive: 0, checkingOut: 0, purchased: 0 };
    for (const s of sessions) {
      if (s.stage !== "purchased") c.visitors++;
      if (s.stage === "cart") c.cartsActive++;
      if (s.stage === "checkout") c.checkingOut++;
      if (s.stage === "purchased") c.purchased++;
    }
    return c;
  }, [sessions]);

  const byLocation = useMemo<ByLocationRow[]>(() => {
    const map = new Map<string, ByLocationRow>();
    for (const s of sessions) {
      const key = `${s.country}·${s.region}·${s.city}`;
      const existing = map.get(key);
      if (existing) existing.n++;
      else
        map.set(key, {
          key,
          label: s.label,
          country: s.country,
          region: s.region,
          city: s.city,
          lat: s.lat,
          lng: s.lng,
          n: 1,
        });
    }
    return Array.from(map.values()).sort((a, b) => b.n - a.n);
  }, [sessions]);

  return { sessions, counts, byLocation, focus, focusOn };
}
