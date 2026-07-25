import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Building2, CreditCard, Users, Truck, MapPin, Bell, Plug, ShieldCheck, Scale } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SettingsLayout,
});

const NAV: { group: string; items: { to: string; label: string; icon: typeof Building2 }[] }[] = [
  { group: "Account", items: [
    { to: "/admin/settings/general",      label: "General",       icon: Building2 },
    { to: "/admin/settings/plan-billing", label: "Plan & Billing",icon: CreditCard },
    { to: "/admin/settings/team",         label: "Team",          icon: Users },
  ]},
  { group: "Operations", items: [
    { to: "/admin/settings/pharmacy-routing", label: "Pharmacy Routing", icon: Truck },
    { to: "/admin/settings/states",           label: "States Served",    icon: MapPin },
    { to: "/admin/settings/notifications",    label: "Notifications",    icon: Bell },
    { to: "/admin/settings/integrations",     label: "Integrations",     icon: Plug },
  ]},
  { group: "Compliance", items: [
    { to: "/admin/settings/compliance", label: "Compliance & HIPAA", icon: ShieldCheck },
    { to: "/admin/settings/legal",      label: "Legal & Policies",   icon: Scale },
  ]},
];

function SettingsLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <AdminShell title="Settings">
      <div className="grid gap-5 lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:h-fit">
          <nav className="rounded-2xl border border-ink/8 bg-white p-2 shadow-[0_1px_0_rgba(23,23,23,0.02)]">
            {NAV.map((group, gi) => (
              <div key={group.group} className={gi > 0 ? "mt-2 border-t border-ink/6 pt-2" : ""}>
                <div className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">{group.group}</div>
                {group.items.map((it) => {
                  const active = pathname === it.to || (it.to === "/admin/settings/general" && pathname === "/admin/settings");
                  const Icon = it.icon;
                  return (
                    <Link key={it.to} to={it.to}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition ${active ? "bg-ink text-white" : "text-ink/75 hover:bg-ink/5"}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </AdminShell>
  );
}
