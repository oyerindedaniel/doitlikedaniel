"use client";

import { CodeBlockProps } from "@/types/mdx";
import { extractRawCode, extractLanguage } from "@/utils/code";
import { CopyCodeButton } from "../copy-code-button";

export default function CodeBlock({
  children,
  className,
  style,
  ...props
}: CodeBlockProps) {
  const language = extractLanguage(className);

  return (
    <div className="group relative rounded-md my-3">
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
