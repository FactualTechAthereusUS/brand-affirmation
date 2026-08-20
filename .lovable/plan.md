# PharmaBro brand admin login — /pharmabro/login

A focused, enterprise-grade sign-in page for brand owners logging into their PharmaBro admin. Same brand grammar as the marketing site (white canvas, electric blue accent, Google Sans Flex with Instrument Serif accents, liquid-glass surfaces), but a standalone screen without the marketing nav or footer.

## Layout

Split screen on desktop, single column on mobile.

```text
desktop (>=1024px)                  mobile
+---------------+----------------+  +----------------+
| brand panel   |  sign-in card  |  |  logo          |
|  wordmark     |   Sign in      |  |  Sign in       |
|  one-line     |   email        |  |  email         |
|  positioning  |   password     |  |  password      |
|  3 trust rows |   [Sign in]    |  |  [Sign in]     |
|  soft liquid  |   or           |  |  or            |
|  glass mesh   |   passkey      |  |  passkey / x509|
|               |   x509         |  |  security note |
|  status pill  |   security     |  |  legal links   |
+---------------+----------------+  +----------------+
```

Left panel: subtle animated liquid-glass mesh (the existing soft variant, low opacity), wordmark, a short positioning line, three trust rows (HIPAA-ready infrastructure, SOC 2 controls, LegitScript-aligned workflows), and the pulsing green systems-operational pill reused from the footer. Right side: a white card on a hairline border with a layered shadow, max width around 400px, vertically centered.

## Form content

Kept exactly as specified:

- Heading "Sign in", subhead "Enter your credentials to continue"
- Email field, placeholder `email@company.com`, `autocomplete="username webauthn"`, type email, required
- Password field with a "Forgot password?" link on the same row as the label
- Primary "Sign in" button, full width
- "or" divider
- "Sign in with Passkey" and "Sign in with X.509 certificate" as secondary buttons
- "Your data is protected with enterprise-grade security." footnote
- "Privacy Policy | Terms of Service" links, wired to the existing PharmaBro legal routes

## Interaction and states

- Password visibility toggle inside the field.
- Real client-side validation: email format and non-empty password, inline field errors, no submit until valid.
- Submit shows a spinner and disables the form; a wrong-credentials branch renders a single generic error banner (never "no such user", which leaks account existence).
- Success routes to the brand admin dashboard at `/admin`.
- Passkey and X.509 buttons open an honest "not enabled for this account yet" state rather than pretending to authenticate.
- Caps Lock hint on the password field, and Enter submits from either field.
- Full keyboard focus rings, labelled inputs, `aria-live` on the error banner, and `autocomplete` set correctly so password managers work.

## Motion

Reuses the site's existing curves, nothing new invented: card rises 16px with a 0.6s fade on the standard ease, left-panel rows stagger at 70ms, button press scales to 0.98, error banner slides in 6px. Everything disabled under reduced-motion.

## Technical notes

- New route file escapes the marketing layout so no nav, footer or marketing progressive blur appears, while still applying the PharmaBro token scope on the page wrapper so colors and fonts match the rest of the site.
- Head metadata: unique title and description plus `noindex,nofollow` — a login page should not be crawled.
- Demo authentication only: local component state, no backend calls, no credentials stored. Real auth against Lovable Cloud can be layered on later without changing this UI.
- Legal links point at the existing `/pharmabro/legal/privacy` and `/pharmabro/legal/terms` routes.
