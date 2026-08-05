import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, AlertTriangle, TrendingDown, Rocket, EyeOff, User, Building2, Store, Pill, PlayCircle } from "lucide-react";
import { adminActions, useAdmin, type DemoScenario, type Role } from "@/lib/admin/store";
import { useNavigate } from "@tanstack/react-router";
import { platformActions } from "@/lib/platform/store";

const SCENARIOS: { key: DemoScenario; label: string; sub: string; icon: typeof Zap; tone: string }[] = [
  { key: "healthy", label: "Healthy day",  sub: "Normal traffic, clean metrics",       icon: Zap,           tone: "text-check" },
  { key: "crisis",  label: "Crisis day",   sub: "Payment gateway + pharmacy issues",   icon: AlertTriangle, tone: "text-ever" },
  { key: "churn",   label: "Churn spike",  sub: "Retention dip, cancellations up",     icon: TrendingDown,  tone: "text-honey" },
  { key: "launch",  label: "Launch day",   sub: "12 new pending patients, high spend", icon: Rocket,        tone: "text-marine" },
  { key: "empty",   label: "Empty state",  sub: "Fresh workspace, no data",            icon: EyeOff,        tone: "text-ink/50" },
];

const ROLES: { key: Role; label: string; sub: string }[] = [
  { key: "owner",    label: "Owner",    sub: "Full access · financials, team, integrations" },
  { key: "ops",      label: "Ops",      sub: "Orders, pharmacy, patients (write); clinical read-only" },
  { key: "clinical", label: "Clinical", sub: "Cases, patients, messages (write); no financials" },
  { key: "support",  label: "Support",  sub: "Messages, patients read-only; no financials" },
];

const STAGE_LABEL: Record<string, string> = {
  live: "Live · full data",
  ramping: "Ramping · early sales",
  zero: "Zero · just onboarded",
};

export function DemoVariantSheet() {
  const navigate = useNavigate();
  const open = useAdmin((s) => s.ui.showLogoMenu);
  const scenario = useAdmin((s) => s.scenario);
  const role = useAdmin((s) => s.role);
  const tenant = useAdmin((s) => s.tenant);
  const tenants = useAdmin((s) => s.tenants);
  const launch = (to: "/operator" | "/operator/brands" | "/admin/onboarding/$step" | "/pharmacy/orders", preset?: "onboarding-start" | "onboarding-partial" | "launch-ready" | "suspended", step = "1") => {
    if (preset) platformActions.applyPreset(preset);
    if (to === "/admin/onboarding/$step") { adminActions.switchTenant("zeroco"); navigate({ to, params: { step }, search: { brand: "zeroco" } }); }
    else navigate({ to });
    adminActions.toggleLogoMenu(false);
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => adminActions.toggleLogoMenu(false)} />
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-4 top-auto z-50 mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-x-6 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
          >
            <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">PharmaBro · Demo control</div>
                <div className="mt-0.5 font-hero text-[15px] font-semibold text-ink">Switch brand · scenario · role</div>
              </div>
              <button onClick={() => adminActions.toggleLogoMenu(false)} className="rounded-lg p-1.5 text-ink/60 hover:bg-ink/5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Brand tenant</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {tenants.map((t) => {
                  const active = tenant.id === t.id;
                  return (
                    <button key={t.id} onClick={() => { adminActions.switchTenant(t.id); adminActions.toggleLogoMenu(false); }}
                      className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all ${
                        active ? "border-ink bg-ink/[0.03]" : "border-ink/[0.08] hover:border-ink/25"
                      }`}>
                      <div className="flex w-full items-center gap-2">
                        <span className="h-6 w-6 shrink-0 rounded-md" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }} />
                        <span className="text-[13px] font-semibold text-ink">{t.name}</span>
                        {active && <span className="ml-auto text-[10px] font-semibold text-check">Active</span>}
                      </div>
                      <div className="text-[10.5px] text-ink/55">{STAGE_LABEL[t.stage] ?? t.stage}</div>
                      <div className="text-[10px] text-ink/40">{t.website}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-ink/45">
                <Building2 className="h-3 w-3" />
                Switching tenants reseeds patients, orders, and payments to match the tenant's stage.
              </div>

              <div className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">PharmaBro platform demos</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button onClick={() => launch("/operator")} className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 text-left hover:border-ink/25"><Store className="mt-0.5 h-4 w-4 text-marine"/><div><div className="text-[12.5px] font-semibold">Operator overview</div><div className="text-[11px] text-ink/50">All brands, revenue and platform alerts</div></div></button>
                <button onClick={() => launch("/operator/brands")} className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 text-left hover:border-ink/25"><Building2 className="mt-0.5 h-4 w-4 text-marine"/><div><div className="text-[12.5px] font-semibold">New brand provisioning</div><div className="text-[11px] text-ink/50">Create a tenant and invite its admin</div></div></button>
                {([['onboarding-start','Onboarding · start','Fresh brand at step one','1'],['onboarding-partial','Onboarding · partial','Identity, domain and Stripe complete','4'],['launch-ready','Onboarding · launch ready','All requirements ready for review','6']] as const).map(([preset,label,sub,step])=><button key={preset} onClick={() => launch("/admin/onboarding/$step",preset,step)} className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 text-left hover:border-ink/25"><PlayCircle className="mt-0.5 h-4 w-4 text-check"/><div><div className="text-[12.5px] font-semibold">{label}</div><div className="text-[11px] text-ink/50">{sub}</div></div></button>)}
                <button onClick={() => launch("/operator","suspended")} className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 text-left hover:border-ink/25"><AlertTriangle className="mt-0.5 h-4 w-4 text-ever"/><div><div className="text-[12.5px] font-semibold">Suspended brand</div><div className="text-[11px] text-ink/50">Review operator recovery controls</div></div></button>
              </div>

              <div className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Pharmacy demos</div>
              <button onClick={() => launch("/pharmacy/orders")} className="mt-2 flex w-full items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 text-left hover:border-ink/25"><Pill className="mt-0.5 h-4 w-4 text-bluebell"/><div><div className="text-[12.5px] font-semibold">South End fulfillment queue</div><div className="text-[11px] text-ink/50">Pending, shipment and failed-order workflows</div></div></button>

              <div className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Scenario</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SCENARIOS.map((s) => {
                  const Icon = s.icon;
                  const active = scenario === s.key;
                  return (
                    <button key={s.key} onClick={() => { adminActions.setScenario(s.key); adminActions.toggleLogoMenu(false); }}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        active ? "border-ink bg-ink/[0.03]" : "border-ink/[0.08] hover:border-ink/25"
                      }`}>
                      <Icon className={`mt-0.5 h-4 w-4 ${s.tone}`} strokeWidth={1.75} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-semibold text-ink">{s.label}</div>
                        <div className="text-[11px] text-ink/50">{s.sub}</div>
                      </div>
                      {active && <span className="text-[10px] font-semibold text-check">Active</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Viewing as</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ROLES.map((r) => {
                  const active = role === r.key;
                  return (
                    <button key={r.key} onClick={() => { adminActions.setRole(r.key); }}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        active ? "border-ink bg-ink/[0.03]" : "border-ink/[0.08] hover:border-ink/25"
                      }`}>
                      <User className="mt-0.5 h-4 w-4 text-ink/60" strokeWidth={1.75} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-semibold text-ink">{r.label}</div>
                        <div className="text-[11px] text-ink/50">{r.sub}</div>
                      </div>
                      {active && <span className="text-[10px] font-semibold text-check">You</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Jump to portal</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a href="/portal/patient" className="rounded-xl border border-ink/[0.08] p-3 text-[12.5px] font-semibold text-ink hover:border-ink">Patient portal →</a>
                <a href="/portal/physician" className="rounded-xl border border-ink/[0.08] p-3 text-[12.5px] font-semibold text-ink hover:border-ink">Physician portal →</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
