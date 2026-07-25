import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { PageHeader, SettingsCard, Field, TextInput, Select, SaveBar } from "@/components/admin/settings/primitives";
import { StatusPill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type PricingConfig } from "@/lib/admin/store";

export const Route = createFileRoute("/pharmabro-admin/settings/plan-billing")({
  head: () => ({ meta: [{ title: "Plan & Billing · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PlanBillingPage,
});

const fmt = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

function PlanBillingPage() {
  const stripe = useAdmin((s) => s.settings.stripe);
  const pricing = useAdmin((s) => s.settings.pricing);
  const activePatients = useAdmin((s) => s.patients.filter((p) => p.status === "active").length);

  const infra = { stripe: 3783, klaviyo: 1200, hosting: 800 };
  const infraTotal = infra.stripe + infra.klaviyo + infra.hosting;

  const [st, setSt] = useState(stripe);
  const [pr, setPr] = useState<PricingConfig>(pricing);
  const dirtySt = useMemo(() => JSON.stringify(st) !== JSON.stringify(stripe), [st, stripe]);
  const dirtyPr = useMemo(() => JSON.stringify(pr) !== JSON.stringify(pricing), [pr, pricing]);
  const anyDirty = dirtySt || dirtyPr;

  const save = () => {
    if (dirtySt) adminActions.updateSettingsSection("stripe", st);
    if (dirtyPr) adminActions.updatePricing(pr);
    toast.success("Billing settings saved");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Plan & Billing" description="Infrastructure costs, Stripe configuration, and plan pricing." />

      <SettingsCard label="Infrastructure costs this month" description="Read-only — reconciled against connected accounts.">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { k: "Active patients", v: activePatients.toLocaleString() },
            { k: "Stripe fees",     v: fmt(infra.stripe) },
            { k: "Klaviyo",         v: fmt(infra.klaviyo) },
            { k: "Hosting / infra", v: fmt(infra.hosting) },
          ].map((row) => (
            <div key={row.k} className="rounded-xl border border-ink/8 bg-[#faf9f6] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{row.k}</div>
              <div className="mt-1 font-hero text-xl font-bold text-ink">{row.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-white">
          <span className="text-[13px]">Total infrastructure spend</span>
          <span className="font-hero text-lg font-bold">{fmt(infraTotal)}</span>
        </div>
      </SettingsCard>

      <SettingsCard label="Stripe" action={<a href="#" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink/70 hover:text-ink">Stripe dashboard <ExternalLink className="h-3.5 w-3.5" /></a>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ink/8 bg-[#faf9f6] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Account ID</div>
            <div className="mt-1 font-mono text-[12.5px] text-ink">{st.accountId}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusPill tone="success">Connected · {new Date(st.connectedAtISO).toLocaleDateString()}</StatusPill>
              <StatusPill tone={st.mode === "live" ? "success" : "warn"}>{st.mode === "live" ? "Live" : "Test"}</StatusPill>
              <StatusPill tone="success">Stripe Healthcare</StatusPill>
              <StatusPill tone="success">LegitScript</StatusPill>
            </div>
          </div>
          <div className="space-y-3">
            <Field label="Charge model">
              <Select value={st.chargeModel} onChange={(e) => setSt({ ...st, chargeModel: e.target.value as typeof st.chargeModel })}>
                <option value="manual">Manual capture (authorize → capture)</option>
                <option value="immediate">Immediate charge</option>
              </Select>
            </Field>
            <Field label="Payout schedule">
              <Select value={st.payoutSchedule} onChange={(e) => setSt({ ...st, payoutSchedule: e.target.value })}>
                <option>Automatic — every 2 days</option>
                <option>Automatic — daily</option>
                <option>Automatic — weekly</option>
                <option>Manual</option>
              </Select>
            </Field>
            <Field label="Payout bank">
              <TextInput value={`Mercury — account ending ${st.payoutBankLast4}`} readOnly />
            </Field>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard label="Plan Pricing" description="Changes affect new orders only. Existing subscribers keep their current price.">
        <div className="grid gap-4 lg:grid-cols-2">
          <PricingBlock title="Semaglutide" value={pr.sema} onChange={(v) => setPr({ ...pr, sema: v })} />
          <PricingBlock title="Tirzepatide" value={pr.tirze} onChange={(v) => setPr({ ...pr, tirze: v })} />
        </div>
        <div className="mt-4 rounded-xl border border-ink/8 bg-[#faf9f6] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Upsells</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Field label="Priority Review"><TextInput type="number" step="0.01" value={pr.upsells.priorityReview} onChange={(e) => setPr({ ...pr, upsells: { ...pr.upsells, priorityReview: Number(e.target.value) } })} /></Field>
            <Field label="Shipping Insurance (per month)"><TextInput type="number" step="0.01" value={pr.upsells.shippingInsurance} onChange={(e) => setPr({ ...pr, upsells: { ...pr.upsells, shippingInsurance: Number(e.target.value) } })} /></Field>
          </div>
        </div>
      </SettingsCard>

      <SaveBar dirty={anyDirty} onSave={save} onDiscard={() => { setSt(stripe); setPr(pricing); }} />
    </div>
  );
}

function PricingBlock({ title, value, onChange }: { title: string; value: PricingConfig["sema"]; onChange: (v: PricingConfig["sema"]) => void }) {
  const rows: { k: keyof typeof value; label: string }[] = [
    { k: "m1",       label: "Monthly · first month" },
    { k: "mOngoing", label: "Monthly · ongoing" },
    { k: "q3",       label: "3-Month" },
    { k: "q6",       label: "6-Month" },
  ];
  return (
    <div className="rounded-xl border border-ink/8 p-4">
      <div className="text-[13px] font-semibold text-ink">{title}</div>
      <div className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-[1fr_120px] items-center gap-2">
            <span className="text-[12.5px] text-ink/70">{r.label}</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-ink/40">$</span>
              <input type="number" value={value[r.k]} onChange={(e) => onChange({ ...value, [r.k]: Number(e.target.value) })}
                className="w-full rounded-lg border border-ink/12 bg-white py-1.5 pl-6 pr-2 text-right text-[13px] outline-none focus:border-ink/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
