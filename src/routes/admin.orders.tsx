import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Package, Truck, X } from "lucide-react";
import { AdminShell, Card, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import { adminActions, PROGRAMS, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const orders = useAdmin((s) => s.orders);
  const drawerId = useAdmin((s) => s.ui.orderDrawerId);
  const drawer = orders.find((o) => o.id === drawerId);

  return (
    <AdminShell title="Orders">
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[11px] uppercase tracking-[0.12em] text-ink/50">
                <th className="py-2.5 font-semibold">Order</th>
                <th className="py-2.5 font-semibold">Patient</th>
                <th className="py-2.5 font-semibold">Program</th>
                <th className="py-2.5 font-semibold">Amount</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Created</th>
                <th className="py-2.5 font-semibold">Tracking</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="cursor-pointer border-b border-ink/6 hover:bg-ever/4" onClick={() => adminActions.openOrder(o.id)}>
                  <td className="py-3 font-mono text-[12px] text-ink/80">{o.id}</td>
                  <td className="font-semibold text-ink">{o.patientName}</td>
                  <td className="text-ink/75">{PROGRAMS[o.program].label}</td>
                  <td className="font-semibold">{formatMoney(o.amount)}</td>
                  <td>
                    <StatusPill tone={o.status === "delivered" ? "success" : o.status === "shipped" ? "info" : o.status === "exception" ? "critical" : "warn"}>
                      {o.status.replace("_", " ")}
                    </StatusPill>
                  </td>
                  <td className="text-ink/70">{o.createdAt}</td>
                  <td className="font-mono text-[11.5px] text-ink/60">{o.tracking || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={() => adminActions.openOrder(null)} />
            <motion.aside initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-ink/8 p-5">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Order</div>
                  <div className="mt-0.5 font-mono text-[15px] font-semibold text-ink">{drawer.id}</div>
                </div>
                <button onClick={() => adminActions.openOrder(null)} className="rounded-lg p-2 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4"/></button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <Card className="p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Patient</div>
                  <div className="mt-1 text-[15px] font-semibold text-ink">{drawer.patientName}</div>
                  <div className="mt-3 text-[13px] text-ink/70">{PROGRAMS[drawer.program].label} · {formatMoney(drawer.amount)}</div>
                </Card>
                <Card className="p-4">
                  <div className="mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-marine" /><div className="text-[13px] font-semibold text-ink">Fulfillment</div></div>
                  <div className="space-y-2 text-[13px]">
                    <Row label="Pharmacy" value="Wells Rx · Charlotte, NC" />
                    <Row label="Status" value={drawer.status.replace("_", " ")} />
                    <Row label="Tracking" value={drawer.tracking || "Pending"} />
                    <Row label="ETA" value={drawer.eta || "—"} />
                  </div>
                </Card>
                <button onClick={() => adminActions.reshipOrder(drawer.id)} className="w-full rounded-full bg-ink px-4 py-3 text-[13px] font-semibold text-white">
                  <Package className="mr-1 inline h-4 w-4" /> Reship at no cost
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-ink/50">{label}</span><span className="font-medium text-ink">{value}</span></div>;
}
