import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Copy, Printer, RotateCcw, MoreHorizontal, ChevronRight, Snowflake, ShieldCheck,
  Truck, Package, Pill, CreditCard, FileText, MessageSquare, Tag, User2, AlertTriangle,
  Stethoscope, MapPin, Clock, Check, ExternalLink, TrendingUp, StickyNote,
} from "lucide-react";
import { AdminShell, Card, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import { Stepper, type StepperStep } from "@/components/admin/Stepper";
import { PROGRAMS, useAdmin, adminActions, type Order, type InternalNote } from "@/lib/admin/store";
import { enrichOrder, type EnrichedOrder, type TimelineEvent } from "@/lib/admin/orders-enrich";

export const Route = createFileRoute("/admin/orders/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Order #${params.id?.replace("ord_", "") ?? ""} — Blissley HQ` },
    { name: "description", content: "Order detail — Rx, pharmacy, shipment, and clinical review." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = useParams({ from: "/admin/orders/$id" });
  const order = useAdmin((s) => s.orders.find((o) => o.id === id));
  const patient = useAdmin((s) => s.patients.find((p) => p.id === order?.patientId));
  const patientOrders = useAdmin((s) => s.orders.filter((o) => o.patientId === order?.patientId));
  const orderNotes = useAdmin((s) => s.orderNotes[id] ?? []);
  const nav = useNavigate();
  const [editingAddr, setEditingAddr] = useState(false);
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const o: EnrichedOrder | null = useMemo(() => (order ? enrichOrder(order, patient) : null), [order, patient]);

  if (!o) {
    return (
      <AdminShell title="Order">
        <Card className="p-8 text-center">
          <div className="text-[15px] font-semibold text-ink">Order not found</div>
          <Link to="/admin/orders" className="mt-3 inline-block text-[13px] font-semibold text-indigo-600 hover:underline">Back to orders</Link>
        </Card>
      </AdminShell>
    );
  }

  const steps = buildSteps(o);

  return (
    <AdminShell title="Order">
      {/* Top bar */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <button onClick={() => nav({ to: "/admin/orders" })} className="mb-2 inline-flex items-center gap-1 text-[12px] font-medium text-ink/55 hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" /> Orders
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-bold text-ink">Order #{o.id.replace("ord_", "")}</h1>
            <button onClick={() => navigator.clipboard?.writeText(o.id)} className="rounded p-1 text-ink/40 hover:bg-ink/[0.05] hover:text-ink"><Copy className="h-3.5 w-3.5" /></button>
            <RxBadge status={o.rxStatus} />
            <FulfillBadge status={o.status} />
            {o.coldChain && <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700"><Snowflake className="h-3 w-3" /> Cold chain 2–8 °C</span>}
          </div>
          <p className="mt-1 text-[12.5px] text-ink/55">Placed {o.createdAt} · {PROGRAMS[o.program].label} · {o.cadence}</p>
        </div>
        <div className="flex items-center gap-2">
          <ToolbarBtn icon={<Printer className="h-3.5 w-3.5" />} onClick={() => { adminActions.printOrderLabel(o.id); toast.success("Label sent to printer"); }}>Print label</ToolbarBtn>
          <ToolbarBtn icon={<RotateCcw className="h-3.5 w-3.5" />} tone="critical" onClick={() => {
            if (o.payment.status === "refunded") { toast.info("Already refunded"); return; }
            const reason = window.prompt("Refund reason?", "Customer request") ?? "";
            if (!reason) return;
            adminActions.refundOrder(o.id, reason);
            toast.success(`Refunded ${formatMoney(o.payment.total)}`);
          }}>Refund</ToolbarBtn>
          <ToolbarBtn icon={<MoreHorizontal className="h-3.5 w-3.5" />} onClick={() => { adminActions.sendOrderReceipt(o.id); toast.success("Receipt emailed"); }}>Send receipt</ToolbarBtn>
          <button
            onClick={() => {
              if (o.status === "delivered") { toast.info("Order already delivered"); return; }
              adminActions.advanceOrderStage(o.id);
              toast.success("Stage advanced");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
            disabled={o.status === "delivered"}
          >
            Advance stage <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <VariantBanner o={o} />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* LEFT column */}
        <div className="space-y-4">
          {/* Stepper */}
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Fulfillment timeline</div>
              <span className="text-[11px] text-ink/45">SLA target · 48h from Rx approval</span>
            </div>
            <Stepper steps={steps} />
          </Card>

          {/* Line items */}
          <Card className="p-4">
            <SectionHead icon={<Pill className="h-4 w-4 text-indigo-600" />} title="Line items" right={<span className="text-[11.5px] text-ink/50">{o.items.length} item{o.items.length > 1 ? "s" : ""}</span>} />
            <div className="mt-3 divide-y divide-ink/6">
              {o.items.map((it) => (
                <div key={it.sku} className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-ink">{it.name}</span>
                      {it.coldChain && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">2–8 °C</span>}
                      <span className="rounded bg-ink/[0.05] px-1.5 py-0.5 font-mono text-[10.5px] text-ink/60">NDC {it.ndc}</span>
                    </div>
                    <div className="mt-1 text-[12.5px] text-ink/65">{it.dose}</div>
                    <div className="mt-1 flex flex-wrap gap-3 text-[11.5px] text-ink/50">
                      <span>SKU {it.sku}</span>
                      <span>Lot {it.lot}</span>
                      <span>Qty {it.qty}</span>
                      <span>{it.refillsRemaining} refill{it.refillsRemaining === 1 ? "" : "s"} remaining</span>
                    </div>
                  </div>
                  <div className="text-right text-[13px] font-semibold text-ink">{formatMoney(o.payment.subtotal)}</div>
                </div>
              ))}
              <div className="pt-3">
                <div className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Supplies bundle</div>
                <ul className="mt-1.5 space-y-1 text-[12.5px] text-ink/70">
                  {o.supplies.map((s) => <li key={s} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-600" /> {s}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-ink/[0.03] px-3 py-2 text-[12px]">
              <div className="flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-ink/50" /><span className="text-ink/50">Physician</span> <span className="font-semibold text-ink">{o.physicianName}</span></div>
              <span className="text-ink/20">·</span>
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> State telehealth check <span className="font-semibold text-emerald-700">passed ({o.shipTo.state})</span></div>
              <span className="text-ink/20">·</span>
              <div className="flex items-center gap-1.5"><span className="text-ink/50">Rx #</span><span className="font-mono font-semibold text-ink">RX-{o.id.replace("ord_", "")}</span></div>
            </div>
          </Card>

          {/* Shipping */}
          <Card className="p-4">
            <SectionHead icon={<Truck className="h-4 w-4 text-indigo-600" />} title="Shipping" right={<FulfillBadge status={o.status} />} />
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink/50">Ship to</div>
                <div className="mt-1 flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" />
                  <div className="text-[13px] leading-relaxed text-ink">
                    <div className="font-semibold">{o.shipTo.name}</div>
                    <div>{o.shipTo.line1}{o.shipTo.line2 ? `, ${o.shipTo.line2}` : ""}</div>
                    <div>{o.shipTo.city}, {o.shipTo.state} {o.shipTo.zip}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">Address verified</span>
                      {o.signatureRequired && <span className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700">Signature required</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink/50">Carrier</div>
                <div className="mt-1 text-[13px] text-ink">
                  <div className="font-semibold">{o.carrier} · {o.service}</div>
                  {o.tracking && <div className="mt-0.5 flex items-center gap-1 font-mono text-[11.5px] text-ink/60">
                    {o.tracking}
                    <button onClick={() => navigator.clipboard?.writeText(o.tracking!)} className="rounded p-0.5 hover:bg-ink/[0.05]"><Copy className="h-3 w-3" /></button>
                  </div>}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11.5px]">
                    <MetaRow label="ETA" value={o.eta ?? "—"} />
                    <MetaRow label="Delivered" value={o.deliveredAt ?? "—"} />
                    <MetaRow label="Pharmacy" value={`${o.pharmacy.name}`} />
                    <MetaRow label="Origin" value={`${o.pharmacy.city}, ${o.pharmacy.state}`} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <MiniBtn onClick={() => setEditingAddr(true)}>Edit address</MiniBtn>
              <MiniBtn onClick={() => { adminActions.reissueLabel(o.id); toast.success("New label issued"); }}>Reissue label</MiniBtn>
              <MiniBtn onClick={() => { adminActions.reportOrderException(o.id, "Rerouted by ops"); toast.success("Reroute requested"); }}>Reroute</MiniBtn>
              <MiniBtn tone="critical" onClick={() => {
                const reason = window.prompt("Exception reason?", "Carrier delay") ?? "";
                if (!reason) return;
                adminActions.reportOrderException(o.id, reason);
                toast.error(`Exception reported — ${reason}`);
              }}>Report exception</MiniBtn>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-4">
            <SectionHead icon={<CreditCard className="h-4 w-4 text-indigo-600" />} title="Payment" right={<PaymentBadge status={o.payment.status} />} />
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-[13px]">
                <Line label="Subtotal" value={formatMoney(o.payment.subtotal)} />
                {o.payment.discount > 0 && <Line label="Discount" value={`− ${formatMoney(o.payment.discount)}`} valueClass="text-emerald-600" />}
                <Line label="Tax" value={formatMoney(o.payment.tax)} />
                <Line label="Shipping" value="Free" />
                <div className="mt-2 flex items-center justify-between border-t border-ink/8 pt-2">
                  <span className="text-[13px] font-semibold text-ink">Total charged</span>
                  <span className="text-[15px] font-bold text-ink">{formatMoney(o.payment.total)}</span>
                </div>
              </div>
              <div className="rounded-lg border border-ink/8 bg-ink/[0.02] p-3 text-[12.5px]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">Method</div>
                <div className="mt-1 font-semibold text-ink">{o.payment.method} •••• {o.payment.last4}</div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-ink/50">Intent</div>
                <div className="mt-1 font-mono text-[11.5px] text-ink/70">{o.payment.intentId}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <MiniBtn tone="critical" disabled={o.payment.status !== "paid"} onClick={() => {
                    const reason = window.prompt("Refund reason?", "Customer request") ?? "";
                    if (!reason) return;
                    adminActions.refundOrder(o.id, reason);
                    toast.success(`Refunded ${formatMoney(o.payment.total)}`);
                  }}>Refund</MiniBtn>
                  <MiniBtn onClick={() => { adminActions.sendOrderReceipt(o.id); toast.success("Receipt emailed"); }}>Send receipt</MiniBtn>
                  <MiniBtn disabled={o.payment.status === "paid"} onClick={() => { adminActions.retryOrderPayment(o.id); toast.success("Payment retried"); }}>Retry</MiniBtn>
                </div>
              </div>
            </div>
          </Card>

          {/* COGS — internal */}
          <CogsCard o={o} />

          {/* Clinical excerpt */}
          <Card className="p-4">
            <SectionHead icon={<Stethoscope className="h-4 w-4 text-indigo-600" />} title="Clinical review" right={<Link to="/admin/physician-queue" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-indigo-600 hover:underline">Open case <ExternalLink className="h-3 w-3" /></Link>} />
            <div className="mt-3 grid gap-3 text-[12.5px] sm:grid-cols-2">
              <MetaRow label="Chief complaint" value={o.clinical.chiefComplaint} />
              <MetaRow label="BMI" value={o.clinical.bmi.toFixed(1)} />
              <MetaRow label="Contraindications" value="Cleared" />
              <MetaRow label="E-signed" value={new Date(o.clinical.eSignAt).toLocaleString()} />
            </div>
            <div className="mt-3 rounded-lg border border-ink/8 bg-ink/[0.02] p-3 text-[12.5px] italic text-ink/75">
              "{o.clinical.physicianNote}" — <span className="not-italic font-semibold text-ink">{o.physicianName}</span>
            </div>
          </Card>

          {/* Activity log */}
          <Card className="p-4">
            <SectionHead icon={<FileText className="h-4 w-4 text-indigo-600" />} title="Activity" right={<button onClick={() => { document.getElementById("order-note-input")?.scrollIntoView({ behavior: "smooth", block: "center" }); (document.getElementById("order-note-input") as HTMLTextAreaElement | null)?.focus(); }} className="text-[11.5px] font-semibold text-indigo-600 hover:underline">Add internal note</button>} />
            <ol className="mt-3 space-y-3">
              {[...o.timeline].reverse().map((ev) => (
                <li key={ev.ts + ev.kind} className="flex gap-3">
                  <TimelineDot kind={ev.kind} />
                  <div className="min-w-0 flex-1 border-b border-ink/6 pb-3 last:border-b-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="text-[13px] font-semibold text-ink">{ev.message}</div>
                      <div className="text-[11px] text-ink/45">{new Date(ev.ts).toLocaleString()}</div>
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-ink/55">
                      <span className="rounded bg-ink/[0.05] px-1.5 py-0.5 font-medium capitalize">{ev.actor}</span>
                      {ev.meta && <span className="ml-2 font-mono">{ev.meta}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* RIGHT column */}
        <div className="space-y-4">
          {/* Patient */}
          <Card className="p-4">
            <SectionHead icon={<User2 className="h-4 w-4 text-indigo-600" />} title="Patient" />
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-[15px] font-bold text-indigo-700">
                {o.patientName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-ink">{o.patientName}</div>
                <div className="truncate text-[11.5px] text-ink/55">{patient?.email ?? "patient@blissley.com"}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[12px]">
              <MetaRow label="Phone" value={patient?.phone ?? "—"} />
              <MetaRow label="State" value={o.shipTo.state} />
              <MetaRow label="Plan" value={PROGRAMS[o.program].label} />
              <MetaRow label="LTV" value={formatMoney((patient?.ltv ?? 0) * 100)} />
              <MetaRow label="Started" value={patient?.startedAt ?? "—"} />
            </div>
            <Link to="/admin/patients/$id" params={{ id: order!.patientId }} className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-indigo-600 hover:underline">View patient <ExternalLink className="h-3 w-3" /></Link>
          </Card>

          {/* Subscription */}
          <Card className="p-4">
            <SectionHead icon={<Package className="h-4 w-4 text-indigo-600" />} title="Subscription" />
            <div className="mt-3 space-y-1.5 text-[12px]">
              <MetaRow label="Program" value={PROGRAMS[o.program].label} />
              <MetaRow label="Cadence" value={o.cadence} />
              <MetaRow label="Refill #" value={String(o.refillNumber)} />
              <MetaRow label="Next refill" value={o.eta ?? "—"} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <MiniBtn onClick={() => { adminActions.pausePatient(order!.patientId); toast.success("Subscription paused"); }}>Pause</MiniBtn>
              <MiniBtn onClick={() => { adminActions.skipNextRefill(o.id); toast.success("Refill skipped"); }}>Skip next</MiniBtn>
              <MiniBtn tone="critical" onClick={() => {
                const reason = window.prompt("Cancellation reason?", "Patient request") ?? "";
                if (!reason) return;
                adminActions.cancelPatient(order!.patientId, reason);
                toast.success("Subscription cancelled");
              }}>Cancel</MiniBtn>
            </div>
          </Card>

          {/* Patient order history */}
          <PatientOrderHistory patientId={order!.patientId} currentId={id} orders={patientOrders} />

          {/* Risk */}
          <Card className="p-4">
            <SectionHead icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} title="Risk & flags" />
            <div className="mt-3 space-y-1.5 text-[12px]">
              <MetaRow label="Churn risk" value={patient?.churn ?? "low"} />
              <MetaRow label="ID verification" value="Verified" />
              <MetaRow label="Address deliverability" value="Deliverable" />
              <MetaRow label="Chargebacks" value="0" />
            </div>
            {o.flags.length > 0 && (
              <ul className="mt-2 space-y-1">
                {o.flags.map((f) => <li key={f} className="rounded bg-rose-50 px-2 py-1 text-[11.5px] font-semibold text-rose-700">⚠ {f}</li>)}
              </ul>
            )}
          </Card>

          {/* Tags */}
          <Card className="p-4">
            <SectionHead icon={<Tag className="h-4 w-4 text-violet-600" />} title="Tags" />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {o.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                  {t}
                  <button onClick={() => adminActions.removeOrderTag(o.id, t)} className="ml-0.5 text-violet-700/60 hover:text-violet-900">×</button>
                </span>
              ))}
              {addTagOpen ? (
                <form onSubmit={(e) => { e.preventDefault(); if (newTag.trim()) { adminActions.addOrderTag(o.id, newTag.trim()); setNewTag(""); setAddTagOpen(false); toast.success("Tag added"); } }} className="flex items-center gap-1">
                  <input autoFocus value={newTag} onChange={(e) => setNewTag(e.target.value)} onBlur={() => setAddTagOpen(false)} placeholder="Tag…" className="w-24 rounded-full border border-ink/15 px-2 py-0.5 text-[11px] outline-none focus:border-indigo-500" />
                </form>
              ) : (
                <button onClick={() => setAddTagOpen(true)} className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-ink/20 px-2 py-0.5 text-[11px] text-ink/55 hover:border-ink/40 hover:text-ink">+ Add</button>
              )}
            </div>
          </Card>

          {/* Assignment */}
          <Card className="p-4">
            <SectionHead icon={<MessageSquare className="h-4 w-4 text-indigo-600" />} title="Assigned" />
            <div className="mt-3 space-y-1.5 text-[12px]">
              <MetaRow label="Ops owner" value={order!.opsOwner ?? "Andre F."} />
              <MetaRow label="Physician" value={o.physicianName} />
              <MetaRow label="Pharmacy" value={o.pharmacy.name} />
            </div>
            <button onClick={() => {
              const owner = window.prompt("Assign ops owner to:", o.opsOwner ?? "Andre F.") ?? "";
              if (!owner) return;
              adminActions.assignOrderOps(o.id, owner);
              toast.success(`Reassigned to ${owner}`);
            }} className="mt-3 w-full rounded-lg border border-ink/10 bg-white py-1.5 text-[12px] font-semibold text-ink hover:bg-ink/[0.03]">Reassign</button>
          </Card>

          {/* Internal notes */}
          <OrderInternalNotes orderId={id} notes={orderNotes} />
        </div>
      </div>
      {editingAddr && (
        <AddressEditor
          initial={o.shipTo}
          onClose={() => setEditingAddr(false)}
          onSave={(patch) => { adminActions.updateOrderAddress(o.id, patch); setEditingAddr(false); toast.success("Shipping address updated"); }}
        />
      )}
    </AdminShell>
  );
}

/* ─────────────── Helpers ─────────────── */

function buildSteps(o: EnrichedOrder): StepperStep[] {
  const order: StepperStep["key"][] = ["rx_approved", "sent_to_pharmacy", "dispensed", "label", "shipped", "out_for_delivery", "delivered"];
  const labels: Record<string, string> = {
    rx_approved: "Rx approved",
    sent_to_pharmacy: "Sent to pharmacy",
    dispensed: "Compounded",
    label: "Label created",
    shipped: "In transit",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
  };
  const doneKinds = new Set(o.timeline.map((t) => t.kind));
  const isException = o.status === "exception";
  const lastDoneIdx = order.reduce((acc, k, i) => doneKinds.has(k as TimelineEvent["kind"]) ? i : acc, -1);

  return order.map((k, i) => {
    const ts = o.timeline.find((t) => t.kind === k)?.ts;
    let state: StepperStep["state"] = "pending";
    if (i <= lastDoneIdx) state = "done";
    else if (i === lastDoneIdx + 1) state = "current";
    if (isException && i === lastDoneIdx + 1) state = "exception";
    return { key: k, label: labels[k], sublabel: ts ? new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : undefined, state };
  });
}

function ToolbarBtn({ icon, children, onClick, tone = "neutral" }: { icon: React.ReactNode; children: React.ReactNode; onClick?: () => void; tone?: "neutral" | "critical" }) {
  const cls = tone === "critical" ? "border-rose-200 bg-white text-rose-700 hover:bg-rose-50" : "border-ink/10 bg-white text-ink hover:bg-ink/[0.03]";
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium ${cls}`}>{icon}{children}</button>;
}
function MiniBtn({ children, tone = "neutral", onClick, disabled }: { children: React.ReactNode; tone?: "neutral" | "critical"; onClick?: () => void; disabled?: boolean }) {
  const cls = tone === "critical" ? "border-rose-200 bg-white text-rose-700 hover:bg-rose-50" : "border-ink/10 bg-white text-ink hover:bg-ink/[0.03]";
  return <button onClick={onClick} disabled={disabled} className={`rounded-md border px-2 py-1 text-[11.5px] font-semibold disabled:opacity-40 ${cls}`}>{children}</button>;
}
function SectionHead({ icon, title, right }: { icon: React.ReactNode; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-[13px] font-semibold text-ink">{title}</div>
      </div>
      {right}
    </div>
  );
}
function MetaRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-2"><span className="text-ink/50">{label}</span><span className="text-right font-medium text-ink">{value}</span></div>;
}
function Line({ label, value, valueClass = "text-ink" }: { label: string; value: string; valueClass?: string }) {
  return <div className="flex items-center justify-between"><span className="text-ink/55">{label}</span><span className={`font-semibold ${valueClass}`}>{value}</span></div>;
}
function RxBadge({ status }: { status: EnrichedOrder["rxStatus"] }) {
  const map = {
    pending_review: { tone: "warn" as const, label: "Rx · Pending review" },
    approved:       { tone: "success" as const, label: "Rx · Approved" },
    refill_due:     { tone: "info" as const, label: "Rx · Refill due" },
    denied:         { tone: "critical" as const, label: "Rx · Denied" },
  };
  const m = map[status];
  return <StatusPill tone={m.tone}>{m.label}</StatusPill>;
}
function FulfillBadge({ status }: { status: Order["status"] }) {
  const map = {
    processing:  { tone: "neutral" as const, label: "Processing" },
    at_pharmacy: { tone: "warn" as const, label: "At pharmacy" },
    shipped:     { tone: "info" as const, label: "In transit" },
    delivered:   { tone: "success" as const, label: "Delivered" },
    exception:   { tone: "critical" as const, label: "Exception" },
  };
  const m = map[status];
  return <StatusPill tone={m.tone}>{m.label}</StatusPill>;
}
function PaymentBadge({ status }: { status: "paid" | "failed" | "refunded" }) {
  const map = { paid: "success", failed: "critical", refunded: "warn" } as const;
  return <StatusPill tone={map[status]}>{status}</StatusPill>;
}

function TimelineDot({ kind }: { kind: TimelineEvent["kind"] }) {
  const map: Record<TimelineEvent["kind"], { bg: string; icon: React.ReactNode }> = {
    created:          { bg: "bg-slate-100 text-slate-600",   icon: <Clock className="h-3 w-3" /> },
    paid:             { bg: "bg-emerald-100 text-emerald-700", icon: <CreditCard className="h-3 w-3" /> },
    rx_approved:      { bg: "bg-indigo-100 text-indigo-700", icon: <ShieldCheck className="h-3 w-3" /> },
    sent_to_pharmacy: { bg: "bg-violet-100 text-violet-700", icon: <Package className="h-3 w-3" /> },
    dispensed:        { bg: "bg-sky-100 text-sky-700",       icon: <Pill className="h-3 w-3" /> },
    label:            { bg: "bg-slate-100 text-slate-700",   icon: <FileText className="h-3 w-3" /> },
    shipped:          { bg: "bg-sky-100 text-sky-700",       icon: <Truck className="h-3 w-3" /> },
    out_for_delivery: { bg: "bg-amber-100 text-amber-700",   icon: <Truck className="h-3 w-3" /> },
    delivered:        { bg: "bg-emerald-100 text-emerald-700", icon: <Check className="h-3 w-3" /> },
    exception:        { bg: "bg-rose-100 text-rose-700",     icon: <AlertTriangle className="h-3 w-3" /> },
    note:             { bg: "bg-slate-100 text-slate-600",   icon: <FileText className="h-3 w-3" /> },
    message:          { bg: "bg-slate-100 text-slate-600",   icon: <MessageSquare className="h-3 w-3" /> },
  };
  const m = map[kind];
  return <div className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${m.bg}`}>{m.icon}</div>;
}

/* ─────────────── New telehealth blocks ─────────────── */

function VariantBanner({ o }: { o: EnrichedOrder }) {
  if (o.status === "exception") {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
        <div className="flex items-center gap-2 text-[13px]">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <span className="font-semibold text-rose-800">Delayed / delivery exception</span>
          <span className="text-rose-700/80">— cold-chain window at risk. Reship at no cost to protect the patient.</span>
        </div>
        <button onClick={() => { adminActions.reissueLabel(o.id); adminActions.advanceOrderStage(o.id); toast.success("Free reship queued"); }} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-rose-700">
          <RotateCcw className="h-3.5 w-3.5" /> Reship at no cost
        </button>
      </div>
    );
  }
  if (o.rxStatus === "pending_review") {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2 text-[13px]">
          <Clock className="h-4 w-4 text-amber-700" />
          <span className="font-semibold text-amber-900">Awaiting Rx approval</span>
          <span className="text-amber-800/80">— card authorized, not captured until physician e-signs. SLA 48h.</span>
        </div>
        <Link to="/admin/physician-queue" className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-amber-700">
          Open physician queue <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }
  if (o.payment.status === "refunded") {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px]">
        <RotateCcw className="h-4 w-4 text-slate-500" />
        <span className="font-semibold text-slate-800">Order refunded</span>
        <span className="text-slate-600">— {formatMoney(o.payment.total)} returned to {o.payment.method} •••• {o.payment.last4}.</span>
      </div>
    );
  }
  return null;
}

function CogsCard({ o }: { o: EnrichedOrder }) {
  const c = o.cogs;
  const gpTone = c.gpPct >= 55 ? "text-emerald-700" : c.gpPct >= 35 ? "text-amber-700" : "text-rose-700";
  return (
    <Card className="p-4">
      <SectionHead
        icon={<TrendingUp className="h-4 w-4 text-indigo-600" />}
        title="Unit economics · internal"
        right={<span className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink/55">Ops only</span>}
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-5">
        <CogsMetric label="Drug cost" value={formatMoney(c.drug)} sub={`${o.items[0].name.split(" ")[0]} · ${o.cadence.toLowerCase()}`} />
        <CogsMetric label="Packaging" value={formatMoney(c.packaging)} sub="Cold-chain kit" />
        <CogsMetric label="Shipping" value={formatMoney(c.shipping)} sub={`${o.carrier} ${o.service}`} />
        <CogsMetric label="Gross profit" value={formatMoney(c.gp)} sub="Order-level" bold />
        <CogsMetric label="GP margin" value={`${c.gpPct}%`} sub="Target ≥ 55%" tone={gpTone} bold />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-ink/[0.03] px-3 py-2 text-[12px] text-ink/65">
        <span>Revenue captured</span>
        <span className="font-mono font-semibold text-ink">{formatMoney(o.payment.total)}</span>
        <span className="text-ink/30">−</span>
        <span>COGS</span>
        <span className="font-mono font-semibold text-ink">{formatMoney(c.drug + c.packaging + c.shipping)}</span>
        <span className="text-ink/30">=</span>
        <span className={`font-mono font-bold ${gpTone}`}>{formatMoney(c.gp)}</span>
      </div>
    </Card>
  );
}
function CogsMetric({ label, value, sub, bold, tone }: { label: string; value: string; sub: string; bold?: boolean; tone?: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink/50">{label}</div>
      <div className={`mt-0.5 tabular-nums ${bold ? "text-[16px] font-bold" : "text-[14px] font-semibold"} ${tone ?? "text-ink"}`}>{value}</div>
      <div className="text-[10.5px] text-ink/45">{sub}</div>
    </div>
  );
}

function PatientOrderHistory({ patientId, currentId, orders }: { patientId: string; currentId: string; orders: Order[] }) {
  const others = orders.filter((o) => o.id !== currentId).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 3);
  return (
    <Card className="p-4">
      <SectionHead
        icon={<Package className="h-4 w-4 text-indigo-600" />}
        title="Patient order history"
        right={<Link to="/admin/orders" className="text-[11.5px] font-semibold text-indigo-600 hover:underline">View all →</Link>}
      />
      {others.length === 0 && (
        <div className="mt-3 rounded-md border border-dashed border-ink/10 p-3 text-[11.5px] text-ink/45">
          First order — no prior history for this patient.
        </div>
      )}
      <ul className="mt-3 space-y-2">
        {others.map((o) => (
          <li key={o.id}>
            <Link to="/admin/orders/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-lg border border-ink/8 bg-white px-3 py-2 hover:border-indigo-300 hover:bg-indigo-50/40">
              <div className="min-w-0">
                <div className="font-mono text-[11.5px] font-semibold text-ink">#{o.id.replace("ord_", "")}</div>
                <div className="text-[11px] text-ink/55">{o.createdAt} · {PROGRAMS[o.program].label.split(" · ")[0]}</div>
              </div>
              <div className="flex items-center gap-2">
                <FulfillBadge status={o.status} />
                <span className="tabular-nums text-[12.5px] font-semibold text-ink">${o.amount}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/admin/patients/$id" params={{ id: patientId }} className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-indigo-600 hover:underline">
        Open full patient timeline <ExternalLink className="h-3 w-3" />
      </Link>
    </Card>
  );
}

function OrderInternalNotes({ orderId, notes }: { orderId: string; notes: InternalNote[] }) {
  const [text, setText] = useState("");
  function fmt(ts: number) {
    const d = new Date(ts);
    return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  }
  return (
    <Card className="p-4">
      <SectionHead icon={<StickyNote className="h-4 w-4 text-amber-600" />} title="Internal notes" />
      <p className="mt-1 text-[11px] text-ink/50">Visible to ops team only. Never shown to the patient.</p>
      <div className="mt-3 space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="rounded-md border border-amber-200 bg-amber-50/50 p-2.5">
            <div className="text-[12.5px] text-ink">{n.text}</div>
            <div className="mt-1 text-[10.5px] text-ink/50">— {n.author} · {fmt(n.ts)}</div>
          </div>
        ))}
        {notes.length === 0 && <div className="rounded-md border border-dashed border-ink/10 p-3 text-[11.5px] text-ink/45">No internal notes on this order yet.</div>}
      </div>
      <textarea
        id="order-note-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Add order note (e.g. pharmacy called, cold pack replaced)…"
        className="mt-3 w-full resize-none rounded-lg border border-ink/10 bg-white p-2.5 text-[12.5px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      <button
        onClick={() => { adminActions.addOrderNote(orderId, text); setText(""); toast.success("Note added"); }}
        disabled={!text.trim()}
        className="mt-2 w-full rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
      >Save note</button>
    </Card>
  );
}

function AddressEditor({ initial, onClose, onSave }: { initial: { line1: string; line2?: string; city: string; state: string; zip: string }; onClose: () => void; onSave: (patch: { line1: string; line2?: string; city: string; state: string; zip: string }) => void }) {
  const [f, setF] = useState({ line1: initial.line1, line2: initial.line2 ?? "", city: initial.city, state: initial.state, zip: initial.zip });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 text-[15px] font-bold text-ink">Edit shipping address</div>
        <div className="space-y-2">
          <Field label="Street" value={f.line1} onChange={(v) => setF({ ...f, line1: v })} />
          <Field label="Apt / Suite" value={f.line2} onChange={(v) => setF({ ...f, line2: v })} />
          <div className="grid grid-cols-3 gap-2">
            <Field label="City" value={f.city} onChange={(v) => setF({ ...f, city: v })} />
            <Field label="State" value={f.state} onChange={(v) => setF({ ...f, state: v.toUpperCase().slice(0, 2) })} />
            <Field label="ZIP" value={f.zip} onChange={(v) => setF({ ...f, zip: v })} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-ink/10 px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:bg-ink/[0.03]">Cancel</button>
          <button onClick={() => onSave({ line1: f.line1, line2: f.line2 || undefined, city: f.city, state: f.state, zip: f.zip })} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700">Save</button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink/50">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-0.5 w-full rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-[12.5px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
    </label>
  );
}
