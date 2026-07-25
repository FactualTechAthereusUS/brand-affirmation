import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid, Radio, Users, Stethoscope, Package, ClipboardCheck, MessageSquare,
  CreditCard, Palette, ClipboardList, ShoppingBag, Mail, FileText, BarChart3,
  Target, PieChart, TrendingUp, DollarSign, Settings, Plug, Building2,
  MapPin, Bell, ShieldCheck, Scale, Search, ChevronDown, PanelLeft, X, HelpCircle,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  hydratePharmabro, pharmabroActions, useActiveBrand, usePharmabro,
} from "@/lib/pharmabro/store";

type Nav = { to: string; label: string; icon: typeof LayoutGrid; exact?: boolean };
type Group = { title: string; items: Nav[] };

const NAV: Group[] = [
  { title: "", items: [
    { to: "/pharmabro-admin", label: "Home", icon: LayoutGrid, exact: true },
    { to: "/pharmabro-admin/live", label: "Live view", icon: Radio },
  ]},
  { title: "Clinical", items: [
    { to: "/pharmabro-admin/patients", label: "Patients", icon: Users },
    { to: "/pharmabro-admin/physician-queue", label: "Physician queue", icon: Stethoscope },
    { to: "/pharmabro-admin/orders", label: "Orders", icon: Package },
    { to: "/pharmabro-admin/check-ins", label: "Check-ins", icon: ClipboardCheck },
    { to: "/pharmabro-admin/messages", label: "Messages", icon: MessageSquare },
    { to: "/pharmabro-admin/payments", label: "Payments", icon: CreditCard },
  ]},
  { title: "Build", items: [
    { to: "/pharmabro-admin/build/funnel", label: "Funnel builder", icon: Palette },
    { to: "/pharmabro-admin/build/intake", label: "Intake builder", icon: ClipboardList },
    { to: "/pharmabro-admin/build/products", label: "Products & pricing", icon: ShoppingBag },
    { to: "/pharmabro-admin/build/emails", label: "Email flows", icon: Mail },
    { to: "/pharmabro-admin/build/pages", label: "Pages", icon: FileText },
  ]},
  { title: "Analytics", items: [
    { to: "/pharmabro-admin/analytics", label: "Overview", icon: BarChart3, exact: true },
    { to: "/pharmabro-admin/analytics/acquisition", label: "Acquisition", icon: Target },
    { to: "/pharmabro-admin/analytics/funnel", label: "Funnel", icon: PieChart },
    { to: "/pharmabro-admin/analytics/retention", label: "Retention", icon: TrendingUp },
    { to: "/pharmabro-admin/analytics/finances", label: "Finances", icon: DollarSign },
  ]},
  { title: "Settings", items: [
    { to: "/pharmabro-admin/settings", label: "Brand settings", icon: Settings, exact: true },
    { to: "/pharmabro-admin/settings/stripe", label: "Stripe", icon: CreditCard },
    { to: "/pharmabro-admin/settings/team", label: "Team", icon: Users },
    { to: "/pharmabro-admin/settings/pharmacy", label: "Pharmacy", icon: Building2 },
    { to: "/pharmabro-admin/settings/states", label: "States served", icon: MapPin },
    { to: "/pharmabro-admin/settings/notifications", label: "Notifications", icon: Bell },
    { to: "/pharmabro-admin/settings/integrations", label: "Integrations", icon: Plug },
    { to: "/pharmabro-admin/settings/compliance", label: "Compliance", icon: ShieldCheck },
    { to: "/pharmabro-admin/settings/legal", label: "Legal", icon: Scale },
  ]},
];

export function BrandShell({ children, title }: { children: ReactNode; title?: string }) {
  const brand = useActiveBrand();
  const brands = usePharmabro((s) => s.brands);
  const activeId = usePharmabro((s) => s.activeBrandId);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  useEffect(() => { hydratePharmabro(); }, []);

  const isActive = (n: Nav) => n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");

  const themeVars: React.CSSProperties = {
    ["--brand-primary" as string]: brand.theme.primary,
    ["--brand-primary-fg" as string]: brand.theme.primaryFg,
    ["--brand-accent" as string]: brand.theme.accent,
  };

  const NavRow = ({ n }: { n: Nav }) => {
    const active = isActive(n);
    const Icon = n.icon;
    return (
      <Link to={n.to} className={`group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors ${
        active ? "font-semibold" : "text-ink/65 hover:bg-ink/[0.04] hover:text-ink"
      }`}
        style={active ? { background: `color-mix(in oklab, ${brand.theme.primary} 10%, transparent)`, color: brand.theme.primary } : undefined}
      >
        {active && <span className="absolute inset-y-1 left-0 w-[3px] rounded-full" style={{ background: brand.theme.primary }} />}
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} style={active ? { color: brand.theme.primary } : { color: "rgb(23 23 23 / 0.45)" }} />
        {!collapsed && <span className="truncate">{n.label}</span>}
      </Link>
    );
  };

  return (
    <div className="brand-scope min-h-screen bg-[#faf9f6] text-ink" style={themeVars}>
      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-ink/[0.06] bg-white transition-[width] duration-200 lg:flex ${collapsed ? "w-[64px]" : "w-[228px]"}`}>
        {/* Brand switcher header */}
        <div className="px-3 pt-4">
          <button
            onClick={() => setBrandOpen((v) => !v)}
            className="flex w-full items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-2.5 py-2 hover:border-ink/20"
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[13px] font-bold"
              style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}
              aria-hidden
            >
              {brand.name.slice(0, 1)}
            </span>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left leading-tight">
                  <div className="truncate text-[12.5px] font-bold text-ink">{brand.name}</div>
                  <div className="truncate text-[10.5px] text-ink/50 capitalize">{brand.stage.replace("_", " ")}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-ink/45" />
              </>
            )}
          </button>
          {brandOpen && !collapsed && (
            <div className="mt-1 rounded-lg border border-ink/[0.08] bg-white p-1 shadow-lg">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { pharmabroActions.setActiveBrand(b.id); setBrandOpen(false); }}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-ink/5 ${b.id === activeId ? "bg-ink/5" : ""}`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded text-[10px] font-bold"
                    style={{ background: b.theme.primary, color: b.theme.primaryFg }}>
                    {b.name.slice(0, 1)}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{b.name}</span>
                    <span className="block text-[10px] text-ink/45 capitalize">{b.stage.replace("_", " ")}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-3">
          {NAV.map((g, gi) => (
            <div key={gi} className="mb-3">
              {g.title && !collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">{g.title}</div>
              )}
              <div className="space-y-0.5">
                {g.items.map((n) => <NavRow key={n.to} n={n} />)}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-ink/[0.06] p-3">
          {!collapsed ? (
            <div className="text-[10.5px] text-ink/50">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                All systems operational
              </div>
              <a href="mailto:support@pharmabro.io" className="mt-1 block underline hover:text-ink">Contact support</a>
            </div>
          ) : (
            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
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
              className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-ink/[0.06] bg-white lg:hidden">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-md text-[13px] font-bold"
                    style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>{brand.name.slice(0, 1)}</span>
                  <span className="text-[13px] font-bold">{brand.name}</span>
                </div>
                <button onClick={() => setMobileNav(false)} className="p-1.5 text-ink/60"><X className="h-4 w-4" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 pb-3">
                {NAV.map((g, gi) => (
                  <div key={gi} className="mb-3">
                    {g.title && <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">{g.title}</div>}
                    {g.items.map((n) => (
                      <div key={n.to} onClick={() => setMobileNav(false)}><NavRow n={n} /></div>
                    ))}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className={collapsed ? "lg:pl-[64px]" : "lg:pl-[228px]"}>
        <header className="sticky top-0 z-20 border-b border-ink/[0.06] bg-white/95 backdrop-blur">
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

            <div className="mx-auto hidden w-full max-w-md md:block">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
                <input placeholder="Search patients, orders, cases…"
                  className="w-full rounded-lg bg-[#f1f2f4] py-1.5 pl-9 pr-12 text-[12.5px] outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1"
                  style={{ ["--tw-ring-color" as string]: brand.theme.primary + "50" }}
                />
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-ink/10 bg-white px-1.5 py-0.5 text-[10px] text-ink/45">⌘K</kbd>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <span className="hidden items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1 text-[11px] text-ink/60 sm:flex">
                <span className="capitalize font-semibold text-ink/80">{brand.stage.replace("_", " ")}</span> mode
              </span>
              <button className="rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink" aria-label="Help">
                <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <span className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold"
                style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}>
                {brand.name.slice(0, 1)}
              </span>
            </div>
          </div>
          {title && (
            <div className="hidden px-6 pb-3 pt-1 sm:block">
              <h1 className="text-[13px] font-semibold text-ink/70">{title}</h1>
            </div>
          )}
        </header>

        <main className="w-full px-4 pb-16 pt-4 lg:px-6">{children}</main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

/* Reusable primitives */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] ${className}`}>{children}</div>;
}

export function BrandButton({ children, onClick, className = "", variant = "primary", type = "button" }: {
  children: ReactNode; onClick?: () => void; className?: string; variant?: "primary" | "ghost" | "outline"; type?: "button" | "submit";
}) {
  const brand = useActiveBrand();
  if (variant === "ghost") {
    return <button type={type} onClick={onClick} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-ink/70 hover:bg-ink/5 ${className}`}>{children}</button>;
  }
  if (variant === "outline") {
    return <button type={type} onClick={onClick} className={`rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-ink/30 ${className}`}>{children}</button>;
  }
  return (
    <button type={type} onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold shadow-sm transition-opacity hover:opacity-90 ${className}`}
      style={{ background: brand.theme.primary, color: brand.theme.primaryFg }}
    >{children}</button>
  );
}

export function Pill({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warn" | "critical" | "info" | "brand"; children: ReactNode }) {
  const brand = useActiveBrand();
  const map: Record<string, string> = {
    neutral: "bg-ink/5 text-ink/70",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    critical: "bg-rose-50 text-rose-700",
    info: "bg-sky-50 text-sky-700",
  };
  if (tone === "brand") {
    return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium"
      style={{ background: `color-mix(in oklab, ${brand.theme.primary} 12%, transparent)`, color: brand.theme.primary }}>{children}</span>;
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${map[tone]}`}>{children}</span>;
}

export function SectionTitle({ children, action, subtitle }: { children: ReactNode; action?: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <div className="text-[15px] font-bold text-ink">{children}</div>
        {subtitle && <div className="mt-0.5 text-[11.5px] text-ink/55">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-bold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-ink/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
