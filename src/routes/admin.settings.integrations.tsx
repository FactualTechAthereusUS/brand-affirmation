import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader, SettingsCard } from "@/components/admin/settings/primitives";
import { StatusPill } from "@/components/admin/AdminShell";
import { useAdmin, type Integration } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/settings/integrations")({
  head: () => ({ meta: [{ title: "Integrations · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: IntegrationsSettings,
});

const CRITICAL_NAMES = ["Stripe", "LifeFile EHR", "Dr Telx", "Klaviyo", "Mercury"];
const ANALYTICS_NAMES = ["Meta Ads", "Meta Pixel / CAPI", "Google Analytics 4"];

function statusTone(status: string): "success" | "warn" | "critical" | "neutral" {
  if (status === "connected") return "success";
  if (status === "degraded") return "warn";
  if (status === "down") return "critical";
  return "neutral";
}

function IntegrationsSettings() {
  const integrations = useAdmin((s) => s.integrations);
  const counts = useMemo(() => ({
    connected:    integrations.filter((i) => i.status === "connected").length,
    degraded:     integrations.filter((i) => i.status === "degraded").length,
    down:         integrations.filter((i) => i.status === "down").length,
    disconnected: integrations.filter((i) => i.status === "disconnected").length,
  }), [integrations]);

  const critical  = integrations.filter((i) => CRITICAL_NAMES.some((n) => i.name.includes(n) || n.includes(i.name)));
  const analytics = integrations.filter((i) => ANALYTICS_NAMES.some((n) => i.name.includes(n) || n.includes(i.name)));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Integrations"
        description="Health summary. Manage all integrations from the marketplace."
        action={
          <Link to="/admin/integrations" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-ink/90">
            Open marketplace <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <SettingsCard label="Status">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { k: "Connected",     v: counts.connected,    tone: "success" as const },
            { k: "Degraded",      v: counts.degraded,     tone: "warn" as const },
            { k: "Down",          v: counts.down,         tone: "critical" as const },
            { k: "Not connected", v: counts.disconnected, tone: "neutral" as const },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-ink/8 bg-[#faf9f6] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{s.k}</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="font-hero text-xl font-bold text-ink">{s.v}</div>
                <StatusPill tone={s.tone}>{s.tone === "critical" ? "attention" : s.tone === "warn" ? "check" : s.tone === "success" ? "healthy" : "action"}</StatusPill>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard label="Critical infrastructure" description="Business cannot operate without these.">
        <IntegrationList list={critical} />
      </SettingsCard>

      <SettingsCard label="Analytics">
        <IntegrationList list={analytics} />
      </SettingsCard>
    </div>
  );
}

function IntegrationList({ list }: { list: Integration[] }) {
  if (!list.length) return <div className="text-[12.5px] text-ink/50">No matches in catalog.</div>;
  return (
    <div className="divide-y divide-ink/6">
      {list.map((i) => (
        <div key={i.id} className="flex items-center gap-3 py-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg" style={{ background: i.logoUrl ? "transparent" : i.brand.color }}>
            {i.logoUrl
              ? <img src={i.logoUrl} alt="" className="h-10 w-10 object-contain" />
              : <span className="text-[13px] font-bold text-white">{i.brand.mono}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold text-ink">{i.name}</div>
            <div className="truncate text-[11.5px] text-ink/55">{i.description}</div>
          </div>
          <StatusPill tone={statusTone(i.status)}>{i.status}</StatusPill>
          <div className="hidden sm:block text-right text-[11px] text-ink/45 min-w-[110px]">
            {i.lastSync ? `Sync · ${relative(i.lastSync)}` : "—"}
          </div>
          <Link to="/admin/integrations/$id" params={{ id: i.id }} className="rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ink/70 hover:border-ink/30 hover:text-ink">
            Manage
          </Link>
        </div>
      ))}
    </div>
  );
}

function relative(ts: number) {
  const d = Date.now() - ts;
  if (d < 60_000) return "just now";
  if (d < 3600_000) return `${Math.round(d / 60_000)}m ago`;
  if (d < 86400_000) return `${Math.round(d / 3600_000)}h ago`;
  return `${Math.round(d / 86400_000)}d ago`;
}
