"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Custom hook to provide Monaco Editor theme based on the system/user theme
 * Also handles initialization of TypeScript types and compiler options
 */
export function useMonacoTheme(forceDarkMode?: boolean): string {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // Use the forceDarkMode prop if provided, otherwise use the resolved theme
    const isDark =
      forceDarkMode !== undefined ? forceDarkMode : resolvedTheme === "dark";

    setTheme(isDark ? "vs-dark" : "light");
  }, [resolvedTheme, forceDarkMode]);

  useEffect(() => {
    // This is a workaround for Monaco editor sometimes not loading TypeScript definitions correctly
    if (typeof window !== "undefined") {
      // After a short delay, dispatch a window resize event
      // This helps Monaco to properly initialize and refresh its view
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return theme;
}
