import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { MetricCard, AnalyticsSection } from "@/components/admin/analytics/MetricCard";
import { LineChartMini, BarsMini } from "@/components/admin/analytics/LineChartMini";
import { AreaChart } from "@/components/admin/analytics/AreaChart";
import { Donut } from "@/components/admin/analytics/Donut";
import { HBar } from "@/components/admin/analytics/HBar";
import { BreakdownBars } from "@/components/admin/analytics/BreakdownBars";
import { CohortHeatmap } from "@/components/admin/analytics/Heatmap";
import { computeKpis, cohortRetention, useAdmin, adminActions } from "@/lib/admin/store";
import { conversionFunnel } from "@/lib/admin/selectors";
import {
  makeWindow, daysForRange, formatDelta,
  revenueWTrend, sessionsWTrend, aovWTrend, activeWTrend,
  physicianSLAWTrend, approvalRateWTrend, refillAdherenceWTrend,
  paymentsHealthW, sessionsByStateW, programMoversW, pickInsight,
  type RangeKey, type CompareKey,
} from "@/lib/admin/analytics";
import { deviceMix, trafficSources } from "@/lib/admin/selectors";
import { downloadCsv } from "@/lib/admin/csv";

type AnalyticsSearch = { range: string; compare: string; auto: boolean };

export const Route = createFileRoute("/admin/analytics/")({
  validateSearch: (raw: Record<string, unknown>): AnalyticsSearch => ({
    range: typeof raw.range === "string" ? raw.range : "30d",
    compare: typeof raw.compare === "string" ? raw.compare : "prior",
    auto: raw.auto === true || raw.auto === "true",
  }),
  head: () => ({ meta: [
    { title: "Analytics — Blissley Admin" },
    { name: "description", content: "Telehealth analytics: MRR, clinical SLA, refills, retention, and acquisition — one dense dashboard." },
  ] }),
  component: AnalyticsOverview,
});

const RANGE_LABEL: Record<string, string> = {
  "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", ytd: "Year to date", custom: "Custom range",
};
const COMPARE_LABEL: Record<string, string> = {
  prior: "Prior period", yoy: "Previous year", none: "No comparison",
};

function AnalyticsOverview() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const range = (["7d","30d","90d","ytd","custom"].includes(search.range) ? search.range : "30d") as RangeKey;
  const compare = (["prior","yoy","none"].includes(search.compare) ? search.compare : "prior") as CompareKey;
  const autoRefresh = !!search.auto;

  const kpi = useAdmin(computeKpis);
  const funnelSum = useAdmin(conversionFunnel);
  const cohorts = cohortRetention();

  const window = useAdmin((s) => makeWindow(s, daysForRange(range, s.funnelDays.length), compare));
  const rev = useAdmin((s) => revenueWTrend(makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const sess = useAdmin((s) => sessionsWTrend(makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const aov = useAdmin((s) => aovWTrend(makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const active = useAdmin((s) => activeWTrend(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const sla = useAdmin((s) => physicianSLAWTrend(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const approval = useAdmin((s) => approvalRateWTrend(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const refill = useAdmin((s) => refillAdherenceWTrend(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const pay = useAdmin((s) => paymentsHealthW(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const geo = useAdmin((s) => sessionsByStateW(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const movers = useAdmin((s) => programMoversW(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const insight = useAdmin((s) => pickInsight(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));

  const devices = deviceMix();
  const sources = useAdmin(trafficSources);
  const dts = window.dates;
  const priorDts = window.priorDates;

  const usd = (v: number) => `$${v.toLocaleString()}`;
  const pct = (v: number) => `${v}%`;
  const pct1 = (v: number) => `${v.toFixed(1)}%`;
  const mins = (v: number) => `${v}m`;

  // Prior overlay respects the compare selector — hide when "No comparison"
  const priorOr = <T,>(v: T | undefined): T | undefined => (compare === "none" ? undefined : v);

  const breakdown = [
    { label: "Sessions", count: funnelSum.sessions, pct: 100, delta: formatDelta(sess.deltaPct) },
    { label: "Intake", count: funnelSum.intake, pct: funnelSum.intakePct, delta: `${funnelSum.intakePct.toFixed(1)}%` },
    { label: "Approved", count: Math.round(funnelSum.paid * 1.06), pct: funnelSum.paidPct * 1.06, delta: formatDelta(approval.deltaPct, { unit: "pt" }) },
    { label: "Paid", count: funnelSum.paid, pct: funnelSum.paidPct, delta: formatDelta(pay.totalsDelta) },
  ];

  const C = {
    revenue: "#2563eb", mrr: "#7c3aed", active: "#0ea5e9",
    sessions: "#8b5cf6", aov: "#f59e0b", sla: "#0d9488",
    approval: "#10b981", refill: "#7c3aed",
    charges: "#2563eb", failed: "#ee7273", recovered: "#10b981",
  };

  const mrrSegments = [
    { label: "New", value: 11400, color: "#7c3aed" },
    { label: "Expansion", value: 3500, color: "#2563eb" },
    { label: "Reactivated", value: 1500, color: "#10b981" },
    { label: "Contraction", value: 1800, color: "#f59e0b" },
    { label: "Churn", value: 3300, color: "#ee7273" },
  ];

  // Auto-refresh: tick funnelDays every 8s
  const [tickCount, setTickCount] = useState(0);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { adminActions.tick(); setTickCount((n) => n + 1); }, 8000);
    return () => clearInterval(id);
  }, [autoRefresh]);
  const [lastRefresh, setLastRefresh] = useState<number>(() => Date.now());
  useEffect(() => { setLastRefresh(Date.now()); }, [tickCount, range, compare]);
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNowTs(Date.now()), 1000); return () => clearInterval(id); }, []);
  const secsAgo = Math.max(0, Math.round((nowTs - lastRefresh) / 1000));

  // Popover state
  const [rangeOpen, setRangeOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setRangeOpen(false);
      if (compareRef.current && !compareRef.current.contains(e.target as Node)) setCompareOpen(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const updateSearch = (patch: Partial<{ range: RangeKey; compare: CompareKey; auto: boolean }>) => {
    navigate({ search: (prev: AnalyticsSearch) => ({ ...prev, ...patch }) });
  };

  const handleExport = (kind: "movers" | "funnel" | "cohort" | "payments") => {
    if (kind === "movers") {
      downloadCsv("program-movers", movers.map((m) => ({
        Program: m.program, Patients: m.patients, "New MRR": m.newMrr, AOV: m.aov,
        "Refill %": m.refillPct, "Churn %": m.churnPct, "Program Revenue": m.programRev,
      })));
    } else if (kind === "funnel") {
      downloadCsv("funnel", breakdown.map((b) => ({ Step: b.label, Count: b.count, Pct: b.pct.toFixed(2), Delta: b.delta })));
    } else if (kind === "cohort") {
      downloadCsv("cohort-retention", cohorts.flatMap((c) =>
        c.values.map((v, i) => ({ Cohort: c.month, Started: c.started, Month: `M${i}`, Retention: v === null ? "" : v })),
      ));
    } else if (kind === "payments") {
      downloadCsv("payments-health", dts.map((ts, i) => ({
        Date: new Date(ts).toISOString().slice(0, 10),
        Charges: pay.totals[i], Failed: pay.failed[i], Recovered: pay.recovered[i],
      })));
    }
    setExportOpen(false);
  };

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
            <span className={`inline-flex h-1.5 w-1.5 rounded-full ${autoRefresh ? "bg-check animate-pulse" : "bg-ink/30"}`} />
            {autoRefresh ? `Auto-refresh on · updated ${secsAgo}s ago` : `Last refreshed ${secsAgo === 0 ? "just now" : `${secsAgo}s ago`}`} · vs {COMPARE_LABEL[compare].toLowerCase()}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
          {/* Range */}
          <div ref={rangeRef} className="relative">
            <button
              onClick={() => setRangeOpen((v) => !v)}
              className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink"
            >
              {RANGE_LABEL[range]} ▾
            </button>
            {rangeOpen && (
              <div className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-lg border border-ink/10 bg-white py-1 shadow-lg">
                {(["7d","30d","90d","ytd"] as RangeKey[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => { updateSearch({ range: r }); setRangeOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-ink/[0.04] ${range === r ? "text-ink font-medium" : "text-ink/70"}`}
                  >
                    {RANGE_LABEL[r]}
                    {range === r && <span className="text-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Compare */}
          <div ref={compareRef} className="relative">
            <button
              onClick={() => setCompareOpen((v) => !v)}
              className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink"
            >
              Compare · {COMPARE_LABEL[compare]} ▾
            </button>
            {compareOpen && (
              <div className="absolute right-0 z-30 mt-1 w-52 overflow-hidden rounded-lg border border-ink/10 bg-white py-1 shadow-lg">
                {(["prior","yoy","none"] as CompareKey[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => { updateSearch({ compare: c }); setCompareOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-ink/[0.04] ${compare === c ? "text-ink font-medium" : "text-ink/70"}`}
                  >
                    {COMPARE_LABEL[c]}
                    {compare === c && <span className="text-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => updateSearch({ auto: !autoRefresh })}
            className={`rounded-lg border px-2.5 py-1.5 hover:border-ink ${autoRefresh ? "border-check/40 bg-check/10 text-check" : "border-ink/12 bg-white text-ink/70"}`}
            title="Auto-refresh every 8s"
          >
            {autoRefresh ? "Auto-refresh · on" : "Auto-refresh · off"}
          </button>
          {/* Export */}
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setExportOpen((v) => !v)}
              className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink"
            >
              Export ▾
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-30 mt-1 w-52 overflow-hidden rounded-lg border border-ink/10 bg-white py-1 shadow-lg">
                <button onClick={() => handleExport("movers")} className="block w-full px-3 py-1.5 text-left text-ink/70 hover:bg-ink/[0.04]">Program movers · CSV</button>
                <button onClick={() => handleExport("funnel")} className="block w-full px-3 py-1.5 text-left text-ink/70 hover:bg-ink/[0.04]">Funnel · CSV</button>
                <button onClick={() => handleExport("cohort")} className="block w-full px-3 py-1.5 text-left text-ink/70 hover:bg-ink/[0.04]">Cohort retention · CSV</button>
                <button onClick={() => handleExport("payments")} className="block w-full px-3 py-1.5 text-left text-ink/70 hover:bg-ink/[0.04]">Payments health · CSV</button>
              </div>
            )}
          </div>
          <Link
            to="/admin/reports"
            className="rounded-lg bg-ink px-2.5 py-1.5 text-white hover:bg-ink/90"
          >New report</Link>
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
          <div className="h-10 w-32">
            <LineChartMini
              data={rev.current.slice(-14)}
              dates={dts.slice(-14)}
              label="Net revenue"
              formatValue={usd}
              stroke={insight.tone === "critical" ? "#ee7273" : "#2563eb"}
              height={40}
            />
          </div>
          <Link
            to={insight.deepLink}
            className="rounded-lg border border-ink/12 px-2.5 py-1.5 text-[11.5px] text-ink/70 hover:border-ink"
          >See why →</Link>
        </div>
      </motion.div>

      {/* Section 1 — Revenue */}
      <AnalyticsSection title="Revenue">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Net revenue" value={`$${Math.round(rev.sum).toLocaleString()}`} deltaPct={rev.deltaPct} sub={`vs $${Math.round(rev.priorSum).toLocaleString()} prior`}>
            <div className="px-3 pb-2"><AreaChart data={rev.current} prior={priorOr(rev.prior)} dates={dts} label="Net revenue" priorLabel="Prior period" formatValue={usd} formatYTick={(v)=>`$${Math.round(v/1000)}k`} stroke={C.revenue} height={200} /></div>
          </MetricCard>
          <MetricCard label="MRR" value={`$${kpi.mrr.toLocaleString()}`} deltaPct={4.6} sub="Recurring monthly">
            <div className="px-3"><Donut segments={mrrSegments} centerValue={`$${(kpi.mrr / 1000).toFixed(1)}k`} centerLabel="MRR" size={132} thickness={16} /></div>
          </MetricCard>
          <MetricCard label="Active patients" value={active.sum.toLocaleString()} deltaPct={active.deltaPct} sub="On refill">
            <div className="px-3 pb-2"><AreaChart data={active.current} prior={priorOr(active.prior)} dates={dts} label="Active patients" stroke={C.active} height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Section 2 — Acquisition & funnel */}
      <AnalyticsSection title="Acquisition & funnel">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Sessions" value={sess.sum.toLocaleString()} deltaPct={sess.deltaPct} sub={`vs ${sess.priorSum.toLocaleString()} prior`}>
            <div className="px-3 pb-2"><AreaChart data={sess.current} prior={priorOr(sess.prior)} dates={dts} label="Sessions" stroke={C.sessions} height={200} /></div>
          </MetricCard>
          <MetricCard label="Conversion breakdown" value={`${funnelSum.paidPct.toFixed(2)}%`} deltaPct={approval.deltaPct} deltaUnit="pt" sub="Session → Paid">
            <div className="px-3 pb-2"><BreakdownBars steps={breakdown} /></div>
          </MetricCard>
          <MetricCard label="AOV" value={`$${aov.sum}`} deltaPct={aov.deltaPct} sub="Weighted by program">
            <div className="px-3 pb-2"><AreaChart data={aov.current} prior={priorOr(aov.prior)} dates={dts} label="AOV" formatValue={usd} formatYTick={usd} stroke={C.aov} height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Section 3 — Clinical operations */}
      <AnalyticsSection title="Clinical operations">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Physician review · median" value={`${sla.medianAll}m`} deltaPct={sla.deltaPct} positiveIsGood={false} sub={`p90 · ${sla.p90}m`}>
            <div className="h-52 px-2"><BarsMini data={sla.median} p90={sla.p90} dates={dts} label="Review time" formatValue={mins} color={C.sla} height={200} /></div>
          </MetricCard>
          <MetricCard label="Approval rate" value={`${approval.sum.toFixed(1)}%`} deltaPct={approval.deltaPct} deltaUnit="pt" sub="Target 82–88%">
            <div className="px-3 pb-2"><AreaChart data={approval.current} prior={priorOr(approval.prior)} dates={dts} label="Approval rate" formatValue={pct1} formatYTick={(v)=>`${Math.round(v)}%`} band={{ lo: 82, hi: 88, color: "rgba(16,185,129,0.10)" }} stroke={C.approval} height={200} /></div>
          </MetricCard>
          <MetricCard label="Refill adherence · day 60" value={`${refill.sum}%`} deltaPct={refill.deltaPct} deltaUnit="pt" sub="On active Rx">
            <div className="px-3 pb-2"><AreaChart data={refill.current} prior={priorOr(refill.prior)} dates={dts} label="Adherence" formatValue={pct} formatYTick={(v)=>`${Math.round(v)}%`} stroke={C.refill} height={200} /></div>
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
              formatValue={(v) => `${v}%`}
              palette={["#ee7273", "#f59e0b", "#0ea5e9", "#7c3aed", "#94a3b8"]}
              rows={churnReasons(useAdmin((s) => s.patients))}
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
            <HBar rows={geo} palette={["#2563eb", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"]} />
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
                formatValue={(v) => `${v}%`}
              />
            </div>
          </Card>
          <Card className="p-4">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Traffic sources</div>
            <HBar rows={sources} palette={["#7c3aed", "#2563eb", "#10b981", "#f59e0b", "#0ea5e9", "#ee7273"]} />
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
                {movers.map((m, i) => {
                  const rowPalette = ["#2563eb", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ee7273"];
                  const rowColor = rowPalette[i % rowPalette.length];
                  return (
                    <motion.tr
                      key={m.program}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-ink/[0.04] last:border-0 hover:bg-ink/[0.015]"
                    >
                      <td className="px-4 py-2.5 text-ink">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: rowColor }} />
                          {m.program}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-ink/80">{m.patients}</td>
                      <td className="px-3 py-2.5 text-right text-ink">${m.newMrr.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-ink/70">${m.aov}</td>
                      <td className="px-3 py-2.5 text-right text-check">{m.refillPct}%</td>
                      <td className="px-3 py-2.5 text-right text-ever">{m.churnPct}%</td>
                      <td className="px-4 py-2.5">
                        <div className="ml-auto h-6 w-24">
                          <LineChartMini
                            data={m.spark}
                            height={24}
                            label={m.program}
                            formatValue={usd}
                            stroke={rowColor}
                            fill={`${rowColor}1f`}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </AnalyticsSection>

      {/* Section 7 — Payments health */}
      <AnalyticsSection title="Payments health">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Total charges" value={pay.totalsSum.toLocaleString()} deltaPct={pay.totalsDelta}>
            <div className="h-52 px-2"><BarsMini data={pay.totals} dates={dts} label="Charges" color={C.charges} height={200} /></div>
          </MetricCard>
          <MetricCard label="Failed payments" value={pay.failedSum.toLocaleString()} deltaPct={pay.failedDelta} positiveIsGood={false} sub={compare === "none" ? "This window" : `vs ${pay.priorFailedSum} prior`}>
            <div className="px-3 pb-2"><AreaChart data={pay.failed} prior={priorOr(pay.priorFailed)} dates={dts} label="Failed" stroke={C.failed} height={200} /></div>
          </MetricCard>
          <MetricCard label="Recovery rate" value={`${pay.recoveryRate}%`} deltaPct={pay.recoveryRate - pay.priorRecoveryRate} deltaUnit="pt" sub="Auto-retry + dunning">
            <div className="px-3 pb-2"><AreaChart data={pay.recovered} prior={priorOr(pay.priorRecovered)} dates={dts} label="Recovered" stroke={C.recovered} height={200} /></div>
          </MetricCard>
        </div>
      </AnalyticsSection>

      {/* Sub-page nav */}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-ink/[0.08] pt-4 text-[11.5px]">
        <span className="text-ink/45">Deep dive:</span>
        <Link to="/admin/analytics/acquisition" search={{ range, compare, auto: autoRefresh }} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Acquisition →</Link>
        <Link to="/admin/analytics/funnel" search={{ range, compare, auto: autoRefresh }} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Funnel →</Link>
        <Link to="/admin/analytics/retention" search={{ range, compare, auto: autoRefresh }} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Retention →</Link>
        <Link to="/admin/analytics/finances" search={{ range, compare, auto: autoRefresh }} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-ink/70 hover:border-ink">Finances →</Link>
      </div>
      </div>
    </AdminShell>
  );
}

function churnReasons(patients: Array<{ status: string; cancelReason?: string }>) {
  const cancelled = patients.filter((p) => p.status === "cancelled");
  const counts: Record<string, number> = {};
  for (const p of cancelled) {
    const k = p.cancelReason ?? "Other";
    counts[k] = (counts[k] ?? 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const rows = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, n]) => ({ label, value: Math.round((n / total) * 100) }));
  if (rows.length === 0) {
    return [
      { label: "Side effects", value: 32 },
      { label: "Cost", value: 22 },
      { label: "Reached goal", value: 18 },
      { label: "Not effective", value: 14 },
      { label: "Other", value: 14 },
    ];
  }
  return rows;
}
