import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { CHROME, type Locale } from "@/lib/i18n";

type NavKey = "home" | "features" | "video" | "why" | "blog" | "pricing";

const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

/**
 * Shared sticky marketing header (dark, front-page style) used across the public
 * sub-pages (blog, articles, pricing, why…). Mirrors the landing-page nav so the
 * menu is identical everywhere. Pass `locale` so nav labels match the page's
 * actual content language — it does not translate href targets.
 */
export function SiteHeader({ active, locale = "da" }: { active?: NavKey; locale?: Locale }) {
  const t = CHROME[locale];
  const navLinks: { key: NavKey; href: string; label: string; external?: boolean }[] = [
    { key: "home", href: "/", label: t.navHome },
    { key: "features", href: "/#features", label: t.navFeatures, external: true },
    { key: "video", href: "/#ai", label: t.navVideo, external: true },
    { key: "why", href: "/hvorfor-somevideopost", label: t.navWhy },
    { key: "blog", href: "/blog", label: t.navBlog },
    { key: "pricing", href: "/priser", label: t.navPricing },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur" style={{ background: "rgba(5,13,36,0.9)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm text-white" style={{ background: ORANGE_GRADIENT }}>s</span>
          <BrandWordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={l.key === active ? "text-white font-semibold" : "hover:text-white transition-colors"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} />
          <Link href="/login" className="hidden sm:inline text-sm font-medium text-slate-300 hover:text-white transition-colors">{t.navLogin}</Link>
          <Link href="/signup" className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            {t.navStart}
          </Link>
          <MobileNav
            dark
            links={[
              ...navLinks.map(({ href, label, external }) => ({ href, label, external })),
              { href: "/login", label: t.navLogin },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
