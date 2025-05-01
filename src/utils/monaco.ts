import { SupportedLanguage } from "@/types/mdx";

/**
 * Get derived filename based on language and existing filename
 */
export function getDerivedFilename(
  language: SupportedLanguage,
  filename?: string
): string {
  return (
    filename ||
    (language === "typescript"
      ? filename?.endsWith(".tsx")
        ? "example.tsx"
        : "example.ts"
      : language === "python"
        ? "example.py"
        : "example.txt")
  );
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
