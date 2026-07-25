import { Check } from "lucide-react";

export function DoseProgress({ step, total, strength }: { step: number; total: number; strength: string }) {
  const doses = ["1.5mg/mL", "5mg/mL", "10mg/mL", "15mg/mL"];
  return (
    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">Dose progression</div>
      <ol className="mt-3 flex items-center">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          const line = i < total - 1;
          return (
            <li key={n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold ring-2 ${
                  done ? "bg-emerald-500 text-white ring-emerald-100" :
                  current ? "bg-indigo-600 text-white ring-indigo-100" :
                  "bg-white text-slate-400 ring-slate-200"
                }`}>
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : n}
                </div>
                <div className={`mt-1.5 text-[10.5px] font-semibold ${current ? "text-indigo-700" : done ? "text-emerald-700" : "text-slate-400"}`}>Step {n}</div>
                <div className="text-[10px] text-ink/45">{doses[i] ?? "—"}</div>
              </div>
              {line && <div className={`mx-2 h-[2px] flex-1 ${n < step ? "bg-emerald-400" : "bg-slate-200"}`} />}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 text-[11.5px] text-ink/60">
        Currently on <b className="text-ink">Step {step} · {strength}</b>. Dose auto-titrates by protocol — same price, no action needed.
      </div>
    </div>
  );
}
