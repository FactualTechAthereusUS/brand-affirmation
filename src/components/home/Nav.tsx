import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/blissley-logo.png.asset.json";

const links = [
  { label: "Treatments", hasMenu: true },
  { label: "Medications", hasMenu: false },
  { label: "Resources", hasMenu: true },
  { label: "Who We Are", hasMenu: true },
  { label: "About", hasMenu: false },
];

const mobileLinks = [
  "Treatments",
  "Weight Loss",
  "Skin",
  "Sexual Health",
  "Longevity",
  "About",
  "Insights",
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-[36px] z-40">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:h-[88px] md:px-8">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo.url} alt="Blissley" className="h-6 w-auto brightness-0 invert md:h-7" />
          </a>

          {/* Center liquid pill — wider, softer border */}
          <nav className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_30px_-12px_rgba(0,0,0,0.25)] lg:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href="#"
                className="group inline-flex items-center gap-1 rounded-full px-5 py-2 text-[14px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
                {l.hasMenu && (
                  <ChevronDown
                    className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-y-0.5"
                    strokeWidth={2}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="#"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-white/90 transition-colors hover:text-white"
            >
              Login
            </a>
            <button className="rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Get started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
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
            <div className="flex items-center justify-between">
              <img src={logo.url} alt="Blissley" className="h-6 w-auto invert" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-canvas"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <nav className="mt-14 flex flex-1 flex-col gap-6">
              {mobileLinks.map((l, i) => (
                <motion.a
                  key={l}
                  href="#"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.5 }}
                  className="font-display text-[26px] text-canvas"
                  onClick={() => setOpen(false)}
                >
                  {l}
                </motion.a>
              ))}
            </nav>

            <button className="h-14 w-full rounded-full bg-canvas text-[15px] font-medium text-ink">
              Get started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
