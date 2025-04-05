"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the progress bar after a slight delay for a nice entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const updateProgress = () => {
      // Calculate how far the user has scrolled through the entire page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Total scrollable distance
      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight <= 0) {
        // Page is shorter than viewport
        setProgress(100);
        return;
      }

      // Calculate percentage scrolled (capped at 100%)
      const scrollPercentage = Math.min(
        100,
        (scrollTop / scrollableHeight) * 100
      );
      setProgress(scrollPercentage);

      // Show/hide progress bar based on scroll position
      if (scrollTop > 100) {
        setIsVisible(true);
      } else if (scrollTop < 50) {
        setIsVisible(false);
      }
    };

    // Update on scroll and resize
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      clearTimeout(timer);
    };
  }, []);

  const progressClasses = cn(
    "h-1 transition-all transform origin-left ease-out duration-300",
    "bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-purple-600",
    {
      "opacity-0 scale-x-0": !isVisible,
      "opacity-100 scale-x-100": isVisible,
    },
    className
  );

  const containerClasses = cn(
    "fixed top-0 left-0 w-full z-50 transition-opacity duration-300",
    !isVisible && "opacity-0",
    isVisible && "opacity-100"
  );

  return (
    <div className={containerClasses}>
      <div className={progressClasses} style={{ width: `${progress}%` }} />

      {/* Shadow effect */}
      <div
        className={cn(
          "h-4 bg-gradient-to-b from-black/5 to-transparent dark:from-black/10",
          {
            "opacity-0": !isVisible || progress < 5,
            "opacity-100": isVisible && progress >= 5,
          },
          "transition-opacity duration-300"
        )}
      />
    </div>
  );
}
