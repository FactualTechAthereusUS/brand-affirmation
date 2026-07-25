import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/pharmabro/BrandShell";
import { useActiveBrand, useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const brand = useActiveBrand();
    const data = useActiveData();
    const mrr = data.patients.filter((p) => p.status === "active").reduce((s, p) => s + p.mrrCents, 0);
    const revenue = data.payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amountCents, 0);
    const cards = [
      { label: "Active MRR", value: `$${(mrr / 100).toLocaleString()}` },
      { label: "Total revenue (30d)", value: `$${(revenue / 100).toLocaleString()}` },
      { label: "Active patients", value: data.patients.filter((p) => p.status === "active").length.toLocaleString() },
      { label: "AOV", value: data.payments.length ? `$${(revenue / 100 / data.payments.length).toFixed(0)}` : "—" },
      { label: "Refund rate", value: `${((data.payments.filter((p) => p.status === "refunded").length / Math.max(1, data.payments.length)) * 100).toFixed(1)}%` },
    ];
    return (
      <div className="space-y-4">
        <PageHeader title="Analytics overview" subtitle={`${brand.name} — trailing 30 days`} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <Card key={c.label} className="p-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/50">{c.label}</div>
              <div className="mt-1.5 text-[22px] font-bold text-ink">{c.value}</div>
            </Card>
          ))}
        </div>
        {data.patients.length === 0 && (
          <Card className="p-6 text-center">
            <div className="text-[14px] font-bold text-ink">No revenue yet</div>
            <p className="mt-1 text-[12.5px] text-ink/55">Publish your funnel to start acquiring patients.</p>
          </Card>
        )}
      </div>
    );
  },
});
