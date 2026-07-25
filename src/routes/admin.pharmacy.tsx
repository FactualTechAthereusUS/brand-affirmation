import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, ArrowUp, RefreshCw, Truck, Activity } from "lucide-react";
import { AdminShell, Card, Pill, SectionTitle, formatMoney, timeAgo } from "@/components/admin/AdminShell";
import { Sparkline } from "@/components/admin/Sparkline";
import { PipelineStrip } from "@/components/admin/PipelineStrip";
import { adminActions, useAdmin, type Pharmacy } from "@/lib/admin/store";
import { pipelineByPharmacy } from "@/lib/admin/selectors";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const pharmacies = useAdmin((s) => s.pharmacies);
  const orders = useAdmin((s) => s.orders);
  const state = useAdmin((s) => s);
  const [pinned, setPinned] = useState<string | null>(pharmacies[0]?.id ?? null);

  const pipeline = pipelineByPharmacy(state);
  const totals = useMemo(() => {
    return pharmacies.reduce((acc, p) => {
      acc.queue += p.queue;
      acc.onTime += p.onTimeRate;
      acc.prep += p.avgPrepHrs;
      if (p.apiStatus !== "connected") acc.degraded += 1;
      return acc;
    }, { queue: 0, onTime: 0, prep: 0, degraded: 0 });
  }, [pharmacies]);

  const active = pinned ? pharmacies.find((p) => p.id === pinned) ?? pharmacies[0] : pharmacies[0];
  const activePipeline = active ? pipeline.find((r) => r.pharmacy.id === active.id) : null;

  return (
    <AdminShell title="Pharmacy">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-hero text-[22px] font-bold tracking-tight text-ink">Pharmacy operations</h1>
          <p className="mt-1 text-[13px] text-ink/60">API health, routing, queue depth, and throughput across partners.</p>
        </div>
        <Link to="/admin/settings/pharmacy-routing" className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-medium text-ink/80 hover:bg-ink/5">
          Routing rules →
        </Link>
      </div>

      {/* KPI strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Partners connected" value={`${pharmacies.length - totals.degraded}/${pharmacies.length}`} tone={totals.degraded ? "warn" : "success"} />
        <Kpi label="Total queue depth" value={totals.queue} sub="Awaiting dispense" />
        <Kpi label="Avg prep time" value={`${(totals.prep / Math.max(1, pharmacies.length)).toFixed(1)}h`} />
        <Kpi label="Blended on-time" value={`${(totals.onTime / Math.max(1, pharmacies.length)).toFixed(1)}%`} tone="success" />
      </div>

      {/* Partner grid */}
      <SectionTitle subtitle="Click a partner to inspect throughput and act on routing.">Partners</SectionTitle>
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pharmacies.map((p) => (
          <PharmacyCard
            key={p.id}
            p={p}
            active={active?.id === p.id}
            onClick={() => setPinned(p.id)}
          />
        ))}
      </div>

      {/* Detail row */}
      {active && (
        <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-hero text-[17px] font-semibold text-ink">{active.name}</div>
                  <StatusDot status={active.apiStatus} />
                  <Pill tone={active.role === "primary" ? "success" : "neutral"}>{active.role === "primary" ? "Primary" : "Backup"}</Pill>
                </div>
                <div className="mt-1 text-[12px] text-ink/55">Handles: {active.drugs.join(" · ")}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {active.apiStatus === "down" || active.apiStatus === "degraded" ? (
                  <button onClick={() => { adminActions.resumePharmacyRouting(active.id); toast.success(`${active.name} routing resumed`); }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-ink/90">
                    <Play className="h-3.5 w-3.5" /> Resume routing
                  </button>
                ) : (
                  <button onClick={() => { adminActions.pausePharmacyRouting(active.id); toast.success(`${active.name} paused`); }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-honey/40 bg-honey/10 px-3 py-1.5 text-[12px] font-semibold text-honey hover:bg-honey/15">
                    <Pause className="h-3.5 w-3.5" /> Pause routing
                  </button>
                )}
                <button onClick={() => { adminActions.bumpPharmacyPriority(active.id); toast.success(`${active.name} priority raised`); }}
                  disabled={pharmacies[0]?.id === active.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-medium text-ink/80 hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40">
                  <ArrowUp className="h-3.5 w-3.5" /> Raise priority
                </button>
                <button onClick={() => toast.success(`Health check queued for ${active.name}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-medium text-ink/80 hover:bg-ink/5">
                  <RefreshCw className="h-3.5 w-3.5" /> Ping API
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat label="Queue" value={active.queue} icon={Truck} />
              <MiniStat label="Avg prep" value={`${active.avgPrepHrs}h`} icon={Activity} />
              <MiniStat label="On-time" value={`${active.onTimeRate.toFixed(1)}%`} tone={active.onTimeRate < 92 ? "warn" : "success"} icon={Activity} />
              <MiniStat label="API" value={active.apiStatus} icon={Activity} tone={active.apiStatus === "connected" ? "success" : active.apiStatus === "degraded" ? "warn" : "critical"} />
            </div>

            {activePipeline && (
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StageChip label="Awaiting Rx" value={activePipeline.awaitingRx} tone="warn" />
                <StageChip label="Preparing" value={activePipeline.preparing} tone="info" />
                <StageChip label="Shipped" value={activePipeline.shipped} tone="success" />
                <StageChip label="Delivered" value={activePipeline.delivered} tone="neutral" />
              </div>
            )}

            <div className="mt-5">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">30-day throughput</div>
              <div className="mt-2 h-16">
                <Sparkline
                  data={Array.from({ length: 30 }, (_, i) => Math.round(active.queue * 3 + Math.sin(i * 0.35 + active.id.length) * 12 + i * 0.6))}
                  stroke={active.apiStatus === "connected" ? "#4f46e5" : "#f59e0b"}
                  fill="rgba(79,70,229,0.08)"
                />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Recent events</div>
            <div className="mt-3 space-y-2.5">
              {[
                { t: `${active.name} · ping ok`, ts: Date.now() - 1000 * 60 * 4, tone: "success" },
                { t: `Batch #${Math.floor(Math.random() * 900 + 100)} dispatched`, ts: Date.now() - 1000 * 60 * 22, tone: "info" },
                { t: `On-time slipped to ${active.onTimeRate.toFixed(1)}%`, ts: Date.now() - 1000 * 60 * 55, tone: active.onTimeRate < 92 ? "warn" : "info" },
                { t: `Priority routing rule updated`, ts: Date.now() - 1000 * 60 * 60 * 3, tone: "info" },
              ].map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px]">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${e.tone === "success" ? "bg-check" : e.tone === "warn" ? "bg-honey" : "bg-marine"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-ink/80">{e.t}</div>
                    <div className="text-[10.5px] text-ink/45">{timeAgo(e.ts)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Combined pipeline */}
      <SectionTitle subtitle="Volume rollup across pharmacies">Fulfillment pipeline</SectionTitle>
      <div className="mb-6"><PipelineStrip /></div>

      {/* Orders by pharmacy */}
      <SectionTitle subtitle="Latest fulfillment activity">Recent orders</SectionTitle>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-ink/6 text-[10.5px] uppercase tracking-[0.12em] text-ink/45">
                <th className="px-4 py-2.5 font-semibold">Order</th>
                <th className="px-4 py-2.5 font-semibold">Patient</th>
                <th className="px-4 py-2.5 font-semibold">Program</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Created</th>
                <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 14).map((o) => (
                <tr key={o.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-ink/80">
                    <Link to="/admin/orders/$id" params={{ id: o.id }} className="hover:text-marine hover:underline">{o.id}</Link>
                  </td>
                  <td className="px-4 py-2.5 text-ink">{o.patientName}</td>
                  <td className="px-4 py-2.5 text-[11.5px] text-ink/60">{o.program}</td>
                  <td className="px-4 py-2.5">
                    <Pill tone={o.status === "delivered" ? "success" : o.status === "exception" ? "critical" : "info"}>{o.status}</Pill>
                  </td>
                  <td className="px-4 py-2.5 text-[11.5px] text-ink/60">{o.createdAt}</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{formatMoney(o.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}

function PharmacyCard({ p, active, onClick }: { p: Pharmacy; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`text-left rounded-2xl border p-4 transition ${active ? "border-ink bg-white shadow-[0_10px_30px_-15px_rgba(23,23,23,0.25)]" : "border-ink/8 bg-white hover:border-ink/20"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-[13.5px] font-semibold text-ink">{p.name}</div>
            <StatusDot status={p.apiStatus} />
          </div>
          <div className="mt-0.5 text-[11px] text-ink/55">{p.role === "primary" ? "Primary" : "Backup"} · {p.drugs.length} drugs</div>
        </div>
        <Pill tone={p.role === "primary" ? "success" : "neutral"}>{p.role}</Pill>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-ink/6 pt-3">
        <MiniInline label="Queue" value={p.queue} />
        <MiniInline label="Prep" value={`${p.avgPrepHrs}h`} />
        <MiniInline label="On-time" value={`${p.onTimeRate.toFixed(1)}%`} tone={p.onTimeRate < 92 ? "warn" : "ok"} />
      </div>
    </motion.button>
  );
}

function StatusDot({ status }: { status: Pharmacy["apiStatus"] }) {
  const color = status === "connected" ? "bg-check" : status === "degraded" ? "bg-honey" : "bg-ever";
  const label = status === "connected" ? "Connected" : status === "degraded" ? "Degraded" : "Down";
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] text-ink/60">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} /> {label}
    </span>
  );
}

function MiniInline({ label, value, tone = "ok" }: { label: string; value: string | number; tone?: "ok" | "warn" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink/40">{label}</div>
      <div className={`mt-0.5 text-[13px] font-semibold tabular-nums ${tone === "warn" ? "text-ever" : "text-ink"}`}>{value}</div>
    </div>
  );
}

function Kpi({ label, value, sub, tone = "neutral" }: { label: string; value: string | number; sub?: string; tone?: "success" | "warn" | "neutral" }) {
  const color = tone === "success" ? "text-check" : tone === "warn" ? "text-honey" : "text-ink";
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_1px_0_rgba(23,23,23,0.02)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</div>
      <div className={`mt-1 font-hero text-[22px] font-bold tabular-nums ${color}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-ink/50">{sub}</div>}
    </motion.div>
  );
}

function MiniStat({ label, value, icon: Icon, tone = "neutral" }: { label: string; value: string | number; icon: typeof Truck; tone?: "success" | "warn" | "critical" | "neutral" }) {
  const color = tone === "success" ? "text-check" : tone === "warn" ? "text-honey" : tone === "critical" ? "text-ever" : "text-ink";
  return (
    <div className="rounded-xl border border-ink/8 bg-white p-3">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-1 text-[15px] font-semibold tabular-nums capitalize ${color}`}>{value}</div>
    </div>
  );
}

function StageChip({ label, value, tone }: { label: string; value: number; tone: "warn" | "info" | "success" | "neutral" }) {
  const map = {
    warn: "bg-honey/10 text-honey",
    info: "bg-marine/8 text-marine",
    success: "bg-check/10 text-check",
    neutral: "bg-ink/5 text-ink/70",
  };
  return (
    <div className={`rounded-xl px-3 py-2 ${map[tone]}`}>
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] opacity-80">{label}</div>
      <div className="mt-0.5 text-[17px] font-bold tabular-nums">{value}</div>
    </div>
  );
}
