import { CheckCircle2, Sparkles, Video } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { getSubscription, getCredits } from "@/services/billing";
import { SubscribeButton, BuyCreditsButton, BuyVideoButton, ManageBillingButton } from "@/components/billing/billing-buttons";
import { getCurrency } from "@/lib/locale-server";
import { formatPrice, formatPriceKey, priceAmount } from "@/lib/currency";

export default async function BillingPage() {
  const [subscription, credits, currency] = await Promise.all([getSubscription(), getCredits(), getCurrency()]);
  const isActive = subscription?.status === "active" || subscription?.status === "trialing";

  const subscriptionPrice = formatPriceKey("subscription", currency);
  const aiPostPrice = formatPriceKey("aiPost", currency, { decimals: currency === "eur" });
  const videoPrice = formatPriceKey("video", currency);
  const creditPacks = [10, 25, 50].map((c) => ({
    credits: c,
    price: formatPrice(priceAmount("aiPost", currency) * c, currency),
  }));

  return (
    <>
      <Topbar title="Fakturering" description="Administrer dit abonnement og køb credits." />

      <div className="flex-1 px-8 py-6">
        <div className="mx-auto max-w-3xl flex flex-col gap-6">

          {/* Current plan */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Nuværende plan</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {isActive ? "Social Medie Plan" : "Ingen aktiv plan"}
                </h2>
                {isActive && (
                  <p className="mt-1 text-sm text-slate-500">
                    {subscriptionPrice}/md · {subscription?.cancel_at_period_end ? "Udløber" : "Fornyes"} {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString("da-DK") : ""}
                  </p>
                )}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {isActive ? "Aktiv" : "Inaktiv"}
              </span>
            </div>

            {!isActive && (
              <div className="mt-6 rounded-xl border-2 border-[#1B3F7A] bg-blue-50/50 p-5">
                <p className="font-semibold text-[#1B3F7A]">Social Medie Plan — {subscriptionPrice}/md</p>
                <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {[
                    "4 sociale medie platforme",
                    "Ubegrænsede opslag",
                    "Kalendersynkronisering",
                    "Post på sider og i grupper",
                    "Automatisk posting med interval",
                    "Op til 5 boliger",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={14} className="text-[#1B3F7A] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <SubscribeButton price={subscriptionPrice} />
                </div>
              </div>
            )}

            {isActive && (
              <div className="mt-4">
                <ManageBillingButton />
              </div>
            )}
          </div>

          {/* AI Credits */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Sparkles size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">AI opslag credits</h3>
                <p className="text-sm text-slate-500">{aiPostPrice} pr. AI-genereret opslag</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-slate-900">{credits}</p>
                <p className="text-xs text-slate-400">credits tilbage</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {creditPacks.map((pack) => (
                <div key={pack.credits} className="rounded-lg border border-slate-200 p-3 text-center">
                  <p className="font-semibold text-slate-900">{pack.credits} credits</p>
                  <p className="text-sm text-slate-500">{pack.price}</p>
                  <div className="mt-2">
                    <BuyCreditsButton credits={pack.credits} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video order */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <Video size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Bolig-fremvisningsvideo</h3>
                <p className="text-sm text-slate-500">AI genererer en professionel præsentationsvideo</p>
              </div>
              <div className="ml-auto">
                <p className="text-xl font-bold text-slate-900">{videoPrice}</p>
              </div>
            </div>
            <ul className="mb-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {[
                "Henter billeder fra Airbnb & Booking.com",
                "Eller upload dine egne billeder",
                "AI-genereret præsentationsvideo",
                "Klar til Instagram Reels og TikTok",
                "Leveret inden for 24 timer",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-orange-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <BuyVideoButton price={videoPrice} />
          </div>

        </div>
      </div>
    </>
  );
}
