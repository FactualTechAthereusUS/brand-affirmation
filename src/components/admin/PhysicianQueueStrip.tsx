import { Link } from "@tanstack/react-router";
import { Flame, Stethoscope, Users, RefreshCcw, MessageSquare } from "lucide-react";
import { useAdmin } from "@/lib/admin/store";
import { queueCounts } from "@/lib/admin/selectors";
import { Card } from "./AdminShell";

const items = [
  { key: "physician",      label: "Physician queue",   icon: Stethoscope,   to: "/admin/physician-queue",             sla: "24h SLA" },
  { key: "flagged",        label: "Flagged cases",     icon: Flame,         to: "/admin/physician-queue?tab=flagged", sla: "Priority" },
  { key: "awaitingReply",  label: "Awaiting reply",    icon: MessageSquare, to: "/admin/physician-queue?tab=reply",   sla: "" },
  { key: "refills",        label: "Refills",           icon: RefreshCcw,    to: "/admin/physician-queue?tab=refills", sla: "" },
  { key: "support",        label: "Support inbox",     icon: Users,         to: "/admin/messages",                    sla: "" },
  { key: "checkinsOverdue",label: "Check-ins overdue", icon: Users,         to: "/admin/check-ins?tab=overdue",       sla: "Held" },
] as const;

export function PhysicianQueueStrip() {
  const counts = useAdmin(queueCounts);
  return (
    <Card className="p-2">
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-6">
        {items.map((it) => {
          const n = counts[it.key];
          const Icon = it.icon;
          const emphasis = it.key === "flagged" && n > 0;
          return (
            <Link key={it.key} to={it.to as never} className="group rounded-lg p-3 hover:bg-ink/[0.03]">
              <div className="flex items-center justify-between">
                <Icon className={`h-3.5 w-3.5 ${emphasis ? "text-ever" : "text-ink/50"}`} strokeWidth={1.75} />
                {it.sla && <span className={`text-[10px] ${emphasis ? "text-ever" : "text-ink/40"}`}>{it.sla}</span>}
              </div>
              <div className="mt-1.5 font-hero text-[22px] font-semibold leading-none text-ink tabular-nums">{n}</div>
              <div className="mt-1 text-[11px] text-ink/55">{it.label}</div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
