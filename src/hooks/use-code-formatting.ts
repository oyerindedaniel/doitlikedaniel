import { useCallback, useEffect, useRef, useState } from "react";
import { formatCode } from "@/utils/code-formatter";
import logger from "@/utils/logger";
import type * as Monaco from "monaco-editor";
import { CodeEditorProps } from "@/components/mdx/monaco-code-editor";

interface UseCodeFormattingProps
  extends Pick<CodeEditorProps, "editable" | "language" | "filename"> {
  initialCode: CodeEditorProps["defaultCode"];
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
  const [defaultCode, setDefaultCode] = useState(initialCode?.trim() || "");
  const isDefaultCodeFormatted = useRef(false);
  const pendingFormatRef = useRef(true);

  /**
   * Formats code using a custom formatter before the Monaco editor mounts.
   * Used instead of `editor.getAction('editor.action.formatDocument').run()` because initial code
   * needs to be formatted before the editor is initialized.
   */

  const formatAndSetCode = useCallback(
    async (defaultCode?: string) => {
      const codeToFormat = defaultCode ?? editorRef.current?.getValue();

      if (!codeToFormat || !codeToFormat.trim()) return;
      if (!pendingFormatRef.current) return;

      const formattedCode = await formatCode(codeToFormat.trim(), { language });

      if (codeToFormat.trim() !== formattedCode) {
        logger.debug(`Code was reformatted for ${filename || language}`, {
          id,
          formatted: true,
          language,
        });

        /**
         * Sets editor content directly after mount.
         * Avoids using React state, which would bind `value` prop —
         * causing Monaco to track and react to value changes on every render.
         * Direct `setValue` gives full control without triggering Monaco’s internal reactivity.
         */
        if (editorRef.current) {
          editorRef.current.setValue(formattedCode);
        }

        /**
         * On initial render, Monaco hasn't mounted yet — it ignores the initial unformatted code.
         * After mount-triggered side effects run.
         * Monaco will then use this state as `defaultValue` when it mounts.
         * Ensures the editor starts with formatted content without relying on reactive updates.
         */
        if (!isDefaultCodeFormatted.current && !editorRef.current) {
          setDefaultCode(formattedCode);
          isDefaultCodeFormatted.current = true;
        }
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

      if (editable) {
        pendingFormatRef.current = true;
      }
    },
    [editable]
  );

  return {
    defaultCode,
    formatAndSetCode,
    handleEditorDidMount,
    handleCodeChange,
    editorRef,
  };
}
