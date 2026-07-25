import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/physician-queue")({
  head: () => ({ meta: [{ title: "Physician queue — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { cases, patients } = useActiveData();
    const name = (id: string) => patients.find((p) => p.id === id)?.name ?? id;
    return (
      <div className="space-y-4">
        <PageHeader title="Physician queue" subtitle={`${cases.length} cases awaiting review`} />
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Program</th><th className="px-3 py-2">Submitted</th><th className="px-3 py-2">SLA</th><th className="px-3 py-2">Flags</th><th className="px-3 py-2 w-40 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {cases.map((c) => (
                <tr key={c.id}>
                  <td className="px-3 py-2 font-semibold">{name(c.patientId)}</td>
                  <td className="px-3 py-2">{c.program}</td>
                  <td className="px-3 py-2 text-ink/60">{Math.round((Date.now() - c.submittedMs) / 60000)}m ago</td>
                  <td className="px-3 py-2"><Pill tone={c.slaHrs < 0 ? "critical" : c.slaHrs < 4 ? "warn" : "info"}>{c.slaHrs < 0 ? `${Math.abs(c.slaHrs)}h over` : `${c.slaHrs}h left`}</Pill></td>
                  <td className="px-3 py-2">{c.flags.length ? c.flags.join(", ") : <span className="text-ink/40">—</span>}</td>
                  <td className="px-3 py-2 text-right"><BrandButton onClick={() => toast.success("Approved & Rx routed")}>Approve</BrandButton></td>
                </tr>
              ))}
              {cases.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-ink/50">No cases in queue.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    );
  },
});
