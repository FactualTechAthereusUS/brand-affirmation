import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Filter,
  Info,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Pill,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User2,
  X,
  Zap,
  RefreshCw,
} from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import drScottNass from "@/assets/dr-scott-nass.png.asset.json";
import {
  hydratePhysicianFromStorage,
  physicianActions,
  QUICK_REPLIES,
  REJECT_REASONS,
  usePhysician,
  type Case,
  type CaseStatus,
  type Flag,
  type Refill,
  type Thread,
} from "@/lib/physician/store";

export const Route = createFileRoute("/portal/physician")({
  head: () => ({
    meta: [
      { title: "Physician portal — Blissley" },
      { name: "description", content: "Async case review and refill approval for Blissley physicians." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PhysicianPortal,
});

/* ============================================================
   Root shell
   ============================================================ */
function PhysicianPortal() {
  const nav = useNavigate();
  const session = usePhysician((s) => s.session);
  const tab = usePhysician((s) => s.ui.tab);
  const demoBarOpen = usePhysician((s) => s.ui.demoBarOpen);

  useEffect(() => { hydratePhysicianFromStorage(); }, []);
  useEffect(() => {
    if (!session) physicianActions.signIn("scott.nass@blissley.md"); // auto for demo
  }, [session]);

  return (
    <div className="min-h-screen bg-white text-ink" style={{ paddingBottom: demoBarOpen ? 96 : 0 }}>
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:pl-0">
          <TopBar onSignOut={() => { physicianActions.signOut(); nav({ to: "/login/physician" }); }} />
          <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 md:px-8 lg:pb-10">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {tab === "queue" && <QueueTab />}
                {tab === "refills" && <RefillsTab />}
                {tab === "messages" && <MessagesTab />}
                {tab === "dashboard" && <DashboardTab />}
                {tab === "profile" && <ProfileTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <BottomNav />
      <CaseReviewSheet />
      <ESignModal />
      <DemoBar />
      <Toasts />
    </div>
  );
}

/* ============================================================
   Sidebar (desktop) + BottomNav (mobile)
   ============================================================ */
const NAV = [
  { id: "queue", label: "Case queue", icon: ClipboardList },
  { id: "refills", label: "Refills", icon: RefreshCw },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User2 },
] as const;

function Sidebar() {
  const tab = usePhysician((s) => s.ui.tab);
  const newCases = usePhysician((s) => s.cases.filter((c) => c.status === "new").length);
  const pendingRefills = usePhysician((s) => s.refills.filter((r) => r.status === "pending").length);
  const unread = usePhysician((s) => s.messages.filter((m) => m.from === "patient" && !m.read).length);

  const badge: Record<string, number> = { queue: newCases, refills: pendingRefills, messages: unread };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-ink/8 bg-white lg:block">
      <div className="flex h-full flex-col p-5">
        <div className="flex items-center gap-2 pb-6">
          <img src={blissleyLogo.url} alt="Blissley" className="h-7" />
          <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/60">
            MD
          </span>
        </div>
        <nav className="space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            const count = badge[n.id];
            return (
              <button
                key={n.id}
                onClick={() => physicianActions.setTab(n.id as never)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {n.label}
                </span>
                {count ? (
                  <span
                    className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      active ? "bg-white text-ink" : "bg-[#ee7273] text-white"
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-ink/10 bg-[#faf9f6] p-4">
          <div className="flex items-center gap-3">
            <img src={drScottNass.url} alt="" className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Dr. Scott Nass</div>
              <div className="truncate text-[11px] text-ink/50">MD · 18 states</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function BottomNav() {
  const tab = usePhysician((s) => s.ui.tab);
  const newCases = usePhysician((s) => s.cases.filter((c) => c.status === "new").length);
  const pendingRefills = usePhysician((s) => s.refills.filter((r) => r.status === "pending").length);
  const unread = usePhysician((s) => s.messages.filter((m) => m.from === "patient" && !m.read).length);
  const badge: Record<string, number> = { queue: newCases, refills: pendingRefills, messages: unread };
  const openCase = usePhysician((s) => s.ui.openCaseId);
  if (openCase) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-white/90 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = tab === n.id;
          const count = badge[n.id];
          return (
            <button
              key={n.id}
              onClick={() => physicianActions.setTab(n.id as never)}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium ${active ? "text-ink" : "text-ink/45"}`}
            >
              <Icon className="h-5 w-5" />
              <span>{n.label.split(" ")[0]}</span>
              {count ? (
                <span className="absolute right-1/4 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#ee7273] px-1 text-[9px] font-bold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
              {active && <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-ink" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ============================================================
   Top bar
   ============================================================ */
function TopBar({ onSignOut }: { onSignOut: () => void }) {
  const licenseAlert = usePhysician((s) => s.demo.license);
  const [menu, setMenu] = useState(false);

  return (
    <>
      {licenseAlert !== "none" && (
        <div className={`${licenseAlert === "d7" ? "bg-[#ee7273] text-white" : "bg-[#f7c948] text-ink"} px-4 py-2 text-center text-xs font-semibold sm:px-6`}>
          <span className="inline-flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            {licenseAlert === "d7"
              ? "URGENT: Your California license expires in 7 days. Renew immediately to keep prescribing."
              : "Reminder: Your California license expires in 30 days. Renew soon to avoid queue interruption."}
          </span>
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-ink/8 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={blissleyLogo.url} alt="Blissley" className="h-6" />
            <span className="rounded-full border border-ink/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/60">
              Physician
            </span>
          </div>
          <div className="hidden text-sm text-ink/50 lg:block">
            <span className="font-medium text-ink">Good afternoon, Dr. Nass.</span>
            <span className="ml-2">Pacific · 2:14 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden rounded-full border border-ink/10 bg-white p-2 text-ink/60 hover:text-ink sm:inline-flex" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMenu((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1 pl-1 pr-3 text-sm hover:bg-ink/5"
            >
              <img src={drScottNass.url} alt="" className="h-7 w-7 rounded-full object-cover" />
              <span className="hidden font-medium sm:inline">Dr. Nass</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink/50" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-4 top-14 z-40 w-56 rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl sm:right-8"
            >
              <button onClick={() => { setMenu(false); physicianActions.setTab("profile"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-ink/5">
                <User2 className="h-4 w-4" /> Profile & licenses
              </button>
              <button onClick={() => { setMenu(false); physicianActions.setTab("dashboard"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-ink/5">
                <Settings2 className="h-4 w-4" /> Preferences
              </button>
              <div className="my-1 border-t border-ink/8" />
              <button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#ee7273] hover:bg-[#ee7273]/5">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* ============================================================
   Queue tab
   ============================================================ */
function QueueTab() {
  const filters = usePhysician((s) => s.queueFilters);
  const scenario = usePhysician((s) => s.demo.queue);
  const allCases = usePhysician((s) => s.cases);

  const cases = useMemo(() => {
    let arr = allCases.filter((c) => c.status !== "approved" && c.status !== "rejected");
    if (scenario === "empty") arr = [];
    if (scenario === "critical") arr = arr.filter((c) => c.flags.some((f) => f.severity === "warn" || f.severity === "critical")).slice(0, 3);
    if (scenario === "heavy") arr = [...arr, ...arr, ...arr].slice(0, 18);
    if (filters.product !== "all") arr = arr.filter((c) => c.product === filters.product);
    if (filters.flag === "flagged") arr = arr.filter((c) => c.flags.length > 0);
    if (filters.flag === "clean") arr = arr.filter((c) => c.flags.length === 0);
    if (filters.state !== "all") arr = arr.filter((c) => c.patient.state === filters.state);
    return arr.sort((a, b) => a.submittedAt - b.submittedAt);
  }, [allCases, filters, scenario]);

  const oldest = cases[0];
  const oldestHrs = oldest ? Math.round((Date.now() - oldest.submittedAt) / 3600_000) : 0;

  return (
    <div className="pt-6 sm:pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Case queue</div>
          <h1 className="mt-1 font-hero text-2xl tracking-tight text-ink sm:text-3xl">
            {cases.length === 0 ? "You're all caught up." : `${cases.length} ${cases.length === 1 ? "case" : "cases"} waiting`}
          </h1>
          {oldest && (
            <p className="mt-1 text-sm text-ink/55">
              Oldest submitted {oldestHrs}h ago · SLA target 24h
            </p>
          )}
        </div>
        <QueueStats />
      </div>

      <QueueFilters />

      {cases.length === 0 ? <EmptyQueue /> : (
        <div className="mt-5 space-y-3">
          {cases.map((c) => (<CaseCard key={c.id + c.submittedAt} c={c} />))}
        </div>
      )}
    </div>
  );
}

function QueueStats() {
  const stats = usePhysician((s) => s.stats);
  return (
    <div className="flex gap-4 text-right">
      <Stat value={stats.reviewedToday} label="Reviewed today" />
      <Stat value={`${Math.round(stats.avgReviewSec / 60)}m ${stats.avgReviewSec % 60}s`} label="Avg / case" />
      <Stat value={`${stats.approvalRate}%`} label="Approval rate" />
    </div>
  );
}
function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-left">
      <div className="text-lg font-semibold tabular-nums text-ink sm:text-xl">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">{label}</div>
    </div>
  );
}

function QueueFilters() {
  const f = usePhysician((s) => s.queueFilters);
  const states = usePhysician((s) => Array.from(new Set(s.cases.map((c) => c.patient.state))).sort());
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">
        <Filter className="h-3 w-3" /> Filters
      </span>
      <Segmented
        value={f.product}
        onChange={(v) => physicianActions.setFilter("product", v as never)}
        options={[{ v: "all", l: "All meds" }, { v: "semaglutide", l: "Semaglutide" }, { v: "tirzepatide", l: "Tirzepatide" }]}
      />
      <Segmented
        value={f.flag}
        onChange={(v) => physicianActions.setFilter("flag", v as never)}
        options={[{ v: "all", l: "All" }, { v: "flagged", l: "Flagged only" }, { v: "clean", l: "Clean only" }]}
      />
      <select
        value={f.state}
        onChange={(e) => physicianActions.setFilter("state", e.target.value as never)}
        className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 focus:outline-none"
      >
        <option value="all">All states</option>
        {states.map((s) => (<option key={s}>{s}</option>))}
      </select>
    </div>
  );
}

function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { v: T; l: string }[] }) {
  return (
    <div className="inline-flex rounded-full border border-ink/10 bg-white p-0.5 text-xs">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-3 py-1.5 font-medium transition ${value === o.v ? "bg-ink text-white" : "text-ink/60 hover:text-ink"}`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function EmptyQueue() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-3xl border border-ink/10 bg-white p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#4a7c6f]/10 text-[#4a7c6f]">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <h2 className="mt-5 font-hero text-2xl text-ink">Nothing waiting. Great work.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
        We'll ping you the moment a new intake comes in. In the meantime, catch up on refills or check messages.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => physicianActions.setTab("refills")} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90">
          Review refills
        </button>
        <button onClick={() => physicianActions.setTab("messages")} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 hover:text-ink">
          Check messages
        </button>
      </div>
    </motion.div>
  );
}

function CaseCard({ c }: { c: Case }) {
  const hrs = Math.round((Date.now() - c.submittedAt) / 3600_000);
  const sla: "ok" | "warn" | "over" = hrs < 12 ? "ok" : hrs < 24 ? "warn" : "over";
  const flagged = c.flags.length > 0;

  return (
    <motion.button
      layout
      whileHover={{ y: -1 }}
      onClick={() => physicianActions.openCase(c.id)}
      className="group block w-full rounded-3xl border border-ink/8 bg-white p-4 text-left transition hover:border-ink/20 hover:shadow-[0_8px_28px_-16px_rgba(0,0,0,0.15)] sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={c.status} />
            {flagged && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ee7273]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#ee7273]">
                <AlertTriangle className="h-3 w-3" /> {c.flags.length} flag{c.flags.length > 1 ? "s" : ""}
              </span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">
              {c.product}
            </span>
          </div>
          <h3 className="mt-2 font-hero text-lg tracking-tight text-ink">
            {c.patient.firstName} {c.patient.lastName}
            <span className="ml-2 text-sm font-normal text-ink/45">
              · {c.patient.age}{c.patient.sex} · {c.patient.state} · BMI {c.patient.bmi}
            </span>
          </h3>
          <p className={`mt-1 text-sm ${flagged ? "text-[#ee7273]" : "text-ink/55"}`}>{c.flagSummary}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-xs font-semibold ${sla === "over" ? "text-[#ee7273]" : sla === "warn" ? "text-[#c48a2a]" : "text-ink/60"}`}>
              {hrs}h waiting
            </div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink/40">SLA {sla === "over" ? "over" : "on track"}</div>
          </div>
          <ChevronRight className="h-5 w-5 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60" />
        </div>
      </div>
    </motion.button>
  );
}

function StatusPill({ status }: { status: CaseStatus }) {
  const map: Record<CaseStatus, { l: string; c: string }> = {
    new: { l: "New", c: "bg-ink text-white" },
    in_review: { l: "In review", c: "bg-[#f2ede4] text-ink" },
    awaiting_info: { l: "Awaiting info", c: "bg-[#f7c948]/20 text-[#8a6a10]" },
    approved: { l: "Approved", c: "bg-[#4a7c6f]/15 text-[#4a7c6f]" },
    rejected: { l: "Rejected", c: "bg-[#ee7273]/15 text-[#ee7273]" },
  };
  const { l, c } = map[status];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${c}`}>{l}</span>;
}

/* ============================================================
   Case review sheet — full-screen scroll of 8 panels
   ============================================================ */
function CaseReviewSheet() {
  const openId = usePhysician((s) => s.ui.openCaseId);
  const c = usePhysician((s) => s.cases.find((x) => x.id === s.ui.openCaseId) ?? null);

  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openId]);

  return (
    <AnimatePresence>
      {c && openId && (
        <motion.div
          key={c.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#faf9f6]"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="flex h-full flex-col"
          >
            <ReviewHeader c={c} />
            <div className="flex-1 overflow-y-auto pb-40">
              <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
                <PanelSnapshot c={c} />
                <PanelFlags c={c} />
                <PanelIntake c={c} />
                <PanelGLP1 c={c} />
                <PanelRx c={c} />
                <PanelNoteToPatient c={c} />
                <PanelInternalNote c={c} />
                <PanelAudit c={c} />
              </div>
            </div>
            <ReviewActionBar c={c} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReviewHeader({ c }: { c: Case }) {
  return (
    <header className="sticky top-0 z-10 border-b border-ink/8 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={physicianActions.closeCase} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink/70 hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to queue</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="min-w-0 text-center">
          <div className="truncate text-sm font-semibold text-ink">
            {c.patient.firstName} {c.patient.lastName}
          </div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink/50">Case · {c.id}</div>
        </div>
        <StatusPill status={c.status} />
      </div>
    </header>
  );
}

function Panel({ title, icon: Icon, children, tone = "default" }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; tone?: "default" | "warn" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl border bg-white p-5 sm:p-6 ${tone === "warn" ? "border-[#ee7273]/25 ring-1 ring-[#ee7273]/10" : "border-ink/8"}`}
    >
      <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      {children}
    </motion.section>
  );
}

function PanelSnapshot({ c }: { c: Case }) {
  const rows: [string, string][] = [
    ["Age / sex", `${c.patient.age}${c.patient.sex}`],
    ["State", c.patient.state],
    ["Height", `${Math.floor(c.patient.heightIn / 12)}'${c.patient.heightIn % 12}"`],
    ["Starting weight", `${c.patient.startingWeight} lbs`],
    ["BMI", String(c.patient.bmi)],
    ["Product requested", c.product],
    ["Submitted", new Date(c.submittedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })],
    ["Email", c.patient.email],
  ];
  return (
    <Panel title="Patient snapshot" icon={User2}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/40">{k}</div>
            <div className="mt-0.5 text-sm font-medium text-ink">{v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PanelFlags({ c }: { c: Case }) {
  if (c.flags.length === 0) {
    return (
      <Panel title="Clinical flags" icon={ShieldCheck}>
        <div className="flex items-center gap-3 rounded-2xl bg-[#4a7c6f]/8 p-4 text-sm text-[#3a6459]">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          No flags. All intake responses within safe protocol.
        </div>
      </Panel>
    );
  }
  return (
    <Panel title={`Clinical flags · ${c.flags.length}`} icon={AlertTriangle} tone="warn">
      <div className="space-y-2.5">
        {c.flags.map((f) => (<FlagRow key={f.id} f={f} />))}
      </div>
    </Panel>
  );
}
function FlagRow({ f }: { f: Flag }) {
  const tones = {
    info: "bg-[#eef4ff] text-[#1D437B] border-[#1D437B]/15",
    warn: "bg-[#fff5e5] text-[#8a5f0a] border-[#c48a2a]/25",
    critical: "bg-[#ee7273]/8 text-[#8a2a2b] border-[#ee7273]/25",
  } as const;
  const Icon = f.severity === "info" ? Info : AlertTriangle;
  return (
    <div className={`rounded-2xl border p-3.5 ${tones[f.severity]}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{f.label}</div>
          <div className="mt-0.5 text-xs opacity-80">{f.detail}</div>
        </div>
      </div>
    </div>
  );
}

function PanelIntake({ c }: { c: Case }) {
  return (
    <Panel title="Intake responses" icon={FileText}>
      <div className="space-y-5">
        {c.intake.map((g) => (
          <div key={g.title}>
            <div className="mb-2 text-xs font-semibold text-ink/70">{g.title}</div>
            <div className="divide-y divide-ink/6 rounded-2xl border border-ink/8">
              {g.items.map((it, i) => (
                <div key={i} className="grid grid-cols-[140px_1fr] gap-4 p-3 text-sm sm:grid-cols-[180px_1fr]">
                  <div className="text-ink/50">{it.q}</div>
                  <div className="text-ink">{it.a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PanelGLP1({ c }: { c: Case }) {
  if (!c.glp1.taking) {
    return (
      <Panel title="GLP-1 history" icon={Pill}>
        <div className="text-sm text-ink/60">Patient reports no prior GLP-1 use. Start at step 1 titration.</div>
      </Panel>
    );
  }
  return (
    <Panel title="Currently on GLP-1" icon={Pill}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Kv k="Last injection" v={c.glp1.lastInjectionDate ?? "—"} />
        <Kv k="Units" v={c.glp1.lastInjectionUnits ? String(c.glp1.lastInjectionUnits) : "—"} />
        <Kv k="Months on" v={c.glp1.monthsOn ? String(c.glp1.monthsOn) : "—"} />
      </div>
      <p className="mt-4 rounded-xl bg-[#eef4ff] p-3 text-xs text-[#1D437B]">
        Continuity of care — consider matching or stepping up dose vs. resetting titration.
      </p>
    </Panel>
  );
}
function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-[#faf9f6] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">{k}</div>
      <div className="mt-0.5 text-sm font-medium text-ink">{v}</div>
    </div>
  );
}

function PanelRx({ c }: { c: Case }) {
  const rx = c.rx;
  return (
    <Panel title="Prescription" icon={Sparkles}>
      <div className="rounded-2xl border border-ink/10 bg-[#faf9f6] p-4">
        <div className="text-lg font-semibold text-ink">{rx.drug}</div>
        <div className="mt-0.5 text-sm text-ink/60">{rx.strength} · {rx.dose} · {rx.frequency}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <RxField label="Strength" value={rx.strength} options={["2mg/mL", "5mg/mL", "10mg/mL", "15mg/mL"]} onChange={(v) => physicianActions.updateRx(c.id, { strength: v })} />
        <RxField label="Dose" value={rx.dose} options={["0.25mg", "0.5mg", "1.0mg", "2.5mg", "5mg", "7.5mg", "10mg"]} onChange={(v) => physicianActions.updateRx(c.id, { dose: v })} />
        <RxField label="Refills" value={String(rx.refills)} options={["0", "1", "2", "3"]} onChange={(v) => physicianActions.updateRx(c.id, { refills: parseInt(v, 10) })} />
      </div>
      <div className="mt-4">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">SIG (patient instructions)</label>
        <textarea
          value={rx.sig}
          onChange={(e) => physicianActions.updateRx(c.id, { sig: e.target.value })}
          rows={3}
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white p-3 text-sm focus:border-ink/40 focus:outline-none"
        />
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-ink/50">
        <Package className="h-3.5 w-3.5" /> Pharmacy: <span className="font-medium text-ink/70">{rx.pharmacy}</span>
      </div>
    </Panel>
  );
}
function RxField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/40 focus:outline-none">
        {options.map((o) => (<option key={o}>{o}</option>))}
      </select>
    </label>
  );
}

function PanelNoteToPatient({ c }: { c: Case }) {
  return (
    <Panel title="Note to patient (visible)" icon={MessageSquare}>
      <textarea
        value={c.patientNote}
        onChange={(e) => physicianActions.setPatientNote(c.id, e.target.value)}
        placeholder="Optional note the patient will see on approval, rejection, or info request. Keep supportive and specific."
        rows={4}
        className="w-full rounded-xl border border-ink/10 bg-white p-3 text-sm focus:border-ink/40 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {QUICK_REPLIES.slice(0, 3).map((q, i) => (
          <button key={i} onClick={() => physicianActions.setPatientNote(c.id, q)} className="rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] text-ink/60 hover:text-ink">
            Template {i + 1}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function PanelInternalNote({ c }: { c: Case }) {
  return (
    <Panel title="Internal note (audit only)" icon={ClipboardList}>
      <textarea
        value={c.internalNote}
        onChange={(e) => physicianActions.setInternalNote(c.id, e.target.value)}
        placeholder="Not shown to patient. Rationale, dose choice, discussed alternatives, etc."
        rows={3}
        className="w-full rounded-xl border border-ink/10 bg-white p-3 text-sm focus:border-ink/40 focus:outline-none"
      />
    </Panel>
  );
}

function PanelAudit({ c }: { c: Case }) {
  const events = [
    { t: "Submitted by patient", at: c.submittedAt },
    ...(c.openedAt ? [{ t: "Opened by Dr. Nass", at: c.openedAt }] : []),
    ...(c.status === "approved" ? [{ t: "Approved & signed", at: Date.now() }] : []),
    ...(c.status === "awaiting_info" ? [{ t: "Info requested from patient", at: Date.now() }] : []),
    ...(c.status === "rejected" ? [{ t: `Rejected — ${c.rejectReason ?? "reason"}`, at: Date.now() }] : []),
  ];
  return (
    <Panel title="Audit trail" icon={Clock}>
      <ol className="space-y-3">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ink/30" />
            <div>
              <div className="text-ink">{e.t}</div>
              <div className="text-[11px] text-ink/45">{new Date(e.at).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function ReviewActionBar({ c }: { c: Case }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/8 bg-white/95 backdrop-blur-lg" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="hidden text-xs text-ink/50 sm:block">
          Signing as <span className="font-medium text-ink">Dr. Scott Nass, MD</span> · NPI 1568588839
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
          <button
            onClick={() => physicianActions.openESign("info")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink/80 hover:bg-ink/5"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Request info</span>
            <span className="sm:hidden">Info</span>
          </button>
          <button
            onClick={() => physicianActions.openESign("reject")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ee7273]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#ee7273] hover:bg-[#ee7273]/5"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => physicianActions.openESign("approve")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 hover:bg-ink/90"
          >
            <Check className="h-4 w-4" /> Approve & sign
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   E-sign modal
   ============================================================ */
function ESignModal() {
  const open = usePhysician((s) => s.ui.esignOpen);
  const action = usePhysician((s) => s.ui.esignAction);
  const caseId = usePhysician((s) => s.ui.openCaseId);
  const c = usePhysician((s) => s.cases.find((x) => x.id === s.ui.openCaseId) ?? null);
  const [pin, setPin] = useState("");
  const [reason, setReason] = useState(REJECT_REASONS[0]);

  useEffect(() => { if (open) setPin(""); }, [open]);

  if (!open || !action || !c || !caseId) return null;

  const title = action === "approve" ? "Sign & transmit prescription" : action === "reject" ? "Reject this case" : "Send info request";
  const cta = action === "approve" ? "Sign with PIN" : action === "reject" ? "Confirm rejection" : "Send request";
  const validPin = pin.length === 4;

  const submit = () => {
    if (action === "approve" && !validPin) return;
    if (action === "approve") physicianActions.confirmApprove(caseId);
    if (action === "reject") physicianActions.reject(caseId, reason);
    if (action === "info") physicianActions.requestInfo(caseId);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">E-signature</div>
              <h3 className="mt-1 font-hero text-xl text-ink">{title}</h3>
            </div>
            <button onClick={physicianActions.closeESign} className="rounded-full p-1.5 text-ink/50 hover:bg-ink/5"><X className="h-4 w-4" /></button>
          </div>

          <div className="mt-4 rounded-2xl border border-ink/10 bg-[#faf9f6] p-4 text-sm">
            <div className="text-ink/60">Patient</div>
            <div className="mt-0.5 font-semibold text-ink">{c.patient.firstName} {c.patient.lastName} · {c.patient.state}</div>
            {action === "approve" && (
              <div className="mt-2 text-ink/70">
                {c.rx.drug} · {c.rx.dose} weekly · {c.rx.refills} refills
              </div>
            )}
          </div>

          {action === "reject" && (
            <div className="mt-4">
              <label className="text-xs font-medium text-ink/70">Reason (logged in audit trail)</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm focus:border-ink/40 focus:outline-none">
                {REJECT_REASONS.map((r) => (<option key={r}>{r}</option>))}
              </select>
            </div>
          )}

          {action === "approve" && (
            <div className="mt-4">
              <label className="text-xs font-medium text-ink/70">Enter your 4-digit signing PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-3 text-center text-2xl tracking-[0.6em] focus:border-ink/40 focus:outline-none"
              />
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink/50">
                <ShieldCheck className="h-3 w-3" /> Demo PIN: 1234 · 21 CFR Part 11 compliant
              </p>
            </div>
          )}

          <button
            onClick={submit}
            disabled={action === "approve" && !validPin}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:opacity-40 ${
              action === "reject" ? "bg-[#ee7273] text-white hover:bg-[#e05f60]" : "bg-ink text-white hover:bg-ink/90"
            }`}
          >
            {cta}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ============================================================
   Refills tab
   ============================================================ */
function RefillsTab() {
  const scenario = usePhysician((s) => s.demo.refill);
  const all = usePhysician((s) => s.refills);
  const refills = useMemo(() => {
    if (scenario === "clean") return all.filter((r) => !r.flagged);
    if (scenario === "new-med") return all.filter((r) => r.id === "r-new-med" || !r.flagged);
    if (scenario === "regain") return all.filter((r) => r.id === "r-regain" || !r.flagged);
    return all;
  }, [all, scenario]);

  const pending = refills.filter((r) => r.status === "pending");
  return (
    <div className="pt-6 sm:pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Refills</div>
          <h1 className="mt-1 font-hero text-2xl tracking-tight text-ink sm:text-3xl">
            {pending.length} refill{pending.length === 1 ? "" : "s"} to approve
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            Each row includes the patient's monthly check-in. Approve to release the next 28-day supply.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            disabled={pending.length === 0}
            onClick={() => pending.forEach((r) => physicianActions.approveRefill(r.id))}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-40"
          >
            <Zap className="h-4 w-4" /> Approve all clean
          </button>
        </div>
      </div>

      {pending.length === 0 ? (
        <EmptyState title="No refills pending" body="Great — you're caught up. New refill check-ins arrive weekly." />
      ) : (
        <div className="mt-6 space-y-3">
          {pending.map((r) => (<RefillCard key={r.id} r={r} />))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink/5 text-ink/60"><CheckCircle2 className="h-5 w-5" /></div>
      <h3 className="mt-4 font-hero text-xl text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/55">{body}</p>
    </div>
  );
}

function RefillCard({ r }: { r: Refill }) {
  const [expanded, setExpanded] = useState(r.flagged);
  const ci = r.checkIn;
  const trendGood = ci.weightDelta < -5;
  return (
    <motion.div layout className={`rounded-3xl border bg-white p-4 sm:p-5 ${r.flagged ? "border-[#ee7273]/25 ring-1 ring-[#ee7273]/10" : "border-ink/8"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]">Month {r.monthNumber}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/45">{r.product} · {r.currentDose}</span>
            {r.flagged && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ee7273]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#ee7273]">
                <AlertTriangle className="h-3 w-3" /> Needs review
              </span>
            )}
          </div>
          <h3 className="mt-2 font-hero text-lg tracking-tight text-ink">
            {r.patientFirst} {r.patientLast}
            <span className="ml-2 text-sm font-normal text-ink/45">· {r.state}</span>
          </h3>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold tabular-nums ${trendGood ? "text-[#4a7c6f]" : "text-ink/70"}`}>
            {ci.weightDelta > 0 ? "+" : ""}{ci.weightDelta} lbs
          </div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink/45">Since start</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniKv k="Current weight" v={`${ci.currentWeight} lbs`} />
        <MiniKv k="Last injection" v={new Date(ci.lastInjectionDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
        <MiniKv k="Side effects" v={ci.sideEffects === "none" ? "None" : ci.sideEffects === "nausea" ? "Mild nausea" : "Other"} tone={ci.sideEffects === "none" ? "ok" : "warn"} />
        <MiniKv k="New meds" v={ci.newMeds ? "Yes ⚠" : "None"} tone={ci.newMeds ? "warn" : "ok"} />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 space-y-2 rounded-2xl border border-ink/10 bg-[#faf9f6] p-4 text-sm text-ink/80">
              {ci.sideEffectsDetail && <div><span className="font-semibold text-ink">Side effect detail: </span>{ci.sideEffectsDetail}</div>}
              {ci.newMeds && <div><span className="font-semibold text-ink">New medications: </span>{ci.newMeds}</div>}
              {ci.otherNotes && <div><span className="font-semibold text-ink">Notes: </span>{ci.otherNotes}</div>}
              <div className="pt-2 text-xs text-ink/50">
                Submitted {new Date(ci.submittedAt).toLocaleString()} · Month {ci.monthsOn} on medication
              </div>
              {r.monthNumber >= 3 && (
                <div className="mt-2 rounded-xl bg-[#eef4ff] p-3 text-xs text-[#1D437B]">
                  <Info className="mr-1 inline h-3.5 w-3.5" />
                  90-day review point — verify continued benefit and dose fit.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => setExpanded((v) => !v)} className="text-xs font-semibold text-ink/60 hover:text-ink">
          {expanded ? "Hide check-in details" : "See check-in details"}
        </button>
        <div className="flex gap-2">
          {r.flagged && (
            <button onClick={() => { physicianActions.setTab("messages"); }} className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 hover:text-ink">
              Message patient
            </button>
          )}
          <button onClick={() => physicianActions.approveRefill(r.id)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink/90">
            <Check className="h-3.5 w-3.5" /> Approve refill
          </button>
        </div>
      </div>
    </motion.div>
  );
}
function MiniKv({ k, v, tone = "default" }: { k: string; v: string; tone?: "default" | "ok" | "warn" }) {
  const t = tone === "warn" ? "text-[#ee7273]" : tone === "ok" ? "text-[#4a7c6f]" : "text-ink";
  return (
    <div className="rounded-xl border border-ink/8 bg-[#faf9f6] p-2.5">
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/45">{k}</div>
      <div className={`mt-0.5 text-sm font-medium ${t}`}>{v}</div>
    </div>
  );
}

/* ============================================================
   Messages tab
   ============================================================ */
const PINK = "#ee7273";
const INK_HEX = "#171717";

function initialsOf(f: string, l: string) {
  return `${f[0] ?? ""}${l[0] ?? ""}`.toUpperCase();
}

function PatientAvatar({ first, last, size = 48 }: { first: string; last: string; size?: number }) {
  // Deterministic soft background from initials
  const palette = ["#EAF0F8", "#F5F1E9", "#F0EBE3", "#EFE7DD", "#E8EEE9", "#F3E9E9"];
  const idx = (first.charCodeAt(0) + (last.charCodeAt(0) || 0)) % palette.length;
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full ring-1 ring-black/5"
      style={{ background: palette[idx], width: size, height: size }}
    >
      <span className="text-[13px] font-semibold text-ink/70" style={{ fontSize: size * 0.32 }}>
        {initialsOf(first, last)}
      </span>
    </div>
  );
}

function MessagesTab() {
  const scenario = usePhysician((s) => s.demo.messages);
  const threads = usePhysician((s) => s.threads);
  const activeId = usePhysician((s) => s.ui.activeThreadId);
  const messages = usePhysician((s) => s.messages);

  const list = useMemo(() => {
    let arr = [...threads].sort((a, b) => b.lastActivity - a.lastActivity);
    if (scenario === "clear") arr = arr.filter((t) => !messages.some((m) => m.threadId === t.id && m.from === "patient" && !m.read));
    return arr;
  }, [threads, messages, scenario]);

  const activeThread = threads.find((t) => t.id === activeId) ?? null;

  return (
    <AnimatePresence mode="wait">
      {!activeThread ? (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="px-1 pt-5 md:pt-8 lg:mx-auto lg:w-full lg:max-w-3xl"
        >
          <div className="mt-1 space-y-3">
            {list.length === 0 && <EmptyState title="Inbox zero" body="No open threads waiting. Nice work." />}
            {list.map((t) => (<ThreadCard key={t.id} t={t} />))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#F0EBE3]/50 px-4 py-3 text-[11.5px] leading-relaxed text-ink/60">
            Messages here are reviewed during clinical hours. For life-threatening emergencies, patients must call <span className="font-semibold text-ink">911</span>.
          </div>
        </motion.div>
      ) : (
        <ChatThread key={activeThread.id} t={activeThread} />
      )}
    </AnimatePresence>
  );
}

function ThreadCard({ t }: { t: Thread }) {
  const last = usePhysician((s) => [...s.messages].filter((m) => m.threadId === t.id).sort((a, b) => b.ts - a.ts)[0]);
  const unread = usePhysician((s) => s.messages.filter((m) => m.threadId === t.id && m.from === "patient" && !m.read).length);
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      onClick={() => physicianActions.openThread(t.id)}
      className="group flex w-full items-start gap-3.5 rounded-2xl bg-[#FAFAFA] p-4 text-left transition hover:bg-[#F5F5F7]"
    >
      <div className="relative">
        <PatientAvatar first={t.patientFirst} last={t.patientLast} size={48} />
        {unread > 0 && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white" style={{ background: PINK }} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-[15px] font-semibold text-ink">{t.patientFirst} {t.patientLast}</div>
          {unread > 0 && (
            <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full px-1.5 text-[10px] font-bold text-white" style={{ background: PINK }}>
              {unread}
            </span>
          )}
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-ink/30" />
        </div>
        <div className="mt-0.5 truncate text-[12.5px] text-ink/55">
          {t.product} · Month {t.monthNumber} · {t.currentDose}
        </div>
        <div className={`mt-1.5 truncate text-[12.5px] ${unread > 0 ? "font-medium text-ink/85" : "text-ink/55"}`}>
          {last?.text ?? ""}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-ink/40">
          <span>{humanTime(t.lastActivity)} ago</span>
          {t.waitingHours > 12 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e5] px-1.5 py-0.5 text-[10px] font-semibold text-[#8a6a10]">
              <Clock className="h-2.5 w-2.5" /> Waiting {t.waitingHours}h
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function humanTime(ts: number) {
  const mins = Math.round((Date.now() - ts) / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

function ChatThread({ t }: { t: Thread }) {
  const messages = usePhysician((s) => s.messages.filter((m) => m.threadId === t.id).sort((a, b) => a.ts - b.ts));
  const quickOpen = usePhysician((s) => s.ui.quickRepliesOpen);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    if (!draft.trim()) return;
    physicianActions.sendMessage(t.id, draft.trim());
    setDraft("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const meGradient = `linear-gradient(135deg, ${INK_HEX} 0%, #2d2d2d 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className="flex h-[calc(100vh-3.5rem-4rem)] flex-col bg-white lg:h-[calc(100vh-3.5rem)] lg:mx-auto lg:w-full lg:max-w-3xl"
    >
      {/* Sticky liquid-glass header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/90 px-3 pb-2 pt-3 backdrop-blur">
        <button
          onClick={() => physicianActions.openThread("")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/50 bg-white/75 text-ink shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/75 px-3 py-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150">
          <PatientAvatar first={t.patientFirst} last={t.patientLast} size={24} />
          <span className="truncate text-[13px] font-semibold text-ink">
            {t.patientFirst} {t.patientLast}
          </span>
          <span className="rounded-md bg-white px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide text-ink/70">
            {t.product === "semaglutide" ? "SEMA" : "TIRZ"}
          </span>
        </div>
        <button
          onClick={physicianActions.toggleQuickReplies}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/50 bg-white/75 text-ink shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150"
          aria-label="Templates"
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Chat body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <div className="flex flex-col items-center pb-6 pt-2 text-center">
          <PatientAvatar first={t.patientFirst} last={t.patientLast} size={64} />
          <div className="mt-3 text-[16px] font-semibold text-ink">
            {t.patientFirst} {t.patientLast}
          </div>
          <div className="mt-0.5 text-[11.5px] text-ink/50">
            {t.product} · Month {t.monthNumber} · {t.currentDose} · Allergies: {t.allergies}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/40">Conversation</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((m) => {
            const time = new Date(m.ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
            if (m.from === "me") {
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <div className="flex max-w-[80%] flex-col items-end md:max-w-[70%]">
                    <div
                      className="rounded-[22px] rounded-br-md px-4 py-2.5 text-[14px] leading-relaxed text-white"
                      style={{ background: meGradient }}
                    >
                      {m.text}
                    </div>
                    <div className="mt-1 flex items-center gap-1 pr-1 text-[10.5px] text-ink/40">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{time}</span>
                    </div>
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                <PatientAvatar first={t.patientFirst} last={t.patientLast} size={28} />
                <div className="flex max-w-[80%] flex-col md:max-w-[70%]">
                  <div className="rounded-[22px] rounded-bl-md bg-[#F0EBE3]/60 px-4 py-2.5 text-[14px] leading-relaxed text-ink">
                    {m.text}
                  </div>
                  <div className="mt-1 pl-2 text-[10.5px] text-ink/40">{time}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick reply templates */}
      <AnimatePresence>
        {quickOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/8 bg-white"
          >
            <div className="space-y-1.5 p-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">Reply templates</div>
              {QUICK_REPLIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setDraft(q); physicianActions.toggleQuickReplies(); requestAnimationFrame(() => inputRef.current?.focus()); }}
                  className="block w-full rounded-xl border border-ink/8 bg-[#faf9f6] p-2.5 text-left text-xs text-ink/70 hover:bg-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div className="border-t border-ink/10 bg-white px-3 pb-3 pt-2.5 md:px-8 md:pb-5 md:pt-4 lg:px-3 lg:pb-3 lg:pt-2.5">
        <div className="flex items-end gap-2 rounded-[28px] border border-ink/10 bg-white px-2 py-1.5 focus-within:border-ink/25">
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/50" aria-label="Attach">
            <span className="text-[20px] leading-none">+</span>
          </button>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            placeholder={`Reply to ${t.patientFirst}…`}
            className="min-h-[36px] max-h-32 flex-1 resize-none bg-transparent py-2 text-[14px] leading-snug text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition disabled:opacity-30"
            style={{ background: draft.trim() ? PINK : INK_HEX }}
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 text-center text-[10.5px] text-ink/45">
          Signing as Dr. Scott Nass, MD · NPI 1568588839 · For emergencies patients call 911
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Dashboard tab
   ============================================================ */
function DashboardTab() {
  const cases = usePhysician((s) => s.cases);
  const refills = usePhysician((s) => s.refills);
  const messages = usePhysician((s) => s.messages);
  const stats = usePhysician((s) => s.stats);
  const phys = usePhysician((s) => s.physician);

  return (
    <div className="pt-6 sm:pt-8">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Dashboard</div>
        <h1 className="mt-1 font-hero text-2xl tracking-tight text-ink sm:text-3xl">Your week at a glance</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BigStat label="New cases waiting" value={cases.filter((c) => c.status === "new").length} tone="coral" />
        <BigStat label="Pending refills" value={refills.filter((r) => r.status === "pending").length} />
        <BigStat label="Unread messages" value={messages.filter((m) => m.from === "patient" && !m.read).length} />
        <BigStat label="Approvals this week" value={cases.filter((c) => c.status === "approved").length + stats.reviewedToday} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-ink/8 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Review speed</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums text-ink">{Math.round(stats.avgReviewSec / 60)}m {stats.avgReviewSec % 60}s</span>
            <span className="text-xs text-[#4a7c6f]">↓ 12s vs last week</span>
          </div>
          <p className="mt-1 text-sm text-ink/55">Average time per case, based on your last 40 reviews.</p>
        </div>
        <div className="rounded-3xl border border-ink/8 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Approval rate</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums text-ink">{stats.approvalRate}%</span>
            <span className="text-xs text-ink/50">Peer avg 89%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
            <div className="h-full rounded-full bg-ink" style={{ width: `${stats.approvalRate}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-ink/8 bg-white p-6">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Licenses</div>
        <div className="flex flex-wrap gap-2">
          {phys.licensedStates.map((s) => (
            <span key={s} className="rounded-full border border-ink/10 bg-[#faf9f6] px-2.5 py-1 text-xs font-medium text-ink/70">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, tone = "default" }: { label: string; value: number | string; tone?: "default" | "coral" }) {
  return (
    <div className={`rounded-3xl border p-5 ${tone === "coral" ? "border-[#ee7273]/20 bg-[#ee7273]/5" : "border-ink/8 bg-white"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">{label}</div>
      <div className={`mt-2 text-4xl font-semibold tabular-nums ${tone === "coral" ? "text-[#ee7273]" : "text-ink"}`}>{value}</div>
    </div>
  );
}

/* ============================================================
   Profile tab
   ============================================================ */
function ProfileTab() {
  const phys = usePhysician((s) => s.physician);
  return (
    <div className="pt-6 sm:pt-8">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Profile</div>
        <h1 className="mt-1 font-hero text-2xl tracking-tight text-ink sm:text-3xl">Your credentials & preferences</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-ink/8 bg-white p-6 text-center">
          <img src={drScottNass.url} alt="" className="mx-auto h-24 w-24 rounded-full object-cover" />
          <div className="mt-4 font-hero text-xl text-ink">Dr. {phys.name}</div>
          <div className="text-xs text-ink/60">{phys.credentials}</div>
          <div className="mt-4 space-y-1 rounded-xl border border-ink/8 bg-[#faf9f6] p-3 text-left text-xs">
            <div><span className="text-ink/50">NPI:</span> <span className="font-medium">{phys.npi}</span></div>
            <div><span className="text-ink/50">DEA:</span> <span className="font-medium">{phys.dea}</span></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-ink/8 bg-white p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">State licenses</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-ink/8">
              <div className="grid grid-cols-3 gap-2 border-b border-ink/8 bg-[#faf9f6] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/50">
                <div>State</div><div>Expires</div><div className="text-right">Status</div>
              </div>
              {phys.licensedStates.slice(0, 8).map((s) => {
                const exp = phys.licenseExpiry[s];
                const days = exp ? Math.floor((new Date(exp).getTime() - Date.now()) / 86400_000) : 999;
                return (
                  <div key={s} className="grid grid-cols-3 items-center gap-2 border-b border-ink/6 px-4 py-2.5 text-sm last:border-0">
                    <div className="font-semibold text-ink">{s}</div>
                    <div className="text-ink/60">{exp ?? "—"}</div>
                    <div className="text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        days < 30 ? "bg-[#ee7273]/10 text-[#ee7273]" : days < 90 ? "bg-[#f7c948]/20 text-[#8a6a10]" : "bg-[#4a7c6f]/10 text-[#4a7c6f]"
                      }`}>
                        {days < 30 ? `${days}d left` : "Active"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-3xl border border-ink/8 bg-white p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Preferences</div>
            <div className="mt-3 space-y-3">
              <ToggleRow label="Auto-approve clean refills" hint="Refills with no flags, no new meds, no side effects, and 12+ hrs since check-in." />
              <ToggleRow label="Push notification for new cases" hint="Ping me when a case appears in my queue." />
              <ToggleRow label="Weekly performance email" hint="Sent Sunday evening — review speed, approval rate, patient outcomes." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ToggleRow({ label, hint }: { label: string; hint: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-start justify-between gap-4 border-t border-ink/6 pt-3 first:border-0 first:pt-0">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="mt-0.5 text-xs text-ink/55">{hint}</div>
      </div>
      <button onClick={() => setOn((v) => !v)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${on ? "bg-ink" : "bg-ink/15"}`}>
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

/* ============================================================
   Demo bar — scenario switcher
   ============================================================ */
function DemoBar() {
  const open = usePhysician((s) => s.ui.demoBarOpen);
  const demo = usePhysician((s) => s.demo);

  return (
    <>
      {!open && (
        <button
          onClick={physicianActions.toggleDemoBar}
          className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white shadow-xl lg:bottom-6"
        >
          <Sparkles className="h-3.5 w-3.5" /> Demo
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur-lg"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4px)" }}
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-6 md:px-8">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/60">
                <Sparkles className="h-3 w-3" /> Demo variants
              </div>
              <DemoPick label="Queue" value={demo.queue} options={[["normal","Normal"],["empty","Empty"],["heavy","Heavy"],["critical","Critical only"]]} onChange={(v) => physicianActions.setDemo("queue", v as never)} />
              <DemoPick label="Refills" value={demo.refill} options={[["clean","Clean"],["new-med","New med"],["regain","Regain"]]} onChange={(v) => physicianActions.setDemo("refill", v as never)} />
              <DemoPick label="Messages" value={demo.messages} options={[["unread","With unread"],["clear","Inbox zero"]]} onChange={(v) => physicianActions.setDemo("messages", v as never)} />
              <DemoPick label="License" value={demo.license} options={[["none","OK"],["d30","30d warn"],["d7","7d urgent"]]} onChange={(v) => physicianActions.setDemo("license", v as never)} />
              <div className="ml-auto flex items-center gap-2">
                <button onClick={physicianActions.resetAll} className="rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] font-semibold text-ink/70 hover:text-ink">Reset data</button>
                <button onClick={physicianActions.toggleDemoBar} className="rounded-full p-1.5 text-ink/50 hover:bg-ink/5"><X className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
function DemoPick({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] text-ink/60">
      <span className="font-semibold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[11px] focus:outline-none">
        {options.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
      </select>
    </label>
  );
}

/* ============================================================
   Toasts
   ============================================================ */
function Toasts() {
  const toasts = usePhysician((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2 lg:bottom-20">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-xl ${
              t.kind === "success" ? "bg-ink text-white" : t.kind === "warn" ? "bg-[#ee7273] text-white" : "bg-white text-ink"
            }`}
          >
            {t.kind === "success" && <Check className="h-4 w-4" />}
            {t.kind === "warn" && <AlertTriangle className="h-4 w-4" />}
            {t.kind === "info" && <Info className="h-4 w-4" />}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* Silence unused imports guard */
void Search;
