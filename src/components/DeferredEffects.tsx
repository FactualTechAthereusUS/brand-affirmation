import { useEffect, useState } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { ProgressiveBlur } from "./ProgressiveBlur";

/**
 * Loads non-critical visual effects (Lenis smooth scroll + progressive blur)
 * after the browser is idle so they never block LCP / TTI.
 */
export function DeferredEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const trigger = () => setReady(true);
    if (w.requestIdleCallback) {
      w.requestIdleCallback(trigger, { timeout: 1500 });
    } else {
      const id = window.setTimeout(trigger, 800);
      return () => window.clearTimeout(id);
    }
  }, []);

  if (!ready) return null;
  return (
    <>
      <SmoothScroll />
      <ProgressiveBlur side="bottom" height={140} layers={5} maxBlur={12} activateAfter={0} />
    </>
  );
}
