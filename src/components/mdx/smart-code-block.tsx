"use client";

import { ReactNode, ReactElement } from "react";
import CodeBlock from "./code-block";
import { TSCodeBlock } from "./ts-code-block";
import { extractLanguage, extractRawCode, isCodeBlock } from "@/utils/code";

interface SmartCodeBlockProps {
  children: string;
  className?: string;
  filename?: string;
  editable?: boolean;
  height?: string | number;
}

export interface CodeElementProps {
  children?: string;
  className?: string;
  [key: string]: unknown;
}

// TODO: Improve this does not work right

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
  return <CodeBlock className={className}>{children}</CodeBlock>;
}

/**
 * Custom Pre component for MDX that handles code blocks intelligently
 */
export function SmartPre({
  children,
  className,
  editable = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  editable?: boolean;
  [key: string]: unknown;
}) {
  // If not a code block, render as normal pre
  if (!isCodeBlock(children)) {
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
      editable={editable}
    >
      {codeString}
    </SmartCodeBlock>
  );
}
