import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ShopCatalogue } from "@/components/ShopCatalogue";

export const metadata: Metadata = {
  title: "Shop All Products | Pradnyasanskar",
  description: "Explore the complete Pradnyasanskar collection — Ayurveda, nutraceuticals and external wellness products with clear composition and responsible information.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string; format?: string }>;
}) {
  const { goal, format } = await searchParams;
  return (
    <PageLayout>
      <ShopCatalogue range="all" initialGoal={goal} initialFormat={format} />
    </PageLayout>
  );
}
