/**
 * ProgressiveBlur
 * A fixed overlay pinned to the bottom (or top) of the viewport with stacked
 * backdrop-blur layers whose opacity ramps up toward the edge — content
 * "un-blurs" as it scrolls away from the edge. Same idea as Framer's
 * Progressive Blur component.
 */
import { useEffect, useState } from "react";

type Props = {
  side?: "bottom" | "top";
  height?: number;
  layers?: number;
  maxBlur?: number;
  activateAfter?: number;
  className?: string;
};

export function ProgressiveBlur({
  side = "bottom",
  height = 140,
  layers = 5,
  maxBlur = 12,
  activateAfter = 0,
  className = "",
}: Props) {
  const [visible, setVisible] = useState(activateAfter === 0);

  useEffect(() => {
    if (activateAfter === 0) return;
    const onScroll = () => setVisible(window.scrollY > activateAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activateAfter]);

  const isBottom = side === "bottom";
  // Gradient direction: 0% end is the EDGE (fully opaque), 100% end is the
  // content side (fully transparent). Each layer's opaque region shrinks
  // toward the edge as the blur radius grows.
  const gradientDir = isBottom ? "to top" : "to bottom";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 z-40 transition-opacity duration-500 ${
        isBottom ? "bottom-0" : "top-0"
      } ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ height }}
    >
      {Array.from({ length: layers }).map((_, i) => {
        const t = (i + 1) / layers; // 0..1
        const blur = +(maxBlur * t).toFixed(1);
        // Stronger layers occupy a smaller band near the edge.
        const opaqueTo = Math.round((1 - t) * 100); // fully visible from edge to this %
        const fadeTo = Math.min(opaqueTo + Math.round(100 / layers), 100);
        const mask = `linear-gradient(${gradientDir}, #000 ${opaqueTo}%, transparent ${fadeTo}%)`;

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
