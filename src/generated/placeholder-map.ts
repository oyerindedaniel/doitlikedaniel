import placeholdersJson from "./placeholders.json";

export type PlaceholderMap = {
  [key: string]: string;
};

const placeholders: PlaceholderMap = placeholdersJson as PlaceholderMap;

/**
 * Gets a blur data URL for the specified image path
 * @param src - The image path (e.g., /images/hero.jpg)
 * @returns The base64 data URL for the blur placeholder, or undefined if not found
 */
export function getBlurDataURL(src: string): string | undefined {
  if (!src) return undefined;

  const normalizedSrc = src.split("?")[0];

  if (normalizedSrc in placeholders) {
    return placeholders[normalizedSrc];
  }

  const withSlash = `/${normalizedSrc}`;
  if (!normalizedSrc.startsWith("/") && withSlash in placeholders) {
    return placeholders[withSlash];
  }

  return undefined;
}

export default placeholders;
