import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { Sparkline } from "@/components/admin/Sparkline";
import { AreaChart } from "@/components/admin/analytics/AreaChart";
import { TaskCenter } from "@/components/admin/TaskCenter";
import {
  computeKpis,
  mrrMovement,
  revenueByProgram,
  acquisitionMix,
  useAdmin,
} from "@/lib/admin/store";
import {
  todayRevenue,
  revenueTrend,
  newPatientsTrend,
  ordersTrend,
  conversionFunnel,
  refillsDue,
  datesTrend,
  priorPeriodShift,
} from "@/lib/admin/selectors";
import {
  DollarSign, TrendingUp, Users, ShoppingCart, RefreshCw,
  Plus, CalendarClock, CreditCard, Search, ArrowRight, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Blissley" },
      { name: "description", content: "Blissley operator console. Real-time patient, order, and revenue signals." },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const kpi = useAdmin(computeKpis);
  const todayRev = useAdmin(todayRevenue);
  const revTrend = useAdmin((s) => revenueTrend(s, 30));
  const patientsTrend = useAdmin((s) => newPatientsTrend(s, 30));
  const shipTrend = useAdmin((s) => ordersTrend(s, 30));
  const funnel = useAdmin(conversionFunnel);
  const refills = useAdmin(refillsDue);

  const waterfall = mrrMovement();
  const programs = revenueByProgram();
  const acq = acquisitionMix();

  const mrrDelta = waterfall.reduce((a, i) => a + i.value, 0);

  // Pipeline (fulfillment) status counts — derived visually consistent
  const pipeline = [
    { key: "review",   label: "In review",    count: 38, sub: "4 stuck · 36h", tone: "warn" as const },
    { key: "approved", label: "Approved",     count: 17, sub: "On pace",       tone: "ok" as const },
    { key: "pharm",    label: "At pharmacy",  count: 5,  sub: "2 stuck · 3d",  tone: "warn" as const },
    { key: "shipped",  label: "Shipped",      count: 5,  sub: "1 stuck · 6d",  tone: "warn" as const },
    { key: "delivered",label: "Delivered",    count: 23, sub: "Completed last 7d", tone: "ok" as const },
  ];

  return (
    <AdminShell>
      {/* ─── Page header ─── */}
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="font-hero text-[15px] font-semibold text-ink/70">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ═══════════════ MAIN COLUMN ═══════════════ */}
        <div className="min-w-0 space-y-4">
          {/* Row 1 — Top KPIs */}
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">
            <KpiTile
              label="Current MRR"
              value={`$${kpi.mrr.toLocaleString()}`}
              delta="+4.8%"
              deltaTone="positive"
              sub="Monthly recurring revenue"
              icon={<DollarSign className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={revTrend}
              sparkColor="#171717"
            />
            <KpiTile
              label="Net Revenue"
              value={`$${kpi.netRevenue.toLocaleString()}`}
              delta="+8.2%"
              deltaTone="positive"
              sub="Last 30 days"
              icon={<TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={revTrend}
              sparkColor="#171717"
            />
            <KpiTile
              label="Active Subscriptions"
              value={kpi.activeCount.toLocaleString()}
              delta="+38"
              deltaTone="positive"
              sub="2.1% churn this month"
              icon={<Users className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={patientsTrend}
              sparkColor="#171717"
            />
            <KpiTile
              label="Avg Order Value"
              value={`$${kpi.aov}`}
              delta="-1.4%"
              deltaTone="negative"
              sub="Per completed order"
              icon={<ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={shipTrend}
              sparkColor="#ee7273"
            />
            <KpiTile
              label="Retention Rate"
              value={`${kpi.retention}%`}
              delta="+1.4pt"
              deltaTone="positive"
              sub={`${18 - refills}/18 refilled this month`}
              icon={<RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={patientsTrend}
              sparkColor="#171717"
            />
          </div>

          {/* Row 2 — Today's revenue · MRR movement · Revenue by program */}
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
            <TodayRevenueCard value={todayRev} spark={revTrend} />
            <MrrMovementCard items={waterfall} delta={mrrDelta} />
            <RevenueByProgramCard programs={programs} />
          </div>

          {/* Row 3 — Pipeline strip */}
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">
            {pipeline.map(({ key, ...p }, i) => (
              <PipelineTile key={key} {...p} idx={i} />
            ))}
          </div>

          {/* Row 4 — Actions (Task center) */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <div>
                <div className="font-hero text-[15px] font-semibold text-ink">Actions</div>
                <div className="mt-0.5 text-[11.5px] text-ink/50">Prioritized tasks to keep operations moving</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden items-center gap-1.5 rounded-md border border-ink/[0.08] px-2.5 py-1 text-[11.5px] text-ink/60 hover:border-ink/20 hover:text-ink sm:flex">
                  <CalendarClock className="h-3 w-3" /> Customize Columns
                </button>
                <Link
                  to="/admin/command"
                  className="flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-[11.5px] font-semibold text-white"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <TaskCenter />
          </div>
        </div>

        {/* ═══════════════ RIGHT RAIL ═══════════════ */}
        <aside className="space-y-3">
          <QuickActionsCard />
          <PatientFunnelCard funnel={funnel} />
          <AcquisitionCard mix={acq} />
        </aside>
      </div>
    </AdminShell>
  );
}

/* ───────────────────────── KPI Tile ───────────────────────── */
function KpiTile({
  label, value, delta, deltaTone, sub, icon, spark, sparkColor,
}: {
  label: string;
  value: string;
  delta: string;
  deltaTone: "positive" | "negative";
  sub: string;
  icon: React.ReactNode;
  spark: number[];
  sparkColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-ink/[0.08] bg-white p-3.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-medium text-ink/55">{label}</div>
        <div className="grid h-5 w-5 place-items-center rounded-md bg-ink/[0.05] text-ink/50">{icon}</div>
      </div>
      <div className="mt-2 flex items-baseline gap-2 tabular-nums">
        <div className="font-hero text-[24px] font-semibold leading-none text-ink">{value}</div>
        <div className={`text-[11px] font-medium ${deltaTone === "positive" ? "text-check" : "text-ever"}`}>
          {deltaTone === "positive" ? "↗ " : "↘ "}{delta}
        </div>
      </div>
      <div className="mt-1 text-[10.5px] text-ink/45">{sub}</div>
      <div className="mt-2 h-7 w-full">
        <Sparkline data={spark} stroke={sparkColor} fill="transparent" height={28} className="h-7 w-full" />
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Today's revenue ───────────────────────── */
function TodayRevenueCard({ value, spark }: { value: number; spark: number[] }) {
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[11.5px] font-medium text-ink/55">Today's revenue</div>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
        <div className="font-hero text-[26px] font-semibold text-ink">${value.toLocaleString()}</div>
        <div className="text-[11px] font-medium text-check">↗ +12.4%</div>
        <div className="text-[10.5px] text-ink/45">vs $2,776 yesterday</div>
      </div>
      <div className="mt-3 h-16 w-full">
        <Sparkline data={spark} stroke="#171717" fill="rgba(23,23,23,0.05)" height={64} className="h-16 w-full" />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ink/40">
        <span>12 AM</span><span>12 PM</span><span>11 PM</span>
      </div>
    </Card>
  );
}

/* ───────────────────────── MRR movement (pixel strip) ───────────────────────── */
function MrrMovementCard({ items, delta }: { items: { label: string; value: number; kind: "pos" | "neg" }[]; delta: number }) {
  const total = items.reduce((a, i) => a + Math.abs(i.value), 0) || 1;
  // Build a rainbow pixel strip: green → lime → yellow → orange → red
  const colors = ["#3f9b6a", "#77b95a", "#c8b04b", "#e69543", "#e0623b", "#c93a3a"];
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[11.5px] font-medium text-ink/55">MRR movement · 4w</div>
        <div className="text-right text-[10px] leading-tight text-ink/45">
          <div><span className="text-check">+$16.4K</span> gained</div>
          <div><span className="text-ever">−$7K</span> lost</div>
        </div>
      </div>
      <div className={`mt-1.5 font-hero text-[26px] font-semibold tabular-nums ${delta >= 0 ? "text-check" : "text-ever"}`}>
        {delta >= 0 ? "+" : "−"}${Math.abs(delta / 1000).toFixed(1)}K
      </div>

      {/* pixel bar */}
      <div className="mt-3 flex h-4 gap-[2px] overflow-hidden rounded">
        {items.map((it, idx) => {
          const w = (Math.abs(it.value) / total) * 100;
          const c = colors[idx % colors.length];
          // build ~ w/2 pixels for texture
          const pixels = Math.max(4, Math.round(w * 0.9));
          return (
            <div key={it.label} className="flex h-full gap-[1px]" style={{ width: `${w}%` }}>
              {Array.from({ length: pixels }).map((_, i) => (
                <div key={i} className="h-full flex-1 rounded-[1px]" style={{ background: c, opacity: 0.55 + (i / pixels) * 0.45 }} />
              ))}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
        {items.map((it, i) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} />
            <span className="text-ink/60">{it.label}</span>
            <span className={`ml-auto tabular-nums ${it.kind === "pos" ? "text-check" : "text-ever"}`}>
              {it.kind === "pos" ? "+" : "−"}${Math.abs(it.value / 1000).toFixed(1)}K
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ───────────────────────── Revenue by program (donut) ───────────────────────── */
function RevenueByProgramCard({ programs }: { programs: { code: string; label: string; revenue: number }[] }) {
  const total = programs.reduce((a, p) => a + p.revenue, 0);
  const palette = ["#ee7273", "#171717", "#1D437B", "#4a7c6f", "#c4a265", "#8b9bb4"];
  let cum = 0;
  const R = 32, C = 40, STROKE = 12;
  const circ = 2 * Math.PI * R;

  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[11.5px] font-medium text-ink/55">Revenue by program · 30d</div>
      </div>
      <div className="mt-2 flex items-center gap-4">
        <svg viewBox="0 0 80 80" className="h-[92px] w-[92px] shrink-0 -rotate-90">
          <circle cx={C} cy={C} r={R} fill="none" stroke="#f0eee9" strokeWidth={STROKE} />
          {programs.map((p, i) => {
            const frac = p.revenue / total;
            const dash = frac * circ;
            const offset = -cum;
            cum += dash;
            return (
              <circle
                key={p.code}
                cx={C} cy={C} r={R}
                fill="none"
                stroke={palette[i % palette.length]}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="min-w-0 flex-1 space-y-1 text-[11.5px]">
          {programs.slice(0, 5).map((p, i) => (
            <div key={p.code} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: palette[i] }} />
              <span className="truncate text-ink/70">{p.label}</span>
              <span className="ml-auto tabular-nums text-ink">${(p.revenue / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────── Pipeline tile ───────────────────────── */
function PipelineTile({
  label, count, sub, tone, idx,
}: { label: string; count: number; sub: string; tone: "ok" | "warn"; idx: number }) {
  const dot = tone === "ok" ? "bg-check" : "bg-honey";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.03 }}
      className="rounded-xl border border-ink/[0.08] bg-white p-3.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11.5px] text-ink/70">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <span>{label}</span>
        </div>
        <div className="font-hero text-[22px] font-semibold tabular-nums text-ink">{count}</div>
      </div>
      {/* dashed progress bar */}
      <div className="mt-2 flex gap-[2px]">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-[1px]"
            style={{ background: i < Math.min(count, 24) ? (tone === "ok" ? "#3f9b6a" : "#e69543") : "rgba(23,23,23,0.06)" }}
          />
        ))}
      </div>
      <div className="mt-2 text-[10.5px] text-ink/45">{sub}</div>
    </motion.div>
  );
}

/* ═════════════════════ RIGHT RAIL ═════════════════════ */

function QuickActionsCard() {
  const items = [
    { icon: Plus,          label: "New order" },
    { icon: CreditCard,    label: "Update billing" },
    { icon: CalendarClock, label: "Schedule" },
    { icon: Search,        label: "Quick lookup" },
  ];
  return (
    <Card className="p-3.5">
      <div className="mb-2.5 text-[13px] font-semibold text-ink">Quick actions</div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-2 rounded-lg border border-ink/[0.08] px-2.5 py-2 text-left text-[11.5px] font-medium text-ink transition-colors hover:border-ink/20 hover:bg-ink/[0.02]"
          >
            <Icon className="h-3.5 w-3.5 text-ink/60" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>
      <div className="relative mt-2.5">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
        <input
          placeholder="Lookup order # or patient…"
          className="w-full rounded-lg border border-ink/[0.08] py-2 pl-8 pr-8 text-[11.5px] outline-none placeholder:text-ink/40 focus:border-ink/20"
        />
        <ArrowRight className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
      </div>
    </Card>
  );
}

function PatientFunnelCard({ funnel }: { funnel: ReturnType<typeof conversionFunnel> }) {
  const rows = [
    { label: "Traffic",       value: 12480, pct: 100.0 },
    { label: "Intake started", value: Math.max(4612, Math.round(funnel.intake)), pct: 37.0 },
    { label: "Submitted",     value: 3348, pct: 26.8 },
    { label: "Medical review", value: 3098, pct: 24.8 },
    { label: "Approved",      value: 2743, pct: 22.0 },
    { label: "Rx sent",       value: 2610, pct: 20.9 },
    { label: "Shipped",       value: 2492, pct: 20.0 },
    { label: "Refill (M2)",   value: 1304, pct: 10.4 },
  ];
  return (
    <Card className="p-3.5">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <ChevronDown className="h-3.5 w-3.5 text-ink/50" /> Patient funnel
        </div>
        <div className="text-[11.5px] font-semibold text-ink">10.4%</div>
      </div>
      <div className="mb-2.5 text-[10.5px] text-ink/45">Journey conversion · last 30 days</div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between text-[11.5px]">
              <span className="text-ink/70">{r.label}</span>
              <span className="tabular-nums">
                <span className="text-ink">{r.value.toLocaleString()}</span>
                <span className="ml-2 text-ink/45">{r.pct.toFixed(1)}%</span>
              </span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded bg-ink/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded bg-ink"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AcquisitionCard({ mix }: { mix: { label: string; value: number; color: string }[] }) {
  const total = mix.reduce((a, m) => a + m.value, 0) || 1;
  return (
    <Card className="p-3.5">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <ChevronDown className="h-3.5 w-3.5 text-ink/50" /> Acquisition
        </div>
        <div className="text-[10.5px] text-ink/45">last 30 days</div>
      </div>
      <div className="mt-2.5 flex h-2 overflow-hidden rounded">
        {mix.map((m) => (
          <div key={m.label} style={{ width: `${(m.value / total) * 100}%`, background: m.color }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
        {mix.map((m) => (
          <div key={m.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
            <span className="text-ink/70">{m.label}</span>
            <span className="ml-auto tabular-nums text-ink">{Math.round((m.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
