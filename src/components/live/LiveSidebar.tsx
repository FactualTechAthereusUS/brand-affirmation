import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card } from "@/components/admin/AdminShell";
import type { ByLocationRow } from "@/hooks/useLiveSessions";
import { suggest, findCity, type City } from "@/lib/live/cities";

type Counts = {
  visitors: number;
  sessions: number;
  cartsActive: number;
  checkingOut: number;
  purchased: number;
};

type Series = { today: number[]; prev: number[]; total: number; delta: number };

type Props = {
  counts: Counts;
  totalSales: number;
  byLocation: ByLocationRow[];
  streamer: boolean;
  onFocus: (lat: number, lng: number) => void;
  orderRows: { label: string; value: number; color: string }[];
  newReturning: { newPct: number; returningPct: number };
  series: { sales: Series; sessions: Series; orders: Series };
  lastTickAt: number;
};

function CountUp({ value }: { value: number }) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const dur = 500;
    const startV = from.current;
    const endV = value;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(startV + (endV - startV) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = endV;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{v.toLocaleString()}</>;
}

function usd(n: number) {
  return `$${n.toLocaleString()}`;
}

// Catmull–Rom → cubic bezier for smooth mini area.
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  const d: string[] = [`M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`);
  }
  return d.join(" ");
}

function MiniArea({ today, prev, color }: { today: number[]; prev: number[]; color: string }) {
  const w = 96, h = 30, pad = 1.5;
  const all = [...today, ...prev];
  const max = Math.max(1, ...all);
  const stepX = (w - pad * 2) / (today.length - 1);
  const toPts = (arr: number[]) =>
    arr.map((v, i) => ({ x: pad + i * stepX, y: h - pad - (v / max) * (h - pad * 2) }));
  const t = toPts(today);
  const p = toPts(prev);
  const dToday = smoothPath(t);
  const dPrev = smoothPath(p);
  const area = `${dToday} L${t[t.length - 1].x},${h} L${t[0].x},${h} Z`;
  const id = `spg-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Previous period — dashed neutral */}
      <path d={dPrev} fill="none" stroke="#94a3b8" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="2.5 2" />
      {/* Today area + line */}
      <path d={area} fill={`url(#${id})`} />
      <path d={dToday} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeltaChip({ pct, streamer }: { pct: number; streamer: boolean }) {
  if (streamer) return <span className="text-[10.5px] font-medium text-ink/45">—</span>;
  const up = pct >= 0;
  const val = `${up ? "↑" : "↓"} ${Math.abs(pct).toFixed(1)}%`;
  return (
    <span
      className="rounded-md px-1.5 py-px text-[10px] font-semibold tabular-nums"
      style={{
        color: up ? "#047857" : "#b91c1c",
        background: up ? "#ecfdf5" : "#fef2f2",
      }}
    >
      {val}
    </span>
  );
}

function KpiCard({
  label, value, tint, streamer, series, isCurrency,
}: {
  label: string;
  value: number;
  tint: string;
  streamer: boolean;
  series?: Series;
  isCurrency?: boolean;
}) {
  return (
    <div className="rounded-lg border border-ink/[0.06] bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-ink/50">{label}</div>
        {series && <DeltaChip pct={series.delta} streamer={streamer} />}
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="font-hero text-[20px] font-semibold text-ink tabular-nums leading-none">
          {streamer ? "—" : isCurrency ? `$${value.toLocaleString()}` : <CountUp value={value} />}
        </div>
        {series && <MiniArea today={series.today} prev={series.prev} color={tint} />}
      </div>
    </div>
  );
}

function useAgo(ts: number) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const secs = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (secs < 5) return "Just now";
  return `${secs}s ago`;
}

export function LiveSidebar({
  counts, totalSales, byLocation, streamer, onFocus, orderRows, newReturning, series, lastTickAt,
}: Props) {
  const [q, setQ] = useState("");
  const [sug, setSug] = useState<City[]>([]);
  const top = byLocation[0]?.n ?? 1;
  const ago = useAgo(lastTickAt);

  useEffect(() => {
    setSug(suggest(q));
  }, [q]);

  const handleSearch = () => {
    const city = findCity(q);
    if (city) {
      onFocus(city.lat, city.lng);
      setQ("");
      setSug([]);
    }
  };

  // Patient behaviour funnel: In intake → Awaiting physician → Approved
  const funnel = useMemo(() => {
    const inIntake = counts.cartsActive;
    const awaiting = counts.checkingOut;
    const approved = counts.purchased;
    const total = Math.max(1, inIntake + awaiting + approved);
    return { inIntake, awaiting, approved, total };
  }, [counts]);

  const orderMax = Math.max(1, ...orderRows.map((r) => r.value));

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 text-[12.5px] text-ink/70 focus-within:border-ink/25">
          <Search className="h-3.5 w-3.5 text-ink/45" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search location"
            className="w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink/40"
          />
        </div>
        {sug.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-lg">
            {sug.map((c) => (
              <button
                key={`${c.country}-${c.name}`}
                type="button"
                onClick={() => { onFocus(c.lat, c.lng); setQ(""); setSug([]); }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-ink hover:bg-ink/[0.03]"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-ink/45">· {c.region} · {c.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Last updated */}
      <div className="flex items-center justify-between text-[10.5px] text-ink/45">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#10b981] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          </span>
          Live · updated {ago}
        </span>
        <span className="tabular-nums">auto-refresh 20s</span>
      </div>

      {/* KPIs 2x2 — visitors + 3 timeseries */}
      <div className="grid grid-cols-2 gap-2">
        {/* Visitors right now — no series, pulse only */}
        <div className="rounded-lg border border-ink/[0.06] bg-white p-3">
          <div className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-ink/50">Visitors right now</div>
          <div className="mt-1 flex items-end justify-between gap-2">
            <div className="font-hero text-[20px] font-semibold text-ink tabular-nums leading-none">
              {streamer ? "—" : <CountUp value={counts.visitors} />}
            </div>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#2563eb] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2563eb]" />
            </span>
          </div>
          <div className="mt-1 text-[10.5px] text-ink/40">Last 5 minutes</div>
        </div>

        <KpiCard label="Total sales" value={series.sales.total} tint="#10b981" streamer={streamer} series={series.sales} isCurrency />
        <KpiCard label="Sessions"    value={series.sessions.total} tint="#0ea5e9" streamer={streamer} series={series.sessions} />
        <KpiCard label="Orders"      value={series.orders.total}   tint="#7c3aed" streamer={streamer} series={series.orders} />
      </div>

      {/* Patient behavior — funnel bar */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-ink/[0.06] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Patient behavior</div>
        <div className="px-3.5 py-3">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-ink/[0.05]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.inIntake / funnel.total) * 100}%` }} transition={{ duration: 0.5 }} style={{ background: "#2563eb" }} />
            <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.awaiting / funnel.total) * 100}%` }} transition={{ duration: 0.5, delay: 0.05 }} style={{ background: "#7c3aed" }} />
            <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.approved / funnel.total) * 100}%` }} transition={{ duration: 0.5, delay: 0.1 }} style={{ background: "#10b981" }} />
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
            {[
              { label: "In intake", value: funnel.inIntake, color: "#2563eb" },
              { label: "Awaiting physician", value: funnel.awaiting, color: "#7c3aed" },
              { label: "Approved", value: funnel.approved, color: "#10b981" },
            ].map((r) => (
              <div key={r.label} className="min-w-0">
                <div className="flex items-center gap-1.5 text-ink/55">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                  <span className="truncate">{r.label}</span>
                </div>
                <div className="mt-0.5 font-hero text-[15px] font-semibold text-ink tabular-nums">
                  {streamer ? "—" : <CountUp value={r.value} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sessions by location */}
      <Card className="p-3.5">
        <div className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Sessions by location</div>
        {byLocation.length === 0 && (
          <div className="grid h-16 place-items-center text-[11.5px] text-ink/40">No live sessions yet</div>
        )}
        <div className="space-y-2.5">
          {byLocation.slice(0, 10).map((row, i) => (
            <button
              key={row.key}
              type="button"
              onClick={() => onFocus(row.lat, row.lng)}
              title={`${row.country} · ${row.region} · ${row.city}`}
              className="block w-full text-left"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2 text-[11.5px]">
                <span className="min-w-0 truncate text-ink/75">{row.label}</span>
                <span className="shrink-0 tabular-nums text-ink/70">{streamer ? "—" : row.n}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink/[0.05]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(row.n / top) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.02 }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)" }}
                />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* New vs returning */}
      <Card className="p-3.5">
        <div className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">New vs returning patients</div>
        <div className="flex h-2 overflow-hidden rounded-full">
          <div style={{ width: `${newReturning.newPct}%`, background: "#2563eb" }} />
          <div style={{ width: `${newReturning.returningPct}%`, background: "#7c3aed" }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11.5px]">
          <span className="flex items-center gap-1.5 text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#2563eb" }} /> New
            <span className="tabular-nums text-ink/45">· {streamer ? "—" : `${newReturning.newPct}%`}</span>
          </span>
          <span className="flex items-center gap-1.5 text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#7c3aed" }} /> Returning
            <span className="tabular-nums text-ink/45">· {streamer ? "—" : `${newReturning.returningPct}%`}</span>
          </span>
        </div>
      </Card>

      {/* Revenue by treatment — with mini bars */}
      <Card className="p-3.5">
        <div className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Revenue by treatment</div>
        <div className="space-y-2.5">
          {orderRows.map((r) => (
            <div key={r.label} className="text-[12px]">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 truncate text-ink/75">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
                  {r.label}
                </span>
                <span className="shrink-0 tabular-nums text-ink">{streamer ? "—" : usd(r.value)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.05]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(r.value / orderMax) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: r.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
