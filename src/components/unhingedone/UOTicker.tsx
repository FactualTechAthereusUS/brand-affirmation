import { Marquee } from "./uo";
import { CLAIM_CAP, CLAIMED } from "./data";

/**
 * Section 1 — black scrolling announcement bar. The claim counter lives here so
 * the scarcity mechanic is present on every page, not just the drop page.
 */
export function UOTicker() {
  const items = [
    "FREE SHIPPING ON 2+",
    "THE RESTOCK SHIPS OCT 25",
    `${CLAIMED.toLocaleString()} OF ${CLAIM_CAP.toLocaleString()} CLAIMED`,
  ];

  return (
    <div className="relative z-[60] bg-[#0b0b0b] text-[#f2efe8]">
      <Marquee speed={30} className="py-2.5">
        {Array.from({ length: 4 }).map((_, r) => (
          <div key={r} className="flex items-center">
            {items.map((t) => (
              <span key={`${r}-${t}`} className="flex items-center whitespace-nowrap">
                <span className="px-4 text-[10.5px] font-semibold uppercase tracking-[0.2em] md:text-[11px]">
                  {t}
                </span>
                <span className="text-uo-red">&#183;</span>
              </span>
            ))}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
