/**
 * Code formatter supporting multiple languages
 */
import * as prettier from "prettier/standalone";
import * as typescriptParser from "prettier/parser-typescript";
import estreePlugin from "prettier/plugins/estree";
import logger from "./logger";
import { normalizeAppError } from "./errors";
import { logClientError } from "@/lib/telemetry/posthog";
import { SystemError } from "./errors";
import { SupportedLanguage } from "@/types/mdx";

interface FormatOptions {
  language: SupportedLanguage;
}

/**
 * Format code based on language
 */
export async function formatCode(
  code: string,
  options: FormatOptions
): Promise<string> {
  // Handle potential escape sequences in MDX (like \_)
  code = code.replace(/\\([_])/g, "$1");

  if (!code || code.trim() === "") return code;

  const { language } = options;

  try {
    if (language === "typescript") {
      return await formatTypescriptCode(code);
    } else if (language === "python") {
      return await formatPythonCode(code);
    }

    return code;
  } catch (error) {
    logger.error(`Error formatting ${language} code:`, error);
    logClientError(
      new SystemError(`Error formatting ${language} code`, {
        data: {
          originalError: normalizeAppError(error),
        },
      })
    );
    return code;
  }
}

/**
 * Format TypeScript code using Prettier
 */
async function formatTypescriptCode(code: string): Promise<string> {
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
}

/**
 * Format Python code
 */
async function formatPythonCode(code: string): Promise<string> {
  return code.trim();
}
