## Goal
Switch the AI roast generation from Lovable AI Gateway to OpenRouter, using your own API key.

## Steps

1. **Add `OPENROUTER_API_KEY` as a secret**
   I'll request it via the secret tool — you'll paste your OpenRouter key into a secure form. It becomes a server-side env var (never exposed to the browser).

2. **Update `src/lib/roast.functions.ts`**
   - Replace the `https://ai.gateway.lovable.dev/v1/chat/completions` endpoint with `https://openrouter.ai/api/v1/chat/completions`.
   - Replace the `Lovable-API-Key` header with `Authorization: Bearer ${process.env.OPENROUTER_API_KEY}`.
   - Add OpenRouter's recommended headers: `HTTP-Referer` (your site URL) and `X-Title: Reality Slap`.
   - Swap the model string from `google/gemini-2.5-flash` to an OpenRouter model id. Default suggestion: `google/gemini-2.5-flash` (OpenRouter supports the same id) — confirm below if you'd prefer a different model.
   - Keep the existing JSON-parsing/retry logic, Zod validation, RLS-scoped DB insert, and generic error messages — no behavior change beyond the provider swap.
   - Apply the change to both `generateRoast` (authenticated) and `generateRoastGuest`.

3. **Verify**
   - Trigger a roast in both authenticated and guest flows; check server logs to confirm OpenRouter responds 200 and JSON parses cleanly.

## Quick question before I implement
Which OpenRouter model do you want to use? Common options:
- `google/gemini-2.5-flash` (cheap, fast — closest to current)
- `openai/gpt-4o-mini`
- `anthropic/claude-3.5-haiku`
- something else (tell me the exact OpenRouter model id)

Once you confirm the model and add the API key when prompted, I'll make the edit.