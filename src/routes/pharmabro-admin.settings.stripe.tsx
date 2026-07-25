import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/settings/stripe")({
  head: () => ({ meta: [{ title: "Stripe · Settings" }, { name: "robots", content: "noindex" }] }),
  component: StripePage,
});

function StripePage() {
  const brand = useActiveBrand();
  if (!brand.stripe.connected) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF] text-[24px] font-bold">S</div>
        <div className="text-[18px] font-bold text-ink">Connect Stripe</div>
        <p className="mx-auto mt-1 max-w-sm text-[13px] text-ink/60">Payouts route to your bank. We handle Healthcare + LegitScript. You never touch a compliance form.</p>
        <BrandButton className="mt-4" onClick={() => { pharmabroActions.connectStripe(); toast.success("Stripe connected · Healthcare + LegitScript approved"); }}>Connect Stripe</BrandButton>
      </Card>
    );
  }
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[14px] font-bold text-ink">Stripe account · <span className="font-mono text-[12px] text-ink/60">{brand.stripe.acct}</span></div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11.5px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Connected</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700"><ShieldCheck className="h-3 w-3" /> Healthcare approved</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700"><ShieldCheck className="h-3 w-3" /> LegitScript certified</span>
            <span className="inline-flex items-center rounded-full bg-ink/5 px-2 py-1 font-semibold text-ink/70">Mode: {brand.stripe.mode}</span>
          </div>
        </div>
        <button onClick={() => { if (confirm("Disconnect Stripe?")) { pharmabroActions.disconnectStripe(); toast("Stripe disconnected"); } }}
          className="rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-rose-600">Disconnect</button>
      </div>
    </Card>
  );
}
