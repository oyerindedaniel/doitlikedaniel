"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ScrollToTopProps {
  className?: string;
  tooltipText?: string;
  showAfterRatio?: number;
}

export function ScrollToTop({
  className,
  tooltipText = "Scroll to top",
  showAfterRatio = 0.9,
}: ScrollToTopProps) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isScrollable = documentHeight > windowHeight;

      if (!isScrollable) {
        setShow(false);
        return;
      }

      const scrolledRatio = (scrollTop + windowHeight) / documentHeight;
      setShow(scrolledRatio >= showAfterRatio);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterRatio]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Tooltip>
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 scale-100 hover:scale-105 transition-all duration-300 ease-in-out",
          show
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none",
          className
        )}
      >
        <TooltipTrigger asChild>
          <Button
            onClick={scrollToTop}
            size="icon"
            variant="gradient"
            className="h-12 w-12 rounded-full shadow-lg"
            aria-label={tooltipText}
          >
            <ArrowUpIcon className="h-5 w-5 animate-pulse-subtle" />
          </Button>
        </TooltipTrigger>
      </div>
      <TooltipContent className="text-xs" variant="gradient" side="left">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}
