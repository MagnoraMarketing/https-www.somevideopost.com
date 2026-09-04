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

function rejectionReason(info: ImageInfo): string | null {
  const { width, height, byteLength } = info;
  if (byteLength < IMAGE_LIMITS.minBytes) return `for lille fil (${byteLength} bytes)`;
  if (width < IMAGE_LIMITS.minWidth || height < IMAGE_LIMITS.minHeight) {
    return `for lav opløsning (${width}x${height})`;
  }
  const ratio = Math.max(width / height, height / width);
  if (ratio > IMAGE_LIMITS.maxAspectRatio) return `banner-format (${width}x${height})`;
  return null;
}

async function downloadOne(candidate: ImageCandidate): Promise<DownloadedImage | DownloadFailure> {
  try {
    const res = await safeFetch(candidate.url, {
      timeoutMs: IMAGE_LIMITS.timeoutMs,
      maxBytes: IMAGE_LIMITS.maxBytes,
      accept: "image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8,*/*;q=0.5",
    });

    if (res.status !== 200) return { url: candidate.url, reason: `HTTP ${res.status}` };
    // The declared content-type is a hint only — the magic bytes decide.
    if (res.contentType && !res.contentType.startsWith("image/")) {
      return { url: candidate.url, reason: `forkert content-type (${res.contentType})` };
    }

    const info = readImageInfo(res.body);
    if (!info) return { url: candidate.url, reason: "ikke et gyldigt JPG/PNG/WEBP-billede" };

    const rejected = rejectionReason(info);
    if (rejected) return { url: candidate.url, reason: rejected };

    return { candidate, buffer: res.body, info };
  } catch (e) {
    const reason = e instanceof UnsafeUrlError ? e.message : e instanceof Error ? e.message : String(e);
    return { url: candidate.url, reason: reason.slice(0, 160) };
  }
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
): Promise<DownloadResult> {
  const queue = candidates.slice(0, limit);
  const images: DownloadedImage[] = [];
  const failures: DownloadFailure[] = [];
  const seenHashes = new Set<string>();

  for (let i = 0; i < queue.length; i += IMAGE_LIMITS.concurrency) {
    const batch = queue.slice(i, i + IMAGE_LIMITS.concurrency);
    const results = await Promise.all(batch.map(downloadOne));
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
