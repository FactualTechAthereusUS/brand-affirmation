import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/pharmabro/BrandShell";

export const Route = createFileRoute("/pharmabro-admin/settings/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Settings" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <Card className="p-6">
      <div className="text-[14px] font-bold text-ink">Notifications</div>
      <p className="mt-1 text-[12.5px] text-ink/60">Alert triggers, digest schedule, per-event email/SMS toggles.</p>
    </Card>
  ),
});
