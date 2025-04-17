"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorUIProps {
  reset: () => void;
  className?: string;
}

export function ErrorUI({ reset, className }: ErrorUIProps) {
  return (
    <div
      className={cn(
        `container flex flex-col items-center justify-center h-[calc(100dvh_-_68px)] p-4 text-center`,
        className
      )}
    >
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 md:max-w-md w-full space-y-4 shadow-sm border border-red-100 dark:border-red-900/30">
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
          Something went wrong
        </h2>

        <p className="text-red-700 dark:text-red-300 mb-6">
          A system error occurred. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>

          <Button variant="gradient" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
