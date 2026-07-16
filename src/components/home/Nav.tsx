import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/blissley-logo.png.asset.json";

const treatments: { label: string; href: string }[] = [
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Hair Loss", href: "#" },
  { label: "Skincare", href: "#" },
  { label: "Longevity", href: "#" },
  { label: "Mental Health", href: "#" },
  { label: "Menopause", href: "#" },
  { label: "Testosterone", href: "#" },
];

const links: { label: string; href: string; hasMenu: boolean; menu?: { label: string; href: string }[] }[] = [
  { label: "Treatments", href: "#", hasMenu: true, menu: treatments },
  { label: "Weight Loss", href: "/weight-loss", hasMenu: false },
  { label: "Skin", href: "#", hasMenu: false },
  { label: "Sexual Health", href: "#", hasMenu: false },
  { label: "About", href: "#", hasMenu: false },
  { label: "Insights", href: "#", hasMenu: false },
];

const mobileLinks: { label: string; href: string }[] = [
  { label: "Treatments", href: "#" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Skin", href: "#" },
  { label: "Sexual Health", href: "#" },
  { label: "Longevity", href: "#" },
  { label: "About", href: "#" },
  { label: "Insights", href: "#" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const header = document.querySelector("header");
    const announcement = document.getElementById("announcement-bar");

    const compute = () => {
      if (!hero) return 80;
      const headerHeight = header?.getBoundingClientRect().height ?? 76;
      const announcementHeight = announcement?.getBoundingClientRect().height ?? 36;
      // Blur only kicks in near the end of the hero section on all viewports.
      const offset = hero.offsetHeight - (headerHeight + announcementHeight + 40);
      return hero.offsetTop + offset;
    };

    const onScroll = () => setScrolled(window.scrollY > compute());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-[36px] z-40 transition-all duration-300 lg:bg-transparent ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl backdrop-saturate-150 lg:bg-transparent"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:h-[88px] md:px-8">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logo.url}
              alt="Blissley"
              className={`h-10 w-auto transition-[filter] duration-300 md:h-12 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
            />
          </a>

          {/* Center liquid pill — wider, softer border */}
          <nav
            className={`pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full px-3 py-2 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 lg:flex ${
              scrolled
                ? "border border-black/10 bg-white/60 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]"
                : "border border-white/25 bg-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.32)_inset]"
            }`}
          >
            {links.map((l) => (
              <div key={l.label} className="group/item relative">
                <a
                  href={l.href}
                  className={`inline-flex items-center gap-1 rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${
                    scrolled
                      ? "text-ink/80 hover:bg-black/5 hover:text-ink"
                      : "text-white/90 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {l.label}
                  {l.hasMenu && (
                    <ChevronDown
                      className="h-3.5 w-3.5 opacity-70 transition-transform group-hover/item:rotate-180"
                      strokeWidth={2}
                    />
                  )}
                </a>
                {l.hasMenu && l.menu && (
                  <div className="pointer-events-none absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover/item:pointer-events-auto group-hover/item:opacity-100">
                    <div
                      className={`min-w-[240px] rounded-3xl border p-2 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ${
                        scrolled
                          ? "border-black/10 bg-white/85"
                          : "border-white/20 bg-white/[0.12]"
                      }`}
                    >
                      {l.menu.map((m) => (
                        <a
                          key={m.label}
                          href={m.href}
                          className={`block rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors ${
                            scrolled
                              ? "text-ink/85 hover:bg-black/5 hover:text-ink"
                              : "text-white/90 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          {m.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="/login"
              className={`rounded-full px-5 py-2.5 text-[14px] font-medium backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${
                scrolled
                  ? "border border-black/10 bg-white/60 text-ink shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] hover:bg-white/80"
                  : "border border-white/25 bg-white/[0.08] text-white/95 shadow-[0_1px_0_rgba(255,255,255,0.32)_inset] hover:bg-white/[0.14]"
              }`}
            >
              Login
            </a>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-canvas"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile actions — liquid glass Get started + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#"
              className={`rounded-full px-5 py-2.5 text-[15px] font-medium backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
                scrolled
                  ? "bg-ink text-canvas shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                  : "border border-white/25 bg-white/[0.10] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
              }`}
            >
              Get started
            </a>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
                scrolled
                  ? "border border-black/10 bg-white text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.08)]"
                  : "border border-white/25 bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
              }`}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

        </div>
      </header>


      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink px-6 pb-8 pt-5"
          >
            {/* Ambient glow blobs behind the glass */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#ee7273]/25 blur-3xl" />
              <div className="absolute bottom-0 right-[-20%] h-80 w-80 rounded-full bg-[#ee7273]/15 blur-3xl" />
              <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative flex items-center justify-between">
              <img src={logo.url} alt="Blissley" className="h-9 w-auto invert" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/[0.08] text-canvas backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-white/[0.14]"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <nav className="relative mt-12 flex flex-1 flex-col gap-1">
              {mobileLinks.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.5 }}
                  className="font-sans text-[28px] tracking-[-0.01em] text-canvas/95 py-2 border-b border-white/[0.06]"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="relative flex items-center gap-3">
              <button className="h-14 flex-1 rounded-full bg-canvas text-[15px] font-medium text-ink shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-[1.01] active:scale-[0.99]">
                Start Assessment
              </button>
              <a href="/login" className="grid h-14 place-items-center rounded-full border border-white/20 bg-white/[0.08] px-7 text-[15px] font-medium text-canvas backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-white/[0.14]">
                Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
