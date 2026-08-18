import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";

/**
 * Product screenshot frame. When `image` is null it renders a framed
 * placeholder at the same aspect ratio, so dropping a real screenshot in later
 * is a one-line change in the content file.
 */
export function Shot({
  image,
  slot,
  ratio = "16 / 9",
  className,
  liquid = false,
  rounded = 24,
}: {
  image: string | null;
  slot: string;
  ratio?: string;
  className?: string;
  liquid?: boolean;
  rounded?: number;
}) {
  const inner = (
    <div
      className={cn("relative w-full overflow-hidden", !liquid && "pb-card")}
      style={{ aspectRatio: ratio, borderRadius: rounded }}
    >
      {image ? (
        <img
          src={image}
          alt={slot}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="pb-dotgrid flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--color-mist)]">
          <span className="grid size-9 place-items-center rounded-full border border-[var(--color-hairline)] bg-canvas">
            <svg viewBox="0 0 24 24" className="size-4 text-[var(--color-marine)]" fill="none">
              <path
                d="M4 6h16v12H4zM4 14l4-4 4 4 3-3 5 5"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="pb-micro text-center">{slot}</span>
          <span className="pb-micro opacity-60">Screenshot slot</span>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: PB_EASE_SOFT }}
      className={className}
    >
      {liquid ? <div className="pb-liquid">{inner}</div> : inner}
    </motion.div>
  );
}

/** Horizontal tab rail with a sliding liquid-glass pill behind the active tab. */
export function TabRail({
  tabs,
  active,
  onSelect,
  className,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "no-scrollbar mx-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[var(--color-hairline)] bg-[color-mix(in_oklab,white_70%,transparent)] p-1.5 backdrop-blur-xl",
        className,
      )}
    >
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
              on ? "text-white" : "text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] hover:text-ink",
            )}
          >
            {on ? (
              <motion.span
                layoutId="pb-tabrail"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-ink shadow-[0_8px_20px_-10px_rgba(10,10,10,0.6)]"
              />
            ) : null}
            <span className="relative z-10 whitespace-nowrap">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
