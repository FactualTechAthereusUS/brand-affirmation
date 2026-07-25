import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { payments, patients } = useActiveData();
    const name = (id: string) => patients.find((p) => p.id === id)?.name ?? id;
    return (
      <div className="space-y-4">
        <PageHeader title="Payments" subtitle={`${payments.length} charges`} />
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Charge</th><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">When</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {payments.slice(0, 60).map((p) => (
                <tr key={p.id}><td className="px-3 py-2 font-mono">{p.id}</td><td className="px-3 py-2">{name(p.patientId)}</td><td className="px-3 py-2 font-semibold">${(p.amountCents / 100).toFixed(0)}</td><td className="px-3 py-2"><Pill tone={p.status === "succeeded" ? "success" : p.status === "failed" ? "critical" : "warn"}>{p.status}</Pill></td><td className="px-3 py-2 text-ink/60">{new Date(p.createdMs).toLocaleDateString()}</td></tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-ink/50">No payments yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    );
  },
});
