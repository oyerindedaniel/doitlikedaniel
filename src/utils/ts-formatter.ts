/**
 * TypeScript code formatter using Prettier
 */
import prettier from "prettier/standalone";
import typescriptParser from "prettier/parser-typescript";
import estreePlugin from "prettier/plugins/estree";
import logger from "./logger";
import { normalizeAppError } from "./errors";
import { logClientError } from "@/lib/telemetry/posthog";
import { SystemError } from "./errors";

/**
 * Format TypeScript code using Prettier async API
 */
export async function formatTsCode(code: string): Promise<string> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return code;
  }

  code = code.replace(/\\([_])/g, "$1");

  if (!code || code.trim() === "") return code;

  try {
    return await prettier.format(code, {
      parser: "typescript",
      plugins: [typescriptParser, estreePlugin],
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      bracketSpacing: true,
      arrowParens: "avoid",
    });
  } catch (error) {
    logger.error("Error formatting TypeScript code:", error);
    logClientError(
      new SystemError("Error formatting code", {
        data: {
          originalError: normalizeAppError(error),
        },
      })
    );
    return code;
  }
}
