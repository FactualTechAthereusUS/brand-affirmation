import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { MetricCard, AnalyticsSection } from "@/components/admin/analytics/MetricCard";
import { AreaChart } from "@/components/admin/analytics/AreaChart";
import { LineChartMini } from "@/components/admin/analytics/LineChartMini";
import { useAdmin } from "@/lib/admin/store";
import { makeWindow, daysForRange, formatDelta, type RangeKey, type CompareKey } from "@/lib/admin/analytics";
import { croMetrics, intakeScreenDropoff, type CroRate } from "@/lib/admin/cro";
import { downloadCsv } from "@/lib/admin/csv";

type FunnelSearch = { range: string; compare: string };

export const Route = createFileRoute("/admin/analytics/funnel")({
  validateSearch: (raw: Record<string, unknown>): FunnelSearch => ({
    range: typeof raw.range === "string" ? raw.range : "30d",
    compare: typeof raw.compare === "string" ? raw.compare : "prior",
  }),
  head: () => ({ meta: [
    { title: "Funnel & CRO — Blissley Admin" },
    { name: "description", content: "Presell, sales page, intake and checkout conversion rates with screen-level drop-off." },
  ] }),
  component: FunnelPage,
});

const RANGE_LABEL: Record<string, string> = { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", ytd: "Year to date" };

const C = {
  presell: "#8b5cf6",
  sales: "#2563eb",
  intake: "#0ea5e9",
  checkout: "#f59e0b",
  purchase: "#10b981",
  bad: "#ee7273",
};

function FunnelPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const range = (["7d", "30d", "90d", "ytd"].includes(search.range) ? search.range : "30d") as RangeKey;
  const compare = (["prior", "yoy", "none"].includes(search.compare) ? search.compare : "prior") as CompareKey;

  const cro = useAdmin((s) => croMetrics(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const drop = useAdmin((s) => intakeScreenDropoff(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));

  const r = cro.rates;
  const dts = cro.dates;
  const num = (v: number) => v.toLocaleString();
  const pct1 = (v: number) => `${v.toFixed(1)}%`;

  const exportRates = () => {
    const rows = Object.values(r).map((m) => ({
      Metric: m.label, Rate: `${m.value.toFixed(2)}%`, Prior: `${m.prior.toFixed(2)}%`,
      "Change (pt)": m.deltaPt.toFixed(2), Numerator: m.numerator, Denominator: m.denominator,
    }));
    downloadCsv("cro-rates", rows);
  };
  const exportScreens = () => {
    downloadCsv("intake-screen-dropoff", drop.screens.map((sc) => ({
      Order: sc.order, Screen: sc.name, Question: sc.question, Clinical: sc.locked ? "yes" : "no",
      Entered: sc.entered, Dropped: sc.exited, "Drop %": sc.dropPct.toFixed(2),
      "Reached %": sc.reachedPct.toFixed(2), "Median seconds": sc.medianSecs,
    })));
  };

  return (
    <AdminShell>
      <div className="-mx-4 -mt-4 min-h-[calc(100vh-56px)] bg-[#f6f6f7] px-4 pb-16 pt-4 lg:-mx-6 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="font-hero text-[24px] font-semibold text-ink">Funnel &amp; CRO</h1>
            <div className="mt-0.5 text-[11.5px] text-ink/55">
              Presell → sales page → intake → checkout → purchase. Every step rate, plus screen-level drop-off.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
            {(["7d", "30d", "90d", "ytd"] as RangeKey[]).map((k) => (
              <button
                key={k}
                onClick={() => navigate({ search: (p: FunnelSearch) => ({ ...p, range: k }) })}
                className={`rounded-lg border px-2.5 py-1.5 ${range === k ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink/70 hover:border-ink"}`}
              >
                {RANGE_LABEL[k]}
              </button>
            ))}
            <button onClick={exportRates} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink">Export rates · CSV</button>
          </div>
        </motion.div>

        {/* Headline */}
        <AnalyticsSection title="Headline conversion">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Overall conversion rate"
              value={pct1(r.overallConversionRate.value)}
              deltaPct={r.overallConversionRate.deltaPt}
              deltaUnit="pt"
              sub={`${num(cro.totals.purchases)} purchases from ${num(cro.totals.sessions)} sessions`}
            >
              <div className="px-3 pb-2">
                <AreaChart
                  data={r.overallConversionRate.series}
                  prior={compare === "none" ? undefined : r.overallConversionRate.priorSeries}
                  dates={dts} label="Conversion rate" priorLabel="Prior period"
                  formatValue={pct1} formatYTick={(v) => `${v.toFixed(1)}%`}
                  stroke={C.purchase} height={200}
                />
              </div>
            </MetricCard>
            <MetricCard
              label="Step volumes"
              value={num(cro.totals.purchases)}
              deltaPct={cro.volumeDeltas.purchases}
              sub="Purchases this window"
            >
              <div className="px-4 pb-3 pt-1">
                <StepWaterfall steps={cro.steps} />
              </div>
            </MetricCard>
            <MetricCard
              label="Biggest leak"
              value={biggestLeak(cro.steps).label}
              sub={`−${biggestLeak(cro.steps).dropPct.toFixed(1)}% of the previous step is lost here`}
            >
              <div className="space-y-2 px-4 pb-3 pt-1 text-[11.5px] text-ink/65">
                {drop.worst && (
                  <div className="rounded-lg border border-ever/25 bg-ever/[0.06] p-3">
                    <div className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-ever">Worst intake screen</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-ink">{drop.worst.order}. {drop.worst.name}</div>
                    <div className="mt-0.5">{drop.worst.dropPct.toFixed(1)}% of entrants abandon here · {num(drop.worst.exited)} people.</div>
                  </div>
                )}
                <div className="rounded-lg border border-ink/[0.08] bg-ink/[0.02] p-3">
                  <div className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink/50">Checkout recovery upside</div>
                  <div className="mt-0.5">
                    {num(cro.totals.checkoutStarts - cro.totals.purchases)} carts abandoned. Recovering 20% would add{" "}
                    {Math.round((cro.totals.checkoutStarts - cro.totals.purchases) * 0.2).toLocaleString()} orders.
                  </div>
                </div>
                <Link to="/admin/leads" className="inline-block rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-ink/70 hover:border-ink">
                  Work abandoned leads →
                </Link>
              </div>
            </MetricCard>
          </div>
        </AnalyticsSection>

        {/* Presell */}
        <AnalyticsSection title="Presell pages">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Presell visitors" value={num(cro.totals.presellViews)} deltaPct={cro.volumeDeltas.presellViews} sub="Advertorials & quiz bridges">
              <div className="px-3 pb-2">
                <AreaChart data={cro.cur.map((d) => d.presellViews)} prior={compare === "none" ? undefined : cro.pri.map((d) => d.presellViews)} dates={dts} label="Presell visitors" priorLabel="Prior period" formatValue={num} stroke={C.presell} height={180} />
              </div>
            </MetricCard>
            <RateCard rate={r.presellCtr} color={C.presell} dates={dts} compare={compare} />
            <MetricCard label="Presell share of traffic" value={pct1((cro.totals.presellViews / Math.max(1, cro.totals.sessions)) * 100)} sub="Sessions that land on a presell first">
              <div className="px-4 pb-3 pt-1 text-[11.5px] text-ink/65">
                {num(cro.totals.presellClicks)} of {num(cro.totals.presellViews)} presell readers continued to the sales page —
                {num(cro.totals.presellViews - cro.totals.presellClicks)} dropped before ever seeing an offer.
              </div>
            </MetricCard>
          </div>
        </AnalyticsSection>

        {/* Sales page */}
        <AnalyticsSection title="Sales page">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Sales page visitors" value={num(cro.totals.salesViews)} deltaPct={cro.volumeDeltas.salesViews} sub="Direct + presell click-throughs">
              <div className="px-3 pb-2">
                <AreaChart data={cro.cur.map((d) => d.salesViews)} prior={compare === "none" ? undefined : cro.pri.map((d) => d.salesViews)} dates={dts} label="Sales page visitors" priorLabel="Prior period" formatValue={num} stroke={C.sales} height={180} />
              </div>
            </MetricCard>
            <RateCard rate={r.salesClickRate} color={C.sales} dates={dts} compare={compare} />
            <RateCard rate={r.salesBounceRate} color={C.bad} dates={dts} compare={compare} />
          </div>
        </AnalyticsSection>

        {/* Intake */}
        <AnalyticsSection
          title="Intake form"
          action={<button onClick={exportScreens} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-[11px] text-ink/70 hover:border-ink">Export screen drop-off · CSV</button>}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <RateCard rate={r.intakeStartRate} color={C.intake} dates={dts} compare={compare} sub={`${num(cro.totals.intakeStarts)} starts`} />
            <RateCard rate={r.intakeCompletionRate} color={C.purchase} dates={dts} compare={compare} sub={`${num(cro.totals.intakeCompletions)} submitted`} />
            <RateCard rate={r.intakeAbandonRate} color={C.bad} dates={dts} compare={compare} sub={`${num(cro.totals.intakeStarts - cro.totals.intakeCompletions)} abandoned`} />
            <MetricCard label="Intake starts" value={num(cro.totals.intakeStarts)} deltaPct={cro.volumeDeltas.intakeStarts} sub="Reached screen 1">
              <div className="px-3 pb-2">
                <AreaChart data={cro.cur.map((d) => d.intakeStarts)} prior={compare === "none" ? undefined : cro.pri.map((d) => d.intakeStarts)} dates={dts} label="Intake starts" priorLabel="Prior period" formatValue={num} stroke={C.intake} height={160} />
              </div>
            </MetricCard>
          </div>

          {/* Screen-level drop-off */}
          <div className="mt-3 overflow-hidden rounded-xl border border-ink/[0.06] bg-white">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/[0.06] px-4 py-3">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Screen-by-screen drop-off</div>
                <div className="mt-0.5 text-[11.5px] text-ink/55">Where inside the quiz people quit — optimise the red rows first.</div>
              </div>
              <Link to="/admin/build/intake" className="rounded-lg border border-ink/12 px-2.5 py-1 text-[11px] text-ink/70 hover:border-ink">Edit intake →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-ink/[0.06] text-left text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
                    <th className="px-4 py-2 font-medium">#</th>
                    <th className="px-2 py-2 font-medium">Screen</th>
                    <th className="px-2 py-2 text-right font-medium">Entered</th>
                    <th className="px-2 py-2 text-right font-medium">Dropped</th>
                    <th className="px-2 py-2 font-medium">Drop rate</th>
                    <th className="px-2 py-2 text-right font-medium">Reached</th>
                    <th className="px-4 py-2 text-right font-medium">Median time</th>
                  </tr>
                </thead>
                <tbody>
                  {drop.screens.map((sc) => (
                    <tr key={sc.id} className={`border-b border-ink/[0.04] ${sc.worst ? "bg-ever/[0.05]" : ""}`}>
                      <td className="px-4 py-2 tabular-nums text-ink/45">{sc.order}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-ink">{sc.name}</span>
                          {sc.locked && <span className="rounded bg-ink/[0.06] px-1.5 py-0.5 text-[10px] text-ink/55">clinical</span>}
                          {sc.worst && <span className="rounded bg-ever/12 px-1.5 py-0.5 text-[10px] font-medium text-ever">biggest leak</span>}
                        </div>
                        <div className="mt-0.5 truncate text-[10.5px] text-ink/45">{sc.question}</div>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums text-ink/70">{num(sc.entered)}</td>
                      <td className="px-2 py-2 text-right tabular-nums text-ink/70">−{num(sc.exited)}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink/[0.05]">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, sc.dropPct * 4)}%`, background: sc.worst ? C.bad : "#0ea5e9" }} />
                          </div>
                          <span className={`tabular-nums ${sc.worst ? "font-semibold text-ever" : "text-ink/70"}`}>{sc.dropPct.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums text-ink/55">{sc.reachedPct.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right tabular-nums text-ink/55">{sc.medianSecs}s</td>
                    </tr>
                  ))}
                  {!drop.screens.length && (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-ink/45">No intake traffic in this window yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </AnalyticsSection>

        {/* Checkout */}
        <AnalyticsSection title="Checkout">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <RateCard rate={r.checkoutStartRate} color={C.checkout} dates={dts} compare={compare} sub={`${num(cro.totals.checkoutStarts)} started`} />
            <RateCard rate={r.checkoutCompletionRate} color={C.purchase} dates={dts} compare={compare} sub={`${num(cro.totals.purchases)} purchased`} />
            <RateCard rate={r.checkoutAbandonRate} color={C.bad} dates={dts} compare={compare} sub={`${num(cro.totals.checkoutStarts - cro.totals.purchases)} abandoned`} />
            <MetricCard label="Checkout starts" value={num(cro.totals.checkoutStarts)} deltaPct={cro.volumeDeltas.checkoutStarts} sub="Reached payment step">
              <div className="px-3 pb-2">
                <AreaChart data={cro.cur.map((d) => d.checkoutStarts)} prior={compare === "none" ? undefined : cro.pri.map((d) => d.checkoutStarts)} dates={dts} label="Checkout starts" priorLabel="Prior period" formatValue={num} stroke={C.checkout} height={160} />
              </div>
            </MetricCard>
          </div>
        </AnalyticsSection>

        {/* All rates table */}
        <AnalyticsSection title="All step rates">
          <div className="overflow-hidden rounded-xl border border-ink/[0.06] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-ink/[0.06] text-left text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
                    <th className="px-4 py-2 font-medium">Metric</th>
                    <th className="px-2 py-2 font-medium">Definition</th>
                    <th className="px-2 py-2 text-right font-medium">Rate</th>
                    <th className="px-2 py-2 text-right font-medium">Prior</th>
                    <th className="px-2 py-2 text-right font-medium">Change</th>
                    <th className="px-4 py-2 text-right font-medium">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(r).map((m) => {
                    const good = m.deltaPt === 0 ? "neutral" : (m.deltaPt > 0) === m.positiveIsGood ? "good" : "bad";
                    return (
                      <tr key={m.key} className="border-b border-ink/[0.04]">
                        <td className="px-4 py-2 font-medium text-ink">{m.label}</td>
                        <td className="px-2 py-2 text-ink/55">{m.hint}</td>
                        <td className="px-2 py-2 text-right tabular-nums font-semibold text-ink">{m.value.toFixed(2)}%</td>
                        <td className="px-2 py-2 text-right tabular-nums text-ink/55">{m.prior.toFixed(2)}%</td>
                        <td className={`px-2 py-2 text-right tabular-nums ${good === "good" ? "text-check" : good === "bad" ? "text-ever" : "text-ink/45"}`}>
                          {formatDelta(m.deltaPt, { unit: "pt" })}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-ink/55">{num(m.numerator)} / {num(m.denominator)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AnalyticsSection>
      </div>
    </AdminShell>
  );
}

function biggestLeak(steps: { label: string; dropPct: number }[]) {
  return steps.slice(1).reduce((worst, s) => (s.dropPct > worst.dropPct ? s : worst), steps[1] ?? { label: "—", dropPct: 0 });
}

function RateCard({
  rate, color, dates, compare, sub,
}: {
  rate: CroRate; color: string; dates: number[]; compare: CompareKey; sub?: string;
}) {
  return (
    <MetricCard
      label={rate.label}
      value={`${rate.value.toFixed(1)}%`}
      deltaPct={rate.deltaPt}
      deltaUnit="pt"
      positiveIsGood={rate.positiveIsGood}
      sub={sub ?? rate.hint}
    >
      <div className="px-3 pb-2">
        <AreaChart
          data={rate.series}
          prior={compare === "none" ? undefined : rate.priorSeries}
          dates={dates}
          label={rate.label}
          priorLabel="Prior period"
          formatValue={(v: number) => `${v.toFixed(1)}%`}
          formatYTick={(v: number) => `${v.toFixed(0)}%`}
          stroke={color}
          height={160}
        />
      </div>
    </MetricCard>
  );
}

function StepWaterfall({ steps }: { steps: { label: string; count: number; pct: number; dropPct: number }[] }) {
  const max = steps[0]?.count || 1;
  return (
    <div className="space-y-1.5">
      {steps.map((s, i) => (
        <div key={s.label}>
          <div className="flex items-baseline justify-between text-[11px]">
            <span className="text-ink/70">{s.label}</span>
            <span className="tabular-nums text-ink/50">
              {s.count.toLocaleString()} <span className="text-ink/30">· {s.pct.toFixed(1)}%</span>
              {i > 0 && <span className="ml-1.5 text-ever">−{s.dropPct.toFixed(1)}%</span>}
            </span>
          </div>
          <div className="mt-1 h-2 w-full rounded bg-ink/[0.04]">
            <div className="h-full rounded bg-ink" style={{ width: `${(s.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
