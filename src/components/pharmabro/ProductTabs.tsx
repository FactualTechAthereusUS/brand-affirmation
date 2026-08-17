import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { PRODUCT_TABS, type ProductTab } from "@/lib/pharmabro/home";
import { DashboardMockup } from "./DashboardMockup";
import { GradientPlate } from "./primitives";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------- mini mockups */

function Chrome({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-canvas shadow-[0_24px_60px_-32px_rgba(10,10,10,0.28)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-hairline)] bg-[var(--color-mist)] px-3 py-2">
        <span className="flex gap-1.5">
          {["#e5e5ea", "#e5e5ea", "#e5e5ea"].map((c, i) => (
            <span
              key={i}
              className="size-2 rounded-full"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="pb-micro truncate">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function IntakeMockup() {
  const screens = [
    { name: "Welcome", pct: "100%" },
    { name: "Height & weight", pct: "94%" },
    { name: "Medical history", pct: "88%" },
    { name: "State & ID", pct: "81%" },
    { name: "Plan select", pct: "62%" },
  ];
  return (
    <Chrome title="portal.yourbrand.com / intake builder">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
        <div className="space-y-2">
          {screens.map((s, i) => (
            <div
              key={s.name}
              className={cn(
                "flex items-center justify-between rounded-lg border px-2.5 py-2 text-[11.5px]",
                i === 2
                  ? "border-[var(--color-marine)] bg-[color-mix(in_oklab,var(--color-marine)_7%,transparent)]"
                  : "border-[var(--color-hairline)]",
              )}
            >
              <span className="flex items-center gap-2 text-ink">
                <span className="pb-micro">{String(i + 1).padStart(2, "0")}</span>
                {s.name}
              </span>
              <span className="pb-dim text-[11px]">{s.pct}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[var(--color-hairline)] p-3">
          <div className="pb-micro">Branch logic</div>
          <div className="mt-2.5 space-y-2">
            {[
              "If BMI ≥ 27 → GLP-1 eligible",
              "If pregnant → decline path",
              "If T2D → physician flag",
              "If state = LA → sync visit",
            ].map((r) => (
              <div
                key={r}
                className="rounded-md bg-[var(--color-mist)] px-2.5 py-1.5 text-[11px] text-ink"
              >
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function PortalMockup() {
  return (
    <Chrome title="portal.yourbrand.com">
      <div className="mx-auto max-w-[280px] overflow-hidden rounded-[22px] border border-[var(--color-hairline)] bg-canvas">
        <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-4 py-3">
          <span className="text-[13px] font-semibold tracking-[-0.02em] text-ink">
            Your Brand
          </span>
          <span className="size-6 rounded-full bg-[var(--color-mist)]" />
        </div>
        <div className="space-y-3 p-4">
          <div className="rounded-xl border border-[var(--color-hairline)] p-3">
            <div className="pb-micro">Next shipment</div>
            <div className="mt-1 text-[15px] font-medium text-ink">
              Semaglutide 0.5mg
            </div>
            <div className="pb-dim mt-0.5 text-[11.5px]">
              Arrives Thu, ships from Hallandale
            </div>
            <div className="mt-2.5 h-1 rounded-full bg-[var(--color-mist)]">
              <div className="h-1 w-2/3 rounded-full bg-[var(--color-marine)]" />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-hairline)] p-3">
            <div className="pb-micro">Message your physician</div>
            <div className="mt-2 rounded-lg bg-[var(--color-mist)] px-2.5 py-2 text-[11.5px] text-ink">
              Dr. Larson replied 2h ago
            </div>
          </div>
          <div className="flex gap-2">
            {["Home", "Messages", "My Plan"].map((t, i) => (
              <span
                key={t}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-center text-[10.5px]",
                  i === 0
                    ? "bg-ink text-canvas"
                    : "bg-[var(--color-mist)] text-ink",
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function RebillMockup() {
  const rows = [
    { d: "Mar 04", amt: "$299.00", state: "Charged" },
    { d: "Apr 03", amt: "$299.00", state: "Charged" },
    { d: "May 03", amt: "$299.00", state: "Recovered" },
    { d: "Jun 02", amt: "$299.00", state: "Scheduled" },
  ];
  return (
    <Chrome title="Rebill engine / cycle 13">
      <div className="grid gap-3 sm:grid-cols-[1.15fr_1fr]">
        <div className="space-y-1.5">
          {rows.map((r) => (
            <div
              key={r.d}
              className="flex items-center justify-between rounded-lg border border-[var(--color-hairline)] px-2.5 py-2 text-[11.5px]"
            >
              <span className="pb-micro">{r.d}</span>
              <span className="font-medium tabular-nums text-ink">{r.amt}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  r.state === "Scheduled"
                    ? "bg-[var(--color-mist)] text-ink"
                    : "bg-[color-mix(in_oklab,var(--color-check)_12%,transparent)] text-[var(--color-check)]",
                )}
              >
                {r.state}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[var(--color-hairline)] p-3">
          <div className="pb-micro">Saved vs subscription API</div>
          <div className="mt-1.5 text-[26px] font-normal tabular-nums tracking-[-0.03em] text-ink">
            $1,043.60
          </div>
          <div className="pb-dim text-[11.5px]">this month, 3,482 rebills</div>
          <div className="mt-3 flex items-end gap-1">
            {[38, 46, 41, 58, 63, 71, 86].map((h, i) => (
              <span
                key={i}
                className="w-full rounded-[2px] bg-[var(--color-marine)]"
                style={{ height: h, opacity: 0.35 + i * 0.09 }}
              />
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function Panel({ tab }: { tab: ProductTab }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
      <div>
        <div className="pb-micro">{tab.micro}</div>
        <h3 className="mt-3 text-balance text-2xl font-normal leading-[1.15] tracking-[-0.02em] text-ink md:text-[1.75rem]">
          {tab.title}
        </h3>
        <p className="pb-body mt-3 text-[15px] leading-relaxed">{tab.body}</p>
        <ul className="mt-5 space-y-2.5">
          {tab.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink">
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-check)]" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <GradientPlate className="p-4 sm:p-6">
        {tab.id === "dashboard" ? <DashboardMockup /> : null}
        {tab.id === "intake" ? <IntakeMockup /> : null}
        {tab.id === "portal" ? <PortalMockup /> : null}
        {tab.id === "rebill" ? <RebillMockup /> : null}
      </GradientPlate>
    </div>
  );
}

export function ProductTabs() {
  const [active, setActive] = useState(PRODUCT_TABS[0].id);
  const tab = PRODUCT_TABS.find((t) => t.id === active) ?? PRODUCT_TABS[0];

  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="Platform surfaces"
          className="inline-flex min-w-full gap-1 rounded-full border border-[var(--color-hairline)] bg-[var(--color-mist)] p-1"
        >
          {PRODUCT_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-colors",
                active === t.id
                  ? "text-canvas"
                  : "text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] hover:text-ink",
              )}
            >
              {active === t.id ? (
                <motion.span
                  layoutId="pb-tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              ) : null}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Panel tab={tab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
