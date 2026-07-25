import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type CheckIn } from "@/lib/admin/store";
import { Bell, Search, ChevronRight, Check } from "lucide-react";

export const Route = createFileRoute("/admin/check-ins")({
  head: () => ({ meta: [
    { title: "Check-ins — Blissley HQ" },
    { name: "description", content: "Monthly check-ins with weight deltas, side effects, and refill approval." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: CheckInsPage,
});

type TabKey = "due" | "review" | "held" | "6mo" | "done";

const TABS: { key: TabKey; label: string }[] = [
  { key: "due", label: "Due this week" },
  { key: "review", label: "Physician review" },
  { key: "held", label: "Held (overdue)" },
  { key: "6mo", label: "6-month refresh" },
  { key: "done", label: "Completed today" },
];

function belongs(c: CheckIn, k: TabKey): boolean {
  if (k === "due") return c.decision === "clear" && c.day >= 85 && c.day <= 89;
  if (k === "review") return c.decision === "review";
  if (k === "held") return c.decision === "hold" || c.decision === "held";
  if (k === "6mo") return c.kind === "sixMonth";
  return c.decision === "approved" || c.decision === "adjusted";
}

function CheckInsPage() {
  const checkIns = useAdmin((s) => s.checkIns);
  const [tab, setTab] = useState<TabKey>("due");
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return checkIns.filter((c) => belongs(c, tab)).filter((c) => !qq || c.patientName.toLowerCase().includes(qq));
  }, [checkIns, tab, q]);

  const counts: Record<TabKey, number> = {
    due: checkIns.filter((c) => belongs(c, "due")).length,
    review: checkIns.filter((c) => belongs(c, "review")).length,
    held: checkIns.filter((c) => belongs(c, "held")).length,
    "6mo": checkIns.filter((c) => belongs(c, "6mo")).length,
    done: checkIns.filter((c) => belongs(c, "done")).length,
  };

  // Metrics
  const total = checkIns.length || 1;
  const completed = checkIns.filter((c) => c.decision === "approved" || c.decision === "adjusted" || c.decision === "clear").length;
  const completionRate = ((completed / total) * 100).toFixed(0);
  const avgLoss = (() => {
    const withDelta = checkIns.filter((c) => typeof c.delta === "number");
    if (withDelta.length === 0) return "—";
    const avg = withDelta.reduce((s, c) => s + (c.delta ?? 0), 0) / withDelta.length;
    return `${avg > 0 ? "+" : ""}${avg.toFixed(1)} lbs`;
  })();
  const flagged = checkIns.filter((c) => (c.sideEffects?.length ?? 0) > 0).length;

  return (
    <AdminShell title="Check-ins">
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        <Metric label="Due this week" value={counts.due} sub="target 90% response" />
        <Metric label="Overdue (held)" value={counts.held} sub="refill paused" tone={counts.held > 0 ? "critical" : "neutral"} />
        <Metric label="Physician review" value={counts.review} sub="needs decision" tone={counts.review > 0 ? "warn" : "neutral"} />
        <Metric label="Avg weight change" value={avgLoss} sub="last 30 days" tone="success" />
        <Metric label="Flagged side effects" value={flagged} sub="past 7 days" />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient…"
            className="w-full rounded-lg bg-ink/[0.04] py-1.5 pl-9 pr-3 text-[12.5px] outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1 focus:ring-marine/30" />
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium ${active ? "bg-ink text-white" : "border border-ink/12 text-ink/60 hover:bg-ink/[0.03]"}`}>
              {t.label} <span className="ml-1 opacity-70">{counts[t.key]}</span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_90px_80px_1fr_110px_110px] gap-3 border-b border-ink/[0.06] bg-ink/[0.02] px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink/50">
          <div>Patient</div><div>Day</div><div>Weight</div><div>Δ</div><div>Side effects</div><div>Status</div><div>Action</div>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-[12px] text-ink/45">Nothing in this bucket.</div>}
        <div className="divide-y divide-ink/[0.05]">
          {filtered.map((c) => {
            const canQuickApprove = tab === "due" && (c.sideEffects?.length ?? 0) === 0 && (c.decision === "clear");
            const tone = c.decision === "held" || c.decision === "hold" ? "critical"
              : c.decision === "review" ? "warn"
              : c.decision === "approved" || c.decision === "adjusted" ? "success"
              : "info";
            const label = c.decision === "held" || c.decision === "hold" ? "Overdue · refill held"
              : c.decision === "review" ? "Needs review"
              : c.decision === "approved" ? "Approved"
              : c.decision === "adjusted" ? "Approved · dose adjusted"
              : c.decision === "awaiting_reply" ? "Awaiting reply"
              : "Clear · refill ok";
            return (
              <div key={c.id} className="grid grid-cols-[1fr_80px_90px_80px_1fr_110px_110px] items-center gap-3 px-4 py-2.5 text-[12.5px] hover:bg-ink/[0.02]">
                <div>
                  <div className="font-medium text-ink">{c.patientName}</div>
                  <div className="text-[11px] text-ink/50">{c.id}</div>
                </div>
                <div className="text-ink/70 tabular-nums">Day {c.day}</div>
                <div className="text-ink/70 tabular-nums">{c.weight ? `${c.weight} lb` : "—"}</div>
                <div className="tabular-nums">{typeof c.delta === "number" ? <span className={c.delta < 0 ? "text-check" : "text-ever"}>{c.delta > 0 ? "+" : ""}{c.delta} lb</span> : <span className="text-ink/40">—</span>}</div>
                <div className="truncate text-ink/60">{c.sideEffects && c.sideEffects.length > 0 ? c.sideEffects.join(", ") : <span className="text-ink/40">None</span>}</div>
                <div><Pill tone={tone as never}>{label}</Pill></div>
                <div className="flex items-center gap-1">
                  {canQuickApprove ? (
                    <button onClick={() => { adminActions.approveCheckInRefill(c.id); toast.success("Refill approved"); }}
                      className="flex items-center gap-1 rounded-md bg-check px-2 py-1 text-[11px] font-semibold text-white hover:opacity-90">
                      <Check className="h-3 w-3" /> Approve
                    </button>
                  ) : (
                    <button onClick={() => nav({ to: "/admin/check-ins/$id", params: { id: c.id } })}
                      className="inline-flex items-center gap-1 rounded-md border border-ink/12 px-2 py-1 text-[11px] font-medium text-ink hover:bg-ink/[0.03]">
                      Open <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                  <button title="Send reminder" onClick={() => { adminActions.sendCheckInReminder(c.id); toast.success("Reminder sent"); }}
                    className="rounded-md border border-ink/12 p-1 text-ink/60 hover:border-ink hover:text-ink">
                    <Bell className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </AdminShell>
  );
}

function Metric({ label, value, sub, tone = "neutral" }: { label: string; value: string | number; sub: string; tone?: "neutral" | "success" | "warn" | "critical" }) {
  const toneClass = tone === "critical" ? "text-ever" : tone === "success" ? "text-check" : tone === "warn" ? "text-honey" : "text-ink";
  return (
    <Card className="p-3">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</div>
      <div className={`mt-1 font-hero text-[22px] font-semibold tabular-nums ${toneClass}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-ink/50">{sub}</div>
    </Card>
  );
}
