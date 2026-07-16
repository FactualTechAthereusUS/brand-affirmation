import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

type Props = {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

/**
 * Count-up on first in-view.
 * `to` is the target integer; `format` renders it (defaults to en-US thousands).
 */
export function CountUp({ to, duration = 1.6, format, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const rendered = format
    ? format(value)
    : Math.round(value).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {rendered}
    </span>
  );
}
