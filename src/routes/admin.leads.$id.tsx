import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Phone, MapPin, Calendar, User2, Tag as TagIcon, ExternalLink, UserPlus, Trash2 } from "lucide-react";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type LeadStatus } from "@/lib/admin/store";
import { FunnelStepper, IntentBadge, LeadInitials, LeadStatusPill, ScoreGauge } from "@/components/admin/leads/LeadPills";
import {
  AttributionCard, ConsentToggles, CopyField, IntakeSnapshotCard,
  LeadScoreBreakdown, LeadStatusBanner, LossReasonMenu, OutreachConsole,
} from "@/components/admin/leads/LeadDetailBlocks";

export const Route = createFileRoute("/admin/leads/$id")({
  head: () => ({ meta: [
    { title: "Lead — Blissley HQ" },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: LeadDetailPage,
});

const STATUS_CHOICES: LeadStatus[] = ["new", "working", "nurturing", "won", "lost", "do_not_contact"];

function LeadDetailPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const lead = useAdmin((s) => s.leads.find((l) => l.id === id));
  const [tagInput, setTagInput] = useState("");

  const projected = useMemo(() => lead ? { first: lead.projectedFirstOrder, ltv: lead.projectedLTV } : { first: 0, ltv: 0 }, [lead]);

  if (!lead) {
    return (
      <AdminShell title="Lead">
        <Card className="p-8 text-center">
          <div className="text-[14px] font-semibold text-ink">Lead not found</div>
          <Link to="/admin/leads" className="mt-2 inline-block text-[12.5px] font-semibold text-indigo-700 hover:underline">← Back to leads</Link>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Lead">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => nav({ to: "/admin/leads" })} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-indigo-700 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to leads
        </button>
        <div className="text-[11px] font-mono text-ink/45">{lead.id}</div>
      </div>

      <LeadStatusBanner lead={lead} />

      {/* Header */}
      <Card className="mb-4 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="scale-125"><LeadInitials lead={lead} /></div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-hero text-[22px] font-semibold text-ink">{lead.name}</h1>
              <IntentBadge intent={lead.intent} />
              <LeadStatusPill status={lead.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink/60">
              <CopyField value={lead.email} />
              <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.city}, {lead.state}</span>
              {lead.dob && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {lead.dob}</span>}
              {lead.assignee && <span className="inline-flex items-center gap-1"><User2 className="h-3 w-3" /> {lead.assignee}</span>}
            </div>
          </div>
          <ScoreGauge score={lead.score} />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => adminActions.convertLeadToPatient(lead.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-emerald-700">
              <UserPlus className="h-3.5 w-3.5" /> Convert to patient
            </button>
            <select value={lead.status} onChange={(e) => adminActions.updateLeadStatus(lead.id, e.target.value as LeadStatus)}
              className="rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
              {STATUS_CHOICES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle>Funnel progress</SectionTitle>
            <FunnelStepper current={lead.funnelStep} />
          </Card>

          <Card className="p-5">
            <SectionTitle>Lead score</SectionTitle>
            <LeadScoreBreakdown lead={lead} />
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="What they answered before dropping off">Intake snapshot</SectionTitle>
            <IntakeSnapshotCard lead={lead} />
          </Card>

          <Card className="p-5">
            <SectionTitle>Outreach</SectionTitle>
            <OutreachConsole lead={lead} />
          </Card>

          <Card className="p-5">
            <SectionTitle>Attribution</SectionTitle>
            <AttributionCard lead={lead} />
          </Card>

          {(lead.cartItems || lead.coupon) && (
            <Card className="p-5">
              <SectionTitle>Cart</SectionTitle>
              <div className="space-y-1 text-[12.5px]">
                {lead.cartItems?.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-ink/8 bg-white px-3 py-2">
                    <span className="text-ink">{c}</span>
                    <span className="font-semibold tabular-nums text-ink">${lead.projectedFirstOrder}</span>
                  </div>
                ))}
                {lead.coupon && <div className="text-ink/60">Coupon: <span className="font-mono font-semibold text-ink">{lead.coupon}</span></div>}
              </div>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle>Projected value</SectionTitle>
            <div className="space-y-2 text-[13px]">
              <Row k="First order" v={`$${projected.first}`} bold />
              <Row k="Projected LTV" v={`$${projected.ltv.toLocaleString()}`} bold />
              <Row k="Program interest" v={lead.program} />
              {lead.bmi && <Row k="BMI" v={lead.bmi.toString()} />}
              {lead.currentWeight && <Row k="Current weight" v={`${lead.currentWeight} lb`} />}
              {lead.goalWeight && <Row k="Goal weight" v={`${lead.goalWeight} lb`} />}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Consent</SectionTitle>
            <ConsentToggles lead={lead} />
          </Card>

          <Card className="p-5">
            <SectionTitle>Manage</SectionTitle>
            <div className="space-y-2 text-[12.5px]">
              <select onChange={(e) => e.target.value && adminActions.assignLead(lead.id, e.target.value)}
                value={lead.assignee ?? ""}
                className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 font-semibold text-ink">
                <option value="">Assign to…</option>
                {["Andre F.", "Priya S.", "Ops", "You"].map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <button onClick={() => adminActions.updateLeadStatus(lead.id, lead.status === "do_not_contact" ? "new" : "do_not_contact")}
                className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-left font-semibold text-ink hover:bg-ink/[0.03]">
                {lead.status === "do_not_contact" ? "Remove DNC status" : "Mark do-not-contact"}
              </button>
              <a href={lead.attribution.landingUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-between rounded-lg border border-ink/12 bg-white px-3 py-1.5 font-semibold text-ink hover:bg-ink/[0.03]">
                Open landing page <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Tags</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.length === 0 && <span className="text-[12px] text-ink/45">No tags yet.</span>}
              {lead.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                  <TagIcon className="h-2.5 w-2.5" /> {t}
                  <button onClick={() => adminActions.removeLeadTag(lead.id, t)} className="ml-0.5 text-indigo-500 hover:text-rose-600">×</button>
                </span>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); adminActions.addLeadTag(lead.id, tagInput); setTagInput(""); }} className="mt-2 flex gap-1.5">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag"
                className="flex-1 rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-indigo-700">Add</button>
            </form>
          </Card>

          <Card className="p-5">
            <SectionTitle>Danger zone</SectionTitle>
            <div className="space-y-2">
              <LossReasonMenu lead={lead} />
              <button onClick={() => { if (confirm("Delete this lead? This cannot be undone.")) { adminActions.deleteLead(lead.id); nav({ to: "/admin/leads" }); } }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-rose-700 hover:bg-rose-50">
                <Trash2 className="h-3.5 w-3.5" /> Delete lead
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Row({ k, v, bold }: { k: string; v: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/6 pb-1.5 last:border-0">
      <span className="text-ink/60">{k}</span>
      <span className={`text-right tabular-nums ${bold ? "font-semibold text-ink" : "text-ink/80"}`}>{v}</span>
    </div>
  );
}
