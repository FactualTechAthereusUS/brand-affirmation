import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/pharmabro/BrandShell";

export const Route = createFileRoute("/pharmabro-admin/settings/team")({
  head: () => ({ meta: [{ title: "Team · Settings" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <Card className="p-6">
      <div className="text-[14px] font-bold text-ink">Team management</div>
      <p className="mt-1 text-[12.5px] text-ink/60">Invite support staff, manage roles, enforce 2FA. Same as Blissley team settings — scoped to your brand.</p>
      <div className="mt-4 text-[11.5px] text-ink/50">You (Owner) are the only member. Invite your first teammate to get started.</div>
    </Card>
  ),
});
