import type { VideoStyle } from "@/lib/video-styles";

/**
 * WAN scene prompts.
 *
 * Every prompt is built from the same three layers, in this order:
 *
 *   1. the universal property-fidelity contract (§30) — non-negotiable,
 *   2. what this particular scene is,
 *   3. the selected style.
 *
 * The order matters: the fidelity rules come first so the style layer reads as
 * a refinement of the photograph, never as licence to replace it.
 */

/** The contract WAN must honour for every scene of every style. */
export const PROPERTY_FIDELITY_RULES = [
  "Use the provided property image as the exact visual source of truth.",
  "Preserve the property exactly as shown.",
  "Do not redesign the architecture.",
  "Do not change the furniture.",
  "Do not add objects.",
  "Do not remove objects.",
  "Do not change the room layout.",
  "Do not create a different property.",
  "Do not invent rooms.",
  "Do not invent windows.",
  "Do not invent pools.",
  "Do not invent sea views.",
  "Do not add people unless they already exist in the source image.",
  "Only introduce subtle cinematic camera movement.",
  "Image fidelity is more important than cinematic transformation.",
] as const;

/**
 * Negative prompt shared by every scene. Says the same thing as the rules
 * above in the vocabulary a video model's negative conditioning responds to.
 */
export const WAN_NEGATIVE_PROMPT = [
  "different building", "different room", "redesigned interior", "new furniture",
  "added furniture", "removed furniture", "changed layout", "added rooms",
  "added windows", "added doors", "added pool", "added sea", "added palm trees",
  "added people", "added text", "watermark", "logo", "subtitles", "captions",
  "warped architecture", "distorted walls", "melting geometry", "morphing objects",
  "fast camera movement", "camera shake", "zoom blur", "heavy colour grading",
  "cartoon", "illustration", "low quality", "blurry",
].join(", ");

export type ScenePromptInput = {
  style: VideoStyle;
  /** What this shot is of, e.g. "hero exterior" or "terrace with sea view". */
  purpose: string;
  /** Camera instruction chosen by the AI Director from the style's vocabulary. */
  camera: string;
  /** What the image actually shows, from the image analysis step. */
  imageDescription?: string;
  propertyTitle?: string;
  /** Where the shot sits in the film — used only to phrase the shot, never to add content. */
  sceneIndex: number;
  sceneCount: number;
};

/**
 * Build the prompt for a single WAN scene.
 *
 * Note what is deliberately absent: no property URL, no listing description
 * used as generation material. The photograph is the subject; the text only
 * describes how the camera should move across it.
 */
export function buildScenePrompt(input: ScenePromptInput): string {
  const { style, purpose, camera, imageDescription, propertyTitle, sceneIndex, sceneCount } = input;

  const sceneLine = [
    `This is shot ${sceneIndex + 1} of ${sceneCount} in a short presentation film`,
    propertyTitle ? ` of "${propertyTitle.slice(0, 120)}"` : "",
    `. The photograph shows: ${imageDescription?.slice(0, 300) || purpose}.`,
  ].join("");

  const cameraLine = `Camera: ${camera}. Keep the movement small and continuous; the frame must stay recognisably the same place throughout.`;

  const styleLine = `Style — ${style.name} (${style.description}): ${style.promptInstructions}`;

  const avoidLine = `Do not: ${style.avoid.join("; ")}.`;

  return [
    PROPERTY_FIDELITY_RULES.join(" "),
    sceneLine,
    cameraLine,
    styleLine,
    avoidLine,
    "No on-screen text, captions, watermarks or logos. No people appearing or disappearing.",
  ].join("\n\n");
}

/**
 * Prompt for the WAN connectivity self-test — a deliberately tiny, cheap
 * generation whose only job is to prove the credentials and endpoint work.
 */
export const WAN_CONNECTIVITY_PROMPT =
  "Use the provided image as the exact visual source of truth. Preserve it exactly as shown. " +
  "Apply an extremely slow, subtle push-in. Do not add or remove anything.";
