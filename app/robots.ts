import type { MetadataRoute } from "next";
import { storeConfig } from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/checkout", "/order-confirmation", "/samples/"] }],
    sitemap: `${storeConfig.siteUrl}/sitemap.xml`,
  };
}
