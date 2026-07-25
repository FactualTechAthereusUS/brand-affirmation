import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/pharmabro/BrandShell";
import { useActiveBrand, useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/live")({
  head: () => ({ meta: [{ title: "Live view — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const brand = useActiveBrand();
    const { orders, conversations } = useActiveData();
    return (
      <div className="space-y-4">
        <PageHeader title="Live view" subtitle="Real-time activity across your brand" />
        <div className="grid gap-3 lg:grid-cols-3">
          <Card className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Visitors online</div>
            <div className="mt-1.5 text-[28px] font-bold text-ink">{Math.max(4, orders.length * 2)}</div>
            <div className="text-[11px] text-ink/50">Peak today: {Math.max(12, orders.length * 3)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Checkouts in progress</div>
            <div className="mt-1.5 text-[28px] font-bold text-ink">{Math.max(2, Math.floor(orders.length / 4))}</div>
          </Card>
          <Card className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Unread messages</div>
            <div className="mt-1.5 text-[28px] font-bold text-ink">{conversations.reduce((s, c) => s + c.unread, 0)}</div>
          </Card>
        </div>
        <Card className="p-6">
          <div className="text-[13.5px] font-bold text-ink">Live activity feed</div>
          <p className="text-[12px] text-ink/55">Full globe/map view mirrors the Blissley Live experience — coming to your brand next.</p>
          <div className="mt-4 h-64 rounded-xl" style={{ background: `linear-gradient(135deg, ${brand.theme.primary}22, ${brand.theme.accent}22)` }} />
        </Card>
      </div>
    );
  },
});
