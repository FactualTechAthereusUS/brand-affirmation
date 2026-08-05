# Blissley Platform Specification

This is the master specification for the Blissley telehealth platform as it exists in code today. Every statement here is derived from the source, not from intent. Anything demo-only, seeded, or simulated is labelled as such.

## Document map

| Document | Covers |
| --- | --- |
| `00-index.md` (this file) | Architecture, route map, roles, design system, tenancy, end-to-end flow narratives |
| `01-admin-dashboard.md` | All admin sections, detail screens, BUILD suite, and the 9-page settings suite |
| `02-physician-portal.md` | `/portal/physician`, `/login/physician`, case queue and prescribing |
| `03-patient-portal.md` | `/portal/patient`, magic-link login, plan/messages/check-ins |
| `04-funnel.md` | Sales pages, intake flows, checkout variants, confirmation pages |
| `05-emails.md` | Email flows, individual emails, triggers, email design system |
| `06-data-model.md` | Store slices, entity field tables, actions, derived metrics, Supabase table |
| `07-marketing-site.md` | Homepage, weight-loss pages, legal pages, tokens and motion primitives |

## What the platform is

Blissley is a direct-to-consumer telehealth brand (GLP-1 weight loss as the flagship program) plus the operating system that runs it. The product has four distinct surfaces:

1. **Marketing and funnel** — public pages that acquire a visitor and convert them into a paying patient: homepage, program pages, presell/sales pages, intake questionnaires, checkout, confirmation.
2. **Admin panel** (`/admin/*`) — the operator cockpit: growth analytics, clinical operations, fulfillment, payments, messaging, integrations, team, settings, and a whitelabel BUILD suite.
3. **Physician portal** (`/portal/physician`) — the licensed prescriber's workspace: case queue, clinical review, approve/deny/request-info, prescription building, refills.
4. **Patient portal** (`/portal/patient`) — the patient's mobile-first app: plan, shipments, dose progress, check-ins, messaging with care team, billing and settings.

A fifth, cross-cutting concept is **whitelabel tenancy**: the same admin panel can be operated by another brand ("the Shopify of telehealth"). Tenant switching is demonstrated through the long-press-logo demo variant sheet.

## Technical architecture

- **Framework**: TanStack Start v1 (React 19, file-based routing under `src/routes`, Vite 7). Route metadata is set per route via `head()`.
- **Styling**: Tailwind CSS v4 configured entirely through `src/styles.css` using `@theme` tokens. No `tailwind.config.js`.
- **State**: Zustand stores with `persist` to localStorage. Three stores:
  - `src/lib/admin/store.ts` — the operator system of record (patients, leads, orders, payments, conversations, integrations, settings, tenants, build slice).
  - `src/lib/physician/store.ts` — physician case queue and clinical decisions.
  - `src/lib/portal/store.ts` — patient-portal state.
  Seed data lives in `src/lib/admin/seeds.ts`; derived metrics in `analytics.ts`, `cro.ts`, `selectors.ts`, and the `*-enrich.ts` modules.
- **Backend**: Lovable Cloud. One table is live today — `admin_leads` — used to capture funnel leads. It is service-role-only at the policy level, so writes go through trusted server code, not the browser. Everything else in the admin panel runs on the seeded client store, which is why the panel is fully interactive without a backend round trip.
- **Assets**: all images are project-local under `public/assets/` and referenced as `/assets/<file>`. No CDN-managed asset URLs.
- **Charts**: hand-built SVG components under `src/components/admin/analytics/` (AreaChart, BarChart, LineChartMini, Donut, Heatmap, HBar, BreakdownBars, FunnelFlow) plus `Sparkline.tsx`. They are deterministic and SSR-safe — no `Math.random()` or `Date.now()` at render time — so server and client HTML match.
- **3D**: the Live View globe uses `three-globe`, loaded client-side only.

## Route map

### Public / funnel

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `index.tsx` | Homepage (13 sections) |
| `/weight-loss` | `weight-loss.index.tsx` | Weight-loss program page |
| `/weight-loss/sales` | `weight-loss.sales.tsx` | Long-form weight-loss sales page (14 sections) |
| `/sales/trimrx` | `sales.trimrx.tsx` | Sales page variant, TrimRx-modelled |
| `/sales/DM` | `sales.DM.tsx` | Sales page variant, DirectMeds-modelled |
| `/intake` | `intake.tsx` | Broad multi-category intake |
| `/intake/weight-loss` | `intake_.weight-loss.tsx` | Weight-loss-specific intake (12 screens) |
| `/intake/weight-loss-trimrx` | `intake_.weight-loss-trimrx.tsx` | TrimRx-cloned intake |
| `/intake/weight-loss-trimrx-2` | `intake_.weight-loss-trimrx-2.tsx` | TrimRx intake, v2 |
| `/intake/weightloss-3` | `intake_.weightloss-3.tsx` | Intake variant 3 |
| `/intake/new-weightloss-ours` | `intake_.new-weightloss-ours.tsx` | Blissley-native intake, full-bleed iOS-style |
| `/checkout/trimrx` | `checkout.trimrx.tsx` | Primary checkout |
| `/checkout/charged-before` | `checkout.charged-before.tsx` | Returning-card / $0-due-today checkout |
| `/checkout/UI-template3` | `checkout.UI-template3.tsx` | Checkout layout variant |
| `/confirmation` | `confirmation.tsx` | Post-purchase confirmation + OTO |
| `/confirmation-charged` | `confirmation-charged.tsx` | Confirmation for pre-charged card |
| `/emails` | `emails.tsx` | Email flow gallery / preview harness |
| `/terms`, `/privacy`, `/refund`, `/shipping`, `/medication-safety` | respective files | Legal documents rendered by `LegalPage.tsx` from markdown in `src/content/legal/` |

### Auth

| Route | Purpose |
| --- | --- |
| `/login` | Patient login (split editorial layout) |
| `/login/admin` | Operator login |
| `/login/physician` | Prescriber login |

### Portals

| Route | Purpose |
| --- | --- |
| `/portal/patient` | Patient app (tabbed) |
| `/portal/physician` | Prescriber workspace |

### Admin

| Route | Section |
| --- | --- |
| `/admin` | Home / operator overview |
| `/admin/live` | Live View (3D globe + realtime metrics) |
| `/admin/analytics` | Analytics overview |
| `/admin/analytics/funnel` | Funnel & CRO |
| `/admin/analytics/acquisition` | Acquisition |
| `/admin/analytics/retention` | Retention |
| `/admin/analytics/finances` | Finances |
| `/admin/patients`, `/admin/patients/$id` | Patient list + clinical workspace |
| `/admin/leads`, `/admin/leads/$id` | Lead list + lead workspace |
| `/admin/orders`, `/admin/orders/$id` | Order list + order detail |
| `/admin/physician-queue`, `/admin/physician-queue/$id` | Clinical queue (operator view) |
| `/admin/check-ins`, `/admin/check-ins/$id` | Patient check-ins |
| `/admin/payments` | Payments, refunds, disputes |
| `/admin/pharmacy` | Pharmacy fulfillment pipeline |
| `/admin/messages` | Unified inbox |
| `/admin/integrations`, `/admin/integrations/$id` | Integration marketplace + detail |
| `/admin/team` | Team and roles |
| `/admin/reports` | Report builder / exports |
| `/admin/command` | Command palette surface |
| `/admin/build/funnel` | Funnel builder |
| `/admin/build/intake` | Intake builder |
| `/admin/build/products` | Products and pricing |
| `/admin/build/emails` | Email flows |
| `/admin/build/pages` | Page builder |
| `/admin/settings/*` | 9 settings pages: general, plan-billing, team, pharmacy-routing, states, notifications, integrations, compliance, legal (`/admin/settings` redirects to `general`) |

## Roles

| Role | Surface | Can do |
| --- | --- | --- |
| Visitor | Marketing + funnel | Browse, take intake, checkout |
| Patient | `/portal/patient` | View plan, shipments, dose progress, submit check-ins, message care team, manage billing |
| Physician | `/portal/physician` | Review cases, approve/deny/request info, build and e-sign prescriptions, handle refills, message patients |
| Operator / Admin | `/admin/*` | Everything else: growth, clinical ops, fulfillment, payments, support, configuration |

Role display in the admin shell is hydration-guarded (a `mounted` flag) so the server-rendered placeholder never mismatches the client's session-derived identity.

## Design system

Tokens are defined once in `src/styles.css` and rebound per scope. Components never hardcode colors.

### Brand palette (marketing, portals, funnel)

| Token | Value | Use |
| --- | --- | --- |
| `--color-canvas` | `#ffffff` | Page background |
| `--color-ink` | `#171717` | Primary text |
| `--color-ever` | `#ee7273` | Brand coral/pink — primary accent, CTAs, rating stars |
| `--color-marine` | `#1D437B` | Deep blue, secondary/clinical accent |
| `--color-mist` | `#d8d2c7` | Muted surface |
| `--color-bluebell` | `#8b9bb4` | Muted text/accent |
| `--color-honey` | `#c4a265` | Warm highlight |
| `--color-blush` | `#c4998a` | Soft highlight |
| `--color-check` | `#4a7c6f` | Success / verified |
| `--color-hairline` | `#e8e4dc` | Borders |

### Admin palette (`.admin-scope`)

The AdminShell root rebinds the same token names, so the entire admin area recolors without touching the marketing site.

| Token | Value | Meaning in admin |
| --- | --- | --- |
| `--color-canvas` | `#f6f6f7` | Page background |
| `--color-ink` | `#0f172a` | Primary text (slate-900) |
| `--color-marine` | `#2563eb` | Indigo — primary accent, active nav |
| `--color-bluebell` | `#7c3aed` | Violet — MRR / secondary accent |
| `--color-check` | `#10b981` | Emerald — success, positive delta |
| `--color-honey` | `#f59e0b` | Amber — warning, AOV |
| `--color-ever` / `--color-blush` | `#ee7273` | Coral — danger, failed payment, churn |
| `--color-mist` / `--color-hairline` | `#e5e7eb` | Hairlines |

Selection color inside the admin is indigo on white.

### Typography

One family across the product: **Google Sans Flex** with `Manrope` as fallback, exposed as `--font-display`, `--font-sans`, `--font-hero`, and `--font-serif` (all mapped to the same stack). Editorial weight comes from size, weight, and tracking — not from a second typeface.

### Motion and interaction primitives

| Component | Behaviour |
| --- | --- |
| `SmoothScroll.tsx` | Lenis-based inertial scrolling on marketing pages |
| `Reveal.tsx` | Framer Motion scroll-in reveal wrapper |
| `CountUp.tsx` | Animated numeric counters |
| `MotionButton.tsx` | Press/hover spring feedback |
| `ProgressiveBlur.tsx` | Edge blur masks (used in review sliders) |
| `Stepper.tsx` | Admin/portal step indicators |

### Density rules

Admin surfaces follow a Shopify-grade density model: hairline borders instead of shadows, no circular icon backgrounds, full-viewport width (no `max-w` clamp in `AdminShell`), 11–13.5px type scale, uppercase micro-labels with wide tracking, and status conveyed by pill tone rather than color-filled rows.

## Whitelabel tenancy

Defined in `src/lib/admin/store.ts` as `BrandTenant`, with `TenantStage = "zero" | "ramping" | "live"` and an `onboardingStep` 0–6 (6 = live).

| Tenant | Stage | Onboarding step | Primary / accent | Represents |
| --- | --- | --- | --- | --- |
| Blissley | `live` | 6 | `#2563eb` / `#7c3aed` | Mature brand at full volume |
| Nova Health | `ramping` | 6 | `#0ea5e9` / `#10b981` | Brand with early sales, growing |
| ZeroCo | `zero` | 0 | `#ee7273` / `#f59e0b` | Brand that just onboarded, zero sales |

Switching tenants (`switchTenant`) replaces the scenario data with a volume appropriate to that tenant's stage, so every screen — dashboards, charts, tables, empty states, onboarding checklists — renders the correct story for a brand at that maturity. The switch is written to the audit log ("Switched brand tenant"). `updateTenant` patches brand fields; `advanceOnboarding` monotonically raises `onboardingStep` and flips `stage` to `live` at step 6. The switcher UI is `DemoVariantSheet.tsx`, opened by long-pressing the admin logo.

## End-to-end flow narratives

### 1. Visitor to paying patient

```text
Ad / organic
  → presell or advertorial            (~34-40% of sessions)
  → sales page                        (direct sessions + presell clicks)
  → intake start                      CTA click
  → intake completion                 clinical + identity questions answered
  → checkout start                    plan selected
  → purchase                          payment captured
  → confirmation (+ OTO offer)
  → lead promoted to patient, case enters physician queue
```

Lead identity, program, BMI, eligibility, attribution, consent, and cart are captured progressively; the funnel step and progress percentage are recorded so an abandoned lead is recoverable from `/admin/leads`.

### 2. Lead scoring and CRO derivation

Each lead carries `score`, `intent` (cold/warm/hot), `funnel_step`, `progress_pct`, `projected_first_order`, and `projected_ltv`. Conversion analytics are derived deterministically from `AdminState.funnelDays` by `src/lib/admin/cro.ts`, which reconstructs the per-day step model:

```text
sessions
  → presellViews    = sessions x presellShare        (0.34-0.40)
  → presellClicks   = presellViews x presellCtr      (0.52-0.62)
  → salesViews      = sessions - presellViews + presellClicks
  → salesClicks     = max(intakeStarts, intakeStarts x 1.08-1.17)
  → salesBounces    = salesViews x bounceRate        (0.41-0.49)
  → intakeStarts    = funnelDay.intakeStarted
  → intakeCompletions = min(intakeStarts, funnelDay.intakeCompleted)
  → checkoutStarts  = clamped between purchases and intakeCompletions
  → purchases       = min(intakeCompletions, funnelDay.paid)
```

The share/CTR/bounce coefficients come from a deterministic hash of the day timestamp (`jitter(ts, salt)`), never from randomness, which keeps SSR and client output identical. Every step is clamped so the waterfall is monotonic — the funnel can never show a negative drop. Screen-level drop-off is joined against `build.intakeScreens`, so the intake builder and the drop-off table describe the same screens.

### 3. Prescription lifecycle

```text
Intake completed
  → case created in physician queue        (priority, SLA clock)
  → physician review: chart, answers, photos, flags
  → decision: approve | deny | request more info
       approve  → prescription built (molecule, form, strength, titration)
                → pharmacy routed by rule (primary, backup on failure)
                → order created, label + tracking, shipped
       deny     → loss reason recorded, patient notified
       info     → message sent, case parked pending patient reply
  → month 3+: refill / titration escalation, new order
```

**Version A titration rule (compliance-enforced).** Semaglutide via South End must follow Version A: months 1–2 use SE1.5 (1.5 mg/mL starter vial), month 3 onward uses SE5 (5 mg/mL maintenance vial), with a 28-day post-puncture discard. Version B (a single 5 mg/mL vial from month 1) is prohibited by South End and FDA/USP rules. The rule is a toggle in Settings → Pharmacy Routing (`versionAEnforced`); when enforced, the Rx builder refuses non-compliant vials, and the setting records who confirmed it and when.

### 4. Check-ins and dose escalation

Patients submit periodic check-ins (weight, side effects, adherence, questions). Check-ins land in `/admin/check-ins` and feed the patient's dose-progress view. Escalation to a higher strength is gated on check-in data and a prescriber decision — it is never automatic.

### 5. Messaging

One conversation model spans patient, admin, and physician participants, with channels and folders. Sending is optimistic (the message appears immediately, then settles), inbound replies are simulated for demo realism, and threads support snoozing, assignment, and search. The admin inbox is a multi-pane layout (folders, thread list, thread, context panel) and collapses to a single pane on mobile.

### 6. Whitelabel onboarding

A new brand lands on the admin with `stage: "zero"`: empty dashboards with instructional empty states, and a 0–6 onboarding checklist (brand, products/pricing, funnel, intake, pharmacy routing, integrations, go live). The BUILD suite is where the brand assembles its own funnel, intake questionnaire, product catalog, email flows, and pages before flipping to `live`.

## Reading order

For a full understanding, read in this order: this file, then `06-data-model.md` (the vocabulary everything else uses), then `04-funnel.md` (how demand enters), then `01-admin-dashboard.md`, then the two portal specs, then `05-emails.md` and `07-marketing-site.md`.
