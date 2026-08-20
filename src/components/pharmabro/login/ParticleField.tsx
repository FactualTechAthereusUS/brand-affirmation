import { useEffect, useRef } from "react";

/**
 * Cuvo-style constellation canvas for the login left panel: slow drifting
 * nodes with hairline links between near neighbours. Electric blue on ink,
 * DPR-aware, and inert when the user prefers reduced motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(84, Math.max(34, (w * h) / 12000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.7 + Math.random() * 1.1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // hairline links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > 132) continue;
          const t = 1 - d / 132;
          ctx.strokeStyle = `rgba(120, 150, 255, ${0.16 * t})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(200, 214, 255, 0.42)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        if (reduce) continue;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

/** Fractal-noise film grain, matched to the reference filter values. */
export function GrainOverlay({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="pb-login-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.4"
          numOctaves={6}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="0.15" />
          <feFuncG type="linear" slope="0.15" />
          <feFuncB type="linear" slope="0.15" />
        </feComponentTransfer>
      </filter>
      <rect
        width="100%"
        height="100%"
        filter="url(#pb-login-grain)"
        opacity="0.6"
      />
    </svg>
  );
}
