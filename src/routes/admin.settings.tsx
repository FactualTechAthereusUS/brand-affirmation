import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { AdminShell, Card, SectionTitle, StatusPill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SettingsPage,
});

const INTEGRATIONS = [
  { name: "Stripe", desc: "Payments · subscriptions · refunds", status: "connected", tone: "success" as const },
  { name: "Klaviyo", desc: "Email + SMS lifecycle", status: "connected", tone: "success" as const },
  { name: "Wells Rx", desc: "Compounding pharmacy · NC", status: "connected", tone: "success" as const },
  { name: "EPIQ Scripts", desc: "Compounding pharmacy · TX", status: "connected", tone: "success" as const },
  { name: "Southend Pharmacy", desc: "Compounding pharmacy · NC", status: "connected", tone: "success" as const },
  { name: "TrueMeds Rx", desc: "Compounding pharmacy · CA", status: "pending", tone: "warn" as const },
  { name: "Striker Rx", desc: "Compounding pharmacy · FL", status: "not connected", tone: "neutral" as const },
  { name: "Shippo", desc: "Multi-carrier shipping", status: "connected", tone: "success" as const },
  { name: "Segment", desc: "Product analytics pipeline", status: "connected", tone: "success" as const },
  { name: "Meta Ads", desc: "Attribution + audiences", status: "connected", tone: "success" as const },
  { name: "Google Ads", desc: "Attribution + audiences", status: "connected", tone: "success" as const },
  { name: "Twilio", desc: "SMS + Voice", status: "connected", tone: "success" as const },
];

function SettingsPage() {
  const session = useAdmin((s) => s.session);
  const [tab, setTab] = useState<"profile" | "team" | "integrations" | "billing" | "danger">("integrations");

  return (
    <AdminShell title="Settings">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="p-2">
          {[
            { k: "profile", label: "Profile" },
            { k: "team", label: "Team & roles" },
            { k: "integrations", label: "Integrations" },
            { k: "billing", label: "Billing" },
            { k: "danger", label: "Danger zone" },
          ].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as typeof tab)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-[13px] font-medium ${tab === t.k ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"}`}>
              {t.label}
            </button>
          ))}
        </Card>

        <div className="space-y-4">
          {tab === "profile" && (
            <Card className="p-5">
              <SectionTitle>Profile</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Name" defaultValue={session?.name} />
                <Input label="Email" defaultValue={session?.email} />
                <Input label="Role" defaultValue="Founder / Admin" />
                <Input label="Timezone" defaultValue="America/Los_Angeles" />
              </div>
            </Card>
          )}
          {tab === "team" && (
            <Card className="p-5">
              <SectionTitle>Team & roles</SectionTitle>
              <div className="mt-2 divide-y divide-ink/6">
                {[
                  { name: "Alden Patel", email: "alden@blissley.com", role: "Founder" },
                  { name: "Andre F.", email: "andre@blissley.com", role: "Care Ops" },
                  { name: "Dr. Scott Nass", email: "scott.nass@blissley.md", role: "Physician" },
                  { name: "Julie Chen", email: "julie@blissley.com", role: "Growth" },
                ].map((m) => (
                  <div key={m.email} className="flex items-center gap-3 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-blush/25 text-[11.5px] font-semibold text-ink">{m.name.split(" ").map(s => s[0]).join("")}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink">{m.name}</div>
                      <div className="text-[11.5px] text-ink/50">{m.email}</div>
                    </div>
                    <StatusPill tone="info">{m.role}</StatusPill>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {tab === "integrations" && (
            <Card className="p-5">
              <SectionTitle action={<span className="text-[11px] font-semibold text-check">{INTEGRATIONS.filter(i => i.status === "connected").length} connected</span>}>Integrations</SectionTitle>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {INTEGRATIONS.map((i) => (
                  <div key={i.name} className="flex items-center gap-3 rounded-xl border border-ink/8 p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink/5 text-[11.5px] font-bold text-ink/70">{i.name.slice(0, 2).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink">{i.name}</div>
                      <div className="truncate text-[11.5px] text-ink/50">{i.desc}</div>
                    </div>
                    <StatusPill tone={i.tone}>{i.status}</StatusPill>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {tab === "billing" && (
            <Card className="p-5">
              <SectionTitle>Blissley HQ subscription</SectionTitle>
              <div className="mt-2 rounded-2xl border border-ink/8 bg-[#faf9f6] p-4">
                <div className="text-[13px] text-ink/60">Current plan</div>
                <div className="mt-1 font-hero text-2xl font-bold text-ink">Ops — Unlimited</div>
                <div className="mt-2 text-[12.5px] text-ink/60">$0/mo · included with Cloud</div>
              </div>
            </Card>
          )}
          {tab === "danger" && (
            <Card className="p-5">
              <SectionTitle>Danger zone</SectionTitle>
              <div className="rounded-2xl border border-ever/25 bg-ever/6 p-4">
                <div className="text-[13.5px] font-semibold text-ink">Reset demo data</div>
                <div className="mt-1 text-[12.5px] text-ink/70">Clears local admin state and re-seeds patients, orders, and payments.</div>
                <button onClick={() => { if (confirm("Reset admin demo state?")) adminActions.resetAll(); }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ever px-3 py-1.5 text-[12px] font-semibold text-white">
                  <RefreshCw className="h-3.5 w-3.5" /> Reset all
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Input({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</span>
      <input defaultValue={defaultValue} className="w-full rounded-xl border border-ink/12 bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-ever/50 focus:ring-4 focus:ring-ever/10" />
    </label>
  );
}
