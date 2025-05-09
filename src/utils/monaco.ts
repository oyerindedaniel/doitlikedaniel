import { SupportedLanguage } from "@/types/mdx";

/**
 * Get derived filename based on language and existing filename
 */
export function getDerivedFilename(
  language: SupportedLanguage,
  filename?: string
): string {
  if (filename) return filename;

  if (language === "typescript") {
    return "example.ts";
  }

  if (language === "python") {
    return "example.py";
  }

  return "example.txt";
}

/**
 * Get Monaco language identifier based on language and filename
 */
export function getMonacoLanguage(
  language: SupportedLanguage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filename?: string
): string {
  switch (language) {
    case "typescript":
      return "typescript";
    case "python":
      return "python";
    default:
      return "plaintext";
  }
}
