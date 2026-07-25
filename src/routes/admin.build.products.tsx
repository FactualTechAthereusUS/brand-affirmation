import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AdminShell, Card, SectionTitle, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin } from "@/lib/admin/store";
import { toast } from "sonner";
import { Package, DollarSign, Tag, Zap, Archive } from "lucide-react";

export const Route = createFileRoute("/admin/build/products")({
  head: () => ({ meta: [{ title: "Products & pricing — PharmaBro" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ProductsBuilder,
});

type Tab = "products" | "plans" | "upsells" | "discounts";

function ProductsBuilder() {
  const [tab, setTab] = useState<Tab>("products");
  const products = useAdmin((s) => s.build.products);
  const plans = useAdmin((s) => s.build.plans);
  const upsells = useAdmin((s) => s.build.upsells);
  const discounts = useAdmin((s) => s.build.discounts);

  const TABS: { key: Tab; label: string; icon: typeof Package; count: number }[] = [
    { key: "products",  label: "Products",  icon: Package,   count: products.length },
    { key: "plans",     label: "Plans",     icon: DollarSign,count: plans.length },
    { key: "upsells",   label: "Upsells",   icon: Zap,       count: upsells.length },
    { key: "discounts", label: "Discounts", icon: Tag,       count: discounts.length },
  ];

  return (
    <AdminShell title="Products & pricing">
      <SectionTitle subtitle="Medications, subscription plans, one-time upsells, and coupons.">Products & pricing</SectionTitle>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition ${
                active ? "border-ink bg-ink text-white" : "border-ink/[0.08] bg-white text-ink/70 hover:border-ink/25"
              }`}>
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              <span className={`rounded-full px-1.5 text-[10px] tabular-nums ${active ? "bg-white/20 text-white" : "bg-ink/[0.06] text-ink/55"}`}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {tab === "products"  && <ProductsTable rows={products} />}
      {tab === "plans"     && <PlansTable rows={plans} products={products} />}
      {tab === "upsells"   && <UpsellsTable rows={upsells} />}
      {tab === "discounts" && <DiscountsTable rows={discounts} />}
    </AdminShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "live" ? "success" : status === "draft" ? "warn" : "neutral";
  return <Pill tone={tone as any}>{status}</Pill>;
}

function ProductsTable({ rows }: { rows: ReturnType<typeof useAdmin<any>> }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-ink/[0.06] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
            <Th>Product</Th><Th>Molecule</Th><Th>Form</Th><Th>Pharmacy</Th><Th>Badge</Th><Th>Status</Th><Th />
          </tr>
        </thead>
        <tbody>
          {(rows as any[]).map((p, i) => (
            <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="border-b border-ink/[0.04] tabular-nums hover:bg-ink/[0.015]">
              <Td>
                <div className="font-semibold text-ink">{p.name}</div>
                <div className="text-[10.5px] text-ink/45">{p.internalName}</div>
              </Td>
              <Td>{p.molecule}</Td>
              <Td>{p.form}</Td>
              <Td>{p.pharmacy}<div className="text-[10.5px] text-ink/45">Backup: {p.pharmacyBackup}</div></Td>
              <Td>{p.badge || <span className="text-ink/35">—</span>}</Td>
              <Td><StatusPill status={p.status} /></Td>
              <Td>
                {p.status !== "archived" && (
                  <button onClick={() => { adminActions.archiveBuildProduct(p.id); toast("Product archived"); }}
                    className="text-ink/40 hover:text-ever" title="Archive">
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                )}
              </Td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function PlansTable({ rows, products }: { rows: any[]; products: any[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-ink/[0.06] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
            <Th>Plan</Th><Th>Product</Th><Th>Duration</Th><Th>First price</Th><Th>Ongoing</Th><Th>Badge</Th><Th>Preselect</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => {
            const prod = products.find((x) => x.id === p.productId);
            return (
              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-ink/[0.04] tabular-nums hover:bg-ink/[0.015]">
                <Td>
                  <div className="font-semibold text-ink">{p.displayName}</div>
                  <div className="text-[10.5px] text-ink/45">{p.weeksSupply}</div>
                </Td>
                <Td>{prod?.name ?? "—"}</Td>
                <Td>{p.duration}</Td>
                <Td>${p.firstPrice}</Td>
                <Td>${p.ongoingPrice}/mo{p.savings && <div className="text-[10.5px] text-check">{p.savings}</div>}</Td>
                <Td>{p.badge || <span className="text-ink/35">—</span>}</Td>
                <Td>
                  <button onClick={() => adminActions.updateBuildPlan(p.id, { preselected: !p.preselected })}
                    className={`h-4 w-7 rounded-full transition ${p.preselected ? "bg-check" : "bg-ink/15"} relative`}>
                    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${p.preselected ? "left-3.5" : "left-0.5"}`} />
                  </button>
                </Td>
                <Td><StatusPill status={p.status} /></Td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function UpsellsTable({ rows }: { rows: any[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-ink/[0.06] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
            <Th>Upsell</Th><Th>Position</Th><Th>Price</Th><Th>Type</Th><Th>Order</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u, i) => (
            <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="border-b border-ink/[0.04] tabular-nums hover:bg-ink/[0.015]">
              <Td>
                <div className="font-semibold text-ink">{u.displayName}</div>
                <div className="text-[10.5px] text-ink/45">{u.description}</div>
              </Td>
              <Td>{u.position}</Td>
              <Td>${u.price.toFixed(2)}</Td>
              <Td>{u.type}</Td>
              <Td>{u.order}</Td>
              <Td><StatusPill status={u.status} /></Td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function DiscountsTable({ rows }: { rows: any[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-ink/[0.06] bg-ink/[0.02] text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
            <Th>Code</Th><Th>Type</Th><Th>Amount</Th><Th>Applies to</Th><Th>Uses</Th><Th>Auto</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d, i) => (
            <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="border-b border-ink/[0.04] tabular-nums hover:bg-ink/[0.015]">
              <Td><span className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[11.5px] font-semibold text-ink">{d.code}</span></Td>
              <Td>{d.type}</Td>
              <Td>{d.type === "percent" ? `${d.amount}%` : `$${d.amount}`}</Td>
              <Td>{d.appliesTo}</Td>
              <Td>{d.uses}</Td>
              <Td>
                <button onClick={() => adminActions.updateBuildDiscount(d.id, { autoApply: !d.autoApply })}
                  className={`h-4 w-7 rounded-full transition ${d.autoApply ? "bg-check" : "bg-ink/15"} relative`}>
                  <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${d.autoApply ? "left-3.5" : "left-0.5"}`} />
                </button>
              </Td>
              <Td><StatusPill status={d.status} /></Td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Th({ children }: { children?: React.ReactNode }) { return <th className="px-3 py-2 text-left font-medium">{children}</th>; }
function Td({ children }: { children?: React.ReactNode }) { return <td className="px-3 py-2.5 text-ink/80">{children}</td>; }
