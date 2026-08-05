"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { wellnessFocus } from "@/data";
import { Reveal } from "./Reveal";

/* ── data ─────────────────────────────────────────────────────────────── */
const focusHeadlines: Record<string, string> = {
  skin: "Glow, supported from within and without.",
  hair: "Nourishment, from root to tip.",
  digestion: "A calmer rhythm for everyday digestion.",
  immunity: "Everyday support, made easier to explore.",
  energy: "Steady support for active days.",
  sleep: "A gentler way to close the day.",
  mobility: "Support for movement that feels natural.",
  daily: "Simple essentials for everyday wellbeing.",
};
const focusDescriptors: Record<string, string> = {
  skin: "Beauty & Skin Care",
  hair: "Hair & Scalp Care",
  digestion: "Digestive Wellness",
  immunity: "Everyday Defence",
  energy: "Energy & Vitality",
  sleep: "Rest & Relaxation",
  mobility: "Movement & Mobility",
  daily: "Daily Essentials",
};

/* ── stagger variants ─────────────────────────────────────────────────── */
const headingStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const headingChild = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const copyStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const copyChild = {
  hidden: { opacity: 0, x: 18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

/* ── magnetic button hook ─────────────────────────────────────────────── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }, [x, y, strength]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return { ref, sx, sy, onMove, onLeave };
}

/* ── mouse parallax hook ──────────────────────────────────────────────── */
function useParallax(factor = 12) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 80, damping: 20 });
  const py = useSpring(my, { stiffness: 80, damping: 20 });
  const tx = useTransform(px, [-1, 1], [-factor, factor]);
  const ty = useTransform(py, [-1, 1], [-factor, factor]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width * 2 - 1);
    my.set((e.clientY - r.top) / r.height * 2 - 1);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return { tx, ty, onMove, onLeave };
}

/* ── animated SVG border for active card ─────────────────────────────── */
function ActiveBorder() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <rect
        x="1" y="1"
        width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx="21" ry="21"
        fill="none"
        stroke="#8C52FF"
        strokeWidth="2"
        strokeDasharray="12 6"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          from="0" to="-18"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

/* ── main component ───────────────────────────────────────────────────── */
export function WellnessFocus() {
  const [active, setActive] = useState(0);
  const [clicked, setClicked] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const selected = wellnessFocus[active];
  const SelectedIcon = selected.icon;
  const magnetic = useMagnetic(0.32);
  const parallax = useParallax(reduce ? 0 : 10);

  const openProducts = () => {
    window.dispatchEvent(
      new CustomEvent("pradnya:set-focus", { detail: selected.goal }),
    );
    window.setTimeout(
      () =>
        document
          .getElementById("featured")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
  };

  const handleCardClick = (index: number) => {
    setActive(index);
    setClicked(index);
    setTimeout(() => setClicked(null), 400);
  };

  const progressPct = ((active + 1) / wellnessFocus.length) * 100;

  return (
    <section
      id="wellness-focus"
      className="relative overflow-hidden bg-[#FFFDF7] py-8 sm:py-10"
    >
      {/* ── Floating ambient blobs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[#8C52FF]/[.06] blur-[100px]"
        />
        <motion.div
          animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 18, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -right-32 bottom-10 h-[440px] w-[440px] rounded-full bg-[#FFBB58]/[.07] blur-[90px]"
        />
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8C52FF]/[.04] blur-[80px]"
        />
        {/* Accent-reactive blob — changes with selected focus */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute left-[30%] top-[20%] h-[300px] w-[300px] rounded-full blur-[80px]"
          style={{ backgroundColor: `${selected.accent}60` }}
        />
      </div>

      <div className="relative mx-auto w-[92%] max-w-none px-0">

        {/* ── Section header — staggered reveal ── */}
        <motion.div
          variants={headingStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.span variants={headingChild} className="eyebrow inline-flex">
            <Sparkles size={13} /> Discover by wellness focus
          </motion.span>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_.65fr] lg:items-end">
            <motion.h2 variants={headingChild} className="section-heading max-w-4xl">
              Find the support that feels right for{" "}
              <span className="font-display italic text-[#F08C26]">today.</span>
            </motion.h2>
            <motion.p
              variants={headingChild}
              className="max-w-xl text-[15px] leading-[1.85] text-[#645D68] lg:justify-self-end lg:text-right"
            >
              Explore skin, hair, nutrition, energy and everyday wellness through
              complete product scenes, with the full image always kept visible.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Main feature card ── */}
        <Reveal delay={0.07}>
          <div className="relative mt-5">
            {/* Accent glow behind card — transitions with active focus */}
            <motion.div
              aria-hidden="true"
              key={selected.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute -inset-6 rounded-[52px] blur-[50px]"
              style={{ backgroundColor: `${selected.accent}60` }}
            />

            <motion.div
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[32px] border border-[#E5DCEB]/80 bg-white shadow-[0_32px_90px_rgba(46,5,105,.14),0_0_0_1px_rgba(140,82,255,.06)]"
            >
              <div className="grid min-h-[480px] lg:min-h-[520px] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">

                {/* Left — image panel with mouse parallax */}
                <div
                  className="group relative min-h-[480px] overflow-hidden lg:min-h-full"
                  style={{ backgroundColor: selected.accent }}
                  onMouseMove={parallax.onMove}
                  onMouseLeave={parallax.onLeave}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selected.id}
                      initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      {/* Ken Burns + mouse parallax wrapper */}
                      <motion.div
                        className="absolute inset-[-3%]"
                        style={reduce ? undefined : { x: parallax.tx, y: parallax.ty }}
                      >
                        {/* Ken Burns slow zoom — CSS animation */}
                        <div className="wf-ken-burns absolute inset-0">
                          <Image
                            src={selected.image}
                            alt={`${selected.title} wellness collection`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 75vw"
                            className="object-contain"
                            priority
                          />
                        </div>
                        {/* Warm ambient glow — edges only */}
                        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(240,140,38,.12),inset_0_0_30px_rgba(46,5,105,.08)]" />
                      </motion.div>

                      {/* Bottom vignette */}
                      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Glass badge — top left */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`badge-${selected.id}`}
                      initial={reduce ? false : { opacity: 0, y: -10, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, delay: 0.18 }}
                      className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[.16em] text-[#2E0569] shadow-[0_8px_24px_rgba(46,5,105,.12)] backdrop-blur-md sm:left-7 sm:top-7"
                    >
                      <SelectedIcon size={14} className="text-[#8C52FF]" />
                      Selected focus
                    </motion.span>
                  </AnimatePresence>

                  {/* Title pill — bottom left */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`pill-${selected.id}`}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.4, delay: 0.22 }}
                      className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-[#2E0569]/75 px-5 py-2.5 font-display text-[14px] italic text-white shadow-lg backdrop-blur-md sm:bottom-7 sm:left-7"
                    >
                      {selected.title}, shown in full
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Right — glassmorphism copy panel */}
                <div className="relative flex flex-col justify-center overflow-hidden border-t border-[#EDE6F4] bg-white/80 p-7 backdrop-blur-sm sm:p-8 lg:border-l lg:border-t-0 lg:p-9 xl:p-10">
                  {/* Accent orb inside panel */}
                  <motion.div
                    key={`orb-${selected.id}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9 }}
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-2xl"
                    style={{ backgroundColor: `${selected.accent}90` }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`copy-${selected.id}`}
                      variants={copyStagger}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, x: -10, transition: { duration: 0.22 } }}
                      className="relative"
                    >
                      <motion.p variants={copyChild} className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#8C52FF]">
                        {selected.title}
                      </motion.p>

                      <motion.div variants={copyChild} className="mt-3 flex items-center gap-3">
                        <div className="h-[3px] w-10 rounded-full bg-[#F08C26]" />
                        <div className="h-[3px] w-4 rounded-full bg-[#F08C26]/40" />
                      </motion.div>

                      <motion.h3
                        variants={copyChild}
                        className="mt-3 font-display text-[clamp(28px,3vw,44px)] font-semibold leading-[1.08] tracking-[-.03em] text-[#2E0569]"
                      >
                        {focusHeadlines[selected.id]}
                      </motion.h3>

                      <motion.p variants={copyChild} className="mt-3 text-[14px] leading-[1.8] text-[#645D68]">
                        {selected.copy}
                      </motion.p>

                      {/* Magnetic CTA */}
                      <motion.div variants={copyChild} className="mt-5">
                        <motion.button
                          ref={magnetic.ref}
                          onMouseMove={magnetic.onMove}
                          onMouseLeave={magnetic.onLeave}
                          style={reduce ? undefined : { x: magnetic.sx, y: magnetic.sy }}
                          onClick={openProducts}
                          whileTap={{ scale: 0.96 }}
                          className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#8C52FF] px-7 text-[10px] font-extrabold uppercase tracking-[.13em] text-white shadow-[0_14px_32px_rgba(140,82,255,.30)] transition-colors duration-300 hover:bg-[#2E0569] hover:shadow-[0_18px_40px_rgba(46,5,105,.28)]"
                        >
                          Explore {selected.title}
                          <motion.span
                            animate={reduce ? undefined : { x: [0, 4, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight size={16} />
                          </motion.span>
                        </motion.button>
                      </motion.div>

                      <motion.p
                        variants={copyChild}
                        className="mt-5 border-t border-[#EDE6F4] pt-4 text-[11px] leading-[1.75] text-[#9B8FA8]"
                      >
                        Browse products by wellness interest while keeping range,
                        format, directions and cautions easy to identify.
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>

        {/* ── Category selector ── */}
        <Reveal delay={0.12}>
          <div className="mt-5 flex items-end justify-between gap-5">
            <div>
              <h3 className="font-display text-[22px] font-semibold text-[#2E0569]">
                Choose another focus
              </h3>
              <p className="mt-1 text-[12px] text-[#9B8FA8]">
                Eight clear routes through the collection.
              </p>
            </div>

            {/* Animated progress indicator */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(wellnessFocus.length).padStart(2, "0")}
              </span>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-[#EDE6F4]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#8C52FF] to-[#FFBB58]"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="no-scrollbar mt-3 grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto pb-3 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-8 lg:overflow-visible">
            {wellnessFocus.map((item, index) => {
              const Icon = item.icon;
              const isActive = active === index;
              const isClicked = clicked === index;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => handleCardClick(index)}
                  aria-pressed={isActive}
                  whileHover={reduce ? undefined : { y: -7, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={[
                    "group relative overflow-hidden rounded-[24px] border bg-white p-2.5 text-left transition-shadow duration-300",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8C52FF]",
                    isActive
                      ? "border-[#8C52FF] shadow-[0_0_0_3px_rgba(140,82,255,.18),0_20px_48px_rgba(140,82,255,.24)]"
                      : "border-[#EDE6F4] shadow-[0_4px_16px_rgba(46,5,105,.06)] hover:border-[#CDBAF1] hover:shadow-[0_18px_40px_rgba(46,5,105,.12)]",
                  ].join(" ")}
                >
                  {/* Animated dashed border on active */}
                  {isActive && !reduce && <ActiveBorder />}

                  {/* Shared layout glow fill */}
                  {isActive && (
                    <motion.div
                      layoutId="wf-active-glow"
                      className="absolute inset-0 rounded-[24px] bg-[#8C52FF]/[.05]"
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}

                  {/* Thumbnail — full-bleed object-cover */}
                  <span
                    className="relative block aspect-[4/3] overflow-hidden rounded-[18px]"
                    style={{ backgroundColor: item.accent }}
                  >
                    <motion.span
                      className="absolute inset-0 block"
                      whileHover={reduce ? undefined : { scale: 1.06, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover"
                        style={{ objectPosition: "center 35%" }}
                      />
                    </motion.span>

                    {/* Icon badge — bounces on click */}
                    <motion.span
                      animate={isClicked && !reduce ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className={[
                        "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border transition duration-300",
                        isActive
                          ? "border-[#8C52FF] bg-[#8C52FF] text-white shadow-[0_4px_14px_rgba(140,82,255,.40)]"
                          : "border-white/70 bg-white/85 text-[#8C52FF] backdrop-blur-sm",
                      ].join(" ")}
                    >
                      <Icon size={13} />
                    </motion.span>
                  </span>

                  {/* Label */}
                  <span className="relative block px-1.5 pb-2 pt-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-[.13em] text-[#F08C26]">
                      {focusDescriptors[item.id]}
                    </span>
                    <strong className="mt-1.5 block text-[13px] font-extrabold leading-[1.3] tracking-[-.02em] text-[#2E0569]">
                      {item.title}
                    </strong>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        {/* ── Disclaimer ── */}
        <p className="mt-3 border-t border-[#EDE6F4] px-2 pt-3 text-[11px] leading-[1.8] text-[#9B8FA8]">
          Wellness-focus browsing supports general product discovery and does not
          constitute diagnosis, prescription or personalised medical advice.
        </p>
      </div>
    </section>
  );
}
