/**
 * Flat United States coverage map. Geometry is pre-projected (Albers USA) at
 * build time in `src/lib/pharmabro/us-map.ts`, so there is no map library, no
 * tiles and no API key at runtime. Provider dots fade in with a stagger and a
 * rotating handful of them pulse, mirroring the live view in the admin panel.
 *
 * Motion is opt-out twice over: the OS `prefers-reduced-motion` setting, and an
 * in-panel toggle so a visitor can calm the map without changing system prefs.
 * On small screens the dot set is thinned with a min-distance filter so markers
 * never collide, and every dot stays tappable for its tooltip.
 */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  US_PROVIDER_POINTS,
  US_STATE_PATHS,
  US_VIEWBOX,
} from "@/lib/pharmabro/us-map";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

const ACTIVE_COUNT = 4;
const ROTATE_MS = 2200;
/** Minimum spacing between visible dots, in viewBox units, per breakpoint. */
const MIN_GAP_MOBILE = 52;

function pickActive(step: number, total: number) {
  const set = new Set<number>();
  if (total === 0) return set;
  for (let i = 0; i < ACTIVE_COUNT; i++) {
    // Deterministic pseudo-shuffle so SSR and client agree on the first frame.
    set.add((step * 7 + i * 13 + 3) % total);
  }
  return set;
}

/** Greedy min-distance thinning so mobile dots never overlap. */
function thin(points: typeof US_PROVIDER_POINTS, minGap: number) {
  if (minGap <= 0) return points;
  const kept: typeof US_PROVIDER_POINTS = [];
  for (const p of points) {
    if (kept.every((k) => (k.x - p.x) ** 2 + (k.y - p.y) ** 2 > minGap * minGap)) {
      kept.push(p);
    }
  }
  return kept;
}

function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

type Tip = { label: string; sub: string; x: number; y: number; pinned: boolean };

export function UsProviderMap({ className }: { className?: string }) {
  const systemReduce = useReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const [userCalm, setUserCalm] = useState(false);
  const calm = Boolean(systemReduce) || userCalm;

  const [step, setStep] = useState(0);
  const [tip, setTip] = useState<Tip | null>(null);

  const points = useMemo(
    () => (isNarrow ? thin(US_PROVIDER_POINTS, MIN_GAP_MOBILE) : US_PROVIDER_POINTS),
    [isNarrow],
  );

  useEffect(() => {
    if (calm) return;
    const id = window.setInterval(() => setStep((s) => s + 1), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [calm]);

  const active = useMemo(() => pickActive(step, points.length), [step, points.length]);

  const [vw, vh] = useMemo(() => {
    const parts = US_VIEWBOX.split(" ").map(Number);
    return [parts[2] || 960, parts[3] || 600];
  }, []);

  const show = (t: Omit<Tip, "pinned">, pinned = false) =>
    setTip((prev) => (prev?.pinned && !pinned ? prev : { ...t, pinned }));
  const clear = () => setTip((prev) => (prev?.pinned ? prev : null));

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={US_VIEWBOX}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Map of the United States showing licensed provider coverage in all 50 states"
        onPointerLeave={() => setTip(null)}
      >
        <g>
          {US_STATE_PATHS.map((s, i) => {
            const hot = tip?.label === s.n;
            return (
              <motion.path
                key={s.n}
                d={s.d}
                tabIndex={0}
                role="button"
                aria-label={`${s.n}: licensed providers available`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{
                  duration: calm ? 0.35 : 0.7,
                  delay: calm ? 0 : 0.1 + i * 0.012,
                  ease: PB_EASE_SOFT,
                }}
                onPointerEnter={(e) =>
                  show({
                    label: s.n,
                    sub: "Licensed providers available",
                    x: (e.nativeEvent as PointerEvent).offsetX,
                    y: (e.nativeEvent as PointerEvent).offsetY,
                  })
                }
                onPointerLeave={clear}
                onClick={(e) =>
                  show(
                    {
                      label: s.n,
                      sub: "Licensed providers available",
                      x: (e.nativeEvent as PointerEvent).offsetX,
                      y: (e.nativeEvent as PointerEvent).offsetY,
                    },
                    true,
                  )
                }
                onFocus={() =>
                  show({ label: s.n, sub: "Licensed providers available", x: vw / 2, y: 24 }, true)
                }
                onBlur={() => setTip(null)}
                fill={
                  hot
                    ? "color-mix(in oklab, var(--color-marine) 26%, white)"
                    : "color-mix(in oklab, var(--color-marine) 11%, white)"
                }
                stroke={
                  hot
                    ? "color-mix(in oklab, var(--color-marine) 60%, white)"
                    : "color-mix(in oklab, var(--color-marine) 30%, white)"
                }
                strokeWidth={0.9}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer outline-none transition-[fill,stroke] duration-200"
              />
            );
          })}
        </g>

        <g>
          {points.map((p, i) => {
            const isActive = active.has(i);
            const pulsing = isActive && !calm;
            return (
              <motion.g
                key={p.n}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{
                  duration: calm ? 0.3 : 0.5,
                  delay: calm ? 0 : 0.5 + i * 0.026,
                  ease: PB_EASE_SOFT,
                }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                {pulsing && (
                  <>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill="var(--color-marine)"
                      initial={{ opacity: 0.35, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 3.2 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
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
                  animate={{ r: pulsing ? 4.2 : isNarrow ? 3.4 : 2.6 }}
                  transition={{ duration: calm ? 0 : 0.5, ease: PB_EASE_SOFT }}
                  stroke={isActive ? "rgba(255,255,255,0.75)" : "transparent"}
                  strokeWidth={1.6}
                  vectorEffect="non-scaling-stroke"
                />
                {/* Generous invisible hit area for touch. */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isNarrow ? 14 : 10}
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerEnter={(e) =>
                    show({
                      label: p.n.split(",")[0],
                      sub: `${p.n.split(",")[1] ?? ""} provider region`.trim(),
                      x: (e.nativeEvent as PointerEvent).offsetX,
                      y: (e.nativeEvent as PointerEvent).offsetY,
                    })
                  }
                  onPointerLeave={clear}
                  onClick={(e) =>
                    show(
                      {
                        label: p.n.split(",")[0],
                        sub: `${p.n.split(",")[1] ?? ""} provider region`.trim(),
                        x: (e.nativeEvent as PointerEvent).offsetX,
                        y: (e.nativeEvent as PointerEvent).offsetY,
                      },
                      true,
                    )
                  }
                />
              </motion.g>
            );
          })}
        </g>
      </svg>

      <AnimatePresence>
        {tip && (
          <motion.div
            key={`${tip.label}-${tip.pinned}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: calm ? 0.1 : 0.2, ease: PB_EASE_SOFT }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-[var(--color-hairline)] bg-white/95 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(16,24,40,0.10)] backdrop-blur"
            style={{
              left: `${Math.min(Math.max((tip.x / vw) * 100, 12), 88)}%`,
              top: `${Math.min(Math.max((tip.y / vh) * 100, 8), 96)}%`,
            }}
          >
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
              <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-marine)]" />
              {tip.label}
            </div>
            {tip.sub && <div className="pb-body mt-0.5 text-[10.5px]">{tip.sub}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setUserCalm((v) => !v)}
        aria-pressed={userCalm}
        className="absolute bottom-0 right-0 z-20 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-white/85 px-2.5 py-1 text-[10.5px] font-medium text-ink/70 backdrop-blur transition hover:text-ink"
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            calm ? "bg-ink/25" : "bg-[var(--color-marine)]",
          )}
        />
        {calm ? "Motion off" : "Reduce motion"}
      </button>
    </div>
  );
}

/**
 * Thin corner brackets used to frame the coverage blocks. Matches the reference
 * framing: 1px hairline arms, 14px long, inset from the block edge.
 */
export function Corners({
  tone = "hairline",
  inset = 12,
  size = 14,
}: {
  tone?: "hairline" | "marine";
  inset?: number;
  size?: number;
}) {
  const color =
    tone === "marine"
      ? "color-mix(in oklab, var(--color-marine) 45%, transparent)"
      : "var(--color-hairline)";
  const base = "pointer-events-none absolute border-current";
  const style = { width: size, height: size };
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10"
      style={{ color, inset }}
    >
      <span className={cn(base, "left-0 top-0 border-l border-t")} style={style} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} style={style} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} style={style} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} style={style} />
    </span>
  );
}
