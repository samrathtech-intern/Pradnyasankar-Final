"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

const RELATED = [
  {
    slug: "understanding-ayurvedic-product-formats",
    category: "Nutraceutical Education",
    title: "Understanding Common Ayurvedic Product Formats",
    description: "Learn the differences between capsules, powders, syrups, oils, and tablets.",
    readTime: "5 min read",
    image: "/images/knowledge-nutraceutical-education.png",
  },
  {
    slug: "why-directions-and-warnings-matter",
    category: "Responsible Use",
    title: "Why Directions and Warnings Matter",
    description: "Learn how to read supplement labels safely and correctly.",
    readTime: "4 min read",
    image: "/images/knowledge-responsible-use.png",
  },
  {
    slug: "building-a-routine-without-overcomplicating-it",
    category: "Wellness Lifestyle",
    title: "Building a Wellness Routine That Lasts",
    description: "Create healthy daily habits for long-term wellness.",
    readTime: "6 min read",
    image: "/images/knowledge-wellness-lifestyle.png",
  },
];

export function RelatedArticlesSidebar() {
  return (
    <aside className="hidden lg:block w-[300px] shrink-0">
      <div className="sticky top-24 space-y-4">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">
          Related Articles
        </h2>

        {RELATED.map((article) => (
          <Link
            key={article.slug}
            href={`/knowledge/${article.slug}`}
            className="group flex gap-3 rounded-[20px] border border-[#E9E3EE] bg-white p-3 shadow-[0_4px_16px_rgba(46,5,105,.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(46,5,105,.13)]"
          >
            {/* Thumbnail */}
            <div className="relative h-[70px] w-[100px] shrink-0 overflow-hidden rounded-[12px] bg-[#F4EEFF]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <div>
                <span className="inline-block rounded-full bg-[#F2EBFF] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#6F4AF8]">
                  {article.category}
                </span>
                <h3 className="mt-1 line-clamp-2 text-[12px] font-extrabold leading-tight tracking-[-0.02em] text-[#2E0569] transition group-hover:text-[#6F4AF8]">
                  {article.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#716A78]">
                  {article.description}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-[#8B8292]">
                  <Clock size={10} />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-[#6F4AF8] transition-transform group-hover:translate-x-0.5">
                  Read More <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
