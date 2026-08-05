import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ShopCatalogue } from "@/components/ShopCatalogue";

export const metadata: Metadata = {
  title: "Nutraceuticals | Pradnyasanskar",
  description: "Discover Pradnyasanskar nutraceutical products — vitamins, minerals and modern nutritional formats with responsible product information.",
};

export default function ShopNutraceuticalsPage() {
  return (
    <PageLayout>
      <ShopCatalogue range="Nutraceuticals" />
    </PageLayout>
  );
}
