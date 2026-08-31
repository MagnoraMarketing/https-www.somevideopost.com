import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

// Anthropic generation can exceed the 10s default.
// 60s is the Vercel Hobby ceiling; without this the route is cut off at 10s.
export const maxDuration = 60;

// Tone per platform for a caption that accompanies a cinematic presentation video.
const PLATFORM_TONE: Record<string, string> = {
  facebook:
    "Facebook: varm, indbydende og filmisk tone. Fængende åbning, 3-4 korte afsnit, 5-8 emojis, afslut med en klar opfordring (book/skriv/link i bio). Max 1200 tegn.",
  instagram:
    "Instagram Reels: kort, sanseligt og stemningsfuldt. 2-3 linjer der matcher den cinematiske video, 8-12 emojis, og 15-20 relevante hashtags på en ny linje til sidst. Max 700 tegn ekskl. hashtags.",
  tiktok:
    "TikTok: energisk, ungt og hook-drevet. Stærk første linje, meget kort, 4-6 emojis, 8-12 hashtags til sidst. Max 500 tegn.",
  linkedin:
    "LinkedIn: professionel og værdiorienteret. Fremhæv beliggenhed og oplevelse, ingen emojis, 2-3 afsnit, afslut med en saglig opfordring. Max 1000 tegn.",
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY er ikke konfigureret på serveren." }, { status: 500 });
  }

  const body = await req.json() as {
    platform?: string;
    title?: string;
    description?: string;
    location?: string;
    bookingUrl?: string;
    variation?: number; // bump to nudge a fresh take on regenerate
  };

  const { platform = "facebook", title, description, location, bookingUrl } = body;
  const tone = PLATFORM_TONE[platform] ?? PLATFORM_TONE.facebook;

  const propertyInfo = [
    title ? `Titel: ${title}` : null,
    location ? `Beliggenhed: ${location}` : null,
    description ? `Beskrivelse: ${description.slice(0, 800)}` : null,
    bookingUrl ? `Booking-link: ${bookingUrl}` : null,
  ].filter(Boolean).join("\n");

  const prompt = `Du er ekspert i ejendomsmarkedsføring på sociale medier. Skriv en sælgende opslagstekst, der ledsager en cinematisk AI-præsentationsvideo af boligen. Teksten skal matche videoens stemning: filmisk, indbydende og fri for klichéer, og få seeren til at forestille sig ferien/opholdet.

Ejendomsoplysninger:
${propertyInfo || "Kun begrænset info tilgængelig — skriv en generel, men lokkende tekst om en dejlig feriebolig."}

${tone}

Skriv på dansk. Returner KUN den færdige tekst — ingen forklaring, ingen overskrift, ingen citationstegn omkring.`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      // A little randomness so "Generer ny" gives a genuinely different take.
      temperature: 1,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");
    return NextResponse.json({ text: content.text.trim() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
