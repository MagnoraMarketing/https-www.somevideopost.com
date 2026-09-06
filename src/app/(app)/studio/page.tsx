import Link from "next/link";
import { getCurrency } from "@/lib/locale-server";
import { formatPriceKey, type PriceKey } from "@/lib/currency";
import {
  Sparkles, Clapperboard, SendHorizontal, UploadCloud, ArrowRight, Crown,
  Film, Camera, Home as HomeIcon, Sun, Mic, Globe, Music, Type,
  Share2, Zap, Target, Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * A tool's badge: either fixed text, or a price from the shared table rendered
 * in the account's currency.
 */
type ToolTag = { text: string } | { price: PriceKey; suffix: string; decimals?: boolean };

type Tool = {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
  tag: ToolTag;
  gradient: string;
};

// The tools that actually exist today — the studio's clickable entry points.
const TOOLS: Tool[] = [
  {
    href: "/posts/new",
    icon: SendHorizontal,
    title: "Generér SoMe-opslag",
    text: "Indsæt et boliglink → AI skriver en sælgende tekst tilpasset platformen.",
    tag: { price: "aiPost" as const, suffix: "/ opslag", decimals: true },
    gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)",
  },
  {
    href: "/videos/new",
    icon: Clapperboard,
    title: "Præsentationsvideo",
    text: "Forvandl boligens billeder til en cinematisk video med kamerabevægelser og musik.",
    tag: { price: "video" as const, suffix: "/ video" },
    gradient: "linear-gradient(135deg,#FFB36B,#FF6B4A)",
  },
  {
    href: "/videos/upload",
    icon: UploadCloud,
    title: "Upload færdig video",
    text: "Har du lavet en video i Veo3? Læg den ind, klar til download og deling.",
    tag: { text: "Gratis" },
    gradient: "linear-gradient(135deg,#34D399,#059669)",
  },
];

// Value proposition — what the studio offers via the underlying AI video models.
const FEATURES = [
  { icon: Film, title: "Image-to-Video" },
  { icon: Camera, title: "Cinematisk kamera" },
  { icon: HomeIcon, title: "Multi-scene tour" },
  { icon: Sun, title: "Realistiske effekter" },
  { icon: Mic, title: "AI-voiceover" },
  { icon: Globe, title: "Multi-sprog" },
  { icon: Music, title: "Musik & lyd" },
  { icon: Type, title: "Auto-undertekster" },
  { icon: Share2, title: "Social-klar eksport" },
  { icon: Sparkles, title: "AI-forbedring" },
  { icon: Zap, title: "Færdig på minutter" },
  { icon: Target, title: "Marketing-optimeret" },
];

export default async function StudioPage() {
  const currency = await getCurrency();
  const videoPrice = formatPriceKey("video", currency);
  const subscriptionPrice = formatPriceKey("subscription", currency);

  /** A tool's price badge, in the account's own currency. */
  function tagText(tag: ToolTag): string {
    if ("text" in tag) return tag.text;
    return `${formatPriceKey(tag.price, currency, tag.decimals ? { decimals: true } : undefined)} ${tag.suffix}`;
  }

  return (
    <div className="min-h-full text-white" style={{ background: "radial-gradient(1200px 500px at 15% -10%, #1b1740 0%, transparent 55%), radial-gradient(1000px 500px at 100% 0%, #10233f 0%, transparent 50%), #080b16" }}>
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#080b16]/80 px-5 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#7C6BFF,#8B5CF6)" }}>
              <Wand2 size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Studio</span>
          </div>
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#7C6BFF,#8B5CF6)" }}
          >
            <Crown size={13} /> Studie-adgang
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        {/* ── Hero ── */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-300">
            <Sparkles size={12} /> Powered by Google Veo 3 & ByteDance Seedance
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Fra boliglink til færdigt<br />
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#FF8A5B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>opslag & cinematisk video</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Dit AI-studie til at markedsføre ferieboliger — sælgende opslag og professionelle præsentationsvideoer, klar til alle sociale medier.
          </p>
        </div>

        {/* ── Tools ── */}
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" style={{ background: t.gradient }} />
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ background: t.gradient }}>
                  <t.icon size={22} className="text-white" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300">{tagText(t.tag)}</span>
              </div>
              <h3 className="text-base font-bold">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t.text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-300">
                Åbn værktøj <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        {/* ── Capabilities ── */}
        <div className="mt-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Hvad studiet kan</h2>
            <span className="text-xs text-slate-500">Drevet af verdens førende AI-modeller</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition-colors hover:bg-white/[0.06]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                  <f.icon size={15} className="text-violet-300" />
                </div>
                <span className="text-sm font-medium text-slate-200">{f.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Access ── */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 p-8" style={{ background: "linear-gradient(135deg, rgba(124,107,255,0.16), rgba(255,107,74,0.12))" }}>
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Crown size={22} className="text-orange-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Studie-adgang — {subscriptionPrice}/md.</h2>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-slate-300">
                  Adgang til studiet og din månedlige opslag-saldo. Præsentationsvideoer betales pr. stk. ({videoPrice}). Opsig når som helst.
                </p>
              </div>
            </div>
            <Link
              href="/billing"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1b1740] shadow-lg transition-transform hover:scale-[1.03]"
            >
              <Sparkles size={15} /> Se adgang & saldo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
