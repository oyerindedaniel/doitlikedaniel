import path from "path";
import fs from "fs";
import { glob } from "glob";
import {
  IMAGES_DIR,
  PLACEHOLDER_DIR,
  generatePlaceholder,
} from "../src/lib/image-utils.server";
import logger from "@/utils/logger";
import {
  joinGlobPath,
  normalizeImagePath,
  normalizePath,
} from "../src/lib/image-utils";
import { IS_PRODUCTION, ENFORCE_PLACEHOLDERS } from "@/config/app";

async function generatePlaceholders() {
  logger.log("Starting placeholder generation...");

  if (!fs.existsSync(PLACEHOLDER_DIR)) {
    fs.mkdirSync(PLACEHOLDER_DIR, { recursive: true });
  }

  const imagePattern = joinGlobPath(
    IMAGES_DIR,
    "**",
    "*.{jpg,jpeg,png,webp,avif}"
  );
  const imageFiles = glob.sync(imagePattern, { nodir: true });

  logger.log(`Found ${imageFiles.length} image files to process`);

  let missingPlaceholders = 0;
  const errors: string[] = [];

  for (const imagePath of imageFiles) {
    try {
      const publicDir = path.join(process.cwd(), "public");
      let relativePath = imagePath;

      if (imagePath.startsWith(publicDir)) {
        relativePath = imagePath.substring(publicDir.length);
      }

      const normalizedPath = normalizeImagePath(normalizePath(relativePath));

      logger.debug("Placeholder generation", {
        imagePath,
        relativePath,
        normalizedPath,
      });

      const placeholderPath = path.join(PLACEHOLDER_DIR, normalizedPath);

      if (fs.existsSync(placeholderPath)) {
        logger.log(`✓ Placeholder exists for ${relativePath}`);
        continue;
      }

      logger.log(`Generating placeholder for ${relativePath}...`);

      const base64 = await generatePlaceholder(imagePath);

      const placeholderDir = path.dirname(placeholderPath);
      if (!fs.existsSync(placeholderDir)) {
        fs.mkdirSync(placeholderDir, { recursive: true });
      }

      fs.writeFileSync(placeholderPath, base64);
      logger.log(`✓ Created placeholder for ${relativePath}`);
    } catch (error) {
      missingPlaceholders++;
      const errorMessage = `Failed to generate placeholder for ${imagePath}: ${error instanceof Error ? error.message : "Unknown error"}`;
      errors.push(errorMessage);
      logger.error(`✗ ${errorMessage}`);
    }
  }

  logger.log("\nPlaceholder Generation Summary:");
  logger.log(`Total images: ${imageFiles.length}`);
  logger.log(`Missing placeholders: ${missingPlaceholders}`);

  if (missingPlaceholders > 0) {
    logger.error("\nErrors:");
    errors.forEach((error) => logger.error(`- ${error}`));

    if (IS_PRODUCTION && ENFORCE_PLACEHOLDERS) {
      logger.error(
        "\n❌ Build failed: Missing placeholders in production mode with enforcement enabled."
      );
      process.exit(1);
    } else {
      logger.warn("\n⚠️ Warning: Some placeholders could not be generated.");
    }
  } else {
    logger.log("\n✅ All placeholders generated successfully!");
  }
}

generatePlaceholders()
  .then(() => {
    logger.log("Placeholder generation complete!");
  })
  .catch((error) => {
    logger.error("Placeholder generation failed:", error);
    if (IS_PRODUCTION && ENFORCE_PLACEHOLDERS) {
      process.exit(1);
    }
  });
