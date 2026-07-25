import type { Lead, LeadStatus, LeadIntent, LeadFunnelStep } from "@/lib/admin/store";
import { FUNNEL_STEPS } from "@/lib/admin/leads-enrich";

export function ScorePill({ score }: { score: number }) {
  const tone =
    score >= 70 ? "bg-emerald-100 text-emerald-800 ring-emerald-200" :
    score >= 45 ? "bg-amber-100 text-amber-800 ring-amber-200" :
    "bg-ink/[0.06] text-ink/70 ring-ink/10";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ring-1 ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {score}
    </span>
  );
}

export function IntentBadge({ intent }: { intent: LeadIntent }) {
  const map: Record<LeadIntent, string> = {
    hot: "bg-coral-500/12 text-[#c94847] ring-[#ee7273]/40",
    warm: "bg-amber-100 text-amber-800 ring-amber-200",
    cold: "bg-sky-50 text-sky-700 ring-sky-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1 ${map[intent]}`}>
      {intent}
    </span>
  );
}

const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  working: "bg-violet-100 text-violet-800 ring-violet-200",
  nurturing: "bg-sky-100 text-sky-800 ring-sky-200",
  won: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  lost: "bg-ink/[0.06] text-ink/60 ring-ink/12",
  do_not_contact: "bg-rose-100 text-rose-800 ring-rose-200",
};

export function LeadStatusPill({ status }: { status: LeadStatus }) {
  const label = status === "do_not_contact" ? "DNC" : status;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ring-1 ${STATUS_TONE[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}

export function EligibilityDot({ ok, state }: { ok: boolean; state: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-ink/75">
      <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-rose-500"}`} title={ok ? "Rx eligible" : "Rx not available in state"} />
      {state}
    </span>
  );
}

export function FunnelBar({ step, pct }: { step: LeadFunnelStep; pct: number }) {
  const label = FUNNEL_STEPS.find((s) => s.key === step)?.label ?? step;
  return (
    <div className="min-w-[130px]">
      <div className="mb-0.5 text-[10.5px] font-medium text-ink/60">{label}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.08]">
        <div
          className={`h-full rounded-full ${step === "payment_fail" ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function FunnelStepper({ current }: { current: LeadFunnelStep }) {
  const idx = FUNNEL_STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1">
      {FUNNEL_STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex flex-1 items-center gap-1">
            <div className={`flex flex-1 flex-col items-start rounded-lg px-2.5 py-2 ring-1 ${
              active ? "bg-indigo-50 ring-indigo-300" : done ? "bg-emerald-50 ring-emerald-200" : "bg-white ring-ink/10"
            }`}>
              <div className={`text-[9.5px] font-semibold uppercase tracking-wide ${active ? "text-indigo-700" : done ? "text-emerald-700" : "text-ink/45"}`}>
                Step {i + 1}
              </div>
              <div className={`text-[12px] font-semibold ${active ? "text-indigo-900" : done ? "text-emerald-900" : "text-ink/70"}`}>{s.label}</div>
            </div>
            {i < FUNNEL_STEPS.length - 1 && <div className={`h-px flex-1 ${done ? "bg-emerald-300" : "bg-ink/10"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function ScoreGauge({ score }: { score: number }) {
  const tone = score >= 70 ? "#059669" : score >= 45 ? "#d97706" : "#64748b";
  const dash = `${(score / 100) * 176} 176`;
  return (
    <div className="relative inline-grid place-items-center">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx="36" cy="36" r="28" fill="none" stroke={tone} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={dash} transform="rotate(-90 36 36)" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[16px] font-semibold tabular-nums text-ink">{score}</div>
          <div className="text-[9px] uppercase tracking-wider text-ink/50">score</div>
        </div>
      </div>
    </div>
  );
}

export function ChannelIcon({ source }: { source: string }) {
  const label = source || "Organic";
  const c: Record<string, string> = { Meta: "bg-blue-100 text-blue-700", Google: "bg-amber-100 text-amber-700", Organic: "bg-emerald-100 text-emerald-700", Referral: "bg-violet-100 text-violet-700", TikTok: "bg-pink-100 text-pink-700", Klaviyo: "bg-indigo-100 text-indigo-700" };
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${c[label] ?? "bg-ink/[0.06] text-ink/70"}`}>{label}</span>;
}

export function LeadInitials({ lead }: { lead: Lead }) {
  const parts = (lead.name || "Lead").split(" ");
  const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  return <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-semibold text-white">{initials}</div>;
}
