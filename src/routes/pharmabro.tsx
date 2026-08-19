import { createFileRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { PharmaBroNav } from "@/components/pharmabro/PharmaBroNav";
import { PharmaBroFooter } from "@/components/pharmabro/PharmaBroFooter";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";

const SmoothScroll = lazy(() =>
  import("@/components/SmoothScroll").then((m) => ({ default: m.SmoothScroll })),
);


export const Route = createFileRoute("/pharmabro")({
  component: PharmaBroLayout,
});

/**
 * Layout for the whole PharmaBro marketing site. `.pharmabro-scope` rebinds
 * the design tokens (white canvas, black ink, electric blue accent) so this
 * route family is visually isolated from Blissley and the admin dashboard.
 */
function PharmaBroLayout() {
  return (
    <div className="pharmabro-scope min-h-dvh bg-canvas font-sans text-ink antialiased">
      <Suspense fallback={null}>
        <SmoothScroll />
      </Suspense>
      <PharmaBroNav />
      <main>
        <Outlet />
      </main>
      <PharmaBroFooter />
    </div>
  );
}

