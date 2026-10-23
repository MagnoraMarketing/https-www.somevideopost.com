"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { readCachedProperty } from "@/services/property-import";
import { detailsFromListing, sanitizeDetails, type PropertyDetails } from "@/lib/property-details";

/**
 * Server actions for the "Tekst & info" panel on the video page.
 *
 * Both run as the signed-in customer: row-level security limits them to
 * their own orders, and property_details is a field customers may edit.
 */

const MISSING_COLUMN = "Oplysningerne kan ikke gemmes endnu — databaseopdateringen (migration 015) mangler.";

/** Save the customer's own version of the property details. */
export async function savePropertyDetails(
  orderId: string,
  input: unknown,
): Promise<{ details?: PropertyDetails; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const details: PropertyDetails = {
    ...sanitizeDetails(input),
    source: "edited",
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("video_orders")
    .update({ property_details: details })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    console.error(`[property-details] save failed for ${orderId}: ${error.message}`);
    return { error: /property_details/.test(error.message) ? MISSING_COLUMN : "Oplysningerne kunne ikke gemmes. Prøv igen." };
  }
  if (!data?.length) return { error: "Ordren findes ikke" };

  revalidatePath(`/videos/${orderId}`);
  return { details };
}

/**
 * What the listing said when the video was made, for the customer to review
 * before saving. Read from the import cache only — the listing page itself
 * is never fetched again from here.
 */
export async function loadListingDetails(orderId: string): Promise<{ details?: PropertyDetails; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const { data: order } = await supabase
    .from("video_orders")
    .select("id, source_url")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string; source_url: string | null }>();
  if (!order) return { error: "Ordren findes ikke" };
  if (!order.source_url) return { error: "Videoen er lavet fra uploadede billeder — der er ingen annonce at hente fra." };

  const property = await readCachedProperty(order.source_url);
  if (!property) {
    return { error: "Der er ingen gemte oplysninger fra annoncen. Udfyld felterne selv — de gemmes på videoen." };
  }
  return { details: detailsFromListing(property) };
}
