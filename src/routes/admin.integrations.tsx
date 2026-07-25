import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type Integration } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Blissley Admin" }, { name: "description", content: "Stripe, LifeFile, DrTelx, pharmacies, and analytics connections." }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const integrations = useAdmin((s) => s.integrations);
  const grouped: Record<string, Integration[]> = {};
  for (const i of integrations) (grouped[i.category] ??= []).push(i);

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Integrations</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">Connected services grouped by criticality.</div>
      </div>

      <div className="space-y-5">
        {(["Critical","Clinical","Analytics","Banking"] as const).map((cat) => (
          <div key={cat}>
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{cat}</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(grouped[cat] ?? []).map((i) => (
                <Card key={i.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-semibold text-ink">{i.name}</div>
                      <div className="mt-0.5 text-[11px] text-ink/50">Last sync {Math.floor((Date.now() - i.lastSync) / 60000)}m ago</div>
                      {i.lastError && <div className="mt-1 text-[11px] text-ever">Error: {i.lastError}</div>}
                    </div>
                    <Pill tone={i.status === "connected" ? "success" : i.status === "degraded" ? "warn" : "critical"}>{i.status}</Pill>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md border border-ink/12 px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:border-ink hover:text-ink">Configure</button>
                    <button onClick={() => adminActions.toggleIntegration(i.id)}
                      className="rounded-md border border-ink/12 px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:border-ink hover:text-ink">Test</button>
                    <button className="rounded-md border border-ink/12 px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:border-ink hover:text-ink">Logs</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
