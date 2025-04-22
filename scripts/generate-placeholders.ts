import path from "path";
import fs from "fs";
import { glob } from "glob";
import { IMAGES_DIR, generatePlaceholder } from "@/lib/image-utils.server";
import logger from "@/utils/logger";
import { joinGlobPath, normalizePath } from "@/lib/image-utils";
import { IS_PRODUCTION, ENFORCE_PLACEHOLDERS } from "@/config/app";
import type { PlaceholderMap } from "@/generated/placeholder-map";
import { normalizeAppError } from "@/utils/errors";

// Placeholder file path
const PLACEHOLDER_MAP_PATH = path.join(
  process.cwd(),
  "src/generated/placeholders.json"
);

async function generatePlaceholders() {
  logger.log("Starting placeholder generation...");

  let existingPlaceholders: PlaceholderMap = {};
  try {
    if (fs.existsSync(PLACEHOLDER_MAP_PATH)) {
      const existingData = fs.readFileSync(PLACEHOLDER_MAP_PATH, "utf-8");
      existingPlaceholders = JSON.parse(existingData);
      logger.log(
        `Loaded ${Object.keys(existingPlaceholders).length} existing placeholders`
      );
    }
  } catch (error) {
    logger.warn(
      `Failed to load existing placeholders: ${normalizeAppError(error).message}`
    );
  }

  const imagePattern = joinGlobPath(
    IMAGES_DIR,
    "**",
    "*.{jpg,jpeg,png,webp,avif}"
  );
  const imageFiles = glob.sync(imagePattern, { nodir: true });

  logger.log(`Found ${imageFiles.length} image files to process`);

  let missingPlaceholders = 0;
  let skippedPlaceholders = 0;
  const errors: string[] = [];

  const placeholderMap: PlaceholderMap = { ...existingPlaceholders };

  for (const imagePath of imageFiles) {
    try {
      const publicDir = path.join(process.cwd(), "public");
      let relativePath = imagePath;

      if (imagePath.startsWith(publicDir)) {
        relativePath = imagePath.substring(publicDir.length);
      }

      const normalizedPath = normalizePath(relativePath);

      const cacheKey = `${normalizedPath}`;

      if (cacheKey in existingPlaceholders) {
        logger.log(`✓ Reusing existing placeholder for ${normalizedPath}`);
        placeholderMap[cacheKey] = existingPlaceholders[cacheKey];
        skippedPlaceholders++;
        continue;
      }

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
      const errorMessage = `Failed to generate placeholder for ${imagePath}: ${normalizeAppError(error).message}`;
      errors.push(errorMessage);
      logger.error(`✗ ${errorMessage}`);
    }
  }

  const placeholderMapDir = path.dirname(PLACEHOLDER_MAP_PATH);
  if (!fs.existsSync(placeholderMapDir)) {
    fs.mkdirSync(placeholderMapDir, { recursive: true });
  }

  fs.writeFileSync(
    PLACEHOLDER_MAP_PATH,
    JSON.stringify(placeholderMap, null, 2)
  );

  logger.log(`✓ Wrote placeholder map to ${PLACEHOLDER_MAP_PATH}`);

  logger.log("\nPlaceholder Generation Summary:");
  logger.log(`Total images: ${imageFiles.length}`);
  logger.log(`Reused placeholders: ${skippedPlaceholders}`);
  logger.log(
    `Newly generated: ${imageFiles.length - skippedPlaceholders - missingPlaceholders}`
  );
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
