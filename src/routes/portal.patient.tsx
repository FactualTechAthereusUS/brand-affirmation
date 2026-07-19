import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home as HomeIcon,
  MessageCircle,
  Package,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Truck,
  CreditCard,
  Clock,
  CheckCircle2,
  Send,
  LogOut,
  Pause,
  X,
  Repeat,
  MapPin,
  ShieldCheck,
  Bell,
  Loader2,
  Sparkles,
} from "lucide-react";
import badgeCheckPink from "@/assets/badge-check-pink.png.asset.json";
import vialTirzepatide from "@/assets/blissley-tirzepatide-vial-transparent.png.asset.json";

export const Route = createFileRoute("/portal/patient")({
  head: () => ({
    meta: [
      { title: "Blissley Patient Portal" },
      { name: "description", content: "Manage your Blissley program, messages, shipments, and billing." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PatientPortal,
});

/* ────────────  Brand tokens  ──────────── */
const INK = "#171717";
const PINK = "#ee7273";
const NAVY = "#1D437B";
const SOFT = "#F8F5EF";
const HAIRLINE = "#E8E4DC";

/* ────────────  Demo data  ──────────── */
const PATIENT = {
  firstName: "Sarah",
  lastName: "Miller",
  email: "sarah.miller@email.com",
  phone: "+1 (415) 555-0123",
  dob: "March 14, 1988",
  emergencyName: "Michael Miller",
  emergencyPhone: "+1 (415) 555-0198",
  address1: "1428 Valencia St, Apt 3B",
  city: "San Francisco",
  state: "CA",
  zip: "94110",
  card: "4242",
  approved: true, // toggle for pending
  plan: "3-Month",
  planPrice: 299,
  medication: "Semaglutide Injectable",
  dose: "Step 2 · 5mg/mL",
  activeSince: "June 1, 2026",
  monthNumber: 3,
  nextShipDate: "July 8",
  nextShipDaysAway: 6,
  nextChargeDate: "July 18",
  nextChargeAmount: 299.0,
};

const ORDERS = [
  { date: "Jul 8, 2026", label: "Semaglutide 5mg/mL", status: "Shipping soon" },
  { date: "Jun 8, 2026", label: "Semaglutide 5mg/mL", status: "Delivered" },
  { date: "May 8, 2026", label: "Semaglutide 2mg/mL", status: "Delivered" },
  { date: "Apr 8, 2026", label: "Semaglutide 2mg/mL", status: "Delivered" },
  { date: "Mar 8, 2026", label: "Semaglutide 1mg/mL", status: "Delivered" },
  { date: "Feb 8, 2026", label: "Semaglutide 0.5mg/mL", status: "Delivered" },
];

const BILLING = [
  { date: "Jun 18, 2026", amount: 299.0, status: "Paid" },
  { date: "May 18, 2026", amount: 299.0, status: "Paid" },
  { date: "Apr 18, 2026", amount: 299.0, status: "Paid" },
  { date: "Mar 18, 2026", amount: 299.0, status: "Paid" },
  { date: "Feb 18, 2026", amount: 249.0, status: "Paid" },
  { date: "Jan 18, 2026", amount: 249.0, status: "Paid" },
];

type Msg = { from: "me" | "them"; name?: string; text: string; time: string };

const CARE_THREAD: Msg[] = [
  { from: "them", name: "Sarah (Care Team)", text: "Hi Sarah! Just checking in — your next shipment is on track for July 8. Let me know if you need anything.", time: "Yesterday · 2:14 PM" },
  { from: "me", text: "Thanks Sarah! Quick question — can I update my shipping address before it ships?", time: "Yesterday · 5:42 PM" },
  { from: "them", name: "Sarah (Care Team)", text: "Absolutely — you can update it right inside My Plan or Settings. As long as it's changed before July 6, we'll ship to the new address.", time: "Today · 9:08 AM" },
];

const DOC_THREAD: Msg[] = [
  { from: "me", text: "Hi Dr. Nass — I'm getting mild nausea in the mornings on my 5mg dose. Is that normal?", time: "2 days ago" },
  { from: "them", name: "Dr. Nass", text: "Your nausea in weeks 1–3 is expected and typically resolves. Try taking your injection at bedtime, sip water throughout the day, and eat smaller meals. Reach out if it worsens.", time: "1 day ago" },
  { from: "me", text: "That helps a lot, thank you.", time: "1 day ago" },
];

/* ────────────  Root  ──────────── */
type Tab = "home" | "messages" | "plan" | "settings";

function PatientPortal() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-svh bg-[color:var(--color-mist)]/40 text-ink" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Phone frame on desktop, edge-to-edge on mobile */}
      <div className="mx-auto flex min-h-svh w-full max-w-[440px] flex-col bg-white shadow-none md:my-6 md:min-h-[calc(100svh-3rem)] md:rounded-[36px] md:shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)] md:ring-1 md:ring-black/5">
        <TopBar tab={tab} />
        <main className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-full overflow-y-auto pb-28"
            >
              {tab === "home" && <HomeTab onGoto={setTab} />}
              {tab === "messages" && <MessagesTab />}
              {tab === "plan" && <PlanTab />}
              {tab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
        <TabBar tab={tab} onChange={setTab} />
      </div>
    </div>
  );
}

/* ────────────  Chrome  ──────────── */
function TopBar({ tab }: { tab: Tab }) {
  const title =
    tab === "home" ? "Blissley" : tab === "messages" ? "Messages" : tab === "plan" ? "My Plan" : "Settings";
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--color-hairline)]/70 bg-white/85 px-5 py-3.5 backdrop-blur-md md:rounded-t-[36px]">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-black text-white" style={{ background: INK }}>
          B
        </div>
        <span className="text-[15px] font-semibold tracking-tight">{title}</span>
      </div>
      <button className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--color-mist)]/60 text-ink/70 transition hover:bg-[color:var(--color-mist)]" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </button>
    </header>
  );
}

function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: any }[] = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "plan", label: "My Plan", icon: Package },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <nav className="pointer-events-none sticky bottom-0 z-30 px-3 pb-3 pt-2 md:rounded-b-[36px]">
      <div className="pointer-events-auto mx-auto flex items-center justify-between rounded-full border border-black/5 bg-white/95 px-2 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] backdrop-blur">
        {items.map((it) => {
          const active = it.id === tab;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10.5px] font-medium transition"
              style={{ color: active ? INK : "#8a8a8a" }}
            >
              {active && (
                <motion.span
                  layoutId="tabpill"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: "#F5F1E9" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.8} />
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ────────────  Home  ──────────── */
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function HomeTab({ onGoto }: { onGoto: (t: Tab) => void }) {
  return (
    <div className="px-5 pt-5">
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[24px] font-semibold tracking-tight text-ink"
      >
        {greeting()}, {PATIENT.firstName}.
      </motion.h1>
      <p className="mt-1 text-[13.5px] text-ink/55">Here's the state of your program today.</p>

      <div className="mt-5 space-y-3.5">
        {/* Approval status */}
        {PATIENT.approved ? (
          <Card>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "#EAF3EF" }}>
                <CheckCircle2 className="h-5 w-5" style={{ color: "#4a7c6f" }} />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-ink">Prescription Approved</div>
                <div className="mt-0.5 text-[13px] text-ink/60">Your medication is being prepared.</div>
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-ink/50">
                  <img src={badgeCheckPink.url} alt="" className="h-3.5 w-3.5" />
                  Signed by Dr. Scott Nass MD
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <PendingApproval />
        )}

        {/* Next shipment */}
        <Card>
          <CardHeader icon={<Truck className="h-4 w-4" />} title="Next Shipment" pill={`In ${PATIENT.nextShipDaysAway} days`} />
          <div className="mt-3 text-[17px] font-semibold tracking-tight text-ink">Ships {PATIENT.nextShipDate}</div>
          <div className="text-[13px] text-ink/60">{PATIENT.medication.replace(" Injectable", "")} · {PATIENT.dose}</div>
          <div className="mt-4 flex items-center gap-3">
            <img src={vialTirzepatide.url} alt="" className="h-16 w-auto object-contain opacity-90" />
            <button className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[12.5px] font-medium text-ink transition hover:bg-ink hover:text-white">
              Track order
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>

        {/* Next charge — THE INVARIANT */}
        <Card accent>
          <CardHeader icon={<CreditCard className="h-4 w-4" />} title="Next Charge" pill={`in 10 days`} />
          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-[26px] font-black tracking-tight text-ink">${PATIENT.nextChargeAmount.toFixed(2)}</div>
            <div className="text-[13px] text-ink/55">on {PATIENT.nextChargeDate}</div>
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Card ending in {PATIENT.card}</div>
          <button
            onClick={() => onGoto("plan")}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-[13.5px] font-semibold text-white transition"
            style={{ background: INK }}
          >
            Manage plan
            <ChevronRight className="h-4 w-4" />
          </button>
        </Card>

        {/* Small provider strip */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[13px] font-black text-white" style={{ background: NAVY }}>SN</div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-ink">Dr. Scott Nass MD</div>
              <div className="text-[12.5px] text-ink/55">Your prescribing physician · Board-certified</div>
            </div>
            <button onClick={() => onGoto("messages")} className="ml-auto rounded-full border border-ink/15 px-3.5 py-2 text-[12px] font-medium text-ink transition hover:bg-ink hover:text-white">
              Message
            </button>
          </div>
        </Card>

        <p className="pt-2 text-center text-[11px] text-ink/40">
          <Sparkles className="mr-1 inline h-3 w-3" />
          You're on month {PATIENT.monthNumber} of your program.
        </p>
      </div>
    </div>
  );
}

function PendingApproval() {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "#FFF3F1" }}>
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: PINK }} />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-ink">Physician Review In Progress</div>
          <div className="mt-0.5 text-[13px] text-ink/60">Dr. Scott Nass MD is reviewing your profile.</div>
          <div className="mt-3 space-y-1 text-[12.5px] text-ink/60">
            <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Expected within 24 hours</div>
            <div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Priority patients: within 6 hrs</div>
          </div>
          <div className="mt-3 rounded-lg bg-[color:var(--color-mist)]/40 px-3 py-2 text-[11.5px] text-ink/60">
            We'll notify you by email + SMS the moment you're approved.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ────────────  Messages  ──────────── */
type Thread = "list" | "care" | "doc";

function MessagesTab() {
  const [view, setView] = useState<Thread>("list");
  return (
    <AnimatePresence mode="wait">
      {view === "list" ? (
        <motion.div key="list" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className="px-5 pt-5">
          <p className="text-[13.5px] text-ink/55">You're in touch with the people caring for you.</p>
          <div className="mt-5 space-y-3">
            <ThreadCard
              onOpen={() => setView("care")}
              iconBg="#F5F1E9"
              icon={<MessageCircle className="h-5 w-5" style={{ color: INK }} />}
              title="Care Team"
              subtitle="Billing, shipping, general questions"
              status="Sarah · online"
              unread={2}
            />
            <ThreadCard
              onOpen={() => setView("doc")}
              iconBg="#EAF0F8"
              icon={<Stethoscope className="h-5 w-5" style={{ color: NAVY }} />}
              title="Dr. Scott Nass MD"
              subtitle="Clinical questions, side effects, dosing"
              status="Responds within 24 hours"
              unread={0}
            />
          </div>
        </motion.div>
      ) : (
        <ChatThread
          key={view}
          kind={view}
          onBack={() => setView("list")}
        />
      )}
    </AnimatePresence>
  );
}

function ThreadCard({
  onOpen, iconBg, icon, title, subtitle, status, unread,
}: { onOpen: () => void; iconBg: string; icon: React.ReactNode; title: string; subtitle: string; status: string; unread: number }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-4 text-left transition hover:border-ink/20"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: iconBg }}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-[15px] font-semibold text-ink">{title}</div>
          {unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10.5px] font-bold text-white" style={{ background: PINK }}>{unread}</span>}
        </div>
        <div className="mt-0.5 truncate text-[12.5px] text-ink/60">{subtitle}</div>
        <div className="mt-1 text-[11.5px] text-ink/45">{status}</div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink/40" />
    </motion.button>
  );
}

function ChatThread({ kind, onBack }: { kind: "care" | "doc"; onBack: () => void }) {
  const initial = kind === "care" ? CARE_THREAD : DOC_THREAD;
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs.length]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `Today · ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
    setMsgs((m) => [...m, { from: "me", text: draft.trim(), time }]);
    setDraft("");
  };

  const title = kind === "care" ? "Care Team" : "Dr. Scott Nass MD";
  const sub = kind === "care" ? "Sarah · responds within a few hours" : "Board-Certified · responds within 24 hours";
  const avatar =
    kind === "care" ? (
      <div className="grid h-10 w-10 place-items-center rounded-full text-[12px] font-black text-white" style={{ background: INK }}>B</div>
    ) : (
      <div className="grid h-10 w-10 place-items-center rounded-full text-[12px] font-black text-white" style={{ background: NAVY }}>SN</div>
    );

  return (
    <motion.div key={kind} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[color:var(--color-hairline)]/70 bg-white/90 px-4 py-3 backdrop-blur">
        <button onClick={onBack} className="grid h-8 w-8 place-items-center rounded-full hover:bg-[color:var(--color-mist)]/60" aria-label="Back">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {avatar}
        <div className="min-w-0">
          <div className="truncate text-[14.5px] font-semibold text-ink">{title}</div>
          <div className="truncate text-[11.5px] text-ink/55">{sub}</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug ${m.from === "me" ? "text-white" : "bg-[color:var(--color-mist)]/50 text-ink"}`} style={m.from === "me" ? { background: INK } : undefined}>
              {m.from === "them" && m.name && <div className="mb-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink/50">{m.name}</div>}
              <div>{m.text}</div>
              <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/60" : "text-ink/40"}`}>{m.time}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-[color:var(--color-hairline)]/70 bg-white p-3">
        <div className="flex items-center gap-2 rounded-full bg-[color:var(--color-mist)]/45 px-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={kind === "care" ? "Message your care team..." : "Ask your physician..."}
            className="h-12 flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button onClick={send} className="grid h-9 w-9 place-items-center rounded-full text-white transition disabled:opacity-40" style={{ background: PINK }} disabled={!draft.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </button>
        </div>
        {kind === "doc" && <div className="mt-2 text-center text-[10.5px] text-ink/45">For emergencies call 911. This is not emergency care.</div>}
      </div>
    </motion.div>
  );
}

/* ────────────  My Plan  ──────────── */
function PlanTab() {
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [modal, setModal] = useState<null | "pause" | "cancel" | "switch" | "payment" | "address">(null);
  const [cancelled, setCancelled] = useState(false);
  const [paused, setPaused] = useState<null | number>(null);

  return (
    <div className="px-5 pt-5">
      {/* Current plan */}
      <div className="overflow-hidden rounded-3xl border border-[color:var(--color-hairline)] bg-gradient-to-br from-white to-[color:var(--color-mist)]/40 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Your plan</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-[22px] font-semibold tracking-tight text-ink">{PATIENT.medication}</div>
        </div>
        <div className="mt-1 text-[15px] text-ink/70">
          <span className="font-semibold" style={{ color: PINK }}>${PATIENT.planPrice}</span>
          <span className="text-ink/50">/month · {PATIENT.plan}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-white/70 p-3 text-center">
          <MiniStat label="Active since" value={PATIENT.activeSince} />
          <MiniStat label="Current dose" value={PATIENT.dose} />
          <MiniStat label="Program" value={`Month ${PATIENT.monthNumber}`} />
        </div>
        {paused !== null && (
          <div className="mt-3 rounded-xl bg-[#FFF3F1] px-3 py-2 text-[12.5px] text-ink/70">Program paused for {paused} days.</div>
        )}
        {cancelled && (
          <div className="mt-3 rounded-xl bg-[#EAF3EF] px-3 py-2 text-[12.5px] text-ink/70">Your program has been cancelled. You won't be charged again.</div>
        )}
      </div>

      {/* Order history */}
      <Section title="Order History">
        <div className="divide-y divide-[color:var(--color-hairline)] rounded-2xl border border-[color:var(--color-hairline)] bg-white">
          {(ordersOpen ? ORDERS : ORDERS.slice(0, 3)).map((o) => (
            <div key={o.date} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--color-mist)]/60"><Package className="h-4 w-4 text-ink/60" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium text-ink">{o.label}</div>
                <div className="text-[11.5px] text-ink/50">{o.date} · {o.status}</div>
              </div>
              <button className="text-[12px] font-medium text-ink/70 hover:text-ink">Tracking <ChevronRight className="ml-0.5 inline h-3 w-3" /></button>
            </div>
          ))}
        </div>
        <SectionToggle open={ordersOpen} onClick={() => setOrdersOpen((v) => !v)} />
      </Section>

      {/* Manage */}
      <Section title="Manage">
        <div className="divide-y divide-[color:var(--color-hairline)] overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-white">
          <ManageRow icon={<Pause className="h-4 w-4" />} label="Pause my program" onClick={() => setModal("pause")} />
          <ManageRow icon={<X className="h-4 w-4" />} label="Cancel my program" onClick={() => setModal("cancel")} destructive />
          <ManageRow icon={<Repeat className="h-4 w-4" />} label="Switch plan" onClick={() => setModal("switch")} />
          <ManageRow icon={<CreditCard className="h-4 w-4" />} label="Update payment method" onClick={() => setModal("payment")} />
          <ManageRow icon={<MapPin className="h-4 w-4" />} label="Update shipping address" onClick={() => setModal("address")} />
        </div>
      </Section>

      {/* Billing */}
      <Section title="Billing History">
        <div className="divide-y divide-[color:var(--color-hairline)] rounded-2xl border border-[color:var(--color-hairline)] bg-white">
          {(billingOpen ? BILLING : BILLING.slice(0, 3)).map((b) => (
            <div key={b.date} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EAF3EF]"><CheckCircle2 className="h-4 w-4" style={{ color: "#4a7c6f" }} /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium text-ink">${b.amount.toFixed(2)}</div>
                <div className="text-[11.5px] text-ink/50">{b.date} · {b.status}</div>
              </div>
              <button className="text-[12px] font-medium text-ink/70 hover:text-ink">Receipt <ChevronRight className="ml-0.5 inline h-3 w-3" /></button>
            </div>
          ))}
        </div>
        <SectionToggle open={billingOpen} onClick={() => setBillingOpen((v) => !v)} />
      </Section>

      <PlanModal
        modal={modal}
        onClose={() => setModal(null)}
        onCancel={() => { setCancelled(true); setModal(null); }}
        onPause={(days) => { setPaused(days); setModal(null); }}
      />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-ink/45">{label}</div>
      <div className="mt-0.5 text-[12px] font-medium text-ink">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/60">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SectionToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-2 w-full text-center text-[12px] font-medium text-ink/60 hover:text-ink">
      {open ? "Show less" : "View all"}
    </button>
  );
}

function ManageRow({ icon, label, onClick, destructive }: { icon: React.ReactNode; label: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[color:var(--color-mist)]/40">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--color-mist)]/60" style={destructive ? { background: "#FFF3F1", color: PINK } : undefined}>
        {icon}
      </div>
      <div className={`flex-1 text-[14px] font-medium ${destructive ? "text-ink" : "text-ink"}`}>{label}</div>
      <ChevronRight className="h-4 w-4 text-ink/40" />
    </button>
  );
}

function PlanModal({
  modal, onClose, onCancel, onPause,
}: { modal: null | string; onClose: () => void; onCancel: () => void; onPause: (n: number) => void }) {
  return (
    <AnimatePresence>
      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-end bg-black/40 backdrop-blur-sm md:place-items-center" onClick={onClose}>
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-t-3xl bg-white p-5 md:rounded-3xl"
          >
            {modal === "pause" && (
              <>
                <ModalTitle title="Pause my program" sub="Choose how long you'd like to pause." onClose={onClose} />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[30, 60, 90].map((d) => (
                    <button key={d} onClick={() => onPause(d)} className="rounded-2xl border border-ink/15 py-4 text-[13px] font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white">
                      {d} days
                    </button>
                  ))}
                </div>
              </>
            )}
            {modal === "cancel" && (
              <>
                <ModalTitle title="Are you sure?" sub={`Your next charge of $${PATIENT.nextChargeAmount.toFixed(2)} on ${PATIENT.nextChargeDate} will not be processed.`} onClose={onClose} />
                <div className="mt-5 space-y-2">
                  <button onClick={onClose} className="w-full rounded-full py-3.5 text-[14px] font-semibold text-white" style={{ background: INK }}>Keep my program</button>
                  <button onClick={onCancel} className="w-full rounded-full border border-ink/15 py-3.5 text-[14px] font-medium text-ink/70">Cancel anyway</button>
                </div>
              </>
            )}
            {modal === "switch" && (
              <>
                <ModalTitle title="Switch plan" sub="Pick the cadence that fits your goals." onClose={onClose} />
                <div className="mt-4 space-y-2">
                  {[
                    { name: "Monthly", price: 299, sub: "Billed every month" },
                    { name: "3-Month", price: 237, sub: "Billed every 3 months · current", current: true },
                    { name: "6-Month", price: 237, sub: "Billed every 6 months · best value" },
                  ].map((p) => (
                    <button key={p.name} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${p.current ? "border-ink bg-ink/[.03]" : "border-ink/15 hover:border-ink/40"}`}>
                      <div>
                        <div className="text-[14px] font-semibold text-ink">{p.name}</div>
                        <div className="text-[11.5px] text-ink/55">{p.sub}</div>
                      </div>
                      <div className="ml-auto text-[15px] font-semibold text-ink">${p.price}<span className="text-[11px] font-normal text-ink/50">/mo</span></div>
                    </button>
                  ))}
                </div>
              </>
            )}
            {modal === "payment" && (
              <>
                <ModalTitle title="Update payment method" sub="Your card details are handled by Stripe." onClose={onClose} />
                <div className="mt-4 rounded-2xl border border-dashed border-ink/20 p-6 text-center text-[13px] text-ink/60">
                  A secure Stripe form would open here.
                </div>
              </>
            )}
            {modal === "address" && (
              <>
                <ModalTitle title="Update shipping address" sub="We'll ship your next order here." onClose={onClose} />
                <div className="mt-4 space-y-2">
                  <Field label="Address line 1" defaultValue={PATIENT.address1} />
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="City" defaultValue={PATIENT.city} />
                    <Field label="State" defaultValue={PATIENT.state} />
                    <Field label="ZIP" defaultValue={PATIENT.zip} />
                  </div>
                  <button className="mt-2 w-full rounded-full py-3 text-[14px] font-semibold text-white" style={{ background: INK }}>Save</button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalTitle({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-[18px] font-semibold tracking-tight text-ink">{title}</div>
        <div className="mt-1 text-[13px] text-ink/60">{sub}</div>
      </div>
      <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--color-mist)]/60 text-ink/60"><X className="h-4 w-4" /></button>
    </div>
  );
}

/* ────────────  Settings  ──────────── */
function SettingsTab() {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  return (
    <div className="px-5 pt-5">
      <SettingsGroup title="Personal Info">
        <Field label="First name" defaultValue={PATIENT.firstName} />
        <Field label="Last name" defaultValue={PATIENT.lastName} />
        <Field label="Email" defaultValue={PATIENT.email} disabled hint="Contact support to change" />
        <Field label="Phone" defaultValue={PATIENT.phone} />
        <Field label="Date of birth" defaultValue={PATIENT.dob} disabled />
        <SaveButton />
      </SettingsGroup>

      <SettingsGroup title="Emergency Contact">
        <Field label="Emergency contact name" defaultValue={PATIENT.emergencyName} />
        <Field label="Emergency contact phone" defaultValue={PATIENT.emergencyPhone} />
        <SaveButton />
      </SettingsGroup>

      <SettingsGroup title="Shipping Address">
        <Field label="Address line 1" defaultValue={PATIENT.address1} />
        <div className="grid grid-cols-3 gap-2">
          <Field label="City" defaultValue={PATIENT.city} />
          <Field label="State" defaultValue={PATIENT.state} />
          <Field label="ZIP" defaultValue={PATIENT.zip} />
        </div>
        <SaveButton />
      </SettingsGroup>

      <SettingsGroup title="Notifications">
        <Toggle label="Email notifications" on={email} onChange={setEmail} />
        <Toggle label="SMS notifications" on={sms} onChange={setSms} />
        <p className="mt-2 text-[11.5px] leading-relaxed text-ink/50">
          5 days before billing · shipment dispatched · physician message replied · prescription approved
        </p>
      </SettingsGroup>

      <SettingsGroup title="Account">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-mist)]/60 py-3 text-[13.5px] font-medium text-ink/80 transition hover:bg-[color:var(--color-mist)]">
          <LogOut className="h-4 w-4" /> Log out
        </button>
        <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-ink/45">
          <a href="/terms" className="hover:text-ink/70">Terms</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-ink/70">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-ink/70">HIPAA Notice</a>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1 text-[10.5px] text-ink/40">
          <ShieldCheck className="h-3 w-3" /> Secured with 256-bit encryption
        </div>
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/55">{title}</h2>
      <div className="space-y-2 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-4">{children}</div>
    </section>
  );
}

function Field({ label, defaultValue, disabled, hint }: { label: string; defaultValue: string; disabled?: boolean; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink/50">{label}</div>
      <input
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded-xl border border-[color:var(--color-hairline)] bg-white px-3.5 py-2.5 text-[14px] text-ink transition focus:border-ink focus:outline-none disabled:bg-[color:var(--color-mist)]/40 disabled:text-ink/50"
      />
      {hint && <div className="mt-1 text-[10.5px] text-ink/40">{hint}</div>}
    </label>
  );
}

function SaveButton() {
  return <button className="mt-2 w-full rounded-full py-3 text-[13.5px] font-semibold text-white transition" style={{ background: INK }}>Save changes</button>;
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between rounded-xl border border-transparent px-1 py-2 text-left transition hover:border-[color:var(--color-hairline)]">
      <div className="text-[14px] font-medium text-ink">{label}</div>
      <div className="relative h-6 w-11 rounded-full transition" style={{ background: on ? PINK : "#E4E0D7" }}>
        <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ left: on ? 22 : 2 }} />
      </div>
    </button>
  );
}

/* ────────────  Primitives  ──────────── */
function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl border p-5 ${accent ? "border-transparent bg-gradient-to-br from-white to-[#FFF3F1]" : "border-[color:var(--color-hairline)] bg-white"}`}
      style={accent ? { boxShadow: "0 12px 40px -20px rgba(238,114,115,0.35)" } : undefined}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ icon, title, pill }: { icon: React.ReactNode; title: string; pill?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--color-mist)]/60 text-ink/70">{icon}</div>
      <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">{title}</div>
      {pill && (
        <span className="ml-auto rounded-full bg-ink/[.06] px-2.5 py-1 text-[10.5px] font-medium text-ink/70">{pill}</span>
      )}
    </div>
  );
}

// used to satisfy TS for unused imports on prod builds where tree-shake keeps them
void useMemo;
