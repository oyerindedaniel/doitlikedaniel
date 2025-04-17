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
        <div className="mb-6 flex justify-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
          Something went wrong
        </h2>

        <p className="text-red-700 dark:text-red-300 text-sm mb-6">
          A system error occurred. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            leftElement={
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
          >
            Go home
          </Button>

          <Button
            variant="gradient"
            onClick={reset}
            leftElement={
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
