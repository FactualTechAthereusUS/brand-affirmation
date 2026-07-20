# Desktop optimization for /portal/patient

Right now the portal is a single 440px-wide phone frame centered on a huge desktop canvas. We'll transform it into a proper desktop web app at `md:` breakpoints while leaving the mobile UI untouched.

## Layout shell (src/routes/portal.patient.tsx)

Replace the centered "phone card" wrapper with a responsive shell:

- **Mobile (<768px)**: unchanged — full-width app with bottom `TabBar`.
- **Desktop (≥768px)**: full-viewport app with:
  - Left **sidebar nav** (240px, sticky, full-height): Blissley logo, greeting, 4 primary tabs (Home / Messages / My Plan / Settings) as vertical rail items with icon + label + active pill, plus a bottom block with notifications bell, dev switcher trigger, and log-out.
  - **Top bar** (desktop only): page title for current tab, right-aligned search-less header with saved-card chip and notifications bell (hidden on desktop since it's in sidebar) — keep minimal.
  - **Main content area**: max-width ~1200px, generous padding (`px-10 py-8`), no phone frame, no rounded card shadow.
  - Hide the mobile `TabBar` on `md:` (`md:hidden`), hide the sidebar on mobile (`hidden md:flex`).

```text
┌─────────┬──────────────────────────────────┐
│  LOGO   │  Page title                       │
│         ├──────────────────────────────────┤
│ ▸ Home  │                                   │
│  Msgs   │  Tab content (2-col where useful) │
│  Plan   │                                   │
│  Setts  │                                   │
│         │                                   │
│ 🔔 Log  │                                   │
└─────────┴──────────────────────────────────┘
```

## Per-tab desktop layouts

Content components already exist and render fine — we add responsive grids around their internal cards so they use the wider canvas instead of stacking.

- **HomeTab**: 12-col grid on `lg:`.
  - Left column (8): Plan state hero card (approval/shipment/active), Progress + Weight chart card.
  - Right column (4): Next check-in card, Care team card, Quick actions (Track / Log weight / Message).
- **MessagesTab**: two-pane layout on `md:` — thread list left (320px), open conversation right. Mobile keeps the current push-navigation.
- **PlanTab**: 2-col on `lg:` — plan summary + shipments left, billing + address + pause/cancel right.
- **SettingsTab**: 2-col on `lg:` — account/notifications left, documents/legal/log-out right; keep hairline white cards.

## Modals & sheets

- `NotificationsSheet`, `DocumentsSheet`, `TrackingModal`, `ReceiptModal`, `PlanModalRoot`: on desktop render as centered modal dialogs (max-w-lg, rounded-2xl, backdrop) instead of bottom sheets. Mobile keeps sheet behavior. Single conditional via `useMobile` hook already in project (`src/hooks/use-mobile.tsx`).

## Onboarding

Full-bleed on mobile; on desktop render inside a centered `max-w-2xl` card so the full-screen tour doesn't feel awkward on a 27" display.

## Scope guardrails

- No business-logic changes — store, state machine, auto-progression, and content stay identical.
- No new routes, no new assets.
- Purely responsive presentation: Tailwind `md:`/`lg:` classes, conditional wrappers, and a new `SideNav` component inside the same file.
- Mobile pixels remain byte-identical where possible.

## Files touched

- `src/routes/portal.patient.tsx` — shell refactor, add `SideNav` + `DesktopHeader`, add responsive grids inside each tab, `md:`-gate the mobile `TabBar`, adapt sheet/modal wrappers.
