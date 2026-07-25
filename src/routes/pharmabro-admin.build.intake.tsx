import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Plus, Trash2, Eye } from "lucide-react";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand, useActiveData, type IntakeScreen } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/build/intake")({
  head: () => ({ meta: [{ title: "Intake builder — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: IntakeBuilder,
});

function IntakeBuilder() {
  const brand = useActiveBrand();
  const { intake } = useActiveData();
  const [selectedId, setSelectedId] = useState(intake.screens[0]?.id ?? "");
  const screen = intake.screens.find((s) => s.id === selectedId) ?? intake.screens[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-[22px] font-bold text-ink tracking-tight">Intake builder</h1>
          <p className="text-[12.5px] text-ink/55">Build and customize your patient intake quiz — clinical screens are locked for safety.</p>
        </div>
        <div className="flex gap-1.5">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/70"><Eye className="h-3.5 w-3.5" /> Preview quiz</button>
          <BrandButton onClick={() => toast.success("Intake published to live quiz")}>Publish</BrandButton>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[300px_1fr_340px]">
        {/* Left screen list */}
        <Card className="max-h-[calc(100vh-160px)] overflow-y-auto p-2">
          <div className="mb-2 px-2 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Screens · {intake.screens.length}</div>
          <div className="space-y-0.5">
            {intake.screens.map((s, i) => (
              <button key={s.id} onClick={() => setSelectedId(s.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] ${selectedId === s.id ? "font-semibold" : "text-ink/65 hover:bg-ink/5"}`}
                style={selectedId === s.id ? { background: `color-mix(in oklab, ${brand.theme.primary} 10%, transparent)`, color: brand.theme.primary } : undefined}
              >
                <span className="font-mono text-[10px] text-ink/40 w-6">{i + 1}</span>
                <span className="flex-1 truncate">{s.name}</span>
                {s.locked && <Lock className="h-3 w-3 text-ink/40" />}
                {!s.locked && (
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.active ? "bg-emerald-500" : "bg-ink/25"}`} />
                )}
                {s.required && <Pill tone="warn">req</Pill>}
              </button>
            ))}
          </div>
        </Card>

        {/* Center preview */}
        <Card className="max-h-[calc(100vh-160px)] overflow-y-auto p-6 bg-[#f4f4f2]">
          {screen && (
            <div className="mx-auto max-w-[380px] rounded-3xl border border-ink/10 bg-white p-6 shadow-lg">
              <div className="mb-4 h-1.5 rounded-full bg-ink/5">
                <div className="h-full rounded-full" style={{ width: "45%", background: brand.theme.primary }} />
              </div>
              <div className="mb-6 text-[17px] font-bold leading-snug text-ink">{screen.question}</div>
              {screen.type === "single" || screen.type === "multi" ? (
                <div className="space-y-2">
                  {screen.options.map((o) => (
                    <div key={o.id} className="rounded-xl border border-ink/12 p-3 text-[13px] text-ink hover:border-ink/40">{o.label}</div>
                  ))}
                </div>
              ) : screen.type === "text" || screen.type === "number" ? (
                <input placeholder={`Enter ${screen.type}...`} className="w-full rounded-xl border border-ink/12 p-3 text-[13px]" />
              ) : screen.type === "date" ? (
                <input type="date" className="w-full rounded-xl border border-ink/12 p-3 text-[13px]" />
              ) : screen.type === "info" ? (
                <div className="rounded-xl bg-ink/5 p-4 text-[13px] text-ink/70">Info slide — no input.</div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-ink/20 p-8 text-center text-[12px] text-ink/50">File upload</div>
              )}
              <button className="mt-6 w-full rounded-full py-3 text-[14px] font-semibold" style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>Continue</button>
            </div>
          )}
        </Card>

        {/* Right settings */}
        <Card className="max-h-[calc(100vh-160px)] overflow-y-auto p-4">
          {screen && <ScreenSettings screen={screen} />}
        </Card>
      </div>
    </div>
  );
}

function ScreenSettings({ screen }: { screen: IntakeScreen }) {
  const update = (patch: Partial<IntakeScreen>) => pharmabroActions.updateIntakeScreen(screen.id, patch);

  if (screen.locked) {
    return (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-amber-600" />
          <div className="text-[13px] font-bold text-ink">Clinical requirement — locked</div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">
          This screen is required by PharmaBro's physician network for clinical safety. Questions cannot be modified.
        </div>
        <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">You can customize</div>
        <ul className="mt-1 space-y-1 text-[12.5px] text-ink/70">
          <li>→ Headline copy tone</li>
          <li>→ Brand colors + fonts (global)</li>
        </ul>
        <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">You cannot modify</div>
        <ul className="mt-1 space-y-1 text-[12.5px] text-ink/70">
          <li>→ Question content</li>
          <li>→ Answer options</li>
          <li>→ Clinical logic / routing</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Screen</div>
        <div className="text-[15px] font-bold text-ink">{screen.name}</div>
      </div>
      <SmField label="Screen type">
        <select value={screen.type} onChange={(e) => update({ type: e.target.value as IntakeScreen["type"] })}
          className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px]">
          {["single", "multi", "text", "number", "date", "info", "upload"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </SmField>
      <SmField label="Question copy">
        <textarea value={screen.question} onChange={(e) => update({ question: e.target.value })}
          rows={3} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px]" />
      </SmField>
      {(screen.type === "single" || screen.type === "multi") && (
        <SmField label={`Answer options · ${screen.options.length}`}>
          <div className="space-y-1.5">
            {screen.options.map((o, i) => (
              <div key={o.id} className="flex items-center gap-1">
                <input value={o.label} onChange={(e) => {
                  const next = [...screen.options]; next[i] = { ...o, label: e.target.value };
                  update({ options: next });
                }} className="flex-1 rounded-lg border border-ink/12 bg-white px-2 py-1 text-[12px]" />
                <button onClick={() => update({ options: screen.options.filter((x) => x.id !== o.id) })}
                  className="rounded-md p-1 text-rose-500 hover:bg-rose-50"><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
            <button onClick={() => update({ options: [...screen.options, { id: `o_${Date.now()}`, label: "New option" }] })}
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-ink/20 py-1.5 text-[11px] font-semibold text-ink/50">
              <Plus className="h-3 w-3" /> Add option
            </button>
          </div>
        </SmField>
      )}
      <SmField label="Klaviyo event"><input value={screen.klaviyoEvent ?? ""} onChange={(e) => update({ klaviyoEvent: e.target.value })} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px]" /></SmField>
      <SmField label="Store answer as"><input value={screen.storeAs} onChange={(e) => update({ storeAs: e.target.value })} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px]" /></SmField>
      <div className="flex items-center justify-between rounded-lg border border-ink/8 bg-[#faf9f6] p-2.5 text-[12px]">
        <span className="text-ink/70">Screen active</span>
        <button onClick={() => pharmabroActions.toggleIntakeScreen(screen.id)}
          className={`h-5 w-9 rounded-full transition ${screen.active ? "bg-emerald-500" : "bg-ink/20"}`}>
          <span className={`block h-4 w-4 translate-y-0.5 rounded-full bg-white transition ${screen.active ? "translate-x-[18px]" : "translate-x-0.5"}`} />
        </button>
      </div>
    </div>
  );
}

function SmField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">{label}</span>{children}</label>;
}
