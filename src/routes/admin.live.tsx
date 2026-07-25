import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Map as MapIcon, Maximize2, Search } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/live")({
  head: () => ({ meta: [{ title: "Live view — Blissley Admin" }, { name: "description", content: "Real-time patients, intakes, and telehealth activity across Blissley." }] }),
  component: LiveView,
});

// green accent for this page (mint/emerald)
const MINT = "#34d3a4";
const MINT_SOFT = "#a7ecd4";
const NAVY_PIN = "#4f46e5";

function LiveView() {
  const orders = useAdmin((s) => s.orders);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const visitors     = 118 + (tick % 9);
  const intakesToday = 42  + (tick % 4);
  const sessions     = 344 + (tick % 15);
  const orderCount   = 27  + Math.floor(tick / 4);
  const activeIntake = 18  + (tick % 3);
  const awaitingRx   = 9   + (tick % 2);
  const approvedRx   = 14  + Math.floor(tick / 3);

  // deterministic spark points
  const sessionSpark = useMemo(() => spark(28, 42), []);
  const orderSpark   = useMemo(() => spark(28, 30, 0.5), []);

  const locations = [
    { region: "United States · California · Los Angeles",  count: 41 },
    { region: "United States · Texas · Austin",             count: 34 },
    { region: "United States · New York · New York",        count: 28 },
    { region: "United States · Illinois · Chicago",         count: 22 },
    { region: "United States · Georgia · Atlanta",          count: 17 },
  ];

  const pins = [
    { x: 18, y: 38 }, { x: 26, y: 32 }, { x: 32, y: 40 },
    { x: 40, y: 30 }, { x: 52, y: 34 }, { x: 62, y: 28 },
    { x: 70, y: 34 }, { x: 46, y: 22 },
  ];

  return (
    <AdminShell>
      {/* top bar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-ink/5">
            <span className="block h-2 w-2 rounded-full" style={{ background: MINT }} />
          </div>
          <h1 className="font-hero text-[20px] font-semibold text-ink">Live View</h1>
          <span className="flex items-center gap-1.5 text-[11.5px] text-ink/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full" style={{ background: MINT, opacity: 0.7 }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: MINT }} />
            </span>
            Just now
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex h-8 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 text-[12px] text-ink/60 w-[240px]">
            <Search className="h-3.5 w-3.5" />
            <span>Search location</span>
          </div>
          <IconBtn><Eye className="h-4 w-4" /></IconBtn>
          <IconBtn><MapIcon className="h-4 w-4" /></IconBtn>
          <IconBtn><Maximize2 className="h-4 w-4" /></IconBtn>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* LEFT COLUMN */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Visitors right now" value={visitors} big />
            <MetricCard label="Intakes today" value={intakesToday} sub="+12%" />
            <MetricCard label="Sessions" value={sessions} spark={sessionSpark} delta="+8%" />
            <MetricCard label="Orders" value={orderCount} spark={orderSpark} delta="+3%" />
          </div>

          {/* Patient behavior */}
          <Card className="p-4">
            <div className="text-[12px] font-medium text-ink">Patient behavior</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Behavior label="In intake"          value={activeIntake} />
              <Behavior label="Awaiting physician" value={awaitingRx} />
              <Behavior label="Approved"           value={approvedRx} tone="mint" />
            </div>
            <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-ink/[0.05]">
              <div style={{ width: `${(activeIntake / (activeIntake + awaitingRx + approvedRx)) * 100}%`, background: MINT_SOFT }} />
              <div style={{ width: `${(awaitingRx / (activeIntake + awaitingRx + approvedRx)) * 100}%`, background: MINT }} />
              <div style={{ width: `${(approvedRx / (activeIntake + awaitingRx + approvedRx)) * 100}%`, background: "#0f9c74" }} />
            </div>
          </Card>

          {/* Sessions by location */}
          <Card className="p-4">
            <div className="text-[12px] font-medium text-ink">Sessions by location</div>
            <div className="mt-3 space-y-3">
              {locations.map((l, i) => {
                const max = locations[0].count;
                return (
                  <div key={l.region}>
                    <div className="text-[11.5px] text-ink/70">{l.region}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-ink/[0.05]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(l.count / max) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                          className="h-1.5 rounded-full"
                          style={{ background: MINT }}
                        />
                      </div>
                      <span className="w-6 text-right text-[11.5px] tabular-nums text-ink/70">{l.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* New vs returning patients */}
          <Card className="p-4">
            <div className="text-[12px] font-medium text-ink">New vs returning patients</div>
            <NewReturning newPct={62} />
          </Card>

          {/* Top treatments */}
          <Card className="p-4">
            <div className="text-[12px] font-medium text-ink">Revenue by treatment</div>
            <div className="mt-3 space-y-2.5">
              {[
                { name: "Weight Loss · Semaglutide", rev: 18420 },
                { name: "Weight Loss · Tirzepatide", rev: 12190 },
                { name: "Skin · Tretinoin",           rev: 3840 },
                { name: "Hair · Finasteride",         rev: 2210 },
              ].map((t, i) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded" style={{ background: i === 0 ? MINT : i === 1 ? "#0f9c74" : "#cfe9dc" }} />
                  <span className="flex-1 truncate text-[12px] text-ink">{t.name}</span>
                  <span className="text-[12px] tabular-nums text-ink/70">${t.rev.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT — GLOBE */}
        <Card className="relative overflow-hidden p-0 min-h-[560px] lg:min-h-full">
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(60% 55% at 55% 45%, ${MINT_SOFT}33 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #f6fbf8 100%)` }}
          />
          <DottedGlobe pins={pins} tick={tick} />

          {/* legend */}
          <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded-full border border-ink/10 bg-white/90 px-3 py-1.5 text-[11px] backdrop-blur">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: NAVY_PIN }} />Orders</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: MINT }} />Visitors right now</span>
          </div>
        </Card>
      </div>

      {/* BOTTOM — activity + recent orders */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-1 text-[12px] font-medium text-ink">Live activity</div>
          <div className="text-[11.5px] text-ink/50 mb-2">Intake, physician approvals & payment signals</div>
          <ActivityFeed limit={10} title="" />
        </Card>
        <Card className="p-4">
          <div className="text-[12px] font-medium text-ink">Recent orders</div>
          <div className="mt-2 divide-y divide-ink/[0.05]">
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="flex items-center gap-3 py-2 text-[12px]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: MINT }} />
                <div className="font-medium text-ink">{o.patientName}</div>
                <div className="text-ink/50">{o.id}</div>
                <div className="ml-auto tabular-nums text-ink/80">${o.amount}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

/* ---------------- Sub-components ---------------- */

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-8 w-8 place-items-center rounded-lg border border-ink/10 bg-white text-ink/70 hover:text-ink hover:bg-ink/[0.03]">
      {children}
    </button>
  );
}

function MetricCard({ label, value, sub, delta, spark, big }: { label: string; value: number; sub?: string; delta?: string; spark?: number[]; big?: boolean }) {
  return (
    <Card className="p-3.5">
      <div className="text-[11.5px] font-medium text-ink underline decoration-dotted decoration-ink/25 underline-offset-4">{label}</div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className={`font-hero font-semibold leading-none text-ink tabular-nums ${big ? "text-[34px]" : "text-[22px]"}`}>{value}</div>
        {delta && <span className="text-[10.5px] font-medium" style={{ color: MINT === MINT ? "#0f9c74" : MINT }}>{delta}</span>}
        {sub && !delta && <span className="text-[10.5px] text-ink/50">{sub}</span>}
      </div>
      {spark && <Sparkline points={spark} />}
    </Card>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 120, h = 26;
  const max = Math.max(...points), min = Math.min(...points);
  const dx = w / (points.length - 1);
  const norm = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * dx} ${norm(p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-6 w-full">
      <path d={d} fill="none" stroke={MINT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={MINT} opacity="0.08" />
    </svg>
  );
}

function Behavior({ label, value, tone }: { label: string; value: number; tone?: "mint" }) {
  return (
    <div>
      <div className="text-[11px] text-ink/60">{label}</div>
      <div className={`mt-0.5 font-hero text-[22px] font-semibold tabular-nums ${tone === "mint" ? "" : "text-ink"}`} style={tone === "mint" ? { color: "#0f9c74" } : undefined}>
        {value}
      </div>
    </div>
  );
}

function NewReturning({ newPct }: { newPct: number }) {
  const r = 100 - newPct;
  return (
    <div className="mt-3">
      <div className="flex h-2 overflow-hidden rounded-full">
        <motion.div initial={{ width: 0 }} animate={{ width: `${newPct}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ background: MINT }} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${r}%` }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ background: "#cfe9dc" }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11.5px]">
        <span className="flex items-center gap-1.5 text-ink/70"><span className="h-2 w-2 rounded-full" style={{ background: MINT }} />New · {newPct}%</span>
        <span className="flex items-center gap-1.5 text-ink/70"><span className="h-2 w-2 rounded-full" style={{ background: "#cfe9dc" }} />Returning · {r}%</span>
      </div>
    </div>
  );
}

/* ---------------- Dotted globe ---------------- */

function DottedGlobe({ pins, tick }: { pins: { x: number; y: number }[]; tick: number }) {
  // procedurally generate a dotted globe silhouette
  const dots = useMemo(() => {
    const out: { cx: number; cy: number; r: number; op: number }[] = [];
    const cx = 50, cy = 50, R = 42;
    for (let lat = -80; lat <= 80; lat += 4) {
      const y = cy + (lat / 90) * R;
      const rowR = Math.cos((lat * Math.PI) / 180) * R;
      const step = 3.2;
      for (let x = cx - rowR; x <= cx + rowR; x += step) {
        // shape mask: rough continents (noise-ish)
        const nx = (x - cx) / R;
        const ny = (y - cy) / R;
        const noise =
          Math.sin(nx * 6 + ny * 4) * 0.4 +
          Math.cos(nx * 3 - ny * 5) * 0.4 +
          Math.sin(nx * 11 + ny * 9) * 0.2;
        if (noise > -0.1) {
          const edge = 1 - Math.min(1, Math.abs((x - cx) / rowR));
          out.push({ cx: x, cy: y, r: 0.42, op: 0.35 + edge * 0.35 });
        }
      }
    }
    return out;
  }, []);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="globeShade" cx="55%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#e6faf1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c9efe0" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#globeShade)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={MINT} opacity={d.op * 0.9} />
      ))}
      {pins.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="0.8" fill={NAVY_PIN}>
            <animate attributeName="r" values="0.8;3.2;0.8" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={p.x} cy={p.y} r="0.9" fill={NAVY_PIN} />
        </g>
      ))}
      {/* current focus pin */}
      <g transform={`translate(${pins[(tick) % pins.length].x} ${pins[(tick) % pins.length].y})`}>
        <path d="M0,-3.6 C1.9,-3.6 3.2,-2.1 3.2,-0.4 C3.2,1.9 0,4.6 0,4.6 C0,4.6 -3.2,1.9 -3.2,-0.4 C-3.2,-2.1 -1.9,-3.6 0,-3.6 Z" fill={NAVY_PIN} />
        <circle cx="0" cy="-0.6" r="1" fill="#fff" />
      </g>
    </svg>
  );
}

/* ---------------- Utilities ---------------- */

function spark(n: number, base: number, jitter = 0.4): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(base + Math.sin(i * 0.6) * base * 0.18 + Math.cos(i * 0.31) * base * jitter * 0.12);
  }
  return out;
}
