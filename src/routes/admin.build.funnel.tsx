import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AdminShell, Card, SectionTitle, Pill } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type FunnelBlock, type FunnelNode } from "@/lib/admin/store";
import { toast } from "sonner";
import { ArrowRight, Trash2, Plus, ExternalLink, Rocket } from "lucide-react";

export const Route = createFileRoute("/admin/build/funnel")({
  head: () => ({ meta: [{ title: "Funnel builder — PharmaBro" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: FunnelBuilder,
});

const NODE_META: Record<string, { url: string; tint: string }> = {
  quiz:         { url: "/intake/weight-loss",  tint: "#2563eb" },
  loading:      { url: "/intake?loading",      tint: "#7c3aed" },
  sales:        { url: "/weight-loss/sales",   tint: "#ee7273" },
  confirmation: { url: "/confirmation",        tint: "#10b981" },
  portal:       { url: "/portal/patient",      tint: "#0ea5e9" },
};

function FunnelBuilder() {
  const funnel = useAdmin((s) => s.build.funnel);
  const version = useAdmin((s) => s.build.funnelVersion);
  const tenant = useAdmin((s) => s.tenant);
  const [activeId, setActiveId] = useState<string>(funnel[0]?.id ?? "");
  const active = funnel.find((n) => n.id === activeId) ?? funnel[0];

  return (
    <AdminShell title="Funnel builder">
      <SectionTitle subtitle={`Visual patient journey for ${tenant.name} — click any block to edit`}
        action={
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-ink/45">v{version}</span>
            <button onClick={() => { adminActions.publishFunnel(); toast.success("Funnel published", { description: "Live version bumped." }); }}
              className="flex items-center gap-1.5 rounded-md bg-ink px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-ink/90">
              <Rocket className="h-3 w-3" /> Publish
            </button>
          </div>
        }
      >Funnel builder</SectionTitle>

      {/* Journey lane */}
      <div className="mb-5 overflow-x-auto rounded-2xl border border-ink/[0.08] bg-white p-4">
        <div className="flex min-w-max items-center gap-2">
          {funnel.map((n, i) => {
            const meta = NODE_META[n.type];
            const isActive = active?.id === n.id;
            return (
              <div key={n.id} className="flex items-center gap-2">
                <motion.button
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveId(n.id)}
                  className={`relative flex w-[180px] flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition ${
                    isActive ? "border-ink bg-ink/[0.02]" : "border-ink/[0.08] hover:border-ink/25"
                  }`}
                >
                  <span className="h-1 w-8 rounded-full" style={{ background: meta.tint }} />
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">{n.type}</div>
                  <div className="text-[13px] font-semibold text-ink">{n.title}</div>
                  <div className="text-[10.5px] text-ink/50">{n.blocks.length} block{n.blocks.length === 1 ? "" : "s"}</div>
                  <a href={meta.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                    className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-ink/45 hover:text-ink">
                    Preview <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </motion.button>
                {i < funnel.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink/25" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      {active && <NodeEditor node={active} />}
    </AdminShell>
  );
}

function NodeEditor({ node }: { node: FunnelNode }) {
  const [addKind, setAddKind] = useState<FunnelBlock["kind"]>("hero");
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">{node.type}</div>
          <div className="mt-0.5 font-hero text-[15px] font-semibold text-ink">{node.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <select value={addKind} onChange={(e) => setAddKind(e.target.value as FunnelBlock["kind"])}
            className="rounded-md border border-ink/[0.1] bg-white px-2 py-1 text-[11.5px] outline-none">
            <option value="hero">Hero</option>
            <option value="step">Step</option>
            <option value="plan-card">Plan card</option>
            <option value="cta">CTA</option>
            <option value="faq">FAQ</option>
            <option value="quiz-screen">Quiz screen</option>
          </select>
          <button onClick={() => { adminActions.addFunnelBlock(node.id, addKind); toast.success("Block added"); }}
            className="flex items-center gap-1 rounded-md border border-ink/[0.1] px-2.5 py-1 text-[11.5px] font-medium text-ink hover:border-ink/25">
            <Plus className="h-3 w-3" /> Add block
          </button>
        </div>
      </div>

      {node.blocks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/[0.12] p-6 text-center text-[12px] text-ink/45">
          No blocks yet — add one above.
        </div>
      ) : (
        <div className="space-y-2">
          {node.blocks.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-lg border border-ink/[0.08] bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill tone="info">{b.kind}</Pill>
                  <span className="text-[12.5px] font-semibold text-ink">{b.title}</span>
                </div>
                <button onClick={() => { adminActions.deleteFunnelBlock(node.id, b.id); toast("Block deleted"); }}
                  className="rounded-md p-1 text-ink/40 hover:bg-ink/5 hover:text-ever">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.keys(b.props).length === 0 && (
                  <div className="text-[11px] text-ink/40">No props on this block.</div>
                )}
                {Object.entries(b.props).map(([k, v]) => (
                  <label key={k} className="block text-[11px]">
                    <span className="mb-0.5 block font-medium uppercase tracking-[0.1em] text-ink/45">{k}</span>
                    <input value={v} onChange={(e) => adminActions.updateBlockProp(node.id, b.id, k, e.target.value)}
                      className="w-full rounded-md border border-ink/[0.1] bg-white px-2 py-1.5 text-[12.5px] outline-none focus:border-ink/25" />
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
