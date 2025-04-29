"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva("relative my-4 px-4 py-3 rounded-sm border text-sm", {
  variants: {
    variant: {
      info: "bg-blue-50/80 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-300",
      warning:
        "bg-amber-50/80 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300",
      error:
        "bg-red-50/80 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300",
      success:
        "bg-green-50/80 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-900 dark:text-green-300",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export interface AlertProps extends VariantProps<typeof alertVariants> {
  children: ReactNode;
  title?: string;
}

export function Alert({ children, title, variant }: AlertProps) {
  const IconComponent = () => {
    switch (variant) {
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className={alertVariants({ variant })}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent />
        </div>
        <div>
          {title && <div className="font-medium mb-1">{title}</div>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
