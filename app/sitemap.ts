import type { MetadataRoute } from "next";
import { storeConfig } from "@/config/store";
import { availableProducts } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = storeConfig.siteUrl;
  const pages = ["", "/products", "/how-it-works", "/business-card", "/faq", "/resellers", "/contact"].map((p) => ({ url: `${base}${p}` }));
  return [...pages, ...availableProducts().map((p) => ({ url: `${base}/products/${p.slug}` }))];
}

