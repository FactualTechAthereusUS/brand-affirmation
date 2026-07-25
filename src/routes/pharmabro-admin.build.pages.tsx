import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, ExternalLink, Rocket, Pencil, Eye } from "lucide-react";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/build/pages")({
  head: () => ({ meta: [{ title: "Pages — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: PagesPage,
});

function PagesPage() {
  const { pages } = useActiveData();

  return (
    <div className="space-y-4">
      <PageHeader title="Pages" subtitle="Every page your patients see — sales page, checkout, portal, and more." />

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
            <tr>
              <th className="px-3 py-2">Page</th>
              <th className="px-3 py-2 hidden md:table-cell">URL</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 hidden lg:table-cell">Last published</th>
              <th className="px-3 py-2 w-56 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-ink/[0.02]">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-semibold text-ink">{p.name}</div>
                      {p.lockedNotes && (
                        <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-700">
                          <Lock className="h-3 w-3" /> {p.lockedNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  <a href={p.url} className="inline-flex items-center gap-1 rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[11.5px] text-ink/70 hover:text-ink">
                    {p.url} <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="px-3 py-2.5"><Pill tone={p.status === "live" ? "success" : "warn"}>{p.status}</Pill></td>
                <td className="px-3 py-2.5 hidden lg:table-cell text-ink/60">{new Date(p.lastPublishedMs).toLocaleDateString()}</td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-1">
                    <button className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-ink/30"><Eye className="h-3 w-3" /> Preview</button>
                    <button className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:border-ink/30"><Pencil className="h-3 w-3" /> Edit</button>
                    <button onClick={() => { pharmabroActions.publishPage(p.id); toast.success(`${p.name} published — live in 30 seconds`); }}
                      className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-ink/90"><Rocket className="h-3 w-3" /> Publish</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <div className="mb-2 text-[13.5px] font-bold text-ink">Locked elements per page</div>
        <ul className="space-y-1 text-[12.5px] text-ink/65">
          <li>→ <b>Checkout page:</b> Stripe card form is locked (PCI compliance)</li>
          <li>→ <b>Patient Portal:</b> clinical messaging thread is locked (HIPAA)</li>
          <li>→ <b>Order Confirmation:</b> order summary is locked (legal)</li>
          <li>→ <b>All pages:</b> PharmaBro attribution is hidden — whitelabel</li>
        </ul>
      </Card>
    </div>
  );
}
