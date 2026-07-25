import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { useAdmin } from "@/lib/admin/store";
import { acquisitionSpendMix } from "@/lib/admin/selectors";

export const Route = createFileRoute("/pharmabro-admin/analytics/acquisition")({
  head: () => ({ meta: [{ title: "Acquisition — Blissley Admin" }, { name: "description", content: "Channel spend, CAC, ROAS, and attribution." }] }),
  component: AcquisitionPage,
});

function AcquisitionPage() {
  const campaigns = useAdmin((s) => s.campaigns);
  const mix = useAdmin(acquisitionSpendMix);
  const totalSpend = campaigns.reduce((a, c) => a + c.spend, 0);
  const totalLeads = campaigns.reduce((a, c) => a + c.leads, 0);
  const totalPurchases = campaigns.reduce((a, c) => a + c.purchases, 0);
  const cac = totalPurchases ? Math.round(totalSpend / totalPurchases) : 0;
  const roas = campaigns.reduce((a, c) => a + c.roas * c.spend, 0) / (totalSpend || 1);

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Acquisition</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">Spend efficiency, channel mix, and top campaigns.</div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        <KpiCard label="Spend" value={`$${totalSpend.toLocaleString()}`} sub="Last 30d" />
        <KpiCard label="CAC" value={`$${cac}`} tone={cac > 120 ? "warn" : "positive"} sub="Blended" />
        <KpiCard label="ROAS" value={`${roas.toFixed(1)}×`} tone="positive" />
        <KpiCard label="Leads" value={totalLeads.toLocaleString()} />
        <KpiCard label="Purchases" value={totalPurchases.toLocaleString()} tone="positive" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Channel mix</div>
          <div className="mt-3 space-y-2">
            {mix.map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <div className="w-20 text-[11.5px] text-ink/60">{m.label}</div>
                <div className="flex-1 rounded bg-ink/[0.04]"><div className="h-2.5 rounded" style={{ width: `${m.pct}%`, background: m.color }} /></div>
                <div className="w-24 text-right text-[11.5px] tabular-nums text-ink/60">${m.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <SectionTitle subtitle="Ordered by spend">Campaigns</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
                <tr className="border-b border-ink/[0.06]">
                  <th className="py-1.5 pr-3 text-left font-medium">Campaign</th>
                  <th className="py-1.5 pr-3 text-left font-medium">Channel</th>
                  <th className="py-1.5 pr-3 text-right font-medium">Spend</th>
                  <th className="py-1.5 pr-3 text-right font-medium">ROAS</th>
                  <th className="py-1.5 pr-3 text-right font-medium">CAC</th>
                  <th className="py-1.5 text-right font-medium">Purchases</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-ink/[0.04] last:border-0">
                    <td className="py-2 pr-3 text-ink">{c.name}</td>
                    <td className="py-2 pr-3 text-ink/60">{c.channel}</td>
                    <td className="py-2 pr-3 text-right text-ink">${c.spend.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-right text-check">{c.roas.toFixed(1)}×</td>
                    <td className="py-2 pr-3 text-right text-ink/70">${c.cac}</td>
                    <td className="py-2 text-right text-ink">{c.purchases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
