import { pipelineByPharmacy } from "@/lib/admin/selectors";
import { useAdmin } from "@/lib/admin/store";
import { Card } from "./AdminShell";

export function PipelineStrip() {
  const rows = useAdmin(pipelineByPharmacy);
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Pharmacy pipeline</div>
          <div className="mt-0.5 text-[11px] text-ink/45">Fulfillment volume by partner</div>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r) => {
          const total = r.awaitingRx + r.preparing + r.shipped + r.delivered;
          const seg = (n: number) => `${(n / total) * 100}%`;
          return (
            <div key={r.pharmacy.id} className="grid grid-cols-[160px_1fr_60px] items-center gap-3">
              <div className="flex items-center gap-2 text-[12px]">
                <span className={`h-1.5 w-1.5 rounded-full ${r.pharmacy.apiStatus === "connected" ? "bg-check" : r.pharmacy.apiStatus === "degraded" ? "bg-honey" : "bg-ever"}`} />
                <span className="truncate font-medium text-ink">{r.pharmacy.name}</span>
              </div>
              <div className="flex h-4 overflow-hidden rounded bg-ink/[0.04]">
                <div style={{ width: seg(r.awaitingRx) }} className="bg-ink/25" />
                <div style={{ width: seg(r.preparing) }} className="bg-ink/60" />
                <div style={{ width: seg(r.shipped) }} className="bg-ink" />
                <div style={{ width: seg(r.delivered) }} className="bg-check" />
              </div>
              <div className="text-right text-[11.5px] tabular-nums text-ink/60">{total} orders</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10.5px] text-ink/45">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-ink/25" /> Awaiting Rx</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-ink/60" /> Preparing</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-ink" /> Shipped</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-check" /> Delivered</span>
      </div>
    </Card>
  );
}
