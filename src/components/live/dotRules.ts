import type { Stage } from "@/hooks/useLiveSessions";

/**
 * Single source of truth for how a visitor looks in both 3D and 2D views.
 * Colors match /admin & /analytics palette.
 */
export const DOT_RULES: Record<
  Stage,
  { hex: string; rgb: [number, number, number]; size: number; sizeMap: number; pulse: boolean; label: string }
> = {
  browsing:  { hex: "#2563eb", rgb: [0.145, 0.388, 0.921], size: 0.028, sizeMap: 5,  pulse: false, label: "Browsing" },
  cart:      { hex: "#2563eb", rgb: [0.145, 0.388, 0.921], size: 0.040, sizeMap: 7,  pulse: true,  label: "Active cart" },
  checkout:  { hex: "#7c3aed", rgb: [0.486, 0.227, 0.929], size: 0.048, sizeMap: 8,  pulse: false, label: "Checkout" },
  purchased: { hex: "#10b981", rgb: [0.062, 0.725, 0.506], size: 0.065, sizeMap: 10, pulse: false, label: "Purchased" },
};
