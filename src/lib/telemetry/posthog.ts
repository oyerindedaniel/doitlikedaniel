"use client";

import { isProduction } from "@/config/app";
import { SystemErrorData } from "@/utils/errors";
import logger from "@/utils/logger";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

type PageViewContext = {
  $current_url: string;
  $pathname: string;
  $host: string;
  $search?: string;
};

/**
 * Initialize PostHog client on the browser side
 */
export function initPostHogClient(): void {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: true,
    debug: false,
  });
}

/**
 * Log a page view event to PostHog
 */
export function capturePageView(url: string, context?: PageViewContext) {
  if (!isProduction || !posthog) return;

  try {
    posthog.capture("$pageview", {
      $current_url: url,
      ...context,
    });
  } catch (e) {
    logger.error("Failed to log pageview to PostHog:", e);
  }
}

/**
 * Log a client error event to PostHog
 */
export function logClientError(
  error: Error,
  context?: SystemErrorData["context"]
) {
  if (!isProduction || !posthog) return;

  try {
    posthog.capture("client_error", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...context,
        metadata: context?.metadata || {},
      },
      environment: process.env.NODE_ENV,
    });
  } catch (e) {
    logger.error("Failed to log client error to PostHog:", e);
  }
}

export { posthog, PostHogProvider };
