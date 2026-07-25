import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/admin/AdminShell";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-hero text-[22px] font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-ink/60">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SettingsCard({
  label, description, action, children, tone = "default",
}: {
  label: string; description?: string; action?: ReactNode; children: ReactNode;
  tone?: "default" | "warn" | "danger";
}) {
  const border = tone === "warn" ? "border-amber-300/50" : tone === "danger" ? "border-rose-300/50" : "border-ink/8";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className={`rounded-2xl border ${border} bg-white p-5 shadow-[0_1px_0_rgba(23,23,23,0.02)]`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</div>
          {description && <div className="mt-1 text-[12.5px] text-ink/60">{description}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}

export { Card };

export function Field({
  label, hint, error, children,
}: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-[11px] text-ink/45">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-rose-500">{error}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-ink/12 bg-white px-3 py-2.5 text-[13.5px] text-ink outline-none transition focus:border-ink/40 focus:ring-4 focus:ring-ink/8 disabled:opacity-60 ${className}`}
    />
  );
}

export function Select({ className = "", children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className={`w-full appearance-none rounded-xl border border-ink/12 bg-white px-3 py-2.5 text-[13.5px] text-ink outline-none transition focus:border-ink/40 focus:ring-4 focus:ring-ink/8 ${className}`}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && <div className="text-[13px] font-semibold text-ink">{label}</div>}
          {description && <div className="mt-0.5 text-[12px] text-ink/55">{description}</div>}
        </div>
      )}
      <button
        type="button" role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-ink" : "bg-ink/15"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-ink hover:text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-ink/30 text-ink focus:ring-2 focus:ring-ink/20" />
      <span>{label}</span>
    </label>
  );
}

export function SaveBar({ dirty, onSave, onDiscard, saving }: { dirty: boolean; onSave: () => void; onDiscard: () => void; saving?: boolean }) {
  if (!dirty) return null;
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
      className="sticky bottom-4 z-40 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-ink px-4 py-3 text-white shadow-[0_10px_30px_-10px_rgba(23,23,23,0.35)]"
    >
      <span className="text-[13px]">Unsaved changes</span>
      <div className="flex gap-2">
        <button onClick={onDiscard} className="rounded-full border border-white/20 px-4 py-1.5 text-[12.5px] font-semibold text-white/85 hover:bg-white/10">Discard</button>
        <button onClick={onSave} disabled={saving} className="rounded-full bg-white px-4 py-1.5 text-[12.5px] font-semibold text-ink hover:bg-white/90 disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </motion.div>
  );
}
