import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  const nav = useNavigate();

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
          <ToolbarBtn icon={<Printer className="h-3.5 w-3.5" />}>Print label</ToolbarBtn>
          <ToolbarBtn icon={<RotateCcw className="h-3.5 w-3.5" />}>Refund</ToolbarBtn>
          <ToolbarBtn icon={<MoreHorizontal className="h-3.5 w-3.5" />}>More</ToolbarBtn>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700">
            Advance stage <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

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
              <MiniBtn>Edit address</MiniBtn>
              <MiniBtn>Reissue label</MiniBtn>
              <MiniBtn>Reroute</MiniBtn>
              <MiniBtn tone="critical">Report exception</MiniBtn>
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
                  <MiniBtn>Refund</MiniBtn>
                  <MiniBtn>Send receipt</MiniBtn>
                  <MiniBtn>Retry</MiniBtn>
                </div>
              </div>
            </div>
          </Card>

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
            <SectionHead icon={<FileText className="h-4 w-4 text-indigo-600" />} title="Activity" right={<button className="text-[11.5px] font-semibold text-indigo-600 hover:underline">Add internal note</button>} />
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
            <Link to="/admin/patients" className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-indigo-600 hover:underline">View patient <ExternalLink className="h-3 w-3" /></Link>
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
              <MiniBtn>Pause</MiniBtn>
              <MiniBtn>Skip next</MiniBtn>
              <MiniBtn tone="critical">Cancel</MiniBtn>
            </div>
          </Card>

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
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">{t}</span>
              ))}
              <button className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-ink/20 px-2 py-0.5 text-[11px] text-ink/55 hover:border-ink/40 hover:text-ink">+ Add</button>
            </div>
          </Card>

          {/* Assignment */}
          <Card className="p-4">
            <SectionHead icon={<MessageSquare className="h-4 w-4 text-indigo-600" />} title="Assigned" />
            <div className="mt-3 space-y-1.5 text-[12px]">
              <MetaRow label="Ops owner" value="Andre F." />
              <MetaRow label="Physician" value={o.physicianName} />
              <MetaRow label="Pharmacy" value={o.pharmacy.name} />
            </div>
            <button className="mt-3 w-full rounded-lg border border-ink/10 bg-white py-1.5 text-[12px] font-semibold text-ink hover:bg-ink/[0.03]">Reassign</button>
          </Card>
        </div>
      </div>
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

function ToolbarBtn({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink hover:bg-ink/[0.03]">{icon}{children}</button>;
}
function MiniBtn({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "critical" }) {
  const cls = tone === "critical" ? "border-rose-200 bg-white text-rose-700 hover:bg-rose-50" : "border-ink/10 bg-white text-ink hover:bg-ink/[0.03]";
  return <button className={`rounded-md border px-2 py-1 text-[11.5px] font-semibold ${cls}`}>{children}</button>;
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
