import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, Clock, RefreshCw, Sparkles, Zap } from "lucide-react";
import { AdminShell, Card, SectionTitle, StatusPill, formatMoney, timeAgo } from "@/components/admin/AdminShell";
import { adminActions, pipelineCounts, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/command")({
  head: () => ({ meta: [{ title: "Command center — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: CommandCenter,
});

function CommandCenter() {
  const state = useAdmin((s) => s);
  const pipe = pipelineCounts(state);
  const openTasks = state.tasks.filter((t) => t.status !== "done");
  const criticalAlerts = state.alerts.filter((a) => a.severity === "critical");

  return (
    <AdminShell title="Command center">
      {/* Live status bar */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-ink/8 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-check opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-check" />
          </span>
          <span className="text-[12px] font-semibold text-ink">All systems operational</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-ink/50">Live · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>

      {/* Pipeline waterfall */}
      <Card className="mb-6 p-5">
        <SectionTitle action={<Link to="/admin/orders" className="text-[11px] font-semibold text-ever">Orders →</Link>}>Live pipeline</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { key: "inReview", label: "In review", value: pipe.inReview, tone: "warn" as const, icon: Clock },
            { key: "approved", label: "Approved", value: pipe.approved, tone: "info" as const, icon: CheckCircle2 },
            { key: "atPharmacy", label: "At pharmacy", value: pipe.atPharmacy, tone: "info" as const, icon: RefreshCw },
            { key: "shipped", label: "Shipped", value: pipe.shipped, tone: "success" as const, icon: Zap },
            { key: "delivered", label: "Delivered", value: pipe.delivered, tone: "success" as const, icon: CheckCircle2 },
          ].map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-ink/8 bg-[#faf9f6] p-4">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{s.label}</div>
                <s.icon className={`h-4 w-4 ${s.tone === "success" ? "text-check" : s.tone === "warn" ? "text-honey" : "text-marine"}`} />
              </div>
              <div className="mt-2 font-hero text-[26px] font-bold leading-none text-ink">{s.value}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Alerts + tasks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle action={<span className="text-[11px] font-semibold text-ever">{criticalAlerts.length} critical</span>}>Alerts & escalations</SectionTitle>
          <div className="space-y-2">
            {state.alerts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-xl border border-ink/8 p-3">
                <div className={`mt-0.5 shrink-0 ${a.severity === "critical" ? "text-ever" : "text-honey"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[13px] font-semibold text-ink">{a.title}</div>
                    <StatusPill tone={a.severity === "critical" ? "critical" : "warn"}>{a.severity}</StatusPill>
                  </div>
                  <div className="mt-0.5 text-[12px] text-ink/60">{a.detail}</div>
                </div>
                <button onClick={() => adminActions.resolveAlert(a.id)} className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white">
                  {a.action}
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<span className="text-[11px] font-semibold text-ink/50">{openTasks.length} open</span>}>Task queue</SectionTitle>
          <div className="divide-y divide-ink/6">
            {openTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2.5">
                <div className={`h-2 w-2 shrink-0 rounded-full ${t.ageHrs > 24 ? "bg-ever" : t.ageHrs > 6 ? "bg-honey" : "bg-check"}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-ink">{t.action}</div>
                  <div className="truncate text-[11.5px] text-ink/50">{t.subject} · {t.assignee}</div>
                </div>
                <div className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink/40">{t.ageHrs}h</div>
                <button onClick={() => adminActions.resolveTask(t.id)} className="shrink-0 rounded-lg p-1.5 text-ink/50 hover:bg-check/10 hover:text-check">
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity + physician queue */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle action={<span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40">Real-time</span>}>Activity feed</SectionTitle>
          <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
            {state.activity.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-ink/4">
                <span className={`h-2 w-2 shrink-0 rounded-full ${
                  e.tone === "success" ? "bg-check" : e.tone === "warn" ? "bg-honey" : e.tone === "critical" ? "bg-ever" : "bg-marine"
                }`} />
                <div className="min-w-0 flex-1 truncate text-[13px] text-ink/80">{e.text}</div>
                <div className="shrink-0 text-[10.5px] uppercase tracking-[0.1em] text-ink/40">{timeAgo(e.ts)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Link to="/portal/physician" className="text-[11px] font-semibold text-ever">Portal →</Link>}>Physician queue</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            <QCell label="In review" value="12" tone="warn" />
            <QCell label="Approved today" value="24" tone="success" />
            <QCell label="Refill signals" value="7" tone="info" />
          </div>
          <div className="mt-4 rounded-xl bg-marine/5 p-3 text-[12.5px] text-ink/75">
            <b className="text-marine">Median review time:</b> 4h 12m today (SLA 24h).
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

function QCell({ label, value, tone }: { label: string; value: string; tone: "success" | "warn" | "info" }) {
  const c = tone === "success" ? "text-check bg-check/8" : tone === "warn" ? "text-honey bg-honey/12" : "text-marine bg-marine/8";
  return (
    <div className={`rounded-2xl p-4 ${c}`}>
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] opacity-80">{label}</div>
      <div className="mt-1 font-hero text-[24px] font-bold leading-none">{value}</div>
    </div>
  );
}
