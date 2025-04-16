import { isSystemError } from "@/utils/errors";

/**
 * Serializes a SystemError for logging
 */
export function serializeSystemError(error: Error) {
  if (!error || !isSystemError(error) || !error.data) return {};

  const original = error.data.originalError;
  const context = error.data.context;

  return {
    original_error_name: original?.name || "",
    original_error_message: original?.message || "",
    original_error_stack: original?.stack || "",
    ...(context?.userId && { context_user_id: context.userId }),
    ...(context?.action && { context_action: context.action }),
    ...(context?.metadata && {
      context_metadata: JSON.stringify(context.metadata),
    }),
  };
}

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
