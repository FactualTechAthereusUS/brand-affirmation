import { useState } from "react";
import { adminActions, PROGRAMS } from "@/lib/admin/store";
import type { EnrichedPatient } from "@/lib/admin/patients-enrich";
import { Modal } from "./ManagePanel";
import { Mail, Link as LinkIcon, DollarSign, Package, Flag, Download, Trash2 } from "lucide-react";

export function QuickActionsPanel({ p }: { p: EnrichedPatient }) {
  const [modal, setModal] = useState<null | "refund" | "flag" | "delete">(null);
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <>
      <Row icon={<Mail className="h-4 w-4" />} label="Send message">
        {"Send message"}
      </Row>
      <Row icon={<LinkIcon className="h-4 w-4" />} label="Send magic link" onClick={() => { adminActions.sendMagicLink(p.id); setFlash("Magic link sent to " + p.email); setTimeout(() => setFlash(null), 2500); }} />
      <Row icon={<DollarSign className="h-4 w-4" />} label="Issue refund" onClick={() => setModal("refund")} />
      <Row icon={<Package className="h-4 w-4" />} label="Create new order" onClick={() => alert("Manual order creation (stub)")} />
      <Row icon={<Flag className="h-4 w-4" />} label="Flag for review" onClick={() => setModal("flag")} />
      <Row icon={<Download className="h-4 w-4" />} label="Export patient record" onClick={() => alert("PDF export (stub)")} />
      <Row icon={<Trash2 className="h-4 w-4 text-rose-600" />} label="Delete patient" onClick={() => setModal("delete")} danger />

      {flash && <div className="mt-2 rounded-md bg-emerald-50 px-3 py-1.5 text-[11.5px] font-medium text-emerald-700 ring-1 ring-emerald-200">{flash}</div>}

      {modal === "refund" && <RefundModal p={p} onClose={() => setModal(null)} />}
      {modal === "flag" && <FlagModal p={p} onClose={() => setModal(null)} />}
      {modal === "delete" && <DeleteModal p={p} onClose={() => setModal(null)} />}
    </>
  );
}

function Row({ icon, label, onClick, danger, children }: { icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean; children?: React.ReactNode }) {
  void children;
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] font-medium hover:bg-ink/[0.04] ${danger ? "text-rose-700" : "text-ink"}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function RefundModal({ p, onClose }: { p: EnrichedPatient; onClose: () => void }) {
  const [amount, setAmount] = useState(PROGRAMS[p.program].price);
  const [reason, setReason] = useState("Requested by patient");
  return (
    <Modal title="Issue refund" onClose={onClose}>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Amount</label>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-ink/12 px-3 py-2 text-[13px] outline-none focus:border-indigo-500" />
      <label className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-ink/50">Reason</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/12 px-3 py-2 text-[13px] outline-none focus:border-indigo-500">
        <option>Requested by patient</option>
        <option>Side effects</option>
        <option>Duplicate charge</option>
        <option>Goodwill</option>
        <option>Denied Rx</option>
      </select>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-ink/60" onClick={onClose}>Cancel</button>
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white" onClick={() => { adminActions.refundPatientCharge(p.id, amount, reason); onClose(); }}>Issue refund</button>
      </div>
    </Modal>
  );
}

function FlagModal({ p, onClose }: { p: EnrichedPatient; onClose: () => void }) {
  const [reason, setReason] = useState("");
  return (
    <Modal title="Flag for review" onClose={onClose}>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Reason to flag…"
        className="w-full resize-none rounded-lg border border-ink/12 p-2.5 text-[13px] outline-none focus:border-indigo-500" />
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-ink/60" onClick={onClose}>Cancel</button>
        <button className="rounded-lg bg-amber-500 px-3 py-1.5 text-[12px] font-semibold text-white" onClick={() => { adminActions.flagPatientForReview(p.id, reason || "Manual flag"); onClose(); }}>Flag</button>
      </div>
    </Modal>
  );
}

function DeleteModal({ p, onClose }: { p: EnrichedPatient; onClose: () => void }) {
  const [typed, setTyped] = useState("");
  const target = `${p.firstName} ${p.lastName}`;
  const ok = typed.trim().toLowerCase() === target.toLowerCase();
  return (
    <Modal title="Delete patient" onClose={onClose}>
      <p className="text-[13px] text-ink/70">This removes the patient from active UI. Full record is retained 7 years per HIPAA.</p>
      <p className="mt-2 text-[12.5px] font-semibold text-ink">Type <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[11.5px]">{target}</span> to confirm.</p>
      <input value={typed} onChange={(e) => setTyped(e.target.value)} className="mt-2 w-full rounded-lg border border-ink/12 px-3 py-2 text-[13px] outline-none focus:border-rose-500" />
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-ink/60" onClick={onClose}>Cancel</button>
        <button disabled={!ok} onClick={onClose} className="rounded-lg bg-rose-600 px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40">Delete</button>
      </div>
    </Modal>
  );
}
