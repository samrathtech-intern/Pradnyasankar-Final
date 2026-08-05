"use client";

import { AppProvider } from "@/components/AppContext";
import { AnnouncementBar, Header } from "@/components/Header";
import { FAQ, Footer } from "@/components/FAQFooter";
import { BagDrawer, QuickViewModal, SavedDrawer, SearchOverlay } from "@/components/Overlays";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function PageLayout({
  children,
  showFaq = false,
}: {
  children: React.ReactNode;
  showFaq?: boolean;
}) {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[#2E0569] focus:px-5 focus:py-3 focus:text-[12px] focus:font-extrabold focus:uppercase focus:tracking-[.1em] focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main-content">{children}</main>
        {showFaq && <FAQ />}
        <Footer />
        <SearchOverlay />
        <BagDrawer />
        <SavedDrawer />
        <QuickViewModal />
        <MobileBottomNav />
      </div>
    </AppProvider>
  );
}
