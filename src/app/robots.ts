import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/order-confirmation", "/orders"],
      },
    ],
    sitemap: "https://www.pradnyasanskar.com/sitemap.xml",
  };
}
