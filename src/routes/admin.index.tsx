import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { Sparkline } from "@/components/admin/Sparkline";
import { AreaChart } from "@/components/admin/analytics/AreaChart";
import { Donut } from "@/components/admin/analytics/Donut";
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
import { ONBOARDING_LABELS, usePlatform } from "@/lib/platform/store";

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
  const dts = useAdmin((s) => datesTrend(s, 30));
  const revPrior = priorPeriodShift(revTrend, 8);
  const tenant = useAdmin((s) => s.tenant);

  const waterfall = mrrMovement();
  const programs = revenueByProgram();
  const acq = acquisitionMix();

  const mrrDelta = waterfall.reduce((a, i) => a + i.value, 0);

  if (tenant.stage === "zero") return <ZeroStateHome tenant={tenant} />;

  // Intuitive palette (matches /admin/analytics)
  const C = {
    revenue: "#2563eb",
    mrr: "#7c3aed",
    active: "#0ea5e9",
    aov: "#f59e0b",
    retention: "#10b981",
  };

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
              sparkColor={C.mrr}
            />
            <KpiTile
              label="Net Revenue"
              value={`$${kpi.netRevenue.toLocaleString()}`}
              delta="+8.2%"
              deltaTone="positive"
              sub="Last 30 days"
              icon={<TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={revTrend}
              sparkColor={C.revenue}
            />
            <KpiTile
              label="Active Subscriptions"
              value={kpi.activeCount.toLocaleString()}
              delta="+38"
              deltaTone="positive"
              sub="2.1% churn this month"
              icon={<Users className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={patientsTrend}
              sparkColor={C.active}
            />
            <KpiTile
              label="Avg Order Value"
              value={`$${kpi.aov}`}
              delta="-1.4%"
              deltaTone="negative"
              sub="Per completed order"
              icon={<ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={shipTrend}
              sparkColor={C.aov}
            />
            <KpiTile
              label="Retention Rate"
              value={`${kpi.retention}%`}
              delta="+1.4pt"
              deltaTone="positive"
              sub={`${18 - refills}/18 refilled this month`}
              icon={<RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />}
              spark={patientsTrend}
              sparkColor={C.retention}
            />
          </div>

          {/* Row 2 — Today's revenue · MRR movement · Revenue by program */}
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
            <TodayRevenueCard value={todayRev} spark={revTrend} prior={revPrior} dates={dts} stroke={C.revenue} />
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
        <div className="text-ink/40">{icon}</div>
      </div>
      <div className="mt-2 flex items-baseline gap-2 tabular-nums">
        <div className="font-hero text-[24px] font-semibold leading-none text-ink">{value}</div>
        <div className={`text-[11px] font-medium ${deltaTone === "positive" ? "text-check" : "text-ever"}`}>
          {deltaTone === "positive" ? "↗ " : "↘ "}{delta}
        </div>
      </div>
      <div className="mt-1 text-[10.5px] text-ink/45">{sub}</div>
      <div className="mt-2 h-7 w-full">
        <Sparkline
          data={spark}
          stroke={sparkColor}
          fill={`${sparkColor}1f`}
          height={28}
          className="h-7 w-full"
        />
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Today's revenue ───────────────────────── */
function TodayRevenueCard({ value, spark, prior, dates, stroke = "#2563eb" }: { value: number; spark: number[]; prior: number[]; dates: number[]; stroke?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[11.5px] font-medium text-ink/55">Today's revenue</div>
        <div className="text-[10.5px] text-ink/45">vs prior period</div>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
        <div className="font-hero text-[26px] font-semibold text-ink">${value.toLocaleString()}</div>
        <div className="text-[11px] font-medium text-check">↗ +12.4%</div>
        <div className="text-[10.5px] text-ink/45">vs $2,776 yesterday</div>
      </div>
      <div className="mt-3">
        <AreaChart
          data={spark}
          prior={prior}
          dates={dates}
          label="Revenue"
          priorLabel="Prior 30d"
          stroke={stroke}
          height={180}
          formatValue={(v) => `$${Math.round(v).toLocaleString()}`}
          formatYTick={(v) => `$${Math.round(v / 1000)}K`}
          yTicks={4}
          xTicks={5}
        />
      </div>
    </Card>
  );
}

/* ───────────────────────── MRR movement (pixel strip) ───────────────────────── */
function MrrMovementCard({ items, delta }: { items: { label: string; value: number; kind: "pos" | "neg" }[]; delta: number }) {
  const total = items.reduce((a, i) => a + Math.abs(i.value), 0) || 1;
  // Movement palette — matches Analytics MRR donut (New→Expansion→Reactivated→Contraction→Churn→Failed)
  const posColors = ["#7c3aed", "#2563eb", "#10b981"]; // gained
  const negColors = ["#f59e0b", "#ee7273", "#c93a3a"]; // lost
  const colorFor = (idx: number, kind: "pos" | "neg") =>
    kind === "pos" ? posColors[idx % posColors.length] : negColors[idx % negColors.length];
  let pi = 0, ni = 0;
  const withColor = items.map((it) => ({ ...it, color: it.kind === "pos" ? colorFor(pi++, "pos") : colorFor(ni++, "neg") }));

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
        {withColor.map((it) => {
          const w = (Math.abs(it.value) / total) * 100;
          const pixels = Math.max(4, Math.round(w * 0.9));
          return (
            <div key={it.label} className="flex h-full gap-[1px]" style={{ width: `${w}%` }}>
              {Array.from({ length: pixels }).map((_, i) => (
                <div key={i} className="h-full flex-1 rounded-[1px]" style={{ background: it.color, opacity: 0.55 + (i / pixels) * 0.45 }} />
              ))}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
        {withColor.map((it) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
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
  const palette = ["#7c3aed", "#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ee7273"];
  const total = programs.reduce((a, p) => a + p.revenue, 0);
  const segments = programs.slice(0, 6).map((p, i) => ({
    label: p.label,
    value: p.revenue,
    color: palette[i % palette.length],
  }));
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[11.5px] font-medium text-ink/55">Revenue by program · 30d</div>
        <div className="text-[10.5px] tabular-nums text-ink/45">${(total / 1000).toFixed(1)}K total</div>
      </div>
      <div className="mt-3">
        <Donut
          segments={segments}
          centerValue={`$${(total / 1000).toFixed(1)}K`}
          centerLabel="30d"
          size={120}
          thickness={14}
          formatValue={(v) => `$${(v / 1000).toFixed(1)}K`}
        />
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
            style={{ background: i < Math.min(count, 24) ? (tone === "ok" ? "#10b981" : "#f59e0b") : "rgba(23,23,23,0.06)" }}
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
        {rows.map((r, i) => {
          // Gradient from indigo → violet → sky → emerald down the funnel
          const stops = ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1", "#0ea5e9", "#0d9488", "#10b981"];
          const bg = stops[i % stops.length];
          return (
            <div key={r.label}>
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="text-ink/70">{r.label}</span>
                <span className="tabular-nums">
                  <span className="text-ink">{r.value.toLocaleString()}</span>
                  <span className="ml-2 text-ink/45">{r.pct.toFixed(1)}%</span>
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.05]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.03 }}
                  className="h-full rounded-full"
                  style={{ background: bg }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AcquisitionCard({ mix }: { mix: { label: string; value: number; color: string }[] }) {
  const palette = ["#7c3aed", "#2563eb", "#10b981", "#f59e0b", "#ee7273", "#0ea5e9"];
  const total = mix.reduce((a, m) => a + m.value, 0) || 1;
  const colored = mix.map((m, i) => ({ ...m, color: palette[i % palette.length] }));
  return (
    <Card className="p-3.5">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <ChevronDown className="h-3.5 w-3.5 text-ink/50" /> Acquisition
        </div>
        <div className="text-[10.5px] text-ink/45">last 30 days</div>
      </div>
      <div className="mt-2.5 flex h-2 overflow-hidden rounded-full">
        {colored.map((m) => (
          <div key={m.label} style={{ width: `${(m.value / total) * 100}%`, background: m.color }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
        {colored.map((m) => (
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

/* ═════════════════════ ZERO-STATE ONBOARDING (PharmaBro) ═════════════════════ */
function ZeroStateHome({ tenant }: { tenant: ReturnType<typeof useAdmin<any>> extends any ? any : never }) {
  const brand = usePlatform((s) => s.brands.find((b) => b.id === tenant.id));
  const completed = brand?.onboardingStep ?? tenant.onboardingStep;
  const pct = Math.round((completed / ONBOARDING_LABELS.length) * 100);
  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">Welcome to PharmaBro</div>
          <h1 className="mt-1 font-hero text-[28px] font-semibold leading-tight text-ink">
            Let's launch <span style={{ color: tenant.primary }}>{tenant.name}</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-ink/60">
            Your telehealth infrastructure is ready. Follow the steps below to go from empty to your first paid patient — usually 30 minutes.
          </p>
        </motion.div>

        <div className="mb-4 rounded-2xl border border-ink/[0.08] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12.5px] font-semibold text-ink">Setup progress</div>
             <div className="text-[11px] tabular-nums text-ink/55">{completed} of {ONBOARDING_LABELS.length} · {pct}%</div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${tenant.primary}, ${tenant.accent})` }} />
          </div>
        </div>

        <div className="space-y-2">
          {ONBOARDING_LABELS.map((label, i) => {
            const done = i < completed;
            const active = i === completed;
            return (
              <motion.div key={label}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 rounded-xl border p-3.5 ${active ? "border-ink/25 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]" : done ? "border-ink/[0.06] bg-ink/[0.02]" : "border-ink/[0.08] bg-white"}`}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${done ? "text-white" : active ? "text-white" : "border border-ink/15 text-ink/50"}`}
                  style={done || active ? { background: tenant.primary } : {}}>
                  {done ? "✓" : i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-[13.5px] font-semibold ${done ? "text-ink/50 line-through" : "text-ink"}`}>{label}</div>
                  <div className="mt-0.5 text-[11.5px] text-ink/50">{["Name, logo, tagline and patient-facing colors","Verify the secure subdomain patients will use","Connect payouts and payment collection","Verify four Stripe Price IDs","Confirm clinical and operating requirements","Review every requirement and open intake"][i]}</div>
                </div>
                {!done && (
                  <div className="flex items-center gap-2">
                    <Link to="/admin/onboarding/$step" params={{ step: String(i + 1) }} search={{ brand: tenant.id }} className="rounded-md px-3 py-1.5 text-[11.5px] font-semibold text-white" style={{ background: tenant.primary }}>
                      {active ? "Start" : "Open"}
                    </Link>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-ink/[0.08] bg-white p-4 text-[12px] text-ink/60">
          <div className="mb-1 text-[11.5px] font-semibold text-ink">Need help?</div>
          Hold the logo (long-press) in the sidebar to switch between demo tenants: <b>Blissley</b> (live, full data), <b>Nova Health</b> (ramping), or <b>ZeroCo</b> (this empty state).
        </div>
      </div>
    </AdminShell>
  );
}
