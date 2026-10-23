/**
 * Pipeline self-test.
 *
 * Exercises the parts of the property-video pipeline that can be verified
 * without reaching Alibaba or a live listing site: URL safety, property and
 * image extraction, image validation, selection, storyboard arithmetic and —
 * when ffmpeg is present — a real render checked for exactly 15.000 seconds.
 *
 *   node --import ./scripts/register-alias.mjs scripts/pipeline-selftest.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { assertPublicUrl, ipIsPrivate, UnsafeUrlError } from "@/lib/safe-fetch";
import { extractImageCandidates, normalizeForDedupe } from "@/services/property-import/extract-images";
import { extractProperty } from "@/services/property-import/extract-property";
import { readImageInfo } from "@/services/property-import/image-file";
import { CHOSEN_IMAGE_LIMITS, IMAGE_LIMITS } from "@/services/property-import/download-images";
import { DEFAULT_WAN_MODEL, KNOWN_WAN_MODELS, wanModelSupported, WanApiError, WanConfigError } from "@/lib/wan/client";
import { isFatalWanError, WanUnavailableError } from "@/services/video/wan-generator";
import { buildStoryboard, distributeDurations, selectImages, type ImageAnalysis } from "@/services/video/ai-director";
import { buildScenePrompt, PROPERTY_FIDELITY_RULES } from "@/lib/wan/prompt";
import { VIDEO_STYLE_LIST, resolveVideoStyle } from "@/lib/video-styles";
import { framesForScenes, ffmpegAvailable, assembleVideo, TARGET_FRAMES } from "@/services/video/assembler";
import type { StoredImage } from "@/services/property-import";
import {
  aspectPaddingPercent, buildEmbedCode, embedUrl, generateShareToken, isShareToken,
  orderMediaList, parseStorageRef, publicBaseUrl, toStorageRef, videoFileRoute,
} from "@/lib/video-media";
import {
  checkOrderLimits, chooseRestartState, findDuplicateOrder, normaliseSourceUrl, orderLimits,
  type RecentOrder,
} from "@/lib/video-job-policy";
import { summariseVideoOps } from "@/lib/video-ops-stats";
import { detailsAreEmpty, detailsFromListing, emptyDetails, sanitizeDetails } from "@/lib/property-details";
import { isStale, STALE_AFTER_HOURS } from "@/services/video/driver";
import { renderLockedPreview } from "@/services/video/assembler";
import { execFileSync } from "child_process";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail = ""): void {
  if (condition) { passed++; console.log(`  ok   ${name}${detail ? ` — ${detail}` : ""}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`); }
}

function section(title: string): void {
  console.log(`\n${title}`);
}

async function rejects(url: string): Promise<boolean> {
  try { await assertPublicUrl(url); return false; }
  catch (e) { return e instanceof UnsafeUrlError; }
}

// ── 1. SSRF protection ────────────────────────────────────────────────────
section("SSRF protection");
for (const ip of ["127.0.0.1", "10.0.0.5", "192.168.1.1", "172.16.4.2", "169.254.169.254", "100.64.0.1", "::1", "fd00::1", "::ffff:169.254.169.254"]) {
  check(`private address rejected: ${ip}`, ipIsPrivate(ip));
}
for (const ip of ["8.8.8.8", "93.184.216.34", "2606:2800:220:1:248:1893:25c8:1946"]) {
  check(`public address allowed: ${ip}`, !ipIsPrivate(ip));
}
for (const url of ["file:///etc/passwd", "ftp://example.com/x", "http://localhost/admin", "http://127.0.0.1:3000", "http://user:pass@example.com/", "http://169.254.169.254/latest/meta-data/", "http://something.internal/"]) {
  check(`URL rejected: ${url}`, await rejects(url));
}

// ── 2. Property extraction ────────────────────────────────────────────────
section("Property extraction");
const html = readFileSync(join(ROOT, "scripts/fixtures/listing.html"), "utf8");
const property = extractProperty(html);
check("title found", !!property.title?.includes("Bahía Dorada"), property.title);
check("location found", property.location === "Estepona", property.location);
check("price found", !!property.price, `${property.price} ${property.currency ?? ""}`);
check("currency found", property.currency === "EUR", property.currency);
check("guests", property.features.guests === 6, String(property.features.guests));
check("bedrooms", property.features.bedrooms === 3, String(property.features.bedrooms));
check("bathrooms", property.features.bathrooms === 2, String(property.features.bathrooms));
check("square meters", property.features.squareMeters === 120, String(property.features.squareMeters));
check("private pool", property.features.privatePool === true);
check("pool implied by private pool", property.features.pool === true);
check("sea view", property.features.seaView === true);
check("beach distance", property.features.beachDistanceMeters === 400, String(property.features.beachDistanceMeters));
check("air conditioning", property.features.airConditioning === true);
check("wifi", property.features.wifi === true);
check("amenities collected", property.features.amenities.length >= 5, property.features.amenities.join(", "));

// ── 3. Image extraction and filtering ─────────────────────────────────────
section("Image extraction");
const candidates = extractImageCandidates(html, "https://www.feriebolig-spanien.dk/d/46175569");
const urls = candidates.map((c) => c.url);
check("found candidates", candidates.length >= 8, `${candidates.length} candidates`);
check("logo filtered", !urls.some((u) => u.includes("logo")));
check("favicon filtered", !urls.some((u) => u.includes("favicon")));
check("tracking pixel filtered", !urls.some((u) => u.includes("facebook.com/tr")));
check("other property filtered", !urls.some((u) => u.includes("/recommended/")));
check("og:image found", urls.some((u) => u.includes("hero-2400x1600")));
check("json-ld gallery found", urls.some((u) => u.includes("gallery-01")));
check("embedded next data found", urls.some((u) => u.includes("gallery-03")));
check("lazy data-src found", urls.some((u) => u.includes("gallery-06")));
check("picture source found", urls.some((u) => u.includes("gallery-07")));
check("css background found", urls.some((u) => u.includes("gallery-08")));
check("srcset picked the large rendition",
  urls.some((u) => u.includes("gallery-01-1920x1280")) && !urls.includes("https://cdn.example-portal.com/properties/46175569/gallery-01-640x480.jpg"));
check("resize variants deduplicated",
  normalizeForDedupe("https://cdn.x.com/a/img-640x480.jpg?w=640&q=80")
    === normalizeForDedupe("https://cdn.x.com/a/img-1920x1280.jpg?w=1920&q=95"));
check("thumbnail rendition deduplicated against the original",
  candidates.filter((c) => c.url.includes("gallery-02")).length === 1,
  `${candidates.filter((c) => c.url.includes("gallery-02")).length} gallery-02 entries`);
check("extraction methods recorded",
  new Set(candidates.map((c) => c.method)).size >= 4,
  [...new Set(candidates.map((c) => c.method))].join(", "));

// ── 3b. Thresholds for photographs the customer already chose ─────────────
section("Chosen-image thresholds");
check("lenient floor is below the discovery floor",
  CHOSEN_IMAGE_LIMITS.minWidth < IMAGE_LIMITS.minWidth &&
  CHOSEN_IMAGE_LIMITS.minHeight < IMAGE_LIMITS.minHeight,
  `${CHOSEN_IMAGE_LIMITS.minWidth}x${CHOSEN_IMAGE_LIMITS.minHeight} vs ${IMAGE_LIMITS.minWidth}x${IMAGE_LIMITS.minHeight}`);
check("a 400x300 listing photo is kept when the customer picked it",
  400 >= CHOSEN_IMAGE_LIMITS.minWidth && 300 >= CHOSEN_IMAGE_LIMITS.minHeight);
check("an icon is still rejected",
  !(64 >= CHOSEN_IMAGE_LIMITS.minWidth && 64 >= CHOSEN_IMAGE_LIMITS.minHeight));
check("size and byte caps are unchanged",
  CHOSEN_IMAGE_LIMITS.maxBytes === IMAGE_LIMITS.maxBytes &&
  CHOSEN_IMAGE_LIMITS.maxDownloads === IMAGE_LIMITS.maxDownloads);

// ── 3c. WAN model id ──────────────────────────────────────────────────────
section("WAN model");
check("default model is a real Model Studio image-to-video id",
  /^wan\d+\.\d+-i2v/.test(DEFAULT_WAN_MODEL), DEFAULT_WAN_MODEL);
check("the default is accepted by the model check", wanModelSupported(DEFAULT_WAN_MODEL));
check("every quoted id is one the client can speak",
  KNOWN_WAN_MODELS.every(wanModelSupported), KNOWN_WAN_MODELS.join(", "));
check("wan3.0-video is rejected — no such generation exists",
  !wanModelSupported("wan3.0-video"));
check("wan2.7 is rejected — it speaks a different request shape",
  !wanModelSupported("wan2.7-i2v-plus"));
check("a text-to-video id is rejected", !wanModelSupported("wan2.6-t2v-flash"));
check("surrounding whitespace does not fail a valid id",
  wanModelSupported(" wan2.6-i2v-flash "));

// ── 4. Image file validation ──────────────────────────────────────────────
section("Image validation");
check("rejects non-image bytes", readImageInfo(Buffer.from("x".repeat(500))) === null);
check("rejects truncated header", readImageInfo(Buffer.from([0xff, 0xd8, 0xff])) === null);
const testJpeg = join(ROOT, "public/wan-test-image.jpg");
if (existsSync(testJpeg)) {
  const info = readImageInfo(readFileSync(testJpeg));
  check("reads JPEG dimensions", info?.width === 768 && info?.height === 768, info ? `${info.width}x${info.height}` : "null");
  check("hashes the bytes", (info?.hash.length ?? 0) === 64);
}

// ── 5. Selection and storyboard ───────────────────────────────────────────
section("AI Director");
function image(id: string, position: number, width = 1920, height = 1280): StoredImage {
  return {
    id, orderId: "order", sourceUrl: `https://cdn.example.com/${id}.jpg`,
    storagePath: `u/properties/order/original/${id}.jpg`,
    storageUrl: `https://storage.example.com/${id}.jpg`,
    width, height, fileSize: 400_000, position,
    extractionMethod: "img-srcset", imageHash: id.padEnd(64, "0"),
  };
}
function analysis(id: string, category: ImageAnalysis["category"], hero: number, quality = 80, reject?: string): ImageAnalysis {
  return { imageId: id, category, description: `A ${category}`, heroScore: hero, qualityScore: quality, features: [], reject };
}

const images = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id, i) => image(id, i));
const analyses = [
  analysis("a", "exterior", 95), analysis("b", "living-room", 60), analysis("c", "kitchen", 55),
  analysis("d", "bedroom", 50), analysis("e", "bathroom", 40), analysis("f", "terrace", 75),
  analysis("g", "pool", 85), analysis("h", "sea-view", 80), analysis("i", "living-room", 58),
  analysis("j", "other", 20, 30, "floor plan, not a photograph"),
];

const selection = selectImages(images, analyses, "mediterranean");
const ids = selection.selected.map((s) => s.image.id);
check("selects 6-8 images", selection.selected.length >= 6 && selection.selected.length <= 8, `${selection.selected.length} selected`);
check("rejected image excluded", !ids.includes("j"));
check("strongest hero selected", ids.includes("a"));
check("no duplicate images", new Set(ids).size === ids.length);
check("covers distinct categories",
  new Set(selection.selected.map((s) => s.analysis.category)).size >= 5,
  selection.selected.map((s) => s.analysis.category).join(", "));

// A property with no pool and no sea view must not gain either.
const modest = ["a", "b", "c", "d", "e", "f"].map((id, i) => image(id, i));
const modestAnalyses = [
  analysis("a", "exterior", 80), analysis("b", "living-room", 60), analysis("c", "kitchen", 55),
  analysis("d", "bedroom", 50), analysis("e", "bathroom", 45), analysis("f", "garden", 65),
];
const modestSelection = selectImages(modest, modestAnalyses, "mediterranean");
check("no pool invented for a property without one",
  !modestSelection.selected.some((s) => s.analysis.category === "pool"));
check("no sea view invented for a property without one",
  !modestSelection.selected.some((s) => s.analysis.category === "sea-view"));

section("Storyboard");
for (let n = 4; n <= 8; n++) {
  const durations = distributeDurations(n);
  const total = Math.round(durations.reduce((a, b) => a + b, 0) * 1000) / 1000;
  check(`${n} scenes sum to 15.000s`, total === 15, `${total}s`);
  const frames = framesForScenes(durations);
  check(`${n} scenes map to ${TARGET_FRAMES} frames`, frames.reduce((a, b) => a + b, 0) === TARGET_FRAMES, `[${frames}]`);
  check(`${n} scenes each get visible time`, frames.every((f) => f >= 6));
}

const storyboard = buildStoryboard(selection.selected, "mediterranean", { title: "Bahía Dorada Villa" });
check("storyboard uses only real images",
  storyboard.scenes.every((s) => images.some((i) => i.id === s.imageId && i.storageUrl === s.imageUrl)));
check("storyboard scene count matches selection", storyboard.scenes.length === selection.selected.length);
check("storyboard totals 15.000s",
  Math.round(storyboard.scenes.reduce((a, s) => a + s.durationSeconds, 0) * 1000) / 1000 === 15);
check("closes on an outdoor or view shot",
  ["pool", "sea-view", "terrace", "garden", "exterior"].includes(
    selection.selected.find((s) => s.image.id === storyboard.scenes[storyboard.scenes.length - 1].imageId)?.analysis.category ?? ""),
);

// ── 6. Prompts ────────────────────────────────────────────────────────────
section("WAN prompts (property fidelity)");
for (const style of VIDEO_STYLE_LIST) {
  const prompt = buildScenePrompt({
    style, purpose: "terrace", camera: style.camera[0],
    imageDescription: "A terrace with a sea view", propertyTitle: "Bahía Dorada Villa",
    sceneIndex: 0, sceneCount: 6,
  });
  check(`${style.id}: carries every fidelity rule`, PROPERTY_FIDELITY_RULES.every((rule) => prompt.includes(rule)));
  check(`${style.id}: fidelity rules come before the style layer`,
    prompt.indexOf("exact visual source of truth") < prompt.indexOf(style.promptInstructions.slice(0, 40)));
  check(`${style.id}: names its own style`, prompt.includes(style.name));
  check(`${style.id}: no listing URL in the prompt`, !/https?:\/\//.test(prompt));
}
check("all five styles present", VIDEO_STYLE_LIST.length === 5, VIDEO_STYLE_LIST.map((s) => s.id).join(", "));
check("unknown style falls back to mediterranean", resolveVideoStyle("nonsense").id === "mediterranean");
check("styles differ in camera and mood",
  new Set(VIDEO_STYLE_LIST.map((s) => s.promptInstructions)).size === 5);

// ── 7. Assembly ───────────────────────────────────────────────────────────
section("Assembly");
if (!ffmpegAvailable()) {
  console.log("  skip  no ffmpeg binary available");
} else {
  const clipDir = process.env.SELFTEST_CLIP_DIR;
  if (!clipDir || !existsSync(join(clipDir, "c0.mp4"))) {
    console.log("  skip  set SELFTEST_CLIP_DIR to a directory of c0.mp4…c5.mp4 to render");
  } else {
    const durations = distributeDurations(6);
    const clips = [0, 1, 2, 3, 4, 5].map((i) => ({ source: join(clipDir, `c${i}.mp4`), durationSeconds: durations[i] }));
    for (const aspect of ["9:16", "1:1", "16:9"] as const) {
      const rendered = await assembleVideo(clips, { aspectRatio: aspect });
      check(`${aspect}: exactly ${TARGET_FRAMES} frames`, rendered.frameCount === TARGET_FRAMES, `${rendered.frameCount}`);
      check(`${aspect}: exactly 15.000 seconds`, Math.abs(rendered.durationSeconds - 15) < 0.001, `${rendered.durationSeconds.toFixed(3)}s`);
    }
  }
}

// ── 7b. WAN failures that no retry can fix ──────────────────────────────
section("WAN fatal errors");
check("401 invalid API key is fatal", isFatalWanError(new WanApiError("Invalid API-key provided", 401)));
check("403 refused account is fatal", isFatalWanError(new WanApiError("Access denied", 403)));
check("missing configuration is fatal", isFatalWanError(new WanConfigError(["ALIBABA_CLOUD_API_KEY"])));
check("429 rate limit is retried, not fatal", !isFatalWanError(new WanApiError("Throttling", 429)));
check("500 provider outage is retried, not fatal", !isFatalWanError(new WanApiError("Internal error", 500)));
check("network error is retried, not fatal", !isFatalWanError(new Error("fetch failed")));
const fatal = new WanUnavailableError("WAN 401");
check("customer message says it is not their photos", /ikke dine billeder/.test(fatal.message) && /WAN 401/.test(fatal.message));
check("customer message names no secret", !/key|nøgle|ALIBABA/i.test(fatal.message));

// ── 8. Private delivery ───────────────────────────────────────────────────
section("Private delivery");
const ref = toStorageRef("video-private", "properties/abc/video/final/x.mp4");
check("storage ref round-trips", JSON.stringify(parseStorageRef(ref)) === JSON.stringify({ bucket: "video-private", path: "properties/abc/video/final/x.mp4" }), ref);
check("plain URL is not a storage ref", parseStorageRef("https://x.supabase.co/storage/v1/object/public/videos/a.mp4") === null);
check("ref climbing out of its folder is refused", parseStorageRef("storage://video-private/properties/../../etc") === null);
check("ref without a path is refused", parseStorageRef("storage://video-private/") === null);
check("media list puts the film first and drops duplicates",
  JSON.stringify(orderMediaList({ final_video_url: "F", video_url: "F", video_urls: ["F", "c1", "c2", ""] })) === JSON.stringify(["F", "c1", "c2"]));
check("legacy order without final_video_url still lists its video",
  JSON.stringify(orderMediaList({ video_url: "https://old/v.mp4", video_urls: null })) === JSON.stringify(["https://old/v.mp4"]));
check("file route for the film", videoFileRoute("o1") === "/api/videos/o1/file");
check("file route for a clip download", videoFileRoute("o1", { clip: 2, download: true }) === "/api/videos/o1/file?clip=2&download=1");

// ── 9. Sharing & embed ────────────────────────────────────────────────────
section("Sharing & embed");
const tokenA = generateShareToken();
const tokenB = generateShareToken();
check("share token is URL-safe and long", isShareToken(tokenA) && tokenA.length >= 32, `${tokenA.length} chars`);
check("share tokens are unique", tokenA !== tokenB);
check("malformed token rejected", !isShareToken("../etc/passwd") && !isShareToken("short"));
check("base URL comes from NEXT_PUBLIC_APP_URL without trailing slash",
  publicBaseUrl({ NEXT_PUBLIC_APP_URL: "https://www.somevideopost.com/" }) === "https://www.somevideopost.com");
check("embed URL is the real route", embedUrl("tok", "https://www.somevideopost.com") === "https://www.somevideopost.com/embed/tok");
check("16:9 / 1:1 / 9:16 aspect padding",
  aspectPaddingPercent("16:9") === 56.25 && aspectPaddingPercent("1:1") === 100 && aspectPaddingPercent("9:16") > 177);
const code = buildEmbedCode({ token: tokenA, aspect: "9:16", title: `Villa "Sol" <script>`, baseUrl: "https://www.somevideopost.com" });
check("embed code points at the embed route", code.includes(`src="https://www.somevideopost.com/embed/${tokenA}"`));
check("embed code escapes the title", !code.includes("<script>") && code.includes("&quot;Sol&quot;"));
check("embed code keeps the portrait ratio", code.includes("padding-bottom:177.78%") && code.includes("max-width:360px"));
check("embed code allows fullscreen", code.includes("allowfullscreen"));

// ── 10. Job policy ────────────────────────────────────────────────────────
section("Job policy");
check("restart: all scenes done → only re-render",
  chooseRestartState({ sceneStatuses: ["succeeded", "succeeded"], storedImageCount: 6 }) === "assembling_video");
check("restart: some scenes failed → regenerate only those",
  chooseRestartState({ sceneStatuses: ["succeeded", "failed", "succeeded"], storedImageCount: 6 }) === "generating_clips");
check("restart: no scenes, photos stored → reuse photos",
  chooseRestartState({ sceneStatuses: [], storedImageCount: 4 }) === "analyzing_images");
check("restart: nothing yet → from the listing",
  chooseRestartState({ sceneStatuses: [], storedImageCount: 0 }) === "pending");

const limits = orderLimits({});
check("default limits: 3 active, 10 per day", limits.maxActive === 3 && limits.maxPerDay === 10);
check("limits read from env", orderLimits({ VIDEO_MAX_ACTIVE_JOBS_PER_USER: "5", VIDEO_MAX_ORDERS_PER_DAY: "x" }).maxActive === 5
  && orderLimits({ VIDEO_MAX_ORDERS_PER_DAY: "x" }).maxPerDay === 10);
const now = Date.parse("2026-10-23T12:00:00Z");
const ago = (s: number) => new Date(now - s * 1000).toISOString();
const recent: RecentOrder[] = [
  { id: "a", status: "processing", job_state: "generating_clips", source_url: "https://airbnb.com/rooms/1", title: "A", created_at: ago(30) },
  { id: "b", status: "processing", job_state: "awaiting_images", source_url: null, title: "B", created_at: ago(600) },
  { id: "c", status: "ready", job_state: "completed", source_url: null, title: "C", created_at: ago(3600) },
];
check("same listing within two minutes is a duplicate",
  findDuplicateOrder(recent, { source_url: "HTTPS://airbnb.com/rooms/1 ", title: "Other" }, limits, now)?.id === "a");
check("same listing after the window is a new order",
  findDuplicateOrder(recent, { source_url: "https://airbnb.com/rooms/1", title: null }, limits, now + 300_000) === null);
check("different listing is not a duplicate",
  findDuplicateOrder(recent, { source_url: "https://airbnb.com/rooms/2", title: "A" }, limits, now) === null);
check("a job waiting for photos does not count as active", checkOrderLimits(recent, limits, now).ok);
const busy = [...recent, ...[1, 2].map((i) => ({ id: `p${i}`, status: "processing", job_state: "pending", source_url: null, title: `P${i}`, created_at: ago(60) }))];
const busyVerdict = checkOrderLimits(busy, limits, now);
check("fourth active job is refused", !busyVerdict.ok && busyVerdict.reason === "busy");
const many = Array.from({ length: 10 }, (_, i) => ({ id: `d${i}`, status: "ready", job_state: "completed", source_url: null, title: `D${i}`, created_at: ago(3600 * (i + 1)) }));
const dailyVerdict = checkOrderLimits(many, limits, now);
check("eleventh order in 24h is refused", !dailyVerdict.ok && dailyVerdict.reason === "daily");
check("orders older than a day do not count", checkOrderLimits(many.map((o) => ({ ...o, created_at: ago(90_000) })), limits, now).ok);
check("listing URL normalised", normaliseSourceUrl(" https://www.airbnb.dk/rooms/123 ") === "https://www.airbnb.dk/rooms/123");
check("empty listing URL is fine", normaliseSourceUrl("") === null);
for (const bad of ["javascript:alert(1)", "ftp://x.com", "not a url", "https://user:pw@x.com/"]) {
  check(`listing URL rejected: ${bad}`, normaliseSourceUrl(bad) === "invalid");
}
check(`job older than ${STALE_AFTER_HOURS}h is stale`, isStale({ created_at: ago(STALE_AFTER_HOURS * 3600 + 60) }, now));
check("restarted job uses its new start time", !isStale({ created_at: ago(48 * 3600), started_at: ago(60) }, now));

// ── 11. Admin overview ────────────────────────────────────────────────────
section("Admin overview");
const stats = summariseVideoOps(
  [
    { status: "ready", job_state: "completed", paid: true, started_at: ago(900), completed_at: ago(300), error_message: null },
    { status: "ready", job_state: "completed", paid: false, started_at: ago(1500), completed_at: ago(300), error_message: null },
    { status: "failed", job_state: "failed", paid: false, started_at: ago(900), completed_at: null, error_message: "Ingen scener kunne genereres. Prøv igen" },
    { status: "failed", job_state: "failed", paid: false, started_at: null, completed_at: null, error_message: "Ingen scener kunne genereres. Prøv igen" },
    { status: "processing", job_state: "awaiting_images", paid: false, started_at: null, completed_at: null, error_message: null },
  ],
  [
    { status: "succeeded", attempts: 1, duration_seconds: "2.5" },
    { status: "succeeded", attempts: 2, duration_seconds: 2.5 },
    { status: "failed", attempts: 3, duration_seconds: 2 },
  ],
);
check("counts outcomes", stats.total === 5 && stats.completed === 2 && stats.failed === 2 && stats.paid === 1);
check("waiting for photos is not 'in progress'", stats.processing === 0 && stats.awaitingImages === 1);
check("success rate", stats.successRate === 50);
check("median processing time", stats.medianMinutes === 15, `${stats.medianMinutes}`);
check("every WAN attempt is counted", stats.wanSubmissions === 6);
check("delivered footage seconds", stats.wanSecondsDelivered === 5);
check("errors grouped", stats.topErrors.length === 1 && stats.topErrors[0].count === 2);

// ── 12. Property details panel ────────────────────────────────────────────
section("Property details");
const listing = detailsFromListing({
  title: "Villa Sol", location: "Jávea, Alicante", description: "Lys villa.",
  features: { guests: 6, bedrooms: 3, bathrooms: 2, squareMeters: 140, privatePool: true, pool: true,
    beachDistanceMeters: 800, amenities: ["Pool", "Terrasse", "Aircondition", "Terrasse"] },
});
check("listing facts carried over", listing.title === "Villa Sol" && listing.guests === 6 && listing.bedrooms === 3
  && listing.bathrooms === 2 && listing.livingAreaM2 === 140 && listing.beachDistanceM === 800);
check("private pool recognised, not duplicated as a feature", listing.pool === "private" && !listing.features.includes("Pool"));
check("features deduplicated", JSON.stringify(listing.features) === JSON.stringify(["Terrasse", "Aircondition"]));
check("seeded details are marked as from the listing", listing.source === "listing");
const bare = detailsFromListing({ features: { amenities: [] } });
check("listing without facts leaves fields empty, nothing guessed", detailsAreEmpty(bare) && bare.pool === null);
const cleaned = sanitizeDetails({
  title: "  Villa  ", guests: "6", bedrooms: -1, bathrooms: 999, livingAreaM2: "120,5",
  pool: "jacuzzi", features: ["Terrasse", "", 42, "Terrasse"], description: "x".repeat(5000), source: "hacker",
});
check("text trimmed", cleaned.title === "Villa");
check("numbers parsed, out-of-range dropped", cleaned.guests === 6 && cleaned.bedrooms === null && cleaned.bathrooms === null && cleaned.livingAreaM2 === 120.5);
check("unknown pool value dropped", cleaned.pool === null);
check("features cleaned", JSON.stringify(cleaned.features) === JSON.stringify(["Terrasse"]));
check("long text capped", (cleaned.description ?? "").length === 4000);
check("unknown source falls back to listing", cleaned.source === "listing");
check("garbage input gives empty details", detailsAreEmpty(sanitizeDetails("nonsense")) && detailsAreEmpty(sanitizeDetails(null)));
check("empty details are empty", detailsAreEmpty(emptyDetails()));

// ── 13. Locked preview render ─────────────────────────────────────────────
section("Locked preview");
if (!ffmpegAvailable()) {
  console.log("  skip  no ffmpeg binary available");
} else {
  const dir = mkdtempSync(join(tmpdir(), "svp-selftest-"));
  try {
    const { resolveFfmpegPath } = await import("@/services/video/assembler");
    const ffmpeg = resolveFfmpegPath();
    const source = join(dir, "film.mp4");
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "testsrc2=size=1080x1920:rate=30",
      "-t", "15", "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", source]);
    const preview = await renderLockedPreview(source);
    const out = join(dir, "preview.mp4");
    writeFileSync(out, preview);
    const report = (() => {
      try { return execFileSync(ffmpeg, ["-hide_banner", "-i", out], { stdio: ["ignore", "pipe", "pipe"] }).toString(); }
      catch (e) { return String((e as { stderr?: Buffer }).stderr ?? ""); }
    })();
    const size = report.match(/Video:.*?(\d{2,5})x(\d{2,5})/);
    const w = Number(size?.[1]); const h = Number(size?.[2]);
    check("preview is a valid MP4", preview.length > 1000 && !!size, `${(preview.length / 1024).toFixed(0)} KB`);
    check("preview is low resolution (320 px short side)", Math.min(w, h) === 320, `${w}x${h}`);
    check("preview keeps the portrait orientation", h > w);
    check("preview has no audio track", !/Audio:/.test(report));
    const sourceSize = readFileSync(source).length;
    check("preview is much smaller than the film", preview.length < sourceSize / 3, `${(sourceSize / 1024).toFixed(0)} KB → ${(preview.length / 1024).toFixed(0)} KB`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── 12. Photo-motion engine (no video API) ────────────────────────────────
section("Photo motion");
{
  const { planMotion, clipSeconds, renderPhotoClip } = await import("@/services/video/photo-motion");
  const { videoEngine } = await import("@/services/video/wan-generator");
  check("photo-motion is the default engine", videoEngine({}) === "photo-motion");
  check("VIDEO_ENGINE=wan selects WAN", videoEngine({ VIDEO_ENGINE: " WAN " }) === "wan");
  check("an unknown engine falls back to photo-motion", videoEngine({ VIDEO_ENGINE: "veo" }) === "photo-motion");

  const reel = { frameWidth: 1080, frameHeight: 1920 };
  check("landscape photo in a 9:16 reel pans across",
    planMotion({ imageWidth: 1600, imageHeight: 1067, ...reel, index: 0 }) === "pan-right");
  check("odd scenes pan the other way",
    planMotion({ imageWidth: 1600, imageHeight: 1067, ...reel, index: 1 }) === "pan-left");
  check("portrait photo in a 9:16 reel zooms full-frame",
    planMotion({ imageWidth: 1080, imageHeight: 1800, ...reel, camera: "slow push in", index: 1 }) === "cover-zoom-in");
  check("camera 'pull back' zooms out",
    planMotion({ imageWidth: 1080, imageHeight: 1800, ...reel, camera: "slow pull back", index: 0 }) === "cover-zoom-out");
  check("portrait photo in a 16:9 film is shown whole",
    planMotion({ imageWidth: 800, imageHeight: 1200, frameWidth: 1920, frameHeight: 1080, index: 0 }).startsWith("fit-"));
  check("unknown photo size is shown whole, never cropped blind",
    planMotion({ imageWidth: 0, imageHeight: 0, ...reel, index: 0 }).startsWith("fit-"));
  check("clip covers its scene plus the crossfade", clipSeconds(2.5) === 3.3, String(clipSeconds(2.5)));
  check("clips are at least 2 seconds", clipSeconds(0.5) === 2);

  if (!ffmpegAvailable()) {
    console.log("  skip  no ffmpeg binary available");
  } else {
    const { resolveFfmpegPath } = await import("@/services/video/assembler");
    const dir = mkdtempSync(join(tmpdir(), "svp-motion-test-"));
    try {
      const ffmpeg = resolveFfmpegPath();
      const shapes = [[1600, 1067], [1080, 1800], [800, 1200], [2000, 800], [1200, 1200], [1600, 1067]] as const;
      const durations = distributeDurations(shapes.length);
      for (const aspect of ["9:16", "1:1", "16:9"] as const) {
        const clips = [];
        for (const [i, [w, h]] of shapes.entries()) {
          const photo = join(dir, `p${i}.jpg`);
          execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-f", "lavfi", "-i", `testsrc2=size=${w}x${h}`, "-frames:v", "1", photo]);
          const clip = await renderPhotoClip({ source: photo, imageWidth: w, imageHeight: h, aspect, sceneSeconds: durations[i], camera: null, index: i });
          const path = join(dir, `${aspect.replace(":", "x")}-${i}.mp4`);
          writeFileSync(path, clip.buffer);
          clips.push({ source: path, durationSeconds: durations[i] });
        }
        const rendered = await assembleVideo(clips, { aspectRatio: aspect });
        check(`${aspect}: six photo clips assemble to exactly ${TARGET_FRAMES} frames`, rendered.frameCount === TARGET_FRAMES, `${rendered.frameCount}`);
        check(`${aspect}: exactly 15.000 seconds`, Math.abs(rendered.durationSeconds - 15) < 0.001, `${rendered.durationSeconds.toFixed(3)}s`);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
