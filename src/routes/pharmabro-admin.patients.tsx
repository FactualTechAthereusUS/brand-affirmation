import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/patients")({
  head: () => ({ meta: [{ title: "Patients — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { patients } = useActiveData();
    return (
      <div className="space-y-4">
        <PageHeader title="Patients" subtitle={`${patients.length} patients across your brand`} />
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">State</th><th className="px-3 py-2">Plan</th><th className="px-3 py-2">MRR</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Joined</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {patients.slice(0, 50).map((p) => (
                <tr key={p.id} className="hover:bg-ink/[0.02]"><td className="px-3 py-2 font-semibold">{p.name}</td><td className="px-3 py-2">{p.state}</td><td className="px-3 py-2">{p.plan}</td><td className="px-3 py-2 font-semibold">${(p.mrrCents / 100).toFixed(0)}</td><td className="px-3 py-2"><Pill tone={p.status === "active" ? "success" : p.status === "paused" ? "warn" : "critical"}>{p.status}</Pill></td><td className="px-3 py-2 text-ink/60">{new Date(p.joinedMs).toLocaleDateString()}</td></tr>
              ))}
              {patients.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-ink/50">No patients yet. Publish your funnel to start acquiring.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    );
  },
});
