import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, BarChart3, CreditCard, ChevronDown, HelpCircle, LayoutGrid, MessageSquare,
  Package, PanelLeft, Plus, Search, Settings, Stethoscope, UserCircle2, Users, X,
  Building2, ClipboardCheck, Plug, Radio, PieChart, Target, TrendingUp, DollarSign, ArrowRightLeft,
  Workflow, ClipboardList, PackagePlus, Mail, FileCode, Check,
} from "lucide-react";
import { adminActions, hydrateAdmin, useAdmin, type Role } from "@/lib/admin/store";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import { DemoVariantSheet } from "./DemoVariantSheet";
import { NotificationsBell } from "./NotificationsBell";
import { Toaster } from "@/components/ui/sonner";

type NavItem = { to?: string; label: string; icon: typeof LayoutGrid; exact?: boolean; roles?: Role[] };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "",
    items: [
      { to: "/admin",       label: "Home",      icon: LayoutGrid, exact: true },
      { to: "/admin/live",  label: "Live view", icon: Radio, roles: ["owner", "ops"] },
    ],
  },
  {
    title: "Clinical",
    items: [
      { to: "/admin/patients",          label: "Patients",         icon: Users },
      { to: "/admin/physician-queue",   label: "Physician queue",  icon: Stethoscope, roles: ["owner", "clinical"] },
      { to: "/admin/pharmacy",          label: "Pharmacy",         icon: Building2, roles: ["owner", "ops", "clinical"] },
      { to: "/admin/check-ins",         label: "Check-ins",        icon: ClipboardCheck, roles: ["owner", "clinical"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { to: "/admin/orders",   label: "Orders",   icon: Package,     roles: ["owner", "ops"] },
      { to: "/admin/payments", label: "Payments", icon: CreditCard,  roles: ["owner", "ops"] },
      { to: "/admin/messages", label: "Messages", icon: MessageSquare },
      { to: "/admin/leads",    label: "Leads",    icon: ArrowRightLeft, roles: ["owner", "ops"] },
    ],
  },
  {
    title: "Build",
    items: [
      { to: "/admin/build/funnel",   label: "Funnel builder", icon: Workflow,      roles: ["owner"] },
      { to: "/admin/build/intake",   label: "Intake builder", icon: ClipboardList, roles: ["owner", "clinical"] },
      { to: "/admin/build/products", label: "Products",       icon: PackagePlus,   roles: ["owner"] },
      { to: "/admin/build/emails",   label: "Email flows",    icon: Mail,          roles: ["owner"] },
      { to: "/admin/build/pages",    label: "Pages",          icon: FileCode,      roles: ["owner"] },
    ],
  },
  {
    title: "Analytics",
    items: [
      { to: "/admin/analytics",             label: "Overview",    icon: BarChart3, roles: ["owner", "ops"] },
      { to: "/admin/analytics/acquisition", label: "Acquisition", icon: Target,    roles: ["owner", "ops"] },
      { to: "/admin/analytics/funnel",      label: "Funnel",      icon: PieChart,  roles: ["owner", "ops"] },
      { to: "/admin/analytics/retention",   label: "Retention",   icon: TrendingUp,roles: ["owner"] },
      { to: "/admin/analytics/finances",    label: "Finances",    icon: DollarSign,roles: ["owner"] },
    ],
  },
  {
    title: "Settings",
    items: [
      { to: "/admin/settings",     label: "Settings",     icon: Settings },
      { to: "/admin/integrations", label: "Integrations", icon: Plug,  roles: ["owner", "ops"] },
      { to: "/admin/team",         label: "Team",         icon: Users, roles: ["owner"] },
    ],
  },
];

const ONBOARDING_STEPS = [
  "Connect Stripe", "Connect South End", "Invite physician", "Add first product",
  "Enable Klaviyo", "Add domain", "Publish site",
];

export function AdminShell({ title, children }: { title?: string; children: ReactNode }) {
  const nav = useNavigate();
  const session = useAdmin((s) => s.session);
  const role = useAdmin((s) => s.role);
  const scenario = useAdmin((s) => s.scenario);
  const tenant = useAdmin((s) => s.tenant);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { hydrateAdmin(); }, []);
  useEffect(() => { if (!session) adminActions.signIn("hello@blissley.com"); }, [session]);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--brand-primary", tenant.primary);
    document.documentElement.style.setProperty("--brand-accent", tenant.accent);
  }, [tenant.primary, tenant.accent]);

  const startHold = () => { holdRef.current = setTimeout(() => adminActions.toggleLogoMenu(true), 600); };
  const endHold = () => { if (holdRef.current) clearTimeout(holdRef.current); };

  const canSee = (n: NavItem) => !n.roles || n.roles.includes(role);
  const isActive = (n: NavItem) => n.to && (n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/") || pathname.startsWith(n.to + "?"));

  const NavRow = ({ n }: { n: NavItem }) => {
    const active = isActive(n);
    const Icon = n.icon;
    return (
      <Link to={n.to!} className={`group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors ${
        active ? "bg-marine/[0.08] font-semibold text-marine" : "text-ink/65 hover:bg-ink/[0.04] hover:text-ink"
      }`}>
        {active && <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-marine" />}
        <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-marine" : "text-ink/45"}`} strokeWidth={1.75} />
        {!collapsed && <span className="truncate">{n.label}</span>}

      </Link>
    );
  };

  const RoleChip = () => (
    <button
      onClick={() => adminActions.toggleLogoMenu(true)}
      className="flex w-full items-center gap-2 rounded-lg border border-ink/[0.08] px-2.5 py-1.5 text-left text-[11.5px] hover:border-ink/20"
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-semibold text-white">
        {(session?.name || "U").slice(0, 1).toUpperCase()}
      </span>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-ink">Viewing as {role}</div>
          <div className="truncate text-[10px] text-ink/45">Scenario · {scenario}</div>
        </div>
      )}
    </button>
  );

  return (
    <div className="admin-scope min-h-screen bg-canvas text-ink">

      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-ink/[0.06] bg-white transition-[width] duration-200 lg:flex ${collapsed ? "w-[64px]" : "w-[220px]"}`}>
        <button
          onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={startHold} onTouchEnd={endHold}
          className="flex items-center px-4 pt-5 text-left"
          title="Long-press for demo controls"
        >
          {tenant.id === "blissley"
            ? <img src={blissleyLogo.url} alt={tenant.name} className={collapsed ? "h-6 w-auto" : "h-7 w-auto"} />
            : <span className={`font-hero font-bold tracking-tight ${collapsed ? "text-[15px]" : "text-[18px]"}`} style={{ color: tenant.primary }}>{tenant.logoText}</span>}
        </button>

        {!collapsed && (
          <div className="mx-3 mt-4 flex items-center gap-2.5 rounded-xl border border-ink/[0.08] bg-white px-2.5 py-2">
            <div className="relative grid h-7 w-7 shrink-0 place-items-center">
              <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90">
                <circle cx="16" cy="16" r="12" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="16" cy="16" r="12" fill="none" stroke={tenant.primary} strokeWidth="3" strokeDasharray={`${(tenant.onboardingStep/ONBOARDING_STEPS.length)*75.4} 75.4`} strokeLinecap="round" />
              </svg>
              {tenant.onboardingStep >= ONBOARDING_STEPS.length && (
                <Check className="absolute inset-0 m-auto h-3 w-3" style={{ color: tenant.primary }} strokeWidth={3} />
              )}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[12px] font-semibold text-ink">Get Started</div>
              <div className="text-[10.5px] text-ink/50">{tenant.onboardingStep} of {ONBOARDING_STEPS.length} complete</div>
            </div>
          </div>
        )}

        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-3">
          {NAV.map((g, gi) => (
            <div key={gi} className="mb-3">
              {g.title && !collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">{g.title}</div>
              )}
              <div className="space-y-0.5">
                {g.items.filter(canSee).map((n) => <NavRow key={n.label} n={n} />)}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-ink/[0.06] p-2">
          <RoleChip />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-ink/[0.06] bg-white lg:hidden">
              <div className="flex items-center justify-between px-5 py-5">
                <img src={blissleyLogo.url} alt="Blissley" className="h-7 w-auto" />
                <button onClick={() => setMobileNav(false)} className="rounded-lg p-1.5 text-ink/60"><X className="h-4 w-4" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 pb-3">
                {NAV.map((g, gi) => (
                  <div key={gi} className="mb-3">
                    {g.title && <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">{g.title}</div>}
                    {g.items.filter(canSee).map((n) => (
                      <div key={n.label} onClick={() => setMobileNav(false)}><NavRow n={n} /></div>
                    ))}
                  </div>
                ))}
              </nav>
              <div className="border-t border-ink/[0.06] p-2"><RoleChip /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className={collapsed ? "lg:pl-[64px]" : "lg:pl-[220px]"}>
        <header className={`sticky top-0 z-20 ${pathname.startsWith("/admin/live") ? "bg-transparent" : "border-b border-ink/[0.06] bg-white"}`}>
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

            <div className="hidden items-center gap-2 rounded-lg border border-ink/[0.08] bg-white/70 px-2.5 py-1 backdrop-blur sm:flex">
              <img src={blissleyLogo.url} alt="Blissley" className="h-4 w-auto" />
              <span className="mx-1 h-3 w-px bg-ink/10" />
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink/55">
                <span className="relative flex h-1.5 w-1.5">
                  <span className={`absolute inset-0 animate-ping rounded-full ${scenario === "crisis" ? "bg-ever" : "bg-check"} opacity-60`} />
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${scenario === "crisis" ? "bg-ever" : "bg-check"}`} />
                </span>
                {scenario === "crisis" ? "Degraded" : "All systems operational"}
              </span>
            </div>

            <div className="mx-auto hidden w-full max-w-md md:block">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
                <input placeholder="Search patients, orders, cases…"
                  className="w-full rounded-lg bg-[#f1f2f4] py-1.5 pl-9 pr-12 text-[12.5px] outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1 focus:ring-marine/30" />
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-ink/10 bg-white px-1.5 py-0.5 text-[10px] text-ink/45">⌘K</kbd>

              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button className="hidden items-center gap-1 rounded-lg bg-marine px-2.5 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_1px_0_rgba(15,23,42,0.08)] hover:bg-marine/90 sm:flex">
                <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> New patient
              </button>

              <button className="hidden rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink sm:block" aria-label="Help">
                <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <NotificationsBell />
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

        <main className="w-full px-4 pb-16 pt-4 lg:px-6">{children}</main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />


      {/* Mobile bottom tabs */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-ink/[0.06] bg-white py-1.5 lg:hidden">
        {[
          { to: "/admin", icon: LayoutGrid, label: "Home", exact: true },
          { to: "/admin/live", icon: Radio, label: "Live" },
          { to: "/admin/patients", icon: Users, label: "Patients" },
          { to: "/admin/messages", icon: MessageSquare, label: "Msgs" },
          { to: "/admin/settings", icon: Settings, label: "More" },
        ].map((t) => {
          const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={`flex flex-col items-center gap-0.5 rounded-md px-3 py-1 ${active ? "text-ink" : "text-ink/45"}`}>
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              <span className="text-[10px]">{t.label}</span>
            </Link>
          );
        })}
      </div>

      <DemoVariantSheet />
    </div>
  );
}

/* ============ Reusable primitives ============ */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] ${className}`}>{children}</div>;
}


export function SectionTitle({ children, action, subtitle }: { children: ReactNode; action?: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <div className="font-hero text-[15px] font-semibold text-ink">{children}</div>
        {subtitle && <div className="mt-0.5 text-[11.5px] text-ink/50">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export function Pill({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warn" | "critical" | "info"; children: ReactNode }) {
  const map = {
    neutral: "bg-ink/5 text-ink/70",
    success: "bg-check/10 text-check",
    warn: "bg-honey/15 text-honey",
    critical: "bg-ever/10 text-ever",
    info: "bg-marine/10 text-marine",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${map[tone]}`}>{children}</span>;
}

// Legacy helper re-exports (used by admin.orders, admin.patients, etc.)
export function StatusPill({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warn" | "critical" | "info"; children: ReactNode }) {
  return <Pill tone={tone}>{children}</Pill>;
}
export function formatMoney(cents: number): string {
  const n = cents > 10_000 ? cents / 100 : cents;
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
export function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
