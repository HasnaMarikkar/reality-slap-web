# Reality Slap — System Design Plan

A single-user, no-auth web app where the user submits a habit, excuse, or situation and receives three structured AI outputs: a humorous **roast**, a **reality check**, and practical **advice**. Saved entries are browsable and editable.

---

## 1. System Architecture

```text
┌────────────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│  Frontend (React)  │ ──► │  Backend Server Fn   │ ──► │ OpenRouter API     │
│  TanStack Start    │     │  (createServerFn)    │     │ llama-3.3-70b:free │
│  Tailwind + shadcn │ ◄── │  Validates JSON      │ ◄── │ Strict JSON out    │
└─────────┬──────────┘     └──────────┬───────────┘     └────────────────────┘
          │                           │
          │  CRUD via Supabase JS     │  Insert on success
          ▼                           ▼
        ┌─────────────────────────────────────┐
        │ Supabase (Postgres) — `roasts`      │
        └─────────────────────────────────────┘
```

**Layers**
- **Frontend**: TanStack Start (React 19 + Vite). UI in Tailwind v4 + shadcn. Direct Supabase reads/writes for CRUD on `roasts`.
- **Backend**: One server function `generateRoast` that wraps OpenRouter. Keeps `OPENROUTER_API_KEY` server-side. Validates AI JSON before returning.
- **AI**: OpenRouter free model `meta-llama/llama-3.3-70b-instruct:free`, called with `response_format: { type: "json_object" }` and a strict system prompt.
- **DB**: Supabase Postgres, single `roasts` table. No auth — RLS open (or disabled) since single-user. Insert can be done client-side after server fn returns, or by the server fn itself (preferred — atomic).

---

## 2. End-to-End Data Flow

1. User types into `InputBox` and clicks "Slap Me".
2. `LoadingState` shows; frontend calls `generateRoast({ data: { input } })`.
3. Server fn:
   a. Validates input (1–500 chars, non-empty).
   b. POSTs to OpenRouter chat completions with system prompt + JSON schema instruction.
   c. Parses response → validates against Zod schema `{ roast, reality_check, advice }`.
   d. Inserts into Supabase `roasts` table.
   e. Returns the saved row.
4. Frontend appends row to React Query cache → `RoastCard` renders with entrance animation.
5. `HistoryList` (separate query) auto-revalidates and shows the new entry.
6. User can Edit (opens `EditModal`) or Delete (opens `DeleteConfirmation`) any saved roast.

**Failure paths**
- OpenRouter 4xx/5xx → server fn returns `{ error }`; UI shows `ErrorState` with retry.
- AI returns malformed JSON → server fn retries once with stricter reminder, then errors.
- Supabase insert fails → return error; AI output is discarded (not shown) to keep DB and UI consistent.

---

## 3. Database Design (Supabase)

**Table: `roasts`**

| Column         | Type         | Notes                               |
|----------------|--------------|-------------------------------------|
| `id`           | `uuid`       | PK, default `gen_random_uuid()`     |
| `user_input`   | `text`       | NOT NULL, length ≤ 500              |
| `roast`        | `text`       | NOT NULL                            |
| `reality_check`| `text`       | NOT NULL                            |
| `advice`       | `text`       | NOT NULL                            |
| `created_at`   | `timestamptz`| default `now()`, indexed DESC       |

- Index: `created_at DESC` for history ordering.
- RLS: enabled with permissive policy (single-user app); or disabled with documented note. Recommended: enable RLS with `USING (true)` + `WITH CHECK (true)` so the surface stays consistent if auth is added later.
- No FK, no extra tables.

---

## 4. AI Integration Design (OpenRouter)

**Endpoint**: `POST https://openrouter.ai/api/v1/chat/completions`
**Model**: `meta-llama/llama-3.3-70b-instruct:free`
**Headers**: `Authorization: Bearer ${OPENROUTER_API_KEY}`, `Content-Type: application/json`, plus optional `HTTP-Referer` / `X-Title`.

**Request body (key parts)**
- `response_format: { "type": "json_object" }`
- `temperature: 0.9` (roast), tuned later
- `messages`:
  - **system**: "You are Reality Slap. Given a user's habit/excuse/situation, return ONLY valid minified JSON with exactly these keys: `roast` (1–2 sentences, witty, sharp, never cruel about protected traits), `reality_check` (2–3 sentences, brutally honest, factual), `advice` (2–4 sentences, concrete and actionable). No prose outside JSON. No markdown."
  - **user**: the raw input.

**Strict JSON enforcement (server-side)**
- Parse with `JSON.parse` inside try/catch.
- Validate with Zod:
  ```text
  z.object({
    roast: z.string().min(1).max(600),
    reality_check: z.string().min(1).max(800),
    advice: z.string().min(1).max(1000),
  }).strict()
  ```
- On failure: one retry with appended system note "Your last reply was invalid JSON. Reply ONLY with the JSON object."
- After second failure: return typed error.

**Safety**
- Strip control chars from input.
- Reject inputs > 500 chars before calling AI.
- Add a refusal clause in system prompt for self-harm / hate categories → output supportive `reality_check` + helpline-style `advice` instead of a roast.

---

## 5. Frontend Component Structure

```text
src/routes/
  __root.tsx              # shell + providers
  index.tsx               # main page: InputBox + HistoryList

src/components/
  InputBox.tsx            # textarea + Slap button + char counter
  LoadingState.tsx        # skeleton/spinner with "Cooking your roast…"
  ErrorState.tsx          # retry button + message
  ResultCard.tsx          # wrapper showing the latest result (3 sections)
  RoastCard.tsx           # single saved entry card (history item)
  HistoryList.tsx         # list of RoastCards, ordered desc
  EditModal.tsx           # dialog to edit roast/reality_check/advice
  DeleteConfirmation.tsx  # alert-dialog confirm
  EmptyState.tsx          # shown when history is empty
```

**Interaction map**
- `InputBox` → triggers `useMutation(generateRoast)` → on success invalidates `['roasts']` and shows `ResultCard`.
- `HistoryList` uses `useQuery(['roasts'])` → renders `RoastCard[]`.
- `RoastCard` exposes Edit / Delete buttons → open `EditModal` / `DeleteConfirmation`.
- `EditModal` calls `updateRoast` mutation → invalidates list.
- `DeleteConfirmation` calls `deleteRoast` mutation → optimistic remove.

State: TanStack Query for server state. Local UI state via `useState` only (modals open/close, form values).

---

## 6. UI / UX Design System

- **Theme**: dark by default. Background `oklch(0.13 0.02 280)`; surface `oklch(0.18 0.03 285)`.
- **Accents**: neon purple `oklch(0.7 0.25 300)` (primary), neon pink `oklch(0.72 0.27 350)` (accent). Gradient `linear-gradient(135deg, var(--primary), var(--accent))` for hero text and CTA.
- **Typography**: Space Grotesk (headings) + Inter (body). H1 with gradient text.
- **Layout**: single-column max-w-2xl. Sticky `InputBox` at top. History below.
- **Cards**: rounded-2xl, soft border `border-white/10`, subtle inner glow `shadow-[0_0_40px_-10px_var(--primary)]`.
- **Buttons**: primary gradient with hover scale 1.02; ghost for secondary.
- **Sections inside ResultCard**: three labeled blocks ("🔥 Roast", "🪞 Reality Check", "🛠 Advice") with accent dividers.
- **Animations**: framer-motion fade+slide-up on new RoastCard (200ms). Skeleton shimmer during loading. Subtle pulse on Slap button when idle.
- **Spacing**: 8pt grid, `gap-6` for cards, `p-6` inside.
- **All colors via tokens** in `src/styles.css` (no raw hex in components).

---

## 7. CRUD Design

| Op     | Trigger              | Path                                  | Notes |
|--------|----------------------|----------------------------------------|-------|
| Create | Slap button          | server fn `generateRoast` → AI → insert| Single atomic flow |
| Read   | Page load + after CRUD | `supabase.from('roasts').select().order('created_at', desc)` | Cached by React Query |
| Update | EditModal save       | `supabase.from('roasts').update(...).eq('id', id)`           | Editable: roast, reality_check, advice (not user_input) |
| Delete | DeleteConfirmation   | `supabase.from('roasts').delete().eq('id', id)`              | Optimistic update + toast undo (optional) |

All mutations invalidate `['roasts']`. Errors surface via toast (`sonner`).

---

## 8. Testing Strategy (TDD + BDD)

**Tooling**: Vitest + Testing Library for components; MSW to mock OpenRouter and Supabase; Playwright for one happy-path E2E.

**TDD — unit**
- Zod schema accepts valid AI payloads, rejects missing keys, extra keys, empty strings, oversized strings.
- Input validator rejects empty, > 500 chars, control chars.
- `generateRoast` server fn: retries once on invalid JSON, errors after second failure, inserts only on valid output.

**BDD — behavior scenarios** (Gherkin-style)
- *Given* the user types a habit *When* they click Slap *Then* a loading state appears and a new card with three sections renders.
- *Given* AI returns malformed JSON *When* retry also fails *Then* an ErrorState with Retry is shown and nothing is saved.
- *Given* a saved roast *When* the user edits the advice and saves *Then* the card updates and the change persists after reload.
- *Given* a saved roast *When* the user confirms delete *Then* it is removed from the list immediately.
- *Given* the input is empty *When* Slap is clicked *Then* the button is disabled and no request is sent.
- *Given* OpenRouter returns 429 *Then* a friendly rate-limit message appears.

**Edge cases**: 500-char input, unicode/emoji, rapid double-clicks (mutation dedup), offline state, Supabase down.

**Coverage target**: 80% lines on `lib/` + components; 100% on Zod schema and server fn happy/error paths.

---

## 9. `spec.md` Structure

```text
# Reality Slap — Spec

## 1. Overview
## 2. Goals & Non-Goals
## 3. User Stories
## 4. Functional Requirements
   4.1 Generate roast
   4.2 View history
   4.3 Edit / Delete
## 5. Non-Functional Requirements
   (performance, a11y AA, mobile-first)
## 6. System Architecture (diagram)
## 7. Data Model
   7.1 `roasts` table schema
   7.2 Indexes & RLS
## 8. API / Server Functions
   8.1 generateRoast
   8.2 Error contract
## 9. AI Integration
   9.1 Provider, model, params
   9.2 System prompt
   9.3 JSON schema & validation
   9.4 Safety rules
## 10. Frontend
   10.1 Routes
   10.2 Component tree
   10.3 State management
## 11. Design System
   11.1 Tokens (colors, type, radius, shadow)
   11.2 Components & variants
   11.3 Motion
## 12. CRUD Flows
## 13. Testing Plan (TDD + BDD scenarios)
## 14. Observability (logs, error toasts)
## 15. Risks & Open Questions
## 16. Milestones
```

---

## 10. Constraints Recap

- ✅ No auth, single-user.
- ✅ Supabase as the only data store.
- ✅ OpenRouter free model `meta-llama/llama-3.3-70b-instruct:free`.
- ✅ Strict JSON output enforced via `response_format` + Zod + retry.
- ✅ Simple, modular: 1 table, 1 server fn, ~10 components.
