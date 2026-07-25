import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronsLeft,
  CreditCard,
  HelpCircle,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Package,
  Search,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import { adminActions, hydrateAdmin, useAdmin } from "@/lib/admin/store";

type NavItem = { to: string; label: string; icon: typeof LayoutGrid; exact?: boolean; badge?: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
      { to: "/admin/command", label: "Command", icon: Activity },
      { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/admin/patients", label: "Patients", icon: Users },
      { to: "/admin/leads", label: "Leads", icon: UserPlus },
      { to: "/admin/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Commerce",
    items: [
      { to: "/admin/orders", label: "Orders", icon: Package },
      { to: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
];

const FOOTER_ITEM: NavItem = { to: "/admin/settings", label: "Settings", icon: Settings };

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const nav = useNavigate();
  const session = useAdmin((s) => s.session);
  const alerts = useAdmin((s) => s.alerts);
  const showMenu = useAdmin((s) => s.ui.showLogoMenu);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { hydrateAdmin(); }, []);
  useEffect(() => { if (!session) adminActions.signIn("hello@blissley.com"); }, [session]);

  const startHold = () => { holdRef.current = setTimeout(() => adminActions.toggleLogoMenu(true), 500); };
  const endHold = () => { if (holdRef.current) clearTimeout(holdRef.current); };

  const isActive = (n: NavItem) => (n.exact ? pathname === n.to : pathname.startsWith(n.to) && n.to !== "/admin");

  const sidebarWidth = sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[248px]";
  const mainPad = sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[248px]";

  return (
    <div className="min-h-screen bg-[#f4f2ed] text-ink">
      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-3 left-3 z-30 hidden flex-col rounded-3xl border border-ink/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_10px_40px_-20px_rgba(0,0,0,0.08)] transition-[width] duration-300 lg:flex ${sidebarWidth}`}>
        {/* Logo */}
        <div className={`flex items-center gap-2 px-4 pt-5 ${sidebarCollapsed ? "justify-center px-3" : ""}`}>
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="flex items-center gap-2"
            aria-label="Blissley"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-white">
              <img src={blissleyLogo.url} alt="" className="h-4 w-4 brightness-0 invert" />
            </span>
            {!sidebarCollapsed && (
              <span className="flex flex-col leading-none">
                <span className="text-[13.5px] font-semibold tracking-tight text-ink">Blissley</span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/45">HQ · Admin</span>
              </span>
            )}
          </button>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="ml-auto rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="mx-auto mt-3 rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink"
            aria-label="Expand sidebar"
          >
            <ChevronsLeft className="h-4 w-4 rotate-180" />
          </button>
        )}

        {/* Workspace pill */}
        {!sidebarCollapsed && (
          <div className="mx-3 mt-5 flex items-center gap-2 rounded-2xl border border-ink/6 bg-[#faf9f6] px-3 py-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-ever/12 text-[11px] font-bold text-ever">B</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-ink">Blissley Health</div>
              <div className="truncate text-[10.5px] text-ink/50">Production workspace</div>
            </div>
            <div className="grid h-5 w-5 place-items-center rounded-full bg-check/15 text-[9px] font-bold text-check">✓</div>
          </div>
        )}

        {/* Nav groups */}
        <nav className="mt-5 flex-1 space-y-4 overflow-y-auto px-3 pb-3">
          {NAV_GROUPS.map((g) => (
            <div key={g.label}>
              {!sidebarCollapsed && (
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                  {g.label}
                </div>
              )}
              <div className="space-y-0.5">
                {g.items.map((n) => {
                  const active = isActive(n) || (n.exact && pathname === n.to);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      title={sidebarCollapsed ? n.label : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
                        active
                          ? "bg-ink text-white shadow-[0_4px_14px_-6px_rgba(23,23,23,0.5)]"
                          : "text-ink/65 hover:bg-ink/5 hover:text-ink"
                      } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-ink/45 group-hover:text-ink"}`} />
                      {!sidebarCollapsed && <span className="truncate">{n.label}</span>}
                      {!sidebarCollapsed && n.badge && (
                        <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-ever/12 text-ever"}`}>
                          {n.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-ink/6 p-3">
          <Link
            to={FOOTER_ITEM.to}
            className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-ink/65 hover:bg-ink/5 hover:text-ink ${sidebarCollapsed ? "justify-center px-2" : ""}`}
          >
            <FOOTER_ITEM.icon className="h-4 w-4 shrink-0 text-ink/45" />
            {!sidebarCollapsed && FOOTER_ITEM.label}
          </Link>
          <div className={`flex items-center gap-2.5 rounded-xl bg-[#faf9f6] px-2.5 py-2 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ever to-blush text-[12px] font-semibold text-white">
              {(session?.name || "H").slice(0, 1).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-check ring-2 ring-white" />
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-semibold text-ink">{session?.name || "Operator"}</div>
                  <div className="truncate text-[10.5px] text-ink/50">{session?.email || "hello@blissley.com"}</div>
                </div>
                <button
                  className="rounded-lg p-1.5 text-ink/45 hover:bg-white hover:text-ever"
                  onClick={() => { adminActions.signOut(); nav({ to: "/login/admin" }); }}
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile nav sheet */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNav(false)}
            />
            <motion.aside
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-2 left-2 z-50 flex w-[280px] flex-col rounded-3xl bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
                    <img src={blissleyLogo.url} alt="" className="h-4 w-4 brightness-0 invert" />
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[13.5px] font-semibold text-ink">Blissley</span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/45">HQ</span>
                  </div>
                </div>
                <button onClick={() => setMobileNav(false)} className="rounded-lg p-2 text-ink/60 hover:bg-ink/5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
                {NAV_GROUPS.map((g) => (
                  <div key={g.label}>
                    <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">{g.label}</div>
                    <div className="space-y-0.5">
                      {g.items.map((n) => {
                        const active = isActive(n) || (n.exact && pathname === n.to);
                        const Icon = n.icon;
                        return (
                          <Link key={n.to} to={n.to} onClick={() => setMobileNav(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium ${active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"}`}>
                            <Icon className={`h-4 w-4 ${active ? "text-white" : "text-ink/45"}`} /> {n.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className={mainPad}>
        <header className="sticky top-0 z-20 bg-[#f4f2ed]/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button className="rounded-xl border border-ink/8 bg-white p-2 text-ink/60 hover:text-ink lg:hidden" onClick={() => setMobileNav(true)}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-hero text-[18px] font-semibold tracking-tight text-ink sm:text-[20px]">{title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:block">
                <div className="group relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    placeholder="Search patients, orders, ord_·pt_·py_"
                    className="w-80 rounded-2xl border border-ink/8 bg-white py-2.5 pl-10 pr-16 text-[12.5px] outline-none placeholder:text-ink/40 focus:border-ink/20 focus:ring-4 focus:ring-ink/5"
                  />
                  <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-ink/10 bg-[#faf9f6] px-1.5 py-0.5 text-[10px] font-semibold text-ink/50">⌘K</kbd>
                </div>
              </div>
              <button className="hidden rounded-2xl border border-ink/8 bg-white p-2.5 text-ink/60 hover:text-ink sm:block" aria-label="Help">
                <HelpCircle className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-2xl border border-ink/8 bg-white p-2.5 text-ink/60 hover:text-ink"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {alerts.length > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-ever px-1 text-[9px] font-bold text-white ring-2 ring-[#f4f2ed]">
                      {alerts.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-2xl"
                    >
                      <div className="border-b border-ink/6 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                        Alerts
                      </div>
                      <div className="max-h-96 overflow-y-auto p-1.5">
                        {alerts.length === 0 && <div className="p-4 text-sm text-ink/50">All clear.</div>}
                        {alerts.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => adminActions.resolveAlert(a.id)}
                            className="w-full rounded-xl p-3 text-left hover:bg-ink/4"
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
              {/* Avatar */}
              <button className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-ever to-blush text-[13px] font-semibold text-white shadow-sm">
                {(session?.name || "H").slice(0, 1).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-2 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Long-press logo menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => adminActions.toggleLogoMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-16 z-50 mx-auto max-w-md rounded-3xl bg-white p-5 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Jump to</div>
                <button onClick={() => adminActions.toggleLogoMenu(false)} className="rounded-lg p-1.5 text-ink/60 hover:bg-ink/5"><X className="h-4 w-4"/></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {NAV_GROUPS.flatMap((g) => g.items).map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => adminActions.toggleLogoMenu(false)}
                    className="rounded-2xl border border-ink/6 bg-[#faf9f6] p-3 text-left hover:border-ever/40 hover:bg-white">
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
  return <div className={`rounded-3xl border border-ink/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action, subtitle }: { children: ReactNode; action?: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15.5px] font-semibold tracking-tight text-ink">{children}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] text-ink/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "success" | "warn" | "info" | "critical" | "neutral"; children: ReactNode }) {
  const map = {
    success: "bg-check/10 text-check ring-check/20",
    warn: "bg-honey/15 text-honey ring-honey/25",
    info: "bg-marine/8 text-marine ring-marine/20",
    critical: "bg-ever/12 text-ever ring-ever/25",
    neutral: "bg-ink/6 text-ink/70 ring-ink/12",
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
  icon: Icon,
  tone = "neutral",
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
  const toneMap = {
    ever: "bg-ever/12 text-ever",
    marine: "bg-marine/10 text-marine",
    check: "bg-check/12 text-check",
    honey: "bg-honey/15 text-honey",
    neutral: "bg-ink/6 text-ink/70",
  } as const;
  return (
    <div className={`group relative overflow-hidden rounded-3xl border p-5 transition-all ${
      featured
        ? "border-ink bg-ink text-white shadow-[0_18px_50px_-20px_rgba(23,23,23,0.5)]"
        : "border-ink/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)]"
    }`}>
      <div className="flex items-start justify-between">
        <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${featured ? "text-white/60" : "text-ink/50"}`}>{label}</div>
        {Icon && (
          <div className={`grid h-9 w-9 place-items-center rounded-xl ${featured ? "bg-white/15 text-white" : toneMap[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className={`font-hero text-[30px] font-bold leading-none tracking-tight ${featured ? "text-white" : "text-ink"}`}>{value}</div>
        {spark && <Sparkline values={spark} color={featured ? "#ffffff" : "#ee7273"} />}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {hint && <div className={`text-[11.5px] ${featured ? "text-white/55" : "text-ink/50"}`}>{hint}</div>}
        {delta && (
          <span className={`ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
            featured
              ? "bg-white/15 text-white"
              : delta.positive ? "bg-check/12 text-check" : "bg-ever/12 text-ever"
          }`}>
            {delta.positive ? "▲" : "▼"} {delta.pct}
          </span>
        )}
      </div>
    </div>
  );
}

export function Sparkline({ values, color = "#ee7273" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 84, h = 30;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const areaPts = `0,${h} ${pts} ${w},${h}`;
  const gradientId = `sg-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} className="opacity-90">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradientId})`} points={areaPts} />
      <polyline fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" points={pts} />
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
