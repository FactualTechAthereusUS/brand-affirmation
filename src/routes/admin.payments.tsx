import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, RefreshCw, RotateCcw, X } from "lucide-react";
import { AdminShell, Card, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const payments = useAdmin((s) => s.payments);
  const drawerId = useAdmin((s) => s.ui.paymentDrawerId);
  const drawer = payments.find((p) => p.id === drawerId);

  const totalOk = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);
  const totalFailed = payments.filter((p) => p.status === "failed").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminShell title="Payments">
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Succeeded</div><div className="mt-1 font-hero text-2xl font-bold text-check">{formatMoney(totalOk)}</div></Card>
        <Card className="p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Failed</div><div className="mt-1 font-hero text-2xl font-bold text-ever">{formatMoney(totalFailed)}</div></Card>
        <Card className="p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Refunded</div><div className="mt-1 font-hero text-2xl font-bold text-honey">{formatMoney(totalRefunded)}</div></Card>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[11px] uppercase tracking-[0.12em] text-ink/50">
                <th className="py-2.5 font-semibold">Charge</th>
                <th className="py-2.5 font-semibold">Patient</th>
                <th className="py-2.5 font-semibold">Amount</th>
                <th className="py-2.5 font-semibold">Method</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="cursor-pointer border-b border-ink/6 hover:bg-ever/4" onClick={() => adminActions.openPayment(p.id)}>
                  <td className="py-3 font-mono text-[12px] text-ink/80">{p.id}</td>
                  <td className="font-semibold text-ink">{p.patientName}</td>
                  <td className="font-semibold">{formatMoney(p.amount)}</td>
                  <td className="text-ink/70">{p.method}</td>
                  <td>
                    <StatusPill tone={p.status === "succeeded" ? "success" : p.status === "failed" ? "critical" : "warn"}>{p.status}</StatusPill>
                  </td>
                  <td className="text-ink/70">{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={() => adminActions.openPayment(null)} />
            <motion.aside initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-ink/8 p-5">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Charge</div>
                  <div className="mt-0.5 font-mono text-[15px] font-semibold text-ink">{drawer.id}</div>
                </div>
                <button onClick={() => adminActions.openPayment(null)} className="rounded-lg p-2 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4"/></button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <Card className="p-4">
                  <div className="text-[12px] text-ink/60">Patient</div>
                  <div className="mt-1 text-[15px] font-semibold text-ink">{drawer.patientName}</div>
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-ink/70"><CreditCard className="h-4 w-4" /> {drawer.method}</div>
                  <div className="mt-3 font-hero text-2xl font-bold text-ink">{formatMoney(drawer.amount)}</div>
                </Card>
                {drawer.failureReason && (
                  <div className="rounded-2xl border border-ever/25 bg-ever/8 p-4 text-[13px] text-ever">
                    <b>Failure reason:</b> {drawer.failureReason.replace("_", " ")}
                  </div>
                )}
                <div className="flex gap-2">
                  {drawer.status === "failed" && (
                    <button onClick={() => adminActions.retryPayment(drawer.id)} className="flex-1 rounded-full bg-ink px-4 py-3 text-[13px] font-semibold text-white">
                      <RefreshCw className="mr-1 inline h-4 w-4" /> Retry
                    </button>
                  )}
                  {drawer.status === "succeeded" && (
                    <button onClick={() => adminActions.refundPayment(drawer.id)} className="flex-1 rounded-full bg-white px-4 py-3 text-[13px] font-semibold text-ink ring-1 ring-ink/15">
                      <RotateCcw className="mr-1 inline h-4 w-4" /> Refund
                    </button>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
