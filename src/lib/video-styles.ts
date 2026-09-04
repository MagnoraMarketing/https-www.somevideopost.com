/**
 * Central video-style configuration.
 *
 * Every style-dependent decision in the pipeline — the AI Director's scene
 * planning, the WAN scene prompt, and the label shown while a video renders —
 * reads from this one table. Adding a style is adding an entry here; no
 * generator, prompt builder or UI needs to change.
 */

export const VIDEO_STYLE_IDS = [
  "nordic",
  "mediterranean",
  "luxury",
  "nature-relax",
  "cinematic",
] as const;

export type VideoStyleId = (typeof VIDEO_STYLE_IDS)[number];

/** Used when the customer never picked one (see §24 of the product spec). */
export const DEFAULT_VIDEO_STYLE: VideoStyleId = "mediterranean";

export type VideoStyle = {
  id: VideoStyleId;
  name: string;
  /** Short tagline shown on the style card and during generation. */
  description: string;
  mood: string[];
  camera: string[];
  lighting: string[];
  pacing: string[];
  /** Scene transition character, applied by the assembler. */
  transition: "soft-dissolve" | "gentle-fade" | "clean-cut";
  /**
   * Scene categories this style leans on when several images are equally
   * strong. Never a reason to invent a scene the property does not have.
   */
  scenePreferences: string[];
  /** Style layer appended after the universal property-fidelity rules. */
  promptInstructions: string;
  /** Style-specific things WAN must not do, folded into the prompt. */
  avoid: string[];
  /** Card accent, kept in the existing SOME Video Post palette. */
  accent: { from: string; to: string };
};

export const VIDEO_STYLES: Record<VideoStyleId, VideoStyle> = {
  nordic: {
    id: "nordic",
    name: "Nordic",
    description: "Clean · Bright · Minimal",
    mood: ["clean", "bright", "peaceful", "minimal", "sophisticated", "natural"],
    camera: [
      "extremely slow push-ins",
      "subtle horizontal pans",
      "gentle parallax",
      "smooth movement",
    ],
    lighting: ["natural daylight", "soft highlights", "clean exposure"],
    pacing: ["calm", "elegant", "slow"],
    transition: "gentle-fade",
    scenePreferences: ["living room", "bedroom", "kitchen", "exterior", "terrace"],
    promptInstructions:
      "Scandinavian presentation film: clean, bright and minimal. Keep the existing natural daylight and the clean, " +
      "uncluttered feeling of the room. Apply an extremely slow push-in or a subtle horizontal pan with gentle parallax. " +
      "Calm, elegant, slow pacing. Soft highlights and a clean, neutral exposure.",
    avoid: [
      "fast cuts",
      "excessive effects",
      "dramatic camera movement",
      "artificial transformations",
      "heavy colour grading",
    ],
    accent: { from: "#93B8D8", to: "#5B7FA6" },
  },

  mediterranean: {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Warm · Sunny · Relaxed",
    mood: ["warm", "sunny", "relaxing", "premium holiday", "coastal", "inviting"],
    camera: [
      "slow cinematic push",
      "gentle pan",
      "subtle parallax",
      "smooth movement",
    ],
    lighting: ["warm natural sunlight", "Mediterranean atmosphere", "subtle warmth"],
    pacing: ["relaxed", "elegant", "slow"],
    transition: "soft-dissolve",
    scenePreferences: ["terrace", "pool", "exterior", "sea view", "living room"],
    promptInstructions:
      "Warm Mediterranean holiday film. Create a relaxed, sunny holiday atmosphere using only the light and colours " +
      "already present in the photograph. Apply a slow cinematic push-in or a gentle pan with subtle parallax. " +
      "Relaxed, elegant, slow pacing.",
    avoid: [
      "adding palm trees",
      "adding sea or water that is not visible",
      "adding pools",
      "adding furniture or decorations",
      "adding buildings",
      "oversaturated orange grading",
    ],
    accent: { from: "#FFB36B", to: "#FF6B4A" },
  },

  luxury: {
    id: "luxury",
    name: "Luxury",
    description: "Elegant · Premium · Exclusive",
    mood: ["sophisticated", "luxurious", "exclusive", "premium real estate", "elegant"],
    camera: [
      "slow controlled push-ins",
      "smooth cinematic pans",
      "subtle depth",
      "subtle parallax",
    ],
    lighting: ["sophisticated", "elegant", "realistic"],
    pacing: ["controlled", "deliberate", "slow"],
    transition: "soft-dissolve",
    scenePreferences: ["exterior", "living room", "kitchen", "bathroom", "pool"],
    promptInstructions:
      "Premium real-estate presentation film. Elegant, exclusive and sophisticated, in the manner of a high-end estate " +
      "agency showreel. Apply a slow, controlled push-in or a smooth cinematic pan with subtle depth and parallax. " +
      "Lighting stays realistic — refine the atmosphere, never restyle the room.",
    avoid: [
      "cheesy luxury effects",
      "excessive lens flares",
      "fake objects",
      "excessive movement",
      "gold or chrome overlays",
    ],
    accent: { from: "#C9A96A", to: "#8A6D3B" },
  },

  "nature-relax": {
    id: "nature-relax",
    name: "Nature & Relax",
    description: "Calm · Natural · Peaceful",
    mood: ["peaceful", "relaxing", "natural", "vacation escape", "slow living"],
    camera: ["very slow movement", "gentle push", "subtle pan", "soft parallax"],
    lighting: ["soft natural light", "unforced ambience", "realistic"],
    pacing: ["very slow", "unhurried", "meditative"],
    transition: "gentle-fade",
    scenePreferences: ["garden", "terrace", "nature", "pool", "sea view", "exterior"],
    promptInstructions:
      "Calm, natural escape film. Peaceful and unhurried, favouring the outdoor spaces the property actually has. " +
      "Apply a very slow gentle push or a subtle pan with soft parallax. No fast edits, no artificial changes to the " +
      "environment, weather or vegetation.",
    avoid: [
      "fast edits",
      "artificial environment changes",
      "added vegetation",
      "weather changes",
      "added wildlife",
    ],
    accent: { from: "#8FCB9B", to: "#3F7D58" },
  },

  cinematic: {
    id: "cinematic",
    name: "Cinematic",
    description: "Film-like · Atmospheric · Premium",
    mood: ["cinematic", "atmospheric", "sophisticated", "emotional", "premium"],
    camera: [
      "cinematic push-ins",
      "smooth pans",
      "subtle parallax",
      "controlled movement",
    ],
    lighting: [
      "cinematic but realistic",
      "preserve original lighting",
      "enhance atmosphere without changing the property",
    ],
    pacing: ["measured", "film-like", "slow"],
    transition: "soft-dissolve",
    scenePreferences: ["exterior", "sea view", "living room", "terrace", "bedroom"],
    promptInstructions:
      "Film-like, atmospheric presentation. Apply a cinematic push-in or a smooth pan with subtle parallax and " +
      "controlled movement. Preserve the original lighting and enhance the atmosphere only. Cinematic here describes " +
      "the camera and the mood — never a different property.",
    avoid: [
      "generating a new property",
      "relighting the scene",
      "film grain that hides detail",
      "extreme colour grading",
      "handheld shake",
    ],
    accent: { from: "#8B7FD8", to: "#4A3F8A" },
  },
};

export const VIDEO_STYLE_LIST: VideoStyle[] = VIDEO_STYLE_IDS.map((id) => VIDEO_STYLES[id]);

export function isVideoStyleId(value: unknown): value is VideoStyleId {
  return typeof value === "string" && (VIDEO_STYLE_IDS as readonly string[]).includes(value);
}

/** Never throws — an unknown or missing value falls back to the default style. */
export function resolveVideoStyle(value: unknown): VideoStyle {
  return VIDEO_STYLES[isVideoStyleId(value) ? value : DEFAULT_VIDEO_STYLE];
}
