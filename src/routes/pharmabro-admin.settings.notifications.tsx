import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { PageHeader, SettingsCard, Field, TextInput, Select, Toggle, CheckRow } from "@/components/admin/settings/primitives";
import { adminActions, useAdmin, type AlertKey } from "@/lib/admin/store";

export const Route = createFileRoute("/pharmabro-admin/settings/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: NotificationsPage,
});

const GROUPS: { title: string; items: { key: AlertKey; label: string }[] }[] = [
  { title: "Clinical", items: [
    { key: "queue_over_12h",    label: "Physician queue has a case waiting >12 hours" },
    { key: "case_flagged_red",  label: "Any case flagged 🔴 (hard flag)" },
    { key: "denial_rate_high",  label: "Physician denial rate exceeds 15% this week" },
    { key: "checkin_overdue",   label: "Check-in overdue (patient past day 90)" },
  ]},
  { title: "Operations", items: [
    { key: "shipment_delayed",  label: "Shipment delayed (carrier exception)" },
    { key: "southend_api_down", label: "South End API goes down" },
    { key: "drtelx_api_down",   label: "Dr Telx API goes down" },
    { key: "lifefile_fail",     label: "LifeFile order submission fails" },
  ]},
  { title: "Financial", items: [
    { key: "payment_failed",    label: "Payment failed (any patient)" },
    { key: "refund_large",      label: "Refund issued over $500" },
    { key: "revenue_low",       label: "Daily revenue below threshold" },
    { key: "mrr_drop",          label: "MRR drops more than 5% week over week" },
    { key: "churn_high",        label: "Churn rate exceeds 10% this month" },
  ]},
  { title: "Growth", items: [
    { key: "new_patient",       label: "New patient signed up" },
    { key: "winback",           label: "Win-back reactivated" },
    { key: "sixmo_plan",        label: "6-month plan purchased" },
  ]},
];

const DIGEST_ITEMS = [
  { key: "mrr", label: "MRR snapshot" },
  { key: "new_patients", label: "New patients today" },
  { key: "churned", label: "Churned today" },
  { key: "queue", label: "Physician queue length" },
  { key: "shipments", label: "Shipments dispatched" },
  { key: "failed_payments", label: "Failed payments" },
  { key: "revenue", label: "Revenue vs yesterday" },
];

function NotificationsPage() {
  const alerts = useAdmin((s) => s.settings.notifications.alerts);
  const emails = useAdmin((s) => s.settings.notifications.emailRecipients);
  const sms = useAdmin((s) => s.settings.notifications.smsRecipient);
  const digest = useAdmin((s) => s.settings.notifications.digest);
  const [newEmail, setNewEmail] = useState("");

  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" description="What triggers an alert to you and your team." />

      <SettingsCard label="Admin alerts" description="Every check saves automatically.">
        <div className="grid gap-4 md:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.title} className="rounded-xl border border-ink/8 p-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{g.title}</div>
              <div className="space-y-0.5">
                {g.items.map((it) => (
                  <CheckRow key={it.key} label={it.label} checked={alerts[it.key]} onChange={() => { adminActions.toggleAlertKey(it.key); }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="Alert delivery">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Email recipients</div>
            <div className="flex flex-wrap gap-1.5">
              {emails.map((e) => (
                <span key={e} className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[12px] text-ink">
                  {e}
                  <button onClick={() => { adminActions.removeAlertEmail(e); toast("Recipient removed"); }} className="text-ink/40 hover:text-rose-500"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <form className="mt-2 flex gap-2" onSubmit={(ev) => { ev.preventDefault(); if (newEmail.includes("@")) { adminActions.addAlertEmail(newEmail); setNewEmail(""); toast.success("Recipient added"); } }}>
              <TextInput type="email" placeholder="add@blissley.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <button className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-[12px] font-semibold text-white"><Plus className="h-3.5 w-3.5" /> Add</button>
            </form>
          </div>
          <div>
            <Field label="SMS alerts (urgent only)">
              <TextInput value={sms} onChange={(e) => adminActions.updateSettingsSection("notifications", { smsRecipient: e.target.value })} placeholder="+1 (___) ___-____" />
            </Field>
            <div className="mt-2 rounded-lg border border-ink/8 bg-[#faf9f6] p-2.5 text-[11.5px] text-ink/60">
              Urgent = physician queue &gt;12h · API down · failed payment &gt;$1,000 · shipment delayed
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard label="Digest">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Toggle checked={digest.daily} onChange={(v) => adminActions.updateDigest({ daily: v })} label="Daily summary email" />
            <Field label="Send at">
              <Select value={digest.dailyTime} onChange={(e) => adminActions.updateDigest({ dailyTime: e.target.value })}>
                {["06:00","07:00","08:00","09:00","10:00","18:00"].map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Toggle checked={digest.weekly} onChange={(v) => adminActions.updateDigest({ weekly: v })} label="Weekly summary email" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Day">
                <Select value={digest.weeklyDay} onChange={(e) => adminActions.updateDigest({ weeklyDay: e.target.value })}>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d) => <option key={d}>{d}</option>)}
                </Select>
              </Field>
              <Field label="Time">
                <Select value={digest.weeklyTime} onChange={(e) => adminActions.updateDigest({ weeklyTime: e.target.value })}>
                  {["06:00","07:00","08:00","09:00","10:00","18:00"].map((t) => <option key={t}>{t}</option>)}
                </Select>
              </Field>
            </div>
          </div>
          <div className="rounded-xl border border-ink/8 p-3">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Digest includes</div>
            {DIGEST_ITEMS.map((i) => (
              <CheckRow key={i.key} label={i.label} checked={digest.items[i.key] ?? false} onChange={() => adminActions.toggleDigestItem(i.key)} />
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
