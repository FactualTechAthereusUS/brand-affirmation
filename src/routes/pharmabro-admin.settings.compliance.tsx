import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload, Download, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageHeader, SettingsCard, Field, Select, Toggle, TextInput } from "@/components/admin/settings/primitives";
import { StatusPill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type BAARecord } from "@/lib/admin/store";
import { downloadCsv } from "@/lib/admin/csv";

export const Route = createFileRoute("/pharmabro-admin/settings/compliance")({
  head: () => ({ meta: [{ title: "Compliance & HIPAA · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: CompliancePage,
});

const CHECKLIST = [
  { key: "encryption_rest",   label: "Encryption at rest",   detail: "AES-256" },
  { key: "encryption_transit",label: "Encryption in transit",detail: "TLS 1.3" },
  { key: "audit_logging",     label: "Audit logging",        detail: "Every action logged" },
  { key: "session_timeout",   label: "Session timeout",      detail: "4 hours set" },
  { key: "phi_in_urls",       label: "PHI in URLs",          detail: "None — all PHI behind API" },
  { key: "phi_in_emails",     label: "PHI in emails",        detail: "Portal-only clinical content" },
  { key: "breach_sop",        label: "Breach notification SOP", detail: "Document on file" },
];

const PHYSICIAN_LICENSES = [
  { name: "Dr. Scott Nass MD",       activeStates: 41, expiringSoon: "Idaho — Aug 30, 2026" },
  { name: "Dr. Frank Suppa DO",      activeStates: 38, expiringSoon: null as string | null },
  { name: "Dr. Courtney Patterson",  activeStates: 32, expiringSoon: "Mississippi — Sep 15, 2026" },
  { name: "Dr. May-Lynn Chu DO",     activeStates: 29, expiringSoon: null as string | null },
];

function CompliancePage() {
  const checklist = useAdmin((s) => s.settings.compliance.hipaaChecklist);
  const baa       = useAdmin((s) => s.settings.compliance.baa);
  const ls        = useAdmin((s) => s.settings.compliance.legitScript);
  const licenseAlerts = useAdmin((s) => s.settings.compliance.licenseExpiryAlerts);
  const auditLog  = useAdmin((s) => s.auditLog);

  const [actionFilter, setActionFilter] = useState<string>("all");
  const [actorFilter,  setActorFilter]  = useState<string>("all");
  const actors = useMemo(() => Array.from(new Set(auditLog.map((a) => a.actor))), [auditLog]);
  const filtered = auditLog.filter((a) =>
    (actorFilter  === "all" || a.actor  === actorFilter) &&
    (actionFilter === "all" || a.action.toLowerCase().includes(actionFilter.toLowerCase()))
  );

  const exportAudit = () => {
    const rows = filtered.map((a) => ({
      Timestamp: new Date(a.ts).toISOString(),
      Actor: a.actor,
      Action: a.action,
      TargetType: a.targetType ?? "",
      TargetID: a.targetId ?? "",
      Meta: a.meta ?? "",
    }));
    downloadCsv(`blissley-audit-log-${Date.now()}.csv`, rows);
    toast.success("Audit log exported");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Compliance & HIPAA" description="Legal and clinical compliance status." />

      <SettingsCard label="HIPAA status" action={<StatusPill tone="success"><ShieldCheck className="mr-1 inline h-3 w-3" /> Compliant</StatusPill>}>
        <div className="grid gap-2 md:grid-cols-2">
          {CHECKLIST.map((c) => (
            <div key={c.key} className="flex items-center justify-between rounded-xl border border-ink/8 bg-white px-3 py-2.5">
              <div>
                <div className="text-[13px] font-semibold text-ink">{c.label}</div>
                <div className="text-[11.5px] text-ink/50">{c.detail}</div>
              </div>
              <StatusPill tone={checklist[c.key] ? "success" : "warn"}>{checklist[c.key] ? "OK" : "Review"}</StatusPill>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="Business Associate Agreements (BAA)"
        description="Required with every vendor that handles PHI."
        action={<UploadBAAButton />}
      >
        <div className="overflow-hidden rounded-xl border border-ink/8">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Vendor</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 hidden md:table-cell">Type</th><th className="px-3 py-2 hidden lg:table-cell">Date</th><th className="px-3 py-2">Note</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {baa.map((b) => (
                <tr key={b.id} className={b.status === "website_tos" ? "bg-amber-50/40" : ""}>
                  <td className="px-3 py-2.5 font-semibold text-ink">{b.vendor}</td>
                  <td className="px-3 py-2.5">
                    <StatusPill tone={b.status === "signed" ? "success" : b.status === "website_tos" ? "warn" : b.status === "pending" ? "info" : "critical"}>
                      {b.status === "website_tos" ? "Website TOS" : b.status}
                    </StatusPill>
                  </td>
                  <td className="px-3 py-2.5 text-ink/70 hidden md:table-cell">{b.docType}</td>
                  <td className="px-3 py-2.5 text-ink/60 hidden lg:table-cell">{b.dateISO}</td>
                  <td className="px-3 py-2.5 text-[11.5px] text-ink/55">{b.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <SettingsCard label="LegitScript" action={<StatusPill tone="success">Certified</StatusPill>}>
        <div className="grid gap-3 sm:grid-cols-3 text-[13px]">
          <div><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Certification</div><div className="mt-1 font-semibold text-ink">Telehealth</div></div>
          <div><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Since</div><div className="mt-1 font-semibold text-ink">{ls.sinceISO}</div></div>
          <div><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Renewal due</div><div className="mt-1 font-semibold text-ink">{ls.renewalISO}</div></div>
        </div>
        <div className="mt-3 text-[11.5px] text-ink/55">Required for Meta ads, Google ads, TikTok ads.</div>
      </SettingsCard>

      <SettingsCard label="Audit log" description="Every admin action is logged automatically. Cannot be disabled or deleted."
        action={
          <button onClick={exportAudit} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white"><Download className="h-3.5 w-3.5" /> Export CSV</button>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="min-w-[180px]"><Field label="Actor"><Select value={actorFilter} onChange={(e) => setActorFilter(e.target.value)}><option value="all">All actors</option>{actors.map((a) => <option key={a} value={a}>{a}</option>)}</Select></Field></div>
          <div className="min-w-[180px] flex-1"><Field label="Action contains"><TextInput value={actionFilter === "all" ? "" : actionFilter} onChange={(e) => setActionFilter(e.target.value || "all")} placeholder="Filter…" /></Field></div>
        </div>
        <div className="max-h-[360px] overflow-auto rounded-xl border border-ink/8">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-[#faf9f6] text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Time</th><th className="px-3 py-2">Actor</th><th className="px-3 py-2">Action</th><th className="px-3 py-2 hidden md:table-cell">Target</th><th className="px-3 py-2 hidden lg:table-cell">Meta</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {filtered.slice(0, 100).map((a) => (
                <tr key={a.id}>
                  <td className="px-3 py-2 text-ink/60 whitespace-nowrap">{new Date(a.ts).toLocaleString()}</td>
                  <td className="px-3 py-2 text-ink font-semibold whitespace-nowrap">{a.actor}</td>
                  <td className="px-3 py-2 text-ink/80">{a.action}</td>
                  <td className="px-3 py-2 text-ink/60 hidden md:table-cell">{a.targetType ? `${a.targetType} · ${a.targetId ?? ""}` : "—"}</td>
                  <td className="px-3 py-2 text-ink/50 hidden lg:table-cell">{a.meta ?? "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-ink/40">No entries match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <SettingsCard label="Physician license monitoring" description="Read-only. Dr Telx manages license renewals.">
        <div className="mb-3">
          <Toggle checked={licenseAlerts} onChange={(v) => adminActions.updateSettingsSection("compliance", { licenseExpiryAlerts: v })}
            label="Notify me 60 days before any license expires" />
        </div>
        <div className="overflow-hidden rounded-xl border border-ink/8">
          <table className="w-full text-[13px]">
            <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              <tr><th className="px-3 py-2">Physician</th><th className="px-3 py-2 text-right">Active states</th><th className="px-3 py-2">Expiring soon</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {PHYSICIAN_LICENSES.map((p) => (
                <tr key={p.name}>
                  <td className="px-3 py-2.5 font-semibold text-ink">{p.name}</td>
                  <td className="px-3 py-2.5 text-right font-hero font-bold text-ink">{p.activeStates}</td>
                  <td className="px-3 py-2.5">{p.expiringSoon
                    ? <span className="inline-flex items-center gap-1 text-amber-700"><AlertTriangle className="h-3.5 w-3.5" /> {p.expiringSoon}</span>
                    : <span className="text-ink/40">None</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}

function UploadBAAButton() {
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [docType, setDocType] = useState("Full BAA");
  const submit = () => {
    if (!vendor.trim()) { toast.error("Vendor is required"); return; }
    const entry: Omit<BAARecord, "id"> = { vendor, status: "signed", docType, dateISO: new Date().toISOString().slice(0, 10) };
    adminActions.uploadBAA(entry);
    toast.success(`BAA uploaded for ${vendor}`);
    setOpen(false); setVendor(""); setDocType("Full BAA");
  };
  if (!open) return (
    <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white"><Upload className="h-3.5 w-3.5" /> Upload BAA</button>
  );
  return (
    <div className="flex items-center gap-2">
      <TextInput placeholder="Vendor name" value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-40" />
      <Select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-40"><option>Full BAA</option><option>Website TOS</option><option>Addendum</option></Select>
      <button onClick={submit} className="rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white">Save</button>
      <button onClick={() => setOpen(false)} className="text-[12px] text-ink/60">Cancel</button>
    </div>
  );
}
