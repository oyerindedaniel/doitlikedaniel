"use client";

import { ReactNode, ReactElement } from "react";
import CodeBlock from "./code-block";
import { TSCodeBlock } from "./ts-code-block";
import { extractLanguage, extractRawCode } from "@/utils/code";

interface SmartCodeBlockProps {
  children: string;
  className?: string;
  filename?: string;
  editable?: boolean;
  height?: string | number;
}

interface CodeElementProps {
  children?: string;
  className?: string;
  [key: string]: unknown;
}

/**
 * A smart code block component that decides which code renderer to use
 * based on language and other preferences
 */
export function SmartCodeBlock({
  children,
  className,
  filename,
  editable = false,
  height,
}: SmartCodeBlockProps) {
  // Get language from className (e.g., "language-typescript")
  const language = extractLanguage(className);

  console.log("language", language);

  // Uses Monaco Editor for TypeScript and TSX
  if (language === "typescript" || language === "tsx") {
    const filenameProp = filename || `example.${language}`;
    return (
      <TSCodeBlock
        filename={filenameProp}
        editable={editable}
        height={height || "300px"}
      >
        {children}
      </TSCodeBlock>
    );
  }

  // Uses standard code block for other languages
  return (
    <CodeBlock className={className} language={language}>
      {children}
    </CodeBlock>
  );
}

/**
 * Custom Pre component for MDX that handles code blocks intelligently
 */
export function Pre({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  // Check if this is a code block with a child <code> element
  const isCodeBlock =
    children &&
    typeof children === "object" &&
    children !== null &&
    "type" in (children as ReactElement) &&
    (children as ReactElement).type === "code";

  // If not a code block, render as normal pre
  if (!isCodeBlock) {
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    );
  }

  const codeElement = children as ReactElement<CodeElementProps>;
  const codeProps = codeElement.props;
  const codeString = extractRawCode(children);
  const codeClassName = codeProps.className || "";

  // Get filename from meta if available (```typescript:filename.ts)
  const metaMatch = codeClassName.match(/language-[\w]+(:.+)?/);
  const filename =
    metaMatch && metaMatch[1] ? metaMatch[1].substring(1) : undefined;

  return (
    <SmartCodeBlock
      className={codeClassName}
      filename={filename}
      editable={false}
    >
      {codeString}
    </SmartCodeBlock>
  );
}
