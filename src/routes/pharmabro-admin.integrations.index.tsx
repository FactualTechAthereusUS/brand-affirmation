import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ExternalLink, CheckCircle2, AlertTriangle, Circle, Zap, Lock, X, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type Integration, type IntegrationCategory } from "@/lib/admin/store";
import { toast } from "sonner";

export const Route = createFileRoute("/pharmabro-admin/integrations/")({
  head: () => ({ meta: [
    { title: "Integrations — Blissley Admin" },
    { name: "description", content: "Connect payments, pharmacies, ads, analytics, and comms — all in one place." },
  ]}),
  component: IntegrationsMarketplace,
});

const CATEGORIES: (IntegrationCategory | "All")[] = [
  "All","Payments","Pharmacies","Clinical","Marketing","Analytics","Email/SMS","Shipping","Comms","Banking","Auth",
];

function timeAgo(ts: number): string {
  if (!ts) return "Never";
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function IntegrationsMarketplace() {
  const integrations = useAdmin((s) => s.integrations);
  const [cat, setCat] = useState<(IntegrationCategory|"All")>("All");
  const [q, setQ] = useState("");
  const [connectTarget, setConnectTarget] = useState<Integration | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="k") { e.preventDefault(); searchRef.current?.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return integrations.filter((i) =>
      (cat === "All" || i.category === cat) &&
      (!qq || i.name.toLowerCase().includes(qq) || i.description.toLowerCase().includes(qq) || i.category.toLowerCase().includes(qq))
    );
  }, [integrations, cat, q]);

  const counts = useMemo(() => {
    const connected = integrations.filter((i)=>i.status==="connected").length;
    const degraded = integrations.filter((i)=>i.status==="degraded" || i.status==="down").length;
    const available = integrations.filter((i)=>i.status==="disconnected").length;
    const latest = integrations.filter((i)=>i.lastSync>0).reduce((m,i)=>Math.max(m,i.lastSync),0);
    return { connected, degraded, available, total: integrations.length, latest };
  }, [integrations]);

  const perCat = useMemo(() => {
    const map: Record<string,{c:number;t:number}> = {};
    for (const i of integrations) {
      const k = i.category;
      map[k] ??= { c: 0, t: 0 };
      map[k].t++;
      if (i.status === "connected") map[k].c++;
    }
    return map;
  }, [integrations]);

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-hero text-[22px] font-semibold text-ink">Integrations</h1>
          <div className="mt-0.5 text-[12px] text-ink/55">Connect Blissley to the tools your team already uses. {counts.connected} of {counts.total} connected.</div>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
          <input
            ref={searchRef}
            value={q} onChange={(e)=>setQ(e.target.value)}
            placeholder="Search integrations… (⌘K)"
            className="w-full rounded-lg border border-ink/12 bg-white pl-8 pr-3 py-1.5 text-[12.5px] text-ink placeholder-ink/40 focus:border-marine focus:outline-none"
          />
        </div>
      </div>

      {/* Summary strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard label="Connected" value={counts.connected} tone="check" icon={<CheckCircle2 className="h-3.5 w-3.5"/>} />
        <SummaryCard label="Needs attention" value={counts.degraded} tone="honey" icon={<AlertTriangle className="h-3.5 w-3.5"/>} />
        <SummaryCard label="Available to add" value={counts.available} tone="marine" icon={<Zap className="h-3.5 w-3.5"/>} />
        <SummaryCard label="Last sync" value={timeAgo(counts.latest)} tone="ink" isText />
      </div>

      {/* Category tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5 border-b border-ink/[0.08]">
        {CATEGORIES.map((c) => {
          const active = cat === c;
          const meta = c === "All" ? { c: counts.connected, t: counts.total } : perCat[c] ?? { c: 0, t: 0 };
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative -mb-px px-3 py-2 text-[12px] font-medium transition ${active ? "text-ink" : "text-ink/55 hover:text-ink"}`}
            >
              <span>{c}</span>
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${active ? "bg-marine/10 text-marine" : "bg-ink/5 text-ink/50"}`}>
                {c === "All" ? meta.t : `${meta.c}/${meta.t}`}
              </span>
              {active && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-marine"/>}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <div className="text-[13px] font-medium text-ink">No integrations match your search</div>
          <div className="mt-1 text-[11.5px] text-ink/55">Try a different category or clear the search.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((i) => (
            <IntegrationCard key={i.id} integration={i} onConnect={() => setConnectTarget(i)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {connectTarget && <ConnectDialog integration={connectTarget} onClose={() => setConnectTarget(null)} />}
      </AnimatePresence>
    </AdminShell>
  );
}

function SummaryCard({ label, value, tone, icon, isText }: {
  label: string; value: number | string; tone: "check"|"honey"|"marine"|"ink"; icon?: React.ReactNode; isText?: boolean;
}) {
  const tones = {
    check: "text-check",
    honey: "text-honey",
    marine: "text-marine",
    ink: "text-ink",
  };
  return (
    <Card className="p-3">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/50">
        {icon}<span>{label}</span>
      </div>
      <div className={`mt-1 font-hero font-semibold tabular-nums ${tones[tone]} ${isText ? "text-[16px]" : "text-[24px]"}`}>{value}</div>
    </Card>
  );
}

function BrandTile({ color, mono, logoUrl, size = 40 }: { color: string; mono: string; logoUrl?: string; size?: number }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="grid shrink-0 place-items-center rounded-lg font-hero font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.42, letterSpacing: "-0.02em" }}
    >
      {mono}
    </div>
  );
}

function StatusChip({ status }: { status: Integration["status"] }) {
  const map = {
    connected:    { bg: "bg-check/10",  fg: "text-check",  dot: "bg-check",  label: "Connected" },
    degraded:     { bg: "bg-honey/15",  fg: "text-honey",  dot: "bg-honey",  label: "Degraded" },
    down:         { bg: "bg-ever/10",   fg: "text-ever",   dot: "bg-ever",   label: "Down" },
    disconnected: { bg: "bg-ink/5",     fg: "text-ink/55", dot: "bg-ink/30", label: "Not connected" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${s.bg} ${s.fg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function IntegrationCard({ integration, onConnect }: { integration: Integration; onConnect: () => void }) {
  const isConnected = integration.status === "connected" || integration.status === "degraded" || integration.status === "down";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
    >
      <Link
        to="/pharmabro-admin/integrations/$id"
        params={{ id: integration.id }}
        className="group block rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:border-ink/20 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-start gap-3">
          <BrandTile color={integration.brand.color} mono={integration.brand.mono} logoUrl={integration.brand.logoUrl} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <div className="truncate text-[13.5px] font-semibold text-ink">{integration.name}</div>
              <a
                href={integration.docsUrl} target="_blank" rel="noreferrer"
                onClick={(e)=>e.stopPropagation()}
                className="text-ink/30 hover:text-ink/70"
                aria-label="Open docs"
              ><ExternalLink className="h-3 w-3"/></a>
            </div>
            <div className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink/40">{integration.category}</div>
          </div>
          <StatusChip status={integration.status} />
        </div>

        <div className="mt-3 line-clamp-2 min-h-[32px] text-[12px] leading-[1.45] text-ink/60">{integration.description}</div>

        <div className="mt-4 flex items-center justify-between border-t border-ink/[0.06] pt-3">
          <div className="text-[11px] text-ink/50">
            {isConnected ? `Last sync ${timeAgo(integration.lastSync)}` : `${integration.scopes.length} permission${integration.scopes.length===1?"":"s"}`}
          </div>
          {isConnected ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); const ok = adminActions.testIntegration(integration.id); toast[ok?"success":"error"](ok?`${integration.name} — test OK`:`${integration.name} — test failed`); }}
                className="rounded-md border border-ink/12 px-2 py-1 text-[11px] font-medium text-ink/70 hover:border-ink hover:text-ink"
                title="Test connection"
              >Test</button>
              <span className="inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-[11px] font-medium text-white group-hover:bg-ink/90">
                Manage <ArrowRight className="h-3 w-3"/>
              </span>
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onConnect(); }}
              className="inline-flex items-center gap-1 rounded-md bg-marine px-2.5 py-1 text-[11px] font-medium text-white hover:bg-marine/90"
            >
              Connect
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────── Connect dialog ────────── */

export function ConnectDialog({ integration, onClose, onConnected }: { integration: Integration; onClose: () => void; onConnected?: () => void }) {
  const [step, setStep] = useState<"perms" | "config">("perms");
  const [values, setValues] = useState<Record<string,string|boolean>>(() => {
    const base: Record<string,string|boolean> = {};
    for (const f of integration.configSchema) base[f.key] = f.type === "toggle" ? false : "";
    return base;
  });
  const [showSecret, setShowSecret] = useState<Record<string,boolean>>({});
  const [errors, setErrors] = useState<Record<string,string>>({});

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit() {
    const errs: Record<string,string> = {};
    for (const f of integration.configSchema) {
      if (f.required && !values[f.key]) errs[f.key] = "Required";
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }
    adminActions.connectIntegration(integration.id, values);
    toast.success(`${integration.name} connected`);
    onConnected?.();
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-[520px] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-ink/[0.06] px-5 py-4">
          <BrandTile color={integration.brand.color} mono={integration.brand.mono} logoUrl={integration.brand.logoUrl} size={36} />
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink/45">{step === "perms" ? "Authorize" : "Configuration"}</div>
            <div className="truncate text-[15px] font-semibold text-ink">Connect Blissley to {integration.name}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink/50 hover:bg-ink/5 hover:text-ink"><X className="h-4 w-4"/></button>
        </div>

        {/* Body */}
        {step === "perms" ? (
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-marine/[0.06] px-3 py-2">
              <Lock className="h-3.5 w-3.5 text-marine"/>
              <span className="text-[11.5px] text-ink/70">{integration.name} will be able to:</span>
            </div>
            <ul className="space-y-2">
              {integration.scopes.map((s) => (
                <li key={s.key} className="flex items-start gap-2 rounded-lg border border-ink/[0.06] px-3 py-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-check"/>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium text-ink">{s.label}</div>
                    <div className="text-[10.5px] text-ink/50">{s.required ? "Required" : "Optional"}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[10.5px] leading-relaxed text-ink/45">
              You can revoke access anytime from the integration's detail page.
            </div>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
            <div className="space-y-3">
              {integration.configSchema.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 flex items-center justify-between text-[11.5px] font-medium text-ink/75">
                    <span>{f.label}{f.required && <span className="text-ever"> *</span>}</span>
                    {errors[f.key] && <span className="text-[10.5px] text-ever">{errors[f.key]}</span>}
                  </label>
                  {f.type === "toggle" ? (
                    <button
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, [f.key]: !v[f.key] }))}
                      className={`inline-flex h-5 w-9 items-center rounded-full transition ${values[f.key] ? "bg-marine" : "bg-ink/15"}`}
                    >
                      <span className={`h-4 w-4 rounded-full bg-white shadow transition ${values[f.key] ? "translate-x-4" : "translate-x-0.5"}`}/>
                    </button>
                  ) : f.type === "select" ? (
                    <select
                      value={String(values[f.key] ?? "")}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px] text-ink focus:border-marine focus:outline-none"
                    >
                      <option value="">Select…</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type={f.type === "secret" && !showSecret[f.key] ? "password" : "text"}
                        value={String(values[f.key] ?? "")}
                        placeholder={f.placeholder}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 pr-9 text-[12.5px] text-ink placeholder-ink/40 focus:border-marine focus:outline-none"
                      />
                      {f.type === "secret" && (
                        <button
                          type="button"
                          onClick={() => setShowSecret((s) => ({ ...s, [f.key]: !s[f.key] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                        >{showSecret[f.key] ? <EyeOff className="h-3.5 w-3.5"/> : <Eye className="h-3.5 w-3.5"/>}</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-ink/[0.06] bg-ink/[0.02] px-5 py-3">
          <button onClick={step === "perms" ? onClose : () => setStep("perms")} className="rounded-md px-3 py-1.5 text-[12px] font-medium text-ink/70 hover:text-ink">
            {step === "perms" ? "Cancel" : "Back"}
          </button>
          <button
            onClick={step === "perms" ? () => setStep("config") : submit}
            className="rounded-md bg-marine px-4 py-1.5 text-[12px] font-medium text-white hover:bg-marine/90"
          >
            {step === "perms" ? "Allow access" : "Connect"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
