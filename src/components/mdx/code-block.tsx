"use client";

import { ReactElement } from "react";
import { CodeBlockProps } from "@/types/mdx";
import { extractRawCode, extractLanguage } from "@/utils/code";
import { CodeElementProps } from "./smart-code-block";
import { CopyCodeButton } from "../copy-code-button";

export default function CodeBlock({
  children,
  className,
  style,
  ...props
}: CodeBlockProps) {
  const language = className
    ? extractLanguage(className)
    : children && typeof children === "object" && "props" in children
      ? extractLanguage(
          (children as ReactElement<CodeElementProps>).props.className
        )
      : "code";

  console.log({
    children,
    className,
    style,
    ...props,
  });

  return (
    <div className="group relative overflow-hidden rounded-md my-3">
      {/* Language badge */}
      {language && <div className="code-language-indicator">{language}</div>}

      <pre className={className} style={style} {...props}>
        {children}
      </pre>

      <div className="mt-2 text-right">
        {/* Copy button */}
        <CopyCodeButton code={extractRawCode(children)} />
      </div>
    </div>
  );
}
