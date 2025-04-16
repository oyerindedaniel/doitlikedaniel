/* eslint-disable @typescript-eslint/no-unused-vars */
"server-only";

import { PostHog } from "posthog-node";
import { isProduction } from "@/config/app";
import logger from "@/utils/logger";
import { createErrorPayload } from "@/utils/error-utils";
import { normalizeAppError, SystemError } from "@/utils/errors";

const serverPosthog = isProduction
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export function logServerError(
  error: Error,
  distinctId: string = "server",
  options?: { internal?: boolean }
): void {
  if (!isProduction || !serverPosthog) {
    logger.error("Error:", error);

    return;
  }

  try {
    serverPosthog.capture({
      distinctId,
      event: "server_error",
      properties: createErrorPayload(error),
    });
  } catch (posthogError) {
    logger.error("PostHog capture failed:", posthogError);
    logger.error("Original error:", error);

    // if (!options?.internal) {
    //   logServerError(
    //     new SystemError("PostHog capture failed", {
    //       data: {
    //         originalError: normalizeAppError(posthogError),
    //       },
    //     }),
    //     "server",
    //     { internal: true }
    //   );
    // }
  }
}
