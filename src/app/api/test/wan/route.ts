import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createVideoTask, getVideoTask, wanConfigStatus, KNOWN_WAN_MODELS,
  WanApiError, WanConfigError,
} from "@/lib/wan/client";
import { WAN_CONNECTIVITY_PROMPT, WAN_NEGATIVE_PROMPT } from "@/lib/wan/prompt";

/**
 * WAN connectivity self-check.
 *
 * GET  /api/test/wan                  → which variables are set (booleans only)
 * GET  /api/test/wan?taskId=…         → status of an existing task
 * POST /api/test/wan  { imageUrl? }   → submit one small test generation
 *
 * Runs entirely server-side and never returns a key, a key prefix, or any
 * other part of a secret — only whether each variable is present.
 */

export const maxDuration = 60;

// WAN fetches the image itself, so the test image must be reachable from the
// public internet — a small JPEG served from this app's own /public. On a
// local dev server that URL is not reachable from Alibaba; pass an imageUrl in
// the request body when testing from localhost.
function defaultTestImage(): string {
  const base = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
  return `${base.replace(/\/$/, "")}/wan-test-image.jpg`;
}

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function errorResponse(e: unknown) {
  if (e instanceof WanConfigError) {
    return NextResponse.json({ ok: false, error: e.message, missing: e.missing }, { status: 500 });
  }
  if (e instanceof WanApiError) {
    return NextResponse.json(
      { ok: false, error: e.message, status: e.status, code: e.code, requestId: e.requestId },
      // 502: the failure is upstream at Alibaba, not in this request.
      { status: e.status >= 400 && e.status < 500 ? e.status : 502 },
    );
  }
  return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = wanConfigStatus();
  const taskId = req.nextUrl.searchParams.get("taskId");

  if (!taskId) {
    // A model id this client cannot speak fails every scene the same way, so
    // it is reported here beside the missing variables rather than left for a
    // generation to discover.
    const modelHint = !config.modelSupported
      ? `WAN_MODEL=${config.model} findes ikke i Model Studio — brug ${KNOWN_WAN_MODELS.join(", ")}.`
      : null;

    return NextResponse.json({
      ok: config.ok && config.modelSupported,
      configured: config.ok,
      missing: config.missing,
      model: config.model,
      modelSupported: config.modelSupported,
      region: config.region,
      endpoint: `https://{ALIBABA_WORKSPACE_ID}.${config.region}.maas.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis`,
      hint: !config.ok
        ? `Sæt ${config.missing.join(" og ")} i Vercel.`
        : modelHint ?? "POST til /api/test/wan for at sende en testgenerering.",
    });
  }

  try {
    const status = await getVideoTask(taskId);
    return NextResponse.json({ ok: true, taskId, ...status });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let imageUrl = defaultTestImage();
  try {
    const body = (await req.json()) as { imageUrl?: string };
    if (body?.imageUrl?.startsWith("https://")) imageUrl = body.imageUrl;
  } catch { /* no body — use the default image */ }

  try {
    const handle = await createVideoTask({
      imageUrl,
      prompt: WAN_CONNECTIVITY_PROMPT,
      negativePrompt: WAN_NEGATIVE_PROMPT,
      durationSeconds: 3,
      resolution: "480P",
    });
    return NextResponse.json({
      ok: true,
      taskId: handle.taskId,
      requestId: handle.requestId,
      imageUrl,
      next: `/api/test/wan?taskId=${encodeURIComponent(handle.taskId)}`,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
