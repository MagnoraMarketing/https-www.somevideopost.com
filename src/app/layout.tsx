import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { CONSENT_COOKIE, isConsentChoice, type ConsentChoice } from "@/lib/consent";
import { coerceLocale, type Locale } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.somevideopost.com"),
  title: "SOME VIDEO POST — Automatisk sociale medier og AI-video til udlejere",
  description:
    "somevideopost.com sparer dig tid og giver professionelle opslag på Facebook, Instagram, TikTok og LinkedIn automatisk. Synkroniser din bookingkalender fra Airbnb, Booking.com og mere. AI-genererede tekster og præsentationsvideoer til ferieboliger, lejligheder og huse.",
  keywords:
    "somevideopost, SOME video post, AI video feriebolig, sociale medier udlejning, feriebolig opslag, automatisk booking kalender, Airbnb Facebook opslag, lejlighed markedsføring, udlejer platform, præsentationsvideo bolig",
  openGraph: {
    title: "SOME VIDEO POST — Automatisk sociale medier og AI-video til udlejere",
    description:
      "Spar timer hver uge. Post på alle sociale medier på én gang, synkroniser din bookingkalender og lad AI generere dine opslag og præsentationsvideoer automatisk.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "da_DK",
    url: "https://www.somevideopost.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOME VIDEO POST — Automatisk sociale medier og AI-video til udlejere",
    description:
      "Spar timer hver uge. Post på alle sociale medier på én gang, synkroniser din bookingkalender og lad AI generere dine opslag og præsentationsvideoer automatisk.",
  },
  alternates: {
    canonical: "https://www.somevideopost.com",
    languages: {
      "da": "https://www.somevideopost.com",
      "en": "https://www.somevideopost.com/en",
      "es": "https://www.somevideopost.com/es",
      "de": "https://www.somevideopost.com/de",
      "x-default": "https://www.somevideopost.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  // Google Search Console — set GOOGLE_SITE_VERIFICATION to the token from the
  // "HTML tag" verification method; the meta tag is emitted only when present.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale: Locale = coerceLocale(cookieStore.get("locale")?.value);

  // Read the consent choice server-side so the banner and the analytics gate
  // both render correctly on first paint — no flash of a banner the visitor
  // already dismissed, and no analytics before an actual "yes".
  const rawConsent = cookieStore.get(CONSENT_COOKIE)?.value;
  const consent: ConsentChoice | null = isConsentChoice(rawConsent) ? rawConsent : null;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        {children}
        <CookieConsent locale={locale} initialChoice={consent} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} initialChoice={consent} />
      </body>
    </html>
  );
}
