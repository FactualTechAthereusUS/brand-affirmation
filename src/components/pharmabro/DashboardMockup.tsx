import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { DASHBOARD_NAV } from "@/lib/pharmabro/home";
import { cn } from "@/lib/utils";

/** Smooth cubic path through points (Catmull-Rom converted to bezier). */
function smoothPath(pts: Array<[number, number]>) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const SERIES = [18, 26, 22, 34, 31, 45, 41, 58, 52, 69, 74, 88];

const KPIS = [
  { label: "MRR", value: "$89,742.18", delta: "+12.4%", up: true },
  { label: "Active Patients", value: "1,284", delta: "+38", up: true },
  { label: "Rebill Success", value: "97.3%", delta: "+0.9%", up: true },
  { label: "Churn (30d)", value: "3.8%", delta: "-0.4%", up: true },
];

const ORDERS = [
  { id: "#PB-48219", tx: "Semaglutide 0.5mg", pharmacy: "Empower", status: "Shipped" },
  { id: "#PB-48218", tx: "Tirzepatide 5mg", pharmacy: "Hallandale", status: "In transit" },
  { id: "#PB-48217", tx: "Tadalafil 10mg", pharmacy: "Revive Rx", status: "Delivered" },
  { id: "#PB-48216", tx: "Testosterone Cyp", pharmacy: "Olympia", status: "Pending Rx" },
];

const STATUS_TONE: Record<string, string> = {
  Shipped: "text-[var(--color-marine)] bg-[color-mix(in_oklab,var(--color-marine)_10%,white)]",
  "In transit": "text-[var(--color-honey)] bg-[color-mix(in_oklab,var(--color-honey)_12%,white)]",
  Delivered: "text-[var(--color-check)] bg-[color-mix(in_oklab,var(--color-check)_10%,white)]",
  "Pending Rx": "text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)] bg-[var(--color-mist)]",
};

/**
 * Live React mockup of the operator dashboard. Built as real DOM rather than
 * a screenshot so it stays crisp at any density and animates on scroll.
 */
export function DashboardMockup({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const w = 520;
  const h = 150;
  const max = Math.max(...SERIES);
  const pts = SERIES.map(
    (v, i) =>
      [(i / (SERIES.length - 1)) * w, h - (v / max) * (h - 14) - 6] as [number, number],
  );
  const line = smoothPath(pts);
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-canvas shadow-[0_30px_70px_-40px_rgba(10,10,10,0.35)]",
        className,
      )}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--color-hairline)] bg-[var(--color-mist)] px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#e5e5ea]" />
          <span className="size-2.5 rounded-full bg-[#e5e5ea]" />
          <span className="size-2.5 rounded-full bg-[#e5e5ea]" />
        </span>
        <div className="pb-mono ml-2 flex-1 truncate rounded-md border border-[var(--color-hairline)] bg-canvas px-2.5 py-1 text-[10.5px] text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
          admin.yourbrand.com/dashboard
        </div>
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-[152px] shrink-0 border-r border-[var(--color-hairline)] p-3 sm:block">
          <div className="mb-3 flex items-center gap-2 px-1.5">
            <span className="grid size-5 place-items-center rounded-[4px] bg-ink text-[9px] font-bold text-white">
              Y
            </span>
            <span className="truncate text-[11.5px] font-semibold text-ink">
              Your Brand
            </span>
          </div>
          {DASHBOARD_NAV.map((n, i) => (
            <div
              key={n}
              className={cn(
                "truncate rounded-md px-1.5 py-[7px] text-[11.5px]",
                i === 0
                  ? "bg-[var(--color-mist)] font-medium text-ink"
                  : "text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]",
              )}
            >
              {n}
            </div>
          ))}
        </aside>

        {/* body */}
        <div className="min-w-0 flex-1 p-3.5 sm:p-4">
          {/* kpi row */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-hairline)] bg-[var(--color-hairline)] lg:grid-cols-4">
            {KPIS.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="bg-canvas p-3"
              >
                <div className="pb-micro mb-1.5 text-[9px]">{k.label}</div>
                <div className="pb-mono text-[15px] font-semibold tracking-[-0.02em] text-ink">
                  {k.value}
                </div>
                <div
                  className={cn(
                    "pb-mono mt-1 text-[10px]",
                    k.up ? "text-[var(--color-check)]" : "text-[var(--color-ever)]",
                  )}
                >
                  {k.delta}
                </div>
              </motion.div>
            ))}
          </div>

          {/* chart */}
          <div className="mt-3.5 rounded-lg border border-[var(--color-hairline)] p-3.5">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <div className="pb-micro mb-1.5 text-[9px]">
                  Net revenue, last 12 weeks
                </div>
                <div className="pb-mono text-[19px] font-semibold tracking-[-0.02em] text-ink">
                  $1,047,318.42
                </div>
              </div>
              <span className="pb-mono rounded-full bg-[color-mix(in_oklab,var(--color-check)_10%,white)] px-2 py-1 text-[10px] font-medium text-[var(--color-check)]">
                +41.7%
              </span>
            </div>

            <svg
              viewBox={`0 0 ${w} ${h}`}
              className="h-[110px] w-full sm:h-[140px]"
              preserveAspectRatio="none"
              role="img"
              aria-label="Net revenue trending up over the last twelve weeks"
            >
              <defs>
                <linearGradient id="pbFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-marine)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--color-marine)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={area}
                fill="url(#pbFill)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
              <motion.path
                d={line}
                fill="none"
                stroke="var(--color-marine)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </div>

          {/* orders table */}
          <div className="mt-3.5 overflow-hidden rounded-lg border border-[var(--color-hairline)]">
            <div className="pb-micro flex items-center justify-between border-b border-[var(--color-hairline)] bg-[var(--color-mist)] px-3 py-2 text-[9px]">
              <span>Pharmacy queue</span>
              <span>4 open</span>
            </div>
            {ORDERS.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-3 py-2.5 last:border-b-0"
              >
                <span className="pb-mono w-[74px] shrink-0 text-[10.5px] text-[color-mix(in_oklab,var(--color-ink)_50%,transparent)]">
                  {o.id}
                </span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-ink">
                  {o.tx}
                </span>
                <span className="hidden w-[80px] shrink-0 truncate text-[11px] text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)] sm:block">
                  {o.pharmacy}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    STATUS_TONE[o.status],
                  )}
                >
                  {o.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
