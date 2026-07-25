import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, Bell, BellOff, Check, CheckCheck, ChevronDown, Clock, Flame,
  Inbox, Mail, MessageSquare, MoreHorizontal, Paperclip, Phone, PhoneCall,
  Search, Send, Sparkles, Star, Tag as TagIcon, User, UserCheck, Users, X, Zap,
} from "lucide-react";
import { AdminShell, StatusPill, formatMoney } from "@/components/admin/AdminShell";
import {
  adminActions, PROGRAMS, useAdmin,
  type Conversation, type ConvoMessage, type MessageChannel,
} from "@/lib/admin/store";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Inbox — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MessagesPage,
});

/* ───────────── constants ───────────── */

type Folder = "all" | "unassigned" | "mine" | "snoozed" | "starred" | "closed" | "clinical" | "billing" | "shipping" | "refund";

const FOLDERS: { key: Folder; label: string; icon: typeof Inbox }[] = [
  { key: "all", label: "All conversations", icon: Inbox },
  { key: "mine", label: "Assigned to me", icon: UserCheck },
  { key: "unassigned", label: "Unassigned", icon: Users },
  { key: "starred", label: "Starred", icon: Star },
  { key: "snoozed", label: "Snoozed", icon: Clock },
  { key: "closed", label: "Closed", icon: Check },
];

const TAG_FILTERS: { key: Folder; label: string }[] = [
  { key: "clinical", label: "Clinical" },
  { key: "billing", label: "Billing" },
  { key: "shipping", label: "Shipping" },
  { key: "refund", label: "Refund" },
];

const CHANNELS: { key: MessageChannel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_app", label: "In-app" },
  { key: "sms", label: "SMS" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp" },
];

const MACROS: { id: string; label: string; body: (patient: string) => string }[] = [
  { id: "titration", label: "Titration guidance", body: (p) => `Hi ${p.split(" ")[0]} — for mild nausea in the first week, stay on your current dose, hydrate well, and eat smaller meals. If symptoms persist past 72h, message us and we'll loop in Dr. Nass.` },
  { id: "shipping", label: "Shipping ETA", body: (p) => `Hi ${p.split(" ")[0]} — I just pulled tracking. Your kit is out for delivery and should arrive today by 8pm. I'll flag if that changes.` },
  { id: "refill", label: "Refill confirmation", body: (p) => `Good news ${p.split(" ")[0]} — your refill is approved and headed to the pharmacy. You'll get tracking within 24–48h.` },
  { id: "billing", label: "Receipt / HSA", body: (p) => `Hi ${p.split(" ")[0]} — I've emailed your itemized receipt for HSA/FSA reimbursement. Let me know if you need it in a different format.` },
  { id: "escalate", label: "Escalate to physician", body: () => `Thanks for the note — I'm looping Dr. Nass in on this one. You'll hear back within a business day.` },
];

/* ───────────── page ───────────── */

function MessagesPage() {
  const convos = useAdmin((s) => s.conversations);
  const activeId = useAdmin((s) => s.ui.activeConvoId);
  const folder = (useAdmin((s) => s.ui.inboxFolder) ?? "all") as Folder;
  const channel = (useAdmin((s) => s.ui.inboxChannel) ?? "all") as MessageChannel | "all";
  const search = useAdmin((s) => s.ui.inboxSearch) ?? "";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return convos.filter((c) => {
      if (channel !== "all" && c.channel !== channel) return false;
      if (folder === "unassigned" && c.status !== "unassigned") return false;
      if (folder === "mine" && c.assignedTo !== "Andre F.") return false;
      if (folder === "snoozed" && !(c.snoozedUntil && c.snoozedUntil > Date.now())) return false;
      if (folder === "starred" && !c.starred) return false;
      if (folder === "closed" && c.status !== "closed") return false;
      if ((["clinical", "billing", "shipping", "refund"] as Folder[]).includes(folder) && c.tag !== folder) return false;
      if (q && !(c.patientName.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))) return false;
      return true;
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [convos, folder, channel, search]);

  const active = filtered.find((c) => c.id === activeId) ?? filtered[0] ?? convos[0];

  // Mobile pane state
  const [mobilePane, setMobilePane] = useState<"list" | "thread" | "info">("list");
  useEffect(() => { if (active) adminActions.markConvoSeen(active.id); }, [active?.id]); // eslint-disable-line

  const counts = useMemo(() => {
    const c = { all: 0, unassigned: 0, mine: 0, starred: 0, snoozed: 0, closed: 0, unread: 0 };
    convos.forEach((x) => {
      c.all += x.status === "closed" ? 0 : 1;
      if (x.status === "unassigned") c.unassigned++;
      if (x.assignedTo === "Andre F." && x.status !== "closed") c.mine++;
      if (x.starred) c.starred++;
      if (x.snoozedUntil && x.snoozedUntil > Date.now()) c.snoozed++;
      if (x.status === "closed") c.closed++;
      if (x.unread) c.unread++;
    });
    return c;
  }, [convos]);

  return (
    <AdminShell title="Inbox">
      <div className="grid gap-0 rounded-2xl border border-ink/[0.06] bg-white h-[calc(100vh-160px)] min-h-[600px] overflow-hidden lg:grid-cols-[240px_360px_1fr_320px]">
        {/* ── Filter rail (desktop) ── */}
        <aside className="hidden lg:flex min-h-0 flex-col border-r border-ink/[0.06] bg-[#fafafa]">
          <div className="border-b border-ink/[0.06] p-3">
            <div className="flex items-center justify-between">
              <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50">Inbox</div>
              <div className="rounded-full bg-marine/10 px-2 py-0.5 text-[10.5px] font-semibold text-marine tabular-nums">{counts.unread} new</div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {FOLDERS.map((f) => {
              const active = folder === f.key;
              const count = f.key === "all" ? counts.all : f.key === "unassigned" ? counts.unassigned : f.key === "mine" ? counts.mine : f.key === "starred" ? counts.starred : f.key === "snoozed" ? counts.snoozed : f.key === "closed" ? counts.closed : 0;
              const Icon = f.icon;
              return (
                <button key={f.key} onClick={() => adminActions.setInboxFolder(f.key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] ${active ? "bg-marine/10 text-marine font-semibold" : "text-ink/70 hover:bg-ink/[0.04]"}`}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="flex-1 truncate">{f.label}</span>
                  {count > 0 && <span className={`shrink-0 text-[10.5px] tabular-nums ${active ? "text-marine" : "text-ink/40"}`}>{count}</span>}
                </button>
              );
            })}
            <div className="mt-3 border-t border-ink/[0.06] px-2.5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Tags</div>
            {TAG_FILTERS.map((t) => (
              <button key={t.key} onClick={() => adminActions.setInboxFolder(t.key)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] ${folder === t.key ? "bg-marine/10 text-marine font-semibold" : "text-ink/60 hover:bg-ink/[0.04]"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${tagColor(t.key)}`} />
                {t.label}
              </button>
            ))}
            <div className="mt-3 border-t border-ink/[0.06] px-2.5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Channels</div>
            <div className="flex flex-wrap gap-1 px-1">
              {CHANNELS.map((ch) => (
                <button key={ch.key} onClick={() => adminActions.setInboxChannel(ch.key)}
                  className={`rounded-full px-2 py-1 text-[10.5px] font-medium ${channel === ch.key ? "bg-ink text-white" : "bg-white text-ink/60 ring-1 ring-ink/[0.08] hover:ring-ink/25"}`}>
                  {ch.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* ── List column ── */}
        <section className={`flex min-h-0 flex-col border-r border-ink/[0.06] bg-white ${mobilePane !== "list" ? "hidden lg:flex" : "flex"}`}>
          <div className="border-b border-ink/[0.06] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
              <input value={search} onChange={(e) => adminActions.setInboxSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full rounded-lg bg-ink/[0.04] py-2 pl-8 pr-3 text-[12.5px] outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1 focus:ring-marine/30" />
            </div>
            <div className="mt-2 flex items-center gap-1 lg:hidden overflow-x-auto">
              {FOLDERS.slice(0, 4).map((f) => (
                <button key={f.key} onClick={() => adminActions.setInboxFolder(f.key)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${folder === f.key ? "bg-ink text-white" : "bg-ink/[0.05] text-ink/60"}`}>{f.label}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-10 text-center text-[12.5px] text-ink/45">
                <Inbox className="mx-auto mb-2 h-6 w-6 text-ink/30" />
                Nothing here — you're caught up.
              </div>
            )}
            {filtered.map((c) => {
              const isActive = active?.id === c.id;
              return (
                <button key={c.id}
                  onClick={() => { adminActions.setActiveConvo(c.id); setMobilePane("thread"); }}
                  className={`relative flex w-full items-start gap-3 border-b border-ink/[0.05] p-3 text-left transition ${isActive ? "bg-marine/5" : "hover:bg-ink/[0.02]"}`}>
                  {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-marine" />}
                  <Avatar name={c.patientName} unread={c.unread} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`truncate text-[13px] ${c.unread ? "font-bold text-ink" : "font-semibold text-ink/85"}`}>
                        {c.priority === "high" && <Flame className="mr-0.5 inline h-3 w-3 text-ever" />}
                        {c.starred && <Star className="mr-0.5 inline h-3 w-3 fill-honey text-honey" />}
                        {c.patientName}
                      </div>
                      <div className="shrink-0 text-[10.5px] font-medium text-ink/40">{fmtRel(c.updatedAt)}</div>
                    </div>
                    <div className={`truncate text-[11.5px] ${c.unread ? "text-ink/80" : "text-ink/55"}`}>
                      {c.typing ? <span className="text-marine">typing…</span> : c.preview}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ChannelBadge ch={c.channel} />
                      <TagChip tag={c.tag} />
                      {c.snoozedUntil && c.snoozedUntil > Date.now() && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-honey/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-honey">
                          <Clock className="h-2.5 w-2.5" /> {fmtRel(c.snoozedUntil, true)}
                        </span>
                      )}
                      <span className="ml-auto text-[10px] text-ink/40">{c.assignedTo === "Unassigned" ? "—" : c.assignedTo}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Thread ── */}
        <section className={`flex min-h-0 flex-col bg-[#fafafa] ${mobilePane === "list" ? "hidden lg:flex" : "flex"}`}>
          {active ? <Thread key={active.id} convo={active} onBack={() => setMobilePane("list")} onInfo={() => setMobilePane("info")} /> : (
            <div className="flex flex-1 items-center justify-center text-[12.5px] text-ink/45">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 text-ink/25" />
                Select a conversation to begin.
              </div>
            </div>
          )}
        </section>

        {/* ── Patient panel ── */}
        <aside className={`hidden lg:flex min-h-0 flex-col border-l border-ink/[0.06] bg-white ${mobilePane === "info" ? "!flex" : ""}`}>
          {active && <PatientPanel convo={active} onBack={() => setMobilePane("thread")} />}
        </aside>
      </div>
    </AdminShell>
  );
}

/* ───────────── Thread ───────────── */

function Thread({ convo, onBack, onInfo }: { convo: Conversation; onBack: () => void; onInfo: () => void }) {
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const [showMacros, setShowMacros] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [convo.messages.length, convo.typing]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    adminActions.sendConvoMessage(convo.id, { text: t, internal, channel: convo.channel });
    setText("");
    setInternal(false);
    if (ta.current) ta.current.style.height = "auto";
  };

  const applyMacro = (body: string) => {
    setText((prev) => (prev ? prev + "\n\n" + body : body));
    setShowMacros(false);
    setTimeout(() => ta.current?.focus(), 20);
  };

  const grouped = useMemo(() => groupByDay(convo.messages), [convo.messages]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink/[0.06] bg-white px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onBack} className="grid h-7 w-7 place-items-center rounded-full text-ink/60 hover:bg-ink/[0.05] lg:hidden">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Avatar name={convo.patientName} unread={false} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <div className="truncate text-[13.5px] font-semibold text-ink">{convo.patientName}</div>
              {convo.priority === "high" && <Flame className="h-3 w-3 text-ever" />}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-ink/50">
              <ChannelBadge ch={convo.channel} />
              <span>·</span>
              <span>{convo.assignedTo}</span>
              {convo.snoozedUntil && convo.snoozedUntil > Date.now() && (
                <><span>·</span><span className="text-honey">Snoozed {fmtRel(convo.snoozedUntil, true)}</span></>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn title="Star" onClick={() => adminActions.toggleConvoStar(convo.id)}>
            <Star className={`h-4 w-4 ${convo.starred ? "fill-honey text-honey" : ""}`} />
          </IconBtn>
          {convo.snoozedUntil && convo.snoozedUntil > Date.now() ? (
            <IconBtn title="Unsnooze" onClick={() => { adminActions.unsnoozeConvo(convo.id); toast.success("Conversation unsnoozed"); }}>
              <BellOff className="h-4 w-4" />
            </IconBtn>
          ) : (
            <IconBtn title="Snooze 4h" onClick={() => { adminActions.snoozeConvo(convo.id, 4); toast.success("Snoozed for 4 hours"); }}>
              <Bell className="h-4 w-4" />
            </IconBtn>
          )}
          <IconBtn title="Set priority" onClick={() => adminActions.setConvoPriority(convo.id, convo.priority === "high" ? "normal" : "high")}>
            <Flame className={`h-4 w-4 ${convo.priority === "high" ? "text-ever" : ""}`} />
          </IconBtn>
          <div className="relative">
            <IconBtn title="More" onClick={() => setShowMore((v) => !v)}><MoreHorizontal className="h-4 w-4" /></IconBtn>
            <AnimatePresence>
              {showMore && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-9 z-20 w-52 overflow-hidden rounded-xl border border-ink/[0.08] bg-white py-1 shadow-lg">
                  {convo.status !== "closed" ? (
                    <MenuItem onClick={() => { adminActions.closeConvo(convo.id); toast.success("Conversation closed"); setShowMore(false); }}>Close conversation</MenuItem>
                  ) : (
                    <MenuItem onClick={() => { adminActions.reopenConvo(convo.id); toast.success("Reopened"); setShowMore(false); }}>Reopen</MenuItem>
                  )}
                  <MenuItem onClick={() => { adminActions.snoozeConvo(convo.id, 24); setShowMore(false); toast.success("Snoozed 24h"); }}>Snooze 24h</MenuItem>
                  <MenuItem onClick={() => { adminActions.assignConvo(convo.id, "Dr. Nass", "physician"); setShowMore(false); toast.success("Escalated to Dr. Nass"); }}>Escalate to physician</MenuItem>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <IconBtn title="Patient info" onClick={onInfo} className="lg:hidden"><User className="h-4 w-4" /></IconBtn>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 sm:px-6">
        {grouped.map(({ day, items }) => (
          <div key={day}>
            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink/[0.06]" />
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/40">{day}</div>
              <div className="h-px flex-1 bg-ink/[0.06]" />
            </div>
            {items.map((m) => <Bubble key={m.id} m={m} patientName={convo.patientName} />)}
          </div>
        ))}
        <AnimatePresence>
          {convo.typing && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 ring-1 ring-ink/[0.06]">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-ink/40"
                    animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="border-t border-ink/[0.06] bg-white p-3">
        <AnimatePresence>
          {showMacros && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              className="mb-2 overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-sm">
              <div className="border-b border-ink/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">Canned responses</div>
              {MACROS.map((m) => (
                <button key={m.id} onClick={() => applyMacro(m.body(convo.patientName))}
                  className="flex w-full items-center gap-2 border-b border-ink/[0.04] px-3 py-2 text-left last:border-0 hover:bg-marine/5">
                  <Zap className="h-3.5 w-3.5 text-marine" />
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-ink">{m.label}</div>
                    <div className="truncate text-[11px] text-ink/55">{m.body(convo.patientName)}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`rounded-2xl border bg-white p-2 transition ${internal ? "border-honey/50 bg-honey/[0.04]" : "border-ink/[0.12] focus-within:border-marine/50"}`}>
          <textarea
            ref={ta}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(220, el.scrollHeight) + "px";
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); send(); }
              else if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder={internal ? "Internal note (not sent to patient)…" : `Message ${convo.patientName.split(" ")[0]}…`}
            className="max-h-[220px] min-h-[44px] w-full resize-none bg-transparent px-2 py-1.5 text-[13.5px] outline-none placeholder:text-ink/40"
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-0.5">
              <IconBtn title="Canned responses" onClick={() => setShowMacros((v) => !v)}><Sparkles className="h-4 w-4" /></IconBtn>
              <IconBtn title="Attach" onClick={() => toast("Attachment support demo-only in this build")}><Paperclip className="h-4 w-4" /></IconBtn>
              <button onClick={() => setInternal((v) => !v)}
                className={`ml-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${internal ? "bg-honey text-white" : "bg-ink/[0.05] text-ink/60 hover:text-ink"}`}>
                {internal ? "Internal note" : "Reply"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-[10.5px] text-ink/40 sm:inline">⌘↵ to send</span>
              <button onClick={send} disabled={!text.trim()}
                className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-ink/90 disabled:opacity-30">
                <Send className="h-3.5 w-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ───────────── Bubble ───────────── */

function Bubble({ m, patientName }: { m: ConvoMessage; patientName: string }) {
  if (m.from === "system") {
    return (
      <div className="my-2 flex justify-center">
        <div className="rounded-full bg-ink/[0.05] px-3 py-1 text-[10.5px] font-medium text-ink/55">
          {m.text} · {fmtClock(m.ts)}
        </div>
      </div>
    );
  }
  const mine = m.from === "me";
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className={`mb-1.5 flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`group flex max-w-[78%] flex-col ${mine ? "items-end" : "items-start"}`}>
        {!mine && m.authorName && <div className="mb-0.5 pl-2 text-[10.5px] font-medium text-ink/45">{m.authorName || patientName}</div>}
        <div className={`rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm ${
          m.internal ? "bg-honey/[0.12] text-ink ring-1 ring-honey/40"
          : mine ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/[0.06]"
        }`}>
          {m.internal && <div className="mb-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-honey">Internal note</div>}
          <div className="whitespace-pre-wrap">{m.text}</div>
        </div>
        <div className={`mt-0.5 flex items-center gap-1 text-[10px] text-ink/40 ${mine ? "pr-1" : "pl-2"}`}>
          <span>{fmtClock(m.ts)}</span>
          {mine && <MsgState state={m.state} />}
        </div>
      </div>
    </motion.div>
  );
}

function MsgState({ state }: { state?: ConvoMessage["state"] }) {
  if (!state || state === "sending") return <Clock className="h-3 w-3 opacity-60" />;
  if (state === "sent") return <Check className="h-3 w-3" />;
  if (state === "delivered") return <CheckCheck className="h-3 w-3" />;
  if (state === "seen") return <CheckCheck className="h-3 w-3 text-marine" />;
  return <span className="text-ever">failed</span>;
}

/* ───────────── Patient panel ───────────── */

function PatientPanel({ convo, onBack }: { convo: Conversation; onBack: () => void }) {
  const [note, setNote] = useState(convo.internalNote);
  useEffect(() => setNote(convo.internalNote), [convo.internalNote]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-2.5">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50">Patient</div>
        <button onClick={onBack} className="grid h-7 w-7 place-items-center rounded-full text-ink/60 hover:bg-ink/[0.05] lg:hidden"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={convo.patientName} unread={false} size="lg" />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-ink">{convo.patientName}</div>
            <div className="text-[11.5px] text-ink/55">{PROGRAMS[convo.program]?.label}</div>
          </div>
        </div>
        <div className="space-y-2 rounded-xl bg-ink/[0.02] p-3 text-[12px]">
          <div className="flex items-center gap-2 text-ink/70"><Mail className="h-3.5 w-3.5 text-ink/40" />{convo.patientEmail}</div>
          <div className="flex items-center gap-2 text-ink/70"><Phone className="h-3.5 w-3.5 text-ink/40" />{convo.patientPhone}</div>
          <button className="mt-1 inline-flex items-center gap-1 rounded-full bg-marine/10 px-2.5 py-1 text-[11px] font-semibold text-marine hover:bg-marine/15">
            <PhoneCall className="h-3 w-3" /> Call
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <Stat label="LTV" value={formatMoney(convo.ltv)} />
          <Stat label="Started" value={convo.startedAt} />
          <Stat label="Program" value={PROGRAMS[convo.program]?.label.split(" · ")[0] ?? "—"} />
          <Stat label="Status" value={<StatusPill tone={convo.status === "closed" ? "neutral" : convo.status === "physician" ? "info" : convo.status === "support" ? "success" : "warn"}>{convo.status}</StatusPill>} />
        </div>

        <div className="rounded-xl border border-ink/[0.08] p-3">
          <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Assign</div>
          <div className="flex flex-wrap gap-1.5">
            {["Andre F.", "Ops", "Dr. Nass", "Unassigned"].map((who) => {
              const status = who === "Dr. Nass" ? "physician" : who === "Unassigned" ? "unassigned" : "support";
              const active = convo.assignedTo === who;
              return (
                <button key={who} onClick={() => { adminActions.assignConvo(convo.id, who, status); toast.success(`Assigned to ${who}`); }}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition ${active ? "bg-ink text-white ring-ink" : "bg-white text-ink/70 ring-ink/[0.12] hover:ring-ink/25"}`}>
                  {who}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-ink/[0.08] p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">
            <TagIcon className="h-3 w-3" /> Tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["clinical", "billing", "shipping", "refund", "urgent", "vip"].map((t) => {
              const on = (convo.tags ?? []).includes(t);
              return (
                <button key={t} onClick={() => adminActions.toggleConvoTag(convo.id, t)}
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold transition ${on ? "bg-marine text-white" : "bg-ink/[0.05] text-ink/60 hover:bg-ink/[0.08]"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-ink/[0.08] p-3">
          <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Internal note</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            onBlur={() => adminActions.setConvoInternalNote(convo.id, note)}
            placeholder="Add context for your team…"
            className="min-h-[64px] w-full resize-none rounded-lg bg-honey/[0.06] p-2 text-[12px] outline-none ring-1 ring-honey/25 focus:ring-honey/50" />
        </div>

        <div className="rounded-xl border border-ink/[0.08] p-3">
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">Quick actions</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11.5px]">
            <QuickAction label="Open patient" onClick={() => adminActions.openPatient(convo.patientId)} />
            <QuickAction label="Escalate" onClick={() => { adminActions.assignConvo(convo.id, "Dr. Nass", "physician"); toast.success("Escalated"); }} />
            <QuickAction label="Snooze 24h" onClick={() => { adminActions.snoozeConvo(convo.id, 24); toast.success("Snoozed"); }} />
            <QuickAction label={convo.status === "closed" ? "Reopen" : "Close"} onClick={() => { convo.status === "closed" ? adminActions.reopenConvo(convo.id) : adminActions.closeConvo(convo.id); toast.success("Updated"); }} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ───────────── Bits ───────────── */

function Avatar({ name, unread, size = "sm" }: { name: string; unread: boolean; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-11 w-11 text-[13px]" : size === "md" ? "h-9 w-9 text-[12px]" : "h-9 w-9 text-[11.5px]";
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2);
  const hue = Math.abs(hashCode(name)) % 360;
  return (
    <div className="relative shrink-0">
      <div className={`${dim} grid place-items-center rounded-full font-semibold text-ink`} style={{ background: `hsl(${hue} 80% 92%)` }}>
        {initials}
      </div>
      {unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-marine ring-2 ring-white" />}
    </div>
  );
}

function ChannelBadge({ ch }: { ch: MessageChannel }) {
  const map: Record<MessageChannel, { icon: typeof Mail; label: string; color: string }> = {
    email: { icon: Mail, label: "Email", color: "text-marine" },
    sms: { icon: MessageSquare, label: "SMS", color: "text-check" },
    in_app: { icon: MessageSquare, label: "In-app", color: "text-ink/50" },
    whatsapp: { icon: MessageSquare, label: "WhatsApp", color: "text-check" },
  };
  const { icon: Icon, label, color } = map[ch];
  return <span className={`inline-flex items-center gap-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] ${color}`}><Icon className="h-2.5 w-2.5" />{label}</span>;
}

function TagChip({ tag }: { tag: Conversation["tag"] }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] ${tagBg(tag)}`}>
      <span className={`h-1 w-1 rounded-full ${tagColor(tag)}`} />
      {tag}
    </span>
  );
}

function IconBtn({ children, onClick, title, className = "" }: { children: React.ReactNode; onClick?: () => void; title?: string; className?: string }) {
  return (
    <button onClick={onClick} title={title}
      className={`grid h-8 w-8 place-items-center rounded-full text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink ${className}`}>
      {children}
    </button>
  );
}

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-ink/80 hover:bg-marine/5 hover:text-marine">
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-ink/[0.02] p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">{label}</div>
      <div className="mt-0.5 text-[12.5px] font-semibold text-ink">{value}</div>
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-lg border border-ink/[0.08] bg-white px-2 py-1.5 text-left font-medium text-ink/75 hover:border-marine/40 hover:text-marine">
      {label}
    </button>
  );
}

/* ───────────── helpers ───────────── */

function tagColor(t: string) {
  return t === "clinical" ? "bg-marine" : t === "billing" ? "bg-honey" : t === "shipping" ? "bg-check" : t === "refund" ? "bg-ever" : "bg-ink/40";
}
function tagBg(t: string) {
  return t === "clinical" ? "bg-marine/10 text-marine"
    : t === "billing" ? "bg-honey/15 text-honey"
    : t === "shipping" ? "bg-check/10 text-check"
    : t === "refund" ? "bg-ever/10 text-ever"
    : "bg-ink/[0.06] text-ink/60";
}

function fmtRel(ts: number, future = false) {
  const diff = future ? ts - Date.now() : Date.now() - ts;
  const s = Math.floor(Math.abs(diff) / 1000);
  const prefix = future ? "in " : "";
  if (s < 60) return `${prefix}${s}s`;
  if (s < 3600) return `${prefix}${Math.floor(s / 60)}m`;
  if (s < 86400) return `${prefix}${Math.floor(s / 3600)}h`;
  return `${prefix}${Math.floor(s / 86400)}d`;
}

function fmtClock(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function groupByDay(msgs: ConvoMessage[]): Array<{ day: string; items: ConvoMessage[] }> {
  const out: Record<string, ConvoMessage[]> = {};
  msgs.forEach((m) => {
    const d = new Date(m.ts);
    const today = new Date();
    const yest = new Date(); yest.setDate(today.getDate() - 1);
    const key = d.toDateString() === today.toDateString() ? "Today"
      : d.toDateString() === yest.toDateString() ? "Yesterday"
      : d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
    (out[key] ??= []).push(m);
  });
  return Object.entries(out).map(([day, items]) => ({ day, items }));
}

function hashCode(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return h; }
