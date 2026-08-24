import { motion } from "motion/react";
import { useState } from "react";
import { IconHeart, PrintTile, Rise, SectionHead, UO_EASE } from "./uo";
import type { UOProduct } from "./data";
import { cn } from "@/lib/utils";

/**
 * Sections 4 and 9 — Comfrt's 4-up product grid with Alo's swatch placement
 * (swatches above the name). Hover swaps the print for the customer reaction.
 */
export function UOProductGrid({
  id,
  title,
  sub,
  products,
}: {
  id: string;
  title: string;
  sub?: string;
  products: UOProduct[];
}) {
  return (
    <section id={id} className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
      <Rise>
        <SectionHead title={title} sub={sub} action="View all" />
      </Rise>
      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
        {products.map((p, i) => (
          <Rise key={p.name} delay={i * 0.06}>
            <Card product={p} />
          </Rise>
        ))}
      </div>
    </section>
  );
}

function Card({ product }: { product: UOProduct }) {
  const [hover, setHover] = useState(false);
  const [wish, setWish] = useState(false);
  const [swatch, setSwatch] = useState(0);

  return (
    <article
      className="group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden">
        <PrintTile print={product.print} tone={product.tone} size="md" />

        {/* reaction shot on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.45, ease: UO_EASE }}
          className="absolute inset-0 hidden flex-col justify-end bg-uo-red p-5 text-[#fff8f3] md:flex"
        >
          <p className="uo-display text-[20px] leading-[1.02] lg:text-[23px]">&ldquo;{product.reaction}&rdquo;</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fff8f3]/75">
            {product.reactionBy}
          </p>
        </motion.div>

        {product.badge ? (
          <span
            className={cn(
              "absolute left-2.5 top-2.5 z-10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]",
              product.badge === "ALMOST GONE" ? "bg-uo-red text-white" : "bg-[#0b0b0b] text-[#f2efe8]",
            )}
          >
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWish((w) => !w)}
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-canvas/85 text-ink backdrop-blur transition hover:bg-canvas"
        >
          <IconHeart className={cn("h-4 w-4", wish && "text-uo-red")} filled={wish} />
        </button>
      </div>

      {/* Alo pattern: swatches above the name */}
      <div className="mt-3 flex items-center gap-1.5">
        {product.swatches.map((s, i) => (
          <button
            key={s.name}
            type="button"
            aria-label={s.name}
            onClick={() => setSwatch(i)}
            className={cn(
              "h-[13px] w-[13px] rounded-full border transition",
              i === swatch ? "border-ink" : "border-ink/20 hover:border-ink/50",
            )}
            style={{ backgroundColor: s.hex }}
          />
        ))}
        <span className="ml-1 text-[10.5px] uppercase tracking-[0.12em] text-ink/40">
          {product.swatches.length} colors
        </span>
      </div>

      <h3 className="mt-2 text-[13px] font-medium leading-snug md:text-[14px]">{product.name}</h3>
      <p className="mt-1 flex items-center gap-2 text-[13px]">
        <span className="text-ink/40 line-through">${product.compareAt.toFixed(2)}</span>
        <span className="font-semibold text-uo-red">${product.price.toFixed(2)}</span>
      </p>
    </article>
  );
}
