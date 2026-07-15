import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/blissley-logo.png.asset.json";

const links = [
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
      <header className="sticky top-0 z-50 h-[60px] bg-canvas">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center">
            <img src={logo.url} alt="Blissley" className="h-6 w-auto md:h-7" />
          </a>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {links.slice(0, 6).map((l) => (
              <a
                key={l}
                href="#"
                className="text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button className="h-11 rounded-full bg-ink px-5 text-[13px] font-medium text-canvas transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Start Assessment
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink lg:hidden"
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
              <img
                src={logo.url}
                alt="Blissley"
                className="h-6 w-auto invert"
              />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-canvas"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <nav className="mt-14 flex flex-1 flex-col gap-6">
              {links.map((l, i) => (
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
              Start Assessment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
