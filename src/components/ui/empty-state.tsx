import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  children: ReactNode;
  className?: string;
}

export function EmptyState({ children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-32 items-center justify-center text-sm text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
