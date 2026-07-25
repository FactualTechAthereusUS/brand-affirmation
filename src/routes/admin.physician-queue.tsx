import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, Card, Pill, SectionTitle } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type PhysicianCase } from "@/lib/admin/store";
import { Flame, Check, X as XIcon, MessageSquare, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/physician-queue")({
  head: () => ({ meta: [{ title: "Physician queue — Blissley Admin" }, { name: "description", content: "Case review queue with SLA countdowns and safety flags." }] }),
  component: PhysicianQueue,
});

const TABS = [
  { key: "new", label: "New" },
  { key: "flagged", label: "Flagged" },
  { key: "awaitingReply", label: "Awaiting reply" },
  { key: "refill", label: "Refills" },
  { key: "approved", label: "Completed" },
] as const;

function slaLeft(c: PhysicianCase): string {
  const hrs = (Date.now() - c.submittedAt) / 3600_000;
  const left = c.slaHrs - hrs;
  if (left < 0) return "SLA breach";
  return `${left.toFixed(1)}h left`;
}

function PhysicianQueue() {
  const cases = useAdmin((s) => s.cases);
  const physicians = useAdmin((s) => s.physicians);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("new");
  const [selectedId, setSelectedId] = useState<string | null>(cases.find(c => c.status === "new")?.id ?? null);

  const filtered = cases.filter((c) => c.status === tab);
  const selected = cases.find((c) => c.id === selectedId) ?? filtered[0];

  return (
    <AdminShell>
      <div className="mb-4">
        <h1 className="font-hero text-[22px] font-semibold text-ink">Physician queue</h1>
        <div className="mt-0.5 text-[11.5px] text-ink/55">Review, approve, or request info. All under 24h SLA.</div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {TABS.map((t) => {
          const count = cases.filter((c) => c.status === t.key).length;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium ${active ? "bg-ink text-white" : "border border-ink/12 text-ink/60 hover:bg-ink/[0.03]"}`}>
              {t.label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[380px_1fr]">
        {/* Case list */}
        <Card className="overflow-hidden">
          {filtered.length === 0 && <div className="p-6 text-center text-[12px] text-ink/45">No cases in this tab.</div>}
          <div className="divide-y divide-ink/[0.05]">
            {filtered.map((c) => {
              const active = c.id === selected?.id;
              const phys = physicians.find((p) => p.id === c.assignedTo);
              const sla = slaLeft(c);
              const breach = sla.includes("breach");
              return (
                <button key={c.id} onClick={() => setSelectedId(c.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${active ? "bg-ink/[0.03]" : "hover:bg-ink/[0.015]"}`}>
                  {c.priority === "urgent" && <Flame className="mt-0.5 h-4 w-4 shrink-0 text-ever" strokeWidth={2} />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[13px] font-semibold text-ink">{c.patientName}</div>
                      <div className={`shrink-0 text-[10.5px] ${breach ? "text-ever" : "text-ink/45"}`}>{sla}</div>
                    </div>
                    <div className="mt-0.5 truncate text-[11.5px] text-ink/55">{c.product}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {c.flags.map((f) => <Pill key={f} tone="critical">{f}</Pill>)}
                      {phys && <span className="text-[10.5px] text-ink/45">· {phys.avatar}</span>}
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-3 w-3 text-ink/30" />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Case detail */}
        <div className="space-y-3">
          {!selected && <Card className="grid h-72 place-items-center text-[12px] text-ink/45">Select a case to review</Card>}
          {selected && <CaseDetail c={selected} />}
        </div>
      </div>
    </AdminShell>
  );
}

function CaseDetail({ c }: { c: PhysicianCase }) {
  const [note, setNote] = useState("");
  const sla = slaLeft(c);
  const breach = sla.includes("breach");
  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Case · {c.id}</div>
            <div className="mt-1 font-hero text-[20px] font-semibold text-ink">{c.patientName}</div>
            <div className="mt-0.5 text-[12px] text-ink/60">{c.product}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Pill tone={breach ? "critical" : "info"}>{sla}</Pill>
            {c.priority === "urgent" && <Pill tone="critical"><Flame className="h-3 w-3" /> Urgent</Pill>}
          </div>
        </div>
      </Card>

      {c.flags.length > 0 && (
        <Card className="p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ever">Safety flags</div>
          <div className="mt-2 space-y-1.5 text-[12.5px] text-ink">
            {c.flags.map((f) => (
              <div key={f} className="flex items-start gap-2 rounded-lg border border-ever/20 bg-ever/5 px-3 py-2">
                <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ever" strokeWidth={2} />
                <div>
                  <div className="font-semibold text-ever">{f}</div>
                  <div className="mt-0.5 text-[11.5px] text-ink/60">Reviewed against intake responses. Confirm with patient before proceeding.</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Intake summary</div>
        <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
          <Detail label="Age" value="34" />
          <Detail label="BMI" value="32.4" />
          <Detail label="Program family" value="Tirzepatide" />
          <Detail label="Prior GLP" value="No" />
          <Detail label="Conditions" value="None reported" />
          <Detail label="Meds" value="Multivitamin" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Prescription</div>
        <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
          <Detail label="Drug" value={c.product} />
          <Detail label="Sig" value="Inject 0.25mL weekly" />
          <Detail label="Qty" value="4 doses" />
          <Detail label="Refills" value="0" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Note to patient</div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Optional message shown to patient…"
          className="min-h-[80px] w-full rounded-lg border border-ink/12 bg-white p-2.5 text-[12.5px] outline-none focus:border-ink" />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => adminActions.approveCase(c.id)}
            className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[12px] font-semibold text-white">
            <Check className="h-3.5 w-3.5" /> Approve & send Rx
          </button>
          <button onClick={() => adminActions.denyCase(c.id, "More info requested")}
            className="flex items-center gap-1.5 rounded-lg border border-ink/12 px-3 py-2 text-[12px] font-medium text-ink hover:bg-ink/[0.03]">
            <MessageSquare className="h-3.5 w-3.5" /> Request info
          </button>
          <button onClick={() => adminActions.denyCase(c.id, "Clinical criteria not met")}
            className="flex items-center gap-1.5 rounded-lg border border-ink/12 px-3 py-2 text-[12px] font-medium text-ever hover:bg-ever/5">
            <XIcon className="h-3.5 w-3.5" /> Reject
          </button>
        </div>
      </Card>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink/40">{label}</div>
      <div className="mt-0.5 text-[12.5px] text-ink">{value}</div>
    </div>
  );
}
