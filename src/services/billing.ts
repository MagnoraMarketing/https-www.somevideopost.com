"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe, subscriptionLineItem } from "@/lib/stripe";
import { getLocale, getCurrency } from "@/lib/locale-server";
import { priceAmount } from "@/lib/currency";

export async function getSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return data;
}

export async function getCredits(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("ai_credits")
    .select("balance")
    .eq("user_id", user.id)
    .single();
  return data?.balance ?? 0;
}

export async function hasActiveSubscription(): Promise<boolean> {
  const sub = await getSubscription();
  return sub?.status === "active" || sub?.status === "trialing";
}

export async function createSubscriptionCheckout(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);

  // Get or create Stripe customer
  let customerId: string;
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (sub?.stripe_customer_id) {
    customerId = sub.stripe_customer_id;
  } else {
    const customer = await getStripe().customers.create({ email: user.email });
    customerId = customer.id;
  }

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [subscriptionLineItem(currency)],
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/billing`,
    metadata: { user_id: user.id },
    locale,
  });

  redirect(session.url!);
}

export async function createAiCreditCheckout(formData: FormData): Promise<void> {
  const credits = parseInt(String(formData.get("credits") ?? "10"));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{
      price_data: {
        currency,
        product_data: { name: `${credits} AI opslag credits` },
        unit_amount: priceAmount("aiPost", currency) * credits,
      },
      quantity: 1,
    }],
    success_url: `${appUrl}/billing?payment=success`,
    cancel_url: `${appUrl}/billing`,
    metadata: { user_id: user.id, type: "ai_credits", credits: String(credits) },
    locale,
  });

  redirect(session.url!);
}

/**
 * Start a presentation video.
 *
 * Delegates to the property-video pipeline, which imports the listing's actual
 * photographs (or adopts the ones the customer picked), lets the AI Director
 * choose and storyboard them, and drives WAN 3.0 from those real images. The
 * name is kept because the order form's `action` points at it.
 */
export async function createVideoOrderCheckout(formData: FormData): Promise<void> {
  const { createPropertyVideoOrder } = await import("@/services/video-jobs");
  await createPropertyVideoOrder(formData);
}

export async function createVideoPaymentCheckout(formData: FormData): Promise<void> {
  const orderId = String(formData.get("order_id") ?? "");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify the order belongs to the user and isn't already paid.
  const { data: order } = await supabase
    .from("video_orders")
    .select("id, paid, title")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();
  if (!order) redirect("/videos");
  if (order.paid) redirect(`/videos/${orderId}`);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency,
        product_data: { name: `Præsentationsvideo — ${order.title ?? "bolig"}` },
        unit_amount: priceAmount("video", currency),
      },
      quantity: 1,
    }],
    success_url: `${appUrl}/videos/${orderId}?paid=1`,
    cancel_url: `${appUrl}/videos/${orderId}`,
    metadata: { user_id: user.id, type: "video_payment", order_id: orderId },
    locale,
  });

  redirect(session.url!);
}

export async function createBillingPortalSession(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.stripe_customer_id) redirect("/billing");

  const session = await getStripe().billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${appUrl}/billing`,
  });

  redirect(session.url);
}
