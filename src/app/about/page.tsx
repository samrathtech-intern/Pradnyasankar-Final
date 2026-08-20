import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Brain, Leaf, ShieldCheck } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Pradnyasanskar | Thoughtful Ayurveda & Nutraceutical Wellness",
  description: "Learn about Pradnyasanskar — our philosophy, approach to quality, and commitment to transparent, responsible wellness products.",
};

const PRINCIPLES = [
  { icon: Brain, title: "Understand before you choose", copy: "Every product page leads with composition, format, directions and cautions — not just marketing claims. We believe informed customers make better wellness decisions." },
  { icon: Leaf, title: "Rooted in tradition, clear in communication", copy: "Ayurvedic wisdom and modern nutritional science presented through honest, approved language. No exaggerated claims, no diagnostic recommendations." },
  { icon: ShieldCheck, title: "Quality you can verify", copy: "Licences, certifications and manufacturer details are published alongside every product. Transparency is not optional — it is the foundation of trust." },
];

const TIMELINE = [
  { year: "Foundation", title: "A wellness brand built on clarity", copy: "Pradnyasanskar Enterprises Pvt. Ltd. was established with a single purpose — to make Ayurvedic and nutraceutical wellness accessible, understandable and trustworthy for everyday Indian households." },
  { year: "Philosophy", title: "Education before promotion", copy: "From the beginning, our approach has been to educate customers about ingredients, formats and responsible use before encouraging a purchase. The site should feel educational before it feels promotional." },
  { year: "Products", title: "Ayurveda and nutraceuticals under one identity", copy: "We bring traditional Ayurvedic formats and modern nutraceutical products together under one brand — clearly distinguished, consistently presented and responsibly communicated." },
  { year: "Today", title: "Growing with integrity", copy: "As we expand our catalogue and reach, our commitment to approved content, transparent composition and responsible product information remains unchanged." },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        {/* Hero */}
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-16 sm:py-24">
          <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="eyebrow"><Leaf size={13} /> Our story</span>
              <h1 className="section-heading mt-5">
                Wellness rooted in wisdom. Built on clarity.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.9] text-[#716A78]">
                Pradnyasanskar Enterprises Pvt. Ltd. is a modern Indian wellness brand bringing Ayurveda, nutraceuticals and external-wellness formats together through transparent product information, responsible communication and a genuine commitment to customer understanding.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/shop" className="btn-primary">Explore products <ArrowRight size={15} /></a>
                <a href="/quality" className="btn-secondary">Our quality approach</a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[32px]">
                <Image src="/images/brand-story-1.webp" alt="Pradnyasanskar brand story" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E0569]/20 to-transparent" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Principles */}
        <section className="container-page py-16 sm:py-20">
          <Reveal>
            <span className="eyebrow">What we stand for</span>
            <h2 className="section-heading mt-5 max-w-2xl">Three principles that guide everything we do.</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className="flex h-full flex-col rounded-[24px] border border-[#E9E3EE] bg-white p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-[18px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569]">{title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#716A78]">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Brand story images */}
        <section className="container-page pb-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {["/images/brand-story-2.webp", "/images/brand-story-3.webp", "/images/brand-story-4.webp"].map((src, i) => (
              <Reveal key={src} delay={i * 0.06}>
                <div className="relative aspect-square overflow-hidden rounded-[24px]">
                  <Image src={src} alt="Pradnyasanskar wellness" fill className="object-cover transition duration-500 hover:scale-[1.03]" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-gradient-to-br from-[#F4EEFF] to-[#FFFDF7] py-16 sm:py-20">
          <div className="container-page">
            <Reveal>
              <span className="eyebrow">Our journey</span>
              <h2 className="section-heading mt-5 max-w-2xl">How Pradnyasanskar came to be.</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {TIMELINE.map(({ year, title, copy }, i) => (
                <Reveal key={year} delay={i * 0.07}>
                  <div className="rounded-[24px] border border-[#E9E3EE] bg-white p-7">
                    <span className="inline-block rounded-full bg-[#F2EBFF] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">{year}</span>
                    <h3 className="mt-4 text-[18px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569]">{title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-[#716A78]">{copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-page py-16 sm:py-20">
          <Reveal>
            <div className="rounded-[32px] bg-gradient-to-br from-[#2E0569] to-[#511889] px-8 py-14 text-center text-white sm:px-16">
              <span className="eyebrow border-white/20 bg-white/10 text-white/80">Join the community</span>
              <h2 className="mt-5 text-[clamp(32px,4vw,52px)] font-extrabold leading-tight tracking-[-.04em]">
                Wellness that begins with understanding.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
                Explore our Ayurvedic and nutraceutical ranges, read about ingredients and find products that fit your everyday routine.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/shop" className="btn-primary bg-[#FFBB58] text-[#2E0569] shadow-none hover:bg-white">
                  Shop all products <ArrowRight size={15} />
                </a>
                <a href="/knowledge" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Knowledge hub
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </PageLayout>
  );
}
