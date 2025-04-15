import { mkErrClass } from "@/utils/error/mk-err-class";

type NotFoundErrorData = {
  resource: string;
  id?: string;
};

export type SystemErrorData = {
  originalError?: Error;
  context?: {
    userId?: string;
    action?: string;
    metadata?: Record<string, unknown>;
  };
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

export function normalizeAppError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

export function serializeSystemError(error: SystemErrorData) {
  if (!error || !isSystemError(error)) return {};

  return {
    originalError: {
      name: error.originalError?.name,
      message: error.originalError?.message,
      stack: error.originalError?.stack,
      ...(error.context && {
        ...error.context,
        metadata: error.context.metadata || {},
      }),
    },
  };
}
