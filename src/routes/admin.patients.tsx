import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, Plus, ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { adminActions, PROGRAMS, useAdmin, type PatientStatus } from "@/lib/admin/store";
import {
  enrichPatient, selectPatientKpis, selectPatients, selectStatusCounts, selectSegmentCounts, SEGMENTS,
} from "@/lib/admin/patients-enrich";
import { PatientStatusPill, ChurnPill } from "@/components/admin/patients/StatusBanner";

export const Route = createFileRoute("/admin/patients")({
  head: () => ({ meta: [
    { title: "Patients — Blissley HQ" },
    { name: "description", content: "Search, segment, and manage every patient on the Blissley platform." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: PatientsPage,
});

const STATUS_TABS: Array<{ key: PatientStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending Approval" },
  { key: "paused", label: "Paused" },
  { key: "cancelled", label: "Cancelled" },
  { key: "denied", label: "Denied" },
  { key: "failed", label: "Payment Failed" },
];

function PatientsPage() {
  const nav = useNavigate();
  const patients = useAdmin((s) => s.patients);
  const filter = useAdmin((s) => s.ui.patientFilter);
  const search = useAdmin((s) => s.ui.patientSearch);
  const [segment, setSegment] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "startedAt", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const kpis = useMemo(() => selectPatientKpis({ patients } as any), [patients]);
  const statusCounts = useMemo(() => selectStatusCounts({ patients } as any), [patients]);
  const segCounts = useMemo(() => selectSegmentCounts({ patients } as any), [patients]);
  const { rows, total, pageCount } = useMemo(
    () => selectPatients({ patients } as any, { statusTab: filter, segment, search, sort, page, pageSize }),
    [patients, filter, segment, search, sort, page, pageSize],
  );

  function toggleSort(k: string) {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "desc" }));
  }
  function toggleRow(id: string) {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <AdminShell title="Patients">
      {/* Top bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => { adminActions.setPatientSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone, order #, state…"
            className="w-full rounded-lg border border-ink/12 bg-white py-2 pl-9 pr-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
          All <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-3.5 w-3.5" /> Add Patient
        </button>
      </div>

      {/* KPI strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Patients" value={kpis.total.toLocaleString()} sub="all time" />
        <KpiCard label="Active" value={kpis.active.toLocaleString()} sub="paying right now" tone="positive" />
        <KpiCard label="New This Month" value={kpis.newThisMonth.toLocaleString()} delta={kpis.newThisMonth >= kpis.priorMonth ? `↑ vs ${kpis.priorMonth} prior` : `↓ vs ${kpis.priorMonth} prior`} tone={kpis.newThisMonth >= kpis.priorMonth ? "positive" : "warn"} />
        <KpiCard label="Churned" value={kpis.churned.toLocaleString()} sub={`${kpis.churnRate}% churn rate`} tone="warn" />
        <KpiCard label="Failed Payment" value={kpis.failedCount.toLocaleString()} sub={`$${kpis.failedRisk} at risk`} tone="critical" />
      </div>

      {/* Status tabs */}
      <div className="mb-3 flex flex-wrap items-center gap-1 border-b border-ink/10 pb-0">
        {STATUS_TABS.map((t) => {
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { adminActions.setPatientFilter(t.key); setPage(1); }}
              className={`relative -mb-px px-3 py-2 text-[12.5px] font-semibold transition ${active ? "text-indigo-700" : "text-ink/60 hover:text-ink"}`}
            >
              {t.label} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10.5px] ${active ? "bg-indigo-100 text-indigo-700" : "bg-ink/[0.06] text-ink/60"}`}>{statusCounts[t.key]}</span>
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-indigo-600" />}
            </button>
          );
        })}
      </div>

      {/* Segments */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SEGMENTS.map((s) => {
          const active = segment === s.key;
          return (
            <button key={s.key} onClick={() => { setSegment(active ? null : s.key); setPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ${
                active ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-ink/12 bg-white text-ink/70 hover:border-ink/25"
              }`}>
              {s.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-indigo-600 text-white" : "bg-ink/[0.06] text-ink/60"}`}>{segCounts[s.key] ?? 0}</span>
            </button>
          );
        })}
        <button className="rounded-full border border-dashed border-ink/20 px-3 py-1 text-[11.5px] font-semibold text-ink/50 hover:border-ink/40">+ Create segment</button>
      </div>

      {/* Bulk toolbar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-[12.5px] ring-1 ring-indigo-200">
          <span className="font-semibold text-indigo-800">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            {["Message", "Tag", "Export", "Pause"].map((a) => (
              <button key={a} className="rounded-md bg-white px-2.5 py-1 text-[11.5px] font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100">{a}</button>
            ))}
            <button onClick={() => setSelected(new Set())} className="rounded-md px-2.5 py-1 text-[11.5px] font-semibold text-ink/60">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/[0.08] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.10em] text-ink/55">
                <Th w="w-8"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())} checked={selected.size > 0 && selected.size === rows.length} /></Th>
                <Th onClick={() => toggleSort("firstName")} sort={sort} k="firstName">Patient</Th>
                <Th onClick={() => toggleSort("status")} sort={sort} k="status">Status</Th>
                <Th onClick={() => toggleSort("program")} sort={sort} k="program">Program</Th>
                <Th onClick={() => toggleSort("startedAt")} sort={sort} k="startedAt">Since</Th>
                <Th onClick={() => toggleSort("mrr")} sort={sort} k="mrr">MRR</Th>
                <Th onClick={() => toggleSort("ltv")} sort={sort} k="ltv">LTV</Th>
                <Th>Month</Th>
                <Th onClick={() => toggleSort("churn")} sort={sort} k="churn">Churn</Th>
                <Th>Last active</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const e = enrichPatient(p);
                return (
                  <tr key={p.id} onClick={() => nav({ to: "/admin/patients/$id", params: { id: p.id } })}
                    className="cursor-pointer border-b border-ink/[0.06] last:border-0 hover:bg-indigo-50/40">
                    <td className="px-3 py-2.5" onClick={(ev) => { ev.stopPropagation(); toggleRow(p.id); }}>
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleRow(p.id)} />
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">{p.firstName[0]}{p.lastName[0]}</div>
                        <div>
                          <div className="font-semibold text-ink">{p.firstName} {p.lastName}</div>
                          <div className="text-[11px] text-ink/50">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5"><PatientStatusPill status={p.status} /></td>
                    <td className="py-2.5 text-ink/75">{PROGRAMS[p.program].label}</td>
                    <td className="py-2.5 text-ink/60">{p.startedAt}</td>
                    <td className="py-2.5 font-semibold tabular-nums text-ink">{p.mrr ? `$${p.mrr}` : "—"}</td>
                    <td className="py-2.5 tabular-nums text-ink/80">${p.ltv}</td>
                    <td className="py-2.5 text-ink/70">{e.monthOfPlan ? `${e.monthOfPlan}/${e.totalMonths}` : "—"}</td>
                    <td className="py-2.5">{p.status === "pending" || p.status === "denied" ? <span className="text-ink/40">—</span> : <ChurnPill risk={p.churn} />}</td>
                    <td className="py-2.5 text-ink/60">{relativeDay(e.lastLoginAt)}</td>
                    <td className="py-2.5 pr-4 text-right">
                      <button className="rounded-md px-2 py-1 text-[11.5px] font-semibold text-indigo-700 hover:bg-indigo-100"
                        onClick={(ev) => { ev.stopPropagation(); nav({ to: "/admin/patients/$id", params: { id: p.id } }); }}>
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={11} className="py-12 text-center text-[12.5px] text-ink/45">No patients match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] bg-ink/[0.015] px-4 py-2.5 text-[12px]">
          <div className="flex items-center gap-2 text-ink/60">
            <span>Rows:</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border border-ink/12 bg-white px-2 py-1 text-[12px]">
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="ml-2">{total.toLocaleString()} patients</span>
          </div>
          <div className="flex items-center gap-2 text-ink/70">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="grid h-7 w-7 place-items-center rounded-md border border-ink/12 disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <span>Page <b className="text-ink">{page}</b> of {pageCount}</span>
            <button disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="grid h-7 w-7 place-items-center rounded-md border border-ink/12 disabled:opacity-40"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </Card>
    </AdminShell>
  );
}

function Th({ children, onClick, sort, k, w, className = "" }: { children?: React.ReactNode; onClick?: () => void; sort?: { key: string; dir: "asc" | "desc" }; k?: string; w?: string; className?: string }) {
  const active = sort && k && sort.key === k;
  return (
    <th className={`${w ?? ""} px-3 py-2.5 font-semibold ${className}`}>
      <button onClick={onClick} disabled={!onClick} className={`inline-flex items-center gap-1 ${onClick ? "hover:text-ink" : ""}`}>
        {children}
        {active && (sort!.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
    </th>
  );
}

function relativeDay(ts: number) {
  const days = Math.floor((Date.now() - ts) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
