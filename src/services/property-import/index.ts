import { createAdminClient } from "@/lib/supabase/admin";
import { safeFetch, UnsafeUrlError, assertPublicUrl } from "@/lib/safe-fetch";
import { extractProperty, type ExtractedProperty } from "./extract-property";
import { extractImageCandidates, type ImageCandidate } from "./extract-images";
import { downloadImages, IMAGE_LIMITS } from "./download-images";
import { storeSourceImages, type StoredImage } from "./store-images";

export type { ExtractedProperty } from "./extract-property";
export type { ImageCandidate } from "./extract-images";
export type { StoredImage } from "./store-images";

const LOG = "[property-import]";

/** Counts that make "Found 18 / Downloaded 14" answerable in the UI and logs. */
export type ImportDiagnostics = {
  candidatesFound: number;
  downloadAttempted: number;
  downloaded: number;
  stored: number;
  failures: { url: string; reason: string }[];
  methods: Record<string, number>;
  cached: boolean;
  fetchedUrl?: string;
};

export type PropertyImportResult = {
  property: ExtractedProperty;
  images: StoredImage[];
  diagnostics: ImportDiagnostics;
};

export class PropertyImportError extends Error {
  readonly code: "unsafe_url" | "fetch_failed" | "no_images";
  constructor(code: PropertyImportError["code"], message: string) {
    super(message);
    this.name = "PropertyImportError";
    this.code = code;
  }
}

/** How long a cached listing stays fresh before it is re-fetched. */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_PAGE_BYTES = 6 * 1024 * 1024;

function cacheKey(url: URL): string {
  // Tracking parameters must not fragment the cache.
  const clean = new URL(url.toString());
  [...clean.searchParams.keys()]
    .filter((k) => /^(utm_|gclid|fbclid|msclkid|ref|source)/i.test(k))
    .forEach((k) => clean.searchParams.delete(k));
  clean.hash = "";
  return `${clean.host}${clean.pathname}${clean.search}`.toLowerCase();
}

type CacheRow = { property_data: ExtractedProperty; image_urls: ImageCandidate[]; fetched_at: string };

async function readCache(key: string): Promise<CacheRow | null> {
  try {
    const { data } = await createAdminClient()
      .from("property_import_cache")
      .select("property_data, image_urls, fetched_at")
      .eq("url_key", key)
      .maybeSingle<CacheRow>();
    if (!data) return null;
    if (Date.now() - new Date(data.fetched_at).getTime() > CACHE_TTL_MS) return null;
    return data;
  } catch {
    // A cache miss must never fail an import.
    return null;
  }
}

async function writeCache(key: string, sourceUrl: string, property: ExtractedProperty, candidates: ImageCandidate[]): Promise<void> {
  try {
    await createAdminClient().from("property_import_cache").upsert(
      {
        url_key: key,
        source_url: sourceUrl,
        property_data: property,
        image_urls: candidates.slice(0, 40),
        fetched_at: new Date().toISOString(),
      },
      { onConflict: "url_key" },
    );
  } catch { /* caching is best-effort */ }
}

/**
 * Fetch a listing page and pull out its property data and image candidates.
 *
 * `forceRefresh` bypasses the cache so stale listings can be re-read.
 */
export async function readPropertyPage(
  rawUrl: string,
  forceRefresh = false,
): Promise<{ property: ExtractedProperty; candidates: ImageCandidate[]; cached: boolean; fetchedUrl: string }> {
  let url: URL;
  try {
    url = await assertPublicUrl(rawUrl);
  } catch (e) {
    throw new PropertyImportError("unsafe_url", e instanceof UnsafeUrlError ? e.message : "Ugyldig URL");
  }

  const key = cacheKey(url);
  if (!forceRefresh) {
    const cached = await readCache(key);
    if (cached) {
      console.info(`${LOG} cache hit for ${key} (${cached.image_urls.length} candidates)`);
      return { property: cached.property_data, candidates: cached.image_urls, cached: true, fetchedUrl: url.toString() };
    }
  }

  console.info(`${LOG} fetching property ${url.host}${url.pathname}`);
  let html: string;
  let fetchedUrl: string;
  try {
    const res = await safeFetch(url.toString(), { timeoutMs: 20_000, maxBytes: MAX_PAGE_BYTES });
    if (res.status !== 200) {
      throw new PropertyImportError("fetch_failed", `Siden svarede med HTTP ${res.status}`);
    }
    html = res.body.toString("utf8");
    fetchedUrl = res.url;
  } catch (e) {
    if (e instanceof PropertyImportError) throw e;
    const reason = e instanceof UnsafeUrlError ? e.message : e instanceof Error ? e.message : String(e);
    throw new PropertyImportError("fetch_failed", `Siden kunne ikke hentes: ${reason.slice(0, 160)}`);
  }

  const property = extractProperty(html);
  const candidates = extractImageCandidates(html, fetchedUrl);
  console.info(`${LOG} found ${candidates.length} image candidates on ${url.host}`);

  await writeCache(key, url.toString(), property, candidates);
  return { property, candidates, cached: false, fetchedUrl };
}

/**
 * The full URL import: page → property data → actual photographs → storage.
 *
 * Throws `no_images` rather than continuing when nothing usable was retrieved.
 * Generating from an AI impression of the property instead is the one outcome
 * the product must never produce (§12) — the customer uploads photos instead.
 */
export async function importPropertyFromUrl(
  userId: string,
  orderId: string,
  rawUrl: string,
  options: { forceRefresh?: boolean; maxImages?: number } = {},
): Promise<PropertyImportResult> {
  const { property, candidates, cached, fetchedUrl } = await readPropertyPage(rawUrl, options.forceRefresh);

  const limit = options.maxImages ?? IMAGE_LIMITS.maxDownloads;
  console.info(`${LOG} downloading up to ${Math.min(limit, candidates.length)} of ${candidates.length} candidates`);
  const download = await downloadImages(candidates, limit);
  console.info(`${LOG} downloaded ${download.images.length} images (${download.failures.length} failed)`);

  const { stored, failures: storeFailures } = await storeSourceImages(userId, orderId, download.images);
  console.info(`${LOG} stored ${stored.length} images for order ${orderId}`);

  const methods: Record<string, number> = {};
  for (const image of stored) {
    methods[image.extractionMethod] = (methods[image.extractionMethod] ?? 0) + 1;
  }

  const diagnostics: ImportDiagnostics = {
    candidatesFound: candidates.length,
    downloadAttempted: download.attempted,
    downloaded: download.images.length,
    stored: stored.length,
    failures: [...download.failures, ...storeFailures].slice(0, 30),
    methods,
    cached,
    fetchedUrl,
  };

  if (stored.length === 0) {
    throw new PropertyImportError(
      "no_images",
      "Vi kunne ikke hente boligens billeder pålideligt fra denne hjemmeside. " +
        "Upload dine egne billeder af boligen for at fortsætte.",
    );
  }

  return { property, images: stored, diagnostics };
}
