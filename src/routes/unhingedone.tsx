import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UOClaimTab } from "@/components/unhingedone/UOClaimTab";
import { UOFooter } from "@/components/unhingedone/UOFooter";
import { UONav } from "@/components/unhingedone/UONav";
import { UOTicker } from "@/components/unhingedone/UOTicker";

export const Route = createFileRoute("/unhingedone")({
  component: UOLayout,
});

/**
 * Standalone storefront shell for Unhinged One. `.uo-scope` rebinds the design
 * tokens so this route family shares nothing visually with the other sites in
 * the project and can be lifted into Shopify on its own.
 */
function UOLayout() {
  return (
    <div className="uo-scope min-h-dvh bg-canvas font-sans text-ink antialiased">
      <UOTicker />
      <UONav />
      <main>
        <Outlet />
      </main>
      <UOFooter />
      <UOClaimTab />
    </div>
  );
}
