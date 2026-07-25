import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";
import { ArrowLeft, Bell, Check, MessageSquare, X as XIcon } from "lucide-react";

export const Route = createFileRoute("/pharmabro-admin/check-ins/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Check-in ${params.id} — Blissley HQ` },
    { name: "description", content: "Monthly check-in review — weight, side effects, refill decision." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: CheckInDetailPage,
});

const HOLD_REASONS = [
  "Vomiting > 3 days",
  "Cannot keep fluids down",
  "Severe abdominal pain",
  "Weight loss too rapid (>2%/week)",
  "Suicidal ideation",
  "Missed 2+ doses",
  "Patient requested pause",
];

function CheckInDetailPage() {
  const { id } = useParams({ from: "/pharmabro-admin/check-ins/$id" });
  const nav = useNavigate();
  const ci = useAdmin((s) => s.checkIns.find((c) => c.id === id));
  const patient = useAdmin((s) => s.patients.find((p) => p.id === ci?.patientId));
  const patientCheckIns = useAdmin((s) => s.checkIns.filter((c) => c.patientId === ci?.patientId).sort((a, b) => a.day - b.day));

  const [approveOpen, setApproveOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [doseChange, setDoseChange] = useState("Titrate to 5mg for month 5");
  const [adjustNote, setAdjustNote] = useState("");
  const [holdReason, setHoldReason] = useState(HOLD_REASONS[0]);
  const [holdText, setHoldText] = useState("");

  if (!ci) {
    return (
      <AdminShell title="Check-in">
        <Card className="p-8 text-center">
          <div className="text-[15px] font-semibold text-ink">Check-in not found</div>
          <Link to="/pharmabro-admin/check-ins" className="mt-3 inline-block text-[13px] font-semibold text-marine hover:underline">Back</Link>
        </Card>
      </AdminShell>
    );
  }

  const startWeight = patientCheckIns[0]?.weight ?? ci.weight ?? 0;
  const totalDelta = ci.weight && startWeight ? ci.weight - startWeight : 0;
  const totalPct = startWeight ? (totalDelta / startWeight) * 100 : 0;
  const isDone = ci.decision === "approved" || ci.decision === "adjusted" || ci.decision === "held";

  const doApprove = () => {
    if (pin.length < 4) { toast.error("Enter a 4-digit PIN"); return; }
    adminActions.approveCheckInRefill(ci.id);
    toast.success("Refill approved · order queued");
    setApproveOpen(false); setPin("");
  };
  const doAdjust = () => {
    adminActions.approveCheckInWithAdjustment(ci.id, { doseChange, note: adjustNote });
    toast.success("Approved with dose adjustment");
    setAdjustOpen(false);
  };
  const doMsg = () => {
    if (!msg.trim()) { toast.error("Write a message"); return; }
    adminActions.messagePatientFromCheckIn(ci.id, msg.trim());
    toast.success("Message sent");
    setMsgOpen(false); setMsg("");
  };
  const doHold = () => {
    adminActions.holdCheckInRefill(ci.id, holdReason, holdText || undefined);
    toast.success("Refill held");
    setHoldOpen(false); setHoldText("");
  };

  return (
    <AdminShell title="Check-in">
      <button onClick={() => nav({ to: "/pharmabro-admin/check-ins" })}
        className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-ink/55 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Check-ins
      </button>

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Check-in · Month {Math.ceil(ci.day / 30)}</div>
            <div className="mt-1 font-hero text-[20px] font-semibold text-ink">{ci.patientName}</div>
            <div className="mt-0.5 text-[12px] text-ink/60">Day {ci.day} · Submitted just now</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Pill tone={ci.decision === "held" || ci.decision === "hold" ? "critical" : ci.decision === "review" ? "warn" : "success"}>
              {ci.decision === "held" || ci.decision === "hold" ? "Held" : ci.decision === "review" ? "Needs review" : ci.decision === "approved" ? "Approved" : ci.decision === "adjusted" ? "Adjusted" : "Clear"}
            </Pill>
            {(ci.reminderCount ?? 0) > 0 && <span className="text-[11px] text-ink/50">{ci.reminderCount} reminder{(ci.reminderCount ?? 0) === 1 ? "" : "s"} sent</span>}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {/* Weight card */}
          <Card className="p-4">
            <PanelTitle>Weight progression</PanelTitle>
            <div className="mt-2 grid grid-cols-4 gap-3 text-[12.5px]">
              <Detail label="Start" value={`${startWeight || "—"} lb`} />
              <Detail label="Current" value={`${ci.weight ?? "—"} lb`} />
              <Detail label="This month" value={typeof ci.delta === "number" ? `${ci.delta > 0 ? "+" : ""}${ci.delta} lb` : "—"} tone={ci.delta && ci.delta < 0 ? "success" : "neutral"} />
              <Detail label="Total" value={`${totalDelta > 0 ? "+" : ""}${totalDelta.toFixed(0)} lb (${totalPct.toFixed(1)}%)`} tone={totalDelta < 0 ? "success" : "neutral"} />
            </div>
            {/* mini bar chart */}
            <div className="mt-4 flex items-end gap-1.5 border-b border-ink/[0.06] pb-1">
              {patientCheckIns.map((c) => {
                const w = c.weight ?? 0;
                const heightPct = w ? Math.max(20, (w / Math.max(startWeight, w)) * 100) : 20;
                const active = c.id === ci.id;
                return (
                  <div key={c.id} className="flex-1">
                    <div className={`w-full rounded-t ${active ? "bg-ink" : "bg-marine/40"}`} style={{ height: `${heightPct}px` }} />
                    <div className="mt-1 text-center text-[10px] text-ink/50">M{Math.ceil(c.day / 30)}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Side effects */}
          <Card className="p-4">
            <PanelTitle>Side effects reported</PanelTitle>
            {(ci.sideEffects?.length ?? 0) === 0 ? (
              <div className="mt-2 rounded-lg border border-check/30 bg-check/5 p-3 text-[12.5px] text-check">
                ✅ No side effects reported this month.
              </div>
            ) : (
              <div className="mt-2 space-y-1.5">
                {ci.sideEffects!.map((s) => (
                  <div key={s} className="rounded-lg border border-honey/30 bg-honey/5 px-3 py-2 text-[12.5px] text-ink">
                    <b className="text-honey">⚠️ {s}</b>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Patient answers */}
          <Card className="p-4">
            <PanelTitle>Patient answers</PanelTitle>
            <div className="mt-2 grid grid-cols-1 gap-1.5 text-[12.5px] md:grid-cols-2">
              <div><span className="text-ink/50">Dose adherence: </span><span className="text-ink">All 4 doses this month ✅</span></div>
              <div><span className="text-ink/50">Missed doses: </span><span className="text-ink">0</span></div>
              <div><span className="text-ink/50">New meds: </span><span className="text-ink">None</span></div>
              <div><span className="text-ink/50">Pregnancy: </span><span className="text-ink">Not pregnant ✅</span></div>
              <div><span className="text-ink/50">Mood: </span><span className="text-ink">Good</span></div>
              <div><span className="text-ink/50">Continue: </span><span className="text-ink">Yes, refill me</span></div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <PanelTitle>Note to patient (optional)</PanelTitle>
            <textarea defaultValue={ci.patientNote ?? ""}
              onBlur={(e) => adminActions.updateCheckInPatientNote(ci.id, e.target.value)}
              placeholder={`Encourage or advise ${ci.patientName.split(" ")[0]}…`}
              className="mt-2 min-h-[70px] w-full rounded-lg border border-ink/12 bg-white p-2.5 text-[12.5px] outline-none focus:border-ink" />
          </Card>
          <Card className="p-4">
            <PanelTitle>Internal note</PanelTitle>
            <textarea defaultValue={ci.internalNote ?? ""}
              onBlur={(e) => adminActions.updateCheckInInternalNote(ci.id, e.target.value)}
              placeholder="Clinical reasoning, escalation notes…"
              className="mt-2 min-h-[70px] w-full rounded-lg border border-ink/12 bg-white p-2.5 text-[12.5px] outline-none focus:border-ink" />
          </Card>
        </div>

        {/* Decision panel */}
        <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4">
            <PanelTitle>Decision</PanelTitle>
            <div className="mt-2 space-y-2">
              <button disabled={isDone} onClick={() => setApproveOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 py-3 text-[13px] font-semibold text-white disabled:opacity-40">
                <Check className="h-4 w-4" /> Approve refill
              </button>
              <button disabled={isDone} onClick={() => setAdjustOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/12 px-3 py-3 text-[13px] font-medium text-ink hover:bg-ink/[0.03] disabled:opacity-40">
                Approve with dose adjustment
              </button>
              <button disabled={isDone} onClick={() => setMsgOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/12 px-3 py-3 text-[13px] font-medium text-ink hover:bg-ink/[0.03] disabled:opacity-40">
                <MessageSquare className="h-4 w-4" /> Message patient
              </button>
              <button disabled={isDone} onClick={() => setHoldOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-ever/30 px-3 py-3 text-[13px] font-medium text-ever hover:bg-ever/5 disabled:opacity-40">
                <XIcon className="h-4 w-4" /> Hold refill
              </button>
              <button onClick={() => { adminActions.sendCheckInReminder(ci.id); toast.success("Reminder sent"); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/12 px-3 py-2 text-[12px] text-ink/70 hover:bg-ink/[0.03]">
                <Bell className="h-3.5 w-3.5" /> Send reminder
              </button>
            </div>
          </Card>

          {patient && (
            <Card className="p-4">
              <PanelTitle>Patient</PanelTitle>
              <div className="mt-2 space-y-1 text-[12px]">
                <div><span className="text-ink/50">State: </span>{patient.state}</div>
                <div><span className="text-ink/50">Program: </span>{patient.program}</div>
                <div><span className="text-ink/50">Status: </span>{patient.status}</div>
              </div>
              <Link to="/pharmabro-admin/patients/$id" params={{ id: patient.id }}
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-marine hover:underline">
                Open patient profile →
              </Link>
            </Card>
          )}

          {ci.refillOrderId && (
            <Card className="p-4">
              <PanelTitle>Refill order</PanelTitle>
              <div className="mt-1 text-[12px] text-ink/70">Queued: <span className="font-mono">{ci.refillOrderId}</span></div>
              <Link to="/pharmabro-admin/orders/$id" params={{ id: ci.refillOrderId }}
                className="mt-2 inline-flex text-[12px] font-semibold text-marine hover:underline">Open order →</Link>
            </Card>
          )}
        </div>
      </div>

      {approveOpen && (
        <Modal onClose={() => setApproveOpen(false)} title="Approve refill">
          <p className="mb-3 text-[12.5px] text-ink/70">Confirm month {Math.ceil(ci.day / 30) + 1} refill for {ci.patientName}. E-sign with your 4-digit PIN.</p>
          <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
            className="mb-3 w-full rounded-lg border border-ink/12 px-3 py-2 text-center font-mono text-[18px] tracking-[0.5em] outline-none focus:border-ink" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setApproveOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doApprove} className="rounded-lg bg-ink px-3 py-2 text-[12px] font-semibold text-white">Approve & queue order</button>
          </div>
        </Modal>
      )}

      {adjustOpen && (
        <Modal onClose={() => setAdjustOpen(false)} title="Approve with dose adjustment">
          <label className="mb-1 block text-[11px] uppercase tracking-[0.08em] text-ink/50">Dose change</label>
          <input value={doseChange} onChange={(e) => setDoseChange(e.target.value)}
            className="mb-3 w-full rounded-lg border border-ink/12 px-3 py-2 text-[12.5px] outline-none focus:border-ink" />
          <label className="mb-1 block text-[11px] uppercase tracking-[0.08em] text-ink/50">Note to patient</label>
          <textarea value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)}
            placeholder="Explain the adjustment…"
            className="mb-3 min-h-[80px] w-full rounded-lg border border-ink/12 p-2.5 text-[12.5px] outline-none focus:border-ink" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setAdjustOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doAdjust} className="rounded-lg bg-ink px-3 py-2 text-[12px] font-semibold text-white">Approve with adjustment</button>
          </div>
        </Modal>
      )}

      {msgOpen && (
        <Modal onClose={() => setMsgOpen(false)} title="Message patient">
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)}
            placeholder="Ask about side effects, dose adherence…"
            className="mb-3 min-h-[120px] w-full rounded-lg border border-ink/12 p-2.5 text-[12.5px] outline-none focus:border-ink" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setMsgOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doMsg} className="rounded-lg bg-ink px-3 py-2 text-[12px] font-semibold text-white">Send</button>
          </div>
        </Modal>
      )}

      {holdOpen && (
        <Modal onClose={() => setHoldOpen(false)} title="Hold refill">
          <div className="mb-3 space-y-1.5">
            {HOLD_REASONS.map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-ink/[0.03]">
                <input type="radio" name="holdReason" checked={holdReason === r} onChange={() => setHoldReason(r)} />
                {r}
              </label>
            ))}
          </div>
          <textarea value={holdText} onChange={(e) => setHoldText(e.target.value)}
            placeholder="Additional context (optional)…"
            className="mb-3 min-h-[80px] w-full rounded-lg border border-ink/12 p-2.5 text-[12.5px] outline-none focus:border-ink" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setHoldOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doHold} className="rounded-lg bg-ever px-3 py-2 text-[12px] font-semibold text-white">Hold refill</button>
          </div>
        </Modal>
      )}
    </AdminShell>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{children}</div>;
}
function Detail({ label, value, tone }: { label: string; value: string; tone?: "success" | "neutral" }) {
  const toneClass = tone === "success" ? "text-check" : "text-ink";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink/40">{label}</div>
      <div className={`mt-0.5 text-[12.5px] font-semibold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-hero text-[16px] font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-ink/50 hover:bg-ink/[0.05]"><XIcon className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
