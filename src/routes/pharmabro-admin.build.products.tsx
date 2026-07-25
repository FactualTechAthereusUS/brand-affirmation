import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Archive, X, Package as PackageIcon, ShoppingBag, Tag, Percent } from "lucide-react";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveData, type Product, type Plan, type Upsell, type Discount } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/build/products")({
  head: () => ({ meta: [{ title: "Products & pricing — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: ProductsPage,
});

type Tab = "products" | "plans" | "upsells" | "discounts";

function ProductsPage() {
  const [tab, setTab] = useState<Tab>("products");
  const data = useActiveData();

  return (
    <div className="space-y-4">
      <PageHeader title="Products & pricing" subtitle="What you sell and at what price." />

      <div className="flex gap-1 rounded-lg border border-ink/[0.08] bg-white p-1">
        {([
          ["products", "Products", PackageIcon, data.products.length],
          ["plans", "Plans", ShoppingBag, data.plans.length],
          ["upsells", "Upsells", Tag, data.upsells.length],
          ["discounts", "Discounts", Percent, data.discounts.length],
        ] as const).map(([id, label, Icon, count]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition ${
              tab === id ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/5"
            }`}>
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span className={`rounded-full px-1.5 text-[10px] ${tab === id ? "bg-white/20" : "bg-ink/8"}`}>{count}</span>
          </button>
        ))}
      </div>

      {tab === "products" && <ProductsTab />}
      {tab === "plans" && <PlansTab />}
      {tab === "upsells" && <UpsellsTab />}
      {tab === "discounts" && <DiscountsTab />}
    </div>
  );
}

/* ---------------- Products ---------------- */
function ProductsTab() {
  const { products } = useActiveData();
  const [editing, setEditing] = useState<Product | null>(null);

  const newProduct = (): Product => ({
    id: `prod_${Date.now()}`, displayName: "", internalName: "", molecule: "Semaglutide",
    form: "Injectable", primaryPharmacy: "South End", titrationProtocol: "Standard sema 6-month",
    description: "", badge: "", patientCountLabel: "", status: "draft",
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/6 p-3">
        <div className="text-[13px] font-semibold text-ink/70">Active products</div>
        <BrandButton onClick={() => setEditing(newProduct())}><Plus className="h-3.5 w-3.5" /> Add product</BrandButton>
      </div>
      <table className="w-full text-[13px]">
        <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
          <tr>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2 hidden md:table-cell">Molecule</th>
            <th className="px-3 py-2 hidden md:table-cell">Form</th>
            <th className="px-3 py-2 hidden lg:table-cell">Pharmacy</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 w-28 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/6">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-ink/[0.02]">
              <td className="px-3 py-2.5">
                <div className="font-semibold text-ink">{p.displayName}</div>
                <div className="text-[11px] text-ink/50">{p.badge}</div>
              </td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70">{p.molecule}</td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70">{p.form}</td>
              <td className="px-3 py-2.5 hidden lg:table-cell text-ink/70">{p.primaryPharmacy}</td>
              <td className="px-3 py-2.5">
                <Pill tone={p.status === "live" ? "success" : p.status === "draft" ? "warn" : "neutral"}>{p.status}</Pill>
              </td>
              <td className="px-3 py-2.5 text-right">
                <button onClick={() => setEditing(p)} className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-ink/30">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                {p.status !== "archived" && (
                  <button onClick={() => { pharmabroActions.archiveProduct(p.id); toast("Product archived"); }}
                    className="ml-1 inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-rose-300 hover:text-rose-600">
                    <Archive className="h-3 w-3" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && <ProductEditor value={editing} onClose={() => setEditing(null)} onSave={(p) => { pharmabroActions.saveProduct(p); toast.success("Product saved"); setEditing(null); }} />}
    </Card>
  );
}

function ProductEditor({ value, onClose, onSave }: { value: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState<Product>(value);
  return (
    <Sheet title={value.id.startsWith("prod_new") || !value.displayName ? "New product" : "Edit product"} onClose={onClose}>
      <FormGrid>
        <Field label="Display name (patient-facing)"><Input value={p.displayName} onChange={(v) => setP({ ...p, displayName: v })} /></Field>
        <Field label="Internal name"><Input value={p.internalName} onChange={(v) => setP({ ...p, internalName: v })} /></Field>
        <Field label="Molecule"><Select value={p.molecule} onChange={(v) => setP({ ...p, molecule: v })} options={["Semaglutide", "Tirzepatide", "NAD+", "Sermorelin", "Tadalafil", "Sildenafil"]} /></Field>
        <Field label="Form"><Select value={p.form} onChange={(v) => setP({ ...p, form: v })} options={["Injectable", "Oral ODT", "Oral Capsule", "Topical", "Sublingual"]} /></Field>
        <Field label="Primary pharmacy"><Select value={p.primaryPharmacy} onChange={(v) => setP({ ...p, primaryPharmacy: v })} options={["South End", "Valiant", "Strive", "WellsRx", "Epiq"]} /></Field>
        <Field label="Backup pharmacy"><Select value={p.backupPharmacy ?? ""} onChange={(v) => setP({ ...p, backupPharmacy: v || undefined })} options={["", "South End", "Valiant", "Strive", "WellsRx", "Epiq"]} /></Field>
        <Field label="Starter LifeFile ID"><Input value={p.starterLifeFileId ?? ""} onChange={(v) => setP({ ...p, starterLifeFileId: v })} /></Field>
        <Field label="Maintenance LifeFile ID"><Input value={p.maintenanceLifeFileId ?? ""} onChange={(v) => setP({ ...p, maintenanceLifeFileId: v })} /></Field>
        <Field label="Titration protocol" span={2}><Select value={p.titrationProtocol} onChange={(v) => setP({ ...p, titrationProtocol: v })} options={["Standard sema 6-month", "Standard tirz 6-month", "Oral titration", "Custom"]} /></Field>
        <Field label="Description (sales page)" span={2}><Input value={p.description} onChange={(v) => setP({ ...p, description: v })} /></Field>
        <Field label="Badge"><Input value={p.badge} onChange={(v) => setP({ ...p, badge: v })} /></Field>
        <Field label="Status"><Select value={p.status} onChange={(v) => setP({ ...p, status: v as Product["status"] })} options={["draft", "live", "archived"]} /></Field>
        <Field label="Patient-count callout" span={2}><Input value={p.patientCountLabel} onChange={(v) => setP({ ...p, patientCountLabel: v })} /></Field>
      </FormGrid>
      <SheetFooter onClose={onClose} onSave={() => onSave(p)} />
    </Sheet>
  );
}

/* ---------------- Plans ---------------- */
function PlansTab() {
  const { plans, products } = useActiveData();
  const [editing, setEditing] = useState<Plan | null>(null);
  const productName = (id: string) => products.find((p) => p.id === id)?.displayName ?? id;
  const newPlan = (): Plan => ({
    id: `plan_${Date.now()}`, internalName: "", displayName: "", productId: products[0]?.id ?? "",
    durationLabel: "Monthly", durationDays: 28, firstPriceCents: 24900, ongoingPriceCents: 29900,
    supplyLabel: "4 Week Supply", preSelected: false, status: "draft",
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/6 p-3">
        <div className="text-[13px] font-semibold text-ink/70">Plans</div>
        <BrandButton onClick={() => setEditing(newPlan())}><Plus className="h-3.5 w-3.5" /> Add plan</BrandButton>
      </div>
      <table className="w-full text-[13px]">
        <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
          <tr>
            <th className="px-3 py-2">Plan</th>
            <th className="px-3 py-2 hidden md:table-cell">Product</th>
            <th className="px-3 py-2">Duration</th>
            <th className="px-3 py-2">First</th>
            <th className="px-3 py-2 hidden md:table-cell">Ongoing</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 w-20 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/6">
          {plans.map((p) => (
            <tr key={p.id} className="hover:bg-ink/[0.02]">
              <td className="px-3 py-2.5">
                <div className="font-semibold text-ink">{p.internalName}</div>
                <div className="text-[11px] text-ink/50">{p.badge}</div>
              </td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70">{productName(p.productId)}</td>
              <td className="px-3 py-2.5 text-ink/70">{p.durationLabel}</td>
              <td className="px-3 py-2.5 font-semibold text-ink">${(p.firstPriceCents / 100).toFixed(0)}</td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70">${(p.ongoingPriceCents / 100).toFixed(0)}</td>
              <td className="px-3 py-2.5"><Pill tone={p.status === "live" ? "success" : "warn"}>{p.status}</Pill></td>
              <td className="px-3 py-2.5 text-right">
                <button onClick={() => setEditing(p)} className="rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-ink/30"><Pencil className="h-3 w-3" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && <PlanEditor value={editing} products={products} onClose={() => setEditing(null)} onSave={(p) => { pharmabroActions.savePlan(p); toast.success("Plan saved · Stripe product synced"); setEditing(null); }} />}
    </Card>
  );
}

function PlanEditor({ value, products, onClose, onSave }: { value: Plan; products: Product[]; onClose: () => void; onSave: (p: Plan) => void }) {
  const [p, setP] = useState<Plan>(value);
  const perMonth = p.durationDays > 0 ? Math.round(p.firstPriceCents / (p.durationDays / 28)) : 0;
  return (
    <Sheet title="Plan" onClose={onClose}>
      <FormGrid>
        <Field label="Internal name"><Input value={p.internalName} onChange={(v) => setP({ ...p, internalName: v })} /></Field>
        <Field label="Display name"><Input value={p.displayName} onChange={(v) => setP({ ...p, displayName: v })} /></Field>
        <Field label="Product"><Select value={p.productId} onChange={(v) => setP({ ...p, productId: v })} options={products.map((x) => x.id)} labels={products.map((x) => x.displayName)} /></Field>
        <Field label="Duration"><Select value={p.durationLabel} onChange={(v) => setP({ ...p, durationLabel: v, durationDays: v === "Monthly" ? 28 : v === "3-Month" ? 84 : 168 })} options={["Monthly", "3-Month", "6-Month"]} /></Field>
        <Field label="First price ($)"><Input type="number" value={String(p.firstPriceCents / 100)} onChange={(v) => setP({ ...p, firstPriceCents: Math.round(Number(v) * 100) })} /></Field>
        <Field label="Ongoing price ($)"><Input type="number" value={String(p.ongoingPriceCents / 100)} onChange={(v) => setP({ ...p, ongoingPriceCents: Math.round(Number(v) * 100) })} /></Field>
        <Field label="Per-month display"><Input readOnly value={`$${(perMonth / 100).toFixed(0)}/mo`} /></Field>
        <Field label="Supply label"><Input value={p.supplyLabel} onChange={(v) => setP({ ...p, supplyLabel: v })} /></Field>
        <Field label="Badge"><Input value={p.badge ?? ""} onChange={(v) => setP({ ...p, badge: v })} /></Field>
        <Field label="Savings callout"><Input value={p.savingsCallout ?? ""} onChange={(v) => setP({ ...p, savingsCallout: v })} /></Field>
        <Field label="BNPL text" span={2}><Input value={p.bnplText ?? ""} onChange={(v) => setP({ ...p, bnplText: v })} /></Field>
        <Field label="Stripe product ID"><Input readOnly value={p.stripeProductId ?? "(auto on save)"} /></Field>
        <Field label="Pre-selected default">
          <label className="flex items-center gap-2 text-[12.5px] text-ink/70">
            <input type="checkbox" checked={p.preSelected} onChange={(e) => setP({ ...p, preSelected: e.target.checked })} />
            Show as pre-selected on plan page
          </label>
        </Field>
        <Field label="Status"><Select value={p.status} onChange={(v) => setP({ ...p, status: v as Plan["status"] })} options={["draft", "live"]} /></Field>
      </FormGrid>
      <SheetFooter onClose={onClose} onSave={() => onSave(p)} />
    </Sheet>
  );
}

/* ---------------- Upsells ---------------- */
function UpsellsTab() {
  const { upsells } = useActiveData();
  const [editing, setEditing] = useState<Upsell | null>(null);
  const newUpsell = (): Upsell => ({
    id: `up_${Date.now()}`, internalName: "", displayName: "", description: "",
    priceCents: 4995, type: "one_time", position: "checkout", displayOrder: 1, status: "draft",
  });
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/6 p-3">
        <div className="text-[13px] font-semibold text-ink/70">Upsells & bumps</div>
        <BrandButton onClick={() => setEditing(newUpsell())}><Plus className="h-3.5 w-3.5" /> Add upsell</BrandButton>
      </div>
      <table className="w-full text-[13px]">
        <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
          <tr>
            <th className="px-3 py-2">Upsell</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2 hidden md:table-cell">Type</th>
            <th className="px-3 py-2 hidden md:table-cell">Position</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 w-20 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/6">
          {upsells.map((u) => (
            <tr key={u.id}>
              <td className="px-3 py-2.5">
                <div className="font-semibold text-ink">{u.displayName || u.internalName}</div>
                <div className="text-[11px] text-ink/50">{u.description}</div>
              </td>
              <td className="px-3 py-2.5 font-semibold">${(u.priceCents / 100).toFixed(2)}{u.type === "recurring" ? "/mo" : ""}</td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70 capitalize">{u.type.replace("_", " ")}</td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70 capitalize">{u.position.replace("_", " ")}</td>
              <td className="px-3 py-2.5"><Pill tone={u.status === "live" ? "success" : "warn"}>{u.status}</Pill></td>
              <td className="px-3 py-2.5 text-right">
                <button onClick={() => setEditing(u)} className="rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70"><Pencil className="h-3 w-3" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <Sheet title="Upsell" onClose={() => setEditing(null)}>
          <FormGrid>
            <Field label="Internal name"><Input value={editing.internalName} onChange={(v) => setEditing({ ...editing, internalName: v })} /></Field>
            <Field label="Display name"><Input value={editing.displayName} onChange={(v) => setEditing({ ...editing, displayName: v })} /></Field>
            <Field label="Description" span={2}><Input value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} /></Field>
            <Field label="Price ($)"><Input type="number" value={String(editing.priceCents / 100)} onChange={(v) => setEditing({ ...editing, priceCents: Math.round(Number(v) * 100) })} /></Field>
            <Field label="Type"><Select value={editing.type} onChange={(v) => setEditing({ ...editing, type: v as Upsell["type"] })} options={["one_time", "recurring"]} /></Field>
            <Field label="Position"><Select value={editing.position} onChange={(v) => setEditing({ ...editing, position: v as Upsell["position"] })} options={["checkout", "post_buy"]} /></Field>
            <Field label="Order"><Input type="number" value={String(editing.displayOrder)} onChange={(v) => setEditing({ ...editing, displayOrder: Number(v) })} /></Field>
            <Field label="Scarcity text" span={2}><Input value={editing.scarcityText ?? ""} onChange={(v) => setEditing({ ...editing, scarcityText: v })} /></Field>
            <Field label="Status"><Select value={editing.status} onChange={(v) => setEditing({ ...editing, status: v as Upsell["status"] })} options={["draft", "live"]} /></Field>
          </FormGrid>
          <SheetFooter onClose={() => setEditing(null)} onSave={() => { pharmabroActions.saveUpsell(editing); toast.success("Upsell saved"); setEditing(null); }} />
        </Sheet>
      )}
    </Card>
  );
}

/* ---------------- Discounts ---------------- */
function DiscountsTab() {
  const { discounts, plans } = useActiveData();
  const [editing, setEditing] = useState<Discount | null>(null);
  const newDiscount = (): Discount => ({
    id: `disc_${Date.now()}`, code: "", type: "fixed", amountCents: 0, appliesToPlanId: "any",
    usageLimit: null, usesCount: 0, autoApply: false, status: "draft",
  });
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/6 p-3">
        <div className="text-[13px] font-semibold text-ink/70">Discount codes</div>
        <BrandButton onClick={() => setEditing(newDiscount())}><Plus className="h-3.5 w-3.5" /> Create discount</BrandButton>
      </div>
      <table className="w-full text-[13px]">
        <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
          <tr>
            <th className="px-3 py-2">Code</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2 hidden md:table-cell">Applies to</th>
            <th className="px-3 py-2 hidden md:table-cell">Uses</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 w-20 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/6">
          {discounts.map((d) => (
            <tr key={d.id}>
              <td className="px-3 py-2.5"><span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[11.5px] font-bold">{d.code}</span></td>
              <td className="px-3 py-2.5 text-ink/70 capitalize">{d.type.replace("_", " ")}</td>
              <td className="px-3 py-2.5 font-semibold">{d.type === "percent" ? `${d.percent}%` : `$${(d.amountCents / 100).toFixed(2)}`}</td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/60">{d.appliesToPlanId === "any" ? "Any plan" : plans.find((p) => p.id === d.appliesToPlanId)?.internalName ?? d.appliesToPlanId}</td>
              <td className="px-3 py-2.5 hidden md:table-cell text-ink/70">{d.usesCount}{d.usageLimit ? ` / ${d.usageLimit}` : ""}</td>
              <td className="px-3 py-2.5"><Pill tone={d.status === "live" ? "success" : "warn"}>{d.status}</Pill></td>
              <td className="px-3 py-2.5 text-right"><button onClick={() => setEditing(d)} className="rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70"><Pencil className="h-3 w-3" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <Sheet title="Discount" onClose={() => setEditing(null)}>
          <FormGrid>
            <Field label="Code"><Input value={editing.code} onChange={(v) => setEditing({ ...editing, code: v.toUpperCase() })} /></Field>
            <Field label="Type"><Select value={editing.type} onChange={(v) => setEditing({ ...editing, type: v as Discount["type"] })} options={["fixed", "percent", "free_ship", "first_order", "win_back"]} /></Field>
            {editing.type === "percent" ? (
              <Field label="Percent off (%)"><Input type="number" value={String(editing.percent ?? 0)} onChange={(v) => setEditing({ ...editing, percent: Number(v) })} /></Field>
            ) : (
              <Field label="Amount off ($)"><Input type="number" value={String(editing.amountCents / 100)} onChange={(v) => setEditing({ ...editing, amountCents: Math.round(Number(v) * 100) })} /></Field>
            )}
            <Field label="Applies to plan">
              <Select value={String(editing.appliesToPlanId ?? "any")} onChange={(v) => setEditing({ ...editing, appliesToPlanId: v })}
                options={["any", ...plans.map((p) => p.id)]}
                labels={["Any plan", ...plans.map((p) => p.internalName)]}
              />
            </Field>
            <Field label="Usage limit"><Input type="number" value={editing.usageLimit == null ? "" : String(editing.usageLimit)} onChange={(v) => setEditing({ ...editing, usageLimit: v === "" ? null : Number(v) })} /></Field>
            <Field label="Auto-apply at checkout">
              <label className="flex items-center gap-2 text-[12.5px] text-ink/70">
                <input type="checkbox" checked={editing.autoApply} onChange={(e) => setEditing({ ...editing, autoApply: e.target.checked })} />
                Yes — no code entry needed
              </label>
            </Field>
            <Field label="Status"><Select value={editing.status} onChange={(v) => setEditing({ ...editing, status: v as Discount["status"] })} options={["draft", "live"]} /></Field>
          </FormGrid>
          <SheetFooter onClose={() => setEditing(null)} onSave={() => { pharmabroActions.saveDiscount(editing); toast.success("Discount saved"); setEditing(null); }} />
        </Sheet>
      )}
    </Card>
  );
}

/* ---------------- Shared editor primitives ---------------- */
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-ink/8 p-4">
          <div className="text-[15px] font-bold text-ink">{title}</div>
          <button onClick={onClose} className="rounded-md p-1.5 text-ink/50 hover:bg-ink/5"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
function SheetFooter({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-ink/8 pt-4">
      <button onClick={onClose} className="rounded-full border border-ink/12 bg-white px-4 py-1.5 text-[12.5px] font-semibold text-ink/70">Cancel</button>
      <BrandButton onClick={onSave}>Save</BrandButton>
    </div>
  );
}
function FormGrid({ children }: { children: React.ReactNode }) { return <div className="grid gap-3 sm:grid-cols-2">{children}</div>; }
function Field({ label, span = 1, children }: { label: string; span?: 1 | 2; children: React.ReactNode }) {
  return (
    <label className={`block ${span === 2 ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">{label}</span>
      {children}
    </label>
  );
}
function Input({ value, onChange, type = "text", readOnly }: { value: string; onChange?: (v: string) => void; type?: "text" | "number"; readOnly?: boolean }) {
  return <input type={type} value={value} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)}
    className={`w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-ink/40 ${readOnly ? "bg-ink/[0.03] text-ink/50" : ""}`} />;
}
function Select({ value, onChange, options, labels }: { value: string; onChange: (v: string) => void; options: string[]; labels?: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-ink/40">
      {options.map((o, i) => <option key={o} value={o}>{labels?.[i] ?? o.replace("_", " ")}</option>)}
    </select>
  );
}
