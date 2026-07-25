import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";
import { AlertTriangle, Mail } from "lucide-react";

export const Route = createFileRoute("/pharmabro-admin/settings/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy · Settings" }, { name: "robots", content: "noindex" }] }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const { products } = useActiveData();
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <div>
            <b>Read-only.</b> PharmaBro manages pharmacy relationships. Need a different pharmacy? <a href="mailto:support@pharmabro.io" className="underline">Contact your account manager</a>.
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <div className="mb-3 text-[13.5px] font-bold text-ink">Current routing</div>
        <div className="space-y-2">
          {products.filter((p) => p.status !== "archived").map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink/8 p-3 text-[12.5px]">
              <div className="font-semibold text-ink">{p.displayName}</div>
              <div className="text-ink/60">→ <b className="text-ink">{p.primaryPharmacy}</b>{p.backupPharmacy ? ` (backup: ${p.backupPharmacy})` : ""}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
