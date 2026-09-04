import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static resolves a binary at runtime rather than being bundled, so
  // it must stay external for the assembler to find it on the server.
  serverExternalPackages: ["playwright-core", "ffmpeg-static"],
  outputFileTracingIncludes: {
    // The final render spawns the binary, which the bundler cannot see as a
    // dependency; without this the assembly step has nothing to execute.
    "/api/video-jobs/**": ["./node_modules/ffmpeg-static/ffmpeg"],
  },
  async redirects() {
    // Locale-prefixed auth routes don't exist — the auth pages live at the
    // root (/login, /signup). Redirect at the edge so /es/login etc. never
    // 404 or render blank, regardless of how the user got there (Google
    // Translate, bookmarks, manual URL).
    const locales = ["en", "es", "de"];
    const authPaths = ["login", "signup"];
    return locales.flatMap((loc) =>
      authPaths.map((p) => ({
        source: `/${loc}/${p}`,
        destination: `/${p}`,
        permanent: true,
      })),
    );
  },
};

export default nextConfig;
