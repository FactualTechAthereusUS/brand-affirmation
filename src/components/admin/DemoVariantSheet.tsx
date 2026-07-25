import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, AlertTriangle, TrendingDown, Rocket, EyeOff, User } from "lucide-react";
import { adminActions, useAdmin, type DemoScenario, type Role } from "@/lib/admin/store";

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

export function DemoVariantSheet() {
  const open = useAdmin((s) => s.ui.showLogoMenu);
  const scenario = useAdmin((s) => s.scenario);
  const role = useAdmin((s) => s.role);
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
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Demo control</div>
                <div className="mt-0.5 font-hero text-[15px] font-semibold text-ink">Switch scenario · role · portal</div>
              </div>
              <button onClick={() => adminActions.toggleLogoMenu(false)} className="rounded-lg p-1.5 text-ink/60 hover:bg-ink/5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Scenario</div>
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
