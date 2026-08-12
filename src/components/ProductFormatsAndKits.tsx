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
    <section id="formats" className="bg-[#F7F5FB] py-12 sm:py-16">
      <div className="container-page">
        <Reveal>
          <span className="eyebrow"><Sparkles size={13} /> Browse by format</span>
          <div className="mt-3 grid gap-3 lg:grid-cols-[.9fr_1fr] lg:items-end">
            <h2 className="section-heading max-w-4xl">Wellness in the form that fits your{" "}<span className="font-display italic text-[#FFBB58]">routine.</span></h2>
            <p className="max-w-2xl text-[13px] leading-[1.7] text-[#716A78] lg:justify-self-end">
              Every format uses the same plain white image area, keeping the original product artwork clean and consistent.
            </p>
          </div>
        </Reveal>

        <motion.div
          variants={reduce ? undefined : gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {formats.map((format) => (
            <motion.div
              key={format.name}
              variants={reduce ? undefined : cardVariants}
              whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
              className="relative"
            >
              <a
                href="#featured"
                className="group relative flex min-h-[180px] items-center overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white p-5 transition duration-300 hover:border-[#CDBAF1] hover:shadow-[0_12px_32px_rgba(46,5,105,.10)]"
              >
                {/* Left: text */}
                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-[8.5px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Product format</span>
                  <h3 className="mt-1.5 text-[22px] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569]">{format.name}</h3>
                  <p className="mt-1.5 text-[11px] leading-[1.6] text-[#645D68]">{format.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[8.5px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">
                    Browse products
                    <motion.span
                      animate={reduce ? undefined : { x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={13} />
                    </motion.span>
                  </span>
                </div>
                {/* Right: image — no separate container, just floats right */}
                <div className="relative h-[130px] w-[100px] shrink-0">
                  <Image
                    src={format.image}
                    alt={`${format.name} product format`}
                    fill
                    sizes="100px"
                    className="object-contain transition duration-500 group-hover:scale-[1.06]"
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
  ["Product classification", "Product category, intended use, format and applicable classification details are clearly displayed, helping customers understand exactly what type of product they are viewing."],
  ["Full composition", "Complete ingredient information and applicable quantities are presented clearly using appropriate product terminology, making it easier to understand what is included in each formulation."],
  ["Directions for use", "Clear usage directions are provided for every product, including the recommended method, serving or application, frequency and other important instructions."],
  ["Warnings and cautions", "Important warnings, precautions, suitability information and usage limitations are clearly displayed to support safe and responsible product use."],
  ["Storage and shelf information", "Storage conditions, shelf-life, batch details, manufacturing date and expiry information are presented clearly for easy reference before and after purchase."],
  ["Company and customer care", "Manufacturer, marketer, company details and customer-care information are clearly provided, making it easier for customers to verify the product and get support."],
] as const;

export function TransparencySection() {
  return (
    <section id="transparency" className="bg-[#FFFDF7] py-10 sm:py-14">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-[40px] border border-[#E9E3EE] bg-white shadow-[0_24px_68px_rgba(46,5,105,.07)]">
            <div className="grid items-stretch lg:grid-cols-[1fr_1.1fr]">

              {/* Left — eyebrow + heading + para + image */}
              <div className="flex flex-col border-b border-[#E9E3EE] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <span className="eyebrow w-fit"><PackageSearch size={14} /> Quality and transparency</span>
                <h2 className="mt-3 text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.04] tracking-[-.05em] text-[#2E0569]">Clear product information, visible at a glance.</h2>
                <p className="mt-3 text-[13px] leading-[1.75] text-[#716A78]">
                  Nothing is hidden behind tabs. The complete information structure remains visible so customers can understand what to expect on every product page and label.
                </p>
                <div className="mt-5 w-full overflow-hidden rounded-2xl border border-stone-200/60 bg-[#f8f5f0] p-1 shadow-sm">
                  <Image
                    src="/images/hero-composition-3.webp"
                    alt="Pradnyasanskar product labels and external wellness range"
                    width={900}
                    height={700}
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="block h-auto w-full rounded-xl object-contain"
                  />
                </div>
              </div>

              {/* Right — 6 info cards + footnote */}
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-3">
                  {labelItems.map(([title, description]) => (
                    <article key={title} className="rounded-[22px] border border-[#E9E3EE] bg-white p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#8C52FF]" />
                        <div>
                          <h3 className="text-[13px] font-extrabold leading-tight text-[#2E0569]">{title}</h3>
                          <p className="mt-1.5 text-[11px] leading-[1.65] text-[#716A78]">{description}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="mt-4 border-t border-[#E9E3EE] pt-3 text-[10.5px] leading-relaxed text-[#716A78]">
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
    <section id="wellness-sets" className="bg-[#FAF7FF] py-10 sm:py-14">
      <div className="container-page">

        {/* header */}
        <motion.div
          variants={wsHeaderStagger}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 lg:grid-cols-[.9fr_1fr] lg:items-end"
        >
          <div>
            <motion.span variants={wsHeaderChild} className="eyebrow inline-flex">
              <Sparkles size={13} /> Wellness sets
            </motion.span>
            <motion.h2 variants={wsHeaderChild} className="section-heading mt-3">
              Simple routines, thoughtfully{" "}
              <span className="font-display italic text-[#FFBB58]">grouped.</span>
            </motion.h2>
          </div>
          <motion.p variants={wsHeaderChild} className="max-w-2xl text-[15px] leading-[1.85] text-[#716A78] lg:justify-self-end lg:text-right">
            Explore curated product combinations and premium gifting concepts designed around clear routines and responsible product discovery.
          </motion.p>
        </motion.div>

        {/* cards */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
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
              <div className="relative aspect-[16/7] overflow-hidden">
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
              <div className={`${set.panel} px-6 py-4 sm:px-8 sm:py-5`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[.15em] ${set.eyebrowTone}`}>{set.eyebrow}</p>
                <h3 className="mt-1.5 text-[clamp(22px,2.4vw,34px)] font-extrabold leading-[1.04] tracking-[-.05em]">{set.title}</h3>
                <p className={`mt-1.5 max-w-lg text-[13px] leading-[1.7] ${set.copyTone}`}>{set.copy}</p>
                <span className={`mt-3 inline-flex min-h-9 items-center gap-2 rounded-full px-5 text-[9px] font-extrabold uppercase tracking-[.13em] shadow-[0_8px_20px_rgba(0,0,0,.10)] ${set.button}`}>
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
