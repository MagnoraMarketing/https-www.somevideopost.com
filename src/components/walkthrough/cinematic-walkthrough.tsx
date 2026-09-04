"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2, SlidersHorizontal, Move } from "lucide-react";
import type { Locale } from "@/lib/i18n";

// ── Types ───────────────────────────────────────────────────────────────────
export type RoomKey =
  | "facade" | "entrance" | "kitchen" | "living"
  | "bedroom" | "bathroom" | "terrace";

export type Scene = { src: string; roomKey: RoomKey };

type LoadedScene = { img: HTMLImageElement; roomKey: RoomKey };

type Mode = "auto" | "explore";

// ── Room labels per language ────────────────────────────────────────────────
const ROOM_LABELS: Record<Locale, Record<RoomKey, string>> = {
  da: { facade: "Facade", entrance: "Entré", kitchen: "Køkken", living: "Stue", bedroom: "Soveværelse", bathroom: "Badeværelse", terrace: "Terrasse" },
  en: { facade: "Exterior", entrance: "Entrance", kitchen: "Kitchen", living: "Living room", bedroom: "Bedroom", bathroom: "Bathroom", terrace: "Terrace" },
  es: { facade: "Fachada", entrance: "Entrada", kitchen: "Cocina", living: "Salón", bedroom: "Dormitorio", bathroom: "Baño", terrace: "Terraza" },
  de: { facade: "Fassade", entrance: "Eingang", kitchen: "Küche", living: "Wohnzimmer", bedroom: "Schlafzimmer", bathroom: "Badezimmer", terrace: "Terrasse" },
};

const ROOM_WORD: Record<Locale, string> = { da: "Rum", en: "Room", es: "Sala", de: "Raum" };

const META_LABELS: Record<Locale, { beds: string; baths: string; guests: string; reviews: string; perNight: string }> = {
  da: { beds: "soveværelser", baths: "badeværelser", guests: "gæster", reviews: "anmeldelser", perNight: "/ nat" },
  en: { beds: "bedrooms", baths: "bathrooms", guests: "guests", reviews: "reviews", perNight: "/ night" },
  es: { beds: "dormitorios", baths: "baños", guests: "huéspedes", reviews: "reseñas", perNight: "/ noche" },
  de: { beds: "Schlafzimmer", baths: "Badezimmer", guests: "Gäste", reviews: "Bewertungen", perNight: "/ Nacht" },
};

const DEMO_TITLE_OVERRIDE: Record<Locale, string> = {
  da: "Strandnær villa · Alicante, Spanien",
  en: "Beachfront villa · Alicante, Spain",
  es: "Villa en primera línea · Alicante, España",
  de: "Strandvilla · Alicante, Spanien",
};

const HINTS: Record<Locale, string> = {
  da: "Scroll eller ↑ ↓ for at gå frem og tilbage · bevæg musen for at se dig omkring",
  en: "Scroll or ↑ ↓ to walk forward/back · move the mouse to look around",
  es: "Desplázate o usa ↑ ↓ para avanzar/retroceder · mueve el ratón para mirar alrededor",
  de: "Scrollen oder ↑ ↓ zum Vor-/Zurückgehen · Maus bewegen zum Umsehen",
};

// ── Color-grade filters (CSS filters on the canvas — GPU-accelerated) ──────
type FilterKey = "none" | "cinematic" | "warm" | "cool" | "vivid" | "vintage" | "mono";

const FILTERS: { key: FilterKey; css: string; label: Record<Locale, string> }[] = [
  { key: "none", css: "", label: { da: "Ingen", en: "None", es: "Ninguno", de: "Ohne" } },
  { key: "cinematic", css: "contrast(1.1) saturate(1.18) brightness(1.03)", label: { da: "Cinematic", en: "Cinematic", es: "Cinematic", de: "Cinematic" } },
  { key: "warm", css: "sepia(0.22) saturate(1.35) contrast(1.06) brightness(1.04)", label: { da: "Varm", en: "Warm", es: "Cálido", de: "Warm" } },
  { key: "cool", css: "hue-rotate(-10deg) saturate(1.12) contrast(1.08) brightness(1.02)", label: { da: "Kølig", en: "Cool", es: "Frío", de: "Kühl" } },
  { key: "vivid", css: "saturate(1.5) contrast(1.12)", label: { da: "Levende", en: "Vivid", es: "Vívido", de: "Lebendig" } },
  { key: "vintage", css: "sepia(0.35) contrast(0.98) brightness(1.06) saturate(1.15)", label: { da: "Vintage", en: "Vintage", es: "Vintage", de: "Vintage" } },
  { key: "mono", css: "grayscale(1) contrast(1.12) brightness(1.05)", label: { da: "S/H", en: "B/W", es: "B/N", de: "S/W" } },
];

// The default tour: bundled placeholder art that always works offline.
// Upgraded at runtime with real listing photos from /api/walkthrough-images.
const DEFAULT_SCENES: Scene[] = [
  { src: "/walkthrough/01-facade.svg", roomKey: "facade" },
  { src: "/walkthrough/02-entrance.svg", roomKey: "entrance" },
  { src: "/walkthrough/03-kitchen.svg", roomKey: "kitchen" },
  { src: "/walkthrough/04-living.svg", roomKey: "living" },
  { src: "/walkthrough/05-bedroom.svg", roomKey: "bedroom" },
  { src: "/walkthrough/06-bathroom.svg", roomKey: "bathroom" },
  { src: "/walkthrough/07-terrace.svg", roomKey: "terrace" },
];

// ── Auto-tour timeline ──────────────────────────────────────────────────────
const SCENE_DUR = 6;   // seconds each room is on screen
const FADE = 1.2;      // crossfade overlap between rooms

const sceneStart = (i: number) => i * (SCENE_DUR - FADE);
const totalDuration = (n: number) => (n > 0 ? n * (SCENE_DUR - FADE) + FADE : 0);

// Ken Burns variants: zoom from→to and pan across the image's slack space.
const KB_VARIANTS = [
  { z0: 1.08, z1: 1.24, p0: [0.25, 0.4], p1: [0.75, 0.6] },
  { z0: 1.26, z1: 1.08, p0: [0.7, 0.35], p1: [0.3, 0.6] },
  { z0: 1.08, z1: 1.22, p0: [0.5, 0.25], p1: [0.5, 0.75] },
  { z0: 1.22, z1: 1.08, p0: [0.35, 0.65], p1: [0.65, 0.35] },
] as const;

// ── First-person explore tuning ─────────────────────────────────────────────
const EXPLORE = {
  minZoom: 1.12,     // depth 0 — just stepped into the room
  maxZoom: 1.65,     // depth 1 — deep inside, about to walk through
  lookX: 0.5,        // how far the view pans sideways at full look
  lookY: 0.28,       // vertical look range
  wheelStep: 0.0016, // depth per wheel deltaY unit
  keyStep: 0.16,     // depth per arrow-key press
  walkDur: 0.75,     // seconds for the walk-through room transition
  parallax: 0.10,    // subtle mouse parallax while the auto tour plays
};

const easeInOut = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * u);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/** Preload images; silently drops any that fail so a dead URL never breaks the tour. */
function preloadScenes(scenes: Scene[]): Promise<LoadedScene[]> {
  return Promise.all(
    scenes.map(
      (s) =>
        new Promise<LoadedScene | null>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ img, roomKey: s.roomKey });
          img.onerror = () => resolve(null);
          img.src = s.src;
        }),
    ),
  ).then((all) => all.filter((x): x is LoadedScene => x !== null));
}

// ── Component ───────────────────────────────────────────────────────────────
export function CinematicWalkthrough({ locale = "da" }: { locale?: Locale }) {
  const labels = ROOM_LABELS[locale] ?? ROOM_LABELS.da;

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const [scenes, setScenes] = useState<LoadedScene[]>([]);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("auto");
  const [activeIdx, setActiveIdx] = useState(0);
  const [title, setTitle] = useState(DEMO_TITLE_OVERRIDE[locale] ?? DEMO_TITLE_OVERRIDE.da);
  const [filterKey, setFilterKey] = useState<FilterKey>("cinematic");
  const [meta, setMeta] = useState<{ price?: string; guests?: string; beds?: string; baths?: string; rating?: string; reviews?: string }>({});

  const activeFilter = FILTERS.find((f) => f.key === filterKey) ?? FILTERS[0];

  // Mutable playback/interaction state, read inside the rAF loop.
  const tRef = useRef(0);                                  // auto-tour clock
  const playingRef = useRef(false);
  const modeRef = useRef<Mode>("auto");
  const scenesRef = useRef<LoadedScene[]>([]);
  const dirtyRef = useRef(true);
  const seekingRef = useRef(false);

  // First-person explore state
  const roomRef = useRef(0);                               // which room we're standing in
  const depthRef = useRef(0.15);                           // 0 = doorway, 1 = about to pass through
  const lookRef = useRef({ x: 0, y: 0 });                  // smoothed look direction (-1..1)
  const lookTargetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const dragLookRef = useRef({ x: 0, y: 0 });              // extra look from dragging
  const walkRef = useRef<{ from: number; to: number; u: number } | null>(null);

  useEffect(() => { scenesRef.current = scenes; }, [scenes]);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  // The loader effect below runs once on mount but needs the *current* locale
  // for its fallback title; a dep would re-run the whole fetch on every switch.
  const localeRef = useRef(locale);
  useEffect(() => { localeRef.current = locale; }, [locale]);

  // ── Load the default (bundled) tour, then try to upgrade to listing photos ──
  useEffect(() => {
    let cancelled = false;

    preloadScenes(DEFAULT_SCENES).then((loaded) => {
      if (cancelled || loaded.length < 2) return;
      setScenes(loaded);
      setReady(true);
      dirtyRef.current = true;
    });

    // Progressive enhancement: real photos scraped from the listing (or curated
    // photo placeholders) — only swapped in once fully preloaded.
    fetch("/api/walkthrough-images")
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data: { title?: string; scenes?: Scene[]; price?: string; guests?: string; beds?: string; baths?: string; rating?: string; reviews?: string } | null) => {
        if (cancelled || !data?.scenes || data.scenes.length < 3) return;
        const loaded = await preloadScenes(data.scenes);
        if (cancelled || loaded.length < 3) return;
        setScenes(loaded);
        setReady(true);
        setTitle((data.title ? data.title.slice(0, 60) : null) ?? DEMO_TITLE_OVERRIDE[localeRef.current] ?? DEMO_TITLE_OVERRIDE.da);
        setMeta({ price: data.price, guests: data.guests, beds: data.beds, baths: data.baths, rating: data.rating, reviews: data.reviews });
        tRef.current = Math.min(tRef.current, totalDuration(loaded.length) - 0.01);
        roomRef.current = Math.min(roomRef.current, loaded.length - 1);
        dirtyRef.current = true;
      })
      .catch(() => { /* offline or blocked — bundled tour keeps working */ });

    return () => { cancelled = true; };
  }, []);

  // ── Canvas sizing (supersampled for sharpness) ────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ro = new ResizeObserver(() => {
      // Render at ≥2× CSS size (up to 3×) so the tour stays crisp on 1× displays.
      const scale = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
      canvas.width = Math.round(wrap.clientWidth * scale);
      canvas.height = Math.round(wrap.clientHeight * scale);
      dirtyRef.current = true;
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // ── Autoplay when scrolled into view (auto mode only) ─────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !ready) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (modeRef.current === "auto") setPlaying(entry.isIntersecting);
        else if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0.35 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [ready]);

  // ── Mode switching ────────────────────────────────────────────────────────
  const enterExplore = useCallback(() => {
    if (modeRef.current === "explore") return;
    // Stand in whichever room the auto tour is currently showing.
    const n = scenesRef.current.length;
    if (n > 0) {
      const idx = clamp(Math.floor(tRef.current / (SCENE_DUR - FADE)), 0, n - 1);
      roomRef.current = idx;
    }
    depthRef.current = 0.15;
    dragLookRef.current = { x: 0, y: 0 };
    walkRef.current = null;
    modeRef.current = "explore";
    setMode("explore");
    setPlaying(false);
    dirtyRef.current = true;
  }, []);

  const resumeAutoTour = useCallback(() => {
    tRef.current = sceneStart(roomRef.current) + 0.01;
    walkRef.current = null;
    modeRef.current = "auto";
    setMode("auto");
    setPlaying(true);
    dirtyRef.current = true;
  }, []);

  /** Walk through to an adjacent room (explore mode). */
  const startWalk = useCallback((dir: 1 | -1) => {
    const n = scenesRef.current.length;
    if (walkRef.current || n === 0) return;
    const to = roomRef.current + dir;
    if (to < 0 || to >= n) {
      // At the ends of the tour: stay in the room.
      depthRef.current = clamp(depthRef.current, 0, 1);
      return;
    }
    walkRef.current = { from: roomRef.current, to, u: 0 };
    dirtyRef.current = true;
  }, []);

  const changeDepth = useCallback((delta: number) => {
    if (walkRef.current) return; // ignore input mid-transition
    const d = depthRef.current + delta;
    if (d > 1) startWalk(1);
    else if (d < 0) startWalk(-1);
    else {
      depthRef.current = d;
      dirtyRef.current = true;
    }
  }, [startWalk]);

  // ── Wheel = walk forward/back (non-passive so we can keep the page still) ──
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      enterExplore();
      changeDepth(e.deltaY * EXPLORE.wheelStep);
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, [enterExplore, changeDepth]);

  // ── Keyboard: arrows/WASD walk & look, space toggles the tour ─────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (k === " " || k === "Spacebar") {
      e.preventDefault();
      if (modeRef.current === "explore") resumeAutoTour();
      else setPlaying((p) => !p);
      return;
    }
    if (["ArrowUp", "w", "W"].includes(k)) {
      e.preventDefault(); enterExplore(); changeDepth(EXPLORE.keyStep);
    } else if (["ArrowDown", "s", "S"].includes(k)) {
      e.preventDefault(); enterExplore(); changeDepth(-EXPLORE.keyStep);
    } else if (["ArrowLeft", "a", "A"].includes(k)) {
      e.preventDefault(); enterExplore();
      dragLookRef.current.x = clamp(dragLookRef.current.x - 0.3, -1.2, 1.2);
      dirtyRef.current = true;
    } else if (["ArrowRight", "d", "D"].includes(k)) {
      e.preventDefault(); enterExplore();
      dragLookRef.current.x = clamp(dragLookRef.current.x + 0.3, -1.2, 1.2);
      dirtyRef.current = true;
    }
  }, [enterExplore, changeDepth, resumeAutoTour]);

  // ── Mouse look: hover = glance, drag = turn your head further ─────────────
  const onCanvasPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
    const ny = clamp(((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);

    if (dragRef.current && e.pointerId === dragRef.current.id) {
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      if (Math.abs(dx) + Math.abs(dy) > 2) enterExplore();
      // Drag left → look right, like grabbing the scene.
      dragLookRef.current.x = clamp(dragLookRef.current.x - (dx / rect.width) * 2.4, -1.2, 1.2);
      dragLookRef.current.y = clamp(dragLookRef.current.y - (dy / rect.height) * 1.6, -1, 1);
    }
    lookTargetRef.current = { x: nx, y: ny };
    dirtyRef.current = true;
  }, [enterExplore]);

  const onCanvasPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  const onCanvasPointerUp = useCallback(() => { dragRef.current = null; }, []);
  const onCanvasPointerLeave = useCallback(() => {
    dragRef.current = null;
    lookTargetRef.current = { x: 0, y: 0 };
    dirtyRef.current = true;
  }, []);

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    // Draw one room image with an explicit camera (zoom + pan position 0..1).
    const drawCamera = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      zoom: number,
      px: number,
      py: number,
      alpha: number,
      cw: number,
      ch: number,
    ) => {
      const base = Math.max(cw / img.width, ch / img.height);
      const scale = base * zoom;
      const dw = img.width * scale;
      const dh = img.height * scale;
      const x = -(dw - cw) * clamp(px, 0, 1);
      const y = -(dh - ch) * clamp(py, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, x, y, dw, dh);
      ctx.globalAlpha = 1;
    };

    // Camera for the auto tour's Ken Burns motion + gentle mouse parallax.
    const autoCamera = (idx: number, t: number) => {
      const u = easeInOut(clamp((t - sceneStart(idx)) / SCENE_DUR, 0, 1));
      const kb = KB_VARIANTS[idx % KB_VARIANTS.length];
      return {
        zoom: lerp(kb.z0, kb.z1, u),
        px: lerp(kb.p0[0], kb.p1[0], u) + lookRef.current.x * EXPLORE.parallax,
        py: lerp(kb.p0[1], kb.p1[1], u) + lookRef.current.y * EXPLORE.parallax * 0.6,
      };
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const list = scenesRef.current;
      const canvas = canvasRef.current;
      if (!canvas || list.length === 0) return;
      const n = list.length;
      const total = totalDuration(n);
      const explore = modeRef.current === "explore";

      // Advance the auto tour clock.
      if (!explore && playingRef.current && !seekingRef.current) {
        tRef.current = (tRef.current + dt) % total; // loop the tour
        dirtyRef.current = true;
      }

      // Smooth the look direction toward its target.
      const k = 1 - Math.exp(-dt * 5);
      const look = lookRef.current;
      const tx = clamp(lookTargetRef.current.x + dragLookRef.current.x, -1.3, 1.3);
      const ty = clamp(lookTargetRef.current.y + dragLookRef.current.y, -1.1, 1.1);
      if (Math.abs(look.x - tx) > 0.001 || Math.abs(look.y - ty) > 0.001) {
        look.x = lerp(look.x, tx, k);
        look.y = lerp(look.y, ty, k);
        dirtyRef.current = true;
      }

      // Advance a walk-through transition.
      const walk = walkRef.current;
      if (walk) {
        walk.u = Math.min(walk.u + dt / EXPLORE.walkDur, 1);
        dirtyRef.current = true;
        if (walk.u >= 1) {
          roomRef.current = walk.to;
          depthRef.current = walk.to > walk.from ? 0.08 : 0.85;
          walkRef.current = null;
        }
      }

      if (!dirtyRef.current) return;
      dirtyRef.current = false;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      let visIdx: number;

      if (!explore) {
        // ── Auto tour: Ken Burns timeline with crossfades ──
        const t = tRef.current;
        const idx = clamp(Math.floor(t / (SCENE_DUR - FADE)), 0, n - 1);
        const nextIdx = idx + 1;
        const nextT = nextIdx < n ? t - sceneStart(nextIdx) : -1;

        const cam = autoCamera(idx, t);
        drawCamera(ctx, list[idx].img, cam.zoom, cam.px, cam.py, 1, cw, ch);
        if (nextT >= 0) {
          const cam2 = autoCamera(nextIdx, t);
          drawCamera(ctx, list[nextIdx].img, cam2.zoom, cam2.px, cam2.py, clamp(nextT / FADE, 0, 1), cw, ch);
        }

        visIdx = nextT >= 0 && nextT / FADE > 0.5 ? nextIdx : idx;
        if (fillRef.current) fillRef.current.style.width = `${(t / total) * 100}%`;
        if (timeRef.current) timeRef.current.textContent = `${formatTime(t)} / ${formatTime(total)}`;
      } else {
        // ── First-person explore: stand in the room, look around, walk ──
        const px = 0.5 + look.x * EXPLORE.lookX;
        const py = 0.5 + look.y * EXPLORE.lookY;

        if (walk) {
          const u = easeInOut(walk.u);
          const forward = walk.to > walk.from;
          if (forward) {
            // Push deeper into the current room while the next one opens up.
            const zOut = lerp(EXPLORE.maxZoom, EXPLORE.maxZoom + 0.5, u);
            const zIn = lerp(EXPLORE.minZoom - 0.06, EXPLORE.minZoom + 0.08 * 0.5, u);
            drawCamera(ctx, list[walk.from].img, zOut, px, py, 1 - u, cw, ch);
            drawCamera(ctx, list[walk.to].img, zIn, px, py, u, cw, ch);
          } else {
            // Step back out: current room recedes, previous room closes in.
            const zOut = lerp(EXPLORE.minZoom, EXPLORE.minZoom - 0.08, u);
            const zIn = lerp(EXPLORE.maxZoom + 0.3, lerp(EXPLORE.minZoom, EXPLORE.maxZoom, 0.85), u);
            drawCamera(ctx, list[walk.from].img, zOut, px, py, 1 - u, cw, ch);
            drawCamera(ctx, list[walk.to].img, zIn, px, py, u, cw, ch);
          }
          visIdx = walk.u > 0.5 ? walk.to : walk.from;
        } else {
          const zoom = lerp(EXPLORE.minZoom, EXPLORE.maxZoom, easeInOut(depthRef.current));
          drawCamera(ctx, list[roomRef.current].img, zoom, px, py, 1, cw, ch);
          visIdx = roomRef.current;
        }

        const progress = (clamp(visIdx + (walk ? walk.u : depthRef.current), 0, n)) / n;
        if (fillRef.current) fillRef.current.style.width = `${progress * 100}%`;
        if (timeRef.current) timeRef.current.textContent = `${ROOM_WORD[locale] ?? "Rum"} ${visIdx + 1} / ${n}`;
      }

      // Soft vignette at the bottom so overlaid controls stay readable.
      const grad = ctx.createLinearGradient(0, ch * 0.72, 0, ch);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, ch * 0.72, cw, ch * 0.28);

      setActiveIdx((prev) => (prev === visIdx ? prev : visIdx));
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [locale]);

  // ── Progress-bar seeking (returns to the auto tour) ───────────────────────
  const seekToFraction = useCallback((clientX: number, track: HTMLDivElement) => {
    const rect = track.getBoundingClientRect();
    const frac = clamp((clientX - rect.left) / rect.width, 0, 1);
    const total = totalDuration(scenesRef.current.length);
    tRef.current = clamp(frac * total, 0, total - 0.01);
    if (modeRef.current !== "auto") {
      walkRef.current = null;
      modeRef.current = "auto";
      setMode("auto");
    }
    dirtyRef.current = true;
  }, []);

  const onTrackPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const track = e.currentTarget;
      track.setPointerCapture(e.pointerId);
      seekingRef.current = true;
      seekToFraction(e.clientX, track);
    },
    [seekToFraction],
  );

  const onTrackPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (seekingRef.current) seekToFraction(e.clientX, e.currentTarget);
    },
    [seekToFraction],
  );

  const onTrackPointerUp = useCallback(() => { seekingRef.current = false; }, []);

  const jumpToScene = useCallback((i: number) => {
    if (modeRef.current === "explore") {
      // Step directly into that room.
      roomRef.current = i;
      depthRef.current = 0.12;
      dragLookRef.current = { x: 0, y: 0 };
      walkRef.current = null;
      dirtyRef.current = true;
      setActiveIdx(i);
    } else {
      tRef.current = sceneStart(i) + 0.01;
      dirtyRef.current = true;
      setPlaying(true);
    }
  }, []);

  const onPlayButton = useCallback(() => {
    if (modeRef.current === "explore") resumeAutoTour();
    else setPlaying((p) => !p);
  }, [resumeAutoTour]);

  const currentRoom = scenes[activeIdx] ? labels[scenes[activeIdx].roomKey] : "";
  const showPlayIcon = mode === "explore" || !playing;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* ── Phone frame with 9:16 video canvas ── */}
      <div className="relative w-full overflow-hidden rounded-[2.5rem] border-4 border-white/10 bg-black shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div
          ref={wrapRef}
          tabIndex={0}
          role="application"
          aria-label="Interactive walkthrough"
          onKeyDown={onKeyDown}
          className="relative w-full select-none overflow-hidden bg-[#0a1428] outline-none"
          style={{ aspectRatio: "9 / 16" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
            style={activeFilter.css ? { filter: activeFilter.css } : undefined}
            onPointerMove={onCanvasPointerMove}
            onPointerDown={onCanvasPointerDown}
            onPointerUp={onCanvasPointerUp}
            onPointerCancel={onCanvasPointerUp}
            onPointerLeave={onCanvasPointerLeave}
          />

          {/* Top overlay: title + current room (below the phone notch) */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-3 pt-9">
            <p className="truncate text-[11px] font-semibold text-white">{title}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {currentRoom}
              </span>
              {mode === "explore" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-300 backdrop-blur-sm">
                  <Move size={8} /> Walk
                </span>
              )}
            </div>
          </div>

          {/* Loading state */}
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-orange-300" />
            </div>
          )}

          {/* Center play button when the auto tour is paused */}
          {ready && !playing && mode === "auto" && (
            <button
              type="button"
              aria-label="Play"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-transform hover:scale-105"
            >
              <Play size={26} className="ml-0.5 text-white" fill="white" />
            </button>
          )}

          {/* Property info panel */}
          {ready && (meta.price || meta.rating) && (
            <div className="pointer-events-none absolute left-0 right-0 bottom-10 px-3">
              {(() => { const ml = META_LABELS[locale] ?? META_LABELS.da; return (
              <div className="flex items-end justify-between gap-2">
                {/* Left: price + rooms */}
                <div className="rounded-xl border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-md">
                  {meta.price && <p className="text-[11px] font-bold text-white">{meta.price} <span className="text-[9px] font-normal text-white/60">{ml.perNight}</span></p>}
                  <div className="flex items-center gap-2 mt-0.5">
                    {meta.beds && <span className="text-[9px] text-white/60">🛏 {meta.beds} {ml.beds}</span>}
                    {meta.baths && <span className="text-[9px] text-white/60">🚿 {meta.baths} {ml.baths}</span>}
                    {meta.guests && <span className="text-[9px] text-white/60">👥 {meta.guests} {ml.guests}</span>}
                  </div>
                </div>
                {/* Right: rating */}
                {meta.rating && (
                  <div className="rounded-xl border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-md text-right">
                    <p className="text-[11px] font-bold text-white">⭐ {meta.rating}</p>
                    {meta.reviews && <p className="text-[9px] text-white/60">{meta.reviews} {ml.reviews}</p>}
                  </div>
                )}
              </div>
              ); })()}
            </div>
          )}

          {/* Bottom controls: play/pause + scrubber + status */}
          {ready && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-3">
              <button
                type="button"
                aria-label={showPlayIcon ? "Play" : "Pause"}
                onClick={onPlayButton}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                {showPlayIcon
                  ? <Play size={13} className="ml-0.5" fill="white" />
                  : <Pause size={13} fill="white" />}
              </button>
              <div
                role="slider"
                aria-label="Progress"
                aria-valuemin={0}
                aria-valuemax={scenes.length}
                aria-valuenow={activeIdx}
                onPointerDown={onTrackPointerDown}
                onPointerMove={onTrackPointerMove}
                onPointerUp={onTrackPointerUp}
                className="group flex h-6 flex-1 cursor-pointer touch-none items-center"
              >
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/25 transition-all group-hover:h-1.5">
                  <div
                    ref={fillRef}
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ width: "0%", background: "linear-gradient(90deg, #FFB36B, #FF6B4A)" }}
                  />
                </div>
              </div>
              <span ref={timeRef} className="shrink-0 text-[10px] font-medium tabular-nums text-white/80">
                0:00 / 0:00
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Interaction hint ── */}
      <p className="max-w-[340px] text-center text-[10px] leading-relaxed text-slate-500">
        {HINTS[locale] ?? HINTS.da}
      </p>

      {/* ── Room chips: click to step into that room ── */}
      <div className="flex max-w-[360px] flex-wrap justify-center gap-1.5">
        {scenes.map((s, i) => (
          <button
            key={`${s.roomKey}-${i}`}
            type="button"
            onClick={() => jumpToScene(i)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
              i === activeIdx
                ? "text-white shadow-lg"
                : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
            style={i === activeIdx ? { background: "linear-gradient(135deg, #FFB36B, #FF6B4A)" } : undefined}
          >
            {labels[s.roomKey]}
          </button>
        ))}
      </div>

      {/* ── Filter picker: try different color grades on the tour ── */}
      <div className="flex max-w-[360px] flex-wrap items-center justify-center gap-1.5">
        <SlidersHorizontal size={12} className="shrink-0 text-slate-500" aria-hidden />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={f.key === filterKey}
            onClick={() => setFilterKey(f.key)}
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all ${
              f.key === filterKey
                ? "border border-orange-400/60 bg-orange-500/15 text-orange-300"
                : "border border-white/10 bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label[locale] ?? f.label.da}
          </button>
        ))}
      </div>
    </div>
  );
}
