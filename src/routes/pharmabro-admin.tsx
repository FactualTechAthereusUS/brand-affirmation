import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/pharmabro-admin")({
  head: () => ({
    meta: [
      { title: "Brand Admin — Whitelabel Telehealth OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
