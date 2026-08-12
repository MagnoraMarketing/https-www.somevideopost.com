import type { Metadata } from "next";
import Link from "next/link";
import {
  Link2, Sparkles, Video, Share2, Download, LayoutDashboard,
  CheckCircle2, ArrowRight, Clock, TrendingUp, Wand2, CalendarDays,
  Play, MonitorSmartphone, Rocket,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { WorkflowDemo } from "@/components/workflow-demo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { LANDING } from "@/lib/i18n";

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/en/hvorfor-somevideopost`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Why somevideopost.com? AI video & automatic social media sharing",
  description:
    "somevideopost.com is the dashboard where hosts go from property link to finished AI video and a selling post in minutes — and share automatically to Facebook, Instagram, TikTok and LinkedIn, or download in every format. See why thousands choose somevideopost.com.",
  keywords:
    "why somevideopost, somevideopost.com, AI video vacation rental, automatic social media sharing, share video Facebook Instagram TikTok, download property video, AI presentation video, social media dashboard for hosts, property link to video, AI social post",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      da: `${BASE}/hvorfor-somevideopost`,
      en: PAGE_URL,
      es: `${BASE}/es/hvorfor-somevideopost`,
      de: `${BASE}/de/hvorfor-somevideopost`,
      "x-default": `${BASE}/hvorfor-somevideopost`,
    },
  },
  openGraph: {
    title: "Why somevideopost.com? AI video & automatic social media sharing",
    description:
      "From property link to finished AI video and post in minutes. Share automatically to Facebook, Instagram, TikTok and LinkedIn — or download in every format. One easy-to-use dashboard.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "en_GB",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "What is somevideopost.com?",
    a: "somevideopost.com is an AI platform for hosts of vacation rentals, private apartments and hotels. You paste a link to your listing or upload photos, and AI automatically creates a professional presentation video and a selling post — ready to share on social media or download.",
  },
  {
    q: "How fast is an AI video ready?",
    a: "Most presentation videos are finished in under 15 minutes. You simply paste a property link or upload your photos, pick a style, and AI generates a video with camera movement, transitions and music while you follow progress live in the dashboard.",
  },
  {
    q: "Can I share directly to Facebook, Instagram, TikTok and LinkedIn?",
    a: "Yes. From the dashboard you connect your channels once, then share posts and videos to Facebook, Instagram, TikTok, LinkedIn and YouTube with one click — or schedule them for the best time. You can always download the video and use it wherever you like, too.",
  },
  {
    q: "Can I download the video?",
    a: "Yes. Every video can be downloaded in high resolution and the right formats — 9:16 for Reels and TikTok, 1:1 for feed, and 16:9 for YouTube and websites — so you fully own the material.",
  },
  {
    q: "Do I need video editing skills to use it?",
    a: "No. The whole point of somevideopost.com is that you don't need technical knowledge or video editing skills. AI does the heavy lifting, and the easy-to-use dashboard turns the rest into a few clicks.",
  },
  {
    q: "What does it cost?",
    a: "Studio access costs €10/mo and gives you 15 AI posts a month plus direct social media sharing. Presentation videos are billed separately, per video — €50 each — so you only pay for the videos you actually make. No commitment. See full details on the pricing page.",
  },
];

const SOCIALS = [
  { name: "Facebook", color: "#1877F2", letter: "f" },
  { name: "Instagram", color: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)", letter: "IG" },
  { name: "TikTok", color: "#010101", letter: "TT" },
  { name: "LinkedIn", color: "#0A66C2", letter: "in" },
  { name: "YouTube", color: "#FF0000", letter: "YT" },
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

export default function WhySomeVideoPostEnPage() {
  const t = LANDING.en;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: BASE,
      description:
        "AI platform that creates presentation videos and selling posts for hosts and shares them automatically to social media.",
      offers: [
        { "@type": "Offer", name: "Studio access", price: "10", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Presentation video", price: "50", priceCurrency: "EUR" },
      ],
      featureList: [
        "AI-generated presentation videos",
        "Automatic sharing to Facebook, Instagram, TikTok, LinkedIn and YouTube",
        "Selling posts generated from a property link",
        "Download in 9:16, 1:1 and 16:9",
        "Easy-to-use dashboard for scheduling and sharing",
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
        { "@type": "ListItem", position: 2, name: "Why somevideopost.com", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />

      <SiteHeader active="why" locale="en" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Sparkles size={11} className="text-orange-300" /> Why somevideopost.com?
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                AI creates stunning videos<br />
                <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in a matter of minutes</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                somevideopost.com is one easy-to-use dashboard where you go from property link to finished
                presentation video and selling post — and share automatically on every social platform or
                download in the format you need. No video editing, no technical knowledge.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Get started today <ArrowRight size={16} />
                </Link>
                <Link href="/en/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  See pricing
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
                {[
                  { icon: Clock, val: "< 15 min", label: "Video delivered" },
                  { icon: TrendingUp, val: "up to 80%", label: "More bookings with video" },
                  { icon: Share2, val: "5 channels", label: "Share with one click" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon size={15} className="text-orange-300" />
                    <div>
                      <p className="text-sm font-bold text-white">{s.val}</p>
                      <p className="text-[11px] text-slate-400">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />
                <div className="relative">
                  <WorkflowDemo t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 1: Paste a property link or upload photos ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Link2 size={12} /> How it works
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Paste a property link or upload photos</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Start wherever you are. Paste the link to your listing from Airbnb, Booking.com or Novasol — or
              upload your own photos. AI handles the rest, while you follow along in the dashboard.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Step 1" icon={Link2} title="Paste a link or upload" desc="AI automatically fetches photos, title, price, size and location from your existing listing — or use your own photos." />
            <Step n="Step 2" icon={Wand2} title="AI generates video & post" desc="A cinematic presentation video and a selling post are created automatically, tailored to each platform in the right tone and length." />
            <Step n="Step 3" icon={Share2} title="Share or download" desc="Share with one click to all your channels, schedule for the best time — or download the video in full resolution." />
          </div>
        </div>
      </section>

      {/* ── AI creates stunning videos ── */}
      <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(160deg, #040a1c 0%, #0a1f4d 50%, #040a1c 100%)" }}>
        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]" style={{ background: "radial-gradient(circle, #FF6B4A, transparent 70%)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
                <Video size={12} /> AI video generation
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Professional property videos — no photographer needed</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                AI adds smooth camera movement, cinematic transitions and background music to your photos and
                creates a stunning presentation video in minutes. You follow progress live in the dashboard —
                from &ldquo;AI generating&rdquo; to &ldquo;Ready&rdquo;.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Cinematic camera movement and transitions automatically",
                  "9:16 optimised for Reels, TikTok and Shorts",
                  "Background music and captions tailored to the property",
                  "Delivered directly in the app, ready to share",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-orange-500/10 blur-3xl" />
              {/* Video generation panel mirroring the product dashboard */}
              <div className="relative rounded-2xl border border-blue-400/30 p-5" style={{ background: "#0a1430", boxShadow: "0 0 50px rgba(59,130,246,0.2)" }}>
                <div className="mb-4 flex items-center gap-2">
                  <Video size={16} className="text-orange-400" />
                  <span className="font-semibold text-white">Video generation</span>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: Link2, label: "Paste link", done: true },
                    { icon: Sparkles, label: "AI generates", done: true, active: true },
                    { icon: CheckCircle2, label: "Ready!", done: false },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: s.active ? ORANGE_GRADIENT : s.done ? "#2563eb" : "rgba(255,255,255,0.08)" }}>
                        <s.icon size={15} />
                      </div>
                      <span className="text-[10px] text-slate-400">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">AI video generating</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, #4d8dff, #22d3ee)" }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Processing photos … 75%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── User-friendly dashboard ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            <LayoutDashboard size={12} /> One dashboard for everything
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">An easy-to-use dashboard to share everything in one place</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Create, schedule, share and download — without jumping between apps. The dashboard brings your
            properties, videos, posts and channels together in one place, so you have full oversight and
            control with just a few clicks.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="Everything in one place" desc="Properties, videos, posts and connected channels in one clear dashboard — on mobile too." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={CalendarDays} title="Schedule for the right time" desc="Schedule posts and videos so they land when your audience is most active." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Rocket} title="Built for speed" desc="From property link to shared content in minutes. No learning curve — designed for busy hosts." accent="bg-orange-500/15 text-orange-400" />
          </div>
        </div>
      </section>

      {/* ── Automatic sharing to socials ── */}
      <section className="relative overflow-hidden py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
              <Share2 size={12} /> Automatic sharing
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Share automatically on every social platform</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Connect your channels once, then share posts and videos to every platform with one click — or
              let the scheduler do it for you.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SOCIALS.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: s.color }}>
                  {s.letter}
                </div>
                <span className="flex-1 text-sm font-medium text-white">{s.name}</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Downloads ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
                <Download size={12} /> Download & ownership
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Download in every format — the content is yours</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Want to use the video in an email, on your website or in an ad? Download it in high resolution
                in exactly the format you need. You fully own the material and can use it wherever you like.
              </p>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
                Get started <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { ratio: "9:16", use: "Reels & TikTok", box: "aspect-[9/16]" },
                { ratio: "1:1", use: "Feed", box: "aspect-square" },
                { ratio: "16:9", use: "YouTube & web", box: "aspect-video" },
              ].map((f) => (
                <div key={f.ratio} className="flex flex-col items-center gap-2">
                  <div className={`w-full ${f.box} flex items-center justify-center rounded-xl border border-blue-400/30 bg-white/[0.04]`} style={{ boxShadow: "0 0 18px rgba(59,130,246,0.12)" }}>
                    <Play size={18} className="text-blue-300" fill="currentColor" />
                  </div>
                  <p className="text-sm font-bold text-white">{f.ratio}</p>
                  <p className="text-[11px] text-slate-400">{f.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why choose (benefits) ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Why hosts choose somevideopost.com</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Everything you need to market your property professionally — in one tool.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Save hours every week" desc="Automation means you go from idea to shared content in minutes instead of hours." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Video} title="Professional quality" desc="Cinematic videos and sharp posts that make your property stand out — without an agency." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Be present everywhere" desc="One property, every channel. Facebook, Instagram, TikTok, LinkedIn and YouTube at once." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="AI that understands properties" desc="Text and video are optimised for the rental industry — with the right tone for each platform." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={TrendingUp} title="More bookings" desc="Listings with video get more views and convert better. Give your listing the format that sells." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Download} title="Full ownership" desc="Download everything in high resolution and use it wherever you like — the content is yours." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      <UseCaseLinks locale="en" />

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-slate-400">Everything you need to know about somevideopost.com.</p>
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

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to market your property on autopilot?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Go from property link to finished video and post in minutes. Studio access from €10/mo, videos from €50 each.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Get started today <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Want to read more? See our <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog & guides</Link> or <Link href="/en/priser" className="text-blue-300 underline-offset-2 hover:underline">pricing</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="en" />
    </div>
  );
}
