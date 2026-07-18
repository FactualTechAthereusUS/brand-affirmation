import { motion } from "motion/react";
import { Check, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";

/* ─────────  Palette (Blissley Pink)  ───────── */
export const NAVY = "#ee7273";
export const NAVY_SOFT = "#f4a3a4";


/* ─────────  Radio circle (mobile card selector)  ───────── */
function RadioCircle({ on }: { on: boolean }) {
  return (
    <span
      className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-colors"
      style={{
        borderColor: on ? NAVY : "rgba(238,114,115,0.25)",
        background: on ? NAVY : "transparent",
      }}
      aria-hidden
    >
      {on && <span className="h-2 w-2 rounded-full bg-white" />}
    </span>
  );
}

/* ─────────  Highlighted headline  ─────────
   Wrap phrases in {{…}} to render them in lighter blue. */
export function TrxHeadline({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g).filter(Boolean);
  return (
    <h1
      className={`font-hero font-semibold leading-[1.15] tracking-[-0.01em] text-[26px] md:text-[34px] ${className}`}
      style={{ color: NAVY }}
    >
      {parts.map((p, i) =>
        p.startsWith("{{") ? (
          <span key={i} style={{ color: NAVY_SOFT }}>
            {p.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </h1>
  );
}

/* ─────────  Screen shell  ───────── */
export function TrxScreen({
  title,
  sub,
  children,
  footer,
}: {
  title?: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-[720px] flex-1 flex-col"
    >
      {title && <TrxHeadline text={title} />}
      {sub && (
        <p className="mt-3 text-[15.5px] leading-[1.55] text-ink/75 md:text-[16.5px]">
          {sub}
        </p>
      )}
      <div className="mt-7 flex flex-col gap-3 md:mt-9">{children}</div>
      {footer && <div className="mt-8">{footer}</div>}
    </motion.div>
  );
}

/* ─────────  Primary (navy pill)  ───────── */
export function TrxButton({
  children = "Next →",
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
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className="inline-flex h-[58px] w-full items-center justify-center rounded-full px-6 text-[15.5px] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: NAVY, boxShadow: "0 12px 30px rgba(238,114,115,0.28)" }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────  Tiny square checkbox (matches trimrx)  ───────── */
function CheckSquare({ on }: { on: boolean }) {
  return (
    <span
      className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] border transition-colors"
      style={{
        borderColor: on ? NAVY : "rgba(238,114,115,0.25)",
        background: on ? NAVY : "rgba(238,114,115,0.06)",
      }}
      aria-hidden
    >
      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.2} />}
    </span>
  );
}

/* ─────────  Text option (row card w/ checkbox)  ───────── */
export function TrxOption({
  label,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      className={`flex w-full items-center gap-3.5 rounded-xl border bg-white px-4 text-left transition-all ${
        compact ? "py-3" : "py-4"
      }`}
      style={{
        borderColor: selected ? NAVY : "rgba(23,23,23,0.10)",
        boxShadow: selected
          ? "0 8px 24px rgba(238,114,115,0.12)"
          : "0 1px 0 rgba(0,0,0,0.02)",
      }}
    >
      <CheckSquare on={selected} />
      <span className="min-w-0 flex-1 text-[15px] font-medium text-ink md:text-[15.5px]">
        {label}
      </span>
    </motion.button>
  );
}

/* ─────────  Icon option (icon top + checkbox+label bottom)  ───────── */
export function TrxIconOption({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="flex aspect-square w-full flex-col justify-between rounded-2xl border bg-white p-4 transition-all"
      style={{
        borderColor: selected ? NAVY : "rgba(23,23,23,0.10)",
        boxShadow: selected
          ? "0 10px 28px rgba(238,114,115,0.14)"
          : "0 1px 0 rgba(0,0,0,0.02)",
      }}
    >
      <div className="flex flex-1 items-center justify-center" style={{ color: NAVY }}>
        <span className="[&_svg]:h-10 [&_svg]:w-10 md:[&_svg]:h-11 md:[&_svg]:w-11">
          {icon}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <RadioCircle on={selected} />
        <span className="text-left text-[13.5px] font-medium leading-tight text-ink md:text-[14px]">
          {label}
        </span>
      </div>
    </motion.button>
  );
}

/* ─────────  Text field (label above, thin border)  ───────── */
export function TrxField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email" | "tel";
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[14px] font-medium" style={{ color: NAVY }}>
          {label}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[52px] w-full rounded-lg border bg-white px-4 text-[16px] text-ink placeholder:text-ink/30 outline-none transition-all"
        style={{ borderColor: "rgba(23,23,23,0.15)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(23,23,23,0.15)")}
      />
    </label>
  );
}

/* ─────────  Circle stepper (Start · Preliminary · Health · Details · Eligibility)  ───────── */
const STAGES = ["Start", "Preliminary", "Health", "Details", "Eligibility"] as const;

export function TrxStepper({ stage }: { stage: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[860px] items-center">
      {STAGES.map((label, i) => {
        const done = i < stage;
        const active = i === stage;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex shrink-0 items-center gap-2">
              <span
                className="relative grid h-[22px] w-[22px] place-items-center rounded-full border-2 transition-all md:h-[24px] md:w-[24px]"
                style={{
                  borderColor: done || active ? NAVY : "rgba(23,23,23,0.20)",
                  background: done ? NAVY : "transparent",
                }}
                aria-hidden
              >
                {done && <Check className="h-3 w-3 text-white" strokeWidth={3.4} />}
                {active && (
                  <span
                    className="block h-2 w-2 rounded-full"
                    style={{ background: NAVY }}
                  />
                )}
              </span>
              <span
                className={`whitespace-nowrap text-[11.5px] font-medium tracking-tight md:text-[13px] ${
                  active
                    ? "font-semibold"
                    : done
                      ? "text-ink/60"
                      : "text-ink/35"
                }`}
                style={active ? { color: NAVY } : undefined}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{active ? label : ""}</span>
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span
                className="mx-2 h-px flex-1 md:mx-3"
                style={{
                  background: done
                    ? NAVY
                    : "rgba(23,23,23,0.18)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────  Header (TrimRx intake header SVG)  ───────── */
export function TrxHeader({
  onBack,
  showBack,
}: {
  onBack: () => void;
  showBack: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[1080px] px-4 py-4 md:px-8 md:py-6">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink md:left-4"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="mx-auto flex items-center justify-center">
        <img
          src={blissleyLogo.url}
          alt="Blissley"
          className="block h-9 w-auto sm:h-11 md:h-14"
        />
      </div>


    </div>

  );
}
