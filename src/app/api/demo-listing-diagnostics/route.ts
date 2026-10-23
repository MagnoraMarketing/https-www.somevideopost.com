import { NextResponse } from "next/server";
import { safeFetch } from "@/lib/safe-fetch";
import { extractProperty } from "@/services/property-import/extract-property";
import { extractImageCandidates } from "@/services/property-import/extract-images";

/**
 * TEMPORARY — removed again before merge. Shows exactly what the demo
 * listing page returns to a server-side fetch, so the demo is built only from
 * data that is really on the page. Disabled in production; fetches only the
 * one hardcoded listing, so it is not an open proxy.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const LISTING_URL = "https://www.feriebolig-spanien.dk/d/63156477?locale=da-DK&currency=DKK&adults=2";

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  try {
    const res = await safeFetch(LISTING_URL, { timeoutMs: 20_000, maxBytes: 6 * 1024 * 1024 });
    const html = res.body.toString("utf8");
    const metas = [...html.matchAll(/<meta[^>]+>/gi)].map((m) => m[0]).filter((t) => /og:|description|twitter:|geo\./i.test(t)).slice(0, 40);
    const jsonLd = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1].slice(0, 6000));
    const scripts = [...html.matchAll(/<script[^>]*id=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    return NextResponse.json({
      status: res.status,
      fetchedUrl: res.url,
      bytes: res.body.length,
      htmlTitle: html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? null,
      metas,
      jsonLd,
      scriptIds: scripts,
      textSample: text.slice(0, 8000),
      extracted: extractProperty(html),
      images: extractImageCandidates(html, res.url).slice(0, 40).map((c) => ({ url: c.url, method: c.method, w: c.declaredWidth, h: c.declaredHeight })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
