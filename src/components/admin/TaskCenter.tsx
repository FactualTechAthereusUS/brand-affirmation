import { useState } from "react";
import { adminActions, useAdmin, type TaskCategory } from "@/lib/admin/store";
import { Card } from "./AdminShell";

const TABS: { key: TaskCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "billing", label: "Billing" },
  { key: "care_ops", label: "Clinical" },
  { key: "fulfillment", label: "Ops" },
  { key: "compliance", label: "Compliance" },
];

export function TaskCenter() {
  const tasks = useAdmin((s) => s.tasks);
  const [tab, setTab] = useState<TaskCategory | "all">("all");
  const filtered = tasks.filter((t) => t.status !== "done" && (tab === "all" || t.category === tab));
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-ink/[0.06] px-4 py-2.5">
        <div className="mr-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Task center</div>
        {TABS.map((t) => {
          const count = tasks.filter((tk) => tk.status !== "done" && (t.key === "all" || tk.category === t.key)).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                tab === t.key ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/[0.05]"
              }`}
            >
              {t.label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="divide-y divide-ink/[0.05]">
        {filtered.length === 0 && (
          <div className="p-6 text-center text-[12px] text-ink/45">Nothing here — enjoy the quiet.</div>
        )}
        {filtered.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink/[0.02]">
            <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.ageHrs > 48 ? "bg-ever" : t.ageHrs > 12 ? "bg-honey" : "bg-ink/40"}`} />
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-ink"><span className="font-medium">{t.subject}</span> — {t.action}</div>
              <div className="text-[10.5px] text-ink/45">{t.ageHrs}h ago · {t.assignee}</div>
            </div>
            <button
              onClick={() => adminActions.resolveTask(t.id)}
              className="rounded-md border border-ink/12 px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:border-ink hover:text-ink"
            >
              Resolve
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
