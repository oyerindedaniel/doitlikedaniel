import { ReactNode } from "react";

export interface MetaItemProps {
  icon: ReactNode;
  children: ReactNode;
}

export function MetaItem({ icon, children }: MetaItemProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  );
}
