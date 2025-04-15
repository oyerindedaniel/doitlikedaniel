"use client";

import React, { useId } from "react";
import { TypeScriptEditor } from "./typescript-editor";
import logger from "@/utils/logger";
import { formatTsCode } from "@/utils/code";
import { CopyCodeButton } from "../copy-code-button";

export interface TSCodeBlockProps {
  children: string;
  filename?: string;
  editable?: boolean;
  height?: string | number;
  showLineNumbers?: boolean;
  minimap?: boolean;
  id?: string;
}

export function TSCodeBlock({
  children,
  filename,
  editable = false,
  height = "300px",
  showLineNumbers = true,
  minimap = false,
  id,
}: TSCodeBlockProps) {
  const generatedId = useId();
  const blockId = id || `ts-block-${generatedId}`;

  React.useEffect(() => {
    logger.debug(
      `TSCodeBlock render - ${filename || "unnamed"} (ID: ${blockId})`,
      {
        id: blockId,
        contentLength: children?.length,
      }
    );
  }, [children, filename, blockId]);

  const formattedCode = React.useMemo(() => {
    let codeToFormat = typeof children === "string" ? children.trim() : "";

    // Handle potential escape sequences in MDX (like \_)
    codeToFormat = codeToFormat.replace(/\\([_])/g, "$1");

    const formatted = formatTsCode(codeToFormat);

    if (codeToFormat !== formatted) {
      logger.debug(`Code was reformatted for ${filename}`, {
        id: blockId,
        formatted: true,
      });
    }

    return formatted;
  }, [children, filename, blockId]);

  const [code, setCode] = React.useState(formattedCode);

  React.useEffect(() => {
    setCode(formattedCode);
  }, [formattedCode]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="my-3 group" data-ts-block-id={blockId}>
      <TypeScriptEditor
        code={code}
        editable={editable}
        height={height}
        filename={filename}
        onChange={handleCodeChange}
        showLineNumbers={showLineNumbers}
        minimap={minimap}
        instanceId={blockId}
      />

      <div className="mt-2 text-right">
        <CopyCodeButton code={code} />
      </div>
    </div>
  );
}
