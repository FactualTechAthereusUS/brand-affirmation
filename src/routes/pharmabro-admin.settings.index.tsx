import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pharmabro-admin/settings/")({
  beforeLoad: () => { throw redirect({ to: "/pharmabro-admin/settings/general" }); },
});
