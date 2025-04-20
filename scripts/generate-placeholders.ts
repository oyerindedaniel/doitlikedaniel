import path from "path";
import fs from "fs";
import { glob } from "glob";
import { IMAGES_DIR, generatePlaceholder } from "../src/lib/image-utils.server";
import logger from "@/utils/logger";
import { joinGlobPath, normalizePath } from "../src/lib/image-utils";
import { IS_PRODUCTION, ENFORCE_PLACEHOLDERS } from "@/config/app";
import type { PlaceholderMap } from "@/generated/placeholder-map";

async function generatePlaceholders() {
  logger.log("Starting placeholder generation...");

  const imagePattern = joinGlobPath(
    IMAGES_DIR,
    "**",
    "*.{jpg,jpeg,png,webp,avif}"
  );
  const imageFiles = glob.sync(imagePattern, { nodir: true });

  logger.log(`Found ${imageFiles.length} image files to process`);

  let missingPlaceholders = 0;
  const errors: string[] = [];

  const placeholderMap: PlaceholderMap = {};

  for (const imagePath of imageFiles) {
    try {
      const publicDir = path.join(process.cwd(), "public");
      let relativePath = imagePath;

      if (imagePath.startsWith(publicDir)) {
        relativePath = imagePath.substring(publicDir.length);
      }

      const normalizedPath = normalizePath(relativePath);

      logger.debug("Placeholder generation", {
        imagePath,
        relativePath,
        normalizedPath,
      });

      logger.log(`Generating placeholder for ${normalizedPath}...`);

      const dataUrl = await generatePlaceholder(imagePath);

      placeholderMap[normalizedPath] = dataUrl;

      logger.log(`✓ Created placeholder for ${normalizedPath}`);
    } catch (error) {
      missingPlaceholders++;
      const errorMessage = `Failed to generate placeholder for ${imagePath}: ${error instanceof Error ? error.message : "Unknown error"}`;
      errors.push(errorMessage);
      logger.error(`✗ ${errorMessage}`);
    }
  }

  const placeholderMapPath = path.join(
    process.cwd(),
    "src/generated/placeholders.json"
  );

  const placeholderMapDir = path.dirname(placeholderMapPath);
  if (!fs.existsSync(placeholderMapDir)) {
    fs.mkdirSync(placeholderMapDir, { recursive: true });
  }

  fs.writeFileSync(placeholderMapPath, JSON.stringify(placeholderMap, null, 2));

  logger.log(`✓ Wrote placeholder map to ${placeholderMapPath}`);

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
