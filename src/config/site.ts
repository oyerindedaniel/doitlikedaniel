/**
 * Central site configuration
 */

export const siteConfig = {
  name: "Daniel's Personal Site",
  title: {
    template: "%s | Daniel's Personal Site",
    default: "Daniel's Personal Site",
  },
  description: "Personal website and blog by Daniel",
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  author: {
    name: "Daniel Oyerinde",
    email: "oyerinde.daniel@yahoo.com",
    twitter: "@fybnow",
  },
  keywords: ["Daniel", "Oyerinde", "Personal", "Website", "Blog"],
  themeColor: {
    light: "#ffffff",
    dark: "#0a0a0a",
  },
  social: {
    twitter: "https://twitter.com/fybnow",
    github: "https://github.com/oyerindedaniel",
    // linkedin: "https://linkedin.com/in/danieloyerinde",
  },
};

/**
 * Get base URL with trailing slash removed
 */
export function getBaseUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

/**
 * Get full URL for a path
 */
export function getUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Get full URL for an image
 */
export function getImageUrl(path: string): string {
  return getUrl(`/images/${path.replace(/^\//, "")}`);
}

/**
 * Get blog post URL
 */
export function getBlogUrl(slug: string): string {
  return getUrl(`/blog/${slug}`);
}

export const sitePages = [
  {
    path: "/",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1.0,
  },
  {
    path: "/blog",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
];
