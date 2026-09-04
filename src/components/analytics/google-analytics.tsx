"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  CONSENT_CHANGED_EVENT,
  allowsStatistics,
  type ConsentChoice,
} from "@/lib/consent";

/**
 * Google Analytics 4 (gtag.js), gated on statistics consent.
 *
 * Nothing is loaded until the visitor has actively accepted statistics
 * cookies — under the Danish cookie rules GA is not a necessary cookie, so it
 * may not be set on a "necessary only" or undecided visit. The initial value
 * comes from the server-read cookie to avoid a flash, and the component
 * re-checks when the banner reports a change so accepting takes effect
 * immediately rather than on the next page load.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_ID is set, so analytics also stays off
 * in local/dev and preview until the ID is configured. GA4 Enhanced
 * Measurement tracks SPA route changes via History events, so client-side
 * navigations are counted without extra wiring.
 */
export function GoogleAnalytics({
  gaId,
  initialChoice,
}: {
  gaId?: string;
  initialChoice: ConsentChoice | null;
}) {
  const [enabled, setEnabled] = useState(() => allowsStatistics(initialChoice));

  useEffect(() => {
    const onChange = (event: Event) => {
      const choice = (event as CustomEvent<ConsentChoice>).detail;
      setEnabled(allowsStatistics(choice));
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
