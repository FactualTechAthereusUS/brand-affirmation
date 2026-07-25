import { useState } from "react";
import { adminActions } from "@/lib/admin/store";
import type { EnrichedPatient } from "@/lib/admin/patients-enrich";
import { selectPatientTimeline } from "@/lib/admin/patients-enrich";
import { useAdmin } from "@/lib/admin/store";

const toneDot: Record<string, string> = {
  info: "bg-slate-300",
  success: "bg-emerald-500",
  warn: "bg-amber-500",
  critical: "bg-rose-500",
};

function fmt(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}

export function PatientTimeline({ p }: { p: EnrichedPatient }) {
  const events = useAdmin((s) => selectPatientTimeline(s, p.id, p));
  const [note, setNote] = useState("");
  const notes = p.notes ?? [];

  return (
    <div>
      <ol className="relative ml-1 space-y-2.5 border-l border-ink/10 pl-4">
        {events.slice(0, 40).map((e, i) => (
          <li key={i} className="relative">
            <span className={`absolute -left-[21px] top-1.5 grid h-2.5 w-2.5 place-items-center rounded-full ${toneDot[e.tone]}`} />
            <div className="text-[12px] text-ink">{e.text}</div>
            <div className="text-[10.5px] text-ink/45">{fmt(e.ts)}</div>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-lg border border-dashed border-ink/15 p-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add internal note to timeline…"
          className="w-full resize-none rounded-md border border-ink/10 bg-white p-2 text-[12.5px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          rows={2}
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => { adminActions.addPatientNote(p.id, note); setNote(""); }}
            disabled={!note.trim()}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
          >Add note</button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="mt-3 space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-md bg-amber-50/60 p-2.5 text-[12px] ring-1 ring-amber-200">
              <div className="text-ink">{n.text}</div>
              <div className="mt-0.5 text-[10.5px] text-ink/50">— {n.author} · {fmt(n.ts)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
