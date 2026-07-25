import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BrandShell } from "@/components/pharmabro/BrandShell";

export const Route = createFileRoute("/pharmabro-admin")({
  head: () => ({
    meta: [
      { title: "Brand Admin — Whitelabel Telehealth OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PharmabroLayout,
});

function PharmabroLayout() {
  return (
    <BrandShell>
      <Outlet />
    </BrandShell>
  );
}
