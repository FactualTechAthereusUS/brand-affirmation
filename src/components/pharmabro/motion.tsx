/**
 * PharmaBro motion system. The values here are the spec's real numbers:
 * one ease, small travel, fire-once, and nothing at all under
 * prefers-reduced-motion.
 *
 *   EASE            cubic-bezier(0.4, 0, 0.2, 1)
 *   HERO TEXT       opacity 0.001 -> 1, 600ms, delays 0.4s / 0.6s
 *   HERO VISUAL     y 200 -> 0, scale 0.8 -> 1, 500ms
 *   SECTION REVEAL  y 40 -> 0, 500ms, 80ms stagger, 20% in view, once
 *   NUMBERS         count up 1200ms on first view, then hold
 */
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** The only ease used anywhere on the PharmaBro site. */
export const PB_EASE = [0.4, 0, 0.2, 1] as const;
/** Kept for older PharmaBro pages that still import the previous names. */
export const PB_EASE_SOFT = PB_EASE;

/**
 * Fires once when 20% of the element is in view. A mount-time fallback
 * guarantees content is never left invisible if the observer misses.
 */
function useShown<T extends HTMLElement>(amount = 0.2) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), 1200);
    return () => window.clearTimeout(id);
  }, []);
  return { ref, shown: inView || fallback };
}

/* ------------------------------------------------------------------- hero */

/** Hero copy: opacity only, 600ms, staggered by explicit delay. */
export function HeroText({
  children,
  delay = 0.4,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0.001 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: PB_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** The one element allowed to travel further than 40px. */
export function HeroVisual({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0.001, y: 200, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: PB_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Kept for pages still importing the previous hero helper. */
export function HeroLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <HeroText delay={delay} className={cn("block", className)}>
      {children}
    </HeroText>
  );
}

/* ----------------------------------------------------------------- reveal */

/** y 40 -> 0, 500ms, once. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useShown<HTMLDivElement>();
  const Tag = motion[as] as typeof motion.div;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0.001, y: 40 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay, ease: PB_EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Older alias. */
export const Rise = Reveal;

/** Parent that reveals its children with an 80ms stagger. */
export function Stagger({
  children,
  className,
  step = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useShown<HTMLDivElement>();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shown ? "shown" : "hidden"}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0.001, y: 40 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: PB_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ rules */

/** Horizontal hairline that draws left to right, 600ms, once. */
export function DrawRule({ className }: { className?: string }) {
  const { ref, shown } = useShown<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("h-px w-full overflow-hidden", className)}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={shown ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.6, ease: PB_EASE }}
        className="h-px w-full origin-left bg-[var(--color-hairline)]"
      />
    </div>
  );
}

/** Older alias. */
export const KineticRule = DrawRule;

/**
 * Vertical rail whose accent fill is tied to scroll position through the
 * section it wraps. Used by the seven-day timeline.
 */
export function ScrollRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleY = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} className="relative pl-6 sm:pl-10">
      <div className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-[var(--color-hairline)]">
        <motion.div
          style={{ scaleY }}
          className="h-full w-px origin-top bg-[var(--color-marine)]"
        />
      </div>
      {children}
    </div>
  );
}

/** Bar that grows left to right, 800ms, staggered by delay. */
export function GrowBar({
  width,
  delay = 0,
  className,
  style,
}: {
  width: string;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useShown<HTMLDivElement>();
  return (
    <div ref={ref} className="w-full">
      <motion.div
        initial={reduce ? { width } : { width: 0 }}
        animate={shown ? { width } : undefined}
        transition={{ duration: 0.8, delay, ease: PB_EASE }}
        className={className}
        style={style}
      />
    </div>
  );
}

/** Counts up once over 1200ms on first view, then holds. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useShown<HTMLSpanElement>(0.4);
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!shown || reduce) return;
    const controls = animate(0, to, {
      duration: 1.2,
      ease: PB_EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [shown, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------- marquee */

export function Marquee({
  items,
  speed = 38,
}: {
  items: readonly string[];
  speed?: number;
}) {
  const track = [...items, ...items];
  return (
    <div className="pb-marquee group relative overflow-hidden">
      <div
        className="pb-marquee-track flex w-max items-center gap-x-14"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="shrink-0 text-[16px] font-semibold tracking-[-0.02em] text-[color-mix(in_oklab,var(--color-ink)_36%,transparent)] transition-colors hover:text-ink"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
