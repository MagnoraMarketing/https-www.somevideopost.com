/**
 * The demo property shown in the walkthrough on the landing, pricing and blog
 * pages.
 *
 * This file is the single source of truth for it, and it is filled in by a
 * person, not scraped. feriebolig-spanien.dk answers automated requests with a
 * CAPTCHA ("Human Verification"), and the demo must not get around that — nor
 * show anything that has not been checked against the listing.
 *
 * Rules for editing:
 * - Every fact is copied from the listing page itself. Unknown stays null; a
 *   null field is simply not shown. Nothing is carried over from the previous
 *   demo villa and nothing is estimated.
 * - Photos are only added when we are allowed to use them (the owner's or
 *   agency's permission). They live in /public/demo-property/ so the demo
 *   never hotlinks a third-party image server.
 * - `room` is what the photo actually shows. Use "other" when unsure rather
 *   than guessing a room.
 *
 * With fewer than three photos the walkthrough shows the neutral bundled
 * illustrations and no property details at all.
 */

export type DemoRoom =
  | "facade" | "entrance" | "kitchen" | "living"
  | "bedroom" | "bathroom" | "terrace" | "pool" | "other";

export type DemoPhoto = {
  /** Path under /public, e.g. "/demo-property/01.jpg". */
  src: string;
  room: DemoRoom;
};

export type DemoProperty = {
  listingId: string;
  listingUrl: string;
  /** Display name as written on the listing. */
  title: string | null;
  /** Town and region as written on the listing. */
  location: string | null;
  propertyType: string | null;
  guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  livingAreaM2: number | null;
  /** E.g. "Privat pool", "Tagterrasse" — only what the listing states. */
  amenities: string[];
  photos: DemoPhoto[];
  /**
   * A finished presentation video of this property, made by our own
   * pipeline. Null until one exists — the "Rigtig video" tab and the sample
   * player stay hidden rather than showing footage of something else.
   */
  videoUrl: string | null;
};

export const DEMO_PROPERTY: DemoProperty = {
  listingId: "63156477",
  listingUrl: "https://www.feriebolig-spanien.dk/d/63156477?locale=da-DK&currency=DKK&adults=2",
  title: null,
  location: null,
  propertyType: null,
  guests: null,
  bedrooms: null,
  bathrooms: null,
  livingAreaM2: null,
  amenities: [],
  photos: [],
  videoUrl: null,
};

/** Enough real photos to replace the neutral illustrations. */
export const DEMO_MIN_PHOTOS = 3;

export function demoHasPhotos(property: DemoProperty = DEMO_PROPERTY): boolean {
  return property.photos.length >= DEMO_MIN_PHOTOS;
}

/** The listing link as shown in the workflow demo's input field. */
export function demoListingDisplayUrl(property: DemoProperty = DEMO_PROPERTY): string {
  const url = new URL(property.listingUrl);
  return `${url.host.replace(/^www\./, "")}${url.pathname}`;
}
