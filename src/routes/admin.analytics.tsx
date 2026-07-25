import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { MrrMovementBar } from "@/components/admin/MrrMovementBar";
import { FunnelWaterfall } from "@/components/admin/FunnelWaterfall";
import { computeKpis, funnelData, useAdmin } from "@/lib/admin/store";
import { mrrWaterfall, revenueTrend, newPatientsTrend } from "@/lib/admin/selectors";

export const Route = createFileRoute("/admin/analytics/")({
  head: () => ({ meta: [{ title: "Analytics — Blissley Admin" }, { name: "description", content: "MRR, funnel, and unit economics at a glance." }] }),
  component: AnalyticsOverview,
});

function AnalyticsOverview() {
  const kpi = useAdmin(computeKpis);
  const wf = useAdmin(mrrWaterfall);
  const rev = useAdmin((s) => revenueTrend(s, 60));
  const patients = useAdmin((s) => newPatientsTrend(s, 60));

  return (
    <AdminShell>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h1 className="font-hero text-[22px] font-semibold text-ink">Analytics · Overview</h1>
          <div className="mt-0.5 text-[11.5px] text-ink/55">Last 60 days · comparison to prior period</div>
        </div>
        <div className="flex gap-1.5 text-[11.5px]">
          <Link to="/admin/analytics/acquisition" className="rounded-lg border border-ink/12 px-2.5 py-1 text-ink/70 hover:border-ink">Acquisition →</Link>
          <Link to="/admin/analytics/funnel" className="rounded-lg border border-ink/12 px-2.5 py-1 text-ink/70 hover:border-ink">Funnel →</Link>
          <Link to="/admin/analytics/retention" className="rounded-lg border border-ink/12 px-2.5 py-1 text-ink/70 hover:border-ink">Retention →</Link>
          <Link to="/admin/analytics/finances" className="rounded-lg border border-ink/12 px-2.5 py-1 text-ink/70 hover:border-ink">Finances →</Link>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <KpiCard label="MRR" value={`$${kpi.mrr.toLocaleString()}`} delta="+4.6%" tone="positive" spark={rev} sparkColor="#ee7273" />
        <KpiCard label="Net revenue" value={`$${kpi.netRevenue.toLocaleString()}`} delta="+8.1%" tone="positive" spark={rev} sparkColor="#171717" />
        <KpiCard label="Active" value={kpi.activeCount} delta="+3.2%" tone="positive" spark={patients} sparkColor="#1D437B" />
        <KpiCard label="AOV" value={`$${kpi.aov}`} delta="+0.4%" tone="positive" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <MrrMovementBar items={wf} />
        <FunnelWaterfall steps={funnelData().slice(0, 7)} />
      </div>

      <div className="mt-4">
        <SectionTitle subtitle="What's driving growth right now">Top movers</SectionTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card className="p-4"><Mover label="Tirzepatide 3-mo" delta="+18%" note="Best-selling program" /></Card>
          <Card className="p-4"><Mover label="Meta · Retargeting" delta="+6.1× ROAS" note="Wk30 creative outperforming" /></Card>
          <Card className="p-4"><Mover label="Failed payments" delta="+38%" note="Stripe timeout spike" tone="warn" /></Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Mover({ label, delta, note, tone = "positive" }: { label: string; delta: string; note: string; tone?: "positive" | "warn" }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">{label}</div>
      <div className={`mt-1 font-hero text-[22px] font-semibold ${tone === "warn" ? "text-ever" : "text-check"}`}>{delta}</div>
      <div className="mt-0.5 text-[11.5px] text-ink/50">{note}</div>
    </div>
  );
}
