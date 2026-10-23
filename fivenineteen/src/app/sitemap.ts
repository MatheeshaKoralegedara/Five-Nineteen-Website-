import type { MetadataRoute } from "next";
import { getPublishedGalleries } from "@/db/queries";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const galleries = await getPublishedGalleries();

  const pages = ["", "/portfolio", "/packages", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const galleryPages = galleries.map((g) => ({
    url: `${site.url}/portfolio/${g.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...galleryPages];
}