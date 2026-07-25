import { useState } from "react";
import { adminActions } from "@/lib/admin/store";
import type { EnrichedPatient } from "@/lib/admin/patients-enrich";

function fmt(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}

export function InternalNotes({ p }: { p: EnrichedPatient }) {
  const [text, setText] = useState("");
  const notes = p.notes ?? [];
  return (
    <div>
      <p className="text-[11px] text-ink/50">Visible to admin team only. Never shown to patient.</p>
      <div className="mt-3 space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="rounded-md border border-ink/[0.06] bg-amber-50/50 p-2.5">
            <div className="text-[12.5px] text-ink">{n.text}</div>
            <div className="mt-1 text-[10.5px] text-ink/50">— {n.author} · {fmt(n.ts)}</div>
          </div>
        ))}
        {notes.length === 0 && <div className="rounded-md border border-dashed border-ink/10 p-3 text-[11.5px] text-ink/45">No internal notes yet.</div>}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Add note…"
        className="mt-3 w-full resize-none rounded-lg border border-ink/10 bg-white p-2.5 text-[12.5px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      <button
        onClick={() => { adminActions.addPatientNote(p.id, text); setText(""); }}
        disabled={!text.trim()}
        className="mt-2 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
      >Save note</button>
    </div>
  );
}
