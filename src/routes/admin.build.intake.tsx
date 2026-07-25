import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AdminShell, Card, SectionTitle, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type IntakeScreen } from "@/lib/admin/store";
import { toast } from "sonner";
import { Lock, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/build/intake")({
  head: () => ({ meta: [{ title: "Intake builder — PharmaBro" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: IntakeBuilder,
});

function IntakeBuilder() {
  const screens = useAdmin((s) => s.build.intakeScreens);
  const [selId, setSelId] = useState<string>(screens[0]?.id ?? "");
  const sel = screens.find((s) => s.id === selId) ?? screens[0];

  return (
    <AdminShell title="Intake builder">
      <SectionTitle subtitle="Clinical screens are locked. Marketing and preference screens are freely editable.">Intake quiz builder</SectionTitle>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* List rail */}
        <div className="space-y-1.5">
          {screens.map((s, i) => {
            const active = sel?.id === s.id;
            return (
              <motion.button key={s.id}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                onClick={() => setSelId(s.id)}
                className={`flex w-full items-center gap-2 rounded-lg border p-2.5 text-left transition ${
                  active ? "border-ink bg-ink/[0.03]" : "border-ink/[0.08] hover:border-ink/25"
                }`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink/[0.05] text-[10.5px] font-semibold tabular-nums text-ink/70">{s.order}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 truncate text-[12.5px] font-semibold text-ink">
                    {s.locked && <Lock className="h-2.5 w-2.5 text-ink/45" />}
                    {s.name}
                  </div>
                  <div className="truncate text-[10.5px] text-ink/45">{s.type} · {s.storeAs}</div>
                </div>
                {!s.active && <EyeOff className="h-3 w-3 text-ink/35" />}
              </motion.button>
            );
          })}
        </div>

        {/* Editor */}
        {sel && <ScreenEditor screen={sel} />}
      </div>
    </AdminShell>
  );
}

function ScreenEditor({ screen }: { screen: IntakeScreen }) {
  const [newAns, setNewAns] = useState("");
  const disabled = screen.locked;
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
            Screen {screen.order}
            {screen.locked && <Pill tone="warn"><Lock className="h-2.5 w-2.5" /> Clinical · locked</Pill>}
          </div>
          <input value={screen.name} disabled={disabled}
            onChange={(e) => adminActions.updateIntakeScreen(screen.id, { name: e.target.value })}
            className="mt-1 w-full bg-transparent font-hero text-[16px] font-semibold text-ink outline-none disabled:text-ink/60" />
        </div>
        <button onClick={() => { adminActions.toggleIntakeScreenActive(screen.id); toast(screen.active ? "Screen hidden" : "Screen enabled"); }}
          className="flex items-center gap-1 rounded-md border border-ink/[0.1] px-2.5 py-1 text-[11.5px] text-ink hover:border-ink/25">
          {screen.active ? <><Eye className="h-3 w-3" /> Active</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Question copy">
          <textarea value={screen.question} disabled={disabled}
            onChange={(e) => adminActions.updateIntakeScreen(screen.id, { question: e.target.value })}
            className="w-full resize-none rounded-md border border-ink/[0.1] bg-white px-2.5 py-1.5 text-[12.5px] outline-none focus:border-ink/25 disabled:bg-ink/[0.02]" rows={3} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Type">
            <select value={screen.type} disabled={disabled}
              onChange={(e) => adminActions.updateIntakeScreen(screen.id, { type: e.target.value as IntakeScreen["type"] })}
              className="w-full rounded-md border border-ink/[0.1] bg-white px-2 py-1.5 text-[12.5px] outline-none">
              {["single","multi","text","number","date","info","upload"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Required">
            <select value={screen.required ? "y" : "n"} disabled={disabled}
              onChange={(e) => adminActions.updateIntakeScreen(screen.id, { required: e.target.value === "y" })}
              className="w-full rounded-md border border-ink/[0.1] bg-white px-2 py-1.5 text-[12.5px] outline-none">
              <option value="y">Yes</option><option value="n">No</option>
            </select>
          </Field>
          <Field label="Store as (variable)">
            <input value={screen.storeAs} disabled={disabled}
              onChange={(e) => adminActions.updateIntakeScreen(screen.id, { storeAs: e.target.value })}
              className="w-full rounded-md border border-ink/[0.1] bg-white px-2 py-1.5 text-[12.5px] outline-none" />
          </Field>
          <Field label="Klaviyo event">
            <input value={screen.klaviyoEvent}
              onChange={(e) => adminActions.updateIntakeScreen(screen.id, { klaviyoEvent: e.target.value })}
              className="w-full rounded-md border border-ink/[0.1] bg-white px-2 py-1.5 text-[12.5px] outline-none" />
          </Field>
        </div>
      </div>

      {(screen.type === "single" || screen.type === "multi") && (
        <div className="mt-4">
          <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/45">Answers</div>
          <div className="space-y-1.5">
            {screen.answers.map((a) => (
              <div key={a.id} className="flex items-center gap-2 rounded-md border border-ink/[0.08] bg-white px-2.5 py-1.5">
                <span className="text-[12.5px] text-ink">{a.label}</span>
                {!disabled && (
                  <button onClick={() => adminActions.removeIntakeAnswer(screen.id, a.id)} className="ml-auto text-ink/40 hover:text-ever">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {!disabled && (
            <div className="mt-2 flex gap-2">
              <input value={newAns} onChange={(e) => setNewAns(e.target.value)} placeholder="Add answer label…"
                className="flex-1 rounded-md border border-ink/[0.1] bg-white px-2.5 py-1.5 text-[12.5px] outline-none focus:border-ink/25" />
              <button onClick={() => { if (newAns.trim()) { adminActions.addIntakeAnswer(screen.id, newAns.trim()); setNewAns(""); } }}
                className="flex items-center gap-1 rounded-md bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/45">{label}</div>
      {children}
    </label>
  );
}
