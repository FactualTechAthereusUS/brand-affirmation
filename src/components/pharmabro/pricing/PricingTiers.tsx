import { Btn, MicroLabel, Reveal } from "../primitives";
import { enterpriseRow, tiers } from "@/lib/pharmabro/pricing";
import { cn } from "@/lib/utils";

/** Cream header strip that labels a panel. */
function PanelHead({ children }: { children: string }) {
  return (
    <div className="border-b border-[var(--color-hairline)] bg-[var(--color-mist)] px-6 py-3">
      <span className="text-sm text-ink/80">{children}</span>
    </div>
  );
}

/** Square-bullet feature list item. */
function Bullet({ children, lead }: { children: string; lead?: boolean }) {
  return (
    <li
      className={cn(
        "flex items-start gap-2.5 text-sm leading-5 before:mt-[7px] before:size-[5px] before:shrink-0 before:rounded-[1px] before:content-['']",
        lead
          ? "font-medium text-[var(--color-marine)] before:bg-[var(--color-marine)]"
          : "text-ink/90 before:bg-[color-mix(in_oklab,var(--color-marine)_40%,transparent)]",
      )}
    >
      <span>{children}</span>
    </li>
  );
}

function ViewAll() {
  return (
    <a
      href="#features"
      className="w-fit text-sm text-ink underline decoration-ink/40 underline-offset-4 transition-colors hover:decoration-ink"
    >
      View all features
    </a>
  );
}

/**
 * Plan programs in the Cuvo panel grammar: one white panel holding the three
 * done-for-you programs as divided columns, with Enterprise standing apart in
 * its own narrower panel.
 */
export function PricingTiers() {
  return (
    <Reveal>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* ------------------------------------------- done-for-you plans */}
        <div className="overflow-hidden border border-[var(--color-hairline)] bg-canvas lg:flex-[3]">
          <PanelHead>Done-for-you plans</PanelHead>
          <div className="grid grid-cols-1 divide-y divide-[var(--color-hairline)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {tiers.map((t) => (
              <div key={t.id} className="flex h-full flex-col gap-10 p-6 sm:p-8">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h3 className="text-[22px] leading-none tracking-[-0.02em] text-ink">
                        {t.name}
                      </h3>
                      {t.popular ? (
                        <span className="rounded-full bg-[var(--color-marine)] px-2.5 py-0.5 text-[11px] font-medium text-white">
                          Most popular
                        </span>
                      ) : null}
                    </div>
                    <p className="min-h-[3rem] text-[15px] leading-[1.4] text-ink/60">
                      {t.tagline}
                    </p>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[30px] leading-none tracking-[-0.02em] text-ink">
                          {t.price}
                        </span>
                        <span className="text-sm text-ink/70">{t.priceNote}*</span>
                      </div>
                      <p className="text-[13px] leading-[1.45] text-ink/70">*{t.setup}</p>
                      <p className="text-[11px] leading-[1.4] text-ink/45">
                        {t.volume} · month-to-month after setup.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Btn to={t.cta.to} variant={t.popular ? "blue" : "ghost"}>
                      {t.cta.label}
                    </Btn>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <MicroLabel className="text-ink/70">{t.listLabel}</MicroLabel>
                  <ul className="flex flex-col gap-4">
                    {t.features.map((f, i) => (
                      <Bullet key={f} lead={t.popular && i < 2}>
                        {f}
                      </Bullet>
                    ))}
                  </ul>
                  <div className="space-y-1">
                    <p className="text-[12.5px] text-ink/60">{t.consultFee}</p>
                    <p className="text-[12.5px] text-ink/60">{t.txnFee}</p>
                  </div>
                  <ViewAll />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------- enterprise */}
        <div className="overflow-hidden border border-[var(--color-hairline)] bg-canvas lg:flex-1">
          <PanelHead>Already at scale?</PanelHead>
          <div className="flex h-full flex-col gap-10 p-6 sm:p-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-[22px] leading-none tracking-[-0.02em] text-ink">
                  Enterprise
                </h3>
                <p className="min-h-[3rem] text-[15px] leading-[1.4] text-ink/60">
                  The same clinical, pharmacy and compliance rails, sized and priced
                  around your volume.
                </p>
                <p className="text-[20px] leading-none text-ink">Custom pricing</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Btn to={enterpriseRow.cta.to} variant="blue">
                  {enterpriseRow.cta.label}
                </Btn>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <MicroLabel className="text-ink/70">Features include</MicroLabel>
              <ul className="flex flex-col gap-4">
                {enterpriseRow.points.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>
              <ViewAll />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
