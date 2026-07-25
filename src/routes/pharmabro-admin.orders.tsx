import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { orders } = useActiveData();
    return (
      <div className="space-y-4">
        <PageHeader title="Orders" subtitle={`${orders.length} orders total`} />
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Order</th><th className="px-3 py-2">Program</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Stage</th><th className="px-3 py-2">Carrier</th><th className="px-3 py-2">Placed</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {orders.slice(0, 50).map((o) => (
                <tr key={o.id} className="hover:bg-ink/[0.02]"><td className="px-3 py-2 font-mono">{o.id}</td><td className="px-3 py-2">{o.program}</td><td className="px-3 py-2 font-semibold">${(o.amountCents / 100).toFixed(0)}</td><td className="px-3 py-2"><Pill tone={o.stage === "delivered" ? "success" : o.stage === "failed" ? "critical" : o.stage === "shipped" ? "info" : "warn"}>{o.stage.replace("_", " ")}</Pill></td><td className="px-3 py-2 text-ink/60">{o.carrier ?? "—"}</td><td className="px-3 py-2 text-ink/60">{new Date(o.createdMs).toLocaleDateString()}</td></tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-ink/50">No orders yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    );
  },
});
