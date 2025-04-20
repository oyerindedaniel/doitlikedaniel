"server-only";

import path from "path";
import fs from "fs";
import { getPlaiceholder } from "plaiceholder";
import logger from "@/utils/logger";
import { isRemoteImage } from "./image-utils";

export const IMAGES_DIR = path.join(process.cwd(), "public/images");

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
