"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, PackageSearch, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

/* ── card variants ────────────────────────────────────────────────────── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const formats = [
  { name: "Capsules", copy: "Convenient everyday format", image: "/images/ashwagandha-capsules.png" },
  { name: "Tablets", copy: "Familiar and easy to browse", image: "/images/vitamin-c.png" },
  { name: "Powders", copy: "Flexible nutritional routines", image: "/images/plant-protein.png" },
  { name: "Oils", copy: "External wellness rituals", image: "/images/herbal-hair-oil.png" },
  { name: "Serums", copy: "Lightweight external care", image: "/images/face-serum.png" },
  { name: "Creams", copy: "Rich external-care formats", image: "/images/glow-cream.png" },
  { name: "Traditional", copy: "Familiar Ayurvedic formats", image: "/images/chyawanprash.png" },
  { name: "Daily blends", copy: "Modern routine essentials", image: "/images/daily-greens.png" },
];

export function ProductFormats() {
  const reduce = useReducedMotion();
  return (
    <section id="formats" className="bg-white py-28 sm:py-36">
      <div className="mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <span className="eyebrow"><Sparkles size={13} /> Browse by format</span>
          <div className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1fr] lg:items-end">
            <h2 className="section-heading max-w-4xl">Wellness in the form that fits your{" "}<span className="font-display italic text-[#FFBB58]">routine.</span></h2>
            <p className="max-w-2xl text-[14px] leading-relaxed text-[#716A78] lg:justify-self-end">
              Every format uses the same plain white image area, keeping the original product artwork clean and consistent.
            </p>
          </div>
        </Reveal>

        <motion.div
          variants={reduce ? undefined : gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-11 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {formats.map((format) => (
            <motion.div
              key={format.name}
              variants={reduce ? undefined : cardVariants}
              whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
              className="relative"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -inset-2 rounded-[34px] bg-[#8C52FF]/[.07] opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />

              <a
                href="#featured"
                className="group relative grid min-h-[290px] grid-cols-[1fr_144px] items-center overflow-hidden rounded-[28px] border border-[#E9E3EE] bg-white p-6 transition duration-300 hover:border-[#CDBAF1] hover:shadow-[0_18px_42px_rgba(46,5,105,.10)]"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Product format</span>
                  <h3 className="mt-3 text-[28px] font-extrabold tracking-[-.045em] text-[#2E0569]">{format.name}</h3>
                  <p className="mt-2 text-[11.5px] leading-[1.65] text-[#645D68]">{format.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">
                    Browse products
                    <motion.span
                      animate={reduce ? undefined : { x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={14} />
                    </motion.span>
                  </span>
                </div>
                <div className="relative h-[210px] overflow-hidden rounded-[20px] bg-white">
                  <Image
                    src={format.image}
                    alt={`${format.name} product format`}
                    fill
                    sizes="124px"
                    className="object-contain p-2 transition duration-500 group-hover:scale-[1.06]"
                  />
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const labelItems = [
  ["Product classification", "The product range and classification remain visible before any further product detail."],
  ["Full composition", "Ingredients and applicable quantities are presented using approved product terminology."],
  ["Directions for use", "Directions stay easy to locate and connected to the specific product and format."],
  ["Warnings and cautions", "Applicable warnings, cautions and suitability information remain clearly visible."],
  ["Storage and shelf information", "Storage conditions, batch details, manufacturing date and expiry remain readable."],
  ["Company and customer care", "Manufacturer, marketer and customer-care information remain clear and verifiable."],
] as const;

export function TransparencySection() {
  return (
    <section id="transparency" className="bg-[#FFFDF7] py-28 sm:py-36">
      <div className="mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <div className="overflow-hidden rounded-[40px] border border-[#E9E3EE] bg-white shadow-[0_24px_68px_rgba(46,5,105,.07)]">
            <div className="grid items-stretch lg:grid-cols-[.78fr_1.22fr]">
              <div className="flex items-center justify-center border-b border-[#E9E3EE] bg-[#f8f5f0] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="w-full overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-1 shadow-sm">
                  <Image
                    src="/images/hero-composition-3.webp"
                    alt="Pradnyasanskar product labels and external wellness range"
                    width={900}
                    height={700}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="block h-auto w-full rounded-xl object-contain"
                  />
                </div>
              </div>

              <div className="p-8 sm:p-12 lg:p-14">
                <span className="eyebrow"><PackageSearch size={14} /> Quality and transparency</span>
                <h2 className="mt-5 text-[clamp(38px,4.5vw,60px)] font-extrabold leading-[1.02] tracking-[-.05em] text-[#2E0569]">Clear product information, visible at a glance.</h2>
                <p className="mt-5 max-w-3xl text-[13px] leading-[1.8] text-[#716A78]">
                  Nothing is hidden behind tabs. The complete information structure remains visible so customers can understand what to expect on every product page and label.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {labelItems.map(([title, description]) => (
                    <article key={title} className="rounded-[22px] border border-[#E9E3EE] bg-white p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#8C52FF]" />
                        <div>
                          <h3 className="text-[13px] font-extrabold leading-tight text-[#2E0569]">{title}</h3>
                          <p className="mt-2 text-[11px] leading-[1.65] text-[#716A78]">{description}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <p className="mt-6 border-t border-[#E9E3EE] pt-5 text-[10.5px] leading-relaxed text-[#716A78]">
                  Licence and certification details will be shown after company verification and approval.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const wsHeaderStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const wsHeaderChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
};
const wsCardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function WellnessSets() {
  const reduce = useReducedMotion();
  const sets = [
    { eyebrow: "Everyday discovery", title: "A balanced wellness selection", copy: "A curated mix of Ayurveda, nutrition and external-care formats for broad collection discovery.", image: "/images/hero-composition-4.webp", panel: "bg-[#2E0569] text-white", eyebrowTone: "text-[#FFCF85]", copyTone: "text-white/[.72]", button: "bg-[#FFBB58] text-[#2E0569]" },
    { eyebrow: "Thoughtful gifting", title: "The Pradnyasanskar gift ritual", copy: "Premium presentation designed for meaningful personal, family and seasonal wellness gifting.", image: "/images/cta-gift.webp", panel: "bg-[#FFF1DA] text-[#2E0569]", eyebrowTone: "text-[#B36B0A]", copyTone: "text-[#6B5640]", button: "bg-[#2E0569] text-white" },
  ];
  return (
    <section id="wellness-sets" className="bg-[#FAF7FF] py-28 sm:py-36">
      <div className="mx-auto w-[92%] max-w-none px-0">

        {/* header */}
        <motion.div
          variants={wsHeaderStagger}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 lg:grid-cols-[.9fr_1fr] lg:items-end"
        >
          <div>
            <motion.span variants={wsHeaderChild} className="eyebrow inline-flex">
              <Sparkles size={13} /> Wellness sets
            </motion.span>
            <motion.h2 variants={wsHeaderChild} className="section-heading mt-5">
              Simple routines, thoughtfully{" "}
              <span className="font-display italic text-[#FFBB58]">grouped.</span>
            </motion.h2>
          </div>
          <motion.p variants={wsHeaderChild} className="max-w-2xl text-[15px] leading-[1.85] text-[#716A78] lg:justify-self-end lg:text-right">
            Explore curated product combinations and premium gifting concepts designed around clear routines and responsible product discovery.
          </motion.p>
        </motion.div>

        {/* cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {sets.map((set, index) => (
            <motion.a
              key={set.title}
              href="#featured"
              custom={index}
              variants={wsCardVariants}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
              className="group block overflow-hidden rounded-[32px] border border-[#E9E3EE]/80 bg-white shadow-[0_18px_55px_rgba(46,5,105,.08)] transition-shadow duration-300 hover:shadow-[0_32px_80px_rgba(46,5,105,.14)]"
            >
              {/* image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  whileHover={reduce ? undefined : { scale: 1.04, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <Image
                    src={set.image}
                    alt={set.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>

              {/* content */}
              <div className={`${set.panel} p-8 sm:p-11`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[.15em] ${set.eyebrowTone}`}>{set.eyebrow}</p>
                <h3 className="mt-3 text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.04] tracking-[-.05em]">{set.title}</h3>
                <p className={`mt-3 max-w-lg text-[13px] leading-[1.75] ${set.copyTone}`}>{set.copy}</p>
                <span className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-[9px] font-extrabold uppercase tracking-[.13em] shadow-[0_8px_20px_rgba(0,0,0,.10)] ${set.button}`}>
                  Explore the set
                  <motion.span
                    animate={reduce ? undefined : { x: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight size={15} />
                  </motion.span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
