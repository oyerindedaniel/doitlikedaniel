import { useCallback, useEffect, useRef } from "react";
import { shikiToMonaco } from "@shikijs/monaco";
import type * as Monaco from "monaco-editor";
import { useTheme } from "next-themes";
import { shikiConfig } from "@/config/shiki";
import { getGlobalHighlighter } from "@/lib/shiki";

export function useShikiMonaco() {
  const monacoRef = useRef<typeof Monaco | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    (async () => {
      await getGlobalHighlighter();
    })();
  }, []);

  const getShikiTheme = useCallback(() => {
    return resolvedTheme === "dark"
      ? shikiConfig.themes.dark
      : shikiConfig.themes.light;
  }, [resolvedTheme]);

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
    const highlighter = await getGlobalHighlighter();

    if (highlighter) {
      monacoRef.current = monaco;

      for (const lang of shikiConfig.langs) {
        monaco.languages.register({ id: lang });
      }

      shikiToMonaco(highlighter, monaco);
      monaco.editor.setTheme(getShikiTheme());
    }
  };

  return {
    setupMonaco,
    theme: getShikiTheme(),
  };
}
