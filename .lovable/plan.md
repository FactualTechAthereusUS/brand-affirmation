
# Unify Platform to Admin/Analytics Design Language

Adopt the `/admin` + `/admin/analytics` visual system as the single source of truth. Roll it out surface by surface so every page — marketing, intake, sales, checkout, portals, emails, admin — feels like one product.

## The new system (locked)

Tokens promoted from admin into `src/styles.css` (`@theme` + `:root`):

```text
Canvas       #f6f6f7   page background (was warm #F8F5EF)
Surface      #ffffff   cards, sheets, inputs
Ink          #171717   primary text
Ink/70       #171717 @ 70%   secondary text
Hairline     rgba(23,23,23,0.06)  borders, dividers

Primary      #2563eb   indigo — revenue, CTAs, links
Accent       #7c3aed   violet — MRR, secondary emphasis
Sky          #0ea5e9   info, sessions
Emerald      #10b981   success, approvals, positive delta
Amber        #f59e0b   warning, AOV
Coral        #ee7273   retained as destructive / critical highlight only

Shadow       0 10px 30px -20px rgba(0,0,0,.25)
Radius       0.75rem (cards), 999px (pills)
Font         Google Sans Flex / Manrope (unchanged)
```

Semantic shadcn tokens get remapped:
- `--primary` → `#2563eb` (was ink black)
- `--accent` → `#7c3aed` (was coral)
- `--ring` → `#2563eb`
- `--background` → `#f6f6f7`
- `--destructive` stays coral `#ee7273`
- `--secondary` → soft indigo tint `#eef2ff`

`--color-ever` (coral) stays defined so legacy references keep compiling, but its role shifts from "primary brand" to "destructive/critical only".

## Rollout — grouped so we can ship in waves

### Wave 1 — Foundation (one PR, unblocks everything)
1. Rewrite tokens in `src/styles.css` (palette above + shadcn mapping).
2. Update `src/components/ui/*` primitives that hardcode coral or warm neutrals (button focus rings, input borders, badge variants).
3. Global body bg → `#f6f6f7`; cards white on canvas.
4. Add reusable `chart-*` CSS vars so charts stop hardcoding hex.

Every downstream wave then inherits by class, not by find/replace.

### Wave 2 — Marketing + Auth (public first impression)
- `src/routes/index.tsx` + `src/components/home/*` (Hero, SocialProof, Numbers, Pillars, FAQ, Footer) — swap coral CTAs to indigo, warm canvas to neutral, keep coral only for the review-star accent.
- `login.tsx`, `login.admin.tsx`, `login.physician.tsx` — split-screen background art keeps its imagery; form side, buttons, links move to indigo.
- Legal pages (`privacy`, `terms`, `shipping`, `refund`, `medication-safety`) — inherit automatically, spot-check headings.

### Wave 3 — Intake + Sales funnels
- `intake.tsx` and every `intake_.*` variant — progress bars, chips, glass cards, CTAs move to indigo/violet. Keep coral only for validation errors.
- `sales.trimrx.tsx`, `sales.DM.tsx`, `weight-loss.sales.tsx`, `weight-loss.index.tsx` — banners, "select plan" buttons, price highlights, timers → indigo primary, violet secondary.
- `WLCalculator.tsx` / chart components — palette from the new `chart-*` tokens (indigo curve, violet band).

### Wave 4 — Checkout + Confirmation
- `checkout.trimrx.tsx`, `checkout.charged-before.tsx`, `checkout.UI-template3.tsx` — card outlines, "DUE TODAY" chip, pay-icon row background, review slider focus ring.
- `confirmation.tsx`, `confirmation-charged.tsx` — animated checkmark + timeline swap to emerald success + indigo progress.

### Wave 5 — Portals
- `portal.patient.tsx` — tab bar, chart lines, plan cards, message bubbles. Weight chart uses indigo main line, emerald goal band.
- `portal.physician.tsx` — case queue pills, decision buttons, PIN sheet, refill selectors. Approve = emerald, Deny = coral, Neutral = indigo.

### Wave 6 — Emails + polish
- `emails.tsx` — order-confo, nurture, abandonment, billing templates — inline styles moved to token-driven hex.
- Final sweep: grep `#ee7273`, `#F8F5EF`, `#1D437B`, `bg-canvas`, `bg-ink` and replace where they represent "primary brand" (not destructive / not brand-mandated illustration).

## Responsive + interaction rules carried across every wave
- Header rows use `grid-cols-[minmax(0,1fr)_auto]` → `sm:flex` (per project layout rule) so titles never collide with actions on mobile.
- Cards: `rounded-xl border border-ink/[0.06] bg-white shadow-[0_10px_30px_-20px_rgba(0,0,0,.25)]`.
- Buttons: primary = solid indigo, hover darken 6%, focus ring indigo/40; secondary = white + hairline; destructive = coral.
- Motion register stays unchanged (Framer reveals, Lenis smooth scroll).

## Technical notes
- All color changes go through tokens; components should not gain new hardcoded hex. Charts read from `--chart-primary`, `--chart-accent`, etc.
- Coral (`--color-ever`) is preserved as a token so legacy imports don't break — we just stop using it as the CTA color.
- `admin/*` routes already match the target; they get a light audit only (no rework).
- No functional/business-logic changes — pure presentation.

## Deliverable order I'll ship in
1. Wave 1 tokens + primitives (small, verifiable)
2. Wave 2 marketing/auth
3. Wave 3 intake/sales
4. Wave 4 checkout/confirmation
5. Wave 5 portals
6. Wave 6 emails + final grep sweep

Approve and I'll start with Wave 1.
