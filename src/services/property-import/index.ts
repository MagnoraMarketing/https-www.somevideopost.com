import { createAdminClient } from "@/lib/supabase/admin";
import { safeFetch, UnsafeUrlError, assertPublicUrl } from "@/lib/safe-fetch";
import { extractProperty, type ExtractedProperty } from "./extract-property";
import { extractImageCandidates, type ImageCandidate } from "./extract-images";
import { CHOSEN_IMAGE_LIMITS, downloadImages, IMAGE_LIMITS } from "./download-images";
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
  // A read that found no photographs is not worth remembering for 24 hours —
  // caching it would make every retry repeat the same empty answer.
  if (!candidates.length) return;
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
  let html: string | null = null;
  let fetchedUrl = url.toString();
  let readError = "";
  try {
    const res = await safeFetch(url.toString(), { timeoutMs: 20_000, maxBytes: MAX_PAGE_BYTES });
    if (res.status === 200) {
      html = res.body.toString("utf8");
      fetchedUrl = res.url;
    } else {
      readError = `Siden svarede med HTTP ${res.status}`;
    }
  } catch (e) {
    const reason = e instanceof UnsafeUrlError ? e.message : e instanceof Error ? e.message : String(e);
    readError = `Siden kunne ikke hentes: ${reason.slice(0, 160)}`;
  }

  if (html !== null) {
    const property = extractProperty(html);
    const candidates = extractImageCandidates(html, fetchedUrl);
    console.info(`${LOG} found ${candidates.length} image candidates on ${url.host}`);
    if (candidates.length) {
      await writeCache(key, url.toString(), property, candidates);
      return { property, candidates, cached: false, fetchedUrl };
    }
    // The page was readable but held no usable photographs — a gallery that
    // only exists after JavaScript runs. The scraper below can see those.
    const viaScraper = await scrapedPage(rawUrl);
    if (viaScraper) {
      await writeCache(key, url.toString(), viaScraper.property, viaScraper.candidates);
      return { ...viaScraper, cached: false, fetchedUrl };
    }
    await writeCache(key, url.toString(), property, candidates);
    return { property, candidates, cached: false, fetchedUrl };
  }

  // A direct read was blocked (bot wall, 403, timeout). The order form's
  // scraper reaches the same listings through a headless browser and reader
  // proxies, so the pipeline uses it rather than giving up on the listing.
  console.warn(`${LOG} direct read failed (${readError}) — trying the scraper`);
  const viaScraper = await scrapedPage(rawUrl);
  if (!viaScraper) throw new PropertyImportError("fetch_failed", readError || "Siden kunne ikke hentes");

  await writeCache(key, url.toString(), viaScraper.property, viaScraper.candidates);
  return { ...viaScraper, cached: false, fetchedUrl };
}

/**
 * Read a listing through the multi-strategy scraper (headless browser, reader
 * proxies, caches) that the order form already uses successfully.
 */
async function scrapedPage(
  rawUrl: string,
): Promise<{ property: ExtractedProperty; candidates: ImageCandidate[] } | null> {
  try {
    const { scrapePropertyUrl } = await import("@/services/scrape-property");
    const { data } = await scrapePropertyUrl(rawUrl);
    if (!data) return null;

    const candidates: ImageCandidate[] = data.imageUrls
      .filter((imageUrl) => /^https?:\/\//i.test(imageUrl))
      .map((imageUrl, position) => ({
        url: imageUrl, method: "scraper-fallback", position, score: 90,
      }));
    console.info(`${LOG} scraper read the listing (${candidates.length} images)`);
    if (!candidates.length) return null;

    return {
      property: {
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        features: { amenities: [] },
      },
      candidates,
    };
  } catch (e) {
    console.warn(`${LOG} scraper read failed: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

/**
 * Store photographs the customer has already chosen — the listing images the
 * order form found, or ones they picked by hand.
 *
 * Separate from an import on purpose: these URLs are not candidates that have
 * to earn their place among a page full of banners and icons, they are the
 * pictures the customer is looking at on their own screen. So they are fetched
 * with the listing as `Referer` and validated against the lenient thresholds,
 * and every one that comes back is stored in Supabase Storage.
 */
export async function adoptChosenImages(
  userId: string,
  orderId: string,
  urls: string[],
  options: { referer?: string } = {},
): Promise<{ stored: StoredImage[]; failures: { url: string; reason: string }[]; attempted: number }> {
  const httpUrls = urls.filter((url) => /^https?:\/\//i.test(url));
  if (!httpUrls.length) return { stored: [], failures: [], attempted: 0 };

  const candidates: ImageCandidate[] = httpUrls.map((url, position) => ({
    url, method: "chosen", position, score: 100,
  }));

  const download = await downloadImages(candidates, httpUrls.length, {
    referer: options.referer,
    limits: CHOSEN_IMAGE_LIMITS,
  });
  const { stored, failures } = await storeSourceImages(userId, orderId, download.images);
  console.info(
    `${LOG} adopted ${stored.length}/${httpUrls.length} chosen images for order ${orderId}` +
      (download.failures.length ? ` (${download.failures.length} kunne ikke hentes)` : ""),
  );

  return {
    stored,
    failures: [...download.failures, ...failures],
    attempted: httpUrls.length,
  };
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
  // The listing page is sent as Referer: hotlink-protected CDNs answer 403 to
  // a bare request for a photo they serve happily to the listing itself.
  let download = await downloadImages(candidates, limit, { referer: fetchedUrl });
  console.info(`${LOG} downloaded ${download.images.length} images (${download.failures.length} failed)`);

  // Nothing usable from the page we read ourselves — try the resilient scraper
  // before concluding the listing's photographs cannot be retrieved.
  let usedCandidates = candidates;
  if (!download.images.length) {
    const fallback = (await scrapedPage(rawUrl))?.candidates ?? [];
    const fresh = fallback.filter((c) => !candidates.some((existing) => existing.url === c.url));
    if (fresh.length) {
      const retry = await downloadImages(fresh, limit, {
        referer: fetchedUrl,
        limits: CHOSEN_IMAGE_LIMITS,
      });
      console.info(`${LOG} scraper fallback downloaded ${retry.images.length} images`);
      usedCandidates = [...candidates, ...fresh];
      download = {
        images: retry.images,
        failures: [...download.failures, ...retry.failures],
        attempted: download.attempted + retry.attempted,
      };
    }
  }

  const { stored, failures: storeFailures } = await storeSourceImages(userId, orderId, download.images);
  console.info(`${LOG} stored ${stored.length} images for order ${orderId}`);

  const methods: Record<string, number> = {};
  for (const image of stored) {
    methods[image.extractionMethod] = (methods[image.extractionMethod] ?? 0) + 1;
  }

  const diagnostics: ImportDiagnostics = {
    candidatesFound: usedCandidates.length,
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
