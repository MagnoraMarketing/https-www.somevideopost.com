/**
 * Supabase public configuration.
 *
 * The two `NEXT_PUBLIC_` values were previously read with non-null assertions
 * at each call site. When they are absent the underlying client constructor
 * throws, and because one of those call sites is the middleware — which runs
 * on nearly every route — an unconfigured deployment failed *every* request,
 * marketing pages included, with an error that never named the missing
 * variables. Reading them through here makes the unconfigured state something
 * callers can see and handle.
 *
 * The variables are referenced literally so Next can inline them into the
 * browser bundle at build time; a dynamic lookup would resolve to undefined
 * on the client.
 */

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export const PUBLIC_SUPABASE_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

/** Which of the two public variables are absent or empty. */
export function missingPublicSupabaseVars(): string[] {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return missing;
}

/** The configuration, or null when either variable is missing. */
export function readPublicSupabaseConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/**
 * The configuration, or a thrown error that names exactly what to set.
 * For call sites that genuinely cannot proceed without a client.
 */
export function requirePublicSupabaseConfig(): SupabasePublicConfig {
  const config = readPublicSupabaseConfig();
  if (config) return config;
  throw new Error(
    `Supabase er ikke konfigureret: ${missingPublicSupabaseVars().join(" og ")} mangler. ` +
      "Sæt variablerne i Vercel (Settings → Environment Variables) og deploy igen.",
  );
}
