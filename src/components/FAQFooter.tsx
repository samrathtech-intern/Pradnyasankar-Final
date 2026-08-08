"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import { faqs as fallbackFaqs } from "@/data";
import { fetchFAQs } from "@/lib/faqApi";
import { Reveal } from "./Reveal";

type FaqEntry = { question: string; answer: string };

export function FAQ() {
  const [open, setOpen] = useState(0);
  const [faqs, setFaqs] = useState<FaqEntry[]>(
    fallbackFaqs.map(([question, answer]) => ({ question, answer })),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetchFAQs()
      .then((items) => {
        if (!active) return;
        const mapped: FaqEntry[] = items
          .filter((item) => item.question && item.answer)
          .map((item) => ({ question: item.question, answer: item.answer }));
        if (mapped.length > 0) setFaqs(mapped);
      })
      .catch(() => {
        // Keep the static fallback FAQs when the backend is unreachable.
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="faq" className="bg-[#FAF7FF] py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow">Frequently asked questions</span>
              <h2 className="section-heading mt-5">Questions? Let’s make wellness clearer.</h2>
              <p className="mt-5 max-w-md text-[14px] leading-[1.8] text-[#716A78]">Find quick answers about product ranges, information, shopping and support.</p>
              <a href="#newsletter" className="btn-primary mt-7">Join the community</a>
            </div>
          </Reveal>
          <div className="space-y-3">
            {faqs.map(({ question, answer }, index) => (
              <Reveal key={question} delay={index * .04}>
                <article className="overflow-hidden rounded-[24px] border border-[#E9E3EE] bg-white">
                  <button onClick={() => setOpen(open === index ? -1 : index)} className="flex min-h-20 w-full items-center justify-between gap-6 px-6 text-left" aria-expanded={open === index}>
                    <span className="text-[15px] font-extrabold text-[#2E0569]">{question}</span>
                    <ChevronDown size={19} className={`shrink-0 text-[#8C52FF] transition ${open === index ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="border-t border-[#F0EAF4] px-6 py-5 text-[13px] leading-[1.8] text-[#716A78]">{answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const columns = [
  {
    title: "Shop",
    links: [
      ["All products", "/shop"],
      ["Ayurveda", "/shop/ayurveda"],
      ["Nutraceuticals", "/shop/nutraceuticals"],
      ["External wellness", "/shop?range=External+Wellness"],
      ["Wellness sets", "/shop?range=Wellness+Sets"],
    ],
  },
  {
    title: "Discover",
    links: [
      ["Wellness goals", "/#wellness-focus"],
      ["Ingredients", "/#ingredients"],
      ["Knowledge hub", "/knowledge"],
      ["Our story", "/about"],
      ["Quality approach", "/quality"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Pradnyasanskar", "/about"],
      ["Business enquiry", "/b2b"],
      ["Private label", "/b2b"],
      ["Contact us", "/contact"],
      ["Pradnyasanskar community", "/#newsletter"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Shipping policy", "/policies/shipping"],
      ["Returns & refunds", "/policies/returns"],
      ["Privacy policy", "/policies/privacy"],
      ["Terms of use", "/policies/terms"],
      ["Contact support", "/contact"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-[#210044] pb-24 text-white lg:pb-0">
      <div className="container-page py-16">
        <div className="grid gap-12 xl:grid-cols-[1.25fr_2fr]">
          <div>
            <div className="relative h-16 w-[280px] overflow-hidden rounded-xl bg-white p-2"><Image src="/logo.png" alt="Pradnyasanskar Enterprises Pvt. Ltd." fill className="object-contain" /></div>
            <p className="mt-6 max-w-md text-[13px] leading-[1.8] text-white/[.65]">Thoughtful Ayurveda, nutraceutical and external wellness presented through knowledge, clarity and responsible information.</p>
            <div className="mt-6 space-y-3 text-[11px] text-white/[.65]">
              <p className="flex items-center gap-3"><Phone size={15} className="text-[#FFBB58]" />Use the Business Enquiry form for partnerships and general support.</p>
              <p className="flex items-center gap-3"><MapPin size={15} className="text-[#FFBB58]" />India-focused wellness brand</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#FFBB58]">{column.title}</h3>
                <div className="mt-5 space-y-3">
                  {column.links.map(([label, href]) => <a key={label} href={href} className="block text-[11.5px] font-semibold text-white/[.65] transition hover:translate-x-1 hover:text-white">{label}</a>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="footer-notice" className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] text-white/[.45] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Pradnyasanskar Enterprises Pvt. Ltd. All rights reserved.</p>
          <p>Product information is provided for general education and discovery. Refer to individual product labels for directions and cautions.</p>
        </div>
      </div>
    </footer>
  );
}
