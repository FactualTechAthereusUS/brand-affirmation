import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cell, MicroLabel } from "../primitives";
import { featureGroups, planColumns } from "@/lib/pharmabro/pricing";
import { cn } from "@/lib/utils";

const TINT = "bg-[color-mix(in_oklab,var(--color-marine)_4%,white)]";

/**
 * Full feature table across the four plan columns.
 *
 * Desktop keeps every column with a priced header and its own CTA; mobile
 * renders one plan at a time behind a sticky picker so nothing scrolls
 * sideways. Groups collapse so the long list stays walkable.
 */
export function FeatureTable() {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [plan, setPlan] = useState(1);
  const toggle = (g: string) => setClosed((s) => ({ ...s, [g]: !s[g] }));

  /** Column visibility: on mobile only the picked plan renders. */
  const colClass = (i: number) =>
    i === plan ? "table-cell" : "hidden md:table-cell";

  return (
    <div>
      {/* -------------------------------------------- mobile plan picker */}
      <div className="sticky top-[76px] z-30 -mx-1 bg-canvas px-1 pb-3 pt-2 md:hidden">
        <div
          role="group"
          aria-label="Choose a plan to compare"
          className="grid grid-cols-4 border border-[var(--color-hairline)] bg-canvas"
        >
          {planColumns.map((p, i) => (
            <button
              key={p.name}
              type="button"
              aria-pressed={i === plan}
              onClick={() => setPlan(i)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-1 py-2 transition-colors",
                i === plan
                  ? "bg-[var(--color-marine)] text-white"
                  : "text-ink/70 hover:text-ink",
              )}
            >
              <span className="text-[13px] font-medium leading-none">{p.name}</span>
              <span
                className={cn(
                  "text-[10px] leading-none",
                  i === plan ? "text-white/70" : "text-ink/45",
                )}
              >
                {p.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- table */}
      <div className="mt-4 overflow-x-auto [contain:paint] md:mt-8">
        <table className="w-full border-collapse text-left md:min-w-[880px]">
          <thead>
            <tr className="border-b border-[var(--color-hairline)]">
              <th
                scope="col"
                className="sticky left-0 z-10 w-[40%] min-w-[160px] bg-canvas px-4 pb-5 align-bottom sm:min-w-[220px]"
              >
                <MicroLabel>Capability</MicroLabel>
              </th>
              {planColumns.map((p, i) => (
                <th
                  key={p.name}
                  scope="col"
                  className={cn(
                    "px-4 pb-5 pt-4 text-center align-bottom",
                    colClass(i),
                    p.popular && TINT,
                  )}
                >
                  {p.popular ? (
                    <span className="mb-2 inline-block rounded-full bg-[var(--color-marine)] px-2.5 py-0.5 text-[11px] font-medium text-white">
                      Most popular
                    </span>
                  ) : (
                    <span aria-hidden className="mb-2 block h-[19px]" />
                  )}
                  <span className="block text-[17px] leading-none tracking-[-0.01em] text-ink">
                    {p.name}
                  </span>
                  <span className="mt-1.5 block text-[13px] text-ink/80">{p.price}</span>
                  <span className="block text-[11px] text-ink/45">{p.note}</span>
                  <Link
                    to={p.to}
                    className={cn(
                      "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border px-3 py-2 text-[14px] leading-4 tracking-[-0.01em] whitespace-nowrap transition-colors",
                      p.popular
                        ? "border-[var(--color-marine)] bg-[var(--color-marine)] text-white hover:opacity-90"
                        : "border-[var(--color-marine)] bg-transparent text-[var(--color-marine)] hover:bg-[var(--color-marine)] hover:text-white",
                    )}
                  >
                    Get started
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          {featureGroups.map((g) => {
            const isClosed = closed[g.group];
            return (
              <tbody key={g.group}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={planColumns.length + 1}
                    className="bg-[var(--color-mist)] px-4 py-0 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(g.group)}
                      aria-expanded={!isClosed}
                      className="flex w-full items-center justify-between gap-3 py-2.5"
                    >
                      <MicroLabel className="text-ink/70">{g.group}</MicroLabel>
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
                        className="border-b border-[var(--color-hairline)] last:border-b-0"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 z-10 bg-canvas px-4 py-3 text-left text-[13.5px] font-normal leading-5 text-ink/90"
                        >
                          {row.label}
                        </th>
                        {row.values.map((v, i) => (
                          <td
                            key={planColumns[i]!.name}
                            className={cn(
                              "px-4 py-3 text-center align-middle",
                              colClass(i),
                              planColumns[i]!.popular && TINT,
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

      <p className="mt-5 text-xs text-ink/55">
        <span className="font-medium text-ink/70">Add-on</span> means the feature is
        available on any plan for an extra fee.{" "}
        <span className="font-medium text-ink/70">&mdash;</span> means it is not
        included on that plan.
      </p>
    </div>
  );
}
