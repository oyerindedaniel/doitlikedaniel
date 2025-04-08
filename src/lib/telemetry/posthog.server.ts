"server-only";

import { PostHog } from "posthog-node";
import { isProduction } from "@/config/app";
import logger from "@/utils/logger";
import { SystemErrorData } from "@/utils/errors";

const serverPosthog = isProduction
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export function logServerError(
  error: Error,
  distinctId: string = "server",
  context?: SystemErrorData["context"]
): void {
  if (!isProduction || !serverPosthog) {
    logger.error("Error:", error);

    if (context) {
      logger.error("Context:", context);
    }

    return;
  }

  try {
    serverPosthog.capture({
      distinctId,
      event: "server_error",
      properties: {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...context,
          metadata: context?.metadata || {},
        },
        environment: process.env.NODE_ENV,
      },
    });
  } catch (posthogError) {
    logger.error("PostHog capture failed:", posthogError);
    logger.error("Original error:", error);
    if (context) {
      logger.error("Context:", context);
    }
  }
}
