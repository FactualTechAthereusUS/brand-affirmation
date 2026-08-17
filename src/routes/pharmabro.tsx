import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PharmaBroNav } from "@/components/pharmabro/PharmaBroNav";
import { PharmaBroFooter } from "@/components/pharmabro/PharmaBroFooter";

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
      <PharmaBroNav />
      <main>
        <Outlet />
      </main>
      <PharmaBroFooter />
    </div>
  );
}
