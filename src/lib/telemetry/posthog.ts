"use client";

import { isProduction } from "@/config/app";
import logger from "@/utils/logger";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { createErrorPayload } from "@/utils/error-utils";

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
export function logClientError(error: Error) {
  if (!isProduction || !posthog) return;

  // TODO: consider adding a group
  try {
    posthog.capture("client_error", createErrorPayload(error));
  } catch (posthogError) {
    logger.error("Failed to log client error to PostHog:", posthogError);
    logger.error("Original error:", error);
  }
}

export { posthog, PostHogProvider };
