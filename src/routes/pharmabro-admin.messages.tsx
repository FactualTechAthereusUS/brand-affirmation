import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, PageHeader, Pill, BrandButton } from "@/components/pharmabro/BrandShell";
import { useActiveData } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Brand Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { conversations, patients } = useActiveData();
    const name = (id: string) => patients.find((p) => p.id === id)?.name ?? id;
    return (
      <div className="space-y-4">
        <PageHeader title="Messages" subtitle={`${conversations.reduce((s, c) => s + c.unread, 0)} unread`} />
        <Card className="overflow-hidden">
          <div className="divide-y divide-ink/6">
            {conversations.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-ink/[0.02]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/8 text-[11px] font-bold">{name(c.patientId).slice(0, 1)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{name(c.patientId)}</span>
                    {c.unread > 0 && <Pill tone="brand">{c.unread} new</Pill>}
                  </div>
                  <div className="truncate text-[12px] text-ink/60">{c.lastMessage}</div>
                </div>
                <div className="text-[11px] text-ink/45">{Math.round((Date.now() - c.updatedMs) / 60000)}m</div>
                <BrandButton onClick={() => toast.success("Message sent")}>Reply</BrandButton>
              </div>
            ))}
            {conversations.length === 0 && <div className="p-8 text-center text-[13px] text-ink/50">No conversations.</div>}
          </div>
        </Card>
      </div>
    );
  },
});
