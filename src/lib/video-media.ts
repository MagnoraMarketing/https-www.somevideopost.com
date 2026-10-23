/**
 * Where a video lives, and how it may be handed out.
 *
 * Orders created before private delivery store plain public URLs, and those
 * keep working untouched. New renders are stored in the private bucket and
 * recorded as a `storage://bucket/path` reference instead of a URL: a
 * reference is not something a browser can open, so the only way to the file
 * is through a route that checks ownership and payment and then mints a
 * short-lived signed URL.
 *
 * Everything here is pure so the self-test can exercise it without Supabase.
 */

export const PRIVATE_VIDEO_BUCKET = "video-private";

const REF_PREFIX = "storage://";

export type StorageRef = { bucket: string; path: string };

export function toStorageRef(bucket: string, path: string): string {
  return `${REF_PREFIX}${bucket}/${path.replace(/^\/+/, "")}`;
}

/** The bucket and path behind a stored reference, or null for a plain URL. */
export function parseStorageRef(value: string | null | undefined): StorageRef | null {
  if (!value || !value.startsWith(REF_PREFIX)) return null;
  const rest = value.slice(REF_PREFIX.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash === rest.length - 1) return null;
  const path = rest.slice(slash + 1);
  // A reference is written by the server, never by a customer — but a path
  // that climbs out of its folder is refused rather than trusted.
  if (path.split("/").some((segment) => segment === ".." || segment === "")) return null;
  return { bucket: rest.slice(0, slash), path };
}

export function isStorageRef(value: string | null | undefined): boolean {
  return parseStorageRef(value) !== null;
}

/**
 * Every playable file of an order, final film first.
 *
 * `video_urls` holds the film followed by its scene clips; older orders only
 * have `video_url`. Empty and duplicate entries are dropped so an index into
 * this list is stable for the file route.
 */
export function orderMediaList(order: {
  video_url?: string | null;
  video_urls?: string[] | null;
  final_video_url?: string | null;
}): string[] {
  const first = order.final_video_url ?? order.video_url ?? null;
  const all = [first, ...(order.video_urls ?? [])].filter((v): v is string => !!v);
  return [...new Set(all)];
}

/**
 * The app route that serves an order's video after checking ownership and
 * payment. Pages link here instead of to storage, so no permanent file URL
 * ever reaches the browser.
 */
export function videoFileRoute(orderId: string, opts: { clip?: number; download?: boolean } = {}): string {
  const params = new URLSearchParams();
  if (opts.clip) params.set("clip", String(opts.clip));
  if (opts.download) params.set("download", "1");
  const query = params.toString();
  return `/api/videos/${orderId}/file${query ? `?${query}` : ""}`;
}

export function videoPreviewRoute(orderId: string): string {
  return `/api/videos/${orderId}/preview`;
}

// ── Sharing & embedding ──────────────────────────────────────────────────

/** URL-safe random token for a public share link (192 bits). */
export function generateShareToken(): string {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function isShareToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{24,64}$/.test(value);
}

/** The deployment's public origin, without a trailing slash. */
export function publicBaseUrl(env: Record<string, string | undefined> = process.env): string {
  const raw = env.NEXT_PUBLIC_APP_URL || env.APP_URL || "https://www.somevideopost.com";
  return raw.replace(/\/+$/, "");
}

export function embedUrl(token: string, baseUrl = publicBaseUrl()): string {
  return `${baseUrl}/embed/${token}`;
}

/** Height as a percentage of width, for the responsive embed wrapper. */
export function aspectPaddingPercent(aspect: string | null | undefined): number {
  switch (aspect) {
    case "16:9": return 56.25;
    case "1:1": return 100;
    default: return 177.78; // 9:16
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Copy-paste embed code: an iframe inside a wrapper that keeps the video's
 * own aspect ratio at any width. Portrait videos are capped so they do not
 * take over a desktop page.
 */
export function buildEmbedCode(opts: {
  token: string;
  aspect: string | null | undefined;
  title?: string | null;
  baseUrl?: string;
}): string {
  const src = embedUrl(opts.token, opts.baseUrl);
  const padding = aspectPaddingPercent(opts.aspect);
  const maxWidth = opts.aspect === "16:9" ? "100%" : opts.aspect === "1:1" ? "560px" : "360px";
  const title = escapeAttr(opts.title?.trim() || "Præsentationsvideo");
  return (
    `<div style="position:relative;width:100%;max-width:${maxWidth};margin:0 auto;">` +
    `<div style="position:relative;padding-bottom:${padding}%;height:0;overflow:hidden;">` +
    `<iframe src="${escapeAttr(src)}" title="${title}" loading="lazy" ` +
    `allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ` +
    `style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>` +
    `</div></div>`
  );
}
