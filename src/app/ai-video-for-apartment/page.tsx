import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2, Video, Link2, Wand2, ArrowRight,
  Sofa, DoorOpen, Ruler, Camera, ShieldCheck, Timer,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/ai-video-for-apartment`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "AI Video for Apartment Listings & Interiors | somevideopost.com",
  description:
    "AI video for apartments turns photos or a listing link into an interior-focused presentation video — built for apartment rentals, property managers and short-term let hosts marketing units.",
  keywords:
    "AI video for apartment, apartment video generator, AI apartment interior video, apartment listing video, apartment marketing video, AI video apartment rental, property management video AI",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AI Video for Apartment Listings & Interiors",
    description:
      "Turn apartment photos or a listing link into an interior-focused presentation video in minutes — built for rentals, property managers and short-term let hosts.",
    type: "website",
    siteName: "somevideopost.com",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video for Apartment Listings & Interiors",
    description: "Turn apartment photos into an interior-focused AI video in minutes.",
  },
};

const FAQ = [
  {
    q: "What is AI video for apartments?",
    a: "AI video for apartments is a presentation video generated automatically from apartment photos or a listing link, with the pacing and camera movement tuned to interior spaces — living areas, kitchens, bedrooms and bathrooms — rather than exterior grounds. somevideopost.com builds it from what you already have: photos or a listing, no filming required.",
  },
  {
    q: "Does it work for a single unit or a whole building?",
    a: "Both. Generate one video for a single apartment listing, or run it for every available unit in a building — each video is generated from that unit's own photos, so no two look identical.",
  },
  {
    q: "What if I only have a few photos?",
    a: "That's fine — AI adapts the video's pacing and shot count to how many photos you provide, whether that's 4 or 40. More photos generally produce a fuller room-by-room flow, but a handful is enough for a usable video.",
  },
  {
    q: "Can I use it for furnished or unfurnished units?",
    a: "Yes. The AI works with whatever the photos show — furnished, staged or empty — building camera movement and transitions around the actual images you provide rather than a generic template.",
  },
  {
    q: "Is it useful for property management companies with many units?",
    a: "Yes — it's built for exactly that. Instead of budgeting a video shoot per vacancy, you can generate a video for each unit as it becomes available, keeping every listing current without a recurring production cost.",
  },
  {
    q: "Can I try it for free before paying for an apartment video?",
    a: "Yes — you can generate and preview the video before paying anything. See our guide on how to generate AI video for free for the exact steps.",
  },
  {
    q: "Where can I use the finished video?",
    a: "Publish directly to Facebook, Instagram, TikTok, LinkedIn and YouTube from the dashboard, or download it in 9:16, 1:1 or 16:9 for your rental listing page, property portal or email marketing.",
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

export default function AiVideoForApartmentPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — AI Video for Apartments",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "AI tool that turns apartment photos or a listing link into an interior-focused presentation video for rentals, property managers and short-term let hosts.",
      featureList: [
        "AI-generated video from apartment photos or a listing link",
        "Interior-focused camera movement and room-by-room flow",
        "Works for single units or whole buildings",
        "9:16, 1:1 and 16:9 export for social and listing pages",
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
        { "@type": "ListItem", position: 2, name: "AI Video for Apartment", item: PAGE_URL },
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
                <Building2 size={11} className="text-orange-300" /> AI Video for Apartment
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Apartment photos in,
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>interior video out</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                AI video for apartments turns interior photos or a listing link into a presentation video that flows
                naturally through living areas, kitchen, bedrooms and bathrooms — built for rentals, property
                management and short-term lets, ready in under 15 minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Create an apartment video <ArrowRight size={16} />
                </Link>
                <Link href="/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Try it free
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Sofa} roomLabel="Kitchen" title="UNIT 4B · DOWNTOWN LOFT" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for apartments ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">What is AI video for apartments?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            AI video for apartments is a presentation video built automatically from what you already have — photos
            of the unit or a link to your listing — with somevideopost.com adding camera movement, transitions and
            music tuned to interior spaces. Rather than exterior shots and drone footage, the pacing focuses on how a
            layout actually flows: entrance, living room, kitchen, bedrooms and bathroom.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            It&apos;s built for apartment listings specifically because apartment marketing lives or dies on how well a
            layout comes across — and a slow scroll through a photo carousel rarely does that justice the way a short
            walkthrough-style video can.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">From apartment photos to video, in three steps</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Step 1" icon={Link2} title="Add photos or a listing link" desc="Upload interior photos of the unit, or paste a link to an existing listing so AI can pull them in automatically." />
            <Step n="Step 2" icon={Sofa} title="AI flows through the layout" desc="Camera movement and transitions are sequenced room by room — living space, kitchen, bedrooms, bathroom — with music added automatically." />
            <Step n="Step 3" icon={DoorOpen} title="Publish or download" desc="Share to your social channels directly, or download in the format you need for your rental listing page or portal." />
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Built for apartment rentals & property management</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Give every unit a video, without a per-listing production budget.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Timer} title="Fill vacancies faster" desc="Get a video live the same day a unit becomes available, instead of waiting on a photographer's schedule." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Ruler} title="Shows the layout, not just rooms" desc="Sequenced room-by-room flow gives renters a sense of how the space actually connects." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Building2} title="Scales across a whole building" desc="Generate a video per unit as vacancies open, without a recurring per-listing production cost." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Camera} title="Works with the photos you have" desc="Furnished, staged or empty — AI adapts to whatever images you upload, no professional shoot required." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="You approve before it's public" desc="Preview the video before publishing or downloading — nothing is posted without your review." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Video} title="Ready for every channel" desc="Export vertical video for Reels and TikTok, square for feed, or widescreen for your listing page or portal." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Apartment use cases</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Long-term rental listings", desc: "Turn interior photos into a video that helps a listing stand out on rental portals and social media." },
              { title: "Short-term & holiday lets", desc: "Present the apartment the way guests browse — a quick, visual walkthrough rather than a photo grid." },
              { title: "New developments & pre-leasing", desc: "Market show-unit or staged apartments with video before a building is fully occupied." },
              { title: "Property management portfolios", desc: "Standardise how every vacant unit is marketed, unit by unit, as availability changes." },
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

      <UseCaseLinks current="/ai-video-for-apartment" locale="en" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Give your next vacant unit a video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Upload photos or paste a listing link and preview your apartment video free.
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
