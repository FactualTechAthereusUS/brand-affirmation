# Blissley Platform Specification — full write-up

Goal: produce a complete, accurate, screen-by-screen specification of the platform as it actually exists today, derived by reading every route, store, and component — not from memory.

## What gets delivered

A set of markdown documents under `docs/specs/`, each self-contained and cross-linked from an index:

```text
docs/specs/
  00-index.md              overview, architecture, design system, tenancy model
  01-admin-dashboard.md    all 15 admin sections + 9 settings pages
  02-physician-portal.md   /portal/physician + /login/physician
  03-patient-portal.md     /portal/patient
  04-funnel.md             sales pages, intake flows, checkout, confirmation
  05-emails.md             /emails flows and triggers
  06-data-model.md         store slices, entity fields, actions, derived metrics
  07-marketing-site.md     home, weight-loss, legal pages
```

## Level of detail per screen

Every screen entry documents:

- Route path and file, and how it is reached (link, button, redirect)
- Purpose in one line, and who uses it (admin / physician / patient / visitor)
- Full layout description: regions, cards, tables, columns, charts, empty states
- Every interactive control and exactly what it does (which store action fires, what state changes, what toast appears, what navigation happens)
- Data source: which store slice / selector / derived metric feeds each number, and the formula where one exists
- Status/state variants (e.g. order lifecycle, case decision states, tenant demo variants: Live / Ramping / Empty)
- Responsive behaviour at mobile / tablet / desktop
- Known gaps: controls that render but are not yet wired

## Admin coverage (each its own section)

Home, Live View (3D globe), Analytics (Overview, Funnel & CRO, Acquisition, Retention, Finances), Patients (+ detail), Leads (+ detail), Orders (+ detail), Physician Queue (+ detail), Check-ins (+ detail), Payments, Pharmacy, Messages, Integrations (+ detail), Team, Reports, Command palette, BUILD (Funnel, Intake, Products, Emails, Pages), Settings (General, Plan & Billing, Team, Pharmacy Routing, States Served, Notifications, Integrations, Compliance & HIPAA, Legal & Policies), plus the AdminShell chrome: sidebar, header, notifications bell, long-press demo-variant sheet.

## End-to-end flow narratives

In addition to per-screen specs, `00-index.md` includes the operational walkthroughs that tie screens together:

1. Visitor → sales page → intake → checkout → confirmation → lead becomes patient
2. Lead scoring, funnel-step tracking, and how CRO metrics are derived from funnel days
3. Prescription lifecycle: intake submitted → physician queue → decision → pharmacy routing (Version A titration rule) → order → fulfillment → refill
4. Check-in cadence and dose escalation
5. Messaging: patient/admin/physician threads, optimistic send, auto-reply simulation, snooze
6. Whitelabel tenancy: what changes when switching Blissley → Nova → ZeroCo

## Method

Read each route file and its components in batches, plus `src/lib/admin/store.ts`, `cro.ts`, `selectors.ts`, `seeds.ts`, the portal and physician stores, and `src/styles.css` for the token/theme spec. Document only what the code does; flag anything that is demo-only or stubbed rather than presenting it as functional.

## Notes

- Documentation only — no application code, routes, or styles change.
- Written in plain language with technical detail kept in clearly marked subsections, so it can be handed to a developer, a designer, or an investor.
