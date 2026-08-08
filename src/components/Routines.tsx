"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Check, Droplets, Heart, LayoutList, Leaf, RotateCcw, Sparkles, Sun, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { routines } from "@/data";
import { useProducts } from "@/lib/useProducts";
import { Reveal } from "./Reveal";
import { useApp } from "./AppContext";

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const headerChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
};

type RoutinePillar = { icon: LucideIcon; label: string; copy: string };
type RoutineDetail = {
  pillars: [RoutinePillar, RoutinePillar, RoutinePillar];
  trustHeading: string;
  trustCopy: string;
  trustRight: string;
};

const routineDetails: RoutineDetail[] = [
  {
    pillars: [
      { icon: Droplets, label: "Hydrate", copy: "Start your day with warm water and natural ingredients." },
      { icon: Leaf,     label: "Nourish", copy: "Feed your body with plant-based nutrition that supports energy." },
      { icon: Sun,      label: "Ground & Center", copy: "Take a mindful moment to set intentions for a balanced day." },
    ],
    trustHeading: "Small steps. Daily rhythm. Lasting change.",
    trustCopy: "Wellness isn\u2019t about perfection. It\u2019s about showing up for yourself, every morning.",
    trustRight: "Trusted by thousands of families who choose natural, thoughtful wellness every day.",
  },
  {
    pillars: [
      { icon: Target,     label: "Focus",    copy: "Create dedicated moments for deep concentration and meaningful progress." },
      { icon: LayoutList, label: "Organize", copy: "Structure priorities and tasks to make working hours more effective." },
      { icon: RotateCcw,  label: "Reset",    copy: "Take mindful short breaks to refresh attention and maintain consistent energy." },
    ],
    trustHeading: "Focused moments. Steady progress.",
    trustCopy: "A rhythm that supports your everyday responsibilities, one intentional hour at a time.",
    trustRight: "Trusted by thousands who build steady, productive days through consistent daily habits.",
  },
  {
    pillars: [
      { icon: Sparkles, label: "Cleanse",  copy: "Begin your care ritual with a gentle, considered cleansing step." },
      { icon: Droplets, label: "Restore",  copy: "Replenish skin and hair with botanical formats designed for daily use." },
      { icon: Heart,    label: "Protect",  copy: "Finish with a layer of care that supports your skin through the day." },
    ],
    trustHeading: "Ritual over routine. Care over habit.",
    trustCopy: "A slower, more considered approach to personal care that fits naturally into your day.",
    trustRight: "Trusted by thousands who choose thoughtful external-wellness formats every day.",
  },
  {
    pillars: [
      { icon: Leaf,     label: "Nourish",   copy: "Bring nutritional formats into meals that already belong to your day." },
      { icon: Droplets, label: "Replenish", copy: "Support hydration and micronutrient balance through familiar formats." },
      { icon: Heart,    label: "Sustain",   copy: "Build consistent nutritional habits that support long-term everyday wellness." },
    ],
    trustHeading: "Everyday nutrition. Consistent habits.",
    trustCopy: "Simple formats that fit naturally into meals and moments you already have.",
    trustRight: "Trusted by thousands of families building better nutritional habits every day.",
  },
  {
    pillars: [
      { icon: Sun,      label: "Slow Down", copy: "Shift into a gentler pace as the day draws to a quieter close." },
      { icon: Droplets, label: "Unwind",    copy: "Support relaxation with calm, botanical formats suited to evenings." },
      { icon: Heart,    label: "Restore",   copy: "Let your body and mind recover through a considered evening ritual." },
    ],
    trustHeading: "A quieter close. A better tomorrow.",
    trustCopy: "Evening rituals that help you wind down with intention and wake up restored.",
    trustRight: "Trusted by thousands who make their evenings a meaningful part of their wellness rhythm.",
  },
  {
    pillars: [
      { icon: Heart,    label: "Together",  copy: "Create shared wellness moments that bring the household closer." },
      { icon: Sparkles, label: "Nurture",   copy: "Choose formats that support the whole family through familiar daily habits." },
      { icon: Leaf,     label: "Sustain",   copy: "Build a household rhythm around wellness choices that feel natural and easy." },
    ],
    trustHeading: "Wellness for every member. Every day.",
    trustCopy: "Flexible formats that sit naturally within a shared household routine.",
    trustRight: "Trusted by thousands of families who make wellness a shared, everyday priority.",
  },
];

const routineMoments = [
  { short: "Rise",     detail: "A clean beginning",      ambience: "from-[#F5D7A5] via-[#F7E8D0] to-[#F4EEE7]" },
  { short: "Focus",   detail: "Steady working hours",    ambience: "from-[#D9D7F7] via-[#ECE7FA] to-[#F7EFEA]" },
  { short: "Care",    detail: "Personal care ritual",    ambience: "from-[#F4D8DE] via-[#F8E8EA] to-[#F7F0E8]" },
  { short: "Nourish", detail: "Everyday nutrition",      ambience: "from-[#D8E7CA] via-[#EDF2DF] to-[#F7EFE7]" },
  { short: "Unwind",  detail: "A quieter close",         ambience: "from-[#B9ACD8] via-[#D8CFE8] to-[#EEE7E4]" },
  { short: "Together",detail: "Shared family moments",   ambience: "from-[#F5D3B7] via-[#F7E7D4] to-[#F4EEE8]" },
];

function useMagnetic(strength = 0.24) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = useCallback((e: ReactMouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }, [x, y, strength]);

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, sx, sy, onMove, onLeave };
}

export function RoutineCards() {
  const [active, setActive] = useState(0);
  const [imgError, setImgError] = useState(false);
  const reduce = useReducedMotion();
  const routine = routines[active];
  const moment = routineMoments[active];
  const Icon = routine.icon;
  const magnetic = useMagnetic(0.22);

  return (
    <section id="routines" className="relative overflow-hidden bg-[#FFFDF7] py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={reduce ? undefined : { x: [0, 26, 0], y: [0, -16, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 top-12 h-[500px] w-[500px] rounded-full bg-[#8C52FF]/[.07] blur-[100px]"
        />
        <motion.div
          animate={reduce ? undefined : { x: [0, -20, 0], y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -right-24 bottom-10 h-[440px] w-[440px] rounded-full bg-[#FFBB58]/[.08] blur-[95px]"
        />
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute left-1/2 top-[20%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-white/70 blur-[90px]"
        />
      </div>

      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <motion.div
            variants={headerStagger}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"
          >
            <div>
              <motion.span variants={headerChild} className="eyebrow inline-flex"><Sparkles size={13} /> Shop by routine</motion.span>
              <motion.h2 variants={headerChild} className="section-heading mt-6 max-w-4xl">Move through wellness at your own <span className="font-display italic text-[#FFBB58]">rhythm.</span></motion.h2>
            </div>
            <motion.p variants={headerChild} className="max-w-2xl text-[15px] leading-[1.85] text-[#645D68] lg:justify-self-end lg:text-right">
              Slide between six familiar moments, from an energising start to a softer close, and discover products that fit naturally into each part of the day.
            </motion.p>
          </motion.div>
        </Reveal>

        <Reveal delay={.08}>
          <motion.div
            key={routine.title}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { y: -4, boxShadow: "0 48px_120px_rgba(46,5,105,.18),0_0_0_1px_rgba(140,82,255,.08)" }}
            className="relative mt-14 overflow-hidden rounded-[36px] border border-[#E8DFF2]/90 bg-white/80 shadow-[0_35px_100px_rgba(46,5,105,.14),0_0_0_1px_rgba(140,82,255,.05)] backdrop-blur-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${moment.ambience}`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,187,88,0.14),transparent_32%),radial-gradient(circle_at_30%_80%,rgba(140,82,255,0.14),transparent_30%)]" />

            <motion.div
              aria-hidden="true"
              animate={reduce ? undefined : { x: [0, 20, 0], y: [0, -12, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border-[42px] border-white/35"
            />
            <motion.div
              aria-hidden="true"
              animate={reduce ? undefined : { x: [0, -16, 0], y: [0, 14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute bottom-10 right-[24%] h-56 w-56 rounded-full bg-white/35 blur-[46px]"
            />

            <div className="relative grid items-stretch lg:grid-cols-[1fr_.82fr]">
              <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${routine.title}-copy`}
                    initial={reduce ? false : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: 18 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-xl"
                  >
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-3.5 py-2 shadow-[0_10px_30px_rgba(46,5,105,.08)] backdrop-blur-md">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2E0569] text-white shadow-[0_10px_24px_rgba(46,5,105,.18)]">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#8C52FF]">Wellness rhythm {String(active + 1).padStart(2, "0")}</p>
                        <p className="mt-1 text-[11px] font-semibold text-[#716A78]">{moment.detail}</p>
                      </div>
                    </div>

                    <h3 className="mt-7 text-[clamp(40px,4.7vw,64px)] font-extrabold leading-[0.96] tracking-[-.06em] text-[#2E0569]">
                      {routine.title}
                    </h3>
                    <p className="mt-5 text-[15px] leading-[1.85] text-[#5F5765]">
                      {routine.copy}
                    </p>

                    {/* Three pillars — data-driven per routine */}
                    {(() => {
                      const detail = routineDetails[active];
                      const [p0, p1, p2] = detail.pillars;
                      return (
                        <>
                          <div className="mt-7 grid grid-cols-3 divide-x divide-white/30 border-t border-white/30 pt-6">
                            {([p0, p1, p2] as RoutinePillar[]).map((p, i) => {
                              const PIcon = p.icon;
                              return (
                                <div key={p.label} className={i === 0 ? "pr-5" : i === 1 ? "px-5" : "pl-5"}>
                                  <div className="flex items-center gap-2">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
                                      <PIcon size={11} className="text-[#2E0569]" />
                                    </span>
                                    <p className="text-[12px] font-extrabold tracking-[.04em] text-[#2E0569]">{p.label}</p>
                                  </div>
                                  <p className="mt-1.5 text-[11px] leading-[1.7] text-[#6B6070]">{p.copy}</p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Trust / value section */}
                          <div className="mt-6 flex items-start gap-5 border-t border-white/30 pt-5">
                            <div className="flex flex-1 items-start gap-2.5">
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
                                <Sparkles size={11} className="text-[#2E0569]" />
                              </span>
                              <div>
                                <p className="text-[11.5px] font-extrabold leading-snug tracking-[.02em] text-[#2E0569]">{detail.trustHeading}</p>
                                <p className="mt-1 text-[11px] leading-[1.65] text-[#6B6070]">{detail.trustCopy}</p>
                              </div>
                            </div>
                            <div className="h-full w-px self-stretch bg-white/30" />
                            <div className="flex flex-1 items-start gap-2.5">
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
                                <Heart size={11} className="text-[#2E0569]" />
                              </span>
                              <p className="text-[11px] leading-[1.65] text-[#6B6070]">{detail.trustRight}</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="relative mt-8 w-fit">
                      {!reduce && (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full bg-[#2E0569]"
                          animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0, 0.45] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      <motion.a
                        ref={magnetic.ref}
                        href="#routine-finder"
                        onMouseMove={magnetic.onMove}
                        onMouseLeave={magnetic.onLeave}
                        style={reduce ? undefined : { x: magnetic.sx, y: magnetic.sy }}
                        whileHover={reduce ? undefined : { y: -3, scale: 1.03, boxShadow: "0 22px 48px rgba(46,5,105,.28)" }}
                        whileTap={reduce ? undefined : { scale: 0.97 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#2E0569] px-6 text-[10px] font-extrabold uppercase tracking-[.15em] text-white shadow-[0_16px_40px_rgba(46,5,105,.16)]"
                      >
                        Explore this rhythm <ArrowRight size={16} />
                      </motion.a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Portrait image column — aspect ratio matches 1122×1402 source images */}
              <div className={`relative overflow-hidden bg-gradient-to-br ${moment.ambience} lg:rounded-r-[36px]`}>
                <div className="relative mx-auto w-full" style={{ aspectRatio: "1122 / 1402" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={routine.image}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -14 }}
                      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <motion.div
                        animate={reduce ? undefined : { y: [0, -8, 0], scale: [1, 1.018, 1] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        {imgError ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#8C52FF]/60">
                            <Icon size={48} strokeWidth={1.2} />
                            <span className="text-[11px] font-extrabold uppercase tracking-[.12em]">{routine.title}</span>
                          </div>
                        ) : (
                          <Image
                            src={routine.image}
                            alt={routine.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className="object-contain"
                            priority
                            onError={() => setImgError(true)}
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="relative border-t border-white/70 bg-white/60 px-7 py-7 backdrop-blur-xl sm:px-10 lg:px-12 xl:px-16">
              <div className="w-full">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[10.5px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">
                  <span>Choose your moment</span>
                  <span className="text-[#716A78]">{moment.short} · {active + 1} of {routines.length}</span>
                </div>
                <input
                  aria-label="Choose a wellness routine moment"
                  className="routine-rhythm-range"
                  type="range"
                  min="0"
                  max={routines.length - 1}
                  step="1"
                  value={active}
                  onChange={(event) => { setActive(Number(event.target.value)); setImgError(false); }}
                  style={{ "--routine-progress": `${(active / (routines.length - 1)) * 100}%` } as CSSProperties}
                />
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {routineMoments.map((item, index) => {
                    const isActive = index === active;
                    return (
                      <motion.button
                        key={item.short}
                        type="button"
                        onClick={() => { setActive(index); setImgError(false); }}
                        whileHover={reduce ? undefined : { y: -2, scale: 1.04 }}
                        whileTap={reduce ? undefined : { scale: 0.95 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative min-w-0 rounded-full border px-2 py-2.5 text-center text-[9.5px] font-extrabold uppercase tracking-[.06em] sm:text-[10.5px] sm:tracking-[.1em] ${isActive ? "border-[#8C52FF]/20 text-white shadow-[0_10px_24px_rgba(46,5,105,.16)]" : "border-[#E6DDF1] bg-white/70 text-[#8A7693] hover:border-[#8C52FF]/20 hover:text-[#8C52FF]"}`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="routine-pill"
                            className="absolute inset-0 rounded-full bg-[#2E0569]"
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}
                        <span className="relative z-10">{item.short}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

const questions = [
  { title: "What matters most today?", choices: ["Daily wellness", "More energy", "Digestive comfort", "Skin & hair", "Calmer evenings"] },
  { title: "Which format feels easiest?", choices: ["Capsules or tablets", "Powders and drinks", "Oils and serums", "Creams", "Show me a mix"] },
  { title: "When will it fit your routine?", choices: ["Morning", "During the workday", "With meals", "Evening", "Flexible timing"] },
];

export function RoutineFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const { addToBag } = useApp();
  const { products } = useProducts();

  const select = (choice: string) => {
    const next = [...answers.slice(0, step), choice];
    setAnswers(next);
    if (step === questions.length - 1) setComplete(true);
    else setStep(step + 1);
  };

  const firstAnswer = answers[0] ?? "";
  const recommendations = firstAnswer.includes("Skin")
    ? products.filter((product) => product.goals.includes("Skin & Hair")).slice(0, 3)
    : firstAnswer.includes("Digestive")
      ? products.filter((product) => product.goals.includes("Digestive Wellness")).slice(0, 3)
      : firstAnswer.includes("energy")
        ? products.filter((product) => product.goals.includes("Energy & Vitality")).slice(0, 3)
        : products.slice(0, 3);

  return (
    <section id="routine-finder" className="bg-[#FFFDF7] py-28 sm:py-36">
      <div className="mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-[#2E0569] text-white shadow-[0_18px_55px_rgba(46,5,105,.14),0_0_0_1px_rgba(46,5,105,.08)]">
            {/* ambient glows */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#8C52FF]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-[#FFBB58]/20 blur-3xl" />

            <div className="relative grid lg:grid-cols-2">

              {/* left — heading */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 xl:p-16">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.15em] backdrop-blur-sm">
                  <Sparkles size={13} /> Guided discovery
                </span>
                <h2 className="mt-6 text-[clamp(36px,4vw,60px)] font-extrabold leading-[1.02] tracking-[-.05em]">
                  Not sure where to begin?
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-white/70">
                  Answer three simple questions to create a general browsing route through the Pradnyasanskar collection.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#FFBB58]">
                  <span>Three questions</span><span className="opacity-40">•</span>
                  <span>No diagnosis</span><span className="opacity-40">•</span>
                  <span>Easy to restart</span>
                </div>
              </div>

              {/* right — quiz panel, flush to outer card edges */}
              <div className="border-t border-white/10 bg-white p-8 text-[#21182B] sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
                {!complete ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">
                        Question {step + 1} of {questions.length}
                      </p>
                      <div className="flex gap-1.5">
                        {questions.map((_, index) => (
                          <span key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index <= step ? "w-8 bg-[#8C52FF]" : "w-4 bg-[#E9E3EE]"}`} />
                        ))}
                      </div>
                    </div>

                    <h3 className="mt-7 text-[28px] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569] sm:text-[32px]">
                      {questions[step].title}
                    </h3>

                    <div className="mt-6 grid gap-2.5">
                      {questions[step].choices.map((choice) => (
                        <motion.button
                          key={choice}
                          onClick={() => select(choice)}
                          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(140,82,255,.12)", transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                          whileTap={{ scale: 0.98 }}
                          className="flex min-h-[52px] items-center justify-between rounded-[18px] border border-[#E9E3EE] bg-white px-5 text-left text-[13px] font-semibold text-[#2E0569] shadow-[0_2px_8px_rgba(46,5,105,.04)] transition-colors duration-200 hover:border-[#8C52FF]/50 hover:bg-[#FAF7FF]"
                        >
                          {choice}
                          <ArrowRight size={15} className="shrink-0 text-[#8C52FF] opacity-50 transition group-hover:opacity-100" />
                        </motion.button>
                      ))}
                    </div>

                    {step > 0 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="mt-6 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#716A78] transition hover:text-[#2E0569]"
                      >
                        ← Back
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF4E4] text-[#315C20]">
                      <Check size={24} />
                    </span>
                    <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Your discovery route</p>
                    <h3 className="mt-2 text-[30px] font-extrabold tracking-[-.04em] text-[#2E0569]">A thoughtful starting point.</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-[#716A78]">
                      These selections are for general product discovery only. Review complete product information before use.
                    </p>
                    <div className="mt-6 space-y-2.5">
                      {recommendations.map((product) => (
                        <div key={product.id} className="flex items-center justify-between gap-3 rounded-[18px] border border-[#E9E3EE] bg-[#FAF7FF] p-4 shadow-[0_2px_8px_rgba(46,5,105,.04)]">
                          <div>
                            <p className="text-[13px] font-extrabold text-[#2E0569]">{product.name}</p>
                            <p className="mt-0.5 text-[10px] text-[#716A78]">{product.range} · {product.format}</p>
                          </div>
                          <button
                            onClick={() => addToBag(product)}
                            className="rounded-full bg-[#8C52FF] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[.1em] text-white shadow-[0_4px_12px_rgba(140,82,255,.28)] transition hover:bg-[#2E0569]"
                          >
                            Save
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setStep(0); setAnswers([]); setComplete(false); }}
                      className="mt-6 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#716A78] transition hover:text-[#2E0569]"
                    >
                      Start again
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
