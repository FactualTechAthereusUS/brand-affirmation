import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";
import { PageHeader, SettingsCard, Field, TextInput, Select, Toggle } from "@/components/admin/settings/primitives";
import { StatusPill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type TeamRole } from "@/lib/admin/store";

export const Route = createFileRoute("/pharmabro-admin/settings/team")({
  head: () => ({ meta: [{ title: "Team · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: TeamPage,
});

const ROLE_TONE: Record<TeamRole, "info" | "success" | "warn" | "neutral"> = {
  owner: "success", ops: "info", clinical: "warn", support: "neutral",
};

const ROLE_DESCRIPTIONS: { role: TeamRole; title: string; body: string[] }[] = [
  { role: "owner", title: "Owner", body: ["Full access to everything.", "Can add/remove team members, change pricing, integrations, settings.", "Can view finances and P&L.", "Cannot be removed."] },
  { role: "support", title: "Support", body: ["View: Patients, Orders, Payments, Messages.", "Action: send messages, issue refunds, pause/cancel subscriptions.", "Cannot view: analytics finances, P&L, settings, clinical PHI."] },
  { role: "ops", title: "Ops", body: ["View: Patients, Orders, Payments, Messages, Physician Queue (admin view only), Pharmacy, Check-Ins.", "Action: everything Support can do + flag cases, create orders, mark tasks complete.", "Cannot view: finances / P&L."] },
  { role: "clinical", title: "Clinical / Physician", body: ["Uses the separate physician portal.", "Never accesses this admin dashboard.", "Managed by Dr Telx network."] },
];

function TeamPage() {
  const members = useAdmin((s) => s.settings.team.members);
  const invites = useAdmin((s) => s.settings.team.pendingInvites);
  const require2FA = useAdmin((s) => s.settings.team.require2FA);
  const sessionHrs = useAdmin((s) => s.settings.team.sessionTimeoutHours);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("support");

  const invite = () => {
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    adminActions.inviteTeamMember(email, role);
    toast.success(`Invite sent to ${email}`);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Team" description="Who has access to the Blissley admin dashboard." />

      <SettingsCard label={`Members · ${members.length}`}>
        <div className="overflow-hidden rounded-xl border border-ink/8">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 hidden sm:table-cell">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2 hidden lg:table-cell">Last login</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-ink/2">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-blush/25 text-[11px] font-bold text-ink">{m.avatarInitials}</div>
                      <span className="font-semibold text-ink">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-ink/70 hidden sm:table-cell">{m.email}</td>
                  <td className="px-3 py-2.5">
                    <Select value={m.role} disabled={m.role === "owner"}
                      onChange={(e) => { adminActions.updateTeamMemberRole(m.id, e.target.value as TeamRole); toast.success(`${m.name} · role updated`); }}
                      className="max-w-[140px]"
                    >
                      <option value="owner" disabled>Owner</option>
                      <option value="ops">Ops</option>
                      <option value="support">Support</option>
                      <option value="clinical">Clinical</option>
                    </Select>
                  </td>
                  <td className="px-3 py-2.5 text-ink/60 hidden lg:table-cell">{m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleString() : "—"}</td>
                  <td className="px-3 py-2.5"><StatusPill tone={ROLE_TONE[m.role]}>{m.status}</StatusPill></td>
                  <td className="px-3 py-2.5 text-right">
                    {m.role === "owner" ? (
                      <span className="text-[11px] text-ink/40">Owner</span>
                    ) : (
                      <button onClick={() => { if (confirm(`Remove ${m.name}?`)) { adminActions.removeTeamMember(m.id); toast(`Removed ${m.name}`); } }}
                        className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink/70 hover:border-rose-300 hover:text-rose-600"
                      ><Trash2 className="h-3 w-3" /> Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invites.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Pending invites · {invites.length}</div>
            <div className="space-y-1.5">
              {invites.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-xl border border-ink/8 bg-[#faf9f6] px-3 py-2 text-[13px]">
                  <div>
                    <span className="font-semibold text-ink">{i.email}</span>
                    <span className="ml-2 text-[11.5px] text-ink/50">· {i.role} · expires {new Date(i.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => { adminActions.cancelInvite(i.id); toast("Invite cancelled"); }}
                    className="text-[11.5px] font-semibold text-ink/60 hover:text-rose-600">Cancel</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </SettingsCard>

      <SettingsCard label="Invite team member" description="New members set their own password on first login. Invites expire in 72 hours.">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <Field label="Email address"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@blissley.com" /></Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value as TeamRole)}>
              <option value="support">Support</option>
              <option value="ops">Ops</option>
              <option value="clinical">Clinical</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <button onClick={invite} className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-ink/90">
              <UserPlus className="h-4 w-4" /> Send invite
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard label="Roles & permissions">
        <div className="grid gap-3 md:grid-cols-2">
          {ROLE_DESCRIPTIONS.map((r) => (
            <div key={r.role} className="rounded-xl border border-ink/8 p-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-ink">{r.title}</div>
                <StatusPill tone={ROLE_TONE[r.role]}>{r.role}</StatusPill>
              </div>
              <ul className="mt-2 space-y-1 text-[12.5px] text-ink/65">
                {r.body.map((line, i) => <li key={i}>• {line}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="Authentication" description="HIPAA requires session-timeout controls for admin access.">
        <div className="space-y-4">
          <Toggle checked={require2FA} onChange={(v) => { adminActions.updateSettingsSection("team", { require2FA: v }); toast.success(`2FA ${v ? "required" : "optional"}`); }}
            label="Require 2FA for all team members"
            description="Every non-owner member is asked to set up an authenticator app on next login." />
          <Field label="Session timeout after">
            <Select value={sessionHrs} onChange={(e) => { adminActions.updateSettingsSection("team", { sessionTimeoutHours: Number(e.target.value) }); toast.success("Session timeout updated"); }}>
              <option value={1}>1 hour inactivity</option>
              <option value={4}>4 hours inactivity</option>
              <option value={8}>8 hours inactivity</option>
              <option value={24}>24 hours inactivity</option>
            </Select>
          </Field>
        </div>
      </SettingsCard>
    </div>
  );
}
