import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  CheckCircle2, Circle, ArrowRight, TrendingUp, TrendingDown,
  Users, CreditCard, Package, AlertTriangle, Activity,
} from "lucide-react";
import { Card, PageHeader, Pill, SectionTitle, BrandButton } from "@/components/pharmabro/BrandShell";
import { useActiveBrand, useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/")({
  head: () => ({ meta: [{ title: "Home — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: HomePage,
});

function HomePage() {
  const brand = useActiveBrand();
  const data = useActiveData();

  const kpis = useMemo(() => {
    const activePatients = data.patients.filter((p) => p.status === "active").length;
    const mrrCents = data.patients.filter((p) => p.status === "active").reduce((s, p) => s + p.mrrCents, 0);
    const netRevenue = data.payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amountCents, 0);
    const failed = data.payments.filter((p) => p.status === "failed").length;
    const retention = activePatients > 0 ? Math.min(98, 82 + (activePatients % 15)) : 0;
    return { activePatients, mrrCents, netRevenue, failed, retention };
  }, [data]);

  if (brand.stage === "onboarding") return <OnboardingHome />;

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Good afternoon, ${brand.name}`}
        subtitle="Here's what's happening across your business."
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="MRR" value={fmt(kpis.mrrCents)} delta="+12.4%" up icon={TrendingUp} />
        <Kpi label="Net revenue (30d)" value={fmt(kpis.netRevenue)} delta="+8.1%" up icon={CreditCard} />
        <Kpi label="Active patients" value={kpis.activePatients.toLocaleString()} delta="+3.2%" up icon={Users} />
        <Kpi label="Failed payments" value={String(kpis.failed)} delta="-14%" up={false} icon={AlertTriangle} />
        <Kpi label="Retention" value={`${kpis.retention}%`} delta="+1.1pp" up icon={Activity} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-4">
          <SectionTitle subtitle="Revenue today + trailing 30 days">Revenue</SectionTitle>
          <RevenueChart data={data.payments} primary={brand.theme.primary} />
        </Card>

        {/* Task center */}
        <Card className="p-4">
          <SectionTitle subtitle="What needs your attention">Tasks</SectionTitle>
          <ul className="space-y-2 text-[13px]">
            <TaskRow label={`${data.cases.filter((c) => c.status === "queued").length} cases awaiting physician`} to="/pharmabro-admin/physician-queue" />
            <TaskRow label={`${data.checkIns.filter((c) => c.status === "due").length} check-ins due`} to="/pharmabro-admin/check-ins" />
            <TaskRow label={`${data.payments.filter((p) => p.status === "failed").length} failed payments to retry`} to="/pharmabro-admin/payments" />
            <TaskRow label={`${data.conversations.filter((c) => c.unread > 0).length} unread messages`} to="/pharmabro-admin/messages" />
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Physician strip */}
        <Card className="p-4">
          <SectionTitle subtitle="Cases waiting on physician review">Physician queue</SectionTitle>
          <PipelineStrip
            stages={[
              { label: "Queued", count: data.cases.filter((c) => c.status === "queued").length },
              { label: "In review", count: 3 },
              { label: "Approved today", count: 7 },
              { label: "SLA breaches", count: data.cases.filter((c) => c.slaHrs < 0).length, tone: "warn" },
            ]}
            primary={brand.theme.primary}
          />
        </Card>
        {/* Pharmacy strip */}
        <Card className="p-4">
          <SectionTitle subtitle="Fulfillment flowing through pharmacy partners">Pharmacy</SectionTitle>
          <PipelineStrip
            stages={[
              { label: "Paid", count: data.orders.filter((o) => o.stage === "paid").length },
              { label: "Picking", count: data.orders.filter((o) => o.stage === "pharmacy").length },
              { label: "Shipped", count: data.orders.filter((o) => o.stage === "shipped").length },
              { label: "Delivered", count: data.orders.filter((o) => o.stage === "delivered").length },
            ]}
            primary={brand.theme.primary}
          />
        </Card>
      </div>

      {/* Funnel */}
      <Card className="p-4">
        <SectionTitle subtitle="Landing → intake → checkout → paid → shipped">Patient funnel</SectionTitle>
        <FunnelWaterfall primary={brand.theme.primary} scale={Math.max(1, Math.floor(data.patients.length / 40))} />
      </Card>
    </div>
  );
}

function Kpi({ label, value, delta, up, icon: Icon }: { label: string; value: string; delta: string; up: boolean; icon: typeof TrendingUp }) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{label}</span>
        <Icon className="h-3.5 w-3.5 text-ink/40" strokeWidth={1.5} />
      </div>
      <div className="mt-1.5 text-[22px] font-bold tracking-tight text-ink">{value}</div>
      <div className={`mt-0.5 flex items-center gap-1 text-[11px] ${up ? "text-emerald-600" : "text-rose-600"}`}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {delta}
      </div>
    </Card>
  );
}

function TaskRow({ label, to }: { label: string; to: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between rounded-lg px-2.5 py-2 hover:bg-ink/[0.03]">
        <span className="text-ink/80">{label}</span>
        <ArrowRight className="h-3.5 w-3.5 text-ink/40" />
      </Link>
    </li>
  );
}

function PipelineStrip({ stages, primary }: { stages: { label: string; count: number; tone?: "warn" }[]; primary: string }) {
  const total = Math.max(1, stages.reduce((s, x) => s + x.count, 0));
  return (
    <div>
      <div className="flex gap-1.5 overflow-hidden rounded-lg bg-ink/5">
        {stages.map((s, i) => (
          <div key={i} className="h-2 rounded" style={{ width: `${(s.count / total) * 100}%`, background: s.tone === "warn" ? "#f59e0b" : primary, opacity: 1 - i * 0.15 }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-[11px]">
        {stages.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-[18px] font-bold text-ink">{s.count}</div>
            <div className="text-ink/50">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueChart({ data, primary }: { data: { amountCents: number; createdMs: number; status: string }[]; primary: string }) {
  // Build 30-day daily aggregation
  const now = Date.now();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const start = now - (29 - i) * 86400000;
    const end = start + 86400000;
    return data.filter((p) => p.createdMs >= start && p.createdMs < end && p.status === "succeeded")
      .reduce((s, p) => s + p.amountCents, 0);
  });
  const max = Math.max(1, ...days);
  return (
    <div>
      <div className="flex h-40 items-end gap-1">
        {days.map((v, i) => (
          <div key={i} className="flex-1 rounded-sm transition-all hover:opacity-80"
            style={{ height: `${(v / max) * 100}%`, minHeight: 2, background: primary, opacity: 0.6 + (i / 30) * 0.4 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-ink/40">
        <span>30 days ago</span><span>Today</span>
      </div>
    </div>
  );
}

function FunnelWaterfall({ primary, scale }: { primary: string; scale: number }) {
  const steps = [
    { label: "Visits", value: 8420 * scale },
    { label: "Started intake", value: 3120 * scale },
    { label: "Completed intake", value: 1840 * scale },
    { label: "Paid", value: 720 * scale },
    { label: "Shipped", value: 640 * scale },
  ];
  const max = steps[0].value;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-32 text-[12px] text-ink/60">{s.label}</div>
          <div className="relative flex-1">
            <div className="h-7 rounded" style={{ width: `${(s.value / max) * 100}%`, background: primary, opacity: 1 - i * 0.14 }} />
            <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-semibold text-white">
              {s.value.toLocaleString()}
            </span>
          </div>
          <div className="w-16 text-right text-[11px] text-ink/50">{Math.round((s.value / max) * 100)}%</div>
        </div>
      ))}
    </div>
  );
}

function OnboardingHome() {
  const brand = useActiveBrand();
  const steps = [
    { id: "logo", label: "Upload your logo", to: "/pharmabro-admin/settings", done: !!brand.logoUrl },
    { id: "colors", label: "Set brand colors", to: "/pharmabro-admin/settings", done: brand.theme.primary !== "#171717" },
    { id: "stripe", label: "Connect Stripe", to: "/pharmabro-admin/settings/stripe", done: brand.stripe.connected },
    { id: "products", label: "Configure products & pricing", to: "/pharmabro-admin/build/products", done: false },
    { id: "funnel", label: "Build your funnel", to: "/pharmabro-admin/build/funnel", done: false },
    { id: "publish", label: "Publish your site", to: "/pharmabro-admin/build/pages", done: false },
  ];
  const complete = steps.filter((s) => s.done).length;
  const pct = Math.round((complete / steps.length) * 100);

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Welcome to ${brand.name}`}
        subtitle="Your telehealth brand — let's get you live in 30 minutes."
      />

      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative grid h-24 w-24 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-24 w-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={brand.theme.primary} strokeWidth="8"
                strokeDasharray={`${(pct / 100) * 264} 264`} strokeLinecap="round" />
            </svg>
            <div className="text-[20px] font-bold">{pct}%</div>
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-bold text-ink">Get {brand.name} live</div>
            <div className="text-[12.5px] text-ink/55">{complete} of {steps.length} complete</div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {steps.map((s) => (
            <Link key={s.id} to={s.to}
              className="flex items-center gap-3 rounded-lg border border-ink/[0.08] bg-white p-3 hover:border-ink/20"
            >
              {s.done ? <CheckCircle2 className="h-4 w-4" style={{ color: brand.theme.primary }} /> : <Circle className="h-4 w-4 text-ink/30" />}
              <span className={`flex-1 text-[13.5px] ${s.done ? "text-ink/50 line-through" : "font-semibold text-ink"}`}>{s.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-ink/40" />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function fmt(cents: number) {
  const n = cents / 100;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}
