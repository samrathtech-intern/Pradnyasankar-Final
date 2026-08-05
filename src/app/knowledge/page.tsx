"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FlaskConical,
  Leaf,
  Moon,
  Pill,
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOPICS = [
  { label: "All Topics", value: "all", icon: BookOpen },
  { label: "Ayurvedic Basics", value: "Ayurvedic Basics", icon: Leaf },
  { label: "Nutraceutical Education", value: "Nutraceutical Education", icon: Pill },
  { label: "Responsible Use", value: "Responsible Use", icon: ShieldCheck },
  { label: "Ingredient Knowledge", value: "Ingredient Knowledge", icon: Sparkles },
  { label: "Wellness Lifestyle", value: "Wellness Lifestyle", icon: Heart },
];

const ARTICLES = [
  {
    slug: "understanding-ayurvedic-product-formats",
    title: "Understanding common Ayurvedic products formats",
    category: "Ayurvedic Basics",
    readTime: "7 min read",
    excerpt:
      "A clear introduction to capsules, oils, powders, syrups and traditional formats — and how each fits into modern wellness.",
    image: "/images/hero-products.webp",
    featured: true,
  },
  {
    slug: "how-to-read-a-composition-panel",
    title: "How to read a composition panel",
    category: "Nutraceutical Education",
    readTime: "5 min read",
    excerpt:
      "Learn how serving size, ingredient quantity and standardisation fit together.",
    image: "/images/knowledge-nutraceutical-education.png",
    featured: false,
  },
  {
    slug: "why-directions-and-warnings-matter",
    title: "Why directions and warnings matter",
    category: "Responsible Use",
    readTime: "6 min read",
    excerpt:
      "A practical guide to reading labels responsibly for safe, informed wellness choices.",
    image: "/images/knowledge-responsible-use.png",
    featured: false,
  },
  {
    slug: "building-a-routine-without-overcomplicating-it",
    title: "Building a routine without overcomplicating it",
    category: "Wellness Lifestyle",
    readTime: "6 min read",
    excerpt:
      "Start with simple product choices and small daily rituals that stick. Be consistent, not perfect.",
    image: "/images/knowledge-wellness-lifestyle.png",
    featured: false,
  },
  {
    slug: "understanding-ashwagandha",
    title: "Understanding Ashwagandha",
    category: "Ingredient Knowledge",
    readTime: "4 min read",
    excerpt:
      "A look at Withania somnifera — its traditional use, composition and how it fits into modern wellness routines.",
    image: "/images/understanding-ashwagandha.png",
    featured: false,
  },
  {
    slug: "ayurveda-vs-nutraceuticals",
    title: "Ayurveda vs Nutraceuticals — What's the difference?",
    category: "Ayurvedic Basics",
    readTime: "5 min read",
    excerpt:
      "How Ayurvedic products and nutraceuticals differ in classification, regulation and intended use.",
    image: "/images/range-ayurveda.webp",
    featured: false,
  },
  {
    slug: "gut-health-basics",
    title: "Gut health basics",
    category: "Nutraceutical Education",
    readTime: "4 min read",
    excerpt:
      "An introduction to digestive wellness, probiotics and the role of nutrition in supporting gut health.",
    image: "/images/gut-health-basics.png",
    featured: false,
  },
];

const BROWSE_TOPICS = [
  {
    icon: Leaf,
    color: "#8C52FF",
    bg: "#F2EBFF",
    title: "Ayurvedic Basics",
    copy: "Foundations of Ayurveda principles, herbs and formulations.",
    value: "Ayurvedic Basics",
  },
  {
    icon: Pill,
    color: "#FFBB58",
    bg: "#FFF6E0",
    title: "Nutraceutical Education",
    copy: "Understand labels, ingredients, standardisation and product formats.",
    value: "Nutraceutical Education",
  },
  {
    icon: ShieldCheck,
    color: "#8C52FF",
    bg: "#F2EBFF",
    title: "Responsible Use",
    copy: "Guidance on safe selection, serving recommendations and who should consult.",
    value: "Responsible Use",
  },
  {
    icon: Sparkles,
    color: "#4CAF50",
    bg: "#EAF4E4",
    title: "Ingredient Knowledge",
    copy: "In-depth looks at key herbs, nutrients and their traditional & modern understanding.",
    value: "Ingredient Knowledge",
  },
  {
    icon: Heart,
    color: "#FFBB58",
    bg: "#FFF6E0",
    title: "Wellness Lifestyle",
    copy: "Simple routines, seasonal living and daily habits that support wellbeing.",
    value: "Wellness Lifestyle",
  },
  {
    icon: Moon,
    color: "#8C52FF",
    bg: "#F2EBFF",
    title: "Sleep, Stress & Balance",
    copy: "Educational reads on restful sleep, stress management and mental balance.",
    value: "Wellness Lifestyle",
  },
];

const TRUST_PILLARS = [
  {
    icon: BookOpen,
    color: "#8C52FF",
    bg: "#F2EBFF",
    title: "Clear & easy to read",
    copy: "Simple language, structured insights and practical takeaways.",
  },
  {
    icon: FlaskConical,
    color: "#FFBB58",
    bg: "#FFF6E0",
    title: "Evidence-informed",
    copy: "Content grounded in research and traditional Ayurvedic wisdom.",
  },
  {
    icon: GraduationCap,
    color: "#8C52FF",
    bg: "#F2EBFF",
    title: "Educational only",
    copy: "We share knowledge, not diagnosis or personal treatment.",
  },
  {
    icon: CheckCircle2,
    color: "#4CAF50",
    bg: "#EAF4E4",
    title: "Unbiased guidance",
    copy: "Independent, transparent and free from promotional bias.",
  },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────

const sideArticles = ARTICLES.filter((a) => !a.featured).slice(0, 3);
const featuredArticle = ARTICLES.find((a) => a.featured)!;

function KnowledgeHero({ onTopicClick }: { onTopicClick: (v: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF7] pb-0 pt-14 sm:pt-20">
      {/* Decorative */}
      <div className="pointer-events-none absolute left-[-60px] top-[100px] h-[200px] w-[200px] rounded-full border-[3px] border-[#E9E3EE] opacity-50" />
      <div className="pointer-events-none absolute left-[20px] top-[140px] h-[22px] w-[22px] rounded-full bg-[#FFBB58]" />

      <div className="container-page">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.35fr]">
          {/* Left */}
          <div>
            <Reveal>
              <span className="eyebrow">
                <BookOpen size={13} />
                Know more. Live better
              </span>
              <h1 className="mt-5 text-[clamp(40px,5vw,68px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#2E0569]">
                Wellness,<br />
                explained{" "}
                <span className="text-[#8C52FF]">clearly</span>
                <span className="text-[#FFBB58]">.</span>
              </h1>
              <p className="mt-5 max-w-sm text-[13.5px] leading-[1.8] text-[#716A78]">
                Educational content that supports understanding without offering diagnosis. Practical insights on Ayurveda, ingredients and wellness—backed by research, guided by tradition.
              </p>
            </Reveal>

            {/* Featured article card */}
            <Reveal delay={0.1} className="mt-8">
              <Link
                href={`/knowledge/${featuredArticle.slug}`}
                className="group relative block overflow-hidden rounded-[24px]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    priority
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2E0569]/90 via-[#2E0569]/40 to-transparent" />
                </div>
                {/* Card content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block rounded-full bg-[#FFBB58] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[.14em] text-[#2E0569]">
                    Featured Article
                  </span>
                  <h2 className="mt-2 text-[20px] font-extrabold leading-tight tracking-[-0.03em] text-white">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-white/80">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {featuredArticle.readTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Leaf size={12} /> {featuredArticle.category}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold text-[#2E0569] transition group-hover:bg-[#8C52FF] group-hover:text-white">
                      Read article <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>

          {/* Right: 3 side article cards */}
          <div className="flex flex-col gap-4">
            {sideArticles.map((article, i) => (
              <Reveal key={article.slug} delay={0.08 + i * 0.08}>
                <Link
                  href={`/knowledge/${article.slug}`}
                  className="group flex items-stretch gap-0 overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(46,5,105,.10)]"
                >
                  {/* Image */}
                  <div className="relative h-auto w-[160px] shrink-0 overflow-hidden sm:w-[180px]">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center p-5">
                    <span className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">
                      {article.category}
                    </span>
                    <h3 className="mt-1.5 text-[15px] font-extrabold leading-tight tracking-[-0.03em] text-[#2E0569] transition group-hover:text-[#8C52FF]">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-[#716A78]">
                      {article.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[10.5px] text-[#8B8292]">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {article.readTime}
                      </span>
                      <span>•</span>
                      <span>General Education</span>
                      <ArrowRight size={12} className="ml-auto text-[#8C52FF] transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Topic Filter Bar ─────────────────────────────────────────────────────────

function TopicFilterBar({
  active,
  setActive,
}: {
  active: string;
  setActive: (v: string) => void;
}) {
  return (
    <section className="bg-[#FFFDF7] py-8">
      <div className="container-page">
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto rounded-[20px] border border-[#E9E3EE] bg-white p-2">
          {TOPICS.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-[14px] px-4 py-2.5 text-[11.5px] font-extrabold transition duration-200 ${
                active === value
                  ? "bg-[#8C52FF] text-white shadow-[0_6px_18px_rgba(140,82,255,.28)]"
                  : "text-[#2E0569] hover:bg-[#F2EBFF] hover:text-[#8C52FF]"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Browse by Topic Grid ─────────────────────────────────────────────────────

function BrowseByTopic({ onExplore }: { onExplore: (v: string) => void }) {
  return (
    <section className="bg-[#FFFDF7] py-10 sm:py-14">
      <div className="container-page">
        <Reveal>
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold text-[#2E0569]">Browse by topic</h2>
            <button className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#8C52FF] transition hover:gap-2.5">
              View all articles <ArrowRight size={13} />
            </button>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {BROWSE_TOPICS.map(({ icon: Icon, color, bg, title, copy, value }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="flex flex-col rounded-[22px] border border-[#E9E3EE] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,5,105,.09)]">
                <div
                  className="grid h-12 w-12 place-items-center rounded-full"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="mt-4 text-[13.5px] font-extrabold leading-tight text-[#2E0569]">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-[11.5px] leading-[1.65] text-[#716A78]">{copy}</p>
                <button
                  onClick={() => onExplore(value)}
                  className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#8C52FF] transition hover:gap-2.5"
                >
                  Explore <ArrowRight size={11} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Trust Section ────────────────────────────────────────────────────────

function WhyTrust() {
  return (
    <section className="bg-[#F7F3FF] py-14 sm:py-16">
      <div className="container-page">
        <Reveal>
          <h2 className="mb-10 text-center text-[18px] font-extrabold text-[#2E0569]">
            Why trust this knowledge hub
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map(({ icon: Icon, color, bg, title, copy }, i) => (
            <Reveal key={title} delay={i * 0.07}>
              <div className="flex items-start gap-4">
                <div
                  className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-full"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-[13.5px] font-extrabold text-[#2E0569]">{title}</p>
                  <p className="mt-1 text-[12px] leading-[1.65] text-[#716A78]">{copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Banner ────────────────────────────────────────────────────────

function KnowledgeNewsletter() {
  return (
    <section className="bg-[#FFFDF7] py-14">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-[#F2EBFF] p-8 sm:p-12">
            {/* Decorative blob */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#DDD3E5]/50 blur-3xl" />
            <div className="pointer-events-none absolute right-[30px] bottom-[20px] h-[18px] w-[18px] rounded-full bg-[#FFBB58]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr_0.8fr]">
              {/* Text */}
              <div>
                <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold leading-tight tracking-[-0.04em] text-[#2E0569]">
                  Stay informed. Live well.
                </h2>
                <p className="mt-3 text-[13px] leading-[1.75] text-[#716A78]">
                  Subscribe to receive educational reads, ingredient insights and wellness tips—straight to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-12 flex-1 rounded-full border border-[#DDD3E5] bg-white px-5 text-[13px] text-[#2E0569] placeholder:text-[#B0A8BA] focus:border-[#8C52FF] focus:outline-none"
                  />
                  <button type="submit" className="btn-primary shrink-0">
                    Subscribe
                  </button>
                </div>
                <p className="flex items-center gap-2 text-[11px] text-[#716A78]">
                  <CheckCircle2 size={13} className="text-[#8C52FF]" />
                  No spam. Unsubscribe anytime.
                </p>
              </form>

              {/* Image */}
              <div className="hidden lg:block">
                <Image
                  src="/images/knowledge-newsletter.png"
                  alt="Stay informed"
                  width={400}
                  height={267}
                  className="w-full rounded-[20px] object-contain"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── All Articles Grid (filtered) ────────────────────────────────────────────

function ArticlesGrid({ active }: { active: string }) {
  const filtered =
    active === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === active);

  if (filtered.length === 0) return null;

  return (
    <section className="bg-[#FFFDF7] pb-10">
      <div className="container-page">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.05}>
              <Link
                href={`/knowledge/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(46,5,105,.10)]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF] backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8B8292]">
                    {article.readTime}
                  </p>
                  <h3 className="mt-2 text-[15px] font-extrabold leading-tight tracking-[-0.03em] text-[#2E0569] transition group-hover:text-[#8C52FF]">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-[#716A78] line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 border-t border-[#F0EAF4] pt-4 text-[11px] font-extrabold text-[#8C52FF]">
                    Read article
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const [activeTopic, setActiveTopic] = useState("all");

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        <KnowledgeHero onTopicClick={setActiveTopic} />
        <TopicFilterBar active={activeTopic} setActive={setActiveTopic} />
        {activeTopic !== "all" && <ArticlesGrid active={activeTopic} />}
        <BrowseByTopic onExplore={setActiveTopic} />
        <WhyTrust />
        <KnowledgeNewsletter />
      </div>
    </PageLayout>
  );
}
