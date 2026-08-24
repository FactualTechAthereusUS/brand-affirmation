import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { IconHeart, Rise, SectionHead } from "./uo";
import {
  badgeFor,
  fetchCollectionProducts,
  money,
  optionValues,
  productImages,
  savingsPct,
  swatchHex,
  variantsOf,
  type UOShopifyProduct,
} from "@/lib/uo/shopify";
import { useUOCart } from "@/lib/uo/cart";
import { cn } from "@/lib/utils";

/**
 * Comfrt's 4-up product grid with Alo's swatch placement, rendered entirely
 * from the live Shopify catalog. Hover swaps to the second product image.
 */
export function UOProductGrid({
  id,
  title,
  sub,
  collection,
  count = 8,
}: {
  id: string;
  title: string;
  sub?: string;
  /** Shopify collection handle. */
  collection: string;
  count?: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["uo", "collection", collection, count],
    queryFn: () => fetchCollectionProducts(collection, count),
    staleTime: 5 * 60_000,
  });

  return (
    <section id={id} className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
      <Rise>
        <SectionHead title={title} sub={sub} />
      </Rise>

      {isLoading ? (
        <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:grid-cols-4 md:gap-x-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] w-full bg-ink/5" />
              <div className="mt-3 h-3 w-2/3 bg-ink/5" />
              <div className="mt-2 h-3 w-1/3 bg-ink/5" />
            </div>
          ))}
        </div>
      ) : isError || !data || data.length === 0 ? (
        <div className="mt-10 border border-ink/10 px-6 py-16 text-center">
          <p className="uo-display text-[24px] leading-none">No products found</p>
          <p className="mx-auto mt-3 max-w-[420px] text-[13px] text-ink/55">
            Tell me the product and the price in chat and I'll create it in your store.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {data.map((p, i) => (
            <Rise key={p.id} delay={Math.min(i, 3) * 0.06}>
              <Card product={p} />
            </Rise>
          ))}
        </div>
      )}
    </section>
  );
}

export function Card({ product }: { product: UOShopifyProduct }) {
  const [hover, setHover] = useState(false);
  const [wish, setWish] = useState(false);
  const [swatch, setSwatch] = useState(0);
  const { addLine, busy } = useUOCart();

  const images = productImages(product);
  const colors = optionValues(product, "Color");
  const badge = badgeFor(product);
  const off = savingsPct(product);
  const price = product.priceRange.minVariantPrice;
  const compare = product.compareAtPriceRange.minVariantPrice;

  const selectedColor = colors[swatch];
  const colorImage = selectedColor
    ? variantsOf(product).find(
        (v) => v.image && v.selectedOptions.some((o) => o.value === selectedColor),
      )?.image
    : null;

  const primary = colorImage?.url ?? images[0]?.url;
  const secondary = images[1]?.url ?? primary;

  const quickAdd = async () => {
    const variant =
      variantsOf(product).find(
        (v) =>
          v.availableForSale &&
          (!selectedColor || v.selectedOptions.some((o) => o.value === selectedColor)),
      ) ?? variantsOf(product).find((v) => v.availableForSale);
    if (variant) await addLine(variant.id, 1);
  };

  return (
    <article className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="relative overflow-hidden bg-[#efe9dd]">
        <Link to="/unhingedone/product/$handle" params={{ handle: product.handle }} className="block">
          <div className="aspect-[4/5] w-full">
            {primary ? (
              <img
                src={primary}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-500",
                  hover && secondary !== primary ? "opacity-0" : "opacity-100",
                )}
              />
            ) : null}
            {secondary && secondary !== primary ? (
              <img
                src={secondary}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                  hover ? "opacity-100" : "opacity-0",
                )}
              />
            ) : null}
          </div>
        </Link>

        {badge ? (
          <span
            className={cn(
              "absolute left-2.5 top-2.5 z-10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]",
              badge === "ALMOST GONE" || badge === "SOLD OUT"
                ? "bg-uo-red text-white"
                : "bg-[#0b0b0b] text-[#f2efe8]",
            )}
          >
            {badge}
          </span>
        ) : null}

        {off > 0 ? (
          <span className="absolute left-2.5 top-2.5 z-10 hidden px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]">
            {off}% off
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

        <div className="absolute inset-x-2 bottom-2 z-10 hidden md:block">
          <button
            type="button"
            onClick={quickAdd}
            disabled={busy || !product.availableForSale}
            className="w-full translate-y-3 bg-[#0b0b0b] py-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#f2efe8] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:opacity-40"
          >
            {product.availableForSale ? "Add to cart" : "Sold out"}
          </button>
        </div>
      </div>

      {/* Alo pattern: swatches above the name */}
      {colors.length > 0 ? (
        <div className="mt-3 flex items-center gap-1.5">
          {colors.slice(0, 6).map((c, i) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => setSwatch(i)}
              className={cn(
                "h-[13px] w-[13px] rounded-full border transition",
                i === swatch ? "border-ink" : "border-ink/20 hover:border-ink/50",
              )}
              style={{ backgroundColor: swatchHex(c) }}
            />
          ))}
          <span className="ml-1 text-[10.5px] uppercase tracking-[0.12em] text-ink/40">
            {colors.length} colors
          </span>
        </div>
      ) : null}

      <h3 className="mt-2 text-[13px] font-medium leading-snug md:text-[14px]">
        <Link to="/unhingedone/product/$handle" params={{ handle: product.handle }} className="uo-link">
          {product.title}
        </Link>
      </h3>
      <p className="mt-1 flex items-center gap-2 text-[13px]">
        {Number.parseFloat(compare.amount) > Number.parseFloat(price.amount) ? (
          <span className="text-ink/40 line-through">{money(compare.amount, compare.currencyCode)}</span>
        ) : null}
        <span className="font-semibold text-uo-red">{money(price.amount, price.currencyCode)}</span>
      </p>

      <button
        type="button"
        onClick={quickAdd}
        disabled={busy || !product.availableForSale}
        className="mt-3 w-full border border-ink/15 py-2 text-[10.5px] font-bold uppercase tracking-[0.18em] transition hover:border-ink disabled:opacity-40 md:hidden"
      >
        {product.availableForSale ? "Add to cart" : "Sold out"}
      </button>
    </article>
  );
}
