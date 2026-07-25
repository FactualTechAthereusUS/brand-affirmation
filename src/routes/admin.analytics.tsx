import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { MetricCard, AnalyticsSection } from "@/components/admin/analytics/MetricCard";
import { LineChartMini, BarsMini } from "@/components/admin/analytics/LineChartMini";
import { AreaChart } from "@/components/admin/analytics/AreaChart";
import { Donut } from "@/components/admin/analytics/Donut";
import { HBar } from "@/components/admin/analytics/HBar";
import { BreakdownBars } from "@/components/admin/analytics/BreakdownBars";
import { CohortHeatmap } from "@/components/admin/analytics/Heatmap";
import { computeKpis, funnelData, cohortRetention, useAdmin } from "@/lib/admin/store";
import {
  revenueTrend, sessionsTrend, aovTrend, activeTrend, priorPeriodShift, datesTrend,
  physicianSLATrend, approvalRateTrend, refillAdherenceTrend,
  sessionsByState, deviceMix, trafficSources, programMovers, paymentsHealth,
  insightHeadline, conversionFunnel,
} from "@/lib/admin/selectors";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [
    { title: "Analytics — Blissley Admin" },
    { name: "description", content: "Telehealth analytics: MRR, clinical SLA, refills, retention, and acquisition — one dense dashboard." },
  ] }),
  component: AnalyticsOverview,
});

function AnalyticsOverview() {
  const kpi = useAdmin(computeKpis);
  const funnelSum = useAdmin(conversionFunnel);
  const rev = useAdmin((s) => revenueTrend(s, 30));
  const sess = useAdmin((s) => sessionsTrend(s, 30));
  const aov = useAdmin((s) => aovTrend(s, 30));
  const active = useAdmin((s) => activeTrend(s, 30));
  const sla = useAdmin((s) => physicianSLATrend(s, 30));
  const approval = useAdmin((s) => approvalRateTrend(s, 30));
  const refill = useAdmin((s) => refillAdherenceTrend(s, 30));
  const geo = useAdmin(sessionsByState);
  const devices = deviceMix();
  const sources = useAdmin(trafficSources);
  const movers = useAdmin(programMovers);
  const pay = useAdmin((s) => paymentsHealth(s, 30));
  const insight = useAdmin(insightHeadline);
  const cohorts = cohortRetention();
  const dts = useAdmin((s) => datesTrend(s, 30));
  const usd = (v: number) => `$${v.toLocaleString()}`;
  const pct = (v: number) => `${v}%`;
  const pct1 = (v: number) => `${v.toFixed(1)}%`;
  const mins = (v: number) => `${v}m`;

  const funnel = funnelData();
  const breakdown = [
    { label: "Sessions", count: funnelSum.sessions, pct: 100, delta: "+4%" },
    { label: "Intake", count: funnelSum.intake, pct: funnelSum.intakePct, delta: "−63%" },
    { label: "Approved", count: funnel[4].count, pct: funnel[4].pct, delta: "−8%" },
    { label: "Paid", count: funnelSum.paid, pct: funnelSum.paidPct, delta: "−4%" },
  ];

  const mrrSegments = [
    { label: "New", value: 11400, color: "#ee7273" },
    { label: "Expansion", value: 3500, color: "#171717" },
    { label: "Reactivated", value: 1500, color: "#c4a265" },
    { label: "Contraction", value: 1800, color: "#8b9bb4" },
    { label: "Churn", value: 3300, color: "#dc3545" },
  ];

  const failedTotal = pay.failed.reduce((a, b) => a + b, 0);
  const recoveredTotal = pay.recovered.reduce((a, b) => a + b, 0);
  const recoveryRate = failedTotal ? Math.round((recoveredTotal / failedTotal) * 100) : 0;
  const totalPayments = pay.totals.reduce((a, b) => a + b, 0);

  return (
    <AdminShell>
      <div className="-mx-4 -mt-4 min-h-[calc(100vh-56px)] bg-[#f6f6f7] px-4 pb-16 pt-4 lg:-mx-6 lg:px-6">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className="font-hero text-[24px] font-semibold text-ink">Analytics</h1>
          <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ink/55">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-check" />
            Last refreshed just now · vs prior 30 days
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
          <button className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink">Last 30 days ▾</button>
          <button className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink">Compare · Prior period ▾</button>
          <button className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink">USD $</button>
          <button className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink">Export</button>
          <button className="rounded-lg bg-ink px-2.5 py-1.5 text-white hover:bg-ink/90">New report</button>
        </div>
      </motion.div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex flex-col gap-3 rounded-xl border border-ink/[0.08] bg-white p-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold text-white ${insight.tone === "critical" ? "bg-ever" : insight.tone === "warn" ? "bg-honey" : "bg-check"}`}>!</div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Insight · today</div>
            <div className="mt-0.5 font-hero text-[17px] font-semibold text-ink">{insight.title}</div>
            <div className="mt-0.5 text-[12px] text-ink/60">{insight.detail}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="h-10 w-32"><LineChartMini data={rev.slice(-14)} dates={dts.slice(-14)} label="Net revenue" formatValue={usd} stroke={insight.tone === "critical" ? "#ee7273" : "#171717"} height={40} /></div>
          <button className="rounded-lg border border-ink/12 px-2.5 py-1.5 text-[11.5px] text-ink/70 hover:border-ink">See why →</button>
        </div>
      </motion.div>

      {/* Section 1 — Revenue */}
      <AnalyticsSection title="Revenue">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Net revenue" value={`$${kpi.netRevenue.toLocaleString()}`} delta="+8.1%" sub="Compared to prior 30d">
            <div className="px-3 pb-2"><AreaChart data={rev} prior={priorPeriodShift(rev, 8)} dates={dts} label="Net revenue" formatValue={usd} formatYTick={(v)=>`$${Math.round(v/1000)}k`} stroke="#171717" height={200} /></div>
          </MetricCard>
          <MetricCard label="MRR" value={`$${kpi.mrr.toLocaleString()}`} delta="+4.6%" sub="Recurring monthly">
            <div className="px-3"><Donut segments={mrrSegments} centerValue={`$${(kpi.mrr / 1000).toFixed(1)}k`} centerLabel="MRR" size={132} thickness={16} /></div>
          </MetricCard>
          <MetricCard label="Active patients" value={kpi.activeCount.toLocaleString()} delta="+3.2%" sub="Patients on refill">
            <div className="px-3 pb-2"><AreaChart data={active} prior={priorPeriodShift(active, 6)} dates={dts} label="Active patients" stroke="#1D437B" height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Section 2 — Acquisition & funnel */}
      <AnalyticsSection title="Acquisition & funnel">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Sessions" value={funnelSum.sessions.toLocaleString()} delta="+9%">
            <div className="px-3 pb-2"><AreaChart data={sess} prior={priorPeriodShift(sess, 10)} dates={dts} label="Sessions" stroke="#ee7273" height={200} /></div>
          </MetricCard>
          <MetricCard label="Conversion breakdown" value={`${funnelSum.paidPct.toFixed(2)}%`} delta="+0.4%" sub="Session → Paid">
            <div className="px-3 pb-2"><BreakdownBars steps={breakdown} /></div>
          </MetricCard>
          <MetricCard label="AOV" value={`$${kpi.aov}`} delta="+0.4%" sub="Weighted by program">
            <div className="px-3 pb-2"><AreaChart data={aov} prior={priorPeriodShift(aov, 4)} dates={dts} label="AOV" formatValue={usd} formatYTick={usd} stroke="#c4a265" height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Section 3 — Clinical operations */}
      <AnalyticsSection title="Clinical operations">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Physician review · median" value={`${Math.round(sla.median.reduce((a,b)=>a+b,0)/sla.median.length)}m`} delta="−12%" deltaTone="positive" sub={`p90 · ${sla.p90}m`}>
            <div className="h-48 px-2 pb-4"><BarsMini data={sla.median} p90={sla.p90} dates={dts} label="Review time" formatValue={mins} color="#1D437B" /></div>
          </MetricCard>
          <MetricCard label="Approval rate" value={`${(approval.reduce((a,b)=>a+b,0)/approval.length).toFixed(1)}%`} delta="+1.4pt" sub="Target 82–88%">
            <div className="px-3 pb-2"><AreaChart data={approval} dates={dts} label="Approval rate" formatValue={pct1} formatYTick={(v)=>`${Math.round(v)}%`} band={{ lo: 82, hi: 88, color: "rgba(74,124,111,0.10)" }} stroke="#4a7c6f" height={200} /></div>
          </MetricCard>
          <MetricCard label="Refill adherence · day 60" value={`${refill[refill.length-1]}%`} delta="+3.1pt" sub="On active Rx">
            <div className="px-3 pb-2"><AreaChart data={refill} prior={priorPeriodShift(refill, 5)} dates={dts} label="Adherence" formatValue={pct} formatYTick={(v)=>`${Math.round(v)}%`} stroke="#ee7273" height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Section 4 — Retention */}
      <AnalyticsSection title="Retention">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
          <Card className="p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Cohort heatmap</div>
              <div className="text-[11px] text-ink/45">Retention % by month</div>
            </div>
            <CohortHeatmap rows={cohorts} />
          </Card>
          <Card className="p-4">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Churn reasons</div>
            <HBar
              color="#ee7273"
              formatValue={(v) => `${v}%`}
              rows={[
                { label: "Side effects", value: 32 },
                { label: "Cost", value: 22 },
                { label: "Reached goal", value: 18 },
                { label: "Not effective", value: 14 },
                { label: "Other", value: 14 },
              ]}
            />
          </Card>
        </div>
      </AnalyticsSection>

      {/* Section 5 — Geography & devices */}
      <AnalyticsSection title="Geography & devices">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Sessions by state</div>
              <div className="text-[11px] text-ink/45">Top 6</div>
            </div>
            <HBar rows={geo} color="#171717" />
          </Card>
          <Card className="p-4">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Device mix</div>
            <div className="pt-2">
              <Donut
                segments={devices}
                centerValue={`${devices[0].value}%`}
                centerLabel="Mobile"
                size={140}
                thickness={18}
              />
            </div>
          </Card>
          <Card className="p-4">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Traffic sources</div>
            <HBar rows={sources} color="#1D437B" />
          </Card>
        </div>
      </AnalyticsSection>

      {/* Section 6 — Top movers */}
      <AnalyticsSection title="Programs · top movers">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[12px]">
              <thead className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
                <tr className="border-b border-ink/[0.06] bg-ink/[0.015]">
                  <th className="px-4 py-2 text-left font-medium">Program</th>
                  <th className="px-3 py-2 text-right font-medium">Patients</th>
                  <th className="px-3 py-2 text-right font-medium">New MRR</th>
                  <th className="px-3 py-2 text-right font-medium">AOV</th>
                  <th className="px-3 py-2 text-right font-medium">Refill %</th>
                  <th className="px-3 py-2 text-right font-medium">Churn %</th>
                  <th className="px-4 py-2 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {movers.map((m, i) => (
                  <motion.tr
                    key={m.program}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-ink/[0.04] last:border-0 hover:bg-ink/[0.015]"
                  >
                    <td className="px-4 py-2.5 text-ink">{m.program}</td>
                    <td className="px-3 py-2.5 text-right text-ink/80">{m.patients}</td>
                    <td className="px-3 py-2.5 text-right text-ink">${m.newMrr.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-ink/70">${m.aov}</td>
                    <td className="px-3 py-2.5 text-right text-check">{m.refillPct}%</td>
                    <td className="px-3 py-2.5 text-right text-ever">{m.churnPct}%</td>
                    <td className="px-4 py-2.5">
                      <div className="ml-auto h-6 w-24"><LineChartMini data={m.spark} height={24} label={m.program} formatValue={usd} stroke="#171717" fill="rgba(23,23,23,0.06)" /></div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </AnalyticsSection>

      {/* Section 7 — Payments health */}
      <AnalyticsSection title="Payments health">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Total charges" value={totalPayments.toLocaleString()} delta="+5.4%">
            <div className="h-52 px-2 pb-4"><BarsMini data={pay.totals} dates={dts} label="Charges" color="#171717" /></div>
          </MetricCard>
          <MetricCard label="Failed payments" value={failedTotal.toLocaleString()} delta="+38%" deltaTone="critical" sub="Stripe timeouts spiking">
            <div className="px-3 pb-2"><AreaChart data={pay.failed} dates={dts} label="Failed" stroke="#ee7273" height={200} /></div>
          </MetricCard>
          <MetricCard label="Recovery rate" value={`${recoveryRate}%`} delta="+4pt" deltaTone="positive" sub="Auto-retry + dunning">
            <div className="px-3 pb-2"><AreaChart data={pay.recovered} dates={dts} label="Recovered" stroke="#4a7c6f" height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Sub-page nav */}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-ink/[0.08] pt-4 text-[11.5px]">
        <span className="text-ink/45">Deep dive:</span>
        <Link to="/admin/analytics/acquisition" className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Acquisition →</Link>
        <Link to="/admin/analytics/funnel" className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Funnel →</Link>
        <Link to="/admin/analytics/retention" className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Retention →</Link>
        <Link to="/admin/analytics/finances" className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Finances →</Link>
      </div>
      </div>
    </AdminShell>
  );
}
