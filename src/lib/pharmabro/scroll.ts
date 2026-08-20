/** Smooth in-page scrolling for the PharmaBro site (Lenis-aware). */

const HEADER_OFFSET = 96;

type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number; easing?: (t: number) => number },
  ) => void;
};

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;

  const top = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
  );

  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) {
    lenis.scrollTo(top, {
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }

  if (window.history?.replaceState) {
    window.history.replaceState(null, "", `#${id}`);
  }
  return true;
}
