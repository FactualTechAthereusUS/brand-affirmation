# PharmaBro — Whitelabel Telehealth Brand OS

The "Shopify of telehealth." Every clinical + ops screen is a whitelabeled clone of Blissley's `/admin`. Layered on top: a full BUILD suite (Funnel, Intake, Products, Emails, Pages) that lets a brand owner run their business without touching code. Full working demo — every action mutates real store state, persists to localStorage, logs to audit, and shows toast confirmation.

---

## 1. Route layout — all under `/pharmabro-admin/*`

```text
src/routes/
  pharmabro-admin.tsx                       ← shell + brand theming scope
  pharmabro-admin.index.tsx                 ← Home
  pharmabro-admin.live.tsx                  ← Live View
  pharmabro-admin.patients.index.tsx        ← Patients list
  pharmabro-admin.patients.$id.tsx          ← Patient detail
  pharmabro-admin.physician-queue.index.tsx
  pharmabro-admin.physician-queue.$id.tsx
  pharmabro-admin.orders.index.tsx
  pharmabro-admin.orders.$id.tsx
  pharmabro-admin.check-ins.index.tsx
  pharmabro-admin.check-ins.$id.tsx
  pharmabro-admin.messages.tsx
  pharmabro-admin.payments.tsx
  pharmabro-admin.analytics.tsx (+ acquisition/funnel/retention/finances)
  # BUILD (new)
  pharmabro-admin.build.funnel.tsx
  pharmabro-admin.build.intake.tsx
  pharmabro-admin.build.products.tsx
  pharmabro-admin.build.emails.tsx
  pharmabro-admin.build.emails.$flowId.tsx
  pharmabro-admin.build.pages.tsx
  # SETTINGS
  pharmabro-admin.settings.tsx (+ general/stripe/team/pharmacy/states/
    notifications/integrations/compliance/legal/onboarding)
```

Every clinical/ops route is a thin wrapper that imports the same **components** currently used by `/admin/*` (they already exist under `src/components/admin/*` and `src/lib/admin/store.ts`). The only change per-route: page title, breadcrumb, and reading from the brand-scoped store slice (see §3).

---

## 2. Shell + brand theming (whitelabel)

`src/components/pharmabro/BrandShell.tsx` — clone of `AdminShell.tsx` with:

- Left sidebar with three groups: **CLINICAL** (Patients, Physician Queue, Orders, Check-Ins, Messages, Payments), **BUILD** (Funnel, Intake, Products, Emails, Pages), **ANALYTICS** + **SETTINGS**.
- Top-left renders `brand.logoUrl` + `brand.name` (no "PharmaBro" anywhere).
- `.brand-scope` CSS class wrapping `<Outlet />`. Inside `src/styles.css`, tokens like `--brand-primary`, `--brand-primary-fg`, `--brand-accent` are set inline on the wrapper `<div style={{...}}>` from `brand.theme` — so switching brand instantly reskins every screen.
- System status pill + "Contact your PharmaBro account manager" (only place PB is named — the support link).

**Demo brand switcher (top bar):** dropdown "PeachRx ▾ · DesertMD · NorthStarHealth · New brand (empty)" — flips `activeBrandId` in store so the whole dashboard rerenders. Lets us showcase zero-sales, first-sales, and scaling states without re-seeding.

---

## 3. Store — `src/lib/pharmabro/store.ts`

New Zustand slice, localStorage-persisted, mirrors `src/lib/admin/store.ts` structure but keyed by brand:

```ts
type BrandId = string;
type Brand = {
  id: BrandId; name: string; logoUrl: string;
  theme: { primary: string; accent: string; font: string };
  stage: 'onboarding' | 'zero_sales' | 'first_sales' | 'scaling';
  stripe: { connected: boolean; acct?: string; healthcareApproved: boolean };
  integrations: Record<'klaviyo'|'metaPixel'|'metaAds'|'ga4'|'googleAds'|'tiktok', { connected: boolean; ... }>;
  statesServed: string[];
  legal: { tos: 'template' | 'custom'; ... };
  createdAtMs: number;
};

type BrandData = {
  patients: Patient[]; orders: Order[]; cases: Case[]; checkIns: CheckIn[];
  messages: Conversation[]; payments: Payment[]; leads: Lead[];
  funnel: FunnelConfig; intake: IntakeConfig; products: Product[];
  plans: Plan[]; upsells: Upsell[]; discounts: Discount[];
  emailFlows: EmailFlow[]; pages: PageConfig[];
  audit: AuditEntry[];
};

state = { activeBrandId, brands: Brand[], data: Record<BrandId, BrandData> }
```

**3 seeded demo brands** cover the full lifecycle:

- **PeachRx** — brand-new, zero patients, empty funnel from template, checklist visible.
- **DesertMD** — first sales (~30 patients, 8 orders, 2 cases in queue).
- **NorthStarHealth** — scaling (400+ patients, active MRR, all flows live).

Every action calls `logAudit()` and is scoped to `activeBrandId`.

---

## 4. Screen-by-screen build

### 4.1 Home (`pharmabro-admin.index.tsx`)

Same 5 KPIs, revenue chart, physician queue strip, pharmacy strip, funnel widget, task center — reads brand-scoped data. **Empty-state variant** for `stage === 'onboarding'`: 6-step onboarding checklist ("Upload logo · Set brand colors · Connect Stripe · Build funnel · Configure products · Publish site") with progress ring; each item deep-links to the relevant screen.

### 4.2 Live View

Reuse `LiveGlobe3D` / `LiveMap` + `LiveSidebar`, sessions filtered by brand.

### 4.3–4.8 Patients / Physician Queue / Orders / Check-Ins / Messages / Payments

Wrap existing admin route components; feed `brandData` through. All existing wired actions (refund, approve Rx, hold refill, send message, flag fraud, etc.) work unchanged — they call `pharmabroActions.*` which internally routes to the brand slice.

### 4.9 Analytics (5 sub-pages)

Same `analytics.ts` helpers, scoped selectors. Zero-sales brand shows empty-state charts with "No revenue yet — publish your funnel to start" CTA.

---

### 4.10 Funnel Builder (NEW) — `build/funnel`

3-column layout:

- **Left tree (300px):** Pages in order (Quiz → Loading → Sales Page → Confirmation → Portal), each expandable to blocks. Drag-reorder, `+ Add block`, `+ Add screen`.
- **Center canvas:** iframe-style mobile preview (375px) with desktop toggle. Click any element → sets `selectedNodeId`. Overlays: hover outline, `+` between siblings.
- **Right inspector (300px):** context panel driven by `selectedNode.type` (hero / plan-card / quiz-screen / cta). Fields defined in a small `field-schema.ts` per block type — no free rendering.

**Top bar:** `Preview →` (opens `/preview/funnel/:brandId` in new tab, reads draft), `Save draft`, `Publish` (moves `draft → live`, appends to `funnel.history[]`), `History` (list, rollback restores prior snapshot).

State: `funnel: { draft: FunnelTree; live: FunnelTree; history: {ts, snapshot}[] }`. All mutations dispatch `funnelActions.updateNode/addBlock/reorder/publish/rollback`.

### 4.11 Intake Builder — `build/intake`

Same 3-column shape. Left screen list marks **Required (locked)** for clinical screens (14–18). Center previews mobile screen; right pane edits question copy, answer options, screen type dropdown (single / multi / text / number / date / info-slide / upload), Klaviyo event key, storage key, skip logic (`if answer === X → jump to screen Y`). Locked screens show a warning card and disable inputs — only headline + brand color editable.

### 4.12 Products & Pricing — `build/products`

4 tabs (`Products | Plans | Upsells | Discounts`). Each tab is a dense table + right-side slide-over editor.

- Products: molecule, form, pharmacy assignment, LifeFile product IDs, titration protocol dropdown, badge, description.
- Plans: pick product + duration, pricing (first/ongoing/per-month auto), badge, savings callout, "pre-selected" toggle, Stripe product ID (auto-generated placeholder on save).
- Upsells: name, price, one-time/recurring, position (checkout / post-buy), display order, scarcity text.
- Discounts: code, type (fixed/pct/free-ship/first-order/win-back), amount, applies-to plan, usage limit, auto-apply toggle, usage counter.

All persisted; changes reflected in Funnel Builder plan-card inspector via lookup.

### 4.13 Email Flows — `build/emails`

List of 13 flows with status pills, last-edited, emails-count. Click `Edit` → `$flowId` detail: left timeline of emails with send delays, center mobile preview of selected email, right settings (subject, preview text, from name/email, delay, send window, personalization token inserter). Inner "Edit email" opens visual/HTML mode toggle + drag-drop blocks (image/text/button/divider/spacer/dynamic). `Send test email` action (toast simulation), `Preview on mobile`, `Publish`. Klaviyo sync-status badge per flow with fake "last sync" timestamp.

### 4.14 Pages — `build/pages`

Table of pages with URL, status, last-published. Click `Edit` reuses the Funnel Builder canvas in "page mode". Certain elements marked `locked: true` (Stripe form on checkout, portal thread, confirmation summary) — render but non-editable with lock overlay.

---

### 4.15 Settings (9 sub-pages)

Reuse `settings/primitives.tsx`.

- **General:** brand name, logo upload (preview), color pickers, support email, website. Live-updates shell theme.
- **Stripe:** `Connect Stripe →` toggles `stripe.connected = true` (demo), shows fake acct id, mode, Healthcare + LegitScript checkmarks.
- **Team:** clone of admin team settings.
- **Pharmacy (READ-ONLY):** shows routing config + "Contact your PharmaBro account manager" link.
- **States Served:** 50-state grid with toggles.
- **Notifications:** clone of admin notifications.
- **Integrations:** 6 cards (Klaviyo, Meta Pixel, Meta Ads, GA4, Google Ads, TikTok). Each `Connect →` opens a mock 2-step modal (paste API key / OAuth simulate) → sets `connected: true` + timestamp. Below: "Managed by PharmaBro" section listing South End, Dr Telx, LifeFile (non-editable). Brand banking connector at bottom.
- **Compliance:** HIPAA/BAAs/LegitScript status pills, audit log viewer (brand-scoped), consent CSV export.
- **Legal:** three docs (ToS / Privacy / Telehealth Consent). Toggle per-doc: `Use template` or `Upload custom`. Template preview + last-updated.

---

## 5. Demo lifecycle wiring

Every screen must render usefully in each stage:


| Stage       | Home                            | Funnel                                 | Products                      | Analytics                          |
| ----------- | ------------------------------- | -------------------------------------- | ----------------------------- | ---------------------------------- |
| Onboarding  | Checklist                       | Empty template + "Start from template" | 0 products                    | Locked with "Publish funnel first" |
| Zero sales  | Checklist + "Preview live site" | Live + draft                           | Products seeded from template | Empty-state charts                 |
| First sales | KPIs w/ small numbers           | Live                                   | Live                          | Real charts, low volume            |
| Scaling     | Full dashboard                  | Live                                   | Live                          | Full analytics                     |


Each seeded brand is one of these — switcher demos the whole journey.

---

## 6. Shared UI polish

- All icons flat, no circle backgrounds (project rule).
- Indigo/violet palette overridden per-brand via CSS custom properties.
- Same StatusPill, KpiCard, Sparkline, Stepper, PipelineStrip components.
- Sonner toasts on every mutation; audit entries on every mutation.
- Fully responsive (dense at ≥1440, collapses to stacked cards at <1024, mobile-optimized left sidebar becomes drawer).

---

## 7. Out of scope (call out explicitly, will do later)

- Real Stripe / Klaviyo / Meta OAuth (all mocked with realistic UI + persisted "connected" state).
- Actual page publishing (writes draft/live JSON to store; no real deploy).
- Multi-tenant auth (route is public in the preview; production would gate on brand-owner login).

---

## 8. Deliverables order (implementation sequence)

1. Store + seeds for 3 brands + BrandShell + `.brand-scope` theming.
2. Home + Live + brand switcher (proves the theming works).
3. Wrap Patients/Orders/Cases/Check-Ins/Messages/Payments/Analytics.
4. Products & Pricing (foundation — Funnel/Emails reference it).
5. Funnel Builder + Intake Builder.
6. Email Flows + Pages.
7. Settings (9 sub-pages).
8. Onboarding checklist + empty states for zero-sales brand.
9. Full pass: audit log entries + toasts on every action, responsive sweep, accessibility.

Say **build** to start executing this in order, or tell me which screen to build first.  
make every screen intutitive, nothing should just render but every details matters , everythign should work, not just renders but does nothing