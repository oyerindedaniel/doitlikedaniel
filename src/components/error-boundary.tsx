"use client";

import { useEffect } from "react";
import { isSystemError } from "@/utils/errors";
import { logClientError } from "@/lib/telemetry/posthog";
import { Button } from "@/components/ui/button";
import { SystemError } from "@/utils/errors";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    logClientError(
      new SystemError("Error in ErrorBoundary", {
        data: {
          originalError: error,
        },
      })
    );
  }, [error]);

  const errorMessage = isSystemError(error)
    ? "A system error occurred. Our team has been notified."
    : error.message || "An unexpected error occurred";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="max-w-md w-full space-y-4">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 border border-red-100 dark:border-red-900/30">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
            Something went wrong
          </h2>

          <p className="text-red-700 dark:text-red-300 mb-6">{errorMessage}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              onClick={() => (window.location.href = "/")}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              Go home
            </Button>

            <Button
              onClick={reset}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
