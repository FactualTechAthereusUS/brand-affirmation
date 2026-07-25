import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AdminShell, Card, Pill, SectionTitle } from "@/components/admin/AdminShell";
import { PROGRAMS, useAdmin } from "@/lib/admin/store";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/patients/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Patient ${params.id} — Blissley Admin` },
    { name: "description", content: "Patient detail — plan, physician, pharmacy, order history, and communications." },
  ]}),
  component: PatientDetail,
});

function PatientDetail() {
  const { id } = useParams({ from: "/admin/patients/$id" });
  const patient = useAdmin((s) => s.patients.find((p) => p.id === id));
  const orders = useAdmin((s) => s.orders.filter((o) => o.patientId === id));
  const payments = useAdmin((s) => s.payments.filter((p) => p.patientId === id));

  if (!patient) {
    return (
      <AdminShell>
        <div className="grid h-96 place-items-center text-[12px] text-ink/45">
          Patient not found. <Link to="/admin/patients" className="ml-2 text-ink underline">Back to patients →</Link>
        </div>
      </AdminShell>
    );
  }

  const program = PROGRAMS[patient.program];
  return (
    <AdminShell>
      <div className="mb-4 flex items-center gap-3 text-[12px]">
        <Link to="/admin/patients" className="flex items-center gap-1 text-ink/60 hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> Patients</Link>
      </div>

      {/* Sticky header */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-ink text-[18px] font-semibold text-white">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <div className="font-hero text-[22px] font-semibold text-ink">{patient.firstName} {patient.lastName}</div>
              <div className="mt-0.5 text-[12px] text-ink/55">{patient.email} · {patient.state} · Started {patient.startedAt}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={patient.status === "active" ? "success" : patient.status === "failed" ? "critical" : "warn"}>{patient.status}</Pill>
            <Pill tone="info">{program.label}</Pill>
            <button className="rounded-lg border border-ink/12 px-3 py-1.5 text-[11.5px] font-medium text-ink hover:border-ink">Magic link</button>
            <button className="rounded-lg border border-ink/12 px-3 py-1.5 text-[11.5px] font-medium text-ink hover:border-ink">Message</button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink/[0.06] pt-3 text-[12px] md:grid-cols-5">
          <Stat label="MRR" value={`$${patient.mrr}`} />
          <Stat label="LTV" value={`$${patient.ltv}`} />
          <Stat label="Churn risk" value={patient.churn} />
          <Stat label="Physician" value="Dr. Nass" />
          <Stat label="Pharmacy" value="South End" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <Card className="p-4">
            <SectionTitle subtitle={`${orders.length} fulfillments on file`}>Orders</SectionTitle>
            <div className="divide-y divide-ink/[0.05]">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 py-2 text-[12.5px]">
                  <div className="font-medium text-ink">{o.id}</div>
                  <div className="text-ink/50">{o.createdAt}</div>
                  <Pill tone={o.status === "delivered" ? "success" : "info"}>{o.status}</Pill>
                  <div className="ml-auto tabular-nums text-ink">${o.amount}</div>
                </div>
              ))}
              {orders.length === 0 && <div className="py-3 text-[12px] text-ink/45">No orders yet.</div>}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle subtitle="Card charges, retries, and refunds">Payments</SectionTitle>
            <div className="divide-y divide-ink/[0.05]">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 text-[12.5px]">
                  <div className="font-medium text-ink">{p.method}</div>
                  <div className="text-ink/50">{p.createdAt}</div>
                  <Pill tone={p.status === "succeeded" ? "success" : p.status === "failed" ? "critical" : "warn"}>{p.status}</Pill>
                  <div className="ml-auto tabular-nums text-ink">${p.amount}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="p-4">
            <SectionTitle>Internal notes</SectionTitle>
            <textarea placeholder="Care-team note (never shown to patient)…" className="min-h-[100px] w-full rounded-lg border border-ink/12 bg-white p-2.5 text-[12.5px] outline-none focus:border-ink" />
            <button className="mt-2 rounded-lg bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white">Save note</button>
          </Card>
          <Card className="p-4">
            <SectionTitle>Danger zone</SectionTitle>
            <div className="space-y-2 text-[12.5px]">
              <button className="w-full rounded-lg border border-ink/12 px-3 py-2 text-left font-medium text-ink hover:border-ink">Pause subscription</button>
              <button className="w-full rounded-lg border border-ink/12 px-3 py-2 text-left font-medium text-ever hover:border-ever">Cancel subscription</button>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-ink/45">{label}</div>
      <div className="mt-0.5 font-hero text-[16px] font-semibold text-ink tabular-nums">{value}</div>
    </div>
  );
}
