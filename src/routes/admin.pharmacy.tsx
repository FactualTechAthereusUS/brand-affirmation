import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, SectionTitle, Card, Pill } from "@/components/admin/AdminShell";
import { PharmacyHealthCard } from "@/components/admin/PharmacyHealthCard";
import { PipelineStrip } from "@/components/admin/PipelineStrip";
import { useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy — Blissley Admin" }, { name: "description", content: "Fulfillment health across South End, Wells Rx, EpiqScripts, Strive, and Truemeds." }] }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const pharmacies = useAdmin((s) => s.pharmacies);
  const orders = useAdmin((s) => s.orders);

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Pharmacy</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">API health, queue depth, and prep time per partner.</div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pharmacies.map((p) => <PharmacyHealthCard key={p.id} p={p} />)}
      </div>

      <SectionTitle subtitle="Volume rollup across pharmacies">Pipeline</SectionTitle>
      <div className="mb-5"><PipelineStrip /></div>

      <SectionTitle subtitle="Latest fulfillment activity">Orders</SectionTitle>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
              <tr className="border-b border-ink/[0.06]">
                <th className="px-4 py-2 text-left font-medium">Order</th>
                <th className="px-4 py-2 text-left font-medium">Patient</th>
                <th className="px-4 py-2 text-left font-medium">Program</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Created</th>
                <th className="px-4 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {orders.slice(0, 12).map((o) => (
                <tr key={o.id} className="border-b border-ink/[0.04] last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-2 text-ink/70">{o.id}</td>
                  <td className="px-4 py-2 text-ink">{o.patientName}</td>
                  <td className="px-4 py-2 text-ink/60">{o.program}</td>
                  <td className="px-4 py-2"><Pill tone={o.status === "delivered" ? "success" : o.status === "exception" ? "critical" : "info"}>{o.status}</Pill></td>
                  <td className="px-4 py-2 text-ink/60">{o.createdAt}</td>
                  <td className="px-4 py-2 text-right text-ink">${o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
