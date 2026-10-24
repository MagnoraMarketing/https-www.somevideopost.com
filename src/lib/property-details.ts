import type { ExtractedProperty } from "@/services/property-import/extract-property";

/**
 * Practical details about the property behind a video order — what a guest
 * actually needs to know — shown under the photos on the video page and
 * editable by the customer.
 *
 * Seeded from the listing import with only what the page states; anything the
 * listing does not say stays empty rather than guessed. Pure so the self-test
 * can pin down the mapping and the validation.
 */

export type PoolKind = "private" | "shared" | "yes";

export type PropertyDetails = {
  title: string | null;
  location: string | null;
  propertyType: string | null;
  guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  livingAreaM2: number | null;
  beachDistanceM: number | null;
  pool: PoolKind | null;
  /** Facilities as short labels, e.g. "Terrasse", "Aircondition". */
  features: string[];
  description: string | null;
  /** Check-in, keys, parking, house rules — free text from the owner. */
  practicalNotes: string | null;
  /** "listing" until the customer saves their own version. */
  source: "listing" | "edited";
  updatedAt: string;
};

/** The facilities offered as checkboxes; anything else the listing named is kept too. */
export const COMMON_FEATURES = [
  "Terrasse", "Have", "Havudsigt", "Strandnær", "Aircondition", "WiFi", "Parkering",
  "Opvaskemaskine", "Vaskemaskine", "Grill", "Elevator", "Kæledyr tilladt",
] as const;

export const POOL_LABELS: Record<PoolKind, string> = {
  private: "Privat pool",
  shared: "Fælles pool",
  yes: "Pool",
};

export const DETAIL_LIMITS = {
  title: 200,
  location: 200,
  propertyType: 80,
  description: 4000,
  practicalNotes: 2000,
  feature: 40,
  features: 30,
} as const;

export function emptyDetails(now = new Date()): PropertyDetails {
  return {
    title: null, location: null, propertyType: null,
    guests: null, bedrooms: null, bathrooms: null, livingAreaM2: null, beachDistanceM: null,
    pool: null, features: [], description: null, practicalNotes: null,
    source: "listing", updatedAt: now.toISOString(),
  };
}

/** What the listing import found, mapped onto the editable fields. */
export function detailsFromListing(property: ExtractedProperty, now = new Date()): PropertyDetails {
  const f = property.features ?? { amenities: [] };
  const pool: PoolKind | null = f.privatePool ? "private" : f.communalPool ? "shared" : f.pool ? "yes" : null;
  // Pool is its own field; the rest of the amenity labels become features.
  const features = [...new Set((f.amenities ?? []).filter((a) => a !== "Pool"))];

  return sanitizeDetails({
    title: property.title,
    location: property.location,
    guests: f.guests,
    bedrooms: f.bedrooms,
    bathrooms: f.bathrooms,
    livingAreaM2: f.squareMeters,
    beachDistanceM: f.beachDistanceMeters,
    pool,
    features,
    description: property.description,
    source: "listing",
  }, now);
}

/**
 * What the order form's link reader found, mapped onto the editable fields.
 * The reader returns loose strings, so only what parses cleanly is kept: a
 * size like "85 m²" becomes the living area, house rules become the
 * practical notes.
 */
export function detailsFromScraped(
  scraped: { title?: string; description?: string; location?: string; size?: string; conditions?: string },
  now = new Date(),
): PropertyDetails {
  const area = scraped.size?.match(/(\d+(?:[.,]\d+)?)\s*m(?:²|2)/i)?.[1];
  return sanitizeDetails({
    title: scraped.title,
    location: scraped.location,
    livingAreaM2: area,
    description: scraped.description,
    practicalNotes: scraped.conditions,
    source: "listing",
  }, now);
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\r\n/g, "\n").trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function count(value: unknown, max: number): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return Math.round(n * 10) / 10;
}

/**
 * Validate anything that claims to be property details — form input or a
 * stored row — into a well-formed object. Out-of-range numbers and unknown
 * values are dropped, never coerced into something plausible.
 */
export function sanitizeDetails(input: unknown, now = new Date()): PropertyDetails {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const pool = raw.pool === "private" || raw.pool === "shared" || raw.pool === "yes" ? raw.pool : null;
  const features = Array.isArray(raw.features)
    ? [...new Set(
        raw.features
          .map((feature) => text(feature, DETAIL_LIMITS.feature))
          .filter((feature): feature is string => !!feature),
      )].slice(0, DETAIL_LIMITS.features)
    : [];

  return {
    title: text(raw.title, DETAIL_LIMITS.title),
    location: text(raw.location, DETAIL_LIMITS.location),
    propertyType: text(raw.propertyType, DETAIL_LIMITS.propertyType),
    guests: count(raw.guests, 50),
    bedrooms: count(raw.bedrooms, 30),
    bathrooms: count(raw.bathrooms, 30),
    livingAreaM2: count(raw.livingAreaM2, 5000),
    beachDistanceM: count(raw.beachDistanceM, 100_000),
    pool,
    features,
    description: text(raw.description, DETAIL_LIMITS.description),
    practicalNotes: text(raw.practicalNotes, DETAIL_LIMITS.practicalNotes),
    source: raw.source === "edited" ? "edited" : "listing",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : now.toISOString(),
  };
}

/** True when the details hold nothing worth showing. */
export function detailsAreEmpty(details: PropertyDetails): boolean {
  return !details.title && !details.location && !details.propertyType && !details.description
    && !details.practicalNotes && details.guests === null && details.bedrooms === null
    && details.bathrooms === null && details.livingAreaM2 === null && details.beachDistanceM === null
    && details.pool === null && details.features.length === 0;
}
