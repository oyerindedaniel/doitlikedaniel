"use client";

import { ReactNode } from "react";

export interface CalloutBoxProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
}

export function CalloutBox({ children, title, icon }: CalloutBoxProps) {
  return (
    <div className="my-6 rounded-sm border-l-4 border-blue-500 bg-blue-50/50 p-4 dark:border-blue-700 dark:bg-blue-950/30">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        )}
        <div>
          {title && (
            <div className="mb-1 font-medium text-blue-800 dark:text-blue-300">
              {title}
            </div>
          )}
          <div className="text-sm leading-relaxed text-blue-800/90 dark:text-blue-300/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
