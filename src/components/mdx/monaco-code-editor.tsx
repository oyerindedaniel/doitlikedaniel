"use client";

import React, { useRef, useState, useEffect, useId, memo } from "react";
import type { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { cn } from "@/lib/utils";
import logger from "@/utils/logger";
import { MonacoLoader } from "../monaco-loader";
import { useShikiMonaco } from "@/hooks/use-shiki-monaco";
import { Editor } from "@monaco-editor/react";
import { SupportedLanguage } from "@/types/mdx";
import { Badge } from "../ui/badge";

export interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  editable?: boolean;
  height?: string | number;
  className?: string;
  filename?: string;
  onChange?: (value: string) => void;
  showLineNumbers?: boolean;
  minimap?: boolean;
  instanceId?: string;
  onEditorDidMount?: (editor: Monaco.editor.IStandaloneCodeEditor) => void;
}

export const MonacoCodeEditor = memo(function MonacoCodeEditor({
  code,
  language = "typescript",
  editable = false,
  height = "300px",
  className,
  filename,
  onChange,
  showLineNumbers = true,
  minimap = false,
  instanceId,
  onEditorDidMount,
}: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const generatedId = useId();
  const uniqueId = instanceId || generatedId;
  const { setupMonaco, theme } = useShikiMonaco();

  const derivedFilename =
    filename ||
    (language === "typescript"
      ? "example.ts"
      : language === "python"
        ? "example.py"
        : "example.txt");

  useEffect(() => {
    logger.log(`CodeEditor update - ${derivedFilename}`, {
      id: uniqueId,
      codeSnippet: code?.substring(0, 100) + "...",
      language,
      editable,
      height,
      firstLine: code?.split("\n")[0],
    });
  }, [code, language, editable, height, uniqueId, derivedFilename]);

  const getMonacoLanguage = () => {
    switch (language) {
      case "typescript":
        return filename?.endsWith(".tsx") ? "typescript" : "typescript";
      case "python":
        return "python";
      default:
        return "plaintext";
    }
  };

  const monacoLanguage = getMonacoLanguage();
  const modelUri = `file:///${uniqueId}-${derivedFilename}`;

  // useEffect(() => {
  //   if (editorRef.current && code && isEditorMounted) {
  //     const currentValue = editorRef.current.getValue();
  //     if (currentValue !== code) {
  //       editorRef.current.setValue(code);
  //     }
  //   }
  // }, [code, isEditorMounted]);

  const handleEditorMount: OnMount = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    if (onEditorDidMount) {
      onEditorDidMount(editor);
    }

    if (language === "typescript") {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
        strict: true,
      });

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
    }

    await setupMonaco(monaco);

    const uri = monaco.Uri.parse(modelUri);

    const existingModel = monaco.editor.getModel(uri);
    if (existingModel) {
      logger.log(`Disposing existing model for ${modelUri}`);
      existingModel.dispose();
    }

    const model = monaco.editor.createModel(code || "", monacoLanguage, uri);

    editor.setModel(model);
    setIsEditorMounted(true);

    logger.log(`Using model for ${modelUri}`, {
      codePreview: code?.substring(0, 50),
      modelLanguage: model.getLanguageId(),
    });
  };

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

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
      data-language={language}
    >
      {derivedFilename && isEditorMounted && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {derivedFilename}
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">{language}</Badge>
            {editable && (
              <div className="text-xs text-green-600 dark:text-green-400 animate-pulse">
                Editable
              </div>
            )}
          </div>
        </div>
      )}

      <Editor
        height={height}
        language={monacoLanguage}
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
          tabSize: language === "python" ? 4 : 2,
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
});
