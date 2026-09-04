import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { startVideoGeneration } from "@/lib/google-video";
import { MONTHLY_POST_CREDITS } from "@/lib/currency";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Webhooks carry no user cookies, so a cookie-bound client authenticates as
  // `anon`. subscriptions / ai_credits / credit_transactions expose only
  // `select` to end users, so every write below was silently rejected by RLS:
  // subscriptions never activated and credits were never granted. The
  // service-role client is the only correct client here.
  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      if (session.mode === "subscription") {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: String(session.customer),
          stripe_subscription_id: String(session.subscription),
          status: "active",
        }, { onConflict: "user_id" });
      }

      if (session.mode === "payment" && session.metadata?.type === "ai_credits") {
        const credits = parseInt(session.metadata.credits ?? "0");
        const { data: existing } = await supabase
          .from("ai_credits")
          .select("balance")
          .eq("user_id", userId)
          .single();

        await supabase.from("ai_credits").upsert({
          user_id: userId,
          balance: (existing?.balance ?? 0) + credits,
        }, { onConflict: "user_id" });

        await supabase.from("credit_transactions").insert({
          user_id: userId,
          amount: credits,
          description: `Køb af ${credits} AI credits`,
          stripe_payment_id: session.payment_intent as string,
        });
      }

      if (session.mode === "payment" && session.metadata?.type === "video_payment") {
        const orderId = session.metadata.order_id;
        if (orderId) {
          await supabase.from("video_orders").update({
            paid: true,
            stripe_payment_id: session.payment_intent as string,
          }).eq("id", orderId);
        }
      }

      if (session.mode === "payment" && session.metadata?.type === "video") {
        const propertyId = session.metadata.property_id || null;
        const imageUrls = session.metadata.image_urls
          ? JSON.parse(session.metadata.image_urls)
          : [];
        const title = session.metadata.title ?? "Bolig fremvisning";

        // Insert order first
        const { data: order } = await supabase
          .from("video_orders")
          .insert({
            user_id: userId,
            property_id: propertyId,
            stripe_payment_id: session.payment_intent as string,
            status: "processing",
            image_urls: imageUrls,
            title,
          })
          .select()
          .single();

        // Trigger Google Veo 2 video generation
        if (order && imageUrls.length > 0) {
          try {
            const jobIds = await startVideoGeneration(imageUrls, title);

            await supabase
              .from("video_orders")
              .update({ video_job_id: jobIds[0] ?? null, video_job_ids: jobIds })
              .eq("id", order.id);
          } catch (err) {
            console.error("Video generation error:", err);
            await supabase
              .from("video_orders")
              .update({ status: "failed" })
              .eq("id", order.id);
          }
        }
      }
      break;
    }

    case "invoice.paid": {
      // Each paid subscription invoice (first payment + monthly renewals) tops
      // up the user's post balance. Idempotent per invoice via a transaction log.
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = String(invoice.customer);

      // Only subscribers have a subscriptions row for this customer; one-off
      // credit/video payments use Checkout in payment mode and don't invoice.
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();
      if (!sub?.user_id) break;

      // Skip if we've already granted for this invoice.
      const { data: already } = await supabase
        .from("credit_transactions")
        .select("id")
        .eq("stripe_payment_id", invoice.id)
        .maybeSingle();
      if (already) break;

      const { data: existing } = await supabase
        .from("ai_credits")
        .select("balance")
        .eq("user_id", sub.user_id)
        .single();

      await supabase.from("ai_credits").upsert({
        user_id: sub.user_id,
        balance: (existing?.balance ?? 0) + MONTHLY_POST_CREDITS,
      }, { onConflict: "user_id" });

      await supabase.from("credit_transactions").insert({
        user_id: sub.user_id,
        amount: MONTHLY_POST_CREDITS,
        description: "Månedlig opslag-saldo (abonnement)",
        stripe_payment_id: invoice.id,
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({
          status: sub.status as string,
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
