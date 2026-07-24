import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { AdminShell, Card, SectionTitle, StatusPill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Leads — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const leads = useAdmin((s) => s.leads);

  return (
    <AdminShell title="Leads · recovery">
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">In queue</div><div className="mt-1 font-hero text-2xl font-bold text-ink">{leads.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Contacted today</div><div className="mt-1 font-hero text-2xl font-bold text-ink">{leads.filter(l => l.contacted).length}</div></Card>
        <Card className="p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Recovery rate · 30d</div><div className="mt-1 font-hero text-2xl font-bold text-ink">18.4%</div></Card>
      </div>

      <Card className="p-5">
        <SectionTitle>Abandoned intakes</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[11px] uppercase tracking-[0.12em] text-ink/50">
                <th className="py-2.5 font-semibold">Lead</th>
                <th className="py-2.5 font-semibold">Last step</th>
                <th className="py-2.5 font-semibold">Program</th>
                <th className="py-2.5 font-semibold">Source</th>
                <th className="py-2.5 font-semibold">Age</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-ink/6 last:border-0">
                  <td className="py-3"><div className="font-semibold text-ink">{l.name}</div><div className="text-[11.5px] text-ink/50">{l.email}</div></td>
                  <td className="text-ink/75">{l.lastStep}</td>
                  <td className="text-ink/75">{l.program}</td>
                  <td className="text-ink/75">{l.source}</td>
                  <td className="text-ink/70">{l.ageHrs}h</td>
                  <td><StatusPill tone={l.contacted ? "success" : "warn"}>{l.contacted ? "contacted" : "queued"}</StatusPill></td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => adminActions.markLeadContacted(l.id)} className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white"><Mail className="mr-1 inline h-3 w-3" />Email</button>
                      <button onClick={() => adminActions.markLeadContacted(l.id)} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-ink ring-1 ring-ink/12"><MessageSquare className="mr-1 inline h-3 w-3" />SMS</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
