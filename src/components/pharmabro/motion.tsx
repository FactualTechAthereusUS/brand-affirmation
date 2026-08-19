/**
 * Shared motion grammar for the PharmaBro site, lifted from the Sunbeam and
 * Valeryn references: long soft eases, small vertical travel, tiny rotation on
 * headline lines, and staggered groups that never exceed 0.1s per child.
 */
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Valeryn's hero ease and the Sunbeam standard ease. */
export const PB_EASE = [0.05, 0.58, 0.56, 1] as const;
export const PB_EASE_SOFT = [0, 0.82, 0.56, 1] as const;
/** Standard scroll ease used site-wide. */
export const PB_EASE_STD = [0.4, 0, 0.2, 1] as const;

/** True on >= 768px viewports. Scroll motion is disabled below that. */
export function useDesktopMotion() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return desktop;
}

/** Hero headline: word-by-word blur reveal, 60ms stagger. */
export function WordsReveal({
  text,
  delay = 0,
  className,
  children,
}: {
  text: string;
  delay?: number;
  className?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: delay + i * 0.06, ease: PB_EASE_STD }}
          className="inline-block whitespace-pre"
        >
          {w === "\u0000" ? children : w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

function useShown<T extends HTMLElement>(margin: any = "0px 0px -20% 0px") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: 0, margin });
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), 900);
    return () => window.clearTimeout(id);
  }, []);
  return { ref, shown: inView || fallback };
}


/** Headline line: rises with a hair of counter rotation over 1.2s. */
export function HeroLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={cn("block", className)}>{children}</span>;
  return (
    <motion.span
      initial={{ opacity: 0, y: 40, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.2, delay, ease: PB_EASE }}
      className={cn("block origin-left", className)}
    >
      {children}
    </motion.span>
  );
}

/** Section entrance used across the page. Travel is deliberately small. */
export function Rise({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useShown<HTMLDivElement>();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay, ease: PB_EASE_SOFT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Kinetic rule: a hairline that draws itself left to right as the section
 * enters. Sunbeam uses this instead of a heavy divider.
 */
export function KineticRule({ className }: { className?: string }) {
  const { ref, shown } = useShown<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("h-px w-full overflow-hidden", className)}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={shown ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.1, ease: PB_EASE_SOFT }}
        className="h-px w-full origin-left bg-[var(--color-hairline)]"
      />
    </div>
  );
}

/**
 * Infinite logo marquee. Duplicated track so the loop is seamless; pauses on
 * hover and stops entirely under reduced motion.
 */
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
