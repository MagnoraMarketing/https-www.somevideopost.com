import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static resolves a binary at runtime rather than being bundled, so
  // it must stay external for the assembler to find it on the server.
  serverExternalPackages: ["playwright-core", "ffmpeg-static"],
  outputFileTracingIncludes: {
    // The final render spawns the binary, which the bundler cannot see as a
    // dependency; without this the assembly step has nothing to execute.
    // Every route that can run a job step or render a preview needs it: the
    // video page (its Server Action drives the job), the list and cron
    // drivers, and the preview route. Listed explicitly rather than relying on
    // the tracer to find the runtime `require` on its own.
    "/api/video-jobs/**": ["./node_modules/ffmpeg-static/ffmpeg"],
    "/api/cron/video-jobs": ["./node_modules/ffmpeg-static/ffmpeg"],
    "/api/poll-video-status": ["./node_modules/ffmpeg-static/ffmpeg"],
    "/api/videos/**": ["./node_modules/ffmpeg-static/ffmpeg"],
    "/videos/\\[id\\]": ["./node_modules/ffmpeg-static/ffmpeg"],
    "/videos/new": ["./node_modules/ffmpeg-static/ffmpeg"],
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
