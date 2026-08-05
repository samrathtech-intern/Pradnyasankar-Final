import type { Metadata } from "next";
import { products } from "@/data";

const BASE = "https://www.pradnyasanskar.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) return { title: "Product not found | Pradnyasanskar" };

  const title = `${product.name} | Pradnyasanskar`;
  const description = `${product.descriptor} Explore composition, directions, warnings and pack details for ${product.name} by Pradnyasanskar.`;
  const url = `${BASE}/products/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: `${BASE}${product.image}`, alt: product.name }],
      type: "website",
    },
  };
}

export default function ProductSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
