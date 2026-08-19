import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PB_EASE_SOFT } from "@/components/pharmabro/motion";
import { Mock, type MockKind } from "./Mocks";

/**
 * Product visual frame. When `image` is null it renders a coded interface mock
 * (Rimo/Cuvo style) rather than a screenshot placeholder, so each section reads
 * differently instead of showing the same dashboard again.
 */
export function Shot({
  image,
  slot,
  ratio = "16 / 9",
  className,
  liquid = false,
  rounded = 24,
  mock = "operations",
}: {
  image: string | null;
  slot: string;
  ratio?: string;
  className?: string;
  liquid?: boolean;
  rounded?: number;
  mock?: MockKind;
}) {
  if (!image && mock === "operations") {
    return (
      <motion.img
        src="/assets/pharmabro-operations-dashboard.png"
        alt="PharmaBro live operations dashboard with real-time patient activity and global session map"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, y: 22, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: PB_EASE_SOFT }}
        className={cn("block h-auto w-full", className)}
      />
    );
  }

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
        <Mock kind={mock} />
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
