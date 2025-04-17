import { ReactElement, ReactNode } from "react";
import { formatTsCode } from "./ts-formatter";

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
  if (!className) return "ts";

  return "ts";
}

// Check if this is a code block with a child <code> element
function isCodeBlock(children: ReactNode): boolean {
  return Boolean(
    children &&
      typeof children === "object" &&
      children !== null &&
      "type" in (children as ReactElement) &&
      (children as ReactElement).type === "code"
  );
}

export { extractRawCode, extractLanguage, formatTsCode, isCodeBlock };
