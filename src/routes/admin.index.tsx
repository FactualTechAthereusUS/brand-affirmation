import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  CreditCard,
  DollarSign,
  MessageSquare,
  Package,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import {
  AdminShell,
  Card,
  KPI,
  SectionTitle,
  StatusPill,
  formatMoney,
  timeAgo,
} from "@/components/admin/AdminShell";
import {
  adminActions,
  computeKpis,
  funnelData,
  mrrMovement,
  revenueByProgram,
  acquisitionMix,
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
  const revenue = revenueByProgram();
  const acquisition = acquisitionMix();

  // Weekly revenue synthesized for hero chart
  const weekly = [
    { d: "Mon", v: 12400 },
    { d: "Tue", v: 15200 },
    { d: "Wed", v: 11800 },
    { d: "Thu", v: 18600 },
    { d: "Fri", v: 22100 },
    { d: "Sat", v: 19400 },
    { d: "Sun", v: 24800 },
  ];
  const weeklyMax = Math.max(...weekly.map((w) => w.v));
  const peakIdx = weekly.findIndex((w) => w.v === weeklyMax);

  return (
    <AdminShell title="Dashboard">
      {/* Welcome + date range */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
            Good day, {state.session?.name || "team"}
          </p>
          <h1 className="mt-1.5 font-hero text-[26px] font-bold tracking-tight text-ink sm:text-[32px]">
            Business snapshot
          </h1>
          <p className="mt-1 text-[13px] text-ink/55">Everything that matters, in one view.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl border border-ink/8 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {(["24h", "7d", "4w", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => adminActions.setDateRange(r)}
                className={`rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  state.dateRange === r ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="hidden items-center gap-1.5 rounded-2xl bg-ink px-4 py-2.5 text-[12.5px] font-semibold text-white sm:inline-flex">
            <ArrowUpRight className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KPI
          label="MRR"
          value={formatMoney(kpis.mrr)}
          delta={{ pct: "+12.4%", positive: true }}
          spark={[8, 10, 9, 12, 14, 13, 16, 18]}
          hint={`Last month · ${formatMoney(kpis.mrr - 7400)}`}
          icon={DollarSign}
          tone="ever"
          featured
        />
        <KPI
          label="Net revenue"
          value={formatMoney(kpis.netRevenue)}
          delta={{ pct: "+8.2%", positive: true }}
          spark={[6, 8, 12, 10, 14, 16, 15, 19]}
          hint="Last 4 weeks"
          icon={TrendingUp}
          tone="check"
        />
        <KPI
          label="Active patients"
          value={String(kpis.activeCount)}
          delta={{ pct: "+9", positive: true }}
          spark={[24, 26, 28, 27, 29, 31, 32, 34]}
          hint={`of ${state.patients.length} total`}
          icon={Users}
          tone="marine"
        />
        <KPI
          label="Avg order value"
          value={formatMoney(kpis.aov)}
          delta={{ pct: "−2.1%", positive: false }}
          spark={[280, 278, 279, 275, 278, 276, 274, 272]}
          hint="Trailing 30d"
          icon={CreditCard}
          tone="honey"
        />
        <KPI
          label="Retention · 30d"
          value={`${kpis.retention}%`}
          delta={{ pct: "+1.4pt", positive: true }}
          spark={[62, 64, 65, 63, 66, 67, 68, 69]}
          hint="Rolling cohort"
          icon={Users}
          tone="ever"
        />
      </div>

      {/* Row: Revenue analytics + Program mix */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <SectionTitle
            subtitle="Rolling seven days · net after refunds"
            action={
              <div className="flex items-center gap-1 rounded-full border border-ink/8 bg-[#faf9f6] p-0.5">
                {["Week", "Month", "Year"].map((t, i) => (
                  <button key={t} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 0 ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            }
          >
            Revenue analytics
          </SectionTitle>

          <div className="mt-2 flex items-end gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">This week</div>
              <div className="mt-1 font-hero text-[30px] font-bold leading-none text-ink">
                {formatMoney(weekly.reduce((a, b) => a + b.v, 0))}
              </div>
            </div>
            <span className="mb-1 inline-flex items-center gap-0.5 rounded-full bg-check/12 px-2 py-0.5 text-[11px] font-bold text-check">
              ▲ 14.6%
            </span>
          </div>

          {/* Rounded pill bar chart */}
          <div className="relative mt-6 h-56">
            {/* grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-dashed border-ink/6" />
              ))}
            </div>
            <div className="relative flex h-full items-end justify-between gap-2 sm:gap-4">
              {weekly.map((w, i) => {
                const h = (w.v / weeklyMax) * 100;
                const isPeak = i === peakIdx;
                return (
                  <div key={w.d} className="group relative flex flex-1 flex-col items-center">
                    {isPeak && (
                      <div className="absolute -top-8 z-10 rounded-lg bg-ink px-2 py-1 text-[10.5px] font-semibold text-white shadow-lg">
                        {formatMoney(w.v)}
                        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
                      </div>
                    )}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-full max-w-[44px] rounded-full ${
                        isPeak
                          ? "bg-gradient-to-b from-ever to-blush shadow-[0_10px_30px_-8px_rgba(238,114,115,0.5)]"
                          : "bg-ink/10 group-hover:bg-ink/20"
                      }`}
                    />
                    <div className={`mt-3 text-[11.5px] font-medium ${isPeak ? "text-ink" : "text-ink/45"}`}>{w.d}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Program mix donut */}
        <Card className="p-6">
          <SectionTitle subtitle="By program family">Program mix</SectionTitle>
          <div className="flex flex-col items-center gap-4">
            <ProgramDonut data={revenue} />
            <div className="w-full space-y-2">
              {revenue.slice(0, 4).map((r, i) => {
                const color = ["#ee7273", "#1D437B", "#c4a265", "#4a7c6f"][i];
                const pct = ((r.revenue / revenue.reduce((a, b) => a + b.revenue, 0)) * 100).toFixed(0);
                return (
                  <div key={r.code} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                    <span className="flex-1 truncate text-[12.5px] text-ink/75">{r.label}</span>
                    <span className="text-[12px] font-semibold text-ink">{formatMoney(r.revenue)}</span>
                    <span className="w-9 text-right text-[11px] font-semibold text-ink/45">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Row: Funnel + MRR movement + Acquisition */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <SectionTitle
            subtitle="Last 30 days"
            action={
              <div className="rounded-full bg-ever/10 px-3 py-1 text-[11px] font-semibold text-ever">
                Biggest leak · Intake → Submitted
              </div>
            }
          >
            Patient funnel
          </SectionTitle>
          <div className="space-y-2.5">
            {funnelData().map((f, i, arr) => {
              const dropoff = i > 0 ? (((arr[i - 1].count - f.count) / arr[i - 1].count) * 100).toFixed(1) : null;
              return (
                <div key={f.label} className="grid grid-cols-[130px_1fr_60px] items-center gap-3 sm:grid-cols-[170px_1fr_70px]">
                  <div className="text-[13px] font-medium text-ink/80">{f.label}</div>
                  <div className="relative h-9 overflow-hidden rounded-2xl bg-ink/4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-2xl"
                      style={{
                        background: `linear-gradient(90deg, #ee7273 0%, #f4a5a6 100%)`,
                      }}
                    />
                    <div className="absolute inset-y-0 left-3.5 flex items-center gap-2 text-[11.5px] font-semibold text-white">
                      <span>{f.count.toLocaleString()}</span>
                      <span className="opacity-70">·</span>
                      <span>{f.pct}%</span>
                    </div>
                  </div>
                  <div className="text-right text-[11.5px] font-semibold text-ever">
                    {dropoff ? `−${dropoff}%` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            action={<span className="rounded-full bg-check/12 px-2 py-0.5 text-[11px] font-bold text-check">+$7.4K net</span>}
            subtitle="Movement this month"
          >
            MRR movement
          </SectionTitle>
          <div className="space-y-3">
            {mrrMovement().map((m) => {
              const magnitude = Math.abs(m.value);
              const pct = (magnitude / 12000) * 100;
              return (
                <div key={m.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12.5px] text-ink/70">{m.label}</span>
                    <span className={`text-[12px] font-semibold ${m.kind === "pos" ? "text-check" : "text-ever"}`}>
                      {m.kind === "pos" ? "+" : "−"}{formatMoney(magnitude)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${m.kind === "pos" ? "bg-check" : "bg-ever"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row: Alerts + activity + patients */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6">
          <SectionTitle
            subtitle={`${state.alerts.length} open`}
            action={<span className="rounded-full bg-ever/10 px-2 py-0.5 text-[10.5px] font-bold text-ever">Live</span>}
          >
            Needs attention
          </SectionTitle>
          <div className="space-y-2">
            {state.alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-ink/6 bg-[#faf9f6] p-3">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${a.severity === "critical" ? "bg-ever/12 text-ever" : "bg-honey/15 text-honey"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-ink">{a.title}</div>
                  <div className="mt-0.5 line-clamp-2 text-[12px] text-ink/55">{a.detail}</div>
                </div>
                <button
                  onClick={() => adminActions.resolveAlert(a.id)}
                  className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white transition-transform hover:scale-105"
                >
                  {a.action}
                </button>
              </div>
            ))}
            {state.alerts.length === 0 && <div className="rounded-2xl bg-check/8 p-3 text-[13px] text-check">All clear.</div>}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            subtitle="Live event stream"
            action={<Link to="/admin/command" className="text-[11px] font-semibold text-ever">Command →</Link>}
          >
            Activity
          </SectionTitle>
          <div className="space-y-3">
            {state.activity.slice(0, 8).map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ring-4 ${
                  e.tone === "success" ? "bg-check ring-check/15" :
                  e.tone === "warn" ? "bg-honey ring-honey/20" :
                  e.tone === "critical" ? "bg-ever ring-ever/15" : "bg-marine ring-marine/15"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-[12.5px] text-ink/80">{e.text}</div>
                  <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.1em] text-ink/40">{timeAgo(e.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            subtitle="Newest first"
            action={<Link to="/admin/patients" className="text-[11px] font-semibold text-ever">All →</Link>}
          >
            Recent patients
          </SectionTitle>
          <div className="space-y-1.5">
            {state.patients.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => { adminActions.openPatient(p.id); }}
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left hover:bg-ink/4"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush/40 to-ever/20 text-[11.5px] font-semibold text-ink">
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

      {/* Acquisition mix + Quick tiles */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6">
          <SectionTitle subtitle="Last 30 days">Acquisition mix</SectionTitle>
          <div className="space-y-2.5">
            {acquisition.map((a) => (
              <div key={a.label}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                    <span className="text-ink/75">{a.label}</span>
                  </span>
                  <span className="font-semibold text-ink">{a.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${a.value}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: a.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <QuickTile to="/admin/orders" icon={Package} label="Orders" hint={`${state.orders.length} active`} tone="ever" />
          <QuickTile to="/admin/payments" icon={CreditCard} label="Payments" hint={`${state.payments.filter(p => p.status === "failed").length} failed`} tone="honey" />
          <QuickTile to="/admin/leads" icon={UserPlus} label="Leads" hint={`${state.leads.length} in queue`} tone="marine" />
          <QuickTile to="/admin/messages" icon={MessageSquare} label="Messages" hint={`${state.conversations.filter(c => c.unread).length} unread`} tone="check" />
        </div>
      </div>
    </AdminShell>
  );
}

function ProgramDonut({ data }: { data: Array<{ code: string; revenue: number }> }) {
  const total = data.reduce((a, b) => a + b.revenue, 0);
  const colors = ["#ee7273", "#1D437B", "#c4a265", "#4a7c6f", "#c4998a", "#8b9bb4"];
  const size = 168;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = d.revenue / total;
    const len = c * pct;
    const seg = (
      <circle
        key={d.code}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={colors[i % colors.length]}
        strokeWidth={stroke}
        strokeDasharray={`${len} ${c - len}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    );
    offset += len;
    return seg;
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(23,23,23,0.05)" strokeWidth={stroke} />
        {segments}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Total</div>
          <div className="font-hero text-[22px] font-bold leading-none text-ink">{formatMoney(total)}</div>
        </div>
      </div>
    </div>
  );
}

function QuickTile({ to, icon: Icon, label, hint, tone }: { to: string; icon: typeof Package; label: string; hint: string; tone: "ever" | "marine" | "check" | "honey" }) {
  const toneMap = {
    ever: "bg-ever/10 text-ever",
    marine: "bg-marine/10 text-marine",
    check: "bg-check/12 text-check",
    honey: "bg-honey/15 text-honey",
  } as const;
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-3xl border border-ink/6 bg-white p-5 transition-all hover:border-ink/15 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneMap[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-ink">{label}</div>
        <div className="truncate text-[11.5px] text-ink/50">{hint}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
    </Link>
  );
}
