import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  CreditCard,
  DollarSign,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  AdminShell,
  Card,
  KPI,
  Sparkline,
  formatMoney,
} from "@/components/admin/AdminShell";
import {
  computeKpis,
  funnelData,
  mrrMovement,
  revenueByProgram,
  acquisitionMix,
  pipelineCounts,
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
  const state = useAdmin((s: ReturnType<typeof useAdmin>) => s);
  const kpis = computeKpis(state);
  const revenue = revenueByProgram();
  const acquisition = acquisitionMix();
  const funnel = funnelData();
  const pipeline = pipelineCounts();
  const [tab, setTab] = useState<"all" | "billing" | "patient_ops" | "admin" | "unassigned">("all");

  const tabCounts = {
    all: state.tasks.length,
    billing: state.tasks.filter((t) => t.category === "billing").length,
    patient_ops: state.tasks.filter((t) => t.category === "care_ops").length,
    admin: state.tasks.filter((t) => t.category === "admin").length,
    unassigned: state.tasks.filter((t) => !t.assignee || t.assignee.toLowerCase().includes("unassigned")).length,
  };

  const filteredTasks = state.tasks.filter((t) =>
    tab === "all" ? true :
    tab === "billing" ? t.category === "billing" :
    tab === "patient_ops" ? t.category === "care_ops" :
    tab === "admin" ? t.category === "admin" :
    !t.assignee || t.assignee.toLowerCase().includes("unassigned")
  ).slice(0, 12);

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* Left / main */}
        <div className="min-w-0 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <KPI label="Current MRR" value={formatMoney(kpis.mrr)} delta={{ pct: "+4.8%", positive: true }}
              spark={[62, 64, 63, 66, 65, 68, 70, 69, 72, 74, 73, 76]} hint="Monthly recurring revenue" icon={DollarSign} featured />
            <KPI label="Net Revenue" value={formatMoney(kpis.netRevenue)} delta={{ pct: "+8.2%", positive: true }}
              spark={[40, 42, 41, 45, 47, 46, 50, 52, 55, 54, 58, 60]} hint="Last 30 days" icon={TrendingUp} />
            <KPI label="Active Subscriptions" value={kpis.activeCount.toLocaleString()} delta={{ pct: "+38", positive: true }}
              spark={[24, 25, 26, 27, 26, 28, 30, 29, 31, 32, 33, 34]} hint="2.1% churn this month" icon={Users} />
            <KPI label="Avg Order Value" value={formatMoney(kpis.aov)} delta={{ pct: "-1.4%", positive: false }}
              spark={[80, 79, 81, 80, 78, 79, 77, 78, 76, 77, 75, 76]} hint="Per completed order" icon={ShoppingCart} />
            <KPI label="Retention Rate" value={`${kpis.retention}%`} delta={{ pct: "+1.4pt", positive: true }}
              spark={[60, 62, 61, 63, 62, 64, 65, 64, 66, 67, 66, 68]} hint="12/18 refilled this month" icon={Users} />
          </div>

          {/* Row 2: Today's revenue + MRR movement + Revenue by program */}
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr]">
            {/* Today's revenue */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11.5px] text-ink/55">Today's revenue</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-hero text-[22px] font-semibold tracking-tight text-ink">$3,120</span>
                    <span className="text-[11.5px] font-medium text-check">↗ +12.4%</span>
                    <span className="text-[11px] text-ink/45">vs $2,776 yesterday</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <RevenueLine />
                <div className="mt-1 flex justify-between text-[10px] text-ink/40">
                  <span>12 AM</span><span>12 PM</span><span>11 PM</span>
                </div>
              </div>
            </Card>

            {/* MRR movement */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11.5px] text-ink/55">MRR movement · 4w</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-hero text-[22px] font-semibold tracking-tight text-ink">+$9.4K</span>
                  </div>
                </div>
                <div className="text-right text-[10.5px] text-ink/45">
                  <div><span className="text-check">+$16.4K</span> gained</div>
                  <div><span className="text-ever">−$7K</span> lost</div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <MrrBar />
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-ink/60">
                  <LegendDot c="#4a7c6f" /> New +$11.4K
                  <LegendDot c="#8bbd7f" /> Expansion +$3.5K
                  <LegendDot c="#c4e07a" /> Reactivated +$1.5K
                  <LegendDot c="#f5b451" /> Downgrades −$1.8K
                  <LegendDot c="#e88d3a" /> Cancelled −$3.3K
                  <LegendDot c="#ee7273" /> Failed payments −$3.9K
                </div>
              </div>
            </Card>

            {/* Revenue by program */}
            <Card className="p-4">
              <div className="text-[11.5px] text-ink/55">Revenue by program · 30d</div>
              <div className="mt-2 flex items-center gap-4">
                <ProgramDonut data={revenue} />
                <div className="min-w-0 flex-1 space-y-1.5">
                  {revenue.slice(0, 5).map((r, i) => {
                    const color = ["#ee7273", "#171717", "#c4a265", "#4a7c6f", "#1D437B"][i];
                    return (
                      <div key={r.code} className="flex items-center gap-2 text-[11.5px]">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                        <span className="min-w-0 flex-1 truncate text-ink/75">{r.label.replace(" Weight Loss", "").replace("Tirzepatide", "Tirz").replace("Semaglutide", "Sema")}</span>
                        <span className="font-medium text-ink">{formatMoney(r.revenue)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Pipeline strip */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <PipelineTile label="In review" count={pipeline.inReview} note="4 stuck · 36h" tone="honey" />
            <PipelineTile label="Approved" count={pipeline.approved} note="On pace" tone="check" />
            <PipelineTile label="At pharmacy" count={pipeline.atPharmacy} note="2 stuck · 3d" tone="marine" />
            <PipelineTile label="Shipped" count={pipeline.shipped} note="1 stuck · 6d" tone="ink" />
            <PipelineTile label="Delivered" count={pipeline.delivered} note="Completed last 7d" tone="check" />
          </div>

          {/* Actions table */}
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[14px] font-semibold tracking-tight text-ink">Actions</h2>
                <p className="mt-0.5 text-[11.5px] text-ink/50">Prioritized tasks to keep operations moving</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden items-center gap-1.5 rounded-md border border-ink/[0.08] px-2.5 py-1 text-[11px] font-medium text-ink/60 hover:bg-ink/[0.03] sm:flex">
                  <Calendar className="h-3 w-3" /> Customize Columns
                </button>
                <button className="flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-3 flex flex-wrap items-center gap-1 border-b border-ink/[0.06]">
              {[
                { k: "all", label: "All", n: tabCounts.all },
                { k: "billing", label: "Billing", n: tabCounts.billing },
                { k: "patient_ops", label: "Patient ops", n: tabCounts.patient_ops },
                { k: "admin", label: "Admin", n: tabCounts.admin },
                { k: "unassigned", label: "Unassigned", n: tabCounts.unassigned },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k as typeof tab)}
                  className={`relative -mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-[12px] transition-colors ${
                    tab === t.k ? "border-ink font-semibold text-ink" : "border-transparent text-ink/50 hover:text-ink"
                  }`}
                >
                  <span>{t.label}</span>
                  <span className={`rounded px-1 text-[10px] font-semibold ${tab === t.k ? "bg-ink text-white" : "bg-ink/6 text-ink/50"}`}>{t.n}</span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="mt-1 overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-left text-[11px] text-ink/45">
                    <th className="py-2 pr-3 font-medium">Subject</th>
                    <th className="py-2 pr-3 font-medium">Age</th>
                    <th className="py-2 pr-3 font-medium">Required Action</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Assignee</th>
                    <th className="py-2 pr-3 font-medium">Category</th>
                    <th className="py-2 pr-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.id} className="border-t border-ink/[0.04] hover:bg-ink/[0.02]">
                      <td className="py-2.5 pr-3 font-medium text-ink">{t.subject}</td>
                      <td className="py-2.5 pr-3 text-ink/60">
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-honey" />
                          {t.ageHrs > 24 ? `${Math.floor(t.ageHrs / 24)}d` : `${t.ageHrs}h`}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-ink/75">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-ever" /> {t.action}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          t.status === "open" ? "text-ever" : t.status === "waiting" ? "text-honey" : "text-check"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            t.status === "open" ? "bg-ever" : t.status === "waiting" ? "bg-honey" : "bg-check"
                          }`} />
                          {t.status === "open" ? "Open" : t.status === "waiting" ? "Waiting" : "Done"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-ink/60 italic">{t.assignee || "Unassigned"}</td>
                      <td className="py-2.5 pr-3 text-ink/70">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="grid h-4 w-4 place-items-center rounded bg-ink/6 text-[9px] font-bold text-ink/60">
                            {t.category[0].toUpperCase()}
                          </span>
                          {t.category === "care_ops" ? "Care ops" : t.category[0].toUpperCase() + t.category.slice(1)}
                        </span>
                      </td>
                      <td className="py-2.5 pr-1 text-right text-ink/30">···</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/50">
              <div>{filteredTasks.length} row(s)</div>
              <div className="flex items-center gap-2">
                <span>Rows per page 10</span>
                <span>Page 1 of 2</span>
                <div className="flex items-center gap-0.5">
                  <button className="rounded p-1 hover:bg-ink/5">«</button>
                  <button className="rounded p-1 hover:bg-ink/5">‹</button>
                  <button className="rounded p-1 hover:bg-ink/5">›</button>
                  <button className="rounded p-1 hover:bg-ink/5">»</button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right sidebar column */}
        <aside className="space-y-4">
          {/* Quick actions */}
          <Card className="p-4">
            <div className="text-[13px] font-semibold text-ink">Quick actions</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <QuickTile icon={CreditCard} label="New order" to="/admin/orders" />
              <QuickTile icon={DollarSign} label="Update billing" to="/admin/payments" />
              <QuickTile icon={Calendar} label="Schedule" to="/admin/messages" />
              <QuickTile icon={Search} label="Quick lookup" to="/admin/patients" />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 text-ink/40" />
              <input placeholder="Lookup order # or patient…" className="flex-1 bg-transparent text-[11.5px] outline-none placeholder:text-ink/40" />
              <ArrowRight className="h-3.5 w-3.5 text-ink/30" />
            </div>
          </Card>

          {/* Patient funnel */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <span className="text-ink/40">▽</span> Patient funnel
                </div>
                <div className="mt-0.5 text-[11px] text-ink/50">Journey conversion · last 30 days</div>
              </div>
              <div className="text-right">
                <div className="font-hero text-[16px] font-semibold text-ink">10.4%</div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {funnel.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink/70">{f.label}</span>
                    <span className="tabular-nums text-ink/60">
                      <span className="font-semibold text-ink">{f.count.toLocaleString()}</span>
                      <span className="ml-1.5 text-[10.5px] text-ink/45">{f.pct.toFixed(1)}%</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/[0.05]">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Acquisition */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <span className="text-ink/40">▽</span> Acquisition
              </div>
              <div className="text-[11px] text-ink/45">last 30 days</div>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full">
              {acquisition.map((a) => (
                <div key={a.label} style={{ width: `${a.value}%`, background: a.color }} />
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-ink/70">
              {acquisition.map((a) => (
                <span key={a.label} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
                  {a.label} {a.value}%
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AdminShell>
  );
}

function LegendDot({ c }: { c: string }) {
  return <span className="mr-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full align-middle" style={{ background: c }} />;
}

function RevenueLine() {
  const points = [30, 32, 28, 34, 38, 36, 42, 46, 50, 55, 58, 62, 68, 72, 75, 78, 82, 84];
  return <Sparkline values={points} color="#171717" height={80} />;
}

function MrrBar() {
  // Colored segmented bar showing positive/negative movements
  const segments = mrrMovement();
  const total = segments.reduce((a, b) => a + Math.abs(b.value), 0);
  const colors = ["#4a7c6f", "#8bbd7f", "#c4e07a", "#f5b451", "#e88d3a", "#ee7273"];
  return (
    <div className="flex h-6 w-full overflow-hidden rounded-md">
      {segments.map((s, i) => (
        <div
          key={s.label}
          style={{ width: `${(Math.abs(s.value) / total) * 100}%`, background: colors[i] }}
          className="relative"
          title={`${s.label}: ${s.kind === "pos" ? "+" : "−"}$${Math.abs(s.value).toLocaleString()}`}
        />
      ))}
    </div>
  );
}

function ProgramDonut({ data }: { data: Array<{ code: string; revenue: number }> }) {
  const total = data.reduce((a, b) => a + b.revenue, 0);
  const colors = ["#ee7273", "#171717", "#c4a265", "#4a7c6f", "#1D437B", "#8b9bb4"];
  const size = 78;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = d.revenue / total;
    const len = c * pct;
    const seg = (
      <circle key={d.code} cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={colors[i % colors.length]} strokeWidth={stroke}
        strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    );
    offset += len;
    return seg;
  });
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(23,23,23,0.06)" strokeWidth={stroke} />
        {segments}
      </svg>
    </div>
  );
}

function PipelineTile({ label, count, note, tone }: { label: string; count: number; note: string; tone: "honey" | "check" | "marine" | "ink" }) {
  const toneMap = {
    honey: { bar: "bg-honey", text: "text-honey" },
    check: { bar: "bg-check", text: "text-check" },
    marine: { bar: "bg-marine", text: "text-marine" },
    ink: { bar: "bg-ink", text: "text-ink" },
  } as const;
  const t = toneMap[tone];
  // Striped mini bar
  return (
    <Card className="p-3">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1.5 text-[11.5px] text-ink/60">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${t.bar}`} />
          {label}
        </div>
        <div className="font-hero text-[16px] font-semibold text-ink">{count}</div>
      </div>
      <div className="mt-2 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className={`h-full flex-1 ${i < Math.min(16, Math.max(2, Math.round((count / 60) * 16))) ? t.bar : "bg-ink/[0.08]"}`} />
        ))}
      </div>
      <div className="mt-1.5 text-[10.5px] text-ink/45">{note}</div>
    </Card>
  );
}

function QuickTile({ icon: Icon, label, to }: { icon: typeof Package; label: string; to: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white p-2.5 hover:border-ink/20">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-ink/[0.04] text-ink/70">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <span className="text-[11.5px] font-medium text-ink">{label}</span>
    </Link>
  );
}
