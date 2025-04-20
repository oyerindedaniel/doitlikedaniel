"use client";

import React, { useId, useCallback, memo } from "react";
import { CodeEditorProps } from "./monaco-code-editor";
import { CopyCodeButton } from "../copy-code-button";
import { MonacoLoader } from "../monaco-loader";
import type * as Monaco from "monaco-editor";
import { useCodeFormatting } from "@/hooks/use-code-formatting";
import {
  getPlatformKeyText,
  usePlatform,
  getPlatformKeybinding,
} from "@/hooks/use-platform";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { SaveIcon, WandSparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const platform = usePlatform();

  const {
    code,
    formatAndSetCode,
    handleEditorDidMount,
    handleCodeChange,
    editorRef,
    pendingFormat,
    setPendingFormat,
  } = useCodeFormatting({
    initialCode: children,
    language,
    id: blockId,
    filename,
    editable,
  });

  const formatKeyLabel = getPlatformKeyText(
    "Alt+Shift+F",
    "⌥⇧F", // Mac
    "Alt+Shift+F", // Windows
    "Ctrl+Shift+F" // Linux
  );

  const handleFormatCommand = useCallback(async () => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue) {
        await formatAndSetCode(currentValue);
      }
    }
  }, [formatAndSetCode, editorRef]);

  //   const shortcutKeys =
  //     platform === "mac"
  //       ? "meta+shift+f"
  //       : platform === "linux"
  //         ? "ctrl+shift+f"
  //         : "alt+shift+f";

  //   useHotkeys(shortcutKeys, handleFormatCommand, {
  //     enableOnFormElements: true,
  //     enableOnContentEditable: true,
  //   });

  const handleEditorMount = useCallback(
    (editor: Monaco.editor.IStandaloneCodeEditor) => {
      handleEditorDidMount(editor);

      const keybindings = getPlatformKeybinding(platform);

      editor.addAction({
        id: "format-document",
        label: "Format Document",
        keybindings: keybindings.formatKeys,
        run: async () => {
          await handleFormatCommand();
          setPendingFormat(false);
          return;
        },
      });
    },
    [handleEditorDidMount, handleFormatCommand, platform, setPendingFormat]
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
          <div
            className={cn(
              "opacity-0 transition-opacity duration-300 ease-in-out w-fit",
              pendingFormat && "opacity-100 animate-pulse-subtle"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-7 h-7"
                  onClick={handleFormatCommand}
                  variant="gradient"
                  size="icon"
                >
                  {pendingFormat ? (
                    <SaveIcon aria-hidden className="h-4 w-4" />
                  ) : (
                    <WandSparkles aria-hidden className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {pendingFormat ? "Format document" : "Formatted"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs" side="bottom">
                {pendingFormat
                  ? `Format document with ${formatKeyLabel}`
                  : "Formatted"}
              </TooltipContent>
            </Tooltip>
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
