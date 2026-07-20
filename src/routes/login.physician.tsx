import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Stethoscope, ShieldCheck } from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import { physicianActions } from "@/lib/physician/store";

export const Route = createFileRoute("/login/physician")({
  head: () => ({
    meta: [
      { title: "Physician sign in — Blissley" },
      { name: "description", content: "Secure magic-link sign in for licensed Blissley physicians." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PhysicianLogin,
});

function PhysicianLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
    setLoading(false);
  };

  const enterDemo = () => {
    physicianActions.signIn(email || "scott.nass@blissley.md");
    nav({ to: "/portal/physician" });
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <Link to="/" className="mb-10 inline-flex">
          <img src={blissleyLogo.url} alt="Blissley" className="h-7" />
        </Link>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          <Stethoscope className="h-3.5 w-3.5" />
          Physician portal
        </div>
        <h1 className="mt-4 font-hero text-3xl tracking-tight text-ink">Physician sign in</h1>
        <p className="mt-2 text-sm text-ink/60">
          Enter your work email — we'll send a secure link. Links expire in 15 minutes.
        </p>

        {!sent ? (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink/80">Work email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink/30 focus:border-ink/40 focus:outline-none focus:ring-4 focus:ring-ink/5"
                placeholder="you@blissley.md"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
            >
              {loading ? "Sending link…" : "Send magic link"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50">
              <ShieldCheck className="h-3.5 w-3.5" />
              For licensed physicians only
            </p>
          </form>
        ) : (
          <div className="mt-8 space-y-5 rounded-3xl border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">✓</div>
              <div>
                <div className="font-medium text-ink">Check your inbox</div>
                <div className="text-xs text-ink/60">Magic link sent to {email}</div>
              </div>
            </div>
            <button
              onClick={enterDemo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Enter physician portal (demo)
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-10 text-xs text-ink/50">
          Not a physician? <Link to="/login" className="underline">Patient sign in</Link>.
        </div>
      </div>
    </main>
  );
}
