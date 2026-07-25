import { AlertTriangle, Ban, Clock, CircleX, CreditCard, ShieldOff } from "lucide-react";
import type { EnrichedPatient } from "@/lib/admin/patients-enrich";
import { PROGRAMS, adminActions } from "@/lib/admin/store";

export function StatusBanner({ p, onRetry, onContact }: {
  p: EnrichedPatient;
  onRetry?: () => void;
  onContact?: () => void;
}) {
  if (p.status === "pending") {
    return (
      <Wrap tone="amber" icon={<Clock className="h-5 w-5 text-amber-700" />}>
        <Head>AWAITING PHYSICIAN REVIEW</Head>
        <p className="mt-1 text-[13px] text-ink/75">
          {p.firstName} {p.lastName} submitted intake on <b>{p.startedAt}</b>.
          Assigned physician: <b>{p.physicianName}</b>.
          Card authorized: <b>${PROGRAMS[p.program].price}</b> · not yet charged.
        </p>
        <Actions>
          <Btn>View in physician queue →</Btn>
          <Btn variant="ghost">Mark priority</Btn>
        </Actions>
      </Wrap>
    );
  }
  if (p.status === "denied") {
    return (
      <Wrap tone="slate" icon={<ShieldOff className="h-5 w-5 text-slate-700" />}>
        <Head>PRESCRIPTION DENIED</Head>
        <p className="mt-1 text-[13px] text-ink/75">
          {p.physicianName} reviewed and denied on <b>{p.startedAt}</b>.
          Reason: <b>{p.denialReason ?? "Ineligibility"}</b>.
          Refund of ${PROGRAMS[p.program].price} issued · Visa {p.cardLast4}.
        </p>
        <Actions>
          <Btn variant="ghost">Send care-team follow-up</Btn>
          <Btn variant="ghost">Re-engage when eligible</Btn>
        </Actions>
      </Wrap>
    );
  }
  if (p.status === "cancelled") {
    return (
      <Wrap tone="muted" icon={<CircleX className="h-5 w-5 text-slate-600" />}>
        <Head>SUBSCRIPTION CANCELLED</Head>
        <p className="mt-1 text-[13px] text-ink/75">
          Cancelled {p.cancelledAt ?? p.startedAt}. Reason: <b>{p.cancelReason ?? "Not given"}</b>.
          Duration: {p.duration ?? "—"}. Total revenue: <b>${p.totalRevenue}</b>.
          Win-back: <b>{p.winbackStage ?? "Armed in Klaviyo"}</b>.
        </p>
        <Actions>
          <Btn onClick={() => adminActions.reactivatePatient(p.id)}>Reactivate subscription</Btn>
          <Btn variant="ghost">Offer discount</Btn>
        </Actions>
      </Wrap>
    );
  }
  if (p.status === "failed") {
    return (
      <Wrap tone="rose" icon={<CreditCard className="h-5 w-5 text-rose-600" />}>
        <Head>PAYMENT FAILED</Head>
        <p className="mt-1 text-[13px] text-ink/75">
          ${p.failedAmount} declined · Visa {p.cardLast4} · retry {p.failedRetryAttempt} of 3 scheduled {p.failedNextRetryAt}.
          Patient notified via email + SMS. Portal: no login in {Math.round((Date.now() - p.lastLoginAt) / 86_400_000)} days.
        </p>
        <Actions>
          <Btn onClick={onRetry}>Retry payment now</Btn>
          <Btn variant="ghost" onClick={onContact}>Contact patient</Btn>
          <Btn variant="ghost" onClick={() => adminActions.writeOffPatientPayment(p.id)}>Write off</Btn>
        </Actions>
      </Wrap>
    );
  }
  if (p.status === "paused") {
    return (
      <Wrap tone="amber" icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}>
        <Head>SUBSCRIPTION PAUSED</Head>
        <p className="mt-1 text-[13px] text-ink/75">
          Shipments are on hold. Auto-resume date not set.
        </p>
        <Actions>
          <Btn onClick={() => adminActions.reactivatePatient(p.id)}>Resume subscription</Btn>
        </Actions>
      </Wrap>
    );
  }
  return null;
}

function Wrap({ tone, icon, children }: { tone: "amber" | "rose" | "slate" | "muted"; icon: React.ReactNode; children: React.ReactNode }) {
  const border =
    tone === "rose" ? "border-rose-200 bg-rose-50/60" :
    tone === "amber" ? "border-amber-200 bg-amber-50/60" :
    tone === "slate" ? "border-slate-300 bg-slate-100/60" :
    "border-ink/10 bg-ink/[0.03]";
  return (
    <div className={`mb-4 flex items-start gap-3 rounded-xl border p-4 ${border}`}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
function Head({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{children}</div>;
}
function Actions({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 flex flex-wrap gap-2">{children}</div>;
}
function Btn({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" }) {
  const cls = variant === "primary"
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "bg-white text-ink ring-1 ring-ink/15 hover:ring-ink/30";
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${cls}`}>{children}</button>
  );
}

export function ChurnPill({ risk }: { risk: "low" | "medium" | "high" | "critical" }) {
  const cls =
    risk === "low" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
    risk === "medium" ? "bg-amber-50 text-amber-700 ring-amber-200" :
    risk === "high" ? "bg-rose-50 text-rose-700 ring-rose-200" :
    "bg-rose-600 text-white ring-rose-700";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ring-1 ring-inset ${cls}`}>{risk}</span>;
}

export function PatientStatusPill({ status }: { status: EnrichedPatient["status"] }) {
  const cfg: Record<EnrichedPatient["status"], { label: string; cls: string }> = {
    active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
    paused: { label: "Paused", cls: "bg-slate-100 text-slate-600 ring-slate-200" },
    failed: { label: "Failed", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
    cancelled: { label: "Cancelled", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
    denied: { label: "Denied", cls: "bg-ink text-white ring-ink" },
  };
  const c = cfg[status];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${c.cls}`}>{c.label}</span>;
}
