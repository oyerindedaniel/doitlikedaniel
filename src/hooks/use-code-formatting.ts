import { useCallback, useEffect, useRef, useState } from "react";
import { formatCode } from "@/utils/code-formatter";
import logger from "@/utils/logger";
import type * as Monaco from "monaco-editor";
import { CodeEditorProps } from "@/components/mdx/monaco-code-editor";

interface UseCodeFormattingProps
  extends Pick<CodeEditorProps, "editable" | "language" | "filename"> {
  initialCode: CodeEditorProps["code"];
  id: CodeEditorProps["instanceId"];
}

export function useCodeFormatting({
  initialCode,
  language,
  id,
  filename,
  editable = false,
}: UseCodeFormattingProps) {
  const [code, setCode] = useState(initialCode?.trim() || "");
  const [pendingFormat, setPendingFormat] = useState(false);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const formatAndSetCode = useCallback(
    async (codeToFormat: string) => {
      if (!codeToFormat) return;

      const formattedCode = await formatCode(codeToFormat.trim(), { language });
      if (codeToFormat.trim() !== formattedCode) {
        logger.debug(`Code was reformatted for ${filename || language}`, {
          id,
          formatted: true,
          language,
        });
      }
      setCode(formattedCode);
      setPendingFormat(false);
    },
    [filename, id, language]
  );

  useEffect(() => {
    if (initialCode?.trim()) {
      formatAndSetCode(initialCode);
    }
  }, [initialCode, formatAndSetCode]);

  const handleEditorDidMount = useCallback(
    (editor: Monaco.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;

      editor.onDidFocusEditorText(() => {
        // Editor gained focus
      });

      editor.onDidBlurEditorText(() => {
        // Format on blur if there are pending changes
        if (pendingFormat && editable) {
          const currentValue = editor.getValue();
          formatAndSetCode(currentValue);
        }
      });
    },
    [pendingFormat, formatAndSetCode, editable]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (!newCode) return;

      setCode(newCode);

      if (editable) {
        setPendingFormat(true);
      }
    },
    [editable]
  );

  return {
    code,
    setCode,
    formatAndSetCode,
    handleEditorDidMount,
    handleCodeChange,
    editorRef,
    pendingFormat,
    setPendingFormat,
  };
}
