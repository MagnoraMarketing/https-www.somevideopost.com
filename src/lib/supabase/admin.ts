import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminClient = SupabaseClient<any>;

let _admin: AdminClient | null = null;

/**
 * Service-role Supabase client — bypasses RLS.
 *
 * Use this for server-side work that runs *without* a logged-in user's
 * cookies (Stripe webhooks) or that must write to tables whose RLS policies
 * intentionally expose only `select` to end users (ai_credits,
 * credit_transactions, subscriptions). Never import this into client code.
 *
 * The key has been documented under two names over time, so accept either
 * rather than silently constructing a client with an `undefined` key — that
 * failure mode is invisible: every write is rejected by RLS and PostgREST
 * reports "0 rows updated" instead of an error.
 */
export function createAdminClient(): AdminClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

    if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured on the server");
    if (!serviceKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not configured on the server — " +
          "credit grants, subscription activation and video uploads cannot be written",
      );
    }

    _admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}
