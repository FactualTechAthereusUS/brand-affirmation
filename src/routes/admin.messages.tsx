import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, Send, Stethoscope } from "lucide-react";
import { AdminShell, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import { adminActions, PROGRAMS, useAdmin, type Conversation } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const convos = useAdmin((s) => s.conversations);
  const activeId = useAdmin((s) => s.ui.activeConvoId);
  const active = convos.find((c) => c.id === activeId) || convos[0];
  const [tab, setTab] = useState<"all" | "unassigned" | "mine">("all");
  const filtered = convos.filter((c) => tab === "unassigned" ? c.status === "unassigned" : tab === "mine" ? c.assignedTo === "Andre F." : true);

  return (
    <AdminShell title="Unified inbox">
      <div className="grid gap-3 lg:grid-cols-[320px_1fr_320px] h-[calc(100vh-140px)] min-h-[560px]">
        {/* Convo list */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white">
          <div className="flex border-b border-ink/8 text-[12px]">
            {(["all", "unassigned", "mine"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 font-semibold ${tab === t ? "border-b-2 border-ever text-ink" : "text-ink/50"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => adminActions.setActiveConvo(c.id)}
                className={`flex w-full items-start gap-3 border-b border-ink/6 p-3 text-left last:border-0 ${active?.id === c.id ? "bg-ever/6" : "hover:bg-ink/4"}`}>
                <div className="relative">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-blush/25 text-[12px] font-semibold text-ink">
                    {c.patientName.split(" ").map(s => s[0]).join("").slice(0, 2)}
                  </div>
                  {c.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-ever ring-2 ring-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[13px] font-semibold text-ink">{c.patientName}</div>
                    <div className="shrink-0 text-[10.5px] uppercase tracking-[0.1em] text-ink/40">{fmtRel(c.updatedAt)}</div>
                  </div>
                  <div className="truncate text-[11.5px] text-ink/60">{c.preview}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <ChannelIcon ch={c.channel} />
                    <StatusPill tone={c.status === "closed" ? "neutral" : c.status === "physician" ? "info" : c.status === "support" ? "success" : "warn"}>{c.status}</StatusPill>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        {active && <Thread key={active.id} convo={active} />}

        {/* Sidebar */}
        {active && (
          <div className="space-y-3 overflow-y-auto min-h-0">
            <div className="rounded-2xl border border-ink/8 bg-white p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Patient</div>
              <div className="mt-1 text-[15px] font-semibold text-ink">{active.patientName}</div>
              <div className="mt-2 space-y-1.5 text-[12.5px] text-ink/70">
                <div><Mail className="mr-1 inline h-3.5 w-3.5" />{active.patientEmail}</div>
                <div><Phone className="mr-1 inline h-3.5 w-3.5" />{active.patientPhone}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-white p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Program</div>
              <div className="mt-1 text-[13px] font-semibold text-ink">{PROGRAMS[active.program].label}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
                <div><span className="text-ink/50">LTV</span><div className="font-semibold">{formatMoney(active.ltv)}</div></div>
                <div><span className="text-ink/50">Started</span><div className="font-semibold">{active.startedAt}</div></div>
              </div>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-white p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Assign</div>
              <div className="flex flex-wrap gap-1.5">
                {["Andre F.", "Ops", "Dr. Nass", "Unassigned"].map((who) => (
                  <button key={who} onClick={() => adminActions.assignConvo(active.id, who, who === "Dr. Nass" ? "physician" : who === "Unassigned" ? "unassigned" : "support")}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${active.assignedTo === who ? "bg-ink text-white ring-ink" : "bg-white text-ink/70 ring-ink/12 hover:ring-ink/25"}`}>
                    {who}
                  </button>
                ))}
              </div>
              {active.internalNote && (
                <div className="mt-3 rounded-xl bg-honey/12 p-2.5 text-[11.5px] text-ink/75">
                  <b className="text-honey">Note:</b> {active.internalNote}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Thread({ convo }: { convo: Conversation }) {
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const send = () => {
    if (!text.trim()) return;
    adminActions.sendReply(convo.id, text.trim(), internal);
    setText("");
    setInternal(false);
    if (ta.current) ta.current.style.height = "auto";
  };
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white">
      <div className="flex items-center justify-between border-b border-ink/8 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blush/25 text-[12px] font-semibold text-ink">
              {convo.patientName.split(" ").map(s => s[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold text-ink">{convo.patientName}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-ink/50"><ChannelIcon ch={convo.channel} /> {convo.channel} · {convo.assignedTo}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf9f6] p-4">
        {convo.messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-sm ${
                m.internal ? "bg-honey/15 text-ink ring-1 ring-honey/30" :
                m.from === "me" ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/8"
              }`}>
              {m.internal && <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-honey">Internal note</div>}
              {m.authorName && m.from === "them" && <div className="mb-0.5 text-[10.5px] font-semibold text-ink/50">{m.authorName}</div>}
              {m.text}
            </motion.div>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/8 p-3">
        <div className="rounded-2xl border border-ink/12 bg-white p-2 focus-within:border-ever/50">
          <textarea
            ref={ta}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(172, el.scrollHeight) + "px";
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={internal ? "Internal note (not sent to patient)…" : "Reply to patient…"}
            className="max-h-[172px] min-h-[44px] w-full resize-none bg-transparent px-2 py-1.5 text-[13.5px] outline-none placeholder:text-ink/40"
          />
          <div className="mt-1 flex items-center justify-between">
            <button onClick={() => setInternal((v) => !v)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${internal ? "bg-honey text-white" : "bg-ink/5 text-ink/60 hover:text-ink"}`}>
              {internal ? "Internal note" : "Reply"}
            </button>
            <button onClick={send} disabled={!text.trim()} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40">
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelIcon({ ch }: { ch: string }) {
  const map: Record<string, typeof Mail> = { email: Mail, sms: MessageSquare, in_app: MessageSquare, whatsapp: MessageSquare };
  const I = map[ch] || MessageSquare;
  return <I className="h-3 w-3 text-ink/50" />;
}

function fmtRel(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
