import type { Metadata } from "next";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";

import "./globals.css";

import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title:
    "Pradnyasanskar | Thoughtful Ayurveda & Nutraceutical Wellness",
  description:
    "Explore Pradnyasanskar Ayurveda, nutraceutical and external-wellness collections through clear product information and thoughtful everyday routines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}