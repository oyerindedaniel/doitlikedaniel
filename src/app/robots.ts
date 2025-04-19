import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/private/", "/draft/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
