import "server-only";
import { spawn } from "child_process";
import { mkdtemp, writeFile, readFile, rm } from "fs/promises";
import { existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createRequire } from "module";

/**
 * Final assembly: WAN clips → one MP4 of exactly 15.000 seconds.
 *
 * Duration is guaranteed by frame count rather than by a `-t` cut: at a fixed
 * output frame rate, N frames *is* N/fps seconds, so the result cannot land on
 * 14.97 or 15.03 the way a time-based trim can. The scene durations are
 * likewise converted to whole frames before anything is rendered, so they sum
 * to the target frame count with no rounding drift to absorb at the end.
 */

const LOG = "[assembler]";

export const OUTPUT_FPS = 30;
export const TARGET_DURATION_SECONDS = 15;
export const TARGET_FRAMES = OUTPUT_FPS * TARGET_DURATION_SECONDS; // 450

export type AspectRatio = "9:16" | "1:1" | "16:9";

/**
 * Output frame sizes. The pipeline is aspect-ratio agnostic — adding a format
 * is adding an entry here; nothing in generation or assembly branches on it.
 */
export const ASPECT_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
};

/** Crossfade length per style transition, in seconds. */
export const TRANSITION_SECONDS = {
  "soft-dissolve": 0.4,
  "gentle-fade": 0.3,
  "clean-cut": 0,
} as const;

export type TransitionKind = keyof typeof TRANSITION_SECONDS;

export type AssemblyClip = {
  /** Local path or public URL of the generated scene clip. */
  source: string;
  /** How long this scene should occupy in the final film. */
  durationSeconds: number;
};

export class AssemblyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssemblyError";
  }
}

/**
 * Locate an ffmpeg binary.
 *
 * `FFMPEG_PATH` wins so a deployment can point at a layer-provided binary;
 * otherwise the bundled `ffmpeg-static` build is used, with a system ffmpeg as
 * the last resort.
 */
export function resolveFfmpegPath(): string {
  // The binary is resolved at runtime and is never bundled, so these lookups
  // are kept out of the trace — otherwise Turbopack reads them as dynamic
  // filesystem access and traces the whole project into every route that
  // reaches this module.
  const configured = process.env.FFMPEG_PATH;
  if (configured && existsSync(/* turbopackIgnore: true */ configured)) return configured;

  try {
    const require = createRequire(import.meta.url);
    const staticPath = require(/* turbopackIgnore: true */ "ffmpeg-static") as string | null;
    if (staticPath && existsSync(/* turbopackIgnore: true */ staticPath)) return staticPath;
  } catch { /* not installed in this environment */ }

  for (const candidate of ["/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/opt/homebrew/bin/ffmpeg"]) {
    if (existsSync(/* turbopackIgnore: true */ candidate)) return candidate;
  }
  throw new AssemblyError(
    "Ingen ffmpeg-binær kunne findes. Sæt FFMPEG_PATH eller installér ffmpeg-static.",
  );
}

export function ffmpegAvailable(): boolean {
  try { resolveFfmpegPath(); return true; } catch { return false; }
}

function run(bin: string, args: string[], timeoutMs = 240_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new AssemblyError(`ffmpeg timed out efter ${timeoutMs} ms`));
    }, timeoutMs);

    child.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    // ffmpeg writes everything informational to stderr; keep only the tail so a
    // failure message stays useful without dumping the whole render log.
    child.stderr.on("data", (d: Buffer) => { stderr = (stderr + d.toString()).slice(-4000); });
    child.on("error", (err) => { clearTimeout(timer); reject(new AssemblyError(`ffmpeg kunne ikke startes: ${err.message}`)); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout || stderr);
      else reject(new AssemblyError(`ffmpeg afsluttede med kode ${code}: ${stderr.slice(-800)}`));
    });
  });
}

/**
 * Convert scene durations to whole output frames summing to exactly
 * TARGET_FRAMES. Largest-remainder distribution, so no scene is starved and
 * the total is exact by construction rather than by a final correction.
 */
export function framesForScenes(durations: number[], totalFrames = TARGET_FRAMES): number[] {
  if (!durations.length) return [];
  const sum = durations.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    const even = Math.floor(totalFrames / durations.length);
    const frames = durations.map(() => even);
    frames[frames.length - 1] += totalFrames - even * durations.length;
    return frames;
  }

  const exact = durations.map((d) => (d / sum) * totalFrames);
  // Every scene needs at least a few frames to be visible at all.
  const frames = exact.map((f) => Math.max(6, Math.floor(f)));
  let remainder = totalFrames - frames.reduce((a, b) => a + b, 0);

  const order = exact
    .map((f, i) => ({ i, frac: f - Math.floor(f) }))
    .sort((a, b) => b.frac - a.frac);

  // Hand out the leftover frames to the largest fractional parts first; if the
  // minimum-frame floor overshot, take them back from the longest scenes.
  let cursor = 0;
  while (remainder > 0) { frames[order[cursor % order.length].i]++; remainder--; cursor++; }
  while (remainder < 0) {
    const longest = frames.indexOf(Math.max(...frames));
    if (frames[longest] <= 6) break;
    frames[longest]--;
    remainder++;
  }
  return frames;
}

async function fetchToFile(source: string, path: string): Promise<void> {
  if (!/^https?:\/\//i.test(source)) {
    // Already a local file — used by the self-test and by any caller that
    // downloaded the clip itself.
    await writeFile(path, await readFile(source));
    return;
  }
  const res = await fetch(source, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new AssemblyError(`Kunne ikke hente klip (HTTP ${res.status}): ${source.slice(0, 120)}`);
  await writeFile(path, Buffer.from(await res.arrayBuffer()));
}

/** Read a media file's duration in seconds. Used to verify the final render. */
export async function probeDurationSeconds(path: string, ffmpegPath = resolveFfmpegPath()): Promise<number> {
  // ffprobe is not shipped by ffmpeg-static, so the duration is read back from
  // ffmpeg's own report of the file it just wrote.
  const output = await run(ffmpegPath, ["-hide_banner", "-i", path, "-f", "null", "-"], 60_000)
    .catch((e: unknown) => (e instanceof Error ? e.message : String(e)));
  const m = output.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!m) return NaN;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** Count the video frames in a rendered file — the exactness check. */
export async function probeFrameCount(path: string, ffmpegPath = resolveFfmpegPath()): Promise<number> {
  const output = await run(ffmpegPath, ["-hide_banner", "-i", path, "-map", "0:v:0", "-f", "null", "-"], 120_000)
    .catch((e: unknown) => (e instanceof Error ? e.message : String(e)));
  // ffmpeg prints a running "frame= N" line; the last one is the total.
  const matches = [...output.matchAll(/frame=\s*(\d+)/g)];
  return matches.length ? Number(matches[matches.length - 1][1]) : NaN;
}

export type AssemblyResult = {
  buffer: Buffer;
  frameCount: number;
  durationSeconds: number;
  sceneFrames: number[];
};

/**
 * Render the final film.
 *
 * Each clip is normalised to the output frame, held on its last frame if WAN
 * returned a shorter clip than the scene needs, and cut to a whole number of
 * frames. Scenes are then chained with a crossfade whose overlap is added back
 * to the segment lengths, so the transition costs no screen time.
 */
export async function assembleVideo(
  clips: AssemblyClip[],
  options: { aspectRatio?: AspectRatio; transition?: TransitionKind; totalFrames?: number } = {},
): Promise<AssemblyResult> {
  if (!clips.length) throw new AssemblyError("Ingen klip at samle");

  const ffmpeg = resolveFfmpegPath();
  const { width, height } = ASPECT_DIMENSIONS[options.aspectRatio ?? "9:16"];
  const totalFrames = options.totalFrames ?? TARGET_FRAMES;
  const transition = options.transition ?? "soft-dissolve";
  const overlap = clips.length > 1 ? TRANSITION_SECONDS[transition] : 0;
  const overlapFrames = Math.round(overlap * OUTPUT_FPS);

  const sceneFrames = framesForScenes(clips.map((c) => c.durationSeconds), totalFrames);
  // A crossfade consumes `overlapFrames` from the join, so each segment is
  // rendered that much longer and the chained result lands back on target.
  const segmentFrames = sceneFrames.map((f, i) => f + (i < clips.length - 1 ? overlapFrames : 0));

  const dir = await mkdtemp(join(tmpdir(), "svp-assemble-"));
  try {
    const inputs: string[] = [];
    for (const [index, clip] of clips.entries()) {
      const path = join(dir, `clip-${index}.mp4`);
      await fetchToFile(clip.source, path);
      inputs.push(path);
    }

    // Per-input normalisation: constant frame rate, square pixels, scaled to
    // fit and padded rather than cropped (cropping would cut away part of the
    // property), then held and cut to an exact frame count.
    const filters: string[] = [];
    inputs.forEach((_, i) => {
      const frames = segmentFrames[i];
      filters.push(
        `[${i}:v]fps=${OUTPUT_FPS},` +
          `scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
          `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
          `setsar=1,format=yuv420p,` +
          // Hold the final frame if WAN returned a clip shorter than the scene.
          `tpad=stop_mode=clone:stop=${frames},` +
          `trim=start_frame=0:end_frame=${frames},setpts=PTS-STARTPTS[v${i}]`,
      );
    });

    let lastLabel = "v0";
    if (clips.length > 1 && overlapFrames > 0) {
      let elapsed = segmentFrames[0];
      for (let i = 1; i < inputs.length; i++) {
        const offset = (elapsed - overlapFrames) / OUTPUT_FPS;
        const out = i === inputs.length - 1 ? "vout" : `x${i}`;
        filters.push(
          `[${lastLabel}][v${i}]xfade=transition=${transition === "gentle-fade" ? "fade" : "dissolve"}` +
            `:duration=${(overlapFrames / OUTPUT_FPS).toFixed(4)}:offset=${offset.toFixed(4)}[${out}]`,
        );
        lastLabel = out;
        elapsed = elapsed - overlapFrames + segmentFrames[i];
      }
    } else if (clips.length > 1) {
      filters.push(`${inputs.map((_, i) => `[v${i}]`).join("")}concat=n=${inputs.length}:v=1:a=0[vout]`);
      lastLabel = "vout";
    }

    // xfade computes its offsets in seconds, so a chained render can land a
    // frame or two short of the arithmetic. Cloning the last frame for a
    // moment guarantees there are always at least `totalFrames` to cut from,
    // and the trim then makes the length exact rather than approximately right.
    // No trailing `fps` filter here: every input was already normalised to the
    // output rate, and re-timing after the trim drops the last frame (450
    // becomes 449, i.e. 14.967s instead of 15.000s).
    filters.push(
      `[${lastLabel}]tpad=stop_mode=clone:stop_duration=1,` +
        `trim=start_frame=0:end_frame=${totalFrames},setpts=PTS-STARTPTS[final]`,
    );

    const output = join(dir, "final.mp4");
    const args = [
      "-y", "-hide_banner", "-loglevel", "error",
      ...inputs.flatMap((path) => ["-i", path]),
      // A silent track keeps the file valid on platforms that reject
      // audio-less uploads; it is cut to the same length as the video.
      "-f", "lavfi", "-t", String(totalFrames / OUTPUT_FPS), "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
      "-filter_complex", filters.join(";"),
      "-map", "[final]",
      "-map", `${inputs.length}:a`,
      "-c:v", "libx264", "-preset", "medium", "-crf", "20",
      "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1",
      "-r", String(OUTPUT_FPS), "-vsync", "cfr",
      "-frames:v", String(totalFrames),
      // No -shortest: the silent track is already cut to the exact target
      // length, and -shortest would end the file on the audio stream, dropping
      // the last video frame and landing the render at 14.967s.
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      output,
    ];

    console.info(`${LOG} rendering ${clips.length} clips → ${width}x${height} @ ${OUTPUT_FPS}fps, ${totalFrames} frames`);
    await run(ffmpeg, args);

    const buffer = await readFile(output);
    const frameCount = await probeFrameCount(output, ffmpeg);
    const durationSeconds = await probeDurationSeconds(output, ffmpeg);

    if (Number.isFinite(frameCount) && frameCount !== totalFrames) {
      throw new AssemblyError(
        `Den samlede video har ${frameCount} frames, forventede ${totalFrames} (${totalFrames / OUTPUT_FPS}s)`,
      );
    }

    console.info(`${LOG} final duration=${durationSeconds.toFixed(3)}s frames=${frameCount}`);
    return { buffer, frameCount, durationSeconds, sceneFrames };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
