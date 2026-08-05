"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtm, loadGTM, trackPageView } from "@/lib/analytics";

/**
 * GTMProvider
 * - Mount once in the root layout (inside <body>)
 * - Loads GTM script consent-awarely on first render
 * - Captures UTM params from URL into sessionStorage
 * - Fires page_view on every route change
 */
export function GTMProvider() {
  const pathname = usePathname();

  // Load GTM and capture UTM on first mount
  useEffect(() => {
    captureUtm();
    loadGTM();
  }, []);

  // Fire page_view on every route change
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
