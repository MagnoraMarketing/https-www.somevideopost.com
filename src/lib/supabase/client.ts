import { createBrowserClient } from "@supabase/ssr";
import { requirePublicSupabaseConfig } from "./config";

/**
 * Supabase client for use in Client Components.
 * Reads the public env vars exposed at build time.
 */
export function createClient() {
  const config = requirePublicSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
}
