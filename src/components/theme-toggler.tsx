"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function ThemeToggler() {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = isMounted ? resolvedTheme === "dark" : false;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          className={cn(
            "relative cursor-pointer h-9 w-9 overflow-hidden rounded-full transition-colors",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            "border border-slate-200 dark:border-slate-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          <div className="relative h-full w-full">
            {/* Sun icon - visible in light mode */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out 
                       rotate-0 scale-100 opacity-100 dark:rotate-45 dark:scale-0 dark:opacity-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-500"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>

            {/* Moon icon - visible in dark mode */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out
                           -rotate-90 scale-0 opacity-0  dark:rotate-0 dark:scale-100 dark:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-400"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" variant="gradient" size="sm">
        <p>Switch to {isDark ? "light" : "dark"} mode</p>
      </TooltipContent>
    </Tooltip>
  );
}
