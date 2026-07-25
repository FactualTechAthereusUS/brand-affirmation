import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/admin/check-ins")({
  head: () => ({ meta: [{ title: "Check-ins — Blissley Admin" }, { name: "description", content: "Day-85 through day-96 check-ins. Overdue holds pause the next refill." }] }),
  component: CheckInsPage,
});

const TABS = [
  { key: "due", label: "Due" },
  { key: "overdue", label: "Overdue (held)" },
  { key: "review", label: "Pending review" },
  { key: "done", label: "Completed" },
] as const;

function CheckInsPage() {
  const checkIns = useAdmin((s) => s.checkIns);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("due");

  const filtered = checkIns.filter((c) => {
    if (tab === "due") return c.decision === "clear" && c.day >= 85 && c.day <= 89;
    if (tab === "overdue") return c.decision === "hold";
    if (tab === "review") return c.decision === "review";
    return c.decision === "clear" && c.day >= 90;
  });

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Check-ins</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">Overdue check-ins automatically place the next refill on hold.</div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {TABS.map((t) => {
          const count = checkIns.filter((c) => {
            if (t.key === "due") return c.decision === "clear" && c.day >= 85 && c.day <= 89;
            if (t.key === "overdue") return c.decision === "hold";
            if (t.key === "review") return c.decision === "review";
            return c.decision === "clear" && c.day >= 90;
          }).length;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium ${active ? "bg-ink text-white" : "border border-ink/12 text-ink/60 hover:bg-ink/[0.03]"}`}>
              {t.label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 && <div className="p-8 text-center text-[12px] text-ink/45">Nothing in this bucket.</div>}
        <div className="divide-y divide-ink/[0.05]">
          {filtered.map((c) => (
            <div key={c.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 hover:bg-ink/[0.02] md:grid-cols-[220px_80px_100px_1fr_auto]">
              <div>
                <div className="text-[13px] font-semibold text-ink">{c.patientName}</div>
                <div className="text-[11px] text-ink/50">Day {c.day}</div>
              </div>
              <div className="hidden text-[12px] tabular-nums text-ink/70 md:block">
                {c.weight ? `${c.weight}lb` : "—"}
              </div>
              <div className="hidden text-[12px] tabular-nums md:block">
                {c.delta ? <span className="text-check">{c.delta}lb</span> : <span className="text-ink/40">—</span>}
              </div>
              <div className="hidden md:block">
                <Pill tone={c.decision === "clear" ? "success" : c.decision === "hold" ? "critical" : "warn"}>
                  {c.decision === "clear" ? "Clear · refill ok" : c.decision === "hold" ? "Overdue · refill held" : "Review needed"}
                </Pill>
                {c.sideEffects && c.sideEffects.length > 0 && (
                  <span className="ml-2 text-[11px] text-ink/50">SE: {c.sideEffects.join(", ")}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => adminActions.sendCheckInReminder(c.id)}
                  className="flex items-center gap-1 rounded-md border border-ink/12 px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:border-ink hover:text-ink">
                  <Bell className="h-3 w-3" /> Nudge
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
