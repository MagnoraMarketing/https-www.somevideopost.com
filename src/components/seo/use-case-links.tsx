import Link from "next/link";
import { Share2, Building2, Home, Gift, ArrowRight, type LucideIcon } from "lucide-react";

export type UseCaseSlug =
  | "/some-ai-video"
  | "/ai-video-for-real-estate"
  | "/generate-ai-video-free"
  | "/ai-video-for-apartment";

type UseCase = {
  slug: UseCaseSlug;
  label: string;
  blurb: string;
  icon: LucideIcon;
};

/**
 * Single source of truth for the four AI-video pillar pages, so every page
 * links to the others with the same label/URL (hub-and-spoke internal linking).
 */
export const USE_CASES: UseCase[] = [
  {
    slug: "/some-ai-video",
    label: "SoMe AI Video",
    blurb: "AI-generated video for Instagram, TikTok, Facebook & LinkedIn.",
    icon: Share2,
  },
  {
    slug: "/ai-video-for-real-estate",
    label: "AI Video for Real Estate",
    blurb: "Cinematic listing videos for agents, agencies & estates.",
    icon: Home,
  },
  {
    slug: "/generate-ai-video-free",
    label: "Generate AI Video Free",
    blurb: "How to preview and generate your first AI video at no cost.",
    icon: Gift,
  },
  {
    slug: "/ai-video-for-apartment",
    label: "AI Video for Apartment",
    blurb: "Interior-focused videos that make apartment listings rent faster.",
    icon: Building2,
  },
];

/** Grid of links to the other AI-video pillar pages, for internal-linking between them. */
export function UseCaseLinks({
  current,
  heading = "Explore more AI video use cases",
  subheading = "somevideopost.com turns links and photos into AI video for every use case — see how it works for you.",
}: {
  current?: UseCaseSlug;
  heading?: string;
  subheading?: string;
}) {
  const others = current ? USE_CASES.filter((u) => u.slug !== current) : USE_CASES;
  return (
    <section className="py-24" style={{ background: "#071130" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">{heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">{subheading}</p>
        </div>
        <div className={`grid gap-5 sm:grid-cols-2 ${others.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {others.map((u) => (
            <Link
              key={u.slug}
              href={u.slug}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <u.icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{u.label}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-400">{u.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                Read more <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
