import { useState } from "react";
import { Mail, MessageSquare, Phone, StickyNote, ExternalLink, Copy, Check, X, ChevronDown } from "lucide-react";
import type { Lead, LeadOutreachChannel } from "@/lib/admin/store";
import { adminActions } from "@/lib/admin/store";
import { scoreBreakdown } from "@/lib/admin/leads-enrich";
import { ChannelIcon } from "./LeadPills";

function fmtTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function LeadStatusBanner({ lead }: { lead: Lead }) {
  if (lead.status === "do_not_contact") {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-white"><X className="h-4 w-4" /></div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-rose-900">Do not contact</div>
          <div className="text-[12px] text-rose-800/80">All outreach is suppressed. Remove DNC status to re-engage.</div>
        </div>
      </div>
    );
  }
  if (lead.funnelStep === "payment_fail") {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-500 text-white">!</div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-amber-900">Payment failed at checkout</div>
          <div className="text-[12px] text-amber-800/80">Card declined. Send a fresh checkout link or retry the charge.</div>
        </div>
        <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-amber-700">Send checkout link</button>
      </div>
    );
  }
  if ((lead.funnelStep === "intake_start" || lead.funnelStep === "intake_mid") && lead.status !== "lost") {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-500 text-white">↺</div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-indigo-900">Intake abandoned mid-form</div>
          <div className="text-[12px] text-indigo-800/80">Send a resume link so they can pick up where they left off.</div>
        </div>
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-indigo-700">Send resume link</button>
      </div>
    );
  }
  if (lead.intent === "hot" && !lead.contacted) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">★</div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-emerald-900">Hot lead · not yet contacted</div>
          <div className="text-[12px] text-emerald-800/80">Score {lead.score}. Reach out within the next hour for the best conversion odds.</div>
        </div>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-700">Contact now</button>
      </div>
    );
  }
  return null;
}

export function LeadScoreBreakdown({ lead }: { lead: Lead }) {
  const parts = scoreBreakdown(lead);
  const total = parts.reduce((s, p) => s + p.value, 0);
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <div className="font-hero text-[28px] font-semibold tabular-nums text-ink">{Math.round(total)}</div>
        <div className="text-[11.5px] uppercase tracking-wider text-ink/50">composite score</div>
      </div>
      <div className="space-y-2.5">
        {parts.map((p) => {
          const pct = (p.value / p.max) * 100;
          const color = { indigo: "bg-indigo-500", violet: "bg-violet-500", sky: "bg-sky-500", emerald: "bg-emerald-500" }[p.tone];
          return (
            <div key={p.label}>
              <div className="mb-1 flex items-center justify-between text-[11.5px]">
                <span className="text-ink/70">{p.label}</span>
                <span className="font-semibold tabular-nums text-ink">{Math.round(p.value)} / {p.max}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function IntakeSnapshotCard({ lead }: { lead: Lead }) {
  const intakeSnapshot = lead.intakeSnapshot ?? [];
  return (
    <div className="space-y-2.5">
      {intakeSnapshot.length === 0 ? (
        <div className="text-[12.5px] text-ink/50">No intake answers submitted yet.</div>
      ) : intakeSnapshot.map((it, i) => (
        <div key={i} className="rounded-lg border border-ink/8 bg-white px-3 py-2">
          <div className="text-[11px] font-medium text-ink/55">{it.q}</div>
          <div className="mt-0.5 text-[13px] font-semibold text-ink">{it.a}</div>
        </div>
      ))}
      {(lead.funnelStep === "intake_start" || lead.funnelStep === "intake_mid") && (
        <button className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[12px] font-semibold text-indigo-700 hover:bg-indigo-100">
          <ExternalLink className="h-3.5 w-3.5" /> Send resume-intake link
        </button>
      )}
    </div>
  );
}

export function AttributionCard({ lead }: { lead: Lead }) {
  const a = lead.attribution ?? {
    source: lead.source || "Organic",
    medium: "organic",
    campaign: lead.source || "Organic",
    landingUrl: "/weight-loss",
    deviceType: "mobile" as const,
    sessions: 1,
    firstTouch: lead.createdAt,
    lastTouch: lead.lastTouchAt,
  };
  const rows: Array<[string, React.ReactNode]> = [
    ["Source", <ChannelIcon key="s" source={a.source} />],
    ["Medium", a.medium],
    ["Campaign", <span key="c" className="font-mono text-[11.5px]">{a.campaign}</span>],
    ...(a.adset ? [["Adset", a.adset] as [string, React.ReactNode]] : []),
    ...(a.creative ? [["Creative", <span key="cr" className="font-mono text-[11.5px]">{a.creative}</span>] as [string, React.ReactNode]] : []),
    ["Landing", <span key="l" className="font-mono text-[11.5px]">{a.landingUrl}</span>],
    ["Device", a.deviceType],
    ["Sessions", a.sessions],
    ["First touch", fmtTime(a.firstTouch)],
    ["Last touch", fmtTime(a.lastTouch)],
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
      {rows.map(([k, v], i) => (
        <div key={i} className="flex items-center justify-between border-b border-ink/6 pb-1.5 last:border-0">
          <dt className="text-ink/55">{k}</dt>
          <dd className="text-right font-medium text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const CHANNELS: Array<{ key: LeadOutreachChannel; label: string; icon: typeof Mail }> = [
  { key: "email", label: "Email", icon: Mail },
  { key: "sms", label: "SMS", icon: MessageSquare },
  { key: "call", label: "Call log", icon: Phone },
  { key: "note", label: "Internal note", icon: StickyNote },
];

export function OutreachConsole({ lead }: { lead: Lead }) {
  const [channel, setChannel] = useState<LeadOutreachChannel>("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const outreach = lead.outreach ?? [];

  function send() {
    if (!subject.trim() && !body.trim()) return;
    adminActions.addLeadOutreach(lead.id, channel, subject || body.slice(0, 40), channel === "call" ? "connected · logged" : "sent");
    setSubject(""); setBody("");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-lg bg-ink/[0.04] p-1">
        {CHANNELS.map((c) => {
          const active = channel === c.key;
          return (
            <button key={c.key} onClick={() => setChannel(c.key)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-semibold transition ${
                active ? "bg-white text-indigo-700 shadow-sm ring-1 ring-ink/10" : "text-ink/60 hover:text-ink"
              }`}>
              <c.icon className="h-3.5 w-3.5" /> {c.label}
            </button>
          );
        })}
      </div>
      {channel !== "note" && channel !== "call" && (
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={channel === "email" ? "Subject line" : "Message preview"}
          className="w-full rounded-lg border border-ink/12 bg-white px-3 py-2 text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      )}
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3}
        placeholder={channel === "note" ? "Internal note — only your team can see this" : channel === "call" ? "Call outcome & next steps" : "Write your message…"}
        className="w-full resize-y rounded-lg border border-ink/12 bg-white px-3 py-2 text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      <div className="flex justify-end">
        <button onClick={send} className="rounded-lg bg-indigo-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-indigo-700">
          {channel === "note" ? "Save note" : channel === "call" ? "Log call" : "Send"}
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {outreach.length === 0 && <div className="rounded-lg border border-dashed border-ink/12 py-6 text-center text-[12px] text-ink/45">No outreach yet.</div>}
        {outreach.map((o) => {
          const Icon = CHANNELS.find((c) => c.key === o.channel)?.icon ?? Mail;
          return (
            <div key={o.id} className="flex gap-3 rounded-lg border border-ink/8 bg-white px-3 py-2.5">
              <Icon className="mt-0.5 h-4 w-4 text-indigo-600" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-[12.5px] font-semibold text-ink">{o.subject}</div>
                  <div className="shrink-0 text-[11px] text-ink/45">{fmtTime(o.ts)}</div>
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink/60">by {o.by} · <span className="text-ink/80">{o.outcome}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
      className="group inline-flex items-center gap-1 text-[12.5px] text-ink hover:text-indigo-700">
      <span className="truncate">{value}</span>
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-ink/40 opacity-0 transition group-hover:opacity-100" />}
    </button>
  );
}

export function ConsentToggles({ lead }: { lead: Lead }) {
  const items: Array<[keyof Lead["consent"], string]> = [["email", "Email"], ["sms", "SMS"], ["marketing", "Marketing"]];
  const consent = lead.consent ?? { email: true, sms: false, marketing: false };
  return (
    <div className="space-y-1.5">
      {items.map(([k, label]) => {
        const on = consent[k];
        return (
          <label key={k} className="flex items-center justify-between text-[12.5px]">
            <span className="text-ink/75">{label} opt-in</span>
            <button onClick={() => adminActions.setLeadConsent(lead.id, { [k]: !on } as Partial<Lead["consent"]>)}
              className={`relative inline-flex h-4 w-7 items-center rounded-full transition ${on ? "bg-emerald-500" : "bg-ink/15"}`}>
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition ${on ? "translate-x-3.5" : "translate-x-0.5"}`} />
            </button>
          </label>
        );
      })}
    </div>
  );
}

export function LossReasonMenu({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const reasons = ["price", "competitor", "ineligible state", "unresponsive", "medical", "other"];
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="inline-flex w-full items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[12px] font-semibold text-rose-700 hover:bg-rose-100">
        Mark lost <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-ink/10 bg-white p-1 shadow-lg">
          {reasons.map((r) => (
            <button key={r} onClick={() => { adminActions.markLeadLost(lead.id, r); setOpen(false); }}
              className="block w-full rounded-md px-3 py-1.5 text-left text-[12px] capitalize text-ink hover:bg-ink/[0.04]">
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
