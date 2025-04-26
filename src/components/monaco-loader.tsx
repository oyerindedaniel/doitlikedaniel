"use client";

import { cn } from "@/lib/utils";

interface MonacoLoaderProps {
  className?: string;
  height?: string | number;
}

export function MonacoLoader({
  className,
  height = "350px",
}: MonacoLoaderProps) {
  return (
    <div
      className={cn("w-full rounded-md overflow-hidden", className)}
      style={{ height }}
    >
      {/* Code editor header simulation */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b",
          "bg-slate-100 border-slate-200 dark:bg-zinc-900 dark:border-zinc-800"
        )}
      >
        <div
          className={cn(
            "h-4 w-32 rounded-full animate-[var(--animate-shimmer)]",
            "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]",
            "dark:bg-gradient-to-r dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 dark:bg-[length:200%_100%]"
          )}
        ></div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-zinc-700 dark:bg-zinc-600"></div>
          <div className="w-3 h-3 rounded-full bg-zinc-700 dark:bg-zinc-600"></div>
          <div className="w-3 h-3 rounded-full bg-zinc-700 dark:bg-zinc-600"></div>
        </div>
      </div>

      {/* Editor content simulation */}
      <div
        className={cn(
          "p-4 h-full space-y-3 overflow-hidden",
          "bg-white dark:bg-zinc-950"
        )}
      >
        {/* Line numbers and code lines simulation */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div
              className={cn(
                "w-8 text-right text-xs",
                "text-slate-400 dark:text-zinc-700"
              )}
            >
              {i + 1}
            </div>
            <div
              className={cn(
                "h-4 rounded-full animate-[var(--animate-shimmer)]",
                "bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%]",
                "dark:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 dark:bg-[length:200%_100%]"
              )}
              style={{
                width: `${Math.random() * 60 + 20}%`,
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
