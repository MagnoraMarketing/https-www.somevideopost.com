import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicSupabaseConfig } from "./config";

/**
 * Supabase client for use in Server Components, Route Handlers, and
 * Server Actions. Must be created per-request since it reads cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();
  // Names the missing variable rather than surfacing Supabase's generic
  // "URL and Key are required" message, which says nothing about where to
  // set them.
  const config = requirePublicSupabaseConfig();

  return createServerClient(
    config.url,
    config.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware will refresh
            // the session, so this can be safely ignored here.
          }
        },
      },
    }
  );
}
