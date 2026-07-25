import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, Card, SectionTitle } from "@/components/admin/AdminShell";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/live")({
  head: () => ({ meta: [{ title: "Live view — Blissley Admin" }, { name: "description", content: "Real-time visitors, sessions, and activity across Blissley." }] }),
  component: LiveView,
});

function LiveView() {
  const orders = useAdmin((s) => s.orders);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const visitors = 128 + (tick % 7);
  const sessions = 342 + (tick % 12);
  const activeCarts = 14 + (tick % 3);
  const checkingOut = 4 + (tick % 2);
  const purchased = 7 + Math.floor(tick / 3);

  const cities = [
    { x: 12, y: 42, name: "Los Angeles" }, { x: 20, y: 32, name: "Denver" },
    { x: 28, y: 40, name: "Austin" }, { x: 38, y: 30, name: "Chicago" },
    { x: 52, y: 34, name: "Atlanta" }, { x: 68, y: 26, name: "New York" },
    { x: 62, y: 40, name: "Miami" }, { x: 44, y: 22, name: "Minneapolis" },
  ];

  return (
    <AdminShell>
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h1 className="font-hero text-[22px] font-semibold text-ink">Live view</h1>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-check opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-check" />
            </span>
            Just now · refreshes every 3s
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <Card className="p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Visitors right now</div>
            <div className="mt-1 font-hero text-[42px] font-semibold leading-none text-ink tabular-nums">{visitors}</div>
          </Card>
          <Card className="p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Sessions</div>
            <div className="mt-1 font-hero text-[26px] font-semibold leading-none text-ink tabular-nums">{sessions}</div>
          </Card>
          <Card className="divide-y divide-ink/[0.05]">
            <Row label="Active carts" value={activeCarts} />
            <Row label="Checking out" value={checkingOut} />
            <Row label="Purchased" value={purchased} tone="positive" />
          </Card>
        </div>

        <Card className="relative overflow-hidden p-0">
          <div className="absolute inset-0 opacity-70">
            <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="dots" width="1.2" height="1.2" patternUnits="userSpaceOnUse">
                  <circle cx="0.6" cy="0.6" r="0.18" fill="#171717" fillOpacity="0.12" />
                </pattern>
                <clipPath id="us">
                  <path d="M6 20 L20 14 L38 12 L60 10 L78 14 L92 22 L92 32 L84 40 L72 46 L58 50 L44 50 L28 48 L14 42 L8 34 Z" />
                </clipPath>
              </defs>
              <rect width="100" height="60" fill="url(#dots)" clipPath="url(#us)" />
              {cities.map((c, i) => (
                <g key={c.name}>
                  <circle cx={c.x} cy={c.y} r="0.6" fill="#ee7273" opacity="0.9">
                    <animate attributeName="r" values="0.6;2.4;0.6" dur={`${1.6 + i * 0.15}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0;0.9" dur={`${1.6 + i * 0.15}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={c.x} cy={c.y} r="0.6" fill="#ee7273" />
                </g>
              ))}
            </svg>
          </div>
          <div className="relative p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Sessions by location</div>
            <div className="mt-2 space-y-1.5">
              {cities.slice(0, 5).map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-[11.5px]">
                  <span className="w-32 text-ink/70">{c.name}</span>
                  <div className="flex-1 rounded bg-ink/[0.04]">
                    <div className="h-2 rounded bg-ever" style={{ width: `${80 - i * 12}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums text-ink/60">{40 - i * 6}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <SectionTitle subtitle="Fulfillment events, physician approvals, and payment signals">Feed</SectionTitle>
          <ActivityFeed limit={12} title="Activity" />
        </Card>
        <Card className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Recent orders</div>
          <div className="mt-2 divide-y divide-ink/[0.05]">
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="flex items-center gap-3 py-2 text-[12px]">
                <div className="font-medium text-ink">{o.patientName}</div>
                <div className="text-ink/50">{o.id}</div>
                <div className="ml-auto text-ink/70 tabular-nums">${o.amount}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

function Row({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "positive" }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <div className="text-[11.5px] text-ink/60">{label}</div>
      <div className={`font-hero text-[18px] font-semibold tabular-nums ${tone === "positive" ? "text-check" : "text-ink"}`}>{value}</div>
    </div>
  );
}
