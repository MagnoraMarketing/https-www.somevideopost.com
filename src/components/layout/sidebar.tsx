"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LogOut, Plus, ExternalLink, BarChart2, Users, CalendarDays,
  Video, Home, Settings, CreditCard, Building2, Menu, X, Tag,
} from "lucide-react";
import { signOutAction } from "@/services/auth";
import type { SocialAccount } from "@/types/database";
import { APP_LABELS, LOCALE_FLAGS, LOCALE_LABELS, LOCALES, localeSwitchHref, type Locale as I18nLocale } from "@/lib/i18n";

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E1306C",
  tiktok: "#010101",
  snapchat: "#FFFC00",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
};

const SUGGESTED_PLATFORMS = [
  { label: "YouTube", icon: Video, color: "#FF0000", bg: "#FFEBEE" },
  { label: "Mere kanaler", icon: Plus, color: "#64748b", bg: "#F1F5F9" },
];

type Locale = I18nLocale;

interface SidebarProps {
  accounts?: SocialAccount[];
  userEmail?: string;
  locale?: Locale;
}

function LangSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
      >
        <span>{LOCALE_FLAGS[current]}</span>
        <span>{LOCALE_LABELS[current]}</span>
        <span className="ml-auto text-slate-500">▾</span>
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-full rounded-xl border border-white/10 bg-[#1a2d52] py-1 shadow-xl z-50">
          {LOCALES.map((loc) => (
            <a
              key={loc}
              href={localeSwitchHref(loc)}
              className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/10 ${loc === current ? "text-white font-semibold" : "text-slate-400"}`}
            >
              <span>{LOCALE_FLAGS[loc]}</span>
              <span>{LOCALE_LABELS[loc]}</span>
              {loc === current && <span className="ml-auto text-[#FF6B4A]">✓</span>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  badge,
  external,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  external?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-white/10 text-white"
          : "text-slate-300/80 hover:bg-white/5 hover:text-white"
      }`}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
          style={{ background: "linear-gradient(180deg, #FFB36B 0%, #FF6B4A 100%)" }}
        />
      )}
      <Icon size={17} strokeWidth={2} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
          {badge}
        </span>
      )}
      {external && <ExternalLink size={11} className="text-slate-500" />}
    </Link>
  );
}

function SidebarContent({ accounts, userEmail, locale = "da", onNav }: SidebarProps & { onNav?: () => void }) {
  const t = APP_LABELS[locale];
  const firstName = userEmail?.split("@")[0] ?? "";
  const maxChannels = 3;
  const connectedCount = accounts?.length ?? 0;

  return (
    <div className="relative flex h-full flex-col bg-[#14213D] py-4">
      {/* Logo */}
      <div className="mb-4 flex items-center gap-2 px-4">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-sm shrink-0"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          S
        </span>
        <span className="text-base font-bold uppercase leading-none text-white tracking-tight">SOME VIDEO POST</span>
      </div>

      {/* + New button */}
      <div className="px-3 mb-4">
        <Link
          href="/posts/new"
          onClick={onNav}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          <Plus size={16} strokeWidth={2.5} /> {t.newPost}
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="relative flex flex-col gap-0.5 px-2">
        <NavItem href="/dashboard" icon={Home} label={t.home} onClick={onNav} />
        <NavItem href="/posts/new" icon={Plus} label={t.create} onClick={onNav} />
        <NavItem href="/posts" icon={CalendarDays} label={t.schedule} badge={0} onClick={onNav} />
        <NavItem href="/accounts" icon={Users} label={t.channels} onClick={onNav} />
        <NavItem href="/videos" icon={Video} label={t.videos} onClick={onNav} />
        <NavItem href="/properties" icon={Building2} label={t.properties} onClick={onNav} />
      </nav>

      <div className="my-3 h-px bg-white/10 mx-3" />

      <nav className="relative flex flex-col gap-0.5 px-2">
        <NavItem href="/analytics" icon={BarChart2} label={t.analytics} onClick={onNav} />
      </nav>

      {/* Connected channels */}
      <div className="mt-3 px-2">
        {(accounts ?? []).map((a) => {
          const color = PLATFORM_COLORS[a.platform] ?? "#64748b";
          return (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              onClick={onNav}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors group"
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ backgroundColor: color, color: "#fff" }}
              >
                {a.platform[0].toUpperCase()}
              </div>
              <span className="truncate text-sm text-slate-300/80 group-hover:text-white flex-1">{a.account_name}</span>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-300">0</span>
            </Link>
          );
        })}
      </div>

      {/* Connect channels suggestions */}
      <div className="mt-2 px-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-1">{t.connectChannel}</p>
        {SUGGESTED_PLATFORMS.map((p) => (
          <Link
            key={p.label}
            href="/accounts/connect"
            onClick={onNav}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors group"
          >
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: p.bg }}
            >
              <p.icon size={11} style={{ color: p.color }} />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white">{p.label}</span>
          </Link>
        ))}
      </div>

      {/* Channel progress + credits */}
      <div className="mx-3 mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 space-y-2.5">
        {/* Connected SOME channels */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-300">Tilkoblet SOME kanaler</span>
            <span className="text-[11px] text-slate-400">{connectedCount}/{maxChannels}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: maxChannels }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ backgroundColor: i < connectedCount ? "#22c55e" : "rgba(255,255,255,0.1)" }}
              />
            ))}
          </div>
        </div>
        {/* Credits */}
        <div className="border-t border-white/10 pt-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-300">Credits</span>
            <span className="text-[11px] font-bold text-orange-400">0 / 10</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">1 credit = 1 opslag eller video</p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="mx-3 mb-2 h-px bg-white/10" />
        <nav className="relative flex flex-col gap-0.5 px-2">
          <NavItem href="/priser" icon={Tag} label="Priser" onClick={onNav} external />
          <NavItem href="/billing" icon={CreditCard} label={t.billing} onClick={onNav} />
          <NavItem href="/settings" icon={Settings} label={t.settings} onClick={onNav} />
        </nav>
        <div className="mx-2 mt-1">
          <LangSwitcher current={locale} />
        </div>

        <div className="mx-3 mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
            >
              {firstName[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate capitalize">{firstName}</p>
              <p className="text-[10px] text-slate-400">{t.freePlan}</p>
            </div>
            <form action={signOutAction}>
              <button type="submit" title="Log ud" className="text-slate-400 hover:text-white transition-colors">
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile bottom tab bar — shown only on small screens */
function BottomTabBar() {
  const pathname = usePathname();
  const tabs = [
    { href: "/dashboard", icon: Home, label: "Hjem" },
    { href: "/posts", icon: CalendarDays, label: "Planlæg" },
    { href: "/posts/new", icon: Plus, label: "Opret" },
    { href: "/videos", icon: Video, label: "Videoer" },
    { href: "/properties", icon: Building2, label: "Boliger" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center border-t border-slate-200 bg-white md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(({ href, icon: Icon, label }) => {
        const isNew = href === "/posts/new";
        const isActive =
          pathname === href || (!isNew && href !== "/dashboard" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center py-2 gap-0.5"
          >
            {isNew ? (
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
              >
                <Icon size={20} strokeWidth={2.5} color="white" />
              </span>
            ) : (
              <>
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? "#FF6B4A" : "#94a3b8" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? "#FF6B4A" : "#94a3b8" }}
                >
                  {label}
                </span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ accounts = [], userEmail, locale = "da" }: SidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [drawerPathname, setDrawerPathname] = useState(pathname);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Close the drawer on route change. Adjusting during render rather than in an
  // effect: React re-runs this component immediately with the new state before
  // touching the DOM, so the drawer never paints open on the new route.
  if (pathname !== drawerPathname) {
    setDrawerPathname(pathname);
    setDrawerOpen(false);
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Swipe-to-open: rightward swipe starting from left edge (<32px)
  // Swipe-to-close: leftward swipe anywhere when drawer is open
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (Math.abs(dx) < 40 || dy > Math.abs(dx)) return;
      if (dx > 0 && touchStartX.current < 32) setDrawerOpen(true);
      if (dx < 0) setDrawerOpen(false);
      touchStartX.current = null;
      touchStartY.current = null;
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex h-full w-60 shrink-0">
        <SidebarContent accounts={accounts} userEmail={userEmail} locale={locale} />
      </aside>

      {/* ── Mobile top header ── */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 md:hidden">
        <button
          type="button"
          aria-label="Åbn menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md text-white font-bold text-xs shrink-0"
            style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
          >
            S
          </span>
          <span className="text-sm font-bold uppercase text-slate-900 tracking-tight">SOME VIDEO POST</span>
        </div>
        <div className="ml-auto">
          <Link
            href="/posts/new"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
          >
            <Plus size={13} strokeWidth={2.5} /> Nyt opslag
          </Link>
        </div>
      </header>

      {/* ── Mobile drawer backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Luk menu"
          onClick={() => setDrawerOpen(false)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent
          accounts={accounts}
          userEmail={userEmail}
          locale={locale}
          onNav={() => setDrawerOpen(false)}
        />
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <BottomTabBar />
    </>
  );
}
