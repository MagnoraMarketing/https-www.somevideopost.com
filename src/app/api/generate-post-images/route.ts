import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import axios from "axios";

// Five parallel Imagen calls, each up to 30s.
// 60s is the Vercel Hobby ceiling; without this the route is cut off at 10s.
export const maxDuration = 60;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const STYLES = [
  "bright daylight, airy Scandinavian minimalist interior photography, wide angle",
  "golden hour warm light, luxury lifestyle real estate photography, cinematic",
  "clean white background, editorial architecture photography, professional",
  "soft natural light, cosy and inviting atmosphere, lifestyle photography",
  "dusk blue hour, dramatic exterior or interior with atmospheric lighting, premium real estate",
];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    title?: string;
    location?: string;
    price?: string;
    size?: string;
    description?: string;
  };

  const { title, location, price, size, description } = body;

  const propertyDesc = [
    title ? `Property: ${title}` : null,
    location ? `Location: ${location}` : null,
    price ? `Price: ${price}` : null,
    size ? `Size: ${size}` : null,
    description ? description.slice(0, 300) : null,
  ].filter(Boolean).join(". ");

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY er ikke konfigureret på serveren." }, { status: 500 });
  }

  // Generate 5 images with different styles in parallel
  const imagePromises = STYLES.map(async (style, i) => {
    const prompt = `Professional real estate listing photo for a Scandinavian holiday property or rental home. ${propertyDesc}. Style: ${style}. Photo ${i + 1} of 5. High resolution, photorealistic, suitable for social media marketing. No text or watermarks.`;

    try {
      const res = await axios.post<{
        predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>;
      }>(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-005:predict?key=${GEMINI_API_KEY}`,
        {
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" },
        },
        { timeout: 30000 }
      );

      const pred = res.data.predictions?.[0];
      if (!pred?.bytesBase64Encoded) return null;
      const mime = pred.mimeType ?? "image/png";
      return `data:${mime};base64,${pred.bytesBase64Encoded}`;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(imagePromises);
  const images = results.filter(Boolean) as string[];

  return NextResponse.json({ images });
}
