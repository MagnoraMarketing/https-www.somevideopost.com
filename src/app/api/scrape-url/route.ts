import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scrapePropertyUrl } from "@/services/scrape-property";

// Multi-provider scrape fallback chain can run well past the 10s default.
// 60s is the Vercel Hobby ceiling; without this the route is cut off at 10s.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json() as { url?: string };
  if (!url?.startsWith("http")) return NextResponse.json({ error: "Invalid URL" }, { status: 400 });

  const result = await scrapePropertyUrl(url);
  return NextResponse.json(result);
}
