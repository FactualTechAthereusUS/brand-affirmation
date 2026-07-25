import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Filter, Download, Printer, MoreHorizontal, ChevronDown, X, Package,
  Truck, AlertTriangle, CheckCircle2, Clock, Pill, ShieldCheck, Snowflake, Plus,
} from "lucide-react";
import { AdminShell, Card, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import { Sparkline } from "@/components/admin/Sparkline";
import { PROGRAMS, useAdmin, type Order } from "@/lib/admin/store";
import {
  enrichOrder, filterView, last7Buckets, ordersKpis, ORDER_VIEWS,
  type OrderViewId,
} from "@/lib/admin/orders-enrich";

export const Route = createFileRoute("/pharmabro-admin/orders/")({
  head: () => ({ meta: [
    { title: "Orders — Blissley HQ" },
    { name: "description", content: "Rx orders, pharmacy handoffs, and shipments — Blissley operations." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: OrdersPage,
});

/* ─────────────── Page ─────────────── */

function OrdersPage() {
  const rawOrders = useAdmin((s) => s.orders);
  const patients = useAdmin((s) => s.patients);
  const nav = useNavigate();

  const enriched = useMemo(() => rawOrders.map((o) => enrichOrder(o, patients.find((p) => p.id === o.patientId))), [rawOrders, patients]);

  const [view, setView] = useState<OrderViewId>("all");
  const [query, setQuery] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [programFilter, setProgramFilter] = useState<"all" | "tirz" | "sema">("all");
  const [pharmacyFilter, setPharmacyFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = filterView(enriched, view);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        (o.tracking ?? "").toLowerCase().includes(q) ||
        o.shipTo.state.toLowerCase().includes(q)
      );
    }
    if (programFilter !== "all") list = list.filter((o) => PROGRAMS[o.program].family === programFilter);
    if (pharmacyFilter !== "all") list = list.filter((o) => o.pharmacy.name === pharmacyFilter);
    return list;
  }, [enriched, view, query, programFilter, pharmacyFilter]);

  const kpis = useMemo(() => ordersKpis(enriched), [enriched]);
  const spark = useMemo(() => ({
    orders: last7Buckets(rawOrders, () => 1),
    revenue: last7Buckets(rawOrders, (o) => o.amount),
  }), [rawOrders]);
  const pharmacies = useMemo(() => Array.from(new Set(enriched.map((o) => o.pharmacy.name))), [enriched]);
  const counts = useMemo(() => {
    const c: Record<OrderViewId, number> = {} as never;
    for (const v of ORDER_VIEWS) c[v.id] = filterView(enriched, v.id).length;
    return c;
  }, [enriched]);

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((o) => o.id)));
  }

  return (
    <AdminShell title="Orders">
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">Orders</h1>
          <p className="mt-0.5 text-[13px] text-ink/55">{enriched.length} orders · {kpis.exceptions} exceptions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink hover:bg-ink/[0.03]"><Download className="h-3.5 w-3.5" /> Export</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink hover:bg-ink/[0.03]"><Printer className="h-3.5 w-3.5" /> Print</button>
          <button onClick={() => setShowAnalytics(!showAnalytics)} className="grid h-8 w-8 place-items-center rounded-lg border border-ink/10 bg-white hover:bg-ink/[0.03]"><MoreHorizontal className="h-4 w-4 text-ink/60" /></button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700"><Plus className="h-3.5 w-3.5" /> Create order</button>
        </div>
      </div>

      {/* Analytics bar */}
      {showAnalytics && (
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiTile label="Orders today" value={String(kpis.ordersToday)} delta="+12%" trend={spark.orders} stroke="#4f46e5" fill="rgba(79,70,229,0.08)" />
          <KpiTile label="Revenue today" value={formatMoney(kpis.revenueToday)} delta="+8.4%" trend={spark.revenue} stroke="#059669" fill="rgba(5,150,105,0.08)" />
          <KpiTile label="Avg time to ship" value={`${kpis.avgHrsToShip}h`} delta="−3h" deltaTone="good" trend={[26,24,25,23,22,21,22]} stroke="#0284c7" fill="rgba(2,132,199,0.08)" />
          <KpiTile label="Exceptions open" value={String(kpis.exceptions)} delta={kpis.exceptions > 3 ? "+2" : "0"} deltaTone={kpis.exceptions > 3 ? "bad" : "neutral"} trend={[3,2,4,3,5,4,kpis.exceptions]} stroke="#e11d48" fill="rgba(225,29,72,0.08)" />
        </div>
      )}

      {/* Saved views tab strip */}
      <div className="mb-3 flex items-center gap-1 overflow-x-auto border-b border-ink/8 pb-0">
        {ORDER_VIEWS.map((v) => {
          const active = view === v.id;
          return (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`relative shrink-0 whitespace-nowrap px-3 py-2 text-[12.5px] font-medium transition ${active ? "text-ink" : "text-ink/55 hover:text-ink"}`}>
              {v.label}
              <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${active ? "bg-indigo-100 text-indigo-700" : "bg-ink/[0.05] text-ink/50"}`}>{counts[v.id]}</span>
              {active && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-indigo-600" />}
            </button>
          );
        })}
        <button className="ml-1 shrink-0 rounded px-2 py-2 text-[12.5px] font-medium text-ink/50 hover:text-ink">+ New view</button>
      </div>

      {/* Search & filters */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order id, patient, tracking, state…"
              className="w-full rounded-lg border border-ink/10 bg-ink/[0.02] py-1.5 pl-8 pr-3 text-[13px] text-ink placeholder:text-ink/40 focus:border-indigo-500 focus:bg-white focus:outline-none" />
          </div>
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value as never)}
            className="rounded-lg border border-ink/10 bg-white py-1.5 pl-2 pr-6 text-[12.5px] font-medium text-ink">
            <option value="all">All programs</option>
            <option value="tirz">Tirzepatide</option>
            <option value="sema">Semaglutide</option>
          </select>
          <select value={pharmacyFilter} onChange={(e) => setPharmacyFilter(e.target.value)}
            className="rounded-lg border border-ink/10 bg-white py-1.5 pl-2 pr-6 text-[12.5px] font-medium text-ink">
            <option value="all">All pharmacies</option>
            {pharmacies.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-ink hover:bg-ink/[0.03]"><Filter className="h-3.5 w-3.5" /> More filters</button>
          <button className="inline-flex items-center gap-1 rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-ink hover:bg-ink/[0.03]">Sort <ChevronDown className="h-3.5 w-3.5" /></button>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
            <div className="text-[12.5px] font-semibold text-indigo-900">{selected.size} selected</div>
            <div className="flex flex-wrap items-center gap-1.5">
              <BulkBtn>Mark shipped</BulkBtn>
              <BulkBtn>Assign pharmacy</BulkBtn>
              <BulkBtn>Print labels</BulkBtn>
              <BulkBtn>Send update</BulkBtn>
              <BulkBtn>Flag</BulkBtn>
              <button onClick={() => setSelected(new Set())} className="rounded-md p-1 text-indigo-900 hover:bg-indigo-100"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
                <th className="py-2.5 pl-1 pr-2">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll} className="h-3.5 w-3.5 rounded border-ink/20" />
                </th>
                <th className="py-2.5 font-semibold">Order</th>
                <th className="py-2.5 font-semibold">Date</th>
                <th className="py-2.5 font-semibold">Patient</th>
                <th className="py-2.5 font-semibold">Program</th>
                <th className="py-2.5 font-semibold">Rx</th>
                <th className="py-2.5 font-semibold">Fulfillment</th>
                <th className="py-2.5 font-semibold">Payment</th>
                <th className="py-2.5 font-semibold">Amount</th>
                <th className="py-2.5 font-semibold">Pharmacy</th>
                <th className="py-2.5 font-semibold">Carrier / Tracking</th>
                <th className="py-2.5 font-semibold">Ship-to</th>
                <th className="py-2.5 font-semibold">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}
                  onClick={() => nav({ to: "/pharmabro-admin/orders/$id", params: { id: o.id } })}
                  className="group cursor-pointer border-b border-ink/6 hover:bg-indigo-50/40">
                  <td className="py-2.5 pl-1 pr-2" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleRow(o.id)}
                      className="h-3.5 w-3.5 rounded border-ink/20" />
                  </td>
                  <td className="py-2.5 font-mono text-[12px] font-semibold text-indigo-700 group-hover:underline">#{o.id.replace("ord_", "")}</td>
                  <td className="text-ink/70">{o.createdAt}</td>
                  <td className="font-semibold text-ink">{o.patientName}</td>
                  <td className="text-ink/80">
                    <div className="flex items-center gap-1.5">
                      <Pill className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{PROGRAMS[o.program].label}</span>
                    </div>
                  </td>
                  <td><RxPill status={o.rxStatus} /></td>
                  <td><FulfillPill status={o.status} /></td>
                  <td><PaymentPill status={o.payment.status} /></td>
                  <td className="font-semibold text-ink">{formatMoney(o.payment.total)}</td>
                  <td className="text-ink/75">{o.pharmacy.name.replace(" Pharmacy", "")}<div className="text-[11px] text-ink/45">{o.pharmacy.city}, {o.pharmacy.state}</div></td>
                  <td className="text-ink/75">
                    {o.tracking ? (
                      <div>
                        <div className="text-[11.5px] font-medium">{o.carrier} · {o.service}</div>
                        <div className="font-mono text-[11px] text-ink/50">{o.tracking}</div>
                      </div>
                    ) : <span className="text-ink/40">—</span>}
                  </td>
                  <td className="text-ink/70"><span className="rounded bg-ink/[0.05] px-1.5 py-0.5 font-mono text-[11px]">{o.shipTo.state}</span></td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {o.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded bg-violet-100 px-1.5 py-0.5 text-[10.5px] font-medium text-violet-700">{t}</span>
                      ))}
                      {o.coldChain && <span className="inline-flex items-center gap-0.5 rounded bg-sky-100 px-1.5 py-0.5 text-[10.5px] font-medium text-sky-700"><Snowflake className="h-2.5 w-2.5" />Cold</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={13} className="py-12 text-center text-ink/50">No orders match this view.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}

/* ─────────────── Bits ─────────────── */

function KpiTile({ label, value, delta, deltaTone = "good", trend, stroke, fill }: {
  label: string; value: string; delta: string; deltaTone?: "good" | "bad" | "neutral";
  trend: number[]; stroke: string; fill: string;
}) {
  const tone = deltaTone === "good" ? "text-emerald-600" : deltaTone === "bad" ? "text-rose-600" : "text-ink/50";
  return (
    <Card className="p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11.5px] font-medium uppercase tracking-wider text-ink/50">{label}</div>
          <div className="mt-1 text-[22px] font-bold text-ink">{value}</div>
          <div className={`mt-0.5 text-[11.5px] font-semibold ${tone}`}>{delta} <span className="font-normal text-ink/40">vs last 7d</span></div>
        </div>
        <div className="w-24 shrink-0">
          <Sparkline data={trend} stroke={stroke} fill={fill} height={38} />
        </div>
      </div>
    </Card>
  );
}

function BulkBtn({ children }: { children: React.ReactNode }) {
  return <button className="rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-indigo-700 hover:bg-indigo-50">{children}</button>;
}

function RxPill({ status }: { status: "pending_review" | "approved" | "refill_due" | "denied" }) {
  const map = {
    pending_review: { tone: "warn" as const, icon: <Clock className="mr-1 inline h-3 w-3" />, label: "Pending review" },
    approved:       { tone: "success" as const, icon: <ShieldCheck className="mr-1 inline h-3 w-3" />, label: "Approved" },
    refill_due:     { tone: "info" as const, icon: <Pill className="mr-1 inline h-3 w-3" />, label: "Refill due" },
    denied:         { tone: "critical" as const, icon: <X className="mr-1 inline h-3 w-3" />, label: "Denied" },
  };
  const m = map[status];
  return <StatusPill tone={m.tone}>{m.icon}{m.label}</StatusPill>;
}
function FulfillPill({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], { tone: "success" | "warn" | "critical" | "info" | "neutral"; icon: React.ReactNode; label: string }> = {
    processing:   { tone: "neutral", icon: <Clock className="mr-1 inline h-3 w-3" />, label: "Processing" },
    at_pharmacy:  { tone: "warn", icon: <Package className="mr-1 inline h-3 w-3" />, label: "At pharmacy" },
    shipped:      { tone: "info", icon: <Truck className="mr-1 inline h-3 w-3" />, label: "In transit" },
    delivered:    { tone: "success", icon: <CheckCircle2 className="mr-1 inline h-3 w-3" />, label: "Delivered" },
    exception:    { tone: "critical", icon: <AlertTriangle className="mr-1 inline h-3 w-3" />, label: "Exception" },
  };
  const m = map[status];
  return <StatusPill tone={m.tone}>{m.icon}{m.label}</StatusPill>;
}
function PaymentPill({ status }: { status: "paid" | "failed" | "refunded" }) {
  const tone = status === "paid" ? "success" : status === "failed" ? "critical" : "warn";
  return <StatusPill tone={tone as never}>{status}</StatusPill>;
}
