import { Check, AlertTriangle } from "lucide-react";

export type StepperStep = {
  key: string;
  label: string;
  sublabel?: string;
  state: "done" | "current" | "pending" | "exception";
};

export function Stepper({ steps }: { steps: StepperStep[] }) {
  return (
    <ol className="flex flex-wrap items-start gap-y-4 sm:flex-nowrap sm:gap-y-0">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        const bg =
          s.state === "done" ? "bg-emerald-500 text-white" :
          s.state === "current" ? "bg-indigo-600 text-white ring-4 ring-indigo-100" :
          s.state === "exception" ? "bg-rose-500 text-white" :
          "bg-slate-100 text-slate-400";
        const line =
          s.state === "done" ? "bg-emerald-400" :
          s.state === "current" ? "bg-gradient-to-r from-emerald-400 to-slate-200" :
          "bg-slate-200";
        const label =
          s.state === "pending" ? "text-slate-400" :
          s.state === "exception" ? "text-rose-600" :
          "text-ink";

        return (
          <li key={s.key} className="relative flex min-w-[6.5rem] flex-1 flex-col items-center px-1">
            <div className="flex w-full items-center">
              <div className="hidden h-[2px] flex-1 sm:block" style={{ background: i === 0 ? "transparent" : "" }} />
              <div className={`grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold ${bg}`}>
                {s.state === "done" ? <Check className="h-4 w-4" strokeWidth={3} />
                  : s.state === "exception" ? <AlertTriangle className="h-4 w-4" />
                  : <span>{i + 1}</span>}
              </div>
              {!isLast && <div className={`hidden h-[2px] flex-1 sm:block ${line}`} />}
            </div>
            <div className={`mt-2 text-center text-[11.5px] font-semibold leading-tight ${label}`}>{s.label}</div>
            {s.sublabel && <div className="mt-0.5 text-center text-[10.5px] text-ink/45">{s.sublabel}</div>}
          </li>
        );
      })}
    </ol>
  );
}
