import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/check-ins")({
  head: () => ({ meta: [{ title: "Check-ins — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { checkIns, patients } = useActiveData();
    const name = (id: string) => patients.find((p) => p.id === id)?.name ?? id;
    return (
      <div className="space-y-4">
        <PageHeader title="Check-ins" subtitle={`${checkIns.length} check-ins`} />
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Due</th><th className="px-3 py-2">Weight (lbs)</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 w-48 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {checkIns.map((c) => (
                <tr key={c.id}>
                  <td className="px-3 py-2 font-semibold">{name(c.patientId)}</td>
                  <td className="px-3 py-2 text-ink/60">{new Date(c.dueMs).toLocaleDateString()}</td>
                  <td className="px-3 py-2 font-semibold">{c.weightLbs.toFixed(1)}</td>
                  <td className="px-3 py-2"><Pill tone={c.status === "approved" ? "success" : c.status === "held" ? "warn" : "info"}>{c.status}</Pill></td>
                  <td className="px-3 py-2 text-right"><BrandButton onClick={() => toast.success("Refill approved & shipped")}>Approve refill</BrandButton></td>
                </tr>
              ))}
              {checkIns.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-ink/50">No check-ins due.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    );
  },
});
