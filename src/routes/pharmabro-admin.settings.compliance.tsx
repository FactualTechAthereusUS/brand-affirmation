import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";
import { CheckCircle2, Download } from "lucide-react";
import { downloadCsv } from "@/lib/admin/csv";

export const Route = createFileRoute("/pharmabro-admin/settings/compliance")({
  head: () => ({ meta: [{ title: "Compliance · Settings" }, { name: "robots", content: "noindex" }] }),
  component: CompliancePage,
});

function CompliancePage() {
  const { audit } = useActiveData();
  return (
    <div className="space-y-3">
      <Card className="p-5">
        <div className="mb-3 text-[13.5px] font-bold text-ink">Compliance status</div>
        <div className="space-y-2 text-[12.5px]">
          <Row ok label="HIPAA compliance">Managed by PharmaBro</Row>
          <Row ok label="Business Associate Agreements">Signed on your behalf</Row>
          <Row ok label="LegitScript pathway">Approved via Stripe Healthcare</Row>
          <Row ok label="State pharmacy licensing">Coverage enforced automatically</Row>
        </div>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-ink">Audit log · {audit.length} entries</div>
          <button onClick={() => {
            downloadCsv(`audit-${Date.now()}.csv`, audit.map((a) => ({ TS: new Date(a.ts).toISOString(), Actor: a.actor, Action: a.action, Detail: a.detail })));
            toast.success("Audit exported");
          }}
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white"><Download className="h-3.5 w-3.5" /> Export CSV</button>
        </div>
        <div className="mt-3 max-h-96 overflow-y-auto rounded-lg border border-ink/8">
          <table className="w-full text-[12px]">
            <thead className="bg-[#faf9f6] text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-1.5">When</th><th className="px-3 py-1.5">Actor</th><th className="px-3 py-1.5">Action</th><th className="px-3 py-1.5">Detail</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {audit.slice(0, 100).map((a) => (
                <tr key={a.id}>
                  <td className="px-3 py-1.5 text-ink/55">{new Date(a.ts).toLocaleString()}</td>
                  <td className="px-3 py-1.5 font-semibold">{a.actor}</td>
                  <td className="px-3 py-1.5 font-mono text-[11px] text-ink/70">{a.action}</td>
                  <td className="px-3 py-1.5 text-ink/60 truncate max-w-[300px]">{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
function Row({ label, children, ok }: { label: string; children: React.ReactNode; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink/8 p-3">
      <div>
        <div className="font-semibold text-ink">{label}</div>
        <div className="text-[11.5px] text-ink/55">{children}</div>
      </div>
      {ok && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
    </div>
  );
}
