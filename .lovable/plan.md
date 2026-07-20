Add a distinct tablet tier (768–1023px) to `/portal/patient`. Today the layout jumps from mobile to full desktop at `md:` (768px), so iPad-portrait gets a 260px SideNav + cramped content and modals sized for a wide canvas.

## Breakpoint model
```
< 768px      mobile    440px phone shell, TopBar + TabBar
768–1023px   tablet    ≤720px shell, TopBar + TabBar, 2-col grids
≥ 1024px     desktop   SideNav 260 + DesktopHeader, 2/3-col grids
```

## Changes (all in `src/routes/portal.patient.tsx`, no logic/design changes)

1. **Shell breakpoint swap `md:` → `lg:`** on:
   - Outer bg switch, flex-row, `max-w-none`
   - `SideNav` (`hidden lg:flex`)
   - `DesktopHeader` (`hidden lg:flex`)
   - Mobile `TopBar` + `TabBar` (`lg:hidden`)
   - `main` bottom padding (`pb-28 lg:pb-16`)

2. **Tablet container width** — add `md:max-w-[720px] md:mx-auto` (plus subtle shadow) on the content wrapper so the shell grows to tablet width.

3. **Grids** — rescope tab content:
   - `HomeTab` cards → `md:grid-cols-2 lg:grid-cols-3`
   - `PlanTab` order/billing history → 2-col at `md:`
   - `SettingsTab` groups → 2-col at `md:`
   - Home hero aspect → `aspect-[2/1] md:aspect-[21/9] lg:aspect-[16/5]`

4. **Typography/spacing at tablet** — bump headings and paddings one step (`md:text-2xl`, `md:px-6`, `md:pt-7`).

5. **Modals & sheets** — keep bottom-sheet on tablet, center only on desktop. Swap `md:place-items-center` / `md:rounded-3xl` → `lg:*` on PlanModal, NotificationsSheet, DocumentsSheet, TrackingModal, ReceiptModal, PaymentFlow.

6. **Toast** — `md:bottom-14` → `lg:bottom-14` to keep clearance above the tablet TabBar.

7. **Chat (MessagesTab thread)** — widen bubbles (`md:max-w-[70%]`) and pad the composer for tablet.

## Out of scope
No redesign, no new components, no state/logic changes — only responsive class adjustments.
