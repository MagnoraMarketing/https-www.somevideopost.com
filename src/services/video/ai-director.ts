import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { resolveVideoStyle, type VideoStyle, type VideoStyleId } from "@/lib/video-styles";
import { buildScenePrompt } from "@/lib/wan/prompt";
import type { StoredImage } from "@/services/property-import";
import type { ExtractedProperty } from "@/services/property-import/extract-property";

/**
 * The AI Director.
 *
 * Extends the existing Gemini-based analysis the app already uses for
 * screenshot import, rather than introducing a second AI stack. Its three jobs
 * are: understand each *actual* photograph, choose the best 6-8 of them, and
 * lay them out as a storyboard for the selected style.
 *
 * The one rule it can never break: it may only ever refer to images that were
 * actually downloaded or uploaded. It never invents a source image, and when
 * the model is unavailable the deterministic fallback selects from the same
 * real set rather than fabricating anything.
 */

const LOG = "[ai-director]";

/** Scene vocabulary. Kept small so selection can reason about coverage. */
export const SCENE_CATEGORIES = [
  "exterior", "terrace", "garden", "pool", "sea-view", "living-room",
  "kitchen", "dining", "bedroom", "bathroom", "detail", "surroundings", "other",
] as const;

export type SceneCategory = (typeof SCENE_CATEGORIES)[number];

export type ImageAnalysis = {
  imageId: string;
  category: SceneCategory;
  /** One sentence describing what is actually in the frame. */
  description: string;
  /** 0-100: how well this would open the film. */
  heroScore: number;
  /** 0-100: sharpness, exposure, framing. */
  qualityScore: number;
  /** Concrete things visible in the photo — never aspirational. */
  features: string[];
  /** Set when the image should not be used at all. */
  reject?: string;
};

export type StoryboardScene = {
  sceneIndex: number;
  imageId: string;
  imageUrl: string;
  purpose: string;
  durationSeconds: number;
  camera: string;
  prompt: string;
};

export type Storyboard = {
  style: VideoStyleId;
  durationSeconds: number;
  scenes: StoryboardScene[];
  /** True when the deterministic path produced this, not the model. */
  fallbackUsed: boolean;
};

/** The product's fixed output length. */
export const TARGET_DURATION_SECONDS = 15;
const MIN_SCENES = 4;
const IDEAL_MIN_SCENES = 6;
const MAX_SCENES = 8;

// ── Image analysis ────────────────────────────────────────────────────────

function geminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.AI_DIRECTOR_MODEL || "gemini-2.0-flash";
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model });
}

async function fetchImageAsInlineData(url: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    // Gemini's inline limit is generous, but a 15 MB photo in a 20-image batch
    // is not worth the tokens.
    if (buffer.byteLength > 8 * 1024 * 1024) return null;
    return {
      mimeType: (res.headers.get("content-type") ?? "image/jpeg").split(";")[0],
      data: buffer.toString("base64"),
    };
  } catch {
    return null;
  }
}

function coerceCategory(value: unknown): SceneCategory {
  const normalized = String(value ?? "").toLowerCase().replace(/[\s_]+/g, "-");
  return (SCENE_CATEGORIES as readonly string[]).includes(normalized)
    ? (normalized as SceneCategory)
    : "other";
}

function clampScore(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
}

/**
 * Analyse the actual photographs.
 *
 * Images are sent as inline data with an index the model must echo back, so a
 * hallucinated or reordered response can be discarded per-image instead of
 * silently mismatching a description to the wrong photo.
 */
export async function analyzeImages(images: StoredImage[]): Promise<ImageAnalysis[]> {
  const model = geminiModel();
  if (!model || images.length === 0) {
    if (!model) console.warn(`${LOG} GEMINI_API_KEY not configured — using deterministic analysis`);
    return images.map(deterministicAnalysis);
  }

  const batch = images.slice(0, 20);
  const parts: ({ inlineData: { mimeType: string; data: string } } | string)[] = [];
  const included: StoredImage[] = [];

  for (const [index, image] of batch.entries()) {
    const inline = await fetchImageAsInlineData(image.storageUrl);
    if (!inline) continue;
    parts.push(`IMAGE ${index}:`);
    parts.push({ inlineData: inline });
    included.push(image);
  }

  if (!included.length) {
    console.warn(`${LOG} no images could be read for analysis — using deterministic analysis`);
    return images.map(deterministicAnalysis);
  }

  const prompt = `You are a real-estate video director reviewing the actual photographs of one holiday property.

For EACH numbered image above, report only what is genuinely visible. Never describe something that is not in the frame.

Return ONLY a JSON array, no markdown fence, one object per image, in the same order:
[{"index":0,"category":"exterior","description":"...","heroScore":0-100,"qualityScore":0-100,"features":["..."],"reject":null}]

category must be one of: ${SCENE_CATEGORIES.join(", ")}.
description: one factual sentence about what the photo shows (English).
heroScore: how well this image would OPEN a 15-second presentation film.
qualityScore: sharpness, exposure and framing.
features: concrete visible things ("private pool", "sea view", "double bed"). Only what you can actually see.
reject: a short reason if the image is not a usable property photo (a screenshot, a floor plan, a map, a logo, heavily blurred, a duplicate of an earlier image); otherwise null.`;

  try {
    const result = await model.generateContent([...parts, prompt]);
    const text = result.response.text();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("no JSON array in response");
    const parsed = JSON.parse(match[0]) as Record<string, unknown>[];

    const byIndex = new Map<number, Record<string, unknown>>();
    for (const entry of parsed) {
      const index = Number(entry.index);
      if (Number.isInteger(index) && index >= 0 && index < included.length) byIndex.set(index, entry);
    }

    const analyses: ImageAnalysis[] = included.map((image, index) => {
      const entry = byIndex.get(index);
      if (!entry) return deterministicAnalysis(image);
      const reject = typeof entry.reject === "string" && entry.reject.trim() ? entry.reject.trim().slice(0, 160) : undefined;
      return {
        imageId: image.id,
        category: coerceCategory(entry.category),
        description: String(entry.description ?? "").slice(0, 400) || "Property photograph",
        heroScore: clampScore(entry.heroScore, 40),
        qualityScore: clampScore(entry.qualityScore, 50),
        features: Array.isArray(entry.features)
          ? entry.features.filter((f): f is string => typeof f === "string").slice(0, 8)
          : [],
        reject,
      };
    });

    // Any image that could not be sent still needs a record, or it would
    // silently disappear from selection.
    const analysed = new Set(analyses.map((a) => a.imageId));
    for (const image of images) {
      if (!analysed.has(image.id)) analyses.push(deterministicAnalysis(image));
    }

    console.info(`${LOG} analysed ${analyses.length} property photos`);
    return analyses;
  } catch (e) {
    console.warn(`${LOG} image analysis failed (${e instanceof Error ? e.message : String(e)}) — using deterministic analysis`);
    return images.map(deterministicAnalysis);
  }
}

/**
 * Analysis without a model: everything derivable from the file itself.
 *
 * Deliberately conservative — it never guesses a room type, because guessing
 * "pool" for a property with no pool is exactly the failure mode the product
 * forbids.
 */
function deterministicAnalysis(image: StoredImage): ImageAnalysis {
  const pixels = image.width * image.height;
  const ratio = image.width / image.height;
  const megapixels = pixels / 1_000_000;

  // Resolution and a natural landscape framing are the only honest signals.
  const qualityScore = Math.round(Math.min(100, 30 + megapixels * 22));
  const framingBonus = ratio >= 1.2 && ratio <= 2.0 ? 18 : 0;
  const positionBonus = Math.max(0, 20 - image.position * 2);

  return {
    imageId: image.id,
    category: "other",
    description: `Property photograph (${image.width}x${image.height})`,
    heroScore: Math.min(100, Math.round(qualityScore * 0.5 + framingBonus + positionBonus)),
    qualityScore,
    features: [],
  };
}

// ── Image selection ───────────────────────────────────────────────────────

/** Categories a style leans on, mapped from its scenePreferences vocabulary. */
function styleCategoryOrder(style: VideoStyle): SceneCategory[] {
  const map: Record<string, SceneCategory> = {
    "living room": "living-room", "sea view": "sea-view", exterior: "exterior",
    terrace: "terrace", garden: "garden", pool: "pool", kitchen: "kitchen",
    bedroom: "bedroom", bathroom: "bathroom", nature: "surroundings",
  };
  return style.scenePreferences.map((p) => map[p] ?? "other").filter((c) => c !== "other");
}

export type SelectionResult = {
  selected: { image: StoredImage; analysis: ImageAnalysis }[];
  fallbackUsed: boolean;
};

/**
 * Choose the 6-8 strongest photographs.
 *
 * Cost control (§33): selection happens *before* any WAN call, so only the
 * chosen images are ever generated. Coverage is enforced by walking the style's
 * preferred categories once each before topping up on raw score, so a film
 * never becomes six variations of the same room.
 */
export function selectImages(
  images: StoredImage[],
  analyses: ImageAnalysis[],
  styleId: VideoStyleId,
): SelectionResult {
  const style = resolveVideoStyle(styleId);
  const byId = new Map(images.map((image) => [image.id, image]));
  const usable = analyses
    .filter((a) => !a.reject && byId.has(a.imageId))
    .map((analysis) => ({ image: byId.get(analysis.imageId)!, analysis }));

  const fallbackUsed = analyses.every((a) => a.category === "other");

  if (!usable.length) {
    // Every image was rejected by the model — trust the files over the model
    // rather than producing nothing.
    const rescued = images
      .map((image) => ({ image, analysis: deterministicAnalysis(image) }))
      .sort((a, b) => b.analysis.heroScore - a.analysis.heroScore)
      .slice(0, MAX_SCENES);
    return { selected: rescued, fallbackUsed: true };
  }

  const rank = (entry: { image: StoredImage; analysis: ImageAnalysis }) =>
    entry.analysis.qualityScore * 0.5 +
    entry.analysis.heroScore * 0.5 +
    Math.min(20, (entry.image.width * entry.image.height) / 250_000) -
    entry.image.position * 0.5;

  const pool = [...usable].sort((a, b) => rank(b) - rank(a));
  const chosen: typeof pool = [];
  const usedIds = new Set<string>();
  const usedCategories = new Set<SceneCategory>();

  const take = (entry: (typeof pool)[number]) => {
    chosen.push(entry);
    usedIds.add(entry.image.id);
    usedCategories.add(entry.analysis.category);
  };

  // 1. The strongest hero opens the film.
  const hero = [...pool].sort((a, b) => b.analysis.heroScore - a.analysis.heroScore)[0];
  if (hero) take(hero);

  // 2. One image per preferred category, in the style's order of emphasis.
  for (const category of styleCategoryOrder(style)) {
    if (chosen.length >= MAX_SCENES) break;
    if (usedCategories.has(category)) continue;
    const match = pool.find((e) => !usedIds.has(e.image.id) && e.analysis.category === category);
    if (match) take(match);
  }

  // 3. Any category not yet represented, so the film covers the property.
  for (const entry of pool) {
    if (chosen.length >= MAX_SCENES) break;
    if (usedIds.has(entry.image.id) || usedCategories.has(entry.analysis.category)) continue;
    take(entry);
  }

  // 4. Top up to the ideal length with the best remaining images.
  for (const entry of pool) {
    if (chosen.length >= IDEAL_MIN_SCENES) break;
    if (usedIds.has(entry.image.id)) continue;
    take(entry);
  }

  console.info(`${LOG} selected ${chosen.length} of ${images.length} images (style=${styleId})`);
  return { selected: chosen, fallbackUsed };
}

// ── Storyboard ────────────────────────────────────────────────────────────

/**
 * Split the fixed 15 seconds across the scenes.
 *
 * The opening and closing shots get the extra weight — that is what makes a
 * short property film read as composed rather than as a slideshow. The last
 * scene absorbs the rounding so the durations sum to exactly 15.000 s.
 */
export function distributeDurations(sceneCount: number, total = TARGET_DURATION_SECONDS): number[] {
  if (sceneCount <= 0) return [];
  if (sceneCount === 1) return [total];

  const weights = Array.from({ length: sceneCount }, (_, i) => {
    if (i === 0) return 1.18;               // hero
    if (i === sceneCount - 1) return 1.35;  // closing shot lingers
    return 1;
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const durations = weights.map((w) => Math.round(((w / weightSum) * total) * 1000) / 1000);
  const drift = Math.round((total - durations.reduce((a, b) => a + b, 0)) * 1000) / 1000;
  durations[durations.length - 1] = Math.round((durations[durations.length - 1] + drift) * 1000) / 1000;
  return durations;
}

function cameraForScene(style: VideoStyle, index: number): string {
  return style.camera[index % style.camera.length];
}

function purposeForScene(analysis: ImageAnalysis, index: number, count: number): string {
  if (index === 0) return `hero ${analysis.category.replace("-", " ")}`;
  if (index === count - 1) return `closing ${analysis.category.replace("-", " ")}`;
  return analysis.category.replace("-", " ");
}

/**
 * Build the storyboard from the selected images.
 *
 * Scene order is the selection order (hero first, then the style's emphasis),
 * with the strongest remaining outdoor or view shot moved to the end so the
 * film closes on the property's best argument.
 */
export function buildStoryboard(
  selection: SelectionResult["selected"],
  styleId: VideoStyleId,
  property: Pick<ExtractedProperty, "title"> = {},
): Storyboard {
  const style = resolveVideoStyle(styleId);
  const scenes = [...selection];

  // Close on an outdoor/view shot when one is available and is not the hero.
  const closingCategories: SceneCategory[] = ["pool", "sea-view", "terrace", "garden", "exterior"];
  const closingIndex = scenes.findIndex(
    (entry, i) => i > 0 && closingCategories.includes(entry.analysis.category),
  );
  if (closingIndex > 0 && closingIndex !== scenes.length - 1) {
    const [closing] = scenes.splice(closingIndex, 1);
    scenes.push(closing);
  }

  const durations = distributeDurations(scenes.length);

  const storyboardScenes: StoryboardScene[] = scenes.map((entry, index) => {
    const purpose = purposeForScene(entry.analysis, index, scenes.length);
    const camera = cameraForScene(style, index);
    return {
      sceneIndex: index,
      imageId: entry.image.id,
      imageUrl: entry.image.storageUrl,
      purpose,
      durationSeconds: durations[index],
      camera,
      prompt: buildScenePrompt({
        style,
        purpose,
        camera,
        imageDescription: entry.analysis.description,
        propertyTitle: property.title,
        sceneIndex: index,
        sceneCount: scenes.length,
      }),
    };
  });

  console.info(
    `${LOG} storyboard style=${styleId} scenes=${storyboardScenes.length} ` +
      `total=${storyboardScenes.reduce((a, s) => a + s.durationSeconds, 0).toFixed(3)}s`,
  );

  return {
    style: styleId,
    durationSeconds: TARGET_DURATION_SECONDS,
    scenes: storyboardScenes,
    fallbackUsed: false,
  };
}

export const STORYBOARD_LIMITS = { MIN_SCENES, IDEAL_MIN_SCENES, MAX_SCENES };
