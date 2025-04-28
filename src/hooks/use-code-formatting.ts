import { useCallback, useEffect, useRef, useState } from "react";
import { formatCode } from "@/utils/code-formatter";
import logger from "@/utils/logger";
import type * as Monaco from "monaco-editor";
import { CodeEditorProps } from "@/components/mdx/monaco-code-editor";
import { getPlatformKeybinding } from "./use-platform";
import { usePlatform } from "./use-platform";
import { useLatestValue } from "./use-latest-value";

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
  const pendingFormatRef = useLatestValue(pendingFormat);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const platform = usePlatform();

  const formatAndSetCode = useCallback(
    async (code?: string) => {
      console.log("did reach here");
      const codeToFormat = code ?? editorRef.current?.getValue();

      if (!codeToFormat || !codeToFormat.trim()) return;

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
    (async () => {
      if (initialCode?.trim()) {
        await formatAndSetCode(initialCode);
      }
    })();
  }, [initialCode, formatAndSetCode]);

  const keybindings = getPlatformKeybinding(platform);

  console.log("pendingFormat", pendingFormat);

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

      console.log("bitch are");
      editor.addAction({
        id: "format-document",
        label: "Format Document",
        keybindings: keybindings.formatKeys,
        run: async () => {
          await formatAndSetCode();
        },
      });
    },
    [keybindings.formatKeys, pendingFormatRef, editable, formatAndSetCode]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (!newCode) return;

      console.log("in handleCodeChange");

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
