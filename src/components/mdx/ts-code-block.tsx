"use client";

import React, { useId } from "react";
import { TypeScriptEditor, TypeScriptEditorProps } from "./typescript-editor";
import logger from "@/utils/logger";
import { formatTsCode } from "@/utils/code";
import { CopyCodeButton } from "../copy-code-button";
import { logClientError } from "@/lib/telemetry/posthog";
import { normalizeAppError, SystemError } from "@/utils/errors";

export interface TSCodeBlockProps
  extends Pick<
    TypeScriptEditorProps,
    "editable" | "height" | "showLineNumbers" | "minimap" | "filename"
  > {
  children: string;
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
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    logger.debug(
      `TSCodeBlock render - ${filename || "unnamed"} (ID: ${blockId})`,
      {
        id: blockId,
        contentLength: children?.length,
      }
    );
  }, [children, filename, blockId]);

  React.useEffect(() => {
    let isMounted = true;

    async function formatCode() {
      try {
        let codeToFormat = typeof children === "string" ? children.trim() : "";

        // Handle potential escape sequences in MDX (like \_)
        codeToFormat = codeToFormat.replace(/\\([_])/g, "$1");

        const formatted = await formatTsCode(codeToFormat);

        if (isMounted) {
          if (codeToFormat !== formatted) {
            logger.debug(`Code was reformatted for ${filename}`, {
              id: blockId,
              formatted: true,
            });
          }
          setCode(formatted);
        }
      } catch (error) {
        logger.error("Error formatting code:", error);
        logClientError(
          new SystemError("Error formatting code", {
            data: {
              originalError: normalizeAppError(error),
            },
          })
        );
        if (isMounted) {
          setCode(typeof children === "string" ? children.trim() : "");
        }
      }
    }

    formatCode();

    return () => {
      isMounted = false;
    };
  }, [children, filename, blockId]);

  const handleCodeChange = React.useCallback(
    (newCode: string) => {
      setCode(newCode);
    },
    [setCode]
  );

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
