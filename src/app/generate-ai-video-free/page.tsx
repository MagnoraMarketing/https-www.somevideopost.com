import type { Metadata } from "next";
import Link from "next/link";
import {
  Gift, Sparkles, Link2, Wand2, Eye, ArrowRight,
  CheckCircle2, XCircle, Download, Share2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { getCurrency } from "@/lib/locale-server";
import { formatPriceKey } from "@/lib/currency";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/generate-ai-video-free`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Generate AI Video Free: How to Create Your First Video at No Cost | somevideopost.com",
  description:
    "You can generate and preview an AI video on somevideopost.com for free — no card required to start. See exactly what's free, what a full video costs to unlock, and how the whole process works.",
  keywords:
    "generate AI video free, free AI video generator, AI video for free, create AI video no cost, free AI video maker, AI video generator free trial",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Generate AI Video Free: How to Create Your First Video at No Cost",
    description:
      "Generate and preview an AI video on somevideopost.com for free — no card required to start. See what's free and what unlocking a full video costs.",
    type: "website",
    siteName: "somevideopost.com",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate AI Video Free: How to Create Your First Video at No Cost",
    description: "Generate and preview an AI video for free — no card required to start.",
  },
};

function Step({ n, icon: Icon, title, desc }: { n: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_0_18px_rgba(59,130,246,0.35)]" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-300">{n}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

export default async function GenerateAiVideoFreePage() {
  const currency = await getCurrency();
  const videoPrice = formatPriceKey("video", currency);
  const subscriptionPrice = formatPriceKey("subscription", currency);

  const FAQ = [
    {
      q: "Can I actually generate an AI video for free?",
      a: `Yes. On somevideopost.com you paste a listing link or upload photos and AI generates and previews a full video for free — no card required to start. You only pay (${videoPrice}) if you choose to unlock the video for download and sharing.`,
    },
    {
      q: "What exactly is free, and what costs money?",
      a: `Generating the video and watching the preview build is free. Unlocking the finished video — so you can download it or publish it — costs ${videoPrice} per video, charged only once, when you decide to unlock it. There's no subscription required just to make a video.`,
    },
    {
      q: "Is there a catch, like a watermark or a time limit?",
      a: `The free preview is watermarked and not downloadable, so it's clearly a preview — but it's a real preview of your actual generated video, not a generic sample. Paying ${videoPrice} removes the watermark and unlocks the full-resolution video for download and sharing, so you always know exactly what you're getting before you decide to unlock it.`,
    },
    {
      q: "Do I need a credit card to start generating?",
      a: "No. You can create an account and generate your first preview without entering payment details. Payment is only needed if you choose to unlock a video or subscribe for studio access.",
    },
    {
      q: "What's the difference between the free video preview and studio access?",
      a: `Generating and previewing a video is free and pay-per-video after that (${videoPrice} each). Studio access is a separate, optional ${subscriptionPrice}/month subscription that unlocks AI-generated social posts and direct publishing to Facebook and Instagram — you don't need it just to make a video.`,
    },
    {
      q: "Can I generate more than one free preview?",
      a: "Yes — you can generate a new preview for any listing or photo set you add. The free part is generating and previewing; the per-video cost only applies when you unlock a specific video for download or sharing.",
    },
    {
      q: "What can I do with the video once I unlock it?",
      a: "Download it in 9:16, 1:1 or 16:9, or publish it directly to Facebook, Instagram, TikTok, LinkedIn and YouTube from the dashboard — it's yours to use however you like.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to generate an AI video for free",
      description: "Steps to generate and preview an AI-generated video on somevideopost.com without paying anything upfront.",
      step: [
        { "@type": "HowToStep", name: "Create a free account", text: "Sign up with no card required." },
        { "@type": "HowToStep", name: "Paste a link or upload photos", text: "Point somevideopost.com at your listing or upload your own photos." },
        { "@type": "HowToStep", name: "Preview your AI video for free", text: "Watch the AI-generated video build and preview it at no cost." },
        { "@type": "HowToStep", name: "Unlock, download or publish", text: `Pay only if you choose to unlock the final video (${videoPrice}) to download or publish it.` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Generate AI Video Free", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Gift size={11} className="text-orange-300" /> Generate AI Video Free
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Yes — you can generate an
            {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI video for free</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            somevideopost.com lets you generate and preview a real AI video before you pay anything. No card required
            to start. You only pay ({videoPrice}) if you decide to unlock the finished video for download or
            publishing.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Generate your free preview <ArrowRight size={16} />
            </Link>
            <Link href="/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              See full pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's free ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">What does &ldquo;free&rdquo; actually include?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Most tools that promise a &ldquo;free AI video&rdquo; either require a credit card upfront, hide the
            output behind a paywall until after you&apos;ve paid, or only let you generate a low-quality preview that
            doesn&apos;t reflect the real result. somevideopost.com works differently: you generate the real video and
            watch it build in the dashboard, completely free — you decide whether to unlock it afterwards.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle2 size={16} /> Free, no card required</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Creating an account</li>
                <li>Pasting a link or uploading photos</li>
                <li>AI generating your video</li>
                <li>Watching a watermarked preview build</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-400"><XCircle size={16} /> Paid, only if you want it</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Unlocking the final video ({videoPrice} per video)</li>
                <li>Downloading it in full resolution</li>
                <li>Publishing it to your social channels</li>
                <li>Optional studio access for AI posts ({subscriptionPrice}/mo)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Wand2 size={12} /> How it works
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Generate your free AI video in four steps</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Step n="Step 1" icon={Sparkles} title="Create a free account" desc="Sign up in seconds — no credit card required to get started." />
            <Step n="Step 2" icon={Link2} title="Paste a link or upload photos" desc="Point somevideopost.com at a listing, product page or your own photos." />
            <Step n="Step 3" icon={Eye} title="Preview your video for free" desc="Watch AI generate your real video and preview it — watermarked, at no cost — right in the dashboard." />
            <Step n="Step 4" icon={Download} title="Unlock, download or publish" desc={`Happy with it? Unlock the video for ${videoPrice} to download it or publish it to your social channels.`} />
          </div>
        </div>
      </section>

      {/* ── Why it's structured this way ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Why pay only after you see the result?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            AI video generation costs compute time, and most tools cover that by putting everything behind a
            subscription before you&apos;ve seen a single result. somevideopost.com flips that: you see exactly what
            you&apos;re getting — your actual video, not a generic sample — before you spend anything. If you don&apos;t want
            to keep it, you simply don&apos;t unlock it.
          </p>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">
            <Share2 size={18} className="mt-0.5 shrink-0 text-blue-300" />
            <p className="text-sm leading-relaxed text-slate-300">
              Once unlocked, every video can be shared directly to Facebook, Instagram, TikTok, LinkedIn and YouTube
              from the dashboard, or downloaded in 9:16, 1:1 and 16:9 for wherever else you need it.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-white marker:content-none">
                  {f.q}
                  <span className="shrink-0 text-blue-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <UseCaseLinks current="/generate-ai-video-free" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Try it — it costs nothing to see your video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Create a free account, paste a link or upload photos, and preview your AI video today.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Start for free <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            See full <Link href="/priser" className="text-blue-300 underline-offset-2 hover:underline">pricing details</Link>, read
            {" "}<Link href="/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">why hosts choose somevideopost.com</Link>, or
            browse the <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
