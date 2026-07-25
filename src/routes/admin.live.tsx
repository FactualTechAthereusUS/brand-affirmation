import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Eye, EyeOff, Globe2, Keyboard, Map as MapIcon, Maximize2, Minimize2 } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/AdminShell";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { LiveSidebar } from "@/components/live/LiveSidebar";
import { ShortcutsSheet } from "@/components/live/ShortcutsSheet";
import { useLiveSessions } from "@/hooks/useLiveSessions";
import { useAdmin } from "@/lib/admin/store";

const LiveGlobe = lazy(() => import("@/components/live/LiveGlobe3D"));
const LiveMap = lazy(() => import("@/components/live/LiveMap"));

// Bus for cross-component keyboard-driven actions (zoom/pan) — the globe/map
// each subscribe and translate into their own coordinate system.
type LiveCommand =
  | { type: "zoom"; delta: number }
  | { type: "pan"; dx: number; dy: number };
const LIVE_BUS = "blissley:live:cmd";
function emit(cmd: LiveCommand) {
  window.dispatchEvent(new CustomEvent<LiveCommand>(LIVE_BUS, { detail: cmd }));
}

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
  const { sessions, purchaseEvents, counts, byLocation, focus, focusOn, telehealth, lastTickAt } = useLiveSessions();

  const [view, setView] = useState<"globe" | "map">(() => {
    if (typeof window === "undefined") return "globe";
    return (localStorage.getItem("blissley.live.view") as "globe" | "map") || "globe";
  });
  const [streamer, setStreamer] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("blissley.live.streamer") === "1";
  });
  const [fs, setFs] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
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

  // Keyboard shortcuts (skip when typing in an input/textarea/contenteditable)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "?" || (e.shiftKey && k === "/")) { e.preventDefault(); setShortcuts((v) => !v); return; }
      if (k === "Escape") { setShortcuts(false); return; }
      if (k === "g" || k === "G") { setView("globe"); return; }
      if (k === "m" || k === "M") { setView("map"); return; }
      if (k === "s" || k === "S") { setStreamer((v) => !v); return; }
      if (k === "f" || k === "F") { void toggleFullscreen(); return; }
      if (k === "+" || k === "=") { emit({ type: "zoom", delta: -1 }); return; }
      if (k === "-" || k === "_") { emit({ type: "zoom", delta: +1 }); return; }
      if (k === "ArrowLeft")  { emit({ type: "pan", dx: -160, dy: 0 }); return; }
      if (k === "ArrowRight") { emit({ type: "pan", dx:  160, dy: 0 }); return; }
      if (k === "ArrowUp")    { emit({ type: "pan", dx: 0, dy: -120 }); return; }
      if (k === "ArrowDown")  { emit({ type: "pan", dx: 0, dy:  120 }); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  // Revenue by program — telehealth catalogue
  const orderRows = useMemo(() => {
    const groups: Record<string, { label: string; value: number; color: string }> = {
      "Weight Loss · Semaglutide":  { label: "Weight Loss · Semaglutide",  value: 18420, color: "#2563eb" },
      "Weight Loss · Tirzepatide":  { label: "Weight Loss · Tirzepatide",  value: 12190, color: "#7c3aed" },
      "Hair · Finasteride":         { label: "Hair · Finasteride",         value: 4210,  color: "#10b981" },
      "Skin · Tretinoin":           { label: "Skin · Tretinoin",           value: 3840,  color: "#0ea5e9" },
      "Sleep · Doxepin":            { label: "Sleep · Doxepin",            value: 2120,  color: "#f59e0b" },
      "Sexual health · Sildenafil": { label: "Sexual health · Sildenafil", value: 1980,  color: "#ee7273" },
    };
    for (const o of orders.slice(0, 40)) {
      const price = o.amount ?? 0;
      const p = o.program ?? "";
      if (p.startsWith("tirz")) groups["Weight Loss · Tirzepatide"].value += price;
      else if (p.startsWith("sema")) groups["Weight Loss · Semaglutide"].value += price;
    }
    return Object.values(groups).sort((a, b) => b.value - a.value);
  }, [orders]);

  const newReturning = { newPct: 62, returningPct: 38 };

  return (
    <AdminShell>
      <div
        ref={wrapRef}
        className={`${fs ? "fixed inset-0 z-50 bg-[#f6f6f7] p-3" : "-mx-4 -mt-4 min-h-[calc(100vh-56px)] bg-[#f6f6f7] px-4 pt-4 lg:-mx-6 lg:px-6"} relative`}
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
              onClick={() => setShortcuts(true)}
              className="hidden h-8 items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2.5 text-[11.5px] font-medium text-ink/70 hover:bg-ink/[0.03] sm:flex"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Shortcuts
            </button>
            <button
              type="button"
              onClick={() => setStreamer((v) => !v)}
              className="flex h-8 items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2.5 text-[11.5px] font-medium text-ink/70 hover:bg-ink/[0.03]"
              title={streamer ? "Show numbers (S)" : "Streamer mode (S) — mask names & cities"}
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
                title="Globe view (G)"
              >
                <Globe2 className="h-3.5 w-3.5" />
              </button>
              <div className="w-px bg-ink/10" />
              <button
                type="button"
                onClick={() => setView("map")}
                aria-pressed={view === "map"}
                className={`grid h-8 w-8 place-items-center text-ink/60 ${view === "map" ? "bg-ink/[0.05] text-ink" : "hover:bg-ink/[0.03]"}`}
                title="Map view (M)"
              >
                <MapIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="grid h-8 w-8 place-items-center rounded-md border border-ink/10 bg-white text-ink/60 hover:bg-ink/[0.03]"
              title={fs ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            >
              {fs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Main split — sidebar scrolls; map/globe is full-bleed */}
        <div
          className="relative"
          style={{ height: fs ? "calc(100vh - 72px)" : "calc(100vh - 88px)" }}
        >
          <div className={`absolute inset-0 ${fs ? "" : "-mx-4 lg:-mx-6"} overflow-hidden ${view === "map" ? "bg-transparent" : "bg-white"}`}>
            <ClientOnly fallback={<GlobeFallback />}>
              <Suspense fallback={<GlobeFallback />}>
                {view === "globe" ? (
                  <LiveGlobe sessions={sessions} purchaseEvents={purchaseEvents} focus={focus} streamer={streamer} className="h-full w-full" />
                ) : (
                  <LiveMap sessions={sessions} purchaseEvents={purchaseEvents} streamer={streamer} className="h-full w-full" />
                )}
              </Suspense>
            </ClientOnly>
          </div>

          <div className="relative z-10 flex h-full w-full lg:w-[380px]">
            <div className="min-w-0 h-full w-full overflow-y-auto pr-1 [scrollbar-width:thin]">
              <div className={view === "map" ? "" : "rounded-xl border border-ink/[0.06] bg-white/95 p-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] backdrop-blur"}>
                <LiveSidebar
                  counts={counts}
                  byLocation={byLocation}
                  streamer={streamer}
                  onFocus={focusOn}
                  orderRows={orderRows}
                  newReturning={newReturning}
                  telehealth={telehealth}
                  lastTickAt={lastTickAt}
                />
              </div>
              {!fs && (
                <div className="mt-3 space-y-3">
                  <div className={`rounded-xl border border-ink/[0.06] p-3.5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] backdrop-blur ${view === "map" ? "bg-white/60" : "bg-white/95"}`}>
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/55">Live activity</div>
                    <div className="text-[11.5px] text-ink/45">Intake, physician approvals & payment signals</div>
                    <div className="mt-2">
                      <ActivityFeed limit={6} title="" />
                    </div>
                  </div>
                  <div className={`rounded-xl border border-ink/[0.06] shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] backdrop-blur ${view === "map" ? "bg-white/60" : "bg-white/95"}`}>
                    <RecentOrders streamer={streamer} />
                  </div>
                  <div className="h-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <ShortcutsSheet open={shortcuts} onClose={() => setShortcuts(false)} />
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
