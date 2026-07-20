import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import drNassWelcome from "@/assets/dr-nass-welcome.png.asset.json";
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
  const [email, setEmail] = useState("scott.nass@blissley.md");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    setLoading(false);
  };

  const enterDemo = () => {
    physicianActions.signIn(email);
    nav({ to: "/portal/physician" });
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left — brand column */}
        <aside className="relative hidden overflow-hidden bg-ink text-white lg:block">
          <img
            src={drNassWelcome.url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/70 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={blissleyLogo.url} alt="Blissley" className="h-8 brightness-0 invert" />
            </Link>
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#ee7273" }} />
                Physician portal
              </div>
              <h1 className="mt-6 font-hero text-4xl leading-[1.05] tracking-tight xl:text-5xl">
                Care that fits into your day —<br />
                not the other way around.
              </h1>
              <p className="mt-5 text-white/70">
                A calm, single-scroll case review. Every clinical decision documented, timestamped, and signed with your credentials.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-white/75">
                {[
                  "Async intake review with intelligent flagging",
                  "One-click Rx build with dose ladder guardrails",
                  "State-licensed queue filtering",
                  "Full audit trail — HIPAA + 21 CFR Part 11 aligned",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-white/50">
              © 2026 TheFactual LLC DBA Blissley · For licensed physicians only.
            </div>
          </div>
        </aside>

        {/* Right — form */}
        <section className="flex items-center justify-center p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex">
                <img src={blissleyLogo.url} alt="Blissley" className="h-7" />
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
              <Stethoscope className="h-3.5 w-3.5" />
              Physician sign in
            </div>
            <h2 className="mt-4 font-hero text-3xl tracking-tight text-ink">Welcome back, doctor.</h2>
            <p className="mt-2 text-sm text-ink/60">
              We'll email you a secure link — no password needed. Links expire in 15 minutes.
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
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition hover:bg-ink/90 disabled:opacity-60"
                >
                  {loading ? "Sending secure link…" : "Send magic link"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  HIPAA-secure · 21 CFR Part 11 · SOC 2 Type II
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-5 rounded-3xl border border-ink/10 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">✓</div>
                  <div>
                    <div className="font-medium text-ink">Check your inbox</div>
                    <div className="text-xs text-ink/60">Magic link sent to {email}</div>
                  </div>
                </div>
                <p className="text-sm text-ink/60">
                  For this walkthrough you can enter the portal directly — the demo runs entirely client-side.
                </p>
                <button
                  onClick={enterDemo}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white hover:bg-ink/90"
                >
                  Enter physician portal (demo)
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            <div className="mt-10 border-t border-ink/10 pt-6 text-xs text-ink/50">
              Trouble signing in? Email <a className="underline" href="mailto:physicians@blissley.md">physicians@blissley.md</a>.
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
