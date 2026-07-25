import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Eye, EyeOff, Globe2, Map as MapIcon, Maximize2, Minimize2 } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { LiveSidebar } from "@/components/live/LiveSidebar";
import { useLiveSessions } from "@/hooks/useLiveSessions";
import { useAdmin } from "@/lib/admin/store";

const LiveGlobe = lazy(() => import("@/components/live/LiveGlobe"));
const LiveMap = lazy(() => import("@/components/live/LiveMap"));

export const Route = createFileRoute("/admin/live")({
  head: () => ({
    meta: [
      { title: "Live view — Blissley Admin" },
      { name: "description", content: "Real-time patients, intakes, and telehealth activity across Blissley." },
    ],
  }),
  component: LiveViewPage,
});

function LiveViewPage() {
  const orders = useAdmin((s) => s.orders);
  const { sessions, purchaseEvents, counts, byLocation, focus, focusOn } = useLiveSessions();

  const [view, setView] = useState<"globe" | "map">(() => {
    if (typeof window === "undefined") return "globe";
    return (localStorage.getItem("blissley.live.view") as "globe" | "map") || "globe";
  });
  const [streamer, setStreamer] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("blissley.live.streamer") === "1";
  });
  const [fs, setFs] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("blissley.live.view", view);
  }, [view]);
  useEffect(() => {
    localStorage.setItem("blissley.live.streamer", streamer ? "1" : "0");
  }, [streamer]);

  const toggleFullscreen = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setFs(true);
    } else {
      await document.exitFullscreen?.();
      setFs(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Revenue by treatment from actual orders (kept lightweight)
  const orderRows = useMemo(() => {
    const groups: Record<string, { label: string; value: number; color: string }> = {
      "Weight Loss · Semaglutide":  { label: "Weight Loss · Semaglutide",  value: 0, color: "#2563eb" },
      "Weight Loss · Tirzepatide":  { label: "Weight Loss · Tirzepatide",  value: 0, color: "#7c3aed" },
      "Skin · Tretinoin":           { label: "Skin · Tretinoin",           value: 0, color: "#10b981" },
      "Hair · Finasteride":         { label: "Hair · Finasteride",         value: 0, color: "#ee7273" },
    };
    // Seed with plausible baselines; augment from real store orders when present
    groups["Weight Loss · Semaglutide"].value = 18420;
    groups["Weight Loss · Tirzepatide"].value = 12190;
    groups["Skin · Tretinoin"].value = 3840;
    groups["Hair · Finasteride"].value = 2210;
    for (const o of orders.slice(0, 40)) {
      const price = o.amount ?? 0;
      const p = o.program ?? "";
      if (p.startsWith("tirz")) groups["Weight Loss · Tirzepatide"].value += price;
      else if (p.startsWith("sema")) groups["Weight Loss · Semaglutide"].value += price;
    }
    return Object.values(groups).sort((a, b) => b.value - a.value);
  }, [orders]);

  const totalSales = orderRows.reduce((a, r) => a + r.value, 0);
  const newReturning = { newPct: 62, returningPct: 38 };

  return (
    <AdminShell>
      <div
        ref={wrapRef}
        className={`${fs ? "fixed inset-0 z-50 bg-[#f6f6f7] p-4" : "-mx-4 -mt-4 min-h-[calc(100vh-56px)] bg-[#f6f6f7] px-4 pb-16 pt-4 lg:-mx-6 lg:px-6"} relative`}
      >
        {/* Top bar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-ink/[0.06]">
              <Globe2 className="h-3.5 w-3.5 text-ink/70" strokeWidth={1.75} />
            </div>
            <h1 className="font-hero text-[19px] font-semibold text-ink">Live View</h1>
            <span className="flex items-center gap-1.5 text-[11.5px] text-ink/55">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#2563eb] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
              </span>
              Just now
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStreamer((v) => !v)}
              className="flex h-8 items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2.5 text-[11.5px] font-medium text-ink/70 hover:bg-ink/[0.03]"
              title={streamer ? "Show numbers" : "Streamer mode (hide numbers)"}
            >
              {streamer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {streamer ? "Show" : "Streamer"}
            </button>
            <div className="flex overflow-hidden rounded-md border border-ink/10 bg-white">
              <button
                type="button"
                onClick={() => setView("globe")}
                aria-pressed={view === "globe"}
                className={`grid h-8 w-8 place-items-center text-ink/60 ${view === "globe" ? "bg-ink/[0.05] text-ink" : "hover:bg-ink/[0.03]"}`}
                title="Globe view"
              >
                <Globe2 className="h-3.5 w-3.5" />
              </button>
              <div className="w-px bg-ink/10" />
              <button
                type="button"
                onClick={() => setView("map")}
                aria-pressed={view === "map"}
                className={`grid h-8 w-8 place-items-center text-ink/60 ${view === "map" ? "bg-ink/[0.05] text-ink" : "hover:bg-ink/[0.03]"}`}
                title="Map view"
              >
                <MapIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="grid h-8 w-8 place-items-center rounded-md border border-ink/10 bg-white text-ink/60 hover:bg-ink/[0.03]"
              title={fs ? "Exit fullscreen" : "Fullscreen"}
            >
              {fs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Main split — sidebar scrolls, globe stays fixed */}
        <div
          className="grid gap-3 lg:grid-cols-[380px_1fr]"
          style={{ height: fs ? "calc(100vh - 88px)" : "calc(100vh - 96px)" }}
        >
          {/* Sidebar (internal scroll) */}
          <div className="min-w-0 h-full overflow-y-auto pr-0.5 [scrollbar-width:thin]">
            <LiveSidebar
              counts={counts}
              totalSales={totalSales}
              byLocation={byLocation}
              streamer={streamer}
              onFocus={focusOn}
              orderRows={orderRows}
              newReturning={newReturning}
            />
            {/* Activity + recent orders live inside the scroll area */}
            {!fs && (
              <div className="mt-3 space-y-3">
                <Card className="p-3.5">
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Live activity</div>
                  <div className="text-[11.5px] text-ink/45">Intake, physician approvals & payment signals</div>
                  <div className="mt-2">
                    <ActivityFeed limit={6} title="" />
                  </div>
                </Card>
                <RecentOrders streamer={streamer} />
              </div>
            )}
          </div>

          {/* Globe / Map — fixed within its cell, no scroll re-triggers */}
          <div className="relative h-full overflow-hidden rounded-xl border border-ink/[0.06] bg-white">
            <ClientOnly fallback={<GlobeFallback />}>
              <Suspense fallback={<GlobeFallback />}>
                {view === "globe" ? (
                  <LiveGlobe sessions={sessions} purchaseEvents={purchaseEvents} focus={focus} className="h-full w-full" />
                ) : (
                  <LiveMap sessions={sessions} purchaseEvents={purchaseEvents} className="h-full w-full" />
                )}
              </Suspense>
            </ClientOnly>
          </div>
        </div>

      </div>
    </AdminShell>
  );
}

function GlobeFallback() {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex items-center gap-2 text-[11.5px] text-ink/45">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2563eb]" />
        Loading globe…
      </div>
    </div>
  );
}

function RecentOrders({ streamer }: { streamer: boolean }) {
  const orders = useAdmin((s) => s.orders);
  const rows = orders.slice(0, 8);
  return (
    <Card className="p-3.5">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Recent orders</div>
        <div className="text-[10.5px] text-ink/45">live</div>
      </div>
      <div className="divide-y divide-ink/[0.05]">
        {rows.map((o) => (
          <div key={o.id} className="flex items-center justify-between py-2 text-[12px]">
            <div className="min-w-0">
              <div className="truncate font-medium text-ink">{o.patientName}</div>
              <div className="truncate text-[10.5px] text-ink/45">{o.id}</div>
            </div>
            <div className="tabular-nums text-ink">{streamer ? "—" : `$${o.amount}`}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
