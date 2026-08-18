import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_GROUPS } from "@/lib/pharmabro/nav";
import { HOME_ANNOUNCEMENT } from "@/lib/pharmabro/home";
import { cn } from "@/lib/utils";

const MARK = "/assets/pharmabro-mark.png";
const WORDMARK = "/assets/pharmabro-wordmark.png";

export function PharmaBroWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      <img
        src={WORDMARK}
        alt="PharmaBro"
        width={132}
        height={22}
        className="h-[22px] w-auto object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

/** Ink announcement bar. 40px tall, 13px, dismissible, dated link. */
function AnnouncementBar({ onHeight }: { onHeight: (h: number) => void }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    onHeight(open ? 40 : 0);
  }, [open, onHeight]);

  if (!open) return null;

  return (
    <div className="relative z-[55] flex h-10 items-center justify-center bg-ink px-10 text-white">
      <Link
        to={HOME_ANNOUNCEMENT.to}
        className="truncate text-[13px] text-white/85 transition-colors hover:text-white"
      >
        {HOME_ANNOUNCEMENT.text}
        <span aria-hidden className="ml-1.5">
          &rarr;
        </span>
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute right-3 grid size-6 place-items-center rounded-full text-white/60 transition-colors hover:text-white"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

/** Dropdown groups plus the two plain links the spec calls for. */
const GROUP_LABELS: Record<string, string> = {
  Platform: "Platform",
  Solutions: "Treatments",
  Resources: "Resources",
};
const DROPDOWNS = ["Platform", "Solutions", "Resources"];

export function PharmaBroNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>("Platform");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [barH, setBarH] = useState(40);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastY = useRef(0);
  const frame = useRef(0);

  /* Single passive listener, rAF guarded. Contract past 40px, hide on
     scroll down, return instantly on scroll up. */
  useEffect(() => {
    const read = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 160 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
      frame.current = 0;
    };
    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 150);
  };
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const activeGroup = NAV_GROUPS.find((g) => g.label === open);
  const groups = NAV_GROUPS.filter((g) => DROPDOWNS.includes(g.label));

  return (
    <>
      <AnnouncementBar onHeight={setBarH} />

      <div
        className="pointer-events-none fixed inset-x-0 z-50 px-3 sm:px-5"
        style={{
          top: scrolled ? 20 : barH + 20,
          transform: hidden ? "translateY(-120%)" : "translateY(0)",
          transition:
            "top 400ms var(--pb-ease), transform 300ms var(--pb-ease)",
        }}
      >
        <div
          className="pointer-events-auto relative mx-auto w-full"
          style={{
            maxWidth: scrolled ? 940 : 1180,
            transition: "max-width 400ms var(--pb-ease)",
          }}
          onMouseLeave={scheduleClose}
        >
          <div
            className="relative rounded-[999px]"
            style={{
              background: scrolled ? "rgba(255,255,255,0.72)" : "transparent",
              backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
              WebkitBackdropFilter: scrolled
                ? "blur(20px) saturate(180%)"
                : "none",
              border: `1px solid ${scrolled ? "rgba(0,0,0,0.06)" : "transparent"}`,
              boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.06)" : "none",
              transition:
                "background 400ms var(--pb-ease), box-shadow 400ms var(--pb-ease), border-color 400ms var(--pb-ease), backdrop-filter 400ms var(--pb-ease)",
            }}
          >
            <div className="flex h-14 items-center justify-between gap-3 pl-4 pr-2.5 sm:h-[60px]">
              <Link
                to="/pharmabro"
                aria-label="PharmaBro home"
                className="flex shrink-0 items-center"
                onClick={() => setOpen(null)}
              >
                <img
                  src={MARK}
                  alt="PharmaBro"
                  width={28}
                  height={28}
                  className="block size-7 shrink-0 object-contain mix-blend-multiply md:hidden"
                />
                <img
                  src={WORDMARK}
                  alt="PharmaBro"
                  width={180}
                  height={30}
                  className="hidden h-[30px] w-auto object-contain mix-blend-multiply md:block"
                />
              </Link>

              <nav className="hidden items-center gap-0.5 lg:flex">
                {groups.slice(0, 2).map((g) => (
                  <NavTrigger
                    key={g.label}
                    label={GROUP_LABELS[g.label] ?? g.label}
                    active={open === g.label}
                    onEnter={() => {
                      cancelClose();
                      setOpen(g.label);
                    }}
                  />
                ))}
                <PlainLink to="/pharmabro/pricing" onEnter={() => setOpen(null)}>
                  Pricing
                </PlainLink>
                <PlainLink to="/pharmabro/compare" onEnter={() => setOpen(null)}>
                  Compare
                </PlainLink>
                {groups.slice(2).map((g) => (
                  <NavTrigger
                    key={g.label}
                    label={GROUP_LABELS[g.label] ?? g.label}
                    active={open === g.label}
                    onEnter={() => {
                      cancelClose();
                      setOpen(g.label);
                    }}
                  />
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  to="/pharmabro/contact"
                  className="hidden text-[14px] font-medium text-[var(--color-bluebell)] transition-colors hover:text-ink sm:block"
                >
                  Log in
                </Link>
                <Link
                  to="/pharmabro/demo"
                  className="hidden rounded-full bg-ink px-4 py-2.5 text-[13.5px] font-medium text-white transition-transform duration-150 [transition-timing-function:var(--pb-ease)] hover:scale-[1.02] sm:inline-flex"
                >
                  Book a call
                </Link>
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setMobile(true)}
                  className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-[var(--pb-accent-soft)] lg:hidden"
                >
                  <Menu className="size-4.5" />
                </button>
              </div>
            </div>
          </div>

          {activeGroup ? (
            <div
              key={activeGroup.label}
              onMouseEnter={cancelClose}
              className="pb-drop absolute left-1/2 top-[calc(100%+10px)] hidden w-[min(720px,100%)] -translate-x-1/2 overflow-hidden rounded-[20px] border border-black/[0.06] bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)] lg:block"
              style={{
                animation: "pb-drop-in 200ms var(--pb-ease) both",
              }}
            >
              <div className="grid grid-cols-2 gap-1">
                {activeGroup.items.map((it) => (
                  <Link
                    key={it.to + it.label}
                    to={it.to}
                    onClick={() => setOpen(null)}
                    className="flex items-center justify-between gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-[var(--pb-accent-soft)]"
                  >
                    {it.label}
                    {it.note ? (
                      <span className="pb-label shrink-0">{it.note}</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* spacer so page content clears the floating header */}
      <div aria-hidden className="h-[72px] sm:h-[84px]" />

      {mobile ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/25"
            onClick={() => setMobile(false)}
          />
          <div className="absolute inset-x-3 top-3 max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <div className="flex h-14 items-center justify-between px-4">
              <img
                src={MARK}
                alt=""
                aria-hidden
                width={28}
                height={28}
                className="size-7 object-contain mix-blend-multiply"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobile(false)}
                className="grid size-9 place-items-center rounded-full text-ink"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto px-4 pb-5">
              {groups.map((g) => {
                const isOpen = mobileGroup === g.label;
                return (
                  <div
                    key={g.label}
                    className="border-b border-[var(--color-hairline)] py-1"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileGroup(isOpen ? null : g.label)}
                      className="flex w-full items-center justify-between py-3.5 text-left text-[16px] font-semibold text-ink"
                    >
                      {GROUP_LABELS[g.label] ?? g.label}
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-300 [transition-timing-function:var(--pb-ease)]",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className="pb-faq-panel"
                      data-open={isOpen ? "true" : "false"}
                    >
                      <div>
                        <div className="pb-3">
                          {g.items.map((it) => (
                            <Link
                              key={it.to + it.label}
                              to={it.to}
                              onClick={() => setMobile(false)}
                              className="block rounded-[12px] px-2 py-2.5 text-[15px] text-[var(--color-bluebell)]"
                            >
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link
                to="/pharmabro/pricing"
                onClick={() => setMobile(false)}
                className="block border-b border-[var(--color-hairline)] py-4 text-[16px] font-semibold text-ink"
              >
                Pricing
              </Link>
              <Link
                to="/pharmabro/compare"
                onClick={() => setMobile(false)}
                className="block py-4 text-[16px] font-semibold text-ink"
              >
                Compare
              </Link>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  to="/pharmabro/contact"
                  onClick={() => setMobile(false)}
                  className="text-[15px] font-medium text-[var(--color-bluebell)]"
                >
                  Log in
                </Link>
                <Link
                  to="/pharmabro/demo"
                  onClick={() => setMobile(false)}
                  className="rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white"
                >
                  Book a call
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function NavTrigger({
  label,
  active,
  onEnter,
}: {
  label: string;
  active: boolean;
  onEnter: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-200 [transition-timing-function:var(--pb-ease)]",
        active ? "text-ink" : "text-[var(--color-bluebell)] hover:text-ink",
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          "size-3.5 opacity-60 transition-transform duration-200 [transition-timing-function:var(--pb-ease)]",
          active && "rotate-180",
        )}
      />
    </button>
  );
}

function PlainLink({
  to,
  children,
  onEnter,
}: {
  to: string;
  children: React.ReactNode;
  onEnter: () => void;
}) {
  return (
    <Link
      to={to}
      onMouseEnter={onEnter}
      className="rounded-full px-3 py-2 text-[14px] font-medium text-[var(--color-bluebell)] transition-colors duration-200 [transition-timing-function:var(--pb-ease)] hover:text-ink"
    >
      {children}
    </Link>
  );
}
