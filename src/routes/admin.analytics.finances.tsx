import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { revenueByProgram, useAdmin, computeKpis } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/analytics/finances")({
  head: () => ({ meta: [{ title: "Finances — Blissley Admin" }, { name: "description", content: "P&L, unit economics, and revenue by program." }] }),
  component: FinancesPage,
});

function FinancesPage() {
  const role = useAdmin((s) => s.role);
  const kpi = useAdmin(computeKpis);
  if (role === "support" || role === "clinical") {
    return (
      <AdminShell>
        <Card className="grid h-60 place-items-center text-[12px] text-ink/50">Finances is restricted to Owner / Ops.</Card>
      </AdminShell>
    );
  }

  const revenue = 168_240;
  const cogs = 52_800;
  const opex = 61_400;
  const net = revenue - cogs - opex;

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Finances</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">Income statement, unit economics, and upcoming payables.</div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr]">
        <Card className="p-4">
          <SectionTitle subtitle="Last 30 days">Income statement</SectionTitle>
          <table className="w-full text-[12.5px]">
            <tbody className="divide-y divide-ink/[0.05] tabular-nums">
              <tr><td className="py-1.5 text-ink">Revenue</td><td className="py-1.5 text-right text-ink">${revenue.toLocaleString()}</td></tr>
              <tr><td className="py-1.5 text-ink/60">COGS</td><td className="py-1.5 text-right text-ever">−${cogs.toLocaleString()}</td></tr>
              <tr><td className="py-1.5 text-ink font-semibold">Gross profit</td><td className="py-1.5 text-right text-ink font-semibold">${(revenue - cogs).toLocaleString()}</td></tr>
              <tr><td className="py-1.5 text-ink/60">OpEx</td><td className="py-1.5 text-right text-ever">−${opex.toLocaleString()}</td></tr>
              <tr><td className="py-1.5 text-ink font-semibold">Net</td><td className="py-1.5 text-right text-check font-semibold">${net.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <SectionTitle subtitle="Blended values">Unit economics</SectionTitle>
          <div className="grid grid-cols-2 gap-y-3 text-[12px]">
            <M label="CAC" v="$92" />
            <M label="LTV" v="$1,240" />
            <M label="LTV:CAC" v="13.5×" />
            <M label="Payback" v="2.1 mo" />
            <M label="Gross margin" v="68.4%" />
            <M label="Monthly churn" v="7.1%" />
            <M label="MRR" v={`$${kpi.mrr.toLocaleString()}`} />
            <M label="ARR" v={`$${(kpi.mrr * 12).toLocaleString()}`} />
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle subtitle="From Mercury">Upcoming payables</SectionTitle>
          <div className="space-y-2 text-[12.5px]">
            <Row label="South End Compounding" amount={18420} due="Jul 28" />
            <Row label="Dr. Telx (physician panel)" amount={9600} due="Jul 30" />
            <Row label="Meta Ads" amount={12480} due="Jul 31" />
            <Row label="Klaviyo" amount={480} due="Aug 1" />
            <Row label="Payroll" amount={22000} due="Aug 5" />
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-4">
        <SectionTitle subtitle="Programs ranked by revenue contribution">Revenue by program</SectionTitle>
        <div className="space-y-2">
          {revenueByProgram().map((r) => (
            <div key={r.code} className="grid grid-cols-[220px_1fr_80px_80px] items-center gap-3 text-[12.5px]">
              <div className="text-ink">{r.label}</div>
              <div className="rounded bg-ink/[0.04]"><div className="h-2.5 rounded bg-ink" style={{ width: `${(r.revenue / 42600) * 100}%` }} /></div>
              <div className="text-right tabular-nums text-ink">${r.revenue.toLocaleString()}</div>
              <div className="text-right text-ink/60">{r.patients} pts</div>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}

function M({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">{label}</div>
      <div className="mt-0.5 font-hero text-[18px] font-semibold text-ink tabular-nums">{v}</div>
    </div>
  );
}

function Row({ label, amount, due }: { label: string; amount: number; due: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-ink/[0.05] py-2 last:border-0">
      <div className="flex-1 text-ink">{label}</div>
      <div className="text-[11px] text-ink/45">Due {due}</div>
      <div className="w-20 text-right tabular-nums text-ink">${amount.toLocaleString()}</div>
    </div>
  );
}
