import { PrintTile, Rail, Rise, SectionHead } from "./uo";
import { UGC, BEST_SELLERS } from "./data";

const IMAGES = ["/assets/uo-reaction-left.jpg", "/assets/uo-hero-matching-set.jpg"];

/**
 * Section 8 — Alo's shoppable UGC carousel with @handles. The most on-brand
 * section on either reference site: customers already post the reactions.
 */
export function UOUgc() {
  return (
    <section id="survivor" className="border-y border-ink/10 bg-canvas py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <Rise>
          <SectionHead title="As Seen On You" sub="Tag @unhingedone. We repost the best reactions." />
        </Rise>

        <Rise delay={0.08} className="mt-7 md:mt-10">
          <Rail contentClassName="-mx-4 px-4 md:mx-0 md:px-0">
            {UGC.map((u, i) => {
              const photo = i % 2 === 0 ? IMAGES[(i / 3) % IMAGES.length] : undefined;
              const product = BEST_SELLERS[i % BEST_SELLERS.length]!;
              return (
                <figure
                  key={u.handle}
                  className="group relative w-[62%] max-w-[300px] shrink-0 snap-start sm:w-[40%] md:w-[23.5%]"
                >
                  <div className="relative overflow-hidden">
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Customer photo from ${u.handle}`}
                        width={1600}
                        height={1104}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <PrintTile print={u.caption} tone={i % 2 ? "ink" : "cream"} size="sm" />
                    )}

                    {/* shoppable hotspot */}
                    <div className="absolute left-1/2 top-[58%] -translate-x-1/2">
                      <span className="relative grid h-6 w-6 place-items-center rounded-full bg-canvas/90 text-ink shadow-[0_6px_18px_-6px_rgba(0,0,0,0.5)]">
                        <span className="absolute inset-0 animate-ping rounded-full bg-canvas/50" />
                        <svg viewBox="0 0 24 24" className="relative h-3.5 w-3.5" fill="none" aria-hidden="true">
                          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                    </div>

                    {/* shop-the-look sheet */}
                    <div className="absolute inset-x-2 bottom-2 translate-y-3 bg-canvas/95 p-2.5 opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-[11px] font-medium leading-snug">{product.name}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-uo-red">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <figcaption className="mt-2.5 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-ink/50">
                    <span>{u.handle}</span>
                    <span className="text-ink/30">Shop</span>
                  </figcaption>
                </figure>
              );
            })}
          </Rail>
        </Rise>
      </div>
    </section>
  );
}
