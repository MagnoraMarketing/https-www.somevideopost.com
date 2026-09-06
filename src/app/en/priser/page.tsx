import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, CreditCard, Video, Wand2, Share2, Home } from "lucide-react";
import { currencyForLocale, formatPriceKey, MONTHLY_POST_CREDITS } from "@/lib/currency";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = "https://www.somevideopost.com";

export const metadata: Metadata = {
  title: "Pricing — SOME VIDEO POST | AI video & social media for hosts",
  description:
    "Simple pricing for somevideopost.com: €10/mo for studio access with AI posts and direct social sharing, and €14 per presentation video — pay only for the videos you use. No commitment.",
  keywords:
    "somevideopost pricing, AI video price, social media rental marketing, vacation rental marketing price, presentation video price",
  alternates: {
    canonical: `${BASE}/en/priser`,
    languages: {
      da: `${BASE}/priser`,
      en: `${BASE}/en/priser`,
      es: `${BASE}/es/priser`,
      de: `${BASE}/de/priser`,
      "x-default": `${BASE}/priser`,
    },
  },
  openGraph: {
    title: "Pricing — SOME VIDEO POST",
    description:
      "€10/mo for studio access with AI posts and direct sharing, and €14 per presentation video. Pay only for what you use. No commitment.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "en_GB",
    url: `${BASE}/en/priser`,
  },
};

const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300">
      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}

export default function PriserEnPage() {
  const currency = currencyForLocale("en");
  const subscriptionPrice = formatPriceKey("subscription", currency);
  const videoPrice = formatPriceKey("video", currency);
  const postPrice = formatPriceKey("aiPost", currency, { decimals: true });

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#050d24" }}>
      <SiteHeader active="pricing" locale="en" />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-200">
            <CreditCard size={13} /> Simple, transparent pricing
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Pay only for what you use
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Studio access for {subscriptionPrice}/mo gives you AI posts and direct social media sharing. Presentation videos are billed per video — {videoPrice} — so you only pay for the videos you actually make. No commitment.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">

        {/* Pricing cards */}
        <div className="grid items-start gap-6 md:grid-cols-2">

          {/* Studio access — subscription */}
          <div className="relative flex flex-col rounded-2xl border border-blue-400/50 bg-white/[0.05] p-8 shadow-[0_0_45px_rgba(59,130,246,0.25)] backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={12} /> Studio access
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{subscriptionPrice}</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Billed monthly · no commitment</p>
            <p className="mt-3 text-sm text-slate-300">
              Access to the full studio: generate AI posts and share them directly to your social media.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{MONTHLY_POST_CREDITS} AI posts</strong> included every month ({postPrice}/post)</CheckItem>
              <CheckItem>Share posts directly to Facebook & Instagram</CheckItem>
              <CheckItem>All studio tools and downloads in every format</CheckItem>
              <CheckItem>Create presentation videos (billed per video)</CheckItem>
              <CheckItem>Blog, guides and ongoing new features</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Presentation video — pay per use */}
          <div className="flex flex-col rounded-2xl border border-orange-500/25 bg-orange-500/[0.06] p-8 backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
              <Video size={12} /> Presentation video
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{videoPrice}</span>
              <span className="text-slate-400 text-sm">/ each</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Pay-as-you-go · no video subscription</p>
            <p className="mt-3 text-sm text-slate-300">
              A cinematic AI-generated presentation video of your property — pay only when you use it.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{videoPrice} per video</strong> — no commitment, no hidden fees</CheckItem>
              <CheckItem>Paste a listing link — AI builds the video for you</CheckItem>
              <CheckItem>Cinematic 9:16 video ready for Reels & TikTok</CheckItem>
              <CheckItem>See a preview first, pay only once you&apos;re happy</CheckItem>
              <CheckItem>Download and share directly once unlocked</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Create your first video
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-6">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: "1 · Get studio access", desc: `For ${subscriptionPrice}/mo you get studio access and ${MONTHLY_POST_CREDITS} AI posts every month.` },
              { icon: Wand2, title: "2 · Make posts and videos", desc: `Generate posts included in your access, and create presentation videos for ${videoPrice} each as needed.` },
              { icon: Share2, title: "3 · Share directly", desc: "Share posts and videos directly to Facebook and Instagram from the dashboard." },
            ].map((step) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                  <step.icon size={20} className="text-blue-300" />
                </div>
                <p className="text-sm font-bold text-white">{step.title}</p>
                <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Frequently asked questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "What's included in studio access?",
                a: `Studio access for ${subscriptionPrice}/mo gives you ${MONTHLY_POST_CREDITS} AI posts a month, direct social media sharing and all the studio's tools. Presentation videos are billed separately, per video.`,
              },
              {
                q: "How much does a presentation video cost?",
                a: `A presentation video costs ${videoPrice} each. You only pay for the videos you make — there's no video subscription.`,
              },
              {
                q: "When do I pay for a video?",
                a: "You can see a preview while the video builds, and only pay once you want to unlock the full video for download and sharing. Uploading photos costs nothing.",
              },
              {
                q: "Can I share directly to social media?",
                a: "Yes. With studio access, you share posts and videos directly to Facebook and Instagram from the dashboard.",
              },
              {
                q: "What happens when my monthly posts run out?",
                a: `Your access gives you ${MONTHLY_POST_CREDITS} AI posts a month. The balance automatically refills every month as long as your subscription is active.`,
              },
              {
                q: "Is there a commitment?",
                a: "No. Studio access is monthly with no commitment, and you can cancel any time. You only pay for videos when you use them.",
              },
            ].map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-white mb-1">{item.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live video demo */}
        <div
          className="overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12 text-white"
          style={{ background: "linear-gradient(160deg, #040a1c 0%, #0a1f4d 50%, #040a1c 100%)" }}
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-400">Live demo</span>
              <h2 className="text-2xl font-bold mb-3">See what a presentation video looks like</h2>
              <p className="text-sm leading-relaxed text-slate-300 mb-5 max-w-md">
                This is what an AI-generated presentation video looks like. Paste a link to your listing — AI fetches the photos, builds the shot sequence and delivers a cinematic 9:16 video ready for Reels & TikTok.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <CheckItem><span className="text-slate-300">A real preview of your generated video</span></CheckItem>
                <CheckItem><span className="text-slate-300">Camera movement and transitions added automatically</span></CheckItem>
                <CheckItem><span className="text-slate-300">Ready in under 15 minutes</span></CheckItem>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[300px]">
                <div className="absolute inset-0 scale-90 rounded-[2.5rem] opacity-40 blur-2xl" style={{ background: ORANGE_GRADIENT }} />
                <div className="relative">
                  <VideoPreviewMockup icon={Home} roomLabel="Living Room" title="YOUR PROPERTY · DEMO" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 p-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
              Get started with somevideopost.com today. No commitment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Create account
              </Link>
              <a
                href="mailto:mail@somevideopost.com"
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter locale="en" />
    </div>
  );
}
