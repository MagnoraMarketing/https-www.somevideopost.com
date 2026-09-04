import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Locale } from "@/lib/i18n";
import {
  COMPANY,
  LEGAL_SLUGS,
  legalDoc,
  legalFor,
  legalHref,
  postalAddress,
  type LegalSection,
  type LegalSlug,
} from "@/lib/legal";

/** Stable anchor id for a section, so the table of contents can link to it. */
function sectionId(index: number): string {
  return `afsnit-${index + 1}`;
}

function SectionBody({ section }: { section: LegalSection }) {
  return (
    <>
      {section.body?.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-[15px] leading-relaxed text-slate-300">
          {paragraph}
        </p>
      ))}

      {section.bullets && (
        <ul className="mt-4 space-y-2.5">
          {section.bullets.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/[0.04]">
                {section.table.headers.map((header) => (
                  <th key={header} className="whitespace-nowrap px-4 py-3 font-semibold text-slate-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-white/10 align-top">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3 text-slate-400">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/**
 * Shared renderer for the privacy policy, cookie policy and terms of service.
 * All three are plain prose plus the occasional table, so they share one layout
 * and differ only in the content passed through `locale` and `slug`.
 */
export function LegalDocument({ locale, slug }: { locale: Locale; slug: LegalSlug }) {
  const doc = legalDoc(locale, slug);
  const { chrome } = legalFor(locale);
  const address = postalAddress();
  const others = LEGAL_SLUGS.filter((s) => s !== slug);

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#050d24" }}>
      <SiteHeader locale={locale} />

      <header
        className="relative overflow-hidden border-b border-white/5"
        style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}
      >
        <div
          aria-hidden
          className="absolute left-0 top-0 h-64 w-64 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <ShieldCheck size={12} /> {COMPANY.name}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">{doc.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">{doc.intro}</p>
          <p className="mt-5 text-xs text-slate-500">{doc.updated}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav aria-label={chrome.contents} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{chrome.contents}</h2>
          <ol className="mt-3 space-y-1.5">
            {doc.sections.map((section, i) => (
              <li key={section.heading} className="text-sm">
                <a href={`#${sectionId(i)}`} className="text-slate-300 transition-colors hover:text-white">
                  <span className="mr-2 text-slate-500">{i + 1}.</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section, i) => (
          <section key={section.heading} id={sectionId(i)} className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold text-white">
              <span className="mr-2 text-slate-500">{i + 1}.</span>
              {section.heading}
            </h2>
            <SectionBody section={section} />
          </section>
        ))}

        {/* Controller / trader identification — required by GDPR art. 13 and,
            for the terms, the Danish e-commerce disclosure rules. */}
        <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{chrome.companyHeading}</h2>
          <address className="mt-3 not-italic text-[15px] leading-relaxed text-slate-300">
            <span className="font-semibold text-white">{COMPANY.legalName}</span>
            <br />
            {address && (
              <>
                {address}
                <br />
              </>
            )}
            {COMPANY.cvr && (
              <>
                CVR {COMPANY.cvr}
                <br />
              </>
            )}
            <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-1.5 text-orange-300 transition-colors hover:text-orange-200">
              <Mail size={13} /> {COMPANY.email}
            </a>
          </address>

          <h3 className="mt-6 text-sm font-semibold text-white">{chrome.questionsHeading}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-400">{chrome.questionsBody}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{chrome.otherDocs}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {others.map((other) => (
              <Link
                key={other}
                href={legalHref(locale, other)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
              >
                {legalDoc(locale, other).title}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
