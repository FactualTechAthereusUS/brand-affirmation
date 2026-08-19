# Rebuild "From checkout to recurring revenue" as four animated screen loops

The tab rail stays exactly as it is. Everything below it gets replaced: no more static copy card next to a flat mock. Each of the four tabs becomes a self-running product loop built with the same grammar as "Keep patients on treatment" (white cards on a dotted stage, hairline borders, staggered reveal, travelling connector pulse, ticks flipping green, mono tickers, corner brackets), plus a redesigned copy panel.

## New layout per tab

```text
 [ tab rail — unchanged ]
 ┌──────────────────────────────────────────────────────────┐
 │  01 / 04   Checkout completes        (mono step counter)  │
 │  short lede                                               │
 │  ── hairline ──                                           │
 │  detail rows, revealed in step with the animation stage    │
 │                                                            │
 │   [ live stage: animated loop, corner brackets, dot grid ] │
 └──────────────────────────────────────────────────────────┘
```

Desktop: copy left (~38%), stage right (~62%), stage stretches full height. Mobile: copy on top, stage below at a fixed aspect ratio, scenes scale down (0.72 / 0.85 / 1) so nothing clips. Detail rows light up as the loop passes each step, so copy and motion are one thing instead of two.

## The four loops

**01 Checkout completes** — a branded checkout panel on your own domain. Plan card selects, card field types `4242 4242 4242 4242` digit-group by group, "Pay and start" fills with a progress sweep, then a Stripe-marked receipt row slides up: `$249.00 → your Stripe account`, with a "card token vaulted" chip. Ends holding on a green "Order placed" state.

**02 Care begins** — split moment: left, the patient's branded portal card shows "Reviewing your intake" with a dashed spinner; right, a provider row (avatar, "Dr. Elena Ruiz · Licensed in NY") slides in, a message bubble types word-by-word, and the portal card flips to "Approved". State chip counts `NY` match, async consult timer ticks `12 min`.

**03 Approve and route** — prescription routing. An Rx card is issued, then three pharmacy candidates appear and the matcher sweeps them: two dim out, one locks in with a `Matched: compound · state · formulary` chip. A tracking row then draws a shipping progress bar with a carrier mark and pushes "Tracking sent to portal + SMS".

**04 Revenue compounds** — rebill engine. An upcoming-invoice row schedules, one card declines (amber), the account updater retries and flips it green, and a small bar chart grows while MRR / subscriptions / rebill-rate tickers count up to $12,480 · 214 · 96%. The existing JOURNEY_METRICS row is folded into this scene instead of sitting in the copy card.

All four run on the shared `useLoop` cadence, hold the finished state ~3.4s, then restart. `useReducedMotion` jumps straight to the finished frame with no motion.

## Logos

Placeholders (neutral rounded marks with initials) will be used, and swapped when you send files, for: Stripe, FedEx and UPS, and the three pharmacy names in the routing loop. The PharmaBro mark, the lucide icon set, and the US state chips are already available and will be used directly.

## Technical notes

- New file `src/components/pharmabro/home/JourneyLoops.tsx` exporting `JourneyScene({ id })`, with the loop/card/connector/tick/typed helpers factored out of `RetentionLoops.tsx` into a shared `loopKit.tsx` so both sections share one motion grammar.
- `src/components/pharmabro/home/SectionsA.tsx`: `CheckoutToRevenue` keeps `TabRail` and the headline block, swaps the copy card plus `Shot` for the new panel + `JourneyScene`, and adds auto-advance between tabs (pauses on interaction) so the section demos itself.
- Copy, headline, tab labels, and detail text come from `JOURNEY` in `src/lib/pharmabro/home.ts` unchanged; only presentation changes.
- All colors via existing tokens (`--color-brand`, `--color-ink`, `--color-hairline`); no hardcoded palette outside the existing brand/success constants.
