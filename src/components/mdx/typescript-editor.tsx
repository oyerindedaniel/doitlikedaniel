"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import type { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { cn } from "@/lib/utils";
import logger from "@/utils/logger";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { MonacoLoader } from "../monaco-loader";
import { useShikiMonaco } from "@/hooks/use-shiki-monaco";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  {
    loading: () => <MonacoLoader height="300px" />,
    ssr: false,
  }
);

export interface TypeScriptEditorProps {
  code: string;
  editable?: boolean;
  height?: string | number;
  className?: string;
  filename?: string;
  onChange?: (value: string) => void;
  showLineNumbers?: boolean;
  minimap?: boolean;
  instanceId?: string;
}

function TypeScriptEditorPre({
  code,
  editable = false,
  height = "300px",
  className,
  filename = "example.ts",
  onChange,
  showLineNumbers = true,
  minimap = false,
  instanceId,
}: TypeScriptEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const generatedId = useId();
  const uniqueId = instanceId || generatedId;
  const { setupMonaco, theme } = useShikiMonaco();

  useEffect(() => {
    logger.log(`TypeScriptEditor mount - filename: ${filename}`, {
      id: uniqueId,
      codeSnippet: code?.substring(0, 100) + "...",
      editable,
      height,
      firstLine: code?.split("\n")[0],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLanguage = () => {
    const extension = filename.split(".").pop();
    switch (extension) {
      case "tsx":
        return "typescript";
      case "ts":
        return "typescript";
      case "jsx":
        return "javascript";
      case "js":
        return "javascript";
      default:
        return "typescript";
    }
  };

  const language = getLanguage();
  const modelUri = `file:///${uniqueId}-${filename}`;

  const handleEditorMount: OnMount = async (editor, monaco) => {
    editorRef.current = editor;

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
      strict: true,
    });

    await setupMonaco(monaco);

    if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
      const uri = monaco.Uri.parse(modelUri);

      const existingModel = monaco.editor.getModel(uri);
      if (existingModel) {
        logger.log(`Disposing existing model for ${modelUri}`);
        existingModel.dispose();
      }

      const model = monaco.editor.createModel(code, "typescript", uri);
      editor.setModel(model);

      logger.log(`Created model for ${modelUri}`, {
        codePreview: code.substring(0, 50),
        modelLanguage: model.getLanguageId(),
      });
    }

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module "react" {
        export default React;
        export namespace React {
          interface Component {}
          function createElement(type: any, props?: any, ...children: any[]): any;
          function useState<T>(initialState: T): [T, (newState: T) => void];
        }
      }
      `,
      "file:///node_modules/@types/react/index.d.ts"
    );
  };

  return (
    <div
      tabIndex={0}
      className={cn(
        "relative rounded-[0.5rem] overflow-hidden border border-gray-200 dark:border-[#27272a] outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
        isHovering &&
          editable &&
          "ring-2 ring-offset-2 ring-offset-background ring-blue-500/20",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-instance-id={uniqueId}
    >
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {filename}
          </div>
          {editable && (
            <div className="text-xs text-green-600 dark:text-green-400 animate-pulse">
              Editable
            </div>
          )}
        </div>
      )}

      <Editor
        height={height}
        language={language}
        value={code}
        theme={theme}
        options={{
          readOnly: !editable,
          minimap: { enabled: minimap },
          scrollBeyondLastLine: false,
          lineNumbers: showLineNumbers ? "on" : "off",
          folding: true,
          matchBrackets: "always",
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          hover: { enabled: true, delay: 300 },
          parameterHints: { enabled: true },
          quickSuggestions: editable,
          suggestOnTriggerCharacters: editable,
          wordBasedSuggestions: editable ? "currentDocument" : "off",
          renderValidationDecorations: editable ? "on" : "off",
          padding: { top: 16, bottom: 16 },
        }}
        onChange={(value) => onChange && value && onChange(value)}
        onMount={handleEditorMount}
        className="monaco-editor-container"
        path={modelUri}
        loading={<MonacoLoader height={height} />}
      />
    </div>
  );
}

export const TypeScriptEditor = (props: TypeScriptEditorProps) => {
  return (
    <Suspense fallback={<MonacoLoader height={props.height} />}>
      <TypeScriptEditorPre {...props} />
    </Suspense>
  );
};
