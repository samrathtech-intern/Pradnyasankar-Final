import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Info } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

const ARTICLES: Record<string, { title: string; category: string; readTime: string; image: string; author: string; publishedDate: string; intro: string; sections: { heading: string; body: string }[] }> = {
  "understanding-ashwagandha": {
    title: "Understanding Ashwagandha",
    category: "Ayurveda",
    readTime: "4 min",
    image: "/images/ashwagandha.webp",
    author: "Pradnyasanskar Editorial Team",
    publishedDate: "June 2025",
    intro: "Ashwagandha (Withania somnifera) is one of the most widely recognised botanicals in Ayurvedic tradition. This article provides general educational information about the ingredient — not medical advice or product-specific directions.",
    sections: [
      { heading: "What is Ashwagandha?", body: "Ashwagandha is a small shrub native to India and North Africa. Its root and berry have been used in Ayurvedic practice for centuries. The plant is classified as an adaptogen in traditional systems, meaning it is associated with supporting the body's response to everyday stress." },
      { heading: "Key constituents", body: "The root contains withanolides (steroidal lactones), alkaloids, saponins and sitoindosides. These constituents are the subject of ongoing nutritional and botanical research. Quantity and standardisation vary between product formats and manufacturers." },
      { heading: "How it is used", body: "Ashwagandha is available in multiple formats including root powder, standardised extracts in capsules, and as an ingredient in traditional formulations. The appropriate format, quantity and duration of use depend on the specific product — always refer to the product label and directions." },
      { heading: "What to look for on a label", body: "When reviewing an Ashwagandha product, look for: the part of the plant used (root vs. leaf), whether it is a raw powder or standardised extract, the quantity per serving, and any additional ingredients. Pradnyasanskar products include this information on the product page and label." },
    ],
  },
  "ayurveda-vs-nutraceuticals": {
    title: "Ayurveda vs Nutraceuticals — What's the difference?",
    category: "Education",
    readTime: "5 min",
    image: "/images/range-ayurveda.webp",
    author: "Pradnyasanskar Editorial Team",
    publishedDate: "June 2025",
    intro: "Customers often ask how Ayurvedic products differ from nutraceuticals. This article explains the key distinctions in classification, regulation and intended use — without making product-specific claims.",
    sections: [
      { heading: "Ayurvedic products", body: "Ayurvedic products in India are regulated under the Drugs and Cosmetics Act and require a valid manufacturing licence. They use ingredients listed in classical Ayurvedic texts and must follow approved formulation standards. Claims are governed by the licence category." },
      { heading: "Nutraceuticals", body: "Nutraceuticals are food-based products — vitamins, minerals, amino acids, botanicals and similar ingredients — that provide nutritional or physiological benefit. In India, they are regulated under the Food Safety and Standards Act (FSSAI). They are not medicines and cannot make disease-treatment claims." },
      { heading: "Why Pradnyasanskar distinguishes them", body: "We clearly label every product as Ayurvedic or nutraceutical so customers understand what they are purchasing, what regulatory framework applies, and what kind of information to expect on the label. The two ranges are never mixed or misrepresented." },
      { heading: "What this means for you", body: "When browsing our catalogue, look for the range label on each product card and product page. Ayurvedic products will reference applicable licences; nutraceuticals will reference FSSAI compliance. Both include full composition, directions and warnings." },
    ],
  },
  "reading-a-supplement-label": {
    title: "How to read a supplement label",
    category: "Nutraceuticals",
    readTime: "3 min",
    image: "/images/multivitamin.webp",
    author: "Pradnyasanskar Editorial Team",
    publishedDate: "July 2025",
    intro: "Product labels contain important information that helps you make informed decisions. This guide explains the key sections of a nutraceutical or Ayurvedic product label.",
    sections: [
      { heading: "Product name and classification", body: "The label will state whether the product is an Ayurvedic medicine, nutraceutical, food supplement or another category. This tells you which regulatory framework applies and what kind of claims are permitted." },
      { heading: "Composition / ingredients", body: "This section lists every ingredient with its quantity per serving. For Ayurvedic products, botanical names are often included alongside common names. For nutraceuticals, nutrients are listed with their quantity and percentage of recommended daily intake where applicable." },
      { heading: "Directions for use", body: "Follow the directions exactly as stated. Do not exceed the recommended intake unless advised by a qualified health professional. Directions include serving size, frequency, timing and how to take the product (with water, food, etc.)." },
      { heading: "Warnings and cautions", body: "This section includes allergy information, contraindications (e.g. pregnancy, medication interactions), age restrictions and storage conditions. Read this section carefully before use." },
      { heading: "Manufacturer and regulatory details", body: "The label must include the manufacturer's name, address, licence or registration number, batch number, manufacturing date and expiry date. These details allow you to verify the product's authenticity and regulatory status." },
    ],
  },
  "daily-wellness-routines": {
    title: "Building a daily wellness routine",
    category: "Wellness",
    readTime: "5 min",
    image: "/images/daily-wellness.webp",
    author: "Pradnyasanskar Editorial Team",
    publishedDate: "July 2025",
    intro: "A consistent wellness routine does not need to be complicated. This article offers general guidance on incorporating wellness products into everyday life — not personalised medical advice.",
    sections: [
      { heading: "Start with one habit", body: "Rather than overhauling your entire routine, begin with one consistent habit — a morning supplement with breakfast, an evening botanical format before sleep, or a daily greens powder with water. Consistency matters more than complexity." },
      { heading: "Match products to moments", body: "Think about when a product naturally fits into your day. Energy-focused formats work well in the morning; relaxation-oriented products suit the evening. Digestive formats often work best with or after meals." },
      { heading: "Read directions before you start", body: "Every product has specific directions for use. Follow them. Do not assume that more is better — the recommended quantity is based on the product's formulation and intended use." },
      { heading: "Give it time", body: "Nutritional and botanical products work over time, not overnight. Most wellness routines require consistent use over several weeks before any meaningful assessment can be made." },
      { heading: "When to consult a professional", body: "If you are pregnant, breastfeeding, on prescription medication or managing a health condition, consult a qualified healthcare professional before starting any new supplement or Ayurvedic product." },
    ],
  },
  "turmeric-curcumin-guide": {
    title: "Turmeric and curcumin — an ingredient guide",
    category: "Ayurveda",
    readTime: "4 min",
    image: "/images/turmeric.webp",
    author: "Pradnyasanskar Editorial Team",
    publishedDate: "August 2025",
    intro: "Turmeric (Curcuma longa) is one of the most studied botanicals in both traditional and modern wellness contexts. This article provides general educational information about the ingredient.",
    sections: [
      { heading: "What is turmeric?", body: "Turmeric is a rhizomatous plant in the ginger family, widely used in Indian cooking and Ayurvedic practice. The active constituents are curcuminoids, of which curcumin is the most studied." },
      { heading: "Curcumin and bioavailability", body: "Curcumin has low natural bioavailability, meaning the body absorbs relatively little from standard turmeric powder. Many modern formulations use piperine (from black pepper), phospholipid complexes or other delivery systems to improve absorption. Check the product label for the specific form used." },
      { heading: "Traditional vs modern formats", body: "In Ayurvedic tradition, turmeric is used in specific formulations with defined quantities and co-ingredients. Modern nutraceutical formats often use standardised curcumin extracts. Both approaches are valid — the key is understanding what format you are using and following the product's directions." },
      { heading: "What to look for", body: "On a product label, look for: whether it uses turmeric powder or a standardised curcumin extract, the percentage of curcuminoids, the quantity per serving, and any bioavailability-enhancing ingredients. Pradnyasanskar products include this information on the product page." },
    ],
  },
  "gut-health-basics": {
    title: "Gut health basics",
    category: "Nutraceuticals",
    readTime: "4 min",
    image: "/images/probiotic-gut-balance.webp",
    author: "Pradnyasanskar Editorial Team",
    publishedDate: "August 2025",
    intro: "Digestive wellness is a broad topic. This article covers the basics of gut health, probiotics and the role of nutrition — for general education, not medical advice.",
    sections: [
      { heading: "Why gut health matters", body: "The digestive system plays a central role in nutrient absorption, immune function and overall wellbeing. A balanced gut microbiome — the community of microorganisms in the digestive tract — is associated with better digestive comfort and general health." },
      { heading: "Probiotics and prebiotics", body: "Probiotics are live microorganisms that, when consumed in adequate amounts, may confer a health benefit. Prebiotics are dietary fibres that feed beneficial gut bacteria. Many digestive wellness products combine both. Check the product label for the specific strains, quantities and directions." },
      { heading: "Diet and lifestyle", body: "No supplement replaces a balanced diet. Fibre-rich foods, adequate hydration, regular physical activity and stress management all contribute to digestive health. Supplements and Ayurvedic formats are intended to complement — not replace — a healthy lifestyle." },
      { heading: "When to seek advice", body: "Persistent digestive symptoms — bloating, discomfort, irregular bowel habits — should be assessed by a qualified healthcare professional. Do not use nutritional products as a substitute for medical evaluation or treatment." },
    ],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = ARTICLES[params.slug];
  if (!article) return { title: "Article not found | Pradnyasanskar" };
  return {
    title: `${article.title} | Pradnyasanskar Knowledge Hub`,
    description: article.intro,
  };
}

export default function KnowledgeArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug];

  if (!article) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
          <h1 className="text-[32px] font-extrabold text-[#2E0569]">Article not found</h1>
          <p className="text-[14px] text-[#716A78]">This article may have been moved or is not yet published.</p>
          <Link href="/knowledge" className="btn-primary">Back to knowledge hub <ArrowRight size={15} /></Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        {/* Breadcrumb */}
        <div className="border-b border-[#E9E3EE] bg-white">
          <div className="container-page flex items-center gap-2 py-4 text-[11px] font-semibold text-[#8B8292]">
            <Link href="/" className="hover:text-[#2E0569] transition">Home</Link>
            <span>/</span>
            <Link href="/knowledge" className="hover:text-[#2E0569] transition">Knowledge</Link>
            <span>/</span>
            <span className="text-[#2E0569]">{article.title}</span>
          </div>
        </div>

        <div className="container-page py-10 lg:py-14">
          <Link href="/knowledge" className="mb-8 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] transition hover:text-[#2E0569]">
            <ArrowLeft size={14} /> Back to knowledge hub
          </Link>

          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <Reveal>
              <span className="eyebrow"><BookOpen size={13} /> {article.category}</span>
              <h1 className="mt-5 text-[clamp(28px,4vw,48px)] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569]">
                {article.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[#8B8292]">
                <span>{article.readTime} read</span>
                <span className="text-[#D8CEE1]">·</span>
                <span>By {article.author}</span>
                <span className="text-[#D8CEE1]">·</span>
                <span>Published {article.publishedDate}</span>
              </div>
            </Reveal>

            {/* Hero image */}
            <Reveal delay={0.06}>
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                <img src={article.image} alt={article.title} className="h-full w-full object-contain p-6" />
              </div>
            </Reveal>

            {/* Disclaimer */}
            <Reveal delay={0.08}>
              <div className="mt-8 flex items-start gap-3 rounded-[18px] border border-[#E9E3EE] bg-[#FAF7FF] p-5">
                <Info size={16} className="mt-0.5 shrink-0 text-[#8C52FF]" />
                <p className="text-[12px] leading-relaxed text-[#716A78]">
                  This article is for general educational purposes only. It does not constitute medical advice, diagnosis, prescription or personalised treatment recommendations. Consult a qualified healthcare professional before making any health decisions.
                </p>
              </div>
            </Reveal>

            {/* Intro */}
            <Reveal delay={0.1}>
              <p className="mt-8 text-[16px] leading-[1.9] text-[#2E0569] font-semibold">{article.intro}</p>
            </Reveal>

            {/* Sections */}
            <div className="mt-8 space-y-8">
              {article.sections.map((section, i) => (
                <Reveal key={section.heading} delay={i * 0.05}>
                  <div>
                    <h2 className="text-[20px] font-extrabold tracking-[-.03em] text-[#2E0569]">{section.heading}</h2>
                    <p className="mt-3 text-[15px] leading-[1.9] text-[#716A78]">{section.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Footer disclaimer */}
            <Reveal>
              <div className="mt-12 rounded-[18px] border border-[#E9E3EE] bg-[#FAF7FF] p-5">
                <p className="text-[11px] leading-relaxed text-[#8B8292]">
                  Content on the Pradnyasanskar Knowledge Hub is approved for general education only. It does not replace the directions, warnings or declarations on individual product labels. Pradnyasanskar does not provide diagnosis, prescription or personalised medical advice.
                </p>
              </div>
            </Reveal>

            {/* Navigation */}
            <Reveal>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/knowledge" className="btn-secondary"><ArrowLeft size={15} /> All articles</Link>
                <Link href="/shop" className="btn-primary">Explore products <ArrowRight size={15} /></Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
