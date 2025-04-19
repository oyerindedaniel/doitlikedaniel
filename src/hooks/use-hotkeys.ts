import { DependencyList, useEffect, useRef } from "react";

interface HotkeyOptions {
  enableOnFormElements?: boolean;
  enableOnContentEditable?: boolean;
}

type CallbackFn = (e: KeyboardEvent) => void;

/**
 * Hook to register global keyboard shortcuts
 *
 * @param keys Keyboard combination as a string, e.g. 'alt+shift+f'
 * @param callback Function to call when the hotkey is triggered
 * @param deps Dependencies array for the callback
 * @param options Additional options
 */
export function useHotkeys(
  keys: string,
  callback: CallbackFn,
  options: HotkeyOptions = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deps: DependencyList = []
) {
  const { enableOnFormElements = false, enableOnContentEditable = false } =
    options;

  const keysArray = keys.toLowerCase().split("+");
  const callbackRef = useRef<CallbackFn>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if focused on form elements and not enabled
      if (
        !enableOnFormElements &&
        (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement)
      ) {
        return;
      }

      // Skip if focused on contentEditable and not enabled
      if (
        !enableOnContentEditable &&
        e.target instanceof HTMLElement &&
        e.target.isContentEditable
      ) {
        return;
      }

      const modifiers = {
        alt: e.altKey,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        meta: e.metaKey,
      };

      const keyPressed = e.key.toLowerCase();

      let allKeysPressed = true;

      for (const key of keysArray) {
        if (key === "alt" && !modifiers.alt) allKeysPressed = false;
        else if (key === "ctrl" && !modifiers.ctrl) allKeysPressed = false;
        else if (key === "shift" && !modifiers.shift) allKeysPressed = false;
        else if (key === "meta" && !modifiers.meta) allKeysPressed = false;
        else if (
          !["alt", "ctrl", "shift", "meta"].includes(key) &&
          key !== keyPressed
        ) {
          allKeysPressed = false;
        }
      }

      if (allKeysPressed) {
        e.preventDefault();
        callbackRef.current(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keysArray, enableOnFormElements, enableOnContentEditable]);
}
