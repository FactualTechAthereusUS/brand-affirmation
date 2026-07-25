import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, Plus, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Mail, MessageSquare, Phone, X } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { adminActions, useAdmin, type LeadStatus } from "@/lib/admin/store";
import {
  selectLeadKpis, selectLeads, selectStatusCounts, selectSegmentCounts, STATUS_TABS, SEGMENTS,
} from "@/lib/admin/leads-enrich";
import { ScorePill, IntentBadge, LeadStatusPill, EligibilityDot, FunnelBar, ChannelIcon, LeadInitials } from "@/components/admin/leads/LeadPills";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [
    { title: "Leads — Blissley HQ" },
    { name: "description", content: "Recover abandoned intakes and route hot inbound leads before they cool." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: LeadsPage,
});

function LeadsPage() {
  const nav = useNavigate();
  const leads = useAdmin((s) => s.leads);
  const [statusTab, setStatusTab] = useState<LeadStatus | "all">("all");
  const [segment, setSegment] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "score", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [segmentsExpanded, setSegmentsExpanded] = useState(false);

  const kpis = useMemo(() => selectLeadKpis({ leads }), [leads]);
  const statusCounts = useMemo(() => selectStatusCounts({ leads }), [leads]);
  const segCounts = useMemo(() => selectSegmentCounts({ leads }), [leads]);
  const { rows, total, pageCount } = useMemo(
    () => selectLeads({ leads }, { statusTab, segment, search, sort, page, pageSize }),
    [leads, statusTab, segment, search, sort, page, pageSize],
  );

  function toggleSort(k: string) {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "desc" }));
  }
  function toggleRow(id: string) {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <AdminShell title="Leads">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone, state, campaign…"
            className="w-full rounded-lg border border-ink/12 bg-white py-2 pl-9 pr-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
          Import <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-3.5 w-3.5" /> New lead
        </button>
      </div>

      {/* KPI strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Open leads" value={kpis.open.toLocaleString()} sub={`${kpis.total} total`} />
        <KpiCard label="Hot" value={kpis.hot.toLocaleString()} sub="score ≥ 70" tone="positive" />
        <KpiCard label="Abandoned · 30d" value={kpis.abandonedCheckouts30d.toLocaleString()} sub="checkout & payment" tone="warn" />
        <KpiCard label="Recovery rate" value={`${kpis.recoveryRate30d}%`} sub="last 30 days" tone={kpis.recoveryRate30d >= 15 ? "positive" : "warn"} />
        <KpiCard label="Avg time-to-contact" value={`${kpis.avgTimeToContactHrs}h`} sub="first touch" />
        <KpiCard label="Recoverable rev" value={`$${kpis.recoverableRevenue.toLocaleString()}`} sub="Σ open pipeline" tone="positive" />
      </div>

      {/* Status tabs */}
      <div className="mb-3 flex flex-wrap items-center gap-1 border-b border-ink/10">
        {STATUS_TABS.map((t) => {
          const active = statusTab === t.key;
          return (
            <button key={t.key} onClick={() => { setStatusTab(t.key); setPage(1); }}
              className={`relative -mb-px px-3 py-2 text-[12.5px] font-semibold transition ${active ? "text-indigo-700" : "text-ink/60 hover:text-ink"}`}>
              {t.label} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10.5px] ${active ? "bg-indigo-100 text-indigo-700" : "bg-ink/[0.06] text-ink/60"}`}>{statusCounts[t.key] ?? 0}</span>
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-indigo-600" />}
            </button>
          );
        })}
      </div>

      {/* Segments */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { setSegment(null); setPage(1); }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ${
              segment === null ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-ink/12 bg-white text-ink/70 hover:border-ink/25"
            }`}>
            All leads <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${segment === null ? "bg-indigo-600 text-white" : "bg-ink/[0.06] text-ink/60"}`}>{leads.length}</span>
          </button>
          {SEGMENTS.filter((s) => s.pinned).map((s) => {
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
          <button onClick={() => setSegmentsExpanded((v) => !v)} className="text-[11.5px] font-semibold text-indigo-700 hover:underline">
            {segmentsExpanded ? "Hide all segments" : "All segments →"}
          </button>
          <button className="rounded-full border border-dashed border-ink/20 px-3 py-1 text-[11.5px] font-semibold text-ink/50 hover:border-ink/40">+ Create segment</button>
        </div>

        {segmentsExpanded && (
          <Card className="mt-3 overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-ink/[0.08] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.10em] text-ink/55">
                  <th className="px-4 py-2 font-semibold">Segment</th>
                  <th className="px-4 py-2 font-semibold">Definition</th>
                  <th className="px-4 py-2 font-semibold text-right">% of leads</th>
                  <th className="px-4 py-2 font-semibold text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {SEGMENTS.map((s) => {
                  const count = segCounts[s.key] ?? 0;
                  const pct = leads.length ? Math.round((count / leads.length) * 1000) / 10 : 0;
                  return (
                    <tr key={s.key} onClick={() => { setSegment(s.key); setSegmentsExpanded(false); setPage(1); }}
                      className="cursor-pointer border-b border-ink/[0.06] last:border-0 hover:bg-indigo-50/40">
                      <td className="px-4 py-2 font-semibold text-ink">{s.label}</td>
                      <td className="px-4 py-2 font-mono text-[11.5px] text-ink/60">{s.definition}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-ink/80">{pct}%</td>
                      <td className="px-4 py-2 text-right font-semibold tabular-nums text-ink">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-[12.5px] ring-1 ring-indigo-200">
          <span className="font-semibold text-indigo-800">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {["Email", "SMS", "Assign", "Tag", "Add to segment", "Export"].map((a) => (
              <button key={a} className="rounded-md bg-white px-2.5 py-1 text-[11.5px] font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100">{a}</button>
            ))}
            <button onClick={() => setSelected(new Set())} className="rounded-md px-2.5 py-1 text-[11.5px] font-semibold text-ink/60">
              <X className="mr-1 inline h-3 w-3" />Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/[0.08] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.10em] text-ink/55">
                <Th w="w-8"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())} checked={selected.size > 0 && selected.size === rows.length && rows.length > 0} /></Th>
                <Th onClick={() => toggleSort("name")} sort={sort} k="name">Lead</Th>
                <Th onClick={() => toggleSort("score")} sort={sort} k="score">Score</Th>
                <Th onClick={() => toggleSort("intent")} sort={sort} k="intent">Intent</Th>
                <Th onClick={() => toggleSort("program")} sort={sort} k="program">Program</Th>
                <Th>Funnel step</Th>
                <Th>State</Th>
                <Th>Source · Campaign</Th>
                <Th onClick={() => toggleSort("ageHrs")} sort={sort} k="ageHrs">Age</Th>
                <Th>Assignee</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const source = l.attribution?.source ?? l.source ?? "Organic";
                const campaign = l.attribution?.campaign ?? source;
                return (
                <tr key={l.id} onClick={() => nav({ to: "/admin/leads/$id", params: { id: l.id } })}
                  className="cursor-pointer border-b border-ink/[0.06] last:border-0 hover:bg-indigo-50/40">
                  <td className="px-3 py-2.5" onClick={(ev) => { ev.stopPropagation(); toggleRow(l.id); }}>
                    <input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleRow(l.id)} />
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-3">
                      <LeadInitials lead={l} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink">{l.name}</div>
                        <div className="truncate text-[11px] text-ink/50">{l.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5"><ScorePill score={l.score} /></td>
                  <td className="py-2.5"><IntentBadge intent={l.intent} /></td>
                  <td className="py-2.5 text-ink/75">{l.program}</td>
                  <td className="py-2.5"><FunnelBar step={l.funnelStep} pct={l.progressPct} /></td>
                  <td className="py-2.5"><EligibilityDot ok={l.stateEligible} state={l.state} /></td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5"><ChannelIcon source={source} /></div>
                    <div className="mt-0.5 truncate text-[10.5px] text-ink/50">{campaign}</div>
                  </td>
                  <td className="py-2.5 tabular-nums text-ink/70">{l.ageHrs}h</td>
                  <td className="py-2.5 text-ink/70">{l.assignee ?? <span className="text-ink/40">—</span>}</td>
                  <td className="py-2.5"><LeadStatusPill status={l.status} /></td>
                  <td className="py-2.5 pr-4 text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button title="Email" onClick={() => adminActions.addLeadOutreach(l.id, "email", "Quick reach-out", "sent")}
                        className="grid h-7 w-7 place-items-center rounded-md text-ink/60 hover:bg-indigo-100 hover:text-indigo-700"><Mail className="h-3.5 w-3.5" /></button>
                      <button title="SMS" onClick={() => adminActions.addLeadOutreach(l.id, "sms", "Quick SMS", "sent")}
                        className="grid h-7 w-7 place-items-center rounded-md text-ink/60 hover:bg-indigo-100 hover:text-indigo-700"><MessageSquare className="h-3.5 w-3.5" /></button>
                      <button title="Call" onClick={() => adminActions.addLeadOutreach(l.id, "call", "Outbound call", "connected")}
                        className="grid h-7 w-7 place-items-center rounded-md text-ink/60 hover:bg-indigo-100 hover:text-indigo-700"><Phone className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );})}
              {rows.length === 0 && (
                <tr><td colSpan={12} className="py-12 text-center text-[12.5px] text-ink/45">No leads match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] bg-ink/[0.015] px-4 py-2.5 text-[12px]">
          <div className="flex items-center gap-2 text-ink/60">
            <span>Rows:</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border border-ink/12 bg-white px-2 py-1 text-[12px]">
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="ml-2">{total.toLocaleString()} leads</span>
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
