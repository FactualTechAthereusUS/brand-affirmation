import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import { adminActions } from "@/lib/admin/store";

export const Route = createFileRoute("/login/admin")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Blissley" },
      { name: "description", content: "Secure magic-link sign in for Blissley staff." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
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

  const enter = () => {
    adminActions.signIn(email || "hello@blissley.com");
    nav({ to: "/admin" });
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <Link to="/" className="mb-10 inline-flex">
          <img src={blissleyLogo.url} alt="Blissley" className="h-7" />
        </Link>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin console
        </div>
        <h1 className="mt-4 font-hero text-3xl tracking-tight text-ink">Sign in to Blissley HQ</h1>
        <p className="mt-2 text-sm text-ink/60">
          Enter your Blissley email — we'll send a secure link. Links expire in 15 minutes.
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
                placeholder="you@blissley.com"
                className="w-full rounded-2xl border border-ink/12 bg-white px-4 py-3.5 text-[15px] outline-none placeholder:text-ink/30 focus:border-indigo/60 focus:ring-4 focus:ring-indigo/10"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-ink/90 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send magic link"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-check/30 bg-check/8 p-5 text-sm text-check">
              <div className="mb-1 font-semibold">Check {email}</div>
              A secure link is on the way. It expires in 15 minutes.
            </div>
            <button
              onClick={enter}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo px-5 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-indigo/90"
            >
              <Zap className="h-4 w-4" /> Enter demo console
            </button>
          </div>
        )}

        <p className="mt-10 text-[11px] uppercase tracking-[0.14em] text-ink/40">
          Restricted access · Blissley Health, Inc.
        </p>
      </div>
    </main>
  );
}
