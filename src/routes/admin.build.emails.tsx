import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell, Card, SectionTitle, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";
import { toast } from "sonner";
import { RefreshCw, Mail, Play, Pause } from "lucide-react";

export const Route = createFileRoute("/admin/build/emails")({
  head: () => ({ meta: [{ title: "Email flows — PharmaBro" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: EmailBuilder,
});

function timeAgo(ts?: number): string {
  if (!ts) return "never";
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function EmailBuilder() {
  const flows = useAdmin((s) => s.build.emailFlows);
  const live = flows.filter((f) => f.status === "live").length;
  const totalEmails = flows.reduce((a, f) => a + f.emails, 0);

  return (
    <AdminShell title="Email flows">
      <SectionTitle subtitle="Pre-built Klaviyo flows. Sync pushes latest templates to your ESP."
        action={
          <button onClick={() => { adminActions.syncAllEmailFlows(); toast.success("Synced to Klaviyo", { description: `${flows.length} flows updated` }); }}
            className="flex items-center gap-1.5 rounded-md bg-ink px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-ink/90">
            <RefreshCw className="h-3 w-3" /> Sync all
          </button>
        }>Email flows</SectionTitle>

      <div className="mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Kpi label="Total flows" value={flows.length} />
        <Kpi label="Live" value={live} />
        <Kpi label="Total emails" value={totalEmails} />
        <Kpi label="Klaviyo synced" value={`${flows.filter((f) => f.klaviyoSynced).length}/${flows.length}`} />
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-ink/[0.06] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
              <th className="px-3 py-2 text-left font-medium">Flow</th>
              <th className="px-3 py-2 text-left font-medium">Emails</th>
              <th className="px-3 py-2 text-left font-medium">Klaviyo</th>
              <th className="px-3 py-2 text-left font-medium">Last edited</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flows.map((f, i) => (
              <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-ink/[0.04] tabular-nums hover:bg-ink/[0.015]">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-ink/45" />
                    <span className="font-semibold text-ink">{f.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-ink/80">{f.emails}</td>
                <td className="px-3 py-2.5">
                  {f.klaviyoSynced
                    ? <span className="text-[11px] text-check">Synced {timeAgo(f.klaviyoLastSyncAt)}</span>
                    : <span className="text-[11px] text-ever">Not synced</span>}
                </td>
                <td className="px-3 py-2.5 text-ink/60">{timeAgo(f.lastEditedAt)}</td>
                <td className="px-3 py-2.5">
                  <Pill tone={f.status === "live" ? "success" : f.status === "draft" ? "warn" : "neutral"}>{f.status}</Pill>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { adminActions.toggleEmailFlow(f.id); toast(f.status === "live" ? "Flow paused" : "Flow live"); }}
                      className="rounded-md border border-ink/[0.1] px-2 py-1 text-[10.5px] font-medium text-ink hover:border-ink/25">
                      {f.status === "live" ? <><Pause className="inline h-2.5 w-2.5" /> Pause</> : <><Play className="inline h-2.5 w-2.5" /> Enable</>}
                    </button>
                    <button onClick={() => { adminActions.syncEmailFlow(f.id); toast.success(`${f.name} synced`); }}
                      className="rounded-md border border-ink/[0.1] px-2 py-1 text-[10.5px] font-medium text-ink hover:border-ink/25">
                      <RefreshCw className="inline h-2.5 w-2.5" /> Sync
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-3.5">
      <div className="text-[11px] font-medium text-ink/55">{label}</div>
      <div className="mt-1 font-hero text-[22px] font-semibold tabular-nums text-ink">{value}</div>
    </Card>
  );
}
