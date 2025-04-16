import { serializeSystemError } from "@/utils/errors";

/**
 * Creates a standardized error payload for logging
 */
export function createErrorPayload(error: Error): Record<string, unknown> {
  return {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...(error && serializeSystemError(error)),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };
}
