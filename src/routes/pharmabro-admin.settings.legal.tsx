import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/settings/legal")({
  head: () => ({ meta: [{ title: "Legal · Settings" }, { name: "robots", content: "noindex" }] }),
  component: LegalPage,
});

const DOCS = [
  { key: "tos" as const, label: "Terms of Service" },
  { key: "privacy" as const, label: "Privacy Policy" },
  { key: "consent" as const, label: "Telehealth Consent" },
];

function LegalPage() {
  const brand = useActiveBrand();
  return (
    <Card className="p-5">
      <div className="mb-1 text-[13.5px] font-bold text-ink">Legal documents</div>
      <p className="text-[12px] text-ink/55">Use PharmaBro's templates as a starting point or upload your own.</p>
      <div className="mt-4 space-y-2">
        {DOCS.map((d) => {
          const src = brand.legal[d.key];
          return (
            <div key={d.key} className="flex items-center justify-between rounded-lg border border-ink/8 p-3 text-[12.5px]">
              <div>
                <div className="font-semibold text-ink">{d.label}</div>
                <div className="text-[11px] text-ink/55">
                  Source: <b className="text-ink/80 capitalize">{src.type}</b> · updated {new Date(src.updatedAtMs).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { pharmabroActions.setLegalDoc(d.key, { type: "template", updatedAtMs: Date.now() }); toast.success(`${d.label} — using PharmaBro template`); }}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${src.type === "template" ? "bg-ink text-white" : "border border-ink/12 bg-white text-ink/70"}`}>Template</button>
                <button onClick={() => { pharmabroActions.setLegalDoc(d.key, { type: "custom", updatedAtMs: Date.now() }); toast.success(`${d.label} — custom document uploaded`); }}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${src.type === "custom" ? "bg-ink text-white" : "border border-ink/12 bg-white text-ink/70"}`}>Upload custom</button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
