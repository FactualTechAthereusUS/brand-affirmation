import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/pharmabro/BrandShell";

export const Route = createFileRoute("/pharmabro-admin/settings")({
  head: () => ({ meta: [{ title: "Brand settings — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: SettingsLayout,
});

const SUB = [
  { to: "/pharmabro-admin/settings", label: "General", exact: true },
  { to: "/pharmabro-admin/settings/stripe", label: "Stripe" },
  { to: "/pharmabro-admin/settings/team", label: "Team" },
  { to: "/pharmabro-admin/settings/pharmacy", label: "Pharmacy" },
  { to: "/pharmabro-admin/settings/states", label: "States served" },
  { to: "/pharmabro-admin/settings/notifications", label: "Notifications" },
  { to: "/pharmabro-admin/settings/integrations", label: "Integrations" },
  { to: "/pharmabro-admin/settings/compliance", label: "Compliance" },
  { to: "/pharmabro-admin/settings/legal", label: "Legal" },
];

function SettingsLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isSubActive = pathname !== "/pharmabro-admin/settings";
  return (
    <div className="space-y-4">
      {!isSubActive && <PageHeader title="Settings" subtitle="Everything about your brand — logos, colors, integrations, compliance." />}
      <div className="flex flex-wrap gap-1 rounded-lg border border-ink/[0.08] bg-white p-1">
        {SUB.map((s) => {
          const active = s.exact ? pathname === s.to : pathname === s.to || pathname.startsWith(s.to + "/");
          return (
            <Link key={s.to} to={s.to}
              className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${active ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/5"}`}>
              {s.label}
            </Link>
          );
        })}
      </div>
      {pathname === "/pharmabro-admin/settings" ? <GeneralSettings /> : <Outlet />}
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <div className="mb-3 text-[13.5px] font-bold text-ink">Brand identity</div>
        <GeneralForm />
      </Card>
      <Card className="p-5">
        <div className="mb-3 text-[13.5px] font-bold text-ink">Colors</div>
        <ThemeForm />
      </Card>
    </div>
  );
}

import { useState } from "react";
import { toast } from "sonner";
import { pharmabroActions, useActiveBrand } from "@/lib/pharmabro/store";

function GeneralForm() {
  const brand = useActiveBrand();
  const [name, setName] = useState(brand.name);
  const [supportEmail, setSupportEmail] = useState(brand.supportEmail);
  const [website, setWebsite] = useState(brand.website);
  return (
    <form onSubmit={(e) => { e.preventDefault(); pharmabroActions.updateBrandGeneral({ name, supportEmail, website }); toast.success("Brand info updated"); }}
      className="space-y-3">
      <Row label="Brand name"><Input value={name} onChange={setName} /></Row>
      <Row label="Support email"><Input value={supportEmail} onChange={setSupportEmail} /></Row>
      <Row label="Website"><Input value={website} onChange={setWebsite} /></Row>
      <div className="flex justify-end"><button type="submit" className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-white">Save</button></div>
    </form>
  );
}
function ThemeForm() {
  const brand = useActiveBrand();
  const [primary, setPrimary] = useState(brand.theme.primary);
  const [accent, setAccent] = useState(brand.theme.accent);
  return (
    <form onSubmit={(e) => { e.preventDefault(); pharmabroActions.updateBrandTheme({ primary, accent }); toast.success("Theme updated · applied everywhere"); }}
      className="space-y-3">
      <Row label="Primary color">
        <div className="flex items-center gap-2">
          <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-9 w-14 rounded border border-ink/12" />
          <Input value={primary} onChange={setPrimary} />
        </div>
      </Row>
      <Row label="Accent color">
        <div className="flex items-center gap-2">
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-14 rounded border border-ink/12" />
          <Input value={accent} onChange={setAccent} />
        </div>
      </Row>
      <div className="rounded-lg p-3" style={{ background: primary, color: brand.theme.primaryFg }}>
        Preview — <b>{brand.name}</b> primary button
      </div>
      <div className="flex justify-end"><button type="submit" className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-white">Apply theme</button></div>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">{label}</span>{children}</label>;
}
function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-ink/40" />;
}
