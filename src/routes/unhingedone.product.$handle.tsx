import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Rise, Stars } from "@/components/unhingedone/uo";
import {
  fetchProduct,
  money,
  optionValues,
  productImages,
  swatchHex,
  variantsOf,
} from "@/lib/uo/shopify";
import { useUOCart } from "@/lib/uo/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/unhingedone/product/$handle")({
  head: ({ params }) => {
    const name = params.handle
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const title = `${name} — Unhinged One`;
    const description =
      "Heavyweight brushed fleece with something to say. Free shipping on two or more. Nobody buys one.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { addLine, busy } = useUOCart();
  const { data: product, isLoading } = useQuery({
    queryKey: ["uo", "product", handle],
    queryFn: () => fetchProduct(handle),
    staleTime: 5 * 60_000,
  });

  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const colors = product ? optionValues(product, "Color") : [];
  const sizes = product ? optionValues(product, "Size") : [];
  const images = product ? productImages(product) : [];

  const selectedColor = color ?? colors[0] ?? null;
  const selectedSize = size ?? sizes[0] ?? null;

  const variant = useMemo(() => {
    if (!product) return null;
    return (
      variantsOf(product).find((v) => {
        const opts = v.selectedOptions;
        const cOk = !selectedColor || opts.some((o) => o.name === "Color" && o.value === selectedColor);
        const sOk = !selectedSize || opts.some((o) => o.name === "Size" && o.value === selectedSize);
        return cOk && sOk;
      }) ?? null
    );
  }, [product, selectedColor, selectedSize]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="aspect-[4/5] animate-pulse bg-ink/5" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse bg-ink/5" />
          <div className="h-4 w-1/3 animate-pulse bg-ink/5" />
          <div className="h-24 w-full animate-pulse bg-ink/5" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-24 text-center md:px-8">
        <p className="uo-display text-[30px] leading-none">Product not found</p>
        <Link to="/unhingedone" className="uo-btn mt-6 inline-flex">
          Back to the drop
        </Link>
      </div>
    );
  }

  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compare = variant?.compareAtPrice ?? product.compareAtPriceRange.minVariantPrice;
  const hasCompare = compare && Number.parseFloat(compare.amount) > Number.parseFloat(price.amount);
  const gallery = images.length ? images : [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-10">
      <nav className="mb-5 text-[11px] uppercase tracking-[0.14em] text-ink/45">
        <Link to="/unhingedone" className="uo-link">
          Home
        </Link>
        <span className="px-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
        {/* gallery */}
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efe9dd]">
            {gallery[active] ? (
              <img
                src={gallery[active].url}
                alt={gallery[active].altText ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          {gallery.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2 md:gap-3">
              {gallery.slice(0, 5).map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "aspect-square overflow-hidden border bg-[#efe9dd] transition",
                    i === active ? "border-ink" : "border-transparent hover:border-ink/30",
                  )}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* buy box */}
        <Rise className="md:pt-2">
          <h1 className="uo-display text-[30px] leading-[0.96] md:text-[42px]">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars />
            <span className="text-[11.5px] uppercase tracking-[0.12em] text-ink/45">
              998 reactions, almost none about the sweatshirt
            </span>
          </div>

          <p className="mt-4 flex items-center gap-3 text-[17px]">
            {hasCompare ? (
              <span className="text-ink/40 line-through">{money(compare!.amount, compare!.currencyCode)}</span>
            ) : null}
            <span className="font-semibold text-uo-red">{money(price.amount, price.currencyCode)}</span>
          </p>

          {colors.length > 0 ? (
            <div className="mt-7">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                Color &middot; <span className="text-ink">{selectedColor}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-7 w-7 rounded-full border transition",
                      c === selectedColor ? "border-ink ring-1 ring-ink ring-offset-2" : "border-ink/20",
                    )}
                    style={{ backgroundColor: swatchHex(c) }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {sizes.length > 0 ? (
            <div className="mt-6">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink/50">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const available = variantsOf(product).some(
                    (v) =>
                      v.availableForSale &&
                      v.selectedOptions.some((o) => o.name === "Size" && o.value === s) &&
                      (!selectedColor ||
                        v.selectedOptions.some((o) => o.name === "Color" && o.value === selectedColor)),
                  );
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      disabled={!available}
                      className={cn(
                        "min-w-[52px] border px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition",
                        s === selectedSize ? "border-ink bg-ink text-canvas" : "border-ink/20 hover:border-ink",
                        !available && "cursor-not-allowed border-ink/10 text-ink/25 line-through",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            disabled={busy || !variant?.availableForSale}
            onClick={() => variant && addLine(variant.id, 1)}
            className="uo-btn mt-7 w-full disabled:opacity-50"
          >
            {variant?.availableForSale ? "Add to cart" : "Sold out"}
          </button>

          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-ink/45">
            Free shipping on 2+ &middot; Nobody buys one
          </p>

          {product.description ? (
            <div className="mt-8 border-t border-ink/10 pt-6">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink/50">Details</p>
              <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-ink/70">
                {product.description}
              </p>
            </div>
          ) : null}
        </Rise>
      </div>
    </div>
  );
}
