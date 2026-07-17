import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/weight-loss/sales")({
  component: WeightLossSalesPage,
  head: () => ({
    meta: [
      { title: "Weight Loss Program — Blissley" },
      { name: "description", content: "Start your Blissley weight loss program today." },
      { property: "og:title", content: "Weight Loss Program — Blissley" },
      { property: "og:description", content: "Start your Blissley weight loss program today." },
    ],
  }),
});

function WeightLossSalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-5 py-24 text-center">
        <h1 className="text-3xl font-semibold text-ink">Weight Loss Sales Page</h1>
        <p className="mt-3 text-ink/60">Coming soon.</p>
      </section>
    </main>
  );
}
