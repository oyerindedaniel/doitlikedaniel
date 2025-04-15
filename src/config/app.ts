// Environment flags
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";

// PostHog configuration
export const posthogConfig = {
  enabled: isProduction && !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
};
