import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminShell, Card, Pill, timeAgo } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type TeamRole } from "@/lib/admin/store";
import { downloadCsv } from "@/lib/admin/csv";
import { toast } from "sonner";
import { UserPlus, Copy, RotateCcw, X, Shield, Download } from "lucide-react";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team — Blissley HQ" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TeamPage,
});

const ROLES: { value: TeamRole; label: string; hint: string }[] = [
  { value: "owner", label: "Owner", hint: "Full access — cannot be removed" },
  { value: "clinical", label: "Clinical", hint: "Physician queue, check-ins, PHI" },
  { value: "ops", label: "Operations", hint: "Orders, pharmacy, integrations" },
  { value: "support", label: "Support", hint: "Messages, refunds, patients read-only" },
];

const ROLE_TONE: Record<TeamRole, "success" | "info" | "warn" | "neutral"> = {
  owner: "success",
  clinical: "info",
  ops: "warn",
  support: "neutral",
};

function TeamPage() {
  const team = useAdmin((s) => s.settings.team);
  const physicians = useAdmin((s) => s.physicians);
  const audit = useAdmin((s) => s.auditLog);
  const [inviteOpen, setInviteOpen] = useState(false);

  const teamAudit = useMemo(
    () => audit.filter((a) => /team|member|invite|role/i.test(a.action)).slice(0, 8),
    [audit],
  );

  return (
    <AdminShell title="Team">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-hero text-[22px] font-bold tracking-tight text-ink">Team & access</h1>
          <p className="mt-1 text-[13px] text-ink/60">Operators, physicians, and role-based permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              adminActions.updateSettingsSection("team", { require2FA: !team.require2FA });
              toast.success(team.require2FA ? "2FA disabled" : "2FA enforced");
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition ${team.require2FA ? "border-check/40 bg-check/10 text-check" : "border-ink/12 bg-white text-ink/70 hover:bg-ink/5"}`}
          >
            <Shield className="h-3.5 w-3.5" /> {team.require2FA ? "2FA enforced" : "Enforce 2FA"}
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-ink/90"
          >
            <UserPlus className="h-3.5 w-3.5" /> Invite member
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Active members" value={team.members.filter((m) => m.status === "active").length} />
        <Kpi label="Pending invites" value={team.pendingInvites.length} tone={team.pendingInvites.length ? "warn" : "neutral"} />
        <Kpi label="Physicians" value={physicians.length} />
        <Kpi label="Session timeout" value={`${team.sessionTimeoutHours}h`} />
      </div>

      {/* Members table */}
      <Card className="mb-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/6 px-4 py-2.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Members</div>
          <div className="text-[11px] text-ink/45">{team.members.length} total</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/6 text-[10.5px] uppercase tracking-[0.12em] text-ink/45">
                <th className="px-4 py-2.5 font-semibold">Member</th>
                <th className="px-4 py-2.5 font-semibold">Role</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Last login</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.members.map((m) => (
                <tr key={m.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
                        {m.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{m.name}</div>
                        <div className="text-[11.5px] text-ink/50">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      disabled={m.role === "owner"}
                      value={m.role}
                      onChange={(e) => {
                        adminActions.updateTeamMemberRole(m.id, e.target.value as TeamRole);
                        toast.success(`${m.name} → ${e.target.value}`);
                      }}
                      className="rounded-md border border-ink/12 bg-white px-2 py-1 text-[12px] font-medium text-ink outline-none focus:border-ink/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={m.status === "active" ? "success" : m.status === "invited" ? "warn" : "critical"}>
                      {m.status}
                    </Pill>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-[12px] text-ink/60">
                    {m.lastLoginAt ? timeAgo(m.lastLoginAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={m.role === "owner"}
                      onClick={() => {
                        adminActions.removeTeamMember(m.id);
                        toast.success(`Removed ${m.name}`);
                      }}
                      className="rounded-md border border-ink/12 bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink/70 hover:bg-ever/5 hover:text-ever disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending invites */}
      {team.pendingInvites.length > 0 && (
        <Card className="mb-5 overflow-hidden">
          <div className="border-b border-ink/6 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
            Pending invites
          </div>
          <div className="divide-y divide-ink/5">
            {team.pendingInvites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink">{inv.email}</div>
                  <div className="mt-0.5 text-[11px] text-ink/50">
                    Invited as <span className="font-medium text-ink/70">{inv.role}</span> · sent {timeAgo(inv.invitedAt)} · expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/join?token=${inv.id}`).catch(() => {});
                    toast.success("Invite link copied");
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-ink/12 bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink/70 hover:bg-ink/5"
                >
                  <Copy className="h-3 w-3" /> Copy link
                </button>
                <button
                  onClick={() => toast.success(`Invite re-sent to ${inv.email}`)}
                  className="inline-flex items-center gap-1 rounded-md border border-ink/12 bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink/70 hover:bg-ink/5"
                >
                  <RotateCcw className="h-3 w-3" /> Resend
                </button>
                <button
                  onClick={() => {
                    adminActions.cancelInvite(inv.id);
                    toast.success("Invite revoked");
                  }}
                  className="rounded-md p-1.5 text-ink/50 hover:bg-ever/8 hover:text-ever"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Physicians panel */}
      <Card className="mb-5 overflow-hidden">
        <div className="border-b border-ink/6 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
          Physician panel
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/6 text-[10.5px] uppercase tracking-[0.12em] text-ink/45">
                <th className="px-4 py-2.5 font-semibold">Physician</th>
                <th className="px-4 py-2.5 text-right font-semibold">Cases reviewed</th>
                <th className="px-4 py-2.5 text-right font-semibold">Avg response</th>
                <th className="px-4 py-2.5 text-right font-semibold">Deny rate</th>
                <th className="px-4 py-2.5 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {physicians.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-ink/8 text-[11px] font-semibold text-ink">
                        {p.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{p.name}</div>
                        <div className="text-[11.5px] text-ink/50">Physician · licensed 12 states</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-ink">{p.casesReviewed}</td>
                  <td className={`px-4 py-3 text-right tabular-nums ${p.avgResponseHrs > 12 ? "text-ever" : p.avgResponseHrs > 6 ? "text-honey" : "text-check"}`}>
                    {p.avgResponseHrs}h
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink/70">{p.denialRate}%</td>
                  <td className="px-4 py-3 text-right"><Pill tone="success">Active</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Roles reference */}
      <Card className="mb-5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="font-hero text-[15px] font-semibold text-ink">Role permissions</div>
            <div className="mt-0.5 text-[11.5px] text-ink/55">What each role can see and do.</div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <div key={r.value} className="rounded-xl border border-ink/8 bg-ink/[0.015] p-3">
              <Pill tone={ROLE_TONE[r.value]}>{r.label}</Pill>
              <div className="mt-2 text-[12px] text-ink/60">{r.hint}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit trail */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="font-hero text-[15px] font-semibold text-ink">Recent team activity</div>
            <div className="mt-0.5 text-[11.5px] text-ink/55">Latest role & invite actions.</div>
          </div>
          <Link to="/admin/settings/compliance" className="text-[11px] font-semibold text-marine hover:underline">
            View full audit log →
          </Link>
        </div>
        {teamAudit.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink/10 py-6 text-center text-[12px] text-ink/45">
            No team activity yet.
          </div>
        ) : (
          <div className="divide-y divide-ink/5">
            {teamAudit.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 text-[12.5px]">
                <span className="text-ink/80">{a.action}</span>
                <span className="text-[11px] text-ink/45">{a.actor} · {timeAgo(a.ts)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {inviteOpen && <InviteDialog onClose={() => setInviteOpen(false)} />}
    </AdminShell>
  );
}

function Kpi({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "warn" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="rounded-xl border border-ink/8 bg-white p-4 shadow-[0_1px_0_rgba(23,23,23,0.02)]"
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</div>
      <div className={`mt-1 font-hero text-[22px] font-bold tabular-nums ${tone === "warn" ? "text-honey" : "text-ink"}`}>{value}</div>
    </motion.div>
  );
}

function InviteDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("support");

  const submit = () => {
    const clean = email.trim();
    if (!clean || !/@/.test(clean)) {
      toast.error("Enter a valid email");
      return;
    }
    adminActions.inviteTeamMember(clean, role);
    toast.success(`Invite sent to ${clean}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-2xl border border-ink/8 bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-hero text-[16px] font-semibold text-ink">Invite team member</div>
            <div className="mt-0.5 text-[12px] text-ink/55">They'll receive a link to accept and set a password.</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4" /></button>
        </div>

        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">Email</span>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="name@blissley.com" autoFocus
            className="w-full rounded-xl border border-ink/12 bg-white px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-ink/40 focus:ring-4 focus:ring-ink/8"
          />
        </label>

        <div className="mt-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">Role</div>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.filter((r) => r.value !== "owner").map((r) => {
              const active = role === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${active ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink hover:bg-ink/5"}`}
                >
                  <div className="text-[12.5px] font-semibold">{r.label}</div>
                  <div className={`mt-0.5 text-[11px] ${active ? "text-white/70" : "text-ink/55"}`}>{r.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink/70 hover:bg-ink/5">Cancel</button>
          <button onClick={submit} className="rounded-lg bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-ink/90">Send invite</button>
        </div>
      </motion.div>
    </div>
  );
}

// Unused import guard
void Download;
