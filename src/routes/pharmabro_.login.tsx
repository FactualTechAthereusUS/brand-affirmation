import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  Lock,
  ShieldCheck,
  FileBadge,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { PB_EASE_STD } from "@/components/pharmabro/motion";

const WORDMARK = "/assets/pharmabro-wordmark.png";
const MARK = "/assets/pharmabro-mark.png";

export const Route = createFileRoute("/pharmabro_/login")({
  head: () => ({
    meta: [
      { title: "Brand sign in — PharmaBro" },
      {
        name: "description",
        content:
          "Secure sign in for PharmaBro brand operators. Access your telehealth control panel, patient operations, and fulfillment routing.",
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Brand sign in — PharmaBro" },
      {
        property: "og:description",
        content: "Secure sign in for PharmaBro brand operators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PharmaBroLogin,
});

const TRUST_ROWS = [
  {
    icon: ShieldCheck,
    title: "HIPAA-ready infrastructure",
    body: "Encrypted PHI at rest and in transit, with full audit trails on every record.",
  },
  {
    icon: Lock,
    title: "SOC 2 aligned controls",
    body: "Least-privilege access, scoped API keys, and continuous monitoring.",
  },
  {
    icon: BadgeCheck,
    title: "LegitScript-aligned workflows",
    body: "Compliance guardrails built into intake, review, and fulfillment.",
  },
];

function SystemsPill() {
  const reduce = useReducedMotion();
  return (
    <div className="inline-flex items-center gap-2.5 rounded-[24px] border border-ink/10 bg-white/70 px-3.5 py-2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full bg-[#12b33f]"
            animate={{ scale: [0.5, 2.1], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full bg-[#12b33f]" />
      </span>
      <span className="text-[12.5px] font-medium text-ink/70">
        All systems normal
      </span>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function PharmaBroLogin() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [caps, setCaps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const emailError =
    touched.email && !email.trim()
      ? "Enter your work email."
      : touched.email && !EMAIL_RE.test(email.trim())
        ? "Enter a valid email address."
        : null;
  const passwordError =
    touched.password && !password ? "Enter your password." : null;
  const valid = EMAIL_RE.test(email.trim()) && password.length > 0;

  useEffect(() => {
    if (formError) setFormError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setNotice(null);
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    // Demo gate: any valid email with a 6+ character password signs in.
    if (password.length < 6) {
      setFormError("Those credentials don't match an account.");
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate({ to: "/admin" });
  };

  const fieldBase =
    "w-full h-11 rounded-md border bg-white px-3 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink/35 disabled:opacity-50";

  return (
    <div className="pharmabro-scope min-h-dvh bg-canvas font-sans text-ink antialiased">
      <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
        {/* ---------------------------------------------------- brand panel */}
        <aside className="relative hidden overflow-hidden border-r border-hairline bg-[var(--color-mist)] lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div
            aria-hidden
            className="pb-liquid-soft pointer-events-none absolute inset-0 opacity-[0.55]"
          />
          <div className="relative">
            <Link to="/pharmabro" className="inline-flex items-center">
              <img
                src={WORDMARK}
                alt="PharmaBro"
                className="h-[34px] w-auto object-contain"
              />

            </Link>
          </div>

          <div className="relative max-w-[440px]">
            <h2 className="text-[34px] leading-[1.1] tracking-[-0.03em] text-ink">
              The operating system behind
              <span className="font-serif italic text-[var(--color-marine)]">
                {" "}
                modern telehealth brands
              </span>
              .
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-[var(--color-bluebell)]">
              Intake, provider review, pharmacy routing, subscriptions, and
              analytics in one control panel.
            </p>

            <ul className="mt-10 space-y-5">
              {TRUST_ROWS.map((row, i) => (
                <motion.li
                  key={row.title}
                  initial={reduce ? undefined : { opacity: 0, y: 12 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.07,
                    ease: PB_EASE_STD,
                  }}
                  className="flex gap-3.5"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-ink/10 bg-white text-[var(--color-marine)]">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-semibold tracking-[-0.01em] text-ink">
                      {row.title}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-[1.5] text-[var(--color-bluebell)]">
                      {row.body}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <SystemsPill />
          </div>
        </aside>

        {/* ------------------------------------------------------- form side */}
        <main className="flex flex-col justify-center px-5 py-10 sm:px-8">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: PB_EASE_STD }}
            className="mx-auto w-full max-w-[400px]"
          >
            <Link
              to="/pharmabro"
              className="mb-8 inline-flex items-center gap-2 lg:hidden"
            >
              <img src={MARK} alt="" className="h-8 w-8 object-contain" />
              <img
                src={WORDMARK}
                alt="PharmaBro"
                className="h-[22px] w-auto object-contain"
              />
            </Link>

            <div className="rounded-2xl border border-hairline bg-white p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_2px_6px_-2px_rgba(10,10,10,0.06),0_18px_44px_-24px_rgba(10,10,10,0.22)] sm:p-8">
              <h1 className="text-[26px] leading-[1.15] tracking-[-0.025em] text-ink">
                Sign in
              </h1>
              <p className="mt-1.5 text-[14px] text-[var(--color-bluebell)]">
                Enter your credentials to continue
              </p>

              <AnimatePresence initial={false}>
                {formError && (
                  <motion.div
                    key="err"
                    role="alert"
                    aria-live="polite"
                    initial={reduce ? undefined : { opacity: 0, y: 6 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: PB_EASE_STD }}
                    className="mt-5 rounded-md border border-[var(--color-ever)]/25 bg-[var(--color-ever)]/[0.06] px-3 py-2.5 text-[13px] text-[var(--color-ever)]"
                  >
                    {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="pb-email"
                    className="mb-1.5 block text-[13px] font-medium text-ink"
                  >
                    Email
                  </label>
                  <input
                    id="pb-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="username webauthn"
                    placeholder="email@company.com"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "pb-email-err" : undefined}
                    className={`${fieldBase} ${
                      emailError
                        ? "border-[var(--color-ever)]/50 focus-visible:border-[var(--color-ever)]"
                        : "border-hairline focus-visible:border-[var(--color-marine)]/50 focus-visible:ring-4 focus-visible:ring-[var(--color-marine)]/10"
                    }`}
                  />
                  {emailError && (
                    <p id="pb-email-err" className="mt-1.5 text-[12.5px] text-[var(--color-ever)]">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <label
                      htmlFor="pb-password"
                      className="text-[13px] font-medium text-ink"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setNotice(
                          "Password resets are handled by your platform administrator during the demo.",
                        )
                      }
                      className="text-[12.5px] font-medium text-[var(--color-marine)] underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="pb-password"
                      type={show ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      onKeyUp={(e) =>
                        setCaps(e.getModifierState?.("CapsLock") ?? false)
                      }
                      aria-invalid={!!passwordError}
                      aria-describedby={passwordError ? "pb-pass-err" : undefined}
                      className={`${fieldBase} pr-11 ${
                        passwordError
                          ? "border-[var(--color-ever)]/50 focus-visible:border-[var(--color-ever)]"
                          : "border-hairline focus-visible:border-[var(--color-marine)]/50 focus-visible:ring-4 focus-visible:ring-[var(--color-marine)]/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-md text-ink/45 transition-colors hover:bg-[var(--color-mist)] hover:text-ink"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p id="pb-pass-err" className="mt-1.5 text-[12.5px] text-[var(--color-ever)]">
                      {passwordError}
                    </p>
                  )}
                  {caps && !passwordError && (
                    <p className="mt-1.5 text-[12.5px] text-[var(--color-honey)]">
                      Caps Lock is on.
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ink text-[14px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-14px_rgba(10,10,10,0.7)] transition-colors hover:bg-ink/90 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-hairline" />
                <span className="text-[12px] text-ink/40">or</span>
                <span className="h-px flex-1 bg-hairline" />
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Fingerprint, label: "Sign in with Passkey", key: "passkey" },
                  { icon: FileBadge, label: "Sign in with X.509 certificate", key: "x509" },
                ].map((opt) => (
                  <motion.button
                    key={opt.key}
                    type="button"
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    onClick={() =>
                      setNotice(
                        opt.key === "passkey"
                          ? "Passkeys aren't enabled for this account yet. Ask your platform administrator to enroll a device."
                          : "Certificate sign in isn't enabled for this account yet. Enterprise plans can request X.509 enrollment.",
                      )
                    }
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-hairline bg-white text-[13.5px] font-medium text-ink transition-colors hover:border-ink/25 hover:bg-[var(--color-mist)]"
                  >
                    <opt.icon className="h-4 w-4 text-ink/55" />
                    {opt.label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence initial={false}>
                {notice && (
                  <motion.p
                    key={notice}
                    role="status"
                    aria-live="polite"
                    initial={reduce ? undefined : { opacity: 0, y: 6 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25, ease: PB_EASE_STD }}
                    className="mt-4 rounded-md border border-hairline bg-[var(--color-mist)] px-3 py-2.5 text-[12.5px] leading-[1.5] text-[var(--color-bluebell)]"
                  >
                    {notice}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-[var(--color-bluebell)]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              Your data is protected with enterprise-grade security.
            </p>

            <p className="mt-3 text-center text-[12px] text-ink/45">
              <Link
                to="/pharmabro/legal/privacy"
                className="hover:text-ink hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="px-2 text-ink/25">|</span>
              <Link
                to="/pharmabro/legal/terms"
                className="hover:text-ink hover:underline"
              >
                Terms of Service
              </Link>
            </p>

            <div className="mt-6 lg:hidden">
              <div className="flex justify-center">
                <SystemsPill />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
