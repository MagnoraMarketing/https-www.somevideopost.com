import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readPropertyPage, PropertyImportError } from "@/services/property-import";
import { UnsafeUrlError } from "@/lib/safe-fetch";

/**
 * Preview a listing before a video is ordered.
 *
 * Runs the same fetch and extraction the pipeline uses, but stops short of
 * downloading — so the customer sees what was found (and how many photos)
 * before paying for a generation. Fetching happens entirely server-side and
 * through the SSRF-guarded fetcher.
 */

// The fetch plus full-page extraction can outrun the 10s default on a slow
// listing site. 60s is the Vercel Hobby ceiling.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, refresh } = (await req.json().catch(() => ({}))) as { url?: string; refresh?: boolean };
  if (!url) return NextResponse.json({ error: "Ingen URL angivet" }, { status: 400 });

  try {
    const { property, candidates, cached, fetchedUrl } = await readPropertyPage(url, refresh === true);

    return NextResponse.json({
      ok: true,
      cached,
      fetchedUrl,
      property,
      // Only the count and a small preview leave the server; the full candidate
      // list is an implementation detail of the import step.
      imagesFound: candidates.length,
      preview: candidates.slice(0, 12).map((c) => ({ url: c.url, method: c.method })),
      methods: candidates.reduce<Record<string, number>>((acc, c) => {
        acc[c.method] = (acc[c.method] ?? 0) + 1;
        return acc;
      }, {}),
    });
  } catch (e) {
    if (e instanceof PropertyImportError || e instanceof UnsafeUrlError) {
      const code = e instanceof PropertyImportError ? e.code : "unsafe_url";
      return NextResponse.json(
        {
          ok: false,
          code,
          error: e.message,
          canUpload: true,
        },
        { status: code === "unsafe_url" ? 400 : 502 },
      );
    }
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[property-import] preview failed: ${message}`);
    return NextResponse.json({ ok: false, error: message.slice(0, 300), canUpload: true }, { status: 500 });
  }
}
