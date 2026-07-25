import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Cloud,
  CreditCard,
  ChevronDown,
  HelpCircle,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Moon,
  Package,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { adminActions, hydrateAdmin, useAdmin } from "@/lib/admin/store";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";

type NavItem = { to?: string; label: string; icon: typeof LayoutGrid; exact?: boolean; soon?: boolean };

const MAIN_NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/admin/command", label: "Command Center", icon: Activity },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/leads", label: "Leads", icon: UserPlus },
  { label: "Treatments", icon: Stethoscope, soon: true },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/messages", label: "Messenger", icon: MessageSquare },
];

const ANALYTICS: NavItem[] = [
  { label: "Live view", icon: Activity, soon: true },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const BUILDERS: NavItem[] = [
  { label: "Questionnaires", icon: LayoutGrid, soon: true },
  { label: "Products", icon: Package, soon: true },
  { label: "Billing", icon: CreditCard, soon: true },
  { label: "Coupons", icon: BarChart3, soon: true },
  { label: "Affiliates", icon: Users, soon: true },
];

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const nav = useNavigate();
  const session = useAdmin((s) => s.session);
  const alerts = useAdmin((s) => s.alerts);
  const showMenu = useAdmin((s) => s.ui.showLogoMenu);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [buildersOpen, setBuildersOpen] = useState(true);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { hydrateAdmin(); }, []);
  useEffect(() => { if (!session) adminActions.signIn("hello@blissley.com"); }, [session]);

  const startHold = () => { holdRef.current = setTimeout(() => adminActions.toggleLogoMenu(true), 500); };
  const endHold = () => { if (holdRef.current) clearTimeout(holdRef.current); };

  const isActive = (n: NavItem) => n.to && (n.exact ? pathname === n.to : pathname.startsWith(n.to) && n.to !== "/admin");

  const NavRow = ({ n }: { n: NavItem }) => {
    const active = isActive(n);
    const Icon = n.icon;
    const content = (
      <div className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] transition-colors ${
        active ? "bg-ink/[0.04] font-semibold text-ink" : n.soon ? "text-ink/30" : "text-ink/70 hover:bg-ink/[0.03] hover:text-ink"
      }`}>
        <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-ink" : n.soon ? "text-ink/25" : "text-ink/50"}`} strokeWidth={1.75} />
        <span className="truncate">{n.label}</span>
        {n.soon && <span className="ml-auto text-[10px] font-medium text-ink/30">Soon</span>}
      </div>
    );
    if (n.soon || !n.to) return <div className="cursor-not-allowed">{content}</div>;
    return <Link to={n.to}>{content}</Link>;
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-ink/[0.06] bg-white transition-[width] duration-200 lg:flex ${collapsed ? "w-[68px]" : "w-[220px]"}`}>
        {/* Brand */}
        <button
          onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={startHold} onTouchEnd={endHold}
          className="flex items-center px-5 pt-5 text-left"
        >
          <img src={blissleyLogo.url} alt="Blissley" className={collapsed ? "h-6 w-auto" : "h-7 w-auto"} />
        </button>

        {/* Get Started pill */}
        {!collapsed && (
          <div className="mx-3 mt-4 flex items-center gap-2.5 rounded-xl border border-ink/[0.08] bg-white px-2.5 py-2">
            <div className="relative grid h-7 w-7 shrink-0 place-items-center">
              <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90">
                <circle cx="16" cy="16" r="12" fill="none" stroke="#e8e6e0" strokeWidth="3" />
                <circle cx="16" cy="16" r="12" fill="none" stroke="#171717" strokeWidth="3" strokeDasharray={`${(0/7)*75.4} 75.4`} strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[12px] font-semibold text-ink">Get Started</div>
              <div className="text-[10.5px] text-ink/50">0 of 7 complete</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-3">
          <div className="space-y-0.5">
            {MAIN_NAV.map((n) => <NavRow key={n.label} n={n} />)}
          </div>

          {/* Analytics */}
          <div className="mt-4">
            {!collapsed && (
              <button onClick={() => setAnalyticsOpen(v => !v)} className="flex w-full items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40 hover:text-ink/60">
                <span>Analytics</span>
                <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${analyticsOpen ? "" : "-rotate-90"}`} />
              </button>
            )}
            {analyticsOpen && <div className="mt-1 space-y-0.5">{ANALYTICS.map((n) => <NavRow key={n.label} n={n} />)}</div>}
          </div>

          {/* Builders */}
          <div className="mt-4">
            {!collapsed && (
              <button onClick={() => setBuildersOpen(v => !v)} className="flex w-full items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40 hover:text-ink/60">
                <span>Builders</span>
                <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${buildersOpen ? "" : "-rotate-90"}`} />
              </button>
            )}
            {buildersOpen && <div className="mt-1 space-y-0.5">{BUILDERS.map((n) => <NavRow key={n.label} n={n} />)}</div>}
          </div>
        </nav>

        {/* Concierge card */}
        {!collapsed && (
          <div className="mx-3 mb-3 overflow-hidden rounded-2xl border border-ink/[0.08] bg-white">
            <div className="relative h-20 bg-gradient-to-br from-[#cfe4f5] via-[#e8f1fa] to-[#f4ecd8]">
              <Cloud className="absolute left-3 top-3 h-5 w-5 text-white/90" />
              <Cloud className="absolute right-4 top-6 h-4 w-4 text-white/70" />
            </div>
            <div className="p-3">
              <div className="text-[12.5px] font-semibold text-ink">Concierge</div>
              <div className="mt-0.5 text-[10.5px] leading-tight text-ink/50">Priority support from your dedicated team.</div>
              <button className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Contact
              </button>
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="border-t border-ink/[0.06] px-2 py-2">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-ink/30">
            <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
            {!collapsed && <><span>Support</span><span className="ml-auto text-[10px] text-ink/30">Soon</span></>}
          </div>
          <Link to="/admin/settings" className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-ink/70 hover:bg-ink/[0.03] hover:text-ink">
            <Settings className="h-3.5 w-3.5 text-ink/50" strokeWidth={1.75} />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-ink/[0.06] bg-white lg:hidden">
              <div className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-ever"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
                  <span className="font-hero text-[15px] font-bold text-ink">blissley</span>
                </div>
                <button onClick={() => setMobileNav(false)} className="rounded-lg p-1.5 text-ink/60"><X className="h-4 w-4" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 pb-3">
                {MAIN_NAV.map((n) => <div key={n.label} onClick={() => setMobileNav(false)}><NavRow n={n} /></div>)}
                <div className="mt-4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Analytics</div>
                {ANALYTICS.map((n) => <div key={n.label} onClick={() => setMobileNav(false)}><NavRow n={n} /></div>)}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className={collapsed ? "lg:pl-[68px]" : "lg:pl-[220px]"}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-ink/[0.06] bg-white">
          <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink lg:block"
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button className="rounded-md p-1.5 text-ink/50 hover:bg-ink/5 lg:hidden" onClick={() => setMobileNav(true)}>
              <LayoutGrid className="h-4 w-4" />
            </button>

            {/* Workspace chip */}
            <div className="hidden items-center gap-2 rounded-lg border border-ink/[0.08] px-2.5 py-1 sm:flex">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-ever"><span className="h-1 w-1 rounded-full bg-white" /></span>
              <span className="text-[12px] font-semibold text-ink">blissley</span>
              <span className="mx-1 h-3 w-px bg-ink/10" />
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink/55">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-check opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-check" />
                </span>
                All systems operational
              </span>
            </div>

            {/* Search */}
            <div className="mx-auto hidden w-full max-w-md md:block">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
                <input placeholder="Search…" className="w-full rounded-lg bg-[#f7f6f2] py-1.5 pl-9 pr-3 text-[12.5px] outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1 focus:ring-ink/10" />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button className="hidden items-center gap-1.5 rounded-lg border border-ink/[0.08] px-2.5 py-1.5 text-[11.5px] font-medium text-ink/70 hover:bg-ink/[0.03] sm:flex">
                <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.75} /> Last 4 weeks
              </button>
              <button className="flex items-center gap-1 rounded-lg bg-ink px-2.5 py-1.5 text-[11.5px] font-semibold text-white">
                <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Add Patient
              </button>
              <button className="hidden rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink sm:block" aria-label="Messenger"><MessageSquare className="h-4 w-4" strokeWidth={1.75} /></button>
              <button className="hidden rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink sm:block" aria-label="Theme"><Moon className="h-4 w-4" strokeWidth={1.75} /></button>
              <button className="hidden rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink sm:block" aria-label="Help"><HelpCircle className="h-4 w-4" strokeWidth={1.75} /></button>
              <div className="relative">
                <button onClick={() => setNotifOpen((v) => !v)} className="relative rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink" aria-label="Notifications">
                  <Bell className="h-4 w-4" strokeWidth={1.75} />
                  {alerts.length > 0 && <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-ever" />}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-2xl">
                      <div className="border-b border-ink/6 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Alerts</div>
                      <div className="max-h-96 overflow-y-auto p-1.5">
                        {alerts.length === 0 && <div className="p-4 text-sm text-ink/50">All clear.</div>}
                        {alerts.map((a) => (
                          <button key={a.id} onClick={() => adminActions.resolveAlert(a.id)} className="w-full rounded-lg p-3 text-left hover:bg-ink/4">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-ever" : "bg-honey"}`} />
                              <div className="text-[13px] font-semibold text-ink">{a.title}</div>
                            </div>
                            <div className="mt-1 text-[12px] text-ink/60">{a.detail}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => { adminActions.signOut(); nav({ to: "/login/admin" }); }}
                className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white"
                title={session?.email || ""}
              >
                {(session?.name || "U").slice(0, 1).toUpperCase()}
              </button>
            </div>
          </div>
          {title && (
            <div className="hidden px-6 pb-3 pt-1 sm:block">
              <h1 className="font-hero text-[13px] font-semibold text-ink/70">{title}</h1>
            </div>
          )}
        </header>

        <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-4 lg:px-6">{children}</main>
      </div>

      {/* Long-press logo menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => adminActions.toggleLogoMenu(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-16 z-50 mx-auto max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Jump to</div>
                <button onClick={() => adminActions.toggleLogoMenu(false)} className="rounded-lg p-1.5 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4"/></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MAIN_NAV.filter(n => n.to).map((n) => (
                  <Link key={n.label} to={n.to!} onClick={() => adminActions.toggleLogoMenu(false)}
                    className="rounded-xl border border-ink/6 bg-[#faf9f6] p-3 text-left hover:border-ever/40 hover:bg-white">
                    <n.icon className="mb-2 h-4 w-4 text-ever" />
                    <div className="text-[13px] font-semibold text-ink">{n.label}</div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Link to="/portal/patient" className="block rounded-lg bg-ink px-4 py-2.5 text-center text-[12px] font-semibold text-white">Patient portal</Link>
                <Link to="/portal/physician" className="block rounded-lg bg-white px-4 py-2.5 text-center text-[12px] font-semibold text-ink ring-1 ring-ink/12">Physician portal</Link>
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
  return <div className={`rounded-xl border border-ink/[0.08] bg-white ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action, subtitle }: { children: ReactNode; action?: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[14px] font-semibold tracking-tight text-ink">{children}</h2>
        {subtitle && <p className="mt-0.5 text-[11.5px] text-ink/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "success" | "warn" | "info" | "critical" | "neutral"; children: ReactNode }) {
  const map = {
    success: "text-check",
    warn: "text-honey",
    info: "text-marine",
    critical: "text-ever",
    neutral: "text-ink/60",
  } as const;
  const dot = {
    success: "bg-check",
    warn: "bg-honey",
    info: "bg-marine",
    critical: "bg-ever",
    neutral: "bg-ink/40",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium ${map[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[tone]}`} />
      {children}
    </span>
  );
}

/* Cuvo-style KPI: label + tiny right icon, big number + delta pct inline, sparkline underneath running full width */
export function KPI({
  label,
  value,
  delta,
  spark,
  hint,
  icon: Icon,
  featured = false,
}: {
  label: string;
  value: string;
  delta?: { pct: string; positive: boolean };
  spark?: number[];
  hint?: string;
  icon?: typeof LayoutGrid;
  tone?: "ever" | "marine" | "check" | "honey" | "neutral";
  featured?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 ${featured ? "border-ink/[0.12] bg-white" : "border-ink/[0.08] bg-white"}`}>
      <div className="flex items-center justify-between text-ink/55">
        <span className="text-[11.5px]">{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="font-hero text-[22px] font-semibold leading-none tracking-tight text-ink">{value}</div>
        {delta && (
          <span className={`text-[11px] font-medium ${delta.positive ? "text-check" : "text-ever"}`}>
            {delta.positive ? "↗" : "↘"} {delta.pct}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-[11px] text-ink/45">{hint}</div>}
      {spark && (
        <div className="mt-2 -mx-1">
          <Sparkline values={spark} color={delta && !delta.positive ? "#ee7273" : "#171717"} />
        </div>
      )}
    </div>
  );
}

export function Sparkline({ values, color = "#171717", height = 26 }: { values: number[]; color?: string; height?: number }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 220, h = height;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-6 w-full">
      <polyline fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" points={pts} />
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
