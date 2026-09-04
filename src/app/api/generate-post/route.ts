import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_SIGNUP_POSTS } from "@/lib/currency";
import Anthropic from "@anthropic-ai/sdk";

// Anthropic generation can exceed the 10s default.
// 60s is the Vercel Hobby ceiling; without this the route is cut off at 10s.
export const maxDuration = 60;

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  facebook: `
Du skriver til Facebook. Brug en varm, engagerende tone. Start med en fængende indledning.
Inkluder relevante emojis (5-8 stk.). Skriv 3-4 afsnit. Slut med en opfordring til handling (f.eks. "Kontakt os for en fremvisning" eller "Link i bio").
Max 1500 tegn. Skriv på dansk.`,
  instagram: `
Du skriver til Instagram. Teksten skal være visuelt inspirerende og kort. Max 2-3 korte afsnit + hashtags.
Brug 8-12 emojis. Slut med 15-20 relevante hashtags på en ny linje (f.eks. #ferielejlighed #spansk #drømmebolig #somsale).
Max 800 tegn (ekskl. hashtags). Skriv på dansk.`,
  linkedin: `
Du skriver til LinkedIn. Brug en professionel og investeringsorienteret tone. Fremhæv ejendomsværdi, beliggenhed og afkastpotentiale.
Ingen emojis. 3-4 afsnit. Slut med en call-to-action til interesserede investorer eller boligkøbere.
Max 1200 tegn. Skriv på dansk.`,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY er ikke konfigureret på serveren." }, { status: 500 });
  }

  // Each generated post costs 1 credit (= 5 kr), drawn from the monthly balance.
  // ai_credits exposes only `select` to end users, so the balance must be read
  // and written with the service-role client — a cookie-bound client has its
  // updates silently dropped by RLS, leaving the balance permanently stale.
  const admin = createAdminClient();
  const { data: credits } = await admin
    .from("ai_credits")
    .select("balance")
    .eq("user_id", user.id)
    .maybeSingle<{ balance: number }>();

  // No row means the account was never provisioned. Nothing granted the free
  // posts the marketing pages promise, so grant them on first use; the row's
  // existence is what stops it being granted twice.
  let balance = credits?.balance ?? 0;
  if (!credits) {
    balance = FREE_SIGNUP_POSTS;
    await admin
      .from("ai_credits")
      .upsert({ user_id: user.id, balance }, { onConflict: "user_id" });
    await admin.from("credit_transactions").insert({
      user_id: user.id,
      amount: FREE_SIGNUP_POSTS,
      description: "Gratis opslag ved oprettelse",
    });
  }

  if (balance < 1) {
    return NextResponse.json(
      { error: "Ingen saldo tilbage. Tegn abonnementet for at generere opslag.", code: "no_credits" },
      { status: 402 },
    );
  }

  const body = await req.json() as {
    platform: string;
    title?: string;
    description?: string;
    location?: string;
    price?: string;
    size?: string;
    listingUrl?: string;
  };

  const { platform, title, description, location, price, size, listingUrl } = body;
  const platformInstructions = PLATFORM_INSTRUCTIONS[platform] ?? PLATFORM_INSTRUCTIONS.facebook;

  const propertyInfo = [
    title ? `Titel: ${title}` : null,
    location ? `Beliggenhed: ${location}` : null,
    price ? `Pris: ${price}` : null,
    size ? `Størrelse: ${size}` : null,
    description ? `Beskrivelse: ${description.slice(0, 800)}` : null,
    listingUrl ? `Link til annonce: ${listingUrl}` : null,
  ].filter(Boolean).join("\n");

  const prompt = `Du er en ekspert i ejendomsmarkedsføring og sociale medier. Skriv et sælgende opslag til en ferielejlighed/bolig.

Ejendomsoplysninger:
${propertyInfo || "Ingen yderligere oplysninger tilgængelige."}

Platform-specifikke instruktioner:
${platformInstructions}

Returner KUN den færdige tekst — ingen forklaringer, ingen overskrifter, ingen citationstegn omkring teksten.`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");
    const text = content.text.trim();

    // Charge 1 credit now that generation succeeded, and log the usage.
    await admin.from("ai_credits").update({ balance: balance - 1 }).eq("user_id", user.id);
    await admin.from("credit_transactions").insert({
      user_id: user.id,
      amount: -1,
      description: `AI-opslag (${platform})`,
    });

    return NextResponse.json({ text, creditsLeft: balance - 1 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
