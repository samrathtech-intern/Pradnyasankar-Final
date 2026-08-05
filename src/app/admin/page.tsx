"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/adminApi";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (getAdminToken()) {
      router.replace("/admin/analytics");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return null;
}
