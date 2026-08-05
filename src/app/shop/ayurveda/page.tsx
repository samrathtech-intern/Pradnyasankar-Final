import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ShopCatalogue } from "@/components/ShopCatalogue";

export const metadata: Metadata = {
  title: "Ayurveda Products | Pradnyasanskar",
  description: "Explore Pradnyasanskar Ayurvedic products — traditional botanical formats with clear composition, directions and responsible product information.",
};

export default function ShopAyurvedaPage() {
  return (
    <PageLayout>
      <ShopCatalogue range="Ayurveda" />
    </PageLayout>
  );
}
