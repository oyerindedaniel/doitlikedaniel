// Environment flags
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const IS_TEST = process.env.NODE_ENV === "test";

const ENFORCE_PLACEHOLDERS = process.env.ENFORCE_PLACEHOLDERS === "true";

// PostHog configuration
const POSTHOG_CONFIG = {
  enabled: IS_PRODUCTION && !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
};

export {
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TEST,
  ENFORCE_PLACEHOLDERS,
  POSTHOG_CONFIG,
};
