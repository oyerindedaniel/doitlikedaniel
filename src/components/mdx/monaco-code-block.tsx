"use client";

import React, { useId, useCallback, memo } from "react";
import { CodeEditorProps } from "./monaco-code-editor";
import { CopyCodeButton } from "../copy-code-button";
import type * as Monaco from "monaco-editor";
import { useCodeFormatting } from "@/hooks/use-code-formatting";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MonacoCodeEditor } from "./monaco-code-editor";

export interface MonacoCodeBlockProps
  extends Pick<
    CodeEditorProps,
    | "editable"
    | "height"
    | "showLineNumbers"
    | "minimap"
    | "filename"
    | "language"
  > {
  children: string;
  id?: CodeEditorProps["instanceId"];
}

export const MonacoCodeBlock = memo(function MonacoCodeBlock({
  children,
  filename,
  language = "typescript",
  editable = false,
  height = "300px",
  showLineNumbers = true,
  minimap = false,
  id,
}: MonacoCodeBlockProps) {
  const generatedId = useId();
  const blockId = id || `monaco-block-${generatedId}`;

  const {
    defaultCode,
    formatAndSetCode,
    handleEditorDidMount,
    handleCodeChange,
    editorRef,
  } = useCodeFormatting({
    initialCode: children,
    language,
    id: blockId,
    filename,
    editable,
  });

  const handleEditorMount = useCallback(
    (editor: Monaco.editor.IStandaloneCodeEditor) => {
      handleEditorDidMount(editor);
    },
    [handleEditorDidMount]
  );

  return (
    <div className="my-4 group" data-monaco-block-id={blockId}>
      <MonacoCodeEditor
        key={`${blockId}-${filename}`}
        defaultCode={defaultCode}
        language={language}
        editable={editable}
        height={height}
        filename={filename}
        onChange={handleCodeChange}
        showLineNumbers={showLineNumbers}
        minimap={minimap}
        instanceId={blockId}
        onEditorDidMount={handleEditorMount}
      />

      <div className="flex items-center gap-3 ml-auto w-fit mt-4">
        {editable && (
          <div className={cn("w-fit")}>
            <Button
              className="w-7 h-7"
              onClick={() => formatAndSetCode()}
              variant="gradient"
              size="icon"
            >
              <SaveIcon aria-hidden className="h-4 w-4" />
              <span className="sr-only">Format document</span>
            </Button>
          </div>
        )}

        <CopyCodeButton isEditor editor={editorRef} code={defaultCode} />
      </div>
    </div>
  );
});

// Components for specific languages
export function TSCodeBlock(props: Omit<MonacoCodeBlockProps, "language">) {
  return <MonacoCodeBlock {...props} language="typescript" />;
}

export function PythonCodeBlock(props: Omit<MonacoCodeBlockProps, "language">) {
  return <MonacoCodeBlock {...props} language="python" />;
}
