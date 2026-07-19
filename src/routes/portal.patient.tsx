import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home as HomeIcon, MessageCircle, Package, Settings as SettingsIcon,
  ChevronRight, ChevronLeft, Stethoscope, Clock, CheckCircle2, Send,
  LogOut, Pause, X, Repeat, MapPin, ShieldCheck, Bell, Loader2, Sparkles,
  CreditCard, PlayCircle, AlertCircle, TrendingDown, Activity, Truck, Calendar,
  Plus, ArrowUpRight,
} from "lucide-react";
import badgeCheckPink from "@/assets/badge-check-pink.png.asset.json";
import checkmarkCircle from "@/assets/checkmark-circle.png.asset.json";
import vialSemaglutide from "@/assets/vial-semaglutide.png.asset.json";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import heroSkyWoman from "@/assets/hero-sky-woman.png.asset.json";
import drScottNass from "@/assets/dr-scott-nass.png.asset.json";
import drNassWelcome from "@/assets/dr-nass-welcome.png.asset.json";
import portalWelcomeDoctor from "@/assets/portal-welcome-doctor.png.asset.json";
import portalWelcomeWoman from "@/assets/portal-welcome-woman.png.asset.json";
import onboardingNotifications from "@/assets/onboarding-notifications.jpeg.asset.json";
import { usePortal, actions, hydrateFromStorage, type PlanState } from "@/lib/portal/store";

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

const INK = "#171717";
const PINK = "#ee7273";
const NAVY = "#1D437B";

type Tab = "home" | "messages" | "plan" | "settings";

function PatientPortal() {
  const [tab, setTab] = useState<Tab>("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const session = usePortal((s) => s.session);
  const onboardingDone = usePortal((s) => s.prefs.onboardingComplete);
  const navigate = useNavigate();

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !session) navigate({ to: "/login" });
  }, [hydrated, session, navigate]);

  if (!hydrated || !session) {
    return (
      <div className="min-h-svh grid place-items-center bg-white text-ink/60">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[color:var(--color-mist)]/40 text-ink" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mx-auto flex min-h-svh w-full max-w-[440px] flex-col bg-white shadow-none md:my-6 md:min-h-[calc(100svh-3rem)] md:rounded-[36px] md:shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)] md:ring-1 md:ring-black/5">
        <TopBar onBell={() => setNotifOpen(true)} onLogoLongPress={() => setDevOpen(true)} />
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
        {!onboardingDone && <Onboarding />}
        <NotificationsSheet open={notifOpen} onClose={() => setNotifOpen(false)} onGoto={(t) => { setNotifOpen(false); setTab(t); }} />
        <DevSwitcher open={devOpen} onClose={() => setDevOpen(false)} />
        <Toaster />
      </div>
    </div>
  );
}

/* ─────────── Chrome ─────────── */

function TopBar({ onBell, onLogoLongPress }: { onBell: () => void; onLogoLongPress: () => void }) {
  const unread = usePortal((s) => s.notifications.filter((n) => !n.read).length);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    pressTimer.current = setTimeout(() => onLogoLongPress(), 600);
  };
  const cancel = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/40 bg-white/70 px-5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 md:rounded-t-[36px]">
      <button
        onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel} onPointerCancel={cancel}
        className="flex items-center gap-2.5 select-none" aria-label="Blissley — long-press to open demo controls"
      >
        <img src={blissleyLogo.url} alt="Blissley" className="h-8 w-auto object-contain pointer-events-none" />
      </button>
      <button
        onClick={onBell}
        className="relative grid h-9 w-9 place-items-center rounded-full border border-black/5 bg-white/60 text-ink/70 shadow-sm transition hover:bg-white/90"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: PINK }}>{unread}</span>}
      </button>
    </header>
  );
}

function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const unreadMsgs = usePortal((s) => s.messages.filter((m) => m.from === "them" && !m.read).length);
  const items: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: unreadMsgs },
    { id: "plan", label: "My Plan", icon: Package },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <nav className="pointer-events-none sticky bottom-0 z-30 px-3 pb-3 pt-2 md:rounded-b-[36px]">
      <div className="pointer-events-auto mx-auto flex items-center justify-between rounded-full border border-white/50 bg-white/75 px-2 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150">
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
                <motion.span layoutId="tabpill" className="absolute inset-0 -z-10 rounded-full" style={{ background: "rgba(238,114,115,0.12)" }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <div className="relative">
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                {it.badge && it.badge > 0 && (
                  <span className="absolute -right-1.5 -top-1 grid h-[14px] min-w-[14px] place-items-center rounded-full px-1 text-[8.5px] font-bold text-white" style={{ background: PINK }}>{it.badge}</span>
                )}
              </div>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ─────────── Home (state-driven) ─────────── */
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function HomeTab({ onGoto }: { onGoto: (t: Tab) => void }) {
  const firstName = usePortal((s) => s.patient.firstName);
  const planState = usePortal((s) => s.planState);
  const pauseDays = usePortal((s) => s.pauseDays);
  const nextCharge = usePortal((s) => s.nextCharge);
  const medication = usePortal((s) => s.medication);
  const shipment = usePortal((s) => s.shipments[0]);
  const weightLog = usePortal((s) => s.weightLog);
  const unreadDoc = usePortal((s) => s.messages.find((m) => m.thread === "doc" && m.from === "them" && !m.read));

  const startWeight = weightLog[0]?.lbs ?? 0;
  const currentWeight = weightLog[weightLog.length - 1]?.lbs ?? 0;
  const lost = Math.max(0, startWeight - currentWeight);

  return (
    <div className="pt-5">
      <div className="pl-4 pr-4">
        <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-[24px] font-semibold tracking-tight text-ink">
          {greeting()}, {firstName}.
        </motion.h1>
        <p className="mt-1 text-[13.5px] text-ink/55">{planStateSubline(planState)}</p>
      </div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="relative mx-4 mt-4 overflow-hidden rounded-2xl aspect-[2/1]">
        <img src={heroSkyWoman.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[15px] font-semibold leading-tight text-white drop-shadow-md">{heroLine(planState)}</p>
          <p className="mt-0.5 text-[12.5px] text-white/85 drop-shadow">Keep showing up for yourself, {firstName}.</p>
        </div>
      </motion.div>

      <div className="mt-5 space-y-2.5 px-4">
        <AnimatePresence initial={false}>
          {planState === "paused" && (
            <MotionCard key="paused">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--color-mist)]/70"><Pause className="h-5 w-5 text-ink/70" /></div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-ink">Program paused</div>
                  <div className="mt-0.5 text-[13px] text-ink/60">You're paused for {pauseDays} days. No charges, no shipments.</div>
                  <button onClick={() => actions.resumePlan()} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-white">
                    <PlayCircle className="h-3.5 w-3.5" /> Resume program
                  </button>
                </div>
              </div>
            </MotionCard>
          )}

          {planState === "pending_review" && (
            <MotionCard key="pending"><PendingApproval /></MotionCard>
          )}

          {(planState === "approved_preparing" || planState === "shipped" || planState === "delivered_active" || planState === "refill_processing") && (
            <MotionCard key="approved">
              <div className="flex items-start gap-3">
                <img src={checkmarkCircle.url} alt="Approved" className="h-10 w-10 shrink-0 object-contain" />
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-ink">Prescription Approved</div>
                  <div className="mt-0.5 text-[13px] text-ink/60">
                    {planState === "approved_preparing" && "Your medication is being prepared."}
                    {planState === "shipped" && "In transit — arriving soon."}
                    {planState === "delivered_active" && "Active treatment · staying consistent."}
                    {planState === "refill_processing" && "Refill on the way — check-in complete."}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-ink/50">
                    <img src={badgeCheckPink.url} alt="" className="h-3.5 w-3.5" />
                    Signed by Dr. Scott Nass MD
                  </div>
                </div>
              </div>
            </MotionCard>
          )}

          {planState === "check_in_due" && (
            <MotionCard key="checkin" accent>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-sm"><AlertCircle className="h-5 w-5" style={{ color: PINK }} /></div>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-ink">Check-in required</div>
                  <div className="mt-0.5 text-[13px] text-ink/70">Your next refill is waiting on your monthly check-in.</div>
                  <button onClick={() => onGoto("plan")} className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white" style={{ background: PINK }}>
                    Complete check-in <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </MotionCard>
          )}

          {/* Next dose */}
          {(planState === "delivered_active" || planState === "check_in_due" || planState === "refill_processing") && (
            <MotionCard key="dose">
              <CardHeader
                icon={<Calendar className="h-[18px] w-[18px]" />}
                title="Next Dose"
                pill={doseCountdown(medication.nextDoseAt)}
              />
              <div className="mt-3 text-[17px] font-semibold tracking-tight text-ink">{new Date(medication.nextDoseAt).toLocaleDateString(undefined, { weekday: "long" })} · 8:00 AM</div>
              <div className="text-[13px] text-ink/60">{medication.dose} · {medication.cadence}</div>
            </MotionCard>
          )}

          {/* Shipment */}
          {planState !== "paused" && (
            <MotionCard key="ship">
              <CardHeader
                icon={<Truck className="h-[18px] w-[18px]" />}
                title="Next Shipment"
                pill={shipment.status === "shipped" ? "In transit" : shipment.status === "processing" ? "Preparing" : "Delivered"}
              />
              <div className="mt-3 text-[17px] font-semibold tracking-tight text-ink">Ships {shipment.shipDate}</div>
              <div className="text-[13px] text-ink/60">{shipment.label}</div>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-[#E8E4DC] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                  <img src={vialSemaglutide.url} alt="" className="h-full w-full object-contain p-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold tracking-tight text-ink truncate">{shipment.label}</div>
                  <div className="text-[13px] text-ink/60">Tracking {shipment.tracking?.slice(-8) ?? "—"}</div>
                </div>
                <button
                  disabled={planState === "check_in_due"}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-white py-2 pl-3.5 pr-2 shadow-[0_2px_14px_rgba(0,0,0,0.06)] transition active:scale-[.97] disabled:opacity-40"
                  title={planState === "check_in_due" ? "Complete check-in to ship" : undefined}
                >
                  <span className="text-[13px] font-semibold text-ink">Track</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                  </span>
                </button>
              </div>
              {planState === "check_in_due" && (
                <div className="mt-3 rounded-xl bg-[#FFF3F1] px-3 py-2 text-[11.5px] text-ink/70">Complete your check-in to release this shipment.</div>
              )}
            </MotionCard>
          )}

          {/* Message preview */}
          {unreadDoc && (
            <MotionCard key="msg">
              <button onClick={() => onGoto("messages")} className="flex w-full items-start gap-3 text-left">
                <img src={drScottNass.url} alt="Dr. Nass" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[14px] font-semibold text-ink">Dr. Scott Nass MD</div>
                    <span className="grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: PINK }}>New</span>
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[12.5px] text-ink/70">{unreadDoc.text}</div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 text-ink/30" />
              </button>
            </MotionCard>
          )}

          {/* Progress snapshot */}
          {(planState === "delivered_active" || planState === "check_in_due" || planState === "refill_processing") && (
            <MotionCard key="prog">
              <CardHeader icon={<TrendingDown className="h-[18px] w-[18px]" />} title="Your Progress" />
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-[28px] font-black tracking-tight text-ink">-{lost.toFixed(1)}</div>
                <div className="text-[13px] text-ink/55">lbs since {weightLog[0]?.date ?? "start"}</div>
              </div>
              <MiniSparkline data={weightLog.map((w) => w.lbs)} />
              <button onClick={() => onGoto("plan")} className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink/70 hover:text-ink">
                Log weight <ChevronRight className="h-3 w-3" />
              </button>
            </MotionCard>
          )}

          {/* Next charge */}
          {planState !== "paused" && (
            <MotionCard key="charge" accent>
              <CardHeader
                icon={
                  <svg height="18" width="18" viewBox="0 0 18 18" className="h-[18px] w-[18px] text-ink/70">
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <line x1="1.75" x2="16.25" y1="7.25" y2="7.25" />
                      <line x1="4.25" x2="7.25" y1="11.25" y2="11.25" />
                      <line x1="12.75" x2="13.75" y1="11.25" y2="11.25" />
                      <rect height="10.5" width="14.5" rx="2" ry="2" transform="translate(18 18) rotate(180)" x="1.75" y="3.75" />
                    </g>
                  </svg>
                }
                title="Next Charge"
                pill={`in ${nextCharge.daysAway} days`}
              />
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-[26px] font-black tracking-tight text-ink">${nextCharge.amount.toFixed(2)}</div>
                <div className="text-[13px] text-ink/55">on {nextCharge.date}</div>
              </div>
              <div className="mt-1 text-[13px] text-ink/60">Card ending in 4242</div>
              <button onClick={() => onGoto("plan")} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-[13.5px] font-semibold text-white transition" style={{ background: INK }}>
                Manage plan <ChevronRight className="h-4 w-4" />
              </button>
            </MotionCard>
          )}

          {/* Physician strip */}
          <MotionCard key="doc">
            <div className="flex items-center gap-3">
              <img src={drScottNass.url} alt="Dr. Scott Nass" className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-ink">Dr. Scott Nass MD</div>
                <div className="text-[12.5px] text-ink/55">Your prescribing physician · Board-certified</div>
              </div>
              <button onClick={() => onGoto("messages")} className="ml-auto rounded-full bg-ink/[.06] px-3.5 py-2 text-[12px] font-medium text-ink transition active:scale-[.97]">
                Message
              </button>
            </div>
          </MotionCard>
        </AnimatePresence>

        <p className="pt-2 text-center text-[11px] text-ink/40">
          <Sparkles className="mr-1 inline h-3 w-3" />
          You're on month {medication.monthNumber} of your program.
        </p>
      </div>
    </div>
  );
}

function planStateSubline(s: PlanState): string {
  switch (s) {
    case "pending_review": return "We're preparing your care team review.";
    case "approved_preparing": return "You're approved — medication being prepared.";
    case "shipped": return "Your medication is on its way.";
    case "delivered_active": return "Here's the state of your program today.";
    case "check_in_due": return "Quick check-in required to release your refill.";
    case "refill_processing": return "Check-in complete — refill on the way.";
    case "paused": return "Your program is paused.";
  }
}

function heroLine(s: PlanState): string {
  if (s === "paused") return "Take the time you need.";
  if (s === "check_in_due") return "One quick step to keep going.";
  if (s === "pending_review") return "You're in trusted hands.";
  return "Your program is on track";
}

function doseCountdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const d = Math.max(0, Math.round(diff / 86400_000));
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `In ${d} days`;
}

function PendingApproval() {
  return (
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
      </div>
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 200, h = 44;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-11 w-full">
      <polyline points={pts} fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3" fill={PINK} />
    </svg>
  );
}

/* ─────────── Messages ─────────── */
type ThreadView = "list" | "care" | "doc";

function MessagesTab() {
  const [view, setView] = useState<ThreadView>("list");
  const messages = usePortal((s) => s.messages);
  const careUnread = messages.filter((m) => m.thread === "care" && m.from === "them" && !m.read).length;
  const docUnread = messages.filter((m) => m.thread === "doc" && m.from === "them" && !m.read).length;
  const carePreview = [...messages].reverse().find((m) => m.thread === "care")?.text ?? "";
  const docPreview = [...messages].reverse().find((m) => m.thread === "doc")?.text ?? "";

  const openThread = (t: "care" | "doc") => {
    setView(t);
    actions.markThreadRead(t);
  };

  return (
    <AnimatePresence mode="wait">
      {view === "list" ? (
        <motion.div key="list" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className="px-4 pt-5">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">Messages</h2>
          <p className="mt-1 text-[13.5px] text-ink/55">The people caring for you — one tap away.</p>
          <div className="mt-5 space-y-3">
            <ThreadCard
              onOpen={() => openThread("care")}
              iconBg="#F5F1E9"
              icon={<img src={blissleyLogo.url} alt="" className="h-6 w-6 object-contain" />}
              title="Care Team" subtitle="Billing, shipping, general questions"
              status="Sarah · online now" statusDot={PINK} unread={careUnread} preview={carePreview}
            />
            <ThreadCard
              onOpen={() => openThread("doc")}
              iconBg="#EAF0F8"
              icon={<Stethoscope className="h-5 w-5" style={{ color: NAVY }} />}
              title="Dr. Scott Nass MD" subtitle="Clinical questions · side effects · dosing"
              status="Typically replies within 24 hrs" unread={docUnread} preview={docPreview}
            />
          </div>
          <div className="mt-6 rounded-2xl bg-[color:var(--color-mist)]/50 px-4 py-3 text-[11.5px] leading-relaxed text-ink/60">
            For medical emergencies, call <span className="font-semibold text-ink">911</span>. Messages here are reviewed during clinical hours.
          </div>
        </motion.div>
      ) : (
        <ChatThread key={view} kind={view} onBack={() => setView("list")} />
      )}
    </AnimatePresence>
  );
}

function ThreadCard({ onOpen, iconBg, icon, title, subtitle, status, statusDot, unread, preview }: any) {
  return (
    <motion.button whileTap={{ scale: 0.985 }} onClick={onOpen} className="group flex w-full items-start gap-3.5 rounded-2xl bg-[#FAFAFA] p-4 text-left transition hover:bg-[#F5F5F7]">
      <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: iconBg }}>
        {icon}
        {statusDot && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white" style={{ background: statusDot }} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-[15px] font-semibold text-ink">{title}</div>
          {unread > 0 && <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full px-1.5 text-[10px] font-bold text-white" style={{ background: PINK }}>{unread}</span>}
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-ink/30" />
        </div>
        <div className="mt-0.5 truncate text-[12.5px] text-ink/55">{subtitle}</div>
        <div className={`mt-1.5 truncate text-[12.5px] ${unread > 0 ? "font-medium text-ink/85" : "text-ink/55"}`}>{preview}</div>
        <div className="mt-1 text-[11px] text-ink/40">{status}</div>
      </div>
    </motion.button>
  );
}

function ChatThread({ kind, onBack }: { kind: "care" | "doc"; onBack: () => void }) {
  const messages = usePortal((s) => s.messages.filter((m) => m.thread === kind));
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages.length, typing]);

  const send = () => {
    if (!draft.trim()) return;
    actions.sendMessage(kind, draft.trim());
    setDraft("");
    setTyping(true);
    setTimeout(() => setTyping(false), 2200);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const title = kind === "care" ? "Care Team" : "Dr. Scott Nass";
  const badge = kind === "care" ? null : "MD";
  const subline = kind === "care" ? "Sarah · Patient Care Lead" : "NPI #1043694656 · Board-Certified";
  const bubbleGradient = kind === "care" ? `linear-gradient(135deg, ${INK} 0%, #2d2d2d 100%)` : `linear-gradient(135deg, ${PINK} 0%, #d95e5f 100%)`;

  return (
    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="flex h-full flex-col bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/90 px-3 pb-2 pt-3 backdrop-blur">
        <button onClick={onBack} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-mist)]/70 text-ink" aria-label="Back">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--color-mist)]/70 px-3 py-1.5">
          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white p-0.5">
            {kind === "care" ? <img src={blissleyLogo.url} alt="" className="h-full w-full object-contain" /> : <span className="grid h-full w-full place-items-center rounded-full text-[8px] font-black text-white" style={{ background: NAVY }}>SN</span>}
          </div>
          <span className="truncate text-[13px] font-semibold text-ink">{title}{badge && <span className="ml-1 rounded-md bg-white px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide text-ink/70">{badge}</span>}</span>
        </div>
        <div className="h-9 w-9" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <div className="flex flex-col items-center pb-6 pt-2 text-center">
          {kind === "care" ? (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-mist)]/70 p-3 ring-1 ring-black/5">
              <img src={blissleyLogo.url} alt="Blissley" className="h-full w-full object-contain" />
            </div>
          ) : (
            <img src={drScottNass.url} alt="Dr. Nass" className="h-16 w-16 rounded-full object-cover ring-1 ring-black/5" />
          )}
          <div className="mt-3 flex items-center gap-1.5">
            <div className="text-[16px] font-semibold text-ink">{kind === "care" ? "Blissley Care Team" : "Dr. Scott Nass"}</div>
            {badge && <span className="rounded-md bg-[color:var(--color-mist)]/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink/70">{badge}</span>}
          </div>
          <div className="mt-0.5 text-[11.5px] text-ink/50">{subline}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[color:var(--color-hairline)]" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/40">Conversation</span>
          <div className="h-px flex-1 bg-[color:var(--color-hairline)]" />
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((m) => {
            const time = new Date(m.ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
            if (m.from === "me") {
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <div className="flex max-w-[80%] flex-col items-end">
                    <div className="rounded-[22px] rounded-br-md px-4 py-2.5 text-[14px] leading-relaxed text-white" style={{ background: bubbleGradient }}>{m.text}</div>
                    <div className="mt-1 flex items-center gap-1 pr-1 text-[10.5px] text-ink/40"><CheckCircle2 className="h-3 w-3" /><span>{time}</span></div>
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                <div className="h-7 w-7 shrink-0">
                  {kind === "care" ? (
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--color-mist)]/70 p-1"><img src={blissleyLogo.url} alt="" className="h-full w-full object-contain" /></div>
                  ) : (
                    <img src={drScottNass.url} alt="" className="h-7 w-7 rounded-full object-cover" />
                  )}
                </div>
                <div className="flex max-w-[80%] flex-col">
                  <div className="rounded-[22px] rounded-bl-md bg-[color:var(--color-mist)]/60 px-4 py-2.5 text-[14px] leading-relaxed text-ink">{m.text}</div>
                  <div className="mt-1 pl-2 text-[10.5px] text-ink/40">{time}</div>
                </div>
              </motion.div>
            );
          })}
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <div className="h-7 w-7 shrink-0" />
              <div className="rounded-[22px] rounded-bl-md bg-[color:var(--color-mist)]/60 px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-ink/40" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-t border-[color:var(--color-hairline)]/70 bg-white px-3 pb-3 pt-2.5">
        <div className="flex items-end gap-2 rounded-[28px] border border-[color:var(--color-hairline)] bg-white px-2 py-1.5 focus-within:border-ink/25">
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/50" aria-label="Attach"><span className="text-[20px] leading-none">+</span></button>
          <textarea
            ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            placeholder={kind === "care" ? "Message your care team…" : "Ask Dr. Nass…"}
            className="min-h-[36px] max-h-32 flex-1 resize-none bg-transparent py-2 text-[14px] leading-snug text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button onClick={send} disabled={!draft.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition disabled:opacity-30" style={{ background: draft.trim() ? PINK : INK }}>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        {kind === "doc" && (
          <div className="mt-2 text-center text-[10.5px] text-ink/45">For emergencies call 911 · This is not emergency care</div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────── Plan ─────────── */
function PlanTab() {
  const plan = usePortal((s) => s.plan);
  const medication = usePortal((s) => s.medication);
  const shipments = usePortal((s) => s.shipments);
  const charges = usePortal((s) => s.charges);
  const planState = usePortal((s) => s.planState);
  const weightLog = usePortal((s) => s.weightLog);
  const cancelled = usePortal((s) => s.cancelled);
  const pauseDays = usePortal((s) => s.pauseDays);

  const [modal, setModal] = useState<null | "pause" | "cancel" | "switch" | "payment" | "address" | "checkin" | "weight" | "refill">(null);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);

  return (
    <div className="px-4 pt-5">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[color:var(--color-mist)]/40 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Your plan</div>
        <div className="mt-1 text-[22px] font-semibold tracking-tight text-ink">{medication.name}</div>
        <div className="mt-1 text-[15px] text-ink/70">
          <span className="font-semibold" style={{ color: PINK }}>${plan.price}</span>
          <span className="text-ink/50">/month · {plan.name}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-white/70 p-3 text-center">
          <MiniStat label="Active since" value={medication.activeSince} />
          <MiniStat label="Current dose" value={medication.dose} />
          <MiniStat label="Program" value={`Month ${medication.monthNumber}`} />
        </div>
        {pauseDays !== null && !cancelled && (
          <div className="mt-3 rounded-xl bg-[#FFF3F1] px-3 py-2 text-[12.5px] text-ink/70">Program paused for {pauseDays} days.</div>
        )}
        {cancelled && (
          <div className="mt-3 rounded-xl bg-[#EAF3EF] px-3 py-2 text-[12.5px] text-ink/70">Your program has been cancelled.</div>
        )}
      </div>

      {/* Check-in / Refill CTA */}
      {planState === "check_in_due" && (
        <div className="mt-4 rounded-3xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${PINK}, #d95e5f)` }}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">Monthly check-in</div>
          <div className="mt-1 text-[18px] font-semibold">Two minutes. Unlocks your next refill.</div>
          <p className="mt-1 text-[13px] opacity-90">Weight, side effects, mood — that's it.</p>
          <button onClick={() => setModal("checkin")} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-ink">
            Start check-in <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Progress */}
      <Section title="Progress">
        <div className="rounded-2xl bg-[#FAFAFA] p-4">
          <div className="flex items-baseline gap-2">
            <div className="text-[24px] font-bold tracking-tight text-ink">-{Math.max(0, (weightLog[0]?.lbs ?? 0) - (weightLog[weightLog.length - 1]?.lbs ?? 0)).toFixed(1)} lbs</div>
            <div className="text-[12px] text-ink/55">since {weightLog[0]?.date}</div>
          </div>
          <WeightChart data={weightLog} />
          <button onClick={() => setModal("weight")} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold text-white">
            <Plus className="h-3.5 w-3.5" /> Log weight
          </button>
        </div>
      </Section>

      {/* Dose schedule */}
      <Section title="Dose Schedule">
        <div className="rounded-2xl bg-[#FAFAFA] p-4">
          <div className="text-[13px] text-ink/70">Weekly · {medication.dose}</div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((wk) => {
              const done = wk <= 2;
              const upcoming = wk === 3;
              return (
                <div key={wk} className={`rounded-xl p-2.5 text-center ${done ? "bg-[#EAF3EF]" : upcoming ? "bg-[#FFF3F1] ring-1 ring-[#ee7273]/40" : "bg-white"}`}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-ink/50">Wk {wk}</div>
                  <div className="mt-1">
                    {done ? <CheckCircle2 className="mx-auto h-4 w-4" style={{ color: "#4a7c6f" }} /> : upcoming ? <Activity className="mx-auto h-4 w-4" style={{ color: PINK }} /> : <span className="text-[10px] text-ink/40">—</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Order history */}
      <Section title="Order History">
        <div className="divide-y divide-white overflow-hidden rounded-2xl bg-[#FAFAFA]">
          {(ordersOpen ? shipments : shipments.slice(0, 3)).map((o) => (
            <div key={o.id} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white"><Package className="h-4 w-4 text-ink/60" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium text-ink">{o.label}</div>
                <div className="text-[11.5px] text-ink/50">{o.shipDate} · {statusLabel(o.status)}</div>
              </div>
              {o.status === "shipped" && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink/70">Tracking</span>}
            </div>
          ))}
        </div>
        {shipments.length > 3 && (
          <button onClick={() => setOrdersOpen((v) => !v)} className="mt-2 w-full text-center text-[12px] font-medium text-ink/60 hover:text-ink">
            {ordersOpen ? "Show less" : "View all"}
          </button>
        )}
        {planState === "delivered_active" && (
          <button onClick={() => setModal("refill")} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold text-white">
            <Repeat className="h-3.5 w-3.5" /> Request early refill
          </button>
        )}
      </Section>

      {/* Manage */}
      <Section title="Manage">
        <div className="divide-y divide-white overflow-hidden rounded-2xl bg-[#FAFAFA]">
          {planState !== "paused" ? (
            <ManageRow icon={<Pause className="h-4 w-4" />} label="Pause my program" onClick={() => setModal("pause")} />
          ) : (
            <ManageRow icon={<PlayCircle className="h-4 w-4" />} label="Resume my program" onClick={() => actions.resumePlan()} />
          )}
          <ManageRow icon={<Repeat className="h-4 w-4" />} label="Switch plan" onClick={() => setModal("switch")} />
          <ManageRow icon={<CreditCard className="h-4 w-4" />} label="Update payment method" onClick={() => setModal("payment")} />
          <ManageRow icon={<MapPin className="h-4 w-4" />} label="Update shipping address" onClick={() => setModal("address")} />
          <ManageRow icon={<X className="h-4 w-4" />} label="Cancel my program" onClick={() => setModal("cancel")} destructive />
        </div>
      </Section>

      {/* Billing */}
      <Section title="Billing History">
        <div className="divide-y divide-white overflow-hidden rounded-2xl bg-[#FAFAFA]">
          {(billingOpen ? charges : charges.slice(0, 3)).map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white">
                {b.status === "paid" ? <CheckCircle2 className="h-4 w-4" style={{ color: "#4a7c6f" }} /> : <Clock className="h-4 w-4 text-ink/50" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium text-ink">${b.amount.toFixed(2)}</div>
                <div className="text-[11.5px] text-ink/50">{b.date} · {b.status === "paid" ? "Paid" : "Upcoming"}</div>
              </div>
              {b.status === "paid" && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink/70">Receipt</span>}
            </div>
          ))}
        </div>
        {charges.length > 3 && (
          <button onClick={() => setBillingOpen((v) => !v)} className="mt-2 w-full text-center text-[12px] font-medium text-ink/60 hover:text-ink">
            {billingOpen ? "Show less" : "View all"}
          </button>
        )}
      </Section>

      <PlanModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

function statusLabel(s: string) { return s === "shipped" ? "Shipped" : s === "processing" ? "Preparing" : "Delivered"; }

function WeightChart({ data }: { data: { date: string; lbs: number }[] }) {
  if (data.length < 2) return <div className="mt-2 text-[12px] text-ink/50">Log more entries to see your trend.</div>;
  const w = 320, h = 100, pad = 12;
  const min = Math.min(...data.map((d) => d.lbs)) - 1;
  const max = Math.max(...data.map((d) => d.lbs)) + 1;
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.lbs - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const area = `${pts[0].split(",")[0]},${h - pad} ${pts.join(" ")} ${pts[pts.length - 1].split(",")[0]},${h - pad}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-24 w-full">
      <defs>
        <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={PINK} stopOpacity="0.25" />
          <stop offset="100%" stopColor={PINK} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#wg)" />
      <polyline points={pts.join(" ")} fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4 : 2.5} fill={PINK} />;
      })}
    </svg>
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

function ManageRow({ icon, label, onClick, destructive }: { icon: React.ReactNode; label: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white" style={destructive ? { background: "#FFF3F1", color: PINK } : undefined}>{icon}</div>
      <div className="flex-1 text-[14px] font-medium text-ink">{label}</div>
      <ChevronRight className="h-4 w-4 text-ink/40" />
    </button>
  );
}

function PlanModal({ modal, onClose }: { modal: string | null; onClose: () => void }) {
  const address = usePortal((s) => s.patient);
  return (
    <AnimatePresence>
      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-end bg-black/40 backdrop-blur-sm md:place-items-center" onClick={onClose}>
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-t-3xl bg-white p-5 md:rounded-3xl"
          >
            {modal === "pause" && <PauseFlow onClose={onClose} />}
            {modal === "cancel" && <CancelFlow onClose={onClose} />}
            {modal === "switch" && <SwitchFlow onClose={onClose} />}
            {modal === "payment" && (
              <>
                <ModalTitle title="Update payment method" sub="Your card details are handled securely." onClose={onClose} />
                <div className="mt-4 rounded-2xl border border-dashed border-ink/20 p-6 text-center text-[13px] text-ink/60">A secure Stripe form would open here.</div>
              </>
            )}
            {modal === "address" && (
              <>
                <ModalTitle title="Update shipping address" sub="We'll ship your next order here." onClose={onClose} />
                <div className="mt-4 space-y-2">
                  <Field label="Address line 1" defaultValue={address.address1} />
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="City" defaultValue={address.city} />
                    <Field label="State" defaultValue={address.state} />
                    <Field label="ZIP" defaultValue={address.zip} />
                  </div>
                  <button onClick={onClose} className="mt-2 w-full rounded-full py-3 text-[14px] font-semibold text-white" style={{ background: INK }}>Save</button>
                </div>
              </>
            )}
            {modal === "checkin" && <CheckInFlow onClose={onClose} />}
            {modal === "weight" && <WeightLogFlow onClose={onClose} />}
            {modal === "refill" && <RefillFlow onClose={onClose} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PauseFlow({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalTitle title="Pause my program" sub="Choose how long you'd like to pause." onClose={onClose} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[30, 60, 90].map((d) => (
          <button key={d} onClick={() => { actions.pausePlan(d); onClose(); }} className="rounded-2xl border border-ink/15 py-4 text-[13px] font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white">
            {d} days
          </button>
        ))}
      </div>
    </>
  );
}

function CancelFlow({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalTitle title="Are you sure?" sub="You'll lose access to your program. This can't be undone from the app." onClose={onClose} />
      <div className="mt-5 space-y-2">
        <button onClick={onClose} className="w-full rounded-full py-3.5 text-[14px] font-semibold text-white" style={{ background: INK }}>Keep my program</button>
        <button onClick={() => { actions.cancelPlan(); onClose(); }} className="w-full rounded-full border border-ink/15 py-3.5 text-[14px] font-medium text-ink/70">Cancel anyway</button>
      </div>
    </>
  );
}

function SwitchFlow({ onClose }: { onClose: () => void }) {
  const plans = [
    { name: "Monthly", price: 299, sub: "Billed every month" },
    { name: "3-Month", price: 237, sub: "Billed every 3 months · current", current: true },
    { name: "6-Month", price: 199, sub: "Billed every 6 months · best value" },
  ];
  return (
    <>
      <ModalTitle title="Switch plan" sub="Pick the cadence that fits your goals." onClose={onClose} />
      <div className="mt-4 space-y-2">
        {plans.map((p) => (
          <button key={p.name} onClick={onClose} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${p.current ? "border-ink bg-ink/[.03]" : "border-ink/15 hover:border-ink/40"}`}>
            <div>
              <div className="text-[14px] font-semibold text-ink">{p.name}</div>
              <div className="text-[11.5px] text-ink/55">{p.sub}</div>
            </div>
            <div className="ml-auto text-[15px] font-semibold text-ink">${p.price}<span className="text-[11px] font-normal text-ink/50">/mo</span></div>
          </button>
        ))}
      </div>
    </>
  );
}

function CheckInFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [weight, setWeight] = useState("187");
  const [sideEffects, setSideEffects] = useState(2);
  const [mood, setMood] = useState(4);
  const [notes, setNotes] = useState("");

  const submit = () => {
    actions.submitCheckIn({ weight: parseFloat(weight) || 0, sideEffects, mood, notes });
    onClose();
  };

  return (
    <>
      <ModalTitle title="Monthly check-in" sub={`Step ${step + 1} of 4`} onClose={onClose} />
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/10">
        <motion.div className="h-full" style={{ background: PINK }} animate={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>
      <div className="mt-5 min-h-[180px]">
        {step === 0 && (
          <div>
            <div className="text-[15px] font-semibold text-ink">Current weight</div>
            <p className="mt-1 text-[13px] text-ink/60">In pounds. Best done first thing in the morning.</p>
            <div className="mt-4 flex items-baseline gap-2">
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-32 rounded-xl border border-ink/15 bg-white px-3 py-3 text-[24px] font-bold text-ink focus:border-ink focus:outline-none" />
              <span className="text-[16px] text-ink/60">lbs</span>
            </div>
          </div>
        )}
        {step === 1 && (
          <Scale title="Side effects" hint="1 = none · 5 = severe" value={sideEffects} onChange={setSideEffects} />
        )}
        {step === 2 && (
          <Scale title="Overall mood" hint="1 = low · 5 = great" value={mood} onChange={setMood} />
        )}
        {step === 3 && (
          <div>
            <div className="text-[15px] font-semibold text-ink">Anything else?</div>
            <p className="mt-1 text-[13px] text-ink/60">Optional. Dr. Nass will see this.</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Notes for your care team…" className="mt-3 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-[14px] text-ink focus:border-ink focus:outline-none" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="rounded-full border border-ink/15 px-4 py-3 text-[13px] font-medium text-ink/70">Back</button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep((s) => s + 1)} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[13.5px] font-semibold text-white" style={{ background: INK }}>
            Continue <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button onClick={submit} className="ml-auto rounded-full px-5 py-3 text-[13.5px] font-semibold text-white" style={{ background: PINK }}>Submit check-in</button>
        )}
      </div>
    </>
  );
}

function Scale({ title, hint, value, onChange }: { title: string; hint: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="text-[15px] font-semibold text-ink">{title}</div>
      <p className="mt-1 text-[13px] text-ink/60">{hint}</p>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} className={`rounded-2xl py-4 text-[15px] font-semibold transition ${value === n ? "text-white" : "bg-[#FAFAFA] text-ink/70"}`} style={value === n ? { background: PINK } : undefined}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function WeightLogFlow({ onClose }: { onClose: () => void }) {
  const [weight, setWeight] = useState("");
  return (
    <>
      <ModalTitle title="Log weight" sub="Quick update to keep your progress accurate." onClose={onClose} />
      <div className="mt-4 flex items-baseline gap-2">
        <input autoFocus type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="185.4" className="w-32 rounded-xl border border-ink/15 bg-white px-3 py-3 text-[24px] font-bold text-ink focus:border-ink focus:outline-none" />
        <span className="text-[16px] text-ink/60">lbs</span>
      </div>
      <button onClick={() => { if (weight) { actions.logWeight(parseFloat(weight)); onClose(); } }} className="mt-5 w-full rounded-full py-3 text-[14px] font-semibold text-white" style={{ background: INK }}>Save entry</button>
    </>
  );
}

function RefillFlow({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalTitle title="Request an early refill" sub="We'll ship your next order right away — same price, same plan." onClose={onClose} />
      <div className="mt-4 rounded-2xl bg-[#FAFAFA] p-4 text-[13px] text-ink/70">
        Your next shipment will arrive in 2–4 business days. Your regular cadence will continue after this order.
      </div>
      <button onClick={() => { actions.requestRefill(); onClose(); }} className="mt-4 w-full rounded-full py-3 text-[14px] font-semibold text-white" style={{ background: PINK }}>Confirm refill</button>
    </>
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

/* ─────────── Settings ─────────── */
function SettingsTab() {
  const patient = usePortal((s) => s.patient);
  const prefs = usePortal((s) => s.prefs);
  const navigate = useNavigate();

  const signOut = () => {
    actions.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="px-4 pt-5">
      <SettingsGroup title="Personal Info">
        <Field label="First name" defaultValue={patient.firstName} />
        <Field label="Last name" defaultValue={patient.lastName} />
        <Field label="Email" defaultValue={patient.email} disabled hint="Contact support to change" />
        <Field label="Phone" defaultValue={patient.phone} />
        <Field label="Date of birth" defaultValue={patient.dob} disabled />
        <SaveButton />
      </SettingsGroup>

      <SettingsGroup title="Shipping Address">
        <Field label="Address line 1" defaultValue={patient.address1} />
        <div className="grid grid-cols-3 gap-2">
          <Field label="City" defaultValue={patient.city} />
          <Field label="State" defaultValue={patient.state} />
          <Field label="ZIP" defaultValue={patient.zip} />
        </div>
        <SaveButton />
      </SettingsGroup>

      <SettingsGroup title="Notifications">
        <Toggle label="Shipment updates" on={prefs.notifShipment} onChange={(v) => actions.toggleNotifPref("notifShipment", v)} />
        <Toggle label="New messages" on={prefs.notifMessage} onChange={(v) => actions.toggleNotifPref("notifMessage", v)} />
        <Toggle label="Check-in reminders" on={prefs.notifCheckIn} onChange={(v) => actions.toggleNotifPref("notifCheckIn", v)} />
        <div className="my-2 h-px bg-[color:var(--color-hairline)]" />
        <Toggle label="Email" on={prefs.notifEmail} onChange={(v) => actions.toggleNotifPref("notifEmail", v)} />
        <Toggle label="SMS" on={prefs.notifSms} onChange={(v) => actions.toggleNotifPref("notifSms", v)} />
      </SettingsGroup>

      <SettingsGroup title="Documents">
        {["Prescription (PDF)", "Lab results", "Invoice history", "HIPAA notice"].map((label) => (
          <button key={label} className="flex w-full items-center justify-between rounded-xl px-1 py-3 text-left hover:bg-[color:var(--color-mist)]/40">
            <span className="text-[14px] text-ink">{label}</span>
            <ChevronRight className="h-4 w-4 text-ink/40" />
          </button>
        ))}
      </SettingsGroup>

      <SettingsGroup title="Account">
        <button onClick={() => actions.toggleNotifPref("onboardingComplete", false)} className="flex w-full items-center justify-between rounded-xl px-1 py-3 text-left hover:bg-[color:var(--color-mist)]/40">
          <span className="text-[14px] text-ink">Replay welcome tour</span>
          <ChevronRight className="h-4 w-4 text-ink/40" />
        </button>
        <button onClick={signOut} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-mist)]/60 py-3 text-[13.5px] font-medium text-ink/80">
          <LogOut className="h-4 w-4" /> Log out
        </button>
        <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-ink/45">
          <a href="/terms" className="hover:text-ink/70">Terms</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-ink/70">Privacy</a>
          <span>·</span>
          <span>v1.0.0</span>
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
      <div className="space-y-2 rounded-2xl bg-[#FAFAFA] p-4">{children}</div>
    </section>
  );
}

function Field({ label, defaultValue, disabled, hint }: { label: string; defaultValue: string; disabled?: boolean; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink/50">{label}</div>
      <input defaultValue={defaultValue} disabled={disabled} className="w-full rounded-xl border border-[color:var(--color-hairline)] bg-white px-3.5 py-2.5 text-[14px] text-ink focus:border-ink focus:outline-none disabled:bg-[color:var(--color-mist)]/40 disabled:text-ink/50" />
      {hint && <div className="mt-1 text-[10.5px] text-ink/40">{hint}</div>}
    </label>
  );
}

function SaveButton() {
  return <button className="mt-2 w-full rounded-full py-3 text-[13.5px] font-semibold text-white" style={{ background: INK }}>Save changes</button>;
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-left">
      <div className="text-[14px] font-medium text-ink">{label}</div>
      <div className="relative h-6 w-11 rounded-full transition" style={{ background: on ? PINK : "#E4E0D7" }}>
        <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ left: on ? 22 : 2 }} />
      </div>
    </button>
  );
}

/* ─────────── Onboarding ─────────── */
function Onboarding() {
  const [step, setStep] = useState(0);
  const firstName = usePortal((s) => s.patient.firstName);
  const steps: Array<{
    title: string;
    body: string;
    icon?: React.ReactNode;
    hero?: boolean;
    heroImage?: string;
    textPos?: "top" | "bottom";
    heroBg?: string;
    variant?: "card";
  }> = [
    { title: `Welcome, ${firstName}.`, body: "Your care team is just one tap away. Let's take a quick look around.", hero: true, heroImage: portalWelcomeDoctor.url, textPos: "top", heroBg: "#7DAFCE" },
    { title: "Meet Dr. Nass", body: "Your prescribing physician. He'll message you within 24 hours of your first order.", hero: true, heroImage: drNassWelcome.url, textPos: "bottom", heroBg: "#8FB9D6" },
    { title: "How your plan works", body: "Weekly dose. Monthly check-in. Auto-refill every 28 days as long as you check in.", hero: true, heroImage: portalWelcomeWoman.url, textPos: "bottom", heroBg: "#C9B79E" },
    { title: "Stay in the loop", body: "We'll notify you about shipments, messages, and check-ins. Toggle any anytime.", heroImage: onboardingNotifications.url, variant: "card", heroBg: "#A9CBE3" },
  ];
  const s = steps[step];
  const done = () => actions.completeOnboarding();
  const isLast = step === steps.length - 1;
  const nextBtn = isLast
    ? { label: "Get started", onClick: done }
    : { label: "Next", onClick: () => setStep((n) => n + 1) };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 grid place-items-center bg-black/40 backdrop-blur-md px-6">
      <motion.div
        key={step}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className={`relative w-full max-w-[380px] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ${s.variant === "card" ? "bg-white" : s.hero ? "" : "bg-white p-7 text-center"}`}
        style={s.hero ? { aspectRatio: "9 / 16", background: s.heroBg } : undefined}
      >
        {s.variant === "card" ? (
          <>
            <div className="w-full" style={{ background: s.heroBg }}>
              <img src={s.heroImage} alt="" className="block w-full h-auto object-cover" />
            </div>
            <div className="bg-white p-6 text-center">
              <h3 className="text-[22px] font-semibold leading-tight tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{s.body}</p>
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {steps.map((_, i) => (
                  <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 20 : 6, background: i === step ? PINK : "#E4E0D7" }} />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={done}
                  className="flex-1 rounded-full border border-ink/10 bg-white py-3.5 text-[14px] font-semibold text-ink transition hover:bg-ink/5"
                >
                  Skip
                </button>
                <button
                  onClick={nextBtn.onClick}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[14px] font-semibold text-white transition hover:bg-ink/90"
                >
                  {nextBtn.label}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : s.hero ? (
          <>
            <img src={s.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {s.textPos === "top" ? (
              <div className="absolute inset-x-0 top-0 px-6 pt-10 text-center">
                <h3 className="text-[26px] font-semibold leading-[1.1] tracking-tight text-white drop-shadow-sm">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/90">{s.body}</p>
              </div>
            ) : (
              <>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <h3 className="text-[26px] font-semibold leading-[1.1] tracking-tight text-white drop-shadow-sm">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/90">{s.body}</p>
                  <div className="mt-5 mb-4 flex items-center justify-center gap-1.5">
                    {steps.map((_, i) => (
                      <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 20 : 6, background: i === step ? "#ffffff" : "rgba(255,255,255,0.5)" }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={done}
                      className="flex-1 rounded-full border border-white/40 bg-white/20 py-3.5 text-[14px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/30"
                    >
                      Skip
                    </button>
                    <button
                      onClick={nextBtn.onClick}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/85 py-3.5 text-[14px] font-semibold text-ink backdrop-blur-xl transition hover:bg-white"
                    >
                      {nextBtn.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
            {s.textPos === "top" && (
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-4 flex items-center justify-center gap-1.5">
                  {steps.map((_, i) => (
                    <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 20 : 6, background: i === step ? "#ffffff" : "rgba(255,255,255,0.5)" }} />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={done}
                    className="flex-1 rounded-full border border-white/40 bg-white/20 py-3.5 text-[14px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/30"
                  >
                    Skip
                  </button>
                  <button
                    onClick={nextBtn.onClick}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/85 py-3.5 text-[14px] font-semibold text-ink backdrop-blur-xl transition hover:bg-white"
                  >
                    {nextBtn.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[color:var(--color-mist)]/60">{s.icon}</div>
            <h3 className="mt-5 text-[22px] font-semibold tracking-tight text-ink">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{s.body}</p>
            <div className="mt-6 flex items-center justify-center gap-1.5">
              {steps.map((_, i) => (
                <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 20 : 6, background: i === step ? PINK : "#E4E0D7" }} />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <button onClick={done} className="flex-1 rounded-full py-3 text-[13px] font-medium text-ink/60">Skip</button>
              <button onClick={nextBtn.onClick} className="flex-1 rounded-full py-3 text-[13.5px] font-semibold text-white" style={{ background: isLast ? PINK : INK }}>{nextBtn.label}</button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────── Notifications sheet ─────────── */
function NotificationsSheet({ open, onClose, onGoto }: { open: boolean; onClose: () => void; onGoto: (t: Tab) => void }) {
  const notifs = usePortal((s) => s.notifications);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-end bg-black/40 backdrop-blur-sm md:place-items-center" onClick={onClose}>
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-full max-w-[440px] overflow-hidden rounded-t-3xl bg-white md:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-hairline)] px-5 py-4">
              <div className="text-[16px] font-semibold text-ink">Notifications</div>
              <div className="flex items-center gap-2">
                <button onClick={() => actions.markAllNotifsRead()} className="text-[12px] font-medium text-ink/60 hover:text-ink">Mark all read</button>
                <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--color-mist)]/60"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {notifs.length === 0 && <div className="p-8 text-center text-[13px] text-ink/50">You're all caught up.</div>}
              {notifs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    actions.markNotifRead(n.id);
                    if (n.deepLink && n.deepLink !== "home") onGoto(n.deepLink as Tab);
                    else onClose();
                  }}
                  className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-[color:var(--color-mist)]/40 ${!n.read ? "bg-[#FFFBFA]" : ""}`}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: notifBg(n.kind) }}>
                    {notifIcon(n.kind)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[13.5px] font-semibold text-ink">{n.title}</div>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full" style={{ background: PINK }} />}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-ink/60 line-clamp-2">{n.body}</div>
                    <div className="mt-1 text-[11px] text-ink/40">{timeAgo(n.ts)}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function notifBg(k: string) {
  return k === "message" ? "#FFF3F1" : k === "shipment" ? "#EAF0F8" : k === "check_in" ? "#FFF3F1" : k === "charge" ? "#F5F1E9" : "#EAF3EF";
}
function notifIcon(k: string) {
  const cls = "h-4 w-4";
  if (k === "message") return <MessageCircle className={cls} style={{ color: PINK }} />;
  if (k === "shipment") return <Truck className={cls} style={{ color: NAVY }} />;
  if (k === "check_in") return <AlertCircle className={cls} style={{ color: PINK }} />;
  if (k === "charge") return <CreditCard className={cls} style={{ color: "#8a6d3b" }} />;
  return <CheckCircle2 className={cls} style={{ color: "#4a7c6f" }} />;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

/* ─────────── Dev switcher (long-press logo) ─────────── */
function DevSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const planState = usePortal((s) => s.planState);
  const states: { id: PlanState; label: string }[] = [
    { id: "pending_review", label: "Pending review" },
    { id: "approved_preparing", label: "Approved · preparing" },
    { id: "shipped", label: "Shipped · in transit" },
    { id: "delivered_active", label: "Active treatment" },
    { id: "check_in_due", label: "Check-in due" },
    { id: "refill_processing", label: "Refill processing" },
    { id: "paused", label: "Paused" },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-end bg-black/40 backdrop-blur-sm md:place-items-center" onClick={onClose}>
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-t-3xl bg-white p-5 md:rounded-3xl"
          >
            <ModalTitle title="Demo controls" sub="Switch patient state to preview every UI variant." onClose={onClose} />
            <div className="mt-4 space-y-1.5">
              {states.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { actions.setPlanState(s.id); onClose(); }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${planState === s.id ? "bg-ink text-white" : "bg-[#FAFAFA] text-ink hover:bg-[#F0F0F2]"}`}
                >
                  <span className="text-[13.5px] font-medium">{s.label}</span>
                  {planState === s.id && <CheckCircle2 className="h-4 w-4" />}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => { actions.triggerMessage(); onClose(); }} className="rounded-xl bg-[#FAFAFA] px-3 py-2.5 text-[12.5px] font-medium text-ink hover:bg-[#F0F0F2]">Trigger reply</button>
              <button onClick={() => { actions.triggerShipmentUpdate(); onClose(); }} className="rounded-xl bg-[#FAFAFA] px-3 py-2.5 text-[12.5px] font-medium text-ink hover:bg-[#F0F0F2]">Shipment update</button>
              <button onClick={() => { actions.resetAll(); onClose(); }} className="col-span-2 rounded-xl bg-[#FFF3F1] px-3 py-2.5 text-[12.5px] font-medium hover:bg-[#FDE4E1]" style={{ color: PINK }}>Reset all demo data</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────── Toaster (recent notifications) ─────────── */
function Toaster() {
  const notifs = usePortal((s) => s.notifications);
  const [shown, setShown] = useState<string[]>([]);
  const recent = useMemo(() => notifs.filter((n) => !n.read && Date.now() - n.ts < 5000), [notifs]);
  const toShow = recent.find((n) => !shown.includes(n.id));

  useEffect(() => {
    if (toShow) {
      setShown((s) => [...s, toShow.id]);
      const id = setTimeout(() => {
        setShown((s) => s.filter((x) => x !== toShow.id));
      }, 3200);
      return () => clearTimeout(id);
    }
  }, [toShow]);

  return (
    <AnimatePresence>
      {toShow && shown.includes(toShow.id) && (
        <motion.div
          key={toShow.id}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 md:bottom-14"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/90 px-4 py-2.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/5 backdrop-blur-xl">
            <div className="grid h-8 w-8 place-items-center rounded-full" style={{ background: notifBg(toShow.kind) }}>{notifIcon(toShow.kind)}</div>
            <div className="min-w-0 max-w-[260px]">
              <div className="truncate text-[12.5px] font-semibold text-ink">{toShow.title}</div>
              <div className="truncate text-[11.5px] text-ink/55">{toShow.body}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────── Primitives ─────────── */
function MotionCard({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl p-5 ${accent ? "bg-gradient-to-br from-white to-[#FFF3F1]" : "bg-[#FAFAFA]"}`}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ icon, title, pill }: { icon: React.ReactNode; title: string; pill?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-ink/70">{icon}</div>
      <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">{title}</div>
      {pill && <span className="ml-auto rounded-full bg-ink/[.06] px-2.5 py-1 text-[10.5px] font-medium text-ink/70">{pill}</span>}
    </div>
  );
}
