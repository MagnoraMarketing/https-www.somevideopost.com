import "server-only";
import { mkdtemp, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import {
  ASPECT_DIMENSIONS, OUTPUT_FPS, fetchToFile, resolveFfmpegPath, run, type AspectRatio,
} from "./assembler";

/**
 * Scene clips made from the property's own photographs — no video AI.
 *
 * Each scene is one actual photo brought to life with a slow, smooth camera
 * move rendered by ffmpeg: a push-in, a pull-back or a pan across. Nothing is
 * invented: every pixel on screen is from the photo itself (or, around a photo
 * that cannot fill the frame, a soft blur of it). No API key, no per-video
 * cost, and it works whether or not an external video service is up.
 *
 * The clips feed the same assembler as before, which joins them with
 * crossfades into the exactly-15-second film.
 */

const LOG = "[photo-motion]";

export type MotionMode =
  | "cover-zoom-in" | "cover-zoom-out"
  | "pan-right" | "pan-left"
  | "fit-zoom-in" | "fit-zoom-out";

/** How much the frame zooms over a scene. Subtle reads as cinematic; more reads as a slideshow. */
export const ZOOM_AMOUNT = 0.12;

/**
 * A photo whose shape is this close to the frame's fills it with almost
 * nothing cropped, so it zooms full-frame.
 */
const COVER_TOLERANCE = 0.18;

/**
 * Choose the camera move for one scene.
 *
 * - Photo about the frame's shape → full-frame zoom.
 * - Photo much wider than the frame (a landscape room photo in a 9:16 reel)
 *   → full-height pan across it, so the room fills the screen and the camera
 *   travels along it.
 * - Photo much taller than the frame → the whole photo over a blurred copy of
 *   itself, with a zoom; cropping a portrait shot to a wide frame would cut
 *   most of it away.
 *
 * The storyboard's camera hint picks between moves of the same kind, and the
 * scene index alternates directions so consecutive shots do not all move the
 * same way.
 */
export function planMotion(input: {
  imageWidth: number;
  imageHeight: number;
  frameWidth: number;
  frameHeight: number;
  camera?: string | null;
  index: number;
}): MotionMode {
  const imageRatio = input.imageWidth / input.imageHeight;
  const frameRatio = input.frameWidth / input.frameHeight;
  const camera = (input.camera ?? "").toLowerCase();
  const even = input.index % 2 === 0;
  const zoomIn = /push|in\b|closer/.test(camera) ? true : /pull|out\b|reveal/.test(camera) ? false : even;

  if (!Number.isFinite(imageRatio) || imageRatio <= 0) return zoomIn ? "fit-zoom-in" : "fit-zoom-out";

  const relative = imageRatio / frameRatio;
  if (Math.abs(relative - 1) <= COVER_TOLERANCE) return zoomIn ? "cover-zoom-in" : "cover-zoom-out";
  if (relative > 1) return even ? "pan-right" : "pan-left";
  return zoomIn ? "fit-zoom-in" : "fit-zoom-out";
}

/**
 * The ffmpeg filter graph for one move. Everything is rendered at twice the
 * output size and scaled down at the end — zoompan and crop move in whole
 * pixels, and supersampling is what keeps a slow move from visibly stepping.
 */
export function motionFilter(mode: MotionMode, frame: { width: number; height: number }, frames: number): string {
  const W = frame.width * 2;
  const H = frame.height * 2;
  const last = Math.max(1, frames - 1);
  const out = `${frame.width}x${frame.height}`;
  const ease = `(0.5-0.5*cos(PI*on/${last}))`; // smooth start and stop

  const zoomExpr = (zoomIn: boolean) =>
    zoomIn ? `1+${ZOOM_AMOUNT}*${ease}` : `${1 + ZOOM_AMOUNT}-${ZOOM_AMOUNT}*${ease}`;
  const zoompan = (zoomIn: boolean) =>
    `zoompan=z='${zoomExpr(zoomIn)}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${out}:fps=${OUTPUT_FPS}`;

  switch (mode) {
    case "cover-zoom-in":
    case "cover-zoom-out":
      return `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,` +
        `${zoompan(mode === "cover-zoom-in")},format=yuv420p[v]`;

    case "pan-right":
    case "pan-left": {
      // Scale to the frame's height; the photo is then wider than the frame.
      // Travel at most half a frame width, centred, so the move stays calm
      // whatever the photo's proportions.
      const progress = mode === "pan-right" ? ease.replace(/on/g, "n") : `(1-${ease.replace(/on/g, "n")})`;
      return `[0:v]scale=-2:${H},setsar=1,` +
        `crop=${W}:${H}:x='(iw-${W})/2-min((iw-${W})/2,${W}/4)+min(iw-${W},${W}/2)*${progress}':y=0,` +
        `scale=${out}:flags=lanczos,format=yuv420p[v]`;
    }

    case "fit-zoom-in":
    case "fit-zoom-out":
      return `[0:v]split=2[bgsrc][fgsrc];` +
        `[bgsrc]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=40:2,eq=brightness=-0.08[bg];` +
        `[fgsrc]scale=${W}:${H}:force_original_aspect_ratio=decrease[fg];` +
        `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,${zoompan(mode === "fit-zoom-in")},format=yuv420p[v]`;
  }
}

/** Clip length for a scene: its share of the film plus room for the crossfade. */
export function clipSeconds(sceneSeconds: number): number {
  return Math.max(2, Math.ceil((sceneSeconds + 0.8) * 10) / 10);
}

/**
 * Render one scene clip from one photograph.
 *
 * `source` is a URL (signed or public) or a local path. Returns the MP4.
 */
export async function renderPhotoClip(opts: {
  source: string;
  imageWidth: number;
  imageHeight: number;
  aspect: AspectRatio;
  sceneSeconds: number;
  camera?: string | null;
  index: number;
}): Promise<{ buffer: Buffer; mode: MotionMode; frames: number }> {
  const ffmpeg = resolveFfmpegPath();
  const frame = ASPECT_DIMENSIONS[opts.aspect];
  const frames = Math.round(clipSeconds(opts.sceneSeconds) * OUTPUT_FPS);
  const mode = planMotion({
    imageWidth: opts.imageWidth,
    imageHeight: opts.imageHeight,
    frameWidth: frame.width,
    frameHeight: frame.height,
    camera: opts.camera,
    index: opts.index,
  });

  const dir = await mkdtemp(join(tmpdir(), "svp-motion-"));
  try {
    const input = join(dir, "photo");
    const output = join(dir, "clip.mp4");
    await fetchToFile(opts.source, input);
    await run(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error",
      // The photo repeated as a 30 fps stream; zoompan and crop animate it.
      "-loop", "1", "-framerate", String(OUTPUT_FPS), "-i", input,
      "-filter_complex", motionFilter(mode, frame, frames),
      "-map", "[v]",
      "-frames:v", String(frames),
      "-r", String(OUTPUT_FPS),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
      "-an", "-movflags", "+faststart",
      output,
    ], 45_000);
    const buffer = await readFile(output);
    console.info(`${LOG} scene ${opts.index} ${mode} ${frames} frames (${(buffer.byteLength / 1024).toFixed(0)} KB)`);
    return { buffer, mode, frames };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * A small JPEG of a photo for image analysis: at most `maxSide` pixels on
 * the long side. Keeps a 20-photo analysis request small and fast whatever
 * size the originals are. Null when the photo cannot be read.
 */
export async function downscaleForAnalysis(source: string, maxSide = 1024): Promise<Buffer | null> {
  const dir = await mkdtemp(join(tmpdir(), "svp-thumb-"));
  try {
    const input = join(dir, "photo");
    const output = join(dir, "thumb.jpg");
    await fetchToFile(source, input);
    await run(resolveFfmpegPath(), [
      "-y", "-hide_banner", "-loglevel", "error", "-i", input,
      "-vf", `scale='if(gt(iw,ih),min(${maxSide},iw),-2)':'if(gt(iw,ih),-2,min(${maxSide},ih))'`,
      "-frames:v", "1", "-q:v", "4", output,
    ], 20_000);
    return await readFile(output);
  } catch {
    return null;
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
