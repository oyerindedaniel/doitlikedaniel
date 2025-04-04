"use client";

import { useRef, useState, ReactNode } from "react";
import { CodeBlockProps } from "@/types/mdx";

// Define a type for React elements with props
interface ReactElementWithProps {
  props: {
    children?: ReactNode;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Helper function to check if object is a React element with props
function isReactElementWithProps(obj: unknown): obj is ReactElementWithProps {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "props" in obj &&
    typeof (obj as Record<string, unknown>).props === "object"
  );
}

// Helper function to extract code content from highlighted code blocks
function extractRawCode(children: ReactNode): string {
  if (!children) return "";

  if (typeof children === "string") {
    return children;
  }

  if (isReactElementWithProps(children)) {
    if (Array.isArray(children.props.children)) {
      return children.props.children
        .map((child: ReactNode) => extractRawCode(child))
        .join("");
    }

    return extractRawCode(children.props.children);
  }

  return "";
}

// Helper function to extract language from className
function extractLanguage(className?: string): string {
  if (!className) return "code";

  const hljsMatch = className.match(/hljs\s+language-([a-zA-Z0-9_-]+)/);
  if (hljsMatch) return hljsMatch[1];

  const standardMatch = className.match(/language-([a-zA-Z0-9_-]+)/);
  if (standardMatch) return standardMatch[1];

  return "code";
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const textRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const language = extractLanguage((children as any)?.props?.className);

  const copyToClipboard = () => {
    try {
      if (children) {
        const code = extractRawCode(children);
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-md bg-slate-950 border border-slate-800/70 dark:bg-slate-900/90 shadow-sm">
      {/* Language badge */}
      <div className="absolute right-0 top-0 z-[1] rounded-bl-md bg-slate-800/90 px-2 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm dark:bg-slate-800/80">
        {language}
      </div>

      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        aria-label="Copy code"
        className="absolute right-2 top-8 z-[1] rounded-md bg-slate-700/90 p-1.5 text-xs cursor-pointer text-slate-200 opacity-0 backdrop-blur-sm transition-opacity hover:bg-slate-600/90 focus:opacity-100 group-hover:opacity-100 dark:bg-slate-700/80 dark:hover:bg-slate-600/80"
      >
        {isCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
        )}
      </button>

      {/* Code content with padding for language badge */}
      <div className="overflow-auto p-4 pt-8 text-sm font-mono text-slate-100 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
        <pre ref={textRef} className="font-mono" {...props}>
          {children}
        </pre>
      </div>
    </div>
  );
}
