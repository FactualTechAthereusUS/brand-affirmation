## Goal

Turn the existing `/admin/*` into a whitelabel-capable "Shopify of telehealth." Blissley stays the default tenant. Adding a **PharmaBro brand** section to the existing long-press-logo demo sheet lets us switch into a fresh brand-owner instance ("Nova Health") with its own logo, colors, scoped data, plus new BUILD screens. Every button does something real (localStorage-backed).

## 1. Brand tenancy layer

Add to `src/lib/admin/store.ts`:

```ts
type BrandTenant = {
  id: 'blissley' | 'nova' | 'zerostate';
  name: string;
  logoText: string;       // wordmark since no logo asset yet
  primary: string;        // hex
  accent: string;
  supportEmail: string;
  website: string;
  onboardingStep: number; // 0-6, 6 = complete
  stage: 'zero' | 'ramping' | 'live'; // controls seeded data volume
};
state.tenant: BrandTenant     // active
state.tenants: BrandTenant[]  // 3 seeded (Blissley live, Nova ramping, ZeroCo zero)
```

Selectors filter existing patients/orders/leads/payments by `tenantId` (add field to seeds; Blissley entries get `blissley`, Nova gets ~20% subset re-tagged, ZeroCo gets `[]`).

CSS: apply `--brand-primary` / `--brand-accent` as CSS vars on `.admin-scope` root from `state.tenant`. Existing indigo tokens map through these vars so the whole admin repaints on tenant switch.

## 2. Demo panel — PharmaBro section

`src/components/admin/DemoVariantSheet.tsx` — add a 3rd section below Scenario / Viewing as:

```
PharmaBro variations
[ ] Blissley (default tenant, full data)
[ ] Nova Health (ramping brand, 60 patients, some sales)
[ ] ZeroCo (fresh brand, day 1, no sales — onboarding)
```

Selecting one calls `adminActions.switchTenant(id)` → repaints logo/colors/sidebar/data. New action logs to audit.

`AdminShell` header logo becomes a wordmark reading `state.tenant.name` in `state.tenant.primary`. Long-press already opens the sheet; wire this section in.

## 3. Sidebar restructure

`AdminShell.tsx` sidebar gets the grouped nav from the spec:

- **Home / Live View**
- **CLINICAL**: Patients, Physician Queue, Orders, Check-Ins, Messages, Payments
- **BUILD** *(new)*: Funnel Builder, Intake Builder, Products & Pricing, Email Flows, Pages
- **ANALYTICS**: Overview, Acquisition, Funnel, Retention, Finances
- **SETTINGS**: Brand Settings, Integrations, Team, Compliance

Footer: `● All systems operational` + Contact support link. Group headers styled 10px uppercase tracking-[0.14em].

## 4. New BUILD routes

All under existing `AdminShell` layout, indigo/violet tokens, full-bleed, real store-backed.

### `/admin/build/funnel` — `admin.build.funnel.tsx`

3-panel layout: tree (left 260px) / mobile preview (center) / element inspector (right 300px). Data model:

```
FunnelNode = { id, type: 'quiz'|'loading'|'sales'|'confirmation'|'portal', title, blocks: Block[] }
Block = { id, kind: 'hero'|'plan-card'|'quiz-screen'|..., props: {...} }
state.tenant.funnel: FunnelNode[]
```

Editing props updates preview live. Actions: `updateBlock`, `reorderBlocks`, `addBlock`, `deleteBlock`, `saveDraft`, `publishFunnel` (bumps `funnelVersion`, pushes to `funnelHistory`, toast). Rollback list in a drawer.

### `/admin/build/intake` — `admin.build.intake.tsx`

Screen list left with lock badges on clinical screens (14–17), center mobile preview of selected screen, right settings panel (screen type dropdown, question copy, answer options CRUD, Klaviyo event, storage key, skip logic). Locked screens show the amber "LOCKED — Clinical Requirements" panel and disable copy/answer edits (only headline/color editable). Actions: `updateIntakeScreen`, `addIntakeScreen`, `toggleIntakeScreen`, `reorderIntakeScreens`.

### `/admin/build/products` — `admin.build.products.tsx`

Tabs: Products / Plans / Upsells / Discounts. Each tab has Shopify-dense table + slide-over drawer (reusing the payment drawer pattern) for add/edit. Store: `state.tenant.products/plans/upsells/discounts`. Seeded per stage (ZeroCo: empty with "Add your first product" empty state; Nova: 2 products, 4 plans; Blissley: full 4/6/3/4 set from spec). Actions for create/update/archive; Stripe product id is mocked as `prod_<nano>` on save.

### `/admin/build/emails` — `admin.build.emails.tsx`

Flows list table (13 flows from spec). Row click → editor route `/admin/build/emails/$flowId` with left timeline (emails with delay), center mobile email preview, right settings (subject, preview text, from name/email, delay, send window, tokens palette). Sync-to-Klaviyo action toggles per-flow `synced` bool with timestamp; toast fires. Draft/Live/Pause toggle.

### `/admin/build/pages` — `admin.build.pages.tsx`

Table of 8 canonical pages with status/last published. Row action opens same visual builder shell as Funnel with the corresponding page's blocks. Locked-block chips (Stripe form, HIPAA thread, order summary) render disabled. Publish action bumps `pagesHistory[pageId]`.

## 5. Whitelabeled Settings scope

`/admin/settings/*` respects tenant:

- **General**: writes to `state.tenant.name/logoText/primary/supportEmail/website`; live repaints via CSS var.
- **Stripe** (new sub-route `admin.settings.stripe.tsx`): connect flow with fake `acct_xxx`, Healthcare/LegitScript status pills, charge model toggle.
- **Team**: unchanged, tenant-scoped list.
- **Pharmacy**: on non-Blissley tenants shows read-only routing card + "Contact your PharmaBro account manager" (locks existing controls behind `tenant.id !== 'blissley'` gate).
- **States**: existing, tenant-scoped.
- **Integrations**: brand-owner catalog subset (Klaviyo, Meta Pixel, Meta Ads, GA4, Google Ads, TikTok, Mercury bank). Pharmacy/physician integrations hidden for non-Blissley tenants.
- **Compliance**: shows "Managed by PharmaBro" status card + audit log export (already built).
- **Legal**: doc upload slots with "Use PharmaBro template" fallback that copies template markdown into localStorage.

## 6. Onboarding flow (ZeroCo tenant)

When `tenant.stage === 'zero'` and `tenant.onboardingStep < 6`, `/admin` renders a checklist overlay (dismissible) instead of the KPI grid:

```
Welcome to <Brand>. Let's get you live in 30 days.
 1. Brand identity        → /admin/settings/general
 2. Connect Stripe        → /admin/settings/stripe
 3. Add your first product→ /admin/build/products
 4. Configure intake      → /admin/build/intake
 5. Choose states served  → /admin/settings/states
 6. Publish funnel        → /admin/build/funnel
```

Each step marks complete via `adminActions.completeOnboardingStep(n)`. Zero-data screens across the app (Patients, Orders, etc.) show branded empty states with next-step CTAs.

## 7. Nova "ramping" tenant

Seed subset of existing data re-tagged `nova`: 60 patients, 45 orders, 8 physician cases, 5 leads/day funnel. Enough to make every dashboard feel alive without duplicating Blissley volume. Analytics windows recompute from the tagged rows through existing selectors.

## 8. Store additions (summary)

```
switchTenant, completeOnboardingStep, updateTenantBrand,
updateBlock, reorderBlocks, addBlock, deleteBlock,
saveFunnelDraft, publishFunnel, rollbackFunnel,
updateIntakeScreen, addIntakeScreen, toggleIntakeScreen, reorderIntakeScreens,
createProduct/updateProduct/archiveProduct,
createPlan/updatePlan/archivePlan,
createUpsell/updateUpsell/archiveUpsell,
createDiscount/updateDiscount/archiveDiscount,
updateEmailFlow, updateEmail, publishEmail, syncKlaviyoFlow,
publishPage, rollbackPage,
connectStripe, disconnectStripe, updateChargeModel,
uploadLegalDoc, useTemplateLegalDoc
```

All: optimistic update → toast → append `auditLog` entry → persist to localStorage.

## 9. Files touched

New:

- `src/routes/admin.build.funnel.tsx`
- `src/routes/admin.build.intake.tsx`
- `src/routes/admin.build.products.tsx`
- `src/routes/admin.build.emails.tsx`
- `src/routes/admin.build.emails.$flowId.tsx`
- `src/routes/admin.build.pages.tsx`
- `src/routes/admin.settings.stripe.tsx`
- `src/components/admin/build/BlockInspector.tsx`
- `src/components/admin/build/MobilePreview.tsx`
- `src/components/admin/build/FunnelTree.tsx`
- `src/components/admin/build/ProductDrawer.tsx`
- `src/components/admin/build/PlanDrawer.tsx`
- `src/components/admin/build/EmailTimeline.tsx`
- `src/components/admin/onboarding/OnboardingChecklist.tsx`
- `src/components/admin/EmptyState.tsx` (branded empty states)
- `src/lib/admin/tenants.ts` (seed brands + tenant-scoped selectors)

Modified:

- `src/lib/admin/store.ts` — tenant slice + ~35 new actions + normalization
- `src/lib/admin/seeds.ts` — tag rows with `tenantId`, seed Nova/ZeroCo
- `src/lib/admin/selectors.ts` — filter by active tenant
- `src/components/admin/DemoVariantSheet.tsx` — PharmaBro variations section
- `src/components/admin/AdminShell.tsx` — regrouped sidebar, wordmark logo, brand CSS vars
- `src/routes/admin.index.tsx` — onboarding overlay for zero-stage tenants
- `src/routes/admin.settings.pharmacy-routing.tsx` — non-Blissley read-only gate
- `src/routes/admin.settings.integrations.tsx` — filter catalog by tenant scope
- `src/styles.css` — `--brand-primary/--brand-accent` vars + mapping

## 10. Verification

- `tsgo` clean
- Long-press logo → PharmaBro section shows 3 tenants → switch to Nova → sidebar regroups, wordmark + colors change, patient/order counts drop → switch to ZeroCo → onboarding overlay appears, all lists show branded empty states
- Every new button in Build screens: fires toast, mutates store, persists on reload
- Grep confirms no `__l5e/`, no old palette leakage
- Responsive: 1746 / 1280 / 768

## Out of scope

- Real Stripe / Klaviyo API calls (all mocked in localStorage)
- Drag-and-drop reorder polish beyond up/down arrow controls (v1 uses arrow buttons; DnD later)
- Auth-based tenant isolation (demo picks tenant via sheet)
- Blissley routes already revamped are unchanged except sidebar regroup  
  
Keep existing color scheme /admin and /analytics   
  
