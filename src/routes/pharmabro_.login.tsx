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
} from "lucide-react";
import { PB_EASE_STD } from "@/components/pharmabro/motion";
import {
  GrainOverlay,
  ParticleField,
} from "@/components/pharmabro/login/ParticleField";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function SystemsPill() {
  const reduce = useReducedMotion();
  return (
    <div className="inline-flex items-center gap-2.5 rounded-[24px] border border-white/12 bg-white/[0.04] px-3.5 py-2 backdrop-blur-sm">
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
      <span className="text-[12.5px] font-medium text-white/65">
        All systems normal
      </span>
    </div>
  );
}

/** Four corner marks bleeding half-outside the card edge (Cuvo detail). */
function CornerMarks() {
  const pos = [
    "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
    "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
      {pos.map((p) => (
        <img
          key={p}
          src={MARK}
          alt=""
          loading="lazy"
          className={`absolute h-4 w-4 opacity-30 invert ${p}`}
        />
      ))}
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg
      viewBox="0 0 21 21"
      aria-hidden
      className="h-[18px] w-[18px] grayscale transition-[filter] duration-200 group-hover:grayscale-0"
    >
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[18px] w-[18px] grayscale transition-[filter] duration-200 group-hover:grayscale-0"
    >
      <path
        fill="#4285f4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34a853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#fbbc05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#ea4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

function OktaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[18px] w-[18px] grayscale transition-[filter] duration-200 group-hover:grayscale-0"
    >
      <path
        fill="#007dc1"
        fillRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
      />
    </svg>
  );
}

function PharmaBroLogin() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>(
    {},
  );
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
  }, [email, password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setNotice(null);
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (password.length < 6) {
      setFormError("Those credentials don't match an account.");
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate({ to: "/admin" });
  };

  const label =
    "block text-[11px] font-medium uppercase tracking-[0.12em] text-white/45";
  const field =
    "w-full h-11 rounded-md border bg-white/[0.03] px-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/30 disabled:opacity-50";
  const ok =
    "border-white/12 focus-visible:border-[#1b4ef5]/60 focus-visible:bg-white/[0.05]";
  const bad = "border-[#e5484d]/55 focus-visible:border-[#e5484d]";
  const ghostBtn =
    "group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-white/12 bg-transparent text-[13.5px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="pharmabro-scope flex min-h-dvh bg-[#0a0a0a] font-sans text-white antialiased">
      {/* ---------------------------------------------------- left panel */}
      <aside className="relative hidden border-r border-white/10 bg-[#0a0a0a] lg:flex lg:w-1/2 xl:w-[55%]">
        <ParticleField className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_10%,rgba(27,78,245,0.18),transparent_70%)]"
        />
        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <Link to="/pharmabro" className="flex items-center">
            <img
              src={WORDMARK}
              alt="PharmaBro"
              className="h-8 w-auto object-contain invert"
            />
          </Link>

          <div className="max-w-[460px]">
            <p className="pb-micro !text-white/40">Brand control panel</p>
            <h2 className="mt-4 text-[34px] leading-[1.1] tracking-[-0.03em] text-white">
              The operating system behind
              <span className="font-serif italic text-white/60">
                {" "}
                modern telehealth brands
              </span>
              .
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-white/50">
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
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.04] text-white/80">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-semibold tracking-[-0.01em] text-white">
                      {row.title}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-[1.5] text-white/45">
                      {row.body}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div><SystemsPill /></div>
        </div>
      </aside>

      {/* --------------------------------------------------- right panel */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <GrainOverlay className="pointer-events-none absolute inset-0 z-0 size-full select-none opacity-[0.16]" />

        <div className="relative z-10 p-6 lg:hidden">
          <Link to="/pharmabro" className="flex items-center">
            <img
              src={WORDMARK}
              alt="PharmaBro"
              className="h-8 w-auto object-contain invert"
            />
          </Link>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: PB_EASE_STD }}
            className="w-full max-w-md"
          >
            <div className="relative w-full rounded-xl border border-white/12 bg-white/[0.025] p-6 backdrop-blur-[2px] sm:p-8">
              <CornerMarks />

              <div className="mb-8">
                <h1 className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-white">
                  Sign in
                </h1>
                <p className="text-sm text-white/45">
                  Enter your credentials to continue
                </p>
              </div>

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
                    className="mb-5 rounded-md border border-[#e5484d]/30 bg-[#e5484d]/[0.08] px-3 py-2.5 text-[13px] text-[#ff9a9d]"
                  >
                    {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="pb-email" className={label}>
                    Email
                  </label>
                  <input
                    id="pb-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="username webauthn"
                    placeholder="you@company.com"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={`${field} ${emailError ? bad : ok}`}
                  />
                  {emailError && (
                    <p className="text-[12.5px] text-[#ff9a9d]">{emailError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pb-password" className={label}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setNotice(
                          "Password resets are handled by your platform administrator during the demo.",
                        )
                      }
                      className="text-xs text-white/45 transition-colors hover:text-white"
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
                      onKeyUp={(e) =>
                        setCaps(e.getModifierState?.("CapsLock") ?? false)
                      }
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      className={`${field} pr-11 ${passwordError ? bad : ok}`}
                    />
                    <button
                      type="button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded text-white/40 transition-colors hover:text-white"
                    >
                      {show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-[12.5px] text-[#ff9a9d]">{passwordError}</p>
                  )}
                  {caps && !passwordError && (
                    <p className="text-[12.5px] text-[#f59e0b]">
                      Caps Lock is on.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#1b4ef5] text-sm font-medium text-white transition-colors hover:bg-[#1b4ef5]/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/12" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#0d0d0d] px-2 text-white/40">or</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNotice("Passkeys aren't enabled for this account yet.")
                    }
                    className={ghostBtn}
                  >
                    <Fingerprint className="h-4 w-4 text-white/55" />
                    Sign in with Passkey
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Certificate sign in isn't enabled for this account yet.",
                      )
                    }
                    className={ghostBtn}
                  >
                    <FileBadge className="h-4 w-4 text-white/55" />
                    Sign in with X.509 certificate
                  </button>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Microsoft", Icon: MicrosoftIcon },
                      { label: "Google", Icon: GoogleIcon },
                      { label: "Okta", Icon: OktaIcon },
                    ].map(({ label: name, Icon }) => (
                      <button
                        key={name}
                        type="button"
                        aria-label={`Sign in with ${name}`}
                        title={`Sign in with ${name}`}
                        onClick={() =>
                          setNotice(
                            `${name} SSO isn't connected for this workspace yet.`,
                          )
                        }
                        className={ghostBtn}
                      >
                        <Icon />
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              <AnimatePresence>
                {notice && (
                  <motion.p
                    key={notice}
                    initial={reduce ? undefined : { opacity: 0, y: 6 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25, ease: PB_EASE_STD }}
                    className="mt-4 rounded-md border border-white/12 bg-white/[0.04] px-3 py-2.5 text-[12.5px] text-white/60"
                  >
                    {notice}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-10 space-y-2 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs text-white/40">
                  <Lock className="h-3.5 w-3.5" />
                  Your data is protected with enterprise-grade security.
                </p>
                <p className="text-xs">
                  <Link
                    to="/pharmabro/legal/privacy"
                    className="text-white/40 underline decoration-white/20 decoration-[0.5px] underline-offset-2 transition-colors hover:text-white/70"
                  >
                    Privacy Policy
                  </Link>
                  <span className="mx-2 text-white/25">|</span>
                  <Link
                    to="/pharmabro/legal/terms"
                    className="text-white/40 underline decoration-white/20 decoration-[0.5px] underline-offset-2 transition-colors hover:text-white/70"
                  >
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
