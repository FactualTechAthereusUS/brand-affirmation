import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/confirmation-charged")({
  component: () => (
    <Navigate
      to="/confirmation"
      search={{
        model: "charged",
        tx: "sema",
        plan: "three",
        total: 711,
        first: "Sarah",
        email: "sarah@example.com",
        order: "BLSY-4821",
      }}
      replace
    />
  ),
});
