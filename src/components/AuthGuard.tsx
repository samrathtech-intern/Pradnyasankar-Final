"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    token,
    authHydrated,
  } = useAuth();

  useEffect(() => {
    if (!authHydrated) return;

    if (!user || !token) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(
          pathname || "/profile"
        )}`
      );
    }
  }, [
    authHydrated,
    user,
    token,
    pathname,
    router,
  ]);

  if (!authHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF7]">
        <p className="text-sm text-[#716A78]">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return <>{children}</>;
}