import { useMemo, useState } from "react";
import { CountUp, MicroLabel } from "../primitives";
import { REV_SHARE, tierForPatients } from "@/lib/pharmabro/pricing";

const usd = (n: number) =>
  `$${Math.round(n).toLocaleString("en-US")}`;

/**
 * Flat fee vs a 35% revenue share, at the visitor's own volume.
 * Everything is derived from the two inputs, no rounded marketing numbers.
 */
export function RevenueCalculator() {
  const [patients, setPatients] = useState(300);
  const [aov, setAov] = useState(299);

  const m = useMemo(() => {
    const revenue = patients * aov;
    const tier = tierForPatients(patients);
    const share = revenue * REV_SHARE;
    return {
      revenue,
      tier,
      ourCost: tier.fee,
      theirCost: share,
      weKeep: revenue - tier.fee,
      theyKeep: revenue - share,
      annualGap: (share - tier.fee) * 12,
    };
  }, [patients, aov]);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-canvas">
      <div className="grid gap-px bg-[var(--color-hairline)] lg:grid-cols-[0.9fr_1.1fr]">
        {/* inputs */}
        <div className="bg-canvas p-6 sm:p-8">
          <MicroLabel className="mb-5">Your numbers</MicroLabel>

          <label htmlFor="pb-patients" className="block text-[14px] font-medium text-ink">
            Monthly patient count
          </label>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[1.75rem] leading-none tracking-[-0.03em] text-ink">
              {patients.toLocaleString("en-US")}
            </span>
            <span className="pb-dim text-[13px]">active patients</span>
          </div>
          <input
            id="pb-patients"
            type="range"
            min={50}
            max={5000}
            step={50}
            value={patients}
            onChange={(e) => setPatients(Number(e.target.value))}
            className="mt-4 w-full accent-[var(--color-marine)]"
          />
          <div className="pb-dim mt-1.5 flex justify-between text-[12px]">
            <span>50</span>
            <span>5,000</span>
          </div>

          <label
            htmlFor="pb-aov"
            className="mt-8 block text-[14px] font-medium text-ink"
          >
            Average patient billing
          </label>
          <div className="mt-2 flex items-center rounded-lg border border-[var(--color-hairline)] px-3 focus-within:border-[var(--color-marine)]">
            <span className="pb-dim text-[15px]">$</span>
            <input
              id="pb-aov"
              type="number"
              min={0}
              value={aov}
              onChange={(e) => setAov(Math.max(0, Number(e.target.value)))}
              className="h-11 w-full bg-transparent px-2 text-[15px] text-ink outline-none"
            />
            <span className="pb-dim text-[13px]">/mo</span>
          </div>

          <p className="pb-dim mt-6 text-[13px] leading-relaxed">
            Monthly patient revenue: {usd(m.revenue)}. Your plan at this volume is{" "}
            {m.tier.name} at {usd(m.tier.fee)}/mo flat.
          </p>
        </div>

        {/* results */}
        <div className="bg-canvas p-6 sm:p-8">
          <MicroLabel className="mb-5">Flat fee vs 35% revenue share</MicroLabel>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-hairline)]">
                <th className="pb-micro py-3 pr-3 font-normal">Line</th>
                <th className="py-3 pr-3 text-[13px] font-medium text-ink">PharmaBro</th>
                <th className="py-3 text-[13px] font-medium text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                  Revenue share (35%)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-hairline)]">
                <td className="py-3.5 pr-3 text-[13.5px] text-ink">Monthly platform cost</td>
                <td className="py-3.5 pr-3 text-[14px] font-medium text-[var(--color-check)]">
                  {usd(m.ourCost)}
                </td>
                <td className="py-3.5 text-[14px] text-[var(--color-ever)]">
                  {usd(m.theirCost)}
                </td>
              </tr>
              <tr className="border-b border-[var(--color-hairline)]">
                <td className="py-3.5 pr-3 text-[13.5px] text-ink">You keep monthly</td>
                <td className="py-3.5 pr-3 text-[14px] font-medium text-[var(--color-check)]">
                  {usd(m.weKeep)}
                </td>
                <td className="py-3.5 text-[14px] text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)]">
                  {usd(m.theyKeep)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 pr-3 text-[13.5px] text-ink">Annual platform cost</td>
                <td className="py-3.5 pr-3 text-[14px] font-medium text-[var(--color-check)]">
                  {usd(m.ourCost * 12)}
                </td>
                <td className="py-3.5 text-[14px] text-[var(--color-ever)]">
                  {usd(m.theirCost * 12)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 rounded-lg border border-[color-mix(in_oklab,var(--color-marine)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_5%,white)] p-5">
            <div className="pb-micro mb-2">Annual savings vs revenue share</div>
            <div className="text-[2rem] leading-none tracking-[-0.03em] text-ink">
              <CountUp
                key={`${patients}-${aov}`}
                to={Math.max(0, m.annualGap)}
                duration={0.8}
                format={(n) => usd(n)}
              />
            </div>
            <p className="pb-body mt-3 text-[13.5px] leading-relaxed">
              That is what stays in your Stripe account every year at {patients.toLocaleString("en-US")}{" "}
              patients billing {usd(aov)} per month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
