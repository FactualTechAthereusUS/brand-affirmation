import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, Circle, Mail, RefreshCw, ExternalLink, Pause, Play } from "lucide-react";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/build/emails")({
  head: () => ({ meta: [{ title: "Email flows — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: EmailFlowsPage,
});

function EmailFlowsPage() {
  const { emailFlows } = useActiveData();
  const liveCount = emailFlows.filter((f) => f.status === "live").length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Email flows"
        subtitle="Every automated email your patients receive. Synced to your Klaviyo account."
        action={
          <div className="flex gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11.5px] font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> {liveCount} live</span>
            <BrandButton onClick={() => toast.success("Syncing all flows to Klaviyo...")}><RefreshCw className="h-3.5 w-3.5" /> Sync all to Klaviyo</BrandButton>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
            <tr>
              <th className="px-3 py-2">Flow</th>
              <th className="px-3 py-2">Emails</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 hidden lg:table-cell">Klaviyo sync</th>
              <th className="px-3 py-2 hidden md:table-cell">Last edited</th>
              <th className="px-3 py-2 w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {emailFlows.map((f) => (
              <tr key={f.id} className="hover:bg-ink/[0.02]">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-ink/40" />
                    <div>
                      <div className="font-semibold text-ink">{f.name}</div>
                      <div className="text-[10.5px] text-ink/50 truncate max-w-[420px]">Trigger: {f.trigger}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-ink/70">{f.emails.length}</td>
                <td className="px-3 py-2.5">
                  <Pill tone={f.status === "live" ? "success" : f.status === "paused" ? "warn" : "neutral"}>{f.status}</Pill>
                </td>
                <td className="px-3 py-2.5 hidden lg:table-cell">
                  {f.klaviyoSynced ? (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Synced {f.lastSyncMs ? Math.floor((Date.now() - f.lastSyncMs) / 60000) : 0}m ago</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-amber-700"><Circle className="h-3 w-3" /> Not synced</span>
                  )}
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell text-ink/60">{new Date(f.lastEditedMs).toLocaleDateString()}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="inline-flex gap-1">
                    <Link to="/pharmabro-admin/build/emails/$flowId" params={{ flowId: f.id }}
                      className="rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-ink/30">
                      Edit
                    </Link>
                    <button onClick={() => { pharmabroActions.toggleEmailFlow(f.id); toast(`Flow ${f.status === "live" ? "paused" : "activated"}`); }}
                      className="rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-ink/30"
                      title={f.status === "live" ? "Pause" : "Activate"}
                    >
                      {f.status === "live" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13.5px] font-semibold text-ink">Klaviyo connection</div>
            <div className="text-[11.5px] text-ink/55">All flows sync to your Klaviyo account.</div>
          </div>
          <a href="https://klaviyo.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ink/70">
            View in Klaviyo <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Card>
    </div>
  );
}
