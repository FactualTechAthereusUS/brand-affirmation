import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, RefreshCw, RotateCcw, X, Search, Download, Flag, Mail, AlertTriangle } from "lucide-react";
import { AdminShell, Card, StatusPill, formatMoney, timeAgo } from "@/components/admin/AdminShell";
import { Sparkline } from "@/components/admin/Sparkline";
import { adminActions, useAdmin, type Payment } from "@/lib/admin/store";
import { paymentsHealth } from "@/lib/admin/selectors";
import { downloadCsv } from "@/lib/admin/csv";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PaymentsPage,
});

type StatusFilter = "all" | "succeeded" | "failed" | "refunded";

function PaymentsPage() {
  const payments = useAdmin((s) => s.payments);
  const state = useAdmin((s) => s);
  const drawerId = useAdmin((s) => s.ui.paymentDrawerId);
  const drawer = payments.find((p) => p.id === drawerId);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (query && !`${p.id} ${p.patientName} ${p.method}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [payments, status, query]);

  const totalOk = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);
  const totalFailed = payments.filter((p) => p.status === "failed").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0);
  const grossNet = totalOk - totalRefunded;
  const failedCount = payments.filter((p) => p.status === "failed").length;
  const recoveryRate = failedCount ? Math.round((payments.filter((p) => p.status === "succeeded" && p.failureReason).length / failedCount) * 100) : 92;

  const health = paymentsHealth(state, 30);

  const exportCsv = () => {
    downloadCsv("payments.csv", filtered.map((p) => ({
      id: p.id, patient: p.patientName, amount: (p.amount / 100).toFixed(2),
      method: p.method, status: p.status, created: p.createdAt, failure_reason: p.failureReason ?? "",
    })));
    toast.success(`Exported ${filtered.length} payments`);
  };

  return (
    <AdminShell title="Payments">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-hero text-[22px] font-bold tracking-tight text-ink">Payments</h1>
          <p className="mt-1 text-[13px] text-ink/60">Charges, failures, refunds, and recovery health.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-medium text-ink/80 hover:bg-ink/5">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Net revenue (30d)" value={formatMoney(grossNet)} tone="success" spark={health.totals} />
        <MetricCard label="Failed volume" value={formatMoney(totalFailed)} tone="critical" spark={health.failed} sub={`${failedCount} charges`} />
        <MetricCard label="Refunded" value={formatMoney(totalRefunded)} tone="warn" spark={health.recovered} />
        <MetricCard label="Recovery rate" value={`${recoveryRate}%`} tone={recoveryRate >= 75 ? "success" : "warn"} spark={health.recovered} sub="Retry → succeeded" />
      </div>

      {/* Filters */}
      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search charge id, patient, method…"
              className="w-full rounded-lg border border-ink/12 bg-white py-2 pl-8 pr-3 text-[12.5px] outline-none focus:border-ink/40"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "succeeded", "failed", "refunded"] as StatusFilter[]).map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`rounded-md px-2.5 py-1.5 text-[11.5px] font-medium capitalize transition ${status === s ? "bg-ink text-white" : "bg-white text-ink/70 hover:bg-ink/5 border border-ink/10"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/6 text-[10.5px] uppercase tracking-[0.12em] text-ink/45">
                <th className="px-4 py-2.5 font-semibold">Charge</th>
                <th className="px-4 py-2.5 font-semibold">Patient</th>
                <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                <th className="px-4 py-2.5 font-semibold">Method</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Failure</th>
                <th className="px-4 py-2.5 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} onClick={() => adminActions.openPayment(p.id)}
                  className="cursor-pointer border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-3 font-mono text-[11.5px] text-ink/80">{p.id}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{p.patientName}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatMoney(p.amount)}</td>
                  <td className="px-4 py-3 text-[12px] text-ink/70">{p.method}</td>
                  <td className="px-4 py-3">
                    <StatusPill tone={p.status === "succeeded" ? "success" : p.status === "failed" ? "critical" : "warn"}>
                      {p.status}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 text-[11.5px] text-ever/90">
                    {p.failureReason ? p.failureReason.replace(/_/g, " ") : "—"}
                  </td>
                  <td className="px-4 py-3 text-[11.5px] text-ink/60">{p.createdAt}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[12px] text-ink/45">No charges match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>{drawer && <PaymentDrawer p={drawer} onClose={() => adminActions.openPayment(null)} />}</AnimatePresence>
    </AdminShell>
  );
}

function MetricCard({ label, value, sub, tone, spark }: { label: string; value: string; sub?: string; tone: "success" | "critical" | "warn"; spark?: number[] }) {
  const color = tone === "success" ? "text-check" : tone === "critical" ? "text-ever" : "text-honey";
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_1px_0_rgba(23,23,23,0.02)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</div>
      <div className={`mt-1 font-hero text-[22px] font-bold tabular-nums ${color}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-ink/50">{sub}</div>}
      {spark && spark.length > 1 && <div className="mt-2 h-8"><Sparkline data={spark} stroke={tone === "success" ? "#10b981" : tone === "critical" ? "#ef4444" : "#f59e0b"} /></div>}
    </motion.div>
  );
}

function PaymentDrawer({ p, onClose }: { p: Payment; onClose: () => void }) {
  const [amount, setAmount] = useState((p.amount / 100).toFixed(2));
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <motion.aside
        initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }}
        transition={{ type: "spring", damping: 26, stiffness: 240 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink/8 p-5">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Charge</div>
            <div className="mt-0.5 font-mono text-[15px] font-semibold text-ink">{p.id}</div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="rounded-2xl border border-ink/8 bg-white p-4">
            <div className="text-[11px] text-ink/55">Patient</div>
            <div className="mt-0.5 text-[15px] font-semibold text-ink">{p.patientName}</div>
            <div className="mt-3 flex items-center gap-2 text-[13px] text-ink/70">
              <CreditCard className="h-4 w-4" /> {p.method}
            </div>
            <div className="mt-3 font-hero text-[26px] font-bold text-ink">{formatMoney(p.amount)}</div>
            <div className="mt-1 text-[11.5px] text-ink/50">{p.createdAt}</div>
          </div>

          {p.failureReason && (
            <div className="rounded-2xl border border-ever/25 bg-ever/8 p-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-ever">
                <AlertTriangle className="h-4 w-4" /> Failure
              </div>
              <div className="mt-1 text-[13px] text-ever/90">{p.failureReason.replace(/_/g, " ")}</div>
            </div>
          )}

          <div className="rounded-2xl border border-ink/8 bg-white p-4">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Actions</div>
            <div className="mt-3 space-y-2">
              {p.status === "failed" && (
                <button
                  onClick={() => { adminActions.retryPayment(p.id); toast.success("Retry succeeded"); onClose(); }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-ink/90"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Retry charge
                </button>
              )}
              {p.status === "succeeded" && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center rounded-lg border border-ink/12 bg-white px-2">
                      <span className="text-[12px] text-ink/50">$</span>
                      <input
                        value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent px-1 py-2 text-[12.5px] tabular-nums outline-none"
                        placeholder="Amount"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const cents = Math.round(parseFloat(amount) * 100);
                        if (!Number.isFinite(cents) || cents <= 0) { toast.error("Invalid amount"); return; }
                        if (cents >= p.amount) adminActions.refundPayment(p.id);
                        else adminActions.refundPaymentPartial(p.id, cents);
                        toast.success(`Refunded $${(cents / 100).toFixed(2)}`);
                        onClose();
                      }}
                      className="rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-semibold text-ink hover:bg-ink/5"
                    >
                      <RotateCcw className="mr-1 inline h-3.5 w-3.5" /> Refund
                    </button>
                  </div>
                  <button
                    onClick={() => { adminActions.sendPaymentReceipt(p.id); toast.success("Receipt sent"); }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-ink/12 bg-white px-3 py-2 text-[12.5px] font-medium text-ink/80 hover:bg-ink/5"
                  >
                    <Mail className="h-3.5 w-3.5" /> Send receipt
                  </button>
                </>
              )}
              <button
                onClick={() => { adminActions.flagPaymentFraud(p.id); toast.success("Charge flagged as fraud"); }}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-ever/25 bg-ever/5 px-3 py-2 text-[12.5px] font-medium text-ever hover:bg-ever/10"
              >
                <Flag className="h-3.5 w-3.5" /> Flag as fraud
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-white p-4 text-[12px] text-ink/60">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Timeline</div>
            <ul className="mt-2 space-y-1.5">
              <li>· Charge created — {p.createdAt}</li>
              <li>· Result: <span className="font-semibold text-ink">{p.status}</span></li>
              {p.failureReason && <li>· Failure: {p.failureReason}</li>}
            </ul>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// silence unused
void timeAgo;
