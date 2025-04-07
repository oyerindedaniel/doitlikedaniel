import { mkErrClass } from "@/utils/error/mk-err-class";
import logger from "./logger";

type NotFoundErrorData = {
  resource: string;
  id?: string;
};

type SystemErrorData = {
  originalError?: Error;
  context?: Record<string, unknown>;
};

/**
 * NotFoundError - Used when a resource cannot be found
 */
export const NotFoundError = mkErrClass<NotFoundErrorData, "NotFoundError">(
  "NotFoundError",
  "NOT_FOUND_ERROR",
  {
    resource: "",
    id: undefined,
  }
);

export type NotFoundErrorType = InstanceType<typeof NotFoundError>;

/**
 * SystemError - Used for all other errors with context preservation
 */
export const SystemError = mkErrClass<SystemErrorData, "SystemError">(
  "SystemError",
  "SYSTEM_ERROR",
  {
    originalError: undefined,
    context: {},
  }
);

export type SystemErrorType = InstanceType<typeof SystemError>;

/**
 * Check if an error is a NotFoundError
 */
export function isNotFoundError(error: unknown): error is NotFoundErrorType {
  return error instanceof Error && error.name === "NotFoundError";
}

/**
 * Check if an error is a SystemError
 */
export function isSystemError(error: unknown): error is SystemErrorType {
  return error instanceof Error && error.name === "SystemError";
}

export function logError(error: Error): void {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    try {
      if (typeof window !== "undefined") {
        import("@/lib/posthog").then(({ PostHog }) => {
          const errorProps: Record<string, unknown> = {
            errorName: error.name,
            errorMessage: error.message,
          };

          if (isSystemError(error)) {
            if (error.data.originalError) {
              errorProps.originalErrorName = error.data.originalError.name;
              errorProps.originalErrorMessage =
                error.data.originalError.message;
            }

            if (error.data.context) {
              errorProps.context = error.data.context;
            }
          }

          PostHog.capture("error", errorProps);
        });
      }
    } catch (e) {
      logger.debug("Failed to log to PostHog:", e);
    }

    if (!isSystemError(error)) {
      logger.error(`[${error.name}] ${error.message}`);
    }
  } else {
    logger.error("=============================================");
    logger.error(`[${error.name}] ${error.message}`);

    if (isSystemError(error)) {
      if (error.data.originalError) {
        logger.error("\nOriginal error:");
        logger.error(error.data.originalError);
      }

      if (error.data.context) {
        logger.error("\nContext:");
        logger.error(error.data.context);
      }
    }

    logger.error("\nStack trace:");
    logger.error(error.stack);
    logger.error("=============================================");
  }
}
