import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Plain <img> inside the signed-in app.
    //
    // next/image needs every remote host allow-listed in next.config's
    // remotePatterns. These images are user-supplied: photos scraped from
    // whatever listing URL the user pasted (Airbnb, Booking.com, Novasol,
    // their own site…) plus social-profile avatars from Meta's CDNs. There is
    // no closed set of hosts to allow-list, and the alternative —
    // `hostname: "**"` — turns the deployment into an open image proxy that
    // anyone can point at any URL, at our bandwidth and optimisation cost.
    //
    // These views are behind authentication, so they carry no SEO weight and
    // no Core Web Vitals field data. The rule stays on everywhere else, which
    // is where LCP actually matters: the marketing and blog pages.
    files: [
      "src/app/(app)/**/*.tsx",
      "src/components/posts/**/*.tsx",
      "src/components/accounts/**/*.tsx",
      "src/components/screenshot-importer.tsx",
      "src/components/video-order-card.tsx",
      "src/components/video-status-client.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
