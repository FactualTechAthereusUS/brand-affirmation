import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell, Card, SectionTitle, formatMoney } from "@/components/admin/AdminShell";
import { acquisitionMix, cohortRetention, revenueByProgram, trafficHeatmap, trafficOverTime } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const rev = revenueByProgram();
  const totalRev = rev.reduce((s, r) => s + r.revenue, 0);
  const mix = acquisitionMix();
  const traffic = trafficOverTime();
  const heatmap = trafficHeatmap();
  const cohorts = cohortRetention();
  const maxHM = Math.max(...heatmap.flat());
  const maxTraffic = Math.max(...traffic.flatMap((t) => [t.paid, t.organic, t.direct, t.referral]));

  return (
    <AdminShell title="Reports">
      {/* Revenue by program */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle action={<span className="text-[11px] font-semibold text-check">+14.2% MoM</span>}>Revenue by program</SectionTitle>
          <div className="mt-3 space-y-2.5">
            {rev.map((r, i) => {
              const pct = (r.revenue / totalRev) * 100;
              return (
                <div key={r.code} className="grid grid-cols-[180px_1fr_100px] items-center gap-3">
                  <div className="truncate text-[13px] font-medium text-ink/80">{r.label}</div>
                  <div className="relative h-7 overflow-hidden rounded-lg bg-ink/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.06 }}
                      className="h-full rounded-lg bg-ever" style={{ opacity: 0.35 + (rev.length - i) * 0.1 }} />
                    <div className="absolute inset-y-0 left-3 flex items-center text-[11.5px] font-semibold text-ink/80">{formatMoney(r.revenue)} · {r.patients} pt</div>
                  </div>
                  <div className="text-right text-[11.5px] font-semibold text-ink/70">{pct.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Acquisition mix donut-ish */}
        <Card className="p-5">
          <SectionTitle>Acquisition mix</SectionTitle>
          <div className="mt-3 space-y-2">
            {mix.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: m.color }} />
                <div className="flex-1 text-[13px] text-ink/80">{m.label}</div>
                <div className="w-14 text-right text-[13px] font-semibold text-ink">{m.value}%</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full">
            {mix.map((m) => <div key={m.label} style={{ width: `${m.value}%`, background: m.color }} />)}
          </div>
        </Card>
      </div>

      {/* Traffic over weeks */}
      <Card className="mt-4 p-5">
        <SectionTitle action={<span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40">Last 4 weeks</span>}>Traffic over time</SectionTitle>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {traffic.map((t, i) => (
            <div key={t.week}>
              <div className="flex h-40 items-end gap-1.5">
                {[
                  { key: "paid", color: "#ee7273", val: t.paid },
                  { key: "organic", color: "#2563eb", val: t.organic },
                  { key: "direct", color: "#10b981", val: t.direct },
                  { key: "referral", color: "#f59e0b", val: t.referral },
                ].map((b) => (
                  <motion.div key={b.key} initial={{ height: 0 }} animate={{ height: `${(b.val / maxTraffic) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.06 }}
                    className="flex-1 rounded-t-md" style={{ background: b.color }} />
                ))}
              </div>
              <div className="mt-2 text-center text-[11px] font-semibold text-ink/60">{t.week}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11.5px] text-ink/70">
          <Legend color="#ee7273" label="Paid" />
          <Legend color="#2563eb" label="Organic" />
          <Legend color="#10b981" label="Direct" />
          <Legend color="#f59e0b" label="Referral" />
        </div>
      </Card>

      {/* Traffic heatmap */}
      <Card className="mt-4 p-5">
        <SectionTitle>Signup timing · when traffic converts</SectionTitle>
        <div className="mt-4 overflow-x-auto">
          <div className="grid min-w-[520px] grid-cols-[60px_repeat(6,minmax(0,1fr))] gap-1.5">
            <div />
            {["12a", "4a", "8a", "12p", "4p", "8p"].map((h) => (
              <div key={h} className="text-center text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">{h}</div>
            ))}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, r) => (
              <RowFragment key={day} day={day} row={heatmap[r]} maxHM={maxHM} rIdx={r} />
            ))}
          </div>
        </div>
      </Card>

      {/* Cohort retention */}
      <Card className="mt-4 p-5">
        <SectionTitle action={<span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40">6-month cohorts</span>}>Cohort retention</SectionTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center text-[12px]">
            <thead>
              <tr>
                <th className="text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">Cohort</th>
                <th className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">Size</th>
                {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => <th key={m} className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => (
                <tr key={c.month}>
                  <td className="text-left text-[12px] font-semibold text-ink">{c.month}</td>
                  <td className="text-[12px] text-ink/60">{c.started}</td>
                  {c.values.map((v, i) => (
                    <td key={i} className="rounded-md p-2 font-semibold" style={{
                      background: v == null ? "transparent" : `color-mix(in oklab, #10b981 ${Math.round((v / 100) * 60) + 15}%, #ffffff)`,
                      color: v == null ? "transparent" : v > 60 ? "#fff" : "#171717",
                    }}>{v == null ? "—" : `${v.toFixed(0)}%`}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}</div>;
}

function RowFragment({ day, row, maxHM, rIdx }: { day: string; row: number[]; maxHM: number; rIdx: number }) {
  return (
    <>
      <div className="pr-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">{day}</div>
      {row.map((v, c) => {
        const intensity = v / maxHM;
        return (
          <div key={`${rIdx}-${c}`} className="aspect-square rounded-md" title={`${v} signups`} style={{
            background: `color-mix(in oklab, #ee7273 ${Math.round(intensity * 100)}%, #f1f5f9)`,
          }} />
        );
      })}
    </>
  );
}
