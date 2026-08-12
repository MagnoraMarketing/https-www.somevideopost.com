import Link from "next/link";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { CHROME, LANDING, type Locale } from "@/lib/i18n";

const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

function FacebookIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
}
function InstagramIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

/**
 * Shared dark marketing footer used across the public sub-pages (blog, priser,
 * why…). Pass `locale` so labels match the page's actual content language.
 */
export function SiteFooter({ locale = "da" }: { locale?: Locale }) {
  const c = CHROME[locale];
  const t = LANDING[locale];

  return (
    <footer className="border-t border-white/5" style={{ background: "#04091c" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: ORANGE_GRADIENT }}>s</span>
              <BrandWordmark />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.footerDesc}</p>
            <div className="mt-5 flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61592058891174" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-blue-400/40 hover:text-blue-300">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-blue-400/40 hover:text-blue-300">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-blue-400/40 hover:text-blue-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{t.footerProduct}</p>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="/#features" className="transition-colors hover:text-white">{t.footerFeatures}</Link></li>
              <li><Link href="/#ai" className="transition-colors hover:text-white">{t.footerAiVideo}</Link></li>
              <li><Link href="/hvorfor-somevideopost" className="transition-colors hover:text-white">{c.footerWhy}</Link></li>
              <li><Link href="/priser" className="transition-colors hover:text-white">{t.footerPricing}</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-white">{c.footerBlog}</Link></li>
              <li><Link href="/signup" className="transition-colors hover:text-white">{t.footerCreateAccount}</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-white">{t.footerLogin}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{c.footerAiVideoHeading}</p>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="/some-ai-video" className="transition-colors hover:text-white">{c.someAiVideoLabel}</Link></li>
              <li><Link href="/ai-video-for-real-estate" className="transition-colors hover:text-white">{c.realEstateVideoLabel}</Link></li>
              <li><Link href="/ai-video-for-apartment" className="transition-colors hover:text-white">{c.apartmentVideoLabel}</Link></li>
              <li><Link href="/generate-ai-video-free" className="transition-colors hover:text-white">{c.freeVideoLabel}</Link></li>
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
              <li><Link href="/signup" className="transition-colors hover:text-white">{c.navStart}</Link></li>
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
  );
}
