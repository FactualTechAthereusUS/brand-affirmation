import { useState } from "react";
import { Cell, MicroLabel } from "../primitives";
import { featureGroups, planColumns } from "@/lib/pharmabro/pricing";
import { cn } from "@/lib/utils";

/**
 * Full feature table across the four plan columns. Groups collapse on request
 * so the long list stays walkable, and the popular column is tinted the whole
 * way down.
 */
export function FeatureTable() {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const toggle = (g: string) => setClosed((s) => ({ ...s, [g]: !s[g] }));

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-hairline)]">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-canvas">
          <tr className="border-b border-[var(--color-hairline)]">
            <th className="pb-micro w-[36%] px-4 py-4 font-normal sm:px-5">Capability</th>
            {planColumns.map((p) => (
              <th
                key={p.name}
                className={cn(
                  "px-4 py-4 text-[13px] font-medium sm:px-5",
                  p.popular
                    ? "bg-[color-mix(in_oklab,var(--color-marine)_5%,white)] text-ink"
                    : "text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)]",
                )}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>

        {featureGroups.map((g) => {
          const isClosed = closed[g.group];
          return (
            <tbody key={g.group}>
              <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-mist)]">
                <th colSpan={5} className="px-4 py-0 text-left sm:px-5">
                  <button
                    type="button"
                    onClick={() => toggle(g.group)}
                    aria-expanded={!isClosed}
                    className="flex w-full items-center justify-between gap-3 py-3"
                  >
                    <MicroLabel>{g.group}</MicroLabel>
                    <span className="pb-dim text-[12px]">
                      {isClosed ? "Show" : "Hide"} {g.rows.length}
                    </span>
                  </button>
                </th>
              </tr>

              {isClosed
                ? null
                : g.rows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-[var(--color-hairline)] transition-colors hover:bg-[#F5F3FF]"
                    >
                      <td className="px-4 py-3 text-[13.5px] leading-snug text-ink sm:px-5">
                        {row.label}
                      </td>
                      {row.values.map((v, i) => (
                        <td
                          key={planColumns[i]!.name}
                          className={cn(
                            "px-4 py-3 align-middle sm:px-5",
                            planColumns[i]!.popular &&
                              "bg-[color-mix(in_oklab,var(--color-marine)_5%,white)]",
                          )}
                        >
                          <Cell value={v} own={i === 1} />
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
