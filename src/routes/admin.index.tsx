import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, Card, Pill, SectionTitle } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { MrrMovementBar } from "@/components/admin/MrrMovementBar";
import { FunnelWaterfall } from "@/components/admin/FunnelWaterfall";
import { PipelineStrip } from "@/components/admin/PipelineStrip";
import { PhysicianQueueStrip } from "@/components/admin/PhysicianQueueStrip";
import { TaskCenter } from "@/components/admin/TaskCenter";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { computeKpis, funnelData, useAdmin } from "@/lib/admin/store";
import {
  todayRevenue, revenueTrend, newPatientsTrend, ordersTrend,
  failedPaymentsToday, refillsDue, mrrWaterfall, acquisitionSpendMix,
  abandonedCheckouts,
} from "@/lib/admin/selectors";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [
    { title: "Admin — Blissley" },
    { name: "description", content: "Blissley operator console. Real-time patient, order, and revenue signals." },
  ]}),
  component: AdminHome,
});

function AdminHome() {
  const kpi = useAdmin(computeKpis);
  const todayRev = useAdmin(todayRevenue);
  const revTrend = useAdmin((s) => revenueTrend(s, 30));
  const patientsTrend = useAdmin((s) => newPatientsTrend(s, 30));
  const shipTrend = useAdmin((s) => ordersTrend(s, 30));
  const failed = useAdmin(failedPaymentsToday);
  const refills = useAdmin(refillsDue);
  const waterfall = useAdmin(mrrWaterfall);
  const funnel = funnelData();
  const abandoned = useAdmin(abandonedCheckouts);
  const acqMix = useAdmin(acquisitionSpendMix);
  const scenario = useAdmin((s) => s.scenario);

  const activeCount = kpi.activeCount;

  return (
    <AdminShell>
      {/* 1. Today strip */}
      <div className="mb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h1 className="font-hero text-[22px] font-semibold text-ink">Today</h1>
            <div className="mt-0.5 text-[11.5px] text-ink/50">
              {scenario === "crisis" && <Pill tone="critical">Crisis scenario active</Pill>}
              {scenario === "launch" && <Pill tone="info">Launch day scenario active</Pill>}
              {scenario === "churn" && <Pill tone="warn">Churn spike scenario active</Pill>}
              {scenario === "empty" && <Pill>Empty workspace</Pill>}
              {scenario === "healthy" && <span>Everything within normal range. Last synced just now.</span>}
            </div>
          </div>
          <span className="rounded-lg border border-ink/[0.08] px-2.5 py-1 text-[11.5px] text-ink/60">Last 4 weeks</span>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Orders shipped" value={shipTrend.reduce((a,b)=>a+b,0).toLocaleString()} delta="+8.4%" tone="positive" spark={shipTrend} sparkColor="#171717" />
          <KpiCard label="Today's revenue" value={`$${todayRev.toLocaleString()}`} delta="+12%" tone="positive" spark={revTrend} sparkColor="#ee7273" />
          <KpiCard label="Active patients" value={activeCount.toLocaleString()} delta="+3.2%" tone="positive" spark={patientsTrend} sparkColor="#1D437B" />
          <KpiCard label="Failed payments" value={failed} delta={failed > 5 ? `+${failed - 3}` : "—"} tone={failed > 5 ? "critical" : "default"} sub="Retry rule: 1d / 3d / 7d" />
          <KpiCard label="Refills due" value={refills} sub="Days 85-92, clear status" tone={refills > 3 ? "warn" : "default"} />
        </div>
      </div>

      {/* 2. Growth grid */}
      <div className="mb-6">
        <SectionTitle subtitle="Revenue movement, funnel, and acquisition efficiency">Growth</SectionTitle>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <MrrMovementBar items={waterfall} />
          <FunnelWaterfall steps={funnel.slice(0, 7)} />
          <Card className="p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Unit economics</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-y-3 text-[12px]">
              <Metric label="CAC" value="$92" tone="ok" />
              <Metric label="LTV" value="$1,240" tone="ok" />
              <Metric label="LTV:CAC" value="13.5×" tone="ok" />
              <Metric label="Payback" value="2.1 mo" tone="ok" />
              <Metric label="Gross margin" value="68.4%" tone="ok" />
              <Metric label="Monthly churn" value="7.1%" tone={scenario === "churn" ? "warn" : "ok"} />
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Queue strip */}
      <div className="mb-6">
        <SectionTitle
          subtitle="Every queue that needs a human eye right now"
          action={<Link to="/admin/physician-queue" className="text-[11.5px] font-medium text-ink underline-offset-2 hover:underline">View all →</Link>}
        >
          Queues
        </SectionTitle>
        <PhysicianQueueStrip />
      </div>

      {/* 4. Pharmacy strip */}
      <div className="mb-6">
        <SectionTitle
          subtitle="Fulfillment volume and health per partner pharmacy"
          action={<Link to="/admin/pharmacy" className="text-[11.5px] font-medium text-ink underline-offset-2 hover:underline">Pharmacy detail →</Link>}
        >
          Pharmacy
        </SectionTitle>
        <PipelineStrip />
      </div>

      {/* 5. Marketing */}
      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Acquisition mix</div>
          <div className="space-y-2">
            {acqMix.map((a) => (
              <div key={a.label} className="flex items-center gap-2">
                <div className="w-16 text-[11.5px] text-ink/60">{a.label}</div>
                <div className="flex-1 rounded bg-ink/[0.04]">
                  <div className="h-3 rounded" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
                <div className="w-24 text-right text-[11.5px] tabular-nums text-ink/70">${a.value.toLocaleString()} · {a.pct.toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Abandoned checkouts</div>
            <div className="text-[11px] text-ink/45">{abandoned.length} today · not recovered</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
                <tr className="border-b border-ink/[0.06]">
                  <th className="py-1.5 pr-3 text-left font-medium">Checkout</th>
                  <th className="py-1.5 pr-3 text-left font-medium">Name</th>
                  <th className="py-1.5 pr-3 text-left font-medium">Created</th>
                  <th className="py-1.5 pr-3 text-left font-medium">Recovery</th>
                  <th className="py-1.5 pl-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {abandoned.slice(0, 6).map((r) => (
                  <tr key={r.id} className="border-b border-ink/[0.04] last:border-0">
                    <td className="py-2 pr-3 text-ink/60">{r.id}</td>
                    <td className="py-2 pr-3 text-ink">{r.name}</td>
                    <td className="py-2 pr-3 text-ink/60">{r.created}</td>
                    <td className="py-2 pr-3"><Pill tone={r.recoveryStatus === "Recovering" ? "info" : "warn"}>{r.recoveryStatus}</Pill></td>
                    <td className="py-2 pl-3 text-right text-ink">${r.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 6. Task center + activity */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2"><TaskCenter /></div>
        <ActivityFeed limit={10} title="Live activity" />
      </div>
    </AdminShell>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">{label}</div>
      <div className={`mt-0.5 font-hero text-[18px] font-semibold tabular-nums ${tone === "warn" ? "text-ever" : "text-ink"}`}>{value}</div>
    </div>
  );
}
