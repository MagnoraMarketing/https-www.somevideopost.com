import { NextResponse } from "next/server";
import type { RoomKey, Scene } from "@/components/walkthrough/cinematic-walkthrough";
import { DEMO_PROPERTY, demoHasPhotos } from "@/lib/demo-property";

/**
 * The demo property for the walkthrough on the landing, pricing and blog
 * pages — read from src/lib/demo-property.ts, never scraped.
 *
 * This route used to scrape the demo listing live, through third-party
 * proxies when the site blocked it, and to fill every gap with hardcoded
 * figures (a nightly price, a rating, guest and room counts) that were never
 * on the listing. What it served ended up describing a different property.
 * Now it returns only what a person has verified, and nothing at all about
 * the property until photos we may use are in place: the walkthrough then
 * keeps its neutral bundled illustrations.
 */

type Payload = {
  source: "listing" | "placeholder";
  title?: string;
  location?: string;
  guests?: string;
  beds?: string;
  baths?: string;
  scenes: Scene[];
};

const ROOM_KEYS: RoomKey[] = ["facade", "entrance", "kitchen", "living", "bedroom", "bathroom", "terrace", "pool", "other"];

function payload(): Payload {
  if (!demoHasPhotos()) return { source: "placeholder", scenes: [] };

  const p = DEMO_PROPERTY;
  const count = (n: number | null) => (n === null ? undefined : String(n));
  return {
    source: "listing",
    title: p.title ?? undefined,
    location: p.location ?? undefined,
    guests: count(p.guests),
    beds: count(p.bedrooms),
    baths: count(p.bathrooms),
    scenes: p.photos
      .filter((photo) => ROOM_KEYS.includes(photo.room))
      .map((photo) => ({ src: photo.src, roomKey: photo.room })),
  };
}

export function GET() {
  return NextResponse.json(payload(), {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
