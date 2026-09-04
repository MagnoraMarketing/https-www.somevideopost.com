/**
 * Actual-property-image extraction.
 *
 * The single most important step of the pipeline: WAN must animate the real
 * photographs of the property, never its own idea of one. So this tries every
 * place a listing page can hide its gallery — attributes, meta tags, JSON-LD,
 * embedded Next.js/React payloads, and raw image URLs inside script bodies —
 * and only then filters and ranks what it found.
 */

export type ImageCandidate = {
  url: string;
  /** Which strategy found it — carried into the database for diagnostics. */
  method: ExtractionMethod;
  /** Discovery order within the page; a proxy for gallery position. */
  position: number;
  /** Dimensions when the markup declared them (width/height attrs, srcset). */
  declaredWidth?: number;
  declaredHeight?: number;
  score: number;
};

export type ExtractionMethod =
  | "og:image"
  | "meta"
  | "json-ld"
  | "embedded-json"
  | "img-src"
  | "img-srcset"
  | "img-lazy"
  | "source-srcset"
  | "css-background"
  | "script-url"
  | "upload";

/** Path/filename fragments that never belong to a property photograph. */
const JUNK_PATTERNS = [
  /logo/i, /favicon/i, /sprite/i, /icon/i, /avatar/i, /profile/i,
  /placeholder/i, /banner/i, /advert/i, /\bads?\b/i, /tracking/i,
  /pixel/i, /beacon/i, /badge/i, /flag/i, /button/i, /arrow/i,
  /spinner/i, /loader/i, /watermark/i, /qr[-_]?code/i, /captcha/i,
  /social/i, /facebook/i, /instagram/i, /twitter/i, /whatsapp/i,
  /trustpilot/i, /payment/i, /visa/i, /mastercard/i, /cookie/i,
  /map[-_]?marker/i, /googlemaps/i, /staticmap/i, /street[-_]?view/i,
];

/** Hosts that only ever serve chrome, analytics or other listings. */
const JUNK_HOSTS = [
  /google-analytics\./i, /googletagmanager\./i, /doubleclick\./i,
  /facebook\.com\/tr/i, /gravatar\./i, /\.gstatic\./i,
  /maps\.googleapis\./i, /trustpilot\./i,
];

/** Fragments that mark a *different* property being recommended alongside. */
const RELATED_PATTERNS = [/recommend/i, /related/i, /similar/i, /suggest/i, /also[-_]?like/i, /carousel[-_]?other/i];

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)(\?|#|$)/i;

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x2F;/gi, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/\\u002[fF]/g, "/").replace(/\\\//g, "/");
}

function absolutize(url: string, base: string): string | null {
  const cleaned = decodeEntities(url).trim().replace(/^["']|["']$/g, "");
  if (!cleaned || cleaned.startsWith("data:") || cleaned.startsWith("blob:")) return null;
  try {
    const abs = new URL(cleaned, base);
    if (abs.protocol !== "http:" && abs.protocol !== "https:") return null;
    return abs.toString();
  } catch {
    return null;
  }
}

/**
 * Normalise a URL for duplicate detection: many portals serve the same
 * photograph under a dozen resize/CDN query strings.
 */
export function normalizeForDedupe(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    // Drop the parameters that only pick a rendition of the same source image.
    const dropped = ["w", "h", "width", "height", "size", "resize", "fit", "q", "quality",
      "dpr", "format", "fm", "auto", "crop", "s", "v", "t", "rev", "cache"];
    dropped.forEach((p) => u.searchParams.delete(p));
    // ".../image_640x480.jpg" and ".../image.jpg" are the same photograph.
    const sizeWords = "thumb|thumbnail|small|medium|large|xl|xxl|preview|mini|tiny|full|original";
    u.pathname = u.pathname
      .replace(/[-_/](?:\d{2,5})x(?:\d{2,5})(?=[./_-]|$)/gi, "")
      // As a filename suffix ("photo-thumb.jpg")…
      .replace(new RegExp(`[-_](?:${sizeWords})(?=[./_-]|$)`, "gi"), "")
      // …and as a whole path segment ("/thumb/photo.jpg"), which portals use
      // just as often for the same underlying photograph.
      .replace(new RegExp(`/(?:${sizeWords})(?=/)`, "gi"), "");
    return `${u.hostname}${u.pathname}?${[...u.searchParams.entries()].sort().map(([k, v]) => `${k}=${v}`).join("&")}`;
  } catch {
    return url;
  }
}

/** Pick the largest rendition declared in a srcset. */
function bestFromSrcset(srcset: string, base: string): { url: string; width?: number } | null {
  const entries = srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [rawUrl, descriptor] = part.split(/\s+/);
      const width = descriptor?.endsWith("w") ? Number(descriptor.slice(0, -1)) : undefined;
      return { rawUrl, width: Number.isFinite(width) ? width : undefined };
    })
    .filter((e) => e.rawUrl);
  if (!entries.length) return null;
  entries.sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  const url = absolutize(entries[0].rawUrl, base);
  return url ? { url, width: entries[0].width } : null;
}

function looksLikeJunk(url: string): boolean {
  if (JUNK_HOSTS.some((re) => re.test(url))) return true;
  // Only test the path+query: a CDN host may legitimately contain "cdn-icons".
  let target = url;
  try {
    const u = new URL(url);
    target = `${u.pathname}${u.search}`;
  } catch { /* fall back to the whole string */ }
  return JUNK_PATTERNS.some((re) => re.test(target));
}

function looksLikeOtherProperty(url: string): boolean {
  return RELATED_PATTERNS.some((re) => re.test(url));
}

/** Ranking signal — bigger is better; used before real dimensions are known. */
function scoreCandidate(c: Omit<ImageCandidate, "score">): number {
  let score = 0;
  const declared = Math.max(c.declaredWidth ?? 0, c.declaredHeight ?? 0);
  if (declared >= 1600) score += 40;
  else if (declared >= 1000) score += 30;
  else if (declared >= 600) score += 18;
  else if (declared > 0) score += 4;

  // Extraction method says a lot about intent: a gallery <img> or the JSON the
  // page hydrates from is a property photo far more often than a stray CSS
  // background is.
  score += {
    "og:image": 26, "json-ld": 24, "embedded-json": 22, "img-srcset": 20,
    "source-srcset": 18, "img-src": 16, "img-lazy": 16, meta: 12,
    "script-url": 8, "css-background": 6, upload: 30,
  }[c.method];

  if (/gallery|slide|photo|image|billede|media|foto/i.test(c.url)) score += 8;
  if (/\/(thumb|thumbnail|small|mini|tiny|icon)/i.test(c.url)) score -= 20;
  if (IMAGE_EXT.test(c.url)) score += 6;
  // Earlier images on a listing page are the hero shots.
  score += Math.max(0, 12 - c.position);
  return score;
}

type RawHit = {
  url: string;
  method: ExtractionMethod;
  declaredWidth?: number;
  declaredHeight?: number;
};

/** Walk any parsed JSON value and collect strings that look like image URLs. */
function collectImageUrlsFromJson(value: unknown, base: string, out: RawHit[], method: ExtractionMethod, depth = 0): void {
  if (depth > 12 || out.length > 400) return;
  if (typeof value === "string") {
    if (IMAGE_EXT.test(value) || /^https?:\/\/[^\s"']+\/(?:image|photo|media|picture)s?\//i.test(value)) {
      const abs = absolutize(value, base);
      if (abs) out.push({ url: abs, method });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => collectImageUrlsFromJson(v, base, out, method, depth + 1));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      // A width/height sibling of a url key is a strong dimension hint.
      if (typeof v === "string" && /^(url|src|image|imageUrl|contentUrl|href|large|original|full)$/i.test(key)) {
        const abs = absolutize(v, base);
        if (abs && (IMAGE_EXT.test(abs) || /image|photo|media/i.test(abs))) {
          const parent = value as Record<string, unknown>;
          out.push({
            url: abs,
            method,
            declaredWidth: typeof parent.width === "number" ? parent.width : undefined,
            declaredHeight: typeof parent.height === "number" ? parent.height : undefined,
          });
          continue;
        }
      }
      collectImageUrlsFromJson(v, base, out, method, depth + 1);
    }
  }
}

/**
 * Run every extraction strategy over the page source.
 *
 * Strategies are additive rather than sequential — a listing may put its hero
 * in OpenGraph and the rest of the gallery in a hydration payload, and taking
 * only the first strategy that returns something would lose most of the
 * gallery.
 */
export function extractImageCandidates(html: string, pageUrl: string): ImageCandidate[] {
  const hits: RawHit[] = [];
  const base = (() => {
    const m = html.match(/<base[^>]+href=["']([^"']+)["']/i);
    if (m) { try { return new URL(m[1], pageUrl).toString(); } catch { /* keep pageUrl */ } }
    return pageUrl;
  })();

  // 1. OpenGraph / Twitter / generic meta images
  const metaRe = /<meta[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(html)) !== null) {
    const tag = m[0];
    const key = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if (!key || !content) continue;
    if (!/^(og:image(:secure_url|:url)?|twitter:image(:src)?|image|thumbnail)$/.test(key)) continue;
    const abs = absolutize(content, base);
    if (abs) hits.push({ url: abs, method: key.startsWith("og:") ? "og:image" : "meta" });
  }

  // 2. JSON-LD
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = ldRe.exec(html)) !== null) {
    try { collectImageUrlsFromJson(JSON.parse(m[1].trim()), base, hits, "json-ld"); } catch { /* malformed block */ }
  }

  // 3. Hydration payloads — Next.js, Nuxt, Apollo, Redux and friends
  const embeddedRe =
    /<script[^>]*(?:id=["'](?:__NEXT_DATA__|__NUXT_DATA__|__APOLLO_STATE__)["']|type=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = embeddedRe.exec(html)) !== null) {
    try { collectImageUrlsFromJson(JSON.parse(m[1].trim()), base, hits, "embedded-json"); } catch { /* not JSON */ }
  }
  const stateRe = /(?:window\.__(?:INITIAL_STATE|NUXT|PRELOADED_STATE|DATA)__|self\.__next_f\.push)\s*[=(]\s*([\s\S]{0,400000}?)(?:;\s*(?:<\/script>|window\.)|\)\s*;?\s*<\/script>)/gi;
  while ((m = stateRe.exec(html)) !== null) {
    const chunk = m[1];
    try { collectImageUrlsFromJson(JSON.parse(chunk), base, hits, "embedded-json"); }
    catch {
      // Streamed React payloads aren't valid JSON on their own — fall back to
      // pulling the image URLs straight out of the chunk.
      const urlRe = /https?:\\?\/\\?\/[^\s"'\\]+?\.(?:jpe?g|png|webp|avif)(?:\?[^\s"'\\]*)?/gi;
      let u: RegExpExecArray | null;
      while ((u = urlRe.exec(chunk)) !== null) {
        const abs = absolutize(u[0], base);
        if (abs) hits.push({ url: abs, method: "embedded-json" });
      }
    }
  }

  // 4. <img> — src, the lazy-loading attributes, and srcset
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const width = Number(tag.match(/\bwidth=["']?(\d+)/i)?.[1]);
    const height = Number(tag.match(/\bheight=["']?(\d+)/i)?.[1]);
    const dims = {
      declaredWidth: Number.isFinite(width) ? width : undefined,
      declaredHeight: Number.isFinite(height) ? height : undefined,
    };

    const srcset = tag.match(/\b(?:data-)?srcset=["']([^"']+)["']/i)?.[1];
    if (srcset) {
      const best = bestFromSrcset(srcset, base);
      if (best) hits.push({ url: best.url, method: "img-srcset", declaredWidth: best.width ?? dims.declaredWidth, declaredHeight: dims.declaredHeight });
    }
    for (const attr of ["data-src", "data-lazy-src", "data-original", "data-image", "data-large", "data-full"]) {
      const v = tag.match(new RegExp(`\\b${attr}=["']([^"']+)["']`, "i"))?.[1];
      const abs = v ? absolutize(v, base) : null;
      if (abs) hits.push({ url: abs, method: "img-lazy", ...dims });
    }
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const absSrc = src ? absolutize(src, base) : null;
    if (absSrc) hits.push({ url: absSrc, method: "img-src", ...dims });
  }

  // 5. <source srcset> inside <picture>
  const sourceRe = /<source\b[^>]*>/gi;
  while ((m = sourceRe.exec(html)) !== null) {
    const srcset = m[0].match(/\b(?:data-)?srcset=["']([^"']+)["']/i)?.[1];
    if (!srcset) continue;
    const best = bestFromSrcset(srcset, base);
    if (best) hits.push({ url: best.url, method: "source-srcset", declaredWidth: best.width });
  }

  // 6. CSS background images in inline styles
  const bgRe = /background(?:-image)?\s*:\s*[^;"']*url\((["']?)([^"')]+)\1\)/gi;
  while ((m = bgRe.exec(html)) !== null) {
    const abs = absolutize(m[2], base);
    if (abs) hits.push({ url: abs, method: "css-background" });
  }

  // 7. Last resort — any image URL anywhere in the source, including scripts
  if (hits.length < 6) {
    const looseRe = /https?:\/\/[^\s"'<>\\)]+?\.(?:jpe?g|png|webp|avif)(?:\?[^\s"'<>\\)]*)?/gi;
    while ((m = looseRe.exec(html)) !== null) {
      const abs = absolutize(m[0], base);
      if (abs) hits.push({ url: abs, method: "script-url" });
    }
  }

  return filterAndRank(hits);
}

/** Filter junk, deduplicate by normalised URL, and rank by likely relevance. */
export function filterAndRank(hits: RawHit[]): ImageCandidate[] {
  const byKey = new Map<string, ImageCandidate>();
  let position = 0;

  for (const hit of hits) {
    if (looksLikeJunk(hit.url) || looksLikeOtherProperty(hit.url)) continue;
    // A declared size this small is a tracking pixel or a UI icon.
    const declared = Math.max(hit.declaredWidth ?? 0, hit.declaredHeight ?? 0);
    if (declared > 0 && declared < 200) continue;
    if (hit.url.length > 2000) continue;

    const key = normalizeForDedupe(hit.url);
    const candidate: ImageCandidate = {
      url: hit.url,
      method: hit.method,
      position: position,
      declaredWidth: hit.declaredWidth,
      declaredHeight: hit.declaredHeight,
      score: 0,
    };
    candidate.score = scoreCandidate(candidate);

    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, candidate);
      position++;
    } else if (candidate.score > existing.score) {
      // Same photograph found by a better strategy or in a larger rendition —
      // keep its position so gallery order survives.
      byKey.set(key, { ...candidate, position: existing.position });
    }
  }

  return [...byKey.values()].sort((a, b) => b.score - a.score || a.position - b.position);
}
