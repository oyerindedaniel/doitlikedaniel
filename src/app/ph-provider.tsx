"use client";

import { useEffect } from "react";
import {
  PostHogProvider,
  posthog,
  initPostHogClient,
} from "@/lib/telemetry/posthog";

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHogClient();
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
