import { useState, useEffect } from "react";
import { isClient } from "@/utils/app";

export type Platform = "mac" | "windows" | "linux" | "unknown";

function getUserAgent() {
  return window.navigator.userAgent.toLowerCase();
}

/**
 * Hook to detect the user's operating system
 */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    if (!isClient()) return;

    const userAgent = getUserAgent();

    if (userAgent.indexOf("mac") !== -1) {
      setPlatform("mac");
    } else if (userAgent.indexOf("win") !== -1) {
      setPlatform("windows");
    } else if (userAgent.indexOf("linux") !== -1) {
      setPlatform("linux");
    }
  }, []);

  return platform;
}

/**
 * Get platform-specific key combination display text
 */
export function getPlatformKeyText(
  key: string,
  mac?: string,
  windows?: string,
  linux?: string
) {
  if (!isClient()) return windows || key;

  const userAgent = getUserAgent();

  if (userAgent.indexOf("mac") !== -1) {
    return mac || key;
  } else if (userAgent.indexOf("win") !== -1) {
    return windows || key;
  } else if (userAgent.indexOf("linux") !== -1) {
    return linux || key;
  }

  return key;
}

/**
 * Get platform-specific key modifiers for Monaco
 */
export function getPlatformKeybinding(platform: Platform): {
  formatKeys: number[];
} {
  const ALT = 2048;
  const SHIFT = 512;
  const CTRL = 1024;
  const CMD = 256;
  const KEY_B = 31;

  switch (platform) {
    case "mac":
      return {
        formatKeys: [CMD | SHIFT | KEY_B], // Command+Shift+F
      };
    case "linux":
      return {
        formatKeys: [CTRL | SHIFT | KEY_B], // Ctrl+Shift+F
      };
    case "windows":
    default:
      return {
        formatKeys: [ALT | SHIFT | KEY_B], // Alt+Shift+F
      };
  }
}
