import type { Stage } from "@/hooks/useLiveSessions";

/**
 * Single source of truth for how a visitor looks in both 3D and 2D views.
 * Palette locked to /admin and /analytics (indigo / sky / violet / emerald).
 */
export type DotRule = {
  hex: string;
  rgb: [number, number, number]; // 0..1 for COBE
  size: number;    // COBE marker size
  sizeMap: number; // px radius on 2D map
  pulse: boolean;  // sinusoidal size heartbeat
  label: string;
};

export const DOT_RULES: Record<Stage, DotRule> = {
  browsing:  { hex: "#2563eb", rgb: [0.145, 0.388, 0.921], size: 0.055, sizeMap: 6,  pulse: false, label: "Visitor" },
  cart:      { hex: "#0ea5e9", rgb: [0.055, 0.647, 0.914], size: 0.062, sizeMap: 7,  pulse: true,  label: "In intake" },
  checkout:  { hex: "#7c3aed", rgb: [0.486, 0.227, 0.929], size: 0.075, sizeMap: 9,  pulse: true,  label: "Checking out" },
  purchased: { hex: "#10b981", rgb: [0.062, 0.725, 0.506], size: 0.090, sizeMap: 11, pulse: false, label: "Purchased" },
};

export const HQ: { lat: number; lng: number } = { lat: 37.77, lng: -122.42 };
