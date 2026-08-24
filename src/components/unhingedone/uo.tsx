/**
 * Unhinged One primitives — motion grammar, icons, and the typographic
 * "print tile" that stands in for garment photography. The product is the
 * payload, so the tile renders the payload as art rather than faking a photo.
 */
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const UO_EASE = [0.16, 1, 0.3, 1] as const;
export const UO_EASE_STD = [0.4, 0, 0.2, 1] as const;

/** Scroll reveal: 18px rise, soft blur out, once. */
export function Rise({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? undefined : { opacity: 0, y, filter: "blur(6px)" }}
      animate={
        reduce
          ? undefined
          : inView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y, filter: "blur(6px)" }
      }
      transition={{ duration: 0.72, delay, ease: UO_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word reveal for hero headlines. */
export function Words({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: delay + i * 0.055, ease: UO_EASE }}
          className="inline-block whitespace-pre"
        >
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

/** Section header: left title, right "View All" link. Comfrt's grammar. */
export function SectionHead({
  title,
  sub,
  action,
  onAction,
  className,
}: {
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div>
        <h2 className="uo-display text-[28px] leading-[0.95] sm:text-[38px] md:text-[46px]">{title}</h2>
        {sub ? <p className="mt-2 max-w-xl text-[13px] text-ink/55 md:text-[14px]">{sub}</p> : null}
      </div>
      {action ? (
        <button
          type="button"
          onClick={onAction}
          className="uo-link shrink-0 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- icons */

export function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.75" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeart({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className} aria-hidden="true">
      <path
        d="M12 20s-7.5-4.4-7.5-9.3A4.2 4.2 0 0 1 12 7.9a4.2 4.2 0 0 1 7.5 2.8C19.5 15.6 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 8h14l-1.2 12H6.2L5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8V6.6a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconArrow({ className, dir = "right" }: { className?: string; dir?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className, dir === "left" && "rotate-180")}
      aria-hidden="true"
    >
      <path d="M4 12h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-[3px]", className)} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[13px] w-[13px] text-uo-red" fill="currentColor" aria-hidden="true">
          <path d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.8-5.1 2.8 1-5.7-4.1-4 5.7-.8L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- print tile */

const TONE: Record<"red" | "ink" | "cream", { bg: string; fg: string }> = {
  red: { bg: "bg-[#efe9dd]", fg: "text-uo-red" },
  ink: { bg: "bg-[#141414]", fg: "text-[#efe9dd]" },
  cream: { bg: "bg-[#e3ded2]", fg: "text-ink" },
};

/**
 * Stands in for a garment shot: a cotton-toned field with the payload set in
 * heavy condensed type, plus a stitched neckline arc so it reads as a crewneck.
 */
export function PrintTile({
  print,
  tone = "red",
  ratio = "aspect-[4/5]",
  className,
  size = "md",
}: {
  print: string;
  tone?: "red" | "ink" | "cream";
  ratio?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = TONE[tone];
  return (
    <div className={cn("uo-grain relative w-full overflow-hidden", ratio, t.bg, className)}>
      {/* neckline */}
      <div className="absolute left-1/2 top-0 h-[9%] w-[34%] -translate-x-1/2 rounded-b-full border-b border-current opacity-15" />
      <div className="absolute inset-0 flex items-center justify-center px-[10%]">
        <p
          className={cn(
            "uo-print text-center",
            t.fg,
            size === "sm" && "text-[15px] leading-[0.92] sm:text-[18px]",
            size === "md" && "text-[22px] leading-[0.9] sm:text-[26px] md:text-[30px]",
            size === "lg" && "text-[30px] leading-[0.88] sm:text-[44px] md:text-[56px]",
          )}
        >
          {print}
        </p>
      </div>
      {/* cuff hairlines */}
      <div className="absolute inset-x-0 bottom-0 h-[7%] border-t border-current opacity-10" />
    </div>
  );
}

/** Infinite marquee row. Duplicates children so the loop is seamless. */
export function Marquee({
  children,
  speed = 26,
  className,
  reverse,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn("flex shrink-0 items-center", reverse ? "uo-marquee-rev" : "uo-marquee")}
          style={{ animationDuration: `${speed}s` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/** Horizontal snap rail with desktop arrow controls. */
export function Rail({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className={cn(
          "uo-noscroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:gap-5",
          contentClassName,
        )}
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={edge.start}
          aria-label="Previous"
          className="pointer-events-auto -translate-x-4 rounded-full border border-ink/12 bg-canvas/90 p-2.5 text-ink shadow-[0_10px_30px_-14px_rgba(0,0,0,0.4)] backdrop-blur transition disabled:opacity-0"
        >
          <IconArrow dir="left" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={edge.end}
          aria-label="Next"
          className="pointer-events-auto translate-x-4 rounded-full border border-ink/12 bg-canvas/90 p-2.5 text-ink shadow-[0_10px_30px_-14px_rgba(0,0,0,0.4)] backdrop-blur transition disabled:opacity-0"
        >
          <IconArrow className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
