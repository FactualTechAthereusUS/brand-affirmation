import { Btn, Check, MicroLabel } from "../primitives";
import { RevealGroup, RevealItem } from "../primitives";
import { tiers } from "@/lib/pharmabro/pricing";
import { cn } from "@/lib/utils";

/** Four plan cards. The popular column is tinted full height, Cuvo style. */
export function PricingTiers() {
  return (
    <RevealGroup className="grid gap-4 lg:grid-cols-4">
      {tiers.map((t) => (
        <RevealItem key={t.id}>
          <div
            className={cn(
              "flex h-full flex-col rounded-xl border p-6",
              t.popular
                ? "border-[color-mix(in_oklab,var(--color-marine)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_4%,white)]"
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

            <div className="pb-dim mt-3 text-[13px]">{t.volume}</div>

            <div className="mt-5 flex items-end gap-1">
              <span className="text-[2rem] leading-none tracking-[-0.03em] text-ink">
                {t.price}
              </span>
              {t.priceNote ? (
                <span className="pb-dim pb-1 text-[14px]">{t.priceNote}</span>
              ) : null}
            </div>
            <div className="pb-dim mt-2 text-[13px]">{t.setup}</div>

            <p className="pb-body mt-5 text-[14px] leading-relaxed">{t.blurb}</p>

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
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
