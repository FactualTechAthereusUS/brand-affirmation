import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { adminActions, useAdmin } from "@/lib/admin/store";

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const notifs = useAdmin((s) => s.notifications);
  const nav = useNavigate();
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ever px-1 text-[9px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-11 z-40 w-[360px] overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Notifications</div>
                <button
                  onClick={() => adminActions.markAllNotificationsRead()}
                  className="text-[10.5px] font-medium text-ink/50 hover:text-ink"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {notifs.length === 0 && <div className="p-6 text-center text-[12px] text-ink/45">All clear.</div>}
                {notifs.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { adminActions.markNotificationRead(n.id); nav({ to: n.deepLink }); setOpen(false); }}
                    className={`flex w-full items-start gap-3 border-b border-ink/[0.04] px-4 py-3 text-left last:border-0 hover:bg-ink/[0.02] ${n.unread ? "bg-ink/[0.015]" : ""}`}
                  >
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${n.tone === "critical" ? "bg-ever" : n.tone === "warn" ? "bg-honey" : n.tone === "success" ? "bg-check" : "bg-ink/40"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-[12.5px] font-semibold text-ink">{n.title}</div>
                        <div className="shrink-0 text-[10.5px] text-ink/40">{timeAgo(n.ts)}</div>
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-ink/55">{n.detail}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
