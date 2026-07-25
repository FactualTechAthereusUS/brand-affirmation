import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { PageHeader, SettingsCard, Field, TextInput, Select, SaveBar } from "@/components/admin/settings/primitives";
import { adminActions, useAdmin, US_STATE_LIST } from "@/lib/admin/store";

export const Route = createFileRoute("/pharmabro-admin/settings/general")({
  head: () => ({ meta: [{ title: "General · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: GeneralPage,
});

function GeneralPage() {
  const business = useAdmin((s) => s.settings.business);
  const contact = useAdmin((s) => s.settings.contact);
  const brand = useAdmin((s) => s.settings.brand);

  const [b, setB] = useState(business);
  const [c, setC] = useState(contact);
  const [br, setBr] = useState(brand);

  const dirtyB = useMemo(() => JSON.stringify(b) !== JSON.stringify(business), [b, business]);
  const dirtyC = useMemo(() => JSON.stringify(c) !== JSON.stringify(contact), [c, contact]);
  const dirtyBr = useMemo(() => JSON.stringify(br) !== JSON.stringify(brand), [br, brand]);
  const anyDirty = dirtyB || dirtyC || dirtyBr;

  const saveAll = () => {
    if (dirtyB)  adminActions.updateSettingsSection("business", b);
    if (dirtyC)  adminActions.updateSettingsSection("contact", c);
    if (dirtyBr) adminActions.updateSettingsSection("brand", br);
    toast.success("General settings saved");
  };
  const discard = () => { setB(business); setC(contact); setBr(brand); };

  return (
    <div className="space-y-4">
      <PageHeader title="General settings" description="Business information, contact details, and brand identity." />

      <SettingsCard label="Business">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Business name (legal)"><TextInput value={b.legalName} onChange={(e) => setB({ ...b, legalName: e.target.value })} /></Field>
          <Field label="DBA (doing business as)"><TextInput value={b.dba} onChange={(e) => setB({ ...b, dba: e.target.value })} /></Field>
          <Field label="EIN"><TextInput value={b.ein} onChange={(e) => setB({ ...b, ein: e.target.value })} placeholder="XX-XXXXXXX" /></Field>
          <Field label="Business type">
            <Select value={b.businessType} onChange={(e) => setB({ ...b, businessType: e.target.value })}>
              <option>Telehealth Platform (Technology)</option>
              <option>Medical Practice</option>
              <option>Pharmacy</option>
              <option>Wellness Brand</option>
            </Select>
          </Field>
          <Field label="Registered state">
            <Select value={b.registeredState} onChange={(e) => setB({ ...b, registeredState: e.target.value })}>
              {US_STATE_LIST.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="Registered address"><TextInput value={b.address1} onChange={(e) => setB({ ...b, address1: e.target.value })} placeholder="Address line 1" /></Field>
          <Field label="City"><TextInput value={b.city} onChange={(e) => setB({ ...b, city: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="State">
              <Select value={b.state} onChange={(e) => setB({ ...b, state: e.target.value })}>
                {US_STATE_LIST.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
              </Select>
            </Field>
            <Field label="ZIP"><TextInput value={b.zip} onChange={(e) => setB({ ...b, zip: e.target.value })} /></Field>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard label="Contact">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Support email (patient-facing)"><TextInput type="email" value={c.supportEmail} onChange={(e) => setC({ ...c, supportEmail: e.target.value })} /></Field>
          <Field label="Transactional email"><TextInput type="email" value={c.transactionalEmail} onChange={(e) => setC({ ...c, transactionalEmail: e.target.value })} /></Field>
          <Field label="Support phone"><TextInput value={c.supportPhone} onChange={(e) => setC({ ...c, supportPhone: e.target.value })} /></Field>
          <Field label="Website"><TextInput value={c.website} onChange={(e) => setC({ ...c, website: e.target.value })} /></Field>
          <Field label="Patient portal URL"><TextInput value={c.portalUrl} onChange={(e) => setC({ ...c, portalUrl: e.target.value })} /></Field>
        </div>
      </SettingsCard>

      <SettingsCard label="Brand" description="Logo used in emails, portal, and admin. Brand color highlights buttons and pills.">
        <div className="grid gap-4 sm:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <Field label="Logo">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink/20 bg-ink/2 px-3 py-3 text-[12.5px] text-ink/60 hover:bg-ink/4">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader();
                  r.onload = () => setBr({ ...br, logoUrl: r.result as string });
                  r.readAsDataURL(f);
                }} />
                <span>{br.logoUrl ? "Replace logo" : "Upload logo"}</span>
                <span className="ml-auto text-[11px]">400×120px · PNG</span>
              </label>
            </Field>
            <Field label="Brand color">
              <div className="flex items-center gap-2">
                <input type="color" value={br.primaryColor} onChange={(e) => setBr({ ...br, primaryColor: e.target.value })}
                  className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-ink/12 bg-white p-1" />
                <TextInput value={br.primaryColor} onChange={(e) => setBr({ ...br, primaryColor: e.target.value })} />
              </div>
            </Field>
          </div>
          <div className="rounded-2xl border border-ink/8 bg-[#faf9f6] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">Preview</div>
            <div className="mt-3 flex h-24 items-center justify-center rounded-xl bg-white">
              {br.logoUrl
                ? <img src={br.logoUrl} alt="Logo" className="max-h-16 max-w-[80%] object-contain" />
                : <span className="font-hero text-xl font-bold text-ink">Blissley</span>}
            </div>
            <button type="button"
              className="mt-3 w-full rounded-full px-3 py-2 text-[12.5px] font-semibold text-white"
              style={{ background: br.primaryColor }}
            >Sample button</button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard label="Danger zone" tone="danger" description="Reset all admin demo data including patients, orders, and audit log.">
        <button
          onClick={() => { if (confirm("Reset all admin demo state? This cannot be undone.")) { adminActions.resetAll(); toast("Demo data reset"); } }}
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/60 bg-white px-4 py-1.5 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50"
        ><RefreshCw className="h-3.5 w-3.5" /> Reset all demo data</button>
      </SettingsCard>

      <SaveBar dirty={anyDirty} onSave={saveAll} onDiscard={discard} />
    </div>
  );
}
