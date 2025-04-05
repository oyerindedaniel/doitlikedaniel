"use client";

import React, { useId } from "react";
import { TypeScriptEditor } from "./typescript-editor";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import { formatTsCode } from "@/utils/code";

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
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    setCode(formattedCode);
  }, [formattedCode]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="my-6" data-ts-block-id={blockId}>
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

      {editable && (
        <div className="mt-2 text-right">
          <Button
            variant="gradient"
            className="text-xs rounded px-3! py-1! w-fit h-fit"
            size="sm"
            onClick={() => {
              try {
                navigator.clipboard.writeText(code);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              } catch (error) {
                logger.error("Failed to copy code:", error);
              }
            }}
          >
            {isCopied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
      )}
    </div>
  );
}
