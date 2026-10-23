import { createAdminClient } from "@/lib/supabase/admin";
import { resolveVideoUrl } from "@/services/video/media";
import { isShareToken, orderMediaList } from "@/lib/video-media";

/**
 * Public video page, made to be embedded with an <iframe> or opened as a link.
 *
 * A Route Handler that returns a bare HTML document rather than a page, so
 * none of the site's own chrome (cookie banner, analytics) ends up inside a
 * customer's website. It shows only the video and its title — no account,
 * order or pipeline details — and only while the owner has sharing turned on.
 * The video is played from a signed URL minted per request, and the response
 * is never cached, so turning sharing off takes effect at once.
 */

export const dynamic = "force-dynamic";

/** Long enough to finish watching a page that was left open. */
const EMBED_URL_TTL_SECONDS = 12 * 60 * 60;

type SharedOrder = {
  title: string | null;
  status: string;
  paid: boolean | null;
  share_enabled: boolean | null;
  video_url: string | null;
  video_urls: string[] | null;
  final_video_url: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  // Embeddable anywhere; nothing else may load.
  "Content-Security-Policy": "default-src 'none'; media-src https:; style-src 'unsafe-inline'; frame-ancestors *",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex",
};

function page(title: string, body: string): string {
  return `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  html, body { margin: 0; height: 100%; background: #000; color: #e2e8f0;
    font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  video { display: block; width: 100%; height: 100%; object-fit: contain; background: #000; }
  .gone { display: flex; height: 100%; align-items: center; justify-content: center; padding: 16px; text-align: center; }
</style>
</head>
<body>${body}</body>
</html>`;
}

function unavailable(): Response {
  return new Response(
    page("Video ikke tilgængelig", `<div class="gone">Denne video er ikke længere tilgængelig.</div>`),
    { status: 404, headers: HEADERS },
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isShareToken(token)) return unavailable();

  let data: SharedOrder | null = null;
  let src: string | null = null;
  try {
    const result = await createAdminClient()
      .from("video_orders")
      .select("title, status, paid, share_enabled, video_url, video_urls, final_video_url")
      .eq("share_token", token)
      .maybeSingle<SharedOrder>();
    data = result.error ? null : result.data;
    if (data?.share_enabled && data.paid && data.status === "ready") {
      src = await resolveVideoUrl(orderMediaList(data)[0], { ttlSeconds: EMBED_URL_TTL_SECONDS });
    }
  } catch (e) {
    // A visitor on someone else's website gets the plain notice, never a 500.
    console.error(`[embed] ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!data || !src) return unavailable();

  const title = data.title?.trim() || "Præsentationsvideo";
  const body =
    `<video src="${escapeHtml(src)}" controls playsinline preload="metadata" ` +
    `aria-label="${escapeHtml(title)}" controlslist="nodownload"></video>`;
  return new Response(page(title, body), { status: 200, headers: HEADERS });
}
