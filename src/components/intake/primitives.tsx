import { motion } from "motion/react";
import { Check, ArrowUpRight, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/* ─────────────────────────  Progress bar  ───────────────────────── */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-[10px] w-full overflow-hidden rounded-full bg-ink/[0.08] md:h-[12px]">
      <motion.div
        className="h-full rounded-full bg-ever"
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(4, value * 100))}%` }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
      />
    </div>
  );
}

/* ─────────────────────────  Screen shell  ───────────────────────── */
export function ScreenShell({
  title,
  sub,
  children,
  footer,
  compact = false,
}: {
  title?: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-[640px] flex-1 flex-col"
    >
      {title && (
        <h1
          className={`font-hero font-bold tracking-[-0.03em] text-ink ${
            compact ? "text-[24px] md:text-[30px]" : "text-[28px] leading-[1.1] md:text-[40px]"
          }`}
        >
          {title}
        </h1>
      )}
      {sub && (
        <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-ink/60 md:text-[16px]">
          {sub}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 md:mt-10">{children}</div>
      {footer && <div className="mt-8">{footer}</div>}
    </motion.div>
  );
}

/* ─────────────────────────  Primary button  ───────────────────────── */
export function PrimaryButton({
  children = "Continue",
  onClick,
  disabled,
  type = "button",
}: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className="group inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-canvas shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 md:h-[60px] md:w-auto md:min-w-[220px]"
    >
      {children}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 group-disabled:rotate-0"
        strokeWidth={2}
      />
    </motion.button>
  );
}

/* ─────────────────────────  Option card (single/multi)  ───────────────────────── */
export function OptionCard({
  label,
  sub,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`group relative flex w-full items-center gap-4 rounded-2xl border bg-white px-5 text-left transition-all ${
        compact ? "py-3.5" : "py-4 md:py-5"
      } ${
        selected
          ? "border-ever/70 bg-ever/[0.04] shadow-[0_0_0_3px_rgba(238,114,115,0.12)]"
          : "border-ink/10 hover:border-ink/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      }`}
    >
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
          selected ? "border-ever bg-ever text-white" : "border-ink/25 bg-white text-transparent"
        }`}
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink md:text-[16px]">{label}</span>
        {sub && (
          <span className="mt-0.5 block text-[13px] leading-[1.45] text-ink/55 md:text-[14px]">
            {sub}
          </span>
        )}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────  Category card (image bg)  ───────────────────────── */
export function CategoryCard({
  tag,
  title,
  sub,
  image,
  position = "object-center",
  onClick,
}: {
  tag: string;
  title: string;
  sub: string;
  image: string;
  position?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="group relative block aspect-[5/3] w-full overflow-hidden rounded-3xl text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_18px_44px_rgba(0,0,0,0.14)]"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${position}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(23,23,23,0.55)_78%,rgba(23,23,23,0.92)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 md:p-6">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/80 md:text-[11px]">
          {tag}
        </span>
        <span className="mt-1 font-sans text-[24px] leading-tight tracking-[-0.01em] text-white md:text-[28px]">
          {title}
        </span>
        <span className="mt-1 line-clamp-2 max-w-[92%] text-[13px] leading-[1.45] text-white/75 md:text-[14px]">
          {sub}
        </span>
      </div>
      <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-11 md:w-11">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </div>
    </motion.button>
  );
}


/* ─────────────────────────  Text input  ───────────────────────── */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "number";
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[13px] font-medium text-ink/70">{label}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-[56px] w-full rounded-2xl border border-ink/12 bg-white px-5 text-[16px] text-ink placeholder:text-ink/35 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] outline-none transition-all focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
      />
    </label>
  );
}

/* ─────────────────────────  Back button  ───────────────────────── */
export function BackBtn({ onClick, invisible }: { onClick: () => void; invisible?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:border-ink/25 hover:text-ink ${
        invisible ? "invisible" : ""
      }`}
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
      Back
    </button>
  );
}
