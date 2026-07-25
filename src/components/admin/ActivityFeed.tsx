import { useAdmin } from "@/lib/admin/store";
import { Card } from "./AdminShell";

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function ActivityFeed({ limit = 8, title = "Activity" }: { limit?: number; title?: string }) {
  const activity = useAdmin((s) => s.activity);
  const items = activity.slice(0, limit);
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-ink/[0.06] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">
        {title}
      </div>
      <div className="divide-y divide-ink/[0.05]">
        {items.map((a) => (
          <div key={a.id} className="flex items-start gap-3 px-4 py-2.5">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${a.tone === "critical" ? "bg-ever" : a.tone === "warn" ? "bg-honey" : a.tone === "success" ? "bg-check" : "bg-ink/40"}`} />
            <div className="min-w-0 flex-1 text-[12.5px] text-ink/80">{a.text}</div>
            <div className="text-[10.5px] text-ink/40">{timeAgo(a.ts)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
