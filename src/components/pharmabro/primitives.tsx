import { motion, useInView, animate, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ layout */

export function Container({
  children,
  className,
  size = "wide",
}: {
  children: ReactNode;
  className?: string;
  size?: "prose" | "wide" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "prose" && "max-w-[720px]",
        size === "wide" && "max-w-[1180px]",
        size === "full" && "max-w-[1420px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section band. Separation comes from a background tone shift, not a border —
 * the reference sites never draw lines between sections.
 */
export function Section({
  children,
  className,
  band = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  band?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-28",
        band ? "bg-[var(--color-mist)]" : "bg-canvas",
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ motion */

export function Reveal({
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
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered list wrapper. Children animate in sequence as the group enters. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView || reduce ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: reduce ? 0 : stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Count-up on first view. `format` renders the running value. */
export function CountUp({
  to,
  duration = 1.7,
  format,
  className,
}: {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {format ? format(value) : Math.round(value).toLocaleString("en-US")}
    </span>
  );
}

/* ------------------------------------------------------------------- labels */

/** Monospace ALL-CAPS section eyebrow. */
export function MicroLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("pb-micro", className)}>{children}</div>;
}

/** Bask-style eyebrow: a tiny solid accent square, then the label. */
export function SquareEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-[1px] bg-[var(--color-marine)]"
      />
      <span className="pb-micro">{children}</span>
    </div>
  );
}

/**
 * Two-tone headline. First clause carries full ink, the rest drops to grey —
 * hierarchy inside a single sentence, no size change.
 */
export function TwoTone({
  lead,
  trail,
  as: Tag = "h2",
  className,
}: {
  lead: string;
  trail?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "text-balance font-semibold tracking-[-0.03em] text-ink",
        Tag === "h1"
          ? "text-[38px] leading-[1.06] sm:text-[54px] lg:text-[66px]"
          : "text-[27px] leading-[1.12] sm:text-[36px] lg:text-[43px]",
        className,
      )}
    >
      {lead}
      {trail ? <span className="pb-dim"> {trail}</span> : null}
    </Tag>
  );
}

/** Pill badge that sits above an H1. Optional trailing link chevron. */
export function Chip({
  children,
  to,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  to?: string;
  tone?: "neutral" | "live";
  className?: string;
}) {
  const inner = (
    <>
      {tone === "live" ? (
        <span className="relative flex size-1.5 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-check)] opacity-70" />
          <span className="relative size-1.5 rounded-full bg-[var(--color-check)]" />
        </span>
      ) : null}
      <span>{children}</span>
      {to ? <span aria-hidden className="pb-dim">→</span> : null}
    </>
  );

  const base = cn(
    "inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-ink shadow-[0_1px_2px_rgba(10,10,10,0.04)] transition-colors",
    to && "hover:border-[color-mix(in_oklab,var(--color-ink)_22%,transparent)]",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={base}>
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}

/* ------------------------------------------------------------------ buttons */

type BtnVariant = "primary" | "ghost" | "blue";

const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full text-[14.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-marine)] focus-visible:ring-offset-2 disabled:opacity-50";

const btnSizes = {
  md: "h-11 px-5",
  lg: "h-[52px] px-7 text-[15px]",
} as const;

const btnVariants: Record<BtnVariant, string> = {
  primary:
    "bg-ink text-white hover:bg-[color-mix(in_oklab,var(--color-ink)_86%,white)] active:scale-[0.985]",
  ghost:
    "border border-[var(--color-hairline)] bg-canvas text-ink hover:border-[color-mix(in_oklab,var(--color-ink)_28%,transparent)] hover:bg-[var(--color-mist)]",
  blue: "bg-[var(--color-marine)] text-white hover:bg-[color-mix(in_oklab,var(--color-marine)_88%,black)] active:scale-[0.985]",
};

export function Btn({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: BtnVariant;
  size?: keyof typeof btnSizes;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(btnBase, btnSizes[size], btnVariants[variant], className);

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------- table marks */

export function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-label="Included"
      role="img"
      className={cn("size-[15px] text-[var(--color-check)]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5 6.2 11.7 13 4.9" />
    </svg>
  );
}

export function Cross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-label="Not included"
      role="img"
      className={cn("size-[14px] text-[var(--color-ever)]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/**
 * Renders a comparison-table cell. "✓" and "✗" become marks; anything else
 * renders as a literal value, which persuades harder than a bare tick.
 */
export function Cell({
  value,
  own = false,
}: {
  value: string;
  own?: boolean;
}) {
  if (value === "✓") return <Check />;
  if (value === "✗") return <Cross />;
  if (value === "—")
    return <span className="pb-dim text-[13px]">—</span>;

  return (
    <span
      className={cn(
        "text-[13px] leading-snug",
        own
          ? "font-medium text-[var(--color-check)]"
          : "text-[color-mix(in_oklab,var(--color-ink)_58%,transparent)]",
      )}
    >
      {value}
    </span>
  );
}

/* ---------------------------------------------------------------- surfaces */

/** Clean white card, hairline border, 12px radius. No heavy dark cards. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-hairline)] bg-canvas p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Soft gradient pedestal that sits behind a product mockup (Rimo pattern). */
export function GradientPlate({
  children,
  tone = "blue",
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "mint" | "lilac" | "peach";
  className?: string;
}) {
  const tones = {
    blue: "from-[#dbe6ff] via-[#eef3ff] to-[#f4f7ff]",
    mint: "from-[#d6f5e6] via-[#e9f9f1] to-[#f2fbf7]",
    lilac: "from-[#e4ddff] via-[#efeaff] to-[#f6f3ff]",
    peach: "from-[#ffe4dc] via-[#fff0ea] to-[#fff7f4]",
  } as const;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-linear-to-br p-5 sm:p-8",
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
