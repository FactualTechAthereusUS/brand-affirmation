import type { LiveSession } from "@/hooks/useLiveSessions";
import { DOT_RULES } from "./dotRules";

const EVENT_LABEL: Record<LiveSession["stage"], string> = {
  browsing: "Browsing",
  cart: "In intake",
  checkout: "Awaiting physician",
  purchased: "Approved · Rx signed",
};

export function LivePinTooltip({
  session,
  streamer,
  x,
  y,
}: {
  session: LiveSession;
  streamer: boolean;
  x: number;
  y: number;
}) {
  const rule = DOT_RULES[session.stage];
  const time = new Date(session.seenAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const city = streamer ? "••••••" : session.city;
  const region = streamer ? "••" : session.region;
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-[11px] font-medium text-ink shadow-[0_10px_28px_-8px_rgba(15,23,42,0.30)]"
      style={{ left: x, top: y - 12 }}
    >
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: rule.hex }} />
        <span className="text-ink">
          {session.country} · {region} · {city}
        </span>
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-normal text-ink/50">
        <span>{EVENT_LABEL[session.stage]}</span>
        <span className="text-ink/30">·</span>
        <span className="tabular-nums">{time}</span>
      </div>
    </div>
  );
}
