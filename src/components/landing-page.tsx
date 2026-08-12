import Link from "next/link";
import {
  CalendarDays, Share2, Sparkles, Video, Clock, CheckCircle2,
  ArrowRight, Home, Zap, Star, Users,
  TrendingUp, Play, Globe, Link2,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { LANDING, LOCALE_PATHS } from "@/lib/i18n";
import { currencyForLocale, formatPriceKey } from "@/lib/currency";
import { DemoPhoneSwitcher } from "@/components/demo-phone-switcher";
import { WorkflowDemo } from "@/components/workflow-demo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

/* Shared brand tokens for the midnight-blue design */
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";
const PAGE_BG = "#050d24";
const CARD_BG = "#0a1430";
const ELECTRIC_BLUE = "#4d8dff";

function Wordmark({ className = "text-base" }: { className?: string }) {
  return (
    <span className={`font-bold lowercase tracking-tight ${className}`}>
      <span className="text-white">some</span>
      <span style={{ color: ELECTRIC_BLUE }}>video</span>
      <span className="text-orange-400">post</span>
      <span className="text-slate-400">.com</span>
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
      {children}
    </span>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }: { icon: React.ElementType; title: string; desc: string; accent: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]">
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300">
      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
      {children}
    </li>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  );
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
  );
}

/* Channel row with glowing border — mirrors the somevideopost.com hero banner */
function ChannelRow({ icon, name, iconBg, borderColor, glow }: {
  icon: React.ReactNode; name: string; iconBg: string; borderColor: string; glow: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
      style={{ borderColor, boxShadow: `0 0 18px ${glow}, inset 0 0 12px ${glow}` }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: iconBg }}>
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-white">{name}</span>
      <CheckCircle2 size={17} className="text-emerald-400" />
    </div>
  );
}

/* Dashboard mockup styled after the banner: icon toolbar, channel rows,
   property video card and a "Bookings +3" trend tile */
function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg select-none">
      <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />
      <div
        className="relative rounded-2xl border border-blue-400/30 p-4"
        style={{ background: CARD_BG, boxShadow: "0 0 60px rgba(59,130,246,0.25), 0 25px 50px -12px rgba(0,0,0,0.6)" }}
      >
        <div className="mb-3 flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <div className="ml-3 h-4 flex-1 rounded bg-white/5" />
        </div>

        {/* Icon toolbar */}
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/[0.04] p-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_14px_rgba(59,130,246,0.5)]">
            <Link2 size={15} />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-[0_0_14px_rgba(255,107,74,0.45)]" style={{ background: ORANGE_GRADIENT }}>
            Ai
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.45)]">
            <CheckCircle2 size={15} />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_0_14px_rgba(124,58,237,0.45)]">
            <Share2 size={14} />
          </div>
        </div>

        {/* Channel rows */}
        <div className="space-y-2.5">
          <ChannelRow
            icon={<FacebookIcon />}
            name="Facebook"
            iconBg="#1877F2"
            borderColor="rgba(77,141,255,0.45)"
            glow="rgba(59,130,246,0.18)"
          />
          <ChannelRow
            icon={<InstagramIcon />}
            name="Instagram"
            iconBg="linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)"
            borderColor="rgba(221,42,123,0.5)"
            glow="rgba(221,42,123,0.16)"
          />
          <ChannelRow
            icon={<LinkedInIcon />}
            name="LinkedIn"
            iconBg="#0A66C2"
            borderColor="rgba(77,141,255,0.45)"
            glow="rgba(59,130,246,0.18)"
          />
        </div>

        {/* Bottom row: calendar, trend chart, bookings tile */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="flex items-center justify-center rounded-xl bg-white/[0.04] p-3">
            <CalendarDays size={22} className="text-slate-400" />
          </div>
          <div className="flex items-end rounded-xl bg-white/[0.04] p-3">
            <svg viewBox="0 0 80 34" className="h-full w-full" fill="none" aria-hidden>
              <polyline points="2,30 16,24 28,27 42,16 54,20 68,8 78,12" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="68" cy="8" r="2.5" fill="#34d399" />
            </svg>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-3">
            <p className="text-[10px] text-slate-400">Bookings</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-white">+3</p>
              <TrendingUp size={15} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating property video card */}
      <div className="absolute -right-6 -bottom-8 hidden w-44 overflow-hidden rounded-xl border border-blue-400/30 shadow-[0_0_40px_rgba(59,130,246,0.3)] xl:block">
        <div className="relative aspect-[4/5]" style={{ background: "linear-gradient(160deg, #0a1f4d 0%, #071233 100%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050d24]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm ring-1 ring-white/40">
              <Play size={16} className="ml-0.5 text-white" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Testimonial({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
      <div className="mb-3 flex">
        {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-orange-400 text-orange-400" />)}
      </div>
      <p className="text-sm leading-relaxed text-slate-300 italic">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: ORANGE_GRADIENT }}>{name[0]}</div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ locale }: { locale: Locale }) {
  const t = LANDING[locale];
  const currency = currencyForLocale(locale);

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: PAGE_BG }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur" style={{ background: "rgba(5,13,36,0.9)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm text-white" style={{ background: ORANGE_GRADIENT }}>s</span>
            <span className="sm:hidden"><span className="text-base font-bold text-white">some</span></span>
            <span className="hidden sm:inline"><Wordmark /></span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <a href="#" className="hover:text-white transition-colors">{t.navHome}</a>
            <a href="#features" className="hover:text-white transition-colors">{t.navFeatures}</a>
            <a href="#ai" className="hover:text-white transition-colors">{t.navVideo}</a>
            <Link href="/hvorfor-somevideopost" className="hover:text-white transition-colors">Hvorfor os</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/priser" className="hover:text-white transition-colors">{t.navPricing}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={locale} />
            <Link href="/login" className="hidden sm:inline text-sm font-medium text-slate-300 hover:text-white transition-colors">{t.navLogin}</Link>
            <Link href="/signup" className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              {t.navStart}
            </Link>
            <MobileNav dark links={[
              { href: LOCALE_PATHS[locale], label: t.navHome },
              { href: `${LOCALE_PATHS[locale]}#features`, label: t.navFeatures, external: true },
              { href: `${LOCALE_PATHS[locale]}#ai`, label: t.navVideo, external: true },
              { href: "/blog", label: "Blog" },
              { href: "/priser", label: t.navPricing },
              { href: "/login", label: t.navLogin },
            ]} />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        {/* Dot grid, top-left like the banner */}
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        {/* Glowing blue arcs */}
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="pointer-events-none absolute -bottom-64 -left-40 h-[500px] w-[700px] rounded-[100%] border-t border-blue-400/20" style={{ boxShadow: "0 -20px 60px rgba(59,130,246,0.15)" }} />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <Pill><Sparkles size={11} className="text-orange-300" /> AI-powered</Pill>
                <Pill><Globe size={11} /> Social media</Pill>
                <Pill><Video size={11} /> Presentation videos</Pill>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
                {t.heroLine1}<br />{t.heroLine2}<br />
                <span style={{ background: "linear-gradient(90deg, #FFB36B, #FF6B4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroAccent}</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">{t.heroSub}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  {t.heroCta} <ArrowRight size={16} />
                </Link>
                <a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:bg-blue-500/10 transition-colors">
                  {t.heroCta2}
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-400">{t.heroNoCard}</p>
              <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
                {[
                  { icon: Users, val: t.stat1Val, label: t.stat1Label },
                  { icon: TrendingUp, val: t.stat2Val, label: t.stat2Label },
                  { icon: Clock, val: t.stat3Val, label: t.stat3Label },
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
              <div className="relative mx-auto w-full max-w-lg select-none">
                {/* Workflow demo above the dashboard */}
                <div className="mb-4">
                  <WorkflowDemo t={t} />
                </div>
                <HeroMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo bar ── */}
      <div className="border-y border-white/5 py-4" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">{t.worksWith}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Airbnb", "Booking.com", "Novasol", "Facebook", "Instagram", "TikTok", "LinkedIn", "YouTube"].map((p) => (
              <span key={p} className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="relative overflow-hidden py-24">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t.featTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">{t.featSub}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={Video} title={t.feat1Title} desc={t.feat1Desc} accent="bg-orange-500/15 text-orange-400" />
            <FeatureCard icon={Share2} title={t.feat2Title} desc={t.feat2Desc} accent="bg-blue-500/15 text-blue-400" />
            <FeatureCard icon={CalendarDays} title={t.feat3Title} desc={t.feat3Desc} accent="bg-emerald-500/15 text-emerald-400" />
            <FeatureCard icon={Sparkles} title={t.feat4Title} desc={t.feat4Desc} accent="bg-violet-500/15 text-violet-400" />
            <FeatureCard icon={Home} title={t.feat5Title} desc={t.feat5Desc} accent="bg-pink-500/15 text-pink-400" />
            <FeatureCard icon={Zap} title={t.feat6Title} desc={t.feat6Desc} accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── AI Video section ── */}
      <section id="ai" className="relative overflow-hidden py-28" style={{ background: "linear-gradient(160deg, #040a1c 0%, #0a1f4d 50%, #040a1c 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]" style={{ background: "radial-gradient(circle, #FF6B4A, transparent 70%)" }} />
          <div className="absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, #4d8dff, transparent 70%)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
              <Sparkles size={11} /> Powered by Google AI
            </div>
            <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {t.aiTitle1}<br />
              <span style={{ background: "linear-gradient(90deg, #FFB36B, #FF6B4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t.aiTitle2}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">{t.aiSub}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-90 rounded-[2.5rem] opacity-40 blur-2xl" style={{ background: "linear-gradient(135deg, #FFB36B, #FF6B4A)" }} />
                {/* Toggle between the real sample video and the interactive tour */}
                <div className="relative mx-auto w-full max-w-[300px] md:max-w-[340px]">
                  <DemoPhoneSwitcher locale={locale} label={t.aiTitle1} startAt={6} />
                </div>
                <div className="absolute -right-8 top-12 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <p className="text-[10px] font-semibold text-white">9:16 format</p>
                  <p className="text-[9px] text-slate-400">Reels & TikTok</p>
                </div>
                <div className="absolute -left-10 top-80 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <p className="text-[10px] font-semibold text-emerald-400">{t.walkthroughReadyIn}</p>
                  <p className="text-[9px] text-slate-400">{t.walkthroughAiGenerates}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {([
                  { n: "01", title: t.step1Title, desc: t.step1Desc },
                  { n: "02", title: t.step2Title, desc: t.step2Desc },
                  { n: "03", title: t.step3Title, desc: t.step3Desc },
                ] as const).map((step) => (
                  <div key={step.n} className="flex gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                    <div className="shrink-0">
                      <span className="text-2xl font-bold" style={{ background: "linear-gradient(135deg, #FFB36B, #FF6B4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{step.n}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{step.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "3×", label: t.aiStat1 },
                  { value: "15 min", label: t.aiStat2 },
                  { value: "9:16", label: t.aiStat3 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                    <p className="text-xl font-bold text-white">{s.value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">{t.aiOnetimeLabel}</p>
                  <p className="text-3xl font-bold text-white">{formatPriceKey("video", currency)} <span className="text-sm font-normal text-slate-400">/ video</span></p>
                </div>
                <Link href="/signup" className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #FFB36B, #FF6B4A)" }}>
                  {t.aiOrderBtn}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {t.aiFeats.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-300">
                <CheckCircle2 size={11} className="text-orange-400" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t.howTitle}</h2>
            <p className="mt-3 text-slate-400">{t.howSub}</p>
          </div>
          <div className="relative grid gap-10 md:grid-cols-3">
            <div className="absolute left-1/6 right-1/6 top-7 hidden h-px bg-gradient-to-r from-blue-400/10 via-blue-400/40 to-blue-400/10 md:block" />
            {([
              { n: "1", icon: Home, title: t.how1Title, desc: t.how1Desc },
              { n: "2", icon: Video, title: t.how2Title, desc: t.how2Desc },
              { n: "3", icon: Zap, title: t.how3Title, desc: t.how3Desc },
            ] as const).map((s) => (
              <div key={s.n} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
                  {s.n}
                </div>
                <s.icon size={22} className="mx-auto mb-2 text-blue-300" />
                <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{t.testTitle}</h2>
            <p className="mt-3 text-slate-400">{t.testSub}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Testimonial name={t.test1Name} role={t.test1Role} quote={t.test1Quote} />
            <Testimonial name={t.test2Name} role={t.test2Role} quote={t.test2Quote} />
            <Testimonial name={t.test3Name} role={t.test3Role} quote={t.test3Quote} />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t.priceTitle}</h2>
            <p className="mt-3 text-slate-400">{t.priceSub}</p>
          </div>
          <div className="mx-auto grid max-w-3xl items-start gap-6 md:grid-cols-2">
            {/* Studio access — subscription */}
            <div className="relative rounded-2xl border border-blue-400/50 bg-white/[0.05] p-8 shadow-[0_0_45px_rgba(59,130,246,0.25)] backdrop-blur-sm">
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={12} /> {t.plan1Name}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{formatPriceKey("subscription", currency)}</span>
                <span className="text-slate-400">{t.perMonth}</span>
              </div>
              <p className="text-xs text-slate-500">incl. VAT</p>
              <ul className="my-7 flex flex-col gap-2.5">
                {t.plan1Items.map((item) => <Check key={item}>{item}</Check>)}
              </ul>
              <Link href="/signup" className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
                {t.startFreeBtn}
              </Link>
            </div>

            {/* Presentation video — pay per use */}
            <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.06] p-8 backdrop-blur-sm">
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
                <Video size={12} /> {t.plan2Name}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{formatPriceKey("video", currency)}</span>
                <span className="text-slate-400">{t.videoAddonPer}</span>
              </div>
              <p className="text-xs text-slate-500">{t.plan2PayLabel}</p>
              <ul className="my-7 flex flex-col gap-2.5">
                {t.plan2Items.map((item) => <Check key={item}>{item}</Check>)}
              </ul>
              <Link href="/signup" className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                {t.planProCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── "So easy" illustrated band + CTA ── */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-600">
              <Sparkles size={12} /> {t.demoStep2}
            </span>
            <h2 className="text-3xl font-bold text-[#1B3F7A] md:text-4xl">{t.easyTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">{t.easySub}</p>
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {([
              { icon: Link2, color: "#1B3F7A", bg: "#EEF3FB", n: "1", title: t.demoStep1, desc: t.step1Desc },
              { icon: Sparkles, color: "#FF6B4A", bg: "#FFF4F1", n: "2", title: t.demoStep2, desc: t.step2Desc },
              { icon: Share2, color: "#7C3AED", bg: "#F5F0FF", n: "3", title: t.demoStep4, desc: t.step3Desc },
            ] as const).flatMap((s, i) => {
              const card = (
                <div key={s.n} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: s.bg }}>
                      <s.icon size={26} style={{ color: s.color }} />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow" style={{ background: s.color }}>
                      {s.n}
                    </span>
                  </div>
                  <h3 className="mb-1.5 font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              );
              if (i === 2) return [card];
              return [
                card,
                <div key={`arrow-${i}`} className="flex items-center justify-center">
                  <ArrowRight size={22} className="hidden text-slate-300 md:block" />
                  <div className="h-6 w-px bg-slate-200 md:hidden" />
                </div>,
              ];
            })}
          </div>

          {/* Call to action */}
          <div className="mt-12 flex flex-col items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #FFB36B, #FF6B4A)" }}
            >
              {t.easyCtaBtn} <ArrowRight size={18} />
            </Link>
            <p className="mt-3 text-sm text-slate-400">{t.ctaNoCard}</p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium">
            <Sparkles size={11} className="text-orange-300" /> {t.ctaBadge}
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">{t.ctaTitle1}<br />{t.ctaTitle2}</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">{t.ctaSub}</p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
          <p className="mt-3 text-sm text-slate-400">{t.ctaNoCard}</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5" style={{ background: "#04091c" }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: ORANGE_GRADIENT }}>s</span>
                <Wordmark />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.footerDesc}</p>
              <div className="mt-5 flex gap-3">
                <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-blue-400/40 hover:text-blue-300">
                  <FacebookIcon size={15} />
                </a>
                <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-blue-400/40 hover:text-blue-300">
                  <InstagramIcon size={15} />
                </a>
                <a href="#" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-blue-400/40 hover:text-blue-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{t.footerProduct}</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li><a href="#features" className="transition-colors hover:text-white">{t.footerFeatures}</a></li>
                <li><a href="#ai" className="transition-colors hover:text-white">{t.footerAiVideo}</a></li>
                <li><Link href="/hvorfor-somevideopost" className="transition-colors hover:text-white">Hvorfor somevideopost.com</Link></li>
                <li><Link href="/priser" className="transition-colors hover:text-white">{t.footerPricing}</Link></li>
                <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
                <li><Link href="/signup" className="transition-colors hover:text-white">{t.footerCreateAccount}</Link></li>
                <li><Link href="/login" className="transition-colors hover:text-white">{t.footerLogin}</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">AI Video</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li><Link href="/some-ai-video" className="transition-colors hover:text-white">SoMe AI Video</Link></li>
                <li><Link href="/ai-video-for-real-estate" className="transition-colors hover:text-white">AI Video for Real Estate</Link></li>
                <li><Link href="/ai-video-for-apartment" className="transition-colors hover:text-white">AI Video for Apartment</Link></li>
                <li><Link href="/generate-ai-video-free" className="transition-colors hover:text-white">Generate AI Video Free</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{t.footerIntegrations}</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                {["Airbnb", "Booking.com", "Facebook & Instagram", "TikTok", "LinkedIn"].map((p) => (
                  <li key={p}><span className="cursor-default">{p}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{t.footerSupport}</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li><a href="mailto:mail@somevideopost.com" className="transition-colors hover:text-white">mail@somevideopost.com</a></li>
                <li><Link href="/signup" className="transition-colors hover:text-white">{t.plan2StartBtn}</Link></li>
              </ul>
              <div className="mt-6 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
                <p className="text-xs font-semibold text-orange-400">{t.footerTryFree}</p>
                <p className="mt-1 text-xs text-slate-400">{t.footerNoCard}</p>
                <Link href="/signup" className="mt-3 block w-full rounded-lg py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  {t.footerStartBtn}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/5 pt-8 md:flex-row md:justify-between">
            <p className="text-xs text-slate-600">{t.footerCopyright}</p>
            <div className="flex gap-6 text-xs text-slate-600">
              <a href="#" className="transition-colors hover:text-slate-400">{t.footerPrivacy}</a>
              <a href="#" className="transition-colors hover:text-slate-400">{t.footerCookies}</a>
              <a href="#" className="transition-colors hover:text-slate-400">{t.footerTerms}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
