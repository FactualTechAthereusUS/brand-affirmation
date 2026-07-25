import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, PROGRAMS } from "@/lib/admin/store";
import { ArrowLeft, Check, X as XIcon, MessageSquare, Flame, ChevronDown, Zap } from "lucide-react";

export const Route = createFileRoute("/pharmabro-admin/physician-queue/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Case ${params.id?.replace("case_", "BLS-C-") ?? ""} — Blissley HQ` },
    { name: "description", content: "Physician case review — intake, flags, prescription, decision." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: CaseDetailPage,
});

const REJECT_REASONS = [
  "BMI below threshold",
  "MTC / MEN2 history",
  "Known hypersensitivity",
  "Pregnant / breastfeeding",
  "Active pancreatitis",
  "Type 1 diabetes",
  "State not served",
  "GLP-1 dose — cannot safely continue",
  "Incomplete or inconsistent intake",
];

function waitHrs(ts: number): number { return (Date.now() - ts) / 3600_000; }

function CaseDetailPage() {
  const { id } = useParams({ from: "/pharmabro-admin/physician-queue/$id" });
  const nav = useNavigate();
  const c = useAdmin((s) => s.cases.find((x) => x.id === id));
  const patient = useAdmin((s) => s.patients.find((p) => p.id === c?.patientId));
  const physicians = useAdmin((s) => s.physicians);
  const cases = useAdmin((s) => s.cases);

  const [approveOpen, setApproveOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [infoText, setInfoText] = useState("");
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [reasonText, setReasonText] = useState("");
  const [patientNote, setPatientNote] = useState("");
  const [internalNote, setInternalNote] = useState("");

  if (!c) {
    return (
      <AdminShell title="Case">
        <Card className="p-8 text-center">
          <div className="text-[15px] font-semibold text-ink">Case not found</div>
          <Link to="/pharmabro-admin/physician-queue" className="mt-3 inline-block text-[13px] font-semibold text-marine hover:underline">Back to queue</Link>
        </Card>
      </AdminShell>
    );
  }

  const phy = physicians.find((p) => p.id === c.assignedTo);
  const hrs = waitHrs(c.submittedAt);
  const bmi = patient ? (28 + ((patient.id.charCodeAt(3) % 12))).toFixed(1) : "—";
  const age = patient ? 30 + (patient.id.charCodeAt(4) % 25) : 40;
  const isPending = c.status !== "approved" && c.status !== "denied";

  const doApprove = () => {
    if (pin.length < 4) { toast.error("Enter a 4-digit PIN"); return; }
    adminActions.approveCaseWithRx(c.id, {
      patientNote: patientNote || c.patientNote,
      internalNote: internalNote || c.internalNote,
      decidedBy: phy?.name ?? "You",
    });
    toast.success("Rx transmitted to South End Pharmacy");
    setApproveOpen(false); setPin("");
  };
  const doInfo = () => {
    if (!infoText.trim()) { toast.error("Write a question first"); return; }
    adminActions.requestInfoOnCase(c.id, infoText.trim());
    toast.success("Question sent to patient");
    setInfoOpen(false); setInfoText("");
  };
  const doReject = () => {
    adminActions.denyCaseWithReason(c.id, reason, reasonText || undefined);
    toast.success("Case rejected");
    setRejectOpen(false); setReasonText("");
  };

  // Stats
  const today = cases.filter((x) => x.decisionAt && Date.now() - x.decisionAt < 24 * 3600_000);
  const approvedToday = today.filter((x) => x.status === "approved").length;
  const rejectedToday = today.filter((x) => x.status === "denied").length;

  return (
    <AdminShell title="Case">
      <button onClick={() => nav({ to: "/pharmabro-admin/physician-queue" })}
        className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-ink/55 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Physician queue
      </button>

      {/* Status banner */}
      <Card className={`mb-4 p-4 ${
        c.status === "approved" ? "border-check/30 bg-check/5" :
        c.status === "denied" ? "border-ever/30 bg-ever/5" :
        c.status === "awaitingReply" ? "border-honey/30 bg-honey/5" :
        "border-marine/20 bg-marine/[0.03]"
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">
              {c.status === "approved" ? "✅ Approved" :
               c.status === "denied" ? "❌ Denied" :
               c.status === "awaitingReply" ? "💬 Awaiting reply" :
               "⏳ Pending review"}
            </div>
            <div className="mt-1 font-hero text-[18px] font-semibold text-ink">
              {c.patientName} — Submitted {new Date(c.submittedAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} — Waiting {hrs.toFixed(1)}h
            </div>
            <div className="mt-0.5 text-[12px] text-ink/60">Assigned: {phy?.name ?? "—"}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setReassignOpen(true)}
              className="flex items-center gap-1 rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-[11.5px] font-medium hover:border-ink">
              Reassign <ChevronDown className="h-3 w-3" />
            </button>
            <button onClick={() => { adminActions.setCasePriority(c.id, c.priority === "urgent" ? "normal" : "urgent"); toast.success(c.priority === "urgent" ? "Priority cleared" : "Marked priority"); }}
              className="flex items-center gap-1 rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-[11.5px] font-medium hover:border-ink">
              <Zap className="h-3 w-3" /> {c.priority === "urgent" ? "Clear priority" : "Mark priority"}
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-3">
          {/* Panel 1 — Patient snapshot */}
          <Card className="p-4">
            <PanelTitle>Patient</PanelTitle>
            <div className="mt-2 grid grid-cols-2 gap-3 text-[12.5px]">
              <Detail label="Name" value={`${c.patientName} · ${age}${patient?.state ? ` · ${patient.state}` : ""}`} />
              <Detail label="Status" value={parseFloat(bmi) >= 27 ? "✅ ELIGIBLE" : "Below threshold"} tone={parseFloat(bmi) >= 27 ? "success" : "warn"} />
              <Detail label="BMI" value={bmi} />
              <Detail label="Product" value={c.product} />
              <Detail label="Plan" value={patient ? PROGRAMS[patient.program].label : "—"} />
              <Detail label="Case ID" value={c.id.replace("case_", "BLS-C-")} />
              <Detail label="Submitted" value={new Date(c.submittedAt).toLocaleString()} />
              <Detail label="Time in queue" value={`${hrs.toFixed(1)}h`} />
            </div>
            {c.priority === "urgent" && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-honey/30 bg-honey/5 px-3 py-2 text-[12px] text-honey">
                <Zap className="h-3.5 w-3.5" /> Priority review — target approval within 6 hours
              </div>
            )}
          </Card>

          {/* Panel 2 — Safety flags */}
          <Card className="p-4">
            <PanelTitle>Safety flags</PanelTitle>
            {c.flags.length === 0 ? (
              <div className="mt-2 rounded-lg border border-check/30 bg-check/5 p-3 text-[12.5px] text-check">
                ✅ No contraindications detected. Proceed to intake review.
              </div>
            ) : (
              <div className="mt-2 space-y-1.5">
                {c.flags.map((f) => (
                  <div key={f} className="flex items-start gap-2 rounded-lg border border-ever/20 bg-ever/5 px-3 py-2 text-[12.5px]">
                    <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ever" />
                    <div>
                      <div className="font-semibold text-ever">{f}</div>
                      <div className="mt-0.5 text-[11.5px] text-ink/60">Reviewed against intake responses. Confirm with patient before proceeding.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-1 text-[12px]">
              {[
                "No MTC or MEN2 history",
                "Not pregnant / breastfeeding",
                "No active pancreatitis",
                "No end-stage kidney or liver disease",
                "No suicidal ideation",
                "No active substance use disorder",
                "BMI ≥27 — eligible",
                "State served by licensed physician",
              ].map((k) => (
                <div key={k} className="text-check">✅ {k}</div>
              ))}
            </div>
          </Card>

          {/* Panel 3 — Intake (collapsible) */}
          <Card className="p-4">
            <PanelTitle>Intake answers</PanelTitle>
            <div className="mt-2 space-y-2">
              {[
                { g: "Contraindications", items: [["MTC / MEN2 history", "No ✅"], ["Active pancreatitis", "No ✅"], ["Current suicidal ideation", "No ✅"], ["Organ transplant", "No ✅"]] },
                { g: "Qualifying conditions", items: [["High blood pressure", "✅ Yes — supports eligibility"], ["High cholesterol", "✅ Yes — supports eligibility"], ["Sleep apnea", "No"], ["PCOS", c.patientName.endsWith("a") ? "✅ Yes" : "No"]] },
                { g: "Medical history", items: [["Current medications", "Lisinopril 10mg, Atorvastatin 20mg"], ["Allergies", "None"], ["Past surgeries", "Appendectomy 2018"], ["Emergency contact", "+1 (407) 555-0193"]] },
                { g: "Personal", items: [["Sex / Age", `${age >= 40 ? "F" : "M"} · ${age}`], ["Height", "5'6\""], ["Weight", "198 lb"], ["State", patient?.state ?? "—"]] },
              ].map((grp) => (
                <details key={grp.g} className="rounded-lg border border-ink/[0.06] px-3 py-2">
                  <summary className="cursor-pointer text-[12.5px] font-semibold text-ink">{grp.g}</summary>
                  <div className="mt-2 grid grid-cols-1 gap-1 text-[12px] md:grid-cols-2">
                    {grp.items.map(([k, v]) => (
                      <div key={k}><span className="text-ink/50">{k}: </span><span className="text-ink">{v}</span></div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </Card>

          {/* Panel 4 — GLP-1 dose matching (conditional) */}
          {c.flags.some((f) => f.toLowerCase().includes("titr") || f.toLowerCase().includes("dose")) && (
            <Card className="p-4">
              <PanelTitle>GLP-1 dose matching</PanelTitle>
              <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
                <Detail label="Medication" value="Semaglutide (Ozempic)" />
                <Detail label="Last dose" value="0.5mg weekly" />
                <Detail label="Last injection" value="45 days ago" />
                <Detail label="Months on" value="4 months" />
              </div>
              <div className="mt-2 rounded-lg border border-marine/20 bg-marine/[0.03] p-2.5 text-[11.5px] text-ink/70">
                Gap of 30-90 days — physician discretion. Standard: match 0.5mg = 0.1mL of 5mg/mL vial.
              </div>
            </Card>
          )}

          {/* Panel 5 — Prescription */}
          <Card className="p-4">
            <PanelTitle>Prescription (pre-populated)</PanelTitle>
            <div className="mt-2 space-y-2 text-[12.5px]">
              <RxRow label="Drug" defaultValue={c.rxDraft?.drug ?? `${c.product} injectable`}
                onBlur={(v) => adminActions.updateCaseRxDraft(c.id, { drug: v })} />
              <RxRow label="Sig" defaultValue={c.rxDraft?.sig ?? "Inject 0.11mL subcutaneously once weekly. Titrate every 4 weeks per protocol."}
                onBlur={(v) => adminActions.updateCaseRxDraft(c.id, { sig: v })} multiline />
              <div className="grid grid-cols-3 gap-2">
                <RxRow label="Qty" defaultValue={c.rxDraft?.qty ?? "1 vial"} onBlur={(v) => adminActions.updateCaseRxDraft(c.id, { qty: v })} />
                <RxRow label="Days supply" defaultValue={String(c.rxDraft?.daysSupply ?? 28)} onBlur={(v) => adminActions.updateCaseRxDraft(c.id, { daysSupply: parseInt(v) || 28 })} />
                <RxRow label="Refills" defaultValue={String(c.rxDraft?.refills ?? 5)} onBlur={(v) => adminActions.updateCaseRxDraft(c.id, { refills: parseInt(v) || 5 })} />
              </div>
              <div className="rounded-lg bg-ink/[0.03] p-2.5 text-[11.5px] text-ink/70">
                Routes to <b>South End Pharmacy</b> — LifeFile integrated · Prescriber: {phy?.name ?? "—"} · NPI 1477783827
              </div>
            </div>
          </Card>

          {/* Panel 6 — Patient note */}
          <Card className="p-4">
            <PanelTitle>Note to patient (optional)</PanelTitle>
            <textarea
              defaultValue={c.patientNote ?? ""}
              onBlur={(e) => { adminActions.updateCasePatientNote(c.id, e.target.value); setPatientNote(e.target.value); }}
              placeholder={`Write a note for ${c.patientName.split(" ")[0]} — shown in their portal…`}
              className="mt-2 min-h-[80px] w-full rounded-lg border border-ink/12 bg-white p-2.5 text-[12.5px] outline-none focus:border-ink" />
          </Card>

          {/* Panel 7 — Internal note */}
          <Card className="p-4">
            <PanelTitle>Internal note (not shown to patient)</PanelTitle>
            <textarea
              defaultValue={c.internalNote ?? ""}
              onBlur={(e) => { adminActions.updateCaseInternalNote(c.id, e.target.value); setInternalNote(e.target.value); }}
              placeholder="Document clinical reasoning here…"
              className="mt-2 min-h-[80px] w-full rounded-lg border border-ink/12 bg-white p-2.5 text-[12.5px] outline-none focus:border-ink" />
          </Card>

          {/* Timeline */}
          {(c.timeline?.length ?? 0) > 0 && (
            <Card className="p-4">
              <PanelTitle>Case timeline</PanelTitle>
              <div className="mt-2 space-y-1.5 text-[12px]">
                {(c.timeline ?? []).slice().reverse().map((ev, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-marine" />
                    <div>
                      <div className="text-ink">
                        <b>{ev.kind.replace(/_/g, " ")}</b>{ev.detail ? ` — ${ev.detail}` : ""}
                      </div>
                      <div className="text-[11px] text-ink/50">{new Date(ev.ts).toLocaleString()} · {ev.by ?? "system"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right column — sticky decision panel */}
        <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4">
            <PanelTitle>Case summary</PanelTitle>
            <div className="mt-2 space-y-1 text-[12px]">
              <div><span className="text-ink/50">Patient: </span>{c.patientName} · {age}</div>
              <div><span className="text-ink/50">BMI: </span>{bmi} ✅</div>
              <div><span className="text-ink/50">Product: </span>{c.product}</div>
              <div><span className="text-ink/50">Flags: </span>{c.flags.length === 0 ? "None ✅" : `🟡 ${c.flags.length}`}</div>
              <div><span className="text-ink/50">Wait: </span><span className={hrs > 12 ? "text-ever" : hrs > 4 ? "text-honey" : "text-check"}>{hrs.toFixed(1)}h</span></div>
              <div><span className="text-ink/50">Priority: </span>{c.priority === "urgent" ? "⚡ Urgent" : "Normal"}</div>
            </div>
          </Card>

          <div className="space-y-2">
            <button
              disabled={!isPending}
              onClick={() => setApproveOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 py-3 text-[13px] font-semibold text-white disabled:opacity-40">
              <Check className="h-4 w-4" /> Approve & send Rx
            </button>
            <button
              disabled={!isPending}
              onClick={() => setInfoOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/12 px-3 py-3 text-[13px] font-medium text-ink hover:bg-ink/[0.03] disabled:opacity-40">
              <MessageSquare className="h-4 w-4" /> Request more info
            </button>
            <button
              disabled={!isPending}
              onClick={() => setRejectOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-ever/30 px-3 py-3 text-[13px] font-medium text-ever hover:bg-ever/5 disabled:opacity-40">
              <XIcon className="h-4 w-4" /> Reject case
            </button>
          </div>

          <Card className="p-4">
            <PanelTitle>Your stats today</PanelTitle>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
              <div><div className="text-ink/50">Reviewed</div><div className="font-semibold text-ink">{approvedToday + rejectedToday}</div></div>
              <div><div className="text-ink/50">Approved</div><div className="font-semibold text-check">{approvedToday}</div></div>
              <div><div className="text-ink/50">Rejected</div><div className="font-semibold text-ever">{rejectedToday}</div></div>
              <div><div className="text-ink/50">Avg time</div><div className="font-semibold text-ink">{phy?.avgResponseHrs ?? "—"}h</div></div>
            </div>
            <div className="mt-3 text-[11px] text-ink/50">Licensed states: 41 active</div>
          </Card>
        </div>
      </div>

      {/* Approve modal */}
      {approveOpen && (
        <Modal onClose={() => setApproveOpen(false)} title="Approve & send Rx">
          <p className="mb-3 text-[12.5px] text-ink/70">Enter your 4-digit PIN to e-sign this prescription.</p>
          <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
            className="mb-3 w-full rounded-lg border border-ink/12 px-3 py-2 text-center font-mono text-[18px] tracking-[0.5em] outline-none focus:border-ink" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setApproveOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doApprove} className="rounded-lg bg-ink px-3 py-2 text-[12px] font-semibold text-white">Confirm & send</button>
          </div>
        </Modal>
      )}

      {/* Info modal */}
      {infoOpen && (
        <Modal onClose={() => setInfoOpen(false)} title="Request more information">
          <textarea value={infoText} onChange={(e) => setInfoText(e.target.value)}
            placeholder="What do you need from the patient?"
            className="mb-3 min-h-[120px] w-full rounded-lg border border-ink/12 p-2.5 text-[12.5px] outline-none focus:border-ink" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setInfoOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doInfo} className="rounded-lg bg-ink px-3 py-2 text-[12px] font-semibold text-white">Send to patient</button>
          </div>
        </Modal>
      )}

      {/* Reject modal */}
      {rejectOpen && (
        <Modal onClose={() => setRejectOpen(false)} title="Reject case">
          <div className="mb-3 space-y-1.5">
            {REJECT_REASONS.map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-ink/[0.03]">
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                {r}
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-ink/[0.03]">
              <input type="radio" name="reason" checked={reason === "Other"} onChange={() => setReason("Other")} /> Other
            </label>
          </div>
          {reason === "Other" && (
            <input value={reasonText} onChange={(e) => setReasonText(e.target.value)} placeholder="Reason…"
              className="mb-3 w-full rounded-lg border border-ink/12 px-3 py-2 text-[12.5px] outline-none focus:border-ink" />
          )}
          <div className="flex justify-end gap-2">
            <button onClick={() => setRejectOpen(false)} className="rounded-lg border border-ink/12 px-3 py-2 text-[12px]">Cancel</button>
            <button onClick={doReject} className="rounded-lg bg-ever px-3 py-2 text-[12px] font-semibold text-white">Confirm rejection</button>
          </div>
        </Modal>
      )}

      {/* Reassign modal */}
      {reassignOpen && (
        <Modal onClose={() => setReassignOpen(false)} title="Reassign physician">
          <div className="space-y-1.5">
            {physicians.map((p) => (
              <button key={p.id} onClick={() => { adminActions.reassignCase(c.id, p.id); toast.success(`Assigned to ${p.name}`); setReassignOpen(false); }}
                className={`flex w-full items-center justify-between rounded-md border border-ink/12 px-3 py-2 text-left text-[12.5px] hover:border-ink ${p.id === c.assignedTo ? "bg-ink/[0.03]" : ""}`}>
                <div><div className="font-medium text-ink">{p.name}</div><div className="text-[11px] text-ink/50">{p.casesReviewed} cases · {p.avgResponseHrs}h avg</div></div>
                {p.id === c.assignedTo && <Check className="h-4 w-4 text-check" />}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </AdminShell>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{children}</div>;
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: "success" | "warn" }) {
  const toneClass = tone === "success" ? "text-check" : tone === "warn" ? "text-honey" : "text-ink";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink/40">{label}</div>
      <div className={`mt-0.5 text-[12.5px] font-medium ${toneClass}`}>{value}</div>
    </div>
  );
}

function RxRow({ label, defaultValue, onBlur, multiline }: { label: string; defaultValue: string; onBlur: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink/40">{label}</div>
      {multiline ? (
        <textarea defaultValue={defaultValue} onBlur={(e) => onBlur(e.target.value)}
          className="mt-1 min-h-[70px] w-full rounded-md border border-ink/12 px-2 py-1.5 text-[12.5px] outline-none focus:border-ink" />
      ) : (
        <input defaultValue={defaultValue} onBlur={(e) => onBlur(e.target.value)}
          className="mt-1 w-full rounded-md border border-ink/12 px-2 py-1.5 text-[12.5px] outline-none focus:border-ink" />
      )}
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
