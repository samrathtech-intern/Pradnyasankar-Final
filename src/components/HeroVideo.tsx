"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Brand scenes — one per theme ─────────────────────────────────────── */
const scenes = [
  {
    id: "ayurveda",
    label: "Rooted in Ayurveda",
    sub: "Ancient wisdom, modern clarity",
    bg: "from-[#1A0040] via-[#2E0569] to-[#3D0880]",
    orb1: "bg-[#8C52FF]/40",
    orb2: "bg-[#FFBB58]/20",
    ring1: "border-[#8C52FF]/25",
    ring2: "border-[#FFBB58]/15",
    particles: ["#FFBB58", "#C9A0FF", "#FFBB58", "#8C52FF", "#FFD98A"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Leaf */}
        <path d="M32 8 C18 14 10 28 14 44 C20 36 28 28 44 24 C38 16 32 8 32 8Z" fill="rgba(140,82,255,.55)" />
        <path d="M32 8 C32 8 32 32 20 48" stroke="rgba(255,187,88,.8)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="8" r="3" fill="#FFBB58" />
        <circle cx="20" cy="48" r="2" fill="rgba(255,187,88,.6)" />
      </svg>
    ),
  },
  {
    id: "nutraceuticals",
    label: "Precision Nutraceuticals",
    sub: "Science-backed formulations",
    bg: "from-[#0A1A2E] via-[#0D2545] to-[#1A3A5C]",
    orb1: "bg-[#3B82F6]/35",
    orb2: "bg-[#8C52FF]/25",
    ring1: "border-[#3B82F6]/20",
    ring2: "border-[#8C52FF]/15",
    particles: ["#93C5FD", "#C9A0FF", "#93C5FD", "#8C52FF", "#BFDBFE"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Capsule */}
        <rect x="14" y="26" width="36" height="12" rx="6" fill="rgba(59,130,246,.5)" />
        <rect x="14" y="26" width="18" height="12" rx="6" fill="rgba(140,82,255,.6)" />
        <circle cx="32" cy="14" r="5" fill="rgba(59,130,246,.4)" />
        <circle cx="20" cy="50" r="3" fill="rgba(140,82,255,.4)" />
        <circle cx="44" cy="50" r="3" fill="rgba(59,130,246,.4)" />
        <line x1="32" y1="19" x2="32" y2="26" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "wellness",
    label: "Everyday Wellness",
    sub: "Balanced living, every day",
    bg: "from-[#0D2010] via-[#1A3A1A] to-[#0F2A18]",
    orb1: "bg-[#4ADE80]/30",
    orb2: "bg-[#FFBB58]/20",
    ring1: "border-[#4ADE80]/20",
    ring2: "border-[#FFBB58]/15",
    particles: ["#86EFAC", "#FFBB58", "#4ADE80", "#FDE68A", "#BBF7D0"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Heart with pulse */}
        <path d="M32 50 C32 50 10 36 10 22 C10 15 16 10 22 12 C26 13 30 17 32 20 C34 17 38 13 42 12 C48 10 54 15 54 22 C54 36 32 50 32 50Z" fill="rgba(74,222,128,.45)" />
        <polyline points="18,32 24,26 28,34 34,20 38,30 44,30" stroke="rgba(255,187,88,.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "ingredients",
    label: "Natural Ingredients",
    sub: "Botanicals, pure and traceable",
    bg: "from-[#1A1000] via-[#2E1A00] to-[#3D2400]",
    orb1: "bg-[#F59E0B]/35",
    orb2: "bg-[#84CC16]/20",
    ring1: "border-[#F59E0B]/20",
    ring2: "border-[#84CC16]/15",
    particles: ["#FCD34D", "#BEF264", "#F59E0B", "#A3E635", "#FDE68A"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Flower / botanical */}
        <circle cx="32" cy="32" r="6" fill="rgba(245,158,11,.7)" />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <ellipse
            key={i}
            cx={32 + 14 * Math.cos((deg * Math.PI) / 180)}
            cy={32 + 14 * Math.sin((deg * Math.PI) / 180)}
            rx="5"
            ry="8"
            transform={`rotate(${deg} ${32 + 14 * Math.cos((deg * Math.PI) / 180)} ${32 + 14 * Math.sin((deg * Math.PI) / 180)})`}
            fill="rgba(132,204,22,.45)"
          />
        ))}
      </svg>
    ),
  },
  {
    id: "science",
    label: "Scientific Formulation",
    sub: "Research-led, responsibly made",
    bg: "from-[#0A0A1A] via-[#12122E] to-[#1A1A40]",
    orb1: "bg-[#818CF8]/35",
    orb2: "bg-[#C084FC]/20",
    ring1: "border-[#818CF8]/20",
    ring2: "border-[#C084FC]/15",
    particles: ["#A5B4FC", "#E879F9", "#818CF8", "#C084FC", "#DDD6FE"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Flask */}
        <path d="M24 10 L24 30 L14 50 L50 50 L40 30 L40 10 Z" fill="rgba(129,140,248,.35)" stroke="rgba(129,140,248,.6)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 50 L50 50 L42 34 L22 34 Z" fill="rgba(192,132,252,.4)" />
        <line x1="22" y1="10" x2="42" y2="10" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="42" r="2.5" fill="rgba(255,255,255,.5)" />
        <circle cx="36" cy="44" r="1.5" fill="rgba(255,187,88,.7)" />
        <circle cx="32" cy="40" r="1.5" fill="rgba(255,255,255,.4)" />
      </svg>
    ),
  },
  {
    id: "lifestyle",
    label: "Healthy Lifestyle",
    sub: "Wellness woven into every moment",
    bg: "from-[#1A0A00] via-[#2E1500] to-[#3D1E00]",
    orb1: "bg-[#FB923C]/30",
    orb2: "bg-[#FBBF24]/20",
    ring1: "border-[#FB923C]/20",
    ring2: "border-[#FBBF24]/15",
    particles: ["#FED7AA", "#FDE68A", "#FB923C", "#FBBF24", "#FDBA74"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Sun / lifestyle */}
        <circle cx="32" cy="32" r="10" fill="rgba(251,146,60,.6)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line
            key={i}
            x1={32 + 14 * Math.cos((deg * Math.PI) / 180)}
            y1={32 + 14 * Math.sin((deg * Math.PI) / 180)}
            x2={32 + 22 * Math.cos((deg * Math.PI) / 180)}
            y2={32 + 22 * Math.sin((deg * Math.PI) / 180)}
            stroke="rgba(251,191,36,.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
  },
  {
    id: "gifting",
    label: "Premium Gifting",
    sub: "Thoughtfully chosen, beautifully shared",
    bg: "from-[#1A0A14] via-[#2E0F22] to-[#3D1530]",
    orb1: "bg-[#F472B6]/30",
    orb2: "bg-[#FFBB58]/20",
    ring1: "border-[#F472B6]/20",
    ring2: "border-[#FFBB58]/15",
    particles: ["#FBCFE8", "#FFBB58", "#F472B6", "#FDE68A", "#FCA5A5"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Gift box */}
        <rect x="12" y="28" width="40" height="26" rx="3" fill="rgba(244,114,182,.4)" stroke="rgba(244,114,182,.6)" strokeWidth="1.5" />
        <rect x="10" y="20" width="44" height="10" rx="3" fill="rgba(244,114,182,.5)" stroke="rgba(244,114,182,.6)" strokeWidth="1.5" />
        <line x1="32" y1="20" x2="32" y2="54" stroke="rgba(255,187,88,.8)" strokeWidth="2" />
        <line x1="12" y1="25" x2="52" y2="25" stroke="rgba(255,187,88,.8)" strokeWidth="2" />
        {/* Bow */}
        <path d="M32 20 C28 14 20 14 22 20" stroke="rgba(255,187,88,.9)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M32 20 C36 14 44 14 42 20" stroke="rgba(255,187,88,.9)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="20" r="2.5" fill="#FFBB58" />
      </svg>
    ),
  },
] as const;

/* ─── Particle positions (stable, not random) ──────────────────────────── */
const PARTICLE_POSITIONS = [
  { top: "12%", left: "8%",  size: 10, dur: 3.2, delay: 0 },
  { top: "78%", left: "15%", size: 7,  dur: 4.1, delay: 0.7 },
  { top: "22%", left: "82%", size: 12, dur: 3.8, delay: 1.2 },
  { top: "68%", left: "88%", size: 8,  dur: 4.6, delay: 0.3 },
  { top: "45%", left: "5%",  size: 6,  dur: 3.5, delay: 1.8 },
  { top: "35%", left: "92%", size: 9,  dur: 4.0, delay: 0.9 },
  { top: "88%", left: "55%", size: 7,  dur: 3.3, delay: 2.1 },
  { top: "8%",  left: "60%", size: 11, dur: 4.4, delay: 0.5 },
];

/* ─── Grid lines (cinematic scan-line feel) ─────────────────────────────── */
function GridLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[.04]"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Vertical */}
      {[16.6, 33.3, 50, 66.6, 83.3].map((x) => (
        <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="white" strokeWidth="1" />
      ))}
      {/* Horizontal */}
      {[25, 50, 75].map((y) => (
        <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="white" strokeWidth="1" />
      ))}
    </svg>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
interface HeroVideoProps {
  /**
   * Path to your MP4 file — e.g. "/videos/hero.mp4"
   * Leave undefined to show the animated brand placeholder.
   */
  src?: string;
  className?: string;
  /**
   * Custom overlay gradient. Defaults to a left-heavy brand gradient
   * so the text column stays readable on both light and dark backgrounds.
   */
  overlayClassName?: string;
}

export function HeroVideo({
  src,
  className = "",
  overlayClassName,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);

  /* Cycle scenes every 4 s when no real video */
  useEffect(() => {
    if (src && !videoError) return;
    const t = window.setInterval(
      () => setSceneIndex((i) => (i + 1) % scenes.length),
      4000,
    );
    return () => window.clearInterval(t);
  }, [src, videoError]);

  /* Autoplay real video */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {/* blocked — first frame still shows */});
  }, [src]);

  const showVideo = !!src && !videoError;
  const scene = scenes[sceneIndex];

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">

      {/* ── REAL VIDEO ── */}
      {showVideo && (
        <motion.video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoError(true)}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={videoReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* ── CINEMATIC PLACEHOLDER ── */}
      {(!showVideo || !videoReady) && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Scene background cross-fade */}
          <AnimatePresence mode="sync">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className={`absolute inset-0 bg-gradient-to-br ${scene.bg}`}
            />
          </AnimatePresence>

          {/* Subtle grid */}
          <GridLines />

          {/* Orb 1 — large, slow pulse */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`orb1-${scene.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [1, 1.12, 1] }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
              className={`absolute left-[10%] top-[15%] h-[55%] w-[55%] rounded-full ${scene.orb1} blur-[80px]`}
            />
          </AnimatePresence>

          {/* Orb 2 — smaller, offset */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`orb2-${scene.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [1, 1.18, 1] }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
              className={`absolute bottom-[10%] right-[8%] h-[40%] w-[40%] rounded-full ${scene.orb2} blur-[60px]`}
            />
          </AnimatePresence>

          {/* Rotating outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className={`absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed ${scene.ring1}`}
          />

          {/* Rotating inner ring (opposite) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className={`absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border ${scene.ring2}`}
          />

          {/* Scene icon — centre */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`icon-${scene.id}`}
              initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
              animate={{ opacity: 0.18, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2"
            >
              {scene.icon}
            </motion.div>
          </AnimatePresence>

          {/* Floating particles */}
          {PARTICLE_POSITIONS.map((p, i) => (
            <motion.span
              key={`${scene.id}-p${i}`}
              animate={{ y: [0, -(p.size * 1.8), 0], opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
              className="absolute rounded-full"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: scene.particles[i % scene.particles.length],
              }}
            />
          ))}

          {/* Scene label — bottom right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`label-${scene.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-8 right-8 text-right"
            >
              <p className="text-[9px] font-extrabold uppercase tracking-[.22em] text-[#FFBB58]">
                {scene.label}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">
                {scene.sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Scene progress dots — bottom centre */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {scenes.map((s, i) => (
              <motion.span
                key={s.id}
                animate={i === sceneIndex ? { width: 24, opacity: 1 } : { width: 6, opacity: 0.35 }}
                transition={{ duration: 0.4 }}
                className="h-1 rounded-full bg-white"
                style={{ display: "block" }}
              />
            ))}
          </div>

          {/* "Video ready" hint — very subtle, bottom left */}
          <div className="absolute bottom-8 left-8">
            <p className="text-[9px] font-semibold uppercase tracking-[.18em] text-white/25">
              Place video at{" "}
              <span className="text-white/40">/public/videos/hero.mp4</span>
            </p>
          </div>
        </div>
      )}

      {/* ── OVERLAY (always present — keeps text readable) ── */}
      <div
        className={
          overlayClassName ??
          [
            "absolute inset-0 pointer-events-none",
            /* Left column: strong cream fade so dark text stays legible */
            "bg-gradient-to-r",
            "from-[#FFFDF7]/95 via-[#FFFDF7]/70 to-[#FFFDF7]/15",
            "lg:from-[#FFFDF7]/90 lg:via-[#FFFDF7]/55 lg:to-transparent",
          ].join(" ")
        }
      />
    </div>
  );
}
