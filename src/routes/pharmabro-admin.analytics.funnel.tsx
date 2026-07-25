import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { FunnelWaterfall } from "@/components/admin/FunnelWaterfall";
import { funnelData } from "@/lib/admin/store";

export const Route = createFileRoute("/pharmabro-admin/analytics/funnel")({
  head: () => ({ meta: [{ title: "Funnel — Blissley Admin" }, { name: "description", content: "Session-to-shipped conversion funnel with drop-off deltas." }] }),
  component: FunnelPage,
});

function FunnelPage() {
  const funnel = funnelData();
  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Funnel</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">Session → Intake → Approved → Paid → Shipped → Refill.</div>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
        <FunnelWaterfall steps={funnel} />
        <Card className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Biggest drop-off</div>
          <div className="mt-2 font-hero text-[22px] font-semibold text-ever">Traffic → Intake started</div>
          <div className="mt-0.5 text-[12px] text-ink/60">63.0% of sessions bounce before starting the quiz. Focus experiments on the landing hero and social proof.</div>
          <div className="mt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Runner-up</div>
          <div className="mt-2 font-hero text-[22px] font-semibold text-honey">Approved → Rx sent</div>
          <div className="mt-0.5 text-[12px] text-ink/60">4.8% of approved cases stall in the pharmacy handoff — investigate LifeFile sync latency.</div>
        </Card>
      </div>
    </AdminShell>
  );
}
