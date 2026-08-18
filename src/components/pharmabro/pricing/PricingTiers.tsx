import { Btn, Check, MicroLabel } from "../primitives";
import { RevealGroup, RevealItem } from "../primitives";
import { enterpriseRow, tiers } from "@/lib/pharmabro/pricing";
import { cn } from "@/lib/utils";

/** Three plan cards plus the flat Enterprise row underneath. */
export function PricingTiers() {
  return (
    <>
      <RevealGroup className="grid gap-4 lg:grid-cols-3">
        {tiers.map((t) => (
          <RevealItem key={t.id}>
            <div
              className={cn(
                "flex h-full flex-col rounded-xl border p-6 sm:p-7",
                t.popular
                  ? "border-[color-mix(in_oklab,var(--color-marine)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_4%,white)] shadow-[0_18px_50px_-28px_rgba(27,78,245,0.35)]"
                  : "border-[var(--color-hairline)] bg-canvas",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <MicroLabel>{t.name}</MicroLabel>
                {t.popular ? (
                  <span className="pb-micro rounded-full bg-[var(--color-marine)] px-2 py-1 text-white">
                    Most popular
                  </span>
                ) : null}
              </div>

              <p className="pb-body mt-3 text-[14px] leading-relaxed">{t.tagline}</p>

              <div className="mt-6 flex items-end gap-1.5">
                <span className="text-[2.25rem] leading-none tracking-[-0.03em] text-ink">
                  {t.price}
                </span>
                <span className="pb-dim pb-1 text-[14px]">{t.priceNote}</span>
              </div>
              <div className="mt-2 text-[14px] text-ink">{t.setup}</div>
              <div className="pb-dim mt-1 text-[13px]">{t.volume}</div>

              <div className="mt-6">
                <Btn
                  to={t.cta.to}
                  variant={t.popular ? "blue" : "ghost"}
                  className="w-full"
                >
                  {t.cta.label}
                </Btn>
              </div>

              <div className="pb-micro mt-7 mb-3">{t.listLabel}</div>
              <ul className="space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className="mt-[3px] shrink-0" />
                    <span className="pb-body text-[13.5px] leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-1 pt-7">
                <p className="pb-dim text-[12.5px]">{t.consultFee}</p>
                <p className="pb-dim text-[12.5px]">{t.txnFee}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-mist)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <MicroLabel>Enterprise</MicroLabel>
          {enterpriseRow.points.map((p, i) => (
            <span key={p} className="flex items-center gap-3">
              {i > 0 ? <span className="pb-dim text-[12px]">·</span> : null}
              <span className="text-[14px] text-ink">{p}</span>
            </span>
          ))}
        </div>
        <Btn to={enterpriseRow.cta.to} variant="ghost">
          {enterpriseRow.cta.label} →
        </Btn>
      </div>
    </>
  );
}
