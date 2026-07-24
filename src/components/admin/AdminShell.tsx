import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Search,
  Settings,
  Sparkles,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import { adminActions, hydrateAdmin, useAdmin } from "@/lib/admin/store";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/command", label: "Command", icon: Activity },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/leads", label: "Leads", icon: UserPlus },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const nav = useNavigate();
  const session = useAdmin((s) => s.session);
  const alerts = useAdmin((s) => s.alerts);
  const showMenu = useAdmin((s) => s.ui.showLogoMenu);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { hydrateAdmin(); }, []);
  useEffect(() => {
    if (!session) adminActions.signIn("hello@blissley.com");
  }, [session]);

  const startHold = () => { holdRef.current = setTimeout(() => adminActions.toggleLogoMenu(true), 500); };
  const endHold = () => { if (holdRef.current) clearTimeout(holdRef.current); };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-ink">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-ink/8 bg-white lg:flex">
        <div className="flex items-center gap-2 px-5 pt-5">
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="inline-flex items-center gap-2"
            aria-label="Blissley — long press for links"
          >
            <img src={blissleyLogo.url} alt="Blissley" className="h-6" />
            <span className="rounded-full bg-ever/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ever">HQ</span>
          </button>
        </div>
        <nav className="mt-6 flex-1 space-y-0.5 px-3">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-ink/50"}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ink/8 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-ever/15 text-[13px] font-semibold text-ever">
              {(session?.name || "H").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-ink">{session?.name || "Operator"}</div>
              <div className="truncate text-[11px] text-ink/50">{session?.email || "hello@blissley.com"}</div>
            </div>
            <button
              className="rounded-lg p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink"
              onClick={() => { adminActions.signOut(); nav({ to: "/login/admin" }); }}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile nav sheet */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileNav(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between p-5">
                <img src={blissleyLogo.url} alt="Blissley" className="h-6" />
                <button onClick={() => setMobileNav(false)} className="rounded-lg p-2 text-ink/60 hover:bg-ink/5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 px-3">
                {NAV.map((n) => {
                  const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                  const Icon = n.icon;
                  return (
                    <Link key={n.to} to={n.to} onClick={() => setMobileNav(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium ${
                        active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"
                      }`}>
                      <Icon className="h-4 w-4" /> {n.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-ink/8 bg-white/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button className="rounded-lg p-2 text-ink/60 hover:bg-ink/5 lg:hidden" onClick={() => setMobileNav(true)}>
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <h1 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h1>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    placeholder="Search patients, orders, ord_·pt_·py_"
                    className="w-72 rounded-full border border-ink/10 bg-white py-2 pl-9 pr-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ever/50 focus:ring-4 focus:ring-ever/10"
                  />
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-full border border-ink/10 bg-white p-2 text-ink/70 hover:border-ink/25"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {alerts.length > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-ever px-1 text-[9px] font-bold text-white">
                      {alerts.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-11 z-40 w-80 rounded-2xl border border-ink/10 bg-white p-2 shadow-2xl shadow-ink/10"
                    >
                      <div className="border-b border-ink/8 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                        Alerts
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {alerts.length === 0 && <div className="p-4 text-sm text-ink/50">All clear.</div>}
                        {alerts.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => adminActions.resolveAlert(a.id)}
                            className="w-full rounded-xl p-3 text-left hover:bg-ink/5"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`inline-block h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-ever" : "bg-honey"}`} />
                              <div className="text-[13px] font-semibold text-ink">{a.title}</div>
                            </div>
                            <div className="mt-1 text-[12px] text-ink/60">{a.detail}</div>
                            <div className="mt-1.5 text-[11px] font-semibold text-ever">{a.action} →</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Long-press logo menu (mimicking patient portal) */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => adminActions.toggleLogoMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-16 z-50 mx-auto max-w-md rounded-3xl bg-white p-5 shadow-2xl shadow-ink/30"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Jump to</div>
                <button onClick={() => adminActions.toggleLogoMenu(false)} className="rounded-lg p-1.5 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4"/></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => adminActions.toggleLogoMenu(false)}
                    className="rounded-2xl border border-ink/8 bg-[#faf9f6] p-3 text-left hover:border-ever/40 hover:bg-white">
                    <n.icon className="mb-2 h-4 w-4 text-ever" />
                    <div className="text-[13px] font-semibold text-ink">{n.label}</div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Link to="/portal/patient" className="block rounded-xl bg-ink px-4 py-2.5 text-center text-[12px] font-semibold text-white">Patient portal</Link>
                <Link to="/portal/physician" className="block rounded-xl bg-white px-4 py-2.5 text-center text-[12px] font-semibold text-ink ring-1 ring-ink/12">Physician portal</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ Reusable primitives ============ */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-ink/8 bg-white ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[15px] font-semibold tracking-tight text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "success" | "warn" | "info" | "critical" | "neutral"; children: ReactNode }) {
  const map = {
    success: "bg-check/10 text-check ring-check/25",
    warn: "bg-honey/15 text-honey ring-honey/30",
    info: "bg-marine/8 text-marine ring-marine/20",
    critical: "bg-ever/12 text-ever ring-ever/30",
    neutral: "bg-ink/6 text-ink/70 ring-ink/15",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${map[tone]}`}>
      {children}
    </span>
  );
}

export function KPI({
  label,
  value,
  delta,
  spark,
  hint,
}: {
  label: string;
  value: string;
  delta?: { pct: string; positive: boolean };
  spark?: number[];
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</div>
        {delta && (
          <span className={`text-[11px] font-semibold ${delta.positive ? "text-check" : "text-ever"}`}>
            {delta.positive ? "▲" : "▼"} {delta.pct}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end gap-3">
        <div className="font-hero text-[28px] font-bold leading-none tracking-tight text-ink">{value}</div>
        {spark && <Sparkline values={spark} />}
      </div>
      {hint && <div className="mt-2 text-[11.5px] text-ink/50">{hint}</div>}
    </Card>
  );
}

export function Sparkline({ values, color = "#ee7273" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 84, h = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="opacity-90">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

export function useHydratedAdmin() {
  useEffect(() => { hydrateAdmin(); }, []);
}

export function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
