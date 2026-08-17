import type { MetadataRoute } from "next";
import { products } from "@/data";

const BASE = "https://www.pradnyasanskar.com";

const STATIC_ROUTES = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/shop", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/shop/ayurveda", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/shop/nutraceuticals", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/knowledge", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/quality", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/b2b", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/policies", priority: 0.5, changeFrequency: "monthly" as const },
];

const KNOWLEDGE_SLUGS = [
  "understanding-ayurvedic-product-formats",
  "ayurveda-vs-nutraceuticals",
  "how-to-read-a-composition-panel",
  "gut-health-basics",
  "why-directions-and-warnings-matter",
  "understanding-ashwagandha",
  "building-a-routine-without-overcomplicating-it",
  "reading-a-supplement-label",
  "daily-wellness-routines",
  "turmeric-curcumin-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const productEntries = products.map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const knowledgeEntries = KNOWLEDGE_SLUGS.map((slug) => ({
    url: `${BASE}/knowledge/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...productEntries, ...knowledgeEntries];
}
