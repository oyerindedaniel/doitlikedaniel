import { createHighlighter } from "shiki";
import { shikiConfig } from "@/config/shiki";
import type { Highlighter } from "shiki";

let globalHighlighter: Highlighter | null = null;

export async function getGlobalHighlighter() {
  if (!globalHighlighter) {
    globalHighlighter = await createHighlighter({
      themes: [shikiConfig.themes.light, shikiConfig.themes.dark],
      langs: shikiConfig.langs,
    });
  }
  return globalHighlighter;
}
