import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { KNOWN_WAN_MODELS, wanConfigStatus } from "@/lib/wan/client";
import { ffmpegAvailable } from "@/services/video/assembler";

// Reaches Supabase to check the credit row and storage bucket.
export const maxDuration = 30;

/**
 * Configuration self-check. Visit /api/diagnostics while logged in to see why
 * generating a post or a video is failing.
 *
 * Every failure in these two flows is reported to the user as a generic
 * message or swallowed by RLS, and a missing key looks identical to a broken
 * one from the outside. This reports which pieces are actually in place.
 *
 * Only booleans are returned — never a key or any part of one.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Log ind først" }, { status: 401 });

  const wan = wanConfigStatus();

  const env = {
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    ALIBABA_CLOUD_API_KEY: !!process.env.ALIBABA_CLOUD_API_KEY,
    ALIBABA_WORKSPACE_ID: !!process.env.ALIBABA_WORKSPACE_ID,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY:
      !!(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY),
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
  };

  // The service-role client is what makes credit grants and video uploads
  // possible at all, so check it can actually reach the two things it writes.
  let creditRow: boolean | string = "ukendt";
  let videosBucket: boolean | string = "ukendt";
  let migrationApplied: boolean | string = "ukendt";
  let pipelineTables: boolean | string = "ukendt";
  let captionColumn: boolean | string = "ukendt";

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();

    const { data: credits } = await admin
      .from("ai_credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle<{ balance: number }>();
    creditRow = !!credits;

    // The pipeline cannot run at all until its own migration has been applied.
    const { error: sceneErr } = await admin.from("video_scenes").select("id").limit(1);
    pipelineTables = sceneErr ? `mangler: ${sceneErr.message}` : true;

    // The sales text is saved when the field loses focus, so a missing column
    // is only visible as a text that quietly comes back different on reload.
    const { error: captionErr } = await admin.from("video_orders").select("caption").limit(1);
    captionColumn = captionErr ? `mangler: ${captionErr.message}` : true;

    const { data: buckets, error } = await admin.storage.listBuckets();
    if (error) {
      videosBucket = `fejl: ${error.message}`;
    } else {
      videosBucket = buckets.some((b) => b.name === "videos");
      migrationApplied = videosBucket === true;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    creditRow = `fejl: ${msg}`;
    videosBucket = `fejl: ${msg}`;
    captionColumn = `fejl: ${msg}`;
  }

  const blockers: string[] = [];
  if (!env.ANTHROPIC_API_KEY) {
    blockers.push(
      "ANTHROPIC_API_KEY mangler i Vercel — opslagstekst kan ikke genereres (HTTP 500).",
    );
  }
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    blockers.push(
      "SUPABASE_SERVICE_ROLE_KEY mangler i Vercel — credits kan ikke tildeles, " +
        "så du får altid 'Ingen saldo tilbage'.",
    );
  }
  if (!env.GEMINI_API_KEY) {
    blockers.push(
      "GEMINI_API_KEY mangler i Vercel — AI Director kan ikke analysere boligbilleder " +
        "(pipelinen falder tilbage til deterministisk billedvalg).",
    );
  }
  if (!wan.ok) {
    blockers.push(
      `${wan.missing.join(" og ")} mangler i Vercel — WAN kan ikke generere klip. ` +
        "Tjek /api/test/wan.",
    );
  }
  if (wan.ok && !wan.modelSupported) {
    blockers.push(
      `WAN_MODEL=${wan.model} findes ikke i Model Studio — hver eneste scene afvises. ` +
        `Brug en af: ${KNOWN_WAN_MODELS.join(", ")}.`,
    );
  }
  if (!ffmpegAvailable()) {
    blockers.push(
      "Ingen ffmpeg-binær på serveren — den færdige 15-sekunders video kan ikke samles. " +
        "Sæt FFMPEG_PATH eller sørg for at ffmpeg-static er installeret.",
    );
  }
  if (pipelineTables !== true) {
    blockers.push(
      "Migrationen er ikke kørt: video_scenes findes ikke i Supabase. " +
        "Kør supabase/migrations/20260904_012_property_video_pipeline.sql.",
    );
  }
  if (captionColumn !== true) {
    blockers.push(
      "Migrationen er ikke kørt: video_orders.caption findes ikke i Supabase, " +
        "så den redigerede salgstekst går tabt ved genindlæsning. " +
        "Kør supabase/migrations/20260906_013_video_caption.sql.",
    );
  }
  if (videosBucket === false) {
    blockers.push(
      "Migrationen er ikke kørt: 'videos'-bucket findes ikke i Supabase. " +
        "Kør supabase/migrations/20260831_011_credit_provisioning_and_video_bucket.sql.",
    );
  }

  return NextResponse.json({
    env,
    wan: {
      configured: wan.ok,
      missing: wan.missing,
      model: wan.model,
      modelSupported: wan.modelSupported,
      region: wan.region,
    },
    assembly: { ffmpeg: ffmpegAvailable() },
    supabase: { creditRow, videosBucket, migrationApplied, pipelineTables, captionColumn },
    blockers,
    ok: blockers.length === 0,
  });
}
