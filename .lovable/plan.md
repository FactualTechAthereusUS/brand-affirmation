# /admin/integrations — full revamp

Turn the current stale card grid into a real integrations surface that works end-to-end on demo data. Match the reference visuals (Untitled UI / Sage marketplace): clean cards with real brand logos, clear Connected vs Not-connected state, a working Connect modal with scope permissions, a per-integration detail drawer/page with settings + logs + webhooks + sync activity, category tabs, and search.

## What's broken today

- `/admin/integrations` renders a static grid. Configure / Test / Logs buttons do nothing. Toggle just flips status.
- Only one state exists ("connected/degraded/down"). No `disconnected` (not-yet-connected) state, so we can't show a real marketplace.
- No detail page, no OAuth-style connect dialog, no configuration fields, no webhook/event log, no sync history.
- Category set is tiny (Critical / Clinical / Analytics / Banking). Missing: Payments, Marketing/Ads, Email/SMS, Shipping, EHR, Pharmacies, Comms, Auth.
- No logos. Only text names.

## Full integration catalog (demo data)

Seed a realistic telehealth stack, most disconnected, a few connected/degraded so both states are visible.


| Category        | Integration         | Default state |
| --------------- | ------------------- | ------------- |
| Payments        | Stripe              | connected     |
| Payments        | Paddle              | disconnected  |
| Payments        | Affirm              | disconnected  |
| Payments        | Klarna              | disconnected  |
| Pharmacies      | South End Rx        | connected     |
| Pharmacies      | Wells Rx            | connected     |
| Pharmacies      | EpiqScripts         | connected     |
| Pharmacies      | Strive Rx           | degraded      |
| Pharmacies      | Empower             | disconnected  |
| Clinical        | LifeFile EHR        | connected     |
| Clinical        | Dr. Telx            | connected     |
| Clinical        | DoseSpot ePrescribe | disconnected  |
| Clinical        | Photon Health       | disconnected  |
| Marketing / Ads | Meta Ads            | connected     |
| Marketing / Ads | Google Ads          | disconnected  |
| Marketing / Ads | TikTok Ads          | disconnected  |
| Analytics       | Meta Pixel / CAPI   | connected     |
| Analytics       | Google Analytics 4  | connected     |
| Analytics       | PostHog             | disconnected  |
| Analytics       | Segment             | disconnected  |
| Email / SMS     | Klaviyo             | connected     |
| Email / SMS     | Postmark            | disconnected  |
| Email / SMS     | Twilio SMS          | disconnected  |
| Email / SMS     | SendGrid            | disconnected  |
| Shipping        | ShipStation         | disconnected  |
| Shipping        | EasyPost            | disconnected  |
| Shipping        | UPS                 | disconnected  |
| Shipping        | FedEx               | disconnected  |
| Comms           | Slack               | disconnected  |
| Comms           | Intercom            | disconnected  |
| Comms           | Zendesk             | disconnected  |
| Banking         | Mercury             | connected     |
| Auth            | Auth0               | disconnected  |
| Auth            | Google SSO          | disconnected  |


Each item gets: brand color, monogram (SVG letter tile — no external logos, matches "no image bg" rule with just a rounded tinted square + letter), short description, provider URL, permission scopes, config schema (list of typed fields), webhook events list, and a 30-day sync history.

## Store additions (`src/lib/admin/store.ts`)

Extend `Integration`:

- `status: "connected" | "degraded" | "down" | "disconnected"` — add `disconnected`
- `description: string` — one-liner
- `docsUrl: string`
- `brand: { color: string; mono: string }` — for logo tile
- `scopes: { key: string; label: string; required: boolean }[]`
- `configSchema: { key: string; label: string; type: "text"|"secret"|"select"|"toggle"; options?: string[]; required?: boolean }[]`
- `config: Record<string, string | boolean>` — user-entered values (secrets stored masked)
- `webhookEvents: { key: string; label: string; enabled: boolean }[]`
- `syncHistory: { ts: number; event: string; status: "ok"|"warn"|"error"; detail?: string }[]`
- `connectedAt?: number`

New actions:

- `connectIntegration(id, config)` → sets `status: connected`, stores masked config, appends `syncHistory` "Connected", toast.
- `disconnectIntegration(id)` → status `disconnected`, clears config, appends history.
- `reconnectIntegration(id)` / `testIntegration(id)` → simulated: 200ms delay → 90% ok / 10% degraded, appends history entry, toast.
- `updateIntegrationConfig(id, patch)`
- `toggleWebhookEvent(id, key)`
- `syncIntegration(id)` → appends "Manual sync" entry, updates `lastSync`, toast.

`normalizeIntegrations()` on hydrate fills defaults so old localStorage entries don't crash.

## Route structure

- `src/routes/admin.integrations.index.tsx` — marketplace grid (rename current file; router already uses index pattern elsewhere).
- `src/routes/admin.integrations.$id.tsx` — detail page.

## Marketplace page (`admin.integrations.index.tsx`)

Header: title + description + search input (right).

Tab strip (horizontal, hairline underline for active — matches `/admin/analytics` tabs):
`All · Payments · Pharmacies · Clinical · Marketing · Analytics · Email/SMS · Shipping · Comms · Banking · Auth`

Above-the-fold summary strip (like analytics KPI strip):

- Connected count · Degraded count · Available count · Last sync (relative)

Grid: responsive 1/2/3/4 cols. Card shows:

- 40px rounded tile with brand color bg + white monogram letter (no image files, no circle — square tile with `rounded-lg`)
- Name + external-link icon → docsUrl
- 2-line description
- Status pill: `Connected` (emerald) · `Degraded` (amber) · `Down` (coral) · `Not connected` (ink/40)
- Bottom row: "Last sync 12m ago" + primary action button
  - Not connected → `Connect` (marine)
  - Connected → `Manage` (ink outline) + small `Test` icon button
- Whole card is a Link to detail page; primary button opens Connect modal directly (stopPropagation).

Empty state per filter with illustration line.

## Connect modal

Reference: image-154 (Untitled UI "Connect X to Y").

Two-step:

1. **Permissions** — lock icon header, "Blissley would like to" list of scopes (checkmarks), Cancel + Allow access.
2. **Configuration** — dynamic form from `configSchema`. Secret fields render as password inputs with show/hide. Inline validation for required fields. Submit → `connectIntegration`, close, toast "Connected to Stripe", card flips to Connected state.

For already-connected integrations, "Manage" opens the detail page instead of the modal.

## Detail page (`admin.integrations.$id.tsx`)

Header row: back link · brand tile · name + provider URL · status pill · action buttons (Test, Sync now, Disconnect (danger outline)).

3-column layout on desktop, stack on mobile:

Left/main:

- **Overview** card — description, connected since, last sync, next scheduled sync
- **Configuration** — editable form from `configSchema`, Save button, secrets masked (`sk_live_••••1234`), Rotate button on secret fields
- **Webhook events** — list of `webhookEvents` with toggles. Webhook URL block (copyable) + Signing secret (reveal/rotate).
- **Sync activity** — reverse-chronological list from `syncHistory` with status dot, event, timestamp, expandable detail. "Load more" pagination.

Right rail:

- **Scopes granted** — checkmarked list
- **Related** — 3 sibling integrations from the same category
- **Danger zone** — Disconnect (confirm dialog: "Disconnect Stripe? Payments will fail until reconnected.")

## Category-specific configuration schemas

Each seeded with realistic fields, all demo:

- Stripe: publishable key, secret key (masked), webhook signing secret, statement descriptor, currency select
- Meta Pixel/CAPI: pixel id, CAPI access token (masked), test event code, auto-advanced matching toggle
- Klaviyo: private API key (masked), public API key, default list, double opt-in toggle
- Twilio SMS: account SID, auth token (masked), from number, messaging service SID
- ShipStation: API key, API secret, store id
- Pharmacies: API base URL, API key, account id, fallback pharmacy toggle
- LifeFile EHR: base URL, client id, client secret, sync interval select

Everything demo — no real network calls. `testIntegration` simulates a 300–800ms delay then appends a history row.

## Interactions & UX polish

- Search filters by name/description across all categories.
- Category chip counts show connected/total (`Payments · 1/4`).
- Framer Motion: card hover lift, modal fade+scale, status pill count-up on connect.
- Toasts on every mutation via existing `sonner` Toaster.
- Persist all state to localStorage via existing store pattern.
- Full-viewport dense layout (no max-w) — matches other admin pages.
- Keyboard: `Esc` closes modal, `⌘K` focuses search.

## Mobile

- Grid collapses to 1 col with 72px card height.
- Detail page becomes single column; right rail moves below main.
- Connect modal becomes bottom sheet on <640px.

## Acceptance

- Land on `/admin/integrations`: see mixed state — some Connected cards (Stripe, LifeFile, Meta Pixel, Klaviyo, Wells Rx, Mercury) and many `Not connected` cards.
- Click `Connect` on Google Ads → permissions screen → allow → config form → save. Card flips to Connected, appears in summary count, toast "Google Ads connected". Persist through reload.
- Click a Connected card → detail page. Toggle webhook event, save. Click Test → simulated OK, activity row appended, timestamp updates.
- Click Disconnect on Stripe → confirm dialog → card returns to `Not connected`, all config cleared, toast.
- Filter by "Payments" tab → only 4 payment integrations shown with correct count.
- Search "twilio" → single result.
- Mobile: cards stack, connect flow works as bottom sheet.

## Files touched

- `src/lib/admin/store.ts` — extend Integration type, seed catalog, add actions, normalize helper.
- `src/routes/admin.integrations.tsx` → rename to `admin.integrations.index.tsx` (matches sibling routing pattern used across admin).
- `src/routes/admin.integrations.$id.tsx` — new detail page.
- `src/components/admin/integrations/` — new folder:
  - `IntegrationCard.tsx`, `IntegrationTile.tsx` (letter monogram), `ConnectDialog.tsx`, `ConfigForm.tsx`, `WebhookPanel.tsx`, `SyncActivity.tsx`, `DisconnectConfirm.tsx`
- Uses existing `AdminShell`, `Card`, `Pill`, sonner toaster.

No backend, no real API calls — demo-grade, fully persistent via existing localStorage store.

&nbsp;

i will provide all the logos , so for logos make it placeholders 