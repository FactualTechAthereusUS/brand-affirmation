# 07 — Marketing Site

Scope: the public marketing surface of the app — homepage (`/`), the weight-loss program landing page (`/weight-loss`), the five legal/policy pages, the shared nav/footer, the SEO head metadata per route, the global design-token system in `src/styles.css`, and the shared motion/scroll primitives used throughout. This document does not cover the intake flow, auth, or the admin dashboard.

All copy, prices, stats, and testimonials quoted below are taken verbatim from the current source. Anything not wired to a real destination (dead `href="#"`, decorative-only controls, hardcoded review data, third-party hotlinked images) is flagged explicitly.

---

## 1. Route map

| Path | File | Component | Notes |
|---|---|---|---|
| `/` | `src/routes/index.tsx` | `Index` | Homepage |
| `/weight-loss` | `src/routes/weight-loss.index.tsx` | `WeightLoss` | Program landing page |
| `/terms` | `src/routes/terms.tsx` | `LegalPage` | Terms & Conditions |
| `/privacy` | `src/routes/privacy.tsx` | `LegalPage` | Privacy Policy |
| `/refund` | `src/routes/refund.tsx` | `LegalPage` | Refund Policy |
| `/shipping` | `src/routes/shipping.tsx` | `LegalPage` | Shipping Policy |
| `/medication-safety` | `src/routes/medication-safety.tsx` | `LegalPage` | Medication Safety Information |

Both `/` and `/weight-loss` share the same page shell: `<AnnouncementBar />` → `<Nav />` → `<main>` (hero eager, everything else lazy via `React.lazy` + `Suspense`) → `<Footer />` → lazily-mounted `<DeferredEffects />` (idle-loaded Lenis smooth scroll + bottom progressive blur overlay).

Both pages preload the correct hero image per breakpoint via `<link rel="preload">` with `media` queries (mobile vs desktop) and set `fetchpriority="high"`.

---

## 2. Root shell (`src/routes/__root.tsx`)

- `createRootRouteWithContext<{ queryClient }>()` wraps the whole app in `QueryClientProvider`.
- `head()` sets the site-wide fallback meta (used unless overridden by a child route): charset, viewport, and the same OG/Twitter title & description as the homepage:
  - Title: `Blissley — Personalized medicine, designed around you.`
  - Description: `Weight loss, skin, sexual wellness, and longevity — physician-guided care delivered to your door. Same price at every dose. Now in all 50 states.`
  - `og:site_name: Blissley`, `og:type: website`, `twitter:card: summary_large_image`, plus a hardcoded `og:image`/`twitter:image` pointing at a Lovable preview-screenshot CDN URL (**placeholder — this is an auto-generated preview screenshot, not branded OG art**).
- `links`: stylesheet (`styles.css`), favicon, Google Fonts preconnect + stylesheet link for "Google Sans Flex" and "Manrope".
- `shellComponent` renders `<html lang="en">` with `<HeadContent/>` in head and `<Scripts/>` at the end of body.
- `notFoundComponent`: centered 404 card with a "Go home" link to `/`.
- `errorComponent`: centered error card; logs the error and reports it via `reportLovableError`, offers "Try again" (calls `router.invalidate()` + `reset()`) and "Go home".

---

## 3. Homepage (`/`)

### 3.1 Composition & loading strategy
`Index` in `src/routes/index.tsx` renders, in order: `AnnouncementBar`, `Nav`, then inside `<main>`: `Hero` (eager — above the fold), then lazily-loaded (`React.lazy`, each wrapped in its own `<Suspense fallback={<div style={{minHeight}} aria-hidden />}>`): `PressLogos`, `CategoryGrid`, `WhyBlissley`, `HowItWorks`, `FeaturedPrograms`, `SocialProof`, `Numbers`, `Products`, `Comparison`, `FAQ`, `FinalCTA`. Then `Footer` (eager), then lazily-mounted `DeferredEffects`.

Fallbacks are blank spacers (120px for press logos, 200px for numbers, 400px default) purely to reduce layout shift while chunks load — no skeleton UI.

### 3.2 SEO head (`Route.head()`)
- Title: `Blissley — Personalized medicine, designed around you.`
- Meta description: `Weight loss, skin, sexual wellness, and longevity — physician-guided care delivered to your door. Same price at every dose. Now in all 50 states.`
- `og:title`/`og:description` duplicate the above; `og:type: website`, `og:url: /`; `twitter:card: summary_large_image`.
- `links`: canonical `/`; two preloads for the hero image (mobile file for `max-width: 767px`, desktop file for `min-width: 768px`), both `fetchpriority="high"`.

### 3.3 Sections, in order

**AnnouncementBar** (`home/AnnouncementBar.tsx`)
- Sticky top bar (`sticky top-0 z-50`, white bg).
- Single link (`href="#"` — **placeholder, not wired**): "Limited time: 50% off your 1st month of membership!" (shortened to "...1st month!" below `sm:`) with a trailing arrow glyph.

**Nav** (`home/Nav.tsx`) — see §5.

**Hero** (`home/Hero.tsx`)
- Full-bleed section, `min-h-[100svh]` on mobile, negative top margin to sit under the sticky announcement/nav, dark navy fallback background `#1e3a5f`.
- Separate mobile/desktop background images (`mobile-hero-portrait` / `hero-portrait-new`), both `aria-hidden`, `fetchPriority="high"`.
- Mobile-only dark gradient overlay for text legibility.
- Copy: H1 "Personalized care. / Ongoing support. / Real progress." (uses `--font-hero`), subhead "GLP-1, dermatology, hair, mental health, intimacy. Doctor-prescribed treatments shipped to your door starting at $299 for first month of membership."
- Primary CTA: pill button "Get started" → **`/intake`**, with a small vial-icon avatar and a rotating arrow-circle on hover (spring animation).
- Secondary CTA: glass-style "Explore Treatments" button — **no `href`, unwired (decorative button only)**.
- Fine print: "$299 promotional rate applies to your first month only... standard rate is $399/month..." disclaimer.
- Trust checklist ("Board-certified doctors", "Clinically backed treatments", "Medical guidance") — rendered twice: as a glass card pinned to the bottom on mobile, and as a plain list + Trustpilot card (logo image, "TrustScore 4.9", "3,526 reviews" link — **link is `href="#"`, unwired**) absolutely positioned bottom-right on desktop/large screens.

**PressLogos** (`home/PressLogos.tsx`)
- "As featured in" label with two hairline rules either side.
- Desktop (`lg:`): static row of 8 logos.
- Mobile/tablet: seamless CSS-keyframe marquee (`press-scroll`, 32s linear infinite, disabled under `prefers-reduced-motion`) built by duplicating the logo array.
- **All 8 logos are hotlinked from third-party CDNs** (vectorlogo.zone, Wikipedia, framerusercontent.com) for Forbes, Bloomberg, Washington Post, WebMD, Today, and three unnamed "Featured" images — **placeholder/demo press logos, not licensed brand assets, and not self-hosted**.

**CategoryGrid** ("What can we help you with?")
- H2 "What can we help you with?" (italic on "with?").
- Desktop-only header controls: "All our Treatments" pill (`href="#"`, **unwired**) and prev/next arrow buttons that scroll the horizontal track by one card width.
- 7 category cards: Weight Loss ($249/mo, → `/weight-loss`, only real link), Menopause ($119/mo, `#`), Longevity ($149/mo, `#`), Skin Care ($89/mo, `#`), Hair Care ($29/mo, `#`), Sexual Health ($79/mo, `#`), Men's Health ($99/mo, `#`) — **6 of 7 cards are unwired placeholders**.
- Mobile: stacked column of full-width image cards. Desktop: horizontal `snap-x` slider, each card 380×520px (420×560 at `lg:`), with a bottom gradient, title/price overlay, and a circular arrow-up-right badge top-right.
- Each card fades/blurs in via `Reveal` with staggered delay.

**WhyBlissley** ("Healthcare built differently.")
- Sticky-left/scroll-right layout on desktop (`md:grid-cols-[1fr_1.4fr]`, left column `sticky top-32`); stacked on mobile.
- Headline: "Healthcare built / differently." + intro paragraph.
- 4 feature cards (icon + two-line title + body), each a white rounded card with hover lift:
  1. "Doctor-guided care. / Always personal." — physician review, no bots.
  2. "Delivered to your door. / Discreet. Temperature-controlled." — cold-chain shipping from licensed US pharmacies.
  3. "Same price. Every dose. / No surprise increases. Ever." — price-lock messaging.
  4. "Made for you. / Not the masses." — personalized protocols.
- Reused verbatim (same component) on the weight-loss page.

**HowItWorks** ("Getting started should feel simple.")
- Sticky left column (badge "How it works", H2, intro copy, "Start Your Free Assessment" button — **button has no `href`/`onClick`, unwired**) + right column of 3 scroll-linked step rows (Assessment / Medical Review / Delivered), each with a large step number, title, body copy, and a thumbnail image.
- Each row uses `useScroll`/`useTransform` (Framer Motion) tied to its own scroll position to animate opacity/blur/scale as it enters/exits the viewport center (custom "focus" effect, not a simple fade-in).
- Reused verbatim on the weight-loss page.

**FeaturedPrograms** ("Your program, your terms.")
- 3 portrait (3:4) image cards: "Lose weight. Keep it off." (GLP-1 Programs), "Your skin, transformed." (Prescription Skincare), "Confidence, restored." (Sexual Wellness).
- Each card's image has a subtle parallax `y`/`scale` transform driven by scroll progress, a bottom blur+gradient scrim for legibility, and a glass arrow-badge CTA.
- **All three cards link to `href="#"` — unwired.**

**SocialProof** ("What people are saying.")
- Header: H2 + "★★★★★ 4.96 TrustScore · 3,826 reviews" (static text, not linked to any real review source).
- Horizontal `snap-x` auto-playing carousel (custom autoplay every 3.8s, pauses 6s on pointer/wheel/touch interaction, tracks the centered card via scroll position, dims/blurs non-active cards).
- **20 reviews are hardcoded** in a `reviews` array with name, meta (e.g. "Weight Loss · 3 months"), a portrait image, a 5-star row, a bold "lead" quote, and a body paragraph. Images are drawn from a shared pool of person photos (`review-20`…`review-28`) reused across multiple review entries — **testimonials and photos are demo/placeholder data, not sourced from a CMS or real review platform integration**.

**Numbers** (stat strip)
- 4-column (2-column on small screens) stat row, animated via `CountUp` (counts up on first scroll-into-view): "30,000+ Patients treated", "4.9 ★ Average rating", "24 hrs Physician review", "50 states Nationwide coverage". All values are hardcoded constants.

**Products** ("Treatments tailored to you")
- Eyebrow pill "Personalized care", H2, "View all treatments" link (`href="#"`, **unwired**, shown both desktop-right and mobile-bottom).
- 2 product cards (Compounded Semaglutide $249/mo, Compounded Tirzepatide $299/mo), each with badge, title, description, price, a "Get Started" button (**no `href`/handler — unwired**) and a "What is semaglutide/tirzepatide?" link (`href="#"`, **unwired**).
- Mobile: horizontal snap slider with peeking cards and a dot-pagination indicator computed from scroll position; desktop: static 2-column grid.

**Comparison** ("Why Blissley is the smarter choice.")
- Feature-comparison table/grid: Blissley vs. Hims vs. Mayo Clinic across 10 rows (same price at every dose, 5-day notice before charge, one-click cancel, board-certified physicians, 24-hour review, no insurance required, no waitlist, 48-hour shipping, discreet packaging, real human support).
- Blissley column always highlighted with a coral gradient background and white check/x icons; competitor columns use soft-coral check circles or plain X icons; boolean or `"varies"` values supported.
- Fully responsive: separate desktop grid layout and a compressed mobile grid layout (same data, different columns/sizing).
- Logos for Blissley, Hims, and Mayo Clinic are local asset images (not hotlinked) but the comparison claims are static, unsourced marketing copy — **no citation/link backing the claims**.

**FAQ** ("Common questions.")
- Single-open accordion (first item open by default), 8 Q&A pairs covering GLP-1 safety, insurance, "same price at every dose," speed of results, cancellation, dose continuity, physician review turnaround, and refund-if-not-approved policy. Uses `AnimatePresence`/height-auto animation for expand/collapse and a rotating "+" icon.

**FinalCTA** ("Become who you were always meant to be")
- Large rounded hero-style closing panel with separate mobile/desktop background images, layered gradient scrims (top and left) for text contrast.
- Eyebrow "Get started", H2, sub-copy "Free assessment. No commitment. Physician review within 24 hours.", and two liquid-glass buttons:
  - Primary: "Take your assessment" — **no `href`, button element only, unwired**.
  - Secondary: "Browse treatments" — **no `href`, unwired**.
- Footer microcopy: "Free to start · No credit card required · Cancel anytime."
- Entrance animation: whole panel fades/un-blurs into view on scroll (`whileInView`), with staggered child animations for badge/H2/paragraph/buttons/microcopy.

**Footer** — see §5.

**DeferredEffects** — mounted after `Footer`, see §7.6.

### 3.4 Unused-but-present component
`home/ValueStack.tsx` and `home/Placeholder.tsx` exist in the directory but are **not imported/rendered by the homepage route** (or by weight-loss). `ValueStack` is a self-contained "Everything included. No surprises." 3-item value-prop list (same price/all doses, 48-hour shipping, unlimited doctor calls) — appears to be a leftover/alternate section not wired into any current page. `Placeholder` is a generic labeled gradient-block component (tones: warm/sage/clay/sand/dusk/morning) used only for early-stage mockups — **not referenced anywhere in the current codebase's render tree** (dead code / scaffolding).

---

## 4. Weight-loss program page (`/weight-loss`)

### 4.1 Composition & loading strategy
`WeightLoss` in `src/routes/weight-loss.index.tsx` renders: `AnnouncementBar`, `Nav`, `<main>`: `WLHero` (eager) then lazily: `PressLogos` (shared with homepage), `WLCalculator`, `HowItWorks` (shared), `WLPrograms`, `WhyBlissley` (shared), `WLSocialProof`, `WLBeforeAfter`, `WLFAQ`, `WLFinalCTA`; then `Footer`, then `DeferredEffects`. Same `Suspense`/blank-fallback pattern as the homepage.

### 4.2 SEO head
- Title: `Weight Loss — Physician-prescribed GLP-1 | Blissley`
- Description: `Physician-prescribed semaglutide and tirzepatide. Same price at every dose. Free assessment, physician review within 24 hours, delivered to your door.`
- `og:title` same; `og:description`: `Physician-prescribed semaglutide and tirzepatide. Same price at every dose. Delivered to your door.`
- `og:type: website`, `og:url: /weight-loss`, `twitter:card: summary_large_image`.
- Canonical `/weight-loss`; responsive hero image preloads (mobile/desktop `wl-hero-*` assets), `fetchPriority="high"`.

### 4.3 Sections, in order

**WLHero** (`weight-loss/WLHero.tsx`)
- Same structural pattern as the homepage Hero but a distinct dark-brown fallback background (`#2b1a10`) and separate `wl-hero-*` images.
- Eyebrow pill: "GLP-1 Weight Loss".
- H1: "Lose the weight. / Keep your life." Subhead: "Physician-prescribed semaglutide and tirzepatide. Same price at every dose. Delivered to your door."
- Primary CTA "Start My Free Assessment" → **`/intake/weight-loss`** (real, program-specific intake route).
- Secondary CTA "See How It Works" — plain button, **no `href`/scroll-anchor wired, unwired**.
- Microcopy: "Takes 4 minutes · No commitment · Physician review within 24 hours" and a pricing disclaimer ("$249 promotional rate applies to your first month only... standard rate is $299/month...").

**PressLogos** — identical shared component/content as homepage (same third-party hotlinked logos, same caveats).

**WLCalculator** ("See how much you could lose")
- Interactive two-panel tool over a background image (`calc-bg`).
- Left panel: a weight slider (150–400 lbs, default 220) driving a "You could lose up to N lbs" projection (`weight * 0.22`, rounded) and a "Start My Free Assessment" CTA (`href="#assessment"` — **anchor target `#assessment` does not exist anywhere on the page; effectively a dead in-page link**). Disclaimer: "*Based on published clinical trial averages showing 15-22% body weight reduction. Individual results vary and are not guaranteed."
- Right panel: a live Chart.js line chart (2 datasets — Tirzepatide solid line, Semaglutide dashed line) projecting "Now" through "Month 5" using an eased interpolation (`1 - (1-t)^3`) toward 78%/85% of the entered starting weight respectively; chart re-renders reactively as the slider moves; custom tooltip styling (`#7a1f2b` background).
- **All projections are client-side illustrative math, not physician- or data-backed outputs** — presented as a marketing/engagement tool, not a real clinical estimator.

**HowItWorks** — shared component with homepage, identical content (Assessment / Medical Review / Delivered).

**WLPrograms** ("Physician-prescribed. Same price. Every dose.")
- Eyebrow "Your options", H2, intro copy.
- 2 program cards: Compounded Semaglutide ($249/mo, "Same price when your dose goes up") and Compounded Tirzepatide ($299/mo, same subline), each with a "Get Started →" button — **no `href`/handler, unwired**.
- Footer note: "Not sure which is right for you? Your physician will recommend the best option based on your health profile."

**WhyBlissley** — shared component with homepage, identical content.

**WLSocialProof** ("What people are saying.")
- Same carousel mechanics as homepage `SocialProof` (own copy of the component, `weight-loss/WLSocialProof.tsx`), but with a **weight-loss-specific hardcoded review set** (6 reviews vs. the homepage's 20), all tagged "Weight Loss · N months" and reusing the same shared review photo pool (`review-20`…`review-28`). Header stat line: "★★★★★ 4.8 out of 5 · 3,000+ reviews" (different number than the homepage's "4.96 TrustScore · 3,826 reviews" — **inconsistent trust stats between the two pages**, both static/hardcoded).

**WLBeforeAfter** ("Real people, real results.")
- Auto-playing horizontal carousel (same interaction pattern as SocialProof: autoplay every 4.2s, pause-on-interaction, scroll-tracked active card, dot pagination) of 5 before/after image pairs (`ba-34`…`ba-43`), each a 2-column card with "Before"/"After" color-coded badges (dark teal / coral), a verified-check icon, name (e.g. "Cassandra K."), and caption "After GLP-1".
- **Names and images are demo/placeholder before-after content**, not verified clinical case studies with sourcing.

**WLFAQ** ("Common questions.")
- Same accordion component pattern as homepage FAQ but weight-loss-specific copy: 8 Q&As on compounded-vs-brand semaglutide, "same price at every dose" meaning, results timeline, injection anxiety, insurance, cancellation, dose continuity when switching providers, and refund-if-not-approved.

**WLFinalCTA** ("Your program is 4 minutes away.")
- Same visual pattern as homepage `FinalCTA` (large rounded panel, layered background images/gradients) but weight-loss-specific background (`wl-hero-desktop-v2`/`wl-hero-mobile-v2`), headline "Your program is / 4 minutes away.", body "Free assessment. Physician review within 24 hours. Same price at every dose. Forever."
- Primary CTA "Start My Free Assessment" — **button only, no `href`/handler, unwired** (inconsistent with WLHero's primary CTA, which does link to `/intake/weight-loss`).
- Secondary CTA "See Plans" — **unwired**.
- Microcopy + pricing disclaimer (same $249→$299 promotional-rate language as WLHero, restated).

**Footer** — shared, see §5.

---

## 5. Shared Nav and Footer

### 5.1 Nav (`home/Nav.tsx`)
- `AnnouncementBar` (36px) + sticky `<header>` (`sticky top-[36px] z-40`) that is transparent over the hero and crossfades to a white/blurred glass bar (`backdrop-blur-xl`) once the user scrolls past a computed threshold (hero height minus header+announcement height, via `useEffect`/scroll listener — recalculated on resize).
- Logo (`blissley-logo` asset) → links to `/`; inverted/white while transparent, normal color once scrolled.
- Desktop (`lg:`) center nav: a floating glass "pill" containing 6 links:
  - **Treatments** (`href="#"`, has a hover dropdown menu with 7 sub-items: Weight Loss → `/weight-loss`, Hair Loss, Skincare, Longevity, Mental Health, Menopause, Testosterone — **6 of 7 submenu items are `href="#"`, unwired**)
  - **Weight Loss** → `/weight-loss` (real)
  - **Skin** (`#`, unwired)
  - **Sexual Health** (`#`, unwired)
  - **About** (`#`, unwired)
  - **Insights** (`#`, unwired)
- Desktop right-side actions: "Login" → **`/login`**, "Get Started" → **`/intake`** (pill button, spring hover).
- Mobile/tablet (`<lg`): a "Get started" pill (→ `/intake`) plus a hamburger button that opens a full-screen slide-in panel (`AnimatePresence`, slides in from `x: 100%`) with ambient coral/white blurred glow blobs, a link list (Treatments, Weight Loss → `/weight-loss`, Skin, Sexual Health, Longevity, About, Insights — **all but Weight Loss are `href="#"`, unwired**), and two bottom actions: "Start Assessment" → `/intake`, "Login" → `/login`. Closing sets `document.body.style.overflow` back to normal (scroll lock while open).

### 5.2 Footer (`home/Footer.tsx`)
- Dark (`bg-ink`) footer with a large heading ("Become / who you were always supposed to be.") and tagline on the left, plus two link columns on the right:
  - **Treatments** column: Treatments, Weight Loss, Skin & Hair, Sexual Health, Longevity — **all five list items use `href="#"`, none are wired to real routes** (including "Weight Loss," which does not link to `/weight-loss` here, unlike the Nav).
  - **Company** column: About, Blog, Contact, FAQ, Careers — **all `href="#"`, unwired**.
- Legal link row (real routes): Privacy Policy → `/privacy`, Terms → `/terms`, Shipping → `/shipping`, Refund Policy → `/refund`, Medication Safety → `/medication-safety`.
- Payment-method icon row: inline SVG marks for Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, Shop Pay, Klarna, Maestro — **decorative only; the site has no live checkout, so these are illustrative trust badges, not indicators of integrated payment processors**.
- Copyright line "© 2026 TheFactual LLC DBA Blissley" and a disclaimer: "Blissley is a technology platform and does not provide medical advice. Physician services are provided by independent licensed practitioners. Individual results may vary."
- A giant full-width inverted logo watermark image beneath the content, purely decorative (`draggable={false}`, `select-none`).

---

## 6. Legal / policy pages

### 6.1 Shared shell — `LegalPage` (`src/components/legal/LegalPage.tsx`)
Props: `eyebrow: string`, `title: string`, `content: string` (raw markdown).

Rendering:
- Mounts `SmoothScroll` directly (Lenis smooth-scroll, always on for legal pages — not deferred like the marketing pages, which use `DeferredEffects` instead).
- `AnnouncementBar` + `Nav` + a header section with a radial coral glow background, a "← Back to home" link (`Link to="/"`), an eyebrow pill (colored dot + `eyebrow` text), and an `H1` built by splitting `title` on spaces and italicizing only the last word (serif italic) — e.g. "Terms & Conditions" renders as "Terms & *Conditions*".
- Main content: `content` markdown rendered via `react-markdown` + `remark-gfm` inside an `<article className="legal-prose">` wrapper (see §7.4 for the `.legal-prose` typographic styling), wrapped in a `Reveal` fade-in.
- A "Questions?" contact card below the content: static copy inviting the user to email **support@blissley.com** ("a real human will get back to you").
- `Footer` at the end.

### 6.2 Markdown content loading
Each legal route imports its content as a raw string using Vite's `?raw` import suffix, e.g.:
```
import content from "@/content/legal/terms-and-conditions.md?raw";
```
Files live in `src/content/legal/`:

| Route | File |
|---|---|
| `/terms` | `terms-and-conditions.md` |
| `/privacy` | `privacy-policy.md` |
| `/refund` | `refund-policy.md` |
| `/shipping` | `shipping-policy.md` |
| `/medication-safety` | `medication-safety-information.md` |

There is no CMS, database, or build-time processing beyond the raw string import — content is authored directly as Markdown files in the repo and rendered client-side by `react-markdown`. Updating legal copy requires editing these files and redeploying.

### 6.3 Per-route SEO head and eyebrow/title

| Route | Title | Meta description | Eyebrow | H1 |
|---|---|---|---|---|
| `/terms` | `Terms & Conditions — Blissley` | "The terms that govern your use of the Blissley platform." | "Legal" | "Terms & *Conditions*" |
| `/privacy` | `Privacy Policy — Blissley` | "How Blissley collects, uses, and protects your information." | "Legal" | "Privacy *Policy*" |
| `/refund` | `Refund Policy — Blissley` | "Transparent, honest billing. When refunds are available and how to request them." | "Legal" | "Refund *Policy*" |
| `/shipping` | `Shipping Policy — Blissley` | "How your medication is processed, prepared, and shipped." | "Legal" | "Shipping *Policy*" |
| `/medication-safety` | `Medication Safety Information — Blissley` | "Important information about medications prescribed through Blissley." | "Safety" | "Medication *Safety*" |

Each also sets matching `og:title`/`og:description`; none of the legal routes set `og:url`, canonical link, or Twitter-specific tags (they rely on the root route's defaults for anything not overridden — note the root's Twitter/OG image is the generic preview screenshot, so legal pages inherit that placeholder image too).

### 6.4 Content summary (per file, high level)
- **terms-and-conditions.md**: "Last Updated: July 16, 2026." Covers acceptance of terms, age restriction (18+), and the nature of Blissley as a technology platform connecting users to independent Providers/Medical Groups/Pharmacies (explicitly not a medical practice).
- **privacy-policy.md**: "Effective/Last Updated: July 16, 2026." Describes information collected directly from users (contact info, demographics, physical attributes like height/weight/goal weight) and is incorporated into the Terms.
- **refund-policy.md**: "Last Updated: July 16, 2026." States the "never surprise you" billing commitment and full-refund eligibility conditions for prescription products.
- **shipping-policy.md**: "Last Updated: July 16, 2026." Describes the intake → physician review (24 hrs, or 6 hrs with "Priority Physician Review") → prescription → 503A pharmacy compounding (1-2 business days) → cold-chain shipment pipeline.
- **medication-safety-information.md**: "Last Updated: July 16, 2026." Explains Blissley is a platform (not a medical practice/pharmacy), and distinguishes compounded vs. FDA-approved medications.

All five carry the same "Last Updated: July 16, 2026" date, suggesting they were authored/updated together as a batch rather than independently versioned.

---

## 7. Shared motion/scroll primitives

### 7.1 `Reveal` (`src/components/Reveal.tsx`)
Scroll-triggered fade/slide/blur-in wrapper built on Framer Motion's `useInView` (`once: true`, `margin: "-10% 0px -10% 0px"`).

Props:
| Prop | Type | Default | Effect |
|---|---|---|---|
| `children` | `ReactNode` | — | content to animate |
| `delay` | `number` | `0` | animation start delay (s) |
| `y` | `number` | `20` | initial vertical offset (px), animates to 0 |
| `blur` | `number` | `0` | initial blur radius (px); 0 disables the blur effect entirely |
| `className` | `string` | — | passed to the wrapping `motion.div` |

Animates `opacity`, `y`, and `filter: blur(...)` from the initial state to `{opacity:1, y:0, blur:0}` over `duration: 0.8`, `ease: [0.22, 1, 0.36, 1]` once the element enters the viewport; never re-triggers (fires once). Used pervasively across both marketing pages and the legal page header/content for staggered entrance animation.

### 7.2 `SmoothScroll` (`src/components/SmoothScroll.tsx`)
Thin wrapper around the `lenis` library. On mount, instantiates `new Lenis({ duration: 1.15, easing: t => 1.001 - 2^(-10t) (clamped), smoothWheel: true })` and drives it with a `requestAnimationFrame` loop; cleans up (`cancelAnimationFrame` + `lenis.destroy()`) on unmount. Renders nothing (`return null`) — purely a side-effect component. Mounted unconditionally on legal pages, and only after idle on marketing pages via `DeferredEffects` (§7.6).

### 7.3 `ProgressiveBlur` (`src/components/ProgressiveBlur.tsx`)
Fixed overlay pinned to one edge of the viewport (`side: "bottom" | "top"`, default `"bottom"`) that stacks multiple `backdrop-filter: blur(...)` layers with linear-gradient CSS masks so blur strength ramps up toward the edge and fades to nothing toward the content — mimics Framer's "Progressive Blur" effect (e.g., used to visually soften content sliding under a bottom bar).

Props:
| Prop | Type | Default |
|---|---|---|
| `side` | `"bottom" \| "top"` | `"bottom"` |
| `height` | `number` (px) | `140` |
| `layers` | `number` | `5` |
| `maxBlur` | `number` (px) | `12` |
| `activateAfter` | `number` (scrollY px) | `0` |
| `className` | `string` | — |

If `activateAfter > 0`, the overlay is hidden (`opacity-0`, CSS-transitioned) until `window.scrollY` exceeds that threshold; with the default `0` it's visible immediately. Purely decorative/`aria-hidden`, `pointer-events-none`. Currently only instantiated by `DeferredEffects` with `activateAfter={0}` (always visible once mounted).

### 7.4 `CountUp` (`src/components/CountUp.tsx`)
Animates a number from 0 to `to` once the element scrolls into view (`useInView`, `once: true`, `margin: "-15% 0px"`), using Framer Motion's `animate()` imperative API to drive a React state update on each frame.

Props: `to: number` (required), `duration?: number` (default `1.6`s), `format?: (n:number)=>string` (custom renderer; defaults to `Math.round(value).toLocaleString("en-US")`), `className?: string`. Renders a `<span>`. Used by the homepage `Numbers` section for the four hero statistics.

### 7.5 `MotionButton` / `MotionLink` (`src/components/MotionButton.tsx`)
Shared tactile-hover primitives wrapping `motion.button`/`motion.a` with a forwarded ref. Both accept a `lift?: boolean` prop (default `true`): when `true`, hover animates `{scale: 1.02, y: -1}`; when `false`, just `{scale: 1.02}`. Tap always animates `{scale: 0.97}`. Transition is a spring (`stiffness: 420, damping: 26`) in both cases. All other props pass through to the underlying Framer Motion element.

**Note:** most buttons across the homepage/weight-loss sections use inline `motion.button`/`motion.a` with their own hover/tap springs rather than importing `MotionButton`/`MotionLink` directly — the shared primitive exists as a reusable option but is not the exclusive mechanism used in the marketing components read for this document.

### 7.6 `DeferredEffects` (`src/components/DeferredEffects.tsx`)
Performance-oriented loader: on mount, waits for `requestIdleCallback` (timeout 1500ms) or, if unsupported, a `setTimeout` fallback of 800ms, then flips `ready` to `true`. Once ready, renders `<SmoothScroll />` and `<ProgressiveBlur side="bottom" height={140} layers={5} maxBlur={12} activateAfter={0} />`. Ensures Lenis and the blur overlay never compete with LCP/TTI on first paint. Mounted at the very end of both the homepage and weight-loss page trees, inside a `<Suspense fallback={null}>` (it's also lazy-imported).

---

## 8. Design token system (`src/styles.css`)

### 8.1 Build setup
Tailwind v4 CSS-first config: `@import "tailwindcss" source(none)` with an explicit `@source "../src"` scan path, plus `tw-animate-css` import and a `@custom-variant dark (&:is(.dark *))` (dark mode is defined but not otherwise wired up in the marketing UI reviewed here).

### 8.2 Brand palette (`@theme` block)
Defined as non-inline theme variables so Tailwind compiles utilities to `var(--color-*)` (allowing descendant scopes to rebind them, see §8.5):

| Token | Hex | Utility class prefix |
|---|---|---|
| `--color-canvas` | `#ffffff` | `bg-canvas`, `text-canvas` |
| `--color-ink` | `#171717` | `bg-ink`, `text-ink` |
| `--color-ever` | `#ee7273` | `bg-ever`, `text-ever` (primary coral accent) |
| `--color-marine` | `#1D437B` | `bg-marine`, etc. |
| `--color-mist` | `#d8d2c7` | |
| `--color-bluebell` | `#8b9bb4` | |
| `--color-honey` | `#c4a265` | |
| `--color-blush` | `#c4998a` | |
| `--color-check` | `#4a7c6f` | |
| `--color-hairline` | `#e8e4dc` | used for hairline borders (e.g. FAQ dividers) |

Note: many components also use raw hex literals directly in Tailwind arbitrary-value classes (e.g. `text-[#ee7273]`, `bg-[#f4f2ee]`, `text-[#6B6B6B]`) rather than the token utilities — the token system is not used with full consistency throughout the marketing components.

### 8.3 Radius scale (`@theme inline`)
Derived from a single `--radius: 0.75rem` root variable:
`--radius-sm` = radius − 4px, `-md` = radius − 2px, `-lg` = radius, `-xl` = radius + 4px, `-2xl` = +8px, `-3xl` = +12px, `-4xl` = +16px.

### 8.4 Typography
- `--font-display`, `--font-sans`, `--font-hero` all resolve to the same stack: `"Google Sans Flex", "Google Sans Flex Placeholder", "Manrope", ui-sans-serif, system-ui, sans-serif`.
- `--font-serif`: `"Manrope", "Google Sans Flex", ui-sans-serif, system-ui, sans-serif` (used for italic accent words like "*always*" / "*tailored*" throughout headlines — despite the name, it is not an actual serif typeface, just the same sans stack in a different order).
- Fonts are loaded via Google Fonts `<link>` in the root route (`Google Sans Flex` variable font + `Manrope` static weights 400–800).
- `.font-hero` utility class forces `--font-hero` on the element and its `h1`–`h4` descendants.
- Base `body` sets `font-family: var(--font-hero)` and enables `font-feature-settings: "ss01", "cv11"`; headings (`h1–h4`) get `font-weight: 700; letter-spacing: -0.02em` by default (many components override this per-heading with inline classes).
- Global: antialiased font smoothing, `text-rendering: optimizeLegibility`, custom text-selection color (`::selection` → `--color-ever` bg / `--color-canvas` text).

### 8.5 Shadcn semantic color mapping
A parallel `@theme inline` block maps shadcn/ui's semantic tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, plus `-foreground` variants) to CSS custom properties defined in `:root` (e.g. `--primary: #171717`, `--accent: #ee7273`, `--destructive: #c4998a`). This is the token set consumed by shadcn/ui primitives used elsewhere in the app (not directly exercised by the hand-styled marketing components documented here, which mostly use the brand palette / raw hex values instead).

### 8.6 Custom component-layer utilities
- `.no-scrollbar` — hides scrollbars cross-browser (used for horizontal snap sliders: CategoryGrid, Products, SocialProof, WLSocialProof, WLBeforeAfter).
- `.intake-none-pill` (+ `[data-selected="true"]`, `.intake-none-pill__check`) — styled selectable pill control using `color-mix(in oklab, ...)` for opacity-mixed borders/backgrounds; toggles to a solid `--color-ever` fill + coral glow shadow when `data-selected="true"`. (Belongs to the intake flow, not the marketing pages covered in depth here, but defined in the same global stylesheet.)
- `.legal-prose` — the full typographic system for rendered legal Markdown: base text at `color-mix(ink 78%)`/15.5px/1.75 line-height; `h1`/`h2`/`h3` styled with `--font-hero`, tightened letter-spacing, and generous top margins; paragraphs, `strong`, links (coral, underlined), lists (custom coral `::marker`), `hr`, `blockquote` (coral left border, italic), `code` (tinted background pill), and `table`/`thead`/`th`/`td` (bordered, horizontally scrollable, coral-tinted header) — this is the sole styling layer for all five legal pages' body content.

### 8.7 Admin scope override
`.admin-scope` (the root class of the admin dashboard shell, out of scope for this document but present in the same stylesheet) rebinds the brand tokens to a different indigo/violet/sky/amber/emerald palette (e.g. `--color-canvas: #f6f6f7`, `--color-marine: #2563eb`, `--color-check: #10b981`) purely by cascading CSS variable overrides — the marketing site's own token values and components are completely unaffected since the override only applies inside `.admin-scope` descendants. This confirms the brand `@theme` variables were deliberately kept "non-inline" specifically to support this kind of scoped re-theming.

---

## 9. Cross-cutting observations / flags

- **Extensive unwired CTAs**: a large fraction of buttons and links across both marketing pages use `href="#"` or no `href`/`onClick` at all — including most Nav submenu items, most Footer link columns, "All our Treatments," all `FeaturedPrograms` cards, "Get Started" on `Products` cards, "View all treatments," `FinalCTA`/`WLFinalCTA` primary and secondary buttons, `HowItWorks` "Start Your Free Assessment," and the `WLCalculator`'s `#assessment` anchor (target doesn't exist). Only a handful of real conversion paths exist: `/intake`, `/intake/weight-loss`, `/login`, and the `/weight-loss` nav/category links.
- **Duplicated component logic**: `SocialProof`/`WLSocialProof` and (conceptually) `CategoryGrid`'s slider vs. `WLBeforeAfter`'s slider all reimplement near-identical autoplay/scroll-tracking/pause carousel logic independently rather than sharing one carousel primitive.
- **Hardcoded, non-CMS content**: reviews (`SocialProof`, `WLSocialProof`), before/after case studies (`WLBeforeAfter`), press logos (`PressLogos`), and stats (`Numbers`, header trust lines) are all static in-component arrays/strings — there is no backing data source, and some numbers are inconsistent between pages (e.g. "4.96 TrustScore · 3,826 reviews" on the homepage vs. "4.8 out of 5 · 3,000+ reviews" on `/weight-loss`).
- **Third-party hotlinked assets**: `PressLogos` logos are pulled live from external CDNs (vectorlogo.zone, Wikipedia, framerusercontent.com) rather than being self-hosted brand assets — a production/legal risk if usage rights aren't secured, and a runtime dependency on those CDNs staying up.
- **Placeholder OG/Twitter image**: the root route's `og:image`/`twitter:image` is a Lovable-generated preview screenshot URL, not branded marketing artwork — every route that doesn't override it (all five legal pages) will show this same placeholder image in social link previews.
- **Dead/unused components**: `home/ValueStack.tsx` and `home/Placeholder.tsx` are fully built components with no import sites in either marketing route — either leftover from an earlier iteration or reserved for future use.
- **WLCalculator's projections are illustrative only**: the "You could lose up to N lbs" figure and the Chart.js trend lines are simple client-side percentage math (78%/85% of entered weight with a cubic ease), not derived from real clinical data per-user — the disclaimer text partially acknowledges this ("Based on published clinical trial averages... not guaranteed") but the tool visually presents as a personalized calculator.
- **Payment icons in Footer are decorative**: there is no visible checkout/payment flow in the marketing pages, so the Visa/Mastercard/Amex/PayPal/Apple Pay/Google Pay/Shop Pay/Klarna/Maestro icon row functions purely as a trust signal, not proof of integrated payment rails.
