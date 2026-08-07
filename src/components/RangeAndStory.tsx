"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Heart, Leaf, Microscope } from "lucide-react";
import { brandPrinciples } from "@/data";
import { Reveal } from "./Reveal";

function navigateToRange(range: string) {
  window.dispatchEvent(new CustomEvent("pradnya:set-range", { detail: range }));
  document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
}

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const headerChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }),
};

export function RangeSplit() {
  const reduce = useReducedMotion();
  const ranges = [
    {
      title: "Ayurveda",
      eyebrow: "Rooted in recognised traditional knowledge",
      copy: "Explore botanical ingredients and familiar Ayurvedic formats through clear composition, directions and cautions.",
      image: "/images/range-ayurveda.webp",
      icon: Leaf,
      panel: "bg-[#2E0569] text-white",
      imageBg: "bg-gradient-to-br from-[#F4EEFF] via-[#EDE0FF] to-[#F7F0FF]",
      eyebrowTone: "text-[#FFCF85]",
      bodyTone: "text-white/75",
      button: "bg-white text-[#2E0569] shadow-[0_8px_24px_rgba(255,255,255,0.25)]",
      glow: "bg-[#8C52FF]/[.12]",
    },
    {
      title: "Nutraceuticals",
      eyebrow: "Designed for modern nutritional routines",
      copy: "Discover vitamins, minerals, botanicals and modern formats through responsible product information.",
      image: "/images/range-nutraceutical.webp",
      icon: Microscope,
      panel: "bg-[#EAF4E4] text-[#21331D]",
      imageBg: "bg-gradient-to-br from-[#EAF4E4] via-[#F2F8EE] to-[#FFFDF7]",
      eyebrowTone: "text-[#52723E]",
      bodyTone: "text-[#4B5A46]",
      button: "bg-[#2E0569] text-white shadow-[0_8px_24px_rgba(46,5,105,0.22)]",
      glow: "bg-[#52723E]/[.08]",
    },
  ];

  return (
    <section id="ranges" className="relative overflow-hidden bg-white py-28 sm:py-36">
      {/* ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#8C52FF]/[.045] blur-[90px]" />
        <div className="absolute -right-24 bottom-16 h-[360px] w-[360px] rounded-full bg-[#FFBB58]/[.055] blur-[80px]" />
      </div>

      <div className="relative mx-auto w-[92%] max-w-none px-0">
        {/* header */}
        <motion.div
          variants={headerStagger}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 lg:grid-cols-[1fr_.65fr] lg:items-end"
        >
          <div>
            <motion.span variants={headerChild} className="eyebrow inline-flex">Two distinct ranges</motion.span>
            <motion.h2 variants={headerChild} className="section-heading mt-6 max-w-5xl">
              Ancient knowledge and modern nutrition,{" "}
              <span className="font-display italic text-[#FFBB58]">without blurring the difference.</span>
            </motion.h2>
          </div>
          <motion.p variants={headerChild} className="max-w-xl text-[15px] leading-[1.85] text-[#716A78] lg:justify-self-end lg:text-right">
            Each range keeps its own visual language, product classification and information hierarchy so the difference stays clear from the first glance.
          </motion.p>
        </motion.div>

        {/* cards */}
        <div className="relative mt-14 grid gap-6 lg:grid-cols-2">
          {ranges.map((range, index) => (
            <motion.article
              key={range.title}
              custom={index}
              variants={cardVariants}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
              className="group overflow-hidden rounded-[32px] border border-[#E9E3EE] bg-[#FFFDF7] shadow-[0_22px_65px_rgba(46,5,105,.08)] transition-shadow duration-300 hover:shadow-[0_36px_90px_rgba(46,5,105,.15)]"
            >
              {/* image panel */}
              <div className={`relative overflow-hidden p-5 sm:p-7 ${range.imageBg}`}>
                {/* soft glow behind image */}
                <div className={`pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${range.glow}`} />
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-white/60 shadow-[0_12px_40px_rgba(46,5,105,.08)]">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={reduce ? undefined : { scale: 1.04, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <Image
                      src={range.image}
                      alt={`${range.title} product range`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </motion.div>
                </div>
              </div>

              {/* content panel */}
              <div className={`${range.panel} p-8 sm:p-12`}>
                <span className={`inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.15em] ${range.eyebrowTone}`}>
                  <range.icon size={15} /> {range.eyebrow}
                </span>
                <h3 className="mt-5 text-[clamp(40px,4.5vw,62px)] font-extrabold leading-none tracking-[-.055em]">{range.title}</h3>
                <p className={`mt-4 max-w-lg text-[13px] leading-[1.8] ${range.bodyTone}`}>{range.copy}</p>
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => navigateToRange(range.title)}
                    className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[10px] font-extrabold uppercase tracking-[.12em] ${range.button}`}
                  >
                    Explore {range.title} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}

          <span className="pointer-events-none absolute left-1/2 top-[42%] z-10 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[8px] border-white bg-[#FFBB58] text-[#2E0569] shadow-[0_18px_45px_rgba(46,5,105,.18)] lg:grid">
            <Heart size={29} strokeWidth={2.2} fill="currentColor" />
          </span>
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section id="philosophy" className="overflow-hidden bg-[#FFFDF7] py-28 sm:py-36">
      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">

          {/* ── Left: image composition ── */}
          <Reveal>
            <div className="relative min-h-[420px] sm:min-h-[560px] lg:min-h-[620px]">
              {/* primary image */}
              <div className="absolute left-0 top-0 h-[72%] w-[76%] overflow-hidden rounded-[38px] shadow-[0_24px_64px_rgba(46,5,105,.13)]">
                <Image
                  src="/images/brand-story-1.webp"
                  alt="Pradnyasanskar brand story ingredients and product presentation"
                  fill
                  className="object-cover"
                />
              </div>
              {/* secondary image */}
              <motion.div
                whileHover={{ y: -8 }}
                className="absolute bottom-0 right-0 h-[54%] w-[58%] overflow-hidden rounded-[32px] border-[8px] border-[#FFFDF7] shadow-soft"
              >
                <Image
                  src="/images/brand-story-3.webp"
                  alt="Thoughtful wellness formulation presentation"
                  fill
                  className="object-cover"
                />
              </motion.div>
              {/* badge */}
              <span className="absolute bottom-[9%] left-[5%] grid h-24 w-24 place-items-center rounded-full bg-[#FFBB58] text-center text-[10px] font-extrabold uppercase tracking-[.12em] text-[#2E0569] shadow-lg">
                Knowledge<br />with values
              </span>
            </div>
          </Reveal>

          {/* ── Right: content ── */}
          <Reveal delay={0.1}>
            <div className="flex flex-col">
              <span className="eyebrow">At the heart of Pradnyasanskar</span>
              <h2 className="section-heading mt-5">
                Knowledge with values.{" "}
                <span className="font-display italic text-[#8C52FF]">Wellness with clarity.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.85] text-[#4A4352]">
                Pradnyasanskar is built around a simple belief: wellness products should be thoughtfully developed, clearly explained and responsibly presented. The experience separates ranges, explains formats and keeps important information close to every decision.
              </p>

              {/* feature cards */}
              <div className="mt-8 space-y-3">
                {brandPrinciples.map((item, index) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[56px_1fr] items-start gap-4 rounded-2xl border border-[#E2D9EE] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(46,5,105,.05)] transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(46,5,105,.09)]"
                  >
                    <span className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F2EBFF] text-[#8C52FF]">
                      <item.icon size={21} />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#F08C26]">0{index + 1}</p>
                      <h3 className="mt-1 text-[18px] font-extrabold leading-snug text-[#2E0569]">{item.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#5C5465]">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#quality" className="btn-primary mt-8 self-start">
                Read our quality approach <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

export function QualityStrip() {
  const items=["Range clearly identified","Composition easy to find","Directions kept visible","Warnings placed responsibly"];
  return <section id="quality" className="bg-[#2E0569] py-16 text-white"><div className="container-page"><Reveal><div className="grid gap-7 lg:grid-cols-[1fr_1.4fr] lg:items-center"><div><span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#FFBB58]">What customers should know</span><h2 className="mt-3 text-[clamp(36px,4vw,58px)] font-extrabold leading-[1.04] tracking-[-.05em]">Product information should never feel hidden.</h2></div><div className="grid gap-3 sm:grid-cols-2">{items.map(item=><div key={item} className="flex items-center gap-3 rounded-2xl border border-white/[.15] bg-white/[.08] p-4"><CheckCircle2 size={18} className="text-[#FFBB58]"/><span className="text-[12px] font-bold text-white/85">{item}</span></div>)}</div></div></Reveal></div></section>;
}
