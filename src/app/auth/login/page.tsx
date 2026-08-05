import { Suspense } from "react";
import { AppProvider } from "@/components/AppContext";
import { AuthProvider } from "@/components/AuthContext";
import { AnnouncementBar, Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
          <AnnouncementBar />
          <Header />
          <main>
            <Suspense fallback={
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E9E3EE] border-t-[#8C52FF]" />
              </div>
            }>
              <LoginForm />
            </Suspense>
          </main>
          <MobileBottomNav />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
