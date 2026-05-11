// Client middleware for createServerFn — attaches the current user's
// Supabase access token to the request so requireSupabaseAuth can verify it.
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let headers: Record<string, string> | undefined;
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) headers = { Authorization: `Bearer ${token}` };
    } catch {
      // no-op; server will reject with 401
    }
    return next(headers ? { headers } : {});
  }
);
