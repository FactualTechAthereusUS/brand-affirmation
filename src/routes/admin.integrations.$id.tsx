import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ExternalLink, Copy, RefreshCw, Play, Trash2, Eye, EyeOff, CheckCircle2,
  AlertTriangle, XCircle, Shield, Info,
} from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { adminActions, useAdmin, type Integration, type IntegrationConfigField } from "@/lib/admin/store";
import { toast } from "sonner";
import { ConnectDialog } from "./admin.integrations.index";

export const Route = createFileRoute("/admin/integrations/$id")({
  head: ({ params }) => ({ meta: [
    { title: `${params.id} — Integrations — Blissley Admin` },
    { name: "description", content: "Manage integration configuration, webhooks, and sync activity." },
  ]}),
  component: IntegrationDetail,
});

function timeAgo(ts: number): string {
  if (!ts) return "Never";
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
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
  return (
    <div className="grid shrink-0 place-items-center rounded-lg font-hero font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.42 }}>
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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.bg} ${s.fg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`}/>{s.label}
    </span>
  );
}

function IntegrationDetail() {
  const { id } = Route.useParams();
  const integration = useAdmin((s) => s.integrations.find((i) => i.id === id));
  const related = useAdmin((s) => integration ? s.integrations.filter((i) => i.category === integration.category && i.id !== id).slice(0, 4) : []);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [showConnect, setShowConnect] = useState(false);

  if (!integration) {
    return (
      <AdminShell>
        <div className="rounded-xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <div className="text-[13px] font-medium text-ink">Integration not found</div>
          <Link to="/admin/integrations" className="mt-2 inline-block text-[12px] text-marine hover:underline">Back to marketplace</Link>
        </div>
      </AdminShell>
    );
  }

  const isConnected = integration.status !== "disconnected";

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-4">
        <Link to="/admin/integrations" className="mb-3 inline-flex items-center gap-1 text-[11.5px] text-ink/55 hover:text-ink">
          <ArrowLeft className="h-3 w-3"/> Integrations
        </Link>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <BrandTile color={integration.brand.color} mono={integration.brand.mono} size={48} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-hero text-[22px] font-semibold text-ink">{integration.name}</h1>
                <a href={integration.docsUrl} target="_blank" rel="noreferrer" className="text-ink/40 hover:text-ink" aria-label="Open docs">
                  <ExternalLink className="h-3.5 w-3.5"/>
                </a>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11.5px] text-ink/55">
                <span className="rounded bg-ink/5 px-1.5 py-0.5 font-medium uppercase tracking-[0.1em] text-[10px]">{integration.category}</span>
                <StatusChip status={integration.status}/>
                {isConnected && <span>· Last sync {timeAgo(integration.lastSync)}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {isConnected ? (
              <>
                <button
                  onClick={() => { const ok = adminActions.testIntegration(integration.id); toast[ok?"success":"error"](ok?"Test OK":"Test failed"); }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink/12 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-ink/75 hover:border-ink hover:text-ink"
                ><Play className="h-3 w-3"/>Test</button>
                <button
                  onClick={() => { adminActions.syncIntegration(integration.id); toast.success(`${integration.name} synced`); }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink/12 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-ink/75 hover:border-ink hover:text-ink"
                ><RefreshCw className="h-3 w-3"/>Sync now</button>
                <button
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ever/25 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-ever hover:bg-ever/5"
                ><Trash2 className="h-3 w-3"/>Disconnect</button>
              </>
            ) : (
              <button
                onClick={() => setShowConnect(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-marine px-3 py-1.5 text-[11.5px] font-medium text-white hover:bg-marine/90"
              >Connect {integration.name}</button>
            )}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="space-y-4">
          {/* Overview */}
          <Card className="p-4">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Overview</div>
            <div className="mt-1.5 text-[13px] leading-[1.55] text-ink/75">{integration.description}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Fact label="Status" value={<StatusChip status={integration.status}/>} />
              <Fact label="Connected" value={integration.connectedAt ? new Date(integration.connectedAt).toLocaleDateString() : "—"} />
              <Fact label="Last sync" value={timeAgo(integration.lastSync)} />
              <Fact label="Category" value={integration.category} />
            </div>
            {integration.lastError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-ever/[0.06] px-3 py-2 text-[11.5px] text-ever">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0"/>
                <div><b>Error:</b> {integration.lastError}</div>
              </div>
            )}
          </Card>

          {/* Configuration */}
          {isConnected && integration.configSchema.length > 0 && (
            <ConfigurationCard integration={integration}/>
          )}

          {/* Webhooks */}
          {isConnected && integration.webhookEvents.length > 0 && (
            <WebhooksCard integration={integration}/>
          )}

          {/* Sync activity */}
          {isConnected && (
            <SyncActivityCard integration={integration}/>
          )}

          {!isConnected && (
            <Card className="p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-marine/10 text-marine">
                <Shield className="h-5 w-5"/>
              </div>
              <div className="text-[14px] font-semibold text-ink">{integration.name} is not connected</div>
              <div className="mx-auto mt-1 max-w-md text-[12px] text-ink/55">Connect your {integration.name} account to enable {integration.category.toLowerCase()} features in Blissley.</div>
              <button
                onClick={() => setShowConnect(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-marine px-4 py-1.5 text-[12px] font-medium text-white hover:bg-marine/90"
              >Connect now</button>
            </Card>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Scopes */}
          <Card className="p-4">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Permissions</div>
            <ul className="mt-2 space-y-1.5">
              {integration.scopes.map((s) => (
                <li key={s.key} className="flex items-start gap-2 text-[12px] text-ink/75">
                  <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isConnected ? "text-check" : "text-ink/25"}`}/>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Related */}
          {related.length > 0 && (
            <Card className="p-4">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">More in {integration.category}</div>
              <div className="mt-2 space-y-1.5">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to="/admin/integrations/$id"
                    params={{ id: r.id }}
                    className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-ink/[0.03]"
                  >
                    <BrandTile color={r.brand.color} mono={r.brand.mono} size={28}/>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium text-ink">{r.name}</div>
                      <div className="truncate text-[10.5px] text-ink/50">{r.description}</div>
                    </div>
                    <StatusChip status={r.status}/>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Danger zone */}
          {isConnected && (
            <Card className="border-ever/20 p-4">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ever">Danger zone</div>
              <div className="mt-1 text-[11.5px] text-ink/55">Disconnecting will stop all syncs and clear stored credentials.</div>
              <button
                onClick={() => setConfirmDisconnect(true)}
                className="mt-3 w-full rounded-md border border-ever/30 bg-white px-3 py-1.5 text-[11.5px] font-medium text-ever hover:bg-ever/5"
              >Disconnect {integration.name}</button>
            </Card>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {confirmDisconnect && (
          <ConfirmDialog
            title={`Disconnect ${integration.name}?`}
            body={`This will stop all ${integration.category.toLowerCase()} syncs and clear stored credentials. You can reconnect later.`}
            confirmLabel="Yes, disconnect"
            onCancel={() => setConfirmDisconnect(false)}
            onConfirm={() => {
              adminActions.disconnectIntegration(integration.id);
              toast.success(`${integration.name} disconnected`);
              setConfirmDisconnect(false);
            }}
          />
        )}
        {showConnect && <ConnectDialog integration={integration} onClose={() => setShowConnect(false)} />}
      </AnimatePresence>
    </AdminShell>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink/40">{label}</div>
      <div className="mt-0.5 text-[12.5px] text-ink">{value}</div>
    </div>
  );
}

function ConfigurationCard({ integration }: { integration: Integration }) {
  const [draft, setDraft] = useState<Record<string,string|boolean>>({ ...integration.config });
  const [dirty, setDirty] = useState(false);
  const [showSecret, setShowSecret] = useState<Record<string,boolean>>({});

  useEffect(() => { setDraft({ ...integration.config }); setDirty(false); }, [integration.config]);

  function set(k: string, v: string | boolean) {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  }

  function save() {
    adminActions.updateIntegrationConfig(integration.id, draft);
    toast.success("Configuration saved");
    setDirty(false);
  }

  function displayValue(f: IntegrationConfigField, v: string | boolean | undefined) {
    if (f.type === "secret" && typeof v === "string" && v && !showSecret[f.key]) {
      return v.length > 8 ? `${v.slice(0,4)}${"•".repeat(Math.min(8, v.length - 4))}` : "••••••••";
    }
    return typeof v === "string" ? v : "";
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Configuration</div>
        {dirty && (
          <div className="flex items-center gap-2">
            <button onClick={() => { setDraft({ ...integration.config }); setDirty(false); }} className="text-[11.5px] text-ink/55 hover:text-ink">Discard</button>
            <button onClick={save} className="rounded-md bg-marine px-2.5 py-1 text-[11.5px] font-medium text-white hover:bg-marine/90">Save</button>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-3">
        {integration.configSchema.map((f) => (
          <div key={f.key} className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-3">
            <label className="text-[11.5px] font-medium text-ink/70">
              {f.label}{f.required && <span className="text-ever"> *</span>}
              {f.help && <div className="text-[10px] font-normal text-ink/45">{f.help}</div>}
            </label>
            {f.type === "toggle" ? (
              <button
                type="button"
                onClick={() => set(f.key, !draft[f.key])}
                className={`inline-flex h-5 w-9 items-center rounded-full transition ${draft[f.key] ? "bg-marine" : "bg-ink/15"}`}
              >
                <span className={`h-4 w-4 rounded-full bg-white shadow transition ${draft[f.key] ? "translate-x-4" : "translate-x-0.5"}`}/>
              </button>
            ) : f.type === "select" ? (
              <select
                value={String(draft[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[12.5px] text-ink focus:border-marine focus:outline-none"
              >
                <option value="">Select…</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={f.type === "secret" && !showSecret[f.key] ? "password" : "text"}
                    value={displayValue(f, draft[f.key])}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.key, e.target.value)}
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
                {f.type === "secret" && (
                  <button
                    onClick={() => {
                      const val = "sk_new_" + Math.random().toString(36).slice(2, 10);
                      set(f.key, val);
                      toast.info("Rotated — save to apply");
                    }}
                    className="rounded-md border border-ink/12 px-2 py-1 text-[10.5px] font-medium text-ink/60 hover:border-ink hover:text-ink"
                    title="Rotate"
                  >Rotate</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function WebhooksCard({ integration }: { integration: Integration }) {
  const webhookUrl = `https://blissley.app/api/webhooks/${integration.id}`;
  return (
    <Card className="p-4">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Webhooks</div>

      <div className="mt-3 rounded-lg border border-ink/[0.08] bg-ink/[0.02] p-3">
        <div className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink/45">Endpoint URL</div>
        <div className="mt-1 flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-white px-2 py-1 text-[11.5px] text-ink">{webhookUrl}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success("Copied"); }}
            className="rounded-md border border-ink/12 bg-white p-1.5 text-ink/60 hover:border-ink hover:text-ink"
          ><Copy className="h-3 w-3"/></button>
        </div>
        <div className="mt-2 text-[10.5px] text-ink/45">Configure this URL in your {integration.name} dashboard.</div>
      </div>

      <div className="mt-3 space-y-1.5">
        {integration.webhookEvents.map((w) => (
          <div key={w.key} className="flex items-center justify-between rounded-lg border border-ink/[0.06] px-3 py-2">
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-medium text-ink">{w.label}</div>
              <code className="text-[10.5px] text-ink/45">{w.key}</code>
            </div>
            <button
              type="button"
              onClick={() => adminActions.toggleIntegrationWebhookEvent(integration.id, w.key)}
              className={`inline-flex h-5 w-9 items-center rounded-full transition ${w.enabled ? "bg-marine" : "bg-ink/15"}`}
            >
              <span className={`h-4 w-4 rounded-full bg-white shadow transition ${w.enabled ? "translate-x-4" : "translate-x-0.5"}`}/>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SyncActivityCard({ integration }: { integration: Integration }) {
  const [limit, setLimit] = useState(6);
  const items = integration.syncHistory.slice(0, limit);
  const canLoadMore = integration.syncHistory.length > limit;

  const dot = (s: "ok"|"warn"|"error") => s === "ok" ? "bg-check" : s === "warn" ? "bg-honey" : "bg-ever";
  const icon = (s: "ok"|"warn"|"error") =>
    s === "ok" ? <CheckCircle2 className="h-3 w-3 text-check"/>
    : s === "warn" ? <AlertTriangle className="h-3 w-3 text-honey"/>
    : <XCircle className="h-3 w-3 text-ever"/>;

  return (
    <Card className="p-4">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">Sync activity</div>
      {items.length === 0 ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-ink/[0.02] px-3 py-6 text-[12px] text-ink/50">
          <Info className="h-3.5 w-3.5"/>No activity yet.
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((e, idx) => (
            <li key={idx} className="flex items-start gap-3 rounded-lg border border-ink/[0.06] px-3 py-2">
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${dot(e.status)}`}/>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12.5px] text-ink">
                  {icon(e.status)}<span className="truncate">{e.event}</span>
                </div>
                {e.detail && <div className="mt-0.5 text-[10.5px] text-ink/55">{e.detail}</div>}
              </div>
              <div className="shrink-0 text-[10.5px] text-ink/45">{timeAgo(e.ts)}</div>
            </li>
          ))}
        </ul>
      )}
      {canLoadMore && (
        <button
          onClick={() => setLimit((n) => n + 10)}
          className="mt-3 w-full rounded-lg border border-ink/12 bg-white py-1.5 text-[11.5px] font-medium text-ink/70 hover:border-ink hover:text-ink"
        >Load more</button>
      )}
    </Card>
  );
}

function ConfirmDialog({ title, body, confirmLabel, onCancel, onConfirm }: {
  title: string; body: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
        className="w-[92vw] max-w-[400px] overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-ever/10 text-ever"><AlertTriangle className="h-4 w-4"/></div>
            <div className="text-[14px] font-semibold text-ink">{title}</div>
          </div>
          <div className="mt-2 text-[12.5px] leading-relaxed text-ink/60">{body}</div>
        </div>
        <div className="mt-4 flex justify-end gap-2 bg-ink/[0.02] px-5 py-3">
          <button onClick={onCancel} className="rounded-md px-3 py-1.5 text-[12px] font-medium text-ink/70 hover:text-ink">Cancel</button>
          <button onClick={onConfirm} className="rounded-md bg-ever px-3 py-1.5 text-[12px] font-medium text-white hover:bg-ever/90">{confirmLabel}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
