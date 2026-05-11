## Reality Slap — Amendments Plan

Keeping Lovable AI Gateway and auto-save. Adding auth, per-user history, and a full Claymorphism redesign.

### 1. Auth (email/password only)
- Enable email auth, **auto-confirm ON** so testing is friction-free (can flip later).
- New routes:
  - `/login` — public, tabs for Sign In / Sign Up.
  - `/_authenticated.tsx` — pathless layout with `beforeLoad` redirect to `/login` if no session.
  - Move current home page to `/_authenticated/index.tsx` (the dashboard).
- Navbar with logo + user email + Logout dropdown, shown only when authenticated.
- No `profiles` table — spec doesn't require display names/avatars; use `auth.users` directly.

### 2. Database migration
- Add `user_id uuid not null` to `roasts` (existing rows are seed/test — table will be cleared since current rows have no owner).
- Replace permissive RLS with owner-scoped policies:
  - SELECT/UPDATE/DELETE: `auth.uid() = user_id`
  - INSERT: `with check (auth.uid() = user_id)`
- Index on `(user_id, created_at desc)`.

### 3. Server function changes
- `generateRoast` switches to authenticated middleware (`requireSupabaseAuth`) so the insert runs as the user and RLS is satisfied.
- Insert now includes `user_id: context.userId`.
- Keep Lovable AI Gateway + `google/gemini-3-flash-preview` (no key changes).

### 4. Frontend — Claymorphism redesign
New design tokens in `src/styles.css`:
- Background: warm cream `oklch(0.97 0.03 85)`
- Primary (emoji yellow): `oklch(0.85 0.17 90)`
- Accent (warm orange): `oklch(0.72 0.20 50)`
- Peach highlight, soft extruded shadows (`--shadow-clay`, `--shadow-clay-inset`)
- Rounded-3xl/4xl on all surfaces
- Fonts: Fredoka (headings) + Nunito (body) via Google Fonts

Components updated/added:
- `Navbar` + `UserDropdown` (new)
- `InputBox` — clay-style oversized button "Slap Me With Reality"
- `LoadingState` — rotating playful messages ("Preparing emotional damage…", etc.)
- `EmojiAnimation` (new) — bouncing 😭🙃🤡💀😔 with framer-motion, plays during loading
- `ResultCard` — staggered reveal: roast slides up → reality fades in → advice last
- `RoastCard`, `EditModal`, `DeleteConfirmation`, `EmptyState`, `ErrorState` — restyled to clay
- `HistoryList` — unchanged logic, restyled

### 5. Files touched
- **New**: `src/routes/login.tsx`, `src/routes/_authenticated.tsx`, `src/routes/_authenticated/index.tsx`, `src/components/Navbar.tsx`, `src/components/EmojiAnimation.tsx`, `src/components/AuthForm.tsx`
- **Delete**: `src/routes/index.tsx` (moved under `_authenticated`)
- **Edit**: `src/styles.css`, `src/routes/__root.tsx` (add auth context + Navbar), `src/lib/roast.functions.ts`, `src/lib/roasts-api.ts`, `src/components/InputBox.tsx`, `src/components/LoadingState.tsx`, `src/components/RoastCard.tsx`, `src/components/EditModal.tsx`, `src/components/DeleteConfirmation.tsx`, `src/components/ErrorState.tsx`, `src/components/EmptyState.tsx`, `src/components/HistoryList.tsx`
- **Migration**: add `user_id` + new RLS policies + index

### Notes
- Existing 0 (or seed-only) roasts will be wiped by the migration since they have no owner.
- The OpenRouter key already in secrets becomes unused but I'll leave it — safe to delete from Cloud later.
- Spec mentions OpenRouter `inclusionai/ring-2.6-1t:free`; per your answer, ignoring that and staying on Lovable AI Gateway.