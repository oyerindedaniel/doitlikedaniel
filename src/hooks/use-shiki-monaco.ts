import { useEffect, useRef } from "react";
import { createHighlighter } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import type * as Monaco from "monaco-editor";
import { useTheme } from "next-themes";
import type { Highlighter } from "shiki";
import { shikiConfig } from "@/config/shiki";

export function useShikiMonaco() {
  const highlighterRef = useRef<Highlighter | null>(null);
  const { resolvedTheme } = useTheme();

  async function initializeHighlighter() {
    if (!highlighterRef.current) {
      highlighterRef.current = await createHighlighter({
        themes: [shikiConfig.themes.light, shikiConfig.themes.dark],
        langs: shikiConfig.langs,
      });
    }
  }

  useEffect(() => {
    initializeHighlighter();
  }, []);

  // This helps Monaco editor properly initialize TypeScript definitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const setupMonaco = async (monaco: typeof Monaco) => {
    if (!highlighterRef.current) {
      await initializeHighlighter();
    }

    if (highlighterRef.current) {
      for (const lang of shikiConfig.langs) {
        monaco.languages.register({ id: lang });
      }

      shikiToMonaco(highlighterRef.current, monaco);
    }
  };

  return {
    setupMonaco,
    theme:
      resolvedTheme === "dark"
        ? shikiConfig.themes.dark
        : shikiConfig.themes.light,
  };
}
