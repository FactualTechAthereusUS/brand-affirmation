import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { useCallback, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { MetricCard, AnalyticsSection } from "@/components/admin/analytics/MetricCard";
import { AreaChart } from "@/components/admin/analytics/AreaChart";
import { BarChart } from "@/components/admin/analytics/BarChart";
import { FunnelFlow } from "@/components/admin/analytics/FunnelFlow";
import { AnalyticsToolbar, type AnalyticsCardKey } from "@/components/admin/analytics/AnalyticsToolbar";
import { Button } from "@/components/ui/button";
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
    { property: "og:title", content: "Funnel & CRO — Blissley Admin" },
    { property: "og:description", content: "Presell, sales page, intake and checkout conversion rates with screen-level drop-off." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: FunnelPage,
});

const RANGE_LABEL: Record<string, string> = { "7d": "7 days", "30d": "30 days", "90d": "90 days", ytd: "Year to date" };
const COMPARE_LABEL: Record<string, string> = { prior: "vs prior period", yoy: "vs last year", none: "No comparison" };

const C = {
  presell: "#8b5cf6",
  sales: "#2563eb",
  intake: "#0ea5e9",
  checkout: "#f59e0b",
  purchase: "#10b981",
  bad: "#ee7273",
};

const FUNNEL_COLORS = ["#4f46e5", "#4f46e5", "#2563eb", "#0ea5e9", "#06b6d4", "#14b8a6", "#10b981"];

function FunnelPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const range = (["7d", "30d", "90d", "ytd"].includes(search.range) ? search.range : "30d") as RangeKey;
  const compare = (["prior", "yoy", "none"].includes(search.compare) ? search.compare : "prior") as CompareKey;
  const [hidden, setHidden] = useState<AnalyticsCardKey[]>([]);
  const [target, setTarget] = useState(5);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const refresh = useCallback(() => setRefreshedAt(new Date()), []);
  const visible = (key: AnalyticsCardKey) => !hidden.includes(key);

  const cro = useAdmin((s) => croMetrics(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));
  const drop = useAdmin((s) => intakeScreenDropoff(s, makeWindow(s, daysForRange(range, s.funnelDays.length), compare)));

  const r = cro.rates;
  const dts = cro.dates;
  const num = (v: number) => Math.round(v).toLocaleString();
  const pct1 = (v: number) => `${v.toFixed(1)}%`;
  const cmp = compare === "none" ? undefined : true;

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

  const leak = biggestLeak(cro.steps);
  const abandonedCarts = cro.totals.checkoutStarts - cro.totals.purchases;

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
            <Button variant="outline" size="sm" onClick={exportRates} className="h-8 px-2.5 text-[11.5px]">
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} /> Export
            </Button>
          </div>
        </motion.div>

        <AnalyticsToolbar
          range={range}
          compare={compare}
          hidden={hidden}
          target={target}
          refreshedAt={refreshedAt}
          onRange={(value) => navigate({ search: (p: FunnelSearch) => ({ ...p, range: value }) })}
          onCompare={(value) => navigate({ search: (p: FunnelSearch) => ({ ...p, compare: value }) })}
          onHidden={setHidden}
          onTarget={setTarget}
          onRefresh={refresh}
        />

        {/* Hero: conversion + funnel */}
        <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {visible("conversion") && <div className={`rounded-xl border border-ink/[0.06] bg-white ${visible("funnel") ? "lg:col-span-7" : "lg:col-span-12"}`} role="region" aria-label="Overall conversion rate metric card">
            <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Overall conversion rate</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <div className="font-hero text-[38px] font-semibold leading-none tabular-nums text-ink">
                    {pct1(r.overallConversionRate.value)}
                  </div>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${r.overallConversionRate.deltaPt >= 0 ? "bg-check/10 text-check" : "bg-ever/8 text-ever"}`}>
                    {formatDelta(r.overallConversionRate.deltaPt, { unit: "pt" })}
                  </span>
                </div>
                <div className="mt-1 text-[11.5px] text-ink/50">
                  {num(cro.totals.purchases)} purchases from {num(cro.totals.sessions)} sessions
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10.5px] text-ink/50">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink/[0.06]"><div className="h-full rounded-full bg-check" style={{ width: `${Math.min(100, (r.overallConversionRate.value / target) * 100)}%` }} /></div>
                  {r.overallConversionRate.value >= target ? "Target reached" : `${(target - r.overallConversionRate.value).toFixed(1)}pt to ${target.toFixed(1)}% target`}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-right">
                {[
                  { k: "Sessions", v: num(cro.totals.sessions) },
                  { k: "Checkouts", v: num(cro.totals.checkoutStarts) },
                  { k: "Purchases", v: num(cro.totals.purchases) },
                ].map((x) => (
                  <div key={x.k}>
                    <div className="text-[10px] uppercase tracking-[0.08em] text-ink/45">{x.k}</div>
                    <div className="font-hero text-[15px] font-semibold tabular-nums text-ink">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3 pb-3 pt-2">
              <AreaChart
                data={r.overallConversionRate.series}
                prior={cmp ? r.overallConversionRate.priorSeries : undefined}
                dates={dts} label="Conversion rate" priorLabel={COMPARE_LABEL[compare]}
                formatValue={(v) => `${v.toFixed(2)}%`} formatYTick={(v) => `${v.toFixed(2)}%`}
                stroke={C.purchase} height={230}
              />
            </div>
          </div>}

          {visible("funnel") && <div className={`rounded-xl border border-ink/[0.06] bg-white ${visible("conversion") ? "lg:col-span-5" : "lg:col-span-12"}`} role="region" aria-label="Funnel flow metric card">
            <div className="flex items-baseline justify-between px-4 pt-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Funnel flow</div>
                <div className="mt-0.5 text-[11.5px] text-ink/50">Hover any step for detail</div>
              </div>
              <span className="rounded bg-ever/8 px-1.5 py-0.5 text-[10.5px] font-medium text-ever">
                Leak: {leak.label}
              </span>
            </div>
            <div className="px-3 pb-4 pt-3">
              <FunnelFlow steps={cro.steps} colors={FUNNEL_COLORS} height={306} />
            </div>
          </div>}
        </div>

        {/* Opportunity strip */}
        {visible("opportunities") && <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <OppCard
            title="Biggest leak"
            value={leak.label}
            body={`−${leak.dropPct.toFixed(1)}% of the previous step is lost here.`}
            tone="bad"
          />
          <OppCard
            title="Worst intake screen"
            value={drop.worst ? `${drop.worst.order}. ${drop.worst.name}` : "—"}
            body={drop.worst
              ? `${drop.worst.dropPct.toFixed(1)}% of entrants abandon here · ${num(drop.worst.exited)} people.`
              : "No intake traffic in this window."}
            tone="bad"
            to="/admin/build/intake"
            cta="Edit intake"
          />
          <OppCard
            title="Checkout recovery upside"
            value={`${num(abandonedCarts)} carts`}
            body={`Recovering 20% adds ~${num(abandonedCarts * 0.2)} orders this window.`}
            tone="neutral"
            to="/admin/leads"
            cta="Work abandoned leads"
          />
        </div>}

        {/* Presell */}
        {visible("presell") && <AnalyticsSection title="Presell pages">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Presell visitors" value={num(cro.totals.presellViews)} deltaPct={cro.volumeDeltas.presellViews} sub="Advertorials & quiz bridges">
              <div className="px-3 pb-2">
                <BarChart data={cro.cur.map((d) => d.presellViews)} prior={cmp ? cro.pri.map((d) => d.presellViews) : undefined} dates={dts} label="Presell visitors" priorLabel={COMPARE_LABEL[compare]} color={C.presell} height={170} />
              </div>
            </MetricCard>
            <RateCard rate={r.presellCtr} color={C.presell} dates={dts} compare={compare} />
            <MetricCard label="Presell share of traffic" value={pct1((cro.totals.presellViews / Math.max(1, cro.totals.sessions)) * 100)} sub="Sessions that land on a presell first">
              <div className="px-4 pb-3 pt-1 text-[11.5px] leading-relaxed text-ink/65">
                {num(cro.totals.presellClicks)} of {num(cro.totals.presellViews)} presell readers continued to the sales page —{" "}
                {num(cro.totals.presellViews - cro.totals.presellClicks)} dropped before ever seeing an offer.
              </div>
            </MetricCard>
          </div>
        </AnalyticsSection>}

        {/* Sales page */}
        {visible("sales") && <AnalyticsSection title="Sales page">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Sales page visitors" value={num(cro.totals.salesViews)} deltaPct={cro.volumeDeltas.salesViews} sub="Direct + presell click-throughs">
              <div className="px-3 pb-2">
                <BarChart data={cro.cur.map((d) => d.salesViews)} prior={cmp ? cro.pri.map((d) => d.salesViews) : undefined} dates={dts} label="Sales page visitors" priorLabel={COMPARE_LABEL[compare]} color={C.sales} height={170} />
              </div>
            </MetricCard>
            <RateCard rate={r.salesClickRate} color={C.sales} dates={dts} compare={compare} />
            <RateCard rate={r.salesBounceRate} color={C.bad} dates={dts} compare={compare} />
          </div>
        </AnalyticsSection>}

        {/* Intake */}
        {visible("intake") && <AnalyticsSection
          title="Intake form"
          action={<button onClick={exportScreens} className="rounded-lg border border-ink/12 bg-white px-2.5 py-1 text-[11px] text-ink/70 hover:border-ink">Export screen drop-off · CSV</button>}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <RateCard rate={r.intakeStartRate} color={C.intake} dates={dts} compare={compare} sub={`${num(cro.totals.intakeStarts)} starts`} />
            <RateCard rate={r.intakeCompletionRate} color={C.purchase} dates={dts} compare={compare} sub={`${num(cro.totals.intakeCompletions)} submitted`} />
            <RateCard rate={r.intakeAbandonRate} color={C.bad} dates={dts} compare={compare} sub={`${num(cro.totals.intakeStarts - cro.totals.intakeCompletions)} abandoned`} />
            <MetricCard label="Intake starts" value={num(cro.totals.intakeStarts)} deltaPct={cro.volumeDeltas.intakeStarts} sub="Reached screen 1">
              <div className="px-3 pb-2">
                <BarChart data={cro.cur.map((d) => d.intakeStarts)} prior={cmp ? cro.pri.map((d) => d.intakeStarts) : undefined} dates={dts} label="Intake starts" priorLabel={COMPARE_LABEL[compare]} color={C.intake} height={158} />
              </div>
            </MetricCard>
          </div>

          {/* Screen-level drop-off */}
          <div className="mt-3 overflow-hidden rounded-xl border border-ink/[0.06] bg-white">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/[0.06] px-4 py-3">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Screen-by-screen drop-off</div>
                <div className="mt-0.5 text-[11.5px] text-ink/55">Where inside the quiz people quit — optimise the flagged rows first.</div>
              </div>
              <Link to="/admin/build/intake" className="rounded-lg border border-ink/12 px-2.5 py-1 text-[11px] text-ink/70 hover:border-ink">Edit intake →</Link>
            </div>

            {/* Retention curve across screens */}
            {drop.screens.length > 0 && (
              <div className="border-b border-ink/[0.06] px-4 py-3">
                <div className="flex items-end gap-[3px]" style={{ height: 92 }}>
                  {drop.screens.map((sc) => (
                    <div key={`bar-${sc.id}`} className="group relative flex-1">
                      <div
                        className="w-full rounded-t bg-marine/70 transition-colors group-hover:bg-marine"
                        style={{ height: Math.max(3, (sc.reachedPct / 100) * 92), background: sc.worst ? C.bad : undefined }}
                      />
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden w-[176px] -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-white shadow-lg group-hover:block">
                        <div className="text-[10px] font-semibold">{sc.order}. {sc.name}</div>
                        <div className="mt-0.5 text-[10px] text-white/60">Reached {sc.reachedPct.toFixed(1)}% · dropped {sc.dropPct.toFixed(1)}%</div>
                        <div className="text-[10px] text-white/60">{num(sc.entered)} entered · {num(sc.exited)} left</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-ink/45">
                  <span>Screen 1 · {num(drop.starts)} started</span>
                  <span>Submitted · {num(drop.completions)}</span>
                </div>
              </div>
            )}

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
                    <tr key={sc.id} className={`border-b border-ink/[0.04] transition-colors hover:bg-ink/[0.02] ${sc.worst ? "bg-ever/[0.05]" : ""}`}>
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
        </AnalyticsSection>}

        {/* Checkout */}
        {visible("checkout") && <AnalyticsSection title="Checkout">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <RateCard rate={r.checkoutStartRate} color={C.checkout} dates={dts} compare={compare} sub={`${num(cro.totals.checkoutStarts)} started`} />
            <RateCard rate={r.checkoutCompletionRate} color={C.purchase} dates={dts} compare={compare} sub={`${num(cro.totals.purchases)} purchased`} />
            <RateCard rate={r.checkoutAbandonRate} color={C.bad} dates={dts} compare={compare} sub={`${num(abandonedCarts)} abandoned`} />
            <MetricCard label="Checkout starts" value={num(cro.totals.checkoutStarts)} deltaPct={cro.volumeDeltas.checkoutStarts} sub="Reached payment step">
              <div className="px-3 pb-2">
                <BarChart data={cro.cur.map((d) => d.checkoutStarts)} prior={cmp ? cro.pri.map((d) => d.checkoutStarts) : undefined} dates={dts} label="Checkout starts" priorLabel={COMPARE_LABEL[compare]} color={C.checkout} height={158} />
              </div>
            </MetricCard>
          </div>
        </AnalyticsSection>}

        {/* All rates table */}
        {visible("rates") && <AnalyticsSection title="All step rates">
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
                    const good = Math.abs(m.deltaPt) < 0.05 ? "neutral" : (m.deltaPt > 0) === m.positiveIsGood ? "good" : "bad";
                    return (
                      <tr key={m.key} className="border-b border-ink/[0.04] transition-colors hover:bg-ink/[0.02]">
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
        </AnalyticsSection>}
      </div>
    </AdminShell>
  );
}

function biggestLeak(steps: { label: string; dropPct: number }[]) {
  return steps.slice(1).reduce((worst, s) => (s.dropPct > worst.dropPct ? s : worst), steps[1] ?? { label: "—", dropPct: 0 });
}

function OppCard({
  title, value, body, tone, to, cta,
}: {
  title: string; value: string; body: string; tone: "bad" | "neutral"; to?: string; cta?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-ink/[0.06] bg-white p-4"
    >
      <div className={`text-[10.5px] font-medium uppercase tracking-[0.08em] ${tone === "bad" ? "text-ever" : "text-ink/50"}`}>{title}</div>
      <div className="mt-1 font-hero text-[16px] font-semibold text-ink">{value}</div>
      <div className="mt-1 text-[11.5px] leading-relaxed text-ink/60">{body}</div>
      {to && cta && (
        <Link to={to} className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-marine hover:underline">
          {cta} <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      )}
    </motion.div>
  );
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
          priorLabel={COMPARE_LABEL[compare]}
          formatValue={(v: number) => `${v.toFixed(2)}%`}
          formatYTick={(v: number) => `${v.toFixed(1)}%`}
          stroke={color}
          height={158}
          legend={false}
        />
      </div>
    </MetricCard>
  );
}
