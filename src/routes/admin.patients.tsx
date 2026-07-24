import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, MessageSquare, Search, X } from "lucide-react";
import { AdminShell, Card, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import { adminActions, PROGRAMS, useAdmin, type PatientStatus } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/patients")({
  head: () => ({ meta: [{ title: "Patients — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PatientsPage,
});

const FILTERS: Array<{ key: PatientStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "paused", label: "Paused" },
  { key: "failed", label: "Failed" },
  { key: "cancelled", label: "Cancelled" },
];

function PatientsPage() {
  const patients = useAdmin((s) => s.patients);
  const filter = useAdmin((s) => s.ui.patientFilter);
  const search = useAdmin((s) => s.ui.patientSearch);
  const drawerId = useAdmin((s) => s.ui.patientDrawerId);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(`${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [patients, filter, search]);

  const drawer = patients.find((p) => p.id === drawerId);

  return (
    <AdminShell title="Patients">
      <Card className="p-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              value={search}
              onChange={(e) => adminActions.setPatientSearch(e.target.value)}
              placeholder="Search by name, email…"
              className="w-full rounded-full border border-ink/10 bg-white py-2 pl-9 pr-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ever/50 focus:ring-4 focus:ring-ever/10"
            />
          </div>
          <div className="flex items-center gap-1 rounded-full bg-ink/5 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => adminActions.setPatientFilter(f.key)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${filter === f.key ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="text-[11.5px] text-ink/50">{filtered.length} of {patients.length}</div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[11px] uppercase tracking-[0.12em] text-ink/50">
                <th className="py-2.5 font-semibold">Patient</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Program</th>
                <th className="py-2.5 font-semibold">MRR</th>
                <th className="py-2.5 font-semibold">LTV</th>
                <th className="py-2.5 font-semibold">State</th>
                <th className="py-2.5 font-semibold">Churn risk</th>
                <th className="py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="cursor-pointer border-b border-ink/6 last:border-0 hover:bg-ever/4"
                  onClick={() => adminActions.openPatient(p.id)}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-blush/25 text-[11px] font-semibold text-ink">{p.firstName[0]}{p.lastName[0]}</div>
                      <div>
                        <div className="font-semibold text-ink">{p.firstName} {p.lastName}</div>
                        <div className="text-[11.5px] text-ink/50">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusPill tone={p.status === "active" ? "success" : p.status === "failed" ? "critical" : p.status === "paused" ? "warn" : p.status === "pending" ? "info" : "neutral"}>
                      {p.status}
                    </StatusPill>
                  </td>
                  <td className="text-ink/75">{PROGRAMS[p.program].label}</td>
                  <td className="font-semibold">{formatMoney(p.mrr)}</td>
                  <td>{formatMoney(p.ltv)}</td>
                  <td className="text-ink/70">{p.state}</td>
                  <td>
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      p.churn === "low" ? "bg-check" : p.churn === "medium" ? "bg-honey" : p.churn === "high" ? "bg-blush" : "bg-ever"
                    }`} /> <span className="text-ink/60">{p.churn}</span>
                  </td>
                  <td className="pr-2 text-right text-ink/40">›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={() => adminActions.openPatient(null)} />
            <motion.aside
              initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-ink/8 p-5">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Patient</div>
                  <div className="mt-0.5 text-[17px] font-semibold text-ink">{drawer.firstName} {drawer.lastName}</div>
                </div>
                <button onClick={() => adminActions.openPatient(null)} className="rounded-lg p-2 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" value={drawer.email} />
                  <Field label="Phone" value={drawer.phone} />
                  <Field label="Program" value={PROGRAMS[drawer.program].label} />
                  <Field label="State" value={drawer.state} />
                  <Field label="MRR" value={formatMoney(drawer.mrr)} />
                  <Field label="Lifetime value" value={formatMoney(drawer.ltv)} />
                  <Field label="Started" value={drawer.startedAt} />
                  <Field label="Churn risk" value={drawer.churn} />
                </div>
                <div className="mt-5 rounded-2xl bg-ever/6 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ever">Care timeline</div>
                  <div className="mt-2 space-y-2 text-[13px] text-ink/75">
                    <div>· Intake completed · {drawer.startedAt}</div>
                    <div>· Physician approved</div>
                    <div>· First shipment delivered</div>
                    <div>· Now: Month {(drawer.ltv / PROGRAMS[drawer.program].price).toFixed(0)}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-ink/8 p-4">
                <button className="flex-1 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-white"><MessageSquare className="mr-1 inline h-4 w-4" /> Message</button>
                <button className="flex-1 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-ink ring-1 ring-ink/15">Impersonate</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/8 p-3">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</div>
      <div className="mt-1 text-[13.5px] font-medium text-ink">{value}</div>
    </div>
  );
}
