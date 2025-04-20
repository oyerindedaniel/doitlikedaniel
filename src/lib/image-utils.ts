import path from "path";

export function isRemoteImage(src: string): boolean {
  return src.startsWith("http") || src.startsWith("data:");
}

/**
 * Normalize a path by replacing backslashes with forward slashes
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

/**
 * Joins path segments and normalizes for glob usage (POSIX-style slashes).
 * @param segments - Path segments to join.
 * @returns Glob-compatible normalized path.
 */
export function joinGlobPath(...segments: string[]): string {
  return normalizePath(path.join(...segments));
}

/**
 * Normalizes an image path by removing the "/images/" prefix and leading slash.
 * @param src - The image path to normalize.
 * @returns The normalized image path.
 */
export function normalizeImagePath(src: string): string {
  if (src.startsWith("/images/")) {
    return src.slice(8); // Remove "/images/"
  }

  if (src.startsWith("/")) {
    return src.slice(1); // Remove leading slash
  }

  return src;
}

export function getPlaceholderPath(src: string): string {
  if (isRemoteImage(src)) {
    throw new Error(`Cannot get placeholder for remote image: ${src}`);
  }

  const cleanSrc = src.split("?")[0];
  const relativePath = normalizeImagePath(cleanSrc);

  return `/placeholders/${relativePath}`;
}
