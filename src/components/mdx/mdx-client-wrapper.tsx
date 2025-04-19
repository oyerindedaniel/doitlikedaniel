/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ReactNode } from "react";
import { Alert } from "./alert";
import { CalloutBox } from "./callout-box";
import { YoutubeEmbed } from "./youtube-embed";
import {
  MonacoCodeBlock,
  TSCodeBlock,
  PythonCodeBlock,
} from "./monaco-code-block";
import { SmartCodeBlock, SmartPre } from "./smart-code-block";

/**
 * Client-side wrapper component for MDX content
 * This allows all client-side MDX components to be used in server components
 */
export function MDXClientWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
