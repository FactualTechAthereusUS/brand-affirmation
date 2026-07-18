import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowUpRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import iconStart from "@/assets/milestone-start.png.asset.json";
import iconProfile from "@/assets/milestone-profile.png.asset.json";
import iconHealth from "@/assets/milestone-health.png.asset.json";
import iconResults from "@/assets/milestone-results.png.asset.json";

/* ─────────────────────────  Progress bar with milestones  ───────────────────────── */
const MILESTONES = [
  { key: "start", label: "Start", icon: iconStart.url },
  { key: "profile", label: "Profile", icon: iconProfile.url },
  { key: "health", label: "Health", icon: iconHealth.url },
  { key: "results", label: "Results", icon: iconResults.url },
];

export function ProgressBar({ value }: { value: number }) {
  const v = Math.min(1, Math.max(0, value));
  // 3 segments between 4 nodes. Determine per-segment fill 0-1.
  const scaled = v * 3;

  return (
    <div className="w-full px-5 pt-2 pb-8 md:px-8 md:pb-9">
      <div className="flex items-center">
        {MILESTONES.map((m, i) => {
          const reached = v >= i / 3 - 0.001;
          const active =
            (i === 0 && v < 1 / 3) ||
            (i === 1 && v >= 1 / 3 && v < 2 / 3) ||
            (i === 2 && v >= 2 / 3 && v < 0.999) ||
            (i === 3 && v >= 0.999);

          return (
            <div key={m.key} className="flex flex-1 items-center last:flex-none">
              {/* Node */}
              <div className="relative shrink-0">
                <motion.div
                  className="relative grid place-items-center"
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {active && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-ever/35"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <motion.div
                    className={`relative grid h-[36px] w-[36px] place-items-center overflow-hidden rounded-full bg-white ring-[3px] transition-colors md:h-[42px] md:w-[42px] ${
                      reached
                        ? "ring-ever shadow-[0_4px_14px_rgba(238,114,115,0.4)]"
                        : "ring-ink/15"
                    }`}
                    animate={{
                      filter: reached ? "grayscale(0)" : "grayscale(1)",
                      opacity: reached ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.35 }}
                  >
                    <img
                      src={m.icon}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
                <span
                  className={`pointer-events-none absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap text-[10.5px] font-medium tracking-wide transition-colors md:text-[11.5px] ${
                    reached ? "text-ink/80" : "text-ink/40"
                  }`}
                >
                  {m.label}
                </span>
              </div>

              {/* Connector segment (skip after last node) */}
              {i < MILESTONES.length - 1 && (
                <div className="relative mx-1.5 h-[8px] flex-1 overflow-hidden rounded-full bg-ink/[0.08] md:h-[10px] md:mx-2">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ever to-[#f38a8b]"
                    initial={false}
                    animate={{
                      width: `${Math.max(0, Math.min(1, scaled - i)) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
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
      className={`group relative flex w-full items-center gap-4 rounded-2xl border px-5 text-left transition-all ${
        compact ? "py-3.5" : "py-4 md:py-5"
      } ${
        selected
          ? "border-ever bg-ever text-white shadow-[0_10px_28px_rgba(238,114,115,0.35)]"
          : "border-ink/10 bg-white hover:border-ink/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      }`}
    >
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
          selected ? "border-white bg-white text-ever" : "border-ink/25 bg-white text-transparent"
        }`}
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[15px] font-medium md:text-[16px] ${selected ? "text-white" : "text-ink"}`}>
          {label}
        </span>
        {sub && (
          <span className={`mt-0.5 block text-[13px] leading-[1.45] md:text-[14px] ${selected ? "text-white/80" : "text-ink/55"}`}>
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

function formatUSPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function PhoneField({
  label,
  value,
  onChange,
  placeholder = "(555) 123-4567",
  autoFocus,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[13px] font-medium text-ink/70">{label}</span>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <span className="inline-flex h-6 w-8 items-center justify-center overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/10">
            <svg viewBox="0 0 60 40" className="block h-full w-full" preserveAspectRatio="none" aria-label="United States">
              {Array.from({ length: 13 }).map((_, i) => (
                <rect key={i} x="0" y={i * (40 / 13)} width="60" height={40 / 13} fill={i % 2 === 0 ? "#b22234" : "#ffffff"} />
              ))}
              <rect x="0" y="0" width="24" height={7 * (40 / 13)} fill="#3c3b6e" />
              <g fill="#ffffff" fontSize="3" fontFamily="Arial" textAnchor="middle">
                {Array.from({ length: 5 }).map((_, r) =>
                  Array.from({ length: 6 }).map((_, c) => (
                    <text key={`${r}-${c}`} x={2 + c * 4} y={3 + r * 2.2}>★</text>
                  ))
                )}
              </g>
            </svg>
          </span>
          <span className="text-[15px] font-medium text-ink/60">+1</span>
        </div>
        <input
          type="tel"
          inputMode="tel"
          value={formatUSPhone(value)}
          onChange={(e) => onChange(formatUSPhone(e.target.value))}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-[56px] w-full rounded-2xl border border-ink/12 bg-white pl-[96px] pr-5 text-[16px] text-ink placeholder:text-ink/35 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] outline-none transition-all focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)]"
        />

      </div>
    </label>
  );
}

/* ─────────────────────────  State selector with flags  ───────────────────────── */
const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
  Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA",
  Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

function stringToHsl(str: string, s = 55, l = 52) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash % 360);
  return `hsl(${h} ${s}% ${l}%)`;
}

function StateFlag({ state, className = "" }: { state: string; className?: string }) {
  const abbr = STATE_ABBR[state] ?? state.slice(0, 2).toUpperCase();
  const bg = stringToHsl(state);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-ink/8 shadow-sm ${className}`}
      style={{ background: bg }}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 28"
        className="absolute inset-0 h-full w-full opacity-25"
        preserveAspectRatio="none"
      >
        <path
          d="M0 14 Q10 8 20 14 T40 14 V28 H0 Z"
          fill="rgba(255,255,255,0.35)"
        />
      </svg>
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-tight text-white">
        {abbr}
      </span>
    </span>
  );
}

export function StateSelect({
  label,
  value,
  onChange,
  states,
  placeholder = "Select your state",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  states: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return states;
    return states.filter((s) => s.toLowerCase().includes(q));
  }, [states, query]);

  const selectedLabel = value || placeholder;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <span className="mb-2 block text-[13px] font-medium text-ink/70">{label}</span>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[56px] w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 text-left outline-none transition-all focus:border-ever/70 focus:shadow-[0_0_0_4px_rgba(238,114,115,0.15)] ${
          open ? "border-ever shadow-[0_0_0_4px_rgba(238,114,115,0.15)]" : "border-ink/12"
        }`}
      >
        <span
          className={`truncate text-[16px] ${
            value ? "text-ink" : "text-ink/40"
          }`}
        >
          {selectedLabel}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-ink/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.14)]"
          >
            <div className="border-b border-ink/6 p-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search state..."
                autoFocus
                className="h-10 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-3 text-[14px] text-ink placeholder:text-ink/40 outline-none focus:border-ever/60"
              />
            </div>
            <div className="max-h-[260px] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-[14px] text-ink/50">
                  No states found
                </div>
              ) : (
                filtered.map((s: string) => {
                  const active = s === value;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        onChange(s);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active ? "bg-ever/10" : "hover:bg-ink/[0.03]"
                      }`}
                    >
                      <span
                        className={`flex-1 truncate text-[15px] ${
                          active ? "font-semibold text-ink" : "text-ink/80"
                        }`}
                      >
                        {s}
                      </span>
                      {active && (
                        <Check className="h-4 w-4 shrink-0 text-ever" strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
