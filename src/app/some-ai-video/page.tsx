import type { Metadata } from "next";
import Link from "next/link";
import {
  Share2, Sparkles, Video, Link2, Wand2, ArrowRight,
  Clock, TrendingUp, MonitorSmartphone, Music2, Globe, Megaphone,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/some-ai-video`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "SoMe AI Video: Create AI-Generated Video for Social Media | somevideopost.com",
  description:
    "SoMe AI video turns a link or a handful of photos into a scroll-stopping social media video — ready for Instagram Reels, TikTok, Facebook and LinkedIn in minutes. See how it works, what you get, and try it free.",
  keywords:
    "SoMe AI video, AI video for social media, AI generated video Instagram, AI video TikTok, social media video generator, AI reels generator, AI video maker for social media, somevideopost SoMe video",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "SoMe AI Video: Create AI-Generated Video for Social Media",
    description:
      "Turn a link or photos into a scroll-stopping social video in minutes — sized for Instagram, TikTok, Facebook and LinkedIn, with AI camera moves, music and captions.",
    type: "website",
    siteName: "somevideopost.com",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "SoMe AI Video: Create AI-Generated Video for Social Media",
    description:
      "Turn a link or photos into a scroll-stopping social video in minutes — ready for Instagram, TikTok, Facebook and LinkedIn.",
  },
};

const FAQ = [
  {
    q: "What is SoMe AI video?",
    a: "\"SoMe\" (social media) AI video is video content generated automatically by artificial intelligence for platforms like Instagram, TikTok, Facebook and LinkedIn. On somevideopost.com, you paste a link or upload photos, and AI adds camera movement, transitions, music and a caption — producing a ready-to-post video without filming or editing.",
  },
  {
    q: "How is SoMe AI video different from a template video?",
    a: "Template tools reuse the same static animation for every upload. somevideopost.com's AI analyses your actual photos or listing and builds a unique sequence — choosing shot order, movement and pacing for that specific property or subject — then writes a caption to match, so no two videos look copy-pasted.",
  },
  {
    q: "Which social platforms is it optimized for?",
    a: "Every video is generated with social-first framing and can be exported in 9:16 for Instagram Reels, TikTok and YouTube Shorts, 1:1 for feed posts, and 16:9 for YouTube and websites — so the same source material gets the right shape for each channel.",
  },
  {
    q: "Do I need video editing skills?",
    a: "No. The entire point of SoMe AI video is that you don't touch a timeline or editing software. You provide the input — a link or photos — and AI handles shot selection, movement, music and captioning automatically.",
  },
  {
    q: "Can I generate a SoMe AI video for free?",
    a: "Yes — you can start generating and preview your video before paying anything. See our dedicated guide on how to generate AI video for free for the exact steps and what's included at no cost.",
  },
  {
    q: "Can I publish directly to my social channels?",
    a: "Yes. Connect your Facebook, Instagram, TikTok, LinkedIn and YouTube accounts once, then share or schedule the finished video straight from the somevideopost.com dashboard — or download it and post manually wherever you like.",
  },
];

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

function BenefitCard({ icon: Icon, title, desc, accent }: { icon: React.ElementType; title: string; desc: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]">
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}

export default function SomeAiVideoPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — SoMe AI Video",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "AI tool that turns a link or photos into a social-media-ready video for Instagram, TikTok, Facebook and LinkedIn.",
      featureList: [
        "AI-generated video from a link or uploaded photos",
        "9:16, 1:1 and 16:9 export for every platform",
        "Automatic camera movement, transitions and music",
        "AI-written captions per platform",
        "Direct publishing to Facebook, Instagram, TikTok, LinkedIn and YouTube",
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
        { "@type": "ListItem", position: 2, name: "SoMe AI Video", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Share2 size={11} className="text-orange-300" /> SoMe AI Video
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            SoMe AI Video: turn any link or photo set into
            <br className="hidden sm:block" />{" "}
            <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>scroll-stopping social video</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            SoMe AI video is short for &ldquo;social media AI video&rdquo; — video content that AI creates for you automatically,
            ready for Instagram, TikTok, Facebook and LinkedIn. Paste a link or upload photos, and somevideopost.com
            builds a cinematic clip with movement, music and a caption in minutes. No filming, no editing timeline.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Generate your first AI video <ArrowRight size={16} />
            </Link>
            <Link href="/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Try it free
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is SoMe AI video ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">What is SoMe AI video?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            SoMe AI video is a video generated automatically by artificial intelligence, purpose-built for social media
            feeds — as opposed to a video you film and edit by hand. Instead of hiring a videographer or learning an
            editing app, you give somevideopost.com a starting point (a listing link or a set of photos), and AI does
            the creative work: choosing shot order, adding camera movement and transitions, scoring it with music, and
            writing a caption tuned to the platform you&apos;re posting to.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            It exists because social media rewards video over static images — Reels, TikTok and Shorts consistently get
            more reach and watch time than photo posts — but most people posting for a property, a brand or a small
            business don&apos;t have the time, budget or skill to produce video regularly. SoMe AI video closes that gap.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Wand2 size={12} /> How it works
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">From link or photos to posted video</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Three steps, no editing software required.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Step 1" icon={Link2} title="Paste a link or upload photos" desc="Point somevideopost.com at your listing, product page or a handful of photos. AI pulls in the images and key details automatically." />
            <Step n="Step 2" icon={Sparkles} title="AI generates the video" desc="Camera movement, transitions, background music and a platform-matched caption are added automatically — you can preview it before deciding to unlock it." />
            <Step n="Step 3" icon={Share2} title="Publish or download" desc="Share straight to Facebook, Instagram, TikTok, LinkedIn and YouTube from the dashboard, schedule it for later, or download it in the format you need." />
          </div>
        </div>
      </section>

      {/* ── Formats per platform ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Built for every social format</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              One AI video, exported in the shape each platform actually wants.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="9:16 — Reels, TikTok & Shorts" desc="Full-screen vertical video framed for the platforms that drive the most organic reach today." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Music2} title="1:1 — Feed posts" desc="Square crop optimised for Instagram and Facebook feed placements, where thumb-stopping matters most." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Globe} title="16:9 — YouTube & web" desc="Widescreen export ready for YouTube, LinkedIn video posts, or embedding on your own website." accent="bg-blue-500/15 text-blue-400" />
          </div>
        </div>
      </section>

      {/* ── Why AI video wins on social ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Why AI video wins on social media</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Consistent posting beats occasional perfection — AI makes consistent possible.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Minutes, not days" desc="No shoot to schedule, no editor to brief. Go from a link or photos to a finished video in one sitting." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={TrendingUp} title="Video beats photos" desc="Reels, TikTok and Shorts routinely out-reach static posts — AI video lets you post video every time, not occasionally." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="One asset, five channels" desc="The same generated video is exported and shared to Facebook, Instagram, TikTok, LinkedIn and YouTube from one dashboard." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="No editing skill needed" desc="AI handles pacing, transitions and music, so anyone on the team can publish professional-looking video." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Video} title="Consistent output" desc="Every video follows the same quality bar, so your feed looks cohesive even when different people post to it." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Megaphone} title="Caption included" desc="AI writes a caption to match the video and platform, so a post is ready — not half-finished — the moment the video is." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Who uses SoMe AI video?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Vacation rental & apartment hosts", desc: "Turn a booking-site listing into a presentation video for Instagram and Facebook without touching a camera." },
              { title: "Real estate agents", desc: "Give every new listing a cinematic video the day it goes live — see our dedicated AI video for real estate guide." },
              { title: "Small businesses & local shops", desc: "Post product or storefront photos and get a ready-to-share video for weekly social content." },
              { title: "Marketers managing multiple channels", desc: "Produce a batch of platform-ready videos without briefing an external editor for each one." },
            ].map((u) => (
              <div key={u.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h3 className="font-semibold text-white">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{u.desc}</p>
              </div>
            ))}
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

      <UseCaseLinks current="/some-ai-video" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to create your first SoMe AI video?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Paste a link or upload photos and see your AI video in minutes — preview it free, publish when you&apos;re ready.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Get started <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Curious about pricing? See our <Link href="/priser" className="text-blue-300 underline-offset-2 hover:underline">plans</Link>, read
            {" "}<Link href="/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">why hosts choose somevideopost.com</Link>, or
            browse the <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
