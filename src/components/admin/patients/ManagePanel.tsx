import { useState } from "react";
import { adminActions, PROGRAMS, type ProgramCode } from "@/lib/admin/store";
import type { EnrichedPatient } from "@/lib/admin/patients-enrich";
import { Pause, Ban, ArrowRightLeft, CreditCard, Calendar, MapPin, X } from "lucide-react";

export function ManagePanel({ p }: { p: EnrichedPatient }) {
  const [modal, setModal] = useState<null | "pause" | "cancel" | "switch" | "billing">(null);
  return (
    <>
      <Row icon={<Pause className="h-4 w-4" />} label="Pause subscription" onClick={() => setModal("pause")} />
      <Row icon={<Ban className="h-4 w-4 text-rose-600" />} label="Cancel subscription" onClick={() => setModal("cancel")} danger />
      <Row icon={<ArrowRightLeft className="h-4 w-4" />} label="Switch plan" onClick={() => setModal("switch")} />
      <Row icon={<CreditCard className="h-4 w-4" />} label="Update payment method" onClick={() => alert("Stripe hosted payment update (stub)")} />
      <Row icon={<Calendar className="h-4 w-4" />} label="Update billing date" onClick={() => setModal("billing")} />
      <Row icon={<MapPin className="h-4 w-4" />} label="Update shipping address" onClick={() => alert("Address form (stub)")} />

      {modal === "pause" && (
        <Modal title="Pause subscription" onClose={() => setModal(null)}>
          <p className="text-[13px] text-ink/70">Choose how long to pause billing + shipments.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["30 days", "60 days", "90 days", "Custom"].map((d) => (
              <button key={d} className="rounded-lg border border-ink/12 px-3 py-2 text-[12.5px] font-semibold hover:border-indigo-500 hover:text-indigo-700"
                onClick={() => { adminActions.pausePatient(p.id); setModal(null); }}>{d}</button>
            ))}
          </div>
        </Modal>
      )}
      {modal === "cancel" && <CancelModal p={p} onClose={() => setModal(null)} />}
      {modal === "switch" && <SwitchModal p={p} onClose={() => setModal(null)} />}
      {modal === "billing" && (
        <Modal title="Update billing date" onClose={() => setModal(null)}>
          <p className="text-[13px] text-ink/70">Move next charge date forward or back (max 30 days).</p>
          <input type="date" defaultValue={p.nextBillingAt} className="mt-3 w-full rounded-lg border border-ink/12 px-3 py-2 text-[13px] outline-none focus:border-indigo-500" />
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-ink/60" onClick={() => setModal(null)}>Cancel</button>
            <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white" onClick={() => setModal(null)}>Save changes</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Row({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] font-medium hover:bg-ink/[0.04] ${danger ? "text-rose-700" : "text-ink"}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function CancelModal({ p, onClose }: { p: EnrichedPatient; onClose: () => void }) {
  const [reason, setReason] = useState("Too expensive");
  return (
    <Modal title="Cancel subscription" onClose={onClose}>
      <p className="text-[13px] text-ink/70">
        Cancel {p.firstName} {p.lastName}'s subscription? Next charge of <b>${PROGRAMS[p.program].price}</b> on {p.nextBillingAt} will not process.
      </p>
      <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-3 w-full rounded-lg border border-ink/12 px-3 py-2 text-[13px] outline-none focus:border-indigo-500">
        <option>Too expensive</option>
        <option>Side effects</option>
        <option>Reached goal</option>
        <option>Switching provider</option>
        <option>Other</option>
      </select>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-ink/60" onClick={onClose}>Keep subscription</button>
        <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-[12px] font-semibold text-white" onClick={() => { adminActions.cancelPatient(p.id, reason); onClose(); }}>Cancel anyway</button>
      </div>
    </Modal>
  );
}

function SwitchModal({ p, onClose }: { p: EnrichedPatient; onClose: () => void }) {
  const [pick, setPick] = useState<ProgramCode>(p.program);
  return (
    <Modal title="Switch plan" onClose={onClose}>
      <div className="space-y-2">
        {(Object.keys(PROGRAMS) as ProgramCode[]).map((k) => (
          <label key={k} className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-[13px] ${pick === k ? "border-indigo-500 bg-indigo-50/50" : "border-ink/12"}`}>
            <div className="flex items-center gap-2">
              <input type="radio" name="plan" checked={pick === k} onChange={() => setPick(k)} />
              <div>
                <div className="font-semibold text-ink">{PROGRAMS[k].label}</div>
                <div className="text-[11px] text-ink/50">${PROGRAMS[k].price}/mo</div>
              </div>
            </div>
            {k === p.program && <span className="text-[10.5px] font-semibold uppercase tracking-wide text-indigo-700">Current</span>}
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-ink/60" onClick={onClose}>Cancel</button>
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white" onClick={() => { adminActions.switchPlanPatient(p.id, pick); onClose(); }}>Save changes</button>
      </div>
    </Modal>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-hero text-[16px] font-semibold text-ink">{title}</div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-ink/5"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
