"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Eye,
  Heart,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { products } from "@/data";
import { Reveal } from "./Reveal";
import { useApp } from "./AppContext";

const tabs = ["All", "Ayurveda", "Nutraceuticals", "External Wellness"] as const;

/* ── stagger variants ─────────────────────────────────────────────────── */
const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const headerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ── magnetic hook ────────────────────────────────────────────────────── */
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return { ref, sx, sy, onMove, onLeave };
}

/* ── decorative leaf SVG ──────────────────────────────────────────────── */
function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 4 C8 12 4 28 8 44 C12 36 18 26 32 22 C26 14 20 4 20 4Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M20 4 C20 4 18 30 10 50"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

/* ── status badge color ───────────────────────────────────────────────── */
function statusStyle(status: string) {
  if (status === "Featured") return "bg-[#2E0569] text-white";
  if (status === "New") return "bg-[#EAF4E4] text-[#315C20]";
  return "bg-[#FFF1DA] text-[#9A5D0A]";
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function ProductShowcase() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [goal, setGoal] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const { bag, saved, addToBag, toggleSaved, setQuickView } = useApp();
  const magAdd = useMagnetic(0.28);
  const magView = useMagnetic(0.28);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      setGoal(custom.detail);
      setTab("All");
      setActiveIndex(0);
    };
    const rangeHandler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      setTab(custom.detail as (typeof tabs)[number]);
      setGoal(null);
      setActiveIndex(0);
    };
    window.addEventListener("pradnya:set-focus", handler);
    window.addEventListener("pradnya:set-range", rangeHandler);
    return () => {
      window.removeEventListener("pradnya:set-focus", handler);
      window.removeEventListener("pradnya:set-range", rangeHandler);
    };
  }, []);

  const filtered = useMemo(() => {
    const result = products.filter(
      (p) => (tab === "All" || p.range === tab) && (!goal || p.goals.includes(goal)),
    );
    return result.length ? result : products;
  }, [tab, goal]);

  const safeIndex = Math.min(activeIndex, filtered.length - 1);
  const activeProduct = filtered[safeIndex] ?? products[0];
  const inBag = bag.some((i) => i.id === activeProduct.id);
  const isSaved = saved.includes(activeProduct.id);
  const selectors = filtered.slice(0, 6);

  return (
    <section id="featured" className="relative overflow-hidden bg-[#FFFDF7] py-24 sm:py-32">

      {/* ── Background ambient layer ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Radial cream-to-lavender gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_30%,rgba(140,82,255,.07),transparent_60%),radial-gradient(ellipse_55%_45%_at_85%_70%,rgba(255,187,88,.08),transparent_55%)]" />
        {/* Floating blobs */}
        <motion.div
          animate={reduce ? undefined : { x: [0, 28, 0], y: [0, -18, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-16 h-[480px] w-[480px] rounded-full bg-[#8C52FF]/[.055] blur-[90px]"
        />
        <motion.div
          animate={reduce ? undefined : { x: [0, -20, 0], y: [0, 22, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -right-24 bottom-20 h-[400px] w-[400px] rounded-full bg-[#FFBB58]/[.065] blur-[80px]"
        />
        {/* Decorative botanical leaves */}
        <Leaf className="absolute right-[6%] top-[8%] h-20 w-14 rotate-[20deg] text-[#8C52FF]/[.08]" />
        <Leaf className="absolute left-[3%] bottom-[12%] h-16 w-10 -rotate-[30deg] text-[#FFBB58]/[.12]" />
        <Leaf className="absolute right-[18%] bottom-[6%] h-12 w-8 rotate-[50deg] text-[#8C52FF]/[.06]" />
      </div>

      <div className="relative container-page">

        {/* ── Section header ── */}
        <motion.div
          variants={headerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <motion.span variants={headerChild} className="eyebrow inline-flex">
              <Sparkles size={13} /> Featured collection
            </motion.span>
            <motion.h2
              variants={headerChild}
              className="section-heading mt-6 max-w-3xl"
            >
              Thoughtful products, presented with{" "}
              <span className="font-display italic text-[#FFBB58]">clarity.</span>
            </motion.h2>
            <motion.p
              variants={headerChild}
              className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-[#716A78]"
            >
              Explore Ayurveda, nutraceutical and external-wellness formats with
              clear product details, familiar routines and quick access to the
              information that matters.
            </motion.p>
          </div>

          {/* ── Filter pills ── */}
          <motion.div variants={headerChild} className="lg:justify-self-end">
            <div className="relative inline-flex flex-wrap gap-1.5 rounded-[24px] border border-[#E5DCEB] bg-white/80 p-1.5 shadow-[0_4px_20px_rgba(46,5,105,.07)] backdrop-blur-sm">
              {tabs.map((item) => {
                const isActive = tab === item && !goal;
                return (
                  <button
                    key={item}
                    onClick={() => { setTab(item); setGoal(null); setActiveIndex(0); }}
                    className="relative min-h-[38px] rounded-[18px] px-4 text-[10px] font-extrabold uppercase tracking-[.12em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8C52FF]"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="ps-filter-pill"
                        className="absolute inset-0 rounded-[18px] bg-gradient-to-r from-[#2E0569] to-[#8C52FF] shadow-[0_4px_16px_rgba(140,82,255,.30)]"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-white" : "text-[#2E0569] hover:text-[#8C52FF]"}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Active goal chip ── */}
        <AnimatePresence>
          {goal && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#DCCFE8] bg-white px-5 py-2.5 shadow-[0_4px_16px_rgba(46,5,105,.07)]"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">
                Showing {goal}
              </span>
              <button
                onClick={() => { setGoal(null); setActiveIndex(0); }}
                className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#2E0569] transition hover:text-[#8C52FF]"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Two-column grid ── */}
        <div className="mt-12 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">

          {/* ════ LEFT — Premium showcase card ════ */}
          <Reveal>
            <div className="relative">
              {/* Ambient glow behind card */}
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9 }}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-[52px] blur-[50px] bg-[#8C52FF]/[.10]"
              />

              <motion.article
                whileHover={reduce ? undefined : { y: -5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[32px] border border-[#E5DCEB]/70 bg-white shadow-[0_28px_80px_rgba(46,5,105,.13),0_0_0_1px_rgba(140,82,255,.05)]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProduct.id}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* ── Image stage ── */}
                    <div className="relative min-h-[420px] overflow-hidden bg-gradient-to-br from-[#F4EEFF] via-[#FAF6FF] to-[#FFF8F0] sm:min-h-[500px]">

                      {/* Decorative botanical leaves inside card */}
                      <Leaf className="pointer-events-none absolute left-4 top-6 h-16 w-10 -rotate-[15deg] text-[#8C52FF]/[.10]" />
                      <Leaf className="pointer-events-none absolute bottom-8 right-6 h-14 w-9 rotate-[35deg] text-[#FFBB58]/[.14]" />

                      {/* Soft purple glow behind product */}
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8C52FF]/[.12] blur-3xl" />

                      {/* Floating product image */}
                      <button
                        type="button"
                        onClick={() => setQuickView(activeProduct)}
                        aria-label={`Open quick view for ${activeProduct.name}`}
                        className="group absolute inset-0 flex cursor-zoom-in items-center justify-center"
                      >
                        <motion.div
                          animate={reduce ? undefined : { y: [0, -10, 0] }}
                          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                          className="relative h-[78%] w-[78%]"
                        >
                          <Image
                            src={activeProduct.image}
                            alt={activeProduct.name}
                            fill
                            sizes="(max-width: 1024px) 80vw, 42vw"
                            className="object-contain transition duration-700 group-hover:scale-[1.04]"
                            priority
                          />
                        </motion.div>

                        {/* Quick-view hover chip */}
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-[#DCCFE8] bg-white/95 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-[#2E0569] opacity-0 shadow-[0_10px_28px_rgba(46,5,105,.12)] backdrop-blur-sm transition group-hover:opacity-100"
                        >
                          <Eye size={13} /> Quick view
                        </motion.span>
                      </button>

                      {/* Status badge */}
                      <span className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] ${statusStyle(activeProduct.status)}`}>
                        {activeProduct.status}
                      </span>

                      {/* Save button */}
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => toggleSaved(activeProduct.id)}
                        aria-label="Save product"
                        className={`absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border transition duration-300 ${
                          isSaved
                            ? "border-[#8C52FF] bg-[#8C52FF] text-white shadow-[0_4px_14px_rgba(140,82,255,.35)]"
                            : "border-[#E5DCEB] bg-white/90 text-[#2E0569] backdrop-blur-sm hover:border-[#8C52FF] hover:text-[#8C52FF]"
                        }`}
                      >
                        <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                      </motion.button>
                    </div>

                    {/* ── Info panel — frosted glass ── */}
                    <div className="border-t border-[#EDE6F4] bg-white/85 p-7 backdrop-blur-sm sm:p-9">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#DDD3E5] bg-[#F4EEFF] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">
                          {activeProduct.range}
                        </span>
                        <span className="rounded-full border border-[#DDD3E5] bg-[#FFF8EE] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#9A5D0A]">
                          {activeProduct.format}
                        </span>
                      </div>

                      {/* Product name */}
                      <h3 className="mt-4 text-[clamp(28px,3.5vw,48px)] font-extrabold leading-[1.02] tracking-[-.05em] text-[#2E0569]">
                        {activeProduct.name}
                      </h3>

                      {/* Descriptor */}
                      <p className="mt-3 text-[13px] leading-[1.8] text-[#716A78]">
                        {activeProduct.descriptor}
                      </p>

                      {/* Wellness tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeProduct.goals.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="rounded-full border border-[#EDE6F4] bg-[#FAF6FF] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.11em] text-[#6D5A7C]"
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* CTA row */}
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        {/* Primary — magnetic Add to bag */}
                        <motion.button
                          ref={magAdd.ref}
                          onMouseMove={magAdd.onMove}
                          onMouseLeave={magAdd.onLeave}
                          style={reduce ? undefined : { x: magAdd.sx, y: magAdd.sy }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => addToBag(activeProduct)}
                          className={`group inline-flex min-h-[52px] items-center gap-2.5 rounded-full px-7 text-[10px] font-extrabold uppercase tracking-[.12em] transition-all duration-300 ${
                            inBag
                              ? "bg-[#EAF4E4] text-[#315C20] shadow-none"
                              : "bg-gradient-to-r from-[#8C52FF] to-[#6B35E8] text-white shadow-[0_14px_32px_rgba(140,82,255,.32)] hover:shadow-[0_18px_40px_rgba(140,82,255,.42)] hover:from-[#2E0569] hover:to-[#4A1A8C]"
                          }`}
                        >
                          {inBag ? (
                            <><ShoppingBag size={16} /> In wellness bag</>
                          ) : (
                            <>
                              <Plus size={16} /> Add to wellness bag
                              <motion.span
                                animate={reduce ? undefined : { x: [0, 4, 0] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <ArrowRight size={15} />
                              </motion.span>
                            </>
                          )}
                        </motion.button>

                        {/* Secondary — magnetic Quick view */}
                        <motion.button
                          ref={magView.ref}
                          onMouseMove={magView.onMove}
                          onMouseLeave={magView.onLeave}
                          style={reduce ? undefined : { x: magView.sx, y: magView.sy }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setQuickView(activeProduct)}
                          className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#DCCFE8] bg-white px-6 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] transition duration-300 hover:border-[#8C52FF] hover:text-[#8C52FF] hover:shadow-[0_8px_24px_rgba(140,82,255,.12)]"
                        >
                          <Eye size={15} /> Quick view
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.article>
            </div>
          </Reveal>

          {/* ════ RIGHT — Product selector grid ════ */}
          <Reveal delay={0.08}>
            <div className="grid h-full gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
              {selectors.map((product, index) => {
                const isSelected = product.id === activeProduct.id;
                return (
                  <motion.article
                    key={product.id}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduce ? undefined : { y: -5, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                    className={`group relative flex min-h-[260px] cursor-pointer flex-col overflow-hidden rounded-[26px] transition-shadow duration-300 ${
                      isSelected
                        ? "shadow-[0_0_0_2px_#8C52FF,0_20px_50px_rgba(140,82,255,.28)]"
                        : "shadow-[0_4px_20px_rgba(46,5,105,.08)] hover:shadow-[0_20px_50px_rgba(46,5,105,.18)]"
                    }`}
                  >
                    {/* full-bleed gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F4EEFF] via-[#EDE0FF] to-[#FAF6FF]" />

                    {/* soft glow */}
                    <div className="pointer-events-none absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8C52FF]/[.12] blur-2xl" />

                    {/* full-bleed product image */}
                    <motion.div
                      className="absolute inset-0"
                      whileHover={reduce ? undefined : { scale: 1.06, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                    >
                      <button
                        type="button"
                        onClick={() => setQuickView(product)}
                        aria-label={`Quick view ${product.name}`}
                        className="absolute inset-0 cursor-zoom-in"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 20vw"
                          className="object-contain p-4"
                        />
                      </button>
                    </motion.div>

                    {/* purple gradient overlay at bottom */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#1A0340]/90 via-[#2E0569]/65 to-transparent" />

                    {/* active selected ring overlay */}
                    {isSelected && (
                      <motion.div
                        layoutId="ps-active-card"
                        className="pointer-events-none absolute inset-0 rounded-[26px] ring-2 ring-[#8C52FF]"
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}

                    {/* active indicator dot */}
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-3 z-10 flex h-2.5 w-2.5"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8C52FF] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8C52FF]" />
                      </motion.span>
                    )}

                    {/* status badge */}
                    <span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[.12em] ${statusStyle(product.status)}`}>
                      {product.status}
                    </span>

                    {/* text overlay */}
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="absolute inset-x-0 bottom-0 z-10 p-4 text-left"
                    >
                      <span className="inline-block rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[.13em] text-[#FFCF85] backdrop-blur-sm">
                        {product.range}
                      </span>
                      <strong className="mt-1.5 block text-[13px] font-extrabold leading-tight tracking-[-.02em] text-white">
                        {product.name}
                      </strong>
                      <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-white/60 transition-all duration-300 group-hover:text-white/90 group-hover:gap-2">
                        Show product <ArrowRight size={10} />
                      </span>
                    </button>
                  </motion.article>
                );
              })}

              {/* More products tile */}
              {filtered.length > selectors.length && (
                <motion.a
                  href="#featured"
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group flex min-h-[100px] items-center justify-between gap-4 rounded-[26px] border border-dashed border-[#C4B0D8] bg-gradient-to-br from-white to-[#FAF6FF] px-6 text-left transition duration-300 hover:border-[#8C52FF] hover:shadow-[0_12px_32px_rgba(140,82,255,.10)] sm:col-span-2 lg:col-span-1 xl:col-span-2"
                >
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">
                      Complete collection
                    </p>
                    <p className="mt-1 text-[15px] font-extrabold text-[#2E0569]">
                      Explore {filtered.length - selectors.length} more products
                    </p>
                  </div>
                  <motion.span
                    animate={reduce ? undefined : { x: [0, 5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8C52FF] to-[#2E0569] text-white shadow-[0_8px_20px_rgba(140,82,255,.28)]"
                  >
                    <ArrowRight size={17} />
                  </motion.span>
                </motion.a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
