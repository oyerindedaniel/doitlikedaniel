import type { MetadataRoute } from "next";
import { sitePages, getUrl, getImageUrl, getBlogUrl } from "@/config/site";
import { getAllPosts } from "@/lib/mdx/mdx-utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = sitePages.map((page) => ({
    url: getUrl(page.path),
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogPosts = getAllPosts();

  const blogEntries = blogPosts.map((post) => ({
    url: getBlogUrl(post.slug),
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: post.coverImage
      ? [
          {
            url: getImageUrl(post.coverImage.replace(/^\/images\//, "")),
            title: post.title,
            caption: post.excerpt || post.title,
          },
        ]
      : [],
  }));

  return [...staticPages, ...blogEntries];
}
