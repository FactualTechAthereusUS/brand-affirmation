import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle2, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/blissley-logo.png.asset.json";
import bg from "@/assets/login-bg.png.asset.json";
import { physicianActions } from "@/lib/physician/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Physician Login — Blissley" },
      {
        name: "description",
        content:
          "Secure physician sign in for the Blissley clinical portal. Review cases, prescribe, and message patients.",
      },
      { property: "og:title", content: "Physician Login — Blissley" },
      {
        property: "og:description",
        content:
          "Secure physician sign in for the Blissley clinical portal.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("scott.nass@blissley.md");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      physicianActions.signIn(email);
      navigate({ to: "/portal/physician" });
    }, 1400);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Left — image panel (desktop only) */}
        <aside className="relative hidden lg:block">
          <div className="sticky top-0 h-screen p-4">
            <div className="relative h-full w-full overflow-hidden rounded-[28px]">
              <img
                src={bg.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
              />
              {/* Soft gradient for legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

              {/* Logo top-left */}
              <Link to="/" className="absolute left-8 top-8 z-10 inline-flex items-center">
                <img src={logo.url} alt="Blissley" className="h-10 w-auto brightness-0 invert" />
              </Link>

              {/* Editorial copy bottom-left */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#ee7273" }} />
                  For licensed physicians only
                </div>
                <h2 className="max-w-[440px] font-sans text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
                  Clinical decisions, made calm.
                </h2>
                <p className="mt-5 max-w-[380px] text-[15px] leading-relaxed text-white/85">
                  Review intakes, build prescriptions, and stay in sync with your patients — all in one secure workspace.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right — form */}
        <main className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          {/* Mobile logo + back */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-6 lg:hidden">
            <Link
              to="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ink transition hover:bg-black/[0.04]"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <Link to="/" className="inline-flex items-center">
              <img src={logo.url} alt="Blissley" className="h-9 w-auto" />
            </Link>
            <span className="h-10 w-10" />
          </div>

          <div className="w-full max-w-[420px] pt-16 lg:pt-0">
            <div className="mb-10">
              <p className="mb-3 font-sans italic text-[15px] text-ever">welcome back.</p>
              <h1 className="font-sans text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[46px]">
                Sign in to your care.
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
                Access your patient portal to message your clinician, manage prescriptions, and
                track progress.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-ink/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-ink placeholder:text-ink/35 outline-none transition focus:border-ever focus:ring-4 focus:ring-ever/15"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-[13px] font-medium text-ink/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 pr-12 text-[15px] text-ink placeholder:text-ink/35 outline-none transition focus:border-ever focus:ring-4 focus:ring-ever/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-ink/50 hover:text-ink"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="inline-flex items-center gap-2 text-ink/70">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/20 text-ever focus:ring-ever/30"
                  />
                  Remember me
                </label>
                <a href="#" className="font-medium text-ever hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="h-13 w-full rounded-full bg-ink py-4 text-[15px] font-medium text-canvas shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:scale-[1.01] active:scale-[0.99]"
              >
                Sign in
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[12px] uppercase tracking-[0.14em] text-ink/40">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white text-[14px] font-medium text-ink transition hover:bg-black/[0.03]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.75-6-6.15S8.7 6.2 12 6.2c1.9 0 3.15.8 3.87 1.5l2.64-2.55C16.86 3.6 14.63 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.72 8.8-8.96 0-.6-.06-1.05-.15-1.5H12z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="mt-8 text-center text-[14px] text-ink/60">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-ink hover:underline">
                Start your assessment
              </a>
            </p>
          </div>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 grid place-items-center bg-white/85 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 8, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="mx-6 max-w-[380px] rounded-3xl bg-white p-8 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FFF3F1]">
                    <Mail className="h-6 w-6" style={{ color: "#ee7273" }} />
                  </div>
                  <h3 className="mt-4 text-[20px] font-semibold tracking-tight text-ink">Check your email</h3>
                  <p className="mt-2 text-[14px] text-ink/60">We sent a secure sign-in link to <span className="font-medium text-ink">{email}</span>.</p>
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-ink/50">
                    <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#4a7c6f" }} /> Opening your portal…
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
