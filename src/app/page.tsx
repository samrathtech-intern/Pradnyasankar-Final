"use client";


import {
  AnnouncementBar,
  Header,
} from "@/components/Header";


import {
  Hero,
  TrustMarquee,
} from "@/components/Hero";


import { WellnessFocus } from "@/components/WellnessFocus";


import { ProductShowcase } from "@/components/ProductShowcase";


import {
  RoutineCards,
  RoutineFinder,
} from "@/components/Routines";


import {
  ProductFormats,
  TransparencySection,
  WellnessSets,
} from "@/components/ProductFormatsAndKits";


import {
  BrandStory,
  QualityStrip,
  RangeSplit,
} from "@/components/RangeAndStory";


import { CampaignGallery } from "@/components/CampaignGallery";


import {
  BusinessCTA,
  CommunitySection,
  IngredientsSection,
  KnowledgeSection,
  Newsletter,
} from "@/components/EditorialSections";


import {
  FAQ,
  Footer,
} from "@/components/FAQFooter";


import {
  BagDrawer,
  QuickViewModal,
  SavedDrawer,
  SearchOverlay,
} from "@/components/Overlays";


import { MobileBottomNav } from "@/components/MobileBottomNav";


export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[#2E0569] focus:px-5 focus:py-3 focus:text-[12px] focus:font-extrabold focus:uppercase focus:tracking-[.1em] focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>


      <AnnouncementBar />
      <Header />


      <main id="main-content">
        <Hero />
        <TrustMarquee />
        <WellnessFocus />
        <ProductShowcase />
        <ProductFormats />
        <RoutineCards />
        <RangeSplit />
        <CampaignGallery />
        <WellnessSets />
        <RoutineFinder />
        <BrandStory />
        <QualityStrip />
        <TransparencySection />
        <IngredientsSection />
        <KnowledgeSection />
        <CommunitySection />
        <BusinessCTA />
        <FAQ />
        <Newsletter />
      </main>


      <Footer />


      <SearchOverlay />
      <BagDrawer />
      <SavedDrawer />
      <QuickViewModal />
      <MobileBottomNav />
    </div>
  );
}




