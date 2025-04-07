import logger from "@/utils/logger";

interface PostHogClient {
  capture: (eventName: string, properties?: Record<string, unknown>) => void;
  identify: (
    distinctId: string,
    userProperties?: Record<string, unknown>
  ) => void;
  reset: () => void;
}

// No-op implementation for development/testing
const noopPostHog: PostHogClient = {
  capture: () => {},
  identify: () => {},
  reset: () => {},
};

let PostHog: PostHogClient = noopPostHog;

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  try {
    import("posthog-js")
      .then((module) => {
        const posthog = module.default;

        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host:
              process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
            autocapture: false,
            capture_pageview: true,
            capture_pageleave: false,
            debug: false,
          });

          PostHog = posthog;
        }
      })
      .catch((err) => {
        logger.error("Failed to load PostHog:", err);
      });
  } catch (error) {
    logger.error("Error initializing PostHog:", error);
  }
}

export { PostHog };
