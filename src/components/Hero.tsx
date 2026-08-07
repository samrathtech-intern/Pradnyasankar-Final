"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CircleCheck, Sparkles } from "lucide-react";
import { heroSlides } from "@/data";
import { HeroVideo } from "./HeroVideo";

/* ─────────────────────────────────────────────
   Drop your MP4 here when ready:
   Place the file at  /public/videos/hero.mp4
   Then change the line below to:
     const HERO_VIDEO_SRC = "/videos/hero.mp4";
───────────────────────────────────────────── */
const HERO_VIDEO_SRC: string | undefined = undefined;

export function Hero() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* Parallax: video moves up slightly as user scrolls down */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        setPrevActive(current);
        return (current + 1) % heroSlides.length;
      });
    }, 7200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const slide = heroSlides[active];

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#1A0040]"
    >
      {/* ── VIDEO BACKGROUND LAYER ── */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: videoY, scale: videoScale }}
        className="absolute inset-0 z-0"
      >
        <HeroVideo
          src={HERO_VIDEO_SRC}
          className="absolute inset-0"
        />
      </motion.div>

      {/* ── Radial gradients — sit above video/placeholder, below content ── */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_0%_50%,rgba(255,253,247,.18),transparent_70%)]" />
      </div>

      {/* ── Main content grid ── */}
      <div className="container-page relative z-10 grid min-h-[780px] items-center gap-8 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-24 xl:min-h-[860px]">

        {/* Left: Text content */}
        <div className="relative max-w-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eyebrow badge */}
              <motion.span
                className="eyebrow"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <Sparkles size={13} className="text-[#8C52FF]" /> {slide.eyebrow}
              </motion.span>

              {/* Headline */}
              <h1 className="mt-7 text-[clamp(38px,6.4vw,92px)] font-extrabold leading-[.94] tracking-[-.068em] text-[#21182B] drop-shadow-[0_2px_24px_rgba(255,253,247,.15)]">
                {slide.titleLead}
                <br />
                <span className="relative inline-block font-display font-semibold italic text-[#8C52FF]">
                  {slide.accent}
                  <svg
                    className="absolute -bottom-2 left-0 h-[14px] w-full text-[#FFBB58]"
                    viewBox="0 0 300 22"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 15c80-14 182-10 294-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                <span className="text-[#21182B]">{slide.titleEnd}</span>
              </h1>

              {/* Body copy */}
              <p className="mt-8 max-w-[600px] text-[15px] leading-[1.9] text-[#3D3244] sm:text-[17px]">
                {slide.copy}
              </p>

              {/* CTA buttons */}
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#featured" className="btn-primary group">
                  {slide.primary}
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href={active === 0 ? "#wellness-focus" : active === 1 ? "#routines" : "#wellness-sets"}
                  className="btn-secondary"
                >
                  {slide.secondary}
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 grid max-w-[680px] grid-cols-2 gap-3 border-t border-[#2E0569]/[.12] pt-7 sm:flex sm:flex-wrap sm:gap-x-6">
                {["Ayurveda", "Nutraceuticals", "Clear composition", "Responsible information"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#2E0569]/80 sm:text-[10px]"
                  >
                    <CircleCheck size={14} className="text-[#8C52FF]" /> {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Image composition */}
        <div className="relative min-h-[380px] sm:min-h-[500px] lg:min-h-[710px]">

          {/* ── Ambient depth glow — sits behind the blob, fills dead space ── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-8%] rounded-full bg-[radial-gradient(ellipse_62%_55%_at_52%_50%,rgba(140,82,255,.13),transparent_72%)] blur-[2px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-4%] rounded-full bg-[radial-gradient(ellipse_45%_40%_at_48%_52%,rgba(255,187,88,.09),transparent_68%)]"
          />

          {/* ── Botanical SVG motif — upper-right dead zone ── */}
          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { opacity: [0.28, 0.42, 0.28], rotate: [0, 2, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute right-[-2%] top-[2%] z-10 h-28 w-28 opacity-30"
          >
            <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="56" cy="56" r="52" stroke="#8C52FF" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
              <path d="M56 14 C56 14 72 32 72 56 C72 80 56 98 56 98" stroke="#FFBB58" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              <path d="M56 14 C56 14 40 32 40 56 C40 80 56 98 56 98" stroke="#8C52FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
              <path d="M14 56 C14 56 32 40 56 40 C80 40 98 56 98 56" stroke="#FFBB58" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
              <circle cx="56" cy="56" r="4" fill="#8C52FF" opacity="0.35" />
              <circle cx="56" cy="14" r="2.5" fill="#FFBB58" opacity="0.5" />
              <circle cx="56" cy="98" r="2.5" fill="#FFBB58" opacity="0.5" />
              <circle cx="14" cy="56" r="2" fill="#8C52FF" opacity="0.4" />
              <circle cx="98" cy="56" r="2" fill="#8C52FF" opacity="0.4" />
            </svg>
          </motion.div>

          {/* ── Botanical SVG motif — lower-left dead zone ── */}
          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { opacity: [0.22, 0.34, 0.22], rotate: [0, -3, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="pointer-events-none absolute bottom-[8%] left-[-1%] z-10 h-20 w-20 opacity-25"
          >
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 8 Q58 24 58 40 Q58 58 40 72 Q22 58 22 40 Q22 24 40 8Z" stroke="#8C52FF" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M8 40 Q24 22 40 22 Q58 22 72 40" stroke="#FFBB58" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55" />
              <circle cx="40" cy="40" r="3" fill="#FFBB58" opacity="0.4" />
              <circle cx="40" cy="8" r="2" fill="#8C52FF" opacity="0.35" />
            </svg>
          </motion.div>

          {/* ── Ambient dot particles ── */}
          {[
            { top: "6%",  left: "12%",  size: "h-1.5 w-1.5", color: "bg-[#FFBB58]", delay: 0,   dur: 6  },
            { top: "18%", right: "8%",  size: "h-1 w-1",     color: "bg-[#8C52FF]", delay: 1.2, dur: 8  },
            { top: "72%", left: "8%",   size: "h-1 w-1",     color: "bg-[#FFBB58]", delay: 0.6, dur: 7  },
            { top: "82%", right: "6%",  size: "h-1.5 w-1.5", color: "bg-[#8C52FF]", delay: 2,   dur: 9  },
            { top: "44%", left: "3%",   size: "h-1 w-1",     color: "bg-white",      delay: 1.5, dur: 11 },
          ].map((dot, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              animate={reduce ? undefined : { y: [0, -6, 0], opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
              className={`pointer-events-none absolute z-10 rounded-full ${dot.size} ${dot.color} shadow-[0_0_6px_2px_rgba(140,82,255,.18)]`}
              style={{ top: dot.top, left: (dot as { left?: string }).left, right: (dot as { right?: string }).right }}
            />
          ))}

          {/* ── Glassmorphism micro-card: top-left ── */}
          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="pointer-events-none absolute left-[-2%] top-[22%] z-20 hidden lg:block"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-3.5 py-2.5 shadow-[0_8px_28px_rgba(46,5,105,.10)] backdrop-blur-md">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              </span>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">Origin</p>
                <p className="text-[11px] font-semibold text-[#2E0569]">Ayurvedic roots</p>
              </div>
            </div>
          </motion.div>

          {/* ── Glassmorphism micro-card: right-middle ── */}
          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
            className="pointer-events-none absolute right-[-3%] top-[38%] z-20 hidden lg:block"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-3.5 py-2.5 shadow-[0_8px_28px_rgba(46,5,105,.10)] backdrop-blur-md">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FFF4E0] text-[#F08C26]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
              </span>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#F08C26]">Wellness</p>
                <p className="text-[11px] font-semibold text-[#2E0569]">3 ranges</p>
              </div>
            </div>
          </motion.div>

          {/* Outer glow ring */}
          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[0%] rounded-[48%_52%_43%_57%/37%_40%_60%_63%] bg-[#8C52FF]/[.07]"
          />

          {/* Floating amber orb */}
          <motion.span
            animate={reduce ? undefined : { y: [0, -10, 0], x: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[3%] top-[8%] z-20 h-16 w-16 rounded-full bg-[#FFBB58] shadow-[0_18px_40px_rgba(255,187,88,.40)]"
          />

          {/* Spinning ring */}
          <motion.span
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute left-[2%] top-[16%] z-20 h-14 w-14 rounded-full border-[14px] border-[#8C52FF]/35"
          />

          {/* Blob shape */}
          <motion.div
            animate={reduce ? undefined : { rotate: [0, 1, 0], scale: [1, 1.01, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[2%] rounded-[48%_52%_43%_57%/37%_40%_60%_63%] bg-gradient-to-br from-[#D9CAFF] via-[#E8DEFF] to-[#F2EBFF]"
          />

          {/* Main image frame */}
          <div className="absolute inset-[4%] overflow-hidden rounded-[47%_53%_43%_57%/36%_41%_59%_64%] border-[10px] border-white bg-[#F2EBFF] shadow-[0_40px_110px_rgba(46,5,105,.22),0_0_0_1px_rgba(140,82,255,.08)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${slide.id}-image`}
                initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt="Pradnyasanskar wellness campaign"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: slide.imagePosition }}
                />
                {/* Subtle inner vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E0569]/10 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating info card */}
          <div className="absolute bottom-[-1%] left-[6%] right-[6%] z-20">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-between gap-4 rounded-full border border-[#E4DAEC] bg-[#FFFDF7]/95 px-5 py-3.5 shadow-[0_20px_55px_rgba(46,5,105,.14)] backdrop-blur-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                {/* Pulse dot */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8C52FF] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8C52FF]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-extrabold uppercase tracking-[.17em] text-[#F08C26]">
                    {slide.floatingEyebrow}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] font-semibold text-[#645D68]">
                    {slide.floatingCopy}
                  </p>
                </div>
              </div>

              {/* Slide dots */}
              <div className="flex shrink-0 items-center gap-2">
                {heroSlides.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPrevActive(active);
                      setActive(index);
                    }}
                    aria-label={`Show hero slide ${index + 1}`}
                    className={`rounded-full transition-all duration-500 ${
                      index === active
                        ? "h-2 w-8 bg-[#8C52FF]"
                        : "h-2 w-2 bg-[#D8CFE0] hover:bg-[#CDBAF1]"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Wave divider ── */}
      <svg
        className="relative z-10 block h-16 w-full text-[#FFFDF7] sm:h-24"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 42c245 54 420-22 692 8 278 31 438 73 748 10v60H0Z" fill="currentColor" />
      </svg>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRUST MARQUEE
───────────────────────────────────────────── */
const trustItems = [
  "Why Pradnyasanskar",
  "Clarity in every interaction",
  "Transparent product information",
  "Ayurveda and nutraceutical ranges",
  "Clear directions and cautions",
  "India-focused wellness",
];

export function TrustMarquee() {
  const repeated = [...trustItems, ...trustItems];

  return (
    <section
      aria-label="Why Pradnyasanskar"
      className="relative overflow-hidden border-y border-[#E9E3EE] bg-white py-5 sm:py-7"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

      <div className="trust-marquee-track flex w-max items-center whitespace-nowrap">
        {repeated.map((item, index) => (
          <div key={`${item}-${index}`} className="flex shrink-0 items-center">
            <span
              className={`px-5 text-[clamp(28px,3.8vw,56px)] font-extrabold leading-none tracking-[-.055em] transition-colors duration-300 ${
                index % 2 === 0 ? "text-[#2E0569]" : "trust-outline-text"
              }`}
            >
              {item}
            </span>
            <span
              aria-hidden="true"
              className="mx-3 text-[clamp(22px,2.8vw,42px)] font-light text-[#8C52FF]/60"
            >
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
