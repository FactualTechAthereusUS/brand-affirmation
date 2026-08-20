/** Smooth in-page scrolling for the PharmaBro site (Lenis-aware). */

const HEADER_OFFSET = 96;

type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number; easing?: (t: number) => number },
  ) => void;
};

function easeOutExpo(t: number) {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

function glideTo(top: number, duration: number) {
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) {
    lenis.scrollTo(Math.max(0, top), { duration, easing: easeOutExpo });
  } else {
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }
}

function targetFor(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;

  glideTo(targetFor(el), 1.1);

  // Lazy media and mounting animations shift layout mid-flight, so nudge back
  // onto the section once things settle.
  [500, 1200, 1900].forEach((delay) =>
    window.setTimeout(() => {
      const node = document.getElementById(id);
      if (!node) return;
      const drift = node.getBoundingClientRect().top - HEADER_OFFSET;
      if (Math.abs(drift) > 12) glideTo(targetFor(node), 0.5);
    }, delay),
  );

  if (window.history?.replaceState) {
    window.history.replaceState(null, "", `#${id}`);
  }
  return true;
}
