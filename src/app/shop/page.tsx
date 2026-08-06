import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ShopCatalogue } from "@/components/ShopCatalogue";

export const metadata: Metadata = {
  title: "Shop All Products | Pradnyasanskar",
  description: "Explore the complete Pradnyasanskar collection — Ayurveda, nutraceuticals and external wellness products with clear composition and responsible information.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { goal?: string; format?: string };
}) {
  return (
    <PageLayout>
      <ShopCatalogue range="all" initialGoal={searchParams.goal} initialFormat={searchParams.format} />
    </PageLayout>
  );
}
