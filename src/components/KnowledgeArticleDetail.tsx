"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, BookOpen, Info, Lightbulb,
  Star, ChevronDown, CheckCircle2, Clock, Mail, Share2,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelatedArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
}

export interface ComparisonRow {
  [key: string]: string;
}

export interface ArticleData {
  title: string;
  category: string;
  readTime: string;
  image: string;
  author: string;
  publishedDate: string;
  intro: string;
  sections: { heading: string; body: string }[];
  // per-article extras (optional — fallback to defaults if omitted)
  didYouKnow?: string;
  expertTip?: string;
  comparisonHeaders?: string[];
  comparisonRows?: ComparisonRow[];
  keyTakeaways?: string[];
  faqs?: { q: string; a: string }[];
  related?: RelatedArticle[];
  checklist?: string[];
}

// ─── Default fallbacks (used when article doesn't supply its own) ─────────────

const DEFAULT_RELATED: RelatedArticle[] = [
  {
    slug: "understanding-ashwagandha",
    category: "Ingredient Knowledge",
    title: "Understanding Ashwagandha",
    excerpt: "A look at Withania somnifera — its traditional use, composition and modern wellness context.",
    readTime: "4 min read",
    image: "/images/understanding-ashwagandha.png",
  },
  {
    slug: "ayurveda-vs-nutraceuticals",
    category: "Ayurvedic Basics",
    title: "Ayurveda vs Nutraceuticals — What's the difference?",
    excerpt: "How Ayurvedic products and nutraceuticals differ in classification, regulation and intended use.",
    readTime: "5 min read",
    image: "/images/range-ayurveda.webp",
  },
  {
    slug: "daily-wellness-routines",
    category: "Wellness Lifestyle",
    title: "Building a daily wellness routine",
    excerpt: "Simple, consistent habits for incorporating wellness products into everyday life.",
    readTime: "5 min read",
    image: "/images/daily-wellness.webp",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DidYouKnow({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-[20px] border border-[#DDD3E5] bg-[#F2EBFF] p-5">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#8C52FF]">
        <Lightbulb size={15} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">Did You Know?</p>
        <p className="mt-1.5 text-[13.5px] leading-[1.75] text-[#2E0569]">{text}</p>
      </div>
    </div>
  );
}

function ExpertTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-[20px] border border-[#FFE8A3] bg-[#FFFBEE] p-5">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFBB58]">
        <Star size={14} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#B07A00]">Expert Tip</p>
        <p className="mt-1.5 text-[13.5px] leading-[1.75] text-[#2E0569]">{text}</p>
      </div>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-6 shadow-[0_4px_16px_rgba(46,5,105,.06)]">
      <p className="text-[13px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">Quick Checklist — Before You Buy</p>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#8C52FF] text-[10px] font-extrabold text-white">
              {i + 1}
            </span>
            <span className="text-[13.5px] leading-[1.7] text-[#2E0569]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonTable({ headers, rows }: { headers: string[]; rows: ComparisonRow[] }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] shadow-[0_4px_20px_rgba(46,5,105,.06)]">
      <div className="bg-[#2E0569] px-5 py-3.5">
        <p className="text-[12px] font-extrabold uppercase tracking-[.12em] text-white">Comparison Table</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left" style={{ minWidth: `${headers.length * 130}px` }}>
          <thead>
            <tr className="border-b border-[#E9E3EE] bg-[#FAF7FF]">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-[10.5px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b border-[#F0EAF4] transition hover:bg-[#FAF7FF] ${i % 2 === 0 ? "bg-white" : "bg-[#FDFBFF]"}`}>
                {headers.map((h, j) => (
                  <td key={h} className={`px-4 py-3 text-[13px] ${j === 0 ? "font-extrabold text-[#2E0569]" : "text-[#716A78]"}`}>
                    {row[h] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KeyTakeaways({ points }: { points: string[] }) {
  return (
    <div className="rounded-[20px] border border-[#DDD3E5] bg-gradient-to-br from-[#F2EBFF] to-[#FAF7FF] p-6 shadow-[0_4px_20px_rgba(46,5,105,.07)]">
      <p className="text-[13px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">Key Takeaways</p>
      <ul className="mt-4 space-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#8C52FF]" />
            <span className="text-[13.5px] leading-[1.7] text-[#2E0569]">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-[22px] font-extrabold tracking-[-.03em] text-[#2E0569]">Frequently Asked Questions</p>
      {faqs.map((faq, i) => (
        <div key={i} className="overflow-hidden rounded-[16px] border border-[#E9E3EE] bg-white shadow-[0_2px_10px_rgba(46,5,105,.04)]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-[13.5px] font-extrabold leading-snug text-[#2E0569]">{faq.q}</span>
            <ChevronDown size={16} className={`shrink-0 text-[#8C52FF] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="border-t border-[#F0EAF4] px-5 pb-4 pt-3">
              <p className="text-[13px] leading-[1.8] text-[#716A78]">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RelatedArticlesGrid({ articles }: { articles: RelatedArticle[] }) {
  return (
    <div>
      <p className="text-[22px] font-extrabold tracking-[-.03em] text-[#2E0569]">Related Articles</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {articles.map((article, idx) => (
          <Link
            key={article.slug}
            href={`/knowledge/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white shadow-[0_4px_16px_rgba(46,5,105,.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(46,5,105,.12)]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4EEFF]">
              {idx === 2 ? (
                <div
                  className="absolute inset-0 bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: "contain",
                    backgroundColor: "#F4EEFF",
                  }}
                />
              ) : (
                <Image src={article.image} alt={article.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] backdrop-blur-sm">
                {article.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-[13.5px] font-extrabold leading-snug tracking-[-0.02em] text-[#2E0569] transition group-hover:text-[#8C52FF]">
                {article.title}
              </h3>
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#716A78] line-clamp-2">{article.excerpt}</p>
              <div className="mt-3 flex items-center justify-between border-t border-[#F0EAF4] pt-3">
                <span className="flex items-center gap-1 text-[10.5px] text-[#8B8292]"><Clock size={11} /> {article.readTime}</span>
                <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#8C52FF] transition-transform group-hover:translate-x-0.5">
                  Read <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="rounded-[20px] bg-[#2E0569] p-7 shadow-[0_8px_32px_rgba(46,5,105,.22)]">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#8C52FF]">
          <Mail size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[16px] font-extrabold leading-snug text-white">Stay informed. Live well.</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/70">
            Educational reads, ingredient insights and wellness tips — straight to your inbox.
          </p>
          {done ? (
            <p className="mt-4 flex items-center gap-2 text-[13px] font-extrabold text-[#FFBB58]">
              <CheckCircle2 size={15} /> You're subscribed — thank you!
            </p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-[13px] text-white placeholder:text-white/40 focus:border-[#8C52FF] focus:outline-none"
              />
              <button type="submit" className="btn-primary shrink-0 !bg-[#FFBB58] !text-[#2E0569] hover:!bg-white">Subscribe</button>
            </form>
          )}
          <p className="mt-2 text-[11px] text-white/40">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}

function ShareButtons({ title }: { title: string }) {
  const encoded = encodeURIComponent(title);
  const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  return (
    <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-5 shadow-[0_4px_16px_rgba(46,5,105,.06)]">
      <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">
        <Share2 size={13} /> Share this article
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { label: "WhatsApp", href: `https://wa.me/?text=${encoded}%20${url}`, bg: "#25D366" },
          { label: "Twitter / X", href: `https://twitter.com/intent/tweet?text=${encoded}&url=${url}`, bg: "#1DA1F2" },
          { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, bg: "#0A66C2" },
        ].map(({ label, href, bg }) => (
          <a
            key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="rounded-full px-3 py-1.5 text-[10.5px] font-extrabold text-white transition hover:opacity-80"
            style={{ background: bg }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function KnowledgeArticleDetail({ article }: { article: ArticleData; slug?: string }) {
  const related = article.related ?? DEFAULT_RELATED;
  const keyTakeaways = article.keyTakeaways ?? [
    "The format of an Ayurvedic product is as important as the herb itself.",
    "Always check whether a capsule contains raw powder or a standardised extract — they are different products.",
    "Liquid formats absorb quickly and suit those who cannot swallow tablets.",
    "Store every format according to its label instructions to preserve potency and safety.",
  ];
  const faqs = article.faqs ?? [
    { q: "Are Ayurvedic products regulated in India?", a: "Yes. Ayurvedic products are regulated under the Drugs and Cosmetics Act. Nutraceuticals fall under FSSAI. Both require full labelling including licence number, batch details and expiry date." },
    { q: "How should I store Ayurvedic products?", a: "Storage varies by format. Powders need airtight containers away from moisture. Oils away from heat. Many liquids require refrigeration after opening. Always follow the label." },
  ];
  const didYouKnow = article.didYouKnow ?? "Ayurveda classifies preparations not just by form but by the medium used — water, milk, ghee, honey or oil — because each medium is believed to carry the herb's properties to different tissues in the body.";
  const expertTip = article.expertTip ?? "Always read the composition panel before purchasing. Look for the form of each herb, the quantity per serving, and the applicable licence or registration number.";
  const hasComparison = article.comparisonHeaders && article.comparisonRows && article.comparisonRows.length > 0;
  const hasChecklist = article.checklist && article.checklist.length > 0;

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* Breadcrumb */}
      <div className="border-b border-[#E9E3EE] bg-white">
        <div className="container-page flex items-center gap-2 py-4 text-[11px] font-semibold text-[#8B8292]">
          <Link href="/" className="transition hover:text-[#2E0569]">Home</Link>
          <span>/</span>
          <Link href="/knowledge" className="transition hover:text-[#2E0569]">Knowledge</Link>
          <span>/</span>
          <span className="line-clamp-1 text-[#2E0569]">{article.title}</span>
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        {/* Back button */}
        <Link href="/knowledge" className="mb-8 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] transition hover:text-[#2E0569]">
          <ArrowLeft size={14} /> Back to knowledge hub
        </Link>

        <div className="flex items-start gap-10">

          {/* ── Main content ── */}
          <div className="min-w-0 flex-1">

            {/* Header */}
            <Reveal>
              <span className="eyebrow"><BookOpen size={13} /> {article.category}</span>
              <h1 className="mt-5 text-[clamp(26px,4vw,46px)] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569]">
                {article.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[#8B8292]">
                <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} read</span>
                <span className="text-[#D8CEE1]">·</span>
                <span>By {article.author}</span>
                <span className="text-[#D8CEE1]">·</span>
                <span>Published {article.publishedDate}</span>
              </div>
            </Reveal>

            {/* Hero image */}
            <Reveal delay={0.06}>
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                <Image src={article.image} alt={article.title} fill className="object-cover" priority />
              </div>
            </Reveal>

            {/* Disclaimer */}
            <Reveal delay={0.08}>
              <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-[#E9E3EE] bg-[#FAF7FF] p-4">
                <Info size={15} className="mt-0.5 shrink-0 text-[#8C52FF]" />
                <p className="text-[12px] leading-relaxed text-[#716A78]">
                  This article is for general educational purposes only. It does not constitute medical advice, diagnosis or personalised treatment recommendations. Consult a qualified healthcare professional before making any health decisions.
                </p>
              </div>
            </Reveal>

            {/* Intro */}
            <Reveal delay={0.1}>
              <p className="mt-7 text-[15.5px] font-semibold leading-[1.9] text-[#2E0569]">{article.intro}</p>
            </Reveal>

            {/* Sections with injected callouts */}
            <div className="mt-8 space-y-8">
              {article.sections.map((section, i) => (
                <Reveal key={section.heading} delay={i * 0.04}>
                  <div id={`section-${i}`}>
                    <h2 className="text-[19px] font-extrabold tracking-[-.03em] text-[#2E0569]">{section.heading}</h2>
                    <p className="mt-3 text-[14.5px] leading-[1.9] text-[#716A78]">{section.body}</p>
                  </div>

                  {i === 0 && <div className="mt-5"><DidYouKnow text={didYouKnow} /></div>}
                  {i === 2 && <div className="mt-5"><ExpertTip text={expertTip} /></div>}
                  {i === 3 && hasComparison && (
                    <div className="mt-5">
                      <ComparisonTable headers={article.comparisonHeaders!} rows={article.comparisonRows!} />
                    </div>
                  )}
                  {i === 4 && hasChecklist && (
                    <div className="mt-5">
                      <Checklist items={article.checklist!} />
                    </div>
                  )}
                </Reveal>
              ))}
            </div>

            {/* Key Takeaways */}
            <Reveal>
              <div className="mt-10"><KeyTakeaways points={keyTakeaways} /></div>
            </Reveal>

            {/* FAQ */}
            <Reveal>
              <div className="mt-10"><FaqAccordion faqs={faqs} /></div>
            </Reveal>

            {/* Footer disclaimer */}
            <Reveal>
              <div className="mt-10 rounded-[16px] border border-[#E9E3EE] bg-[#FAF7FF] p-5">
                <p className="text-[11px] leading-relaxed text-[#8B8292]">
                  Content on the Pradnyasanskar Knowledge Hub is approved for general education only. It does not replace the directions, warnings or declarations on individual product labels. Pradnyasanskar does not provide diagnosis, prescription or personalised medical advice.
                </p>
              </div>
            </Reveal>

            {/* Related Articles */}
            <Reveal>
              <div className="mt-12"><RelatedArticlesGrid articles={related} /></div>
            </Reveal>

            {/* Newsletter */}
            <Reveal>
              <div className="mt-10"><NewsletterSection /></div>
            </Reveal>

            {/* Navigation */}
            <Reveal>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/knowledge" className="btn-secondary"><ArrowLeft size={15} /> All articles</Link>
                <Link href="/shop" className="btn-primary">Explore products <ArrowRight size={15} /></Link>
              </div>
            </Reveal>
          </div>

          {/* ── Sticky sidebar ── */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-24 space-y-4">

              {/* Table of contents */}
              <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-5 shadow-[0_4px_16px_rgba(46,5,105,.06)]">
                <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">In this article</p>
                <ul className="mt-3 space-y-2">
                  {article.sections.map((s, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="block text-[12px] leading-snug text-[#716A78] transition hover:text-[#8C52FF]">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share buttons */}
              <ShareButtons title={article.title} />

              {/* Related articles */}
              <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-5 shadow-[0_4px_16px_rgba(46,5,105,.06)]">
                <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">Related Articles</p>
                <div className="mt-3 space-y-3">
                  {related.map((a) => (
                    <Link key={a.slug} href={`/knowledge/${a.slug}`} className="group flex gap-3 transition">
                      <div className="relative h-[52px] w-[72px] shrink-0 overflow-hidden rounded-[10px] bg-[#F4EEFF]">
                        <Image src={a.image} alt={a.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">{a.category}</span>
                        <p className="mt-0.5 line-clamp-2 text-[11.5px] font-extrabold leading-snug text-[#2E0569] transition group-hover:text-[#8C52FF]">
                          {a.title}
                        </p>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-[#8B8292]">
                          <Clock size={9} /> {a.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
