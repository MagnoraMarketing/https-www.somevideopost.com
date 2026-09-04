import Link from "next/link";
import { Plus, CalendarClock, Send, Video, Sparkles, ArrowRight, Flame, Target, Users, BarChart2, TrendingUp, TrendingDown, CheckCircle2, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post, SocialAccount } from "@/types/database";
import { VideoProgressBadge } from "@/components/video-progress-badge";
import { MetaAdsSection } from "@/components/meta-ads-section";

async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const prevWeekAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    scheduledRes,
    sentThisWeekRes,
    sentLastWeekRes,
    accountsRes,
    upcomingRes,
    videoOrdersRes,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published").gte("published_at", weekAgo),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published").gte("published_at", prevWeekAgo).lt("published_at", weekAgo),
    supabase.from("social_accounts").select("*").order("created_at"),
    supabase.from("posts").select("*").eq("status", "scheduled").order("scheduled_at").limit(5),
    supabase.from("video_orders").select("*").order("created_at", { ascending: false }).limit(4),
  ]);

  return {
    scheduled: scheduledRes.count ?? 0,
    sentThisWeek: sentThisWeekRes.count ?? 0,
    sentLastWeek: sentLastWeekRes.count ?? 0,
    accounts: (accountsRes.data ?? []) as SocialAccount[],
    upcoming: (upcomingRes.data ?? []) as Post[],
    videoOrders: videoOrdersRes.data ?? [],
    userEmail: user?.email ?? "",
  };
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877F2", instagram: "#E1306C", tiktok: "#000000",
  snapchat: "#F7C600", youtube: "#FF0000", linkedin: "#0A66C2",
};

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  if (diff === 0) return <span className="text-xs text-slate-400">Ingen ændring</span>;
  const up = diff > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}{diff} fra sidste uge
    </span>
  );
}


export default async function DashboardPage() {
  const data = await getDashboardData();
  const firstName = data.userEmail.split("@")[0];
  const now = new Date();
  const weekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const weekRange = `${weekStart.toLocaleDateString("da-DK", { day: "numeric", month: "short" })} – ${now.toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })}`;
  const hasVideos = data.videoOrders.length > 0;

  return (
    <div className="flex-1 px-8 py-7 max-w-5xl mx-auto w-full space-y-6">

      {/* ── Greeting ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white shadow"
            style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
          >
            {firstName[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Goddag, {firstName}!</h1>
            <p className="text-xs text-slate-400 capitalize">
              {now.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          <Plus size={15} /> Nyt opslag
        </Link>
      </div>

      {/* ── AI Video — hero section ── */}
      {hasVideos ? (
        /* Has orders: show list + new button */
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
            style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #2a5298 100%)" }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Video size={15} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">AI Præsentationsvideoer</p>
                <p className="text-[11px] text-blue-200">{data.videoOrders.length} video{data.videoOrders.length !== 1 ? "er" : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/videos"
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                Se alle <ArrowRight size={11} className="inline" />
              </Link>
              <Link
                href="/videos/new"
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1B3F7A] hover:opacity-90 transition-opacity"
              >
                <Plus size={12} /> Ny video
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {data.videoOrders.map((order) => (
              <Link
                key={order.id}
                href={`/videos/${order.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                  {order.image_urls?.[0] ? (
                    <img src={order.image_urls[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Video size={18} className="text-slate-300" />
                    </div>
                  )}
                  {order.status === "ready" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} className="text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate text-sm">{order.title ?? "Bolig fremvisning"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <VideoProgressBadge status={order.status} createdAt={order.created_at} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* No orders: prominent CTA */
        <div
          className="relative overflow-hidden rounded-2xl p-8"
          style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #14306b 60%, #0f2347 100%)" }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FFB36B, transparent)" }} />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FF6B4A, transparent)" }} />

          <div className="relative flex items-center gap-8">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
                <Sparkles size={11} /> AI-drevet præsentationsvideo
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                Præsentér din bolig<br />med en professionel video
              </h2>
              <p className="mt-2 text-sm text-blue-200 leading-relaxed max-w-sm">
                Indsæt dit Airbnb- eller Booking.com-link — AI&apos;en genererer en flot præsentationsvideo på under 15 minutter, klar til at dele på sociale medier.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="/videos/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#1B3F7A] shadow hover:opacity-90 transition-opacity"
                >
                  <Video size={15} /> Opret video nu
                </Link>
                <Link href="/videos" className="text-sm text-blue-300 hover:text-white transition-colors flex items-center gap-1">
                  Se eksempler <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="hidden md:flex shrink-0 flex-col gap-2">
              {["3× mere engagement", "Klar på 15 min", "Del direkte på sociale medier"].map((t) => (
                <div key={t} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span className="text-sm text-white font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Meta advertising (Business) ── */}
      <MetaAdsSection />

      {/* ── Streak / Goals / Score ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: Flame,
            label: "Uge streak",
            value: data.sentThisWeek > 0 ? 1 : 0,
            sub: data.sentThisWeek > 0 ? "Du postede denne uge!" : "Post i dag for at starte en streak",
            color: "#FF6B4A",
            bg: "#FFF4F1",
          },
          {
            icon: Target,
            label: "Planlagte opslag",
            value: data.scheduled,
            sub: data.scheduled === 0 ? "Ingen planlagte opslag" : `${data.scheduled} klar til publicering`,
            color: "#1B3F7A",
            bg: "#EEF3FB",
          },
          {
            icon: Users,
            label: "Tilkoblede kanaler",
            value: data.accounts.length,
            sub: data.accounts.length === 0 ? "Tilslut din første kanal" : data.accounts.map(a => a.platform).join(", "),
            color: "#059669",
            bg: "#ECFDF5",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: s.bg }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1.5 text-xs text-slate-400 leading-tight">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Weekly Pulse ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Ugentlig puls</h2>
            <p className="text-xs text-slate-400 mt-0.5">{weekRange} · Sammenlignet med forrige uge</p>
          </div>
          <BarChart2 size={18} className="text-slate-300" />
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {[
            { label: "Opslag sendt", value: data.sentThisWeek, prev: data.sentLastWeek },
            { label: "Planlagte opslag", value: data.scheduled, prev: 0 },
            { label: "Tilkoblede konti", value: data.accounts.length, prev: 0 },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5">
              <p className="text-xs font-medium text-slate-400 mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <div className="mt-1">
                <TrendBadge current={s.value} previous={s.prev} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* ── Up Next ── */}
        <div className="col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-bold text-slate-900">Kommende opslag</h2>
              <Link href="/posts" className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors">
                Se alle <ArrowRight size={11} className="inline" />
              </Link>
            </div>

            {data.upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <CalendarClock size={22} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Ingen planlagte opslag</p>
                <p className="mt-1 text-xs text-slate-400">Planlæg dit næste opslag til sociale medier.</p>
                <Link
                  href="/posts/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
                >
                  <Plus size={13} /> Opret opslag
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.upcoming.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 mt-0.5">
                      <Send size={13} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-sm text-slate-800 leading-snug">{post.content}</p>
                      {post.scheduled_at && (
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(post.scheduled_at).toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-500">
                      Planlagt
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Connected channels */}
            <div className="border-t border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kanaler</p>
                <Link href="/accounts/connect" className="text-xs text-slate-400 hover:text-slate-700 transition-colors">
                  + Tilslut
                </Link>
              </div>
              {data.accounts.length === 0 ? (
                <div>
                  <p className="mb-3 text-xs text-slate-400">Vælg en platform for at komme i gang:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Facebook", color: "#1877F2", bg: "#E7F0FD", letter: "f" },
                      { name: "Instagram", color: "#E1306C", bg: "#FCE4EC", letter: "in" },
                      { name: "TikTok", color: "#010101", bg: "#E8E8E8", letter: "T" },
                      { name: "YouTube", color: "#FF0000", bg: "#FFEBEE", letter: "Y" },
                      { name: "LinkedIn", color: "#0A66C2", bg: "#E3F2FD", letter: "Li" },
                      { name: "Snapchat", color: "#FFAA00", bg: "#FFFDE7", letter: "S" },
                    ].map((p) => (
                      <Link
                        key={p.name}
                        href="/accounts/connect"
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-2 py-3 text-center hover:border-slate-200 hover:bg-white transition-colors group"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: p.color, color: "#fff" }}
                        >
                          {p.letter}
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-700 leading-none">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.accounts.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
                      <div
                        className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                        style={{ backgroundColor: PLATFORM_COLORS[a.platform] ?? "#64748b" }}
                      >
                        {a.platform[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-600">{a.account_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Quick actions */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hurtige handlinger</h3>
            </div>
            <div className="p-2">
              {[
                { href: "/videos/new", icon: Video, label: "Opret video", bg: "bg-orange-50", color: "text-[#FF6B4A]" },
                { href: "/posts/new", icon: Send, label: "Opret opslag", bg: "bg-blue-50", color: "text-blue-600" },
                { href: "/properties/new", icon: Plus, label: "Tilføj bolig", bg: "bg-emerald-50", color: "text-emerald-600" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
                    <item.icon size={14} className={item.color} />
                  </div>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Video stats / tip */}
          <div
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #2a5298 100%)" }}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5" />
            <div className="absolute -right-2 top-8 h-16 w-16 rounded-full bg-white/5" />
            <div className="relative">
              <div className="mb-2 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-orange-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300">Vidste du?</span>
              </div>
              <p className="text-sm font-bold leading-snug">Videoer får 3× mere engagement end billeder</p>
              <p className="mt-1 text-xs text-blue-200 leading-relaxed">
                Udlejere der deler præsentationsvideoer får markant flere bookingforespørgsler.
              </p>
              <Link
                href="/videos/new"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1B3F7A] hover:opacity-90 transition-opacity"
              >
                Prøv det nu <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
