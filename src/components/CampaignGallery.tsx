"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

const campaignTiles = [
  {
    image: "/images/campaign-hair.webp",
    label: "External wellness",
    title: "Hair rituals with a modern point of view.",
    copy: "Thoughtful external-care formats presented through a warmer, more contemporary visual language.",
    className: "md:col-span-5 md:row-span-2",
    fit: "cover",
    tone: "bg-gradient-to-br from-[#F2EBFF] via-[#EDE0FF] to-[#F7F0FF]",
    glow: "bg-[#8C52FF]/[.10]",
    labelColor: "text-[#8C52FF]",
  },
  {
    image: "/images/campaign-face.webp",
    label: "Skin rituals",
    title: "Botanical care, beautifully presented.",
    copy: "Textures, ingredients and product information brought together without visual clutter.",
    className: "md:col-span-3",
    fit: "cover",
    tone: "bg-gradient-to-br from-[#FFE6D7] via-[#FFF0E8] to-[#FFFDF7]",
    glow: "bg-[#F08C26]/[.08]",
    labelColor: "text-[#B36B0A]",
  },
  {
    image: "/images/campaign-nutrition.webp",
    label: "Modern nutrition",
    title: "Everyday formats for contemporary routines.",
    copy: "A cleaner way to discover familiar nutritional formats and daily blends.",
    className: "md:col-span-4",
    fit: "cover",
    tone: "bg-gradient-to-br from-[#EAF4E4] via-[#F2F8EE] to-[#FFFDF7]",
    glow: "bg-[#52723E]/[.08]",
    labelColor: "text-[#52723E]",
  },
  {
    image: "/images/campaign-skincare.webp",
    label: "Ayurveda-inspired care",
    title: "A complete ritual across textures and formats.",
    copy: "A connected external-care story spanning cleansers, serums, creams and lotions.",
    className: "md:col-span-4",
    fit: "cover",
    tone: "bg-gradient-to-br from-[#FFF1DA] via-[#FFF6E8] to-[#FFFDF7]",
    glow: "bg-[#FFBB58]/[.10]",
    labelColor: "text-[#B36B0A]",
  },
  {
    image: "/images/campaign-gift.webp",
    label: "Wellness gifting",
    title: "Thoughtfully grouped for meaningful moments.",
    copy: "Premium presentation for personal rituals, family care and seasonal gifting.",
    className: "md:col-span-3",
    fit: "cover",
    tone: "bg-gradient-to-br from-[#F2EBFF] via-[#EDE0FF] to-[#F7F0FF]",
    glow: "bg-[#8C52FF]/[.08]",
    labelColor: "text-[#8C52FF]",
  },
];

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const headerChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
};
const tileVariants = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function CampaignGallery() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F1FF] via-[#FFFDF7] to-white py-28 sm:py-36">
      {/* ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-16 h-[480px] w-[480px] rounded-full bg-[#8C52FF]/[.05] blur-[100px]" />
        <div className="absolute -right-24 bottom-20 h-[400px] w-[400px] rounded-full bg-[#FFBB58]/[.06] blur-[90px]" />
        <div className="absolute left-1/2 top-[30%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-white/60 blur-[80px]" />
      </div>

      <div className="relative mx-auto w-[92%] max-w-none px-0">
        {/* header */}
        <motion.div
          variants={headerStagger}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 lg:grid-cols-[.9fr_1fr] lg:items-end"
        >
          <div>
            <motion.span variants={headerChild} className="eyebrow inline-flex">
              <Sparkles size={13} /> The Pradnyasanskar world
            </motion.span>
            <motion.h2 variants={headerChild} className="section-heading mt-6 max-w-3xl">
              Wellness, styled for{" "}
              <span className="font-display italic text-[#FFBB58]">real life.</span>
            </motion.h2>
          </div>
          <motion.p variants={headerChild} className="max-w-2xl text-[15px] leading-[1.85] text-[#716A78] lg:justify-self-end lg:text-right">
            A visual universe that brings together botanicals, modern nutrition, external care and thoughtful gifting—without placing important text over busy imagery.
          </motion.p>
        </motion.div>

        {/* gallery grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-12">
          {campaignTiles.map((tile, index) => {
            const isHero = index === 0;
            return (
              <motion.article
                key={tile.title}
                custom={index}
                variants={tileVariants}
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                className={`group relative overflow-hidden rounded-[28px] border border-[#E9E3EE]/80 shadow-[0_18px_55px_rgba(46,5,105,.08)] transition-shadow duration-300 hover:shadow-[0_32px_80px_rgba(46,5,105,.14)] ${tile.className}`}
              >
                {isHero ? (
                  /* ── large hero tile: original split layout ── */
                  <div className="flex h-full flex-col bg-white">
                    <div className={`relative min-h-[260px] flex-1 overflow-hidden ${tile.tone} p-3 md:min-h-0`}>
                      <div className={`pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${tile.glow}`} />
                      <div className="relative h-full overflow-hidden rounded-[20px] border border-white/50 bg-white/30 backdrop-blur-[2px]">
                        <motion.div
                          className="absolute inset-0"
                          whileHover={reduce ? undefined : { scale: 1.04, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
                        >
                          <Image src={tile.image} alt={tile.title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition-transform duration-700" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="border-t border-[#EDE6F4]/60 bg-white/90 p-6 backdrop-blur-sm sm:p-7">
                      <p className={`text-[9px] font-extrabold uppercase tracking-[.16em] ${tile.labelColor}`}>{tile.label}</p>
                      <h3 className="mt-2 max-w-md text-[22px] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569]">{tile.title}</h3>
                      <p className="mt-1.5 max-w-lg text-[11px] leading-[1.65] text-[#716A78]">{tile.copy}</p>
                    </div>
                  </div>
                ) : (
                  /* ── 4 sub-cards: full-bleed image + text overlay ── */
                  <div className="flex h-full min-h-[360px] flex-col md:min-h-[420px]">
                    {/* tone background */}
                    <div className={`absolute inset-0 ${tile.tone}`} />
                    {/* full-bleed image */}
                    <motion.div
                      className="absolute inset-0"
                      whileHover={reduce ? undefined : { scale: 1.06, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
                    >
                      <Image
                        src={tile.image}
                        alt={tile.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </motion.div>
                    {/* gradient overlay — tall enough to always cover text */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#1A0340]/95 via-[#2E0569]/70 to-transparent" />
                    {/* text — pinned to bottom, consistent padding, no truncation */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 sm:p-6">
                      <p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#FFCF85]">{tile.label}</p>
                      <h3 className="text-[18px] font-extrabold leading-tight tracking-[-.03em] text-white">{tile.title}</h3>
                      <p className="text-[10.5px] leading-[1.6] text-white/75">{tile.copy}</p>
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        {/* bottom banner */}
        <Reveal>
          <div className="mt-6 overflow-hidden rounded-[32px] border border-[#E9E3EE]/60 bg-white shadow-[0_32px_90px_rgba(46,5,105,.12)]">
            <div className="grid lg:grid-cols-[5fr_7fr]">

              {/* left — copy */}
              <div className="flex flex-col justify-center bg-[#2E0569] p-8 text-white sm:p-12 lg:p-14">
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#FFCF85]">One thoughtful brand</p>
                <h3 className="mt-4 text-[clamp(28px,3.5vw,48px)] font-extrabold leading-[1.06] tracking-[-.04em]">
                  Ayurveda, nutrition and everyday care in one connected experience.
                </h3>
                <p className="mt-4 max-w-md text-[13px] leading-[1.85] text-white/65">
                  Explore the complete visual world without losing the distinction between product ranges, formats and responsible product information.
                </p>
                <a
                  href="#featured"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#FFBB58] px-7 py-3.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#2E0569] shadow-[0_8px_24px_rgba(255,187,88,.28)] transition hover:shadow-[0_12px_32px_rgba(255,187,88,.38)]"
                >
                  Explore the collection <ArrowRight size={16} />
                </a>
              </div>

              {/* right — image: object-cover with left-anchored position keeps logo/bottles in frame */}
              <div className="relative min-h-[320px] overflow-hidden sm:min-h-[400px]">
                <Image
                  src="/images/campaign-wide.webp"
                  alt="Pradnyasanskar product collection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-left-top"
                />
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
