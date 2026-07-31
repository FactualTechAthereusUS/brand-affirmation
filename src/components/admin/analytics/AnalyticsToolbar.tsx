import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, Expand, Eye, EyeOff, Maximize2, Minimize2, RefreshCw, SlidersHorizontal, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompareKey, RangeKey } from "@/lib/admin/analytics";

export type AnalyticsCardKey = "conversion" | "funnel" | "opportunities" | "presell" | "sales" | "intake" | "checkout" | "rates";
const CARD_LABELS: Record<AnalyticsCardKey, string> = { conversion: "Overall conversion", funnel: "Funnel flow", opportunities: "Opportunities", presell: "Presell pages", sales: "Sales page", intake: "Intake form", checkout: "Checkout", rates: "All step rates" };
const RANGE_LABEL: Record<RangeKey, string> = { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", ytd: "Year to date", custom: "Custom range" };
const COMPARE_LABEL: Record<CompareKey, string> = { prior: "Previous period", yoy: "Previous year", none: "No comparison" };

export function AnalyticsToolbar({ range, compare, hidden, target, refreshedAt, onRange, onCompare, onHidden, onTarget, onRefresh }: {
  range: RangeKey; compare: CompareKey; hidden: AnalyticsCardKey[]; target: number; refreshedAt: Date | null;
  onRange: (value: RangeKey) => void; onCompare: (value: CompareKey) => void; onHidden: (value: AnalyticsCardKey[]) => void;
  onTarget: (value: number) => void; onRefresh: () => void;
}) {
  const [open, setOpen] = useState<"date" | "compare" | "customize" | "target" | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => { if (!autoRefresh) return; const timer = window.setInterval(onRefresh, 30_000); return () => window.clearInterval(timer); }, [autoRefresh, onRefresh]);
  useEffect(() => { const onChange = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener("fullscreenchange", onChange); return () => document.removeEventListener("fullscreenchange", onChange); }, []);
  const toggleFullscreen = async () => { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); };
  const toggleCard = (key: AnalyticsCardKey) => onHidden(hidden.includes(key) ? hidden.filter((item) => item !== key) : [...hidden, key]);

  return (
    <div className="relative z-20 mb-4 rounded-lg border border-ink/[0.08] bg-white px-2 py-2 shadow-sm">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Button variant={autoRefresh ? "secondary" : "ghost"} size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={() => setAutoRefresh((value) => !value)} aria-pressed={autoRefresh} title={autoRefresh ? "Turn off auto-refresh" : "Turn on auto-refresh"}>
          <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? "animate-spin [animation-duration:3s]" : ""}`} /><span className="hidden sm:inline">Auto-refresh</span>{autoRefresh && <span className="h-1.5 w-1.5 rounded-full bg-check" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={toggleFullscreen} title={fullscreen ? "Exit full screen" : "Expand to full screen"}>{fullscreen ? <Minimize2 /> : <Maximize2 />}</Button>
        <div className="mx-0.5 h-4 w-px shrink-0 bg-ink/10" />
        <ToolbarMenuButton icon={CalendarDays} label={RANGE_LABEL[range]} active={open === "date"} onClick={() => setOpen(open === "date" ? null : "date")} />
        <ToolbarMenuButton icon={Expand} label={COMPARE_LABEL[compare]} active={open === "compare"} onClick={() => setOpen(open === "compare" ? null : "compare")} />
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {refreshedAt && <span className="hidden text-[10px] text-ink/40 xl:inline">Updated {refreshedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>}
          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={() => setOpen(open === "target" ? null : "target")}><Target /><span className="hidden sm:inline">Targets</span></Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={() => setOpen(open === "customize" ? null : "customize")}><SlidersHorizontal />Customize</Button>
        </div>
      </div>
      {open && <div className="absolute right-0 top-[calc(100%+6px)] w-[min(360px,calc(100vw-32px))] rounded-lg border border-ink/10 bg-white p-2 shadow-xl">
        <div className="mb-1 flex items-center justify-between px-2 py-1"><div className="text-[11px] font-semibold text-ink">{open === "date" ? "Date range" : open === "compare" ? "Compare to" : open === "target" ? "Conversion target" : "Customize dashboard"}</div><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(null)} aria-label="Close menu"><X /></Button></div>
        {open === "date" && <MenuOptions values={["7d", "30d", "90d", "ytd"] as RangeKey[]} selected={range} labels={RANGE_LABEL} onSelect={(value) => { onRange(value); setOpen(null); }} />}
        {open === "compare" && <MenuOptions values={["prior", "yoy", "none"] as CompareKey[]} selected={compare} labels={COMPARE_LABEL} onSelect={(value) => { onCompare(value); setOpen(null); }} />}
        {open === "customize" && <div className="space-y-0.5">{(Object.keys(CARD_LABELS) as AnalyticsCardKey[]).map((key) => { const visible = !hidden.includes(key); return <Button key={key} variant="ghost" className="h-8 w-full justify-start px-2 text-[11.5px]" onClick={() => toggleCard(key)}>{visible ? <Eye className="text-marine" /> : <EyeOff className="text-ink/35" />}<span className={visible ? "text-ink" : "text-ink/45"}>{CARD_LABELS[key]}</span><span className="ml-auto text-[10px] text-ink/40">{visible ? "Shown" : "Hidden"}</span></Button>; })}{hidden.length > 0 && <Button variant="outline" size="sm" className="mt-2 h-7 w-full text-[11px]" onClick={() => onHidden([])}>Show all</Button>}</div>}
        {open === "target" && <div className="px-2 pb-2"><div className="mb-3 flex items-baseline justify-between"><span className="text-[11px] text-ink/55">Overall session-to-purchase rate</span><span className="font-hero text-[18px] font-semibold tabular-nums text-ink">{target.toFixed(1)}%</span></div><input className="w-full accent-marine" type="range" min="1" max="12" step="0.5" value={target} onChange={(event) => onTarget(Number(event.target.value))} aria-label="Overall conversion target" /><div className="mt-1 flex justify-between text-[9.5px] text-ink/40"><span>1%</span><span>12%</span></div><div className="mt-3 grid grid-cols-3 gap-1.5">{[3, 5, 8].map((value) => <Button key={value} variant="outline" size="sm" className="h-7 text-[10.5px]" onClick={() => onTarget(value)}>{value}% target</Button>)}</div></div>}
      </div>}
    </div>
  );
}

function ToolbarMenuButton({ icon: Icon, label, active, onClick }: { icon: typeof CalendarDays; label: string; active: boolean; onClick: () => void }) { return <Button variant={active ? "secondary" : "ghost"} size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={onClick} aria-expanded={active}><Icon />{label}<ChevronDown className="text-ink/40" /></Button>; }
function MenuOptions<T extends string>({ values, selected, labels, onSelect }: { values: T[]; selected: T; labels: Record<T, string>; onSelect: (value: T) => void }) { return <div className="space-y-0.5">{values.map((value) => <Button key={value} variant="ghost" className={`h-8 w-full justify-start px-2 text-[11.5px] ${selected === value ? "bg-marine/[0.07] text-marine" : ""}`} onClick={() => onSelect(value)}>{labels[value]}</Button>)}</div>; }