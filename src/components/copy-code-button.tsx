import { useCallback, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import logger from "@/utils/logger";
import { cn } from "@/lib/utils";

interface CopyCodeButtonProps extends ButtonProps {
  code: string;
}

export function CopyCodeButton({
  code,
  className,
  ...props
}: CopyCodeButtonProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      logger.error("Failed to copy code:", error);
    }
  }, [code]);

  return (
    <Button
      variant="gradient"
      size="sm"
      className={cn(
        "text-xs rounded px-3! py-1! w-fit h-fit opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
      onClick={handleCopy}
      {...props}
    >
      {isCopied ? (
        <span className="inline-flex items-center gap-1.5">
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          <span>Copied!</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
          <span>Copy</span>
        </span>
      )}
    </Button>
  );
}
