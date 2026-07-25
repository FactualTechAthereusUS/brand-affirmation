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
  seenAt: number;
  bornAt: number;
};

export type PurchaseEvent = {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  amount: number;
  program: "Semaglutide" | "Tirzepatide" | "Tretinoin" | "Finasteride";
  at: number;
};

const LIVE_MS = 60_000;
const PURCHASED_MS = 300_000;
const PULSE_EVENT_TTL = 8_000; // halo ring stays 8s
const STAGE_ORDER: Stage[] = ["browsing", "cart", "checkout", "purchased"];

const PROGRAMS: PurchaseEvent["program"][] = ["Semaglutide", "Tirzepatide", "Tretinoin", "Finasteride"];
const PRICE_BY_PROGRAM: Record<PurchaseEvent["program"], number[]> = {
  Semaglutide:  [249, 279, 299, 349],
  Tirzepatide:  [349, 399, 449, 499],
  Tretinoin:    [39, 49, 59],
  Finasteride:  [29, 39, 49],
};

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

const jitter = (n: number, spread: number, rnd: () => number) => n + (rnd() - 0.5) * spread;

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

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
  const weightMap: Record<string, number> = { US: 6, CA: 2, GB: 2, DE: 1, FR: 1, AU: 1, JP: 1, IN: 1 };
  const bag: City[] = [];
  for (const c of CITIES) {
    const w = weightMap[c.countryCode] ?? 1;
    for (let i = 0; i < w; i++) bag.push(c);
  }
  const total = 96;
  for (let i = 0; i < total; i++) {
    const city = bag[Math.floor(rnd() * bag.length)];
    const p = rnd();
    // 60% browsing, 22% intake, 12% checkout, 6% purchased
    const stage: Stage = p < 0.60 ? "browsing" : p < 0.82 ? "cart" : p < 0.94 ? "checkout" : "purchased";
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
  const [purchaseEvents, setPurchaseEvents] = useState<PurchaseEvent[]>([]);
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const focusOn = useCallback((lat: number, lng: number, holdMs = 6000) => {
    setFocus({ lat, lng });
    if (focusTimer.current) clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => setFocus(null), holdMs);
  }, []);

  // Session tick: birth / heartbeat / stage-advance / expire
  useEffect(() => {
    const id = setInterval(() => {
      const rnd = rndRef.current;
      const now = Date.now();
      let firedPurchase: PurchaseEvent | null = null;

      setSessions((prev) => {
        let next = prev.filter((s) => isLive(s, now));

        // Birth 0–2
        const births = Math.floor(rnd() * 3);
        for (let i = 0; i < births; i++) {
          const city = CITIES[Math.floor(rnd() * CITIES.length)];
          next.push(makeSession(city, "browsing", rnd));
        }

        // Advance 1–3
        const advances = 1 + Math.floor(rnd() * 3);
        for (let i = 0; i < advances && next.length; i++) {
          const idx = Math.floor(rnd() * next.length);
          const s = next[idx];
          const currIdx = STAGE_ORDER.indexOf(s.stage);
          if (currIdx < STAGE_ORDER.length - 1 && rnd() > 0.4) {
            const nextStage = STAGE_ORDER[currIdx + 1];
            next[idx] = { ...s, stage: nextStage, seenAt: now };
            if (nextStage === "purchased" && !firedPurchase) {
              const program = pick(PROGRAMS, rnd);
              firedPurchase = {
                id: `p_${Math.floor(rnd() * 1e12).toString(36)}`,
                lat: s.lat,
                lng: s.lng,
                city: s.city,
                country: s.country,
                amount: pick(PRICE_BY_PROGRAM[program], rnd),
                program,
                at: now,
              };
            }
          } else {
            next[idx] = { ...s, seenAt: now };
          }
        }
        return next;
      });

      if (firedPurchase) {
        setPurchaseEvents((prev) => [...prev.filter((e) => now - e.at < PULSE_EVENT_TTL), firedPurchase!]);
      }
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Prune expired purchase events every 500ms so overlay stays clean
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setPurchaseEvents((prev) => {
        const kept = prev.filter((e) => now - e.at < PULSE_EVENT_TTL);
        return kept.length === prev.length ? prev : kept;
      });
    }, 500);
    return () => clearInterval(id);
  }, []);

  const counts = useMemo(() => {
    const c = { visitors: 0, sessions: sessions.length, cartsActive: 0, checkingOut: 0, purchased: 0, shipped: 0 };
    const now = Date.now();
    for (const s of sessions) {
      if (s.stage !== "purchased") c.visitors++;
      if (s.stage === "cart") c.cartsActive++;
      if (s.stage === "checkout") c.checkingOut++;
      if (s.stage === "purchased") c.purchased++;
    }
    // Shipped = purchases older than 45s (they roll from Approved → Shipped visually)
    for (const p of purchaseEvents) if (now - p.at > 45_000) c.shipped++;
    return c;
  }, [sessions, purchaseEvents]);

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

  // ── Blissley telehealth series — 24-slot hourly today + previous period ─────
  const [lastTickAt, setLastTickAt] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setLastTickAt(Date.now()), 20_000);
    return () => clearInterval(id);
  }, []);

  const telehealth = useMemo(() => {
    const rnd = mulberry32(0x51_ED_A7 ^ Math.floor(lastTickAt / 20_000));
    const hourNow = new Date().getHours() + new Date().getMinutes() / 60;
    const mk = (base: number, peakMult: number, jitterAmp: number) => {
      const today: number[] = [];
      const prev: number[] = [];
      for (let h = 0; h < 24; h++) {
        const bell = Math.exp(-Math.pow((h - 14) / 5, 2));
        const growth = base * (0.35 + bell * peakMult);
        const jitterToday = (rnd() - 0.5) * jitterAmp;
        const jitterPrev = (rnd() - 0.5) * jitterAmp;
        if (h < hourNow) today.push(Math.max(0, growth + jitterToday));
        else if (h === Math.floor(hourNow)) today.push(Math.max(0, growth * (hourNow - h) + jitterToday * 0.4));
        else today.push(0);
        prev.push(Math.max(0, growth * 0.92 + jitterPrev));
      }
      return { today, prev };
    };
    const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
    const pct = (a: number[], b: number[]) => {
      const A = sum(a); const B = sum(b) || 1;
      return ((A - B) / B) * 100;
    };
    const consults    = mk(6.5, 2.2, 2.4);   // intake forms started per hour
    const rxApproved  = mk(3.2, 2.1, 1.4);   // physician sign-offs per hour
    const revenue     = mk(310, 2.5, 90);    // $ paid per hour
    const build = (m: { today: number[]; prev: number[] }, round: (n: number) => number) => ({
      today: m.today,
      prev:  m.prev,
      total: round(sum(m.today)),
      delta: pct(m.today, m.prev),
    });
    // Rolling scalar KPIs — deterministic per 20s tick
    const avgResponseMin = Math.round((8 + rnd() * 9) * 10) / 10;    // 8–17 min
    const approvalRate   = Math.round((88 + rnd() * 9) * 10) / 10;   // 88–97 %
    const refillsDue     = 12 + Math.floor(rnd() * 18);              // 12–29
    return {
      consults:    build(consults,    Math.round),
      rxApproved:  build(rxApproved,  Math.round),
      revenue:     build(revenue,     Math.round),
      avgResponseMin,
      approvalRate,
      refillsDue,
    };
  }, [lastTickAt]);

  return { sessions, purchaseEvents, counts, byLocation, focus, focusOn, telehealth, lastTickAt };
}
