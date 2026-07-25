import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell, Card, SectionTitle, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";
import { toast } from "sonner";
import { ExternalLink, Rocket } from "lucide-react";

export const Route = createFileRoute("/admin/build/pages")({
  head: () => ({ meta: [{ title: "Pages — PharmaBro" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PagesBuilder,
});

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function PagesBuilder() {
  const pages = useAdmin((s) => s.build.pages);
  return (
    <AdminShell title="Pages">
      <SectionTitle subtitle="Marketing and portal pages in your funnel. Publish or preview any page.">Pages</SectionTitle>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-hero text-[15px] font-semibold text-ink">{p.name}</div>
                  <a href={p.url} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-ink/50 hover:text-ink">
                    {p.url} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <Pill tone={p.status === "live" ? "success" : "warn"}>{p.status}</Pill>
              </div>
              <div className="mt-3 text-[11px] text-ink/50">Last published {timeAgo(p.lastPublishedAt)}</div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => { adminActions.publishBuildPage(p.id); toast.success(`${p.name} published`); }}
                  className="flex items-center gap-1.5 rounded-md bg-ink px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-ink/90">
                  <Rocket className="h-3 w-3" /> Publish
                </button>
                <a href={p.url} target="_blank" rel="noreferrer"
                  className="rounded-md border border-ink/[0.1] px-2.5 py-1.5 text-[11.5px] font-medium text-ink hover:border-ink/25">
                  Preview
                </a>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </AdminShell>
  );
}
