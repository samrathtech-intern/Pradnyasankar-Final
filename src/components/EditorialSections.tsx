"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Clock3, Leaf, Mail, PackageCheck, Sparkles } from "lucide-react";
import { ingredients } from "@/data";
import { Reveal } from "./Reveal";

type Ingredient = (typeof ingredients)[number];
type TurnState = { from: number; to: number; direction: 1 | -1 };

function IngredientDetails({ ingredient, pageNumber }: { ingredient: Ingredient; pageNumber: number }) {
  return (
    <div className="relative flex h-full flex-col p-7 sm:p-9 lg:p-10">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[11.5px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Pradnyasanskar botanical library</p>
          <p className="mt-2 font-display text-[17px] italic text-[#8A7D73]">Ingredient monograph</p>
        </div>
        <Leaf size={22} className="shrink-0 text-[#8C52FF]" />
      </div>

      <div className="mt-7 border-b border-[#D9CEC0] pb-5">
        <h3 className="text-[clamp(48px,4.4vw,66px)] font-extrabold leading-[.96] tracking-[-.055em] text-[#2E0569]">{ingredient.name}</h3>
        <p className="mt-3 font-display text-[20px] italic leading-tight text-[#716A78]">{ingredient.technical}</p>
      </div>

      <p className="mt-5 text-[16px] leading-[1.78] text-[#554D5B]">{ingredient.copy}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">Key plant constituents</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ingredient.nutrients.map((item) => (
              <span key={item} className="rounded-full border border-[#D9CEC0] bg-[#FFFDF7]/75 px-3 py-2 text-[11.5px] font-bold leading-none text-[#2E0569]">{item}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">Often explored within</p>
          <div className="mt-3 space-y-2.5">
            {ingredient.benefits.map((item) => (
              <p key={item} className="flex gap-2.5 text-[13px] font-semibold leading-[1.55] text-[#645D68]"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#F08C26]" />{item}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-[#D9CEC0] pt-4">
        <p className="text-[12px] leading-[1.68] text-[#817887]">
          Ingredient education only. Final composition, quantity, directions, warnings and permitted claims depend on the approved product label.
        </p>
      </div>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-[15px] italic text-[#9B8F82]">{pageNumber}</span>
    </div>
  );
}

function BotanicalPlate({ ingredient, pageNumber }: { ingredient: Ingredient; pageNumber: number }) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="relative mx-5 mt-5 h-[73%] overflow-hidden rounded-[5px_18px_18px_5px] border border-[#D9CEC0] bg-[#EFE7DA] sm:mx-7 sm:mt-7">
        <Image src={ingredient.image} alt={`${ingredient.name} botanical editorial`} fill sizes="(max-width: 1024px) 50vw, 42vw" className="object-cover" />
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-[#FFFDF7]/90 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#2E0569] shadow-sm backdrop-blur">Botanical plate</span>
      </div>
      <div className="px-7 pb-7 pt-5 text-center sm:px-10">
        <p className="font-display text-[17px] italic text-[#8A7D73]">Plate {String(pageNumber).padStart(2, "0")}</p>
        <p className="mt-1 text-[32px] font-extrabold tracking-[-.035em] text-[#2E0569]">{ingredient.name}</p>
        <p className="mt-1 text-[14px] italic text-[#716A78]">{ingredient.technical}</p>
      </div>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-[15px] italic text-[#9B8F82]">{pageNumber}</span>
    </div>
  );
}

export function IngredientsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [turn, setTurn] = useState<TurnState | null>(null);
  const [singlePageLayout, setSinglePageLayout] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const syncLayout = () => setSinglePageLayout(media.matches);
    syncLayout();
    media.addEventListener("change", syncLayout);
    return () => media.removeEventListener("change", syncLayout);
  }, []);
  const current = ingredients[activeIndex];
  const target = turn ? ingredients[turn.to] : current;
  const leftIngredient = turn?.direction === -1 ? target : current;
  const rightIngredient = turn?.direction === 1 ? target : current;

  const move = (direction: 1 | -1) => {
    if (turn) return;
    const nextIndex = (activeIndex + direction + ingredients.length) % ingredients.length;
    if (reduce || singlePageLayout) {
      setActiveIndex(nextIndex);
      return;
    }
    setTurn({ from: activeIndex, to: nextIndex, direction });
  };

  const completeTurn = () => {
    if (!turn) return;
    setActiveIndex(turn.to);
    setTurn(null);
  };

  return (
    <section id="ingredients" className="overflow-hidden bg-white py-28 sm:py-36">
      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <span className="eyebrow"><BookOpen size={13} /> Ingredient library</span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[.9fr_1fr] lg:items-end">
            <h2 className="section-heading">Open the story behind every ingredient.</h2>
            <p className="max-w-2xl text-[15px] leading-[1.8] text-[#645D68] lg:justify-self-end">
              Turn the pages of a visual botanical volume where ingredient identity, plant constituents, familiar wellness contexts and responsible-use notes stay together.
            </p>
          </div>
        </Reveal>

        <Reveal delay={.08}>
          <div className="mt-8">
            {/* nav bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#EDE6DC] pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#8C52FF]">Botanical volume I</p>
                <p className="mt-1 text-[13px] font-semibold text-[#716A78]">Leaf {String(activeIndex + 1).padStart(2, "0")} of {String(ingredients.length).padStart(2, "0")} · click either page to turn</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => move(-1)} aria-label="Previous ingredient" className="round-arrow"><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => move(1)} aria-label="Next ingredient" className="round-arrow"><ChevronRight size={18} /></button>
              </div>
            </div>

            {/* book frame */}
            <div className="overflow-hidden rounded-[32px] border border-[#E2D9CC] bg-[#F9F5EF] shadow-[0_12px_48px_rgba(46,5,105,.08),0_2px_8px_rgba(46,5,105,.04)]">
              <div className="ingredient-book-stage">
                <div className="ingredient-book-cover" aria-hidden="true" />
                <div className="ingredient-book-edge" aria-hidden="true" />
                <div className="ingredient-book">
                  <article className="ingredient-book-page ingredient-book-page-left">
                    <BotanicalPlate ingredient={leftIngredient} pageNumber={(turn?.direction === -1 ? turn.to : activeIndex) * 2 + 1} />
                    <button type="button" onClick={() => move(-1)} aria-label="Turn to previous ingredient" className="absolute inset-0 z-20 cursor-w-resize" />
                  </article>
                  <article className="ingredient-book-page ingredient-book-page-right">
                    <IngredientDetails ingredient={rightIngredient} pageNumber={(turn?.direction === 1 ? turn.to : activeIndex) * 2 + 2} />
                    <button type="button" onClick={() => move(1)} aria-label="Turn to next ingredient" className="absolute inset-0 z-20 cursor-e-resize" />
                  </article>
                  <div className="ingredient-book-spine" aria-hidden="true" />
                  {turn && !reduce && (
                    <motion.div
                      key={`${turn.from}-${turn.to}-${turn.direction}`}
                      className={`ingredient-turning-leaf ${turn.direction === 1 ? "ingredient-turning-leaf-forward" : "ingredient-turning-leaf-backward"}`}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: turn.direction === 1 ? -180 : 180 }}
                      transition={{ duration: 1.05, ease: [0.645, 0.045, 0.355, 1] }}
                      onAnimationComplete={completeTurn}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="ingredient-turn-face ingredient-turn-front">
                        {turn.direction === 1 ? (
                          <IngredientDetails ingredient={ingredients[turn.from]} pageNumber={turn.from * 2 + 2} />
                        ) : (
                          <BotanicalPlate ingredient={ingredients[turn.from]} pageNumber={turn.from * 2 + 1} />
                        )}
                      </div>
                      <div className="ingredient-turn-face ingredient-turn-back">
                        {turn.direction === 1 ? (
                          <BotanicalPlate ingredient={ingredients[turn.to]} pageNumber={turn.to * 2 + 1} />
                        ) : (
                          <IngredientDetails ingredient={ingredients[turn.to]} pageNumber={turn.to * 2 + 2} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const articles = [
  { slug: "reading-a-supplement-label", category: "Ayurveda basics", title: "Understanding common Ayurvedic product formats", image: "/images/brand-story-2.webp", copy: "A clear introduction to capsules, oils, powders, syrups and traditional formats." },
  { slug: "reading-a-supplement-label", category: "Nutraceutical education", title: "How to read a composition panel", image: "/images/brand-story-4.webp", copy: "Learn how serving size, ingredient quantity and product classification fit together." },
  { slug: "daily-wellness-routines", category: "Responsible use", title: "Why directions and warnings matter", image: "/images/lifestyle-4.webp", copy: "A practical guide to locating and understanding approved product information." },
  { slug: "daily-wellness-routines", category: "Everyday wellness", title: "Building a routine without overcomplicating it", image: "/images/lifestyle-8.webp", copy: "Start with simple product discovery and keep information-led choices at the centre." },
];

export function KnowledgeSection() {
  return (
    <section id="knowledge" className="bg-[#FAF7FF] py-28 sm:py-36">
      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <Reveal><span className="eyebrow">Knowledge hub</span><h2 className="section-heading mt-5">Wellness, explained clearly.</h2><p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[#716A78]">Educational content that supports understanding without offering diagnosis, personalised dosage or disease-treatment guidance.</p></Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal>
            <Link href={`/knowledge/${articles[0].slug}`} className="group grid min-h-[680px] overflow-hidden rounded-[36px] border border-[#E9E3EE] bg-white sm:grid-rows-[1fr_auto] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(46,5,105,.12)]">
              <div className="relative min-h-[400px] overflow-hidden"><Image src={articles[0].image} alt={articles[0].title} fill className="object-cover transition duration-700 group-hover:scale-[1.035]" /></div>
              <div className="bg-[#2E0569] p-7 text-white sm:p-9"><span className="rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[.14em]">{articles[0].category}</span><h3 className="mt-5 max-w-2xl text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.05] tracking-[-.05em]">{articles[0].title}</h3><p className="mt-4 max-w-xl text-[13px] leading-[1.75] text-white/[.72]">{articles[0].copy}</p><span className="mt-6 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#FFCF85]">Read article <ArrowRight size={15} /></span></div>
            </Link>
          </Reveal>
          <div className="grid gap-5">{articles.slice(1).map((article, index) => <Reveal key={article.title} delay={index * .06}><Link href={`/knowledge/${article.slug}`} className="group grid overflow-hidden rounded-[28px] border border-[#E9E3EE] bg-white sm:grid-cols-[180px_1fr] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,5,105,.10)]"><div className="relative min-h-[220px] sm:min-h-full"><Image src={article.image} alt={article.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" /></div><div className="p-6"><p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">{article.category}</p><h3 className="mt-3 text-[23px] font-extrabold leading-tight tracking-[-.035em] text-[#2E0569]">{article.title}</h3><p className="mt-3 text-[12px] leading-[1.7] text-[#716A78]">{article.copy}</p><div className="mt-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-[#8B8292]"><Clock3 size={14} />Clear reading • General education</div></div></Link></Reveal>)}</div>
        </div>
      </div>
    </section>
  );
}

const community = [
  { title: "Morning clarity", copy: "A calm beginning built around simple daily rituals.", image: "/images/community-1.webp" },
  { title: "Movement and vitality", copy: "Active routines that make space for consistency.", image: "/images/community-2.webp" },
  { title: "Beauty from within", copy: "Skin and hair discovery across internal and external formats.", image: "/images/community-3.webp" },
  { title: "Everyday nourishment", copy: "Flexible product formats for modern nutritional routines.", image: "/images/community-4.webp" },
];

export function CommunitySection() {
  return (
    <section className="bg-white py-28 sm:py-36">
      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-[.9fr_1fr] lg:items-end">
            <div>
              <span className="eyebrow">Everyday wellness stories</span>
              <h2 className="section-heading mt-5 max-w-4xl">Wellness looks different in every routine.</h2>
            </div>
            <p className="max-w-2xl text-[14px] leading-relaxed text-[#716A78] lg:justify-self-end">
              Explore real-life moments that shape the Pradnyasanskar approach to modern wellness—presented as visual inspiration, not customer testimonials.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {community.map((item, index) => (
            <Reveal key={item.title} delay={index * .055}>
              <article className="group flex h-full min-h-[510px] flex-col overflow-hidden rounded-[30px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#CDBAF1] hover:shadow-[0_18px_44px_rgba(46,5,105,.08)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Real-life wellness moment</p>
                  <h3 className="mt-2 text-[24px] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569]">{item.title}</h3>
                  <p className="mt-3 text-[11.5px] leading-[1.7] text-[#645D68]">{item.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-3xl border-t border-[#E9E3EE] px-5 pt-5 text-center text-[11px] leading-relaxed text-[#716A78]">
          Lifestyle imagery is used for general brand storytelling. Individual experiences vary and do not replace product directions or professional advice.
        </p>
      </div>
    </section>
  );
}

export function BusinessCTA() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="business" className="bg-[#FFFDF7] py-28 sm:py-36">
      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <div className="overflow-hidden rounded-[40px] border border-[#E9E3EE] bg-[#F2EBFF] shadow-[0_28px_80px_rgba(46,5,105,.09)]">
            <div className="grid lg:grid-cols-[.95fr_1.05fr]">
              <div className="p-8 sm:p-11 lg:p-12">
                <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">Business with Pradnyasanskar</span>
                <h2 className="mt-4 text-[clamp(42px,5vw,66px)] font-extrabold leading-[1] tracking-[-.055em] text-[#2E0569]">Let’s build thoughtful wellness opportunities.</h2>
                <p className="mt-5 max-w-xl text-[14px] leading-[1.8] text-[#645D68]">Connect for distributor interest, bulk purchase, institutional supply, private-label requirements, product development or contract-manufacturing discussions, subject to capability confirmation.</p>
                <div className="mt-6 flex flex-wrap gap-2">{["Distributor", "Bulk purchase", "Institutional supply", "Private label", "Product development"].map((item) => <span key={item} className="rounded-full border border-[#DCD0EA] bg-white/75 px-4 py-2 text-[10px] font-extrabold text-[#2E0569]">{item}</span>)}</div>

                {submitted ? (
                  <div className="mt-8 rounded-[24px] border border-[#CFE5C4] bg-[#EAF4E4] p-6"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#4A732F]">Enquiry captured</p><h3 className="mt-2 text-[22px] font-extrabold text-[#2E0569]">Thank you for connecting.</h3><p className="mt-2 text-[12px] leading-relaxed text-[#5F6D57]">Your enquiry has been recorded. The Pradnyasanskar team can follow up using the contact information provided.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-4 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">Submit another enquiry</button></div>
                ) : (
                  <form id="business-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="mt-8 grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#675A71]">Name<input required name="name" className="min-h-12 rounded-2xl border border-[#DCD0EA] bg-white px-4 text-[13px] font-semibold normal-case tracking-normal text-[#2E0569] outline-none focus:border-[#8C52FF]" /></label>
                    <label className="grid gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#675A71]">Email<input required type="email" name="email" className="min-h-12 rounded-2xl border border-[#DCD0EA] bg-white px-4 text-[13px] font-semibold normal-case tracking-normal text-[#2E0569] outline-none focus:border-[#8C52FF]" /></label>
                    <label className="grid gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#675A71] sm:col-span-2">Enquiry type<select name="type" className="min-h-12 rounded-2xl border border-[#DCD0EA] bg-white px-4 text-[13px] font-semibold normal-case tracking-normal text-[#2E0569] outline-none focus:border-[#8C52FF]"><option>Distributor or dealer</option><option>Bulk purchase</option><option>Institutional supply</option><option>Private label</option><option>Product development</option><option>Contract manufacturing</option></select></label>
                    <label className="grid gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#675A71] sm:col-span-2">Message<textarea required name="message" rows={3} className="rounded-2xl border border-[#DCD0EA] bg-white px-4 py-3 text-[13px] font-semibold normal-case tracking-normal text-[#2E0569] outline-none focus:border-[#8C52FF]" /></label>
                    <button className="btn-primary mt-2 sm:col-span-2">Submit business enquiry<ArrowRight size={17} /></button>
                  </form>
                )}
              </div>

              <div className="flex min-h-[480px] items-center justify-center rounded-r-[40px] bg-[#EDE4FF] p-6 sm:p-8 lg:min-h-0 lg:p-10">
                <div className="relative w-full">
                  <div className="overflow-hidden rounded-[24px] border border-[#D8CCF0] bg-white shadow-[0_16px_48px_rgba(46,5,105,.13)]">
                    <Image
                      src="/images/business-partnership.jpeg"
                      alt="Pradnyasanskar business partnership"
                      width={800}
                      height={600}
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 w-[min(72%,240px)] rounded-[18px] bg-[#2E0569]/90 p-4 text-white shadow-[0_12px_32px_rgba(46,5,105,.32)] backdrop-blur-md sm:bottom-5 sm:right-5">
                    <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#FFCF85]">Business pathways</p>
                    <p className="mt-2 text-[12px] font-bold leading-[1.6] text-white/80">Distributor, institutional, private-label and product-development conversations in one clear enquiry flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email || !agreed) return;
    setSubmitted(true);
  }

  return (
    <section id="newsletter" className="bg-white py-28 sm:py-36">
      <div className="relative mx-auto w-[92%] max-w-none px-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-[38px] bg-[#2E0569] text-white">
            <div className="grid min-h-[520px] lg:grid-cols-[1fr_1fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <Image src="/images/cta-gift.webp" alt="Pradnyasanskar wellness gifting collection" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2E0569]/75 lg:block" />
              </div>
              <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.15em]">
                  <Mail size={14} />Stay connected
                </span>
                <h2 className="mt-6 text-[clamp(42px,5vw,68px)] font-extrabold leading-[1] tracking-[-.055em]">Wellness worth coming back to.</h2>
                <p className="mt-5 max-w-xl text-[14px] leading-[1.8] text-white/[.72]">Receive ingredient education, product stories, new collection updates and approved offers from Pradnyasanskar.</p>

                {submitted ? (
                  <div className="mt-7 rounded-[20px] border border-white/20 bg-white/10 p-6">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#FFBB58]">You're in!</p>
                    <p className="mt-2 text-[15px] font-extrabold">Thank you for joining the community.</p>
                    <p className="mt-1 text-[13px] text-white/70">We'll be in touch with wellness updates and product stories.</p>
                  </div>
                ) : (
                  <form className="mt-7 flex flex-col gap-3" onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="min-h-[52px] flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-[13px] text-white placeholder:text-white/50 outline-none focus:border-[#FFBB58]"
                      />
                      <button
                        type="submit"
                        className="min-h-[52px] rounded-full bg-[#FFBB58] px-7 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#2E0569] transition hover:-translate-y-0.5 disabled:opacity-50"
                        disabled={!agreed}
                      >
                        Join the community
                      </button>
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 text-[10px] leading-relaxed text-white/60">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded accent-[#FFBB58]"
                      />
                      I agree to receive Pradnyasanskar updates and understand that I can unsubscribe at any time.
                    </label>
                  </form>
                )}

                <div className="mt-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-white/[.55]">
                  <PackageCheck size={16} className="text-[#FFBB58]" />No spam. Only useful product and wellness updates.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
