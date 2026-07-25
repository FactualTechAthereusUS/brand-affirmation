import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare, DollarSign, MoreHorizontal, ExternalLink } from "lucide-react";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { PROGRAMS, adminActions, useAdmin } from "@/lib/admin/store";
import {
  enrichPatient, selectPatientOrders, selectPatientPayments,
} from "@/lib/admin/patients-enrich";
import { PatientStatusPill, StatusBanner, ChurnPill } from "@/components/admin/patients/StatusBanner";
import { DoseProgress } from "@/components/admin/patients/DoseProgress";
import { PatientTimeline } from "@/components/admin/patients/PatientTimeline";
import { ManagePanel } from "@/components/admin/patients/ManagePanel";
import { QuickActionsPanel } from "@/components/admin/patients/QuickActionsPanel";
import { InternalNotes } from "@/components/admin/patients/InternalNotes";

export const Route = createFileRoute("/admin/patients/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Patient ${params.id} — Blissley HQ` },
    { name: "description", content: "Full patient record — subscription, clinical, orders, payments, communications, and timeline." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: PatientDetail,
});

function PatientDetail() {
  const { id } = useParams({ from: "/admin/patients/$id" });
  const nav = useNavigate();
  const patient = useAdmin((s) => s.patients.find((p) => p.id === id));
  const orders = useAdmin((s) => selectPatientOrders(s, id));
  const payments = useAdmin((s) => selectPatientPayments(s, id));

  if (!patient) {
    return (
      <AdminShell>
        <div className="grid h-96 place-items-center text-[12.5px] text-ink/45">
          Patient not found.
          <Link to="/admin/patients" className="ml-2 text-indigo-700 underline">Back to patients →</Link>
        </div>
      </AdminShell>
    );
  }
  const e = useMemo(() => enrichPatient(patient), [patient]);

  const totalSpent = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);
  const totalRefunds = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminShell>
      <button onClick={() => nav({ to: "/admin/patients" })} className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink/60 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Patients
      </button>

      {/* Header card */}
      <Card className="mb-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-[15px] font-bold text-white">{patient.firstName[0]}{patient.lastName[0]}</div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-hero text-[22px] font-semibold text-ink">{patient.firstName} {patient.lastName}</div>
                <PatientStatusPill status={patient.status} />
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink/60">{patient.email} · {patient.phone}</div>
              <div className="text-[12.5px] text-ink/60">{e.city}, {patient.state} · Patient since {patient.startedAt}</div>
              <div className="mt-0.5 font-mono text-[11px] text-ink/45">Patient ID: {e.patientCode}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => nav({ to: "/admin/messages" })} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-indigo-700">
              <MessageSquare className="h-3.5 w-3.5" /> Send message
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
              <DollarSign className="h-3.5 w-3.5" /> Issue refund
            </button>
            <button className="rounded-lg border border-ink/12 bg-white p-2 text-ink/60 hover:border-ink/25"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>
      </Card>

      {/* Status banner */}
      <StatusBanner p={e}
        onRetry={() => adminActions.retryPatientPayment(patient.id)}
        onContact={() => nav({ to: "/admin/messages" })}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-4 lg:col-span-2">
          {/* Subscription */}
          <Card className="p-5">
            <SectionTitle subtitle={PROGRAMS[patient.program].label}>Subscription</SectionTitle>
            <div className="grid grid-cols-2 gap-y-2 text-[12.5px] md:grid-cols-3">
              <KV k="Status"><PatientStatusPill status={patient.status} /></KV>
              <KV k="Started">{patient.startedAt}</KV>
              <KV k="Current month">{e.monthOfPlan ? `Month ${e.monthOfPlan} of ${e.totalMonths}` : "—"}</KV>
              <KV k="Current dose">Step {e.doseStep} · {e.doseStrength} weekly</KV>
              <KV k="Next billing">{patient.status === "active" ? `${e.nextBillingAt} · $${e.nextBillingAmt}` : "—"}</KV>
              <KV k="Card">{e.cardBrand} ending {e.cardLast4}</KV>
            </div>
            <DoseProgress step={e.doseStep} total={e.doseTotalSteps} strength={e.doseStrength} />
          </Card>

          {/* Clinical */}
          <Card className="p-5">
            <SectionTitle>Clinical</SectionTitle>
            <div className="grid grid-cols-2 gap-y-2 text-[12.5px] md:grid-cols-3">
              <KV k="Physician">{e.physicianName}</KV>
              <KV k="NPI">{e.physicianNpi}</KV>
              <KV k="Approved">{e.approvedAt}</KV>
              <KV k="Rx valid until">{e.rxValidUntil}</KV>
              <KV k="Refills left">{e.refillsLeft} of 5</KV>
              <KV k="Pharmacy">{e.pharmacy}</KV>
            </div>
            <div className="mt-3 rounded-lg bg-ink/[0.03] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.10em] text-ink/50">Current Rx</div>
              <div className="mt-1 text-[13px] font-medium text-ink">{PROGRAMS[patient.program].label.split(" · ")[0]} · {e.doseStrength}</div>
              <div className="mt-1 text-[12px] text-ink/70">Sig: {e.rxSig}</div>
            </div>
            <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.10em] text-indigo-700">Approval note</div>
              <div className="mt-1 text-[12.5px] italic text-ink/75">"{e.approvalNote}"</div>
              <div className="mt-1 text-[11px] text-ink/50">— {e.physicianName} · {e.approvedAt}</div>
            </div>
          </Card>

          {/* Orders */}
          <Card className="p-5">
            <SectionTitle action={<Link to="/admin/orders" className="text-[11.5px] font-semibold text-indigo-700 hover:underline">View all →</Link>}>Orders</SectionTitle>
            <table className="w-full text-left text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wide text-ink/50">
                <tr><th className="py-2">Order #</th><th>Date</th><th>Product</th><th>Status</th><th>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map((o) => (
                  <tr key={o.id} className="border-t border-ink/[0.06]">
                    <td className="py-2 font-mono text-[11.5px] text-ink">{o.id}</td>
                    <td className="text-ink/60">{o.createdAt}</td>
                    <td className="text-ink/80">{PROGRAMS[o.program].label.split(" · ")[0]}</td>
                    <td><OrderStatusPill status={o.status} /></td>
                    <td className="tabular-nums font-semibold">${o.amount}</td>
                    <td className="text-right"><button className="text-[11.5px] font-semibold text-indigo-700 hover:underline">View</button></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-ink/40">No orders yet</td></tr>}
              </tbody>
            </table>
          </Card>

          {/* Check-ins */}
          <Card className="p-5">
            <SectionTitle>Check-ins</SectionTitle>
            {patient.status === "active" && e.monthOfPlan >= 2 ? (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-[12.5px]">
                <div className="font-semibold text-emerald-800">✓ Check-in submitted · {e.startedAt}</div>
                <div className="mt-1 text-ink/70">Weight: {e.weightLbs - Math.round(e.weightLostLbs)} lbs (−{Math.round(e.weightLostLbs)} lbs since intake) · Side effects: None · Wellbeing: 8/10</div>
                <div className="mt-1 text-[11px] text-emerald-700">{e.physicianName} reviewed · approved refill</div>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-[12.5px]">
                <div className="font-semibold text-amber-800">Check-in due — send reminder</div>
                <div className="mt-1 text-ink/70">Next check-in due: <b>{e.nextBillingAt}</b></div>
                <button className="mt-2 rounded-md bg-amber-500 px-2.5 py-1 text-[11.5px] font-semibold text-white">Send reminder now</button>
              </div>
            )}
          </Card>

          {/* Payments */}
          <Card className="p-5">
            <SectionTitle>Payments</SectionTitle>
            <table className="w-full text-left text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wide text-ink/50">
                <tr><th className="py-2">Date</th><th>Amount</th><th>Type</th><th>Status</th><th>Card</th><th></th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-ink/[0.06]">
                    <td className="py-2 text-ink/60">{p.createdAt}</td>
                    <td className="tabular-nums font-semibold">${p.amount}</td>
                    <td className="text-ink/70">Subscription</td>
                    <td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                        p.status === "succeeded" ? "bg-emerald-50 text-emerald-700" :
                        p.status === "failed" ? "bg-rose-50 text-rose-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>{p.status}</span>
                    </td>
                    <td className="text-ink/70">{p.method}</td>
                    <td className="text-right">
                      {p.status === "failed" && (
                        <button onClick={() => adminActions.retryPayment(p.id)} className="text-[11.5px] font-semibold text-indigo-700 hover:underline">Retry</button>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-ink/40">No payments</td></tr>}
              </tbody>
            </table>
            <div className="mt-3 flex flex-wrap gap-6 border-t border-ink/[0.06] pt-3 text-[12px] text-ink/70">
              <div>Total spent: <b className="text-ink">${totalSpent}</b></div>
              <div>Refunds: <b className="text-ink">${totalRefunds}</b></div>
              <div>Net revenue: <b className="text-ink">${totalSpent - totalRefunds}</b></div>
            </div>
          </Card>

          {/* Communications */}
          <Card className="p-5">
            <SectionTitle>Communications</SectionTitle>
            <div className="grid grid-cols-1 gap-3 text-[12.5px] md:grid-cols-3">
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink/50">Email</div>
                <div className="mt-1">Opens: <b>{e.emailsOpened}/{e.emailsSent}</b> ({Math.round(e.emailsOpened / e.emailsSent * 100)}%)</div>
                <div className="text-ink/60">Klaviyo: {e.klaviyoActive ? "Active" : "Inactive"}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink/50">SMS</div>
                <div className="mt-1">Opt-in: <b>{e.smsOptIn ? "Yes" : "No"}</b></div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink/50">Portal</div>
                <div className="mt-1">Last login: <b>{new Date(e.lastLoginAt).toLocaleDateString()}</b></div>
                <button onClick={() => adminActions.sendMagicLink(patient.id)} className="mt-1 text-[11.5px] font-semibold text-indigo-700 hover:underline">Send new magic link →</button>
              </div>
            </div>
          </Card>

          {/* Intake */}
          <IntakeBlock e={e} />

          {/* Activity */}
          <Card className="p-5">
            <SectionTitle>Activity</SectionTitle>
            <PatientTimeline p={e} />
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* At a glance */}
          <Card className="p-5">
            <SectionTitle>At a glance</SectionTitle>
            <div className="space-y-1.5 text-[12.5px]">
              <KVCol k="LTV (actual)" v={`$${e.totalRevenue}`} bold />
              <KVCol k="LTV (12mo proj)" v={`$${Math.round(PROGRAMS[patient.program].price * 12 * 0.7)}`} />
              <KVCol k="MRR" v={`$${patient.mrr}`} />
              <KVCol k="Total orders" v={orders.length.toString()} />
              <KVCol k="Churn risk" v={<ChurnPill risk={patient.churn} />} />
              <hr className="my-2 border-ink/[0.06]" />
              <KVCol k="Program" v={PROGRAMS[patient.program].label.split(" · ")[1] ?? PROGRAMS[patient.program].label} />
              <KVCol k="Month" v={e.monthOfPlan ? `${e.monthOfPlan} of ${e.totalMonths}` : "—"} />
              <KVCol k="Dose" v={`Step ${e.doseStep} · ${e.doseStrength}`} />
              <KVCol k="Physician" v={e.physicianName.split(" ").slice(0, 2).join(" ")} />
              <KVCol k="Pharmacy" v={e.pharmacy.split(" ")[0]} />
            </div>
          </Card>

          {/* Manage */}
          <Card className="p-5">
            <SectionTitle>Manage</SectionTitle>
            <div className="space-y-0.5"><ManagePanel p={e} /></div>
          </Card>

          {/* Quick actions */}
          <Card className="p-5">
            <SectionTitle>Quick actions</SectionTitle>
            <div className="space-y-0.5"><QuickActionsPanel p={e} /></div>
          </Card>

          {/* Internal notes */}
          <Card className="p-5">
            <SectionTitle>Internal notes</SectionTitle>
            <InternalNotes p={e} />
          </Card>

          {/* Tags */}
          <TagsCard p={e} />
        </div>
      </div>
    </AdminShell>
  );
}

function KV({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.10em] text-ink/45">{k}</div>
      <div className="mt-0.5 text-[13px] font-medium text-ink">{children}</div>
    </div>
  );
}
function KVCol({ k, v, bold }: { k: string; v: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-ink/60">{k}</div>
      <div className={bold ? "font-semibold text-ink" : "text-ink"}>{v}</div>
    </div>
  );
}

function OrderStatusPill({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    processing: "bg-slate-100 text-slate-700",
    at_pharmacy: "bg-violet-50 text-violet-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-emerald-50 text-emerald-700",
    exception: "bg-rose-50 text-rose-700",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${cfg[status] ?? "bg-slate-100 text-slate-700"}`}>{status.replace("_", " ")}</span>;
}

function IntakeBlock({ e }: { e: ReturnType<typeof enrichPatient> }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <SectionTitle subtitle={`Submitted ${e.startedAt}`}>Intake</SectionTitle>
        {open ? <ChevronUp className="h-4 w-4 text-ink/50" /> : <ChevronDown className="h-4 w-4 text-ink/50" />}
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-1 gap-4 text-[12.5px] md:grid-cols-2">
          <div>
            <Sub>Personal</Sub>
            <KVCol k="Height" v={`${Math.floor(e.heightIn / 12)}'${e.heightIn % 12}"`} />
            <KVCol k="Weight at intake" v={`${e.weightLbs} lbs`} />
            <KVCol k="BMI" v={`${e.bmi} · Eligible`} />
            <KVCol k="Goal weight" v={`${e.goalWeightLbs} lbs`} />
            <KVCol k="Weight to lose" v={`${e.intake.weightToLose} lbs`} />
            <KVCol k="DOB" v={e.dob} />
            <KVCol k="Sex" v={e.sex} />
            <KVCol k="State" v={e.state} />
          </div>
          <div>
            <Sub>Clinical flags</Sub>
            <KVCol k="Contraindications" v={e.intake.contraindications.length ? e.intake.contraindications.join(", ") : "None"} />
            <div className="mt-1 text-ink/60">Qualifying conditions:</div>
            <ul className="mt-1 space-y-0.5 text-[12px] text-ink">
              {e.intake.qualifyingConditions.map((c) => <li key={c}>✓ {c}</li>)}
            </ul>
            <div className="mt-3">
              <KVCol k="Prior GLP-1" v={e.intake.priorGlp1 ? "Yes" : "No — first time"} />
              <KVCol k="Blood pressure" v={e.intake.bp} />
              <KVCol k="Bariatric surgery" v={e.intake.bariatric ? "Yes" : "No"} />
            </div>
          </div>
          <div>
            <Sub>Medications</Sub>
            <KVCol k="Current" v={e.intake.meds.length ? e.intake.meds.join(", ") : "None"} />
            <KVCol k="Allergies" v={e.intake.allergies.length ? e.intake.allergies.join(", ") : "None"} />
            <KVCol k="Past surgeries" v="None" />
          </div>
          <div>
            <Sub>Emergency contact</Sub>
            <KVCol k="Name" v={e.intake.ecName} />
            <KVCol k="Phone" v={e.intake.ecPhone} />
            <Sub>Intake scores</Sub>
            <KVCol k="Primary pain" v={e.intake.primaryPain} />
            <KVCol k="Struggle" v={e.intake.struggleDuration} />
            <KVCol k="Primary desire" v={e.intake.primaryDesire} />
            <KVCol k="Sleep" v={e.intake.sleepQuality} />
            <KVCol k="Recommended" v={e.intake.recommendation} />
          </div>
          <div className="md:col-span-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ink hover:border-ink/25">
              <ExternalLink className="h-3.5 w-3.5" /> Download intake PDF
            </button>
            <p className="mt-2 text-[11px] text-ink/45">All intake data is read-only. Cannot be edited after submission.</p>
          </div>
        </div>
      )}
    </Card>
  );
}
function Sub({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 mb-1 text-[10.5px] font-semibold uppercase tracking-[0.10em] text-ink/50 first:mt-0">{children}</div>;
}

function TagsCard({ p }: { p: ReturnType<typeof enrichPatient> }) {
  const [val, setVal] = useState("");
  const tags = p.tags ?? [];
  return (
    <Card className="p-5">
      <SectionTitle>Tags</SectionTitle>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
            #{t}
            <button onClick={() => adminActions.removePatientTag(p.id, t)} className="text-indigo-500 hover:text-indigo-800">×</button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-[11.5px] text-ink/40">No tags yet</span>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Add tag…"
          className="flex-1 rounded-lg border border-ink/12 px-3 py-1.5 text-[12.5px] outline-none focus:border-indigo-500" />
        <button onClick={() => { adminActions.addPatientTag(p.id, val); setVal(""); }} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white">Add</button>
      </div>
    </Card>
  );
}
