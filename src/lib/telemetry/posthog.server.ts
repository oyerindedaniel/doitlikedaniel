"server-only";

import { PostHog } from "posthog-node";
import { isProduction } from "@/config/app";
import logger from "@/utils/logger";
import { SystemErrorType } from "@/utils/errors";
import { serializeSystemError } from "@/utils/errors";

const serverPosthog = isProduction
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export function logServerError(
  error: SystemErrorType,
  distinctId: string = "server"
): void {
  if (!isProduction || !serverPosthog) {
    logger.error("Error:", error);

    return;
  }

  try {
    serverPosthog.capture({
      distinctId,
      event: "server_error",
      properties: {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
        ...(error.data && serializeSystemError(error)),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    });
  } catch (posthogError) {
    logger.error("PostHog capture failed:", posthogError);
    logger.error("Original error:", error);
  }
}
