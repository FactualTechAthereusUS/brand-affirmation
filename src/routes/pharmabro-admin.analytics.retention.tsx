import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { cohortRetention, useAdmin } from "@/lib/admin/store";
import { mrrWaterfall } from "@/lib/admin/selectors";
import { MrrMovementBar } from "@/components/admin/MrrMovementBar";

export const Route = createFileRoute("/pharmabro-admin/analytics/retention")({
  head: () => ({ meta: [{ title: "Retention — Blissley Admin" }, { name: "description", content: "Cohort heatmap, churn reasons, and MRR movement." }] }),
  component: RetentionPage,
});

function RetentionPage() {
  const cohorts = cohortRetention();
  const wf = useAdmin(mrrWaterfall);

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Retention</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">6×6 cohort heatmap, churn reasons, and net MRR movement.</div>
      </div>

      <Card className="mb-4 p-4">
        <SectionTitle subtitle="Retention rate by month cohort">Cohort heatmap</SectionTitle>
        <div className="overflow-x-auto">
          <table className="min-w-full text-[11.5px]">
            <thead className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
              <tr>
                <th className="py-1.5 pr-3 text-left font-medium">Cohort</th>
                <th className="py-1.5 pr-3 text-right font-medium">Started</th>
                {["M0","M1","M2","M3","M4","M5"].map((m) => <th key={m} className="py-1.5 pr-3 text-center font-medium">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => (
                <tr key={c.month}>
                  <td className="py-1 pr-3 text-ink">{c.month}</td>
                  <td className="py-1 pr-3 text-right tabular-nums text-ink/60">{c.started}</td>
                  {c.values.map((v, i) => (
                    <td key={i} className="py-1 pr-3">
                      {v === null ? (
                        <div className="grid h-8 place-items-center rounded bg-ink/[0.02] text-[10px] text-ink/30">—</div>
                      ) : (
                        <div
                          className="grid h-8 place-items-center rounded text-[10.5px] font-semibold tabular-nums text-white"
                          style={{ background: `rgba(238,114,115,${Math.max(0.15, v / 100)})` }}
                          title={`${c.month} · M${i}: ${v}%`}
                        >
                          {v.toFixed(0)}%
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <MrrMovementBar items={wf} />
        <Card className="p-4">
          <SectionTitle subtitle="Top reasons cited in cancellations">Churn reasons</SectionTitle>
          <div className="space-y-2 text-[12px]">
            {[
              { label: "Side effects", pct: 32 },
              { label: "Cost", pct: 22 },
              { label: "Reached goal", pct: 18 },
              { label: "Not effective", pct: 14 },
              { label: "Other", pct: 14 },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <div className="w-28 text-ink/70">{r.label}</div>
                <div className="flex-1 rounded bg-ink/[0.04]"><div className="h-2.5 rounded bg-ever" style={{ width: `${r.pct}%` }} /></div>
                <div className="w-10 text-right tabular-nums text-ink/60">{r.pct}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
