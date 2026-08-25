import { Rail, Rise, SectionHead, Stars } from "./uo";
import { UO_PHOTO_REVIEWS } from "./reviews";

/**
 * Section 5 — real Loox photo reviews from the store, laid out like the Hears
 * revolution slider: customer photo on top, avatar + name, stars, bold
 * headline, verbatim body. Photo reviews only.
 */
export function UOReactions() {
  return (
    <section id="reactions" className="border-y border-ink/10 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <Rise>
          <SectionHead
            title="The Reactions"
            sub="Real photos, real orders, real people. Nothing here is written by us."
          />
        </Rise>

        <Rise delay={0.08} className="mt-7 md:mt-10">
          <Rail contentClassName="-mx-4 px-4 md:mx-0 md:px-0">
            {UO_PHOTO_REVIEWS.map((r) => (
              <article
                key={r.id}
                className="flex w-[74%] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] bg-canvas shadow-[0_1px_2px_rgba(20,20,20,0.06),0_10px_30px_-18px_rgba(20,20,20,0.25)] sm:w-[46%] md:w-[30%] lg:w-[21.5%]"
              >
                <img
                  src={r.image}
                  alt={`Photo review from ${r.name}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-[#141414] text-[10px] font-bold text-[#f2efe8]">
                      {r.name.slice(0, 1)}
                    </span>
                    <span className="truncate text-[12px] font-semibold text-ink/70">{r.name}</span>
                    {r.verified ? (
                      <span className="ml-auto shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <Stars className="mt-3" />
                  <p className="mt-2 text-[13.5px] font-bold leading-[1.35] text-ink">{r.headline}</p>
                  {r.body ? (
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-ink/65">{r.body}</p>
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
