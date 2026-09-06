import { safeFetch, UnsafeUrlError } from "@/lib/safe-fetch";
import { readImageInfo, type ImageInfo } from "./image-file";
import type { ImageCandidate } from "./extract-images";

/**
 * Server-side image download.
 *
 * Source URLs are frequently signed or short-lived, so every image the
 * pipeline uses is downloaded and re-hosted before WAN ever sees it. WAN is
 * never pointed at a third-party URL that can expire mid-generation.
 */

export type DownloadedImage = {
  candidate: ImageCandidate;
  buffer: Buffer;
  info: ImageInfo;
};

export type DownloadFailure = {
  url: string;
  reason: string;
};

export type DownloadResult = {
  images: DownloadedImage[];
  failures: DownloadFailure[];
  /** How many candidates were offered — the "Found 18 / Downloaded 14" line. */
  attempted: number;
};

export const IMAGE_LIMITS = {
  /** Refuse anything larger; a listing photo is never 20 MB. */
  maxBytes: 15 * 1024 * 1024,
  /** Below this a file is a thumbnail, an icon or a tracking pixel. */
  minWidth: 500,
  minHeight: 320,
  minBytes: 8 * 1024,
  /** Extreme aspect ratios are banners and dividers, not rooms. */
  maxAspectRatio: 3.2,
  /** Cap the work per import — the AI Director only needs 6-8 in the end. */
  maxDownloads: 24,
  /** Politeness and function-time budget: how many downloads run at once. */
  concurrency: 4,
  timeoutMs: 20_000,
} as const;

export type ImageLimits = { -readonly [K in keyof typeof IMAGE_LIMITS]: number };

/**
 * Thresholds for photographs the customer already chose — the listing images
 * shown in the order form, or files they uploaded themselves.
 *
 * The strict limits above exist to sort real photos out of a page full of
 * icons, banners and tracking pixels. That job is already done for a picked
 * image, so applying them again only throws away photographs the customer can
 * see on their own screen. A generous floor still keeps favicons out.
 */
export const CHOSEN_IMAGE_LIMITS: ImageLimits = {
  ...IMAGE_LIMITS,
  minWidth: 320,
  minHeight: 200,
  minBytes: 4 * 1024,
  maxAspectRatio: 4,
};

export type DownloadOptions = {
  /**
   * The listing page the images were found on. Sent as `Referer`: many CDNs
   * serve a photo to a browser coming from the listing and answer 403 to a
   * bare server-side request for the very same URL.
   */
  referer?: string;
  /** Validation thresholds; defaults to the strict {@link IMAGE_LIMITS}. */
  limits?: ImageLimits;
};

function rejectionReason(info: ImageInfo, limits: ImageLimits): string | null {
  const { width, height, byteLength } = info;
  if (byteLength < limits.minBytes) return `for lille fil (${byteLength} bytes)`;
  if (width < limits.minWidth || height < limits.minHeight) {
    return `for lav opløsning (${width}x${height})`;
  }
  const ratio = Math.max(width / height, height / width);
  if (ratio > limits.maxAspectRatio) return `banner-format (${width}x${height})`;
  return null;
}

const IMAGE_ACCEPT = "image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8,*/*;q=0.5";

/** One HTTP attempt, optionally pretending to come from the listing page. */
async function fetchImage(url: string, limits: ImageLimits, referer?: string) {
  return safeFetch(url, {
    timeoutMs: limits.timeoutMs,
    maxBytes: limits.maxBytes,
    accept: IMAGE_ACCEPT,
    headers: referer ? { Referer: referer } : undefined,
  });
}

async function downloadOne(
  candidate: ImageCandidate,
  options: DownloadOptions = {},
): Promise<DownloadedImage | DownloadFailure> {
  const limits = options.limits ?? IMAGE_LIMITS;
  // Hotlink protection cuts both ways: some CDNs demand a Referer from the
  // listing, others reject requests that carry one. Try the listing's own
  // Referer first, then a bare request, before calling the image unavailable.
  const attempts: (string | undefined)[] = options.referer ? [options.referer, undefined] : [undefined];

  let lastReason = "kunne ikke hentes";
  for (const referer of attempts) {
    try {
      const res = await fetchImage(candidate.url, limits, referer);

      if (res.status !== 200) { lastReason = `HTTP ${res.status}`; continue; }
      // The declared content-type is a hint only — the magic bytes decide.
      if (res.contentType && !res.contentType.startsWith("image/")) {
        lastReason = `forkert content-type (${res.contentType})`;
        continue;
      }

      const info = readImageInfo(res.body);
      if (!info) return { url: candidate.url, reason: "ikke et gyldigt JPG/PNG/WEBP-billede" };

      // A retry cannot change the file's own dimensions — stop here.
      const rejected = rejectionReason(info, limits);
      if (rejected) return { url: candidate.url, reason: rejected };

      return { candidate, buffer: res.body, info };
    } catch (e) {
      lastReason = (e instanceof UnsafeUrlError || e instanceof Error ? e.message : String(e)).slice(0, 160);
    }
  }

  return { url: candidate.url, reason: lastReason };
}

function isFailure(value: DownloadedImage | DownloadFailure): value is DownloadFailure {
  return "reason" in value;
}

/**
 * Download candidates in ranked order, dropping byte-identical duplicates that
 * survived URL-level deduplication (the same photograph served from two CDNs).
 */
export async function downloadImages(
  candidates: ImageCandidate[],
  limit: number = IMAGE_LIMITS.maxDownloads,
  options: DownloadOptions = {},
): Promise<DownloadResult> {
  const queue = candidates.slice(0, limit);
  const images: DownloadedImage[] = [];
  const failures: DownloadFailure[] = [];
  const seenHashes = new Set<string>();

  for (let i = 0; i < queue.length; i += IMAGE_LIMITS.concurrency) {
    const batch = queue.slice(i, i + IMAGE_LIMITS.concurrency);
    const results = await Promise.all(batch.map((candidate) => downloadOne(candidate, options)));
    for (const result of results) {
      if (isFailure(result)) { failures.push(result); continue; }
      if (seenHashes.has(result.info.hash)) {
        failures.push({ url: result.candidate.url, reason: "dublet af et allerede hentet billede" });
        continue;
      }
      seenHashes.add(result.info.hash);
      images.push(result);
    }
  }

  return { images, failures, attempted: queue.length };
}
