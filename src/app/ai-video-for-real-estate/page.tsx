import type { Metadata } from "next";
import Link from "next/link";
import {
  Home, Sparkles, Video, Link2, Wand2, ArrowRight,
  Building, KeyRound, Camera, Megaphone, ShieldCheck, Rocket,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/ai-video-for-real-estate`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "AI Video for Real Estate & Estate Listings | somevideopost.com",
  description:
    "AI video for real estate: turn a listing link or property photos into a cinematic presentation video in minutes. Built for agents, agencies and property managers marketing estates, homes and apartments.",
  keywords:
    "AI video for estate, AI video for real estate, real estate video generator, AI property video, listing video AI, estate marketing video, AI walkthrough video, real estate social media video, property presentation video",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AI Video for Real Estate & Estate Listings",
    description:
      "Turn a listing link or property photos into a cinematic presentation video in minutes — built for agents, agencies and property managers.",
    type: "website",
    siteName: "somevideopost.com",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video for Real Estate & Estate Listings",
    description:
      "Turn a listing link or property photos into a cinematic presentation video in minutes.",
  },
};

const FAQ = [
  {
    q: "What is AI video for real estate?",
    a: "AI video for real estate (or \"AI video for estate\") is a presentation video generated automatically from a property listing or photos, instead of being filmed by a videographer. somevideopost.com reads your listing link or uploaded photos and builds a cinematic video with camera movement, room-by-room flow, transitions and music — ready in minutes.",
  },
  {
    q: "Can I use my existing listing photos?",
    a: "Yes. Paste a link to your listing on a portal or booking site and somevideopost.com pulls in the existing photos, title, price and key details automatically — or upload your own property photos directly if the listing isn't online yet.",
  },
  {
    q: "Does it work for any type of property?",
    a: "Yes — apartments, single-family homes, holiday homes, new developments and commercial listings all work the same way: give the AI a link or photos, and it adapts the pacing and shot order to the number and type of rooms it has to work with.",
  },
  {
    q: "How long does it take to get a video?",
    a: "Most presentation videos are ready in under 15 minutes. You can watch the video build in the dashboard and preview it before deciding whether to unlock the final download.",
  },
  {
    q: "Can I brand the video or add my agency's details?",
    a: "The video is generated around your property content, and the caption and post text are written to match your listing, so it's ready to publish under your own page or profile — you stay in full control of where and how it's shared.",
  },
  {
    q: "Is there a free way to try it before paying for a listing video?",
    a: "Yes — you can generate and preview a video before paying anything. See our guide on how to generate AI video for free for the exact steps.",
  },
  {
    q: "Can I share the video directly to social media?",
    a: "Yes. Connect Facebook, Instagram, TikTok, LinkedIn and YouTube once, then publish or schedule the finished listing video straight from the dashboard — or download it in 9:16, 1:1 or 16:9 for your website, MLS listing or email campaigns.",
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

export default function AiVideoForRealEstatePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — AI Video for Real Estate",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "AI tool that turns a real estate listing link or property photos into a cinematic presentation video for agents, agencies and property managers.",
      featureList: [
        "AI-generated video from a listing link or property photos",
        "Automatic room-by-room camera movement and transitions",
        "Works for apartments, homes, holiday lets and new developments",
        "9:16, 1:1 and 16:9 export for social, web and MLS",
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
        { "@type": "ListItem", position: 2, name: "AI Video for Real Estate", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />
      <SiteHeader locale="en" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Home size={11} className="text-orange-300" /> AI Video for Real Estate
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Turn every listing into a
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>cinematic AI video</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                AI video for real estate turns a listing link or a set of property photos into a professional
                presentation video — with camera movement, room-by-room flow and music — in under 15 minutes.
                No videographer, no editing software, no waiting days for a shoot.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Create a listing video <ArrowRight size={16} />
                </Link>
                <Link href="/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Try it free
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Home} roomLabel="Living Room" title="123 MAPLE AVE · 3 BED" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for real estate ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">What is AI video for real estate?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            AI video for real estate — sometimes searched as &ldquo;AI video for estate&rdquo; — is a property
            presentation video created automatically by artificial intelligence instead of a camera crew. You give
            somevideopost.com a listing link or upload photos of the property, and AI builds a video that moves
            through the rooms in a natural sequence, adding cinematic camera motion, transitions and background
            music, then generates a caption suited to the listing.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            It matters because listings with video consistently get more views and engagement than photo-only
            listings — but booking a videographer for every property is slow and expensive. AI video gives agents,
            agencies and property managers a way to add video to every listing, not just the flagship ones.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">From listing to video in three steps</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Step 1" icon={Link2} title="Paste your listing link" desc="AI pulls in the photos, title, price, size and location from your existing listing — or upload your own property photos." />
            <Step n="Step 2" icon={Camera} title="AI builds the walkthrough" desc="The property is sequenced room by room with camera movement, transitions and music, tailored to how many photos you provide." />
            <Step n="Step 3" icon={Megaphone} title="Publish or download" desc="Share directly to your social channels, embed on your listing page, or download in 9:16, 1:1 or 16:9 for wherever you market the property." />
          </div>
        </div>
      </section>

      {/* ── Benefits for agents ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Built for agents, agencies & property managers</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Give every listing video-quality marketing, not just your top properties.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Rocket} title="List with video from day one" desc="Generate a video the moment a listing goes live instead of waiting on a videographer's schedule." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Building} title="Works for any property type" desc="Apartments, houses, new developments and holiday lets — the AI adapts to the rooms and photos you give it." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={KeyRound} title="Scale across your whole portfolio" desc="Produce a video for every listing, not just the flagship ones, without adding to your marketing budget per property." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Video} title="Stand out from photo-only listings" desc="Video listings get more attention in crowded feeds and portals than a static photo carousel." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="You control the details" desc="You choose what's shown and how it's captioned before you publish — nothing goes live automatically." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Sparkles} title="Ready for socials & MLS" desc="Export vertical video for Reels and TikTok, and widescreen for your website or listing portal, from one generated video." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Real estate use cases</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "\"Just listed\" announcements", desc: "Post a cinematic video the same day a new listing goes live, instead of days or weeks later." },
              { title: "Open house teasers", desc: "Generate a short video to promote an upcoming open house on social media." },
              { title: "Apartment & rental listings", desc: "Focused on interiors and layout — see our dedicated AI video for apartment guide." },
              { title: "Holiday home & short-term rental marketing", desc: "Turn a booking-site listing into a presentation video without a dedicated photo shoot." },
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
      <section className="py-24">
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

      <UseCaseLinks current="/ai-video-for-real-estate" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Give your next listing an AI video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Paste your listing link and preview the video free — publish or download when you&apos;re happy with it.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Get started <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            See our <Link href="/priser" className="text-blue-300 underline-offset-2 hover:underline">pricing</Link>, read
            {" "}<Link href="/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">why hosts choose somevideopost.com</Link>, or
            browse the <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="en" />
    </div>
  );
}
