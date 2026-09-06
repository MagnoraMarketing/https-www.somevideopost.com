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
import { DEFAULT_WAN_MODEL } from "@/lib/wan/client";
import { buildStoryboard, distributeDurations, selectImages, type ImageAnalysis } from "@/services/video/ai-director";
import { buildScenePrompt, PROPERTY_FIDELITY_RULES } from "@/lib/wan/prompt";
import { VIDEO_STYLE_LIST, resolveVideoStyle } from "@/lib/video-styles";
import { framesForScenes, ffmpegAvailable, assembleVideo, TARGET_FRAMES } from "@/services/video/assembler";
import type { StoredImage } from "@/services/property-import";

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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
