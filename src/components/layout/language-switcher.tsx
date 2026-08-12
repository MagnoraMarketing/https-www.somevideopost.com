"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALE_FLAGS, LOCALE_LABELS, LOCALES, localizedPathFor, type Locale } from "@/lib/i18n";

/**
 * Dark-themed language switcher used across the marketing header.
 *
 * Opens on click/tap (with hover-open on pointer devices) so it works on
 * touchscreens, where `:hover` never fires and a hover-only dropdown can
 * never be opened. Switching stays on the current page's translated
 * equivalent (via localizedPathFor) instead of jumping to the homepage.
 */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Vælg sprog"
        className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-blue-400/40 hover:text-white transition-colors"
      >
        <Globe size={12} />
        <span>{LOCALE_FLAGS[current]} {LOCALE_LABELS[current]}</span>
        <span className="text-slate-500">▾</span>
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside tap (mobile) */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-white/10 bg-[#0a1430] shadow-xl shadow-black/40 py-1"
          >
            {LOCALES.map((loc) => (
              <a
                key={loc}
                href={localizedPathFor(pathname, loc)}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${loc === current ? "font-semibold text-blue-300" : "text-slate-300"}`}
              >
                <span>{LOCALE_FLAGS[loc]}</span>
                <span>{LOCALE_LABELS[loc]}</span>
                {loc === current && <span className="ml-auto text-blue-300">✓</span>}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
