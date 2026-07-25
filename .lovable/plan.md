# /admin/messages — end-to-end revamp

Goal: turn the current stale inbox into a real support console. Every button works, state persists, mobile is app-grade, desktop is Sage/Untitled-UI dense.

## Layout (desktop → tablet → mobile)

```text
Desktop  ≥1200:  [Filters 260] [Convo list 340] [Thread 1fr] [Patient panel 320]
Tablet   768–1199: [Convo list 320] [Thread 1fr] (panel = drawer button)
Mobile   <768:  Single-pane w/ back nav. List → Thread → (i) Patient sheet
```

Use the existing `admin-scope` tokens. No new palettes.

## Left column — Filters & folders (new)

- Search "Search conversations, patients, keywords…" (⌘K focuses)
- Sections:
  - **Inbox** (all open) · Unassigned · Assigned to me · Mentions · Snoozed · Closed · All
  - **Channels**: In-app · SMS · Email · WhatsApp (with unread counts)
  - **Tags**: Clinical · Intake · Shipping · Billing · Refund · General
  - **Assignees**: Andre F. · Ops · Dr. Nass · Unassigned
- Every filter is a real predicate combined with AND. Active filters shown as removable chips above the list.

## Middle — Conversation list

- Sort: Newest activity (default) · Oldest waiting · Priority
- Row: avatar w/ presence dot, name, relative time, last-message preview (prefixed `You:`  if from me, italic if internal note), channel icon, status pill, unread dot + count badge, priority flag if clinical.
- Bulk select (checkbox on hover): assign, tag, close, snooze, mark read.
- Empty state per filter with illustration + "Clear filters".
- Infinite list virtualization not required (demo scale); use overflow-y-auto.

## Right of list — Thread

Header:

- Avatar, name, presence, channel · assignee, tags. Actions: Assign ▾, Tag ▾, Snooze ▾, Close/Reopen, ⋯ (View patient · View orders · Merge · Copy link).
- Compact patient strip on tablet where panel is hidden.

Transcript:

- Grouped by day dividers ("Today", "Yesterday", "Wed, Jul 22").
- Bubbles: patient left (white ring), me right (ink), internal note (honey bg, "Internal note" tag, not sent).
- Metadata under each: sender name (staff only), time, channel, delivery state (Sent → Delivered → Seen) for patient-facing messages.
- Supports: text, markdown-lite (bold/italic/links), emoji, attachments (image thumb + file card), quoted reply, system events ("Andre assigned to Dr. Nass", "Case BLS-C-… linked").
- Typing indicator (simulated for demo when patient "responds").
- Auto-scroll to bottom on new; "Jump to latest" pill when scrolled up.

Composer:

- Tabs at top: **Reply** · **Internal note** · **SMS** (if patient has phone) · **Email** (subject line appears).
- Auto-grow textarea (44 → 172px). Enter sends, Shift+Enter newline. ⌘↵ also sends.
- Toolbar row: 😊 emoji · 📎 attach · @ mention teammate · / macros · Insert canned reply · Schedule send · Signature toggle.
- **Macros** (canned replies) — searchable menu with 8 seeded templates: `/nausea`, `/shipping-delay`, `/refill-approved`, `/refund-policy`, `/insurance`, `/dose-titration`, `/pause-plan`, `/reschedule-checkin`. Variables `{patientFirstName}`, `{doseMg}`, `{shipTrackingUrl}`.
- Sending: optimistic append with `state: 'sending'` → `sent` (300ms) → `delivered` (600ms). If channel=email and no subject, block send with inline error.
- After send: clears textarea, refocuses, updates convo `updatedAt`, moves to top, marks read.
- Auto-reply simulator: 30% chance patient responds 3–6s later using scripted reply pool (feels alive without being annoying). Guarded by a "Demo replies" toggle in header (default on).

## Right panel — Patient context

Sticky, scrollable:

- Patient card: avatar, name, email, phone (copy-to-clipboard on click), address city/state.
- Program card: program label, dose, week, adherence %, next check-in, next ship date.
- Financial: LTV, MRR, last payment, outstanding.
- Linked cases (top 3) + Orders (top 3) with pills → deep-link to `/admin/patients/$id`, `/admin/orders/$id`, `/admin/physician-queue/$id`.
- Assign block (existing) refined with search input.
- Internal notes: editable, timestamped, add/delete.
- Tags multi-select.
- Danger zone: Close conversation, Merge duplicate.

## Store additions (`src/lib/admin/store.ts`)

Extend types (non-breaking; all optional):

- `ConvoMessage`: add `channel?: MessageChannel`, `state?: 'sending'|'sent'|'delivered'|'seen'|'failed'`, `attachments?: {name,size,url,kind}[]`, `replyTo?: string`, `system?: boolean`, `subject?: string`.
- `Conversation`: add `tags: ConvoTag[]` (migrate from single `tag`), `snoozedUntil?: number`, `priority?: 'normal'|'high'`, `unreadCount: number`, `mentions?: string[]`, `patientCity?: string`, `patientState?: string`.

New actions:

- `sendMessage(convoId, { text, channel, internal, attachments, subject })` — optimistic, simulates state transitions, updates preview/updatedAt/unread.
- `markSeen(convoId)` — sets me-side messages to `seen`, resets unread.
- `snoozeConvo(id, untilTs)` / `unsnooze(id)`
- `closeConvo(id)` / `reopenConvo(id)`
- `setTags(id, tags[])` / `toggleTag(id, tag)`
- `setPriority(id, level)`
- `deleteMessage(convoId, msgId)` (own messages only, <5min)
- `startTyping(id)` / `stopTyping(id)` (transient in-memory, not persisted)
- `simulatePatientReply(id)` — pulls from scripted pool by tag.
- `bulkAssign(ids[], to, status)` / `bulkClose(ids[])` / `bulkTag(ids[], tag)`
- Macro registry + `applyMacro(convoId, macroId)` returning interpolated text.

Migration path: `normalizeConversations()` on hydrate — fills defaults for old localStorage entries (mirrors the leads-normalization pattern already in the store).

## Component structure

```text
src/routes/admin.messages.tsx        (shell + route)
src/components/admin/messages/
  InboxFilters.tsx        (left column)
  ConvoList.tsx           (middle) + ConvoRow.tsx
  ThreadHeader.tsx
  Transcript.tsx          + Bubble.tsx + DayDivider.tsx + SystemEvent.tsx
  Composer.tsx            + MacroMenu.tsx + AttachmentChip.tsx + EmojiPicker.tsx (native)
  PatientPanel.tsx
  useMessagesUX.ts        (keyboard shortcuts, typing sim, auto-reply sim)
```

Keyboard shortcuts (global on route):

- `⌘K` search · `j/k` next/prev convo · `e` close · `s` snooze · `a` assign · `#` tag · `r` reply · `n` internal note · `⌘↵` send.

## Mobile behavior (<768)

- Three views driven by URL search param `?view=list|thread|patient` (so back button works).
- List: full-width, larger touch targets (56px rows), FAB "New message" opens patient picker.
- Thread: sticky header w/ back arrow + name + (i) button, transcript, sticky composer above safe-area (`env(safe-area-inset-bottom)`), swipe-down on header returns to list.
- Patient info as bottom sheet from (i), 90vh, drag handle.
- Composer collapses toolbar behind a `+` menu on mobile.

## Empty / error / loading states

- Skeleton for list on first load.
- Empty inbox: illustration + "You're all caught up".
- Failed send: inline red pill + Retry.
- Offline banner via `navigator.onLine`.

## Toasts

- "Message sent" (undo 5s deletes it), "Snoozed until 9am tomorrow", "Assigned to Dr. Nass", "Closed conversation", "Macro applied".

## What's already there and what will change

Keep: existing `Conversation`, `ConvoMessage`, `sendReply`, `assignConvo`, `setActiveConvo`, `ensureConversationFor`. They stay for backwards compatibility; `sendReply` becomes a thin wrapper over new `sendMessage`.

Replace: the entire `admin.messages.tsx` UI (currently one file, ~180 lines) with the modular components above.

Add: filters, macros, snooze, close/reopen, tags[], priority, delivery states, typing/auto-reply sim, keyboard shortcuts, mobile 3-pane routing, patient panel deep-links.

## Acceptance

- Send a reply → appears instantly, transitions Sending→Sent→Delivered→Seen, list reorders, preview updates, unread cleared.
- Toggle Internal note → sends honey-tagged message not counted as customer reply, no delivery states.
- Assign to Dr. Nass → status flips to physician, activity event logged, toast shown, list badge updates.
- Snooze 1h → convo leaves Inbox, appears in Snoozed, returns after time (simulated with setTimeout for demo).
- Close → moves to Closed folder; Reopen returns it.
- Macro `/nausea` interpolates patient first name and inserts into composer.
- Filter by Channel=SMS + Tag=Clinical + Assignee=Dr. Nass → list filtered correctly, chips shown.
- Mobile: list → tap row → thread → (i) → patient sheet; back button walks it in reverse.
- Reload page → filters, active convo, messages, tags, snooze all persist via localStorage.
- Keyboard: j/k navigates, r focuses composer, ⌘↵ sends.

No backend changes. Everything runs against the existing Zustand-ish store with localStorage.  
make UI like the reference images, match our color scheme in /analytics and /admin,  make it intuitive , smooth, give that finishing , full logic