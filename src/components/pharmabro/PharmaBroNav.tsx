import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { NAV_GROUPS, ANNOUNCEMENTS } from "@/lib/pharmabro/nav";
import { Container } from "./primitives";
import { cn } from "@/lib/utils";

const MARK = "/assets/pharmabro-mark.png";
const WORDMARK = "/assets/pharmabro-wordmark.png";

export function PharmaBroWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      <img
        src={WORDMARK}
        alt="PharmaBro"
        className="h-[22px] w-auto object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

/** Gradient announcement bar. Rotates between the two spec variants. */
function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((p) => (p + 1) % ANNOUNCEMENTS.length),
      7000,
    );
    return () => window.clearInterval(id);
  }, []);

  const a = ANNOUNCEMENTS[i];

  return (
    <div className="relative overflow-hidden bg-linear-to-r from-[#0a0a0a] via-[#12224d] to-[var(--color-marine)]">
      <Container size="full" className="relative">
        <div className="flex h-9 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full min-w-0 items-center justify-center gap-2 text-center text-[11.5px] text-white/85 sm:text-[12.5px]"
            >
              <span className="truncate">{a.text}</span>
              <Link
                to={a.to}
                className="hidden shrink-0 font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white sm:inline"
              >
                {a.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}

/** Black pill CTA with the arrow puck (Grovia pattern). */
function PillCta({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full bg-ink pl-4 pr-1.5 py-1.5 text-[13.5px] font-medium text-white shadow-[0_6px_18px_-8px_rgba(10,10,10,0.55)] transition-transform duration-200 hover:-translate-y-px",
        className,
      )}
    >
      {children}
      <span className="grid size-6 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5">
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

export function PharmaBroNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>("Platform");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = window.setTimeout(() => setMounted(true), 40);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(id);
    };
  }, []);


  // Small close delay so the pointer can travel from trigger to panel.
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
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

  return (
    <>
      <AnnouncementBar />

      {/* floating liquid-glass pill */}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5">
        <motion.div
          initial={{ y: -22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative mx-auto w-full max-w-[1180px]"
          onMouseLeave={scheduleClose}
        >
          <motion.div
            animate={{
              backgroundColor: scrolled
                ? "rgba(255,255,255,0.72)"
                : "rgba(255,255,255,0.9)",
              boxShadow: scrolled
                ? "0 18px 45px -22px rgba(10,10,10,0.35)"
                : "0 10px 30px -20px rgba(10,10,10,0.22)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative overflow-visible rounded-[999px] border border-white/60 ring-1 ring-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] backdrop-blur-2xl backdrop-saturate-150"
          >
            {/* specular top edge — the "liquid" cue */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-linear-to-r from-transparent via-white to-transparent opacity-90"
            />
            <div className="flex h-14 items-center justify-between gap-3 pl-3 pr-2 sm:h-[60px] sm:pl-4 sm:pr-2.5">
              <Link
                to="/pharmabro"
                aria-label="PharmaBro home"
                className="flex shrink-0 items-center gap-2.5"
                onClick={() => setOpen(null)}
              >
                <img
                  src={MARK}
                  alt=""
                  aria-hidden
                  className="size-7 shrink-0 object-contain mix-blend-multiply"
                />
                <span className="hidden h-px w-px sm:block sm:h-5 sm:w-px sm:bg-[var(--color-hairline)]" />
                <img
                  src={WORDMARK}
                  alt="PharmaBro"
                  className="hidden h-[18px] w-auto object-contain mix-blend-multiply sm:block"
                />
              </Link>

              {/* desktop groups */}
              <nav className="hidden items-center gap-0.5 lg:flex">
                {NAV_GROUPS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpen(g.label);
                    }}
                    onFocus={() => setOpen(g.label)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium transition-colors",
                      open === g.label
                        ? "bg-[color-mix(in_oklab,var(--color-ink)_6%,transparent)] text-ink"
                        : "text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-ink)_4%,transparent)] hover:text-ink",
                    )}
                  >
                    {g.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 opacity-70 transition-transform duration-300",
                        open === g.label && "rotate-180",
                      )}
                    />
                  </button>
                ))}
                <Link
                  to="/pharmabro/pricing"
                  onMouseEnter={() => setOpen(null)}
                  className="rounded-full px-3 py-2 text-[14px] font-medium text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-ink)_4%,transparent)] hover:text-ink"
                >
                  Pricing
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  to="/pharmabro/contact"
                  className="hidden text-[14px] font-medium text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] transition-colors hover:text-ink sm:block"
                >
                  Login
                </Link>
                <PillCta to="/pharmabro/demo" className="hidden sm:inline-flex">
                  Book a demo
                </PillCta>
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setMobile(true)}
                  className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-[color-mix(in_oklab,var(--color-ink)_6%,transparent)] lg:hidden"
                >
                  <Menu className="size-4.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* desktop dropdown panel, anchored under the pill */}
          <AnimatePresence>
            {activeGroup ? (
              <motion.div
                key={activeGroup.label}
                initial={{ opacity: 0, y: -10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={cancelClose}
                className="absolute left-1/2 top-[calc(100%+8px)] hidden w-[min(720px,100%)] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-3 shadow-[0_28px_60px_-30px_rgba(10,10,10,0.4)] ring-1 ring-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] backdrop-blur-2xl backdrop-saturate-150 lg:block"
              >
                <div className="grid grid-cols-2 gap-1">
                  {activeGroup.items.map((it, idx) => (
                    <motion.div
                      key={it.to + it.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.24,
                        delay: 0.02 * idx,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={it.to}
                        onClick={() => setOpen(null)}
                        className="group flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 transition-colors hover:bg-[color-mix(in_oklab,var(--color-ink)_5%,transparent)]"
                      >
                        <span className="text-[14px] font-medium text-ink">
                          {it.label}
                        </span>
                        {it.note ? (
                          <span className="pb-micro shrink-0">{it.note}</span>
                        ) : (
                          <ArrowRight className="size-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-45" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* spacer so page content clears the floating pill */}
      <div aria-hidden className="h-[68px] sm:h-[80px]" />

      {/* mobile sheet */}
      <AnimatePresence>
        {mobile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_28%,transparent)] backdrop-blur-sm"
              onClick={() => setMobile(false)}
            />
            <motion.div
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-3 max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_30px_70px_-30px_rgba(10,10,10,0.5)] ring-1 ring-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] backdrop-blur-2xl backdrop-saturate-150"
            >
              <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={MARK}
                    alt=""
                    aria-hidden
                    className="size-7 object-contain mix-blend-multiply"
                  />
                  <PharmaBroWordmark className="[&_img]:h-[18px] [&_img]:mix-blend-multiply" />
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobile(false)}
                  className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-[color-mix(in_oklab,var(--color-ink)_6%,transparent)]"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto px-4 pb-5">
                {NAV_GROUPS.map((g) => {
                  const isOpen = mobileGroup === g.label;
                  return (
                    <div
                      key={g.label}
                      className="border-b border-[var(--color-hairline)] py-1 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => setMobileGroup(isOpen ? null : g.label)}
                        className="flex w-full items-center justify-between py-3.5 text-left text-[16px] font-semibold text-ink"
                      >
                        {g.label}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-300",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.25,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3">
                              {g.items.map((it) => (
                                <Link
                                  key={it.to + it.label}
                                  to={it.to}
                                  onClick={() => setMobile(false)}
                                  className="block rounded-xl px-2 py-2.5 text-[15px] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-ink)_5%,transparent)]"
                                >
                                  {it.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <Link
                  to="/pharmabro/pricing"
                  onClick={() => setMobile(false)}
                  className="block border-t border-[var(--color-hairline)] py-4 text-[16px] font-semibold text-ink"
                >
                  Pricing
                </Link>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    to="/pharmabro/contact"
                    onClick={() => setMobile(false)}
                    className="text-[15px] font-medium text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)]"
                  >
                    Login
                  </Link>
                  <PillCta to="/pharmabro/demo">Book a demo</PillCta>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
