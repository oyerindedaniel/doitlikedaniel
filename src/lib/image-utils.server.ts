"server-only";

import path from "path";
import fs from "fs";
import { getPlaiceholder } from "plaiceholder";
import logger from "@/utils/logger";
import { isRemoteImage, normalizeImagePath } from "./image-utils";
import { IS_PRODUCTION } from "@/config/app";
import { removeExtension } from "./image-utils";

export const IMAGES_DIR = path.join(process.cwd(), "public/images");
export const PLACEHOLDER_DIR = path.join(process.cwd(), "public/placeholders");

export function getImagePath(src: string): string {
  if (isRemoteImage(src)) {
    return src;
  }

  const cleanSrc = src.split("?")[0];

  const relativePath = normalizeImagePath(cleanSrc);

  return path.join(IMAGES_DIR, relativePath);
}

export function getPlaceholderPath(src: string): string {
  if (isRemoteImage(src)) {
    throw new Error(`Cannot get placeholder for remote image: ${src}`);
  }

  const cleanSrc = src.split("?")[0];

  const relativePath = normalizeImagePath(cleanSrc);

  const placeholderPath = path.join(PLACEHOLDER_DIR, relativePath);

  if (IS_PRODUCTION && !fs.existsSync(placeholderPath)) {
    throw new Error(`Placeholder not found for image: ${src}`);
  }

  return `/placeholders/${removeExtension(relativePath)}.txt`;
}

export async function generatePlaceholder(imagePath: string): Promise<string> {
  try {
    if (isRemoteImage(imagePath)) {
      throw new Error(
        `Cannot generate placeholder for remote image: ${imagePath}`
      );
    }

    const isAbsolutePath =
      /^[A-Z]:\\/.test(imagePath) || imagePath.startsWith("/");

    let fullPath;
    if (isAbsolutePath) {
      fullPath = imagePath;
    } else {
      fullPath = path.join(process.cwd(), "public", imagePath);
    }

    const buffer = fs.readFileSync(fullPath);
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    logger.error(`Error generating placeholder for ${imagePath}:`, error);
    throw error;
  }
}

export function hasPlaceholder(imagePath: string): boolean {
  try {
    if (isRemoteImage(imagePath)) {
      return false;
    }

    const placeholderPath = getPlaceholderPath(imagePath);
    const fullPlaceholderPath = path.join(
      process.cwd(),
      "public",
      placeholderPath
    );
    return fs.existsSync(fullPlaceholderPath);
  } catch {
    return false;
  }
}

export async function savePlaceholder(
  imagePath: string,
  base64: string
): Promise<string> {
  if (isRemoteImage(imagePath)) {
    throw new Error(`Cannot save placeholder for remote image: ${imagePath}`);
  }

  const relativePath = `${removeExtension(normalizeImagePath(imagePath))}.txt`;

  const placeholderPath = path.join(PLACEHOLDER_DIR, relativePath);

  const placeholderDir = path.dirname(placeholderPath);
  if (!fs.existsSync(placeholderDir)) {
    fs.mkdirSync(placeholderDir, { recursive: true });
  }

  fs.writeFileSync(placeholderPath, base64);

  return `/placeholders/${relativePath}`;
}
