import { useEffect, useRef, useState } from "react";
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

type Props = {
  counts: Counts;
  totalSales: number;
  byLocation: ByLocationRow[];
  streamer: boolean;
  onFocus: (lat: number, lng: number) => void;
  orderRows: { label: string; value: number; color: string }[];
  newReturning: { newPct: number; returningPct: number };
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

function Kpi({ label, value, streamer, tint = "#2563eb" }: { label: string; value: number | string; streamer: boolean; tint?: string }) {
  return (
    <div className="rounded-lg border border-ink/[0.06] bg-white p-3">
      <div className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-ink/50">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5 font-hero text-[22px] font-semibold text-ink tabular-nums">
        {streamer ? <span>—</span> : typeof value === "number" ? <CountUp value={value} /> : <span>{value}</span>}
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
      </div>
    </div>
  );
}

export function LiveSidebar({
  counts, totalSales, byLocation, streamer, onFocus, orderRows, newReturning,
}: Props) {
  const [q, setQ] = useState("");
  const [sug, setSug] = useState<City[]>([]);
  const top = byLocation[0]?.n ?? 1;

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

      {/* KPIs 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Visitors right now" value={counts.visitors} streamer={streamer} tint="#2563eb" />
        <Kpi label="Total sales"        value={streamer ? "—" : usd(totalSales)} streamer={false} tint="#10b981" />
        <Kpi label="Sessions"           value={counts.sessions} streamer={streamer} tint="#0ea5e9" />
        <Kpi label="Orders"             value={counts.purchased} streamer={streamer} tint="#7c3aed" />
      </div>

      {/* Patient behavior */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-ink/[0.06] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Patient behavior</div>
        <div className="grid grid-cols-3 divide-x divide-ink/[0.06]">
          {[
            { label: "In intake",         value: counts.cartsActive, color: "#2563eb" },
            { label: "Awaiting physician", value: counts.checkingOut, color: "#7c3aed" },
            { label: "Approved",          value: counts.purchased,   color: "#10b981" },
          ].map((r) => (
            <div key={r.label} className="p-3.5">
              <div className="text-[10.5px] text-ink/55">{r.label}</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-hero text-[20px] font-semibold text-ink tabular-nums">
                {streamer ? "—" : <CountUp value={r.value} />}
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
              </div>
            </div>
          ))}
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

      {/* Revenue by treatment */}
      <Card className="p-3.5">
        <div className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Revenue by treatment</div>
        <div className="space-y-2">
          {orderRows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-2 text-[12px]">
              <span className="flex min-w-0 items-center gap-2 truncate text-ink/75">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
                {r.label}
              </span>
              <span className="shrink-0 tabular-nums text-ink">{streamer ? "—" : usd(r.value)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
