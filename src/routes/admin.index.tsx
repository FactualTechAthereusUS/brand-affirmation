import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  Package,
  UserPlus,
  DollarSign,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  AdminShell,
  Card,
  KPI,
  SectionTitle,
  Sparkline,
  StatusPill,
  formatMoney,
  timeAgo,
} from "@/components/admin/AdminShell";
import {
  adminActions,
  computeKpis,
  funnelData,
  mrrMovement,
  useAdmin,
} from "@/lib/admin/store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Blissley HQ" },
      { name: "description", content: "Business-wide health snapshot: revenue, patients, ops." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const state = useAdmin((s) => s);
  const kpis = computeKpis(state);
  const nav = useNavigate();

  useEffect(() => {
    if (!state.onboardingComplete) {
      // no-op onboarding placeholder
    }
  }, [state.onboardingComplete]);

  return (
    <AdminShell title="Dashboard">
      {/* Welcome + date range */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Good day, {state.session?.name || "team"}</p>
          <h1 className="mt-1 font-hero text-2xl tracking-tight text-ink sm:text-3xl">Business snapshot</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1">
          {(["24h", "7d", "4w", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => adminActions.setDateRange(r)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                state.dateRange === r ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KPI label="MRR" value={formatMoney(kpis.mrr)} delta={{ pct: "+12.4%", positive: true }} spark={[8, 10, 9, 12, 14, 13, 16, 18]} hint="vs last 4 weeks" />
        <KPI label="Net revenue (4w)" value={formatMoney(kpis.netRevenue)} delta={{ pct: "+8.2%", positive: true }} spark={[6, 8, 12, 10, 14, 16, 15, 19]} />
        <KPI label="Active patients" value={String(kpis.activeCount)} delta={{ pct: "+9", positive: true }} spark={[24, 26, 28, 27, 29, 31, 32, 34]} hint={`of ${state.patients.length} total`} />
        <KPI label="Avg order value" value={formatMoney(kpis.aov)} delta={{ pct: "−2.1%", positive: false }} spark={[280, 278, 279, 275, 278, 276, 274, 272]} />
        <KPI label="Retention · 30d" value={`${kpis.retention}%`} delta={{ pct: "+1.4pt", positive: true }} spark={[62, 64, 65, 63, 66, 67, 68, 69]} />
      </div>

      {/* Row 2: Funnel + MRR movement */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Funnel */}
        <Card className="p-5 lg:col-span-2">
          <SectionTitle action={<span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Last 30 days</span>}>
            Patient funnel
          </SectionTitle>
          <div className="mt-4 space-y-2.5">
            {funnelData().map((f, i, arr) => {
              const dropoff = i > 0 ? (((arr[i - 1].count - f.count) / arr[i - 1].count) * 100).toFixed(1) : null;
              return (
                <div key={f.label} className="grid grid-cols-[130px_1fr_100px] items-center gap-3 sm:grid-cols-[160px_1fr_120px]">
                  <div className="text-[13px] font-medium text-ink/80">{f.label}</div>
                  <div className="relative h-8 overflow-hidden rounded-lg bg-ink/5">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${f.pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-lg"
                      style={{ background: `linear-gradient(90deg, #ee7273, #ee7273 60%, #f4a5a6)` }}
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center text-[11.5px] font-semibold text-white mix-blend-difference">
                      {f.count.toLocaleString()} · {f.pct}%
                    </div>
                  </div>
                  <div className="text-right text-[11.5px] text-ink/50">
                    {dropoff ? <span>−{dropoff}%</span> : <span>&nbsp;</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl bg-ever/6 p-3 text-[12.5px] text-ink/75">
            <b className="text-ever">Biggest leak:</b> Intake → Submitted (−27.4%). Retarget with abandonment email flow.
          </div>
        </Card>

        {/* MRR movement */}
        <Card className="p-5">
          <SectionTitle action={<span className="text-[11px] font-semibold text-check">+$7.4K net</span>}>MRR movement</SectionTitle>
          <div className="mt-4 space-y-2">
            {mrrMovement().map((m) => {
              const magnitude = Math.abs(m.value);
              const pct = (magnitude / 12000) * 100;
              return (
                <div key={m.label} className="grid grid-cols-[110px_1fr_80px] items-center gap-2">
                  <div className="text-[12.5px] text-ink/70">{m.label}</div>
                  <div className="relative h-2.5 rounded-full bg-ink/5">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${m.kind === "pos" ? "bg-check" : "bg-ever"}`}
                    />
                  </div>
                  <div className={`text-right text-[12px] font-semibold ${m.kind === "pos" ? "text-check" : "text-ever"}`}>
                    {m.kind === "pos" ? "+" : "−"}{formatMoney(magnitude)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 3: Alerts + activity + queue */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <SectionTitle>Needs attention</SectionTitle>
          <div className="space-y-2">
            {state.alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-xl border border-ink/8 bg-[#faf9f6] p-3">
                <div className={`mt-0.5 grid h-8 w-8 place-items-center rounded-full ${a.severity === "critical" ? "bg-ever/12 text-ever" : "bg-honey/15 text-honey"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink">{a.title}</div>
                  <div className="text-[12px] text-ink/60">{a.detail}</div>
                </div>
                <button onClick={() => adminActions.resolveAlert(a.id)} className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white">
                  {a.action}
                </button>
              </div>
            ))}
            {state.alerts.length === 0 && <div className="rounded-xl bg-check/8 p-3 text-[13px] text-check">All clear.</div>}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Link to="/admin/command" className="text-[11px] font-semibold text-ever">Command →</Link>}>Recent activity</SectionTitle>
          <div className="space-y-2">
            {state.activity.slice(0, 8).map((e) => (
              <div key={e.id} className="flex items-start gap-3 py-1">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  e.tone === "success" ? "bg-check" :
                  e.tone === "warn" ? "bg-honey" :
                  e.tone === "critical" ? "bg-ever" : "bg-marine"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] text-ink/80">{e.text}</div>
                  <div className="text-[10.5px] uppercase tracking-[0.1em] text-ink/40">{timeAgo(e.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Link to="/admin/patients" className="text-[11px] font-semibold text-ever">All →</Link>}>Recent patients</SectionTitle>
          <div className="space-y-2">
            {state.patients.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => { adminActions.openPatient(p.id); }}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-ink/5"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-blush/20 text-[11px] font-semibold text-ink">
                  {p.firstName[0]}{p.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-ink">{p.firstName} {p.lastName}</div>
                  <div className="truncate text-[11px] text-ink/50">{p.email}</div>
                </div>
                <StatusPill tone={p.status === "active" ? "success" : p.status === "failed" ? "critical" : p.status === "paused" ? "warn" : "neutral"}>
                  {p.status}
                </StatusPill>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick access */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickTile to="/admin/orders" icon={Package} label="Orders" hint={`${state.orders.length} active`} />
        <QuickTile to="/admin/payments" icon={CreditCard} label="Payments" hint={`${state.payments.filter(p => p.status === "failed").length} failed`} />
        <QuickTile to="/admin/leads" icon={UserPlus} label="Leads" hint={`${state.leads.length} in queue`} />
        <QuickTile to="/admin/messages" icon={MessageSquare} label="Messages" hint={`${state.conversations.filter(c => c.unread).length} unread`} />
      </div>
    </AdminShell>
  );
}

function QuickTile({ to, icon: Icon, label, hint }: { to: string; icon: typeof Package; label: string; hint: string }) {
  return (
    <Link to={to} className="group rounded-2xl border border-ink/8 bg-white p-4 transition-all hover:border-ever/40 hover:shadow-lg hover:shadow-ever/8">
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-ever/10 text-ever">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-ever" />
      </div>
      <div className="mt-3 text-[14px] font-semibold text-ink">{label}</div>
      <div className="text-[11.5px] text-ink/50">{hint}</div>
    </Link>
  );
}
