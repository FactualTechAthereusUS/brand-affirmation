import { BENTO } from "@/lib/pharmabro/home";
import { RevealGroup, RevealItem, Wordmark } from "./primitives";
import { cn } from "@/lib/utils";

/* Each card carries a small, literal visual instead of a decorative icon. */

function PaymentsVisual() {
  return (
    <div className="rounded-xl border border-[var(--color-hairline)] bg-canvas p-4">
      <div className="flex items-center justify-between">
        <Wordmark name="Stripe" />
        <span className="pb-micro">OAuth connected</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[28px] font-normal tabular-nums tracking-[-0.03em] text-ink">
          $47,582.98
        </span>
        <span className="text-[12px] font-medium text-[var(--color-check)]">
          settled today
        </span>
      </div>
      <div className="pb-dim mt-1 text-[11.5px]">
        to your merchant account, 0% platform cut
      </div>
    </div>
  );
}

function PharmacyVisual() {
  const rows = [
    { sku: "Semaglutide 2.5mg", ph: "Hallandale", cost: "$41.20" },
    { sku: "Tirzepatide 10mg", ph: "Empower", cost: "$88.00" },
    { sku: "Tadalafil 10mg", ph: "Revive", cost: "$6.40" },
  ];
  return (
    <div className="space-y-1.5">
      {rows.map((r, i) => (
        <div
          key={r.sku}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-[12px]",
            i === 0
              ? "border-[var(--color-marine)] bg-[color-mix(in_oklab,var(--color-marine)_6%,transparent)]"
              : "border-[var(--color-hairline)] bg-canvas",
          )}
        >
          <span className="truncate text-ink">{r.sku}</span>
          <span className="pb-micro shrink-0">{r.ph}</span>
          <span className="shrink-0 font-medium tabular-nums text-ink">
            {r.cost}
          </span>
        </div>
      ))}
    </div>
  );
}

function LegitScriptVisual() {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="pb-micro">PharmaBro</span>
          <span className="text-[12px] font-medium text-ink">12 days</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-[var(--color-mist)]">
          <div className="h-2 w-[14%] rounded-full bg-[var(--color-marine)]" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <span className="pb-micro">Solo application</span>
          <span className="pb-dim text-[12px]">3-6 months</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-[var(--color-mist)]">
          <div className="h-2 w-full rounded-full bg-[color-mix(in_oklab,var(--color-ink)_22%,transparent)]" />
        </div>
      </div>
    </div>
  );
}

function TrackingVisual() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {["Meta CAPI", "GA4", "TikTok", "Everflow", "Triple Whale", "Klaviyo"].map(
        (t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--color-hairline)] bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-ink"
          >
            {t}
          </span>
        ),
      )}
    </div>
  );
}

function DataVisual() {
  return (
    <div className="rounded-xl border border-[var(--color-hairline)] bg-canvas p-3 font-mono text-[11px] leading-relaxed text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]">
      <div className="pb-micro mb-1.5">patients_export.csv</div>
      <div>id,email,state,plan,card_token,rx_id</div>
      <div>p_8241,···,TX,tirz_10mg,tok_1Nk···,rx_5512</div>
      <div>p_8242,···,FL,sema_1mg,tok_1Nl···,rx_5513</div>
    </div>
  );
}

const VISUALS: Record<string, () => React.ReactElement> = {
  payments: PaymentsVisual,
  pharmacy: PharmacyVisual,
  legitscript: LegitScriptVisual,
  tracking: TrackingVisual,
  data: DataVisual,
};

export function BentoGrid() {
  return (
    <RevealGroup className="grid gap-4 lg:grid-cols-6">
      {BENTO.cards.map((c, i) => {
        const Visual = VISUALS[c.id];
        // Rimo bento rhythm: two wide cards on row one, three narrower on row two.
        const wide = i < 2;
        return (
          <RevealItem
            key={c.id}
            className={cn(
              "flex flex-col justify-between gap-6 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-mist)] p-6",
              wide ? "lg:col-span-3" : "lg:col-span-2",
            )}
          >
            <div>
              <h3 className="text-[17px] font-medium tracking-[-0.02em] text-ink">
                {c.title}
              </h3>
              <p className="pb-body mt-2 max-w-[46ch] text-[14px] leading-relaxed">
                {c.body}
              </p>
            </div>
            <div>{Visual ? <Visual /> : null}</div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

