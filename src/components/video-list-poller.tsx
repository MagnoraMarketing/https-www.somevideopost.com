"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function VideoListPoller({ hasProcessing }: { hasProcessing: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!hasProcessing) return;

    const tick = async () => {
      try {
        await fetch("/api/poll-video-status", { method: "POST" });
      } catch {
        // Network error — the next tick tries again.
        return;
      }
      // Refresh regardless of how many rows the poll updated: progress and
      // elapsed time move on the server even when no status flipped.
      router.refresh();
    };

    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [hasProcessing, router]);

  return null;
}
