import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type PhysicianCase } from "@/lib/admin/store";
import { Flame, ChevronRight, RefreshCcw, Search, Check } from "lucide-react";

export const Route = createFileRoute("/pharmabro-admin/physician-queue/")({
  head: () => ({ meta: [
    { title: "Physician queue — Blissley HQ" },
    { name: "description", content: "Case review queue with SLA countdowns, wait-time coloring, and safety flags." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: PhysicianQueuePage,
});

type TabKey = "all" | "flagged" | "new" | "awaitingReply" | "refill" | "approved" | "denied";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "flagged", label: "Flagged 🔴" },
  { key: "new", label: "New" },
  { key: "awaitingReply", label: "Awaiting reply" },
  { key: "refill", label: "Refills" },
  { key: "approved", label: "Completed today" },
  { key: "denied", label: "Denied today" },
];

function waitHrs(c: PhysicianCase): number { return (Date.now() - c.submittedAt) / 3600_000; }
function waitTone(hrs: number): "success" | "warn" | "critical" {
  if (hrs > 12) return "critical";
  if (hrs > 4) return "warn";
  return "success";
}
function waitLabel(hrs: number): string {
  if (hrs < 1) return `${Math.round(hrs * 60)}m ago`;
  return `${hrs.toFixed(1)}h ago`;
}

function belongs(c: PhysicianCase, k: TabKey): boolean {
  if (k === "all") return c.status !== "approved" && c.status !== "denied";
  if (k === "approved" || k === "denied") return c.status === k;
  return c.status === k;
}

function sortCases(list: PhysicianCase[]): PhysicianCase[] {
  const rank = (s: PhysicianCase["status"]) => ({ flagged: 0, awaitingReply: 1, new: 2, refill: 3, approved: 4, denied: 5 }[s] ?? 9);
  return [...list].sort((a, b) => rank(a.status) - rank(b.status) || a.submittedAt - b.submittedAt);
}

function PhysicianQueuePage() {
  const cases = useAdmin((s) => s.cases);
  const physicians = useAdmin((s) => s.physicians);
  const patients = useAdmin((s) => s.patients);
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);
  const nav = useNavigate();

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return sortCases(cases.filter((c) => belongs(c, tab)).filter((c) => !qq || c.patientName.toLowerCase().includes(qq) || c.id.toLowerCase().includes(qq)));
  }, [cases, tab, q]);

  const active = cases.filter((c) => c.status !== "approved" && c.status !== "denied");
  const avgWait = active.length
    ? (active.reduce((s, c) => s + waitHrs(c), 0) / active.length)
    : 0;
  const approvedToday = cases.filter((c) => c.status === "approved").length;
  const deniedToday = cases.filter((c) => c.status === "denied").length;
  const flaggedCount = cases.filter((c) => c.status === "flagged").length;

  const counts: Record<TabKey, number> = {
    all: active.length,
    flagged: flaggedCount,
    new: cases.filter((c) => c.status === "new").length,
    awaitingReply: cases.filter((c) => c.status === "awaitingReply").length,
    refill: cases.filter((c) => c.status === "refill").length,
    approved: approvedToday,
    denied: deniedToday,
  };
  void tick;

  return (
    <AdminShell title="Physician queue">
      {/* Metrics strip */}
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        <Metric label="In queue" value={active.length} sub="needs review" />
        <Metric label="Flagged 🔴" value={flaggedCount} sub="review now" tone={flaggedCount > 0 ? "critical" : "neutral"} />
        <Metric label="Avg wait" value={`${Math.floor(avgWait)}h ${Math.round((avgWait % 1) * 60)}m`} sub="target <24h" />
        <Metric label="Approved today" value={approvedToday} sub={`${(approvedToday / Math.max(1, approvedToday + deniedToday) * 100).toFixed(1)}% rate`} tone="success" />
        <Metric label="Denied today" value={deniedToday} sub="refunds issued" />
      </div>

      {/* Search + refresh */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by patient name, case #…"
            className="w-full rounded-lg bg-ink/[0.04] py-1.5 pl-9 pr-3 text-[12.5px] outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1 focus:ring-marine/30" />
        </div>
        <button onClick={() => { setTick(t => t + 1); toast.success("Queue refreshed"); }}
          className="flex items-center gap-1.5 rounded-lg border border-ink/12 px-2.5 py-1.5 text-[11.5px] font-medium text-ink/70 hover:border-ink hover:text-ink">
          <RefreshCcw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium ${isActive ? "bg-ink text-white" : "border border-ink/12 text-ink/60 hover:bg-ink/[0.03]"}`}>
              {t.label} <span className="ml-1 opacity-70">{counts[t.key]}</span>
            </button>
          );
        })}
      </div>

      {/* Refills tab uses different columns */}
      {tab === "refill" ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[110px_1fr_60px_110px_1fr_100px_100px_110px] gap-3 border-b border-ink/[0.06] bg-ink/[0.02] px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink/50">
            <div>Case #</div><div>Patient</div><div>Month</div><div>Product</div><div>Check-in</div><div>Change</div><div>SE</div><div>Action</div>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center text-[12px] text-ink/45">No refills in queue.</div>}
          <div className="divide-y divide-ink/[0.05]">
            {filtered.map((c, i) => {
              const clean = c.flags.length === 0;
              return (
                <div key={c.id} className="grid grid-cols-[110px_1fr_60px_110px_1fr_100px_100px_110px] items-center gap-3 px-4 py-2.5 text-[12.5px] hover:bg-ink/[0.02]">
                  <div className="font-mono text-[11px] text-ink/60">{c.id.replace("case_", "BLS-R-")}</div>
                  <div className="font-medium text-ink">{c.patientName}</div>
                  <div className="text-ink/60">{(i % 6) + 1}/6</div>
                  <div className="text-ink/70">{c.product}</div>
                  <div className="text-check">✓ Completed</div>
                  <div className="text-check">-{5 + (i % 12)} lbs</div>
                  <div className="text-ink/60">{c.flags.length > 0 ? c.flags[0] : "None"}</div>
                  <div>
                    {clean ? (
                      <button onClick={() => { adminActions.approveCaseWithRx(c.id); toast.success("Refill approved · Rx transmitted"); }}
                        className="flex items-center gap-1 rounded-md bg-check px-2 py-1 text-[11px] font-semibold text-white hover:opacity-90">
                        <Check className="h-3 w-3" /> Approve
                      </button>
                    ) : (
                      <button onClick={() => nav({ to: "/pharmabro-admin/physician-queue/$id", params: { id: c.id } })}
                        className="rounded-md border border-ink/12 px-2 py-1 text-[11px] font-medium text-ink hover:bg-ink/[0.03]">
                        Review →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[110px_1fr_50px_50px_60px_110px_60px_90px_90px_1fr_110px_90px] gap-3 border-b border-ink/[0.06] bg-ink/[0.02] px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink/50">
            <div>Case #</div><div>Patient</div><div>Age</div><div>Sex</div><div>BMI</div><div>Product</div><div>Plan</div><div>Submitted</div><div>Wait</div><div>Flags</div><div>Physician</div><div>Action</div>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center text-[12px] text-ink/45">No cases in this bucket.</div>}
          <div className="divide-y divide-ink/[0.05]">
            {filtered.map((c, i) => {
              const pt = patients.find((p) => p.id === c.patientId);
              const hrs = waitHrs(c);
              const phy = physicians.find((p) => p.id === c.assignedTo);
              const age = 30 + ((i * 7) % 25);
              const sex = i % 2 === 0 ? "F" : "M";
              const bmi = (27 + ((i * 3) % 12)).toFixed(1);
              const plan = ["Mo", "3mo", "6mo"][i % 3];
              return (
                <div key={c.id} className="grid grid-cols-[110px_1fr_50px_50px_60px_110px_60px_90px_90px_1fr_110px_90px] items-center gap-3 px-4 py-2.5 text-[12.5px] hover:bg-ink/[0.02]">
                  <div className="font-mono text-[11px] text-ink/60">{c.id.replace("case_", "BLS-C-")}</div>
                  <div className="flex items-center gap-1.5">
                    {c.priority === "urgent" && <Flame className="h-3 w-3 shrink-0 text-ever" />}
                    <span className="truncate font-medium text-ink">{c.patientName}</span>
                  </div>
                  <div className="text-ink/60">{age}</div>
                  <div className="text-ink/60">{sex}</div>
                  <div className="text-ink/70 tabular-nums">{bmi}</div>
                  <div className="truncate text-ink/70">{c.product}</div>
                  <div className="text-ink/60">{plan}</div>
                  <div className="text-ink/50 text-[11px]">{waitLabel(hrs)}</div>
                  <div><Pill tone={waitTone(hrs)}>{hrs > 12 ? "🔴 Long" : hrs > 4 ? "🟡 Med" : "✅ New"}</Pill></div>
                  <div className="truncate text-[11.5px]">
                    {c.flags.length === 0 ? <span className="text-ink/40">None</span> : <span className="text-ever">⚠️ {c.flags[0]}</span>}
                  </div>
                  <div className="truncate text-ink/60">{phy?.name ?? "—"}</div>
                  <div>
                    <button onClick={() => nav({ to: "/pharmabro-admin/physician-queue/$id", params: { id: c.id } })}
                      className="inline-flex items-center gap-1 rounded-md border border-ink/12 px-2 py-1 text-[11px] font-medium text-ink hover:bg-ink/[0.03]">
                      Review <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="mt-3 text-[11px] text-ink/45">
        Sort: Flagged → Awaiting reply → New (oldest first) → Refills.{" "}
        <Link to="/pharmabro-admin/check-ins" className="text-marine hover:underline">Go to check-ins →</Link>
      </div>
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
