"use client";

import React, { useId, useCallback, memo } from "react";
import { CodeEditorProps } from "./monaco-code-editor";
import { CopyCodeButton } from "../copy-code-button";
import { MonacoLoader } from "../monaco-loader";
import type * as Monaco from "monaco-editor";
import { useCodeFormatting } from "@/hooks/use-code-formatting";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MonacoCodeEditor = dynamic(
  () => import("./monaco-code-editor").then((mod) => mod.MonacoCodeEditor),
  { ssr: false, loading: () => <MonacoLoader height="300px" /> }
);

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

  const { code, formatAndSetCode, handleEditorDidMount, handleCodeChange } =
    useCodeFormatting({
      initialCode: children,
      language,
      id: blockId,
      filename,
      editable,
    });

  // const formatKeyLabel = getPlatformKeyText(
  //   "Alt+Shift+F",
  //   "⌥⇧F", // Mac
  //   "Alt+Shift+F", // Windows
  //   "Ctrl+Shift+F" // Linux
  // );

  const handleEditorMount = useCallback(
    (editor: Monaco.editor.IStandaloneCodeEditor) => {
      handleEditorDidMount(editor);
    },
    [handleEditorDidMount]
  );

  return (
    <div className="my-3 group" data-monaco-block-id={blockId}>
      <MonacoCodeEditor
        key={`${blockId}-${filename}`}
        code={code}
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

        <CopyCodeButton code={code} />
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
