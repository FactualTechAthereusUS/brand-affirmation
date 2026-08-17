import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_GROUPS, ANNOUNCEMENTS } from "@/lib/pharmabro/nav";
import { Btn, Container } from "./primitives";
import { cn } from "@/lib/utils";

export function PharmaBroWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-[6px] bg-ink text-[13px] font-bold text-white"
      >
        P
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">
        PharmaBro
      </span>
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
              className="flex items-center gap-2 text-center text-[12px] text-white/85 sm:text-[12.5px]"
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

export function PharmaBroNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>("Platform");
  const closeTimer = useRef<number | undefined>(undefined);

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
    <div className="sticky top-0 z-50">
      <AnnouncementBar />

      <div className="border-b border-[var(--color-hairline)] bg-canvas/85 backdrop-blur-xl">
        <Container size="full">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/pharmabro" aria-label="PharmaBro home">
              <PharmaBroWordmark />
            </Link>

            {/* desktop groups */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_GROUPS.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(g.label);
                  }}
                  onMouseLeave={scheduleClose}
                  onFocus={() => setOpen(g.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium transition-colors",
                    open === g.label
                      ? "bg-[var(--color-mist)] text-ink"
                      : "text-[color-mix(in_oklab,var(--color-ink)_66%,transparent)] hover:text-ink",
                  )}
                >
                  {g.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      open === g.label && "rotate-180",
                    )}
                  />
                </button>
              ))}
              <Link
                to="/pharmabro/pricing"
                className="rounded-full px-3 py-2 text-[14px] font-medium text-[color-mix(in_oklab,var(--color-ink)_66%,transparent)] transition-colors hover:text-ink"
              >
                Pricing
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/pharmabro/contact"
                className="hidden text-[14px] font-medium text-[color-mix(in_oklab,var(--color-ink)_66%,transparent)] transition-colors hover:text-ink sm:block"
              >
                Login
              </Link>
              <Btn to="/pharmabro/demo" className="hidden sm:inline-flex">
                Book a demo
              </Btn>
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMobile(true)}
                className="grid size-10 place-items-center rounded-full border border-[var(--color-hairline)] text-ink lg:hidden"
              >
                <Menu className="size-4.5" />
              </button>
            </div>
          </div>
        </Container>

        {/* desktop dropdown panel */}
        <AnimatePresence>
          {activeGroup ? (
            <motion.div
              key={activeGroup.label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-b border-[var(--color-hairline)] bg-canvas shadow-[0_18px_40px_-24px_rgba(10,10,10,0.22)] lg:block"
            >
              <Container size="full" className="py-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 xl:grid-cols-3">
                  {activeGroup.items.map((it) => (
                    <Link
                      key={it.to + it.label}
                      to={it.to}
                      onClick={() => setOpen(null)}
                      className="group flex items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--color-mist)]"
                    >
                      <span className="text-[14px] font-medium text-ink">
                        {it.label}
                      </span>
                      {it.note ? (
                        <span className="pb-micro shrink-0">{it.note}</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* mobile sheet */}
      <AnimatePresence>
        {mobile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-canvas lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-[var(--color-hairline)] px-5">
              <PharmaBroWordmark />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobile(false)}
                className="grid size-10 place-items-center rounded-full border border-[var(--color-hairline)] text-ink"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <div className="h-[calc(100dvh-4rem)] overflow-y-auto px-5 pb-28 pt-4">
              {NAV_GROUPS.map((g) => {
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
                      {g.label}
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
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
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3">
                            {g.items.map((it) => (
                              <Link
                                key={it.to + it.label}
                                to={it.to}
                                onClick={() => setMobile(false)}
                                className="block py-2.5 text-[15px] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]"
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
                className="block border-b border-[var(--color-hairline)] py-4 text-[16px] font-semibold text-ink"
              >
                Pricing
              </Link>

              <div className="mt-6 flex flex-col gap-2.5">
                <Btn to="/pharmabro/demo" size="lg">
                  Book a demo
                </Btn>
                <Btn to="/pharmabro/contact" variant="ghost" size="lg">
                  Login
                </Btn>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
