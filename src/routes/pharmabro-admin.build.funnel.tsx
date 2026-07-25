import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, ChevronDown, Plus, Trash2, Eye, Save, History, Rocket, Monitor, Smartphone } from "lucide-react";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand, useActiveData, type FunnelBlock, type FunnelPage } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/build/funnel")({
  head: () => ({ meta: [{ title: "Funnel builder — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: FunnelBuilder,
});

function FunnelBuilder() {
  const brand = useActiveBrand();
  const { funnel, plans } = useActiveData();
  const [selectedPageId, setSelectedPageId] = useState(funnel.draft[0]?.id ?? "");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");
  const [showHistory, setShowHistory] = useState(false);

  const page = funnel.draft.find((p) => p.id === selectedPageId) ?? funnel.draft[0];
  const block = page?.blocks.find((b) => b.id === selectedBlockId) ?? null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">Funnel builder</h1>
          <p className="text-[12.5px] text-ink/55">Your patient acquisition funnel — edit everything, drag-drop, no code.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowHistory(true)} className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/70 hover:border-ink/30"><History className="h-3.5 w-3.5" /> History</button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/70 hover:border-ink/30"><Eye className="h-3.5 w-3.5" /> Preview</button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/70"><Save className="h-3.5 w-3.5" /> Save draft</button>
          <BrandButton onClick={() => { if (confirm("Publish these changes to your live funnel?")) { pharmabroActions.publishFunnel(); toast.success("Funnel published — live now"); } }}>
            <Rocket className="h-3.5 w-3.5" /> Publish
          </BrandButton>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[280px_1fr_320px]">
        {/* Left: page tree */}
        <Card className="max-h-[calc(100vh-160px)] overflow-y-auto p-3">
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Pages</div>
          <div className="space-y-1">
            {funnel.draft.map((pg) => (
              <PageNode key={pg.id} page={pg} active={pg.id === selectedPageId}
                selectedBlockId={selectedBlockId}
                onSelect={() => { setSelectedPageId(pg.id); setSelectedBlockId(null); }}
                onSelectBlock={(bid) => { setSelectedPageId(pg.id); setSelectedBlockId(bid); }}
              />
            ))}
          </div>
        </Card>

        {/* Center: canvas */}
        <Card className="max-h-[calc(100vh-160px)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/6 px-3 py-2">
            <div className="text-[12px] font-semibold text-ink/70">{page?.name ?? "—"}</div>
            <div className="flex gap-1 rounded-lg border border-ink/12 bg-white p-0.5">
              <button onClick={() => setViewport("mobile")} className={`rounded p-1 ${viewport === "mobile" ? "bg-ink text-white" : "text-ink/50"}`}><Smartphone className="h-3.5 w-3.5" /></button>
              <button onClick={() => setViewport("desktop")} className={`rounded p-1 ${viewport === "desktop" ? "bg-ink text-white" : "text-ink/50"}`}><Monitor className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto bg-[#f4f4f2] p-6">
            <div className="mx-auto rounded-2xl border border-ink/10 bg-white shadow-lg overflow-hidden"
              style={{ width: viewport === "mobile" ? 375 : "100%", maxWidth: viewport === "desktop" ? 900 : undefined }}>
              {page?.blocks.map((b, i) => (
                <div key={b.id} onClick={() => setSelectedBlockId(b.id)}
                  className={`group relative cursor-pointer border-b border-ink/5 last:border-b-0 ${selectedBlockId === b.id ? "ring-2 ring-inset" : "hover:bg-ink/[0.02]"}`}
                  style={selectedBlockId === b.id ? { boxShadow: `inset 0 0 0 2px ${brand.theme.primary}` } : undefined}
                >
                  <BlockPreview block={b} brand={brand} plans={plans} />
                  <button onClick={(e) => { e.stopPropagation(); if (confirm("Remove this block?")) { pharmabroActions.removeFunnelBlock(page.id, b.id); setSelectedBlockId(null); toast("Block removed"); } }}
                    className="absolute right-2 top-2 hidden rounded-full bg-white p-1 shadow group-hover:block"><Trash2 className="h-3 w-3 text-rose-500" /></button>
                </div>
              ))}
              <div className="p-3">
                <button onClick={() => { if (page) pharmabroActions.addFunnelBlock(page.id, "text"); }}
                  className="w-full rounded-lg border border-dashed border-ink/20 py-2 text-[12px] font-semibold text-ink/50 hover:border-ink/40">
                  + Add block
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: inspector */}
        <Card className="max-h-[calc(100vh-160px)] overflow-y-auto p-4">
          {block && page ? (
            <BlockInspector page={page} block={block} />
          ) : (
            <div className="grid h-full place-items-center text-center text-[12px] text-ink/45">
              <div>
                <div className="mb-1 font-semibold text-ink/60">No block selected</div>
                Click any element on the canvas to edit it.
              </div>
            </div>
          )}
        </Card>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setShowHistory(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-[15px] font-bold">Publish history</div>
            <div className="space-y-1.5">
              {funnel.history.map((h) => (
                <div key={h.ts} className="flex items-center justify-between rounded-lg border border-ink/8 p-2.5 text-[12.5px]">
                  <div>
                    <div className="font-semibold text-ink">{new Date(h.ts).toLocaleString()}</div>
                    <div className="text-[11px] text-ink/50">{h.note}</div>
                  </div>
                  <button onClick={() => { pharmabroActions.rollbackFunnel(h.ts); toast.success("Rolled back"); setShowHistory(false); }}
                    className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-white">Rollback</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageNode({ page, active, selectedBlockId, onSelect, onSelectBlock }: { page: FunnelPage; active: boolean; selectedBlockId: string | null; onSelect: () => void; onSelectBlock: (id: string) => void }) {
  const [open, setOpen] = useState(active);
  const brand = useActiveBrand();
  return (
    <div>
      <button onClick={() => { setOpen((v) => !v); onSelect(); }}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[12.5px] font-semibold ${active ? "" : "text-ink/70 hover:bg-ink/5"}`}
        style={active ? { background: `color-mix(in oklab, ${brand.theme.primary} 10%, transparent)`, color: brand.theme.primary } : undefined}
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span className="flex-1 truncate">{page.name}</span>
        <span className="rounded-full bg-ink/8 px-1.5 text-[10px] text-ink/60">{page.blocks.length}</span>
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-ink/8 pl-2">
          {page.blocks.map((b) => (
            <button key={b.id} onClick={() => onSelectBlock(b.id)}
              className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[11.5px] ${selectedBlockId === b.id ? "bg-ink/5 font-semibold text-ink" : "text-ink/55 hover:bg-ink/5 hover:text-ink"}`}>
              <span className="h-1 w-1 rounded-full bg-ink/25" />
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BlockPreview({ block, brand, plans }: { block: FunnelBlock; brand: ReturnType<typeof useActiveBrand>; plans: ReturnType<typeof useActiveData>["plans"] }) {
  const p = block.props as Record<string, string | string[]>;
  switch (block.type) {
    case "hero":
      return (
        <div className="px-6 py-10 text-center" style={{ background: `color-mix(in oklab, ${brand.theme.primary} 8%, white)` }}>
          <div className="text-[20px] font-bold text-ink">{p.headline || "Headline"}</div>
          <div className="mt-2 text-[13px] text-ink/60">{p.sub || "Sub-headline"}</div>
          <button className="mt-4 rounded-full px-6 py-2.5 text-[13px] font-semibold" style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>{p.cta || "Continue"}</button>
        </div>
      );
    case "plan-card": {
      const plan = plans.find((pp) => pp.id === p.planId);
      if (!plan) return <div className="p-4 text-[12px] text-ink/50">Select a plan in the inspector</div>;
      return (
        <div className="mx-4 my-3 rounded-xl border-2 p-4" style={{ borderColor: plan.preSelected ? brand.theme.primary : "rgb(23 23 23 / 0.08)" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[15px] font-bold">{plan.displayName}</div>
              <div className="text-[11px] text-ink/55">{plan.supplyLabel}</div>
            </div>
            {plan.badge && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>{plan.badge}</span>}
          </div>
          <div className="mt-2 text-[22px] font-bold">${(plan.firstPriceCents / 100).toFixed(0)}</div>
          <div className="text-[11px] text-ink/50">{plan.savingsCallout}</div>
        </div>
      );
    }
    case "quiz-screen":
      return <div className="p-6 text-center text-[13px] text-ink/70">Quiz screen preview</div>;
    case "features":
      return (
        <div className="px-6 py-6">
          <div className="text-[14px] font-bold text-ink">How it works</div>
          <ul className="mt-2 space-y-1 text-[12.5px] text-ink/70">
            {(Array.isArray(p.items) ? p.items : ["Step 1", "Step 2", "Step 3"]).map((x, i) => <li key={i}>• {x}</li>)}
          </ul>
        </div>
      );
    case "faq":
      return <div className="p-6 text-[13px] text-ink/60">FAQ block</div>;
    case "testimonials":
      return <div className="p-6 text-[13px] text-ink/60">Testimonials block</div>;
    case "cta":
      return <div className="p-6 text-center"><button className="rounded-full px-6 py-2.5 text-[13px] font-semibold" style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>{(p.text as string) || "CTA"}</button></div>;
    case "image":
      return <div className="grid h-40 place-items-center bg-ink/5 text-[11px] text-ink/40">[ image placeholder ]</div>;
    default:
      return <div className="p-4 text-[13px] text-ink/70">{(p.text as string) || block.label}</div>;
  }
}

function BlockInspector({ page, block }: { page: FunnelPage; block: FunnelBlock }) {
  const { plans } = useActiveData();
  const props = block.props as Record<string, string>;
  const set = (k: string, v: string) => pharmabroActions.updateFunnelBlock(page.id, block.id, { [k]: v });
  return (
    <div>
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">Block</div>
        <div className="text-[15px] font-bold text-ink">{block.label}</div>
        <Pill tone="info">{block.type}</Pill>
      </div>
      <div className="space-y-3">
        {block.type === "hero" && (
          <>
            <FieldSm label="Headline"><InputSm value={props.headline ?? ""} onChange={(v) => set("headline", v)} /></FieldSm>
            <FieldSm label="Sub-headline"><InputSm value={props.sub ?? ""} onChange={(v) => set("sub", v)} /></FieldSm>
            <FieldSm label="CTA text"><InputSm value={props.cta ?? ""} onChange={(v) => set("cta", v)} /></FieldSm>
          </>
        )}
        {block.type === "plan-card" && (
          <FieldSm label="Plan">
            <select value={props.planId ?? ""} onChange={(e) => set("planId", e.target.value)}
              className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px]">
              <option value="">— Choose plan —</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.internalName}</option>)}
            </select>
          </FieldSm>
        )}
        {block.type === "cta" && (
          <FieldSm label="Button text"><InputSm value={props.text ?? ""} onChange={(v) => set("text", v)} /></FieldSm>
        )}
        {block.type === "text" && (
          <FieldSm label="Content"><InputSm value={props.text ?? ""} onChange={(v) => set("text", v)} /></FieldSm>
        )}
      </div>
    </div>
  );
}

function FieldSm({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">{label}</span>{children}</label>;
}
function InputSm({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px] outline-none focus:border-ink/40" />;
}
