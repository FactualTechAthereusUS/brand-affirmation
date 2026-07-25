import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { PageHeader, SettingsCard, Field, Select, Toggle } from "@/components/admin/settings/primitives";
import { StatusPill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type RoutingRule } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/settings/pharmacy-routing")({
  head: () => ({ meta: [{ title: "Pharmacy Routing · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: RoutingPage,
});

function RoutingPage() {
  const routing = useAdmin((s) => s.settings.routing);
  const pharmMap = new Map(routing.pharmacies.map((p) => [p.id, p]));

  return (
    <div className="space-y-4">
      <PageHeader title="Pharmacy Routing" description="Which pharmacy receives which prescription automatically." />

      <SettingsCard label="Auto-routing rules" description="When a physician approves a prescription, the first matching pharmacy receives the order.">
        <div className="space-y-3">
          {routing.rules.map((rule) => (
            <div key={rule.product} className="rounded-xl border border-ink/8 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{rule.label}</div>
                  {rule.meta && <div className="mt-0.5 text-[11.5px] text-ink/50">{rule.meta}</div>}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Primary pharmacy">
                  <Select value={rule.primaryId} onChange={(e) => { adminActions.setRoutingRule(rule.product as RoutingRule["product"], "primaryId", e.target.value); toast.success(`${rule.label} · primary updated`); }}>
                    {routing.pharmacies.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.statesCovered} states</option>)}
                  </Select>
                </Field>
                <Field label="Backup pharmacy">
                  <Select value={rule.backupId ?? ""} onChange={(e) => { adminActions.setRoutingRule(rule.product as RoutingRule["product"], "backupId", e.target.value || undefined); toast.success(`${rule.label} · backup updated`); }}>
                    <option value="">— None —</option>
                    {routing.pharmacies.filter((p) => p.id !== rule.primaryId).map((p) => <option key={p.id} value={p.id}>{p.name} · {p.statesCovered} states</option>)}
                  </Select>
                </Field>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-ink/55">
                {pharmMap.get(rule.primaryId)?.apiConnected && <StatusPill tone="success">API connected</StatusPill>}
                <span>Primary: <b className="text-ink">{pharmMap.get(rule.primaryId)?.name}</b></span>
                {rule.backupId && <span>· Backup: <b className="text-ink">{pharmMap.get(rule.backupId)?.name}</b></span>}
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="Pharmacy contacts">
        <div className="grid gap-3 md:grid-cols-2">
          {routing.pharmacies.map((p) => (
            <div key={p.id} className="rounded-xl border border-ink/8 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{p.name}</div>
                  <div className="mt-0.5 text-[11.5px] text-ink/50">Contact · {p.contact}</div>
                </div>
                <StatusPill tone={p.status === "primary" ? "success" : p.status === "backup" ? "info" : p.status === "standby" ? "neutral" : "warn"}>{p.status}</StatusPill>
              </div>
              <div className="mt-3 space-y-1 text-[12.5px] text-ink/70">
                <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-ink/40" /> {p.email}</div>
                {p.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-ink/40" /> {p.phone}</div>}
                <div className="text-ink/50">States covered · <b className="text-ink">{p.statesCovered}</b></div>
              </div>
              {p.notes && (
                <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11.5px] text-amber-900">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span>{p.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="South End · Version A compliance" tone={routing.versionAEnforced ? "default" : "warn"}
        description="Semaglutide titration must follow Version A per South End and FDA/USP rules. Version B (single 5 mg/mL vial from month 1) is prohibited.">
        <div className="space-y-3">
          <div className="rounded-xl border border-ink/8 bg-[#faf9f6] p-3 text-[12.5px] text-ink/70">
            <div><b className="text-ink">Months 1–2:</b> SE1.5 (1.5 mg/mL) — starter vial</div>
            <div><b className="text-ink">Month 3+:</b>  SE5 (5 mg/mL) — maintenance vial</div>
            <div className="mt-1 text-[11.5px] text-ink/50">28-day post-puncture discard applies.</div>
          </div>
          <Toggle
            checked={routing.versionAEnforced}
            onChange={(v) => { adminActions.toggleVersionA(v); toast[v ? "success" : "warning"](`Version A ${v ? "enforced" : "disabled"}`); }}
            label="Version A enforced in Rx builder"
            description={routing.versionAEnforced ? `Confirmed by ${routing.versionAConfirmedBy} on ${routing.versionAConfirmedAtISO}` : "Rx builder will allow non-compliant vials — not recommended."}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
