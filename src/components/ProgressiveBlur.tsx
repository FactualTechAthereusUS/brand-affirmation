/**
 * ProgressiveBlur
 * A fixed overlay pinned to the bottom (or top) of the viewport that applies
 * a stacked, progressively stronger backdrop-blur — content appears to
 * "un-blur" as it scrolls past. Same technique as Framer's Progressive Blur.
 *
 * Renders nothing until the user has scrolled a bit, so the hero stays crisp.
 */
import { useEffect, useState } from "react";

type Props = {
  /** Which edge to pin to. */
  side?: "bottom" | "top";
  /** Total height of the blur band. */
  height?: number;
  /** Number of stacked layers — more = smoother gradient, heavier GPU. */
  layers?: number;
  /** Max blur radius (px) applied to the strongest edge layer. */
  maxBlur?: number;
  /** Scroll offset (px) after which the effect fades in. */
  activateAfter?: number;
  className?: string;
};

export function ProgressiveBlur({
  side = "bottom",
  height = 140,
  layers = 6,
  maxBlur = 14,
  activateAfter = 200,
  className = "",
}: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setActive(window.scrollY > activateAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activateAfter]);

  const isBottom = side === "bottom";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 z-40 transition-opacity duration-500 ${
        isBottom ? "bottom-0" : "top-0"
      } ${active ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ height }}
    >
      {Array.from({ length: layers }).map((_, i) => {
        // i=0 is the softest (near content edge), i=layers-1 the strongest (at the edge)
        const t = (i + 1) / layers; // 0..1
        const blur = Math.round(maxBlur * t * 10) / 10;

        // Each layer is masked so it only shows in its slice of the band,
        // producing a smooth ramp from clear -> strongest blur at the edge.
        const start = Math.round(((i) / layers) * 100);
        const mid = Math.round(((i + 0.5) / layers) * 100);
        const end = Math.round(((i + 1.5) / layers) * 100);
        const gradientDir = isBottom ? "to top" : "to bottom";
        const mask = `linear-gradient(${gradientDir},
          rgba(0,0,0,1) ${start}%,
          rgba(0,0,0,1) ${mid}%,
          rgba(0,0,0,0) ${Math.min(end, 100)}%)`;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitMaskImage: mask,
              maskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
