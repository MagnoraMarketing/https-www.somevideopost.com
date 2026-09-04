import Link from "next/link";
import { Plus, Sparkles, Share2, TrendingUp, Star, Zap, Play, Clapperboard, Download, Users, ChevronDown, UploadCloud } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { createClient } from "@/lib/supabase/server";
import { getCurrency } from "@/lib/locale-server";
import { formatPriceKey } from "@/lib/currency";
import type { VideoOrder } from "@/types/database";
import { VideoDemo } from "@/components/video-demo";
import { VideoListPoller } from "@/components/video-list-poller";
import { VideoOrderCard } from "@/components/video-order-card";
import { PresentationVideo } from "@/components/presentation-video";

async function getVideoOrders(): Promise<VideoOrder[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("video_orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as VideoOrder[];
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-48">
      <div className="relative rounded-[2.5rem] border-4 border-slate-800 bg-slate-800 shadow-2xl">
        <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-slate-700" />
        <div className="overflow-hidden rounded-[2rem] bg-black aspect-[9/16]">
          {/* Mock video content */}
          <div className="relative h-full w-full" style={{ background: "linear-gradient(160deg, #1B3F7A 0%, #0f2347 40%, #FF6B4A 100%)" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
              <div className="h-24 w-full rounded-xl bg-white/10 backdrop-blur-sm" />
              <div className="h-16 w-full rounded-xl bg-white/10 backdrop-blur-sm" />
              <div className="h-16 w-full rounded-xl bg-white/10 backdrop-blur-sm" />
            </div>
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <div className="ml-1 h-0 w-0 border-y-8 border-l-12 border-y-transparent border-l-[#1B3F7A]" style={{ borderLeftWidth: 14, borderTopWidth: 8, borderBottomWidth: 8 }} />
              </div>
            </div>
            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-[2rem] bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="h-2 w-3/4 rounded bg-white/60 mb-1.5" />
              <div className="h-1.5 w-1/2 rounded bg-white/40" />
            </div>
          </div>
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -inset-4 -z-10 rounded-[3rem] opacity-30 blur-2xl" style={{ background: "linear-gradient(135deg, #FFB36B, #FF6B4A)" }} />
    </div>
  );
}

function PracticalInfo() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <h2 className="mb-3 text-sm font-bold text-slate-900">Praktisk info om dine videoer</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <Share2 size={18} className="text-[#1B3F7A]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">Del på din Facebook-side</p>
            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">Download videoen og upload den direkte til din Facebook-side — eller kopier linket og indsæt det i et opslag.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100">
            <Users size={18} className="text-[#FF6B4A]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">Del i Facebook-grupper</p>
            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">Del videoen direkte i udlejningsgrupper på Facebook for at nå lejere, der aktivt søger bolig.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
            <Download size={18} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">Download til din enhed</p>
            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">Klik på download-ikonet på din video for at gemme den lokalt og del den på Instagram, TikTok eller YouTube.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Hvordan deler jeg videoen på min Facebook-side?",
    a: "Download videoen ved at klikke på download-ikonet. Gå derefter til din Facebook-side, opret et nyt opslag og upload videoen direkte. Du kan også kopiere videolinket og indsætte det i et Facebook-opslag.",
  },
  {
    q: "Kan jeg dele videoen i Facebook-grupper?",
    a: "Ja! Download videoen og gå ind i en udlejningsgruppe på Facebook. Opret et nyt opslag i gruppen og upload videoen — det er en effektiv måde at nå lejere, der aktivt søger bolig.",
  },
  {
    q: "Hvilke platforme kan jeg dele på?",
    a: "Du kan dele din video på Facebook (side og grupper), Instagram (Reels og feed), TikTok, YouTube Shorts og LinkedIn. Download videoen og upload den til den ønskede platform.",
  },
  {
    q: "Hvad er videoens format og opløsning?",
    a: "Videoerne leveres i 9:16 format (lodret) og egner sig perfekt til Instagram Reels, TikTok og Facebook Stories. Opløsningen er HD-kvalitet klar til deling på alle platforme.",
  },
  {
    q: "Hvor lang tid tager det at generere en video?",
    a: "De fleste videoer er klar inden for 5-15 minutter. Du modtager en notifikation i appen, så snart din video er klar til download og deling.",
  },
  {
    q: "Kan jeg bestille flere videoer til samme bolig?",
    a: "Ja. Din pakke inkluderer et fast antal videoer hver måned (1 på Starter, 2 på Pro, 6 på Business), og ekstra videoer kan altid tilkøbes — perfekt til at fremhæve forskellige rum eller årstider.",
  },
  {
    q: "Hvad hvis jeg ikke er tilfreds med videoen?",
    a: "Kontakt os på mail@somevideopost.com inden for 14 dage, hvis du ikke er tilfreds, og vi finder en løsning. Vi ønsker, at du er 100% glad for resultatet.",
  },
];

function FAQSection() {
  return (
    <section className="bg-white px-8 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">FAQ</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Ofte stillede spørgsmål</h2>
        </div>
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors list-none">
                {item.q}
                <ChevronDown size={16} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-6 pb-5 pt-1 text-sm text-slate-500 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="mt-0.5 text-xs text-blue-200">{label}</span>
    </div>
  );
}

export default async function VideosPage() {
  const [orders, currency] = await Promise.all([getVideoOrders(), getCurrency()]);
  const videoPrice = formatPriceKey("video", currency);

  return (
    <>
      <Topbar
        title="Fremvisningsvideoer"
        description="AI-genererede præsentationsvideoer af dine boliger."
        action={
          orders.length > 0 ? (
            <div className="flex items-center gap-2">
              <Link
                href="/videos/upload"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <UploadCloud size={16} /> Upload færdig video
              </Link>
              <Link
                href="/videos/new"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
              >
                <Plus size={16} /> Bestil ny video
              </Link>
            </div>
          ) : null
        }
      />

      <div className="flex-1">
        {/* ── Product presentation video ── */}
        <section className="border-b border-slate-200 bg-white px-8 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">Præsentation</span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Se SOME Video Post i aktion</h2>
              <p className="mt-2 text-sm text-slate-500">Fra boliglink til færdig video og opslag — hele flowet på under et minut.</p>
            </div>
            <PresentationVideo />
          </div>
        </section>

        {orders.length === 0 ? (
          <div className="space-y-0">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden px-8 py-16" style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #14306b 60%, #0f2347 100%)" }}>
              {/* decorative circles */}
              <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FFB36B, transparent)" }} />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FF6B4A, transparent)" }} />

              <div className="mx-auto flex max-w-5xl items-center gap-12">
                <div className="flex-1">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
                    <Sparkles size={12} /> AI-drevet præsentationsvideo
                  </div>
                  <h1 className="text-4xl font-bold leading-tight text-white">
                    Gør din bolig<br />
                    <span style={{ background: "linear-gradient(90deg, #FFB36B, #FF6B4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      uimodståelig
                    </span>
                  </h1>
                  <p className="mt-4 text-lg text-blue-200 leading-relaxed max-w-md">
                    Lad AI&apos;en skabe en professionel præsentationsvideo af din bolig — klar på under 15 minutter, klar til at dele på sociale medier.
                  </p>
                  <div className="mt-6 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                    <span className="ml-2 text-sm text-blue-300">Brugt af hundredvis af udlejere</span>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <PhoneMockup />
                </div>
              </div>

              {/* Interactive demo */}
              <div className="mx-auto mt-10 max-w-5xl">
                <VideoDemo />
              </div>

              {/* Stats bar */}
              <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 gap-4">
                <StatPill value="3×" label="Flere bookingforespørgsler" />
                <StatPill value="15 min" label="Gennemsnitlig leveringstid" />
                <StatPill value={videoPrice} label="Pr. ekstra video" />
              </div>
            </section>

            {/* ── How it works ── */}
            <section className="bg-white px-8 py-14">
              <div className="mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">Sådan fungerer det</span>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Professionel præsentationsvideo på 3 trin</h2>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    {
                      step: "01",
                      icon: Clapperboard,
                      color: "#1B3F7A",
                      bg: "#EEF3FB",
                      title: "Opret din video",
                      text: "Angiv boligens titel og indsæt dit booking-link. Vi klargør alt automatisk — ingen teknisk viden nødvendig.",
                    },
                    {
                      step: "02",
                      icon: Sparkles,
                      color: "#FF6B4A",
                      bg: "#FFF4F1",
                      title: "AI producerer videoen",
                      text: "Vores AI skaber en flydende præsentationsvideo med professionelle kamerabevægelser, overgange og stemningsfuldt udtryk på bare 5-15 minutter.",
                    },
                    {
                      step: "03",
                      icon: Share2,
                      color: "#059669",
                      bg: "#ECFDF5",
                      title: "Del og få flere bookinger",
                      text: "Download videoen og del den direkte på Facebook, Instagram, TikTok og YouTube. Skil dig ud og tiltræk kvalitetslejere.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="relative">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: item.bg }}>
                          <item.icon size={20} style={{ color: item.color }} />
                        </div>
                        <span className="text-3xl font-black text-slate-100">{item.step}</span>
                      </div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center">
                  <Link
                    href="/videos/new"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
                  >
                    <Plus size={16} /> Bestil din første video
                  </Link>
                  <p className="mt-4 text-sm text-slate-500">
                    Har du allerede lavet en video?{" "}
                    <Link href="/videos/upload" className="font-semibold text-[#FF6B4A] hover:underline">
                      Upload den her
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {/* ── Features ── */}
            <section className="bg-[#FAF7F2] px-8 py-14">
              <div className="mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">Fordele</span>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Derfor vælger udlejere SOME VIDEO POST</h2>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    {
                      icon: Play,
                      color: "#1B3F7A",
                      bg: "#EEF3FB",
                      title: "Cinematisk præsentationsvideo",
                      text: "AI'en skaber en flydende video med professionelle kamerabevægelser og overgange — samme kvalitet som dyre videoProduktioner, uden den store pris.",
                    },
                    {
                      icon: Zap,
                      color: "#FF6B4A",
                      bg: "#FFF4F1",
                      title: "Klar på 15 minutter",
                      text: "SOME VIDEO POST leverer din færdige præsentationsvideo på bare 5-15 minutter. Du modtager besked direkte i appen, så snart den er klar til download.",
                    },
                    {
                      icon: TrendingUp,
                      color: "#059669",
                      bg: "#ECFDF5",
                      title: "Boost din synlighed",
                      text: "Videoer skiller sig markant ud på sociale medier og driver 3× flere klik og bookingforespørgsler. Præsenter din bolig fra dens absolutte bedste side.",
                    },
                    {
                      icon: Share2,
                      color: "#7C3AED",
                      bg: "#F5F3FF",
                      title: "Del på alle platforme",
                      text: "Download og del din video direkte på Facebook, Instagram, TikTok, YouTube og Snapchat — alt fra ét sted. Maksimal synlighed, minimal indsats.",
                    },
                  ].map((f) => (
                    <div key={f.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: f.bg }}>
                        <f.icon size={20} style={{ color: f.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{f.title}</h3>
                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Social proof / testimonial ── */}
            <section className="bg-white px-8 py-14">
              <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { quote: "Min booking-rate steg med 40% efter jeg begyndte at dele præsentationsvideoer på Instagram.", name: "Mette L.", role: "Sommerhusudlejer, Skagen" },
                    { quote: "Det tog bogstaveligt talt 2 minutter at bestille. 10 minutter senere havde jeg en professionel video klar til at dele.", name: "Thomas K.", role: "Airbnb-vært, København" },
                    { quote: "Præsentationsvideoerne har gjort en kæmpe forskel. Lejerne kan nu mærke stemningen inden de booker.", name: "Sofie A.", role: "Ferielejlighed, Bornholm" },
                  ].map((t) => (
                    <div key={t.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                      <div className="mb-3 flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-400">{t.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── FAQ ── */}
            <FAQSection />

            {/* ── Final CTA ── */}
            <section className="px-8 py-14" style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #2a5298 100%)" }}>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-white">Klar til at booste dine bookinger?</h2>
                <p className="mt-3 text-blue-200">Bestil din AI-præsentationsvideo i dag og se forskellen.</p>
                <Link
                  href="/videos/new"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#1B3F7A] shadow-xl transition-opacity hover:opacity-90"
                >
                  <Sparkles size={16} /> Bestil ekstra video — {videoPrice}
                </Link>
                <p className="mt-4 text-xs text-blue-300">Inkluderet i din pakke · Leveres på under 15 minutter · Download direkte i appen</p>
              </div>
            </section>

          </div>
        ) : (
          <div className="flex flex-col">
            <div className="px-8 py-6 flex flex-col gap-4">
              <PracticalInfo />
              <VideoListPoller hasProcessing={orders.some((o) => o.status === "processing")} />
              {orders.map((order) => (
                <VideoOrderCard key={order.id} order={order as VideoOrder} />
              ))}
            </div>
            <FAQSection />
          </div>
        )}
      </div>
    </>
  );
}
