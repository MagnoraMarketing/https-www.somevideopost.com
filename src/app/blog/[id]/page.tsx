import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { FreeTrialCTA } from "@/components/blog/free-trial-cta";
import { POSTS, getPost, getCategory, formatDate, articleBody } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";

export function generateStaticParams() {
  return POSTS.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(Number(id));
  if (!post) return { title: "Artikel ikke fundet — SOME VIDEO POST" };

  const url = `https://www.somevideopost.com/blog/${post.id}`;
  return {
    title: `${post.title} — SOME VIDEO POST`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      siteName: "somevideopost.com",
      url,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPost(Number(id));
  if (!post) notFound();

  const cat = getCategory(post.category);
  const body = articleBody(post);

  // Related posts from the same category (excluding the current one)
  const related = POSTS.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  const url = `${BASE}/blog/${post.id}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      articleSection: cat?.label,
      author: { "@type": "Organization", name: "somevideopost.com", url: BASE },
      publisher: {
        "@type": "Organization",
        name: "somevideopost.com",
        url: BASE,
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Forside", item: BASE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <JsonLd data={jsonLd} />
      <SiteHeader active="blog" />

      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1B3F7A] transition-colors">
          <ArrowLeft size={15} /> Tilbage til blog
        </Link>

        {/* Category + meta */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {cat && (
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
              style={{ background: cat.color }}
            >
              {cat.label}
            </Link>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={12} /> {formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock size={12} /> {post.readTime} læsning</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-500">{post.excerpt}</p>

        <hr className="my-8 border-slate-200" />

        {/* Body */}
        <div className="flex flex-col gap-8">
          {body.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-slate-900">{section.heading}</h2>
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-slate-600">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Related tool */}
        {post.relatedTool && (
          <Link
            href={post.relatedTool.href}
            className="group mt-10 flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 transition hover:border-blue-300 hover:bg-blue-100/60"
          >
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Relateret værktøj</p>
              <p className="mt-1 font-bold text-slate-900">{post.relatedTool.label}</p>
              <p className="mt-1 text-sm text-slate-600">{post.relatedTool.blurb}</p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-blue-600 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        {/* CTA */}
        <div className="mt-10">
          <FreeTrialCTA locale="da" />
          <p className="mt-3 text-center text-xs text-slate-400">
            <Link href="/hvorfor-somevideopost" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
              Læs hvorfor udlejere vælger somevideopost.com
            </Link>
          </p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Læs også</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.id}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h3 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors">{r.title}</h3>
                  <span className="mt-3 text-[11px] text-slate-400">{r.readTime} læsning</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
