import { PrintTile, Rail, Rise, SectionHead, Stars } from "./uo";
import { REACTIONS } from "./data";
import { cn } from "@/lib/utils";

/**
 * Section 5 — replaces Comfrt's clinician block. Their authority is doctors;
 * ours is the reaction. Hears' card layout, verbatim review copy.
 */
export function UOReactions() {
  return (
    <section id="reactions" className="border-y border-ink/10 bg-[#f1ece2] py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <Rise>
          <SectionHead
            title="The Reactions"
            sub="998 reviews. Almost none of them describe the sweatshirt."
          />
        </Rise>

        <Rise delay={0.08} className="mt-7 md:mt-10">
          <Rail contentClassName="-mx-4 px-4 md:mx-0 md:px-0">
            {REACTIONS.map((r) => (
              <article
                key={r.headline}
                className="w-[78%] max-w-[340px] shrink-0 snap-start bg-canvas sm:w-[52%] md:w-[31%] lg:w-[23.5%]"
              >
                <PrintTile print={r.headline} tone={r.tone} ratio="aspect-[4/3]" size="sm" />
                <div className="px-4 pb-5 pt-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold",
                        r.tone === "ink" ? "bg-[#141414] text-[#f2efe8]" : "bg-uo-red text-white",
                      )}
                    >
                      {r.name.slice(0, 1)}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink/60">
                      {r.name}
                    </span>
                  </div>
                  <Stars className="mt-3" />
                  <h3 className="uo-display mt-2.5 text-[19px] leading-[1.05] md:text-[21px]">
                    &ldquo;{r.headline}&rdquo;
                  </h3>
                  {r.body ? (
                    <p className="mt-2 text-[13px] leading-[1.55] text-ink/60">{r.body}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </Rail>
        </Rise>
      </div>
    </section>
  );
}
