import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/team")({
  head: () => ({ meta: [{ title: "Team — Blissley Admin" }, { name: "description", content: "Roles, physicians, and access control." }] }),
  component: TeamPage,
});

const OPS = [
  { name: "Andre Ferreira", email: "andre@blissley.com", role: "Owner",   lastActive: "Now" },
  { name: "Riya Shah",      email: "riya@blissley.com",  role: "Ops",     lastActive: "2m ago" },
  { name: "Malik Jones",    email: "malik@blissley.com", role: "Support", lastActive: "18m ago" },
];

function TeamPage() {
  const physicians = useAdmin((s) => s.physicians);
  return (
    <AdminShell>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h1 className="font-hero text-[22px] font-semibold text-ink">Team</h1>
          <div className="mt-0.5 text-[11.5px] text-ink/55">Operators, physicians, and role-based access.</div>
        </div>
        <button className="rounded-lg bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white">Invite member</button>
      </div>

      <Card className="mb-4 overflow-hidden">
        <div className="border-b border-ink/[0.06] px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Operators</div>
        <div className="divide-y divide-ink/[0.05]">
          {OPS.map((o) => (
            <div key={o.email} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[12px] font-semibold text-white">{o.name.split(" ").map(n=>n[0]).join("")}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-ink">{o.name}</div>
                <div className="text-[11px] text-ink/50">{o.email}</div>
              </div>
              <Pill tone="info">{o.role}</Pill>
              <div className="w-24 text-right text-[11px] text-ink/45">{o.lastActive}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-ink/[0.06] px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Physician panel</div>
        <div className="divide-y divide-ink/[0.05]">
          {physicians.map((p) => (
            <div key={p.id} className="grid grid-cols-[auto_1fr_80px_100px_100px] items-center gap-3 px-4 py-3 text-[12px]">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-ever/20 text-[11px] font-semibold text-ever">{p.avatar}</div>
              <div>
                <div className="text-[13px] font-semibold text-ink">{p.name}</div>
                <div className="text-[11px] text-ink/50">Cases reviewed: {p.casesReviewed}</div>
              </div>
              <div className="tabular-nums text-ink/60">{p.avgResponseHrs}h avg</div>
              <div className="tabular-nums text-ink/60">{p.denialRate}% deny</div>
              <div className="text-right"><Pill tone="success">Active</Pill></div>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
