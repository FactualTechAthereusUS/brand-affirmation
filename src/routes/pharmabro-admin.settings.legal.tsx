import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Download, AlertTriangle, Pencil } from "lucide-react";
import { PageHeader, SettingsCard, Field, TextInput } from "@/components/admin/settings/primitives";
import { adminActions, useAdmin } from "@/lib/admin/store";
import { downloadCsv } from "@/lib/admin/csv";

export const Route = createFileRoute("/pharmabro-admin/settings/legal")({
  head: () => ({ meta: [{ title: "Legal & Policies · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: LegalPage,
});

function LegalPage() {
  const docs = useAdmin((s) => s.settings.legal.docs);
  const entity = useAdmin((s) => s.settings.legal.entity);
  const patients = useAdmin((s) => s.patients);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const openEdit = (key: string, body: string) => { setEditKey(key); setDraft(body); };
  const saveEdit = () => {
    if (editKey) { adminActions.updateLegalDoc(editKey, draft); toast.success("Document updated"); }
    setEditKey(null);
  };

  const exportConsent = () => {
    const rows = patients.slice(0, 50).map((p, i) => ({
      PatientID: p.id, Name: `${p.firstName} ${p.lastName}`, Email: p.email,
      ConsentTOS: "true", ConsentSMS: i % 3 === 0 ? "false" : "true",
      Version: "v2026.06.01", IP: `73.${(i * 7) % 255}.${(i * 3) % 255}.${(i * 5) % 255}`,
      TimestampISO: new Date(Date.now() - i * 3600_000).toISOString(),
    }));
    downloadCsv(`blissley-consent-records-${Date.now()}.csv`, rows);
    toast.success("Consent records exported");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Legal & Policies" description="Policy documents, consent records, and entity information." />

      <SettingsCard label="Platform documents" description="Documents live on the website. Edit here to update the last-updated timestamp.">
        <div className="divide-y divide-ink/6">
          {docs.map((d) => (
            <div key={d.key} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-ink">{d.label}</div>
                <div className="text-[11.5px] text-ink/50">{d.url} · updated {new Date(d.updatedAt).toLocaleDateString()}</div>
              </div>
              <a href={`https://${d.url}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ink/70 hover:border-ink/30 hover:text-ink">
                View <ExternalLink className="h-3 w-3" />
              </a>
              <button onClick={() => openEdit(d.key, d.body)} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-ink/90">
                <Pencil className="h-3 w-3" /> Edit
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="Patient consent records" description="Every patient checks two consent boxes at intake. Records stored per patient."
        action={<button onClick={exportConsent} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white"><Download className="h-3.5 w-3.5" /> Export CSV</button>}>
        <div className="grid gap-2 text-[13px] text-ink/70">
          <div>• Terms of Service + Privacy Policy + Telehealth Consent</div>
          <div>• SMS marketing opt-in</div>
        </div>
      </SettingsCard>

      <SettingsCard label="Pending legal items" tone="warn">
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <div className="text-[12.5px] text-amber-900">
            <div className="font-semibold">OpenLoop Health chargeback</div>
            <div className="mt-1">Charge cleared on Mercury credit card. OpenLoop confirmed acceptance (Igor Kashtan + Jessica Driskell in writing). No credit posted to Mercury yet. Expected auto-resolution: August 2026.</div>
            <div className="mt-1 text-amber-800/80">Status · monitoring</div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard label="Entity information">
        <div className="grid gap-3 sm:grid-cols-2">
          <Info k="Legal entity"    v={entity.legalName} />
          <Info k="Formation state" v={entity.formationState} />
          <Info k="Formation date"  v={new Date(entity.formationDateISO).toLocaleDateString()} />
          <Info k="EIN"             v={entity.ein} />
          <Info k="Registered agent" v={entity.registeredAgent} />
          <Info k="Bank"            v={`${entity.bank} · ending ${entity.bankLast4}`} />
        </div>
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">DBA filings</div>
          <div className="flex flex-wrap gap-2">
            {entity.dbaFilings.map((d) => (
              <span key={d.name} className="rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[12px] text-ink">
                <b>{d.name}</b> <span className="text-ink/50">· {new Date(d.dateISO).toLocaleDateString()}</span>
              </span>
            ))}
          </div>
        </div>
      </SettingsCard>

      {editKey && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setEditKey(null)}>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-[15px] font-bold text-ink">Edit · {docs.find((d) => d.key === editKey)?.label}</div>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
              className="h-64 w-full resize-none rounded-xl border border-ink/12 bg-white p-3 text-[13px] outline-none focus:border-ink/40" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setEditKey(null)} className="rounded-full border border-ink/12 px-4 py-1.5 text-[12.5px] font-semibold text-ink/70">Cancel</button>
              <button onClick={saveEdit} className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{k}</div>
      <div className="mt-1 text-[13px] font-semibold text-ink">{v}</div>
    </div>
  );
}
