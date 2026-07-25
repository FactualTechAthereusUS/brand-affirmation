import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, Plug } from "lucide-react";
import { Card, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand, type IntegrationKey } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/settings/integrations")({
  head: () => ({ meta: [{ title: "Integrations · Settings" }, { name: "robots", content: "noindex" }] }),
  component: IntegrationsPage,
});

const CATALOG: { key: IntegrationKey; name: string; category: string; desc: string }[] = [
  { key: "klaviyo", name: "Klaviyo", category: "Email", desc: "Sync patient events and email flows" },
  { key: "metaPixel", name: "Meta Pixel", category: "Analytics", desc: "Track conversions from Facebook & Instagram ads" },
  { key: "metaAds", name: "Meta Ads", category: "Advertising", desc: "Push conversion events to your ad account" },
  { key: "ga4", name: "Google Analytics 4", category: "Analytics", desc: "Site & funnel analytics" },
  { key: "googleAds", name: "Google Ads", category: "Advertising", desc: "Conversion tracking + CAPI" },
  { key: "tiktok", name: "TikTok Ads", category: "Advertising", desc: "TikTok Pixel + Events API" },
  { key: "mercury", name: "Mercury", category: "Banking", desc: "Payouts destination" },
];

function IntegrationsPage() {
  const brand = useActiveBrand();
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-[13.5px] font-bold text-ink">Your integrations</div>
        <p className="text-[12px] text-ink/55">Connect your own analytics, email, and ad accounts. PharmaBro-managed connections (Dr Telx, South End, LifeFile) are handled behind the scenes.</p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATALOG.map((c) => {
          const state = brand.integrations[c.key];
          return (
            <Card key={c.key} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-ink/50" />
                    <div className="text-[13.5px] font-bold text-ink">{c.name}</div>
                  </div>
                  <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.1em] text-ink/45">{c.category}</div>
                </div>
                {state.connected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </div>
              <p className="mt-2 text-[12px] text-ink/60">{c.desc}</p>
              {state.connected ? (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10.5px] text-ink/50">{state.account}</span>
                  <button onClick={() => { pharmabroActions.disconnectIntegration(c.key); toast(`${c.name} disconnected`); }}
                    className="rounded-full border border-ink/12 bg-white px-3 py-1 text-[11px] font-semibold text-rose-600">Disconnect</button>
                </div>
              ) : (
                <BrandButton className="mt-3 w-full justify-center" onClick={() => { pharmabroActions.connectIntegration(c.key); toast.success(`${c.name} connected`); }}>Connect</BrandButton>
              )}
            </Card>
          );
        })}
      </div>
      <Card className="p-4">
        <div className="text-[13.5px] font-bold text-ink">Managed by PharmaBro</div>
        <p className="text-[12px] text-ink/55">These integrations are pre-connected across all brands — you don't manage them.</p>
        <ul className="mt-2 space-y-1 text-[12.5px] text-ink/70">
          <li>→ <b>South End Pharmacy</b> · fulfillment</li>
          <li>→ <b>LifeFile</b> · e-prescribing</li>
          <li>→ <b>Dr Telx</b> · physician network</li>
        </ul>
      </Card>
    </div>
  );
}
