"use client";

import { useEffect } from "react";
import { isSystemError, normalizeAppError } from "@/utils/errors";
import { logClientError } from "@/lib/telemetry/posthog";
import { SystemError } from "@/utils/errors";
import { ErrorUI } from "./error-ui";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  global?: boolean;
}

export default function ErrorBoundary({
  error,
  reset,
  global = false,
}: ErrorBoundaryProps) {
  useEffect(() => {
    if (isSystemError(error)) {
      logClientError(error);
    } else {
      logClientError(
        new SystemError("Error in ErrorBoundary", {
          data: {
            originalError: normalizeAppError(error),
            context: {
              metadata: {
                isGlobalError: global,
                digest: error.digest,
              },
            },
          },
        })
      );
    }
  }, [error, global]);

  // For global errors, we need to provide our own <html> and <body> tags
  if (global) {
    return (
      <html>
        <body>
          <ErrorUI reset={reset} />
        </body>
      </html>
    );
  }

  // For regular errors, we can just return the error UI
  return <ErrorUI reset={reset} />;
}
