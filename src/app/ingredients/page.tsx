import { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { IngredientsPageContent } from "@/components/IngredientsPage";

export const metadata: Metadata = {
  title: "Ingredients Library | Pradnyasanskar",
  description:
    "Explore the herbs, botanicals, extracts and nutrients we use in our products. Clear, honest and backed by Ayurvedic wisdom and modern science.",
};

export default function IngredientsPage() {
  return (
    <PageLayout>
      <IngredientsPageContent />
    </PageLayout>
  );
}
