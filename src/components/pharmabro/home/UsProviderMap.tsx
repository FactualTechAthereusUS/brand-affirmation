/**
 * Flat United States coverage map. Geometry is pre-projected (Albers USA) at
 * build time in `src/lib/pharmabro/us-map.ts`, so there is no map library, no
 * tiles and no API key at runtime. Provider dots fade in with a stagger and a
 * rotating handful of them pulse, mirroring the live view in the admin panel.
 */
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  US_PROVIDER_POINTS,
  US_STATE_PATHS,
  US_VIEWBOX,
} from "@/lib/pharmabro/us-map";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

const ACTIVE_COUNT = 4;
const ROTATE_MS = 2200;

function pickActive(step: number) {
  const total = US_PROVIDER_POINTS.length;
  const set = new Set<number>();
  for (let i = 0; i < ACTIVE_COUNT; i++) {
    // Deterministic pseudo-shuffle so SSR and client agree on the first frame.
    set.add((step * 7 + i * 13 + 3) % total);
  }
  return set;
}

export function UsProviderMap({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => s + 1), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const active = useMemo(() => pickActive(step), [step]);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <svg
        viewBox={US_VIEWBOX}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Map of the United States showing licensed provider coverage in all 50 states"
      >
        <g>
          {US_STATE_PATHS.map((s, i) => (
            <motion.path
              key={s.n}
              d={s.d}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{
                duration: 0.7,
                delay: reduce ? 0 : 0.1 + i * 0.012,
                ease: PB_EASE_SOFT,
              }}
              fill="color-mix(in oklab, var(--color-marine) 7%, white)"
              stroke="color-mix(in oklab, var(--color-marine) 22%, white)"
              strokeWidth={0.9}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g>
          {US_PROVIDER_POINTS.map((p, i) => {
            const isActive = active.has(i);
            return (
              <motion.g
                key={p.n}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : 0.5 + i * 0.026,
                  ease: PB_EASE_SOFT,
                }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                {isActive && !reduce && (
                  <>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill="var(--color-marine)"
                      initial={{ opacity: 0.35, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 3.2 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={7}
                      fill="none"
                      stroke="color-mix(in oklab, var(--color-marine) 40%, transparent)"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  fill="var(--color-marine)"
                  animate={{ r: isActive && !reduce ? 4.2 : 2.6 }}
                  transition={{ duration: 0.5, ease: PB_EASE_SOFT }}
                  stroke={isActive ? "rgba(255,255,255,0.75)" : "transparent"}
                  strokeWidth={1.6}
                  vectorEffect="non-scaling-stroke"
                />
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/** Thin corner brackets used to frame the coverage blocks. */
export function Corners({ tone = "hairline" }: { tone?: "hairline" | "marine" }) {
  const color =
    tone === "marine"
      ? "color-mix(in oklab, var(--color-marine) 45%, transparent)"
      : "var(--color-hairline)";
  const base =
    "pointer-events-none absolute h-3.5 w-3.5 border-current";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ color }}>
      <span className={cn(base, "left-0 top-0 border-l border-t")} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}
