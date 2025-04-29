import { useCallback, useEffect, useRef, useState } from "react";
import { formatCode } from "@/utils/code-formatter";
import logger from "@/utils/logger";
import type * as Monaco from "monaco-editor";
import { CodeEditorProps } from "@/components/mdx/monaco-code-editor";
import { useDebouncedCallback } from "./use-debounced-callback";

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
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState(initialCode?.trim() || "");
  const pendingFormatRef = useRef(true);

  /**
   * Formats code using a custom formatter before the Monaco editor mounts.
   * Used instead of `editor.getAction('editor.action.formatDocument').run()` because initial code
   * needs to be formatted before the editor is initialized.
   */

  const formatAndSetCode = useCallback(
    async (code?: string) => {
      const codeToFormat = code ?? editorRef.current?.getValue();

      if (!codeToFormat || !codeToFormat.trim()) return;
      if (!pendingFormatRef.current) return;

      const formattedCode = await formatCode(codeToFormat.trim(), { language });

      if (codeToFormat.trim() !== formattedCode) {
        logger.debug(`Code was reformatted for ${filename || language}`, {
          id,
          formatted: true,
          language,
        });

        setCode(formattedCode);
      }

      pendingFormatRef.current = false;
    },
    [filename, id, language]
  );

  useEffect(() => {
    (async () => {
      if (initialCode?.trim()) {
        await formatAndSetCode(initialCode);
      }
    })();
  }, [initialCode, formatAndSetCode]);

  const handleEditorDidMount = useCallback(
    (editor: Monaco.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;

      editor.onDidFocusEditorText(() => {
        // Editor gained focus
      });

      editor.onDidBlurEditorText(async () => {
        // Format on blur if there are pending changes
        if (pendingFormatRef.current && editable) {
          await formatAndSetCode();
        }
      });
    },
    [pendingFormatRef, editable, formatAndSetCode]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (!newCode) return;

      setCode(newCode);

      if (editable) {
        pendingFormatRef.current = true;
      }
    },
    [editable]
  );

  const debouncedHandleChange = useDebouncedCallback(handleCodeChange, 250);

  return {
    code,
    setCode,
    formatAndSetCode,
    handleEditorDidMount,
    handleCodeChange: debouncedHandleChange,
    editorRef,
  };
}
