import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Send, Save } from "lucide-react";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand, useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/build/emails/$flowId")({
  head: () => ({ meta: [{ title: "Email flow — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: FlowDetail,
});

function FlowDetail() {
  const { flowId } = useParams({ from: "/pharmabro-admin/build/emails/$flowId" });
  const brand = useActiveBrand();
  const { emailFlows } = useActiveData();
  const flow = emailFlows.find((f) => f.id === flowId);
  const [selectedEmailId, setSelectedEmailId] = useState(flow?.emails[0]?.id ?? "");
  const email = flow?.emails.find((e) => e.id === selectedEmailId) ?? flow?.emails[0];

  if (!flow) return <div className="p-6 text-[13px] text-ink/60">Flow not found. <Link to="/pharmabro-admin/build/emails" className="underline">Back to flows</Link></div>;

  const updateEmail = (patch: Parameters<typeof pharmabroActions.updateEmailInFlow>[2]) =>
    email && pharmabroActions.updateEmailInFlow(flow.id, email.id, patch);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/pharmabro-admin/build/emails" className="inline-flex items-center gap-1 text-[12px] text-ink/55 hover:text-ink">
            <ChevronLeft className="h-3.5 w-3.5" /> All flows
          </Link>
          <h1 className="mt-1 text-[22px] font-bold text-ink">{flow.name}</h1>
          <div className="mt-1 flex gap-2 text-[11.5px] text-ink/55">
            <span>Trigger: <b className="text-ink/80">{flow.trigger}</b></span>
            <span>Exit: <b className="text-ink/80">{flow.exitCondition}</b></span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => { pharmabroActions.syncFlowToKlaviyo(flow.id); toast.success("Synced to Klaviyo"); }}
            className="rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/70">Sync to Klaviyo</button>
          <BrandButton onClick={() => { pharmabroActions.updateEmailFlow(flow.id, { status: "live" }); toast.success("Flow published"); }}>Publish</BrandButton>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr_320px]">
        {/* Timeline */}
        <Card className="p-3">
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Sequence</div>
          <div className="space-y-1">
            {flow.emails.map((e, i) => (
              <button key={e.id} onClick={() => setSelectedEmailId(e.id)}
                className={`flex w-full items-start gap-2 rounded-lg border p-2 text-left text-[12px] transition ${selectedEmailId === e.id ? "border-ink/25 bg-ink/[0.03]" : "border-transparent hover:bg-ink/[0.02]"}`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                  style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-ink">{e.subject}</div>
                  <div className="text-[10.5px] text-ink/50">After {e.delayLabel}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Preview */}
        <Card className="max-h-[calc(100vh-220px)] overflow-y-auto bg-[#f4f4f2] p-6">
          {email && (
            <div className="mx-auto max-w-[380px] rounded-3xl border border-ink/10 bg-white p-6 shadow-lg">
              <div className="mb-2 border-b border-ink/8 pb-3 text-[11px] text-ink/50">
                <div><b className="text-ink">From:</b> {email.fromName || brand.name} &lt;{email.fromEmail || `care@${brand.slug}.com`}&gt;</div>
                <div><b className="text-ink">Subject:</b> {email.subject}</div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: email.body }} className="prose prose-sm max-w-none text-[13px] text-ink/80" />
            </div>
          )}
        </Card>

        {/* Settings */}
        <Card className="max-h-[calc(100vh-220px)] overflow-y-auto p-4">
          {email && (
            <div className="space-y-3">
              <F label="Subject line"><Inp value={email.subject} onChange={(v) => updateEmail({ subject: v })} /></F>
              <F label="Preview text"><Inp value={email.previewText} onChange={(v) => updateEmail({ previewText: v })} /></F>
              <F label="From name"><Inp value={email.fromName ?? brand.name} onChange={(v) => updateEmail({ fromName: v })} /></F>
              <F label="From email"><Inp value={email.fromEmail ?? `care@${brand.slug}.com`} onChange={(v) => updateEmail({ fromEmail: v })} /></F>
              <F label="Send delay"><Inp value={email.delayLabel} onChange={(v) => updateEmail({ delayLabel: v })} /></F>
              <F label="Body (HTML)">
                <textarea value={email.body} onChange={(e) => updateEmail({ body: e.target.value })}
                  rows={8} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 font-mono text-[11.5px]" />
              </F>
              <div className="rounded-lg border border-ink/8 bg-[#faf9f6] p-2.5 text-[11px] text-ink/60">
                <b className="text-ink/80">Personalization tokens:</b><br />
                {"{{first_name}}"} {"{{goal_weight}}"} {"{{plan_selected}}"}<br />
                {"{{plan_price}}"} {"{{billing_date}}"} {"{{card_last_four}}"}<br />
                {"{{physician_name}}"} {"{{tracking_number}}"}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => toast.success("Test email queued")} className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ink/70">
                  <Send className="h-3 w-3" /> Test send
                </button>
                <BrandButton onClick={() => toast.success("Email saved")}><Save className="h-3 w-3" /> Save</BrandButton>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">{label}</span>{children}</label>;
}
function Inp({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px] outline-none focus:border-ink/40" />;
}
